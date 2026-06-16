import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Bike, Bus, Recycle, Store, MapPinned, Loader2, Navigation, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

type LatLng = { lat: number; lng: number };

/**
 * Minimal structural type for the subset of the Google Maps JS API this page
 * uses. Defined locally to keep strong typing without pulling in the full
 * `@types/google.maps` package.
 */
interface GoogleMapsApi {
  maps: {
    Map: new (el: HTMLElement, opts: Record<string, unknown>) => unknown;
    Marker: new (opts: Record<string, unknown>) => unknown;
    SymbolPath: { CIRCLE: number };
    places: {
      PlacesService: new (map: unknown) => {
        nearbySearch: (
          request: { location: LatLng; radius: number; type: string },
          callback: (results: PlaceResult[] | null, status: string) => void
        ) => void;
      };
    };
  };
}

interface PlaceResult {
  name: string;
  vicinity?: string;
  geometry?: { location: unknown };
}

interface Place {
  name: string;
  type: string;
  vicinity?: string;
  icon: typeof Bus;
}

// Green place categories to search for around the user.
const GREEN_QUERIES: { type: string; label: string; icon: typeof Bus }[] = [
  { type: 'transit_station', label: 'Transit', icon: Bus },
  { type: 'bicycle_store', label: 'Cycling', icon: Bike },
  { type: 'recycling', label: 'Recycling', icon: Recycle },
  { type: 'supermarket', label: 'Refill / grocery', icon: Store }
];

// Static fallback shown when no Maps API key is configured.
const fallbackPlaces: Place[] = [
  { name: 'Metro station', type: 'Transit · 0.8 km', vicinity: 'Avoid ~2.6 kg CO₂e per commute', icon: Bus },
  { name: 'Cycle repair hub', type: 'Mobility · 1.4 km', vicinity: 'Keep bike trips practical', icon: Bike },
  { name: 'Refill grocery', type: 'Shopping · 2.1 km', vicinity: 'Reduce packaging waste', icon: Store },
  { name: 'E-waste drop', type: 'Recycling · 3.2 km', vicinity: 'Recover device materials', icon: Recycle }
];

export function GreenMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    let cancelled = false;
    setStatus('loading');

    const init = async () => {
      try {
        const loader = new Loader({ apiKey, version: 'weekly', libraries: ['places'] });
        const google = (await loader.load()) as unknown as GoogleMapsApi;
        if (cancelled || !mapRef.current) return;

        const center = await getUserLocation().catch(() => ({ lat: 28.6139, lng: 77.209 })); // Delhi fallback
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || undefined,
          disableDefaultUI: true,
          zoomControl: true
        });

        new google.maps.Marker({
          position: center,
          map,
          title: 'You are here',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#16a34a',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2
          }
        });

        const service = new google.maps.places.PlacesService(map);
        const collected: Place[] = [];

        await Promise.all(
          GREEN_QUERIES.map(
            (query) =>
              new Promise<void>((resolve) => {
                service.nearbySearch(
                  { location: center, radius: 4000, type: query.type },
                  (results: PlaceResult[] | null, searchStatus: string) => {
                    if (searchStatus === 'OK' && results) {
                      results.slice(0, 2).forEach((r) => {
                        collected.push({ name: r.name, type: query.label, vicinity: r.vicinity, icon: query.icon });
                        if (r.geometry?.location) {
                          new google.maps.Marker({ position: r.geometry.location, map, title: r.name });
                        }
                      });
                    }
                    resolve();
                  }
                );
              })
          )
        );

        if (cancelled) return;
        setPlaces(collected);
        setStatus('ready');
      } catch (err) {
        console.error('Map load failed:', err);
        if (!cancelled) {
          setStatus('error');
          setMessage('Could not load the live map. Showing suggested green spots instead.');
        }
      }
    };

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  const usingFallback = !apiKey || status === 'error';
  const listed = usingFallback ? fallbackPlaces : places;

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card className="min-h-[72vh] overflow-hidden p-0">
        {usingFallback ? (
          <StaticMap />
        ) : (
          <div className="relative h-full min-h-[480px]">
            <div ref={mapRef} className="h-full min-h-[480px] w-full" />
            {status === 'loading' && (
              <div className="absolute inset-0 grid place-items-center bg-white/70 dark:bg-gray-900/70">
                <div className="flex items-center gap-2 text-forest-600 dark:text-forest-400">
                  <Loader2 className="h-5 w-5 animate-spin" /> Finding green spots near you…
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="grid gap-4 self-start">
        <Card>
          <div className="flex items-center gap-2">
            <MapPinned className="text-forest-600 dark:text-forest-400" aria-hidden="true" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Green alternatives nearby</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {usingFallback ? 'Demo locations — add a Maps API key for live results.' : 'Live results around your location.'}
          </p>
          {message && (
            <p className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-3.5 w-3.5" /> {message}
            </p>
          )}
        </Card>

        {status === 'ready' && listed.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">No nearby green spots found within 4 km.</p>
          </Card>
        ) : (
          listed.map((place, idx) => (
            <Card key={`${place.name}-${idx}`} className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-600 dark:bg-forest-900/40 dark:text-forest-400">
                <place.icon aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{place.type}</p>
                <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">{place.name}</h2>
                {place.vicinity && <p className="mt-0.5 truncate text-sm text-gray-600 dark:text-gray-400">{place.vicinity}</p>}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('No geolocation'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 8000 }
    );
  });
}

/** Decorative non-API map used when no key is configured. */
function StaticMap() {
  const pins = [
    { icon: Bus, x: '28%', y: '48%' },
    { icon: Bike, x: '52%', y: '36%' },
    { icon: Store, x: '68%', y: '62%' },
    { icon: Recycle, x: '42%', y: '70%' }
  ];
  return (
    <div className="relative h-[72vh] min-h-[480px] bg-[linear-gradient(135deg,#dff5f0,#fef3c7_55%,#dbeafe)] dark:bg-[linear-gradient(135deg,#0b3b2e,#1f2937_55%,#0f2a3f)]">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#64748b_1px,transparent_1px),linear-gradient(90deg,#64748b_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute left-[10%] top-[20%] h-[64%] w-[18px] rotate-[28deg] rounded-full bg-white/80 shadow dark:bg-white/20" />
      <div className="absolute left-[18%] top-[54%] h-[16px] w-[66%] -rotate-[8deg] rounded-full bg-white/80 shadow dark:bg-white/20" />
      <div className="absolute left-[56%] top-[12%] h-[72%] w-[14px] -rotate-[16deg] rounded-full bg-white/80 shadow dark:bg-white/20" />
      {pins.map((pin, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: pin.x, top: pin.y }}>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-forest-600 shadow-lg ring-4 ring-white/60 dark:bg-gray-800 dark:text-forest-400">
            <pin.icon aria-hidden="true" />
          </span>
        </div>
      ))}
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-xl bg-white/90 px-4 py-3 shadow-lg dark:bg-gray-800/90">
        <Navigation className="text-forest-600 dark:text-forest-400" aria-hidden="true" />
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Demo map · add a Maps API key for live data</p>
      </div>
    </div>
  );
}
