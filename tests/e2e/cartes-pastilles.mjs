// Cartes et pastilles (épopée 5, entrée 1) : carte de section mobile des pages de jeu, du kramail et des règles (H4.1, DESIGN.md › Carte
// de section ; plan story-carte-de-section-mobile-des-pages-de-jeu-kramail-par-les-reg). Une vérification par ligne de la matrice du plan :
//   carte       Matériel, Personnage, Bâtiments, Employés, plateau (objets), règles, Cybermonde (ville) à 375 et 767 px, Kraland clair et
//               Empire Brun sombre : chaque panneau à 8 px de chaque bord (largeur vw − 16), fond surface, 4 rayons de 8 px ; en-tête collé
//               en haut du panneau, de 48 px (plus haut seulement si son contenu l'exige), retrait 0 16 px ; contenu sans écart sous
//               l'en-tête, corps en retrait de 16 px, dernier corps aux coins bas de 8 px ; titre 17 px 700 en couleur du texte ; chevrons
//               (natif ou du module, enfants directs de l'en-tête) dans l'en-tête, à 16 px du bord droit (chevron natif depuis la revue S21,
//               n° 9 : cible de 44 x 44 au bord droit, glyphe centré) ; aucun débordement horizontal. Matériel et Personnage (densité du
//               1er novembre 2026, lib/densite-jeu.mjs) : en-tête de 44 px, corps à 8 px de retrait (16 px de côté pour un corps de texte) ;
//   module      Bâtiments (Bâtiments Privés), plateau (Commerce, Matériel), Cybermonde (Bâtiments) à 375 et 767 px : chevron du module à
//               16 px du bord droit, centré, chevron natif masqué ; un tap sur l'en-tête (elementFromPoint vérifié avant) replie : carte de
//               48 px, corps de 0 px ; un 2e tap déplie : hauteur d'origine ; contrôle statique : règles du module dans le média mobile ;
//   kramail     réception et envoyés à 375 et 767 px : même carte, corps sans retrait (lignes pleine largeur) ; contrôle statique : règles de la
//               carte (priorités) et règles du kramail ciblées sans marge, fond ni couleur propres ;
//   forum       (entrée 2) sous-forum, index RP, Communauté, Staff, racine et racine-groupes à 375 et 767 px, Kraland clair et Empire Brun
//               sombre : même carte (corps sans retrait, chevron natif de 44 x 44 dans la carte, Staff compris depuis la revue S21, n° 9 ;
//               en-tête qui répète le titre de la page, index et racine, n° 13 : masqué avec son chevron, contenu en haut de la carte), tout
//               élément des panneaux dans la carte, aucun débordement (Staff : largeur défilable égale à la base, sa croix d'alerte débordant
//               déjà) ; contrôle statique : règles du forum ciblées sans fond transparent, filet, rayon, retrait propre ni
//               --kr-text-accent ; fil de sujet : messages égaux au bundle de base (7bec452) ; exclus de la carte, mêmes largeurs et
//               variantes, égaux à la base sous leur racine : accordéon
//               (.panel-group) de Répondre (kramail) et de la page de l'échelle, panneau à onglets des modales d'ordre Dormir et Pouvoir ;
//   lignes      mêmes pages du forum, largeurs et variantes : chaque ligne de tableau dans la carte, sans ombre ; hauteur, retraits, filets
//               (gauche de 4 px des non lus, bas), fond, icônes d'état et cadenas, pastilles, flèche « dernier message » et cibles
//               (elementFromPoint au centre, en haut, en bas, à droite et sur le filet) égaux au bundle de base (sujets permanents du
//               sous-forum hors comparaison tant que la base précède la revue S21 : deux lignes par sujet, n° 6) ;
//   chevron     sous-forum à 375 et 767 px : chevron natif de 44 x 44 dans la carte, touché au centre (elementFromPoint) ; 1er tap : carte
//               réduite à l'en-tête ; 2e tap : hauteur d'origine ; en-tête qui répète le titre de la page (index, racine-groupes : revue
//               S21, n° 13, kr-titre-repete) : masqué avec son chevron, corps affiché, aucun tap ;
//   bureau      toutes les pages à 768, 769, 1280, 1440 et 1920 px, Kraland clair et Empire Brun sombre : égales au bundle de base ;
//   bascule     Bâtiments, 767 -> 768 -> 767 et 768 -> 767 -> 768 dans le même onglet (section repliée avant chaque passage) : carte à 767,
//               égal au bundle de base (même parcours) à 768 ;
//   groupes     (entrée 3) groupes du plateau (plateau-qualite-usage, .dashboard natif de deux groupes) à 375 et 767 px, Kraland clair et
//               Empire Brun sombre : chaque groupe en carte (8 px des bords, fond surface, rayons 8 px, ombre de carte du thème, contour en
//               clair et aucune en sombre depuis la revue S21, n° 3 ; en-tête de 48 px au
//               moins, retrait 0 16 px, fond surface, sans filet ; titre 17 px 700 text-primary sans capitales ; chevron dans le flux à 16 px
//               du bord droit ; cartes de personnages à 8 px des bords), aucun débordement ; « mon groupe » ouvert, l'autre réduit à son
//               en-tête de 48 px (grille de 0 px sans cible, cartes dans le DOM) ; deux taps par en-tête (scrollTo puis elementFromPoint) :
//               état et aria-expanded inversés puis rétablis ; tap sur un bouton de groupe sans effet ; ordre des groupes et contenu des
//               cartes égaux au bundle de base (7bec452) ; mini-profil plié et déplié à 375 et 700 px (plateau-minimal, plateau-qualite-usage)
//               égal à la base (différé tant que la base précède la revue S21 : mini-profil refait, n° 4 et 14) ; 768, 769, 1280, 1440 et 1920 px égaux à la base ; bascule 767 -> 768 -> 767 et 768 -> 767 -> 768 dans le
//               même onglet : carte à 767, base à 768 ; contrôle statique : règles des groupes sans !important, dans le média mobile ;
//   contraste   16 variantes, Bâtiments, réception, sous-forum, index RP et groupes du plateau à 375 px : titre de chaque carte ≥ 4,5:1 sur
//               son fond ; coins de la carte et coins bas du dernier corps à 8 px ;
//   pastilles   (entrée 4) cloche et enveloppe de la barre (typographie-formes.html, pastilles remplies) à 375, 767, 768, 769, 1280, 1440 et
//               1920 px, Kraland clair et Empire Brun sombre : pastille visible portée par le clone (375, 767) ou par l'original (768 et
//               au-delà), touchée au centre (elementFromPoint, sans tap) ; toutes les pastilles remplies, originaux et clones, en pastille
//               d'état (fond non lu, texte surface, 12 px 700, rayon plein, bordures de largeur 0) ; géométrie des pastilles et des liens,
//               animation des icônes et emplois hors liste (pastille de panneau ; de groupe : entrée 5) égaux à la base (7bec452) ; pastilles
//               vides (kramail-reception.html) invisibles, originaux et clones, icônes sans animation ; 16 variantes à 375, 1280, 1440 et
//               1920 px : fond égal au jeton calculé et au fond de « NOUVEAU MESSAGE » du sous-forum (même largeur, même variante), texte
//               idem, ≥ 4,5:1 ; bascule 767 -> 768 -> 767 et 768 -> 767 -> 768 dans le même onglet ; contrôle statique de la règle réécrite.
//   etiquettes  (entrée 5) étiquettes de catégorie : « PNJ » des cartes (typographie-formes.html, plateau-qualite-usage), marque native
//               PNJ (palette-nation-etats.html, repos et survol forcé), compteur de groupe, tags du sujet (typographie-formes.html à une
//               adresse de forum ; appui forcé), à 375, 767, 768, 769, 1280, 1440 et 1920 px, Kraland clair et Empire Brun sombre : fond et
//               texte égaux aux jetons de catégorie calculés, bordure du fond, 12 px 700 (marque : taille de .xmini égale à la base), rayon
//               plein, aucune couleur d'état ; position, boîte, retrait, casse et espacement égaux au bundle de base (7bec452) ; tags égaux
//               à la base à 768 et au-delà ; compteurs de contact du kramail (réception dérivée, contact actif compris) en pastille d'état
//               comme « NOUVEAU MESSAGE » du sous-forum, vides invisibles ; « guilde », « [mod] », « Arme en main », pastilles d'ordre,
//               éléments hors familles, étiquettes d'état, pièce courante et tags natifs égaux à la base (étiquettes du sous-forum mobile
//               sans position ni largeur tant que la base précède la revue S21, n° 6) ; fil de sujet sans étiquette ;
//               16 variantes à 375, 1280, 1440 et 1920 px : mêmes couleurs, ≥ 4,5:1 (rapport exact) ; bascule 767 -> 768 -> 767 et 768 ->
//               767 -> 768 dans le même onglet ; contrôles statiques (priorités forcées au plus égales à la base, plus le surplus
//               consigné de la revue S21 tant que la base la précède, règles :focus au moins aussi nombreuses, aucune couleur littérale,
//               règle de la marque, sélecteur des contacts en tête de la règle d'état, détecteurs 5.4 et 5.5).
// Pages = FIXTURES SYNTHÉTIQUES (tests/e2e/fixtures), servies à leurs adresses ; vrai Bootstrap 3.3.7 (tests/e2e/vendor). Aucun accès au
// site réel. Les repères cités par trois suites (panneau, gardes du forum) sont dans lib/variantes.mjs (routeur, MAX_CITING).
// Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base, défaut : git show 7bec452, recalage du sweep 9.12, anciennes bases
// d64c578, a7f0463 pour groupes, 601ab19 pour pastilles, 59567f0 pour etiquettes), KR_FRAG = carte, module, kramail, forum, lignes, chevron, bureau, bascule, groupes, contraste,
// pastilles, etiquettes (vide = tout).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, styleSettled, THEME_READY, waitState } from './lib/settle.mjs';
import { AVANT_TICKET54, AVANT_TICKET55, CONTRASTE, CORRIGER_BUG20, DOSSIER_MODALE_TICKET51, ETIQUETTES_TICKET55 as E, GROUPES_TICKET53 as G, PANNEAU_TICKET51, PASTILLES_TICKET54 as P, PASTILLE_TICKET52, RACCOURCIS_TICKET51, REGLES_CARTE_TICKET52, REGLES_FORUM_TICKET52, REGLES_KRAMAIL_TICKET51, SUJET_TICKET52, TEXTE_TICKET51, VALEURS_FORUM_TICKET52, VARIANTES as TOUTES, CARACTERISTIQUES_BACKLOG13 as C13, choisirVariante, ecartsCaracteristiquesBacklog13, poserJetonsRedefinis, RELEVER_CARACTERISTIQUES_BACKLOG13 } from './lib/variantes.mjs';
import { ACTIONS_RAPIDES_S21, AVANT_REVUE_S21, BARRE_MESSAGE_S21, HAUT_S21, LIENS_S21, MINI_PROFIL_S21, MODALE_ORDRE_S21 } from './lib/revue-s21.mjs';
import { AVANT_CLAVIER_COMPACT, AVANT_DENSITE_ORDRE } from './lib/densite-ordre.mjs';
import { AVANT_DENSITE_REDACTION } from './lib/densite-redaction.mjs';
import { AVANT_DENSITE_JEU, PAGES_DENSITE_JEU } from './lib/densite-jeu.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const userscript = sansEntete(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_AVANT = '7bec452'; // recalage du sweep 9.12 (une base pour tous les fragments) : entrées 9.1 à 9.10 comprises
// Écart voulu du bug 20 (accès rapides du plateau mobile 24 px moins hauts, groupes remontés) : base corrigée par CORRIGER_BUG20.
const avant = CORRIGER_BUG20(sansEntete(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_AVANT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })));
// Écarts acceptés et consignés de la revue S21 (lib/revue-s21.mjs) : feuilles miroirs posées sur toute ouverture de la base tant qu'elle
// précède la revue, média mobile seulement (sans effet au bureau) : liens du texte (n° 2), haut des pages (n° 4), modale d'ordre (n° 10),
// barre d'actions des messages du forum (n° 13), actions rapides et mini-profil du plateau (n° 4 et 14). Retrait au recalage de COMMIT_AVANT
// au-delà de la revue.
const MIROIRS_BASE = AVANT_REVUE_S21(avant) ? [LIENS_S21, HAUT_S21, MODALE_ORDRE_S21, BARRE_MESSAGE_S21, ACTIONS_RAPIDES_S21, MINI_PROFIL_S21].join('\n') : '';
if (MIROIRS_BASE) { console.log('info : base d\'avant la revue S21, feuilles miroirs des n° 2, 4, 10, 13 et 14 posées sur la base (écarts consignés)'); }
const lire = f => fs.readFileSync(path.join(here, 'fixtures', f), 'utf8');
const ordre = f => lire(path.join(DOSSIER_MODALE_TICKET51, f)).replace(/^<!--[\s\S]*?-->\s*/, '');
// Styles et scripts natifs du site pour les modales d'ordre (vendor/parler, comme la suite de la modale d'ordre).
const PARLER = path.join(here, 'vendor', 'parler');
const NATIFS = {
  '/lib/bootstrap-3.3.7/css/bootstrap1.min.css': 'bootstrap1.min.css', '/lib/kraland-7.0.9/css/main.css': 'main.css',
  '/lib/kraland-7.0.9/css/bootswatch.css': 'bootswatch.css', '/lib/kraland-7.0.9/css/minichat.css': 'minichat.css',
  '/lib/kraland-7.0.9/css/game.css': 'game.css', '/lib/jquery-3.3.1/jquery-3.3.1.min.js': 'jquery.min.js',
  '/lib/bootstrap-3.3.7/js/bootstrap.min.js': 'bootstrap.min.js', '/lib/bootbox-4.4.0/bootbox.min.js': 'bootbox.min.js'
};
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const BASE = 'http://www.kraland.org';
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');
const VARIANTES = ['kraland', 'empire-brun-dark'];
const MOBILES = [375, 767];
const BUREAUX = [768, 769, 1280, 1440, 1920];

// Pages : adresse, fixture, famille (jeu, kramail, forum, sujet, exclus), en-têtes marqués par le module (titres attendus) et éléments
// comparés au bundle de base (releve, défaut : panneaux).
const PAGES = {
  materiel: { url: '/jouer/materiel', html: lire('jeu-materiel.html'), famille: 'jeu' },
  perso: { url: '/jouer/perso', html: lire('jeu-perso.html'), famille: 'jeu' },
  bat: { url: '/jouer/bat', html: lire('jeu-batiments.html'), famille: 'jeu', module: ['Bâtiments Privés'] },
  pnj: { url: '/jouer/pnj', html: lire('jeu-employes.html'), famille: 'jeu' },
  plateau: { url: '/jouer/plateau', html: lire('jeu-plateau-objets.html'), famille: 'jeu', module: ['Commerce', 'Matériel'] },
  regles: { url: '/regles/base', html: lire('regles-recherche.html'), famille: 'jeu' },
  cyber: { url: '/map', html: lire('cybermonde-ville.html'), famille: 'jeu', module: ['Bâtiments'] },
  reception: { url: '/kramail/personnage-fictif-2000-0', html: lire('kramail-reception.html'), famille: 'kramail' },
  envoi: { url: '/kramail/personnage-fictif-2000-1', html: lire('kramail-envoi.html'), famille: 'kramail' },
  'sous-forum': { url: '/forum/hrp/debuter-20102', html: lire('sous-forum-debuter.html'), famille: 'forum' },
  'index-rp': { url: '/forum/rp', html: lire('forum-index-rp.html'), famille: 'forum' },
  'index-communaute': { url: '/forum/communaute', html: lire('forum-index-communaute.html'), famille: 'forum' },
  // Staff : la fixture de l'index RP servie à /forum/staff (page-forum sans la classe d'index, lignes en cartes A13).
  staff: { url: '/forum/staff', html: lire('forum-index-rp.html'), famille: 'forum' },
  racine: { url: '/forum', html: lire('forum-racine.html'), famille: 'forum' },
  'racine-groupes': { url: '/forum', html: lire('forum-racine-groupes.html'), famille: 'forum' },
  // Fil de sujet : aucun panneau ; ses messages (.media) sont comparés au bundle de base.
  sujet: { url: '/forum/sujet/messages-v3-329425-1', html: lire(SUJET_TICKET52), famille: 'sujet', releve: ['.media', '.media *'] },
  // Exclus de la carte, mesurés sous leur racine (racine) : accordéon (.panel-group) du kramail et de la page synthétique de l'échelle,
  // panneau à onglets des modales d'ordre (Dormir, Pouvoir) ouvertes par bootbox.confirm sur le plateau, styles natifs du site (vendor/parler).
  repondre: { url: '/kramail/post/sujet-fictif-de-lecture-5-9000002', html: lire('kramail-repondre.html'), famille: 'exclus', racine: '.panel-group' },
  echelle: { url: '/jouer/materiel', html: lire('typographie-echelle.html'), famille: 'exclus', racine: '.panel-group' },
  'modale-dormir': { url: '/jouer/plateau', html: ordre('plateau.html'), famille: 'exclus', racine: '.bootbox', ordre: ordre('dormir.html') },
  'modale-pouvoir': { url: '/jouer/plateau', html: ordre('plateau.html'), famille: 'exclus', racine: '.bootbox', ordre: ordre('pouvoir.html') },
  // Groupes du plateau (entrée 3) : fixtures sans feuille Bootstrap, liée ici pour la cascade réelle (vendor). plateau-minimal : mini-profil seul.
  groupes: { url: '/jouer/plateau', html: avecBootstrap(lire('plateau-qualite-usage.html')), famille: 'groupes' },
  'plateau-minimal': { url: '/jouer/plateau', html: avecBootstrap(lire('plateau-minimal.html')), famille: 'groupes' },
  // P4 : groupes à innerWidth 791 (barre de navigation qui déborde, relevé sur plateau-minimal) : mobile-mode absent, média mobile valide.
  'groupes-nu': { url: '/jouer/plateau', html: avecBootstrap(lire('plateau-qualite-usage.html')), famille: 'groupes', innerWidth: 791 },
  // Pastilles de la barre (entrée 4) : cloche « ! » et enveloppe « 3 » remplies (clic neutralisé dans la fixture, jamais tapées) ; les
  // pastilles vides viennent de la réception, la référence « NOUVEAU MESSAGE » du sous-forum. Bootstrap servi par la route (vendor).
  barre: { url: '/jouer/plateau', html: lire('typographie-formes.html'), famille: 'pastilles' },
  // Étiquettes de catégorie (entrée 5) : tags du sujet (la même fixture servie à une adresse de forum), marque native PNJ (palette d'états,
  // Bootstrap servi par la route), réception dérivée (A5, aucune fixture modifiée) : compteur du contact 1000 rempli « 2 », contact 2000
  // actif rempli « 1 » (P6 : aucun contact actif dans la fixture).
  tags: { url: '/forum/hrp/fixture-typographie-1', html: lire('typographie-formes.html'), famille: 'etiquettes' },
  etats: { url: '/regles/avancees', html: lire('palette-nation-etats.html'), famille: 'etiquettes' },
  'reception-remplie': {
    url: '/kramail/personnage-fictif-2000-0', famille: 'etiquettes',
    html: lire('kramail-reception.html').replace('id="badge1000"></span>', 'id="badge1000">2</span>')
      .replace('<a href="kramail/personnage-fictif-2000-0" class="list-group-item">', '<a href="kramail/personnage-fictif-2000-0" class="list-group-item active">')
      .replace('id="badge2000"></span>', 'id="badge2000">1</span>')
  }
};
function avecBootstrap(h) { return h.replace('</head>', '<link rel="stylesheet" href="/lib/bootstrap-3.3.7/css/bootstrap.min.css"></head>'); }
const DE = famille => Object.keys(PAGES).filter(k => PAGES[k].famille === famille);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}

