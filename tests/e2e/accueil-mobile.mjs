// Accueil mobile (épopée 10, entrées 2, 3 et 5 ; plans story-fixture-realiste-de-l-accueil-et-suite-e2e-accueil-mobile,
// story-refonte-mobile-de-l-accueil-marge-de-16-px-cartes-de-section et story-le-message-du-ministre-revient-sur-mobile-en-carte-sous-bien) sur la fixture synthétique accueil.html, reconstruite d'après le
// relevé du spike 10.1 (structure native, avant le template).
//   mobile     320 et 375 × 667 px, Kraland clair et Empire Brun sombre : mode mobile ; ordre visuel Jouer, Bienvenue, Ministre, Forum,
//              Compteurs, Nouvelles ; de #col-right, seul le panneau ministériel visible ; aucun débordement horizontal ; « Bienvenue » devant le nom ; a.accueil-play-btn injecté
//              juste après .ds_user ; .accueil-forum-section (titre et 4 liens) ; <hr> retirés de #col-t ; compteurs déplacés dans
//              #col-left .kraland-metrics (E10.5) ;
//   marge      E10.1, 320, 375, 700 et 767 px, mêmes variantes : aucun texte visible de #content ni du pied à moins de 16 px d'un bord ;
//   cibles     E10.2 : toute cible visible de #content et du pied fait 44 × 44 px et se touche au centre et aux quatre bords ;
//   cartes     E10.3 : Bienvenue, Ministre, Forum, Compteurs et Nouvelles en carte à 8 px des bords, rayon 8 px, fond de surface opaque ;
//              en-têtes du Ministre, de Forum et de Nouvelles de 48 px au moins, titre 17 px gras couleur du texte ; « Jouer » au bouton de 4.2 (rayon 4 px, 44 px au
//              moins, fond d'action, à 16 px des bords) ; premier texte à 16 px du bord de la carte ; icône de la ligne « A l'aide ! »
//              masquée (état choisi ; visible : sans recouvrement du texte) ;
//   echelle    E10.4 : noms et valeurs 15 px, détails 13 px, aucun texte visible de #content sous 12 px ;
//   bascule    767 -> 768 et 768 -> 767 px dans le même onglet : état égal à une ouverture directe à la largeur d'arrivée ;
//   ministre   E10.6, 320, 375 et 767 px, avec et sans panneau ministériel (variante sans panneau dérivée en mémoire) : panneau en carte de
//              section juste sous Bienvenue et avant le Forum (en-tête 48 px, titre 17 px gras couleur du texte), onglets et chevron à 44 px ;
//              #myCarousel jamais visible ; sans panneau, rien de #col-right n'apparaît et l'ordre des autres blocs reste ;
//   contraste  375 px, 16 variantes : titres de carte (Ministre compris), valeurs et libellés des compteurs à 4,5:1 au moins ;
//   bureau     768, 769, 1280, 1440 et 1920 px, Kraland clair et Empire Brun sombre : trois colonnes côte à côte (992 px et plus) ;
//              carte ministérielle visible ; carrousel masqué par html.kr-hide-carousel (défaut) ; position des textes égale au bundle de base ;
//   carrousel  kr-carousel-hide = 'false' : carrousel affiché à 1280 px, #myCarousel toujours masqué à 375 px ;
//   deconnecte variante déconnectée dérivée en mémoire (formulaire de connexion, forum natif non regroupé), 320, 375 et 767 px :
//              formulaire avant les Compteurs, lignes .ds_forum à 44 px, marge, cibles, « Se souvenir de moi » à 13 px, rien sous 12 px.
// Partout : aucune exception de page, aucune requête hors fixture (coupée par la route de la fixture ou refusée par confineNetwork).
// Aucun accès au site réel. Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base, défaut : git show COMMIT_AVANT),
// KR_FRAG = mobile, marge, cibles, cartes, echelle, bascule, ministre, contraste, bureau, carrousel, deconnecte (vide = tout), KR_FA_DIR=/dossier (copie locale
// de Font Awesome 5.6.3 du site : css/all.min.css + webfonts/, comme messages-v3 ; sans elle, la feuille est vide et les icônes n'ont que le
// glyphe de substitution de la fixture).
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
import { choisirVariante, VARIANTE_POSEE, VARIANTES as TOUTES_VARIANTES, CONTRASTE } from './lib/variantes.mjs';
import { TEXTES_HORS_MARGE_PAGE, cible, ecartsCible } from './lib/marges.mjs';

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
// Accueil déconnecté (vrai /accueil, session déconnectée, relevé en émulation au ticket 10.3), dérivé en mémoire : formulaire de connexion
// fictif à la place de .ds_user, sans la ligne /aide ; un bloc après #col-t (supposé : sur le vrai site, la peau n'a ni retiré les <hr> ni
// regroupé le forum, car #col-t n'y est pas le dernier enfant) laisse le titre Forum et les lignes .ds_forum natives.
const FORM_CONNEXION = '<div class="panel panel-primary"><div class="panel-body"><form action="connexion" method="post">'
  + '<div class="form-group"><input class="form-control" type="text" name="login" placeholder="Identifiant"></div>'
  + '<div class="form-group"><input class="form-control" type="password" name="password" placeholder="Mot de passe"></div>'
  + '<div class="checkbox"><label><input type="checkbox" name="remember" checked> Se souvenir de moi</label></div>'
  + '<button type="submit" class="btn btn-primary btn-block">S\'identifier !</button></form></div>'
  + '<div class="panel-footer center"><a href="inscription">S\'inscrire</a> | <a href="motdepasse">Mot de passe oublié ?</a></div></div>';
