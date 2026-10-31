// Typographie et formes (épopée 4, ticket 1, balle traçante) : jetons d'échelle sur :root, étiquettes et pastilles en 12 px gras (H8.2).
// Une vérification par ligne de la matrice du plan (story-jetons-d-echelle-etiquettes-et-pastilles-en-12-px-gras) :
//   jetons          --kr-font-*, --kr-radius-sm/-md/-full, --kr-space-1 à -6, --kr-margin-mobile, --kr-touch-target(-dpad) calculés sur
//                   :root égaux à DESIGN.md (frontmatter : typography, rounded, spacing ; 1 rem = 10 px), Kraland clair et Empire Brun
//                   sombre, 375 et 1280 px ; --kr-radius, --mobile-radius et --mobile-radius-lg absents (retirés par le ticket 8) ;
//   étiquettes      .label, .badge, « ! » de la cloche, « ici » de la croix, tags du forum, .kr-topic-badge, pastille d'en-tête et PNJ
//                   du tableau de bord, .kd-opt-tag du kramail (groupe de l'annuaire, « déjà ajouté », « ajouter tel quel »),
//                   .kr-stat-badge, .kr-skill-badge, pastilles de la modale d'ordre ; 375, 767, 768, 769 et 1280 px, Kraland clair et Empire Brun sombre :
//                   font-size 12px, font-weight 700 ; « ici » de la croix et tags du forum n'existent que sur mobile (375 et 767 px) ;
//   consommation    --kr-font-label redéfini à 13 px par une feuille adoptée : tous ces éléments suivent (13 px), 375 et 1280 px ;
//   couleurs        mêmes éléments, mêmes largeurs et variantes : couleur, fond et bordures calculés égaux au bundle de base
//                   (avant le ticket).
//   mini-profil     pastilles du mini-profil mobile (boîte de 16 px) en 12 px gras sans débordement, replié et déplié, 375 et 700 px ;
//   bascule         même onglet 767, 768 puis 767 px : mode suivi, .kr-stat-badge en 12 px gras.
// Boutons de taille normale (ticket 2, story-bouton-de-taille-normale-14-px-34-px-sur-ordinateur-au-moins-plan) :
//   boutons         boutons primaires et standard des pages de jeu, forum, kramail, Interface, accueil et pied du changelog : 768, 769,
//                   1280, 1440 et 1920 px, Kraland clair et Empire Brun sombre : font-size 14px, hauteur 34 px (± 0,5) ; 375 et 767 px :
//                   14px, hauteur ≥ 44 px ; ordinateur tactile (pointer: coarse, 1280 px) : boutons d'action et d'accès rapide ≥ 44 px ;
//                   « + » des contacts mesuré dans son champ natif rendu visible (masqué par le widget Destinataires) ;
//                   exclusions (compacts, BBCode, flèches, votes et date des messages, boutons-icônes, bâtiments, Envoyer sur mobile,
//                   boutons de groupe du tableau de bord) : font-size, hauteur et padding égaux au bundle de base (COMMIT_BOUTONS) ;
//   modales         (ticket 3, story-modales-bootbox-mobiles-valider-de-taille-normale-et-regles-plan) ordre Dormir et confirmation
//                   avec barre BBCode, fixture modale-ordre/ : 375 et 767 px, boutons du pied et « ? Aide » en 14 px, hauteur ≥ 44 px ;
//                   barre BBCode et croix (et tous les boutons à partir de 768 px) égales au bundle de base (COMMIT_MODALES) ;
//   boutons-bascule même onglet 767, 768 puis 767 px : accès rapides du plateau du bon côté à chaque pas.
// Bouton compact (ticket 4, story-bouton-compact-en-12-px-pour-les-votes-et-la-pagination-plan) :
//   compact         votes des messages (j'aime, je n'aime pas, score) et numéros de pagination du sujet et du sous-forum : 768, 1280,
//                   1440 et 1920 px, Kraland clair et Empire Brun sombre : 12 px, rayon 4 px aux coins arrondis par la base (coins
//                   carrés conservés), hauteur (± 0,5) et couleurs égales au bundle de base (COMMIT_COMPACT) ; 375 et 767 px : égaux
//                   à la base ; autres boutons des messages (date, profil, kramail, signaler…) égaux à la base à toutes les largeurs ;
//                   rayons des éléments non visés : valeur du rôle (4 px aux coins arrondis par la base, ticket 8) ;
//                   padding des éléments visés égal à la base ; jetons redéfinis (13 px, rayon 7 px) suivis à 1280 px.
// Matériel, Personnage, Bâtiments, Employés (ticket 6, story-materiel-personnage-batiments-employes-echelle-et-ligne-d-ob-plan) :
//   echelle         fragment étendu aux FIXTURES SYNTHÉTIQUES jeu-materiel.html, jeu-batiments.html et jeu-employes.html (/jouer/materiel,
//                   /jouer/bat, /jouer/pnj) : 375, 767, 768, 769, 1280, 1440 et 1920 px, Kraland clair et Empire Brun sombre : noms et
//                   valeurs 15 px / 600, détails (texte de ligne, charge, well « Charge … », alerte des Employés) 13 px ; rien sous 12 px
//                   dans #content (mobile) ou #col-right (ordinateur) ; ligne d'objet du Matériel à 375 et 767 px : image à gauche, charge
//                   au bord droit (≤ 1 px) sur la ligne du nom, sans chevauchement, en couleur de texte secondaire ; charge premier enfant et
//                   cible de la ligne conservées à toutes les largeurs ; objets déplacés (.kr-materiel-moved, typographie-echelle.html) :
//                   nom 15 px / 600, détail et charge 13 px sur ordinateur ; ligne sans image : nom au bord ; texte réel du nom (Range)
//                   sans chevauchement de la charge ; Personnage : plancher de 12 px dans #content ; plateau (FIXTURE SYNTHÉTIQUE
//                   jeu-plateau-objets.html : Commerce, Matériel) égal au bundle de base (COMMIT_TICKET6), 375, 767, 768, 1280 px ;
//                   bascule 767, 768, 767 px.
// Échelle du forum et du kramail (ticket 7, story-echelle-typographique-du-forum-et-du-kramail-plan) :
//   echelle-forum   index RP, Communauté et racine, sous-forum, sujet, rédaction (FIXTURE SYNTHÉTIQUE typographie-forum-redaction.html),
//                   réception, lecture et nouveau kramail : 375, 767, 768, 1280, 1440 et 1920 px, Kraland clair et Empire Brun sombre :
//                   noms 15 px (nom de forum de l'index en 400), détails 13 px, texte courant 15 px sur mobile, libellés de rédaction
//                   13 px, champ de rédaction et corps des messages 16 px sur mobile ; aucun texte de #col-right sous 12 px sur mobile ;
//                   taille de chaque élément de #col-right égale au bundle de base (COMMIT_ECHELLE_FORUM), sans masque, 375, 768, 1280 px.
// Trois rayons (ticket 8, story-trois-rayons-4-px-8-px-et-plein-plan) :
//   rayons          plateau, forum (sujet, rédaction, index RP), sous-forum, kramail (réception, lecture, nouveau) et modale d'ordre :
//                   375, 767, 768, 769, 1280, 1440 et 1920 px, Kraland clair et Empire Brun sombre, rayon calculé aux quatre coins :
//                   contrôles 4 px, conteneurs 8 px, en-têtes de panneau 7 px, pastilles pleines, coins carrés de la base conservés,
//                   exceptions (croix, avatars, images) égales au bundle de base (COMMIT_RAYONS) ; jetons redéfinis (7 px, 11 px) suivis,
//                   375 et 1280 px ; bascule 767, 768, 767 px ; contrôle statique : aucun rayon littéral non nul hors exceptions.
// Grille d'espacement au pas de 4 px (ticket 9, story-grille-d-espacement-au-pas-de-4-px-plan) :
//   espacement      plateau (deux fixtures), forum (sujet, rédaction, index RP, sous-forum), kramail (réception, lecture, nouveau, répondre),
//                   modale d'ordre, Interface et composants : 375, 767, 768, 769, 1280, 1440 et 1920 px, Kraland clair et Empire Brun sombre :
//                   retraits, marges et écarts des éléments R (réécrits au jeton) et N (natifs réécrits au rôle) égaux au jeton --kr-space-n,
//                   multiples de 4 entre 0 et 32 px ; exceptions E (boutons, champs, compacts, BBCode, tuiles du mini-profil, marges auto,
//                   colonnes du plateau) égales au bundle de base (COMMIT_ESPACEMENT) ; boutons de l'entrée 2 à 34 px / ≥ 44 px ; jetons
//                   redéfinis (5, 9, 13, 17 px) suivis, 375 et 1280 px ; mini-profil plié et déplié, 375 et 700 px ; bascule 767, 768, 767 px ;
//                   contrôle statique des 13 déclarations réécrites, des 4 règles de rôle et du bouton d'import du template.
// Nettoyage des déclarations mortes et des médias au seuil 768/769 (ticket 10, story-refactor-sweep-plan) :
//   nettoyage       plateau (deux fixtures), champ de saisie, modale d'ordre, forum (sous-forum, staff, sujet, rédaction), kramail (nouveau,
//                   répondre), Interface (changelog ouvert) et composants : 375, 767, 768, 769, 1280 px, Kraland clair et Empire Brun sombre :
//                   tous les styles calculés (éléments visibles, ::before et ::after) égaux au bundle de base (COMMIT_NETTOYAGE) ; à
//                   768 px, pages des blocs M1 et M2 : propriétés de ces blocs égales à la base M1/M2 (COMMIT_MEDIAS_410) à 769 px ; hamburger survolé et en
//                   focus (order 1 gardé), lignes du forum :active, champs d'une ligne 44 px ; fenêtre rétrécie sans mode mobile ; menu de
//                   personnage du kramail 375 puis 1280 px ; bascule 767, 768, 767 px ; contrôle statique des médias et de la racine du forum.
// Nom de forum des cartes mobiles à 15 px (bug 10, bug-nom-de-forum-mobile-a-17-px-au-lieu-de-15-plan) :
//   titre-forum     index Staff (forum-index-rp.html servi à /forum/staff, cartes du template) : 375 et 767 px, Kraland clair et Empire Brun
//                   sombre : chaque .forum-card h3.forum-title en 15 px / 700, au moins une carte ; h1-h3 visibles de #col-right hors
//                   .forum-title égaux au bundle de base (COMMIT_TITRE_FORUM), 375, 767, 768 et 1280 px ; aucune carte à 768 et 1280 px ;
//                   bascule 767, 768, 767 px (15 px, sans carte, 15 px) ; contrôle statique de la règle des titres h1-h3 du bundle.
// Champs .form-control à 14 px sur ordinateur (bug 14, bug-sur-ordinateur-les-champs-form-control-s-affichent-en-9-5-px-plan) :
//   champs          report (sélecteur de personnage), kramail nouveau, forum nouveau sujet, Matériel, sondes .input-sm / .input-lg ajoutées :
//                   768, 769 et 1280 px, Kraland clair et Empire Brun sombre : input et select en 14 px, retrait 6 × 12 px (sm 12 px 5 × 10,
//                   lg 18 px 10 × 16, natifs Bootstrap) ; textarea en 14 px, retrait 6 × 12 px natif (texte aligné sur le select voisin) ; 375 et 767 px :
//                   taille, retrait, hauteur et interligne de chaque champ égaux à la base ; bascule 767, 768, 767 px ; contrôle statique.
// Hauteurs du sous-forum avec la pastille à 12 px : sous-forum.mjs (checkNewmsg).
// Pages = FIXTURE SYNTHÉTIQUE tests/e2e/fixtures/typographie-formes.html (servie à /jouer/plateau et à un sujet de forum inventé),
// forum-index-rp.html, sous-forum-debuter.html et kramail-nouveau.html ; vrai Bootstrap 3.3.7 (tests/e2e/vendor) ; annuaire du
// kramail fictif (ajaxsearch.php émulé, noms inventés). Confinement réseau ; gestes : saisie au clavier dans le champ Destinataires,
// aucun envoi (soumission neutralisée ; « Envoyer » n'est cliqué que pour afficher le blocage « Ajouter / Effacer » du kramail) ;
// « Voir l'historique des changements » ouvert sur l'Interface (action locale du thème, changelog chargé à vide).
//
// Usage : npm run build && node tests/e2e/typographie-formes.mjs   (ou npm run test:zone -- typographie-formes)
// Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base, défaut : kraland-userscript-main.user.js du commit COMMIT_AVANT),
//           KR_SCRIPT_AVANT_BOUTONS (bundle de base des boutons, défaut : celui du commit COMMIT_BOUTONS),
//           KR_SCRIPT_AVANT_MODALES (bundle de base des modales, défaut : celui du commit COMMIT_MODALES),
//           KR_SCRIPT_AVANT_COMPACT (bundle de base du bouton compact, défaut : celui du commit COMMIT_COMPACT),
//           KR_SCRIPT_AVANT_ECHELLE (bundle de base de l'échelle typographique, défaut : celui du commit COMMIT_ECHELLE),
//           KR_SCRIPT_AVANT_ECHELLE_FORUM (bundle de base de l'échelle du forum et du kramail, défaut : celui du commit
//           COMMIT_ECHELLE_FORUM),
//           KR_SCRIPT_AVANT_TICKET6 (bundle de base du plateau inchangé par le ticket 6, défaut : celui du commit COMMIT_TICKET6),
//           KR_SCRIPT_AVANT_RAYONS (bundle de base des rayons, défaut : celui du commit COMMIT_RAYONS),
//           KR_SCRIPT_AVANT_ESPACEMENT (bundle de base de l'espacement, défaut : celui du commit COMMIT_ESPACEMENT),
//           KR_SCRIPT_AVANT_NETTOYAGE (bundle de base du nettoyage, défaut : celui du commit COMMIT_NETTOYAGE),
//           KR_SCRIPT_AVANT_MEDIAS_410 (bundle de base des médias M1 et M2, défaut : celui du commit COMMIT_MEDIAS_410),
//           KR_SCRIPT_AVANT_TITRE_FORUM (bundle de base du nom de forum des cartes, défaut : celui du commit COMMIT_TITRE_FORUM),
//           KR_SCRIPT_AVANT_CHAMPS (bundle de base des champs .form-control, défaut : celui du commit COMMIT_CHAMPS),
//           KR_FRAG = jetons, mobile, bureau, mini-profil, bascule, boutons, boutons-bascule, compact, echelle, echelle-forum, rayons,
//           espacement, nettoyage, titre-forum, champs
//           (vide = tout).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { domQuiet, krReady, styleSettled, THEME_READY, waitState } from './lib/settle.mjs';
import { AVANT_BUG10, AVANT_BUG14, AVANT_TICKET410, AVANT_TICKET45, AVANT_TICKET54, AVANT_TICKET55, AVANT_TICKET73, AVANT_TICKET75, AVANT_TICKET95, CARACTERISTIQUES_BACKLOG13 as C13, CARTES_TICKET54, CARTES_TICKET55, CAS_ESPACEMENT_TICKET49, CHAMPS_TICKET410, CIBLES_TICKET95, CLASSES_RACINE_TICKET410, CORRIGER_BUG14, CORRIGER_BUG20, DECLARATIONS_ESPACEMENT_TICKET49, LEGENDES_TICKET45, LIGNES_FORUM_TICKET410, LIGNE_OBJET_TICKET6, PROPRIETES_ESPACEMENT_TICKET49, PROPRIETES_RAYON_TICKET48, RELEVER_CARACTERISTIQUES_BACKLOG13, SECONDAIRE_TICKET6, TITRE_FORUM_REGLE_BUG10, choisirVariante, ecartsCaracteristiquesBacklog13, poserJetonsRedefinis } from './lib/variantes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const userscript = sansEntete(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_AVANT = 'd68ab55';
const avant = sansEntete(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_AVANT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const COMMIT_BOUTONS = '7bec452'; // recalage du sweep 9.12 (ancienne base d64c578) : entrées 9.1 à 9.10 comprises
const avantBoutons = sansEntete(process.env.KR_SCRIPT_AVANT_BOUTONS ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_BOUTONS, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_BOUTONS}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
// Base des modales Bootbox (ticket 3) : boutons hors du pied (barre BBCode, croix) et pied sur ordinateur égaux au bundle d'avant le ticket.
const COMMIT_MODALES = '8631c45';
const avantModales = sansEntete(process.env.KR_SCRIPT_AVANT_MODALES ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_MODALES, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_MODALES}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
// Base du bouton compact (ticket 4) : votes et pagination avant le ticket.
const COMMIT_COMPACT = '3b1da55';
const avantCompact = sansEntete(process.env.KR_SCRIPT_AVANT_COMPACT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_COMPACT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_COMPACT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const lire = f => fs.readFileSync(path.join(here, 'fixtures', f), 'utf8');
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const BASE = 'http://www.kraland.org';
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');

// Jetons de DESIGN.md (frontmatter : typography, rounded, spacing), en px.
const JETONS = {
  '--kr-font-label': '12px', '--kr-font-button-compact': '12px', '--kr-font-detail': '13px', '--kr-font-body': '14px',
  '--kr-font-body-mobile': '15px', '--kr-font-name': '15px', '--kr-font-forum-name': '15px', '--kr-font-section-title': '17px',
  '--kr-font-page-title': '36px', '--kr-font-button': '14px',
  '--kr-radius-sm': '4px', '--kr-radius-md': '8px', '--kr-radius-full': '9999px',
  '--kr-space-1': '4px', '--kr-space-2': '8px', '--kr-space-3': '12px', '--kr-space-4': '16px', '--kr-space-5': '24px', '--kr-space-6': '32px',
  '--kr-margin-mobile': '16px', '--kr-touch-target': '44px', '--kr-touch-target-dpad': '48px', '--kr-button-height': '34px'
};
// Variables de rayon retirées par le ticket 8 (reprises par --kr-radius-sm/-md/-full) : absentes de :root.
const JETONS_RETIRES = ['--kr-radius', '--mobile-radius', '--mobile-radius-lg'];
const VARIANTES = ['kraland', 'empire-brun-dark'];

// Pages et éléments mesurés : [clé, sélecteur, mobile seulement].
const PAGES = {
  plateau: { url: BASE + '/jouer/plateau', html: lire('typographie-formes.html'), elements: [
    ['label', '#etiquette-rang, #etiquette-mod'],
    ['badge', '#pastille-titre, #badge'],
    ['cloche', '.fa-bell ~ .badge'],
    ['ici', '.kr-room-here', true],
    ['stat', '.kr-stat-badge'],
    ['competence', '.kr-skill-badge'],
    ['groupe', '.dashboard-section-header .badge'],
    ['pnj', '.dashboard-card-pnj'],
    ['ordre', '.kr-order-modal .kr-order-badge']
  ] },
  forum: { url: BASE + '/forum/hrp/fixture-typographie-1', html: lire('typographie-formes.html'), elements: [
    ['tags', '.forum-tags a', true]
  ] },
  'index-rp': { url: BASE + '/forum/rp', html: lire('forum-index-rp.html'), elements: [['mod', '.label']] },
  'sous-forum': { url: BASE + '/forum/hrp/debuter-20102', html: lire('sous-forum-debuter.html'), elements: [['sujet', '.kr-topic-badge']] },
  kramail: { url: BASE + '/kramail/post/nouveau-4-2000', html: lire('kramail-nouveau.html'), kramail: true, elements: [
    ['annuaire', '.kd-opt:not(.kd-opt-free):not([aria-disabled="true"]) .kd-opt-tag'],
    ['deja', '.kd-opt[aria-disabled="true"] .kd-opt-tag'],
    ['libre', '.kd-opt-free .kd-opt-tag']
  ] }
};
// Mini-profil mobile (fixture plateau-qualite-usage.html : caractéristiques et compétences clonées dans le panneau) : pastilles absolues
// dans une boîte de 16 px, mesurées replié et déplié.
const MINI_PROFIL = { url: BASE + '/jouer/plateau', html: lire('plateau-qualite-usage.html') };
const SEL_MINI = '.mobile-mini-profile .kr-skill-icon .kr-skill-badge, .mobile-mini-profile .kr-skill-icon .kr-stat-badge';

// Annuaire fictif (forme de la réponse de ajaxsearch.php) : « mar » trouve deux noms inventés, tout le reste rien.
const ANNUAIRE = ['Marelle Duvent', 'Marcus Ferrand'];
function annuaire(q) {
  const hits = ANNUAIRE.filter(n => n.toLowerCase().includes(q.toLowerCase()));
  if (!hits.length) { return '<hr>'; }
  return '<strong>Membres</strong>&nbsp;' + hits.map(n => `[<a href="#" onClick='javascript:post_msg.dest.value=post_msg.dest.value+"${n}; ";return false;'>+</a>]${n};&nbsp;`).join('') + '<hr>';
}

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}

const browser = await launchBrowser();

// injection : 'corps' (défaut) évalue le bundle dès que <body> existe, au rappel d'un MutationObserver, donc à une avancée de l'analyse
// qui dépend de la charge machine ; 'fin' l'évalue à un point fixe, par un script en ligne placé avant </body> (aussitôt retiré).
// init : script d'initialisation en plus (masque DOM d'un bundle de base), posé avant le bundle.
async function ouvrir({ nom, width, height = 720, variante, script, label13 = false, css = '', init = null, tactile = width < 768, def: defBoutons, toucher = tactile, injection = 'corps' }) {
  const def = defBoutons || (nom === 'mini-profil' ? MINI_PROFIL : PAGES[nom]);
  const fin = injection === 'fin' && /<\/body>/i.test(def.html);
  const html = fin ? def.html.replace(/<\/body>(?![\s\S]*<\/body>)/i, '<script>document.currentScript.remove(); window.__krInjecter();</script></body>') : def.html;
  const mobile = tactile;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: toucher, deviceScaleFactor: 1 });
  await confineNetwork(context); // refus global EN PREMIER, routes des fixtures ensuite
  await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (u.href.split('#')[0] === def.url) { return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }); }
    if (u.pathname === '/ajaxsearch.php') { return route.fulfill({ status: 200, contentType: 'text/html', body: annuaire(u.searchParams.get('c[1]') || '') }); }
    if (u.pathname === '/lib/bootbox-4.4.0/bootbox.min.js') { return route.fulfill({ path: path.join(here, 'vendor/parler/bootbox.min.js'), contentType: 'application/javascript' }); }
    if (u.pathname.startsWith('/lib/bootstrap') || u.pathname.startsWith('/lib/jquery')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return route.fulfill({ path: path.join(VENDOR, file), contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript' });
    }
    if (u.pathname.endsWith('.css')) { return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    return route.abort();
  });
  await context.addInitScript(choisirVariante, variante);
  if (label13) { await context.addInitScript(poserJetonsRedefinis, ':root { --kr-font-label: 13px !important; }'); }
  if (css) { await context.addInitScript(poserJetonsRedefinis, css); }
  for (const f of [].concat(init || [])) { await context.addInitScript(f); }
  await context.addInitScript(({ src, gmErreur, aLaFin }) => {
    // gmErreur (Interface) : GM.xmlHttpRequest répond par une erreur, le changelog est chargé à vide et « Voir l'historique » est posé.
    window.GM = { xmlHttpRequest: o => { if (gmErreur && o && typeof o.onerror === 'function') { setTimeout(() => o.onerror({}), 0); } } };
    // Soumission neutralisée (aucun envoi, même depuis une fixture).
    window.addEventListener('submit', e => e.preventDefault(), true);
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (aLaFin) { window.__krInjecter = go; return; }
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { src: script, gmErreur: Boolean(def.gmErreur), aLaFin: fin });
  const page = await context.newPage();
  const erreurs = [];
  page.on('pageerror', e => erreurs.push(e.message));
  await page.goto(def.url, { waitUntil: 'load' });
  await krReady(page, { ready: THEME_READY, label: `${nom} ${variante} ${width} px` });
  await styleSettled(page, 'body');
  const kd = def.kramail ? await annuaireOuvert(page) : null;
  return { context, page, erreurs, kd };
}

// Kramail : options de l'annuaire (« mar »), puis le premier nom choisi (Entrée) et « mar » retapé (« déjà ajouté »), puis un nom absent
// de l'annuaire (« ajouter tel quel »). Chaque liste est relevée avant d'être remplacée par la suivante.
async function annuaireOuvert(page) {
  const saisir = async q => {
    await page.fill('.kd-input', '');
    await page.focus('.kd-input');
    await page.keyboard.type(q, { delay: 20 });
    await page.waitForFunction(qq => !document.querySelector('.kd-loading') && document.querySelector('.kd-input').value.trim() === qq && document.querySelector('.kd-opt'), q, { timeout: 5000 });
    await page.waitForTimeout(50);
  };
  await saisir('mar');
  const kd = await mesurerKd(page, 'annuaire');
  await page.keyboard.press('Enter');
  await saisir('mar');
  kd.push(...await mesurerKd(page, 'deja'));
  await saisir('xqzw');
  kd.push(...await mesurerKd(page, 'libre'));
  return kd;
}
const SEL_KD = Object.fromEntries(PAGES.kramail.elements.map(([k, s]) => [k, s]));
const mesurerKd = (page, cle) => page.evaluate(MESURE, [[cle, SEL_KD[cle]]]);

// Mesure dans la page : pour chaque clé, chaque élément trouvé (taille, graisse, couleurs).
function MESURE(liste) {
  return liste.map(([cle, sel]) => [cle, [...document.querySelectorAll(sel)].map(e => {
    const s = getComputedStyle(e);
    return { taille: s.fontSize, graisse: s.fontWeight, couleur: s.color, fond: s.backgroundColor,
      bordure: [s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor].join(' '), texte: (e.textContent || e.getAttribute('data-kr-label') || '').trim().slice(0, 30) };
  })]);
}

// Pastilles des caractéristiques (backlog 13) : niveau, valeurs calculées et valeurs des jetons de ce niveau (sonde posée à côté de la
// pastille, retirée aussitôt).
const PASTILLES13 = ([sel, jetons]) => [...document.querySelectorAll(sel)].map(e => {
  const st = x => { const s = getComputedStyle(x); return { couleur: s.color, fond: s.backgroundColor, bordure: [s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor].join(' ') }; };
  const niveau = Object.keys(jetons).find(n => e.classList.contains(n));
  const out = { texte: e.textContent.trim(), niveau: niveau || [...e.classList].join('.'), ...st(e) };
  if (niveau) {
    const [fond, couleur, bordure] = jetons[niveau];
    const sonde = document.createElement('span');
    sonde.style.cssText = `background-color: var(${fond}); color: var(${couleur}); border: 1px solid var(${bordure})`;
    e.parentElement.appendChild(sonde);
    out.attendu = st(sonde);
    sonde.remove();
  }
  return out;
});

async function relever(opts) {
  const { context, page, erreurs, kd } = await ouvrir(opts);
  const def = PAGES[opts.nom];
  const mobile = opts.width < 768;
  const attendus = def.elements.filter(([, , m]) => mobile || !m);
  let res;
  if (def.kramail) { res = kd; } else { res = await page.evaluate(MESURE, attendus.map(([k, s]) => [k, s])); }
  const stat = attendus.find(([k]) => k === 'stat');
  const pastilles = stat ? await page.evaluate(PASTILLES13, [stat[1], C13.pastilles]) : null;
  const jetons = await page.evaluate(noms => Object.fromEntries(noms.map(n => [n, getComputedStyle(document.documentElement).getPropertyValue(n).trim()])), Object.keys(JETONS));
  const retires = await page.evaluate(noms => noms.filter(n => getComputedStyle(document.documentElement).getPropertyValue(n).trim() !== ''), JETONS_RETIRES);
  await context.close();
  return { mesures: Object.fromEntries(res), attendus: attendus.map(([k]) => k), pastilles, jetons, retires, erreurs };
}

const etiquette = o => `${o.nom} ${o.variante} ${o.width} px`;

if (on('jetons')) {
  console.log('\n== jetons ==');
  const cas = VARIANTES.flatMap(variante => [375, 1280].map(width => ({ nom: 'plateau', variante, width })));
  const res = await mapLimit(cas, async c => ({ c, r: await relever({ ...c, script: userscript }), r13: await relever({ ...c, script: userscript, label13: true }) }));
  for (const { c, r, r13 } of res) {
    check(`${etiquette(c)} : jetons de :root égaux à DESIGN.md`, () => assert.deepEqual(r.jetons, JETONS, JSON.stringify(r.jetons)));
    check(`${etiquette(c)} : --kr-radius, --mobile-radius et --mobile-radius-lg absents de :root (ticket 8)`, () => assert.deepEqual(r.retires, [], r.retires.join(', ')));
    check(`${etiquette(c)} : --kr-font-label à 13 px suivi par toutes les étiquettes et pastilles`, () => {
      const vides = r13.attendus.filter(k => !(r13.mesures[k] || []).length);
      assert.deepEqual(vides, [], `éléments absents : ${vides.join(', ')}`);
      const hors = Object.entries(r13.mesures).flatMap(([k, l]) => l.filter(m => m.taille !== '13px').map(m => `${k} « ${m.texte} » ${m.taille}`));
      assert.deepEqual(hors, [], hors.join(' ; '));
    });
  }
  // Consommation sur les autres pages (forum, index, sous-forum, kramail) : 375 et 1280 px, Kraland.
  const autres = ['forum', 'index-rp', 'sous-forum', 'kramail'].flatMap(nom => [375, 1280].filter(w => nom !== 'forum' || w < 768).map(width => ({ nom, variante: 'kraland', width })));
  const res2 = await mapLimit(autres, async c => ({ c, r13: await relever({ ...c, script: userscript, label13: true }) }));
  for (const { c, r13 } of res2) {
    check(`${etiquette(c)} : --kr-font-label à 13 px suivi`, () => {
      const vides = r13.attendus.filter(k => !(r13.mesures[k] || []).length);
      assert.deepEqual(vides, [], `éléments absents : ${vides.join(', ')}`);
      const hors = Object.entries(r13.mesures).flatMap(([k, l]) => l.filter(m => m.taille !== '13px').map(m => `${k} « ${m.texte} » ${m.taille}`));
      assert.deepEqual(hors, [], hors.join(' ; '));
    });
  }
}

async function largeurs(titre, widths) {
  console.log(`\n== ${titre} ==`);
  const cas = Object.keys(PAGES).flatMap(nom => VARIANTES.flatMap(variante => widths.filter(w => nom !== 'forum' || w < 768).map(width => ({ nom, variante, width }))));
  // Écart accepté et consigné (épopée 5, entrée 4) : cloche et enveloppe en pastille d'état (fond non lu, texte surface) ; la base reçoit
  // CARTES_TICKET54 tant qu'elle précède l'entrée (AVANT_TICKET54).
  // Écart accepté et consigné (épopée 5, entrée 5) : « PNJ » des cartes, compteur de groupe et tags mobiles en étiquette de catégorie,
  // compteurs de contact du kramail en pastille d'état ; la base reçoit CARTES_TICKET55 tant qu'elle précède l'entrée (AVANT_TICKET55).
  // Retrait des deux : au prochain ticket qui modifie les étiquettes et pastilles ; il réaligne COMMIT_AVANT sur un SHA récent après
  // contrôle absolu des pastilles d'état et des étiquettes de catégorie (entrées 5.4 et 5.5).
  const cssAvant = (AVANT_TICKET54(avant) ? CARTES_TICKET54 : '') + (AVANT_TICKET55(avant) ? CARTES_TICKET55 : '');
  const res = await mapLimit(cas, async c => ({ c, r: await relever({ ...c, script: userscript }), a: await relever({ ...c, script: avant, css: cssAvant }) }));
  for (const { c, r, a } of res) {
    check(`${etiquette(c)} : étiquettes et pastilles présentes, 12 px gras`, () => {
      const vides = r.attendus.filter(k => !(r.mesures[k] || []).length);
      assert.deepEqual(vides, [], `éléments absents : ${vides.join(', ')}`);
      const hors = Object.entries(r.mesures).flatMap(([k, l]) => l.filter(m => m.taille !== '12px' || m.graisse !== '700').map(m => `${k} « ${m.texte} » ${m.taille}/${m.graisse}`));
      assert.deepEqual(hors, [], hors.join(' ; '));
    });
    // Pastilles des caractéristiques (stat) : égales aux jetons de leur niveau, ceux des pastilles de compétence (backlog 13), et non plus
    // au bundle de base (palette d'états du ticket 3.5).
    check(`${etiquette(c)} : couleur, fond et bordures égaux au bundle de base${r.pastilles ? ' (pastilles des caractéristiques à part)' : ''}`, () => {
      const ecarts = [];
      for (const [k, l] of Object.entries(r.mesures)) {
        if (k === 'stat') { continue; }
        const b = a.mesures[k] || [];
        if (b.length !== l.length) { ecarts.push(`${k} : ${l.length} élément(s) contre ${b.length}`); continue; }
        l.forEach((m, i) => ['couleur', 'fond', 'bordure'].forEach(p => { if (m[p] !== b[i][p]) { ecarts.push(`${k} « ${m.texte} » ${p} ${m[p]} au lieu de ${b[i][p]}`); } }));
      }
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    if (r.pastilles) {
      check(`${etiquette(c)} : pastilles des caractéristiques aux jetons de leur niveau, ceux des pastilles de compétence (backlog 13)`, () => {
        assert.ok(r.pastilles.length, 'aucune pastille de caractéristique');
        const ecarts = r.pastilles.flatMap(m => !m.attendu ? [`« ${m.texte} » niveau inconnu (${m.niveau})`] : ['couleur', 'fond', 'bordure'].filter(p => m[p] !== m.attendu[p]).map(p => `« ${m.texte} » ${m.niveau} ${p} ${m[p]} au lieu de ${m.attendu[p]}`));
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
    }
    check(`${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(r.erreurs, []));
  }
}

if (on('mobile')) { await largeurs('mobile', [375, 767]); }
if (on('bureau')) { await largeurs('bureau', [768, 769, 1280]); }

// Mini-profil : la pastille (12 px gras) tient dans sa boîte, sans débordement, replié puis déplié, à 375 et 700 px.
const MESURE_MINI = sel => [...document.querySelectorAll(sel)].map(e => {
  const s = getComputedStyle(e);
  return { texte: e.textContent.trim(), taille: s.fontSize, graisse: s.fontWeight, sw: e.scrollWidth, cw: e.clientWidth, sh: e.scrollHeight, ch: e.clientHeight };
});
if (on('mini-profil')) {
  console.log('\n== mini-profil ==');
  const cas = VARIANTES.flatMap(variante => [375, 700].map(width => ({ nom: 'mini-profil', variante, width })));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const etat = async cls => {
      await page.waitForFunction(k => { const mp = document.querySelector('.mobile-mini-profile'); return mp && mp.classList.contains(k) && mp.getAnimations({ subtree: true }).every(a => a.playState !== 'running'); }, cls, { timeout: 5000 });
      return page.evaluate(MESURE_MINI, SEL_MINI);
    };
    const replie = await etat('collapsed');
    await page.tap('.mobile-mini-profile-header');
    const deplie = await etat('expanded');
    await context.close();
    return { c, etats: { replié: replie, déplié: deplie }, erreurs };
  });
  for (const { c, etats, erreurs } of res) {
    for (const [nomEtat, l] of Object.entries(etats)) {
      check(`${etiquette(c)} ${nomEtat} : pastilles du mini-profil en 12 px gras, texte contenu dans la boîte`, () => {
        assert.ok(l.length >= 2, `${l.length} pastille(s)`);
        const hors = l.filter(m => m.taille !== '12px' || m.graisse !== '700' || m.sw > m.cw || m.sh > m.ch)
          .map(m => `« ${m.texte} » ${m.taille}/${m.graisse} ${m.sw}x${m.sh} dans ${m.cw}x${m.ch}`);
        assert.deepEqual(hors, [], hors.join(' ; '));
      });
    }
    check(`${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

// Bascule dans le même onglet (767, 768, 767 px) : la pastille de caractéristique reste en 12 px gras dans les deux modes.
if (on('bascule')) {
  console.log('\n== bascule ==');
  for (const variante of VARIANTES) {
    const { context, page, erreurs } = await ouvrir({ nom: 'plateau', width: 767, variante, script: userscript, tactile: false });
    const releves = [];
    const relevé = async width => {
      const r = await page.evaluate(sel => ({ mobile: document.body.classList.contains('mobile-mode'), l: [...document.querySelectorAll(sel)].map(e => getComputedStyle(e).fontSize + '/' + getComputedStyle(e).fontWeight) }), '.kr-stat-badge');
      releves.push({ width, ...r });
    };
    await relevé(767);
    for (const width of [768, 767]) {
      await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
      await page.setViewportSize({ width, height: 720 });
      await charge;
      await krReady(page, { ready: THEME_READY, label: `bascule ${variante} ${width} px` });
      await styleSettled(page, 'body');
      await relevé(width);
    }
    await context.close();
    for (const r of releves) {
      check(`bascule ${variante} ${r.width} px : mode ${r.width < 768 ? 'mobile' : 'bureau'}, .kr-stat-badge en 12 px gras`, () => {
        assert.equal(r.mobile, r.width < 768, 'mode');
        assert.ok(r.l.length > 0, 'aucune pastille');
        assert.deepEqual(r.l.filter(x => x !== '12px/700'), [], r.l.join(' '));
      });
    }
    check(`bascule ${variante} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

// ---------- Boutons de taille normale (ticket 2) ----------
// Pages : [clé, sélecteur, support ('mobile', 'bureau' ou les deux), filtre de texte (true : libellé non vide, false : vide)].
// Plateau : fixture plateau-qualite-usage.html avec le vrai Bootstrap (lien ajouté au chargement, comme sur le site) et une
// doublure de la taille native des .mini du site (12 px, .memlog.md:46 ; la feuille du site n'est pas servie).
const AVEC_BOOTSTRAP = html => html.replace('</head>', '<link rel="stylesheet" href="http://www.kraland.org/lib/bootstrap-3.3.7/css/bootstrap1.min.css">\n<style>.mini { font-size: 12px; }</style>\n</head>');
// Accueil : FIXTURE SYNTHÉTIQUE minimale (colonne droite avec .ds_user, où le template insère « Jouer »), aucune donnée réelle.
const ACCUEIL_BOUTONS = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fixture accueil (synthétique)</title><base href="http://www.kraland.org/"><link rel="stylesheet" href="lib/bootstrap-3.3.7/css/bootstrap1.min.css"></head>
<body><div id="content" class="container"><div class="row"><div class="col-md-3">gauche</div><div class="col-md-6">centre</div>
<div class="col-md-3"><div class="ds_user"><h4>Personnage d'essai</h4></div></div></div></div>
<script src="lib/jquery-3.3.1/jquery-3.3.1.min.js"></script><script src="lib/bootstrap-3.3.7/js/bootstrap.min.js"></script></body></html>`;
const MESSAGE = 'ul.media-list.forum > li.media > .media-body';
const PAGES_BOUTONS = {
  plateau: { url: BASE + '/jouer/plateau', html: AVEC_BOOTSTRAP(lire('plateau-qualite-usage.html')),
    vises: [['actions', '.kr-action-grid > .btn', 'bureau'], ['actions', '.mobile-quick-action.btn', 'mobile'], ['acces', '.kr-quick-access-buttons > .btn']],
    exclus: [['icones', '.kr-icon-cell']] },
  batiments: { url: BASE + '/jouer/plateau', html: lire('typographie-formes.html'), vises: [],
    exclus: [['batiments', '#col-right .row.center > a.btn', 'bureau']] },
  sujet: { url: BASE + '/forum/sujet/messages-v3-329425-1', html: lire('forum-sujet.html'),
    vises: [['entete', '.forum-top .pull-right > .btn', 'bureau', true], ['entete', '.forum-thread-action', 'mobile'], ['repondre', `${MESSAGE} > .pull-right a[href*="forum/post/repondre-"], ${MESSAGE} > .pull-right .kr-msg-more`, 'mobile']],
    exclus: [['entete-icones', '.forum-top .pull-right > .btn', 'bureau', false], ['messages', `${MESSAGE} .btn-group-xs .btn:not([href*="forum/post/repondre-"])`]] },
  'sous-forum': { url: BASE + '/forum/hrp/debuter-20102', html: lire('sous-forum-debuter.html'),
    vises: [['entete', 'h1.page-header .pull-right > .btn', 'bureau', true], ['entete', '.forum-thread-action', 'mobile']],
    exclus: [['fleches', '#topics td p.mini .btn-group .btn']] },
  redaction: { url: BASE + '/kramail/post/nouveau-4-2000', html: lire('kramail-nouveau.html'), blocage: true,
    vises: [['envoyer', 'form[name="post_msg"] button.btn-primary.pull-right', 'bureau'], ['entete', 'h1.page-header .pull-right > .btn', 'bureau'],
      ['ajouter-effacer', 'form[name="post_msg"] .kd-msg-btn']],
    exclus: [['bbcode', 'form[name="post_msg"] .btn-toolbar .btn'], ['envoyer-mobile', 'form[name="post_msg"] button.btn-primary.pull-right', 'mobile'],
      ['entete-icones', 'h1.page-header .pull-right > .btn', 'mobile']] },
  // « + » des contacts : dans le champ natif que le widget Destinataires masque (.kd-natif-cache) ; rendu visible pour la mesure.
  contacts: { url: BASE + '/kramail/post/nouveau-4-2000', html: lire('kramail-nouveau.html'),
    forcer: 'html body.page-kramail-compose form[name="post_msg"] .kd-natif-cache { display: block !important; }',
    vises: [['plus', '.editeur-text .input-group-addon .btn']], exclus: [] },
  reception: { url: BASE + '/kramail/personnage-fictif-2000-0', html: lire('kramail-reception.html'),
    vises: [['entete', 'h1.page-header .pull-right > .btn', 'bureau', true], ['liste', 'table thead th .btn-group > .btn', 'bureau']],
    exclus: [['entete-icones', 'h1.page-header .pull-right > .btn', 'bureau', false], ['entete-icones', 'h1.page-header .pull-right .btn', 'mobile']] },
  interface: { url: BASE + '/profil/interface', html: lire('palette-nation-profil.html'), gmErreur: true, historique: true,
    vises: [['sauvegarde', '#kr-config-export-btn, #kr-config-import-btn'], ['historique', '#kr-changelog-btn'], ['pied', '.kr-changelog-footer button']],
    exclus: [] },
  accueil: { url: BASE + '/accueil', html: ACCUEIL_BOUTONS, vises: [['jouer', '.accueil-play-btn']], exclus: [] },
  // Modales Bootbox (ticket 3) : ordre Dormir et confirmation hors ordre avec une barre BBCode (gabarit inventé, comme celui du site) ;
  // sur mobile, boutons du pied et « ? Aide » visés ; barre BBCode, croix et, sur ordinateur, tous les boutons égaux à la base COMMIT_MODALES.
  'modale-ordre': { url: BASE + '/jouer/plateau', html: lire('modale-ordre/plateau.html'), modale: `<div id="ajax-order">${lire('modale-ordre/dormir.html')}</div>`, base: 'modales',
    vises: [['pied', '.modal .modal-footer .btn', 'mobile'], ['aide', '.modal .kr-order-help-toggle', 'mobile']],
    exclus: [['modale', '.modal .btn, .modal button', 'bureau'], ['hors-pied', '.modal :is(.btn, button):not(.modal-footer *):not(.kr-order-help-toggle)', 'mobile']] },
  'modale-bbcode': { url: BASE + '/jouer/plateau', html: lire('modale-ordre/plateau.html'), base: 'modales',
    modale: '<p>Message</p><div class="btn-toolbar"><div class="btn-group btn-group-xs"><button type="button" class="btn btn-default"><i class="fa fa-bold"></i></button><button type="button" class="btn btn-default">Smileys</button></div></div>',
    vises: [['pied', '.modal .modal-footer .btn', 'mobile']],
    exclus: [['modale', '.modal .btn, .modal button', 'bureau'], ['hors-pied', '.modal :is(.btn, button):not(.modal-footer *)', 'mobile']] },
  tableau: { url: BASE + '/regles/avancees', html: lire('palette-nation-composants.html'), vises: [],
    exclus: [['groupe', '.dashboard-group-buttons .btn']] }
};
const LARGEURS_BOUTONS = [375, 767, 768, 769, 1280, 1440, 1920];
const MESURE_BOUTONS = liste => liste.map(([cle, sel]) => [cle, [...document.querySelectorAll(sel)].filter(e => e.getClientRects().length).map(e => {
  const s = getComputedStyle(e);
  return { taille: s.fontSize, hauteur: Math.round(e.getBoundingClientRect().height * 10) / 10, padding: s.padding, texte: (e.textContent || e.value || '').trim().slice(0, 30) };
})]);
const pourSupport = (liste, mobile) => liste.filter(([, , sup]) => !sup || sup === (mobile ? 'mobile' : 'bureau'));
// Clé unique par support (deux entrées de même clé ne coexistent jamais sur un même support).
const filtrer = (l, texte) => (texte === undefined ? l : l.filter(m => Boolean(m.texte) === texte));

async function releverBoutons({ nom, width, variante, script, toucher, css }) {
  const def = PAGES_BOUTONS[nom];
  const mobile = width < 768;
  const { context, page, erreurs } = await ouvrir({ nom, width, height: mobile ? 667 : 900, variante, script, def, toucher, css });
  if (def.blocage) {
    // Saisie non validée dans Destinataires puis « Envoyer » : l'envoi est bloqué, « Ajouter » et « Effacer » s'affichent (aucun envoi).
    await page.fill('input[name="c[1]"]', 'Sujet de test');
    await page.fill('#message', 'Corps du message');
    await page.focus('.kd-input');
    await page.keyboard.type('xqzw', { delay: 20 });
    await page.waitForFunction(() => !document.querySelector('.kd-loading'), null, { timeout: 5000 });
    await page.click('form[name="post_msg"] button.btn-primary');
    await page.waitForFunction(() => document.querySelector('.kd-msg-btn'), null, { timeout: 5000 });
    await page.waitForTimeout(100);
  }
  if (def.forcer) { await page.addStyleTag({ content: def.forcer }); }
  if (def.modale) {
    // Ouverture comme le site (bootbox.confirm, libellés par défaut) ; le rappel ne valide rien.
    await page.waitForFunction(() => window.bootbox, null, { timeout: 5000 });
    await page.evaluate(m => { window.bootbox.confirm(m, () => false); }, def.modale);
    await page.waitForFunction(() => document.querySelector('.modal.in'), null, { timeout: 5000 });
    await page.waitForTimeout(400);
  }
  const vises = pourSupport(def.vises, mobile);
  const exclus = pourSupport(def.exclus, mobile);
  const avantPied = def.historique ? vises.filter(([k]) => k !== 'pied') : vises;
  const res = { vises: Object.fromEntries((await page.evaluate(MESURE_BOUTONS, avantPied.map(([k, s]) => [k, s]))).map(([k, l], i) => [k, filtrer(l, avantPied[i][3])])),
    exclus: Object.fromEntries((await page.evaluate(MESURE_BOUTONS, exclus.map(([k, s]) => [k, s]))).map(([k, l], i) => [k, filtrer(l, exclus[i][3])])) };
  if (def.historique) {
    // Section repliée : clic DOM sur le bouton (action locale du thème, aucune requête).
    await page.$eval('#kr-changelog-btn', b => b.click());
    await page.waitForFunction(() => document.querySelector('.kr-changelog-footer button') && document.querySelector('.kr-changelog-footer button').getClientRects().length, null, { timeout: 5000 });
    await page.waitForTimeout(400);
    Object.assign(res.vises, Object.fromEntries(await page.evaluate(MESURE_BOUTONS, [['pied', '.kr-changelog-footer button']])));
  }
  res.erreurs = erreurs;
  res.cles = { vises: vises.map(([k]) => k), exclus: exclus.map(([k]) => k) };
  await context.close();
  return res;
}

const decrire = (k, m) => `${k} « ${m.texte} » ${m.taille}/${m.hauteur} px`;
function verifierVises(r, mobile) {
  const vides = r.cles.vises.filter(k => !(r.vises[k] || []).length);
  assert.deepEqual(vides, [], `boutons absents : ${vides.join(', ')}`);
  const hors = Object.entries(r.vises).flatMap(([k, l]) => l.filter(m => m.taille !== '14px' || (mobile ? m.hauteur < 43.5 : Math.abs(m.hauteur - 34) > 0.5)).map(m => decrire(k, m)));
  assert.deepEqual(hors, [], hors.join(' ; '));
}
function verifierExclus(r, a) {
  const vides = r.cles.exclus.filter(k => !(r.exclus[k] || []).length);
  assert.deepEqual(vides, [], `exclusions absentes : ${vides.join(', ')}`);
  const ecarts = [];
  for (const [k, l] of Object.entries(r.exclus)) {
    const b = a.exclus[k] || [];
    if (b.length !== l.length) { ecarts.push(`${k} : ${l.length} élément(s) contre ${b.length}`); continue; }
    l.forEach((m, i) => ['taille', 'hauteur', 'padding'].forEach(p => { if (m[p] !== b[i][p]) { ecarts.push(`${k} « ${m.texte} » ${p} ${m[p]} au lieu de ${b[i][p]}`); } }));
  }
  assert.deepEqual(ecarts, [], ecarts.join(' ; '));
}

if (on('boutons')) {
  console.log('\n== boutons ==');
  const cas = Object.keys(PAGES_BOUTONS).flatMap(nom => VARIANTES.flatMap(variante => LARGEURS_BOUTONS.map(width => ({ nom, variante, width }))));
  // Écart accepté et consigné (ticket 5) : légendes des compétences en 12 px posées sur un bundle de base antérieur (LEGENDES_TICKET45).
  // Retrait : au prochain ticket qui modifie les boutons ; il réaligne COMMIT_BOUTONS et COMMIT_MODALES sur un SHA récent après contrôle
  // absolu des légendes des compétences en 12 px (ticket 4.5).
  const baseBoutons = nom => (PAGES_BOUTONS[nom].base === 'modales' ? avantModales : avantBoutons);
  // Écart accepté et consigné (épopée 9, entrée 5) : boutons des groupes à 44 px en mobile posés sur un bundle de base antérieur (CIBLES_TICKET95).
  const masqueBoutons = nom => [PAGES_BOUTONS[nom].exclus.length && AVANT_TICKET45(baseBoutons(nom)) ? LEGENDES_TICKET45 : '',
    PAGES_BOUTONS[nom].exclus.length && AVANT_TICKET95(baseBoutons(nom)) ? CIBLES_TICKET95 : ''].filter(Boolean).join('\n');
  for (const nom of Object.keys(PAGES_BOUTONS).filter(n => PAGES_BOUTONS[n].exclus.length && AVANT_TICKET45(baseBoutons(n)))) { console.log(`  info écart accepté et consigné : ${nom}, légendes des compétences en 12 px (plancher PLT-QU, épopée 4, ticket 5) posées sur le bundle de base`); }
  for (const nom of Object.keys(PAGES_BOUTONS).filter(n => PAGES_BOUTONS[n].exclus.length && AVANT_TICKET95(baseBoutons(n)))) { console.log(`  info écart accepté et consigné : ${nom}, actions des cartes et boutons des groupes à 44 px en mobile (épopée 9, entrée 5) posés sur le bundle de base`); }
  const res = await mapLimit(cas, async c => ({ c, r: await releverBoutons({ ...c, script: userscript }),
    a: PAGES_BOUTONS[c.nom].exclus.length ? await releverBoutons({ ...c, script: baseBoutons(c.nom), css: masqueBoutons(c.nom) }) : null }));
  for (const { c, r, a } of res) {
    const mobile = c.width < 768;
    if (pourSupport(PAGES_BOUTONS[c.nom].vises, mobile).length) {
      check(`boutons ${etiquette(c)} : boutons de la liste en 14 px, ${mobile ? 'hauteur ≥ 44 px' : 'hauteur 34 px'}`, () => verifierVises(r, mobile));
    }
    if (a) { check(`boutons ${etiquette(c)} : exclusions (font-size, hauteur, padding) égales au bundle de base`, () => verifierExclus(r, a)); }
    check(`boutons ${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(r.erreurs, []));
  }
  // Ordinateur tactile (pointer: coarse) : boutons d'action et d'accès rapide gardent 44 px.
  for (const variante of VARIANTES) {
    const { context, page } = await ouvrir({ nom: 'plateau', width: 1280, height: 900, variante, script: userscript, def: PAGES_BOUTONS.plateau, tactile: false, toucher: true });
    const r = await page.evaluate(sel => ({ grossier: window.matchMedia('(pointer: coarse)').matches, l: [...document.querySelectorAll(sel)].map(e => ({ taille: getComputedStyle(e).fontSize, hauteur: e.getBoundingClientRect().height, texte: e.textContent.trim() })) }),
      '.kr-action-grid > .btn, .kr-quick-access-buttons > .btn');
    await context.close();
    check(`boutons plateau ${variante} 1280 px tactile (pointer: coarse) : actions et accès rapides en 14 px, hauteur ≥ 44 px`, () => {
      assert.equal(r.grossier, true, 'pointer: coarse non émulé');
      assert.ok(r.l.length >= 9, `${r.l.length} bouton(s)`);
      const hors = r.l.filter(m => m.taille !== '14px' || m.hauteur < 43.5).map(m => decrire('plateau', m));
      assert.deepEqual(hors, [], hors.join(' ; '));
    });
  }
}

// Bascule dans le même onglet (767, 768, 767 px) : accès rapides du plateau en 14 px, 34 px sur ordinateur, ≥ 44 px sur mobile.
if (on('boutons-bascule')) {
  console.log('\n== boutons-bascule ==');
  for (const variante of VARIANTES) {
    const { context, page, erreurs } = await ouvrir({ nom: 'plateau', width: 767, variante, script: userscript, def: PAGES_BOUTONS.plateau, tactile: false });
    const releves = [];
    const relevé = async width => {
      const r = await page.evaluate(sel => ({ mobile: document.body.classList.contains('mobile-mode'), l: [...document.querySelectorAll(sel)].map(e => ({ taille: getComputedStyle(e).fontSize, hauteur: Math.round(e.getBoundingClientRect().height * 10) / 10, texte: e.textContent.trim() })) }), '.kr-quick-access-buttons > .btn');
      releves.push({ width, ...r });
    };
    await relevé(767);
    for (const width of [768, 767]) {
      await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
      await page.setViewportSize({ width, height: 720 });
      await charge;
      await krReady(page, { ready: THEME_READY, label: `boutons-bascule ${variante} ${width} px` });
      await styleSettled(page, 'body');
      await relevé(width);
    }
    await context.close();
    for (const r of releves) {
      const mobile = r.width < 768;
      check(`boutons-bascule ${variante} ${r.width} px : mode ${mobile ? 'mobile' : 'bureau'}, accès rapides en 14 px, ${mobile ? 'hauteur ≥ 44 px' : 'hauteur 34 px'}`, () => {
        assert.equal(r.mobile, mobile, 'mode');
        assert.ok(r.l.length >= 5, `${r.l.length} bouton(s)`);
        const hors = r.l.filter(m => m.taille !== '14px' || (mobile ? m.hauteur < 43.5 : Math.abs(m.hauteur - 34) > 0.5)).map(m => decrire('accès', m));
        assert.deepEqual(hors, [], hors.join(' ; '));
      });
    }
    check(`boutons-bascule ${variante} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

// ---------- Bouton compact (ticket 4) ----------
// [clé, sélecteur, visé, affiché sur ordinateur seulement] : visé = 12 px et rayon sm sur ordinateur ; sinon égal à la base partout.
// Sous-forum mobile : lignes en cartes, pages du sujet masquées (aussi dans la base) ; seul le nombre d'éléments affichés est comparé.
const PAGES_COMPACT = {
  sujet: { url: BASE + '/forum/sujet/messages-v3-329425-1', html: lire('forum-sujet.html'), elements: [
    ['votes', `${MESSAGE} > .pull-right > .btn-group-xs[id^="ajax-"] > .btn`, true],
    ['pagination', '.center > ul.pagination:not(:has(select)) > li > :is(a, span)', true],
    ['autres', `${MESSAGE} .btn-group-xs:not([id^="ajax-"]) > .btn`, false]
  ] },
  'sous-forum': { url: BASE + '/forum/hrp/debuter-20102', html: lire('sous-forum-debuter.html'), elements: [
    ['pagination', '#topics tbody > tr > td:first-child > ul.pagination:not(:first-of-type) > li > a', true, true]
  ] }
};
const MESURE_COMPACT = liste => liste.map(([cle, sel]) => [cle, [...document.querySelectorAll(sel)].filter(e => e.getClientRects().length).map(e => {
  const s = getComputedStyle(e);
  return { taille: s.fontSize, hauteur: Math.round(e.getBoundingClientRect().height * 10) / 10,
    rayons: [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius],
    couleur: s.color, fond: s.backgroundColor, bordure: [s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor].join(' '),
    padding: s.padding, texte: (e.textContent || '').trim().slice(0, 30) };
})]);
async function releverCompact({ nom, width, variante, script, css }) {
  const def = PAGES_COMPACT[nom];
  const { context, page, erreurs } = await ouvrir({ nom, width, height: width < 768 ? 667 : 900, variante, script, def, css });
  const res = Object.fromEntries(await page.evaluate(MESURE_COMPACT, def.elements.map(([k, s]) => [k, s])));
  await context.close();
  return { res, erreurs };
}
if (on('compact')) {
  console.log('\n== compact ==');
  const cas = Object.keys(PAGES_COMPACT).flatMap(nom => VARIANTES.flatMap(variante => [375, 767, 768, 1280, 1440, 1920].map(width => ({ nom, variante, width }))));
  const res = await mapLimit(cas, async c => ({ c, r: await releverCompact({ ...c, script: userscript }), a: await releverCompact({ ...c, script: avantCompact }) }));
  for (const { c, r, a } of res) {
    const mobile = c.width < 768;
    for (const [k, , vise, bureauSeul] of PAGES_COMPACT[c.nom].elements) {
      const l = r.res[k] || [];
      const b = a.res[k] || [];
      const cible = vise && !mobile;
      check(`compact ${etiquette(c)} ${k} : ${cible ? '12 px, rayon 4 px aux coins arrondis, hauteur et couleurs de la base' : 'égal au bundle de base, rayon du rôle (4 px, ticket 8)'}`, () => {
        if (!(mobile && bureauSeul)) { assert.ok(l.length > 0, 'aucun élément'); }
        assert.equal(l.length, b.length, `${l.length} élément(s) contre ${b.length}`);
        const ecarts = [];
        l.forEach((m, i) => {
          const o = b[i];
          const d = p => ecarts.push(`« ${m.texte} » ${p} ${JSON.stringify(m[p])} au lieu de ${JSON.stringify(o[p])}`);
          ['couleur', 'fond', 'bordure'].forEach(p => { if (m[p] !== o[p]) { d(p); } });
          if (cible) {
            if (m.taille !== '12px') { ecarts.push(`« ${m.texte} » taille ${m.taille}`); }
            if (Math.abs(m.hauteur - o.hauteur) > 0.5) { d('hauteur'); }
            if (m.padding !== o.padding) { d('padding'); }
            const attendus = o.rayons.map(x => (parseFloat(x) > 0 ? '4px' : '0px'));
            if (JSON.stringify(m.rayons) !== JSON.stringify(attendus)) { ecarts.push(`« ${m.texte} » rayons ${m.rayons.join(' ')} au lieu de ${attendus.join(' ')}`); }
          } else {
            ['taille', 'hauteur', 'padding'].forEach(p => { if (m[p] !== o[p]) { d(p); } });
            // Ticket 8 (rayons, story-trois-rayons-4-px-8-px-et-plein-plan) : contrôles à 4 px (rôle C4) aux coins arrondis par la base.
            const role = o.rayons.map(x => (parseFloat(x) > 0 ? '4px' : '0px'));
            if (JSON.stringify(m.rayons) !== JSON.stringify(role)) { ecarts.push(`« ${m.texte} » rayons ${m.rayons.join(' ')} au lieu de ${role.join(' ')}`); }
          }
        });
        if (cible) { assert.ok(b.some(o => o.rayons.some(x => parseFloat(x) > 0)), 'aucun coin arrondi dans la base'); }
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
    }
    check(`compact ${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(r.erreurs, []));
  }
  // Consommation des jetons : --kr-font-button-compact à 13 px et --kr-radius-sm à 7 px redéfinis par une feuille adoptée, 1280 px :
  // éléments visés en 13 px, coins arrondis par la base à 7 px, coins carrés conservés.
  const REDEFINIS = ':root { --kr-font-button-compact: 13px !important; --kr-radius-sm: 7px !important; }';
  const casJetons = Object.keys(PAGES_COMPACT).map(nom => ({ nom, variante: 'kraland', width: 1280 }));
  const resJetons = await mapLimit(casJetons, async c => ({ c, r: await releverCompact({ ...c, script: userscript, css: REDEFINIS }), a: await releverCompact({ ...c, script: avantCompact }) }));
  for (const { c, r, a } of resJetons) {
    for (const [k, , vise] of PAGES_COMPACT[c.nom].elements.filter(([, , v]) => v)) {
      check(`compact ${etiquette(c)} ${k} : jetons redéfinis (13 px, rayon 7 px) suivis`, () => {
        const l = r.res[k] || [];
        const b = a.res[k] || [];
        assert.ok(vise && l.length > 0 && l.length === b.length, `${l.length} élément(s) contre ${b.length}`);
        const ecarts = [];
        l.forEach((m, i) => {
          if (m.taille !== '13px') { ecarts.push(`« ${m.texte} » taille ${m.taille}`); }
          const attendus = b[i].rayons.map(x => (parseFloat(x) > 0 ? '7px' : '0px'));
          if (JSON.stringify(m.rayons) !== JSON.stringify(attendus)) { ecarts.push(`« ${m.texte} » rayons ${m.rayons.join(' ')} au lieu de ${attendus.join(' ')}`); }
        });
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
    }
  }
}

// ---------- Échelle typographique (ticket 5) ----------
// Pages de jeu : Matériel (FIXTURE SYNTHÉTIQUE typographie-echelle.html : en-têtes, noms et valeurs, carte du tableau de bord, texte
// courant, champ, jauges du mini-profil), Personnage (jeu-perso.html) et plateau (plateau-qualite-usage.html, avec le vrai Bootstrap) ;
// hors jeu : sous-forum (sous-forum-debuter.html) et réception du kramail (kramail-reception.html). Le sujet du forum (forum-sujet.html)
// n'a pas d'en-tête de panneau.
const COMMIT_ECHELLE = '7bec452'; // recalage du sweep 9.12 (ancienne base d64c578) : entrées 9.1 à 9.10 comprises
const avantEchelle = sansEntete(process.env.KR_SCRIPT_AVANT_ECHELLE ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_ECHELLE, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_ECHELLE}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
// Base du ticket 6 (plateau inchangé) : bundle d'avant le ticket.
const COMMIT_TICKET6 = '1590761';
const avantTicket6 = sansEntete(process.env.KR_SCRIPT_AVANT_TICKET6 ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_TICKET6, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_TICKET6}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const PLATEAU_OBJETS = { url: BASE + '/jouer/plateau', html: lire('jeu-plateau-objets.html') };
const PAGES_ECHELLE = {
  materiel: { url: BASE + '/jouer/materiel', html: lire('typographie-echelle.html'), jeu: true },
  perso: { url: BASE + '/jouer/perso', html: lire('jeu-perso.html'), jeu: true, plancherContenu: true },
  plateau: { url: BASE + '/jouer/plateau', html: AVEC_BOOTSTRAP(lire('plateau-qualite-usage.html')), jeu: true, sansTitre: true },
  'sous-forum': { url: BASE + '/forum/hrp/debuter-20102', html: lire('sous-forum-debuter.html') },
  kramail: { url: BASE + '/kramail/personnage-fictif-2000-0', html: lire('kramail-reception.html') },
  // Ticket 6 : Matériel, Bâtiments et Employés (FIXTURES SYNTHÉTIQUES jeu-materiel.html, jeu-batiments.html, jeu-employes.html, squelette
  // relevé, lignes de Bâtiments et d'Employés reconstruites) ; plancher mesuré dans #content à toutes les largeurs (pied de page du site en
  // 10 px en style en ligne), Personnage compris (plancherContenu).
  'jeu-materiel': { url: BASE + '/jouer/materiel', html: lire('jeu-materiel.html'), jeu: true, objets: true },
  bat: { url: BASE + '/jouer/bat', html: lire('jeu-batiments.html'), jeu: true, objets: true },
  pnj: { url: BASE + '/jouer/pnj', html: lire('jeu-employes.html'), jeu: true, objets: true }
};
// En-tête de panneau : titre de premier niveau de .panel-heading, hors accordéon (.panel-group) et hors modale.
const SEL_TITRES = '.panel:not(.panel-group .panel):not(.modal .panel) > .panel-heading > :is(.panel-title, h1, h2, h3, h4, h5, h6)';
const SEL_ECHELLE = {
  titres: SEL_TITRES,
  noms: '#col-right .panel-body .list-group-item-heading, .dashboard-card-name',
  details: '.dashboard-card-status',
  texte: '#texte-courant',
  champ: '#champ-essai',
  onglets: '.mobile-tab-bar .mobile-tab-label',
  jauges: '.mobile-gauge-compact-label, .mobile-gauge-compact-value',
  batiment: '#panneau-batiment .building-section-content h4.list-group-item-heading',
  // Ticket 6 : détails des pages de jeu (texte de ligne, charge, cadre de charge, alerte d'Employés) et objets déplacés du plateau.
  detailsJeu: `${LIGNE_OBJET_TICKET6} > :is(.list-group-item-text, .mention), #col-right .dashboard > .well, #col-right .panel-body > .alert`,
  deplaces: '.kr-materiel-moved .panel-body .list-group-item-heading',
  deplacesDetails: '.kr-materiel-moved .panel-body :is(.list-group-item-text, .mention)',
  // Lignes d'objet et couleur secondaire attendue de la charge (lib/variantes.mjs), lues à part par MESURE_ECHELLE.
  ligne: LIGNE_OBJET_TICKET6,
  secondaire: SECONDAIRE_TICKET6
};
const MESURE_ECHELLE = ({ ligne, secondaire: couleurSecondaire, ...sels }) => {
  const vu = e => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const res = Object.fromEntries(Object.entries(sels).map(([k, sel]) => [k, [...document.querySelectorAll(sel)].filter(vu).map(e => {
    const s = getComputedStyle(e);
    return { taille: s.fontSize, graisse: s.fontWeight, sw: e.scrollWidth, cw: e.clientWidth, texte: (e.textContent || e.value || '').trim().slice(0, 30) };
  })]));
  // Plancher : tout élément visible portant lui-même du texte (nœud texte non vide), boîte de plus de 1 px (hors .sr-only).
  res.plancher = [...document.body.querySelectorAll('*')].filter(e => !['SCRIPT', 'STYLE'].includes(e.tagName) && vu(e)
    && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
    && (r => r.width > 1 && r.height > 1)(e.getBoundingClientRect())
    && e.checkVisibility({ opacityProperty: true, visibilityProperty: true }))
    .map(e => ({ taille: getComputedStyle(e).fontSize, texte: [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').slice(0, 30), cls: e.className && e.className.baseVal === undefined ? String(e.className).slice(0, 40) : e.tagName,
      contenu: Boolean(e.closest('#content')), droite: Boolean(e.closest('#col-right, .kr-materiel-moved')) }));
  res.mobile = document.body.classList.contains('mobile-mode');
  // Lignes d'objet (ticket 6) : élément de liste enfant de .panel-body de #col-right, avec une charge non vide ; chaque ligne est amenée
  // au milieu de l'écran (scrollTo) avant la mesure de la cible (elementFromPoint au centre de la charge).
  const sonde = document.createElement('span');
  sonde.style.color = couleurSecondaire;
  (document.getElementById('col-right') || document.body).appendChild(sonde);
  const secondaire = getComputedStyle(sonde).color;
  sonde.remove();
  res.lignes = [...document.querySelectorAll(ligne)].filter(a => vu(a)).map(a => {
    const ch = a.querySelector(':scope > .mention');
    if (!ch || !(ch.textContent.trim() || ch.querySelector('img'))) { return null; }
    window.scrollTo(0, window.scrollY + a.getBoundingClientRect().top - window.innerHeight / 2);
    const img = a.querySelector(':scope > img');
    const nom = a.querySelector(':scope > .list-group-item-heading');
    const [ra, rc, rn] = [a, ch, nom].map(e => e.getBoundingClientRect());
    const s = getComputedStyle(a);
    const cible = document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);
    // Texte réel du nom (Range), pas la boîte du titre : un mot qui déborde de sa piste de grille passe sous la charge.
    const plage = document.createRange();
    plage.selectNodeContents(nom);
    const textes = [...plage.getClientRects()].filter(r => r.width > 0 && r.height > 0);
    return { texte: nom.textContent.trim().slice(0, 30), premier: a.firstElementChild === ch, image: Boolean(img),
      imageAGauche: img ? img.getBoundingClientRect().right <= rn.left + 0.5 : null,
      nomAuBord: Math.abs(rn.left - ra.left - parseFloat(s.paddingLeft) - parseFloat(s.borderLeftWidth)),
      ecartDroit: Math.abs(ra.right - parseFloat(s.paddingRight) - parseFloat(s.borderRightWidth) - rc.right),
      memeLigne: rc.top < rn.bottom && rn.top < rc.bottom,
      chevauchement: textes.length === 0 || textes.some(r => r.right > rc.left + 0.5 && r.left < rc.right - 0.5 && r.top < rc.bottom && rc.top < r.bottom)
        || Math.max(...textes.map(r => r.right)) > ra.right - parseFloat(s.paddingRight) + 0.5,
      couleur: getComputedStyle(ch).color, secondaire, cible: Boolean(cible && cible.closest('a') === a) };
  }).filter(Boolean);
  window.scrollTo(0, 0);
  return res;
};
async function releverEchelle({ nom, width, variante, script, css, deplier = false }) {
  const def = PAGES_ECHELLE[nom];
  const { context, page, erreurs } = await ouvrir({ nom, width, height: width < 768 ? 667 : 900, variante, script, def, css });
  const res = { replie: await page.evaluate(MESURE_ECHELLE, SEL_ECHELLE) };
  if (deplier) {
    await page.waitForFunction(() => { const mp = document.querySelector('.mobile-mini-profile'); return mp && mp.getAnimations({ subtree: true }).every(a => a.playState !== 'running'); }, null, { timeout: 5000 });
    await page.tap('.mobile-mini-profile-header');
    await page.waitForFunction(() => { const mp = document.querySelector('.mobile-mini-profile'); return mp && mp.classList.contains('expanded') && mp.getAnimations({ subtree: true }).every(a => a.playState !== 'running'); }, null, { timeout: 5000 });
    res.deplie = await page.evaluate(MESURE_ECHELLE, SEL_ECHELLE);
  }
  await context.close();
  return { ...res, erreurs };
}
const tailles = (l, taille, graisse) => l.filter(m => m.taille !== taille || (graisse && m.graisse !== graisse)).map(m => `« ${m.texte} » ${m.taille}/${m.graisse}`);
const sousPlancher = (l, min) => l.filter(m => parseFloat(m.taille) < min).map(m => `« ${m.texte} » (${m.cls}) ${m.taille}`);
if (on('echelle')) {
  console.log('\n== echelle ==');
  const LARGEURS = [375, 767, 768, 769, 1280, 1440, 1920];
  const cas = Object.keys(PAGES_ECHELLE).flatMap(nom => VARIANTES.flatMap(variante => LARGEURS.map(width => ({ nom, variante, width }))));
  const res = await mapLimit(cas, async c => ({ c, r: await releverEchelle({ ...c, script: userscript }),
    a: c.nom === 'materiel' ? await releverEchelle({ ...c, script: avantEchelle }) : null }));
  for (const { c, r, a } of res) {
    const mobile = c.width < 768;
    const m = r.replie;
    const def = PAGES_ECHELLE[c.nom];
    check(`echelle ${etiquette(c)} : mode ${mobile ? 'mobile' : 'bureau'}, en-têtes de panneau en 17 px / 700`, () => {
      assert.equal(m.mobile, mobile, 'mode');
      assert.ok(def.sansTitre ? m.titres.length === 0 : m.titres.length > 0, `${m.titres.length} en-tête(s)`);
      const hors = tailles(m.titres, '17px', '700');
      assert.deepEqual(hors, [], hors.join(' ; '));
    });
    if (c.nom === 'materiel') {
      check(`echelle ${etiquette(c)} : noms et valeurs en 15 px / 600, détails en 13 px`, () => {
        assert.ok(m.noms.length >= 3 && m.details.length >= 1, `${m.noms.length} nom(s), ${m.details.length} détail(s)`);
        const hors = [...tailles(m.noms, '15px', '600'), ...tailles(m.details, '13px')];
        assert.deepEqual(hors, [], hors.join(' ; '));
      });
      check(`echelle ${etiquette(c)} : en-tête en h4.panel-title compris${mobile ? ', nom de bâtiment (section repliable) en 15 px / 600' : ''}`, () => {
        assert.ok(m.titres.some(t => t.texte === 'Titre en h4'), 'en-tête h4.panel-title absent');
        if (mobile) {
          assert.equal(m.batiment.length, 1, 'nom de bâtiment absent (.building-section-content)');
          const hors = tailles(m.batiment, '15px', '600');
          assert.deepEqual(hors, [], hors.join(' ; '));
        }
      });
      check(`echelle ${etiquette(c)} : texte courant en ${mobile ? '15' : '14'} px, champ ${mobile ? 'en 16 px' : 'égal au bundle de base'}`, () => {
        const hors = [...tailles(m.texte, mobile ? '15px' : '14px'), ...tailles(m.champ, mobile ? '16px' : a.replie.champ[0].taille)];
        assert.ok(m.texte.length === 1 && m.champ.length === 1, 'texte ou champ absent');
        assert.deepEqual(hors, [], hors.join(' ; '));
      });
    }
    if (def.objets) {
      check(`echelle ${etiquette(c)} : noms et valeurs en 15 px / 600, détails (texte de ligne, charge, cadre, alerte) en 13 px`, () => {
        assert.ok(m.noms.length >= 2 && m.detailsJeu.length >= 2, `${m.noms.length} nom(s), ${m.detailsJeu.length} détail(s)`);
        if (c.nom === 'jeu-materiel') { assert.ok(m.noms.some(n => n.texte === '22467 FK') && m.detailsJeu.some(d => /^Charge /.test(d.texte)), 'Argent ou cadre de charge absent'); }
        if (c.nom === 'pnj') { assert.ok(m.detailsJeu.some(d => /^Engagés aujourd'hui/.test(d.texte)), 'alerte « Engagés aujourd\'hui » absente'); }
        const hors = [...tailles(m.noms, '15px', '600'), ...tailles(m.detailsJeu, '13px')];
        assert.deepEqual(hors, [], hors.join(' ; '));
      });
    }
    if (def.objets || def.plancherContenu) {
      const zone = m.plancher.filter(e => e.contenu);
      check(`echelle ${etiquette(c)} : aucun texte visible sous 12 px (#content)`, () => {
        assert.ok(zone.length > 5, `${zone.length} élément(s) mesuré(s)`);
        const hors = sousPlancher(zone, 12);
        assert.deepEqual(hors, [], hors.join(' ; '));
      });
    }
    if (c.nom === 'jeu-materiel') {
      check(`echelle ${etiquette(c)} : ligne d'objet ${mobile ? 'image, nom, charge au bord droit sur la même ligne, charge en text-secondary' : 'en ordre natif'}`, () => {
        assert.ok(m.lignes.length >= 7 && m.lignes.some(l => !l.image), `${m.lignes.length} ligne(s) d'objet, ligne sans image ${m.lignes.some(l => !l.image) ? 'présente' : 'absente'}`);
        const ecarts = m.lignes.flatMap(l => [
          l.premier ? null : `« ${l.texte} » charge déplacée dans le DOM`,
          l.cible ? null : `« ${l.texte} » charge hors de la cible de la ligne`,
          ...(mobile ? [
            l.image ? (l.imageAGauche ? null : `« ${l.texte} » image pas à gauche du nom`) : (l.nomAuBord <= 1 ? null : `« ${l.texte} » sans image : nom à ${l.nomAuBord.toFixed(1)} px du bord`),
            l.ecartDroit <= 1 ? null : `« ${l.texte} » charge à ${l.ecartDroit.toFixed(1)} px du bord droit`,
            l.memeLigne ? null : `« ${l.texte} » charge hors de la ligne du nom`,
            l.chevauchement ? `« ${l.texte} » texte du nom sur la charge ou hors de la ligne` : null,
            l.couleur === l.secondaire ? null : `« ${l.texte} » charge en ${l.couleur} au lieu de ${l.secondaire}`
          ] : [])
        ]).filter(Boolean);
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
    }
    if (c.nom === 'materiel' && !mobile) {
      check(`echelle ${etiquette(c)} : objets déplacés (kr-materiel-moved) : nom 15 px / 600, détail et charge 13 px`, () => {
        assert.ok(m.deplaces.length === 1 && m.deplacesDetails.length === 2, `${m.deplaces.length} nom(s), ${m.deplacesDetails.length} détail(s) déplacé(s)`);
        const hors = [...tailles(m.deplaces, '15px', '600'), ...tailles(m.deplacesDetails, '13px')];
        assert.deepEqual(hors, [], hors.join(' ; '));
      });
    }
    if (def.jeu && mobile) {
      check(`echelle ${etiquette(c)} : aucun texte visible sous 12 px, onglets de section en 12 px`, () => {
        const hors = [...sousPlancher(def.objets ? m.plancher.filter(e => e.contenu) : m.plancher, 12), ...tailles(m.onglets, '12px')];
        assert.ok(m.onglets.length === 5, `${m.onglets.length} onglet(s)`);
        assert.deepEqual(hors, [], hors.join(' ; '));
      });
    }
    check(`echelle ${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(r.erreurs, []));
  }

  // Onglet « Personnage » entier (12 px, sans ellipse ni coupure) à 360 et 375 px ; jauges du mini-profil en 12 px, plié et déplié,
  // à 375 et 700 px.
  const casMini = VARIANTES.flatMap(variante => [360, 375, 700].map(width => ({ nom: 'materiel', variante, width })));
  const resMini = await mapLimit(casMini, async c => ({ c, r: await releverEchelle({ ...c, script: userscript, deplier: true }) }));
  for (const { c, r } of resMini) {
    for (const [etat, m] of [['plié', r.replie], ['déplié', r.deplie]]) {
      check(`echelle ${etiquette(c)} ${etat} : jauges du mini-profil en 12 px, onglets entiers en 12 px`, () => {
        assert.ok(m.jauges.length === 6, `${m.jauges.length} libellé(s) de jauge`);
        const perso = m.onglets.find(o => o.texte === 'Personnage');
        assert.ok(perso, 'onglet « Personnage » absent');
        const hors = [...tailles(m.jauges, '12px'), ...tailles(m.onglets, '12px'), ...m.onglets.filter(o => o.sw > o.cw).map(o => `« ${o.texte} » coupé ${o.sw} > ${o.cw}`)];
        assert.deepEqual(hors, [], hors.join(' ; '));
      });
    }
    check(`echelle ${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(r.erreurs, []));
  }

  // Consommation des jetons : redéfinis par une feuille adoptée, 375 et 1280 px, tous les éléments visés suivent.
  const REDEFINIS = ':root { --kr-font-section-title: 19px !important; --kr-font-name: 16px !important; --kr-font-detail: 14px !important; --kr-font-body-mobile: 16px !important; --kr-font-label: 13px !important; }';
  const casJetons = ['materiel', 'jeu-materiel', 'sous-forum', 'kramail'].flatMap(nom => [375, 1280].map(width => ({ nom, variante: 'kraland', width })));
  const resJetons = await mapLimit(casJetons, async c => ({ c, r: await releverEchelle({ ...c, script: userscript, css: REDEFINIS }) }));
  for (const { c, r } of resJetons) {
    const mobile = c.width < 768;
    const m = r.replie;
    check(`echelle ${etiquette(c)} : jetons redéfinis suivis`, () => {
      const hors = [...tailles(m.titres, '19px')];
      if (c.nom === 'materiel') {
        hors.push(...tailles(m.noms, '16px'), ...tailles(m.details, '14px'));
        if (mobile) { hors.push(...tailles(m.texte, '16px'), ...tailles(m.onglets, '13px'), ...tailles(m.jauges, '13px')); }
      }
      if (c.nom === 'jeu-materiel') { hors.push(...tailles(m.noms, '16px'), ...tailles(m.detailsJeu, '14px')); }
      assert.ok(m.titres.length > 0, 'aucun en-tête');
      assert.deepEqual(hors, [], hors.join(' ; '));
    });
  }

  // Contrôle absolu (backlog 24, remplace le miroir ECHELLE_TICKET45 retiré par le sweep 9.12) : titres de modale et d'accordéon à
  // leurs valeurs relevées sur 77f0aba (mobile et ordinateur), .xmini et footer a en 12 px. Éléments mesurés même masqués (taille et
  // graisse calculées). Aucune des trois fixtures ne porte de .xmini : une sonde span.xmini est ajoutée au corps de page.
  const ABSOLU = { '.modal-title': '18px/500', '.panel-group .panel-title': '16px/500', '.xmini': '12px', 'footer a': '12px' };
  const ABSOLU_MOBILE = { ...ABSOLU, '.modal-title': '15px/500', '.panel-group .panel-title': '14px/500' };
  const MESURE_ABSOLU = sels => {
    const sonde = document.createElement('span');
    sonde.className = 'xmini';
    sonde.textContent = 'sonde';
    document.body.appendChild(sonde);
    return Object.fromEntries(sels.map(sel => [sel, [...document.querySelectorAll(sel)].map(e => { const st = getComputedStyle(e); return `${st.fontSize}/${st.fontWeight}`; })]));
  };
  const casAbsolu = ['materiel', 'sous-forum', 'kramail'].flatMap(nom => VARIANTES.flatMap(variante => [375, 767, 768, 1280].map(width => ({ nom, variante, width }))));
  const resAbsolu = await mapLimit(casAbsolu, async c => {
    const { context, page } = await ouvrir({ nom: c.nom, width: c.width, height: c.width < 768 ? 667 : 900, variante: c.variante, script: userscript, def: PAGES_ECHELLE[c.nom] });
    const l = await page.evaluate(MESURE_ABSOLU, Object.keys(ABSOLU));
    await context.close();
    return { c, l };
  });
  for (const { c, l } of resAbsolu) {
    const att = c.width < 768 ? ABSOLU_MOBILE : ABSOLU;
    check(`echelle ${etiquette(c)} : titres de modale (${att['.modal-title']}) et d'accordéon (${att['.panel-group .panel-title']}), .xmini et footer a en 12 px`, () => {
      const attendus = { '.modal-title': c.nom === 'materiel', '.panel-group .panel-title': c.nom === 'materiel', '.xmini': true, 'footer a': c.nom !== 'sous-forum' };
      const absents = Object.entries(attendus).filter(([sel, present]) => present && l[sel].length === 0).map(([sel]) => `${sel} absent`);
      const hors = Object.entries(l).flatMap(([sel, vals]) => vals.filter(v => (att[sel].includes('/') ? v : v.split('/')[0]) !== att[sel]).map(v => `${sel} ${v}`));
      assert.deepEqual([...absents, ...hors], [], [...absents, ...hors].join(' ; '));
    });
  }

  // Plateau inchangé par le ticket 6 (FIXTURE SYNTHÉTIQUE jeu-plateau-objets.html, /jouer/plateau) : produits du Commerce et panneau
  // Matériel (déplacé dans la colonne gauche sur ordinateur) égaux au bundle d'avant le ticket (COMMIT_TICKET6) ; détail du Commerce en 12 px sur mobile.
  // Seul écart voulu (plan, Always) : sur ordinateur, la taille du panneau Matériel déplacé (ligne, charge, détail ; 10,6 px avant) passe
  // à 13 px (--kr-font-detail) ; le reste de sa valeur (graisse, couleur, display, float) reste égal.
  const MESURE_PLATEAU = () => [...document.querySelectorAll('#panneau-commerce a, #panneau-materiel-plateau a')].flatMap(a => [a, ...a.children]).map(e => {
    const st = getComputedStyle(e);
    return { cle: `${e.closest('.panel').id} ${e.tagName}.${[...e.classList].join('.')} « ${(e.textContent || '').trim().slice(0, 20)} »`,
      valeur: `${st.fontSize}/${st.fontWeight} ${st.color} ${st.display} ${st.cssFloat}`, reste: `${st.fontWeight} ${st.color} ${st.display} ${st.cssFloat}`,
      taille: st.fontSize, detail: e.matches('#panneau-commerce p'), deplace: e.matches('#panneau-materiel-plateau :is(a, a > :not(h4))') };
  });
  const casPlateau = VARIANTES.flatMap(variante => [375, 767, 768, 1280].map(width => ({ nom: 'plateau-objets', variante, width })));
  const releverPlateau = async (c, script) => {
    const { context, page, erreurs } = await ouvrir({ nom: c.nom, width: c.width, height: c.width < 768 ? 667 : 900, variante: c.variante, script, def: PLATEAU_OBJETS });
    const l = await page.evaluate(MESURE_PLATEAU);
    await context.close();
    return { l, erreurs };
  };
  const resPlateau = await mapLimit(casPlateau, async c => ({ c, apres: await releverPlateau(c, userscript), base: await releverPlateau(c, avantTicket6) }));
  for (const { c, apres, base } of resPlateau) {
    check(`echelle ${etiquette(c)} : plateau (Commerce, Matériel) égal au bundle d'avant le ticket 6${c.width < 768 ? ', détail du Commerce en 12 px' : ''}`, () => {
      assert.ok(apres.l.length >= 12 && apres.l.filter(x => x.detail).length === 2, `${apres.l.length} élément(s) mesuré(s)`);
      assert.equal(apres.l.length, base.l.length, 'nombre d\'éléments');
      const voulu = (x, b) => c.width >= 768 && x.deplace && b.taille === '10.6px' && x.taille === '13px' && x.reste === b.reste;
      const ecarts = apres.l.map((x, i) => (x.cle === base.l[i].cle && (x.valeur === base.l[i].valeur || voulu(x, base.l[i])) ? null : `${x.cle} ${x.valeur} au lieu de ${base.l[i].valeur}`)).filter(Boolean);
      if (c.width < 768) { ecarts.push(...apres.l.filter(x => x.detail && x.taille !== '12px').map(x => `${x.cle} ${x.taille}`)); }
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    check(`echelle ${etiquette(c)} : plateau, aucune erreur de page`, () => assert.deepEqual(apres.erreurs, []));
  }

  // Bascule dans le même onglet (767, 768, 769, 768, 767 px) : valeurs du support à chaque pas.
  for (const [nomPage, variante] of ['materiel', 'jeu-materiel'].flatMap(n => VARIANTES.map(v => [n, v]))) {
    const { context, page, erreurs } = await ouvrir({ nom: nomPage, width: 767, variante, script: userscript, def: PAGES_ECHELLE[nomPage], tactile: false });
    const releves = [{ width: 767, m: await page.evaluate(MESURE_ECHELLE, SEL_ECHELLE) }];
    for (const width of [768, 769, 768, 767]) {
      await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
      await page.setViewportSize({ width, height: 720 });
      if ((width < 768) !== (releves[releves.length - 1].width < 768)) { await charge; }
      await krReady(page, { ready: THEME_READY, label: `echelle bascule ${nomPage} ${variante} ${width} px` });
      await styleSettled(page, 'body');
      releves.push({ width, m: await page.evaluate(MESURE_ECHELLE, SEL_ECHELLE) });
    }
    await context.close();
    const bascule = nomPage === 'materiel' ? '' : `${nomPage} `;
    for (const { width, m } of releves) {
      const mobile = width < 768;
      if (nomPage === 'jeu-materiel') {
        check(`echelle bascule ${bascule}${variante} ${width} px : détails en 13 px, charge ${mobile ? 'au bord droit sur la ligne du nom' : 'en ordre natif'}`, () => {
          assert.ok(m.detailsJeu.length > 0 && m.lignes.length > 0, 'éléments absents');
          const hors = [...tailles(m.detailsJeu, '13px'), ...m.lignes.filter(l => !l.premier || (mobile && (l.ecartDroit > 1 || !l.memeLigne))).map(l => `« ${l.texte} » charge mal placée`)];
          assert.deepEqual(hors, [], hors.join(' ; '));
        });
      }
      check(`echelle bascule ${bascule}${variante} ${width} px : mode ${mobile ? 'mobile' : 'bureau'}, en-têtes 17 px / 700, noms 15 px / 600, texte ${mobile ? 15 : 14} px`, () => {
        assert.equal(m.mobile, mobile, 'mode');
        const hors = [...tailles(m.titres, '17px', '700'), ...tailles(m.noms, '15px', '600'), ...tailles(m.texte, mobile ? '15px' : '14px')];
        assert.ok(m.titres.length > 0 && m.noms.length > 0, 'éléments absents');
        assert.deepEqual(hors, [], hors.join(' ; '));
      });
    }
    check(`echelle bascule ${bascule}${variante} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

// ---------- Échelle typographique du forum et du kramail (ticket 7) ----------
// Index (RP, Communauté, racine), sous-forum, sujet, rédaction (FIXTURE SYNTHÉTIQUE typographie-forum-redaction.html, éditeur de
// messages-v3.mjs réduit), réception, lecture et nouveau kramail. Rôles : nom 15 px (nom de forum de l'index en 400, ticket 6.1), détail
// 13 px, texte courant 15 px sur mobile, libellés de rédaction 13 px, champ de rédaction 16 px, corps des messages 16 px sur mobile.
const COMMIT_ECHELLE_FORUM = '7bec452'; // recalage du sweep 9.12 (ancienne base d64c578) : entrées 9.1 à 9.10 comprises
const avantEchelleForum = sansEntete(process.env.KR_SCRIPT_AVANT_ECHELLE_FORUM ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_ECHELLE_FORUM, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_ECHELLE_FORUM}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const IDX = '#col-right .table > tbody > tr';
const SF = '#topics tbody tr';
// [rôle, sélecteur, taille attendue, graisse, support] : support m = mobile seulement, b = ordinateur seulement, rien = les deux.
const PAGES_FORUM = {
  'index-rp': { url: BASE + '/forum/rp', html: lire('forum-index-rp.html') },
  'index-communaute': { url: BASE + '/forum/communaute', html: lire('forum-index-communaute.html') },
  racine: { url: BASE + '/forum', html: lire('forum-racine.html') },
  'sous-forum': { url: BASE + '/forum/hrp/debuter-20102', html: lire('sous-forum-debuter.html') },
  sujet: { url: BASE + '/forum/sujet/messages-v3-329425-1', html: lire('forum-sujet.html') },
  redaction: { url: BASE + '/forum/post/repondre-2-329425', html: lire('typographie-forum-redaction.html') },
  reception: { url: BASE + '/kramail/personnage-fictif-2000-0', html: lire('kramail-reception.html') },
  lecture: { url: BASE + '/kramail/post/sujet-fictif-0-9000002', html: lire('kramail-lecture.html') },
  nouveau: { url: BASE + '/kramail/post/nouveau-4-2000', html: lire('kramail-nouveau.html') }
};
const INDEX_ROLES = [
  ['nom de forum', `${IDX} > td:first-child > p > a`, '15px', '400'],
  ['compteur', `${IDX} > td:nth-child(2), ${IDX} > td:nth-child(3)`, '13px'],
  ['auteur du dernier message', `${IDX} > td:nth-child(4) > a.nomargin`, '13px'],
  ['heure du dernier message', `${IDX} > td:nth-child(4) > p.mini`, '13px'],
  ['fil d\'Ariane', '.forum-mobile-breadcrumb', '13px', null, 'm']
];
const ROLES_FORUM = {
  'index-rp': INDEX_ROLES,
  'index-communaute': INDEX_ROLES,
  racine: INDEX_ROLES.slice(0, 2), // racine (forum-racine.html) : ni dernier message ni fil d'Ariane
  'sous-forum': [
    ['titre de sujet', `${SF} > td:first-child > p > a`, '15px'],
    ['compteur', `${SF} > td.center`, '13px'],
    ['auteur', `${SF} > td:nth-child(4) > a.nomargin`, '13px'],
    ['auteur du dernier message', `${SF} > td:nth-child(5) > a.nomargin`, '13px'],
    ['date du dernier message', `${SF} > td:nth-child(5) > p.mini`, '13px'],
    ['étiquette de sujet', `${SF} > td:first-child > span.tagforum a`, '13px'],
    ['fil d\'Ariane', '.forum-mobile-breadcrumb', '13px', null, 'm']
  ],
  sujet: [
    ['auteur du message', 'ul.media-list.forum > li.media .user-info > strong', '15px'],
    ['cartouche', 'ul.media-list.forum > li.media .user-info > .cartouche', '13px'],
    ['corps du message', 'li.media.kr-msg > .media-body > .forum-msg', '16px', null, 'm']
  ],
  redaction: [
    ['libellé', 'form.kr-editor .form-group.kr-sender-row > label, form.kr-editor .form-group.kr-message-row > label', '13px', null, 'm'],
    ['champ de rédaction', 'form.kr-editor textarea', '16px', null, 'm']
  ],
  reception: [
    ['sujet du kramail', '#topics tbody td:nth-child(2) a:last-of-type', '15px', null, 'm'],
    // Liste au rendu du sous-forum (épopée 7, entrée 4) : la cellule du nom passe en display: contents, la taille se lit sur son lien.
    ['expéditeur', '#topics tbody td:nth-child(3) > a.nomargin', '13px', null, 'm'],
    ['date', '#topics tbody td:nth-child(4)', '13px', null, 'm']
  ],
  // Lecture au rendu du message de sujet (épopée 7, entrée 2) : mêmes rôles que le sujet
  lecture: [
    ['expéditeur', 'ul.media-list.forum > li.media .user-info > strong', '15px'],
    ['corps', 'li.media.kr-msg > .media-body > .forum-msg', '16px', null, 'm']
  ],
  // Nouveau kramail : 6e colonne = état du panneau des destinataires (ETAPES_KD) où le rôle est mesuré.
  nouveau: [
    ['aide du champ Destinataires', '.kd-help', '14px', null, 'b', 'repos'],
    ['aide du champ Destinataires', '.kd-help', '15px', null, 'm', 'repos'],
    ['libellé Destinataires', '.kd-row > .kd-label', '14px', null, 'b', 'repos'], // taille native des autres libellés (épopée 7, entrée 5)
    ['recherche en cours', '.kd-sec.kd-loading', '14px', null, 'b', 'chargement'],
    ['recherche en cours', '.kd-sec.kd-loading', '15px', null, 'm', 'chargement'],
    ['titre de section', '.kd-sec:not(.kd-loading):not(.kd-error)', '12px', null, null, 'annuaire'],
    ['note de section', '.kd-sec small', '12px', null, null, 'annuaire'],
    ['nom proposé', '.kd-opt', '15px', null, null, 'annuaire'],
    ['pied du panneau', '.kd-foot', '13px', null, 'b', 'annuaire'],
    ['pied du panneau', '.kd-foot', '13px', null, 'm', 'vide'], // sur mobile, pied des seules touches masqué : texte du nom libre
    ['déjà ajouté', '.kd-warn', '14px', null, 'b', 'deja'],
    ['déjà ajouté', '.kd-warn', '15px', null, 'm', 'deja'],
    ['aucun résultat', '.kd-empty', '14px', null, 'b', 'vide'],
    ['aucun résultat', '.kd-empty', '15px', null, 'm', 'vide'],
    ['annuaire indisponible', '.kd-sec.kd-error', '14px', null, 'b', 'erreur'],
    ['annuaire indisponible', '.kd-sec.kd-error', '15px', null, 'm', 'erreur'],
    ['message de blocage', '.kd-msg', '14px', null, 'b', 'blocage'],
    ['message de blocage', '.kd-msg', '15px', null, 'm', 'blocage']
  ]
};
// Panneau des destinataires du nouveau kramail, ouvert état par état (annuaire fictif de ouvrir() ; aucun envoi : soumission neutralisée,
// « Envoyer » n'affiche que le blocage). Chargement : réponse retenue 1,2 s ; erreur : réponse 500.
const saisirKd = async (page, q) => {
  await page.fill('.kd-input', '');
  await page.focus('.kd-input');
  await page.keyboard.type(q, { delay: 20 });
};
const ETAPES_KD = [
  ['repos', async () => {}],
  ['chargement', async page => {
    await page.route('**/ajaxsearch.php*', async route => { await new Promise(r => setTimeout(r, 1200)); await route.fallback().catch(() => {}); });
    await saisirKd(page, 'mar');
    await page.waitForFunction(() => document.querySelector('.kd-loading'), null, { timeout: 5000 });
  }],
  ['annuaire', async page => {
    await page.waitForFunction(() => !document.querySelector('.kd-loading') && document.querySelector('.kd-opt'), null, { timeout: 5000 });
    await page.unroute('**/ajaxsearch.php*');
  }],
  ['deja', async page => {
    await page.keyboard.press('Enter');
    await saisirKd(page, 'mar');
    await page.waitForFunction(() => document.querySelector('.kd-warn'), null, { timeout: 5000 });
  }],
  ['vide', async page => {
    await saisirKd(page, 'xqzw');
    await page.waitForFunction(() => !document.querySelector('.kd-loading') && document.querySelector('.kd-empty'), null, { timeout: 5000 });
  }],
  ['erreur', async page => {
    await page.route('**/ajaxsearch.php*', route => route.fulfill({ status: 500, contentType: 'text/html', body: '' }));
    await saisirKd(page, 'zzerr');
    await page.waitForFunction(() => document.querySelector('.kd-error'), null, { timeout: 5000 });
    await page.unroute('**/ajaxsearch.php*');
  }],
  ['blocage', async page => {
    await page.fill('input[name="c[1]"]', 'Sujet de test');
    await page.fill('#message', 'Corps du message');
    await saisirKd(page, 'xqzw');
    await page.waitForFunction(() => !document.querySelector('.kd-loading'), null, { timeout: 5000 });
    await page.click('form[name="post_msg"] button.btn-primary');
    await page.waitForFunction(() => document.querySelector('.kd-msg-btn'), null, { timeout: 5000 });
  }]
];
// Relevé page par page : une seule fois, ou à chaque état du panneau pour le nouveau kramail.
const parEtat = async (nom, page, releve) => {
  if (nom !== 'nouveau') { return [['', await releve()]]; }
  const out = [];
  for (const [etat, agir] of ETAPES_KD) {
    await agir(page);
    await page.waitForTimeout(50);
    out.push([etat, await releve(etat)]);
  }
  return out;
};
const MESURE_FORUM = roles => {
  const vu = e => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const res = { roles: roles.map(([, sel]) => [...document.querySelectorAll(sel)].filter(vu).map(e => {
    const s = getComputedStyle(e);
    return { taille: s.fontSize, graisse: s.fontWeight, texte: (e.textContent || e.value || '').trim().slice(0, 30) };
  })) };
  // Plancher (#col-right) : élément visible portant lui-même du texte, boîte de plus de 1 px ; textes masqués à 0 exclus.
  res.plancher = [...document.querySelectorAll('#col-right, #col-right *')].filter(e => !['SCRIPT', 'STYLE'].includes(e.tagName) && vu(e)
    && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
    && (r => r.width > 1 && r.height > 1)(e.getBoundingClientRect())
    && e.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && getComputedStyle(e).fontSize !== '0px')
    .map(e => ({ taille: getComputedStyle(e).fontSize, texte: [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').slice(0, 30), cls: e.className && e.className.baseVal === undefined ? String(e.className).slice(0, 40) : e.tagName }));
  res.mobile = document.body.classList.contains('mobile-mode');
  return res;
};
if (on('echelle-forum')) {
  console.log('\n== echelle-forum ==');
  const LARGEURS = [375, 767, 768, 1280, 1440, 1920];
  const cas = Object.keys(PAGES_FORUM).flatMap(nom => VARIANTES.flatMap(variante => LARGEURS.map(width => ({ nom, variante, width }))));
  const releverForum = async (c, script, css) => {
    const { context, page, erreurs } = await ouvrir({ nom: c.nom, width: c.width, height: c.width < 768 ? 667 : 900, variante: c.variante, script, def: PAGES_FORUM[c.nom], css });
    const roles = ROLES_FORUM[c.nom];
    const etats = await parEtat(c.nom, page, etat => page.evaluate(MESURE_FORUM, roles.map(x => (x[5] === undefined || x[5] === etat ? x : [x[0], ':not(*)']))));
    await context.close();
    // Chaque rôle est pris dans son état ; plancher = union des états.
    return { roles: roles.map((x, i) => etats.find(([etat]) => (x[5] === undefined ? '' : x[5]) === etat)[1].roles[i]), plancher: etats.flatMap(([, m]) => m.plancher), mobile: etats[0][1].mobile, erreurs };
  };
  const res = await mapLimit(cas, async c => ({ c, r: await releverForum(c, userscript) }));
  for (const { c, r } of res) {
    const mobile = c.width < 768;
    const roles = ROLES_FORUM[c.nom].map((x, i) => [x, r.roles[i]]).filter(([[, , , , sup]]) => !sup || sup === (mobile ? 'm' : 'b'));
    check(`echelle-forum ${etiquette(c)} : mode ${mobile ? 'mobile' : 'bureau'}, ${roles.map(([[nom, , taille, graisse]]) => `${nom} ${taille}${graisse ? ' / ' + graisse : ''}`).join(', ')}`, () => {
      assert.equal(r.mobile, mobile, 'mode');
      const absents = roles.filter(([, l]) => l.length === 0).map(([[nom]]) => nom);
      assert.deepEqual(absents, [], 'absent(s) : ' + absents.join(', '));
      const hors = roles.flatMap(([[nom, , taille, graisse], l]) => tailles(l, taille, graisse).map(x => `${nom} ${x}`));
      assert.deepEqual(hors, [], hors.join(' ; '));
    });
    if (mobile) {
      check(`echelle-forum ${etiquette(c)} : aucun texte visible de #col-right sous 12 px (textes masqués à 0 exclus)`, () => {
        const hors = sousPlancher(r.plancher, 12);
        assert.ok(r.plancher.length > 0, 'aucun texte mesuré');
        assert.deepEqual(hors, [], hors.join(' ; '));
      });
    }
    check(`echelle-forum ${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(r.erreurs, []));
  }

  // Garde de régression : la taille de chaque élément de #col-right est égale à celle du bundle de base (COMMIT_ECHELLE_FORUM), sans
  // masque ; les rôles du ticket 7 sont prouvés par les contrôles absolus plus haut. Pages comparées hors périmètre par forum-index.mjs
  // (sous-forum, sujet, Staff) et kramail-redaction.mjs (réception, lecture), plus l'index et le nouveau kramail.
  const MESURE_TAILLES = () => [...document.querySelectorAll('#col-right, #col-right *')]
    .map(e => { const st = getComputedStyle(e); return `${e.tagName}.${typeof e.className === 'string' ? e.className : ''} ${st.fontSize}`; });
  const PAGES_MIROIR = { ...PAGES_FORUM, staff: { url: BASE + '/forum/staff', html: lire('forum-index-rp.html') } };
  const casMiroir = ['index-rp', 'sous-forum', 'sujet', 'staff', 'redaction', 'reception', 'lecture', 'nouveau'].flatMap(nom => VARIANTES.flatMap(variante => [375, 768, 1280].map(width => ({ nom, variante, width }))));
  const releverTailles = async (c, script, css, init) => {
    const { context, page } = await ouvrir({ nom: c.nom, width: c.width, height: c.width < 768 ? 667 : 900, variante: c.variante, script, def: PAGES_MIROIR[c.nom], css, init });
    const l = (await parEtat(c.nom, page, () => page.evaluate(MESURE_TAILLES))).flatMap(([etat, t]) => t.map(x => `${etat} ${x}`));
    await context.close();
    return l;
  };
  const resMiroir = await mapLimit(casMiroir, async c => ({ c, apres: await releverTailles(c, userscript), base: await releverTailles(c, avantEchelleForum) }));
  for (const { c, apres, base } of resMiroir) {
    check(`echelle-forum ${etiquette(c)} : taille de chaque élément de #col-right égale au bundle de base (${COMMIT_ECHELLE_FORUM}), états compris`, () => {
      assert.equal(base.length, apres.length, 'nombre d\'éléments');
      const ecarts = apres.map((x, i) => (x === base[i] ? null : `${base[i]} au lieu de ${x}`)).filter(Boolean);
      assert.deepEqual(ecarts, [], ecarts.slice(0, 5).join(' ; '));
    });
  }
}

// ---------- Rayons (ticket 8, story-trois-rayons-4-px-8-px-et-plein-plan) ----------
// Trois rôles (H6.3) : contrôle C4 = --kr-radius-sm (4 px), conteneur K8 = --kr-radius-md (8 px), en-tête ou pied de panneau K7 =
// --kr-radius-md - 1 px (7 px, coins de son bord), pastille P = plein (rayon ≥ min(largeur, hauteur) / 2). Un coin carré dans la base
// (coin intérieur d'un groupe, barre BBCode collée au champ) reste carré. Exceptions X (croix, avatars, images, jauges) : égales au
// bundle de base (COMMIT_RAYONS). N4 : contrôle natif de Bootstrap déjà à 4 px sans règle de la peau (pagination, onglets, input-group-addon ;
// annexe d'inventaire, section 3, dernière ligne), à 4 px même sous jetons redéfinis.
// Rôle H : coins hauts d'un en-tête égaux au rayon de son panneau moins 1 px (panneau arrondi exigé). Sélecteur terminé par ::before
// ou ::after : mesure du pseudo-élément. clics : clics DOM avant la mesure (m mobile, b ordinateur).
// Cas : [clé, sélecteur, rôle, support, cache] ; support m = mobile seulement, b = ordinateur seulement ; cache = mesuré même masqué
// (menu fermé : rayon calculé sans rendu).
const COMMIT_RAYONS = '7bec452'; // recalage du sweep 9.12 (ancienne base d64c578) : entrées 9.1 à 9.10 comprises
const avantRayons = sansEntete(process.env.KR_SCRIPT_AVANT_RAYONS ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_RAYONS, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_RAYONS}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const ACCUEIL_RAYONS = ACCUEIL_BOUTONS.replace('<div class="col-md-6">centre</div>', '<div class="col-md-6"><div class="alert alert-info alert-dismissible">Ministre d\'essai '
  + ': communiqué. <img src="http://img7.kraland.org/2/ministre.gif" width="40" height="40"></div><img class="img-circle" src="http://img7.kraland.org/2/cercle.gif" width="40" height="40">'
  + '<div class="dashboard-card"><img class="dashboard-card-avatar" src="http://img7.kraland.org/2/avatar.gif" width="40" height="40"></div></div>')
  .replace('<h4>Personnage d\'essai</h4>', '<span class="pull-right"><img src="http://img7.kraland.org/2/perso.gif" width="60" height="60"></span><h4>Personnage d\'essai</h4>');
const MODALE_FEUILLE = '<p>Message</p><div class="btn-toolbar"><div class="btn-group btn-group-xs dropdown"><button type="button" class="btn btn-default dropdown-toggle" '
  + 'data-toggle="dropdown">Couleurs</button><div class="dropdown-menu"><div class="btn-group"><button type="button" class="btn btn-default">Rouge</button></div></div></div></div>';
// Réception dérivée en mémoire (épopée 7, entrée 4) : balisage DataTables (recherche, pagination) et troisième message non lu (pastille),
// pour les rôles communs avec le sous-forum.
const RECEPTION_RAYONS = { ...PAGES_FORUM.reception, html: PAGES_FORUM.reception.html
  .replace('<table class="display" id="topics">', '<div id="topics_wrapper" class="dataTables_wrapper no-footer"><div id="topics_filter" class="dataTables_filter"><label>Rechercher<input type="search" aria-controls="topics"></label></div>'
    + '<table class="display dataTable no-footer" id="topics" role="grid">')
  .replace('</table>', '</table><div class="dataTables_paginate paging_simple_numbers" id="topics_paginate"><span><a class="paginate_button current" aria-controls="topics" data-dt-idx="1" tabindex="0">1</a>'
    + '<a class="paginate_button" aria-controls="topics" data-dt-idx="2" tabindex="0">2</a></span></div></div>')
  .replace(/(re-commande-0-9000003"><i class=")far fa-envelope-open/, '$1fa fa-envelope') };
if (!RECEPTION_RAYONS.html.includes('id="topics_paginate"') || !RECEPTION_RAYONS.html.includes('9000003"><i class="fa fa-envelope"')) { console.error('réception des rayons non dérivée'); process.exit(2); }
const PAGES_RAYONS = {
  plateau: { def: PAGES.plateau, cas: [
    ['label', '.label', 'P'], ['badge', '.badge', 'P'], ['hamburger', '.navbar-toggle', 'C4', 'm'], ['icone-hamburger', '.navbar-toggle .icon-bar', 'X', 'm'],
    ['retour', '.kraland-back-to-top', 'K8'], ['carte', '.dashboard-card', 'K8'], ['entete', '.panel > .panel-heading', 'K7', 'b'],
    ['croix', '.kr-nav-v2 :is(.kr-n, .kr-s, .kr-w, .kr-e, .kr-hub)', 'X', 'm'], ['ici', '.kr-room-here', 'P', 'm'], ['competences', '#skills-panel', 'K8', 'b']
  ] },
  'plateau-jeu': { def: PAGES_ECHELLE.plateau, cas: [
    ['mini-profil', '.mobile-mini-profile-gauges-full, .mobile-mini-profile-characteristics, .mobile-mini-profile-skills', 'K8', 'm'],
    ['panneau-joueur', '#player-main-panel', 'K8'], ['stats', '#col-leftest-stats', 'K8', 'b'], ['acces', '.kr-quick-access-buttons > .btn', 'C4'],
    ['actions', '.kr-action-grid > .btn', 'C4', 'b'], ['pastilles', '.kr-stat-badge, .kr-skill-badge', 'P']
  ] },
  sujet: { def: PAGES_FORUM.sujet, cas: [
    ['actions', '.forum-thread-action', 'C4', 'm'], ['carte', 'ul.media-list.forum > li.media', 'K8'], ['avatar', 'ul.media-list.forum img.avatar', 'X'],
    ['boutons', 'ul.media-list.forum .btn-group-xs > .btn', 'C4'], ['plus', '.kr-msg-more', 'C4', 'm'], ['pagination', '.center > ul.pagination > li > a', 'N4', 'm'],
    ['pagination', '.center > ul.pagination > li > a', 'C4', 'b'],
    ['entete', '.forum-top .pull-right > .btn', 'C4', 'b']
  ] },
  redaction: { def: PAGES_FORUM.redaction, cas: [
    ['envoyer', 'div.col-sm-12 > button.btn.btn-primary.pull-right', 'C4'], ['champ', '#message', 'C4'], ['barre', '.btn-toolbar.kr-tools-ready', 'C4', 'm'],
    ['liste', '.input-group > select', 'C4'], ['bbcode', '.btn-toolbar .btn-group-xs > .btn', 'C4'],
    ['defilement', '.btn-toolbar::-webkit-scrollbar-thumb', 'X', 'm']
  ] },
  'index-rp': { def: PAGES_FORUM['index-rp'], cas: [
    ['alerte', '#col-right > .alert', 'K8'], ['panneau', '#col-right > .panel', 'K8'], ['entete', '#col-right > .panel > .panel-heading', 'K7', 'b'],
    ['boutons', '#col-right .btn-group-xs > .btn', 'C4']
  ] },
  'sous-forum': { def: PAGES_FORUM['sous-forum'], cas: [
    ['panneau', '#fx-permanents, #fx-sujets', 'K8'], ['entete', ':is(#fx-permanents, #fx-sujets) > .panel-heading', 'K7', 'b'], ['pastille', '.kr-topic-badge', 'P'],
    ['tri', '#topics th.sorting, #topics th.sorting_desc', 'C4', 'm'], ['recherche', '.dataTables_wrapper label > :is(input, select)', 'C4', 'm'],
    ['pagination', '.dataTables_paginate .paginate_button', 'C4', 'm'], ['fleches', '#topics .btn-group-xs > .btn', 'C4'], ['nouveau', '.forum-thread-action', 'C4', 'm']
  ] },
  reception: { def: RECEPTION_RAYONS, cas: [
    ['titre', '.kramail-character-selector', 'C4', 'm'], ['icones', 'h1.page-header .pull-right > .btn', 'C4'],
    ['actions', '.kramail-actions-mobile > .btn', 'C4', 'm'],
    ['panneau', 'form > .panel', 'K8'], ['entete', 'form > .panel > .panel-heading', 'K8', 'm'],
    // Lignes à plat dans la carte (épopée 7, entrée 4), comme le sous-forum : plus de rôle K8 de ligne (kramail-theme, fragment liste) ;
    // rôles communs avec le sous-forum : pastille, recherche et pagination.
    ['entete', 'form > .panel > .panel-heading', 'K7', 'b'], ['pastille', '.kr-topic-badge', 'P'],
    ['recherche', '.dataTables_wrapper label > :is(input, select)', 'C4', 'm'], ['pagination', '.dataTables_paginate .paginate_button', 'C4', 'm']
  ] },
  // Lecture (épopée 7, entrée 2) : avatar du message de sujet (rayon V3, égal au sujet : kramail-theme, fragment lecture) comparé à la base
  // sur les deux supports, base COMMIT_RAYONS postérieure à l'entrée.
  lecture: { def: PAGES_FORUM.lecture, cas: [
    ['carte', 'ul.media-list.forum > li.media', 'K8'], ['avatar', '.user-info img.avatar', 'X'],
    ['menu', '.kramail-post-kebab > .btn', 'C4', 'm'], ['icones', 'h1.page-header .pull-right > .btn', 'C4', 'm'], ['icones', 'span.pull-right > .btn', 'C4', 'b'],
    ['pagination', '.center > ul.pagination > li > a', 'C4', 'm'], ['pagination', '.center > ul.pagination > li > a', 'N4', 'b']
  ] },
  // Formulaire au rendu de la réponse du forum (épopée 7, entrée 5) : ni carte du formulaire ni blocs, mêmes rôles que la rédaction du forum.
  nouveau: { def: PAGES_FORUM.nouveau, cas: [
    ['titre', '.kramail-character-selector', 'C4', 'm'], ['champ-groupe', '.input-group > :is(input, select)', 'C4'],
    ['addon', '.input-group > .input-group-addon', 'N4', 'b'], ['contacts', '.kd-contacts', 'C4'], ['barre', '.btn-toolbar.kr-tools-ready', 'C4', 'm'],
    ['bbcode', '.btn-toolbar .btn-group-xs > .btn', 'C4'], ['champ', '#message', 'C4'],
    ['envoyer', 'div.col-sm-12 > button.btn.btn-primary.pull-right', 'C4', 'b'], ['defilement', '.editeur-text .btn-toolbar::-webkit-scrollbar-thumb', 'X', 'm']
  ] },
  // Accordéon (« Message auquel vous répondez ») : sur ordinateur, panneau à 8 px et en-tête égal au panneau moins 1 px (rôle H) ; sur mobile,
  // en-tête et volet repliable en cartes à 8 px. Volet déplié avant la mesure ; menu du sélecteur de personnage mesuré fermé.
  accordeon: { def: { url: BASE + '/kramail/post/sujet-fictif-de-lecture-5-9000002', html: lire('kramail-repondre.html') },
    clics: { m: ['.panel-group .panel-heading a'], b: ['.panel-group .panel-heading a'] }, cas: [
      ['panneau', '.panel-group > .panel', 'K8', 'b'], ['entete', '.panel-group > .panel > .panel-heading', 'H', 'b'],
      ['entete', '.panel-group > .panel > .panel-heading', 'K8', 'm'], ['bascule', '.panel-group a[data-toggle="collapse"]', 'K8'],
      ['volet', '.panel-group .panel-collapse', 'K8'], ['puits', '.well', 'K8'], ['menu-personnage', '.kramail-character-dropdown', 'K8', 'm', 'cache']
    ] },
  // Matériel (fixture synthétique typographie-echelle.html) : accordéon #accordeon-essai, horloge .c100 et ses cercles, jauges compactes.
  materiel: { def: PAGES_ECHELLE.materiel, cas: [
    ['panneau', '#accordeon-essai > .panel', 'K8', 'b'], ['entete', '#accordeon-essai > .panel > .panel-heading', 'H', 'b'],
    ['horloge', '.c100', 'X'], ['horloge-avant', '.c100::before', 'X'], ['horloge-apres', '.c100::after', 'X'],
    ['jauge-compacte', '.mobile-gauge-compact-bar', 'X', 'm'], ['puits', '.well', 'K8']
  ] },
  objets: { def: PLATEAU_OBJETS, cas: [['jauge-pleine', '.mobile-gauge-full-bar', 'X', 'm'], ['jauge-compacte', '.mobile-gauge-compact-bar', 'X', 'm']] },
  vignettes: { def: PAGES.plateau, cas: [['vignette', '.kr-room-thumb', 'X', 'm'], ['vignette-image', '.kr-room-thumb img', 'X', 'm']] },
  // Images rondes ou arrondies (fixture synthétique ACCUEIL_RAYONS) : exceptions égales à la base.
  accueil: { def: { url: BASE + '/accueil', html: ACCUEIL_RAYONS }, cas: [
    ['ministre', '.kr-ministerial-card img', 'X'], ['personnage', '.ds_user .pull-right img', 'X'], ['cercle', 'img.img-circle', 'X'],
    ['avatar-carte', '.dashboard-card-avatar', 'X']
  ] },
  pied: { def: PAGES_BOUTONS.tableau, cas: [['pied', '.panel > .panel-footer', 'K7']] },
  // Menus déroulants : actions du kramail ouvertes sur mobile ; barre de navigation mesurée fermée sur ordinateur (coins hauts carrés dans la base).
  menus: { def: PAGES_FORUM.reception, clics: { m: ['.kramail-actions-mobile > .dropdown-toggle'] }, cas: [
    ['menu', '.kramail-actions-mobile .dropdown-menu', 'K8', 'm'], ['menu', '.navbar .dropdown-menu', 'K8', 'b', 'cache']
  ] },
  // Bouton rond « nouveau sujet » : créé sur mobile pour un titre de forum à liens (fixture synthétique des composants, titre remplacé).
  'bouton-rond': { def: { ...PAGES_BOUTONS.tableau, html: PAGES_BOUTONS.tableau.html.replace('<h1>Composants d\'essai</h1>',
    '<h1>Forum d\'essai <a href="forum/hrp">Jeu (HRP)</a> <a href="forum/hrp/essai-1/nouveau">nouveau sujet</a></h1>') }, cas: [['nouveau-sujet', '.forum-new-topic-fab', 'P', 'm']] },
  // Feuille du bas (menu d'une barre BBCode de modale sur mobile, CSS et template) : coins hauts à 8 px, bas carrés.
  'feuille-bas': { def: { ...PAGES_BOUTONS['modale-bbcode'], modale: MODALE_FEUILLE }, clics: { m: ['.modal .btn-toolbar .dropdown-toggle'] }, cas: [
    ['feuille', '.modal .btn-toolbar .dropdown-menu', 'K8', 'm'], ['defilement', '.modal .btn-toolbar::-webkit-scrollbar-thumb', 'X', 'm']
  ] },
  'modale-ordre': { def: PAGES_BOUTONS['modale-ordre'], cas: [
    ['modale', '.modal-content', 'K8'], ['alerte', '.kr-order-alerts .alert', 'K8'], ['panneau', '.kr-order-form > .panel', 'K8'],
    ['entete', '.kr-order-form > .panel > .panel-heading', 'K7', 'b'], ['onglets', '.kr-order-form .nav-tabs > li > a', 'C4', 'm'],
    ['onglets', '.kr-order-form .nav-tabs > li > a', 'N4', 'b'],
    ['aide', '.kr-order-help-toggle', 'C4'], ['pied', '.modal-footer .btn', 'C4'], ['pastilles', '.kr-order-badge', 'P'], ['image', '.kr-order-form .pull-right > img', 'X', 'm']
  ] }
};
const LARGEURS_RAYONS = [375, 767, 768, 769, 1280, 1440, 1920];
const JETONS_RAYONS = ':root { --kr-radius-sm: 7px !important; --kr-radius-md: 11px !important; }';
// Sélecteur terminé par ::before ou ::after : rayons du pseudo-élément. parent : rayons de l'élément parent (rôle H).
const MESURE_RAYONS = liste => liste.map(([cle, selecteur, cache]) => [cle, (([sel, pseudo]) => [...document.querySelectorAll(sel)].filter(e => cache || e.getClientRects().length).map(e => {
  const coins = c => [c.borderTopLeftRadius, c.borderTopRightRadius, c.borderBottomRightRadius, c.borderBottomLeftRadius];
  const s = getComputedStyle(e, pseudo || null);
  const r = e.getBoundingClientRect();
  return { rayons: coins(s), parent: coins(getComputedStyle(e.parentElement)), l: r.width, h: r.height,
    texte: `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 3).join('.')}${pseudo || ''} « ${(e.textContent || e.value || '').trim().slice(0, 20)} »` };
}))(selecteur.split(/(?=::)/))]);
const casRayons = (nom, mobile) => PAGES_RAYONS[nom].cas.filter(([, , , sup]) => !sup || sup === (mobile ? 'm' : 'b'));
const ouvrirModaleOrdre = async (page, def) => {
  await page.waitForFunction(() => window.bootbox, null, { timeout: 5000 });
  await page.evaluate(m => { window.bootbox.confirm(m, () => false); }, def.modale);
  await page.waitForFunction(() => document.querySelector('.modal.in'), null, { timeout: 5000 });
  await page.waitForTimeout(400);
};
async function releverRayons({ nom, width, variante, script, css }) {
  const { def } = PAGES_RAYONS[nom];
  const { context, page, erreurs } = await ouvrir({ nom, width, height: width < 768 ? 667 : 900, variante, script, def, css });
  if (def.modale) { await ouvrirModaleOrdre(page, def); }
  for (const sel of (PAGES_RAYONS[nom].clics || {})[width < 768 ? 'm' : 'b'] || []) {
    // Clic DOM (action locale de Bootstrap ou du thème, aucune requête) : la barre de navigation fixe recouvre parfois la cible.
    await page.evaluate(c => { const e = document.querySelector(c); if (e) { e.click(); } }, sel);
    await page.waitForTimeout(500);
  }
  const res = Object.fromEntries((await page.evaluate(MESURE_RAYONS, casRayons(nom, width < 768).map(([k, s, , , cache], i) => [`${k}#${i}`, s, cache === 'cache']))));
  await context.close();
  return { res, erreurs };
}
// Écarts au rôle pour un relevé (l) et la base (b) ; jetons { sm, md } en px.
function ecartsRayons(role, l, b, jetons) {
  const ecarts = [];
  if (!l.length) { return ['aucun élément']; }
  if (l.length !== b.length) { return [`${l.length} élément(s) contre ${b.length} dans la base`]; }
  l.forEach((m, i) => {
    const o = b[i];
    let attendus;
    if (role === 'X') { attendus = o.rayons; } else if (role === 'H') {
      if (!m.parent.slice(0, 2).every(x => parseFloat(x) > 1)) { ecarts.push(`${m.texte} panneau sans rayon (${m.parent.join(' ')})`); }
      attendus = o.rayons.map((x, n) => (parseFloat(x) > 0 ? `${parseFloat(m.parent[n]) - 1}px` : '0px'));
    } else if (role === 'P') {
      const demi = Math.min(m.l, m.h) / 2;
      if (!m.rayons.every(x => parseFloat(x) > 0 && parseFloat(x) >= demi)) { ecarts.push(`${m.texte} rayons ${m.rayons.join(' ')} sous la moitié de ${Math.round(Math.min(m.l, m.h))} px`); }
      return;
    } else {
      const v = { C4: jetons.sm, N4: 4, K8: jetons.md, K7: jetons.md - 1 }[role];
      attendus = o.rayons.map(x => (parseFloat(x) > 0 ? `${v}px` : '0px'));
    }
    if (JSON.stringify(m.rayons) !== JSON.stringify(attendus)) { ecarts.push(`${m.texte} rayons ${m.rayons.join(' ')} au lieu de ${attendus.join(' ')}`); }
  });
  return ecarts;
}
// Contrôle statique du bundle testé : feuille du thème lue par le CSSOM (une valeur var() reste telle qu'écrite), plus les rayons posés par
// le template (cssText et setProperty). Après retrait des jetons (var(--kr-radius-*), calc(var(--kr-radius-md) - 1px)), aucune valeur
// non nulle ne doit rester, hors sélecteurs X (dernier composé : image, avatar, barre de défilement, cercle .c100, dessin du hamburger,
// croix, vignette de pièce, jauge).
const X_RAYONS = /(^|[\s>+~])img\b|::-webkit-scrollbar|\.img-circle|avatar|\.c100|\.icon-bar|\.kr-pad::before|^\.kr-(n|s|w|e|hub)$|\.kr-room-thumb|gauge-(compact|full)-bar/;
const LITTERAL = v => /(^|[\s/(,])(?!0(?![.\d]))\.?\d[\d.]*[a-z%]*/.test(v.replace(/calc\(var\(--kr-radius-md\) - 1px\)|var\(--kr-radius-(sm|md|full)\)/g, ' '));
function cssDuBundle(src) {
  const i = src.indexOf('BUNDLED_CSS:\'') + 13;
  let j = i;
  while (src[j] !== '\'') { j += src[j] === '\\' ? 2 : 1; }
  return { css: src.slice(i, j), js: src.slice(0, i) + src.slice(j) };
}
const LITTERAUX_CSS = ([css, [raccourci, coins]]) => {
  const feuille = new window.CSSStyleSheet();
  feuille.replaceSync(css);
  const out = [];
  const parcourir = regles => { for (const r of regles) {
    if (!r.selectorText) { if (r.cssRules) { parcourir(r.cssRules); } continue; }
    const court = r.style.getPropertyValue(raccourci);
    const valeurs = court ? [[raccourci, court]] : coins.map(p => [p, r.style.getPropertyValue(p)]).filter(([, v]) => v);
    for (const [p, v] of valeurs) { out.push([r.selectorText, p, v]); }
  } };
  parcourir(feuille.cssRules);
  return out;
};
async function litterauxBundle(src) {
  const { css, js } = cssDuBundle(src);
  const context = await browser.newContext();
  await confineNetwork(context);
  const page = await context.newPage();
  // eslint-disable-next-line no-eval
  const decl = await page.evaluate(LITTERAUX_CSS, [(0, eval)(`'${css}'`), PROPRIETES_RAYON_TICKET48]);
  await context.close();
  const horsX = decl.filter(([sel, , v]) => LITTERAL(v) && !sel.split(',').every(s => X_RAYONS.test(s.trim().split(/\s*[\s>+~]\s*/).pop()) || X_RAYONS.test(s.trim())))
    .map(([sel, p, v]) => `${sel} { ${p}: ${v} }`);
  const template = [...js.matchAll(/border(?:-[a-z]+)*-radius(?::\s*|",\s*")([^;"\\]+)/g)].map(m => m[1].trim()).filter(LITTERAL).map(v => `template : rayon ${v}`);
  return [...horsX, ...template];
}
if (on('rayons')) {
  console.log('\n== rayons ==');
  const cas = Object.keys(PAGES_RAYONS).flatMap(nom => VARIANTES.flatMap(variante => LARGEURS_RAYONS.map(width => ({ nom, variante, width }))));
  const base = new Map();
  const res = await mapLimit(cas, async c => {
    const a = await releverRayons({ ...c, script: avantRayons });
    base.set(etiquette(c), a);
    return { c, r: await releverRayons({ ...c, script: userscript }), a };
  });
  for (const { c, r, a } of res) {
    casRayons(c.nom, c.width < 768).forEach(([k, , role], i) => {
      check(`rayons ${etiquette(c)} ${k} : ${{ C4: 'contrôle 4 px', N4: 'contrôle natif 4 px', K8: 'conteneur 8 px', K7: 'en-tête de panneau 7 px', P: 'pastille pleine', X: 'exception égale à la base', H: 'en-tête égal à son panneau moins 1 px' }[role]}`, () => {
        const l = r.res[`${k}#${i}`] || [];
        const ecarts = ecartsRayons(role, l, a.res[`${k}#${i}`] || [], { sm: 4, md: 8 });
        assert.deepEqual(ecarts, [], ecarts.slice(0, 4).join(' ; '));
      });
    });
    check(`rayons ${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(r.erreurs, []));
  }
  // Jetons redéfinis par une feuille adoptée (--kr-radius-sm 7 px, --kr-radius-md 11 px) : C4 à 7, K8 à 11, K7 à 10, X égales à la base.
  const casJetons = Object.keys(PAGES_RAYONS).flatMap(nom => [375, 1280].map(width => ({ nom, variante: 'kraland', width })));
  const resJetons = await mapLimit(casJetons, async c => ({ c, r: await releverRayons({ ...c, script: userscript, css: JETONS_RAYONS }), a: base.get(etiquette(c)) }));
  for (const { c, r, a } of resJetons) {
    casRayons(c.nom, c.width < 768).forEach(([k, , role], i) => {
      check(`rayons ${etiquette(c)} ${k} : jetons redéfinis (7 px, 11 px) suivis (${role})`, () => {
        const l = r.res[`${k}#${i}`] || [];
        const ecarts = ecartsRayons(role, l, a.res[`${k}#${i}`] || [], { sm: 7, md: 11 });
        assert.deepEqual(ecarts, [], ecarts.slice(0, 4).join(' ; '));
      });
    });
  }
  // Bascule dans le même onglet (767, 768 puis 767 px), bundle testé et base : à chaque pas, chaque élément a le rayon de son rôle.
  const releverBascule = async (nom, variante, script) => {
    const { def } = PAGES_RAYONS[nom];
    const { context, page } = await ouvrir({ nom, width: 767, variante, script, def, tactile: false });
    const pas = [];
    const relevé = async width => pas.push({ width, res: Object.fromEntries(await page.evaluate(MESURE_RAYONS, casRayons(nom, width < 768).map(([k, s, , , cache], i) => [`${k}#${i}`, s, cache === 'cache']))) });
    await relevé(767);
    for (const width of [768, 767]) {
      await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
      await page.setViewportSize({ width, height: 720 });
      await charge;
      await krReady(page, { ready: THEME_READY, label: `rayons bascule ${nom} ${variante} ${width} px` });
      await styleSettled(page, 'body');
      await relevé(width);
    }
    await context.close();
    return pas;
  };
  const casBascule = ['plateau', 'sujet', 'reception'].flatMap(nom => VARIANTES.map(variante => ({ nom, variante })));
  const resBascule = await mapLimit(casBascule, async c => ({ c, r: await releverBascule(c.nom, c.variante, userscript), a: await releverBascule(c.nom, c.variante, avantRayons) }));
  for (const { c, r, a } of resBascule) {
    r.forEach((p, n) => {
      check(`rayons bascule ${c.nom} ${c.variante} pas ${n + 1} (${p.width} px) : rayon du rôle pour chaque élément`, () => {
        const ecarts = casRayons(c.nom, p.width < 768).flatMap(([k, , role], i) => {
          const l = p.res[`${k}#${i}`] || [];
          return ecartsRayons(role, l, a[n].res[`${k}#${i}`] || [], { sm: 4, md: 8 }).map(e => `${k} ${e}`);
        });
        assert.deepEqual(ecarts, [], ecarts.slice(0, 4).join(' ; '));
      });
    });
  }
  const litteraux = await litterauxBundle(userscript);
  check('rayons : aucune valeur de rayon littérale non nulle hors exceptions X (thème et template du bundle testé)', () => assert.deepEqual(litteraux, [], `${litteraux.length} : ${litteraux.slice(0, 6).join(' ; ')}`));
}


// ---------- Espacement (ticket 9, story-grille-d-espacement-au-pas-de-4-px-plan) ----------
// Grille au pas de 4 px (H11.2) : chaque élément R (déclaration de la peau réécrite au jeton) et N (natif de Bootstrap réécrit au rôle) a,
// pour chaque propriété listée, la valeur du jeton --kr-space-n attendu (multiple de 4 entre 0 et 32 px) et le suit sous jetons redéfinis.
// E (exception de l'annexe) : propriétés listées égales au bundle de base (COMMIT_ESPACEMENT) ; hauteur, bord droit (marge automatique, E11
// à E13 : le côté auto se résout autrement quand un voisin bouge), x et largeur (colonnes du plateau, E14) arrondis au dixième.
// Cas : [clé, sélecteur, rôle, support, attendu] ; support m = mobile seulement, b = ordinateur seulement ; attendu R/N { propriété : n }
// (jeton --kr-space-n), E [propriétés].
const COMMIT_ESPACEMENT = '7bec452'; // recalage du sweep 9.12 (ancienne base d64c578) : entrées 9.1 à 9.10 comprises
// Écart voulu du bug 20 (cases des accès rapides mobiles sans la marge de .btn + .btn) : base corrigée par CORRIGER_BUG20.
const avantEspacement = CORRIGER_BUG20(sansEntete(process.env.KR_SCRIPT_AVANT_ESPACEMENT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_ESPACEMENT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_ESPACEMENT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })));
const PAGES_ESPACEMENT = Object.fromEntries(Object.entries({
  plateau: PAGES_ECHELLE.plateau,
  'plateau-typo': PAGES_ECHELLE.materiel,
  sujet: PAGES_FORUM.sujet,
  redaction: PAGES_FORUM.redaction,
  'index-rp': PAGES_FORUM['index-rp'],
  'sous-forum': PAGES_FORUM['sous-forum'],
  reception: PAGES_FORUM.reception,
  lecture: PAGES_FORUM.lecture,
  nouveau: PAGES_FORUM.nouveau,
  repondre: PAGES_RAYONS.accordeon.def,
  'modale-ordre': PAGES_BOUTONS['modale-ordre'],
  interface: PAGES_BOUTONS.interface,
  composants: PAGES_BOUTONS.tableau
}).map(([nom, def]) => [nom, { def, cas: CAS_ESPACEMENT_TICKET49[nom] }]));
const LARGEURS_ESPACEMENT = [375, 767, 768, 769, 1280, 1440, 1920];
const JETONS_ESPACEMENT = ':root { --kr-space-1: 5px !important; --kr-space-2: 9px !important; --kr-space-3: 13px !important; --kr-space-4: 17px !important; }';
const MESURE_ESPACEMENT = ([liste, proprietes]) => liste.map(([cle, sel]) => [cle, [...document.querySelectorAll(sel)].filter(e => e.getClientRects().length).map(e => {
  const s = getComputedStyle(e);
  const r = e.getBoundingClientRect();
  const dixieme = v => Math.round(v * 10) / 10;
  return { ...Object.fromEntries(proprietes.map(p => [p, s.getPropertyValue(p)])), hauteur: dixieme(r.height), droite: dixieme(r.right), x: dixieme(r.x), largeur: dixieme(r.width),
    vide: !(e.textContent || e.value || '').trim(),
    texte: `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${[...e.classList].slice(0, 3).join('.')} « ${(e.textContent || e.value || '').trim().replace(/\s+/g, ' ').slice(0, 20)} »` };
})]);
const casEspacement = (nom, mobile) => PAGES_ESPACEMENT[nom].cas.filter(([, , , sup]) => !sup || sup === (mobile ? 'm' : 'b'));
const mesurerEspacement = (page, nom, width) => page.evaluate(MESURE_ESPACEMENT, [casEspacement(nom, width < 768).map(([k, s], i) => [`${k}#${i}`, s]), PROPRIETES_ESPACEMENT_TICKET49])
  .then(Object.fromEntries);
async function releverEspacement({ nom, width, variante, script, css, deplier = false }) {
  const { def } = PAGES_ESPACEMENT[nom];
  const { context, page, erreurs } = await ouvrir({ nom, width, height: width < 768 ? 667 : 900, variante, script, def, css });
  if (def.modale) { await ouvrirModaleOrdre(page, def); }
  const res = await mesurerEspacement(page, nom, width);
  let deplie = null;
  if (deplier) {
    await page.waitForFunction(() => { const mp = document.querySelector('.mobile-mini-profile'); return mp && mp.getAnimations({ subtree: true }).every(a => a.playState !== 'running'); }, null, { timeout: 5000 });
    await page.tap('.mobile-mini-profile-header');
    await page.waitForFunction(() => { const mp = document.querySelector('.mobile-mini-profile'); return mp && mp.classList.contains('expanded') && mp.getAnimations({ subtree: true }).every(a => a.playState !== 'running'); }, null, { timeout: 5000 });
    deplie = await mesurerEspacement(page, nom, width);
  }
  await context.close();
  return { res, deplie, erreurs };
}
// Écarts au rôle pour un relevé (l) et la base (b) ; jetons : valeurs en px de --kr-space-1 à -4.
function ecartsEspacement(role, attendu, l, b, jetons) {
  if (!l.length) { return ['aucun élément']; }
  if (l.length !== b.length) { return [`${l.length} élément(s) contre ${b.length} dans la base`]; }
  const ecarts = [];
  l.forEach((m, i) => {
    if (role === 'E') {
      for (const p of attendu) { if (m[p] !== b[i][p]) { ecarts.push(`${m.texte} ${p} ${m[p]} au lieu de ${b[i][p]}`); } }
      return;
    }
    for (const [p, n] of Object.entries(attendu)) {
      const v = `${jetons[n - 1]}px`;
      if (m[p] !== v) { ecarts.push(`${m.texte} ${p} ${m[p]} au lieu de ${v} (--kr-space-${n})`); }
      if (jetons[0] === 4 && !(parseFloat(m[p]) % 4 === 0 && parseFloat(m[p]) >= 0 && parseFloat(m[p]) <= 32)) { ecarts.push(`${m.texte} ${p} ${m[p]} hors de la grille`); }
    }
  });
  return ecarts;
}
const LIBELLES_ESPACEMENT = { R: 'réécrit au jeton', N: 'natif au rôle', E: 'exception égale à la base' };
const verifierEspacement = (c, nom, width, r, a, jetons, suffixe = '') => casEspacement(nom, width < 768).forEach(([k, , role, , attendu], i) => {
  if (jetons[0] !== 4 && role === 'E') { return; }
  check(`espacement ${etiquette(c)}${suffixe} ${k} : ${LIBELLES_ESPACEMENT[role]}${jetons[0] !== 4 ? ' (jetons redéfinis 5/9/13/17 suivis)' : ''}`, () => {
    const ecarts = ecartsEspacement(role, attendu, r[`${k}#${i}`] || [], a[`${k}#${i}`] || [], jetons);
    assert.deepEqual(ecarts, [], ecarts.slice(0, 4).join(' ; '));
  });
});
// Contrôle statique : les 13 déclarations de l'annexe (section 1) et les 4 règles de rôle (section 3), lues par le CSSOM dans le thème du
// bundle testé, portent le jeton (aucun littéral) ; les règles de rôle sont sans !important, 3 dans la liste combinée et l'en-tête du tableau du sous-forum sur ordinateur ; le template pose
// l'écart du bouton d'import au jeton.
const DECLARATIONS_CSS = ([css, cibles]) => {
  const feuille = new window.CSSStyleSheet();
  feuille.replaceSync(css);
  const trouvees = [];
  const parcourir = (regles, media) => { for (const r of regles) {
    if (r.media) { parcourir(r.cssRules, r.media.mediaText); continue; }
    if (!r.selectorText) { if (r.cssRules) { parcourir(r.cssRules, media); } continue; }
    for (const [m, sel, p] of cibles) { if (m === media && sel === r.selectorText && r.style.getPropertyValue(p)) { trouvees.push([m, sel, p, r.style.getPropertyValue(p), r.style.getPropertyPriority(p)]); } }
  } };
  parcourir(feuille.cssRules, '');
  return trouvees;
};
async function declarationsEspacement(src) {
  const { css, js } = cssDuBundle(src);
  const context = await browser.newContext();
  await confineNetwork(context);
  const page = await context.newPage();
  // eslint-disable-next-line no-eval
  const trouvees = await page.evaluate(DECLARATIONS_CSS, [(0, eval)(`'${css}'`), DECLARATIONS_ESPACEMENT_TICKET49]);
  await context.close();
  // Une même règle peut exister plusieurs fois dans un média (ex. .panel-body mobile, var(--mobile-spacing-lg)) : la déclaration au jeton doit
  // exister, et aucune déclaration de ce sélecteur ne garde une valeur littérale.
  const ecarts = DECLARATIONS_ESPACEMENT_TICKET49.flatMap(([m, sel, p, v, prio]) => {
    const l = trouvees.filter(t => t[0] === m && t[1] === sel && t[2] === p);
    const manque = l.some(t => t[3] === v && t[4] === prio) ? [] : [`${m} ${sel} { ${p}: ${v}${prio ? ' !important' : ''} } absente`];
    return [...manque, ...l.filter(t => /\d/.test(t[3].replace(/var\([^)]*\)/g, '').replace(/(^|\s)0(?=\s|$)/g, ''))).map(t => `${m} ${sel} { ${p}: ${t[3]} } littérale`)];
  });
  if (!/id="kr-config-import-btn" style="margin-left:var\(--kr-space-1\)"/.test(js)) { ecarts.push('template : #kr-config-import-btn sans margin-left:var(--kr-space-1)'); }
  return ecarts;
}
if (on('espacement')) {
  console.log('\n== espacement ==');
  const cas = Object.keys(PAGES_ESPACEMENT).flatMap(nom => VARIANTES.flatMap(variante => LARGEURS_ESPACEMENT.map(width => ({ nom, variante, width }))));
  const base = new Map();
  const res = await mapLimit(cas, async c => {
    const a = await releverEspacement({ ...c, script: avantEspacement });
    base.set(etiquette(c), a);
    return { c, r: await releverEspacement({ ...c, script: userscript }), a };
  });
  for (const { c, r, a } of res) {
    verifierEspacement(c, c.nom, c.width, r.res, a.res, [4, 8, 12, 16]);
    check(`espacement ${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(r.erreurs, []));
  }
  // Boutons de la liste de l'entrée 2 (plateau, sujet, rédaction, modale, composants) : 34 px de haut sur ordinateur (± 0,5), ≥ 44 px sur mobile
  // (boutons-icônes sans texte exclus, comme dans le fragment boutons).
  const hauteurs = res.filter(({ c }) => ['plateau', 'sujet', 'redaction', 'modale-ordre', 'composants'].includes(c.nom));
  for (const { c, r } of hauteurs) {
    const mobile = c.width < 768;
    const cles = { plateau: ['boutons'], sujet: mobile ? ['messages'] : ['entete'], redaction: ['envoyer'],
      'modale-ordre': mobile ? ['aide'] : ['pied-boutons', 'aide'], composants: ['boutons', 'aide'] }[c.nom];
    if (!cles.length) { continue; }
    check(`espacement ${etiquette(c)} : boutons de l'entrée 2 ${mobile ? 'hauteur ≥ 44 px' : 'hauteur 34 px'}`, () => {
      const l = casEspacement(c.nom, mobile).flatMap(([k], i) => (cles.includes(k) ? r.res[`${k}#${i}`] || [] : []));
      const hors = l.filter(m => !m.vide && (mobile ? m.hauteur < 43.5 : Math.abs(m.hauteur - 34) > 0.5)).map(m => `${m.texte} ${m.hauteur}`);
      assert.ok(l.length, 'aucun bouton');
      assert.deepEqual(hors, [], hors.slice(0, 4).join(' ; '));
    });
  }
  // Jetons redéfinis par une feuille adoptée (--kr-space-1..4 à 5/9/13/17 px) : chaque élément R et N suit son jeton.
  const casJetons = Object.keys(PAGES_ESPACEMENT).flatMap(nom => [375, 1280].map(width => ({ nom, variante: 'kraland', width })));
  const resJetons = await mapLimit(casJetons, async c => ({ c, r: await releverEspacement({ ...c, script: userscript, css: JETONS_ESPACEMENT }), a: base.get(etiquette(c)) }));
  for (const { c, r, a } of resJetons) { verifierEspacement(c, c.nom, c.width, r.res, a.res, [5, 9, 13, 17]); }
  // Mini-profil du plateau plié puis déplié, 375 et 700 px : tuiles (E8) et écart de la liste (E9) égaux à la base.
  const casMini = VARIANTES.flatMap(variante => [375, 700].map(width => ({ nom: 'plateau', variante, width })));
  const resMini = await mapLimit(casMini, async c => ({ c, r: await releverEspacement({ ...c, script: userscript, deplier: true }), a: await releverEspacement({ ...c, script: avantEspacement, deplier: true }) }));
  for (const { c, r, a } of resMini) {
    for (const [etat, cle] of [['plié', 'res'], ['déplié', 'deplie']]) { verifierEspacement(c, c.nom, c.width, r[cle], a[cle], [4, 8, 12, 16], ` ${etat}`); }
  }
  // Bascule dans le même onglet (767, 768 puis 767 px) sur le plateau de jeu : à chaque pas, chaque élément a la valeur de son rôle.
  const releverBascule = async (variante, script) => {
    const nom = 'plateau-typo';
    const { context, page } = await ouvrir({ nom, width: 767, variante, script, def: PAGES_ESPACEMENT[nom].def, tactile: false });
    const pas = [{ width: 767, res: await mesurerEspacement(page, nom, 767) }];
    for (const width of [768, 767]) {
      await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
      await page.setViewportSize({ width, height: 720 });
      await charge;
      await krReady(page, { ready: THEME_READY, label: `espacement bascule ${nom} ${variante} ${width} px` });
      await styleSettled(page, 'body');
      pas.push({ width, res: await mesurerEspacement(page, nom, width) });
    }
    await context.close();
    return pas;
  };
  const resBascule = await mapLimit(VARIANTES, async variante => ({ variante, r: await releverBascule(variante, userscript), a: await releverBascule(variante, avantEspacement) }));
  for (const { variante, r, a } of resBascule) {
    r.forEach((p, n) => verifierEspacement({ nom: 'plateau-typo', variante, width: p.width }, 'plateau-typo', p.width, p.res, a[n].res, [4, 8, 12, 16], ` bascule pas ${n + 1}`));
  }
  const statique = await declarationsEspacement(userscript);
  check('espacement : 13 déclarations de l\'annexe et 4 règles de rôle au jeton, rôle sans !important (liste combinée, en-tête du sous-forum sur ordinateur), import du template au jeton',
    () => assert.deepEqual(statique, [], `${statique.length} : ${statique.slice(0, 6).join(' ; ')}`));
}

// ---------- Nettoyage (ticket 10, story-refactor-sweep-plan) ----------
// Retraits R1 à R6 (déclarations mortes, médias imbriqués) : chaque élément visible, ses ::before et ::after (contenu posé), toutes
// propriétés calculées (getComputedStyle, variables exclues) égaux au bundle de base (COMMIT_NETTOYAGE). Transitions et animations figées
// dans les deux bundles (couche @layer : un !important de couche bat tout !important hors couche). Corrections de média M1 (éditeur du
// kramail) et M2 (changelog), contre la base M1/M2 (COMMIT_MEDIAS_410, d'avant le ticket) : elle contient les médias au seuil 768/769
// (AVANT_TICKET410 la reconnaît à son média (width>=769px)) ; sur les pages des
// blocs M, le rendu à 768 px diffère de cette base (correction effective) ; et (A8) chaque élément visé par les blocs M1/M2 est égal à
// cette base relevée à 769 px pour les propriétés que ces blocs déclarent, sauf les exclusions nommées d'EXCLUES_A8 (valeurs qui suivent
// la largeur). À toutes les largeurs, 768 px compris, tout égal à la base (COMMIT_NETTOYAGE). Comparaison par empreinte d'élément (chemin DOM), détail des écarts relu dans les
// deux pages. Cartes du forum (R5) : racine page-forum-racine et index kr-page-forum-index (repères cités, ils lancent ce fragment).
const COMMIT_NETTOYAGE = '7bec452'; // recalage du sweep 9.12 (ancienne base d64c578) : entrées 9.1 à 9.10 comprises
// Écart voulu du bug 20 (accès rapides du plateau mobile 24 px moins hauts, page raccourcie d'autant) : base corrigée par CORRIGER_BUG20.
const avantNettoyage = CORRIGER_BUG20(sansEntete(process.env.KR_SCRIPT_AVANT_NETTOYAGE ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_NETTOYAGE, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_NETTOYAGE}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })));
// Base des corrections de média M1 et M2 (d'avant le ticket 10, médias au seuil 768/769 encore présents) : seule à porter le check
// de base d'avant 4.10, le rendu à 768 px qui change (change) et la base relevée à 769 px (A8). Retrait : au prochain ticket qui modifie les
// médias 768/769 du kramail ou du changelog ; il remplace ces trois contrôles par un contrôle absolu des propriétés de M1 et M2 à 768 px.
const COMMIT_MEDIAS_410 = '00b0786';
// Écart voulu du bug 14 (champs .form-control natifs sur ordinateur) : base corrigée par CORRIGER_BUG14, sans effet
// une fois COMMIT_* recalé au-delà du bug 14.
const avantMedias410 = CORRIGER_BUG14(sansEntete(process.env.KR_SCRIPT_AVANT_MEDIAS_410 ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_MEDIAS_410, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_MEDIAS_410}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })));
const GEL_NETTOYAGE = '@layer kr-gel { *, *::before, *::after { transition: none !important; animation: none !important; } }';
// Préparations (après le chargement) : modale d'ordre ouverte, changelog ouvert.
// Bouton posé par insertChangelogButton (template) après le chargement du changelog, hors InitQueue : data-kr-ready ne l'attend pas.
const OUVRIR_CHANGELOG = async page => {
  await page.waitForSelector('#kr-changelog-btn', { state: 'attached', timeout: PRET_MS });
  await page.$eval('#kr-changelog-btn', b => b.click());
  await page.waitForFunction(() => document.querySelector('.kr-changelog-footer button') && document.querySelector('.kr-changelog-footer button').getClientRects().length, null, { timeout: 5000 });
  await page.waitForTimeout(200);
};
// Mode mobile : enhanceCharacterModal (template) retouche la modale 150 ms après son ajout, une seule fois (entrée 9.6), hors InitQueue. Attendre la première retouche (.kr-tabs-indicator), puis un DOM calme.
const modaleMobileFinie = async page => {
  if (!await page.evaluate(() => document.body.classList.contains('mobile-mode'))) { return; }
  await waitState(page, () => document.querySelector('.modal.in .kr-tabs-indicator'), null, { maxMs: PRET_MS });
  await domQuiet(page, { quietMs: 300, maxMs: PRET_MS, label: 'modale d\'ordre mobile' });
};
// Pages : def, prep, m (bloc M1 ou M2 : rendu à 768 px changé par rapport à la base non décalée), lignes (tr:active du forum mobile).
const PAGES_NETTOYAGE = {
  plateau: { def: PAGES_ECHELLE.plateau },
  'plateau-minimal': { def: { url: BASE + '/jouer/plateau', html: lire('plateau-minimal.html') } },
  champ: { def: PAGES_ECHELLE.materiel },
  'modale-ordre': { def: PAGES_BOUTONS['modale-ordre'], prep: async page => { await ouvrirModaleOrdre(page, PAGES_BOUTONS['modale-ordre']); await modaleMobileFinie(page); } },
  'sous-forum': { def: PAGES_FORUM['sous-forum'], lignes: true },
  staff: { def: { url: BASE + '/forum/staff', html: lire('forum-index-rp.html') }, lignes: true },
  racine: { def: PAGES_FORUM.racine, lignes: true },
  sujet: { def: PAGES_FORUM.sujet },
  'redaction-forum': { def: PAGES_FORUM.redaction },
  reception: { def: PAGES_FORUM.reception, m: true },
  nouveau: { def: PAGES_FORUM.nouveau, m: true },
  repondre: { def: PAGES_RAYONS.accordeon.def, m: true },
  interface: { def: PAGES_BOUTONS.interface, prep: OUVRIR_CHANGELOG, m: true },
  composants: { def: PAGES_BOUTONS.tableau }
};
const LARGEURS_NETTOYAGE = [375, 767, 768, 769, 1280];
// A8 (bloc figé, critère 2) : dans la base relevée à 769 px, blocs de médias M1 et M2 (médias (width<=768px) et (width>=769px) de premier
// niveau ; ceux de R1, imbriqués dans un bloc (width<=767px), ne comptent pas) : propriétés déclarées (longues, variables exclues) et
// sélecteurs (règles imbriquées composées avec leur parent).
const BLOCS_M = () => {
  const media = /^\(\s*(?:width\s*(?:<=\s*768|>=\s*769)px|max-width:\s*768px|min-width:\s*769px)\s*\)$/;
  const blocs = [];
  for (const f of document.styleSheets) {
    for (const r of f.cssRules) { if (r.constructor.name === 'CSSMediaRule' && media.test(r.conditionText)) { blocs.push(r); } }
  }
  const props = new Set();
  const sels = new Set();
  const parcourir = (regles, parent) => {
    for (const r of regles) {
      if (r.constructor.name === 'CSSStyleRule') {
        const s = !parent ? r.selectorText : r.selectorText.includes('&') ? r.selectorText.replaceAll('&', `:is(${parent})`) : `:is(${parent}) ${r.selectorText}`;
        sels.add(s);
        for (let i = 0; i < r.style.length; i++) { if (!r.style[i].startsWith('--')) { props.add(r.style[i]); } }
        parcourir(r.cssRules, s);
      } else if (r.cssRules) { parcourir(r.cssRules, parent); }
    }
  };
  for (const b of blocs) { parcourir(b.cssRules, ''); }
  return { n: blocs.length, props: [...props].sort(), sels: [...sels] };
};
// Dans la page : pour chaque élément visible visé par un sélecteur des blocs M (pseudo-éléments et états retirés), et ses ::before / ::after
// à contenu posé, valeurs calculées des propriétés déclarées par ces blocs ; exclues : propriété -> sélecteur des éléments où elle est exclue.
const PROPRIETES_M = ({ props, sels, exclues }) => {
  const nettoyer = s => s.replace(/::?(?:before|after|placeholder|selection|marker|-webkit-[a-z-]+|-moz-[a-z-]+)/g, '').replace(/:(?:hover|focus-visible|focus-within|focus|active|visited)/g, '');
  const chemin = e => { const l = []; for (let n = e; n !== document.documentElement; n = n.parentElement) { l.push([...n.parentElement.children].indexOf(n)); } return l.reverse().join('.'); };
  const els = new Set();
  let ignores = 0;
  for (const s of sels) {
    try { document.querySelectorAll(nettoyer(s)).forEach(e => els.add(e)); } catch { ignores++; }
  }
  const out = {};
  for (const e of els) {
    if (!e.getClientRects().length) { continue; }
    for (const pseudo of ['', '::before', '::after']) {
      const st = getComputedStyle(e, pseudo || null);
      if (pseudo && (st.content === 'none' || st.content === 'normal')) { continue; }
      const o = {};
      for (const p of props) { if (!(p in exclues && e.matches(exclues[p]))) { o[p] = st.getPropertyValue(p); } }
      out[chemin(e) + pseudo] = { quoi: `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${[...e.classList].slice(0, 3).join('.')}${pseudo}`, o };
    }
  }
  return { ignores, out };
};
// Propriétés exclues de A8 : elles suivent la largeur de la fenêtre (1 px de plus à 769). Propriété -> [éléments concernés, raison].
const EXCLUES_A8 = {
  width: ['*', 'largeurs du flux et des colonnes Bootstrap en % : chaque conteneur a 1 px de moins à 768 (675 au lieu de 676 px)'],
  'padding-right': ['.kd-label', 'retrait clamp(0px, calc(16.6667% - 103px), 15px) du libellé des destinataires (≥ 768) : 3,5 au lieu de 3,66 px'],
  left: ['.kr-changelog-content', 'changelog centré par left: 50% et translate(-50%, -50%) : 384 au lieu de 384,5 px'],
  right: ['.kr-changelog-content', 'valeur calculée de right, déduite de left et de la largeur de la fenêtre : -216 au lieu de -215,5 px']
};
const IGNORER_KD = [
  // Croix des pastilles et « Contacts » du kramail portés à 44 × 44 (ticket backlog 21), rangées des pastilles à 10 px : seules leurs
  // propriétés géométriques sont écartées, en mode mobile seulement, mesurées par kramail-theme#confort.
  ['body.mobile-mode form[name="post_msg"] .kd-chip-x', ['width', 'inline-size', 'height', 'block-size', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
    'margin-block-start', 'margin-block-end', 'margin-inline-start', 'margin-inline-end', 'padding-top', 'padding-bottom', 'padding-left',
    'padding-right', 'padding-block-start', 'padding-block-end', 'padding-inline-start', 'padding-inline-end', 'background-clip', 'outline-offset',
    'perspective-origin', 'transform-origin']],
  ['body.mobile-mode form[name="post_msg"] .kd-contacts', ['height', 'block-size', 'top', 'bottom', 'inset-block-start', 'inset-block-end', 'perspective-origin', 'transform-origin']],
  ['body.mobile-mode form[name="post_msg"] .kd-flow', ['row-gap']]
];
// Pistes des jauges mobiles bordées d'un filet de 1 px (ticket backlog 23) : bordures des pistes et taille du remplissage (boîte intérieure
// réduite de 2 px), en mode mobile seulement, mesurées par palette-nation#jauges-filet.
const BORDS = ['top', 'right', 'bottom', 'left', 'block-start', 'block-end', 'inline-start', 'inline-end'].flatMap(c => ['color', 'style', 'width'].map(p => `border-${c}-${p}`));
const IGNORER_JAUGES = [
  ['body.mobile-mode :is(.mobile-gauge-compact-bar, .mobile-gauge-full-bar)', BORDS],
  ['body.mobile-mode :is(.mobile-gauge-compact-fill, .mobile-gauge-full-fill)', ['width', 'inline-size', 'height', 'block-size', 'right', 'bottom', 'inset-inline-end', 'inset-block-end', 'perspective-origin', 'transform-origin']]
];
const IGNORER_NETTOYAGE = [
  ['.mobile-tab-bar, .mobile-tab-bar *', ['width', 'inline-size', 'padding-left', 'padding-right', 'padding-inline-start', 'padding-inline-end', 'perspective-origin', 'transform-origin']],
  ['.mobile-tab-bar', null, '::after'],
  ...IGNORER_KD,
  ...IGNORER_JAUGES
];
const EXCLUSIONS_A8 = Object.fromEntries(Object.entries(EXCLUES_A8).map(([p, [sel]]) => [p, sel]));
const ecartsA8 = (ha, hb) => {
  const cles = [...new Set([...Object.keys(ha), ...Object.keys(hb)])];
  const ecarts = [];
  for (const k of cles) {
    if (!ha[k] || !hb[k]) { ecarts.push(`${k} ${(ha[k] || hb[k]).quoi} absent ${ha[k] ? 'de la base à 769 px' : 'à 768 px'}`); continue; }
    for (const p of Object.keys(ha[k].o)) {
      if (ha[k].o[p] !== hb[k].o[p]) { ecarts.push(`${ha[k].quoi} ${p} ${ha[k].o[p]} au lieu de ${hb[k].o[p]}`); }
    }
  }
  return { n: cles.length, ecarts };
};
// Dans la page : empreinte (FNV-1a) des propriétés calculées de chaque élément visible (racine : sous-arbres des éléments visés) et de ses
// ::before / ::after à contenu posé ; cles : ces clés seulement, visibles ou non ; detail : propriétés en clair ; ecarter : sous-arbres
// mesurés à part (caractéristiques, backlog 13) ; ignorer : [sélecteur, propriétés] retirées des éléments visés, ou [sélecteur, null,
// pseudo] pour écarter ce pseudo-élément.
const EMPREINTES = ({ racine, cles, detail, ecarter, ignorer }) => {
  const garder = p => !p.startsWith('--');
  const chemin = e => { const l = []; for (let n = e; n !== document.documentElement; n = n.parentElement) { l.push([...n.parentElement.children].indexOf(n)); } return l.reverse().join('.'); };
  const trouver = c => { let n = document.documentElement; for (const i of c ? c.split('.') : []) { n = n && n.children[Number(i)]; } return n; };
  const proprietes = s => { const o = {}; for (let i = 0; i < s.length; i++) { const p = s[i]; if (garder(p)) { o[p] = s.getPropertyValue(p); } } return o; };
  const fnv = t => { let h = 0x811c9dc5; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
  const valeur = (e, pseudo) => {
    const o = proprietes(getComputedStyle(e, pseudo || null));
    for (const [sel, props] of ignorer || []) { if (props && e.matches(sel)) { for (const p of props) { delete o[p]; } } }
    return detail ? { quoi: `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${[...e.classList].slice(0, 3).join('.')}${pseudo || ''}`, o } : fnv(Object.entries(o).map(([p, v]) => p + ':' + v).join(';'));
  };
  const out = {};
  if (cles) {
    for (const k of cles) {
      const [c, pseudo] = k.split('|');
      const e = trouver(c);
      out[k] = e ? valeur(e, pseudo) : '∅';
    }
    return out;
  }
  const racines = racine ? [...document.querySelectorAll(racine)] : [document.documentElement];
  const vus = new Set();
  for (const r of racines) {
    for (const e of [r, ...r.querySelectorAll('*')]) {
      if (vus.has(e) || !(e === document.documentElement || e.getClientRects().length) || (ecarter && e.closest(ecarter))) { continue; }
      vus.add(e);
      const c = chemin(e);
      out[c] = valeur(e);
      for (const pseudo of ['::before', '::after']) {
        if ((ignorer || []).some(([sel, props, ps]) => !props && ps === pseudo && e.matches(sel))) { continue; }
        const contenu = getComputedStyle(e, pseudo).content;
        if (contenu !== 'none' && contenu !== 'normal') { out[c + '|' + pseudo] = valeur(e, pseudo); }
      }
    }
  }
  return out;
};
// Compare la page testée (pa) à la page de base (pb) : clés visibles de l'une ou de l'autre, détail des 4 premiers écarts.
// Un écart passager (focus posé après l'ouverture d'une modale, menu en cours d'affichage) est relu jusqu'à deux fois à 300 ms d'intervalle ;
// un écart de cascade reste.
async function comparerNettoyage(pa, pb, opts = {}) {
  let r = await comparerUneFois(pa, pb, opts);
  for (let essai = 0; essai < 2 && r.diff; essai++) {
    await pa.waitForTimeout(300);
    r = await comparerUneFois(pa, pb, opts);
  }
  return r;
}
// État prêt avant tout relevé (A10), dans la page : conditions non remplies (vide = prête). Fin d'initialisation (data-kr-ready), peau
// posée (kr-theme-enabled), variante attendue, anti-FOUC levé (opacity de <html>), #content visible ; aucun voile : overlay mobile
// rendu (.kr-mobile-overlay, display: none sauf .active), backdrop Bootstrap en fondu (sans .in) ou sans modale ouverte (.modal.in),
// .dropdown-backdrop (Bootstrap 3 tactile, menu en cours).
const ETAT_NETTOYAGE = variante => {
  const h = document.documentElement;
  const vus = s => [...document.querySelectorAll(s)].filter(e => e.getClientRects().length);
  const c = document.querySelector('#content');
  const manque = [];
  if (!h.hasAttribute('data-kr-ready')) { manque.push('html[data-kr-ready] absent'); }
  if (!h.classList.contains('kr-theme-enabled')) { manque.push('html.kr-theme-enabled absent'); }
  if (!h.classList.contains('kr-theme-variant-' + variante)) { manque.push(`html.kr-theme-variant-${variante} absent`); }
  if (h.style.opacity === '0') { manque.push('anti-FOUC non levé (opacity 0)'); }
  if (!c || !c.getClientRects().length || getComputedStyle(c).visibility === 'hidden') { manque.push(c ? `#content invisible (display ${getComputedStyle(c).display})` : '#content absent'); }
  if (vus('.kr-mobile-overlay').length) { manque.push('voile .kr-mobile-overlay affiché'); }
  const fondus = [...document.querySelectorAll('.modal-backdrop:not(.in), .modal.fade:not(.in)')].filter(e => e.getClientRects().length);
  if (fondus.length) { manque.push(`fondu de modale en cours (${fondus.map(e => e.className).join(', ')})`); }
  if (document.querySelector('.modal-backdrop') && !vus('.modal.in').length) { manque.push('.modal-backdrop sans modale ouverte'); }
  if (document.querySelector('.dropdown-backdrop')) { manque.push('.dropdown-backdrop présent'); }
  return manque;
};
const PRET_MS = 10000;
const VARIANTE_PAGE = new WeakMap();
// Attend l'état prêt (au plus PRET_MS) ; renvoie null, ou les conditions non remplies à l'échéance.
async function nonPrete(page) {
  const variante = VARIANTE_PAGE.get(page);
  const ok = await page.waitForFunction(`(${ETAT_NETTOYAGE})(${JSON.stringify(variante)}).length === 0`, null, { timeout: PRET_MS }).then(() => true, () => false);
  return ok ? null : (await page.evaluate(ETAT_NETTOYAGE, variante).catch(e => [String(e.message).split('\n')[0]])).join(', ');
}
async function comparerUneFois(pa, pb, opts) {
  const [npa, npb] = await Promise.all([nonPrete(pa), nonPrete(pb)]);
  if (npa || npb) { return { n: 0, nonPret: [npb && `base non prête : ${npb}`, npa && `page testée non prête : ${npa}`].filter(Boolean).join(' ; ') }; }
  const [ha, hb] = await Promise.all([pa.evaluate(EMPREINTES, opts), pb.evaluate(EMPREINTES, opts)]);
  const manque = (h, autre) => Object.keys(autre).filter(k => !(k in h));
  const [ma, mb] = [manque(ha, hb), manque(hb, ha)];
  if (ma.length) { Object.assign(ha, await pa.evaluate(EMPREINTES, { ...opts, cles: ma })); }
  if (mb.length) { Object.assign(hb, await pb.evaluate(EMPREINTES, { ...opts, cles: mb })); }
  const cles = Object.keys(ha);
  const diff = cles.filter(k => ha[k] !== hb[k]);
  const ecarts = [];
  if (diff.length) {
    const premiers = diff.slice(0, 4);
    const [da, db] = await Promise.all([pa.evaluate(EMPREINTES, { ...opts, cles: premiers, detail: true }), pb.evaluate(EMPREINTES, { ...opts, cles: premiers, detail: true })]);
    for (const k of premiers) {
      if (da[k] === '∅' || db[k] === '∅') { ecarts.push(`${k} absent ${da[k] === '∅' ? 'du bundle testé' : 'de la base'}`); continue; }
      const props = [...new Set([...Object.keys(da[k].o), ...Object.keys(db[k].o)])].filter(p => da[k].o[p] !== db[k].o[p]);
      ecarts.push(`${da[k].quoi} ${props.length ? '' : '(écart passager, propriétés égales à la relecture) '}${props.slice(0, 3).map(p => `${p} ${da[k].o[p]} au lieu de ${db[k].o[p]}`).join(', ')}`);
    }
  }
  return { n: cles.length, diff: diff.length, ecarts };
}
const verifierNettoyage = (libelle, r) => check(libelle, () => {
  assert.ok(!r.nonPret, r.nonPret);
  assert.ok(r.n > 0, 'aucun élément mesuré');
  assert.equal(r.diff, 0, `${r.diff} élément(s) sur ${r.n} : ${r.ecarts.join(' ; ')}`);
});
// Bundle testé, base du nettoyage et base M1/M2 ouverts tels quels, sous le gel des animations.
const ouvrirNettoyage = async ({ nom, width, variante, script, tactile, css = '' }) => {
  const p = PAGES_NETTOYAGE[nom];
  const o = await ouvrir({ nom, width, height: width < 768 ? 667 : 900, variante, script, def: p.def, css: `${GEL_NETTOYAGE} ${css}`, tactile, injection: 'fin' });
  VARIANTE_PAGE.set(o.page, variante);
  if (p.prep) { await p.prep(o.page); }
  return o;
};
// Force un état (:hover, :focus, :active) sur les éléments d'un sélecteur (CDP, sans geste).
async function forcerEtat(context, page, selecteur, etats) {
  const cdp = await context.newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root: doc } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: doc.nodeId, selector: selecteur });
  for (const nodeId of nodeIds) { await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: etats }); }
  await page.waitForTimeout(50);
  return nodeIds.length;
}
// Bascule de support dans le même onglet (seuil 768) : attend le rechargement et la peau.
async function basculer(page, width, label) {
  await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
  const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
  await page.setViewportSize({ width, height: 720 });
  await charge;
  await krReady(page, { ready: THEME_READY, label });
  await styleSettled(page, 'body');
}
if (on('nettoyage')) {
  console.log('\n== nettoyage ==');
  check(`nettoyage : base M1/M2 d'avant 4.10 (${COMMIT_MEDIAS_410} : média (width>=769px) présent)`, () => assert.ok(AVANT_TICKET410(avantMedias410)));
  const cas = Object.keys(PAGES_NETTOYAGE).flatMap(nom => VARIANTES.flatMap(variante => LARGEURS_NETTOYAGE.map(width => ({ nom, variante, width }))));
  const res = await mapLimit(cas, async c => {
    const p = PAGES_NETTOYAGE[c.nom];
    const a = await ouvrirNettoyage({ ...c, script: userscript });
    const b = await ouvrirNettoyage({ ...c, script: avantNettoyage });
    const out = { c, erreurs: a.erreurs, comparaisons: [], etats: [] };
    try {
      // Caractéristiques (backlog 13) : égales à leur compétence de référence de la même page, et non plus à la base (palette du ticket 3.5).
      const caracs = await a.page.evaluate(RELEVER_CARACTERISTIQUES_BACKLOG13, C13);
      if (caracs.length) { out.caracs = caracs; }
      // Barre d'onglets de section (ticket 19 du backlog) : seules ses propriétés géométriques sont écartées (liens bornés à leur case,
      // 2 px sur les côtés, ::after de défilement masqué faute de débordement) ; géométrie mesurée par jeu-identite#onglets. Même principe
      // pour la croix des pastilles, « Contacts » et l'écart des rangées du kramail en mobile (ticket backlog 21, IGNORER_KD) et pour le filet des pistes des jauges mobiles (ticket backlog 23, IGNORER_JAUGES).
      out.comparaisons.push([`styles calculés égaux à la base${caracs.length ? ' (caractéristiques à part)' : ''}`, await comparerNettoyage(a.page, b.page, { ecarter: C13.sousArbres, ignorer: IGNORER_NETTOYAGE })]);
      // Écart accepté et consigné (épopée 7, entrée 3) : sur la réception, M1/M2 ne touchaient que le h1, réécrit par l'entrée (en-tête du
      // sous-forum) : A8 et « rendu changé » n'y ont plus d'objet tant que la base M1/M2 (COMMIT_MEDIAS_410) précède l'entrée.
      // Même écart pour l'éditeur des rédactions (épopée 7, entrée 5) : M1/M2 ne touchaient que le formulaire, au rendu du forum.
      const m768 = p.m && c.width === 768 && !(c.nom === 'reception' && AVANT_TICKET73(avantMedias410))
        && !(['nouveau', 'repondre'].includes(c.nom) && AVANT_TICKET75(avantMedias410));
      if (m768) {
        const b0 = await ouvrirNettoyage({ ...c, script: avantMedias410 });
        const rc = await comparerUneFois(a.page, b0.page, {});
        out.change = rc.nonPret || rc.diff;
        await b0.context.close();
      }
      if (m768) {
        // A8 : à 768 px, l'éditeur du kramail et le changelog égaux à la base relevée à 769 px, pour les propriétés déclarées par M1 et M2.
        const b769 = await ouvrirNettoyage({ ...c, width: 769, script: avantMedias410 });
        try {
          const blocs = await b769.page.evaluate(BLOCS_M);
          const [ma, mb] = await Promise.all([a.page.evaluate(PROPRIETES_M, { ...blocs, exclues: EXCLUSIONS_A8 }), b769.page.evaluate(PROPRIETES_M, { ...blocs, exclues: EXCLUSIONS_A8 })]);
          out.a8 = { blocs: blocs.n, props: blocs.props.length, ignores: ma.ignores, ...ecartsA8(ma.out, mb.out) };
        } finally {
          await b769.context.close();
        }
      }
      if (p.m && (c.width === 768 || c.width === 769)) {
        // Risque de M1 à 768 px : un bouton dont le texte passe à la ligne ou déborde, ou un groupe de boutons sur deux rangées (relevé à 768 et 769).
        out.boutons = await a.page.$$eval('.btn', l => l.filter(e => e.getClientRects().length).map(e => {
          const r = document.createRange();
          r.selectNodeContents(e);
          const lignes = new Set([...r.getClientRects()].filter(x => x.width && x.height).map(x => Math.round(x.top))).size;
          const g = e.parentElement.closest('.btn-group, .btn-toolbar');
          const rangees = g ? new Set([...g.querySelectorAll('.btn')].filter(x => x.getClientRects().length).map(x => Math.round(x.getBoundingClientRect().top))).size : 1;
          const deborde = e.scrollWidth > e.clientWidth + 1 ? ' débord' : '';
          return `${(e.textContent || e.title || '').trim().slice(0, 20) || e.className} ${lignes <= 1 ? 1 : lignes}/${rangees}${deborde}`;
        }));
      }
      const mobile = c.width < 768;
      if (mobile && ['plateau', 'plateau-minimal', 'champ'].includes(c.nom)) {
        // Hamburger (R2) : survol et focus forcés ; order: 1 gardé.
        for (const etat of ['hover', 'focus']) {
          const n = await forcerEtat(a.context, a.page, '.navbar-toggle', [etat]);
          await forcerEtat(b.context, b.page, '.navbar-toggle', [etat]);
          const r = n ? await comparerNettoyage(a.page, b.page, { racine: '.navbar-toggle' }) : { n: 0 };
          out.etats.push([`hamburger :${etat}`, r.n]);
          if (r.n || r.nonPret) { out.comparaisons.push([`hamburger :${etat} égal à la base`, r]); }
          await forcerEtat(a.context, a.page, '.navbar-toggle', []);
          await forcerEtat(b.context, b.page, '.navbar-toggle', []);
        }
        // Hamburger visible en mode mobile seulement (plateau-minimal à 767 px : mode mobile non posé, base comprise).
        out.ordre = await a.page.$$eval('.navbar-toggle', l => l.filter(e => e.getClientRects().length && document.body.classList.contains('mobile-mode')).map(e => getComputedStyle(e).order));
      }
      if (mobile && p.lignes) {
        const n = await forcerEtat(a.context, a.page, LIGNES_FORUM_TICKET410, ['active']);
        await forcerEtat(b.context, b.page, LIGNES_FORUM_TICKET410, ['active']);
        const r = n ? await comparerNettoyage(a.page, b.page, { racine: LIGNES_FORUM_TICKET410 }) : { n: 0 };
        out.etats.push(['lignes du forum :active', r.n]);
        if (r.n || r.nonPret) { out.comparaisons.push([`lignes du forum :active égales à la base (${n})`, r]); }
      }
      if (mobile && ['champ', 'nouveau', 'repondre'].includes(c.nom)) {
        out.champs = await a.page.$$eval(CHAMPS_TICKET410, l => l.filter(e => e.getClientRects().length).map(e => {
          const s = getComputedStyle(e);
          return `${e.id || e.name} ${Math.round(e.getBoundingClientRect().height * 10) / 10}/${s.paddingTop}/${s.paddingLeft}/${s.fontSize}`;
        }));
        out.champsForum = c.nom !== 'champ';
      }
    } finally {
      await a.context.close();
      await b.context.close();
    }
    return out;
  });
  // États forcés et ordre du hamburger : un état sans élément mesuré sur une page échoue (sélecteur faussé, élément absent de la fixture).
  // Par page, sur l'ensemble des cas mobiles : un cas peut ne rien mesurer (plateau-minimal à 767 px, sans mode mobile), la page non.
  const parPage = new Map();
  for (const { c, etats, ordre } of res) {
    for (const [quoi, n] of etats) { const k = `${c.nom}|${quoi}`; parPage.set(k, (parPage.get(k) || 0) + n); }
    if (ordre) { const k = `${c.nom}|hamburger visible en mode mobile`; parPage.set(k, (parPage.get(k) || 0) + ordre.length); }
  }
  for (const nom of ['plateau', 'plateau-minimal', 'champ']) {
    for (const quoi of ['hamburger :hover', 'hamburger :focus', 'hamburger visible en mode mobile']) {
      check(`nettoyage ${nom} : ${quoi}, au moins un élément mesuré (375 et 767 px)`, () => assert.ok(parPage.get(`${nom}|${quoi}`) > 0, 'aucun élément'));
    }
  }
  for (const nom of Object.keys(PAGES_NETTOYAGE).filter(k => PAGES_NETTOYAGE[k].lignes)) {
    check(`nettoyage ${nom} : lignes du forum :active, au moins un élément mesuré (375 et 767 px)`, () => assert.ok(parPage.get(`${nom}|lignes du forum :active`) > 0, 'aucun élément'));
  }
  for (const { c, boutons } of res.filter(r => r.c.width === 768 && r.boutons)) {
    const ref = res.find(r => r.c.nom === c.nom && r.c.variante === c.variante && r.c.width === 769);
    check(`nettoyage ${etiquette(c)} : aucun bouton à la ligne ou en débord ni groupe sur deux rangées de plus qu'à 769 px (M1/M2)`, () => {
      assert.ok(boutons.length, 'aucun bouton');
      assert.deepEqual(boutons.filter(x => !x.endsWith(' 1/1')).sort(), ref.boutons.filter(x => !x.endsWith(' 1/1')).sort(), boutons.join(' ; '));
    });
  }
  for (const { c, erreurs, comparaisons, ordre, champs, champsForum, change, a8, caracs } of res) {
    for (const [quoi, r] of comparaisons) { verifierNettoyage(`nettoyage ${etiquette(c)} : ${quoi}`, r); }
    if (caracs) {
      check(`nettoyage ${etiquette(c)} : caractéristiques au fond, bordures et texte de la compétence de la page, pastille aux jetons de son niveau (backlog 13)`, () => {
        const e = ecartsCaracteristiquesBacklog13(caracs);
        assert.deepEqual(e, [], `${e.length} écart(s) : ${e.slice(0, 6).join(' ; ')}`);
      });
    }
    if (a8) {
      check(`nettoyage ${etiquette(c)} : éléments des blocs M1/M2 égaux à la base relevée à 769 px, propriétés déclarées par ces blocs (A8)`, () => {
        assert.equal(a8.blocs, 3, 'blocs M1 et M2 attendus : 3');
        assert.ok(a8.n > 0, 'aucun élément mesuré');
        assert.equal(a8.ecarts.length, 0, `${a8.ecarts.length} écart(s) sur ${a8.n} élément(s), ${a8.props} propriétés : ${a8.ecarts.slice(0, 8).join(' ; ')}`);
      });
    }
    if (change !== undefined) { check(`nettoyage ${etiquette(c)} : rendu changé par M1/M2 (écart avec la base non décalée)`, () => assert.ok(typeof change === 'number' && change > 0, typeof change === 'string' ? change : 'aucun écart')); }
    if (ordre && ordre.length) { check(`nettoyage ${etiquette(c)} : hamburger order 1 (R2)`, () => assert.deepEqual(ordre.filter(o => o !== '1'), [], ordre.join(' '))); }
    // Rédaction du kramail (épopée 7, entrée 5) : Sujet en ligne d'expéditeur du formulaire de réponse du forum, 44 px de haut, texte centré
    // sans retrait vertical (0 12 px).
    if (champs) {
      const attendu = champsForum ? ' 44/0px/12px/16px' : ' 44/12px/12px/16px';
      check(`nettoyage ${etiquette(c)} : champs d'une ligne 44 px, retraits ${champsForum ? '0 12' : '12'} px, police 16 px (R4)`, () => {
        assert.ok(champs.length, 'aucun champ');
        assert.deepEqual(champs.filter(x => !x.endsWith(attendu)), [], champs.join(' ; '));
      });
    }
    check(`nettoyage ${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
  // Fenêtre rétrécie sans mode mobile (bloc Bootbox sans mobile-mode, R1) : modale d'ordre ouverte à 1280 px, saisie en cours (pas de
  // rechargement), fenêtre passée à 767 px.
  const resRetreci = await mapLimit(VARIANTES, async variante => {
    const ouvrirRetreci = async script => {
      const o = await ouvrirNettoyage({ nom: 'modale-ordre', width: 1280, variante, script });
      await o.page.evaluate(() => { document.querySelector('#champ-saisie').value = 'Saisie en cours'; });
      await o.page.setViewportSize({ width: 767, height: 667 });
      await o.page.waitForTimeout(1200);
      await styleSettled(o.page, 'body');
      o.mobile = await o.page.evaluate(() => document.body.classList.contains('mobile-mode'));
      return o;
    };
    const a = await ouvrirRetreci(userscript);
    const b = await ouvrirRetreci(avantNettoyage);
    const r = await comparerNettoyage(a.page, b.page);
    await a.context.close();
    await b.context.close();
    return { variante, r, mobile: a.mobile };
  });
  for (const { variante, r, mobile } of resRetreci) {
    check(`nettoyage modale-ordre ${variante} 1280 puis 767 px sans mode mobile : mode bureau gardé`, () => assert.equal(mobile, false));
    verifierNettoyage(`nettoyage modale-ordre ${variante} 1280 puis 767 px sans mode mobile : styles calculés égaux à la base`, r);
  }
  // Menu de personnage du kramail (R6) ouvert à 375 px sur la réception (la rédaction le masque), puis fenêtre passée à 1280 px (saisie en
  // cours dans un champ sonde ajouté des deux côtés : pas de rechargement, menu gardé) : rayon md aux quatre coins à chaque pas, menu égal
  // à la base.
  const resMenu = await mapLimit(VARIANTES, async variante => {
    const ouvrirMenu = async script => {
      const o = await ouvrirNettoyage({ nom: 'reception', width: 375, variante, script });
      await o.page.evaluate(() => document.querySelector('.kramail-character-selector').click());
      await o.page.waitForFunction(() => { const m = document.querySelector('.kramail-character-dropdown'); return m && m.getClientRects().length; }, null, { timeout: 5000 });
      await o.page.waitForTimeout(200);
      return o;
    };
    const rayons = page => page.$eval('.kramail-character-dropdown', e => { const s = getComputedStyle(e); return [e.getClientRects().length ? 'ouvert' : 'fermé', s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius].join(' '); });
    const a = await ouvrirMenu(userscript);
    const b = await ouvrirMenu(avantNettoyage);
    const pas = [{ width: 375, rayons: await rayons(a.page), r: await comparerNettoyage(a.page, b.page, { racine: '.kramail-character-dropdown' }) }];
    for (const o of [a, b]) {
      await o.page.evaluate(() => { const i = document.createElement('input'); i.type = 'text'; i.id = 'kr-sonde-saisie'; document.body.appendChild(i); i.value = 'Saisie en cours'; });
      await o.page.setViewportSize({ width: 1280, height: 900 });
    }
    await a.page.waitForTimeout(1200);
    const mobile = await a.page.evaluate(() => document.body.classList.contains('mobile-mode'));
    pas.push({ width: 1280, rayons: await rayons(a.page), r: await comparerNettoyage(a.page, b.page, { racine: '.kramail-character-dropdown' }) });
    await a.context.close();
    await b.context.close();
    return { variante, pas, mobile };
  });
  for (const { variante, pas, mobile } of resMenu) {
    check(`nettoyage menu-personnage ${variante} 375 puis 1280 px : même onglet, sans rechargement`, () => assert.equal(mobile, true));
    for (const p of pas) {
      check(`nettoyage menu-personnage ${variante} ${p.width} px : ouvert, rayon md (8 px) aux quatre coins (R6)`, () => assert.equal(p.rayons, 'ouvert 8px 8px 8px 8px', p.rayons));
      verifierNettoyage(`nettoyage menu-personnage ${variante} ${p.width} px : menu égal à la base`, p.r);
    }
  }
  // Bascule 767, 768 puis 767 px dans le même onglet (rédaction du kramail, M1), base basculée de même : mode suivi, tout égal à chaque pas.
  const resBascule = await mapLimit(VARIANTES, async variante => {
    const nom = 'nouveau';
    const a = await ouvrirNettoyage({ nom, width: 767, variante, script: userscript, tactile: false });
    const b = await ouvrirNettoyage({ nom, width: 767, variante, script: avantNettoyage, tactile: false });
    const pas = [];
    const mode = () => a.page.evaluate(() => document.body.classList.contains('mobile-mode'));
    pas.push({ width: 767, mobile: await mode(), comparaisons: [['styles calculés égaux à la base', await comparerNettoyage(a.page, b.page, { ignorer: IGNORER_KD })]] });
    for (const width of [768, 767]) {
      await Promise.all([a, b].map(o => basculer(o.page, width, `nettoyage bascule ${variante} ${width} px`)));
      const comparaisons = [['styles calculés égaux à la base', await comparerNettoyage(a.page, b.page, { ignorer: IGNORER_KD })]];
      pas.push({ width, mobile: await mode(), comparaisons });
    }
    await a.context.close();
    await b.context.close();
    return { variante, pas };
  });
  for (const { variante, pas } of resBascule) {
    pas.forEach((p, n) => {
      check(`nettoyage bascule nouveau ${variante} pas ${n + 1} (${p.width} px) : mode ${p.width < 768 ? 'mobile' : 'bureau'}`, () => assert.equal(p.mobile, p.width < 768));
      for (const [quoi, r] of p.comparaisons) { verifierNettoyage(`nettoyage bascule nouveau ${variante} pas ${n + 1} (${p.width} px) : ${quoi}`, r); }
    });
  }
  // Contrôles statiques du bundle testé : aucun média au seuil 768/769 (M1, M2, R1) ; classe de racine du forum ajoutée une seule fois.
  // Racine /forum chargée : classe de racine sous la classe d'index de <html> (A3 : le préfixe de R5 exclut l'index, donc la racine).
  const [INDEX_FORUM, RACINE_FORUM, CLASSE_FORUM] = CLASSES_RACINE_TICKET410;
  const { css: cssNet, js: jsNet } = cssDuBundle(userscript);
  const medias = cssNet.match(/@media[^{]*(width<=768px|width>=769px|max-width: ?768px|min-width: ?769px)[^{]*\{/g) || [];
  check('nettoyage : aucun média (max-width: 768px) ni (min-width: 769px) dans le thème du bundle testé', () => assert.deepEqual(medias, []));
  check('nettoyage : classe de racine du forum ajoutée par un seul appel du template (A3)', () => {
    assert.equal((jsNet.match(new RegExp(`classList\\.add\\(["']${RACINE_FORUM}["']\\)`, 'g')) || []).length, 1, `ajouts de ${RACINE_FORUM}`);
  });
  const resRacine = await mapLimit(VARIANTES, async variante => {
    const o = await ouvrirNettoyage({ nom: 'racine', width: 375, variante, script: userscript });
    const classes = await o.page.evaluate(([i, r, f]) => [document.documentElement.classList.contains(i), document.body.classList.contains(r), document.body.classList.contains(f)], [INDEX_FORUM, RACINE_FORUM, CLASSE_FORUM]);
    await o.context.close();
    return { variante, classes };
  });
  for (const { variante, classes } of resRacine) {
    check(`nettoyage racine ${variante} 375 px : classe de racine sous la classe d'index, sans classe du forum (A3, portée de R5)`, () => assert.deepEqual(classes, [true, true, false]));
  }
}

// ---------- Nom de forum des cartes mobiles (bug 10, bug-nom-de-forum-mobile-a-17-px-au-lieu-de-15-plan) ----------
// La règle mobile des titres h1-h3 (!important) exclut le nom de forum des cartes (h3.forum-title créé par le template) : il prend les 15 px
// de .forum-title (--kr-font-forum-name). Les autres titres h1-h3 de #col-right restent égaux au bundle de base (COMMIT_TITRE_FORUM).
const COMMIT_TITRE_FORUM = '2db3b4c';
const avantTitreForum = sansEntete(process.env.KR_SCRIPT_AVANT_TITRE_FORUM ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_TITRE_FORUM, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_TITRE_FORUM}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const STAFF_TITRE_FORUM = { url: BASE + '/forum/staff', html: lire('forum-index-rp.html') };
const MESURE_TITRE_FORUM = () => ({
  cartes: [...document.querySelectorAll('.forum-card h3.forum-title')].map(e => { const s = getComputedStyle(e); return `${s.fontSize}/${s.fontWeight}`; }),
  titres: [...document.querySelectorAll('#col-right :is(h1, h2, h3):not(.forum-title)')].filter(e => e.getClientRects().length)
    .map(e => `${e.tagName}.${e.className} ${getComputedStyle(e).fontSize}`)
});
if (on('titre-forum')) {
  console.log('\n== titre-forum ==');
  check('titre-forum : bundle testé, règle mobile des titres h1-h3 avec :where(:not(.forum-title)), ancienne règle absente, AVANT_TICKET45 et AVANT_BUG10 faux', () => {
    assert.ok(userscript.includes(TITRE_FORUM_REGLE_BUG10), 'règle réécrite absente');
    assert.ok(!userscript.includes('h1,h2,h3{font-size:var(--kr-font-section-title)!important}'), 'ancienne règle présente');
    assert.equal(AVANT_TICKET45(userscript), false, 'AVANT_TICKET45');
    assert.equal(AVANT_BUG10(userscript), false, 'AVANT_BUG10');
  });
  const cas = VARIANTES.flatMap(variante => [375, 767, 768, 1280].map(width => ({ nom: 'staff', variante, width })));
  const res = await mapLimit(cas, async c => {
    const mesurer = async script => {
      const { context, page, erreurs } = await ouvrir({ ...c, height: c.width < 768 ? 667 : 900, script, def: STAFF_TITRE_FORUM });
      const m = await page.evaluate(MESURE_TITRE_FORUM);
      await context.close();
      return { ...m, erreurs };
    };
    return { c, a: await mesurer(userscript), b: await mesurer(avantTitreForum) };
  });
  for (const { c, a, b } of res) {
    if (c.width < 768) {
      check(`titre-forum ${etiquette(c)} : chaque nom de carte (h3.forum-title) en 15 px / 700`, () => {
        assert.ok(a.cartes.length > 0, 'aucune carte');
        assert.deepEqual(a.cartes.filter(x => x !== '15px/700'), [], a.cartes.join(' ; '));
      });
    } else {
      check(`titre-forum ${etiquette(c)} : aucune carte de forum`, () => assert.deepEqual(a.cartes, []));
    }
    check(`titre-forum ${etiquette(c)} : titres h1-h3 de #col-right hors .forum-title égaux à la base (${COMMIT_TITRE_FORUM})`, () => {
      assert.ok(b.titres.length > 0, 'aucun titre mesuré');
      assert.deepEqual(a.titres, b.titres, `${a.titres.join(' ; ')} au lieu de ${b.titres.join(' ; ')}`);
    });
    check(`titre-forum ${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(a.erreurs, []));
  }
  // Bascule 767, 768 puis 767 px dans le même onglet : 15 px, sans carte, 15 px.
  const resBascule = await mapLimit(VARIANTES, async variante => {
    const { context, page } = await ouvrir({ nom: 'staff', width: 767, variante, script: userscript, def: STAFF_TITRE_FORUM, tactile: false });
    const pas = [{ width: 767, cartes: (await page.evaluate(MESURE_TITRE_FORUM)).cartes }];
    for (const width of [768, 767]) {
      await basculer(page, width, `titre-forum bascule ${variante} ${width} px`);
      pas.push({ width, cartes: (await page.evaluate(MESURE_TITRE_FORUM)).cartes });
    }
    await context.close();
    return { variante, pas };
  });
  for (const { variante, pas } of resBascule) {
    pas.forEach((p, n) => {
      check(`titre-forum bascule staff ${variante} pas ${n + 1} (${p.width} px) : ${p.width < 768 ? 'noms de carte en 15 px / 700' : 'aucune carte'}`, () => {
        if (p.width < 768) {
          assert.ok(p.cartes.length > 0, 'aucune carte');
          assert.deepEqual(p.cartes.filter(x => x !== '15px/700'), [], p.cartes.join(' ; '));
        } else {
          assert.deepEqual(p.cartes, []);
        }
      });
    });
  }
}

// ---------- Champs .form-control sur ordinateur (bug 14, bug-sur-ordinateur-les-champs-form-control-s-affichent-en-9-5-px-plan) ----------
// La règle globale des champs ne pose plus de taille ni de retrait en rem (1 rem = 10 px sous Bootstrap 3) : sur ordinateur, input et select
// .form-control reprennent les 14 px (--kr-font-body) et le retrait 6 × 12 px natifs ; .input-sm et .input-lg (sondes ajoutées) restent
// natifs ; le textarea garde sa taille (14 px) et prend le retrait natif. Mobile : tous les champs égaux au bundle de base (COMMIT_CHAMPS).
const COMMIT_CHAMPS = '7bec452'; // recalage du sweep 9.12 (ancienne base 5638f29) : entrées 9.1 à 9.10 comprises
const avantChamps = sansEntete(process.env.KR_SCRIPT_AVANT_CHAMPS ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_CHAMPS, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_CHAMPS}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const PAGES_CHAMPS = {
  report: { url: BASE + '/report/perso-000000', html: lire('report-non-lu.html') },
  kramail: { url: BASE + '/kramail/post/nouveau-4-2000', html: lire('kramail-nouveau.html') },
  forum: { url: BASE + '/forum/post/nouveau-sujet-1-10101', html: lire('forum-nouveau-sujet.html') },
  materiel: { url: BASE + '/jouer/materiel', html: lire('typographie-echelle.html') }
};
const NATIFS_CHAMPS = { '': '14px 6px 12px', sm: '12px 5px 10px', lg: '18px 10px 16px' };
const MESURE_CHAMPS = () => {
  const sondes = document.createElement('div');
  sondes.id = 'kr-sondes-champs';
  sondes.innerHTML = '<input class="form-control input-sm"><select class="form-control input-sm"><option>x</option></select>'
    + '<input class="form-control input-lg"><select class="form-control input-lg"><option>x</option></select>';
  document.body.appendChild(sondes);
  const r = [...document.querySelectorAll(':is(input, select, textarea).form-control')].filter(e => e.getClientRects().length).map(e => {
    const s = getComputedStyle(e);
    const taille = e.classList.contains('input-sm') ? 'sm' : (e.classList.contains('input-lg') ? 'lg' : '');
    return { cle: `${e.tagName.toLowerCase()}${taille ? '.' + taille : ''}${e.name ? '[' + e.name + ']' : ''}`, tag: e.tagName.toLowerCase(), taille,
      mesure: `${s.fontSize} ${s.paddingTop} ${s.paddingRight}`, complet: `${s.fontSize} ${s.padding} ${s.height} ${s.lineHeight}` };
  });
  sondes.remove();
  return r;
};
const ecartsChamps = (a, b) => a.filter((x, i) => !b[i] || b[i].cle !== x.cle || b[i].complet !== x.complet).map(x => `${x.cle} ${x.complet}`);
if (on('champs')) {
  console.log('\n== champs ==');
  check('champs : règle globale des champs sans taille ni retrait en rem (ancienne déclaration absente du bundle testé)', () => {
    assert.ok(!AVANT_BUG14(userscript), 'déclaration présente');
  });
  const cas = VARIANTES.flatMap(variante => Object.keys(PAGES_CHAMPS).flatMap(nom => [375, 767, 768, 769, 1280].map(width => ({ nom, variante, width }))));
  const res = await mapLimit(cas, async c => {
    const mesurer = async script => {
      const { context, page, erreurs } = await ouvrir({ ...c, height: c.width < 768 ? 667 : 800, script, def: PAGES_CHAMPS[c.nom] });
      const champs = await page.evaluate(MESURE_CHAMPS);
      await context.close();
      return { champs, erreurs };
    };
    return { c, a: await mesurer(userscript), b: await mesurer(avantChamps) };
  });
  for (const { c, a, b } of res) {
    if (c.width < 768) {
      check(`champs ${etiquette(c)} : champs .form-control (sondes .input-sm / .input-lg comprises) égaux à la base (${COMMIT_CHAMPS})`, () => {
        assert.ok(a.champs.length > 4, 'aucun champ de la page mesuré');
        const ecarts = ecartsChamps(a.champs, b.champs);
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
    } else {
      check(`champs ${etiquette(c)} : input et select .form-control en 14 px, retrait 6 × 12 px ; .input-sm 12 px 5 × 10 ; .input-lg 18 px 10 × 16`, () => {
        const champs = a.champs.filter(x => x.tag !== 'textarea');
        assert.ok(champs.length > 4, 'aucun champ de la page mesuré');
        const ecarts = champs.filter(x => x.mesure !== NATIFS_CHAMPS[x.taille]).map(x => `${x.cle} ${x.mesure}`);
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
      check(`champs ${etiquette(c)} : textarea .form-control en 14 px, retrait 6 × 12 px natif`, () => {
        const ta = a.champs.filter(x => x.tag === 'textarea');
        assert.ok(c.nom === 'report' || c.nom === 'materiel' || ta.length > 0, 'textarea absent');
        const ecarts = ta.filter(x => x.mesure !== NATIFS_CHAMPS['']).map(x => `${x.cle} ${x.mesure}`);
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
    }
    check(`champs ${etiquette(c)} : aucune erreur de page`, () => assert.deepEqual(a.erreurs, []));
  }
  // Bascule 767, 768 puis 767 px dans le même onglet (report) : mobile égal à la base, 14 px sur ordinateur, mobile égal à la base.
  const resBascule = await mapLimit(VARIANTES, async variante => {
    const ouvrirReport = script => ouvrir({ nom: 'report', width: 767, variante, script, def: PAGES_CHAMPS.report, tactile: false });
    const [a, b] = [await ouvrirReport(userscript), await ouvrirReport(avantChamps)];
    const pas = [{ width: 767, a: await a.page.evaluate(MESURE_CHAMPS), b: await b.page.evaluate(MESURE_CHAMPS) }];
    for (const width of [768, 767]) {
      await Promise.all([a, b].map(o => basculer(o.page, width, `champs bascule ${variante} ${width} px`)));
      pas.push({ width, a: await a.page.evaluate(MESURE_CHAMPS), b: await b.page.evaluate(MESURE_CHAMPS) });
    }
    await a.context.close();
    await b.context.close();
    return { variante, pas };
  });
  for (const { variante, pas } of resBascule) {
    pas.forEach((p, n) => {
      check(`champs bascule report ${variante} pas ${n + 1} (${p.width} px) : ${p.width < 768 ? 'champs égaux à la base' : 'champs natifs (14 px, sondes sm / lg)'}`, () => {
        assert.ok(p.a.length > 4, 'aucun champ mesuré');
        if (p.width < 768) { const e = ecartsChamps(p.a, p.b); assert.deepEqual(e, [], e.join(' ; ')); return; }
        const ecarts = p.a.filter(x => x.mesure !== NATIFS_CHAMPS[x.taille]).map(x => `${x.cle} ${x.mesure}`);
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
    });
  }
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
