import { filterFeatures, getFilteredProjects, getTiposForCampo } from './data/transform.js';

const _state = {
  allPointFeatures: [],
  projectsMap: new Map(),
  selectedCampo: null,
  selectedTipo: null,
  selectedProjectId: null,
};

const _listeners = { change: [], select: [] };

function emit(event, payload) {
  (_listeners[event] ?? []).forEach((fn) => fn(payload));
}

export function on(event, fn) {
  if (_listeners[event]) _listeners[event].push(fn);
}

export function init(pointFeatures, projectsMap) {
  _state.allPointFeatures = pointFeatures.features;
  _state.projectsMap = projectsMap;
  emit('change', buildPayload());
}

export function setCampo(campo) {
  _state.selectedCampo = campo || null;
  _state.selectedTipo = null;
  emit('change', buildPayload());
}

export function setTipo(tipo) {
  _state.selectedTipo = tipo || null;
  emit('change', buildPayload());
}

export function selectProject(idProyecto) {
  _state.selectedProjectId = idProyecto;
  const features = _state.projectsMap.get(idProyecto) ?? [];
  const instituciones = features
    .map((f) => ({ raiz: f.properties._institucion_raiz, unidad: f.properties._unidad }))
    .filter((i) => i.raiz || i.unidad);
  const props = (features.find((f) => f.geometry !== null) ?? features[0])?.properties ?? {};
  const coords = features.filter((f) => f.geometry !== null).map((f) => f.geometry.coordinates);
  emit('select', { id: idProyecto, props, instituciones, coords });
}

export function getSelectedId() {
  return _state.selectedProjectId;
}

export function getAvailableTipos() {
  return getTiposForCampo(_state.projectsMap, _state.selectedCampo);
}

function buildPayload() {
  return {
    filteredGeoJSON: filterFeatures(_state.allPointFeatures, _state.selectedCampo, _state.selectedTipo),
    filteredProjects: getFilteredProjects(_state.projectsMap, _state.selectedCampo, _state.selectedTipo),
    selectedCampo: _state.selectedCampo,
    selectedTipo: _state.selectedTipo,
    availableTipos: getTiposForCampo(_state.projectsMap, _state.selectedCampo),
  };
}
