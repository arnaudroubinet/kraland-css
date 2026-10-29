// Confort mobile (épopée 9, entrée 1) : marge latérale de 16 px des pages de jeu et de l'Aide (H10.1 ; plan
// story-marge-laterale-de-16-px-socle-et-pages-de-jeu). Une vérification par ligne de la matrice du plan :
//   mobile          plateau (groupes, objets), Matériel, Personnage, Bâtiments, Employés et Aide (fixture synthétique aide.html) à 320,
//                   375 × 667, 700 et 767 px, Kraland clair et Empire Brun sombre : classes de page posées (kr-page-jeu ou kr-page-aide,
//                   kr-marge-mobile) ; aucun nœud texte visible à moins de 16 px d'un bord (lib/marges.mjs ; texte d'un conteneur défilant
//                   à part) ; cartes de section (CARTES_SECTION, lib/marges.mjs) à 8 px des deux bords ; carte et section imbriquées
//                   dans une carte (Aide) dans la boîte de contenu de leur parent ; aucun
//                   débordement horizontal ; mini-profil du plateau plié et déplié à 375 et 700 px ;
//   bureau          mêmes pages à 768, 769 et 1280 px : boîtes de tous les textes égales au bundle de base ;
//   bascule         Personnage, 767 -> 768 -> 767 et 768 -> 767 -> 768 dans le même onglet : marge à 767, base (même parcours) à 768 ;
//   hors-perimetre  index du forum Staff (/forum/staff, fixture forum-index-rp.html) à 375 et 767 px (sous-forum et index RP : mesurés
//                   par forum-activite confort, entrée 8 ; notifications : report-non-lu#confort, entrée 10 ; kramail et contacts :
//                   kramail-theme#confort, entrée 9) : sans kr-marge-mobile,
//                   boîtes de tous les textes égales au bundle de base (socle zéro sans le style en ligne d'applyMobileCriticalStyles) ;
//   secondaires     (entrée 4, plan story-pages-secondaires-marge-de-16-px-et-cibles-de-44-px) Règles, Guide, Organisations, Événements,
//                   Statistiques, fiche de membre, Interface, carte de ville et Cybermonde (fixtures secondaires-*.html) à 320, 375 × 667 et
//                   767 px, Kraland clair et Empire Brun sombre : classes kr-page-secondaire et kr-marge-mobile ; texte à 16 px des bords ;
//                   cartes à 8 px ; cibles hors bouton à 44 × 44 aux cinq points (elementFromPoint) ; input.hidden masqués ;
//                   formulaires à leur hauteur ; titre de la ville à 16 px du bord ; à 768 et 1280 px, textes égaux au bundle de base
//                   (titre de la ville à 768 px excepté) ;
//   membres-aide    (entrée 13, plan story-membres-et-fenetre-d-aide-marge-de-16-px-et-cibles-de-44-px) page Membres (fiche du compte connecté en édition), fenêtre d'aide
//                   /help et /help/staff (fixtures secondaires-membres.html, aide-fenetre.html, aide-fenetre-staff.html) à 320, 375 et 767 px,
//                   Kraland clair et Empire Brun sombre : classes de page ; texte à 16 px des bords ; cartes (.well de l'aide) à 8 px ;
//                   .btn-group-xs > .btn des Membres et td > a de l'aide à 44 × 44 aux cinq points ; à 768, 769 et 1280 px, textes égaux au
//                   bundle de base ; bascule 767 <-> 768 sur /help/staff et Membres dans les deux sens ; premier texte des .well
//                   de /help/staff à 24 px au plus du bord ; hors périmètre (lien de tableau hors .well, fiche de membre sans
//                   #myTabContent) : largeurs égales au bundle de base.
//   plateau         (entrée 5, plan story-plateau-mobile-cibles-des-cartes-des-groupes-du-mini-profil) groupes (mini-profil plié et déplié
//                   à 375 et 700 px), cartes à une et trois actions, à 320, 375 × 667, 700 et 767 px, Kraland clair et Empire Brun sombre :
//                   cibles du plateau à 44 × 44 aux cinq points, actions dans leur carte, tuiles à 64 px ; repli des deux accordéons sans
//                   saut ; à 768 et 1280 px, boîtes des cibles égales au bundle de base.
// Pages = FIXTURES SYNTHÉTIQUES (tests/e2e/fixtures), servies à leurs adresses ; vrai Bootstrap 3.3.7 (tests/e2e/vendor). Aucun accès au
// site réel. Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base, défaut : git show COMMIT_AVANT), KR_FRAG =
// mobile, bureau, bascule, hors-perimetre, secondaires, membres-aide, plateau (vide = tout).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { frames, krReady, styleSettled, THEME_READY } from './lib/settle.mjs';
import { choisirVariante } from './lib/variantes.mjs';
import { CARTES_SECTION, CIBLE_PAGE, ecartsCible, TEXTES_HORS_MARGE_PAGE } from './lib/marges.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const userscript = sansEntete(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_AVANT = '7bec452'; // feature/next après les entrées 9.1 à 9.10 (recalage du sweep 9.12, anciennes bases d64c578 et 034a820)
const avant = sansEntete(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_AVANT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const lire = f => fs.readFileSync(path.join(here, 'fixtures', f), 'utf8');
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const BASE = 'http://www.kraland.org';
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');
const VARIANTES = ['kraland', 'empire-brun-dark'];
const MOBILES = [320, 375, 700, 767];
const BUREAUX = [768, 769, 1280];
const MARGE = 16;
const CARTE = 8;
const avecBootstrap = h => h.includes('bootstrap') ? h : h.replace('</head>', '<link rel="stylesheet" href="/lib/bootstrap-3.3.7/css/bootstrap.min.css"></head>');

// Pages : adresse, fixture, classe de page attendue (null : hors périmètre, sans kr-marge-mobile).
const PAGES = {
  groupes: { url: '/jouer/plateau', html: avecBootstrap(lire('plateau-qualite-usage.html')), classe: 'kr-page-jeu', mini: true },
  objets: { url: '/jouer/plateau', html: lire('jeu-plateau-objets.html'), classe: 'kr-page-jeu' },
  materiel: { url: '/jouer/materiel', html: lire('jeu-materiel.html'), classe: 'kr-page-jeu' },
  perso: { url: '/jouer/perso', html: lire('jeu-perso.html'), classe: 'kr-page-jeu' },
  bat: { url: '/jouer/bat', html: lire('jeu-batiments.html'), classe: 'kr-page-jeu' },
  pnj: { url: '/jouer/pnj', html: lire('jeu-employes.html'), classe: 'kr-page-jeu' },
  aide: { url: '/aide', html: lire('aide.html'), classe: 'kr-page-aide' },
  staff: { url: '/forum/staff', html: lire('forum-index-rp.html'), classe: null }
};
// Pages secondaires (entrée 4) : cibles hors bouton mesurées (sélecteur, toutes les occurrences) ; sansCartes : page sans carte de section ;
// cartesJusqua : largeur maximale du contrôle des cartes (carte de ville : colonne native centrée à 767 px, identique à la base).
const SECONDAIRES = {
  regles: { url: '/regles/avancees', html: lire('secondaires-regles.html'), cibles: [] },
  guide: { url: '/monde/guide', html: lire('secondaires-guide.html'), cibles: [] },
  organisations: { url: '/monde/organisations', html: lire('secondaires-organisations.html'), cibles: ['td > a.nomargin'] },
  evenements: { url: '/monde/evenements', html: lire('secondaires-evenements.html'), cibles: ['.form-check-label', '.pagination > li > a'], sansCartes: true },
  stats: { url: '/communaute/stats', html: lire('secondaires-stats.html'), cibles: [], sansCartes: true },
  membre: { url: '/communaute/membres/fixture-1', html: lire('secondaires-membre.html'), cibles: [] },
  interface: { url: '/profil/interface', html: lire('secondaires-interface.html'), cibles: ['.radio > label', '.checkbox > label'], sansCartes: true, options: true },
  ville: { url: '/map/ville/fixture-ville', html: lire('secondaires-carte-ville.html'), cartesJusqua: 375,
    cibles: ['td > a:has(> i)', '.panel-heading span.clickable', '.center > .pagination > li > a:not(.btn)', '.center > .pagination select'] },
  cybermonde: { url: '/map/cybermonde', html: lire('secondaires-cybermonde.html'), cibles: ['.center > .pagination > li > a:not(.btn)', '.center > .pagination select'], sansCartes: true }
};
Object.entries(SECONDAIRES).forEach(([k, v]) => { PAGES[k] = { ...v, classe: 'kr-page-secondaire' }; });
const DANS = Object.keys(PAGES).filter(k => PAGES[k].classe && !SECONDAIRES[k]);
const HORS = Object.keys(PAGES).filter(k => !PAGES[k].classe);
// Compléments du fragment secondaires (hors listes DANS et HORS) : Événements sans libellé de case (repli), rédaction du kramail (page sans
// garde, champs de formulaire).
PAGES['evenements-sans-libelle'] = { url: '/monde/evenements', html: PAGES.evenements.html.replace(/<label class="form-check-label"[^>]*>[^<]*<\/label>/, ''), classe: 'kr-page-secondaire' };
PAGES['kramail-nouveau'] = { url: '/kramail/post/nouveau-4-2000', html: lire('kramail-nouveau.html'), classe: null };
// Membres et fenêtre d'aide (entrée 13) : classes attendues, cibles mesurées, cartes (sélecteur d'ETAT ; null : page sans carte).
const CARTES_AIDE = { cartes: '.well', exclues: '.modal' };
const MEMBRES_AIDE = {
  membres: { url: '/communaute/membres', html: lire('secondaires-membres.html'), classes: ['kr-marge-mobile', 'kr-page-secondaire'], membres: true, cibles: ['#myTabContent > .active .btn-group-xs > .btn'], cartes: CARTES_SECTION },
  'aide-fenetre': { url: '/help', html: lire('aide-fenetre.html'), classes: ['kr-marge-mobile', 'kr-page-aide-fenetre'], cibles: [], cartes: null },
  'aide-staff': { url: '/help/staff', html: lire('aide-fenetre-staff.html'), classes: ['kr-marge-mobile', 'kr-page-aide-fenetre'], cibles: ['td > a'], cartes: CARTES_AIDE, plafond: '.well' }
};
Object.entries(MEMBRES_AIDE).forEach(([k, v]) => { PAGES[k] = { ...v, classe: v.classes[1] }; });
// Hors périmètre de l'entrée 13 : lien de tableau hors .well dans l'aide, fiche de membre sans #myTabContent ; largeurs égales au bundle de base.
const HORS_13 = {
  'aide-hors-well': { url: '/help/staff', sel: '#kr-hors-well',
    html: MEMBRES_AIDE['aide-staff'].html.replace('<div class="row">\n', '<div class="row">\n    <table class="table"><tbody><tr><td><a id="kr-hors-well" href="/help">Ab</a></td></tr></tbody></table>\n') },
  'fiche-membres': { url: '/communaute/membres/fixture-1', sel: '.btn-group-xs > .btn',
    html: MEMBRES_AIDE.membres.html.replace('id="myTabContent"', 'id="kr-sans-volets"') }
};
Object.entries(HORS_13).forEach(([k, v]) => { PAGES[k] = v; });
// Plafond du premier texte de chaque carte (sélecteur) : bord gauche de la carte au premier nœud texte visible, au plus 24 px de l'écran.
const PLAFOND = 24;
const PREMIERS_TEXTES = sel => [...document.querySelectorAll(sel)].map(el => {
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
  const n = w.nextNode();
  if (!n) { return null; }
  const rg = document.createRange();
  rg.selectNodeContents(n);
  return Math.round(rg.getBoundingClientRect().left);
});
// Fragment plateau (entrée 5) : cartes de personnages avec une action chacune (plateau-cartes-noms.html), et variante à trois actions sur la
// première carte (repli sur deux lignes à 320 px ; structure native de plusieurs actions non relevée, voir le plan).
const UNE_ACTION = '<div style="height:59px"><div><a href="#"><i class="fa fa-user"></i></a></div></div>';
PAGES.cartes = { url: '/jouer/plateau', html: avecBootstrap(lire('plateau-cartes-noms.html')), classe: 'kr-page-jeu' };
PAGES['cartes-trois'] = { url: '/jouer/plateau', classe: 'kr-page-jeu',
  html: PAGES.cartes.html.replace(UNE_ACTION, '<div style="height:59px"><div><a href="#"><i class="fa fa-user"></i></a><a href="#"><i class="fa fa-envelope"></i></a><a href="#"><i class="fa fa-eye"></i></a></div></div>') };

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}

