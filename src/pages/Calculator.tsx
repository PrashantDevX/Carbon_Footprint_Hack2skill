import { Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, SelectField } from '@/components/ui/Field';
import { useCarbon } from '@/hooks/useCarbon';
import type { CarbonInput } from '@/types/carbon';
import { formatKg } from '@/lib/utils';

export function Calculator() {
  const { input, result, updateInput, saveLog } = useCarbon();

  const setSection = <K extends keyof CarbonInput>(section: K, value: Partial<CarbonInput[K]>) => {
    updateInput(section, { ...input[section], ...value });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <div className="grid gap-5">
        <Section title="Transport">
          <Field label="Car travel" type="number" suffix="km" value={input.transport.carKm} onChange={(event) => setSection('transport', { carKm: Number(event.target.value) })} />
          <Field label="Bus travel" type="number" suffix="km" value={input.transport.busKm} onChange={(event) => setSection('transport', { busKm: Number(event.target.value) })} />
          <Field label="Train travel" type="number" suffix="km" value={input.transport.trainKm} onChange={(event) => setSection('transport', { trainKm: Number(event.target.value) })} />
          <Field label="Flight hours" type="number" suffix="hrs" value={input.transport.flightHours} onChange={(event) => setSection('transport', { flightHours: Number(event.target.value) })} />
          <SelectField label="Vehicle type" value={input.transport.vehicleType} onChange={(event) => setSection('transport', { vehicleType: event.target.value as CarbonInput['transport']['vehicleType'] })} options={[
            { value: 'petrol', label: 'Petrol' },
            { value: 'diesel', label: 'Diesel' },
            { value: 'hybrid', label: 'Hybrid' },
            { value: 'electric', label: 'Electric' }
          ]} />
        </Section>

        <Section title="Home energy">
          <Field label="Electricity" type="number" suffix="kWh" value={input.energy.electricityKwh} onChange={(event) => setSection('energy', { electricityKwh: Number(event.target.value) })} />
          <Field label="Gas" type="number" suffix="therms" value={input.energy.gasTherms} onChange={(event) => setSection('energy', { gasTherms: Number(event.target.value) })} />
          <Field label="Renewable share" type="number" suffix="%" min={0} max={100} value={input.energy.renewablePercent} onChange={(event) => setSection('energy', { renewablePercent: Number(event.target.value) })} />
          <SelectField label="Grid region" value={input.energy.country} onChange={(event) => setSection('energy', { country: event.target.value as CarbonInput['energy']['country'] })} options={[
            { value: 'india', label: 'India' },
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'eu', label: 'European Union' },
            { value: 'global', label: 'Global average' }
          ]} />
        </Section>

        <Section title="Food, shopping, water">
          <SelectField label="Diet" value={input.food.dietType} onChange={(event) => setSection('food', { dietType: event.target.value as CarbonInput['food']['dietType'] })} options={[
            { value: 'vegan', label: 'Vegan' },
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'mixed', label: 'Mixed' },
            { value: 'meat-heavy', label: 'Meat-heavy' }
          ]} />
          <Field label="Food waste" type="number" suffix="%" value={input.food.foodWastePercent} onChange={(event) => setSection('food', { foodWastePercent: Number(event.target.value) })} />
          <Field label="Local food" type="number" suffix="%" value={input.food.localFoodPercent} onChange={(event) => setSection('food', { localFoodPercent: Number(event.target.value) })} />
          <Field label="Clothing spend" type="number" suffix="INR" value={input.shopping.clothingSpend} onChange={(event) => setSection('shopping', { clothingSpend: Number(event.target.value) })} />
          <Field label="Electronics spend" type="number" suffix="INR" value={input.shopping.electronicsSpend} onChange={(event) => setSection('shopping', { electronicsSpend: Number(event.target.value) })} />
          <Field label="Second-hand share" type="number" suffix="%" value={input.shopping.secondHandPercent} onChange={(event) => setSection('shopping', { secondHandPercent: Number(event.target.value) })} />
          <Field label="Showers" type="number" suffix="/wk" value={input.water.showersPerWeek} onChange={(event) => setSection('water', { showersPerWeek: Number(event.target.value) })} />
          <Field label="Laundry loads" type="number" suffix="/mo" value={input.water.laundryLoads} onChange={(event) => setSection('water', { laundryLoads: Number(event.target.value) })} />
        </Section>
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <Card>
          <h1 className="text-2xl font-black">Calculator</h1>
          <p className="mt-2 text-slate-600">Adjust monthly activity to update your live footprint.</p>
          <div className="my-5 rounded-lg bg-teal-50 p-5 text-center">
            <p className="text-sm font-semibold text-leaf">Monthly footprint</p>
            <p className="mt-1 text-4xl font-black">{formatKg(result.monthlyKgCO2e)}</p>
            <p className="mt-1 text-sm text-slate-600">Score {result.score}/100</p>
          </div>
          <Button className="w-full" icon={<Save size={18} />} onClick={() => saveLog()}>
            Save snapshot
          </Button>
        </Card>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-black">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </Card>
  );
}