const browser = await launchBrowser();

async function ouvrir({ nom, width, height = 667, variante, script, tactile = width < 768 }) {
  const def = PAGES[nom];
  const context = await browser.newContext({ viewport: { width, height }, isMobile: tactile, hasTouch: tactile, deviceScaleFactor: 1 });
  await confineNetwork(context); // refus global EN PREMIER, routes des fixtures ensuite
  // Base d'avant la revue S21 : feuilles miroirs (MIROIRS_BASE) en feuille adoptée, avant le premier rendu.
  if (script === avant && MIROIRS_BASE) { await context.addInitScript(poserJetonsRedefinis, MIROIRS_BASE); }
  await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (u.href.split('#')[0] === BASE + def.url) { return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: def.html }); }
    if (def.ordre) {
      if (NATIFS[u.pathname]) { return route.fulfill({ path: path.join(PARLER, NATIFS[u.pathname]), contentType: u.pathname.endsWith('.css') ? 'text/css' : 'application/javascript' }); }
      return route.abort();
    }
    if (u.pathname.startsWith('/lib/bootstrap') || u.pathname.startsWith('/lib/jquery')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return route.fulfill({ path: path.join(VENDOR, file), contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript' });
    }
    if (u.pathname.endsWith('.css')) { return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    return route.abort();
  });
  await context.addInitScript(choisirVariante, variante);
  // P4 : innerWidth lu au-delà du seuil (barre de navigation qui déborde sur le site) ; le média CSS suit la vraie largeur.
  if (def.innerWidth) { await context.addInitScript(w => { Object.defineProperty(window, 'innerWidth', { get: () => w, configurable: true }); }, def.innerWidth); }
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
  await page.goto(BASE + def.url, { waitUntil: 'load' });
  await prete(page, `${nom} ${variante} ${width} px`);
  if (def.ordre) {
    // Ouverture comme le site : bootbox.confirm, contenu de l'ordre dans #ajax-order ; le rappel ne valide rien. Mesure après shown.bs.modal.
    await waitState(page, () => !!window.bootbox && !!window.jQuery);
    await page.evaluate(h => {
      window.__shown = 0;
      window.jQuery(document).on('shown.bs.modal', () => { window.__shown += 1; });
      window.bootbox.confirm(`<div id="ajax-order">${h}</div>`, () => false);
    }, def.ordre);
    await waitState(page, () => window.__shown > 0);
    await styleSettled(page, '.bootbox');
  }
  return { context, page, erreurs };
}

async function prete(page, label) {
  await krReady(page, { ready: THEME_READY, label });
  await styleSettled(page, 'body');
  await page.evaluate(CONTRASTE);
}

// Mesure des cartes (dans la page) : panneaux visibles avec en-tête, hors accordéon (.panel-group, entrée 3).
const MESURE = ([sel, texte]) => {
  const vis = e => !!e && e.getClientRects().length > 0 && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden';
  const boite = e => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height, d: b.right, bas: b.bottom }; };
  const px = v => parseFloat(v) || 0;
  const coins = s => [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
  const C = window.__krContraste;
  const panneaux = [...document.querySelectorAll(sel)].filter(p => vis(p) && !p.closest('.panel-group') && p.querySelector(':scope > .panel-heading'));
  return {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    vw: document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth,
    surface: C.sonde('var(--kr-bg-surface)'),
    primaire: C.sonde(texte),
    panneaux: panneaux.map(p => {
      const s = getComputedStyle(p);
      const h = p.querySelector(':scope > .panel-heading');
      const hs = getComputedStyle(h);
      const titre = h.querySelector('h1, h2, h3, h4, h5, h6, .panel-title');
      const ts = titre && getComputedStyle(titre);
      const enfants = [...h.children].filter(vis);
      const contenu = Math.max(0, ...enfants.map(k => { const ks = getComputedStyle(k); return k.getBoundingClientRect().height + px(ks.marginTop) + px(ks.marginBottom); }));
      const suite = [...p.children].filter(c => c !== h && vis(c) && c.getBoundingClientRect().height > 0);
      const corps = [...p.children].filter(c => c.classList.contains('panel-body') && vis(c));
      const dernier = p.lastElementChild;
      const chevrons = [...h.querySelectorAll(':scope > .accordion-icon, :scope > .pull-right.clickable')].filter(vis).map(c => ({ ...boite(c), cls: c.className }));
      // Éléments du panneau sortis de la carte (bords gauche et droit), 5 au plus. Le contenu d'un défileur du panneau (barre de tri
      // DataTables, `overflow-x: auto` natif) est exclu : le défileur lui-même est contrôlé.
      const pb = p.getBoundingClientRect();
      const defile = e => { for (let o = e.parentElement; o && o !== p; o = o.parentElement) { if (getComputedStyle(o).overflowX !== 'visible') { return true; } } return false; };
      const hors = [...p.querySelectorAll('*')].filter(e => vis(e) && !defile(e)).map(e => [e, e.getBoundingClientRect()])
        .filter(([, b]) => b.width > 0 && (b.left < pb.left - 0.5 || b.right > pb.right + 0.5)).slice(0, 5)
        .map(([e, b]) => `${e.tagName}.${[...e.classList].join('.')} [${Math.round(b.left * 10) / 10}..${Math.round(b.right * 10) / 10}]`);
      return {
        nom: (titre ? titre.textContent : h.textContent).trim().replace(/\s+/g, ' ').slice(0, 30),
        repete: h.classList.contains('kr-titre-repete'),
        p: boite(p), fond: s.backgroundColor, coins: coins(s),
        h: boite(h), filet: hs.borderBottomWidth, retrait: [hs.paddingTop, hs.paddingRight, hs.paddingBottom, hs.paddingLeft], contenu: contenu + px(hs.paddingTop) + px(hs.paddingBottom),
        titre: titre ? { tag: titre.tagName, taille: ts.fontSize, graisse: ts.fontWeight, couleur: ts.color, rapport: C.texte(titre) } : null,
        suite: suite.length ? boite(suite[0]) : null,
        corps: corps.map(c => { const cs = getComputedStyle(c); return [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft]; }),
        corpsTexte: corps.map(c => !!c.querySelector(':scope > p')),
        dernier: dernier && dernier.classList.contains('panel-body') && vis(dernier) && dernier !== h ? coins(getComputedStyle(dernier)).slice(2) : null,
        chevrons, hors
      };
    })
  };
};

// Relevé de comparaison (dans la page) : panneaux, en-têtes, titres, corps et chevrons, boîte au dixième et styles calculés.
// ecarter : sous-arbres dont le fond et le texte sont relevés à part (caractéristiques, backlog 13), « · » à leur place.
const RELEVE = ([racine = 'html', sels = ['.panel', '.panel-heading', '.panel-heading > *', '.panel-body', '.accordion-icon'], ecarter] = []) => {
  const r = v => Math.round(v * 10) / 10;
  const props = ['display', 'position', 'backgroundColor', 'color', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius',
    'borderBottomLeftRadius', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom',
    'marginLeft', 'minHeight', 'fontSize', 'fontWeight', 'borderTopWidth', 'boxShadow', 'transform'];
  // Sous une racine (exclus de la carte), ordonnée relative à son haut : le contenu de la page au-dessus (en carte) la déplace.
  const haut = racine === 'html' ? 0 : document.querySelector(racine).getBoundingClientRect().top;
  return {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    sw: document.documentElement.scrollWidth,
    l: [...document.querySelectorAll(sels.map(x => `${racine} ${x}`).join(', '))].map((e, i) => {
      const b = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      const aPart = ecarter && e.closest(ecarter);
      return `${i} ${e.tagName}.${[...e.classList].join('.')} [${e.getClientRects().length ? [b.left, b.top - haut, b.width, b.height].map(r).join(',') : 'sans boîte'}] ` + props.map(p => (aPart && (p === 'backgroundColor' || p === 'color') ? '·' : s[p])).join('|');
    })
  };
};
const premierEcart = (a, b) => {
  const i = a.findIndex((x, k) => x !== b[k]);
  if (i < 0 && a.length === b.length) { return ''; }
  const k = i < 0 ? Math.min(a.length, b.length) : i;
  return `${a.length} / ${b.length} éléments ; testé « ${a[k] || '-'} » / base « ${b[k] || '-'} »`;
};

const pres = (a, b, tol = 0.5) => Math.abs(a - b) <= tol;
const r1 = v => Math.round(v * 10) / 10;
// Forum (entrée 2) : corps sans retrait, chevron natif de 44 x 44 dans la carte (marge droite d'origine), tout élément du panneau dans la
// carte. swBase : largeur défilable du bundle de base ; si la base déborde déjà (Staff : croix de l'alerte hors panneau), la page testée
// garde la même largeur défilable, sans élément de panneau sorti. 44 x 44 exigé partout, Staff compris (revue S21, n° 9 : avant, le chevron
// natif de Staff, sans règle de sous-forum ni d'index, A6, gardait la taille de la base). En-tête qui répète le titre de la page (index et
// racine, revue S21, n° 13, kr-titre-repete) : masqué avec son chevron, contenu en haut de la carte ; le reste de la carte est contrôlé.
// densite : Matériel et Personnage (densité du 1er novembre 2026, lib/densite-jeu.mjs), en-tête de 44 px (plus haut seulement si son contenu
// l'exige), corps à 8 px de retrait, 16 px de côté pour un corps de texte (paragraphes de Finance).
function controlerCarte(m, famille, swBase, densite = false) {
  assert.ok(m.theme, 'kr-theme-enabled absent');
  assert.ok(m.mobile, 'mobile-mode absent');
  assert.ok(m.panneaux.length > 0, 'aucun panneau à en-tête');
  const forum = famille === 'forum';
  if (forum && swBase > m.vw) { assert.equal(m.sw, swBase, `largeur défilable ${m.sw} (base ${swBase}, vw ${m.vw})`); } else {
    assert.ok(m.sw <= m.vw, `débordement horizontal : ${m.sw} > ${m.vw}`);
  }
  const ecarts = [];
  for (const c of m.panneaux) {
    const e = [];
    if (!pres(c.p.x, 8) || !pres(c.p.w, m.vw - 16)) { e.push(`boîte x ${c.p.x} largeur ${c.p.w} (vw ${m.vw})`); }
    if (c.fond !== m.surface) { e.push(`fond ${c.fond} ≠ ${m.surface}`); }
    if (c.coins.some(v => v !== '8px')) { e.push(`rayons ${c.coins.join(' ')}`); }
    const attendu = k => (densite ? (c.corpsTexte[k] ? '8px 16px 8px 16px' : '8px 8px 8px 8px') : famille === 'jeu' ? '16px 16px 16px 16px' : '0px 0px 0px 0px');
    if (c.corps.some((v, k) => v.join(' ') !== attendu(k))) { e.push(`corps ${c.corps.map(v => v.join(' ')).join(' ; ')}`); }
    if (c.dernier && c.dernier.some(v => v !== '8px')) { e.push(`coins bas du dernier corps ${c.dernier.join(' ')}`); }
    if (c.repete) {
      if (c.h.h > 0 || c.chevrons.length) { e.push(`en-tête qui répète le titre de la page affiché (${r1(c.h.h)} px, ${c.chevrons.length} chevron(s))`); }
      if (!c.suite || !pres(c.suite.y, c.p.y)) { e.push(`contenu à ${c.suite ? r1(c.suite.y - c.p.y) : '-'} px du haut de la carte`); }
      if (forum && c.hors.length) { e.push(`hors de la carte : ${c.hors.join(', ')}`); }
      if (e.length) { ecarts.push(`« ${c.nom} » : ${e.join(', ')}`); }
      continue;
    }
    if (!pres(c.h.y, c.p.y) || !pres(c.h.x, c.p.x) || !pres(c.h.w, c.p.w)) { e.push(`en-tête décalé [${c.h.x},${c.h.y},${c.h.w}]`); }
    const hauteur = densite ? 44 : 48;
    if (c.h.h < hauteur - 0.5 || (c.h.h > hauteur + 0.5 && c.contenu < c.h.h - 0.5)) { e.push(`en-tête ${c.h.h} px (contenu ${c.contenu})`); }
    if (c.retrait.join(' ') !== '0px 16px 0px 16px') { e.push(`retrait ${c.retrait.join(' ')}`); }
    if (c.filet !== '0px') { e.push(`filet sous l'en-tête ${c.filet}`); }
    if (c.suite && !pres(c.suite.y, c.h.bas)) { e.push(`écart de ${Math.round((c.suite.y - c.h.bas) * 10) / 10} px sous l'en-tête`); }
    if (!c.titre || c.titre.tag !== 'H3') { e.push(`titre ${c.titre ? c.titre.tag : 'absent'}`); } else if (c.titre.taille !== '17px' || c.titre.graisse !== '700' || c.titre.couleur !== m.primaire) {
      e.push(`titre ${c.titre.taille}/${c.titre.graisse} ${c.titre.couleur} (attendu 17px/700 ${m.primaire})`);
    }
    for (const v of c.chevrons) {
      if (forum) {
        if (v.w < 43.5 || v.h < 43.5 || v.x < c.p.x - 0.5 || v.d > c.p.d + 0.5 || v.y < c.h.y - 0.5 || v.bas > c.h.bas + 0.5) { e.push(`chevron ${v.cls} ${v.w} x ${v.h} [${v.x}..${v.d}, ${v.y}..${v.bas}] hors de la carte ou de l'en-tête [${c.h.y}..${c.h.bas}]`); }
      } else if (/\bclickable\b/.test(v.cls)) {
        // Revue S21 (n° 9) : chevron natif (span.clickable) en cible de 44 x 44 au bord droit de l'en-tête, glyphe centré (il finit à 16 px
        // du bord, comme l'icône convertie) ; avant la revue, glyphe seul à 16 px du bord.
        if (v.w < 43.5 || v.h < 43.5 || !pres(c.h.d, v.d) || v.y < c.h.y - 0.5 || v.bas > c.h.bas + 0.5) { e.push(`chevron ${v.cls} ${r1(v.w)} x ${r1(v.h)} à ${r1(c.h.d - v.d)} px du bord, [${v.y},${v.bas}] hors de [${c.h.y},${c.h.bas}]`); }
      } else if (!pres(c.h.d - v.d, 16) || v.y < c.h.y - 0.5 || v.bas > c.h.bas + 0.5) { e.push(`chevron ${v.cls} à ${Math.round((c.h.d - v.d) * 10) / 10} px du bord, [${v.y},${v.bas}] hors de [${c.h.y},${c.h.bas}]`); }
    }
    if (forum && c.hors.length) { e.push(`hors de la carte : ${c.hors.join(', ')}`); }
    if (e.length) { ecarts.push(`« ${c.nom} » : ${e.join(', ')}`); }
  }
  assert.deepEqual(ecarts, [], ecarts.join(' ; '));
}

