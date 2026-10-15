// Menus Forum RP / HRP / Communauté / Débats / Staff : actualisation depuis la LISTE LATÉRALE NATIVE de la catégorie visitée
// (décision d'Arnaud, carte t_64a83f97 ; source prouvée par t_84f1267a et contrôlée par t_4daa5868).
// Fixtures inertes (aucun réseau réel, aucun compte) : la page de catégorie porte, comme la page native, un tableau « table.table »
// ET une liste latérale « #col-left .list-group > a.list-group-item » (icône .lefticon, titre span.list-group-item.active, href relatifs
// résolus par <base>). Un serveur de fixtures MUTABLE permet de rejouer ancienne liste -> nouvelle liste, ajout, retrait, source dégradée.
//
// Usage : npm run build && node tests/e2e/menus-forums.mjs
// Options : KR_SCRIPT=/chemin/script.user.js ; KR_FRAG=a,b pour ne rejouer que certains blocs (rouge/vert ciblé).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Buffer } from 'node:buffer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { URL } from 'node:url';
import { domQuiet, THEME_READY } from './lib/settle.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const BASE = 'http://www.kraland.org';
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');
const FRAGS = (process.env.KR_FRAG || '').split(',').filter(Boolean);
const frag = name => !FRAGS.length || FRAGS.includes(name);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const NAV = `<nav class="navbar navbar-inverse nomargin"><div class="container">
  <div class="navbar-header"><button class="navbar-toggle collapsed" type="button"><span class="icon-bar"></span></button><a class="navbar-brand" href="/">Kraland</a></div>
  <div id="navbar" class="navbar-collapse collapse"><ul class="nav navbar-nav">
    <li class="dropdown"><a class="dropdown-toggle" href="/jouer/plateau">Jouer</a></li>
    <li class="dropdown"><a class="dropdown-toggle" href="/forum">Forum <span class="caret"></span></a>
      <ul class="dropdown-menu"><li><a href="forum/rp">Jeu (RP)</a></li><li><a href="forum/hrp">Hors jeu</a></li><li><a href="forum/staff">Staff</a></li></ul></li>
    <li class="dropdown"><a class="dropdown-toggle" href="/communaute">Communauté</a></li>
  </ul></div></div></nav>`;
// <base> comme sur le vrai site : les liens relatifs (forum/rp/…) se résolvent depuis la racine, y compris sous /forum/rp/.
// `side` : colonne latérale (#col-left) ; `top` : bloc #col-t (membres, Kramail) servi hors de la colonne, comme le site connecté.
const page = (body, side = '', top = '') => `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><base href="${BASE}/"><meta name="viewport" content="width=device-width, initial-scale=1"><title>fixture</title></head><body>${NAV}${top}<div id="content" class="container"><div class="row">${side}<div id="col-right" class="col-md-9">${body}</div></div></div><footer><div class="container white">pied</div></footer></body></html>`;
// Ligne du tableau natif : titre en p > a, description, modérateurs, compteurs, dernier message avec liens.
const row = (fo) => `<tr><td><p class="nomargin"><a href="${fo.url}">${fo.name}</a></p><p class="nomargin">Description de ${fo.name}</p><div class="mini">Modérateurs : <a href="communaute/membres/modo-1-1">Modo [mod]</a></div></td><td class="center">10 sujets</td><td class="center">100 messages</td><td><a href="communaute/membres/aestus-1-1">Aestus</a> <p class="nomargin mini"><a href="forum/sujet/dernier-1-1#msg1" class="btn btn-default">→</a> Hier (13:20)</p></td></tr>`;
const table = (forums, extra = '') => `<table class="table"><thead><tr><th>Forum</th><th>Sujets</th><th>Messages</th><th>Dernier message</th></tr></thead><tbody>${forums.map(row).join('')}${extra}</tbody></table>`;
const topics = '<table class="table"><thead><tr><th>Sujet</th></tr></thead><tbody><tr><td><a href="forum/sujet/un-sujet-1-1">Un sujet</a></td></tr></tbody></table>';
// Entrée de la liste latérale native : icône dans .lefticon puis libellé.
const item = (fo) => `<a href="${fo.url}" class="list-group-item"><span class="lefticon"><i class="fa fa-comments"></i></span>${fo.name}</a>`;
const sideHtml = (title, inner, before = '') => `<div id="col-left" class="col-md-3 sidebar"><div class="mini-submenu navbar-default"><span class="icon-bar"></span></div>${before}<div class="list-group"><span class="list-group-item active">${title}<span id="slide-submenu"><i class="fa fa-times"></i></span></span>${inner}</div></div>`;
const TITLES = { rp: 'Jeu (RP)', hrp: 'Jeu (HRP)', communaute: 'Communauté', debats: 'Débats', staff: 'Staff' };
const CATS = Object.keys(TITLES);
const f = (n, slug) => ({ name: n, url: `forum/rp/${slug}` });
const normalize = p => p.replace(/\/+$/, '').toLowerCase();
const catOf = key => CATS.find(c => key === '/forum/' + c || key.startsWith('/forum/' + c + '/')) || null;

