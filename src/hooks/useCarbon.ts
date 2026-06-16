import { useMemo } from 'react';
import { calculateCarbonFootprint } from '@/lib/carbonCalculator';
import { useCarbonStore } from '@/store/carbonStore';

export function useCarbon() {
  const input = useCarbonStore((state) => state.input);
  const logs = useCarbonStore((state) => state.logs);
  const goals = useCarbonStore((state) => state.goals);
  const challenges = useCarbonStore((state) => state.challenges);
  const receipts = useCarbonStore((state) => state.receipts);
  const updateInput = useCarbonStore((state) => state.updateInput);
  const saveLog = useCarbonStore((state) => state.saveLog);
  const addGoal = useCarbonStore((state) => state.addGoal);
  const removeGoal = useCarbonStore((state) => state.removeGoal);
  const toggleChallenge = useCarbonStore((state) => state.toggleChallenge);
  const addReceipt = useCarbonStore((state) => state.addReceipt);
  const result = useMemo(() => calculateCarbonFootprint(input), [input]);

  return {
    input,
    result,
    logs,
    goals,
    challenges,
    receipts,
    updateInput,
    saveLog,
    addGoal,
    removeGoal,
    toggleChallenge,
    addReceipt
  };
}
