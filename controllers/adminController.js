const Price = require('../models/Price');
const Trainer = require('../models/Trainer');
const path = require('path');
const fs = require('fs');

// Function to delete an image file
const deleteImageFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Centralized error handling function
const handleError = (res, error, message) => {
    console.error(message, error);
    req.flash('error', message); // Fixed: Should use req.flash instead of res.flash
    res.status(500).redirect('/admin/dashboard'); // Redirect to avoid exposing error details
};

// Render the dashboard with prices and trainers
exports.dashboard = async (req, res) => {
    try {
        const prices = await Price.find();
        const trainers = await Trainer.find();

        res.render('admin/dashboard', {
            title: 'Dashboard',
            prices,
            trainers
        });
    } catch (error) {
        handleError(res, error, 'Error fetching data for dashboard:');
    }
};

// Render the page to add a new price
exports.getAddPrice = (req, res) => {
    res.render('admin/addPrice', {
        title: 'Add Price'
    });
};

// Handle adding a new price
exports.postAddPrice = async (req, res) => {
    try {
        const { type, description, amount } = req.body;
        const image = req.file ? req.file.filename : undefined;

        if (!type || !description || !amount) {
            req.flash('error', 'Please fill all required fields');
            return res.redirect('/admin/addPrice');
        }

        const newPrice = new Price({
            type: type.toLowerCase(),
            description: description.toLowerCase(),
            amount,
            image
        });

        await newPrice.save();
        req.flash('success_msg', 'Price added successfully');
        res.redirect('/admin/dashboard');
    } catch (error) {
        handleError(res, error, 'Error adding price:');
    }
};

// Render the page to edit a price
exports.getEditPrice = async (req, res) => {
    try {
        const price = await Price.findById(req.params.id);
        if (!price) {
            return res.status(404).send('Price not found');
        }

        res.render('admin/editPrice', {
            title: 'Edit Price',
            price
        });
    } catch (error) {
        handleError(res, error, 'Error fetching price for editing:');
    }
};

// Handle editing a price
exports.postEditPrice = async (req, res) => {
    try {
        const { type, description, amount } = req.body;
        const updatedData = { 
            type: type.toLowerCase(), 
            description: description.toLowerCase(), 
            amount 
        };

        if (req.file) {
            const oldPrice = await Price.findById(req.params.id);
            if (oldPrice && oldPrice.image) {
                deleteImageFile(path.join(__dirname, '..', 'uploads', oldPrice.image));
            }
            updatedData.image = req.file.filename;
        }

        await Price.findByIdAndUpdate(req.params.id, updatedData);
        req.flash('success_msg', 'Price updated successfully');
        res.redirect('/admin/dashboard');
    } catch (error) {
        handleError(res, error, 'Error updating price:');
    }
};

// Handle deleting a price
exports.deletePrice = async (req, res) => {
    try {
        const price = await Price.findById(req.params.id);
        if (!price) {
            return res.status(404).send('Price not found');
        }

        if (price.image) {
            deleteImageFile(path.join(__dirname, '..', 'uploads', price.image));
        }

        await Price.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Price deleted successfully');
        res.redirect('/admin/dashboard');
    } catch (error) {
        handleError(res, error, 'Error deleting price:');
    }
};

// Render the page to add a new trainer
exports.getAddTrainer = (req, res) => {
    res.render('admin/addTrainer', {
        title: 'Add Trainer'
    });
};

// Handle adding a new trainer
exports.postAddTrainer = async (req, res) => {
    try {
        const { name, specialty, bio } = req.body;
        const image = req.file ? req.file.filename : null;

        const newTrainer = new Trainer({
            name,
            specialty,
            bio,
            image
        });

        await newTrainer.save();
        req.flash('success_msg', 'Trainer added successfully');
        res.redirect('/admin/dashboard');
    } catch (error) {
        handleError(res, error, 'Error adding trainer:');
    }
};

// Render the page to edit a trainer
exports.getEditTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) {
            return res.status(404).send('Trainer not found');
        }

        res.render('admin/editTrainer', {
            title: 'Edit Trainer',
            trainer
        });
    } catch (error) {
        handleError(res, error, 'Error fetching trainer for editing:');
    }
};

// Handle editing a trainer
exports.postEditTrainer = async (req, res) => {
    try {
        const { name, specialty, bio } = req.body;
        const updatedData = { name, specialty, bio };

        if (req.file) {
            const oldTrainer = await Trainer.findById(req.params.id);
            if (oldTrainer && oldTrainer.image) {
                deleteImageFile(path.join(__dirname, '..', 'uploads', oldTrainer.image));
            }
            updatedData.image = req.file.filename;
        }

        await Trainer.findByIdAndUpdate(req.params.id, updatedData);
        req.flash('success_msg', 'Trainer updated successfully');
        res.redirect('/admin/dashboard');
    } catch (error) {
        handleError(res, error, 'Error updating trainer:');
    }
};

// Handle deleting a trainer
exports.deleteTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) {
            return res.status(404).send('Trainer not found');
        }

        if (trainer.image) {
            deleteImageFile(path.join(__dirname, '..', 'uploads', trainer.image));
        }

        await Trainer.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Trainer deleted successfully');
        res.redirect('/admin/dashboard');
    } catch (error) {
        handleError(res, error, 'Error deleting trainer:');
    }
};
