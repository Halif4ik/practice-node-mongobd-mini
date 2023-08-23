const {Router} = require('express');
const cardRoute = Router({});
/*export const allProductsRoute = Router({})*/
const userRepository = require('../repositories/user-repositary');
const isAuthUser= require('../midleware/isAuth');
const isCorrectToken= require('../midleware/iscorectToken');

cardRoute.post('/add',isAuthUser,isCorrectToken, async (req, res) => {
    const reqBody = req.body;
    const currentDeveloper = await userRepository.findById(reqBody.id).lean();

    await req.customer.addToCart(currentDeveloper);
    res.redirect('/card');

})

cardRoute.get('/', isAuthUser,async (req, res) => {
    /*console.log('path-',path.join(__dirname, 'public'));
     console.log('11customerCartItems-', customerCart.cart.items);*/
    const customerCart = await req.customer.populate('cart.items.developerId');

    let totalPrice = 0;
    const developers = customerCart.cart.items.map((oneDevInCustomerCart) => {
        totalPrice += oneDevInCustomerCart.count * oneDevInCustomerCart.developerId.price;
        return {
            count: oneDevInCustomerCart.count,
            firstName: oneDevInCustomerCart.developerId.firstName,
            price: oneDevInCustomerCart.developerId.price,
            img: oneDevInCustomerCart.developerId.img,
            email: oneDevInCustomerCart.developerId.email,
            lastName: oneDevInCustomerCart.developerId.lastName,
            developerId: oneDevInCustomerCart.developerId._id,
        }
    });

    res.render('card', {
        title: "Card",
        isCard: true,
        users: developers,
        price: totalPrice,
    })
});

cardRoute.delete('/:ID', isAuthUser,isCorrectToken, async (req, res) => {
    try {
        const developerId = req.params.ID;
        await req.customer.decreaseFromCart(developerId);
        /*take .developerId from users ant pastete all filds in customer field*/
        const customerCart = await req.customer.populate('cart.items.developerId');

        let totalPrice = 0;
        const developers = customerCart.cart.items.map((oneDevInCustomerCart) => {
            totalPrice += oneDevInCustomerCart.count * oneDevInCustomerCart.developerId.price;
            return {
                count: oneDevInCustomerCart.count,
                firstName: oneDevInCustomerCart.developerId.firstName,
                price: oneDevInCustomerCart.developerId.price,
                img: oneDevInCustomerCart.developerId.img,
                email: oneDevInCustomerCart.developerId.email,
                lastName: oneDevInCustomerCart.developerId.lastName,
                developerId: oneDevInCustomerCart.developerId._id,
            }
        });

        res.send({
            users: developers,
            totalPrice: totalPrice,
        })
    } catch (e) {
        res.sendStatus(404)
    }


});
module.exports = cardRoute;