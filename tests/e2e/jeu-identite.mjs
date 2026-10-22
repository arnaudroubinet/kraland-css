// Harmonisation UX, lot 1 : défauts de style et identité du personnage (décisions H1.1 à H1.6 et R1 de l'étude, EXPERIENCE.md).
// Fragment fuite-forum (H1.1) : le décor mobile des listes de forum (« → … sujets · ») reste réservé aux pages du forum. Sur Personnage,
// aucune cellule des panneaux Citoyenneté (deux cellules par ligne) et Maladies (une seule) ne reçoit ce contenu généré (« → », « sujets · »
// ou « messages » en pseudo-élément) et chacune de leurs lignes reste une ligne de tableau (display: table-row, pas une carte en grille). L'index du forum
// (/forum/rp) a quitté les cartes (ticket 6.1, présentation du sous-forum, vérifiée par forum-index.mjs) : ni conteneur de cartes ni décor des
// cartes (mesuré sur une ligne native : voir LIGNE_NATIVE), lignes en flex. La racine du forum (/forum, qui liste tous les forums) n'est pas une
// page « /forum/… » : elle porte page-forum-racine, pas page-forum (réservée aux modules de /forum/…), et son tableau natif, que le module des
// cartes ne remplace pas, reste en cartes (display: grid) avec le décor.
// Fragment regles-ok (H1.2) : la barre fixe « Envoyer » du bas d'écran appartient aux pages de rédaction (kramail, forum). Sur les Règles, le
// bouton « ok » du formulaire de recherche (button.btn-primary.pull-right) n'est pas fixé et reste à côté de son champ, et « Remonter en haut »
// n'y est pas relevé au-dessus d'une barre absente (bas : 8 px) ; sur la rédaction d'un Kramail, la barre « Envoyer » reste fixe et « Remonter en
// haut » reste relevé à 64 px (non-régression, retirés au lot 7 seulement).
// Fragment nom (H1.3, H1.4, R1) : le nom du personnage est lu sur le titre actif du panneau latéral du plateau (matériel et bâtiments aussi),
// mémorisé sous kr-character-name, puis repris sur Personnage et Employés, dont le titre natif n'est pas le nom. Mobile : le mini-profil
// l'affiche ; ordinateur : le titre du panneau le porte (le texte seul change, un élément enfant reste en place). Sans nom connu, le titre natif
// reste ; un stockage qui lève (navigation privée) ne casse pas la page (aucune exception, mini-profil et titre natifs). Un nom de 40 caractères
// (plateau avec avatar et vrai Bootstrap), mini-profil plié puis déplié à 375 et 700 px : le bouton de gestion reste entièrement dans l'écran, le
// document ne déborde pas horizontalement, le nom est tronqué par une ellipse à 375 px et tient en entier à 700 px.
// Fragment section-active (H1.5) : sur ordinateur, parmi les cinq accès rapides du panneau du joueur, celui de la page courante (Agir sur le
// plateau, Personnage sur Personnage) porte kr-quick-access-active : texte en demi-gras (600) et filet de 3 px de la couleur primaire sous le
// bouton (ombre interne), fond inchangé ; les quatre autres restent en 400, sans ombre ni classe d'activité. Mise en valeur réservée à
// l'ordinateur (seuil de 768 px) : à 767 px et en mobile, l'accès actif garde l'apparence des autres (l'onglet de section de la barre mobile
// porte l'état). Même règle de section active pour l'onglet mobile et l'accès rapide (ticket 2 du backlog) : plateau, sous-chemin /jouer/plateau/<pièce>,
// Personnage ; ni /jouer/plateaux ni une page hors jeu n'activent de section ; seul l'onglet actif porte aria-selected="true".
// Fragment icones (H1.6) : les cinq sections ont la même icône sur ordinateur (accès rapides) et sur mobile (onglets), dans l'ordre Agir,
// Matériel, Personnage, Bâtiments, Employés : fa-bolt, fa-suitcase, fa-user, fa-home, fa-users.
// Fragment hors-forum-js (ticket 1.6, accord du 2026-10-16) : le module JS des sujets permanents (enrichPermanentTopicsStats) n'agit que sur le forum
// et sa racine. Sur Cybermonde (/map, fixture reconstruite cybermonde-ville.html) et sur Personnage, à 320, 375, 768 et 1280 px : aucun bloc de
// compteurs, aucune ligne marquée, aucune cellule masquée ; l'index du forum en est exclu aussi (ticket 6.1 : compteurs libellés par le module de
// l'index) ; sur la racine du forum, les blocs restent (non-régression). La garde de page n'est exercée qu'à 320 et 375 px (mode mobile) ; à 768
// et 1280 px, le module sort déjà sur sa garde mobile. Sur Personnage (lignes de 2 cellules au plus), seul le marquage des lignes trahissait le module.
// Sur Cybermonde et Personnage, aucune cellule ne reçoit non plus le décor CSS du forum (« sujets », « messages », « → », ticket 4 du backlog).
// Pages = FIXTURES SYNTHÉTIQUES (tests/e2e/fixtures/jeu-perso.html, plateau-minimal.html, forum-index-rp.html, forum-racine.html, regles-recherche.html,
// cybermonde-ville.html reconstruite), aucune donnée réelle, et la fixture anonymisée de la rédaction d'un Kramail (kramail-nouveau.html,
// servie à son URL de kramail-redaction.mjs) ;
// vrai Bootstrap 3.3.7 (tests/e2e/vendor). Confinement réseau (lib/confinement.mjs) ; aucune navigation, un seul toucher (l'en-tête du mini-profil
// d'une fixture, pour le déplier).
//
// Usage : npm run build && node tests/e2e/jeu-identite.mjs   (ou : npm run test:zone -- plateau)
// Options : KR_SCRIPT (bundle testé), KR_FRAG = fuite-forum, regles-ok, nom, section-active, icones, hors-forum-js (vide = tout).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { frames, krReady, THEME_READY, waitState } from './lib/settle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const fixture = name => fs.readFileSync(path.join(here, 'fixtures', name), 'utf8');
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const BASE = 'http://www.kraland.org';
const PLATEAU = BASE + '/jouer/plateau';
const PERSO = BASE + '/jouer/perso';
const PNJ = BASE + '/jouer/pnj';
const INDEX_FORUM = BASE + '/forum/rp';
const RACINE_FORUM = BASE + '/forum'; // racine du forum : tableau d'index (fixture forum-racine.html, l'index synthétique d'avant le ticket 6.1), hors « /forum/… »
const REGLES = BASE + '/regles/base';
const CYBERMONDE = BASE + '/map';
const KRAMAIL_NOUVEAU = BASE + '/kramail/post/nouveau-4-2000'; // URL de la fixture dans kramail-redaction.mjs
const VARIANTES = ['kraland', 'empire-brun-dark'];
const MOBILE = { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true };
const BUREAU = { viewport: { width: 1280, height: 720 } };
const CLE_NOM = 'kr-character-name';
const NOM = 'Joueur'; // titre actif de plateau-minimal.html : sur le plateau, le titre du panneau est le nom du personnage
const NOM_LONG = 'Bartholomé-Alphonse de Rochefort-Lambert'; // 40 caractères
const NOM_DOLLAR = 'Jo$&hn $` $\' Ca$$h'; // les quatre motifs spéciaux d'une chaîne de remplacement de String.prototype.replace ($&, $`, $', $$)
// Largeurs mobiles (< 768 px) du mini-profil à nom long, et si le nom y est tronqué. Mesuré : sur 375 px, l'avatar (48 px, 64 px déplié) et le bouton de
// gestion laissent au nom 239 px (223 déplié) pour un contenu d'environ 300 px ; sur 700 px, ils lui en laissent plus de 540 et il tient en entier.
const CAS_NOM_LONG = [{ largeur: 375, hauteur: 667, tronque: true }, { largeur: 700, hauteur: 900, tronque: false }];
const PANNEAUX_PERSO = [{ titre: 'Citoyenneté', cellules: [2, 2, 2] }, { titre: 'Maladies', cellules: [1, 1] }]; // structure de jeu-perso.html
// Les cinq sections du jeu, dans l'ordre du menu (Agir, Matériel, Personnage, Bâtiments, Employés) : destinations des accès rapides et icônes
// communes aux accès rapides (ordinateur) et aux onglets de section (mobile).
const DESTINATIONS = ['/jouer/plateau', '/jouer/materiel', '/jouer/perso', '/jouer/bat', '/jouer/pnj'];
const ICONES = ['fa-bolt', 'fa-suitcase', 'fa-user', 'fa-home', 'fa-users'];
// Lignes natives de l'index et de la racine (1re ligne du corps de table de leur fixture). La peau remanie les lignes de la racine : le module des
// sujets permanents y insère un bloc de statistiques en 2e position, donc td:nth-child(2) n'y est plus une cellule de compteur. La ligne
// d'origine, remise telle quelle dans le tableau le temps d'une mesure, dit si le décor des cartes s'applique encore sur une page du forum.
const premiereLigne = nom => fixture(nom).match(/<tr>\s*<td>[\s\S]*?<\/tr>/)[0];
const LIGNE_NATIVE = premiereLigne('forum-index-rp.html');
const LIGNE_NATIVE_RACINE = premiereLigne('forum-racine.html');
const LIGNES_INDEX = (fixture('forum-index-rp.html').match(/<tr>\s*<td>/g) || []).length; // forums de la fixture de l'index (4)
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const browser = await launchBrowser();

