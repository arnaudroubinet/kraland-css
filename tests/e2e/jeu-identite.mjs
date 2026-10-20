// Harmonisation UX, lot 1 : défauts de style et identité du personnage (décisions H1.1 à H1.6 et R1 de l'étude, EXPERIENCE.md).
// Fragment fuite-forum (H1.1) : le décor mobile des listes de forum (« → … sujets · ») reste réservé aux pages du forum. Sur Personnage,
// aucune cellule des panneaux Citoyenneté (deux cellules par ligne) et Maladies (une seule) ne reçoit ce contenu généré (::before « → »,
// ::after « sujets · ») ; sur l'index du forum, le décor reste (non-régression, mesuré sur une ligne native : voir LIGNE_NATIVE).
// Pages = FIXTURES SYNTHÉTIQUES (tests/e2e/fixtures/jeu-perso.html, forum-index-rp.html), aucune donnée réelle ; vrai Bootstrap 3.3.7
// (tests/e2e/vendor). Confinement réseau (lib/confinement.mjs) ; aucun clic, aucune navigation.
//
// Usage : npm run build && node tests/e2e/jeu-identite.mjs   (ou : npm run test:zone -- plateau)
// Options : KR_SCRIPT (bundle testé), KR_FRAG = fuite-forum (vide = tout).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, THEME_READY } from './lib/settle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const fixture = name => fs.readFileSync(path.join(here, 'fixtures', name), 'utf8');
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const BASE = 'http://www.kraland.org';
const PERSO = BASE + '/jouer/perso';
const INDEX_FORUM = BASE + '/forum/rp';
const VARIANTES = ['kraland', 'empire-brun-dark'];
const MOBILE = { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true };
const PANNEAUX_PERSO = [{ titre: 'Citoyenneté', cellules: [2, 2, 2] }, { titre: 'Maladies', cellules: [1, 1] }]; // structure de jeu-perso.html
// Ligne native de l'index (1re ligne du corps de table de la fixture). La peau remanie les lignes de la page : le module des sujets permanents
// insère un bloc de statistiques en 2e position et le tableau est masqué au profit de cartes, donc td:nth-child(2) n'y existe plus. La ligne
// d'origine, remise telle quelle dans le tableau le temps d'une mesure, dit si le décor s'applique encore sur une page du forum.
const LIGNE_NATIVE = fixture('forum-index-rp.html').match(/<tr>\s*<td>[\s\S]*?<\/tr>/)[0];
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const browser = await launchBrowser();

async function open(url, html, variante, device) {
  const context = await browser.newContext(device);
  await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route(url, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/css/bootstrap1.min.css', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.css'), contentType: 'text/css' }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/js/bootstrap.min.js', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.js'), contentType: 'application/javascript' }));
  await context.route(BASE + '/lib/jquery-3.3.1/jquery-3.3.1.min.js', route => route.fulfill({ path: path.join(VENDOR, 'jquery.min.js'), contentType: 'application/javascript' }));
  await context.addInitScript(({ src, v }) => {
    window.GM = { xmlHttpRequest: () => {} };
    localStorage.setItem('kr-theme-enabled', 'true');
    localStorage.setItem('kr-theme-variant', v);
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { src: userscript, v: variante });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await krReady(page, { ready: THEME_READY, label: `${variante} ${url}` });
  return { context, page };
}

