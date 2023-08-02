const {Router} = require('express');
const cardRoute = Router({});
const Card = require('../repositories/card');
const userRepository = require('../repositories/user-repositary');
/*export const allProductsRoute = Router({})*/

/* res.status(200).send(newProd).redirect('/');*/
cardRoute.post('/add', async (req, res) => {
    const reqBody = req.body;
    const currentUser = await userRepository.getFromBdByID(reqBody.id);
    const normalAdded = await Card.add(currentUser);

    normalAdded ? res.status(200).redirect('/card') : res.status(404).send(currentUser);

})

cardRoute.get('/', async (req, res) => {
    let card = await Card.fetch();
    res.render('card', {
        title: "Card",
        isCard: true,
        card: card,
    })
});

module.exports = cardRoute;