// Mémoire du nom avant le script du thème : `nom` est posé sous la clé ; `panne` liste les méthodes de Storage qui lèvent pour CETTE clé seule
// (le thème lit et écrit ses propres clés comme avant). Sans `nom` ni `panne`, ne fait rien.
const PREPARER_MEMOIRE = ({ cle, nom, panne = [] }) => {
  if (nom) { localStorage.setItem(cle, nom); }
  panne.forEach(methode => {
    const native = window.Storage.prototype[methode];
    window.Storage.prototype[methode] = function (k, ...suite) {
      if (k === cle) { throw new window.DOMException('Stockage indisponible', 'SecurityError'); }
      return native.call(this, k, ...suite);
    };
  });
};

async function open(url, html, variante, device, memoire = {}) {
  const context = await browser.newContext(device);
  await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route(url, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/css/bootstrap1.min.css', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.css'), contentType: 'text/css' }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/js/bootstrap.min.js', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.js'), contentType: 'application/javascript' }));
  await context.route(BASE + '/lib/jquery-3.3.1/jquery-3.3.1.min.js', route => route.fulfill({ path: path.join(VENDOR, 'jquery.min.js'), contentType: 'application/javascript' }));
  await context.addInitScript(PREPARER_MEMOIRE, { cle: CLE_NOM, ...memoire });
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
  const erreurs = []; // exceptions non attrapées de la page, depuis son ouverture
  page.on('pageerror', e => erreurs.push(e.message));
  await page.goto(url, { waitUntil: 'load' });
  await krReady(page, { ready: THEME_READY, label: `${variante} ${url}` });
  return { context, page, erreurs };
}

// Socle de toutes les mesures : variante du thème, mode mobile et classes de page posées sur <body> par le script. Le contrôle de mise en place
// de chaque page (verifierSocle) en fixe les valeurs attendues, pour qu'un vert ou un rouge ne vienne jamais d'une page mesurée hors contexte.
const MESURE_SOCLE = () => ({
  variant: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')),
  mobile: document.body.classList.contains('mobile-mode'),
  pageForum: document.body.classList.contains('page-forum'),
  pageForumRacine: document.body.classList.contains('page-forum-racine'),
  pageKramailCompose: document.body.classList.contains('page-kramail-compose')
});
const mesurer = async (page, mesure, arg) => ({ ...(await page.evaluate(MESURE_SOCLE)), ...(await page.evaluate(mesure, arg)) });
// Une page, une mesure, un contexte neuf refermé aussitôt (aucun état partagé d'une page à l'autre) ; `erreurs` = exceptions de la page.
async function mesurerPage({ url, html, variante, device = MOBILE, memoire, mesure, arg }) {
  const { context, page, erreurs } = await open(url, html, variante, device, memoire);
  const m = await mesurer(page, mesure, arg);
  await context.close();
  return { ...m, erreurs };
}
function verifierSocle(m, variante, { mobile = true, pageForum = false, pageForumRacine = false, pageKramailCompose = false } = {}) {
  assert.equal(m.variant, 'kr-theme-variant-' + variante);
  assert.equal(m.mobile, mobile, mobile ? 'body sans mobile-mode' : 'body marqué mobile-mode');
  assert.equal(m.pageForum, pageForum, pageForum ? 'body sans page-forum' : 'body marqué page-forum');
  assert.equal(m.pageForumRacine, pageForumRacine, pageForumRacine ? 'body sans page-forum-racine' : 'body marqué page-forum-racine');
  assert.equal(m.pageKramailCompose, pageKramailCompose, pageKramailCompose ? 'body sans page-kramail-compose' : 'body marqué page-kramail-compose');
}

