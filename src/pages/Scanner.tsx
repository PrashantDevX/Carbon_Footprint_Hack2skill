import { Camera, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { estimateReceiptItemKg } from '@/lib/carbonCalculator';
import type { ReceiptItem } from '@/types/carbon';

const sampleReceipt = `organic milk 180
cotton shirt 699
phone charger 899
lentils 220`;

export function Scanner() {
  const [text, setText] = useState(sampleReceipt);
  const items = useMemo(() => parseReceipt(text), [text]);
  const total = items.reduce((sum, item) => sum + item.estimatedKgCO2e, 0);

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-sky-100 text-sky">
            <Camera />
          </span>
          <div>
            <h1 className="text-2xl font-black">Receipt scanner</h1>
            <p className="text-sm text-slate-500">Cloud Vision ready; demo parser works offline</p>
          </div>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-slate-700" htmlFor="receipt-text">
          OCR text
          <textarea
            id="receipt-text"
            className="min-h-72 rounded-md border border-slate-300 p-3 text-base outline-none focus:ring-2 focus:ring-leaf"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <Button className="mt-4" icon={<Upload size={18} />}>Upload image</Button>
      </Card>
      <Card>
        <h2 className="text-xl font-black">Detected footprint</h2>
        <p className="mt-1 text-slate-600">Estimated total: <strong>{total.toFixed(1)} kgCO2e</strong></p>
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">kgCO2e</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name} className="border-t border-slate-100">
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3 capitalize text-slate-600">{item.category}</td>
                  <td className="p-3 text-right font-semibold">{item.estimatedKgCO2e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function parseReceipt(text: string): ReceiptItem[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const price = Number(line.match(/(\d+)(?!.*\d)/)?.[1] ?? 100);
      const name = line.replace(/\d+$/, '').trim();
      const lower = name.toLowerCase();
      const category = lower.includes('shirt') || lower.includes('jeans')
        ? 'clothing'
        : lower.includes('phone') || lower.includes('charger')
          ? 'electronics'
          : lower.includes('soap') || lower.includes('cleaner')
            ? 'household'
            : lower ? 'groceries' : 'unknown';
      return { name, price, category, estimatedKgCO2e: estimateReceiptItemKg(name, price) };
    });
}
