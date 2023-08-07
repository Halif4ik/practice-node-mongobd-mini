const {Router} = require('express');
const addPageRoute = Router();
module.exports = addPageRoute;

/*import {productsRepository} from "../repositories/user-repositary";*/
const userRepository = require('../repositories/user-repositary');

addPageRoute.get('/', (req, res) => {
    res.render('add',{
        title:"Add User",
        isAdd: true,
    })
})

addPageRoute.post('/', async (req, res) => {
    /*const headers = req.headers;*/
    const reqBody = req.body;
    const newUserRepoz =  new userRepository({
        firstName: reqBody.first_name,
        price: reqBody.price,
        img: reqBody.img,
        email: reqBody.email,
        lastName: reqBody.last_name,
    });

    try {
        await newUserRepoz.save()
        res.status(200).redirect('/');
    }catch (e){
        console.log(e);
    }


})
