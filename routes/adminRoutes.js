const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Adjust according to your multer configuration

// Route for the dashboard
router.get('/dashboard', adminController.dashboard);

// Route for adding a price
router.get('/addPrice', adminController.getAddPrice);
router.post('/addPrice', upload.single('image'), adminController.postAddPrice);

// Route for editing a price
router.get('/editPrice/:id', adminController.getEditPrice);
router.post('/editPrice/:id', upload.single('image'), adminController.postEditPrice);

// Route for deleting a price
router.delete('/deletePrice/:id', adminController.deletePrice);

// Route for adding a trainer
router.get('/addTrainer', adminController.getAddTrainer);
router.post('/addTrainer', upload.single('photo'), adminController.postAddTrainer); 

// Route for editing a trainer
router.get('/editTrainer/:id', adminController.getEditTrainer);
router.post('/editTrainer/:id', upload.single('image'), adminController.postEditTrainer);

// Route for deleting a trainer
router.delete('/deleteTrainer/:id', adminController.deleteTrainer);

module.exports = router;
