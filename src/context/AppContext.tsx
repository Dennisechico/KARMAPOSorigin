import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  Customer, 
  CdmxOrder, 
  CdmxOrderItem, 
  CdmxOrderType, 
  InterLocationTransfer, 
  InventoryMovementReason, 
  KarmaEvent, 
  PaymentSplit, 
  InventoryLedgerEntry, 
  Location, 
  LocationId, 
  NewProductFormData,
  Product, 
  ProductionOrder, 
  Sale, 
  SaleChannel, 
  SaleType, 
  ShopifyGraphQLMutationLog, 
  ShopifyWebhookEvent, 
  User, 
  UserRole 
} from '../types';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_LEDGER, 
  INITIAL_LOCATIONS, 
  INITIAL_PRODUCTS, 
  REMOVED_DEMO_IDS, 
  REMOVED_PRODUCT_IDS, 
  INITIAL_PRODUCTION_ORDERS, 
  INITIAL_SALES, 
  INITIAL_TRANSFERS, 
  INITIAL_USERS 
} from '../data/initialData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Auth & RBAC
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  isAuthenticated: boolean;
  loginWithCredentials: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  currentLocation: LocationId;
  setCurrentLocation: (loc: LocationId) => void;
  locations: Location[];
  
  // Products & Inventory
  products: Product[];
  ledger: InventoryLedgerEntry[];
  addNewProduct: (formData: NewProductFormData) => { success: boolean; product?: Product; error?: string };
  addStockToVariant: (variantId: string, location: LocationId, quantity: number, notes?: string) => { success: boolean; error?: string };
  
  // Sales & Layaways
  sales: Sale[];
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'customer_id' | 'registration_date'>) => Customer;
  processSale: (data: {
    customerId?: string;
    items: { variantId: string; quantity: number }[];
    saleType: SaleType;
    saleChannel: SaleChannel;
    downPayment?: number;
    paymentMethod: 'cash' | 'card' | 'transfer';
    paymentSplit?: PaymentSplit;
    nextPaymentDueDate?: string;
    notes?: string;
  }) => { success: boolean; sale?: Sale; error?: string };
  recordLayawayPayment: (data: {
    saleId: string;
    amount: number;
    paymentMethod: 'cash' | 'card' | 'transfer';
    notes?: string;
    nextPaymentDueDate?: string;
  }) => { success: boolean; error?: string };
  deliverLayaway: (saleId: string) => { success: boolean; error?: string };
  cancelLayaway: (saleId: string, reason?: string) => { success: boolean; error?: string };
  
  // Production & Workshop
  productionOrders: ProductionOrder[];
  activeTimerOrderId: string | null;
  startAssemblyTimer: (orderId: string) => void;
  stopAssemblyTimer: () => void;
  createProductionOrder: (order: {
    variantId: string;
    quantity: number;
    maxAllowedHours: number;
    channelWeight: number;
    targetDestination: LocationId;
  }) => void;
  completeProductionOrder: (orderId: string, targetDestination: LocationId) => void;
  
  // Logistics & Transfers
  transfers: InterLocationTransfer[];
  createTransfer: (data: {
    variantId: string;
    quantity: number;
    origin: LocationId;
    destination: LocationId;
  }) => { success: boolean; error?: string };
  confirmTransferReception: (transferId: string) => { success: boolean; error?: string };

  // Eventos y bazares
  events: KarmaEvent[];
  activeEventId: string | null; // Evento al que se atribuyen las ventas del punto de venta
  setActiveEventId: (eventId: string | null) => void;
  createEvent: (data: { name: string; date: string; startTime: string; endTime: string; address: string; notes?: string }) => { success: boolean; error?: string };
  setEventStatus: (eventId: string, status: KarmaEvent['status']) => void;

  // Pedidos CDMX (resurtidos desde AGS y pedidos de clientes)
  cdmxOrders: CdmxOrder[];
  createCdmxOrder: (data: {
    type: CdmxOrderType;
    items: { variantId: string; quantity: number }[];
    customerName?: string;
    customerPhone?: string;
    saleChannel?: SaleChannel;
    stockOrigin?: LocationId;
    notes?: string;
  }) => { success: boolean; error?: string };
  dispatchRestockOrder: (orderId: string) => { success: boolean; error?: string };
  receiveRestockOrder: (orderId: string) => { success: boolean; error?: string };
  deliverCustomerOrder: (orderId: string, paymentMethod: 'cash' | 'card' | 'transfer') => { success: boolean; error?: string };
  cancelCdmxOrder: (orderId: string) => { success: boolean; error?: string };
  
  // Shopify Sync & Webhook Simulator
  shopifyGraphQLBucket: number; // Max 1000
  mutationLogs: ShopifyGraphQLMutationLog[];
  webhookLogs: ShopifyWebhookEvent[];
  simulateIncomingShopifyOrder: (variantId: string, quantity: number) => void;
  triggerManualShopifySync: () => void;
  
  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Reset to initial
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Local storage keys
  const getStored = <T,>(key: string, defaultVal: T): T => {
    try {
      const item = localStorage.getItem(`karma_${key}`);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  // Quita registros de ejemplo que hayan quedado guardados de versiones anteriores
  const withoutDemo = <T,>(items: T[], idKey: keyof T): T[] =>
    items.filter(item => !REMOVED_DEMO_IDS.has(String(item[idKey])));

  const [users] = useState<User[]>(INITIAL_USERS);
  // La sesión solo existe si se inició con usuario y contraseña
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    INITIAL_USERS.some(u => u.user_id === localStorage.getItem('karma_session_user_id'))
  );
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem('karma_session_user_id');
    const found = INITIAL_USERS.find(u => u.user_id === savedId);
    return found || INITIAL_USERS.find(u => u.role === 'Karma') || INITIAL_USERS[0];
  });
  
  const [locations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [currentLocation, setCurrentLocation] = useState<LocationId>(() => {
    return (localStorage.getItem('karma_current_location') as LocationId) || 'AGS';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const stored = getStored<Product[]>('products', []).filter(p => !REMOVED_PRODUCT_IDS.includes(p.product_id));
    if (!stored || stored.length === 0) {
      return INITIAL_PRODUCTS;
    }

    // Create lookup of canonical products by variant SKU and product_id
    const canonicalBySku = new Map<string, Product>();
    INITIAL_PRODUCTS.forEach(p => {
      p.variants.forEach(v => {
        canonicalBySku.set(v.sku.toUpperCase(), p);
      });
    });

    // Merge: update stored product names, categories, descriptions, materials, and colors with canonical data
    // while keeping stored inventory levels (stock_ags, stock_cdmx, etc.) intact
    const updatedStored = stored.map(p => {
      const canonicalMatch = INITIAL_PRODUCTS.find(cp => cp.product_id === p.product_id) 
        || p.variants.map(v => canonicalBySku.get(v.sku.toUpperCase())).find(Boolean);
      
      if (!canonicalMatch) return p;

      return {
        ...p,
        name: canonicalMatch.name,
        category: canonicalMatch.category,
        material: canonicalMatch.material,
        color: canonicalMatch.color,
        description: canonicalMatch.description,
        variants: p.variants.map(v => {
          const matchVar = canonicalMatch.variants.find(cv => cv.sku.toUpperCase() === v.sku.toUpperCase());
          if (!matchVar) return v;
          return {
            ...v,
            title: matchVar.title,
            stone_charm: matchVar.stone_charm,
            color_alloy: matchVar.color_alloy,
            material: matchVar.material,
            unit_price: matchVar.unit_price,
            gender: matchVar.gender,
          };
        }),
      };
    });

    // Check if new CSV products are missing in stored array
    const storedSkus = new Set(updatedStored.flatMap(p => p.variants.map(v => v.sku.toUpperCase())));
    const missingProducts = INITIAL_PRODUCTS.filter(p => 
      p.variants.some(v => !storedSkus.has(v.sku.toUpperCase()))
    );
    if (missingProducts.length > 0) {
      return [...updatedStored, ...missingProducts];
    }
    return updatedStored;
  });
  const [customers, setCustomers] = useState<Customer[]>(() => withoutDemo(getStored('customers', INITIAL_CUSTOMERS), 'customer_id'));
  const [sales, setSales] = useState<Sale[]>(() => withoutDemo(getStored('sales', INITIAL_SALES), 'sale_id'));
  const [ledger, setLedger] = useState<InventoryLedgerEntry[]>(() => withoutDemo(getStored('ledger', INITIAL_LEDGER), 'ledger_id'));
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(() => withoutDemo(getStored('prod_orders', INITIAL_PRODUCTION_ORDERS), 'order_id'));
  const [transfers, setTransfers] = useState<InterLocationTransfer[]>(() => withoutDemo(getStored('transfers', INITIAL_TRANSFERS), 'transfer_id'));
  const [cdmxOrders, setCdmxOrders] = useState<CdmxOrder[]>(() => getStored('cdmx_orders', []));
  const [events, setEvents] = useState<KarmaEvent[]>(() => getStored('events', []));
  const [activeEventId, setActiveEventId] = useState<string | null>(() => localStorage.getItem('karma_active_event_id'));

  // Shopify sync bucket (1000 points) and logs
  const [shopifyGraphQLBucket, setShopifyGraphQLBucket] = useState<number>(1000);
  const [mutationLogs, setMutationLogs] = useState<ShopifyGraphQLMutationLog[]>(() => withoutDemo(getStored<ShopifyGraphQLMutationLog[]>('mutations', []), 'mutation_id'));

  const [webhookLogs, setWebhookLogs] = useState<ShopifyWebhookEvent[]>(() => withoutDemo(getStored<ShopifyWebhookEvent[]>('webhooks', []), 'webhook_id'));

  const [activeTimerOrderId, setActiveTimerOrderId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('karma_current_user_id', currentUser.user_id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('karma_current_location', currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    localStorage.setItem('karma_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('karma_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('karma_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('karma_ledger', JSON.stringify(ledger));
  }, [ledger]);

  useEffect(() => {
    localStorage.setItem('karma_prod_orders', JSON.stringify(productionOrders));
  }, [productionOrders]);

  useEffect(() => {
    localStorage.setItem('karma_transfers', JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem('karma_cdmx_orders', JSON.stringify(cdmxOrders));
  }, [cdmxOrders]);

  useEffect(() => {
    localStorage.setItem('karma_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (activeEventId) localStorage.setItem('karma_active_event_id', activeEventId);
    else localStorage.removeItem('karma_active_event_id');
  }, [activeEventId]);

  useEffect(() => {
    localStorage.setItem('karma_mutations', JSON.stringify(mutationLogs));
  }, [mutationLogs]);

  useEffect(() => {
    localStorage.setItem('karma_webhooks', JSON.stringify(webhookLogs));
  }, [webhookLogs]);

  // Shopify leaky bucket replenisher: leaks 50 points per second up to 1000 max
  useEffect(() => {
    const timer = setInterval(() => {
      setShopifyGraphQLBucket(prev => Math.min(1000, prev + 15));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Assembly timer ticker for active order
  useEffect(() => {
    if (!activeTimerOrderId) return;
    const interval = setInterval(() => {
      setProductionOrders(prev => prev.map(ord => {
        if (ord.order_id === activeTimerOrderId) {
          const newMins = ord.actual_assembly_minutes + 1;
          const newElapsedHours = +(ord.elapsed_hours + 1/60).toFixed(2);
          const newUrgency = +((newElapsedHours / ord.max_allowed_hours) * ord.channelWeight).toFixed(2);
          return {
            ...ord,
            actual_assembly_minutes: newMins,
            elapsed_hours: newElapsedHours,
            urgency_index: newUrgency,
            is_urgent: newUrgency >= 1.0,
          };
        }
        return ord;
      }));
    }, 3000); // 3-second simulation step for workshop clock
    return () => clearInterval(interval);
  }, [activeTimerOrderId]);

  // Toast Helpers
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Log an outgoing Shopify GraphQL mutation with bucket rate limiter
  const logShopifyMutation = (
    operation: 'inventoryAdjustQuantities' | 'inventoryTransfer',
    variantId: string,
    delta: number,
    locId: LocationId
  ) => {
    const locObj = locations.find(l => l.location_id === locId);
    const shopifyLoc = locObj ? locObj.shopify_location_id : 'gid://shopify/Location/654890123';
    const cost = 10;
    const newBucket = Math.max(0, shopifyGraphQLBucket - cost);
    setShopifyGraphQLBucket(newBucket);

    const logEntry: ShopifyGraphQLMutationLog = {
      mutation_id: `mut_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19),
      operation_name: operation,
      variant_id: variantId,
      location_id: shopifyLoc,
      quantity_delta: delta,
      cost_points: cost,
      bucket_points_remaining: newBucket,
      response_status: newBucket > 50 ? 'SUCCESS_200' : 'RATE_LIMITED_429',
    };
    setMutationLogs(prev => [logEntry, ...prev.slice(0, 40)]);
  };

  // Add customer
  const addCustomer = (data: Omit<Customer, 'customer_id' | 'registration_date'>): Customer => {
    const newCust: Customer = {
      ...data,
      customer_id: `cust_${Date.now().toString(36)}`,
      registration_date: new Date().toISOString().split('T')[0],
      credit_status: 'good',
    };
    setCustomers(prev => [newCust, ...prev]);
    addToast({
      type: 'success',
      title: 'Cliente Registrado',
      message: `${newCust.full_name} guardado en el directorio.`,
    });
    return newCust;
  };

  // Las contraseñas se guardan como SHA-256 de "usuario:contraseña"
  const hashPassword = async (username: string, pass: string) => {
    const data = new TextEncoder().encode(`${username}:${pass}`);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Auth: Login with credentials (username & password)
  const loginWithCredentials = async (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    const found = users.find(u => u.username.toLowerCase() === cleanUser);
    if (!found) {
      return { success: false, error: 'Usuario no encontrado en el sistema.' };
    }
    if (found.password_hash !== await hashPassword(found.username, pass)) {
      return { success: false, error: 'Contraseña incorrecta para este rol.' };
    }
    setCurrentUser(found);
    setIsAuthenticated(true);
    localStorage.setItem('karma_session_user_id', found.user_id);
    addToast({
      type: 'success',
      title: `Bienvenido, ${found.name}`,
      message: `Sesión iniciada con rol ${found.role}.`,
    });
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('karma_session_user_id');
    addToast({
      type: 'info',
      title: 'Sesión Finalizada',
      message: 'Has cerrado sesión exitosamente.',
    });
  };

  // Inventory: Add new specific product with variants & BOM
  const addNewProduct = (formData: NewProductFormData) => {
    const cleanSku = formData.sku.trim().toUpperCase();
    if (!cleanSku) {
      return { success: false, error: 'El SKU es obligatorio.' };
    }

    // Check duplicate SKU across existing variants
    for (const p of products) {
      const exists = p.variants.some(v => v.sku.toUpperCase() === cleanSku);
      if (exists) {
        return { success: false, error: `El SKU "${cleanSku}" ya existe en el inventario.` };
      }
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const prodId = `prod_${Date.now().toString(36)}`;
    const variantId = `var_${cleanSku.toLowerCase()}_${Date.now().toString(36).substr(2, 4)}`;

    const defaultImages = [
      'https://images.unsplash.com/photo-1611591475811-137812e96d11?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    ];
    const chosenImage = formData.imageUrl || defaultImages[Math.floor(Math.random() * defaultImages.length)];
    const unitCost = formData.unitCost ?? +(formData.price * 0.35).toFixed(2);

    const newProduct: Product = {
      product_id: prodId,
      name: formData.name.trim(),
      category: formData.category,
      gender: formData.gender,
      material: formData.material,
      color: formData.color,
      image_url: chosenImage,
      description: formData.description || `Joyería artesanal Karma: ${formData.name}. Material: ${formData.material}. Tonalidad: ${formData.color}.`,
      variants: [
        {
          variant_id: variantId,
          product_id: prodId,
          title: `${formData.material} / ${formData.color}`,
          sku: cleanSku,
          color_alloy: formData.color,
          stone_charm: formData.material,
          unit_price: formData.price,
          gender: formData.gender,
          material: formData.material,
          stock_ags: formData.stockAgs,
          stock_cdmx: formData.stockCdmx,
          stock_in_transit_cdmx: 0,
          stock_layaway_reserved: 0,
          stock_shopify_synced: formData.stockAgs + formData.stockCdmx,
          bom_items: [
            {
              material_id: `mat_${cleanSku.toLowerCase()}`,
              material_name: formData.material,
              quantity: 1,
              unit: 'pza',
              unit_cost: unitCost,
            },
          ],
          avg_assembly_minutes: 20,
          labor_minute_rate: 2.5,
        },
      ],
    };

    setProducts(prev => [newProduct, ...prev]);

    // Ledger audit entry if initial stock was provided
    const totalInitialStock = formData.stockAgs + formData.stockCdmx;
    if (totalInitialStock > 0) {
      const newEntries: InventoryLedgerEntry[] = [];
      if (formData.stockAgs > 0) {
        newEntries.push({
          ledger_id: `led_${Date.now()}_ags`,
          variant_id: variantId,
          variant_name: `${formData.name} (${cleanSku})`,
          location_id: 'AGS',
          quantity_change: formData.stockAgs,
          movement_reason: 'production',
          reference_id: `ALTA-${cleanSku}`,
          user_id: currentUser.user_id,
          created_at: nowStr,
          notes: `Alta de nuevo producto en catálogo matriz por ${currentUser.name}.`,
        });
        logShopifyMutation('inventoryAdjustQuantities', variantId, formData.stockAgs, 'AGS');
      }
      if (formData.stockCdmx > 0) {
        newEntries.push({
          ledger_id: `led_${Date.now()}_cdmx`,
          variant_id: variantId,
          variant_name: `${formData.name} (${cleanSku})`,
          location_id: 'CDMX',
          quantity_change: formData.stockCdmx,
          movement_reason: 'production',
          reference_id: `ALTA-${cleanSku}`,
          user_id: currentUser.user_id,
          created_at: nowStr,
          notes: `Alta de stock inicial en CDMX por ${currentUser.name}.`,
        });
        logShopifyMutation('inventoryAdjustQuantities', variantId, formData.stockCdmx, 'CDMX');
      }
      setLedger(prev => [...newEntries, ...prev]);
    }

    addToast({
      type: 'success',
      title: 'Producto Agregado',
      message: `${formData.name} (${cleanSku}) añadido exitosamente con stock y variante.`,
    });

    return { success: true, product: newProduct };
  };

  // Inventory: Add stock to existing variant with ACID ledger entry
  const addStockToVariant = (variantId: string, location: LocationId, quantity: number, notes?: string) => {
    if (quantity <= 0) {
      return { success: false, error: 'La cantidad debe ser mayor a 0.' };
    }

    let foundVar: { product: Product; variant: any } | null = null;
    for (const p of products) {
      const v = p.variants.find(vr => vr.variant_id === variantId);
      if (v) {
        foundVar = { product: p, variant: v };
        break;
      }
    }

    if (!foundVar) {
      return { success: false, error: 'Variante no encontrada.' };
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);

    setProducts(prev => prev.map(p => {
      if (p.product_id !== foundVar!.product.product_id) return p;
      return {
        ...p,
        variants: p.variants.map(v => {
          if (v.variant_id !== variantId) return v;
          const newAgs = location === 'AGS' ? v.stock_ags + quantity : v.stock_ags;
          const newCdmx = location === 'CDMX' ? v.stock_cdmx + quantity : v.stock_cdmx;
          return {
            ...v,
            stock_ags: newAgs,
            stock_cdmx: newCdmx,
            stock_shopify_synced: v.stock_shopify_synced + quantity,
          };
        }),
      };
    }));

    const ledgerEntry: InventoryLedgerEntry = {
      ledger_id: `led_${Date.now()}_add`,
      variant_id: variantId,
      variant_name: `${foundVar.product.name} (${foundVar.variant.sku})`,
      location_id: location,
      quantity_change: quantity,
      movement_reason: 'production',
      reference_id: `ENTRADA-${foundVar.variant.sku}`,
      user_id: currentUser.user_id,
      created_at: nowStr,
      notes: notes || `Entrada de inventario registrada por ${currentUser.name} en ${location}.`,
    };

    setLedger(prev => [ledgerEntry, ...prev]);
    logShopifyMutation('inventoryAdjustQuantities', variantId, quantity, location);

    addToast({
      type: 'success',
      title: 'Inventario Añadido',
      message: `+${quantity} pzas añadidas a ${foundVar.product.name} (${location}).`,
    });

    return { success: true };
  };

  // Find variant helper
  const findVariant = (variantId: string) => {
    for (const p of products) {
      const v = p.variants.find(vr => vr.variant_id === variantId);
      if (v) return { product: p, variant: v };
    }
    return null;
  };

  // Process a sale (Direct Sale or Layaway Apartado)
  const processSale = (data: {
    customerId?: string;
    items: { variantId: string; quantity: number }[];
    saleType: SaleType;
    saleChannel: SaleChannel;
    downPayment?: number;
    paymentMethod: 'cash' | 'card' | 'transfer';
    paymentSplit?: PaymentSplit;
    nextPaymentDueDate?: string;
    notes?: string;
  }) => {
    // Validate stock for items at currentLocation
    for (const item of data.items) {
      const found = findVariant(item.variantId);
      if (!found) return { success: false, error: 'Variante no encontrada.' };
      const currentStock = currentLocation === 'AGS' ? found.variant.stock_ags : found.variant.stock_cdmx;
      if (currentStock < item.quantity) {
        return { 
          success: false, 
          error: `Stock insuficiente para ${found.product.name} (${found.variant.title}). Disponible: ${currentStock}` 
        };
      }
    }

    if (data.saleType === 'layaway' && !data.customerId) {
      return { success: false, error: 'Para apartados a plazos se requiere registrar los datos del cliente.' };
    }

    const saleId = `sale_${Date.now()}`;
    const folioNumber = Math.floor(1000 + Math.random() * 9000);
    const folio = `FOL-${currentLocation}-${folioNumber}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);

    let totalAmount = 0;
    const saleItems = data.items.map((item, idx) => {
      const { product, variant } = findVariant(item.variantId)!;
      // Calculate unit cost from BOM + labor
      const bomCost = variant.bom_items.reduce((acc, b) => acc + (b.quantity * b.unit_cost), 0);
      const laborCost = variant.avg_assembly_minutes * variant.labor_minute_rate;
      const unitCost = +(bomCost + laborCost).toFixed(2);
      
      const lineTotal = variant.unit_price * item.quantity;
      totalAmount += lineTotal;

      return {
        sale_item_id: `item_${saleId}_${idx}`,
        sale_id: saleId,
        variant_id: item.variantId,
        product_name: product.name,
        variant_title: variant.title,
        sku: variant.sku,
        category: product.category,
        quantity: item.quantity,
        unit_price: variant.unit_price,
        unit_cost: unitCost,
      };
    });

    const isLayaway = data.saleType === 'layaway';
    const downPayment = isLayaway ? (data.downPayment || 0) : totalAmount;
    const balanceDue = totalAmount - downPayment;
    const initialStatus = isLayaway ? 'active_layaway' : 'completed';

    // Pago con un solo método, o mixto (una línea de pago por cada método usado)
    const splitEntries = data.paymentSplit
      ? (['cash', 'card', 'transfer'] as const)
          .map(method => ({ method, amount: +(data.paymentSplit![method] || 0).toFixed(2) }))
          .filter(e => e.amount > 0)
      : [{ method: data.paymentMethod, amount: downPayment }];

    if (data.paymentSplit) {
      const splitTotal = splitEntries.reduce((acc, e) => acc + e.amount, 0);
      if (Math.abs(splitTotal - downPayment) > 0.009) {
        return {
          success: false,
          error: `El pago mixto suma $${splitTotal.toFixed(2)} y debe ser $${downPayment.toFixed(2)}.`,
        };
      }
    }

    const payments = splitEntries.map((entry, idx) => ({
      payment_id: `pay_${saleId}_${idx + 1}`,
      sale_id: saleId,
      user_id: currentUser.user_id,
      amount_paid: entry.amount,
      payment_date: nowStr,
      payment_method: entry.method,
      receipt_folio: `REC-${folioNumber}-${isLayaway ? 'ENGANCHE' : 'LIQUIDADO'}${splitEntries.length > 1 ? `-${idx + 1}` : ''}`,
      notes: data.notes || (isLayaway ? 'Enganche inicial de apartado a plazos.' : 'Venta directa en mostrador.'),
    }));

    // Si hay un evento activo, la venta queda atribuida a ese evento
    const saleEvent = events.find(ev => ev.event_id === activeEventId && ev.status === 'Activo');

    const newSale: Sale = {
      sale_id: saleId,
      folio,
      user_id: currentUser.user_id,
      user_name: currentUser.name,
      customer_id: data.customerId,
      location_id: currentLocation,
      event_id: saleEvent?.event_id,
      event_name: saleEvent?.name,
      sale_type: data.saleType,
      sale_channel: data.saleChannel,
      total_amount: totalAmount,
      amount_paid: downPayment,
      balance_due: balanceDue,
      down_payment: downPayment,
      status: initialStatus,
      created_at: nowStr,
      next_payment_due_date: isLayaway ? (data.nextPaymentDueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]) : undefined,
      items: saleItems,
      payments,
    };

    // Ledger entries and Shopify sync are built outside the state updater so they are recorded exactly once
    const ledgerEntries: InventoryLedgerEntry[] = data.items.map(item => {
      const { product, variant } = findVariant(item.variantId)!;
      logShopifyMutation('inventoryAdjustQuantities', variant.variant_id, -item.quantity, currentLocation);
      return {
        ledger_id: `led_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        variant_id: variant.variant_id,
        variant_name: `${product.name} (${variant.title})`,
        location_id: currentLocation,
        quantity_change: -item.quantity,
        movement_reason: isLayaway ? 'layaway_hold' : 'sale',
        reference_id: folio,
        user_id: currentUser.user_id,
        created_at: nowStr,
        notes: isLayaway
          ? `Apartado reservado. Se descuenta de Shopify para impedir venta online duplicada.`
          : `Venta física procesada por ${currentUser.name}.`,
      };
    });

    // Update product stock
    setProducts(prev => prev.map(p => {
      const updatedVariants = p.variants.map(v => {
        const matchingItem = data.items.find(i => i.variantId === v.variant_id);
        if (!matchingItem) return v;

        const qty = matchingItem.quantity;
        const newStockAgs = currentLocation === 'AGS' ? v.stock_ags - qty : v.stock_ags;
        const newStockCdmx = currentLocation === 'CDMX' ? v.stock_cdmx - qty : v.stock_cdmx;
        const newLayawayReserved = isLayaway ? v.stock_layaway_reserved + qty : v.stock_layaway_reserved;
        // Online vendible stock in Shopify decreases by qty (whether direct or layaway hold)
        const newShopifySynced = Math.max(0, v.stock_shopify_synced - qty);

        return {
          ...v,
          stock_ags: newStockAgs,
          stock_cdmx: newStockCdmx,
          stock_layaway_reserved: newLayawayReserved,
          stock_shopify_synced: newShopifySynced,
        };
      });
      return { ...p, variants: updatedVariants };
    }));

    setLedger(prev => [...ledgerEntries, ...prev]);
    setSales(prev => [newSale, ...prev]);

    addToast({
      type: 'success',
      title: isLayaway ? 'Apartado Registrado' : 'Venta Exitosa',
      message: `${folio} por $${totalAmount.toFixed(2)} MXN (${isLayaway ? `Enganche: $${downPayment}` : 'Liquidado'}). Shopify sincronizado.`,
    });

    return { success: true, sale: newSale };
  };

  // Record Layaway payment (Abono)
  const recordLayawayPayment = (data: {
    saleId: string;
    amount: number;
    paymentMethod: 'cash' | 'card' | 'transfer';
    notes?: string;
    nextPaymentDueDate?: string;
  }) => {
    const sale = sales.find(s => s.sale_id === data.saleId);
    if (!sale) return { success: false, error: 'Apartado no encontrado.' };
    if (sale.status !== 'active_layaway') return { success: false, error: 'El apartado ya no está activo.' };
    if (data.amount <= 0) return { success: false, error: 'El monto del abono debe ser mayor a 0.' };

    const newAmountPaid = sale.amount_paid + data.amount;
    const newBalanceDue = Math.max(0, sale.total_amount - newAmountPaid);
    const isNowFullyPaid = newBalanceDue === 0;
    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const receiptFolio = `ABO-${sale.folio.replace('FOL-', '')}-${sale.payments.length + 1}`;

    const newPayment = {
      payment_id: `pay_${Date.now()}`,
      sale_id: sale.sale_id,
      user_id: currentUser.user_id,
      amount_paid: data.amount,
      payment_date: nowStr,
      payment_method: data.paymentMethod,
      receipt_folio: receiptFolio,
      notes: data.notes || `Abono de cuota a plazos registrado por ${currentUser.name}`,
    };

    setSales(prev => prev.map(s => {
      if (s.sale_id === data.saleId) {
        return {
          ...s,
          amount_paid: newAmountPaid,
          balance_due: newBalanceDue,
          status: isNowFullyPaid ? 'completed' : 'active_layaway',
          next_payment_due_date: isNowFullyPaid ? undefined : (data.nextPaymentDueDate || s.next_payment_due_date),
          payments: [...s.payments, newPayment],
        };
      }
      return s;
    }));

    addToast({
      type: 'success',
      title: isNowFullyPaid ? 'Apartado Liquidado al 100%' : 'Abono Registrado',
      message: `Folio ${receiptFolio}: Se recibieron $${data.amount} MXN. Saldo restante: $${newBalanceDue.toFixed(2)} MXN.`,
    });

    return { success: true };
  };

  // Deliver layaway (release reserved stock to customer when balance is 0)
  const deliverLayaway = (saleId: string) => {
    const sale = sales.find(s => s.sale_id === saleId);
    if (!sale) return { success: false, error: 'Venta no encontrada.' };
    if (sale.balance_due > 0) return { success: false, error: 'No se puede entregar un apartado con saldo pendiente.' };

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);

    // Release stock from layaway reserved
    setProducts(prev => prev.map(p => {
      const updatedVariants = p.variants.map(v => {
        const item = sale.items.find(i => i.variant_id === v.variant_id);
        if (!item) return v;
        return {
          ...v,
          stock_layaway_reserved: Math.max(0, v.stock_layaway_reserved - item.quantity),
        };
      });
      return { ...p, variants: updatedVariants };
    }));

    setSales(prev => prev.map(s => {
      if (s.sale_id === saleId) {
        return { ...s, status: 'delivered' };
      }
      return s;
    }));

    const ledgerEntries = sale.items.map(item => ({
      ledger_id: `led_${Date.now()}_deliv_${Math.random().toString(36).substr(2, 4)}`,
      variant_id: item.variant_id,
      variant_name: `${item.product_name} (${item.variant_title})`,
      location_id: sale.location_id,
      quantity_change: 0,
      movement_reason: 'layaway_delivered' as const,
      reference_id: sale.folio,
      user_id: currentUser.user_id,
      created_at: nowStr,
      notes: `Entrega física de joyas al cliente. Apartado 100% saldado y liberado del almacén reservado.`,
    }));
    setLedger(prev => [...ledgerEntries, ...prev]);

    addToast({
      type: 'success',
      title: 'Apartado Entregado',
      message: `Piezas liberadas físicamente al cliente para el folio ${sale.folio}.`,
    });

    return { success: true };
  };

  // Cancel layaway (restore stock to available inventory and restore to Shopify)
  const cancelLayaway = (saleId: string, reason?: string) => {
    const sale = sales.find(s => s.sale_id === saleId);
    if (!sale) return { success: false, error: 'Apartado no encontrado.' };

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const ledgerEntries: InventoryLedgerEntry[] = sale.items.map(item => {
      logShopifyMutation('inventoryAdjustQuantities', item.variant_id, item.quantity, sale.location_id);
      return {
        ledger_id: `led_${Date.now()}_cancel_${Math.random().toString(36).substr(2, 4)}`,
        variant_id: item.variant_id,
        variant_name: `${item.product_name} (${item.variant_title})`,
        location_id: sale.location_id,
        quantity_change: item.quantity,
        movement_reason: 'layaway_cancelled_release',
        reference_id: sale.folio,
        user_id: currentUser.user_id,
        created_at: nowStr,
        notes: `Apartado cancelado (${reason || 'Incumplimiento/plazo vencido'}). Stock devuelto a disponibles y sincronizado a Shopify.`,
      };
    });

    setProducts(prev => prev.map(p => {
      const updatedVariants = p.variants.map(v => {
        const item = sale.items.find(i => i.variant_id === v.variant_id);
        if (!item) return v;

        const qty = item.quantity;
        const newStockAgs = sale.location_id === 'AGS' ? v.stock_ags + qty : v.stock_ags;
        const newStockCdmx = sale.location_id === 'CDMX' ? v.stock_cdmx + qty : v.stock_cdmx;
        const newReserved = Math.max(0, v.stock_layaway_reserved - qty);
        const newShopify = v.stock_shopify_synced + qty;

        return {
          ...v,
          stock_ags: newStockAgs,
          stock_cdmx: newStockCdmx,
          stock_layaway_reserved: newReserved,
          stock_shopify_synced: newShopify,
        };
      });
      return { ...p, variants: updatedVariants };
    }));

    setSales(prev => prev.map(s => {
      if (s.sale_id === saleId) {
        return { ...s, status: 'cancelled' };
      }
      return s;
    }));

    setLedger(prev => [...ledgerEntries, ...prev]);

    addToast({
      type: 'warning',
      title: 'Apartado Cancelado',
      message: `Se reintegraron las piezas de ${sale.folio} a stock disponible y Shopify.`,
    });

    return { success: true };
  };

  // Production Timer controls
  const startAssemblyTimer = (orderId: string) => {
    setActiveTimerOrderId(orderId);
    setProductionOrders(prev => prev.map(ord => {
      if (ord.order_id === orderId) {
        return { ...ord, status: 'in_assembly', artisan_name: currentUser.name };
      }
      return ord;
    }));
    addToast({
      type: 'info',
      title: 'Cronómetro Taller Activo',
      message: `Ensamblando orden ${orderId}. Registrando minutos cronometrados exactos.`,
    });
  };

  const stopAssemblyTimer = () => {
    setActiveTimerOrderId(null);
    addToast({
      type: 'info',
      title: 'Cronómetro en Pausa',
      message: 'Tiempo de elaboración actualizado en el registro de manufactura.',
    });
  };

  // Create Production Order
  const createProductionOrder = (data: {
    variantId: string;
    quantity: number;
    maxAllowedHours: number;
    channelWeight: number;
    targetDestination: LocationId;
  }) => {
    const found = findVariant(data.variantId);
    if (!found) return;

    const orderId = `ord_prod_${Date.now().toString(36)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const elapsedHours = 1;
    const urgency = +((elapsedHours / data.maxAllowedHours) * data.channelWeight).toFixed(2);

    const newOrder: ProductionOrder = {
      order_id: orderId,
      variant_id: data.variantId,
      product_name: found.product.name,
      variant_title: found.variant.title,
      quantity: data.quantity,
      color_variant: found.variant.color_alloy,
      stone_variant: found.variant.stone_charm,
      elapsed_hours: elapsedHours,
      max_allowed_hours: data.maxAllowedHours,
      channel_weight: data.channelWeight,
      urgency_index: urgency,
      is_urgent: urgency >= 1.0,
      status: 'pending',
      created_at: nowStr,
      artisan_name: currentUser.name,
      actual_assembly_minutes: found.variant.avg_assembly_minutes,
      target_destination: data.targetDestination,
    };

    setProductionOrders(prev => [newOrder, ...prev]);
    addToast({
      type: 'success',
      title: 'Orden de Producción Creada',
      message: `Lote de ${data.quantity} pzas para ${found.product.name}. Urgencia inicial: ${urgency}.`,
    });
  };

  // Complete Production Order & Dispatch logic:
  // If destination is AGS: local inventory increases immediately and POS sends update to Shopify.
  // If destination is CDMX: pieces are placed under "Inventario en Tránsito" and Shopify Transfer is created.
  const completeProductionOrder = (orderId: string, targetDestination: LocationId) => {
    const order = productionOrders.find(o => o.order_id === orderId);
    if (!order) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const qty = order.quantity;

    if (activeTimerOrderId === orderId) {
      setActiveTimerOrderId(null);
    }

    if (targetDestination === 'AGS') {
      // Immediate available in AGS & Shopify update
      setProducts(prev => prev.map(p => {
        const updatedVariants = p.variants.map(v => {
          if (v.variant_id !== order.variant_id) return v;
          return {
            ...v,
            stock_ags: v.stock_ags + qty,
            stock_shopify_synced: v.stock_shopify_synced + qty,
          };
        });
        return { ...p, variants: updatedVariants };
      }));

      const ledgerEntry: InventoryLedgerEntry = {
        ledger_id: `led_${Date.now()}_prod_${Math.random().toString(36).substr(2, 4)}`,
        variant_id: order.variant_id,
        variant_name: `${order.product_name} (${order.variant_title})`,
        location_id: 'AGS',
        quantity_change: qty,
        movement_reason: 'production',
        reference_id: order.order_id,
        user_id: currentUser.user_id,
        created_at: nowStr,
        notes: `Producción artesanal completada por ${currentUser.name}. Stock ingresado directamente a matriz AGS y Shopify.`,
      };
      setLedger(prev => [ledgerEntry, ...prev]);

      logShopifyMutation('inventoryAdjustQuantities', order.variant_id, qty, 'AGS');

      addToast({
        type: 'success',
        title: 'Producción Finalizada -> Aguascalientes',
        message: `+${qty} unidades disponibles de inmediato en AGS y sincronizadas a Shopify.`,
      });
    } else {
      // Destination is CDMX -> In transit
      setProducts(prev => prev.map(p => {
        const updatedVariants = p.variants.map(v => {
          if (v.variant_id !== order.variant_id) return v;
          return {
            ...v,
            stock_in_transit_cdmx: v.stock_in_transit_cdmx + qty,
          };
        });
        return { ...p, variants: updatedVariants };
      }));

      const transferFolio = `TRF-PROD-CDMX-${Math.floor(100 + Math.random() * 900)}`;
      const newTransfer: InterLocationTransfer = {
        transfer_id: `trf_${Date.now()}`,
        folio: transferFolio,
        origin_location: 'AGS',
        destination_location: 'CDMX',
        variant_id: order.variant_id,
        product_name: order.product_name,
        variant_title: order.variant_title,
        quantity: qty,
        status: 'in_transit',
        dispatched_at: nowStr,
        dispatched_by: currentUser.name,
      };
      setTransfers(prev => [newTransfer, ...prev]);

      const ledgerEntry: InventoryLedgerEntry = {
        ledger_id: `led_${Date.now()}_transit_${Math.random().toString(36).substr(2, 4)}`,
        variant_id: order.variant_id,
        variant_name: `${order.product_name} (${order.variant_title})`,
        location_id: 'CDMX',
        quantity_change: qty,
        movement_reason: 'transfer_out',
        reference_id: transferFolio,
        user_id: currentUser.user_id,
        created_at: nowStr,
        notes: `Lote artesanal enviado a CDMX. Estado: Inventario en Tránsito. Requiere confirmación física en destino.`,
      };
      setLedger(prev => [ledgerEntry, ...prev]);

      logShopifyMutation('inventoryTransfer', order.variant_id, qty, 'CDMX');

      addToast({
        type: 'info',
        title: 'Producción Finalizada -> CDMX (En Tránsito)',
        message: `${qty} pzas registradas en tránsito con folio ${transferFolio}. No vendibles hasta confirmar en CDMX.`,
      });
    }

    setProductionOrders(prev => prev.map(o => {
      if (o.order_id === orderId) {
        return {
          ...o,
          status: targetDestination === 'AGS' ? 'dispatched_ags' : 'in_transit_cdmx',
        };
      }
      return o;
    }));
  };

  // Inter-location transfers (e.g. from AGS stock to CDMX stock)
  const createTransfer = (data: {
    variantId: string;
    quantity: number;
    origin: LocationId;
    destination: LocationId;
  }) => {
    const found = findVariant(data.variantId);
    if (!found) return { success: false, error: 'Variante no encontrada.' };

    const originStock = data.origin === 'AGS' ? found.variant.stock_ags : found.variant.stock_cdmx;
    if (originStock < data.quantity) {
      return { success: false, error: `Stock insuficiente en ${data.origin}. Disponible: ${originStock}` };
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const folio = `TRF-${data.origin}-${data.destination}-${Math.floor(100 + Math.random() * 900)}`;

    // Decrement origin, add to in_transit
    setProducts(prev => prev.map(p => {
      const updatedVariants = p.variants.map(v => {
        if (v.variant_id !== data.variantId) return v;
        const newAgs = data.origin === 'AGS' ? v.stock_ags - data.quantity : v.stock_ags;
        const newCdmx = data.origin === 'CDMX' ? v.stock_cdmx - data.quantity : v.stock_cdmx;
        const newTransit = data.destination === 'CDMX' ? v.stock_in_transit_cdmx + data.quantity : v.stock_in_transit_cdmx;
        return {
          ...v,
          stock_ags: newAgs,
          stock_cdmx: newCdmx,
          stock_in_transit_cdmx: newTransit,
        };
      });
      return { ...p, variants: updatedVariants };
    }));

    const newTransfer: InterLocationTransfer = {
      transfer_id: `trf_${Date.now()}`,
      folio,
      origin_location: data.origin,
      destination_location: data.destination,
      variant_id: data.variantId,
      product_name: found.product.name,
      variant_title: found.variant.title,
      quantity: data.quantity,
      status: 'in_transit',
      dispatched_at: nowStr,
      dispatched_by: currentUser.name,
    };
    setTransfers(prev => [newTransfer, ...prev]);

    const ledgerEntry: InventoryLedgerEntry = {
      ledger_id: `led_${Date.now()}_trf_${Math.random().toString(36).substr(2, 4)}`,
      variant_id: data.variantId,
      variant_name: `${found.product.name} (${found.variant.title})`,
      location_id: data.origin,
      quantity_change: -data.quantity,
      movement_reason: 'transfer_out',
      reference_id: folio,
      user_id: currentUser.user_id,
      created_at: nowStr,
      notes: `Transferencia inter-sede hacia ${data.destination}. En tránsito.`,
    };
    setLedger(prev => [ledgerEntry, ...prev]);

    logShopifyMutation('inventoryTransfer', data.variantId, data.quantity, data.destination);

    addToast({
      type: 'info',
      title: 'Transferencia Despachada',
      message: `${data.quantity} piezas en camino a ${data.destination} (${folio}).`,
    });

    return { success: true };
  };

  // Confirm transfer reception at destination (releases into vendible inventory)
  const confirmTransferReception = (transferId: string) => {
    const transfer = transfers.find(t => t.transfer_id === transferId);
    if (!transfer) return { success: false, error: 'Transferencia no encontrada.' };
    if (transfer.status !== 'in_transit') return { success: false, error: 'La transferencia ya fue recibida.' };

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);

    setProducts(prev => prev.map(p => {
      const updatedVariants = p.variants.map(v => {
        if (v.variant_id !== transfer.variant_id) return v;
        const newTransit = transfer.destination_location === 'CDMX' 
          ? Math.max(0, v.stock_in_transit_cdmx - transfer.quantity) 
          : v.stock_in_transit_cdmx;
        const newCdmx = transfer.destination_location === 'CDMX'
          ? v.stock_cdmx + transfer.quantity
          : v.stock_cdmx;
        const newAgs = transfer.destination_location === 'AGS'
          ? v.stock_ags + transfer.quantity
          : v.stock_ags;
        const newShopify = v.stock_shopify_synced + transfer.quantity;

        return {
          ...v,
          stock_in_transit_cdmx: newTransit,
          stock_cdmx: newCdmx,
          stock_ags: newAgs,
          stock_shopify_synced: newShopify,
        };
      });
      return { ...p, variants: updatedVariants };
    }));

    setTransfers(prev => prev.map(t => {
      if (t.transfer_id === transferId) {
        return {
          ...t,
          status: 'received',
          received_at: nowStr,
          received_by: currentUser.name,
        };
      }
      return t;
    }));

    const ledgerEntry: InventoryLedgerEntry = {
      ledger_id: `led_${Date.now()}_rec_${Math.random().toString(36).substr(2, 4)}`,
      variant_id: transfer.variant_id,
      variant_name: `${transfer.product_name} (${transfer.variant_title})`,
      location_id: transfer.destination_location,
      quantity_change: transfer.quantity,
      movement_reason: 'transfer_in',
      reference_id: transfer.folio,
      user_id: currentUser.user_id,
      created_at: nowStr,
      notes: `Recepción física confirmada por ${currentUser.name} en ${transfer.destination_location}. Stock ahora vendible.`,
    };
    setLedger(prev => [ledgerEntry, ...prev]);

    logShopifyMutation('inventoryAdjustQuantities', transfer.variant_id, transfer.quantity, transfer.destination_location);

    addToast({
      type: 'success',
      title: 'Recepción Física Confirmada',
      message: `${transfer.quantity} pzas liberadas para venta en ${transfer.destination_location} (${transfer.folio}).`,
    });

    return { success: true };
  };

  // ───────────────────────── Eventos ─────────────────────────
  const createEvent = (data: { name: string; date: string; startTime: string; endTime: string; address: string; notes?: string }) => {
    if (!data.name.trim()) return { success: false, error: 'Escribe el nombre del evento.' };
    if (!data.date) return { success: false, error: 'Selecciona la fecha del evento.' };
    if (!data.startTime || !data.endTime) return { success: false, error: 'Indica la hora de inicio y de fin.' };
    if (data.endTime <= data.startTime) return { success: false, error: 'La hora de fin debe ser posterior a la de inicio.' };
    if (!data.address.trim()) return { success: false, error: 'Escribe la dirección del evento.' };

    const newEvent: KarmaEvent = {
      event_id: `evt_${Date.now()}`,
      name: data.name.trim(),
      date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      address: data.address.trim(),
      status: 'Activo',
      notes: data.notes?.trim() || undefined,
      created_at: new Date().toISOString().replace('T', ' ').substr(0, 19),
      created_by: currentUser.name,
    };
    setEvents(prev => [newEvent, ...prev]);
    addToast({ type: 'success', title: 'Evento Creado', message: `${newEvent.name} ya se puede seleccionar en el punto de venta.` });
    return { success: true };
  };

  const setEventStatus = (eventId: string, status: KarmaEvent['status']) => {
    setEvents(prev => prev.map(ev => ev.event_id === eventId ? { ...ev, status } : ev));
    // Un evento finalizado deja de recibir ventas
    if (status === 'Finalizado' && activeEventId === eventId) setActiveEventId(null);
  };

  // ───────────────────────── Pedidos CDMX ─────────────────────────
  const stockAt = (v: { stock_ags: number; stock_cdmx: number }, loc: LocationId) =>
    loc === 'AGS' ? v.stock_ags : v.stock_cdmx;

  // Aplica cambios de existencias por variante: { variantId: { ags, cdmx, transit, reserved, shopify } }
  type StockDelta = { ags?: number; cdmx?: number; transit?: number; reserved?: number; shopify?: number };
  const applyStockDeltas = (deltas: Record<string, StockDelta>) => {
    setProducts(prev => prev.map(p => ({
      ...p,
      variants: p.variants.map(v => {
        const d = deltas[v.variant_id];
        if (!d) return v;
        return {
          ...v,
          stock_ags: v.stock_ags + (d.ags || 0),
          stock_cdmx: v.stock_cdmx + (d.cdmx || 0),
          stock_in_transit_cdmx: Math.max(0, v.stock_in_transit_cdmx + (d.transit || 0)),
          stock_layaway_reserved: Math.max(0, v.stock_layaway_reserved + (d.reserved || 0)),
          stock_shopify_synced: Math.max(0, v.stock_shopify_synced + (d.shopify || 0)),
        };
      }),
    })));
  };

  const orderLedgerEntries = (
    order: CdmxOrder,
    location: LocationId,
    sign: 1 | -1,
    reason: InventoryMovementReason,
    notes: string,
    nowStr: string
  ): InventoryLedgerEntry[] => order.items.map(item => ({
    ledger_id: `led_${Date.now()}_ped_${Math.random().toString(36).substr(2, 5)}`,
    variant_id: item.variant_id,
    variant_name: `${item.product_name} (${item.sku})`,
    location_id: location,
    quantity_change: sign * item.quantity,
    movement_reason: reason,
    reference_id: order.folio,
    user_id: currentUser.user_id,
    created_at: nowStr,
    notes,
  }));

  const createCdmxOrder = (data: {
    type: CdmxOrderType;
    items: { variantId: string; quantity: number }[];
    customerName?: string;
    customerPhone?: string;
    saleChannel?: SaleChannel;
    stockOrigin?: LocationId;
    notes?: string;
  }) => {
    if (data.items.length === 0) return { success: false, error: 'Agrega al menos un producto al pedido.' };
    if (data.items.some(i => i.quantity <= 0)) return { success: false, error: 'Las cantidades deben ser mayores a 0.' };

    const isCustomer = data.type === 'customer';
    const origin: LocationId = data.stockOrigin || 'AGS';
    if (isCustomer && !data.customerName?.trim()) {
      return { success: false, error: 'Escribe el nombre del cliente.' };
    }

    const items: CdmxOrderItem[] = [];
    for (const i of data.items) {
      const found = findVariant(i.variantId);
      if (!found) return { success: false, error: 'Producto no encontrado.' };
      // El pedido de cliente aparta stock al crearse; el resurtido solo lo valida al surtir
      if (isCustomer && stockAt(found.variant, origin) < i.quantity) {
        return {
          success: false,
          error: `Stock insuficiente de ${found.product.name} en ${origin}. Disponible: ${stockAt(found.variant, origin)}`,
        };
      }
      items.push({
        variant_id: i.variantId,
        product_name: found.product.name,
        variant_title: found.variant.title,
        sku: found.variant.sku,
        quantity: i.quantity,
        unit_price: found.variant.unit_price,
      });
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const order: CdmxOrder = {
      order_id: `ped_${Date.now()}`,
      folio: `${isCustomer ? 'PED' : 'RES'}-CDMX-${Math.floor(1000 + Math.random() * 9000)}`,
      type: data.type,
      status: 'pending',
      items,
      total_amount: items.reduce((acc, i) => acc + i.unit_price * i.quantity, 0),
      customer_name: isCustomer ? data.customerName!.trim() : undefined,
      customer_phone: isCustomer ? data.customerPhone?.trim() : undefined,
      sale_channel: isCustomer ? (data.saleChannel || 'whatsapp') : undefined,
      stock_origin: isCustomer ? origin : undefined,
      notes: data.notes?.trim() || undefined,
      created_at: nowStr,
      created_by: currentUser.name,
    };

    if (isCustomer) {
      const deltas: Record<string, StockDelta> = {};
      items.forEach(i => {
        deltas[i.variant_id] = origin === 'AGS'
          ? { ags: -i.quantity, reserved: i.quantity, shopify: -i.quantity }
          : { cdmx: -i.quantity, reserved: i.quantity, shopify: -i.quantity };
      });
      applyStockDeltas(deltas);
      setLedger(prev => [
        ...orderLedgerEntries(order, origin, -1, 'layaway_hold', `Pedido de cliente CDMX (${order.customer_name}). Stock apartado en ${origin}.`, nowStr),
        ...prev,
      ]);
    }

    setCdmxOrders(prev => [order, ...prev]);
    addToast({
      type: 'success',
      title: isCustomer ? 'Pedido de Cliente Registrado' : 'Resurtido Solicitado',
      message: isCustomer
        ? `${order.folio}: stock apartado en ${origin} para ${order.customer_name}.`
        : `${order.folio}: pendiente de surtir desde Aguascalientes.`,
    });
    return { success: true };
  };

  // Resurtido: AGS surte y envía → sale de AGS y queda en tránsito a CDMX
  const dispatchRestockOrder = (orderId: string) => {
    const order = cdmxOrders.find(o => o.order_id === orderId);
    if (!order || order.type !== 'restock') return { success: false, error: 'Resurtido no encontrado.' };
    if (order.status !== 'pending') return { success: false, error: 'Este resurtido ya fue enviado.' };

    for (const item of order.items) {
      const found = findVariant(item.variant_id);
      if (!found) return { success: false, error: `${item.product_name} ya no existe en el catálogo.` };
      if (found.variant.stock_ags < item.quantity) {
        return { success: false, error: `Stock insuficiente en AGS de ${item.product_name}. Disponible: ${found.variant.stock_ags}` };
      }
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const deltas: Record<string, StockDelta> = {};
    order.items.forEach(i => { deltas[i.variant_id] = { ags: -i.quantity, transit: i.quantity }; });
    applyStockDeltas(deltas);
    setLedger(prev => [
      ...orderLedgerEntries(order, 'AGS', -1, 'transfer_out', 'Resurtido enviado a CDMX. En tránsito.', nowStr),
      ...prev,
    ]);
    setCdmxOrders(prev => prev.map(o => o.order_id === orderId
      ? { ...o, status: 'in_transit', dispatched_at: nowStr, dispatched_by: currentUser.name }
      : o));
    addToast({ type: 'info', title: 'Resurtido Enviado', message: `${order.folio} va en camino a CDMX.` });
    return { success: true };
  };

  // Resurtido: CDMX confirma que llegó → entra al stock vendible de CDMX
  const receiveRestockOrder = (orderId: string) => {
    const order = cdmxOrders.find(o => o.order_id === orderId);
    if (!order || order.type !== 'restock') return { success: false, error: 'Resurtido no encontrado.' };
    if (order.status !== 'in_transit') return { success: false, error: 'Este resurtido no está en tránsito.' };

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const deltas: Record<string, StockDelta> = {};
    order.items.forEach(i => { deltas[i.variant_id] = { transit: -i.quantity, cdmx: i.quantity }; });
    applyStockDeltas(deltas);
    setLedger(prev => [
      ...orderLedgerEntries(order, 'CDMX', 1, 'transfer_in', `Resurtido recibido en CDMX por ${currentUser.name}.`, nowStr),
      ...prev,
    ]);
    setCdmxOrders(prev => prev.map(o => o.order_id === orderId
      ? { ...o, status: 'received', closed_at: nowStr, closed_by: currentUser.name }
      : o));
    addToast({ type: 'success', title: 'Resurtido Recibido', message: `${order.folio}: piezas disponibles para venta en CDMX.` });
    return { success: true };
  };

  // Pedido de cliente: al entregarse se convierte en venta y libera el apartado
  const deliverCustomerOrder = (orderId: string, paymentMethod: 'cash' | 'card' | 'transfer') => {
    const order = cdmxOrders.find(o => o.order_id === orderId);
    if (!order || order.type !== 'customer') return { success: false, error: 'Pedido no encontrado.' };
    if (order.status !== 'pending') return { success: false, error: 'Este pedido ya fue cerrado.' };

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const saleId = `sale_${Date.now()}`;
    const folioNumber = Math.floor(1000 + Math.random() * 9000);
    const saleFolio = `FOL-CDMX-${folioNumber}`;

    const newSale: Sale = {
      sale_id: saleId,
      folio: saleFolio,
      user_id: currentUser.user_id,
      user_name: currentUser.name,
      customer_name: order.customer_name,
      location_id: 'CDMX',
      sale_type: 'direct',
      sale_channel: order.sale_channel || 'whatsapp',
      total_amount: order.total_amount,
      amount_paid: order.total_amount,
      balance_due: 0,
      down_payment: order.total_amount,
      status: 'completed',
      created_at: nowStr,
      notes: `Pedido de cliente ${order.folio}.`,
      items: order.items.map((item, idx) => {
        const found = findVariant(item.variant_id);
        const unitCost = found
          ? +(found.variant.bom_items.reduce((acc, b) => acc + b.quantity * b.unit_cost, 0)
              + found.variant.avg_assembly_minutes * found.variant.labor_minute_rate).toFixed(2)
          : 0;
        return {
          sale_item_id: `item_${saleId}_${idx}`,
          sale_id: saleId,
          variant_id: item.variant_id,
          product_name: item.product_name,
          variant_title: item.variant_title,
          sku: item.sku,
          quantity: item.quantity,
          unit_price: item.unit_price,
          unit_cost: unitCost,
        };
      }),
      payments: [{
        payment_id: `pay_${saleId}_1`,
        sale_id: saleId,
        user_id: currentUser.user_id,
        amount_paid: order.total_amount,
        payment_date: nowStr,
        payment_method: paymentMethod,
        receipt_folio: `REC-${folioNumber}-LIQUIDADO`,
        notes: `Entrega de pedido ${order.folio}.`,
      }],
    };

    const deltas: Record<string, StockDelta> = {};
    order.items.forEach(i => { deltas[i.variant_id] = { reserved: -i.quantity }; });
    applyStockDeltas(deltas);
    setLedger(prev => [
      ...orderLedgerEntries(order, order.stock_origin || 'AGS', -1, 'layaway_delivered', `Pedido entregado a ${order.customer_name}. Venta ${saleFolio}.`, nowStr)
        .map(e => ({ ...e, quantity_change: 0 })), // El stock ya se descontó al apartar
      ...prev,
    ]);
    setSales(prev => [newSale, ...prev]);
    setCdmxOrders(prev => prev.map(o => o.order_id === orderId
      ? { ...o, status: 'delivered', sale_folio: saleFolio, closed_at: nowStr, closed_by: currentUser.name }
      : o));
    addToast({ type: 'success', title: 'Pedido Entregado', message: `${order.folio} registrado como venta ${saleFolio} por $${order.total_amount.toFixed(2)}.` });
    return { success: true };
  };

  // Cancelar: un resurtido solo si no se ha enviado; un pedido de cliente devuelve el stock apartado
  const cancelCdmxOrder = (orderId: string) => {
    const order = cdmxOrders.find(o => o.order_id === orderId);
    if (!order) return { success: false, error: 'Pedido no encontrado.' };
    if (order.status !== 'pending') return { success: false, error: 'Solo se pueden cancelar pedidos pendientes.' };

    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    if (order.type === 'customer') {
      const origin = order.stock_origin || 'AGS';
      const deltas: Record<string, StockDelta> = {};
      order.items.forEach(i => {
        deltas[i.variant_id] = origin === 'AGS'
          ? { ags: i.quantity, reserved: -i.quantity, shopify: i.quantity }
          : { cdmx: i.quantity, reserved: -i.quantity, shopify: i.quantity };
      });
      applyStockDeltas(deltas);
      setLedger(prev => [
        ...orderLedgerEntries(order, origin, 1, 'layaway_cancelled_release', `Pedido de cliente cancelado. Stock devuelto a ${origin}.`, nowStr),
        ...prev,
      ]);
    }
    setCdmxOrders(prev => prev.map(o => o.order_id === orderId
      ? { ...o, status: 'cancelled', closed_at: nowStr, closed_by: currentUser.name }
      : o));
    addToast({ type: 'warning', title: 'Pedido Cancelado', message: `${order.folio} fue cancelado.` });
    return { success: true };
  };

  // Simulate incoming Shopify Webhook order (orders/create)
  const simulateIncomingShopifyOrder = (variantId: string, quantity: number) => {
    const found = findVariant(variantId);
    if (!found) return;

    const webhookId = `wh_evt_${Date.now().toString(36)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const orderNum = Math.floor(1000 + Math.random() * 9000);

    // Deduplication check simulation: if webhook already exists, ignore
    const duplicate = webhookLogs.some(w => w.webhook_id === webhookId);
    if (duplicate) return;

    // Deduct stock locally in AGS (default e-commerce fulfillment hub)
    setProducts(prev => prev.map(p => {
      const updatedVariants = p.variants.map(v => {
        if (v.variant_id !== variantId) return v;
        return {
          ...v,
          stock_ags: Math.max(0, v.stock_ags - quantity),
          stock_shopify_synced: Math.max(0, v.stock_shopify_synced - quantity),
        };
      });
      return { ...p, variants: updatedVariants };
    }));

    const newWebhook: ShopifyWebhookEvent = {
      webhook_id: webhookId,
      topic: 'orders/create',
      received_at: nowStr,
      hmac_signature: 'sha256=' + Array.from({ length: 32 }, () => Math.floor(Math.random()*16).toString(16)).join(''),
      is_hmac_valid: true,
      status: 'processed',
      payload_summary: `Pedido Shopify Online #${orderNum}: ${quantity}x ${found.product.name} (${found.variant.title}). Descontado de inventario AGS.`,
    };

    const ledgerEntry: InventoryLedgerEntry = {
      ledger_id: `led_${Date.now()}_shp_${Math.random().toString(36).substr(2, 4)}`,
      variant_id: variantId,
      variant_name: `${found.product.name} (${found.variant.title})`,
      location_id: 'AGS',
      quantity_change: -quantity,
      movement_reason: 'shopify_sync',
      reference_id: `SHOPIFY-#${orderNum}`,
      user_id: 'SHOPIFY_WEBHOOK',
      created_at: nowStr,
      notes: `Venta online en Shopify. Webhook orders/create procesado asíncronamente con HMAC válido.`,
    };

    setWebhookLogs(prev => [newWebhook, ...prev]);
    setLedger(prev => [ledgerEntry, ...prev]);

    // Also register as a sale in the system for omnichannel analytics
    const newOnlineSale: Sale = {
      sale_id: `sale_shp_${Date.now()}`,
      folio: `FOL-SHOPIFY-${orderNum}`,
      user_id: 'usr_admin',
      location_id: 'AGS',
      sale_type: 'direct',
      sale_channel: 'shopify',
      total_amount: found.variant.unit_price * quantity,
      amount_paid: found.variant.unit_price * quantity,
      balance_due: 0,
      down_payment: found.variant.unit_price * quantity,
      status: 'completed',
      created_at: nowStr,
      items: [
        {
          sale_item_id: `item_shp_${Date.now()}`,
          sale_id: `sale_shp_${Date.now()}`,
          variant_id: variantId,
          product_name: found.product.name,
          variant_title: found.variant.title,
          quantity,
          unit_price: found.variant.unit_price,
          unit_cost: found.variant.bom_items.reduce((a, b) => a + b.quantity * b.unit_cost, 0) + (found.variant.avg_assembly_minutes * found.variant.labor_minute_rate),
        }
      ],
      payments: [
        {
          payment_id: `pay_shp_${Date.now()}`,
          sale_id: `sale_shp_${Date.now()}`,
          user_id: 'usr_admin',
          amount_paid: found.variant.unit_price * quantity,
          payment_date: nowStr,
          payment_method: 'card',
          receipt_folio: `SHOPIFY-PAY-${orderNum}`,
          notes: 'Pago procesado en pasarela Shopify Payments.',
        }
      ]
    };

    setSales(prev => [newOnlineSale, ...prev]);

    addToast({
      type: 'info',
      title: 'Webhook Shopify Recibido',
      message: `Pedido #${orderNum}: Descontadas ${quantity} pzas de ${found.product.name}.`,
    });
  };

  const triggerManualShopifySync = () => {
    // Refresh shopify synced stocks
    setProducts(prev => prev.map(p => {
      const updated = p.variants.map(v => ({
        ...v,
        stock_shopify_synced: v.stock_ags + v.stock_cdmx,
      }));
      return { ...p, variants: updated };
    }));

    logShopifyMutation('inventoryAdjustQuantities', 'var_all', 0, 'AGS');
    addToast({
      type: 'success',
      title: 'Sincronización Shopify Exitosa',
      message: 'Niveles de inventario emparejados con la API GraphQL de Shopify.',
    });
  };

  const resetDemoData = () => {
    localStorage.clear();
    // Conserva la sesión de quien reinicia (solo Admin puede hacerlo)
    localStorage.setItem('karma_session_user_id', currentUser.user_id);
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setSales(INITIAL_SALES);
    setLedger(INITIAL_LEDGER);
    setProductionOrders(INITIAL_PRODUCTION_ORDERS);
    setTransfers(INITIAL_TRANSFERS);
    setCdmxOrders([]);
    setEvents([]);
    setActiveEventId(null);
    setMutationLogs([]);
    setWebhookLogs([]);
    setCurrentLocation('AGS');
    setShopifyGraphQLBucket(1000);
    addToast({
      type: 'info',
      title: 'Datos Reiniciados',
      message: 'Se han restaurado los valores de fábrica para Karma Accesorios Buena Vibra.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        loginWithCredentials,
        logout,
        isAuthenticated,
        currentLocation,
        setCurrentLocation,
        locations,
        products,
        ledger,
        addNewProduct,
        addStockToVariant,
        sales,
        customers,
        addCustomer,
        processSale,
        recordLayawayPayment,
        deliverLayaway,
        cancelLayaway,
        productionOrders,
        activeTimerOrderId,
        startAssemblyTimer,
        stopAssemblyTimer,
        createProductionOrder,
        completeProductionOrder,
        transfers,
        createTransfer,
        confirmTransferReception,
        events,
        activeEventId,
        setActiveEventId,
        createEvent,
        setEventStatus,
        cdmxOrders,
        createCdmxOrder,
        dispatchRestockOrder,
        receiveRestockOrder,
        deliverCustomerOrder,
        cancelCdmxOrder,
        shopifyGraphQLBucket,
        mutationLogs,
        webhookLogs,
        simulateIncomingShopifyOrder,
        triggerManualShopifySync,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
