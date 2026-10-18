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
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { domQuiet, krReady, THEME_READY } from './lib/settle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const SHOTS = process.env.KR_SHOTS || '';
const BASE = 'http://www.kraland.org';
const FIXTURE = fs.readFileSync(path.join(here, 'fixtures/sous-forum-debuter.html'), 'utf8');
const VENDOR = path.join(here, 'vendor');
const SUBFORUM = '/forum/hrp/debuter-20102';
// Lot E : 1440 retiré (bureau : rien dans la cascade ne change entre 1280 et 1440 pour le sous-forum ; seules règles >= 1360 / 1440 :
// plateau #col-leftest et marges de la barre de navigation, hors de ces contrôles). Bureau = 1280.
const WIDTHS = [375, 700, 1280];

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

const browser = await launchBrowser();

// Ouvre une page de la fixture. `url` : chemin ; `variant` : thème ; `html` : corps de page (défaut : le sous-forum).
async function open({ width, variant = 'empire-brun-dark', height = 800, url = SUBFORUM, html = FIXTURE, theme = true, late = false }) {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 2 });
  const state = { documents: 0, loads: 0, other: [] };
  await confineNetwork(context); // refus global EN PREMIER (logos du thème et version.json : refusés)
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
  // Documents entièrement chargés (événement load de chaque document) : un rechargement est fini quand ce compteur l'atteint.
  page.on('load', () => { state.loads += 1; });
  await page.goto(BASE + url + (late ? '?dt=late' : ''), { waitUntil: 'load' });
  // Lot B : avec le script, fin d'initialisation explicite (html[data-kr-ready]) ; sans script (theme false), le DOM calme reste la seule condition.
  if (theme) { await krReady(page, { ready: THEME_READY, label: 'sous-forum' }); } else { await domQuiet(page, { label: 'sous-forum' }); }
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
      newmsgIcon: !!tr.querySelector('td:first-child i.fa.fa-folder-open:not(.far)'),
      newmsg: tr.classList.contains('kr-topic-newmsg'),
      badgeAttr: badge ? badge.getAttribute('data-kr-label') : null,
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

// Redessin DataTables attendu sur CONDITION (lot A, remplace la fenêtre de calme de 300 ms de settleRedraw dans L5, la recherche des pastilles de L1 et les redessins de L8) : un compteur incrémenté par
// un écouteur draw.dt que le test pose sur #topics. DataTables (et la fixture) déclenchent draw.dt de façon synchrone, après avoir réécrit les
// lignes et la pagination ; les écouteurs draw.dt du userscript (statuts, pagination compacte, libellés) sont synchrones eux aussi : quand le
// compteur a bougé, le redessin et ses retouches sont faits. Deux images peintes ensuite, pour mesurer un rendu posé. Plus strict que le calme :
// une action qui ne redessine pas échoue en 15 s (erreur explicite), au lieu de passer pour un redessin terminé.
const DRAWS = () => {
  if (window.__krDraws === undefined) { window.__krDraws = 0; window.jQuery('#topics').on('draw.dt', () => { window.__krDraws += 1; }); }
  return window.__krDraws;
};
const redraw = async (p, act, label = 'redessin DataTables') => {
  const before = await p.evaluate(DRAWS);
  await act();
  await p.waitForFunction(n => window.__krDraws > n, before, { timeout: 15000 }).catch(e => { throw new Error(`${label} : aucun draw.dt en 15000 ms (${String(e.message).split('\n')[0]})`); });
  await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
};

// ---------- L1 : statuts (non lu, verrouillé, pages) en classes JS, pastille, barre, jeton de couleur ----------
// Statut signalé (barre, gras, pastille) = jamais ouvert (« NON LU ») OU lu en partie avec nouveaux messages (« NOUVEAU MESSAGE »).
const flagged = r => r.unreadIcon || r.newmsgIcon;
const expectedLabel = r => (r.unreadIcon ? 'NON LU' : (r.newmsgIcon ? 'NOUVEAU MESSAGE' : null));
const checkStatus = (label, rows, { badgeExpected = true } = {}) => {
  check(`${label} : des lignes sont présentes`, () => assert.ok(rows.length >= 5));
  check(`${label} : kr-topic-unread si et seulement si l'icône dossier (i.fa.fa-folder)`, () => assert.ok(rows.every(r => r.unread === r.unreadIcon), JSON.stringify(rows.filter(r => r.unread !== r.unreadIcon).map(r => r.title))));
  check(`${label} : kr-topic-newmsg si et seulement si l'icône dossier ouvert pleine (i.fa.fa-folder-open sans far), exclusif de kr-topic-unread`, () => assert.ok(rows.every(r => r.newmsg === r.newmsgIcon && !(r.newmsg && r.unread)), JSON.stringify(rows.filter(r => r.newmsg !== r.newmsgIcon || (r.newmsg && r.unread)).map(r => r.title))));
  check(`${label} : kr-topic-locked si et seulement si le cadenas (i.fa-lock)`, () => assert.ok(rows.every(r => r.locked === r.lockIcon)));
  check(`${label} : kr-topic-pages si et seulement si 2e liste de pages, avec data-kr-pages = nombre de pages`, () => assert.ok(rows.every(r => r.pagesCls === (r.pagesIcons > 0) && (r.pagesIcons === 0 ? r.pagesAttr === null : Number(r.pagesAttr) === r.pagesIcons))));
  if (badgeExpected) {
    check(`${label} : pastille « NON LU » en toutes lettres, une seule, si et seulement si non lu`, () => assert.ok(rows.filter(r => !r.newmsgIcon).every(r => r.badges === (r.unreadIcon ? 1 : 0) && (!r.unreadIcon || r.badgeText === 'NON LU')), JSON.stringify(rows.filter(r => !r.newmsgIcon && r.badges !== (r.unreadIcon ? 1 : 0)).map(r => [r.title, r.badges]))));
    check(`${label} : pastille « NOUVEAU MESSAGE » en toutes lettres, une seule, si et seulement si lu en partie (jamais « NON LU »)`, () => assert.ok(rows.every(r => !r.newmsgIcon || (r.badges === 1 && r.badgeText === 'NOUVEAU MESSAGE' && r.badgeAttr === 'NOUVEAU MESSAGE')) && rows.every(r => r.badgeText !== 'NOUVEAU MESSAGE' || r.newmsgIcon), JSON.stringify(rows.filter(r => r.newmsgIcon !== (r.badgeText === 'NOUVEAU MESSAGE')).map(r => [r.title, r.badges, r.badgeText]))));
    check(`${label} : pastille visible sur chaque ligne non lue ou lue en partie`, () => assert.ok(rows.filter(flagged).every(r => r.badgeVisible)));
    check(`${label} : la pastille n'écrit aucun texte dans la cellule (DataTables lit le texte des cellules pour la recherche et le tri)`, () => assert.ok(rows.filter(flagged).every(r => r.badgeDomText === ''), JSON.stringify(rows.filter(r => r.badgeDomText).map(r => [r.title, r.badgeDomText]))));
  }
  check(`${label} : barre de statut d'au moins 4 px si et seulement si non lu ou lu en partie`, () => assert.ok(rows.every(r => (r.barW >= 4) === flagged(r)), JSON.stringify(rows.filter(r => (r.barW >= 4) !== flagged(r)).map(r => [r.title, r.barW]))));
  check(`${label} : titre en gras (>= 600) si non lu ou lu en partie, plus léger sinon`, () => assert.ok(rows.every(r => flagged(r) ? r.weight >= 600 : r.weight < 600), JSON.stringify(rows.filter(r => flagged(r) ? r.weight < 600 : r.weight >= 600).map(r => [r.title, r.weight]))));
  check(`${label} : cadenas visible sur chaque sujet verrouillé`, () => assert.ok(rows.filter(r => r.lockIcon).every(r => r.lockVisible), JSON.stringify(rows.filter(r => r.lockIcon && !r.lockVisible).map(r => r.title))));
};