const HTML_DECONNECTE = (() => {
  const h = HTML.replace(/<a href="communaute\/membres" class="list-group-item ds_user"[\s\S]*?<\/a>/, FORM_CONNEXION)
    .replace(/<a href="aide" class="list-group-item ds_forum"[\s\S]*?<\/a>/, '')
    .replace(/(<div id="col-t" class="col-md-3">[\s\S]*?\n\t\t<\/div>\n)/, '$1\t\t<div class="clearfix"></div>\n');
  if (h === HTML || !h.includes('type="password"') || h.includes('ds_user"') || !h.includes('clearfix')) { throw new Error('variante déconnectée non dérivée'); }
  return h;
})();
// Accueil sans message du ministre (entrée 5), dérivé en mémoire : #col-right garde le seul carrousel.
const HTML_SANS_MINISTRE = (() => {
  const h = HTML.replace(/(<div id="col-right" class="col-md-6">)\s*<div class="panel [^"]*">[\s\S]*?(\s*<div id="myCarousel")/, '$1$2');
  if (h === HTML || h.includes('myTabContent') || !h.includes('id="myCarousel"')) { throw new Error('variante sans panneau ministériel non dérivée'); }
  return h;
})();
// Accueil avec message du ministre, durci en mémoire (revue de l'entrée 5) : un enfant inconnu de #col-right (doit rester masqué) et une
// longue URL sans césure dans le message affiché (aucun débordement, rien de coupé).
const URL_LONGUE = 'http://www.kraland.org/forum/sujet/' + 'TrahisonEnCoursVeuillezPatienter'.repeat(4) + '_335083_1';
const HTML_MINISTRE_DUR = (() => {
  const h = HTML.replace('<div id="col-right" class="col-md-6">', '$&<div class="kr-inconnu">texte</div>')
    .replace(/(<div class="tab-pane fade in active" id="empire8">[\s\S]*?)(<div class="genmsg">)/, `$1<p class="kr-url-longue">${URL_LONGUE}</p>$2`);
  if (!h.includes('kr-inconnu') || !h.includes('kr-url-longue')) { throw new Error('variante durcie du panneau ministériel non dérivée'); }
  return h;
})();
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');
const VARIANTES = ['kraland', 'empire-brun-dark'];
const MOBILES = [320, 375];
const LARGEURS_E10 = [320, 375, 700, 767];
const BUREAUX = [768, 769, 1280, 1440, 1920];
// Blocs mobiles dans l'ordre visuel attendu (haut vers bas).
const BLOCS = [
  ['Jouer', '#col-t > a.accueil-play-btn'],
  ['Bienvenue', '#col-t > .ds_user'],
  ['Ministre', '#col-right > .panel'],
  ['Forum', '#col-t > .accueil-forum-section'],
  ['Compteurs', '#col-left > .kraland-metrics'],
  ['Nouvelles', '#col-left > #player-header-section']
];
const MINISTRE = '#col-right > .panel';

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}

const browser = await launchBrowser();

async function ouvrir({ width, height = 667, variante, script = userscript, carrousel = null, tactile = width < 768, html = HTML }) {
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
    if (u.href.split('#')[0] === URL_ACCUEIL) { return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }); }
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
    // Enfants de #col-right rendus (boîte non vide, aucun ancêtre masqué).
    colRightVisibles: [...document.getElementById('col-right').children].filter(e => {
      const b = e.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) { return false; }
      for (let x = e; x; x = x.parentElement) { if (getComputedStyle(x).display === 'none') { return false; } }
      return true;
    }).map(e => e.id ? '#' + e.id : e.matches('.panel') ? '.panel' : e.tagName),
    ministre: vis(document.querySelector('#col-right > .panel .panel-title')),
    carrousel: carrousel ? getComputedStyle(carrousel).display : 'absent',
    carrouselVu: !!carrousel && carrousel.getBoundingClientRect().height > 0,
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

