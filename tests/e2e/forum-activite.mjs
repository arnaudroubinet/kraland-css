// Activité du forum (épopée 6, ticket 2, plan story-index-mobile-dans-la-carte-de-section-la-fleche-et-premier-n) : sur mobile, la ligne de
// l'index du forum fait au moins 72 px (DESIGN › Ligne de forum) et la flèche « dernier message » de l'index comme le titre « premier non
// lu » du sous-forum mènent au message (H10). Une vérification par ligne de la matrice du plan :
//   ancres    fil de sujet ouvert sur #msg6801393 (2e message) et #msg6801395 (3e, au défilement maximal), 375, 767, 768 et 1280 px, dans les
//             deux états d'injection : « début » (script en tête de <head>, avant la balise viewport : largeur lue ≥ 768, 981 sur mobile,
//             comme sur un vrai téléphone) et « body » (bundle évalué dès que <body> existe : largeur émulée). Un état d'injection autre que
//             celui attendu est un échec. Hash gardé après la fin d'initialisation et 2 s plus tard ; message dans la fenêtre (il coupe
//             la fenêtre, elementFromPoint au centre de sa partie visible tombe dedans). Peau coupée à 375 px : hash gardé. Mini-chat
//             (#flap, posé en mémoire) : 375 px, injection body : hash effacé, page en haut, comme la base ; injection début : hash gardé ;
//             mini-chat caché par la peau dans les deux cas (panneau posé dans le flux, sans style : seule la peau le cache) ;
//             1280 px : hash gardé ;
//   parcours  index RP à 375 px, tap au centre de la flèche de « Taverne » ; sous-forum « Débuter », tap au centre du titre « Gagner des
//             PA » (premier non lu) ; le sujet d'arrivée est le fil de sujet, ancre renommée en mémoire ; deux injections ; la cible du tap
//             est vérifiée par elementFromPoint avant le tap ;
//   lignes    index RP, HRP, Communauté, Débats et racine à groupes à 375 et 767 px (HRP et Débats : fixtures forum-index-hrp.html et forum-index-debats.html, entrée 8), Kraland clair et Empire Brun sombre : chaque ligne ≥ 72 px dans la
//             carte ; forum sans message à 72 px, texte centré (haut du nom et bas des compteurs à 1 px près) ; lignes à 3 rangées égales
//             au bundle de base ; centre de la ligne -> forum ; flèche ≥ 44 x 44, centrée verticalement à 1 px près, -> #msg ;
//   seuil     index RP à 767 (lignes ≥ 72), 768 et 769 (égal à la base) ; bascule 768 -> 767 -> 768 dans le même onglet, pour le sujet
//             ouvert sur #msg6801395 (hash gardé des deux côtés, défilement et documents égaux à la base) et pour l'index ;
//   bureau    768, 769 et 1280 px : lignes et flèches de l'index RP et de la racine, sujet ouvert sur #msg égaux au bundle de base ;
//             Staff (index RP servi à /forum/staff) à 375 px égal à la base ;
//   fil       (épopée 6, ticket 3, plan story-un-seul-fil-d-ariane-categorie-forum-sujet-pour-l-index-le-s) fil d'Ariane commun de
//             l'index (RP, Communauté) et du sous-forum « Débuter » (colonne native posée en mémoire), 375 et 767 px, Kraland clair et
//             Empire Brun sombre : un seul conteneur de fil, lien, séparateur « › » masqué aux lecteurs d'écran, courant sans lien, aucune
//             icône de retour, aucun style en ligne ; lien de 44 px au moins, cible du tap vérifiée par elementFromPoint ; couleurs du
//             lien (texte) et du courant (atténué) ; mêmes styles calculés à l'index et au sous-forum ; catégorie lue dans l'entrée
//             active de la liste latérale (L4 : libellé renommé en mémoire), repli sur le lien natif sans entrée active, puis sur
//             « Catégorie » si le bouton natif est réduit à son icône ; titre long : courant sur une ligne, ellipse, aucun débordement ;
//             catégorie longue : lien d'au plus la moitié du fil, libellé à ellipse, courant entier, aucun débordement ; contraste ≥ 4,5:1 dans les 16 variantes ; page de réponse, page
//             hors forum et bureau (768, 769, 1280 ; sujet compris) égaux au bundle de base ; seuil 767 non tactile ; bascule 768 -> 767 -> 768 -> 767 ;
//   entete    (épopée 6, ticket 4, plan story-en-tete-de-sujet-mobile-dans-communaute-debats-et-staff-h12) en-tête de sujet mobile dans
//             toutes les catégories : sujets Communauté, Débats, Staff (structure supposée), HRP (fil de sujet) et fermé, 375 et 767 px,
//             Kraland clair et Empire Brun sombre : un seul fil de la famille commune « Catégorie › Forum › titre » (catégorie de l'entrée
//             active, repli sur le menu de la catégorie puis « Catégorie »), liens d'au moins 44 px ; barre d'actions en haut et en bas,
//             « Répondre » primaire si le lien natif existe, « Nouveau sujet » standard, 44 px, rayon, cible au centre, href natifs ;
//             boutons natifs invisibles ; fermé : cadenas, 0 ou 2 « Répondre » selon le lien natif ; L4 renommé, catégorie inconnue,
//             titre long, image d'icône ; aucun débordement ; contraste ≥ 4,5:1 dans les 16 variantes ; sous-forum, h1 et bandeau natif du
//             bas, seuil 768/769 et bureau (768, 1280) égaux au bundle de base ; seuil 767 non tactile ; bascule 768 -> 767 -> 768 -> 767 ;
//   ligne     (épopée 6, ticket 6, plan story-ligne-de-forum-icone-lue-dans-la-liste-laterale-forum-sans-m) index RP, HRP, Communauté,
//             Débats et racine à groupes à 375, 767, 768, 1280, 1440 et 1920 px, Kraland clair et Empire Brun sombre : une icône par
//             ligne, copiée de l'entrée de la liste latérale du même chemin (avant le nom, masquée aux lecteurs d'écran, sur la rangée du
//             nom) ou aucune ; liste latérale intacte (égale à la base), heure native, aucune exception ; forum sans message ; cibles
//             mobiles ; ordinateur : bouton → de 34 x 34 à 10 px du bord, dernier message à droite à 8 px de la flèche, compteurs à
//             droite, auteur en couleur d'accent, 700, taille de détail ; pages dérivées (chemin composé, entrée désactivée par classe
//             ou par aria, icône image, entrée sans icône, sans liste, lien absolu avec requête et ancre, racine nue, nom long, glyphe entouré d'espaces et porteur d'un id)
//             à 375 et 1280 px ;
//             contraste de l'auteur dans les 16 variantes ; mobile égal à la base ; peau coupée égale à la base peau coupée ;
//             Staff et sous-forum égaux à la base, aucune icône ; seuil 767/768/769 non tactile ; bascule 768 -> 767 -> 768 -> 767 ;
//   envoyer   (ticket 12, plan story-envoyer-et-panneaux-du-forum-sur-page-derivee) fil de sujet + formulaire de réponse de la fixture de
//             rédaction (page dérivée en mémoire), 375 et 767 px, Kraland clair et Empire Brun sombre : avec et sans barre d'outils
//             (kr-editor ou non), « Envoyer » dans le flux (épopée 7, entrée 7), 48 px, aucun élément fixed/sticky dans le formulaire,
//             touché en son centre sous un message ouvert ; voile 990 simulé : première action du message ouvert au-dessus, « Envoyer »
//             dessous ;
//   panneaux  (ticket 12) accordéon et modale (statique, ouverte) ajoutés au fil de sujet (repères dans lib/variantes.mjs,
//             REPERES_PANNEAUX_TICKET12), 375, 767, 768 et 1280 px : styles calculés sur /forum/sujet/… égaux à la même page servie hors
//             forum, laquelle est égale au bundle de base
//             (7bec452) ; carte de section de l'index RP et du sous-forum (375, 767) égale à la base.
//   confort   (épopée 9, entrée 8, plan story-forum-mobile-marge-de-16-px-et-cibles-de-44-px-sur-toutes-le) index RP, HRP, Communauté,
//             Débats, racine (avec et sans groupes), sous-forum « Débuter », sujets (fil, Communauté, Débats, fermé), réponse,
//             nouveau sujet et réponse refusée « Sujet Bloqué ! », 320, 375 x 667 et 767 px, Kraland clair et Empire Brun sombre : classe
//             kr-page-forum sans kr-marge-mobile ; texte à 16 px au moins des bords (texte coupé mesuré à sa partie visible) ; panneaux et
//             messages à 8 px ; cibles hors bouton et hors lien au fil du texte ≥ 44 x 44 ou ligne touchable ; croix d'alerte 44 x 44, sur toute page
//             qui en porte une, dans le coin haut droit de l'alerte (1 px près) ; aucun débordement ; Staff (/forum/staff[/…]) exclu, hors de
//             l'entrée 8 ; 768 et 1280 px : textes égaux au bundle de base (7bec452).
// Bundle de base : celui de 7bec452 (fin des entrées 9.1 à 9.10, SHA figé, recalage du sweep 9.12) pour tous les fragments, sauf KR_SCRIPT_AVANT ;
// aucun masque : la base est une garde de régression, les décisions sont prouvées par les contrôles absolus. Fixtures synthétiques du dépôt seulement ; le
// #flap et les ancres renommées sont posés en mémoire. Vrai Bootstrap 3.3.7 (tests/e2e/vendor), confinement réseau, aucune requête hors
// fixture. Repères partagés (fixtures, classes de page, ligne, flèche) importés de lib/variantes.mjs (routeur, MAX_CITING).
// Fixtures citées pour le routage des fixtures : forum-index-rp.html, forum-racine-groupes.html, sous-forum-debuter.html (règle de fichier),
// et pour le fragment fil : forum-colonne-native-hrp.html, typographie-forum-redaction.html, palette-nation.html (noms tenus dans
// lib/variantes.mjs, REPERES_FIL_TICKET63), pour le fragment entete : forum-sujet-communaute.html, forum-sujet-debats.html,
// forum-sujet-staff.html, forum-sujet-ferme.html (noms tenus dans lib/variantes.mjs, REPERES_ENTETE_TICKET64). Fragment fil : bundle de
// base de 7bec452 (COMMIT_FIL), sauf KR_SCRIPT_AVANT_FIL. Fragment entete : bundle de base de 7bec452 (COMMIT_ENTETE), sauf
// KR_SCRIPT_AVANT_ENTETE. Fragment plus (bouton « ••• » commun du sujet et du kramail, fixtures nommées dans lib/variantes.mjs,
// REPERES_PLUS_TICKET65) : bundle de base de 7bec452 (COMMIT_PLUS), sauf KR_SCRIPT_AVANT_PLUS. Fragment ligne (fixtures et classes
// nommées dans lib/variantes.mjs, REPERES_LIGNE_TICKET66) : bundle de base de 7bec452 (COMMIT_LIGNE), sauf KR_SCRIPT_AVANT_LIGNE.
// Fragment panneaux : bundle de base de 7bec452 (COMMIT_PANNEAUX), sauf KR_SCRIPT_AVANT_PANNEAUX ; fragment envoyer : contrôles absolus.
// Fragment confort : bundle de base de 7bec452 (COMMIT_CONFORT), sauf KR_SCRIPT_AVANT_CONFORT.
// Le fil de sujet et l'index Communauté ne sont nommés que dans lib/variantes.mjs (ACTIVITE_TICKET62) : leurs noms portent des repères
// déjà cités par 3 suites (MAX_CITING).
//
// Usage : npm run build && node tests/e2e/forum-activite.mjs   (ou : npm run test:zone -- forum-activite)
// Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base), KR_SCRIPT_AVANT_FIL (bundle de base du fragment fil),
//           KR_SCRIPT_AVANT_ENTETE (bundle de base du fragment entete), KR_SCRIPT_AVANT_PLUS (bundle de base du fragment plus),
//           KR_SCRIPT_AVANT_LIGNE (bundle de base du fragment ligne), KR_SCRIPT_AVANT_PANNEAUX (bundle de base du fragment panneaux),
//           KR_SCRIPT_AVANT_CONFORT (bundle de base du fragment confort),
//           KR_FRAG = ancres, parcours, lignes, seuil, bureau, fil, entete, plus, ligne, envoyer, panneaux, confort (vide = tout).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, THEME_READY } from './lib/settle.mjs';
import { ACTIVITE_TICKET62 as A, CONTRASTE, REPERES_ENTETE_TICKET64 as E, REPERES_FIL_TICKET63 as R, REPERES_LIGNE_TICKET66 as L, REPERES_CONFORT_ENTREE8 as CF8, REPERES_PANNEAUX_TICKET12 as PN, REPERES_PLUS_TICKET65 as P, VARIANTES as TOUTES_VARIANTES } from './lib/variantes.mjs';
import { TEXTES_HORS_MARGE_PAGE, cible as cibleTactile, ecartsCible } from './lib/marges.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const strip = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const userscript = strip(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_AVANT = '7bec452'; // recalage du sweep 9.12 (ancienne base 6270c81)
const avant = strip(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_AVANT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const fixture = name => fs.readFileSync(path.join(here, 'fixtures', name), 'utf8');
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const BASE = 'http://www.kraland.org';
const VARIANTES = ['kraland', 'empire-brun-dark'];
const ECART_RECHARGEMENT_MS = 1300; // garde-fou du thème : deux rechargements au franchissement du seuil à 1 200 ms d'écart au moins
const APRES_MS = 2000; // le correctif d'ancres agit au chargement et à 500 ms : le hash est relu 2 s plus tard
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}

const SUJET = fixture(A.sujet);
// Mini-chat posé en mémoire (aucune fixture du dépôt n'a de #flap) : lien et panneau dans le flux, sans style, après le pied de page.
// Sans la peau, le panneau est visible (pleine largeur) : seul le thème peut le cacher.
const SUJET_FLAP = SUJET.replace('</footer>', '</footer><a id="lien-flap" href="#flap">MC</a><div id="flap"><p>mini-chat</p></div>');
// Sujet d'arrivée d'un parcours : le fil de sujet, 2e message renommé en mémoire.
const arrivee = msg => SUJET.replace('name="msg6801393"', `name="${msg}"`);
const PAGES = {
  sujet: { url: '/forum/sujet/messages-v3-329425-1', html: SUJET },
  rp: { url: '/forum/rp', html: fixture(A.indexRp) },
  communaute: { url: '/forum/communaute', html: fixture(A.indexCommunaute) },
  racine: { url: '/forum', html: fixture(A.racineGroupes) },
  staff: { url: '/forum/staff', html: fixture(A.indexRp) },
  // Index HRP et Débats : fixtures synthétiques de l'épopée 9, entrée 8 (rétro 6, A8).
  hrp: { url: '/forum/hrp', html: fixture('forum-index-hrp.html') },
  debats: { url: '/forum/debats', html: fixture('forum-index-debats.html') },
  debuter: { url: '/forum/hrp/debuter-20102', html: fixture(A.sousForum) }
};
// Injection « début » : un script en tête de <head>, avant la balise viewport, pour que l'observateur soit livré avant elle.
const enTete = html => {
  const h = html.replace('<meta charset="utf-8">', '<meta charset="utf-8"><script>window.__krScriptTete = true;</script>');
  if (h === html) { throw new Error('fixture sans <meta charset="utf-8"> : injection début impossible'); }
  return h;
};

const browser = await launchBrowser();

// Ouvre la page `cle` (chemin + hash). `routes` : documents servis en plus (chemin -> HTML), pour l'arrivée d'un parcours. `debut` : bundle
// évalué dès que <html> existe (sinon dès que <body> existe). `src` : bundle injecté ; `theme` : kr-theme-enabled.
async function ouvrir({ cle, html, hash = '', width, height, tactile = width < 768, variante = VARIANTES[1], theme = true, src = userscript, debut = false, routes = {} }) {
  const context = await browser.newContext({ viewport: { width, height: height || (tactile ? 667 : 900) }, isMobile: tactile, hasTouch: tactile, deviceScaleFactor: 1 });
  await confineNetwork(context); // refus global EN PREMIER, routes des fixtures ensuite
  const documents = { [PAGES[cle].url]: html || PAGES[cle].html, ...routes };
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (route.request().resourceType() === 'document' && documents[u.pathname]) {
      return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: debut ? enTete(documents[u.pathname]) : documents[u.pathname] });
    }
    if (u.pathname.startsWith('/lib/bootstrap') || u.pathname.startsWith('/lib/jquery')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return route.fulfill({ path: path.join(VENDOR, file), contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript' });
    }
    if (u.pathname.endsWith('.css')) { return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    return route.abort();
  });
  await context.addInitScript(({ code, v, enabled, start }) => {
    window.GM = { xmlHttpRequest: () => {} };
    localStorage.setItem('kr-theme-enabled', enabled ? 'true' : 'false');
    localStorage.setItem('kr-theme-variant', v);
    // eslint-disable-next-line no-eval
    const go = () => { window.__krInjection = { body: !!document.body, largeur: window.innerWidth }; (0, eval)(code); };
    if (start) {
      if (document.documentElement) { go(); } else { new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); go(); } }).observe(document, { childList: true }); }
      return;
    }
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { code: src, v: variante, enabled: theme, start: debut });
  const page = await context.newPage();
  const erreurs = [];
  const etat = { chargements: 0 };
  page.on('pageerror', e => erreurs.push(e.message));
  page.on('load', () => { etat.chargements += 1; });
  await page.goto(BASE + PAGES[cle].url + hash, { waitUntil: 'load' });
  await prete(page, theme, `${cle}${hash} ${width} px`);
  return { context, page, erreurs, etat };
}
const prete = (page, theme, label) => krReady(page, { ready: theme ? THEME_READY : null, label });

// État d'injection attendu : « début » = largeur lue ≥ 768 (981 sur mobile), sans <body> ; « body » = largeur émulée.
function etatInjection(inj, debut, width) {
  assert.ok(inj, 'window.__krInjection absent');
  if (debut) { assert.ok(!inj.body && inj.largeur >= 768, `injection début attendue (sans <body>, largeur ≥ 768) : ${JSON.stringify(inj)}`); } else { assert.ok(inj.body && inj.largeur === width, `injection body attendue (largeur ${width}) : ${JSON.stringify(inj)}`); }
}

// ---------- Mesures (évaluées dans la page) ----------

// Message ancré `nom` : le li.media qui suit a[name=nom] ; il coupe la fenêtre et elementFromPoint au centre de sa partie visible tombe dedans.
const MESSAGE = nom => {
  const a = document.querySelector(`a[name="${nom}"]`);
  let li = a ? a.nextElementSibling : null;
  while (li && !li.matches('li.media')) { li = li.nextElementSibling; }
  const base = { hash: location.hash, y: Math.round(window.scrollY), theme: document.documentElement.classList.contains('kr-theme-enabled'), inj: window.__krInjection || null };
  if (!li) { return { ...base, absent: true }; }
  const r = li.getBoundingClientRect();
  const h = window.innerHeight;
  const coupe = r.top < h && r.bottom > 0;
  const el = coupe ? document.elementFromPoint(r.left + r.width / 2, (Math.max(r.top, 0) + Math.min(r.bottom, h)) / 2) : null;
  return { ...base, haut: Math.round(r.top), bas: Math.round(r.bottom), coupe, dedans: !!el && li.contains(el), point: el ? el.tagName + '.' + el.className : null };
};

// Mini-chat : caché = invisible, sans boîte, ou rejeté hors de la largeur de la fenêtre. La position verticale ne compte pas : le panneau
// est dans le flux, sous le pied de page, et un défilement le montrerait.
const FLAP = () => {
  const f = document.getElementById('flap');
  const r = f.getBoundingClientRect();
  const s = getComputedStyle(f);
  const horsLargeur = r.right <= 0 || r.left >= window.innerWidth;
  return { hash: location.hash, y: Math.round(window.scrollY), cache: s.visibility === 'hidden' || s.display === 'none' || r.width === 0 || r.height === 0 || horsLargeur, boite: [Math.round(r.left), Math.round(r.width)], inj: window.__krInjection || null };
};

