const {Router} = require('express');
const aboutPageRoute = Router();
module.exports = aboutPageRoute;

aboutPageRoute.get('/', (req, res) => {
    res.render('about',{
        title:"About",
        isAbout: true,
    })
})