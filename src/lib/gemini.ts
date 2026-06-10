import { GoogleGenerativeAI } from '@google/generative-ai';
import type { CarbonResult } from '@/types/carbon';

export async function askGemini(prompt: string, result: CarbonResult): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return localAssistant(prompt, result);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const response = await model.generateContent(`
    You are EcoTrack, a practical carbon reduction coach.
    User monthly footprint: ${result.monthlyKgCO2e} kgCO2e.
    Top category: ${result.topCategory.label} at ${result.topCategory.kgCO2e} kgCO2e.
    Give concise, specific advice. User asks: ${prompt}
  `);

  return response.response.text();
}

function localAssistant(prompt: string, result: CarbonResult) {
  const lowered = prompt.toLowerCase();
  if (lowered.includes('quick') || lowered.includes('today')) {
    return `Today, focus on ${result.topCategory.label.toLowerCase()}: ${result.topCategory.tips[0]} That is your biggest lever at ${result.topCategory.kgCO2e} kgCO2e/month.`;
  }

  if (lowered.includes('goal')) {
    return `Set a 30-day ${result.topCategory.label.toLowerCase()} goal for about ${Math.round(result.topCategory.kgCO2e * 0.12)} kgCO2e. Keep it small enough to finish, then stack a second habit.`;
  }

  return `Your current footprint is ${result.monthlyKgCO2e} kgCO2e/month with a score of ${result.score}. The highest-impact area is ${result.topCategory.label}. Start with: ${result.topCategory.tips.join(' ')}`;
}
