import { showPopup } from '../ui/popup.js';
import { CLUSTER_LAYER_ID, POINTS_LAYER_ID } from './clusters.js';

/**
 * Registra eventos de interacción del mapa.
 * @param {maplibregl.Map} map
 * @param {Function} onPointClick - callback(id_proyecto) al seleccionar un punto
 */
export function registerMapEvents(map, onPointClick) {

  // Clic en cluster → hacer zoom
  map.on('click', CLUSTER_LAYER_ID, async (e) => {
    const feature = e.features[0];
    if (!feature) return;

    const clusterId = feature.properties.cluster_id;
    const center    = feature.geometry.coordinates;

    try {
      const zoom = await map.getSource('proyectos').getClusterExpansionZoom(clusterId);
      map.easeTo({ center, zoom });
    } catch (_) {
      map.easeTo({ center, zoom: map.getZoom() + 2 });
    }
  });

  // Clic en punto individual → puebla panel derecho + popup
  map.on('click', POINTS_LAYER_ID, (e) => {
    const feature = e.features[0];
    if (!feature) return;
    onPointClick?.(feature.properties.id_proyecto);
    showPopup(map, e.lngLat, feature.properties, (idProyecto) => {
      onPointClick?.(idProyecto);
    });
  });

  map.on('mouseenter', CLUSTER_LAYER_ID, () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', CLUSTER_LAYER_ID, () => { map.getCanvas().style.cursor = ''; });
  map.on('mouseenter', POINTS_LAYER_ID,  () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', POINTS_LAYER_ID,  () => { map.getCanvas().style.cursor = ''; });
}
