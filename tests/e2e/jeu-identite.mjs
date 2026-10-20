// Harmonisation UX, lot 1 : défauts de style et identité du personnage (décisions H1.1 à H1.6 et R1 de l'étude, EXPERIENCE.md).
// Fragment fuite-forum (H1.1) : le décor mobile des listes de forum (« → … sujets · ») reste réservé aux pages du forum. Sur Personnage,
// aucune cellule des panneaux Citoyenneté (deux cellules par ligne) et Maladies (une seule) ne reçoit ce contenu généré (::before « → »,
// ::after « sujets · ») ; sur l'index du forum, le décor reste (non-régression, mesuré sur une ligne native : voir LIGNE_NATIVE).
// Fragment regles-ok (H1.2) : la barre fixe « Envoyer » du bas d'écran appartient aux pages de rédaction (kramail, forum). Sur les Règles, le
// bouton « ok » du formulaire de recherche (button.btn-primary.pull-right) n'est pas fixé et reste à côté de son champ ; sur la rédaction d'un
// Kramail, la barre « Envoyer » reste fixe (non-régression, retirée au lot 7 seulement).
// Pages = FIXTURES SYNTHÉTIQUES (tests/e2e/fixtures/jeu-perso.html, forum-index-rp.html, regles-recherche.html), aucune donnée réelle, et la
// fixture anonymisée de la rédaction d'un Kramail (kramail-nouveau.html, servie à son URL de kramail-redaction.mjs) ; vrai Bootstrap 3.3.7
// (tests/e2e/vendor). Confinement réseau (lib/confinement.mjs) ; aucun clic, aucune navigation.
//
// Usage : npm run build && node tests/e2e/jeu-identite.mjs   (ou : npm run test:zone -- plateau)
// Options : KR_SCRIPT (bundle testé), KR_FRAG = fuite-forum, regles-ok (vide = tout).
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
const REGLES = BASE + '/regles/base';
const KRAMAIL_NOUVEAU = BASE + '/kramail/post/nouveau-4-2000'; // URL de la fixture dans kramail-redaction.mjs
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

// Socle de toutes les mesures : variante du thème, mode mobile et classes de page posées sur <body> par le script. Le contrôle de mise en place
// de chaque page (verifierSocle) en fixe les valeurs attendues, pour qu'un vert ou un rouge ne vienne jamais d'une page mesurée hors contexte.
const MESURE_SOCLE = () => ({
  variant: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')),
  mobile: document.body.classList.contains('mobile-mode'),
  pageForum: document.body.classList.contains('page-forum'),
  pageKramailCompose: document.body.classList.contains('page-kramail-compose')
});
const mesurer = async (page, mesure, arg) => ({ ...(await page.evaluate(MESURE_SOCLE)), ...(await page.evaluate(mesure, arg)) });
function verifierSocle(m, variante, { pageForum = false, pageKramailCompose = false } = {}) {
  assert.equal(m.variant, 'kr-theme-variant-' + variante);
  assert.equal(m.mobile, true, 'body sans mobile-mode');
  assert.equal(m.pageForum, pageForum, pageForum ? 'body sans page-forum' : 'body marqué page-forum');
  assert.equal(m.pageKramailCompose, pageKramailCompose, pageKramailCompose ? 'body sans page-kramail-compose' : 'body marqué page-kramail-compose');
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
    lignes: tbody.rows.length,
    decor
  };
};
// Bouton de validation (button.btn-primary.pull-right) du formulaire `formulaire` : nombre, libellé et position calculée (« fixed » = barre du
// bas d'écran de la rédaction), avec le nombre de champs input.form-control du même formulaire (le champ auprès duquel il doit rester).
const MESURE_BOUTON = formulaire => {
  const form = document.querySelector(formulaire);
  const boutons = form ? [...form.querySelectorAll('button.btn-primary.pull-right')] : [];
  return {
    champs: form ? form.querySelectorAll('input.form-control').length : 0,
    boutons: boutons.length,
    libelle: boutons.length ? boutons[0].textContent.trim() : null,
    position: boutons.length ? getComputedStyle(boutons[0]).position : null
  };
};

