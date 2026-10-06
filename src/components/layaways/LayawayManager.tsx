import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText, 
  Layers, 
  MessageSquare, 
  PackageCheck, 
  Phone, 
  PlusCircle, 
  RotateCcw, 
  Search, 
  User 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Sale } from '../../types';
import { DigitalReceiptModal } from '../receipts/DigitalReceiptModal';

export const LayawayManager: React.FC = () => {
  const { 
    sales, 
    customers, 
    currentUser, 
    recordLayawayPayment, 
    deliverLayaway, 
    cancelLayaway 
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'cancelled'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Abono Payment Modal
  const [selectedSaleForPayment, setSelectedSaleForPayment] = useState<Sale | null>(null);
  const [abonoAmount, setAbonoAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [nextPaymentDueDate, setNextPaymentDueDate] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  // Selected receipt to view
  const [viewingReceiptSale, setViewingReceiptSale] = useState<Sale | null>(null);

  // Filter only layaways
  const layaways = sales.filter(s => s.sale_type === 'layaway');

  const filteredLayaways = layaways.filter(sale => {
    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'active' ? sale.status === 'active_layaway' :
      filterStatus === 'completed' ? (sale.status === 'completed' || sale.status === 'delivered') :
      sale.status === 'cancelled';

    const customer = customers.find(c => c.customer_id === sale.customer_id);
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      sale.folio.toLowerCase().includes(query) ||
      (customer && (customer.full_name.toLowerCase().includes(query) || customer.phone_number.includes(query))) ||
      sale.items.some(i => i.product_name.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  // Calculate Layaway Metrics
  const totalActiveLayaways = layaways.filter(s => s.status === 'active_layaway').length;
  const totalReceivableBalance = layaways
    .filter(s => s.status === 'active_layaway')
    .reduce((sum, s) => sum + s.balance_due, 0);
  const totalCollectedOnLayaways = layaways.reduce((sum, s) => sum + s.amount_paid, 0);

  const handleOpenAbonoModal = (sale: Sale) => {
    setSelectedSaleForPayment(sale);
    setAbonoAmount(Math.min(sale.balance_due, 200).toString());
    const d = new Date();
    d.setDate(d.getDate() + 15);
    setNextPaymentDueDate(d.toISOString().split('T')[0]);
    setPaymentNotes('');
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSaleForPayment) return;
    const amount = parseFloat(abonoAmount);
    if (!amount || amount <= 0) {
      alert('Ingresa un monto válido');
      return;
    }
    if (amount > selectedSaleForPayment.balance_due) {
      alert(`El abono no puede ser mayor al saldo adeudado ($${selectedSaleForPayment.balance_due.toFixed(2)} MXN)`);
      return;
    }

    const res = recordLayawayPayment({
      saleId: selectedSaleForPayment.sale_id,
      amount,
      paymentMethod,
      notes: paymentNotes.trim() || undefined,
      nextPaymentDueDate: nextPaymentDueDate || undefined,
    });

    if (res.success) {
      // Find updated sale to show receipt
      const updated = sales.find(s => s.sale_id === selectedSaleForPayment.sale_id);
      setSelectedSaleForPayment(null);
      if (updated) setViewingReceiptSale(updated);
    } else {
      alert(res.error || 'Error registrando abono');
    }
  };

  const handleDeliver = (saleId: string) => {
    if (confirm('¿Confirmas la entrega física de la joya al cliente? Las piezas saldrán de Inventario Reservado.')) {
      deliverLayaway(saleId);
    }
  };

  const handleCancel = (saleId: string) => {
    const reason = prompt('Motivo de cancelación del apartado (ej. Plazo vencido / Solicitud de cliente):');
    if (reason !== null) {
      cancelLayaway(saleId, reason);
    }
  };

  const sendWhatsAppReminder = (sale: Sale) => {
    const cust = customers.find(c => c.customer_id === sale.customer_id);
    if (!cust || !cust.phone_number) return;
    const phone = cust.phone_number.replace(/\D/g, '');
    const text = `✨ *Karma Accesorios Buena Vibra* ✨%0A%0A` +
      `¡Hola ${cust.full_name}! Te recordamos con mucho cariño tu apartado con folio *${sale.folio}*:%0A` +
      `*Joyas:* ${sale.items.map(i => i.product_name).join(', ')}%0A` +
      `*Saldo restante:* $${sale.balance_due.toFixed(2)} MXN%0A` +
      `*Fecha límite sugerida:* ${sale.next_payment_due_date || 'Próximos días'}%0A%0A` +
      `Tus piezas están resguardadas en nuestro inventario reservado esperando por ti. Puedes abonar en tienda física (${sale.location_id}) o por transferencia SPEI. ¡Te esperamos! 🪬`;
    window.open(`https://wa.me/52${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-stone-900">
              Control de Apartados a Plazos y Abonos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              Módulo de Apartados
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gestión de cartera crediticia con retención física de existencias y bloqueo automático de venta en Shopify.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="flex items-center space-x-3">
          <div className="bg-white border border-stone-200 rounded-xl px-4 py-2 text-right shadow-xs">
            <p className="text-[10px] uppercase font-bold text-stone-500">Apartados Activos</p>
            <p className="text-base font-bold text-amber-700">{totalActiveLayaways}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl px-4 py-2 text-right shadow-xs">
            <p className="text-[10px] uppercase font-bold text-stone-500">Saldo por Cobrar</p>
            <p className="text-base font-bold text-stone-900">${totalReceivableBalance.toFixed(2)} MXN</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, teléfono o folio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex space-x-1 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'active'
                ? 'bg-amber-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Activos ({layaways.filter(s => s.status === 'active_layaway').length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'completed'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Liquidados ({layaways.filter(s => s.status === 'completed' || s.status === 'delivered').length})
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'cancelled'
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Cancelados ({layaways.filter(s => s.status === 'cancelled').length})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos ({layaways.length})
          </button>
        </div>
      </div>

      {/* Layaways Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLayaways.map(sale => {
          const customer = customers.find(c => c.customer_id === sale.customer_id);
          const percentPaid = Math.round((sale.amount_paid / sale.total_amount) * 100);
          const isOverdue = sale.status === 'active_layaway' && sale.next_payment_due_date && new Date(sale.next_payment_due_date) < new Date();
          const isFullyPaid = sale.balance_due === 0;

          return (
            <div
              key={sale.sale_id}
              className={`bg-white rounded-xl border p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md ${
                isOverdue ? 'border-amber-400 bg-amber-50/15' : 'border-stone-200'
              }`}
            >
              <div>
                {/* Header: Folio, Date & Status */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-stone-900">{sale.folio}</span>
                    <span className="text-[10px] text-stone-500 block">{sale.created_at.split(' ')[0]}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sale.status === 'active_layaway'
                        ? isOverdue ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        : sale.status === 'delivered'
                        ? 'bg-blue-100 text-blue-800'
                        : sale.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {sale.status === 'active_layaway' ? (isOverdue ? 'Vencido' : 'En Abonos') :
                       sale.status === 'delivered' ? 'Entregado' :
                       sale.status === 'completed' ? 'Saldado' : 'Cancelado'}
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">{sale.location_id}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="py-2.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-800">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>{customer ? customer.full_name : 'Cliente Mostrador'}</span>
                  </div>
                  {customer && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-stone-500 mt-0.5 pl-5">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>{customer.phone_number}</span>
                    </div>
                  )}
                </div>

                {/* Jewelry Pieces */}
                <div className="py-2 border-t border-b border-stone-100 space-y-1">
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Piezas en Resguardo:</p>
                  {sale.items.map(item => (
                    <div key={item.sale_item_id} className="text-xs text-stone-700 flex justify-between">
                      <span className="line-clamp-1">{item.quantity}x {item.product_name}</span>
                      <span className="font-mono text-stone-500 font-medium">${item.unit_price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="py-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-600">Avance ({percentPaid}%)</span>
                    <span className="text-stone-900">${sale.amount_paid} / ${sale.total_amount} MXN</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentPaid >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentPaid}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1">
                    <span className="text-stone-500">Saldo Restante:</span>
                    <span className="font-bold text-amber-900">${sale.balance_due.toFixed(2)} MXN</span>
                  </div>
                  {sale.status === 'active_layaway' && sale.next_payment_due_date && (
                    <div className="flex items-center justify-between text-[10px] text-stone-500 pt-0.5">
                      <span>Límite de pago:</span>
                      <span className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-stone-700'}`}>
                        {sale.next_payment_due_date}
                      </span>
                    </div>
                  )}
                </div>

                {/* Payments Count */}
                <div className="text-[10px] text-stone-400 mb-3">
                  {sale.payments.length} abono(s) registrado(s) en auditoría contable.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap gap-1.5">
                {sale.status === 'active_layaway' && (
                  <>
                    <button
                      onClick={() => handleOpenAbonoModal(sale)}
                      className="flex-1 py-2 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-xs transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Registrar Abono</span>
                    </button>
                    {customer?.phone_number && (
                      <button
                        onClick={() => sendWhatsAppReminder(sale)}
                        className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs transition-colors"
                        title="Recordatorio por WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleCancel(sale.sale_id)}
                      className="p-2 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-500 hover:text-red-600 text-xs transition-colors"
                      title="Cancelar apartado y reintegrar stock"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {sale.status === 'completed' && (
                  <button
                    onClick={() => handleDeliver(sale.sale_id)}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>Entregar Joya al Cliente</span>
                  </button>
                )}

                <button
                  onClick={() => setViewingReceiptSale(sale)}
                  className="w-full mt-1 py-1.5 px-2 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 text-[11px] font-medium border border-stone-200 flex items-center justify-center space-x-1 transition-colors"
                >
                  <FileText className="w-3 h-3 text-stone-400" />
                  <span>Ver Comprobante / Recibo</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredLayaways.length === 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 text-sm">
          No hay registros de apartados con el filtro actual.
        </div>
      )}

      {/* Record Abono / Payment Modal */}
      {selectedSaleForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div>
              <h3 className="font-bold text-base text-stone-900">
                Registrar Abono a Plazos
              </h3>
              <p className="text-xs text-stone-500">
                Folio: <strong className="text-stone-800">{selectedSaleForPayment.folio}</strong> &bull; Saldo pendiente: <strong className="text-amber-800">${selectedSaleForPayment.balance_due.toFixed(2)} MXN</strong>
              </p>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Monto del Abono ($ MXN) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={abonoAmount}
                    onChange={(e) => setAbonoAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="flex space-x-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setAbonoAmount((selectedSaleForPayment.balance_due / 2).toFixed(2))}
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-[10px] text-stone-600"
                  >
                    50% ($ync)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAbonoAmount(selectedSaleForPayment.balance_due.toString())}
                    className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-[10px] text-amber-800 font-bold"
                  >
                    Liquidar Todo (${selectedSaleForPayment.balance_due})
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Método de Pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50"
                >
                  <option value="cash">Efectivo en Mostrador</option>
                  <option value="card">Tarjeta de Débito / Crédito</option>
                  <option value="transfer">Transferencia SPEI</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Reprogramar Fecha de Siguiente Pago
                </label>
                <input
                  type="date"
                  value={nextPaymentDueDate}
                  onChange={(e) => setNextPaymentDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Notas de Pago (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Recibido en tienda AGS..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedSaleForPayment(null)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Emitir Recibo &amp; Aplicar Abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {viewingReceiptSale && (
        <DigitalReceiptModal
          sale={viewingReceiptSale}
          onClose={() => setViewingReceiptSale(null)}
        />
      )}

    </div>
  );
};
