// Revue mobile Galaxy S21 (2026-10-31) : une vérification par constat corrigé du rapport, en émulation S21 (360 × 800 px, tactile), sur
// les fixtures du dépôt servies à leurs vraies adresses avec les feuilles natives du site (tests/e2e/vendor/parler : Bootstrap, main.css,
// bootswatch.css, game.css). Chaque vérification échoue sur le bundle de base (feature/next f404965, avant la revue) et passe après, sauf
// les garde-fous et la couverture marqués ci-dessous (déjà vrais avant) et l'absence d'exception de page.
//   kramail      n° 1 : boutons du titre de la lecture sur un rang et menu « ••• » entier dans l'écran à 360 et 375 px (390 px :
//                couverture) ; n° 11 : retours de la réponse aux libellés affichés et différents à 360 et 361 px, en icône seule mais
//                différente à 320 et 359 px ; Répondre en bouton plein, retour en bouton standard ; constats : horloge de « posté »
//                (alignée sur « Citoyen » avec KR_FA_DIR), menu « ••• » de la réception aligné à gauche, contacts en lignes de 64 px
//                sans bouton de profil, cases à cocher de 24 px (contacts, réception) ;
//   liens        n° 2 : un lien du texte (message du forum, fenêtre d'aide, fiche de membre) reste en ligne, à la hauteur de sa ligne,
//                retrait compris ; étiquette et pastille en lien gardent leur retrait natif ; garde-fous : lien seul de son paragraphe
//                (« Kramail » d'une fiche de membre) et liens de tableau (aide du Staff) à 44 px ;
//   cartes       n° 3 : cartes détourées (filet d'ombre) dans les 8 variantes claires : Matériel, accueil (4 cartes), filtres des
//                Événements ; garde-fou : aucun filet ajouté en sombre (mêmes pages) ; accueil : avatar de Bienvenue à 16 px du bord,
//                « Ce message a été modifié » à 8 px ;
//   haut         n° 4 : premier contenu remonté d'au moins 20 px (plateau, Matériel, réception du kramail, sujet, contacts) ;
//   navigation   n° 5 : menu du site ouvert de x = 0 au bord droit ;
//   sous-forum   n° 6 : titres épinglés entiers (deux lignes au plus, sans « … » ni coupure), pastille sur une ligne, indice « › » sur
//                le tri, aucune ligne de métadonnées commencée par « · » ;
//   champs       n° 7 : bordure des champs à 3:1 au moins sur leur fond, transparence comprise, 8 variantes claires (kramail, réponse du
//                forum, règles) ; texte indicatif à 4,5:1 au moins (nouveau kramail, 16 variantes ; recherche des règles) ;
//   alertes      n° 8 : croix de l'alerte de bienvenue du forum à 3:1 au moins, alerte à 8 px des bords, clair et sombre ;
//   chevrons     n° 9 : un seul style d'icône de repli (taille et couleur ; police et boîte aussi avec KR_FA_DIR), centré sur la ligne du
//                titre (Bâtiments) ;
//   ordre        n° 10 : modale Dormir sans bandeau de titre vide (image seule de l'ordre : 72 px avant) ni onglet unique, « Dormir » écrit
//                une fois, « Valider » sans anneau de focus après un toucher (bouton témoin touché avant l'ouverture : pour Chromium, un
//                focus posé par script sans toucher préalable vaut un focus clavier) ;
//   pied         n° 12 : ligne de version à 4,5:1, 16 variantes ; numéro à jour dans la couleur de la ligne, en alerte seulement si une
//                mise à jour existe ; citation au moins un quart moins haute qu'avec le bundle de base (police manuscrite non servie) ;
//   forum        n° 13 : « Par Nerys » séparé de l'icône des messages ; barre d'actions d'un message sur un rang ; filet du titre en sombre
//                dans la bordure du thème ; racine titrée en 24 px gras ; en-tête de carte répétant le titre de la page masqué ;
//                « Expéditeur » du nouveau sujet sans capitales forcées, comme « Sujet » ; retour de la réponse centré sur la ligne du
//                titre, icône séparée du mot ; saisie dans la police du site (forum, kramail) ; sujet fermé : « Nouveau sujet » à sa
//                largeur en haut comme en bas ;
//   mini-profil  n° 14 : roue dentée et horloge en icônes Font Awesome (aucun émoji), roue nommée « Gestion du personnage », jauges de
//                6 px utiles au moins (filet exclu), libellés de 13 px, jauges une seule fois une fois déplié ; plateau : actions rapides
//                sans ombre en 13 px, jauges de l'onglet Agir aux couleurs du mini-profil, anneau du minuteur dans la palette d'états ;
//   palette      n° 15 : bouton palette jamais dans la barre du haut, même inséré après la construction de la barre mobile ;
//   contrastes   tableau des contrastes : couleurs natives des rapports, texte discret, auteur d'une citation à 4,5:1, clair et sombre ;
//   secondaires  pages secondaires : texte aligné à gauche ; tableaux sur toute la largeur (Organisations ; Citoyenneté et Maladies, page
//                de jeu, colonne d'icônes à sa largeur), aussi après une rotation dans les deux sens ; date des Événements sur une ligne ;
//                « ok » accolé au champ de recherche ; crayons du Compte après leur libellé ; bloc préformaté sombre en thème sombre ;
//                garde-fou : mots des en-têtes du Cybermonde entiers.
// Partout : aucune exception de page. Réseau confiné (lib/confinement.mjs) ; aucune action de jeu (soumissions neutralisées).
//
// Usage : npm run build && npm run test:zone -- revue-s21
// Preuve rouge : KR_SCRIPT=<bundle de base> npm run test:red -- revue-s21
// Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base des fragments haut et pied, défaut : git show f404965), KR_FA_DIR
//           (copie locale de Font Awesome 5.6.3 : css/all.min.css + webfonts/ ; sans elle, la feuille est servie vide : chevrons comparés sur
//           leur taille et leur couleur seulement, icônes de la barre d'un message à la largeur de leur glyphe, 16 px), KR_FRAG = kramail,
//           liens, cartes, haut, navigation, sous-forum, champs, alertes, chevrons, ordre, pied, forum, mini-profil, palette, contrastes,
//           secondaires (vide = tout).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { frames, krReady, THEME_READY, waitState } from './lib/settle.mjs';
import { REPERES_REVUE_S21 as R } from './lib/revue-s21.mjs';
import { choisirVariante, CONTRASTE, VARIANTES } from './lib/variantes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const versionDe = s => (/@version\s+(\S+)/.exec(s) || [])[1] || '';
const brut = fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8');
const userscript = sansEntete(brut);
const VERSION = versionDe(brut);
const COMMIT_AVANT = 'f404965'; // feature/next au départ de la revue S21
const avant = sansEntete(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_AVANT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const FIX = path.join(here, 'fixtures');
const PARLER = path.join(here, 'vendor/parler');
const FA_DIR = process.env.KR_FA_DIR || '';
const BASE = 'http://www.kraland.org';
const VERSION_URL = /^https:\/\/raw\.githubusercontent\.com\/arnaudroubinet\/kraland-css\/.*\/version\.json$/;
const S21 = { width: 360, height: 800 };
const CLAIRES = VARIANTES.filter(v => !v.endsWith('-dark'));
const DEUX = ['kraland', 'empire-brun-dark'];
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

// Pages : adresse servie et fixture du dépôt.
const P = {
  plateau: { url: '/jouer/plateau', file: 'plateau-qualite-usage.html' },
  jauges: { url: '/jouer/plateau', file: 'palette-nation-jauges.html' },
  ordre: { url: '/jouer/plateau', file: 'modale-ordre/plateau.html', bootbox: true },
  materiel: { url: '/jouer/materiel', file: 'jeu-materiel.html' },
  batiments: { url: '/jouer/bat', file: 'jeu-batiments.html' },
  perso: { url: '/jouer/perso', file: 'jeu-perso.html' },
  reception: { url: '/kramail/personnage-fictif-2000-0', file: 'kramail-reception.html' },
  lecture: { url: '/kramail/post/sujet-fictif-0-9000002', file: 'kramail-lecture.html' },
  nouveau: { url: '/kramail/post/nouveau-4-2000', file: 'kramail-nouveau.html' },
  repondre: { url: '/kramail/post/sujet-fictif-de-lecture-5-9000002', file: 'kramail-repondre.html' },
  contacts: { url: '/contacts', file: 'contacts.html' },
  racine: { url: '/forum', file: 'forum-racine-groupes.html' },
  indexRp: { url: '/forum/rp', file: 'forum-index-rp.html' },
  sousForum: { url: '/forum/hrp/debuter-20102', file: 'sous-forum-debuter.html' },
  sujet: { url: '/forum/sujet/messages-v3-329425-1', file: 'forum-sujet.html' },
  forumRepondre: { url: '/forum/post/repondre-2-329425', file: 'typographie-forum-redaction.html' },
  forumNouveau: { url: '/forum/post/nouveau-sujet-1-10101', file: 'forum-nouveau-sujet.html' },
  accueil: { url: '/accueil', file: 'accueil.html' },
  report: { url: '/report/perso-000000', file: 'report-non-lu.html' },
  aide: { url: '/aide', file: 'aide.html' },
  aideFenetre: { url: '/help', file: 'aide-fenetre.html' },
  aideStaff: { url: '/help/staff', file: 'aide-fenetre-staff.html' },
  regles: { url: '/regles/avancees', file: 'secondaires-regles.html' },
  recherche: { url: '/regles/base', file: 'regles-recherche.html' },
  organisations: { url: '/monde/organisations', file: 'secondaires-organisations.html' },
  evenements: { url: '/monde/evenements', file: 'secondaires-evenements.html' },
  membres: { url: '/communaute/membres', file: 'secondaires-membres.html' },
  cybermonde: { url: '/map', file: 'cybermonde-ville.html' },
  sujetFerme: { url: '/forum/sujet/mode-d-emploi-de-l-entraide-330504-1', file: 'forum-sujet-ferme.html' }
};

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}
const vide = (l, n = 6) => assert.equal(l.length, 0, l.slice(0, n).join(' | '));

