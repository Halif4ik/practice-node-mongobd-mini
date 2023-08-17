const Customer = require('../repositories/customer');

module.exports = async function (req, res, next) {
    if (!req.session.customer) next()
    else {
        req.customer = await Customer.findById(req.session.customer._id);
        next();
    }
}