import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, SelectField } from '@/components/ui/Field';
import { useCarbon } from '@/hooks/useCarbon';
import type { CarbonInput } from '@/types/carbon';
import { formatKg } from '@/lib/utils';

export function Calculator() {
  const { input, result, updateInput, saveLog } = useCarbon();
  const [isSaving, setIsSaving] = useState(false);

  const setSection = <K extends keyof CarbonInput>(section: K, value: Partial<CarbonInput[K]>) => {
    updateInput(section, { ...input[section], ...value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveLog();
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6 xl:grid-cols-[1fr_340px]"
    >
      <div className="grid gap-6">
        <Section title="Transport" index={0}>
          <Field label="Car travel" type="number" suffix="km" value={input.transport.carKm} onChange={(e) => setSection('transport', { carKm: Number(e.target.value) })} />
          <Field label="Bus travel" type="number" suffix="km" value={input.transport.busKm} onChange={(e) => setSection('transport', { busKm: Number(e.target.value) })} />
          <Field label="Train travel" type="number" suffix="km" value={input.transport.trainKm} onChange={(e) => setSection('transport', { trainKm: Number(e.target.value) })} />
          <Field label="Flight hours" type="number" suffix="hrs" value={input.transport.flightHours} onChange={(e) => setSection('transport', { flightHours: Number(e.target.value) })} />
          <SelectField label="Vehicle type" value={input.transport.vehicleType} onChange={(e) => setSection('transport', { vehicleType: e.target.value as CarbonInput['transport']['vehicleType'] })} options={[
            { value: 'petrol', label: 'Petrol' },
            { value: 'diesel', label: 'Diesel' },
            { value: 'hybrid', label: 'Hybrid' },
            { value: 'electric', label: 'Electric' }
          ]} />
        </Section>

        <Section title="Home Energy" index={1}>
          <Field label="Electricity" type="number" suffix="kWh" value={input.energy.electricityKwh} onChange={(e) => setSection('energy', { electricityKwh: Number(e.target.value) })} />
          <Field label="Gas" type="number" suffix="therms" value={input.energy.gasTherms} onChange={(e) => setSection('energy', { gasTherms: Number(e.target.value) })} />
          <Field label="Renewable share" type="number" suffix="%" min={0} max={100} value={input.energy.renewablePercent} onChange={(e) => setSection('energy', { renewablePercent: Number(e.target.value) })} />
          <SelectField label="Grid region" value={input.energy.country} onChange={(e) => setSection('energy', { country: e.target.value as CarbonInput['energy']['country'] })} options={[
            { value: 'india', label: 'India' },
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'eu', label: 'European Union' },
            { value: 'global', label: 'Global average' }
          ]} />
        </Section>

        <Section title="Lifestyle & Consumption" index={2}>
          <SelectField label="Diet" value={input.food.dietType} onChange={(e) => setSection('food', { dietType: e.target.value as CarbonInput['food']['dietType'] })} options={[
            { value: 'vegan', label: 'Vegan' },
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'mixed', label: 'Mixed' },
            { value: 'meat-heavy', label: 'Meat-heavy' }
          ]} />
          <Field label="Food waste" type="number" suffix="%" value={input.food.foodWastePercent} onChange={(e) => setSection('food', { foodWastePercent: Number(e.target.value) })} />
          <Field label="Local food" type="number" suffix="%" value={input.food.localFoodPercent} onChange={(e) => setSection('food', { localFoodPercent: Number(e.target.value) })} />
          <Field label="Clothing spend" type="number" suffix="INR" value={input.shopping.clothingSpend} onChange={(e) => setSection('shopping', { clothingSpend: Number(e.target.value) })} />
          <Field label="Electronics spend" type="number" suffix="INR" value={input.shopping.electronicsSpend} onChange={(e) => setSection('shopping', { electronicsSpend: Number(e.target.value) })} />
          <Field label="Second-hand share" type="number" suffix="%" value={input.shopping.secondHandPercent} onChange={(e) => setSection('shopping', { secondHandPercent: Number(e.target.value) })} />
        </Section>
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-panel border-0 overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-forest-400 opacity-20 rounded-full blur-3xl"></div>
            
            <h1 className="text-2xl font-display font-black text-gray-900 dark:text-white">Your Snapshot</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Adjust your activities to instantly see the impact on your monthly footprint.</p>
            
            <div className="my-8 rounded-2xl bg-forest-50 dark:bg-forest-900/30 p-6 text-center border border-forest-100 dark:border-forest-800/50 relative overflow-hidden transition-all duration-300">
              <p className="text-sm font-semibold tracking-wider uppercase text-forest-600 dark:text-forest-400">Monthly Footprint</p>
              <motion.p 
                key={result.monthlyKgCO2e}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-2 text-5xl font-black text-gray-900 dark:text-white"
              >
                {formatKg(result.monthlyKgCO2e)}
              </motion.p>
              
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-2 flex-1 max-w-[100px] bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, result.score))}%` }}
                    className={`h-full ${result.score > 70 ? 'bg-forest-500' : result.score > 40 ? 'bg-earth-500' : 'bg-red-500'}`}
                  />
                </div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Score {result.score}/100</p>
              </div>
            </div>

            <Button 
              className={`w-full text-white shadow-lg transition-all duration-300 ${isSaving ? 'bg-forest-500' : 'bg-gray-900 dark:bg-forest-600 hover:bg-gray-800 dark:hover:bg-forest-700'}`}
              onClick={handleSave}
              disabled={isSaving}
            >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div key="saved" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Snapshot Saved
                  </motion.div>
                ) : (
                  <motion.div key="save" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center gap-2">
                    <Save className="w-5 h-5" /> Save to History
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </Card>
        </motion.div>
      </aside>
    </motion.div>
  );
}

function Section({ title, index, children }: { title: string; index: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="glass-panel border-0 group hover:shadow-xl transition-shadow duration-300">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white flex items-center justify-between">
          {title}
          <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-forest-500 transition-colors" />
        </h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {children}
        </div>
      </Card>
    </motion.div>
  );
}
