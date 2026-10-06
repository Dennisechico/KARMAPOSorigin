import React, { useState } from 'react';
import { Plus, Box, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LocationId } from '../../types';

interface QuickStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: {
    variant_id: string;
    product_name: string;
    title: string;
    sku: string;
    stock_ags: number;
    stock_cdmx: number;
  } | null;
}

export const QuickStockModal: React.FC<QuickStockModalProps> = ({ isOpen, onClose, variant }) => {
  const { addStockToVariant } = useApp();
  const [location, setLocation] = useState<LocationId>('AGS');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !variant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      setErrorMsg('La cantidad debe ser mayor a 0');
      return;
    }

    const res = addStockToVariant(variant.variant_id, location, quantity, notes);
    if (res.success) {
      setQuantity(1);
      setNotes('');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg(res.error || 'Error al actualizar existencias.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        <div className="px-5 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-100">Añadir Stock Rápido</h3>
              <p className="text-[11px] text-stone-400">Incrementa unidades de esta variante</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <p className="font-bold text-sm text-stone-800">{variant.product_name}</p>
            <div className="flex items-center space-x-3 text-xs text-stone-500 mt-1">
              <span>SKU: <strong className="font-mono text-stone-700">{variant.sku}</strong></span>
              <span>•</span>
              <span>Variante: <strong>{variant.title}</strong></span>
            </div>
            <div className="flex items-center space-x-4 mt-2 pt-2 border-t border-stone-200 text-xs">
              <span>Stock AGS actual: <strong className="text-stone-900">{variant.stock_ags}</strong></span>
              <span>Stock CDMX actual: <strong className="text-stone-900">{variant.stock_cdmx}</strong></span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Destino de la Entrada</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocation('AGS')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  location === 'AGS'
                    ? 'bg-amber-500 text-white border-amber-500 font-bold'
                    : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                Aguascalientes (AGS)
              </button>
              <button
                type="button"
                onClick={() => setLocation('CDMX')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  location === 'CDMX'
                    ? 'bg-amber-500 text-white border-amber-500 font-bold'
                    : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                Ciudad de México (CDMX)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Cantidad a ingresar</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Notas / Motivo (Opcional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Terminado de ensamble en taller, lote nuevo..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Confirmar Ingreso (+{quantity})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
