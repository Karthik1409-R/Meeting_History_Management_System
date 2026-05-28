const express = require("express");

const {
  signup,
  login,
  getMe,
} = require("../controllers/authController");
const {
  googleAuth,
  googleCallback,
} = require("../controllers/googleAuthController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/me", protect, getMe);

router.get("/google", googleAuth);

router.get("/google/callback", googleCallback);

module.exports = router;
