const { z } = require('zod');

const roastSchema = z.object({
    language: z.enum([
        'English', 'Spanish', 'French', 'German', 'Hindi', 'Chinese', 'Japanese'
    ]).default('English'),
    // File validation is handled by multer, but we validate existence here conceptually
});

const upgradeSchema = z.object({
    targetEmail: z.string().email(),
    action: z.enum(['premium', 'ban']),
    status: z.boolean().optional() // Optional because action might imply status toggle
});

module.exports = { roastSchema, upgradeSchema };
