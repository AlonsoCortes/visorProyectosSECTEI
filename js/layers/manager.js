import { fetchGeoJSON } from '../api/client.js';
import { addGeoJSONLayer } from './geojson.js';

/**
 * Carga un archivo GeoJSON desde la ruta indicada y lo agrega como capa al mapa.
 * @param {maplibregl.Map} map
 * @param {string} dataPath - Ruta al archivo GeoJSON (local o URL de API)
 * @param {string} layerId - Identificador de la capa
 * @param {object} [paintOptions={}]
 * @returns {Promise<void>}
 */
export async function loadLayer(map, dataPath, layerId, paintOptions = {}) {
  const data = await fetchGeoJSON(dataPath);
  if (!data) return;
  addGeoJSONLayer(map, layerId, data, paintOptions);
}
