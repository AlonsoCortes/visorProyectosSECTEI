export const MAP_CONFIG = {
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [-99.1332, 19.4326], // Ciudad de México
  zoom: 10,
};

// Rutas a los datos GeoJSON estáticos.
// Cuando exista una API REST, reemplazar con la URL base del servidor.
export const DATA_PATHS = {
  ejemplo: 'data/ejemplo.geojson',
};