// Lignes de l'index : boîtes (au dixième), bloc de texte, cibles mesurées par elementFromPoint après window.scrollTo (pas de scrollIntoView).
const LIGNES = ({ ligne, fleche, panneau }) => {
  const r1 = v => Math.round(v * 10) / 10;
  const visible = e => { if (!e) { return false; } const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const boite = e => { const r = e.getBoundingClientRect(); return { x: r1(r.left), y: r1(r.top + window.scrollY), w: r1(r.width), h: r1(r.height), r: r1(r.right), b: r1(r.bottom + window.scrollY) }; };
  const lienEn = (x, y) => { window.scrollTo(0, Math.max(0, y - 200)); const el = document.elementFromPoint(x, y - window.scrollY); const a = el && el.closest('a'); return a ? a.getAttribute('href') : null; };
  const lignes = [...document.querySelectorAll(ligne)].filter(visible).map(tr => {
    const c = tr.cells;
    const nom = c[0] ? c[0].querySelector(':scope > p > a') : null;
    const f = tr.querySelector(fleche);
    const b = boite(tr);
    const bordBas = parseFloat(getComputedStyle(tr).borderBottomWidth) || 0;
    const compteurs = [c[1], c[2]].filter(visible).map(boite);
    const n = nom && visible(nom) ? boite(nom) : null;
    const pan = tr.closest(panneau);
    const fb = f && visible(f) ? boite(f) : null;
    return {
      nom: nom ? nom.textContent.trim() : null,
      href: nom ? nom.getAttribute('href') : null,
      boite: b,
      // Hauteur minimale calculée : sur ordinateur (ligne de tableau), une hauteur minimale fuyant hors du média mobile ne change pas la boîte.
      minHauteur: getComputedStyle(tr).minHeight,
      panneau: pan ? boite(pan) : null,
      texte: n && compteurs.length ? { haut: r1(n.y - b.y), bas: r1(b.b - bordBas - Math.max(...compteurs.map(k => k.b))) } : null,
      centre: lienEn(b.x + b.w / 2, b.y + b.h / 2),
      fleche: f ? { href: f.getAttribute('href'), boite: fb, ecart: fb ? r1(fb.y + fb.h / 2 - (b.y + (b.h - bordBas) / 2)) : null, auCentre: fb ? lienEn(fb.x + fb.w / 2, fb.y + fb.h / 2) : null } : null
    };
  });
  window.scrollTo(0, 0);
  return { theme: document.documentElement.classList.contains('kr-theme-enabled'), mobile: document.body.classList.contains('mobile-mode'), iw: window.innerWidth, lignes };
};
const geometrie = l => l.lignes.map(x => ({ nom: x.nom, boite: x.boite, minHauteur: x.minHauteur, fleche: x.fleche && x.fleche.boite }));

// ---------- Ancres #msg et #flap ----------
const lireAncre = async (page, msg) => {
  const tot = await page.evaluate(MESSAGE, msg);
  await page.waitForTimeout(APRES_MS);
  return { tot, tard: await page.evaluate(MESSAGE, msg) };
};
const verifierAncre = (r, msg, debut, width) => {
  etatInjection(r.tot.inj, debut, width);
  assert.equal(r.tot.hash, '#' + msg, `hash après la fin d'initialisation : « ${r.tot.hash} » (scrollY ${r.tot.y})`);
  assert.equal(r.tard.hash, '#' + msg, `hash 2 s plus tard : « ${r.tard.hash} » (scrollY ${r.tard.y})`);
  assert.ok(!r.tard.absent && r.tard.coupe && r.tard.dedans, `message hors de la fenêtre : ${JSON.stringify(r.tard)}`);
};

if (on('ancres')) {
  console.log('\n== ancres : fil de sujet sur #msg, 375, 767, 768 et 1280 px, injections début et body ; peau coupée ; #flap ==');
  const cas = ['msg6801393', 'msg6801395'].flatMap(msg => [375, 767, 768, 1280].flatMap(width => [true, false].map(debut => ({ msg, width, debut }))));
  const res = await mapLimit(cas, async ({ msg, width, debut }) => {
    const { context, page, erreurs } = await ouvrir({ cle: 'sujet', hash: '#' + msg, width, debut });
    const r = await lireAncre(page, msg);
    await context.close();
    return { ...r, erreurs };
  });
  cas.forEach(({ msg, width, debut }, i) => {
    const r = res[i];
    check(`sujet #${msg} ${width} px, injection ${debut ? 'début' : 'body'} : état d'injection attendu, hash gardé (fin d'initialisation et 2 s plus tard), message dans la fenêtre, aucune exception`, () => {
      assert.ok(r.tot.theme, 'kr-theme-enabled absent');
      verifierAncre(r, msg, debut, width);
      assert.deepEqual(r.erreurs, []);
    });
  });

  // Peau coupée : le bundle est évalué, le thème non appliqué.
  {
    const { context, page, erreurs } = await ouvrir({ cle: 'sujet', hash: '#msg6801395', width: 375, theme: false });
    const r = await lireAncre(page, 'msg6801395');
    await context.close();
    check('sujet #msg6801395 375 px, peau coupée (injection body) : thème absent, hash gardé, message dans la fenêtre', () => {
      assert.equal(r.tard.theme, false, 'kr-theme-enabled posé alors que la peau est coupée');
      verifierAncre(r, 'msg6801395', false, 375);
      assert.deepEqual(erreurs, []);
    });
  }

  // Mini-chat : #flap posé en mémoire dans le fil de sujet.
  const casFlap = [375, 1280].flatMap(width => [true, false].map(debut => ({ width, debut })));
  const flap = await mapLimit(casFlap, async ({ width, debut }) => {
    const { context, page, erreurs } = await ouvrir({ cle: 'sujet', html: SUJET_FLAP, hash: '#flap', width, debut });
    const tot = await page.evaluate(FLAP);
    await page.waitForTimeout(APRES_MS);
    const tard = await page.evaluate(FLAP);
    await context.close();
    return { tot, tard, erreurs };
  });
  casFlap.forEach(({ width, debut }, i) => {
    const { tot, tard, erreurs } = flap[i];
    const efface = width < 768 && !debut;
    check(`sujet #flap ${width} px, injection ${debut ? 'début' : 'body'} : ${efface ? 'hash effacé, page en haut (comme la base)' : 'hash gardé (comme la base)'}${width < 768 ? ', mini-chat caché' : ''}`, () => {
      etatInjection(tot.inj, debut, width);
      assert.equal(tot.hash, efface ? '' : '#flap', `hash après la fin d'initialisation : « ${tot.hash} »`);
      assert.equal(tard.hash, efface ? '' : '#flap', `hash 2 s plus tard : « ${tard.hash} »`);
      if (efface) { assert.equal(tard.y, 0, 'scrollY ' + tard.y); }
      if (width < 768) { assert.ok(tard.cache, 'mini-chat visible : ' + JSON.stringify(tard.boite)); }
      assert.deepEqual(erreurs, []);
    });
  });
}

// ---------- Parcours : flèche de l'index, « premier non lu » du sous-forum ----------
// Cible du tap dans la page : élément, défilement par window.scrollTo, centre ; elementFromPoint doit tomber sur le lien visé.
const CIBLE = ({ sel, texte, attr }) => {
  const el = [...document.querySelectorAll(sel)].find(e => (texte ? e.textContent.trim() === texte : true) && (attr ? (e.getAttribute('href') || '').includes(attr) : true));
  if (!el) { return null; }
  const r0 = el.getBoundingClientRect();
  window.scrollTo(0, Math.max(0, r0.top + window.scrollY - 200));
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const hit = document.elementFromPoint(x, y);
  return { x, y, w: r.width, h: r.height, href: el.getAttribute('href'), touche: !!hit && hit.closest('a') === el, point: hit ? hit.tagName + '.' + hit.className : null };
};
const PARCOURS = [
  {
    nom: 'index RP, flèche « dernier message » de « Taverne »', cle: 'rp',
    cible: ({ ligne, fleche }) => {
      const tr = [...document.querySelectorAll(ligne)].find(t => t.cells[0] && t.cells[0].textContent.includes('Taverne'));
      const f = tr && tr.querySelector(fleche);
      if (f) { f.setAttribute('data-kr-cible', '1'); }
    },
    sel: 'a[data-kr-cible]', href: 'forum/sujet/une-histoire-de-comptoir-330001-1#msg6900001', msg: 'msg6900001', chemin: '/forum/sujet/une-histoire-de-comptoir-330001-1'
  },
  {
    nom: 'sous-forum « Débuter », titre « Gagner des PA » (premier non lu)', cle: 'debuter',
    cible: () => {
      const a = [...document.querySelectorAll('#topics tbody tr td:first-child a')].find(e => e.textContent.trim() === 'Gagner des PA');
      if (a) { a.setAttribute('data-kr-cible', '1'); }
    },
    sel: 'a[data-kr-cible]', href: 'forum/sujet/gagner-des-pa-334743-1#msg6698133', msg: 'msg6698133', chemin: '/forum/sujet/gagner-des-pa-334743-1'
  }
];
if (on('parcours')) {
  console.log('\n== parcours : tap au centre de la flèche (index RP) et du titre « premier non lu » (sous-forum), 375 px, injections début et body ==');
  const cas = PARCOURS.flatMap(p => [true, false].map(debut => ({ p, debut })));
  const res = await mapLimit(cas, async ({ p, debut }) => {
    const { context, page, erreurs } = await ouvrir({ cle: p.cle, width: 375, debut, routes: { [p.chemin]: arrivee(p.msg) } });
    await page.evaluate(p.cible, A);
    const cible = await page.evaluate(CIBLE, { sel: p.sel });
    if (!cible || !cible.touche || cible.href !== p.href) { await context.close(); return { cible }; }
    const arrive = page.waitForURL(u => u.pathname === p.chemin, { waitUntil: 'load', timeout: 15000 });
    await page.touchscreen.tap(cible.x, cible.y);
    await arrive;
    await prete(page, true, `arrivée ${p.chemin}`);
    const r = await lireAncre(page, p.msg);
    await context.close();
    return { cible, r, erreurs };
  });
  cas.forEach(({ p, debut }, i) => {
    const { cible, r, erreurs } = res[i];
    check(`${p.nom}, injection ${debut ? 'début' : 'body'} : tap au centre sur le lien ${p.href} (elementFromPoint), sujet ouvert sur #${p.msg}, hash gardé, message dans la fenêtre`, () => {
      assert.ok(cible && cible.touche, `cible du tap : ${JSON.stringify(cible)}`);
      assert.equal(cible.href, p.href);
      verifierAncre(r, p.msg, debut, 375);
      assert.deepEqual(erreurs, []);
    });
  });
}

// ---------- Lignes de l'index mobile ----------
const INDEX = ['rp', 'hrp', 'communaute', 'debats', 'racine'];
if (on('lignes')) {
  console.log(`\n== lignes : index RP, Communauté et racine à groupes, 375 et 767 px, variantes ${VARIANTES.join(' et ')} ==`);
  const cas = INDEX.flatMap(cle => [375, 767].flatMap(width => VARIANTES.map(variante => ({ cle, width, variante }))));
  const res = await mapLimit(cas, async c => {
    const out = {};
    for (const [k, src] of [['teste', userscript], ['base', avant]]) {
      const { context, page, erreurs } = await ouvrir({ ...c, src });
      out[k] = { l: await page.evaluate(LIGNES, A), erreurs };
      await context.close();
    }
    return out;
  });
  cas.forEach(({ cle, width, variante }, i) => {
    const { teste, base } = res[i];
    const t = teste.l.lignes;
    const lab = `lignes ${PAGES[cle].url} ${variante} ${width} px`;
    check(`${lab} : thème appliqué, mode mobile, ${t.length} ligne(s) dans la carte, autant que la base, chacune d'au moins 72 px`, () => {
      assert.ok(teste.l.theme && base.l.theme && teste.l.mobile, `kr-theme-enabled testé ${teste.l.theme} / base ${base.l.theme}, mobile ${teste.l.mobile}`);
      assert.ok(t.length >= 3, 'lignes : ' + t.length);
      assert.equal(t.length, base.l.lignes.length, 'nombre de lignes');
      const hors = t.filter(l => !l.panneau || l.boite.x < l.panneau.x || l.boite.r > l.panneau.r).map(l => `« ${l.nom} » ${JSON.stringify([l.boite, l.panneau])}`);
      assert.deepEqual(hors, [], hors.join(' ; '));
      const basses = t.filter(l => l.boite.h < 72).map(l => `« ${l.nom} » ${l.boite.h}`);
      assert.deepEqual(basses, [], basses.join(' ; '));
    });
    check(`${lab} : forum sans message à 72 px, texte centré (haut du nom et bas des compteurs à 1 px près) ; lignes à 3 rangées égales à la base`, () => {
      const vides = t.filter(l => !l.fleche);
      assert.ok(vides.length >= 1, 'aucun forum sans message');
      for (const l of vides) {
        assert.ok(Math.abs(l.boite.h - 72) <= 0.5, `« ${l.nom} » ${l.boite.h} px`);
        assert.ok(l.texte && Math.abs(l.texte.haut - l.texte.bas) <= 1, `« ${l.nom} » texte : ${JSON.stringify(l.texte)}`);
      }
      const ecarts = t.map((l, k) => [l, base.l.lignes[k]]).filter(([l]) => l.fleche).filter(([l, z]) => l.boite.h !== z.boite.h).map(([l, z]) => `« ${l.nom} » ${l.boite.h} / base ${z.boite.h}`);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    check(`${lab} : centre de la ligne -> forum ; flèche d'au moins 44 x 44, centrée verticalement à 1 px près, -> #msg`, () => {
      const ecarts = [];
      for (const l of t) {
        if (l.centre !== l.href) { ecarts.push(`« ${l.nom} » centre -> ${l.centre}`); }
        if (!l.fleche) { continue; }
        const f = l.fleche;
        if (!f.boite || f.boite.w < 44 || f.boite.h < 44) { ecarts.push(`« ${l.nom} » flèche ${JSON.stringify(f.boite)}`); continue; }
        if (Math.abs(f.ecart) > 1) { ecarts.push(`« ${l.nom} » flèche décentrée de ${f.ecart} px`); }
        if (!/#msg\d+$/.test(f.href) || f.auCentre !== f.href) { ecarts.push(`« ${l.nom} » flèche ${f.href} -> ${f.auCentre}`); }
      }
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      assert.deepEqual(teste.erreurs, []);
    });
  });
}

// ---------- Seuil et bascule dans le même onglet ----------
// Bascule : le thème recharge la page au franchissement du seuil (anti-rebond de 400 ms, défilement en pixels restauré jusqu'à 1,8 s).
async function bascule({ cle, hash, src }) {
  const { context, page, erreurs, etat } = await ouvrir({ cle, hash, width: 768, height: 667, tactile: false, src });
  const mesure = async () => {
    await page.waitForTimeout(APRES_MS);
    return { iw: await page.evaluate(() => window.innerWidth), docs: etat.chargements, m: hash ? await page.evaluate(MESSAGE, hash.slice(1)) : null, l: hash ? null : geometrie(await page.evaluate(LIGNES, A)) };
  };
  const etapes = [await mesure()];
  for (const width of [767, 768]) {
    await page.waitForTimeout(ECART_RECHARGEMENT_MS);
    const charge = page.waitForEvent('load', { timeout: 15000 });
    await page.setViewportSize({ width, height: 667 });
    await charge;
    await prete(page, true, `bascule ${cle} ${width}`);
    etapes.push(await mesure());
  }
  await context.close();
  return { etapes, erreurs };
}
if (on('seuil')) {
  console.log('\n== seuil : index RP à 767, 768 et 769 px ; bascule 768 -> 767 -> 768 (sujet #msg6801395, index) ==');
  const cas = VARIANTES.flatMap(variante => [767, 768, 769].map(width => ({ variante, width })));
  const res = await mapLimit(cas, async c => {
    const out = {};
    for (const [k, src] of [['teste', userscript], ['base', avant]]) {
      const { context, page, erreurs } = await ouvrir({ cle: 'rp', ...c, tactile: false, src });
      out[k] = { l: await page.evaluate(LIGNES, A), erreurs };
      await context.close();
    }
    return out;
  });
  cas.forEach(({ variante, width }, i) => {
    const { teste, base } = res[i];
    check(`seuil /forum/rp ${variante} ${width} px : ${width < 768 ? 'mobile, chaque ligne d\'au moins 72 px' : 'ordinateur, lignes et flèches égales à la base'}, aucune exception`, () => {
      assert.equal(teste.l.mobile, width < 768);
      if (width < 768) {
        const basses = teste.l.lignes.filter(l => l.boite.h < 72).map(l => `« ${l.nom} » ${l.boite.h}`);
        assert.ok(teste.l.lignes.length >= 3 && basses.length === 0, basses.join(' ; '));
      } else { assert.deepEqual(geometrie(teste.l), geometrie(base.l)); }
      assert.deepEqual(teste.erreurs, []);
    });
  });
  const [sujetT, sujetB, indexT, indexB] = await mapLimit([
    { cle: 'sujet', hash: '#msg6801395', src: userscript }, { cle: 'sujet', hash: '#msg6801395', src: avant },
    { cle: 'rp', hash: '', src: userscript }, { cle: 'rp', hash: '', src: avant }
  ], bascule);
  check('bascule 768 -> 767 -> 768, sujet #msg6801395 : un rechargement par franchissement, hash gardé des deux côtés, défilement égal à la base', () => {
    assert.deepEqual(sujetT.etapes.map(e => e.iw), [768, 767, 768]);
    assert.deepEqual(sujetT.etapes.map(e => e.docs), sujetB.etapes.map(e => e.docs), 'documents chargés');
    assert.deepEqual(sujetT.etapes.map(e => e.m.hash), ['#msg6801395', '#msg6801395', '#msg6801395'], 'hash : ' + JSON.stringify(sujetT.etapes.map(e => e.m.hash)));
    const y = sujetT.etapes.map(e => e.m.y);
    const yb = sujetB.etapes.map(e => e.m.y);
    assert.ok(y.every((v, k) => Math.abs(v - yb[k]) <= 1), `scrollY ${y.join(',')} / base ${yb.join(',')}`);
    assert.deepEqual(sujetT.erreurs, []);
  });
  check('bascule 768 -> 767 -> 768, index RP : un rechargement par franchissement ; 767 : chaque ligne d\'au moins 72 px ; 768 : égal à la base', () => {
    assert.deepEqual(indexT.etapes.map(e => e.iw), [768, 767, 768]);
    assert.deepEqual(indexT.etapes.map(e => e.docs), indexB.etapes.map(e => e.docs), 'documents chargés');
    const basses = indexT.etapes[1].l.filter(l => l.boite.h < 72).map(l => `« ${l.nom} » ${l.boite.h}`);
    assert.ok(indexT.etapes[1].l.length >= 3 && basses.length === 0, basses.join(' ; '));
    assert.deepEqual(indexT.etapes[0].l, indexB.etapes[0].l);
    assert.deepEqual(indexT.etapes[2].l, indexB.etapes[2].l);
    assert.deepEqual(indexT.erreurs, []);
  });
}

// ---------- Bureau et Staff : égaux au bundle de base ----------
if (on('bureau')) {
  console.log(`\n== bureau : index RP et racine à 768, 769 et 1280 px (variantes ${VARIANTES.join(' et ')}), sujet #msg ; Staff à 375 px ==`);
  const cas = [
    ...['rp', 'racine'].flatMap(cle => [768, 769, 1280].flatMap(width => VARIANTES.map(variante => ({ cle, width, variante })))),
    ...VARIANTES.map(variante => ({ cle: 'staff', width: 375, variante }))
  ];
  const res = await mapLimit(cas, async c => {
    const out = {};
    for (const [k, src] of [['teste', userscript], ['base', avant]]) {
      const { context, page, erreurs } = await ouvrir({ ...c, src });
      out[k] = { l: await page.evaluate(LIGNES, A), erreurs };
      await context.close();
    }
    return out;
  });
  cas.forEach(({ cle, width, variante }, i) => {
    const { teste, base } = res[i];
    check(`bureau ${PAGES[cle].url} ${variante} ${width} px : lignes et flèches (boîtes, cibles) égales au bundle de base (${COMMIT_AVANT}), aucune exception`, () => {
      assert.ok(teste.l.theme && base.l.theme, 'kr-theme-enabled absent');
      assert.ok(teste.l.lignes.length >= 3, 'lignes : ' + teste.l.lignes.length);
      assert.deepEqual(teste.l, base.l);
      assert.deepEqual(teste.erreurs, []);
    });
  });
  const casSujet = ['msg6801393', 'msg6801395'].flatMap(msg => [768, 769, 1280].map(width => ({ msg, width })));
  const sujets = await mapLimit(casSujet, async ({ msg, width }) => {
    const out = {};
    for (const [k, src] of [['teste', userscript], ['base', avant]]) {
      const { context, page, erreurs } = await ouvrir({ cle: 'sujet', hash: '#' + msg, width, src });
      out[k] = { ...(await lireAncre(page, msg)), erreurs };
      await context.close();
    }
    return out;
  });
  casSujet.forEach(({ msg, width }, i) => {
    const { teste, base } = sujets[i];
    check(`bureau sujet #${msg} ${width} px : hash, défilement et position du message égaux au bundle de base, message dans la fenêtre`, () => {
      verifierAncre(teste, msg, false, width);
      const vue = r => ({ hash: r.tard.hash, y: r.tard.y, haut: r.tard.haut, bas: r.tard.bas });
      assert.deepEqual(vue(teste), vue(base));
      assert.deepEqual(teste.erreurs, []);
    });
  });
}

// ---------- Fil d'Ariane commun de l'index et du sous-forum (épopée 6, ticket 3) ----------
// Pages dérivées en mémoire : colonne native du sous-forum (entrée active « Jeu (HRP) »), titre long, entrée active renommée (L4), entrée
// active au libellé long, sous-forum sans entrée active au bouton natif réduit à son icône (repli final), page de réponse (h1 à deux
// liens), page hors forum à deux liens. Repères partagés : REPERES_FIL_TICKET63 (lib/variantes.mjs).
const TITRE_LONG = 'Débuter avec un titre de sous-forum vraiment très long qui ne tient pas sur une ligne';
const CATEGORIE_LONGUE = 'Jeu (HRP) avec un libellé de catégorie vraiment très long dans la liste latérale';
function pagesFil() {
  const remplacer = (html, motif, par, nom) => { const h = html.replace(motif, par); if (h === html) { throw new Error('page dérivée « ' + nom + ' » : motif absent de la fixture'); } return h; };
  const sousForum = PAGES.debuter.html;
  const natif = remplacer(sousForum, /<div id="col-left" class="col-md-3 sidebar"><div class="list-group">.*?<\/div><\/div>/, fixture(R.colonneNative).trim(), 'debuterNatif');
  const rp = PAGES.rp.html;
  return {
    debuterNatif: { url: PAGES.debuter.url, html: natif },
    debuterLong: { url: PAGES.debuter.url, html: remplacer(natif, '<h1 class="page-header">Débuter ', `<h1 class="page-header">${TITRE_LONG} `, 'debuterLong') },
    debuterLibelle: { url: PAGES.debuter.url, html: remplacer(natif, /(<span class="list-group-item active">\s*)Jeu \(HRP\)/, '$1Hors Jeu', 'debuterLibelle') },
    rpLibelle: { url: PAGES.rp.url, html: remplacer(rp, /(<span class="list-group-item active">\s*)Jeu \(RP\)/, '$1Rôle Jeu', 'rpLibelle') },
    debuterCategorieLongue: { url: PAGES.debuter.url, html: remplacer(natif, /(<span class="list-group-item active">\s*)Jeu \(HRP\)/, '$1' + CATEGORIE_LONGUE, 'debuterCategorieLongue') },
    debuterIcone: { url: PAGES.debuter.url, html: remplacer(sousForum, '<i class="fa fa-backward"></i> Jeu (HRP)</a>', '<i class="fa fa-backward"></i></a>', 'debuterIcone') },
    reponse: { url: R.reponse.chemin, html: remplacer(fixture(R.reponse.fixture), /<h1 class="page-header">R[^]*?<\/h1>/, R.reponse.h1, 'reponse') },
    regles: { url: R.regles.chemin, html: fixture(R.regles.fixture) }
  };
}

// Fil de la page : conteneurs de fil (non imbriqués), enfants, styles calculés, contraste (CONTRASTE évalué avant), cible au centre de
// chaque lien (window.scrollTo puis elementFromPoint), débordement horizontal de #col-right et de la page.
const FIL = rep => {
  const C = window.__krContraste;
  const r1 = v => Math.round(v * 10) / 10;
  const boite = e => { const r = e.getBoundingClientRect(); return { x: r1(r.left), y: r1(r.top + window.scrollY), w: r1(r.width), h: r1(r.height) }; };
  const st = (e, props) => { const s = getComputedStyle(e); return Object.fromEntries(props.map(p => [p, s[p]])); };
  const cible = e => {
    const r0 = e.getBoundingClientRect();
    window.scrollTo(0, Math.max(0, r0.top + window.scrollY - 200));
    const r = e.getBoundingClientRect();
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!el && e.contains(el);
  };
  const conts = [...document.querySelectorAll(rep.conteneurs)].filter(e => !e.parentElement.closest(rep.conteneurs));
  const col = document.getElementById('col-right');
  const out = {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    iw: window.innerWidth,
    fabs: document.querySelectorAll('.' + rep.fab).length,
    debordCol: col ? col.scrollWidth - col.clientWidth : null,
    debordPage: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    primaire: C.sonde(rep.textes[0]),
    secondaire: C.sonde(rep.textes[1]),
    conteneurs: conts.map(c => ({
      cls: c.className, tag: c.tagName, parent: c.parentElement.tagName + '.' + c.parentElement.className, style: c.getAttribute('style') || '',
      texte: c.textContent.replace(/\s+/g, ' ').trim(), icone: !!c.querySelector('.' + rep.icone) || c.textContent.includes('⏪'),
      boite: boite(c), css: st(c, ['display', 'flexWrap', 'columnGap', 'fontSize', 'color', 'marginBottom']),
      enfants: [...c.children].map(e => {
        const s = getComputedStyle(e);
        return {
          tag: e.tagName, cls: e.className, href: e.getAttribute('href'), texte: e.textContent.replace(/\s+/g, ' ').trim(),
          sous: [...e.children].map(x => ({ cls: x.className, sw: x.scrollWidth, cw: x.clientWidth, css: st(x, ['overflow', 'textOverflow', 'whiteSpace']) })),
          masque: e.getAttribute(rep.masque), liens: e.querySelectorAll('a').length, boite: boite(e), sw: e.scrollWidth, cw: e.clientWidth,
          interligne: parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2,
          css: st(e, ['color', 'fontSize', 'fontWeight', 'minHeight', 'height', 'whiteSpace', 'overflow', 'textOverflow', 'minWidth', 'flexGrow', 'flexShrink', 'textDecorationLine']),
          contraste: Math.round(C.texte(e) * 100) / 100
        };
      })
    }))
  };
  out.conteneurs.forEach((c, i) => [...conts[i].children].forEach((e, k) => { if (e.tagName === 'A') { c.enfants[k].cible = cible(e); } }));
  window.scrollTo(0, 0);
  return out;
};
// Empreinte du contenu (#content, sinon .container) : chaque élément, sa boîte au dixième et ses styles de rendu, son texte propre.
const EMPREINTE_FIL = () => {
  const racine = document.getElementById('content') || document.querySelector('.container');
  const r1 = v => Math.round(v * 10) / 10;
  const props = ['display', 'position', 'color', 'backgroundColor', 'fontSize', 'fontWeight', 'lineHeight', 'whiteSpace', 'overflow', 'textOverflow', 'flexWrap', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'borderBottomWidth', 'visibility'];
  return [racine, ...racine.querySelectorAll('*')].map(e => {
    const r = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    const texte = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.data.trim()).filter(Boolean).join(' ');
    return `${e.tagName}.${typeof e.className === 'string' ? e.className : ''} [${r1(r.left)},${r1(r.top + window.scrollY)},${r1(r.width)},${r1(r.height)}] ${props.map(p => s[p]).join('|')} « ${texte} »`;
  });
};

const COMMIT_FIL = '7bec452'; // recalage du sweep 9.12 (anciennes bases 6270c81 puis d64c578) : entrées 9.1 à 9.10 comprises
if (on('fil')) {
  const baseFil = strip(process.env.KR_SCRIPT_AVANT_FIL ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_FIL, 'utf8')
    : execFileSync('git', ['show', `${COMMIT_FIL}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
  Object.assign(PAGES, pagesFil());
  console.log(`\n== fil : fil d'Ariane commun de l'index et du sous-forum, 375 et 767 px (variantes ${VARIANTES.join(' et ')}) ; contraste (16 variantes) ; sujet, réponse et hors forum égaux à ${COMMIT_FIL} ; seuil, bascule, bureau ==`);
  const lireFil = async (o, empreinte = false) => {
    await o.page.evaluate(CONTRASTE);
    const f = await o.page.evaluate(FIL, R);
    const e = empreinte ? await o.page.evaluate(EMPREINTE_FIL) : null;
    await o.context.close();
    return { f, e, erreurs: o.erreurs };
  };
  const ATTENDUS = {
    rp: ['Tous les forums', 'forum', 'Jeu (RP)'],
    communaute: ['Tous les forums', 'forum', 'Communauté'],
    debuterNatif: ['Jeu (HRP)', 'forum/hrp', 'Débuter'],
    debuter: ['Jeu (HRP)', 'forum/hrp', 'Débuter'],
    debuterLibelle: ['Hors Jeu', 'forum/hrp', 'Débuter'],
    rpLibelle: ['Tous les forums', 'forum', 'Rôle Jeu'],
    debuterLong: ['Jeu (HRP)', 'forum/hrp', TITRE_LONG],
    debuterCategorieLongue: [CATEGORIE_LONGUE, 'forum/hrp', 'Débuter'],
    debuterIcone: ['Catégorie', 'forum/hrp', 'Débuter']
  };
  const PRINCIPAUX = ['rp', 'communaute', 'debuterNatif', 'debuterLong'];
  const cas = [
    ...PRINCIPAUX.flatMap(cle => [375, 767].flatMap(width => VARIANTES.map(variante => ({ cle, width, variante })))),
    ...['debuter', 'debuterLibelle', 'rpLibelle', 'debuterCategorieLongue', 'debuterIcone'].flatMap(cle => VARIANTES.map(variante => ({ cle, width: 375, variante })))
  ];
  const res = await mapLimit(cas, async c => lireFil(await ouvrir(c)));
  // Fil commun : un seul conteneur, classes de la famille, lien sans icône, au seul span de libellé, séparateur « › » masqué, courant span
  // sans lien.
  const filCommun = (f, cle) => {
    assert.ok(f.theme && f.mobile, `kr-theme-enabled ${f.theme}, mobile ${f.mobile}`);
    assert.equal(f.conteneurs.length, 1, 'conteneurs de fil : ' + f.conteneurs.map(c => c.cls).join(', '));
    const c = f.conteneurs[0];
    assert.equal(c.cls, R.fil, 'classe du conteneur');
    const [libelle, href, courant] = ATTENDUS[cle];
    const enfant = cls => c.enfants.find(e => e.cls === cls) || {};
    assert.deepEqual([enfant(R.lien).texte, enfant(R.lien).href, enfant(R.courant).texte], [libelle, href, courant], 'libellé et cible du lien, courant');
    assert.ok(!c.icone, `icône de retour dans le fil : « ${c.texte} »`);
    assert.deepEqual(c.enfants.map(e => [e.tag, e.cls]), [['A', R.lien], ['SPAN', R.sep], ['SPAN', R.courant]], 'structure du fil');
    const [a, s, k] = c.enfants;
    assert.deepEqual(a.sous.map(x => x.cls), [R.libelle], 'sous-éléments du lien');
    assert.deepEqual([s.texte, s.masque], ['›', 'true'], 'séparateur');
    assert.equal(k.liens, 0, 'lien dans le courant');
    assert.equal(c.style, '', 'style en ligne du conteneur');
  };
  cas.forEach(({ cle, width, variante }, i) => {
    const { f, erreurs } = res[i];
    const lab = `fil ${cle} ${variante} ${width} px`;
    if (PRINCIPAUX.includes(cle) && cle !== 'debuterLong') {
      check(`${lab} : un seul conteneur de fil, de la famille commune ; « ${ATTENDUS[cle][0]} › ${ATTENDUS[cle][2]} », sans icône de retour ; courant span sans lien ; aucune exception`, () => {
        filCommun(f, cle);
        assert.deepEqual(erreurs, []);
      });
      check(`${lab} : lien d'au moins 44 px de haut, elementFromPoint au centre dans le lien ; lien en texte primaire, séparateur et courant en texte secondaire ; courant sur une ligne`, () => {
        assert.equal(f.conteneurs.length, 1);
        const [a, s, k] = f.conteneurs[0].enfants;
        assert.ok(a.boite.h >= 44, 'hauteur du lien ' + a.boite.h);
        assert.ok(a.cible, 'elementFromPoint au centre du lien hors du lien');
        assert.equal(a.css.color, f.primaire, 'couleur du lien');
        assert.deepEqual([s.css.color, k.css.color], [f.secondaire, f.secondaire], 'couleur du séparateur et du courant');
        assert.ok(k.boite.h <= 1.5 * k.interligne, `courant sur plusieurs lignes : ${k.boite.h} px pour un interligne de ${k.interligne}`);
      });
    } else if (cle === 'debuterLong') {
      check(`${lab} : titre de ${TITRE_LONG.length} caractères, courant sur une ligne, tronqué par des points de suspension ; conteneur d'au plus 44 px ; aucun débordement horizontal`, () => {
        assert.equal(f.conteneurs.length, 1, 'conteneurs de fil');
        const c = f.conteneurs[0];
        const k = c.enfants.find(e => e.cls === R.courant);
        assert.ok(k.boite.h <= 1.5 * k.interligne, `courant sur plusieurs lignes : ${k.boite.h} px pour un interligne de ${k.interligne}`);
        assert.deepEqual([k.css.textOverflow, k.css.whiteSpace, k.css.overflow, k.css.minWidth], ['ellipsis', 'nowrap', 'hidden', '0px'], 'troncature du courant');
        // À 375 px, le titre dépasse la place restante : il est coupé. À 767 px, il y tient (Plan Change Log).
        if (width === 375) { assert.ok(k.sw > k.cw, `courant non tronqué : scrollWidth ${k.sw}, clientWidth ${k.cw}`); }
        const l = (c.enfants.find(e => e.cls === R.lien) || { sous: [] }).sous[0] || {};
        assert.ok(l.sw <= l.cw, `libellé court du lien tronqué : scrollWidth ${l.sw}, clientWidth ${l.cw}`);
        assert.ok(c.boite.h <= 44, 'hauteur du conteneur ' + c.boite.h);
        assert.equal(f.debordCol, 0, 'débordement horizontal de #col-right');
        assert.equal(f.debordPage, 0, 'débordement horizontal de la page');
        filCommun(f, cle);
        assert.deepEqual(erreurs, []);
      });
    } else if (cle === 'debuterCategorieLongue') {
      check(`${lab} : libellé de catégorie de ${CATEGORIE_LONGUE.length} caractères : lien d'au plus la moitié du fil, libellé tronqué par des points de suspension ; courant « Débuter » entier ; aucun débordement horizontal de #col-right ni de la page`, () => {
        assert.equal(f.conteneurs.length, 1, 'conteneurs de fil');
        const c = f.conteneurs[0];
        const a = c.enfants.find(e => e.cls === R.lien);
        const k = c.enfants.find(e => e.cls === R.courant);
        const l = a.sous[0] || {};
        assert.equal(f.debordCol, 0, 'débordement horizontal de #col-right');
        assert.equal(f.debordPage, 0, 'débordement horizontal de la page');
        assert.deepEqual([l.css && l.css.textOverflow, l.css && l.css.overflow, l.css && l.css.whiteSpace], ['ellipsis', 'hidden', 'nowrap'], 'troncature du libellé du lien');
        assert.ok(l.sw > l.cw, `libellé du lien non tronqué : scrollWidth ${l.sw}, clientWidth ${l.cw}`);
        assert.ok(a.boite.w <= c.boite.w / 2 + 0.5, `lien de ${a.boite.w} px pour un fil de ${c.boite.w} px`);
        assert.ok(k.boite.w > 0 && k.sw <= k.cw, `courant tronqué ou masqué : largeur ${k.boite.w}, scrollWidth ${k.sw}, clientWidth ${k.cw}`);
        filCommun(f, cle);
        assert.deepEqual(erreurs, []);
      });
    } else if (cle === 'debuterIcone') {
      check(`${lab} : sans entrée active, bouton natif réduit à son icône : repli final « ${ATTENDUS[cle][0]} › ${ATTENDUS[cle][2]} », lien non vide`, () => {
        filCommun(f, cle);
        assert.deepEqual(erreurs, []);
      });
    } else {
      check(`${lab} : ${cle === 'debuter' ? 'sans entrée active, repli sur le texte du lien natif' : 'libellé de l\'entrée active de la liste latérale (L4)'} : « ${ATTENDUS[cle][0]} › ${ATTENDUS[cle][2]} », sans icône de retour`, () => {
        filCommun(f, cle);
        assert.deepEqual(erreurs, []);
      });
    }
  });
  // Parité index / sous-forum : mêmes styles calculés du fil.
  for (const width of [375, 767]) {
    for (const variante of VARIANTES) {
      const fx = cle => res[cas.findIndex(c => c.cle === cle && c.width === width && c.variante === variante)].f;
      const vue = f => {
        const c = f.conteneurs[0];
        if (!c) { return null; }
        const [a, s, k] = c.enfants;
        return { conteneur: [c.css.fontSize, c.css.color, c.css.columnGap, c.css.flexWrap], lien: [a.css.fontSize, a.css.fontWeight, a.css.color, a.boite.h, a.css.minHeight, a.css.whiteSpace], sep: s && [s.css.fontSize, s.css.fontWeight, s.css.color], courant: k && [k.css.fontSize, k.css.fontWeight, k.css.color, k.css.whiteSpace] };
      };
      check(`fil ${variante} ${width} px : index RP et sous-forum, même fil (taille, graisse, couleurs, écart, hauteur du lien, retour à la ligne)`, () => {
        assert.deepEqual(vue(fx('debuterNatif')), vue(fx('rp')));
      });
    }
  }

  // Contraste : 16 variantes, 375 px, index RP et sous-forum (colonne native).
  const casC = ['rp', 'debuterNatif'].flatMap(cle => TOUTES_VARIANTES.map(variante => ({ cle, width: 375, variante })));
  const resC = await mapLimit(casC, async c => lireFil(await ouvrir(c)));
  casC.forEach(({ cle, variante }, i) => {
    const { f } = resC[i];
    check(`fil ${cle} ${variante} 375 px : lien, séparateur et courant d'au moins 4,5:1`, () => {
      assert.equal(f.conteneurs.length, 1, 'conteneurs de fil');
      const bas = f.conteneurs[0].enfants.filter(e => e.contraste < 4.5).map(e => `${e.cls} ${e.contraste}`);
      assert.deepEqual(bas, [], bas.join(' ; '));
    });
  });

  // Réponse et hors forum : égaux au bundle de base (fil, bouton flottant, empreinte du contenu). Le sujet mobile (375, 767) est passé au
  // fragment entete (épopée 6, ticket 4 : en-tête de sujet sur le fil commun) ; son bureau reste ici.
  const casB = [
    ...[375, 768].flatMap(width => VARIANTES.map(variante => ({ cle: 'reponse', width, variante }))),
    ...VARIANTES.map(variante => ({ cle: 'regles', width: 375, variante })),
    // Bureau : index RP, sous-forum (colonne native) et sujet.
    ...['rp', 'debuterNatif', 'sujet'].flatMap(cle => [768, 769, 1280].flatMap(width => VARIANTES.map(variante => ({ cle, width, variante }))))
  ];
  const resB = await mapLimit(casB, async c => ({ teste: await lireFil(await ouvrir(c), true), base: await lireFil(await ouvrir({ ...c, src: baseFil }), true) }));
  casB.forEach(({ cle, width, variante }, i) => {
    const { teste, base } = resB[i];
    const quoi = width >= 768 ? 'aucun fil, ' : '';
    check(`fil ${cle} ${variante} ${width} px : ${quoi}égal au bundle de base (${COMMIT_FIL}) : fil, bouton flottant et empreinte du contenu, aucune exception`, () => {
      assert.ok(teste.f.theme && base.f.theme, 'kr-theme-enabled absent');
      if (width >= 768) { assert.equal(teste.f.conteneurs.filter(c => c.cls === R.fil).length, 0, 'fil au bureau'); }
      assert.deepEqual(teste.f, base.f, 'fil');
      const k = teste.e.findIndex((x, j) => x !== base.e[j]);
      assert.ok(k === -1 && teste.e.length === base.e.length, k < 0 ? `éléments : ${teste.e.length} au lieu de ${base.e.length}` : `élément ${k} : ${teste.e[k]} au lieu de ${base.e[k]}`);
      assert.deepEqual(teste.erreurs, []);
    });
  });

  // Seuil : 767 px sans émulation tactile, fil commun ; bascule 768 -> 767 -> 768 -> 767 dans le même onglet.
  const casS = ['rp', 'debuterNatif'].flatMap(cle => VARIANTES.map(variante => ({ cle, width: 767, variante, tactile: false })));
  const resS = await mapLimit(casS, async c => lireFil(await ouvrir(c)));
  casS.forEach(({ cle, variante }, i) => {
    check(`fil seuil ${cle} ${variante} 767 px (non tactile) : fil commun`, () => filCommun(resS[i].f, cle));
  });
  const basculeFil = async cle => {
    const { context, page, erreurs } = await ouvrir({ cle, width: 768, height: 667, tactile: false });
    const etat = () => page.evaluate(r => ({ iw: window.innerWidth, mobile: document.body.classList.contains('mobile-mode'), fils: [...document.querySelectorAll('.' + r.fil)].map(c => c.textContent.replace(/\s+/g, ' ').trim()) }), R);
    const etapes = [await etat()];
    for (const width of [767, 768, 767]) {
      await page.waitForTimeout(ECART_RECHARGEMENT_MS);
      const charge = page.waitForEvent('load', { timeout: 15000 });
      await page.setViewportSize({ width, height: 667 });
      await charge;
      await prete(page, true, `bascule fil ${cle} ${width}`);
      etapes.push(await etat());
    }
    await context.close();
    return { etapes, erreurs };
  };
  const resBascule = await mapLimit(['rp', 'debuterNatif'], basculeFil);
  ['rp', 'debuterNatif'].forEach((cle, i) => {
    const { etapes, erreurs } = resBascule[i];
    const [libelle, , courant] = ATTENDUS[cle];
    check(`fil bascule ${cle} 768 -> 767 -> 768 -> 767 : fil commun à 767, aucun fil à 768`, () => {
      assert.deepEqual(etapes.map(e => [e.iw, e.mobile]), [[768, false], [767, true], [768, false], [767, true]]);
      assert.deepEqual(etapes.map(e => e.fils), [[], [`${libelle}›${courant}`], [], [`${libelle}›${courant}`]]);
      assert.deepEqual(erreurs, []);
    });
  });
}

