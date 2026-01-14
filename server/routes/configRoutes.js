const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// GET /api/config/pricing - Fetch current pricing strategy
router.get('/pricing', async (req, res) => {
    try {
        if (!db) {
            // Fallback if DB not connected (e.g. dev without creds)
            console.warn('DB not connected, returning default prices');
            return res.json({ day_pass_price: 99, lifetime_pass_price: 499 });
        }

        const doc = await db.collection('system_config').doc('pricing_strategy').get();

        if (!doc.exists) {
            // Initialize with defaults if not exists
            const defaultPricing = { day_pass_price: 99, lifetime_pass_price: 499 };
            await db.collection('system_config').doc('pricing_strategy').set(defaultPricing);
            return res.json(defaultPricing);
        }

        res.json(doc.data());
    } catch (error) {
        console.error('Config Error:', error);
        // Fallback on error to ensure frontend doesn't break
        res.json({ day_pass_price: 99, lifetime_pass_price: 499 });
    }
});

module.exports = router;
