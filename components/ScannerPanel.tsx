
import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertTriangle, Save, Trash2, ScanLine } from 'lucide-react';
import { parsePrescription, checkInteractions } from '../services/geminiService.ts';
import { ParsedItem, Medicine } from '../types.ts';
import { MOCK_MEDICINES, SUCCESS_GREEN, WARNING_YELLOW, DANGER_RED } from '../constants.tsx';

interface ScannerPanelProps {
  onItemsVerified: (items: ParsedItem[]) => void;
}

const ScannerPanel: React.FC<ScannerPanelProps> = ({ onItemsVerified }) => {
  const [scanning, setScanning] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedItem[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulateScan = async (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      
      const results = await parsePrescription(base64String);
      setParsedData(results);
      
      const clinicalAlerts = await checkInteractions(results);
      setAlerts(clinicalAlerts);
      
      setIsProcessing(false);
      setScanning(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSimulateScan(e.target.files[0]);
    }
  };

  const updateParsedItem = (index: number, field: keyof ParsedItem, value: any) => {
    const updated = [...parsedData];
    updated[index] = { ...updated[index], [field]: value };
    setParsedData(updated);
  };

  const addToBill = () => {
    onItemsVerified(parsedData);
    setScanning(false);
    setParsedData([]);
    setPreviewUrl(null);
  };

  const getConfidenceColor = (score: number) => {
    if (score > 0.9) return SUCCESS_GREEN;
    if (score > 0.7) return WARNING_YELLOW;
    return DANGER_RED;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <ScanLine className="text-[#10B981]" size={20} />
          AI Prescription Scanner
        </h3>
        {!scanning && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Camera size={18} />
            Scan New Prescription
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      {isProcessing ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 border-4 border-[#10B981]/20 border-t-[#10B981] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-900 font-semibold">OCR Parsing in Progress...</p>
          <p className="text-sm text-gray-500">Extracting medicines and dosages via Gemini Vision</p>
        </div>
      ) : !scanning ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
            <Camera size={40} />
          </div>
          <p className="text-gray-600 max-w-xs mb-8">
            Upload or capture a prescription photo. Our AI will automatically identify medicines, dosages, and stock availability.
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-[#10B981] hover:bg-white p-8 rounded-2xl transition-all"
          >
            <p className="text-gray-400 font-medium">Drop prescription image here or click to browse</p>
          </button>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 border-r border-gray-100 bg-black flex items-center justify-center p-4">
            <img src={previewUrl || ""} className="max-h-full max-w-full object-contain rounded-lg opacity-90" />
          </div>

          <div className="w-1/2 flex flex-col h-full overflow-hidden">
            <div className="p-4 bg-gray-50 flex-1 overflow-y-auto space-y-4">
              {alerts.length > 0 && (
                <div className="bg-red-50 border border-red-100 p-3 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-red-600 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle size={14} /> Clinical Alerts
                  </div>
                  {alerts.map((alert, i) => (
                    <p key={i} className="text-xs text-red-700">{alert}</p>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {parsedData.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group relative">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <input 
                          value={item.brand} 
                          onChange={(e) => updateParsedItem(idx, 'brand', e.target.value)}
                          className="font-bold text-gray-900 border-none p-0 focus:ring-0 w-full text-lg"
                        />
                        <input 
                          value={item.generic} 
                          onChange={(e) => updateParsedItem(idx, 'generic', e.target.value)}
                          className="text-sm text-gray-500 border-none p-0 focus:ring-0 w-full"
                        />
                      </div>
                      <div className="text-right">
                         <span 
                           className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                           style={{ backgroundColor: `${getConfidenceColor(item.confidence)}20`, color: getConfidenceColor(item.confidence) }}
                         >
                           {Math.round(item.confidence * 100)}% Conf
                         </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-bold">Dose</label>
                        <input 
                          value={item.dose} 
                          onChange={(e) => updateParsedItem(idx, 'dose', e.target.value)}
                          className="w-full text-sm bg-gray-50 border-gray-100 rounded-lg p-2 focus:border-[#10B981] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-bold">Qty</label>
                        <input 
                          type="number"
                          value={item.qty} 
                          onChange={(e) => updateParsedItem(idx, 'qty', parseInt(e.target.value))}
                          className="w-full text-sm bg-gray-50 border-gray-100 rounded-lg p-2 focus:border-[#10B981] outline-none"
                        />
                      </div>
                    </div>

                    {item.alternative_matches && item.alternative_matches.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-dashed border-gray-100">
                        <label className="text-[10px] text-orange-500 uppercase font-bold flex items-center gap-1 mb-1">
                          <RefreshCw size={10} /> Alternative Matches
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {item.alternative_matches.map((alt, ai) => (
                            <button 
                              key={ai}
                              onClick={() => updateParsedItem(idx, 'brand', alt)}
                              className="text-[11px] bg-orange-50 text-orange-600 px-2 py-1 rounded-md hover:bg-orange-100"
                            >
                              {alt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex gap-3">
              <button 
                onClick={() => setScanning(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={addToBill}
                className="flex-[2] px-4 py-2 bg-[#10B981] text-white rounded-xl hover:bg-[#059669] text-sm font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                Verify & Add to Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerPanel;
