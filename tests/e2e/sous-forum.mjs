// Test du sous-forum « Débuter » (refonte variante A, lots L0 à L6) : doublon des permanents, statuts non lu / verrouillé, en-tête,
// liste des sujets, permanents, pagination, bureau. Fixture locale du DOM réel (tests/e2e/fixtures/sous-forum-debuter.html) :
// 5 permanents, #topics de 145 lignes, DataTables émulé (tri, recherche, « Afficher », pagination, événement draw.dt).
// Aucun réseau Kraland : toute requête hors fixture est interceptée et comptée ; aucun clic de validation, aucun message envoyé.
// Émulation Chromium, pas un vrai téléphone ni Safari/Firefox.
//
// Usage : npm run build && node tests/e2e/sous-forum.mjs
// Options : KR_SCRIPT=/chemin/script.user.js (défaut : bundle principal) ; KR_SHOTS=/dossier (captures) ;
//           KR_FRAG=l0,l1,... (fragments exécutés ; vide = tout).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { chromium } from 'playwright';
import { domQuiet, THEME_READY } from './lib/settle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const SHOTS = process.env.KR_SHOTS || '';
const BASE = 'http://www.kraland.org';
const FIXTURE = fs.readFileSync(path.join(here, 'fixtures/sous-forum-debuter.html'), 'utf8');
const VENDOR = path.join(here, 'vendor');
const SUBFORUM = '/forum/hrp/debuter-20102';
const WIDTHS = [375, 700, 1280, 1440];

const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const frag = id => FRAG.length === 0 || FRAG.some(f => f === id || id.startsWith(f + '-') || f.startsWith(id + '-'));

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

// Index des forums (structure d'une page « cartes ») : 3 forums dans un tableau natif, pour vérifier que les cartes restent en place.
function forumIndex() {
  const row = (n, t) => `<tr><td><p class="nomargin"><a href="forum/rp/${t}-${n}">Forum ${t}</a></p><p class="nomargin">Description du forum ${t}</p></td><td class="center">${n * 10} sujets</td><td class="center">${n * 100} messages</td><td><a href="communaute/membres/aestus-1-1" class="nomargin">Aestus</a> <p class="nomargin mini"><a href="forum/sujet/dernier-${n}-1#msg${n}" class="btn btn-default">→</a> Hier (13:20)</p></td></tr>`;
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><base href="${BASE}/"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><title>FIXTURE index des forums</title><link rel="stylesheet" href="lib/bootstrap-3.3.7/css/bootstrap1.min.css"></head><body>
<nav class="navbar navbar-inverse nomargin"><div class="container"><a class="navbar-brand" href="/">Kraland</a></div></nav>
<div id="content" class="container"><div class="row"><div id="col-right" class="col-md-12"><h1 class="page-header">Forums</h1>
<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Jeu (RP)</h3></div><div class="panel-body"><table class="table"><tbody>${row(1, 'taverne')}${row(2, 'marche')}${row(3, 'chronique')}</tbody></table></div></div>
</div></div></div><footer class="navbar-inverse"><div class="container white">pied</div></footer></body></html>`;
}

const browser = await chromium.launch({ headless: true });

// Ouvre une page de la fixture. `url` : chemin ; `variant` : thème ; `html` : corps de page (défaut : le sous-forum).
async function open({ width, variant = 'empire-brun-dark', height = 800, url = SUBFORUM, html = FIXTURE, theme = true, late = false }) {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 2 });
  const state = { documents: 0, other: [] };
  await context.route(BASE + '/**', r => {
    const u = new URL(r.request().url());
    if (r.request().resourceType() === 'document' && u.pathname === url) {
      state.documents += 1;
      return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
    }
    if (u.pathname.startsWith('/lib/')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return r.fulfill({ status: 200, contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(path.join(VENDOR, file)) });
    }
    state.other.push(u.pathname);
    return r.abort();
  });
  await context.addInitScript(({ src, enabled, variant: themeVariant }) => {
    window.GM = { xmlHttpRequest: () => {} };
    window.__clicks = [];
    if (enabled) {
      localStorage.setItem('kr-theme-enabled', 'true');
      localStorage.setItem('kr-theme-variant', themeVariant);
      // eslint-disable-next-line no-eval
      document.addEventListener('DOMContentLoaded', () => (0, eval)(src));
    }
  }, { src: userscript, enabled: theme, variant });
  const page = await context.newPage();
  await page.goto(BASE + url + (late ? '?dt=late' : ''), { waitUntil: 'load' });
  await domQuiet(page, { ready: theme ? THEME_READY : null, label: 'sous-forum' });
  return { context, page, state };
}

// Mesures communes (évaluées dans la page).
const MEASURE = () => {
  const box = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const perm = document.querySelector('#fx-permanents table');
  const topics = document.getElementById('topics');
  const permRows = perm ? [...perm.querySelectorAll('tbody tr')] : [];
  const topicRows = topics ? [...topics.querySelectorAll('tbody tr')] : [];
  return {
    mobileMode: document.body.classList.contains('mobile-mode'),
    pageForum: document.body.classList.contains('page-forum'),
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    cardsContainers: document.querySelectorAll('.forums-cards-container').length,
    cardsVisible: [...document.querySelectorAll('.forums-cards-container')].filter(vis).length,
    cards: document.querySelectorAll('.forum-card').length,
    permTableVisible: perm ? vis(perm) : false,
    permRowsVisible: permRows.filter(vis).length,
    permRowsTotal: permRows.length,
    visibleTablesWithTopics: [...document.querySelectorAll('table')].filter(t => t.querySelector('a[href*="forum/sujet/"]')).filter(vis).length,
    topicRows: topicRows.length,
    topicRowsVisible: topicRows.filter(vis).length,
    iw: window.innerWidth,
    ih: window.innerHeight,
    box: { perm: perm ? box(perm) : null, topics: topics ? box(topics) : null }
  };
};

// ---------- L0 : doublon des permanents (ForumCards ne touche plus un tableau de sujets) ----------
if (frag('l0')) {
  console.log('L0 : le tableau des permanents n\'est plus doublé par des cartes (mobile), l\'index garde ses cartes');
  for (const width of WIDTHS) {
    const { context, page: p, state } = await open({ width });
    const m = await p.evaluate(MEASURE);
    if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `sous-forum-${width}.png`), fullPage: true }); }
    check(`${width} : page du sous-forum en mode ${width < 768 ? 'mobile' : 'bureau'} avec le thème posé`, () => { assert.equal(m.mobileMode, width < 768); assert.ok(m.pageForum); });
    check(`${width} : 0 .forums-cards-container sur une page qui contient #topics`, () => assert.equal(m.cardsContainers, 0));
    check(`${width} : 0 carte forum sur le sous-forum`, () => assert.equal(m.cards, 0));
    check(`${width} : le tableau des permanents est visible une seule fois (5 lignes)`, () => { assert.ok(m.permTableVisible); assert.equal(m.permRowsVisible, 5); assert.equal(m.permRowsTotal, 5); });
    check(`${width} : le tableau des permanents n'est pas masqué par le module des cartes (data-mobile-hidden)`, () => assert.equal(m.visibleTablesWithTopics, 2));
    check(`${width} : #topics garde ses 10 lignes de la page 1`, () => assert.equal(m.topicRows, 10));
    check(`${width} : aucune requête hors fixture`, () => assert.deepEqual(state.other, []));
    await context.close();
  }
  for (const url of ['/forum/rp', '/forum/hrp']) {
    const { context, page: p } = await open({ width: 375, url, html: forumIndex() });
    const m = await p.evaluate(MEASURE);
    check(`${url} à 375 : l'index des forums reste en cartes (1 conteneur, 3 cartes visibles)`, () => { assert.equal(m.cardsContainers, 1); assert.equal(m.cards, 3); assert.equal(m.cardsVisible, 1); });
    await context.close();
  }
}

