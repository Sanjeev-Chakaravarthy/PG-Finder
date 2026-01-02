// config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        
        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
          // Existing user - just return them
          return done(null, user);
        }
        
        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: email,
          password: "google-auth", // Marker for Google auth users
          role: "user", // Default role
          roleSelected: false, // They need to select their role
          authMethod: "google"
        });
        
        return done(null, user);
      } catch (err) {
        console.error('Google Strategy Error:', err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;