// ---------- en-tête de sujet mobile dans toutes les catégories (épopée 6, ticket 4) ----------
// Pages dérivées en mémoire : sujet fermé avec lien natif « répondre », entrée active renommée (L4), catégorie inconnue sans entrée active
// (repli final), titre long, image d'icône dans le h1, sujet Communauté servi sous un lien parent HRP (rendu du h1 et du bandeau natif du bas
// comparable à la base). Repères partagés : REPERES_ENTETE_TICKET64, REPERES_FIL_TICKET63 (lib/variantes.mjs).
const TITRE_LONG_SUJET = 'La recette du ragoût de kroquette racontée en entier avec ses variantes régionales et ses anecdotes';
function pagesEntete() {
  const remplacer = (html, motif, par, nom) => { const h = html.replace(motif, par); if (h === html) { throw new Error('page dérivée « ' + nom + ' » : motif absent de la fixture'); } return h; };
  const f = E.fixtures;
  const communaute = fixture(f.communaute);
  const ferme = fixture(f.ferme);
  const titre = html => html.split(E.h1Icone)[1].split('</h1>')[0];
  const repondre = '<a href="forum/post/repondre-2-330504" class="btn btn-default" title="répondre"><i class="fa fa-reply"></i> répondre</a>';
  return {
    eCommunaute: { url: E.chemins.communaute, html: communaute },
    eDebats: { url: E.chemins.debats, html: fixture(f.debats) },
    eStaff: { url: E.chemins.staff, html: fixture(f.staff) },
    eFerme: { url: E.chemins.ferme, html: ferme },
    eFermeLien: { url: E.chemins.ferme, html: remplacer(ferme, /(nouveau sujet<\/a>)/g, '$1\n' + repondre, 'eFermeLien') },
    eLibelle: { url: E.chemins.communaute, html: remplacer(communaute, /(<span class="list-group-item active">\s*)Communauté/, '$1Entre Nous', 'eLibelle') },
    eInconnu: { url: E.chemins.communaute, html: remplacer(remplacer(communaute, /list-group-item active/, 'list-group-item', 'eInconnu'), /forum\/communaute\/bavardage/g, 'forum/coulisses/bavardage', 'eInconnu') },
    eLong: { url: E.chemins.communaute, html: remplacer(communaute, '\n' + titre(communaute) + '</h1>', '\n' + TITRE_LONG_SUJET + '</h1>', 'eLong') },
    eIcone: { url: E.chemins.communaute, html: remplacer(communaute, E.h1Icone, E.h1Icone.trim() + ' <img class="icon" src="http://img7.kraland.org/s/fixture.gif" alt="[=!]">\n', 'eIcone') },
    eHrp: { url: E.chemins.communaute, html: remplacer(communaute, /forum\/communaute\//g, 'forum/hrp/', 'eHrp') }
  };
}

// Mesure de l'en-tête de la page : fils (conteneurs non imbriqués), barres d'actions et leurs actions (styles calculés, boîtes, cible au centre après
// window.scrollTo, contraste), boutons natifs visibles, cadenas, h1 et bandeau natif du bas, jetons résolus, débordements. CONTRASTE évalué
// avant.
const ENTETE = ({ e, r }) => {
  const C = window.__krContraste;
  const r1 = v => Math.round(v * 10) / 10;
  const boite = el => { const b = el.getBoundingClientRect(); return { x: r1(b.left), y: r1(b.top + window.scrollY), w: r1(b.width), h: r1(b.height) }; };
  const visible = el => el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && el.getBoundingClientRect().width > 0;
  const cible = el => {
    const b0 = el.getBoundingClientRect();
    window.scrollTo(0, Math.max(0, b0.top + window.scrollY - 200));
    const b = el.getBoundingClientRect();
    const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    return !!hit && el.contains(hit);
  };
  const longueur = expr => { const i = document.createElement('i'); i.style.borderTopLeftRadius = expr; document.body.appendChild(i); const v = getComputedStyle(i).borderTopLeftRadius; i.remove(); return v; };
  const fond = expr => { const i = document.createElement('i'); i.style.backgroundColor = expr; document.body.appendChild(i); const v = getComputedStyle(i).backgroundColor; i.remove(); return v; };
  // Lignes de texte d'un élément : sommets distincts des boîtes de son contenu (Range), et non sa hauteur.
  const lignes = el => { const g = document.createRange(); g.selectNodeContents(el); return new Set([...g.getClientRects()].filter(q => q.width > 0).map(q => Math.round(q.top))).size; };
  const col = document.getElementById('col-right');
  const conts = [...document.querySelectorAll(r.conteneurs)].filter(c => !c.parentElement.closest(r.conteneurs));
  const cadre = el => { if (!el) { return null; } const s = getComputedStyle(el); return { boite: boite(el), marge: [s.marginTop, s.marginRight, s.marginBottom, s.marginLeft], retrait: [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft], fond: s.backgroundColor, bordure: [s.borderTopWidth, s.borderBottomWidth, s.borderTopStyle] }; };
  const forumTops = [...document.querySelectorAll(e.hautDePage)];
  const out = {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    garde: document.body.classList.contains(e.garde),
    iw: window.innerWidth,
    vh: window.innerHeight,
    sh: document.documentElement.scrollHeight,
    debordCol: col ? col.scrollWidth - col.clientWidth : null,
    debordPage: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    jetons: {
      fondPrimaire: fond(e.jetons.fondPrimaire), textePrimaire: C.sonde(e.jetons.textePrimaire), fondStandard: fond(e.jetons.fondStandard),
      bordureStandard: C.sonde(e.jetons.bordureStandard), texteStandard: C.sonde(e.jetons.texteStandard), rayon: longueur(e.jetons.rayon)
    },
    natifs: [...document.querySelectorAll(e.natifs)].filter(visible).map(b => b.textContent.trim() || b.getAttribute('title')),
    cadenas: [...document.querySelectorAll(e.cadenas)].map(i => i.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })),
    h1: cadre(document.querySelector(e.h1)),
    h1Classe: (document.querySelector(e.h1) || { className: '' }).className,
    basDePage: cadre(forumTops.length > 1 ? forumTops[forumTops.length - 1] : null),
    fils: conts.map(c => ({
      cls: c.className, style: c.getAttribute('style') || '', texte: c.textContent.replace(/\s+/g, ' ').trim(),
      enfants: [...c.children].map(x => ({ tag: x.tagName, cls: x.className, href: x.getAttribute('href'), texte: x.textContent.replace(/\s+/g, ' ').trim(), h: r1(x.getBoundingClientRect().height), lignes: lignes(x), sw: x.scrollWidth, cw: x.clientWidth, contraste: Math.round(C.texte(x) * 100) / 100, liens: x.querySelectorAll('a').length }))
    })),
    barres: [...document.querySelectorAll('.' + e.barre)].map(b => ({
      cls: b.className, boite: boite(b),
      actions: [...b.children].map(a => {
        const s = getComputedStyle(a);
        return {
          cls: a.className, tag: a.tagName, texte: a.textContent.trim(), href: a.getAttribute('href'), boite: boite(a),
          fond: s.backgroundColor, couleur: s.color, bordure: s.borderTopColor, rayon: s.borderTopLeftRadius, contraste: Math.round(C.texte(a) * 100) / 100
        };
      })
    }))
  };
  [...document.querySelectorAll('.' + e.barre)].forEach((b, i) => [...b.children].forEach((a, k) => { out.barres[i].actions[k].cible = cible(a); }));
  conts.forEach((c, i) => [...c.children].forEach((x, k) => { if (x.tagName === 'A') { out.fils[i].enfants[k].cible = cible(x); } }));
  window.scrollTo(0, 0);
  return out;
};

