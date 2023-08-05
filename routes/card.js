const {Router} = require('express');
const cardRoute = Router({});
const Card = require('../repositories/card');
const path = require('path');
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
    /*console.log('path-',path.join(__dirname, 'public'));*/
    let card = await Card.fetsh();
    res.render('card', {
        title: "Card",
        isCard: true,
        card: card,
    })
});
cardRoute.delete('/:ID', async (req, res) => {
    const uriProdID = req.params.ID;
    const changedCard = await Card.deleteProduct(uriProdID);
    changedCard ? res.status(200).send(changedCard) : res.sendStatus(404)
});

module.exports = cardRoute;