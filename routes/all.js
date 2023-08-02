const {Router} = require('express');
const allUPageRoute = Router();
module.exports = allUPageRoute;
/*import {body, validationResult} from 'express-validator'*/
const {params, validationResult} = require('express-validator');
const userRepository = require('../repositories/user-repositary');


allUPageRoute.get('/', async (req, res) => {
    const parsedAllUser = await userRepository.getAllFromBd();
    res.render('all', {
        title: "About",
        isAbout: true,
        arrAllUsers: parsedAllUser,
    })
});

allUPageRoute.get('/:ID/edit', async (req, res) => {
    const allow = req.query.allow;
    const reqProdID = req.params.ID;
    if (!allow) return res.redirect('/');

    let foundUser = await userRepository.getFromBdByID(reqProdID);
    res.render('userEdit', {
        title: `Changing ${foundUser.lastName}`,
        user: foundUser,
    })
});

/*post edit user res.status(202).send(changedUser).redirect('/all'); */
allUPageRoute.post('/edit', async (req, res) => {
    const reqBody = req.body;
    const changedUser = await userRepository.updateUser(reqBody.first_name, reqBody.last_name, reqBody.price,reqBody.email,reqBody.img,reqBody.id);
    res.status(201).redirect('/all');

})

allUPageRoute.get('/:ID', async (req, res) => {
    const reqProdID = req.params.ID;
    let foundUser = await userRepository.getFromBdByID(reqProdID);
    foundUser ? res.render('singleDev', {
        layout: 'empty',
        title: foundUser.lastName,
        user: foundUser,
    }) : res.sendStatus(404)
});

function titleValidMiddleware() {
    return params().trim().isLength({min: 36, max: 36}).escape().withMessage("Wrong user ID");
}

function checkValidationInMiddleWare(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
    } else {
        res.status(400).send({errors: errors.array()});
    }
}