const Tokens = require('csrf');

module.exports = async function (req, res, next) {
    /*handlebars can take from locals*/
    res.locals.isAuth = req.session.isAuthenticated;

    if (res.locals.isAuth) {
        const tokens = new Tokens();
        const secret = req.session.secretForCustomer;
        console.log('secret-', secret);
        const tokenSentToFront = await tokens.create(secret);
        console.log('tokenSentToFront-', tokenSentToFront);

        res.locals.tokenSentToFront = tokenSentToFront;
    }

    next();
}