if (frag('l1-statuts')) {
  console.log('L1 : statuts non lu / nouveaux messages / verrouillé / pages (classes JS, pastille, barre, gras, cadenas)');
  for (const width of WIDTHS) {
    const { context, page: p } = await open({ width });
    await withTools(p);
    const rows = await p.evaluate(STATUS);
    if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `sous-forum-statuts-${width}.png`), fullPage: true }); }
    check(`${width} : permanents = 5 lignes dont 2 non lues, 1 lue en partie et 3 verrouillées`, () => { const perm = rows.filter(r => r.perm); assert.equal(perm.length, 5); assert.equal(perm.filter(r => r.unread).length, 2); assert.equal(perm.filter(r => r.newmsg).length, 1); assert.equal(perm.filter(r => r.locked).length, 3); });
    check(`${width} : page 1 de #topics = 10 lignes dont 7 non lues, 2 lues en partie et 1 lue`, () => { const t = rows.filter(r => !r.perm); assert.equal(t.length, 10); assert.equal(t.filter(r => r.unread).length, 7); assert.equal(t.filter(r => r.newmsg).length, 2); assert.equal(t.filter(r => !r.unread && !r.newmsg).length, 1); });
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
    for (const term of ['NON LU', 'NOUVEAU MESSAGE']) {
      const { context, page: p } = await open({ width: 375, late });
      await redraw(p, () => p.fill('.dataTables_filter input', term), `recherche « ${term} »`);
      const found = await p.evaluate(() => ({ rows: [...document.querySelectorAll('#topics tbody tr')].filter(tr => tr.querySelector('td:first-child a')).length, info: document.querySelector('.dataTables_info').textContent }));
      check(`recherche « ${term} »${late ? ' (DataTables initialisé après le userscript)' : ''} : aucun sujet, le libellé de la pastille n'est pas dans le texte des cellules`, () => { assert.equal(found.rows, 0, found.info); });
      await context.close();
    }
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
      const unread = rows.filter(flagged);
      const min = a => Math.min(...a.filter(x => x !== null));
      check(`${width} ${variant} : en-têtes « Sujets permanents » et « Sujets » >= 4,5:1 (${m.heads.join(' / ')})`, () => { assert.equal(m.heads.length, 2); assert.ok(min(m.heads) >= 4.5); });
      check(`${width} ${variant} : pastilles NON LU et NOUVEAU MESSAGE >= 4,5:1`, () => { assert.ok(unread.some(r => r.newmsgIcon) && unread.every(r => r.badgeRatio !== null)); assert.ok(min(unread.map(r => r.badgeRatio)) >= 4.5, 'min ' + min(unread.map(r => r.badgeRatio))); });
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
  for (const width of [1280]) {
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
      newmsg: tr.classList.contains('kr-topic-newmsg'),
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
  check(`${label} : « NOUVEAU MESSAGE » lisible dans la ligne si et seulement si lu en partie`, () => assert.ok(rows.every(r => r.text.includes('NOUVEAU MESSAGE') === r.newmsg), bad(r => r.text.includes('NOUVEAU MESSAGE') === r.newmsg)));
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
  for (const width of [1280]) {
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
        title: title.textContent.trim(), href, unread: tr.classList.contains('kr-topic-unread'), newmsg: tr.classList.contains('kr-topic-newmsg'), locked: !!lock,
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
  check(`${label} : cadenas visible si verrouillé, pastille NON LU si non lu, NOUVEAU MESSAGE si lu en partie, date du dernier message toujours`, () => assert.ok(m.rows.every(r => (!!r.lockRect === r.locked) && (!!r.badgeRect === (r.unread || r.newmsg)) && r.dateRect && r.text.includes(r.dateText) && (!r.unread || r.text.includes('NON LU')) && (r.text.includes('NOUVEAU MESSAGE') === r.newmsg)), bad(r => (!!r.lockRect === r.locked) && (!!r.badgeRect === (r.unread || r.newmsg)) && r.dateRect)));
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
  const nodes = [...pag.querySelectorAll('a.paginate_button, span')].filter(n => n.matches('a.paginate_button, .kr-page-gap') || (n.children.length === 0 && n.textContent.trim() === '…')).filter(vis); // « … » repérés par leur contenu, avec ou sans classe (DataTables 1.10.5 : aucune)
  const label = n => (n.classList.contains('previous') ? 'prev' : n.classList.contains('next') ? 'next' : (n.matches('a.paginate_button:not(.kr-page-gap)') ? n.textContent.trim() : '…'));
  const ratioOf = n => { const bg = t.bgOf(n); return t.round(t.ratio(t.fgOn(n, bg), bg)); };
  return {
    iw: window.innerWidth,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    pag: rect(pag), paginateScroll: pag.scrollWidth - pag.clientWidth,
    seq: nodes.map(label),
    nativeEllipsisVisible: nodes.filter(n => n.tagName === 'SPAN' && !n.classList.contains('kr-page-gap')).length,
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

// M-1 (QA PR14) : au bureau (>= 768 px), séquences EXACTES de la pagination native (une seule « … » par saut, aucun marqueur ni classe ajoutés),
// identiques à celles de la base 880a3f0 ; frontière 767 / 768 ; transitions mobile-mode <-> bureau.
const NATIVE_P1 = ['prev', '1', '2', '3', '4', '5', '…', '15', 'next'];
const NATIVE_P7 = ['prev', '1', '…', '6', '7', '8', '…', '15', 'next'];
const NATIVE_P15 = ['prev', '1', '…', '11', '12', '13', '14', '15', 'next'];
const MARKS = () => ({ gaps: document.querySelectorAll('#topics_wrapper .kr-page-gap').length, hidden: document.querySelectorAll('#topics_wrapper .kr-page-hidden').length, ellipsis: [...document.querySelectorAll('#topics_wrapper .dataTables_paginate span')].filter(s => s.children.length === 0 && !s.classList.contains('kr-page-gap') && s.textContent.trim() === '…').length });
const goNext = async (p, times) => { for (let i = 0; i < times; i += 1) { await redraw(p, () => p.evaluate(() => document.querySelector('#topics_paginate a.paginate_button.next').click())); } };
const checkNative = (label, m, marks, expectedSeq) => {
  check(`${label} : séquence de pagination native exacte = ${expectedSeq.join(' ')}`, () => assert.deepEqual(m.seq, expectedSeq));
  check(`${label} : aucun marqueur .kr-page-gap ni classe .kr-page-hidden ajouté, ${expectedSeq.filter(x => x === '…').length} « … » natif(s)`, () => assert.deepEqual(marks, { gaps: 0, hidden: 0, ellipsis: expectedSeq.filter(x => x === '…').length }));
};
// M-2 (QA PR14 revalidation) : « … » natif de DataTables 1.10.5 = <span> SANS classe (fixture par défaut) ; variante récente <span class="ellipsis"> en plus.
// Libellés « M-2 », distincts des existants. Les « … » visibles sont comptés par leur contenu (nativeEllipsisVisible), jamais par la classe.
const FIXTURE_CLASSED = FIXTURE.split('<span>…</span>').join('<span class="ellipsis">…</span>');
assert.notEqual(FIXTURE_CLASSED, FIXTURE, 'variante class="ellipsis" non produite');
const ELLIPSIS_KINDS = [['span sans classe (DataTables 1.10.5)', FIXTURE], ['span.ellipsis (variante récente)', FIXTURE_CLASSED]];
const MOBILE_P1 = ['prev', '1', '2', '3', '…', '15', 'next'];
const MOBILE_P5 = ['prev', '1', '…', '5', '…', '15', 'next'];
const MOBILE_P7 = ['prev', '1', '…', '7', '…', '15', 'next'];
const MOBILE_P15 = ['prev', '1', '…', '13', '14', '15', 'next'];
// Matrice réduite (lot A, audit t_b5de7533 § 2 n° 1 et § 7) : les contrôles de séquence et de mise en page ne tournent que sur le thème sombre par
// défaut (le thème ne pose que des variables de couleur ; les contrastes de la pagination sont vérifiés sur les 16 thèmes par l5-themes) ;
// bureau 768 (frontière) + 1280 ; mobile M-2 320 + 700 (375 reste couvert par le socle). Quatre fragments : socle (+ M-1), M-2 mobile,
// M-2 bureau, vraies transitions de viewport.
const VARIANT = 'empire-brun-dark';

// ---------- L5 socle : pagination mobile au toucher, cas particuliers, bureau natif (M-1), frontière, garde DOM des transitions ----------
if (frag('l5-pagination-socle')) {
  console.log('L5 : pagination mobile sur une ligne');
  for (const width of [375, 700]) {
    const { context, page: p } = await open({ width });
    await withTools(p);
    const m = await p.evaluate(PAGINATION);
    if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `sous-forum-pagination-${width}.png`), fullPage: true }); }
    checkPagination(`${width} page 1`, m, ['prev', '1', '2', '3', '…', '15', 'next']);
    check(`${width} : « Précédent » désactivé à la page 1 (natif)`, () => assert.ok(m.items[0].disabled));
    // Navigation au toucher : page 2, puis dernière page, puis page précédente ; la pagination reste sur une ligne à chaque étape
    const tapPage = async text => { await redraw(p, () => p.locator('#topics_wrapper .dataTables_paginate a.paginate_button', { hasText: new RegExp('^' + text + '$') }).first().click()); return p.evaluate(PAGINATION); };
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
    await redraw(p, () => REDRAWS[3][1](p));
    checkPagination('375 après « Afficher 25 »', await p.evaluate(PAGINATION), ['prev', '1', '2', '3', '…', '6', 'next']);
    await context.close();
  }
  {
    const { context, page: p } = await open({ width: 375 });
    await withTools(p);
    await redraw(p, () => p.fill('.dataTables_filter input', 'zzzz-aucun'));
    const m = await p.evaluate(PAGINATION);
    check('375 après une recherche sans résultat : pagination sur une ligne, sans débordement', () => { assert.equal(m.overflowX, 0); assert.ok(m.pag.h <= 48); });
    await context.close();
  }
  for (const width of [1280]) {
    const { context, page: p } = await open({ width });
    await withTools(p);
    const m = await p.evaluate(PAGINATION);
    check(`${width} : bureau inchangé (pagination native : « Précédent » et « Suivant » en toutes lettres)`, () => assert.ok(m.items[0].name === 'Précédent' && m.seq.includes('5') && m.seq.includes('…')));
    await context.close();
  }
  for (const width of [768, 1280]) {
    const { context, page: p } = await open({ width, variant: VARIANT });
    await withTools(p);
    const tag = `${width} sombre`;
    checkNative(`${tag} page 1`, await p.evaluate(PAGINATION), await p.evaluate(MARKS), NATIVE_P1);
    await goNext(p, 6);
    checkNative(`${tag} page 7`, await p.evaluate(PAGINATION), await p.evaluate(MARKS), NATIVE_P7);
    await goNext(p, 8);
    checkNative(`${tag} page 15`, await p.evaluate(PAGINATION), await p.evaluate(MARKS), NATIVE_P15);
    await context.close();
  }
  {
    // Frontière : 767 reste en pagination compacte (mobile), 768 en pagination native (ci-dessus)
    const { context, page: p } = await open({ width: 767 });
    await withTools(p);
    const m = await p.evaluate(PAGINATION);
    check('767 : pagination mobile compacte conservée (‹ 1 2 3 … 15 ›)', () => assert.deepEqual(m.seq, ['prev', '1', '2', '3', '…', '15', 'next']));
    await context.close();
  }
  {
    // Transitions : le bureau sort sans rien insérer et retire ce que le mobile avait posé (mobile-mode ôté sans rechargement, puis redessin).
    // PORTÉE : simple GARDE DOM (bascule de classe, ni setViewportSize ni rechargement), qui prouve seulement que compactPagination défait ce qu'il a posé ;
    // le libellé « transition » est conservé tel quel. Les vraies transitions de viewport (rechargement) sont dans l5-pagination-viewport, libellés « M-2 vraie transition de viewport ».
    const { context, page: p } = await open({ width: 375 });
    await withTools(p);
    const start = await p.evaluate(PAGINATION); const startMarks = await p.evaluate(MARKS);
    check('transition : à 375 la pagination est compacte avec marqueur .kr-page-gap', () => { assert.deepEqual(start.seq, ['prev', '1', '2', '3', '…', '15', 'next']); assert.ok(startMarks.gaps >= 1 && startMarks.hidden >= 1, JSON.stringify(startMarks)); });
    await p.evaluate(() => document.body.classList.remove('mobile-mode'));
    // Lot E (QA du lot A, S1) : un redessin DataTables reconstruit les boutons, ce qui effaçait le masquage sans passer par compactPagination
    // (le retrait des .kr-page-hidden au bureau pouvait disparaître sans qu'aucune vérification échoue). draw.dt seul, sur les boutons EXISTANTS
    // (déjà masqués par le mobile) : c'est le gestionnaire draw.dt du script qui doit retirer le masquage et le « … » du projet.
    await redraw(p, () => p.evaluate(() => window.jQuery('#topics').trigger('draw.dt')), 'draw.dt sans reconstruction');
    const kept = await p.evaluate(MARKS);
    check('transition mobile -> bureau, draw.dt sans reconstruction des boutons : compactPagination retire lui-même masquage et marqueurs, « … » natif rétabli', () => assert.deepEqual(kept, { gaps: 0, hidden: 0, ellipsis: 1 }));
    await redraw(p, () => p.evaluate(() => document.querySelector('#topics_paginate a.paginate_button[data-dt-idx="1"]').click()));
    const toDesk = await p.evaluate(MARKS);
    check('transition mobile -> bureau (page 2) : marqueurs et classes de masquage retirés, « … » natif conservé (DOM ; le CSS mobile suit la largeur)', () => assert.deepEqual(toDesk, { gaps: 0, hidden: 0, ellipsis: 1 }));
    await p.evaluate(() => document.body.classList.add('mobile-mode'));
    await redraw(p, () => p.evaluate(() => document.querySelector('#topics_paginate a.paginate_button.next').click()));
    const back = await p.evaluate(MARKS);
    check('transition bureau -> mobile : marqueurs et masquage reposés', () => assert.ok(back.gaps >= 1 && back.hidden >= 1, JSON.stringify(back)));
    await context.close();
  }
}