// Serveur de fixtures : état mutable par test.
function makeServer() {
  const s = {
    lists: { '/forum/rp': [f('Taverne', 'taverne-10101'), f('Marché', 'marche-10102'), f('Monde', 'monde-10103'), f('Alpha', 'alpha-1'), f('Bravo', 'bravo-2')],
      '/forum/hrp': [{ name: 'Annonces', url: 'forum/hrp/annonces-9' }], '/forum/communaute': [{ name: 'Clubs', url: 'forum/communaute/clubs-5' }],
      '/forum/debats': [{ name: 'Politique', url: 'forum/debats/politique-6' }], '/forum/staff': [{ name: 'Modération', url: 'forum/staff/moderation-7' }] },
    tables: {}, // chemin -> forums du TABLEAU quand il diverge de la liste latérale
    extra: {}, // chemin -> lignes HTML ajoutées au tableau
    side: {}, // chemin -> entrées HTML ajoutées à la liste latérale
    raw: {}, // chemin -> entrées HTML qui REMPLACENT celles générées (entrées décorées)
    before: {}, // chemin -> HTML placé dans #col-left avant la liste de la catégorie (bloc joueur, Kramail…)
    colT: '', // bloc #col-t des pages de catégorie
    verbatim: {}, // chemin -> bloc #col-left COPIÉ du site natif (fixtures/forum-colonne-native-*.html), remplace la colonne générée
    mode: {}, // chemin -> 'nosidebar' | 'nolinks' | 'alldisabled' | 'maintenance' | 'http500' | 'redirect'
    hits: {}, // chemin -> nombre de documents servis
    requests: [] // toutes les requêtes servies : { type, path }
  };
  s.handler = async (route) => {
    const u = new URL(route.request().url());
    const p = u.pathname;
    const type = route.request().resourceType();
    if (type !== 'document' && type !== 'fetch' && type !== 'xhr') { return route.abort(); }
    s.hits[p] = (s.hits[p] || 0) + 1;
    s.requests.push({ type, path: p });
    const key = normalize(p);
    const html = (b, side = '', top = '') => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: page(b, side, top) });
    const cat = catOf(key);
    if (cat) {
      const cp = '/forum/' + cat;
      const mode = s.mode[cp];
      const list = s.lists[cp];
      if (mode === 'http500') { return route.fulfill({ status: 500, contentType: 'text/html', body: '<html><body>Erreur</body></html>' }); }
      if (mode === 'redirect') { return html('<h1>Connexion</h1>'); }
      if (mode === 'maintenance') { return html('<h1>Maintenance</h1><p>Indisponible</p>'); }
      const body = key === cp ? table(s.tables[cp] || list, s.extra[cp] || '') : topics;
      if (mode === 'nosidebar') { return html(body, '', s.colT); }
      if (s.verbatim[cp]) { return html(body, s.verbatim[cp], s.colT); }
      let inner = s.raw[cp] !== undefined ? s.raw[cp] : list.map(item).join('');
      if (mode === 'nolinks') { inner = ''; }
      if (mode === 'alldisabled') { inner = list.map(fo => item(fo).replace('class="list-group-item"', 'class="list-group-item disabled"')).join(''); }
      return html(body, sideHtml(TITLES[cat], inner + (s.side[cp] || ''), s.before[cp] || ''), s.colT);
    }
    if (key.startsWith('/forum/sujet/')) { // sujet : DOM non relevé sur le vrai site, la fixture montre la liste d'une catégorie
      return html('<h1>Sujet</h1>', sideHtml(TITLES.hrp, s.lists['/forum/hrp'].map(item).join('')));
    }
    if (key === '/forum') { // index : la liste latérale « Forum » = les catégories (liens sans forum)
      return html('<h1>Forum</h1>', sideHtml('Forum', CATS.map(c => `<a href="forum/${c}" class="list-group-item">${TITLES[c]}</a>`).join('')));
    }
    return html('<h1>Page</h1>');
  };
  return s;
}

const browser = await chromium.launch({ headless: true, executablePath: process.env.KR_CHROMIUM || undefined });

async function open({ width = 1280, variant = 'empire-brun-dark', server, preset = null }) {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height: 800 }, isMobile: mobile, hasTouch: mobile });
  // Route de dernier recours, posée EN PREMIER (Playwright donne priorité à la dernière route) : tout domaine non routé est abandonné (version.json, etc.).
  await context.route('**/*', route => route.abort());
  await context.route(BASE + '/**', server.handler);
  // Images du site : GIF factice, aucune requête réelle vers Kraland.
  await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
  await context.addInitScript(({ src, theme, seed }) => {
    window.GM = { xmlHttpRequest: () => {} };
    localStorage.setItem('kr-theme-enabled', 'true');
    localStorage.setItem('kr-theme-variant', theme);
    if (seed && !sessionStorage.getItem('__seeded')) {
      sessionStorage.setItem('__seeded', '1');
      Object.keys(seed).forEach(k => localStorage.setItem(k, seed[k]));
    }
    // eslint-disable-next-line no-eval
    document.addEventListener('DOMContentLoaded', () => (0, eval)(src));
  }, { src: userscript, theme: variant, seed: preset });
  const p = await context.newPage();
  return { context, p };
}

async function go(p, urlPath) {
  await p.goto(BASE + urlPath, { waitUntil: 'load' });
  await domQuiet(p, { ready: THEME_READY, quietMs: 400, label: urlPath });
}

