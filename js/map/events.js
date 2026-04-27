import { showPopup } from '../ui/popup.js';

/**
 * Registra los eventos de interacción del mapa para las capas indicadas.
 * @param {maplibregl.Map} map
 * @param {string[]} layerIds - IDs de las capas que responden a eventos
 */
export function registerMapEvents(map, layerIds = []) {
  layerIds.forEach((layerId) => {
    map.on('click', layerId, (e) => {
      const feature = e.features[0];
      if (!feature) return;
      showPopup(map, e.lngLat, feature.properties);
    });

    map.on('mouseenter', layerId, () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', layerId, () => {
      map.getCanvas().style.cursor = '';
    });
  });
}