// Mesures dans la page. fuites = contenus générés (::before, ::after) d'une cellule d'un panneau de Personnage (Citoyenneté : deux cellules
// par ligne ; Maladies : une seule, où la même cellule est première et dernière) qui portent le décor du forum. affichages = affichage calculé de
// chaque ligne de ces panneaux : la mise en page d'une ligne de tableau (table-row) et non celle d'une carte du forum (grid).
const MESURE_PERSO = () => {
  const panneaux = [...document.querySelectorAll('#col-right .panel-default')].map(p => ({
    titre: p.querySelector('.panel-title').textContent.trim(),
    lignes: [...p.querySelectorAll('.table > tbody > tr')]
  }));
  const fuites = [];
  panneaux.forEach(p => p.lignes.forEach((tr, r) => [...tr.cells].forEach((td, c) => ['::before', '::after'].forEach(pseudo => {
    const contenu = getComputedStyle(td, pseudo).content;
    if (/→|sujets|messages/.test(contenu)) { fuites.push(`${p.titre} ligne ${r + 1} cellule ${c + 1} ${pseudo} = ${contenu}`); }
  }))));
  return {
    panneaux: panneaux.map(p => ({ titre: p.titre, cellules: p.lignes.map(tr => tr.cells.length) })),
    affichages: panneaux.map(p => ({ titre: p.titre, lignes: p.lignes.map(tr => getComputedStyle(tr).display) })),
    fuites
  };
};
// Index des forums : affichage calculé de la première ligne visible du tableau (null s'il est masqué), nombre de conteneurs de cartes, classe de
// page de l'index (html.kr-page-forum-index) et décor mesuré sur la ligne native `ligneNative` remise le temps de la mesure.
const MESURE_INDEX = (ligneNative) => {
  const tbody = document.querySelector('#col-right .panel-default .table > tbody');
  const premiere = [...tbody.rows].find(tr => tr.getClientRects().length > 0);
  const affichage = premiere ? getComputedStyle(premiere).display : null;
  tbody.insertAdjacentHTML('beforeend', ligneNative);
  const sonde = tbody.lastElementChild;
  const decor = {
    sujets: getComputedStyle(sonde.cells[1], '::after').content,
    fleche: getComputedStyle(sonde.cells[sonde.cells.length - 1], '::before').content
  };
  sonde.remove();
  return {
    lignes: tbody.rows.length,
    affichage,
    cartes: document.querySelectorAll('.forums-cards-container').length,
    pageIndex: document.documentElement.classList.contains('kr-page-forum-index'),
    decor
  };
};
// Bouton de validation (button.btn-primary.pull-right) du formulaire `formulaire` : nombre, libellé et position calculée (« fixed » = barre du
// bas d'écran de la rédaction), avec le nombre de champs input.form-control du même formulaire (le champ auprès duquel il doit rester) et le
// bas calculé du bouton « Remonter en haut » (8 px par défaut en mobile ; relevé à 64 px au-dessus de la barre fixe de la rédaction).
const MESURE_BOUTON = formulaire => {
  const form = document.querySelector(formulaire);
  const boutons = form ? [...form.querySelectorAll('button.btn-primary.pull-right')] : [];
  const remonter = document.querySelector('.kraland-back-to-top');
  const pied = document.querySelector('footer.navbar-inverse');
  // Réserve de la barre fixe : marge intérieure basse d'un .form-group sonde posé en dernier dans le formulaire le temps de la mesure
  let reserve = null;
  if (form) {
    form.insertAdjacentHTML('beforeend', '<div class="form-group kr-sonde"></div>');
    const sonde = form.querySelector('.kr-sonde');
    reserve = getComputedStyle(sonde).paddingBottom;
    sonde.remove();
  }
  return {
    pied: pied ? getComputedStyle(pied).position : null,
    reserve,
    champs: form ? form.querySelectorAll('input.form-control').length : 0,
    boutons: boutons.length,
    libelle: boutons.length ? boutons[0].textContent.trim() : null,
    position: boutons.length ? getComputedStyle(boutons[0]).position : null,
    remonter: remonter ? getComputedStyle(remonter).bottom : null
  };
};

// Nom du personnage tel que la page l'affiche : texte du titre actif du panneau latéral et nombre de ses éléments enfants, nom du mini-profil
// mobile (null s'il n'existe pas) et valeur mémorisée sous la clé `cle` (null si absente, « indisponible » si la lecture lève).
const MESURE_NOM = cle => {
  const titre = document.querySelector('#col-left .list-group-item.active');
  const profil = document.querySelector('.mobile-mini-profile-name');
  let memoire;
  try { memoire = localStorage.getItem(cle); } catch (_e) { memoire = 'indisponible'; }
  return {
    titre: titre ? titre.textContent.trim() : null,
    brut: titre ? Array.from(titre.childNodes).filter(nd => nd.nodeType === Node.TEXT_NODE).map(nd => nd.data).join('|') : null,
    enfants: titre ? titre.children.length : 0,
    profil: profil ? profil.textContent.trim() : null,
    memoire
  };
};

// Mini-profil mobile et nom long : état (plié / déplié), avatar, bouton de gestion (⚙️) en coordonnées de la fenêtre, nom (texte, largeur du contenu
// `defile` et de la boîte `boite`, text-overflow calculé), taille de la fenêtre et largeur de défilement du document (débordement horizontal).
const MESURE_MINI_PROFIL = () => {
  const profil = document.querySelector('.mobile-mini-profile');
  const nom = document.querySelector('.mobile-mini-profile-name');
  const gerer = document.querySelector('.mobile-mini-profile-manage-btn');
  if (!profil || !nom || !gerer) { return { existe: false }; }
  const boite = gerer.getBoundingClientRect();
  return {
    existe: true,
    etat: profil.classList.contains('expanded') ? 'déplié' : 'plié',
    avatar: profil.querySelector('.avatar') !== null,
    fenetre: { largeur: window.innerWidth, hauteur: window.innerHeight },
    defilement: document.documentElement.scrollWidth,
    gerer: { gauche: boite.left, droite: boite.right, haut: boite.top, bas: boite.bottom },
    nom: { texte: nom.textContent, defile: nom.scrollWidth, boite: nom.clientWidth, debordement: getComputedStyle(nom).textOverflow }
  };
};

// Sections du jeu telles que la page les montre. acces = accès rapides du panneau du joueur (ordinateur) : destination, classe d'activité,
// icône (classes fa-*), graisse, ombre et fond calculés. onglets = icônes (classes fa-*) des onglets de section (mobile). primaire = couleur
// primaire du thème résolue (var(--kr-primary) lue sur une sonde), à retrouver dans l'ombre du filet de la section active.
const MESURE_SECTIONS = () => {
  const sonde = document.createElement('i');
  sonde.style.color = 'var(--kr-primary)';
  document.body.appendChild(sonde);
  const primaire = getComputedStyle(sonde).color;
  sonde.remove();
  const classesIcone = i => [...i.classList].filter(c => c.startsWith('fa-')).join(' ');
  return {
    primaire,
    acces: [...document.querySelectorAll('.kr-quick-access-buttons > a')].map(a => {
      const style = getComputedStyle(a);
      return {
        href: a.getAttribute('href'),
        actif: a.classList.contains('kr-quick-access-active'),
        icone: [...a.querySelectorAll('i')].map(classesIcone).join(' '),
        graisse: style.fontWeight,
        ombre: style.boxShadow,
        fond: style.backgroundColor
      };
    }),
    onglets: [...document.querySelectorAll('.mobile-tab-bar .mobile-tab-icon')].map(classesIcone),
    // État des onglets de section mobiles, dans l'ordre : li.active et aria-selected du lien
    ongletsEtat: [...document.querySelectorAll('.mobile-tab-bar > li')].map(li => ({
      actif: li.classList.contains('active'),
      aria: li.querySelector('a') ? li.querySelector('a').getAttribute('aria-selected') : null
    }))
  };
};

