import { CAMPO_COLORS, CAMPO_COLOR_DEFAULT } from '../config.js';

// maplibregl is available as a global loaded via <script> in index.html

let activePopup = null;

/**
 * Muestra un popup con información básica del punto seleccionado.
 * @param {maplibregl.Map} map
 * @param {maplibregl.LngLatLike} coordinates
 * @param {object} properties
 * @param {Function} onVerDetalle - callback al pulsar "Ver detalle"
 */
export function showPopup(map, coordinates, properties, onVerDetalle) {
  if (activePopup) activePopup.remove();

  const color = CAMPO_COLORS[properties.campo_estudio] ?? CAMPO_COLOR_DEFAULT;
  const titulo = properties._titulo_normalizado ?? 'Sin título';
  const truncated = titulo.length > 90 ? titulo.slice(0, 90) + '…' : titulo;

  const html = `
    <div class="popup-content">
      <span class="popup-campo-badge" style="background:${color}">${properties.campo_estudio ?? ''}</span>
      <p class="popup-title">${truncated}</p>
      <dl class="popup-dl">
        <dt>Tipo</dt><dd>${properties.tipo_proyecto ?? '—'}</dd>
        <dt>Institución</dt><dd>${properties._institucion_raiz ?? '—'}</dd>
        <dt>Unidad</dt><dd>${properties._unidad ?? '—'}</dd>
        <dt>Año / Folio</dt><dd>${properties.año_proyecto ?? '—'} · ${properties.Folio ?? '—'}</dd>
      </dl>
      <button class="popup-detail-btn" id="popup-detail-btn">Ver detalle completo</button>
    </div>`;

  activePopup = new maplibregl.Popup({ closeButton: true, maxWidth: '340px' })
    .setLngLat(coordinates)
    .setHTML(html)
    .addTo(map);

  activePopup.on('open', () => {
    document.getElementById('popup-detail-btn')?.addEventListener('click', () => {
      onVerDetalle?.(properties.id_proyecto);
      activePopup?.remove();
    });
  });

  activePopup.on('close', () => { activePopup = null; });
}
