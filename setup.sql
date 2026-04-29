-- ════════════════════════════════════════════════════════════════
-- Europris lagerstyring – kjør dette i Supabase SQL-editor
-- ════════════════════════════════════════════════════════════════

-- 1. Lag tabell
CREATE TABLE products (
  id       BIGINT  PRIMARY KEY,
  navn     TEXT    NOT NULL DEFAULT '',
  artikkel TEXT    NOT NULL DEFAULT '',
  kategori TEXT    NOT NULL DEFAULT '',
  pris     INTEGER NOT NULL DEFAULT 0,
  notat    TEXT    NOT NULL DEFAULT '',
  butikk   INTEGER NOT NULL DEFAULT 0,
  ekstern  INTEGER NOT NULL DEFAULT 0
);

-- 2. Aktiver sanntid (Realtime)
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- 3. Åpen tilgang uten innlogging (internt verktøy)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON products FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

-- 4. Fyll inn alle Europris-produkter
INSERT INTO products (id, navn, artikkel, kategori, pris, notat, butikk, ekstern) VALUES
-- Hagegruppe / Loungesett
(1,  'Loungesett utemøbler kunstrotting Lyngby',       '210968', 'Hagegruppe/Loungesett', 5999,  '',            0, 0),
(2,  'Sofasett Fyn',                                    '220720', 'Hagegruppe/Loungesett', 1999,  '',            0, 0),
(3,  'Hjørnesofa m/bord Løkken',                        '220608', 'Hagegruppe/Loungesett', 4899,  '',            0, 0),
(4,  'Spisegruppe m/4 stoler Athen',                    '220781', 'Hagegruppe/Loungesett', 1999,  '',            0, 0),
(5,  'Hjørnesofa stål Boston',                          '220980', 'Hagegruppe/Loungesett', 4999,  '',            0, 0),
(6,  'Utesofa med sjeselong natur kunstrotting Capri',  '220777', 'Hagegruppe/Loungesett', 3999,  '',            0, 0),
(7,  'Sofagruppe 4-delt beige Garda',                   '220776', 'Hagegruppe/Loungesett', 4999,  '',            0, 0),
(8,  'Hagegruppe utesofa stoler bord grå stål Bari',    '216525', 'Hagegruppe/Loungesett', 4999,  '',            0, 0),
(9,  'Utesofa med sjeselong natur kunstrotting Capri',  '216342', 'Hagegruppe/Loungesett', 3999,  '',            0, 0),
(10, 'Hagegruppe utesofa stoler bord teak Greve',       '211667', 'Hagegruppe/Loungesett', 8999,  'Medlemspris', 0, 0),
(11, 'Utendørs sofagruppe aluminium Lyngby',            '210911', 'Hagegruppe/Loungesett', 12999, '',            0, 0),
(12, 'Loungesett utemøbler kunstrotting Ishøj',         '210890', 'Hagegruppe/Loungesett', 2999,  '',            0, 0),
(13, 'Utendørs sofagruppe aluminium Vejle',             '216339', 'Hagegruppe/Loungesett', 4999,  '',            0, 0),
(14, 'Hagegruppe antrasitt stål Blokhus',               '216338', 'Hagegruppe/Loungesett', 1999,  '',            0, 0),
(15, 'Hjørnesofa ute m/bord kunstrotting Løkken',       '211253', 'Hagegruppe/Loungesett', 4899,  '',            0, 0),
(16, 'Utendørs sofagruppe aluminium Vejle',             '210894', 'Hagegruppe/Loungesett', 4999,  '',            0, 0),
(17, 'Hjørnesofa ute m/bord aluminium Miami',           '210912', 'Hagegruppe/Loungesett', 11999, '',            0, 0),
(18, 'Utendørs sofagruppe kunstrotting Nice',           '206785', 'Hagegruppe/Loungesett', 12999, '',            0, 0),
(19, 'Utendørs sofagruppe grå kunstrotting Larkollen',  '192660', 'Hagegruppe/Loungesett', 3999,  '',            0, 0),
(20, 'Utendørs sofagruppe akasietre Hillerød',          '206786', 'Hagegruppe/Loungesett', 9999,  '',            0, 0),
(21, 'Hagegruppe kunstrotting Monaco',                  '206788', 'Hagegruppe/Loungesett', 6999,  '',            0, 0),
-- Stoler
(22, 'Stablestol beige plast Flora',                    '220607', 'Stoler', 199,  '', 0, 0),
(23, 'Strandstol Rio',                                  '221090', 'Stoler', 149,  '', 0, 0),
(24, 'Solstol m/pute',                                  '221091', 'Stoler', 499,  '', 0, 0),
(25, 'Cafestol Santorini',                              '220774', 'Stoler', 199,  '', 0, 0),
(26, 'Stol 7-pos alu Fyn',                             '220722', 'Stoler', 699,  '', 0, 0),
(27, 'Hvilestol m/fothviler Løkken',                   '220716', 'Stoler', 1399, '', 0, 0),
(28, 'Baden Baden stol beige',                          '220604', 'Stoler', 499,  '', 0, 0),
(29, 'Loungestol Milano',                               '220569', 'Stoler', 1299, '', 0, 0),
(30, 'Stol i tre sammenleggbar Relax',                 '216956', 'Stoler', 1299, '', 0, 0),
(31, 'Strandstol 5-pos blå/hvit alu Hawaii',           '216593', 'Stoler', 449,  '', 0, 0),
(32, 'Spisestol rotting Salento',                      '211610', 'Stoler', 1499, '', 0, 0),
(33, 'Stablestol stål m/plastsete Fyn',                '210889', 'Stoler', 399,  '', 0, 0),
-- Solseng / Solstol
(34, 'Solseng beige Maya',                             '220770', 'Solseng/Solstol', 499,  '', 0, 0),
(35, 'Hvilestol ute m/fotpall Miami',                  '210905', 'Solseng/Solstol', 3999, '', 0, 0),
(36, 'Hvilestol ute m/fotpall Lyngby',                 '211250', 'Solseng/Solstol', 4999, '', 0, 0),
-- Cafesett / Bistrosett
(37, 'Cafesett 3-delt Roma',                           '220779', 'Cafesett/Bistrosett', 1499, '', 0, 0),
(38, 'Bistrosett cafebord og stoler stål Tunis',       '216840', 'Cafesett/Bistrosett', 1259, '', 0, 0),
(39, 'Bistrosett cafebord og stoler stål Marokko',     '216526', 'Cafesett/Bistrosett', 1259, '', 0, 0),
(40, 'Paris bistrosett stål blå',                      '210893', 'Cafesett/Bistrosett', 799,  '', 0, 0),
(41, 'Paris bistrosett stål hvit',                     '210892', 'Cafesett/Bistrosett', 799,  '', 0, 0),
-- Bord
(42, 'Hagebord 67x67 cm Hero',                         '211495', 'Bord', 999,  '', 0, 0),
(43, 'Cafebord Santorini',                             '220775', 'Bord', 299,  '', 0, 0),
(44, 'Sidebord/krakk teak Borneo',                     '216527', 'Bord', 499,  '', 0, 0),
(45, 'Bord m/klaff 90x135/180 cm',                     '216524', 'Bord', 1999, '', 0, 0),
(46, 'Hagebord Bonum ø120 cm',                         '197213', 'Bord', 1799, '', 0, 0),
(47, 'Spisebord ø120 cm akasie Rollo',                 '211496', 'Bord', 3499, '', 0, 0),
(48, 'Hagebord Viborg ø117 cm',                        '197211', 'Bord', 3999, '', 0, 0),
(49, 'Spisebord 220x100 cm Hein',                      '211564', 'Bord', 3999, '', 0, 0),
(50, 'Hagebord Larkollen 90x150 cm',                   '192826', 'Bord', 1299, '', 0, 0),
-- Benk
(51, 'Hagebenk 108x59,5 cm stål Roma',                 '220778', 'Benk', 1199, '', 0, 0),
(52, 'Hagebenk m/oppbevaring 227 liter Keter',         '197676', 'Benk', 1999, '', 0, 0),
-- Parasoll
(53, 'Parasoll ø250 cm Fie',                           '211493', 'Parasoll', 999,  '', 0, 0),
(54, 'Parasoll 2,2 m Cancun',                          '211251', 'Parasoll', 1299, '', 0, 0),
(55, 'Parasoll ø300 cm Bello',                         '197639', 'Parasoll', 1999, '', 0, 0),
(56, 'Parasoll ø270 cm mørk grå',                      '188584', 'Parasoll', 699,  '', 0, 0),
(57, 'Parasoll ø270 cm blå',                           '166039', 'Parasoll', 699,  '', 0, 0),
(58, 'Parasoll ø270 cm grå',                           '171161', 'Parasoll', 699,  '', 0, 0),
-- Parasollfot
(59, 'Parasollfot 25 kg granitt',                      '216341', 'Parasollfot', 449, '', 0, 0),
(60, 'Parasollfot 35 kg granitt',                      '203730', 'Parasollfot', 999, '', 0, 0),
(61, 'Parasollfot 30 kg betong',                       '112694', 'Parasollfot', 799, '', 0, 0),
-- Putekasse
(62, 'Stor putekasse Homebox Ultra 985 liter',            '211956', 'Putekasse', 2999, '', 0, 0),
(63, 'Stor vanntett putekasse galvanisert stål 600 liter','210930', 'Putekasse', 3499, '', 0, 0),
(64, 'Stor vanntett putekasse Viborg skifergrå 582 liter','192667', 'Putekasse', 3499, '', 0, 0),
(65, 'Stor vanntett putekasse Keter Darwin 662 liter',    '216711', 'Putekasse', 2999, '', 0, 0),
(66, 'Stor vanntett putekasse Ontario Deco 870 liter',    '216710', 'Putekasse', 3499, '', 0, 0),
(67, 'Liten vanntett putekasse Keter Emily 280 liter',    '216693', 'Putekasse',  699, '', 0, 0),
(68, 'Medium vanntett putekasse Keter Kentwood 350 liter','197674', 'Putekasse',  999, '', 0, 0),
(69, 'Stor vanntett putekasse Keter Northwood 630 liter', '197675', 'Putekasse', 1999, '', 0, 0),
(70, 'Stor vanntett putekasse Keter Darwin brun 662 liter','216712','Putekasse', 3499, '', 0, 0),
(71, 'Multibox Balcony Homebox 106 liter',                '211953', 'Putekasse',  399, '', 0, 0);
