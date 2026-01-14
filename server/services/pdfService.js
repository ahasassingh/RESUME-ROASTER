const pdf = require('pdf-parse');
const fs = require('fs');

const parsePDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);

        // Cleanup: delete the file after parsing
        // On Windows, sometimes file locks aren't released immediately. 
        // We try to delete, but if it fails, we don't crash the request.
        try {
            fs.unlinkSync(filePath);
        } catch (cleanupErr) {
            console.warn(`⚠️ Warning: Failed to delete temp PDF (${cleanupErr.code}). It will be left in uploads/`);
        }

        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        // Attempt cleanup even on error
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (cleanupErr) {
            console.warn(`⚠️ Warning: Failed to delete temp PDF during error handling (${cleanupErr.code}).`);
        }
        throw new Error(`Failed to parse PDF: ${error.message}`);
    }
};

module.exports = { parsePDF };