// Feuilles natives aux adresses du site ; une feuille absente du dépôt est servie vide.
const LIB = {
  'bootstrap-3.3.7/css/bootstrap1.min.css': 'bootstrap1.min.css', 'bootstrap-3.3.7/css/bootstrap.min.css': 'bootstrap1.min.css',
  'bootstrap-3.3.7/js/bootstrap.min.js': 'bootstrap.min.js', 'jquery-3.3.1/jquery-3.3.1.min.js': 'jquery.min.js', 'bootbox-4.4.0/bootbox.min.js': 'bootbox.min.js',
  'kraland-7.0.9/css/main.css': 'main.css', 'kraland-7.0.9/css/bootswatch.css': 'bootswatch.css', 'kraland-7.0.9/css/minichat.css': 'minichat.css',
  'kraland-7.0.9/css/game.css': 'game.css'
};
const TYPES = { css: 'text/css', js: 'application/javascript', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', svg: 'image/svg+xml' };
const typeDe = f => TYPES[f.split('.').pop()] || 'application/octet-stream';
const IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#a9adb3"/></svg>';

function preparer(page, transformer) {
  let html = fs.readFileSync(path.join(FIX, page.file), 'utf8');
  if (transformer) { html = transformer(html); }
  const ajout = [];
  if (!/bootstrap1?\.min\.css/.test(html)) { ajout.push(`<link rel="stylesheet" href="${BASE}/lib/bootstrap-3.3.7/css/bootstrap1.min.css">`); }
  if (!/fontawesome-free-5\.6\.3/.test(html)) { ajout.push(`<link rel="stylesheet" href="${BASE}/lib/fontawesome-free-5.6.3/css/all.min.css">`); }
  for (const f of ['main.css', 'bootswatch.css']) { if (!html.includes('kraland-7.0.9/css/' + f)) { ajout.push(`<link rel="stylesheet" href="${BASE}/lib/kraland-7.0.9/css/${f}">`); } }
  if (page.url.startsWith('/jouer/')) { for (const f of ['minichat.css', 'game.css']) { if (!html.includes('kraland-7.0.9/css/' + f)) { ajout.push(`<link rel="stylesheet" href="${BASE}/lib/kraland-7.0.9/css/${f}">`); } } }
  if (page.bootbox && !/bootbox/.test(html)) { ajout.push(`<script src="${BASE}/lib/bootbox-4.4.0/bootbox.min.js"></script>`); }
  return html.includes('</head>') ? html.replace('</head>', ajout.join('\n') + '\n</head>') : ajout.join('\n') + html;
}

const browser = await launchBrowser();

// Ouvre une page en émulation S21 ; publie : version publiée simulée (défaut : celle du bundle, à jour).
async function ouvrir(page, { variante = 'kraland', width = S21.width, height = S21.height, script = userscript, publie = VERSION, transformer = null } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, screen: { width, height }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, locale: 'fr-FR' });
  const denied = await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route('http://img7.kraland.org/**', route => (new URL(route.request().url()).pathname.startsWith('/2/world/logo') ? route.fallback()
    : route.fulfill({ status: 200, contentType: 'image/svg+xml', body: IMAGE })));
  await context.route(VERSION_URL, route => route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ version: publie }) }));
  const html = preparer(page, transformer);
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (route.request().resourceType() === 'document') {
      return u.pathname === page.url ? route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }) : route.abort();
    }
    const i = u.pathname.indexOf('/lib/');
    const rest = i >= 0 ? u.pathname.slice(i + 5) : '';
    if (LIB[rest]) { return route.fulfill({ path: path.join(PARLER, LIB[rest]), contentType: typeDe(LIB[rest]) }); }
    if (rest.startsWith('fontawesome-free-5.6.3/') && FA_DIR) {
      const f = path.join(FA_DIR, rest.slice('fontawesome-free-5.6.3/'.length));
      if (fs.existsSync(f)) { return route.fulfill({ path: f, contentType: typeDe(f) }); }
    }
    if (rest.endsWith('.css')) { return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    return route.abort();
  });
  await context.addInitScript(choisirVariante, variante);
  await context.addInitScript(src => {
    window.GM = { xmlHttpRequest: () => {}, getValue: async (k, d) => d, setValue: async () => {} };
    // Aucune soumission (aucune action de jeu, même depuis une fixture)
    window.addEventListener('submit', e => e.preventDefault(), true);
    window.HTMLFormElement.prototype.submit = () => {};
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, script);
  const p = await context.newPage();
  const erreurs = [];
  p.on('pageerror', e => erreurs.push(String(e.message).split('\n')[0]));
  await p.goto(BASE + page.url, { waitUntil: 'load' });
  await krReady(p, { ready: THEME_READY, label: `${page.url} ${variante} ${width} px` });
  await p.evaluate(CONTRASTE);
  return { context, p, erreurs, denied };
}

// Mesure sur une page ouverte puis fermée : fn(p) renvoie la mesure (sérialisable), erreurs de page jointes.
async function mesurer(page, opts, fn) {
  const o = await ouvrir(page, opts);
  try { return { ...(await fn(o.p)), erreurs: o.erreurs }; } finally { await o.context.close(); }
}
const sansErreur = (m, tag) => check(`${tag} : aucune exception de page`, () => assert.deepEqual(m.erreurs, []));

// ---------- kramail : n° 1 et n° 11 ----------
if (on('kramail')) {
  console.log('Kramail : menu « ••• » de la lecture dans l\'écran (360, 375, 390 px), retours de la réponse distincts');
  const largeurs = [360, 375, 390];
  const res = await mapLimit(largeurs, width => mesurer(P.lecture, { width }, async p => {
    await p.click('h1.page-header .kramail-post-kebab > .dropdown-toggle');
    await waitState(p, () => !!document.querySelector('.kramail-post-kebab.open'));
    await frames(p);
    return p.evaluate(() => {
      const menu = document.querySelector('.kramail-post-kebab > .dropdown-menu');
      const b = menu.getBoundingClientRect();
      // Retour, Répondre, Répondre à tous (« À tous » sous 400 px) et « ••• » : rangs occupés par les boutons du titre
      const boutons = [...document.querySelectorAll('#col-right h1.page-header .pull-right > *')].filter(e => e.getClientRects().length);
      return { ouvert: !!document.querySelector('.kramail-post-kebab.open'), g: Math.round(b.left), d: Math.round(b.right), vw: document.documentElement.clientWidth,
        rangs: new Set(boutons.map(e => Math.round(e.getBoundingClientRect().top))).size, items: [...menu.querySelectorAll('li > a')].map(a => a.textContent.replace(/\s+/g, ' ').trim()) };
    });
  }));
  largeurs.forEach((width, i) => {
    const m = res[i];
    check(`lecture ${width} px : boutons du titre sur un rang (${m.rangs}), menu « ••• » ouvert entier dans l'écran (${m.g} à ${m.d} px sur ${m.vw})${width === 390 ? ', couverture' : ''}`, () => {
      assert.ok(m.ouvert && m.items.length >= 3, JSON.stringify(m.items));
      assert.equal(m.rangs, 1, `${m.rangs} rangs`);
      assert.ok(m.g >= 0 && m.d <= m.vw, `${m.g} à ${m.d}`);
    });
    sansErreur(m, `lecture ${width} px`);
  });
  // N° 11 : à 360 px et au-delà, libellés affichés et différents ; sous 360 px (seuil 359 / 360), icône seule, mais une par destination
  // (boîte de réception pour le dossier, enveloppe ouverte pour le message) au lieu de deux ◀◀ identiques
  const RETOURS = () => {
    const boutons = [...document.querySelectorAll('#col-right h1.page-header .pull-right > a.btn')].filter(a => a.getClientRects().length);
    // Libellé affiché : texte rendu (avant la revue, « Réception » et « Message » sont dans le bouton, en taille 0) ou ::before / ::after
    const libelle = a => {
      const vus = [];
      const w = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const rg = document.createRange(); rg.selectNodeContents(n);
        if (n.textContent.trim() && rg.getBoundingClientRect().width > 0) { vus.push(n.textContent.trim()); }
      }
      for (const ps of ['::before', '::after']) {
        const g = getComputedStyle(a, ps);
        if (g.content && !['none', 'normal', '""'].includes(g.content) && parseFloat(g.fontSize) > 0) { vus.push(g.content.replace(/^"|"$/g, '')); }
      }
      return vus.join(' ').replace(/\s+/g, ' ').trim();
    };
    // Glyphe de l'icône (contenu de son ::before, indépendant de la police servie)
    const icone = a => { const i = a.querySelector(':scope > i'); return i ? getComputedStyle(i, '::before').content : 'none'; };
    return { libelles: boutons.map(libelle), icones: boutons.map(icone), n: boutons.length };
  };
  const LARGEURS_RETOURS = [320, 359, 360, 361];
  const retours = await mapLimit(LARGEURS_RETOURS, width => mesurer(P.repondre, { width }, p => p.evaluate(RETOURS)));
  LARGEURS_RETOURS.forEach((width, i) => {
    const r = retours[i];
    if (width < 360) {
      check(`réponse ${width} px : deux retours en icône seule, icônes différentes (${JSON.stringify(r.icones)})`, () => {
        assert.ok(r.n >= 2, `${r.n} bouton(s)`);
        vide(r.icones.filter(c => ['none', 'normal', '""'].includes(c)).map(() => 'icône sans glyphe'));
        assert.equal(new Set(r.icones).size, r.n, JSON.stringify(r.icones));
      });
    } else {
      check(`réponse ${width} px : deux boutons de retour aux libellés affichés et différents (${JSON.stringify(r.libelles)})`, () => {
        assert.ok(r.n >= 2, `${r.n} bouton(s)`);
        assert.equal(new Set(r.libelles.filter(Boolean)).size, r.n, JSON.stringify(r.libelles));
      });
    }
    sansErreur(r, `réponse ${width} px`);
  });
  const l = await mesurer(P.lecture, {}, p => p.evaluate(() => {
    const fond = a => window.__krContraste.rgb(getComputedStyle(a).backgroundColor)[3];
    // Les boutons du titre ne portent qu'une icône : leur nom est dans data-kr-libelle (affiché par ::after), le texte sinon
    const libelle = a => (a.getAttribute('data-kr-libelle') || a.textContent).replace(/\s+/g, ' ').trim();
    const boutons = [...document.querySelectorAll('#col-right h1.page-header a.btn')].filter(a => a.getClientRects().length);
    const rep = boutons.find(a => /^répondre$/i.test(libelle(a)));
    const retour = boutons.find(a => !/répondre/i.test(libelle(a)));
    return { repondre: rep ? { classes: rep.className, fond: fond(rep) } : null, retour: retour ? { classes: retour.className, fond: fond(retour) } : null };
  }));
  check('lecture : « Répondre » en bouton primaire plein, retour en bouton standard', () => {
    assert.ok(l.repondre && /btn-primary/.test(l.repondre.classes) && l.repondre.fond === 1, JSON.stringify(l.repondre));
    assert.ok(l.retour && !/btn-primary/.test(l.retour.classes), JSON.stringify(l.retour));
  });
  // Section Kramail : « posté » aligné sur « Citoyen ». L'icône native fa-clock-o (nom Font Awesome 4) n'a pas de glyphe en 5 : son espace
  // décalait la ligne. Sans Font Awesome servie, seul le glyphe de l'horloge est contrôlé ; avec, l'alignement des deux bords gauches.
  const po = await mesurer(P.lecture, {}, p => p.evaluate(() => {
    const debut = e => {
      const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const k = n.data.search(/\S/);
        if (k >= 0) { const rg = document.createRange(); rg.setStart(n, k); rg.setEnd(n, k + 1); const b = rg.getBoundingClientRect(); if (b.width > 0) { return b.left; } }
      }
      return null;
    };
    const btn = document.querySelector('li.media .media-body > .btn-group > .btn');
    const i = btn && btn.querySelector('i');
    const citoyen = [...document.querySelectorAll('li.media *')].find(e => e.getClientRects().length && [...e.childNodes].some(n => n.nodeType === 3 && n.data.trim() === 'Citoyen'));
    const ri = i ? i.getBoundingClientRect() : null;
    return { glyphe: i ? getComputedStyle(i, '::before').content : 'none', icone: ri && ri.width > 1 ? Math.round(ri.left) : null, texte: btn ? Math.round(debut(btn)) : null,
      citoyen: citoyen ? Math.round(debut(citoyen)) : null };
  }));
  check(`lecture : « posté » précédé de l'horloge${FA_DIR ? `, aligné sur « Citoyen » (${po.icone ?? po.texte} / ${po.citoyen} px)` : ' (alignement non mesuré : Font Awesome non servie)'}`, () => {
    assert.ok(!['none', 'normal', '""'].includes(po.glyphe), `glyphe ${po.glyphe}`);
    if (FA_DIR) { assert.ok(po.citoyen !== null && Math.abs((po.icone ?? po.texte) - po.citoyen) <= 1, JSON.stringify(po)); }
  });
  sansErreur(po, 'lecture, posté');
  // Section Kramail : menu « ••• » de la réception, entrées alignées à gauche (icône puis libellé) au lieu d'être centrées
  const mr = await mesurer(P.reception, {}, async p => {
    await p.click('h1.page-header .kramail-actions-mobile > .dropdown-toggle');
    await waitState(p, () => !!document.querySelector('.kramail-actions-mobile.open'));
    await frames(p);
    return p.evaluate(() => [...document.querySelectorAll('.kramail-actions-mobile > .dropdown-menu > li > a')].filter(a => a.getClientRects().length).map(a => {
      const rg = document.createRange(); rg.selectNodeContents(a);
      const g = Math.min(...[...rg.getClientRects()].filter(b => b.width > 0).map(b => b.left));
      return { texte: a.textContent.trim().slice(0, 24), retrait: Math.round(g - a.getBoundingClientRect().left - parseFloat(getComputedStyle(a).paddingLeft)) };
    })).then(entrees => ({ entrees }));
  });
  // Retrait toléré : la marge native de 4 px de la case « Tout sélectionner »
  check(`réception : entrées du menu « ••• » alignées à gauche (${mr.entrees.map(e => e.retrait).join(', ')} px du retrait)`, () => {
    assert.ok(mr.entrees.length >= 3, `${mr.entrees.length} entrée(s)`);
    vide(mr.entrees.filter(e => e.retrait < -1 || e.retrait > 5).map(e => `${e.texte} décalée de ${e.retrait} px`));
  });
  sansErreur(mr, 'réception, menu');
  // Section Kramail : contacts sur une ligne de 64 px au plus (120 avant), bouton de profil retiré (le nom mène à la fiche) ; cases à cocher
  // des listes en 24 px (20 avant), contacts et réception
  const LISTE = () => ({
    lignes: [...document.querySelectorAll('#col-right #topics > tbody > tr')].filter(r => r.getClientRects().length).map(r => Math.round(r.getBoundingClientRect().height)),
    cases: [...document.querySelectorAll('#col-right #topics > tbody > tr > td:first-child input[type="checkbox"]')].filter(e => e.getClientRects().length).map(e => Math.round(e.getBoundingClientRect().width)),
    profils: [...document.querySelectorAll('#col-right #topics a.btn[href*="communaute/membres/"]')].filter(e => e.getClientRects().length).length
  });
  const [ct, rc] = await Promise.all([mesurer(P.contacts, {}, p => p.evaluate(LISTE)), mesurer(P.reception, {}, p => p.evaluate(LISTE))]);
  check(`contacts : lignes de 64 px au plus (${ct.lignes.join(', ')}), sans bouton de profil (${ct.profils})`, () => {
    assert.ok(ct.lignes.length > 0, 'aucune ligne');
    vide(ct.lignes.filter(h => h > 64).map(h => `${h} px`));
    assert.equal(ct.profils, 0);
  });
  for (const [nom, m] of [['contacts', ct], ['réception', rc]]) {
    check(`${nom} : cases à cocher de 24 px (${m.cases.join(', ')})`, () => { assert.ok(m.cases.length > 0, 'aucune case'); vide(m.cases.filter(w => w < 24).map(w => `${w} px`)); });
    sansErreur(m, `${nom}, liste`);
  }
}

