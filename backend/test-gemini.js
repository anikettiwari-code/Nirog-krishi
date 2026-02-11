// Test script to check Gemini API
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
    try {
        console.log('Testing Gemini API...');
        console.log('API Key:', process.env.GEMINI_API_KEY?.substring(0, 20) + '...');

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hello, are you working?');
        const response = await result.response;
        const text = response.text();

        console.log('✅ SUCCESS! Gemini API is working!');
        console.log('Response:', text);
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Full error:', error);
    }
}

testGemini();
