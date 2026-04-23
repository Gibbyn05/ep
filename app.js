'use strict';

// ── Data layer ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'ep_hagemøbler_v3';

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
    nextId: 62,
    products: [
      // ── Hagegruppe / Loungesett ──────────────────────────────────────────
      { id:  1, navn: 'Loungesett utemøbler Lyngby',   artikkel: '210968', kategori: 'Hagegruppe/Loungesett', pris: 5999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  2, navn: 'Sofasett',                       artikkel: '220720', kategori: 'Hagegruppe/Loungesett', pris: 1999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  3, navn: 'Hjørnesofa m/bord',              artikkel: '220608', kategori: 'Hagegruppe/Loungesett', pris: 4899,  notat: '', butikk: 0, ekstern: 0 },
      { id:  4, navn: 'Spisegruppe',                    artikkel: '220781', kategori: 'Hagegruppe/Loungesett', pris: 1999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  5, navn: 'Hjørnesofa',                     artikkel: '220980', kategori: 'Hagegruppe/Loungesett', pris: 4999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  6, navn: 'Utesofa med sjeselong Capri',    artikkel: '220777', kategori: 'Hagegruppe/Loungesett', pris: 3999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  7, navn: 'Sofagruppe',                     artikkel: '220776', kategori: 'Hagegruppe/Loungesett', pris: 4999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  8, navn: 'Hagegruppe',                     artikkel: '216525', kategori: 'Hagegruppe/Loungesett', pris: 4999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  9, navn: 'Utesofa med sjeselong Capri',    artikkel: '216342', kategori: 'Hagegruppe/Loungesett', pris: 3999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 10, navn: 'Hagegruppe',                     artikkel: '211667', kategori: 'Hagegruppe/Loungesett', pris: 8999,  notat: 'Medlemspris', butikk: 0, ekstern: 0 },
      { id: 11, navn: 'Utendørs sofagruppe',            artikkel: '210911', kategori: 'Hagegruppe/Loungesett', pris: 12999, notat: '', butikk: 0, ekstern: 0 },
      { id: 12, navn: 'Loungesett utemøbler Ishøj',     artikkel: '210890', kategori: 'Hagegruppe/Loungesett', pris: 2999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 13, navn: 'Utendørs sofagruppe',            artikkel: '216339', kategori: 'Hagegruppe/Loungesett', pris: 4999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 14, navn: 'Hagegruppe',                     artikkel: '216338', kategori: 'Hagegruppe/Loungesett', pris: 1999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 15, navn: 'Hjørnesofa ute m/bord',          artikkel: '211253', kategori: 'Hagegruppe/Loungesett', pris: 4899,  notat: '', butikk: 0, ekstern: 0 },
      { id: 16, navn: 'Utendørs sofagruppe',            artikkel: '210894', kategori: 'Hagegruppe/Loungesett', pris: 4999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 17, navn: 'Hjørnesofa ute m/bord',          artikkel: '210912', kategori: 'Hagegruppe/Loungesett', pris: 11999, notat: '', butikk: 0, ekstern: 0 },
      { id: 18, navn: 'Utendørs sofagruppe',            artikkel: '206785', kategori: 'Hagegruppe/Loungesett', pris: 12999, notat: '', butikk: 0, ekstern: 0 },
      { id: 19, navn: 'Utendørs sofagruppe',            artikkel: '192660', kategori: 'Hagegruppe/Loungesett', pris: 3999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 20, navn: 'Utendørs sofagruppe',            artikkel: '206786', kategori: 'Hagegruppe/Loungesett', pris: 9999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 21, navn: 'Hagegruppe',                     artikkel: '206788', kategori: 'Hagegruppe/Loungesett', pris: 6999,  notat: '', butikk: 0, ekstern: 0 },
      // ── Stoler ──────────────────────────────────────────────────────────
      { id: 22, navn: 'Stablestol Flora',               artikkel: '220607', kategori: 'Stoler', pris: 199,  notat: '', butikk: 0, ekstern: 0 },
      { id: 23, navn: 'Strandstol Rio',                 artikkel: '221090', kategori: 'Stoler', pris: 149,  notat: '', butikk: 0, ekstern: 0 },
      { id: 24, navn: 'Solstol m/pute',                 artikkel: '221091', kategori: 'Stoler', pris: 499,  notat: '', butikk: 0, ekstern: 0 },
      { id: 25, navn: 'Cafestol Santorini',             artikkel: '220774', kategori: 'Stoler', pris: 199,  notat: '', butikk: 0, ekstern: 0 },
      { id: 26, navn: 'Stol 7-pos Fyn',                artikkel: '220722', kategori: 'Stoler', pris: 699,  notat: '', butikk: 0, ekstern: 0 },
      { id: 27, navn: 'Hvilestol m/fothviler Løkken',  artikkel: '220716', kategori: 'Stoler', pris: 1399, notat: '', butikk: 0, ekstern: 0 },
      { id: 28, navn: 'Baden Baden stol beige',         artikkel: '220604', kategori: 'Stoler', pris: 499,  notat: '', butikk: 0, ekstern: 0 },
      { id: 29, navn: 'Loungestol Milano',              artikkel: '220569', kategori: 'Stoler', pris: 1299, notat: '', butikk: 0, ekstern: 0 },
      { id: 30, navn: 'Stol i tre Relax',              artikkel: '216956', kategori: 'Stoler', pris: 1299, notat: '', butikk: 0, ekstern: 0 },
      { id: 31, navn: 'Strandstol 5-pos Hawaii',       artikkel: '216593', kategori: 'Stoler', pris: 449,  notat: '', butikk: 0, ekstern: 0 },
      { id: 32, navn: 'Spisestol Salento',             artikkel: '211610', kategori: 'Stoler', pris: 1499, notat: '', butikk: 0, ekstern: 0 },
      { id: 33, navn: 'Stablestol Fyn',                artikkel: '210889', kategori: 'Stoler', pris: 399,  notat: '', butikk: 0, ekstern: 0 },
      // ── Solseng / Solstol ────────────────────────────────────────────────
      { id: 34, navn: 'Solseng Maya',                  artikkel: '220770', kategori: 'Solseng/Solstol', pris: 499,  notat: '', butikk: 0, ekstern: 0 },
      { id: 35, navn: 'Hvilestol ute Miami',           artikkel: '210905', kategori: 'Solseng/Solstol', pris: 3999, notat: '', butikk: 0, ekstern: 0 },
      { id: 36, navn: 'Hvilestol ute Lyngby',          artikkel: '211250', kategori: 'Solseng/Solstol', pris: 4999, notat: '', butikk: 0, ekstern: 0 },
      // ── Cafesett / Bistrosett ────────────────────────────────────────────
      { id: 37, navn: 'Cafesett Roma 3-delt',          artikkel: '220779', kategori: 'Cafesett/Bistrosett', pris: 1499, notat: '', butikk: 0, ekstern: 0 },
      { id: 38, navn: 'Bistrosett/cafesett Tunis',     artikkel: '216840', kategori: 'Cafesett/Bistrosett', pris: 1259, notat: '', butikk: 0, ekstern: 0 },
      { id: 39, navn: 'Bistrosett/cafesett Marokko',   artikkel: '216526', kategori: 'Cafesett/Bistrosett', pris: 1259, notat: '', butikk: 0, ekstern: 0 },
      { id: 40, navn: 'Paris bistrosett blå',          artikkel: '210893', kategori: 'Cafesett/Bistrosett', pris: 799,  notat: '', butikk: 0, ekstern: 0 },
      { id: 41, navn: 'Paris bistrosett hvit',         artikkel: '210892', kategori: 'Cafesett/Bistrosett', pris: 799,  notat: '', butikk: 0, ekstern: 0 },
      // ── Bord ────────────────────────────────────────────────────────────
      { id: 42, navn: 'Hagebord Hero',                 artikkel: '211495', kategori: 'Bord', pris: 999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 43, navn: 'Cafebord Santorini',            artikkel: '220775', kategori: 'Bord', pris: 299,  notat: '', butikk: 0, ekstern: 0 },
      { id: 44, navn: 'Sidebord/krakk Borneo',         artikkel: '216527', kategori: 'Bord', pris: 499,  notat: '', butikk: 0, ekstern: 0 },
      { id: 45, navn: 'Bord m/klaff',                  artikkel: '216524', kategori: 'Bord', pris: 1999, notat: '', butikk: 0, ekstern: 0 },
      { id: 46, navn: 'Spisebord Bonum',               artikkel: '212127', kategori: 'Bord', pris: 1799, notat: '', butikk: 0, ekstern: 0 },
      { id: 47, navn: 'Spisebord Rollo',               artikkel: '211496', kategori: 'Bord', pris: 3499, notat: '', butikk: 0, ekstern: 0 },
      { id: 48, navn: 'Hagebord Viborg',               artikkel: '197211', kategori: 'Bord', pris: 3999, notat: '', butikk: 0, ekstern: 0 },
      { id: 49, navn: 'Spisebord Hein',                artikkel: '211564', kategori: 'Bord', pris: 3999, notat: '', butikk: 0, ekstern: 0 },
      { id: 50, navn: 'Hagebord Larkollen',            artikkel: '192826', kategori: 'Bord', pris: 1299, notat: '', butikk: 0, ekstern: 0 },
      // ── Benk ────────────────────────────────────────────────────────────
      { id: 51, navn: 'Hagebenk Roma',                 artikkel: '220778', kategori: 'Benk', pris: 1199, notat: '108x59,5 cm, stål', butikk: 0, ekstern: 0 },
      { id: 52, navn: 'Hagebenk m/oppbevaring Keter',  artikkel: '197676', kategori: 'Benk', pris: 1999, notat: '227 liter oppbevaring', butikk: 0, ekstern: 0 },
      // ── Parasoll ────────────────────────────────────────────────────────
      { id: 53, navn: 'Parasoll ø250 cm Fie',          artikkel: '211493', kategori: 'Parasoll', pris: 999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 54, navn: 'Parasoll 2,2 m Cancun',         artikkel: '211251', kategori: 'Parasoll', pris: 1299, notat: '', butikk: 0, ekstern: 0 },
      { id: 55, navn: 'Parasoll ø300 cm Bello',        artikkel: '197639', kategori: 'Parasoll', pris: 1999, notat: '', butikk: 0, ekstern: 0 },
      { id: 56, navn: 'Parasoll ø270 cm mørk grå',     artikkel: '188584', kategori: 'Parasoll', pris: 699,  notat: '', butikk: 0, ekstern: 0 },
      { id: 57, navn: 'Parasoll ø270 cm blå',          artikkel: '166039', kategori: 'Parasoll', pris: 699,  notat: '', butikk: 0, ekstern: 0 },
      { id: 58, navn: 'Parasoll ø270 cm grå',          artikkel: '171161', kategori: 'Parasoll', pris: 699,  notat: '', butikk: 0, ekstern: 0 },
      // ── Parasollfot ─────────────────────────────────────────────────────
      { id: 59, navn: 'Parasollfot 25 kg granitt',     artikkel: '216341', kategori: 'Parasollfot', pris: 449, notat: '', butikk: 0, ekstern: 0 },
      { id: 60, navn: 'Parasollfot 35 kg granitt',     artikkel: '203730', kategori: 'Parasollfot', pris: 999, notat: '', butikk: 0, ekstern: 0 },
      { id: 61, navn: 'Parasollfot 30 kg betong',      artikkel: '112694', kategori: 'Parasollfot', pris: 799, notat: '', butikk: 0, ekstern: 0 },
    ]
  };
}

