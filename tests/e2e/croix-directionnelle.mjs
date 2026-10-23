// Test de la croix directionnelle V2 et des accès tactiles aux pièces (CX2, CA2 à CA10) — mobile < 768 px.
// TOUTES les pages sont des FIXTURES inertes étiquetées « FIXTURE » (aucun réseau Kraland, aucun compte) :
// les navigations sont interceptées et comptées, jamais exécutées. Rien ici ne prouve le comportement du site réel.
//
// Usage : npm run build && npm run test:croix
// Option : KR_SCRIPT=/chemin/script.user.js pour tester un autre fichier (défaut : bundle principal).
// Option : KR_SHOTS=/dossier pour enregistrer des captures de fixtures (étiquetées FIXTURE).
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { frames, krReady, styleSettled, waitState, watchMutations } from './lib/settle.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const TARGET = 'http://www.kraland.org/jouer/plateau';
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');
const SHOTS = process.env.KR_SHOTS || '';
const WIDTHS = [320, 375, 390, 430, 700];
const LONG_NOSPACE = 'Entrepot-de-stockage-souterrain-principal-ouest';

// Aires natives : l'image 60×60 du jeu a une seule zone (Sud). Les autres directions sont des FIXTURES.
const AREA_COORDS = { Nord: '24,0,48,16', Ouest: '0,22,16,44', Est: '44,22,60,44', Sud: '0,31,28,52' };

