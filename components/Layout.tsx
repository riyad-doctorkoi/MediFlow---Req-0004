
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Beaker, 
  Link, 
  CreditCard, 
  MessageCircle, 
  BarChart3, 
  User, 
  Settings,
  ArrowLeft,
  ChevronLeft,
  LogOut,
  Wallet
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard_main', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'patients', icon: Users, label: 'Patients' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'tests', icon: Beaker, label: 'Test Management' },
    { id: 'dashboard', icon: Link, label: 'Pharmacy', rotate: true },
    { id: 'accounts', icon: CreditCard, label: 'Accounts' },
    { id: 'communication', icon: MessageCircle, label: 'Communication' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 bg-[#16a34a] rounded-lg flex items-center justify-center text-white font-bold text-xl">
            <Beaker size={24} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-sm leading-tight">MediFlow</h1>
            <p className="text-[10px] text-gray-400">Diagnostic Center</p>
          </div>
          <button className="ml-auto text-gray-300">
            <ChevronLeft size={16} />
          </button>
        </div>

        <div className="p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">Main Navigation</p>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#16a34a] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} className={item.rotate ? 'rotate-45' : ''} />
                <span className="text-[13px] font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Utility Bar */}
        <header className="h-10 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-gray-500">
            <LayoutDashboard size={14} />
            <span>Medical Practice Management</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <span>Welcome, <span className="text-gray-700">riyad.doctorkoi@gmail.com</span></span>
            <button className="text-gray-700 hover:text-red-600 font-medium">Sign Out</button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto bg-white">
          {children}
        </section>
      </div>
    </div>
  );
};

export default Layout;