// Entrée 3 (E10.1-E10.4) : cartes, en-têtes et échelle de l'accueil mobile.
const CARTES = [
  ['Bienvenue', '#col-t > .ds_user'],
  ['Ministre', MINISTRE],
  ['Forum', '#col-t > .accueil-forum-section'],
  ['Compteurs', '#col-left > .kraland-metrics'],
  ['Nouvelles', '#col-left > #player-header-section']
];
// [nom, en-tête mesuré, titre (défaut : l'en-tête)].
const EN_TETES = [
  ['Ministre', MINISTRE + ' > .panel-heading', MINISTRE + ' > .panel-heading .panel-title'],
  ['Forum', '#col-t > .accueil-forum-section > h4'],
  ['Nouvelles', '#player-header-section > span.list-group-item.active']
];
// [rôle, sélecteur, taille en px] : noms et valeurs 15 px, détails 13 px (DESIGN.md › Typography).
const ECHELLE = [
  ['nom de Bienvenue', '.ds_user h4', 15],
  ['nom de forum', '.accueil-forum-section .ds_forum h4', 15],
  ['valeur de compteur', '.kraland-metrics h4.count', 15],
  ['sujet ou détail de forum', '.accueil-forum-section .ds_forum p', 13],
  ['libellé de compteur', '.kraland-metrics p', 13],
  ['texte de nouvelle', '#player-header-section .news-item td:last-child', 13],
  ['date de nouvelle', '#player-header-section .news-item small', 13],
  ['date du message du ministre', MINISTRE + ' .genmsg', 13]
];
const RACINES = '#content, footer';

// Mesures de page de l'entrée 3. Cibles : liens et boutons visibles de #content et du pied, hors cible coupée par un ancêtre à débordement
// masqué (nouvelles hors de ul.demo) ; chaque cible retenue reçoit data-kr-cible (index), mesurée ensuite par CIBLE_PAGE.
const MESURE_E10 = ({ cartes, entetes, echelle, racines }) => {
  const vw = document.documentElement.clientWidth;
  const vis = e => {
    if (!e || !e.getClientRects().length || getComputedStyle(e).visibility === 'hidden') { return false; }
    for (let x = e; x; x = x.parentElement) { if (getComputedStyle(x).display === 'none') { return false; } }
    return true;
  };
  const k = window.__krContraste;
  const surface = k.rgb(k.sonde('var(--kr-bg-surface)'));
  const texte = k.rgb(k.sonde('var(--kr-text-primary)'));
  const action = k.rgb(k.sonde('var(--kr-arm-bg, var(--kr-primary))'));
  const r1 = v => Math.round(v * 10) / 10;
  const carte = ([nom, sel]) => {
    const e = document.querySelector(sel);
    if (!vis(e)) { return { nom, absent: true }; }
    const b = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    const fond = k.rgb(s.backgroundColor);
    // Retrait du contenu : bord gauche du premier texte visible de la carte, depuis le bord gauche de la carte.
    let retrait = null;
    const tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n && retrait === null; n = tw.nextNode()) {
      if (!n.textContent.trim() || !vis(n.parentElement)) { continue; }
      const rg = document.createRange();
      rg.selectNodeContents(n);
      const x = [...rg.getClientRects()].find(r => r.width > 0 && r.height > 0);
      if (x) { retrait = r1(x.left - b.left); }
    }
    return { nom, g: r1(b.left), d: r1(vw - b.right), rayon: s.borderTopLeftRadius, fond: fond[3] === 1 && k.procheRgb(fond, surface), retrait };
  };
  const entete = ([nom, sel, titre]) => {
    const e = document.querySelector(sel);
    const t = titre ? document.querySelector(titre) : e;
    if (!vis(e) || !vis(t)) { return { nom, absent: true }; }
    const s = getComputedStyle(t);
    return { nom, h: r1(e.getBoundingClientRect().height), taille: s.fontSize, graisse: s.fontWeight, couleur: k.procheRgb(k.rgb(s.color), texte) };
  };
  const jouer = (() => {
    const e = document.querySelector('#col-t > a.accueil-play-btn');
    if (!vis(e)) { return null; }
    const b = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    return { g: r1(b.left), d: r1(vw - b.right), h: r1(b.height), rayon: s.borderTopLeftRadius, fond: k.procheRgb(k.rgb(s.backgroundColor), action), capitales: s.textTransform };
  })();
  const tailles = echelle.map(([role, sel, attendu]) => {
    const vues = [...document.querySelectorAll(sel)].filter(vis).map(e => getComputedStyle(e).fontSize);
    return { role, attendu: attendu + 'px', vues: [...new Set(vues)] };
  });
  // Plus petit texte visible de #content (nœuds texte, taille du parent).
  const petits = [];
  const w = document.createTreeWalker(document.getElementById('content'), NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const e = n.parentElement;
    if (!n.textContent.trim() || !vis(e) || e.closest('.sr-only, script, style')) { continue; }
    const rg = document.createRange();
    rg.selectNodeContents(n);
    if (![...rg.getClientRects()].some(x => x.width > 0 && x.height > 0)) { continue; }
    const t = parseFloat(getComputedStyle(e).fontSize);
    if (t < 12 - 0.01) { petits.push(`${n.textContent.trim().slice(0, 24)} (${t} px)`); }
  }
  // Icône de la ligne « A l'aide ! » : masquée (choix mobile du ticket 10.3), ou visible avec sa boîte dans la ligne (sinon elle déborde
  // sur sa voisine) sans recouvrir aucun texte de la ligne.
  const ligne = [...document.querySelectorAll('.accueil-forum-section a.ds_forum')].find(a => a.getAttribute('href') === 'aide');
  const icone = ligne && ligne.querySelector('.falarge');
  let recouvre = [];
  if (icone && vis(icone)) {
    const bi = icone.getBoundingClientRect();
    const bl = ligne.getBoundingClientRect();
    if (bi.left < bl.left - 0.5 || bi.right > bl.right + 0.5 || bi.top < bl.top - 0.5 || bi.bottom > bl.bottom + 0.5) { recouvre.push('hors de la ligne'); }
    const tw = document.createTreeWalker(ligne, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      if (!n.textContent.trim()) { continue; }
      const rg = document.createRange();
      rg.selectNodeContents(n);
      for (const x of rg.getClientRects()) {
        if (x.width > 0 && x.left < bi.right && x.right > bi.left && x.top < bi.bottom && x.bottom > bi.top) { recouvre.push(n.textContent.trim()); break; }
      }
    }
  }
  // Cibles : liens et boutons visibles, non coupés.
  const coupe = e => {
    const b = e.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) {
      const s = getComputedStyle(x);
      if (s.overflowX === 'visible' && s.overflowY === 'visible') { continue; }
      const c = x.getBoundingClientRect();
      if (cx < c.left || cx > c.right || cy < c.top || cy > c.bottom) { return true; }
    }
    return false;
  };
  const cibles = [];
  document.querySelectorAll('[data-kr-cible]').forEach(e => e.removeAttribute('data-kr-cible'));
  for (const e of document.querySelectorAll(racines.split(',').map(r => `${r.trim()} a, ${r.trim()} button, ${r.trim()} #slide-submenu, ${r.trim()} .panel-heading span.clickable`).join(', '))) {
    if (!vis(e) || coupe(e) || e.closest('.kraland-back-to-top') || cibles.some(c => c.e.contains(e))) { continue; }
    e.setAttribute('data-kr-cible', String(cibles.length));
    cibles.push({ e, nom: (e.textContent.trim() || e.getAttribute('href') || e.id || e.className).slice(0, 30) });
  }
  return { cartes: cartes.map(carte), entetes: entetes.map(entete), jouer, tailles, petits, recouvre, icone: !!icone, iconeVisible: !!icone && vis(icone), cibles: cibles.map(c => c.nom) };
};