// ---------- liens : n° 2 ----------
if (on('liens')) {
  console.log('Liens du texte en ligne (message du forum, fenêtre d\'aide, fiche de membre en panneau), étiquettes en lien avec leur retrait ; garde-fous : lien seul de son paragraphe et lien de tableau à 44 px');
  const LIGNES = msg => {
    const liens = [...document.querySelectorAll(`${msg} a, #content p a, #content dd a, #content pre a`)].filter(a => !a.closest('table, .btn, .list-group-item') && !a.matches('.btn, .label, .badge') && a.getClientRects().length && a.textContent.trim());
    return liens.slice(0, 8).map(a => {
      const p = a.closest(`p, pre, dd, ${msg}`);
      const lh = parseFloat(getComputedStyle(p).lineHeight) || parseFloat(getComputedStyle(p).fontSize) * 1.43;
      return { texte: a.textContent.trim().slice(0, 30), display: getComputedStyle(a).display, h: Math.round(a.getBoundingClientRect().height), lh: Math.round(lh) };
    });
  };
  // Fiche de membre : son seul lien de paragraphe (Kramail) est seul dans son paragraphe ; une phrase l'entoure ici pour en faire un lien du
  // texte d'un panneau (.panel-body a, retrait de 8 px des liens du commerce), dont la zone de toucher ne doit pas mordre sur le bouton de la
  // ligne d'au-dessus. La même phrase porte une étiquette et une pastille en lien.
  const KRAMAIL_FICHE = '<p><a href="kramail/post/compte-fixture-1-1">Kramail d\'essai</a></p>';
  const MEMBRE_TEXTE = html => {
    if (!html.includes(KRAMAIL_FICHE)) { throw new Error('fiche de membre : paragraphe du Kramail introuvable'); }
    return html.replace(KRAMAIL_FICHE, '<p>Écrire au compte par le <a href="kramail/post/compte-fixture-1-1">Kramail d\'essai</a> de sa fiche, '
      + 'statut <a class="label label-success" href="communaute/membres">actif</a>, <a class="badge" href="communaute/membres">3</a> messages.</p>');
  };
  for (const [nom, page, transformer] of [['sujet', P.sujet, null], ['fenêtre d\'aide', P.aideFenetre, null], ['membres', P.membres, MEMBRE_TEXTE]]) {
    const m = await mesurer(page, { transformer }, p => p.evaluate(LIGNES, R.messageForum).then(liens => ({ liens })));
    check(`${nom} : liens du texte en ligne, pas plus hauts que leur ligne, retrait compris (${m.liens.length})`, () => {
      assert.ok(m.liens.length > 0, 'aucun lien du texte');
      vide(m.liens.filter(l => l.display !== 'inline' || l.h > l.lh + 4).map(l => `${l.texte} ${l.display} ${l.h}/${l.lh} px`));
    });
    sansErreur(m, nom);
  }
  const e = await mesurer(P.membres, { transformer: MEMBRE_TEXTE }, p => p.evaluate(() => [...document.querySelectorAll('p > a.label, p > a.badge')].filter(a => a.getClientRects().length).map(a => {
    const s = getComputedStyle(a);
    const lh = parseFloat(getComputedStyle(a.parentElement).lineHeight) || parseFloat(getComputedStyle(a.parentElement).fontSize) * 1.43;
    return { classe: a.className, display: s.display, gauche: parseFloat(s.paddingLeft), h: Math.round(a.getBoundingClientRect().height), lh: Math.round(lh) };
  })).then(etiquettes => ({ etiquettes })));
  check(`membres : étiquette et pastille en lien dans le texte, à la hauteur de la ligne, retrait natif gardé (${e.etiquettes.map(x => `${x.display} ${x.gauche} px`).join(', ')})`, () => {
    assert.equal(e.etiquettes.length, 2, 'étiquette ou pastille absente');
    vide(e.etiquettes.filter(x => !/^inline(-block)?$/.test(x.display) || x.gauche < 4 || x.h > x.lh + 4).map(x => JSON.stringify(x)));
  });
  // Garde-fou (déjà vrai avant) : un lien seul de son paragraphe (Kramail de la fiche) n'est pas du texte courant, il garde sa cible de 44 px,
  // sous la ligne d'au-dessus
  const seul = await mesurer(P.membres, {}, p => p.evaluate(() => {
    const a = document.querySelector('a[href="kramail/post/compte-fixture-1-1"]');
    const r = a.getBoundingClientRect();
    const dessus = a.parentElement.previousElementSibling.getBoundingClientRect();
    return { h: Math.round(r.height), display: getComputedStyle(a).display, mord: Math.round(dessus.bottom - r.top) };
  }));
  check(`membres (garde-fou) : lien seul de son paragraphe à 44 px, sans mordre sur la ligne d'au-dessus (${seul.h} px, ${seul.display})`, () => {
    assert.ok(seul.h >= 44 && seul.display !== 'inline' && seul.mord <= 0, JSON.stringify(seul));
  });
  // Garde-fou (déjà vrai avant) : la règle des liens du texte ne touche pas aux liens de tableau, qui gardent leur cible de 44 px
  const t = await mesurer(P.aideStaff, {}, p => p.evaluate(() => [...document.querySelectorAll('#content td > a')].filter(a => a.getClientRects().length && a.textContent.trim())
    .map(a => ({ texte: a.textContent.trim().slice(0, 20), h: Math.round(a.getBoundingClientRect().height) }))).then(liens => ({ liens })));
  check(`aide du Staff (garde-fou) : liens de tableau à 44 px au moins (${t.liens.length})`, () => {
    assert.ok(t.liens.length > 0, 'aucun lien de tableau');
    vide(t.liens.filter(l => l.h < 44).map(l => `${l.texte} ${l.h} px`));
  });
}

