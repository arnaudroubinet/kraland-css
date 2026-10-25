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
//   lignes    index RP, HRP, Communauté, Débats et racine à groupes à 375 et 767 px (HRP et Débats : index RP servi à leur chemin), Kraland clair et Empire Brun sombre : chaque ligne ≥ 72 px dans la
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
//             catégorie longue : lien d'au plus la moitié du fil, libellé à ellipse, courant entier, aucun débordement ; contraste ≥ 4,5:1 dans les 16 variantes ; sujet, page de réponse, page
//             hors forum et bureau (768, 769, 1280) égaux au bundle de 5042afd ; seuil 767 non tactile ; bascule 768 -> 767 -> 768 -> 767.
// Bundle de base : celui de 0523d7f (commit de base du plan, figé), sauf KR_SCRIPT_AVANT. Fixtures synthétiques du dépôt seulement ; le
// #flap et les ancres renommées sont posés en mémoire. Vrai Bootstrap 3.3.7 (tests/e2e/vendor), confinement réseau, aucune requête hors
// fixture. Repères partagés (fixtures, classes de page, ligne, flèche) importés de lib/variantes.mjs (routeur, MAX_CITING).
// Fixtures citées pour le routage des fixtures : forum-index-rp.html, forum-racine-groupes.html, sous-forum-debuter.html (règle de fichier),
// et pour le fragment fil : forum-colonne-native-hrp.html, typographie-forum-redaction.html, palette-nation.html (noms tenus dans
// lib/variantes.mjs, REPERES_FIL_TICKET63). Fragment fil : bundle de base de 5042afd (COMMIT_FIL), sauf KR_SCRIPT_AVANT_FIL.
// Le fil de sujet et l'index Communauté ne sont nommés que dans lib/variantes.mjs (ACTIVITE_TICKET62) : leurs noms portent des repères
// déjà cités par 3 suites (MAX_CITING).
//
// Usage : npm run build && node tests/e2e/forum-activite.mjs   (ou : npm run test:zone -- forum-activite)
// Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base), KR_SCRIPT_AVANT_FIL (bundle de base du fragment fil),
//           KR_FRAG = ancres, parcours, lignes, seuil, bureau, fil (vide = tout).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, THEME_READY } from './lib/settle.mjs';
import { ACTIVITE_TICKET62 as A, CONTRASTE, REPERES_FIL_TICKET63 as R, VARIANTES as TOUTES_VARIANTES } from './lib/variantes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const strip = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const userscript = strip(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_AVANT = '0523d7f';
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
  // Aucune fixture d'index HRP ni Débats : l'index RP est servi à leurs chemins (la classe de page suit le chemin).
  hrp: { url: '/forum/hrp', html: fixture(A.indexRp) },
  debats: { url: '/forum/debats', html: fixture(A.indexRp) },
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

const COMMIT_FIL = '5042afd';
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

  // Sujet, réponse et hors forum : égaux au bundle de base (fil, bouton flottant, empreinte du contenu).
  const casB = [
    ...[375, 767].flatMap(width => VARIANTES.map(variante => ({ cle: 'sujet', width, variante }))),
    ...[375, 768].flatMap(width => VARIANTES.map(variante => ({ cle: 'reponse', width, variante }))),
    ...VARIANTES.map(variante => ({ cle: 'regles', width: 375, variante })),
    // Bureau : index RP, sous-forum (colonne native) et sujet.
    ...['rp', 'debuterNatif', 'sujet'].flatMap(cle => [768, 769, 1280].flatMap(width => VARIANTES.map(variante => ({ cle, width, variante }))))
  ];
  const resB = await mapLimit(casB, async c => ({ teste: await lireFil(await ouvrir(c), true), base: await lireFil(await ouvrir({ ...c, src: baseFil }), true) }));
  casB.forEach(({ cle, width, variante }, i) => {
    const { teste, base } = resB[i];
    const quoi = width >= 768 ? 'aucun fil, ' : (cle === 'sujet' ? 'un seul conteneur (fil du sujet), ' : '');
    check(`fil ${cle} ${variante} ${width} px : ${quoi}égal au bundle de base (${COMMIT_FIL}) : fil, bouton flottant et empreinte du contenu, aucune exception`, () => {
      assert.ok(teste.f.theme && base.f.theme, 'kr-theme-enabled absent');
      if (width >= 768) { assert.equal(teste.f.conteneurs.filter(c => c.cls === R.fil).length, 0, 'fil au bureau'); }
      if (cle === 'sujet' && width < 768) { assert.deepEqual(teste.f.conteneurs.map(c => c.cls), [R.filSujet], 'conteneurs de fil du sujet'); }
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

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
