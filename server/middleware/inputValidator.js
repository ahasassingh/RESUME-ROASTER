const validate = (schema) => (req, res, next) => {
    try {
        // Parses body, throws if invalid. strip() removes unknown keys.
        req.body = schema.parse(req.body);
        next();
    } catch (e) {
        return res.status(400).json({
            error: 'Validation Error',
            details: e.errors.map(err => ({ field: err.path[0], message: err.message }))
        });
    }
};

module.exports = { validate };
