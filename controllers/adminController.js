const Trainer = require('../models/Trainer');
const Price = require('../models/Price');

// Get Add Trainer Page
exports.getAddTrainerPage = (req, res) => {
    res.render('admin/addTrainer');
};

// Add Trainer
exports.addTrainer = async (req, res) => {
    const { name, specialty, bio } = req.body;
    const photo = req.file.path; 
    try {
        const trainer = new Trainer({ name, specialty, bio, photo });
        await trainer.save();
        req.flash('success_msg', 'Trainer added successfully');
        res.redirect('/admin/add-trainer');
    } catch (error) {
        req.flash('error_msg', error.message);
        res.redirect('/admin/add-trainer');
    }
};

// Get Edit Trainer Page
exports.getEditTrainerPage = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        res.render('admin/editTrainer', { trainer });
    } catch (error) {
        req.flash('error_msg', error.message);
        res.redirect('/trainers');
    }
};

// Edit Trainer
exports.editTrainer = async (req, res) => {
    const { name, specialty, bio } = req.body;
    const photo = req.file ? req.file.path : undefined; // Check if photo was uploaded
    try {
        const trainer = await Trainer.findById(req.params.id);
        trainer.name = name;
        trainer.specialty = specialty;
        trainer.bio = bio;
        if (photo) trainer.photo = photo;
        await trainer.save();
        req.flash('success_msg', 'Trainer updated successfully');
        res.redirect('/admin/edit-trainer/' + req.params.id);
    } catch (error) {
        req.flash('error_msg', error.message);
        res.redirect('/admin/edit-trainer/' + req.params.id);
    }
};

// Get Add Prices Page
exports.getAddPricesPage = (req, res) => {
    res.render('admin/addPrices');
};

// Add Prices
exports.addPrices = async (req, res) => {
    const { plan, description, price } = req.body;
    try {
        const membershipPlan = new Price({ plan, description, price });
        await membershipPlan.save();
        req.flash('success_msg', 'Plan added successfully');
        res.redirect('/admin/add-prices');
    } catch (error) {
        req.flash('error_msg', error.message);
        res.redirect('/admin/add-prices');
    }
};

// Get Edit Prices Page
exports.getEditPricesPage = async (req, res) => {
    try {
        const price = await Price.findById(req.params.id);
        res.render('admin/editPrices', { price });
    } catch (error) {
        req.flash('error_msg', error.message);
        res.redirect('/prices');
    }
};

// Edit Prices
exports.editPrices = async (req, res) => {
    const { plan, description, price } = req.body;
    try {
        const membershipPlan = await Price.findById(req.params.id);
        membershipPlan.plan = plan;
        membershipPlan.description = description;
        membershipPlan.price = price;
        await membershipPlan.save();
        req.flash('success_msg', 'Plan updated successfully');
        res.redirect('/admin/edit-prices/' + req.params.id);
    } catch (error) {
        req.flash('error_msg', error.message);
        res.redirect('/admin/edit-prices/' + req.params.id);
    }
};