// ---------- cartes : n° 3 ----------
if (on('cartes')) {
  console.log('Cartes de section détourées en clair (8 variantes : Matériel, accueil, filtres des Événements), sans contour ajouté en sombre');
  const FILET = /0px 0px 0px 1px/;
  const verifier = (tag, sombre, ombres, min) => check(`${tag} : ${sombre ? 'garde-fou : cartes sans filet ajouté (la surface se détache déjà)' : 'chaque carte porte un filet de 1 px (ombre)'} (${ombres.length})`, () => {
    assert.ok(ombres.length >= min, `moins de ${min} carte(s)`);
    vide(ombres.filter(o => (sombre ? FILET.test(o) : !FILET.test(o))));
  });
  const OMBRE = carte => [...document.querySelectorAll(`#col-right ${carte}, .dashboard ${carte}`)].filter(e => e.getClientRects().length).map(e => getComputedStyle(e).boxShadow);
  const variantes = [...CLAIRES, 'empire-brun-dark'];
  const res = await mapLimit(variantes, variante => mesurer(P.materiel, { variante }, p => p.evaluate(OMBRE, R.carteSection).then(ombres => ({ ombres }))));
  variantes.forEach((variante, i) => verifier(`Matériel ${variante}`, variante.endsWith('-dark'), res[i].ombres, 2));
  // Accueil (Bienvenue, Forum, Compteurs, Nouvelles) et filtres des Événements (liste latérale qui porte un formulaire, seule gardée en mobile)
  const PAGES_CARTES = [
    ['accueil', P.accueil, '#col-t > .ds_user, #col-t > .accueil-forum-section, #col-left > .kraland-metrics, #col-left > #player-header-section', 4],
    ['Événements, filtres', P.evenements, '#col-left > .list-group', 1]
  ];
  const cas = variantes.flatMap(variante => PAGES_CARTES.map(c => ({ variante, c })));
  const rp = await mapLimit(cas, x => mesurer(x.c[1], { variante: x.variante }, p => p.evaluate(sel => [...document.querySelectorAll(sel)].filter(e => e.getClientRects().length)
    .map(e => getComputedStyle(e).boxShadow), x.c[2]).then(ombres => ({ ombres }))));
  cas.forEach((x, i) => verifier(`${x.c[0]} ${x.variante}`, x.variante.endsWith('-dark'), rp[i].ombres, x.c[3]));
  cas.forEach((x, i) => { if (x.variante === 'kraland') { sansErreur(rp[i], x.c[0]); } });
  // Section Accueil : dans leurs cartes, avatar de Bienvenue à 16 px du bord droit (comme le texte à gauche) et « Ce message a été modifié »
  // à 8 px avant le bout des filets (il le touchait)
  const ac = await mesurer(P.accueil, {}, p => p.evaluate(() => {
    const carte = document.querySelector('#col-t > .ds_user');
    const avatar = carte && carte.querySelector(':scope > .pull-right');
    const modifie = [...document.querySelectorAll('.genmsg')].find(g => g.getClientRects().length && /modifi/i.test(g.textContent));
    let marge = null;
    if (modifie) {
      const rg = document.createRange(); rg.selectNodeContents(modifie);
      const fin = Math.max(...[...rg.getClientRects()].filter(b => b.width > 0).map(b => b.right));
      let c = modifie.parentElement; while (c && getComputedStyle(c).display === 'inline') { c = c.parentElement; }
      marge = Math.round(c.getBoundingClientRect().right - parseFloat(getComputedStyle(c).paddingRight) - fin);
    }
    return { avatar: carte && avatar ? Math.round(carte.getBoundingClientRect().right - avatar.getBoundingClientRect().right) : null, modifie: marge };
  }));
  check(`accueil : avatar de Bienvenue à 16 px du bord droit de sa carte (${ac.avatar} px)`, () => assert.ok(ac.avatar !== null && Math.abs(ac.avatar - 16) <= 1, String(ac.avatar)));
  check(`accueil : « Ce message a été modifié » à 8 px du bout des filets (${ac.modifie} px)`, () => assert.ok(ac.modifie !== null && ac.modifie >= 7, String(ac.modifie)));
}

// ---------- haut : n° 4 ----------
if (on('haut')) {
  console.log(`Premier contenu remonté d'au moins 20 px par rapport au bundle de base (${COMMIT_AVANT})`);
  const CAS = [
    ['plateau', P.jauges, '#col-right .panel, .container .panel'],
    ['Matériel', P.materiel, '.dashboard .panel, .panel'],
    ['réception du kramail', P.reception, 'table tbody tr'],
    ['sujet du forum', P.sujet, 'li.media.well'],
    ['contacts', P.contacts, 'table tbody tr']
  ];
  const HAUT = sel => {
    const e = [...document.querySelectorAll(sel)].find(x => x.getClientRects().length && x.getBoundingClientRect().height > 8 && getComputedStyle(x).visibility !== 'hidden');
    return e ? Math.round(e.getBoundingClientRect().top + window.scrollY) : null;
  };
  const res = await mapLimit(CAS.flatMap(c => [[c, avant], [c, userscript]]), ([c, script]) => mesurer(c[1], { script }, p => p.evaluate(HAUT, c[2]).then(haut => ({ haut }))));
  CAS.forEach((c, i) => {
    const [a, n] = [res[2 * i], res[2 * i + 1]];
    check(`${c[0]} : premier contenu à ${n.haut} px au lieu de ${a.haut} (au moins 20 px plus haut)`, () => {
      assert.ok(Number.isFinite(a.haut) && Number.isFinite(n.haut), `${a.haut} / ${n.haut}`);
      assert.ok(a.haut - n.haut >= 20, `gain ${a.haut - n.haut} px`);
    });
  });
}

// ---------- navigation : n° 5 ----------
if (on('navigation')) {
  console.log('Menu du site ouvert sur toute la largeur');
  const m = await mesurer(P.contacts, {}, async p => {
    await p.click('nav.navbar .navbar-toggle');
    await waitState(p, () => !!document.querySelector('#navbar.in') && !document.querySelector('.collapsing'));
    await frames(p);
    return p.evaluate(() => { const b = document.querySelector('#navbar').getBoundingClientRect(); return { g: Math.round(b.left), d: Math.round(b.right), vw: document.documentElement.clientWidth }; });
  });
  check(`menu ouvert de ${m.g} à ${m.d} px (écran de ${m.vw} px) : ni décalé à gauche, ni page visible à droite`, () => assert.ok(m.g >= 0 && m.d >= m.vw - 1, `${m.g} à ${m.d}`));
  sansErreur(m, 'menu');
}

// ---------- sous-forum : n° 6 ----------
if (on('sous-forum')) {
  console.log('Sous-forum à 360 px : titres épinglés entiers, pastille sur une ligne, indice de défilement du tri, métadonnées sans « · » initial');
  for (const variante of DEUX) {
    const m = await mesurer(P.sousForum, { variante }, p => p.evaluate(carte => {
      const permanents = [...document.querySelectorAll(`${carte} table.table > tbody > tr > td:first-child > p > a`)].filter(a => a.getClientRects().length);
      // Titre rogné : « … » d'une ligne (nowrap), ou texte coupé par la borne de lignes (line-clamp : deux au plus) ou un débordement masqué,
      // sur le lien ou son paragraphe
      const rogne = e => getComputedStyle(e).display !== 'inline' && e.scrollHeight > e.clientHeight + 1;
      const titres = permanents.map(a => {
        const s = getComputedStyle(a);
        const lignes = Math.round(a.getBoundingClientRect().height / parseFloat(s.lineHeight));
        return { texte: a.textContent.trim().slice(0, 30), ellipse: s.textOverflow === 'ellipsis' && s.whiteSpace === 'nowrap', coupe: a.scrollWidth > a.clientWidth + 1 && s.whiteSpace === 'nowrap',
          borne: rogne(a) || rogne(a.parentElement), lignes };
      });
      const pastilles = [...document.querySelectorAll('.kr-topic-badge')].filter(e => e.getClientRects().length).map(e => {
        const s = getComputedStyle(e);
        return { texte: e.textContent.trim(), lignes: Math.round((e.getBoundingClientRect().height - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom)) / (parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2)) };
      });
      const tri = getComputedStyle(document.querySelector('#topics thead'), '::after').content;
      // Première chose visible de chaque ligne de métadonnées (cellules et pseudo-éléments, dans l'ordre d'affichage)
      const meta = [...document.querySelectorAll('#topics tbody tr')].filter(r => r.getClientRects().length).map(r => {
        const morceaux = [];
        r.querySelectorAll('td, td *').forEach(e => {
          if (!e.getClientRects().length) { return; }
          const b = e.getBoundingClientRect();
          for (const ps of ['::before', '::after']) {
            const c = getComputedStyle(e, ps).content;
            if (c && c !== 'none' && c !== 'normal' && c !== '""') { morceaux.push({ y: Math.round(b.top), x: Math.round(ps === '::before' ? b.left : b.right), t: c }); }
          }
          for (const n of e.childNodes) {
            if (n.nodeType === 3 && n.textContent.trim()) { const rg = document.createRange(); rg.selectNodeContents(n); const rb = rg.getBoundingClientRect(); if (rb.width) { morceaux.push({ y: Math.round(rb.top), x: Math.round(rb.left), t: n.textContent.trim() }); } }
          }
        });
        const lignes = {};
        morceaux.forEach(mc => { const k = Object.keys(lignes).find(y => Math.abs(y - mc.y) <= 4) ?? mc.y; (lignes[k] = lignes[k] || []).push(mc); });
        return Object.values(lignes).map(l => l.sort((a, b) => a.x - b.x)[0].t.replace(/^"|"$/g, '').trim());
      });
      return { titres, pastilles, tri, debuts: meta.flat() };
    }, R.carteSection));
    const tag = `sous-forum ${variante}`;
    check(`${tag} : titres épinglés entiers, deux lignes au plus, sans « … » (${m.titres.length})`, () => {
      assert.ok(m.titres.length >= 2, 'moins de deux titres épinglés');
      vide(m.titres.filter(t => t.ellipse || t.coupe || t.borne || t.lignes > 2).map(t => `${t.texte} ${JSON.stringify(t)}`));
    });
    check(`${tag} : pastilles sur une ligne (${m.pastilles.length})`, () => { assert.ok(m.pastilles.length > 0); vide(m.pastilles.filter(x => x.lignes > 1).map(x => `${x.texte} ${x.lignes} lignes`)); });
    check(`${tag} : indice de défilement « › » sur la barre de tri`, () => assert.ok(/›/.test(m.tri), m.tri));
    check(`${tag} : aucune ligne de métadonnées ne commence par « · »`, () => vide(m.debuts.filter(t => t.startsWith('·'))));
    sansErreur(m, tag);
  }
}

