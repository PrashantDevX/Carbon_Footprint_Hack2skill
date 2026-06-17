import { ImageAnnotatorClient } from '@google-cloud/vision';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { createHourlyRateLimiter } from '../lib/rateLimit.js';

const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const enforceRateLimit = createHourlyRateLimiter(20, 'Hourly receipt-scan limit reached.');

const requestSchema = z.object({
  imageUrl: z.string().url()
});

const itemSchema = z.object({
  name: z.string().min(1).max(80),
  category: z.enum(['food', 'transport', 'shopping', 'household', 'other']).catch('other'),
  footprint: z.number().nonnegative().catch(0)
});

const scanResultSchema = z.object({
  items: z.array(itemSchema).max(60),
  totalFootprint: z.number().nonnegative()
});

const PROMPT = `Analyze this receipt text and estimate the carbon footprint (kg CO2e) for each item.
Respond with ONLY a JSON object, no prose, in exactly this shape:
{"items":[{"name":"string","category":"food|transport|shopping|household|other","footprint":0.0}],"totalFootprint":0.0}
Receipt text:`;

export const scanReceipt = onCall({ region: 'us-central1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in is required.');
  const { imageUrl } = requestSchema.parse(request.data);
  enforceRateLimit(request.auth.uid);

  const text = await extractReceiptText(imageUrl);
  if (!text) throw new HttpsError('invalid-argument', 'No readable text was found in the image.');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new HttpsError('failed-precondition', 'Receipt analysis is not configured on the server.');
  }

  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: GEMINI_MODEL });
  const aiResult = await model.generateContent(`${PROMPT}\n${text}`);
  return scanResultSchema.parse(extractJson(aiResult.response.text()));
});

async function extractReceiptText(imageUrl: string): Promise<string> {
  const client = new ImageAnnotatorClient();
  const [result] = await client.textDetection(imageUrl);
  return result.fullTextAnnotation?.text?.trim() ?? '';
}

/** Extract the first JSON object from a model response, tolerating code fences/prose. */
function extractJson(text: string): unknown {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new HttpsError('internal', 'Could not parse the receipt analysis.');
  }
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    throw new HttpsError('internal', 'Could not parse the receipt analysis.');
  }
}
