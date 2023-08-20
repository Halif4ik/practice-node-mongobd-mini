const {Router} = require('express');
const profileRoute = Router();
const isAuthUser = require('../midleware/isAuth');
const Customer = require('../repositories/customer')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E7) + file.originalname
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype.indexOf('image/') === 0) {
        cb(null, true)
    } else cb(null, false)
}

const upload = multer({storage: storage, fileFilter: fileFilter})
module.exports = profileRoute;

profileRoute.get('/', isAuthUser, async (req, res) => {
    let currentCustomer = req.customer;

    if (currentCustomer) res.render('profile', {
        title: `Profile ${currentCustomer.lastName}`,
        isProfile: true,
        customer: currentCustomer.toObject(),
    })
    else res.status(404).render('404', {
        title: "Error url"
    });
});

profileRoute.post('/', isAuthUser, upload.single('avatar'), async (req, res) => {
    try {
        const id = req.customer._id;
        const registeredCustomer = await Customer.findById(id);
        const customerWithNewFilds = {
            firstName: req.body.name.trim() || registeredCustomer.firstName,
            img: req.file && req.file.path || registeredCustomer.img
        }

        Object.assign(registeredCustomer, customerWithNewFilds);
        await registeredCustomer.save()

        res.status(202).redirect('/profile');
    } catch (e) {
        console.log(e);
    }
});

