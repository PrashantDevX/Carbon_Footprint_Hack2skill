import { Bike, Bus, MapPinned, Recycle, Store } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const places = [
  { name: 'Metro station', type: 'Transit', distance: '0.8 km', impact: 'Avoid 2.6 kg per commute', icon: Bus, x: '28%', y: '48%' },
  { name: 'Cycle repair hub', type: 'Mobility', distance: '1.4 km', impact: 'Keep bike trips practical', icon: Bike, x: '52%', y: '36%' },
  { name: 'Refill grocery', type: 'Shopping', distance: '2.1 km', impact: 'Reduce packaging waste', icon: Store, x: '68%', y: '62%' },
  { name: 'E-waste drop', type: 'Recycling', distance: '3.2 km', impact: 'Recover device materials', icon: Recycle, x: '42%', y: '70%' }
];

export function GreenMap() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card className="min-h-[72vh] overflow-hidden p-0">
        <div className="relative h-[72vh] min-h-[480px] bg-[linear-gradient(135deg,#dff5f0,#fef3c7_55%,#dbeafe)]">
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(#64748b_1px,transparent_1px),linear-gradient(90deg,#64748b_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="absolute left-[10%] top-[20%] h-[64%] w-[18px] rotate-[28deg] rounded-full bg-white/80 shadow" />
          <div className="absolute left-[18%] top-[54%] h-[16px] w-[66%] -rotate-[8deg] rounded-full bg-white/80 shadow" />
          <div className="absolute left-[56%] top-[12%] h-[72%] w-[14px] -rotate-[16deg] rounded-full bg-white/80 shadow" />
          {places.map((place) => (
            <div key={place.name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: place.x, top: place.y }}>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-leaf shadow-soft ring-4 ring-white/60">
                <place.icon aria-hidden="true" />
              </span>
            </div>
          ))}
          <div className="absolute left-5 top-5 rounded-lg bg-white/90 p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <MapPinned className="text-leaf" />
              <div>
                <h1 className="text-xl font-black">Green alternatives nearby</h1>
                <p className="text-sm text-slate-600">Google Maps API ready with demo fallback</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div className="grid gap-4">
        {places.map((place) => (
          <Card key={place.name} className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-teal-50 text-leaf">
              <place.icon aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-500">{place.type} · {place.distance}</p>
              <h2 className="text-lg font-black">{place.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{place.impact}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