// Les 16 thèmes (8 clairs + 8 sombres), tels que posés dans kr-theme-variant.
const THEMES = ['kraland', 'empire-brun', 'paladium', 'theocratie-seelienne', 'paradigme-vert', 'khanat-elmerien', 'confederation-libre', 'royaume-ruthvenie']
  .flatMap(v => [v, v + '-dark']);

// Outils de couleur (évalués dans la page) : fond effectif (calques translucides composés), ratio WCAG, lisibilité d'un élément.
const COLOR_TOOLS = () => {
  const parse = c => { const m = String(c).match(/rgba?\(([^)]+)\)/); if (!m) { return [0, 0, 0, 0]; } const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const over = (top, under) => { const a = top[3]; return [top[0] * a + under[0] * (1 - a), top[1] * a + under[1] * (1 - a), top[2] * a + under[2] * (1 - a), 1]; };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const l1 = lum(a); const l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const bgOf = el => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] === 1) { break; } } }
    let acc = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) { acc = over(layers[i], acc); }
    return acc;
  };
  const fgOn = (el, bg) => over(parse(getComputedStyle(el).color), bg);
  return { parse, over, ratio, bgOf, fgOn, round: n => Math.round(n * 100) / 100 };
};

// Statuts des lignes (permanents + #topics) : classes JS, pastille, barre, verrou.
const STATUS = () => {
  const tools = (0, window.__krColorTools)();
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const rows = [...document.querySelectorAll('#fx-permanents tbody tr, #topics tbody tr')].filter(tr => tr.querySelector('td:first-child a[href*="forum/sujet/"]'));
  const barOf = tr => {
    const cs = getComputedStyle(tr); const td = tr.cells[0]; const sh = getComputedStyle(td).boxShadow;
    const trW = cs.borderLeftStyle !== 'none' && tools.parse(cs.borderLeftColor)[3] > 0 ? parseFloat(cs.borderLeftWidth) : 0;
    const trColor = tools.parse(cs.borderLeftColor);
    const m = sh && sh !== 'none' ? sh.match(/(rgba?\([^)]+\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px(\s+inset)?/) : null;
    const shW = m && m[6] ? parseFloat(m[2]) : 0;
    return { w: Math.max(trW, shW), color: shW >= trW && m ? tools.parse(m[1]) : trColor };
  };
  return rows.map(tr => {
    const ul2 = tr.querySelectorAll('td:first-child ul.pagination')[1];
    const title = tr.querySelector('td:first-child p a');
    const lock = tr.querySelector('td:first-child p i.fa-lock');
    const badge = tr.querySelector('.kr-topic-badge');
    const bg = tools.bgOf(tr);
    const bar = barOf(tr);
    return {
      perm: !!tr.closest('#fx-permanents'),
      title: title.textContent.trim(),
      unreadIcon: !!tr.querySelector('td:first-child i.fa.fa-folder'),
      unread: tr.classList.contains('kr-topic-unread'),
      lockIcon: !!lock,
      locked: tr.classList.contains('kr-topic-locked'),
      pagesIcons: ul2 ? ul2.querySelectorAll('li').length : 0,
      pagesCls: tr.classList.contains('kr-topic-pages'),
      pagesAttr: tr.getAttribute('data-kr-pages'),
      badges: tr.querySelectorAll('.kr-topic-badge').length,
      badgeDomText: badge ? badge.textContent.trim() : null,
      badgeText: badge ? (badge.textContent.trim() || getComputedStyle(badge, '::before').content.replace(/^"|"$/g, '')) : null,
      badgeVisible: badge ? vis(badge) : false,
      badgeRatio: badge ? tools.round(tools.ratio(tools.fgOn(badge, tools.parse(getComputedStyle(badge).backgroundColor)), tools.parse(getComputedStyle(badge).backgroundColor))) : null,
      barW: bar.w,
      barRatio: bar.w > 0 ? tools.round(tools.ratio(bar.color, bg)) : null,
      weight: parseInt(getComputedStyle(title).fontWeight, 10),
      lockVisible: lock ? vis(lock) : false,
      lockRatio: lock && vis(lock) ? tools.round(tools.ratio(tools.fgOn(lock, bg), bg)) : null,
      dateRatio: (() => { const p = tr.querySelector('td:last-child p.mini'); return p && vis(p) ? tools.round(tools.ratio(tools.fgOn(p, bg), bg)) : null; })()
    };
  });
};

// Texte visible d'un élément, contenus générés (::before / ::after, attr()) compris, dans l'ordre du DOM ; ignore display:none et visibility:hidden.
const VISIBLE_TEXT = () => {
  const walk = n => {
    if (n.nodeType === 3) { return n.textContent; }
    if (n.nodeType !== 1) { return ''; }
    const cs = getComputedStyle(n);
    if (cs.display === 'none' || cs.visibility === 'hidden') { return ''; }
    const gen = w => { const c = getComputedStyle(n, w).content; return c && c !== 'none' && c !== 'normal' ? c.replace(/^"|"$/g, '') : ''; };
    return gen('::before') + [...n.childNodes].map(walk).join('') + gen('::after');
  };
  return el => walk(el).replace(/\s+/g, ' ').trim();
};

// Cibles tactiles réellement touchables : on balaie une grille `elementFromPoint` sur la zone (en faisant défiler la page), on regroupe les points
// par élément interactif le plus proche et on mesure la boîte qu'ils couvrent (tolérance = pas de la grille). Une cible couverte par un autre élément
// ou rendue inerte (pointer-events: none) n'est pas comptée ; un lien étiré (::after absolu) compte pour toute sa surface.
const SMALL_TARGETS = () => async (rootSel, skipSel) => {
  const zone = document.querySelector(rootSel);
  const step = 2;
  const boxes = new Map();
  const rr = zone.getBoundingClientRect();
  const top = rr.top + window.scrollY; const bottom = rr.bottom + window.scrollY;
  const band = window.innerHeight - 160;
  for (let y0 = Math.max(0, top - 80); y0 < bottom; y0 += band) {
    window.scrollTo(0, y0);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    for (let y = 80; y < window.innerHeight - 80; y += step) {
      const docY = y + window.scrollY;
      if (docY < top || docY > bottom) { continue; }
      for (let x = 1; x < window.innerWidth; x += step) {
        const el = document.elementFromPoint(x, y);
        const t = el && el.closest('a, button, input, select, textarea, th, summary, [role="button"], .clickable');
        if (!t || !zone.contains(t) || (skipSel && t.closest(skipSel))) { continue; }
        const b = boxes.get(t) || { x0: x, x1: x, y0: docY, y1: docY };
        b.x0 = Math.min(b.x0, x); b.x1 = Math.max(b.x1, x); b.y0 = Math.min(b.y0, docY); b.y1 = Math.max(b.y1, docY);
        boxes.set(t, b);
      }
    }
  }
  window.scrollTo(0, 0);
  return [...boxes.entries()].map(([t, b]) => ({ tag: t.tagName.toLowerCase(), text: (t.textContent || t.getAttribute('aria-label') || t.getAttribute('name') || '').replace(/\s+/g, ' ').trim().slice(0, 30), w: b.x1 - b.x0 + step, h: b.y1 - b.y0 + step }));
};

// Installe les outils dans la page (fonctions nommées, pour les appels répétés).
const withTools = page => page.evaluate(`(window.__krColorTools = ${COLOR_TOOLS.toString()}, window.__krVisibleText = (${VISIBLE_TEXT.toString()})(), window.__krSmallTargets = (${SMALL_TARGETS.toString()})(), true)`);

// Redessins DataTables : page 2, tri « Vus », recherche « PA », « Afficher 25 » (le même déclencheur que DataTables : clic, saisie, changement).
const REDRAWS = [
  ['page 2', p => p.evaluate(() => document.querySelector('#topics_paginate a.paginate_button[data-dt-idx="1"]').click())],
  ['tri « Vus »', p => p.evaluate(() => document.querySelector('#topics thead th:nth-child(3)').click())],
  ['recherche « PA »', p => p.fill('.dataTables_filter input', 'PA')],
  ['« Afficher 25 »', p => p.selectOption('.dataTables_length select', '25')]
];
const settleRedraw = p => domQuiet(p, { quietMs: 300, label: 'redessin DataTables' });

// ---------- L1 : statuts (non lu, verrouillé, pages) en classes JS, pastille, barre, jeton de couleur ----------
const checkStatus = (label, rows, { badgeExpected = true } = {}) => {
  check(`${label} : des lignes sont présentes`, () => assert.ok(rows.length >= 5));
  check(`${label} : kr-topic-unread si et seulement si l'icône dossier (i.fa.fa-folder)`, () => assert.ok(rows.every(r => r.unread === r.unreadIcon), JSON.stringify(rows.filter(r => r.unread !== r.unreadIcon).map(r => r.title))));
  check(`${label} : kr-topic-locked si et seulement si le cadenas (i.fa-lock)`, () => assert.ok(rows.every(r => r.locked === r.lockIcon)));
  check(`${label} : kr-topic-pages si et seulement si 2e liste de pages, avec data-kr-pages = nombre de pages`, () => assert.ok(rows.every(r => r.pagesCls === (r.pagesIcons > 0) && (r.pagesIcons === 0 ? r.pagesAttr === null : Number(r.pagesAttr) === r.pagesIcons))));
  if (badgeExpected) {
    check(`${label} : pastille « NON LU » en toutes lettres, une seule, si et seulement si non lu`, () => assert.ok(rows.every(r => r.badges === (r.unreadIcon ? 1 : 0) && (!r.unreadIcon || r.badgeText === 'NON LU')), JSON.stringify(rows.filter(r => r.badges !== (r.unreadIcon ? 1 : 0)).map(r => [r.title, r.badges]))));
    check(`${label} : pastille visible sur chaque ligne non lue`, () => assert.ok(rows.filter(r => r.unreadIcon).every(r => r.badgeVisible)));
    check(`${label} : la pastille n'écrit aucun texte dans la cellule (DataTables lit le texte des cellules pour la recherche et le tri)`, () => assert.ok(rows.filter(r => r.unreadIcon).every(r => r.badgeDomText === ''), JSON.stringify(rows.filter(r => r.badgeDomText).map(r => [r.title, r.badgeDomText]))));
  }
  check(`${label} : barre de statut d'au moins 4 px si et seulement si non lu`, () => assert.ok(rows.every(r => (r.barW >= 4) === r.unreadIcon), JSON.stringify(rows.filter(r => (r.barW >= 4) !== r.unreadIcon).map(r => [r.title, r.barW]))));
  check(`${label} : titre en gras (>= 600) si non lu, plus léger sinon`, () => assert.ok(rows.every(r => r.unreadIcon ? r.weight >= 600 : r.weight < 600), JSON.stringify(rows.filter(r => r.unreadIcon ? r.weight < 600 : r.weight >= 600).map(r => [r.title, r.weight]))));
  check(`${label} : cadenas visible sur chaque sujet verrouillé`, () => assert.ok(rows.filter(r => r.lockIcon).every(r => r.lockVisible), JSON.stringify(rows.filter(r => r.lockIcon && !r.lockVisible).map(r => r.title))));
};

if (frag('l1-statuts')) {
  console.log('L1 : statuts non lu / verrouillé / pages (classes JS, pastille, barre, gras, cadenas)');
  for (const width of WIDTHS) {
    const { context, page: p } = await open({ width });
    await withTools(p);
    const rows = await p.evaluate(STATUS);
    if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `sous-forum-statuts-${width}.png`), fullPage: true }); }
    check(`${width} : permanents = 5 lignes dont 2 non lues et 3 verrouillées`, () => { const perm = rows.filter(r => r.perm); assert.equal(perm.length, 5); assert.equal(perm.filter(r => r.unread).length, 2); assert.equal(perm.filter(r => r.locked).length, 3); });
    check(`${width} : page 1 de #topics = 10 lignes dont 9 non lues`, () => { const t = rows.filter(r => !r.perm); assert.equal(t.length, 10); assert.equal(t.filter(r => r.unread).length, 9); });
    checkStatus(`${width}`, rows);
    await context.close();
  }
  for (const width of [375, 1280]) {
    const { context, page: p } = await open({ width, late: true });
    await withTools(p);
    const rows = await p.evaluate(STATUS);
    checkStatus(`${width} (DataTables initialisé après le userscript)`, rows);
    await context.close();
  }
  for (const late of [false, true]) {
    const { context, page: p } = await open({ width: 375, late });
    await p.fill('.dataTables_filter input', 'NON LU');
    await settleRedraw(p);
    const found = await p.evaluate(() => ({ rows: [...document.querySelectorAll('#topics tbody tr')].filter(tr => tr.querySelector('td:first-child a')).length, info: document.querySelector('.dataTables_info').textContent }));
    check(`recherche « NON LU »${late ? ' (DataTables initialisé après le userscript)' : ''} : aucun sujet, le libellé de la pastille n'est pas dans le texte des cellules`, () => { assert.equal(found.rows, 0, found.info); });
    await context.close();
  }
}

