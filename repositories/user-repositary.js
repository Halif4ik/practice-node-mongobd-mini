const {Schema, model} = require('mongoose');
const userRepository = new Schema({
    firstName: {type: String, require: true},
    price: {type: Number, require: true},
    img: String,
    email: String,
    lastName: String,
});

module.exports = model('User', userRepository);