// ---------- champs : n° 7 ----------
if (on('champs')) {
  console.log('Bordure des champs à 3:1 au moins, 8 variantes claires');
  const BORDURES = () => {
    const C = window.__krContraste;
    const COTES = ['Top', 'Left', 'Bottom', 'Right'];
    // Bordure visible : sur le champ, un côté au moins (la zone de saisie de l'éditeur n'a pas de bord haut, porté par la barre d'outils),
    // sinon sur le cadre qui l'entoure (destinataires du kramail : .kd-field). Couleur composée sur le fond, transparence comprise (avant la
    // revue : rgba(0, 0, 0, .08) et .15, soit 1,2:1 et 1,5:1 sur blanc).
    const bord = e => {
      for (let x = e; x && x.tagName !== 'FORM' && x !== document.body; x = x.parentElement) {
        const s = getComputedStyle(x);
        const cote = COTES.find(k => parseFloat(s[`border${k}Width`]) > 0 && s[`border${k}Style`] !== 'none');
        if (cote) { return { x, c: C.rgb(s[`border${cote}Color`]) }; }
      }
      return null;
    };
    return [...document.querySelectorAll('input.form-control, textarea.form-control, select.form-control, #col-right input[type="text"], #col-right textarea')]
      .filter(e => e.getClientRects().length && e.offsetWidth > 40).map(e => {
        const nom = e.name || e.id || e.tagName;
        const b = bord(e);
        if (!b) { return { nom: nom + ' (sans bordure)', r: 0 }; }
        const fond = C.fond(b.x.parentElement);
        return { nom, r: C.rapport([0, 1, 2].map(k => b.c[k] * b.c[3] + fond[k] * (1 - b.c[3])), fond) };
      });
  };
  const cas = CLAIRES.flatMap(v => [['kramail', P.nouveau], ['réponse du forum', P.forumRepondre], ['règles', P.recherche]].map(([nom, page]) => ({ v, nom, page })));
  const res = await mapLimit(cas, c => mesurer(c.page, { variante: c.v }, p => p.evaluate(BORDURES).then(champs => ({ champs }))));
  cas.forEach((c, i) => check(`${c.nom} ${c.v} : bordure des champs ≥ 3:1 (${res[i].champs.length})`, () => {
    assert.ok(res[i].champs.length > 0, 'aucun champ');
    vide(res[i].champs.filter(f => f.r < 3).map(f => `${f.nom} ${f.r.toFixed(2)}:1`));
  }));
  // N° 7 (suite) : texte indicatif à 4,5:1 au moins sur le fond de son champ (2,7 à 3,1:1 avant), 16 variantes (kramail) ; recherche des règles
  const INDICATIF = () => {
    const C = window.__krContraste;
    return [...document.querySelectorAll('input[placeholder], textarea[placeholder]')].filter(e => e.getClientRects().length).map(e => {
      const s = getComputedStyle(e, '::placeholder');
      const c = C.rgb(s.color);
      const a = c[3] * (Number.isFinite(parseFloat(s.opacity)) ? parseFloat(s.opacity) : 1);
      const fond = C.fond(e);
      return { nom: e.name || e.id || e.tagName, r: C.rapport([0, 1, 2].map(k => c[k] * a + fond[k] * (1 - a)), fond) };
    });
  };
  const casI = [...VARIANTES.map(v => ({ v, nom: 'kramail', page: P.nouveau })), ...DEUX.map(v => ({ v, nom: 'règles, recherche', page: P.recherche }))];
  const resI = await mapLimit(casI, c => mesurer(c.page, { variante: c.v }, p => p.evaluate(INDICATIF).then(champs => ({ champs }))));
  casI.forEach((c, i) => check(`${c.nom} ${c.v} : texte indicatif ≥ 4,5:1 (${resI[i].champs.length})`, () => {
    assert.ok(resI[i].champs.length > 0, 'aucun texte indicatif');
    vide(resI[i].champs.filter(f => f.r < 4.5).map(f => `${f.nom} ${f.r.toFixed(2)}:1`));
  }));
}

// ---------- alertes : n° 8 ----------
if (on('alertes')) {
  console.log('Croix de l\'alerte de bienvenue du forum à 3:1 au moins');
  for (const variante of DEUX) {
    const m = await mesurer(P.indexRp, { variante }, p => p.evaluate(() => {
      const C = window.__krContraste;
      const x = [...document.querySelectorAll('.alert .close')].find(e => e.getClientRects().length);
      if (!x) { return { r: null }; }
      const s = getComputedStyle(x);
      const c = C.rgb(s.color);
      const fond = C.fond(x.closest('.alert'));
      const a = c[3] * parseFloat(s.opacity);
      // N° 8 (suite) : l'alerte en tête de colonne à 8 px des bords de l'écran, comme les cartes (elle les touchait)
      const b = x.closest('.alert').getBoundingClientRect();
      return { r: C.rapport([0, 1, 2].map(k => c[k] * a + fond[k] * (1 - a)), fond), bords: [Math.round(b.left), Math.round(document.documentElement.clientWidth - b.right)] };
    }));
    check(`index RP ${variante} : croix de l'alerte à ${m.r ? m.r.toFixed(2) : '?'}:1 (≥ 3:1)`, () => assert.ok(m.r >= 3, String(m.r)));
    check(`index RP ${variante} : alerte de bienvenue à 8 px des bords (${m.bords ? m.bords.join(' et ') : '?'} px)`, () => assert.ok(m.bords && m.bords.every(x => Math.abs(x - 8) <= 1), JSON.stringify(m.bords)));
    sansErreur(m, `index RP ${variante}`);
  }
}

