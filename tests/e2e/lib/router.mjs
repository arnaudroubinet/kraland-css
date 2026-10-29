// Registre des suites e2e et routage des zones d'après git diff (utilisé par run.mjs, testé par router.test.mjs).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

// Registre : une suite = un fichier ; fragments = exécutions indépendantes (KR_FRAG) dont la somme rejoue la suite entière.
// L'ordre de lancement ne dépend PAS de cette liste : run.mjs lance les plus longs d'abord d'après tests/e2e/durations.json (orderLongestFirst).
// Le routeur relit ce bloc (constantes en MAJUSCULES déclarées avant SUITES, puis SUITES jusqu'à la ligne « ]; ») dans l'ancienne et la
// nouvelle version du fichier : garder cette forme (données littérales, sans appel de fonction) pour que l'ajout d'un fragment ne lance que lui.
const FORUM_FRAGS = [
  ['seuil-real-sombre'], ['m2-real'], ['s3-real'], ['s3d-real'],
  ['m1-sombre'], ['m1-clair'], ['f01'], ['signature'], ['n1'], ['pied', 'desktop']
];
export const SUITES = [
  { name: 'parler-viewport', file: 'parler-viewport.mjs', zones: ['parler'], frags: [['transitions'], ['fallback'], ['ajax', 'bureau'], ['debut']] },
  { name: 'forum-mobile', file: 'forum-mobile.mjs', zones: ['forum'], frags: FORUM_FRAGS, needsBootstrap: true },
  { name: 'demarrage-mobile', file: 'demarrage-mobile.mjs', zones: ['demarrage'],
    frags: [['moment-start'], ['moment-dcl'], ['moment-load'], ['moment-later'], ['desktop', 'pire-cas', 'm1', 'm-1', 's1'], ['fenetre-etroite'], ['modules-mobiles']] },
  { name: 'breakpoint-switch', file: 'breakpoint-switch.mjs', zones: ['transitions', 'plateau'], frags: [['nav-large'], ['nav-origine'], ['widths']] },
  { name: 'croix-directionnelle', file: 'croix-directionnelle.mjs', zones: ['croix', 'plateau'],
    frags: [['etats'], ['clics'], ['m1'], ['themes'], ['transitions'], ['impossibles', 'ordre', 'natif'], ['jeton']] },
  { name: 'plateau-profil-mobile', file: 'plateau-profil-mobile.mjs', zones: ['profil', 'plateau'] },
  // Fragment cartes (épopée 9, entrée 2) : carte de personnage selon sa propre largeur, vrai Bootstrap, fixture plateau-cartes-noms.
  // Fragment pv (épopée 9, entrée 7) : cercle et barre de PV des cartes en jetons, 16 variantes, même fixture.
  { name: 'plateau-qualite-usage', file: 'plateau-qualite-usage.mjs', zones: ['plateau'], frags: [['usage'], ['cartes'], ['pv']], needsBootstrap: true },
  // Menus Forum RP/HRP/Communauté/Débats/Staff : liste native à jour (fixtures inertes, route mutable). KR_CHROMIUM : navigateur local de repli.
  { name: 'menus-forums', file: 'menus-forums.mjs', zones: ['menus-forums'], frags: [['a'], ['b'], ['c'], ['d'], ['e'], ['f'], ['g'], ['h'], ['i'], ['j'], ['k'], ['l'], ['m'], ['n'], ['o'], ['p'], ['q-1280'], ['q-375'], ['r-1'], ['r-2'], ['s-1'], ['s-2'], ['s-3']] },
  { name: 'map-exclusions', file: 'map-exclusions.mjs', zones: ['images'] },
  { name: 'image-fallback', file: 'image-fallback.mjs', zones: ['images'] },
  { name: 'audit-map-images', file: 'audit-map-images.mjs', zones: ['images'] },
  // Sous-forum « Débuter » (refonte variante A) : fixture du DOM réel, DataTables émulé. Fragments = lots du rapport UX (L0 à L6).
  { name: 'sous-forum', file: 'sous-forum.mjs', zones: ['sous-forum'], frags: [['l1-themes'], ['l1-redraw'], ['l2-themes'], ['l3-themes'], ['l4-themes'], ['l5-themes'], ['l3-liste'], ['l4-perm'], ['l5-pagination-socle'], ['l5-pagination-m2-mobile'], ['l5-pagination-m2-bureau'], ['l5-pagination-viewport'], ['l6-desktop'], ['l6-themes'], ['l0'], ['l1-statuts'], ['l2-entete'], ['l7-nouveau'], ['l8-raccourci']] },
  // Index du forum (ticket 6.1) : index RP, HRP, Communauté et Débats présentés comme le sous-forum (mesuré dans le même navigateur), 375 et
  // 1440 px ; hors périmètre (racine, sous-forum, sujet, Staff) comparé au bundle d'avant le ticket ; seuil 767 / 768 / 769 ; peau coupée.
  { name: 'forum-index', file: 'forum-index.mjs', zones: ['forum', 'sous-forum'], frags: [['mobile'], ['bureau'], ['seuil'], ['hors-perimetre'], ['peau-coupee']], needsBootstrap: true },
  // Messages du forum v3 (lecture, rédaction, édition ; mobile) : fixtures du DOM réel, vrai Bootstrap. Fragments = vues du rapport.
  { name: 'messages-v3', file: 'messages-v3.mjs', zones: ['messages'], frags: [['lecture-sombre'], ['redaction-sombre'], ['edition'], ['seuils'], ['transitions'], ['bureau'], ['themes'], ['confinement']], needsBootstrap: true },
  // Kramail rédaction (barre d'outils fidèle, champ Destinataires) : fixtures anonymisées du DOM réel, autres pages Kramail comparées au bundle de feature/next.
  { name: 'kramail-redaction', file: 'kramail-redaction.mjs', zones: ['kramail'], frags: [['regression'], ['themes'], ['reponses-repondre'], ['reponses-tous'], ['reponses-transferer'], ['dest-1280'], ['dest-375'], ['dest-320'], ['barre'], ['blocage-1280'], ['blocage-375'], ['blocage-320'], ['clavier', 'reseau'], ['envoi', 'repli'], ['libelle', 'indicatif']] },
  // Garde du confinement réseau : refus effectif d'une sonde hors local (lib/confinement.mjs) et chaque contexte de suite confiné (lecture statique).
  { name: 'confinement-reseau', file: 'confinement-reseau.mjs', zones: ['confinement'] },
  // Garde-fou de fin d'initialisation : html[data-kr-ready] (InitQueue) suit toutes les mutations différées ; contre-preuves d'oubli intégrées.
  { name: 'fin-initialisation', file: 'fin-initialisation.mjs', zones: ['initialisation'], frags: [['start'], ['dcl'], ['contre-preuves']] },
  // Notifications (/report) : ligne non lue tr.bg-info lisible (piste O-A) et ligne de notification (8.1 : date au-dessus du texte sur mobile, 13/14/15 px) ;
  // 16 variantes en popup 900×800, mobile 375 et 767, onglet 1280 ; 768, 769, 1440, 1920 et bascule 767 ↔ 768 en deux variantes ; portée limitée à /report ;
  // haut de page (8.3) : sélecteur à 16 px du haut de 375 à 1920 et en bascule, padding-top du body inchangé hors /report ;
  // confort (9.10) : marge de 16 px et cibles de 44 px de 320 à 767, textes égaux à la base dès 768 et en bascule.
  { name: 'report-non-lu', file: 'report-non-lu.mjs', zones: ['report'], frags: [['popup'], ['mobile'], ['bureau'], ['bascule'], ['portee'], ['haut'], ['confort']], needsBootstrap: true },
  // Cloche des notifications (ticket 8.2, R5) : openReport redéfinie, popup 900×800 sur ordinateur (barre 992 à 1920, menu compact 768 à 991),
  // fonction native en mobile (375, 767) et peau coupée ; bascule 767 ↔ 768 ; window.open en sonde, aucune requête vers /report.
  { name: 'cloche-notifications', file: 'cloche-notifications.mjs', zones: ['cloche'], frags: [['barre'], ['compact'], ['mobile'], ['bascule'], ['peau']], needsBootstrap: true },
  // Harmonisation UX, lot 1 (défauts de style et identité du personnage) : fixtures synthétiques du plateau, de Personnage, de l'index du forum et des Règles (et rédaction Kramail), mobile 375 × 667 (titre du panneau et accès rapides : ordinateur 1280 × 720) ; fixture reconstruite de Cybermonde, 320 à 1280 px (hors-forum-js).
  { name: 'jeu-identite', file: 'jeu-identite.mjs', zones: ['plateau', 'profil', 'forum', 'kramail', 'sous-forum', 'cybermonde'], frags: [['fuite-forum'], ['regles-ok'], ['nom'], ['section-active', 'icones'], ['hors-forum-js']] },
  // Cybermonde : carte du monde et carte de ville centrées sur ordinateur (768 à 1920 px), cadre défilant ouvert au milieu sur mobile (320 à 767 px),
  // zones cliquables intactes, panneaux comparés au bundle « avant » ; fixtures synthétiques cybermonde-monde.html et cybermonde-region.html.
  { name: 'cybermonde-carte', file: 'cybermonde-carte.mjs', zones: ['cybermonde'], frags: [['monde'], ['region'], ['zones'], ['panneaux'], ['sans-carte'], ['recentrage']], needsBootstrap: true },
  // Modale d'ordre (épopée 2) : socle commun aux deux supports (reconnaissance, marquage kr-order-modal / kr-order-form, « Annuler » / « Valider »,
  // contenu de #ajax-order remplacé ; alertes sous le titre, collées au défilement, aide repliée derrière « ? Aide »), fixtures synthétiques Dormir
  // et Pouvoir, harnais Bootbox de Parler ; 375 × 667, 767 à 769, 1280 à 1920 px ; contrastes dans les 16 variantes (lib/variantes.mjs).
  { name: 'modale-ordre', file: 'modale-ordre.mjs', zones: ['modale-ordre'], frags: [['mobile'], ['bureau'], ['largeurs'], ['seuil'], ['variantes']] },
  // Couleurs de nation (épopée 3) : jetons de rôle des 16 variantes égaux à DESIGN.md, liens en couleur d'accent (repos, survol souligné),
  // consommateurs des jetons redéfinis, texte posé sur la primaire foncée ; boutons primaires de toute balise et de tout état et texte posé sur
  // la couleur de nation en paire d'action (ticket 2) ; fixture synthétique palette-nation.html, 375 × 667, 767 à 769, 1280 à 1920 px, peau
  // coupée ; balayage des fixtures de référence (report, plateau, sujet, sous-forum, index RP, kramail) ; texte coloré en accent, couleurs de
  // nation du sombre, rouge et bleu en dur (ticket 3 ; fixtures synthétiques palette-nation-textes.html et palette-nation-accueil.html) ;
  // en-têtes, onglets, bouton standard et hr thémés comme le sombre, texte atténué du clair (ticket 4 ; fixture synthétique
  // palette-nation-composants.html, pages de référence comparées au bundle d'avant le ticket) ; palette d'états réservée aux états (ticket 5 ;
  // fixtures synthétiques palette-nation-etats.html et palette-nation-profil.html, pages de référence, non lu gardé) ; une couleur par jauge,
  // la même sur ordinateur et mobile (ticket 6 ; fixture synthétique palette-nation-jauges.html). Aucun mot-clé : une
  // déclaration de jeton élargit au total, comme toute déclaration de variable.
  { name: 'palette-nation', file: 'palette-nation.mjs', zones: ['palette-nation'], frags: [['mobile'], ['bureau'], ['largeurs', 'peau-coupee'], ['balayage-mobile'], ['balayage-bureau'], ['textes-mobile'], ['textes-bureau'], ['textes-largeurs'], ['composants-mobile'], ['composants-bureau'], ['composants-largeurs'], ['composants-pages-mobile'], ['composants-pages-bureau'], ['etats-mobile'], ['etats-bureau'], ['etats-largeurs'], ['etats-pages-mobile'], ['etats-pages-bureau'], ['jauges-mobile'], ['jauges-bureau'], ['jauges-largeurs']], needsBootstrap: true },
  // Typographie et formes (épopée 4) : jetons d'échelle de DESIGN.md sur :root (tailles, rayons, espacements, cibles tactiles), étiquettes et
  // pastilles en 12 px gras par --kr-font-label (ticket 1) ; fixture synthétique typographie-formes.html (plateau, sujet de forum inventé),
  // index RP, sous-forum, rédaction du kramail ; 375, 767, 768, 769 et 1280 px, Kraland clair et Empire Brun sombre, couleurs comparées au bundle
  // de base ; mini-profil replié et déplié, bascule 767/768/767. Boutons de taille normale (ticket 2) : 14 px et 34 px sur ordinateur, ≥ 44 px
  // sur mobile, exclusions comparées au bundle de base, bascule. Échelle typographique (ticket 5, fragment echelle) : fixture synthétique
  // typographie-echelle.html (Matériel), Personnage, plateau, sous-forum, kramail ; en-têtes 17 px / 700, noms 15 px / 600, détails 13 px, texte
  // 15 px mobile, plancher de 12 px sur le plateau mobile, onglet « Personnage » entier à 360 et 375 px, jetons redéfinis suivis. Échelle du
  // forum et du kramail (ticket 7, fragment echelle-forum) : index, sous-forum, sujet, rédaction, kramail ; noms 15 px, détails 13 px, plancher
  // de 12 px sur mobile, masque miroir ECHELLE_TICKET47 sur le bundle de base. Trois rayons (ticket 8, fragment rayons) : plateau, sujet,
  // rédaction, index RP, sous-forum, kramail, modale d'ordre ; rôles 4 px, 8 px, 7 px et plein mesurés, jetons redéfinis suivis, bascule,
  // contrôle statique des littéraux. Grille d'espacement (ticket 9, fragment espacement) : plateau, forum, kramail, modale d'ordre,
  // Interface, composants ; retraits, marges et écarts au jeton, exceptions égales au bundle de base, jetons redéfinis suivis. Nettoyage (ticket 10,
  // fragment nettoyage) : styles calculés égaux au bundle de base après retrait des déclarations mortes, médias au seuil 767/768. Nom de forum
  // des cartes mobiles (bug 10, fragment titre-forum) : h3.forum-title de Staff en 15 px, autres titres h1-h3 égaux au bundle de base. Champs .form-control (bug 14, fragment champs) : input, select et textarea en 14 px et retrait 6 × 12 px natifs sur
  // ordinateur, .input-sm / .input-lg natifs, mobile égal au bundle de base. Mot-clé : composants mesurés (pas l'emploi du jeton, pour qu'une retouche de .label, .badge garde son élargissement) ; une déclaration
  // de jeton élargit au total, comme toute déclaration de variable.
  { name: 'typographie-formes', file: 'typographie-formes.mjs', zones: ['typographie-formes'], frags: [['jetons'], ['mobile'], ['bureau'], ['mini-profil'], ['bascule'], ['boutons'], ['boutons-bascule'], ['compact'], ['echelle'], ['echelle-forum'], ['rayons'], ['espacement'], ['nettoyage'], ['titre-forum'], ['champs']], needsBootstrap: true },
  // Cartes et pastilles (épopée 5, entrée 1) : carte de section mobile des pages de jeu, du kramail et des règles (8 px des bords, en-tête de
  // 48 px collé au contenu, titre en couleur du texte), module « Panel Sections Collapse » (chevron dans le flux, repli en 48 px, tap mesuré),
  // contrôles statiques ; ordinateur (768 à 1920) égal au bundle de base, bascule 767/768 dans les deux sens, contraste des 16 variantes.
  // Entrée 2 : forum (sous-forum, index, Staff, racine) en carte de section à 375 et 767, fil de sujet, accordéon et modales égaux à la base ;
  // lignes de tableau dans la carte, égales à la base ; repli au chevron. Fixtures synthétiques des pages de jeu, du kramail, des règles, du
  // Cybermonde et fixtures du forum. Entrée 3 : groupes du plateau en carte de section à 375 et 767 (accordéon, boutons, ordre et contenu
  // des cartes égaux à la base), mini-profil égal à la base, ordinateur et bascule égaux à la base (fixture plateau-qualite-usage).
  // Entrée 5 (fragment etiquettes) : « PNJ » des cartes, marque native PNJ, compteur de groupe et tags mobiles en étiquette de catégorie,
  // compteurs de contact du kramail en pastille d'état ; pièce courante, états, hors familles et tags natifs égaux à la base.
  { name: 'cartes-pastilles', file: 'cartes-pastilles.mjs', zones: ['cartes-pastilles'], frags: [['carte'], ['module'], ['kramail'], ['forum'], ['lignes'], ['chevron'], ['bureau'], ['bascule'], ['groupes'], ['pastilles'], ['etiquettes'], ['contraste']], needsBootstrap: true },
  // Activité du forum (épopée 6, entrée 2) : fil de sujet ouvert sur une ancre de message (#msg) à 375, 767, 768 et 1280, dans les deux
  // états d'injection (début : largeur lue 981 ; body : largeur émulée), peau coupée, mini-chat (#flap) ; parcours flèche « dernier
  // message » de l'index et « premier non lu » du sous-forum ; lignes de l'index mobile d'au moins 72 px ; seuil 767/768/769 et bascule ;
  // ordinateur et Staff égaux au bundle de base ; « Envoyer » sous un message ouvert et accordéon ou modale sur une page du forum (ticket 12).
  { name: 'forum-activite', file: 'forum-activite.mjs', zones: ['forum-activite'], frags: [['ancres'], ['parcours'], ['lignes'], ['seuil'], ['bureau'], ['fil'], ['entete'], ['plus'], ['ligne'], ['envoyer'], ['panneaux'], ['confort']], needsBootstrap: true },
  // Kramail, thème (épopée 7, entrée 1) : gardes de page sur <html> (kr-page-kramail, liste / lecture / compose), injection en tête et au
  // DOMContentLoaded ; dossiers en Onglets de section libellés à 375 et 767 px, clair et sombre ; ordinateur (768, 1280) égal à la base figée.
  // Lecture (entrée 2) : message, fil et message de l'Envoi égaux au message de sujet du forum ; Répondre libellés, « ••• » ; 16 variantes.
  // Listes (entrée 4) : lignes de Réception, Envoi et Corbeille aux valeurs du sous-forum, sélection, pagination, « non lu », dossiers.
  { name: 'kramail-theme', file: 'kramail-theme.mjs', zones: ['kramail'], frags: [['gardes'], ['onglets'], ['bureau'], ['bascule'], ['lecture'], ['lecture-plus'], ['lecture-couleurs'], ['entete'], ['entete-menu'], ['entete-clavier'], ['entete-couleurs'], ['liste'], ['liste-actions'], ['liste-couleurs'], ['liste-dossiers'], ['redaction'], ['redaction-focus'], ['redaction-defilement'], ['redaction-dest'], ['redaction-palette'], ['envoyer']], needsBootstrap: true },
  // Confort mobile (épopée 9, entrée 1) : marge latérale de 16 px des pages de jeu et de l'Aide (fixture synthétique aide.html), mesurée sur
  // le texte (lib/marges.mjs) à 320, 375, 700 et 767 px, cartes de section à 8 px, mini-profil du plateau plié et déplié ; 768, 769 et
  // 1280 px, bascule 767 <-> 768 et pages hors périmètre (forum, kramail) égales au bundle de base. Entrée 4 : pages
  // secondaires (fixtures synthétiques secondaires-*.html) à 320, 375 et 767 px, cibles hors bouton à 44 px, titre de la ville collant. Entrée 13 : liste des Membres et fenêtre d'aide /help (fixtures
  // secondaires-membres.html, aide-fenetre*.html), marge, cibles de 44 px, bureau et bascule égaux à la base 034a820. Entrée 5 : cibles du plateau (plateau).
  { name: 'confort-mobile', file: 'confort-mobile.mjs', zones: ['confort-mobile'], frags: [['mobile'], ['bureau'], ['bascule'], ['hors-perimetre'], ['secondaires'], ['membres-aide'], ['plateau']], needsBootstrap: true }
];
export const ZONES = [...new Set(SUITES.flatMap(s => s.zones))];
const GARDE_CONFINEMENT = 'confinement-reseau'; // relancée dès qu'un fichier de suite change (nouveau contexte non confiné ?)
const GARDE_INIT = 'fin-initialisation'; // relancée dès que le template change (tâche différée non enregistrée auprès d'InitQueue ?)

