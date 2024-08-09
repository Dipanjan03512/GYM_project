const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Existing routes
router.get('/', (req, res) => res.render('pages/home'));
router.get('/about', userController.getAboutPage);
router.get('/contact', (req, res) => res.render('pages/contact'));
router.get('/trainers', userController.getTrainersPage);
router.get('/prices', userController.getPricesPage);
router.get('/add-trainer', userController.getAddTrainerPage);
router.get('/add-prices', userController.getAddPricesPage);
router.get('/login-register', userController.getloginregister);
router.get('/thankyou', (req, res) => res.render('pages/thankyou'));
router.post('/contact', userController.handleContactForm);

module.exports = router;