function fixtureHtml({ dirs = ['Nord', 'Ouest', 'Est', 'Sud'], rooms, areaOverride, noMap = false, noRow = false }) {
  const areas = areaOverride || dirs.map(d => `<area shape="rect" coords="${AREA_COORDS[d]}" alt="${d}" href="/jouer/plateau/FIXTURE-dir-${d.toLowerCase()}"${d === 'Nord' ? ' onclick="window.__clicks.push(\'nord\')"' : ''}>`).join('');
  // Structure RÉELLE mesurée sur le site (10/10) : <a class="btn btn-primary|btn-warning"><img src=".../bat/batN.gif"></a>, sans texte, alt ni title ;
  // le nom et le cadenas sont dessinés dans le GIF (batNlock.gif). Un texte n'est ajouté que pour les fixtures « noms texte » (hypothétiques).
  const roomsHtml = rooms.map((r, i) => `<a class="btn ${r.current ? 'btn-warning' : 'btn-primary'}" href="/jouer/plateau/FIXTURE-room-${i + 1}"${r.onclick ? ` onclick="window.__clicks.push('room${i + 1}')"` : ''}><img src="http://img7.kraland.org/2/bat/bat${r.bat ?? i}${r.locked && !r.name ? 'lock' : ''}.gif" width="60" height="60">${r.name || ''}${r.locked && r.name ? '<img src="http://img7.kraland.org/2/cadenas.gif" width="11" height="12" alt="verrouillé">' : ''}</a>`).join('\n');
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>FIXTURE croix directionnelle (aucune donnée réelle)</title>
<style>
  a { color: #337ab7; text-decoration: none; } a:hover { color: #23527c; text-decoration: underline; }
  .btn { display: inline-block; padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: 400; line-height: 1.42857143; text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; border: 1px solid transparent; border-radius: 4px; }
  .collapse:not(.in) { display: none; } /* Bootstrap 3 : menu replié */
  .btn-primary { color: #fff; background-color: #337ab7; } .btn-warning { color: #fff; background-color: #f0ad4e; }
</style></head><body>
<nav class="navbar navbar-inverse nomargin"><div class="container"><div class="navbar-header"><a class="navbar-brand" href="/">Kraland</a></div>
<div id="navbar" class="navbar-collapse collapse"><ul class="nav navbar-nav"><li><a href="/jouer/plateau">Jouer</a></li></ul></div></div></nav>
<div id="content" class="container"><div class="${noRow ? 'row' : 'row center'}" id="zone-native">
  <div class="col-xs-12"><img alt="Sortir" src="http://img7.kraland.org/2/bat/exit3.gif" width="60" height="60"${noMap ? '' : ' usemap="#exitmap"'}>${noMap ? '' : `<map name="exitmap">${areas}</map>`}</div>
  ${roomsHtml}
</div>
<div class="row"><div class="col-md-12"><textarea id="champ-saisie" rows="2"></textarea><p style="height:2000px">FIXTURE : suite de la page</p></div></div></div>
</body></html>`;
}

const room = (name, extra = {}) => ({ name, ...extra });
// Pièce réelle : image seule, aucun nom. Le tri natif du script (batN.gif, inchangé) place les GIF « batNlock.gif » en fin de liste : on les met en fin dans les fixtures
const img = (extra = {}) => ({ ...extra });
const STATES = {
  'FIXTURE 4 directions, 5 pièces': { rooms: [img(), img({ current: true, onclick: true }), img(), img({ locked: true }), img({ locked: true })] },
  'FIXTURE Sud seul, 3 pièces': { dirs: ['Sud'], rooms: [img(), img({ current: true }), img()] },
  'FIXTURE aucune direction, 3 pièces': { dirs: [], rooms: [img(), img({ current: true }), img()] },
  'FIXTURE 4 directions, 8 pièces': { rooms: [0, 1, 2, 3, 4, 5, 6, 7].map(i => img({ current: i === 1, locked: i === 7 })) },
  'FIXTURE noms texte, 5 pièces': { named: true, rooms: [room('Extérieur'), room('Commerce', { current: true, onclick: true }), room('Chambre'), room('Bureau', { locked: true }), room('Réserve', { locked: true })] },
  'FIXTURE noms texte longs, 5 pièces': { named: true, rooms: [room('Hôtel « Chez Alice, Malcom et leurs amis de longue date »'), room(LONG_NOSPACE, { current: true }), room('Salle commune du rez-de-chaussée, côté jardin d\'hiver'), room('Chambre n° 12 avec balcon', { locked: true }), room('Réserve')] }
};
// Cas impossibles : le natif doit rester visible et fonctionnel (CA10)
const IMPOSSIBLE = {
  'FIXTURE area ambiguë (alt inconnu, centre en diagonale)': { areaOverride: '<area shape="rect" coords="40,40,52,52" alt="Sortir" href="/jouer/plateau/FIXTURE-dir-x">', rooms: [room('Extérieur'), room('Commerce', { current: true })] },
  'FIXTURE deux areas pour une même direction': { areaOverride: '<area shape="rect" coords="0,31,28,52" alt="Sud" href="/jouer/plateau/FIXTURE-a"><area shape="rect" coords="30,31,58,52" alt="Sortir Sud" href="/jouer/plateau/FIXTURE-b">', rooms: [room('Extérieur')] },
  'FIXTURE area non rectangulaire': { areaOverride: '<area shape="poly" coords="0,0,10,10,0,10" alt="Sud" href="/jouer/plateau/FIXTURE-poly">', rooms: [room('Extérieur')] },
  'FIXTURE map absente': { noMap: true, rooms: [room('Extérieur'), room('Commerce', { current: true })] },
  // s2 : sans .row.center le natif ne peut pas être masqué ; ne rien insérer (sinon deux commandes visibles)
  'FIXTURE conteneur .row.center absent': { noRow: true, rooms: [room('Extérieur'), room('Commerce', { current: true })] },
  // s1 : area sans alt, géométrie de la vraie area Sud (0,31,28,52) : aucun quadrant net → natif conservé
  'FIXTURE area sans alt, géométrie ambiguë (area Sud réelle)': { areaOverride: '<area shape="rect" coords="0,31,28,52" href="/jouer/plateau/FIXTURE-dir-x">', rooms: [room('Extérieur'), room('Commerce', { current: true })] }
};

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.replace(/\s*\n\s*/g, ' ').slice(0, 400)); }
}

// Fragmentation (exécution parallèle) : KR_FRAG = etats, impossibles, clics, transitions, themes, ordre, m1, natif ; vide = tout jouer.
// (CA6 et CA16 dépendent des mesures de « etats » : ils sont joués avec lui.)
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const frag = id => FRAG.length === 0 || FRAG.includes(id);

const browser = await launchBrowser();
let currentHtml = '';
const requests = []; // navigations vers les FIXTURE-* : interceptées et comptées
async function newPage(variant = 'empire-brun-dark', enabled = true) {
  const context = await browser.newContext({ viewport: { width: 375, height: 800 }, hasTouch: true, isMobile: false });
  await confineNetwork(context); // refus global EN PREMIER (img7 routé ci-dessous)
  await context.route(TARGET, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: currentHtml }));
  await context.route('**/FIXTURE-*', route => { requests.push(route.request().url()); route.abort(); });
  await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
  await context.addInitScript(({ src, variant: v, enabled: en }) => {
    window.GM = { xmlHttpRequest: () => {} };
    window.__clicks = [];
    window.__navs = [];
    // Inerte : toute navigation vers une destination FIXTURE-* est annulée avant l'envoi de la requête, puis comptée
    if (window.navigation) {
      window.navigation.addEventListener('navigate', ev => {
        if (/FIXTURE-/.test(ev.destination.url) && ev.cancelable) { window.__navs.push(ev.destination.url); ev.preventDefault(); }
      });
    }
    localStorage.setItem('kr-theme-enabled', String(en));
    localStorage.setItem('kr-theme-variant', v);
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { src: userscript, variant, enabled });
  const page = await context.newPage();
  return { page, context };
}

async function load(page, width, html, waitBlock = true) {
  currentHtml = html;
  await page.setViewportSize({ width, height: 800 });
  await page.goto(TARGET, { waitUntil: 'load' });
  // Fin d'initialisation (html[data-kr-ready] : syncNavigation et son anti-rebond suivis par InitQueue) au lieu de 500 / 2 500 ms.
  // Bloc attendu : condition bornée sans erreur (la vérification tranche). Absence attendue : le marqueur ne prouve rien d'un traitement
  // non enregistré dans InitQueue ; les cas « aucun bloc » ajoutent donc la fenêtre d'absence ABSENCE_MS (absenceWindow).
  await krReady(page, { label: 'croix ' + width });
  if (waitBlock) { await waitState(page, () => !!document.querySelector('.kr-nav-v2'), null, { maxMs: 6000 }); }
}
// Fenêtre d'absence des cas « aucun bloc » (impossibles, natif), remplace l'ancienne attente de 2 500 ms : 1 000 ms observés APRÈS le
// marqueur couvrent toute synchronisation tardive armée jusqu'à 1 s après l'initialisation (minuterie nue hors InitQueue, qui
// construirait le bloc ou masquerait le natif). Aucune mutation n'est attendue : le moindre changement du DOM est un échec.
const ABSENCE_MS = 1000;
const absenceWindow = page => watchMutations(page, { ms: ABSENCE_MS });
// Réinjection du userscript : un nouvel InitQueue reposera html[data-kr-ready] quand sa synchronisation différée sera finie.
async function reinject(page) {
  // eslint-disable-next-line no-eval
  await page.evaluate(src => { document.documentElement.removeAttribute('data-kr-ready'); (0, eval)(src); }, userscript);
  await krReady(page, { label: 'croix réinjection' });
}
// Synchronisation après une mutation de la zone native (anti-rebond de 120 ms, hors InitQueue une fois le marqueur posé) :
// condition observable propre à chaque cas, bornée sans erreur, puis deux images.
async function synced(page, fn, arg = null) { await waitState(page, fn, arg, { maxMs: 3000 }); await frames(page); }

// Mesures DOM d'une page transformée
const measure = (page) => page.evaluate(() => {
  const R = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; };
  const blocks = [...document.querySelectorAll('.kr-nav-v2')];
  const block = blocks[0];
  const native = document.getElementById('zone-native');
  const nativeAreas = [...native.querySelectorAll('area')].map(a => ({ alt: a.getAttribute('alt'), href: a.getAttribute('href') }));
  const grid = (el) => {
    const q = R(el); let hits = 0; let total = 0;
    [0.08, 0.25, 0.5, 0.75, 0.92].forEach(fx => [0.08, 0.25, 0.5, 0.75, 0.92].forEach(fy => {
      total += 1; const hit = document.elementFromPoint(q.x + q.w * fx, q.y + q.h * fy); if (hit && hit.closest('a') === el) { hits += 1; }
    }));
    const c = document.elementFromPoint(q.x + q.w / 2, q.y + q.h / 2);
    return { hits, total, centreOk: Boolean(c && c.closest('a') === el) };
  };
  const out = {
    w: window.innerWidth, mobile: document.body.classList.contains('mobile-mode'), nBlocks: blocks.length,
    docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    native: { display: getComputedStyle(native).display, inline: native.style.display, areas: nativeAreas, imgUsemap: native.querySelector('img[alt="Sortir"]') && native.querySelector('img[alt="Sortir"]').getAttribute('usemap'), mapInDoc: Boolean(document.querySelector('map[name="exitmap"]')) },
    clicks: window.__clicks.slice()
  };
  if (!block) { return out; }
  const pad = block.querySelector('.kr-pad');
  const hub = block.querySelector('.kr-hub');
  const hubRect = R(hub);
  const hubHit = document.elementFromPoint(hubRect.x + hubRect.w / 2, hubRect.y + hubRect.h / 2);
  const controls = [...block.querySelectorAll('a.kr-arm, a.kr-room')];
  const overlaps = [];
  for (let i = 0; i < controls.length; i += 1) {
    for (let j = i + 1; j < controls.length; j += 1) {
      const a = R(controls[i]); const b = R(controls[j]);
      if (Math.min(a.r, b.r) - Math.max(a.x, b.x) > 0.5 && Math.min(a.b, b.b) - Math.max(a.y, b.y) > 0.5) { overlaps.push(i + '/' + j); }
    }
  }
  const textOverflow = [...block.querySelectorAll('.kr-room-name, .kr-arm span, .kr-room-text, .kr-room')].filter(e => e.scrollWidth > e.clientWidth + 1 || getComputedStyle(e).textOverflow === 'ellipsis').map(e => e.textContent.slice(0, 30));
  const nameOutside = [...block.querySelectorAll('.kr-room')].filter(a => a.querySelector('.kr-room-name')).filter(a => { const q = R(a); const n = R(a.querySelector('.kr-room-name')); return n.x < q.x - 0.5 || n.r > q.r + 0.5 || n.y < q.y - 0.5 || n.b > q.b + 0.5; }).map(a => a.textContent.slice(0, 30));
  out.block = {
    mode: block.classList.contains('kr-nav-tiles') ? 'tiles' : 'rows', rect: R(block), pad: R(pad), mapOrArea: block.querySelectorAll('map, area').length, position: getComputedStyle(block).position,
    hub: { w: hubRect.w, h: hubRect.h, interactive: Boolean(hubHit && hubHit.closest('a, button, input, [tabindex]')), focusable: hub.tabIndex >= 0 || hub.hasAttribute('tabindex') },
    arms: [...block.querySelectorAll('a.kr-arm')].map(a => ({ dir: a.getAttribute('data-dir'), text: a.textContent.trim(), svg: Boolean(a.querySelector('svg')), href: a.getAttribute('href'), target: a.getAttribute('target'), disabled: a.getAttribute('aria-disabled') === 'true', focusable: (a.focus(), document.activeElement === a), onclick: a.getAttribute('onclick'), r: R(a), hit: grid(a), cs: { opacity: getComputedStyle(a).opacity, color: getComputedStyle(a).color, bg: getComputedStyle(a).backgroundColor } })),
    rooms: [...block.querySelectorAll('a.kr-room')].map(a => ({ name: a.querySelector('.kr-room-name') ? a.querySelector('.kr-room-name').textContent : null, label: a.getAttribute('aria-label'), tile: a.classList.contains('kr-room-tile'), img: a.querySelector('.kr-room-thumb img') ? R(a.querySelector('.kr-room-thumb img')) : null, imgSrc: a.querySelector('.kr-room-thumb img') ? a.querySelector('.kr-room-thumb img').getAttribute('src') : null, href: a.getAttribute('href'), onclick: a.getAttribute('onclick'), current: a.getAttribute('aria-current'), pill: Boolean(a.querySelector('.kr-room-here')), thumb: a.querySelectorAll('.kr-room-thumb img').length, thumbVisible: [...a.querySelectorAll('.kr-room-thumb img')].every(i => R(i).w > 0), r: R(a), hit: grid(a), focusable: (a.focus(), document.activeElement === a) })),
    overlaps, textOverflow, nameOutside
  };
  return out;
});

const expectedDirs = (st) => st.dirs || ['Nord', 'Ouest', 'Est', 'Sud'];
const costs = [];
const padPositions = {}; // largeur -> [positions de la croix] pour 3, 5 et 8 pièces

for (const [label, st] of Object.entries(STATES).filter(() => frag('etats'))) {
  const { page, context } = await newPage();
  for (const width of WIDTHS) {
    console.log(`${label} — ${width} px`);
    await load(page, width, fixtureHtml(st));
    const m = await measure(page);
    const dirs = expectedDirs(st);
    check('mode mobile, un seul bloc', () => { assert.ok(m.mobile); assert.equal(m.nBlocks, 1); });
    if (m.nBlocks !== 1) { continue; }
    const b = m.block;
    check('CA4 aucun <map>/<area> dans le bloc', () => assert.equal(b.mapOrArea, 0));
    check('R1 bloc non flottant (ni fixed ni sticky)', () => assert.ok(!['fixed', 'sticky'].includes(b.position), b.position));
    check('R2 pavé 154×154 ±4', () => { assert.ok(Math.abs(b.pad.w - 154) <= 4 && Math.abs(b.pad.h - 154) <= 4, `${b.pad.w}×${b.pad.h}`); });
    check('CA5 4 touches ≥ 50×50 avec flèche et nom', () => { assert.equal(b.arms.length, 4); assert.ok(b.arms.every(a => a.r.w >= 49.5 && a.r.h >= 49.5 && a.svg && a.text === a.dir), JSON.stringify(b.arms.map(a => [a.dir, a.r.w, a.r.h, a.svg, a.text]))); });
    check('R2 disposition : Nord en haut, Ouest à gauche, Est à droite, Sud en bas', () => {
      const by = Object.fromEntries(b.arms.map(a => [a.dir, a.r]));
      assert.ok(by.Nord.y < by.Ouest.y && by.Ouest.y < by.Sud.y && by.Ouest.x < by.Nord.x && by.Nord.x < by.Est.x && Math.abs(by.Ouest.y - by.Est.y) < 1 && Math.abs(by.Nord.x - by.Sud.x) < 1);
    });
    check('CA5 centre neutre : non interactif, non focalisable', () => { assert.ok(!b.hub.interactive && !b.hub.focusable); });
    check('CA2 une touche disponible par area native, href identique', () => {
      for (const d of ['Nord', 'Ouest', 'Est', 'Sud']) {
        const arm = b.arms.find(a => a.dir === d); const area = m.native.areas.find(a => a.alt === d);
        if (area) { assert.equal(arm.href, area.href, d); assert.ok(!arm.disabled && arm.focusable, d); } else { assert.ok(arm.disabled && arm.href === null && !arm.focusable, d + ' doit être atténuée'); }
      }
      assert.equal(b.arms.filter(a => !a.disabled).length, dirs.length);
    });
    check('CA4 elementFromPoint 5×5 : ≥ 23/25 et centre atteint (touches disponibles et pièces)', () => {
      const bad = [...b.arms.filter(a => !a.disabled), ...b.rooms].filter(c => c.hit.hits < 23 || !c.hit.centreOk);
      assert.deepEqual(bad.map(c => [c.dir || c.name, c.hit.hits]), []);
    });
    check('CA2 pièces : une par lien natif, ordre natif, href identique', () => {
      assert.equal(b.rooms.length, st.rooms.length);
      b.rooms.forEach((r, i) => { assert.equal(r.href, `/jouer/plateau/FIXTURE-room-${i + 1}`); assert.ok(r.focusable); if (st.named) { assert.equal(r.name, st.rooms[i].name); } else { assert.equal(r.name, null); } });
    });
    check(`R5 mode ${st.named ? 'lignes (nom texte natif)' : 'tuiles (image seule : aucun nom inventé, étiquette = rang)'}`, () => {
      assert.equal(b.mode, st.named ? 'rows' : 'tiles');
      if (!st.named) { b.rooms.forEach((r, i) => assert.equal(r.label, `Pièce ${i + 1} sur ${st.rooms.length}${st.rooms[i].locked ? ', verrouillée' : ''}`)); }
    });
    check('CA5 lignes de pièces ≥ 44 px (mesuré : ' + Math.min(...b.rooms.map(r => Math.round(r.r.h))) + ' px)', () => assert.ok(b.rooms.every(r => r.r.h >= 44)));
    check('R5 image(s) native(s) conservée(s), visible(s)' + (st.named ? '' : ', affichée(s) en entier à 60×60 (non réduite)'), () => { assert.ok(b.rooms.every((r, i) => r.thumb === (st.named && st.rooms[i].locked ? 2 : 1) && r.thumbVisible)); if (!st.named) { assert.ok(b.rooms.every((r, i) => r.img.w === 60 && r.img.h === 60 && r.imgSrc.includes(st.rooms[i].locked ? 'lock' : '.gif')), JSON.stringify(b.rooms.map(r => r.img))); } });
    check('CA7 aria-current sur la seule pièce courante native, avec repère visible', () => {
      const cur = b.rooms.filter(r => r.current === 'true');
      assert.deepEqual(b.rooms.map((r, i) => r.current === 'true' ? i : -1).filter(i => i >= 0), st.rooms.map((r, i) => r.current ? i : -1).filter(i => i >= 0));
      assert.ok(cur.every(r => r.pill)); assert.ok(b.rooms.filter(r => r.current !== 'true').every(r => !r.pill && r.current === null));
    });
    check('CA6 0 nom tronqué (scrollWidth ≤ clientWidth, pas d\'ellipse), nom dans sa ligne', () => { assert.deepEqual(b.textOverflow, []); assert.deepEqual(b.nameOutside, []); });
    check('CA6 0 débordement horizontal du document', () => assert.ok(m.docOverflow <= 0, `${m.docOverflow}`));
    check('CA6 0 chevauchement entre contrôles', () => assert.deepEqual(b.overlaps, []));
    check('R1 pièces à droite de la croix (' + (st.named ? '3 premières' : 'toutes') + '), croix à gauche', () => {
      assert.ok(b.rooms.slice(0, st.named ? 3 : 99).every(r => r.r.x >= b.pad.r - 0.5)); assert.ok(b.pad.x < 20);
    });
    check('R6 toutes les pièces visibles dans l\'écran' + (st.named ? ', celles en excès sous la croix' : ''), () => {
      assert.ok(b.rooms.every(r => r.r.x >= 0 && r.r.r <= width + 0.5));
      if (st.named) { assert.ok(b.rooms.slice(3).every(r => r.r.y >= b.pad.b - 1)); }
    });
    check('natif masqué (display none) tant que le bloc existe', () => assert.equal(m.native.display, 'none'));
    if (SHOTS && [320, 375].includes(width)) { await page.screenshot({ path: path.join(SHOTS, `fixture-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${width}.png`) }); }
    costs.push({ etat: label, width, blocH: Math.round(b.rect.h), pieces: st.rooms.length, padX: b.pad.x, padY: b.pad.y - b.rect.y });
    (padPositions[width] ||= []).push({ label, x: b.pad.x, y: b.pad.y });
  }
  await context.close();
}

console.log('CA6 croix à la même position (±1 px) avec 3, 5 et 8 pièces');
for (const w of WIDTHS.filter(() => frag('etats'))) {
  check(`${w} px : ${padPositions[w] ? padPositions[w].length : 0} états, même position`, () => {
    const p = padPositions[w]; assert.ok(p && p.length === Object.keys(STATES).length);
    assert.ok(p.every(q => Math.abs(q.x - p[0].x) <= 1 && Math.abs(q.y - p[0].y) <= 1), JSON.stringify(p));
  });
}

// ---------- CA10 : cas impossibles ----------
if (frag('impossibles')) {
  const { page, context } = await newPage();
  for (const [label, st] of Object.entries(IMPOSSIBLE)) {
    console.log(`CA10 ${label}`);
    await load(page, 375, fixtureHtml(st), false);
    const late = await absenceWindow(page);
    check(`aucune mutation pendant ${ABSENCE_MS} ms après le marqueur (fenêtre d'absence)`, () => assert.deepEqual(late, []));
    const m = await measure(page);
    check('aucun bloc, natif visible et intact', () => { assert.ok(m.mobile); assert.equal(m.nBlocks, 0); assert.notEqual(m.native.display, 'none'); assert.equal(m.native.inline, ''); });
    check('image map native intacte', () => { if (!st.noMap) { assert.equal(m.native.imgUsemap, '#exitmap'); assert.ok(m.native.mapInDoc); } assert.equal(m.native.areas.length, st.noMap ? 0 : (st.areaOverride ? (st.areaOverride.match(/<area/g) || []).length : 4)); });
  }
  await context.close();
}

// ---------- CA3 / CA8 : clics sur fixtures, idempotence ----------
if (frag('clics')) {
  const st = STATES['FIXTURE 4 directions, 5 pièces'];
  const { page, context } = await newPage();
  await load(page, 375, fixtureHtml(st));
  console.log('CA3 clics simulés (navigations interceptées, jamais exécutées)');
  const click = async (sel) => { requests.length = 0; await page.evaluate(() => { window.__clicks.length = 0; window.__navs.length = 0; }); await page.click(sel, { noWaitAfter: true, timeout: 3000 }).catch(() => {}); await page.waitForTimeout(300); assert.deepEqual(requests, [], 'aucune requête réseau ne doit partir'); return { reqs: await page.evaluate(() => window.__navs.slice()), clicks: await page.evaluate(() => window.__clicks.slice()) }; };
  for (const d of ['Nord', 'Ouest', 'Est', 'Sud']) {
    const r = await click(`.kr-arm[data-dir="${d}"]`);
    check(`clic ${d} : une navigation vers le href natif`, () => { assert.deepEqual(r.reqs, [`http://www.kraland.org/jouer/plateau/FIXTURE-dir-${d.toLowerCase()}`]); assert.deepEqual(r.clicks, d === 'Nord' ? ['nord'] : []); });
  }
  for (let i = 1; i <= st.rooms.length; i += 1) {
    const r = await click(`.kr-room[href$="FIXTURE-room-${i}"]`);
    check(`clic pièce ${i} : une navigation vers le href natif, onclick natif appelé ${st.rooms[i - 1].onclick ? '1 fois' : '0 fois'}`, () => { assert.deepEqual(r.reqs, [`http://www.kraland.org/jouer/plateau/FIXTURE-room-${i}`]); assert.deepEqual(r.clicks, st.rooms[i - 1].onclick ? [`room${i}`] : []); });
  }
  // touche atténuée : aucune navigation
  const { page: p2, context: c2 } = await newPage();
  await load(p2, 375, fixtureHtml(STATES['FIXTURE Sud seul, 3 pièces']));
  requests.length = 0;
  await p2.evaluate(() => { window.__navs.length = 0; });
  for (const d of ['Nord', 'Ouest', 'Est']) { await p2.click(`.kr-arm[data-dir="${d}"]`, { noWaitAfter: true, timeout: 3000 }).catch(() => {}); }
  await p2.waitForTimeout(300);
  const navs2 = await p2.evaluate(() => window.__navs.slice());
  check('CA2 clic sur les 3 touches atténuées : 0 navigation, 0 requête', () => { assert.deepEqual(navs2, []); assert.deepEqual(requests, []); });
  const focusable = await p2.evaluate(() => [...document.querySelectorAll('.kr-arm')].filter(a => (a.focus(), document.activeElement === a)).map(a => a.getAttribute('data-dir')));
  check('CA2 seule la touche disponible (Sud) est focalisable', () => assert.deepEqual(focusable, ['Sud']));
  await c2.close();

  console.log('CA8 idempotence : 3 réinjections et mutation de la zone native');
  for (let i = 0; i < 3; i += 1) { await reinject(page); }
  let m = await measure(page);
  check('3 réinjections : 1 seul bloc, 4 touches, 5 pièces', () => { assert.equal(m.nBlocks, 1); assert.equal(m.block.arms.length, 4); assert.equal(m.block.rooms.length, 5); });
  let r = await click('.kr-room[href$="FIXTURE-room-2"]');
  check('après réinjections : 1 clic = 1 navigation et 1 onclick', () => { assert.equal(r.reqs.length, 1); assert.deepEqual(r.clicks, ['room2']); });
  await page.evaluate(() => { const z = document.getElementById('zone-native'); const c = z.cloneNode(true); c.style.removeProperty('display'); z.replaceWith(c); }); // re-rendu du natif, mêmes liens
  await synced(page, () => getComputedStyle(document.getElementById('zone-native')).display === 'none'); // natif re-masqué
  m = await measure(page);
  check('mutation (re-rendu identique) : 1 bloc, natif re-masqué', () => { assert.equal(m.nBlocks, 1); assert.equal(m.native.display, 'none'); });
  await page.evaluate(() => { document.querySelector('#zone-native area[alt="Sud"]').setAttribute('href', '/jouer/plateau/FIXTURE-dir-sud-modifie'); });
  await synced(page, () => { const a = document.querySelector('.kr-nav-v2 .kr-arm[data-dir="Sud"]'); return !!a && a.getAttribute('href') === '/jouer/plateau/FIXTURE-dir-sud-modifie'; });
  m = await measure(page);
  check('mutation (href natif modifié) : 1 bloc reconstruit avec le nouveau href', () => { assert.equal(m.nBlocks, 1); assert.equal(m.block.arms.find(a => a.dir === 'Sud').href, '/jouer/plateau/FIXTURE-dir-sud-modifie'); });
  r = await click('.kr-arm[data-dir="Sud"]');
  check('après mutation : 1 clic = 1 navigation', () => assert.deepEqual(r.reqs, ['http://www.kraland.org/jouer/plateau/FIXTURE-dir-sud-modifie']));

  console.log('CA9 bascule dynamique sans rechargement (saisie en cours : le script ne recharge pas)');
  await page.fill('#champ-saisie', 'texte en cours');
  await page.evaluate(() => { window.__marker = 1; });
  const seq = [[768, 0], [375, 1], [1280, 0], [700, 1]];
  for (const [w, expectBlocks] of seq) {
    await page.setViewportSize({ width: w, height: 800 });
    // Au lieu de 900 ms : le bloc suit la largeur (anti-rebond 120 ms) ET la vérification de franchissement du seuil (anti-rebond
    // 400 ms) a tranché : saisie en cours, donc bandeau « rechargement différé » au-dessus de 768 px (chargé à 375), aucun en dessous.
    await synced(page, ({ n, wide }) => document.querySelectorAll('.kr-nav-v2').length === n && !!document.getElementById('kr-resize-banner') === wide, { n: expectBlocks, wide: w >= 768 });
    const s = await measure(page);
    check(`${w} px : blocs = ${expectBlocks}`, () => assert.equal(s.nBlocks, expectBlocks));
    if (!expectBlocks) {
      check(`${w} px : image map native visible, areas intactes (href d'origine)`, () => { assert.notEqual(s.native.display, 'none'); assert.equal(s.native.inline, ''); assert.equal(s.native.imgUsemap, '#exitmap'); assert.equal(s.native.areas.length, 4); });
    } else {
      check(`${w} px : natif masqué, bloc complet`, () => { assert.equal(s.native.display, 'none'); assert.equal(s.block.arms.length, 4); });
    }
  }
  const stillThere = await page.evaluate(() => ({ marker: window.__marker, text: document.getElementById('champ-saisie').value }));
  check('aucun rechargement, saisie conservée', () => { assert.equal(stillThere.marker, 1); assert.equal(stillThere.text, 'texte en cours'); });
  await context.close();
}

// ---------- CA9 : transitions avec rechargement (comportement normal du skin) ----------
if (frag('transitions')) {
  const { page, context } = await newPage();
  console.log('CA9 transitions 375 → 768 → 375 → 1280 → 700 (le skin recharge au franchissement du seuil)');
  for (const [w, expectBlocks] of [[375, 1], [768, 0], [375, 1], [1280, 0], [700, 1]]) {
    await load(page, w, fixtureHtml(STATES['FIXTURE 4 directions, 5 pièces']), expectBlocks === 1); // load attend déjà data-kr-ready (au lieu de 800 ms de plus)
    const s = await measure(page);
    check(`${w} px : ${expectBlocks} bloc${expectBlocks ? ', natif masqué' : ', natif visible, image map et 4 areas intactes'}`, () => {
      assert.equal(s.nBlocks, expectBlocks);
      if (expectBlocks) { assert.equal(s.native.display, 'none'); } else { assert.notEqual(s.native.display, 'none'); assert.equal(s.native.imgUsemap, '#exitmap'); assert.equal(s.native.areas.length, 4); }
    });
  }
  await context.close();
}

// ---------- Autres thèmes + mode natif ----------
for (const variant of ['empire-brun-dark', 'empire-brun', 'kraland-dark', 'paladium'].filter(() => frag('themes'))) {
  const { page, context } = await newPage(variant);
  console.log(`Thème ${variant} — 375 px`);
  await load(page, 375, fixtureHtml(STATES['FIXTURE 4 directions, 5 pièces']));
  const m = await measure(page);
  check('bloc présent, touches ≥ 50 px, pièces ≥ 44 px, 0 chevauchement, 0 débordement', () => { assert.equal(m.nBlocks, 1); assert.ok(m.block.arms.every(a => a.r.w >= 49.5)); assert.ok(m.block.rooms.every(r => r.r.h >= 44)); assert.deepEqual(m.block.overlaps, []); assert.ok(m.docOverflow <= 0); });
  if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, `fixture-theme-${variant}-375.png`) }); }
  await context.close();
}
// ---------- Décision d'Arnaud : ordre des pièces = ordre natif du DOM (pas de tri, cadenas au milieu) ----------
if (frag('ordre')) {
  const { page, context } = await newPage();
  console.log('Ordre natif des pièces (réel : bat0, bat1, bat3lock, bat2, bat2lock) — FIXTURE');
  const rooms = [img({ bat: 0 }), img({ bat: 1, current: true }), img({ bat: 3, locked: true }), img({ bat: 2 }), img({ bat: 2, locked: true })];
  await load(page, 375, fixtureHtml({ rooms }));
  const m = await measure(page);
  check('pièces dans l\'ordre du DOM natif, cadenas et pièce courante aux bons rangs', () => {
    assert.equal(m.nBlocks, 1);
    assert.deepEqual(m.block.rooms.map(r => r.imgSrc.replace(/^.*\/bat\//, '')), ['bat0.gif', 'bat1.gif', 'bat3lock.gif', 'bat2.gif', 'bat2lock.gif']);
    assert.deepEqual(m.block.rooms.map(r => r.href.replace(/^.*FIXTURE-room-/, '')), ['1', '2', '3', '4', '5']);
    assert.deepEqual(m.block.rooms.map(r => r.current === 'true'), [false, true, false, false, false]);
    assert.deepEqual(m.block.rooms.map(r => /verrouill/.test(r.label || '')), [false, false, true, false, true]);
  });
  await context.close();
}

// ---------- s1 : repli géométrique (area sans alt, rect net au nord) ----------
if (frag('ordre')) {
  const { page, context } = await newPage();
  console.log('s1 repli géométrique : area sans alt, rectangle net au nord (24,0,48,16)');
  await load(page, 375, fixtureHtml({ areaOverride: '<area shape="rect" coords="24,0,48,16" href="/jouer/plateau/FIXTURE-dir-geo-nord">', rooms: [room('Extérieur'), room('Commerce', { current: true })] }));
  const m = await measure(page);
  check('bloc présent, seule la touche Nord est disponible avec le href natif', () => {
    assert.equal(m.nBlocks, 1);
    assert.deepEqual(m.block.arms.filter(a => !a.disabled).map(a => [a.dir, a.href]), [['Nord', '/jouer/plateau/FIXTURE-dir-geo-nord']]);
  });
  await context.close();
}

// ---------- M1 : contraste du texte des touches, 16 thèmes × normal/survol/actif ----------
const VARIANTS = ['kraland', 'empire-brun', 'paladium', 'theocratie-seelienne', 'paradigme-vert', 'khanat-elmerien', 'confederation-libre', 'royaume-ruthvenie',
  'kraland-dark', 'empire-brun-dark', 'paladium-dark', 'theocratie-seelienne-dark', 'paradigme-vert-dark', 'khanat-elmerien-dark', 'confederation-libre-dark', 'royaume-ruthvenie-dark'];
// « rgb(…) », « rgba(…) » ou « color(srgb r g b / a) » : sérialisation de color-mix() (composantes 0..1), celle de --kr-primary-dark et des
// replis qui l'emploient depuis l'épopée 3 (ticket 1).
const parseRgb = (s) => { const v = s.match(/[\d.]+/g).map(Number); const k = s.startsWith('color(srgb') ? 255 : 1; return { r: v[0] * k, g: v[1] * k, b: v[2] * k, a: v.length > 3 ? v[3] : 1 }; };
const luminance = ({ r, g, b }) => { const [R, G, B] = [r, g, b].map(v => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * R + 0.7152 * G + 0.0722 * B; };
const contrast = (fg, bg) => { const a = luminance(parseRgb(fg)); const b = luminance(parseRgb(bg)); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
const armColors = (page, dir) => page.evaluate((d) => { const a = document.querySelector(`.kr-arm[data-dir="${d}"]`); const cs = getComputedStyle(a); const r = a.getBoundingClientRect(); return { color: cs.color, bg: cs.backgroundColor, x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, dir);
console.log('M1 contraste texte/fond des touches (AA 4,5:1 pour 12 px gras) — 16 thèmes');
for (const variant of VARIANTS.filter(() => frag('m1'))) {
  const { page, context } = await newPage(variant);
  await load(page, 375, fixtureHtml(STATES['FIXTURE Sud seul, 3 pièces']));
  const light = !variant.endsWith('-dark');
  const normal = await armColors(page, 'Sud');
  await page.mouse.move(normal.x, normal.y);
  await styleSettled(page, '.kr-arm[data-dir="Sud"]', { state: ':hover' });
  const hover = await armColors(page, 'Sud');
  await page.mouse.down();
  await styleSettled(page, '.kr-arm[data-dir="Sud"]', { state: ':active' });
  const active = await armColors(page, 'Sud');
  await page.mouse.move(2, 2); // relâché hors de la touche : aucun clic
  await page.mouse.up();
  const off = await armColors(page, 'Nord');
  check(`${variant} : touche disponible normale ${contrast(normal.color, normal.bg).toFixed(2)}, survol ${contrast(hover.color, hover.bg).toFixed(2)}, actif ${contrast(active.color, active.bg).toFixed(2)} (>= 4,5)`, () => {
    assert.ok(contrast(normal.color, normal.bg) >= 4.5, `normal ${normal.color} sur ${normal.bg}`);
    assert.ok(contrast(hover.color, hover.bg) >= 4.5, `survol ${hover.color} sur ${hover.bg}`);
    assert.ok(contrast(active.color, active.bg) >= 4.5, `actif ${active.color} sur ${active.bg}`);
  });
  check(`${variant} : touche atténuée ${contrast(off.color, off.bg).toFixed(2)} (>= ${light ? '4,4 en clair' : '3'}) et distincte d'une touche disponible`, () => {
    assert.ok(contrast(off.color, off.bg) >= (light ? 4.4 : 3), `${off.color} sur ${off.bg}`);
    assert.notEqual(off.bg, normal.bg);
    assert.notEqual(off.color, normal.color);
  });
  await context.close();
}

if (frag('natif')) {
  const { page, context } = await newPage('empire-brun-dark', false);
  console.log('Mode natif (skin désactivé) — 375 px');
  await load(page, 375, fixtureHtml(STATES['FIXTURE 4 directions, 5 pièces']), false);
  const late = await absenceWindow(page);
  check(`aucune mutation pendant ${ABSENCE_MS} ms après le marqueur (fenêtre d'absence)`, () => assert.deepEqual(late, []));
  const m = await measure(page);
  check('aucun bloc, natif intact', () => { assert.equal(m.nBlocks, 0); assert.notEqual(m.native.display, 'none'); assert.equal(m.native.areas.length, 4); });
  await context.close();
}

console.log('\nCA16 coût en hauteur du bloc (px) — FIXTURES');
for (const w of [375].filter(() => frag('etats'))) {
  costs.filter(c => c.width === w).forEach(c => console.log(`  ${w} px  ${c.etat.padEnd(38)} ${String(c.pieces).padStart(2)} pièces : ${c.blocH} px`));
}
if (process.env.KR_COSTS) { fs.writeFileSync(process.env.KR_COSTS, JSON.stringify(costs, null, 1)); }

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
