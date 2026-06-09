import { CAMPO_COLORS, CAMPO_COLOR_DEFAULT } from '../config.js';

const SOURCE_ID = 'proyectos';
const LAYER_CLUSTER = 'clusters';
const LAYER_COUNT = 'cluster-count';
const LAYER_POINTS = 'proyectos-points';
// Expresión MapLibre match para colorear puntos por campo_estudio
const colorExpression = [
  'match',
  ['get', 'campo_estudio'],
  ...Object.entries(CAMPO_COLORS).flat(),
  CAMPO_COLOR_DEFAULT,
];

export function addClusterSource(map, geojsonData) {
  map.addSource(SOURCE_ID, {
    type: 'geojson',
    data: geojsonData,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 100,
  });

  map.addLayer({
    id: LAYER_CLUSTER,
    type: 'circle',
    source: SOURCE_ID,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step', ['get', 'point_count'],
        '#90A4AE', 10,
        '#546E7A', 50,
        '#263238',
      ],
      'circle-radius': [
        'step', ['get', 'point_count'],
        18, 10,
        24, 50,
        32,
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  });

  map.addLayer({
    id: LAYER_COUNT,
    type: 'symbol',
    source: SOURCE_ID,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 13,
    },
    paint: {
      'text-color': '#ffffff',
    },
  });

  map.addLayer({
    id: LAYER_POINTS,
    type: 'circle',
    source: SOURCE_ID,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': colorExpression,
      'circle-radius': 7,
      'circle-stroke-width': 1.5,
      'circle-stroke-color': '#ffffff',
    },
  });
}

export function updateClusterSource(map, geojsonData) {
  map.getSource(SOURCE_ID)?.setData(geojsonData);
}

export const CLUSTER_LAYER_ID = LAYER_CLUSTER;
export const POINTS_LAYER_ID = LAYER_POINTS;
