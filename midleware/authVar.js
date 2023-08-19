const Tokens = require('csrf');

module.exports = async function (req, res, next) {
    /*handlebars can take from locals*/
    res.locals.isAuth = req.session.isAuthenticated;

    if (res.locals.isAuth) {
        const tokens = new Tokens();
        const secret = req.session.secretForCustomer;
        const tokenSentToFront = await tokens.create(secret);

        res.locals.tokenSentToFront = tokenSentToFront;
    }

    next();
}