const COMMIT_ENTETE = '7bec452';
if (on('entete')) {
  const baseEntete = strip(process.env.KR_SCRIPT_AVANT_ENTETE ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_ENTETE, 'utf8')
    : execFileSync('git', ['show', `${COMMIT_ENTETE}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
  Object.assign(PAGES, pagesEntete());
  console.log(`\n== entete : en-tête de sujet mobile (Communauté, Débats, Staff, HRP, fermé), 375 et 767 px (variantes ${VARIANTES.join(' et ')}) ; contraste (16 variantes) ; sous-forum, h1, seuil, bascule et bureau égaux à ${COMMIT_ENTETE} ==`);
  const lire = async (o, empreinte = false) => {
    await o.page.evaluate(CONTRASTE);
    const m = await o.page.evaluate(ENTETE, { e: E, r: R });
    const em = empreinte ? await o.page.evaluate(EMPREINTE_FIL) : null;
    await o.context.close();
    return { m, em, erreurs: o.erreurs };
  };
  // Fil attendu : [catégorie, href de la catégorie, forum, href du forum, titre] ; « Répondre » attendu.
  const BAVARDAGE = 'forum/communaute/bavardage-divers-30101';
  const TITRE_COMMUNAUTE = 'La recette du ragoût de kroquette';
  const ATTENDUS = {
    eCommunaute: [['Communauté', 'forum/communaute', 'Bavardage & Divers', BAVARDAGE, TITRE_COMMUNAUTE], true],
    eDebats: [['Débats', 'forum/debats', 'Politique & Société', 'forum/debats/politique-societe-40101', 'Faut-il taxer les chapeaux ?'], true],
    eStaff: [['Staff', 'forum/staff', 'Coulisses', 'forum/staff/coulisses-50101', 'Inventaire des balais'], true],
    sujet: [['Forum HRP', 'forum/hrp', E.parentHrpNom, E.parentHrp, 'Royaume de Ruthvénie : fixture'], true],
    eFerme: [['Communauté', 'forum/communaute', 'Entraide', 'forum/communaute/entraide-30102', 'Mode d’emploi de l’entraide'], false],
    eFermeLien: [['Communauté', 'forum/communaute', 'Entraide', 'forum/communaute/entraide-30102', 'Mode d’emploi de l’entraide'], true],
    eLibelle: [['Entre Nous', 'forum/communaute', 'Bavardage & Divers', BAVARDAGE, TITRE_COMMUNAUTE], true],
    eInconnu: [['Catégorie', 'forum/coulisses', 'Bavardage & Divers', 'forum/coulisses/bavardage-divers-30101', TITRE_COMMUNAUTE], true],
    eLong: [['Communauté', 'forum/communaute', 'Bavardage & Divers', BAVARDAGE, TITRE_LONG_SUJET], true],
    eIcone: [['Communauté', 'forum/communaute', 'Bavardage & Divers', BAVARDAGE, TITRE_COMMUNAUTE], true]
  };
  // Barres attendues : 2, sauf le fil de sujet HRP (un seul bandeau natif dans la fixture : barre du haut seulement, Plan Change Log).
  const nbBarres = cle => (cle === 'sujet' ? 1 : 2);
  const PRINCIPAUX = ['eCommunaute', 'eDebats', 'eStaff', 'sujet', 'eFerme'];
  const EXTRAS = ['eFermeLien', 'eLibelle', 'eInconnu', 'eLong', 'eIcone'];
  const cas = [
    ...PRINCIPAUX.flatMap(cle => [375, 767].flatMap(width => VARIANTES.map(variante => ({ cle, width, variante })))),
    ...EXTRAS.flatMap(cle => VARIANTES.map(variante => ({ cle, width: 375, variante })))
  ];
  const res = await mapLimit(cas, async c => lire(await ouvrir(c)));
  const unFil = (m, cle) => {
    assert.ok(m.theme && m.mobile, `kr-theme-enabled ${m.theme}, mobile ${m.mobile}`);
    assert.deepEqual(m.fils.map(f => f.cls), [R.fil], 'conteneurs de fil');
    const f = m.fils[0];
    const [cat, catHref, forum, forumHref, titre] = ATTENDUS[cle][0];
    assert.deepEqual(f.enfants.map(x => [x.tag, x.cls]), [['A', R.lien], ['SPAN', R.sep], ['A', R.lien], ['SPAN', R.sep], ['SPAN', R.courant]], 'structure du fil');
    assert.deepEqual(f.enfants.filter(x => x.tag === 'A').map(x => [x.texte, x.href]), [[cat, catHref], [forum, forumHref]], 'libellés et cibles des liens');
    assert.equal(f.enfants[4].texte, titre, 'courant');
    assert.equal(f.enfants[4].liens, 0, 'lien dans le courant');
    assert.equal(f.style, '', 'style en ligne du fil');
  };
  // « color(srgb r g b) » (mélange de couleurs : bordure teintée, header-tint du clair) : composantes 0..1 ramenées à 0..255 avant la tolérance de 1.
  const rgb = s => { const v = (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number); return s.startsWith('color(srgb') ? v.map(x => x * 255) : v; };
  const proche = (a, b) => { const x = rgb(a); const y = rgb(b); return x.length === 3 && [0, 1, 2].every(i => Math.abs(x[i] - y[i]) <= 1); };
  const actionsDe = m => m.barres.flatMap(b => b.actions);
  cas.forEach(({ cle, width, variante }, i) => {
    const { m, erreurs } = res[i];
    const lab = `entete ${cle} ${variante} ${width} px`;
    const [att, repondre] = ATTENDUS[cle];
    check(`${lab} : un seul fil, de la famille commune, « ${att[0]} › ${att[2]} › ${att[4].slice(0, 30)}… », liens vers ${att[1]} et ${att[3]}, courant span sans lien ; aucune exception`, () => {
      unFil(m, cle);
      assert.deepEqual(erreurs, []);
    });
    check(`${lab} : ${nbBarres(cle) === 2 ? 'une barre en haut (premier écran) et une en bas (dernier écran)' : 'une barre en haut (premier écran)'}, chacune ${repondre ? '« Répondre » puis ' : 'sans « Répondre », '}« Nouveau sujet », href natifs ; boutons natifs invisibles`, () => {
      assert.equal(m.barres.length, nbBarres(cle), 'barres : ' + m.barres.map(b => b.cls).join(', '));
      const [haut] = m.barres;
      assert.ok(haut.boite.y < m.vh, `barre du haut à ${haut.boite.y} px (fenêtre ${m.vh})`);
      if (nbBarres(cle) === 2) {
        const bas = m.barres[1];
        assert.ok(bas.cls.split(' ').includes(E.barreBas), 'classe de la barre du bas : ' + bas.cls);
        assert.ok(bas.boite.y + bas.boite.h > m.sh - m.vh, `barre du bas à ${bas.boite.y} px (page ${m.sh}, fenêtre ${m.vh})`);
      }
      const attendu = [...(repondre ? [[E.repondre, 'Répondre']] : []), [E.nouveau, 'Nouveau sujet']];
      m.barres.forEach((b, k) => assert.deepEqual(b.actions.map(a => [a.cls.split(' ').find(c => c === E.repondre || c === E.nouveau), a.texte]), attendu, `actions de la barre ${k}`));
      const hrefs = actionsDe(m).map(a => a.href);
      assert.ok(hrefs.every(h => /^forum\/post\/(nouveau|repondre)/.test(h)), 'href : ' + hrefs.join(', '));
      assert.deepEqual(m.natifs, [], 'boutons natifs visibles');
    });
    check(`${lab} : « Répondre » primaire (fond et texte --kr-arm-*), « Nouveau sujet » standard (fond de surface, bordure teintée, texte de la nation) ; au moins 44 px de haut, rayon --kr-radius-sm, elementFromPoint au centre ; liens du fil d'au moins 44 px, elementFromPoint au centre`, () => {
      const j = m.jetons;
      const as = actionsDe(m);
      assert.ok(as.length > 0, 'aucune action');
      as.forEach(a => {
        const quoi = `${a.texte} (${a.boite.y})`;
        if (a.cls.includes(E.repondre)) {
          assert.ok(proche(a.fond, j.fondPrimaire) && proche(a.couleur, j.textePrimaire), `${quoi} : fond ${a.fond} / ${j.fondPrimaire}, texte ${a.couleur} / ${j.textePrimaire}`);
        } else {
          assert.ok(proche(a.fond, j.fondStandard) && proche(a.bordure, j.bordureStandard) && proche(a.couleur, j.texteStandard), `${quoi} : fond ${a.fond} / ${j.fondStandard}, bordure ${a.bordure} / ${j.bordureStandard}, texte ${a.couleur} / ${j.texteStandard}`);
        }
        assert.ok(a.boite.h >= 44, `${quoi} : hauteur ${a.boite.h}`);
        assert.equal(a.rayon, j.rayon, `${quoi} : rayon`);
        assert.ok(a.cible, `${quoi} : elementFromPoint au centre hors de l'action`);
      });
      const liens = (m.fils[0] || { enfants: [] }).enfants.filter(x => x.tag === 'A');
      assert.ok(liens.length > 0, 'aucun lien de fil');
      liens.forEach(x => { assert.ok(x.h >= 44, `lien « ${x.texte} » : hauteur ${x.h}`); assert.ok(x.cible, `lien « ${x.texte} » : elementFromPoint au centre hors du lien`); });
    });
    check(`${lab} : aucun débordement horizontal (#col-right et page) ; courant sur une ligne${cle === 'eLong' ? ', tronqué' : ''}`, () => {
      assert.equal(m.debordCol, 0, 'débordement horizontal de #col-right');
      assert.equal(m.debordPage, 0, 'débordement horizontal de la page');
      const k = ((m.fils[0] || { enfants: [] }).enfants[4]) || null;
      assert.ok(k, 'courant absent');
      assert.ok(k.h <= 44, 'hauteur du courant ' + k.h);
      assert.equal(k.lignes, 1, 'lignes du courant');
      if (cle === 'eLong') { assert.ok(k.sw > k.cw, `courant non tronqué : scrollWidth ${k.sw}, clientWidth ${k.cw}`); }
    });
    if (cle === 'eFerme' || cle === 'eFermeLien') {
      check(`${lab} : sujet fermé, cadenas visible dans la méta ; ${repondre ? '2 « Répondre » (lien natif présent)' : '0 « Répondre » (aucun lien natif)'}, 2 « Nouveau sujet »`, () => {
        assert.deepEqual(m.cadenas, [true], 'cadenas');
        const n = cls => actionsDe(m).filter(a => a.cls.includes(cls)).length;
        assert.deepEqual([n(E.repondre), n(E.nouveau)], [repondre ? 2 : 0, 2]);
      });
    }
  });

  // Contraste : 16 variantes, 375 px, Communauté : liens, séparateurs et courant du fil, « Répondre », « Nouveau sujet ».
  const casC = TOUTES_VARIANTES.map(variante => ({ cle: 'eCommunaute', width: 375, variante }));
  const resC = await mapLimit(casC, async c => lire(await ouvrir(c)));
  casC.forEach(({ variante }, i) => {
    const { m } = resC[i];
    check(`entete eCommunaute ${variante} 375 px : fil, « Répondre » et « Nouveau sujet » d'au moins 4,5:1`, () => {
      assert.equal(m.fils.length, 1, 'conteneurs de fil');
      const tous = [...m.fils[0].enfants.map(x => [x.cls, x.contraste]), ...actionsDe(m).map(a => [a.texte, a.contraste])];
      assert.ok(actionsDe(m).length === 4, 'actions : ' + actionsDe(m).length);
      const bas = tous.filter(([, c]) => c < 4.5).map(([n, c]) => `${n} ${c}`);
      assert.deepEqual(bas, [], bas.join(' ; '));
    });
  });

  // Survol de « Nouveau sujet » (bouton standard, comme .btn-default) : fond header-tint, bordure teintée, texte de la nation, sans
  // soulignement ; « Répondre » de la même barre inchangé. Survol à la souris (page.hover), 200 ms pour la transition de couleur des liens.
  const casS = VARIANTES.map(variante => ({ cle: 'eCommunaute', width: 375, variante }));
  const resS = await mapLimit(casS, async c => {
    const o = await ouvrir(c);
    // Base sans barre : aucun survol, le contrôle échoue sur « absent » au lieu d'interrompre la suite.
    const nouveau = o.page.locator(`.${E.barre} .${E.nouveau}`).first();
    if (await nouveau.count()) { await nouveau.hover(); }
    await o.page.waitForTimeout(200);
    const s = await o.page.evaluate(e => {
      const fond = expr => { const i = document.createElement('i'); i.style.backgroundColor = expr; document.body.appendChild(i); const v = getComputedStyle(i).backgroundColor; i.remove(); return v; };
      const texte = expr => { const i = document.createElement('i'); i.style.color = expr; document.body.appendChild(i); const v = getComputedStyle(i).color; i.remove(); return v; };
      const a = document.querySelector(`.${e.barre} .${e.nouveau}`);
      if (!a) { return null; }
      const cs = getComputedStyle(a);
      return {
        survol: a.matches(':hover'), fond: cs.backgroundColor, bordure: cs.borderTopColor, couleur: cs.color, deco: cs.textDecorationLine,
        attendu: { fond: fond(e.jetons.fondSurvol), repos: fond(e.jetons.fondStandard), bordure: texte(e.jetons.bordureStandard), couleur: texte(e.jetons.texteStandard) }
      };
    }, E);
    await o.context.close();
    return { s, erreurs: o.erreurs };
  });
  casS.forEach(({ variante }, i) => {
    const { s, erreurs } = resS[i];
    check(`entete eCommunaute ${variante} 375 px : « Nouveau sujet » survolé en fond header-tint, bordure teintée, texte de la nation, sans soulignement`, () => {
      assert.ok(s, '« Nouveau sujet » absent de la barre');
      assert.ok(s.survol, 'pas de survol');
      assert.ok(proche(s.fond, s.attendu.fond), `fond ${s.fond} / ${s.attendu.fond}`);
      assert.ok(!proche(s.fond, s.attendu.repos), `fond de repos ${s.fond} au survol`);
      assert.ok(proche(s.bordure, s.attendu.bordure) && proche(s.couleur, s.attendu.couleur), `bordure ${s.bordure} / ${s.attendu.bordure}, texte ${s.couleur} / ${s.attendu.couleur}`);
      assert.equal(s.deco, 'none', 'soulignement');
      assert.deepEqual(erreurs, []);
    });
  });

  // Égal au bundle de base : sous-forum « Débuter » à 375 (« Nouveau sujet » partagé) ; h1 et bandeau natif du bas d'un sujet sous lien HRP
  // (rendu de la base) ; seuil 768 et 769 ; bureau 768 et 1280 des 5 fixtures.
  const vueAction = m => actionsDe(m).map(a => ({ cls: a.cls, texte: a.texte, href: a.href, boite: a.boite, fond: a.fond, couleur: a.couleur, bordure: a.bordure, rayon: a.rayon }));
  const casB = [
    ...VARIANTES.map(variante => ({ cle: 'debuter', width: 375, variante, quoi: 'sous' })),
    ...VARIANTES.map(variante => ({ cle: 'eHrp', width: 375, variante, quoi: 'h1' })),
    ...[768, 769].map(width => ({ cle: 'eCommunaute', width, variante: VARIANTES[0], quoi: 'seuil', tactile: false })),
    ...[...PRINCIPAUX].flatMap(cle => [768, 1280].flatMap(width => VARIANTES.map(variante => ({ cle, width, variante, quoi: 'bureau' }))))
  ];
  const resB = await mapLimit(casB, async ({ quoi, ...c }) => ({ teste: await lire(await ouvrir(c), quoi !== 'h1'), base: await lire(await ouvrir({ ...c, src: baseEntete }), quoi !== 'h1') }));
  const empreinteEgale = (t, b) => {
    const k = t.em.findIndex((x, j) => x !== b.em[j]);
    assert.ok(k === -1 && t.em.length === b.em.length, k < 0 ? `éléments : ${t.em.length} au lieu de ${b.em.length}` : `élément ${k} : ${t.em[k]} au lieu de ${b.em[k]}`);
  };
  casB.forEach(({ cle, width, variante, quoi }, i) => {
    const { teste: t, base: b } = resB[i];
    const lab = `entete ${cle} ${variante} ${width} px`;
    if (quoi === 'sous') {
      check(`${lab} : sous-forum, « Nouveau sujet » (styles calculés, boîtes) et empreinte du contenu égaux au bundle de base (${COMMIT_ENTETE}), sans garde du sujet`, () => {
        assert.ok(t.m.theme && b.m.theme, 'kr-theme-enabled absent');
        assert.equal(t.m.garde, false, 'garde du sujet posée sur le sous-forum');
        assert.ok(actionsDe(t.m).length >= 1, 'aucune action');
        assert.deepEqual(vueAction(t.m), vueAction(b.m));
        empreinteEgale(t, b);
        assert.deepEqual(t.erreurs, []);
      });
    } else if (quoi === 'h1') {
      check(`${lab} : h1 (classe posée, position, largeur, marges, retraits, fond, bordure) et bandeau natif du bas (marges, retraits, fond, bordure, largeur) égaux au bundle de base (${COMMIT_ENTETE}), sans style en ligne`, () => {
        assert.ok(t.m.theme && b.m.theme && t.m.garde, `kr-theme-enabled ${t.m.theme}/${b.m.theme}, garde ${t.m.garde}`);
        assert.ok(t.m.h1Classe.split(' ').includes(E.titre), 'classe du h1 : ' + t.m.h1Classe);
        const vue = c => c && ({ x: c.boite.x, y: c.boite.y, w: c.boite.w, marge: c.marge, retrait: c.retrait, fond: c.fond, bordure: c.bordure });
        const vueBas = c => c && ({ x: c.boite.x, w: c.boite.w, marge: c.marge, retrait: c.retrait, fond: c.fond, bordure: c.bordure });
        assert.deepEqual(vue(t.m.h1), vue(b.m.h1), 'h1 ' + JSON.stringify(vue(t.m.h1)) + ' BASE ' + JSON.stringify(vue(b.m.h1)));
        assert.deepEqual(vueBas(t.m.basDePage), vueBas(b.m.basDePage), 'bandeau natif du bas');
        const bt = t.m.barres[1];
        const bb = b.m.barres[1];
        assert.ok(bt && bb, 'barre du bas absente');
        assert.deepEqual([bt.boite.x, bt.boite.w], [bb.boite.x, bb.boite.w], 'barre du bas (marge droite N-1)');
        assert.deepEqual(t.erreurs, []);
      });
    } else {
      check(`${lab}${quoi === 'seuil' ? ' (non tactile)' : ''} : aucun en-tête mobile, empreinte du contenu égale au bundle de base (${COMMIT_ENTETE}), aucune exception`, () => {
        assert.ok(t.m.theme && b.m.theme, 'kr-theme-enabled absent');
        assert.deepEqual([t.m.mobile, t.m.garde, t.m.barres.length, t.m.fils.length], [false, false, 0, 0], 'mobile, garde, barres, fils');
        empreinteEgale(t, b);
        assert.deepEqual(t.erreurs, []);
      });
    }
  });

  // Seuil 767 non tactile : en-tête mobile ; bascule 768 -> 767 -> 768 -> 767 dans le même onglet.
  {
    const { m } = await lire(await ouvrir({ cle: 'eCommunaute', width: 767, variante: VARIANTES[0], tactile: false }));
    check('entete seuil eCommunaute 767 px (non tactile) : en-tête mobile (un fil, deux barres)', () => {
      unFil(m, 'eCommunaute');
      assert.equal(m.barres.length, 2, 'barres');
    });
  }
  {
    const { context, page, erreurs } = await ouvrir({ cle: 'eCommunaute', width: 768, height: 667, tactile: false });
    const etat = () => page.evaluate(({ e, r }) => ({ iw: window.innerWidth, mobile: document.body.classList.contains('mobile-mode'), garde: document.body.classList.contains(e.garde), fils: document.querySelectorAll('.' + r.fil).length, barres: document.querySelectorAll('.' + e.barre).length }), { e: E, r: R });
    const etapes = [await etat()];
    for (const width of [767, 768, 767]) {
      await page.waitForTimeout(ECART_RECHARGEMENT_MS);
      const charge = page.waitForEvent('load', { timeout: 15000 });
      await page.setViewportSize({ width, height: 667 });
      await charge;
      await prete(page, true, `bascule entete ${width}`);
      etapes.push(await etat());
    }
    await context.close();
    check('entete bascule eCommunaute 768 -> 767 -> 768 -> 767 : en-tête mobile à 767 (un fil, deux barres, garde), rendu natif à 768', () => {
      const m = [false, 0, 0, false];
      const v = [true, 1, 2, true];
      assert.deepEqual(etapes.map(x => [x.iw, x.mobile, x.fils, x.barres, x.garde]), [[768, ...m], [767, ...v], [768, ...m], [767, ...v]]);
      assert.deepEqual(erreurs, []);
    });
  }
}

