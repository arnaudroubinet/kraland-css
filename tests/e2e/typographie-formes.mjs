// Typographie et formes (épopée 4, ticket 1, balle traçante) : jetons d'échelle sur :root, étiquettes et pastilles en 12 px gras (H8.2).
// Une vérification par ligne de la matrice du plan (story-jetons-d-echelle-etiquettes-et-pastilles-en-12-px-gras) :
//   jetons          --kr-font-*, --kr-radius-sm/-md/-full, --kr-space-1 à -6, --kr-margin-mobile, --kr-touch-target(-dpad) calculés sur
//                   :root égaux à DESIGN.md (frontmatter : typography, rounded, spacing ; 1 rem = 10 px), Kraland clair et Empire Brun
//                   sombre, 375 et 1280 px ; --kr-radius inchangé ;
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
//                   masque miroir ECHELLE_TICKET47 sur le bundle de base (COMMIT_ECHELLE_FORUM) égal au bundle d'après, 375, 768, 1280 px.
// Hauteurs du sous-forum avec la pastille à 12 px : sous-forum.mjs (checkNewmsg). Hors de ces tickets : rayons (4.8), espacement (4.9).
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
//           KR_FRAG = jetons, mobile, bureau, mini-profil, bascule, boutons, boutons-bascule, compact, echelle, echelle-forum (vide = tout).
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
import { AVANT_TICKET45, AVANT_TICKET47, ECHELLE_TICKET45, ECHELLE_TICKET47, LEGENDES_TICKET45, LIGNE_OBJET_TICKET6, SECONDAIRE_TICKET6, choisirVariante, poserJetonsRedefinis } from './lib/variantes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const userscript = sansEntete(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_AVANT = 'd68ab55';
const avant = sansEntete(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_AVANT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const COMMIT_BOUTONS = '4d97496';
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
  '--kr-margin-mobile': '16px', '--kr-touch-target': '44px', '--kr-touch-target-dpad': '48px', '--kr-button-height': '34px',
  '--kr-radius': '.5rem'
};
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

