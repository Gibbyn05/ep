'use strict';

// ── WebSocket-tilkobling ──────────────────────────────────────────────────────

let ws        = null;
let db        = null;  // null = ikke mottatt fra server ennå
let reconnectTimer = null;

function wsConnect() {
  clearTimeout(reconnectTimer);
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  ws = new WebSocket(`${proto}://${location.host}`);

  ws.onopen = () => {
    setConnStatus('online', 'Tilkoblet');
  };

  ws.onmessage = e => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.type === 'sync' && msg.data) {
        db = msg.data;
        hideLoading();
        render();
      }
    } catch {}
  };

  ws.onclose = () => {
    setConnStatus('offline', 'Frakoblet – kobler til igjen...');
    reconnectTimer = setTimeout(wsConnect, 3000);
  };

  ws.onerror = () => ws.close();
}

function saveData(data) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'update', data }));
  }
}

function setConnStatus(state, label) {
  connStatus.className = 'conn-status ' + state;
  connLabel.textContent = label;
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}

// ── State ─────────────────────────────────────────────────────────────────────

let activeFilter = 'alle';
let searchQuery  = '';
let transferCtx  = null;

// ── DOM refs ──────────────────────────────────────────────────────────────────

const productBody        = document.getElementById('productBody');
const productCards       = document.getElementById('productCards');
const emptyState         = document.getElementById('emptyState');
const countButikk        = document.getElementById('count-butikk');
const countEkstern       = document.getElementById('count-ekstern');
const countTotal         = document.getElementById('count-total');
const searchInput        = document.getElementById('searchInput');
const clearSearch        = document.getElementById('clearSearch');
const btnLeggTil         = document.getElementById('btnLeggTil');
const fabLeggTil         = document.getElementById('fabLeggTil');
const modalProduct       = document.getElementById('modalProduct');
const modalTitle         = document.getElementById('modalTitle');
const productForm        = document.getElementById('productForm');
const editIdField        = document.getElementById('editId');
const fieldNavn          = document.getElementById('fieldNavn');
const fieldArtikkel      = document.getElementById('fieldArtikkel');
const fieldKategori      = document.getElementById('fieldKategori');
const fieldPris          = document.getElementById('fieldPris');
const fieldNotat         = document.getElementById('fieldNotat');
const fieldButikk        = document.getElementById('fieldButikk');
const fieldEkstern       = document.getElementById('fieldEkstern');
const closeModalProduct  = document.getElementById('closeModalProduct');
const cancelProduct      = document.getElementById('cancelProduct');
const modalTransfer      = document.getElementById('modalTransfer');
const transferTitle      = document.getElementById('transferTitle');
const transferInfo       = document.getElementById('transferInfo');
const fromName           = document.getElementById('fromName');
const toName             = document.getElementById('toName');
const fromAvail          = document.getElementById('fromAvail');
const transferQty        = document.getElementById('transferQty');
const transferError      = document.getElementById('transferError');
const closeModalTransfer = document.getElementById('closeModalTransfer');
const cancelTransfer     = document.getElementById('cancelTransfer');
const confirmTransfer    = document.getElementById('confirmTransfer');
const connStatus         = document.getElementById('connStatus');
const connLabel          = document.getElementById('connLabel');
const toast              = document.getElementById('toast');

// ── Helpers ───────────────────────────────────────────────────────────────────

function locationOf(p) {
  if (p.butikk > 0 && p.ekstern > 0) return 'begge';
  if (p.butikk > 0) return 'butikk';
  if (p.ekstern > 0) return 'ekstern';
  return 'ingen';
}

function locBadgeHtml(p) {
  const loc = locationOf(p);
  const map = {
    butikk:  ['loc-butikk',  '🏪 Butikk'],
    ekstern: ['loc-ekstern', '🏭 Eksternlager'],
    begge:   ['loc-begge',   '↔️ Begge steder'],
    ingen:   ['loc-ingen',   '— Ingen'],
  };
  const [cls, label] = map[loc];
  return `<span class="loc-badge ${cls}">${label}</span>`;
}

function qtyBadge(n, cls) {
  const zero = n === 0 ? ' qty-zero' : '';
  return `<span class="qty-badge ${cls}${zero}">${n}</span>`;
}

function formatPris(pris) {
  if (!pris) return '–';
  return new Intl.NumberFormat('nb-NO').format(pris) + ' kr';
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.add('hidden'), 2400);
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Render ────────────────────────────────────────────────────────────────────

