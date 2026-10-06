import React, { useState } from 'react';
import {
  Banknote,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  Landmark,
  MapPin,
  Plus,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KarmaEvent, PaymentMethod, Sale } from '../../types';

const money = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

// Resumen de lo vendido en un evento (las ventas canceladas no cuentan)
const summarize = (eventSales: Sale[]) => {
  const valid = eventSales.filter(s => s.status !== 'cancelled');
  const byMethod: Record<PaymentMethod, number> = { cash: 0, card: 0, transfer: 0 };
  const byProduct = new Map<string, { name: string; sku?: string; quantity: number; amount: number }>();

  valid.forEach(s => {
    s.payments.forEach(p => { byMethod[p.payment_method] += p.amount_paid; });
    s.items.forEach(i => {
      const row = byProduct.get(i.variant_id) || { name: i.product_name, sku: i.sku, quantity: 0, amount: 0 };
      row.quantity += i.quantity;
      row.amount += i.unit_price * i.quantity;
      byProduct.set(i.variant_id, row);
    });
  });

  return {
    salesCount: valid.length,
    pieces: valid.reduce((acc, s) => acc + s.items.reduce((a, i) => a + i.quantity, 0), 0),
    totalSold: valid.reduce((acc, s) => acc + s.total_amount, 0),
    collected: byMethod.cash + byMethod.card + byMethod.transfer,
    byMethod,
    products: Array.from(byProduct.values()).sort((a, b) => b.amount - a.amount),
  };
};

const EMPTY_FORM = { name: '', date: '', startTime: '', endTime: '', address: '', notes: '' };

