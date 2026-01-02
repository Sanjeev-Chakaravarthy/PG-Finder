// ============= authRoutes.js - COMPLETE FIX =============
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
      
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=user_not_found`);
      }
      
      // Check if user needs to select a role
      // New Google users will have password = "google-auth" initially
      const needsRoleSelection = user.password === "google-auth" && !user.roleSelected;
      
      if (needsRoleSelection) {
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
        
        return res.redirect(
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

        return res.redirect(
          `${process.env.FRONTEND_URL}/google-success?token=${token}`
        );
      }
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`);
    }
  }
);

// Complete Google signup with role selection
router.post("/google/complete", async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    // Check if it's a temporary token
    if (!decoded.temp) {
      return res.status(400).json({ error: "Not a role selection token" });
    }
    
    const { role } = req.body;
    
    if (!role || !["user", "owner"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be 'user' or 'owner'" });
    }
    
    // Update user role
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { 
        role: role,
        roleSelected: true // Mark that role has been selected
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Generate new permanent token with role
    const permanentToken = jwt.sign(
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
      token: permanentToken,
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