/*import {mainPageRoute} from "./routes/main";*/

const bodyParser = require('body-parser');
/*import bodyParser from 'body-parser'*/
const express = require('express');
const expHandleB = require('express-handlebars')
const exprApp = express()
const port = process.env.PORT || 3000
const mainPageRoute = require('./routes/main');
const cardRoute = require('./routes/card');
const allUPageRoute = require('./routes/all');
const addPageRoute = require('./routes/add');
const ordersRoute = require('./routes/orders');
const authPageRoute = require('./routes/auth');
const profileRoute = require('./routes/profine');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const varMiddlewareFunction = require('./midleware/authVar');
const customerAddMiddleware = require('./midleware/customerMidleware');
const allWrongRouts = require('./midleware/allWrongRouts');
var flash = require('connect-flash');
const {mongoURL} = require('./constants');
console.log('mongoURL',mongoURL);

const hbs = expHandleB.create({
    defaultLayout: 'index',
    extname: 'handlebars',
    helpers:require('./hbs-helpers')
});

const store = new MongoDBStore({
    uri: mongoURL,
    collection: 'mySessions'
});

exprApp.engine('hbs', hbs.engine);
exprApp.set('view engine', 'hbs');
exprApp.set('views', 'views');

exprApp.use(express.static(path.join(__dirname, 'public')))
exprApp.use('/uploads',express.static(path.join(__dirname, 'uploads')))
exprApp.use(express.urlencoded({extended: true}))
/*options*/
exprApp.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
}))
exprApp.use(varMiddlewareFunction);
/*add in req.customer cur Customer*/
exprApp.use(customerAddMiddleware);
exprApp.use(flash());

exprApp.use(bodyParser({}));
exprApp.use('/', mainPageRoute);
exprApp.use('/all', allUPageRoute);
exprApp.use('/add', addPageRoute);
exprApp.use('/card', cardRoute);
exprApp.use('/orders', ordersRoute);
exprApp.use('/auth', authPageRoute);
exprApp.use('/profile', profileRoute);

exprApp.use(allWrongRouts);


async function start() {
    try {
        await mongoose.connect(mongoURL, {useNewUrlParser: true});
        exprApp.listen(port, () => {
            console.log(`Example MYapp listening on port ${port}`)
        })
    } catch (e) {
        console.log(e)
    }
}
start();

/*start express App*/