if (frag('l1-redraw')) {
  console.log('L1 : les statuts survivent aux redessins DataTables (page 2, tri « Vus », recherche « PA », « Afficher 25 »), sans double traitement');
  for (const width of [375, 1280]) {
    for (const [name, act] of REDRAWS) {
      const { context, page: p } = await open({ width });
      await withTools(p);
      await act(p);
      await settleRedraw(p);
      const rows = (await p.evaluate(STATUS)).filter(r => !r.perm);
      check(`${width} après ${name} : des lignes de #topics sont affichées`, () => assert.ok(rows.length >= 3));
      checkStatus(`${width} après ${name}`, rows);
      await context.close();
    }
  }
}

if (frag('l1-themes')) {
  console.log('L1 : contrastes >= 4,5:1 sur les 16 thèmes (en-têtes de section, pastille, barre, cadenas, dates)');
  for (const width of [375, 1280]) {
    for (const variant of THEMES) {
      const { context, page: p } = await open({ width, variant });
      await withTools(p);
      const m = await p.evaluate(() => {
        const t = window.__krColorTools();
        const heads = [...document.querySelectorAll('.panel-heading .panel-title')].map(h => t.round(t.ratio(t.fgOn(h, t.bgOf(h)), t.bgOf(h))));
        return { heads };
      });
      const rows = await p.evaluate(STATUS);
      const unread = rows.filter(r => r.unreadIcon);
      const min = a => Math.min(...a.filter(x => x !== null));
      check(`${width} ${variant} : en-têtes « Sujets permanents » et « Sujets » >= 4,5:1 (${m.heads.join(' / ')})`, () => { assert.equal(m.heads.length, 2); assert.ok(min(m.heads) >= 4.5); });
      check(`${width} ${variant} : pastille NON LU >= 4,5:1`, () => { assert.ok(unread.length > 0 && unread.every(r => r.badgeRatio !== null)); assert.ok(min(unread.map(r => r.badgeRatio)) >= 4.5, 'min ' + min(unread.map(r => r.badgeRatio))); });
      check(`${width} ${variant} : barre de statut >= 4,5:1 sur la ligne`, () => { assert.ok(unread.every(r => r.barRatio !== null)); assert.ok(min(unread.map(r => r.barRatio)) >= 4.5, 'min ' + min(unread.map(r => r.barRatio))); });
      check(`${width} ${variant} : cadenas et dates >= 4,5:1`, () => { const v = rows.flatMap(r => [r.lockRatio, r.dateRatio]).filter(x => x !== null); assert.ok(v.length > 0); assert.ok(min(v) >= 4.5, 'min ' + min(v)); });
      await context.close();
    }
  }
}

