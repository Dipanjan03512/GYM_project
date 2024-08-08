const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

// Add Trainer Routes
router.get('/add-trainer', adminController.getAddTrainerPage);
router.post('/add-trainer', upload.single('photo'), adminController.addTrainer);
router.get('/edit-trainer/:id', adminController.getEditTrainerPage);
router.post('/edit-trainer/:id', upload.single('photo'), adminController.editTrainer);

// Add Prices Routes
router.get('/add-prices', adminController.getAddPricesPage);
router.post('/add-prices', adminController.addPrices);
router.get('/edit-prices/:id', adminController.getEditPricesPage);
router.post('/edit-prices/:id', adminController.editPrices);

module.exports = router;
