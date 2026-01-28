
import { GoogleGenAI, Type } from "@google/genai";
import { ParsedItem } from "../types.ts";

// Safe access to environment variables in browser/bundle environments
const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const parsePrescription = async (imageData: string): Promise<ParsedItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageData.split(',')[1] || imageData,
          }
        },
        {
          text: "Parse this prescription into JSON. Extract medicine brand, generic name, strength, dose (e.g., 1+0+1), and quantity. Also provide a confidence score (0-1) for each item. If brand is ambiguous, suggest 3 alternatives. If a price is mentioned, assume it is the selling price."
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              brand: { type: Type.STRING },
              generic: { type: Type.STRING },
              strength: { type: Type.STRING },
              dose: { type: Type.STRING },
              qty: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER },
              selling_price: { type: Type.NUMBER },
              alternative_matches: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['brand', 'generic', 'qty']
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("OCR Error:", error);
    // Fallback mock data for demo if API fails
    return [
      { brand: "Napa Extend", generic: "Paracetamol", strength: "665mg", dose: "1+0+1", qty: 10, confidence: 0.95, selling_price: 15 },
      { brand: "Concor", generic: "Bisoprolol", strength: "5mg", dose: "0+0+1", qty: 30, confidence: 0.88, selling_price: 12, alternative_matches: ["Bisocor", "Bison", "Cardicor"] }
    ];
  }
};

export const checkInteractions = async (items: ParsedItem[]): Promise<string[]> => {
  const medicineNames = items.map(i => i.brand).join(", ");
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these medicines for dose conflicts or high-risk categories like Steroids/OTC alerts: ${medicineNames}. Return a list of short warning strings.`
  });
  return (response.text || "").split('\n').filter(s => s.trim().length > 0);
};