async function mesurerE10(page) {
  await page.evaluate(CONTRASTE);
  const marge = await page.evaluate(TEXTES_HORS_MARGE_PAGE, { rogne: true, racine: RACINES });
  const e = await page.evaluate(MESURE_E10, { cartes: CARTES, entetes: EN_TETES, echelle: ECHELLE, racines: RACINES });
  const ecarts = [];
  for (let i = 0; i < e.cibles.length; i++) {
    const x = ecartsCible(await cible(page, `[data-kr-cible="${i}"]`));
    if (x.length) { ecarts.push(`${e.cibles[i]} : ${x.join(', ')}`); }
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return { ...e, marge, ecarts };
}

function controlerE10(tag, e) {
  if (on('marge')) {
    check(`${tag} : E10.1 aucun texte de #content ni du pied à moins de 16 px d'un bord`, () => {
      const ko = e.marge.map(t => `${t.texte} (${t.gauche}/${t.droite}) ${t.chemin}`);
      assert.equal(ko.length, 0, ko.join(' | '));
    });
  }
  if (on('cibles')) {
    check(`${tag} : E10.2 cibles de #content et du pied à 44 × 44 px, touchées au centre et aux bords (${e.cibles.length})`, () => {
      assert.ok(e.cibles.length >= 10, 'trop peu de cibles : ' + e.cibles.join(' | '));
      assert.equal(e.ecarts.length, 0, e.ecarts.join(' | '));
    });
  }
  if (on('cartes')) {
    check(`${tag} : E10.3 ${CARTES.map(c => c[0]).join(', ')} en carte à 8 px des bords, rayon 8 px, fond de surface opaque`, () => {
      const ko = e.cartes.filter(c => c.absent || Math.abs(c.g - 8) > 0.5 || Math.abs(c.d - 8) > 0.5 || c.rayon !== '8px' || !c.fond);
      assert.equal(ko.length, 0, JSON.stringify(ko));
    });
    // Contenu à 16 px du bord de la carte ; Compteurs : tuiles centrées, premier texte à 16 px au moins.
    check(`${tag} : E10.3 premier texte de chaque carte à 16 px de son bord (Compteurs, centrés : 16 px au moins)`, () => {
      const ko = e.cartes.filter(c => !c.absent && (c.retrait === null || (c.nom === 'Compteurs' ? c.retrait < 15.5 : Math.abs(c.retrait - 16) > 0.5)));
      assert.equal(ko.length, 0, JSON.stringify(ko.map(c => [c.nom, c.retrait])));
    });
    check(`${tag} : E10.3 en-têtes ${EN_TETES.map(c => c[0]).join(' et ')} de 48 px au moins, titre 17 px gras couleur du texte`, () => {
      const ko = e.entetes.filter(c => c.absent || c.h < 47.5 || c.taille !== '17px' || Number(c.graisse) < 700 || !c.couleur);
      assert.equal(ko.length, 0, JSON.stringify(ko));
    });
    check(`${tag} : E10.3 « Jouer » au bouton de 4.2 (rayon 4 px, 44 px au moins, fond d'action, à 16 px des bords, sans capitales)`, () => {
      assert.ok(e.jouer, 'a.accueil-play-btn absent');
      const j = e.jouer;
      assert.deepEqual([j.rayon, j.h >= 43.5, j.fond, Math.abs(j.g - 16) <= 0.5 && Math.abs(j.d - 16) <= 0.5, j.capitales], ['4px', true, true, true, 'none'], JSON.stringify(j));
    });
    // État choisi en 10.3 : icône masquée. Si elle redevient visible, ce contrôle échoue : vérifier alors la mesure de recouvrement
    // (boîte dans la ligne, aucun texte recouvert) et mettre l'état attendu à jour.
    check(`${tag} : icône de la ligne « A l'aide ! » masquée ou sans recouvrement du texte (état choisi : masquée)`, () => {
      assert.ok(e.icone, 'icône .falarge absente de la ligne /aide');
      assert.equal(e.recouvre.length, 0, 'texte recouvert : ' + e.recouvre.join(' | '));
      assert.equal(e.iconeVisible, false, 'icône visible : état attendu masqué');
    });
  }
  if (on('echelle')) {
    check(`${tag} : E10.4 noms et valeurs 15 px, détails 13 px`, () => {
      const ko = e.tailles.filter(t => t.vues.length === 0 || t.vues.some(v => v !== t.attendu));
      assert.equal(ko.length, 0, JSON.stringify(ko));
    });
    check(`${tag} : E10.4 aucun texte visible de #content sous 12 px`, () => assert.equal(e.petits.length, 0, e.petits.join(' | ')));
  }
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
  console.log('\n[mobile] 320 et 375 × 667 px : ordre des blocs, seul le panneau ministériel de #col-right, injections de la peau');
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
    check(`${tag} : de #col-right, seul le panneau ministériel visible (carrousel absent)`, () => {
      assert.deepEqual(m.colRightVisibles, ['.panel']);
      assert.deepEqual([m.carrousel, m.carrouselVu], ['none', false]);
    });
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

if (['marge', 'cibles', 'cartes', 'echelle'].some(on)) {
  console.log('\n[marge, cibles, cartes, echelle] 320, 375, 700 et 767 px : E10.1 à E10.4');
  const cas = VARIANTES.flatMap(variante => LARGEURS_E10.map(width => ({ variante, width })));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs, horsFixture } = await ouvrir(c);
    const mobile = await page.evaluate(() => document.body.classList.contains('mobile-mode'));
    const e = await mesurerE10(page);
    await context.close();
    return { c, mobile, e, r: { erreurs, hors: horsFixture() } };
  });
  for (const { c, mobile, e, r } of res) {
    const tag = `${c.variante} ${c.width} px`;
    check(`${tag} : mode mobile`, () => assert.ok(mobile));
    controlerE10(tag, e);
    controlerPropre(tag, r);
  }
}

