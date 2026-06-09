import * as state from '../state.js';

export function initFilters(uniqueCampos) {
  const campoSelect = document.getElementById('filter-campo');
  const tipoSelect = document.getElementById('filter-tipo');
  const clearBtn = document.getElementById('filter-clear');

  _populateCampo(campoSelect, uniqueCampos);

  campoSelect.addEventListener('change', () => {
    state.setCampo(campoSelect.value);
  });

  tipoSelect.addEventListener('change', () => {
    state.setTipo(tipoSelect.value);
  });

  clearBtn.addEventListener('click', () => {
    campoSelect.value = '';
    tipoSelect.value = '';
    state.setCampo(null);
  });

  state.on('change', ({ availableTipos, selectedCampo, selectedTipo }) => {
    _populateTipo(tipoSelect, availableTipos);
    tipoSelect.disabled = !selectedCampo;
    if (!selectedTipo) tipoSelect.value = '';
  });
}

function _populateCampo(select, campos) {
  select.innerHTML = '<option value="">Todos los campos</option>';
  campos.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

function _populateTipo(select, tipos) {
  select.innerHTML = '<option value="">Todos los tipos</option>';
  tipos.forEach((t) => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });
}