const MENU_IDS = { rp: 'rp', hrp: 'hrp', communaute: 'forum-communaute', debats: 'forum-debats', staff: 'forum-staff' };
const read = (p, id) => p.evaluate((attr) => {
  const dd = document.querySelector(`[data-forums-added="${attr}"] .dropdown-menu`);
  if (!dd) { return null; }
  return { items: [...dd.querySelectorAll('li:not(.divider) > a')].map(a => [a.textContent.trim(), a.getAttribute('href')]), state: dd.getAttribute('data-kr-forums-state') };
}, MENU_IDS[id]);
const names = m => m.items.map(i => i[0]);
const dynamicRp = async (p) => { const m = await read(p, 'rp'); return { ...m, items: m.items.slice(3) }; };
const waitMenu = (p, id, needle, ms = 8000) => p.waitForFunction(({ attr, text }) => {
  const dd = document.querySelector(`[data-forums-added="${attr}"] .dropdown-menu`);
  return !!dd && [...dd.querySelectorAll('li:not(.divider) > a')].some(a => a.textContent.trim() === text);
}, { attr: MENU_IDS[id], text: needle }, { timeout: ms }).catch(() => check(`menu ${id} : « ${needle} » apparaît`, () => { throw new Error('jamais apparu en ' + ms + ' ms'); }));
const SET = (s, path_, forums) => { s.lists[path_] = forums; };
const stored = (p, id) => p.evaluate((k) => JSON.parse(localStorage.getItem('kr-forums-v2-' + k)), id);
const DAY = 24 * 60 * 60 * 1000;

