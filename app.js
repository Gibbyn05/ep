'use strict';

// ── Data layer ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'ep_hagemøbler_v1';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultData();
  } catch {
    return defaultData();
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function defaultData() {
  return {
    nextId: 9,
    products: [
      { id: 1, navn: 'Solstol m/fotstøtte', artikkel: '112233', kategori: 'Stoler',     notat: 'Grå/blå variant', butikk: 4, ekstern: 12 },
      { id: 2, navn: 'Hagebord 6-pers',     artikkel: '223344', kategori: 'Bord',       notat: '',                butikk: 2, ekstern: 5  },
      { id: 3, navn: 'Hagesofagruppe 4-pk', artikkel: '334455', kategori: 'Sofagruppe', notat: 'Sort ramme',      butikk: 1, ekstern: 3  },
      { id: 4, navn: 'Parasoll Ø 3m',       artikkel: '445566', kategori: 'Parasoll',   notat: '',                butikk: 3, ekstern: 0  },
      { id: 5, navn: 'Klappstoler 4-pk',    artikkel: '556677', kategori: 'Stoler',     notat: 'Hvit plast',      butikk: 0, ekstern: 20 },
      { id: 6, navn: 'Benk teak 150cm',     artikkel: '667788', kategori: 'Benk',       notat: '',                butikk: 1, ekstern: 2  },
      { id: 7, navn: 'Hengestol m/stativ',  artikkel: '778899', kategori: 'Hengestol',  notat: 'Beige stoff',     butikk: 2, ekstern: 4  },
      { id: 8, navn: 'Bord 4-pers rund',    artikkel: '889900', kategori: 'Bord',       notat: '',                butikk: 0, ekstern: 0  },
    ]
  };
}

let db = loadData();

// ── State ─────────────────────────────────────────────────────────────────────

let activeFilter = 'alle';
let searchQuery  = '';
let transferCtx  = null; // { productId, direction: 'til-ekstern' | 'til-butikk' }

// ── DOM refs ──────────────────────────────────────────────────────────────────

const productBody       = document.getElementById('productBody');
const emptyState        = document.getElementById('emptyState');
const countButikk       = document.getElementById('count-butikk');
const countEkstern      = document.getElementById('count-ekstern');
const countTotal        = document.getElementById('count-total');
const searchInput       = document.getElementById('searchInput');
const clearSearch       = document.getElementById('clearSearch');
const btnLeggTil        = document.getElementById('btnLeggTil');
const modalProduct      = document.getElementById('modalProduct');
const modalTitle        = document.getElementById('modalTitle');
const productForm       = document.getElementById('productForm');
const editIdField       = document.getElementById('editId');
const fieldNavn         = document.getElementById('fieldNavn');
const fieldArtikkel     = document.getElementById('fieldArtikkel');
const fieldKategori     = document.getElementById('fieldKategori');
const fieldNotat        = document.getElementById('fieldNotat');
const fieldButikk       = document.getElementById('fieldButikk');
const fieldEkstern      = document.getElementById('fieldEkstern');
const closeModalProduct = document.getElementById('closeModalProduct');
const cancelProduct     = document.getElementById('cancelProduct');
const modalTransfer     = document.getElementById('modalTransfer');
const transferTitle     = document.getElementById('transferTitle');
const transferInfo      = document.getElementById('transferInfo');
const fromName          = document.getElementById('fromName');
const toName            = document.getElementById('toName');
const fromAvail         = document.getElementById('fromAvail');
const transferQty       = document.getElementById('transferQty');
const transferError     = document.getElementById('transferError');
const closeModalTransfer = document.getElementById('closeModalTransfer');
const cancelTransfer    = document.getElementById('cancelTransfer');
const confirmTransfer   = document.getElementById('confirmTransfer');
const toast             = document.getElementById('toast');

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
    butikk:  ['loc-butikk', '🏪 Butikk'],
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

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.add('hidden'), 2400);
}

// ── Render ────────────────────────────────────────────────────────────────────

