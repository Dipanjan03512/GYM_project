const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const TokenModel = require("../models/tokenModel");

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Render login/register page
exports.getLoginRegisterPage = (req, res) => {
  res.render("pages/login-register", {
    title: "Login/Register",
    errors: req.flash("error"),
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    console.log("The value collected from registration form:", req.body);
    let errors = [];

    // Validate input
    if (!req.body.name || !req.body.email || !req.body.password) {
      errors.push({ msg: "Please enter all fields" });
    }

    if (req.body.password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }

    if (errors.length > 0) {
      return res.render("pages/login-register", {
        title: "Login/Register",
        errors,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      errors.push({ msg: "Email already exists" });
      return res.render("pages/login-register", {
        title: "Login/Register",
        errors,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });

    const savedUser = await newUser.save();

    // Generate JWT token for email verification
    const jwtToken = jwt.sign(
      { email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const tokenData = new TokenModel({
      token: jwtToken,
      _userId: savedUser._id,
    });

    await tokenData.save();

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Email Verification",
      text: `Hello ${req.body.name},\n\nPlease verify your account by clicking the link: \nhttp://${req.headers.host}/auth/verify/${savedUser.email}/${jwtToken}\n\nThank you!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        req.flash("error", "Error sending verification email");
        return res.redirect("/auth/login-register");
      } else {
        console.log("Verification email sent:", info.response);
        req.flash(
          "success_msg",
          "Registration successful! Please verify your email."
        );
        res.redirect("/auth/login-register");
      }
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send("Server error");
  }
};

// Login user
exports.login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login-register",
    failureFlash: true,
  })(req, res, next);
};

// Logout user
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return next(err);
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/auth/login-register");
  });
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.params;
    console.log("Verification email:", email);
    console.log("Verification token:", token);

    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid verification link.");
      return res.redirect("/auth/login-register");
    }

    if (user.isVerified) {
      req.flash("success_msg", "Account already verified.");
      return res.redirect("/auth/login-register");
    }

    const tokenDoc = await TokenModel.findOne({ token });

    if (!tokenDoc) {
      req.flash("error", "Invalid or expired token.");
      return res.redirect("/auth/login-register");
    }

    user.isVerified = true;
    await user.save();
    await TokenModel.deleteOne({ token });

    req.flash(
      "success_msg",
      "Account verified successfully. You can now log in."
    );
    res.redirect("/auth/login-register");
  } catch (err) {
    console.error("Error verifying email:", err);
    res.status(500).send("Server error");
  }
};
