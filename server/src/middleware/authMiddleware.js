const jwt = require("jsonwebtoken");

/*
========================================
Protect Route Middleware
Used for protected routes like:
GET /api/auth/profile
========================================
*/

const protect = async (req, res, next) => {
  let token;

  // Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify JWT token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secretkey"
      );

      // Save user ID in request object
      req.user = decoded.id;

      // Move to next middleware/controller
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  // If no token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};

module.exports = {
  protect,
};