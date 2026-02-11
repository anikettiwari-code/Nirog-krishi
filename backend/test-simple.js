
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log('Using API Key:', apiKey?.substring(0, 10) + '...');
        // Note: listModels might not be directly available on genAI instance in some SDK versions, 
        // but let's try the model managers if available or just try a known model like gemini-pro

        // Actually, the SDK doesn't have a direct listModels method on the client usually.
        // We can try to use a simple model like 'gemini-pro' to see if it works.

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Hi');
        console.log('gemini-pro works:', await result.response.text());

    } catch (error) {
        console.error('Error:', error.message);
    }
}

listModels();