if (on('deconnecte')) {
  console.log('\n[deconnecte] accueil déconnecté (avec message du ministre), 320, 375 et 767 px : formulaire, ministre, forum natif, Compteurs ; marge, cibles, échelle');
  const cas = VARIANTES.flatMap(variante => [320, 375, 767].map(width => ({ variante, width })));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs, horsFixture } = await ouvrir({ ...c, html: HTML_DECONNECTE });
    const m = await page.evaluate(() => {
      const top = sel => { const e = document.querySelector(sel); const b = e && e.getBoundingClientRect(); return b && b.height > 0 ? Math.round(b.top) : null; };
      const lignes = [...document.querySelectorAll('#content a.ds_forum')].map(a => Math.round(a.getBoundingClientRect().height));
      // Plancher propre des lignes natives (min-height des lignes de liste) : leur contenu dépasse déjà 44 px, la hauteur seule ne le prouve pas
      const planchers = [...document.querySelectorAll('#content a.ds_forum')].map(a => parseFloat(getComputedStyle(a).minHeight) || 0);
      const label = document.querySelector('#col-t .checkbox label');
      return { mobile: document.body.classList.contains('mobile-mode'), form: top('#col-t form input[type="password"]'), compteurs: top('.kraland-metrics'),
        ministre: top('#col-right > .panel'), forum: top('#content a.ds_forum'),
        nouvelles: top('#player-header-section'), lignes, planchers, souvenir: label ? parseFloat(getComputedStyle(label).fontSize) : null };
    });
    const e = await mesurerE10(page);
    await context.close();
    return { c, m, e, r: { erreurs, hors: horsFixture() } };
  });
  for (const { c, m, e, r } of res) {
    const tag = `déconnecté ${c.variante} ${c.width} px`;
    check(`${tag} : mode mobile, formulaire de connexion visible avant les Compteurs et les Nouvelles`, () => {
      assert.ok(m.mobile);
      assert.ok(m.form !== null && m.compteurs !== null && m.form < m.compteurs && m.compteurs < m.nouvelles, JSON.stringify(m));
    });
    check(`${tag} : E10.6 ordre formulaire de connexion, message du ministre, forum natif`, () => {
      assert.ok(m.form !== null && m.ministre !== null && m.forum !== null, JSON.stringify(m));
      assert.ok(m.form < m.ministre && m.ministre < m.forum && m.forum < m.compteurs, JSON.stringify(m));
    });
    check(`${tag} : lignes .ds_forum natives à 44 px au moins, plancher min-height 44 px compris (${m.lignes.length})`, () => {
      assert.equal(m.lignes.length, 3);
      assert.ok(m.lignes.every(h => h >= 43.5), m.lignes.join(', '));
      assert.ok(m.planchers.every(h => h >= 44), 'min-height : ' + m.planchers.join(', '));
    });
    check(`${tag} : E10.1 aucun texte de #content ni du pied à moins de 16 px d'un bord`, () => {
      const ko = e.marge.map(t => `${t.texte} (${t.gauche}/${t.droite}) ${t.chemin}`);
      assert.equal(ko.length, 0, ko.join(' | '));
    });
    check(`${tag} : E10.2 cibles de #content et du pied à 44 × 44 px, touchées au centre et aux bords (${e.cibles.length})`, () => {
      assert.ok(e.cibles.length >= 10, 'trop peu de cibles : ' + e.cibles.join(' | '));
      assert.equal(e.ecarts.length, 0, e.ecarts.join(' | '));
    });
    check(`${tag} : « Se souvenir de moi » en détail (13 px) ; aucun texte visible de #content sous 12 px`, () => {
      assert.equal(m.souvenir, 13);
      assert.equal(e.petits.length, 0, e.petits.join(' | '));
    });
    controlerPropre(tag, r);
  }
}

