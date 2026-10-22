// Modale d'ordre (épopée 2, ticket 2.2, balle traçante) : socle commun à l'ordinateur et au mobile.
// Une confirmation Bootbox qui contient le formulaire d'ordre (#ajax-order form[name="post_msg"]) est marquée (kr-order-modal sur la
// modale, kr-order-form sur le contenu traité) et ses boutons portent « Annuler » / « Valider » (H2.1). Quand le contenu de #ajax-order
// est remplacé (autre ordre : updateAjax du site remplace son innerHTML ; chargement Ajax), le marquage est refait sur le nouveau contenu,
// sans doublon. Une confirmation hors ordre garde « Cancel » / « OK ». Matrice du plan, une vérification par ligne : Dormir, Pouvoir,
// contenu remplacé, appel double, confirmation hors ordre, seuil ; à 375 × 667, 767, 768, 769, 1280, 1440 et 1920 px.
// Appel double : sur mobile, l'observateur des modales est enregistré deux fois (initCharacterModalMobile à l'initialisation et dans
// initMobileFeatures) ; un journal des mutations (attribut class, enfants des boutons) compte les écritures du socle : une seule chacune.
// Gardes des limites du plan : sur ordinateur, la chaîne mobile n'est pas étendue (grille d'onglets en style en ligne, indicateurs de
// balayage, repli de l'aide, pastilles) ; sur mobile, la mise en forme existante reste appliquée (repli de la première alerte et pastilles :
// entrées 3 et 4) ; boutons, formulaire et gestionnaire natifs intacts, aucun envoi. Peau coupée : modale native.
// Page = FIXTURE SYNTHÉTIQUE (tests/e2e/fixtures/modale-ordre/ : plateau minimal, contenus Dormir et Pouvoir inventés sur la structure
// native relevée le 2026-10-22) ; vrai Bootbox 4.4.0, Bootstrap 3.3.7 et jQuery 3.3.1 du site (harnais tests/e2e/vendor/parler/), servis
// à leurs adresses. Ouverture par bootbox.confirm comme le site (contenu de l'ordre dans le message, libellés par défaut). Aucun clic,
// aucune validation, aucun envoi. Confinement réseau (lib/confinement.mjs).
//
// Usage : npm run build && node tests/e2e/modale-ordre.mjs   (ou npm run test:zone -- modale-ordre)
// Options : KR_SCRIPT (bundle testé), KR_SHOTS=/dossier (captures hors dépôt), KR_FRAG = mobile, bureau, largeurs, seuil (vide = tout).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { THEME_READY, frames, krReady, waitState } from './lib/settle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const userscript = fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const FIXTURES = path.join(here, 'fixtures/modale-ordre');
const VENDOR = path.join(here, 'vendor/parler');
const lire = f => fs.readFileSync(path.join(FIXTURES, f), 'utf8').replace(/^<!--[\s\S]*?-->\s*/, '');
const PLATEAU = lire('plateau.html');
const DORMIR = lire('dormir.html');
const POUVOIR = lire('pouvoir.html');
const SHOTS = process.env.KR_SHOTS || '';
const BASE = 'http://www.kraland.org';
const PAGE = BASE + '/jouer/plateau';
// Fichiers natifs aux adresses du site (relevé de tests/e2e/fixtures/parler/native-manifest.json) -> copies du harnais de Parler
const NATIFS = {
  '/lib/bootstrap-3.3.7/css/bootstrap1.min.css': 'bootstrap1.min.css',
  '/lib/kraland-7.0.9/css/main.css': 'main.css',
  '/lib/kraland-7.0.9/css/bootswatch.css': 'bootswatch.css',
  '/lib/kraland-7.0.9/css/minichat.css': 'minichat.css',
  '/lib/kraland-7.0.9/css/game.css': 'game.css',
  '/lib/jquery-3.3.1/jquery-3.3.1.min.js': 'jquery.min.js',
  '/lib/bootstrap-3.3.7/js/bootstrap.min.js': 'bootstrap.min.js',
  '/lib/bootbox-4.4.0/bootbox.min.js': 'bootbox.min.js'
};
const HORS_ORDRE = 'Retirer ce personnage de vos contacts ?';
const CHARGEMENT = '<div id="ajax-order"><p>Chargement de l\'ordre…</p></div>';
const enOrdre = html => `<div id="ajax-order">${html}</div>`;
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

