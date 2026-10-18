// Garde-fou de fin d'initialisation (lot B de l'accélération des tests) : html[data-kr-ready] n'est posé qu'APRÈS toutes les mutations
// différées de la mise en forme initiale. Les suites attendent ce marqueur à l'ouverture d'une page (lib/settle.mjs, krReady) au lieu
// d'une fenêtre de DOM calme : si un module modifie la page plus tard sans s'enregistrer auprès de la file d'initialisation
// (InitQueue.hold / later / debounce), ces suites mesureraient une page inachevée. Ce garde-fou le détecte :
//   1. pages représentatives (sous-forum, sous-forum à DataTables tardif, Kramail, plateau, barre large, sujet de forum avec tags),
//      mobile 375 et bureau 1280, script injecté au document-start (comme Tampermonkey : anti-FOUC actif) et au DOMContentLoaded
//      (comme la plupart des suites) : marqueur posé, puis AUCUNE mutation pendant WINDOW_MS ;
//   2. contre-preuves intégrées, sur des copies du bundle modifiées en mémoire : une tâche tardive NON enregistrée (setTimeout nu), la
//      levée anti-FOUC (revealPage) et le masquage des tags (HideTags) privés de leur enregistrement doivent être DÉTECTÉS ; la même tâche
//      tardive enregistrée (InitQueue.later), ou une fonction enregistrée qui renvoie une promesse réglée 600 ms plus tard, doit être
//      attendue par le marqueur (aucune mutation après lui) ;
//   3. page /profil/interface sans le titre « Thème de base » (l'interface du thème renonce, #kr-alerts-section n'apparaît jamais) :
//      le marqueur est quand même posé (addResetButtonToInterfacePage cesse d'attendre quand l'interface a renoncé, ~5 s) ;
//   4. même page, titre inséré tard par la page (THEME_TARDIF_MS) : l'interface du thème s'insère pendant ses essais et, au marqueur,
//      la liste des alertes masquées d'addResetButtonToInterfacePage est déjà présente (puis aucune mutation).
// Contre-preuves « détectée », déterministes (R1 de la QA du lot E) : une tâche privée de son enregistrement mute à une heure sans lien
// avec le marqueur ; sous charge (concurrence 16), revealPage (2 rAF + 200 ms) passait parfois AVANT le marqueur, donc avant l'observation
// (faux rouge). Chaque variante « détectée » attend donc, avant sa première mutation, que l'observateur du garde-fou écoute
// (window[ARMEE], posé par watchMutations sans toucher au DOM) : la mutation tombe toujours dans la fenêtre observée, quelle que soit la
// charge. Le code muté reste celui du produit (revealPage, applyNavbarPadding, hideForumThreadTags), seul son départ est retardé ; le
// marqueur ne peut pas l'attendre (rien n'est enregistré). Si la file attendait encore la tâche (enregistrement oublié de retirer), le
// marqueur ne viendrait jamais (l'observation suit le marqueur) : « marqueur posé » échouerait, jamais un faux vert. Chaque contre-preuve
// exige en outre la mutation du module visé (`vu`), pas n'importe laquelle : avant, la contre-preuve revealPage ne voyait que la barre
// (au document-start, <html> n'existait pas encore, le masquage anti-FOUC échouait en silence et revealPage ne levait rien).
// « attendue » ne dépend d'aucun seuil (le marqueur l'attend).
// Aucun réseau : refus global (lib/confinement.mjs), fixtures locales, Bootstrap/jQuery embarqués (tests/e2e/vendor).
//
// Usage : npm run build && node tests/e2e/fin-initialisation.mjs   (KR_SCRIPT=/chemin/script.user.js : autre bundle)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { KR_READY, watchMutations } from './lib/settle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const SRC = fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const BASE = 'http://www.kraland.org';
const VENDOR = path.join(here, 'vendor');
const FIX = f => fs.readFileSync(path.join(here, 'fixtures', f), 'utf8');
// Fenêtre d'observation après le marqueur : plus longue que tous les délais de mise en forme initiale du script (200 ms de revealPage et
// de fixNavbarPadding, 500 ms de HideTags, 150 ms des anti-rebonds), sans couvrir les rappels qui suivent une action (aucune ici).
const WINDOW_MS = 1000;
// Propriété de window posée par watchMutations quand l'observateur écoute (contre-preuves « détectée » ci-dessous).
const ARMEE = '__krGardeArmee';

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