// ---------- L5 M-2 mobile : pagination compacte exacte, un seul « … » par saut, pour les deux formes du « … » natif ----------
if (frag('l5-pagination-m2-mobile')) {
  console.log('L5 M-2 : pagination compacte mobile, « … » natif masqué (deux formes)');
  for (const [kind, html] of ELLIPSIS_KINDS) {
    for (const width of [320, 700]) {
      const { context, page: p } = await open({ width, variant: VARIANT, html });
      await withTools(p);
      const tag = `M-2 ${kind}, ${width} sombre`;
      for (const [pageName, times, seq] of [['page 1', 0, MOBILE_P1], ['page 5', 4, MOBILE_P5], ['page 7', 2, MOBILE_P7], ['page 15', 8, MOBILE_P15]]) {
        if (times) { await goNext(p, times); }
        const m = await p.evaluate(PAGINATION);
        checkPagination(`${tag} ${pageName}`, m, seq);
        check(`${tag} ${pageName} : aucun « … » natif visible (un seul « … » par saut : celui du projet)`, () => { assert.equal(m.nativeEllipsisVisible, 0); assert.equal(m.seq.filter(x => x === '…').length, seq.filter(x => x === '…').length); });
      }
      await context.close();
    }
  }
}

// ---------- L5 M-2 bureau : pagination native exacte, pour les deux formes du « … » natif ----------
if (frag('l5-pagination-m2-bureau')) {
  console.log('L5 M-2 : pagination native au bureau (deux formes du « … »)');
  for (const [kind, html] of ELLIPSIS_KINDS) {
    for (const width of [768, 1280]) {
      const { context, page: p } = await open({ width, variant: VARIANT, html });
      await withTools(p);
      const tag = `M-2 ${kind}, ${width} sombre`;
      checkNative(`${tag} page 1`, await p.evaluate(PAGINATION), await p.evaluate(MARKS), NATIVE_P1);
      await goNext(p, 6);
      checkNative(`${tag} page 7`, await p.evaluate(PAGINATION), await p.evaluate(MARKS), NATIVE_P7);
      await goNext(p, 8);
      checkNative(`${tag} page 15`, await p.evaluate(PAGINATION), await p.evaluate(MARKS), NATIVE_P15);
      await context.close();
    }
  }
}