let failures = 0;
let checks = 0;
function check(name, fn) {
  checks += 1;
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const browser = await launchBrowser();

// Document-start (bundle @run-at document-start sous Tampermonkey) : bundle évalué dès que <html> existe, comme fin-initialisation.mjs
// (mode start). Le parseur ne livre cet observateur qu'à son premier script : sans script avant <body>, l'injection tomberait après
// <body>. La page est donc servie avec un script en tête de <head>, avant la balise viewport : <body> absent et largeur par défaut
// (≈ 980 px) à l'injection sur mobile (G-01), comme sur un téléphone ; l'état relevé à l'injection (window.__krInjection) le prouve.
const PLATEAU_DEBUT = PLATEAU.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <script>window.__krScriptTete = true;</script>');

async function ouvrirPage({ width, height, mobile = false, theme = true, variante = 'kraland', debut = false }) {
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const denied = await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route(BASE + '/**', route => {
    const req = route.request();
    const url = new URL(req.url());
    if (req.method() === 'GET' && url.pathname === '/jouer/plateau') { return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: debut ? PLATEAU_DEBUT : PLATEAU }); }
    if (req.method() === 'GET' && NATIFS[url.pathname]) { return route.fulfill({ path: path.join(VENDOR, NATIFS[url.pathname]), contentType: url.pathname.endsWith('.css') ? 'text/css' : 'application/javascript' }); }
    return route.fallback();
  });
  await context.addInitScript(({ src, actif, v, start }) => {
    window.GM = { xmlHttpRequest: () => {} };
    window.__submits = 0;
    window.__confirmations = 0;
    window.HTMLFormElement.prototype.submit = () => { window.__submits += 1; };
    window.HTMLFormElement.prototype.requestSubmit = () => { window.__submits += 1; };
    document.addEventListener('submit', e => { e.preventDefault(); window.__submits += 1; }, true);
    localStorage.setItem('kr-theme-enabled', actif ? 'true' : 'false');
    localStorage.setItem('kr-theme-variant', v);
    // eslint-disable-next-line no-eval
    const go = () => { window.__krInjection = { body: !!document.body, largeur: window.innerWidth }; (0, eval)(src); };
    if (start) {
      if (document.documentElement) { go(); } else { new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); go(); } }).observe(document, { childList: true }); }
      return;
    }
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { src: userscript, actif: theme, v: variante, start: debut });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(PAGE, { waitUntil: 'load' });
  await krReady(page, { ready: theme ? THEME_READY : null, label: `plateau ${width} px` });
  await waitState(page, () => !!window.bootbox && !!window.jQuery);
  await page.evaluate(PREPARER);
  return { context, page, denied, errors };
}

