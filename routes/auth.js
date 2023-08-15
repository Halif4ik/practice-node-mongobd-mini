const {Router} = require('express');
const authPageRoute = Router();
module.exports = authPageRoute;


authPageRoute.get('/', (req, res) => {
    res.render('auth/login',{
        title:"Authentication",
        isLogin: true,
    })
})