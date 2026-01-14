const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const adminAuth = require('../middleware/adminAuth');
const { logActivity } = require('../utils/logger');

// Protect all routes with adminAuth
router.use(adminAuth);

// GET /api/admin/stats - Fetch system stats and recent users
router.get('/stats', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not initialized' });

        // 1. Fetch System Stats
        const statsDoc = await db.collection('system_stats').doc('global').get();
        const globalStats = statsDoc.exists ? statsDoc.data() : { total_roasts: 0, total_users: 0 };

        // 2. Fetch Recent Users (Last 50)
        const usersSnapshot = await db.collection('users')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        const users = [];
        usersSnapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });

        // 3. Calculate Estimated Cost (e.g., $0.002 per roast)
        // Adjust this multiplier based on your actual API usage pricing
        const estimatedCost = (globalStats.total_roasts || 0) * 0.002;

        res.json({
            stats: {
                ...globalStats,
                estimated_cost: estimatedCost.toFixed(2)
            },
            users
        });

    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
});

// GET /api/admin/logs - Fetch recent activity logs (Polling alternative to onSnapshot)
router.get('/logs', async (req, res) => {
    try {
        const logsSnapshot = await db.collection('system_logs')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        const logs = [];
        logsSnapshot.forEach(doc => {
            logs.push({ id: doc.id, ...doc.data() });
        });

        res.json(logs);
    } catch (error) {
        console.error('Admin Logs Error:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

const { validate } = require('../middleware/inputValidator');
const { upgradeSchema } = require('../utils/validationSchemas');

// POST /api/admin/upgrade - Toggle God Mode or Ban User
router.post('/upgrade', validate(upgradeSchema), async (req, res) => {
    // action: 'premium' (toggle status) | 'ban' (toggle ban status)
    // status: boolean (deprecated for 'premium', used for direct setting if needed, but we'll try to infer)
    const { targetEmail, action, status } = req.body;

    if (!targetEmail) return res.status(400).json({ error: 'Target email required' });

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', targetEmail).limit(1).get();

        if (snapshot.empty) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();
        let message = '';
        let updateData = {};

        if (action === 'ban') {
            const newBanStatus = !userData.isBanned;
            updateData = { isBanned: newBanStatus };
            message = `User ${targetEmail} was ${newBanStatus ? 'BANNED 🚫' : 'UNBANNED ✅'}`;
            await logActivity('ADMIN_ACTION', `Changed ban status to ${newBanStatus}`, req.headers['x-admin-email']); // Log who did it
        } else {
            // Default to premium toggle
            const newPremiumStatus = status !== undefined ? status : !userData.isPremium;
            updateData = { isPremium: newPremiumStatus };
            message = `User ${targetEmail} updated to ${newPremiumStatus ? 'Premium' : 'Free'}`;
            await logActivity('ADMIN_ACTION', `Changed premium status to ${newPremiumStatus}`, req.headers['x-admin-email']);
        }

        await userDoc.ref.update(updateData);

        console.log(`⚡ Admin: ${message}`);
        res.json({ success: true, message });

    } catch (error) {
        console.error('Admin Upgrade Error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// POST /api/admin/pricing - Update Pricing Strategy
router.post('/pricing', async (req, res) => {
    const { day_pass_price, lifetime_pass_price } = req.body;

    // Validate inputs (ensure they are numbers)
    if (typeof day_pass_price !== 'number' || typeof lifetime_pass_price !== 'number') {
        return res.status(400).json({ error: 'Prices must be valid numbers' });
    }

    try {
        await db.collection('system_config').doc('pricing_strategy').set({
            day_pass_price,
            lifetime_pass_price,
            updatedAt: new Date().toISOString(),
            updatedBy: req.headers['x-admin-email'] || 'admin'
        }, { merge: true });

        await logActivity('ADMIN_ACTION', `Updated prices: 24h=${day_pass_price}, Life=${lifetime_pass_price}`, req.headers['x-admin-email']);

        res.json({ success: true, message: 'Prices Updated Successfully' });
    } catch (error) {
        console.error('Admin Pricing Update Error:', error);
        res.status(500).json({ error: 'Failed to update prices' });
    }
});

module.exports = router;
