import { CAMPO_COLORS } from '../config.js';

export function initLegend() {
  const container = document.getElementById('map');

  const legend = document.createElement('div');
  legend.className = 'map-legend';

  legend.innerHTML = `
    <p class="map-legend-title">Campo de estudio</p>
    ${Object.entries(CAMPO_COLORS).map(([campo, color]) => `
      <div class="map-legend-item">
        <span class="map-legend-dot" style="background:${color}"></span>
        <span class="map-legend-label">${campo}</span>
      </div>`).join('')}
    <div class="map-legend-sep"></div>
    <div class="map-legend-item">
      <span class="map-legend-cluster"></span>
      <span class="map-legend-label">Agrupación de proyectos</span>
    </div>`;

  container.appendChild(legend);
}
