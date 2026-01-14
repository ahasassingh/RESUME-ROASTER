const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Access the model directly if possible, or use a fetch if the SDK doesn't expose listModels easily in older versions, 
    // but standard SDK usually doesn't have listModels directly exposed on the main class in some versions, 
    // actually it does via the API.
    // Let's try to just use a simple fetch to the rest API to be sure, or rely on a known model.
    // But wait, I can just change the model to 'gemini-pro' which is 100% available, but 1.5 flash is better.

    // Let's just try 'gemini-1.5-flash-latest' or 'gemini-pro'.
    // Creating a list script using the SDK:

    try {
        // Note: The Node SDK might not have listModels helper directly exposed in the top level cleanly in all versions.
        // I will just try to run a generation with 'gemini-pro' to see if it works.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Test");
        console.log("gemini-pro works:", result.response.text());
    } catch (e) {
        console.log("gemini-pro failed:", e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result = await model.generateContent("Test");
        console.log("gemini-1.5-flash-001 works:", result.response.text());
    } catch (e) {
        console.log("gemini-1.5-flash-001 failed:", e.message);
    }
}

listModels();
