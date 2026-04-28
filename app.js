'use strict';

// ── Supabase konfigurasjon ────────────────────────────────────────────────────
// Fyll inn dine verdier fra: supabase.com → prosjekt → Settings → API
const SUPABASE_URL = 'https://vpchssbdbhghfbtcjnts.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwY2hzc2JkYmhnaGZidGNqbnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDc4MjEsImV4cCI6MjA5Mjg4MzgyMX0.38VSQKGL5XoxUAy5XhZL7spxeGF3utrbkixS6mOoRWs';

const { createClient } = window.supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── State ─────────────────────────────────────────────────────────────────────

let db               = { products: [] };
let activeFilter     = 'alle';
let searchQuery      = '';
let transferCtx      = null;
let sortField        = 'navn';
let sortDir          = 'asc';
let groupByKategori  = false;

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

// ── Supabase: sanntid og data ─────────────────────────────────────────────────

async function init() {
  setConnStatus('offline', 'Kobler til...');

  const { data, error } = await sb.from('products').select('*').order('id');
  if (error) {
    setConnStatus('offline', 'Tilkoblingsfeil');
    console.error(error);
    const loadingBox = document.querySelector('.loading-box');
    if (loadingBox) loadingBox.innerHTML = `<p style="color:#E3000F;font-weight:600">Tilkoblingsfeil</p><p style="font-size:0.85rem;color:#555">${error.message}</p><p style="font-size:0.8rem;color:#888">Sjekk at setup.sql er kjørt i Supabase</p>`;
    return;
  }
  db.products = data;
  document.getElementById('loading').classList.add('hidden');
  render();

  // Abonner på sanntidsendringer fra alle enheter
  sb.channel('products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' },
      payload => {
        if (payload.eventType === 'INSERT') {
          if (!db.products.find(p => p.id === payload.new.id)) {
            db.products.push(payload.new);
            db.products.sort((a, b) => a.id - b.id);
          }
        } else if (payload.eventType === 'UPDATE') {
          const idx = db.products.findIndex(p => p.id === payload.new.id);
          if (idx !== -1) db.products[idx] = payload.new;
        } else if (payload.eventType === 'DELETE') {
          db.products = db.products.filter(p => p.id !== payload.old.id);
        }
        render();
      }
    )
    .subscribe(status => {
      if (status === 'SUBSCRIBED') {
        setConnStatus('online', 'Tilkoblet');
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        setConnStatus('offline', 'Frakoblet');
      }
    });
}

function setConnStatus(state, label) {
  connStatus.className = 'conn-status ' + state;
  connLabel.textContent = label;
}

// ── DB-operasjoner ────────────────────────────────────────────────────────────

async function dbUpdate(id, changes) {
  const { error } = await sb.from('products').update(changes).eq('id', id);
  if (error) { showToast('⚠️ Lagring feilet'); console.error(error); }
}

async function dbInsert(product) {
  const { error } = await sb.from('products').insert(product);
  if (error) { showToast('⚠️ Lagring feilet'); console.error(error); }
}

async function dbDelete(id) {
  const { error } = await sb.from('products').delete().eq('id', id);
  if (error) { showToast('⚠️ Sletting feilet'); console.error(error); }
}

// ── Hjelpefunksjoner ──────────────────────────────────────────────────────────

function locationOf(p) {
  if (p.butikk > 0 && p.ekstern > 0) return 'begge';
  if (p.butikk > 0) return 'butikk';
  if (p.ekstern > 0) return 'ekstern';
  return 'ingen';
}

function locBadgeHtml(p) {
  const map = {
    butikk:  ['loc-butikk',  '🏪 Butikk'],
    ekstern: ['loc-ekstern', '🏭 Eksternlager'],
    begge:   ['loc-begge',   '↔️ Begge steder'],
    ingen:   ['loc-ingen',   '— Ingen'],
  };
  const [cls, label] = map[locationOf(p)];
  return `<span class="loc-badge ${cls}">${label}</span>`;
}

