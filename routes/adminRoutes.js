const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const multer = require('../config/multer'); // Assuming you have multer configuration here

// Dashboard
router.get('/dashboard', ensureAuthenticated, adminController.dashboard);

// Add Price
router.get('/addPrice', ensureAuthenticated, adminController.getAddPrice);
router.post('/addPrice', ensureAuthenticated, multer.single('image'), adminController.postAddPrice);

// Edit Price
router.get('/editPrice/:id', ensureAuthenticated, adminController.getEditPrice);
router.post('/editPrice/:id', ensureAuthenticated, multer.single('image'), adminController.postEditPrice);

// Delete Price
router.get('/deletePrice/:id', ensureAuthenticated, adminController.deletePrice);

// Add Trainer
router.get('/addTrainer', ensureAuthenticated, adminController.getAddTrainer);
router.post('/addTrainer', ensureAuthenticated, multer.single('image'), adminController.postAddTrainer);

// Edit Trainer
router.get('/editTrainer/:id', ensureAuthenticated, adminController.getEditTrainer);
router.post('/editTrainer/:id', ensureAuthenticated, multer.single('image'), adminController.postEditTrainer);

// Delete Trainer
router.get('/deleteTrainer/:id', ensureAuthenticated, adminController.deleteTrainer);

module.exports = router;