// ---------- Bouton « ••• » commun au forum et au kramail (épopée 6, ticket 5) ----------
// Trois pages : sujet du forum (« ••• » de chaque message), réception et lecture du kramail (toggle du menu du h1). Repères partagés :
// REPERES_PLUS_TICKET65 (lib/variantes.mjs). Aucun clic sur un item de menu du kramail (actions de jeu) : les items sont mesurés seulement.
// Mesure de la page : boutons d'accroche (hôtes) et boutons de classe commune, glyphe, styles calculés, boîte, cible au centre (window.scrollTo
// puis elementFromPoint), contraste du glyphe ; autres actions du message (forum) et autres boutons du h1 (kramail) ; ancienne icône ; voile.
// CONTRASTE évalué avant.
const PLUS = ({ p, cle }) => {
  const C = window.__krContraste;
  const r1 = v => Math.round(v * 10) / 10;
  const boite = el => { const b = el.getBoundingClientRect(); return { x: r1(b.left), y: r1(b.top + window.scrollY), w: r1(b.width), h: r1(b.height) }; };
  const fond = expr => { const i = document.createElement('i'); i.style.backgroundColor = expr; document.body.appendChild(i); const v = getComputedStyle(i).backgroundColor; i.remove(); return v; };
  const cible = el => {
    const b0 = el.getBoundingClientRect();
    window.scrollTo(0, Math.max(0, b0.top + window.scrollY - 200));
    const b = el.getBoundingClientRect();
    const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    return !!hit && el.contains(hit);
  };
  const couleurs = el => { const s = getComputedStyle(el); return { fond: s.backgroundColor, bordure: s.borderTopColor, couleur: s.color, bordureL: s.borderTopWidth }; };
  const hotes = [...document.querySelectorAll(p.hotes[cle])];
  const communs = [...document.querySelectorAll('.' + p.plus)];
  const out = {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    iw: window.innerWidth,
    voiles: document.querySelectorAll('.' + p.voile).length,
    anciens: document.querySelectorAll('.' + p.ancien).length,
    communs: communs.length,
    hotesCommuns: hotes.filter(h => communs.includes(h)).length,
    jetons: { fond: fond(p.jetons.fond), bordure: C.sonde(p.jetons.bordure), texte: C.sonde(p.jetons.texte) },
    hotes: hotes.map(h => {
      const g = h.querySelector('.' + p.glyphe);
      const sg = g ? getComputedStyle(g) : null;
      return {
        cls: h.className, texte: h.textContent.trim(), label: h.getAttribute('aria-label'), type: h.getAttribute('type'),
        enfants: [...h.children].map(c => [c.tagName, c.className, c.getAttribute(p.cache)]), icones: h.querySelectorAll('i').length,
        boite: boite(h), ...couleurs(h), rayon: getComputedStyle(h).borderTopLeftRadius,
        glyphe: g ? { taille: sg.fontSize, graisse: sg.fontWeight, espace: sg.letterSpacing, w: r1(g.getBoundingClientRect().width), h: r1(g.getBoundingClientRect().height), contraste: Math.round(C.texte(g) * 100) / 100 } : null
      };
    }),
    // Forum : autres actions des barres (hors « ••• ») ; kramail : autres boutons du h1 (hors toggle du menu).
    voisins: cle === 'sujet'
      ? [...document.querySelectorAll(p.message + ' > ' + p.barre + ' .btn')].filter(b => !hotes.includes(b)).map(b => ({ cls: b.className, ...couleurs(b) }))
      : [...document.querySelectorAll(p.boutonsH1)].filter(b => !hotes.includes(b)).map(b => ({ cls: b.className, href: b.getAttribute('href'), boite: boite(b), ...couleurs(b) }))
  };
  hotes.forEach((h, i) => { out.hotes[i].cible = cible(h); });
  window.scrollTo(0, 0);
  return out;
};
// Ouverture et voile : premier item (forum : première action secondaire visible du message ouvert ; kramail : premier item du menu),
// visible, cible au centre (window.scrollTo puis elementFromPoint), élément touché.
const OUVERT = ({ p, cle }) => {
  const visible = el => el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && el.getBoundingClientRect().width > 0;
  const h = document.querySelector(p.hotes[cle]);
  if (!h) { return null; }
  const conteneur = cle === 'sujet' ? h.closest(p.message) : h.closest(p.groupe);
  const items = cle === 'sujet' ? [...conteneur.querySelectorAll(p.secondaire)].filter(visible) : [...conteneur.querySelectorAll(p.item)].filter(visible);
  const premier = items[0] || null;
  let point = null;
  if (premier) {
    const b0 = premier.getBoundingClientRect();
    window.scrollTo(0, Math.max(0, b0.top + window.scrollY - 200));
    const b = premier.getBoundingClientRect();
    const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    point = { dedans: !!hit && premier.contains(hit), touche: hit ? hit.tagName + '.' + hit.className : null };
  }
  const v = document.querySelector('.' + p.voile);
  const sv = v ? getComputedStyle(v) : null;
  window.scrollTo(0, 0);
  return {
    ouvert: cle === 'sujet' ? conteneur.classList.contains(p.ouvert) : conteneur.classList.contains('open'),
    menu: cle === 'sujet' ? null : visible(conteneur.querySelector(p.menu)),
    items: items.length, premier: premier ? premier.textContent.trim() : null, point,
    voiles: document.querySelectorAll('.' + p.voile).length, voile: sv ? { position: sv.position, couche: sv.zIndex } : null
  };
};
// Voile simulé, comme Bootstrap 3.3.7 sur tactile (classe P.voile, CSS du vendor : fixe, 990). Kramail : inséré juste après le toggle
// (insertAfter de Bootstrap). Forum : le « ••• » n'est pas un toggle Bootstrap, aucun voile n'est posé après lui ; le voile résiduel d'un autre
// menu de la page est dans le contexte d'empilement racine : il est posé en dernier enfant de body (Plan Change Log).
const VOILE = ({ p, cle, poser }) => {
  if (!poser) { document.querySelectorAll('.' + p.voile).forEach(v => v.remove()); return document.querySelectorAll('.' + p.voile).length; }
  const v = document.createElement('div');
  v.className = p.voile;
  const h = document.querySelector(p.hotes[cle]);
  if (cle === 'sujet' || !h) { document.body.appendChild(v); } else { h.after(v); }
  return 1;
};

