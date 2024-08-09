const User = require('../models/User');
const Price = require('../models/Price');
const Trainer = require('../models/Trainer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const user = new User({ name, email, password, isVerified: false, verificationToken: token });
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your email',
            text: `Please verify your email by clicking on the following link: ${process.env.BASE_URL}/auth/verify/${token}`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTrainersPage = async (req, res) => {
    try {
        const trainers = await Trainer.find();
        console.log('Trainers:', trainers); 
        res.render('pages/trainers', { title: 'Trainers', trainers });
    } catch (error) {
        console.error('Error fetching trainers:', error); 
        res.status(500).send('Server Error');
    }
};

exports.getPricesPage = async (req, res) => {
    try {
        const prices = await Price.find();
        console.log('Prices:', prices); 
        res.render('pages/prices', { title: 'Prices', prices });
    } catch (error) {
        console.error('Error fetching prices:', error); 
        res.status(500).send('Server Error');
    }
};

exports.getAddTrainerPage = (req, res) => {
    res.render('admin/addTrainer');
};

exports.getAddPricesPage = (req, res) => {
    res.render('admin/addPrices');
};

exports.getloginregister = (req, res) => {
    res.render('pages/login-register');
};

// Add the getAboutPage method
exports.getAboutPage = async (req, res) => {
    try {
        const trainers = await Trainer.find(); // Fetch trainers data
        res.render('pages/about', { title: 'About Us', trainers });
    } catch (error) {
        console.error('Error fetching trainers for About Us page:', error);
        res.status(500).send('Server Error');
    }
};
exports.handleContactForm = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        console.log(`Contact form submitted by ${name} (${email}): ${message}`);
        res.redirect('/thankyou');
    } catch (error) {
        console.error('Error handling contact form:', error);
        res.status(500).send('Server Error');
    }
};
