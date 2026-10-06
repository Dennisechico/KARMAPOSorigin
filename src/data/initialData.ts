import { Customer, InterLocationTransfer, InventoryLedgerEntry, Location, Product, ProductionOrder, Sale, User } from '../types';
import { transformCsvToProducts } from './csvProducts';

export const INITIAL_USERS: User[] = [
  {
    user_id: 'usr_admin',
    username: 'admin',
    password_hash: 'ca523709270f2f6634ad118dcfb401f9a687739640a4746c53884067c527d99e',
    name: 'Admin',
    role: 'Admin',
    avatar_color: 'bg-stone-600',
    title: 'Administración General',
    domain: 'Acceso completo: venta, apartados, clientes, inventario, taller, logística, Shopify y analítica.',
    is_active: true,
  },
  {
    user_id: 'usr_sha',
    username: 'sha',
    password_hash: '3445ddcc1999546624ed11c0f45fdd363ec13710654897ef446b06ad76b7fee0',
    name: 'Sha',
    role: 'Sha',
    avatar_color: 'bg-amber-500',
    title: 'Acceso Completo',
    domain: 'Acceso completo: venta, apartados, clientes, inventario, taller, logística, Shopify y analítica.',
    is_active: true,
  },
  {
    user_id: 'usr_teffy',
    username: 'teffy',
    password_hash: '521ad0343b716c2ac0479683ecd3eaaccebc656490c93cf3a682385bce503df3',
    name: 'Teffy',
    role: 'Teffy',
    avatar_color: 'bg-amber-700',
    title: 'Acceso Completo',
    domain: 'Acceso completo: venta, apartados, clientes, inventario, taller, logística, Shopify y analítica.',
    is_active: true,
  },
  {
    user_id: 'usr_abuelita',
    username: 'vicky',
    password_hash: '6357cc84cab251a7e5ab32198f1c38960cf466c5352d738856c48f7e816b5833',
    name: 'Vicky',
    role: 'Vicky',
    avatar_color: 'bg-stone-500',
    title: 'Acceso Completo',
    domain: 'Acceso completo: venta, apartados, clientes, inventario, taller, logística, Shopify y analítica.',
    is_active: true,
  },
  {
    user_id: 'usr_karma_events',
    username: 'extra',
    password_hash: 'ea84f24bcbecc799622ad2b452077fa7154ccd7b1077583e042e0f1a65322865',
    name: 'Extra',
    role: 'Karma',
    avatar_color: 'bg-amber-900',
    title: 'Ventas en Punto de Venta',
    domain: 'Solo Terminal POS: venta directa y cálculo de cambio.',
    is_active: true,
  },
];

export const INITIAL_LOCATIONS: Location[] = [
  {
    location_id: 'AGS',
    location_name: 'Aguascalientes (Matriz & Taller)',
    shopify_location_id: 'gid://shopify/Location/654890123',
    address: 'Calle Madero 320, Zona Centro, Aguascalientes, Ags.',
    is_active: true,
  },
  {
    location_id: 'CDMX',
    location_name: 'Ciudad de México (Showroom & Pop-up)',
    shopify_location_id: 'gid://shopify/Location/789123456',
    address: 'Colima 180, Col. Roma Norte, Cuauhtémoc, CDMX',
    is_active: true,
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [];

// Registros de ejemplo que venían con la app: se purgan también de los datos ya guardados en el navegador
export const REMOVED_DEMO_IDS = new Set([
  'cust_01', 'cust_02', 'cust_03', 'cust_04',
  'sale_101', 'sale_102', 'sale_103', 'sale_104',
  'ord_prod_01', 'ord_prod_02', 'ord_prod_03',
  'trf_001', 'trf_002',
  'led_001', 'led_002', 'led_003', 'led_004',
  'mut_001', 'mut_002',
  'wh_evt_89412',
]);

// Productos eliminados del catálogo: se quitan también de los datos ya guardados en el navegador
export const REMOVED_PRODUCT_IDS = [
  'prod_01', // Collar Cuarzo Rosa & Amatista Mística
  'prod_02', // Pulsera Macramé Protección Ojo Turco
  'prod_03', // Aretes Filigrana Árbol de la Vida
  'prod_04', // Dije Geoda de Ágata en Alambre Dorado
  'prod_05', // Anillo Ajustable Perla de Río & Oro
];

export const INITIAL_PRODUCTS: Product[] = [
  ...transformCsvToProducts(),
];

export const INITIAL_SALES: Sale[] = [];

export const INITIAL_PRODUCTION_ORDERS: ProductionOrder[] = [];

export const INITIAL_TRANSFERS: InterLocationTransfer[] = [];

export const INITIAL_LEDGER: InventoryLedgerEntry[] = [];
