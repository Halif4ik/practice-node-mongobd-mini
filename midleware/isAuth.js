module.exports = function (req, res, next) {
    if (!req.session.isAuthenticated) {
        console.log('Nea-',req.session.isAuthenticated);
        res.redirect('/auth#login');
    } else next();
}

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