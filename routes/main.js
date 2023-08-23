/*import {Router} from "express";*/
/*"type": "module" import/require */
const {Router} = require('express');

const mainPageRoute = Router();
module.exports = mainPageRoute;
/*export const mainPageRoute = Router({});*/

mainPageRoute.get('/', (req, res) => {
    res.render('main', {
        title: "Main page",
        isHome: true,
    })
})