export const EventsManager: React.FC = () => {
  const { events, sales, activeEventId, setActiveEventId, createEvent, setEventStatus } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createEvent(form);
    if (res.success) {
      setForm(EMPTY_FORM);
      setErrorMsg('');
      setShowForm(false);
    } else {
      setErrorMsg(res.error || 'No se pudo crear el evento.');
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setErrorMsg('');
  };

  const sortedEvents = [...events].sort((a, b) => (b.date + b.start_time).localeCompare(a.date + a.start_time));
  const overall = summarize(sales.filter(s => s.event_id));

  const METHODS: { id: PaymentMethod; label: string; icon: typeof Banknote }[] = [
    { id: 'cash', label: 'Efectivo', icon: Banknote },
    { id: 'card', label: 'Tarjeta', icon: CreditCard },
    { id: 'transfer', label: 'Transferencia', icon: Landmark },
  ];

  const inputClass = 'w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-amber-500';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-stone-900">Eventos y Bazares</h1>
            <p className="text-xs text-stone-500 mt-1">
              Registra cada evento con su fecha, horario y dirección. Al elegirlo en el punto de venta, las ventas quedan atribuidas a ese evento.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Evento</span>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <p className="text-[11px] text-stone-500">Eventos registrados</p>
            <p className="text-lg font-bold text-stone-900">{events.length}</p>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <p className="text-[11px] text-stone-500">Vendido en eventos</p>
            <p className="text-lg font-bold text-stone-900">{money(overall.totalSold)}</p>
          </div>
          {METHODS.map(m => (
            <div key={m.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <p className="text-[11px] text-stone-500 flex items-center space-x-1">
                <m.icon className="w-3 h-3" />
                <span>{m.label}</span>
              </p>
              <p className="text-lg font-bold text-stone-900">{money(overall.byMethod[m.id])}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Events list */}
      {sortedEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center">
          <CalendarDays className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-stone-700">Aún no hay eventos</p>
          <p className="text-xs text-stone-500 mt-1">Crea el primero con “Nuevo Evento”.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEvents.map((ev: KarmaEvent) => {
            const summary = summarize(sales.filter(s => s.event_id === ev.event_id));
            const isActiveInPos = activeEventId === ev.event_id && ev.status === 'Activo';
            const expanded = expandedId === ev.event_id;
            return (
              <div key={ev.event_id} className={`bg-white rounded-2xl border p-5 shadow-xs ${isActiveInPos ? 'border-amber-500' : 'border-stone-200'}`}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <h2 className="font-bold text-base text-stone-900">{ev.name}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        ev.status === 'Activo'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border-stone-300'
                      }`}>
                        {ev.status}
                      </span>
                      {isActiveInPos && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          En uso en el punto de venta
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 space-y-0.5 text-xs text-stone-600">
                      <p className="flex items-center space-x-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="capitalize">{formatDate(ev.date)}</span>
                      </p>
                      <p className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{ev.start_time} a {ev.end_time} h</span>
                      </p>
                      <p className="flex items-start space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span>{ev.address}</span>
                      </p>
                      {ev.notes && <p className="text-[11px] text-stone-500">Nota: {ev.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {ev.status === 'Activo' && !isActiveInPos && (
                      <button
                        onClick={() => setActiveEventId(ev.event_id)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Vender en este evento</span>
                      </button>
                    )}
                    {isActiveInPos && (
                      <button
                        onClick={() => setActiveEventId(null)}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-stone-700 border border-stone-300 hover:bg-stone-50"
                      >
                        Dejar de vender aquí
                      </button>
                    )}
                    <button
                      onClick={() => setEventStatus(ev.event_id, ev.status === 'Activo' ? 'Finalizado' : 'Activo')}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-stone-700 border border-stone-300 hover:bg-stone-50"
                    >
                      {ev.status === 'Activo' ? 'Finalizar evento' : 'Reabrir'}
                    </button>
                  </div>
                </div>

                {/* Sales summary */}
                <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
                  <div>
                    <p className="text-stone-500">Ventas</p>
                    <p className="text-base font-bold text-stone-900">{summary.salesCount}</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Piezas</p>
                    <p className="text-base font-bold text-stone-900">{summary.pieces}</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Total vendido</p>
                    <p className="text-base font-bold text-amber-800">{money(summary.totalSold)}</p>
                  </div>
                  {METHODS.map(m => (
                    <div key={m.id}>
                      <p className="text-stone-500 flex items-center space-x-1">
                        <m.icon className="w-3 h-3" />
                        <span>{m.label}</span>
                      </p>
                      <p className="text-base font-bold text-stone-900">{money(summary.byMethod[m.id])}</p>
                    </div>
                  ))}
                </div>
                {Math.abs(summary.totalSold - summary.collected) > 0.009 && (
                  <p className="text-[11px] text-stone-500 mt-2">
                    Cobrado hasta ahora: {money(summary.collected)}. La diferencia son apartados con saldo pendiente.
                  </p>
                )}

                {/* Products sold */}
                {summary.products.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => setExpandedId(expanded ? null : ev.event_id)}
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-800 hover:text-amber-900"
                    >
                      {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      <span>{expanded ? 'Ocultar' : 'Ver'} productos vendidos ({summary.products.length})</span>
                    </button>
                    {expanded && (
                      <table className="w-full mt-2 text-xs">
                        <thead>
                          <tr className="text-left text-stone-500 border-b border-stone-200">
                            <th className="py-1.5 font-semibold">Producto</th>
                            <th className="py-1.5 font-semibold text-center">Piezas</th>
                            <th className="py-1.5 font-semibold text-right">Importe</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {summary.products.map((p, idx) => (
                            <tr key={idx}>
                              <td className="py-1.5 text-stone-800">
                                {p.sku && <span className="font-mono text-stone-500 mr-1.5">{p.sku}</span>}
                                {p.name}
                              </td>
                              <td className="py-1.5 text-center font-bold text-stone-900">{p.quantity}</td>
                              <td className="py-1.5 text-right font-bold text-stone-900">{money(p.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New event modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
            <div className="px-5 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Nuevo Evento</h3>
                <p className="text-[11px] text-stone-400">Bazar, feria, pop-up o cualquier venta fuera de tienda</p>
              </div>
              <button onClick={closeForm} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {errorMsg && <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs">{errorMsg}</div>}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nombre del evento *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej. Bazar Roma Norte"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Fecha *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Hora de inicio *</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Hora de fin *</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Dirección *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Calle, número, colonia, ciudad"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Notas (opcional)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Ej. Costo del stand, contacto del organizador"
                  className={inputClass}
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end space-x-2">
                <button type="button" onClick={closeForm} className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs">
                  Crear evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
