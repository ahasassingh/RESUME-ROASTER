const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.serializeUser((user, done) => {
    // In a real app, we'd save user.id to the DB.
    // For now, we just pass the whole user profile or a subset.
    done(null, user);
});

passport.deserializeUser((user, done) => {
    // In a real app, we'd findById(id).
    done(null, user);
});

const { db } = require('./firebase');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    proxy: true
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            if (!db) {
                console.warn("⚠️ Firestore DB not initialized. Skipping DB persistence.");
                // Fallback for when no DB key is present
                return done(null, {
                    id: profile.id,
                    displayName: profile.displayName,
                    photos: profile.photos,
                    email: profile.emails[0].value,
                    isPremium: false,
                    roastCount: 0
                });
            }

            const userRef = db.collection('users').doc(profile.id);
            const doc = await userRef.get();

            if (!doc.exists) {
                // Create new user
                const newUser = {
                    id: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos?.[0]?.value,
                    isPremium: false,
                    roastCount: 0,
                    lastRoastDate: null,
                    createdAt: new Date().toISOString()
                };
                await userRef.set(newUser);
                return done(null, newUser);
            } else {
                // Return existing user data
                return done(null, doc.data());
            }
        } catch (error) {
            console.error("Passport Error:", error);
            return done(error, null);
        }
    }
));

module.exports = passport;
