// Accueil mobile (épopée 10, entrée 2 ; plan story-fixture-realiste-de-l-accueil-et-suite-e2e-accueil-mobile) : garde de l'existant (E10.5)
// sur la fixture synthétique accueil.html, reconstruite d'après le relevé du spike 10.1 (structure native, avant le template).
//   mobile     320 et 375 × 667 px, Kraland clair et Empire Brun sombre : mode mobile ; ordre visuel Jouer, Bienvenue, Forum, Compteurs,
//              Nouvelles ; #col-right masqué ; aucun débordement horizontal ; « Bienvenue » devant le nom ; a.accueil-play-btn injecté
//              juste après .ds_user ; .accueil-forum-section (titre et 4 liens) ; <hr> retirés de #col-t ; compteurs déplacés dans
//              #col-left .kraland-metrics ;
//   bureau     1280 px, mêmes variantes : trois colonnes côte à côte ; carte ministérielle visible ; carrousel masqué par
//              html.kr-hide-carousel (défaut) ; position des textes égale au bundle de base ;
//   carrousel  kr-carousel-hide = 'false' : carrousel affiché à 1280 px, #col-right toujours masqué à 375 px.
// Partout : aucune exception de page, aucune requête hors fixture (coupée par la route de la fixture ou refusée par confineNetwork). Aucun écart E10.1-E10.4 (entrée 3).
// Aucun accès au site réel. Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base, défaut : git show COMMIT_AVANT),
// KR_FRAG = mobile, bureau, carrousel (vide = tout), KR_FA_DIR=/dossier (copie locale de Font Awesome 5.6.3 du site : css/all.min.css
// + webfonts/, comme messages-v3 ; sans elle, la feuille est vide et les icônes n'ont pas de glyphe).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, styleSettled, THEME_READY } from './lib/settle.mjs';
import { choisirVariante, VARIANTE_POSEE } from './lib/variantes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const userscript = sansEntete(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_AVANT = 'e2bcdd1'; // feature/next au départ de l'épopée 10 (spike 10.1)
const avant = sansEntete(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_AVANT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const FA_DIR = process.env.KR_FA_DIR || '';
const BASE = 'http://www.kraland.org';
const URL_ACCUEIL = BASE + '/accueil';
const HTML = fs.readFileSync(path.join(here, 'fixtures', 'accueil.html'), 'utf8');
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');
const VARIANTES = ['kraland', 'empire-brun-dark'];
const MOBILES = [320, 375];
// Blocs mobiles dans l'ordre visuel attendu (haut vers bas).
const BLOCS = [
  ['Jouer', '#col-t > a.accueil-play-btn'],
  ['Bienvenue', '#col-t > .ds_user'],
  ['Forum', '#col-t > .accueil-forum-section'],
  ['Compteurs', '#col-left > .kraland-metrics'],
  ['Nouvelles', '#col-left > #player-header-section']
];

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}

const browser = await launchBrowser();

