// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Check header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing or invalid"
      });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user to request
    req.user = decoded;

    next();

  } catch (error) {

    // 🔥 Better error handling
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired, please login again"
      });
    }

    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

module.exports = protect;