const ADMIN_EMAIL = 'singhahasas94@gmail.com'; // TODO: Change this to your real email

const adminAuth = (req, res, next) => {
    const adminEmail = req.headers['x-admin-email'];

    if (!adminEmail || adminEmail !== ADMIN_EMAIL) {
        console.warn(`🛑 Unauthorized Admin Access Attempt by: ${adminEmail || 'Unknown'}`);
        return res.status(403).json({ error: 'Access Denied: You are not worthy.' });
    }

    next();
};

module.exports = adminAuth;
