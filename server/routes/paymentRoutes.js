const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { db } = require('../config/firebase');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'User not authenticated' });
};

// POST /api/payment/create-order
router.post('/create-order', isAuthenticated, async (req, res) => {
    console.log("💰 Payment Route: create-order hit");
    console.log("🔑 Keys Loaded:", {
        id: process.env.RAZORPAY_KEY_ID ? "Yes" : "No",
        secret: process.env.RAZORPAY_KEY_SECRET ? "Yes" : "No"
    });

    // Validating user ID exists
    if (!req.user || (!req.user.id && !req.user.uid)) {
        console.error("❌ User ID missing in create-order request!");
        return res.status(500).json({ error: "User context corrupted" });
    }
    const userId = req.user.id || req.user.uid;

    try {
        const { planType } = req.body;
        console.log("📝 Plan Requested:", planType);

        // Fetch current pricing from DB
        const configDoc = await db.collection('system_config').doc('pricing_strategy').get();
        const prices = configDoc.exists ? configDoc.data() : { day_pass_price: 99, lifetime_pass_price: 499 };

        let amount = 0;
        if (planType === 'day_pass') {
            amount = prices.day_pass_price;
        } else if (planType === 'lifetime_pass') {
            amount = prices.lifetime_pass_price;
        } else {
            return res.status(400).json({ error: 'Invalid plan type' });
        }

        const options = {
            amount: amount * 100, // Razorpay works in paise (subunit)
            currency: 'INR',
            receipt: `receipt_${Date.now()}_${userId.substring(0, 5)}`,
            notes: {
                userId: userId,
                planType: planType
            }
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: 'Something went wrong while creating order' });
    }
});

// POST /api/payment/verify-payment
router.post('/verify-payment', isAuthenticated, async (req, res) => {
    console.log("🔍 Payment Route: verify-payment hit");

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = req.body;
        console.log("📦 Verification Payload:", {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            signature_present: !!razorpay_signature,
            plan: planType
        });

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        console.log("🔐 Signature Check:", {
            match: expectedSignature === razorpay_signature
        });

        if (expectedSignature === razorpay_signature) {
            // Payment Success - Update DB
            const userId = req.user.id || req.user.uid;
            console.log("✅ Signature Matched. Updating DB for user:", userId);

            if (!userId) {
                console.error("❌ User ID missing during verification update!");
                return res.status(500).json({ error: 'User ID missing' });
            }

            const userRef = db.collection('users').doc(userId);

            // Calculate expiry if day pass
            let expiryDate = null;
            if (planType === 'day_pass') {
                const now = new Date();
                now.setHours(now.getHours() + 24);
                expiryDate = now.toISOString();
            }

            await userRef.set({
                isPremium: true,
                subscription: {
                    plan: planType, // 'day_pass' or 'lifetime_pass'
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id,
                    purchaseDate: new Date().toISOString(),
                    expiryDate: expiryDate // null for lifetime
                },
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log("💾 DB Update Successful");
            res.json({ success: true, message: 'Payment verified and subscription activated' });
        } else {
            console.warn("❌ Invalid Signature");
            res.status(400).json({ error: 'Invalid signature' });
        }

    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ error: 'Internal server error during verification' });
    }
});

module.exports = router;
