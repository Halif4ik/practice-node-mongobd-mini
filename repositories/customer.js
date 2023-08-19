const {Schema, model} = require('mongoose');
const customerSchema = new Schema({
    email: {type: String, require: true},
    firstName: {type: String, require: true},
    password: {type: String, require: true},
    img: String,
    secret: String,
    lastName: String,
    cart: {
        items: [
            {
                count: {type: Number, require: true, default: 1},
                developerId: {type: Schema.Types.ObjectId, require: true, ref: 'User'},
            }
        ],

    }
});

customerSchema.methods.addToCart = function (currentDeveloper) {
    const clonedCusmomersItems = this.cart.items.concat();
    /*console.log('clonedCusmomersItems', clonedCusmomersItems);*/
    const idx = clonedCusmomersItems.findIndex(currentCustomer => currentCustomer.developerId.toString() === currentDeveloper._id.toString())
    if (idx >= 0) clonedCusmomersItems[idx].count++;
    else clonedCusmomersItems.push({developerId: currentDeveloper._id, count: 1,});

    const newCart = {items: clonedCusmomersItems}
    this.cart = newCart;
    return this.save();
}

customerSchema.methods.decreaseFromCart = function (developerId) {
    const clonedCusmomersItems = this.cart.items.concat();
    /*console.log('clonedCusmomersItems', clonedCusmomersItems);*/
    const idx = clonedCusmomersItems.findIndex(currentCustomer => {
        return currentCustomer.developerId.toString() === developerId
    });

    /*with out check idf user send delete request with wrong id becouse from form fetch send string*/
    if (clonedCusmomersItems[idx].count > 1) clonedCusmomersItems[idx].count--;
    else clonedCusmomersItems.splice(idx, 1);

    const newCart = {items: clonedCusmomersItems}
    this.cart = newCart;
    return this.save();
}
customerSchema.methods.clearCart = function () {
    this.cart.items = [];
    return this.save();
}


module.exports = model('Customer', customerSchema);