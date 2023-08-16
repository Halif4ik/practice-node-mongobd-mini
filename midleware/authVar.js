module.exports = function (req, res, next) {
    /*handlebars take from locals*/
    res.locals.isAuth = req.session.isAuthenticated;
    next();
}