// ---------- chevrons : n° 9 ----------
if (on('chevrons')) {
  console.log('Bâtiments : un seul style d\'icône de repli, centrée sur la ligne du titre');
  for (const variante of DEUX) {
    const m = await mesurer(P.batiments, { variante }, p => p.evaluate(fa => {
      const chevrons = [...document.querySelectorAll('.panel-heading span.clickable, .building-section-header .clickable, .panel-heading .accordion-icon')].filter(e => e.getClientRects().length);
      return {
        chevrons: chevrons.map(e => {
          const i = e.querySelector('i') || e;
          const titre = e.closest('.panel-heading, .building-section-header').querySelector('h3, h4, .panel-title, .building-section-title') || e.parentElement;
          const bi = i.getBoundingClientRect(); const bt = titre.getBoundingClientRect();
          const g = getComputedStyle(i, '::before');
          // Le glyphe lui-même n'est pas comparé (haut ou bas selon l'état replié) ; sans Font Awesome servie, l'icône native n'a ni police ni
          // boîte (classe .fa sans feuille) : seules la taille et la couleur sont comparées
          const style = [g.fontSize, getComputedStyle(i).color].concat(fa ? [g.fontFamily.split(',')[0].replace(/["']/g, '').trim(), g.fontWeight, Math.round(bi.width), Math.round(bi.height)] : []);
          return { style: style.join(' '), ecart: Math.round(Math.abs((bi.top + bi.height / 2) - (bt.top + bt.height / 2))) };
        })
      };
    }, !!FA_DIR));
    check(`Bâtiments ${variante} : une seule icône de repli, ${FA_DIR ? 'taille, couleur, police et boîte' : 'taille et couleur (Font Awesome non servie)'} (${m.chevrons.length} chevrons, ${new Set(m.chevrons.map(c => c.style)).size} style)`, () => {
      assert.ok(m.chevrons.length >= 2, 'moins de deux chevrons');
      assert.equal(new Set(m.chevrons.map(c => c.style)).size, 1, [...new Set(m.chevrons.map(c => c.style))].join(' / '));
    });
    check(`Bâtiments ${variante} : chevrons centrés sur la ligne du titre (±3 px)`, () => vide(m.chevrons.filter(c => c.ecart > 3).map(c => `écart ${c.ecart} px`)));
  }
}

// ---------- ordre : n° 10 ----------
if (on('ordre')) {
  console.log('Modale d\'ordre Dormir : titre sans texte réduit à l\'image de l\'ordre, onglet unique masqué, « Dormir » une fois');
  const DORMIR = fs.readFileSync(path.join(FIX, 'modale-ordre', 'dormir.html'), 'utf8').replace(/^<!--[\s\S]*?-->\s*/, '');
  for (const variante of DEUX) {
    const m = await mesurer(P.ordre, { variante }, async p => {
      await waitState(p, () => !!window.bootbox && !!window.jQuery, null, { maxMs: 8000 });
      // Sur le téléphone, la modale s'ouvre au toucher d'un bouton : le focus que Bootbox donne ensuite à « Valider » suit un focus tactile.
      // Un bouton témoin inerte (ajouté par le test, sans action) reçoit ce toucher avant l'ouverture.
      await p.evaluate(() => {
        const b = document.createElement('button');
        b.type = 'button'; b.id = 'kr-temoin-toucher'; b.textContent = 'témoin';
        Object.assign(b.style, { position: 'fixed', left: '8px', bottom: '8px', width: '88px', height: '44px', zIndex: '2147483647' });
        document.body.appendChild(b);
      });
      await p.tap('#kr-temoin-toucher');
      const neutre = await p.evaluate(() => document.activeElement && document.activeElement.id === 'kr-temoin-toucher');
      await p.evaluate(([id, html]) => { window.bootbox.confirm(`<div id="${id}">${html}</div>`, () => false); }, [R.contenuOrdre, DORMIR]);
      await waitState(p, () => { const md = document.querySelector('.bootbox.modal'); return !!md && md.classList.contains('in') && getComputedStyle(md).opacity === '1'; }, null, { maxMs: 6000 });
      await p.waitForTimeout(400);
      return p.evaluate(sel => {
        const md = document.querySelector('.bootbox.modal');
        const visible = e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
        const entete = md.querySelector('.modal-header');
        const textes = [];
        const w = document.createTreeWalker(md.querySelector('.modal-content'), NodeFilter.SHOW_TEXT);
        for (let n = w.nextNode(); n; n = w.nextNode()) { if (/\bDormir\b/.test(n.textContent) && n.parentElement && visible(n.parentElement)) { textes.push(n.parentElement.tagName); } }
        const onglets = [...md.querySelectorAll(sel)].filter(visible);
        // Titre de l'ordre sans texte (image seule) : bandeau de 72 px avant la revue (fond, retraits de 12 et 16 px), réduit à l'image après
        const h3 = md.querySelector('form > h3');
        const img = h3 && h3.querySelector('img');
        const titre = h3 && !h3.textContent.trim() && img ? { h: Math.round(h3.getBoundingClientRect().height), img: Math.round(img.getBoundingClientRect().height),
          fond: window.__krContraste.rgb(getComputedStyle(h3).backgroundColor)[3] } : null;
        // « Valider » (bouton du pied qui a le focus) : aucun anneau au toucher, ni contour ni ombre en anneau
        const f = document.activeElement && document.activeElement.closest('.bootbox.modal .btn');
        const sf = f && getComputedStyle(f);
        const valider = f ? { texte: f.textContent.trim(), contour: sf.outlineStyle !== 'none' && parseFloat(sf.outlineWidth) > 0 ? `${sf.outlineStyle} ${sf.outlineWidth}` : null,
          anneau: /\b0px 0px 0px [1-9]/.test(sf.boxShadow) ? sf.boxShadow : null } : null;
        return { entete: entete && visible(entete) ? Math.round(entete.getBoundingClientRect().height) : 0, titre, onglets: onglets.map(o => o.children.length), dormir: textes.length, valider };
      }, R.onglets).then(r => ({ ...r, neutre }));
    });
    check(`Dormir ${variante} : titre sans texte réduit à l'image de l'ordre, sans bandeau (${m.titre ? `${m.titre.h} px pour une image de ${m.titre.img}` : 'absent'})`, () => {
      assert.ok(m.titre, 'titre sans texte absent');
      assert.ok(m.titre.h <= m.titre.img + 1 && m.titre.fond === 0, JSON.stringify(m.titre));
      assert.ok(m.entete <= 52, `en-tête de ${m.entete} px`);
    });
    check(`Dormir ${variante} : aucun onglet unique affiché`, () => vide(m.onglets.filter(n => n <= 1).map(n => `${n} onglet`)));
    check(`Dormir ${variante} : « Dormir » écrit une fois (${m.dormir})`, () => assert.equal(m.dormir, 1));
    check(`Dormir ${variante} : « ${m.valider ? m.valider.texte : 'Valider'} » sans anneau de focus après un toucher`, () => {
      assert.ok(m.neutre, 'bouton témoin sans le focus après le toucher');
      assert.ok(m.valider, 'aucun bouton du pied avec le focus');
      assert.ok(!m.valider.contour && !m.valider.anneau, JSON.stringify(m.valider));
    });
    sansErreur(m, `Dormir ${variante}`);
  }
}

// ---------- pied : n° 12 ----------
if (on('pied')) {
  console.log('Pied de page : ligne de version lisible (16 variantes), numéro coloré seulement si une mise à jour existe, citation courte');
  const PIED = () => {
    const C = window.__krContraste;
    const ligne = document.querySelector('.kraland-css-version');
    const num = document.querySelector('#latest-version');
    const textes = [...ligne.querySelectorAll('*')].concat(ligne).filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
    const citation = document.querySelector('footer .footer-quote');
    const cs = citation && getComputedStyle(citation);
    return {
      min: Math.min(...textes.map(e => C.texte(e))), couleurLigne: getComputedStyle(ligne).color, couleurNum: num ? getComputedStyle(num.querySelector('strong') || num).color : null,
      alerte: num ? num.classList.contains('kr-maj-disponible') : null, rNum: num ? C.texte(num.querySelector('strong') || num) : null,
      citation: citation ? Math.round((citation.getBoundingClientRect().height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)) / parseFloat(cs.lineHeight)) : null,
      h: citation ? Math.round(citation.getBoundingClientRect().height) : null
    };
  };
  const res = await mapLimit(VARIANTES, variante => mesurer(P.reception, { variante }, p => p.evaluate(PIED)));
  VARIANTES.forEach((variante, i) => {
    const m = res[i];
    check(`${variante} : ligne de version ≥ 4,5:1 (${m.min.toFixed(2)}:1), numéro à jour dans la couleur de la ligne`, () => {
      assert.ok(m.min >= 4.5, m.min.toFixed(2));
      assert.equal(m.alerte, false);
      assert.equal(m.couleurNum, m.couleurLigne);
    });
  });
  // Citation : la police manuscrite du site (Reenie Beanie, Google Fonts) n'est pas servie aux tests ; le repli Arial, plus large, ajoute des
  // lignes des deux côtés. La hauteur est donc comparée à celle du bundle de base sur la même citation : un quart de moins au moins (avec la
  // vraie police : 4 lignes et 101 px avant, 3 lignes et 71 px après, à 360, 375 et 390 px).
  const qa = await mesurer(P.reception, { script: avant }, p => p.evaluate(PIED));
  check(`citation du pied au moins un quart moins haute qu'avant (${res[0].h} px sur ${res[0].citation} lignes, au lieu de ${qa.h} px sur ${qa.citation})`, () => {
    assert.ok(Number.isFinite(res[0].h) && Number.isFinite(qa.h), `${res[0].h} / ${qa.h}`);
    assert.ok(res[0].h <= 0.75 * qa.h, `${res[0].h} / ${qa.h} px`);
  });
  const maj = await mapLimit(DEUX, variante => mesurer(P.reception, { variante, publie: '9.9.9' }, p => p.evaluate(PIED)));
  DEUX.forEach((variante, i) => check(`${variante}, mise à jour disponible : numéro en alerte, ≥ 4,5:1 (${maj[i].rNum.toFixed(2)}:1)`, () => {
    assert.equal(maj[i].alerte, true);
    assert.notEqual(maj[i].couleurNum, maj[i].couleurLigne);
    assert.ok(maj[i].rNum >= 4.5, maj[i].rNum.toFixed(2));
  }));
}

// ---------- forum : n° 13 ----------
if (on('forum')) {
  console.log('Forum : finitions du sujet, de la racine, de l\'index et de la rédaction');
  // Sans Font Awesome servie (KR_FA_DIR absent), les icônes de la barre d'un message ont une largeur nulle et la barre tiendrait sur un rang
  // même trop large : elles y reçoivent la largeur de leur glyphe (16 px à 14 px, relevée avec la vraie feuille ; mêmes largeurs de boutons).
  const ICONES = FA_DIR ? null : html => html.replace('</head>', `<style>ul.media-list.forum > li.media > .media-body > .pull-right i[class*="fa-"] { ${R.glypheSansFa} }</style>\n</head>`);
  for (const variante of DEUX) {
    const s = await mesurer(P.sujet, { variante, transformer: ICONES }, p => p.evaluate(() => {
      const C = window.__krContraste;
      const top = document.querySelector('.forum-top');
      const spans = [...top.children].filter(e => e.tagName === 'SPAN' && !e.classList.contains('pull-right') && e.textContent.trim());
      const ecart = spans.length >= 2 ? Math.round(spans[1].getBoundingClientRect().left - spans[0].getBoundingClientRect().right) : null;
      const barres = [...document.querySelectorAll('ul.media-list.forum > li.media > .media-body > .pull-right')].filter(e => e.getClientRects().length).map(b => {
        const boutons = [...b.querySelectorAll('.btn')].filter(e => e.getClientRects().length);
        return new Set(boutons.map(e => Math.round(e.getBoundingClientRect().top))).size;
      });
      const h1 = document.querySelector('#col-right > h1.page-header');
      const filet = C.rgb(getComputedStyle(h1).borderBottomColor);
      const fond = C.fond(h1.parentElement);
      const a = filet[3];
      return { ecart, barres, filet: C.rapport([0, 1, 2].map(k => filet[k] * a + fond[k] * (1 - a)), fond) };
    }));
    const tag = `sujet ${variante}`;
    check(`${tag} : « Par Nerys » séparé de l'icône des messages (${s.ecart} px, 8 au moins)`, () => assert.ok(s.ecart >= 8, String(s.ecart)));
    check(`${tag} : barre d'actions de chaque message sur un rang (${s.barres.length} messages)`, () => { assert.ok(s.barres.length > 0); vide(s.barres.filter(n => n > 1).map(n => `${n} rangs`)); });
    if (variante.endsWith('-dark')) { check(`${tag} : filet du titre discret (${s.filet.toFixed(2)}:1 sur le fond, 3:1 au plus)`, () => assert.ok(s.filet <= 3, s.filet.toFixed(2))); }
    sansErreur(s, tag);
  }
  const r = await mesurer(P.racine, {}, p => p.evaluate(titre => {
    const t = document.querySelector(`#col-right > h1.page-header ${titre}`) || document.querySelector('#col-right > h1.page-header');
    const s = getComputedStyle(t);
    return { taille: s.fontSize, graisse: Number(s.fontWeight) };
  }, R.titreForum));
  check(`racine : titre « Forum » en 24 px gras (${r.taille}, ${r.graisse})`, () => assert.ok(r.taille === '24px' && r.graisse >= 700, JSON.stringify(r)));
  const ix = await mesurer(P.indexRp, {}, p => p.evaluate(sel => {
    const titre = (document.querySelector(`#col-right > h1.page-header ${sel}`) || {}).textContent;
    const entetes = [...document.querySelectorAll('#col-right > .panel > .panel-heading')].map(h => ({ texte: h.textContent.replace(/\s+/g, ' ').trim(), visible: h.getClientRects().length > 0,
      corps: !!h.parentElement.querySelector(':scope > .panel-body') && h.parentElement.querySelector(':scope > .panel-body').getClientRects().length > 0 }));
    return { titre: (titre || '').trim(), entetes };
  }, R.titreForum));
  check(`index RP : en-tête de carte qui répète « ${ix.titre} » masqué, lignes visibles`, () => {
    const rep = ix.entetes.filter(e => e.texte.toLowerCase() === ix.titre.toLowerCase());
    assert.ok(rep.length > 0, JSON.stringify(ix.entetes));
    vide(rep.filter(e => e.visible || !e.corps).map(e => JSON.stringify(e)));
  });
  const red = await mesurer(P.forumNouveau, {}, p => p.evaluate(sel => {
    const libelles = [...document.querySelectorAll(`#col-right label, #col-right ${sel}`)].filter(e => e.getClientRects().length && /exp[ée]diteur/i.test(e.textContent));
    return { transformes: libelles.map(e => getComputedStyle(e).textTransform), n: libelles.length };
  }, R.libelle));
  check(`nouveau sujet : « Expéditeur » sans capitales forcées, comme « Sujet » (${red.n})`, () => { assert.ok(red.n > 0, 'libellé absent'); vide(red.transformes.filter(t => t === 'uppercase')); });
  // Rédaction : bouton de retour centré sur la ligne du titre, au-dessus de son filet (il débordait dessous), icône séparée du mot ; zone de
  // saisie dans la police du site (chasse fixe avant), forum et kramail
  const RETOUR_TITRE = () => {
    const h1 = document.querySelector('#col-right > h1.page-header');
    const b = h1 && h1.querySelector('.pull-right > a.btn');
    if (!b) { return { b: null }; }
    const texte = [...h1.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    const rg = document.createRange(); rg.selectNodeContents(texte);
    const t = rg.getBoundingClientRect(); const rb = b.getBoundingClientRect();
    const i = b.querySelector(':scope > i');
    let mot = null;
    const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n && mot === null; n = w.nextNode()) { const k = n.data.search(/\S/); if (k >= 0) { const m = document.createRange(); m.setStart(n, k); m.setEnd(n, k + 1); mot = m.getBoundingClientRect().left; } }
    return { b: true, centre: Math.round((rb.top + rb.height / 2) - (t.top + t.height / 2)), sous: Math.round(rb.bottom - (h1.getBoundingClientRect().bottom - parseFloat(getComputedStyle(h1).borderBottomWidth))),
      ecart: i && mot !== null ? Math.round(mot - i.getBoundingClientRect().right) : null };
  };
  const POLICE = () => [...document.querySelectorAll('textarea')].filter(e => e.getClientRects().length).map(e => ({ nom: e.name || e.id, police: getComputedStyle(e).fontFamily, site: getComputedStyle(document.body).fontFamily }));
  const [rf, pk] = await Promise.all([
    mesurer(P.forumRepondre, {}, async p => ({ retour: await p.evaluate(RETOUR_TITRE), police: await p.evaluate(POLICE) })),
    mesurer(P.nouveau, {}, async p => ({ police: await p.evaluate(POLICE) }))
  ]);
  check(`réponse du forum : retour centré sur la ligne du titre (écart ${rf.retour.centre} px), au-dessus du filet, icône séparée du mot (${rf.retour.ecart} px)`, () => {
    assert.ok(rf.retour.b, 'bouton de retour absent');
    assert.ok(Math.abs(rf.retour.centre) <= 2 && rf.retour.sous <= 0 && rf.retour.ecart >= 4, JSON.stringify(rf.retour));
  });
  for (const [nom, m] of [['réponse du forum', rf], ['kramail', pk]]) {
    check(`${nom} : zone de saisie dans la police du site, sans chasse fixe (${m.police.map(x => x.police.split(',')[0]).join(', ')})`, () => {
      assert.ok(m.police.length > 0, 'aucune zone de saisie');
      vide(m.police.filter(x => x.police !== x.site || /monospace/i.test(x.police)).map(x => `${x.nom} ${x.police}`));
    });
    sansErreur(m, `${nom}, rédaction`);
  }
  // Sujet fermé : « Nouveau sujet », seule action, à sa largeur en haut comme en bas (en bas, il s'étirait sur toute la barre)
  const sf = await mesurer(P.sujetFerme, {}, p => p.evaluate(() => [...document.querySelectorAll('.forum-thread-actions')].filter(b => b.getClientRects().length).map(b => {
    const actions = [...b.children].filter(a => a.getClientRects().length && a.tagName === 'A');
    return { barre: Math.round(b.getBoundingClientRect().width), actions: actions.map(a => Math.round(a.getBoundingClientRect().width)) };
  })).then(barres => ({ barres })));
  check(`sujet fermé : « Nouveau sujet » à sa largeur en haut comme en bas (${sf.barres.map(b => `${b.actions.join('+')} sur ${b.barre}`).join(', ')} px)`, () => {
    assert.ok(sf.barres.length === 2 && sf.barres.every(b => b.actions.length === 1), JSON.stringify(sf.barres));
    const [haut, bas] = sf.barres.map(b => b.actions[0]);
    assert.ok(haut === bas && sf.barres.every(b => b.actions[0] < b.barre - 1), JSON.stringify(sf.barres));
  });
  sansErreur(sf, 'sujet fermé');
}

// ---------- mini-profil : n° 14 ----------
if (on('mini-profil')) {
  console.log('Mini-profil du plateau : icônes Font Awesome, jauges de 6 px utiles au moins, libellés de 13 px, jauges une fois déplié');
  const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{23F0}-\u{23FF}]/u;
  for (const variante of DEUX) {
    const m = await mesurer(P.jauges, { variante }, async p => {
      const replie = await p.evaluate(src => {
        const mp = document.querySelector('.mobile-mini-profile');
        const barres = [...mp.querySelectorAll('.mobile-gauge-compact-bar')].filter(e => e.getClientRects().length);
        const libelles = [...mp.querySelectorAll('.mobile-gauge-compact *')].filter(e => e.getClientRects().length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
        const roue = mp.querySelector('.mobile-mini-profile-manage-btn');
        return { emoji: new RegExp(src, 'u').test(mp.textContent), roue: !!mp.querySelector('.mobile-mini-profile-manage-btn i.fa-cog'), horloge: !!mp.querySelector('.mobile-mini-profile-clock i.fa-clock'),
          nom: roue ? roue.getAttribute('aria-label') : null,
          barres: barres.map(e => e.clientHeight), tailles: [...new Set(libelles.map(e => parseFloat(getComputedStyle(e).fontSize)))] };
      }, EMOJI.source);
      // Section Plateau : actions rapides sans l'ombre rosée des boutons pleins, libellés en 13 px ; onglet Agir, jauges PV, PM et PP aux
      // couleurs de celles du mini-profil, anneau du minuteur dans la palette d'états du thème (--kr-pv-1 à 4)
      const plateau = await p.evaluate(() => {
        const actions = [...document.querySelectorAll('.mobile-quick-action.btn')].filter(b => b.getClientRects().length).map(b => {
          const l = b.querySelector('.mobile-quick-action-label');
          return { ombre: getComputedStyle(b).boxShadow, taille: l ? parseFloat(getComputedStyle(l).fontSize) : null };
        });
        const remplissage = g => { const f = g && g.querySelector('.mobile-gauge-compact-bar > *'); return f ? getComputedStyle(f).backgroundColor : null; };
        const compactes = [...document.querySelectorAll('.mobile-gauge-compact')].map(remplissage);
        const agir = ['alert141', 'alert142', 'alert143'].map(k => {
          const c = document.querySelector(`#player-vitals-section .col-sm-4:has(.${k}) + .col-sm-8 .progress > .progress-bar:first-child`);
          return c ? getComputedStyle(c).backgroundColor : null;
        });
        const minuteur = document.querySelector('.c100');
        const palier = minuteur && minuteur.getAttribute('data-kr-clock');
        const jeton = { excellent: 1, bon: 1, moyen: 2, attention: 3, critique: 4 }[palier];
        const racine = getComputedStyle(document.documentElement);
        return { actions, compactes, agir, palier, anneau: minuteur ? getComputedStyle(minuteur).getPropertyValue('--clock-color').trim() : null,
          attendu: jeton ? racine.getPropertyValue(`--kr-pv-${jeton}`).trim() : null };
      });
      await p.evaluate(() => document.querySelector('.mobile-mini-profile-header').click());
      await p.waitForTimeout(500);
      const deplie = await p.evaluate(() => {
        const mp = document.querySelector('.mobile-mini-profile');
        const vis = s => [...mp.querySelectorAll(s)].some(e => e.getClientRects().length && getComputedStyle(e).display !== 'none');
        return { compactes: vis('.mobile-mini-profile-gauges-compact'), completes: vis('.mobile-mini-profile-gauges-full > *') || vis('#player-vitals-section') };
      });
      return { replie, deplie, plateau };
    });
    const tag = `mini-profil ${variante}`;
    check(`${tag} : roue dentée et horloge en icônes Font Awesome, aucun émoji`, () => assert.ok(!m.replie.emoji && m.replie.roue && m.replie.horloge, JSON.stringify(m.replie)));
    check(`${tag} : jauges compactes de 6 px utiles au moins, filet exclu (${m.replie.barres.join(', ')})`, () => { assert.ok(m.replie.barres.length >= 2); vide(m.replie.barres.filter(h => h < 6)); });
    check(`${tag} : libellés et valeurs des jauges en 13 px au moins (${m.replie.tailles.join(', ')})`, () => { assert.ok(m.replie.tailles.length > 0); vide(m.replie.tailles.filter(t => t < 13)); });
    check(`${tag} : déplié, jauges affichées une seule fois`, () => assert.ok(!(m.deplie.compactes && m.deplie.completes), JSON.stringify(m.deplie)));
    check(`${tag} : roue dentée nommée « Gestion du personnage » (aria-label, l'icône étant masquée)`, () => assert.equal(m.replie.nom, 'Gestion du personnage'));
    const pl = m.plateau;
    check(`plateau ${variante} : actions rapides sans ombre, libellés en 13 px au moins (${pl.actions.map(a => a.taille).join(', ')})`, () => {
      assert.ok(pl.actions.length > 0, 'aucune action rapide');
      vide(pl.actions.filter(a => a.ombre !== 'none' || !(a.taille >= 13)).map(a => JSON.stringify(a)));
    });
    check(`plateau ${variante} : onglet Agir, jauges PV, PM et PP aux couleurs du mini-profil (${pl.agir.join(' ; ')})`, () => {
      assert.ok(pl.agir.every(Boolean) && pl.compactes.length >= 3, JSON.stringify(pl));
      assert.deepEqual(pl.agir, pl.compactes.slice(0, 3));
    });
    check(`plateau ${variante} : anneau du minuteur dans la palette d'états du thème (${pl.palier} : ${pl.anneau})`, () => {
      assert.ok(pl.attendu, `palier ${pl.palier}`);
      assert.equal(pl.anneau.toLowerCase(), pl.attendu.toLowerCase());
    });
    sansErreur(m, tag);
  }
}

// ---------- palette : n° 15 ----------
if (on('palette')) {
  console.log('Bouton palette jamais dans la barre du haut (réinséré par l\'observateur après la construction de la barre mobile)');
  for (const [nom, page] of [['contacts', P.contacts], ['réception du kramail', P.reception]]) {
    const m = await mesurer(page, {}, async p => {
      const barre = await p.evaluate(() => !!document.querySelector('.navbar-header-buttons-left'));
      // Le bouton est retiré puis une mutation relance l'observateur (insertion différée, comme au chargement lent)
      await p.evaluate(() => { const b = document.getElementById('kr-toggle-css-btn'); if (b) { b.closest('li').remove(); } document.body.appendChild(document.createElement('i')); });
      await waitState(p, () => !!document.getElementById('kr-toggle-css-btn'), null, { maxMs: 4000 });
      return p.evaluate(b => {
        const btn = document.getElementById('kr-toggle-css-btn');
        return { barre: b, present: !!btn, dansBarre: !!btn && !!btn.closest('.navbar-header-buttons-left'), icones: document.querySelectorAll('.navbar-header-buttons-left > li').length };
      }, barre);
    });
    check(`${nom} : bouton palette réinséré hors de la barre du haut (${m.icones} icônes dans la barre)`, () => assert.ok(m.barre && m.present && !m.dansBarre, JSON.stringify(m)));
    sansErreur(m, nom);
  }
}

// ---------- contrastes : tableau des contrastes ----------
if (on('contrastes')) {
  console.log('Contrastes : couleurs natives des rapports, texte discret, auteur de citation à 4,5:1 au moins');
  const TEXTES = sel => [...document.querySelectorAll(sel)].filter(e => e.getClientRects().length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
    .map(e => ({ t: e.textContent.trim().slice(0, 24), r: window.__krContraste.texte(e) }));
  const CAS = [
    ['notifications, couleurs natives', P.report, 'table font[color]'],
    ['notifications, texte discret', P.report, 'table .text-muted, table small'],
    ['accueil, texte discret', P.accueil, '.text-muted, .genmsg'],
    ['aide, auteur de citation', P.aide, 'blockquote footer, blockquote small']
  ];
  const cas = DEUX.flatMap(v => CAS.map(c => ({ v, c })));
  const res = await mapLimit(cas, x => mesurer(x.c[1], { variante: x.v }, p => p.evaluate(TEXTES, x.c[2]).then(textes => ({ textes }))));
  cas.forEach((x, i) => check(`${x.c[0]} ${x.v} : ≥ 4,5:1 (${res[i].textes.length} textes)`, () => {
    assert.ok(res[i].textes.length > 0, 'aucun texte');
    vide(res[i].textes.filter(t => t.r < 4.5).map(t => `${t.t} ${t.r.toFixed(2)}:1`));
  }));
}

// ---------- secondaires : pages secondaires ----------
if (on('secondaires')) {
  console.log('Pages secondaires : alignement, tableaux, dates, recherche, crayons, bloc préformaté');
  const j = await mesurer(P.regles, {}, p => p.evaluate(() => [...document.querySelectorAll('.justify')].filter(e => e.getClientRects().length).map(e => getComputedStyle(e).textAlign)).then(a => ({ a })));
  check(`Règles : texte aligné à gauche, sans justification (${j.a.length})`, () => { assert.ok(j.a.length > 0, 'aucun .justify'); vide(j.a.filter(t => t === 'justify')); });
  // Largeur des lignes, pas de la boîte du tableau : en bloc défilant (display: block), la boîte prend toute la largeur et les lignes restent
  // resserrées sur leur contenu
  const o = await mesurer(P.organisations, {}, p => p.evaluate(() => {
    const t = document.querySelector('#col-right table');
    const parent = t.parentElement; const s = getComputedStyle(parent);
    return { t: Math.round((t.querySelector('tr') || t).getBoundingClientRect().width), place: Math.round(parent.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)) };
  }));
  check(`Organisations : lignes du tableau sur toute la largeur de sa carte (${o.t} / ${o.place} px)`, () => assert.ok(o.t >= o.place - 1, `${o.t} / ${o.place}`));
  // Page de jeu (Citoyenneté et Maladies de /jouer/perso) : tableaux sur toute la largeur de leur carte (107 et 117 px sur 344 avant), colonne
  // d'icônes à sa largeur (icône et retraits) au lieu d'une part de la place en trop
  const jeu = await mesurer(P.perso, {}, p => p.evaluate(() => [...document.querySelectorAll('#col-right .panel > table')].filter(t => t.getClientRects().length).map(t => {
    const parent = t.parentElement; const s = getComputedStyle(parent);
    const ligne = t.querySelector('tr');
    // Colonne d'icônes : la plus large de ses icônes (drapeau, maison, carte d'identité) et ses retraits
    const cellules = ligne.cells.length > 1 ? [...t.rows].map(r => r.cells[0]).filter(c => c && c.querySelector('i')) : [];
    const utile = c => { const sc = getComputedStyle(c); return c.querySelector('i').getBoundingClientRect().width + parseFloat(sc.paddingLeft) + parseFloat(sc.paddingRight); };
    return { titre: t.closest('.panel').querySelector('.panel-title').textContent.trim(), ligne: Math.round(ligne.getBoundingClientRect().width),
      place: Math.round(parent.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)),
      icone: cellules.length ? { w: Math.round(cellules[0].getBoundingClientRect().width), utile: Math.round(Math.max(...cellules.map(utile))) } : null };
  })).then(t => ({ t })));
  check(`page de jeu : tableaux sur toute la largeur de leur carte (${jeu.t.map(x => `${x.titre} ${x.ligne} / ${x.place}`).join(', ')} px), colonne d'icônes à sa largeur`, () => {
    assert.ok(jeu.t.length >= 2 && jeu.t.some(x => x.icone), JSON.stringify(jeu.t));
    vide(jeu.t.filter(x => x.ligne < x.place - 1).map(x => `${x.titre} ${x.ligne} / ${x.place} px`));
    vide(jeu.t.filter(x => x.icone && x.icone.w > x.icone.utile + 1).map(x => `${x.titre} : icône dans ${x.icone.w} px (${x.icone.utile} utiles)`));
  });
  sansErreur(jeu, 'page de jeu');
  // Rotation du téléphone (mobile des deux côtés ; Mobile:Tableaux revu au changement de taille). Nom sans coupure : le tableau défile à
  // 360 px et tient à 740 px.
  // - Paysage puis portrait : chargé à 740 px (pleine largeur), il redevient défilant à 360 px ; sans nouvel examen, il restait en tableau
  //   de 561 px dans une carte de 312 px et la page défilait de 225 px.
  // - Portrait puis paysage : il reprend toute la largeur à 740 px. Loupes remplacées par du texte : la colonne d'icônes (kr-colonne-icone,
  //   largeur de 1 %) étire déjà les lignes d'un tableau en bloc, et le contrôle passerait sans le nouvel examen.
  const NOM_LONG = html => {
    if (!html.includes('<td>Orga 1</td>')) { throw new Error('Organisations : cellule « Orga 1 » introuvable'); }
    return html.replace('<td>Orga 1</td>', '<td style="white-space: nowrap">Organisation de la fixture au nom très long sans coupure</td>');
  };
  const SANS_ICONE = html => {
    if (!html.includes('<i class="fa fa-search"></i>')) { throw new Error('Organisations : loupe introuvable'); }
    return html.replaceAll('<i class="fa fa-search"></i>', 'Voir');
  };
  const LIGNE = () => {
    const t = document.querySelector('#col-right table');
    const parent = t.parentElement; const s = getComputedStyle(parent);
    return { ligne: Math.round(t.querySelector('tr').getBoundingClientRect().width), place: Math.round(parent.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)),
      defile: t.scrollWidth > t.clientWidth + 1, page: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  };
  const tourner = async (p, width, height) => { await p.setViewportSize({ width, height }); await p.waitForTimeout(500); await frames(p); return p.evaluate(LIGNE); };
  const versPortrait = await mesurer(P.organisations, { width: 740, height: 360, transformer: NOM_LONG }, async p => ({ debut: await p.evaluate(LIGNE), apres: await tourner(p, 360, 800) }));
  check(`Organisations, rotation paysage puis portrait : tableau pleine largeur à 740 px (${versPortrait.debut.ligne} / ${versPortrait.debut.place} px), de nouveau défilant à 360 px, page sans défilement horizontal (${versPortrait.apres.page} px)`, () => {
    assert.ok(versPortrait.debut.ligne >= versPortrait.debut.place - 1 && !versPortrait.debut.defile, `à 740 px : ${JSON.stringify(versPortrait.debut)}`);
    assert.ok(versPortrait.apres.defile && versPortrait.apres.page <= 0, `à 360 px : ${JSON.stringify(versPortrait.apres)}`);
  });
  sansErreur(versPortrait, 'Organisations, paysage puis portrait');
  const versPaysage = await mesurer(P.organisations, { transformer: html => SANS_ICONE(NOM_LONG(html)) }, async p => ({ debut: await p.evaluate(LIGNE), apres: await tourner(p, 740, 360) }));
  check(`Organisations, rotation portrait puis paysage : tableau défilant à 360 px (${versPaysage.debut.ligne} px), sur toute la largeur à 740 px (${versPaysage.apres.ligne} / ${versPaysage.apres.place} px)`, () => {
    assert.ok(versPaysage.debut.defile && versPaysage.debut.page <= 0, `à 360 px : ${JSON.stringify(versPaysage.debut)}`);
    assert.ok(versPaysage.apres.ligne >= versPaysage.apres.place - 1 && versPaysage.apres.page <= 0, `à 740 px : ${JSON.stringify(versPaysage.apres)}`);
  });
  sansErreur(versPaysage, 'Organisations, portrait puis paysage');
  // Garde-fou (déjà vrai avant) : la coupure à tout caractère des cellules ne touche pas aux en-têtes (Niveau et Salaire des Bâtiments du
  // Cybermonde passaient sur deux lignes)
  const cy = await mesurer(P.cybermonde, {}, p => p.evaluate(() => {
    const coupes = [];
    const entetes = [...document.querySelectorAll('#col-right table th')].filter(t => t.getClientRects().length && t.textContent.trim());
    for (const th of entetes) {
      const w = document.createTreeWalker(th, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        for (const m of n.data.matchAll(/\S+/g)) {
          const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          if (new Set([...rg.getClientRects()].filter(r => r.width > 0).map(r => Math.round(r.top))).size > 1) { coupes.push(m[0]); }
        }
      }
    }
    return { n: entetes.length, coupes };
  }));
  check(`Cybermonde (garde-fou) : mots des en-têtes de tableau entiers (${cy.n} en-têtes)`, () => { assert.ok(cy.n > 0, 'aucun en-tête'); vide(cy.coupes); });
  sansErreur(cy, 'Cybermonde');
  const e = await mesurer(P.evenements, {}, p => p.evaluate(() => {
    const t = document.querySelector('#col-right table');
    const dates = [...t.querySelectorAll('tbody tr > :first-child')].map(c => {
      const rg = document.createRange(); rg.selectNodeContents(c);
      return { texte: c.textContent.trim(), lignes: rg.getClientRects().length };
    });
    return { dates, deborde: t.scrollWidth > t.clientWidth + 1 || document.documentElement.scrollWidth > document.documentElement.clientWidth };
  }));
  check(`Événements : dates sur une ligne (${e.dates.length}), aucun défilement horizontal`, () => {
    assert.ok(e.dates.length > 0);
    vide(e.dates.filter(d => d.lignes > 1).map(d => `${d.texte} ${d.lignes} lignes`));
    assert.equal(e.deborde, false);
  });
  const r = await mesurer(P.recherche, {}, p => p.evaluate(() => {
    const f = document.querySelector('form[name="recherche"]');
    const i = f.querySelector('input.form-control').getBoundingClientRect(); const b = f.querySelector('button.btn').getBoundingClientRect();
    return { memeRang: Math.abs(i.top - b.top) <= 1, accole: Math.round(b.left - i.right) };
  }));
  check(`Règles, recherche : « ok » accolé au champ (même rang, écart ${r.accole} px)`, () => assert.ok(r.memeRang && Math.abs(r.accole) <= 1, JSON.stringify(r)));
  const c = await mesurer(P.membres, {}, p => p.evaluate(() => ['ajax-name1', 'ajax-sex1', 'ajax-city1', 'ajax-birth1'].map(id => {
    const el = document.getElementById(id);
    const crayon = el.querySelector('span.btn-group-xs');
    const rg = document.createRange();
    const texte = [...el.childNodes].find(n => (n.nodeType === 3 && n.textContent.trim()) || (n.nodeType === 1 && n.tagName === 'STRONG'));
    rg.selectNodeContents(texte);
    return { id, apres: crayon.getBoundingClientRect().left >= rg.getBoundingClientRect().right - 1 };
  })).then(l => ({ l })));
  check('Compte : crayons après leur libellé (bord gauche régulier)', () => vide(c.l.filter(x => !x.apres).map(x => x.id)));
  const a = await mesurer(P.aideFenetre, { variante: 'empire-brun-dark' }, p => p.evaluate(() => {
    const pre = document.querySelector('pre');
    if (!pre) { return { fond: null }; }
    const f = window.__krContraste.fond(pre);
    return { fond: f, r: window.__krContraste.texte(pre) };
  }));
  check(`Fenêtre d'aide en sombre : bloc préformaté sur fond sombre, texte lisible (${a.r ? a.r.toFixed(2) + ':1' : '?'})`, () => {
    assert.ok(a.fond, 'aucun bloc préformaté');
    assert.ok(a.fond.reduce((x, y) => x + y, 0) / 3 < 100 && a.r >= 4.5, JSON.stringify(a));
  });
}

await browser.close();
console.log(failures ? `\n${failures} vérification(s) en échec` : '\nToutes les vérifications passent');
process.exit(failures ? 1 : 0);