function filteredProducts() {
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
  // Stats
  const linesButikk = db.products.filter(p => p.butikk > 0).length;
  const linesEkstern = db.products.filter(p => p.ekstern > 0).length;
  const totalUnits = db.products.reduce((s, p) => s + p.butikk + p.ekstern, 0);
  countButikk.textContent = linesButikk;
  countEkstern.textContent = linesEkstern;
  countTotal.textContent = totalUnits;

  const list = filteredProducts();

  if (list.length === 0) {
    productBody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  productBody.innerHTML = list.map(p => `
    <tr>
      <td>
        <div class="prod-name">${esc(p.navn)}</div>
        <span class="prod-cat">${esc(p.kategori)}</span>
        ${p.notat ? `<div class="prod-notat">${esc(p.notat)}</div>` : ''}
      </td>
      <td><span class="art-nr">${esc(p.artikkel) || '–'}</span></td>
      <td class="center">${qtyBadge(p.butikk, 'qty-butikk')}</td>
      <td class="center">${qtyBadge(p.ekstern, 'qty-ekstern')}</td>
      <td class="center">${qtyBadge(p.butikk + p.ekstern, 'qty-total')}</td>
      <td>${locBadgeHtml(p)}</td>
      <td class="center">
        <div class="action-cell">
          ${p.ekstern > 0 ? `<button class="btn-action btn-move" data-id="${p.id}" data-dir="til-butikk" title="Flytt fra eksternlager til butikk">🏪 Til butikk</button>` : ''}
          ${p.butikk  > 0 ? `<button class="btn-action btn-move" data-id="${p.id}" data-dir="til-ekstern" title="Flytt fra butikk til eksternlager">🏭 Til ekstern</button>` : ''}
          <button class="btn-action btn-edit"   data-id="${p.id}">Rediger</button>
          <button class="btn-action btn-delete" data-id="${p.id}">Slett</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Product form ──────────────────────────────────────────────────────────────

function openAddModal() {
  modalTitle.textContent = 'Legg til produkt';
  productForm.reset();
  editIdField.value = '';
  fieldButikk.value = 0;
  fieldEkstern.value = 0;
  modalProduct.classList.remove('hidden');
  fieldNavn.focus();
}

function openEditModal(id) {
  const p = db.products.find(x => x.id === id);
  if (!p) return;
  modalTitle.textContent = 'Rediger produkt';
  editIdField.value   = p.id;
  fieldNavn.value     = p.navn;
  fieldArtikkel.value = p.artikkel;
  fieldKategori.value = p.kategori;
  fieldNotat.value    = p.notat;
  fieldButikk.value   = p.butikk;
  fieldEkstern.value  = p.ekstern;
  modalProduct.classList.remove('hidden');
  fieldNavn.focus();
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
    notat:    fieldNotat.value.trim(),
    butikk:   Math.max(0, parseInt(fieldButikk.value) || 0),
    ekstern:  Math.max(0, parseInt(fieldEkstern.value) || 0),
  };

  if (id) {
    const idx = db.products.findIndex(x => x.id === id);
    if (idx !== -1) db.products[idx] = { ...db.products[idx], ...data };
    showToast('Produkt oppdatert');
  } else {
    db.products.push({ id: db.nextId++, ...data });
    showToast('Produkt lagt til');
  }

  saveData(db);
  closeProductModal();
  render();
});

// ── Transfer modal ────────────────────────────────────────────────────────────

function openTransferModal(id, direction) {
  const p = db.products.find(x => x.id === id);
  if (!p) return;
  transferCtx = { productId: id, direction };

  const isTilButikk = direction === 'til-butikk';
  const avail  = isTilButikk ? p.ekstern : p.butikk;
  const fraLabel = isTilButikk ? '🏭 Eksternlager' : '🏪 Butikk';
  const tilLabel = isTilButikk ? '🏪 Butikk'       : '🏭 Eksternlager';

  transferTitle.textContent = isTilButikk
    ? 'Flytt fra Eksternlager → Butikk'
    : 'Flytt fra Butikk → Eksternlager';

  transferInfo.textContent = p.navn;
  fromName.textContent = fraLabel;
  toName.textContent   = tilLabel;
  fromAvail.textContent = avail;
  transferQty.value = 1;
  transferQty.max   = avail;
  transferError.classList.add('hidden');
  modalTransfer.classList.remove('hidden');
  transferQty.focus();
  transferQty.select();
}

function closeTransferModal() {
  modalTransfer.classList.add('hidden');
  transferCtx = null;
}

confirmTransfer.addEventListener('click', () => {
  if (!transferCtx) return;
  const p = db.products.find(x => x.id === transferCtx.productId);
  if (!p) return;

  const qty = parseInt(transferQty.value) || 0;
  const avail = transferCtx.direction === 'til-butikk' ? p.ekstern : p.butikk;

  if (qty <= 0) {
    showTransferError('Antall må være minst 1');
    return;
  }
  if (qty > avail) {
    showTransferError(`Maks ${avail} tilgjengelig`);
    return;
  }

  if (transferCtx.direction === 'til-butikk') {
    p.ekstern -= qty;
    p.butikk  += qty;
  } else {
    p.butikk  -= qty;
    p.ekstern += qty;
  }

  saveData(db);
  closeTransferModal();
  render();

  const dest = transferCtx === null
    ? ''
    : (transferCtx.direction === 'til-butikk' ? 'butikk' : 'eksternlager');
  showToast(`${qty} stk. av «${p.navn}» flyttet til ${dest}`);
});

function showTransferError(msg) {
  transferError.textContent = msg;
  transferError.classList.remove('hidden');
}

// ── Delete ────────────────────────────────────────────────────────────────────

function deleteProduct(id) {
  const p = db.products.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Slett «${p.navn}»?`)) return;
  db.products = db.products.filter(x => x.id !== id);
  saveData(db);
  render();
  showToast('Produkt slettet');
}

// ── Event delegation for table buttons ───────────────────────────────────────

productBody.addEventListener('click', e => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = parseInt(btn.dataset.id);

  if (btn.classList.contains('btn-move')) {
    openTransferModal(id, btn.dataset.dir);
  } else if (btn.classList.contains('btn-edit')) {
    openEditModal(id);
  } else if (btn.classList.contains('btn-delete')) {
    deleteProduct(id);
  }
});

// ── Filter buttons ────────────────────────────────────────────────────────────

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    render();
  });
});

// ── Search ────────────────────────────────────────────────────────────────────

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  render();
});

clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  render();
  searchInput.focus();
});

// ── Modal triggers ────────────────────────────────────────────────────────────

btnLeggTil.addEventListener('click', openAddModal);
closeModalProduct.addEventListener('click', closeProductModal);
cancelProduct.addEventListener('click', closeProductModal);
closeModalTransfer.addEventListener('click', closeTransferModal);
cancelTransfer.addEventListener('click', closeTransferModal);

// Close modals on overlay click
modalProduct.addEventListener('click', e => { if (e.target === modalProduct) closeProductModal(); });
modalTransfer.addEventListener('click', e => { if (e.target === modalTransfer) closeTransferModal(); });

// Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeProductModal(); closeTransferModal(); }
});

// ── Init ──────────────────────────────────────────────────────────────────────

render();
