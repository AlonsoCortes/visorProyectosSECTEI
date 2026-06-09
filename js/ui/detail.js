import * as state from '../state.js';

export function initDetail() {
  state.on('select', ({ props, instituciones }) => renderDetail(props, instituciones));
}

function renderDetail(props, instituciones) {
  const panel = document.getElementById('detail-panel');
  panel.classList.add('detail-panel--visible');

  const titulo = props._titulo_normalizado ?? 'Sin título';
  const folio = props.Folio ?? '—';
  const year = props.año_proyecto ?? '—';
  const campo = props.campo_estudio ?? '—';
  const tipo = props.tipo_proyecto ?? '—';
  const intro = props.introduccion ?? 'No disponible.';
  const objetivo = props.objetivo_general ?? 'No disponible.';

  const instHTML = instituciones.length
    ? instituciones.map((i) => `
        <li class="detail-inst">
          <strong>${i.raiz ?? '—'}</strong>
          ${i.unidad ? `<span>${i.unidad}</span>` : ''}
        </li>`).join('')
    : '<li>No registradas</li>';

  panel.innerHTML = `
    <button class="detail-close" id="detail-close" aria-label="Cerrar">✕</button>
    <div class="detail-header">
      <p class="detail-meta">${campo} · ${tipo}</p>
      <h2 class="detail-title">${titulo}</h2>
      <p class="detail-folio">Folio: ${folio} · ${year}</p>
    </div>

    <div class="detail-section">
      <h3 class="detail-section-title">Instituciones participantes</h3>
      <ul class="detail-inst-list">${instHTML}</ul>
    </div>

    <div class="detail-section">
      <h3 class="detail-section-title">Introducción</h3>
      <p class="detail-text">${intro}</p>
    </div>

    <div class="detail-section">
      <h3 class="detail-section-title">Objetivo general</h3>
      <p class="detail-text">${objetivo}</p>
    </div>`;

  document.getElementById('detail-close').addEventListener('click', () => {
    panel.classList.remove('detail-panel--visible');
    panel.innerHTML = '';
  });
}
