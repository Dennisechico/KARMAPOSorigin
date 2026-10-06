import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  MapPin, 
  RefreshCw, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Zap,
  ShoppingBag,
  Layers,
  Wrench,
  Truck,
  Database,
  BarChart3,
  Users,
  Lock,
  KeyRound,
  LogOut,
  ClipboardList,
  CalendarDays
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LocationId, User } from '../types';
import { LoginModal } from './auth/LoginModal';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    logout,
    currentLocation, 
    setCurrentLocation, 
    locations, 
    shopifyGraphQLBucket,
    cdmxOrders,
    triggerManualShopifySync,
    resetDemoData,
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Permisos: Karma (personal de eventos) solo vende en la Terminal POS.
  // Todos los demás roles tienen acceso completo, igual que Admin.
  const openCdmxOrders = cdmxOrders.filter(o => o.status === 'pending' || o.status === 'in_transit').length;

  const getNavItems = () => {
    if (currentUser.role === 'Karma') {
      return [
        { id: 'pos', label: 'Terminal POS', icon: ShoppingBag, badge: 'Ventas' },
      ];
    }
    return [
      { id: 'pos', label: 'Punto de Venta POS', icon: ShoppingBag },
      { id: 'layaways', label: 'Apartados a Plazos', icon: Layers },
      { id: 'events', label: 'Eventos', icon: CalendarDays },
      { id: 'orders', label: 'Pedidos CDMX', icon: ClipboardList, badge: openCdmxOrders > 0 ? `${openCdmxOrders}` : undefined },
      { id: 'production', label: 'Taller & Manufactura', icon: Wrench },
      { id: 'logistics', label: 'Logística & Tránsitos', icon: Truck },
      { id: 'inventory', label: 'Inventario & Ledger', icon: Database },
      { id: 'shopify', label: 'Shopify API & Sync', icon: Zap, badge: `${shopifyGraphQLBucket} pts` },
      { id: 'analytics', label: 'Analítica GMROI & Costos', icon: BarChart3, badge: 'Executive' },
      { id: 'customers', label: 'Clientes', icon: Users },
    ];
  };

  const navItems = getNavItems();

  // If currently active tab is not accessible by current role, switch to first valid tab
  React.useEffect(() => {
    const isAccessible = navItems.some(item => item.id === activeTab);
    if (!isAccessible && navItems.length > 0) {
      setActiveTab(navItems[0].id);
    }
  }, [currentUser.role, activeTab, navItems, setActiveTab]);

  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-40 shadow-md">
      {/* Top Banner: Brand + Location Selector + Shopify Status + Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center shrink-0">
            <img
              src="/brand/logo-karma-blanco.png"
              alt="kårma · Accesorios Buena Vibra"
              className="h-10 sm:h-12 w-auto select-none"
              draggable={false}
            />
          </div>

          {/* Center/Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0 ml-2">

            {/* Location Switcher (AGS vs CDMX) */}
            <div className="relative">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700/80 border border-stone-700 text-xs text-stone-200 transition-colors"
                title="Cambiar sede operativa"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium hidden sm:inline">Sede:</span>
                <span className="font-bold text-amber-300">{currentLocation}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {showLocationDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-stone-800 border border-stone-700 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Seleccionar Ubicación
                  </div>
                  {locations.map(loc => (
                    <button
                      key={loc.location_id}
                      onClick={() => {
                        setCurrentLocation(loc.location_id);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-700 transition-colors ${
                        currentLocation === loc.location_id ? 'bg-amber-500/10 text-amber-300 font-semibold' : 'text-stone-300'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{loc.location_name}</p>
                        <p className="text-[10px] text-stone-400">{loc.address}</p>
                      </div>
                      {currentLocation === loc.location_id && (
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shopify API Health Pill */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-stone-800/80 border border-stone-700 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-stone-400 text-[11px]">Shopify API:</span>
              <span className="font-mono text-emerald-400 font-bold">{shopifyGraphQLBucket}/1000 pts</span>
              <button
                onClick={triggerManualShopifySync}
                className="text-stone-400 hover:text-stone-200 p-0.5 transition-colors"
                title="Sincronizar existencias con Shopify"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Role / Auth Switcher with Password Login option */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
                title="Iniciar sesión con usuario y contraseña"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Acceder con Clave</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-all text-xs"
                >
                  <div className={`w-6 h-6 rounded-md ${currentUser.avatar_color} text-white flex items-center justify-center font-bold text-xs`}>
                    {currentUser.name[0]}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="font-bold text-stone-100 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-amber-400/90 leading-tight">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-stone-800 border border-stone-700 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-3 py-1.5 border-b border-stone-700/60 mb-1 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Roles del Sistema</span>
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          Selecciona usuario o usa contraseña:
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowRoleDropdown(false);
                          setShowLoginModal(true);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40"
                      >
                        Login
                      </button>
                    </div>

                    {users.map(u => (
                      <button
                        key={u.user_id}
                        onClick={() => {
                          // Cambiar de rol siempre exige la contraseña de ese usuario
                          setShowRoleDropdown(false);
                          if (currentUser.user_id !== u.user_id) setShowLoginModal(true);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-start space-x-2.5 hover:bg-stone-700 transition-colors ${
                          currentUser.user_id === u.user_id ? 'bg-amber-500/15 border-l-2 border-amber-400' : ''
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-md ${u.avatar_color} text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5`}>
                          {u.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-stone-100">{u.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-900 text-amber-300 border border-stone-700">
                              {u.role}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-400 line-clamp-1">{u.title}</p>
                        </div>
                      </button>
                    ))}

                    <div className="mt-2 pt-2 border-t border-stone-700/60 px-3 space-y-1.5">
                      <button
                        onClick={() => {
                          logout();
                          setShowRoleDropdown(false);
                        }}
                        className="w-full py-1.5 px-2 rounded bg-stone-900 hover:bg-stone-700 text-stone-300 text-[11px] flex items-center justify-center space-x-1.5 border border-stone-700 transition-colors"
                      >
                        <LogOut className="w-3 h-3 text-amber-400" />
                        <span>Cerrar Sesión</span>
                      </button>

                      {currentUser.role !== 'Karma' && (
                      <button
                        onClick={() => {
                          if (confirm('¿Reiniciar el sistema? Se BORRARÁN todas las ventas, apartados, clientes y movimientos, y el stock volverá al inventario inicial. Esta acción no se puede deshacer.')) {
                            resetDemoData();
                            setShowRoleDropdown(false);
                          }
                        }}
                        className="w-full py-1 px-2 rounded bg-stone-900/60 hover:bg-red-950/40 text-stone-500 hover:text-red-300 text-[10px] flex items-center justify-center space-x-1 border border-stone-800 transition-colors"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Reiniciar Datos de Fábrica</span>
                      </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Role Banner / Active Context info */}
      <div className="bg-stone-950 px-4 sm:px-6 lg:px-8 py-1.5 border-t border-stone-800 text-[11px] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2 text-stone-400">
          <span className="text-amber-400 font-semibold">Rol Actual:</span>
          <span className="text-stone-200 font-medium">{currentUser.name} ({currentUser.title})</span>
          <span className="text-stone-600">&bull;</span>
          <span className="text-stone-400 hidden sm:inline">{currentUser.domain}</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-stone-400">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>PWA Lista</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>ACID Ledger Activo</span>
          </span>
        </div>
      </div>

      {/* Navigation Tabs based on RBAC */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-amber-800 text-amber-200' : 'bg-stone-800 text-amber-400 border border-stone-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Login Modal with Username & Password */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
};
