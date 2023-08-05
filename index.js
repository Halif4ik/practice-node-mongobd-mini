/*import {mainPageRoute} from "./routes/main";*/

const express = require('express');
const expHandleB = require('express-handlebars')
const exprApp = express()
const port = process.env.PORT || 3000
const mainPageRoute = require('./routes/main');
const cardRoute = require('./routes/card');
const allUPageRoute = require('./routes/all');
const addPageRoute = require('./routes/add');
const path = require('path');
const bodyParser = require('body-parser');
/*import bodyParser from 'body-parser'*/

const hbs = expHandleB.create({
    defaultLayout: 'index',
    extname:'handlebars',
});

exprApp.engine('hbs',hbs.engine);
exprApp.set('view engine', 'hbs');
exprApp.set('views','views');

/*exprApp.use(express.static('public'))*/
exprApp.use(express.static(path.join(__dirname,'public')))
exprApp.use(bodyParser({}));
exprApp.use('/', mainPageRoute);
exprApp.use('/all', allUPageRoute);
exprApp.use('/add', addPageRoute);
exprApp.use('/card', cardRoute);


/*start express App*/
exprApp.listen(port, () => {
    console.log(`Example MYapp listening on port ${port}`)
})