// Dans la page, une fois : boutons et gestionnaire du pied relevés à l'ouverture (show.bs.modal, avant le socle), fin du fondu
// (shown.bs.modal), journal des mutations (attribut class et enfants, sous body) pour compter les écritures du socle.
const PREPARER = () => {
  window.__shown = [];
  window.__natifs = new Map();
  const pied = m => ((window.jQuery._data(m, 'events') || {}).click || []).filter(h => h.selector === '.modal-footer button').map(h => h.handler);
  window.__pied = pied;
  window.jQuery(document).on('show.bs.modal', e => { window.__natifs.set(e.target, { boutons: [...e.target.querySelectorAll('.modal-footer button')], pied: pied(e.target) }); });
  window.jQuery(document).on('shown.bs.modal', e => { window.__shown.push(e.target); });
  window.__krLog = [];
  window.__krObs = new MutationObserver(records => { window.__krLog.push(...records); });
  window.__krObs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
};
// Ouverture comme le site : bootbox.confirm(message, rappel), libellés par défaut (« Cancel » / « OK »). Le rappel ne valide rien.
const OUVRIR = message => {
  const m = window.bootbox.confirm(message, () => { window.__confirmations += 1; return false; })[0];
  window.__modale = m;
  const f = m.querySelector('#ajax-order form[name="post_msg"]');
  window.__ordre = { modal: m, contenus: f ? [f] : [], boutons: [...m.querySelectorAll('.modal-footer button')] };
};
// Autre ordre choisi : updateAjax du site remplace le innerHTML de #ajax-order par la réponse.
const REMPLACER = html => {
  document.getElementById('ajax-order').innerHTML = html;
  const f = window.__modale.querySelector('#ajax-order form[name="post_msg"]');
  if (f) { window.__ordre.contenus.push(f); }
};
const ETAT = () => {
  const m = window.__modale;
  const bouton = h => m.querySelector(`.modal-footer [data-bb-handler="${h}"]`);
  const form = m.querySelector('#ajax-order form[name="post_msg"]');
  const marques = [...m.querySelectorAll('.kr-order-form')];
  const n = window.__natifs.get(m);
  const pied = window.__pied(m);
  return {
    libelles: [bouton('cancel'), bouton('confirm')].map(b => (b ? b.textContent : null)),
    marquee: m.classList.contains('kr-order-modal'),
    modalesMarquees: document.querySelectorAll('.kr-order-modal').length,
    contenusMarques: marques.length,
    contenuCourantMarque: !!form && marques.length === 1 && marques[0] === form,
    titre: form ? form.querySelector('.tab-pane.active h4 strong').textContent.trim().split(/\s+/)[0] : null,
    natif: !!n && n.boutons.length === 2 && n.boutons[0] === bouton('cancel') && n.boutons[1] === bouton('confirm')
      && n.boutons.every(b => b.type === 'button') && n.boutons[0].classList.contains('btn-default') && n.boutons[1].classList.contains('btn-primary')
      && n.pied.length === 1 && pied.length === 1 && pied[0] === n.pied[0]
      && (!form || (form.getAttribute('action') === '/fixture/envoi-bloque' && form.method === 'post' && form.querySelectorAll('input[type="hidden"]').length === 5))
  };
};
// Chaîne mobile existante (enhanceCharacterModal, 150 ms après l'insertion, mobile seulement) : traces dans la modale ouverte.
const CHAINE = () => {
  const m = window.__modale;
  const ul = m.querySelector('.panel-heading ul.nav-tabs');
  const repli = m.querySelector('.kr-alert-collapsible');
  return {
    transformee: m.dataset.structureTransformed === 'true',
    piedMobile: !!m.querySelector('.modal-footer.kraland-modal-footer'),
    grilleEnLigne: !!ul && ul.style.getPropertyValue('display') === 'grid',
    indicateurs: m.querySelectorAll('.kr-tabs-indicator').length,
    replis: m.querySelectorAll('.kr-alert-collapsible, .kr-alert-toggle').length,
    repliSurAvertissement: !!repli && repli.classList.contains('alert-warning'),
    pastilles: m.querySelectorAll('.kr-action-badges .kr-badge').length
  };
};
// Écritures du socle d'après le journal : pour chaque élément, valeur de class avant et après chaque écriture (après = avant de la
// suivante, ou valeur actuelle). Ajout ou retrait du repère, ou écriture neutre (valeur inchangée, repère présent) ; enfants des boutons.
const AUDIT = () => {
  window.__krLog.push(...window.__krObs.takeRecords());
  const has = (v, t) => (' ' + (v || '') + ' ').includes(' ' + t + ' ');
  const effets = (el, jeton) => {
    const avants = window.__krLog.filter(r => r.type === 'attributes' && r.target === el).map(r => r.oldValue || '');
    const out = { ajouts: 0, retraits: 0, neutres: 0 };
    avants.forEach((avant, i) => {
      const apres = i + 1 < avants.length ? avants[i + 1] : (el.getAttribute('class') || '');
      if (has(avant, jeton) !== has(apres, jeton)) { out[has(apres, jeton) ? 'ajouts' : 'retraits'] += 1; } else if (avant === apres && has(apres, jeton)) { out.neutres += 1; }
    });
    return out;
  };
  const o = window.__ordre;
  return {
    modale: effets(o.modal, 'kr-order-modal'),
    contenus: o.contenus.map(f => effets(f, 'kr-order-form')),
    libelles: o.boutons.map(b => window.__krLog.filter(r => r.type === 'childList' && r.target === b).length)
  };
};

