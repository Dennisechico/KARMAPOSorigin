import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Gauge, 
  Hammer, 
  Layers, 
  MapPin, 
  Pause, 
  Play, 
  Plus, 
  Send, 
  Sparkles, 
  Timer, 
  Truck, 
  Wrench,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LocationId, ProductionOrder } from '../../types';

export const ProductionBoard: React.FC = () => {
  const { 
    products, 
    productionOrders, 
    activeTimerOrderId, 
    startAssemblyTimer, 
    stopAssemblyTimer, 
    createProductionOrder, 
    completeProductionOrder, 
    currentUser 
  } = useApp();

  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [orderQuantity, setOrderQuantity] = useState<number>(6);
  const [maxAllowedHours, setMaxAllowedHours] = useState<number>(36);
  const [channelWeight, setChannelWeight] = useState<number>(1.2);
  const [targetDestination, setTargetDestination] = useState<LocationId>('AGS');

  // Inspection modal for Unit Prime Cost formula breakdown
  const [inspectingOrderId, setInspectingOrderId] = useState<string | null>(null);

  // Flatten variants with parent product info
  const allVariants = products.flatMap(p => 
    p.variants.map(v => ({
      ...v,
      parentProduct: p,
    }))
  );

  const activeTimerOrder = productionOrders.find(o => o.order_id === activeTimerOrderId);

  // Sort orders: Urgency >= 1.0 first, then by urgency_index descending
  const sortedOrders = [...productionOrders].sort((a, b) => {
    if (a.is_urgent && !b.is_urgent) return -1;
    if (!a.is_urgent && b.is_urgent) return 1;
    return b.urgency_index - a.urgency_index;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) {
      alert('Selecciona una joya o variante');
      return;
    }
    createProductionOrder({
      variantId: selectedVariantId,
      quantity: orderQuantity,
      maxAllowedHours,
      channelWeight,
      targetDestination,
    });
    setShowNewOrderModal(false);
  };

  const getVariantDetails = (variantId: string) => {
    return allVariants.find(v => v.variant_id === variantId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Urgency Algorithm Explanation */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-stone-900">
                Tablero de Ensamblaje Artesanal y Taller de Joyería
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Módulo Teffy
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Priorización dinámica por algoritmo matemático de urgencias, cronómetro exacto de mano de obra y despachos diferenciados.
            </p>
          </div>

          <button
            onClick={() => setShowNewOrderModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-colors self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Programar Nuevo Lote de Producción</span>
          </button>
        </div>

        {/* Dynamic Formula Display Box */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
          
          {/* Formula 1: Urgency */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <Flame className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-stone-900">Algoritmo Dinámico de Urgencia (U)</p>
              <div className="my-1 font-mono text-xs bg-white px-2.5 py-1 rounded border border-stone-200 text-amber-900 inline-block">
                U = ( T<sub>e</sub> / T<sub>m</sub> ) &times; P<sub>c</sub>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Donde <strong>T<sub>e</sub></strong> es tiempo transcurrido, <strong>T<sub>m</sub></strong> tiempo máximo tolerado y <strong>P<sub>c</sub></strong> factor por canal (1.5 e-commerce Shopify / 1.0 físico). Si <strong>U &ge; 1.0</strong>, se marca como <em>Despacho Urgente</em>.
              </p>
            </div>
          </div>

          {/* Formula 2: Prime Cost per Unit */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-stone-900">Costo Primo Unitario de Manufactura</p>
              <div className="my-1 font-mono text-xs bg-white px-2.5 py-1 rounded border border-stone-200 text-emerald-900 inline-block">
                C<sub>unidad</sub> = &sum;(Q<sub>mat</sub> &times; P<sub>mat</sub>) + (T<sub>min</sub> &times; R<sub>min</sub>)
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Integra la lista de materiales (BOM: cuarzos, perlas, chapa de oro) con la tarifa directa del tiempo manual artesanal ($2.50 MXN/minuto).
              </p>
            </div>
          </div>

        </div>

        {/* Live Active Timer Bar */}
        {activeTimerOrder && (
          <div className="mt-4 bg-emerald-900 text-white rounded-xl p-3.5 flex items-center justify-between shadow-md animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-800 rounded-lg">
                <Timer className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-100">
                  Cronómetro Activo &bull; Ensamblando: {activeTimerOrder.product_name}
                </p>
                <p className="text-[11px] text-emerald-200">
                  Artesana: {activeTimerOrder.artisan_name} &bull; Minutos trabajados: <strong>{activeTimerOrder.actual_assembly_minutes} min</strong> &bull; Urgencia actual U = {activeTimerOrder.urgency_index}
                </p>
              </div>
            </div>
            <button
              onClick={stopAssemblyTimer}
              className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-white text-emerald-950 font-bold text-xs flex items-center space-x-1 transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pausar Cronómetro</span>
            </button>
          </div>
        )}
      </div>

      {/* Production Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedOrders.map(order => {
          const variant = getVariantDetails(order.variant_id);
          const isCurrentlyTiming = activeTimerOrderId === order.order_id;
          
          // Calculate unit prime cost for this piece
          const bomCost = variant ? variant.bom_items.reduce((sum, b) => sum + (b.quantity * b.unit_cost), 0) : 0;
          const laborCost = order.actual_assembly_minutes * (variant?.labor_minute_rate || 2.5);
          const unitPrimeCost = bomCost + laborCost;
          const retailPrice = variant?.unit_price || 0;
          const grossProfit = retailPrice - unitPrimeCost;
          const marginPercent = retailPrice > 0 ? Math.round((grossProfit / retailPrice) * 100) : 0;

          return (
            <div
              key={order.order_id}
              className={`bg-white rounded-xl border p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md ${
                order.is_urgent
                  ? 'border-red-400 ring-2 ring-red-400/20 bg-gradient-to-b from-red-50/20 to-white'
                  : 'border-stone-200'
              }`}
            >
              <div>
                {/* Header: Urgency Badge & Status */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center space-x-1.5">
                    {order.is_urgent ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-bounce">
                        <Flame className="w-3 h-3 mr-1" />
                        URGENTE (U={order.urgency_index})
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                        Normal (U={order.urgency_index})
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">
                    {order.order_id}
                  </span>
                </div>

                {/* Product & Variant */}
                <div className="py-3">
                  <h3 className="font-bold text-stone-900 text-sm leading-snug">
                    {order.product_name}
                  </h3>
                  <p className="text-xs font-semibold text-stone-600 mt-0.5">
                    {order.variant_title}
                  </p>
                  
                  {/* Attributes */}
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                      Lote: <strong>{order.quantity} pzas</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200">
                      Destino: <strong>{order.targetDestination === 'AGS' ? 'Aguascalientes' : 'CDMX'}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      Canal P<sub>c</sub>: {order.channel_weight}
                    </span>
                  </div>
                </div>

                {/* Algorithmic variables bar */}
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5 my-2">
                  <div className="flex justify-between text-stone-600">
                    <span>Tiempo transcurrido (T<sub>e</sub>):</span>
                    <span className="font-bold text-stone-800">{order.elapsed_hours} hrs</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Tiempo máximo límite (T<sub>m</sub>):</span>
                    <span className="font-medium text-stone-800">{order.max_allowed_hours} hrs</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Tiempo manual artesano (T<sub>min</sub>):</span>
                    <span className="font-bold text-emerald-700">{order.actual_assembly_minutes} minutos</span>
                  </div>
                  
                  {/* Formula value breakdown */}
                  <div className="pt-1 border-t border-stone-200 flex justify-between font-bold text-[11px]">
                    <span className="text-stone-700">Índice Urgencia:</span>
                    <span className={order.is_urgent ? 'text-red-600 font-black' : 'text-stone-800'}>
                      ({order.elapsed_hours} / {order.max_allowed_hours}) &times; {order.channelWeight} = {order.urgency_index}
                    </span>
                  </div>
                </div>

                {/* BOM and Labor Cost Quick Summary */}
                <div className="py-2 border-b border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500 text-[10px] block">Costo Primo (BOM + Mano de obra):</span>
                    <span className="font-bold text-stone-900">${unitPrimeCost.toFixed(2)} MXN / pza</span>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 text-[10px] block">Margen Real:</span>
                    <span className="font-bold text-emerald-700">{marginPercent}% (${grossProfit.toFixed(2)})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Timer + Dispatch */}
              <div className="pt-3 space-y-2">
                {order.status !== 'dispatched_ags' && order.status !== 'in_transit_cdmx' ? (
                  <>
                    {/* Stopwatch button */}
                    <button
                      onClick={() => isCurrentlyTiming ? stopAssemblyTimer() : startAssemblyTimer(order.order_id)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                        isCurrentlyTiming
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-stone-800 text-stone-100 hover:bg-stone-900'
                      }`}
                    >
                      {isCurrentlyTiming ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pausar Cronómetro</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Iniciar Cronómetro de Ensamble</span>
                        </>
                      )}
                    </button>

                    {/* Dispatch options based on rule in prompt:
                        If destination is Aguascalientes -> available immediately + update shopify.
                        If destination is CDMX -> enters "Inventario en Tránsito" + Shopify transfer API.
                    */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => completeProductionOrder(order.order_id, 'AGS')}
                        className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-semibold flex items-center justify-center space-x-1 transition-colors"
                        title="Incrementa stock local en Aguascalientes y actualiza Shopify"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Terminar &bull; AGS</span>
                      </button>

                      <button
                        onClick={() => completeProductionOrder(order.order_id, 'CDMX')}
                        className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 text-[11px] font-semibold flex items-center justify-center space-x-1 transition-colors"
                        title="Envía a CDMX bajo estado 'En Tránsito' vía Shopify Transfer API"
                      >
                        <Truck className="w-3 h-3 text-blue-600" />
                        <span>Despachar &bull; CDMX</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-600 text-xs font-medium text-center">
                    {order.status === 'dispatched_ags'
                      ? '✔ Finalizado &bull; Disponible en Aguascalientes'
                      : '🚚 En Tránsito hacia CDMX (Pendiente recepción)'}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Program New Production Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center space-x-2">
              <Hammer className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-base text-stone-900">
                Programar Lote de Fabricación Artesanal
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Registra una nueva orden en el taller para Teffy con atributos de piedras, metal y ponderación por canal.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Accesorio / Variante a Confeccionar *
                </label>
                <select
                  required
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50"
                >
                  <option value="">-- Seleccionar pieza del catálogo --</option>
                  {allVariants.map(v => (
                    <option key={v.variant_id} value={v.variant_id}>
                      {v.parentProduct.name} - {v.title} ({v.stone_charm})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Cantidad a Elaborar (pzas) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Destino Logístico *
                  </label>
                  <select
                    value={targetDestination}
                    onChange={(e) => setTargetDestination(e.target.value as LocationId)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50 font-semibold"
                  >
                    <option value="AGS">Aguascalientes (Disponibilidad Inmediata)</option>
                    <option value="CDMX">CDMX Showroom (En Tránsito)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Tiempo Máximo Tolerado (T<sub>m</sub> en horas) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={maxAllowedHours}
                    onChange={(e) => setMaxAllowedHours(parseFloat(e.target.value) || 24)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Ponderación Canal (P<sub>c</sub>) *
                  </label>
                  <select
                    value={channelWeight}
                    onChange={(e) => setChannelWeight(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50 font-semibold"
                  >
                    <option value={1.5}>1.5 - Shopify E-commerce (Envío Inmediato)</option>
                    <option value={1.2}>1.2 - Evento Pop-up CDMX</option>
                    <option value={1.0}>1.0 - Stock General Tienda Físico</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Crear y Encolar en Taller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