function qtyBadge(n, cls) {
  return `<span class="qty-badge ${cls}${n === 0 ? ' qty-zero' : ''}">${n}</span>`;
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
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Render ────────────────────────────────────────────────────────────────────

function filteredProducts() {
  const list = db.products.filter(p => {
    if (activeFilter !== 'alle' && locationOf(p) !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.navn.toLowerCase().includes(q) ||
             p.artikkel.toLowerCase().includes(q) ||
             p.kategori.toLowerCase().includes(q) ||
             p.notat.toLowerCase().includes(q);
    }
    return true;
  });

  list.sort((a, b) => {
    let va = sortField === 'total' ? a.butikk + a.ekstern : a[sortField];
    let vb = sortField === 'total' ? b.butikk + b.ekstern : b[sortField];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  return list;
}

function rowHtml(p) {
  const moveBtns =
    (p.ekstern > 0 ? `<button class="btn-action btn-move" data-id="${p.id}" data-dir="til-butikk">🏪 Til butikk</button>` : '') +
    (p.butikk  > 0 ? `<button class="btn-action btn-move" data-id="${p.id}" data-dir="til-ekstern">🏭 Til ekstern</button>` : '');
  return `
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
          ${moveBtns}
          <button class="btn-action btn-edit"   data-id="${p.id}">Rediger</button>
          <button class="btn-action btn-delete" data-id="${p.id}">Slett</button>
        </div>
      </td>
    </tr>`;
}

function cardHtml(p) {
  return `
    <div class="prod-card" data-loc="${locationOf(p)}">
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
            <button class="qty-step qty-dec" data-id="${p.id}" data-field="butikk">−</button>
            <span class="qty-num ${p.butikk === 0 ? 'qty-num-zero' : 'qty-num-green'}">${p.butikk}</span>
            <button class="qty-step qty-inc" data-id="${p.id}" data-field="butikk">+</button>
          </div>
        </div>
        <div class="pc-qty-sep"></div>
        <div class="pc-qty-item">
          <span class="pc-qty-label">🏭 Ekstern</span>
          <div class="qty-stepper">
            <button class="qty-step qty-dec" data-id="${p.id}" data-field="ekstern">−</button>
            <span class="qty-num ${p.ekstern === 0 ? 'qty-num-zero' : 'qty-num-red'}">${p.ekstern}</span>
            <button class="qty-step qty-inc" data-id="${p.id}" data-field="ekstern">+</button>
          </div>
        </div>
      </div>
      <div class="pc-actions">
        <button class="btn-action btn-edit"   data-id="${p.id}">✏️ Rediger</button>
        <button class="btn-action btn-delete" data-id="${p.id}">🗑️ Slett</button>
      </div>
    </div>`;
}

function groupedHtml(list, itemFn, headerFn) {
  const order = [...new Set(db.products.map(p => p.kategori))];
  const groups = {};
  list.forEach(p => { (groups[p.kategori] = groups[p.kategori] || []).push(p); });
  return order.filter(k => groups[k]).map(k => headerFn(k) + groups[k].map(itemFn).join('')).join('');
}

function render() {
  const linesB = db.products.filter(p => p.butikk > 0).length;
  const linesE = db.products.filter(p => p.ekstern > 0).length;
  const total  = db.products.reduce((s, p) => s + p.butikk + p.ekstern, 0);
  countButikk.textContent  = linesB;
  countEkstern.textContent = linesE;
  countTotal.textContent   = total;

  // Update sort indicators
  document.querySelectorAll('#tableHead th').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.dataset.sort === sortField) th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
  });

  const list = filteredProducts();
  if (list.length === 0) {
    productBody.innerHTML  = '';
    productCards.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  if (groupByKategori) {
    productBody.innerHTML  = groupedHtml(list, rowHtml,
      k => `<tr class="cat-header-row"><td colspan="8"><span class="cat-header-label">${esc(k)}</span></td></tr>`);
    productCards.innerHTML = groupedHtml(list, cardHtml,
      k => `<div class="cat-header-card">${esc(k)}</div>`);
  } else {
    productBody.innerHTML  = list.map(rowHtml).join('');
    productCards.innerHTML = list.map(cardHtml).join('');
  }
}

// ── Produktskjema ─────────────────────────────────────────────────────────────

function openAddModal() {
  modalTitle.textContent = 'Legg til produkt';
  productForm.reset();
  editIdField.value = '';
  fieldButikk.value = 0;
  fieldEkstern.value = 0;
  modalProduct.classList.remove('hidden');
  setTimeout(() => fieldNavn.focus(), 50);
}

function openEditModal(id) {
  const p = db.products.find(x => x.id === id);
  if (!p) return;
  modalTitle.textContent = 'Rediger produkt';
  editIdField.value  = p.id;
  fieldNavn.value    = p.navn;
  fieldArtikkel.value = p.artikkel;
  fieldKategori.value = p.kategori;
  fieldPris.value    = p.pris || '';
  fieldNotat.value   = p.notat;
  fieldButikk.value  = p.butikk;
  fieldEkstern.value = p.ekstern;
  modalProduct.classList.remove('hidden');
  setTimeout(() => fieldNavn.focus(), 50);
}

function closeProductModal() { modalProduct.classList.add('hidden'); }

productForm.addEventListener('submit', async e => {
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

  closeProductModal();

  if (id) {
    const idx = db.products.findIndex(x => x.id === id);
    if (idx !== -1) { db.products[idx] = { ...db.products[idx], ...data }; render(); }
    await dbUpdate(id, data);
    showToast('Produkt oppdatert');
  } else {
    const newId = Date.now();
    const newProduct = { id: newId, ...data };
    db.products.push(newProduct);
    db.products.sort((a, b) => a.id - b.id);
    render();
    await dbInsert(newProduct);
    showToast('Produkt lagt til');
  }
});

// ── Flytt-modal ───────────────────────────────────────────────────────────────

function openTransferModal(id, direction) {
  const p = db.products.find(x => x.id === id);
  if (!p) return;
  transferCtx = { productId: id, direction };
  const isTilButikk = direction === 'til-butikk';
  transferTitle.textContent = isTilButikk ? 'Flytt: Eksternlager → Butikk' : 'Flytt: Butikk → Eksternlager';
  transferInfo.textContent  = p.navn;
  fromName.textContent = isTilButikk ? '🏭 Eksternlager' : '🏪 Butikk';
  toName.textContent   = isTilButikk ? '🏪 Butikk'       : '🏭 Eksternlager';
  fromAvail.textContent = isTilButikk ? p.ekstern : p.butikk;
  transferQty.value = 1;
  transferQty.max   = isTilButikk ? p.ekstern : p.butikk;
  transferError.classList.add('hidden');
  modalTransfer.classList.remove('hidden');
  setTimeout(() => { transferQty.focus(); transferQty.select(); }, 50);
}

function closeTransferModal() { modalTransfer.classList.add('hidden'); transferCtx = null; }

confirmTransfer.addEventListener('click', async () => {
  if (!transferCtx) return;
  const p = db.products.find(x => x.id === transferCtx.productId);
  if (!p) return;
  const qty   = parseInt(transferQty.value) || 0;
  const avail = transferCtx.direction === 'til-butikk' ? p.ekstern : p.butikk;
  if (qty <= 0)    { transferError.textContent = 'Antall må være minst 1'; transferError.classList.remove('hidden'); return; }
  if (qty > avail) { transferError.textContent = `Maks ${avail} tilgjengelig`; transferError.classList.remove('hidden'); return; }

  const dest = transferCtx.direction === 'til-butikk' ? 'butikk' : 'eksternlager';
  const changes = transferCtx.direction === 'til-butikk'
    ? { butikk: p.butikk + qty, ekstern: p.ekstern - qty }
    : { butikk: p.butikk - qty, ekstern: p.ekstern + qty };

  Object.assign(p, changes);
  render();
  closeTransferModal();
  await dbUpdate(p.id, changes);
  showToast(`${qty} stk. «${p.navn}» → ${dest}`);
});

// ── Slett ─────────────────────────────────────────────────────────────────────

async function deleteProduct(id) {
  const p = db.products.find(x => x.id === id);
  if (!p || !confirm(`Slett «${p.navn}»?`)) return;
  db.products = db.products.filter(x => x.id !== id);
  render();
  await dbDelete(id);
  showToast('Produkt slettet');
}

// ── Event-delegering ──────────────────────────────────────────────────────────

function handleProductClick(e) {
  const step = e.target.closest('.qty-step');
  if (step) {
    const p = db.products.find(x => x.id === parseInt(step.dataset.id));
    if (!p) return;
    const field  = step.dataset.field;
    const newVal = step.classList.contains('qty-inc') ? p[field] + 1 : Math.max(0, p[field] - 1);
    p[field] = newVal;
    render();
    dbUpdate(p.id, { [field]: newVal });
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

// ── Filtre og søk ─────────────────────────────────────────────────────────────

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    render();
  });
});