// ---------- L5 vraies transitions de viewport (setViewportSize) : le projet recharge la page au franchissement de 768 px ----------
if (frag('l5-pagination-viewport')) {
  console.log('L5 M-2 : vraies transitions de viewport (rechargement)');
  const reloaded = async (p, state, docs) => {
    // Attendre le load du NOUVEAU document (compteur state.loads) avant le marqueur : html[data-kr-ready] de l'ancien document, encore
    // affiché entre la requête et la validation de la navigation, ferait passer l'attente trop tôt.
    const t0 = Date.now();
    while ((state.documents < docs || state.loads < docs) && Date.now() - t0 < 10000) { await p.waitForTimeout(50); }
    await krReady(p, { ready: THEME_READY, label: 'rechargement après redimensionnement' });
    await withTools(p);
    return state.documents;
  };
  for (const [kind, html] of [['span sans classe', FIXTURE], ['span.ellipsis', FIXTURE_CLASSED]]) {
    const tag = `M-2 vraie transition de viewport, ${kind}, sombre`;
    const { context, page: p, state } = await open({ width: 375, variant: VARIANT, html });
    await withTools(p);
    await p.setViewportSize({ width: 1280, height: 800 });
    const docs1 = await reloaded(p, state, 2);
    const desk = await p.evaluate(PAGINATION);
    const deskMarks = await p.evaluate(MARKS);
    check(`${tag} : 375 -> 1280 recharge la page (2 documents) et affiche la pagination native exacte`, () => { assert.equal(docs1, 2); assert.deepEqual(desk.seq, NATIVE_P1); assert.deepEqual(deskMarks, { gaps: 0, hidden: 0, ellipsis: 1 }); assert.equal(desk.overflowX, 0); });
    await goNext(p, 6);
    const desk7 = await p.evaluate(PAGINATION);
    check(`${tag} : 1280 page 7 = séquence native exacte`, () => assert.deepEqual(desk7.seq, NATIVE_P7));
    // Le garde-fou natif n'autorise un nouveau rechargement que 1200 ms après le précédent (comme messages-v3#transitions) : attendre
    // cette condition, la fin d'initialisation pouvant arriver avant (lot B : plus de fenêtre de calme qui la masquait).
    await p.waitForFunction(() => {
      const log = JSON.parse(sessionStorage.getItem('kr-breakpoint-reload-log') || '[]');
      return log.length > 0 && Date.now() - log[log.length - 1] >= 1200;
    });
    await p.setViewportSize({ width: 320, height: 640 });
    const docs2 = await reloaded(p, state, 3);
    const mob = await p.evaluate(PAGINATION);
    check(`${tag} : 1280 -> 320 recharge la page (3 documents) et affiche la pagination compacte exacte, sans « … » natif ni débordement`, () => { assert.equal(docs2, 3); assert.deepEqual(mob.seq, MOBILE_P1); assert.equal(mob.nativeEllipsisVisible, 0); assert.equal(mob.overflowX, 0); });
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

// ---------- L6 : desktop (tableau natif conservé, restylé : hiérarchie des titres, chiffres alignés, nom + date, flèche de 32 px, permanents compacts) ----------
const DESK = () => {
  const t = window.__krColorTools(); const vt = window.__krVisibleText;
  const rect = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom + window.scrollY) }; };
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const ratio = e => { const bg = t.bgOf(e); return t.round(t.ratio(t.fgOn(e, bg), bg)); };
  const rowInfo = tr => {
    const title = tr.querySelector('td:first-child p a'); const lock = tr.querySelector('td:first-child p i.fa-lock');
    const folderBox = tr.querySelector('td:first-child > ul.pagination:first-of-type');
    const msg = tr.querySelector('td:nth-child(2)'); const views = tr.querySelector('td:nth-child(3)');
    const au = tr.querySelector('td:nth-child(4) > a.nomargin'); const auDate = tr.querySelector('td:nth-child(4) > p');
    const la = tr.querySelector('td:nth-child(5) > a.nomargin'); const laDate = tr.querySelector('td:nth-child(5) > p.mini'); const arrow = tr.querySelector('td:nth-child(5) .btn-group > a.btn');
    const r = rect(tr);
    return {
      title: title.textContent.trim(), unread: tr.classList.contains('kr-topic-unread'), newmsg: tr.classList.contains('kr-topic-newmsg'), locked: !!lock, lockVisible: !!lock && vis(lock),
      row: r, folderHidden: !folderBox || !vis(folderBox),
      titleWeight: Number(getComputedStyle(title).fontWeight), titleSize: parseFloat(getComputedStyle(title).fontSize),
      titleRgb: getComputedStyle(title).color,
      numAlign: [getComputedStyle(msg).textAlign, getComputedStyle(views).textAlign], numRight: [rect(msg).r, rect(views).r], numTabular: getComputedStyle(msg).fontVariantNumeric.includes('tabular'),
      auWeight: Number(getComputedStyle(au).fontWeight), laWeight: Number(getComputedStyle(la).fontWeight),
      auRatio: ratio(au), laRatio: ratio(la), auDateRatio: ratio(auDate), laDateRatio: ratio(laDate),
      auBelow: rect(auDate).y >= rect(au).b - 2, laBelow: rect(laDate).y >= rect(la).b - 2,
      arrow: rect(arrow), arrowInRow: rect(arrow).y >= r.y && rect(arrow).b <= r.b, arrowRatio: ratio(arrow.querySelector('i') || arrow), arrowHref: arrow.getAttribute('href'),
      arrowHit: (() => { const ar = arrow.getBoundingClientRect(); window.scrollTo(0, Math.max(0, ar.top + window.scrollY - window.innerHeight / 2)); const rr = arrow.getBoundingClientRect(); const el = document.elementFromPoint(rr.left + rr.width / 2, rr.top + rr.height / 2); return el && el.closest('a') && el.closest('a').getAttribute('href'); })(),
      titleRatio: ratio(title), lockRatio: lock && vis(lock) ? ratio(lock) : null,
      badgeVisible: !!tr.querySelector('.kr-topic-badge') && vis(tr.querySelector('.kr-topic-badge')), text: vt(tr)
    };
  };
  const perm = [...document.querySelectorAll('#fx-permanents tbody tr')].map(rowInfo);
  const reg = [...document.querySelectorAll('#topics tbody tr')].slice(0, 10).map(rowInfo);
  window.scrollTo(0, 0);
  return {
    iw: window.innerWidth, ih: window.innerHeight, overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    perm, reg, firstRegularY: reg[0].row.y,
    heads: [...document.querySelectorAll('#topics thead th')].map(th => ({ text: th.textContent.trim(), ...rect(th), vis: vis(th), cls: th.className })),
    bodyBg: t.bgOf(document.body)
  };
};

