# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Desarrollo local

No hay build tool ni package.json. Para servir el proyecto localmente (requerido por ES6 modules):

```bash
python -m http.server 8080
```

O usar la extensión **Live Server** de VSCode. El visor queda disponible en `http://localhost:8080`.

> **No abrir `index.html` directamente con `file://`** — los módulos ES6 y el fetch a archivos locales fallarán.

## Despliegue

El proyecto se despliega en **GitHub Pages** directamente desde la raíz de la rama `main`. Configurar en Settings > Pages > Branch: `main` / `/ (root)`. No hay paso de build.

## Arquitectura

SPA vanilla (HTML + CSS + JS ES6 nativo). Sin bundler, sin framework. MapLibre GL JS v4 se carga desde CDN vía ESM:

```
https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.esm.js
```

**Flujo de arranque** (`js/app.js`):
1. `initMap()` — crea el mapa MapLibre con la config de `js/config.js`
2. `map.on('load')` — cuando el mapa está listo:
   - `loadLayer()` — fetch del GeoJSON + añade fuente y capa al mapa
   - `registerMapEvents()` — registra eventos `click`/`mouseenter` en las capas

**Módulos y responsabilidades:**

| Módulo | Responsabilidad |
|---|---|
| `js/config.js` | Configuración central: `MAP_CONFIG` (estilo, centro, zoom) y `DATA_PATHS` (rutas a GeoJSON) |
| `js/map/init.js` | Instancia `maplibregl.Map` y añade controles de navegación/escala |
| `js/map/events.js` | Registra eventos del mapa por ID de capa; delega al popup en clicks |
| `js/layers/geojson.js` | `addGeoJSONLayer` / `updateGeoJSONLayer` — gestiona fuentes y capas MapLibre. Detecta el tipo de geometría para elegir `circle`, `line` o `fill` automáticamente |
| `js/layers/manager.js` | Orquesta fetch + adición de capa; es el punto de entrada para cargar capas |
| `js/api/client.js` | `fetchGeoJSON(path)` — wrapper de fetch. `path` puede ser ruta local o URL de API REST |
| `js/ui/popup.js` | Mantiene un único popup activo. `showPopup()` genera una tabla HTML con las propiedades del feature |

## Agregar una nueva capa

1. Colocar el GeoJSON en `data/` o definir una URL en `js/config.js` dentro de `DATA_PATHS`.
2. En `js/app.js`, dentro del handler `map.on('load')`:
   ```js
   await loadLayer(map, DATA_PATHS.miCapa, 'mi-capa-id', { /* paint options */ });
   registerMapEvents(map, ['ejemplo', 'mi-capa-id']);
   ```
3. Las paint options siguen la especificación de MapLibre GL: `circle-*` para puntos, `line-*` para líneas, `fill-*` para polígonos.

## Conectar API REST externa

Cuando el backend esté disponible, solo actualizar `js/config.js`:

```js
export const DATA_PATHS = {
  miCapa: 'https://api.ejemplo.com/geojson/mi-capa',
};
```

`fetchGeoJSON` en `js/api/client.js` acepta URLs absolutas sin cambios adicionales. Si el servidor requiere headers de autenticación, extender `fetchGeoJSON` ahí.

## CSS

Las variables de color institucionales están definidas en `css/main.css` bajo `:root`. Usar siempre `var(--color-primario)` (`#C8102E`) y `var(--color-secundario)` (`#1A3A5C`) para mantener identidad visual.
