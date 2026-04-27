import maplibregl from 'https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.esm.js';
import { MAP_CONFIG } from '../config.js';

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
