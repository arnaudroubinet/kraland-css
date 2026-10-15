// Menus Forum RP / HRP / Communauté / Débats / Staff : actualisation depuis la liste native des forums accessibles.
// Fixtures inertes (aucun réseau réel, aucun compte) : la « liste native » est un tableau servi par une route Playwright MUTABLE,
// ce qui permet de rejouer ancienne liste -> nouvelle liste, ajout, retrait, liste vide, source indisponible.
//
// Usage : npm run build && node tests/e2e/menus-forums.mjs
// Options : KR_SCRIPT=/chemin/script.user.js ; KR_FRAG=a,b pour ne rejouer que certains blocs (rouge/vert ciblé).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { URL } from 'node:url';
import { domQuiet, THEME_READY } from './lib/settle.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const BASE = 'http://www.kraland.org';
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
const page = (body) => `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>fixture</title></head><body>${NAV}<div id="content" class="container"><div class="row"><div id="col-right" class="col-md-12">${body}</div></div></div><footer><div class="container white">pied</div></footer></body></html>`;
const table = (forums) => `<table class="table"><thead><tr><th>Forum</th></tr></thead><tbody>${forums.map(f => `<tr><td><a href="${f.url}">${f.name}</a></td><td>0</td></tr>`).join('')}</tbody></table>`;
const f = (n, slug) => ({ name: n, url: `forum/rp/${slug}` });

// Serveur de fixtures : état mutable par test.
function makeServer() {
  const s = {
    lists: { '/forum/rp': [f('Taverne', 'taverne-10101'), f('Marché', 'marche-10102'), f('Monde', 'monde-10103'), f('Alpha', 'alpha-1'), f('Bravo', 'bravo-2')],
      '/forum/hrp': [{ name: 'Annonces', url: 'forum/hrp/annonces-9' }], '/forum/communaute': [{ name: 'Clubs', url: 'forum/communaute/clubs-5' }],
      '/forum/debats': [{ name: 'Politique', url: 'forum/debats/politique-6' }], '/forum/staff': [{ name: 'Modération', url: 'forum/staff/moderation-7' }] },
    mode: {}, // chemin -> 'notable' | 'norows' | 'broken-link' | 'http500' | 'redirect'
    hits: {} // chemin -> nombre de documents servis
  };
  s.handler = async (route) => {
    const u = new URL(route.request().url());
    const p = u.pathname;
    if (route.request().resourceType() !== 'document' && route.request().resourceType() !== 'fetch' && route.request().resourceType() !== 'xhr') { return route.abort(); }
    s.hits[p] = (s.hits[p] || 0) + 1;
    const key = normalize(p);
    const mode = s.mode[key];
    const html = (b) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: page(b) });
    if (s.lists[key]) {
      if (mode === 'http500') { return route.fulfill({ status: 500, contentType: 'text/html', body: '<html><body>Erreur</body></html>' }); }
      if (mode === 'redirect') { return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: page('<h1>Connexion</h1>') }); }
      if (mode === 'notable') { return html('<h1>Maintenance</h1><p>Indisponible</p>'); }
      if (mode === 'broken-link') { return html(table([...s.lists[key], { name: 'Sans destination', url: '' }]).replace('href=""', '')); }
      return html(table(s.lists[key]));
    }
    return html('<h1>Page</h1>');
  };
  return s;
}
const normalize = p => p.replace(/\/+$/, '').toLowerCase();

const browser = await chromium.launch({ headless: true, executablePath: process.env.KR_CHROMIUM || undefined });

async function open({ width = 1280, variant = 'empire-brun-dark', server, preset = null }) {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height: 800 }, isMobile: mobile, hasTouch: mobile });
  await context.route(BASE + '/**', server.handler);
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
}, { attr: MENU_IDS[id], text: needle }, { timeout: ms });
const SET = (s, path_, forums) => { s.lists[path_] = forums; };

