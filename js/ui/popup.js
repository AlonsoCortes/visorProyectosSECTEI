import maplibregl from 'https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.esm.js';

let activePopup = null;

/**
 * Muestra un popup en el mapa con las propiedades del feature seleccionado.
 * Si ya existe un popup abierto, lo reemplaza.
 * @param {maplibregl.Map} map
 * @param {maplibregl.LngLatLike} coordinates
 * @param {object} properties - Propiedades del feature GeoJSON
 */
export function showPopup(map, coordinates, properties) {
  if (activePopup) activePopup.remove();

  const html = buildPopupHTML(properties);

  activePopup = new maplibregl.Popup({ closeButton: true, maxWidth: '320px' })
    .setLngLat(coordinates)
    .setHTML(html)
    .addTo(map);

  activePopup.on('close', () => { activePopup = null; });
}

function buildPopupHTML(properties) {
  const rows = Object.entries(properties)
    .map(([key, value]) => `<tr><th>${key}</th><td>${value ?? '—'}</td></tr>`)
    .join('');
  return `<div class="popup-content"><table class="popup-table">${rows}</table></div>`;
}
