export type UserRole = 'Admin' | 'Teffy' | 'Vicky' | 'Sha' | 'Karma';

export interface User {
  user_id: string;
  username: string; // Nombre de usuario para login
  password_hash: string; // Contraseña de acceso
  name: string;
  role: UserRole;
  avatar_color: string;
  title: string;
  domain: string;
  is_active: boolean;
}

export interface CityBranch {
  city_id: string; // e.g. 'AGS', 'CDMX'
  name: string;
  is_active: boolean;
  address?: string;
  phone?: string;
  created_at: string;
}

export interface KarmaEvent {
  event_id: string;
  name: string; // e.g. 'Bazar Roma', 'Feria del Caballo'
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  address: string;
  status: 'Activo' | 'Finalizado';
  notes?: string;
  created_at: string;
  created_by: string;
}

export type PaymentMethod = 'cash' | 'card' | 'transfer';
// Pago mixto: cuánto se cobró con cada método en una misma venta
export type PaymentSplit = Partial<Record<PaymentMethod, number>>;

export interface QuoteItem {
  item_id: string;
  variant_id: string;
  product_name: string;
  variant_title: string;
  sku: string;
  category: string;
  material: string;
  color: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  image_url?: string;
  stock_available: number;
}

export interface Quote {
  quote_id: string;
  folio: string; // e.g. 'COT-2026-001'
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  city_id: string;
  city_name: string;
  event_id?: string;
  event_name?: string;
  items: QuoteItem[];
  subtotal: number;
  discount_type: 'percent' | 'amount';
  discount_value: number;
  discount_amount: number;
  total: number;
  notes?: string;
  valid_until: string;
  status: 'Borrador' | 'Enviada' | 'Aprobada' | 'Convertida en Venta' | 'Vencida';
  created_by_user_id: string;
  created_by_user_name: string;
  created_at: string;
}

export interface AuditLog {
  log_id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity: 'Venta' | 'Cotización' | 'Evento' | 'Ciudad' | 'Inventario' | 'Apartado' | 'Usuario' | 'Sistema';
  details: string;
  timestamp: string;
}

export interface Customer {
  customer_id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  registration_date: string;
  notes?: string;
  credit_status?: 'good' | 'pending' | 'risk';
}

export type LocationId = 'AGS' | 'CDMX' | string;

export interface Location {
  location_id: string;
  location_name: string;
  shopify_location_id: string;
  address: string;
  is_active: boolean;
}

export interface RawMaterial {
  material_id: string;
  name: string;
  unit: string;
  cost_per_unit: number; // e.g. MXN
  stock: number;
}

export interface BOMItem {
  material_id: string;
  material_name: string;
  quantity: number;
  unit: string;
  unit_cost: number;
}

export type ProductGender = 'Hombre' | 'Mujer' | 'Unisex' | 'Otro';

export interface ProductVariant {
  variant_id: string;
  product_id: string;
  title: string;
  sku: string;
  color_alloy: string;
  stone_charm: string;
  unit_price: number;
  gender?: ProductGender;
  material?: string;
  // Stock by location
  stock_ags: number;
  stock_cdmx: number;
  stock_in_transit_cdmx: number;
  stock_layaway_reserved: number;
  stock_shopify_synced: number;
  // BOM & Labor cost metrics
  bom_items: BOMItem[];
  avg_assembly_minutes: number;
  labor_minute_rate: number; // e.g. 2.5 MXN per min (150 MXN / hour)
}

export interface Product {
  product_id: string;
  name: string;
  category: string; // e.g. 'Pulseras', 'Collares', 'Aretes', 'Arracadas', 'Hoops', 'Dijes', 'Anillos'
  gender?: ProductGender;
  material?: string;
  color?: string;
  image_url: string;
  description: string;
  variants: ProductVariant[];
}

export interface NewProductFormData {
  name: string;
  sku: string;
  category: string;
  gender: ProductGender;
  material: string;
  color: string;
  price: number;
  stockAgs: number;
  stockCdmx: number;
  description?: string;
  imageUrl?: string;
  unitCost?: number;
}

export type SaleType = 'direct' | 'layaway';
export type SaleChannel = 'physical' | 'instagram' | 'whatsapp' | 'shopify';
export type SaleStatus = 'completed' | 'active_layaway' | 'cancelled' | 'delivered';

export interface SaleItem {
  sale_item_id: string;
  sale_id: string;
  variant_id: string;
  product_name: string;
  variant_title: string;
  sku?: string;
  category?: string;
  material?: string;
  color?: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
}

