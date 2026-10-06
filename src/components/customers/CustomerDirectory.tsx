import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  Layers, 
  Mail, 
  MessageSquare, 
  Phone, 
  Plus, 
  Search, 
  ShoppingBag, 
  User, 
  UserCheck, 
  Users 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerDirectory: React.FC = () => {
  const { customers, sales, addCustomer } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.phone_number.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.notes && c.notes.toLowerCase().includes(q))
    );
  });

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      alert('Nombre y teléfono son obligatorios');
      return;
    }
    addCustomer({
      full_name: newName.trim(),
      phone_number: newPhone.trim(),
      email: newEmail.trim() || undefined,
      notes: newNotes.trim() || undefined,
    });
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
  };

  const getCustomerMetrics = (customerId: string) => {
    const customerSales = sales.filter(s => s.customer_id === customerId);
    const activeLayaways = customerSales.filter(s => s.status === 'active_layaway');
    const totalSpent = customerSales
      .filter(s => s.status !== 'cancelled')
      .reduce((sum, s) => sum + s.amount_paid, 0);
    const pendingBalance = activeLayaways.reduce((sum, s) => sum + s.balance_due, 0);

    return {
      totalSalesCount: customerSales.length,
      activeLayawayCount: activeLayaways.length,
      totalSpent,
      pendingBalance,
    };
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const text = `¡Hola ${name}! Te saludamos de *Karma Accesorios Buena Vibra*. 🪬 ¿En qué podemos consentirte el día de hoy?`;
    window.open(`https://wa.me/52${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-stone-900">
              Directorio de Clientes y Cartera de Crédito
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
              {customers.length} Clientes Registrados
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gestión de clientes, historial de compras omnicanal, seguimiento de apartados y contacto directo por WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o notas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map(customer => {
          const metrics = getCustomerMetrics(customer.customer_id);

          return (
            <div
              key={customer.customer_id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                      {customer.full_name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">{customer.full_name}</h3>
                      <p className="text-[10px] text-stone-400 font-mono">ID: {customer.customer_id}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openWhatsApp(customer.phone_number, customer.full_name)}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg transition-colors"
                    title="Enviar WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

                {/* Contact info */}
                <div className="py-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{customer.phone_number}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.notes && (
                    <div className="p-2 bg-stone-50 rounded-md border border-stone-200 text-[11px] text-stone-500 mt-2">
                      <em>&ldquo;{customer.notes}&rdquo;</em>
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-stone-50 rounded-lg">
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Total Pagado</span>
                    <span className="font-bold text-stone-900">${metrics.totalSpent.toFixed(2)} MXN</span>
                  </div>
                  <div className={`p-2.5 rounded-lg ${metrics.pendingBalance > 0 ? 'bg-amber-50 text-amber-900' : 'bg-stone-50 text-stone-500'}`}>
                    <span className="text-[10px] uppercase font-bold block">Saldo en Apartados</span>
                    <span className="font-bold">${metrics.pendingBalance.toFixed(2)} MXN</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Compras: {metrics.totalSalesCount} tickets</span>
                {metrics.activeLayawayCount > 0 && (
                  <span className="text-amber-700 font-bold">
                    {metrics.activeLayawayCount} apartado(s) activo(s)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-400 text-sm">
          No se encontraron clientes con ese criterio.
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <h3 className="font-bold text-base text-stone-900">Registrar Nuevo Cliente</h3>
            <form onSubmit={handleAddCustomerSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Claudia Morales"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="ej. 55-4433-2211"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Correo Electrónico (Opcional)</label>
                <input
                  type="email"
                  placeholder="ej. claudia@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Notas / Medidas / Preferencias</label>
                <textarea
                  rows={2}
                  placeholder="Preferencia por plata .925, medidas de pulsera..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
