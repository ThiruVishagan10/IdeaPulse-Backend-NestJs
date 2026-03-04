require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY not found in environment variables');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
  ];

  console.log('Testing available models...\n');

  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hello');
      const response = result.response;
      console.log(`✓ ${modelName} - WORKS`);
      console.log(`  Response: ${response.text().substring(0, 50)}...\n`);
    } catch (error) {
      console.log(`✗ ${modelName} - FAILED: ${error.message}\n`);
    }
  }
}

testModels();
