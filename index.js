/*import {mainPageRoute} from "./routes/main";*/

const express = require('express');
const expHandleB = require('express-handlebars')
const exprApp = express()
const port = process.env.PORT || 3000
const mainPageRoute = require('./routes/main');
const aboutPageRoute = require('./routes/about');
const addPageRoute = require('./routes/add');
const bodyParser = require('body-parser');
/*import bodyParser from 'body-parser'*/

const hbs = expHandleB.create({
    defaultLayout: 'index',
    extname:'handlebars',
});

exprApp.engine('hbs',hbs.engine);
exprApp.set('view engine', 'hbs');
exprApp.set('views','views');

exprApp.use(express.static('public'))
exprApp.use(bodyParser({}));
exprApp.use('/', mainPageRoute);
exprApp.use('/about', aboutPageRoute);
exprApp.use('/add', addPageRoute);


/*start express App*/
exprApp.listen(port, () => {
    console.log(`Example MYapp listening on port ${port}`)
})