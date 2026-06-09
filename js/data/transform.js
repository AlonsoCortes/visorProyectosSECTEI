/**
 * Transforma el GeoJSON crudo en las estructuras que necesita la app.
 *
 * @param {object} rawGeoJSON - FeatureCollection original
 * @returns {{
 *   pointFeatures: object,   // FeatureCollection solo con geometry != null
 *   projectsMap: Map,        // id_proyecto → [features] (todos, incluye sin geo)
 *   uniqueCampos: string[],  // valores únicos de campo_estudio ordenados
 *   uniqueTipos: string[],   // valores únicos de tipo_proyecto ordenados
 * }}
 */
export function transformData(rawGeoJSON) {
  const features = rawGeoJSON.features ?? [];

  const projectsMap = new Map();
  for (const f of features) {
    const id = f.properties.id_proyecto;
    if (!projectsMap.has(id)) projectsMap.set(id, []);
    projectsMap.get(id).push(f);
  }

  const pointFeatures = {
    type: 'FeatureCollection',
    features: features.filter((f) => f.geometry !== null),
  };

  const campos = new Set();
  const tipos = new Set();
  for (const f of features) {
    if (f.properties.campo_estudio) campos.add(f.properties.campo_estudio);
    if (f.properties.tipo_proyecto) tipos.add(f.properties.tipo_proyecto);
  }

  return {
    pointFeatures,
    projectsMap,
    uniqueCampos: [...campos].sort(),
    uniqueTipos: [...tipos].sort(),
  };
}

/**
 * Devuelve los tipo_proyecto disponibles para un campo_estudio dado.
 * Si campo es null devuelve todos.
 * @param {Map} projectsMap
 * @param {string|null} campo
 * @returns {string[]}
 */
export function getTiposForCampo(projectsMap, campo) {
  const tipos = new Set();
  for (const features of projectsMap.values()) {
    for (const f of features) {
      if (!campo || f.properties.campo_estudio === campo) {
        if (f.properties.tipo_proyecto) tipos.add(f.properties.tipo_proyecto);
      }
    }
  }
  return [...tipos].sort();
}

/**
 * Filtra los features de punto según campo y tipo seleccionados.
 * @param {object[]} allPointFeatures
 * @param {string|null} campo
 * @param {string|null} tipo
 * @returns {object} FeatureCollection filtrado
 */
export function filterFeatures(allPointFeatures, campo, tipo) {
  const filtered = allPointFeatures.filter((f) => {
    const matchCampo = !campo || f.properties.campo_estudio === campo;
    const matchTipo = !tipo || f.properties.tipo_proyecto === tipo;
    return matchCampo && matchTipo;
  });
  return { type: 'FeatureCollection', features: filtered };
}

/**
 * Devuelve proyectos únicos (agrupados por id_proyecto) que pasan el filtro.
 * Incluye proyectos sin geometría.
 * @param {Map} projectsMap
 * @param {string|null} campo
 * @param {string|null} tipo
 * @returns {{ id: number, props: object, hasGeometry: boolean }[]}
 */
export function getFilteredProjects(projectsMap, campo, tipo) {
  const projects = [];
  for (const [id, features] of projectsMap) {
    const matches = features.some((f) => {
      const matchCampo = !campo || f.properties.campo_estudio === campo;
      const matchTipo = !tipo || f.properties.tipo_proyecto === tipo;
      return matchCampo && matchTipo;
    });
    if (!matches) continue;

    const representative = features.find((f) => f.geometry !== null) ?? features[0];
    const hasGeometry = features.some((f) => f.geometry !== null);
    const instituciones = features
      .map((f) => ({ raiz: f.properties._institucion_raiz, unidad: f.properties._unidad }))
      .filter((i) => i.raiz || i.unidad);

    projects.push({ id, props: representative.properties, hasGeometry, instituciones });
  }
  return projects;
}
