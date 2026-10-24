// Cartes et pastilles (épopée 5, entrée 1) : carte de section mobile des pages de jeu, du kramail et des règles (H4.1, DESIGN.md › Carte
// de section ; plan story-carte-de-section-mobile-des-pages-de-jeu-kramail-par-les-reg). Une vérification par ligne de la matrice du plan :
//   carte       Matériel, Personnage, Bâtiments, Employés, plateau (objets), règles, Cybermonde (ville) à 375 et 767 px, Kraland clair et
//               Empire Brun sombre : chaque panneau à 8 px de chaque bord (largeur vw − 16), fond surface, 4 rayons de 8 px ; en-tête collé
//               en haut du panneau, de 48 px (plus haut seulement si son contenu l'exige), retrait 0 16 px ; contenu sans écart sous
//               l'en-tête, corps en retrait de 16 px, dernier corps aux coins bas de 8 px ; titre 17 px 700 en couleur du texte ; chevrons
//               (natif ou du module, enfants directs de l'en-tête) dans l'en-tête, à 16 px du bord droit ; aucun débordement horizontal ;
//   module      Bâtiments (Bâtiments Privés), plateau (Commerce, Matériel), Cybermonde (Bâtiments) à 375 et 767 px : chevron du module à
//               16 px du bord droit, centré, chevron natif masqué ; un tap sur l'en-tête (elementFromPoint vérifié avant) replie : carte de
//               48 px, corps de 0 px ; un 2e tap déplie : hauteur d'origine ; contrôle statique : règles du module dans le média mobile ;
//   kramail     réception et envoyés à 375 et 767 px : même carte, corps sans retrait (lignes pleine largeur) ; contrôle statique : règles de la
//               carte (priorités) et règles du kramail ciblées sans marge, fond ni couleur propres ;
//   forum       (entrée 2) sous-forum, index RP, Communauté, Staff, racine et racine-groupes à 375 et 767 px, Kraland clair et Empire Brun
//               sombre : même carte (corps sans retrait, chevron natif de 44 x 44 dans la carte), tout élément des panneaux dans la carte,
//               aucun débordement (Staff : largeur défilable égale à la base, sa croix d'alerte débordant déjà) ; contrôle statique : règles du
//               forum ciblées sans fond transparent, filet, rayon, retrait propre ni --kr-text-accent ; fil de sujet : messages égaux au
//               bundle de base (21fed8d) ; exclus de la carte, mêmes largeurs et variantes, égaux à la base sous leur racine : accordéon
//               (.panel-group) de Répondre (kramail) et de la page de l'échelle, panneau à onglets des modales d'ordre Dormir et Pouvoir ;
//   lignes      mêmes pages du forum, largeurs et variantes : chaque ligne de tableau dans la carte, sans ombre ; hauteur, retraits, filets
//               (gauche de 4 px des non lus, bas), fond, icônes d'état et cadenas, pastilles, flèche « dernier message » et cibles
//               (elementFromPoint au centre, en haut, en bas, à droite et sur le filet) égaux au bundle de base ;
//   chevron     sous-forum à 375 et 767 px : chevron natif de 44 x 44 dans la carte, touché au centre (elementFromPoint) ; 1er tap : carte
//               réduite à l'en-tête ; 2e tap : hauteur d'origine ;
//   bureau      toutes les pages à 768, 769, 1280, 1440 et 1920 px, Kraland clair et Empire Brun sombre : égales au bundle de base ;
//   bascule     Bâtiments, 767 -> 768 -> 767 et 768 -> 767 -> 768 dans le même onglet (section repliée avant chaque passage) : carte à 767,
//               égal au bundle de base (même parcours) à 768 ;
//   groupes     (entrée 3) groupes du plateau (plateau-qualite-usage, .dashboard natif de deux groupes) à 375 et 767 px, Kraland clair et
//               Empire Brun sombre : chaque groupe en carte (8 px des bords, fond surface, rayons 8 px, sans ombre ; en-tête de 48 px au
//               moins, retrait 0 16 px, fond surface, sans filet ; titre 17 px 700 text-primary sans capitales ; chevron dans le flux à 16 px
//               du bord droit ; cartes de personnages à 8 px des bords), aucun débordement ; « mon groupe » ouvert, l'autre réduit à son
//               en-tête de 48 px (grille de 0 px sans cible, cartes dans le DOM) ; deux taps par en-tête (scrollTo puis elementFromPoint) :
//               état et aria-expanded inversés puis rétablis ; tap sur un bouton de groupe sans effet ; ordre des groupes et contenu des
//               cartes égaux au bundle de base (a7f0463) ; mini-profil plié et déplié à 375 et 700 px (plateau-minimal, plateau-qualite-usage)
//               égal à la base ; 768, 769, 1280, 1440 et 1920 px égaux à la base ; bascule 767 -> 768 -> 767 et 768 -> 767 -> 768 dans le
//               même onglet : carte à 767, base à 768 ; contrôle statique : règles des groupes sans !important, dans le média mobile ;
//   contraste   16 variantes, Bâtiments, réception, sous-forum, index RP et groupes du plateau à 375 px : titre de chaque carte ≥ 4,5:1 sur
//               son fond ; coins de la carte et coins bas du dernier corps à 8 px.
// Pages = FIXTURES SYNTHÉTIQUES (tests/e2e/fixtures), servies à leurs adresses ; vrai Bootstrap 3.3.7 (tests/e2e/vendor). Aucun accès au
// site réel. Les repères cités par trois suites (panneau, gardes du forum) sont dans lib/variantes.mjs (routeur, MAX_CITING).
// Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base, défaut : git show 21fed8d, a7f0463 pour groupes), KR_FRAG = carte,
// module, kramail, forum, lignes, chevron, bureau, bascule, groupes, contraste (vide = tout).
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
import { CONTRASTE, DOSSIER_MODALE_TICKET51, GROUPES_TICKET53 as G, PANNEAU_TICKET51, PASTILLE_TICKET52, RACCOURCIS_TICKET51, REGLES_CARTE_TICKET52, REGLES_FORUM_TICKET52, REGLES_KRAMAIL_TICKET51, SUJET_TICKET52, TEXTE_TICKET51, VALEURS_FORUM_TICKET52, VARIANTES as TOUTES, choisirVariante } from './lib/variantes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const userscript = sansEntete(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_AVANT = '21fed8d';
const avant = sansEntete(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_AVANT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
// Groupes du plateau (entrée 3, A6) : base dédiée, la carte des panneaux (21fed8d) restant celle des autres fragments.
const COMMIT_AVANT_53 = 'a7f0463';
const avant53 = sansEntete(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_AVANT_53}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
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
  'groupes-nu': { url: '/jouer/plateau', html: avecBootstrap(lire('plateau-qualite-usage.html')), famille: 'groupes', innerWidth: 791 }
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
        p: boite(p), fond: s.backgroundColor, coins: coins(s),
        h: boite(h), filet: hs.borderBottomWidth, retrait: [hs.paddingTop, hs.paddingRight, hs.paddingBottom, hs.paddingLeft], contenu: contenu + px(hs.paddingTop) + px(hs.paddingBottom),
        titre: titre ? { tag: titre.tagName, taille: ts.fontSize, graisse: ts.fontWeight, couleur: ts.color, rapport: C.texte(titre) } : null,
        suite: suite.length ? boite(suite[0]) : null,
        corps: corps.map(c => { const cs = getComputedStyle(c); return [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft]; }),
        dernier: dernier && dernier.classList.contains('panel-body') && vis(dernier) && dernier !== h ? coins(getComputedStyle(dernier)).slice(2) : null,
        chevrons, hors
      };
    })
  };
};

