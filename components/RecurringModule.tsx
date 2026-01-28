
import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  List, 
  Search,
  AlertTriangle,
  Mail,
  MoreVertical,
  ChevronRight,
  Filter,
  Users,
  Clock,
  UserCheck,
  ChevronDown,
  ShoppingBag,
  XCircle,
  CalendarDays
} from 'lucide-react';
import { BRAND_GREEN, WARNING_YELLOW, DANGER_RED, SUCCESS_GREEN } from '../constants.tsx';

const RecurringModule: React.FC = () => {
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegment, setActiveSegment] = useState('All Active');

  const [refills, setRefills] = useState([
    { 
      id: 'REC-1024',
      patient: 'Ariful Islam', 
      mobile: '01711223344', 
      lastOrder: 'Concor 5mg (30 Tabs), Napa (20 Tabs)', 
      lastOrderDate: 'Oct 20, 2023',
      nextRefillDate: '2023-11-20', 
      daysLeft: 3, 
      status: 'warning', 
      family: 'Guardian'
    },
    { 
      id: 'REC-1025',
      patient: 'Kamal Ahmed', 
      mobile: '01933445566', 
      lastOrder: 'Sergel 20mg (14 Tabs)', 
      lastOrderDate: 'Oct 15, 2023',
      nextRefillDate: '2023-11-18', 
      daysLeft: -2, 
      status: 'critical', 
      family: 'Self'
    },
    { 
      id: 'REC-1026',
      patient: 'Nusrat Jahan', 
      mobile: '01822334455', 
      lastOrder: 'Fexo 120mg (10 Tabs)', 
      lastOrderDate: 'Oct 28, 2023',
      nextRefillDate: '2023-11-25', 
      daysLeft: 8, 
      status: 'safe', 
      family: 'Spouse'
    },
    { 
      id: 'REC-1027',
      patient: 'Siddiqur Rahman', 
      mobile: '01711000111', 
      lastOrder: 'Amaryl 2mg (30 Tabs)', 
      lastOrderDate: 'Oct 19, 2023',
      nextRefillDate: '2023-11-19', 
      daysLeft: 2, 
      status: 'warning', 
      family: 'Guardian'
    },
  ]);

  const filteredRefills = useMemo(() => {
    if (!searchQuery) return refills;
    const lowerQuery = searchQuery.toLowerCase();
    return refills.filter(ref => 
      ref.patient.toLowerCase().includes(lowerQuery) || 
      ref.mobile.includes(searchQuery) || 
      ref.lastOrder.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, refills]);

  const handleAction = (patient: string, action: string) => {
    alert(`${action} triggered for ${patient}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return DANGER_RED;
      case 'warning': return WARNING_YELLOW;
      case 'safe': return SUCCESS_GREEN;
      default: return BRAND_GREEN;
    }
  };

  const segments = [
    { label: 'All Active', count: 24, color: 'bg-[#10B981]' },
    { label: 'Due in 3 Days', count: 8, color: 'bg-yellow-500' },
    { label: 'Overdue', count: 5, color: 'bg-red-500' },
    { label: 'Lost', count: 12, color: 'bg-gray-400' }
  ];

  return (
    <div className="min-h-full bg-gray-50/50 text-black">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 md:px-8 md:py-6">
        <div className="flex items-center justify-between mb-2 md:mb-4 lg:mb-0">
          <div className="space-y-0.5">
            <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight uppercase">Recurring Pipeline</h2>
            <p className="hidden md:block text-gray-500 text-sm font-medium tracking-tight">AI-assisted refill forecasting & loyalty management</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setView('calendar')}
              className={`p-2 md:px-4 md:py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'calendar' ? 'bg-white text-[#10B981] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Calendar size={14} /><span className="hidden md:inline">Calendar</span>
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 md:px-4 md:py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'list' ? 'bg-white text-[#10B981] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={14} /><span className="hidden md:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 pt-4 md:pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-1">Segments</h3>
            <nav className="space-y-2.5">
              {segments.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setActiveSegment(s.label)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${
                    activeSegment === s.label 
                    ? 'bg-[#10B981] text-white shadow-lg shadow-green-100' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activeSegment === s.label ? 'bg-white' : s.color}`} />
                    {s.label}
                  </span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${activeSegment === s.label ? 'bg-white/20' : 'bg-gray-100'}`}>
                    {s.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 space-y-4 md:space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-3 flex items-center gap-3 shadow-sm overflow-hidden">
            <div className="relative flex-1 group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B981] transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, phone or medication..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-none rounded-2xl text-sm text-black outline-none focus:bg-white focus:ring-4 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-400"
              />
            </div>
            <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#10B981] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-50 hover:bg-[#059669] transition-all">
              <Mail size={18} /> Send Bulk
            </button>
          </div>

          <div className="space-y-4">
            {/* Desktop View Table */}
            <div className="hidden md:block bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Patient Details</th>
                    <th className="px-8 py-5">Medication Log</th>
                    <th className="px-8 py-5">Refill Schedule</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRefills.length > 0 ? filteredRefills.map((ref) => (
                    <tr key={ref.id} className="hover:bg-green-50/10 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 text-[#10B981] rounded-[18px] flex items-center justify-center font-black text-xl group-hover:bg-[#10B981] group-hover:text-white transition-all duration-300 uppercase">
                            {ref.patient.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 flex items-center gap-2 uppercase">
                              {ref.patient}
                              <span className="text-[8px] font-black px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-tighter">{ref.family}</span>
                            </p>
                            <p className="text-[11px] text-gray-500 font-bold">{ref.mobile}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-gray-800 line-clamp-1 uppercase tracking-tight">{ref.lastOrder}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase italic">Ordered: {ref.lastOrderDate}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="relative w-40">
                            <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input 
                              type="date" 
                              defaultValue={ref.nextRefillDate}
                              className="text-[11px] font-black text-black bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-2 focus:ring-4 focus:ring-[#10B981]/10 outline-none w-full"
                            />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-tighter ${ref.daysLeft < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {ref.daysLeft > 0 ? `${ref.daysLeft} days left` : `${Math.abs(ref.daysLeft)} days overdue`}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <button 
                            onClick={() => handleAction(ref.patient, 'Reorder')}
                            className="px-4 py-2 bg-[#10B981] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#059669] transition-all flex items-center gap-1.5 shadow-lg shadow-green-100"
                          >
                            <ShoppingBag size={14} /> Reorder
                          </button>
                          <button 
                            onClick={() => handleAction(ref.patient, 'No Need')}
                            className="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                          >
                            <XCircle size={14} /> Skip
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-black uppercase tracking-widest italic bg-gray-50/30">
                        No refill candidates found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
               {filteredRefills.map(ref => (
                 <div key={ref.id} className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-50 text-[#10B981] rounded-2xl flex items-center justify-center font-black text-xl">{ref.patient.charAt(0)}</div>
                          <div>
                             <h4 className="text-sm font-black text-gray-900 uppercase">{ref.patient}</h4>
                             <p className="text-[10px] text-gray-400 font-bold">{ref.mobile}</p>
                          </div>
                       </div>
                       <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${ref.daysLeft < 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                          {ref.daysLeft < 0 ? 'Overdue' : 'Active'}
                       </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl mb-4">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Cycle Items</p>
                       <p className="text-xs font-bold text-gray-800 uppercase tracking-tight">{ref.lastOrder}</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="flex-1 py-3 bg-[#10B981] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Reorder</button>
                       <button className="flex-1 py-3 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Later</button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecurringModule;
