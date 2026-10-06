import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  AlertTriangle, 
  DollarSign, 
  Layers, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  Calculator,
  Compass
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const AnalyticsDashboard: React.FC = () => {
  const { sales, products } = useApp();

  // 1. GMROI (Gross Margin Return on Inventory Investment) Calculation:
  // GMROI = Total Gross Margin / Average Inventory Cost
  const gmroiData = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
    const categories = uniqueCategories.length > 0 ? uniqueCategories : ['Collares', 'Pulseras', 'Aretes', 'Dijes', 'Anillos'];

    return categories.map(cat => {
      // Find all variants in this category
      const categoryProducts = products.filter(p => p.category === cat);
      const categoryVariants = categoryProducts.flatMap(p => p.variants);

      // Average Inventory Cost = Sum of (stock * unit_cost)
      let totalInventoryCost = 0;
      categoryVariants.forEach(v => {
        const bom = v.bom_items.reduce((acc, b) => acc + (b.quantity * b.unit_cost), 0);
        const labor = v.avg_assembly_minutes * v.labor_minute_rate;
        const unitCost = bom + labor;
        const totalStock = v.stock_ags + v.stock_cdmx + v.stock_in_transit_cdmx;
        totalInventoryCost += totalStock * unitCost;
      });

      // Calculate gross profit from completed sales in this category
      let grossProfit = 0;
      let revenue = 0;
      sales.forEach(s => {
        if (s.status === 'completed' || s.status === 'delivered') {
          s.items.forEach(item => {
            const isMatch = categoryVariants.some(v => v.variant_id === item.variant_id);
            if (isMatch) {
              const lineRevenue = item.unit_price * item.quantity;
              const lineCost = item.unit_cost * item.quantity;
              revenue += lineRevenue;
              grossProfit += (lineRevenue - lineCost);
            }
          });
        }
      });

      // Solo cifras reales: sin ventas o sin inventario el GMROI es 0 (evita div/0 sin inventar datos)
      const gmroi = totalInventoryCost > 0 ? +(grossProfit / totalInventoryCost).toFixed(2) : 0;

      return {
        category: cat,
        gmroi,
        revenue: Math.round(revenue),
        grossProfit: Math.round(grossProfit),
        inventoryCost: Math.round(totalInventoryCost),
      };
    });
  }, [sales, products]);

  // 2. Channel & Location Attribution Data
  const channelAttributionData = useMemo(() => {
    const channelTotals: Record<string, number> = {
      'Físico Aguascalientes': 0,
      'Showroom CDMX': 0,
      'Shopify Online': 0,
      'Instagram DM': 0,
      'WhatsApp Directo': 0,
    };

    sales.forEach(s => {
      if (s.status === 'cancelled') return;
      const amount = s.total_amount;
      if (s.sale_channel === 'shopify') {
        channelTotals['Shopify Online'] += amount;
      } else if (s.sale_channel === 'instagram') {
        channelTotals['Instagram DM'] += amount;
      } else if (s.sale_channel === 'whatsapp') {
        channelTotals['WhatsApp Directo'] += amount;
      } else if (s.location_id === 'AGS') {
        channelTotals['Físico Aguascalientes'] += amount;
      } else {
        channelTotals['Showroom CDMX'] += amount;
      }
    });

    return Object.entries(channelTotals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [sales]);

  // 3. Layaway Default Risk & Compliance Rate
  // Incumplimiento = Apartados Cancelados o Vencidos / Total Apartados
  const layawayMetrics = useMemo(() => {
    const layaways = sales.filter(s => s.sale_type === 'layaway');
    const totalLayaways = layaways.length;
    if (totalLayaways === 0) return { total: 0, overdueOrCancelled: 0, defaultRate: 0, active: 0, paid: 0 };

    const now = new Date();
    const overdueOrCancelled = layaways.filter(s => {
      if (s.status === 'cancelled') return true;
      if (s.status === 'active_layaway' && s.next_payment_due_date) {
        return new Date(s.next_payment_due_date) < now;
      }
      return false;
    }).length;

    const defaultRate = Math.round((overdueOrCancelled / totalLayaways) * 100);
    const active = layaways.filter(s => s.status === 'active_layaway').length;
    const paid = layaways.filter(s => s.status === 'completed' || s.status === 'delivered').length;

    return {
      total: totalLayaways,
      overdueOrCancelled,
      defaultRate,
      active,
      paid,
    };
  }, [sales]);

  // 4. Product Prime Cost vs Labor Time Breakdown
  const costBreakdownData = useMemo(() => {
    const flattened = products.flatMap(p => p.variants);
    return flattened.slice(0, 6).map(v => {
      const bomCost = v.bom_items.reduce((acc, b) => acc + (b.quantity * b.unit_cost), 0);
      const laborCost = v.avg_assembly_minutes * v.labor_minute_rate;
      const primeCost = +(bomCost + laborCost).toFixed(2);
      const margin = +(v.unit_price - primeCost).toFixed(2);

      return {
        name: v.title.split('/')[0].trim(),
        sku: v.sku,
        bomCost: Math.round(bomCost),
        laborCost: Math.round(laborCost),
        margin: Math.round(margin),
        price: v.unit_price,
        assemblyMinutes: v.avg_assembly_minutes,
      };
    });
  }, [products]);

  const COLORS = ['#d97706', '#0284c7', '#059669', '#7c3aed', '#db2777'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-stone-900">
                Inteligencia de Negocios y Analítica Avanzada
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-300">
                Acceso Completo
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Indicadores clave de retorno sobre inversión en inventario (GMROI), costo primo artesanal y rendimiento omnicanal.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-stone-600 font-medium">Auditoría en tiempo real</span>
          </div>
        </div>

        {/* 4 Executive KPI Highlights */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-stone-100">
          
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>GMROI Promedio Joyería</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-stone-900">
              {(gmroiData.reduce((a, b) => a + b.gmroi, 0) / gmroiData.length).toFixed(2)}x
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Margen bruto por cada $1 invertido en inventario
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>Tasa de Incumplimiento</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-800">
              {layawayMetrics.defaultRate}%
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              {layawayMetrics.overdueOrCancelled} de {layawayMetrics.total} apartados con mora
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>Venta Omnicanal Neta</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-stone-900">
              ${channelAttributionData.reduce((sum, c) => sum + c.value, 0).toLocaleString()} MXN
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Sedes AGS &bull; CDMX &bull; Shopify
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>Tarifa Mano de Obra</span>
              <Clock className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-2xl font-bold text-stone-900">
              $2.50 <span className="text-xs text-stone-500 font-normal">MXN/min</span>
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              $150.00 MXN / hora de taller artesanal
            </p>
          </div>

        </div>
      </div>

      {/* Row 1: GMROI per Category & Channel Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GMROI Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div>
                <h2 className="font-bold text-sm text-stone-900">
                  GMROI por Familia de Joyería (Retorno sobre Inversión)
                </h2>
                <p className="text-xs text-stone-500">
                  GMROI = Utilidad Bruta Total &divide; Costo Promedio de Inventario
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                Meta: &gt; 1.5x
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gmroiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    formatter={(value: any) => [`${value}x retorno`, 'GMROI']}
                    contentStyle={{ borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="gmroi" fill="#d97706" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-600 space-y-1">
            <p className="font-bold text-stone-800">Decisión Estratégica Derivada:</p>
            <p className="text-[11px] text-stone-500">
              Las categorías con mayor GMROI (ej. Pulseras tejidas y Collares con piedras de alto margen) deben recibir prioridad en el tablero de ensamble de Teffy.
            </p>
          </div>
        </div>

        {/* Channel Attribution Pie (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-stone-100 mb-3">
              <h2 className="font-bold text-sm text-stone-900">
                Atribución de Ventas por Canal y Sede
              </h2>
              <p className="text-xs text-stone-500">
                Comparativa de ingresos: Físico vs Canales Digitales
              </p>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelAttributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {channelAttributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`$${value.toLocaleString()} MXN`, 'Ventas']}
                    contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend breakdown */}
            <div className="space-y-1.5 mt-2">
              {channelAttributionData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="text-stone-700">{entry.name}</span>
                  </div>
                  <span className="font-bold text-stone-900">${entry.value.toLocaleString()} MXN</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
            <strong>Estrategia Omnicanal:</strong> Permite orientar pautas de Instagram y WhatsApp hacia la sede con mayor conversión.
          </div>
        </div>

      </div>

      {/* Row 2: Manufacturing Prime Cost (BOM + Labor) vs Price */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div>
            <h2 className="font-bold text-sm text-stone-900">
              Desglose de Costo Primo de Manufactura por Joya
            </h2>
            <p className="text-xs text-stone-500">
              Fórmula: C<sub>unidad</sub> = Insumos (BOM) + (T<sub>min</sub> &times; $2.50/min) vs Margen de Utilidad
            </p>
          </div>
          <span className="text-xs font-mono text-stone-400">Karma Accesorios Buena Vibra</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] font-bold border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Pieza de Joyería</th>
                <th className="py-2.5 px-3 text-center">Tiempo Ensamble</th>
                <th className="py-2.5 px-3 text-right">Insumos (BOM)</th>
                <th className="py-2.5 px-3 text-right">Mano de Obra ($2.5/min)</th>
                <th className="py-2.5 px-3 text-right font-bold text-stone-900">Costo Primo Total</th>
                <th className="py-2.5 px-3 text-right">Precio Venta (PVP)</th>
                <th className="py-2.5 px-3 text-right font-bold text-emerald-800">Margen Bruto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {costBreakdownData.map(item => (
                <tr key={item.sku} className="hover:bg-stone-50/70">
                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-900">{item.name}</div>
                    <div className="font-mono text-[10px] text-stone-400">{item.sku}</div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-stone-700">
                    {item.assemblyMinutes} min
                  </td>
                  <td className="py-3 px-3 text-right text-stone-600">
                    ${item.bomCost.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-stone-600">
                    ${item.laborCost.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-stone-900">
                    ${(item.bomCost + item.laborCost).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-stone-900">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-700">
                    ${item.margin.toFixed(2)} ({Math.round((item.margin / item.price) * 100)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
