const User = require('../models/User');
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

exports.getTrainersPage = (req, res) => {
    res.render('pages/trainers');
};

exports.getPricesPage = (req, res) => {
    res.render('pages/prices');
};

exports.getAddTrainerPage = (req, res) => {
    res.render('admin/addTrainer');
};

exports.getAddPricesPage = (req, res) => {
    res.render('admin/addPrices');
};
exports.getloginregister = (req, res) => {
    res.render('pages/login-register')
}