// ---------- L2 : en-tête mobile (fil d'Ariane, titre 24 px, « + Nouveau sujet » libellé en haut et sous la pagination) ----------
const HEADER = () => {
  const t = window.__krColorTools();
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const rect = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  const ratio = e => t.round(t.ratio(t.fgOn(e, t.bgOf(e)), t.bgOf(e)));
  const h1 = document.querySelector('.container h1');
  const crumb = h1 ? h1.querySelector('.forum-mobile-breadcrumb') : null;
  const title = h1 ? h1.querySelector('.forum-subforum-title') : null;
  const buttons = [...document.querySelectorAll('a[href^="forum/post/nouveau-sujet-"]')].filter(vis);
  const pag = document.querySelector('.dataTables_paginate');
  const crumbLinks = crumb ? [...crumb.querySelectorAll('a')] : [];
  const current = crumb ? [...crumb.querySelectorAll('span')].find(s => s.textContent.trim() === 'Débuter') : null;
  return {
    iw: window.innerWidth,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1Links: h1 ? h1.querySelectorAll('a').length : 0,
    head: document.querySelectorAll('.forum-subforum-head').length,
    titles: document.querySelectorAll('.forum-subforum-title').length,
    titleText: title ? title.textContent.trim() : null,
    titleVisible: title ? vis(title) : false,
    titleFs: title ? parseFloat(getComputedStyle(title).fontSize) : 0,
    titleRect: title ? rect(title) : null,
    titleRatio: title && vis(title) ? ratio(title) : null,
    crumbBack: crumbLinks.map(a => ({ text: a.textContent.replace(/\s+/g, ' ').trim(), href: a.getAttribute('href'), vis: vis(a), ratio: vis(a) ? ratio(a) : null })),
    crumbCurrent: current ? { text: current.textContent.trim(), vis: vis(current), ratio: vis(current) ? ratio(current) : null } : null,
    fabs: document.querySelectorAll('.forum-new-topic-fab').length,
    plusOnly: [...document.querySelectorAll('a')].filter(a => vis(a) && a.textContent.trim() === '+').length,
    buttons: buttons.map(b => ({ text: b.textContent.replace(/\s+/g, ' ').trim(), href: b.getAttribute('href'), cls: b.className, ...rect(b), ratio: ratio(b) })),
    pag: pag ? rect(pag) : null
  };
};

const checkHeader = (label, m) => {
  check(`${label} : fil d'Ariane « Jeu (HRP) › Débuter » (lien natif forum/hrp et titre courant)`, () => { const back = m.crumbBack.find(a => a.href === 'forum/hrp'); assert.ok(back && back.vis && /Jeu \(HRP\)/.test(back.text), JSON.stringify(m.crumbBack)); assert.ok(m.crumbCurrent && m.crumbCurrent.vis); });
  check(`${label} : titre « Débuter » en 24 px, visible dans le premier écran`, () => { assert.equal(m.titles, 1); assert.equal(m.titleText, 'Débuter'); assert.equal(m.titleFs, 24); assert.ok(m.titleVisible && m.titleRect.y < 300); });
  check(`${label} : deux boutons « Nouveau sujet » libellés (en-tête et sous la pagination), href recopié`, () => { assert.equal(m.buttons.length, 2, JSON.stringify(m.buttons.map(b => b.text))); assert.ok(m.buttons.every(b => /Nouveau sujet/.test(b.text) && b.href === 'forum/post/nouveau-sujet-1-20102' && /forum-thread-action-new/.test(b.cls))); });
  check(`${label} : bouton d'en-tête à droite du titre, au moins 44 px de haut, sans prendre toute la largeur`, () => { const b = m.buttons[0]; assert.ok(b.h >= 44, 'h ' + b.h); assert.ok(b.w >= 140 && b.w <= 260, 'w ' + b.w); assert.ok(b.x + b.w >= m.iw - 24, 'bord droit ' + (b.x + b.w)); assert.ok(b.x > m.titleRect.x + m.titleRect.w - 4, 'à droite du titre'); });
  check(`${label} : second bouton sous la pagination, au moins 44 px de haut`, () => { const b = m.buttons[1]; assert.ok(m.pag && b.y >= m.pag.y + m.pag.h - 1, `bouton y=${b.y}, pagination ${JSON.stringify(m.pag)}`); assert.ok(b.h >= 44); });
  check(`${label} : plus de « + » sans libellé (FAB retiré du sous-forum)`, () => { assert.equal(m.fabs, 0); assert.equal(m.plusOnly, 0); });
  check(`${label} : 0 débordement horizontal`, () => assert.equal(m.overflowX, 0));
};

if (frag('l2-entete')) {
  console.log('L2 : en-tête mobile du sous-forum (fil d\'Ariane, titre, « + Nouveau sujet » libellé en haut et en bas)');
  for (const width of [375, 700]) {
    const { context, page: p } = await open({ width });
    await withTools(p);
    const m = await p.evaluate(HEADER);
    if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `sous-forum-entete-${width}.png`) }); }
    checkHeader(`${width}`, m);
    await context.close();
    for (const [name, act] of REDRAWS) {
      const c = await open({ width });
      await withTools(c.page);
      await act(c.page);
      await settleRedraw(c.page);
      const r = await c.page.evaluate(HEADER);
      check(`${width} après ${name} : toujours 1 titre et 2 boutons « Nouveau sujet » (aucun double traitement)`, () => { assert.equal(r.titles, 1); assert.equal(r.head, 1); assert.equal(r.buttons.length, 2); });
      await c.context.close();
    }
  }
  for (const width of [1280, 1440]) {
    const { context, page: p } = await open({ width });
    await withTools(p);
    const m = await p.evaluate(HEADER);
    check(`${width} : en-tête natif conservé au bureau (aucun en-tête mobile, 2 liens natifs dans le h1)`, () => { assert.equal(m.head, 0); assert.equal(m.titles, 0); assert.equal(m.h1Links, 2); assert.equal(m.buttons.length, 1); assert.equal(m.fabs, 0); });
    await context.close();
  }
  {
    const { context, page: p } = await open({ width: 375, late: true });
    await withTools(p);
    checkHeader('375 (DataTables initialisé après le userscript)', await p.evaluate(HEADER));
    await context.close();
  }
}

if (frag('l2-themes')) {
  console.log('L2 : contrastes >= 4,5:1 de l\'en-tête mobile sur les 16 thèmes');
  for (const variant of THEMES) {
    const { context, page: p } = await open({ width: 375, variant });
    await withTools(p);
    const m = await p.evaluate(HEADER);
    check(`375 ${variant} : titre, fil d'Ariane et boutons >= 4,5:1`, () => {
      const v = [m.titleRatio, m.crumbCurrent && m.crumbCurrent.ratio, ...m.crumbBack.map(a => a.ratio), ...m.buttons.map(b => b.ratio)];
      assert.ok(v.length >= 5 && v.every(x => typeof x === 'number'), JSON.stringify(v));
      assert.ok(Math.min(...v) >= 4.5, 'min ' + Math.min(...v));
    });
    await context.close();
  }
}