// ---------- carte et kramail ----------
for (const [frag, famille] of [['carte', 'jeu'], ['kramail', 'kramail']]) {
  if (!on(frag)) { continue; }
  console.log(`\n== ${frag} ==`);
  const cas = DE(famille).flatMap(nom => MOBILES.flatMap(width => VARIANTES.map(variante => ({ nom, width, variante }))));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const m = await page.evaluate(MESURE, [PANNEAU_TICKET51, TEXTE_TICKET51]);
    await context.close();
    return { c, m, erreurs };
  });
  for (const { c, m, erreurs } of res) {
    const densite = famille === 'jeu' && PAGES_DENSITE_JEU.some(d => PAGES[c.nom].url === d || PAGES[c.nom].url.startsWith(d + '/'));
    check(`${frag} ${c.nom} ${c.variante} ${c.width} px : ${m.panneaux.length} carte(s) à 8 px des bords, fond surface, rayons 8 px, en-tête de ${densite ? 44 : 48} px (retrait 0 16 px, sans filet) collé au contenu, corps ${famille === 'kramail' ? 'sans retrait' : densite ? 'à 8 px (16 px de côté pour un corps de texte, densité du 1er novembre 2026)' : 'à 16 px'}, coins bas du dernier corps à 8 px, titre 17 px 700 text-primary, chevrons convertis à 16 px du bord droit, natifs en cible de 44 x 44 au bord droit (revue S21, n° 9), sans débordement`, () => controlerCarte(m, famille, undefined, densite));
    check(`${frag} ${c.nom} ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

// ---------- contrôles statiques (CSSOM du thème du bundle testé) ----------
function cssDuBundle(src) {
  const i = src.indexOf('BUNDLED_CSS:\'') + 13;
  let j = i;
  while (src[j] !== '\'') { j += src[j] === '\\' ? 2 : 1; }
  return src.slice(i, j);
}
const REGLES_CSS = ([css, raccourcis]) => {
  const feuille = new window.CSSStyleSheet();
  feuille.replaceSync(css);
  const out = [];
  const parcourir = (liste, media) => { for (const r of liste) {
    if (r.media) { parcourir(r.cssRules, r.media.mediaText); continue; }
    if (!r.selectorText) { if (r.cssRules) { parcourir(r.cssRules, media); } continue; }
    const d = {};
    for (let k = 0; k < r.style.length; k += 1) { const p = r.style[k]; d[p] = [r.style.getPropertyValue(p), r.style.getPropertyPriority(p)]; }
    for (const p of raccourcis) { if (r.style.getPropertyValue(p)) { d[p] = [r.style.getPropertyValue(p), r.style.getPropertyPriority(p)]; } }
    out.push({ media, sel: r.selectorText, d });
  } };
  parcourir(feuille.cssRules, '');
  return out;
};
// Règles du bundle testé (défaut) ou d'un bundle de base (entrée 5 : décompte des priorités forcées et des règles :focus).
const reglesLues = new Map();
async function regles(src = userscript) {
  if (reglesLues.has(src)) { return reglesLues.get(src); }
  const context = await browser.newContext();
  await confineNetwork(context);
  const page = await context.newPage();
  // eslint-disable-next-line no-eval
  reglesLues.set(src, await page.evaluate(REGLES_CSS, [(0, eval)(`'${cssDuBundle(src)}'`), RACCOURCIS_TICKET51]));
  await context.close();
  return reglesLues.get(src);
}
// Média mobile, seul ou restreint au mouvement réduit (épopée 9, entrée 5 : accordéons sans transition).
const MOBILE = ['(max-width: 767px)', '(width <= 767px)', '(max-width: 767px) and (prefers-reduced-motion: reduce)', '(width <= 767px) and (prefers-reduced-motion: reduce)'];

if (on('kramail')) {
  const rs = await regles();
  check(`statique : ${REGLES_CARTE_TICKET52.length} déclarations réécrites (fond et marges latérales de la carte ; retrait, marge basse et hauteur de l'en-tête ; couleur du titre ; rayon du dernier corps ; retrait du corps replié) présentes, sans garde du forum, dans le média mobile seulement, à la priorité d'origine`, () => {
    const ecarts = REGLES_CARTE_TICKET52.flatMap(([sel, p, prio]) => {
      const l = rs.filter(r => r.sel === sel && r.d[p]);
      if (!l.length) { return [`${sel} { ${p} } absente`]; }
      return l.filter(r => !MOBILE.includes(r.media) || r.d[p][1] !== prio).map(r => `${r.media || 'global'} ${sel} { ${p}: ${r.d[p].join(' !')} }`);
    });
    assert.deepEqual(ecarts, [], ecarts.join(' ; '));
  });
  check('statique : règles du kramail ciblées sans marge (raccourci et 4 côtés), fond ni --kr-text-accent ; règle d\'en-tête du kramail retirée', () => {
    // Épopée 7, entrée 8 : la garde du kramail devient :is(body.page-kramail, :where(html.kr-page-contacts) body), même spécificité ; les
    // deux écritures sont lues, pour rejouer un bundle antérieur (KR_SCRIPT).
    const contacts = sel => sel.replace('body.page-kramail', ':is(body.page-kramail, :where(html.kr-page-contacts) body)');
    const ecarts = REGLES_KRAMAIL_TICKET51.flatMap(([sel, absentes]) => {
      const l = rs.filter(r => r.sel === sel || r.sel === contacts(sel));
      if (absentes === null) { return l.map(r => `${r.media || 'global'} ${sel} présente`); }
      if (!l.length) { return [`${sel} absente`]; }
      return l.flatMap(r => [...absentes.filter(p => r.d[p]).map(p => `${sel} { ${p}: ${r.d[p][0]} }`),
        ...Object.entries(r.d).filter(([, [v]]) => v.includes('--kr-text-accent')).map(([p]) => `${sel} { ${p}: accent }`)]);
    });
    assert.deepEqual(ecarts, [], ecarts.join(' ; '));
  });
}

// ---------- module « Panel Sections Collapse » ----------
if (on('module')) {
  console.log('\n== module ==');
  const rs = await regles();
  check('statique : règles du module (building-section) toutes dans le média mobile, chevron sans position absolue', () => {
    const l = rs.filter(r => /building-section/.test(r.sel));
    assert.ok(l.length >= 5, `${l.length} règle(s)`);
    const hors = l.filter(r => !MOBILE.includes(r.media)).map(r => `${r.media || 'global'} ${r.sel}`);
    const absolu = l.filter(r => /accordion-icon/.test(r.sel) && (r.d.position || r.d.right || r.d.top)).map(r => r.sel);
    assert.deepEqual([...hors, ...absolu], [], [...hors, ...absolu].join(' ; '));
  });
  const cas = Object.keys(PAGES).filter(k => PAGES[k].module).flatMap(nom => MOBILES.map(width => ({ nom, width, variante: 'kraland' })));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const titres = await page.evaluate(() => [...document.querySelectorAll('.building-section-header')].map(h => h.textContent.trim().replace(/\s+/g, ' ')));
    const sections = [];
    for (let i = 0; i < titres.length; i += 1) {
      const etat = async () => page.evaluate(k => {
        const h = document.querySelectorAll('.building-section-header')[k];
        const p = h.parentElement;
        const corps = p.querySelector(':scope > .building-section-content');
        const icone = h.querySelector('.accordion-icon');
        const natif = h.querySelector('span.pull-right.clickable');
        const b = e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, d: r.right, bas: r.bottom }; };
        return { p: b(p), h: b(h), corps: corps ? b(corps) : null, icone: icone ? b(icone) : null, natif: natif ? getComputedStyle(natif).display : null,
          sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth };
      }, i);
      await page.evaluate(k => { const h = document.querySelectorAll('.building-section-header')[k]; window.scrollTo(0, 0); window.scrollTo(0, h.getBoundingClientRect().top - 200); }, i);
      await styleSettled(page, 'body');
      const avantTap = await etat();
      const taper = async () => {
        const e = await etat();
        const x = e.h.x + e.h.w / 3;
        const y = e.h.y + e.h.h / 2;
        const touche = await page.evaluate(({ k, px, py }) => document.elementFromPoint(px, py)?.closest('.building-section-header') === document.querySelectorAll('.building-section-header')[k], { k: i, px: x, py: y });
        if (touche) { await page.touchscreen.tap(x, y); }
        await styleSettled(page, '.building-section-content', { index: i });
        await styleSettled(page, '.building-section-header', { index: i });
        return touche;
      };
      const touche1 = await taper();
      const replie = await etat();
      const touche2 = await taper();
      const deplie = await etat();
      sections.push({ titre: titres[i], avantTap, touche1, replie, touche2, deplie });
    }
    await context.close();
    return { c, titres, sections, erreurs };
  });
  for (const { c, titres, sections, erreurs } of res) {
    const lab = `module ${c.nom} ${c.width} px`;
    check(`${lab} : en-têtes marqués ${PAGES[c.nom].module.join(', ')}`, () => {
      assert.deepEqual(PAGES[c.nom].module.filter(t => !titres.some(x => x.startsWith(t))), [], titres.join(' | '));
    });
    for (const s of sections) {
      const a = s.avantTap;
      check(`${lab} « ${s.titre} » : chevron du module à 16 px du bord droit, centré dans l'en-tête de 48 px, chevron natif masqué`, () => {
        assert.ok(a.icone, 'chevron absent');
        assert.ok(pres(a.h.d - a.icone.d, 16), `chevron à ${a.h.d - a.icone.d} px du bord droit`);
        assert.ok(pres(a.icone.y + a.icone.h / 2, a.h.y + a.h.h / 2, 1), `centre ${a.icone.y + a.icone.h / 2} / ${a.h.y + a.h.h / 2}`);
        assert.ok(pres(a.h.h, 48), `en-tête ${a.h.h} px`);
        assert.ok(a.natif === null || a.natif === 'none', `chevron natif ${a.natif}`);
      });
      check(`${lab} « ${s.titre} » : 1er tap (elementFromPoint sur l'en-tête) : carte de 48 px, corps de 0 px, sans débordement`, () => {
        assert.ok(s.touche1, 'en-tête couvert au point du tap');
        assert.ok(pres(s.replie.p.h, 48), `carte ${s.replie.p.h} px`);
        assert.ok(s.replie.corps && pres(s.replie.corps.h, 0), `corps ${s.replie.corps && s.replie.corps.h} px`);
        assert.ok(s.replie.sw <= s.replie.vw, `débordement ${s.replie.sw}`);
      });
      check(`${lab} « ${s.titre} » : 2e tap : hauteur d'origine (${Math.round(a.p.h * 10) / 10} px), sans débordement`, () => {
        assert.ok(s.touche2, 'en-tête couvert au point du tap');
        assert.ok(pres(s.deplie.p.h, a.p.h), `carte ${s.deplie.p.h} px`);
        assert.ok(s.deplie.sw <= s.deplie.vw, `débordement ${s.deplie.sw}`);
      });
    }
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