// Ordre de lancement : plus longs d'abord (ordonnancement LPT), d'après les durées mesurées (secondes par id d'unité, tests/e2e/durations.json).
// Une unité sans durée connue (fragment nouveau ou renommé) passe EN TÊTE : on ne sait pas si elle est longue, et la lancer tôt évite qu'elle
// allonge la fin de la suite. À durée égale ou inconnue, l'ordre du registre est conservé (tri stable).
export function orderLongestFirst(units, durations = {}) {
  const known = u => Number.isFinite(durations[u.id]);
  return units.map((u, i) => ({ u, i })).sort((a, b) => {
    if (known(a.u) !== known(b.u)) { return known(a.u) ? 1 : -1; }
    if (known(a.u) && durations[b.u.id] !== durations[a.u.id]) { return durations[b.u.id] - durations[a.u.id]; }
    return a.i - b.i;
  }).map(x => x.u);
}

// Zones touchées d'après un fichier. Valeurs spéciales : 'all' (total), 'generated' (bundle : la source fait foi), 'lint' (outillage :
// lint seul, aucune suite), 'registry' (router.mjs : diff du registre), 'router-test' (test du routeur seul), 'unit' (tests unitaires du
// cœur pur seuls, node --test), 'package' (package.json : clés comparées), 'suite' (fichier de suite : cette suite et celles qui l'importent).
export const FILE_RULES = [
  [/^tests\/e2e\/run\.mjs$|^package-lock\.json$/, 'all'],
  [/^tests\/e2e\/lib\/router\.mjs$/, 'registry'],
  [/^tests\/e2e\/lib\/router\.test\.mjs$/, 'router-test'],
  [/^tests\/unit\//, 'unit'], // cœur pur (lot F) : tests et chargeur sans navigateur ; le template, lui, relance aussi ces tests
  [/^package\.json$/, 'package'],
  [/^tests\/e2e\/lib\//, 'all'],
  [/^tests\/e2e\/[\w-]+\.mjs$/, 'suite'],
  // Fixtures des groupes et du mini-profil, lues aussi par cartes-pastilles (fragment groupes, épopée 5, entrée 3).
  [/^tests\/e2e\/fixtures\/plateau-(?:qualite-usage|minimal)\.html$/, ['plateau', 'cartes-pastilles']],
  [/^tests\/e2e\/fixtures\/plateau-/, ['plateau']],
  [/^tests\/e2e\/fixtures\/parler\//, ['parler']],
  [/^tests\/e2e\/fixtures\/modale-ordre\//, ['modale-ordre']],
  [/^tests\/e2e\/vendor\/parler\//, ['parler', 'modale-ordre']], // harnais Bootbox natif, repris par la suite de la modale d'ordre
  // Fixtures lues aussi par cartes-pastilles (fragment pastilles, épopée 5, entrée 4 : référence du sous-forum, pastilles vides de la réception).
  // Parcours « premier non lu » de forum-activite (épopée 6, entrée 2) : titre du sujet « Gagner des PA ».
  [/^tests\/e2e\/fixtures\/sous-forum-debuter\.html$/, ['sous-forum', 'cartes-pastilles', 'forum-activite']],
  [/^tests\/e2e\/fixtures\/sous-forum-/, ['sous-forum']],
  [/^tests\/e2e\/fixtures\/map-inventory/, ['images']],
  [/^tests\/e2e\/fixtures\/kramail-reception\.html$/, ['kramail', 'cartes-pastilles']],
  [/^tests\/e2e\/fixtures\/kramail-/, ['kramail']],
  [/^tests\/e2e\/fixtures\//, 'fixture'], // autre fixture : les suites qui citent son nom de fichier (aucune -> total)
  [/^tests\/e2e\/durations\.json$/, []], // durées mesurées : changent l'ordre de lancement, jamais le résultat d'une vérification
  [/^(README\.md|CLAUDE\.md|AGENTS\.md|REPORT\.md|docs\/|\.claude\/|changelog\.json|version\.json|screenshots\/|start-server\.|\.github\/)/, []],
  // Outillage : aucun effet sur le bundle ni sur les suites (configuration du lint, attributs git, agents, ancien script de migration non testé).
  [/^(\.gitattributes|\.gitignore|\.hermes\/|_bmad\/|_bmad-output\/|eslint\.config\.js|\.stylelintignore|\.stylelintrc\.json|\.mcp\.json|skills-lock\.json|validate\.js|kraland-userscript-main\.js)$|^(\.hermes|_bmad|_bmad-output)\//, 'lint'],
  [/^(kraland-userscript-main\.user\.js|kraland-userscript\.user\.js|kraland-userscript-dev\.user\.js)$/, 'generated'] // fichiers générés : la source fait foi, sinon total
];
// package.json : clés sans effet sur l'exécution des suites (rien à lancer si seules elles changent). Toute autre clé (scripts, dépendances,
// type...) élargit au total.
const PACKAGE_INERT_KEYS = ['name', 'version', 'description', 'author', 'license', 'keywords', 'repository', 'homepage', 'bugs', 'private', 'contributors'];

// Zones dont une suite vérifie la bascule mobile/desktop (breakpoint-switch) : tout mot-clé de bascule les vise TOUTES, en plus du démarrage.
const BASCULE_ZONES = ['demarrage', ...SUITES.filter(s => s.file === 'breakpoint-switch.mjs').flatMap(s => s.zones)];
// Mots-clés d'un hunk (CSS/JS) -> zone. Un hunk sans mot-clé reconnu (ni dans son module englobant, voir SECTIONS) élargit au total.
export const KEYWORDS = [
  [/kr-order-viewport|kr-order-visible|trackOrderModalViewport|visualViewport/i, ['parler']],
  // Modale d'ordre : repères du socle (kr-order-modal, kr-order-form...), règles .bootbox-confirm, contenu #ajax-order, boutons Bootbox.
  // Parler aussi : sa sonde est une modale d'ordre (#ajax-order form[name=post_msg]) dont il mesure la géométrie et les nœuds natifs.
  [/kr-order-(?!viewport|visible)|bootbox-confirm|ajax-order|bb-handler|modale-ordre/i, ['modale-ordre', 'parler']],
  [/kr-page-report/, ['report']],
  // Cloche des notifications (ticket 8.2) : redéfinition d'openReport, vérifiée par cloche-notifications.
  [/openReport|private_report/, ['cloche']],
  [/forums-added|updateForum|kr-forums-|menus-forums/i, ['menus-forums']],
  [/kr-msg|kr-tool|kr-sender|messages-v3|forum-msg|media-list/i, ['messages']],
  [/(?<!sous-|sub)forum|kramail|bbcode|smiley|signature|repondre|répondre|nouveau-sujet|btn-toolbar|forum-thread/i, ['forum']],
  [/kramail|post_msg|\.kd-|kd-natif|btn-toolbar|Destinataires/i, ['kramail']],
  [/sous-forum|#topics|dataTable|kr-topic|kr-subforum|forums-cards|forum-card|permanent-topic|forum-mobile-breadcrumb|forum-new-topic|forum-thread-action-new/i, ['sous-forum']],
  // Panneaux du forum, du sous-forum et de la racine (page-forum, page-forum-racine, kr-page-forum-index, kr-subforum suivis de .panel…) : carte
  // de section mesurée par cartes-pastilles (épopée 5, entrée 2 : fragments forum, lignes, chevron), en plus des zones du forum.
  [/(?:page-forum(?:-racine)?|kr-page-forum-index|kr-subforum)\b[^{]*\.panel/, ['cartes-pastilles']],
  [/cybermonde/i, ['cybermonde']],
  [/medieval|map-image|carte|MEDIEVAL_MAP|image-fallback|fallback/i, ['images']],
  [/croix|dpad|directionnel|d-pad/i, ['croix']],
  [/mini-profil|mobile-mini-profile|profil/i, ['profil']],
  // Étiquettes et pastilles (épopée 4, ticket 1) : emploi du jeton et composants mesurés. Une déclaration du jeton (sans var()) élargit au total.
  // Boutons de taille normale (ticket 2) : boutons d'action et d'accès rapide du plateau, Ajouter / Effacer du kramail.
  // Bouton compact (ticket 4) : votes des messages, pagination du sujet et pages du sujet dans le sous-forum.
  // Échelle typographique (ticket 5) : noms et détails du plateau, onglets et jauges du mini-profil, légendes des compétences.
  [/dashboard-card-name|dashboard-card-status|mobile-tab-label|mobile-(?:mini-profile-)?gauges?-compact|kr-skill-caption|kr-topic-badge|kd-opt-tag|kr-room-here|dashboard-card-pnj|kr-skill-badge|kr-stat-badge|kr-action-grid|kr-quick-access-buttons|kd-msg-btn|\.center\s*>\s*ul\.pagination|ul\.pagination:not\(:first-of-type\)|btn-group-xs\[id\^="?ajax-/, ['typographie-formes']],
  // Étiquettes de catégorie (épopée 5, entrée 5) : marque native PNJ, « PNJ » des cartes, tags du forum. dashboard-card-pnj reste aussi dans la
  // règle de l'épopée 4 ci-dessus (doublon sans effet : les zones s'ajoutent).
  [/xmini|dashboard-card-pnj|forum-tags/, ['cartes-pastilles', 'typographie-formes', 'palette-nation']],
  // Échelle du forum et du kramail (ticket 7, fragment echelle-forum) : composants mesurés des index, du sous-forum, du sujet, de la rédaction et
  // du kramail (les repères déjà cités par la suite l'y ajoutent d'eux-mêmes, voir MAX_CITING).
  [/forum-mobile-breadcrumb|cartouche|tagforum|kr-sender-row|kr-message-row|kramail-msg-(?:sender|date|body)|kd-help|kd-contacts|kd-label|permanent-topic-stats|(?<![\w-])(?:forum-title|forum-description|forum-moderators|last-time|kd-(?:sec|warn|empty|foot|msg))(?![\w-])/, ['typographie-formes']],
  // Matériel, Bâtiments, Employés (ticket 6, fragment echelle) : détails de ligne des pages de jeu (aussi les lignes du commerce du plateau)
  // et objets déplacés du panneau Matériel du plateau ; classe de page du plateau (exclu de ces règles, posée par le template).
  [/list-group-item-text|kr-materiel-moved|kr-page-plateau/, ['typographie-formes', 'plateau']],
  // Trois rayons (ticket 8, fragment rayons) : tout rayon et ses jetons ; kramail aussi, dont la non-régression pose le masque miroir
  // RAYONS_TICKET48 sur le bundle de base.
  [/border(?:-[a-z]+)*-radius|--kr-radius|--mobile-radius/, ['typographie-formes', 'kramail']],
  // Grille d'espacement (ticket 9, fragment espacement) : tout emploi d'un jeton d'espacement ; zones dont les suites comparent des retraits,
  // des positions ou des hauteurs au bundle de base (masque miroir ESPACEMENT_TICKET49).
  [/--kr-space-\d/, ['typographie-formes', 'forum', 'sous-forum', 'kramail', 'plateau', 'modale-ordre', 'cybermonde']],
  // Composants génériques de Bootstrap (en-têtes de panneau, titres d'élément de liste) : cités par plus de MAX_CITING suites, ils lancent
  // toutes les zones qui les rendent ou les comparent (forum-index, sous-forum, kramail-redaction, modale-ordre, cybermonde-carte,
  // jeu-identite, palette-nation par COMPOSANTS_TICKET4, plateau, mini-profil, typographie-formes ; échelle typographique, ticket 5 ; carte de
  // section, cartes-pastilles, épopée 5).
  [/panel-heading|panel-title|list-group-item-heading/, ['forum', 'sous-forum', 'kramail', 'modale-ordre', 'cybermonde', 'palette-nation', 'plateau', 'profil', 'typographie-formes', 'cartes-pastilles']],
  // Module « Panel Sections Collapse » (sections repliables du jeu, épopée 5, entrée 1) : en-tête, corps et chevron mesurés par cartes-pastilles.
  [/building-section|accordion-icon/, ['cartes-pastilles']],
  // Pastilles d'état de la barre (épopée 5, entrée 4) : cloche et enveloppe, originaux et clones, mesurées par cartes-pastilles (fragment
  // pastilles) et typographie-formes (étiquettes, cloche, badge).
  [/badge-danger|kr-bell-swing|fa-bell\b/, ['cartes-pastilles', 'typographie-formes']],
  // Groupes du plateau (épopée 5, entrée 3) : section, grille, titre et chevron de l'accordéon, mesurés par cartes-pastilles (fragment groupes),
  // plateau-qualite-usage (bureau) et typographie-formes (formes, nettoyage).
  [/dashboard-section|dashboard-cards-grid|dashboard-group-title|accordion-icon/, ['cartes-pastilles', 'plateau', 'typographie-formes']],
  // Carte de personnage selon sa propre largeur (épopée 9, entrée 2) : conteneur kr-carte-perso, en-tête et bloc du nom de la carte ;
  // plateau-qualite-usage (fragment cartes), cartes-pastilles (carte) et typographie-formes (nom).
  [/kr-carte-perso|dashboard-card-header|dashboard-card-name-container/, ['plateau', 'cartes-pastilles', 'typographie-formes']],
  // PV des cartes en jetons (épopée 9, entrée 7) : cercle, piste, arc, barre, avatar KO et jetons --kr-pv-* ; plateau-qualite-usage (fragment pv),
  // et les suites qui mesurent les cartes : cartes-pastilles, typographie-formes, palette-nation, confort-mobile.
  [/dashboard-card-hp|dashboard-card-avatar|kr-pv-/, ['plateau', 'cartes-pastilles', 'typographie-formes', 'palette-nation', 'confort-mobile']],
  [/jauge/i, ['profil', 'plateau']], // SKILL : jauges -> plateau ; le mini-profil les affiche aussi
  [/breakpoint|resize|reload|RELOAD_|sessionStorage|isMobileDevice|mobile-mode/i, BASCULE_ZONES],
  // Activité du forum (épopée 6, entrée 2) : ligne de l'index mobile (72 px au moins), ancres de message et mini-chat, lien « premier non
  // lu » du sous-forum, vérifiés par forum-activite.
  [/kr-page-forum-index\b[^{]*tbody\s*>\s*tr|location\.hash|scrollRestoration|flap|smart-redirect/, ['forum-activite']],
  // Marge et cibles mobiles du forum (épopée 9, entrée 8, html.kr-page-forum, distincte de kr-page-forum-index) : fragment confort de forum-activite.
  [/kr-page-forum(?![-\w])/, ['forum-activite']],
  // Fil d'Ariane commun de l'index et du sous-forum (épopée 6, entrée 3) : vérifié par le fragment fil de forum-activite.
  [/forum-mobile-breadcrumb|createForumBreadcrumb/, ['forum-activite']],
  // En-tête du sujet mobile (épopée 6, entrée 4) : barres d'actions et garde du sujet, vérifiées par le fragment entete de forum-activite.
  [/forum-thread-action|kr-forum-sujet/, ['forum-activite']],
  // Bouton « ••• » commun du forum et du kramail (épopée 6, entrée 5) : vérifié par le fragment plus de forum-activite ; mesuré aussi par
  // les suites qui le comparent au bundle de base (cartes-pastilles, palette-nation, typographie-formes, kramail-redaction, forum-index).
  // `kr-more\b` couvre aussi `kr-more-glyph` (une ligne du glyphe seule y route).
  [/kr-more\b|createMoreButton/, ['forum-activite', 'messages', 'kramail', 'typographie-formes', 'cartes-pastilles', 'palette-nation']],
  // Icône de la ligne de forum lue dans la liste latérale (épopée 6, entrée 6) : vérifiée par le fragment ligne de forum-activite ; mesurée
  // aussi par les suites qui la comparent au bundle de base (cartes-pastilles, typographie-formes).
  [/kr-forum-icon/, ['forum-activite', 'cartes-pastilles', 'typographie-formes']],
  // Marge mobile de 16 px (épopée 9, entrée 1) : classes de page posées par KR_PAGE_CLASSES, retrait --kr-marge-page et jeton
  // --kr-margin-mobile, vérifiés par confort-mobile (les pages de jeu y sont mesurées ; les autres, comparées au bundle de base) ;
  // pages secondaires (entrée 4, kr-page-secondaire) mesurées par le fragment secondaires ; notifications (entrée 10) par report-non-lu#confort.
  [/kr-marge-mobile|kr-marge-page|kr-margin-mobile|KR_PAGE_CLASSES|krPageClasses/, ['confort-mobile', 'report']],
  [/kr-page-jeu|kr-page-aide|kr-page-secondaire/, ['confort-mobile']],
  // Cibles du plateau mobile (épopée 9, entrée 5) : actions des cartes, boutons de groupe, bouton de gestion du mini-profil, accès rapides,
  // grille d'actions et repli des deux accordéons, mesurés par le fragment plateau de confort-mobile (et par les suites qui les comparent).
  [/dashboard-card-actions|dashboard-group-buttons|mobile-mini-profile-manage-btn|kr-action-grid|kr-quick-access-buttons|dashboard-cards-grid|building-section-content/, ['confort-mobile', 'cartes-pastilles', 'typographie-formes', 'plateau']]
];
// Modules du template (titre de section de premier niveau : « // ====… » puis « // TITRE ») -> zones des suites qui les vérifient.
// Un hunk du template est rattaché au module qui l'englobe : ses zones s'AJOUTENT à celles des mots-clés du hunk. Un module absent de
// cette table est transverse (utilitaires, thème, transformations DOM, en-tête...) : un hunk sans mot-clé y élargit au total.
export const SECTIONS = [
  [/^MENUS FORUM DYNAMIQUES/, ['menus-forums']],
  [/^(FORUM TOPICS|SOUS-FORUM|MOBILE FORUM (PERMANENT )?TOPICS)\b/, ['sous-forum']],
  // Fil d'Ariane commun (épopée 6, entrée 3) : construit par cette section, appelé par ForumHeader et ForumIndex, vérifié par forum-activite.
  [/^FIL D'ARIANE DU FORUM/, ['forum', 'sous-forum', 'forum-activite']],
  // Bouton « ••• » commun (épopée 6, entrée 5) : construit par cette section, appelé par Messages:V3 et les deux modules Kramail ; mesuré
  // aussi par les suites qui le comparent au bundle de base.
  [/^BOUTON « ••• » COMMUN/, ['forum', 'messages', 'kramail', 'forum-activite', 'typographie-formes', 'cartes-pastilles', 'palette-nation']],
  [/^MODULE : ForumHeader:/, ['forum', 'sous-forum', 'forum-activite']],
  [/^MODULE : ForumIndex:/, ['forum', 'sous-forum', 'forum-activite']],
  [/^MODULE : Kramail:/, ['forum', 'kramail']],
  // En-tête du sujet mobile (ForumThread:MobileBreadcrumb, épopée 6, entrée 4) : vérifié aussi par le fragment entete de forum-activite.
  [/^MODULE : ForumThread:/, ['forum', 'messages', 'forum-activite']],
  [/^MODULE : Messages:/, ['forum', 'messages']],
  [/^CX2 : CROIX DIRECTIONNELLE/, ['croix']],
  [/^TASK-1\.4 - MINI-PROFIL/, ['profil']],
  [/^IDENTITÉ DU PERSONNAGE/, ['plateau', 'profil']],
  [/^CYBERMONDE/, ['cybermonde']],
  // Modales Bootbox (socle de la modale d'ordre, chaîne mobile, viewport des ordres) : seules ces deux suites ouvrent une modale Bootbox.
  [/^MODAL PERSONNAGE MOBILE/, ['modale-ordre', 'parler']],
  // Correctifs mobiles du chargement (« FIX MOBILE : … » : défilement vers #flap) : ancres vérifiées par forum-activite.
  [/^FIX MOBILE : /, ['forum-activite']],
  // Cloche des notifications (ticket 8.2) : popup 900×800 sur ordinateur, vérifié par cloche-notifications.
  [/^CLOCHE DES NOTIFICATIONS/, ['cloche']]
];
// Blocs du cœur pur (section « CŒUR PUR » en tête du template : « // @kr-pure-begin <nom> » … « // @kr-pure-end ») -> zones des suites
// qui vérifient le module appelant. Un hunk entièrement dans des blocs connus est rattaché à leurs zones (en plus des mots-clés) ; un bloc
// absent de cette table (nouveau, renommé) ne rattache rien : le hunk retombe sur la règle des sections (CŒUR PUR transverse -> total).
export const PURE_BLOCKS = {
  pagination: ['sous-forum'],
  rechargement: BASCULE_ZONES,
  'menus-forums': ['menus-forums'],
  images: ['images'], // image-fallback, map-exclusions (et audit-map-images, même zone)
  destinataires: ['kramail'],
  identite: ['plateau', 'profil']
};
// Repère de classe ou d'id cité par une suite : le hunk qui le touche lance aussi les suites qui le citent (au plus MAX_CITING suites :
// au-delà, le repère est transverse, ex. mobile-mode, et les mots-clés en décident). S'ajoute aux zones, ne remplace jamais l'élargissement.
const MAX_CITING = 3;
const TOKEN_RE = /[A-Za-z][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+/g;

function gitLines(args) {
  try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }).split('\n'); } catch (_e) { return null; }
}
function readWorktree(f) {
  try { return fs.readFileSync(path.join(root, f), 'utf8'); } catch (_e) { return null; }
}

// Bloc du registre d'un texte de router.mjs : { suites, rest } (rest = le fichier sans le bloc), ou null si illisible.
export function registryOf(text) {
  if (typeof text !== 'string') { return null; }
  const lines = text.split('\n');
  const start = lines.findIndex(l => /^export const SUITES = \[/.test(l));
  if (start < 0) { return null; }
  const end = lines.findIndex((l, i) => i > start && /^\];\s*$/.test(l));
  if (end < 0) { return null; }
  const taken = new Set();
  const decls = [];
  for (let i = 0; i < start; i++) {
    if (!/^const [A-Z][A-Z0-9_]* = \[/.test(lines[i])) { continue; }
    let j = i;
    while (j < start && !/\];\s*$/.test(lines[j])) { j += 1; }
    for (let k = i; k <= j; k++) { taken.add(k); }
    decls.push(lines.slice(i, j + 1).join('\n'));
    i = j;
  }
  for (let k = start; k <= end; k++) { taken.add(k); }
  const code = decls.join('\n') + '\n' + lines.slice(start, end + 1).join('\n').replace(/^export /, '') + '\nSUITES;';
  try {
    const suites = JSON.parse(JSON.stringify(vm.runInNewContext(code, Object.create(null), { timeout: 1000 })));
    if (!Array.isArray(suites) || !suites.every(s => s && typeof s.name === 'string')) { return null; }
    return { suites, rest: lines.filter((_l, k) => !taken.has(k)).join('\n') };
  } catch (_e) { return null; }
}

// Unités à lancer pour un diff de registre : suite ajoutée ou dont les propriétés changent -> la suite ; fragment ajouté ou redécoupé -> ce
// fragment seul ; suite ou fragment retiré -> rien (plus rien à lancer).
export function registryUnits(before, after) {
  const units = []; const reasons = [];
  const old = new Map(before.map(s => [s.name, s]));
  const props = s => JSON.stringify(Object.keys(s).filter(k => k !== 'frags').sort().map(k => [k, s[k]]));
  for (const s of after) {
    const p = old.get(s.name);
    if (!p) { units.push(s.name); reasons.push(`registre : suite ajoutée ${s.name}`); continue; }
    if (props(p) !== props(s) || !p.frags !== !s.frags) { units.push(s.name); reasons.push(`registre : suite ${s.name} modifiée`); continue; }
    if (!s.frags) { continue; }
    const had = new Set(p.frags.map(f => f.join('+')));
    for (const f of s.frags.filter(x => !had.has(x.join('+')))) { units.push(`${s.name}#${f.join('+')}`); reasons.push(`registre : fragment ajouté ${s.name}#${f.join('+')}`); }
  }
  for (const p of before.filter(x => !after.some(s => s.name === x.name))) { reasons.push(`registre : suite retirée ${p.name} (rien à lancer)`); }
  return { units, reasons };
}

// Sections de premier niveau du template : [{ line (1-based), title }]. Un en-tête est une boîte « // ====… », une ou plusieurs lignes de
// commentaire (la première est le titre), « // ====… » ; la ligne de fermeture n'ouvre jamais une autre boîte.
export function templateSections(text) {
  const out = [];
  const lines = (text || '').split('\n');
  const bar = l => /^ {2}\/\/ ={5,}\s*$/.test(l);
  for (let i = 0; i < lines.length; i++) {
    if (!bar(lines[i])) { continue; }
    let j = i + 1;
    while (j < lines.length && j - i <= 12 && /^ {2}\/\/ /.test(lines[j]) && !bar(lines[j])) { j += 1; }
    if (j > i + 1 && j < lines.length && bar(lines[j])) { out.push({ line: i + 2, title: lines[i + 1].replace(/^ {2}\/\/ /, '').trim() }); i = j; }
  }
  return out;
}
// Blocs du cœur pur du template : [{ name, start, end }] (lignes 1-based, marqueurs compris). Un bloc non fermé n'est pas retenu.
export function pureBlocks(text) {
  const out = [];
  let open = null;
  (text || '').split('\n').forEach((l, i) => {
    const b = l.match(/^\s*\/\/ @kr-pure-begin ([\w-]+)\s*$/);
    if (b) { open = { name: b[1], start: i + 1 }; return; }
    if (open && /^\s*\/\/ @kr-pure-end\s*$/.test(l)) { out.push({ ...open, end: i + 1 }); open = null; }
  });
  return out;
}
// Sélecteur de la règle CSS qui englobe la ligne `at` (1-based) : texte des lignes qui précèdent l'accolade ouvrante non fermée.
function cssSelectorAt(lines, at) {
  let depth = 0;
  for (let i = Math.min(at, lines.length) - 1, n = 0; i >= 0 && n < 400; i--, n++) {
    const l = lines[i].replace(/\/\*.*?\*\//g, '');
    depth += (l.match(/\}/g) || []).length - (l.match(/\{/g) || []).length;
    if (depth < 0) {
      const sel = [l.split('{')[0]];
      for (let j = i - 1; j >= 0 && j > i - 30; j--) {
        const t = lines[j].trim();
        if (!t || /[;{}]$/.test(t) || /\*\/$/.test(t)) { break; }
        sel.unshift(t);
      }
      return sel.join(' ');
    }
  }
  return '';
}

// `git` est injectable (tests du routeur : hunks de référence sans dépôt) ; `readNew` donne le contenu « après » d'un fichier (défaut : arbre
// de travail ; le rejeu d'historique passe `git show <commit>:<f>`). Résultat : zones + unités explicites (id de fragment ou nom de suite).
export function zonesFromDiff(baseRef, git = gitLines, readNew = readWorktree) {
  const reasons = [];
  let files = [];
  let diffArgs;
  if (baseRef) { files = git(['diff', '--name-only', baseRef]); diffArgs = [baseRef]; } else {
    const work = git(['diff', '--name-only', 'HEAD']);
    const untracked = git(['ls-files', '--others', '--exclude-standard']);
    files = work === null ? null : [...work, ...(untracked || [])];
    diffArgs = ['HEAD'];
    if (files && files.filter(Boolean).length === 0) {
      const mb = ['origin/feature/next', 'origin/main'].map(r => git(['merge-base', 'HEAD', r])).find(l => l && l[0]);
      if (mb) { diffArgs = [mb[0].trim()]; files = git(['diff', '--name-only', diffArgs[0]]); reasons.push('arbre propre : comparaison avec ' + diffArgs[0].slice(0, 9)); }
    }
  }
  if (files === null) { return { zones: ZONES, units: [], reasons: ['git indisponible : total par prudence'], widened: true, unitTest: true }; }
  files = [...new Set(files.filter(Boolean))];
  const readOld = f => { const l = git(['show', `${diffArgs[0]}:${f}`]); return l === null ? null : l.join('\n'); };
  const zones = new Set();
  const units = new Set();
  let widened = false;
  let routerTest = false;
  let unitTest = false;
  const lint = [];
  const generated = [];
  const widen = why => { widened = true; reasons.push(why); };
  // Repères cités par chaque suite (lecture paresseuse, contenu « après »).
  let citing = null;
  const suiteTexts = () => SUITES.map(s => ({ s, text: readNew('tests/e2e/' + s.file) || '' }));
  const citedBy = () => {
    if (citing) { return citing; }
    citing = new Map();
    for (const { s, text } of suiteTexts()) { for (const t of new Set(text.match(TOKEN_RE) || [])) { if (!citing.has(t)) { citing.set(t, new Set()); } citing.get(t).add(s.name); } }
    return citing;
  };
  const addCited = text => {
    const toks = new Set();
    for (const m of text.matchAll(/[.#]([A-Za-z][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+)/g)) { toks.add(m[1]); }
    for (const m of text.matchAll(/['"`]([A-Za-z][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+)/g)) { toks.add(m[1]); }
    for (const t of toks) { const by = citedBy().get(t); if (by && by.size <= MAX_CITING) { by.forEach(n => { units.add(n); }); } }
  };
  for (const f of files) {
    if (f === 'kraland-theme.css' || f === 'kraland-userscript-template.js') {
      const diff = git(['diff', '-U0', ...diffArgs, '--', f]);
      const hunks = []; let cur = null;
      for (const l of diff || []) {
        const m = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
        if (m) { cur = { head: l, body: '', start: Number(m[1]), count: m[2] === undefined ? 1 : Number(m[2]) }; hunks.push(cur); } else if (cur && /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l)) { cur.body += l + '\n'; }
      }
      if (!hunks.length) { widen(f + ' : diff illisible'); continue; }
      // Template : tout module peut ajouter une mise en forme différée ; le garde-fou vérifie qu'elle est suivie par InitQueue (quelques secondes).
      // Il porte aussi le cœur pur (blocs @kr-pure-begin) : les tests unitaires (node --test, < 1 s) repassent à chaque modification.
      if (f.endsWith('.js')) { units.add(GARDE_INIT); unitTest = true; }
      const text = readNew(f);
      const lines = text === null ? [] : text.split('\n');
      const sections = f.endsWith('.js') ? templateSections(text) : [];
      const blocks = f.endsWith('.js') ? pureBlocks(text) : [];
      for (const h of hunks) {
        const where = h.head.split('@@')[1].trim();
        const own = h.head + '\n' + h.body;
        const hit = new Set(KEYWORDS.filter(([re]) => re.test(own)).flatMap(k => k[1]));
        // Module englobant : sections dont la portée couvre le hunk (celle d'avant son début et celles qui s'ouvrent dedans).
        let context = '';
        if (f.endsWith('.js')) {
          const last = h.start + Math.max(h.count, 1) - 1;
          const inScope = sections.filter((s, i) => s.line <= last && (i + 1 >= sections.length || sections[i + 1].line > h.start));
          const known = inScope.map(s => SECTIONS.find(([re]) => re.test(s.title)));
          // Cœur pur : hunk dont chaque ligne tombe dans un bloc connu -> zones de ces blocs (la section CŒUR PUR, transverse, n'élargit pas).
          const pure = blocks.filter(b => b.start <= last && b.end >= h.start && PURE_BLOCKS[b.name]);
          const inPure = pure.length > 0 && Array.from({ length: last - h.start + 1 }, (_x, k) => h.start + k).every(n => pure.some(b => b.start <= n && n <= b.end));
          if (inPure) { pure.forEach(b => PURE_BLOCKS[b.name].forEach(z => hit.add(z))); }
          if (!hit.size && !(inScope.length && known.every(Boolean))) {
            widen(`${f} ${where} : aucune zone reconnue (module transverse : ${inScope.map(s => s.title).join(' / ') || 'en-tête'})`); continue;
          }
          if (!inPure) { known.filter(Boolean).forEach(k => k[1].forEach(z => hit.add(z))); }
        } else {
          // Hunk de déclarations seules : la règle englobante dit quel composant est touché. Un mot-clé de bascule (mobile-mode...) n'y suffit
          // pas : c'est une portée, pas un composant.
          context = cssSelectorAt(lines, h.start);
          if (!hit.size) { KEYWORDS.filter(([re, z]) => z !== BASCULE_ZONES && re.test(context)).flatMap(k => k[1]).forEach(z => hit.add(z)); }
          if (!hit.size) { widen(`${f} ${where} : aucune zone reconnue (règle « ${context.slice(0, 60)} »)`); continue; }
        }
        hit.forEach(z => zones.add(z));
        addCited(own + '\n' + context);
      }
      continue;
    }
    const rule = FILE_RULES.find(([re]) => re.test(f));
    if (!rule) { widen(f + ' : fichier inconnu'); continue; }
    const z = rule[1];
    if (z === 'generated') { generated.push(f); continue; }
    if (z === 'all') { widen(f + ' : touche le lanceur ou les dépendances'); continue; }
    if (z === 'lint') { lint.push(f); continue; }
    if (z === 'router-test') { routerTest = true; continue; }
    if (z === 'unit') { unitTest = true; reasons.push(f + ' : tests unitaires du cœur pur (aucune suite e2e)'); continue; }
    if (z === 'registry') {
      routerTest = true;
      const before = registryOf(readOld(f)); const after = registryOf(readNew(f));
      if (!before || !after) { widen(f + ' : registre illisible'); continue; }
      const r = registryUnits(before.suites, after.suites);
      r.units.forEach(u => units.add(u)); reasons.push(...r.reasons);
      if (before.rest !== after.rest) { reasons.push(f + ' : logique du routeur modifiée -> test du routeur (aucune vérification e2e n\'en dépend)'); }
      continue;
    }
    if (z === 'package') {
      let before; let after;
      try { before = JSON.parse(readOld(f)); after = JSON.parse(readNew(f)); } catch (_e) { widen(f + ' : illisible'); continue; }
      const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(k => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
      const live = changed.filter(k => !PACKAGE_INERT_KEYS.includes(k) && k !== 'scripts');
      // Scripts : run.mjs lance les suites par `node`, sans npm. Un alias « node tests/e2e/<suite>.mjs » ajouté ou modifié lance cette suite ;
      // un script retiré ne lance rien ; tout autre script (build, lint, test:all...) élargit au total.
      if (changed.includes('scripts')) {
        const bs = before.scripts || {}; const as = after.scripts || {};
        for (const k of [...new Set([...Object.keys(bs), ...Object.keys(as)])].filter(x => bs[x] !== as[x])) {
          const m = String(as[k] ?? bs[k]).match(/^node tests\/e2e\/([\w-]+\.mjs)$/);
          const suites = m ? SUITES.filter(s => s.file === m[1]).map(s => s.name) : [];
          if (!m || (as[k] !== undefined && !suites.length)) { live.push('scripts.' + k); } else if (as[k] === undefined) { reasons.push(`${f} : alias ${k} retiré (rien à lancer)`); } else { suites.forEach(u => units.add(u)); reasons.push(`${f} : alias ${k} -> ${suites.join(', ')}`); }
        }
      }
      if (live.length) { widen(`${f} : ${live.join(', ')} modifié(s)`); } else { reasons.push(`${f} : ${changed.join(', ') || 'aucune clé'} sans effet sur les suites`); }
      continue;
    }
    if (z === 'fixture') {
      const base = path.posix.basename(f);
      const users = suiteTexts().filter(({ text }) => text.includes(base)).map(({ s }) => s.name);
      if (users.length) { users.forEach(u => units.add(u)); reasons.push(`${f} : fixture citée par ${users.join(', ')}`); } else { widen(f + ' : fixture citée par aucune suite'); }
      continue;
    }
    if (z === 'suite') {
      // Une suite ne vérifie qu'elle-même : on la lance, avec celles qui importent le fichier (map-exclusions importe audit-map-images).
      const name = f.slice('tests/e2e/'.length);
      const users = suiteTexts().filter(({ s, text }) => s.file === name || new RegExp(`(from|import\\()\\s*['"]\\./${name.replace(/\./g, '\\.')}['"]`).test(text)).map(({ s }) => s.name);
      if (!users.length) {
        if (readNew(f) === null) { reasons.push(f + ' : supprimé, aucune suite ne l\'utilise'); } else { widen(f + ' : script e2e hors registre'); }
        continue;
      }
      users.forEach(u => units.add(u));
      units.add(GARDE_CONFINEMENT);
      continue;
    }
    z.forEach(x => zones.add(x));
  }
  if (lint.length) { reasons.push('outillage, lint seul : ' + lint.join(', ')); }
  // Un diff qui ne touche QUE des fichiers générés (build, résolution de conflit) : la source ne dit rien, on ne peut pas conclure -> total.
  const isInert = f => FILE_RULES.some(([re, v]) => re.test(f) && ((Array.isArray(v) && v.length === 0) || v === 'lint'));
  if (generated.length && !files.some(f => !generated.includes(f) && !isInert(f))) { widen(generated.join(', ') + ' : seul le bundle généré a changé'); }
  if (widened) { return { zones: ZONES, units: [], reasons, widened: true, files, routerTest, unitTest: true }; }
  return { zones: [...zones], units: [...units], reasons, widened: false, files, routerTest, unitTest };
}

// Unités (de buildUnits) retenues par un résultat de zonesFromDiff : zone choisie, ou id/suite cité explicitement.
export function pickUnits(allUnits, r) {
  const zonesOf = new Map(SUITES.map(s => [s.name, s.zones]));
  return allUnits.filter(u => (zonesOf.get(u.suite) || []).some(z => r.zones.includes(z)) || r.units.includes(u.id) || r.units.includes(u.suite));
}