// ---------- L3 : liste des sujets mobile (ligne sur 3 lignes de texte, → de 44 px, libellés, puces de tri, recherche + « Afficher » sur une ligne) ----------
const TOPIC_ROWS = () => {
  const t = window.__krColorTools(); const vt = window.__krVisibleText;
  const rect = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom + window.scrollY) }; };
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const hitIsNot = el => { const r = el.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !hit || hit.closest('a') !== el; };
  const rows = [...document.querySelectorAll('#topics tbody tr')].filter(tr => tr.querySelector('td:first-child p a'));
  return rows.map(tr => {
    const title = tr.querySelector('td:first-child p a');
    const last = tr.querySelector('td:nth-child(5) a.nomargin');
    const lastDate = tr.querySelector('td:nth-child(5) p.mini');
    const author = tr.querySelector('td:nth-child(4) a.nomargin');
    const arrow = tr.querySelector('td:nth-child(5) a.btn');
    const msg = tr.querySelector('td:nth-child(2)'); const views = tr.querySelector('td:nth-child(3)');
    const tags = [...tr.querySelectorAll('span.tagforum a')].map(a => a.textContent.trim());
    const bg = t.bgOf(tr);
    const rowRect = rect(tr);
    return {
      title: title.textContent.trim(),
      unread: tr.classList.contains('kr-topic-unread'),
      pages: tr.getAttribute('data-kr-pages'),
      text: vt(tr),
      expect: { last: last.textContent.trim(), date: lastDate.textContent.replace(/\s+/g, ' ').trim(), msg: Number(msg.textContent.trim()), views: Number(views.textContent.trim()), author: author.textContent.trim(), tags },
      row: rowRect, titleRect: rect(title), titleFs: parseFloat(getComputedStyle(title).fontSize), lastRect: rect(last), statsRect: rect(msg),
      arrow: arrow ? { ...rect(arrow), href: arrow.getAttribute('href'), label: arrow.getAttribute('aria-label'), vis: vis(arrow) } : null,
      authorInert: hitIsNot(author), lastInert: hitIsNot(last),
      cellText: { msg: msg.textContent.trim(), views: views.textContent.trim() },
      colors: {
        title: t.round(t.ratio(t.fgOn(title, bg), bg)), last: t.round(t.ratio(t.fgOn(last, bg), bg)), date: t.round(t.ratio(t.fgOn(lastDate, bg), bg)),
        msg: t.round(t.ratio(t.fgOn(msg, bg), bg)), views: t.round(t.ratio(t.fgOn(views, bg), bg)), author: t.round(t.ratio(t.fgOn(author, bg), bg)),
        tag: tags.length ? t.round(t.ratio(t.fgOn(tr.querySelector('span.tagforum a'), bg), bg)) : null,
        arrow: arrow ? t.round(t.ratio(t.fgOn(arrow, t.bgOf(arrow)), t.bgOf(arrow))) : null
      }
    };
  });
};

const TOOLBAR = () => {
  const t = window.__krColorTools();
  const rect = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right) }; };
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const input = document.querySelector('.dataTables_filter input'); const select = document.querySelector('.dataTables_length select');
  const ths = [...document.querySelectorAll('#topics thead th')];
  const tr = document.querySelector('#topics thead tr');
  const mask = tr ? (getComputedStyle(tr).maskImage || '') + (getComputedStyle(tr).webkitMaskImage || '') : '';
  const chipRatio = th => { const bg = t.bgOf(th); return t.round(t.ratio(t.fgOn(th, bg), bg)); };
  const firstRegular = document.querySelector('#topics tbody tr');
  return {
    iw: window.innerWidth, ih: window.innerHeight,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    input: input ? { ...rect(input), vis: vis(input), placeholder: input.getAttribute('placeholder'), aria: input.getAttribute('aria-label'), fs: parseFloat(getComputedStyle(input).fontSize) } : null,
    select: select ? { ...rect(select), vis: vis(select), aria: select.getAttribute('aria-label'), fs: parseFloat(getComputedStyle(select).fontSize) } : null,
    chips: ths.map(th => ({ text: th.textContent.replace(/\s+/g, ' ').trim(), ...rect(th), vis: vis(th), cls: th.className, aria: th.getAttribute('aria-sort'), ratio: vis(th) ? chipRatio(th) : null })),
    mask, scrollX: tr ? getComputedStyle(tr).overflowX : '',
    triPrefix: tr ? getComputedStyle(tr, '::before').content : '',
    triRatio: tr ? (() => { const bg = t.bgOf(tr); const c = t.parse(getComputedStyle(tr, '::before').color); return t.round(t.ratio(t.over(c, bg), bg)); })() : null,
    firstRegularY: firstRegular ? Math.round(firstRegular.getBoundingClientRect().top + window.scrollY) : null,
    inputRatio: input ? (() => { const bg = t.bgOf(input); return t.round(t.ratio(t.fgOn(input, bg), bg)); })() : null,
    selectRatio: select ? (() => { const bg = t.bgOf(select); return t.round(t.ratio(t.fgOn(select, bg), bg)); })() : null
  };
};