// Modale affichée (fin du fondu) et, sur mobile, chaîne mobile passée (drapeau data-structure-transformed ; pour un ordre, indicateurs
// d'onglets des deux passages de l'observateur enregistré deux fois), puis deux images.
async function attendre(page, ordre) {
  await waitState(page, o => {
    const m = window.__modale;
    if (!window.__shown.includes(m)) { return false; }
    if (!document.body.classList.contains('mobile-mode')) { return true; }
    return m.dataset.structureTransformed === 'true' && (!o || m.querySelectorAll('.kr-tabs-indicator').length >= 2);
  }, ordre);
  await frames(page, 2);
}
async function fermer(page) {
  await page.evaluate(() => { window.__fermee = window.__modale; window.jQuery(window.__modale).modal('hide'); });
  await waitState(page, () => !document.body.contains(window.__fermee) && !document.querySelector('.modal-backdrop'));
}
async function capture(page, nom) {
  if (!SHOTS) { return; }
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: path.join(SHOTS, `modale-ordre-${nom}.png`) });
}

async function scenario(cfg) {
  const { context, page, denied, errors } = await ouvrirPage(cfg);
  const tag = cfg.width + (cfg.mobile ? '-mobile' : '');
  const r = { cfg, mobileMode: await page.evaluate(() => document.body.classList.contains('mobile-mode')), audits: {}, remplace: [] };
  await page.evaluate(OUVRIR, enOrdre(DORMIR));
  await attendre(page, true);
  r.dormir = await page.evaluate(ETAT);
  r.chaine = await page.evaluate(CHAINE);
  await capture(page, tag + '-dormir');
  for (const html of [POUVOIR, DORMIR]) {
    await page.evaluate(REMPLACER, html);
    await frames(page, 2);
    r.remplace.push(await page.evaluate(ETAT));
  }
  r.audits.dormir = await page.evaluate(AUDIT);
  await fermer(page);
  await page.evaluate(OUVRIR, enOrdre(POUVOIR));
  await attendre(page, true);
  r.pouvoir = await page.evaluate(ETAT);
  r.audits.pouvoir = await page.evaluate(AUDIT);
  await capture(page, tag + '-pouvoir');
  await fermer(page);
  if (cfg.ajax) {
    await page.evaluate(OUVRIR, CHARGEMENT);
    await attendre(page, false);
    r.ajaxAvant = await page.evaluate(ETAT);
    await page.evaluate(REMPLACER, DORMIR);
    await frames(page, 2);
    r.ajaxApres = await page.evaluate(ETAT);
    r.audits.ajax = await page.evaluate(AUDIT);
    await fermer(page);
  }
  await page.evaluate(OUVRIR, HORS_ORDRE);
  await attendre(page, false);
  r.horsOrdre = await page.evaluate(ETAT);
  r.audits.horsOrdre = await page.evaluate(AUDIT);
  await capture(page, tag + '-hors-ordre');
  await fermer(page);
  r.envoi = await page.evaluate(() => ({ submits: window.__submits, confirmations: window.__confirmations }));
  r.posts = denied.filter(d => d.method !== 'GET').map(d => d.method + ' ' + d.url);
  r.errors = errors.slice();
  await context.close();
  return r;
}