async function ouvrir({ width, height = 667, variante, script = userscript, carrousel = null }) {
  const tactile = width < 768;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: tactile, hasTouch: tactile, deviceScaleFactor: 1 });
  const denied = await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  const coupees = []; // requêtes vers www.kraland.org coupées par la route de la fixture (hors page, Bootstrap, jQuery, CSS)
  // Images du site : GIF 1 × 1. Les images de la fixture portent width et height, sauf celles des ministres et du carrousel, rendues
  // à 1 × 1 px : leur géométrie n'est pas représentative. Les logos du thème (/2/world/logo*) sont laissés au refus du confinement,
  // comme dans les autres suites (lib/confinement.mjs).
  await context.route('http://img7.kraland.org/**', route => (new URL(route.request().url()).pathname.startsWith('/2/world/logo')
    ? route.fallback() : route.fulfill({ status: 200, contentType: 'image/gif', body: GIF })));
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (u.href.split('#')[0] === URL_ACCUEIL) { return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: HTML }); }
    if (u.pathname.startsWith('/lib/bootstrap') || u.pathname.startsWith('/lib/jquery')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return route.fulfill({ path: path.join(VENDOR, file), contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript' });
    }
    if (u.pathname.startsWith('/lib/fontawesome') && FA_DIR) {
      const file = path.join(FA_DIR, u.pathname.replace('/lib/fontawesome-free-5.6.3/', ''));
      if (fs.existsSync(file)) { return route.fulfill({ path: file }); }
    }
    if (u.pathname.endsWith('.css')) { return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    coupees.push(u.href);
    return route.abort();
  });
  await context.addInitScript(choisirVariante, variante);
  if (carrousel !== null) { await context.addInitScript(v => localStorage.setItem('kr-carousel-hide', v), carrousel); }
  await context.addInitScript(src => {
    window.GM = { xmlHttpRequest: () => {} };
    // Soumission neutralisée (aucun envoi, même depuis une fixture).
    window.addEventListener('submit', e => e.preventDefault(), true);
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, script);
  const page = await context.newPage();
  const erreurs = [];
  page.on('pageerror', e => erreurs.push(e.message));
  await page.goto(URL_ACCUEIL, { waitUntil: 'load' });
  const label = `accueil ${variante} ${width} px`;
  await krReady(page, { ready: THEME_READY, label });
  await styleSettled(page, 'body');
  await page.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running'), null, { timeout: 5000 }).catch(() => {});
  // Requêtes hors fixture : coupées par la route de la fixture, ou refusées par confineNetwork (tout hôte), sauf la vérification de
  // version du thème (version.json, GitHub ou serveur local), émise sur toute page, et des logos du thème : tous deux refusés par le confinement.
  const attendu = u => /\/version\.json(?:\?|$)/.test(u) || u.startsWith('http://img7.kraland.org/2/world/logo');
  const horsFixture = () => [...coupees, ...denied.map(d => d.url).filter(u => !attendu(u))];
  return { context, page, erreurs, horsFixture };
}

// État de la page : mode, colonnes, blocs (boîte ou null si absent ou masqué), injections de la peau.
const ETAT = blocs => {
  const vis = e => !!e && e.getClientRects().length > 0 && getComputedStyle(e).display !== 'none';
  const boite = e => { if (!vis(e)) { return null; } const b = e.getBoundingClientRect(); return { g: Math.round(b.left), h: Math.round(b.top + window.scrollY), d: Math.round(b.right) }; };
  const colT = document.getElementById('col-t');
  const dsUser = colT && colT.querySelector(':scope > .ds_user');
  const suivant = dsUser && dsUser.nextElementSibling;
  const forum = colT && colT.querySelector(':scope > .accueil-forum-section');
  const metrics = document.querySelector('#col-left > .kraland-metrics');
  const carrousel = document.getElementById('myCarousel');
  return {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    accueil: document.body.classList.contains('page-accueil'),
    cache: document.documentElement.classList.contains('kr-hide-carousel'),
    vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth,
    blocs: blocs.map(([nom, sel]) => [nom, boite(document.querySelector(sel))]),
    colonnes: ['#col-left', '#col-right', '#col-t'].map(s => boite(document.querySelector(s))),
    colRight: getComputedStyle(document.getElementById('col-right')).display,
    ministre: vis(document.querySelector('#col-right > .panel .panel-title')),
    carrousel: carrousel ? getComputedStyle(carrousel).display : 'absent',
    nom: dsUser ? dsUser.querySelector('h4.list-group-item-heading').textContent.trim() : null,
    jouer: suivant && suivant.matches('a.accueil-play-btn') ? { href: suivant.getAttribute('href'), texte: suivant.textContent.trim(), icone: !!suivant.querySelector('i.fa.fa-play') } : null,
    forum: forum ? { titre: (forum.querySelector(':scope > h4') || {}).textContent, liens: forum.querySelectorAll(':scope > a.ds_forum').length } : null,
    forumHors: colT ? colT.querySelectorAll(':scope > a.ds_forum, :scope > h4').length : -1,
    hr: colT ? colT.querySelectorAll('hr').length : -1,
    compteurs: metrics ? [...metrics.querySelectorAll(':scope > a.list-group-item')].map(a => a.className.match(/ds_\w+/)[0]) : [],
    compteursColT: colT ? colT.querySelectorAll('.ds_users, .ds_characters, .ds_online').length : -1
  };
};

// Relevé comparé au bundle de base : position de chaque nœud texte visible (ordre du DOM), arrondie au demi-pixel ; numéro de version du
// pied (horodatage du build) masqué.
const RELEVE = () => {
  const r2 = v => Math.round(v * 2) / 2;
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (!n.textContent.trim() || !n.parentElement || n.parentElement.closest('script, style')) { continue; }
    const rg = document.createRange();
    rg.selectNodeContents(n);
    const b = [...rg.getClientRects()].filter(x => x.width > 0 && x.height > 0);
    if (!b.length) { continue; }
    out.push(`${n.textContent.trim().replace(/\d{10,}/g, '#').slice(0, 24)} @ ${r2(b[0].left + window.scrollX)},${r2(b[0].top + window.scrollY)} ${b.length}`);
  }
  return out;
};
function premierEcart(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) { if (a[i] !== b[i]) { return `texte ${i} : « ${a[i]} » au lieu de « ${b[i]} »`; } }
  return '';
}

