/*import {Router} from "express";*/
const {Router} = require('express');
const Order = require('../repositories/order')
const isAuthUser = require('../midleware/isAuth');
const isCorrectToken = require('../midleware/iscorectToken');

const ordersRoute = Router();
module.exports = ordersRoute;
/*export const ordersRoute = Router({});*/

ordersRoute.get('/', isAuthUser, async (req, res) => {
    try {
        const customerId = req.customer._id;
        const customerOrder = await Order.find({'customer.customerId': customerId}).populate('customer.customerId').lean();

        const changedOrders = customerOrder.map(oneOrder => {
            return {
                totalSum: oneOrder.developers.reduce((accumulator, oneDeveloper) => {
                    return accumulator + (oneDeveloper.count * oneDeveloper.developer.price);
                }, 0),
                customer: {...oneOrder.customer.customerId},
                customerOld: oneOrder.customer,
                developers: oneOrder.developers,
                date: oneOrder.date,
                _id: oneOrder._id,
            }
        });
        /* as work .populate console.log('changedOrders-', changedOrders);*/

        res.render('orders', {
            title: "Orders",
            isOrders: true,
            orders: changedOrders
        })
    } catch (e) {
        console.log(e);
    }
});

ordersRoute.post('/', isAuthUser,isCorrectToken, async (req, res) => {
    try {
        const customerCart = await req.customer.populate('cart.items.developerId');

        const customerCartItemsDev = customerCart.cart.items.map(developerFromCart => {
            return {
                count: developerFromCart.count,
                developer: {...developerFromCart.developerId}
                /* if with out rest we copy mongose copy only ObjId('64d36f71ec81627a78923b72')*/
            }
        })
        /* console.log('!2-',customerCartItemsDev);*/
        const order = new Order({
            developers: customerCartItemsDev,
            customer: {
                name: req.customer.firstName,
                customerId: req.customer
            }
        });
        await order.save()
        await req.customer.clearCart();

        res.redirect('/orders')
    } catch (e) {
        console.log(e);
    }
});