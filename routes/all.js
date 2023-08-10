const {Router} = require('express');
const allUPageRoute = Router();
module.exports = allUPageRoute;
/*import {body, validationResult} from 'express-validator'*/
const {params, validationResult} = require('express-validator');
const UserRepository = require('../repositories/user-repositary');


allUPageRoute.get('/', async (req, res) => {
    const arrAllUsers = await UserRepository.find({}).populate('userId','email firstName').select('email firstName price img').lean();

    res.render('all', {
        title: "About",
        isAllUsers: true,
        arrAllUsers: arrAllUsers,
    })
});

allUPageRoute.get('/:ID/edit', async (req, res) => {
    const allow = req.query.allow;
    const reqProdID = req.params.ID;
    if (!allow) return res.redirect('/');

    let foundUser = await UserRepository.findById(reqProdID).lean();
    res.render('userEdit', {
        title: `Changing ${foundUser.lastName}`,
        user: foundUser,
    })
});

allUPageRoute.post('/edit/:ID', async (req, res) => {
    const reqProdID = req.params.ID;
    try {
        await UserRepository.deleteOne({_id: reqProdID});
        res.status(201).redirect('/all');
    } catch (e) {
        console.log(e)
    }
});

/*post edit user res.status(202).send(changedUser).redirect('/all'); */
allUPageRoute.post('/edit', async (req, res) => {
    const reqBody = req.body;
    const id = reqBody.id;
    delete reqBody.id
    const changedUser = await UserRepository.findByIdAndUpdate(id, reqBody);
    res.status(201).redirect('/all');

})

allUPageRoute.get('/:ID', async (req, res) => {
    const reqProdID = req.params.ID;
    let foundUser = await UserRepository.findById(reqProdID).lean();
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