async function scenario(variante) {
  const perso = await open(PERSO, fixture('jeu-perso.html'), variante, MOBILE);
  const mPerso = await mesurer(perso.page, MESURE_PERSO);
  await perso.context.close();
  const index = await open(INDEX_FORUM, fixture('forum-index-rp.html'), variante, MOBILE);
  const mIndex = await mesurer(index.page, MESURE_INDEX, LIGNE_NATIVE);
  await index.context.close();
  return { perso: mPerso, index: mIndex };
}

async function scenarioRegles(variante) {
  const regles = await open(REGLES, fixture('regles-recherche.html'), variante, MOBILE);
  const mRegles = await mesurer(regles.page, MESURE_BOUTON, 'form[name="recherche"]');
  await regles.context.close();
  const kramail = await open(KRAMAIL_NOUVEAU, fixture('kramail-nouveau.html'), variante, MOBILE);
  const mKramail = await mesurer(kramail.page, MESURE_BOUTON, 'form[name="post_msg"]');
  await kramail.context.close();
  return { regles: mRegles, kramail: mKramail };
}

if (on('fuite-forum')) {
  console.log('Fuite du décor des listes de forum (375 × 667, tactile), variantes ' + VARIANTES.join(' et '));
  const res = await mapLimit(VARIANTES, scenario);
  VARIANTES.forEach((v, i) => {
    const { perso, index } = res[i];
    check(`[${v}] perso : thème appliqué, mode mobile actif, page hors forum, panneaux Citoyenneté (2 cellules par ligne) et Maladies (1 par ligne)`, () => {
      verifierSocle(perso, v);
      assert.deepEqual(perso.panneaux, PANNEAUX_PERSO, 'panneaux mesurés : ' + JSON.stringify(perso.panneaux));
    });
    check(`[${v}] perso : aucune cellule de Citoyenneté ne reçoit le décor du forum (ni celle de Maladies, à une seule cellule par ligne)`, () => {
      assert.equal(perso.fuites.length, 0, 'décor du forum sur Personnage : ' + perso.fuites.join(' ; '));
    });
    check(`[${v}] index du forum : thème appliqué, mode mobile actif, page marquée page-forum, 2 lignes`, () => {
      verifierSocle(index, v, { pageForum: true });
      assert.equal(index.lignes, 2);
    });
    check(`[${v}] index du forum : le décor reste (« sujets » après la 2e cellule, « → » avant la dernière, sur une ligne native)`, () => {
      assert.ok(index.decor.sujets.includes('sujets'), 'td:nth-child(2)::after = ' + index.decor.sujets);
      assert.ok(index.decor.fleche.includes('→'), 'td:last-child::before = ' + index.decor.fleche);
    });
  });
}

if (on('regles-ok')) {
  console.log('Barre fixe « Envoyer » réservée aux pages de rédaction (375 × 667, tactile), variantes ' + VARIANTES.join(' et '));
  const res = await mapLimit(VARIANTES, scenarioRegles);
  VARIANTES.forEach((v, i) => {
    const { regles, kramail } = res[i];
    check(`[${v}] règles : thème appliqué, mode mobile actif, page hors forum et hors rédaction, formulaire de recherche (un champ, un bouton « ok »)`, () => {
      verifierSocle(regles, v);
      assert.equal(regles.champs, 1, 'champs input.form-control du formulaire de recherche : ' + regles.champs);
      assert.equal(regles.boutons, 1, 'boutons button.btn-primary.pull-right du formulaire de recherche : ' + regles.boutons);
      assert.equal(regles.libelle, 'ok');
    });
    check(`[${v}] règles : le bouton « ok » n'est pas fixé`, () => {
      assert.notEqual(regles.position, 'fixed', 'bouton « ok » fixé en bas de l\'écran (position: fixed)');
    });
    check(`[${v}] rédaction kramail : thème appliqué, mode mobile actif, page marquée page-kramail-compose, un bouton « Envoyer »`, () => {
      verifierSocle(kramail, v, { pageKramailCompose: true });
      assert.equal(kramail.boutons, 1, 'boutons button.btn-primary.pull-right du formulaire de rédaction : ' + kramail.boutons);
      assert.equal(kramail.libelle, 'Envoyer');
    });
    check(`[${v}] rédaction kramail : la barre « Envoyer » reste fixe`, () => {
      assert.equal(kramail.position, 'fixed', 'barre « Envoyer » : position = ' + kramail.position);
    });
  });
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
