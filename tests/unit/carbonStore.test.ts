import { describe, it, expect, beforeEach } from 'vitest';
import { useCarbonStore } from '@/store/carbonStore';

describe('carbonStore', () => {
  beforeEach(() => {
    // Reset to a known state between tests.
    useCarbonStore.setState({ receipts: [], goals: [] });
  });

  it('adds a scanned receipt and returns it with an id + timestamp', () => {
    const entry = useCarbonStore.getState().addReceipt({
      items: [{ name: 'Beef', category: 'food', footprint: 5 }],
      totalKgCO2e: 5
    });

    expect(entry.id).toBeTruthy();
    expect(entry.createdAt).toBeTruthy();
    expect(useCarbonStore.getState().receipts).toHaveLength(1);
    expect(useCarbonStore.getState().receipts[0].totalKgCO2e).toBe(5);
  });

  it('adds and removes goals', () => {
    useCarbonStore.getState().addGoal({
      title: 'Bike more',
      category: 'transport',
      targetKg: 10,
      dueDate: new Date().toISOString()
    });
    const goal = useCarbonStore.getState().goals[0];
    expect(goal.completed).toBe(false);
    expect(goal.currentKg).toBe(0);

    useCarbonStore.getState().removeGoal(goal.id);
    expect(useCarbonStore.getState().goals).toHaveLength(0);
  });

  it('keeps only the most recent 50 receipts', () => {
    const { addReceipt } = useCarbonStore.getState();
    for (let i = 0; i < 55; i++) {
      addReceipt({ items: [], totalKgCO2e: i });
    }
    expect(useCarbonStore.getState().receipts).toHaveLength(50);
  });
});