const checkDesk = (label, m, strict) => {
  const all = [...m.perm, ...m.reg];
  const bad = pred => JSON.stringify(all.filter(r => !pred(r)).map(r => r.title)).slice(0, 300);
  check(`${label} : 5 permanents et 10 lignes de la liste, tableau natif conservé, 5 en-têtes de tri visibles`, () => { assert.equal(m.perm.length, 5); assert.equal(m.reg.length, 10); assert.equal(m.heads.length, 5); assert.ok(m.heads.every(h => h.vis && h.h >= 30), JSON.stringify(m.heads)); });
  check(`${label} : titres de 15 px, en gras s'ils sont non lus ou lus en partie et en normal sinon`, () => assert.ok(all.every(r => r.titleSize === 15 && ((r.unread || r.newmsg) ? r.titleWeight >= 700 : r.titleWeight <= 500)), bad(r => r.titleSize === 15 && ((r.unread || r.newmsg) ? r.titleWeight >= 700 : r.titleWeight <= 500))));
  check(`${label} : titres en couleur de texte du thème (plus en couleur de lien), contraste >= 4,5:1`, () => assert.ok(all.every(r => r.titleRatio >= 4.5), bad(r => r.titleRatio >= 4.5)));
  check(`${label} : pastille NON LU si non lu, NOUVEAU MESSAGE si lu en partie, aucune sinon ; cadenas visible si verrouillé, icône dossier native masquée`, () => assert.ok(all.every(r => r.badgeVisible === (r.unread || r.newmsg) && r.lockVisible === r.locked && r.folderHidden && (!r.unread || r.text.includes('NON LU')) && (r.text.includes('NOUVEAU MESSAGE') === r.newmsg)), bad(r => r.badgeVisible === (r.unread || r.newmsg) && r.lockVisible === r.locked && r.folderHidden && (r.text.includes('NOUVEAU MESSAGE') === r.newmsg))));
  check(`${label} : chiffres (Msg, Vus) alignés à droite, chiffres tabulaires, mêmes bords droits sur toutes les lignes d'un tableau`, () => { assert.ok(all.every(r => r.numAlign[0] === 'right' && r.numAlign[1] === 'right' && r.numTabular)); const R = rows => new Set(rows.map(r => r.numRight.join(','))).size; assert.equal(R(m.perm), 1); assert.equal(R(m.reg), 1); });
  check(`${label} : auteur et dernier message = nom en gras, date secondaire en dessous (>= 4,5:1)`, () => assert.ok(all.every(r => r.auWeight >= 600 && r.laWeight >= 600 && r.auBelow && r.laBelow && Math.min(r.auRatio, r.laRatio, r.auDateRatio, r.laDateRatio) >= 4.5), bad(r => r.auWeight >= 600 && r.auBelow && r.laBelow && Math.min(r.auRatio, r.laRatio, r.auDateRatio, r.laDateRatio) >= 4.5)));
  check(`${label} : flèche « dernier message » de 32 x 32, dans la ligne, mène au dernier message, icône >= 4,5:1`, () => assert.ok(all.every(r => r.arrow.w === 32 && r.arrow.h === 32 && r.arrowInRow && r.arrowHit === r.arrowHref && r.arrowRatio >= 4.5), bad(r => r.arrow.w === 32 && r.arrow.h === 32 && r.arrowHit === r.arrowHref && r.arrowRatio >= 4.5)));
  if (strict) {
    check(`${label} : permanents compacts (chaque ligne <= 60 px, tableau des 5 <= 300 px)`, () => { assert.ok(m.perm.every(r => r.row.h <= 60), JSON.stringify(m.perm.map(r => r.row.h))); assert.ok(m.perm[4].row.b - m.perm[0].row.y <= 300, 'tableau ' + (m.perm[4].row.b - m.perm[0].row.y)); });
    check(`${label} : 1er sujet réel dans le premier écran (<= 0,95 de ${m.ih} px)`, () => assert.ok(m.firstRegularY <= 0.95 * m.ih, `${m.firstRegularY} px`));
  }
  check(`${label} : 0 débordement horizontal`, () => assert.equal(m.overflowX, 0));
};

if (frag('l6-desktop')) {
  console.log('L6 : desktop (tableau natif restylé)');
  for (const [width, height] of [[1280, 720]]) {
    const { context, page: p } = await open({ width, height });
    await withTools(p);
    const m = await p.evaluate(DESK);
    if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `sous-forum-bureau-${width}.png`), fullPage: true }); }
    checkDesk(`${width}`, m, true);
    await context.close();
    const c = await open({ width, height });
    await withTools(c.page);
    await REDRAWS[0][1](c.page);
    await settleRedraw(c.page);
    const m2 = await c.page.evaluate(DESK);
    checkDesk(`${width} après page 2`, m2, false);
    await c.context.close();
  }
  {
    const { context, page: p } = await open({ width: 1280, height: 720, late: true });
    await withTools(p);
    checkDesk('1280 (DataTables initialisé après le userscript)', await p.evaluate(DESK), true);
    await context.close();
  }
  {
    // Tri au clic sur un en-tête natif : « Vus » trie bien, la flèche reste à 32 px
    const { context, page: p } = await open({ width: 1280, height: 720 });
    await withTools(p);
    await p.locator('#topics thead th', { hasText: 'Vus' }).click();
    await settleRedraw(p);
    const m = await p.evaluate(DESK);
    check('1280 : clic sur « Vus » : tri natif, première ligne = plus de vues, mise en forme conservée', () => { assert.ok(m.heads.some(h => /sorting_(asc|desc)/.test(h.cls) && /Vus/.test(h.text)), JSON.stringify(m.heads.map(h => [h.text, h.cls]))); });
    checkDesk('1280 après tri « Vus »', m, false);
    await context.close();
  }
}

if (frag('l6-themes')) {
  console.log('L6 : contrastes >= 4,5:1 du tableau desktop sur les 16 thèmes');
  for (const variant of THEMES) {
    const { context, page: p } = await open({ width: 1280, height: 720, variant });
    await withTools(p);
    const m = await p.evaluate(DESK);
    check(`1280 ${variant} : titres, noms, dates, cadenas et flèches >= 4,5:1`, () => { const v = [...m.perm, ...m.reg].flatMap(r => [r.titleRatio, r.auRatio, r.laRatio, r.auDateRatio, r.laDateRatio, r.arrowRatio, r.lockRatio]).filter(x => x !== null); assert.ok(v.length >= 90, 'mesures ' + v.length); assert.ok(Math.min(...v) >= 4.5, 'min ' + Math.min(...v)); });
    await context.close();
  }
}

// ---------- L7 : sujets lus en partie, nouveaux messages (pastille « NOUVEAU MESSAGE », distincte de « NON LU ») ----------
// DOM relevé sur le site (17/10/2026) : jamais ouvert = i.fa.fa-folder ; lu en partie = i.fa.fa-folder-open SANS far (lien de l'icône = premier
// message non lu, forum/sujet/...-1#msgNNN) ; entièrement lu = i.far.fa-folder-open.
const NEWMSG = () => {
  const vt = window.__krVisibleText;
  const rect = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom + window.scrollY) }; };
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const rows = [...document.querySelectorAll('#fx-permanents tbody tr, #topics tbody tr')].filter(tr => tr.querySelector('td:first-child p a[href*="forum/sujet/"]'));
  return {
    iw: window.innerWidth,
    mobile: document.body.classList.contains('mobile-mode'),
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    rows: rows.map(tr => {
      const badge = tr.querySelector('.kr-topic-badge'); const title = tr.querySelector('td:first-child p > a');
      const icon = tr.querySelector('td:first-child > ul.pagination:first-of-type li a'); const arrow = tr.querySelector('td:nth-child(5) a.btn');
      const last = tr.querySelector('td:nth-child(5) > a.nomargin'); const date = tr.querySelector('td:nth-child(5) > p.mini');
      return {
        perm: !!tr.closest('#fx-permanents'), title: title.textContent.trim(),
        unreadIcon: !!tr.querySelector('td:first-child i.fa.fa-folder'), newmsgIcon: !!tr.querySelector('td:first-child i.fa.fa-folder-open:not(.far)'),
        unread: tr.classList.contains('kr-topic-unread'), newmsg: tr.classList.contains('kr-topic-newmsg'),
        badges: tr.querySelectorAll('.kr-topic-badge').length, label: badge ? badge.getAttribute('data-kr-label') : null,
        badge: badge && vis(badge) ? rect(badge) : null, badgeFs: badge ? parseFloat(getComputedStyle(badge).fontSize) : 0,
        row: rect(tr), titleRect: rect(title), titleHref: title.getAttribute('href'), iconHref: icon ? icon.getAttribute('href') : null,
        smart: title.getAttribute('data-smart-redirect'),
        arrow: arrow && vis(arrow) ? rect(arrow) : null, last: last && vis(last) ? rect(last) : null, date: date && vis(date) ? rect(date) : null,
        text: vt(tr)
      };
    })
  };
};