if (on('bascule')) {
  console.log('\n[bascule] 767 -> 768 et 768 -> 767 px dans le même onglet, état égal à une ouverture directe');
  const cas = VARIANTES.flatMap(variante => [{ variante, de: 767, vers: 768 }, { variante, de: 768, vers: 767 }]);
  const res = await mapLimit(cas, async c => {
    const tactile = c.de < 768;
    const { context, page, erreurs, horsFixture } = await ouvrir({ width: c.de, variante: c.variante, tactile });
    await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
    const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
    await page.setViewportSize({ width: c.vers, height: 667 });
    await charge;
    await page.waitForFunction(m => document.body && document.body.classList.contains('mobile-mode') === m, c.vers < 768, { timeout: 10000 });
    await krReady(page, { ready: THEME_READY, label: `bascule ${c.variante} ${c.de} -> ${c.vers}` });
    await styleSettled(page, 'body');
    const apres = { releve: await page.evaluate(RELEVE), e: c.vers < 768 ? await mesurerE10(page) : null };
    await context.close();
    const d = await ouvrir({ width: c.vers, variante: c.variante, tactile });
    const direct = { releve: await d.page.evaluate(RELEVE), e: c.vers < 768 ? await mesurerE10(d.page) : null };
    const rd = { erreurs: d.erreurs, hors: d.horsFixture() };
    await d.context.close();
    return { c, apres, direct, r: { erreurs: [...erreurs, ...rd.erreurs], hors: [...horsFixture(), ...rd.hors] } };
  });
  for (const { c, apres, direct, r } of res) {
    const tag = `bascule ${c.variante} ${c.de} -> ${c.vers} px`;
    check(`${tag} : position des textes égale à une ouverture directe à ${c.vers} px`, () => {
      const ecart = premierEcart(apres.releve, direct.releve);
      assert.ok(!ecart, ecart);
    });
    if (apres.e) { controlerE10(tag, apres.e); }
    controlerPropre(tag, r);
  }
}

