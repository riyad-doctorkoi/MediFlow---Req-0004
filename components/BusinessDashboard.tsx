
import React from 'react';
import { 
  Stethoscope, 
  Package, 
  Beaker, 
  Activity, 
  ArrowUpRight, 
  Target, 
  ChevronRight, 
  TrendingDown, 
  BarChart4, 
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react';

const BusinessDashboard: React.FC = () => {
  const serviceSummaries = [
    { 
      type: 'Appointments', 
      icon: Stethoscope, 
      color: 'blue', 
      todayCount: 18, 
      todayColl: 12450, 
      totalCount: 412, 
      totalColl: 284500 
    },
    { 
      type: 'Medicine', 
      icon: Package, 
      color: 'green', 
      todayCount: 42, 
      todayColl: 8340, 
      totalCount: 1250, 
      totalColl: 198563 
    },
    { 
      type: 'Lab Tests', 
      icon: Beaker, 
      color: 'purple', 
      todayCount: 12, 
      todayColl: 15600, 
      totalCount: 284, 
      totalColl: 364200 
    },
    { 
      type: 'Procedures', 
      icon: Activity, 
      color: 'orange', 
      todayCount: 5, 
      todayColl: 24500, 
      totalCount: 62, 
      totalColl: 310500 
    }
  ];

  const recurringInsights = {
    retentionRate: 84.2,
    activePatients: 124,
    dueToday: 12,
    predictedRevenue: 45000,
    lostMonthly: 3
  };

  return (
    <div className="p-6 md:p-10 space-y-10 bg-[#fafafa] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Summary</h1>
          <p className="text-sm text-gray-500 font-medium">Real-time performance across all clinical departments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Live Sync: Active</span>
          </div>
        </div>
      </div>

      {/* Service Line Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceSummaries.map((service, i) => (
          <div key={i} className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl bg-${service.color}-50 text-${service.color}-600 group-hover:scale-110 transition-transform`}>
                <service.icon size={24} />
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{service.type}</p>
                <div className="flex items-center justify-end gap-1.5 text-xs font-black text-gray-900">
                  {service.todayCount} Today <ArrowUpRight size={14} className="text-[#10B981]" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Today's Collection</p>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">৳{service.todayColl.toLocaleString()}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Total Volume</p>
                  <p className="text-xs font-black text-gray-600">{service.totalCount} Orders</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Total Revenue</p>
                  <p className="text-xs font-black text-gray-900 italic">৳{service.totalColl.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Retention & Recurring Management Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Retention Metrics */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 text-[#10B981] rounded-2xl">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Recurring Patient Management</h3>
                <p className="text-xs text-gray-500 font-medium">Smart refill pipeline and retention health</p>
              </div>
            </div>
            <button className="text-xs font-bold text-[#10B981] flex items-center gap-1 hover:underline">
              View Detailed Analytics <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Retention Rate</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{recurringInsights.retentionRate}%</p>
                <span className="text-[10px] font-black text-green-600 mb-1">+2.4%</span>
              </div>
              <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${recurringInsights.retentionRate}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Recur. Patients</p>
              <p className="text-3xl font-black text-gray-900 tracking-tighter">{recurringInsights.activePatients}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Patients on refill</p>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Refills Due Today</p>
              <p className="text-3xl font-black text-orange-500 tracking-tighter">{recurringInsights.dueToday}</p>
              <button className="text-[9px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase">Notify All</button>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Refill Pipeline Value</p>
              <p className="text-3xl font-black text-[#10B981] tracking-tighter">৳{recurringInsights.predictedRevenue.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Predicted 30d Revenue</p>
            </div>
          </div>

          <div className="mt-10 p-5 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm">
                   <TrendingDown size={24} />
                </div>
                <div>
                   <p className="text-sm font-black text-gray-800">Lost Patients This Month</p>
                   <p className="text-xs text-gray-500 font-medium">{recurringInsights.lostMonthly} patients haven't refilled since 45+ days.</p>
                </div>
             </div>
             <button className="px-6 py-2.5 bg-white border border-red-100 text-red-500 rounded-xl text-xs font-black shadow-sm hover:bg-red-50 transition-all">
               Launch Win-back Campaign
             </button>
          </div>
        </div>

        {/* Collection Breakdown Mini-Chart */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Revenue Mix</h3>
            <BarChart4 size={20} className="text-gray-300" />
          </div>
          
          <div className="space-y-6">
            {serviceSummaries.map((s, i) => (
               <div key={i} className="space-y-2">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-gray-600">{s.type}</span>
                    <span className="text-xs font-black text-gray-900">৳{s.totalColl.toLocaleString()}</span>
                 </div>
                 <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                   <div className={`h-full rounded-full bg-${s.color}-500`} style={{ width: `${(s.totalColl / 1200000) * 100}%` }} />
                 </div>
               </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Efficiency Rating</p>
            <div className="flex items-center justify-center gap-1.5">
               <TrendingUp size={16} className="text-[#10B981]" />
               <span className="text-2xl font-black text-gray-900">92.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