const SANS_EFFET = { ajouts: 0, retraits: 0, neutres: 0 };
const UNE_FOIS = { ajouts: 1, retraits: 0, neutres: 0 };
function socle(e, titre) {
  assert.deepEqual(e.libelles, ['Annuler', 'Valider'], 'libellés ' + JSON.stringify(e.libelles));
  assert.equal(e.marquee, true, 'modale sans kr-order-modal');
  assert.equal(e.modalesMarquees, 1, `${e.modalesMarquees} modale(s) marquée(s) dans la page`);
  assert.equal(e.contenusMarques, 1, `${e.contenusMarques} contenu(s) marqué(s) kr-order-form`);
  assert.equal(e.contenuCourantMarque, true, 'le contenu affiché n\'est pas celui qui est marqué');
  assert.equal(e.titre, titre, 'contenu affiché');
}
function uneFois(a, nom, contenus) {
  assert.deepEqual(a.modale, UNE_FOIS, `${nom}, marque de la modale : ${JSON.stringify(a.modale)}`);
  assert.equal(a.contenus.length, contenus, `${nom} : contenus suivis`);
  a.contenus.forEach((c, i) => assert.deepEqual(c, UNE_FOIS, `${nom}, contenu ${i + 1} : ${JSON.stringify(c)}`));
  assert.deepEqual(a.libelles, [1, 1], `${nom}, écritures des libellés (Annuler, Valider) : ${a.libelles}`);
}

function verifier(r) {
  const tag = `${r.cfg.width} px${r.cfg.mobile ? ' (mobile, ' + r.cfg.width + ' × ' + r.cfg.height + ')' : ''}`;
  check(`${tag} Dormir (avertissement avant les onglets) : boutons « Annuler » / « Valider », modale marquée une fois`, () => socle(r.dormir, 'Dormir'));
  check(`${tag} Pouvoir (aide puis blocage dans l'onglet, onglet en span.text-danger) : boutons « Annuler » / « Valider », modale marquée une fois`, () => socle(r.pouvoir, 'Pouvoir'));
  check(`${tag} contenu de #ajax-order remplacé deux fois (Pouvoir puis Dormir) : marquage refait sur chaque nouveau contenu, sans doublon ; libellés toujours « Annuler » / « Valider »`, () => {
    socle(r.remplace[0], 'Pouvoir');
    socle(r.remplace[1], 'Dormir');
  });
  check(`${tag} appel double${r.mobileMode ? ' (mobile : observateur des modales enregistré deux fois)' : ''} : chaque effet du socle écrit une seule fois (marque de la modale, de chaque contenu, libellés)`, () => {
    if (r.mobileMode) { assert.equal(r.chaine.indicateurs, 2, 'la chaîne mobile n\'est pas passée deux fois : appel double non reproduit'); }
    uneFois(r.audits.dormir, 'Dormir puis 2 remplacements', 3);
    uneFois(r.audits.pouvoir, 'Pouvoir', 1);
  });
  check(`${tag} confirmation hors ordre (bootbox.confirm sans #ajax-order) : « Cancel » / « OK » inchangés, aucun marquage`, () => {
    assert.deepEqual(r.horsOrdre.libelles, ['Cancel', 'OK'], 'libellés ' + JSON.stringify(r.horsOrdre.libelles));
    assert.deepEqual([r.horsOrdre.marquee, r.horsOrdre.modalesMarquees, r.horsOrdre.contenusMarques], [false, 0, 0], 'marquage (modale, modales marquées, contenus) ' + JSON.stringify([r.horsOrdre.marquee, r.horsOrdre.modalesMarquees, r.horsOrdre.contenusMarques]));
    assert.deepEqual(r.audits.horsOrdre.modale, SANS_EFFET, 'écritures de kr-order-modal ' + JSON.stringify(r.audits.horsOrdre.modale));
    assert.deepEqual(r.audits.horsOrdre.libelles, [0, 0], 'écritures des libellés ' + r.audits.horsOrdre.libelles);
  });
  check(`${tag} envoi natif intact : mêmes boutons (data-bb-handler, classes), même gestionnaire Bootbox du pied, formulaire inchangé ; aucun envoi ni confirmation, aucune requête POST, aucune erreur JavaScript`, () => {
    const etats = { dormir: r.dormir, pouvoir: r.pouvoir, remplace1: r.remplace[0], remplace2: r.remplace[1], horsOrdre: r.horsOrdre };
    assert.deepEqual(Object.entries(etats).filter(([, e]) => !e.natif).map(([k]) => k), [], 'nœuds ou gestionnaires natifs modifiés');
    assert.deepEqual(r.envoi, { submits: 0, confirmations: 0 }, 'envoi ' + JSON.stringify(r.envoi));
    assert.deepEqual(r.posts, [], 'requêtes ' + r.posts.join(' | '));
    assert.deepEqual(r.errors, [], 'erreurs ' + r.errors.join(' | '));
  });
  if (r.mobileMode) {
    check(`${tag} mobile : mise en forme existante toujours appliquée (drapeau data-structure-transformed, pied kraland-modal-footer, grille d'onglets, repli de la première alerte, pastilles : entrées 3 et 4)`, () => {
      const c = r.chaine;
      assert.deepEqual([c.transformee, c.piedMobile, c.grilleEnLigne, c.repliSurAvertissement], [true, true, true, true], JSON.stringify(c));
      assert.ok(c.pastilles >= 2, 'pastilles coût et durée : ' + c.pastilles);
    });
  } else {
    check(`${tag} ordinateur : chaîne mobile non étendue (ni grille d'onglets en style en ligne, ni indicateurs de balayage, ni repli de l'aide, ni pastilles, ni data-structure-transformed)`, () => {
      const c = r.chaine;
      assert.deepEqual([c.transformee, c.piedMobile, c.grilleEnLigne, c.indicateurs, c.replis, c.pastilles], [false, false, false, 0, 0, 0], JSON.stringify(c));
    });
  }
  if (r.cfg.ajax) {
    check(`${tag} chargement Ajax (#ajax-order sans ordre à l'ouverture, ordre inséré ensuite) : rien avant (« Cancel » / « OK »), modale reconnue et marquée une fois après`, () => {
      assert.deepEqual(r.ajaxAvant.libelles, ['Cancel', 'OK'], 'avant, libellés ' + JSON.stringify(r.ajaxAvant.libelles));
      assert.deepEqual([r.ajaxAvant.marquee, r.ajaxAvant.contenusMarques], [false, 0], 'avant, marquage ' + JSON.stringify([r.ajaxAvant.marquee, r.ajaxAvant.contenusMarques]));
      socle(r.ajaxApres, 'Dormir');
      uneFois(r.audits.ajax, 'Ajax', 1);
    });
  }
}

