module.exports = function (req, res, next) {
    /*handlebars can take from locals*/
    res.locals.isAuth = req.session.isAuthenticated;
    next();
}