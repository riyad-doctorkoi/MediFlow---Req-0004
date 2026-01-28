
import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Search, 
  History, 
  Package,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
  RefreshCcw,
  X,
  Check,
  Receipt,
  LayoutGrid,
  Minus,
  Truck,
  User,
  Zap,
  Download,
  CalendarDays,
  XCircle,
  ShoppingCart,
  Box,
  ArrowRight,
  Filter
} from 'lucide-react';
import { MOCK_MEDICINES, MOCK_PATIENTS } from '../constants.tsx';
import { Medicine, Patient, OrderRecord } from '../types.ts';
import ScannerPanel from './ScannerPanel.tsx';

interface CartItem {
  medicine: Medicine;
  qty: number;
  discount: number; // Percentage
}

interface NewPatientData {
  name: string;
  age: string;
  phone: string;
  source: string;
  division: string;
  district: string;
  thana: string;
  area: string;
  deliveryAddress: string;
}

interface DashboardProps {
  initialTab?: 'overview' | 'recent' | 'recurring' | 'inventory';
  recentOrders: OrderRecord[];
  onAddOrder: (order: OrderRecord) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  initialTab = 'overview', 
  recentOrders, 
  onAddOrder 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'recent' | 'recurring' | 'inventory'>(initialTab);
  const [invoiceStep, setInvoiceStep] = useState<'items' | 'patient' | 'fulfillment'>('items');
  const [inventorySearch, setInventorySearch] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [recentLogSearch, setRecentLogSearch] = useState('');
  const [recurringLogSearch, setRecurringLogSearch] = useState('');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [newPatient, setNewPatient] = useState<NewPatientData>({
    name: '', age: '', phone: '', source: '', division: '', district: '', thana: '', area: '', deliveryAddress: ''
  });
  const [fulfillmentType, setFulfillmentType] = useState<'direct' | 'delivery'>('direct');
  const [deliveryRegion, setDeliveryRegion] = useState<'inside' | 'outside'>('inside');
  
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [reorderItem, setReorderItem] = useState<Medicine | null>(null);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.medicine.selling_price * item.qty), 0);
    const totalDiscount = cart.reduce((acc, item) => acc + ((item.medicine.selling_price * item.qty) * (item.discount / 100)), 0);
    const deliveryCharge = fulfillmentType === 'delivery' ? (deliveryRegion === 'inside' ? 60 : 130) : 0;
    return {
      subtotal,
      discount: totalDiscount,
      delivery: deliveryCharge,
      net: subtotal - totalDiscount + deliveryCharge
    };
  }, [cart, fulfillmentType, deliveryRegion]);

  const searchResults = useMemo(() => {
    if (!productSearch) return [];
    return MOCK_MEDICINES.filter(m => 
      m.brand.toLowerCase().includes(productSearch.toLowerCase()) || 
      m.generic.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [productSearch]);

  const filteredPatients = useMemo(() => {
    if (!patientSearch) return MOCK_PATIENTS;
    return MOCK_PATIENTS.filter(p => 
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
      p.mobile.includes(patientSearch)
    );
  }, [patientSearch]);

  const filteredInventory = useMemo(() => {
    return MOCK_MEDICINES.filter(m => {
      const matchesSearch = 
        m.brand.toLowerCase().includes(inventorySearch.toLowerCase()) || 
        m.generic.toLowerCase().includes(inventorySearch.toLowerCase()) || 
        m.rack.toLowerCase().includes(inventorySearch.toLowerCase());
      
      if (showLowStockOnly) {
        return matchesSearch && m.stock_total <= m.min_stock;
      }
      return matchesSearch;
    });
  }, [inventorySearch, showLowStockOnly]);

  const filteredRecentOrders = useMemo(() => {
    if (!recentLogSearch) return recentOrders;
    const q = recentLogSearch.toLowerCase();
    return recentOrders.filter(o => 
      o.patientName.toLowerCase().includes(q) || 
      o.mobile.includes(q) || 
      o.id.toLowerCase().includes(q)
    );
  }, [recentOrders, recentLogSearch]);

  const recurringCandidates = useMemo(() => {
    const base = [
      { id: '1', name: 'Ariful Islam', mobile: '01711223344', lastOrder: 'Concor 5mg (30), Napa Extend (14)', lastOrderDate: 'Jan 10, 2026', nextDate: '2026-02-10', days: 12 },
      { id: '2', name: 'Nusrat Jahan', mobile: '01822334455', lastOrder: 'Atova 10mg (30), Ace Plus (10)', lastOrderDate: 'Jan 15, 2026', nextDate: '2026-02-15', days: 17 },
      { id: '3', name: 'Kamal Ahmed', mobile: '01933445566', lastOrder: 'Pantonix 20mg (10), Fexo 120mg (20)', lastOrderDate: 'Jan 05, 2026', nextDate: '2026-02-05', days: 7 },
      { id: '4', name: 'Zakir Hossain', mobile: '01911883300', lastOrder: 'Atova 10mg, Comet XR', lastOrderDate: 'Jan 23, 2026', nextDate: '2026-02-23', days: 25 },
    ];
    
    if (!recurringLogSearch) return base;
    const q = recurringLogSearch.toLowerCase();
    return base.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.mobile.includes(q)
    );
  }, [recurringLogSearch]);

  const alternatives = useMemo(() => {
    if (productSearch && searchResults.length === 0) {
      return [
        { brand: 'Ace', generic: 'Paracetamol', strength: '500mg', selling_price: 1.2 },
        { brand: 'Reset', generic: 'Paracetamol', strength: '500mg', selling_price: 1.5 },
        { brand: 'Xpa', generic: 'Paracetamol', strength: '500mg', selling_price: 1.1 }
      ];
    }
    return [];
  }, [productSearch, searchResults]);

  const addToCart = (med: any) => {
    const medicineObj = med.id ? med : { ...med, id: `alt-${Math.random()}`, stock_total: 100, min_stock: 10 };
    const existing = cart.find(item => item.medicine.brand === medicineObj.brand);
    if (existing) {
      setCart(cart.map(item => item.medicine.brand === medicineObj.brand ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { medicine: medicineObj, qty: 1, discount: 0 }]);
    }
    setProductSearch('');
  };

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCart(cart.map(item => item.medicine.id === id ? { ...item, ...updates } : item));
  };

  const removeFromCart = (id: string) => setCart(cart.filter(i => i.medicine.id !== id));

  const handleConfirmOrder = () => {
    const patientName = isNewPatient ? newPatient.name : (selectedPatient?.name || 'Walk-in Guest');
    const patientPhone = isNewPatient ? newPatient.phone : (selectedPatient?.mobile || '00000000000');
    
    if (!patientName && cart.length > 0) {
      alert("Please provide patient details.");
      setInvoiceStep('patient');
      return;
    }

    const newOrderId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderRecord = {
      id: newOrderId,
      patientName: patientName,
      mobile: patientPhone,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      totalAmount: totals.net,
      discountAmount: totals.discount,
      type: fulfillmentType === 'delivery' ? 'Home Delivery' : 'Direct Sell',
      items: cart.map(item => `${item.medicine.brand} ${item.medicine.strength}`),
      initial: patientName.charAt(0).toUpperCase()
    };

    onAddOrder(newOrder);
    alert(`Order Confirmed for ${patientName}!\nTotal Amount: ৳${totals.net.toFixed(2)}`);
    
    setCart([]);
    setInvoiceStep('items');
    setNewPatient({ name: '', age: '', phone: '', source: '', division: '', district: '', thana: '', area: '', deliveryAddress: '' });
    setSelectedPatient(null);
    setPatientSearch('');
    setRecentLogSearch(''); 
    setActiveTab('recent');
  };

  const getLifetimeCount = (mobile: string) => {
    return recentOrders.filter(o => o.mobile === mobile).length;
  };

  const getLifetimeAmount = (mobile: string) => {
    return recentOrders.filter(o => o.mobile === mobile).reduce((acc, curr) => acc + curr.totalAmount, 0);
  };

  const handleAction = (item: string, action: string) => {
    alert(`${action} triggered for ${item}`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#fafafa] min-h-screen relative text-black">
      <div className="space-y-6">
        <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar bg-white rounded-t-2xl px-2">
          {[
            { id: 'overview', label: 'Create Invoice', icon: LayoutGrid },
            { id: 'inventory', label: 'Inventory Hub', icon: Package },
            { id: 'recurring', label: 'Recurring Pipeline', icon: RefreshCcw },
            { id: 'recent', label: 'Recent Orders', icon: History }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); }}
              className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id ? 'border-[#16a34a] text-[#16a34a] bg-green-50/30' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-2">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[650px]">
                  <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                       {[
                         { id: 'items', label: '1. Select Items' },
                         { id: 'patient', label: '2. Patient Info' },
                         { id: 'fulfillment', label: '3. Order Type' }
                       ].map(step => (
                         <div key={step.id} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${invoiceStep === step.id ? 'text-[#16a34a]' : 'text-gray-300'}`}>
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${invoiceStep === step.id ? 'border-[#16a34a] bg-white' : 'border-gray-100'}`}>
                             {invoiceStep === step.id ? <div className="w-2 h-2 rounded-full bg-[#16a34a]" /> : null}
                           </div>
                           {step.label}
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="flex-1 p-8 text-black">
                    {invoiceStep === 'items' && (
                      <div className="space-y-8 animate-in slide-in-from-left-4">
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                             <Search size={14} /> Step 1: Search & Add Medicine
                          </label>
                          <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#16a34a] transition-colors" size={24} />
                            <input 
                              type="text" 
                              value={productSearch}
                              onChange={(e) => setProductSearch(e.target.value)}
                              placeholder="Search medicine by brand or generic name..." 
                              className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-transparent rounded-2xl text-base font-medium text-black focus:bg-white focus:ring-4 focus:ring-[#16a34a]/10 outline-none transition-all shadow-inner"
                            />
                            {productSearch && (
                              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[300px] overflow-y-auto">
                                {searchResults.length > 0 ? (
                                  searchResults.map(med => (
                                    <button key={med.id} onClick={() => addToCart(med)} className="w-full p-5 flex items-center justify-between hover:bg-green-50 transition-all text-left border-b border-gray-50 last:border-0 group">
                                      <div>
                                        <p className="font-black text-gray-900 group-hover:text-[#16a34a]">{med.brand} {med.strength}</p>
                                        <p className="text-[11px] text-gray-500 italic">{med.generic}</p>
                                      </div>
                                      <div className="text-right text-black">
                                        <p className="font-black">৳{med.selling_price}</p>
                                        <p className={`text-[10px] font-bold ${med.stock_total > 0 ? (med.stock_total <= med.min_stock ? 'text-orange-500' : 'text-green-600') : 'text-red-500'}`}>
                                          Stock: {med.stock_total}
                                        </p>
                                      </div>
                                    </button>
                                  ))
                                ) : (
                                  <div className="p-8 text-center space-y-4">
                                    <p className="text-sm text-gray-500 font-medium">Medicine not found. Try these alternatives:</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                      {alternatives.map((alt, i) => (
                                        <button key={i} onClick={() => addToCart(alt)} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold border border-orange-100 hover:bg-orange-100 transition-all">
                                          {alt.brand} {alt.strength}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Billing Cart</h3>
                          {cart.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-300 bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100">
                               <ShoppingBag size={48} strokeWidth={1} className="mb-4" />
                               <p className="text-xs font-bold uppercase tracking-widest">Invoice is currently empty</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {cart.map((item) => (
                                <div key={item.medicine.id} className="bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center gap-5 border border-gray-100 hover:shadow-md transition-all">
                                  <div className="flex-1">
                                    <p className="text-sm font-black text-gray-900">{item.medicine.brand} <span className="text-gray-400 font-medium">{item.medicine.strength}</span></p>
                                    <p className="text-[10px] text-gray-500 italic">{item.medicine.generic}</p>
                                  </div>
                                  <div className="flex items-center gap-6 text-black">
                                    <div className="flex flex-col items-center">
                                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Qty</span>
                                      <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-200">
                                        <button onClick={() => updateCartItem(item.medicine.id, { qty: Math.max(1, item.qty - 1) })} className="p-1.5 hover:text-red-500"><Minus size={14} /></button>
                                        <input type="number" value={item.qty} onChange={(e) => updateCartItem(item.medicine.id, { qty: parseInt(e.target.value) || 1 })} className="w-8 text-center text-xs font-black bg-transparent outline-none text-black" />
                                        <button onClick={() => updateCartItem(item.medicine.id, { qty: item.qty + 1 })} className="p-1.5 hover:text-[#16a34a]"><Plus size={14} /></button>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Disc %</span>
                                      <input type="number" value={item.discount} onChange={(e) => updateCartItem(item.medicine.id, { discount: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })} className="w-16 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-black text-center outline-none focus:ring-1 focus:ring-[#16a34a] text-black" />
                                    </div>
                                    <div className="text-right min-w-[100px]">
                                      <p className="text-sm font-black text-gray-900">৳{(item.medicine.selling_price * item.qty * (1 - item.discount/100)).toFixed(2)}</p>
                                      <p className="text-[10px] text-gray-400 font-bold line-through">৳{(item.medicine.selling_price * item.qty).toFixed(2)}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.medicine.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><X size={18} /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {invoiceStep === 'patient' && (
                      <div className="space-y-8 animate-in slide-in-from-right-4 text-black">
                        <div className="flex gap-4 p-1 bg-gray-100 rounded-2xl w-fit">
                          <button onClick={() => setIsNewPatient(false)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isNewPatient ? 'bg-white text-[#16a34a] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>Existing Patient</button>
                          <button onClick={() => setIsNewPatient(true)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isNewPatient ? 'bg-white text-[#16a34a] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>New Patient</button>
                        </div>
                        {!isNewPatient ? (
                          <div className="space-y-6 text-black">
                             <div className="relative">
                               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                               <input type="text" value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} placeholder="Search existing patient profile by name or phone..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm text-black focus:bg-white focus:ring-4 focus:ring-[#16a34a]/10 outline-none transition-all" />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {filteredPatients.length > 0 ? filteredPatients.map(p => (
                                 <button key={p.id} onClick={() => setSelectedPatient(p)} className={`p-5 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${selectedPatient?.id === p.id ? 'border-[#16a34a] bg-green-50/50' : 'border-gray-50 bg-white hover:border-gray-100 hover:bg-gray-50'}`}>
                                   <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-[#16a34a] font-black text-xl">{p.name.charAt(0)}</div>
                                   <div>
                                     <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{p.name}</p>
                                     <p className="text-[11px] text-gray-500 font-bold">{p.mobile}</p>
                                   </div>
                                 </button>
                               )) : (
                                 <div className="col-span-full py-12 text-center text-gray-400 font-medium">No patients found.</div>
                               )}
                             </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Patient Name *</label>
                              <input type="text" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-[#16a34a]/10 font-medium text-black" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Age / DOB</label>
                              <input type="text" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-[#16a34a]/10 font-medium text-black" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Phone Number *</label>
                              <input type="text" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-[#16a34a]/10 font-medium text-black" />
                            </div>
                            <div className="space-y-2 lg:col-span-3">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Delivery Address</label>
                              <input type="text" value={newPatient.deliveryAddress} onChange={e => setNewPatient({...newPatient, deliveryAddress: e.target.value})} placeholder="House #, Road #, Area..." className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-[#16a34a]/10 font-medium text-black" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {invoiceStep === 'fulfillment' && (
                      <div className="space-y-10 animate-in slide-in-from-right-4">
                        <div className="grid grid-cols-2 gap-6">
                          <button onClick={() => setFulfillmentType('direct')} className={`p-10 rounded-[40px] border-4 transition-all flex flex-col items-center gap-4 ${fulfillmentType === 'direct' ? 'border-[#16a34a] bg-green-50 shadow-xl shadow-green-100' : 'border-gray-50 bg-white hover:border-gray-100 hover:bg-gray-50'}`}>
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${fulfillmentType === 'direct' ? 'bg-[#16a34a] text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                              <ShoppingBag size={32} />
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-black uppercase tracking-widest text-gray-900 text-black">Direct Sell</p>
                              <p className="text-[11px] text-gray-400 font-bold">Counter transaction</p>
                            </div>
                          </button>
                          <button onClick={() => setFulfillmentType('delivery')} className={`p-10 rounded-[40px] border-4 transition-all flex flex-col items-center gap-4 ${fulfillmentType === 'delivery' ? 'border-[#16a34a] bg-green-50 shadow-xl shadow-green-100' : 'border-gray-50 bg-white hover:border-gray-100 hover:bg-gray-50'}`}>
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${fulfillmentType === 'delivery' ? 'bg-[#16a34a] text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                              <Truck size={32} />
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-black uppercase tracking-widest text-gray-900 text-black">Home Delivery</p>
                              <p className="text-[11px] text-gray-400 font-bold">Doorstep fulfillment</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                    <button onClick={() => { if (invoiceStep === 'patient') setInvoiceStep('items'); if (invoiceStep === 'fulfillment') setInvoiceStep('patient'); }} disabled={invoiceStep === 'items'} className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${invoiceStep === 'items' ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-white hover:shadow-sm'}`}>
                      <ChevronLeft size={18} /> Back
                    </button>
                    {invoiceStep !== 'fulfillment' ? (
                      <button onClick={() => { if (invoiceStep === 'items') { if (cart.length === 0) { alert("Please add at least one item to cart."); return; } setInvoiceStep('patient'); } else if (invoiceStep === 'patient') setInvoiceStep('fulfillment'); }} className={`px-12 py-4 bg-[#16a34a] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95`}>
                        Next Step <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button onClick={handleConfirmOrder} className="px-16 py-4 bg-[#16a34a] text-white rounded-[24px] text-[12px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-green-200 hover:bg-green-700 transition-all active:scale-95 animate-pulse">
                        <Check size={20} /> Confirm Invoice
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden sticky top-6">
                  <div className="p-10 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 text-[#16a34a] rounded-2xl flex items-center justify-center">
                        <Receipt size={28} />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Invoice Details</h3>
                    </div>
                    <div className="space-y-5">
                      <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>Gross Total</span><span className="text-gray-900">৳{totals.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-red-500 uppercase tracking-widest">
                        <span>Total Discount</span><span>- ৳{totals.discount.toFixed(2)}</span>
                      </div>
                      {totals.delivery > 0 && (
                        <div className="flex justify-between items-center text-xs font-bold text-blue-600 uppercase tracking-widest animate-in slide-in-from-top-2">
                          <span>Delivery Charge</span><span>+ ৳{totals.delivery.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="pt-8 border-t border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Net Payable Amount</p>
                        <p className="text-5xl font-black text-[#16a34a] tracking-tighter">৳{totals.net.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-[#16a34a] text-white flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center"><User size={24} /></div>
                     <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Patient Context</p>
                        <p className="text-sm font-black truncate uppercase">{isNewPatient ? (newPatient.name || 'Walk-in Guest') : (selectedPatient?.name || 'Walk-in Guest')}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in duration-500 text-black">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Medicine Inventory Hub</h2>
                    <p className="text-xs text-gray-500 font-medium">Real-time stock management, procurement logs and rack mapping.</p>
                  </div>
                  <button className="px-8 py-3 bg-[#16a34a] text-white rounded-2xl text-xs font-black shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-2">
                    <Plus size={18} /> New SKU
                  </button>
               </div>

               <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 sticky top-0 z-20">
                  <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#16a34a] transition-colors" size={20} />
                    <input 
                      type="text" 
                      value={inventorySearch} 
                      onChange={(e) => setInventorySearch(e.target.value)} 
                      placeholder="Search inventory by brand, generic, or rack location (e.g., A1-01)..." 
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm text-black font-medium focus:bg-white focus:ring-4 focus:ring-[#16a34a]/10 outline-none transition-all placeholder:text-gray-400" 
                    />
                  </div>
                  <button 
                    onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                    className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border shrink-0 ${
                      showLowStockOnly 
                      ? 'bg-orange-50 text-orange-600 border-orange-200' 
                      : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Filter size={16} /> {showLowStockOnly ? 'Low Stock Filter Active' : 'Filter Low Stock'}
                  </button>
               </div>

               <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-widest">
                          <th className="px-8 py-5">SKU Details</th>
                          <th className="px-8 py-5 text-right">Unit Price</th>
                          <th className="px-8 py-5 text-right">Stock Level</th>
                          <th className="px-8 py-5 text-center">Status</th>
                          <th className="px-8 py-5 text-center">Location</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-black">
                        {filteredInventory.length > 0 ? filteredInventory.map((med) => (
                          <tr key={med.id} className="hover:bg-green-50/10 group transition-all">
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-900 group-hover:text-[#16a34a] transition-colors uppercase">{med.brand} {med.strength}</span>
                                <span className="text-[11px] text-gray-400 font-medium italic">{med.generic}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">৳{med.selling_price}</span>
                                <span className="text-[10px] text-gray-300 font-bold tracking-tighter">Cost: ৳{med.buying_price}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex flex-col">
                                <span className={`text-sm font-black ${med.stock_total <= med.min_stock ? 'text-orange-500' : 'text-gray-900'}`}>{med.stock_total} Units</span>
                                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Min: {med.min_stock}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border ${
                                med.stock_total === 0 ? 'bg-red-50 text-red-600 border-red-100' :
                                med.stock_total <= med.min_stock ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                'bg-green-50 text-green-700 border-green-100'
                              }`}>
                                {med.stock_total === 0 ? 'Empty' : med.stock_total <= med.min_stock ? 'Low' : 'Stable'}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <span className="text-[10px] font-black text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 uppercase font-mono shadow-inner">
                                {med.rack}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex items-center justify-end gap-2">
                                 {med.stock_total <= med.min_stock && (
                                   <button 
                                     onClick={() => setReorderItem(med)}
                                     className="px-3 py-2 bg-orange-50 text-orange-600 rounded-xl text-[9px] font-black uppercase border border-orange-200 hover:bg-orange-100 transition-all flex items-center gap-1.5 shadow-sm animate-pulse"
                                   >
                                     <ShoppingCart size={14} /> Reorder
                                   </button>
                                 )}
                                 <button className="p-2 text-gray-400 hover:text-[#16a34a] hover:bg-white rounded-lg transition-all"><ExternalLink size={18} /></button>
                               </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="px-8 py-20 text-center">
                               <div className="max-w-xs mx-auto space-y-3">
                                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto">
                                     <Package size={32} />
                                  </div>
                                  <p className="text-sm font-black text-gray-900 uppercase">No matching SKUs found</p>
                                  <p className="text-xs text-gray-400 font-medium leading-relaxed">Try adjusting your search query or clear the filters to view all medicines.</p>
                                  <button onClick={() => {setInventorySearch(''); setShowLowStockOnly(false);}} className="text-[10px] font-black text-[#16a34a] uppercase tracking-widest hover:underline">Clear all filters</button>
                               </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'recurring' && (
            <div className="space-y-6 animate-in fade-in duration-500 text-black">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 px-2">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Recurring Pipeline</h2>
                    <p className="text-xs text-gray-500 font-medium tracking-tight">AI-assisted follow-ups for chronic patients and refill campaigns.</p>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 text-black">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                       <input 
                         type="text" 
                         value={recurringLogSearch} 
                         onChange={e => setRecurringLogSearch(e.target.value)} 
                         placeholder="Search patient or phone..." 
                         className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-[#16a34a]/10 transition-all placeholder:text-gray-400 text-black"
                       />
                    </div>
                    <button className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black border border-blue-100 hover:bg-blue-100 transition-all uppercase tracking-widest shrink-0">Notify All Due</button>
                  </div>
               </div>

               <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-widest">
                          <th className="px-8 py-5">Patient Identity</th>
                          <th className="px-8 py-5">Last Order Details</th>
                          <th className="px-8 py-5 text-right">Lifetime Stats</th>
                          <th className="px-8 py-5 text-center">Reschedule Date</th>
                          <th className="px-8 py-5 text-right">Action Hub</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-black">
                        {recurringCandidates.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-gray-50 text-[#16a34a] rounded-2xl flex items-center justify-center font-black text-lg border border-gray-100 uppercase">{item.name.charAt(0)}</div>
                                 <div className="min-w-0">
                                   <p className="text-sm font-black text-gray-900 uppercase truncate leading-tight">{item.name}</p>
                                   <p className="text-[11px] text-gray-400 font-bold">{item.mobile}</p>
                                 </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex flex-col">
                                 <span className="text-xs font-bold text-gray-800 line-clamp-1 uppercase tracking-tight">{item.lastOrder}</span>
                                 <span className="text-[10px] text-gray-400 italic">Purchased: {item.lastOrderDate}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex flex-col">
                                 <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">৳{getLifetimeAmount(item.mobile).toLocaleString()}</span>
                                 <span className="text-[10px] text-[#16a34a] font-black uppercase tracking-tighter">{getLifetimeCount(item.mobile)} Orders Total</span>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <div className="relative inline-block w-40 text-left">
                                 <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                 <input type="date" defaultValue={item.nextDate} className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-black text-black outline-none focus:ring-4 focus:ring-[#16a34a]/10 transition-all" />
                                 <p className="text-[9px] font-bold text-orange-500 mt-1 uppercase text-center">Refill due in {item.days} days</p>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex items-center justify-end gap-2">
                                 <button onClick={() => handleAction(item.name, 'Reorder')} className="px-4 py-2 bg-[#16a34a] text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95">Reorder</button>
                                 <button onClick={() => handleAction(item.name, 'No need now')} className="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100">No need now</button>
                                 <button onClick={() => handleAction(item.name, 'Will order later')} className="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase hover:bg-blue-50 hover:text-blue-500 transition-all border border-transparent hover:border-blue-100">Order later</button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="space-y-6 animate-in fade-in duration-500 text-black">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 px-2 gap-4">
                 <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-tight">Recent Activity Log</h2>
                    <p className="text-xs text-gray-500 font-medium tracking-tight">Real-time update of confirmed invoices and patient billing context.</p>
                 </div>
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 text-black">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input 
                         type="text" 
                         value={recentLogSearch} 
                         onChange={e => setRecentLogSearch(e.target.value)} 
                         placeholder="Search patient name, phone or ID..." 
                         className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-[#16a34a]/10 transition-all placeholder:text-gray-400 text-black"
                       />
                    </div>
                    <button className="px-5 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-50 shadow-sm flex items-center gap-2 uppercase tracking-widest shrink-0">
                       <Download size={16} /> Export
                    </button>
                 </div>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  {filteredRecentOrders.length > 0 ? filteredRecentOrders.map((inv) => (
                    <div key={inv.id} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border-l-8 border-l-[#16a34a]">
                       <div className="flex items-center gap-6 flex-1 min-w-0">
                          <div className="w-16 h-16 bg-green-50 rounded-[24px] flex items-center justify-center text-[#16a34a] text-2xl font-black shadow-inner shrink-0 uppercase">{inv.initial}</div>
                          <div className="min-w-0">
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Order #{inv.id}</p>
                             <h4 className="text-xl font-black text-gray-900 uppercase truncate leading-tight tracking-tight">{inv.patientName}</h4>
                             <p className="text-xs text-gray-500 font-bold flex items-center gap-2 mt-0.5">
                               {inv.date} • {inv.mobile} 
                               <span className="w-1 h-1 bg-gray-300 rounded-full" />
                               <span className="text-[#16a34a] bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Lifetime: {getLifetimeCount(inv.mobile)} Orders</span>
                             </p>
                          </div>
                       </div>
                       
                       <div className="flex-1 min-w-[200px] border-l border-gray-50 pl-6 hidden md:block">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Inventory Deducted</p>
                          <div className="flex flex-wrap gap-1.5">
                            {inv.items.map((med, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold border border-gray-100 uppercase tracking-tighter">{med}</span>
                            ))}
                          </div>
                       </div>

                       <div className="flex flex-col items-end shrink-0">
                          <div className="text-right text-black">
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Collection Amount</p>
                             <p className="text-3xl font-black tracking-tighter">৳{inv.totalAmount.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                             {inv.discountAmount > 0 && (
                               <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full uppercase border border-red-100">Savings: ৳{inv.discountAmount.toFixed(0)}</span>
                             )}
                             <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${inv.type === 'Home Delivery' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                {inv.type}
                             </span>
                          </div>
                       </div>
                       <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 border border-gray-100 transition-all shrink-0"><ExternalLink size={20} /></button>
                    </div>
                  )) : (
                    <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic bg-white rounded-[32px] border border-dashed border-gray-200">
                       No results found for "{recentLogSearch}"
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>

      {reorderItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 text-black">
             <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center shadow-inner">
                      <Box size={32} />
                   </div>
                   <button onClick={() => setReorderItem(null)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors focus:bg-gray-100 rounded-lg outline-none">
                      <X size={24} />
                   </button>
                </div>

                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-tight">Restock SKU</h3>
                   <p className="text-sm text-gray-500 font-medium">Initiate procurement order for <span className="text-black font-black">{reorderItem.brand} {reorderItem.strength}</span></p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Stock</p>
                      <p className="text-xl font-black text-red-500">{reorderItem.stock_total} Units</p>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Healthy Buffer</p>
                      <p className="text-xl font-black text-gray-900">{reorderItem.min_stock * 5} Units</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Procurement Quantity</label>
                      <div className="relative group">
                         <input 
                           type="number" 
                           autoFocus
                           defaultValue={(reorderItem.min_stock * 5) - reorderItem.stock_total} 
                           className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none font-black text-2xl transition-all text-black shadow-inner" 
                         />
                         <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">Units</span>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                      <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                      <p className="text-[10px] text-orange-700 font-bold uppercase leading-relaxed">
                        Algorithm Insight: Based on weekly velocity, stock will deplete in <span className="text-orange-900">~3 days</span>. Suggesting replenishment to 5x minimum stock levels.
                      </p>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                     onClick={() => { alert('Procurement order placed successfully!'); setReorderItem(null); }}
                     className="flex-1 py-5 bg-[#16a34a] text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                   >
                     Confirm Restock Order <ArrowRight size={16} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {isScannerVisible && (
        <div className="fixed inset-0 z-[110] p-4 bg-black/60 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 text-black">
              <div className="flex justify-end mb-4">
                 <button onClick={() => setIsScannerVisible(false)} className="w-12 h-12 bg-white rounded-2xl text-gray-900 shadow-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"><X size={24} /></button>
              </div>
              <ScannerPanel onItemsVerified={(items) => {
                const newItems = items.map(p => ({
                  medicine: MOCK_MEDICINES.find(m => m.brand === p.brand) || { brand: p.brand, generic: p.generic, selling_price: p.selling_price || 10, id: `ocr-${Math.random()}`, strength: p.strength, stock_total: 100, min_stock: 10, pack_size: 1, buying_price: 1, rack: 'TBD' } as Medicine,
                  qty: p.qty,
                  discount: 0
                }));
                setCart([...cart, ...newItems]);
                setIsScannerVisible(false);
              }} />
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
