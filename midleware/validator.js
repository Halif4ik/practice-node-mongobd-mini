const Customer = require('../repositories/customer')
const {body, query, validationResult, check} = require('express-validator');
/*import {body,query, validationResult} from 'express-validator'*/

exports.emailValidInBodyMiddleware = function () {
    return body('email').isEmail().withMessage("Email should be email").custom(async (valueEmail, {req}) => {
        if (await Customer.findOne({email:valueEmail})) {
            throw new Error('E-mail already in use');
        }
    });
}

exports.passwordValidInBodyMiddleware = function () {
    return body('password', "Password should has characters or numbers should be longer 5").trim().isLength({
        min: 6,
        max: 20
    }).isAlphanumeric().withMessage("Password should be longer 5 characters");
}

exports.confirmValidInBodyMidl = function () {
    return body('confirm').custom(async (valueConrfirm, {req}) => {
        req.body['password'].equals(valueConrfirm);
    }).withMessage("Password and confirm password should be equals");
}

/*exports.confirmValidInBodyMidl = function () {
    return body('confirm').custom(async (valueConrfirm, {req}) => {
        if (req.body.password !== (valueConrfirm)) throw new Error('Password and confirm password should be equals');
        return true;
    });
}*/

exports.urlValidMiddleware = function () {
    return query('person').isLength({min: 3, max: 100}).escape().withMessage("Query should be 3 ");
}
exports.titleValidInBodyMiddleware = function () {
    return body('img').escape().withMessage("Image is not place for scripts");
}
exports.checkValidationInMiddleWare = function (req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) next();
    else {
        req.flash('wrong form', errors.array()[0]['msg']);
        res.status(422).redirect('/auth#register');
        /*res.status(422).send({errors: errors.array()});*/
    }
}