searchInput.addEventListener('input', () => { searchQuery = searchInput.value.trim(); render(); });
clearSearch.addEventListener('click',  () => { searchInput.value = ''; searchQuery = ''; render(); searchInput.focus(); });

document.getElementById('tableHead').addEventListener('click', e => {
  const th = e.target.closest('th[data-sort]');
  if (!th) return;
  const field = th.dataset.sort;
  if (sortField === field) {
    sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    sortField = field;
    sortDir   = 'asc';
  }
  render();
});

document.getElementById('btnGrupper').addEventListener('click', function () {
  groupByKategori = !groupByKategori;
  this.dataset.active = groupByKategori;
  this.classList.toggle('active', groupByKategori);
  render();
});

// ── Modal-koblinger ───────────────────────────────────────────────────────────

btnLeggTil.addEventListener('click', openAddModal);
fabLeggTil.addEventListener('click', openAddModal);
closeModalProduct.addEventListener('click', closeProductModal);
cancelProduct.addEventListener('click', closeProductModal);
closeModalTransfer.addEventListener('click', closeTransferModal);
cancelTransfer.addEventListener('click', closeTransferModal);

modalProduct.addEventListener('click',  e => { if (e.target === modalProduct)  closeProductModal(); });
modalTransfer.addEventListener('click', e => { if (e.target === modalTransfer) closeTransferModal(); });
document.addEventListener('keydown',    e => { if (e.key === 'Escape') { closeProductModal(); closeTransferModal(); } });

// ── Start ─────────────────────────────────────────────────────────────────────

init();