async function scenario(variante) {
  const perso = await mesurerPage({ url: PERSO, html: fixture('jeu-perso.html'), variante, mesure: MESURE_PERSO });
  const index = await mesurerPage({ url: INDEX_FORUM, html: fixture('forum-index-rp.html'), variante, mesure: MESURE_INDEX, arg: LIGNE_NATIVE });
  const racine = await mesurerPage({ url: RACINE_FORUM, html: fixture('forum-racine.html'), variante, mesure: MESURE_INDEX, arg: LIGNE_NATIVE_RACINE });
  return { perso, index, racine };
}

async function scenarioRegles(variante) {
  const regles = await mesurerPage({ url: REGLES, html: fixture('regles-recherche.html'), variante, mesure: MESURE_BOUTON, arg: 'form[name="recherche"]' });
  const kramail = await mesurerPage({ url: KRAMAIL_NOUVEAU, html: fixture('kramail-nouveau.html'), variante, mesure: MESURE_BOUTON, arg: 'form[name="post_msg"]' });
  return { regles, kramail };
}

// Mini-profil de `html` dans une fenêtre mobile `largeur` × `hauteur`, plié puis déplié par un toucher sur son en-tête. Chaque état est mesuré quand
// le profil a la classe voulue et que ses transitions (avatar, hauteur) sont finies : la largeur du nom dépend de celle de l'avatar.
async function scenarioNomLong({ largeur, hauteur, html }) {
  const device = { viewport: { width: largeur, height: hauteur }, isMobile: true, hasTouch: true };
  const { context, page } = await open(PLATEAU, html, VARIANTES[0], device);
  const stabilise = async classe => {
    await waitState(page, c => {
      const profil = document.querySelector('.mobile-mini-profile');
      return profil !== null && profil.classList.contains(c) && profil.getAnimations({ subtree: true }).every(a => a.playState !== 'running');
    }, classe, { maxMs: 3000 });
    await frames(page, 1);
  };
  await stabilise('collapsed');
  const plie = await mesurer(page, MESURE_MINI_PROFIL);
  await page.tap('.mobile-mini-profile-header');
  await stabilise('expanded');
  const deplie = await mesurer(page, MESURE_MINI_PROFIL);
  await context.close();
  return { plie, deplie };
}

if (on('fuite-forum')) {
  console.log('Fuite du décor des listes de forum (375 × 667, tactile), variantes ' + VARIANTES.join(' et '));
  const res = await mapLimit(VARIANTES, scenario);
  VARIANTES.forEach((v, i) => {
    const { perso, index, racine } = res[i];
    check(`[${v}] perso : thème appliqué, mode mobile actif, page hors forum, panneaux Citoyenneté (2 cellules par ligne) et Maladies (1 par ligne)`, () => {
      verifierSocle(perso, v);
      assert.deepEqual(perso.panneaux, PANNEAUX_PERSO, 'panneaux mesurés : ' + JSON.stringify(perso.panneaux));
    });
    check(`[${v}] perso : aucune cellule de Citoyenneté ne reçoit le décor du forum (ni celle de Maladies, à une seule cellule par ligne)`, () => {
      assert.equal(perso.fuites.length, 0, 'décor du forum sur Personnage : ' + perso.fuites.join(' ; '));
    });
    check(`[${v}] perso : chaque ligne de Citoyenneté et de Maladies garde sa mise en page de tableau (display: table-row), comme sur ordinateur`, () => {
      const attendu = PANNEAUX_PERSO.map(p => ({ titre: p.titre, lignes: p.cellules.map(() => 'table-row') }));
      assert.deepEqual(perso.affichages, attendu, 'affichage des lignes : ' + JSON.stringify(perso.affichages));
    });
    check(`[${v}] index du forum : thème appliqué, mode mobile actif, page marquée page-forum et html.kr-page-forum-index, ${LIGNES_INDEX} lignes`, () => {
      verifierSocle(index, v, { pageForum: true });
      assert.ok(index.pageIndex, 'html sans kr-page-forum-index');
      assert.equal(index.lignes, LIGNES_INDEX);
    });
    check(`[${v}] index du forum : plus de cartes (aucun conteneur), première ligne visible en ligne du sous-forum (display: flex, ticket 6.1)`, () => {
      assert.equal(index.cartes, 0, 'conteneurs .forums-cards-container : ' + index.cartes);
      assert.equal(index.affichage, 'flex', 'première ligne visible du tableau : ' + index.affichage);
    });
    check(`[${v}] index du forum : le décor des cartes ne s'applique plus (ni « sujets » après la 2e cellule ni « → » avant la dernière, sur une ligne native)`, () => {
      assert.ok(!index.decor.sujets.includes('sujets'), 'td:nth-child(2)::after = ' + index.decor.sujets);
      assert.ok(!index.decor.fleche.includes('→'), 'td:last-child::before = ' + index.decor.fleche);
    });
    check(`[${v}] racine du forum : thème appliqué, mode mobile actif, page marquée page-forum-racine (et non page-forum), tableau natif affiché sans carte, 2 lignes`, () => {
      verifierSocle(racine, v, { pageForumRacine: true });
      assert.equal(racine.cartes, 0, 'conteneurs de cartes à la racine : ' + racine.cartes);
      assert.equal(racine.lignes, 2);
    });
    check(`[${v}] racine du forum : la première ligne visible du tableau des forums est une carte (display: grid)`, () => {
      assert.equal(racine.affichage, 'grid', 'affichage de la 1re ligne visible : ' + racine.affichage);
    });
    check(`[${v}] racine du forum : le décor reste (« sujets » après la 2e cellule, « → » avant la dernière, sur une ligne native)`, () => {
      assert.ok(racine.decor.sujets.includes('sujets'), 'td:nth-child(2)::after = ' + racine.decor.sujets);
      assert.ok(racine.decor.fleche.includes('→'), 'td:last-child::before = ' + racine.decor.fleche);
    });
  });
}

