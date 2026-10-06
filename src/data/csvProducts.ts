import { Product, ProductGender } from '../types';

export interface CsvRawRow {
  sku: string;
  name: string;
  stock: number;
  precio: number;
  categoria: string;
  material: string;
  color: string;
}

export const RAW_CSV_DATA: CsvRawRow[] = [
  // LOTE 1: PULSERAS HOMBRES (PH, IH, H, W88) - REVISADO Y CORREGIDO POR CAPTURISTA
  { sku: 'PH1', name: 'Jaspe y Hematita Árbol', stock: 1, precio: 150, categoria: 'PH', material: 'Jaspe', color: 'Azul' },
  { sku: 'PH2', name: 'Jaspe y Hematita Tubo', stock: 1, precio: 120, categoria: 'PH', material: 'Jaspe', color: 'Azul' },
  { sku: 'PH3', name: 'Pulsera Ojo de Halcón', stock: 1, precio: 100, categoria: 'PH', material: 'Ojo de Halcón', color: 'Azul' },
  { sku: 'PH4', name: 'Ónix y Ojo de Tigre Dorado', stock: 1, precio: 120, categoria: 'PH', material: 'Ojo de Tigre', color: 'Negro' },
  { sku: 'PH5', name: 'Dragón Dorado', stock: 1, precio: 120, categoria: 'PH', material: 'Ónix', color: 'Negro' },
  { sku: 'PH6', name: 'Buda Dorado', stock: 1, precio: 120, categoria: 'PH', material: 'Piedra Volcánica', color: 'Negro' },
  { sku: 'PH7', name: 'Ónix con Separador', stock: 1, precio: 180, categoria: 'PH', material: 'Ónix', color: 'Negro' },
  { sku: 'PH8', name: 'Ojo de Tigre Rojo Turquesina', stock: 1, precio: 80, categoria: 'PH', material: 'Turquesina', color: 'Rojo' },
  { sku: 'PH9', name: 'Buda Rojo Ágata', stock: 1, precio: 200, categoria: 'PH', material: 'Ágata', color: 'Rojo' },
  { sku: 'PH10', name: 'Buda Ágata Azul', stock: 1, precio: 170, categoria: 'PH', material: 'Ágata', color: 'Azul' },
  { sku: 'PH11', name: 'Buda Multicolor', stock: 1, precio: 150, categoria: 'PH', material: 'Ágata', color: 'Rosa' },
  { sku: 'PH12', name: 'Jade Volcánica Elefante', stock: 1, precio: 100, categoria: 'PH', material: 'Piedra Volcánica', color: 'Verde' },
  { sku: 'PH13', name: 'Buda Jade Verde', stock: 1, precio: 200, categoria: 'PH', material: 'Jade', color: 'Verde' },
  { sku: 'PH14', name: 'Buda con Ojo de Tigre y Domolina', stock: 1, precio: 160, categoria: 'PH', material: 'Ojo de Tigre', color: 'Café' },
  { sku: 'PH15', name: 'Ojo de Tigre y Ónix', stock: 1, precio: 80, categoria: 'PH', material: 'Ojo de Tigre', color: 'Café' },
  { sku: 'PH16', name: 'Jaspe, Domolina Plateado', stock: 1, precio: 120, categoria: 'PH', material: 'Ojo de Tigre', color: 'Café' },
  { sku: 'PH17', name: 'Turquesina y Ojo de Tigre Chica', stock: 1, precio: 100, categoria: 'PH', material: 'Turquesina', color: 'Café' },
  { sku: 'PH18', name: 'Amazonita con Jade Cuadrado', stock: 1, precio: 120, categoria: 'PH', material: 'Amazonita', color: 'Verde' },
  { sku: 'PH19', name: 'Madera con Ónix', stock: 1, precio: 80, categoria: 'PH', material: 'Madera', color: 'Café' },
  { sku: 'PH20', name: 'Ónix con Jade, Turmalina', stock: 1, precio: 250, categoria: 'PH', material: 'Jade', color: 'Verde' },
  { sku: 'PH21', name: 'Buda Ágata Rosa', stock: 1, precio: 200, categoria: 'PH', material: 'Ágata', color: 'Rosa' },
  { sku: 'PH22', name: 'Hematita con Buda Tornasol', stock: 1, precio: 120, categoria: 'PH', material: 'Hematita', color: 'Dorado' },
  { sku: 'PH23', name: 'Venturina y Ojo de Tigre', stock: 1, precio: 120, categoria: 'PH', material: 'Aventurina', color: 'Café' },
  { sku: 'PH24', name: 'Domolina con Dorado', stock: 1, precio: 120, categoria: 'PH', material: 'Domolina', color: 'Café' },
  { sku: 'PH25', name: 'Flechas con Demonio', stock: 1, precio: 150, categoria: 'PH', material: 'Hematita', color: 'Dorado' },
  { sku: 'PH26', name: 'Buda y Jade y Madera', stock: 1, precio: 100, categoria: 'PH', material: 'Madera', color: 'Café' },
  { sku: 'PH27', name: 'Chip con Buda', stock: 1, precio: 150, categoria: 'PH', material: 'Cuarzo Chip', color: 'Blanco' },
  { sku: 'PH28', name: 'Chip Café con Buda', stock: 1, precio: 120, categoria: 'PH', material: 'Cuarzo Chip', color: 'Café' },
  { sku: 'PH29', name: 'Madera Verde', stock: 1, precio: 100, categoria: 'PH', material: 'Madera', color: 'Verde' },
  { sku: 'PH30', name: 'Madera y Chip Verde', stock: 1, precio: 130, categoria: 'PH', material: 'Madera', color: 'Verde' },
  { sku: 'PH31', name: 'Buda con Verde y Chip', stock: 1, precio: 180, categoria: 'PH', material: 'Madera', color: 'Verde' },
  { sku: 'PH32', name: 'Ónix con Cruz', stock: 1, precio: 140, categoria: 'PH', material: 'Ónix', color: 'Negro' },
  { sku: 'PH33', name: 'Ónix con Turquesina', stock: 1, precio: 180, categoria: 'PH', material: 'Ónix', color: 'Negro' },
  { sku: 'PH34', name: 'Hematita con Hilo', stock: 1, precio: 180, categoria: 'PH', material: 'Hematita', color: 'Plateado' },
  { sku: 'PH35', name: 'Buda con Hematita', stock: 1, precio: 120, categoria: 'PH', material: 'Hematita', color: 'Plateado' },
  { sku: 'PH36', name: 'Ojo de Tigre Azul y Casco', stock: 1, precio: 280, categoria: 'PH', material: 'Ojo de Tigre', color: 'Azul' },
  { sku: 'PH37', name: 'Ónix y Ojo de Tigre Azul', stock: 1, precio: 80, categoria: 'PH', material: 'Ónix', color: 'Negro' },
  { sku: 'PH38', name: 'Ágata con Ojo de Tigre Azul', stock: 1, precio: 200, categoria: 'PH', material: 'Ágata', color: 'Azul' },
  { sku: 'H18', name: 'Madera', stock: 1, precio: 70, categoria: 'PH', material: 'Madera', color: 'Café' },
  { sku: 'w88', name: 'Piedra Mate y Acerina', stock: 1, precio: 210, categoria: 'PH', material: 'Piedra Mate', color: 'Dorado' },
  { sku: 'PH39', name: 'Elefante y Volcánica', stock: 1, precio: 120, categoria: 'PH', material: 'Piedra Volcánica', color: 'Negro' },
  { sku: 'PH40', name: 'Ojo de Tigre y Halcón', stock: 1, precio: 120, categoria: 'PH', material: 'Ojo de Tigre', color: 'Café' },
  { sku: 'PH41', name: 'Ojo de Tigre con Nudo de Bruja', stock: 1, precio: 180, categoria: 'PH', material: 'Ojo de Halcón', color: 'Café' },
  { sku: 'PH42', name: 'Ojo de Halcón con Ojo de Tigre', stock: 1, precio: 100, categoria: 'PH', material: 'Ojo de Tigre', color: 'Morado' },
  { sku: 'PH43', name: 'Volcánica con Plata', stock: 2, precio: 120, categoria: 'PH', material: 'Piedra Volcánica', color: 'Negro' },
  { sku: 'PH44', name: 'Volcánica con Hematita', stock: 2, precio: 60, categoria: 'PH', material: 'Hematita', color: 'Negro' },
  { sku: 'PH45', name: 'Jaguar Zirconia con Verde y Obsidiana', stock: 1, precio: 230, categoria: 'PH', material: 'Obsidiana', color: 'Negro' },
  { sku: 'PH46', name: 'Jaspe y Volcánica', stock: 4, precio: 100, categoria: 'PH', material: 'Jaspe', color: 'Negro' },
  { sku: 'IH2', name: 'Hombre Cuero', stock: 1, precio: 300, categoria: 'PH', material: 'Cuero', color: 'Negro' },
  { sku: 'H25', name: 'Acerina y Piedra Mate', stock: 2, precio: 200, categoria: 'PH', material: 'Acerina', color: 'Negro' },
  { sku: 'PH47', name: 'Lapislázuli Plata', stock: 1, precio: 130, categoria: 'PH', material: 'Lapislázuli', color: 'Azul' },
  { sku: 'PH48', name: 'Ónix y Hematita con Cruz', stock: 1, precio: 150, categoria: 'PH', material: 'Ónix', color: 'Negro' },
  { sku: 'PH49', name: 'Turquesina Om', stock: 1, precio: 80, categoria: 'PH', material: 'Turquesina', color: 'Azul' },
  { sku: 'PH50', name: 'Ónix con Turquesina', stock: 2, precio: 60, categoria: 'PH', material: 'Ónix', color: 'Azul' },
  { sku: 'PH51', name: 'Volcánica Blanca con Ojo de Tigre y Om', stock: 1, precio: 210, categoria: 'PH', material: 'Ojo de Gato Blanco', color: 'Blanco' },
  { sku: 'PH52', name: 'Ónix con Buda Azul', stock: 2, precio: 60, categoria: 'PH', material: 'Ónix', color: 'Negro' },
  { sku: 'PH53', name: 'Ojo de Gato Turco', stock: 1, precio: 320, categoria: 'PH', material: 'Ojo de Gato Blanco', color: 'Blanco' },
  { sku: 'PH54', name: 'Piedra Volcánica con Om', stock: 1, precio: 100, categoria: 'PH', material: 'Piedra Volcánica', color: 'Blanco' },
  { sku: 'PH55', name: 'Ónix y Piedra Mate Calavera', stock: 2, precio: 120, categoria: 'PH', material: 'Piedra Mate', color: 'Negro' },
  { sku: 'PH56', name: 'Volcánica con Zirconia', stock: 1, precio: 80, categoria: 'PH', material: 'Piedra Volcánica', color: 'Negro' },
  { sku: 'IH11', name: 'Cuero y Plateado', stock: 1, precio: 250, categoria: 'PH', material: 'Cuero', color: 'Negro' },
  { sku: 'IH7', name: 'Cuero Dorado, Rojo y Negro', stock: 1, precio: 200, categoria: 'PH', material: 'Cuero', color: 'Rojo' },
  { sku: 'PH57', name: 'Piedra Calcedonia, Turquesina y Calavera', stock: 1, precio: 170, categoria: 'PH', material: 'Calcedonia', color: 'Rojo' },
  { sku: 'PH58', name: 'Jaspe y Piedra Volcánica con Lobo', stock: 1, precio: 100, categoria: 'PH', material: 'Jaspe', color: 'Negro' },
  { sku: 'PH59', name: 'Piedra Volcánica y Piedra Mate Calavera', stock: 1, precio: 80, categoria: 'PH', material: 'Piedra Volcánica', color: 'Negro' },
  { sku: 'PH60', name: 'Calavera con Piedra Verde y Piedra Volcánica', stock: 1, precio: 80, categoria: 'PH', material: 'Piedra Volcánica', color: 'Negro' },

  // LOTE 2: ANILLOS MUJER (AMD, AMP) Y HOMBRE (AHD, AHP)
  { sku: 'AMD1', name: 'Anillo Dorado Clásico', stock: 16, precio: 100, categoria: 'ANILLO MUJER', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'AMP1', name: 'Anillo Plateado Clásico', stock: 8, precio: 100, categoria: 'ANILLO MUJER', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'AMD2', name: 'Anillo Dorado Grabado', stock: 11, precio: 120, categoria: 'ANILLO MUJER', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'AMP2', name: 'Anillo Plateado Grabado', stock: 5, precio: 120, categoria: 'ANILLO MUJER', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'AMD3', name: 'Anillo Dorado Deluxe', stock: 4, precio: 150, categoria: 'ANILLO MUJER', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'AMP3', name: 'Anillo Plateado Deluxe', stock: 3, precio: 150, categoria: 'ANILLO MUJER', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'AHD', name: 'Anillos Dorados Premium', stock: 16, precio: 150, categoria: 'ANILLO HOMBRE', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'AHP', name: 'Anillos Plateados Premium', stock: 9, precio: 150, categoria: 'ANILLO HOMBRE', material: 'Acero Inoxidable', color: 'Plateado' },

  // LOTE 3: ARRACADAS Y HOOPS (AMV, HP, HD)
  { sku: 'AMVCH', name: 'Arracada MV Chica', stock: 15, precio: 120, categoria: 'ARRACADA', material: 'Chaquira', color: 'Multicolor' },
  { sku: 'AMVMD', name: 'Arracada MV Mediana', stock: 15, precio: 150, categoria: 'ARRACADA', material: 'Chaquira', color: 'Multicolor' },
  { sku: 'AMVGD', name: 'Arracada MV Grande', stock: 1, precio: 180, categoria: 'ARRACADA', material: 'Chaquira', color: 'Multicolor' },
  { sku: 'HP', name: 'Hoops Plata', stock: 5, precio: 150, categoria: 'HOOPS', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'HD', name: 'Hoops Dorado', stock: 1, precio: 150, categoria: 'HOOPS', material: 'Acero Inoxidable', color: 'Dorado' },

  // LOTE 4: COLLARES MUJER / GENERAL (CM, TCM, A, G, F, O, PK)
  { sku: 'CM1', name: 'Collar Estrellas Dorado', stock: 4, precio: 150, categoria: 'COLLAR', material: 'Chapa de Oro', color: 'Dorado' },
  { sku: 'CM2', name: 'Collar Estrellas Plateado', stock: 4, precio: 150, categoria: 'COLLAR', material: 'Chapa de Oro', color: 'Plateado' },
  { sku: 'CM3', name: 'Collar Perla y Chaquiras', stock: 6, precio: 150, categoria: 'COLLAR', material: 'Chaquira', color: 'Multicolor' },
  { sku: 'CM4', name: 'Collares Cristal Checo', stock: 14, precio: 150, categoria: 'COLLAR', material: 'Cristal Checo', color: 'Multicolor' },
  { sku: 'TCM5', name: 'Collar Cristales y Calavera de Vaca', stock: 1, precio: 360, categoria: 'COLLAR', material: 'Cristal Checo', color: 'Negro' },
  { sku: 'CM6', name: 'Collar Malla Panza de Víbora', stock: 1, precio: 250, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'CM7', name: 'Collar Rígido Panza de Víbora', stock: 1, precio: 300, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'CM8', name: 'Collar Chaquira Artesanal', stock: 1, precio: 150, categoria: 'COLLAR', material: 'Chaquira', color: 'Café' },
  { sku: 'CM9', name: 'Triple Cadena con Perla', stock: 1, precio: 280, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'CM10', name: 'Cadena con Piedra Natural', stock: 2, precio: 370, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Café' },
  { sku: 'CM11', name: 'Collar Corazón Bordado', stock: 1, precio: 300, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Multicolor' },
  { sku: 'CM12', name: 'Collar Perla Fantasía', stock: 2, precio: 150, categoria: 'COLLAR', material: 'Perla Fantasía', color: 'Blanco' },
  { sku: 'CM13', name: 'Collar Cadena Cuadrada', stock: 1, precio: 100, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'CM14', name: 'Collar Corazón con Alas', stock: 1, precio: 150, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'TCM15', name: 'Calavera Turquesina Vaca Grande', stock: 1, precio: 670, categoria: 'COLLAR', material: 'Turquesina', color: 'Azul' },
  { sku: 'CM16', name: 'Collar Corazón Ojo Perla de Río', stock: 1, precio: 1200, categoria: 'COLLAR', material: 'Perla de Río', color: 'Blanco' },
  { sku: 'CM17', name: 'Collar Rígido con Corazón', stock: 1, precio: 300, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'CM18', name: 'Patín 4 Líneas Dorado', stock: 1, precio: 180, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'CM19', name: 'Collar Cadena con Colgijes', stock: 1, precio: 210, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'CM20', name: 'Collar Love', stock: 1, precio: 100, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'A2', name: 'Collar Malla Choker', stock: 1, precio: 215, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'A25', name: 'Rosario Plateado', stock: 1, precio: 250, categoria: 'COLLAR', material: 'Acerina', color: 'Plateado' },
  { sku: 'G28', name: 'Cadena con Dijes Dorada', stock: 1, precio: 230, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'A29', name: 'Cadena Eslabón Normal', stock: 1, precio: 180, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'G25', name: 'Plateado con Corazón', stock: 1, precio: 150, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A31', name: 'Collar Bitón', stock: 1, precio: 200, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'F17_1', name: 'Collar Patín Plateado', stock: 1, precio: 120, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'F39', name: 'Collar Tenis', stock: 1, precio: 150, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'F17_2', name: 'Collar Cola de Serpiente Rojo', stock: 1, precio: 200, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'G48', name: 'Alas y Perla', stock: 1, precio: 270, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'A37', name: 'Cuerno Amatista Dorado', stock: 1, precio: 250, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'A40', name: 'Cuerno Amatista Plata', stock: 1, precio: 250, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'F33', name: 'Balleto', stock: 1, precio: 150, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'O55', name: 'Cruz Plateada', stock: 1, precio: 180, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'F18', name: 'Ojo de Tigre Morado', stock: 1, precio: 150, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'f63', name: 'Ojo de Tigre Rojo', stock: 2, precio: 180, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'o42', name: 'Ojo de Tigre Rosa Cadena', stock: 2, precio: 200, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'o45', name: 'Ojo de Tigre Cadena Multicolor', stock: 1, precio: 200, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Multicolor' },
  { sku: 'CM21', name: 'Caballito de Mar', stock: 1, precio: 150, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'TCM22', name: 'Collar Turquesina con Dije Elefante', stock: 1, precio: 350, categoria: 'COLLAR', material: 'Turquesina', color: 'Azul' },
  { sku: 'C38', name: 'Collar 8mm Dorado', stock: 1, precio: 230, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'A33', name: 'Colmillo Cuarzo Rosa', stock: 1, precio: 250, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'w56', name: 'Estrella Bicolor', stock: 1, precio: 200, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A43', name: 'Péndulo Cuarzo Blanco', stock: 2, precio: 200, categoria: 'COLLAR', material: 'Cuarzo', color: 'Blanco' },
  { sku: 'A36', name: 'Colmillo Amatista Morado', stock: 1, precio: 250, categoria: 'COLLAR', material: 'Cuarzo', color: 'Morado' },
  { sku: 'A35', name: 'Colmillo Amatista Blanco', stock: 1, precio: 250, categoria: 'COLLAR', material: 'Cuarzo', color: 'Blanco' },
  { sku: 'A49', name: 'Péndulo Amatista con Dije', stock: 1, precio: 250, categoria: 'COLLAR', material: 'Cuarzo', color: 'Morado' },
  { sku: 'W67', name: 'Balines Plateados', stock: 1, precio: 100, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'CM23', name: 'Perlas y Chaquira Multicolor', stock: 1, precio: 150, categoria: 'COLLAR', material: 'Perla Fantasía', color: 'Multicolor' },
  { sku: 'A26', name: 'Rosario Dorado', stock: 1, precio: 250, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'TCM24', name: 'Collar Jade Puro', stock: 1, precio: 500, categoria: 'COLLAR', material: 'Jade', color: 'Verde' },
  { sku: 'G63', name: 'Collar Corazón Rojo', stock: 1, precio: 180, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'G68', name: 'Collar Corazón Doble', stock: 1, precio: 180, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'TCM25', name: 'Collar Largo de Turquesina, Jade y Cornalina', stock: 1, precio: 920, categoria: 'COLLAR', material: 'Jade', color: 'Verde' },
  { sku: 'A98', name: 'Collar Geoda', stock: 2, precio: 210, categoria: 'COLLAR', material: 'Geoda', color: 'Morado' },
  { sku: 'A52', name: 'Panza de Víbora Dorado', stock: 2, precio: 150, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'TA104', name: 'Perla de Río y Ágata con Ojo de Tigre', stock: 1, precio: 760, categoria: 'COLLAR', material: 'Perla de Río', color: 'Blanco' },
  { sku: 'TCM26', name: 'Ojo de Tigre con Elefante y Ojo', stock: 1, precio: 820, categoria: 'COLLAR', material: 'Ojo de Tigre', color: 'Café' },
  { sku: 'TCM27', name: 'Collar Coral y Lapislázuli', stock: 1, precio: 500, categoria: 'COLLAR', material: 'Chapa de Oro', color: 'Dorado' },
  { sku: 'TCM28', name: 'Ágata, Jade, Cuarzo Rosa y Ojo de Tigre', stock: 1, precio: 500, categoria: 'COLLAR', material: 'Amatista', color: 'Morado' },
  { sku: 'TCM29', name: 'Collar Largo de Ágata, Cuarzo y Labradorita', stock: 1, precio: 530, categoria: 'COLLAR', material: 'Ágata', color: 'Morado' },
  { sku: 'TCM30', name: 'Mano de Amatista con Torsal', stock: 1, precio: 590, categoria: 'COLLAR', material: 'Amatista', color: 'Morado' },
  { sku: 'TCM31', name: 'Mano de Ojo de Tigre con Torsal', stock: 1, precio: 590, categoria: 'COLLAR', material: 'Ojo de Tigre', color: 'Café' },
  { sku: 'TCM32', name: 'Cuarzo Rosa y Jade Azul', stock: 1, precio: 490, categoria: 'COLLAR', material: 'Jade', color: 'Rojo' },
  { sku: 'TCM33', name: 'Collar Dorado Mano Ónix', stock: 1, precio: 340, categoria: 'COLLAR', material: 'Ónix', color: 'Negro' },
  { sku: 'x15', name: 'Flores Chakras Miyuki', stock: 2, precio: 300, categoria: 'COLLAR', material: 'Miyuki', color: 'Multicolor' },
  { sku: 'TCM34', name: 'Collar Dorado Mano Jaspe', stock: 1, precio: 340, categoria: 'COLLAR', material: 'Jaspe', color: 'Gris' },
  { sku: 'A1', name: 'Choker Malla Plateado', stock: 1, precio: 215, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'TCM35', name: 'Coral y Turquesina Collar Largo Dije Medio Círculo', stock: 1, precio: 780, categoria: 'COLLAR', material: 'Turquesina', color: 'Rojo' },
  { sku: 'TCM36', name: 'Collar Dorado Colmillo Tiburón Resina', stock: 1, precio: 560, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Blanco' },
  { sku: 'TCM37', name: 'Resina con Turquesa', stock: 1, precio: 360, categoria: 'COLLAR', material: 'Turquesina', color: 'Gris' },
  { sku: 'CM38', name: 'Cristal Azul con Separadores', stock: 1, precio: 160, categoria: 'COLLAR', material: 'Cristal', color: 'Azul' },
  { sku: 'TCM39', name: 'Collar Blanco y Negro Ágatas y Dije Flecos', stock: 1, precio: 630, categoria: 'COLLAR', material: 'Ágata', color: 'Negro' },
  { sku: 'TCM40', name: 'Collar Blanco y Negro Ágata', stock: 1, precio: 250, categoria: 'COLLAR', material: 'Ágata', color: 'Negro' },
  { sku: 'PK1', name: 'Pañuelo con Corazón', stock: 1, precio: 350, categoria: 'COLLAR', material: 'Chaquira', color: 'Rosa' },
  { sku: 'PK2', name: 'Pañuelo San Judas', stock: 1, precio: 450, categoria: 'COLLAR', material: 'Chaquira', color: 'Verde' },
  { sku: 'TPK3', name: 'Pañuelo Ojo Plateado', stock: 1, precio: 530, categoria: 'COLLAR', material: 'Acero Inoxidable', color: 'Azul' },

  // LOTE 5: ESCAPULARIOS Y DETENTES (EM, MV, X2)
  { sku: 'X2', name: 'Seminario Negro Chico', stock: 2, precio: 300, categoria: 'Escapulario', material: 'Cristal', color: 'Negro' },
  { sku: 'EM1', name: 'Escapulario Rosa Virgen Chico', stock: 1, precio: 200, categoria: 'Escapulario', material: 'Cristal', color: 'Rosa' },
  { sku: 'EM2', name: 'Escapulario Café con Perla Chico', stock: 1, precio: 200, categoria: 'Escapulario', material: 'Cristal', color: 'Rojo' },
  { sku: 'EM3', name: 'Escapulario Café San Benito Chico', stock: 1, precio: 200, categoria: 'Escapulario', material: 'Cristal', color: 'Blanco' },
  { sku: 'EM4', name: 'Escapulario Gris con Café Chico', stock: 1, precio: 200, categoria: 'Escapulario', material: 'Cristal', color: 'Gris' },
  { sku: 'MV1', name: 'Escapulario Morado Grande', stock: 1, precio: 250, categoria: 'Escapulario', material: 'Chaquira', color: 'Morado' },
  { sku: 'MV2', name: 'Rojo Grande con Virgen', stock: 1, precio: 250, categoria: 'Escapulario', material: 'Chaquira', color: 'Rojo' },
  { sku: 'MV3', name: 'Grande Virgen Verde', stock: 1, precio: 250, categoria: 'Escapulario', material: 'Chaquira', color: 'Verde' },
  { sku: 'MV4', name: 'San Judas Verde Grande', stock: 1, precio: 250, categoria: 'Escapulario', material: 'Chaquira', color: 'Verde' },
  { sku: 'MV5', name: 'Virgen Rosa con Café Grande', stock: 1, precio: 250, categoria: 'Escapulario', material: 'Chaquira', color: 'Café' },
  { sku: 'MV6', name: 'San Benito Rosa y Café Grande', stock: 1, precio: 250, categoria: 'Escapulario', material: 'Chaquira', color: 'Café' },
  { sku: 'MV7', name: 'San Antonio Rosa con Piedra Grande', stock: 1, precio: 230, categoria: 'Escapulario', material: 'Chaquira', color: 'Rosa' },
  { sku: 'MV8', name: 'San Benito Negro y Tornasol Grande', stock: 1, precio: 250, categoria: 'Escapulario', material: 'Chaquira', color: 'Negro' },
  { sku: 'MV9', name: 'Perla de Río y Virgen Grande', stock: 1, precio: 480, categoria: 'Escapulario', material: 'Chaquira', color: 'Blanco' },
  { sku: 'MV12', name: 'Escapulario Mano de Fátima Grande', stock: 1, precio: 150, categoria: 'Escapulario', material: 'Chaquira', color: 'Azul' },
  { sku: 'MV10', name: 'Detente Virgen Grande', stock: 1, precio: 300, categoria: 'Escapulario', material: 'Chaquira', color: 'Rosa' },
  { sku: 'MV11', name: 'Detente Corazón Grande', stock: 1, precio: 300, categoria: 'Escapulario', material: 'Chaquira', color: 'Negro' },
  { sku: 'MV13', name: 'Detente San Judas Grande', stock: 1, precio: 300, categoria: 'Escapulario', material: 'Chaquira', color: 'Verde' },

  // LOTE 6: COLLARES HOMBRE (CH, A4, A8, A10, A13)
  { sku: 'CH1', name: 'Calavera Acero Collar', stock: 1, precio: 200, categoria: 'COLLAR H', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'CH2', name: 'Cruz Acero Collar', stock: 1, precio: 200, categoria: 'COLLAR H', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'CH3', name: 'Piedra Mate con Calaveras', stock: 1, precio: 200, categoria: 'COLLAR H', material: 'Piedra Mate', color: 'Negro' },
  { sku: 'CH4', name: 'Jaspe con Obsidiana Collar', stock: 1, precio: 480, categoria: 'COLLAR H', material: 'Jaspe', color: 'Negro' },
  { sku: 'A4', name: 'Torsal Collar Dorado', stock: 4, precio: 180, categoria: 'COLLAR H', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'A8', name: 'Cadena Panza de Víbora Hombre', stock: 1, precio: 160, categoria: 'COLLAR H', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'CH5', name: 'Cadena Panza Víbora Doble Color', stock: 2, precio: 150, categoria: 'COLLAR H', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A10', name: 'Torsal Plateado Hombre', stock: 1, precio: 150, categoria: 'COLLAR H', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A13', name: 'Torsal Corto Plateado Hombre', stock: 1, precio: 180, categoria: 'COLLAR H', material: 'Acero Inoxidable', color: 'Plateado' },

  // LOTE 7: PULSERAS MUJER
  { sku: 'OTMV2', name: 'Ojo Turco Chaquira', stock: 2, precio: 250, categoria: 'PULSERA', material: 'Chaquira', color: 'Azul' },
  { sku: 'A6', name: 'Corazón Miyuki', stock: 3, precio: 150, categoria: 'PULSERA', material: 'Miyuki', color: 'Azul' },
  { sku: 'W62', name: 'Corazón Miyuki', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Miyuki', color: 'Morado' },
  { sku: 'W59', name: 'Corazón Miyuki', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Miyuki', color: 'Rojo' },
  { sku: 'I23', name: 'Tila Chica', stock: 2, precio: 150, categoria: 'PULSERA', material: 'Tila', color: 'Plateado' },
  { sku: 'I8', name: 'Tila Chica', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Tila', color: 'Negro' },
  { sku: 'I32', name: 'Tila Chica', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Tila', color: 'Azul' },
  { sku: 'I20', name: 'Tila Chica', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Tila', color: 'Azul' },
  { sku: 'I21', name: 'Tila Chica', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Tila', color: 'Rojo' },
  { sku: 'A64', name: 'Tila Nudo con Dorado', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Tila', color: 'Turquesa' },
  { sku: 'A59', name: 'Tila Nudo con Dorado', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Tila', color: 'Negro' },
  { sku: 'A60', name: 'Tila Nudo con Dorado', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Tila', color: 'Plateado' },
  { sku: 'A66', name: 'Doble Tila Dorado', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Tila', color: 'Plateado' },
  { sku: 'A68', name: 'Doble Tila Dorado', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Tila', color: 'Rosa' },
  { sku: 'A65', name: 'Doble Tila Dorado', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Tila', color: 'Rojo' },
  { sku: 'I25', name: 'Barra Tila', stock: 2, precio: 200, categoria: 'PULSERA', material: 'Tila', color: 'Dorado' },
  { sku: 'I39', name: 'Barra Tila', stock: 2, precio: 200, categoria: 'PULSERA', material: 'Tila', color: 'Azul' },
  { sku: 'I19', name: 'Barra Tila', stock: 3, precio: 200, categoria: 'PULSERA', material: 'Tila', color: 'Morado' },
  { sku: 'x55', name: 'Barra Tila', stock: 2, precio: 200, categoria: 'PULSERA', material: 'Tila', color: 'Rojo' },
  { sku: 'I10', name: 'Barra Tila', stock: 2, precio: 200, categoria: 'PULSERA', material: 'Tila', color: 'Plateado' },
  { sku: 'I37', name: 'Barra Tila', stock: 2, precio: 200, categoria: 'PULSERA', material: 'Tila', color: 'Rosa' },
  { sku: 'i42', name: 'Barra Tila', stock: 1, precio: 200, categoria: 'PULSERA', material: 'Tila', color: 'Turquesa' },
  { sku: 'I41', name: 'Barra Tila', stock: 1, precio: 200, categoria: 'PULSERA', material: 'Tila', color: 'Verde' },
  { sku: 'G58', name: 'Cadena Acero con Negro', stock: 1, precio: 260, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'G59', name: 'Cadena con Cuarzo Rosa y Jade', stock: 1, precio: 270, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'I46', name: 'Doble Cadena', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'I17', name: 'Flor de Loto con Cristal', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Cristal', color: 'Azul' },
  { sku: 'I14', name: 'Barra Cruz', stock: 1, precio: 200, categoria: 'PULSERA', material: 'Tila', color: 'Negro' },
  { sku: 'I37_2', name: 'Barra Estrellas Café', stock: 1, precio: 250, categoria: 'PULSERA', material: 'Tila', color: 'Café' },
  { sku: 'I7', name: 'Barra Corazones', stock: 1, precio: 200, categoria: 'PULSERA', material: 'Tila', color: 'Blanco' },
  { sku: 'I50', name: 'Perla con Miyuki', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Miyuki', color: 'Azul' },
  { sku: 'PM1', name: 'Cruz Pequeña con Miyuki', stock: 1, precio: 100, categoria: 'PULSERA', material: 'Miyuki', color: 'Rosa' },
  { sku: 'PM2', name: 'Cristales Pequeños e Hilo Rosa', stock: 1, precio: 80, categoria: 'PULSERA', material: 'Hilo', color: 'Rosa' },
  { sku: 'PM3', name: 'Cristales Pequeños e Hilo Café', stock: 1, precio: 80, categoria: 'PULSERA', material: 'Hilo', color: 'Café' },
  { sku: 'I22', name: 'Amatista Balines', stock: 1, precio: 200, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Morado' },
  { sku: 'b134', name: 'Balines Lapislázuli', stock: 1, precio: 200, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Azul' },
  { sku: 'I46_2', name: 'Tila Amarilla', stock: 1, precio: 200, categoria: 'PULSERA', material: 'Tila', color: 'Amarillo' },
  { sku: 'I35', name: 'Brazalete Dorado', stock: 1, precio: 280, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'BZI', name: 'Brazalete Italiano', stock: 3, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Negro' },
  { sku: 'A27', name: 'Brazalete Plateado Moño', stock: 1, precio: 200, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A21', name: 'Brazalete Corazón', stock: 1, precio: 160, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'I9', name: 'Cadena Plateada', stock: 1, precio: 70, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A20', name: 'Cadena con Perla', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A54', name: 'Cadena con Estrellas y Oso', stock: 1, precio: 200, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A18', name: 'Brazalete con Broche T', stock: 1, precio: 220, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A21_2', name: 'Esclava de Estrella', stock: 1, precio: 160, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A17', name: 'Cadena Doble Broche T', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A16', name: 'Cadena Eslabones', stock: 1, precio: 200, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'W49', name: 'Estrella con Perlas', stock: 2, precio: 100, categoria: 'PULSERA', material: 'Perla Fantasía', color: 'Blanco' },
  { sku: 'PM4', name: 'Pulsera Ágata y Pompón', stock: 1, precio: 170, categoria: 'PULSERA', material: 'Ágata', color: 'Turquesa' },
  { sku: 'PM5', name: 'Pulsera Ágata y Pompón', stock: 1, precio: 170, categoria: 'PULSERA', material: 'Ágata', color: 'Azul' },
  { sku: 'PM6', name: 'Pulsera Ágata y Pompón', stock: 3, precio: 170, categoria: 'PULSERA', material: 'Ágata', color: 'Café' },
  { sku: 'PM7', name: 'Pulsera Ágata y Pompón', stock: 5, precio: 170, categoria: 'PULSERA', material: 'Ágata', color: 'Multicolor' },
  { sku: 'PM8', name: 'Pulsera Ágata y Pompón', stock: 2, precio: 170, categoria: 'PULSERA', material: 'Ágata', color: 'Blanco' },
  { sku: 'PM9', name: 'Pulsera Ágata y Pompón', stock: 1, precio: 170, categoria: 'PULSERA', material: 'Ágata', color: 'Rosa' },
  { sku: 'Y-26', name: 'Pulsera Ojo Turco Acero con Plateado', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Morado' },
  { sku: 'y-22', name: 'Pulsera Ojo Turco Acero con Plateado', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Azul' },
  { sku: 'Y-31', name: 'Pulsera Ojo Turco Acero con Plateado', stock: 2, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Multicolor' },
  { sku: 'F27', name: 'Pulsera Ojo Turco Acero con Plateado', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Azul' },
  { sku: 'Y16', name: 'Pulsera Ojo Turco Acero con Plateado', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Rojo' },
  { sku: 'PM10', name: 'Pulsera Ojo Turco Acero con Plateado', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Rosa' },
  { sku: 'y-25', name: 'Pulsera Ojo Turco Acero con Plateado', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Multicolor' },
  { sku: 'Y8', name: 'Pulsera Ojo Turco Acero Dorado', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Morado' },
  { sku: 'y12', name: 'Pulsera Ojo Turco Acero Dorado', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Blanco' },
  { sku: 'y24', name: 'Pulsera Ojo Turco Acero Dorado', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Multicolor' },
  { sku: 'y25', name: 'Pulsera Ojo Turco Acero Dorado', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Café' },
  { sku: 'PM11', name: 'Pulsera Plateada Estrellas', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Plateado' },
  { sku: 'PM12', name: 'Pulsera Plateada Estrellas', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Plateado' },
  { sku: 'PM13', name: 'Pulsera Plateada Estrellas', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Plateado' },
  { sku: 'PM14', name: 'Pulsera Plateada Estrellas', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Plateado' },
  { sku: 'PM15', name: 'Pulsera Plateada Estrellas', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Plateado' },
  { sku: 'PM16', name: 'Pulsera Estrella Dorada', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Dorado' },
  { sku: 'PM17', name: 'Pulsera Estrella Dorada', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Dorado' },
  { sku: 'PM18', name: 'Pulsera Estrella Dorada', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Dorado' },
  { sku: 'PM19', name: 'Pulsera Estrella Dorada', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Dorado' },
  { sku: 'PM20', name: 'Pulsera Estrella Dorada', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Dorado' },
  { sku: 'PM21', name: 'Pulsera Estrella Dorada', stock: 1, precio: 120, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Dorado' },
  { sku: 'PM22', name: 'Cordón Jaspe Gris', stock: 3, precio: 180, categoria: 'PULSERA', material: 'Cordón', color: 'Gris' },
  { sku: 'PM23', name: 'Cordón Jaspe Negro', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Cordón', color: 'Negro' },
  { sku: 'PM24', name: 'Cordón Jaspe Café', stock: 3, precio: 180, categoria: 'PULSERA', material: 'Cordón', color: 'Café' },
  { sku: 'PM25', name: 'Pscho Verde Flor', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Verde' },
  { sku: 'I36', name: 'Pscho Flor', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Amarillo' },
  { sku: 'I16', name: 'Pscho Flor', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Negro' },
  { sku: 'I29', name: 'Pscho Cristales Separados', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Tornasol' },
  { sku: 'PM26', name: 'Pscho Cristales Gay', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Multicolor' },
  { sku: 'PM27', name: 'Pscho Cristal Separado', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Multicolor' },
  { sku: 'PM28', name: 'Pscho Cristal con Ojo Turco Rosa y Verde', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Rosa' },
  { sku: 'PM29', name: 'Pscho Cristal con Ojo Turco Azul', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Azul' },
  { sku: 'PM30', name: 'Pscho Cristal Azul con Rosa', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Azul' },
  { sku: 'PM31', name: 'Pscho Morado y Cristal', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Morado' },
  { sku: 'PM32', name: 'Pscho Negro con Cristales', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Negro' },
  { sku: 'PM33', name: 'Pscho Ojo Turco Separados', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Azul' },
  { sku: 'PM34', name: 'Mano de Fátima y Cristales', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Rojo' },
  { sku: 'PM35', name: 'Pscho Ojo Turco Separados', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Blanco' },
  { sku: 'PM36', name: 'Pscho Ojo Turco Separados', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Rojo' },
  { sku: 'PM37', name: 'Pscho Ojo Turco Separados', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Azul' },
  { sku: 'PM38', name: 'Pscho Ojo Turco Separados', stock: 4, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Negro' },
  { sku: 'PM39', name: 'Pscho Ojo Turco Separados', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Rosa' },
  { sku: 'PM40', name: 'Pscho Ojo Turco Separados', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Verde' },
  { sku: 'PM41', name: 'Pscho Ojo Turco Separados', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Morado' },
  { sku: 'PM42', name: 'Pscho Cristales Separados', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Plateado' },
  { sku: 'PM43', name: 'Pscho Cristales Separados Cherry', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Rojo' },
  { sku: 'PM44', name: 'Pscho Cristales Separados', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Rojo' },
  { sku: 'PM45', name: 'Pscho Cristales Separados', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Negro' },
  { sku: 'PM46', name: 'Pscho Cristales Estrella', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Rosa' },
  { sku: 'PM47', name: 'Pscho Cristales Juntos', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Café' },
  { sku: 'PM48', name: 'Pscho Cristales Juntos', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Azul' },
  { sku: 'PM49', name: 'Pscho Cristales Juntos', stock: 2, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Azul' },
  { sku: 'I6', name: 'Cordón con Corazón', stock: 1, precio: 250, categoria: 'PULSERA', material: 'Cordón', color: 'Azul' },
  { sku: 'PM50', name: 'Santos Pulsera', stock: 3, precio: 180, categoria: 'PULSERA', material: 'Hilo', color: 'Multicolor' },
  { sku: 'B2', name: 'Pulsera Básica Ojo Turco Azul', stock: 10, precio: 100, categoria: 'PULSERA', material: 'Hilo', color: 'Azul' },
  { sku: 'B1', name: 'Pulsera Básica Roja', stock: 6, precio: 100, categoria: 'PULSERA', material: 'Hilo', color: 'Rojo' },
  { sku: 'B3', name: 'Pulsera Básica Negra', stock: 4, precio: 100, categoria: 'PULSERA', material: 'Hilo', color: 'Negro' },
  { sku: 'B5', name: 'Pulsera Básica Verde', stock: 1, precio: 100, categoria: 'PULSERA', material: 'Hilo', color: 'Verde' },
  { sku: 'O40', name: 'Pulsera Dragoncito Amarilla', stock: 1, precio: 200, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Amarillo' },
  { sku: 'PM51', name: 'Pscho Gay Juntas', stock: 1, precio: 180, categoria: 'PULSERA', material: 'Chapa de Oro', color: 'Multicolor' },
  { sku: 'PM52', name: 'Cadena Broche T', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'A23', name: 'Hilo con Virgen Guadalupe', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Hilo', color: 'Rosa' },
  { sku: 'PM51_2', name: 'Ojo Turco con Piedra Natural', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Hilo', color: 'Azul' },
  { sku: 'PM52_2', name: 'Ojo Turco con Piedra Natural', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Hilo', color: 'Azul' },
  { sku: 'PM53', name: 'Ojo Turco con Piedra Natural', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Hilo', color: 'Turquesa' },
  { sku: 'PM54', name: 'Ojo Turco con Piedra Natural', stock: 2, precio: 150, categoria: 'PULSERA', material: 'Hilo', color: 'Rosa' },
  { sku: 'PM55', name: 'Ojo Turco con Piedra Natural', stock: 1, precio: 150, categoria: 'PULSERA', material: 'Hilo', color: 'Morado' },
  { sku: 'PM57', name: 'Ojo Turco Perla de Río', stock: 1, precio: 130, categoria: 'PULSERA', material: 'Perla de Río', color: 'Blanco' },
  { sku: 'PM58', name: 'Ojo Turco Hilo Rojo', stock: 4, precio: 60, categoria: 'PULSERA', material: 'Hilo', color: 'Rojo' },

  // LOTE 8: TOBILLERAS
  { sku: 'F51', name: 'Tobillera Dorada con Perla', stock: 1, precio: 150, categoria: 'TOBILLERA', material: 'Acero Inoxidable', color: 'Blanco' },
  { sku: 'F55', name: 'Tobillera Plateada con Gemas de Colores', stock: 1, precio: 150, categoria: 'TOBILLERA', material: 'Acero Inoxidable', color: 'Plateado' },
  { sku: 'F66', name: 'Tobillera Serpiente', stock: 1, precio: 160, categoria: 'TOBILLERA', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'F53', name: 'Tobillera Ojo Turco Rojo', stock: 1, precio: 150, categoria: 'TOBILLERA', material: 'Acero Inoxidable', color: 'Rojo' },
  { sku: 'F54', name: 'Tobillera Dorada con Gemas', stock: 1, precio: 160, categoria: 'TOBILLERA', material: 'Acero Inoxidable', color: 'Dorado' },
  { sku: 'B156', name: 'Tobillera Dorada Doble con Perla Fantasía', stock: 1, precio: 150, categoria: 'TOBILLERA', material: 'Acero Inoxidable', color: 'Dorado' },

  // LOTE 9: LLAVEROS
  { sku: 'LLA', name: 'Llavero Grande Ojo Turco', stock: 2, precio: 120, categoria: 'LLAVERO', material: 'Cristal', color: 'Azul' },
  { sku: 'LL1', name: 'Llavero Colorido', stock: 9, precio: 80, categoria: 'LLAVERO', material: 'Cristal', color: 'Multicolor' },

  // LOTE 10: KARMA KIDS
  { sku: 'K1', name: 'Collar Pucca', stock: 1, precio: 150, categoria: 'COLLAR KIDS', material: 'Chapa de Oro', color: 'Multicolor' },
];

// Helper to normalize material name
export function normalizeMaterial(m: string): string {
  const clean = m.trim().toLowerCase();
  if (clean.includes('jaspe')) return 'Jaspe';
  if (clean.includes('halcon') || clean.includes('halcón')) return 'Ojo de Halcón';
  if (clean.includes('ojo de tigre') || clean.includes('tigre')) return 'Ojo de Tigre';
  if (clean.includes('onix') || clean.includes('ónix')) return 'Ónix';
  if (clean.includes('volcanica') || clean.includes('volcánica') || clean.includes('colcanica')) return 'Piedra Volcánica';
  if (clean.includes('turquesina') || clean.includes('tuquesina')) return 'Turquesina';
  if (clean.includes('agata') || clean.includes('ágata')) return 'Ágata';
  if (clean.includes('jade')) return 'Jade';
  if (clean.includes('amazonita')) return 'Amazonita';
  if (clean.includes('madera')) return 'Madera';
  if (clean.includes('hematita')) return 'Hematita';
  if (clean.includes('venturina') || clean.includes('aventurina')) return 'Aventurina';
  if (clean.includes('domolina')) return 'Domolina';
  if (clean.includes('chip')) return 'Cuarzo Chip';
  if (clean.includes('cuero')) return 'Cuero';
  if (clean.includes('acerina')) return 'Acerina';
  if (clean.includes('lapislazuli') || clean.includes('lapislázuli')) return 'Lapislázuli';
  if (clean.includes('gato')) return 'Ojo de Gato';
  if (clean.includes('calcedonia')) return 'Calcedonia';
  if (clean.includes('obsidiana')) return 'Obsidiana';
  if (clean.includes('mate')) return 'Piedra Mate';
  if (clean.includes('plata')) return 'Plata .925';
  if (clean.includes('oro')) return 'Chapa de Oro';
  if (clean.includes('acero')) return 'Acero Inoxidable';
  if (clean.includes('miyuki')) return 'Miyuki';
  if (clean.includes('chakira') || clean.includes('chaquira')) return 'Chaquira';
  return m.trim();
}

// Helper to normalize color
export function normalizeColor(c: string): string {
  const clean = c.trim().toLowerCase();
  if (clean.includes('azul')) return 'Azul';
  if (clean.includes('negro')) return 'Negro';
  if (clean.includes('rojo') || clean.includes('roja')) return 'Rojo';
  if (clean.includes('verde')) return 'Verde';
  if (clean.includes('cafe') || clean.includes('café')) return 'Café';
  if (clean.includes('rosa')) return 'Rosa';
  if (clean.includes('dorado')) return 'Dorado';
  if (clean.includes('blanco')) return 'Blanco';
  if (clean.includes('plateado') || clean.includes('plata')) return 'Plateado';
  if (clean.includes('morado')) return 'Morado';
  return c.trim();
}

// Convert CSV rows into full Product instances
export function transformCsvToProducts(): Product[] {
  return RAW_CSV_DATA.map((row, idx) => {
    const normMaterial = normalizeMaterial(row.material);
    const normColor = normalizeColor(row.color);
    
    // Categorize product type based on row.categoria and row.name
    const catUpper = (row.categoria || '').toUpperCase().trim();
    const lowerName = row.name.toLowerCase();
    
    let category = 'Pulseras';
    if (catUpper === 'PULSERA') {
      category = 'Pulseras'; // Explícito: evita que "Cadena ..." caiga en Collares
    } else if (catUpper === 'TOBILLERA') {
      category = 'Tobilleras';
    } else if (catUpper === 'LLAVERO') {
      category = 'Llaveros';
    } else if (catUpper.includes('ANILLO') || lowerName.includes('anillo')) {
      category = 'Anillos';
    } else if (catUpper.includes('ARRACADA') || lowerName.includes('arracada')) {
      category = 'Arracadas';
    } else if (catUpper.includes('HOOPS') || lowerName.includes('hoops') || lowerName.includes('hoop')) {
      category = 'Arracadas'; // Hoops se clasifican con Arracadas
    } else if (catUpper.includes('ESCAPULARIO') || lowerName.includes('escapulario') || lowerName.includes('detente') || lowerName.includes('seminario')) {
      category = 'Escapularios';
    } else if (catUpper.includes('COLLAR') || lowerName.includes('collar') || lowerName.includes('torsal') || lowerName.includes('rosario') || lowerName.includes('cadena') || lowerName.includes('choker') || lowerName.includes('pañuelo')) {
      category = 'Collares';
    } else if (lowerName.includes('dije') || catUpper.includes('DIJE')) {
      category = 'Dijes';
    } else if (lowerName.includes('arete') || catUpper.includes('ARETE')) {
      category = 'Aretes';
    } else if (catUpper === 'PH') {
      category = 'Pulseras';
    }

    // Determine target gender:
    let gender: ProductGender = 'Unisex';
    if (catUpper.includes('HOMBRE') || catUpper === 'COLLAR H' || catUpper === 'PH' || row.sku.startsWith('PH') || row.sku.startsWith('CH') || row.sku.startsWith('IH') || row.sku === 'H18' || row.sku === 'H25' || row.sku === 'AHD' || row.sku === 'AHP' || row.sku === 'A4' || row.sku === 'A8' || row.sku === 'A10' || row.sku === 'A13') {
      gender = 'Hombre';
    } else if (lowerName.includes('mujer') || lowerName.includes('dama') || catUpper === 'COLLAR' || catUpper === 'PULSERA' || catUpper === 'TOBILLERA' || catUpper === 'ANILLO MUJER' || row.sku.startsWith('CM') || row.sku.startsWith('TCM') || row.sku.startsWith('AMV') || row.sku.startsWith('EM') || row.sku.startsWith('MV') || row.sku.startsWith('PK')) {
      gender = 'Mujer';
    }
    if (lowerName.includes('unisex')) {
      gender = 'Unisex';
    }

    // Curated high quality gemstone/jewelry placeholders
    const jewelryImages = [
      'https://images.unsplash.com/photo-1611591475811-137812e96d11?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80',
    ];
    const imgUrl = jewelryImages[idx % jewelryImages.length];

    // Capitalize first letter of name
    const formattedName = row.name.charAt(0).toUpperCase() + row.name.slice(1);

    return {
      product_id: `prod_csv_${row.sku.toLowerCase()}`,
      name: formattedName,
      category,
      gender,
      material: normMaterial,
      color: normColor,
      image_url: imgUrl,
      description: `Joyería artesanal Karma: ${formattedName}. Confeccionada con ${normMaterial}, detalles en tonalidad ${normColor}. Línea para ${gender}.`,
      variants: [
        {
          variant_id: `var_${row.sku.toLowerCase()}`,
          product_id: `prod_csv_${row.sku.toLowerCase()}`,
          title: `${normMaterial} / ${normColor}`,
          sku: row.sku,
          color_alloy: normColor,
          stone_charm: normMaterial,
          unit_price: row.precio,
          gender,
          material: normMaterial,
          // Stock initial distribution: priority to AGS showroom
          stock_ags: row.stock,
          stock_cdmx: 0,
          stock_in_transit_cdmx: 0,
          stock_layaway_reserved: 0,
          stock_shopify_synced: row.stock,
          bom_items: [
            {
              material_id: `mat_${row.sku.toLowerCase()}`,
              material_name: normMaterial,
              quantity: 1,
              unit: 'pza',
              unit_cost: +(row.precio * 0.35).toFixed(2),
            },
          ],
          avg_assembly_minutes: 20,
          labor_minute_rate: 2.5,
        },
      ],
    };
  });
}
