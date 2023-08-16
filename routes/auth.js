const {Router} = require('express');
const authPageRoute = Router();
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
    req.session.isAuthenticated = true;
    res.redirect('/')
})
/*2-Y*/
authPageRoute.get('/logout', async (req, res) => {
    req.session.isAuthenticated = true;
    res.redirect('/')
})