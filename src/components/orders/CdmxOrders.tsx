import React, { useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Minus,
  PackageCheck,
  Plus,
  Search,
  Send,
  Trash2,
  Truck,
  UserRound,
  X,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CdmxOrder, CdmxOrderStatus, CdmxOrderType, LocationId, SaleChannel } from '../../types';

const STATUS_LABEL: Record<CdmxOrderStatus, string> = {
  pending: 'Pendiente',
  in_transit: 'En tránsito',
  received: 'Recibido en CDMX',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_STYLE: Record<CdmxOrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-900 border-amber-300',
  in_transit: 'bg-sky-100 text-sky-800 border-sky-200',
  received: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-stone-100 text-stone-500 border-stone-300',
};

type Filter = 'open' | 'restock' | 'customer' | 'closed';
const MAX_RESULTS = 8;

export const CdmxOrders: React.FC = () => {
  const {
    cdmxOrders,
    products,
    createCdmxOrder,
    dispatchRestockOrder,
    receiveRestockOrder,
    deliverCustomerOrder,
    cancelCdmxOrder,
  } = useApp();

  const [filter, setFilter] = useState<Filter>('open');
  const [newOrderType, setNewOrderType] = useState<CdmxOrderType | null>(null);

  // Formulario de pedido nuevo
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<{ variantId: string; quantity: number }[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [saleChannel, setSaleChannel] = useState<SaleChannel>('whatsapp');
  const [stockOrigin, setStockOrigin] = useState<LocationId>('AGS');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Entrega de pedido de cliente
  const [deliverOrder, setDeliverOrder] = useState<CdmxOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');

  const allVariants = products.flatMap(p => p.variants.map(v => ({ ...v, product_name: p.name })));
  const variantById = new Map<string, typeof allVariants[number]>(allVariants.map(v => [v.variant_id, v]));

  const isCustomerForm = newOrderType === 'customer';
  const availableFor = (v: { stock_ags: number; stock_cdmx: number }) =>
    isCustomerForm ? (stockOrigin === 'AGS' ? v.stock_ags : v.stock_cdmx) : v.stock_ags;

  const q = query.trim().toLowerCase();
  const searchResults = q
    ? allVariants
        .filter(v => v.product_name.toLowerCase().includes(q) || v.sku.toLowerCase().includes(q))
        .slice(0, MAX_RESULTS)
    : [];

  const closeForm = () => {
    setNewOrderType(null);
    setQuery('');
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
    setErrorMsg('');
  };

  const addToCart = (variantId: string) => {
    setCart(prev => prev.some(i => i.variantId === variantId)
      ? prev.map(i => i.variantId === variantId ? { ...i, quantity: i.quantity + 1 } : i)
      : [...prev, { variantId, quantity: 1 }]);
    setQuery('');
  };

  const changeQty = (variantId: string, delta: number) => {
    setCart(prev => prev
      .map(i => i.variantId === variantId ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0));
  };

  const cartTotal = cart.reduce((acc, i) => acc + (variantById.get(i.variantId)?.unit_price || 0) * i.quantity, 0);
  const cartPieces = cart.reduce((acc, i) => acc + i.quantity, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderType) return;
    const res = createCdmxOrder({
      type: newOrderType,
      items: cart,
      customerName,
      customerPhone,
      saleChannel,
      stockOrigin,
      notes,
    });
    if (res.success) {
      closeForm();
      setFilter('open');
    } else {
      setErrorMsg(res.error || 'No se pudo registrar el pedido.');
    }
  };

  const run = (res: { success: boolean; error?: string }) => {
    if (!res.success) alert(res.error || 'No se pudo completar la acción.');
  };

  const isOpen = (o: CdmxOrder) => o.status === 'pending' || o.status === 'in_transit';
  const visibleOrders = cdmxOrders.filter(o => {
    if (filter === 'open') return isOpen(o);
    if (filter === 'closed') return !isOpen(o);
    return o.type === filter;
  });

  const count = (f: Filter) => cdmxOrders.filter(o =>
    f === 'open' ? isOpen(o) : f === 'closed' ? !isOpen(o) : o.type === f
  ).length;

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'open', label: 'Abiertos' },
    { id: 'restock', label: 'Resurtidos' },
    { id: 'customer', label: 'Pedidos de cliente' },
    { id: 'closed', label: 'Cerrados' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-stone-900">Pedidos CDMX</h1>
            <p className="text-xs text-stone-500 mt-1">
              Resurtidos de mercancía desde Aguascalientes y pedidos de clientes de Ciudad de México.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setNewOrderType('restock')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Nuevo Resurtido</span>
            </button>
            <button
              onClick={() => setNewOrderType('customer')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-amber-500 font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <UserRound className="w-4 h-4" />
              <span>Nuevo Pedido de Cliente</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filter === f.id
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {f.label} ({count(f.id)})
          </button>
        ))}
      </div>

      {/* Orders list */}
      {visibleOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center">
          <ClipboardList className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-stone-700">No hay pedidos en esta vista</p>
          <p className="text-xs text-stone-500 mt-1">
            Usa “Nuevo Resurtido” para pedir mercancía a AGS o “Nuevo Pedido de Cliente” para apartar piezas a un cliente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visibleOrders.map(o => (
            <div key={o.order_id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    {o.type === 'restock'
                      ? <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                      : <UserRound className="w-4 h-4 text-amber-600 shrink-0" />}
                    <span className="font-mono font-bold text-sm text-stone-900">{o.folio}</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    {o.type === 'restock'
                      ? 'Resurtido AGS → CDMX'
                      : <>Cliente: <strong className="text-stone-900">{o.customer_name}</strong>{o.customer_phone ? ` · ${o.customer_phone}` : ''}</>}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {o.created_at} · {o.created_by}
                    {o.type === 'customer' && o.stock_origin ? ` · Stock apartado en ${o.stock_origin}` : ''}
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${STATUS_STYLE[o.status]}`}>
                  {STATUS_LABEL[o.status]}
                </span>
              </div>

              <ul className="mt-3 divide-y divide-stone-100 border-y border-stone-100 text-xs">
                {o.items.map(item => (
                  <li key={item.variant_id} className="py-1.5 flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate">
                      <span className="font-mono text-stone-500">{item.sku}</span>{' '}
                      <span className="text-stone-800">{item.product_name}</span>
                    </span>
                    <span className="shrink-0 font-bold text-stone-900">× {item.quantity}</span>
                  </li>
                ))}
              </ul>

              {o.notes && <p className="text-[11px] text-stone-500 mt-2">Nota: {o.notes}</p>}
              {o.sale_folio && <p className="text-[11px] text-emerald-700 mt-2">Venta registrada: {o.sale_folio}</p>}

              <div className="mt-3 pt-1 flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs text-stone-600">
                  {o.items.reduce((a, i) => a + i.quantity, 0)} pzas ·{' '}
                  <strong className="text-stone-900">${o.total_amount.toLocaleString()} MXN</strong>
                </span>

                <div className="flex items-center gap-2">
                  {o.status === 'pending' && (
                    <button
                      onClick={() => { if (confirm(`¿Cancelar ${o.folio}?`)) run(cancelCdmxOrder(o.order_id)); }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-stone-600 hover:text-red-700 hover:bg-red-50 border border-stone-200"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancelar</span>
                    </button>
                  )}
                  {o.type === 'restock' && o.status === 'pending' && (
                    <button
                      onClick={() => run(dispatchRestockOrder(o.order_id))}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Surtir y enviar desde AGS</span>
                    </button>
                  )}
                  {o.type === 'restock' && o.status === 'in_transit' && (
                    <button
                      onClick={() => run(receiveRestockOrder(o.order_id))}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>Confirmar recepción en CDMX</span>
                    </button>
                  )}
                  {o.type === 'customer' && o.status === 'pending' && (
                    <button
                      onClick={() => setDeliverOrder(o)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Entregar y cobrar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New order modal */}
      {newOrderType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  {isCustomerForm ? 'Nuevo Pedido de Cliente (CDMX)' : 'Nuevo Resurtido para CDMX'}
                </h3>
                <p className="text-[11px] text-stone-400">
                  {isCustomerForm
                    ? 'El stock se aparta al registrar el pedido y se cobra al entregar.'
                    : 'CDMX solicita piezas; Aguascalientes las surte y envía.'}
                </p>
              </div>
              <button onClick={closeForm} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 overflow-y-auto">
              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs">{errorMsg}</div>
              )}

              {isCustomerForm && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Nombre del cliente *</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Teléfono / WhatsApp</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Canal del pedido</label>
                      <select
                        value={saleChannel}
                        onChange={(e) => setSaleChannel(e.target.value as SaleChannel)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="instagram">Instagram</option>
                        <option value="physical">En tienda</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Apartar stock de</label>
                      <select
                        value={stockOrigin}
                        onChange={(e) => { setStockOrigin(e.target.value as LocationId); setCart([]); }}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="AGS">Aguascalientes (se envía a CDMX)</option>
                        <option value="CDMX">Ciudad de México</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Product search */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Agregar productos</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por nombre o SKU..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-1 border border-stone-200 rounded-lg divide-y divide-stone-100 max-h-56 overflow-y-auto">
                    {searchResults.map(v => {
                      const available = availableFor(v);
                      const blocked = isCustomerForm && available <= 0;
                      return (
                        <button
                          key={v.variant_id}
                          type="button"
                          disabled={blocked}
                          onClick={() => addToCart(v.variant_id)}
                          className="w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-3 hover:bg-amber-50 disabled:opacity-40 disabled:hover:bg-white"
                        >
                          <span className="min-w-0 truncate">
                            <span className="font-mono text-stone-500">{v.sku}</span>{' '}
                            <span className="font-semibold text-stone-900">{v.product_name}</span>
                          </span>
                          <span className="shrink-0 text-stone-600">
                            AGS <strong>{v.stock_ags}</strong> · CDMX <strong>{v.stock_cdmx}</strong>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {q && searchResults.length === 0 && (
                  <p className="text-[11px] text-stone-500 mt-1">No hay productos con ese nombre o SKU.</p>
                )}
              </div>

              {/* Cart */}
              <div className="border border-stone-200 rounded-xl">
                {cart.length === 0 ? (
                  <p className="p-4 text-center text-xs text-stone-500">Aún no hay productos en el pedido.</p>
                ) : (
                  <ul className="divide-y divide-stone-100">
                    {cart.map(i => {
                      const v = variantById.get(i.variantId);
                      if (!v) return null;
                      const available = availableFor(v);
                      const over = i.quantity > available;
                      return (
                        <li key={i.variantId} className="px-3 py-2 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900 truncate">{v.product_name}</p>
                            <p className={`text-[11px] ${over ? 'text-red-600 font-semibold' : 'text-stone-500'}`}>
                              <span className="font-mono">{v.sku}</span> · Disponible en {isCustomerForm ? stockOrigin : 'AGS'}: {available}
                              {over ? ' · excede el stock' : ''}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button type="button" onClick={() => changeQty(i.variantId, -1)} className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center hover:bg-stone-100">
                              {i.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3" />}
                            </button>
                            <span className="w-6 text-center font-bold">{i.quantity}</span>
                            <button type="button" onClick={() => changeQty(i.variantId, 1)} className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center hover:bg-stone-100">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Notas (opcional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isCustomerForm ? 'Ej. Entregar el sábado en el bazar' : 'Ej. Urgente para evento del fin de semana'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
                <span className="text-xs text-stone-600">
                  {cartPieces} pzas · <strong className="text-stone-900">${cartTotal.toLocaleString()} MXN</strong>
                </span>
                <div className="flex items-center space-x-2">
                  <button type="button" onClick={closeForm} className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800">
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={cart.length === 0}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-lg text-xs"
                  >
                    {isCustomerForm ? 'Registrar y apartar stock' : 'Solicitar resurtido'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deliver customer order modal */}
      {deliverOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
            <div className="px-5 py-4 bg-stone-900 text-stone-100">
              <h3 className="font-bold text-sm">Entregar {deliverOrder.folio}</h3>
              <p className="text-[11px] text-stone-400">
                {deliverOrder.customer_name} · ${deliverOrder.total_amount.toLocaleString()} MXN
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Método de pago</label>
                <div className="grid grid-cols-3 gap-2">
                  {([['cash', 'Efectivo'], ['card', 'Tarjeta'], ['transfer', 'SPEI']] as const).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id)}
                      className={`py-2 rounded-lg text-xs font-semibold border ${
                        paymentMethod === id
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-stone-500">
                Se registrará como venta de CDMX y las piezas saldrán del stock apartado.
              </p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setDeliverOrder(null)} className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800">
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    run(deliverCustomerOrder(deliverOrder.order_id, paymentMethod));
                    setDeliverOrder(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                >
                  Confirmar entrega y cobro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
