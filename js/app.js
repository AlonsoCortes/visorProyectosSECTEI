import { initMap } from './map/init.js';
import { registerMapEvents } from './map/events.js';
import { loadLayer } from './layers/manager.js';
import { DATA_PATHS } from './config.js';

const map = initMap();

map.on('load', async () => {
  await loadLayer(map, DATA_PATHS.ejemplo, 'ejemplo', {
    'circle-radius': 6,
    'circle-color': '#C8102E',
    'circle-stroke-width': 1,
    'circle-stroke-color': '#ffffff',
  });

  registerMapEvents(map, ['ejemplo']);
});
