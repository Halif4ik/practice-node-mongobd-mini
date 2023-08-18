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
        errorReg: req.flash('wrong registered'),
        errorLog: req.flash('wrong login'),
    })
})

/*register new usver*/
authPageRoute.post('/register', async (req, res) => {
    const {first_name, last_name, email, password, img} = req.body;

    if (await Customer.findOne({email})) {
        req.flash('wrong registered', 'User with this email was register')
        res.redirect('/auth#login');
        return;
    }
    /*create secret kay and token for hidden filds in forms*/
    const tokens = new Tokens();
    const secretForCustomer = await tokens.secret();
    req.session.secretForCustomer = secretForCustomer;

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


    if (registeredCustomer && await bcrypt.compare(password, registeredCustomer.password)) {
        req.session.customer = registeredCustomer;
        req.session.isAuthenticated = true;

        req.session.secretForCustomer = registeredCustomer.secret;

        req.session.save(err => {
            if (err) {
                console.log('Error with save user-', err);
                throw err;
            }
            res.redirect('/')
        });
    } else {
        registeredCustomer ? req.flash('wrong login', 'Wrong password') : req.flash('wrong login', 'Wrong email')
        res.redirect('/auth#login');
    }
})

authPageRoute.get('/logout', async (req, res) => {
    /*req.session.isAuthenticated = false;*/
    req.session.destroy(() => {
        res.redirect('/auth#login')
    });

})