// ---------- A : ancienne liste -> nouvelle liste (ajout + retrait), sur la page source, navigation, rechargement ----------
if (frag('a')) {
  console.log('A : ancienne liste -> nouvelle liste (ajout + retrait)');
  const s = makeServer();
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp');
  let m = await dynamicRp(p);
  check('page source : Alpha et Bravo dans le menu RP', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Bravo']));
  await go(p, '/jouer/plateau');
  m = await dynamicRp(p);
  check('navigation : le menu RP garde A', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Bravo']));
  // La liste native change : Bravo disparaît (accès perdu), Charlie apparaît.
  SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Alpha', 'alpha-1'), f('Charlie', 'charlie-3')]);
  await go(p, '/forum/rp');
  m = await dynamicRp(p);
  check('page source : DÈS le premier affichage, Bravo retiré et Charlie ajouté (pas un décalage d\'une page)', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Charlie']));
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
  check('barre finale /forum/rp/ : la page source est reconnue', () => assert.equal(m.items.length > 0, true));
  check('doublon de destination fusionné ; « Le Monde de Kraland » n\'est plus exclu par sous-chaîne ; « Monde » et « Débats » exacts exclus', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Le Monde de Kraland']));
  await go(p, '/forum/hrp');
  m = await read(p, 'hrp');
  check('HRP : aucun filtrage par nom (« Staff & Co » conservé)', () => assert.deepEqual(names(m), ['Annonces', 'Staff & Co']));
  await go(p, '/forum/communaute');
  await go(p, '/forum/debats');
  await go(p, '/forum/staff');
  await go(p, '/jouer/plateau');
  for (const [id, expected] of [['communaute', ['Clubs']], ['debats', ['Politique']], ['staff', ['Modération']]]) {
    m = await read(p, id);
    check(`menu ${id} suit sa propre page source`, () => assert.deepEqual(names(m), expected));
  }
  await context.close();
}

// ---------- C : liste vide valide ----------
if (frag('c')) {
  console.log('C : liste vide valide (tableau présent, aucun forum)');
  const s = makeServer();
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp');
  SET(s, '/forum/rp', []);
  await go(p, '/forum/rp');
  let m = await dynamicRp(p);
  check('menu RP : plus aucun forum dynamique, lien de repli vers la page source', () => assert.deepEqual(m.items, [['Autre', 'forum/rp']]));
  check('état « empty » (et non « unavailable »)', () => assert.equal(m.state, 'empty'));
  await go(p, '/jouer/plateau');
  m = await dynamicRp(p);
  check('navigation : la liste vide valide reste vide (Alpha/Bravo ne reviennent pas)', () => assert.deepEqual(m.items, [['Autre', 'forum/rp']]));
  await context.close();
}

// ---------- D : source indisponible / incomplète ----------
if (frag('d')) {
  console.log('D : source indisponible ou incomplète != liste vide');
  for (const mode of ['notable', 'broken-link']) {
    const s = makeServer();
    const { context, p } = await open({ server: s });
    await go(p, '/forum/rp');
    s.mode['/forum/rp'] = mode;
    await go(p, '/forum/rp');
    const mb = await dynamicRp(p);
    check(`${mode} sur la page source : la dernière liste connue est conservée (pas vidée)`, () => assert.deepEqual(mb.items.map(i => i[0]), ['Alpha', 'Bravo']));
    await context.close();
  }
  // Page non source : aucune relecture réseau. Une liste de 2 jours reste affichée, marquée « stale », sans aucune requête vers la source.
  {
    const s = makeServer();
    const old = JSON.stringify({ v: 2, at: Date.now() - 2 * 24 * 60 * 60 * 1000, forums: [{ name: 'Ancien', url: 'forum/rp/ancien-1' }] });
    const { context, p } = await open({ server: s, preset: { 'kr-forums-v2-rp': old } });
    await go(p, '/jouer/plateau');
    await p.waitForTimeout(600); // fenêtre bornée : l'absence de requête n'a pas de condition positive
    const m = await dynamicRp(p);
    check('liste de 2 jours hors page source : conservée, état stale, jamais confondue avec une liste vide', () => { assert.deepEqual(m.items.map(i => i[0]), ['Ancien']); assert.equal(m.state, 'stale'); });
    check('aucune requête réseau vers les pages sources depuis une autre page', () => assert.deepEqual(Object.keys(s.hits).filter(k => k.startsWith('/forum')), []));
    await context.close();
  }
  // Plus de 7 jours : plus proposée.
  {
    const s = makeServer();
    s.mode['/forum/rp'] = 'http500';
    const old = JSON.stringify({ v: 2, at: Date.now() - 8 * 24 * 60 * 60 * 1000, forums: [{ name: 'Périmé', url: 'forum/rp/perime-1' }] });
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
  await go(p2, '/forum/rp');
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
      await go(p, '/forum/rp');
      const m = await dynamicRp(p);
      const mobileMode = await p.evaluate(() => document.body.classList.contains('mobile-mode'));
      check(`${width} / ${variant} : mode ${width < 768 ? 'mobile' : 'bureau'} et menu à jour (Zeta)`, () => { assert.equal(mobileMode, width < 768); assert.deepEqual(m.items.map(i => i[0]), ['Zeta']); });
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

// ---------- G : isolation ----------
if (frag('g')) {
  console.log('G : isolation (contextes de navigateur distincts = stockages distincts)');
  const s = makeServer();
  const a = await open({ server: s });
  await go(a.p, '/forum/rp');
  const b = await open({ server: (() => { const s2 = makeServer(); s2.mode['/forum/rp'] = 'http500'; return s2; })() });
  await go(b.p, '/jouer/plateau');
  const mb = await dynamicRp(b.p);
  check('un autre profil de navigateur ne voit pas la liste du premier', () => assert.deepEqual(mb.items, [['Autre', 'forum/rp']]));
  await a.context.close(); await b.context.close();
}

await browser.close();
console.log(failures ? `\n${failures} échec(s)` : '\nTout est vert');
process.exit(failures ? 1 : 0);