let db = loadData();

// ── State ─────────────────────────────────────────────────────────────────────

let activeFilter = 'alle';
let searchQuery  = '';
let transferCtx  = null;

// ── DOM refs ──────────────────────────────────────────────────────────────────

const productBody        = document.getElementById('productBody');
const emptyState         = document.getElementById('emptyState');
const countButikk        = document.getElementById('count-butikk');
const countEkstern       = document.getElementById('count-ekstern');
const countTotal         = document.getElementById('count-total');
const searchInput        = document.getElementById('searchInput');
const clearSearch        = document.getElementById('clearSearch');
const btnLeggTil         = document.getElementById('btnLeggTil');
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
  const linesButikk  = db.products.filter(p => p.butikk > 0).length;
  const linesEkstern = db.products.filter(p => p.ekstern > 0).length;
  const totalUnits   = db.products.reduce((s, p) => s + p.butikk + p.ekstern, 0);
  countButikk.textContent  = linesButikk;
  countEkstern.textContent = linesEkstern;
  countTotal.textContent   = totalUnits;

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
      <td class="pris-cell">${formatPris(p.pris)}</td>
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
  editIdField.value  = '';
  fieldButikk.value  = 0;
  fieldEkstern.value = 0;
  modalProduct.classList.remove('hidden');
  fieldNavn.focus();
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
  const avail    = isTilButikk ? p.ekstern : p.butikk;
  const fraLabel = isTilButikk ? '🏭 Eksternlager' : '🏪 Butikk';
  const tilLabel = isTilButikk ? '🏪 Butikk'       : '🏭 Eksternlager';

  transferTitle.textContent = isTilButikk
    ? 'Flytt fra Eksternlager → Butikk'
    : 'Flytt fra Butikk → Eksternlager';

  transferInfo.textContent  = p.navn;
  fromName.textContent      = fraLabel;
  toName.textContent        = tilLabel;
  fromAvail.textContent     = avail;
  transferQty.value         = 1;
  transferQty.max           = avail;
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

  const qty   = parseInt(transferQty.value) || 0;
  const avail = transferCtx.direction === 'til-butikk' ? p.ekstern : p.butikk;

  if (qty <= 0) { showTransferError('Antall må være minst 1'); return; }
  if (qty > avail) { showTransferError(`Maks ${avail} tilgjengelig`); return; }

  const dest = transferCtx.direction === 'til-butikk' ? 'butikk' : 'eksternlager';

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

// ── Event delegation ──────────────────────────────────────────────────────────

productBody.addEventListener('click', e => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = parseInt(btn.dataset.id);
  if (btn.classList.contains('btn-move'))   openTransferModal(id, btn.dataset.dir);
  else if (btn.classList.contains('btn-edit'))   openEditModal(id);
  else if (btn.classList.contains('btn-delete')) deleteProduct(id);
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

// ── Modal wiring ──────────────────────────────────────────────────────────────

btnLeggTil.addEventListener('click', openAddModal);
closeModalProduct.addEventListener('click', closeProductModal);
cancelProduct.addEventListener('click', closeProductModal);
closeModalTransfer.addEventListener('click', closeTransferModal);
cancelTransfer.addEventListener('click', closeTransferModal);

modalProduct.addEventListener('click', e => { if (e.target === modalProduct) closeProductModal(); });
modalTransfer.addEventListener('click', e => { if (e.target === modalTransfer) closeTransferModal(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeProductModal(); closeTransferModal(); }
});

// ── Init ──────────────────────────────────────────────────────────────────────

render();
