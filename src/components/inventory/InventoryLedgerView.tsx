import React, { useState } from 'react';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Database, 
  FileSpreadsheet, 
  Filter, 
  History, 
  Layers, 
  Plus,
  PlusCircle,
  RefreshCw, 
  Search, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InventoryMovementReason } from '../../types';
import { AddInventoryModal } from './AddInventoryModal';
import { QuickStockModal } from './QuickStockModal';
import { StockPickerModal } from './StockPickerModal';

export const InventoryLedgerView: React.FC = () => {
  const { products, ledger, triggerManualShopifySync, currentUser } = useApp();
  
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'ledger'>('matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReason, setFilterReason] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStockPickerOpen, setIsStockPickerOpen] = useState(false);
  const [quickStockVariant, setQuickStockVariant] = useState<any | null>(null);

  // Flatten variants for stock matrix
  const allVariants = products.flatMap(p => 
    p.variants.map(v => ({
      ...v,
      product_name: p.name,
      category: p.category,
      gender: v.gender || p.gender || 'Unisex',
      material: v.material || p.material || v.stone_charm,
      color: p.color || v.color_alloy,
    }))
  );

  // Extract unique categories, genders, materials
  const categoriesList = Array.from(new Set(allVariants.map(v => v.category))).filter(Boolean);
  const gendersList = ['Hombre', 'Mujer', 'Unisex', 'Otro'];
  const materialsList = Array.from(new Set(allVariants.map(v => v.material))).filter(Boolean).sort();

  const filteredVariants = allVariants.filter(v => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = (
      v.product_name.toLowerCase().includes(q) ||
      v.title.toLowerCase().includes(q) ||
      v.sku.toLowerCase().includes(q) ||
      v.color_alloy.toLowerCase().includes(q) ||
      v.stone_charm.toLowerCase().includes(q) ||
      (v.material && v.material.toLowerCase().includes(q))
    );
    const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesGender = selectedGender === 'all' || v.gender === selectedGender;
    const matchesMat = selectedMaterial === 'all' || v.material === selectedMaterial;

    return matchesQuery && matchesCat && matchesGender && matchesMat;
  });

  const filteredLedger = ledger.filter(entry => {
    const matchesReason = filterReason === 'all' || entry.movement_reason === filterReason;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      entry.variant_name.toLowerCase().includes(q) ||
      (entry.reference_id && entry.reference_id.toLowerCase().includes(q)) ||
      (entry.notes && entry.notes.toLowerCase().includes(q));
    return matchesReason && matchesSearch;
  });

  // Calculate global summary counts
  const totalUnitsAgs = allVariants.reduce((sum, v) => sum + v.stock_ags, 0);
  const totalUnitsCdmx = allVariants.reduce((sum, v) => sum + v.stock_cdmx, 0);
  const totalInTransit = allVariants.reduce((sum, v) => sum + v.stock_in_transit_cdmx, 0);
  const totalReserved = allVariants.reduce((sum, v) => sum + v.stock_layaway_reserved, 0);
  const totalShopifySynced = allVariants.reduce((sum, v) => sum + v.stock_shopify_synced, 0);

  const getReasonBadge = (reason: InventoryMovementReason) => {
    switch (reason) {
      case 'production':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Producción Taller</span>;
      case 'sale':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Venta Mostrador</span>;
      case 'layaway_hold':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Reserva Apartado</span>;
      case 'layaway_delivered':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Entrega Apartado</span>;
      case 'layaway_cancelled_release':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-700">Cancelación Apartado</span>;
      case 'transfer_out':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">Transferencia Salida</span>;
      case 'transfer_in':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">Transferencia Entrada</span>;
      case 'shopify_sync':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">Shopify Webhook</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">{reason}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Global Multi-Location Matrix Summary */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-stone-900">
                Inventario Maestro y Libro Mayor (ACID Ledger)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-300">
                Auditoría Global
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Registro contable inmutable de cada movimiento de stock entre Aguascalientes, CDMX, Apartados y Shopify.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {currentUser.role !== 'Karma' && (
              <>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
                <button
                  onClick={() => setIsStockPickerOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-amber-500 font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Stock</span>
                </button>
              </>
            )}

            <button
              onClick={triggerManualShopifySync}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sincronizar con Shopify API</span>
            </button>
          </div>
        </div>

        {/* Metric Cards across locations */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Aguascalientes (Disp.)</span>
            <span className="text-lg font-bold text-stone-900">{totalUnitsAgs} pzas</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Showroom &bull; Matriz</span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">CDMX (Disp.)</span>
            <span className="text-lg font-bold text-stone-900">{totalUnitsCdmx} pzas</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Showroom Roma Norte</span>
          </div>

          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">En Tránsito CDMX</span>
            <span className="text-lg font-bold text-amber-900">{totalInTransit} pzas</span>
            <span className="text-[10px] text-amber-700 block mt-0.5">Pendiente recepción física</span>
          </div>

          <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200">
            <span className="text-[10px] uppercase font-bold text-purple-800 block">Reservado por Apartado</span>
            <span className="text-lg font-bold text-purple-900">{totalReserved} pzas</span>
            <span className="text-[10px] text-purple-700 block mt-0.5">Bloqueado para entrega</span>
          </div>

          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Vendible Shopify</span>
            <span className="text-lg font-bold text-emerald-900">{totalShopifySynced} pzas</span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">Tienda en línea</span>
          </div>
        </div>
      </div>

      {/* Sub tabs: Matriz de Stock vs Libro Mayor Ledger */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex space-x-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'matrix'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Matriz de Stock por Ubicación
          </button>
          <button
            onClick={() => setActiveSubTab('ledger')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'ledger'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Libro Mayor Contable (Ledger Audit)
          </button>
        </div>

        {/* Search & Global Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar SKU, piedra, pieza..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium text-stone-700"
          >
            <option value="all">Todas las Categorías ({categoriesList.length})</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium text-stone-700"
          >
            <option value="all">Género: Todos</option>
            {gendersList.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium text-stone-700 max-w-[170px] truncate"
          >
            <option value="all">Material/Piedra: Todas</option>
            {materialsList.map(mat => (
              <option key={mat} value={mat}>{mat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: STOCK MATRIX */}
      {activeSubTab === 'matrix' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] font-bold border-b border-stone-200 tracking-wider">
                <tr>
                  <th className="py-3 px-4">SKU / Joya</th>
                  {currentUser.role !== 'Karma' && (
                    <th className="py-3 px-3 text-center font-bold">Añadir</th>
                  )}
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Público / Género</th>
                  <th className="py-3 px-3">Material / Piedra</th>
                  <th className="py-3 px-3 text-right">Precio</th>
                  <th className="py-3 px-3 text-center bg-stone-100/60 font-bold">AGS (Matriz)</th>
                  <th className="py-3 px-3 text-center bg-stone-100/60 font-bold">CDMX (Disp.)</th>
                  <th className="py-3 px-3 text-center text-amber-800">En Tránsito CDMX</th>
                  <th className="py-3 px-3 text-center text-purple-800">Reservado Apartado</th>
                  <th className="py-3 px-3 text-center text-emerald-800 font-bold">Shopify Online</th>
                  <th className="py-3 px-4 text-right font-bold">Total Físico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredVariants.map(v => {
                  const totalPhysical = v.stock_ags + v.stock_cdmx + v.stock_in_transit_cdmx + v.stock_layaway_reserved;
                  return (
                    <tr key={v.variant_id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{v.product_name}</div>
                        <div className="text-[11px] text-stone-600">{v.title}</div>
                        <div className="font-mono text-[10px] text-stone-400">{v.sku}</div>
                      </td>
                      {currentUser.role !== 'Karma' && (
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => setQuickStockVariant(v)}
                            title="Añadir más stock a esta joya"
                            className="inline-flex items-center space-x-1 px-2 py-1 rounded-md bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 text-[11px] font-semibold transition-colors border border-stone-200"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Stock</span>
                          </button>
                        </td>
                      )}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                          {v.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.gender === 'Hombre'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : v.gender === 'Mujer'
                            ? 'bg-pink-100 text-pink-800 border border-pink-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}>
                          {v.gender}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-stone-800">
                        {v.material}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-stone-900">
                        ${v.unit_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-stone-800 bg-stone-50/50">
                        {v.stock_ags}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-stone-800 bg-stone-50/50">
                        {v.stock_cdmx}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-amber-700">
                        {v.stock_in_transit_cdmx > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                            {v.stock_in_transit_cdmx}
                          </span>
                        ) : '0'}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-purple-700">
                        {v.stock_layaway_reserved > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                            {v.stock_layaway_reserved}
                          </span>
                        ) : '0'}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-700">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {v.stock_shopify_synced}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-stone-900">
                        {totalPhysical}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LEDGER (ACID Transactions) */}
      {activeSubTab === 'ledger' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 text-xs">
              <Filter className="w-4 h-4 text-stone-400" />
              <span className="font-bold text-stone-700">Filtrar por Motivo:</span>
              <select
                value={filterReason}
                onChange={(e) => setFilterReason(e.target.value)}
                className="py-1 px-2 border border-stone-300 rounded-md text-xs bg-stone-50"
              >
                <option value="all">Todos los Movimientos</option>
                <option value="production">Producción Taller</option>
                <option value="sale">Venta Mostrador</option>
                <option value="layaway_hold">Reserva Apartado</option>
                <option value="layaway_delivered">Entrega Apartado</option>
                <option value="transfer_out">Transferencia Salida</option>
                <option value="transfer_in">Transferencia Entrada</option>
                <option value="shopify_sync">Shopify Sync / Webhook</option>
              </select>
            </div>
            <span className="text-xs text-stone-400">
              {filteredLedger.length} transacciones registradas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] font-bold border-b border-stone-200 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Fecha / ID</th>
                  <th className="py-3 px-3">Variante Afectada</th>
                  <th className="py-3 px-3">Sede</th>
                  <th className="py-3 px-3">Motivo Contable</th>
                  <th className="py-3 px-3 text-right">Variación</th>
                  <th className="py-3 px-3">Referencia</th>
                  <th className="py-3 px-4">Auditoría / Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLedger.map(entry => {
                  const isPositive = entry.quantity_change > 0;
                  const isZero = entry.quantity_change === 0;

                  return (
                    <tr key={entry.ledger_id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-stone-900">{entry.created_at}</div>
                        <div className="font-mono text-[10px] text-stone-400">{entry.ledger_id}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-stone-900">
                        {entry.variant_name}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold text-[10px]">
                          {entry.location_id}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {getReasonBadge(entry.movement_reason)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        {isZero ? (
                          <span className="text-stone-400">0</span>
                        ) : isPositive ? (
                          <span className="text-emerald-600 inline-flex items-center">
                            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                            +{entry.quantity_change}
                          </span>
                        ) : (
                          <span className="text-red-600 inline-flex items-center">
                            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                            {entry.quantity_change}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-stone-700">
                        {entry.reference_id || '-'}
                      </td>
                      <td className="py-3 px-4 text-stone-500 text-[11px] max-w-xs">
                        <span className="block line-clamp-2">{entry.notes}</span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">Por: {entry.user_id}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Quick Stock Modal */}
      {/* Stock Picker: elegir producto existente y pasar al ingreso de stock */}
      <StockPickerModal
        isOpen={isStockPickerOpen}
        onClose={() => setIsStockPickerOpen(false)}
        variants={allVariants}
        onSelect={(v) => {
          setIsStockPickerOpen(false);
          setQuickStockVariant(v);
        }}
      />

      <QuickStockModal
        isOpen={!!quickStockVariant}
        variant={quickStockVariant}
        onClose={() => setQuickStockVariant(null)}
      />

    </div>
  );
};
