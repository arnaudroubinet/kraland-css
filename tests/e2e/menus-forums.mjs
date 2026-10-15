// Menus Forum RP / HRP / Communauté / Débats / Staff : actualisation depuis la liste native des forums accessibles.
// Fixtures inertes (aucun réseau réel, aucun compte) : la « liste native » est un tableau servi par une route Playwright MUTABLE,
// ce qui permet de rejouer ancienne liste -> nouvelle liste, ajout, retrait, liste vide, source indisponible.
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
const page = (body) => `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><base href="${BASE}/"><meta name="viewport" content="width=device-width, initial-scale=1"><title>fixture</title></head><body>${NAV}<div id="content" class="container"><div class="row"><div id="col-right" class="col-md-12">${body}</div></div></div><footer><div class="container white">pied</div></footer></body></html>`;
// Ligne réaliste : titre en p > a, description, modérateurs, compteurs, dernier message avec liens.
const row = (fo) => `<tr><td><p class="nomargin"><a href="${fo.url}">${fo.name}</a></p><p class="nomargin">Description de ${fo.name}</p><div class="mini">Modérateurs : <a href="communaute/membres/modo-1-1">Modo [mod]</a></div></td><td class="center">10 sujets</td><td class="center">100 messages</td><td><a href="communaute/membres/aestus-1-1">Aestus</a> <p class="nomargin mini"><a href="forum/sujet/dernier-1-1#msg1" class="btn btn-default">→</a> Hier (13:20)</p></td></tr>`;
const table = (forums, extra = '') => `<table class="table"><thead><tr><th>Forum</th><th>Sujets</th><th>Messages</th><th>Dernier message</th></tr></thead><tbody>${forums.map(row).join('')}${extra}</tbody></table>`;
const f = (n, slug) => ({ name: n, url: `forum/rp/${slug}` });