// Relevé de comparaison (dans la page) : panneaux, en-têtes, titres, corps et chevrons, boîte au dixième et styles calculés.
const RELEVE = ([racine = 'html', sels = ['.panel', '.panel-heading', '.panel-heading > *', '.panel-body', '.accordion-icon']] = []) => {
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
      return `${i} ${e.tagName}.${[...e.classList].join('.')} [${e.getClientRects().length ? [b.left, b.top - haut, b.width, b.height].map(r).join(',') : 'sans boîte'}] ` + props.map(p => s[p]).join('|');
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
// garde la même largeur défilable, sans élément de panneau sorti. chevronsBase : chevrons du bundle de base ; chevronNatif (Staff seul,
// sans règle de sous-forum ni d'index, A6) : un chevron de base sous 44 x 44 garde sa taille, dans la carte et dans l'en-tête ; partout
// ailleurs, 44 x 44 exigé.
function controlerCarte(m, famille, swBase, chevronsBase = [], chevronNatif = false) {
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
    if (!pres(c.h.y, c.p.y) || !pres(c.h.x, c.p.x) || !pres(c.h.w, c.p.w)) { e.push(`en-tête décalé [${c.h.x},${c.h.y},${c.h.w}]`); }
    if (c.h.h < 47.5 || (c.h.h > 48.5 && c.contenu < c.h.h - 0.5)) { e.push(`en-tête ${c.h.h} px (contenu ${c.contenu})`); }
    if (c.retrait.join(' ') !== '0px 16px 0px 16px') { e.push(`retrait ${c.retrait.join(' ')}`); }
    if (c.filet !== '0px') { e.push(`filet sous l'en-tête ${c.filet}`); }
    if (c.suite && !pres(c.suite.y, c.h.bas)) { e.push(`écart de ${Math.round((c.suite.y - c.h.bas) * 10) / 10} px sous l'en-tête`); }
    const attendu = famille === 'jeu' ? '16px 16px 16px 16px' : '0px 0px 0px 0px';
    if (c.corps.some(v => v.join(' ') !== attendu)) { e.push(`corps ${c.corps.map(v => v.join(' ')).join(' ; ')}`); }
    if (c.dernier && c.dernier.some(v => v !== '8px')) { e.push(`coins bas du dernier corps ${c.dernier.join(' ')}`); }
    if (!c.titre || c.titre.tag !== 'H3') { e.push(`titre ${c.titre ? c.titre.tag : 'absent'}`); } else if (c.titre.taille !== '17px' || c.titre.graisse !== '700' || c.titre.couleur !== m.primaire) {
      e.push(`titre ${c.titre.taille}/${c.titre.graisse} ${c.titre.couleur} (attendu 17px/700 ${m.primaire})`);
    }
    for (const v of c.chevrons) {
      const vb = chevronsBase[m.panneaux.flatMap(q => q.chevrons).indexOf(v)];
      const petit = chevronNatif && vb && (vb.w < 43.5 || vb.h < 43.5);
      if (forum) {
        if ((petit ? !pres(v.w, vb.w) || !pres(v.h, vb.h) : v.w < 43.5 || v.h < 43.5) || v.x < c.p.x - 0.5 || v.d > c.p.d + 0.5 || v.y < c.h.y - 0.5 || v.bas > c.h.bas + 0.5) { e.push(`chevron ${v.cls} ${v.w} x ${v.h} [${v.x}..${v.d}, ${v.y}..${v.bas}] hors de la carte ou de l'en-tête`); }
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
    check(`${frag} ${c.nom} ${c.variante} ${c.width} px : ${m.panneaux.length} carte(s) à 8 px des bords, fond surface, rayons 8 px, en-tête de 48 px (retrait 0 16 px, sans filet) collé au contenu, corps ${famille === 'kramail' ? 'sans retrait' : 'à 16 px'}, coins bas du dernier corps à 8 px, titre 17 px 700 text-primary, chevrons à 16 px du bord droit, sans débordement`, () => controlerCarte(m, famille));
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
let reglesTestees = null;
async function regles() {
  if (reglesTestees) { return reglesTestees; }
  const context = await browser.newContext();
  await confineNetwork(context);
  const page = await context.newPage();
  // eslint-disable-next-line no-eval
  reglesTestees = await page.evaluate(REGLES_CSS, [(0, eval)(`'${cssDuBundle(userscript)}'`), RACCOURCIS_TICKET51]);
  await context.close();
  return reglesTestees;
}
const MOBILE = ['(max-width: 767px)', '(width <= 767px)'];

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
    const ecarts = REGLES_KRAMAIL_TICKET51.flatMap(([sel, absentes]) => {
      const l = rs.filter(r => r.sel === sel);
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
    check(`${frag} ${c.nom} ${c.variante} ${c.width} px : ${quoi}${sous} égaux au bundle de base (${teste.r.l.length} éléments)`, () => {
      assert.ok(teste.r.theme && base.r.theme, `kr-theme-enabled testé ${teste.r.theme} / base ${base.r.theme}`);
      assert.equal(teste.r.mobile, c.width < 768, 'mode');
      assert.ok(teste.r.l.length > 0, 'aucun élément');
      const e = premierEcart(teste.r.l, base.r.l);
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
    return { c, m, swBase: mb.sw, chevronsBase: mb.panneaux.flatMap(p => p.chevrons), erreurs: t.erreurs };
  });
  for (const { c, m, swBase, chevronsBase, erreurs } of res) {
    check(`forum ${c.nom} ${c.variante} ${c.width} px : ${m.panneaux.length} carte(s) à 8 px des bords, fond surface, rayons 8 px, en-tête de 48 px (retrait 0 16 px, sans filet) collé au contenu, corps sans retrait, coins bas du dernier corps à 8 px, titre 17 px 700 text-primary, chevron de 44 x 44 dans la carte, éléments des panneaux dans la carte, sans débordement (base : ${swBase} px)`, () => controlerCarte(m, 'forum', swBase, chevronsBase, c.nom === 'staff'));
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
if (on('lignes')) {
  console.log('\n== lignes ==');
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
    check(`${lab} : hauteur, retraits, filets, fond, icônes d'état et cadenas, pastilles, flèches et cibles (centre, haut, bas, droite, filet) égaux au bundle de base`, () => {
      assert.equal(t.length, base.l.lignes.length, 'nombre de lignes');
      const ecarts = [];
      t.forEach((l, k) => {
        const z = base.l.lignes[k];
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
        return { p: b(p), h: b(p.querySelector(':scope > .panel-heading')), ch: b(ch), titre: p.querySelector(':scope > .panel-heading').textContent.trim() };
      }, [CHEVRON, i]);
      await page.evaluate(([sel, k]) => { window.scrollTo(0, 0); window.scrollTo(0, document.querySelectorAll(sel)[k].getBoundingClientRect().top - 150); }, [CHEVRON, i]);
      await styleSettled(page, 'body');
      const depart = await etat();
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
  await comparer('bureau', Object.keys(PAGES).filter(k => !['exclus', 'groupes'].includes(PAGES[k].famille)).flatMap(nom => BUREAUX.flatMap(width => VARIANTES.map(variante => ({ nom, width, variante })))));
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
    if (c.ombre !== 'none') { e.push(`ombre ${c.ombre}`); }
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
    const base = await ouvrir({ ...c, script: avant53 });
    const contenuBase = await base.page.evaluate(CONTENU_GROUPES, G);
    const themeBase = await base.page.evaluate(() => document.documentElement.classList.contains('kr-theme-enabled'));
    await base.context.close();
    return { c, m, contenu, contenuBase, themeBase, taps, erreurs };
  });
  for (const { c, m, contenu, contenuBase, themeBase, taps, erreurs } of res) {
    const lab = `groupes ${c.variante} ${c.width} px`;
    check(`${lab} : 2 groupes en carte (8 px des bords, fond surface, rayons 8 px, sans ombre ; en-tête ≥ 48 px, retrait 0 16 px, fond surface, sans filet ; titre 17 px 700 text-primary sans capitales ; chevron dans le flux à 16 px du bord droit ; cartes à 8 px des bords), sans débordement`, () => controlerGroupes(m));
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
    check(`${lab} : ordre des groupes, en-têtes et contenu des cartes (niveau, PNJ, PV, statut) égaux au bundle de base (${COMMIT_AVANT_53})`, () => {
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
      return page.evaluate(RELEVE, [G.miniProfil, ['', '*']]);
    };
    const plie = await etat('collapsed');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.tap(G.miniProfilEntete);
    const deplie = await etat('expanded');
    await context.close();
    return { plie, deplie, erreurs };
  };
  const casMp = ['plateau-minimal', 'groupes'].flatMap(nom => [375, 700].flatMap(width => VARIANTES.map(variante => ({ nom, width, variante }))));
  const resMp = await mapLimit(casMp, async c => ({ c, teste: await miniProfil(c, userscript), base: await miniProfil(c, avant53) }));
  for (const { c, teste, base } of resMp) {
    for (const k of ['plie', 'deplie']) {
      check(`groupes mini-profil ${c.nom} ${c.variante} ${c.width} px ${k === 'plie' ? 'plié' : 'déplié'} : égal au bundle de base (${teste[k].l.length} éléments)`, () => {
        assert.ok(teste[k].theme && base[k].theme, `kr-theme-enabled testé ${teste[k].theme} / base ${base[k].theme}`);
        assert.ok(teste[k].mobile, 'mobile-mode absent');
        assert.ok(teste[k].l.length > 1, 'mini-profil absent');
        const d = premierEcart(teste[k].l, base[k].l);
        assert.equal(d, '', d);
      });
    }
    check(`groupes mini-profil ${c.nom} ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
  // Bureau : groupes égaux à la base, filet gauche de 4 px compris.
  const SELS_GROUPES = [G.section, `${G.section} *`];
  const resBureau = await mapLimit(BUREAUX.flatMap(width => VARIANTES.map(variante => ({ nom: 'groupes', width, variante }))), async c => {
    const out = {};
    for (const [cle, script] of [['teste', userscript], ['base', avant53]]) {
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
    for (const [cle, script] of [['teste', userscript], ['base', avant53]]) {
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
  const resB = await mapLimit(casB, async c => ({ c, teste: await parcoursGroupes(userscript, c.variante, c.largeurs), base: await parcoursGroupes(avant53, c.variante, c.largeurs) }));
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