// Sujet de forum minimal avec des liens de tags (masqués 500 ms après l'initialisation par ForumThread:HideTags).
const SUJET = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><base href="${BASE}/"><meta name="viewport" content="width=device-width, initial-scale=1"><title>FIXTURE sujet</title>
<link rel="stylesheet" href="lib/bootstrap-3.3.7/css/bootstrap1.min.css"></head><body>
<nav class="navbar navbar-inverse nomargin"><div class="container"><div class="navbar-header"><a class="navbar-brand" href="/">Kraland</a></div></div></nav>
<div id="content" class="container"><div class="row"><div id="col-right" class="col-md-12"><h1 class="page-header">Sujet de test</h1>
<p class="tags"><a href="forum/tags/alpha">alpha</a> <a href="forum/tags/beta">beta</a></p>
<ul class="media-list"><li class="media"><div class="media-body"><p>Premier message.</p></div></li></ul>
</div></div></div><footer class="navbar-inverse"><div class="container white">pied</div></footer>
<script src="lib/jquery-3.3.1/jquery-3.3.1.min.js"></script><script src="lib/bootstrap-3.3.7/js/bootstrap.min.js"></script></body></html>`;

// Page « interface » du profil, minimale. Avec le titre « Thème de base », l'interface du thème s'insère ; sans lui, elle renonce.
const INTERFACE = (titre, extra = '') => `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><base href="${BASE}/"><meta name="viewport" content="width=device-width, initial-scale=1"><title>FIXTURE interface</title>
<link rel="stylesheet" href="lib/bootstrap-3.3.7/css/bootstrap1.min.css"></head><body>
<nav class="navbar navbar-inverse nomargin"><div class="container"><div class="navbar-header"><a class="navbar-brand" href="/">Kraland</a></div></div></nav>
<div id="content" class="container"><div class="row"><div id="col-right" class="col-md-12"><h1 class="page-header">Interface</h1>
<h4>${titre}</h4><form class="form-horizontal"><div class="radio"><label><input type="radio" name="theme" value="1"> Thème 1</label></div></form>
</div></div></div><footer class="navbar-inverse"><div class="container white">pied</div></footer>
<script src="lib/jquery-3.3.1/jquery-3.3.1.min.js"></script><script src="lib/bootstrap-3.3.7/js/bootstrap.min.js"></script>${extra}</body></html>`;
// R2 (QA du lot C) : cas réel du joueur, l'interface du site affiche son titre « Thème de base » tard. Le script de la page l'insère
// à THEME_TARDIF_MS, pendant les essais de insertTampermonkeyThemeUI (25 × 200 ms) : l'interface du thème s'insère alors, et
// addResetButtonToInterfacePage doit encore l'attendre pour ajouter la liste des alertes masquées avant le marqueur.
const THEME_TARDIF_MS = 1500;
const TITRE_TARDIF = `<script>setTimeout(function () { var h = document.createElement('h4'); h.textContent = 'Thème de base'; document.querySelector('#col-right form').before(h); }, ${THEME_TARDIF_MS});</script>`;

const PAGES = [
  { id: 'sous-forum', url: '/forum/hrp/debuter-20102', html: FIX('sous-forum-debuter.html') },
  { id: 'sous-forum-dt-tardif', url: '/forum/hrp/debuter-20102?dt=late', html: FIX('sous-forum-debuter.html') },
  { id: 'kramail-reception', url: '/kramail/personnage-fictif-2000-0', html: FIX('kramail-reception.html') },
  { id: 'kramail-nouveau', url: '/kramail/post/nouveau-4-2000', html: FIX('kramail-nouveau.html') },
  { id: 'plateau', url: '/jouer/plateau', html: FIX('plateau-qualite-usage.html') },
  // barre sur deux lignes de 992 à 1359 px : à 1000 px, fixNavbarPadding pose padding-top et max-height (rien à 1280 px)
  { id: 'plateau-barre-large', url: '/jouer/plateau', html: FIX('plateau-navbar-large.html'), widths: [375, 1000, 1280] },
  { id: 'sujet-tags', url: '/forum/sujet/fixture-1-2', html: SUJET },
  { id: 'profil-interface', url: '/profil/interface', html: INTERFACE('Thème de base') },
  // S1 (QA du lot B) : sans titre « Thème de base », #kr-alerts-section n'apparaît jamais ; avant le lot C, la file restait tenue
  { id: 'profil-interface-sans-theme', url: '/profil/interface', html: INTERFACE('Préférences') },
  // R2 (QA du lot C) : titre « Thème de base » inséré par la page à THEME_TARDIF_MS ; au marqueur, la liste des alertes masquées est là
  { id: 'profil-interface-theme-tardif', url: '/profil/interface', html: INTERFACE('Préférences', TITRE_TARDIF), alertsList: true }
];

// Fragmentation (lot H, exécution parallèle) : KR_FRAG = start, dcl (pages représentatives injectées au document-start ou au
// DOMContentLoaded), contre-preuves ; vide = tout jouer. Chaque sonde ouvre SON contexte : aucun état partagé entre fragments.
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const frag = id => FRAG.length === 0 || FRAG.includes(id);
if (FRAG.some(id => !['start', 'dcl', 'contre-preuves'].includes(id))) { console.log(`  FAIL KR_FRAG inconnu : ${FRAG.join(',')} (attendus : start, dcl, contre-preuves)`); process.exit(1); }

const browser = await launchBrowser();

// Ouvre une page avec le bundle `src`, injecté au document-start (`start`) ou au DOMContentLoaded (`dcl`). Renvoie l'état au marqueur
// et les mutations observées pendant WINDOW_MS après lui (lib/settle.mjs, watchMutations).
async function probe({ page: pg, width, mode, src = SRC }) {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height: 800 }, isMobile: mobile, hasTouch: mobile });
  await confineNetwork(context); // refus global EN PREMIER (logos du thème, version.json : refusés)
  const path0 = new URL(BASE + pg.url).pathname;
  await context.route(BASE + '/**', r => {
    const u = new URL(r.request().url());
    if (r.request().resourceType() === 'document' && u.pathname === path0) { return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: pg.html }); }
    if (u.pathname.startsWith('/lib/bootstrap') || u.pathname.startsWith('/lib/jquery')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return r.fulfill({ status: 200, contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(path.join(VENDOR, file)) });
    }
    return r.abort();
  });
  await context.addInitScript(({ code, when }) => {
    window.GM = { xmlHttpRequest: () => {} };
    localStorage.setItem('kr-theme-enabled', 'true');
    localStorage.setItem('kr-theme-variant', 'empire-brun-dark');
    // eslint-disable-next-line no-eval
    const go = () => { (0, eval)(code); window.__krFoucPose = document.documentElement.style.opacity === '0'; };
    // document-start : Playwright exécute ce script AVANT la création de <html> (document.documentElement nul) ; le masquage anti-FOUC
    // (style de <html>) échouait alors en silence et revealPage ne levait rien. Comme Tampermonkey, on lance le script dès que <html>
    // existe, document encore en cours d'analyse (readyState « loading ») : l'anti-FOUC est réellement actif.
    if (when === 'start') {
      if (document.documentElement) { go(); } else { new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); go(); } }).observe(document, { childList: true }); }
    } else { document.addEventListener('DOMContentLoaded', go); }
  }, { code: src, when: mode });
  const p = await context.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e.message)));
  const t0 = Date.now();
  try {
    await p.goto(BASE + pg.url, { waitUntil: 'load' });
    let ready = true;
    await p.waitForFunction(KR_READY, null, { timeout: 15000 }).catch(() => { ready = false; });
    const readyMs = Date.now() - t0;
    const atReady = await p.evaluate(() => ({
      opacity: document.documentElement.style.opacity, transition: document.documentElement.style.transition, foucPose: window.__krFoucPose === true,
      tardif: document.body.getAttribute('data-garde-tardif'),
      alertsList: !!document.querySelector('#kr-alerts-section .kr-dismissed-alerts-list')
    }));
    const late = ready ? await watchMutations(p, { ms: WINDOW_MS, armed: ARMEE }) : [];
    return { ready, readyMs, atReady, late, errors };
  } finally {
    await context.close();
  }
}

// Bundle modifié en mémoire : chaque remplacement doit trouver son texte UNE fois (sinon la contre-preuve ne prouverait rien). Le bundle
// généré est minifié (noms raccourcis) : les variantes partent donc de la SOURCE (template + CSS en clair, comme build.js sans
// minification), celle que les modules modifient.
const TEMPLATE_SRC = fs.readFileSync(path.join(root, 'kraland-userscript-template.js'), 'utf8')
  .replace("'__CSS_CONTENT__'", () => '`' + fs.readFileSync(path.join(root, 'kraland-theme.css'), 'utf8').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$') + '`');