// ---------- égalité au bundle de base : forum (mobile) et bureau ----------
const EXCEPTION_REVUE_S21_10 = AVANT_REVUE_S21(avant);
const EXCEPTION_DENSITE_ORDRE = AVANT_DENSITE_ORDRE(avant);
// Écart accepté et consigné (densité de la modale d'ordre, 1er novembre 2026) : sous 768 px, onglets sur trois colonnes à 4 px d'écart et
// corps de l'ordre à 8 px de retrait (relevé sur le site réel, ordre Parler) : boîte, retraits, marges et hauteur minimale des panneaux de
// la modale à part ; affichage, position, fond, texte, rayons, typographie, bordure, ombre et transformation restent comparés.
const sansGeometrieDensite = x => {
  const m = x.match(/^(\S+ \S+) \[[^\]]*\] (.*)$/);
  if (!m) { return x; }
  const p = m[2].split('|');
  for (let k = 8; k <= 16; k += 1) { p[k] = '·'; }
  return `${m[1]} [·] ${p.join('|')}`;
};
async function comparer(frag, cas) {
  const res = await mapLimit(cas, async c => {
    const out = {};
    for (const [cle, script] of [['teste', userscript], ['base', avant]]) {
      const { context, page, erreurs } = await ouvrir({ ...c, script });
      out[cle] = { r: await page.evaluate(RELEVE, [PAGES[c.nom].racine, PAGES[c.nom].releve]), erreurs };
      await context.close();
    }
    return { c, ...out };
  });
  for (const { c, teste, base } of res) {
    const sous = PAGES[c.nom].racine ? ` sous ${PAGES[c.nom].racine}` : '';
    const quoi = PAGES[c.nom].releve ? 'messages' : 'panneaux, en-têtes, titres et corps';
    // Écart accepté et consigné (revue S21, n° 10) : le titre de la modale Dormir passe à l'image seule (kr-order-titre-image, posé par le
    // template, absent d'une base d'avant la revue) : 32 px de moins au-dessus des onglets, ordonnée à part ; le reste est comparé.
    const titreImage = EXCEPTION_REVUE_S21_10 && c.nom === 'modale-dormir' && c.width < 768;
    const densite = EXCEPTION_DENSITE_ORDRE && PAGES[c.nom].ordre && c.width < 768;
    const net = l => (densite ? l.map(sansGeometrieDensite) : titreImage ? l.map(x => x.replace(/\[([^,\]]+),[^,\]]+,/, '[$1,·,')) : l);
    const aPart = densite ? ', boîtes, retraits et marges à part (densité de la modale d\'ordre)' : titreImage ? ', ordonnée à part (titre image, revue S21, n° 10)' : '';
    check(`${frag} ${c.nom} ${c.variante} ${c.width} px : ${quoi}${sous} égaux au bundle de base (${teste.r.l.length} éléments)${aPart}`, () => {
      assert.ok(teste.r.theme && base.r.theme, `kr-theme-enabled testé ${teste.r.theme} / base ${base.r.theme}`);
      assert.equal(teste.r.mobile, c.width < 768, 'mode');
      assert.ok(teste.r.l.length > 0, 'aucun élément');
      const e = premierEcart(net(teste.r.l), net(base.r.l));
      assert.equal(e, '', e);
      assert.equal(teste.r.sw, base.r.sw, 'largeur défilable');
    });
    check(`${frag} ${c.nom} ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
}
if (on('forum')) {
  console.log('\n== forum ==');
  const rs = await regles();
  check('statique : règles du forum ciblées (panneau, en-tête, corps, titre) présentes, dans le média mobile seulement, sans fond ni rayon ni retrait propres à l\'en-tête, sans fond transparent, filet ni --kr-text-accent', () => {
    const ecarts = REGLES_FORUM_TICKET52.flatMap(([sel, absentes]) => {
      const l = rs.filter(r => r.sel === sel);
      if (!l.length) { return [`${sel} absente`]; }
      return l.flatMap(r => [...(MOBILE.includes(r.media) ? [] : [`${r.media || 'global'} ${sel}`]),
        ...absentes.filter(p => r.d[p]).map(p => `${sel} { ${p}: ${r.d[p][0]} }`),
        ...Object.entries(r.d).filter(([, [v]]) => VALEURS_FORUM_TICKET52.some(x => v.includes(x))).map(([p, [v]]) => `${sel} { ${p}: ${v} }`)]);
    });
    assert.deepEqual(ecarts, [], ecarts.join(' ; '));
  });
  const cas = DE('forum').flatMap(nom => MOBILES.flatMap(width => VARIANTES.map(variante => ({ nom, width, variante }))));
  const res = await mapLimit(cas, async c => {
    const t = await ouvrir({ ...c, script: userscript });
    const m = await t.page.evaluate(MESURE, [PANNEAU_TICKET51, TEXTE_TICKET51]);
    await t.context.close();
    const b = await ouvrir({ ...c, script: avant });
    const mb = await b.page.evaluate(MESURE, [PANNEAU_TICKET51, TEXTE_TICKET51]);
    await b.context.close();
    return { c, m, swBase: mb.sw, erreurs: t.erreurs };
  });
  for (const { c, m, swBase, erreurs } of res) {
    check(`forum ${c.nom} ${c.variante} ${c.width} px : ${m.panneaux.length} carte(s) à 8 px des bords, fond surface, rayons 8 px, en-tête de 48 px (retrait 0 16 px, sans filet) collé au contenu, corps sans retrait, coins bas du dernier corps à 8 px, titre 17 px 700 text-primary, chevron de 44 x 44 dans la carte (Staff compris, revue S21, n° 9), en-tête qui répète le titre de la page masqué avec son chevron (n° 13), éléments des panneaux dans la carte, sans débordement (base : ${swBase} px)`, () => controlerCarte(m, 'forum', swBase));
    check(`forum ${c.nom} ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
  await comparer('forum', [...DE('sujet'), ...DE('exclus')].flatMap(nom => MOBILES.flatMap(width => VARIANTES.map(variante => ({ nom, width, variante })))));
}
// ---------- lignes de tableau du forum (dans la carte, égales au bundle de base) ----------
// Relevé dans la page : chaque ligne visible des panneaux (hors accordéon), amenée à 150 px du haut avant les sondes elementFromPoint. Boîtes
// des icônes et flèches relatives à la ligne : ordonnée, taille, écarts gauche et droit. La carte raccourcit la ligne de 16 px : un élément
// garde un de ses deux écarts (ou perd 8 px de chaque côté, centré dans un élément étiré), et sa largeur ou sa largeur moins ces 16 px
// (élément étiré). Pastilles sans abscisse (elles suivent le titre).
// Le texte que la carte fait passer à la ligne (« Gagner des PA » à 375 px) grandit la ligne : hauteur et ordonnées ne sont alors comparées
// qu'au sens (plus haute que la base, plus de rangées de texte).
const LIGNES = ([sel, pastille]) => {
  const vis = e => !!e && e.getClientRects().length > 0 && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden';
  const r = v => Math.round(v * 10) / 10;
  const out = [];
  for (const p of [...document.querySelectorAll(sel)].filter(e => vis(e) && !e.closest('.panel-group'))) {
    for (const tr of [...p.querySelectorAll('tbody > tr')].filter(vis)) {
      window.scrollTo(0, 0);
      window.scrollTo(0, tr.getBoundingClientRect().top - 150);
      const pb = p.getBoundingClientRect();
      const b = tr.getBoundingClientRect();
      const s = getComputedStyle(tr);
      const rel = e => { const c = e.getBoundingClientRect(); return { y: r(c.top - b.top), w: r(c.width), h: r(c.height), g: r(c.left - b.left), d: r(b.right - c.right) }; };
      // Rangées de texte : ordonnées des fragments de texte visibles, regroupées à 4 px près (le passage à la ligne d'un bloc entier,
      // comme l'auteur, ajoute une rangée sans ajouter de fragment).
      const textes = document.createTreeWalker(tr, NodeFilter.SHOW_TEXT);
      const hauts = [];
      for (let n = textes.nextNode(); n; n = textes.nextNode()) {
        if (!n.textContent.trim()) { continue; }
        const plage = document.createRange();
        plage.selectNodeContents(n);
        hauts.push(...[...plage.getClientRects()].filter(c => c.width > 0).map(c => c.top));
      }
      hauts.sort((x, y) => x - y);
      const lignesTexte = hauts.filter((y, i) => i === 0 || y - hauts[i - 1] > 4).length;
      const cible = (x, y) => {
        const e = document.elementFromPoint(x, y);
        if (!e) { return 'rien'; }
        const a = e.closest('a');
        return a ? `a ${a.getAttribute('href')}` : (e.closest('tr') === tr ? 'tr' : e.tagName);
      };
      const mx = (b.left + b.right) / 2;
      const my = (b.top + b.bottom) / 2;
      const fleches = [...tr.querySelectorAll('a.btn')].filter(vis);
      out.push({
        nom: (tr.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30),
        permanent: document.body.classList.contains('kr-subforum') && !tr.closest('#topics'),
        dans: b.left >= pb.left - 0.5 && b.right <= pb.right + 0.5, x: `[${r(b.left)}..${r(b.right)}] carte [${r(pb.left)}..${r(pb.right)}]`,
        ombre: s.boxShadow,
        tailles: fleches.map(e => [e.getBoundingClientRect().width, e.getBoundingClientRect().height]),
        largeur: r(b.width), hauteur: r(b.height), lignesTexte,
        boites: {
          icones: [...tr.querySelectorAll('i')].filter(vis).map(i => ({ nom: i.className, ...rel(i) })),
          fleches: fleches.map(e => ({ nom: 'a.btn', ...rel(e) }))
        },
        egal: {
          ligne: [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft, s.borderLeftWidth, s.borderLeftStyle, s.borderLeftColor,
            s.borderBottomWidth, s.borderBottomColor, s.backgroundColor, s.borderTopLeftRadius, s.borderBottomRightRadius, tr.className].join('|'),
          icones: [...tr.querySelectorAll('i')].map(i => `${i.className} ${vis(i) ? 'visible' : 'masquée'}`),
          pastilles: [...tr.querySelectorAll(pastille)].map(e => { const cs = getComputedStyle(e); const c = rel(e); return `${e.textContent.trim() || getComputedStyle(e, '::before').content} ${vis(e) ? [c.w, c.h].join(',') : 'masquée'} ${cs.backgroundColor} ${cs.color}`; }),
          cibles: [cible(mx, my), cible(mx, b.top + 3), cible(mx, b.bottom - 3), cible(b.right - 3, my), cible(b.left + 2, my)]
        }
      });
    }
  }
  window.scrollTo(0, 0);
  return { theme: document.documentElement.classList.contains('kr-theme-enabled'), mobile: document.body.classList.contains('mobile-mode'), lignes: out };
};
// Écart accepté et consigné (revue S21, n° 6, EXCEPTION_REVUE_S21_6) : sujets permanents du sous-forum sur deux lignes (titre entier puis
// statut et date ; retrait vertical de 8 px, compteurs masqués), hors comparaison à une base d'avant la revue ; contrôlés en absolu par
// sous-forum.mjs (l4-perm) et revue-s21.mjs. Retrait au recalage de COMMIT_AVANT au-delà de la revue.
const EXCEPTION_REVUE_S21_6 = AVANT_REVUE_S21(avant);
if (on('lignes')) {
  console.log('\n== lignes ==');
  if (EXCEPTION_REVUE_S21_6) { console.log('  info : base d\'avant la revue S21, sujets permanents du sous-forum hors comparaison (n° 6, EXCEPTION_REVUE_S21_6)'); }
  const cas = DE('forum').flatMap(nom => MOBILES.flatMap(width => VARIANTES.map(variante => ({ nom, width, variante }))));
  const res = await mapLimit(cas, async c => {
    const out = {};
    for (const [cle, script] of [['teste', userscript], ['base', avant]]) {
      const { context, page, erreurs } = await ouvrir({ ...c, script });
      out[cle] = { l: await page.evaluate(LIGNES, [PANNEAU_TICKET51, PASTILLE_TICKET52]), erreurs };
      await context.close();
    }
    return { c, ...out };
  });
  for (const { c, teste, base } of res) {
    const lab = `lignes ${c.nom} ${c.variante} ${c.width} px`;
    const t = teste.l.lignes;
    check(`${lab} : ${t.length} ligne(s) dans la carte, sans ombre`, () => {
      assert.ok(teste.l.theme && base.l.theme && teste.l.mobile, `kr-theme-enabled testé ${teste.l.theme} / base ${base.l.theme}, mobile ${teste.l.mobile}`);
      assert.ok(t.length > 0, 'aucune ligne');
      const ecarts = t.filter(l => !l.dans || l.ombre !== 'none').map(l => `« ${l.nom} » ${l.x} ombre ${l.ombre}`);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    check(`${lab} : hauteur, retraits, filets, fond, icônes d'état et cadenas, pastilles, flèches et cibles (centre, haut, bas, droite, filet) égaux au bundle de base${EXCEPTION_REVUE_S21_6 && t.some(l => l.permanent) ? ' (sujets permanents hors comparaison : revue S21, n° 6)' : ''}`, () => {
      assert.equal(t.length, base.l.lignes.length, 'nombre de lignes');
      const ecarts = [];
      t.forEach((l, k) => {
        const z = base.l.lignes[k];
        if (EXCEPTION_REVUE_S21_6 && l.permanent && z.permanent) { return; }
        for (const [cle, v] of Object.entries(l.egal)) {
          if (JSON.stringify(v) !== JSON.stringify(z.egal[cle])) { ecarts.push(`« ${l.nom} » ${cle} : testé ${JSON.stringify(v)} / base ${JSON.stringify(z.egal[cle])}`); }
        }
        // Même habillage : hauteur et ordonnées égales ; texte passé à la ligne : ligne plus haute, ordonnées non comparées.
        const habillage = l.lignesTexte !== z.lignesTexte;
        if (habillage ? !(l.lignesTexte > z.lignesTexte && l.hauteur > z.hauteur) : l.hauteur !== z.hauteur) {
          ecarts.push(`« ${l.nom} » hauteur : testé ${l.hauteur} (${l.lignesTexte} rangée(s) de texte) / base ${z.hauteur} (${z.lignesTexte})`);
        }
        const delta = r1(z.largeur - l.largeur);
        for (const cle of ['icones', 'fleches']) {
          const a = l.boites[cle];
          const bz = z.boites[cle];
          if (a.length !== bz.length) { ecarts.push(`« ${l.nom} » ${cle} : ${a.length} / base ${bz.length}`); continue; }
          a.forEach((e, i) => {
            const o = bz[i];
            const largeur = e.w === o.w || r1(o.w - e.w) === delta;
            // Ancré à gauche, à droite, ou centré dans un élément étiré (les deux écarts perdent la moitié du raccourcissement).
            const ancre = e.g === o.g || e.d === o.d || (pres(o.g - e.g, delta / 2, 0.15) && pres(o.d - e.d, delta / 2, 0.15));
            if (e.nom !== o.nom || e.h !== o.h || !largeur || !ancre || (!habillage && e.y !== o.y)) {
              ecarts.push(`« ${l.nom} » ${cle} ${e.nom} : testé ${JSON.stringify(e)} / base ${JSON.stringify(o)} (ligne raccourcie de ${delta} px)`);
            }
          });
        }
      });
      assert.deepEqual(ecarts.slice(0, 3), [], `${ecarts.length} écart(s) : ${ecarts.slice(0, 3).join(' ; ')}`);
    });
    check(`${lab} : flèches « dernier message » d'au moins 44 x 44`, () => {
      const petites = t.flatMap(l => l.tailles.filter(([w, h]) => w < 43.5 || h < 43.5).map(([w, h]) => `« ${l.nom} » ${w} x ${h}`));
      assert.deepEqual(petites, [], petites.join(' ; '));
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
}

// ---------- chevron natif du forum (repli et dépliage) ----------
if (on('chevron')) {
  console.log('\n== chevron ==');
  const CHEVRON = '.panel-heading > .pull-right.clickable';
  // Chevrons natifs attendus par page : 2 au sous-forum (permanents, sujets), 1 à l'index et à la racine-groupes (la racine n'en a pas,
  // Staff garde son chevron natif de 10 x 14, A6).
  const ATTENDUS = { 'sous-forum': 2, 'index-rp': 1, 'racine-groupes': 1 };
  // Repli natif des panneaux (main.js du site, recopié de sous-forum-debuter.html) : les fixtures de l'index et de la racine ne
  // l'embarquent pas ; il est posé après le chargement, sur ces pages seulement.
  const REPLI_NATIF = () => {
    window.jQuery(document).on('click', '.panel-heading span.clickable', function () {
      const $this = window.jQuery(this); const body = $this.parents('.panel').find('.panel-body');
      if (!$this.hasClass('panel-collapsed')) { body.hide(); $this.addClass('panel-collapsed'); } else { body.show(); $this.removeClass('panel-collapsed'); }
    });
  };
  const cas = Object.keys(ATTENDUS).flatMap(nom => MOBILES.flatMap(width => VARIANTES.map(variante => ({ nom, width, variante }))));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    if (c.nom !== 'sous-forum') { await page.evaluate(REPLI_NATIF); }
    const n = await page.evaluate(sel => document.querySelectorAll(sel).length, CHEVRON);
    const chevrons = [];
    for (let i = 0; i < n; i += 1) {
      const etat = () => page.evaluate(([sel, k]) => {
        const ch = document.querySelectorAll(sel)[k];
        const p = ch.closest('.panel');
        const b = e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, d: r.right, bas: r.bottom }; };
        const h = p.querySelector(':scope > .panel-heading');
        const corps = p.querySelector(':scope > .panel-body');
        return { p: b(p), h: b(h), ch: b(ch), titre: h.textContent.trim(), repete: h.classList.contains('kr-titre-repete'),
          masque: !h.getClientRects().length && !ch.getClientRects().length, corps: !!corps && corps.getClientRects().length > 0 };
      }, [CHEVRON, i]);
      await page.evaluate(([sel, k]) => { window.scrollTo(0, 0); window.scrollTo(0, document.querySelectorAll(sel)[k].getBoundingClientRect().top - 150); }, [CHEVRON, i]);
      await styleSettled(page, 'body');
      const depart = await etat();
      // Revue S21 (n° 13) : en-tête masqué parce qu'il répète le titre de la page, chevron compris : rien à toucher.
      if (depart.repete) { chevrons.push({ depart }); continue; }
      const taper = async () => {
        const e = await etat();
        const x = e.ch.x + e.ch.w / 2;
        const y = e.ch.y + e.ch.h / 2;
        const touche = await page.evaluate(([sel, k, px, py]) => document.elementFromPoint(px, py)?.closest('.clickable') === document.querySelectorAll(sel)[k], [CHEVRON, i, x, y]);
        if (touche) { await page.touchscreen.tap(x, y); }
        await styleSettled(page, 'body');
        return touche;
      };
      const touche1 = await taper();
      const replie = await etat();
      const touche2 = await taper();
      const deplie = await etat();
      chevrons.push({ depart, touche1, replie, touche2, deplie });
    }
    await context.close();
    return { c, chevrons, erreurs };
  });
  for (const { c, chevrons, erreurs } of res) {
    const lab = `chevron ${c.nom} ${c.variante} ${c.width} px`;
    check(`${lab} : ${ATTENDUS[c.nom]} chevron(s) natif(s)`, () => assert.equal(chevrons.length, ATTENDUS[c.nom]));
    for (const s of chevrons) {
      const a = s.depart;
      if (a.repete) {
        check(`${lab} « ${a.titre} » : en-tête qui répète le titre de la page masqué avec son chevron, corps affiché (revue S21, n° 13)`, () => {
          assert.ok(a.masque && a.corps, JSON.stringify({ masque: a.masque, corps: a.corps }));
        });
        continue;
      }
      check(`${lab} « ${a.titre} » : chevron de 44 x 44 dans l'en-tête et dans la carte`, () => {
        assert.ok(a.ch.w >= 43.5 && a.ch.h >= 43.5, `${a.ch.w} x ${a.ch.h}`);
        assert.ok(a.ch.x >= a.p.x - 0.5 && a.ch.d <= a.p.d + 0.5 && a.ch.y >= a.h.y - 0.5 && a.ch.bas <= a.h.bas + 0.5, `chevron [${a.ch.x}..${a.ch.d}, ${a.ch.y}..${a.ch.bas}], carte [${a.p.x}..${a.p.d}], en-tête [${a.h.y}..${a.h.bas}]`);
      });
      check(`${lab} « ${a.titre} » : 1er tap au centre (elementFromPoint) : carte réduite à l'en-tête`, () => {
        assert.ok(s.touche1, 'chevron couvert au point du tap');
        assert.ok(pres(s.replie.p.h, s.replie.h.h), `carte ${s.replie.p.h} px, en-tête ${s.replie.h.h} px`);
      });
      check(`${lab} « ${a.titre} » : 2e tap : hauteur d'origine (${Math.round(a.p.h * 10) / 10} px)`, () => {
        assert.ok(s.touche2, 'chevron couvert au point du tap');
        assert.ok(pres(s.deplie.p.h, a.p.h), `carte ${s.deplie.p.h} px`);
      });
    }
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

if (on('bureau')) {
  console.log('\n== bureau ==');
  await comparer('bureau', Object.keys(PAGES).filter(k => !['exclus', 'groupes', 'pastilles', 'etiquettes'].includes(PAGES[k].famille)).flatMap(nom => BUREAUX.flatMap(width => VARIANTES.map(variante => ({ nom, width, variante })))));
}

// ---------- bascule dans le même onglet ----------
// Section du module repliée avant chaque passage (tap) ; le rechargement de bascule est attendu comme dans typographie-formes.mjs.
async function parcours(script, variante, largeurs) {
  const { context, page, erreurs } = await ouvrir({ nom: 'bat', width: largeurs[0], variante, script, tactile: false });
  const etapes = [];
  for (let i = 0; i < largeurs.length; i += 1) {
    const width = largeurs[i];
    if (i > 0) {
      await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
      await page.setViewportSize({ width, height: 667 });
      await charge;
      await prete(page, `bascule ${variante} ${width} px`);
    }
    etapes.push({ width, m: width < 768 ? await page.evaluate(MESURE, [PANNEAU_TICKET51, TEXTE_TICKET51]) : null, r: await page.evaluate(RELEVE) });
    if (i < largeurs.length - 1) {
      await page.evaluate(() => { const h = document.querySelector('.building-section-header'); if (h) { h.click(); } });
      await styleSettled(page, 'body');
    }
  }
  await context.close();
  return { etapes, erreurs };
}
if (on('bascule')) {
  console.log('\n== bascule ==');
  const cas = VARIANTES.flatMap(variante => [[767, 768, 767], [768, 767, 768]].map(largeurs => ({ variante, largeurs })));
  const res = await mapLimit(cas, async c => ({ c, teste: await parcours(userscript, c.variante, c.largeurs), base: await parcours(avant, c.variante, c.largeurs) }));
  for (const { c, teste, base } of res) {
    const lab = `bascule ${c.variante} ${c.largeurs.join(' -> ')}`;
    teste.etapes.forEach((e, i) => {
      if (e.width < 768) {
        check(`${lab}, étape ${i + 1} (${e.width} px) : carte de section`, () => controlerCarte(e.m, 'jeu'));
      } else {
        check(`${lab}, étape ${i + 1} (${e.width} px) : égal au bundle de base (même parcours)`, () => {
          assert.ok(e.r.theme && base.etapes[i].r.theme, 'kr-theme-enabled absent');
          assert.equal(e.r.mobile, false, 'mode mobile à 768 px');
          const d = premierEcart(e.r.l, base.etapes[i].r.l);
          assert.equal(d, '', d);
        });
      }
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
}

// ---------- groupes du plateau (entrée 3) ----------
// Mesure des groupes (dans la page) : section, en-tête, titre, chevron, grille et cartes de personnages ; G : repères (lib/variantes.mjs).
const MESURE_GROUPES = ([Q, texte]) => {
  const boite = e => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height, d: b.right, bas: b.bottom }; };
  const coins = s => [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
  const C = window.__krContraste;
  return {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    vw: document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth,
    surface: C.sonde('var(--kr-bg-surface)'),
    primaire: C.sonde(texte),
    // Ombre de carte du thème calculée (revue S21, n° 3 : contour en clair, aucune en sombre), sondée sur un élément du corps.
    ombreCarte: (() => { const o = document.createElement('div'); o.style.boxShadow = 'var(--kr-card-shadow)'; document.body.appendChild(o); const v = getComputedStyle(o).boxShadow; o.remove(); return v; })(),
    sections: [...document.querySelectorAll(Q.section)].map(s => {
      const ss = getComputedStyle(s);
      const h = s.querySelector(Q.entete);
      const hs = getComputedStyle(h);
      const t = h.querySelector(Q.titre);
      const ts = getComputedStyle(t);
      const ic = h.querySelector(Q.chevron);
      const g = s.querySelector(Q.grille);
      // Lignes du titre : sommets distincts des boîtes de ses nœuds texte (au demi-pixel près).
      const plage = document.createRange();
      const sommets = new Set([...t.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).flatMap(n => {
        plage.selectNodeContents(n);
        return [...plage.getClientRects()].filter(b => b.width > 0).map(b => Math.round(b.top * 2));
      }));
      const textes = [...t.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
      plage.selectNodeContents(textes[0] || t);
      const debut = plage.getClientRects()[0];
      return {
        nom: t.textContent.trim().replace(/\s+/g, ' ').slice(0, 30), p: boite(s), fond: ss.backgroundColor, coins: coins(ss), ombre: ss.boxShadow,
        h: boite(h), aria: h.getAttribute('aria-expanded'), hfond: hs.backgroundColor, hmin: hs.minHeight,
        lignes: sommets.size, deborde: t.scrollWidth > t.clientWidth, debutTexte: debut ? debut.left : null,
        icones: [...t.querySelectorAll('img')].map(boite),
        filets: [hs.borderTopWidth, hs.borderRightWidth, hs.borderBottomWidth, hs.borderLeftWidth], retrait: [hs.paddingTop, hs.paddingRight, hs.paddingBottom, hs.paddingLeft],
        titre: { ...boite(t), taille: ts.fontSize, graisse: ts.fontWeight, couleur: ts.color, casse: ts.textTransform, espacement: ts.letterSpacing, rapport: C.texte(t) },
        chevron: ic ? { ...boite(ic), position: getComputedStyle(ic).position, transform: getComputedStyle(ic).transform } : null,
        grille: g ? { ...boite(g), replie: g.classList.contains('collapsed'), cible: getComputedStyle(g).pointerEvents } : null,
        cartes: [...s.querySelectorAll(Q.carte)].map(boite)
      };
    })
  };
};
// Ordre et contenu (dans la page) : groupes, enfants de l'en-tête, puis chaque carte (texte, structure, images) dans l'ordre DOM.
const CONTENU_GROUPES = Q => [...document.querySelectorAll(Q.section)].map(s => ({
  cls: s.className,
  entete: [...s.querySelector(Q.entete).children].map(e => `${e.tagName}.${[...e.classList].join('.')} ${e.textContent.trim().replace(/\s+/g, ' ')}`),
  cartes: [...s.querySelectorAll(Q.carte)].map(c => ({
    texte: c.textContent.trim().replace(/\s+/g, ' '),
    structure: [...c.querySelectorAll('*')].map(e => `${e.tagName}.${[...e.classList].join('.')}`).join(' '),
    images: [...c.querySelectorAll('img')].map(i => i.getAttribute('src'))
  }))
}));
// Groupe touché (dans la page) : en-tête i défilé à 200 px du haut (scrollTo), puis point visé ; null si l'élément attendu y est couvert.
async function viser(page, i, quoi) {
  await page.evaluate(([g, k]) => { const h = document.querySelectorAll(g.entete)[k]; window.scrollTo(0, 0); window.scrollTo(0, h.getBoundingClientRect().top - 200); }, [G, i]);
  await styleSettled(page, 'body');
  return page.evaluate(([g, k, q]) => {
    const h = document.querySelectorAll(g.entete)[k];
    const cible = q === 'bouton' ? h.querySelector(`${g.boutons} a.btn`) : h.querySelector(g.titre);
    if (!cible) { return null; }
    const b = cible.getBoundingClientRect();
    const x = b.left + b.width / 2;
    const y = b.top + b.height / 2;
    const e = document.elementFromPoint(x, y);
    const ok = q === 'bouton' ? e?.closest('a.btn') === cible : e?.closest(g.entete) === h && !e.closest(g.boutons);
    return ok ? { x, y } : null;
  }, [G, i, quoi]);
}
async function taperGroupe(page, i, quoi) {
  const pt = await viser(page, i, quoi);
  if (pt) { await page.touchscreen.tap(pt.x, pt.y); }
  await styleSettled(page, G.grille, { index: i });
  await styleSettled(page, G.entete, { index: i });
  return { touche: !!pt, m: await page.evaluate(MESURE_GROUPES, [G, TEXTE_TICKET51]) };
}
function controlerGroupes(m) {
  assert.ok(m.theme, 'kr-theme-enabled absent');
  assert.ok(m.mobile, 'mobile-mode absent');
  assert.equal(m.sections.length, 2, `${m.sections.length} groupe(s)`);
  assert.ok(m.sw <= m.vw, `débordement horizontal : ${m.sw} > ${m.vw}`);
  const ecarts = [];
  for (const c of m.sections) {
    const e = [];
    if (!pres(c.p.x, 8) || !pres(c.p.w, m.vw - 16)) { e.push(`boîte x ${r1(c.p.x)} largeur ${r1(c.p.w)} (vw ${m.vw})`); }
    if (c.fond !== m.surface) { e.push(`fond ${c.fond} ≠ ${m.surface}`); }
    if (c.coins.some(v => v !== '8px')) { e.push(`rayons ${c.coins.join(' ')}`); }
    if (c.ombre !== m.ombreCarte) { e.push(`ombre ${c.ombre} ≠ ${m.ombreCarte}`); }
    if (!pres(c.h.y, c.p.y) || !pres(c.h.x, c.p.x) || !pres(c.h.w, c.p.w)) { e.push(`en-tête décalé [${r1(c.h.x)},${r1(c.h.y)},${r1(c.h.w)}]`); }
    if (c.h.h < 47.5) { e.push(`en-tête ${r1(c.h.h)} px`); }
    if (!(parseFloat(c.hmin) >= 48)) { e.push(`min-height de l'en-tête ${c.hmin}`); }
    if (c.retrait.join(' ') !== '0px 16px 0px 16px') { e.push(`retrait ${c.retrait.join(' ')}`); }
    if (c.filets.some(v => v !== '0px')) { e.push(`filets ${c.filets.join(' ')}`); }
    if (c.hfond !== m.surface) { e.push(`fond de l'en-tête ${c.hfond} ≠ ${m.surface}`); }
    const t = c.titre;
    if (t.taille !== '17px' || t.graisse !== '700' || t.couleur !== m.primaire || t.casse !== 'none' || t.espacement !== 'normal') {
      e.push(`titre ${t.taille}/${t.graisse} ${t.couleur} ${t.casse} ${t.espacement} (attendu 17px/700 ${m.primaire} none normal)`);
    }
    if (t.d > c.h.d - 16 + 0.5 || t.y < c.h.y - 0.5 || t.bas > c.h.bas + 0.5) { e.push(`titre hors de l'en-tête [${r1(t.x)}..${r1(t.d)}, ${r1(t.y)}..${r1(t.bas)}]`); }
    // Chevron de 0 x 0 sans la police FA (P5) : son bord droit et son centre vertical sont mesurés.
    if (!c.chevron) { e.push('chevron absent'); } else if (c.chevron.position !== 'static' || !pres(c.h.d - c.chevron.d, 16) || c.chevron.y < c.h.y - 0.5 || c.chevron.bas > c.h.bas + 0.5) {
      e.push(`chevron ${c.chevron.position} à ${r1(c.h.d - c.chevron.d)} px du bord, [${r1(c.chevron.y)},${r1(c.chevron.bas)}] hors de [${r1(c.h.y)},${r1(c.h.bas)}]`);
    }
    if (!c.grille || !c.cartes.length) { e.push('grille ou cartes absentes'); } else if (!c.grille.replie) {
      const g = Math.min(...c.cartes.map(k => k.x));
      const d = Math.max(...c.cartes.map(k => k.d));
      const haut = Math.min(...c.cartes.map(k => k.y));
      const bas = Math.max(...c.cartes.map(k => k.bas));
      if (!pres(g - c.p.x, 8) || !pres(c.p.d - d, 8) || !pres(haut - c.h.bas, 8) || !pres(c.p.bas - bas, 8)) {
        e.push(`cartes à ${r1(g - c.p.x)} / ${r1(c.p.d - d)} / ${r1(haut - c.h.bas)} / ${r1(c.p.bas - bas)} px des bords (gauche, droite, haut, bas)`);
      }
    }
    if (e.length) { ecarts.push(`« ${c.nom} » : ${e.join(', ')}`); }
  }
  assert.deepEqual(ecarts, [], ecarts.join(' ; '));
}
// Ouvert : grille dépliée, aria-expanded true, carte plus haute que l'en-tête ; fermé : grille repliée de 0 px sans cible, carte réduite à
// l'en-tête, cartes de personnages toujours dans le DOM.
function etatGroupe(c, ouvert) {
  if (ouvert) {
    assert.ok(!c.grille.replie && c.aria === 'true' && c.grille.h > 0 && c.p.h > c.h.h + 0.5, `replié ${c.grille.replie}, aria ${c.aria}, grille ${r1(c.grille.h)} px, carte ${r1(c.p.h)} px`);
  } else {
    assert.ok(c.grille.replie && c.aria === 'false', `replié ${c.grille.replie}, aria ${c.aria}`);
    assert.ok(pres(c.grille.h, 0) && c.grille.cible === 'none', `grille ${r1(c.grille.h)} px, pointer-events ${c.grille.cible}`);
    assert.ok(pres(c.p.h, c.h.h), `carte ${r1(c.p.h)} px, en-tête ${r1(c.h.h)} px`);
    assert.ok(c.cartes.length > 0, 'cartes retirées du DOM');
  }
}
if (on('groupes')) {
  console.log('\n== groupes ==');
  const rs = await regles();
  check('statique : règles des groupes (dashboard-section, en-têtes, titre, chevron, grille) sans !important hors grille, mobiles dans le média mobile, sans rayon littéral', () => {
    const l = rs.filter(r => /dashboard-(?:section|group-title|cards-grid)/.test(r.sel) && !/dashboard-card[^s]|dashboard-group-buttons|\.badge/.test(r.sel));
    const ecarts = l.flatMap(r => {
      const e = [];
      const mobile = /body\.mobile-mode|accordion/.test(r.sel);
      if (mobile && !MOBILE.includes(r.media)) { e.push(`${r.media || 'global'} ${r.sel}`); }
      for (const [p, [v, prio]] of Object.entries(r.d)) {
        if (prio && MOBILE.includes(r.media) && !(/dashboard-cards-grid$/.test(r.sel) && ['grid-template-columns', 'gap', 'row-gap', 'column-gap'].includes(p))) { e.push(`${r.sel} { ${p}: ${v} !important }`); }
        if (/radius/.test(p) && /\d+px/.test(v) && !/var\(/.test(v)) { e.push(`${r.sel} { ${p}: ${v} }`); }
      }
      return e;
    });
    assert.ok(l.length >= 8, `${l.length} règle(s)`);
    assert.deepEqual(ecarts, [], ecarts.join(' ; '));
  });
  // Carte, état initial, accordéon, boutons de groupe, ordre et contenu.
  const cas = MOBILES.flatMap(width => VARIANTES.map(variante => ({ nom: 'groupes', width, variante })));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const m = await page.evaluate(MESURE_GROUPES, [G, TEXTE_TICKET51]);
    const contenu = await page.evaluate(CONTENU_GROUPES, G);
    const taps = [];
    for (let i = 0; i < m.sections.length; i += 1) {
      const t1 = await taperGroupe(page, i, 'titre');
      const t2 = await taperGroupe(page, i, 'titre');
      const b = await taperGroupe(page, i, 'bouton');
      taps.push({ t1, t2, b });
    }
    await context.close();
    const base = await ouvrir({ ...c, script: avant });
    const contenuBase = await base.page.evaluate(CONTENU_GROUPES, G);
    const themeBase = await base.page.evaluate(() => document.documentElement.classList.contains('kr-theme-enabled'));
    await base.context.close();
    return { c, m, contenu, contenuBase, themeBase, taps, erreurs };
  });
  for (const { c, m, contenu, contenuBase, themeBase, taps, erreurs } of res) {
    const lab = `groupes ${c.variante} ${c.width} px`;
    check(`${lab} : 2 groupes en carte (8 px des bords, fond surface, rayons 8 px, ombre de carte du thème, revue S21 n° 3 ; en-tête ≥ 48 px, retrait 0 16 px, fond surface, sans filet ; titre 17 px 700 text-primary sans capitales ; chevron dans le flux à 16 px du bord droit ; cartes à 8 px des bords), sans débordement`, () => controlerGroupes(m));
    check(`${lab} : « mon groupe » ouvert, second groupe réduit à son en-tête (48 px au moins ; grille de 0 px sans cible, cartes dans le DOM)`, () => {
      assert.ok(/dashboard-section-mygroup/.test(contenu[0].cls), contenu[0].cls);
      etatGroupe(m.sections[0], true);
      etatGroupe(m.sections[1], false);
      assert.ok(m.sections[1].h.h >= 47.5, `second groupe ${r1(m.sections[1].p.h)} px`);
    });
    check(`${lab} : titre long sur un en-tête plus haut que 48 px au besoin, dans la carte (titres ${m.sections.map(s => `${r1(s.h.h)} px`).join(', ')})`, () => {
      assert.ok(m.sections[1].nom.length > 25, m.sections[1].nom);
      assert.ok(m.sections.every(s => s.titre.bas <= s.h.bas + 0.5 && s.h.h >= 47.5), 'titre hors de l\'en-tête');
      assert.ok(m.sections.every(s => !s.deborde), `titre tronqué (scrollWidth > clientWidth) : ${m.sections.filter(s => s.deborde).map(s => s.nom).join(', ')}`);
      assert.ok(m.sw <= m.vw, `débordement ${m.sw}`);
      // À 375 px, le titre long passe à la ligne et l'en-tête grandit au-delà de 48 px.
      if (c.width === 375) {
        const l = m.sections[1];
        assert.ok(l.lignes > 1 && l.h.h > 48.5, `titre long sur ${l.lignes} ligne(s), en-tête ${r1(l.h.h)} px`);
      }
    });
    check(`${lab} : en-tête d'un groupe au titre d'une ligne à 48 px (min-height ${m.sections[0].hmin})`, () => {
      const c0 = m.sections[0];
      assert.equal(c0.lignes, 1, `${c0.lignes} ligne(s)`);
      assert.ok(pres(c0.h.h, 48), `en-tête ${r1(c0.h.h)} px`);
    });
    check(`${lab} : icône native (img) du titre à gauche du texte, dans l'en-tête`, () => {
      const c0 = m.sections[0];
      assert.equal(c0.icones.length, 1, `${c0.icones.length} icône(s)`);
      const ic = c0.icones[0];
      assert.ok(ic.w > 0 && ic.h > 0, `icône ${r1(ic.w)} x ${r1(ic.h)}`);
      assert.ok(c0.debutTexte !== null && ic.d <= c0.debutTexte + 0.5, `icône [${r1(ic.x)}..${r1(ic.d)}], texte à ${r1(c0.debutTexte)}`);
      assert.ok(ic.x >= c0.h.x + 16 - 0.5 && ic.y >= c0.h.y - 0.5 && ic.bas <= c0.h.bas + 0.5, `icône hors de l'en-tête [${r1(ic.x)},${r1(ic.y)},${r1(ic.bas)}]`);
    });
    taps.forEach(({ t1, t2, b }, i) => {
      const depart = i === 0;
      check(`${lab} groupe ${i + 1} : 1er tap sur l'en-tête (scrollTo, elementFromPoint) : ${depart ? 'replié' : 'déplié'}, aria-expanded ${!depart}, chevron ${depart ? '0' : '-180'}°`, () => {
        assert.ok(t1.touche, 'en-tête couvert au point du tap');
        etatGroupe(t1.m.sections[i], !depart);
        const tr = t1.m.sections[i].chevron.transform;
        assert.ok(depart ? /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/.test(tr) : /^matrix\(-1, /.test(tr), `transform ${tr}`);
      });
      check(`${lab} groupe ${i + 1} : 2e tap : état d'origine, hauteur d'origine (${r1(m.sections[i].p.h)} px), sans débordement`, () => {
        assert.ok(t2.touche, 'en-tête couvert au point du tap');
        etatGroupe(t2.m.sections[i], depart);
        assert.ok(pres(t2.m.sections[i].p.h, m.sections[i].p.h), `carte ${r1(t2.m.sections[i].p.h)} px`);
        assert.ok(t2.m.sw <= t2.m.vw, `débordement ${t2.m.sw}`);
      });
      check(`${lab} groupe ${i + 1} : tap sur un bouton de groupe (elementFromPoint) sans effet sur l'état`, () => {
        assert.ok(b.touche, 'bouton couvert au point du tap');
        etatGroupe(b.m.sections[i], depart);
      });
    });
    check(`${lab} : ordre des groupes, en-têtes et contenu des cartes (niveau, PNJ, PV, statut) égaux au bundle de base (${COMMIT_AVANT})`, () => {
      assert.ok(themeBase, 'kr-theme-enabled absent (base)');
      assert.deepEqual(contenu, contenuBase);
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
  // Mini-profil plié et déplié, égal à la base (plateau-minimal et plateau-qualite-usage, 375 et 700 px).
  const miniProfil = async (c, script) => {
    const { context, page, erreurs } = await ouvrir({ ...c, script });
    const etat = async cls => {
      await waitState(page, ([sel, k]) => { const mp = document.querySelector(sel); return !!mp && mp.classList.contains(k) && mp.getAnimations({ subtree: true }).every(a => a.playState !== 'running'); }, [G.miniProfil, cls], { maxMs: 3000 });
      await styleSettled(page, G.miniProfil);
      return { ...(await page.evaluate(RELEVE, [G.miniProfil, ['', '*'], C13.sousArbres])), caracs: await page.evaluate(RELEVER_CARACTERISTIQUES_BACKLOG13, C13) };
    };
    const plie = await etat('collapsed');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.tap(G.miniProfilEntete);
    const deplie = await etat('expanded');
    await context.close();
    return { plie, deplie, erreurs };
  };
  const casMp = ['plateau-minimal', 'groupes'].flatMap(nom => [375, 700].flatMap(width => VARIANTES.map(variante => ({ nom, width, variante }))));
  // Écart accepté et consigné (revue S21, n° 4 et 14, EXCEPTION_REVUE_S21_14) : mini-profil resserré (retrait vertical de 8 px, nom et argent
  // en grille autour du bouton de gestion), roue et horloge en icônes Font Awesome (un élément de plus : l'icône de l'horloge), jauges
  // compactes de 8 px en 13 px, masquées une fois déplié. Le DOM change : aucune feuille miroir ne rend la base comparable. Comparaison à une
  // base d'avant la revue différée ; contrôles absolus dans revue-s21.mjs (mini-profil, haut) et typographie-formes.mjs (echelle) ; les
  // caractéristiques (backlog 13) restent contrôlées ici. Retrait au recalage de COMMIT_AVANT au-delà de la revue.
  const EXCEPTION_REVUE_S21_14 = AVANT_REVUE_S21(avant);
  if (EXCEPTION_REVUE_S21_14) { console.log('  info : base d\'avant la revue S21, mini-profil comparé à la base différé (n° 4 et 14, EXCEPTION_REVUE_S21_14)'); }
  const resMp = await mapLimit(casMp, async c => ({ c, teste: await miniProfil(c, userscript), base: await miniProfil(c, avant) }));
  for (const { c, teste, base } of resMp) {
    for (const k of ['plie', 'deplie']) {
      const etat = k === 'plie' ? 'plié' : 'déplié';
      // Caractéristiques (backlog 13) : fond et texte égaux à leur compétence de référence, et non plus à la base (palette du ticket 3.5).
      check(`groupes mini-profil ${c.nom} ${c.variante} ${c.width} px ${etat} : ${EXCEPTION_REVUE_S21_14 ? `présent (${teste[k].l.length} éléments ; comparaison à la base différée, revue S21, n° 14)` : `égal au bundle de base (${teste[k].l.length} éléments, fond et texte des caractéristiques à part)`}`, () => {
        assert.ok(teste[k].theme && base[k].theme, `kr-theme-enabled testé ${teste[k].theme} / base ${base[k].theme}`);
        assert.ok(teste[k].mobile, 'mobile-mode absent');
        assert.ok(teste[k].l.length > 1, 'mini-profil absent');
        if (EXCEPTION_REVUE_S21_14) { return; }
        const d = premierEcart(teste[k].l, base[k].l);
        assert.equal(d, '', d);
      });
      if (teste[k].caracs.length) {
        check(`groupes mini-profil ${c.nom} ${c.variante} ${c.width} px ${etat} : caractéristiques au fond, bordures et texte de la compétence de la page, pastille aux jetons de son niveau (backlog 13)`, () => {
          const e = ecartsCaracteristiquesBacklog13(teste[k].caracs);
          assert.deepEqual(e, [], `${e.length} écart(s) : ${e.slice(0, 6).join(' ; ')}`);
        });
      }
    }
    check(`groupes mini-profil ${c.nom} ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
  // Bureau : groupes égaux à la base, filet gauche de 4 px compris.
  const SELS_GROUPES = [G.section, `${G.section} *`];
  const resBureau = await mapLimit(BUREAUX.flatMap(width => VARIANTES.map(variante => ({ nom: 'groupes', width, variante }))), async c => {
    const out = {};
    for (const [cle, script] of [['teste', userscript], ['base', avant]]) {
      const { context, page, erreurs } = await ouvrir({ ...c, script });
      out[cle] = { r: await page.evaluate(RELEVE, ['html', SELS_GROUPES]), erreurs };
      await context.close();
    }
    return { c, ...out };
  });
  for (const { c, teste, base } of resBureau) {
    check(`groupes bureau ${c.variante} ${c.width} px : groupes égaux au bundle de base (${teste.r.l.length} éléments)`, () => {
      assert.ok(teste.r.theme && base.r.theme, `kr-theme-enabled testé ${teste.r.theme} / base ${base.r.theme}`);
      assert.equal(teste.r.mobile, false, 'mode mobile');
      assert.ok(teste.r.l.length > 0, 'aucun élément');
      const d = premierEcart(teste.r.l, base.r.l);
      assert.equal(d, '', d);
      assert.equal(teste.r.sw, base.r.sw, 'largeur défilable');
    });
    check(`groupes bureau ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
  // P4 : à 767 px sans mobile-mode (média mobile valide), groupes égaux à la base : ni carte partielle, ni filet ou fond retiré seuls.
  const resP4 = await mapLimit(VARIANTES.map(variante => ({ nom: 'groupes-nu', width: 767, variante })), async c => {
    const out = {};
    for (const [cle, script] of [['teste', userscript], ['base', avant]]) {
      const { context, page, erreurs } = await ouvrir({ ...c, script });
      const media = await page.evaluate(() => window.matchMedia('(max-width: 767px)').matches);
      out[cle] = { r: await page.evaluate(RELEVE, ['html', SELS_GROUPES]), media, erreurs };
      await context.close();
    }
    return { c, ...out };
  });
  for (const { c, teste, base } of resP4) {
    check(`groupes sans mobile-mode ${c.variante} 767 px (média mobile valide) : groupes égaux au bundle de base (${teste.r.l.length} éléments)`, () => {
      assert.ok(teste.r.theme && base.r.theme, `kr-theme-enabled testé ${teste.r.theme} / base ${base.r.theme}`);
      assert.equal(teste.r.mobile, false, 'mobile-mode présent : état P4 non reproduit');
      assert.ok(teste.media, 'média (max-width: 767px) non valide');
      assert.ok(teste.r.l.length > 0, 'aucun élément');
      const d = premierEcart(teste.r.l, base.r.l);
      assert.equal(d, '', d);
    });
    check(`groupes sans mobile-mode ${c.variante} 767 px : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
  // Bascule dans le même onglet : carte à 767, base (même parcours) à 768.
  const parcoursGroupes = async (script, variante, largeurs) => {
    const { context, page, erreurs } = await ouvrir({ nom: 'groupes', width: largeurs[0], variante, script, tactile: false });
    const etapes = [];
    for (let i = 0; i < largeurs.length; i += 1) {
      const width = largeurs[i];
      if (i > 0) {
        await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
        const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
        await page.setViewportSize({ width, height: 667 });
        await charge;
        await prete(page, `bascule groupes ${variante} ${width} px`);
      }
      etapes.push({ width, m: width < 768 ? await page.evaluate(MESURE_GROUPES, [G, TEXTE_TICKET51]) : null, r: await page.evaluate(RELEVE, ['html', SELS_GROUPES]) });
    }
    await context.close();
    return { etapes, erreurs };
  };
  const casB = VARIANTES.flatMap(variante => [[767, 768, 767], [768, 767, 768]].map(largeurs => ({ variante, largeurs })));
  const resB = await mapLimit(casB, async c => ({ c, teste: await parcoursGroupes(userscript, c.variante, c.largeurs), base: await parcoursGroupes(avant, c.variante, c.largeurs) }));
  for (const { c, teste, base } of resB) {
    const lab = `groupes bascule ${c.variante} ${c.largeurs.join(' -> ')}`;
    teste.etapes.forEach((e, i) => {
      if (e.width < 768) {
        check(`${lab}, étape ${i + 1} (${e.width} px) : groupes en carte, « mon groupe » ouvert, second groupe fermé`, () => {
          controlerGroupes(e.m);
          etatGroupe(e.m.sections[0], true);
          etatGroupe(e.m.sections[1], false);
        });
      } else {
        check(`${lab}, étape ${i + 1} (${e.width} px) : égal au bundle de base (même parcours), aucun état replié`, () => {
          assert.ok(e.r.theme && base.etapes[i].r.theme, 'kr-theme-enabled absent');
          assert.equal(e.r.mobile, false, 'mode mobile à 768 px');
          const d = premierEcart(e.r.l, base.etapes[i].r.l);
          assert.equal(d, '', d);
          assert.ok(!e.r.l.some(x => /collapsed/.test(x.split(' ')[1])), 'grille repliée à 768 px');
        });
      }
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
}

// ---------- pastilles d'état de la barre (entrée 4) ----------
// Mesure des pastilles (dans la page) : cloche et enveloppe des clones mobiles puis de la barre d'origine ; P : repères (lib/variantes.mjs).
// Aucune pastille n'est tapée ni cliquée (la cloche ouvre /report sur le site) : la visibilité se lit par elementFromPoint au centre.
const MESURE_PASTILLES = R => {
  const C = window.__krContraste;
  const r = v => Math.round(v * 10) / 10;
  const pastilles = (cle, sel) => [R.clones, R.barre].flatMap(conteneur => [...document.querySelectorAll(`${conteneur} ${sel}`)].map(e => {
    const s = getComputedStyle(e);
    const b = e.getBoundingClientRect();
    const a = e.closest('a');
    const ab = a.getBoundingClientRect();
    const ic = a.querySelector('i.fa');
    const boite = b.width > 0 && b.height > 0;
    const hit = boite ? document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2) : null;
    return {
      cle, porteur: conteneur === R.clones ? 'clone' : 'original', texte: e.textContent.trim(), display: s.display, boite,
      visible: !!hit && (hit === e || e.contains(hit)), cible: hit ? `${hit.tagName.toLowerCase()}${hit.id ? `#${hit.id}` : ''}${[...hit.classList].map(x => `.${x}`).join('')}` : 'aucune', fond: s.backgroundColor, couleur: s.color, taille: s.fontSize, graisse: s.fontWeight,
      rayons: [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius],
      bordures: [s.borderTopWidth, s.borderRightWidth, s.borderBottomWidth, s.borderLeftWidth], rapport: boite ? C.texte(e) : null,
      geo: `${conteneur} ${cle} ${s.display} [${[b.left, b.top, b.width, b.height].map(r)}] ${s.position} ${s.top} ${s.right} ${s.minWidth} ${s.height} ${s.padding} ${s.lineHeight} ${s.margin} ${s.verticalAlign} ; lien [${[ab.left, ab.top, ab.width, ab.height].map(r)}]`,
      animation: ic ? getComputedStyle(ic).animationName : null
    };
  }));
  const ref = document.querySelector(R.reference);
  return {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    unread: C.sonde(R.fond), surface: C.sonde(R.texte),
    pastilles: [...pastilles('cloche', R.cloche), ...pastilles('enveloppe', R.enveloppe)],
    hors: R.horsListe.map(sel => {
      const e = document.querySelector(sel);
      if (!e) { return `${sel} absent`; }
      const s = getComputedStyle(e);
      return `${sel} ${s.display} ${s.backgroundColor} ${s.color} ${s.borderTopColor} ${s.borderTopWidth} ${s.fontSize} ${s.fontWeight} ${s.borderTopLeftRadius} ${s.padding}`;
    }),
    reference: ref ? { fond: getComputedStyle(ref).backgroundColor, couleur: getComputedStyle(ref).color } : null
  };
};
// Porteur attendu de la pastille visible : clone sous 768 px, original au-delà ; l'original reste dans le menu replié sous 768 px.
// De 768 à 991 px (PLT-04, bureau compact), la barre est un menu repliable sans clone : menu fermé, aucune pastille visible (comme la
// base) ; menu ouvert (bouton de la barre), l'original est visible.
const COMPACT = width => width >= 768 && width < 992;
function controlerPorteur(m, width, ouvert = false) {
  assert.ok(m.theme, 'kr-theme-enabled absent');
  assert.equal(m.mobile, width < 768, `mobile-mode ${m.mobile}`);
  const porteur = width < 768 ? 'clone' : (COMPACT(width) && !ouvert ? null : 'original');
  const ecarts = ['cloche', 'enveloppe'].flatMap(cle => {
    const l = m.pastilles.filter(p => p.cle === cle);
    const vis = l.filter(p => p.visible);
    return [
      ...((porteur === null ? vis.length === 0 && l.some(p => p.porteur === 'original') : vis.length === 1 && vis[0].porteur === porteur) ? [] : [`${cle} : visible ${vis.map(p => p.porteur).join(', ') || 'nulle part'} (attendu ${porteur || 'aucune, menu replié'} ; au centre : ${l.map(p => `${p.porteur} ${p.cible}`).join(', ')})`]),
      ...(width < 768 && !l.some(p => p.porteur === 'clone') ? [`${cle} : aucun clone`] : []),
      ...l.filter(p => !p.texte).map(p => `${cle} ${p.porteur} vide`)
    ];
  });
  assert.deepEqual(ecarts, [], ecarts.join(' ; '));
}
// Pastille d'état sur toutes les pastilles remplies (originaux et clones) : couleurs (fond non lu, texte surface) ou forme (12 px 700, rayon
// plein, bordures de largeur 0).
function controlerEtat(m, quoi) {
  const ecarts = m.pastilles.filter(p => p.texte).flatMap(p => {
    const e = [];
    if (quoi === 'couleurs') {
      if (p.fond !== m.unread) { e.push(`fond ${p.fond} ≠ ${m.unread}`); }
      if (p.couleur !== m.surface) { e.push(`texte ${p.couleur} ≠ ${m.surface}`); }
    } else {
      if (p.taille !== '12px' || p.graisse !== '700') { e.push(`${p.taille}/${p.graisse}`); }
      if (p.rayons.some(v => v !== '9999px')) { e.push(`rayons ${p.rayons.join(' ')}`); }
      if (p.bordures.some(v => v !== '0px')) { e.push(`bordures ${p.bordures.join(' ')}`); }
    }
    return e.length ? [`${p.cle} ${p.porteur} « ${p.texte} » : ${e.join(', ')}`] : [];
  });
  assert.ok(m.pastilles.some(p => p.texte), 'aucune pastille remplie');
  assert.deepEqual(ecarts, [], ecarts.join(' ; '));
}
if (on('pastilles')) {
  console.log('\n== pastilles ==');
  const rs = await regles();
  check('statique : règle réécrite de la cloche et de l\'enveloppe dans le média combiné (deux supports), fond non lu et texte surface à la priorité d\'origine, sans couleur de bordure ni couleur littérale', () => {
    // Entrée 5 : les compteurs de contact du kramail sont ajoutés en tête de la règle (P14) ; elle se repère à son début d'origine.
    const l = rs.filter(r => r.sel.includes(P.regle));
    assert.equal(l.length, 1, `${l.length} règle(s)`);
    const [r] = l;
    assert.ok(['(max-width: 767px), (min-width: 768px)', '(width <= 767px), (width >= 768px)'].includes(r.media), `média « ${r.media || 'global'} »`);
    assert.deepEqual(r.d, { 'background-color': [P.fond, 'important'], color: [P.texte, 'important'] }, JSON.stringify(r.d));
    assert.ok(!Object.values(r.d).some(([v]) => /#[0-9a-f]{3,8}\b|rgb|hsl/i.test(v)), 'couleur littérale');
  });
  const LARGEURS = [...MOBILES, ...BUREAUX];
  // Bureau compact (768 à 991 px) : menu ouvert ou refermé par le bouton de la barre (jamais la cloche ni un lien de jeu).
  const basculerMenu = async (page, ouvert) => {
    await page.click('nav.navbar .navbar-toggle');
    await page.waitForFunction(o => !!document.querySelector('#navbar.in') === o && !document.querySelector('.collapsing'), ouvert);
  };
  // Bureau compact : seconde mesure, menu ouvert.
  const releverPastilles = async (c, script) => {
    const { context, page, erreurs } = await ouvrir({ ...c, script });
    const m = await page.evaluate(MESURE_PASTILLES, P);
    let o = null;
    if (COMPACT(c.width) && c.nom === 'barre') {
      await basculerMenu(page, true);
      o = await page.evaluate(MESURE_PASTILLES, P);
    }
    await context.close();
    return { m, o, erreurs };
  };
  // Pastilles remplies : porteur, pastille d'état, géométrie, animation et hors liste égaux à la base.
  const cas = LARGEURS.flatMap(width => VARIANTES.map(variante => ({ nom: 'barre', width, variante })));
  const res = await mapLimit(cas, async c => ({ c, teste: await releverPastilles(c, userscript), base: await releverPastilles(c, avant) }));
  for (const { c, teste: { m, o, erreurs }, base: { m: b, o: bo } } of res) {
    const lab = `pastilles ${c.variante} ${c.width} px`;
    if (COMPACT(c.width)) {
      check(`${lab} : bureau compact, menu fermé : cloche et enveloppe dans le menu replié, aucune visible, sans clone (comme la base)`, () => controlerPorteur(m, c.width));
      check(`${lab} : bureau compact, menu ouvert : cloche et enveloppe visibles (elementFromPoint), portées par l'original, en pastille d'état`, () => {
        controlerPorteur(o, c.width, true);
        controlerEtat(o, 'couleurs');
        controlerEtat(o, 'forme');
      });
    } else {
      check(`${lab} : cloche et enveloppe visibles (elementFromPoint), portées par ${c.width < 768 ? 'le clone, original dans le menu replié' : 'l\'original'}`, () => controlerPorteur(m, c.width));
    }
    check(`${lab} : pastilles remplies (${m.pastilles.filter(p => p.texte).length}, originaux et clones) en fond non lu (${m.unread}), texte surface (${m.surface})`, () => controlerEtat(m, 'couleurs'));
    check(`${lab} : pastilles remplies en 12 px 700, rayon plein, bordures de largeur 0`, () => controlerEtat(m, 'forme'));
    check(`${lab} : géométrie des pastilles et des liens égale au bundle de base (${COMMIT_AVANT})`, () => {
      assert.ok(b.theme, 'kr-theme-enabled absent (base)');
      const geo = x => [...x.m.pastilles, ...(x.o ? x.o.pastilles : [])].map(p => p.geo);
      const d = premierEcart(geo({ m, o }), geo({ m: b, o: bo }));
      assert.equal(d, '', d);
    });
    check(`${lab} : animation kr-bell-swing sur la cloche et l'enveloppe visibles, animations égales à la base`, () => {
      const vis = (o || m).pastilles.filter(p => p.visible);
      assert.ok(vis.length === 2 && vis.every(p => p.animation === 'kr-bell-swing'), vis.map(p => `${p.cle} ${p.animation}`).join(', ') || 'aucune pastille visible');
      assert.deepEqual(m.pastilles.map(p => p.animation), b.pastilles.map(p => p.animation));
    });
    check(`${lab} : emplois hors liste (pastille de panneau) égaux à la base`, () => {
      assert.ok(m.hors.every(x => !/absent$/.test(x)), m.hors.join(' ; '));
      assert.deepEqual(m.hors, b.hors);
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
  // Pastilles vides (réception) : invisibles, originaux et clones, icônes sans animation.
  const resV = await mapLimit(LARGEURS.flatMap(width => VARIANTES.map(variante => ({ nom: 'reception', width, variante }))), async c => ({ c, ...await releverPastilles(c, userscript) }));
  for (const { c, m, erreurs } of resV) {
    const lab = `pastilles vides ${c.variante} ${c.width} px`;
    check(`${lab} : cloche et enveloppe vides invisibles (display none ou boîte nulle), originaux et clones, icônes sans animation`, () => {
      assert.ok(m.theme, 'kr-theme-enabled absent');
      const l = m.pastilles;
      assert.equal(l.filter(p => p.porteur === 'clone').length, c.width < 768 ? 2 : 0, 'clones');
      assert.equal(l.filter(p => p.porteur === 'original').length, 2, 'originaux');
      const ecarts = l.filter(p => p.texte || (p.display !== 'none' && p.boite) || p.visible || p.animation !== 'none').map(p => `${p.cle} ${p.porteur} « ${p.texte} » ${p.display} boîte ${p.boite} animation ${p.animation}`);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
  // Thèmes : 16 variantes, fond et texte égaux aux jetons calculés et à « NOUVEAU MESSAGE » du sous-forum, contraste ≥ 4,5:1.
  const LITTERAUX = { kraland: 'rgb(196, 30, 58)', 'empire-brun': 'rgb(138, 90, 0)' };
  const resT = await mapLimit([375, 1280, 1440, 1920].flatMap(width => TOUTES.map(variante => ({ width, variante }))), async c => ({
    c, ...await releverPastilles({ ...c, nom: 'barre' }, userscript), ref: (await releverPastilles({ ...c, nom: 'sous-forum' }, userscript)).m.reference
  }));
  for (const { c, m, erreurs, ref } of resT) {
    const lab = `pastilles ${c.variante} ${c.width} px`;
    check(`${lab} : fond et texte des pastilles visibles égaux aux jetons et à « NOUVEAU MESSAGE » du sous-forum${LITTERAUX[c.variante] ? ` (${LITTERAUX[c.variante]})` : ''}, ≥ 4,5:1`, () => {
      assert.ok(m.theme, 'kr-theme-enabled absent');
      assert.ok(ref, '« NOUVEAU MESSAGE » absent du sous-forum');
      const vis = m.pastilles.filter(p => p.visible);
      assert.equal(vis.length, 2, 'pastilles visibles');
      if (LITTERAUX[c.variante]) { assert.equal(m.unread, LITTERAUX[c.variante], 'jeton du non lu'); }
      const ecarts = vis.flatMap(p => [
        ...(p.fond !== m.unread || p.fond !== ref.fond ? [`${p.cle} fond ${p.fond} (jeton ${m.unread}, référence ${ref.fond})`] : []),
        ...(p.couleur !== m.surface || p.couleur !== ref.couleur ? [`${p.cle} texte ${p.couleur} (jeton ${m.surface}, référence ${ref.couleur})`] : []),
        ...(p.rapport < 4.5 ? [`${p.cle} ${p.rapport.toFixed(2)}:1`] : [])
      ]);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
  // Bascule dans le même onglet (rechargement de bascule attendu, clones recréés à 767 px).
  // Bureau compact : à chaque étape, menu ouvert dans le même onglet (mesure o), puis refermé (mesure f).
  const parcoursPastilles = async (variante, largeurs, script = userscript) => {
    const { context, page, erreurs } = await ouvrir({ nom: 'barre', width: largeurs[0], variante, script, tactile: false });
    const etapes = [];
    for (let i = 0; i < largeurs.length; i += 1) {
      const width = largeurs[i];
      if (i > 0) {
        await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
        const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
        await page.setViewportSize({ width, height: 667 });
        await charge;
        await prete(page, `bascule pastilles ${variante} ${width} px`);
      }
      const e = { width, m: await page.evaluate(MESURE_PASTILLES, P), o: null, f: null };
      if (COMPACT(width)) {
        await basculerMenu(page, true);
        e.o = await page.evaluate(MESURE_PASTILLES, P);
        await basculerMenu(page, false);
        e.f = await page.evaluate(MESURE_PASTILLES, P);
      }
      etapes.push(e);
    }
    await context.close();
    return { etapes, erreurs };
  };
  const resB = await mapLimit(VARIANTES.flatMap(variante => [[767, 768, 767], [768, 767, 768]].map(largeurs => ({ variante, largeurs }))), async c => ({ c, ...await parcoursPastilles(c.variante, c.largeurs) }));
  for (const { c, etapes, erreurs } of resB) {
    const lab = `pastilles bascule ${c.variante} ${c.largeurs.join(' -> ')}`;
    etapes.forEach((e, i) => {
      if (COMPACT(e.width)) {
        check(`${lab}, étape ${i + 1} (${e.width} px) : menu compact fermé, aucune pastille visible ; ouvert par le bouton de la barre, original visible (elementFromPoint) en pastille d'état ; refermé, aucune visible`, () => {
          controlerPorteur(e.m, e.width);
          controlerPorteur(e.o, e.width, true);
          controlerEtat(e.o, 'couleurs');
          controlerEtat(e.o, 'forme');
          controlerPorteur(e.f, e.width);
        });
      } else {
        check(`${lab}, étape ${i + 1} (${e.width} px) : pastille d'état visible, portée par le clone`, () => {
          controlerPorteur(e.m, e.width);
          controlerEtat(e.m, 'couleurs');
        });
      }
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

// ---------- étiquettes de catégorie (entrée 5) ----------
// Listes par page : clé, sélecteur, sort attendu. categorie : réécrite en étiquette de catégorie ; marque : marque native PNJ (taille de
// .xmini égale à la base) ; tags : catégorie sous 768 px, base au-delà ; conforme : déjà en catégorie, égale à la base ; egal : égal à la
// base (hors familles, états, pièce courante, tags natifs) ; contact : compteur de contact du kramail, pastille d'état ; absent : aucune.
// Quatrième terme facultatif, 'mobile' : élément rendu sous 768 px seulement (exigé présent là, égal à la base au-delà) ; sinon exigé partout.
const horsFamilles55 = page => E.horsFamilles.filter(s => s !== E.horsFamillesAbsent[page]).map(s => [s, s, 'egal', ...(s === E.horsFamillesMobile[page] ? ['mobile'] : [])]);
const LISTES55 = {
  barre: [['pnj', E.pnj, 'categorie'], ['groupe', E.groupe, 'categorie'], ...E.conformes.map(s => [s, s, 'conforme']), ...horsFamilles55('barre')],
  tags: [['tags', E.tags, 'tags'], ['pnj', E.pnj, 'categorie'], ['groupe', E.groupe, 'categorie']],
  groupes: [['pnj', E.pnj, 'categorie'], ...horsFamilles55('groupes')],
  etats: [['marque', E.marque, 'marque'], ...E.etat.map(s => [s, s, 'egal'])],
  'reception-remplie': [['contact', E.contact, 'contact']],
  reception: [['contact', E.contact, 'contact']],
  ...Object.fromEntries(Object.entries(E.conformesPages).map(([nom, s]) => [nom, [[s, s, 'conforme']]])),
  'sous-forum': [['tagforum', E.tagforum, 'egal']],
  sujet: [['absents', E.absents, 'absent']]
};
// Mesure (dans la page) : éléments de chaque clé (styles calculés, boîte, contraste), jetons sondés (catégorie, survol, états, surface),
// conteneur des tags et référence « NOUVEAU MESSAGE » du sous-forum.
const MESURE_ETIQUETTES = ([R, Q, cles]) => {
  const C = window.__krContraste;
  const r = v => Math.round(v * 10) / 10;
  const un = e => {
    const s = getComputedStyle(e);
    const b = e.getBoundingClientRect();
    const boite = b.width > 0 && b.height > 0;
    const largeurs = [s.borderTopWidth, s.borderRightWidth, s.borderBottomWidth, s.borderLeftWidth];
    return {
      texte: e.textContent.trim().slice(0, 24), display: s.display, boite, fond: s.backgroundColor, couleur: s.color,
      bordures: [s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor], largeurs, taille: s.fontSize, graisse: s.fontWeight,
      rayons: [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius],
      rapport: C.texte(e),
      cadre: `${s.display} ${s.padding} ${s.minHeight} ${s.fontSize} ${s.lineHeight} ${largeurs.join(' ')} ${s.textTransform} ${s.letterSpacing}`,
      geo: `${s.display} [${[b.left, b.top, b.width, b.height].map(r)}] ${s.position} ${s.top} ${s.right} ${s.padding} ${s.margin} ${s.minHeight} ${s.fontSize} ${s.lineHeight} ${largeurs.join(' ')} ${s.textTransform} ${s.letterSpacing}`
    };
  };
  const ref = document.querySelector(Q.reference);
  const conteneur = document.querySelector(R.tagsConteneur);
  return {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    jetons: { fond: C.sonde(R.fond), texte: C.sonde(R.texte), fondSurvol: C.sonde(R.fondSurvol), texteSurvol: C.sonde(R.texteSurvol), unread: C.sonde(Q.fond), surface: C.sonde(Q.texte), etats: R.etats.map(C.sonde) },
    el: Object.fromEntries(cles.map(([k, sel]) => [k, [...document.querySelectorAll(sel)].map(un)])),
    conteneur: conteneur ? `${getComputedStyle(conteneur).display} ${getComputedStyle(conteneur).gap} ${getComputedStyle(conteneur).marginTop}` : null,
    reference: ref ? { fond: getComputedStyle(ref).backgroundColor, couleur: getComputedStyle(ref).color } : null
  };
};
// Pseudo-classe forcée par le protocole du navigateur (aucun geste, aucun clic), transitions finies, puis mesure.
async function forcerEtat55(page, sel, etat, mesure) {
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root: doc } = await cdp.send('DOM.getDocument', { depth: 0 });
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: doc.nodeId, selector: sel });
    for (const nodeId of nodeIds) { await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [etat] }); }
    await page.evaluate(() => new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok))));
    await waitState(page, () => document.getAnimations().every(a => a.playState !== 'running'), null, { maxMs: 3000 });
    return await mesure();
  } finally { await cdp.detach(); }
}
// Relevé d'une page : repos ; marque PNJ survolée ; tags en appui sous 768 px.
async function releverEtiquettes(c, script) {
  const cles = LISTES55[c.nom];
  const { context, page, erreurs } = await ouvrir({ ...c, script });
  const mesure = () => page.evaluate(MESURE_ETIQUETTES, [E, P, cles]);
  const m = await mesure();
  if (cles.some(([k]) => C13.horsFamilles.includes(k))) { m.caracs = await page.evaluate(RELEVER_CARACTERISTIQUES_BACKLOG13, C13); }
  const survol = c.nom === 'etats' ? await forcerEtat55(page, E.marque, 'hover', mesure) : null;
  const appui = c.nom === 'tags' && c.width < 768 ? await forcerEtat55(page, E.tags, 'active', mesure) : null;
  await context.close();
  return { m, survol, appui, erreurs };
}
// Écarts d'une étiquette de catégorie : fond et texte égaux aux jetons calculés (rgb exacts, P2), aucune couleur d'état ni rouge de
// Bootstrap, bordure (si elle a une largeur) de la couleur du fond ; forme 12 px 700 et rayon plein (marque : taille égale à la base).
const ROUGES_BOOTSTRAP = ['rgb(217, 83, 79)', 'rgb(201, 48, 44)', 'rgb(212, 63, 58)', 'rgb(172, 41, 37)'];
function ecartsCategorie(quoi, x, j, { fond = j.fond, texte = j.texte, forme = true, taille = '12px' } = {}) {
  const e = [];
  if (x.fond !== fond) { e.push(`fond ${x.fond} ≠ ${fond}`); }
  if (x.couleur !== texte) { e.push(`texte ${x.couleur} ≠ ${texte}`); }
  if ([...j.etats, ...ROUGES_BOOTSTRAP].includes(x.fond)) { e.push(`fond en couleur d'état ${x.fond}`); }
  if (x.largeurs.some(v => v !== '0px') && x.bordures.some(b => b !== x.fond)) { e.push(`bordures ${x.bordures.join(' ')} ≠ fond`); }
  if (forme) {
    if (x.taille !== taille || x.graisse !== '700') { e.push(`${x.taille}/${x.graisse} (attendu ${taille}/700)`); }
    if (x.rayons.some(v => v !== '9999px')) { e.push(`rayons ${x.rayons.join(' ')}`); }
  }
  return e.length ? [`${quoi} « ${x.texte} » : ${e.join(', ')}`] : [];
}
// Écart accepté et consigné (revue S21, n° 6, EXCEPTION_REVUE_S21_6) : au sous-forum mobile, les sujets permanents sur deux lignes
// descendent la liste des sujets, et le séparateur « · » qui précédait les étiquettes du sujet passe après l'auteur (une ligne de
// métadonnées ne commence plus par « · ») : l'étiquette perd la largeur du séparateur. Position et largeur n'y sont pas comparées à une
// base d'avant la revue (hauteur, cadre, couleurs et typographie le sont) ; métadonnées sans « · » initial : revue-s21.mjs.
const ordonneeHorsComparaisonS21 = c => EXCEPTION_REVUE_S21_6 && c.nom === 'sous-forum' && c.width < 768;
// Écart accepté et consigné (densité du Matériel, 1er novembre 2026, lib/densite-jeu.mjs) : sur mobile, panneaux, corps et lignes d'objet
// resserrés remontent et décalent « Arme en main » (8 px plus à gauche, corps à 8 px de retrait). Position seule hors comparaison à une base
// d'avant ce changement (largeur, hauteur, cadre, couleurs et typographie le sont).
const EXCEPTION_DENSITE_JEU = AVANT_DENSITE_JEU(avant);
const positionHorsComparaisonDensiteJeu = c => EXCEPTION_DENSITE_JEU && c.nom === 'materiel' && c.width < 768;
// Caractéristiques et leurs pastilles (backlog 13) : fond, texte, bordures et contraste relevés à part, égaux à la compétence de la page.
const sansPalette13 = (k, x) => (C13.horsFamilles.includes(k) ? { ...x, fond: '·', couleur: '·', bordures: '·', rapport: '·' } : x);
const sansEcart55 = ecarts => assert.deepEqual(ecarts, [], ecarts.join(' ; '));
const BUREAU55 = ['(min-width: 768px)', '(width >= 768px)'];
const MEDIA_COMBINE = ['(max-width: 767px), (min-width: 768px)', '(width <= 767px), (width >= 768px)'];
const LITTERALE = v => /#[0-9a-f]{3,8}\b|rgb|hsl/i.test(v);
if (on('etiquettes')) {
  console.log('\n== etiquettes ==');
  const rs = await regles();
  const rb = await regles(avant);
  const forcees = l => l.reduce((n, r) => n + Object.values(r.d).filter(([, p]) => p === 'important').length, 0);
  const focus = l => l.filter(r => r.sel.includes(':focus')).length;
  // Écart accepté et consigné (revue S21) : des règles de la revue battent des priorités forcées du thème ou en ligne (onglet seul et titre
  // image de la modale d'ordre, barre du Cybermonde, contacts, rédaction du kramail, mini-profil, retrait des liens du texte en panneau,
  // retraits des votes du forum, ombre des cartes du forum et du kramail, retrait natif des étiquettes et pastilles en lien du texte...).
  // Décompte CSSOM : 7132 au départ de la revue (f404965), 7301 après, soit SURPLUS_FORCEES_REVUE_S21 de plus que la base (7204) ; permis
  // tant que la base précède la revue, pas une priorité forcée de plus. Retrait au recalage de COMMIT_AVANT au-delà de la revue.
  const SURPLUS_FORCEES_REVUE_S21 = 97;
  // Écarts acceptés et consignés (modale d'ordre sur mobile, lib/densite-ordre.mjs), même condition de retrait :
  // - mode compact clavier ouvert (#32) : cadre bord à bord, pied sur une ligne, pastilles masquées ; 32 priorités forcées, non auditées
  //   (ses règles visent aussi les Bootbox de saisie hors ordre) ;
  // - densité (1er novembre 2026) : audit sur la vraie popin (ordres Parler à Coup Monté, clavier ouvert ou fermé, 320 à 767 px, mobile-mode
  //   ou non), chaque !important rendu normal à son tour et styles calculés comparés : les inutiles sont retirés (décompte de 200 à 87) ;
  //   chacune des 87 restantes bat une priorité forcée du thème sur le même élément.
  const SURPLUS_FORCEES_CLAVIER_COMPACT = 32;
  const SURPLUS_FORCEES_DENSITE_ORDRE = 87;
  // Densité de la rédaction sur mobile (1er novembre 2026, lib/densite-redaction.mjs), même condition de retrait : retraits haut et bas du
  // libellé « Options », qui battent la règle mobile commune des libellés (« label { padding: 5px 0 !important } »).
  const SURPLUS_FORCEES_DENSITE_REDACTION = 2;
  // Densité du Matériel et du Personnage sur mobile (1er novembre 2026, lib/densite-jeu.mjs), même condition de retrait : audit sur les
  // fixtures (Matériel, Personnage, détail d'objet, vue d'organisation, 320 et 360 px), chaque !important rendu normal à son tour et styles
  // calculés comparés : chacune des priorités restantes bat une priorité forcée du thème ou un style en ligne du site sur le même élément
  // (écart et retraits des panneaux, retraits des liens et cellules de panneau, tableaux de Bootbox, tableaux de #col-right).
  const SURPLUS_FORCEES_DENSITE_JEU = 31;
  const consignes = [
    [AVANT_REVUE_S21(avant), SURPLUS_FORCEES_REVUE_S21, 'revue S21'],
    [AVANT_CLAVIER_COMPACT(avant), SURPLUS_FORCEES_CLAVIER_COMPACT, 'clavier compact'],
    [AVANT_DENSITE_ORDRE(avant), SURPLUS_FORCEES_DENSITE_ORDRE, 'densité de la modale d\'ordre'],
    [AVANT_DENSITE_REDACTION(avant), SURPLUS_FORCEES_DENSITE_REDACTION, 'densité de la rédaction'],
    [AVANT_DENSITE_JEU(avant), SURPLUS_FORCEES_DENSITE_JEU, 'densité du Matériel et du Personnage']
  ].filter(([avantChangement]) => avantChangement);
  const surplus = consignes.reduce((n, [, k]) => n + k, 0);
  const detailSurplus = consignes.map(([, k, quoi]) => `${quoi} ${k}`).join(', ');
  check(`statique : pas plus de priorités forcées (${forcees(rs)}) que la base (${COMMIT_AVANT}, ${forcees(rb)})${surplus ? ` plus les surplus consignés (${detailSurplus})` : ''}, au moins autant de règles :focus (${focus(rs)}) ; aucun #c9302c`, () => {
    assert.ok(forcees(rs) <= forcees(rb) + surplus, `priorités forcées : ${forcees(rs)} > ${forcees(rb)}${surplus ? ` + ${surplus}` : ''}`);
    // Intention : aucune règle :focus perdue (focus visible gardé) ; un focus ajouté ailleurs (menu de personnage, épopée 7, entrée 3) est permis
    assert.ok(focus(rs) >= focus(rb), `règles :focus : ${focus(rs)} < ${focus(rb)}`);
    assert.ok(!/c9302c/i.test(cssDuBundle(userscript)), '#c9302c présent');
  });
  const net = v => v.replace(/\s+/g, '');
  check('statique : règles réécrites (PNJ des cartes, compteur de groupe bureau et mobile, tags et appui mobiles) aux jetons de la catégorie, sans couleur littérale', () => {
    const pnj = rs.filter(r => r.sel === E.pnj);
    const groupe = rs.filter(r => r.sel === E.groupe && r.media);
    const tags = rs.filter(r => r.sel.startsWith(E.regleTags));
    assert.equal(pnj.length, 1, `PNJ : ${pnj.length} règle(s)`);
    assert.ok(groupe.some(r => MOBILE.includes(r.media)) && groupe.some(r => BUREAU55.includes(r.media)), `compteur de groupe : ${groupe.map(r => r.media).join(', ')}`);
    assert.ok(tags.length >= 2 && tags.every(r => MOBILE.includes(r.media)), `tags : ${tags.map(r => r.media).join(', ')}`);
    const ecarts = [...pnj, ...groupe, ...tags].flatMap(r => Object.entries(r.d).filter(([p, [v]]) => /color|background/.test(p) && LITTERALE(v)).map(([p, [v]]) => `${r.sel} ${p} ${v}`));
    const voulu = [[pnj[0], 'background', E.fond], [pnj[0], 'color', E.texte], ...groupe.flatMap(r => [[r, 'background-color', E.fond], [r, 'color', E.texte]]),
      ...tags.filter(r => !r.sel.endsWith(':active')).flatMap(r => [[r, 'background', E.fond], [r, 'color', E.texte]]), ...tags.filter(r => r.sel.endsWith(':active')).map(r => [r, 'background', E.fondSurvol])];
    voulu.forEach(([r, p, v]) => { if (!r.d[p] || net(r.d[p][0]) !== net(v)) { ecarts.push(`${r.sel} (${r.media || 'global'}) ${p} ${JSON.stringify(r.d[p])} ≠ ${v}`); } });
    sansEcart55(ecarts);
  });
  check('statique : marque native PNJ, règle unique dans le média combiné (fond, bordure, texte, graisse, rayon ; taille laissée à l\'origine .xmini), sans priorité forcée', () => {
    const l = rs.filter(r => r.sel === E.regleMarque);
    assert.equal(l.length, 1, `${l.length} règle(s)`);
    const [r] = l;
    assert.ok(MEDIA_COMBINE.includes(r.media), `média « ${r.media || 'global'} »`);
    const att = { 'background-color': E.fond, color: E.texte, 'font-weight': '700', 'border-radius': 'var(--kr-radius-full)', 'border-top-color': null };
    sansEcart55([
      ...Object.entries(att).filter(([p, v]) => !r.d[p] || (v !== null && net(r.d[p][0]) !== net(v))).map(([p, v]) => `${p} ${JSON.stringify(r.d[p])} ≠ ${v}`),
      ...Object.entries(r.d).filter(([, [v, prio]]) => prio || LITTERALE(v)).map(([p, [v, prio]]) => `${p} ${v} ${prio}`)
    ]);
  });
  check('statique : compteurs de contact du kramail en tête de la règle d\'état (média combiné, fond non lu, texte surface) ; détecteurs 5.4 et 5.5 justes', () => {
    const l = rs.filter(r => r.sel.startsWith(E.regleContacts));
    assert.equal(l.length, 1, `${l.length} règle(s)`);
    assert.ok(l[0].sel.includes(P.regle), 'règle d\'état de l\'entrée 4');
    assert.ok(MEDIA_COMBINE.includes(l[0].media), `média « ${l[0].media} »`);
    assert.deepEqual(l[0].d, { 'background-color': [P.fond, 'important'], color: [P.texte, 'important'] }, JSON.stringify(l[0].d));
    assert.equal(AVANT_TICKET54(userscript), false, 'AVANT_TICKET54(bundle testé)');
    assert.equal(AVANT_TICKET55(userscript), false, 'AVANT_TICKET55(bundle testé)');
  });
  // Géométrie et égalités à la base : 7 largeurs, Kraland clair et Empire Brun sombre, toutes les pages.
  const PAGES55 = Object.keys(LISTES55);
  const cas = [...MOBILES, ...BUREAUX].flatMap(width => VARIANTES.flatMap(variante => PAGES55.map(nom => ({ nom, width, variante }))));
  const res = await mapLimit(cas, async c => ({ c, t: await releverEtiquettes(c, userscript), b: await releverEtiquettes(c, avant) }));
  const refs = new Map(res.filter(({ c }) => c.nom === 'sous-forum').map(({ c, t }) => [`${c.variante} ${c.width}`, t.m.reference]));
  for (const { c, t, b } of res) {
    const lab = `etiquettes ${c.nom} ${c.variante} ${c.width} px`;
    const j = t.m.jetons;
    check(`${lab} : kr-theme-enabled (testé et base), mobile-mode ${c.width < 768}, aucune erreur de page`, () => {
      assert.ok(t.m.theme && b.m.theme, 'kr-theme-enabled absent');
      assert.equal(t.m.mobile, c.width < 768, `mobile-mode ${t.m.mobile}`);
      assert.deepEqual(t.erreurs, []);
    });
    if (t.m.caracs) {
      check(`${lab} : caractéristiques au fond, bordures et texte de la compétence de la page, pastille aux jetons de son niveau (backlog 13)`, () => {
        assert.ok(t.m.caracs.length, 'aucune caractéristique');
        const e = ecartsCaracteristiquesBacklog13(t.m.caracs);
        assert.deepEqual(e, [], `${e.length} écart(s) : ${e.slice(0, 6).join(' ; ')}`);
      });
    }
    for (const [k, , sort, rendu] of LISTES55[c.nom]) {
      const l = t.m.el[k];
      const lb = b.m.el[k];
      const tagsBase = sort === 'tags' && c.width >= 768;
      if (sort === 'absent') {
        check(`${lab} : aucune étiquette ni pastille (${E.absents}), comme la base`, () => assert.deepEqual([l.length, lb.length], [0, 0]));
        continue;
      }
      if (sort === 'egal' || sort === 'conforme' || tagsBase) {
        const ordonnee = ordonneeHorsComparaisonS21(c);
        const position = positionHorsComparaisonDensiteJeu(c);
        check(`${lab} : ${k} (${l.length}) égal${sort === 'conforme' ? ', déjà en catégorie,' : ''} au bundle de base (${COMMIT_AVANT})${tagsBase ? ', sans règle bureau' : ''}${C13.horsFamilles.includes(k) ? ', palette à part' : ''}${ordonnee ? ', position et largeur à part (permanents sur deux lignes, « · » après l\'auteur, revue S21, n° 6)' : ''}${position ? ', position à part (densité du Matériel)' : ''}`, () => {
          if (rendu !== 'mobile' || c.width < 768) { assert.ok(l.length > 0, 'absent'); }
          const geo = g => (ordonnee ? g.replace(/\[[^,\]]+,[^,\]]+,[^,\]]+,/, '[·,·,·,') : position ? g.replace(/\[[^,\]]+,[^,\]]+,/, '[·,·,') : g);
          const vue = x => JSON.stringify(sansPalette13(k, ordonnee || position ? { ...x, geo: geo(x.geo) } : x));
          const d = premierEcart(l.map(vue), lb.map(vue));
          assert.equal(d, '', d);
          if (sort === 'conforme') { sansEcart55(l.flatMap(x => ecartsCategorie(k, x, j))); }
        });
        continue;
      }
      if (sort === 'contact') {
        check(`${lab} : compteurs de contact remplis en pastille d'état (fond ${j.unread}, texte ${j.surface}) comme « NOUVEAU MESSAGE » du sous-forum, contact actif compris ; vides invisibles ; géométrie égale à la base`, () => {
          const ref = refs.get(`${c.variante} ${c.width}`);
          assert.ok(ref, '« NOUVEAU MESSAGE » absent du sous-forum');
          assert.equal(l.length, 2, 'compteurs');
          const pleins = l.filter(x => x.texte);
          assert.equal(pleins.length, c.nom === 'reception' ? 0 : 2, 'compteurs remplis');
          sansEcart55([
            ...pleins.flatMap(x => (x.fond === j.unread && x.couleur === j.surface && x.fond === ref.fond && x.couleur === ref.couleur ? [] : [`« ${x.texte} » ${x.couleur} sur ${x.fond} (jetons ${j.surface} sur ${j.unread}, référence ${ref.couleur} sur ${ref.fond})`])),
            ...l.filter(x => !x.texte && (x.display !== 'none' || x.boite)).map(x => `vide ${x.display} boîte ${x.boite}`)
          ]);
          const d = premierEcart(l.map(x => x.geo), lb.map(x => x.geo));
          assert.equal(d, '', d);
        });
        continue;
      }
      check(`${lab} : ${k} (${l.length}) en étiquette de catégorie (fond ${j.fond}, texte ${j.texte}, bordure du fond), ${sort === 'marque' ? 'taille de .xmini égale à la base' : '12 px'}, 700, rayon plein, aucune couleur d'état`, () => {
        assert.ok(l.length > 0 && l.length === lb.length, `${l.length} / ${lb.length} éléments`);
        sansEcart55(l.flatMap((x, i) => ecartsCategorie(k, x, j, { taille: sort === 'marque' ? lb[i].taille : '12px' })));
      });
      check(`${lab} : ${k} : ${sort === 'marque' ? 'cadre (affichage, retrait, hauteur minimale, taille, bordures, casse)' : 'position, boîte, retrait, casse et espacement'} égaux à la base${sort === 'tags' ? ', conteneur (gap, marge) compris' : ''}`, () => {
        const champ = sort === 'marque' ? 'cadre' : 'geo';
        const d = premierEcart(l.map(x => x[champ]), lb.map(x => x[champ]));
        assert.equal(d, '', d);
        if (sort === 'tags') { assert.equal(t.m.conteneur, b.m.conteneur, 'conteneur'); }
      });
      if (sort === 'marque') {
        check(`${lab} : marque PNJ survolée (forcé) aux couleurs du repos`, () => sansEcart55(t.survol.el[k].flatMap((x, i) => (x.fond === l[i].fond && x.couleur === l[i].couleur && x.bordures.join() === l[i].bordures.join() ? [] : [`survol ${x.couleur} sur ${x.fond} (bordures ${x.bordures.join(' ')})`]))));
      }
      if (sort === 'tags' && t.appui) {
        check(`${lab} : tags en appui (forcé) au survol de catégorie (fond ${j.fondSurvol}, texte ${j.texteSurvol}), ≥ 4,5:1`, () => sansEcart55(t.appui.el[k].flatMap(x => [
          ...ecartsCategorie(`${k}:active`, x, j, { fond: j.fondSurvol, texte: j.texteSurvol }),
          ...(x.rapport !== null && x.rapport < 4.5 ? [`« ${x.texte} » ${x.rapport.toFixed(2)}:1`] : [])
        ])));
      }
    }
  }
  // Thèmes : 16 variantes, couleurs aux jetons calculés, contraste ≥ 4,5:1 (rapport exact, P1).
  const PAGES_T = ['barre', 'tags', 'groupes', 'etats', 'reception-remplie', 'sous-forum'];
  const casT = [375, 1280, 1440, 1920].flatMap(width => TOUTES.flatMap(variante => PAGES_T.filter(nom => nom !== 'tags' || width < 768).map(nom => ({ nom, width, variante }))));
  const resT = await mapLimit(casT, async c => ({ c, ...await releverEtiquettes(c, userscript) }));
  const refsT = new Map(resT.filter(({ c }) => c.nom === 'sous-forum').map(({ c, m }) => [`${c.variante} ${c.width}`, m.reference]));
  for (const { c, m, survol, appui, erreurs } of resT.filter(x => x.c.nom !== 'sous-forum')) {
    const lab = `etiquettes ${c.nom} ${c.variante} ${c.width} px`;
    const j = m.jetons;
    check(`${lab} : étiquettes de catégorie au fond ${j.fond} et texte ${j.texte} calculés, ≥ 4,5:1 (rapport exact), aucune en couleur d'état ; compteurs de contact comme « NOUVEAU MESSAGE » ; aucune erreur de page`, () => {
      assert.ok(m.theme, 'kr-theme-enabled absent');
      assert.deepEqual(erreurs, []);
      const ecarts = [];
      for (const [k, , sort] of LISTES55[c.nom]) {
        const l = m.el[k];
        if (['categorie', 'marque', 'tags', 'conforme'].includes(sort)) {
          if (!l.length) { ecarts.push(`${k} absent`); }
          l.forEach(x => {
            ecarts.push(...ecartsCategorie(k, x, j, { forme: false }));
            if (x.rapport !== null && x.rapport < 4.5) { ecarts.push(`${k} « ${x.texte} » ${x.rapport.toFixed(2)}:1`); }
          });
          if (sort !== 'tags' && l.length && l.every(x => !x.boite)) { ecarts.push(`${k} sans boîte`); }
        }
        if (sort === 'contact') {
          const ref = refsT.get(`${c.variante} ${c.width}`);
          if (!ref) { ecarts.push('« NOUVEAU MESSAGE » absent'); }
          l.filter(x => x.texte).forEach(x => {
            if (!ref || x.fond !== j.unread || x.couleur !== j.surface || x.fond !== ref.fond || x.couleur !== ref.couleur) { ecarts.push(`contact « ${x.texte} » ${x.couleur} sur ${x.fond}`); }
            if (x.rapport !== null && x.rapport < 4.5) { ecarts.push(`contact « ${x.texte} » ${x.rapport.toFixed(2)}:1`); }
          });
        }
      }
      if (survol) { survol.el.marque.forEach((x, i) => { if (x.fond !== m.el.marque[i].fond || x.couleur !== m.el.marque[i].couleur) { ecarts.push(`marque survolée ${x.couleur} sur ${x.fond}`); } }); }
      if (appui) {
        appui.el.tags.forEach(x => {
          ecarts.push(...ecartsCategorie('tags:active', x, j, { fond: j.fondSurvol, texte: j.texteSurvol, forme: false }));
          if (x.rapport !== null && x.rapport < 4.5) { ecarts.push(`tags:active « ${x.texte} » ${x.rapport.toFixed(2)}:1`); }
        });
      }
      sansEcart55(ecarts);
    });
  }
  // Bascule dans le même onglet : PNJ, compteur de groupe et tags (page de sujet), marque (palette d'états) ; tags en catégorie à 767,
  // égaux au même parcours de la base à 768.
  const parcoursEtiquettes = async (nom, variante, largeurs, script) => {
    const { context, page, erreurs } = await ouvrir({ nom, width: largeurs[0], variante, script, tactile: false });
    const etapes = [];
    for (let i = 0; i < largeurs.length; i += 1) {
      if (i > 0) {
        await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
        const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
        await page.setViewportSize({ width: largeurs[i], height: 667 });
        await charge;
        await prete(page, `bascule etiquettes ${nom} ${variante} ${largeurs[i]} px`);
      }
      etapes.push({ width: largeurs[i], m: await page.evaluate(MESURE_ETIQUETTES, [E, P, LISTES55[nom]]) });
    }
    await context.close();
    return { etapes, erreurs };
  };
  const casB = VARIANTES.flatMap(variante => ['tags', 'etats'].flatMap(nom => [[767, 768, 767], [768, 767, 768]].map(largeurs => ({ nom, variante, largeurs }))));
  const resB = await mapLimit(casB, async c => ({ c, t: await parcoursEtiquettes(c.nom, c.variante, c.largeurs, userscript), b: await parcoursEtiquettes(c.nom, c.variante, c.largeurs, avant) }));
  for (const { c, t, b } of resB) {
    const lab = `etiquettes bascule ${c.nom} ${c.variante} ${c.largeurs.join(' -> ')}`;
    t.etapes.forEach((e, i) => {
      check(`${lab}, étape ${i + 1} (${e.width} px) : ${c.nom === 'tags' ? `PNJ et compteur de groupe en catégorie, tags ${e.width < 768 ? 'en catégorie' : 'égaux à la base'}` : 'marque PNJ en catégorie'}`, () => {
        assert.ok(e.m.theme, 'kr-theme-enabled absent');
        assert.equal(e.m.mobile, e.width < 768, `mobile-mode ${e.m.mobile}`);
        const ecarts = [];
        for (const [k, , sort] of LISTES55[c.nom]) {
          if (sort === 'tags' && e.width >= 768) {
            const d = premierEcart(e.m.el[k].map(x => JSON.stringify(x)), b.etapes[i].m.el[k].map(x => JSON.stringify(x)));
            if (d) { ecarts.push(`tags : ${d}`); }
          } else if (['categorie', 'marque', 'tags'].includes(sort)) {
            if (!e.m.el[k].length) { ecarts.push(`${k} absent`); }
            e.m.el[k].forEach((x, n) => ecarts.push(...ecartsCategorie(k, x, e.m.jetons, { taille: sort === 'marque' ? b.etapes[i].m.el[k][n].taille : '12px' })));
          }
        }
        sansEcart55(ecarts);
      });
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(t.erreurs, []));
  }
}

// ---------- contraste (16 variantes) ----------
if (on('contraste')) {
  console.log('\n== contraste ==');
  const cas = ['bat', 'reception', 'sous-forum', 'index-rp'].flatMap(nom => TOUTES.map(variante => ({ nom, variante, width: 375 })));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const m = await page.evaluate(MESURE, [PANNEAU_TICKET51, TEXTE_TICKET51]);
    await context.close();
    return { c, m, erreurs };
  });
  for (const { c, m, erreurs } of res) {
    check(`contraste ${c.nom} ${c.variante} : titre de chaque carte ≥ 4,5:1 sur son fond`, () => {
      assert.ok(m.theme, 'kr-theme-enabled absent');
      assert.ok(m.panneaux.length > 0, 'aucun panneau');
      const ecarts = m.panneaux.filter(p => !p.titre || p.titre.rapport < 4.5).map(p => `« ${p.nom} » ${p.titre ? p.titre.rapport.toFixed(2) : 'sans titre'}:1`);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    check(`contraste ${c.nom} ${c.variante} : coins de la carte et coins bas du dernier corps à 8 px`, () => {
      const ecarts = m.panneaux.flatMap(p => [
        ...(p.coins.some(v => v !== '8px') ? [`« ${p.nom} » rayons ${p.coins.join(' ')}`] : []),
        ...(p.dernier && p.dernier.some(v => v !== '8px') ? [`« ${p.nom} » coins bas du corps ${p.dernier.join(' ')}`] : [])
      ]);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    check(`contraste ${c.nom} ${c.variante} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
  // Groupes du plateau (entrée 3) : titre de chaque groupe sur le fond surface de son en-tête, coins de la carte à 8 px.
  const resG = await mapLimit(TOUTES.map(variante => ({ nom: 'groupes', variante, width: 375 })), async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const m = await page.evaluate(MESURE_GROUPES, [G, TEXTE_TICKET51]);
    await context.close();
    return { c, m, erreurs };
  });
  for (const { c, m, erreurs } of resG) {
    check(`contraste groupes ${c.variante} : titre de chaque groupe ≥ 4,5:1 sur le fond surface, coins de la carte à 8 px`, () => {
      assert.ok(m.theme, 'kr-theme-enabled absent');
      assert.equal(m.sections.length, 2, 'groupes');
      const ecarts = m.sections.flatMap(s => [
        ...(s.titre.rapport < 4.5 ? [`« ${s.nom} » ${s.titre.rapport.toFixed(2)}:1`] : []),
        ...(s.hfond !== m.surface ? [`« ${s.nom} » fond ${s.hfond}`] : []),
        ...(s.coins.some(v => v !== '8px') ? [`« ${s.nom} » rayons ${s.coins.join(' ')}`] : [])
      ]);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    check(`contraste groupes ${c.variante} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