const checkNewmsg = (label, m) => {
  const bad = pred => JSON.stringify(m.rows.filter(r => !pred(r)).map(r => r.title)).slice(0, 300);
  check(`${label} : les trois états sont présents (jamais ouvert, lu en partie, entièrement lu)`, () => { assert.ok(m.rows.some(r => r.unreadIcon)); assert.ok(m.rows.some(r => r.newmsgIcon)); assert.ok(m.rows.some(r => !r.unreadIcon && !r.newmsgIcon)); });
  check(`${label} : états exclusifs, une seule pastille au libellé de l'état (NON LU / NOUVEAU MESSAGE / aucune)`, () => assert.ok(m.rows.every(r => !(r.unread && r.newmsg) && r.unread === r.unreadIcon && r.newmsg === r.newmsgIcon && r.label === expectedLabel(r) && r.badges === (expectedLabel(r) ? 1 : 0)), bad(r => r.label === expectedLabel(r) && r.badges === (expectedLabel(r) ? 1 : 0))));
  check(`${label} : libellé visible en toutes lettres dans la ligne (le statut ne repose pas sur la couleur seule)`, () => assert.ok(m.rows.filter(r => r.newmsgIcon).every(r => r.badge && r.text.includes('NOUVEAU MESSAGE') && !r.text.includes('NON LU')), bad(r => !r.newmsgIcon || (r.badge && r.text.includes('NOUVEAU MESSAGE')))));
  check(`${label} : pastille NOUVEAU MESSAGE entière (une ligne de <= 20 px ; deux lignes « NOUVEAU / MESSAGE » de <= 34 px pour un permanent sous 480 px), dans sa ligne de tableau`, () => assert.ok(m.rows.filter(r => r.newmsgIcon).every(r => r.badge.h <= ((r.perm && m.mobile && m.iw < 480) ? 34 : 20) && r.badge.x >= r.row.x && r.badge.r <= r.row.r && r.badge.y >= r.row.y && r.badge.b <= r.row.b), JSON.stringify(m.rows.filter(r => r.newmsgIcon).map(r => [r.title, r.badge, r.row]))));
  check(`${label} : 0 débordement horizontal`, () => assert.equal(m.overflowX, 0));
  if (m.mobile) {
    const topics = m.rows.filter(r => !r.perm && r.newmsgIcon);
    check(`${label} : liste mobile, la pastille ne passe pas sous le bouton → (44 x 44 conservé)`, () => assert.ok(topics.length > 0 && topics.every(r => r.arrow && r.arrow.w >= 43 && r.arrow.h >= 43 && (r.badge.r <= r.arrow.x || r.badge.b <= r.arrow.y || r.badge.y >= r.arrow.b)), JSON.stringify(topics.map(r => [r.badge, r.arrow]))));
    check(`${label} : liste mobile, ligne 2 « NOUVEAU MESSAGE · Dernier : X, date » coupée proprement (pastille, « Dernier : X, » et date jamais coupés en leur milieu)`, () => assert.ok(topics.every(r => r.last && r.last.h <= 20 && r.date && r.date.h <= 20 && r.badge.h <= 20), JSON.stringify(topics.map(r => [r.title, r.badge, r.last, r.date]))));
    if (m.iw >= 375) {
      check(`${label} : liste mobile, la pastille reste sur la ligne du dernier message (« NOUVEAU MESSAGE · Dernier : X »)`, () => assert.ok(topics.every(r => r.last && Math.abs((r.badge.y + r.badge.h / 2) - (r.last.y + r.last.h / 2)) <= 6), JSON.stringify(topics.map(r => [r.title, r.badge, r.last]))));
    }
    check(`${label} : navigation intelligente, le titre d'un sujet lu en partie mène au premier message non lu (lien de l'icône, #msg)`, () => assert.ok(topics.every(r => r.iconHref && r.titleHref.endsWith(r.iconHref) && /-1#msg\d+$/.test(r.titleHref) && r.smart === 'first-unread'), JSON.stringify(topics.map(r => [r.titleHref, r.iconHref, r.smart]))));
    const perm = m.rows.filter(r => r.perm && r.newmsgIcon);
    check(`${label} : permanent lu en partie sur une ligne de 44 à 48 px, titre encore lisible (>= 80 px avant « … »)`, () => assert.ok(perm.length === 1 && perm.every(r => r.row.h >= 44 && r.row.h <= 48 && r.titleRect.w >= 80), JSON.stringify(perm.map(r => [r.row.h, r.titleRect.w]))));
  }
};

// Pire cas des permanents : verrouillé + lu en partie + date avec l'année (« Bien débuter sur Kraland Interactif », 28/12/25), l'icône est basculée
// en dossier ouvert plein puis un draw.dt relance le module des statuts.
const WORST_PERM = () => {
  const tr = [...document.querySelectorAll('#fx-permanents tbody tr')].find(r => /bien-debuter-sur-kraland-interactif/.test(r.querySelector('td:first-child p > a').getAttribute('href')));
  tr.querySelector('td:first-child > ul.pagination:first-of-type i').className = 'fa fa-folder-open';
  window.jQuery('#topics').trigger('draw.dt');
  const rect = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), y: Math.round(r.top), b: Math.round(r.bottom) }; };
  const badge = tr.querySelector('.kr-topic-badge');
  return { newmsg: tr.classList.contains('kr-topic-newmsg'), locked: tr.classList.contains('kr-topic-locked'), label: badge && badge.getAttribute('data-kr-label'), row: rect(tr), title: rect(tr.querySelector('td:first-child p > a')), badge: rect(badge), date: rect(tr.querySelector('td:nth-child(5) > p.mini')), overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth };
};

if (frag('l7-nouveau')) {
  console.log('L7 : sujets lus en partie (pastille « NOUVEAU MESSAGE »), mobile, bureau et seuils');
  for (const [width, height] of [[320, 568], [375, 667], [767, 800], [768, 800], [769, 800], [1280, 720]]) {
    const { context, page: p, state } = await open({ width, height });
    await withTools(p);
    const m = await p.evaluate(NEWMSG);
    if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `sous-forum-nouveau-message-${width}.png`), fullPage: true }); }
    check(`${width} : mode ${width < 768 ? 'mobile' : 'bureau'}`, () => assert.equal(m.mobile, width < 768));
    checkNewmsg(`${width}`, m);
    check(`${width} : aucune requête hors fixture`, () => assert.deepEqual(state.other, []));
    await context.close();
  }
  for (const width of [320, 375]) {
    const { context, page: p } = await open({ width, height: 667 });
    const w = await p.evaluate(WORST_PERM);
    check(`${width} pire cas : permanent verrouillé + NOUVEAU MESSAGE + date avec l'année sur une ligne de 44 à 48 px, titre >= 40 px, rien hors de la ligne`, () => { assert.ok(w.newmsg && w.locked && w.label === 'NOUVEAU MESSAGE'); assert.ok(w.row.h >= 44 && w.row.h <= 48, 'h ' + w.row.h); assert.ok(w.title.w >= 40, 'titre ' + w.title.w); assert.ok(w.badge.r <= w.date.x && w.date.r <= w.row.r && w.badge.y >= w.row.y && w.badge.b <= w.row.b, JSON.stringify(w)); assert.equal(w.overflowX, 0); });
    await context.close();
  }
  for (const width of [375, 1280]) {
    // Idempotence : l'état change (icône remplacée), le draw.dt suivant met à jour classe et libellé, sans doubler la pastille.
    const { context, page: p } = await open({ width });
    await withTools(p);
    const setIcon = cls => p.evaluate(c => {
      const tr = [...document.querySelectorAll('#topics tbody tr')].find(r => r.querySelector('td:first-child a[href$="gagner-des-pa-334743-1"]'));
      tr.querySelector('td:first-child > ul.pagination:first-of-type i').className = c;
      window.jQuery('#topics').trigger('draw.dt').trigger('draw.dt');
      return { unread: tr.classList.contains('kr-topic-unread'), newmsg: tr.classList.contains('kr-topic-newmsg'), badges: tr.querySelectorAll('.kr-topic-badge').length, label: (tr.querySelector('.kr-topic-badge') || { getAttribute: () => null }).getAttribute('data-kr-label') };
    }, cls);
    const start = await setIcon('fa fa-folder-open');
    check(`${width} idempotence : « Gagner des PA » lu en partie = NOUVEAU MESSAGE, une pastille après deux draw.dt`, () => assert.deepEqual(start, { unread: false, newmsg: true, badges: 1, label: 'NOUVEAU MESSAGE' }));
    const toUnread = await setIcon('fa fa-folder');
    check(`${width} idempotence : passé à jamais ouvert, la pastille devient NON LU (classe kr-topic-unread seule)`, () => assert.deepEqual(toUnread, { unread: true, newmsg: false, badges: 1, label: 'NON LU' }));
    const toRead = await setIcon('far fa-folder-open');
    check(`${width} idempotence : passé à entièrement lu, pastille et classes retirées`, () => assert.deepEqual(toRead, { unread: false, newmsg: false, badges: 0, label: null }));
    const back = await setIcon('fa fa-folder-open');
    check(`${width} idempotence : revenu à lu en partie, NOUVEAU MESSAGE reposé une seule fois`, () => assert.deepEqual(back, { unread: false, newmsg: true, badges: 1, label: 'NOUVEAU MESSAGE' }));
    await context.close();
  }
  {
    const { context, page: p } = await open({ width: 375, late: true });
    await withTools(p);
    checkNewmsg('375 (DataTables initialisé après le userscript)', await p.evaluate(NEWMSG));
    await context.close();
  }
}

