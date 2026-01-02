const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { signup, login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// Existing auth
router.post("/signup", signup);
router.post("/login", login);

// Get current user
router.get("/me", protect, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user data" });
  }
});

// ================= GOOGLE AUTH =================

// Start Google auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback - Check if user exists or needs role selection
router.get(
  "/google/callback",
  passport.authenticate("google", { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed` 
  }),
  async (req, res) => {
    try {
      const user = req.user;
      
      // Check if this is a new user (password will be "google-auth" for new users)
      // OR check if user was just created (no role set yet except default)
      const isNewUser = user.password === "google-auth" && user.role === "user";
      
      if (isNewUser) {
        // New user - redirect to role selection with temporary token
        const tempToken = jwt.sign(
          { 
            id: user._id,
            email: user.email,
            name: user.name,
            temp: true // Mark as temporary
          },
          process.env.JWT_SECRET,
          { expiresIn: "15m" } // Short expiry for role selection
        );
        
        res.redirect(
          `${process.env.FRONTEND_URL}/select-role?token=${tempToken}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}`
        );
      } else {
        // Existing user - direct login with full token
        const token = jwt.sign(
          { 
            id: user._id, 
            role: user.role,
            email: user.email,
            name: user.name
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.redirect(
          `${process.env.FRONTEND_URL}/google-success?token=${token}`
        );
      }
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  }
);

// Complete Google signup with role selection
router.post("/google/complete", protect, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !["user", "owner"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    
    // Update user role
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role: role },
      { new: true }
    );
    
    // Generate new token with role
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Complete signup error:', error);
    res.status(500).json({ error: "Failed to complete signup" });
  }
});

module.exports = router;