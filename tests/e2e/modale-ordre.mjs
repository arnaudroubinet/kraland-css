// Modale d'ordre (épopée 2, ticket 2.2, balle traçante) : socle commun à l'ordinateur et au mobile.
// Une confirmation Bootbox qui contient le formulaire d'ordre (#ajax-order form[name="post_msg"]) est marquée (kr-order-modal sur la
// modale, kr-order-form sur le contenu traité) et ses boutons portent « Annuler » / « Valider » (H2.1). Quand le contenu de #ajax-order
// est remplacé (autre ordre : updateAjax du site remplace son innerHTML ; chargement Ajax), le marquage est refait sur le nouveau contenu,
// sans doublon. Une confirmation hors ordre garde « Cancel » / « OK ». Matrice du plan, une vérification par ligne : Dormir, Pouvoir,
// contenu remplacé, appel double, confirmation hors ordre, seuil ; à 375 × 667, 767, 768, 769, 1280, 1440 et 1920 px.
// Appel double : sur mobile, l'observateur des modales est enregistré deux fois (initCharacterModalMobile à l'initialisation et dans
// initMobileFeatures) ; un journal des mutations (attribut class, enfants des boutons) compte les écritures du socle : une seule chacune.
// Gardes des limites du plan : sur ordinateur, la chaîne mobile n'est pas étendue (grille d'onglets en style en ligne, indicateurs de
// balayage, anciennes pastilles pastel) ; sur mobile, la mise en forme existante reste appliquée (drapeau, pied, grille d'onglets) ;
// boutons, formulaire et gestionnaire natifs intacts, aucun envoi. Peau coupée : modale native.
// Ticket 2.3 (H2.3, R2, H2.4), même socle, mêmes largeurs, sur les deux supports : les blocages (alert-danger) et avertissements
// (alert-warning) ne sont jamais repliés ; ils passent en tête de l'ordre, juste sous son titre (h3 du formulaire), avant ses paragraphes et
// le panneau d'onglets, et restent visibles et non recouverts quand le corps défile. Seule l'aide (alert-order) se replie, derrière
// « ? Aide », bouton standard (fond d'« Annuler », texte du thème) qui la déplie au toucher ou au clic ; fermée par sa croix
// (data-dismiss="alert"), elle emporte « ? Aide ». L'ancien repli
// mobile de la première alerte venue est retiré. « Valider » reste actif. Contrastes de « ? Aide » et du texte des alertes dans les 16
// variantes (lib/variantes.mjs). « ? Aide » = bouton du corps de la modale dont le texte est « Aide », quelle que soit sa classe (l'ancien
// repli mobile en posait un dans la première alerte venue). Ordre long (défilement) : 40 paramètres inventés ajoutés en fin d'onglet ;
// ordre sans alerte : Dormir sans son avertissement ; formulaire sans onglet actif : Dormir sans .tab-content ni .tab-pane.
// Ticket 2.4 (H2.5, Q1, Q5), même socle, mêmes largeurs, sur les deux supports : la ligne native « Coût | Durée | Potentiel » (p.mini du
// pied du panneau d'onglets) devient une seule rangée de pastilles (icône et valeur, 12 px gras, arrondi complet, fond --kr-arm-bg et
// texte --kr-arm-ink) en tête du pied de la modale, juste au-dessus des boutons, visible et non recouverte dès l'ouverture, ordre long
// compris. Dernier segment : « Potentiel: X » ou « Automatique », titré « Potentiel » ; autre segment à libellé inconnu : pastille
// générique titrée de son libellé ; segment vide : aucune pastille. La ligne native reste dans le DOM, masquée, avec le pied du panneau
// qui ne contient qu'elle ; les valeurs suivent le contenu courant (contenu remplacé, ligne réécrite en place, chargement Ajax), sans
// doublon ; plus rien à montrer : rangée retirée, ligne native réaffichée. À l'ouverture, rien ne recouvre le titre de l'ordre, les
// alertes ni « ? Aide », et le texte de l'avertissement de Dormir est entier dans la zone visible (375 × 667 compris). L'ancienne bande
// collante coût et durée du mobile et ses pastilles pastel sont retirées. Contraste du texte des pastilles dans les 16 variantes.
// Variantes dérivées de Dormir : sans ligne de coût (ni avertissement ni pied de panneau) ; sans potentiel (ligne arrêtée après la
// durée) ; segment à libellé inconnu au milieu ; deux segments inconnus (sans libellé au milieu, libellé inconnu en dernier) ; ligne
// sans aucun libellé connu, laissée telle quelle, sans pastille.
// Ticket 2.5 (H2.6, Q25.4), même socle, mêmes largeurs, sur les deux supports : la croix de fermeture de Bootbox (.bootbox-close-button,
// premier enfant du corps, flottante à droite) d'une modale d'ordre mesure 44 × 44 px, entièrement visibles dans le corps de la modale
// (fenêtre rétrécie sous 768 px sans rechargement comprise), prend la couleur du texte du thème (--kr-text-primary), sans voile
// d'opacité (opacité propre et effective 1, survol compris sur ordinateur), avec un contraste ≥ 3:1 sur le fond de la modale
// (16 variantes), à sa place native : même coin haut droit que la croix d'une confirmation hors ordre, et glyphe au même endroit que le
// sien (centre à 3 px près) ; à l'ouverture, après un autre ordre, après un chargement Ajax, de part et d'autre du seuil. Touchée ou
// cliquée en son centre (elementFromPoint : la croix), elle referme la modale sans valider (réponse false de Bootbox, aucun envoi). La
// croix d'une confirmation hors ordre ne change pas (relevé du bundle 061fd4a : Bootstrap sur ordinateur, règle mobile commune sur
// mobile).
// Page = FIXTURE SYNTHÉTIQUE (tests/e2e/fixtures/modale-ordre/ : plateau minimal, contenus Dormir et Pouvoir inventés sur la structure
// native relevée le 2026-10-22) ; vrai Bootbox 4.4.0, Bootstrap 3.3.7 et jQuery 3.3.1 du site (harnais tests/e2e/vendor/parler/), servis
// à leurs adresses. Ouverture par bootbox.confirm comme le site (contenu de l'ordre dans le message, libellés par défaut). Seuls gestes :
// « ? Aide », la croix de l'aide et la croix de la modale (survolée d'abord sur ordinateur), touchés ou cliqués ; aucune validation,
// aucun envoi. Confinement réseau (lib/confinement.mjs).
//
// Usage : npm run build && node tests/e2e/modale-ordre.mjs   (ou npm run test:zone -- modale-ordre)
// Options : KR_SCRIPT (bundle testé), KR_SHOTS=/dossier (captures hors dépôt), KR_FRAG = mobile, bureau, largeurs, seuil, variantes
// (vide = tout).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { THEME_READY, frames, krReady, styleSettled, waitState } from './lib/settle.mjs';
import { CONTRASTE, VARIANTE_POSEE, choisirVariante, parVariante } from './lib/variantes.mjs';

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
// Ordre sans blocage ni avertissement : Dormir sans son avertissement (le site ne l'affiche que près de la limite de la nuit).
const SANS_ALERTE = DORMIR.replace(/\s*<div class="alert alert-warning[^>]*>[\s\S]*?<\/div>/, '');
if (SANS_ALERTE === DORMIR || /alert-(warning|danger)/.test(SANS_ALERTE)) { throw new Error('fixture Dormir : avertissement introuvable'); }
// Formulaire sans onglet actif (structure inconnue) : Dormir sans .tab-content ni .tab-pane, le contenu de l'onglet reste dans le panneau.
const SANS_ONGLET = DORMIR.replace('<div class="tab-content">', '<div>').replace('<div class="tab-pane active">', '<div>');
if (/tab-(content|pane)/.test(SANS_ONGLET)) { throw new Error('fixture Dormir : onglet introuvable'); }
// Ordre sans ligne de coût (ticket 2.4) : Dormir sans avertissement ni pied de panneau (aucun .panel-footer p.mini).
const SANS_COUT = SANS_ALERTE.replace(/\s*<div class="panel-footer">[\s\S]*?<\/div>/, '');
if (SANS_COUT === SANS_ALERTE || /panel-footer/.test(SANS_COUT)) { throw new Error('fixture Dormir : pied de panneau introuvable'); }
// Lignes de coût dérivées de Dormir (ticket 2.4) : sans potentiel (ligne arrêtée après la durée), segment à libellé inconnu au milieu,
// deux segments inconnus (sans libellé au milieu, libellé inconnu en dernier), aucun libellé connu (structure inconnue).
const avecLigne = texte => {
  const html = DORMIR.replace('Coût: 0 FK | Durée: 00:00 | Automatique', texte);
  if (html === DORMIR) { throw new Error('fixture Dormir : ligne de coût introuvable'); }
  return html;
};
const SANS_POTENTIEL = avecLigne('Coût: 0 FK | Durée: 00:00 | ');
const SEGMENT_MILIEU = avecLigne('Coût: 0 FK | Portée: 2 | Durée: 00:00 | Automatique');
const DEUX_INCONNUS = avecLigne('Coût: 0 FK | Durée: 00:00 | Sans libellé | Portée: 2');
const LIGNE_INCONNUE = avecLigne('Texte inventé sans libellé connu');
// Ligne réécrite en place (ticket 2.4) : valeurs changées ; ligneServie : pied de panneau servi qui porte une ligne donnée (comparaison).
const LIGNE_MODIFIEE = 'Coût: 3 FK | Durée: 01:00 | Automatique';
const ligneServie = texte => `<div class="panel with-nav-tabs"><div class="panel-footer"><p class="mini">${texte}</p></div></div>`;
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
  // Variante choisie avant l'évaluation du bundle (outil des 16 variantes) ; peau coupée : thème désactivé.
  if (theme) { await context.addInitScript(choisirVariante, variante); } else { await context.addInitScript(() => localStorage.setItem('kr-theme-enabled', 'false')); }
  await context.addInitScript(({ src, start }) => {
    window.GM = { xmlHttpRequest: () => {} };
    window.__submits = 0;
    window.__confirmations = 0;
    window.HTMLFormElement.prototype.submit = () => { window.__submits += 1; };
    window.HTMLFormElement.prototype.requestSubmit = () => { window.__submits += 1; };
    document.addEventListener('submit', e => { e.preventDefault(); window.__submits += 1; }, true);
    // eslint-disable-next-line no-eval
    const go = () => { window.__krInjection = { body: !!document.body, largeur: window.innerWidth }; (0, eval)(src); };
    if (start) {
      if (document.documentElement) { go(); } else { new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); go(); } }).observe(document, { childList: true }); }
      return;
    }
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { src: userscript, start: debut });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(PAGE, { waitUntil: 'load' });
  await krReady(page, { ready: theme ? THEME_READY : null, label: `plateau ${width} px` });
  await waitState(page, () => !!window.bootbox && !!window.jQuery);
  await page.evaluate(PREPARER);
  await page.evaluate(CONTRASTE);
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
// Chaîne mobile existante (enhanceCharacterModal, 150 ms après l'insertion, mobile seulement) : traces dans la modale ouverte. replis :
// ancien repli de la première alerte (makeAlertCollapsible), retiré au ticket 2.3 ; pastel : anciennes pastilles pastel
// (formatFooterAsBadges) et bande collante coût et durée (kraland-action-footer), retirées au ticket 2.4.
const CHAINE = () => {
  const m = window.__modale;
  const ul = m.querySelector('.panel-heading ul.nav-tabs');
  return {
    transformee: m.dataset.structureTransformed === 'true',
    piedMobile: !!m.querySelector('.modal-footer.kraland-modal-footer'),
    grilleEnLigne: !!ul && ul.style.getPropertyValue('display') === 'grid',
    indicateurs: m.querySelectorAll('.kr-tabs-indicator').length,
    replis: m.querySelectorAll('.kr-alert-collapsible, .kr-alert-toggle, .kr-alert-content').length,
    pastel: m.querySelectorAll('.kr-action-badges, .kr-badge, .kraland-action-footer').length
  };
};

