
import React from 'react';
import { Medicine, Patient, StockLog } from './types';

export const BRAND_GREEN = '#10B981';
export const SUCCESS_GREEN = '#16A34A';
export const WARNING_YELLOW = '#F59E0B';
export const DANGER_RED = '#EF4444';

const BASE_MEDICINES: Medicine[] = [
  // Specific High-Priority Medicines (Manual Entries)
  { id: 'm1', brand: 'Napa', generic: 'Paracetamol', strength: '500mg', pack_size: 10, buying_price: 0.8, selling_price: 1.2, rack: 'A1-01', stock_total: 500, min_stock: 100 },
  { id: 'm2', brand: 'Napa Extend', generic: 'Paracetamol', strength: '665mg', pack_size: 10, buying_price: 1.5, selling_price: 2.0, rack: 'A1-02', stock_total: 300, min_stock: 50 },
  { id: 'm3', brand: 'Ace', generic: 'Paracetamol', strength: '500mg', pack_size: 10, buying_price: 0.8, selling_price: 1.2, rack: 'A1-03', stock_total: 450, min_stock: 100 },
  { id: 'm4', brand: 'Ace Plus', generic: 'Paracetamol + Caffeine', strength: '500mg+65mg', pack_size: 10, buying_price: 2.1, selling_price: 2.5, rack: 'A1-04', stock_total: 200, min_stock: 40 },
  { id: 'm5', brand: 'Fast', generic: 'Paracetamol', strength: '500mg', pack_size: 10, buying_price: 0.7, selling_price: 1.0, rack: 'A1-05', stock_total: 150, min_stock: 50 },
  { id: 'm6', brand: 'Sergel', generic: 'Esomeprazole', strength: '20mg', pack_size: 14, buying_price: 5.5, selling_price: 7.0, rack: 'B1-01', stock_total: 400, min_stock: 100 },
  { id: 'm7', brand: 'Sergel', generic: 'Esomeprazole', strength: '40mg', pack_size: 14, buying_price: 8.5, selling_price: 10.0, rack: 'B1-02', stock_total: 20, min_stock: 50 },
  { id: 'm8', brand: 'Seclo', generic: 'Omeprazole', strength: '20mg', pack_size: 14, buying_price: 4.2, selling_price: 5.0, rack: 'B1-03', stock_total: 0, min_stock: 100 },
  { id: 'm9', brand: 'Pantonix', generic: 'Pantoprazole', strength: '20mg', pack_size: 10, buying_price: 5.5, selling_price: 7.0, rack: 'B1-04', stock_total: 350, min_stock: 50 },
  { id: 'm10', brand: 'Maxpro', generic: 'Esomeprazole', strength: '20mg', pack_size: 14, buying_price: 5.8, selling_price: 7.0, rack: 'B2-01', stock_total: 12, min_stock: 60 },
  { id: 'm11', brand: 'Nexum', generic: 'Esomeprazole', strength: '20mg', pack_size: 14, buying_price: 6.0, selling_price: 7.0, rack: 'B2-02', stock_total: 180, min_stock: 40 },
  { id: 'm12', brand: 'Finix', generic: 'Rabeprazole', strength: '20mg', pack_size: 10, buying_price: 6.2, selling_price: 8.0, rack: 'B2-03', stock_total: 150, min_stock: 30 },
  { id: 'm13', brand: 'Entacyd', generic: 'Antacid', strength: 'Suspension', pack_size: 1, buying_price: 65, selling_price: 85, rack: 'B3-01', stock_total: 5, min_stock: 10 },
  { id: 'm14', brand: 'Flatameal DS', generic: 'Antacid + Simethicone', strength: 'Tablet', pack_size: 10, buying_price: 15, selling_price: 20, rack: 'B3-02', stock_total: 120, min_stock: 30 },
  { id: 'm15', brand: 'Fexo', generic: 'Fexofenadine', strength: '120mg', pack_size: 10, buying_price: 6.5, selling_price: 8.0, rack: 'C1-01', stock_total: 600, min_stock: 100 },
  { id: 'm16', brand: 'Fexo', generic: 'Fexofenadine', strength: '180mg', pack_size: 10, buying_price: 9.5, selling_price: 12.0, rack: 'C1-02', stock_total: 2, min_stock: 50 },
  { id: 'm17', brand: 'Alatrol', generic: 'Cetirizine', strength: '10mg', pack_size: 10, buying_price: 2.5, selling_price: 3.5, rack: 'C1-03', stock_total: 800, min_stock: 100 },
  { id: 'm18', brand: 'Fenadin', generic: 'Fexofenadine', strength: '120mg', pack_size: 10, buying_price: 6.0, selling_price: 8.0, rack: 'C1-04', stock_total: 0, min_stock: 50 },
  { id: 'm19', brand: 'Deslor', generic: 'Desloratadine', strength: '5mg', pack_size: 10, buying_price: 4.5, selling_price: 6.0, rack: 'C2-01', stock_total: 300, min_stock: 40 },
  { id: 'm20', brand: 'Bilastin', generic: 'Bilastine', strength: '20mg', pack_size: 10, buying_price: 12.5, selling_price: 15.0, rack: 'C2-02', stock_total: 15, min_stock: 30 },

  // Generative data to complete the 300+ list
  ...Array.from({ length: 280 }, (_, i) => {
    const brands = [
      'Zimax', 'Lisinop', 'Janumet', 'Ventolin', 'Seretide', 'Symbicort', 'Xalatan', 'Tobradex', 
      'Jardiance', 'Galvus Met', 'Ecosprin', 'Telma', 'Clopilet', 'Pantocid', 'Liv.52', 'Cremaffin', 
      'Dulcolax', 'Voveran', 'Brufen', 'Augmentin', 'Ciprol', 'Oflox', 'Metrogyl', 'Wysolone', 
      'Dexona', 'Thyronorm', 'Eltroxin', 'Shelcal', 'Evion', 'Becosules', 'Limcee', 'Folvite', 
      'Autrin', 'Amaryl', 'Gluconorm', 'Glycomet', 'Voglibose', 'Cardace', 'Amlokind', 'Losar', 
      'Starpress', 'Cilacar', 'Rosuvas', 'Lipvas', 'Aricep', 'Levipil', 'Encorate', 'Pacitane', 'Stemetil'
    ];
    const generics = [
      'Azithromycin', 'Lisinopril', 'Sitagliptin', 'Salbutamol', 'Salmeterol', 'Budesonide', 'Latanoprost',
      'Tobramycin', 'Empagliflozin', 'Vildagliptin', 'Aspirin', 'Telmisartan', 'Clopidogrel', 'Pantoprazole',
      'Herbal Extract', 'Liquid Paraffin', 'Bisacodyl', 'Diclofenac', 'Ibuprofen', 'Amoxicillin', 'Ciprofloxacin',
      'Ofloxacin', 'Metronidazole', 'Prednisolone', 'Dexamethasone', 'Thyroxine', 'Thyroxine', 'Calcium', 
      'Vitamin E', 'Vitamin B', 'Vitamin C', 'Folic Acid', 'Iron', 'Glimepiride', 'Glimepiride', 'Metformin',
      'Voglibose', 'Ramipril', 'Amlodipine', 'Losartan', 'Metoprolol', 'Cilnidipine', 'Rosuvastatin', 'Atorvastatin'
    ];
    
    // Distribution for testing: 10% out of stock, 25% low stock, 65% normal stock
    const rand = Math.random();
    let stock;
    if (rand < 0.10) {
      stock = 0;
    } else if (rand < 0.35) {
      stock = Math.floor(Math.random() * 25) + 1; // 1 to 25
    } else {
      stock = Math.floor(Math.random() * 1000) + 100; // 100 to 1100
    }

    const brandBase = brands[i % brands.length];
    const genericBase = generics[i % generics.length];
    const strengths = ['5mg', '10mg', '20mg', '40mg', '500mg', '625mg'];
    const strength = strengths[i % strengths.length];

    return {
      id: `m-extra-${i}`,
      brand: `${brandBase} ${i + 201}`,
      generic: genericBase,
      strength: strength,
      pack_size: 10,
      buying_price: Number((Math.random() * 50 + 5).toFixed(2)),
      selling_price: Number((Math.random() * 100 + 10).toFixed(2)),
      rack: `Z${Math.floor(i / 20) + 1}-${(i % 20) + 1}`,
      stock_total: stock,
      min_stock: 50,
      isChronic: Math.random() > 0.8
    };
  })
];

// Final Export: Strictly sorted by stock_total ASC (Lowest Stock First)
export const MOCK_MEDICINES: Medicine[] = [...BASE_MEDICINES].sort((a, b) => a.stock_total - b.stock_total);

export const MOCK_STOCK_LOGS: StockLog[] = [
  { id: 'l1', medicine_id: 'm1', date: '2023-11-10 10:30 AM', change: 100, type: 'Restock', user: 'Admin', reason: 'Monthly procurement' },
  { id: 'l2', medicine_id: 'm1', date: '2023-11-12 02:15 PM', change: -10, type: 'Sale', user: 'Staff-A', reason: 'Invoice #8821' },
];

export const MOCK_PATIENTS: Patient[] = [
  { id: 'p1', name: 'Ariful Islam', mobile: '01711223344', dob: '1985-05-15', walletBalance: 450, family_id: 'fam1', relationship: 'Guardian' },
  { id: 'p2', name: 'Nusrat Jahan', mobile: '01822334455', dob: '1990-10-20', walletBalance: 120, family_id: 'fam1', relationship: 'Spouse' },
  { id: 'p3', name: 'Kamal Ahmed', mobile: '01933445566', dob: '1970-01-01', walletBalance: 0 },
];