const COMMIT_PLUS = '7bec452'; // recalage du sweep 9.12 (anciennes bases 6270c81 puis d64c578) : entrées 9.1 à 9.10 comprises
if (on('plus')) {
  const basePlus = strip(process.env.KR_SCRIPT_AVANT_PLUS ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_PLUS, 'utf8')
    : execFileSync('git', ['show', `${COMMIT_PLUS}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
  Object.assign(PAGES, {
    pReception: { url: P.chemins.reception, html: fixture(P.fixtures.reception) },
    pLecture: { url: P.chemins.lecture, html: fixture(P.fixtures.lecture) }
  });
  const CLE = { sujet: 'sujet', reception: 'pReception', lecture: 'pLecture' };
  const NOMS = Object.keys(CLE);
  console.log(`\n== plus : bouton « ••• » commun (sujet, réception et lecture du kramail), 375 et 767 px tactiles (variantes ${VARIANTES.join(' et ')}) ; toucher, voile 990 ; contraste (16 variantes) ; seuil, bascule et bureau égaux à ${COMMIT_PLUS} ==`);
  const rgb = s => { const v = (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number); return s.startsWith('color(srgb') ? v.map(x => x * 255) : v; };
  const proche = (a, b) => { const x = rgb(a); const y = rgb(b); return x.length === 3 && [0, 1, 2].every(i => Math.abs(x[i] - y[i]) <= 1); };
  const mesurer = async (o, nom) => {
    await o.page.evaluate(CONTRASTE);
    return o.page.evaluate(PLUS, { p: P, cle: nom });
  };
  // Parcours d'une page : mesure au repos, toucher du premier « ••• » (cible vérifiée avant), état ouvert et voile réel éventuel, voile
  // simulé posé puis retiré.
  const parcours = async c => {
    const o = await ouvrir({ ...c, cle: CLE[c.nom] });
    const m = await mesurer(o, c.nom);
    const centre = await o.page.evaluate(({ p, cle }) => {
      const h = document.querySelector(p.hotes[cle]);
      if (!h) { return null; }
      const b0 = h.getBoundingClientRect();
      window.scrollTo(0, Math.max(0, b0.top + window.scrollY - 200));
      const b = h.getBoundingClientRect();
      const x = b.left + b.width / 2; const y = b.top + b.height / 2;
      const hit = document.elementFromPoint(x, y);
      return hit && h.contains(hit) ? { x, y } : null;
    }, { p: P, cle: c.nom });
    let reel = null; let simule = null; let reste = null; let actives = null;
    if (centre) {
      // Items du menu ou secondaires : tout clic reçu est compté et annulé (aucune action, même en fixture).
      await o.page.evaluate(({ p, cle }) => {
        window.__krItems = 0;
        const sel = cle === 'sujet' ? p.secondaire : p.item;
        document.addEventListener('click', e => { if (e.target.closest(sel)) { window.__krItems++; e.preventDefault(); e.stopImmediatePropagation(); } }, true);
      }, { p: P, cle: c.nom });
      await o.page.touchscreen.tap(centre.x, centre.y);
      await o.page.waitForTimeout(150);
      actives = await o.page.evaluate(() => window.__krItems);
      reel = await o.page.evaluate(OUVERT, { p: P, cle: c.nom });
      await o.page.evaluate(VOILE, { p: P, cle: c.nom, poser: true });
      simule = await o.page.evaluate(OUVERT, { p: P, cle: c.nom });
      reste = await o.page.evaluate(VOILE, { p: P, cle: c.nom, poser: false });
    }
    await o.context.close();
    return { m, centre, reel, simule, reste, actives, erreurs: o.erreurs };
  };
  const cas = NOMS.flatMap(nom => [375, 767].flatMap(width => VARIANTES.map(variante => ({ nom, width, variante }))));
  const res = await mapLimit(cas, async c => ({ t: await parcours(c), b: await parcours({ ...c, src: basePlus }) }));
  const vueKramail = v => v.map(x => ({ cls: x.cls, boite: x.boite, fond: x.fond, bordure: x.bordure, couleur: x.couleur }));
  const vueVoisin = v => v.map(x => ({ cls: x.cls, fond: x.fond, bordure: x.bordure, couleur: x.couleur, bordureL: x.bordureL }));
  cas.forEach(({ nom, width, variante }, i) => {
    const { t, b } = res[i];
    const { m } = t;
    const lab = `plus ${nom} ${variante} ${width} px`;
    check(`${lab} : un seul sélecteur (.${P.plus}) : chaque bouton d'accroche le porte, aucun autre ; aucune ancienne icône (${P.ancien}) ; aucun voile au chargement ; aucune exception`, () => {
      assert.ok(m.theme && m.mobile, `kr-theme-enabled ${m.theme}, mobile ${m.mobile}`);
      assert.ok(m.hotes.length >= 1, 'aucun bouton d\'accroche');
      assert.deepEqual([m.hotesCommuns, m.communs], [m.hotes.length, m.hotes.length], `boutons d'accroche ${m.hotes.length}, portant .${P.plus} ${m.hotesCommuns}, .${P.plus} dans la page ${m.communs}`);
      assert.equal(m.anciens, 0, 'ancienne icône');
      assert.equal(m.voiles, 0, 'voile au chargement');
      assert.deepEqual(t.erreurs, []);
    });
    check(`${lab} : glyphe texte « ••• » dans un span.${P.glyphe} masqué aux lecteurs d'écran, aucune icône ; aria-label « Autres actions » ; type button`, () => {
      m.hotes.forEach((h, k) => {
        assert.equal(h.texte, '•••', `bouton ${k} : texte`);
        assert.deepEqual(h.enfants, [['SPAN', P.glyphe, 'true']], `bouton ${k} : contenu`);
        assert.equal(h.icones, 0, `bouton ${k} : icônes`);
        assert.equal(h.label, 'Autres actions', `bouton ${k} : aria-label`);
        assert.equal(h.type, 'button', `bouton ${k} : type`);
      });
    });
    check(`${lab} : chaque « ••• » d'au moins 44 x 44 px, elementFromPoint au centre dans le bouton ; glyphe visible (14 px, 700, non nul)`, () => {
      assert.ok(m.hotes.length >= 1, 'aucun bouton d\'accroche');
      m.hotes.forEach((h, k) => {
        assert.ok(h.boite.w >= 44 && h.boite.h >= 44, `bouton ${k} : ${h.boite.w} x ${h.boite.h}`);
        assert.ok(h.cible, `bouton ${k} : elementFromPoint au centre hors du bouton`);
        assert.ok(h.glyphe, `bouton ${k} : glyphe absent`);
        assert.deepEqual([h.glyphe.taille, h.glyphe.graisse], ['14px', '700'], `bouton ${k} : taille et graisse du glyphe`);
        assert.ok(h.glyphe.w > 0 && h.glyphe.h > 0, `bouton ${k} : glyphe ${h.glyphe.w} x ${h.glyphe.h}`);
      });
    });
    if (nom === 'sujet') {
      check(`${lab} : « ••• » du forum en bouton standard (fond de surface, bordure teintée, texte de la nation), 44 px de large`, () => {
        const j = m.jetons;
        m.hotes.forEach((h, k) => {
          assert.ok(proche(h.fond, j.fond) && proche(h.bordure, j.bordure) && proche(h.couleur, j.texte), `bouton ${k} : fond ${h.fond} / ${j.fond}, bordure ${h.bordure} / ${j.bordure}, texte ${h.couleur} / ${j.texte}`);
          assert.ok(Math.abs(h.boite.w - 44) < 0.5, `bouton ${k} : largeur ${h.boite.w}`);
        });
      });
      check(`${lab} : autres actions du message (fond, bordure, texte) égales au bundle de base (${COMMIT_PLUS})`, () => {
        assert.ok(m.voisins.length > 0, 'aucune autre action');
        assert.deepEqual(vueVoisin(m.voisins), vueVoisin(b.m.voisins));
      });
    } else {
      check(`${lab} : « ••• » du kramail (fond, bordure, texte, boîte, rayon) et autres boutons du h1 (boîtes, fond, bordure, texte) égaux au bundle de base (${COMMIT_PLUS})`, () => {
        assert.equal(m.hotes.length, b.m.hotes.length, 'boutons d\'accroche');
        const vue = h => ({ boite: h.boite, fond: h.fond, bordure: h.bordure, couleur: h.couleur, rayon: h.rayon });
        assert.deepEqual(m.hotes.map(vue), b.m.hotes.map(vue), '« ••• »');
        assert.ok(m.voisins.length > 0, 'aucun autre bouton du h1');
        assert.deepEqual(vueKramail(m.voisins), vueKramail(b.m.voisins), 'autres boutons du h1');
      });
    }
    // Voile réel du kramail non contrôlé ici : le module arrête la propagation du clic, Bootstrap n'en pose donc aucun (vrai par
    // construction) ; le voile simulé ci-dessous couvre le cas.
    check(`${lab} : toucher du « ••• » : ${nom === 'sujet' ? 'message ouvert, 4 actions secondaires visibles' : 'menu ouvert et visible'} ; aucun item activé (clic d'item compté et annulé)`, () => {
      assert.ok(t.centre, 'cible du toucher hors du « ••• »');
      assert.ok(t.reel && t.reel.ouvert, 'non ouvert : ' + JSON.stringify(t.reel));
      if (nom === 'sujet') { assert.equal(t.reel.items, 4, 'actions secondaires visibles'); } else {
        assert.ok(t.reel.menu && t.reel.items > 0, 'menu : ' + JSON.stringify(t.reel));
      }
      assert.equal(t.actives, 0, 'items activés par le toucher');
    });
    check(`${lab} : voile simulé (fixe, 990, ${nom === 'sujet' ? 'contexte racine' : 'inséré après le toggle'}) : elementFromPoint au centre du premier item rend l'item ; voile retiré ensuite`, () => {
      const s = t.simule;
      assert.ok(s && s.voile, 'voile simulé absent');
      assert.deepEqual([s.voile.position, s.voile.couche], ['fixed', '990'], 'voile simulé : CSS du vendor');
      assert.ok(s.point, 'aucun premier item : ' + JSON.stringify(s));
      assert.ok(s.point.dedans, `premier item « ${s.premier} » couvert : ${s.point.touche}`);
      assert.equal(t.reste, 0, 'voile restant');
    });
  });

  // Mini-chat plein écran (#flap posé en mémoire, SUJET_FLAP) ouvert au-dessus d'un message ouvert : au centre de la partie d'une action
  // secondaire couverte par le panneau, elementFromPoint rend le panneau, pas la barre du message (barre sous le mini-chat).
  const casChat = [375, 767].flatMap(width => VARIANTES.map(variante => ({ width, variante })));
  const resChat = await mapLimit(casChat, async c => {
    const o = await ouvrir({ cle: 'sujet', html: SUJET_FLAP, width: c.width, variante: c.variante });
    const centre = await o.page.evaluate(({ p }) => {
      const h = document.querySelector(p.hotes.sujet);
      if (!h) { return null; }
      const b0 = h.getBoundingClientRect();
      window.scrollTo(0, Math.max(0, b0.top + window.scrollY - 200));
      const b = h.getBoundingClientRect();
      const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      return hit && h.contains(hit) ? { x: b.left + b.width / 2, y: b.top + b.height / 2 } : null;
    }, { p: P });
    let r = null;
    if (centre) {
      await o.page.touchscreen.tap(centre.x, centre.y);
      await o.page.waitForTimeout(150);
      const ouvreur = await o.page.evaluate(({ p }) => { const f = document.querySelector(p.chat.fab) || document.querySelector(p.chat.lien); if (!f) { return null; } f.click(); return f.tagName + '.' + f.className; }, { p: P });
      await o.page.waitForTimeout(400);
      r = await o.page.evaluate(({ p }) => {
        const f = document.getElementById(p.chat.id);
        const bf = f.getBoundingClientRect();
        const sf = getComputedStyle(f);
        const m = document.querySelector(p.hotes.sujet).closest(p.message);
        const items = [...m.querySelectorAll(p.secondaire)].filter(e => e.checkVisibility() && e.getBoundingClientRect().width > 0);
        const points = items.map(e => {
          const b = e.getBoundingClientRect();
          const x0 = Math.max(b.left, bf.left, 0); const x1 = Math.min(b.right, bf.right, window.innerWidth);
          const y0 = Math.max(b.top, bf.top, 0); const y1 = Math.min(b.bottom, bf.bottom, window.innerHeight);
          if (x1 - x0 < 2 || y1 - y0 < 2) { return null; }
          const hit = document.elementFromPoint((x0 + x1) / 2, (y0 + y1) / 2);
          return { panneau: !!hit && f.contains(hit), barre: !!hit && !!hit.closest(p.barre), touche: hit ? hit.tagName + '.' + hit.className : null };
        }).filter(Boolean);
        return { ouvert: m.classList.contains(p.ouvert), items: items.length, flap: { z: sf.zIndex, vis: sf.visibility, boite: [Math.round(bf.left), Math.round(bf.top), Math.round(bf.width), Math.round(bf.height)] }, points };
      }, { p: P });
      r.ouvreur = ouvreur;
    }
    await o.context.close();
    return { centre, r, erreurs: o.erreurs };
  });
  casChat.forEach(({ width, variante }, i) => {
    const { centre, r, erreurs } = resChat[i];
    check(`plus sujet ${variante} ${width} px : mini-chat plein écran ouvert au-dessus d'un message ouvert : elementFromPoint sur les actions secondaires couvertes rend le panneau, pas la barre`, () => {
      assert.ok(centre, 'cible du toucher hors du « ••• »');
      assert.ok(r && r.ouvert && r.items === 4, 'message non ouvert : ' + JSON.stringify(r));
      assert.ok(r.ouvreur, 'aucun ouvreur du mini-chat');
      assert.ok(r.points.length > 0, 'aucune action secondaire sous le panneau : ' + JSON.stringify(r.flap));
      const dessus = r.points.filter(x => !x.panneau);
      assert.deepEqual(dessus, [], 'barre au-dessus du mini-chat (z ' + r.flap.z + ') : ' + JSON.stringify(dessus));
      assert.deepEqual(erreurs, []);
    });
  });

  // Contraste : 16 variantes, 375 px, sujet : glyphe de chaque « ••• » d'au moins 4,5:1.
  const casC = TOUTES_VARIANTES.map(variante => ({ cle: 'sujet', width: 375, variante }));
  const resC = await mapLimit(casC, async c => { const o = await ouvrir(c); const m = await mesurer(o, 'sujet'); await o.context.close(); return m; });
  casC.forEach(({ variante }, i) => {
    const m = resC[i];
    check(`plus sujet ${variante} 375 px : glyphe de chaque « ••• » d'au moins 4,5:1`, () => {
      assert.ok(m.hotes.length >= 1 && m.hotes.every(h => h.glyphe), 'glyphe absent');
      const bas = m.hotes.filter(h => h.glyphe.contraste < 4.5).map(h => h.glyphe.contraste);
      assert.deepEqual(bas, [], bas.join(' ; '));
    });
  });

  // Seuil 767 non tactile : « ••• » commun ; 768 et 769 (non tactiles) et bureau 1280 des 3 pages : aucun « ••• », empreinte du contenu égale
  // au bundle de base.
  {
    const mesures = await mapLimit(NOMS, async nom => { const o = await ouvrir({ cle: CLE[nom], width: 767, variante: VARIANTES[0], tactile: false }); const m = await mesurer(o, nom); await o.context.close(); return m; });
    NOMS.forEach((nom, i) => {
      const m = mesures[i];
      check(`plus seuil ${nom} 767 px (non tactile) : « ••• » commun (glyphe texte, .${P.plus})`, () => {
        assert.ok(m.mobile && m.hotes.length >= 1, `mobile ${m.mobile}, boutons ${m.hotes.length}`);
        assert.equal(m.hotesCommuns, m.hotes.length, `.${P.plus}`);
        assert.ok(m.hotes.every(h => h.texte === '•••'), 'glyphe');
      });
    });
  }
  const casB = [
    ...NOMS.flatMap(nom => [768, 769].map(width => ({ nom, width, variante: VARIANTES[0], tactile: false }))),
    ...NOMS.flatMap(nom => VARIANTES.map(variante => ({ nom, width: 1280, variante })))
  ];
  const lireB = async (c, src) => {
    const o = await ouvrir({ ...c, cle: CLE[c.nom], src });
    const m = await mesurer(o, c.nom);
    const em = await o.page.evaluate(EMPREINTE_FIL);
    await o.context.close();
    return { m, em, erreurs: o.erreurs };
  };
  const resB = await mapLimit(casB, async c => ({ t: await lireB(c, userscript), b: await lireB(c, basePlus) }));
  casB.forEach(({ nom, width, variante }, i) => {
    const { t, b } = resB[i];
    check(`plus ${width === 1280 ? 'bureau' : 'seuil'} ${nom} ${variante} ${width} px${width < 1280 ? ' (non tactile)' : ''} : aucun « ••• », empreinte du contenu égale au bundle de base (${COMMIT_PLUS}), aucune exception`, () => {
      assert.ok(t.m.theme && b.m.theme, 'kr-theme-enabled absent');
      assert.deepEqual([t.m.mobile, t.m.communs], [false, 0], 'mobile, « ••• »');
      const k = t.em.findIndex((x, j) => x !== b.em[j]);
      assert.ok(k === -1 && t.em.length === b.em.length, k < 0 ? `éléments : ${t.em.length} au lieu de ${b.em.length}` : `élément ${k} : ${t.em[k]} au lieu de ${b.em[k]}`);
      assert.deepEqual(t.erreurs, []);
    });
  });

  // Bascule 768 -> 767 -> 768 -> 767 dans le même onglet (sujet) : « ••• » commun à 767, aucun à 768.
  {
    const { context, page, erreurs } = await ouvrir({ cle: 'sujet', width: 768, height: 667, tactile: false });
    const etat = () => page.evaluate(p => ({ iw: window.innerWidth, mobile: document.body.classList.contains('mobile-mode'), communs: document.querySelectorAll('.' + p.plus).length, hotes: document.querySelectorAll(p.hotes.sujet).length }), P);
    const etapes = [await etat()];
    for (const width of [767, 768, 767]) {
      await page.waitForTimeout(ECART_RECHARGEMENT_MS);
      const charge = page.waitForEvent('load', { timeout: 15000 });
      await page.setViewportSize({ width, height: 667 });
      await charge;
      await prete(page, true, `bascule plus ${width}`);
      etapes.push(await etat());
    }
    await context.close();
    check('plus bascule sujet 768 -> 767 -> 768 -> 767 : « ••• » commun à 767 (un par message), aucun à 768', () => {
      const v = etapes.map(x => [x.iw, x.mobile, x.communs > 0 && x.communs === x.hotes, x.hotes > 0]);
      assert.deepEqual(v, [[768, false, false, false], [767, true, true, true], [768, false, false, false], [767, true, true, true]], JSON.stringify(etapes));
      assert.deepEqual(erreurs, []);
    });
  }
}

