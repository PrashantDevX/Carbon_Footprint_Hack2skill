import { ImageAnnotatorClient } from '@google-cloud/vision';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { z } from 'zod';

const schema = z.object({
  imageUrl: z.string().url()
});

export const scanReceipt = onCall({ region: 'us-central1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in is required.');
  
  try {
    const { imageUrl } = schema.parse(request.data);
    
    // 1. Extract text using Cloud Vision API
    const client = new ImageAnnotatorClient();
    const [result] = await client.textDetection(imageUrl);
    const text = result.fullTextAnnotation?.text ?? '';

    if (!text) {
      throw new HttpsError('invalid-argument', 'No text found in the image.');
    }

    // 2. Process text with Gemini to estimate Carbon Footprint
    // Assuming the Cloud Function has the gemini.key config set
    // const apiKey = process.env.GEMINI_API_KEY || ''; // In real env, use Secret Manager
    const apiKey = "YOUR_GEMINI_API_KEY"; // Placeholder, normally injected via secrets

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Analyze this receipt text and estimate the carbon footprint (in kg CO2e) for each item. 
      Return ONLY a JSON object with this exact structure, nothing else:
      {
        "items": [
          { "name": "Item name", "category": "food" | "transport" | "shopping", "footprint": 1.2 }
        ],
        "totalFootprint": 5.4
      }
      Receipt Text:
      ${text}
    `;

    const aiResult = await model.generateContent(prompt);
    const aiResponseText = aiResult.response.text();
    
    // Clean up the response to extract JSON
    const jsonStr = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedResult = JSON.parse(jsonStr);

    return {
      success: true,
      data: parsedResult
    };

  } catch (error: unknown) {
    console.error("Error in scanReceipt:", error);
    throw new HttpsError('internal', (error as Error).message || 'Failed to process receipt.');
  }
});
