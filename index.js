const express = require('express');
const expHandleB = require('express-handlebars')
const exprApp = express()
const port = process.env.PORT || 3000

const hbs = expHandleB.create({
    defaultLayout: 'index',
    extname:'handlebars',
});

exprApp.engine('hbs',hbs.engine);
exprApp.set('view engine', 'hbs');
exprApp.set('views','views');

exprApp.use(express.static('public'))
exprApp.get('/', (req , res) => {
    res.render('index',{
        title:"Main page",
        isHome: true,
    })
});

exprApp.get('/about', (req, res) => {
    res.render('about',{
        title:"About",
        isAbout: true,
    })
});
exprApp.get('/add', (req, res) => {
    res.render('add',{
        title:"Java script",
        isJS: true,
    })
});

/*start express App*/
exprApp.listen(port, () => {
    console.log(`Example MYapp listening on port ${port}`)
})