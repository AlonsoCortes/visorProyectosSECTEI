/**
 * Agrega una fuente GeoJSON y su capa de puntos/líneas/polígonos al mapa.
 * @param {maplibregl.Map} map
 * @param {string} id - Identificador único para la fuente y la capa
 * @param {object} geojsonData - Objeto GeoJSON
 * @param {object} [paintOptions={}] - Opciones de estilo de la capa
 */
export function addGeoJSONLayer(map, id, geojsonData, paintOptions = {}) {
  if (map.getSource(id)) return;

  map.addSource(id, { type: 'geojson', data: geojsonData });

  const geometryType = geojsonData.features?.[0]?.geometry?.type ?? 'Point';
  const layerType = resolveLayerType(geometryType);

  map.addLayer({
    id,
    type: layerType,
    source: id,
    paint: paintOptions,
  });
}

/**
 * Reemplaza los datos de una capa GeoJSON existente.
 * @param {maplibregl.Map} map
 * @param {string} id
 * @param {object} geojsonData
 */
export function updateGeoJSONLayer(map, id, geojsonData) {
  const source = map.getSource(id);
  if (source) source.setData(geojsonData);
}

function resolveLayerType(geometryType) {
  if (geometryType.includes('Polygon')) return 'fill';
  if (geometryType.includes('LineString')) return 'line';
  return 'circle';
}