const browser = await launchBrowser();

async function ouvrir({ nom, width, height = 667, variante, script, tactile = width < 768, init = null, reducedMotion = 'no-preference' }) {
  const def = PAGES[nom];
  const context = await browser.newContext({ viewport: { width, height }, isMobile: tactile, hasTouch: tactile, deviceScaleFactor: 1, reducedMotion });
  await confineNetwork(context); // refus global EN PREMIER, routes des fixtures ensuite
  await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (u.href.split('#')[0] === BASE + def.url) { return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: def.html }); }
    if (u.pathname.startsWith('/lib/bootstrap') || u.pathname.startsWith('/lib/jquery')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return route.fulfill({ path: path.join(VENDOR, file), contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript' });
    }
    if (u.pathname.endsWith('.css')) { return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    return route.abort();
  });
  await context.addInitScript(choisirVariante, variante);
  if (init) { await context.addInitScript(init); }
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
  return { context, page, erreurs };
}

async function prete(page, label) {
  await krReady(page, { ready: THEME_READY, label });
  await styleSettled(page, 'body');
  await page.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running'), null, { timeout: 5000 }).catch(() => {});
}

// État de page : thème, mode mobile, classes de page, débordement, cartes de section (bords gauche et droit).
const ETAT = Q => {
  const vw = document.documentElement.clientWidth;
  const h = document.documentElement.classList;
  const vis = e => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const cartes = [...document.querySelectorAll(Q.cartes)]
    .filter(p => vis(p) && !p.closest(Q.exclues) && !p.parentElement.closest(Q.cartes))
    .map(p => { const b = p.getBoundingClientRect(); return { nom: (p.querySelector('.panel-title, .dashboard-group-title, .panel-heading') || p).textContent.trim().slice(0, 30), g: b.left, d: vw - b.right }; });
  // Carte imbriquée (dans une carte de section) : sa boîte reste dans la boîte de contenu de son parent.
  const imbriquees = [...document.querySelectorAll(Q.cartes)]
    .filter(p => vis(p) && p.parentElement.closest(Q.cartes))
    .map(p => {
      const b = p.getBoundingClientRect();
      const pr = p.parentElement.getBoundingClientRect();
      const cs = getComputedStyle(p.parentElement);
      const g = b.left - (pr.left + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft));
      const d = (pr.right - parseFloat(cs.borderRightWidth) - parseFloat(cs.paddingRight)) - b.right;
      return { nom: (p.querySelector('.panel-title, .dashboard-group-title, .panel-heading') || p).textContent.trim().slice(0, 30), g: Math.round(g * 2) / 2, d: Math.round(d * 2) / 2 };
    });
  return {
    theme: h.contains('kr-theme-enabled'), mobile: document.body.classList.contains('mobile-mode'),
    classes: ['kr-page-jeu', 'kr-page-aide', 'kr-page-aide-fenetre', 'kr-page-secondaire', 'kr-marge-mobile'].filter(c => h.contains(c)),
    vw, sw: document.documentElement.scrollWidth, cartes, imbriquees
  };
};