if (on('regles-ok')) {
  console.log('Barre fixe « Envoyer » et relèvement de « Remonter en haut » réservés aux pages de rédaction (375 × 667, tactile), variantes ' + VARIANTES.join(' et '));
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
    check(`[${v}] règles : « Remonter en haut » n'est pas relevé (bas : 8 px), aucune barre fixe à dégager`, () => {
      assert.equal(regles.remonter, '8px', 'bouton « Remonter en haut » : bas = ' + regles.remonter);
    });
    check(`[${v}] règles : ni pied de page sorti de sa position (footer.navbar-inverse), ni réserve de 60 px sous le dernier groupe du formulaire`, () => {
      assert.notEqual(regles.pied, null, 'footer.navbar-inverse absent de la fixture');
      assert.notEqual(regles.pied, 'relative', 'pied de page remis dans le flux pour une barre absente');
      assert.equal(regles.reserve, '0px', 'réserve sous le dernier .form-group : ' + regles.reserve);
    });
    check(`[${v}] rédaction kramail : thème appliqué, mode mobile actif, page marquée page-kramail-compose, un bouton « Envoyer »`, () => {
      verifierSocle(kramail, v, { pageKramailCompose: true });
      assert.equal(kramail.boutons, 1, 'boutons button.btn-primary.pull-right du formulaire de rédaction : ' + kramail.boutons);
      assert.equal(kramail.libelle, 'Envoyer');
    });
    check(`[${v}] rédaction kramail : la barre « Envoyer » reste fixe`, () => {
      assert.equal(kramail.position, 'fixed', 'barre « Envoyer » : position = ' + kramail.position);
    });
    check(`[${v}] rédaction kramail : le pied de page revient dans le flux et le dernier groupe garde une réserve sous la barre`, () => {
      assert.equal(kramail.pied, 'relative', 'footer.navbar-inverse : position = ' + kramail.pied);
      assert.notEqual(kramail.reserve, '0px', 'réserve sous le dernier .form-group : ' + kramail.reserve);
    });
    check(`[${v}] rédaction kramail : « Remonter en haut » reste relevé au-dessus de la barre fixe (bas : 64 px)`, () => {
      assert.equal(kramail.remonter, '64px', 'bouton « Remonter en haut » : bas = ' + kramail.remonter);
    });
  });
}