// Document-start : Dormir ouvert dans une page où le bundle a été évalué avant <body> ; seule la fin du fondu est attendue.
async function debutDeDocument(cfg) {
  const { context, page, errors } = await ouvrirPage({ ...cfg, debut: true });
  const injection = await page.evaluate(() => window.__krInjection);
  await page.evaluate(OUVRIR, enOrdre(DORMIR));
  await waitState(page, () => window.__shown.includes(window.__modale));
  await frames(page, 2);
  const e = await page.evaluate(ETAT);
  const audit = await page.evaluate(AUDIT);
  await fermer(page);
  await context.close();
  return { cfg, injection, e, audit, errors };
}
function verifierDebut(d) {
  check(`${d.cfg.width} px${d.cfg.mobile ? ' (mobile)' : ''}, bundle évalué au document-start (avant <body>${d.cfg.mobile ? ', viewport pas encore lue : largeur ≥ 768 px, G-01' : ''}) : Dormir avec « Annuler » / « Valider », modale marquée une fois`, () => {
    assert.equal(d.injection.body, false, 'bundle évalué après <body> : document-start non reproduit');
    if (d.cfg.mobile) { assert.ok(d.injection.largeur >= 768, 'largeur à l\'injection : ' + JSON.stringify(d.injection)); }
    socle(d.e, 'Dormir');
    uneFois(d.audit, 'Dormir', 1);
    assert.deepEqual(d.errors, [], 'erreurs ' + d.errors.join(' | '));
  });
}

const VARIANTES = ['empire-brun-dark', 'kraland'];
const largeur = (width, height, i, extra = {}) => ({ width, height, variante: VARIANTES[i % 2], ...extra });

if (on('mobile')) {
  console.log('Mobile 375 × 667 (tactile)');
  verifier(await scenario(largeur(375, 667, 0, { mobile: true, ajax: true })));
  verifierDebut(await debutDeDocument(largeur(375, 667, 0, { mobile: true })));
}