function filteredProducts() {
  if (!db) return [];
  return db.products.filter(p => {
    if (activeFilter !== 'alle' && locationOf(p) !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.navn.toLowerCase().includes(q) ||
        p.artikkel.toLowerCase().includes(q) ||
        p.kategori.toLowerCase().includes(q) ||
        p.notat.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

function render() {
  if (!db) return;

  const linesButikk  = db.products.filter(p => p.butikk > 0).length;
  const linesEkstern = db.products.filter(p => p.ekstern > 0).length;
  const totalUnits   = db.products.reduce((s, p) => s + p.butikk + p.ekstern, 0);
  countButikk.textContent  = linesButikk;
  countEkstern.textContent = linesEkstern;
  countTotal.textContent   = totalUnits;

  const list = filteredProducts();

  if (list.length === 0) {
    productBody.innerHTML  = '';
    productCards.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  const moveBtns = p =>
    (p.ekstern > 0 ? `<button class="btn-action btn-move" data-id="${p.id}" data-dir="til-butikk">🏪 Til butikk</button>` : '') +
    (p.butikk  > 0 ? `<button class="btn-action btn-move" data-id="${p.id}" data-dir="til-ekstern">🏭 Til ekstern</button>` : '');

  // ── Tabellrader (desktop) ─────────────────────────────────────
  productBody.innerHTML = list.map(p => `
    <tr>
      <td>
        <div class="prod-name">${esc(p.navn)}</div>
        <span class="prod-cat">${esc(p.kategori)}</span>
        ${p.notat ? `<div class="prod-notat">${esc(p.notat)}</div>` : ''}
      </td>
      <td><span class="art-nr">${esc(p.artikkel) || '–'}</span></td>
      <td class="pris-cell">${formatPris(p.pris)}</td>
      <td class="center">${qtyBadge(p.butikk, 'qty-butikk')}</td>
      <td class="center">${qtyBadge(p.ekstern, 'qty-ekstern')}</td>
      <td class="center">${qtyBadge(p.butikk + p.ekstern, 'qty-total')}</td>
      <td>${locBadgeHtml(p)}</td>
      <td class="center">
        <div class="action-cell">
          ${moveBtns(p)}
          <button class="btn-action btn-edit"   data-id="${p.id}">Rediger</button>
          <button class="btn-action btn-delete" data-id="${p.id}">Slett</button>
        </div>
      </td>
    </tr>
  `).join('');

  // ── Kort (mobil) ──────────────────────────────────────────────
  productCards.innerHTML = list.map(p => `
    <div class="prod-card">
      <div class="pc-top">
        <div class="pc-name">${esc(p.navn)}</div>
        ${locBadgeHtml(p)}
      </div>
      <div class="pc-meta">
        <span class="prod-cat">${esc(p.kategori)}</span>
        ${p.artikkel ? `<span class="art-nr">${esc(p.artikkel)}</span>` : ''}
        <span class="pc-pris">${formatPris(p.pris)}</span>
      </div>
      <div class="pc-qty-row">
        <div class="pc-qty-item">
          <span class="pc-qty-label">🏪 Butikk</span>
          <div class="qty-stepper">
            <button class="qty-step qty-dec" data-id="${p.id}" data-field="butikk" aria-label="Minus">−</button>
            <span class="qty-num ${p.butikk === 0 ? 'qty-num-zero' : 'qty-num-green'}">${p.butikk}</span>
            <button class="qty-step qty-inc" data-id="${p.id}" data-field="butikk" aria-label="Pluss">+</button>
          </div>
        </div>
        <div class="pc-qty-sep"></div>
        <div class="pc-qty-item">
          <span class="pc-qty-label">🏭 Ekstern</span>
          <div class="qty-stepper">
            <button class="qty-step qty-dec" data-id="${p.id}" data-field="ekstern" aria-label="Minus">−</button>
            <span class="qty-num ${p.ekstern === 0 ? 'qty-num-zero' : 'qty-num-red'}">${p.ekstern}</span>
            <button class="qty-step qty-inc" data-id="${p.id}" data-field="ekstern" aria-label="Pluss">+</button>
          </div>
        </div>
      </div>
      <div class="pc-actions">
        <button class="btn-action btn-edit"   data-id="${p.id}">✏️ Rediger</button>
        <button class="btn-action btn-delete" data-id="${p.id}">🗑️ Slett</button>
      </div>
    </div>
  `).join('');
}

// ── Produktskjema ─────────────────────────────────────────────────────────────

function openAddModal() {
  modalTitle.textContent = 'Legg til produkt';
  productForm.reset();
  editIdField.value  = '';
  fieldButikk.value  = 0;
  fieldEkstern.value = 0;
  modalProduct.classList.remove('hidden');
  setTimeout(() => fieldNavn.focus(), 50);
}

function openEditModal(id) {
  const p = db.products.find(x => x.id === id);
  if (!p) return;
  modalTitle.textContent  = 'Rediger produkt';
  editIdField.value       = p.id;
  fieldNavn.value         = p.navn;
  fieldArtikkel.value     = p.artikkel;
  fieldKategori.value     = p.kategori;
  fieldPris.value         = p.pris || '';
  fieldNotat.value        = p.notat;
  fieldButikk.value       = p.butikk;
  fieldEkstern.value      = p.ekstern;
  modalProduct.classList.remove('hidden');
  setTimeout(() => fieldNavn.focus(), 50);
}

function closeProductModal() {
  modalProduct.classList.add('hidden');
}

productForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = editIdField.value ? parseInt(editIdField.value) : null;
  const data = {
    navn:     fieldNavn.value.trim(),
    artikkel: fieldArtikkel.value.trim(),
    kategori: fieldKategori.value,
    pris:     parseInt(fieldPris.value) || 0,
    notat:    fieldNotat.value.trim(),
    butikk:   Math.max(0, parseInt(fieldButikk.value) || 0),
    ekstern:  Math.max(0, parseInt(fieldEkstern.value) || 0),
  };

  if (id) {
    const idx = db.products.findIndex(x => x.id === id);
    if (idx !== -1) db.products[idx] = { ...db.products[idx], ...data };
    showToast('Produkt oppdatert');
  } else {
    db.products.push({ id: Date.now(), ...data });
    showToast('Produkt lagt til');
  }

  saveData(db);
  closeProductModal();
  render();
});

// ── Flytt-modal ───────────────────────────────────────────────────────────────

function openTransferModal(id, direction) {
  const p = db.products.find(x => x.id === id);
  if (!p) return;
  transferCtx = { productId: id, direction };

  const isTilButikk = direction === 'til-butikk';
  const avail    = isTilButikk ? p.ekstern : p.butikk;
  const fraLabel = isTilButikk ? '🏭 Eksternlager' : '🏪 Butikk';
  const tilLabel = isTilButikk ? '🏪 Butikk'       : '🏭 Eksternlager';

  transferTitle.textContent = isTilButikk ? 'Flytt: Eksternlager → Butikk' : 'Flytt: Butikk → Eksternlager';
  transferInfo.textContent  = p.navn;
  fromName.textContent      = fraLabel;
  toName.textContent        = tilLabel;
  fromAvail.textContent     = avail;
  transferQty.value         = 1;
  transferQty.max           = avail;
  transferError.classList.add('hidden');
  modalTransfer.classList.remove('hidden');
  setTimeout(() => { transferQty.focus(); transferQty.select(); }, 50);
}

function closeTransferModal() {
  modalTransfer.classList.add('hidden');
  transferCtx = null;
}

confirmTransfer.addEventListener('click', () => {
  if (!transferCtx) return;
  const p = db.products.find(x => x.id === transferCtx.productId);
  if (!p) return;

  const qty   = parseInt(transferQty.value) || 0;
  const avail = transferCtx.direction === 'til-butikk' ? p.ekstern : p.butikk;

  if (qty <= 0)    { transferError.textContent = 'Antall må være minst 1'; transferError.classList.remove('hidden'); return; }
  if (qty > avail) { transferError.textContent = `Maks ${avail} tilgjengelig`; transferError.classList.remove('hidden'); return; }

  const dest = transferCtx.direction === 'til-butikk' ? 'butikk' : 'eksternlager';
  if (transferCtx.direction === 'til-butikk') { p.ekstern -= qty; p.butikk += qty; }
  else                                          { p.butikk -= qty; p.ekstern += qty; }

  saveData(db);
  closeTransferModal();
  render();
  showToast(`${qty} stk. «${p.navn}» → ${dest}`);
});

// ── Slett ─────────────────────────────────────────────────────────────────────

function deleteProduct(id) {
  const p = db.products.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Slett «${p.navn}»?`)) return;
  db.products = db.products.filter(x => x.id !== id);
  saveData(db);
  render();
  showToast('Produkt slettet');
}

// ── Event-delegering ──────────────────────────────────────────────────────────

function handleProductClick(e) {
  const step = e.target.closest('.qty-step');
  if (step) {
    const p = db.products.find(x => x.id === parseInt(step.dataset.id));
    if (!p) return;
    const field = step.dataset.field;
    p[field] = step.classList.contains('qty-inc')
      ? p[field] + 1
      : Math.max(0, p[field] - 1);
    saveData(db);
    render();
    return;
  }

  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = parseInt(btn.dataset.id);
  if (btn.classList.contains('btn-move'))        openTransferModal(id, btn.dataset.dir);
  else if (btn.classList.contains('btn-edit'))   openEditModal(id);
  else if (btn.classList.contains('btn-delete')) deleteProduct(id);
}

productBody.addEventListener('click', handleProductClick);
productCards.addEventListener('click', handleProductClick);

// ── Filter ────────────────────────────────────────────────────────────────────

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    render();
  });
});

searchInput.addEventListener('input', () => { searchQuery = searchInput.value.trim(); render(); });
clearSearch.addEventListener('click', () => { searchInput.value = ''; searchQuery = ''; render(); searchInput.focus(); });

// ── Modal-tilkobling ──────────────────────────────────────────────────────────

btnLeggTil.addEventListener('click', openAddModal);
fabLeggTil.addEventListener('click', openAddModal);
closeModalProduct.addEventListener('click', closeProductModal);
cancelProduct.addEventListener('click', closeProductModal);
closeModalTransfer.addEventListener('click', closeTransferModal);
cancelTransfer.addEventListener('click', closeTransferModal);

modalProduct.addEventListener('click', e => { if (e.target === modalProduct) closeProductModal(); });
modalTransfer.addEventListener('click', e => { if (e.target === modalTransfer) closeTransferModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeProductModal(); closeTransferModal(); } });

// ── Start ─────────────────────────────────────────────────────────────────────

wsConnect();
