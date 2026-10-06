import React, { useState } from 'react';
import { 
  PlusCircle, 
  Package, 
  Tag, 
  Layers, 
  Sparkles, 
  X, 
  DollarSign, 
  Box, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NewProductFormData, ProductGender } from '../../types';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_MATERIALS = [
  'Acero Inoxidable',
  'Chapa de Oro',
  'Plata .925',
  'Chaquira',
  'Miyuki',
  'Ágata',
  'Amazonita',
  'Aventurina',
  'Calcedonia',
  'Jaspe',
  'Cristal',
  'Hilo',
  'Madera',
  'Cuero',
  'Cordón',
  'Ónix',
  'Piedra Volcánica',
  'Ojo de Tigre',
  'Ojo de Halcón',
  'Turquesina',
  'Jade',
  'Hematita',
  'Lapislázuli',
  'Obsidiana',
  'Perla de Río'
];

const POPULAR_COLORS = [
  'Negro',
  'Dorado',
  'Plateado',
  'Rojo',
  'Azul',
  'Verde',
  'Café',
  'Rosa',
  'Blanco',
  'Morado',
  'Multicolor',
  'Gris'
];

const CATEGORIES = [
  'Pulseras',
  'Collares',
  'Aretes',
  'Arracadas',
  'Anillos',
  'Escapularios',
  'Dijes',
  'Tobilleras',
  'Llaveros',
  'Accesorios'
];

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ isOpen, onClose }) => {
  const { addNewProduct } = useApp();

  const [formData, setFormData] = useState<NewProductFormData>({
    sku: '',
    name: '',
    category: 'Pulseras',
    gender: 'Unisex',
    material: 'Acero Inoxidable',
    color: 'Dorado',
    price: 0,
    stockAgs: 0,
    stockCdmx: 0,
    unitCost: 0,
    description: '',
  });

  const [customMaterial, setCustomMaterial] = useState('');
  const [useCustomMaterial, setUseCustomMaterial] = useState(false);
  const [customColor, setCustomColor] = useState('');
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.sku.trim()) {
      setErrorMsg('Por favor ingresa el código SKU (ej. PH42, CM15, A20).');
      return;
    }
    if (!formData.name.trim()) {
      setErrorMsg('Por favor ingresa el nombre del producto.');
      return;
    }
    if (formData.price <= 0) {
      setErrorMsg('El precio de venta debe ser mayor a $0.');
      return;
    }

    const finalMaterial = useCustomMaterial ? customMaterial.trim() : formData.material;
    const finalColor = useCustomColor ? customColor.trim() : formData.color;

    if (!finalMaterial) {
      setErrorMsg('Por favor especifica el material o piedra.');
      return;
    }
    if (!finalColor) {
      setErrorMsg('Por favor especifica el color.');
      return;
    }

    setIsSubmitting(true);
    const result = addNewProduct({
      ...formData,
      material: finalMaterial,
      color: finalColor,
    });
    setIsSubmitting(false);

    if (result.success) {
      // Reset form
      setFormData({
        sku: '',
        name: '',
        category: 'Pulseras',
        gender: 'Unisex',
        material: 'Acero Inoxidable',
        color: 'Dorado',
        price: 0,
        stockAgs: 0,
        stockCdmx: 0,
        unitCost: 0,
        description: '',
      });
      setCustomMaterial('');
      setCustomColor('');
      setUseCustomMaterial(false);
      setUseCustomColor(false);
      onClose();
    } else {
      setErrorMsg(result.error || 'Error al agregar producto.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-100">Añadir Nuevo Producto al Inventario</h3>
              <p className="text-xs text-stone-400">Registra productos con SKU, variantes, materiales, género y stock inicial</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Row 1: SKU & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                SKU / Código <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="Ej. PH45, CM12"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono text-sm focus:bg-white focus:outline-none focus:border-amber-500 uppercase"
                required
              />
              <span className="text-[10px] text-stone-600 mt-0.5 block">Identificador único de variante</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Nombre de la Joya / Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Pulsera San Benito piedra mate con calaveras"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Row 2: Category & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Línea / Género</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Hombre', 'Mujer', 'Unisex', 'Otro'] as ProductGender[]).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      formData.gender === g
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Material / Piedra & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">Material / Piedra</label>
                <button
                  type="button"
                  onClick={() => setUseCustomMaterial(!useCustomMaterial)}
                  className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold"
                >
                  {useCustomMaterial ? 'Elegir de lista' : '+ Otro material'}
                </button>
              </div>
              {useCustomMaterial ? (
                <input
                  type="text"
                  value={customMaterial}
                  onChange={(e) => setCustomMaterial(e.target.value)}
                  placeholder="Ej. Ojo de Tigre, Rodocrosita..."
                  className="w-full px-3 py-2 bg-white border border-amber-400 rounded-lg text-stone-900 text-sm focus:outline-none"
                  autoFocus
                />
              ) : (
                <select
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-amber-500"
                >
                  {POPULAR_MATERIALS.map(mat => (
                    <option key={mat} value={mat}>{mat}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">Color / Acabado</label>
                <button
                  type="button"
                  onClick={() => setUseCustomColor(!useCustomColor)}
                  className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold"
                >
                  {useCustomColor ? 'Elegir de lista' : '+ Otro color'}
                </button>
              </div>
              {useCustomColor ? (
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="Ej. Tornasol, Oro Rosa..."
                  className="w-full px-3 py-2 bg-white border border-amber-400 rounded-lg text-stone-900 text-sm focus:outline-none"
                  autoFocus
                />
              ) : (
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm focus:bg-white focus:outline-none focus:border-amber-500"
                >
                  {POPULAR_COLORS.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Row 4: Pricing & Costs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200/60">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Precio de Venta ($ MXN) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formData.price || ''}
                  onChange={(e) => {
                    const price = parseFloat(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      price,
                      unitCost: +(price * 0.35).toFixed(2), // auto-suggest 35% BOM cost
                    });
                  }}
                  placeholder="Ej. 180"
                  className="w-full pl-7 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-900 font-bold text-base focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Costo Estimado Materiales / BOM ($ MXN)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.unitCost || ''}
                  onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                  placeholder="Se calcula al 35% del precio"
                  className="w-full pl-7 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-800 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-stone-600 mt-0.5 block">
                Margen bruto proyectado: {formData.price > 0 ? (((formData.price - (formData.unitCost || 0)) / formData.price) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>

          {/* Row 5: Initial Stock Distribution */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Stock Inicial Aguascalientes (AGS)
              </label>
              <input
                type="number"
                min="0"
                value={formData.stockAgs || ''}
                placeholder="0"
                onChange={(e) => setFormData({ ...formData, stockAgs: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm font-semibold focus:bg-white focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-stone-600 mt-0.5 block">Showroom principal y taller</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Stock Inicial Ciudad de México (CDMX)
              </label>
              <input
                type="number"
                min="0"
                value={formData.stockCdmx || ''}
                placeholder="0"
                onChange={(e) => setFormData({ ...formData, stockCdmx: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-sm font-semibold focus:bg-white focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-stone-600 mt-0.5 block">Boutique Roma / Eventos</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-800 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar y Publicar en Inventario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
