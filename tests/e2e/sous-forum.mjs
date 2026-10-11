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
await browser.close();
console.log(failures ? `${failures} échec(s)` : 'Tous les contrôles passent');
process.exit(failures ? 1 : 0);
