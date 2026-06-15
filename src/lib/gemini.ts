import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Model resolution order:
 *  1. VITE_GEMINI_MODEL (if provided in .env.local)
 *  2. The requested primary model
 *  3. Stable fallbacks — used automatically if the primary returns 404 / not-found.
 *
 * Keeping a fallback chain makes the assistant resilient to model
 * deprecations (the exact cause of the previous `gemini-1.5-pro` 404).
 */
const PRIMARY_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.1-flash-lite';
const FALLBACK_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

const MODEL_CHAIN = Array.from(new Set([PRIMARY_MODEL, ...FALLBACK_MODELS]));

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const modelCache = new Map<string, GenerativeModel>();

function getModel(name: string): GenerativeModel | null {
  if (!genAI) return null;
  if (!modelCache.has(name)) {
    modelCache.set(name, genAI.getGenerativeModel({ model: name }));
  }
  return modelCache.get(name) ?? null;
}

/** Primary model — exported for callers that want a direct handle. */
export const geminiModel = getModel(PRIMARY_MODEL);

function isModelNotFound(error: unknown): boolean {
  const message = (error as Error)?.message?.toLowerCase() ?? '';
  return message.includes('404') || message.includes('not found') || message.includes('not supported');
}

function buildPrompt(prompt: string, context?: Record<string, unknown>): string {
  if (!context) return prompt;
  return [
    'You are the EcoTrack Assistant — a friendly, concise carbon-footprint expert.',
    'Use the user data below to give specific, actionable, encouraging advice.',
    'Prefer short paragraphs and bullet points. Avoid generic filler.',
    '',
    `User carbon data: ${JSON.stringify(context)}`,
    '',
    `User question: ${prompt}`
  ].join('\n');
}

export async function askGemini(
  prompt: string,
  context?: Record<string, unknown>
): Promise<string> {
  if (!apiKey || !genAI) {
    return 'The AI assistant is not configured yet. Add `VITE_GEMINI_API_KEY` to your `.env.local` file to enable it.';
  }

  const fullPrompt = buildPrompt(prompt, context);
  let lastError: unknown = null;

  for (const modelName of MODEL_CHAIN) {
    const model = getModel(modelName);
    if (!model) continue;

    try {
      const result = await model.generateContent(fullPrompt);
      return result.response.text();
    } catch (error) {
      lastError = error;
      // If the model simply doesn't exist, try the next one in the chain.
      if (isModelNotFound(error)) {
        console.warn(`Gemini model "${modelName}" unavailable, trying fallback…`);
        continue;
      }
      // Any other error (network, quota, safety) — stop and report.
      break;
    }
  }

  console.error('Gemini API Error:', lastError);
  return "Sorry, I couldn't process that request right now. Please check your connection and API key, then try again.";
}
