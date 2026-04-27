'use strict';

const express    = require('express');
const { WebSocketServer } = require('ws');
const fs         = require('fs');
const path       = require('path');
const http       = require('http');

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocketServer({ server });

const DATA_FILE = path.join(__dirname, 'data.json');

// ── Standarddata (alle Europris-produkter) ────────────────────────────────────

function defaultData() {
  return {
    nextId: 62,
    products: [
      // Hagegruppe / Loungesett
      { id:  1, navn: 'Loungesett utemøbler kunstrotting Lyngby',        artikkel: '210968', kategori: 'Hagegruppe/Loungesett', pris: 5999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  2, navn: 'Sofasett Fyn',                                     artikkel: '220720', kategori: 'Hagegruppe/Loungesett', pris: 1999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  3, navn: 'Hjørnesofa m/bord Løkken',                         artikkel: '220608', kategori: 'Hagegruppe/Loungesett', pris: 4899,  notat: '', butikk: 0, ekstern: 0 },
      { id:  4, navn: 'Spisegruppe m/4 stoler Athen',                     artikkel: '220781', kategori: 'Hagegruppe/Loungesett', pris: 1999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  5, navn: 'Hjørnesofa stål Boston',                           artikkel: '220980', kategori: 'Hagegruppe/Loungesett', pris: 4999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  6, navn: 'Utesofa med sjeselong natur kunstrotting Capri',   artikkel: '220777', kategori: 'Hagegruppe/Loungesett', pris: 3999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  7, navn: 'Sofagruppe 4-delt beige Garda',                    artikkel: '220776', kategori: 'Hagegruppe/Loungesett', pris: 4999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  8, navn: 'Hagegruppe utesofa stoler bord grå stål Bari',     artikkel: '216525', kategori: 'Hagegruppe/Loungesett', pris: 4999,  notat: '', butikk: 0, ekstern: 0 },
      { id:  9, navn: 'Utesofa med sjeselong natur kunstrotting Capri',   artikkel: '216342', kategori: 'Hagegruppe/Loungesett', pris: 3999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 10, navn: 'Hagegruppe utesofa stoler bord teak Greve',        artikkel: '211667', kategori: 'Hagegruppe/Loungesett', pris: 8999,  notat: 'Medlemspris', butikk: 0, ekstern: 0 },
      { id: 11, navn: 'Utendørs sofagruppe aluminium Lyngby',             artikkel: '210911', kategori: 'Hagegruppe/Loungesett', pris: 12999, notat: '', butikk: 0, ekstern: 0 },
      { id: 12, navn: 'Loungesett utemøbler kunstrotting Ishøj',          artikkel: '210890', kategori: 'Hagegruppe/Loungesett', pris: 2999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 13, navn: 'Utendørs sofagruppe aluminium Vejle',              artikkel: '216339', kategori: 'Hagegruppe/Loungesett', pris: 4999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 14, navn: 'Hagegruppe antrasitt stål Blokhus',                artikkel: '216338', kategori: 'Hagegruppe/Loungesett', pris: 1999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 15, navn: 'Hjørnesofa ute m/bord kunstrotting Løkken',        artikkel: '211253', kategori: 'Hagegruppe/Loungesett', pris: 4899,  notat: '', butikk: 0, ekstern: 0 },
      { id: 16, navn: 'Utendørs sofagruppe aluminium Vejle',              artikkel: '210894', kategori: 'Hagegruppe/Loungesett', pris: 4999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 17, navn: 'Hjørnesofa ute m/bord aluminium Miami',            artikkel: '210912', kategori: 'Hagegruppe/Loungesett', pris: 11999, notat: '', butikk: 0, ekstern: 0 },
      { id: 18, navn: 'Utendørs sofagruppe kunstrotting Nice',            artikkel: '206785', kategori: 'Hagegruppe/Loungesett', pris: 12999, notat: '', butikk: 0, ekstern: 0 },
      { id: 19, navn: 'Utendørs sofagruppe grå kunstrotting Larkollen',   artikkel: '192660', kategori: 'Hagegruppe/Loungesett', pris: 3999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 20, navn: 'Utendørs sofagruppe akasietre Hillerød',           artikkel: '206786', kategori: 'Hagegruppe/Loungesett', pris: 9999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 21, navn: 'Hagegruppe kunstrotting Monaco',                   artikkel: '206788', kategori: 'Hagegruppe/Loungesett', pris: 6999,  notat: '', butikk: 0, ekstern: 0 },
      // Stoler
      { id: 22, navn: 'Stablestol beige plast Flora',                     artikkel: '220607', kategori: 'Stoler', pris: 199,  notat: '', butikk: 0, ekstern: 0 },
      { id: 23, navn: 'Strandstol Rio',                                   artikkel: '221090', kategori: 'Stoler', pris: 149,  notat: '', butikk: 0, ekstern: 0 },
      { id: 24, navn: 'Solstol m/pute',                                   artikkel: '221091', kategori: 'Stoler', pris: 499,  notat: '', butikk: 0, ekstern: 0 },
      { id: 25, navn: 'Cafestol Santorini',                               artikkel: '220774', kategori: 'Stoler', pris: 199,  notat: '', butikk: 0, ekstern: 0 },
      { id: 26, navn: 'Stol 7-pos alu Fyn',                              artikkel: '220722', kategori: 'Stoler', pris: 699,  notat: '', butikk: 0, ekstern: 0 },
      { id: 27, navn: 'Hvilestol m/fothviler Løkken',                    artikkel: '220716', kategori: 'Stoler', pris: 1399, notat: '', butikk: 0, ekstern: 0 },
      { id: 28, navn: 'Baden Baden stol beige',                           artikkel: '220604', kategori: 'Stoler', pris: 499,  notat: '', butikk: 0, ekstern: 0 },
      { id: 29, navn: 'Loungestol Milano',                                artikkel: '220569', kategori: 'Stoler', pris: 1299, notat: '', butikk: 0, ekstern: 0 },
      { id: 30, navn: 'Stol i tre sammenleggbar Relax',                  artikkel: '216956', kategori: 'Stoler', pris: 1299, notat: '', butikk: 0, ekstern: 0 },
      { id: 31, navn: 'Strandstol 5-pos blå/hvit alu Hawaii',            artikkel: '216593', kategori: 'Stoler', pris: 449,  notat: '', butikk: 0, ekstern: 0 },
      { id: 32, navn: 'Spisestol rotting Salento',                       artikkel: '211610', kategori: 'Stoler', pris: 1499, notat: '', butikk: 0, ekstern: 0 },
      { id: 33, navn: 'Stablestol stål m/plastsete Fyn',                 artikkel: '210889', kategori: 'Stoler', pris: 399,  notat: '', butikk: 0, ekstern: 0 },
      // Solseng / Solstol
      { id: 34, navn: 'Solseng beige Maya',                              artikkel: '220770', kategori: 'Solseng/Solstol', pris: 499,  notat: '', butikk: 0, ekstern: 0 },
      { id: 35, navn: 'Hvilestol ute m/fotpall Miami',                   artikkel: '210905', kategori: 'Solseng/Solstol', pris: 3999, notat: '', butikk: 0, ekstern: 0 },
      { id: 36, navn: 'Hvilestol ute m/fotpall Lyngby',                  artikkel: '211250', kategori: 'Solseng/Solstol', pris: 4999, notat: '', butikk: 0, ekstern: 0 },
      // Cafesett / Bistrosett
      { id: 37, navn: 'Cafesett 3-delt Roma',                            artikkel: '220779', kategori: 'Cafesett/Bistrosett', pris: 1499, notat: '', butikk: 0, ekstern: 0 },
      { id: 38, navn: 'Bistrosett cafebord og stoler stål Tunis',        artikkel: '216840', kategori: 'Cafesett/Bistrosett', pris: 1259, notat: '', butikk: 0, ekstern: 0 },
      { id: 39, navn: 'Bistrosett cafebord og stoler stål Marokko',      artikkel: '216526', kategori: 'Cafesett/Bistrosett', pris: 1259, notat: '', butikk: 0, ekstern: 0 },
      { id: 40, navn: 'Paris bistrosett stål blå',                       artikkel: '210893', kategori: 'Cafesett/Bistrosett', pris: 799,  notat: '', butikk: 0, ekstern: 0 },
      { id: 41, navn: 'Paris bistrosett stål hvit',                      artikkel: '210892', kategori: 'Cafesett/Bistrosett', pris: 799,  notat: '', butikk: 0, ekstern: 0 },
      // Bord
      { id: 42, navn: 'Hagebord 67x67 cm Hero',                          artikkel: '211495', kategori: 'Bord', pris: 999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 43, navn: 'Cafebord Santorini',                              artikkel: '220775', kategori: 'Bord', pris: 299,  notat: '', butikk: 0, ekstern: 0 },
      { id: 44, navn: 'Sidebord/krakk teak Borneo',                      artikkel: '216527', kategori: 'Bord', pris: 499,  notat: '', butikk: 0, ekstern: 0 },
      { id: 45, navn: 'Bord m/klaff 90x135/180 cm',                      artikkel: '216524', kategori: 'Bord', pris: 1999, notat: '', butikk: 0, ekstern: 0 },
      { id: 46, navn: 'Hagebord Bonum ø120 cm',                          artikkel: '197213', kategori: 'Bord', pris: 1799, notat: '', butikk: 0, ekstern: 0 },
      { id: 47, navn: 'Spisebord ø120 cm akasie Rollo',                  artikkel: '211496', kategori: 'Bord', pris: 3499, notat: '', butikk: 0, ekstern: 0 },
      { id: 48, navn: 'Hagebord Viborg ø117 cm',                         artikkel: '197211', kategori: 'Bord', pris: 3999, notat: '', butikk: 0, ekstern: 0 },
      { id: 49, navn: 'Spisebord 220x100 cm Hein',                       artikkel: '211564', kategori: 'Bord', pris: 3999, notat: '', butikk: 0, ekstern: 0 },
      { id: 50, navn: 'Hagebord Larkollen 90x150 cm',                    artikkel: '192826', kategori: 'Bord', pris: 1299, notat: '', butikk: 0, ekstern: 0 },
      // Benk
      { id: 51, navn: 'Hagebenk 108x59,5 cm stål Roma',                  artikkel: '220778', kategori: 'Benk', pris: 1199, notat: '', butikk: 0, ekstern: 0 },
      { id: 52, navn: 'Hagebenk m/oppbevaring 227 liter Keter',          artikkel: '197676', kategori: 'Benk', pris: 1999, notat: '', butikk: 0, ekstern: 0 },
      // Parasoll
      { id: 53, navn: 'Parasoll ø250 cm Fie',                            artikkel: '211493', kategori: 'Parasoll', pris: 999,  notat: '', butikk: 0, ekstern: 0 },
      { id: 54, navn: 'Parasoll 2,2 m Cancun',                           artikkel: '211251', kategori: 'Parasoll', pris: 1299, notat: '', butikk: 0, ekstern: 0 },
      { id: 55, navn: 'Parasoll ø300 cm Bello',                          artikkel: '197639', kategori: 'Parasoll', pris: 1999, notat: '', butikk: 0, ekstern: 0 },
      { id: 56, navn: 'Parasoll ø270 cm mørk grå',                       artikkel: '188584', kategori: 'Parasoll', pris: 699,  notat: '', butikk: 0, ekstern: 0 },
      { id: 57, navn: 'Parasoll ø270 cm blå',                            artikkel: '166039', kategori: 'Parasoll', pris: 699,  notat: '', butikk: 0, ekstern: 0 },
      { id: 58, navn: 'Parasoll ø270 cm grå',                            artikkel: '171161', kategori: 'Parasoll', pris: 699,  notat: '', butikk: 0, ekstern: 0 },
      // Parasollfot
      { id: 59, navn: 'Parasollfot 25 kg granitt',                       artikkel: '216341', kategori: 'Parasollfot', pris: 449, notat: '', butikk: 0, ekstern: 0 },
      { id: 60, navn: 'Parasollfot 35 kg granitt',                       artikkel: '203730', kategori: 'Parasollfot', pris: 999, notat: '', butikk: 0, ekstern: 0 },
      { id: 61, navn: 'Parasollfot 30 kg betong',                        artikkel: '112694', kategori: 'Parasollfot', pris: 799, notat: '', butikk: 0, ekstern: 0 },
    ]
  };
}

// ── Datalagring ───────────────────────────────────────────────────────────────

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Kunne ikke lese data.json:', e.message);
  }
  const data = defaultData();
  writeData(data);
  return data;
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  } catch (e) {
    console.error('Kunne ikke lagre data.json:', e.message);
  }
}

// ── WebSocket ─────────────────────────────────────────────────────────────────

function broadcast(data, excludeWs) {
  const msg = JSON.stringify({ type: 'sync', data });
  for (const client of wss.clients) {
    if (client !== excludeWs && client.readyState === 1) {
      client.send(msg);
    }
  }
}

wss.on('connection', ws => {
  // Send gjeldende data til ny klient
  ws.send(JSON.stringify({ type: 'sync', data: readData() }));

  ws.on('message', raw => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === 'update' && msg.data) {
        writeData(msg.data);
        broadcast(msg.data, ws); // send til alle andre
      }
    } catch {}
  });

  ws.on('error', () => {});
});

// ── HTTP ──────────────────────────────────────────────────────────────────────

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Europris lagerstyring: http://localhost:${PORT}`);
});
