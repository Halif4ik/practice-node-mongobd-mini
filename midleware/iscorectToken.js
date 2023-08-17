const Tokens = require('csrf');
const Customer = require('../repositories/customer')

module.exports = async function (req, res, next) {
    const _csrfToken = req.body._csrf;
    const secretForCustomer = req.session.secretForCustomer;
    console.log("!!!currentDeveloper-", secretForCustomer);
    const secret = secretForCustomer;

    console.log("!!!_csrfToken-", _csrfToken);
    console.log("!!!secret-", secret);
    const tokens = new Tokens();
    const isCorect = tokens.verify(secret, _csrfToken);
    console.log("!!!true/false-", isCorect);

    if (!isCorect) {
        res.redirect('/auth#login');
    } else next();
}