const fr = n => `${n} message${n > 1 ? 's' : ''}`;
const checkTopicRows = (label, rows) => {
  const bad = (pred) => JSON.stringify(rows.filter(r => !pred(r)).map(r => r.title)).slice(0, 300);
  check(`${label} : des lignes de #topics sont présentes`, () => assert.ok(rows.length >= 3));
  check(`${label} : chaque ligne montre titre, dernier message (auteur et date), compteurs libellés, pages, auteur et étiquettes`, () => assert.ok(rows.every(r => {
    const e = r.expect;
    return r.text.includes(`Dernier : ${e.last}`) && r.text.includes(e.date) && r.text.includes(fr(e.msg)) && r.text.includes(`${e.views} vue${e.views > 1 ? 's' : ''}`)
      && r.text.includes(`par ${e.author}`) && (!r.pages || r.text.includes(`${r.pages} pages`)) && e.tags.every(tg => r.text.includes('#' + tg));
  }), bad(r => r.text.includes('Dernier : ' + r.expect.last) && r.text.includes(fr(r.expect.msg)))));
  check(`${label} : « NON LU » lisible dans la ligne si et seulement si non lu`, () => assert.ok(rows.every(r => r.text.includes('NON LU') === r.unread), bad(r => r.text.includes('NON LU') === r.unread)));
  check(`${label} : ordre des lignes de texte = titre, puis dernier message, puis compteurs`, () => assert.ok(rows.every(r => r.titleRect.b <= r.lastRect.y + 2 && r.lastRect.b <= r.statsRect.y + 2), bad(r => r.titleRect.b <= r.lastRect.y + 2 && r.lastRect.b <= r.statsRect.y + 2)));
  check(`${label} : titre en 16 px`, () => assert.ok(rows.every(r => r.titleFs === 16), bad(r => r.titleFs === 16)));
  check(`${label} : hauteur de ligne raisonnable (60 à 130 px)`, () => assert.ok(rows.every(r => r.row.h >= 60 && r.row.h <= 130), JSON.stringify(rows.map(r => r.row.h))));
  check(`${label} : bouton → natif de 44 x 44 à droite, centré dans la ligne, libellé « aller au dernier message »`, () => assert.ok(rows.every(r => r.arrow && r.arrow.vis && Math.abs(r.arrow.w - 44) <= 1 && Math.abs(r.arrow.h - 44) <= 1 && r.arrow.r >= r.row.r - 16 && Math.abs((r.arrow.y + 22) - (r.row.y + r.row.h / 2)) <= 8 && /#msg/.test(r.arrow.href) && r.arrow.label === 'aller au dernier message'), JSON.stringify(rows.slice(0, 2).map(r => r.arrow))));
  check(`${label} : auteurs non cliquables sur mobile (aucun toucher accidentel vers Kramail ou un profil)`, () => assert.ok(rows.every(r => r.authorInert && r.lastInert), bad(r => r.authorInert && r.lastInert)));
  check(`${label} : cellules natives intactes (chiffres seuls dans les cellules Msg et Vus)`, () => assert.ok(rows.every(r => r.cellText.msg === String(r.expect.msg) && r.cellText.views === String(r.expect.views)), bad(r => r.cellText.msg === String(r.expect.msg))));
};

const checkToolbar = (label, m) => {
  check(`${label} : recherche et « Afficher » sur une ligne, au moins 44 px de haut`, () => { assert.ok(m.input && m.select && m.input.vis && m.select.vis); assert.ok(Math.abs(m.input.y - m.select.y) <= 4, `input y ${m.input.y}, select y ${m.select.y}`); assert.ok(m.input.h >= 44 && m.select.h >= 44, `${m.input.h} / ${m.select.h}`); assert.ok(m.input.w >= 150, 'largeur ' + m.input.w); });
  check(`${label} : champs nommés (placeholder et libellés accessibles), police 16 px (pas de zoom iOS)`, () => { assert.ok(/Rechercher/.test(m.input.placeholder || '')); assert.ok(m.input.aria && m.select.aria); assert.equal(m.input.fs, 16); assert.equal(m.select.fs, 16); });
  check(`${label} : 5 puces de tri natives (th) visibles, 44 px de haut, la colonne triée en premier`, () => { assert.equal(m.chips.length, 5); assert.ok(m.chips.every(c => c.vis && c.h >= 44 && c.w >= 44), JSON.stringify(m.chips.map(c => [c.text, c.w, c.h, c.vis]))); const sorted = m.chips.find(c => c.aria); assert.ok(sorted && /Dernier/.test(sorted.text)); assert.ok(m.chips.every(c => c === sorted || c.x > sorted.x)); });
  check(`${label} : puces défilantes avec fondu à droite, préfixe « Trier : »`, () => { assert.equal(m.scrollX, 'auto'); assert.ok(/gradient/.test(m.mask), m.mask); assert.ok(/Trier/.test(m.triPrefix)); });
  check(`${label} : 0 débordement horizontal`, () => assert.equal(m.overflowX, 0));
};

if (frag('l3-liste')) {
  console.log('L3 : liste des sujets mobile (variante A)');
  for (const width of [375, 700]) {
    const { context, page: p } = await open({ width });
    await withTools(p);
    const rows = await p.evaluate(TOPIC_ROWS);
    const tb = await p.evaluate(TOOLBAR);
    if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `sous-forum-liste-${width}.png`), fullPage: true }); }
    checkTopicRows(`${width}`, rows);
    checkToolbar(`${width}`, tb);
    const small = await p.evaluate(() => window.__krSmallTargets('#topics_wrapper', '.dataTables_paginate, thead'));
    check(`${width} : toutes les cibles de la liste (hors pagination et puces de tri) font au moins 44 x 44 (grille elementFromPoint)`, () => { const bad = small.filter(s => s.w < 44 || s.h < 44); assert.ok(small.length >= 10 && bad.length === 0, JSON.stringify(bad.slice(0, 5))); });
    // Tri : un toucher sur la puce « Vus » trie par DataTables (aria-sort posé par le plug-in)
    await p.locator('#topics thead th', { hasText: 'Vus' }).click();
    await settleRedraw(p);
    const sorted = await p.evaluate(() => ({ aria: document.querySelector('#topics thead th:nth-child(3)').getAttribute('aria-sort'), views: [...document.querySelectorAll('#topics tbody td:nth-child(3)')].map(td => Number(td.textContent)) }));
    check(`${width} : toucher la puce « Vus » trie la liste (aria-sort et ordre croissant)`, () => { assert.equal(sorted.aria, 'ascending'); assert.deepEqual(sorted.views, [...sorted.views].sort((a, b) => a - b)); });
    await context.close();
    for (const [name, act] of REDRAWS) {
      const c = await open({ width });
      await withTools(c.page);
      await act(c.page);
      await settleRedraw(c.page);
      checkTopicRows(`${width} après ${name}`, await c.page.evaluate(TOPIC_ROWS));
      await c.context.close();
    }
  }
  {
    const { context, page: p } = await open({ width: 375, late: true });
    await withTools(p);
    checkTopicRows('375 (DataTables initialisé après le userscript)', await p.evaluate(TOPIC_ROWS));
    checkToolbar('375 (DataTables initialisé après le userscript)', await p.evaluate(TOOLBAR));
    await context.close();
  }
  for (const width of [1280, 1440]) {
    const { context, page: p } = await open({ width });
    await withTools(p);
    const d = await p.evaluate(() => ({ unit: document.querySelector('#topics tbody td:nth-child(2)').textContent.trim(), text: window.__krVisibleText(document.querySelector('#topics tbody tr')), thead: getComputedStyle(document.querySelector('#topics thead')).display, theadTr: getComputedStyle(document.querySelector('#topics thead tr')).display, ths: [...document.querySelectorAll('#topics thead th')].filter(th => th.getBoundingClientRect().width > 0).length }));
    check(`${width} : bureau inchangé par la liste mobile (tableau natif, en-têtes en table, pas de libellé « Dernier : »)`, () => { assert.equal(d.thead, 'table-header-group'); assert.equal(d.theadTr, 'table-row'); assert.equal(d.ths, 5); assert.ok(!/Dernier :|messages|vues/.test(d.text), d.text); });
    await context.close();
  }
}

if (frag('l3-themes')) {
  console.log('L3 : contrastes >= 4,5:1 de la liste des sujets mobile sur les 16 thèmes');
  for (const variant of THEMES) {
    const { context, page: p } = await open({ width: 375, variant });
    await withTools(p);
    const rows = await p.evaluate(TOPIC_ROWS);
    const tb = await p.evaluate(TOOLBAR);
    const min = a => Math.min(...a.filter(x => typeof x === 'number'));
    check(`375 ${variant} : titres, dernier message, dates, compteurs, auteurs, étiquettes et flèches >= 4,5:1`, () => { const all = rows.flatMap(r => Object.values(r.colors)).filter(x => x !== null); assert.ok(all.length >= 60); assert.ok(min(all) >= 4.5, 'min ' + min(all)); });
    check(`375 ${variant} : puces de tri, « Trier : », recherche et « Afficher » >= 4,5:1`, () => { const v = [...tb.chips.map(c => c.ratio), tb.triRatio, tb.inputRatio, tb.selectRatio]; assert.ok(v.every(x => typeof x === 'number'), JSON.stringify(v)); assert.ok(min(v) >= 4.5, 'min ' + min(v)); });
    await context.close();
  }
}