if (on('bureau')) {
  console.log('Ordinateur 1280 × 720');
  verifier(await scenario(largeur(1280, 720, 1, { ajax: true })));
  verifierDebut(await debutDeDocument(largeur(1280, 720, 1)));
  const { context, page, errors } = await ouvrirPage({ width: 1280, height: 720, theme: false });
  await page.evaluate(OUVRIR, enOrdre(DORMIR));
  await attendre(page, true);
  const e = await page.evaluate(ETAT);
  await fermer(page);
  await context.close();
  check('1280 px, peau coupée (thème désactivé) : modale d\'ordre native, « Cancel » / « OK », aucun marquage, aucune erreur', () => {
    assert.deepEqual(e.libelles, ['Cancel', 'OK'], 'libellés ' + JSON.stringify(e.libelles));
    assert.deepEqual([e.marquee, e.contenusMarques, e.natif], [false, 0, true], '(modale marquée, contenus marqués, natif intact) ' + JSON.stringify([e.marquee, e.contenusMarques, e.natif]));
    assert.deepEqual(errors, [], 'erreurs ' + errors.join(' | '));
  });
}

if (on('largeurs')) {
  console.log('Ordinateur 1440 et 1920 px');
  const res = await mapLimit([largeur(1440, 900, 0), largeur(1920, 1080, 1)], scenario);
  res.forEach(verifier);
}

// Même onglet, saisie en cours dans la page : le franchissement du seuil affiche le bandeau au lieu de recharger, la page garde les
// observateurs de son chargement ; le socle doit rester actif de part et d'autre (aller puis retour).
async function transition(depart, arrivee) {
  const { context, page, errors } = await ouvrirPage({ width: depart, height: 720 });
  await page.evaluate(() => { document.getElementById('champ-saisie').value = 'Saisie en cours'; window.__memeDocument = true; });
  const etats = [];
  for (const w of [arrivee, depart]) {
    await page.setViewportSize({ width: w, height: 720 });
    await waitState(page, ({ largeurAttendue, banniere }) => window.innerWidth === largeurAttendue && !!document.getElementById('kr-resize-banner') === banniere, { largeurAttendue: w, banniere: w !== depart });
    await page.evaluate(OUVRIR, enOrdre(DORMIR));
    await attendre(page, true);
    etats.push({ w, etat: await page.evaluate(ETAT), memeDocument: await page.evaluate(() => window.__memeDocument === true) });
    await fermer(page);
  }
  await context.close();
  check(`transition ${depart} -> ${arrivee} -> ${depart} px dans le même onglet (saisie en cours, sans rechargement) : socle actif des deux côtés du seuil`, () => {
    for (const { w, etat, memeDocument } of etats) {
      assert.equal(memeDocument, true, `${w} px : la page a été rechargée`);
      socle(etat, 'Dormir');
    }
    assert.deepEqual(errors, [], 'erreurs ' + errors.join(' | '));
  });
}

if (on('seuil')) {
  console.log('Seuil 767 / 768 / 769 px');
  const res = await mapLimit([largeur(767, 720, 0), largeur(768, 720, 1), largeur(769, 720, 0)], scenario);
  res.forEach(verifier);
  for (const r of res) {
    check(`${r.cfg.width} px, seuil : socle actif côté ${r.cfg.width < 768 ? 'mobile' : 'ordinateur'} (mode ${r.mobileMode ? 'mobile' : 'ordinateur'} au chargement)`, () => {
      assert.equal(r.mobileMode, r.cfg.width < 768);
      socle(r.dormir, 'Dormir');
      socle(r.pouvoir, 'Pouvoir');
    });
  }
  await transition(769, 767);
  await transition(767, 769);
}

// Fragment inconnu : aucun scénario joué ne doit pas passer pour un succès.
if (checks === 0) { check(`KR_FRAG=${FRAG.join(',')} : aucun scénario joué (fragments : mobile, bureau, largeurs, seuil)`, () => assert.fail('aucune vérification')); }

await browser.close();
console.log(failures === 0 ? `\nModale d'ordre : ${checks} contrôles, tous passent.` : `\nModale d'ordre : ${failures} contrôle(s) en échec sur ${checks}.`);
process.exit(failures === 0 ? 0 : 1);