if (on('nom')) {
  const V = VARIANTES[0]; // le nom ne dépend pas du thème : une seule variante
  const plateauHtml = fixture('plateau-minimal.html');
  const persoHtml = fixture('jeu-perso.html');
  const titrePlateau = `<span class="list-group-item active">${NOM}</span>`;
  const titrePerso = '<span class="list-group-item active">Personnage</span>';
  const repli = '<span class="pull-right" id="slide-submenu"><i class="fa fa-times"></i></span>'; // bouton de repli des colonnes du site (icône)
  const repliTexte = '<span class="pull-right" id="slide-submenu">×</span>'; // le même avec un « × » écrit : le nom lu ne prend que le nœud texte du titre
  const employesHtml = persoHtml.replace(titrePerso, '<span class="list-group-item active">Employés</span>');
  const enfantHtml = persoHtml.replace(titrePerso, `<span class="list-group-item active">Personnage${repli}</span>`);
  const plateauRepliHtml = plateauHtml.replace(titrePlateau, `<span class="list-group-item active">${NOM}${repliTexte}</span>`);
  // Titre natif tel que le site l'écrit : libellé entouré de sauts de ligne et de tabulations, puis le bouton de repli (colonne native du forum RP)
  const blancsHtml = persoHtml.replace(titrePerso, `<span class="list-group-item active">\n\t\t\tPersonnage\n\t\t\t${repli}</span>`);
  const scenarios = [
    { id: 'plateau', url: PLATEAU, html: plateauHtml },
    { id: 'plateauRepli', url: PLATEAU, html: plateauRepliHtml },
    { id: 'plateauAncien', url: PLATEAU, html: plateauHtml, memoire: { nom: 'Ancien' } },
    { id: 'plateauSansEcriture', url: PLATEAU, html: plateauHtml, memoire: { nom: 'Ancien', panne: ['setItem'] } },
    { id: 'persoMemoire', url: PERSO, html: persoHtml, memoire: { nom: NOM } },
    { id: 'persoVide', url: PERSO, html: persoHtml },
    { id: 'persoPanne', url: PERSO, html: persoHtml, memoire: { panne: ['getItem', 'setItem'] } },
    { id: 'employes', url: PNJ, html: employesHtml, memoire: { nom: NOM } },
    { id: 'bureau', url: PERSO, html: persoHtml, device: BUREAU, memoire: { nom: NOM } },
    { id: 'bureauEnfant', url: PERSO, html: enfantHtml, device: BUREAU, memoire: { nom: NOM } },
    { id: 'regles', url: REGLES, html: fixture('regles-recherche.html'), device: BUREAU, memoire: { nom: NOM } },
    { id: 'bureauDollar', url: PERSO, html: blancsHtml, device: BUREAU, memoire: { nom: NOM_DOLLAR } },
    { id: 'persoDollar', url: PERSO, html: persoHtml, memoire: { nom: NOM_DOLLAR } }
  ];
  console.log(`Nom du personnage : mini-profil mobile (375 × 667, tactile) et titre du panneau (1280 × 720), variante ${V}`);
  const mesures = await mapLimit(scenarios, s => mesurerPage({ ...s, variante: V, mesure: MESURE_NOM, arg: CLE_NOM }));
  const { plateau, plateauRepli, plateauAncien, plateauSansEcriture, persoMemoire, persoVide, persoPanne, employes, bureau, bureauEnfant, regles, bureauDollar, persoDollar } =
    Object.fromEntries(scenarios.map((s, i) => [s.id, mesures[i]]));
  check(`[${V}] fixtures : le titre actif est « ${NOM} » sur le plateau et « Personnage » sur Personnage (les variantes Employés, enfant et bouton de repli sont construites dessus)`, () => {
    assert.ok(plateauHtml.includes(titrePlateau), `titre actif de plateau-minimal.html : ${titrePlateau} introuvable`);
    assert.ok(persoHtml.includes(titrePerso), `titre actif de jeu-perso.html : ${titrePerso} introuvable`);
  });
  check(`[${V}] plateau mobile : le mini-profil affiche le nom lu`, () => {
    verifierSocle(plateau, V);
    assert.equal(plateau.profil, NOM, `nom du mini-profil : ${plateau.profil}`);
    assert.equal(plateau.memoire, NOM, `nom mémorisé sous ${CLE_NOM} : ${plateau.memoire}`);
  });
  check(`[${V}] plateau mobile : le nom lu ignore le texte du bouton de repli`, () => {
    verifierSocle(plateauRepli, V);
    assert.equal(plateauRepli.profil, NOM, `nom du mini-profil : ${plateauRepli.profil}`);
    assert.equal(plateauRepli.memoire, NOM, `nom mémorisé sous ${CLE_NOM} : ${plateauRepli.memoire}`);
  });
  check(`[${V}] plateau mobile : un autre nom en mémoire est remplacé par le nom lu`, () => {
    verifierSocle(plateauAncien, V);
    assert.equal(plateauAncien.profil, NOM, `nom du mini-profil : ${plateauAncien.profil}`);
    assert.equal(plateauAncien.memoire, NOM, `nom mémorisé sous ${CLE_NOM} : ${plateauAncien.memoire}`);
  });
  check(`[${V}] perso mobile : le mini-profil reprend le nom mémorisé`, () => {
    verifierSocle(persoMemoire, V);
    assert.equal(persoMemoire.profil, NOM, `nom du mini-profil : ${persoMemoire.profil}`);
  });
  check(`[${V}] perso ordinateur : le titre du panneau est le nom`, () => {
    verifierSocle(bureau, V, { mobile: false });
    assert.equal(bureau.titre, NOM, `titre du panneau : ${bureau.titre}`);
  });
  check(`[${V}] perso ordinateur : le titre garde son élément enfant`, () => {
    verifierSocle(bureauEnfant, V, { mobile: false });
    assert.equal(bureauEnfant.titre, NOM, `titre du panneau : ${bureauEnfant.titre}`);
    assert.equal(bureauEnfant.enfants, 1, `éléments enfants du titre : ${bureauEnfant.enfants}`);
  });
  check(`[${V}] employés mobile : le titre du panneau et le mini-profil sont le nom mémorisé`, () => {
    verifierSocle(employes, V);
    assert.equal(employes.titre, NOM, `titre du panneau : ${employes.titre}`);
    assert.equal(employes.profil, NOM, `nom du mini-profil : ${employes.profil}`);
  });
  check(`[${V}] règles ordinateur : le titre natif reste malgré un nom mémorisé`, () => {
    verifierSocle(regles, V, { mobile: false });
    assert.equal(regles.titre, 'Règles', `titre du panneau : ${regles.titre}`);
    assert.equal(regles.memoire, NOM, `nom mémorisé sous ${CLE_NOM} : ${regles.memoire}`);
  });
  check(`[${V}] perso sans mémoire : titre natif`, () => {
    verifierSocle(persoVide, V);
    assert.equal(persoVide.titre, 'Personnage', `titre du panneau : ${persoVide.titre}`);
    assert.equal(persoVide.profil, 'Personnage', `nom du mini-profil : ${persoVide.profil}`);
    assert.equal(persoVide.memoire, null, `le titre natif n'est pas un nom à mémoriser : ${persoVide.memoire}`);
  });
  check(`[${V}] nom contenant « $& », « $\` », « $' » et « $$ » (ticket 3 du backlog) : le titre du panneau et le mini-profil l'affichent tel quel ; les blancs autour du libellé et l'élément enfant du titre restent`, () => {
    verifierSocle(bureauDollar, V, { mobile: false });
    assert.equal(bureauDollar.titre, NOM_DOLLAR, `titre du panneau : ${bureauDollar.titre}`);
    assert.equal(bureauDollar.enfants, 1, `éléments enfants du titre : ${bureauDollar.enfants}`);
    assert.equal(bureauDollar.brut, `\n\t\t\t${NOM_DOLLAR}\n\t\t\t`, `nœud texte du titre (blancs autour du nom) : ${JSON.stringify(bureauDollar.brut)}`);
    verifierSocle(persoDollar, V);
    assert.equal(persoDollar.profil, NOM_DOLLAR, `nom du mini-profil : ${persoDollar.profil}`);
  });
  check(`[${V}] stockage indisponible : la page tient`, () => {
    verifierSocle(persoPanne, V);
    assert.equal(persoPanne.memoire, 'indisponible', 'panne du stockage non simulée');
    assert.equal(persoPanne.titre, 'Personnage', `titre du panneau : ${persoPanne.titre}`);
    assert.equal(persoPanne.profil, 'Personnage', `nom du mini-profil : ${persoPanne.profil}`);
    assert.deepEqual(persoPanne.erreurs, [], `exceptions de la page : ${persoPanne.erreurs.join(' ; ')}`);
  });
  check(`[${V}] plateau mobile, écriture impossible : le nom lu l'emporte sur la mémoire`, () => {
    verifierSocle(plateauSansEcriture, V);
    assert.equal(plateauSansEcriture.memoire, 'Ancien', 'panne de l\'écriture non simulée');
    assert.equal(plateauSansEcriture.profil, NOM, `nom du mini-profil : ${plateauSansEcriture.profil}`);
    assert.deepEqual(plateauSansEcriture.erreurs, [], `exceptions de la page : ${plateauSansEcriture.erreurs.join(' ; ')}`);
  });

  // Nom de 40 caractères : le mini-profil porte un texte variable (plus le « Personnage » fixe d'avant). Variante du plateau avec le CSS de Bootstrap
  // (cascade réelle : le bouton de gestion mesure 44 px, pas 60) et un avatar (image data:, aucun réseau), qui comme sur le site réduit la place du nom.
  const avatar = '<a class="btn alert100" href="#"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" alt=""></a>';
  const plateauLongHtml = plateauHtml
    .replace(titrePlateau, `<span class="list-group-item active">${NOM_LONG}</span>`)
    .replace('</head>', '  <link rel="stylesheet" href="/lib/bootstrap-3.3.7/css/bootstrap1.min.css">\n</head>')
    .replace('<textarea id="champ-saisie"', avatar + '<textarea id="champ-saisie"');
  console.log(`Nom de ${NOM_LONG.length} caractères : mini-profil plié et déplié (${CAS_NOM_LONG.map(c => `${c.largeur} × ${c.hauteur}`).join(' et ')}, tactile), variante ${V}`);
  const mesuresLong = await mapLimit(CAS_NOM_LONG, c => scenarioNomLong({ largeur: c.largeur, hauteur: c.hauteur, html: plateauLongHtml }));
  check(`[${V}] fixtures : le titre actif du plateau devient un nom de 40 caractères, avec le CSS de Bootstrap et un avatar`, () => {
    assert.equal(NOM_LONG.length, 40, `longueur du nom : ${NOM_LONG.length}`);
    assert.ok(plateauLongHtml.includes(`<span class="list-group-item active">${NOM_LONG}</span>`), 'titre actif à nom long introuvable');
    assert.ok(plateauLongHtml.includes('bootstrap1.min.css'), 'CSS de Bootstrap introuvable');
    assert.ok(plateauLongHtml.includes('<img src="data:image/gif'), 'avatar introuvable');
  });
  CAS_NOM_LONG.forEach(({ largeur, tronque }, i) => {
    [['plié', mesuresLong[i].plie], ['déplié', mesuresLong[i].deplie]].forEach(([etat, m]) => {
      const etiquette = `[${V}] nom long, ${largeur} px, mini-profil ${etat}`;
      check(`${etiquette} : le bouton de gestion reste entièrement dans l'écran et le document ne déborde pas horizontalement`, () => {
        verifierSocle(m, V);
        assert.ok(m.existe, 'mini-profil, nom ou bouton de gestion introuvable');
        assert.equal(m.etat, etat, `état du mini-profil : ${m.etat}`);
        assert.equal(m.nom.texte, NOM_LONG, `nom du mini-profil : ${m.nom.texte}`);
        assert.ok(m.avatar, 'avatar absent du mini-profil');
        // Un contenu qui déborde élargit la fenêtre d'un navigateur mobile (innerWidth passe de 375 à plus) : les bornes sont celles de la largeur voulue
        const g = m.gerer;
        assert.ok(g.gauche >= 0 && g.droite <= largeur && g.haut >= 0 && g.bas <= m.fenetre.hauteur,
          `bouton de gestion ${JSON.stringify(g)} hors de la fenêtre ${largeur} × ${m.fenetre.hauteur}`);
        assert.ok(m.defilement <= largeur, `largeur de défilement du document : ${m.defilement} pour une fenêtre de ${largeur}`);
        assert.equal(m.fenetre.largeur, largeur, `fenêtre élargie à ${m.fenetre.largeur} px par un débordement horizontal`);
      });
      check(`${etiquette} : ${tronque ? 'le nom est tronqué par une ellipse (contenu plus large que sa boîte)' : 'le nom tient en entier (la place suffit, ellipse prête)'}`, () => {
        assert.equal(m.nom.debordement, 'ellipsis', `text-overflow du nom : ${m.nom.debordement}`);
        if (tronque) {
          assert.ok(m.nom.defile > m.nom.boite, `contenu du nom : ${m.nom.defile} px, boîte : ${m.nom.boite} px`);
        } else {
          assert.ok(m.nom.defile <= m.nom.boite, `contenu du nom : ${m.nom.defile} px, boîte : ${m.nom.boite} px`);
        }
      });
    });
  });
}