// ---------- L4 : sujets permanents mobile (1 ligne de 44 px : cadenas, titre, NON LU, date du dernier message ; toute la ligne mène au sujet) ----------
const PERM_ROWS = () => {
  const t = window.__krColorTools(); const vt = window.__krVisibleText;
  const rect = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom + window.scrollY) }; };
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const hitHref = (x, y) => { const el = document.elementFromPoint(x, y); const a = el && el.closest('a'); return a ? a.getAttribute('href') : null; };
  const table = document.querySelector('#fx-permanents table');
  const rows = [...document.querySelectorAll('#fx-permanents tbody tr')];
  const heads = [...document.querySelectorAll('.panel-heading span.clickable')].map(e => ({ ...rect(e), vis: vis(e) }));
  return {
    iw: window.innerWidth, ih: window.innerHeight,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    tableH: table ? rect(table).h : 0, heads,
    statsWrappers: document.querySelectorAll('.permanent-topic-stats').length,
    firstRegularY: Math.round(document.querySelector('#topics tbody tr').getBoundingClientRect().top + window.scrollY),
    rows: rows.map(tr => {
      const title = tr.querySelector('td:first-child p a'); const lock = tr.querySelector('td:first-child p i.fa-lock'); const badge = tr.querySelector('.kr-topic-badge');
      const date = tr.querySelector('td:nth-child(5) p.mini');
      const r = rect(tr); const bg = t.bgOf(tr);
      const href = title.getAttribute('href');
      const hit = (fx) => { const rr = tr.getBoundingClientRect(); return hitHref(rr.left + rr.width * fx, rr.top + rr.height / 2); };
      return {
        title: title.textContent.trim(), href, unread: tr.classList.contains('kr-topic-unread'), locked: !!lock,
        text: vt(tr), row: r, titleRect: rect(title), titleVisible: vis(title), titleOverflow: getComputedStyle(title).textOverflow, titleNowrap: getComputedStyle(title).whiteSpace,
        lockRect: lock && vis(lock) ? rect(lock) : null, badgeRect: badge && vis(badge) ? rect(badge) : null, dateRect: vis(date) ? rect(date) : null,
        dateText: date.textContent.replace(/\s+/g, ' ').trim(),
        hits: [hit(0.15), hit(0.5), hit(0.8)],
        colors: { title: t.round(t.ratio(t.fgOn(title, bg), bg)), date: vis(date) ? t.round(t.ratio(t.fgOn(date, bg), bg)) : null, lock: lock && vis(lock) ? t.round(t.ratio(t.fgOn(lock, bg), bg)) : null }
      };
    })
  };
};

const checkPerm = (label, m) => {
  const bad = pred => JSON.stringify(m.rows.filter(r => !pred(r)).map(r => r.title)).slice(0, 300);
  check(`${label} : 5 sujets permanents visibles`, () => assert.equal(m.rows.length, 5));
  check(`${label} : une ligne de 44 à 48 px par permanent, tableau de 5 lignes <= 240 px`, () => { assert.ok(m.rows.every(r => r.row.h >= 44 && r.row.h <= 48), JSON.stringify(m.rows.map(r => r.row.h))); assert.ok(m.tableH <= 240, 'tableau ' + m.tableH); });
  check(`${label} : titre sur une seule ligne, coupé par « … » s'il est trop long`, () => assert.ok(m.rows.every(r => r.titleVisible && r.titleRect.h <= 24 && r.titleOverflow === 'ellipsis' && r.titleNowrap === 'nowrap'), bad(r => r.titleRect.h <= 24 && r.titleOverflow === 'ellipsis')));
  check(`${label} : cadenas visible si verrouillé, pastille NON LU si non lu, date du dernier message toujours`, () => assert.ok(m.rows.every(r => (!!r.lockRect === r.locked) && (!!r.badgeRect === r.unread) && r.dateRect && r.text.includes(r.dateText) && (!r.unread || r.text.includes('NON LU'))), bad(r => (!!r.lockRect === r.locked) && (!!r.badgeRect === r.unread) && r.dateRect)));
  check(`${label} : ordre sur la ligne = cadenas, titre, NON LU, date (de gauche à droite, sans retour à la ligne)`, () => assert.ok(m.rows.every(r => {
    const seq = [r.lockRect, r.titleRect, r.badgeRect, r.dateRect].filter(Boolean);
    return seq.every((a, i) => i === 0 || seq[i - 1].r <= a.x + 1) && seq.every(a => a.y >= r.row.y - 1 && a.b <= r.row.b + 1);
  }), bad(r => r.titleRect.r <= (r.dateRect || {}).x + 1)));
  check(`${label} : compteurs, auteur et pages ne sont pas affichés dans les permanents (ils sont dans le sujet)`, () => assert.ok(m.rows.every(r => !/messages?|vues?|pages? ·|par KraDesk/.test(r.text)), bad(r => !/messages?|vues?/.test(r.text))));
  check(`${label} : toute la ligne mène au sujet (le toucher à gauche, au centre et à droite atteint le lien du titre)`, () => assert.ok(m.rows.every(r => r.hits.every(h => h === r.href)), JSON.stringify(m.rows.map(r => r.hits.map(h => h === r.href)))));
  check(`${label} : pas de bloc de statistiques ajouté par l'ancien module des permanents`, () => assert.equal(m.statsWrappers, 0));
  check(`${label} : chevrons de repli (les 2 panneaux) de 44 x 44`, () => assert.ok(m.heads.length === 2 && m.heads.every(h => h.vis && h.w >= 44 && h.h >= 44), JSON.stringify(m.heads)));
  check(`${label} : 0 débordement horizontal`, () => assert.equal(m.overflowX, 0));
};

if (frag('l4-perm')) {
  console.log('L4 : sujets permanents mobile (1 ligne de 44 px)');
  for (const [width, height] of [[375, 667], [700, 800]]) {
    const { context, page: p } = await open({ width, height });
    await withTools(p);
    const m = await p.evaluate(PERM_ROWS);
    if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `sous-forum-permanents-${width}.png`), fullPage: true }); }
    checkPerm(`${width}`, m);
    check(`${width} : le 1er sujet réel commence à 0,95 écran ou moins (écran de ${height} px)`, () => assert.ok(m.firstRegularY <= 0.95 * height, `${m.firstRegularY} px sur ${height} (${(m.firstRegularY / height).toFixed(2)})`));
    const small = await p.evaluate(() => window.__krSmallTargets('#fx-permanents', null));
    check(`${width} : toutes les cibles du panneau des permanents font au moins 44 x 44 (grille elementFromPoint)`, () => { const bad = small.filter(s => s.w < 44 || s.h < 44); assert.ok(small.length >= 6 && bad.length === 0, JSON.stringify(bad.slice(0, 5))); });
    // Repli natif : un toucher sur le chevron replie le panneau (mécanisme du site)
    await p.locator('.panel-heading span.clickable').first().click();
    const collapsed = await p.evaluate(() => getComputedStyle(document.querySelector('#fx-permanents .panel-body')).display);
    check(`${width} : le chevron natif replie toujours le panneau des permanents`, () => assert.equal(collapsed, 'none'));
    await context.close();
    const c = await open({ width, height });
    await withTools(c.page);
    await REDRAWS[0][1](c.page);
    await settleRedraw(c.page);
    checkPerm(`${width} après page 2`, await c.page.evaluate(PERM_ROWS));
    await c.context.close();
  }
  {
    const { context, page: p } = await open({ width: 375, late: true });
    await withTools(p);
    checkPerm('375 (DataTables initialisé après le userscript)', await p.evaluate(PERM_ROWS));
    await context.close();
  }
}

if (frag('l4-themes')) {
  console.log('L4 : contrastes >= 4,5:1 des sujets permanents sur les 16 thèmes');
  for (const variant of THEMES) {
    const { context, page: p } = await open({ width: 375, variant });
    await withTools(p);
    const m = await p.evaluate(PERM_ROWS);
    check(`375 ${variant} : titres, cadenas et dates des permanents >= 4,5:1`, () => { const v = m.rows.flatMap(r => Object.values(r.colors)).filter(x => x !== null); assert.ok(v.length >= 13, 'mesures ' + v.length); assert.ok(Math.min(...v) >= 4.5, 'min ' + Math.min(...v)); });
    await context.close();
  }
}

