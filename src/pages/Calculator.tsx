import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle2, Car, Zap, Apple, ShoppingBag, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SelectField } from '@/components/ui/Field';
import { RangeField } from '@/components/ui/RangeField';
import { useCarbon } from '@/hooks/useCarbon';
import type { CarbonInput, CarbonCategory } from '@/types/carbon';
import { formatKg } from '@/lib/utils';

const TABS: { key: CarbonCategory; label: string; icon: typeof Car }[] = [
  { key: 'transport', label: 'Transport', icon: Car },
  { key: 'energy', label: 'Energy', icon: Zap },
  { key: 'food', label: 'Food', icon: Apple },
  { key: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { key: 'water', label: 'Water', icon: Droplets }
];

export function Calculator() {
  const { input, result, updateInput, saveLog } = useCarbon();
  const [active, setActive] = useState<CarbonCategory>('transport');
  const [isSaving, setIsSaving] = useState(false);

  const setSection = <K extends keyof CarbonInput>(section: K, value: Partial<CarbonInput[K]>) => {
    updateInput(section, { ...input[section], ...value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveLog();
    setTimeout(() => setIsSaving(false), 1200);
  };

  const activeCategory = result.categories.find((c) => c.category === active);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="grid gap-5">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Carbon Calculator</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Slide to match your lifestyle — your footprint updates instantly.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Footprint categories">
          {TABS.map((tab) => {
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab.key)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 ${
                  isActive
                    ? 'bg-forest-600 text-white shadow-md shadow-forest-500/30'
                    : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {TABS.find((t) => t.key === active)?.label}
            </h2>
            {activeCategory && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {formatKg(activeCategory.kgCO2e)} CO₂e/mo
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="grid gap-6"
            >
              {active === 'transport' && (
                <>
                  <RangeField label="Car travel" suffix="km/mo" min={0} max={2000} step={10} value={input.transport.carKm} onChange={(v) => setSection('transport', { carKm: v })} />
                  <RangeField label="Bus travel" suffix="km/mo" min={0} max={1000} step={10} value={input.transport.busKm} onChange={(v) => setSection('transport', { busKm: v })} />
                  <RangeField label="Train travel" suffix="km/mo" min={0} max={1000} step={10} value={input.transport.trainKm} onChange={(v) => setSection('transport', { trainKm: v })} />
                  <RangeField label="Flights" suffix="hrs/mo" min={0} max={50} step={1} value={input.transport.flightHours} onChange={(v) => setSection('transport', { flightHours: v })} />
                  <SelectField label="Vehicle type" value={input.transport.vehicleType} onChange={(e) => setSection('transport', { vehicleType: e.target.value as CarbonInput['transport']['vehicleType'] })} options={[
                    { value: 'petrol', label: 'Petrol' }, { value: 'diesel', label: 'Diesel' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'electric', label: 'Electric' }
                  ]} />
                </>
              )}

              {active === 'energy' && (
                <>
                  <RangeField label="Electricity" suffix="kWh/mo" min={0} max={1500} step={10} value={input.energy.electricityKwh} onChange={(v) => setSection('energy', { electricityKwh: v })} />
                  <RangeField label="Gas" suffix="therms/mo" min={0} max={100} step={1} value={input.energy.gasTherms} onChange={(v) => setSection('energy', { gasTherms: v })} />
                  <RangeField label="Renewable share" suffix="%" min={0} max={100} step={5} value={input.energy.renewablePercent} onChange={(v) => setSection('energy', { renewablePercent: v })} />
                  <SelectField label="Grid region" value={input.energy.country} onChange={(e) => setSection('energy', { country: e.target.value as CarbonInput['energy']['country'] })} options={[
                    { value: 'india', label: 'India' }, { value: 'us', label: 'United States' }, { value: 'uk', label: 'United Kingdom' }, { value: 'eu', label: 'European Union' }, { value: 'global', label: 'Global average' }
                  ]} />
                </>
              )}

              {active === 'food' && (
                <>
                  <SelectField label="Diet" value={input.food.dietType} onChange={(e) => setSection('food', { dietType: e.target.value as CarbonInput['food']['dietType'] })} options={[
                    { value: 'vegan', label: 'Vegan' }, { value: 'vegetarian', label: 'Vegetarian' }, { value: 'mixed', label: 'Mixed' }, { value: 'meat-heavy', label: 'Meat-heavy' }
                  ]} />
                  <RangeField label="Meals per day" suffix="meals" min={1} max={5} step={1} value={input.food.mealsPerDay} onChange={(v) => setSection('food', { mealsPerDay: v })} />
                  <RangeField label="Food waste" suffix="%" min={0} max={50} step={1} value={input.food.foodWastePercent} onChange={(v) => setSection('food', { foodWastePercent: v })} />
                  <RangeField label="Local food" suffix="%" min={0} max={100} step={5} value={input.food.localFoodPercent} onChange={(v) => setSection('food', { localFoodPercent: v })} />
                </>
              )}

              {active === 'shopping' && (
                <>
                  <RangeField label="Clothing spend" suffix="₹/mo" min={0} max={20000} step={100} value={input.shopping.clothingSpend} onChange={(v) => setSection('shopping', { clothingSpend: v })} />
                  <RangeField label="Electronics spend" suffix="₹/mo" min={0} max={20000} step={100} value={input.shopping.electronicsSpend} onChange={(v) => setSection('shopping', { electronicsSpend: v })} />
                  <RangeField label="Household spend" suffix="₹/mo" min={0} max={20000} step={100} value={input.shopping.householdSpend} onChange={(v) => setSection('shopping', { householdSpend: v })} />
                  <RangeField label="Bought second-hand" suffix="%" min={0} max={100} step={5} value={input.shopping.secondHandPercent} onChange={(v) => setSection('shopping', { secondHandPercent: v })} />
                </>
              )}

              {active === 'water' && (
                <>
                  <RangeField label="Showers per week" suffix="" min={0} max={21} step={1} value={input.water.showersPerWeek} onChange={(v) => setSection('water', { showersPerWeek: v })} />
                  <RangeField label="Laundry loads" suffix="/wk" min={0} max={20} step={1} value={input.water.laundryLoads} onChange={(v) => setSection('water', { laundryLoads: v })} />
                  <RangeField label="Bottled water" suffix="L/wk" min={0} max={50} step={1} value={input.water.bottledWaterLiters} onChange={(v) => setSection('water', { bottledWaterLiters: v })} />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      {/* Sticky live snapshot */}
      <aside className="xl:sticky xl:top-24 xl:self-start">
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <Card className="relative overflow-hidden">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-forest-400 opacity-20 blur-3xl" />
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Your Snapshot</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Live monthly footprint.</p>

            <div className="my-6 rounded-2xl border border-forest-100 bg-forest-50 p-6 text-center dark:border-forest-800/50 dark:bg-forest-900/30">
              <p className="text-xs font-semibold uppercase tracking-wider text-forest-600 dark:text-forest-400">Monthly Footprint</p>
              <motion.p key={result.monthlyKgCO2e} initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="mt-2 text-5xl font-black text-gray-900 dark:text-white">
                {formatKg(result.monthlyKgCO2e)}
              </motion.p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, result.score))}%` }}
                    className={`h-full ${result.score > 70 ? 'bg-forest-500' : result.score > 40 ? 'bg-earth-500' : 'bg-red-500'}`} />
                </div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Score {result.score}/100</p>
              </div>
            </div>

            <Button className="w-full" onClick={handleSave} disabled={isSaving}>
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Snapshot saved
                  </motion.span>
                ) : (
                  <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Save className="h-5 w-5" /> Save to history
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </Card>
        </motion.div>
      </aside>
    </motion.div>
  );
}
