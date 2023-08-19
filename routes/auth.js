const {Router} = require('express');
const bcrypt = require('bcryptjs');
const authPageRoute = Router();
const Customer = require('../repositories/customer')
module.exports = authPageRoute;
const Tokens = require('csrf');
const constants = require('../constants');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
let count = 0;
const mailer = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: constants.SEND_GRID_API_KEY,
    }
}));


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
        await newCustomer.save();

        await mailer.sendMail({
            to: [email],
            from: constants.HOST_EMAIL,
            subject: `You ${first_name + " " + last_name} are registered on exchange of developers`,
            text: `Lorem ipsum dolor sit amet.`,
            html: `<h1>Thanks very match!</h1>
                    <p> You created account with this email- ${email}</p>
                    <hr/>
                    <a href="${constants.BASE_URL}">Our exchange of developers</a>
`
        }, function (err, res) {
            if (err) console.log('errsendMail-', err)
            console.log(`sendMail${count++}-`, res);
        });

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