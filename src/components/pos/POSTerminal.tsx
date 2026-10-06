import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, 
  Banknote, 
  CreditCard, 
  Layers, 
  Minus, 
  Plus, 
  Search, 
  ShoppingBag, 
  Trash2, 
  UserPlus, 
  Users, 
  Wallet,
  ArrowRight,
  CheckCircle2,
  Calendar,
  CalendarDays,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductVariant, Sale, SaleChannel, SaleType } from '../../types';
import { DigitalReceiptModal } from '../receipts/DigitalReceiptModal';

export const POSTerminal: React.FC = () => {
  const { 
    products, 
    currentLocation, 
    currentUser, 
    customers, 
    addCustomer, 
    processSale,
    events,
    activeEventId,
    setActiveEventId
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedGender, setSelectedGender] = useState<string>('Todos');
  const [cart, setCart] = useState<{ variantId: string; quantity: number }[]>([]);
  
  // Sale Options
  const [saleType, setSaleType] = useState<SaleType>('direct');
  const [saleChannel, setSaleChannel] = useState<SaleChannel>('physical');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [cashTendered, setCashTendered] = useState<string>('');
  // Pago mixto: parte en efectivo, parte en tarjeta y/o transferencia
  const [isMixedPayment, setIsMixedPayment] = useState(false);
  const [splitAmounts, setSplitAmounts] = useState<{ cash: string; card: string; transfer: string }>({ cash: '', card: '', transfer: '' });
  const [downPaymentAmount, setDownPaymentAmount] = useState<string>('');
  const [nextPaymentDate, setNextPaymentDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [saleNotes, setSaleNotes] = useState('');

  // Quick Customer Creation modal state
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustNotes, setNewCustNotes] = useState('');

  // Completed sale receipt modal
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const categories = ['Todos', 'Collares', 'Pulseras', 'Aretes', 'Arracadas', 'Dijes', 'Anillos', 'Escapularios', 'Tobilleras', 'Llaveros'];
  const genders = ['Todos', 'Hombre', 'Mujer', 'Unisex'];

  // Flatten variants with parent product info for the catalog grid
  const allVariantsWithProduct = useMemo(() => {
    return products.flatMap(p => 
      p.variants.map(v => ({
        ...v,
        product_name: p.name,
        category: p.category,
        gender: v.gender || p.gender || 'Unisex',
        material: v.material || p.material || v.stone_charm,
        image_url: p.image_url,
      }))
    );
  }, [products]);

  // Filtered variants
  const filteredItems = useMemo(() => {
    return allVariantsWithProduct.filter(item => {
      const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
      const matchesGender = selectedGender === 'Todos' || item.gender === selectedGender;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.product_name.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.stone_charm.toLowerCase().includes(query) ||
        item.color_alloy.toLowerCase().includes(query) ||
        (item.material && item.material.toLowerCase().includes(query));
      return matchesCategory && matchesGender && matchesSearch;
    });
  }, [allVariantsWithProduct, selectedCategory, selectedGender, searchQuery]);

  // Cart totals
  const cartItemsDetailed = useMemo(() => {
    return cart.map(cartItem => {
      const itemData = allVariantsWithProduct.find(v => v.variant_id === cartItem.variantId)!;
      return {
        ...cartItem,
        itemData,
        lineTotal: itemData ? itemData.unit_price * cartItem.quantity : 0,
      };
    }).filter(i => !!i.itemData);
  }, [cart, allVariantsWithProduct]);

  const totalCartAmount = useMemo(() => {
    return cartItemsDetailed.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [cartItemsDetailed]);

  // Minimum recommended down payment for layaways (e.g. 30%)
  const minRecommendedDownPayment = Math.ceil(totalCartAmount * 0.3);

  // Cart operations
  const addToCart = (variantId: string) => {
    const itemData = allVariantsWithProduct.find(v => v.variant_id === variantId);
    if (!itemData) return;

    const currentStock = currentLocation === 'AGS' ? itemData.stock_ags : itemData.stock_cdmx;
    const existing = cart.find(c => c.variantId === variantId);
    const existingQty = existing ? existing.quantity : 0;

    if (existingQty + 1 > currentStock) {
      alert(`No hay suficiente inventario disponible en ${currentLocation}. Existencias actuales: ${currentStock}`);
      return;
    }

    if (existing) {
      setCart(cart.map(c => c.variantId === variantId ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { variantId, quantity: 1 }]);
    }
  };

  const updateQuantity = (variantId: string, delta: number) => {
    const itemData = allVariantsWithProduct.find(v => v.variant_id === variantId);
    if (!itemData) return;
    const currentStock = currentLocation === 'AGS' ? itemData.stock_ags : itemData.stock_cdmx;

    setCart(prev => {
      return prev.map(c => {
        if (c.variantId === variantId) {
          const newQ = c.quantity + delta;
          if (newQ > currentStock) {
            alert(`Stock máximo alcanzado (${currentStock}) para esta sede.`);
            return c;
          }
          return newQ > 0 ? { ...c, quantity: newQ } : null;
        }
        return c;
      }).filter(Boolean) as { variantId: string; quantity: number }[];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(c => c.variantId !== variantId));
  };

  const clearCart = () => {
    setCart([]);
    setCashTendered('');
    setDownPaymentAmount('');
    setSplitAmounts({ cash: '', card: '', transfer: '' });
  };

  // Quick Customer Creation
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) {
      alert('Nombre y teléfono son obligatorios');
      return;
    }
    const created = addCustomer({
      full_name: newCustName.trim(),
      phone_number: newCustPhone.trim(),
      email: newCustEmail.trim() || undefined,
      notes: newCustNotes.trim() || undefined,
    });
    setSelectedCustomerId(created.customer_id);
    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustNotes('');
  };

  const splitNum = {
    cash: parseFloat(splitAmounts.cash) || 0,
    card: parseFloat(splitAmounts.card) || 0,
    transfer: parseFloat(splitAmounts.transfer) || 0,
  };
  const splitTotal = splitNum.cash + splitNum.card + splitNum.transfer;
  const activeEvents = events.filter(ev => ev.status === 'Activo');
  const activeEvent = activeEvents.find(ev => ev.event_id === activeEventId);

  // Submit Sale Handler
  const handleProcessCheckout = () => {
    if (cart.length === 0) return;

    if (saleType === 'layaway') {
      if (!selectedCustomerId) {
        alert('Para registrar un Apartado a Plazos, debes seleccionar o registrar al cliente con su nombre y teléfono.');
        return;
      }
      const downPayment = parseFloat(downPaymentAmount) || minRecommendedDownPayment;
      if (downPayment <= 0 || downPayment > totalCartAmount) {
        alert(`El enganche debe ser mayor a 0 y no exceder el total ($${totalCartAmount} MXN).`);
        return;
      }
    }

    const downPay = saleType === 'layaway' 
      ? (parseFloat(downPaymentAmount) || minRecommendedDownPayment) 
      : totalCartAmount;

    if (isMixedPayment && Math.abs(splitTotal - downPay) > 0.009) {
      alert(`El pago mixto suma $${splitTotal.toFixed(2)} y debe ser $${downPay.toFixed(2)} MXN.`);
      return;
    }

    const result = processSale({
      customerId: selectedCustomerId || undefined,
      items: cart,
      saleType,
      saleChannel,
      downPayment: downPay,
      paymentMethod,
      paymentSplit: isMixedPayment
        ? { cash: splitNum.cash, card: splitNum.card, transfer: splitNum.transfer }
        : undefined,
      nextPaymentDueDate: saleType === 'layaway' ? nextPaymentDate : undefined,
      notes: saleNotes.trim() || undefined,
    });

    if (result.success && result.sale) {
      setCompletedSale(result.sale);
      clearCart();
    } else {
      alert(result.error || 'Error al procesar la venta');
    }
  };

  // Calculate change for cash payment
  const cashGivenNum = parseFloat(cashTendered) || 0;
  const targetPaymentToCover = saleType === 'layaway' 
    ? (parseFloat(downPaymentAmount) || minRecommendedDownPayment) 
    : totalCartAmount;
  const changeDue = Math.max(0, cashGivenNum - targetPaymentToCover);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner / Attribution Info */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Terminal Punto de Venta (POS)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              Sede Activa: {currentLocation === 'AGS' ? 'Aguascalientes (Matriz)' : 'CDMX (Showroom Roma)'}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Atendiendo: <strong className="text-stone-700">{currentUser.name}</strong> ({currentUser.title}) &bull; Sincronización automática de inventario a Shopify
          </p>
        </div>

        {/* Event Attribution Selector: las ventas quedan registradas en el evento elegido */}
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border shadow-xs ${
          activeEvent ? 'bg-amber-100 border-amber-400' : 'bg-white border-stone-300'
        }`}>
          <CalendarDays className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="text-xs text-stone-500 font-medium">Evento:</span>
          <select
            value={activeEvent ? activeEvent.event_id : ''}
            onChange={(e) => setActiveEventId(e.target.value || null)}
            className="text-xs font-semibold text-stone-800 bg-transparent border-none focus:ring-0 cursor-pointer max-w-[14rem]"
          >
            <option value="">Sin evento (venta normal)</option>
            {activeEvents.map(ev => (
              <option key={ev.event_id} value={ev.event_id}>
                {ev.name} · {ev.date}
              </option>
            ))}
          </select>
        </div>

        {/* Channel Attribution Selector */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-stone-300 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Canal de Venta:</span>
          <select
            value={saleChannel}
            onChange={(e) => setSaleChannel(e.target.value as SaleChannel)}
            className="text-xs font-semibold text-stone-800 bg-transparent border-none focus:ring-0 cursor-pointer"
          >
            <option value="physical">Mostrador Físico</option>
            <option value="whatsapp">WhatsApp Directo</option>
            <option value="instagram">Instagram DM</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Catalog & Variants (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search & Category Tabs */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar joya por nombre, dije, cuarzo, SKU (ej. PH12)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
              />
            </div>

            {/* Category & Gender Filter Chips */}
            <div className="space-y-2">
              <div className="flex space-x-1.5 overflow-x-auto scrollbar-none pb-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Quick Gender Selector */}
              <div className="flex items-center space-x-1.5 border-t border-stone-100 pt-2">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mr-1">
                  Público:
                </span>
                {genders.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      selectedGender === g
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Variants Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredItems.map(item => {
              const stockCurrent = currentLocation === 'AGS' ? item.stock_ags : item.stock_cdmx;
              const isOutOfStock = stockCurrent <= 0;
              const inCart = cart.find(c => c.variantId === item.variant_id);

              return (
                <div
                  key={item.variant_id}
                  className={`bg-white rounded-xl border p-3.5 flex flex-col justify-between transition-all hover:shadow-md ${
                    isOutOfStock ? 'border-stone-200 opacity-65' : 'border-stone-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex space-x-3">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-16 h-16 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          item.gender === 'Hombre'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : item.gender === 'Mujer'
                            ? 'bg-pink-50 text-pink-700 border border-pink-200'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {item.gender}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-stone-900 leading-snug line-clamp-1">
                        {item.product_name}
                      </h3>
                      <p className="text-[11px] text-stone-600 font-medium line-clamp-1">
                        {item.title}
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] mt-0.5">
                        <span className="text-stone-400 font-mono">{item.sku}</span>
                        {item.material && (
                          <span className="text-stone-600 bg-stone-100 px-1 rounded font-medium">{item.material}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock and Price details */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-stone-900">
                        ${item.unit_price.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-1.5 text-[10px] mt-0.5">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${stockCurrent > 2 ? 'bg-emerald-500' : stockCurrent > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                        <span className="text-stone-500">
                          {stockCurrent > 0 ? `${stockCurrent} en ${currentLocation}` : `Sin stock en ${currentLocation}`}
                        </span>
                        {item.stock_layaway_reserved > 0 && (
                          <span className="text-amber-600 font-medium">({item.stock_layaway_reserved} reserv.)</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(item.variant_id)}
                      disabled={isOutOfStock}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all ${
                        isOutOfStock
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : inCart
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-stone-900 hover:bg-amber-700 text-white shadow-xs'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{inCart ? `En Carrito (${inCart.quantity})` : 'Agregar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
              No se encontraron accesorios artesanales que coincidan con la búsqueda.
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: POS Cart & Checkout / Apartado Engine (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 flex flex-col h-full sticky top-24">
            
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-amber-700" />
                <h2 className="font-bold text-stone-900 text-sm tracking-wide">
                  Ticket de Venta
                </h2>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-stone-400 hover:text-red-600 text-xs flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar</span>
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="py-3 flex-1 overflow-y-auto max-h-[300px] space-y-2.5 divide-y divide-stone-100">
              {cartItemsDetailed.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  El carrito está vacío. Selecciona piezas del catálogo.
                </div>
              ) : (
                cartItemsDetailed.map(item => (
                  <div key={item.variantId} className="pt-2 flex items-center justify-between text-xs">
                    <div className="pr-2 flex-1">
                      <p className="font-semibold text-stone-900">{item.itemData.product_name}</p>
                      <p className="text-[11px] text-stone-500">{item.itemData.title}</p>
                      <p className="text-[10px] text-stone-400 font-mono">${item.itemData.unit_price} c/u</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center border border-stone-300 rounded-md bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.variantId, -1)}
                          className="p-1 text-stone-500 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-stone-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, 1)}
                          className="p-1 text-stone-500 hover:text-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-stone-900 w-16 text-right">
                        ${item.lineTotal.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-stone-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sale Mode Switcher: Direct Sale vs Apartado / Venta a Plazos (Karma solo venta directa) */}
            {currentUser.role !== 'Karma' && (
            <div className="pt-3 border-t border-stone-200">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Modalidad de Operación
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSaleType('direct')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                    saleType === 'direct'
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Venta Directa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSaleType('layaway')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                    saleType === 'layaway'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Apartado a Plazos</span>
                </button>
              </div>
            </div>
            )}

            {/* Customer Picker (Mandatory for Layaway, Optional for Direct) */}
            <div className="mt-3.5 pt-3 border-t border-stone-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center space-x-1">
                  <Users className="w-3 h-3 text-stone-500" />
                  <span>Cliente {saleType === 'layaway' ? <span className="text-red-500">*Requerido</span> : '(Opcional)'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(true)}
                  className="text-amber-700 hover:text-amber-800 text-[11px] font-semibold flex items-center space-x-1"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>+ Nuevo</span>
                </button>
              </div>

              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full text-xs py-2 px-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-600"
              >
                <option value="">-- Seleccionar cliente registrado --</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.full_name} ({c.phone_number})
                  </option>
                ))}
              </select>
            </div>

            {/* Layaway specific controls: Down payment & Next payment date */}
            {saleType === 'layaway' && (
              <div className="mt-3 bg-amber-50/80 border border-amber-200 rounded-lg p-3 space-y-2.5 text-xs">
                <div className="flex items-start space-x-2 text-amber-900 text-[11px] leading-relaxed">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Regla de Apartado:</strong> El artículo pasa a <em>&quot;Inventario Reservado&quot;</em> y se notifica a Shopify para decrementar la disponibilidad online.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase">
                      Enganche Inicial ($)
                    </label>
                    <input
                      type="number"
                      placeholder={`Mínimo: $${minRecommendedDownPayment}`}
                      value={downPaymentAmount}
                      onChange={(e) => setDownPaymentAmount(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-md text-xs font-bold text-stone-900"
                    />
                    <span className="text-[10px] text-stone-500">Sugerido 30%: ${minRecommendedDownPayment}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase">
                      Próximo Pago Límite
                    </label>
                    <input
                      type="date"
                      value={nextPaymentDate}
                      onChange={(e) => setNextPaymentDate(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-md text-xs font-medium text-stone-900"
                    />
                  </div>
                </div>

                {totalCartAmount > 0 && (
                  <div className="pt-2 border-t border-amber-200/60 flex justify-between font-bold text-xs text-amber-950">
                    <span>Saldo Restante a Plazos:</span>
                    <span>
                      ${(totalCartAmount - (parseFloat(downPaymentAmount) || minRecommendedDownPayment)).toFixed(2)} MXN
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="mt-3.5 pt-3 border-t border-stone-200">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Método de Pago {saleType === 'layaway' ? '(Del Enganche)' : ''}
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('cash'); setIsMixedPayment(false); }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 border transition-all ${
                    !isMixedPayment && paymentMethod === 'cash'
                      ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Efectivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('card'); setIsMixedPayment(false); }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 border transition-all ${
                    !isMixedPayment && paymentMethod === 'card'
                      ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Tarjeta</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('transfer'); setIsMixedPayment(false); }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 border transition-all ${
                    !isMixedPayment && paymentMethod === 'transfer'
                      ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SPEI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMixedPayment(true)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 border transition-all ${
                    isMixedPayment
                      ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Mixto</span>
                </button>
              </div>

              {/* Pago mixto: cuánto se cobró con cada método */}
              {isMixedPayment && (
                <div className="mt-2.5 p-2.5 bg-stone-50 rounded-md border border-stone-200 space-y-2 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    {([['cash', 'Efectivo'], ['card', 'Tarjeta'], ['transfer', 'Transferencia']] as const).map(([method, label]) => (
                      <label key={method} className="block">
                        <span className="block text-[10px] font-semibold text-stone-600 mb-0.5">{label}</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="0.00"
                          value={splitAmounts[method]}
                          onChange={(e) => setSplitAmounts({ ...splitAmounts, [method]: e.target.value })}
                          className="w-full px-1.5 py-1 border border-stone-300 rounded text-xs font-bold bg-white"
                        />
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">
                      Suma: <strong className="text-stone-900">${splitTotal.toFixed(2)}</strong> de ${targetPaymentToCover.toFixed(2)}
                    </span>
                    {Math.abs(splitTotal - targetPaymentToCover) <= 0.009 ? (
                      <span className="font-bold text-emerald-700">Cuadra</span>
                    ) : splitTotal < targetPaymentToCover ? (
                      <span className="font-bold text-red-600">Faltan ${(targetPaymentToCover - splitTotal).toFixed(2)}</span>
                    ) : (
                      <span className="font-bold text-red-600">Sobran ${(splitTotal - targetPaymentToCover).toFixed(2)}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Cash change calculator */}
              {!isMixedPayment && paymentMethod === 'cash' && targetPaymentToCover > 0 && (
                <div className="mt-2.5 p-2 bg-stone-50 rounded-md border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-stone-500">Recibido: $</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="w-20 px-1.5 py-0.5 border border-stone-300 rounded text-xs font-bold"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 text-[10px] block">Cambio:</span>
                    <span className="font-bold text-stone-900">${changeDue.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Total calculation & Final Button */}
            <div className="mt-4 pt-4 border-t border-stone-200 space-y-2">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} pzas):</span>
                <span>${totalCartAmount.toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900">
                <span>Total a Cobrar:</span>
                <span className="text-base text-amber-800 font-mono">${totalCartAmount.toFixed(2)} MXN</span>
              </div>

              <button
                type="button"
                onClick={handleProcessCheckout}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
                  cart.length === 0
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-amber-900/20'
                }`}
              >
                <span>
                  {saleType === 'layaway' ? 'Confirmar y Apartar Joya' : 'Procesar Venta Directa'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Quick Customer Creation Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="font-bold text-base text-stone-900 mb-1">Registrar Nuevo Cliente</h3>
            <p className="text-xs text-stone-500 mb-4">
              Datos de contacto para el seguimiento de apartados a plazos y recibos de garantía.
            </p>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Mariana Rosales"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Número Telefónico (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ej. 449-123-4567"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="ej. mariana@correo.com"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Notas de Preferencias / Medidas
                </label>
                <textarea
                  rows={2}
                  placeholder="Medida de muñeca, cuarzo favorito..."
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs"
                >
                  Guardar y Seleccionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal when sale finishes */}
      {completedSale && (
        <DigitalReceiptModal
          sale={completedSale}
          onClose={() => setCompletedSale(null)}
        />
      )}

    </div>
  );
};