// Mesures dans la page. fuites = contenus générés (::before, ::after) d'une cellule d'un panneau de Personnage (Citoyenneté : deux cellules
// par ligne ; Maladies : une seule, où la même cellule est première et dernière) qui portent le décor du forum.
const MESURE_PERSO = () => {
  const panneaux = [...document.querySelectorAll('#col-right .panel-default')].map(p => ({
    titre: p.querySelector('.panel-title').textContent.trim(),
    lignes: [...p.querySelectorAll('.table > tbody > tr')]
  }));
  const fuites = [];
  panneaux.forEach(p => p.lignes.forEach((tr, r) => [...tr.cells].forEach((td, c) => ['::before', '::after'].forEach(pseudo => {
    const contenu = getComputedStyle(td, pseudo).content;
    if (/→|sujets/.test(contenu)) { fuites.push(`${p.titre} ligne ${r + 1} cellule ${c + 1} ${pseudo} = ${contenu}`); }
  }))));
  return {
    variant: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')),
    mobile: document.body.classList.contains('mobile-mode'),
    pageForum: document.body.classList.contains('page-forum'),
    panneaux: panneaux.map(p => ({ titre: p.titre, cellules: p.lignes.map(tr => tr.cells.length) })),
    fuites
  };
};
const MESURE_INDEX = (ligneNative) => {
  const tbody = document.querySelector('#col-right .panel-default .table > tbody');
  tbody.insertAdjacentHTML('beforeend', ligneNative);
  const sonde = tbody.lastElementChild;
  const decor = {
    sujets: getComputedStyle(sonde.cells[1], '::after').content,
    fleche: getComputedStyle(sonde.cells[sonde.cells.length - 1], '::before').content
  };
  sonde.remove();
  return {
    variant: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')),
    mobile: document.body.classList.contains('mobile-mode'),
    pageForum: document.body.classList.contains('page-forum'),
    lignes: tbody.rows.length,
    decor
  };
};

async function scenario(variante) {
  const perso = await open(PERSO, fixture('jeu-perso.html'), variante, MOBILE);
  const mPerso = await perso.page.evaluate(MESURE_PERSO);
  await perso.context.close();
  const index = await open(INDEX_FORUM, fixture('forum-index-rp.html'), variante, MOBILE);
  const mIndex = await index.page.evaluate(MESURE_INDEX, LIGNE_NATIVE);
  await index.context.close();
  return { perso: mPerso, index: mIndex };
}

if (on('fuite-forum')) {
  console.log('Fuite du décor des listes de forum (375 × 667, tactile), variantes ' + VARIANTES.join(' et '));
  const res = await mapLimit(VARIANTES, scenario);
  VARIANTES.forEach((v, i) => {
    const { perso, index } = res[i];
    check(`[${v}] perso : thème appliqué, mode mobile actif, page hors forum, panneaux Citoyenneté (2 cellules par ligne) et Maladies (1 par ligne)`, () => {
      assert.equal(perso.variant, 'kr-theme-variant-' + v);
      assert.equal(perso.mobile, true, 'body sans mobile-mode');
      assert.equal(perso.pageForum, false, 'body marqué page-forum');
      assert.deepEqual(perso.panneaux, PANNEAUX_PERSO, 'panneaux mesurés : ' + JSON.stringify(perso.panneaux));
    });
    check(`[${v}] perso : aucune cellule de Citoyenneté ne reçoit le décor du forum (ni celle de Maladies, à une seule cellule par ligne)`, () => {
      assert.equal(perso.fuites.length, 0, 'décor du forum sur Personnage : ' + perso.fuites.join(' ; '));
    });
    check(`[${v}] index du forum : thème appliqué, mode mobile actif, page marquée page-forum, 2 lignes`, () => {
      assert.equal(index.variant, 'kr-theme-variant-' + v);
      assert.equal(index.mobile, true, 'body sans mobile-mode');
      assert.equal(index.pageForum, true, 'body sans page-forum');
      assert.equal(index.lignes, 2);
    });
    check(`[${v}] index du forum : le décor reste (« sujets » après la 2e cellule, « → » avant la dernière, sur une ligne native)`, () => {
      assert.ok(index.decor.sujets.includes('sujets'), 'td:nth-child(2)::after = ' + index.decor.sujets);
      assert.ok(index.decor.fleche.includes('→'), 'td:last-child::before = ' + index.decor.fleche);
    });
  });
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
