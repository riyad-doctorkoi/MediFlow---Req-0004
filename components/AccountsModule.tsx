
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Calendar, 
  Plus, 
  MoreVertical, 
  Eye, 
  Download, 
  Send, 
  Stethoscope, 
  Beaker, 
  CreditCard, 
  DollarSign, 
  PieChart, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  FileText,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Trash2,
  Check,
  X,
  History,
  Bell,
  ArrowRight,
  Zap,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Bill, BillStatus, BillItem } from '../types.ts';

const MOCK_BILLS: Bill[] = [
  {
    bill_id: 'BILL-882190',
    patient_name: 'Anowara Begum',
    patient_id: 'p101',
    bill_date: 'Jan 27, 2026',
    items: [
      { id: 'i1', name: 'General Physician Consultation', type: 'Consultation', qty: 1, unitPrice: 690, discount: 0 },
      { id: 'i2', name: 'Napa Extend (10)', type: 'Pharmacy', qty: 1, unitPrice: 150, discount: 0 }
    ],
    discount_type: 'amount',
    discount_value: 0,
    total_before_discount: 840,
    total_after_discount: 840,
    amount_paid: 840,
    amount_due: 0,
    payment_status: BillStatus.PAID,
    service_status: 'completed'
  },
  {
    bill_id: 'BILL-100283',
    patient_name: 'Mezbah Uddin',
    patient_id: 'p102',
    bill_date: 'Jan 27, 2026',
    items: [{ id: 'i3', name: 'Blood Test Profile', type: 'Lab Test', qty: 1, unitPrice: 1200, discount: 0 }],
    discount_type: 'amount',
    discount_value: 100,
    total_before_discount: 1200,
    total_after_discount: 1100,
    amount_paid: 500,
    amount_due: 600,
    payment_status: BillStatus.PARTIAL,
    service_status: 'in-progress'
  },
  {
    bill_id: 'BILL-992831',
    patient_name: 'Zakir Hossain',
    patient_id: 'p103',
    bill_date: 'Jan 26, 2026',
    items: [{ id: 'i4', name: 'Minor Surgical Procedure', type: 'Procedure', qty: 1, unitPrice: 4500, discount: 0 }],
    discount_type: 'percentage',
    discount_value: 10,
    total_before_discount: 4500,
    total_after_discount: 4050,
    amount_paid: 0,
    amount_due: 4050,
    payment_status: BillStatus.UNPAID,
    service_status: 'pending'
  }
];

const AccountsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Invoices' | 'Refund Queue' | 'Reports'>('Invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRefundPanelOpen, setIsRefundPanelOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  const filteredBills = useMemo(() => {
    let bills = MOCK_BILLS;
    if (searchQuery) {
      bills = bills.filter(b => 
        b.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.bill_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return bills;
  }, [searchQuery]);

  const kpis = [
    { 
      label: 'Real-time P&L', 
      value: '৳148,290', 
      sub: 'Net Profit (Income - Expense)', 
      trend: '+12.5%', 
      isPositive: true,
      color: 'bg-green-50 text-green-600'
    },
    { 
      label: 'Outstanding Dues', 
      value: '৳42,100', 
      sub: '24 Patients Overdue', 
      action: 'Send Reminders',
      color: 'bg-red-50 text-red-600'
    },
    { 
      label: 'Daily Collections', 
      value: '৳21,531', 
      sub: 'Cash: ৳12k, MFS: ৳9.5k', 
      trend: '+4.2%', 
      isPositive: true,
      color: 'bg-blue-50 text-blue-600'
    }
  ];

  const dailyReportData = [
    { type: 'Appointment', income: 12450, count: 18, color: 'text-blue-500', icon: Stethoscope },
    { type: 'Medicine', income: 8340, count: 42, color: 'text-[#10B981]', icon: Zap },
    { type: 'Lab Test', income: 15600, count: 12, color: 'text-purple-500', icon: Beaker },
    { type: 'Procedure', income: 24500, count: 5, color: 'text-orange-500', icon: Activity },
  ];

  const totalDailyIncome = dailyReportData.reduce((acc, curr) => acc + curr.income, 0);

  const getServiceTags = (items: any[]) => {
    const types = Array.from(new Set(items.map(i => i.type)));
    return types.map((type: any, i) => (
      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-black uppercase tracking-tighter mr-1">
        {type}
      </span>
    ));
  };

  const handleBillClick = (bill: Bill) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
  };

  const handleCreateOrder = (type: string) => {
    alert(`Initiating new ${type} order flow...`);
    setIsOrderDropdownOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* Top Section: KPI Cards */}
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Billing & Accounts</h1>
            <p className="text-xs text-gray-500">Consolidated financial management for all medical services.</p>
          </div>
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setIsRefundPanelOpen(!isRefundPanelOpen)}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              <History size={16} /> Audit Logs
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsOrderDropdownOpen(!isOrderDropdownOpen)}
                className="flex items-center gap-2 bg-[#10B981] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
              >
                <Plus size={16} /> New Order <ChevronDown size={14} className={`transition-transform duration-200 ${isOrderDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isOrderDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setIsOrderDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-gray-50">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1">Select Service Type</p>
                    </div>
                    <div className="p-1">
                      <button onClick={() => handleCreateOrder('Appointment')} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-green-50 hover:text-[#10B981] rounded-xl transition-all">
                        <Stethoscope size={16} /> Appointment Order
                      </button>
                      <button onClick={() => handleCreateOrder('Medicine')} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-green-50 hover:text-[#10B981] rounded-xl transition-all">
                        <Zap size={16} /> Medicine Order
                      </button>
                      <button onClick={() => handleCreateOrder('Lab Test')} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-green-50 hover:text-[#10B981] rounded-xl transition-all">
                        <Beaker size={16} /> Lab Test Order
                      </button>
                      <button onClick={() => handleCreateOrder('Procedure')} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-green-50 hover:text-[#10B981] rounded-xl transition-all">
                        <FileText size={16} /> Clinical Procedure
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  {i === 0 ? <PieChart size={18} /> : i === 1 ? <AlertCircle size={18} /> : <DollarSign size={18} />}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">{kpi.value}</h3>
                  <p className="text-[10px] text-gray-400 font-medium">{kpi.sub}</p>
                </div>
                {kpi.trend && (
                  <span className={`text-[10px] font-black flex items-center gap-1 ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {kpi.trend}
                  </span>
                )}
                {kpi.action && (
                  <button className="text-[10px] font-black text-[#10B981] hover:underline flex items-center gap-1">
                    {kpi.action} <ArrowRight size={12} />
                  </button>
                )}
              </div>
              <div className="mt-4 h-1 bg-gray-50 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${i === 1 ? 'bg-red-400' : 'bg-[#10B981]'}`} style={{ width: i === 0 ? '70%' : i === 1 ? '40%' : '85%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Tabs Switcher */}
      <div className="flex-1 px-6 md:px-8 pb-8 flex gap-6 overflow-hidden">
        <div className={`bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full transition-all duration-500 ${isRefundPanelOpen ? 'w-2/3' : 'w-full'}`}>
          <div className="flex border-b border-gray-100 bg-gray-50/30 px-6">
            {['Invoices', 'Refund Queue', 'Reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === tab ? 'border-[#10B981] text-[#10B981]' : 'border-transparent text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Invoices' && (
            <div className="flex flex-col h-full">
              <div className="p-6 flex justify-between items-center border-b border-gray-50">
                <div className="relative w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Bill ID or Patient..." 
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs outline-none focus:bg-white focus:border-gray-200 transition-all shadow-inner"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
                    <Filter size={18} />
                  </button>
                  <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
                    <Download size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bill ID & Patient</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Services</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Net Total</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredBills.map((bill) => (
                      <tr key={bill.bill_id} className="hover:bg-gray-50/50 transition-all cursor-pointer group" onClick={() => handleBillClick(bill)}>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{bill.bill_id}</span>
                            <span className="text-[11px] text-gray-500 font-medium">{bill.patient_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-wrap gap-1">
                            {getServiceTags(bill.items)}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-900 tracking-tight">৳{bill.total_after_discount}</span>
                            {bill.amount_due > 0 && <span className="text-[9px] font-bold text-red-500">Due: ৳{bill.amount_due}</span>}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm border ${
                            bill.payment_status === BillStatus.PAID ? 'bg-green-50 text-green-700 border-green-100' :
                            bill.payment_status === BillStatus.PARTIAL ? 'bg-orange-50 text-orange-700 border-orange-100' :
                            'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            {bill.payment_status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 text-gray-400 hover:text-[#10B981] group-hover:bg-white rounded-lg transition-all shadow-sm">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Reports' && (
            <div className="p-8 overflow-y-auto space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Daily Collection Report</h2>
                  <p className="text-xs text-gray-500">Detailed breakdown of income generated today across all service modules.</p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                  <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Total Collection Today</p>
                  <p className="text-xl font-black text-green-700 tracking-tight">৳{totalDailyIncome.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dailyReportData.map((data, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-2xl bg-gray-50 ${data.color} group-hover:scale-110 transition-transform`}>
                        <data.icon size={24} />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">{data.type}s</p>
                        <p className="text-xs font-bold text-gray-600">{data.count} Orders</p>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-400 mb-1">Total Income</p>
                        <p className="text-2xl font-black text-gray-900 tracking-tighter">৳{data.income.toLocaleString()}</p>
                      </div>
                      <div className="w-16 h-16 relative">
                        {/* Simple Pie/Radial Representation */}
                        <svg className="w-full h-full transform -rotate-90">
                           <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-50" />
                           <circle 
                             cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" 
                             className={data.color}
                             strokeDasharray={2 * Math.PI * 28}
                             strokeDashoffset={(1 - (data.income / totalDailyIncome)) * 2 * Math.PI * 28}
                           />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-gray-400">
                          {Math.round((data.income / totalDailyIncome) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Audit Log snippet for reports */}
              <div className="bg-gray-50 rounded-[24px] p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-[#10B981]" size={18} />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Departmental Performance Insights</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xs font-bold text-gray-600">Top Performing Category</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[9px] font-black uppercase tracking-widest">Procedure (৳24.5k)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xs font-bold text-gray-600">Highest Volume Category</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[9px] font-black uppercase tracking-widest">Medicine (42 Orders)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Refund Queue' && (
             <div className="p-12 text-center space-y-4">
               <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <History size={40} />
               </div>
               <h4 className="text-xl font-black text-gray-900 mb-2">Refund Approval Workflow</h4>
               <p className="text-sm text-gray-500 max-w-xs mx-auto">Accounts department approval required for all refund finalizations. View current requests in the sidebar or detailed queue here.</p>
             </div>
          )}
        </div>

        {/* Refund & Audit Side Panel */}
        {isRefundPanelOpen && (
          <div className="w-1/3 bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                <History className="text-[#10B981]" size={18} /> Refund Queue & Audit
              </h3>
              <button onClick={() => setIsRefundPanelOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Approvals</p>
                <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black text-gray-900">REFUND-2291</p>
                      <p className="text-[10px] text-gray-500">Requested for Zakir Hossain</p>
                    </div>
                    <span className="text-lg font-black text-orange-600 tracking-tighter">৳1,200</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-[#10B981] text-white rounded-lg text-[10px] font-black shadow-lg shadow-green-100 hover:bg-green-700">Approve</button>
                    <button className="flex-1 py-2 bg-white border border-gray-200 text-red-500 rounded-lg text-[10px] font-black hover:bg-red-50">Reject</button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit Trail Log</p>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex gap-3 relative pb-4">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#10B981] shrink-0 border border-gray-100">
                        <Check size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-black text-gray-900 leading-tight">Payment Collected</p>
                        <p className="text-[10px] text-gray-500">Invoice #BILL-882190 by riyad.koi</p>
                        <p className="text-[9px] text-gray-300 font-bold mt-1 uppercase">12:45 PM • Jan 27</p>
                      </div>
                      {i < 2 && <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-100" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bill Detail & Payment Modal */}
      {isPaymentModalOpen && selectedBill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[600px] animate-in zoom-in-95">
            <div className="flex-1 p-8 overflow-y-auto space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] font-black px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-widest">Invoice Preview</span>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{selectedBill.bill_id}</h2>
                  <p className="text-xs text-gray-500 font-medium">{selectedBill.patient_name} • ID: {selectedBill.patient_id}</p>
                </div>
                <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Line Items</p>
                <div className="divide-y divide-gray-50 border-y border-gray-100">
                  {selectedBill.items.map((item, i) => (
                    <div key={i} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-black text-gray-800">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Type: {item.type} • Qty: {item.qty}</p>
                      </div>
                      <span className="text-sm font-black text-gray-900 tracking-tight">৳{(item.unitPrice * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <AlertCircle className="text-gray-400" size={20} />
                <p className="text-[10px] text-gray-500 font-medium italic">Bills are generated at order time. Payments can be collected immediately even if service is pending.</p>
              </div>
            </div>

            <div className="w-full md:w-80 bg-gray-50/50 border-l border-gray-100 p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>৳{selectedBill.total_before_discount.toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied Discount</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      defaultValue={selectedBill.discount_value}
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-black text-gray-800 outline-none focus:ring-2 focus:ring-[#10B981]/20"
                    />
                    <select className="bg-white border border-gray-200 rounded-xl px-2 py-2 text-[10px] font-black uppercase outline-none">
                      <option>%</option>
                      <option>Fixed</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Net Payable</p>
                  <p className="text-3xl font-black text-[#10B981] tracking-tighter">৳{selectedBill.total_after_discount.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount to Collect</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-lg font-black text-gray-900 outline-none focus:ring-4 focus:ring-[#10B981]/10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm transition-all">
                    <CreditCard size={14} /> MFS / Card
                  </button>
                  <button className="py-3 bg-white border border-[#10B981] text-[#10B981] rounded-xl text-[10px] font-black hover:bg-green-50 flex items-center justify-center gap-2 shadow-sm transition-all">
                    <DollarSign size={14} /> Cash
                  </button>
                </div>
                <button className="w-full py-4 bg-[#10B981] text-white rounded-[20px] text-xs font-black shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> Collect Payment
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                 <button className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                   <XCircle size={14} /> Request Refund
                 </button>
                 <button className="text-[10px] font-black text-gray-400 hover:text-[#10B981] uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                   <Download size={14} /> Print Invoice
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsModule;
