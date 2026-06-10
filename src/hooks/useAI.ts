import { useMutation } from '@tanstack/react-query';
import { askGemini } from '@/lib/gemini';
import { traceAICall } from '@/lib/performance';
import type { CarbonResult } from '@/types/carbon';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useAI(result: CarbonResult) {
  return useMutation({
    mutationFn: (prompt: string) => traceAICall(() => askGemini(prompt, result))
  });
}
