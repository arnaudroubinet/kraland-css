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
// Hauteurs du sous-forum avec la pastille à 12 px : sous-forum.mjs (checkNewmsg). Hors de ces tickets : boutons compacts et
// pagination (4.3, 4.4), rayons (4.8), espacement (4.9).
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
//           KR_FRAG = jetons, mobile, bureau, mini-profil, bascule, boutons, boutons-bascule (vide = tout).
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
import { choisirVariante, poserJetonsRedefinis } from './lib/variantes.mjs';

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

async function ouvrir({ nom, width, height = 720, variante, script, label13 = false, tactile = width < 768, def: defBoutons, toucher = tactile }) {
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

async function releverBoutons({ nom, width, variante, script, toucher }) {
  const def = PAGES_BOUTONS[nom];
  const mobile = width < 768;
  const { context, page, erreurs } = await ouvrir({ nom, width, height: mobile ? 667 : 900, variante, script, def, toucher });
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
  const res = await mapLimit(cas, async c => ({ c, r: await releverBoutons({ ...c, script: userscript }),
    a: PAGES_BOUTONS[c.nom].exclus.length ? await releverBoutons({ ...c, script: PAGES_BOUTONS[c.nom].base === 'modales' ? avantModales : avantBoutons }) : null }));
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

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
