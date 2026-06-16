import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, FileText, CheckCircle, AlertCircle, Loader2, Check } from 'lucide-react';
import { analyzeReceiptImage, type ReceiptScan } from '@/lib/gemini';
import { useCarbon } from '@/hooks/useCarbon';

/** Read a File into a base64 string (without the data: prefix) for the Gemini API. */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Scanner() {
  const { addReceipt } = useCarbon();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ReceiptScan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    if (selected.size > 8 * 1024 * 1024) {
      setError('Image is too large (max 8 MB).');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
    setResult(null);
    setAdded(false);
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setError(null);
    setAdded(false);

    try {
      const base64 = await fileToBase64(file);
      const scan = await analyzeReceiptImage(base64, file.type);
      if (!scan.items.length) {
        setError('No items could be read from this receipt. Try a clearer, well-lit photo.');
      }
      setResult(scan);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Failed to scan receipt. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddToLog = () => {
    if (!result || !result.items.length) return;
    addReceipt({ items: result.items, totalKgCO2e: result.totalFootprint });
    setAdded(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-3">Scan Receipt</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload or photograph a receipt — Gemini Vision reads the items and estimates their carbon footprint.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl">
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={cameraInputRef}
            onChange={handleFileChange}
          />

          {!preview ? (
            <div className="grid h-64 grid-rows-[1fr_auto] gap-3">
              <div
                role="button"
                tabIndex={0}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center cursor-pointer hover:border-forest-500 hover:bg-forest-50 dark:hover:bg-forest-900/20 transition-all group"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
              >
                <div className="w-14 h-14 bg-forest-100 dark:bg-forest-900/50 text-forest-600 dark:text-forest-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" aria-hidden="true" />
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Click to upload</p>
                <p className="text-sm text-gray-500">PNG, JPG (max 8 MB)</p>
              </div>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Camera className="w-4 h-4" aria-hidden="true" /> Take a photo
              </button>
            </div>
          ) : (
            <div className="relative h-64 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
              <img src={preview} alt="Receipt preview" className="w-full h-full object-contain bg-gray-50 dark:bg-gray-900" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Change
                </button>
                <button onClick={() => cameraInputRef.current?.click()} className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Retake
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3" role="alert">
              <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={!file || isScanning}
            className="w-full mt-6 bg-forest-600 hover:bg-forest-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-forest-500/30 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with Gemini Vision…</>
            ) : (
              <><FileText className="w-5 h-5" /> Analyze Receipt</>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-forest-500" aria-hidden="true" /> Scan Results
          </h2>

          <AnimatePresence mode="wait">
            {isScanning ? (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-forest-100 dark:border-forest-900 rounded-full" />
                  <div className="absolute inset-0 border-4 border-forest-500 rounded-full border-t-transparent animate-spin" />
                  <FileText className="absolute inset-0 m-auto w-8 h-8 text-forest-500 animate-pulse" />
                </div>
                <p>Reading items and estimating impact…</p>
              </motion.div>
            ) : result && result.items.length > 0 ? (
              <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
                <div className="mb-4 p-4 bg-forest-50 dark:bg-forest-900/20 rounded-2xl border border-forest-100 dark:border-forest-800 text-center">
                  <p className="text-sm text-forest-600 dark:text-forest-400 font-medium mb-1">Total Estimated Footprint</p>
                  <p className="text-3xl font-bold text-forest-700 dark:text-forest-300">
                    {result.totalFootprint.toFixed(2)} <span className="text-lg font-normal">kg CO₂e</span>
                  </p>
                  <p className="mt-1 text-xs text-forest-600/70 dark:text-forest-400/70">{result.items.length} item(s) detected</p>
                </div>

                <ul className="flex-1 overflow-y-auto space-y-2 max-h-72 pr-1">
                  {result.items.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                      </div>
                      <div className="text-right shrink-0 pl-3">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{item.footprint.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">kg CO₂e</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleAddToLog}
                  disabled={added}
                  className={`mt-6 w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300 cursor-default'
                      : 'bg-earth-500 hover:bg-earth-600 text-white'
                  }`}
                >
                  {added ? (<><Check className="w-5 h-5" /> Added to your carbon log</>) : 'Add to My Carbon Log'}
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
                <FileText className="w-16 h-16 opacity-20" aria-hidden="true" />
                <p>Upload or photograph a receipt to see its footprint.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
