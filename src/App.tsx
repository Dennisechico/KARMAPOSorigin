import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { POSTerminal } from './components/pos/POSTerminal';
import { LayawayManager } from './components/layaways/LayawayManager';
import { ProductionBoard } from './components/production/ProductionBoard';
import { InterLocationTransfers } from './components/logistics/InterLocationTransfers';
import { InventoryLedgerView } from './components/inventory/InventoryLedgerView';
import { ShopifyConsole } from './components/shopify/ShopifyConsole';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { CustomerDirectory } from './components/customers/CustomerDirectory';
import { LoginModal } from './components/auth/LoginModal';
import { CdmxOrders } from './components/orders/CdmxOrders';
import { EventsManager } from './components/events/EventsManager';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('pos');
  const { currentUser, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginModal isOpen required onClose={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-stone-100/70 flex flex-col font-sans text-stone-900 antialiased selection:bg-amber-500 selection:text-white">
      {/* RBAC-aware Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 pb-16">
        {activeTab === 'pos' && <POSTerminal />}
        {activeTab === 'layaways' && <LayawayManager />}
        {activeTab === 'production' && <ProductionBoard />}
        {activeTab === 'orders' && <CdmxOrders />}
        {activeTab === 'events' && <EventsManager />}
        {activeTab === 'logistics' && <InterLocationTransfers />}
        {activeTab === 'inventory' && <InventoryLedgerView />}
        {activeTab === 'shopify' && <ShopifyConsole />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'customers' && <CustomerDirectory />}
      </main>

      {/* Production Footnote & Architecture Status */}
      <footer className="bg-white border-t border-stone-200 py-6 px-4 sm:px-6 lg:px-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-stone-800">Karma Accesorios Buena Vibra &copy; {new Date().getFullYear()}</span>
            <span>&bull;</span>
            <span>Joyería Hecha a Mano &bull; Aguascalientes &bull; CDMX &bull; Shopify</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-stone-400">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>GraphQL Bucket: 1000 pts</span>
            </span>
            <span>&bull;</span>
            <span>ACID Inventory Ledger</span>
            <span>&bull;</span>
            <span>Rol: <strong className="text-stone-700">{currentUser.name}</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
