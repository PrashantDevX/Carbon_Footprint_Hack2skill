import { trace } from 'firebase/performance';
import { perf } from './firebase';

export async function traceAICall<T>(fn: () => Promise<T>): Promise<T> {
  if (!perf) return fn();
  const activeTrace = trace(perf, 'ai_assistant_call');
  activeTrace.start();
  try {
    const result = await fn();
    activeTrace.stop();
    return result;
  } catch (error) {
    activeTrace.putAttribute('error', 'true');
    activeTrace.stop();
    throw error;
  }
}
