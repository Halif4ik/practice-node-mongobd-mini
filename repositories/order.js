const {Schema, model} = require('mongoose');

const orderSchema = new Schema({
    developers: [{
        developer: {type: Object, require: true},
        count: {type: Number, require: true}
    },],
    customer: {
        name: String,
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            require: true
        }
    },
    date: {type: Date, default: Date.now},
});


module.exports = model('Order', orderSchema);