// Serveur de fixtures : état mutable par test.
function makeServer() {
  const s = {
    lists: { '/forum/rp': [f('Taverne', 'taverne-10101'), f('Marché', 'marche-10102'), f('Monde', 'monde-10103'), f('Alpha', 'alpha-1'), f('Bravo', 'bravo-2')],
      '/forum/hrp': [{ name: 'Annonces', url: 'forum/hrp/annonces-9' }], '/forum/communaute': [{ name: 'Clubs', url: 'forum/communaute/clubs-5' }],
      '/forum/debats': [{ name: 'Politique', url: 'forum/debats/politique-6' }], '/forum/staff': [{ name: 'Modération', url: 'forum/staff/moderation-7' }] },
    extra: {}, // chemin -> lignes HTML ajoutées au tableau
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
      // Ligne dont le seul lien n'a pas de destination (ancre nommée) : ignorée, sans invalider le reste de la page.
      if (mode === 'broken-link') { return html(table(s.lists[key], '<tr><td><a name="x">Sans destination</a></td><td>0</td></tr>')); }
      return html(table(s.lists[key], s.extra[key] || ''));
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
    const mi = await read(p, id);
    check(`menu ${id} suit sa propre page source`, () => assert.deepEqual(names(mi), expected));
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

// ---------- G : liste du personnage précédent, même navigateur, bornée à 7 jours ----------
if (frag('g')) {
  console.log('G : même navigateur, autre personnage : liste précédente bornée à 7 jours');
  const s = makeServer();
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp'); // personnage A : Alpha, Bravo
  SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Zoulou', 'zoulou-26')]); // personnage B, même navigateur
  await go(p, '/jouer/plateau');
  let m = await dynamicRp(p);
  check('hors page source : la liste du personnage précédent reste affichée (non isolée, documenté)', () => assert.deepEqual(m.items.map(i => i[0]), ['Alpha', 'Bravo']));
  await go(p, '/forum/rp');
  m = await dynamicRp(p);
  check('page source du nouveau personnage : sa liste remplace celle du précédent', () => assert.deepEqual(m.items.map(i => i[0]), ['Zoulou']));
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
  await go(p2, '/forum/rp'); // onglet 2 : Charlie, plus récent
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
  // Même sans pageshow : une lecture datée du chargement de la page n'écrase jamais une entrée plus récente.
  await p.evaluate(() => window.updateForumRPMenu());
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

// ---------- J : lignes atypiques ----------
if (frag('j')) {
  console.log('J : ligne atypique ignorée, la page n\'est pas invalidée');
  const extras = {
    'en-tête de groupe': '<tr><td colspan="4"><strong>Organisations</strong></td></tr>',
    'ancre sans href en 1re cellule': '<tr><td><a name="org"></a><p class="nomargin"><a href="forum/rp/org-77">Organisation</a></p></td><td>1</td><td>1</td><td></td></tr>',
    'lien image sans texte en 1re cellule': '<tr><td><a href="forum/rp/img-78"><img src="x.png" alt=""></a> <a href="forum/rp/img-79">Image</a></td><td>1</td><td>1</td><td></td></tr>',
    'ligne sans lien utilisable': '<tr><td><a href="forum/rp/vide-80"><img src="x.png" alt=""></a></td><td>1</td><td>1</td><td></td></tr>'
  };
  for (const [label, extra] of Object.entries(extras)) {
    const s = makeServer();
    const { context, p } = await open({ server: s });
    await go(p, '/forum/rp');
    SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Charlie', 'charlie-3')]);
    s.extra['/forum/rp'] = extra;
    await go(p, '/forum/rp');
    const mj = await dynamicRp(p);
    const got = mj.items.map(i => i[0]);
    check(`${label} : Charlie pris, Bravo retiré`, () => { assert.ok(got.includes('Charlie')); assert.ok(!got.includes('Bravo')); });
    await context.close();
  }
  // Aucune ligne exploitable du tout : lecture invalide, la liste précédente n'est pas remplacée.
  const s = makeServer();
  const { context, p } = await open({ server: s });
  await go(p, '/forum/rp');
  SET(s, '/forum/rp', []);
  s.extra['/forum/rp'] = '<tr><td><a name="x"></a></td></tr>';
  await go(p, '/forum/rp');
  const mk = await dynamicRp(p);
  check('aucune ligne exploitable : liste précédente conservée', () => assert.deepEqual(mk.items.map(i => i[0]), ['Alpha', 'Bravo']));
  await context.close();
}

// ---------- K (QA t_1cd6c20f) : lien exploitable, entrée datée dans le futur, horloge de performance en retard ----------
if (frag('k')) {
  console.log('K : forum de la ligne atypique lu, lien hors forum écarté, date de lecture murale');
  // La règle « premier lien exploitable » doit LIRE le forum de la ligne atypique, pas seulement ignorer la ligne.
  for (const [label, extra, expected] of [
    ['ancre sans href puis p > a', '<tr><td><a name="org"></a><p class="nomargin"><a href="forum/rp/org-77">Organisation</a></p></td><td>1</td><td>1</td><td></td></tr>', ['Organisation', 'forum/rp/org-77']],
    ['lien image puis lien texte', '<tr><td><a href="forum/rp/img-79"><img src="x.png" alt=""></a> <a href="forum/rp/img-79">Image</a></td><td>1</td><td>1</td><td></td></tr>', ['Image', 'forum/rp/img-79']]
  ]) {
    const s = makeServer();
    SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Charlie', 'charlie-3')]);
    s.extra['/forum/rp'] = extra;
    const { context, p } = await open({ server: s });
    await go(p, '/forum/rp');
    const mk = await dynamicRp(p);
    check(`${label} : ${expected[0]} lu avec sa destination native`, () => assert.ok(mk.items.some(i => i[0] === expected[0] && i[1] === expected[1]), JSON.stringify(mk.items)));
    await context.close();
  }
  // Titre en lien image sans texte, modérateurs dans la même cellule : le profil du modérateur n'est pas un forum.
  {
    const s = makeServer();
    SET(s, '/forum/rp', [f('Taverne', 'taverne-10101'), f('Charlie', 'charlie-3')]);
    s.extra['/forum/rp'] = '<tr><td><p class="nomargin"><a href="forum/rp/icone-81"><img src="x.png" alt=""></a></p><p class="nomargin">Description</p><div class="mini">Modérateurs : <a href="communaute/membres/modo-1-1">Modo [mod]</a></div></td><td>1</td><td>1</td><td></td></tr>';
    const { context, p } = await open({ server: s });
    await go(p, '/forum/rp');
    const mk = await dynamicRp(p);
    check('titre image + modérateurs : aucun lien hors forum dans le menu Forum RP', () => assert.ok(!mk.items.some(i => /communaute\/membres/.test(i[1])), JSON.stringify(mk.items)));
    await context.close();
  }
  // Entrée datée de 2 h dans le futur (horloge corrigée en arrière) : la visite de la page source la remplace.
  {
    const s = makeServer();
    const future = JSON.stringify({ v: 2, at: Date.now() + 2 * 3600e3, forums: [{ name: 'Ancien', url: 'forum/rp/ancien-1' }] });
    const { context, p } = await open({ server: s, preset: { 'kr-forums-v2-rp': future } });
    await go(p, '/forum/rp');
    const mk = await dynamicRp(p);
    check('entrée datée dans le futur : la page source la remplace (Alpha, Bravo)', () => assert.deepEqual(mk.items.map(i => i[0]), ['Alpha', 'Bravo']));
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
    await go(p2, '/forum/rp');
    const mk = await dynamicRp(p2);
    check('timeOrigin en retard de 10 h : la liste plus récente (Delta) est mémorisée et affichée', () => assert.deepEqual(mk.items.map(i => i[0]), ['Delta']));
    await context.close();
  }
}

await browser.close();
console.log(failures ? `\n${failures} échec(s)` : '\nTout est vert');
process.exit(failures ? 1 : 0);
