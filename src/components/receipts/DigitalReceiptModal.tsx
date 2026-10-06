import React from 'react';
import { CheckCircle, Download, Printer, Share2, X } from 'lucide-react';
import { Sale } from '../../types';
import { useApp } from '../../context/AppContext';

interface Props {
  sale: Sale | null;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<Props> = ({ sale, onClose }) => {
  const { customers } = useApp();
  if (!sale) return null;

  const customer = customers.find(c => c.customer_id === sale.customer_id);
  const isLayaway = sale.sale_type === 'layaway';
  const latestPayment = sale.payments[sale.payments.length - 1];

  const handlePrint = () => {
    window.print();
  };

  const generateWhatsAppMessage = () => {
    const text = `✨ *Karma Accesorios Buena Vibra* ✨%0A%0A` +
      `¡Hola ${customer?.full_name || 'Estimado/a cliente'}! Te compartimos tu comprobante:%0A` +
      `*Folio:* ${sale.folio}%0A` +
      `*Tipo:* ${isLayaway ? 'Apartado a Plazos' : 'Venta Directa'}%0A` +
      `*Total:* $${sale.total_amount.toFixed(2)} MXN%0A` +
      `*Pagado acumulado:* $${sale.amount_paid.toFixed(2)} MXN%0A` +
      (isLayaway && sale.balance_due > 0 ? `*Saldo pendiente:* $${sale.balance_due.toFixed(2)} MXN%0A*Fecha límite próximo abono:* ${sale.next_payment_due_date || 'A convenir'}%0A` : `*Estado:* Liquidado al 100% ✔️%0A`) +
      `%0A¡Muchas gracias por apoyar la joyería artesanal mexicana! 🪬`;

    const phone = customer?.phone_number ? customer.phone_number.replace(/\D/g, '') : '';
    const url = phone ? `https://wa.me/52${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-stone-50 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🪬</span>
            <div>
              <h3 className="font-semibold text-stone-100 tracking-wide">Comprobante Digital Auditable</h3>
              <p className="text-xs text-stone-400">Karma Accesorios Buena Vibra</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 text-stone-800 bg-white m-4 rounded-xl border border-dashed border-stone-300 font-mono text-xs">
          
          {/* Brand header */}
          <div className="text-center pb-4 border-b border-stone-200">
            <h2 className="text-base font-bold tracking-wider text-stone-900 font-sans">KARMA ACCESORIOS</h2>
            <p className="text-[11px] font-sans text-amber-700 font-medium">Joyería Artesanal con Buena Vibra</p>
            <p className="text-[10px] text-stone-500 mt-1">Aguascalientes &bull; CDMX &bull; Shopify</p>
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-300">
              Folio: {sale.folio}
            </div>
          </div>

          {/* Meta Info */}
          <div className="py-3 border-b border-stone-200 space-y-1 text-stone-600">
            <div className="flex justify-between">
              <span>Fecha / Hora:</span>
              <span className="font-semibold text-stone-800">{sale.created_at}</span>
            </div>
            <div className="flex justify-between">
              <span>Sede de Venta:</span>
              <span className="font-semibold text-stone-800">{sale.location_id === 'AGS' ? 'Aguascalientes' : 'CDMX Showroom'}</span>
            </div>
            <div className="flex justify-between">
              <span>Canal / Medio:</span>
              <span className="uppercase font-semibold text-stone-800">{sale.sale_channel}</span>
            </div>
            <div className="flex justify-between">
              <span>Modalidad:</span>
              <span className={`font-bold uppercase ${isLayaway ? 'text-amber-700' : 'text-emerald-700'}`}>
                {isLayaway ? 'Apartado a Plazos' : 'Venta Directa'}
              </span>
            </div>
            {customer && (
              <div className="mt-2 pt-2 border-t border-stone-100">
                <p className="font-bold text-stone-800">{customer.full_name}</p>
                <p className="text-stone-500">Tel: {customer.phone_number}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="py-3 border-b border-stone-200">
            <p className="font-bold text-stone-700 uppercase tracking-wider mb-2 text-[10px]">Detalle de Joyería</p>
            <div className="space-y-2">
              {sale.items.map(item => (
                <div key={item.sale_item_id} className="flex justify-between items-start">
                  <div className="pr-2">
                    <p className="font-medium text-stone-800">{item.product_name}</p>
                    <p className="text-[10px] text-stone-500">{item.variant_title} &times; {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-stone-900 whitespace-nowrap">
                    ${(item.unit_price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Layaway Balance */}
          <div className="py-3 border-b border-stone-200 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-stone-900">TOTAL:</span>
              <span className="font-bold text-stone-900">${sale.total_amount.toFixed(2)} MXN</span>
            </div>
            
            <div className="flex justify-between text-stone-600">
              <span>Abonado acumulado:</span>
              <span className="font-medium text-emerald-700">${sale.amount_paid.toFixed(2)} MXN</span>
            </div>

            {isLayaway && (
              <>
                <div className="flex justify-between text-stone-900 font-bold bg-amber-50 p-1.5 rounded border border-amber-200">
                  <span>SALDO RESTANTE:</span>
                  <span className="text-amber-800">${sale.balance_due.toFixed(2)} MXN</span>
                </div>
                {sale.balance_due > 0 && sale.next_payment_due_date && (
                  <div className="flex justify-between text-stone-600 text-[11px] pt-1">
                    <span>Próximo abono límite:</span>
                    <span className="font-semibold text-stone-800">{sale.next_payment_due_date}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Payments History */}
          <div className="pt-3">
            <p className="font-bold text-stone-700 uppercase tracking-wider mb-1 text-[10px]">Historial de Pagos / Abonos</p>
            <div className="space-y-1">
              {sale.payments.map((p, idx) => (
                <div key={p.payment_id} className="flex justify-between text-[10px] text-stone-600">
                  <span>#{idx + 1} {p.receipt_folio} ({p.payment_method.toUpperCase()})</span>
                  <span className="font-semibold text-stone-800">+${p.amount_paid.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer notice */}
          <div className="mt-4 pt-3 border-t border-dashed border-stone-200 text-center text-[9px] text-stone-500">
            {isLayaway ? (
              <p>
                * Las piezas quedan resguardadas en &quot;Inventario Reservado&quot; y descontadas de la tienda online hasta saldar la cuenta.
              </p>
            ) : (
              <p>Gracias por tu compra. Garantía artesanal de 30 días en materiales e hilo.</p>
            )}
            <p className="mt-1 font-semibold text-stone-600">www.karmaaccesorios.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-stone-100 border-t border-stone-200 flex flex-wrap gap-2 justify-end">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium text-xs shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>Imprimir Ticket</span>
          </button>
          
          <button
            onClick={generateWhatsAppMessage}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Enviar por WhatsApp</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 text-stone-100 font-medium text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
