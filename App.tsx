
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import BusinessDashboard from './components/BusinessDashboard.tsx';
import RecurringModule from './components/RecurringModule.tsx';
import AccountsModule from './components/AccountsModule.tsx';
import { Settings, Users, Calendar, Beaker, MessageCircle, BarChart3, User } from 'lucide-react';
import { OrderRecord } from './types.ts';

const INITIAL_RECENT_ORDERS: OrderRecord[] = [
  { id: 'INV-882190', patientName: 'AFIA FARZANA', mobile: '01727318035', date: 'Jan 25, 2026', totalAmount: 2585, discountAmount: 120, type: 'Direct Sell', items: ['Sergel 20mg', 'Napa Extend'], initial: 'AF' },
  { id: 'INV-882191', patientName: 'MEZBAH UDDIN', mobile: '01833441100', date: 'Jan 24, 2026', totalAmount: 1120, discountAmount: 50, type: 'Home Delivery', items: ['Concor 5mg', 'Ace Plus'], initial: 'MU' },
  { id: 'INV-882192', patientName: 'ANOWARA BEGUM', mobile: '01711002233', date: 'Jan 24, 2026', totalAmount: 840, discountAmount: 0, type: 'Direct Sell', items: ['Napa 500mg'], initial: 'AB' },
  { id: 'INV-882193', patientName: 'ZAKIR HOSSAIN', mobile: '01911883300', date: 'Jan 23, 2026', totalAmount: 4050, discountAmount: 450, type: 'Home Delivery', items: ['Atova 10mg', 'Comet XR'], initial: 'ZH' },
];

const PlaceholderContent: React.FC<{ title: string; icon: any }> = ({ title, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
      <Icon size={48} />
    </div>
    <h2 className="text-2xl font-bold text-gray-900">{title} Module</h2>
    <p className="text-gray-500 max-w-sm">This module is part of the designer-ready spec and is currently being developed according to the UI/UX mockups.</p>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard_main');
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_RECENT_ORDERS);

  const addOrder = (newOrder: OrderRecord) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('header input')?.focus();
      }
      if (e.altKey && e.key === 'n') {
        alert("Quick Add Patient Modal triggered");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard_main':
        return <BusinessDashboard />;
      case 'dashboard':
        return <Dashboard recentOrders={orders} onAddOrder={addOrder} />;
      case 'recurring':
        return <RecurringModule />;
      case 'inventory':
        return <Dashboard initialTab="inventory" recentOrders={orders} onAddOrder={addOrder} />;
      case 'accounts':
        return <AccountsModule />;
      case 'patients':
        return <PlaceholderContent title="Patients" icon={Users} />;
      case 'appointments':
        return <PlaceholderContent title="Appointments" icon={Calendar} />;
      case 'tests':
        return <PlaceholderContent title="Lab Tests" icon={Beaker} />;
      case 'communication':
        return <PlaceholderContent title="Communication" icon={MessageCircle} />;
      case 'analytics':
        return <PlaceholderContent title="Analytics" icon={BarChart3} />;
      case 'profile':
        return <PlaceholderContent title="Profile" icon={User} />;
      case 'settings':
        return <PlaceholderContent title="Settings" icon={Settings} />;
      default:
        return <BusinessDashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
