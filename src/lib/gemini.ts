import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export async function askGemini(prompt: string, context?: Record<string, unknown>): Promise<string> {
  if (!apiKey) {
    return "Error: Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env.local file.";
  }

  try {
    const fullPrompt = context 
      ? `System Context: You are an EcoTrack Assistant, a smart carbon footprint expert.\nUser Carbon Data: ${JSON.stringify(context)}\n\nUser Query: ${prompt}`
      : prompt;

    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't process that request. Please ensure your API key is valid and you have an internet connection.";
  }
}