// ---------- L5 : pagination mobile (une ligne « ‹ 1 2 3 … 15 › » de cibles de 44 px) ----------
const PAGINATION = () => {
  const t = window.__krColorTools();
  const rect = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right) }; };
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const pag = document.querySelector('#topics_wrapper .dataTables_paginate');
  const nodes = [...pag.querySelectorAll('a.paginate_button, span.ellipsis, .kr-page-gap')].filter(vis);
  const label = n => (n.classList.contains('previous') ? 'prev' : n.classList.contains('next') ? 'next' : (n.matches('a.paginate_button:not(.kr-page-gap)') ? n.textContent.trim() : '…'));
  const ratioOf = n => { const bg = t.bgOf(n); return t.round(t.ratio(t.fgOn(n, bg), bg)); };
  return {
    iw: window.innerWidth,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    pag: rect(pag), paginateScroll: pag.scrollWidth - pag.clientWidth,
    seq: nodes.map(label),
    items: nodes.map(n => ({ l: label(n), ...rect(n), tap: n.tagName === 'A' && !n.classList.contains('kr-page-gap'), disabled: n.classList.contains('disabled'), current: n.classList.contains('current'), ratio: vis(n) && !n.classList.contains('disabled') ? ratioOf(n) : null, name: n.textContent.trim() })),
    info: document.querySelector('#topics_wrapper .dataTables_info').textContent.trim(),
    infoRatio: (() => { const e = document.querySelector('#topics_wrapper .dataTables_info'); return t.round(t.ratio(t.fgOn(e, t.bgOf(e)), t.bgOf(e))); })()
  };
};

const checkPagination = (label, m, expectedSeq) => {
  check(`${label} : pagination sur une seule ligne (tous les boutons à la même hauteur, pas de défilement)`, () => { const ys = m.items.map(i => i.y + i.h / 2); assert.ok(Math.max(...ys) - Math.min(...ys) <= 4, JSON.stringify(m.items.map(i => [i.l, i.y]))); assert.ok(m.pag.h <= 48, 'hauteur ' + m.pag.h); assert.ok(m.paginateScroll <= 0, 'défilement ' + m.paginateScroll); });
  check(`${label} : boutons de 44 x 44 au moins, précédent et suivant présents`, () => { const taps = m.items.filter(i => i.tap); assert.ok(taps.length >= 3 && taps.every(i => i.w >= 44 && i.h >= 44), JSON.stringify(taps.map(i => [i.l, i.w, i.h]))); assert.ok(m.seq[0] === 'prev' && m.seq[m.seq.length - 1] === 'next', m.seq.join(' ')); });
  check(`${label} : « Précédent » et « Suivant » gardent leur nom accessible (texte natif), affichés en ‹ et ›`, () => { const p = m.items[0]; const n = m.items[m.items.length - 1]; assert.equal(p.name, 'Précédent'); assert.equal(n.name, 'Suivant'); });
  check(`${label} : tout reste dans l'écran (0 débordement, boutons dans la largeur)`, () => { assert.equal(m.overflowX, 0); assert.ok(m.items.every(i => i.x >= 0 && i.r <= m.iw), JSON.stringify(m.items.filter(i => i.r > m.iw))); });
  if (expectedSeq) { check(`${label} : séquence affichée = ${expectedSeq.join(' ')}`, () => assert.deepEqual(m.seq, expectedSeq)); }
  check(`${label} : la page courante est repérée (classe native current) et son numéro est affiché`, () => assert.equal(m.items.filter(i => i.current).length, 1));
};

if (frag('l5-pagination')) {
  console.log('L5 : pagination mobile sur une ligne');
  for (const width of [375, 700]) {
    const { context, page: p } = await open({ width });
    await withTools(p);
    const m = await p.evaluate(PAGINATION);
    if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `sous-forum-pagination-${width}.png`), fullPage: true }); }
    checkPagination(`${width} page 1`, m, ['prev', '1', '2', '3', '…', '15', 'next']);
    check(`${width} : « Précédent » désactivé à la page 1 (natif)`, () => assert.ok(m.items[0].disabled));
    // Navigation au toucher : page 2, puis dernière page, puis page précédente ; la pagination reste sur une ligne à chaque étape
    const tapPage = async text => { await p.locator('#topics_wrapper .dataTables_paginate a.paginate_button', { hasText: new RegExp('^' + text + '$') }).first().click(); await settleRedraw(p); return p.evaluate(PAGINATION); };
    const m2 = await tapPage('2');
    checkPagination(`${width} page 2`, m2, ['prev', '1', '2', '3', '…', '15', 'next']);
    check(`${width} : toucher « 2 » affiche la page 2 de DataTables`, () => assert.ok(/Affiche 11 à 20 de 145/.test(m2.info), m2.info));
    const m3 = await tapPage('15');
    checkPagination(`${width} dernière page`, m3, null);
    check(`${width} : « Suivant » désactivé à la dernière page (natif)`, () => assert.ok(m3.items[m3.items.length - 1].disabled));
    const m4 = await tapPage('Précédent');
    checkPagination(`${width} page 14`, m4, null);
    check(`${width} : toucher « Précédent » revient à la page 14`, () => assert.ok(/Affiche 131 à 140 de 145/.test(m4.info), m4.info));
    await context.close();
  }
  {
    const { context, page: p } = await open({ width: 375, late: true });
    await withTools(p);
    checkPagination('375 (DataTables initialisé après le userscript)', await p.evaluate(PAGINATION), ['prev', '1', '2', '3', '…', '15', 'next']);
    await context.close();
  }
  {
    const { context, page: p } = await open({ width: 375 });
    await withTools(p);
    await REDRAWS[3][1](p);
    await settleRedraw(p);
    checkPagination('375 après « Afficher 25 »', await p.evaluate(PAGINATION), ['prev', '1', '2', '3', '…', '6', 'next']);
    await context.close();
  }
  {
    const { context, page: p } = await open({ width: 375 });
    await withTools(p);
    await p.fill('.dataTables_filter input', 'zzzz-aucun');
    await settleRedraw(p);
    const m = await p.evaluate(PAGINATION);
    check('375 après une recherche sans résultat : pagination sur une ligne, sans débordement', () => { assert.equal(m.overflowX, 0); assert.ok(m.pag.h <= 48); });
    await context.close();
  }
  for (const width of [1280, 1440]) {
    const { context, page: p } = await open({ width });
    await withTools(p);
    const m = await p.evaluate(PAGINATION);
    check(`${width} : bureau inchangé (pagination native : « Précédent » et « Suivant » en toutes lettres)`, () => assert.ok(m.items[0].name === 'Précédent' && m.seq.includes('5') && m.seq.includes('…')));
    await context.close();
  }
}

if (frag('l5-themes')) {
  console.log('L5 : contrastes >= 4,5:1 de la pagination mobile sur les 16 thèmes');
  for (const variant of THEMES) {
    const { context, page: p } = await open({ width: 375, variant });
    await withTools(p);
    const m = await p.evaluate(PAGINATION);
    check(`375 ${variant} : boutons de pagination, page courante et ligne d'information >= 4,5:1`, () => { const v = [...m.items.filter(i => i.tap).map(i => i.ratio).filter(x => x !== null), m.infoRatio]; assert.ok(v.length >= 4, JSON.stringify(v)); assert.ok(Math.min(...v) >= 4.5, 'min ' + Math.min(...v) + ' ' + JSON.stringify(m.items.map(i => [i.l, i.ratio]))); });
    await context.close();
  }
}

await browser.close();
console.log(failures ? `${failures} échec(s)` : 'Tous les contrôles passent');
process.exit(failures ? 1 : 0);
