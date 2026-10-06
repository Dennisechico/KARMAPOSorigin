import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  Plus, 
  Send, 
  ShieldAlert, 
  Truck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LocationId } from '../../types';

export const InterLocationTransfers: React.FC = () => {
  const { 
    transfers, 
    products, 
    currentUser, 
    createTransfer, 
    confirmTransferReception, 
    currentLocation 
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [transferQuantity, setTransferQuantity] = useState<number>(3);
  const [originLocation, setOriginLocation] = useState<LocationId>('AGS');
  const [destinationLocation, setDestinationLocation] = useState<LocationId>('CDMX');

  const allVariants = products.flatMap(p => 
    p.variants.map(v => ({
      ...v,
      parentProduct: p,
    }))
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) {
      alert('Selecciona una pieza de joyería');
      return;
    }
    if (originLocation === destinationLocation) {
      alert('El origen y el destino deben ser sedes distintas');
      return;
    }

    const res = createTransfer({
      variantId: selectedVariantId,
      quantity: transferQuantity,
      origin: originLocation,
      destination: destinationLocation,
    });

    if (res.success) {
      setShowCreateModal(false);
    } else {
      alert(res.error || 'Error creando transferencia');
    }
  };

  const inTransitCount = transfers.filter(t => t.status === 'in_transit').length;
  const inTransitPieces = transfers
    .filter(t => t.status === 'in_transit')
    .reduce((sum, t) => sum + t.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Logistics Policy */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-stone-900">
                Logística y Transferencias Inter-Sedes (AGS &harr; CDMX)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-300">
                API Transferencias Shopify
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Control de inventario en tránsito. La mercancía enviada a CDMX no es vendible hasta que el personal en destino confirme la recepción física.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs shadow-sm transition-colors self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Despachar Nueva Transferencia</span>
          </button>
        </div>

        {/* Status Callout */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center space-x-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-500">En Tránsito Activo</p>
              <p className="text-base font-bold text-stone-900">{inTransitCount} envíos ({inTransitPieces} pzas)</p>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-500">Recibidos &amp; Liberados</p>
              <p className="text-base font-bold text-stone-900">
                {transfers.filter(t => t.status === 'received').length} envíos
              </p>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center space-x-3 sm:col-span-2 md:col-span-1">
            <div className="p-2 bg-sky-100 text-sky-800 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-500">Tu Sede Actual</p>
              <p className="text-sm font-bold text-sky-900">
                {currentLocation === 'AGS' ? 'Aguascalientes (Matriz)' : 'CDMX (Showroom Roma)'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transfers List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-stone-900">Historial de Guías y Despachos Inter-Ubicaciones</h2>
          <span className="text-xs text-stone-400">Total: {transfers.length} registros</span>
        </div>

        <div className="divide-y divide-stone-100 overflow-x-auto">
          {transfers.map(trf => {
            const isInTransit = trf.status === 'in_transit';
            return (
              <div
                key={trf.transfer_id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-stone-50/70 transition-colors"
              >
                {/* Info block */}
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-1 ${
                    isInTransit ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isInTransit ? <Truck className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-stone-900">{trf.folio}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isInTransit ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isInTransit ? 'EN TRÁNSITO' : 'RECIBIDO EN DESTINO'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 mt-1">
                      {trf.quantity}x {trf.product_name}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium">
                      Variante: {trf.variant_title}
                    </p>

                    {/* Route line */}
                    <div className="mt-2 flex items-center space-x-2 text-xs font-semibold text-stone-700">
                      <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-800">
                        {trf.origin_location === 'AGS' ? 'Aguascalientes' : 'CDMX'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      <span className="px-2 py-0.5 bg-sky-50 text-sky-800 rounded border border-sky-200">
                        {trf.destination_location === 'CDMX' ? 'CDMX Showroom' : 'Aguascalientes'}
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-stone-400 space-y-0.5">
                      <p>Despachado por: <strong>{trf.dispatched_by}</strong> el {trf.dispatched_at}</p>
                      {trf.received_at && (
                        <p className="text-emerald-700 font-medium">
                          Confirmado por: <strong>{trf.received_by}</strong> el {trf.received_at}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action: Reception confirmation button */}
                <div className="shrink-0 flex items-center space-x-2 self-end md:self-auto">
                  {isInTransit ? (
                    <button
                      onClick={() => confirmTransferReception(trf.transfer_id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmar Recepción Física en {trf.destination_location}</span>
                    </button>
                  ) : (
                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                      ✔ Stock Vendible Disponible
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {transfers.length === 0 && (
          <div className="p-12 text-center text-stone-400 text-xs">
            No hay registros de transferencias logísticas.
          </div>
        )}
      </div>

      {/* Create Transfer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div>
              <h3 className="font-bold text-base text-stone-900">Despachar Transferencia de Joyería</h3>
              <p className="text-xs text-stone-500">
                Envía lotes entre Aguascalientes y Ciudad de México con seguimiento en tránsito y Shopify Transfer API.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Pieza / Variante *
                </label>
                <select
                  required
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50"
                >
                  <option value="">-- Seleccionar pieza --</option>
                  {allVariants.map(v => (
                    <option key={v.variant_id} value={v.variant_id}>
                      {v.parentProduct.name} - {v.title} (Disp. AGS: {v.stock_ags} | CDMX: {v.stock_cdmx})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Cantidad a Transferir *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Sede Origen *
                  </label>
                  <select
                    value={originLocation}
                    onChange={(e) => setOriginLocation(e.target.value as LocationId)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50"
                  >
                    <option value="AGS">Aguascalientes (Matriz)</option>
                    <option value="CDMX">CDMX Showroom</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Sede Destino *
                  </label>
                  <select
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value as LocationId)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50 font-semibold"
                  >
                    <option value="CDMX">CDMX Showroom</option>
                    <option value="AGS">Aguascalientes (Matriz)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Registrar Guía y Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