if (on('section-active')) {
  const pages = [
    { id: 'plateau', url: PLATEAU, html: fixture('plateau-minimal.html'), actif: '/jouer/plateau', libelle: 'Agir' },
    { id: 'perso', url: PERSO, html: fixture('jeu-perso.html'), actif: '/jouer/perso', libelle: 'Personnage' }
  ];
  const lots = VARIANTES.flatMap(variante => pages.map(p => ({ ...p, variante })));
  console.log('Section active des accès rapides (1280 × 720), variantes ' + VARIANTES.join(' et ') + ' ; règle commune avec l\'onglet mobile (375 et 1280 px), variante ' + VARIANTES[0]);
  const mesures = await mapLimit(lots, l => mesurerPage({ url: l.url, html: l.html, variante: l.variante, device: BUREAU, mesure: MESURE_SECTIONS }));
  lots.forEach((l, i) => {
    const m = mesures[i];
    const etiquette = `[${l.variante}] ${l.id} ordinateur`;
    check(`${etiquette} : thème appliqué, cinq accès rapides dans l'ordre, seul « ${l.libelle} » porte kr-quick-access-active`, () => {
      verifierSocle(m, l.variante, { mobile: false });
      assert.deepEqual(m.acces.map(a => a.href), DESTINATIONS, 'destinations mesurées : ' + JSON.stringify(m.acces.map(a => a.href)));
      const actifs = m.acces.filter(a => a.actif).map(a => a.href);
      assert.deepEqual(actifs, [l.actif], 'accès marqués actifs : ' + JSON.stringify(actifs));
    });
    check(`${etiquette} : l'accès actif est en demi-gras (600) avec un filet de 3 px de la couleur primaire sous le bouton`, () => {
      const actif = m.acces.find(a => a.actif);
      assert.ok(actif, 'aucun accès actif');
      assert.equal(actif.graisse, '600', 'graisse de l\'accès actif : ' + actif.graisse);
      assert.ok(actif.ombre.includes('inset') && actif.ombre.includes('-3px'), 'ombre de l\'accès actif : ' + actif.ombre);
      assert.ok(actif.ombre.includes(m.primaire), `ombre de l'accès actif : ${actif.ombre} (couleur primaire attendue : ${m.primaire})`);
    });
    check(`${etiquette} : les quatre autres accès restent en 400, sans filet, et le fond de l'accès actif est inchangé`, () => {
      const actif = m.acces.find(a => a.actif);
      const autres = m.acces.filter(a => !a.actif);
      assert.ok(actif, 'aucun accès actif');
      assert.equal(autres.length, 4, 'accès non actifs : ' + autres.length);
      assert.deepEqual(autres.map(a => a.graisse), Array(4).fill('400'), 'graisses des autres accès : ' + JSON.stringify(autres.map(a => a.graisse)));
      assert.deepEqual(autres.map(a => a.ombre), Array(4).fill('none'), 'ombres des autres accès : ' + JSON.stringify(autres.map(a => a.ombre)));
      assert.deepEqual(autres.map(a => a.fond), Array(4).fill(actif.fond), `fonds des autres accès : ${JSON.stringify(autres.map(a => a.fond))} (accès actif : ${actif.fond})`);
    });
  });
  // Onglet de section actif sur mobile (ticket 2 du backlog) : même règle que l'accès rapide d'ordinateur (krActiveGameSection : URL exacte ou
  // sous-chemin suivi de « / »). Un chemin qui commence comme une section sans en être un sous-chemin (/jouer/plateaux) n'active rien.
  const regle = [
    { id: 'plateau', url: PLATEAU, html: fixture('plateau-minimal.html'), actif: 0 },
    { id: 'sous-chemin du plateau', url: PLATEAU + '/200002-11211-13-7956839652', html: fixture('plateau-minimal.html'), actif: 0 },
    { id: 'Personnage', url: PERSO, html: fixture('jeu-perso.html'), actif: 2 },
    { id: '/jouer/plateaux', url: BASE + '/jouer/plateaux', html: fixture('plateau-minimal.html'), actif: -1 },
    // Page hors jeu portant le panneau du joueur (fixture du plateau servie à /forum/rp) : accès rapides présents, aucun actif
    { id: 'hors jeu (/forum/rp)', url: BASE + '/forum/rp', html: fixture('plateau-minimal.html'), actif: -1, horsJeu: true }
  ];
  const V0 = VARIANTES[0];
  const mesuresRegle = await mapLimit(regle.flatMap(r => [{ ...r, device: MOBILE }, { ...r, device: BUREAU }]),
    r => mesurerPage({ url: r.url, html: r.html, variante: V0, device: r.device, mesure: MESURE_SECTIONS }));
  regle.forEach((r, i) => {
    const mobile = mesuresRegle[2 * i];
    const bureau = mesuresRegle[2 * i + 1];
    check(`[${V0}] ${r.id} : onglet mobile actif et accès rapide actif d'ordinateur désignent la même section (${r.actif < 0 ? 'aucune' : DESTINATIONS[r.actif]}), seul l'onglet actif porte aria-selected="true"`, () => {
      const actifsMobile = mobile.ongletsEtat.map((o, k) => (o.actif ? k : -1)).filter(k => k >= 0);
      const ariaMobile = mobile.ongletsEtat.map((o, k) => (o.aria === 'true' ? k : -1)).filter(k => k >= 0);
      const actifsBureau = bureau.acces.map((a, k) => (a.actif ? k : -1)).filter(k => k >= 0);
      const attendu = r.actif < 0 ? [] : [r.actif];
      verifierSocle(mobile, V0, { pageForum: !!r.horsJeu });
      verifierSocle(bureau, V0, { mobile: false, pageForum: !!r.horsJeu });
      assert.equal(bureau.acces.length, 5, 'accès rapides d\'ordinateur : ' + bureau.acces.length);
      if (!r.horsJeu) {assert.equal(mobile.ongletsEtat.length, 5, 'onglets de section mobiles : ' + mobile.ongletsEtat.length);}
      assert.deepEqual(actifsMobile, attendu, 'onglets mobiles actifs : ' + JSON.stringify(actifsMobile));
      assert.deepEqual(ariaMobile, attendu, 'onglets mobiles aria-selected="true" : ' + JSON.stringify(ariaMobile));
      assert.deepEqual(actifsBureau, attendu, 'accès rapides actifs : ' + JSON.stringify(actifsBureau));
    });
  });
  // Seuil de 768 px : la règle appartient au bloc ordinateur (min-width: 768px) et ne déborde pas sur le mobile (767 px, 375 px tactile).
  const V = VARIANTES[0];
  const seuils = [
    { nom: '375 px (tactile)', device: MOBILE, bureau: false },
    { nom: '767 px', device: { viewport: { width: 767, height: 800 } }, bureau: false },
    { nom: '768 px', device: { viewport: { width: 768, height: 800 } }, bureau: true }
  ];
  const mesuresSeuils = await mapLimit(seuils, s => mesurerPage({ url: PLATEAU, html: fixture('plateau-minimal.html'), variante: V, device: s.device, mesure: MESURE_SECTIONS }));
  seuils.forEach((s, i) => {
    const m = mesuresSeuils[i];
    check(`[${V}] plateau ${s.nom} : ${s.bureau ? 'l\'accès actif est en demi-gras (600) avec le filet de 3 px' : 'l\'accès actif garde l\'apparence des autres (400, sans ombre), mode mobile actif'}`, () => {
      verifierSocle(m, V, { mobile: !s.bureau });
      const actif = m.acces.find(a => a.actif);
      assert.ok(actif, 'aucun accès actif');
      if (s.bureau) {
        assert.equal(actif.graisse, '600', 'graisse de l\'accès actif : ' + actif.graisse);
        assert.ok(actif.ombre.includes('inset') && actif.ombre.includes('-3px'), 'ombre de l\'accès actif : ' + actif.ombre);
      } else {
        assert.equal(actif.graisse, '400', 'graisse de l\'accès actif : ' + actif.graisse);
        assert.equal(actif.ombre, 'none', 'ombre de l\'accès actif : ' + actif.ombre);
      }
    });
  });
}

