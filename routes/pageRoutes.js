const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Existing routes
router.get('/', (req, res) => res.render('pages/home'));
router.get('/about', userController.getAboutPage);
router.get('/contact', (req, res) => res.render('pages/contact'));
router.get('/trainers', userController.getTrainersPage);
router.get('/prices', userController.getPricesPage);
router.get('/add-trainer', userController.getAddTrainerPage);
router.get('/add-prices', userController.getAddPricesPage);
router.get('/login-register', authController.getLoginRegisterPage);
router.get('/thankyou', (req, res) => res.render('pages/thankyou'));

// Contact form submission
router.post('/contact', userController.handleContactForm);

// Purchased page
router.get('/purchased', (req, res) => {
    res.render('pages/purchased', {
        type: req.query.type,
        amount: req.query.amount
    });
});

module.exports = router;