async function ouvrir({ nom, width, height = 720, variante, script, label13 = false, css = '', tactile = width < 768, def: defBoutons, toucher = tactile }) {
  const def = defBoutons || (nom === 'mini-profil' ? MINI_PROFIL : PAGES[nom]);
  const mobile = tactile;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: toucher, deviceScaleFactor: 1 });
  await confineNetwork(context); // refus global EN PREMIER, routes des fixtures ensuite
  await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (u.href.split('#')[0] === def.url) { return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: def.html }); }
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
  await context.addInitScript(({ src, gmErreur }) => {
    // gmErreur (Interface) : GM.xmlHttpRequest répond par une erreur, le changelog est chargé à vide et « Voir l'historique » est posé.
    window.GM = { xmlHttpRequest: o => { if (gmErreur && o && typeof o.onerror === 'function') { setTimeout(() => o.onerror({}), 0); } } };
    // Soumission neutralisée (aucun envoi, même depuis une fixture).
    window.addEventListener('submit', e => e.preventDefault(), true);
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { src: script, gmErreur: Boolean(def.gmErreur) });
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

async function relever(opts) {
  const { context, page, erreurs, kd } = await ouvrir(opts);
  const def = PAGES[opts.nom];
  const mobile = opts.width < 768;
  const attendus = def.elements.filter(([, , m]) => mobile || !m);
  let res;
  if (def.kramail) { res = kd; } else { res = await page.evaluate(MESURE, attendus.map(([k, s]) => [k, s])); }
  const jetons = await page.evaluate(noms => Object.fromEntries(noms.map(n => [n, getComputedStyle(document.documentElement).getPropertyValue(n).trim()])), Object.keys(JETONS));
  await context.close();
  return { mesures: Object.fromEntries(res), attendus: attendus.map(([k]) => k), jetons, erreurs };
}

const etiquette = o => `${o.nom} ${o.variante} ${o.width} px`;

if (on('jetons')) {
  console.log('\n== jetons ==');
  const cas = VARIANTES.flatMap(variante => [375, 1280].map(width => ({ nom: 'plateau', variante, width })));
  const res = await mapLimit(cas, async c => ({ c, r: await relever({ ...c, script: userscript }), r13: await relever({ ...c, script: userscript, label13: true }) }));
  for (const { c, r, r13 } of res) {
    check(`${etiquette(c)} : jetons de :root égaux à DESIGN.md`, () => assert.deepEqual(r.jetons, JETONS, JSON.stringify(r.jetons)));
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
  const res = await mapLimit(cas, async c => ({ c, r: await relever({ ...c, script: userscript }), a: await relever({ ...c, script: avant }) }));
  for (const { c, r, a } of res) {
    check(`${etiquette(c)} : étiquettes et pastilles présentes, 12 px gras`, () => {
      const vides = r.attendus.filter(k => !(r.mesures[k] || []).length);
      assert.deepEqual(vides, [], `éléments absents : ${vides.join(', ')}`);
      const hors = Object.entries(r.mesures).flatMap(([k, l]) => l.filter(m => m.taille !== '12px' || m.graisse !== '700').map(m => `${k} « ${m.texte} » ${m.taille}/${m.graisse}`));
      assert.deepEqual(hors, [], hors.join(' ; '));
    });
    check(`${etiquette(c)} : couleur, fond et bordures égaux au bundle de base`, () => {
      const ecarts = [];
      for (const [k, l] of Object.entries(r.mesures)) {
        const b = a.mesures[k] || [];
        if (b.length !== l.length) { ecarts.push(`${k} : ${l.length} élément(s) contre ${b.length}`); continue; }
        l.forEach((m, i) => ['couleur', 'fond', 'bordure'].forEach(p => { if (m[p] !== b[i][p]) { ecarts.push(`${k} « ${m.texte} » ${p} ${m[p]} au lieu de ${b[i][p]}`); } }));
      }
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
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
  const baseBoutons = nom => (PAGES_BOUTONS[nom].base === 'modales' ? avantModales : avantBoutons);
  const masqueBoutons = nom => (PAGES_BOUTONS[nom].exclus.length && AVANT_TICKET45(baseBoutons(nom)) ? LEGENDES_TICKET45 : '');
  for (const nom of Object.keys(PAGES_BOUTONS).filter(masqueBoutons)) { console.log(`  info écart accepté et consigné : ${nom}, légendes des compétences en 12 px (plancher PLT-QU, épopée 4, ticket 5) posées sur le bundle de base`); }
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
      check(`compact ${etiquette(c)} ${k} : ${cible ? '12 px, rayon 4 px aux coins arrondis, hauteur et couleurs de la base' : 'égal au bundle de base'}`, () => {
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
            if (JSON.stringify(m.rayons) !== JSON.stringify(o.rayons)) { d('rayons'); }
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
const COMMIT_ECHELLE = 'fe77411';
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

  // Masque miroir ECHELLE_TICKET45 (lib/variantes.mjs) : posé sur le bundle de base, il rend les titres comme le bundle d'après, sans
  // toucher ce que le bundle laisse inchangé (titre d'accordéon .panel-group .panel-title, titre de modale). Éléments mesurés même masqués
  // (taille et graisse calculées). Matériel : titres d'en-tête, d'accordéon et de modale seulement (le reste relève des pages de jeu).
  const MESURE_MIROIR = sel => [...document.querySelectorAll(sel)].map(e => { const st = getComputedStyle(e); return `${e.tagName}.${e.className} « ${(e.textContent || '').trim().slice(0, 20)} » ${st.fontSize}/${st.fontWeight}`; });
  const SEL_MIROIR = { materiel: '.panel-heading > *, .panel-group .panel-title, .modal-title', autre: 'h1, h2, h3, h4, h5, h6, .panel-title, .modal-title, .xmini, footer a' };
  const casMiroir = ['materiel', 'sous-forum', 'kramail'].flatMap(nom => VARIANTES.flatMap(variante => [375, 767, 768, 1280].map(width => ({ nom, variante, width }))));
  const releverMiroir = async (c, script, css) => {
    const { context, page } = await ouvrir({ nom: c.nom, width: c.width, height: c.width < 768 ? 667 : 900, variante: c.variante, script, def: PAGES_ECHELLE[c.nom], css });
    const l = await page.evaluate(MESURE_MIROIR, SEL_MIROIR[c.nom === 'materiel' ? 'materiel' : 'autre']);
    await context.close();
    return l;
  };
  const resMiroir = await mapLimit(casMiroir, async c => ({ c, apres: await releverMiroir(c, userscript), masque: await releverMiroir(c, avantEchelle, ECHELLE_TICKET45) }));
  for (const { c, apres, masque } of resMiroir) {
    check(`echelle ${etiquette(c)} : masque ECHELLE_TICKET45 sur le bundle de base = bundle d'après (titres, accordéon, modale)`, () => {
      assert.ok(apres.length > 0, 'aucun titre mesuré');
      if (c.nom === 'materiel') { assert.ok(apres.some(x => /Accordéon/.test(x)) && apres.some(x => /Modale/.test(x)), 'accordéon ou modale absent'); }
      const ecarts = apres.map((x, i) => (x === masque[i] ? null : `${masque[i]} au lieu de ${x}`)).filter(Boolean);
      assert.equal(masque.length, apres.length, 'nombre d\'éléments');
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
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
const COMMIT_ECHELLE_FORUM = 'd953969';
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
    ['expéditeur', '#topics tbody td:nth-child(3)', '13px', null, 'm'],
    ['date', '#topics tbody td:nth-child(4)', '13px', null, 'm']
  ],
  lecture: [
    ['expéditeur', '.kramail-msg-sender', '15px', null, 'm'],
    ['date', '.kramail-msg-date', '13px', null, 'm'],
    ['corps', '.kramail-msg-body', '15px', null, 'm']
  ],
  // Nouveau kramail : 6e colonne = état du panneau des destinataires (ETAPES_KD) où le rôle est mesuré.
  nouveau: [
    ['aide du champ Destinataires', '.kd-help', '14px', null, 'b', 'repos'],
    ['aide du champ Destinataires', '.kd-help', '15px', null, 'm', 'repos'],
    ['libellé Destinataires', '.kd-row > .kd-label', '13px', null, 'b', 'repos'],
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

  // Masque miroir ECHELLE_TICKET47 (lib/variantes.mjs) : posé sur le bundle de base, il rend chaque texte de #col-right à la taille du
  // bundle d'après. Pages comparées hors périmètre par forum-index.mjs (sous-forum, sujet, Staff) et kramail-redaction.mjs (réception,
  // lecture), plus l'index et le nouveau kramail.
  const MESURE_TAILLES = () => [...document.querySelectorAll('#col-right, #col-right *')].map(e => { const st = getComputedStyle(e); return `${e.tagName}.${typeof e.className === 'string' ? e.className : ''} ${st.fontSize}`; });
  const PAGES_MIROIR = { ...PAGES_FORUM, staff: { url: BASE + '/forum/staff', html: lire('forum-index-rp.html') } };
  const casMiroir = ['index-rp', 'sous-forum', 'sujet', 'staff', 'redaction', 'reception', 'lecture', 'nouveau'].flatMap(nom => VARIANTES.flatMap(variante => [375, 768, 1280].map(width => ({ nom, variante, width }))));
  const releverTailles = async (c, script, css) => {
    const { context, page } = await ouvrir({ nom: c.nom, width: c.width, height: c.width < 768 ? 667 : 900, variante: c.variante, script, def: PAGES_MIROIR[c.nom], css });
    const l = (await parEtat(c.nom, page, () => page.evaluate(MESURE_TAILLES))).flatMap(([etat, t]) => t.map(x => `${etat} ${x}`));
    await context.close();
    return l;
  };
  const resMiroir = await mapLimit(casMiroir, async c => ({ c, apres: await releverTailles(c, userscript), masque: await releverTailles(c, avantEchelleForum, AVANT_TICKET47(avantEchelleForum) ? ECHELLE_TICKET47 : '') }));
  for (const { c, apres, masque } of resMiroir) {
    check(`echelle-forum ${etiquette(c)} : masque ECHELLE_TICKET47 sur le bundle de base = bundle d'après (taille de chaque élément de #col-right)`, () => {
      assert.ok(AVANT_TICKET47(avantEchelleForum), `bundle de base (${COMMIT_ECHELLE_FORUM}) déjà au ticket 7`);
      assert.equal(masque.length, apres.length, 'nombre d\'éléments');
      const ecarts = apres.map((x, i) => (x === masque[i] ? null : `${masque[i]} au lieu de ${x}`)).filter(Boolean);
      assert.deepEqual(ecarts, [], ecarts.slice(0, 5).join(' ; '));
    });
  }
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
