const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Render login/register page
router.get("/login-register", authController.getLoginRegisterPage);

// Register a new user
router.post("/register", authController.register);

// Login a user
router.post("/login", authController.login);

// Logout a user
router.get("/logout", authController.logout);

// Verify email
router.get("/verify/:email/:token", authController.verifyEmail);

module.exports = router;
