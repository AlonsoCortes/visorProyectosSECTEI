import { initMap } from './map/init.js';
import { registerMapEvents } from './map/events.js';
import { addClusterSource, updateClusterSource } from './map/clusters.js';
import { fetchGeoJSON } from './api/client.js';
import { transformData } from './data/transform.js';
import * as state from './state.js';
import { initFilters } from './ui/filters.js';
import { initList } from './ui/list.js';
import { initDetail } from './ui/detail.js';
import { initLegend } from './ui/legend.js';
import { DATA_PATHS } from './config.js';

const map = initMap();

map.on('load', async () => {
  const raw = await fetchGeoJSON(DATA_PATHS.proyectos);
  if (!raw) return;

  const { pointFeatures, projectsMap, uniqueCampos } = transformData(raw);

  // Inicializa estado global
  state.init(pointFeatures, projectsMap);

  // Capa de clusters con todos los puntos
  addClusterSource(map, pointFeatures);

  // Cuando cambia el filtro → actualiza fuente del mapa
  state.on('change', ({ filteredGeoJSON }) => {
    updateClusterSource(map, filteredGeoJSON);
  });

  // Inicializa componentes UI
  initLegend();
  initFilters(uniqueCampos);
  initDetail();
  initList((idProyecto) => {
    // Al seleccionar desde la lista → vuela al primer punto del proyecto
    const features = projectsMap.get(idProyecto) ?? [];
    const withGeo = features.find((f) => f.geometry !== null);
    if (withGeo) {
      map.flyTo({ center: withGeo.geometry.coordinates, zoom: 14, speed: 1.2 });
    }
  });

  // Eventos del mapa → selección de proyecto
  registerMapEvents(map, (idProyecto) => {
    state.selectProject(idProyecto);
  });
});
