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
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
/*import bodyParser from 'body-parser'*/

const hbs = expHandleB.create({
    defaultLayout: 'index',
    extname: 'handlebars',
});

exprApp.engine('hbs', hbs.engine);
exprApp.set('view engine', 'hbs');
exprApp.set('views', 'views');

/*exprApp.use(express.static('public'))*/
exprApp.use(express.static(path.join(__dirname, 'public')))
exprApp.use(bodyParser({}));
exprApp.use('/', mainPageRoute);
exprApp.use('/all', allUPageRoute);
exprApp.use('/add', addPageRoute);
exprApp.use('/card', cardRoute);

async function start(){
    try {
        const link = 'mongodb+srv://chikibriki2:KQoDNhuWCigEleSS@cluster1.vhd57va.mongodb.net/Exchange_of_developers';
        await mongoose.connect(link,{useNewUrlParser: true});

        exprApp.listen(port, () => {
            console.log(`Example MYapp listening on port ${port}`)
        })
    }catch (e) {
        console.log(e)
    }
}
start();

/*start express App*/
