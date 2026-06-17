import { GoogleGenerativeAI } from '@google/generative-ai';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { createHourlyRateLimiter } from '../lib/rateLimit.js';

const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const enforceRateLimit = createHourlyRateLimiter(30, 'Hourly AI limit reached.');

const requestSchema = z.object({
  prompt: z.string().min(1).max(800),
  monthlyKgCO2e: z.number().nonnegative(),
  topCategory: z.string().min(1).max(40)
});

export const carbonAssistant = onCall({ region: 'us-central1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in is required.');
  const parsed = requestSchema.parse(request.data);
  enforceRateLimit(request.auth.uid);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      text: `Focus on ${parsed.topCategory}. A practical first target is a 10% reduction from ${Math.round(parsed.monthlyKgCO2e)} kgCO2e/month.`
    };
  }

  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(
    `Act as EcoTrack carbon coach. Footprint ${parsed.monthlyKgCO2e} kgCO2e/month. Top category ${parsed.topCategory}. User: ${parsed.prompt}`
  );
  return { text: result.response.text() };
});
