/**
 * Obtiene un GeoJSON desde una ruta local o URL de API REST.
 * Para conectar una API externa, basta con pasar la URL completa como `path`.
 * @param {string} path - Ruta relativa al archivo o URL del endpoint
 * @returns {Promise<object|null>} GeoJSON o null si ocurre un error
 */
export async function fetchGeoJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.error(`Error al obtener ${path}: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error de red al obtener ${path}:`, error);
    return null;
  }
}
