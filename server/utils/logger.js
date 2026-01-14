const { db } = require('../config/firebase');

/**
 * Logs an activity to the system_logs collection in Firestore.
 * @param {string} type - The type of activity (e.g., 'ROAST', 'BAN', 'UPGRADE', 'ERROR').
 * @param {string} message - A descriptive message.
 * @param {string} userEmail - The email of the user associated with the event (optional).
 */
const logActivity = async (type, message, userEmail = 'System') => {
    try {
        if (!db) {
            console.warn('⚠️ Logger: Database not initialized');
            return;
        }

        await db.collection('system_logs').add({
            type,
            message,
            userEmail,
            timestamp: new Date().toISOString(),
            createdAt: new Date() // For sorting
        });

        console.log(`[LOG - ${type}] ${userEmail}: ${message}`);
    } catch (error) {
        console.error('Failed to write to system logs:', error);
    }
};

module.exports = { logActivity };
