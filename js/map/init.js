import { MAP_CONFIG } from '../config.js';

// maplibregl is available as a global loaded via <script> in index.html

/**
 * Crea e inicializa el mapa MapLibre en el contenedor indicado.
 * @returns {maplibregl.Map}
 */
export function initMap() {
  const map = new maplibregl.Map(MAP_CONFIG);

  map.addControl(new maplibregl.NavigationControl(), 'top-right');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

  return map;
}