export interface LayawayPayment {
  payment_id: string;
  sale_id: string;
  user_id: string;
  amount_paid: number;
  payment_date: string;
  payment_method: 'cash' | 'card' | 'transfer';
  receipt_folio: string;
  notes?: string;
}

export interface Sale {
  sale_id: string;
  folio: string;
  user_id: string;
  user_name?: string;
  customer_id?: string;
  customer_name?: string;
  location_id: string;
  city_id?: string; // Obligatorio en nuevas ventas, opcional en retrocompatibilidad
  city_name?: string;
  event_id?: string; // Opcional: Relacionado con Evento/Bazar
  event_name?: string;
  sale_type: SaleType;
  sale_channel: SaleChannel;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  down_payment: number;
  status: SaleStatus;
  created_at: string;
  next_payment_due_date?: string;
  items: SaleItem[];
  payments: LayawayPayment[];
  notes?: string;
}

export type InventoryMovementReason = 
  | 'production'
  | 'sale'
  | 'layaway_hold'
  | 'layaway_cancelled_release'
  | 'layaway_delivered'
  | 'transfer_out'
  | 'transfer_in'
  | 'shopify_sync'
  | 'manual_adjustment';

export interface InventoryLedgerEntry {
  ledger_id: string;
  variant_id: string;
  variant_name: string;
  location_id: LocationId | 'GLOBAL';
  quantity_change: number;
  movement_reason: InventoryMovementReason;
  reference_id?: string; // sale_id, transfer_id, etc.
  user_id: string;
  created_at: string;
  notes?: string;
}

export interface ProductionOrder {
  order_id: string;
  variant_id: string;
  product_name: string;
  variant_title: string;
  quantity: number;
  color_variant: string;
  stone_variant: string;
  elapsed_hours: number; // Te
  max_allowed_hours: number; // Tm
  channel_weight: number; // Pc (e.g., 1.5 for immediate web dispatch, 1.0 standard)
  urgency_index: number; // U = (Te / Tm) * Pc
  is_urgent: boolean; // U >= 1.0
  status: 'pending' | 'in_assembly' | 'assembled' | 'dispatched_ags' | 'in_transit_cdmx' | 'received_cdmx';
  created_at: string;
  artisan_name: string;
  actual_assembly_minutes: number;
  target_destination: LocationId;
}

export interface InterLocationTransfer {
  transfer_id: string;
  folio: string;
  origin_location: LocationId;
  destination_location: LocationId;
  variant_id: string;
  product_name: string;
  variant_title: string;
  quantity: number;
  status: 'in_transit' | 'received' | 'cancelled';
  dispatched_at: string;
  dispatched_by: string;
  received_at?: string;
  received_by?: string;
}

// Pedidos para la sede CDMX:
// - 'restock': CDMX pide mercancía a AGS (pendiente → en tránsito → recibido)
// - 'customer': un cliente de CDMX encarga piezas (apartado → entregado)
export type CdmxOrderType = 'restock' | 'customer';
export type CdmxOrderStatus = 'pending' | 'in_transit' | 'received' | 'delivered' | 'cancelled';

export interface CdmxOrderItem {
  variant_id: string;
  product_name: string;
  variant_title: string;
  sku: string;
  quantity: number;
  unit_price: number;
}

export interface CdmxOrder {
  order_id: string;
  folio: string; // e.g. 'RES-CDMX-123' / 'PED-CDMX-123'
  type: CdmxOrderType;
  status: CdmxOrderStatus;
  items: CdmxOrderItem[];
  total_amount: number;
  // Solo pedidos de cliente
  customer_name?: string;
  customer_phone?: string;
  sale_channel?: SaleChannel;
  stock_origin?: LocationId; // Sede de la que se apartó el stock
  sale_folio?: string; // Folio de la venta generada al entregar
  notes?: string;
  created_at: string;
  created_by: string;
  dispatched_at?: string;
  dispatched_by?: string;
  closed_at?: string; // Recibido / entregado / cancelado
  closed_by?: string;
}

export interface ShopifyWebhookEvent {
  webhook_id: string;
  topic: 'orders/create' | 'inventory_levels/update';
  received_at: string;
  hmac_signature: string;
  is_hmac_valid: boolean;
  status: 'processed' | 'duplicate_ignored' | 'pending';
  payload_summary: string;
}

export interface ShopifyGraphQLMutationLog {
  mutation_id: string;
  timestamp: string;
  operation_name: 'inventoryAdjustQuantities' | 'inventoryTransfer';
  variant_id: string;
  location_id: string;
  quantity_delta: number;
  cost_points: number;
  bucket_points_remaining: number;
  response_status: 'SUCCESS_200' | 'RATE_LIMITED_429' | 'ERROR';
}
