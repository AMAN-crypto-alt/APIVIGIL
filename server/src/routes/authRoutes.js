const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

/*
========================================
1. Register User
POST /api/auth/register
========================================
*/
router.post("/register", registerUser);

/*
========================================
2. Login User
POST /api/auth/login
========================================
*/
router.post("/login", loginUser);

/*
========================================
3. Protected Profile Route
GET /api/auth/profile
========================================
*/
router.get("/profile", protect, getProfile);

module.exports = router;