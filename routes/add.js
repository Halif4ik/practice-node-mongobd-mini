const {Router} = require('express');
const addPageRoute = Router();
module.exports = addPageRoute;

/*import {productsRepository} from "../repositories/user-repositary";*/
const userRepository = require('../repositories/user-repositary');

addPageRoute.get('/', (req, res) => {
    res.render('add',{
        title:"Add User",
        isAbout: true,
    })
})

addPageRoute.post('/', async (req, res) => {
    /*const headers = req.headers;*/
    const reqBody = req.body;
    const newProd = await userRepository.createProduct(reqBody.first_name, reqBody.last_name, reqBody.price,reqBody.email,reqBody.img);

    res.status(200).send(newProd).redirect('/');

})
