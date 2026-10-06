import React, { useState } from 'react';
import { 
  Activity, 
  AlertCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  Code, 
  Cpu, 
  Database, 
  Layers, 
  Lock, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  Terminal, 
  Zap 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShopifyConsole: React.FC = () => {
  const { 
    products, 
    shopifyGraphQLBucket, 
    mutationLogs, 
    webhookLogs, 
    simulateIncomingShopifyOrder, 
    triggerManualShopifySync 
  } = useApp();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(products[0]?.variants[0]?.variant_id || '');
  const [webhookQty, setWebhookQty] = useState<number>(1);
  const [inspectingPayload, setInspectingPayload] = useState<any>(null);

  const allVariants = products.flatMap(p => 
    p.variants.map(v => ({
      ...v,
      product_name: p.name,
    }))
  );

  const handleSimulateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) return;
    simulateIncomingShopifyOrder(selectedVariantId, webhookQty);
  };

  const bucketPercentage = Math.round((shopifyGraphQLBucket / 1000) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Architecture Overview */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-stone-900">
                Consola de Integración Shopify Admin GraphQL &amp; Webhooks
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-300">
                Sincronización Bidireccional
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Monitoreo en tiempo real de mutaciones de inventario, validación HMAC SHA-256, deduplicación de eventos y control de tasa (Leaky Bucket).
            </p>
          </div>

          <button
            onClick={triggerManualShopifySync}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Forzar Sincronización Completa</span>
          </button>
        </div>

        {/* 3 Resilience Pillars */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100 text-xs">
          
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center space-x-2 text-stone-900 font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>1. Validación HMAC SHA-256</span>
            </div>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Autenticación estricta de firma digital enviada en la cabecera <code>X-Shopify-Hmac-Sha256</code> antes de aplicar cambios en base de datos.
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center space-x-2 text-stone-900 font-bold mb-1">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>2. Idempotencia y Deduplicación</span>
            </div>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Respuesta inmediata HTTP 200 OK con encolamiento asíncrono y hash en <code>X-Shopify-Webhook-Id</code> para ignorar paquetes repetidos.
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center space-x-2 text-stone-900 font-bold mb-1">
              <Activity className="w-4 h-4 text-amber-600" />
              <span>3. Leaky Bucket (1000 Puntos)</span>
            </div>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Algoritmo de cubeta con filtrado para mitigar límites de tasa HTTP 429 en llamadas masivas a la API GraphQL.
            </p>
          </div>

        </div>

        {/* Leaky Bucket Live Meter */}
        <div className="mt-5 bg-stone-900 text-stone-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="p-2.5 bg-stone-800 rounded-lg text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200">
                GraphQL Cost Bucket Quota: <span className="text-emerald-400 font-mono">{shopifyGraphQLBucket} / 1000 pts</span>
              </p>
              <p className="text-[10px] text-stone-400">
                Recarga automática a 50 pts/segundo &bull; Costo típico por mutación: 10 pts
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <div className="flex justify-between text-[10px] font-mono text-stone-400 mb-1">
              <span>Capacidad Disponible</span>
              <span>{bucketPercentage}%</span>
            </div>
            <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  bucketPercentage > 50 ? 'bg-emerald-400' : bucketPercentage > 20 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ width: `${bucketPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* Simulator Section & Live Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Simulator Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-stone-100 mb-3">
              <Terminal className="w-4 h-4 text-teal-700" />
              <h2 className="font-bold text-sm text-stone-900">
                Simulador de Webhooks Entrantes (Shopify &rarr; POS)
              </h2>
            </div>
            
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Dispara un evento sintético <code>orders/create</code> desde el e-commerce. Descuenta inventario local de Aguascalientes de forma atómica y valida la firma HMAC.
            </p>

            <form onSubmit={handleSimulateWebhook} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Accesorio Comprado en Tienda Online *
                </label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50"
                >
                  {allVariants.map(v => (
                    <option key={v.variant_id} value={v.variant_id}>
                      {v.product_name} - {v.title} (Disp. AGS: {v.stock_ags})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Cantidad Vendida en Shopify *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={webhookQty}
                  onChange={(e) => setWebhookQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 font-mono text-[10px] space-y-1 text-stone-600">
                <p>Topic: <strong className="text-stone-900">orders/create</strong></p>
                <p>Header: <span className="text-emerald-700 font-bold">X-Shopify-Hmac-Sha256: VALID</span></p>
                <p>Fulfillment Hub: <strong className="text-stone-800">Aguascalientes (Matriz)</strong></p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Emitir Webhook Sintético</span>
              </button>
            </form>
          </div>
        </div>

        {/* Live Logs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Outgoing GraphQL Mutation Logs */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                <h2 className="font-bold text-sm text-stone-900">
                  Mutaciones GraphQL de Salida (POS &rarr; Shopify)
                </h2>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">
                inventoryAdjustQuantities
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
              {mutationLogs.map(log => (
                <div key={log.mutation_id} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] font-bold text-stone-900">
                        {log.operation_name}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        log.response_status === 'SUCCESS_200' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.response_status}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                      Delta: <strong className={log.quantity_delta >= 0 ? 'text-emerald-700' : 'text-red-700'}>
                        {log.quantity_delta >= 0 ? `+${log.quantity_delta}` : log.quantity_delta}
                      </strong> &bull; Location: {log.location_id.split('/').pop()} &bull; Costo: {log.cost_points} pts
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-stone-400 whitespace-nowrap">
                    {log.timestamp.split(' ')[1]}
                  </span>
                </div>
              ))}

              {mutationLogs.length === 0 && (
                <div className="py-6 text-center text-xs text-stone-400">
                  No hay mutaciones GraphQL emitidas en esta sesión.
                </div>
              )}
            </div>
          </div>

          {/* Incoming Webhook Logs */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div className="flex items-center space-x-2">
                <ArrowDownLeft className="w-4 h-4 text-sky-600" />
                <h2 className="font-bold text-sm text-stone-900">
                  Webhooks Entrantes Recibidos (Shopify &rarr; POS)
                </h2>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">HMAC Verified</span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
              {webhookLogs.map(wh => (
                <div key={wh.webhook_id} className="pt-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-stone-900 text-[11px]">
                        {wh.topic}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        HMAC OK
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-stone-400">
                      {wh.received_at}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1">
                    {wh.payload_summary}
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono mt-0.5 truncate">
                    ID: {wh.webhook_id} &bull; Sig: {wh.hmac_signature}
                  </p>
                </div>
              ))}

              {webhookLogs.length === 0 && (
                <div className="py-6 text-center text-xs text-stone-400">
                  No hay webhooks registrados en esta sesión.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
