const {Router} = require('express');
const bcrypt = require('bcryptjs');
const authPageRoute = Router();
const Customer = require('../repositories/customer')
module.exports = authPageRoute;
const Tokens = require('csrf');

authPageRoute.get('/', (req, res) => {
    res.render('auth/login', {
        title: "Authentication",
        isLogin: true,
    })
})
/*register new usver*/
authPageRoute.post('/register', async (req, res) => {
    const {first_name, last_name, email, password, img} = req.body;

    if (await Customer.findOne({email})) {
        res.redirect('/auth#login');
        return;
    }
    /*create secret kay and token for hidden filds in forms*/
    const tokens= new Tokens();
    const secretForCustomer = await tokens.secret();
    req.session.secretForCustomer = secretForCustomer;
    console.log('register-', secretForCustomer);

    const newCustomer = new Customer({
        firstName: first_name,
        lastName: last_name,
        email,
        password: await bcrypt.hash(password, 10),
        img,
        cart: {items: []},
        secret: secretForCustomer
    });
    try {
        await newCustomer.save()
        res.redirect('/all');
    } catch (e) {
        console.log(e);
    }
})

authPageRoute.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const registeredCustomer = await Customer.findOne({email});
    const isHashedPasswordEqual = await bcrypt.compare(password, registeredCustomer.password);


    if (registeredCustomer && isHashedPasswordEqual ) {
        req.session.customer = registeredCustomer;
        req.session.isAuthenticated = true;

        req.session.secretForCustomer = registeredCustomer.secret;
        console.log('Login-', registeredCustomer.secret);

        req.session.save(err => {
            if (err) {
                console.log('Error with save user-', err);
                throw err;
            }
            res.redirect('/')
        });


    } else res.redirect('/auth#register');

})

authPageRoute.get('/logout', async (req, res) => {
    /*req.session.isAuthenticated = false;*/
    req.session.destroy(() => {
        res.redirect('/auth#login')
    });

})