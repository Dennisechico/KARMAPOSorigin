import React, { useState } from 'react';
import { Search, X, Box, Plus } from 'lucide-react';

export interface StockPickerVariant {
  variant_id: string;
  product_name: string;
  title: string;
  sku: string;
  category: string;
  stock_ags: number;
  stock_cdmx: number;
}

interface StockPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  variants: StockPickerVariant[];
  onSelect: (variant: StockPickerVariant) => void;
}

const MAX_RESULTS = 40;

// Paso 1 de "Añadir Stock": buscar el producto existente por nombre o SKU
export const StockPickerModal: React.FC<StockPickerModalProps> = ({ isOpen, onClose, variants, onSelect }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const matches = variants.filter(v =>
    !q ||
    v.product_name.toLowerCase().includes(q) ||
    v.sku.toLowerCase().includes(q) ||
    v.title.toLowerCase().includes(q)
  );
  const visible = matches.slice(0, MAX_RESULTS);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[85vh]">
        <div className="px-5 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-100">Añadir Stock a un Producto Existente</h3>
              <p className="text-[11px] text-stone-400">Busca el producto y luego elige AGS o CDMX</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 border-b border-stone-200">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o SKU (ej. PH12, tila, ojo turco)..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1.5">
            {matches.length} producto{matches.length === 1 ? '' : 's'}
            {matches.length > MAX_RESULTS ? ` · mostrando los primeros ${MAX_RESULTS}, escribe para afinar` : ''}
          </p>
        </div>

        <div className="overflow-y-auto divide-y divide-stone-100">
          {visible.length === 0 && (
            <p className="p-6 text-center text-xs text-stone-500">
              No hay productos con ese nombre o SKU. Si es nuevo, usa “Nuevo Producto”.
            </p>
          )}
          {visible.map(v => (
            <button
              key={v.variant_id}
              type="button"
              onClick={() => {
                setQuery('');
                onSelect(v);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-amber-50 transition-colors flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-bold text-sm text-stone-900 truncate">{v.product_name}</p>
                <p className="text-[11px] text-stone-500 truncate">
                  <span className="font-mono text-stone-700">{v.sku}</span> · {v.category} · {v.title}
                </p>
              </div>
              <div className="flex items-center space-x-2 shrink-0 text-[11px] text-stone-600">
                <span>AGS <strong className="text-stone-900">{v.stock_ags}</strong></span>
                <span>CDMX <strong className="text-stone-900">{v.stock_cdmx}</strong></span>
                <Plus className="w-4 h-4 text-amber-600" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
