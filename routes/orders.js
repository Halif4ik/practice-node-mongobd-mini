/*import {Router} from "express";*/
/*"type": "module" import/require */
const {Router} = require('express');
const Order = require('../repositories/order')

const ordersRoute = Router();
module.exports = ordersRoute;
/*export const ordersRoute = Router({});*/

ordersRoute.get('/', (req, res) => {
    res.render('orders', {
        title: "Orders",
        isOrders: true,
        orders: 45
    })
});

ordersRoute.post('/', async (req, res) => {
try{
    const customerCart = await req.customer.populate('cart.items.developerId');

    const customerCartItemsDev = customerCart.cart.items.map(developerFromCart => {
        return {
            count: developerFromCart.count,
            developer: {...developerFromCart.developerId} /* if with out rest we copy mongose copy only ObjId('64d36f71ec81627a78923b72')*/
        }
    })
    console.log('!2-',customerCartItemsDev);

    const order = new Order({
        developers:customerCartItemsDev,
        customer:{
            name:req.customer.firstName,
            customerId: req.customer
        }
    });
    await order.save()
    await req.customer.clearCart();

    res.redirect('/orders')
}catch (e) {
    console.log(e);
}

})