if (on('icones')) {
  const V = VARIANTES[0]; // les icônes ne dépendent pas du thème : une seule variante
  console.log(`Icônes des cinq sections : accès rapides (1280 × 720) et onglets de section (375 × 667, tactile), variante ${V}`);
  const [bureau, mobile] = await mapLimit([BUREAU, MOBILE], device => mesurerPage({ url: PLATEAU, html: fixture('plateau-minimal.html'), variante: V, device, mesure: MESURE_SECTIONS }));
  check(`[${V}] plateau ordinateur : les accès rapides ont les icônes des cinq sections, dans l'ordre`, () => {
    verifierSocle(bureau, V, { mobile: false });
    const icones = bureau.acces.map(a => a.icone);
    assert.deepEqual(icones, ICONES, 'icônes des accès rapides : ' + JSON.stringify(icones));
  });
  check(`[${V}] plateau mobile : les onglets de section ont les mêmes icônes, dans le même ordre`, () => {
    verifierSocle(mobile, V);
    assert.deepEqual(mobile.onglets, ICONES, 'icônes des onglets de section : ' + JSON.stringify(mobile.onglets));
  });
}

// Effets du module des sujets permanents : blocs de compteurs ajoutés, lignes marquées, cellules de tableau masquées (display: none calculé)
const MESURE_SUJETS_PERMANENTS = () => {
  const cellules = [...document.querySelectorAll('#col-right table td')];
  return {
    cellules: cellules.length,
    blocs: document.querySelectorAll('.permanent-topic-stats').length,
    marquees: document.querySelectorAll('[data-permanent-icons-added]').length,
    masquees: cellules.filter(td => getComputedStyle(td).display === 'none').length,
    // Décor CSS du forum (« sujets », « messages », « → » en pseudo-élément) dans les cellules des tableaux
    decor: cellules.flatMap(td => ['::before', '::after'].map(pseudo => getComputedStyle(td, pseudo).content))
      .filter(contenu => /→|sujets|messages/.test(contenu))
  };
};

if (on('hors-forum-js')) {
  const V = VARIANTES[1];
  const LARGEURS = [320, 375, 768, 1280];
  console.log(`Module des sujets permanents hors forum : Cybermonde et Personnage à ${LARGEURS.join(', ')} px, forum à 375 px, variante ${V}`);
  const device = l => (l < 768 ? { viewport: { width: l, height: 667 }, isMobile: true, hasTouch: true } : { viewport: { width: l, height: 800 } });
  const cas = [
    ...LARGEURS.map(l => ({ nom: `Cybermonde ${l} px`, url: CYBERMONDE, html: fixture('cybermonde-ville.html'), device: device(l), hors: true, socle: { mobile: l < 768 } })),
    ...LARGEURS.map(l => ({ nom: `Personnage ${l} px`, url: PERSO, html: fixture('jeu-perso.html'), device: device(l), hors: true, socle: { mobile: l < 768 } })),
    { nom: 'index du forum 375 px', url: INDEX_FORUM, html: fixture('forum-index-rp.html'), device: MOBILE, hors: true, socle: { pageForum: true } },
    { nom: 'racine du forum 375 px', url: RACINE_FORUM, html: fixture('forum-racine.html'), device: MOBILE, hors: false, socle: { pageForumRacine: true } }
  ];
  const res = await mapLimit(cas, c => mesurerPage({ url: c.url, html: c.html, variante: V, device: c.device, mesure: MESURE_SUJETS_PERMANENTS }));
  cas.forEach((c, i) => {
    const m = res[i];
    check(`[${V}] ${c.nom} : thème appliqué, mode ${c.socle.mobile === false ? 'ordinateur' : 'mobile'}, classes de page attendues, aucune exception`, () => {
      verifierSocle(m, V, c.socle);
      assert.deepEqual(m.erreurs, []);
    });
    if (c.hors) {
      check(`[${V}] ${c.nom} : aucun bloc de compteurs, aucune ligne marquée, aucune cellule masquée${c.url === INDEX_FORUM ? ' (index exclu du module, ticket 6.1)' : ''}`, () => {
        assert.ok(m.cellules > 0, 'aucune cellule de tableau dans #col-right');
        assert.equal(m.blocs, 0, 'blocs .permanent-topic-stats : ' + m.blocs);
        assert.equal(m.marquees, 0, 'lignes data-permanent-icons-added : ' + m.marquees);
        assert.equal(m.masquees, 0, 'cellules masquées : ' + m.masquees + ' sur ' + m.cellules);
      });
      if (c.url !== INDEX_FORUM) {
        check(`[${V}] ${c.nom} : aucune cellule ne reçoit le décor CSS du forum (« sujets », « messages », « → »)`, () => {
          assert.deepEqual(m.decor, [], 'contenus générés : ' + JSON.stringify(m.decor));
        });
      }
    } else {
      check(`[${V}] ${c.nom} : le module ajoute toujours ses blocs de compteurs (non-régression)`, () => {
        assert.ok(m.blocs > 0, 'blocs .permanent-topic-stats : ' + m.blocs);
      });
    }
  });
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
