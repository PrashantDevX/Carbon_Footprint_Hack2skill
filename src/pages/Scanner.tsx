import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { askGemini } from '@/lib/gemini';

interface ScanResult {
  items: Array<{ name: string; category: string; footprint: number }>;
  totalFootprint: number;
}

export function Scanner() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
    setResult(null);
  };

  const handleScan = async () => {
    if (!file) return;

    setIsScanning(true);
    setError(null);

    try {
      // In a full production app, we would send this to a Firebase Function
      // which uses the Google Cloud Vision API. Here we simulate the OCR 
      // and use Gemini to parse the simulated OCR text.

      // Simulating a delay for OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const simulatedOcrText = "Receipt: \n1x Almond Milk $4.99\n1x Beef Steak 16oz $14.50\n1x Local Apples $3.00";

      const prompt = `
        Analyze this receipt text and estimate the carbon footprint (in kg CO2e) for each item. 
        Return ONLY a JSON object with this exact structure, nothing else:
        {
          "items": [
            { "name": "Item name", "category": "Food/Transport/etc", "footprint": 1.2 }
          ],
          "totalFootprint": 5.4
        }
        Receipt Text:
        ${simulatedOcrText}
      `;

      const aiResponse = await askGemini(prompt);
      
      // Attempt to parse JSON from AI response
      const jsonStr = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedResult: ScanResult = JSON.parse(jsonStr);

      setResult(parsedResult);
    } catch (err) {
      console.error(err);
      setError("Failed to scan receipt. Please try again or enter details manually.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-4">
          Scan Receipt
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload a photo of your receipt to automatically calculate its carbon footprint using Cloud Vision AI.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {!preview ? (
            <div 
              role="button"
              tabIndex={0}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:border-forest-500 hover:bg-forest-50 dark:hover:bg-forest-900/20 transition-all h-64 flex flex-col items-center justify-center group"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
            >
              <div className="w-16 h-16 bg-forest-100 dark:bg-forest-900/50 text-forest-600 dark:text-forest-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
          ) : (
            <div className="relative h-64 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
              <img src={preview} alt="Receipt preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Change
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={!file || isScanning}
            className="w-full mt-6 bg-forest-600 hover:bg-forest-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-forest-500/30 disabled:shadow-none"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning with Vision AI...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Analyze Receipt
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-forest-500" />
            Scan Results
          </h2>

          <AnimatePresence mode="wait">
            {isScanning ? (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-gray-500"
              >
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-forest-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-forest-500 rounded-full border-t-transparent animate-spin"></div>
                  <FileText className="absolute inset-0 m-auto w-8 h-8 text-forest-500 animate-pulse" />
                </div>
                <p>Extracting text and analyzing environmental impact...</p>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className="mb-6 p-4 bg-forest-50 dark:bg-forest-900/20 rounded-2xl border border-forest-100 dark:border-forest-800 text-center">
                  <p className="text-sm text-forest-600 dark:text-forest-400 font-medium mb-1">Total Estimated Footprint</p>
                  <p className="text-3xl font-bold text-forest-700 dark:text-forest-300">
                    {result.totalFootprint.toFixed(2)} <span className="text-lg font-normal">kg CO₂e</span>
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3">
                  {result.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{item.footprint.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">kg CO₂e</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full py-3 bg-earth-500 hover:bg-earth-600 text-white rounded-xl font-medium transition-colors">
                  Add to My Carbon Log
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 space-y-4"
              >
                <FileText className="w-16 h-16 opacity-20" />
                <p>Upload a receipt to see the magic happen.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