function controlerPropre(tag, r) {
  check(`${tag} : aucune exception de page, aucune requête hors fixture`, () => {
    assert.deepEqual(r.erreurs, [], 'exceptions : ' + r.erreurs.join(' | '));
    assert.deepEqual(r.hors, [], 'requêtes refusées : ' + r.hors.join(' '));
  });
}

async function mesurer(c, script) {
  const { context, page, erreurs, horsFixture } = await ouvrir({ ...c, script });
  const m = await page.evaluate(ETAT, BLOCS);
  m.variante = await page.evaluate(VARIANTE_POSEE, c.variante);
  const releve = c.releve ? await page.evaluate(RELEVE) : null;
  await context.close();
  return { m, releve, erreurs, hors: horsFixture() };
}

if (on('mobile')) {
  console.log('\n[mobile] 320 et 375 × 667 px : ordre des blocs, #col-right masqué, injections de la peau');
  const cas = VARIANTES.flatMap(variante => MOBILES.map(width => ({ variante, width })));
  const res = await mapLimit(cas, async c => ({ c, r: await mesurer(c, userscript) }));
  for (const { c, r } of res) {
    const tag = `mobile ${c.variante} ${c.width} px`;
    const { m } = r;
    check(`${tag} : thème, variante, mode mobile et page-accueil posés`, () => assert.deepEqual([m.theme, m.variante, m.mobile, m.accueil], [true, true, true, true]));
    check(`${tag} : blocs visibles dans l'ordre ${BLOCS.map(b => b[0]).join(', ')}`, () => {
      const absents = m.blocs.filter(([, b]) => !b).map(([n]) => n);
      assert.deepEqual(absents, [], 'blocs absents ou masqués : ' + absents.join(', '));
      for (let i = 1; i < m.blocs.length; i++) {
        assert.ok(m.blocs[i][1].h > m.blocs[i - 1][1].h, `${m.blocs[i][0]} (${m.blocs[i][1].h}) pas sous ${m.blocs[i - 1][0]} (${m.blocs[i - 1][1].h})`);
      }
    });
    check(`${tag} : #col-right masqué (carte ministérielle et carrousel absents)`, () => assert.equal(m.colRight, 'none'));
    check(`${tag} : aucun débordement horizontal`, () => assert.ok(m.sw <= m.vw, `débordement ${m.sw} > ${m.vw}`));
    check(`${tag} : « Bienvenue » devant le nom de .ds_user`, () => assert.equal(m.nom, 'Bienvenue Thanaël'));
    check(`${tag} : a.accueil-play-btn juste après .ds_user, vers /jouer/plateau`, () => assert.deepEqual(m.jouer, { href: '/jouer/plateau', texte: 'Jouer', icone: true }));
    check(`${tag} : .accueil-forum-section (titre Forum, 4 liens), rien du forum hors de la section`, () => {
      assert.deepEqual(m.forum, { titre: 'Forum', liens: 4 });
      assert.equal(m.forumHors, 0);
    });
    check(`${tag} : <hr> retirés de #col-t ; compteurs déplacés dans #col-left .kraland-metrics`, () => {
      assert.equal(m.hr, 0);
      assert.deepEqual(m.compteurs, ['ds_users', 'ds_characters', 'ds_online']);
      assert.equal(m.compteursColT, 0);
    });
    controlerPropre(tag, r);
  }
}

