const {Router} = require('express');
const authPageRoute = Router();
const Customer = require('../repositories/customer')
module.exports = authPageRoute;


authPageRoute.get('/', (req, res) => {
    res.render('auth/login', {
        title: "Authentication",
        isLogin: true,
    })
})

authPageRoute.post('/register', async (req, res) => {

    req.session.isAuthenticated = true;
    res.redirect('/')
})

authPageRoute.post('/login', async (req, res) => {
    req.session.customer = await Customer.findById('64d4a9f4456b3a9882c74758');
    req.session.isAuthenticated = true;

    req.session.save(err => {
        if (err) {
            console.log('Error with save user-',err);
            throw err;
        }
        res.redirect('/')
    });

})
authPageRoute.get('/logout', async (req, res) => {
    /*req.session.isAuthenticated = false;*/
    req.session.destroy(() => {
        res.redirect('/auth#login')
    });

})