if (on('ministre')) {
  console.log('\n[ministre] E10.6, 320, 375 et 767 px, avec et sans panneau ministériel : carte sous Bienvenue, carrousel masqué');
  const cas = VARIANTES.flatMap(variante => [320, 375, 767].flatMap(width => [true, false].map(avec => ({ variante, width, avec }))));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs, horsFixture } = await ouvrir({ variante: c.variante, width: c.width, html: c.avec ? HTML_MINISTRE_DUR : HTML_SANS_MINISTRE });
    await page.evaluate(CONTRASTE);
    const m = await page.evaluate(ETAT, BLOCS);
    // Écarts entre cartes (bas de l'une, haut de la suivante) ; contenu du message : largeur de défilement contre largeur visible
    const g = await page.evaluate(() => {
      const r = s => { const e = document.querySelector(s); const b = e && e.getBoundingClientRect(); return b && b.height > 0 ? b : null; };
      const ecart = (a, b) => (r(a) && r(b) ? Math.round((r(b).top - r(a).bottom) * 10) / 10 : null);
      const corps = document.querySelector('#col-right > .panel > .panel-body');
      const url = r('#col-right .kr-url-longue');
      return { bienvenueMinistre: ecart('#col-t > .ds_user', '#col-right > .panel'), ministreForum: ecart('#col-right > .panel', '#col-t > .accueil-forum-section'),
        forumCompteurs: ecart('#col-t > .accueil-forum-section', '#col-left > .kraland-metrics'),
        corps: corps ? [corps.scrollWidth, corps.clientWidth] : null, url: url && r('#col-right > .panel') ? [Math.round(url.right), Math.round(r('#col-right > .panel').right)] : null };
    });
    const e = await page.evaluate(MESURE_E10, { cartes: [['Ministre', MINISTRE]], entetes: [EN_TETES[0]], echelle: [], racines: '#col-right' });
    const ecarts = [];
    for (let i = 0; i < e.cibles.length; i++) {
      const x = ecartsCible(await cible(page, `[data-kr-cible="${i}"]`));
      if (x.length) { ecarts.push(`${e.cibles[i]} : ${x.join(', ')}`); }
    }
    await context.close();
    return { c, m, e, g, ecarts, r: { erreurs, hors: horsFixture() } };
  });
  for (const { c, m, e, g, ecarts, r } of res) {
    const tag = `ministre ${c.avec ? 'avec' : 'sans'} panneau ${c.variante} ${c.width} px`;
    const boites = Object.fromEntries(m.blocs);
    check(`${tag} : mode mobile, aucun débordement horizontal`, () => {
      assert.ok(m.mobile);
      assert.ok(m.sw <= m.vw, `débordement ${m.sw} > ${m.vw}`);
    });
    check(`${tag} : #myCarousel jamais visible`, () => assert.deepEqual([m.carrousel, m.carrouselVu], ['none', false]));
    if (c.avec) {
      check(`${tag} : E10.6 panneau ministériel visible, seul de #col-right (enfant inconnu masqué), juste sous Bienvenue et avant le Forum`, () => {
        assert.deepEqual(m.colRightVisibles, ['.panel']);
        const [b, mi, f] = [boites.Bienvenue, boites.Ministre, boites.Forum];
        assert.ok(b && mi && f, JSON.stringify(boites));
        assert.ok(b.h < mi.h && mi.h < f.h, `Bienvenue ${b.h}, Ministre ${mi.h}, Forum ${f.h}`);
      });
      check(`${tag} : E10.6 8 px (± 0,5) de Bienvenue au ministre et du ministre au Forum, comme entre le Forum et les Compteurs`, () => {
        assert.ok(Math.abs(g.forumCompteurs - 8) <= 0.5, `référence Forum-Compteurs ${g.forumCompteurs}`);
        assert.ok(Math.abs(g.bienvenueMinistre - 8) <= 0.5 && Math.abs(g.ministreForum - 8) <= 0.5, JSON.stringify(g));
      });
      check(`${tag} : E10.6 longue URL du message repliée dans la carte (rien de coupé)`, () => {
        assert.ok(g.corps && g.corps[0] <= g.corps[1], `corps ${JSON.stringify(g.corps)}`);
        assert.ok(g.url && g.url[0] <= g.url[1], `URL ${JSON.stringify(g.url)}`);
      });
      check(`${tag} : E10.6 carte de section à 8 px des bords, rayon 8 px, fond de surface ; en-tête de 48 px au moins, titre 17 px gras couleur du texte`, () => {
        const [k] = e.cartes;
        assert.ok(!k.absent && Math.abs(k.g - 8) <= 0.5 && Math.abs(k.d - 8) <= 0.5 && k.rayon === '8px' && k.fond, JSON.stringify(k));
        const [t] = e.entetes;
        assert.ok(!t.absent && t.h >= 47.5 && t.taille === '17px' && Number(t.graisse) >= 700 && t.couleur, JSON.stringify(t));
      });
      check(`${tag} : E10.6 onglets, chevron et lien du message à 44 × 44 px, touchés au centre et aux bords (${e.cibles.length})`, () => {
        assert.ok(e.cibles.length >= 8, 'trop peu de cibles : ' + e.cibles.join(' | '));
        assert.equal(ecarts.length, 0, ecarts.join(' | '));
      });
    } else {
      check(`${tag} : E10.6 rien de #col-right visible ; ordre Jouer, Bienvenue, Forum, Compteurs, Nouvelles`, () => {
        assert.deepEqual(m.colRightVisibles, []);
        const ordre = m.blocs.filter(([n]) => n !== 'Ministre');
        assert.deepEqual(ordre.filter(([, x]) => !x).map(([n]) => n), [], 'blocs absents');
        assert.equal(boites.Ministre, null);
        for (let i = 1; i < ordre.length; i++) { assert.ok(ordre[i][1].h > ordre[i - 1][1].h, `${ordre[i][0]} pas sous ${ordre[i - 1][0]}`); }
      });
    }
    controlerPropre(tag, r);
  }
}