// Relevé comparé au bundle de base : boîte de chaque nœud texte visible (ordre du DOM), arrondie au demi-pixel.
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
  return { theme: document.documentElement.classList.contains('kr-theme-enabled'), mobile: document.body.classList.contains('mobile-mode'), l: out };
};
function premierEcart(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) { if (a[i] !== b[i]) { return `texte ${i} : « ${a[i]} » au lieu de « ${b[i]} »`; } }
  return '';
}

function controlerMarge(m, hors, sansCartes = false) {
  assert.ok(m.theme, 'kr-theme-enabled absent');
  assert.ok(m.mobile, 'mode mobile absent');
  assert.ok(m.sw <= m.vw, `débordement horizontal ${m.sw} > ${m.vw}`);
  const t = hors.map(x => `« ${x.texte} » ${x.gauche}/${x.droite} (${x.chemin})`);
  assert.deepEqual(t, [], `${t.length} texte(s) à moins de ${MARGE} px : ${t.slice(0, 3).join(' ; ')}`);
  if (!sansCartes) { assert.ok(m.cartes.length > 0, 'aucune carte de section'); }
  const c = m.cartes.filter(x => Math.abs(x.g - CARTE) > 0.5 || Math.abs(x.d - CARTE) > 0.5).map(x => `« ${x.nom} » ${x.g}/${x.d}`);
  assert.deepEqual(c, [], `cartes hors des ${CARTE} px : ${c.join(' ; ')}`);
  const i = m.imbriquees.filter(x => x.g < -0.5 || x.d < -0.5).map(x => `« ${x.nom} » ${x.g}/${x.d}`);
  assert.deepEqual(i, [], `carte(s) imbriquée(s) hors de leur parent : ${i.join(' ; ')}`);
}

