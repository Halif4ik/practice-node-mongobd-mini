const Tokens = require('csrf');

module.exports = async function (req, res, next) {
    const _csrfToken = req.body._csrf;
    const XSRF = req.headers['x-xcsrf'];
    const token = _csrfToken ? _csrfToken : XSRF;

    const tokens = new Tokens();
    const isCorect = tokens.verify(req.session.secretForCustomer, token);

    if (!isCorect) {
        res.status(404).redirect('/auth#login');
    } else next();
}
