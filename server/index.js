const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const session = require('express-session');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

const helmet = require('helmet');
const { globalLimiter } = require('./middleware/rateLimiter');

// Middleware
app.use(helmet()); // Secure Headers
app.use(globalLimiter); // Global Rate Limit
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL || 'http://localhost:5173'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin === process.env.CLIENT_URL) {
            return callback(null, true);
        }
        // For development, just allow connection if it looks local
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'cyberpunk_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-site cookies
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Auth Routes (Temporary location, ideally move to separate file)
app.get('/auth/google', (req, res, next) => {
    // Check if there is a redirect param (e.g., /admin)
    const redirectPath = req.query.redirect;
    if (redirectPath) {
        res.cookie('redirect_to', redirectPath, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 5 * 60 * 1000 // 5 minutes
        });
    }
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173' }),
    (req, res) => {
        // Check for redirect cookie
        const redirectPath = req.cookies.redirect_to || '/';

        // Clear the cookie
        res.clearCookie('redirect_to');

        // Successful authentication, redirect to stored path or home
        // Ensure we are redirecting to the client URL
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const targetUrl = redirectPath.startsWith('/') ? `${clientUrl}${redirectPath}` : clientUrl;

        res.redirect(targetUrl);
    }
);

app.get('/api/user', (req, res) => {
    res.json(req.user || null);
});

app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
    });
});
app.get('/', (req, res) => {
    res.send('Antigravity Resume Roaster API is Online');
});

const roastRoutes = require('./routes/roastRoutes');
const adminRoutes = require('./routes/adminRoutes'); // New Admin Routes
const configRoutes = require('./routes/configRoutes');

app.use('/api/roast', roastRoutes);
app.use('/api/admin', adminRoutes); // Mount Admin API
app.use('/api/config', configRoutes); // Public Config API
app.use('/api/payment', require('./routes/paymentRoutes')); // Payment API

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 GLOBAL ERROR HANDLER CAUGHT EXCEPTION 🔥");
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
