const {Router} = require('express');
const allUPageRoute = Router();
module.exports = allUPageRoute;
const UserRepository = require('../repositories/user-repositary');
const isAuthUser = require('../midleware/isAuth');


allUPageRoute.get('/', async (req, res) => {
    const arrAllUsers = await UserRepository.find({}).populate('userId', 'email firstName').select('email firstName price img').lean();
    /*console.log('req.sessionis-', req.session.customer);
    console.log('req-', req.customer);
    .toObject() === .lean()*/

    res.render('all', {
        title: "About",
        isAllUsers: true,
        arrAllUsers: arrAllUsers,
    })
});

allUPageRoute.get('/:ID/edit', isAuthUser, async (req, res) => {
    const allow = req.query.allow;
    const reqProdID = req.params.ID;
    if (!allow) return res.redirect('/');

    let foundUser = await UserRepository.findById(reqProdID).lean();
    res.render('userEdit', {
        title: `Changing ${foundUser.lastName}`,
        user: foundUser,
    })
});
/*delete developer*/
allUPageRoute.post('/edit/:ID', isAuthUser, async (req, res) => {
    const reqProdID = req.params.ID;
    try {
        await UserRepository.deleteOne({_id: reqProdID});
        res.status(201).redirect('/all');
    } catch (e) {
        console.log(e)
    }
});

/*post edit user res.status(202).send(changedUser).redirect('/all'); */
allUPageRoute.post('/edit', isAuthUser, async (req, res) => {
    const reqBody = req.body;
    const id = reqBody.id;
    delete reqBody.id
    const changedUser = await UserRepository.findByIdAndUpdate(id, reqBody);
    res.status(201).redirect('/all');

})

allUPageRoute.get('/:ID', async (req, res) => {
    const reqProdID = req.params.ID;
    let foundUser = await UserRepository.findById(reqProdID).lean();
    foundUser ? res.render('singleDev', {
        layout: 'empty',
        title: foundUser.lastName,
        user: foundUser,
    }) : res.sendStatus(404)
});

