import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateCarbonFootprint } from '@/lib/carbonCalculator';
import { defaultChallenges, defaultGoals, defaultInput } from '@/lib/defaultData';
import type { CarbonInput, CarbonLog, Challenge, Goal, ScannedReceipt } from '@/types/carbon';
import { uid } from '@/lib/utils';

interface CarbonState {
  input: CarbonInput;
  logs: CarbonLog[];
  goals: Goal[];
  challenges: Challenge[];
  receipts: ScannedReceipt[];
  setInput: (input: CarbonInput) => void;
  updateInput: <K extends keyof CarbonInput>(section: K, value: CarbonInput[K]) => void;
  saveLog: () => CarbonLog;
  addGoal: (goal: Omit<Goal, 'id' | 'completed' | 'currentKg'>) => void;
  removeGoal: (id: string) => void;
  toggleChallenge: (id: string) => void;
  addReceipt: (receipt: Omit<ScannedReceipt, 'id' | 'createdAt'>) => ScannedReceipt;
}

export const useCarbonStore = create<CarbonState>()(
  persist(
    (set, get) => ({
      input: defaultInput,
      logs: [
        {
          id: 'seed-log',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
          input: defaultInput,
          result: calculateCarbonFootprint(defaultInput)
        }
      ],
      goals: defaultGoals,
      challenges: defaultChallenges,
      receipts: [],
      setInput: (input) => set({ input }),
      updateInput: (section, value) =>
        set((state) => ({ input: { ...state.input, [section]: value } })),
      saveLog: () => {
        const state = get();
        const log: CarbonLog = {
          id: uid('log'),
          createdAt: new Date().toISOString(),
          input: state.input,
          result: calculateCarbonFootprint(state.input)
        };
        set({ logs: [log, ...state.logs].slice(0, 24) });
        return log;
      },
      addGoal: (goal) =>
        set((state) => ({
          goals: [
            ...state.goals,
            { ...goal, id: uid('goal'), completed: false, currentKg: 0 }
          ]
        })),
      removeGoal: (id) =>
        set((state) => ({ goals: state.goals.filter((goal) => goal.id !== id) })),
      toggleChallenge: (id) =>
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === id
              ? { ...challenge, completed: !challenge.completed }
              : challenge
          )
        })),
      addReceipt: (receipt) => {
        const entry: ScannedReceipt = {
          ...receipt,
          id: uid('receipt'),
          createdAt: new Date().toISOString()
        };
        set((state) => ({ receipts: [entry, ...state.receipts].slice(0, 50) }));
        return entry;
      }
    }),
    { name: 'ecotrack-carbon-store' }
  )
);