if (on('contraste')) {
  console.log('\n[contraste] 375 px, 16 variantes : titres de carte (Ministre compris), valeurs et libellés des compteurs à 4,5:1 au moins');
  const SELS = [...EN_TETES.map(([nom, sel, titre]) => [`titre ${nom}`, titre || sel]), ['valeurs des compteurs', '.kraland-metrics h4.count'], ['libellés des compteurs', '.kraland-metrics p']];
  const res = await mapLimit(TOUTES_VARIANTES, async variante => {
    const { context, page, erreurs, horsFixture } = await ouvrir({ width: 375, variante });
    await page.evaluate(CONTRASTE);
    const posee = await page.evaluate(VARIANTE_POSEE, variante);
    const rapports = await page.evaluate(sels => sels.map(([nom, sel]) => [nom, [...document.querySelectorAll(sel)].filter(e => e.getClientRects().length > 0).map(e => Math.round(window.__krContraste.texte(e) * 100) / 100)]), SELS);
    await context.close();
    return { variante, posee, rapports, r: { erreurs, hors: horsFixture() } };
  });
  for (const { variante, posee, rapports, r } of res) {
    check(`contraste ${variante} 375 px : ${SELS.map(x => x[0]).join(', ')} à 4,5:1 au moins`, () => {
      assert.ok(posee, 'variante non posée');
      const ko = rapports.filter(([, v]) => v.length === 0 || v.some(x => x < 4.5));
      assert.equal(ko.length, 0, JSON.stringify(ko));
    });
    controlerPropre(`contraste ${variante}`, r);
  }
}

if (on('bureau')) {
  console.log(`\n[bureau] ${BUREAUX.join(', ')} px : trois colonnes, carte ministérielle, carrousel masqué, textes égaux au bundle de base`);
  const cas = VARIANTES.flatMap(variante => BUREAUX.map(width => ({ variante, width, height: 720, releve: true })));
  const res = await mapLimit(cas, async c => ({ c, r: await mesurer(c, userscript), base: await mesurer(c, avant) }));
  for (const { c, r, base } of res) {
    const tag = `bureau ${c.variante} ${c.width} px`;
    const { m } = r;
    check(`${tag} : thème et variante posés, pas de mode mobile`, () => assert.deepEqual([m.theme, m.variante, m.mobile, m.accueil], [true, true, false, true]));
    // Colonnes col-md-* : côte à côte à partir de 992 px seulement (empilées nativement à 768 et 769 px).
    if (c.width >= 992) {
      check(`${tag} : #col-left, #col-right et #col-t côte à côte, même haut`, () => {
        const [g, c2, d] = m.colonnes;
        assert.ok(g && c2 && d, 'colonne masquée : ' + JSON.stringify(m.colonnes));
        assert.ok(g.d <= c2.g && c2.d <= d.g, 'colonnes non alignées : ' + JSON.stringify(m.colonnes));
        assert.ok(g.h === c2.h && c2.h === d.h, 'hauts différents : ' + JSON.stringify(m.colonnes));
      });
    }
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
  console.log('\n[carrousel] kr-carousel-hide = false : affiché à 1280 px, #myCarousel masqué à 375 px');
  const cas = VARIANTES.flatMap(variante => [{ variante, width: 1280, height: 720, carrousel: 'false' }, { variante, width: 375, carrousel: 'false' }]);
  const res = await mapLimit(cas, async c => ({ c, r: await mesurer(c, userscript) }));
  for (const { c, r } of res) {
    const tag = `carrousel ${c.variante} ${c.width} px`;
    const { m } = r;
    if (c.width === 1280) {
      check(`${tag} : sans kr-hide-carousel, #myCarousel affiché`, () => assert.deepEqual([m.cache, m.carrousel], [false, 'block']));
    } else {
      check(`${tag} : sans kr-hide-carousel, #myCarousel toujours masqué`, () => assert.deepEqual([m.cache, m.carrousel, m.carrouselVu], [false, 'none', false]));
    }
    controlerPropre(tag, r);
  }
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