// Rangement des alertes (ticket 2.3), dans la modale ouverte, comparé à `html` (contenu de l'ordre tel que servi). lecture : dans l'ordre
// du document, titre de l'ordre (h3 enfant du formulaire), blocages, avertissements, titre de l'onglet actif (h4), « ? Aide », aide repliée
// ou dépliée ; bloc : place du conteneur kr-order-alerts (juste après le titre de l'ordre, ou ailleurs). Une alerte est rendue (ni display
// none, ni hidden, ni taille nulle) et entière (tout son texte affiché : innerText = textContent) ; son texte natif est inchangé. aides :
// chaque aide, repliée ou non, précédée ou non de « ? Aide » ; blocs : conteneurs kr-order-alerts du formulaire ; place : parent d'une
// alerte (formulaire ou autre).
const RANGEMENT = html => {
  const m = window.__modale;
  const form = m.querySelector('#ajax-order form[name="post_msg"]');
  if (!form) { return null; }
  const pane = form.querySelector('.tab-pane.active');
  const titre = form.querySelector(':scope > h3');
  const norm = s => s.replace(/\s+/g, ' ').trim();
  const rendu = el => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return !el.closest('[hidden]') && s.display !== 'none' && s.visibility === 'visible' && Number(s.opacity) > 0 && r.width > 0 && r.height > 0; };
  const estAide = el => el.matches('button') && el.textContent.trim() === 'Aide';
  const estAlerte = el => el.matches('.alert-danger, .alert-warning') && !el.matches('.alert-order');
  const nom = el => {
    if (el === titre) { return 'titre'; }
    if (el.matches('h4') && !!pane && pane.contains(el)) { return 'onglet'; }
    if (estAlerte(el)) { return el.matches('.alert-danger') ? 'blocage' : 'avertissement'; }
    if (el.matches('.alert-order')) { return rendu(el) ? 'aide dépliée' : 'aide repliée'; }
    return estAide(el) ? '? Aide' : null;
  };
  const lecture = [...form.querySelectorAll('h3, h4, .alert, button')].map(nom).filter(Boolean);
  const box = form.querySelector('.kr-order-alerts');
  const alertes = [...form.querySelectorAll('.alert')].filter(estAlerte);
  const t = document.createElement('template');
  t.innerHTML = html;
  const natifs = [...t.content.querySelectorAll('.alert')].filter(estAlerte).map(a => norm(a.textContent));
  const valider = m.querySelector('.modal-footer [data-bb-handler="confirm"]');
  const sv = getComputedStyle(valider);
  return {
    lecture,
    bloc: box ? (box.parentElement === form && !!titre && box.previousElementSibling === titre ? 'sous le titre' : 'ailleurs') : null,
    boutons: [...m.querySelectorAll('.modal-body button')].filter(estAide).map(b => ({ type: b.type, expanded: b.getAttribute('aria-expanded') })),
    hauteurAide: Math.min(...[...m.querySelectorAll('.modal-body button')].filter(estAide).map(b => b.getBoundingClientRect().height)),
    alertes: alertes.map(a => ({ texte: norm(a.textContent), rendue: rendu(a), entiere: norm(a.innerText) === norm(a.textContent), place: a.parentElement === form ? 'formulaire' : 'autre' })),
    aides: [...form.querySelectorAll('.alert-order')].map(h => ({ repliee: !rendu(h), precedee: !!h.previousElementSibling && estAide(h.previousElementSibling) })),
    blocs: form.querySelectorAll('.kr-order-alerts').length,
    textesIntacts: JSON.stringify(alertes.map(a => norm(a.textContent))) === JSON.stringify(natifs),
    valider: !valider.disabled && !valider.classList.contains('disabled') && valider.getAttribute('aria-disabled') !== 'true' && sv.pointerEvents !== 'none' && Number(sv.opacity) === 1
  };
};
// Ordre sans alerte : rien d'autre que l'aide ne change. Copie du formulaire affiché sans « ? Aide » ni attribut hidden de l'aide, comparée
// au contenu servi : onglet identique au balisage près, mêmes enfants directs du formulaire (classes de la chaîne mobile kr- / kraland- ôtées).
const INCHANGE = html => {
  const form = window.__modale.querySelector('#ajax-order form[name="post_msg"]');
  const t = document.createElement('template');
  t.innerHTML = html;
  const natif = t.content.querySelector('form');
  const copie = form.cloneNode(true);
  copie.querySelectorAll('button').forEach(b => { if (b.textContent.trim() === 'Aide') { b.remove(); } });
  copie.querySelectorAll('.alert-order').forEach(a => a.removeAttribute('hidden'));
  const onglet = f => f.querySelector('.tab-pane.active').innerHTML;
  const enfants = f => [...f.children].map(e => e.tagName + '.' + [...e.classList].filter(c => !/^(kr-|kraland-)/.test(c)).sort().join('.'));
  return { onglet: onglet(copie) === onglet(natif), enfants: JSON.stringify(enfants(copie)) === JSON.stringify(enfants(natif)) };
};
// Ordre long (paramètres de l'ordre, Q25.1) : 40 lignes inventées en fin d'onglet, pour que le corps de la modale défile à toutes les largeurs.
const ALLONGER = html => {
  const t = document.createElement('template');
  t.innerHTML = html;
  const pane = t.content.querySelector('.tab-pane.active');
  for (let i = 1; i <= 40; i += 1) { const p = document.createElement('p'); p.textContent = `Paramètre inventé ${i}`; pane.append(p); }
  return t.innerHTML;
};
// Défilement : conteneur qui défile (premier ancêtre de l'alerte dont le contenu dépasse), mené par scrollTo en haut, au milieu et en
// bas. Au milieu et en bas (bloc collé), le texte de l'alerte (boîte de son contenu, Range) est dans la zone visible du conteneur et de
// la fenêtre, et elementFromPoint touche l'alerte en 5 points de ce texte (centre et quatre points intérieurs) : rien ne la recouvre. En
// haut (ouverture), les points visibles (visibles) la touchent tous (texte entier à l'ouverture : OUVERTURE). En bas, le titre de
// l'onglet est sorti : défilement réel. opaque : entre l'alerte et le bloc collant qui la porte, un fond opaque (les teintes d'état du
// mode sombre sont à 15 % : sans lui, le contenu qui défile dessous transparaîtrait). bord : écart entre le haut du bloc collant et le haut
// de la zone visible du conteneur ; collé (en bas), 0 : aucune bande de contenu ne défile au-dessus de lui.
const DEFILEMENT = async () => {
  const m = window.__modale;
  const a = [...m.querySelectorAll('.alert-danger, .alert-warning')].find(x => !x.matches('.alert-order'));
  let sc = a.parentElement;
  while (sc && !(sc.scrollHeight > sc.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(sc).overflowY))) { sc = sc.parentElement; }
  if (!sc) { return { conteneur: null, max: 0, etats: [] }; }
  let collant = a;
  while (collant && collant !== sc && getComputedStyle(collant).position !== 'sticky') { collant = collant.parentElement; }
  let opaque = false;
  for (let e = a; collant && collant !== sc && e && !opaque; e = e === collant ? null : e.parentElement) {
    const fond = getComputedStyle(e).backgroundColor.match(/[\d.]+/g).map(Number);
    opaque = fond.length === 3 || fond[3] === 1;
  }
  const titre = m.querySelector('#ajax-order .tab-pane.active h4');
  const image = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const mesure = () => {
    const texte = document.createRange();
    texte.selectNodeContents(a);
    const t = texte.getBoundingClientRect();
    const v = sc.getBoundingClientRect();
    const points = [[0.5, 0.5], [0.1, 0.25], [0.9, 0.25], [0.1, 0.75], [0.9, 0.75]].map(([fx, fy]) => [t.left + t.width * fx, t.top + t.height * fy]);
    const touches = points.filter(([x, y]) => { const h = document.elementFromPoint(x, y); return !!h && (h === a || a.contains(h)); }).length;
    const visibles = points.filter(([, y]) => y >= v.top && y <= v.bottom).length;
    const bord = collant && collant !== sc ? Math.round(collant.getBoundingClientRect().top - v.top - sc.clientTop) : null;
    return { scrollTop: Math.round(sc.scrollTop), dedans: t.height > 0 && t.top >= v.top - 0.5 && t.bottom <= v.bottom + 0.5 && t.top >= 0 && t.bottom <= window.innerHeight, touches, titreSorti: titre.getBoundingClientRect().bottom <= v.top + 1, bord, visibles };
  };
  const max = sc.scrollHeight - sc.clientHeight;
  const etats = [];
  for (const f of [0, 0.5, 1]) { sc.scrollTo(0, Math.round(max * f)); await image(); etats.push(mesure()); }
  return { conteneur: sc === m.querySelector('.modal-body') ? 'modal-body' : sc.className, max, etats, opaque };
};
// Lien « [?] » du titre de l'ordre (règles, span.mention.pull-right du h4) : amené au milieu du corps par scrollTo, loin des zones
// collantes de la chaîne mobile, puis elementFromPoint en son centre : le lien ou son enfant, rien ne le recouvre.
const LIEN_REGLES = async () => {
  const m = window.__modale;
  const lien = m.querySelector('#ajax-order .tab-pane.active h4 .mention a');
  if (!lien) { return { lien: false }; }
  const sc = m.querySelector('.modal-body');
  const v = sc.getBoundingClientRect();
  const r0 = lien.getBoundingClientRect();
  sc.scrollTo(0, sc.scrollTop + (r0.top + r0.height / 2) - (v.top + v.height / 2));
  await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
  const r = lien.getBoundingClientRect();
  const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return { lien: true, libre: !!h && (h === lien || lien.contains(h)), cible: h ? h.tagName.toLowerCase() + '.' + [...h.classList].join('.') : null };
};
// Ouverture (tickets 2.3 et 2.4), corps de la modale non défilé : titre de l'ordre (h3 du formulaire), titre de l'onglet (h4), blocages
// et avertissements, « ? Aide ». Pour chacun, visibles : ceux de ses cinq points (centre et quatre points intérieurs) qui sont dans la zone
// visible du corps et de la fenêtre (aucun pour un élément de taille nulle, comme le h3 vide de Dormir) ; touches : ceux où
// elementFromPoint touche l'élément ou son enfant (rien ne les recouvre) ; entier (alertes) : boîte de leur texte (Range) entière dans la
// zone visible du corps et de la fenêtre.
const OUVERTURE = () => {
  const m = window.__modale;
  const sc = m.querySelector('.modal-body');
  const v = sc.getBoundingClientRect();
  const form = m.querySelector('#ajax-order form[name="post_msg"]');
  const alertes = [...form.querySelectorAll('.alert-danger, .alert-warning')].filter(a => !a.matches('.alert-order'));
  const aide = [...m.querySelectorAll('.modal-body button')].find(b => b.textContent.trim() === 'Aide');
  const cibles = [['titre', form.querySelector(':scope > h3')], ['onglet', form.querySelector('.tab-pane.active h4')], ...alertes.map(a => [a.matches('.alert-danger') ? 'blocage' : 'avertissement', a]), ['? Aide', aide]];
  const dedans = r => r.height > 0 && r.top >= v.top - 0.5 && r.bottom <= v.bottom + 0.5 && r.top >= 0 && r.bottom <= window.innerHeight;
  return {
    scrollTop: Math.round(sc.scrollTop),
    cibles: cibles.map(([nom, el]) => {
      if (!el) { return { nom, absent: true }; }
      const r = el.getBoundingClientRect();
      const points = r.width > 0 && r.height > 0 ? [[0.5, 0.5], [0.1, 0.25], [0.9, 0.25], [0.1, 0.75], [0.9, 0.75]].map(([fx, fy]) => [r.left + r.width * fx, r.top + r.height * fy])
        .filter(([x, y]) => y >= v.top && y <= v.bottom && x >= v.left && x <= v.right && y >= 0 && y <= window.innerHeight) : [];
      const touches = points.filter(([x, y]) => { const h = document.elementFromPoint(x, y); return !!h && (h === el || el.contains(h)); }).length;
      const res = { nom, visibles: points.length, touches };
      if (nom === 'blocage' || nom === 'avertissement') {
        const texte = document.createRange();
        texte.selectNodeContents(el);
        res.entier = dedans(texte.getBoundingClientRect());
      }
      return res;
    })
  };
};
// Pastilles coût, durée, potentiel (ticket 2.4), dans la modale telle qu'elle est (aucun défilement), comparées à `html` (contenu de
// l'ordre tel que servi ou ligne réécrite). rangees : conteneurs kr-order-badges de la modale ; pied : enfants du pied de la modale
// (rangée, puis boutons natifs par data-bb-handler) ; ligne : ligne native (p.mini du pied du panneau d'onglets), texte intact, masquée ou
// non, pied du panneau affiché ou non ; scrollTop du corps (0 à l'ouverture) ; pastilles : libellé (infobulle), valeur, icône ; styles :
// taille, graisse, arrondi complet, fond et texte comparés à la paire --kr-arm-bg / --kr-arm-ink (replis du thème) ; place : rangée
// au-dessus des boutons et écart avec eux, pastilles sur une ligne, entières dans la fenêtre, non recouvertes (elementFromPoint au centre).
const PASTILLES = html => {
  const m = window.__modale;
  const norm = s => s.replace(/\s+/g, ' ').trim();
  const t = document.createElement('template');
  t.innerHTML = html;
  const servie = t.content.querySelector('.panel.with-nav-tabs > .panel-footer > p.mini');
  const form = m.querySelector('#ajax-order form[name="post_msg"]');
  const ligne = form ? form.querySelector('.panel.with-nav-tabs > .panel-footer > p.mini') : null;
  const rangees = [...m.querySelectorAll('.kr-order-badges')];
  const pied = m.querySelector('.modal-footer');
  const out = {
    rangees: rangees.length,
    pied: [...pied.children].map(e => (e.matches('.kr-order-badges') ? 'pastilles' : e.getAttribute('data-bb-handler') || e.tagName.toLowerCase())),
    ligne: ligne ? { intacte: !!servie && norm(ligne.textContent) === norm(servie.textContent), masquee: !ligne.checkVisibility(), piedVisible: ligne.parentElement.checkVisibility() } : null,
    scrollTop: Math.round(m.querySelector('.modal-body').scrollTop)
  };
  const box = rangees[0];
  if (!box) { return out; }
  const badges = [...box.children];
  out.pastilles = badges.map(b => { const i = b.querySelector('i'); return { titre: b.title, valeur: b.textContent, icone: i ? i.className : null, cachee: i ? i.getAttribute('aria-hidden') : null }; });
  const sonde = document.createElement('span');
  sonde.style.backgroundColor = 'var(--kr-arm-bg, var(--kr-primary))';
  sonde.style.color = 'var(--kr-arm-ink, var(--kr-white))';
  document.body.appendChild(sonde);
  const arm = { fond: getComputedStyle(sonde).backgroundColor, encre: getComputedStyle(sonde).color };
  sonde.remove();
  out.styles = badges.map(b => {
    const s = getComputedStyle(b);
    return { taille: s.fontSize, graisse: s.fontWeight, arrondi: parseFloat(s.borderTopLeftRadius) >= b.getBoundingClientRect().height / 2, fond: s.backgroundColor === arm.fond, encre: s.color === arm.encre };
  });
  const rb = box.getBoundingClientRect();
  const boutons = [...pied.querySelectorAll('[data-bb-handler]')].map(b => b.getBoundingClientRect());
  const centre = b => { const r = b.getBoundingClientRect(); const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!h && (h === b || b.contains(h)); };
  out.place = {
    dessus: boutons.every(b => rb.bottom <= b.top + 0.5),
    ecart: Math.round(Math.min(...boutons.map(b => b.top)) - rb.bottom),
    uneLigne: badges.every(b => Math.abs(b.getBoundingClientRect().top - badges[0].getBoundingClientRect().top) <= 1),
    visibles: badges.filter(b => { const r = b.getBoundingClientRect(); return r.top >= 0 && r.bottom <= window.innerHeight && r.left >= 0 && r.right <= window.innerWidth; }).length,
    libres: badges.filter(centre).length
  };
  return out;
};
// Ligne native réécrite en place par le site (ticket 2.4) : nouveau texte, ou ligne retirée (null).
const RECRIRE = texte => {
  const ligne = window.__modale.querySelector('#ajax-order .panel.with-nav-tabs > .panel-footer > p.mini');
  if (texte === null) { ligne.remove(); } else { ligne.textContent = texte; }
};
// État de l'aide : aria-expanded de « ? Aide », aide affichée ou non, modale toujours ouverte.
const AIDE = () => {
  const m = window.__modale;
  const b = [...m.querySelectorAll('.modal-body button')].find(x => x.textContent.trim() === 'Aide');
  const aide = m.querySelector('#ajax-order .alert-order');
  const visible = !!aide && !aide.closest('[hidden]') && getComputedStyle(aide).display !== 'none' && aide.getBoundingClientRect().height > 0;
  return { expanded: b ? b.getAttribute('aria-expanded') : null, aide: visible, ouverte: document.body.contains(m) && m.classList.contains('in') };
};
// Avant un geste : « ? Aide » (cible 'aide') ou la croix de l'aide (cible 'croix') amené au milieu du corps par scrollTo, loin des zones
// collantes (onglets de la chaîne mobile et bloc des alertes en haut).
const CENTRER = cible => {
  const m = window.__modale;
  const el = cible === 'aide' ? [...m.querySelectorAll('.modal-body button')].find(b => b.textContent.trim() === 'Aide') : m.querySelector('#ajax-order .alert-order button.close');
  const sc = m.querySelector('.modal-body');
  const v = sc.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  sc.scrollTo(0, sc.scrollTop + (r.top + r.height / 2) - (v.top + v.height / 2));
};
// Avant un geste : le centre de « ? Aide » est bien « ? Aide » (couvert n'est pas invisible).
const LIBRE = () => {
  const b = [...window.__modale.querySelectorAll('.modal-body button')].find(x => x.textContent.trim() === 'Aide');
  const r = b.getBoundingClientRect();
  const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return !!h && (h === b || b.contains(h));
};
// Couleurs (H2.4 ; contrastes), outil des 16 variantes posé dans la page : « ? Aide » (rapport de son texte, fond effectif comparé à celui
// d'« Annuler », couleur comparée au texte du thème --kr-text-primary) ; plus faible rapport du texte de chaque blocage ou avertissement,
// et de l'aide dépliée par un clic sur « ? Aide » (repliée ensuite) ; la croix de l'aide, un bouton, n'est pas du texte. Pastilles (ticket
// 2.4, Q1) : rapport du texte de chacune, fond et texte comparés à la paire --kr-arm-bg / --kr-arm-ink (replis du thème).
const TEINTES = () => {
  const c = window.__krContraste;
  const m = window.__modale;
  const b = [...m.querySelectorAll('.modal-body button')].find(x => x.textContent.trim() === 'Aide');
  const annuler = m.querySelector('.modal-footer [data-bb-handler="cancel"]');
  const sonde = document.createElement('span');
  sonde.style.color = 'var(--kr-text-primary)';
  document.body.appendChild(sonde);
  const theme = getComputedStyle(sonde).color;
  sonde.style.backgroundColor = 'var(--kr-arm-bg, var(--kr-primary))';
  sonde.style.color = 'var(--kr-arm-ink, var(--kr-white))';
  const arm = { fond: getComputedStyle(sonde).backgroundColor, encre: getComputedStyle(sonde).color };
  sonde.remove();
  const textes = el => [el, ...el.querySelectorAll('*')].filter(e => !e.closest('button') && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
  const pire = el => Math.min(...textes(el).map(c.texte));
  const rond = v => v.map(Math.round).join(',');
  const aide = m.querySelector('#ajax-order .alert-order');
  let texteAide = null;
  if (b && aide) { b.click(); texteAide = pire(aide); b.click(); }
  return {
    bouton: b ? { contraste: c.texte(b), fond: rond(c.fond(b)), couleur: getComputedStyle(b).color } : null,
    fondAnnuler: rond(c.fond(annuler)),
    theme,
    alertes: [...m.querySelectorAll('.alert-danger, .alert-warning')].filter(a => !a.matches('.alert-order')).map(pire),
    aide: texteAide,
    pastilles: [...m.querySelectorAll('.kr-order-badges > *')].map(p => ({ titre: p.title, contraste: c.texte(p), fond: getComputedStyle(p).backgroundColor === arm.fond, encre: getComputedStyle(p).color === arm.encre }))
  };
};
// Croix de fermeture de la modale (ticket 2.5), modale telle qu'elle est : taille ; zone visible (intersection de la croix et de la boîte
// de découpe du corps de la modale, qui défile : sa boîte de rembourrage, en valeurs fractionnaires, clientWidth étant arrondi à
// l'entier ; la croix flotte à gauche d'une éventuelle barre de défilement) ; coin haut droit et centre du glyphe (boîte du texte, Range),
// mesurés depuis le bord droit et le haut de .modal-content ; place native (premier enfant du corps, flottante à droite, marge en ligne
// de Bootbox intacte) ; styles relevés ; couleur du texte du thème (--kr-text-primary) ; opacité effective (produit des opacités de ses
// ancêtres) ; contraste de la croix sur le fond de la modale (outil des variantes, qui ignore l'opacité) ; centre : elementFromPoint en
// son centre touche la croix.
const CROIX = () => {
  const m = window.__modale;
  const x = m.querySelector('.bootbox-close-button');
  if (!x) { return null; }
  const s = getComputedStyle(x);
  const r = x.getBoundingClientRect();
  const c = m.querySelector('.modal-content').getBoundingClientRect();
  const corps = m.querySelector('.modal-body');
  const b = corps.getBoundingClientRect();
  const sb = getComputedStyle(corps);
  const decoupe = { left: b.left + parseFloat(sb.borderLeftWidth), top: b.top + parseFloat(sb.borderTopWidth), right: b.right - parseFloat(sb.borderRightWidth), bottom: b.bottom - parseFloat(sb.borderBottomWidth) };
  const texte = document.createRange();
  texte.selectNodeContents(x);
  const g = texte.getBoundingClientRect();
  const sonde = document.createElement('span');
  sonde.style.color = 'var(--kr-text-primary)';
  document.body.appendChild(sonde);
  const theme = getComputedStyle(sonde).color;
  sonde.remove();
  let effective = 1;
  for (let e = x; e; e = e.parentElement) { effective *= Number(getComputedStyle(e).opacity); }
  const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  const dixieme = v => Math.round(v * 10) / 10;
  return {
    taille: [dixieme(r.width), dixieme(r.height)],
    visible: [Math.max(0, Math.min(r.right, decoupe.right) - Math.max(r.left, decoupe.left)), Math.max(0, Math.min(r.bottom, decoupe.bottom) - Math.max(r.top, decoupe.top))].map(dixieme),
    coin: [dixieme(c.right - r.right), dixieme(r.top - c.top)],
    glyphe: [dixieme(c.right - (g.left + g.width / 2)), dixieme(g.top + g.height / 2 - c.top)],
    place: x.parentElement.matches('.modal-body') && x.parentElement.firstElementChild === x && s.float === 'right' && x.style.marginTop === '-10px',
    styles: { couleur: s.color, opacite: s.opacity, ombre: s.textShadow, police: s.fontSize, interligne: s.lineHeight, rembourrage: s.padding, position: s.position, zIndex: s.zIndex },
    theme,
    effective,
    contraste: window.__krContraste.texte(x),
    centre: !!h && (h === x || x.contains(h))
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
  // Rangement (ticket 2.3), par contenu : « ? Aide » distincts (ajoutés dans le contenu, même retirés ensuite, ou présents) et retraits
  // de chaque blocage ou avertissement de sa place (un déplacement = un retrait).
  const listes = window.__krLog.filter(r => r.type === 'childList');
  const estAide = n => n.nodeType === 1 && n.matches('button') && n.textContent.trim() === 'Aide';
  const rangement = f => {
    const aides = new Set([...listes.filter(r => f.contains(r.target)).flatMap(r => [...r.addedNodes]).filter(estAide), ...[...f.querySelectorAll('button')].filter(estAide)]);
    const alertes = [...f.querySelectorAll('.alert-danger, .alert-warning')].filter(a => !a.matches('.alert-order'));
    return { aides: aides.size, deplacements: alertes.map(a => listes.filter(r => [...r.removedNodes].includes(a)).length) };
  };
  // Pastilles (ticket 2.4), dans la modale : rangées kr-order-badges insérées (enregistrement dont un nœud ajouté est une rangée) ou
  // retirées, et réécritures d'une rangée (enfants changés).
  const estRangee = n => n.nodeType === 1 && n.classList.contains('kr-order-badges');
  const dansModale = listes.filter(r => o.modal.contains(r.target));
  return {
    modale: effets(o.modal, 'kr-order-modal'),
    contenus: o.contenus.map(f => effets(f, 'kr-order-form')),
    libelles: o.boutons.map(b => window.__krLog.filter(r => r.type === 'childList' && r.target === b).length),
    rangement: o.contenus.map(rangement),
    pastilles: {
      insertions: dansModale.filter(r => [...r.addedNodes].some(estRangee)).length,
      reecritures: dansModale.filter(r => estRangee(r.target)).length,
      retraits: dansModale.filter(r => [...r.removedNodes].some(estRangee)).length
    }
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
// « ? Aide » touché (contexte tactile) ou cliqué, deux fois : état de l'aide après chaque geste ; avant chaque geste, le bouton est amené
// au milieu du corps et son centre est bien le bouton.
async function basculer(page, tactile) {
  const bouton = page.locator('.bootbox .modal-body button').filter({ hasText: /^\s*Aide\s*$/ });
  const n = await bouton.count();
  const etats = [await page.evaluate(AIDE)];
  for (let i = 0; n === 1 && i < 2; i += 1) {
    try {
      await page.evaluate(CENTRER, 'aide');
      await frames(page, 2);
      const libre = await page.evaluate(LIBRE);
      if (tactile) { await bouton.tap({ timeout: 5000 }); } else { await bouton.click({ timeout: 5000 }); }
      await frames(page, 2);
      etats.push({ ...await page.evaluate(AIDE), libre });
    } catch (e) {
      etats.push({ erreur: e.message.split('\n')[0] });
      break;
    }
  }
  return { n, etats };
}
// Croix de l'aide (data-dismiss="alert") : aide dépliée par « ? Aide », puis fermée par sa croix, que Bootstrap retire ; ensuite, ni aide
// ni « ? Aide » dans la modale, toujours ouverte.
async function fermerAide(page, tactile) {
  const geste = async (loc, cible) => {
    await page.evaluate(CENTRER, cible);
    await frames(page, 2);
    if (tactile) { await loc.tap({ timeout: 5000 }); } else { await loc.click({ timeout: 5000 }); }
    await frames(page, 2);
  };
  try {
    await geste(page.locator('.bootbox .modal-body button').filter({ hasText: /^\s*Aide\s*$/ }), 'aide');
    await geste(page.locator('.bootbox #ajax-order .alert-order button.close'), 'croix');
  } catch (e) {
    return { erreur: e.message.split('\n')[0] };
  }
  return page.evaluate(() => {
    const m = window.__modale;
    return { aides: [...m.querySelectorAll('.modal-body button')].filter(b => b.textContent.trim() === 'Aide').length, aide: !!m.querySelector('#ajax-order .alert-order'), ouverte: document.body.contains(m) && m.classList.contains('in') };
  });
}
// Croix de la modale (ticket 2.5) : Dormir ouvert par bootbox.confirm avec un rappel qui note sa réponse sans retenir la modale (celui
// d'OUVRIR la retient : il renvoie false), puis contenu remplacé par Pouvoir (autre ordre) ; croix mesurée, survolée d'abord sur ordinateur
// (mesurée au survol), puis touchée ou cliquée en son centre ; ensuite : modale fermée et retirée, réponses du rappel, envois.
const OUVRIR_CROIX = message => {
  window.__reponses = [];
  const m = window.bootbox.confirm(message, reponse => { window.__reponses.push(reponse); })[0];
  window.__modale = m;
  window.__ordre = { modal: m, contenus: [], boutons: [] };
};
async function fermerParLaCroix(page, tactile) {
  await page.evaluate(OUVRIR_CROIX, enOrdre(DORMIR));
  await attendre(page, true);
  await page.evaluate(REMPLACER, POUVOIR);
  await frames(page, 2);
  const out = { croix: await page.evaluate(CROIX) };
  const croix = page.locator('.bootbox .bootbox-close-button');
  try {
    if (tactile) {
      await croix.tap({ timeout: 5000 });
    } else {
      await croix.hover({ timeout: 5000 });
      await styleSettled(page, '.bootbox .bootbox-close-button', { state: ':hover' });
      out.survol = await page.evaluate(CROIX);
      await croix.click({ timeout: 5000 });
    }
  } catch (e) {
    return { ...out, erreur: e.message.split('\n')[0] };
  }
  out.fermee = await waitState(page, () => !document.body.contains(window.__modale) && !document.querySelector('.modal-backdrop'));
  return { ...out, ...await page.evaluate(() => ({ reponses: window.__reponses, submits: window.__submits })) };
}

async function scenario(cfg) {
  const { context, page, denied, errors } = await ouvrirPage(cfg);
  const tag = cfg.width + (cfg.mobile ? '-mobile' : '');
  const r = { cfg, mobileMode: await page.evaluate(() => document.body.classList.contains('mobile-mode')), audits: {}, remplace: [], rangRemplace: [], pastRemplace: [], lignes: {}, enPlace: [], pastLong: {}, defilement: {} };
  await page.evaluate(OUVRIR, enOrdre(DORMIR));
  await attendre(page, true);
  r.dormir = await page.evaluate(ETAT);
  r.rangDormir = await page.evaluate(RANGEMENT, DORMIR);
  r.chaine = await page.evaluate(CHAINE);
  r.ouvDormir = await page.evaluate(OUVERTURE);
  r.pastDormir = await page.evaluate(PASTILLES, DORMIR);
  r.croix = { Dormir: await page.evaluate(CROIX) };
  await capture(page, tag + '-dormir-ouverture');
  r.lienDormir = await page.evaluate(LIEN_REGLES);
  await capture(page, tag + '-dormir');
  r.aide = await basculer(page, !!cfg.mobile);
  r.fermeture = await fermerAide(page, !!cfg.mobile);
  for (const html of [POUVOIR, DORMIR]) {
    await page.evaluate(REMPLACER, html);
    await frames(page, 2);
    r.remplace.push(await page.evaluate(ETAT));
    r.rangRemplace.push(await page.evaluate(RANGEMENT, html));
    r.pastRemplace.push(await page.evaluate(PASTILLES, html));
  }
  r.audits.dormir = await page.evaluate(AUDIT);
  await page.evaluate(REMPLACER, SANS_COUT);
  await frames(page, 2);
  r.sansCout = { pastilles: await page.evaluate(PASTILLES, SANS_COUT), inchange: await page.evaluate(INCHANGE, SANS_COUT) };
  for (const [nom, html] of [['sans potentiel', SANS_POTENTIEL], ['segment inconnu au milieu', SEGMENT_MILIEU], ['deux segments inconnus', DEUX_INCONNUS], ['ligne sans libellé connu', LIGNE_INCONNUE]]) {
    await page.evaluate(REMPLACER, html);
    await frames(page, 2);
    r.lignes[nom] = await page.evaluate(PASTILLES, html);
  }
  // Ligne native réécrite en place (contenu courant : ligne sans libellé connu), puis Dormir, puis contenu sans formulaire.
  for (const texte of [LIGNE_MODIFIEE, 'Texte inventé sans libellé connu', LIGNE_MODIFIEE, '', LIGNE_MODIFIEE, null]) {
    await page.evaluate(RECRIRE, texte);
    await frames(page, 2);
    r.enPlace.push(await page.evaluate(PASTILLES, texte === null ? '' : ligneServie(texte)));
  }
  for (const html of [DORMIR, '<p>Chargement de l\'ordre…</p>']) {
    await page.evaluate(REMPLACER, html);
    await frames(page, 2);
    r.enPlace.push(await page.evaluate(PASTILLES, html));
  }
  await fermer(page);
  await page.evaluate(OUVRIR, enOrdre(POUVOIR));
  await attendre(page, true);
  r.pouvoir = await page.evaluate(ETAT);
  r.rangPouvoir = await page.evaluate(RANGEMENT, POUVOIR);
  r.ouvPouvoir = await page.evaluate(OUVERTURE);
  r.pastPouvoir = await page.evaluate(PASTILLES, POUVOIR);
  r.croix.Pouvoir = await page.evaluate(CROIX);
  await capture(page, tag + '-pouvoir-ouverture');
  r.audits.pouvoir = await page.evaluate(AUDIT);
  r.lienPouvoir = await page.evaluate(LIEN_REGLES);
  await capture(page, tag + '-pouvoir');
  await fermer(page);
  if (cfg.ajax) {
    await page.evaluate(OUVRIR, CHARGEMENT);
    await attendre(page, false);
    r.ajaxAvant = await page.evaluate(ETAT);
    r.pastAjaxAvant = await page.evaluate(PASTILLES, CHARGEMENT);
    await page.evaluate(REMPLACER, DORMIR);
    await frames(page, 2);
    r.ajaxApres = await page.evaluate(ETAT);
    r.rangAjax = await page.evaluate(RANGEMENT, DORMIR);
    r.audits.ajax = await page.evaluate(AUDIT);
    r.pastAjax = await page.evaluate(PASTILLES, DORMIR);
    r.croix['chargement Ajax'] = await page.evaluate(CROIX);
    await fermer(page);
  }
  await page.evaluate(OUVRIR, HORS_ORDRE);
  await attendre(page, false);
  r.horsOrdre = await page.evaluate(ETAT);
  r.audits.horsOrdre = await page.evaluate(AUDIT);
  r.pastHorsOrdre = await page.evaluate(PASTILLES, HORS_ORDRE);
  r.croixHorsOrdre = await page.evaluate(CROIX);
  await capture(page, tag + '-hors-ordre');
  await fermer(page);
  await page.evaluate(OUVRIR, enOrdre(SANS_ALERTE));
  await attendre(page, true);
  r.sansAlerte = { rang: await page.evaluate(RANGEMENT, SANS_ALERTE), inchange: await page.evaluate(INCHANGE, SANS_ALERTE) };
  await fermer(page);
  await page.evaluate(OUVRIR, enOrdre(SANS_ONGLET));
  await attendre(page, true);
  r.sansOnglet = await page.evaluate(RANGEMENT, SANS_ONGLET);
  await fermer(page);
  for (const [nom, html] of [['Dormir', DORMIR], ['Pouvoir', POUVOIR]]) {
    const long = await page.evaluate(ALLONGER, enOrdre(html));
    await page.evaluate(OUVRIR, long);
    await attendre(page, true);
    r.pastLong[nom] = await page.evaluate(PASTILLES, long);
    await capture(page, `${tag}-long-${nom.toLowerCase()}-ouverture`);
    r.defilement[nom] = await page.evaluate(DEFILEMENT);
    await capture(page, `${tag}-defilement-${nom.toLowerCase()}`);
    await fermer(page);
  }
  r.fermetureCroix = await fermerParLaCroix(page, !!cfg.mobile);
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
// Rangement attendu (ticket 2.3) : lecture de l'ordre (titre h3, blocage ou avertissement, titre de l'onglet, « ? Aide », aide), bloc des
// alertes juste après le titre de l'ordre, un seul « ? Aide » (bouton, replié), alertes rendues et entières au texte natif, « Valider » actif.
const LECTURE = {
  Dormir: ['titre', 'avertissement', 'onglet', '? Aide', 'aide repliée'],
  Pouvoir: ['titre', 'blocage', 'onglet', '? Aide', 'aide repliée'],
  'sans alerte': ['titre', 'onglet', '? Aide', 'aide repliée']
};
function range(g, nom) {
  assert.ok(g, `${nom} : formulaire d'ordre absent`);
  assert.deepEqual(g.lecture, LECTURE[nom], `${nom}, lecture de l'ordre : ${g.lecture.join(' > ')}`);
  assert.deepEqual(g.boutons, [{ type: 'button', expanded: 'false' }], `${nom}, « ? Aide » dans la modale : ${JSON.stringify(g.boutons)}`);
  const attendues = LECTURE[nom].filter(x => x === 'blocage' || x === 'avertissement').length;
  assert.equal(g.bloc, attendues ? 'sous le titre' : null, `${nom}, bloc des alertes : ${g.bloc}`);
  assert.equal(g.alertes.length, attendues, `${nom} : ${g.alertes.length} blocage(s) ou avertissement(s)`);
  g.alertes.forEach(a => assert.ok(a.rendue && a.entiere, `${nom} : alerte masquée ou repliée (« ${a.texte} ») ${JSON.stringify(a)}`));
  assert.equal(g.textesIntacts, true, `${nom} : texte natif des alertes modifié`);
  assert.equal(g.valider, true, `${nom} : « Valider » inactif`);
}
function rangeUneFois(a, nom, deplacements) {
  assert.deepEqual(a.rangement.map(c => c.aides), deplacements.map(() => 1), `${nom}, « ? Aide » créés par contenu : ${JSON.stringify(a.rangement)}`);
  assert.deepEqual(a.rangement.map(c => c.deplacements), deplacements, `${nom}, déplacements de chaque alerte par contenu : ${JSON.stringify(a.rangement)}`);
}
// Pastilles attendues (ticket 2.4) : libellé (infobulle) et valeur, dans l'ordre de la ligne native, segments vides absents ; icône pour
// les libellés connus, cachée aux lecteurs d'écran, aucune pour une pastille générique ; ligne native masquée avec le pied du panneau ;
// rangée en tête du pied de la modale, juste au-dessus des boutons (écart d'au plus 24 px : 12 px sur ordinateur ; sur mobile, deux gap
// de 10 px autour du ::after vide du clearfix Bootstrap, placé avant les boutons réordonnés), entière dans la fenêtre, non recouverte, sur
// une ligne jusqu'à trois pastilles ; ouverture : corps non défilé.
const PASTILLES_ATTENDUES = {
  Dormir: [['Coût', '0 FK'], ['Durée', '00:00'], ['Potentiel', 'Automatique']],
  Pouvoir: [['Coût', '0 FK'], ['Durée', '02:00'], ['Potentiel', 'VOL + Pouvoir = 9']],
  'Dormir modifié': [['Coût', '3 FK'], ['Durée', '01:00'], ['Potentiel', 'Automatique']],
  'sans potentiel': [['Coût', '0 FK'], ['Durée', '00:00']],
  'segment inconnu au milieu': [['Coût', '0 FK'], ['Portée', 'Portée: 2'], ['Durée', '00:00'], ['Potentiel', 'Automatique']],
  'deux segments inconnus': [['Coût', '0 FK'], ['Durée', '00:00'], ['', 'Sans libellé'], ['Portée', 'Portée: 2']]
};
const ICONES = { 'Coût': 'fas fa-coins', 'Durée': 'far fa-clock', 'Potentiel': 'fas fa-dice-d20' };
const LIGNE_MASQUEE = { intacte: true, masquee: true, piedVisible: false };
const LIGNE_AFFICHEE = { intacte: true, masquee: false, piedVisible: true };
function pastilles(p, nom, { ouverture = false } = {}) {
  const attendues = PASTILLES_ATTENDUES[nom];
  assert.equal(p.rangees, 1, `${nom} : ${p.rangees} rangée(s) de pastilles dans la modale`);
  assert.deepEqual(p.pied, ['pastilles', 'cancel', 'confirm'], `${nom}, pied de la modale : ${JSON.stringify(p.pied)}`);
  assert.deepEqual(p.pastilles.map(b => [b.titre, b.valeur]), attendues, `${nom}, pastilles (libellé, valeur) : ${JSON.stringify(p.pastilles)}`);
  assert.ok(p.pastilles.every(b => b.icone === (ICONES[b.titre] || null) && (b.icone === null || b.cachee === 'true')), `${nom}, icônes : ${JSON.stringify(p.pastilles)}`);
  assert.deepEqual(p.ligne, LIGNE_MASQUEE, `${nom}, ligne native (texte intact, masquée, pied du panneau masqué) : ${JSON.stringify(p.ligne)}`);
  assert.ok(p.styles.every(s => s.taille === '12px' && s.graisse === '700' && s.arrondi && s.fond && s.encre), `${nom}, style (12 px gras, arrondi complet, paire arm) : ${JSON.stringify(p.styles)}`);
  assert.ok(p.place.dessus && p.place.ecart >= 0 && p.place.ecart <= 24, `${nom}, place (juste au-dessus des boutons) : ${JSON.stringify(p.place)}`);
  assert.ok(p.place.visibles === attendues.length && p.place.libres === attendues.length && (attendues.length > 3 || p.place.uneLigne), `${nom}, pastilles entières dans la fenêtre, non recouvertes, sur une ligne jusqu'à trois : ${JSON.stringify(p.place)}`);
  if (ouverture) { assert.equal(p.scrollTop, 0, `${nom} : corps défilé de ${p.scrollTop} px à l'ouverture`); }
}
function sansPastille(p, nom) {
  assert.equal(p.rangees, 0, `${nom} : ${p.rangees} rangée(s) de pastilles`);
  assert.deepEqual(p.pied, ['cancel', 'confirm'], `${nom}, pied de la modale : ${JSON.stringify(p.pied)}`);
}
// Écritures de la rangée dans une modale (journal des mutations) : insertions, réécritures, retraits.
const rangee = (insertions, reecritures = 0, retraits = 0) => ({ insertions, reecritures, retraits });
// Croix lisible (ticket 2.5, H2.6) : 44 × 44 px, entièrement dans la zone visible du corps de la modale, couleur du texte du thème,
// opacité 1 (propre et effective), ≥ 3:1 sur le fond de la modale, rien ne la recouvre en son centre ; à sa place native (Q25.4) : premier
// enfant du corps, flottante à droite, marge en ligne de Bootbox intacte et, si `native` est donnée (croix d'une confirmation hors ordre,
// même largeur : celle d'avant le ticket), même coin haut droit à 0,5 px près et glyphe au même endroit, son centre à 3 px près.
function lisible(x, nom, native = null) {
  assert.ok(x, `${nom} : aucune croix de fermeture`);
  assert.deepEqual(x.taille, [44, 44], `${nom}, taille ${x.taille.join(' × ')} px`);
  assert.deepEqual(x.visible, [44, 44], `${nom}, zone visible dans le corps de la modale ${x.visible.join(' × ')} px`);
  assert.equal(x.styles.couleur, x.theme, `${nom}, couleur ${x.styles.couleur}, texte du thème ${x.theme}`);
  assert.ok(x.styles.opacite === '1' && x.effective === 1, `${nom}, opacité ${x.styles.opacite} (effective ${x.effective})`);
  assert.ok(x.contraste >= 3, `${nom}, contraste ${x.contraste.toFixed(2)}:1 sur le fond de la modale`);
  assert.equal(x.centre, true, `${nom} : centre de la croix recouvert`);
  assert.equal(x.place, true, `${nom} : croix déplacée (premier enfant du corps, flottante à droite, marge en ligne de Bootbox)`);
  if (native) {
    assert.ok(x.coin.every((v, i) => Math.abs(v - native.coin[i]) <= 0.5), `${nom}, coin haut droit ${JSON.stringify(x.coin)}, hors ordre ${JSON.stringify(native.coin)}`);
    assert.ok(x.glyphe.every((v, i) => Math.abs(v - native.glyphe[i]) <= 3), `${nom}, centre du glyphe ${JSON.stringify(x.glyphe)}, hors ordre ${JSON.stringify(native.glyphe)} (depuis le bord droit et le haut de la modale)`);
  }
}
// Croix d'une confirmation hors ordre, inchangée (relevé du bundle 061fd4a, avant le ticket 2.5) : Bootstrap sur ordinateur (noire à 0,2,
// ombre blanche, 21 px de haut) ; règle mobile commune sur mobile (44 × 44 px, noire à 0,7, au-dessus des zones collantes).
const OMBRE_BOOTSTRAP = 'rgb(255, 255, 255) 0px 1px 0px';
const CROIX_HORS_ORDRE = {
  ordinateur: { hauteur: 21, styles: { couleur: 'rgb(0, 0, 0)', opacite: '0.2', ombre: OMBRE_BOOTSTRAP, police: '21px', interligne: '21px', rembourrage: '0px', position: 'static', zIndex: 'auto' } },
  mobile: { hauteur: 44, largeur: 44, styles: { couleur: 'rgb(0, 0, 0)', opacite: '0.7', ombre: OMBRE_BOOTSTRAP, police: '28px', interligne: '24px', rembourrage: '10px', position: 'relative', zIndex: '120' } }
};

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
  check(`${tag} confirmation hors ordre (bootbox.confirm sans #ajax-order) : « Cancel » / « OK » inchangés, aucun marquage, aucune pastille (ticket 2.4)`, () => {
    assert.deepEqual(r.horsOrdre.libelles, ['Cancel', 'OK'], 'libellés ' + JSON.stringify(r.horsOrdre.libelles));
    assert.deepEqual([r.horsOrdre.marquee, r.horsOrdre.modalesMarquees, r.horsOrdre.contenusMarques], [false, 0, 0], 'marquage (modale, modales marquées, contenus) ' + JSON.stringify([r.horsOrdre.marquee, r.horsOrdre.modalesMarquees, r.horsOrdre.contenusMarques]));
    assert.deepEqual(r.audits.horsOrdre.modale, SANS_EFFET, 'écritures de kr-order-modal ' + JSON.stringify(r.audits.horsOrdre.modale));
    assert.deepEqual(r.audits.horsOrdre.libelles, [0, 0], 'écritures des libellés ' + r.audits.horsOrdre.libelles);
    sansPastille(r.pastHorsOrdre, 'hors ordre');
    assert.deepEqual(r.audits.horsOrdre.pastilles, rangee(0), 'écritures de la rangée ' + JSON.stringify(r.audits.horsOrdre.pastilles));
  });
  check(`${tag} envoi natif intact : mêmes boutons (data-bb-handler, classes), même gestionnaire Bootbox du pied, formulaire inchangé ; aucun envoi ni confirmation, aucune requête POST, aucune erreur JavaScript`, () => {
    const etats = { dormir: r.dormir, pouvoir: r.pouvoir, remplace1: r.remplace[0], remplace2: r.remplace[1], horsOrdre: r.horsOrdre };
    assert.deepEqual(Object.entries(etats).filter(([, e]) => !e.natif).map(([k]) => k), [], 'nœuds ou gestionnaires natifs modifiés');
    assert.deepEqual(r.envoi, { submits: 0, confirmations: 0 }, 'envoi ' + JSON.stringify(r.envoi));
    assert.deepEqual(r.posts, [], 'requêtes ' + r.posts.join(' | '));
    assert.deepEqual(r.errors, [], 'erreurs ' + r.errors.join(' | '));
  });
  if (r.mobileMode) {
    check(`${tag} mobile : mise en forme existante toujours appliquée (drapeau data-structure-transformed, pied kraland-modal-footer, grille d'onglets) ; ancien repli de la première alerte retiré (ticket 2.3) ; anciennes pastilles pastel et bande collante coût et durée retirées (ticket 2.4)`, () => {
      const c = r.chaine;
      assert.deepEqual([c.transformee, c.piedMobile, c.grilleEnLigne, c.replis, c.pastel], [true, true, true, 0, 0], JSON.stringify(c));
    });
  } else {
    check(`${tag} ordinateur : chaîne mobile non étendue (ni grille d'onglets en style en ligne, ni indicateurs de balayage, ni ancien repli de la première alerte, ni pastilles pastel, ni data-structure-transformed)`, () => {
      const c = r.chaine;
      assert.deepEqual([c.transformee, c.piedMobile, c.grilleEnLigne, c.indicateurs, c.replis, c.pastel], [false, false, false, 0, 0, 0], JSON.stringify(c));
    });
  }
  check(`${tag} Dormir (ticket 2.3) : avertissement déplacé en tête de l'ordre, juste sous son titre (h3), avant les paragraphes et l'onglet, visible, jamais replié, texte natif ; aide repliée derrière un seul « ? Aide »${r.mobileMode ? ' (cible tactile ≥ 44 px)' : ''} ; « Valider » actif`, () => {
    range(r.rangDormir, 'Dormir');
    if (r.mobileMode) { assert.ok(r.rangDormir.hauteurAide >= 44, `« ? Aide » haut de ${r.rangDormir.hauteurAide} px`); }
  });
  check(`${tag} Pouvoir (ticket 2.3) : blocage en tête de l'ordre, juste sous son titre (h3), avant l'onglet et l'aide repliée, visible, jamais replié ; un seul « ? Aide » ; « Valider » actif`, () => range(r.rangPouvoir, 'Pouvoir'));
  check(`${tag} lien « [?] » du titre de l'onglet (Dormir, Pouvoir) : rien ne le recouvre (elementFromPoint en son centre)`, () => {
    for (const [nom, l] of [['Dormir', r.lienDormir], ['Pouvoir', r.lienPouvoir]]) {
      assert.ok(l.lien && l.libre, `${nom} : ${JSON.stringify(l)}`);
    }
  });
  check(`${tag} défilement (ordre long) : corps de la modale défilé par scrollTo jusqu'en bas, avertissement (Dormir) et blocage (Pouvoir) toujours visibles, sur fond opaque, et non recouverts (elementFromPoint en 5 points, en haut, au milieu, en bas) ; collés au bord haut du corps, sans bande de contenu au-dessus`, () => {
    for (const [nom, d] of Object.entries(r.defilement)) {
      assert.equal(d.conteneur, 'modal-body', `${nom} : conteneur qui défile ${d.conteneur}`);
      assert.ok(d.max > 200, `${nom} : le corps ne défile que de ${d.max} px`);
      assert.equal(d.etats[2].titreSorti, true, `${nom} : titre de l'ordre encore visible en bas, défilement non reproduit`);
      assert.ok(d.etats[0].visibles > 0 && d.etats[0].touches === d.etats[0].visibles, `${nom}, en haut : ${JSON.stringify(d.etats[0])}`);
      d.etats.slice(1).forEach((e, i) => assert.ok(e.dedans && e.touches === 5, `${nom}, ${['au milieu', 'en bas'][i]} : ${JSON.stringify(e)}`));
      assert.equal(d.opaque, true, `${nom} : aucun fond opaque entre l'alerte et son bloc collant`);
      assert.ok(d.etats[2].bord !== null && Math.abs(d.etats[2].bord) <= 1, `${nom}, en bas : bloc collant à ${d.etats[2].bord} px du bord haut du corps`);
    }
  });
  check(`${tag} « ? Aide » (${r.cfg.mobile ? 'toucher' : 'clic'}) : l'aide se déplie, puis se replie ; aria-expanded suit ; la modale reste ouverte`, () => {
    const { n, etats } = r.aide;
    assert.equal(n, 1, `${n} « ? Aide » dans la modale`);
    assert.deepEqual(etats.map(e => [e.expanded, e.aide, e.libre]), [['false', false, undefined], ['true', true, true], ['false', false, true]], JSON.stringify(etats));
    assert.ok(etats.every(e => e.ouverte), 'modale fermée par le geste');
  });
  check(`${tag} aide fermée par sa croix (data-dismiss="alert" : Bootstrap la retire) : « ? Aide » disparaît avec elle, la modale reste ouverte`, () => {
    assert.deepEqual(r.fermeture, { aides: 0, aide: false, ouverte: true }, JSON.stringify(r.fermeture));
  });
  check(`${tag} sans alerte (Dormir sans avertissement) : seule l'aide est repliée derrière « ? Aide », rien d'autre ne change`, () => {
    range(r.sansAlerte.rang, 'sans alerte');
    assert.deepEqual(r.sansAlerte.inchange, { onglet: true, enfants: true }, 'contenu modifié hors de l\'aide ' + JSON.stringify(r.sansAlerte.inchange));
  });
  check(`${tag} formulaire sans onglet actif (ni .tab-content ni .tab-pane) : l'aide se replie derrière un seul « ? Aide » ; l'avertissement reste à sa place native, visible, entier`, () => {
    const g = r.sansOnglet;
    assert.ok(g, 'formulaire d\'ordre absent');
    assert.deepEqual(g.boutons, [{ type: 'button', expanded: 'false' }], '« ? Aide » ' + JSON.stringify(g.boutons));
    assert.deepEqual(g.aides, [{ repliee: true, precedee: true }], 'aide ' + JSON.stringify(g.aides));
    assert.equal(g.blocs, 0, `${g.blocs} bloc(s) kr-order-alerts`);
    assert.deepEqual(g.alertes.map(a => [a.place, a.rendue, a.entiere]), [['formulaire', true, true]], 'avertissement ' + JSON.stringify(g.alertes));
    assert.deepEqual([g.textesIntacts, g.valider], [true, true], '(texte natif, « Valider » actif) ' + JSON.stringify([g.textesIntacts, g.valider]));
  });
  check(`${tag} contenu remplacé (Pouvoir puis Dormir), après l'aide dépliée puis repliée : même rangement sur chaque nouveau contenu, un seul « ? Aide »`, () => {
    range(r.rangRemplace[0], 'Pouvoir');
    range(r.rangRemplace[1], 'Dormir');
  });
  check(`${tag} appel double et contenus remplacés (ticket 2.3) : « ? Aide » créé une seule fois par contenu, chaque alerte déplacée une seule fois`, () => {
    rangeUneFois(r.audits.dormir, 'Dormir puis 2 remplacements', [[1], [1], [1]]);
    rangeUneFois(r.audits.pouvoir, 'Pouvoir', [[1]]);
  });
  if (r.cfg.ajax) {
    check(`${tag} chargement Ajax (ticket 2.3) : avertissement sous le titre et aide repliée sur l'ordre inséré après l'ouverture, un seul « ? Aide »`, () => {
      range(r.rangAjax, 'Dormir');
      rangeUneFois(r.audits.ajax, 'Ajax', [[1]]);
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
  check(`${tag} ouverture (tickets 2.3 et 2.4), Dormir et Pouvoir : corps non défilé ; titre de l'ordre, titre de l'onglet, blocage ou avertissement et « ? Aide » non recouverts sur leur partie visible (elementFromPoint) ; texte de l'avertissement (Dormir) et du blocage (Pouvoir) entier dans la zone visible`, () => {
    for (const [nom, o] of [['Dormir', r.ouvDormir], ['Pouvoir', r.ouvPouvoir]]) {
      assert.equal(o.scrollTop, 0, `${nom} : corps défilé de ${o.scrollTop} px à l'ouverture`);
      assert.ok(o.cibles.every(c => !c.absent && c.touches === c.visibles), `${nom} : ${JSON.stringify(o.cibles)}`);
      const alertes = o.cibles.filter(c => 'entier' in c);
      assert.ok(alertes.length === 1 && alertes[0].entier, `${nom}, alerte entière à l'ouverture : ${JSON.stringify(alertes)}`);
    }
  });
  check(`${tag} pastilles (ticket 2.4) à l'ouverture, corps non défilé : Dormir, coût, durée et « Automatique » (titré Potentiel) ; Pouvoir, coût, durée et potentiel ; ordres longs (corps qui défile) ; icône et valeur, 12 px gras, arrondi complet, fond --kr-arm-bg, texte --kr-arm-ink ; une seule rangée, en tête du pied de la modale, juste au-dessus des boutons, entière dans la fenêtre, non recouverte ; ligne native masquée, texte intact`, () => {
    pastilles(r.pastDormir, 'Dormir', { ouverture: true });
    pastilles(r.pastPouvoir, 'Pouvoir', { ouverture: true });
    pastilles(r.pastLong.Dormir, 'Dormir', { ouverture: true });
    pastilles(r.pastLong.Pouvoir, 'Pouvoir', { ouverture: true });
  });
  check(`${tag} pastilles, contenu remplacé (Pouvoir, Dormir, sans ligne de coût, sans potentiel, segment à libellé inconnu au milieu, deux segments inconnus, ligne sans libellé connu) : valeurs du contenu courant, une seule rangée ; seul le dernier segment sans libellé est le potentiel, un libellé inconnu titre sa pastille générique ; sans ligne de coût, aucune pastille et rien d'autre ne change ; ligne sans libellé connu laissée telle quelle`, () => {
    pastilles(r.pastRemplace[0], 'Pouvoir');
    pastilles(r.pastRemplace[1], 'Dormir');
    sansPastille(r.sansCout.pastilles, 'sans ligne de coût');
    assert.equal(r.sansCout.pastilles.ligne, null, 'sans ligne de coût : ligne native présente ' + JSON.stringify(r.sansCout.pastilles.ligne));
    assert.deepEqual(r.sansCout.inchange, { onglet: true, enfants: true }, 'sans ligne de coût : contenu modifié hors de l\'aide ' + JSON.stringify(r.sansCout.inchange));
    for (const nom of ['sans potentiel', 'segment inconnu au milieu', 'deux segments inconnus']) { pastilles(r.lignes[nom], nom); }
    sansPastille(r.lignes['ligne sans libellé connu'], 'ligne sans libellé connu');
    assert.deepEqual(r.lignes['ligne sans libellé connu'].ligne, LIGNE_AFFICHEE, 'ligne sans libellé connu ' + JSON.stringify(r.lignes['ligne sans libellé connu'].ligne));
  });
  check(`${tag} pastilles, ligne native réécrite en place (valeurs changées, sans libellé connu, vidée, retirée), puis Dormir et contenu sans formulaire : valeurs suivies ; plus rien à montrer, rangée retirée et ligne native réaffichée`, () => {
    const [modifiee, inconnue, modifiee2, videe, modifiee3, retiree, dormir, sansFormulaire] = r.enPlace;
    [modifiee, modifiee2, modifiee3].forEach(p => pastilles(p, 'Dormir modifié'));
    for (const [nom, p] of [['réécrite sans libellé connu', inconnue], ['vidée', videe]]) {
      sansPastille(p, nom);
      assert.deepEqual(p.ligne, LIGNE_AFFICHEE, `${nom}, ligne native ${JSON.stringify(p.ligne)}`);
    }
    for (const [nom, p] of [['retirée', retiree], ['sans formulaire', sansFormulaire]]) {
      sansPastille(p, nom);
      assert.equal(p.ligne, null, `${nom}, ligne native ${JSON.stringify(p.ligne)}`);
    }
    pastilles(dormir, 'Dormir');
  });
  check(`${tag} pastilles, appel double et contenus remplacés (ticket 2.4) : rangée posée une seule fois par modale, réécrite une fois par changement de valeurs`, () => {
    assert.deepEqual(r.audits.dormir.pastilles, rangee(1, 2), 'Dormir puis 2 remplacements ' + JSON.stringify(r.audits.dormir.pastilles));
    assert.deepEqual(r.audits.pouvoir.pastilles, rangee(1), 'Pouvoir ' + JSON.stringify(r.audits.pouvoir.pastilles));
  });
  if (r.cfg.ajax) {
    check(`${tag} pastilles, chargement Ajax (ticket 2.4) : aucune pastille avant l'ordre, celles de Dormir après, posées une fois`, () => {
      sansPastille(r.pastAjaxAvant, 'avant l\'ordre');
      pastilles(r.pastAjax, 'Dormir');
      assert.deepEqual(r.audits.ajax.pastilles, rangee(1), 'Ajax ' + JSON.stringify(r.audits.ajax.pastilles));
    });
  }
  const support = r.mobileMode ? 'mobile' : 'ordinateur';
  check(`${tag} croix de fermeture (ticket 2.5, H2.6, ${support}) : Dormir et Pouvoir à l'ouverture, contenu remplacé${r.cfg.ajax ? ', chargement Ajax' : ''}${r.cfg.mobile ? '' : ', survol de la souris'} : 44 × 44 px entièrement visibles dans le corps, couleur du texte du thème, opacité 1, ≥ 3:1 sur le fond de la modale, rien ne la recouvre ; à sa place native (premier enfant du corps, flottante à droite, même coin haut droit que la croix d'une confirmation hors ordre, centre du glyphe à 3 px près du sien)`, () => {
    const f = r.fermetureCroix;
    const etats = [['Dormir', r.croix.Dormir], ['Pouvoir', r.croix.Pouvoir], ['contenu remplacé', f.croix]];
    if (r.cfg.ajax) { etats.push(['chargement Ajax', r.croix['chargement Ajax']]); }
    if (!r.cfg.mobile) { etats.push(['survol', f.survol]); }
    for (const [nom, x] of etats) { lisible(x, nom, r.croixHorsOrdre); }
  });
  check(`${tag} croix ${r.cfg.mobile ? 'touchée' : 'cliquée'} en son centre (ticket 2.5), après un autre ordre : elementFromPoint touche la croix ; la modale se ferme sans valider (réponse false de Bootbox, aucun envoi, aucune requête POST)`, () => {
    const f = r.fermetureCroix;
    assert.equal(f.erreur, undefined, 'geste impossible : ' + f.erreur);
    assert.ok(f.croix && f.croix.centre, 'centre de la croix recouvert avant le geste ' + JSON.stringify(f.croix));
    assert.equal(f.fermee, true, 'modale toujours ouverte après le geste');
    assert.deepEqual(f.reponses, [false], 'réponses du rappel Bootbox ' + JSON.stringify(f.reponses));
    assert.equal(f.submits, 0, `${f.submits} envoi(s)`);
    assert.deepEqual(r.posts, [], 'requêtes ' + r.posts.join(' | '));
  });
  check(`${tag} confirmation hors ordre (ticket 2.5) : croix inchangée, à sa place native (${r.mobileMode ? 'règle mobile commune : 44 × 44 px, noire à 0,7' : 'Bootstrap : noire à 0,2, 21 px de haut'})`, () => {
    const x = r.croixHorsOrdre;
    const attendu = CROIX_HORS_ORDRE[support];
    assert.ok(x && x.place, 'croix absente ou déplacée ' + JSON.stringify(x));
    assert.deepEqual(x.styles, attendu.styles, 'styles ' + JSON.stringify(x.styles));
    assert.equal(x.taille[1], attendu.hauteur, `hauteur ${x.taille[1]} px`);
    if (attendu.largeur) { assert.equal(x.taille[0], attendu.largeur, `largeur ${x.taille[0]} px`); }
  });
}

// Document-start : Dormir ouvert dans une page où le bundle a été évalué avant <body> ; seule la fin du fondu est attendue.
async function debutDeDocument(cfg) {
  const { context, page, errors } = await ouvrirPage({ ...cfg, debut: true });
  const injection = await page.evaluate(() => window.__krInjection);
  await page.evaluate(OUVRIR, enOrdre(DORMIR));
  await waitState(page, () => window.__shown.includes(window.__modale));
  await frames(page, 2);
  const e = await page.evaluate(ETAT);
  const rang = await page.evaluate(RANGEMENT, DORMIR);
  const audit = await page.evaluate(AUDIT);
  const past = await page.evaluate(PASTILLES, DORMIR);
  await fermer(page);
  await context.close();
  return { cfg, injection, e, rang, audit, past, errors };
}
function verifierDebut(d) {
  check(`${d.cfg.width} px${d.cfg.mobile ? ' (mobile)' : ''}, bundle évalué au document-start (avant <body>${d.cfg.mobile ? ', viewport pas encore lue : largeur ≥ 768 px, G-01' : ''}) : Dormir avec « Annuler » / « Valider », modale marquée une fois`, () => {
    assert.equal(d.injection.body, false, 'bundle évalué après <body> : document-start non reproduit');
    if (d.cfg.mobile) { assert.ok(d.injection.largeur >= 768, 'largeur à l\'injection : ' + JSON.stringify(d.injection)); }
    socle(d.e, 'Dormir');
    uneFois(d.audit, 'Dormir', 1);
    assert.deepEqual(d.errors, [], 'erreurs ' + d.errors.join(' | '));
  });
  check(`${d.cfg.width} px${d.cfg.mobile ? ' (mobile)' : ''}, document-start (ticket 2.3) : avertissement de Dormir sous le titre, jamais replié, aide repliée derrière un seul « ? Aide »`, () => {
    assert.equal(d.injection.body, false, 'bundle évalué après <body> : document-start non reproduit');
    range(d.rang, 'Dormir');
    rangeUneFois(d.audit, 'Dormir', [[1]]);
  });
  check(`${d.cfg.width} px${d.cfg.mobile ? ' (mobile)' : ''}, document-start (ticket 2.4) : pastilles coût et durée de Dormir juste au-dessus des boutons, rangée posée une fois`, () => {
    assert.equal(d.injection.body, false, 'bundle évalué après <body> : document-start non reproduit');
    pastilles(d.past, 'Dormir', { ouverture: true });
    assert.deepEqual(d.audit.pastilles, rangee(1), 'rangée ' + JSON.stringify(d.audit.pastilles));
  });
}

// Contrastes (ticket 2.3, 16 variantes) : Dormir ouvert, puis contenu remplacé par Pouvoir ; couleurs mesurées par l'outil des variantes.
async function teintes(cfg) {
  const { context, page, errors } = await ouvrirPage(cfg);
  const posee = await page.evaluate(VARIANTE_POSEE, cfg.variante);
  await page.evaluate(OUVRIR, enOrdre(DORMIR));
  await attendre(page, true);
  const dormir = await page.evaluate(TEINTES);
  const croix = { Dormir: await page.evaluate(CROIX) };
  if (['kraland', 'empire-brun-dark', 'paladium'].includes(cfg.variante)) { await capture(page, `${cfg.width}${cfg.mobile ? '-mobile' : ''}-${cfg.variante}-dormir`); }
  await page.evaluate(REMPLACER, POUVOIR);
  await frames(page, 2);
  const pouvoir = await page.evaluate(TEINTES);
  croix['contenu remplacé (Pouvoir)'] = await page.evaluate(CROIX);
  await fermer(page);
  await context.close();
  return { cfg, posee, dormir, pouvoir, croix, errors };
}
function verifierTeintes(t) {
  const tag = `${t.cfg.width} px${t.cfg.mobile ? ' (mobile)' : ''}, ${t.cfg.variante}`;
  const x = v => (typeof v === 'number' ? v.toFixed(2) : String(v)) + ':1';
  check(`${tag} : « ? Aide » au fond d'« Annuler » et au texte du thème, ≥ 4,5:1 ; texte de l'avertissement (Dormir), du blocage (Pouvoir) et de l'aide dépliée ≥ 4,5:1`, () => {
    assert.equal(t.posee, true, 'variante non appliquée sur <html>');
    for (const [nom, e] of [['Dormir', t.dormir], ['Pouvoir', t.pouvoir]]) {
      assert.ok(e.bouton, `${nom} : aucun « ? Aide »`);
      assert.equal(e.bouton.fond, e.fondAnnuler, `${nom} : fond de « ? Aide » ${e.bouton.fond}, d'« Annuler » ${e.fondAnnuler}`);
      assert.equal(e.bouton.couleur, e.theme, `${nom} : texte de « ? Aide » ${e.bouton.couleur}, texte du thème ${e.theme}`);
      assert.ok(e.bouton.contraste >= 4.5, `${nom} : « ? Aide » ${x(e.bouton.contraste)}`);
      assert.equal(e.alertes.length, 1, `${nom} : ${e.alertes.length} blocage(s) ou avertissement(s)`);
      e.alertes.forEach(v => assert.ok(v >= 4.5, `${nom} : texte de l'alerte ${x(v)}`));
      assert.ok(e.aide >= 4.5, `${nom} : texte de l'aide dépliée ${x(e.aide)}`);
    }
    assert.deepEqual(t.errors, [], 'erreurs ' + t.errors.join(' | '));
  });
  check(`${tag} : pastilles (ticket 2.4) au fond --kr-arm-bg et au texte --kr-arm-ink, texte ≥ 4,5:1 (Dormir : coût, durée, « Automatique » ; Pouvoir : coût, durée et potentiel)`, () => {
    for (const [nom, e, n] of [['Dormir', t.dormir, 3], ['Pouvoir', t.pouvoir, 3]]) {
      assert.equal(e.pastilles.length, n, `${nom} : ${e.pastilles.length} pastille(s)`);
      e.pastilles.forEach(p => {
        assert.ok(p.fond && p.encre, `${nom}, ${p.titre} : fond ou texte hors de la paire arm ${JSON.stringify(p)}`);
        assert.ok(p.contraste >= 4.5, `${nom}, ${p.titre} : ${x(p.contraste)}`);
      });
    }
  });
  check(`${tag} : croix de fermeture (ticket 2.5, H2.6) de 44 × 44 px entièrement visibles dans le corps, couleur du texte du thème, opacité 1, ≥ 3:1 sur le fond de la modale, à sa place native (Dormir, puis contenu remplacé par Pouvoir)`, () => {
    for (const [nom, c] of Object.entries(t.croix)) { lisible(c, nom); }
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
  const rang = await page.evaluate(RANGEMENT, DORMIR);
  const past = await page.evaluate(PASTILLES, DORMIR);
  await fermer(page);
  await context.close();
  check('1280 px, peau coupée (thème désactivé) : modale d\'ordre native, « Cancel » / « OK », aucun marquage, aucune erreur', () => {
    assert.deepEqual(e.libelles, ['Cancel', 'OK'], 'libellés ' + JSON.stringify(e.libelles));
    assert.deepEqual([e.marquee, e.contenusMarques, e.natif], [false, 0, true], '(modale marquée, contenus marqués, natif intact) ' + JSON.stringify([e.marquee, e.contenusMarques, e.natif]));
    assert.deepEqual(errors, [], 'erreurs ' + errors.join(' | '));
  });
  check('1280 px, peau coupée (ticket 2.3) : alertes à leur place native, aide dépliée, aucun « ? Aide »', () => {
    assert.deepEqual([rang.lecture, rang.boutons.length, rang.blocs], [['titre', 'avertissement', 'onglet', 'aide dépliée'], 0, 0], JSON.stringify(rang));
  });
  check('1280 px, peau coupée (ticket 2.4) : ligne de coût native affichée, aucune pastille', () => {
    sansPastille(past, 'peau coupée');
    assert.deepEqual(past.ligne, LIGNE_AFFICHEE, 'ligne native ' + JSON.stringify(past.ligne));
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
    const etat = await page.evaluate(ETAT);
    const rang = await page.evaluate(RANGEMENT, DORMIR);
    const ouverture = await page.evaluate(OUVERTURE);
    const past = await page.evaluate(PASTILLES, DORMIR);
    const croix = await page.evaluate(CROIX);
    await fermer(page);
    await page.evaluate(OUVRIR, await page.evaluate(ALLONGER, enOrdre(DORMIR)));
    await attendre(page, true);
    etats.push({ w, etat, rang, ouverture, past, croix, defilement: await page.evaluate(DEFILEMENT), memeDocument: await page.evaluate(() => window.__memeDocument === true) });
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
  check(`transition ${depart} -> ${arrivee} -> ${depart} px dans le même onglet (ticket 2.3) : de chaque côté du seuil, avertissement sous le titre, aide repliée, avertissement visible et non recouvert corps défilé jusqu'en bas`, () => {
    for (const { w, rang, defilement: d } of etats) {
      range(rang, 'Dormir');
      const bas = d.etats[2] || {};
      assert.ok(d.max > 200 && bas.titreSorti && bas.dedans && bas.touches === 5 && d.opaque && Math.abs(bas.bord) <= 1, `${w} px, en bas : ${JSON.stringify(d)}`);
    }
  });
  check(`transition ${depart} -> ${arrivee} -> ${depart} px dans le même onglet (ticket 2.4) : de chaque côté du seuil, pastilles de Dormir juste au-dessus des boutons dès l'ouverture ; titres, avertissement entier et « ? Aide » non recouverts`, () => {
    for (const { w, ouverture, past } of etats) {
      assert.ok(ouverture.cibles.every(c => !c.absent && c.touches === c.visibles && c.entier !== false), `${w} px, ouverture : ${JSON.stringify(ouverture)}`);
      pastilles(past, 'Dormir', { ouverture: true });
    }
  });
  check(`transition ${depart} -> ${arrivee} -> ${depart} px dans le même onglet (ticket 2.5) : de chaque côté du seuil, croix de Dormir de 44 × 44 px entièrement visibles dans le corps (intersection avec sa boîte de découpe ; sous 768 px sans mobile-mode, le corps n'a pas de rembourrage), couleur du texte du thème, opacité 1, ≥ 3:1 sur le fond de la modale, à sa place native`, () => {
    for (const { w, croix } of etats) { lisible(croix, `${w} px`); }
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

if (on('variantes')) {
  console.log('16 variantes, 375 × 667 (tactile) et 1280 × 720');
  for (const support of [{ width: 375, height: 667, mobile: true }, { width: 1280, height: 720 }]) {
    (await parVariante(variante => teintes({ ...support, variante }))).forEach(verifierTeintes);
  }
}

// Fragment inconnu : aucun scénario joué ne doit pas passer pour un succès.
if (checks === 0) { check(`KR_FRAG=${FRAG.join(',')} : aucun scénario joué (fragments : mobile, bureau, largeurs, seuil, variantes)`, () => assert.fail('aucune vérification')); }

await browser.close();
console.log(failures === 0 ? `\nModale d'ordre : ${checks} contrôles, tous passent.` : `\nModale d'ordre : ${failures} contrôle(s) en échec sur ${checks}.`);
process.exit(failures === 0 ? 0 : 1);
