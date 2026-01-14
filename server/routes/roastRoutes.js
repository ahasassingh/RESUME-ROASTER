const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parsePDF } = require('../services/pdfService');
const { roastResume } = require('../services/aiService');
const { db } = require('../config/firebase');
const { logActivity } = require('../utils/logger');
const path = require('path');

// Configure Multer for PDF upload
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDFs are allowed!'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const { validate } = require('../middleware/inputValidator');
const { roastSchema } = require('../utils/validationSchemas');
const { apiLimiter } = require('../middleware/rateLimiter');

router.post('/', apiLimiter, upload.single('resume'), validate(roastSchema), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        // --- RATE LIMITING & USER CHECK ---
        const user = req.user;

        let isPremium = false;
        let dbUserRef = null;

        if (user && user.id && db) {
            dbUserRef = db.collection('users').doc(user.id);
            // Fetch fresh user data to ensure ban status is up to date
            const freshUserSnap = await dbUserRef.get();
            const freshUserData = freshUserSnap.data() || {};

            isPremium = freshUserData.isPremium === true;
            const isBanned = freshUserData.isBanned === true;

            // 🛑 THE BAN HAMMER 🛑
            if (isBanned) {
                await logActivity('BLOCKED', `Banned user attempted roast`, user.email);
                return res.status(403).json({ error: 'ACCESS DENIED: YOU HAVE BEEN BANNED BY THE ADMINISTRATOR.' });
            }

            if (!isPremium) {
                const now = new Date();
                const lastRoast = freshUserData.lastRoastDate ? new Date(freshUserData.lastRoastDate) : null;

                // Check if roasted today
                // TEMPORARY DEV OVERRIDE: Allow unlimited roasts
                if (lastRoast && lastRoast.toDateString() === now.toDateString()) {
                    return res.status(429).json({
                        error: 'Daily roast limit reached. Come back tomorrow or upgrade to God Mode.',
                        limitReached: true
                    });
                }
            }
        }
        // ----------------------------------

        // 1. Parse PDF
        const resumeText = await parsePDF(req.file.path);

        if (!resumeText || resumeText.length < 50) {
            return res.status(400).json({ error: 'PDF appears to be empty or unreadable.' });
        }

        // 2. Roast it
        const language = req.body.language || 'English';
        console.log(`🔥 Roasting in language: ${language}`); // Debug log
        const roastData = await roastResume(resumeText, language, isPremium);

        // Log the success
        await logActivity('ROAST', `Generated roast in ${language}`, user.email);

        // --- UPDATE DATABASE ---
        if (dbUserRef) {
            await dbUserRef.update({
                roastCount: (user.roastCount || 0) + 1,
                lastRoastDate: new Date().toISOString()
            });

            // Update System Stats
            try {
                const statsRef = db.collection('system_stats').doc('global');
                // Use FieldValue.increment if imported, otherwise read-write transaction is safer but this is fine for now
                const statsDoc = await statsRef.get();
                if (!statsDoc.exists) {
                    await statsRef.set({ total_roasts: 1 });
                } else {
                    await statsRef.update({
                        total_roasts: (statsDoc.data().total_roasts || 0) + 1
                    });
                }
            } catch (err) {
                console.error('Stats Update Error:', err);
            }
        }
        // -----------------------

        // 3. Respond
        res.json(roastData);

    } catch (error) {
        console.error('Roast route error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

module.exports = router;