// ---------- L8 : raccourci « premier message non lu » sur le titre, bureau et mobile, liste et permanents ----------
// Le site met le lien du premier message non lu (forum/sujet/...-1#msgNNN) sur l'icône dossier d'un sujet lu en partie ; le titre mène à la page 1.
// L'icône est masquée par la refonte : le titre reprend ce lien (data-smart-redirect="first-unread"), sur bureau comme sur mobile, dans #topics comme
// dans les permanents. Un sujet entièrement lu (et un sujet jamais ouvert, dont l'icône mène au début) garde le lien d'origine.
const SHORTCUT = () => [...document.querySelectorAll('#fx-permanents tbody tr, #topics tbody tr')]
  .filter(tr => tr.querySelector('td:first-child p a[href*="forum/sujet/"]'))
  .map(tr => {
    const title = tr.querySelector('td:first-child p > a');
    const icon = tr.querySelector('td:first-child > ul.pagination:first-of-type li a');
    const state = tr.querySelector('td:first-child i.fa.fa-folder') ? 'unread' : (tr.querySelector('td:first-child i.fa.fa-folder-open:not(.far)') ? 'newmsg' : 'read');
    return { perm: !!tr.closest('#fx-permanents'), name: title.textContent.trim(), state, titleHref: title.getAttribute('href'), iconHref: icon.getAttribute('href'), smart: title.getAttribute('data-smart-redirect') };
  });