// ---------- A : ancienne liste -> nouvelle liste (ajout + retrait), sur la page de catégorie, navigation, rechargement ----------
if (frag('a')) {
  console.log('A : ancienne liste -> nouvelle liste (ajout + retrait)');
  const s = makeServer();
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp');
  let m = await dynamicRp(p);
  check('page de catégorie : Alpha et Bravo dans le menu RP', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Bravo']));
  await go(p, '/jouer/plateau');
  m = await dynamicRp(p);
  check('navigation : le menu RP garde A', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Bravo']));
  // La liste native change : Bravo disparaît (accès perdu), Charlie apparaît.
  SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Alpha', 'alpha-1'), f('Charlie', 'charlie-3')]);
  await go(p, '/forum/rp');
  m = await dynamicRp(p);
  check('page de catégorie : DÈS le premier affichage, Bravo retiré et Charlie ajouté (pas un décalage d\'une page)', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Charlie']));
  check('destinations suivent la source native', () => assert.deepEqual(m.items.map(i => i[1]), ['forum/rp/alpha-1', 'forum/rp/charlie-3']));
  await go(p, '/jouer/plateau');
  m = await dynamicRp(p);
  check('navigation suivante : pas de retour de Bravo', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Charlie']));
  await p.reload({ waitUntil: 'load' });
  await domQuiet(p, { ready: THEME_READY, quietMs: 400, label: 'reload' });
  m = await dynamicRp(p);
  check('rechargement : pas de retour de Bravo', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Charlie']));
  const st = (await read(p, 'rp')).items.slice(0, 3).map(i => i[0]);
  check('éléments statiques (Taverne, Marché, Monde) conservés en tête', () => assert.deepEqual(st, ['Taverne', 'Marché', 'Monde']));
  await context.close();
}

// ---------- B : libellés, regroupements, doublons, chemins ----------
if (frag('b')) {
  console.log('B : libellés, doublons, exclusions par nom exact, chemins');
  const s = makeServer();
  SET(s, '/forum/rp', [f('Alpha', 'alpha-1'), f('Alpha (doublon)', 'alpha-1'), f('Le Monde de Kraland', 'lemonde-4'), f('Monde', 'monde-10103'), f('Débats  ', 'x')]);
  SET(s, '/forum/hrp', [{ name: 'Annonces', url: 'forum/hrp/annonces-9' }, { name: 'Staff & Co', url: 'forum/hrp/staff-co-11' }]);
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp/'); // barre finale
  let m = await dynamicRp(p);
  check('barre finale /forum/rp/ : la catégorie est reconnue', () => assert.equal(m.items.length > 0, true));
  check('doublon de destination fusionné ; « Le Monde de Kraland » n\'est plus exclu par sous-chaîne ; « Monde » et « Débats » exacts exclus', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Le Monde de Kraland']));
  await go(p, '/forum/hrp');
  m = await read(p, 'hrp');
  check('HRP : aucun filtrage par nom (« Staff & Co » conservé)', () => assert.deepEqual(names(m), ['Annonces', 'Staff & Co']));
  await go(p, '/forum/communaute');
  await go(p, '/forum/debats');
  await go(p, '/forum/staff');
  await go(p, '/jouer/plateau');
  for (const [id, expected] of [['communaute', ['Clubs']], ['debats', ['Politique']], ['staff', ['Modération']]]) {
    const mi = await read(p, id);
    check(`menu ${id} suit sa propre catégorie`, () => assert.deepEqual(names(mi), expected));
  }
  await context.close();
}

// ---------- C : catégorie dont tous les liens sont déjà dans le menu d'origine ----------
if (frag('c')) {
  console.log('C : liste lue, aucun forum à ajouter (Taverne/Marché/Monde seulement)');
  const s = makeServer();
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp');
  SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Marché', 'marche-10102'), f('Monde', 'monde-10103')]);
  await go(p, '/forum/rp');
  let m = await dynamicRp(p);
  check('menu RP : plus aucun forum dynamique, lien de repli vers la page de catégorie', () => assert.deepEqual(m.items, [['Autre', 'forum/rp']]));
  check('état « empty » (liens lus, aucun à ajouter) et non « unavailable »', () => assert.equal(m.state, 'empty'));
  await go(p, '/jouer/plateau');
  m = await dynamicRp(p);
  check('navigation : la liste reste vide (Alpha/Bravo ne reviennent pas)', () => assert.deepEqual(m.items, [['Autre', 'forum/rp']]));
  await context.close();
}

// ---------- D : source absente, illisible ou ambiguë != liste vide ----------
if (frag('d')) {
  console.log('D : liste latérale absente, sans lien, désactivée ou page dégradée : dernière liste connue conservée');
  for (const [label, mode] of [['pas de colonne latérale (tableau seul)', 'nosidebar'], ['page de maintenance', 'maintenance'], ['liste latérale sans aucun lien', 'nolinks'], ['tous les liens désactivés (état ambigu)', 'alldisabled'], ['réponse 500', 'http500'], ['page de connexion', 'redirect']]) {
    const s = makeServer();
    const { context, p } = await open({ server: s });
    await go(p, '/forum/rp');
    s.mode['/forum/rp'] = mode;
    await go(p, '/forum/rp');
    const mb = mode === 'http500' ? null : await dynamicRp(p); // la page d'erreur n'a pas de barre de navigation : pas de menu à lire
    if (mb) { check(`${label} : la dernière liste connue est conservée (pas vidée)`, () => { assert.deepEqual(mb.items.map(i => i[0]), ['Alpha', 'Bravo']); assert.equal(mb.state, 'fresh'); }); }
    const kept = await stored(p, 'rp');
    check(`${label} : stockage inchangé (liste non effacée)`, () => assert.deepEqual(kept.forums.map(x => x.name), ['Alpha', 'Bravo']));
    await context.close();
  }
  // Entrées ambiguës parmi des entrées valides : ignorées, les autres sont lues et remplacent la liste.
  {
    const s = makeServer();
    const { context, p } = await open({ server: s });
    await go(p, '/forum/rp');
    SET(s, '/forum/rp', [{ name: 'Charlie', url: 'forum/rp/charlie-3' }]);
    s.side['/forum/rp'] = '<a name="x" class="list-group-item">Sans destination</a><a href="forum/rp/niark-9" class="list-group-item disabled"><span class="lefticon"><i class="fa fa-ban"></i></span>Province Niarkalistan</a><a href="forum/rp/niark-10" class="list-group-item" aria-disabled="true">Autre grisée</a>';
    await go(p, '/forum/rp');
    const mb = await dynamicRp(p);
    check('ancre sans href et entrées désactivées ignorées, Charlie lu (limite documentée : une entrée grisée accessible n\'est pas proposée)', () => assert.deepEqual(mb.items.map(i => i[0]), ['Charlie']));
    await context.close();
  }
  // Page non source : aucune relecture réseau. Une liste de 2 jours reste affichée, marquée « stale », sans aucune requête vers la source.
  {
    const s = makeServer();
    const old = JSON.stringify({ v: 2, at: Date.now() - 2 * DAY, forums: [{ name: 'Ancien', url: 'forum/rp/ancien-1' }] });
    const { context, p } = await open({ server: s, preset: { 'kr-forums-v2-rp': old } });
    await go(p, '/jouer/plateau');
    await p.waitForTimeout(600); // fenêtre bornée : l'absence de requête n'a pas de condition positive
    const m = await dynamicRp(p);
    check('liste de 2 jours hors catégorie : conservée, état stale, jamais confondue avec une liste vide', () => { assert.deepEqual(m.items.map(i => i[0]), ['Ancien']); assert.equal(m.state, 'stale'); });
    check('aucune requête réseau vers les pages de forum depuis une autre page', () => assert.deepEqual(Object.keys(s.hits).filter(k => k.startsWith('/forum')), []));
    await context.close();
  }
  // Plus de 7 jours : plus proposée.
  {
    const s = makeServer();
    s.mode['/forum/rp'] = 'http500';
    const old = JSON.stringify({ v: 2, at: Date.now() - 8 * DAY, forums: [{ name: 'Périmé', url: 'forum/rp/perime-1' }] });
    const { context, p } = await open({ server: s, preset: { 'kr-forums-v2-rp': old } });
    await go(p, '/jouer/plateau');
    const m = await dynamicRp(p);
    check('liste de plus de 7 jours : non proposée, repli explicite, état « unavailable »', () => { assert.deepEqual(m.items, [['Autre', 'forum/rp']]); assert.equal(m.state, 'unavailable'); });
    await context.close();
  }
  // Ancien format nu (tableau sans date) : c'est la liste « figée » du signalement.
  {
    const s = makeServer();
    s.mode['/forum/rp'] = 'http500';
    const { context, p } = await open({ server: s, preset: { 'kr-forums-rp': JSON.stringify([{ name: 'Figé', url: 'forum/rp/fige-1' }]) } });
    await go(p, '/jouer/plateau');
    const m = await dynamicRp(p);
    check('ancien format sans date ignoré (aucune provenance) : repli, pas de « Figé »', () => assert.deepEqual(m.items, [['Autre', 'forum/rp']]));
    const legacy = await p.evaluate(() => localStorage.getItem('kr-forums-rp'));
    check('ancienne clé supprimée', () => assert.equal(legacy, null));
    await context.close();
  }
}

// ---------- E : second onglet, mise à jour par l'événement storage ----------
if (frag('e')) {
  console.log('E : un autre onglet met la liste à jour');
  const s = makeServer();
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp');
  await go(p, '/jouer/plateau');
  SET(s, '/forum/rp', [f('Delta', 'delta-4')]);
  const p2 = await context.newPage();
  await go(p2, '/forum/rp/delta-4');
  await waitMenu(p, 'rp', 'Delta');
  const m = await dynamicRp(p);
  check('premier onglet redessiné sans rechargement : Delta ajouté, Alpha et Bravo retirés', () => assert.deepEqual(m.items.map(i => i[0]), ['Delta']));
  await context.close();
}

// ---------- F : bureau / mobile, thèmes ----------
if (frag('f')) {
  console.log('F : bureau et mobile, thèmes');
  for (const width of [1280, 375]) {
    for (const variant of ['empire-brun-dark', 'empire-brun']) {
      const s = makeServer();
      const { context, p } = await open({ width, variant, server: s });
      await go(p, '/forum/rp');
      SET(s, '/forum/rp', [f('Zeta', 'zeta-9')]);
      await go(p, '/forum/rp/zeta-9'); // sous-forum : la liste latérale y est aussi lue
      const m = await dynamicRp(p);
      const mobileMode = await p.evaluate(() => document.body.classList.contains('mobile-mode'));
      check(`${width} / ${variant} : mode ${width < 768 ? 'mobile' : 'bureau'} et menu à jour depuis un sous-forum (Zeta)`, () => { assert.equal(mobileMode, width < 768); assert.deepEqual(m.items.map(i => i[0]), ['Zeta']); });
      const dupes = await p.evaluate(() => ['rp', 'hrp', 'forum-communaute', 'forum-debats', 'forum-staff'].map(a => document.querySelectorAll(`[data-forums-added="${a}"]`).length));
      check(`${width} / ${variant} : un seul exemplaire de chaque menu`, () => assert.deepEqual(dupes, [1, 1, 1, 1, 1]));
      // Le gabarit de la fixture déborde de lui-même (barre de navigation sans Bootstrap complet) : on vérifie que le CONTENU des menus n'ajoute rien.
      const overflow = await p.evaluate(() => {
        const w = () => document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const withItems = w();
        document.querySelectorAll('[data-forums-added] .dropdown-menu').forEach(d => { d.innerHTML = ''; });
        return withItems - w();
      });
      check(`${width} / ${variant} : les éléments des menus n'ajoutent aucun débordement horizontal`, () => assert.ok(overflow <= 0, String(overflow)));
      await context.close();
    }
  }
}

// ---------- G : liste du personnage précédent, même navigateur, bornée à 7 jours ----------
if (frag('g')) {
  console.log('G : même navigateur, autre personnage : liste précédente bornée à 7 jours');
  const s = makeServer();
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp'); // personnage A : Alpha, Bravo
  SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Zoulou', 'zoulou-26')]); // personnage B, même navigateur
  await go(p, '/jouer/plateau');
  let m = await dynamicRp(p);
  check('hors catégorie : la liste du personnage précédent reste affichée (non isolée, décision d\'Arnaud : le personnage ne compte pas)', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Bravo']));
  await go(p, '/forum/rp');
  m = await dynamicRp(p);
  check('visite de la catégorie : la liste affichée remplace celle du précédent', () => assert.deepEqual(m.items.map(i => i[0]), ['Zoulou']));
  // La liste mémorisée date de 8 jours : plus proposée.
  await p.evaluate(() => { const k = 'kr-forums-v2-rp'; const d = JSON.parse(localStorage.getItem(k)); d.at = Date.now() - 8 * 24 * 60 * 60 * 1000; localStorage.setItem(k, JSON.stringify(d)); });
  await go(p, '/jouer/plateau');
  m = await dynamicRp(p);
  check('liste de plus de 7 jours dans le même navigateur : plus proposée', () => { assert.deepEqual(m.items, [['Autre', 'forum/rp']]); assert.equal(m.state, 'unavailable'); });
  await context.close();
}

// ---------- H : retour du cache de navigation (pageshow persisted) sur un ancien DOM ----------
if (frag('h')) {
  console.log('H : pageshow persisted ne réécrit pas une liste plus récente');
  const s = makeServer();
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp'); // onglet 1 : DOM avec Alpha, Bravo
  SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Charlie', 'charlie-3')]);
  const p2 = await context.newPage();
  await go(p2, '/forum/rp/charlie-3'); // onglet 2 : Charlie, plus récent
  await waitMenu(p, 'rp', 'Charlie');
  const before = await p.evaluate(() => JSON.parse(localStorage.getItem('kr-forums-v2-rp')));
  // Le navigateur émet cet événement à la restauration depuis le cache de navigation ; sous route il est inerte, on le rejoue.
  await p.evaluate(() => window.dispatchEvent(new window.PageTransitionEvent('pageshow', { persisted: true })));
  await p.waitForTimeout(300);
  const after = await p.evaluate(() => JSON.parse(localStorage.getItem('kr-forums-v2-rp')));
  check('stockage inchangé : Charlie conservé, Bravo absent, date non reculée', () => { assert.deepEqual(after.forums.map(x => x.name), ['Charlie']); assert.equal(after.at, before.at); });
  const m1 = await dynamicRp(p);
  const m2 = await dynamicRp(p2);
  check('onglet resté sur l\'ancien DOM : menu redessiné, Charlie', () => assert.deepEqual(m1.items.map(i => i[0]), ['Charlie']));
  check('autre onglet : menu Charlie', () => assert.deepEqual(m2.items.map(i => i[0]), ['Charlie']));
  // Même en relisant de force l'ancien DOM : une lecture datée du chargement de la page n'écrase jamais une entrée plus récente.
  await p.evaluate(() => { window.updateForumRPMenu(); if (window.captureForumSidebar) { window.captureForumSidebar(true); } });
  const again = await p.evaluate(() => JSON.parse(localStorage.getItem('kr-forums-v2-rp')));
  check('relecture de l\'ancien DOM : entrée plus récente non écrasée', () => assert.deepEqual(again.forums.map(x => x.name), ['Charlie']));
  await context.close();
}

// ---------- I : doublons (statiques, URL absolue, barre finale) ----------
if (frag('i')) {
  console.log('I : doublons de destination, statiques compris');
  const s = makeServer();
  SET(s, '/forum/rp', [f('La Taverne', 'taverne-10101'), f('Alpha', 'alpha-1'), { name: 'Alpha bis', url: 'http://www.kraland.org/forum/rp/alpha-1' }, { name: 'Alpha ter', url: 'forum/rp/alpha-1/' }, f('Marché aux puces', 'marche-10102')]);
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp');
  const m = await read(p, 'rp');
  const paths = await p.evaluate(items => items.map(i => new URL(i[1], document.baseURI).pathname.replace(/\/+$/, '')), m.items);
  check('aucune destination en double (statiques, URL absolue, barre finale)', () => assert.equal(new Set(paths).size, paths.length, JSON.stringify(m.items)));
  check('seul Alpha s\'ajoute aux 3 statiques', () => assert.deepEqual(m.items.slice(3).map(i => i[0]), ['Alpha']));
  await context.close();
}

// ---------- J : entrées atypiques de la liste latérale ----------
if (frag('j')) {
  console.log('J : entrée atypique ignorée, la page n\'est pas invalidée');
  const extras = {
    'lien image sans texte': ['<a href="forum/rp/img-78" class="list-group-item"><img src="x.png" alt=""></a>', 'forum/rp/img-78'],
    'lien vers un autre site portant un chemin de forum': ['<a href="https://exemple.org/forum/rp/pirate-1" class="list-group-item">Pirate</a>', 'pirate'],
    'Kramail et profil dans la colonne': ['<a href="kramail" class="list-group-item ds_game">Kramail (2)</a><a href="communaute/membres/moi-1-1" class="list-group-item">Mon profil</a>', 'membres'],
    'forum d\'une autre catégorie': ['<a href="forum/hrp/intrus-5" class="list-group-item">Intrus HRP</a>', 'intrus'],
    'préfixe voisin (/forum/rpx/…)': ['<a href="forum/rpx/voisin-3" class="list-group-item">Voisin</a>', 'voisin']
  };
  for (const [label, [html, needle]] of Object.entries(extras)) {
    const s = makeServer();
    const { context, p } = await open({ server: s });
    await go(p, '/forum/rp');
    SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Charlie', 'charlie-3')]);
    s.side['/forum/rp'] = html;
    await go(p, '/forum/rp');
    const mj = await dynamicRp(p);
    check(`${label} : Charlie pris, Bravo retiré, entrée écartée`, () => { assert.deepEqual(mj.items.map(i => i[0]), ['Charlie']); assert.ok(!JSON.stringify(mj.items).includes(needle)); });
    await context.close();
  }
}

// ---------- K : entrées décorées (icône, drapeau, badge, pastille de guilde), horloges ----------
if (frag('k')) {
  console.log('K : libellé réel sans décoration, date de lecture murale');
  {
    const s = makeServer();
    s.raw['/forum/rp'] = [
      '<a href="forum/rp/royaume-31" class="list-group-item"><span class="lefticon"><img src="http://img7.kraland.org/s/flag.gif" alt="Drapeau"></span>Royaume de Ruthvénie <span class="badge">3</span></a>',
      '<a href="forum/rp/guilde-32" class="list-group-item"><span class="lefticon"><i class="fa fa-shield"></i></span>Guilde des Marchands <span class="label label-info guilde-pastille">G</span></a>',
      '<a href="forum/rp/province-33" class="list-group-item"><span class="lefticon"><i class="fa fa-flag"></i></span>\n   <strong>Province</strong>\n   Test </a>',
      '<a href="forum/rp/taverne-10101" class="list-group-item"><span class="lefticon"><i class="fa fa-glass"></i></span>Taverne</a>'
    ].join('');
    const { context, p } = await open({ server: s });
    await go(p, '/forum/rp');
    const mk = await dynamicRp(p);
    check('badge, drapeau, icône et pastille de guilde exclus ; le nom « Guilde des Marchands » est conservé en entier', () => assert.deepEqual(mk.items.map(i => i[0]), ['Royaume de Ruthvénie', 'Guilde des Marchands', 'Province Test']));
    const mem = await stored(p, 'rp');
    check('le libellé mémorisé est le libellé nettoyé (ni badge, ni pastille, ni espaces multiples)', () => assert.deepEqual(mem.forums.map(x => x.name), ['Royaume de Ruthvénie', 'Guilde des Marchands', 'Province Test']));
    const dom = await p.evaluate(() => document.querySelectorAll('#col-left .badge, #col-left [class*="guild"]').length);
    check('le DOM natif n\'est pas modifié par la lecture (badge et pastille toujours présents dans la colonne)', () => assert.equal(dom, 2));
    await context.close();
  }
  // Entrée datée de 2 h dans le futur (horloge corrigée en arrière) : la visite de la catégorie la remplace.
  {
    const s = makeServer();
    const future = JSON.stringify({ v: 2, at: Date.now() + 2 * 3600e3, forums: [{ name: 'Ancien', url: 'forum/rp/ancien-1' }] });
    const { context, p } = await open({ server: s, preset: { 'kr-forums-v2-rp': future } });
    await go(p, '/forum/rp');
    const mk = await dynamicRp(p);
    check('entrée datée dans le futur : la page de catégorie la remplace (Alpha, Bravo)', () => assert.deepEqual(mk.items.map(i => i[0]), ['Alpha', 'Bravo']));
    await context.close();
  }
  // performance.timeOrigin en retard (dérive documentée après veille) dans l'onglet qui lit la liste la plus récente.
  {
    const s = makeServer();
    const { context, p } = await open({ server: s });
    await go(p, '/forum/rp'); // Alpha, Bravo mémorisés maintenant
    SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Delta', 'delta-4')]);
    const p2 = await context.newPage();
    await p2.addInitScript(() => { const real = performance.timeOrigin; Object.defineProperty(window.Performance.prototype, 'timeOrigin', { configurable: true, get: () => real - 10 * 3600e3 }); });
    await go(p2, '/forum/rp/delta-4');
    const mk = await dynamicRp(p2);
    check('timeOrigin en retard de 10 h : la liste plus récente (Delta) est mémorisée et affichée', () => assert.deepEqual(mk.items.map(i => i[0]), ['Delta']));
    await context.close();
  }
}

// ---------- L : toute page de la catégorie, catégories indépendantes, aucune requête de plus ----------
if (frag('l')) {
  console.log('L : sous-forum, catégories indépendantes, aucune requête supplémentaire');
  const hrpOld = JSON.stringify({ v: 2, at: Date.now() - 3600e3, forums: [{ name: 'Ancien HRP', url: 'forum/hrp/ancien-hrp-1' }] });
  {
    const s = makeServer();
    const { context, p } = await open({ server: s, preset: { 'kr-forums-v2-hrp': hrpOld } });
    await go(p, '/forum/rp');
    SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Alpha', 'alpha-1'), f('Charlie', 'charlie-3')]);
    s.requests.length = 0;
    await go(p, '/forum/rp/alpha-1'); // un forum de la catégorie, pas la page de catégorie
    let m = await dynamicRp(p);
    check('visite d\'un forum RP : menu RP à jour (Bravo retiré, Charlie ajouté)', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Charlie']));
    check('aucune requête de plus : un seul document, aucun fetch ni XHR', () => assert.deepEqual(s.requests, [{ type: 'document', path: '/forum/rp/alpha-1' }]));
    const hrp = await read(p, 'hrp');
    const hrpStore = await stored(p, 'hrp');
    check('autres catégories inchangées : HRP garde sa liste mémorisée, état fresh', () => { assert.deepEqual(names(hrp), ['Ancien HRP']); assert.equal(hrp.state, 'fresh'); });
    check('autres catégories inchangées : date de lecture HRP intacte', () => assert.equal(hrpStore.at, JSON.parse(hrpOld).at));
    SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Delta', 'delta-4')]);
    await go(p, '/forum/rp/alpha-1/'); // barre finale
    m = await dynamicRp(p);
    check('forum avec barre finale : lu aussi (Delta)', () => assert.deepEqual(m.items.map(i => i[0]), ['Delta']));
    // La visite d'un forum HRP met à jour HRP seulement.
    SET(s, '/forum/hrp', [{ name: 'Annonces', url: 'forum/hrp/annonces-9' }, { name: 'Nouveau HRP', url: 'forum/hrp/nouveau-12' }]);
    await go(p, '/forum/hrp/annonces-9');
    const hrp2 = await read(p, 'hrp');
    m = await dynamicRp(p);
    check('visite d\'un forum HRP : menu HRP à jour', () => assert.deepEqual(names(hrp2), ['Annonces', 'Nouveau HRP']));
    check('visite d\'un forum HRP : menu RP inchangé', () => assert.deepEqual(m.items.map(i => i[0]), ['Delta']));
    await context.close();
  }
  // Pages sans lecture : sujet (DOM non relevé), index du forum, préfixe voisin.
  {
    const s = makeServer();
    const { context, p } = await open({ server: s, preset: { 'kr-forums-v2-hrp': hrpOld } });
    await go(p, '/forum/sujet/un-sujet-1-1'); // la fixture y montre la liste HRP (Annonces)
    await go(p, '/forum');
    await go(p, '/forum/rpx/autre');
    const hrp = await read(p, 'hrp');
    const rp = await dynamicRp(p);
    check('sujet, index /forum et préfixe voisin : aucune lecture (HRP garde « Ancien HRP », RP reste en repli)', () => { assert.deepEqual(names(hrp), ['Ancien HRP']); assert.deepEqual(rp.items, [['Autre', 'forum/rp']]); });
    await context.close();
  }
}

// ---------- M : source unique, le tableau divergent n'est jamais lu (pas d'alternance) ----------
if (frag('m')) {
  console.log('M : liste latérale seule source ; tableau divergent ignoré');
  const s = makeServer();
  s.tables['/forum/rp'] = [f('Taverne', 'taverne-10101'), f('Zed du tableau', 'zed-99')];
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp'); // page de catégorie : tableau ET liste latérale, qui divergent
  let m = await dynamicRp(p);
  check('page de catégorie : le menu suit la liste latérale, pas le tableau', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Bravo']));
  await go(p, '/forum/rp/alpha-1');
  m = await dynamicRp(p);
  check('sous-forum puis catégorie : même liste (aucune alternance tableau/liste)', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Bravo']));
  await go(p, '/forum/rp');
  m = await dynamicRp(p);
  check('retour sur la page de catégorie : toujours la liste latérale', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Bravo']));
  // Liste latérale absente MAIS tableau présent : le tableau ne prend pas le relais.
  s.mode['/forum/rp'] = 'nosidebar';
  await go(p, '/forum/rp');
  m = await dynamicRp(p);
  check('colonne absente, tableau présent : le tableau n\'est pas une source, liste précédente conservée', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Bravo']));
  await context.close();
}

// ---------- N : lecture avant la peau, blocs de la peau et Kramail jamais ingérés ----------
if (frag('n')) {
  console.log('N : transformations de la peau (Kramail, métriques, en-tête joueur) : lecture identique avant et après');
  const colT = '<div id="col-t"><a class="list-group-item ds_users" href="communaute/membres">Membres actifs</a><a class="list-group-item ds_characters" href="communaute/personnages">Personnages actifs</a><a class="list-group-item ds_online" href="forum/rp/intrus-66">Personnes en ligne</a><a href="kramail">Kramail (3)</a></div>';
  const header = '<div class="list-group"><a class="list-group-item ds_game" href="kramail">Kramail (3)</a><a class="list-group-item" href="communaute/membres/moi-1-1">Mon profil</a></div>';
  for (const [label, withHeader] of [['colonne = liste de catégorie seule (anonyme)', false], ['bloc joueur et Kramail avant la liste (compte connecté supposé)', true]]) {
    const s = makeServer();
    s.colT = colT;
    if (withHeader) { s.before['/forum/rp'] = header; }
    const { context, p } = await open({ server: s });
    await go(p, '/forum/rp');
    const skinned = await p.evaluate(() => ({ metrics: !!document.querySelector('#col-left .kraland-metrics a[href="forum/rp/intrus-66"]'), header: !!document.getElementById('player-header-section') }));
    check(`${label} : la peau a bien transformé la colonne (précondition : .kraland-metrics créé, en-tête nommé)`, () => assert.deepEqual(skinned, { metrics: true, header: true }));
    let m = await dynamicRp(p);
    const after = await stored(p, 'rp');
    check(`${label} : menu RP = liste de catégorie seule (ni « Personnes en ligne », ni Kramail, ni profil)`, () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Bravo']));
    // Relecture forcée APRÈS la peau (stockage vidé avant pour que l'écriture ne soit pas écartée par la garde de date) : même résultat.
    await p.evaluate(() => { localStorage.removeItem('kr-forums-v2-rp'); if (window.captureForumSidebar) { window.captureForumSidebar(true); } });
    const again = await stored(p, 'rp');
    check(`${label} : relecture après la peau = lecture avant la peau`, () => assert.deepEqual(again && again.forums, after.forums));
    m = await dynamicRp(p);
    check(`${label} : le menu reste identique après relecture`, () => assert.ok(!JSON.stringify(m.items).includes('intrus-66') && !JSON.stringify(m.items).includes('kramail')));
    await context.close();
  }
}

// ---------- O (R6) : colonne latérale NATIVE copiée telle quelle (relevé anonyme du 15/10/2026), bureau et mobile, deux thèmes ----------
if (frag('o')) {
  console.log('O : fixtures natives fidèles (HRP 5 forums, RP anonyme 3 forums)');
  const fixture = name => fs.readFileSync(path.join(root, 'tests/e2e/fixtures', name), 'utf8');
  const nativeHrp = fixture('forum-colonne-native-hrp.html');
  const nativeRp = fixture('forum-colonne-native-rp.html');
  check('précondition : les copies natives portent les marqueurs du site (lefticon, slide-submenu, <!-- submenu -->)', () => {
    for (const html of [nativeHrp, nativeRp]) { assert.ok(html.includes('class="lefticon"') && html.includes('id="slide-submenu"') && html.includes('<!-- submenu -->')); }
  });
  for (const width of [1280, 375]) {
    for (const variant of ['empire-brun-dark', 'empire-brun']) {
      const s = makeServer();
      s.verbatim['/forum/hrp'] = nativeHrp;
      s.verbatim['/forum/rp'] = nativeRp;
      const stale = JSON.stringify({ v: 2, at: Date.now() - 3600e3, forums: [{ name: 'Ancien RP', url: 'forum/rp/ancien-1' }] });
      const { context, p } = await open({ width, variant, server: s, preset: { 'kr-forums-v2-rp': stale } });
      await go(p, '/forum/hrp/debuter-20102');
      const hrp = await read(p, 'hrp');
      check(`${width} / ${variant} : HRP depuis un forum, 5 forums natifs, libellés sans icône ni espaces natifs`, () => assert.deepEqual(hrp.items, [['Site & Annonces', 'forum/hrp/site-annonces-20101'], ['Débuter', 'forum/hrp/debuter-20102'], ['Règles', 'forum/hrp/regles-20103'], ['Entracte', 'forum/hrp/entracte-20104'], ['Bugs', 'forum/hrp/bugs-20105']]));
      const rpStill = await dynamicRp(p);
      check(`${width} / ${variant} : RP inchangé par la visite d'un forum HRP`, () => assert.deepEqual(rpStill.items.map(i => i[0]), ['Ancien RP']));
      await go(p, '/forum/rp');
      const rp = await dynamicRp(p);
      check(`${width} / ${variant} : RP natif (Taverne, Marché, Monde seulement) : liste lue, aucun forum à ajouter, état empty`, () => { assert.deepEqual(rp.items, [['Autre', 'forum/rp']]); assert.equal(rp.state, 'empty'); });
      await context.close();
    }
  }
}

await browser.close();
console.log(failures ? `\n${failures} échec(s)` : '\nTout est vert');
process.exit(failures ? 1 : 0);
