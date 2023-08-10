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
const path = require('path');
const mongoose = require('mongoose');
const Customer = require('./repositories/customer')
const {Schema} = require("mongoose");

const hbs = expHandleB.create({
    defaultLayout: 'index',
    extname: 'handlebars',
});

exprApp.engine('hbs', hbs.engine);
exprApp.set('view engine', 'hbs');
exprApp.set('views', 'views');

exprApp.use(async (req, res, next)=>{
    try {
        const customer = await Customer.findById('64d4a9f4456b3a9882c74758');
        req.customer = customer;
        next();
    }catch (e) {
        console.log(e);
    }

})
/*exprApp.use(express.static('public'))*/
exprApp.use(express.static(path.join(__dirname, 'public')))
exprApp.use(bodyParser({}));
exprApp.use('/', mainPageRoute);
exprApp.use('/all', allUPageRoute);
exprApp.use('/add', addPageRoute);
exprApp.use('/card', cardRoute);

async function start() {
    try {
        const link = 'mongodb+srv://chikibriki2:KQoDNhuWCigEleSS@cluster1.vhd57va.mongodb.net/Exchange_of_developers';
        await mongoose.connect(link, {useNewUrlParser: true});
        const candidate = await Customer.findOne();
        if (!candidate) {
            const customer = new Customer({
                email: 'test@gmail.test',
                firstName: "Best Guy",
                cart: {items: []}
            });
            await customer.save();
        }
        exprApp.listen(port, () => {
            console.log(`Example MYapp listening on port ${port}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start();

/*start express App*/