const checkShortcut = (label, rows) => {
  const show = list => JSON.stringify(list.map(r => [r.name, r.titleHref, r.smart])).slice(0, 400);
  for (const [where, perm] of [['liste', false], ['permanents', true]]) {
    const part = rows.filter(r => r.perm === perm);
    const partial = part.filter(r => r.state === 'newmsg');
    const others = part.filter(r => r.state !== 'newmsg');
    check(`${label} ${where} : au moins un sujet lu en partie et un autre état`, () => { assert.ok(partial.length > 0, 'aucun lu en partie'); assert.ok(others.length > 0, 'aucun autre état'); });
    check(`${label} ${where} : titre d'un sujet lu en partie = premier message non lu (…-1#msgNNN, lien de l'icône, data-smart-redirect=first-unread)`, () => assert.ok(partial.every(r => r.titleHref === r.iconHref && /^forum\/sujet\/[^#]+-1#msg\d+$/.test(r.titleHref) && r.smart === 'first-unread'), show(partial)));
    check(`${label} ${where} : sujet lu ou jamais ouvert inchangé (page 1, sans #msg ni data-smart-redirect)`, () => assert.ok(others.every(r => /^forum\/sujet\/[^#]+-1$/.test(r.titleHref) && r.smart === null), show(others)));
  }
};

if (frag('l8-raccourci')) {
  console.log('L8 : titre d\'un sujet lu en partie = premier message non lu (bureau, mobile, liste, permanents)');
  for (const [width, height] of [[320, 568], [375, 667], [767, 800], [768, 800], [769, 800], [1280, 720]]) {
    const { context, page: p, state } = await open({ width, height });
    checkShortcut(`${width}`, await p.evaluate(SHORTCUT));
    if (width === 375 || width === 1280) {
      for (const [name, act] of REDRAWS) {
        await redraw(p, () => act(p), name);
        checkShortcut(`${width} après ${name}`, await p.evaluate(SHORTCUT));
      }
    }
    check(`${width} : aucune requête hors fixture`, () => assert.deepEqual(state.other, []));
    await context.close();
  }
  for (const width of [375, 1280]) {
    const { context, page: p } = await open({ width, late: true });
    checkShortcut(`${width} (DataTables initialisé après le userscript)`, await p.evaluate(SHORTCUT));
    await context.close();
  }
  for (const width of [375, 1280]) {
    // Idempotence : DataTables réutilise les <tr> ; le lien suit l'état à chaque draw.dt, revient au lien d'origine et suit un changement de sujet.
    const { context, page: p } = await open({ width });
    const step = (fn) => p.evaluate(src => {
      const tr = window.__krRow || (window.__krRow = [...document.querySelectorAll('#topics tbody tr')].find(r => r.querySelector('td:first-child a[href$="gagner-des-pa-334743-1"]')));
      (0, eval)('(' + src + ')')(tr); // eslint-disable-line no-eval
      window.jQuery('#topics').trigger('draw.dt').trigger('draw.dt');
      const title = tr.querySelector('td:first-child p > a');
      return { href: title.getAttribute('href'), smart: title.getAttribute('data-smart-redirect') };
    }, fn.toString());
    const first = await step(() => {});
    check(`${width} idempotence : « Gagner des PA » lu en partie, deux draw.dt -> premier message non lu`, () => assert.ok(/^forum\/sujet\/gagner-des-pa-334743-1#msg\d+$/.test(first.href) && first.smart === 'first-unread', JSON.stringify(first)));
    const read = await step(tr => { tr.querySelector('td:first-child > ul.pagination:first-of-type i').className = 'far fa-folder-open'; });
    check(`${width} idempotence : devenu entièrement lu -> lien d'origine (page 1), attribut retiré`, () => assert.deepEqual(read, { href: 'forum/sujet/gagner-des-pa-334743-1', smart: null }));
    const back = await step(tr => { tr.querySelector('td:first-child > ul.pagination:first-of-type i').className = 'fa fa-folder-open'; });
    check(`${width} idempotence : redevenu lu en partie -> premier message non lu`, () => assert.deepEqual(back, first));
    // Garde :not(.far) (suggestion S1 de la QA t_451c2edb) : une icône « fa far fa-folder-open » reste un sujet entièrement lu, sans pastille ni raccourci.
    const farFa = await p.evaluate(() => {
      const tr = window.__krRow;
      tr.querySelector('td:first-child > ul.pagination:first-of-type i').className = 'fa far fa-folder-open';
      window.jQuery('#topics').trigger('draw.dt');
      const title = tr.querySelector('td:first-child p > a');
      const out = { href: title.getAttribute('href'), smart: title.getAttribute('data-smart-redirect'), newmsg: tr.classList.contains('kr-topic-newmsg'), unread: tr.classList.contains('kr-topic-unread'), badges: tr.querySelectorAll('.kr-topic-badge').length };
      tr.querySelector('td:first-child > ul.pagination:first-of-type i').className = 'fa fa-folder-open';
      window.jQuery('#topics').trigger('draw.dt');
      return out;
    });
    check(`${width} idempotence : icône « fa far fa-folder-open » = entièrement lu (ni classe, ni pastille, ni raccourci)`, () => assert.deepEqual(farFa, { href: 'forum/sujet/gagner-des-pa-334743-1', smart: null, newmsg: false, unread: false, badges: 0 }));
    const moved = await step(tr => { tr.querySelector('td:first-child p > a').setAttribute('href', 'forum/sujet/autre-sujet-999-1'); tr.querySelector('td:first-child > ul.pagination:first-of-type li a').setAttribute('href', 'forum/sujet/autre-sujet-999-1#msg42'); });
    check(`${width} idempotence : la ligne change de sujet (lien réécrit) -> premier non lu du nouveau sujet`, () => assert.deepEqual(moved, { href: 'forum/sujet/autre-sujet-999-1#msg42', smart: 'first-unread' }));
    const movedRead = await step(tr => { tr.querySelector('td:first-child > ul.pagination:first-of-type i').className = 'far fa-folder-open'; tr.querySelector('td:first-child > ul.pagination:first-of-type li a').setAttribute('href', 'forum/sujet/autre-sujet-999-1'); });
    check(`${width} idempotence : nouveau sujet devenu lu -> son propre lien d'origine, pas celui de l'ancien sujet`, () => assert.deepEqual(movedRead, { href: 'forum/sujet/autre-sujet-999-1', smart: null }));
    const rebuilt = await step(tr => { tr.cells[0].innerHTML = tr.cells[0].innerHTML.replace(/autre-sujet-999-1(#msg\d+)?/g, 'remplace-777-1').replace('far fa-folder-open', 'fa fa-folder-open').replace(/(<li><a href="forum\/sujet\/remplace-777-1)"/, '$1#msg7"'); });
    check(`${width} idempotence : cellule reconstruite (nouveaux nœuds) -> premier non lu du sujet reconstruit`, () => assert.deepEqual(rebuilt, { href: 'forum/sujet/remplace-777-1#msg7', smart: 'first-unread' }));
    await context.close();
  }
  for (const width of [375, 1280]) {
    // Activation : clic, ctrl/cmd-clic, clic milieu (et, sur mobile, clic sur la ligne hors lien) mènent au premier message non lu ; rien n'annule le geste natif.
    const { context, page: p } = await open({ width });
    await p.evaluate(() => {
      window.__nav = [];
      const rec = e => { const a = e.target.closest && e.target.closest('a'); window.__nav.push({ type: e.type, href: a ? a.getAttribute('href') : null, prevented: e.defaultPrevented, ctrl: e.ctrlKey, meta: e.metaKey, button: e.button }); e.preventDefault(); };
      window.addEventListener('click', rec); window.addEventListener('auxclick', rec);
    });
    const target = (perm) => p.evaluate(isPerm => {
      const sel = isPerm ? '#fx-permanents tbody tr' : '#topics tbody tr';
      const tr = [...document.querySelectorAll(sel)].find(r => r.querySelector('td:first-child i.fa.fa-folder-open:not(.far)'));
      return tr.querySelector('td:first-child > ul.pagination:first-of-type li a').getAttribute('href');
    }, perm);
    for (const perm of [false, true]) {
      const where = perm ? 'permanent' : 'liste';
      const sel = `${perm ? '#fx-permanents' : '#topics'} tbody tr:has(td:first-child i.fa.fa-folder-open:not(.far)) td:first-child p > a`;
      const expected = await target(perm);
      const link = p.locator(sel).first();
      await link.scrollIntoViewIfNeeded();
      await p.evaluate(() => { window.__nav = []; });
      await link.click();
      await link.click({ modifiers: ['ControlOrMeta'] });
      if (width >= 768) { await link.click({ button: 'middle' }); }
      const nav = await p.evaluate(() => window.__nav);
      check(`${width} ${where} : clic, ctrl/cmd-clic${width >= 768 ? ' et clic milieu' : ''} sur le titre -> ${expected}, geste natif non annulé`, () => { assert.equal(nav.length, width >= 768 ? 3 : 2, JSON.stringify(nav)); assert.ok(nav.every(n => n.href === expected && !n.prevented), JSON.stringify(nav)); assert.ok(nav[1].ctrl || nav[1].meta); if (width >= 768) { assert.equal(nav[2].button, 1); } });
    }
    if (width < 768) {
      await p.evaluate(() => { window.__nav = []; });
      // Point de la ligne hors de tout lien (mesuré par elementFromPoint, la mise en page mobile superpose les cellules).
      const pt = await p.evaluate(() => {
        const tr = [...document.querySelectorAll('#topics tbody tr')].find(r => r.querySelector('td:first-child i.fa.fa-folder-open:not(.far)'));
        tr.scrollIntoView({ block: 'center' });
        const r = tr.getBoundingClientRect();
        for (let y = r.top + 2; y < r.bottom - 1; y += 3) {
          for (let x = r.left + 2; x < r.right - 1; x += 5) {
            const e = document.elementFromPoint(x, y);
            if (e && tr.contains(e) && !e.closest('a')) { return { x, y }; }
          }
        }
        return null;
      });
      check(`${width} liste : la ligne a une zone hors lien`, () => assert.ok(pt));
      if (pt) { await p.mouse.click(pt.x, pt.y); }
      const nav = await p.evaluate(() => window.__nav);
      const expected = await target(false);
      check(`${width} liste : clic sur la ligne hors lien -> titre activé, premier message non lu`, () => assert.ok(nav.some(n => n.href === expected && !n.prevented), JSON.stringify(nav)));
      // Cellule reconstruite (nouveaux nœuds, autre sujet lu en partie) : le clic de ligne suit le titre actuel, pas l'ancien nœud.
      await p.evaluate(() => {
        const tr = [...document.querySelectorAll('#topics tbody tr')].find(r => r.querySelector('td:first-child i.fa.fa-folder-open:not(.far)'));
        tr.cells[0].innerHTML = tr.cells[0].innerHTML.replace(/forum\/sujet\/[^"#]+-1(#msg\d+)?/g, (m, h) => 'forum/sujet/reconstruit-555-1' + (h ? '#msg55' : ''));
        window.jQuery('#topics').trigger('draw.dt');
        window.__nav = [];
      });
      if (pt) { await p.mouse.click(pt.x, pt.y); }
      const nav2 = await p.evaluate(() => window.__nav).catch(e => [{ error: 'navigation hors écouteur : ' + e.message.split('\n')[0] }]);
      check(`${width} liste : cellule reconstruite, clic sur la ligne -> premier non lu du titre actuel`, () => assert.ok(nav2.some(n => n.href === 'forum/sujet/reconstruit-555-1#msg55' && !n.prevented), JSON.stringify(nav2)));
    }
    await context.close();
  }
  if (SHOTS) {
    for (const [width, height] of [[375, 667], [1280, 720]]) {
      const { context, page: p } = await open({ width, height });
      const box = await p.evaluate(() => {
        const a = document.querySelector('#topics tbody tr.kr-topic-newmsg td:first-child p > a');
        a.scrollIntoView({ block: 'center' }); a.focus();
        const r = a.closest('tr').getBoundingClientRect();
        return { x: 0, y: Math.max(0, r.top - 120), width: window.innerWidth, height: Math.min(window.innerHeight - Math.max(0, r.top - 120), r.height + 240) };
      });
      await p.screenshot({ path: path.join(SHOTS, `sous-forum-raccourci-${width}.png`), clip: box });
      await p.screenshot({ path: path.join(SHOTS, `sous-forum-raccourci-${width}-page.png`), fullPage: true });
      await context.close();
    }
  }
}

await browser.close();
console.log(failures ? `${failures} échec(s)` : 'Tous les contrôles passent');
process.exit(failures ? 1 : 0);
