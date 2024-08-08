const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', (req, res) => res.render('pages/home'));
router.get('/about', (req, res) => res.render('pages/about'));
router.get('/contact', (req, res) => res.render('pages/contact'));
router.get('/trainers', userController.getTrainersPage); 
router.get('/prices', userController.getPricesPage);
router.get('/add-trainer', userController.getAddTrainerPage);
router.get('/add-prices', userController.getAddPricesPage);
router.get('/login-register', userController.getloginregister)

module.exports = router;
