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
async function open({ width, variant = 'empire-brun-dark', height = 800, url = SUBFORUM, html = FIXTURE, theme = true }) {
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
  await page.goto(BASE + url, { waitUntil: 'load' });
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
  return { parse, ratio, bgOf, fgOn, round: n => Math.round(n * 100) / 100 };
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
      badgeText: badge ? badge.textContent.trim() : null,
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

// Installe les outils de couleur dans la page (une fonction nommée, pour les appels répétés).
const withTools = page => page.evaluate(`(window.__krColorTools = ${COLOR_TOOLS.toString()}, true)`);

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

await browser.close();
console.log(failures ? `${failures} échec(s)` : 'Tous les contrôles passent');
process.exit(failures ? 1 : 0);