// ---------- mobile ----------
if (on('mobile')) {
  console.log('\n== mobile ==');
  const cas = DANS.flatMap(nom => VARIANTES.flatMap(variante => MOBILES.map(width => ({ nom, variante, width }))));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const etats = { replié: { m: await page.evaluate(ETAT, CARTES_SECTION), hors: await page.evaluate(TEXTES_HORS_MARGE_PAGE, { marge: MARGE }) } };
    if (PAGES[c.nom].mini && [375, 700].includes(c.width)) {
      await page.tap('.mobile-mini-profile-header');
      await page.waitForFunction(() => { const mp = document.querySelector('.mobile-mini-profile'); return mp && mp.classList.contains('expanded') && mp.getAnimations({ subtree: true }).every(a => a.playState !== 'running'); }, null, { timeout: 5000 });
      etats['mini-profil déplié'] = { m: await page.evaluate(ETAT, CARTES_SECTION), hors: await page.evaluate(TEXTES_HORS_MARGE_PAGE, { marge: MARGE }) };
    }
    await context.close();
    return { c, etats, erreurs };
  });
  for (const { c, etats, erreurs } of res) {
    for (const [etat, { m, hors }] of Object.entries(etats)) {
      check(`mobile ${c.nom} ${c.variante} ${c.width} px (${etat}) : texte à ${MARGE} px des bords, cartes à ${CARTE} px`, () => controlerMarge(m, hors));
    }
    check(`mobile ${c.nom} ${c.variante} ${c.width} px : classes ${PAGES[c.nom].classe} et kr-marge-mobile sur <html>`, () => {
      assert.deepEqual([...etats.replié.m.classes].sort(), [PAGES[c.nom].classe, 'kr-marge-mobile'].sort());
    });
    if (c.nom === 'aide') {
      check(`mobile aide ${c.variante} ${c.width} px : carte et section imbriquées relevées`, () => assert.equal(etats.replié.m.imbriquees.length, 2));
    }
    check(`mobile ${c.nom} ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

// ---------- bureau ----------
if (on('bureau')) {
  console.log('\n== bureau ==');
  const cas = DANS.flatMap(nom => VARIANTES.flatMap(variante => BUREAUX.map(width => ({ nom, variante, width }))));
  const releve = async (c, script) => {
    const { context, page, erreurs } = await ouvrir({ ...c, height: 720, script });
    const r = await page.evaluate(RELEVE);
    await context.close();
    return { r, erreurs };
  };
  const res = await mapLimit(cas, async c => ({ c, teste: await releve(c, userscript), base: await releve(c, avant) }));
  for (const { c, teste, base } of res) {
    check(`bureau ${c.nom} ${c.variante} ${c.width} px : textes égaux au bundle de base`, () => {
      assert.ok(teste.r.theme && base.r.theme, 'kr-theme-enabled absent');
      assert.equal(teste.r.mobile, false, 'mode mobile au-delà de 767 px');
      assert.ok(teste.r.l.length > 0, 'aucun texte');
      const d = premierEcart(teste.r.l, base.r.l);
      assert.equal(d, '', d);
    });
    check(`bureau ${c.nom} ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
}

// ---------- bascule ----------
async function parcours(script, variante, largeurs, nom = 'perso', cartes = CARTES_SECTION, sels = []) {
  const { context, page, erreurs } = await ouvrir({ nom, width: largeurs[0], variante, script, tactile: false });
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
    const etape = { width, m: await page.evaluate(ETAT, cartes), hors: await page.evaluate(TEXTES_HORS_MARGE_PAGE, { marge: MARGE }), r: await page.evaluate(RELEVE), cibles: [] };
    // Cibles mesurées après le relevé et seulement en mobile ; CIBLE_PAGE fait défiler : retour en haut pour l'étape suivante.
    for (const sel of width < 768 ? sels : []) {
      const n = await page.evaluate(s => document.querySelectorAll(s).length, sel);
      if (n === 0) { etape.cibles.push({ sel, i: 0, e: ['aucune cible'] }); }
      for (let j = 0; j < n; j += 1) { etape.cibles.push({ sel, i: j, e: ecartsCible(await page.evaluate(CIBLE_PAGE, [sel, j])) }); }
    }
    if (etape.cibles.length) { await page.evaluate(() => window.scrollTo(0, 0)); }
    etapes.push(etape);
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
        check(`${lab}, étape ${i + 1} (${e.width} px) : texte à ${MARGE} px des bords, cartes à ${CARTE} px`, () => controlerMarge(e.m, e.hors));
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

// ---------- hors périmètre ----------
if (on('hors-perimetre')) {
  console.log('\n== hors-perimetre ==');
  const cas = HORS.flatMap(nom => VARIANTES.flatMap(variante => [375, 767].map(width => ({ nom, variante, width }))));
  const releve = async (c, script) => {
    const { context, page, erreurs } = await ouvrir({ ...c, script });
    const r = { ...(await page.evaluate(RELEVE)), classes: (await page.evaluate(ETAT, CARTES_SECTION)).classes };
    await context.close();
    return { r, erreurs };
  };
  const res = await mapLimit(cas, async c => ({ c, teste: await releve(c, userscript), base: await releve(c, avant) }));
  for (const { c, teste, base } of res) {
    check(`hors-perimetre ${c.nom} ${c.variante} ${c.width} px : sans classe de marge, textes égaux au bundle de base`, () => {
      assert.ok(teste.r.theme && base.r.theme, 'kr-theme-enabled absent');
      assert.ok(teste.r.mobile, 'mode mobile absent');
      assert.deepEqual(teste.r.classes, [], 'classes de page');
      assert.ok(teste.r.l.length > 0, 'aucun texte');
      const d = premierEcart(teste.r.l, base.r.l);
      assert.equal(d, '', d);
    });
    check(`hors-perimetre ${c.nom} ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
}

// ---------- pages secondaires ----------
// Champs témoins (input, select, input-lg en input et en select, hauteur en ligne) insérés dans #col-right ou dans une .bootbox.modal ouverte.
const CHAMPS = modale => {
  const f = document.createElement('form');
  f.innerHTML = '<input class="form-control"><select class="form-control"><option>x</option></select><input class="form-control input-lg">'
    + '<select class="form-control input-lg"><option>x</option></select><input class="form-control" style="height: 60px">';
  if (modale) {
    const m = document.createElement('div');
    m.className = 'bootbox modal fade in';
    m.style.display = 'block';
    m.innerHTML = '<div class="modal-dialog"><div class="modal-content"><div class="modal-body"></div></div></div>';
    m.querySelector('.modal-body').append(f);
    document.body.append(m);
  } else {
    document.querySelector('#col-right').append(f);
  }
  return [...f.children].map(e => Math.round(e.getBoundingClientRect().height));
};
const CHAMPS_ATTENDUS = [44, 44, 46, 46, 60];
// Dans une modale, tout select reste à 44 px (règle « .modal-body select » de la peau, antérieure à 9.4).
const CHAMPS_MODALE = [44, 44, 46, 44, 60];
// Éléments laissés natifs : relevé de taille et des propriétés que 9.4 pose ailleurs (comparé au bundle de base).
const NATIFS = sel => [...document.querySelectorAll(sel)].map(e => {
  const r = e.getBoundingClientRect();
  const s = getComputedStyle(e);
  return [e.tagName, Math.round(r.width), Math.round(r.height), s.minWidth, s.minHeight, s.display, s.alignItems, s.padding].join(' ');
});
// Radio et case dans une .modal de /monde : insérées ouvertes, hors de la règle des cibles des pages secondaires.
const RADIO_MODALE = () => {
  const m = document.createElement('div');
  m.className = 'modal fade in';
  m.style.display = 'block';
  m.innerHTML = '<div class="modal-dialog"><div class="modal-content"><div class="modal-body"><div class="radio"><label><input type="radio" name="r"> Un</label></div>'
    + '<div class="checkbox"><label><input type="checkbox"> Deux</label></div><div class="form-check"><input class="form-check-input" type="checkbox" id="m-c">'
    + '<label class="form-check-label" for="m-c">Trois</label></div></div></div></div>';
  document.body.append(m);
};
// Titre de la ville : premier nœud texte du titre (boîte à l'écran).
const TITRE_VILLE = () => {
  const h = document.querySelector('#mapname-container > h4');
  if (!h) { return null; }
  const rg = document.createRange();
  rg.selectNodeContents(h.firstChild);
  const b = rg.getBoundingClientRect();
  return { gauche: b.left, droite: document.documentElement.clientWidth - b.right };
};
async function ouvrirOptions(page) {
  await page.evaluate(() => document.querySelectorAll('.kr-options-section-title').forEach(t => { if (t.nextElementSibling?.classList.contains('collapsed')) { t.click(); } }));
  await page.waitForFunction(() => document.querySelectorAll('.kr-options-section-content.collapsed').length === 0 && document.getAnimations().every(a => a.playState !== 'running'), null, { timeout: 5000 });
  await page.waitForTimeout(400); // transitions max-height et opacité (0,3 s)
}
if (on('secondaires')) {
  console.log('\n== secondaires ==');
  const noms = Object.keys(SECONDAIRES);
  const cas = noms.flatMap(nom => VARIANTES.flatMap(variante => [320, 375, 767].map(width => ({ nom, variante, width }))));
  const res = await mapLimit(cas, async c => {
    const def = PAGES[c.nom];
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    if (def.options) { await ouvrirOptions(page); }
    const m = await page.evaluate(ETAT, CARTES_SECTION);
    const hors = await page.evaluate(TEXTES_HORS_MARGE_PAGE, { marge: MARGE });
    const titre = await page.evaluate(TITRE_VILLE);
    const masques = await page.evaluate(() => [...document.querySelectorAll('input.hidden')].map(e => ({ id: e.id, vu: e.getClientRects().length > 0 })));
    const cibles = [];
    for (const sel of def.cibles) {
      const n = await page.evaluate(s => document.querySelectorAll(s).length, sel);
      if (n === 0) { cibles.push({ sel, i: 0, e: ['aucune cible'] }); }
      for (let i = 0; i < n; i += 1) { cibles.push({ sel, i, e: ecartsCible(await page.evaluate(CIBLE_PAGE, [sel, i])) }); }
    }
    // Formulaires : champs témoins insérés (input, select, input-lg, hauteur en ligne) ; les hauteurs natives priment sur l'ancien 44 px imposé.
    const champs = c.nom === 'evenements' ? await page.evaluate(CHAMPS, false) : null;
    const chevron = await page.evaluate(() => { const i = document.querySelector('.panel-heading span.clickable > i'); return i ? document.documentElement.clientWidth - i.getBoundingClientRect().right : null; });
    await context.close();
    return { c, m, hors, titre, masques, cibles, chevron, champs, erreurs };
  });
  for (const { c, m, hors, titre, masques, cibles, chevron, champs, erreurs } of res) {
    const def = PAGES[c.nom];
    const lab = `secondaires ${c.nom} ${c.variante} ${c.width} px`;
    const sansCartes = def.sansCartes || (def.cartesJusqua && c.width > def.cartesJusqua);
    check(`${lab} : classes kr-page-secondaire et kr-marge-mobile sur <html>`, () => assert.deepEqual([...m.classes].sort(), ['kr-marge-mobile', 'kr-page-secondaire']));
    check(`${lab} : texte à ${MARGE} px des bords${sansCartes ? '' : `, cartes à ${CARTE} px`}`, () => controlerMarge(sansCartes ? { ...m, cartes: [] } : m, hors, sansCartes));
    if (def.cibles.length) {
      check(`${lab} : cibles hors bouton à 44 × 44 (${def.cibles.join(', ')})`, () => {
        const e = cibles.filter(x => x.e.length).map(x => `${x.sel}[${x.i}] ${x.e.join(', ')}`);
        assert.deepEqual(e, [], e.slice(0, 3).join(' ; '));
      });
    }
    if (c.nom === 'evenements') {
      check(`${lab} : input#mySubmit1…6.hidden masqués`, () => {
        assert.equal(masques.length, 6, 'input.hidden relevés');
        assert.deepEqual(masques.filter(x => x.vu).map(x => x.id), []);
      });
      check(`${lab} : formulaires à leur hauteur (input et select 44, input-lg 46, hauteur en ligne 60)`, () => assert.deepEqual(champs, CHAMPS_ATTENDUS));
    }
    if (c.nom === 'ville') {
      check(`${lab} : titre de la ville à ${MARGE} px du bord gauche, dans l'écran`, () => {
        assert.ok(titre, 'titre absent');
        assert.ok(titre.gauche >= MARGE - 0.5 && titre.droite >= 0, `titre à ${Math.round(titre.gauche)} / ${Math.round(titre.droite)} px`);
      });
      check(`${lab} : chevron Fonctionnaires à ${MARGE} px du bord droit`, () => assert.ok(chevron >= MARGE - 0.5, `chevron à ${chevron} px`));
    }
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
  // Compléments à 375 px, contre le bundle de base quand il s'agit de rester natif.
  const casC = VARIANTES.map(variante => ({ variante, width: 375 }));
  const complement = async (c, script) => {
    const out = {};
    let o = await ouvrir({ ...c, nom: 'evenements-sans-libelle', script });
    out.sansLibelle = await o.page.evaluate(() => {
      const l = document.querySelector('.form-check');
      const i = l.querySelector('input');
      const r = l.getBoundingClientRect();
      const ri = i.getBoundingClientRect();
      return { h: Math.round(r.height), libelle: !!l.querySelector('label'), case: i === document.elementFromPoint(ri.left + ri.width / 2, ri.top + ri.height / 2) };
    });
    out.debord = await o.page.evaluate(() => {
      const t = document.querySelector('table.table-striped');
      t.scrollLeft = 50;
      return { page: document.documentElement.scrollWidth - document.documentElement.clientWidth, table: t.scrollWidth - t.clientWidth, defile: t.scrollLeft };
    });
    out.champsModale = await o.page.evaluate(CHAMPS, true);
    await o.context.close();
    o = await ouvrir({ ...c, nom: 'kramail-nouveau', script });
    out.champsKramail = await o.page.evaluate(CHAMPS, false);
    await o.context.close();
    o = await ouvrir({ ...c, nom: 'guide', script });
    await o.page.evaluate(RADIO_MODALE);
    out.modale = await o.page.evaluate(NATIFS, '.modal .radio > label, .modal .checkbox > label, .modal .form-check, .modal .form-check-label');
    await o.context.close();
    o = await ouvrir({ ...c, nom: 'interface', script });
    out.images = await o.page.evaluate(NATIFS, '#col-right > a, #col-right > div > a, #col-right td > a');
    await o.context.close();
    o = await ouvrir({ ...c, nom: 'ville', script });
    out.travail = await o.page.evaluate(() => [...document.querySelectorAll('.center > .pagination > li > a.btn')].map(a => Math.round(a.getBoundingClientRect().height)));
    await o.context.close();
    return out;
  };
  const resC = await mapLimit(casC, async c => ({ c, teste: await complement(c, userscript), base: await complement(c, avant) }));
  for (const { c, teste, base } of resC) {
    const lab = `secondaires ${c.variante} ${c.width} px`;
    check(`${lab} : Événements sans libellé de case, ligne .form-check à 44 px, case atteinte au toucher`, () => {
      assert.equal(teste.sansLibelle.libelle, false, 'libellé présent');
      assert.ok(teste.sansLibelle.h >= 44, `ligne de ${teste.sansLibelle.h} px`);
      assert.ok(teste.sansLibelle.case, 'case couverte');
    });
    console.log(`  info ${lab} : ligne longue d'Événements, débordement page ${teste.debord.page} px (base ${base.debord.page}), tableau ${teste.debord.table} px (base ${base.debord.table}), défilement ${teste.debord.defile} px (base ${base.debord.defile})`);
    check(`${lab} : ligne longue d'Événements, page sans débordement de plus que la base, tableau défilable`, () => {
      assert.ok(teste.debord.page <= base.debord.page, `page ${teste.debord.page} px`);
      assert.ok(teste.debord.defile > 0, 'tableau sans défilement');
    });
    check(`${lab} : formulaires dans une .bootbox.modal à leur hauteur`, () => assert.deepEqual(teste.champsModale, CHAMPS_MODALE));
    check(`${lab} : formulaires de la rédaction du kramail (sans garde) à leur hauteur`, () => assert.deepEqual(teste.champsKramail, CHAMPS_ATTENDUS));
    check(`${lab} : radio, case et form-check d'une .modal de /monde natifs (égaux au bundle de base)`, () => {
      assert.equal(teste.modale.length, 4, 'éléments de la modale');
      assert.deepEqual(teste.modale, base.modale);
    });
    check(`${lab} : liens-images de choix d'Interface (a > img, div > a, div.t > a, td > a) égaux au bundle de base`, () => {
      assert.ok(teste.images.length >= 12, `${teste.images.length} liens`);
      assert.deepEqual(teste.images, base.images);
    });
    check(`${lab} : bouton « Travail » de la carte de ville à 34 px de haut`, () => assert.deepEqual(teste.travail, [34]));
  }

  // Bureau : textes égaux au bundle de base ; titre de la ville contrôlé à part.
  const casB = noms.flatMap(nom => VARIANTES.flatMap(variante => BUREAUX.filter(w => w !== 769).map(width => ({ nom, variante, width }))));
  const releve = async (c, script) => {
    const { context, page, erreurs } = await ouvrir({ ...c, height: 720, script });
    const r = await page.evaluate(RELEVE);
    const titre = await page.evaluate(TITRE_VILLE);
    await context.close();
    return { r, titre, erreurs };
  };
  const resB = await mapLimit(casB, async c => ({ c, teste: await releve(c, userscript), base: await releve(c, avant) }));
  for (const { c, teste, base } of resB) {
    const lab = `secondaires bureau ${c.nom} ${c.variante} ${c.width} px`;
    check(`${lab} : textes égaux au bundle de base`, () => {
      assert.ok(teste.r.theme && base.r.theme, 'kr-theme-enabled absent');
      assert.equal(teste.r.mobile, false, 'mode mobile au-delà de 767 px');
      assert.ok(teste.r.l.length > 0, 'aucun texte');
      const d = premierEcart(teste.r.l, base.r.l);
      assert.equal(d, '', d);
    });
    if (c.nom === 'ville') {
      check(`${lab} : titre de la ville à ${MARGE} px du bord gauche`, () => assert.ok(teste.titre && teste.titre.gauche >= MARGE - 0.5, `titre à ${teste.titre && Math.round(teste.titre.gauche)} px`));
    }
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
}

// ---------- Membres et fenêtre d'aide ----------
if (on('membres-aide')) {
  console.log('\n== membres-aide ==');
  const noms = Object.keys(MEMBRES_AIDE);
  const cas = noms.flatMap(nom => VARIANTES.flatMap(variante => [320, 375, 767].map(width => ({ nom, variante, width }))));
  const res = await mapLimit(cas, async c => {
    const def = MEMBRES_AIDE[c.nom];
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const m = await page.evaluate(ETAT, def.cartes || CARTES_SECTION);
    const hors = await page.evaluate(TEXTES_HORS_MARGE_PAGE, { marge: MARGE });
    m.membres = await page.evaluate(() => document.documentElement.classList.contains('kr-page-members'));
    m.premiers = def.plafond ? await page.evaluate(PREMIERS_TEXTES, def.plafond) : [];
    const cibles = [];
    for (const sel of def.cibles) {
      const n = await page.evaluate(s => document.querySelectorAll(s).length, sel);
      if (n === 0) { cibles.push({ sel, i: 0, e: ['aucune cible'] }); }
      for (let i = 0; i < n; i += 1) { cibles.push({ sel, i, e: ecartsCible(await page.evaluate(CIBLE_PAGE, [sel, i])) }); }
    }
    await context.close();
    return { c, m, hors, cibles, erreurs };
  });
  for (const { c, m, hors, cibles, erreurs } of res) {
    const def = MEMBRES_AIDE[c.nom];
    const lab = `membres-aide ${c.nom} ${c.variante} ${c.width} px`;
    check(`${lab} : classes ${def.classes.join(' et ')} sur <html>${def.membres ? ', avec kr-page-members' : ''}`, () => {
      assert.deepEqual([...m.classes].sort(), def.classes);
      assert.equal(m.membres, Boolean(def.membres), 'kr-page-members');
    });
    check(`${lab} : texte à ${MARGE} px des bords${def.cartes ? `, cartes à ${CARTE} px` : ''}`, () => controlerMarge(def.cartes ? m : { ...m, cartes: [] }, hors, !def.cartes));
    if (def.plafond) {
      check(`${lab} : premier texte de chaque ${def.plafond} à ${PLAFOND} px au plus du bord`, () => {
        assert.ok(m.premiers.length > 0, `aucun ${def.plafond}`);
        const d = m.premiers.map((x, i) => [i, x]).filter(([, x]) => x === null || x > PLAFOND);
        assert.deepEqual(d, [], `${def.plafond} [indice, gauche] : ${JSON.stringify(d)}`);
      });
    }
    if (def.cibles.length) {
      check(`${lab} : cibles à 44 × 44 (${def.cibles.join(', ')})`, () => {
        const e = cibles.filter(x => x.e.length).map(x => `${x.sel}[${x.i}] ${x.e.join(', ')}`);
        assert.deepEqual(e, [], `${e.length} cible(s) : ${e.slice(0, 3).join(' ; ')}`);
      });
    }
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }

  // Bureau : textes égaux au bundle de base du fragment.
  const casB = noms.flatMap(nom => VARIANTES.flatMap(variante => BUREAUX.map(width => ({ nom, variante, width }))));
  const releve = async (c, script) => {
    const { context, page, erreurs } = await ouvrir({ ...c, height: 720, script });
    const r = await page.evaluate(RELEVE);
    await context.close();
    return { r, erreurs };
  };
  const resB = await mapLimit(casB, async c => ({ c, teste: await releve(c, userscript), base: await releve(c, avant) }));
  for (const { c, teste, base } of resB) {
    const lab = `membres-aide bureau ${c.nom} ${c.variante} ${c.width} px`;
    check(`${lab} : textes égaux au bundle de base`, () => {
      assert.ok(teste.r.theme && base.r.theme, 'kr-theme-enabled absent');
      assert.equal(teste.r.mobile, false, 'mode mobile au-delà de 767 px');
      assert.ok(teste.r.l.length > 0, 'aucun texte');
      const d = premierEcart(teste.r.l, base.r.l);
      assert.equal(d, '', d);
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }

  // Bascule 767 <-> 768 sur /help/staff et sur Membres, dans les deux sens et dans le même onglet.
  const casS = ['aide-staff', 'membres'].flatMap(nom => VARIANTES.flatMap(variante => [[767, 768, 767], [768, 767, 768]].map(largeurs => ({ nom, variante, largeurs }))));
  const resS = await mapLimit(casS, async c => ({ c, teste: await parcours(userscript, c.variante, c.largeurs, c.nom, MEMBRES_AIDE[c.nom].cartes, MEMBRES_AIDE[c.nom].cibles),
    base: await parcours(avant, c.variante, c.largeurs, c.nom, MEMBRES_AIDE[c.nom].cartes) }));
  for (const { c, teste, base } of resS) {
    const lab = `membres-aide bascule ${c.nom} ${c.variante} ${c.largeurs.join(' -> ')}`;
    teste.etapes.forEach((e, i) => {
      if (e.width < 768) {
        check(`${lab}, étape ${i + 1} (${e.width} px) : texte à ${MARGE} px des bords, cartes à ${CARTE} px`, () => controlerMarge(e.m, e.hors));
        check(`${lab}, étape ${i + 1} (${e.width} px) : cibles à 44 × 44 (${MEMBRES_AIDE[c.nom].cibles.join(', ')})`, () => {
          const d = e.cibles.filter(x => x.e.length).map(x => `${x.sel}[${x.i}] ${x.e.join(', ')}`);
          assert.deepEqual(d, [], `${d.length} cible(s) : ${d.slice(0, 3).join(' ; ')}`);
        });
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

  // Hors périmètre : largeurs des liens égales au bundle de base.
  const casH = Object.keys(HORS_13).flatMap(nom => VARIANTES.flatMap(variante => [375, 767].map(width => ({ nom, variante, width }))));
  const largeurs = async (c, script) => {
    const { context, page, erreurs } = await ouvrir({ ...c, script });
    const l = await page.evaluate(s => [...document.querySelectorAll(s)].map(a => Math.round(a.getBoundingClientRect().width)), HORS_13[c.nom].sel);
    await context.close();
    return { l, erreurs };
  };
  const resH = await mapLimit(casH, async c => ({ c, teste: await largeurs(c, userscript), base: await largeurs(c, avant) }));
  for (const { c, teste, base } of resH) {
    const lab = `membres-aide hors-perimetre ${c.nom} ${c.variante} ${c.width} px`;
    check(`${lab} : largeurs de ${HORS_13[c.nom].sel} égales au bundle de base`, () => {
      assert.ok(teste.l.length > 0, 'aucun lien');
      assert.deepEqual(teste.l, base.l);
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
}

// ---------- plateau (entrée 5) ----------
// Cibles tactiles du plateau mobile : actions des cartes, boutons de groupe, bouton de gestion du mini-profil, accès rapides et grille
// d'actions (si visible) à 44 × 44 par boîte et aux cinq points ; tuiles d'action à 64 px (Q24.1) ; actions dans leur carte, sans
// chevauchement ; repli des deux accordéons sans saut (hauteur au premier instant égale à la hauteur dépliée, puis décroissante) ; à 768 et
// 1280 px, boîtes des cibles égales au bundle de base.
const CIBLES_PLATEAU = ['.dashboard-card-actions a', '.dashboard-group-buttons .btn', '.mobile-mini-profile-manage-btn', '.kr-quick-access-buttons > .btn', '.kr-action-grid > .btn'];
const VISIBLES = sels => sels.flatMap(sel => [...document.querySelectorAll(sel)].map((e, i) => [sel, i, e]).filter(([, , e]) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden' && !e.closest('.dashboard-cards-grid.collapsed, .building-section-content.collapsed')).map(([s, i]) => [s, i]));
const ACTIONS_DANS_CARTE = () => [...document.querySelectorAll('.dashboard-card-actions')].flatMap(w => {
  const carte = w.closest('.dashboard-card').getBoundingClientRect();
  const liens = [...w.querySelectorAll('a')].map(a => a.getBoundingClientRect());
  const e = [];
  liens.forEach((r, i) => {
    if (r.left < carte.left - 0.5 || r.right > carte.right + 0.5 || r.top < carte.top - 0.5 || r.bottom > carte.bottom + 0.5) { e.push(`action ${i} hors de sa carte`); }
    liens.slice(i + 1).forEach((q, j) => { if (Math.min(r.right, q.right) - Math.max(r.left, q.left) > 0.5 && Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top) > 0.5) { e.push(`actions ${i}/${i + j + 1} chevauchées`); } });
  });
  return e;
});
const TUILES = () => [...document.querySelectorAll('.mobile-quick-action')].filter(e => e.getClientRects().length).map(e => Math.round(e.getBoundingClientRect().height));
// Repli d'un accordéon : clic sur l'en-tête du premier corps déplié, transitions figées puis parcourues de 0 à 300 ms (pas de 10 ms).
const REPLI = ([entete, corps]) => {
  const c = [...document.querySelectorAll(corps)].find(x => !x.classList.contains('collapsed') && x.getClientRects().length);
  if (!c) { return null; }
  const h0 = c.getBoundingClientRect().height;
  const t = c.closest('.dashboard-section, .panel').querySelector(entete);
  t.click();
  const anims = c.getAnimations();
  anims.forEach(a => a.pause());
  const h = [];
  for (let ms = 0; ms <= 300; ms += 10) { anims.forEach(a => { a.currentTime = ms; }); h.push(Math.round(c.getBoundingClientRect().height * 2) / 2); }
  return { h0: Math.round(h0 * 2) / 2, h, proprietes: anims.map(a => a.transitionProperty).sort() };
};
const ACCORDEONS = [['groupes', '.dashboard-section-header-accordion', '.dashboard-cards-grid'], ['objets', '.building-section-header', '.building-section-content']];
// Script d'initialisation : transitions lancées sur la grille des groupes, et hauteurs des grilles repliées à la première image où elles
// le sont (rAF, avant toute interaction).
const CHARGEMENT_GROUPES = () => {
  window.__krChargement = { transitions: [], premiere: null };
  document.addEventListener('transitionrun', e => {
    if (e.target.classList && e.target.classList.contains('dashboard-cards-grid')) { window.__krChargement.transitions.push(e.propertyName); }
  }, true);
  const image = () => {
    const l = [...document.querySelectorAll('.dashboard-cards-grid.collapsed')];
    if (l.length) { window.__krChargement.premiere = l.map(g => Math.round(g.getBoundingClientRect().height)); return; }
    requestAnimationFrame(image);
  };
  requestAnimationFrame(image);
};
const BOITES_BASCULE = sels => [...sels, '.dashboard-cards-grid'].map(sel => sel + ' ' + [...document.querySelectorAll(sel)]
  .map(e => { const b = e.getBoundingClientRect(); return [b.left, b.top + window.scrollY, b.width, b.height].map(v => Math.round(v)).join(','); }).join(' '));
if (on('plateau')) {
  console.log('\n== plateau ==');
  const cas = ['groupes', 'cartes', 'cartes-trois'].flatMap(nom => VARIANTES.flatMap(variante => MOBILES.map(width => ({ nom, variante, width }))));
  const mesurer = async page => {
    const cibles = [];
    for (const [sel, i] of await page.evaluate(VISIBLES, CIBLES_PLATEAU)) { cibles.push({ sel, i, e: ecartsCible(await page.evaluate(CIBLE_PAGE, [sel, i])) }); }
    const debord = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    return { cibles, debord, cartes: await page.evaluate(ACTIONS_DANS_CARTE), tuiles: await page.evaluate(TUILES) };
  };
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const etats = { 'mini-profil plié': await mesurer(page) };
    if (PAGES[c.nom].mini && [375, 700].includes(c.width)) {
      await page.tap('.mobile-mini-profile-header');
      await page.waitForFunction(() => { const mp = document.querySelector('.mobile-mini-profile'); return mp && mp.classList.contains('expanded') && mp.getAnimations({ subtree: true }).every(a => a.playState !== 'running'); }, null, { timeout: 5000 });
      etats['mini-profil déplié'] = await mesurer(page);
    }
    await context.close();
    return { c, etats, erreurs };
  });
  for (const { c, etats, erreurs } of res) {
    for (const [etat, m] of Object.entries(etats)) {
      const lab = `plateau ${c.nom} ${c.variante} ${c.width} px (${etat})`;
      check(`${lab} : cibles à 44 × 44 aux cinq points (${m.cibles.length} relevées)`, () => {
        assert.ok(m.cibles.some(x => x.sel === '.dashboard-card-actions a') || c.nom === 'groupes', 'aucune action de carte');
        assert.ok(m.cibles.some(x => x.sel === '.dashboard-group-buttons .btn'), 'aucun bouton de groupe');
        if (etat === 'mini-profil déplié') { assert.ok(m.cibles.some(x => x.sel === '.mobile-mini-profile-manage-btn'), 'bouton de gestion du mini-profil absent'); }
        const e = m.cibles.filter(x => x.e.length).map(x => `${x.sel}[${x.i}] ${x.e.join(', ')}`);
        assert.deepEqual(e, [], e.slice(0, 3).join(' ; '));
      });
      check(`${lab} : actions dans leur carte, sans chevauchement ; aucun débordement horizontal`, () => {
        assert.deepEqual(m.cartes, []);
        assert.ok(m.debord <= 0, `débordement ${m.debord} px`);
      });
      if (m.tuiles.length) { check(`${lab} : tuiles d'action à 64 px (Q24.1)`, () => assert.deepEqual([...new Set(m.tuiles)], [64])); }
    }
    check(`plateau ${c.nom} ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
  const casR = ACCORDEONS.flatMap(([nom, entete, corps]) => VARIANTES.flatMap(variante => [320, 375, 767].map(width => ({ nom, entete, corps, variante, width }))));
  const resR = await mapLimit(casR, async c => {
    const { context, page } = await ouvrir({ ...c, script: userscript });
    const r = await page.evaluate(REPLI, [c.entete, c.corps]);
    await context.close();
    return { c, r };
  });
  for (const { c, r } of resR) {
    check(`plateau repli ${c.corps} ${c.variante} ${c.width} px : sans saut (premier instant à la hauteur dépliée), hauteur décroissante`, () => {
      assert.ok(r, 'aucun corps déplié');
      assert.ok(r.proprietes.includes('padding-top') && r.proprietes.includes('padding-bottom'), `transitions : ${r.proprietes.join(', ')}`);
      assert.ok(Math.abs(r.h[0] - r.h0) <= 0.5, `saut de ${r.h0 - r.h[0]} px au premier instant`);
      const k = r.h.findIndex((v, i) => i > 0 && v > r.h[i - 1] + 0.5);
      assert.equal(k, -1, `hauteur croissante à ${k * 10} ms : ${r.h.join(', ')}`);
    });
  }
  // Chargement : l'état initial des groupes n'est pas animé (aucun transitionrun sur la grille, groupe replié à 0 px dès sa première image).
  const casC = VARIANTES.flatMap(variante => [320, 375, 767].map(width => ({ nom: 'groupes', variante, width })));
  const resC = await mapLimit(casC, async c => {
    const { context, page } = await ouvrir({ ...c, script: userscript, init: CHARGEMENT_GROUPES });
    await frames(page);
    const r = await page.evaluate(() => window.__krChargement);
    await context.close();
    return { c, r };
  });
  for (const { c, r } of resC) {
    check(`plateau chargement groupes ${c.variante} ${c.width} px : aucune transition lancée sur la grille`, () => assert.deepEqual(r.transitions, []));
    check(`plateau chargement groupes ${c.variante} ${c.width} px : groupes repliés à 0 px dès leur première image`, () => {
      assert.ok(r.premiere, 'aucun groupe replié');
      assert.ok(r.premiere.every(h => h === 0), `hauteurs ${r.premiere.join(', ')}`);
    });
  }
  // prefers-reduced-motion: reduce : repli immédiat des deux accordéons, sans animation.
  const casM = ACCORDEONS.flatMap(([nom, entete, corps]) => VARIANTES.map(variante => ({ nom, entete, corps, variante, width: 375 })));
  const resM = await mapLimit(casM, async c => {
    const { context, page } = await ouvrir({ ...c, script: userscript, reducedMotion: 'reduce' });
    const r = await page.evaluate(REPLI, [c.entete, c.corps]);
    await context.close();
    return { c, r };
  });
  for (const { c, r } of resM) {
    check(`plateau mouvement réduit ${c.corps} ${c.variante} : repli sans animation, hauteur 0 au premier instant`, () => {
      assert.ok(r, 'aucun corps déplié');
      assert.deepEqual(r.proprietes, []);
      assert.equal(r.h[0], 0);
    });
  }
  // Bascule 767 -> 768 -> 767 px dans le même onglet : cibles et corps des groupes égaux à l'état initial.
  for (const variante of VARIANTES) {
    const { context, page } = await ouvrir({ nom: 'groupes', variante, width: 767, script: userscript });
    const initial = await page.evaluate(BOITES_BASCULE, CIBLES_PLATEAU);
    let recharges = 0;
    for (const w of [768, 767]) {
      await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = page.waitForEvent('load', { timeout: 8000 }).then(() => true).catch(() => false);
      await page.setViewportSize({ width: w, height: 667 });
      if (await charge) { recharges += 1; }
      await page.waitForFunction(m => document.body && document.body.classList.contains('mobile-mode') === m, w < 768, { timeout: 10000 });
      await prete(page, `bascule ${w} px ${variante}`);
      await frames(page);
    }
    const retour = await page.evaluate(BOITES_BASCULE, CIBLES_PLATEAU);
    await context.close();
    console.log(`  info bascule plateau ${variante} : ${recharges} rechargement(s) de page sur 2 changements de largeur`);
    check(`plateau bascule ${variante} 767 -> 768 -> 767 px : cibles et corps des groupes égaux à l'état initial`, () => assert.deepEqual(retour, initial));
  }
  const casB = ['groupes', 'cartes'].flatMap(nom => VARIANTES.flatMap(variante => BUREAUX.map(width => ({ nom, variante, width }))));
  const boites = async (c, script) => {
    const { context, page } = await ouvrir({ ...c, height: 720, script });
    const r = await page.evaluate(sels => sels.map(sel => sel + ' ' + [...document.querySelectorAll(sel)].map(e => { const b = e.getBoundingClientRect(); return [b.left, b.top + window.scrollY, b.width, b.height].map(v => Math.round(v * 2) / 2).join(','); }).join(' ')), CIBLES_PLATEAU);
    await context.close();
    return r;
  };
  const resB = await mapLimit(casB, async c => ({ c, teste: await boites(c, userscript), base: await boites(c, avant) }));
  for (const { c, teste, base } of resB) {
    check(`plateau bureau ${c.nom} ${c.variante} ${c.width} px : boîtes des cibles égales au bundle de base`, () => assert.deepEqual(teste, base));
  }
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