// ---------- Ligne de l'index : icône du forum, dernier message à droite (épopée 6, ticket 6) ----------
// Plan story-ligne-de-forum-icone-lue-dans-la-liste-laterale-forum-sans-m. Repères (classe de l'icône, liste latérale, colonne native,
// icônes attendues par chemin) : REPERES_LIGNE_TICKET66 (lib/variantes.mjs). Pages dérivées en mémoire de l'index RP : colonne native
// composée (Taverne et Marché seulement, Monde en trop), entrée Marché désactivée par classe puis par aria, image dans la liste,
// entrée Taverne sans icône de liste, liste retirée, entrée Taverne en href absolu avec requête et fragment ; racine sans liste latérale.
// Bundle de base : celui de 7bec452 (COMMIT_LIGNE), sauf KR_SCRIPT_AVANT_LIGNE ; liste latérale, Staff, sous-forum et mobile comparés à
// cette base, sans masque.
const COMMIT_LIGNE = '7bec452';
// Mesure de la ligne de l'index : par ligne, icône (classe, contenu, place, boîte), nom, heure (texte de p.mini et texte natif lu dans le
// HTML servi), dernier message (styles, boîtes du texte), flèche, compteurs, cellule vide ; liste latérale (outerHTML). CONTRASTE évalué avant.
const LIGNE66 = ({ a, l, html }) => {
  const C = window.__krContraste;
  const r1 = v => Math.round(v * 10) / 10;
  const visible = e => { if (!e) { return false; } const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const boite = r => ({ x: r1(r.left), y: r1(r.top + window.scrollY), w: r1(r.width), h: r1(r.height), r: r1(r.right), b: r1(r.bottom + window.scrollY) });
  const lienEn = (x, y) => { window.scrollTo(0, Math.max(0, y - 200)); const el = document.elementFromPoint(x, y - window.scrollY); const k = el && el.closest('a'); return k ? k.getAttribute('href') : null; };
  const texteDe = nodes => { const rs = nodes.map(n => { const g = document.createRange(); g.selectNodeContents(n); return g.getBoundingClientRect(); }).filter(r => r.width > 0); return rs.length ? r1(Math.max(...rs.map(r => r.right))) : null; };
  const pseudo = (e, p) => getComputedStyle(e, p).content;
  const natifs = [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll(a.ligne)].map(tr => { const m = tr.cells[3] && tr.cells[3].querySelector(':scope > p.mini'); return m ? m.textContent.replace(/\s+/g, ' ').trim() : null; });
  const sonde = (prop, expr) => { const i = document.createElement('i'); i.style[prop] = expr; document.body.appendChild(i); const v = getComputedStyle(i)[prop]; i.remove(); return v; };
  // Boîtes relevées page en haut (window.scrollTo(0, 0)) avant toute cible : ordonnées absolues.
  const lignes = [...document.querySelectorAll(a.ligne)].map((tr, k) => {
    window.scrollTo(0, 0);
    const c = tr.cells;
    const lien = c[0] ? c[0].querySelector(':scope > p:not(.tagforum) > a[href]') : null;
    const icones = [...tr.querySelectorAll('.' + l.icone)];
    const ic = icones[0] || null;
    const auteur = c[3] ? c[3].querySelector(':scope > a.nomargin') : null;
    const mini = c[3] ? c[3].querySelector(':scope > p.mini') : null;
    const f = tr.querySelector(a.fleche);
    const b = tr.getBoundingClientRect();
    const bb = boite(b);
    const bordBas = parseFloat(getComputedStyle(tr).borderBottomWidth) || 0;
    const fb = f && visible(f) ? f.getBoundingClientRect() : null;
    const fbb = fb ? boite(fb) : null;
    const nb = lien && visible(lien) ? lien.getBoundingClientRect() : null;
    const ib = ic ? ic.getBoundingClientRect() : null;
    const ibb = ib ? boite(ib) : null;
    const rangee = !!nb && !!ib && ib.top + ib.height / 2 >= nb.top - 1 && ib.top + ib.height / 2 <= nb.bottom + 1;
    return {
      nom: lien ? lien.textContent.trim() : null,
      href: lien ? lien.getAttribute('href') : null,
      icones: icones.length,
      icone: ic ? {
        tag: ic.tagName, cache: ic.getAttribute(l.cache), avantNom: !!lien && ic.nextElementSibling === lien.parentElement, dansCellule: ic.parentElement === c[0],
        enfants: [...ic.childNodes].map(n => (n.nodeType === 1 ? `${n.tagName}.${n.className}${n.getAttribute('src') ? ' ' + n.getAttribute('src') : ''}` : '#' + n.nodeType)),
        couleur: getComputedStyle(ic).color, boite: ibb, rangee, em: parseFloat(getComputedStyle(ic).fontSize),
        ids: ic.querySelectorAll('[id]').length,
        glyphe: ic.firstElementChild ? { couleur: getComputedStyle(ic.firstElementChild).color, taille: getComputedStyle(ic.firstElementChild).fontSize } : null,
        tailleNom: lien ? getComputedStyle(lien).fontSize : null,
        cible: ibb.w > 0 ? lienEn(ibb.x + ibb.w / 2, ibb.y + ibb.h / 2) : null
      } : null,
      centre: lienEn(bb.x + bb.w / 2, bb.y + bb.h / 2),
      ligne: bb,
      heure: mini ? mini.textContent.replace(/\s+/g, ' ').trim() : null,
      heureNative: natifs[k] === undefined ? 'absente' : natifs[k],
      auteur: auteur ? { couleur: getComputedStyle(auteur).color, graisse: getComputedStyle(auteur).fontWeight, taille: getComputedStyle(auteur).fontSize, droite: texteDe([auteur]), contraste: Math.round(C.texte(auteur) * 100) / 100 } : null,
      heureDroite: mini ? texteDe([...mini.childNodes].filter(n => n.nodeType === 3 && n.data.trim())) : null,
      alignement: c[3] ? getComputedStyle(c[3]).textAlign : null,
      compteurs: [c[1], c[2]].filter(Boolean).map(x => getComputedStyle(x).textAlign),
      fleche: f ? { href: f.getAttribute('href'), boite: fbb, bord: fb ? r1(b.right - fb.right) : null, ecart: fb ? r1(fb.top + fb.height / 2 - (b.top + (b.height - bordBas) / 2)) : null, auCentre: fbb ? lienEn(fbb.x + fbb.w / 2, fbb.y + fbb.h / 2) : null } : null,
      vide: c[3] ? { enfants: [...c[3].children].filter(visible).length, avant: pseudo(c[3], '::before'), apres: pseudo(c[3], '::after') } : null
    };
  });
  window.scrollTo(0, 0);
  return {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    iw: window.innerWidth,
    accent: sonde('color', l.accent),
    secondaire: sonde('color', l.secondaire),
    detail: sonde('fontSize', l.detail),
    total: document.querySelectorAll('.' + l.icone).length,
    liste: [...document.querySelectorAll(l.liste)].map(e => e.outerHTML).join('\n'),
    lignes
  };
};
if (on('ligne')) {
  console.log(`\n== ligne : icône du forum lue dans la liste latérale, dernier message à droite, bouton → de 34 px (variantes ${VARIANTES.join(' et ')}) ==`);
  const baseLigne = strip(process.env.KR_SCRIPT_AVANT_LIGNE ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_LIGNE, 'utf8')
    : execFileSync('git', ['show', `${COMMIT_LIGNE}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
  const remplacer = (html, motif, par, nom) => { const h = html.replace(motif, par); if (h === html) { throw new Error('page dérivée « ' + nom + ' » : motif absent de la fixture'); } return h; };
  const LISTE = /<div class="list-group">[\s\S]*?<\/div>/;
  const TAVERNE = 'forum/rp/taverne-10101';
  const MARCHE = 'forum/rp/marche-10102';
  const IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const rp = PAGES.rp.html;
  const entree = href => `<a href="${href}" class="list-group-item">`;
  const iconeTaverne = `<span class="${L.lefticon}"><i class="${L.icones[TAVERNE]}"></i></span>Taverne`;
  // Pages : clé de PAGES (chemin servi), HTML, et icône attendue par chemin de ligne (null : aucune icône ; IMAGE : image clonée).
  const tout = href => L.icones[href] || null;
  const DERIVEES = {
    composee: { cle: 'rp', html: remplacer(rp, LISTE, fixture(L.colonneNative).match(LISTE)[0], 'composee'), attendu: href => ([TAVERNE, MARCHE].includes(href) ? tout(href) : null) },
    desactiveeClasse: { cle: 'rp', html: remplacer(rp, entree(MARCHE), `<a href="${MARCHE}" class="list-group-item disabled">`, 'desactiveeClasse'), attendu: href => (href === MARCHE ? null : tout(href)) },
    desactiveeAria: { cle: 'rp', html: remplacer(rp, entree(MARCHE), `<a href="${MARCHE}" class="list-group-item" aria-disabled="true">`, 'desactiveeAria'), attendu: href => (href === MARCHE ? null : tout(href)) },
    image: { cle: 'rp', html: remplacer(rp, iconeTaverne, `<span class="${L.lefticon}"><img src="${IMAGE}" alt=""></span>Taverne`, 'image'), attendu: href => (href === TAVERNE ? IMAGE : tout(href)) },
    sansIcone: { cle: 'rp', html: remplacer(rp, iconeTaverne, 'Taverne', 'sansIcone'), attendu: href => (href === TAVERNE ? null : tout(href)) },
    sansListe: { cle: 'rp', html: remplacer(rp, LISTE, '', 'sansListe'), attendu: () => null },
    absolu: { cle: 'rp', html: remplacer(rp, entree(TAVERNE), `<a href="${BASE}/${TAVERNE}?x#y" class="list-group-item">`, 'absolu'), attendu: tout },
    racineNue: { cle: 'racine', html: fixture(L.racineNue), attendu: () => null },
    espacesId: { cle: 'rp', html: remplacer(rp, iconeTaverne, `<span class="${L.lefticon}">\n  <i id="icone-taverne" class="${L.icones[TAVERNE]}"></i>\n</span>Taverne`, 'espacesId'), attendu: tout },
    nomLong: { cle: 'rp', html: remplacer(rp, `<a href="${TAVERNE}">Taverne</a>`, `<a href="${TAVERNE}">${'Taverne des voyageurs égarés '.repeat(6).trim()}</a>`, 'nomLong'), attendu: tout }
  };
  const SERVIES = { ...Object.fromEntries(INDEX.map(cle => [cle, { cle, html: PAGES[cle].html, attendu: tout }])), ...DERIVEES };
  const mesurer = async (o, page) => { await o.page.evaluate(CONTRASTE); const m = await o.page.evaluate(LIGNE66, { a: A, l: L, html: SERVIES[page].html }); await o.context.close(); return { m, erreurs: o.erreurs }; };
  const ouvrirLigne = (page, c) => ouvrir({ cle: SERVIES[page].cle, html: SERVIES[page].html, ...c });
  const attenduDe = (page, l) => SERVIES[page].attendu(l.href);
  const icone = (l, att, secondaire) => {
    if (att === null) { return l.icones === 0 ? null : `« ${l.nom} » ${l.icones} icône(s) au lieu d'aucune`; }
    if (l.icones !== 1) { return `« ${l.nom} » ${l.icones} icône(s) au lieu d'une`; }
    const i = l.icone;
    const enfant = att === IMAGE ? `IMG. ${IMAGE}` : `I.${att}`;
    if (i.tag !== 'SPAN' || i.cache !== 'true' || !i.avantNom || !i.dansCellule) { return `« ${l.nom} » place ${JSON.stringify(i)}`; }
    if (i.enfants.length !== 1 || i.enfants[0] !== enfant) { return `« ${l.nom} » contenu ${JSON.stringify(i.enfants)} au lieu de ${enfant}`; }
    if (!i.rangee) { return `« ${l.nom} » icône hors de la rangée du nom ${JSON.stringify(i.boite)}`; }
    if (i.ids) { return `« ${l.nom} » ${i.ids} id dans l'icône clonée`; }
    if (!i.glyphe || i.glyphe.couleur !== secondaire || i.couleur !== secondaire) { return `« ${l.nom} » couleur ${i.couleur} (glyphe ${JSON.stringify(i.glyphe)}) au lieu de ${secondaire}`; }
    if (i.glyphe.taille !== i.tailleNom) { return `« ${l.nom} » glyphe de ${i.glyphe.taille} au lieu de ${i.tailleNom} (taille du nom)`; }
    if (Math.abs(i.boite.w - 1.25 * i.em) > 0.5) { return `« ${l.nom} » icône de ${i.boite.w} px au lieu de ${1.25 * i.em} (1,25 em)`; }
    return null;
  };

  // Icône, liste intacte, heure native, forum sans message, cibles (mobile), flèche et dernier message (ordinateur), par page et largeur.
  const LARGEURS = [375, 767, 768, 1280, 1440, 1920];
  const cas = [
    ...INDEX.flatMap(page => LARGEURS.flatMap(width => VARIANTES.map(variante => ({ page, width, variante })))),
    ...Object.keys(DERIVEES).flatMap(page => [375, 1280].map(width => ({ page, width, variante: VARIANTES[1] })))
  ];
  const res = await mapLimit(cas, async ({ page, width, variante }) => ({
    teste: await mesurer(await ouvrirLigne(page, { width, variante }), page),
    base: await mesurer(await ouvrirLigne(page, { width, variante, src: baseLigne }), page)
  }));
  cas.forEach(({ page, width, variante }, n) => {
    const { teste, base } = res[n];
    const t = teste.m;
    const lab = `ligne ${page} ${variante} ${width} px`;
    check(`${lab} : une icône de la liste latérale par ligne (même contenu, avant le nom, masquée aux lecteurs d'écran, sur la rangée du nom, 1,25 em de large, glyphe en couleur secondaire à la taille du nom, sans id) ou aucune ; lignes de la base, dans l'ordre`, () => {
      assert.ok(t.theme && t.mobile === (width < 768), `kr-theme-enabled ${t.theme}, mobile ${t.mobile}`);
      assert.deepEqual(t.lignes.map(l => l.href), base.m.lignes.map(l => l.href), 'lignes');
      const ecarts = t.lignes.filter(l => l.href).map(l => icone(l, attenduDe(page, l), t.secondaire)).filter(Boolean);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      assert.ok(t.lignes.length >= (page === 'racineNue' ? 2 : 3), 'lignes : ' + t.lignes.length);
    });
    check(`${lab} : liste latérale intacte (outerHTML égal au bundle de base ${COMMIT_LIGNE}), heure native, aucune exception`, () => {
      assert.equal(t.liste, base.m.liste, 'liste latérale');
      const heures = t.lignes.filter(l => l.heure !== l.heureNative).map(l => `« ${l.nom} » « ${l.heure} » au lieu de « ${l.heureNative} »`);
      assert.deepEqual(heures, [], heures.join(' ; '));
      assert.deepEqual(teste.erreurs, []);
    });
    // Racine sans liste (structure de ligne propre à sa fixture) : icône, liste et heure seulement.
    if (page === 'racineNue') { return; }
    check(`${lab} : forum sans message : ni flèche, ni enfant visible, ni pseudo-contenu dans la cellule${width < 768 ? ', 72 px' : ''}`, () => {
      const vides = t.lignes.filter(l => l.href && !l.auteur);
      assert.ok(vides.length >= 1, 'aucun forum sans message');
      const ecarts = vides.filter(l => l.fleche || l.vide.enfants || !['none', 'normal'].includes(l.vide.avant) || !['none', 'normal'].includes(l.vide.apres) || (width < 768 && Math.abs(l.ligne.h - 72) > 0.5)).map(l => `« ${l.nom} » ${JSON.stringify([l.fleche, l.vide, l.ligne.h])}`);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    if (width < 768) {
      check(`${lab} : centre de l'icône et de la ligne -> forum ; flèche d'au moins 44 x 44 -> #msg`, () => {
        const ecarts = [];
        for (const l of t.lignes.filter(x => x.href)) {
          if (l.icone && l.icone.cible !== l.href) { ecarts.push(`« ${l.nom} » icône -> ${l.icone.cible}`); }
          if (l.centre !== l.href) { ecarts.push(`« ${l.nom} » centre -> ${l.centre}`); }
          if (l.fleche && (!l.fleche.boite || l.fleche.boite.w < 44 || l.fleche.boite.h < 44 || l.fleche.auCentre !== l.fleche.href || !/#msg\d+$/.test(l.fleche.href))) { ecarts.push(`« ${l.nom} » flèche ${JSON.stringify(l.fleche)}`); }
        }
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
    } else if (INDEX.includes(page)) {
      check(`${lab} : bouton → de 34 x 34 à 10 px (± 1) du bord droit, centré à 1 px près, -> #msg`, () => {
        const ecarts = t.lignes.filter(l => l.fleche).filter(l => !l.fleche.boite || l.fleche.boite.w !== 34 || l.fleche.boite.h !== 34 || Math.abs(l.fleche.bord - 10) > 1 || Math.abs(l.fleche.ecart) > 1 || l.fleche.auCentre !== l.fleche.href).map(l => `« ${l.nom} » ${JSON.stringify(l.fleche)}`);
        assert.ok(t.lignes.some(l => l.fleche), 'aucune flèche');
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
      check(`${lab} : dernier message à droite (texte à 8 px ± 1 de la flèche), compteurs à droite ; auteur en couleur d'accent, 700, taille de détail`, () => {
        const ecarts = [];
        for (const l of t.lignes.filter(x => x.href)) {
          if (l.compteurs.some(x => x !== 'right')) { ecarts.push(`« ${l.nom} » compteurs ${l.compteurs}`); }
          if (!l.auteur) { continue; }
          if (l.alignement !== 'right') { ecarts.push(`« ${l.nom} » dernier message ${l.alignement}`); }
          const gauche = l.fleche.boite.x;
          for (const [quoi, droite] of [['auteur', l.auteur.droite], ['heure', l.heureDroite]]) {
            if (droite === null || Math.abs(gauche - droite - 8) > 1) { ecarts.push(`« ${l.nom} » ${quoi} à ${droite === null ? '?' : Math.round((gauche - droite) * 10) / 10} px de la flèche`); }
          }
          if (l.auteur.couleur !== t.accent || Number(l.auteur.graisse) < 700 || l.auteur.taille !== t.detail) { ecarts.push(`« ${l.nom} » auteur ${JSON.stringify(l.auteur)} (accent ${t.accent}, détail ${t.detail})`); }
        }
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
    }
  });

  // Contraste de l'auteur sur le fond effectif de la ligne, 1280 px, 16 variantes (Ask First 13 : arrêt sous 4,5:1).
  const resC = await mapLimit(TOUTES_VARIANTES, async variante => mesurer(await ouvrirLigne('rp', { width: 1280, variante }), 'rp'));
  TOUTES_VARIANTES.forEach((variante, n) => {
    check(`ligne contraste rp ${variante} 1280 px : auteur du dernier message en couleur d'accent, au moins 4,5:1 sur le fond de la ligne`, () => {
      const auteurs = resC[n].m.lignes.filter(l => l.auteur);
      assert.ok(auteurs.length >= 3, 'auteurs : ' + auteurs.length);
      const ecarts = auteurs.filter(l => l.auteur.couleur !== resC[n].m.accent || l.auteur.contraste < 4.5).map(l => `« ${l.nom} » ${l.auteur.couleur} ${l.auteur.contraste}:1`);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
  });

  // Mobile hors icône : lignes (boîtes, cibles, flèches) et auteur égaux à la base.
  const casM = ['rp', 'communaute', 'racine'].flatMap(cle => [375, 767].flatMap(width => VARIANTES.map(variante => ({ cle, width, variante }))));
  const resM = await mapLimit(casM, async c => {
    const out = {};
    for (const [k, src] of [['teste', userscript], ['base', baseLigne]]) {
      const { context, page } = await ouvrir({ ...c, src });
      out[k] = { l: await page.evaluate(LIGNES, A), a: await page.evaluate(sel => [...document.querySelectorAll(sel)].map(e => [getComputedStyle(e).color, getComputedStyle(e).fontWeight]), A.ligne + ' > td:nth-child(4) > a.nomargin') };
      await context.close();
    }
    return out;
  });
  casM.forEach(({ cle, width, variante }, n) => {
    check(`ligne mobile ${PAGES[cle].url} ${variante} ${width} px : lignes, flèches, cibles et auteur égaux à la base (${COMMIT_LIGNE})`, () => {
      assert.ok(resM[n].teste.l.mobile, 'mode mobile');
      assert.deepEqual(resM[n].teste.l, resM[n].base.l);
      assert.deepEqual(resM[n].teste.a, resM[n].base.a);
    });
  });

  // Peau coupée : aucune icône, #col-right égal à celui de la base peau coupée. À 375 px, le script de la base pose sans la peau un style
  // en ligne sur #col-right et ses colonnes (applyMobileCriticalStyles, retiré par l'épopée 9, entrée 1) : ce seul style est ôté du relevé
  // de la base (STYLE_EN_LIGNE_AVANT_91). Staff et sous-forum : égaux à la base, aucune icône.
  // Injection « début » (comme `@run-at document-start`) : injecté à l'apparition de <body>, le script, peau coupée, observe <body> pour
  // retirer les infobulles en mobile ; or `mobile-mode` n'est posé qu'au DOMContentLoaded. Les attributs data-toggle/title du bouton
  // « Tous les forums » et des flèches restent ou partent selon que la dernière insertion du parseur est livrée avant ou après ce
  // DOMContentLoaded : sous charge, l'un des deux bundles perd la course (écart au caractère 430). Au début du document, <body> n'existe pas,
  // l'observateur n'est pas posé : infobulles natives gardées des deux côtés, comme sur le site.
  const STYLE_EN_LIGNE_AVANT_91 = / style="(?:padding-left: 0px !important; padding-right: 0px !important;|margin-left: 0px !important; margin-right: 0px !important;)"/g;
  const colonne = page => page.evaluate(sel => ({ total: document.querySelectorAll(sel).length, col: document.getElementById('col-right').outerHTML }), '.' + L.icone);
  const casP = [375, 1280].map(width => ({ width }));
  const resP = await mapLimit(casP, async ({ width }) => {
    const out = {};
    for (const [k, src] of [['teste', userscript], ['base', baseLigne]]) {
      const { context, page, erreurs } = await ouvrir({ cle: 'rp', width, src, theme: false, debut: true });
      const c = await colonne(page);
      out[k] = { ...c, col: k === 'base' ? c.col.replace(STYLE_EN_LIGNE_AVANT_91, '') : c.col, erreurs };
      await context.close();
    }
    return out;
  });
  casP.forEach(({ width }, n) => {
    check(`ligne peau coupée /forum/rp ${width} px : aucune icône, #col-right égal au bundle de base peau coupée (${COMMIT_LIGNE})`, () => {
      const { teste, base } = resP[n];
      assert.equal(teste.total, 0, 'icônes');
      const k = [...teste.col].findIndex((x, j) => x !== base.col[j]);
      assert.ok(teste.col === base.col, `#col-right : écart au caractère ${k} : ${JSON.stringify(teste.col.slice(Math.max(0, k - 60), k + 80))} au lieu de ${JSON.stringify(base.col.slice(Math.max(0, k - 60), k + 80))}`);
      assert.deepEqual(teste.erreurs, []);
    });
  });
  const casH = [...[375, 1280].map(width => ({ cle: 'staff', width, variante: VARIANTES[1] })), ...VARIANTES.map(variante => ({ cle: 'debuter', width: 1280, variante }))];
  const resH = await mapLimit(casH, async c => {
    const out = {};
    for (const [k, src] of [['teste', userscript], ['base', baseLigne]]) {
      const { context, page, erreurs } = await ouvrir({ ...c, src });
      out[k] = { e: await page.evaluate(EMPREINTE_FIL), total: (await colonne(page)).total, fleche: await page.evaluate(() => [...document.querySelectorAll('#topics tbody tr .btn-group > a.btn')].map(e => [Math.round(e.getBoundingClientRect().width), Math.round(e.getBoundingClientRect().height)])), erreurs };
      await context.close();
    }
    return out;
  });
  casH.forEach(({ cle, width, variante }, n) => {
    const { teste, base } = resH[n];
    check(`ligne ${PAGES[cle].url} ${variante} ${width} px : aucune icône${cle === 'debuter' ? ', bouton → de 32 px' : ''}, empreinte du contenu égale au bundle de base (${COMMIT_LIGNE})`, () => {
      assert.equal(teste.total, 0, 'icônes');
      if (cle === 'debuter') { assert.ok(teste.fleche.length >= 1 && teste.fleche.every(([w, h]) => w === 32 && h === 32), JSON.stringify(teste.fleche)); }
      const k = teste.e.findIndex((x, j) => x !== base.e[j]);
      assert.ok(k === -1 && teste.e.length === base.e.length, k < 0 ? `éléments : ${teste.e.length} au lieu de ${base.e.length}` : `élément ${k} : ${teste.e[k]} au lieu de ${base.e[k]}`);
      assert.deepEqual(teste.erreurs, []);
    });
  });

  // Seuils 767, 768, 769 (non tactile) et bascule 768 -> 767 -> 768 -> 767 dans le même onglet : une icône par ligne à chaque étape ;
  // ordinateur : bouton → de 34 px et auteur en couleur d'accent.
  const etat = (m, width) => {
    const ecarts = m.lignes.filter(l => l.href).map(l => icone(l, tout(l.href), m.secondaire)).filter(Boolean);
    if (m.mobile !== (width < 768)) { ecarts.push(`mobile ${m.mobile}`); }
    if (width >= 768) {
      m.lignes.filter(l => l.fleche).forEach(l => { if (!l.fleche.boite || l.fleche.boite.w !== 34 || l.fleche.boite.h !== 34) { ecarts.push(`« ${l.nom} » flèche ${JSON.stringify(l.fleche.boite)}`); } });
      m.lignes.filter(l => l.auteur).forEach(l => { if (l.auteur.couleur !== m.accent) { ecarts.push(`« ${l.nom} » auteur ${l.auteur.couleur}`); } });
    }
    return ecarts;
  };
  const casS = VARIANTES.flatMap(variante => [767, 768, 769].map(width => ({ variante, width })));
  const resS = await mapLimit(casS, async c => mesurer(await ouvrirLigne('rp', { ...c, tactile: false }), 'rp'));
  casS.forEach(({ variante, width }, n) => {
    check(`ligne seuil /forum/rp ${variante} ${width} px (non tactile) : ${width < 768 ? 'mobile' : 'ordinateur, bouton → de 34 px, auteur en couleur d\'accent'}, une icône par ligne`, () => {
      const ecarts = etat(resS[n].m, width);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      assert.deepEqual(resS[n].erreurs, []);
    });
  });
  const o = await ouvrirLigne('rp', { width: 768, height: 667, tactile: false });
  const etapes = [];
  const relever = async () => { await o.page.evaluate(CONTRASTE); etapes.push(await o.page.evaluate(LIGNE66, { a: A, l: L, html: SERVIES.rp.html })); };
  await relever();
  for (const width of [767, 768, 767]) {
    await o.page.waitForTimeout(ECART_RECHARGEMENT_MS);
    const charge = o.page.waitForEvent('load', { timeout: 15000 });
    await o.page.setViewportSize({ width, height: 667 });
    await charge;
    await prete(o.page, true, `bascule ligne ${width}`);
    await relever();
  }
  await o.context.close();
  check('ligne bascule 768 -> 767 -> 768 -> 767, /forum/rp : un rechargement par franchissement, une icône par ligne à chaque étape', () => {
    assert.deepEqual(etapes.map(e => e.iw), [768, 767, 768, 767]);
    const ecarts = etapes.flatMap((e, k) => etat(e, e.iw).map(x => `étape ${k} (${e.iw}) : ${x}`));
    assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    assert.equal(o.etat.chargements, 4, 'documents chargés');
    assert.deepEqual(o.erreurs, []);
  });
}

// Pages dérivées des fragments envoyer et panneaux : fil de sujet, avec un contenu ajouté en mémoire après la liste des messages.
const COMMIT_PANNEAUX = '7bec452';
const deriver = (html, ajout, nom) => {
  const h = html.replace('</ul></div></div></div><footer', '</ul>' + ajout + '</div></div></div><footer');
  if (h === html) { throw new Error('page dérivée « ' + nom + ' » : motif absent de la fixture'); }
  return h;
};

// Formulaire de réponse de la fixture de rédaction : avec sa barre d'outils (kr-editor) ou sans ; « Envoyer » dans le flux dans les deux
// cas (épopée 7, entrée 7 : plus de barre fixe).
const ENVOYER = ({ p }) => {
  const env = document.querySelector('form[name="post_msg"] button.btn-primary.pull-right');
  const plus = document.querySelector(p.hotes.sujet);
  const message = plus.closest(p.message);
  plus.click();
  const e0 = env.getBoundingClientRect();
  window.scrollTo(0, Math.max(0, e0.top + window.scrollY - 200));
  const e = env.getBoundingClientRect();
  const x = e.left + e.width / 2; const y = e.top + e.height / 2;
  const hit = document.elementFromPoint(x, y);
  const point = { dedans: !!hit && env.contains(hit), touche: hit ? hit.tagName + '.' + hit.className : null };
  window.scrollTo(0, 0);
  return {
    mobile: document.body.classList.contains('mobile-mode'),
    editeur: env.closest('form').classList.contains('kr-editor'),
    position: getComputedStyle(env).position,
    fixes: [...env.closest('form').querySelectorAll('*')].filter(n => ['fixed', 'sticky'].includes(getComputedStyle(n).position)).map(n => n.tagName + '.' + n.className),
    hauteur: Math.round(e.height),
    ouvert: message.classList.contains(p.ouvert),
    point,
    forme: (() => {
      const ta = env.closest('form').querySelector('textarea[name="message"]').getBoundingClientRect();
      const sonde = expr => { const i = document.createElement('i'); i.style.color = expr; document.body.appendChild(i); const c = getComputedStyle(i).color; i.remove(); return c; };
      const cs = getComputedStyle(env);
      return { sous: Math.round(e0.top) >= Math.round(ta.bottom), droite: e0.left > ta.left + ta.width / 2,
        fond: cs.backgroundColor === sonde('var(--kr-arm-bg, var(--kr-primary))'), encre: cs.color === sonde('var(--kr-arm-ink, var(--kr-white))'),
        rayon: cs.borderTopLeftRadius, police: cs.fontSize === getComputedStyle(document.documentElement).getPropertyValue('--kr-font-button').trim() };
    })()
  };
};
// Voile posé : « Envoyer » n'est plus touché à son centre (le tap ferme le menu ; le voile couvre « Envoyer » quelle que soit la peau) ;
// le centre du « ••• » du message ouvert, défilé à 200 px du haut, touche la barre du message (991 au-dessus du voile 990, seule la peau
// en décide).
const SOUS_VOILE = ({ p }) => {
  const env = document.querySelector('form[name="post_msg"] button.btn-primary.pull-right');
  const e = env.getBoundingClientRect();
  const hitEnv = document.elementFromPoint(e.left + e.width / 2, e.top + e.height / 2);
  const plus = document.querySelector(p.hotes.sujet);
  const barre = plus.closest(p.barre);
  const b0 = plus.getBoundingClientRect();
  window.scrollTo(0, Math.max(0, b0.top + window.scrollY - 200));
  const b = plus.getBoundingClientRect();
  const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
  window.scrollTo(0, 0);
  return { envoyer: !!hitEnv && env.contains(hitEnv), barre: !!hit && barre.contains(hit), touche: hit ? hit.tagName + '.' + hit.className : null, voiles: document.querySelectorAll('.' + p.voile).length };
};
if (on('envoyer')) {
  console.log(`\n== envoyer : « Envoyer » dans le flux et atteignable sous un message ouvert (avec et sans barre d'outils), actions au-dessus du voile, 375 et 767 px (variantes ${VARIANTES.join(' et ')}) ==`);
  const formulaire = fixture(R.reponse.fixture).match(/<form name="post_msg"[\s\S]*?<\/form>/)[0];
  const sansBarre = formulaire.replace(/<div class="btn-toolbar"[\s\S]*?<\/div><\/div>/, '');
  if (sansBarre === formulaire) { throw new Error('formulaire sans barre d\'outils : motif absent de la fixture'); }
  const HTML = { sans: deriver(SUJET, sansBarre, 'sans'), flux: deriver(SUJET, formulaire, 'flux') };
  const cas = ['sans', 'flux'].flatMap(forme => [375, 767].flatMap(width => VARIANTES.map(variante => ({ forme, width, variante }))));
  const res = await mapLimit(cas, async ({ forme, width, variante }) => {
    const o = await ouvrir({ cle: 'sujet', html: HTML[forme], width, variante });
    const m = await o.page.evaluate(ENVOYER, { p: P });
    await o.page.evaluate(VOILE, { p: P, cle: 'sujet', poser: true });
    const voile = await o.page.evaluate(OUVERT, { p: P, cle: 'sujet' });
    const sous = await o.page.evaluate(SOUS_VOILE, { p: P });
    await o.page.evaluate(VOILE, { p: P, cle: 'sujet', poser: false });
    await o.context.close();
    return { m, voile, sous, erreurs: o.erreurs };
  });
  cas.forEach(({ forme, width, variante }, n) => {
    const { m, voile, sous, erreurs } = res[n];
    const lab = `envoyer ${forme} ${variante} ${width} px`;
    check(`${lab} : « Envoyer » dans le flux (${forme === 'sans' ? 'sans barre d\'outils' : 'kr-editor'}), rien de fixe dans le formulaire, touché en son centre, 48 px`, () => {
      assert.ok(m.mobile && m.ouvert, `mobile ${m.mobile}, message ouvert ${m.ouvert}`);
      assert.equal(m.editeur, forme === 'flux', 'kr-editor');
      assert.equal(m.position, 'static', 'position');
      assert.deepEqual(m.fixes, [], 'fixed/sticky dans le formulaire');
      assert.ok(m.point.dedans, 'centre d\'« Envoyer » -> ' + m.point.touche);
      assert.equal(m.hauteur, 48, 'hauteur');
      assert.deepEqual(erreurs, []);
    });
    check(`${lab} : « Envoyer » sous la zone de texte, à droite, fond et encre d'action, rayon 4 px, {typography.button}`, () => {
      assert.deepEqual(m.forme, { sous: true, droite: true, fond: true, encre: true, rayon: '4px', police: true });
    });
    check(`${lab} : voile 990 posé, centre du « ••• » et première action du message ouvert au-dessus du voile ; « Envoyer » sous le voile`, () => {
      assert.equal(sous.voiles, 1, 'voile simulé');
      assert.ok(sous.barre, 'centre du « ••• » du message ouvert -> ' + sous.touche);
      assert.ok(voile.ouvert && voile.items >= 1 && voile.point && voile.point.dedans, JSON.stringify(voile));
      assert.equal(sous.envoyer, false, '« Envoyer » touché sous le voile');
    });
  });
}

// Accordéon et modale (PN.html) ajoutés au fil de sujet : mêmes styles calculés sur une page du forum et hors forum (même page, autre chemin).
const PANNEAUX = sel => {
  const s = e => (e ? getComputedStyle(e) : null);
  const bord = c => `${c.borderTopWidth} ${c.borderTopStyle} ${c.borderTopColor} / ${c.borderBottomWidth} ${c.borderBottomStyle} / ${c.borderLeftWidth} ${c.borderRightWidth}`;
  return {
    mobile: document.body.classList.contains('mobile-mode'),
    classes: [...document.body.classList],
    panneaux: [...document.querySelectorAll(sel)].map(p => {
      const c = s(p); const h = s(p.querySelector(':scope > .panel-heading')); const t = s(p.querySelector(':scope > .panel-heading h3'));
      const corps = s(p.querySelector(':scope > .panel-body, :scope > .panel-collapse > .panel-body'));
      return {
        panneau: { fond: c.backgroundColor, rayon: c.borderRadius, bord: bord(c), ombre: c.boxShadow, marges: `${c.marginLeft} ${c.marginRight} ${c.marginBottom}` },
        entete: h && { fond: h.backgroundColor, rayon: h.borderRadius, bord: bord(h), marge: h.marginBottom, retrait: h.padding, min: h.minHeight },
        titre: t && { taille: t.fontSize, graisse: t.fontWeight, marge: t.margin },
        corps: corps && { retrait: corps.padding, fond: corps.backgroundColor }
      };
    })
  };
};
if (on('panneaux')) {
  console.log(`\n== panneaux : accordéon et modale sur /forum/sujet/… égaux à la même page hors forum, 375, 767, 768 et 1280 px ; carte du forum égale à ${COMMIT_PANNEAUX} ==`);
  const basePanneaux = strip(process.env.KR_SCRIPT_AVANT_PANNEAUX ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_PANNEAUX, 'utf8')
    : execFileSync('git', ['show', `${COMMIT_PANNEAUX}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
  const html = deriver(SUJET, PN.html, 'panneaux');
  // Hors forum : chemin sans classe page-* (addPageTypeClass).
  PAGES.hors = { url: '/fixture/hors-forum', html };
  const cas = [375, 767, 768, 1280].flatMap(width => VARIANTES.map(variante => ({ width, variante })));
  const mesurer = async (c, sel) => { const o = await ouvrir(c); const m = await o.page.evaluate(PANNEAUX, sel); await o.context.close(); return { m, erreurs: o.erreurs }; };
  const res = await mapLimit(cas, async c => ({ forum: await mesurer({ ...c, cle: 'sujet', html }, PN.sel), hors: await mesurer({ ...c, cle: 'hors' }, PN.sel), horsBase: await mesurer({ ...c, cle: 'hors', src: basePanneaux }, PN.sel) }));
  cas.forEach(({ width, variante }, n) => {
    const { forum, hors, horsBase } = res[n];
    // Référence : la page hors forum, égale au bundle de base (les règles communes de l'accordéon et de la modale ne changent pas).
    check(`panneaux ${variante} ${width} px : accordéon et modale hors forum égaux au bundle de base (${COMMIT_PANNEAUX})`, () => {
      assert.equal(hors.m.panneaux.length, 3, 'panneaux');
      assert.deepEqual(hors.m.panneaux, horsBase.m.panneaux);
    });
    check(`panneaux ${variante} ${width} px : accordéon (2 panneaux) et modale de /forum/sujet/… égaux à la même page hors forum (fond, rayon, bordure, en-tête, titre, corps)`, () => {
      assert.equal(forum.m.mobile, width < 768, 'mode mobile');
      const enPlus = forum.m.classes.filter(k => !hors.m.classes.includes(k) && !/^(page-forum|kr-forum-)/.test(k));
      const enMoins = hors.m.classes.filter(k => !forum.m.classes.includes(k));
      assert.deepEqual([enPlus, enMoins], [[], []], 'classes de <body> hors page-forum ' + JSON.stringify([enPlus, enMoins]));
      assert.equal(forum.m.panneaux.length, 3, 'panneaux');
      const ecarts = forum.m.panneaux.flatMap((x, k) => Object.keys(x).flatMap(part => Object.keys(x[part] || {}).filter(q => x[part][q] !== hors.m.panneaux[k][part][q]).map(q => `panneau ${k} ${part}.${q} ${x[part][q]} au lieu de ${hors.m.panneaux[k][part][q]}`)));
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      assert.deepEqual(forum.m.panneaux, hors.m.panneaux);
      assert.deepEqual([forum.erreurs, hors.erreurs], [[], []]);
    });
  });
  // Carte du forum (panneaux natifs de l'index RP et du sous-forum, hors accordéon et modale) égale au bundle de base.
  const casC = ['rp', 'debuter'].flatMap(cle => [375, 767].flatMap(width => VARIANTES.map(variante => ({ cle, width, variante }))));
  const resC = await mapLimit(casC, async c => ({ t: await mesurer(c, A.panneau), b: await mesurer({ ...c, src: basePanneaux }, A.panneau) }));
  casC.forEach(({ cle, width, variante }, n) => {
    check(`panneaux carte ${PAGES[cle].url} ${variante} ${width} px : carte de section du forum égale au bundle de base (${COMMIT_PANNEAUX})`, () => {
      assert.ok(resC[n].t.m.panneaux.length >= 1, 'aucun panneau');
      assert.deepEqual(resC[n].t.m.panneaux, resC[n].b.m.panneaux);
    });
  });
}

// ---------- Confort mobile (épopée 9, entrée 8) ----------
const COMMIT_CONFORT = '7bec452';
// Fixtures synthétiques de l'entrée 8 : racine sans groupes, nouveau sujet (champ Tags supposé), réponse refusée « Sujet Bloqué ! » (relevé 9.3).
const CF = {
  racine: 'forum-racine.html',
  nouveau: 'forum-nouveau-sujet.html', nouveauChemin: '/forum/post/nouveau-sujet-1-10101',
  bloque: 'forum-reponse-bloquee.html', bloqueChemin: '/forum/post/repondre-2-330510'
};
// Cibles hors bouton de #col-right et du pied, plus petites que 44 x 44 : acceptées si elementFromPoint au centre tombe sur une ligne
// touchable (ancêtre ou recouvrant a, button, label, [onclick] d'au moins 44 x 44 qui contient ce centre). Exclus : .btn (épopée 4), liens au
// fil du texte (parent porteur de texte propre, exception H9.1), modales, menus Bootstrap fermés. Case à cocher ou radio : son libellé compte.
const CIBLES_CONFORT = ({ cibles, exclus }) => {
  const out = [];
  const grand = b => b.width >= 43.5 && b.height >= 43.5;
  const chemin = e => { const p = []; for (let x = e; x && x !== document.body && p.length < 3; x = x.parentElement) { p.unshift(x.tagName.toLowerCase() + [...x.classList].slice(0, 2).map(c => '.' + c).join('')); } return p.join(' > '); };
  const auFil = e => e.tagName === 'A' && [...e.parentElement.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  for (const e of document.querySelectorAll(cibles)) {
    if (e.closest(exclus) || auFil(e) || !e.getClientRects().length || getComputedStyle(e).visibility === 'hidden') { continue; }
    let b = e.getBoundingClientRect();
    if (b.width === 0 || b.height === 0 || grand(b)) { continue; }
    const lab = /^(checkbox|radio)$/.test(e.type) ? (e.closest('label') || (e.id && document.querySelector(`label[for="${e.id}"]`))) : null;
    if (lab && grand(lab.getBoundingClientRect())) { continue; }
    window.scrollTo(0, Math.max(0, window.scrollY + b.top - window.innerHeight / 2));
    b = e.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    const t = document.elementFromPoint(cx, cy);
    const ligne = t && t.closest('a, button, label, [onclick]');
    const lb = ligne && ligne.getBoundingClientRect();
    if (ligne && !e.contains(ligne) && grand(lb) && lb.left <= cx && cx <= lb.right && lb.top <= cy && cy <= lb.bottom) { continue; }
    // Lien étiré (::after absolu de la ligne d'index) : la cible ou le lien qui la recouvre prend toute la rangée, de 44 px de haut au moins.
    const rangee = e.closest('tr, li');
    const rb = rangee && rangee.getBoundingClientRect();
    const dans = (x, y) => { const k = document.elementFromPoint(x, y); return !!k && !!ligne && (k === ligne || ligne.contains(k)); };
    if (ligne && rb && rb.height >= 43.5 && dans(rb.left + 20, rb.top + rb.height / 2) && dans(cx, rb.top + 4) && dans(cx, rb.bottom - 4)) { continue; }
    out.push(`${Math.round(b.width)} x ${Math.round(b.height)} « ${(e.textContent || '').trim().slice(0, 20)} » ${chemin(e)}`);
  }
  window.scrollTo(0, 0);
  return out;
};
// Cartes (CF8.cartes) : panneaux de section et messages du forum, à 8 px des bords.
const CARTES_CONFORT = ({ cartes, horsCartes, imbrique, titreCarte }) => {
  const vw = document.documentElement.clientWidth;
  return [...document.querySelectorAll(cartes)]
    .filter(p => p.getClientRects().length && !p.closest(horsCartes) && !p.parentElement.closest(imbrique))
    .map(p => { const b = p.getBoundingClientRect(); return { carte: (p.querySelector(titreCarte) || p).textContent.trim().slice(0, 20), gauche: Math.round(b.left), droite: Math.round(vw - b.right) }; });
};
const ETAT_CONFORT = () => ({
  html: [...document.documentElement.classList], mobile: document.body.classList.contains('mobile-mode'),
  sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth
});
// Empreinte des textes en ordinateur : chaque nœud texte visible de body, boîte arrondie (comparée au bundle de base ; numéro de version du
// pied neutralisé, sa largeur gardée).
const TEXTES_BUREAU = () => {
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (!n.textContent.trim() || !n.parentElement || n.parentElement.closest('script, style')) { continue; }
    const rg = document.createRange();
    rg.selectNodeContents(n);
    const r = [...rg.getClientRects()].find(x => x.width > 0 && x.height > 0);
    if (r) { out.push(`${n.textContent.trim().replace(/1\.0\.\d+/, '1.0.N').slice(0, 30)} ${Math.round(r.left)},${Math.round(r.top + window.scrollY)},${Math.round(r.width)}`); }
  }
  return out;
};
if (on('confort')) {
  console.log(`\n== confort : marge de 16 px et cibles de 44 px sur les pages du forum, 320, 375 x 667 et 767 px ; 768 et 1280 px égaux à ${COMMIT_CONFORT} ==`);
  const baseConfort = strip(process.env.KR_SCRIPT_AVANT_CONFORT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_CONFORT, 'utf8')
    : execFileSync('git', ['show', `${COMMIT_CONFORT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
  Object.assign(PAGES, {
    racineSimple: { url: '/forum', html: fixture(CF.racine) },
    sCommunaute: { url: E.chemins.communaute, html: fixture(E.fixtures.communaute) },
    sDebats: { url: E.chemins.debats, html: fixture(E.fixtures.debats) },
    sFerme: { url: E.chemins.ferme, html: fixture(E.fixtures.ferme) },
    // Variante en mémoire de l'index RP : un bloc avant l'alerte, qui n'est plus le premier enfant de #col-right (positionné). La croix ne
    // reste dans le coin de l'alerte que si l'alerte la positionne elle-même (contre-épreuve du contrôle du coin).
    rpDecale: { url: '/forum/rp', html: fixture(A.indexRp).replace('<div id="col-right" class="col-md-9">', '<div id="col-right" class="col-md-9"><div style="height: 40px"></div>') },
    reponse: { url: R.reponse.chemin, html: fixture(R.reponse.fixture) },
    nouveau: { url: CF.nouveauChemin, html: fixture(CF.nouveau) },
    bloque: { url: CF.bloqueChemin, html: fixture(CF.bloque) }
  });
  const CLES = ['rp', 'hrp', 'communaute', 'debats', 'racine', 'racineSimple', 'debuter', 'sujet', 'sCommunaute', 'sDebats', 'sFerme', 'reponse', 'nouveau', 'bloque', 'rpDecale'];
  const casM = CLES.flatMap(cle => [[320, 667], [375, 667], [767, 900]].flatMap(([width, height]) => VARIANTES.map(variante => ({ cle, width, height, variante }))));
  const resM = await mapLimit(casM, async c => {
    const o = await ouvrir(c);
    const m = {
      etat: await o.page.evaluate(ETAT_CONFORT),
      textes: await o.page.evaluate(TEXTES_HORS_MARGE_PAGE, { marge: 16, rogne: true }),
      cartes: await o.page.evaluate(CARTES_CONFORT, CF8),
      cibles: await o.page.evaluate(CIBLES_CONFORT, CF8),
      croix: await o.page.$(CF8.croix) ? await cibleTactile(o.page, CF8.croix) : null,
      coin: await o.page.evaluate(([croix, alerte]) => {
        const x = document.querySelector(croix);
        if (!x) { return null; }
        const r = x.getBoundingClientRect(); const a = document.querySelector(alerte).getBoundingClientRect();
        const n = v => Math.round(v * 10) / 10;
        return { croix: [r.left, r.top, r.right, r.bottom].map(n), alerte: [a.left, a.top, a.right, a.bottom].map(n) };
      }, [CF8.croix, CF8.alerte]),
      erreurs: o.erreurs
    };
    await o.context.close();
    return m;
  });
  casM.forEach(({ cle, width, variante }, n) => {
    const m = resM[n];
    const lab = `confort ${PAGES[cle].url}${cle === 'rpDecale' ? ' (bloc avant l\'alerte)' : ''} ${variante} ${width} px`;
    check(`${lab} : classe kr-page-forum sans kr-marge-mobile, mode mobile, aucun débordement, aucune exception`, () => {
      assert.ok(m.etat.mobile, 'mode mobile');
      assert.ok(m.etat.html.includes('kr-page-forum') && !m.etat.html.includes('kr-marge-mobile'), 'classes de <html> : ' + m.etat.html.join(' '));
      assert.ok(m.etat.sw <= m.etat.vw, `débordement : scrollWidth ${m.etat.sw} > ${m.etat.vw}`);
      assert.deepEqual(m.erreurs, []);
    });
    check(`${lab} : texte à 16 px au moins des bords (texte coupé : partie visible)`, () => {
      const t = m.textes.map(x => `${x.gauche}/${x.droite} « ${x.texte} » ${x.chemin}`);
      assert.deepEqual(t, [], t.join(' ; '));
    });
    check(`${lab} : cartes (panneaux, messages) à 8 px des bords`, () => {
      // Réponse et nouveau sujet : formulaire seul, sans panneau ni message.
      assert.equal(m.cartes.length >= 1, !['reponse', 'nouveau'].includes(cle), 'cartes : ' + m.cartes.length);
      const c = m.cartes.filter(x => x.gauche !== 8 || x.droite !== 8).map(x => `${x.gauche}/${x.droite} « ${x.carte} »`);
      assert.deepEqual(c, [], c.join(' ; '));
    });
    check(`${lab} : cibles hors bouton ≥ 44 x 44 ou ligne touchable`, () => {
      assert.deepEqual(m.cibles, [], m.cibles.join(' ; '));
    });
    // Croix contrôlée sur toute page qui en porte une ; présence exigée là où la fixture a une alerte.
    if (m.croix || ['rp', 'hrp', 'debats', 'racine', 'bloque', 'rpDecale'].includes(cle)) {
      check(`${lab} : croix de l'alerte ≥ 44 x 44, touchée aux cinq points, dans le coin haut droit de l'alerte (1 px près)`, () => {
        assert.ok(m.croix && m.coin, 'croix absente');
        const e = ecartsCible(m.croix);
        assert.deepEqual(e, [], e.join(' ; '));
        const [cg, ch, cd, cb] = m.coin.croix; const [ag, ah, ad, ab] = m.coin.alerte;
        assert.ok(cg >= ag - 1 && cb <= ab + 1 && Math.abs(ch - ah) <= 1 && Math.abs(cd - ad) <= 1,
          `croix ${m.coin.croix.join(',')} hors du coin haut droit de l'alerte ${m.coin.alerte.join(',')}`);
      });
    }
  });
  const casB = CLES.flatMap(cle => [768, 1280].flatMap(width => VARIANTES.map(variante => ({ cle, width, variante }))));
  const textesDe = async c => { const o = await ouvrir(c); const t = await o.page.evaluate(TEXTES_BUREAU); await o.context.close(); return { t, erreurs: o.erreurs }; };
  const resB = await mapLimit(casB, async c => ({ t: await textesDe(c), b: await textesDe({ ...c, src: baseConfort }) }));
  casB.forEach(({ cle, width, variante }, n) => {
    check(`confort bureau ${PAGES[cle].url} ${variante} ${width} px : textes (boîtes) égaux au bundle de base (${COMMIT_CONFORT})`, () => {
      const { t, b } = resB[n];
      assert.ok(t.t.length > 10, 'textes');
      const enPlus = t.t.filter(x => !b.t.includes(x));
      const enMoins = b.t.filter(x => !t.t.includes(x));
      assert.deepEqual([enPlus, enMoins], [[], []], `en plus : ${enPlus.slice(0, 4).join(' | ')} ; en moins : ${enMoins.slice(0, 4).join(' | ')}`);
      assert.deepEqual(t.t, b.t);
      assert.deepEqual(t.erreurs, []);
    });
  });
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
