import { CAMPO_COLORS, CAMPO_COLOR_DEFAULT } from '../config.js';
import * as state from '../state.js';

let _onSelectCallback = null;

export function initList(onSelect) {
  _onSelectCallback = onSelect;
  state.on('change', ({ filteredProjects }) => renderList(filteredProjects));
  state.on('select', ({ id }) => _highlightItem(id));
}

export function renderList(projects) {
  const container = document.getElementById('results-list');
  const counter = document.getElementById('results-count');

  counter.textContent = `${projects.length} proyecto${projects.length !== 1 ? 's' : ''}`;
  container.innerHTML = '';

  if (projects.length === 0) {
    container.innerHTML = '<p class="list-empty">Sin resultados para los filtros seleccionados.</p>';
    return;
  }

  projects.forEach(({ id, props, hasGeometry }) => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.dataset.id = id;

    const color = CAMPO_COLORS[props.campo_estudio] ?? CAMPO_COLOR_DEFAULT;
    const titulo = props._titulo_normalizado ?? 'Sin título';
    const year = props.año_proyecto ?? '';
    const noGeo = hasGeometry ? '' : '<span class="badge-no-geo">Sin ubicación</span>';

    item.innerHTML = `
      <span class="list-badge" style="background:${color}"></span>
      <div class="list-item-body">
        <p class="list-title">${titulo}</p>
        <p class="list-meta">${props.tipo_proyecto ?? ''} · ${year} ${noGeo}</p>
      </div>`;

    item.addEventListener('click', () => {
      state.selectProject(id);
      _onSelectCallback?.(id);
    });

    container.appendChild(item);
  });
}

function _highlightItem(id) {
  document.querySelectorAll('.list-item').forEach((el) => {
    el.classList.toggle('list-item--active', Number(el.dataset.id) === id);
  });
  const active = document.querySelector(`.list-item[data-id="${id}"]`);
  active?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