function variant(pairs) {
  let s = TEMPLATE_SRC;
  for (const [from, to] of pairs) {
    const n = s.split(from).length - 1;
    if (n !== 1) { throw new Error(`texte à remplacer trouvé ${n} fois : ${from}`); }
    s = s.replace(from, () => to);
  }
  return s;
}

// Sondes en parallèle, au plus `size` à la fois (file d'attente : une sonde lente ne bloque pas les autres) ; résultats dans l'ordre des jobs.
async function runAll(jobs, size = 7) {
  const out = new Array(jobs.length);
  let next = 0;
  const worker = async () => { while (next < jobs.length) { const i = next++; out[i] = { j: jobs[i], r: await probe(jobs[i]) }; } };
  await Promise.all(Array.from({ length: Math.min(size, jobs.length) }, worker));
  return out;
}

try {
  // 1. Pages représentatives : marqueur posé, puis plus aucune mutation ------------------------------------------------------------
  const jobs = [];
  for (const mode of ['start', 'dcl'].filter(frag)) { for (const pg of PAGES) { for (const width of pg.widths || [375, 1280]) { jobs.push({ page: pg, width, mode }); } } }
  // Les sondes lentes partent dans le premier lot : « sans thème » (marqueur à ~5 s, après les essais de l'interface du thème), puis
  // « thème tardif » (marqueur après THEME_TARDIF_MS)
  const lent = j => ({ 'profil-interface-sans-theme': 2, 'profil-interface-theme-tardif': 1 })[j.page.id] || 0;
  jobs.sort((a, b) => lent(b) - lent(a));
  const results = await runAll(jobs);
  for (const { j, r } of results) {
    const tag = `${j.page.id} ${j.width} px (${j.mode === 'start' ? 'document-start' : 'DOMContentLoaded'})`;
    check(`${tag} : html[data-kr-ready] posé`, () => { assert.equal(r.ready, true, 'marqueur absent après 15 s'); });
    check(`${tag} : aucune mutation pendant ${WINDOW_MS} ms après le marqueur`, () => { assert.deepEqual(r.late, [], r.late.slice(0, 3).join(' | ')); });
    if (j.page.alertsList) {
      check(`${tag} : au marqueur, la liste des alertes masquées (.kr-dismissed-alerts-list) est dans #kr-alerts-section`, () => { assert.equal(r.atReady.alertsList, true); });
    }
    if (j.mode === 'start') {
      check(`${tag} : masquage anti-FOUC posé à l'injection (la levée est réellement exercée)`, () => { assert.equal(r.atReady.foucPose, true); });
      check(`${tag} : au marqueur, la levée anti-FOUC est terminée (opacity et transition inline nettoyées)`, () => { assert.deepEqual([r.atReady.opacity, r.atReady.transition], ['', '']); });
    }
    check(`${tag} : aucune erreur de page`, () => { assert.deepEqual(r.errors, []); });
  }
  const ms = results.map(x => x.r.readyMs).sort((a, b) => a - b);
  if (ms.length) { console.log(`  info marqueur atteint en ${ms[0]} à ${ms[ms.length - 1]} ms après le début de la navigation (médiane ${ms[Math.floor(ms.length / 2)]} ms)`); }

  // 2. Contre-preuves : l'oubli d'enregistrement est détecté, l'enregistrement est attendu ----------------------------------------
  if (frag('contre-preuves')) {
    const ANCRE = "InitQueue.register('ForumThread:HideTags', hideForumThreadTags, 26);";
    const tache = appel => `${ANCRE}\n    InitQueue.register('garde:tardif', function () { ${appel}(function () { document.body.setAttribute('data-garde-tardif', '1'); }, 600); }, 999);`;
    // Tâche NON enregistrée : 600 ms, puis elle attend elle-même que le garde-fou observe (donc après le marqueur) avant de muter : la
    // mutation tombe toujours dans la fenêtre observée, quelle que soit l'heure du marqueur ; le marqueur n'a pas pu l'attendre.
    const nue = `${ANCRE}\n    InitQueue.register('garde:tardif', function () { setTimeout(function f() { if (!window.${ARMEE}) { setTimeout(f, 20); return; } document.body.setAttribute('data-garde-tardif', '1'); }, 600); }, 999);`;
    // Départ différé jusqu'à l'observation : requestAnimationFrame local (revealPage, fixNavbarPadding) ou setTimeout (HideTags) qui attend
    // window[ARMEE] avant de lancer le code du produit inchangé.
    const rafApresGarde = `const requestAnimationFrame = function (cb) { (function w() { if (window.${ARMEE}) { window.requestAnimationFrame(cb); } else { setTimeout(w, 20); } })(); };`;
    const sansHold = nom => [`const release = InitQueue.hold('${nom}');`, `const release = function () {}; ${rafApresGarde}`];
    const timeoutApresGarde = `(function (cb, ms) { setTimeout(function w() { if (window.${ARMEE}) { cb(); } else { setTimeout(w, 20); } }, ms); })(() => {`;
    const promesse = `${ANCRE}\n    InitQueue.register('garde:promesse', function () { return new Promise(function (r) { setTimeout(function () { document.body.setAttribute('data-garde-tardif', '1'); r(); }, 600); }); }, 999);`;
    // `vu` : la mutation tardive attendue, celle du module privé de son enregistrement (une autre mutation ne prouverait rien).
    let cas;
    try {
      cas = [
        { id: 'tâche tardive NON enregistrée (setTimeout nu, 600 ms)', src: variant([[ANCRE, nue]]), page: PAGES[4], mode: 'dcl', expect: 'detect', vu: / attributes data-garde-tardif .*> body$/ },
        { id: 'tâche tardive enregistrée (InitQueue.later, 600 ms)', src: variant([[ANCRE, tache("InitQueue.later.bind(InitQueue, 'garde:tardif')")]]), page: PAGES[4], mode: 'dcl', expect: 'wait' },
        { id: 'module enregistré renvoyant une promesse réglée à 600 ms', src: variant([[ANCRE, promesse]]), page: PAGES[4], mode: 'dcl', expect: 'wait' },
        // revealPage et fixNavbarPadding ont le même délai (2 rAF / 1 rAF + 200 ms) : on retire les deux enregistrements pour la levée
        // anti-FOUC (la barre du plateau mute aussi : seule la mutation du style de <html> compte), puis le seul padding sur la barre large.
        { id: 'levée anti-FOUC (revealPage) et padding de barre privés de leur enregistrement', src: variant([sansHold('revealPage'), sansHold('fixNavbarPadding')]), page: PAGES[4], mode: 'start', expect: 'detect', vu: /^\d+ ms attributes style html[^ ]*$/ },
        { id: 'padding de barre large (fixNavbarPadding) privé de son enregistrement', src: variant([sansHold('fixNavbarPadding')]), page: PAGES[5], width: 1000, mode: 'dcl', expect: 'detect', vu: / attributes style .*> body$/ },
        { id: 'masquage des tags (HideTags) privé de son enregistrement', src: variant([["InitQueue.later('ForumThread:HideTags', () => {", timeoutApresGarde]]), page: PAGES[6], mode: 'dcl', expect: 'detect', vu: /p\.tags/ }
      ];
    } catch (e) {
      check('contre-preuves : textes du bundle à modifier présents une fois chacun', () => { throw e; });
      cas = [];
    }
    const proofs = await runAll(cas.map(c => ({ page: c.page, width: c.width || 1280, mode: c.mode, src: c.src })), 5);
    proofs.forEach(({ r }, i) => {
      const c = cas[i];
      check(`contre-preuve, ${c.id} : marqueur posé`, () => { assert.equal(r.ready, true); });
      if (c.expect === 'detect') {
        check(`contre-preuve, ${c.id} : mutation tardive DÉTECTÉE par le garde-fou`, () => { assert.ok(r.late.some(m => c.vu.test(m)), r.late.length ? `mutation du module absente (${c.vu}) parmi : ${r.late.slice(0, 3).join(' | ')}` : 'aucune mutation après le marqueur : le garde-fou ne verrait pas l\'oubli'); });
      } else {
        check(`contre-preuve, ${c.id} : déjà appliquée au marqueur, aucune mutation après lui`, () => { assert.equal(r.atReady.tardif, '1'); assert.deepEqual(r.late, [], r.late.slice(0, 3).join(' | ')); });
      }
    });
  }
} finally {
  await browser.close();
}

console.log(failures ? `${failures} échec(s)` : 'Fin d\'initialisation conforme : html[data-kr-ready] suit toutes les mutations différées');
process.exit(failures ? 1 : 0);