if (on('bureau')) {
  console.log('\n[bureau] 1280 px : trois colonnes, carte ministérielle, carrousel masqué, textes égaux au bundle de base');
  const cas = VARIANTES.map(variante => ({ variante, width: 1280, height: 720, releve: true }));
  const res = await mapLimit(cas, async c => ({ c, r: await mesurer(c, userscript), base: await mesurer(c, avant) }));
  for (const { c, r, base } of res) {
    const tag = `bureau ${c.variante} 1280 px`;
    const { m } = r;
    check(`${tag} : thème et variante posés, pas de mode mobile`, () => assert.deepEqual([m.theme, m.variante, m.mobile, m.accueil], [true, true, false, true]));
    check(`${tag} : #col-left, #col-right et #col-t côte à côte, même haut`, () => {
      const [g, c2, d] = m.colonnes;
      assert.ok(g && c2 && d, 'colonne masquée : ' + JSON.stringify(m.colonnes));
      assert.ok(g.d <= c2.g && c2.d <= d.g, 'colonnes non alignées : ' + JSON.stringify(m.colonnes));
      assert.ok(g.h === c2.h && c2.h === d.h, 'hauts différents : ' + JSON.stringify(m.colonnes));
    });
    check(`${tag} : carte ministérielle visible`, () => assert.ok(m.ministre));
    check(`${tag} : carrousel masqué par html.kr-hide-carousel (défaut)`, () => assert.deepEqual([m.cache, m.carrousel], [true, 'none']));
    check(`${tag} : Bienvenue, Jouer et section Forum injectés`, () => {
      assert.equal(m.nom, 'Bienvenue Thanaël');
      assert.ok(m.jouer, 'a.accueil-play-btn absent après .ds_user');
      assert.deepEqual(m.forum, { titre: 'Forum', liens: 4 });
    });
    check(`${tag} : position des textes égale au bundle de base (${COMMIT_AVANT})`, () => {
      assert.ok(base.releve.length > 0, 'relevé de base vide');
      const ecart = premierEcart(r.releve, base.releve);
      assert.ok(!ecart, ecart);
    });
    controlerPropre(tag, r);
  }
}

if (on('carrousel')) {
  console.log('\n[carrousel] kr-carousel-hide = false : affiché à 1280 px, #col-right masqué à 375 px');
  const cas = VARIANTES.flatMap(variante => [{ variante, width: 1280, height: 720, carrousel: 'false' }, { variante, width: 375, carrousel: 'false' }]);
  const res = await mapLimit(cas, async c => ({ c, r: await mesurer(c, userscript) }));
  for (const { c, r } of res) {
    const tag = `carrousel ${c.variante} ${c.width} px`;
    const { m } = r;
    if (c.width === 1280) {
      check(`${tag} : sans kr-hide-carousel, #myCarousel affiché`, () => assert.deepEqual([m.cache, m.carrousel], [false, 'block']));
    } else {
      check(`${tag} : sans kr-hide-carousel, #col-right toujours masqué`, () => assert.deepEqual([m.cache, m.colRight], [false, 'none']));
    }
    controlerPropre(tag, r);
  }
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
