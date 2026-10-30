// Attentes par condition observable, partagées par les suites e2e (remplacent les waitForTimeout de « mise en place »).
// Les fenêtres d'observation d'une ABSENCE (« aucun rechargement », « aucune requête de plus ») restent des durées bornées, nommées et
// commentées dans chaque suite : attendre qu'un événement n'arrive pas n'a pas de condition positive. krReady ne prouve pas non plus
// une absence (« aucun bloc n'apparaît ») : il ne couvre que les tâches enregistrées dans InitQueue ; une telle vérification ajoute,
// après lui, watchMutations sur une durée nommée (ex. ABSENCE_MS de croix-directionnelle) avec zéro mutation attendue.

const pause = ms => new Promise(r => setTimeout(r, ms));

// ---------------------------------------------------------------------------------------------------------------------------
// Horloge simulée (lot D) : une fenêtre d'absence de rechargement se joue en temps SIMULÉ (page.clock) au lieu d'être attendue.
// installClock(context) installe l'horloge de Playwright AVANT tout addInitScript du test (le userscript capte ainsi les minuteries
// simulées dès le début du document) et pose window.__krLeaving = true sur beforeunload (événement distribué de façon synchrone par
// location.reload() : un départ est visible juste après le pas qui l'a déclenché). Hors des pas, le temps simulé suit le temps réel.
// runClock(page, ms) avance l'horloge de `ms` par pas de CLOCK_STEP_MS et s'arrête au premier départ de document. Pourquoi des pas :
// chaque runFor est rejoué par Playwright dans les documents suivants ; un seul runFor(2 500) interrompu par un rechargement ferait
// sauter l'horloge du document suivant de 2,5 s et fausserait le garde-fou (écart minimal de 1 200 ms entre deux rechargements).
// Avec des pas, l'avance excédentaire est bornée par un pas (100 ms), bien en dessous des délais du produit (anti-rebond 400 ms,
// écart minimal 1 200 ms). Chaque pas attend aussi une VRAIE image peinte (requestAnimationFrame d'origine, capté avant l'horloge, qui
// simule aussi requestAnimationFrame) : le navigateur garde ses étapes de rendu (autofocus, événements resize, mise en page) entre deux
// pas, au lieu que 2,5 s de minuteries passent avant la première image ; sans cela, un champ autofocus pouvait ne pas encore avoir le
// focus quand l'anti-rebond de 400 ms vérifiait la saisie en cours. Limite connue : performance.timeOrigin est simulé et identique d'un
// document à l'autre ; pour identifier un document, utiliser window.__krDocId (posé par installClock).
// Option paused (installClock(context, { paused: true })) : hors des pas, le temps simulé ne suit plus le temps réel. Sans elle, le
// document suivant un rechargement dérive en temps réel : Playwright 1.59 rejoue son journal d'horloge en deux lots (le premier appel
// à Date.now du userscript précède les entrées runFor, ajoutées après lui), et le second lot ajoute les écarts RÉELS entre les pas,
// puis relance l'horloge en temps réel (mesuré : 500 ms simulées par 500 ms réelles, même après pauseAt). Une durée simulée entre
// deux rechargements dépend alors de la charge de la machine. En pause, chaque pas est suivi d'un pauseAt à l'heure simulée exacte,
// qui ramène le second lot à cette heure et le laisse en pause : Date.now ne vient plus que des pas. Limite (lecture du code de
// Playwright, non mesurée) : pauseAt ne recale pas performance.now ni les échéances ; ils gardent l'écart réel du premier pas du
// second lot (borné à un pas).
export const CLOCK_STEP_MS = 100;
const pausedClocks = new WeakMap();

export async function installClock(context, { paused = false } = {}) {
  // AVANT l'horloge : les scripts d'initialisation s'exécutent dans l'ordre d'ajout, celui-ci voit donc le requestAnimationFrame réel
  await context.addInitScript(() => {
    const raf = window.requestAnimationFrame.bind(window);
    const timeout = window.setTimeout.bind(window);
    // Une vraie image, bornée à 250 ms réelles (page sans rendu : on n'attend pas indéfiniment)
    window.__krRealFrame = () => new Promise(r => { let done = false; const end = () => { if (!done) { done = true; r(); } }; raf(end); timeout(end, 250); });
  });
  await context.clock.install();
  await context.addInitScript(() => {
    window.__krLeaving = false;
    window.__krDocId = Math.random();
    window.__krResizes = 0;
    window.addEventListener('beforeunload', () => { window.__krLeaving = true; });
    window.addEventListener('resize', () => { window.__krResizes += 1; });
  });
  if (paused) {
    const at = { time: Date.now() + 1000 };
    await context.clock.pauseAt(at.time);
    pausedClocks.set(context, at);
  }
}

/**
 * Redimensionne et attend que l'événement resize de ce changement soit distribué (le navigateur le déclenche à l'image suivante, en
 * temps réel ; compteur window.__krResizes posé par installClock). Les anti-rebonds du script partent donc DANS la fenêtre simulée qui
 * suit. Sans changement de largeur ni de hauteur, rien à attendre.
 */
export async function resizeViewport(page, width, height) {
  const before = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight, n: window.__krResizes }));
  await page.setViewportSize({ width, height });
  if (before.w !== width || before.h !== height) { await waitState(page, n => window.__krResizes > n, before.n, { maxMs: 5000 }); }
}

/** Attend (temps réel, sans lever d'erreur avant `maxMs`) que le document courant soit chargé et ne soit pas en train d'être quitté. */
export async function clockDocument(page, { maxMs = 15000, label = 'document' } = {}) {
  const t0 = Date.now();
  for (;;) {
    const ok = await page.evaluate(() => document.readyState === 'complete' && window.__krLeaving === false).catch(() => false);
    if (ok) { return; }
    if (Date.now() - t0 > maxMs) { throw new Error(`${label} : document jamais chargé en ${maxMs} ms`); }
    await pause(20);
  }
}

/**
 * Équivalent de probeQuiet sous horloge simulée : `probe()` identique avant et après une fenêtre de `quietMs` SIMULÉES sans départ de
 * document. Un départ (rechargement) relance une fenêtre sur le document suivant. Jamais stable en `maxRounds` fenêtres : erreur.
 */
export async function clockQuiet(page, probe, { quietMs = 900, maxRounds = 10, label = 'état' } = {}) {
  for (let round = 0; round < maxRounds; round += 1) {
    await clockDocument(page, { label });
    const before = await probe().then(v => JSON.stringify(v), () => null);
    const { left } = await runClock(page, quietMs);
    if (left || before === null) { continue; }
    const after = await probe().then(v => JSON.stringify(v), () => null);
    if (after === before) { return JSON.parse(after); }
  }
  throw new Error(`${label} : jamais stable en ${maxRounds} fenêtres de ${quietMs} ms simulées`);
}

/**
 * Avance l'horloge simulée de `ms` (pas de CLOCK_STEP_MS) ; { left: true, at } dès qu'un document est quitté (beforeunload, contexte
 * détruit, ou déjà un autre document : __krDocId différent), sinon { left: false }.
 */
export async function runClock(page, ms, { stepMs = CLOCK_STEP_MS } = {}) {
  // État du document après une vraie image peinte (voir l'en-tête) ; contexte détruit = document quitté
  const doc = () => page.evaluate(() => window.__krRealFrame().then(() => ({ leaving: window.__krLeaving === true, id: window.__krDocId }))).catch(() => ({ leaving: true, id: null }));
  const start = await doc();
  if (start.leaving) { return { left: true, at: 0 }; }
  for (let t = 0; t < ms; t += stepMs) {
    const step = Math.min(stepMs, ms - t);
    await page.clock.runFor(step).catch(() => {});
    const at = pausedClocks.get(page.context());
    if (at) { at.time += step; await page.clock.pauseAt(at.time).catch(() => {}); }
    const now = await doc();
    if (now.leaving || now.id !== start.id) { return { left: true, at: t + stepMs }; }
  }
  return { left: false };
}

/** Le thème est posé et la page n'est plus masquée par l'anti-FOUC (opacity 0 sur <html> jusqu'à la levée). */
export const THEME_READY = () => document.documentElement.classList.contains('kr-theme-enabled') && document.documentElement.style.opacity !== '0';

/** Fin d'initialisation du userscript : html[data-kr-ready], posé par InitQueue après toutes les tâches différées suivies. */
export const KR_READY = () => document.documentElement.hasAttribute('data-kr-ready');

/**
 * Observe le DOM pendant `ms` et décrit chaque mutation (au plus `max`). Sert au garde-fou de fin d'initialisation
 * (tests/e2e/fin-initialisation.mjs) et à l'audit facultatif KR_READY_AUDIT. `armed` (nom de propriété de window, facultatif) : posée
 * à true dès que l'observateur écoute (sans mutation du DOM), pour qu'une contre-preuve puisse muter à coup sûr PENDANT l'observation.
 */
export function watchMutations(page, { ms = 1000, max = 30, armed = null } = {}) {
  return page.evaluate(({ ms: dur, max: cap, armed: flag }) => new Promise(resolve => {
    const t0 = performance.now();
    const out = [];
    const where = n => {
      const e = n && n.nodeType === 1 ? n : n && n.parentElement;
      if (!e) { return '#' + (n && n.nodeName); }
      const parts = [];
      for (let x = e; x && x.nodeType === 1 && parts.length < 4; x = x.parentElement) {
        parts.unshift(x.nodeName.toLowerCase() + (x.id ? '#' + x.id : '') + (x.classList && x.classList.length ? '.' + [...x.classList].slice(0, 2).join('.') : ''));
      }
      return parts.join(' > ');
    };
    const obs = new MutationObserver(recs => {
      for (const r of recs) {
        if (out.length >= cap) { break; }
        const added = [...r.addedNodes].map(n => n.nodeName).slice(0, 3).join(',');
        const removed = [...r.removedNodes].map(n => n.nodeName).slice(0, 3).join(',');
        out.push(`${Math.round(performance.now() - t0)} ms ${r.type}${r.attributeName ? ' ' + r.attributeName : ''} ${where(r.target)}${added ? ' +' + added : ''}${removed ? ' -' + removed : ''}`);
      }
    });
    obs.observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
    if (flag) { window[flag] = true; }
    setTimeout(() => { obs.disconnect(); resolve(out); }, dur);
  }), { ms, max, armed });
}

/**
 * Attend la fin d'initialisation du userscript (html[data-kr-ready]), puis la condition `ready` facultative, puis deux images peintes.
 * Remplace domQuiet aux ouvertures et navigations quand le userscript tourne : le marqueur est posé APRÈS les traitements
 * différés (révélation anti-FOUC, padding de barre, anti-rebonds), donc sans fenêtre de calme. Expiration à `maxMs` : erreur explicite.
 * KR_READY_AUDIT=<fichier> : observe en plus 1,5 s après le marqueur et ajoute au fichier une ligne JSON par mutation tardive.
 */
export async function krReady(page, { ready = null, maxMs = 15000, label = 'page' } = {}) {
  await page.waitForFunction(KR_READY, null, { timeout: maxMs }).catch(e => { throw new Error(`${label} : html[data-kr-ready] absent après ${maxMs} ms (${String(e.message).split('\n')[0]})`); });
  if (ready) { await page.waitForFunction(ready, null, { timeout: maxMs }).catch(e => { throw new Error(`${label} : condition non atteinte en ${maxMs} ms (${String(e.message).split('\n')[0]})`); }); }
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
  if (process.env.KR_READY_AUDIT) {
    const late = await watchMutations(page, { ms: 1500 });
    if (late.length) {
      const fs = await import('node:fs');
      fs.appendFileSync(process.env.KR_READY_AUDIT, JSON.stringify({ suite: process.argv[1], frag: process.env.KR_FRAG || '', label, url: page.url(), late }) + '\n');
    }
  }
}

/** Deux images peintes (ou `n`) : les événements scroll / resize de la mise à jour du rendu ont été distribués. */
export function frames(page, n = 2) {
  return page.evaluate(count => new Promise(r => { const step = k => (k <= 0 ? r() : requestAnimationFrame(() => step(k - 1))); step(count); }), n);
}

/**
 * Attend une condition observable `fn(arg)` (évaluée dans la page) au plus `maxMs`, SANS lever d'erreur : renvoie true si elle est
 * atteinte. Sert quand la vérification qui suit doit rester celle qui échoue (message et compte de vérifications inchangés) : une
 * condition jamais atteinte ne fait qu'attendre `maxMs`, puis la vérification mesure l'état réel et échoue.
 */
export async function waitState(page, fn, arg = null, { maxMs = 5000 } = {}) {
  return page.waitForFunction(fn, arg, { timeout: maxMs }).then(() => true, () => false);
}

/**
 * Style d'un élément posé : l'élément `sel` (n° `index`) vérifie le pseudo-état `state` (':hover', ':active', facultatif) et aucune
 * transition ni animation finie n'est encore en cours (getAnimations, sous-arbre compris) ; puis une image. Remplace les attentes fixes avant
 * une mesure de couleurs. Sans lever d'erreur (borne `maxMs`) : la mesure qui suit tranche.
 */
export async function styleSettled(page, sel, { index = 0, state = null, maxMs = 3000 } = {}) {
  await waitState(page, ({ s, i, st }) => {
    const el = document.querySelectorAll(s)[i];
    if (!el || (st && !el.matches(st))) { return false; }
    return el.getAnimations({ subtree: true }).every(a => a.playState !== 'running' || a.effect.getComputedTiming().iterations === Infinity);
  }, { s: sel, i: index, st: state }, { maxMs });
  await frames(page, 1);
}

/**
 * Attend (1) la condition `ready` (fonction évaluée dans la page, facultative), puis (2) que le DOM soit calme : aucune mutation pendant
 * `quietMs`, suivie de deux images peintes. Expiration à `maxMs` : erreur explicite, jamais un faux vert par attente trop courte.
 */
export async function domQuiet(page, { ready = null, quietMs = 500, maxMs = 15000, label = 'page' } = {}) {
  if (ready) { await page.waitForFunction(ready, null, { timeout: maxMs }).catch(e => { throw new Error(`${label} : condition non atteinte en ${maxMs} ms (${String(e.message).split('\n')[0]})`); }); }
  await page.evaluate(({ quiet, max, name }) => new Promise((resolve, reject) => {
    let timer = null;
    const hard = setTimeout(() => { obs.disconnect(); reject(new Error(`${name} : DOM jamais calme en ${max} ms`)); }, max);
    const done = () => { obs.disconnect(); clearTimeout(hard); requestAnimationFrame(() => requestAnimationFrame(() => resolve())); };
    const arm = () => { clearTimeout(timer); timer = setTimeout(done, quiet); };
    const obs = new MutationObserver(arm);
    obs.observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
    arm();
  }), { quiet: quietMs, max: maxMs, name: label });
}

/**
 * Attend que `probe()` (async, renvoie une valeur JSON-sérialisable) reste identique pendant `quietMs`. Une erreur de sonde (page en
 * rechargement) remet le compteur à zéro. Sert aux transitions de largeur : un rechargement change la sonde, l'absence de rechargement
 * la laisse stable. Expiration à `maxMs` : erreur explicite.
 */
export async function probeQuiet(probe, { quietMs = 900, maxMs = 20000, label = 'état' } = {}) {
  const t0 = Date.now();
  let last = null; let since = Date.now();
  while (Date.now() - t0 < maxMs) {
    let cur;
    try { cur = JSON.stringify(await probe()); } catch (_e) { cur = 'ERR'; }
    if (cur !== last) { last = cur; since = Date.now(); } else if (cur !== 'ERR' && Date.now() - since >= quietMs) { return JSON.parse(cur); }
    await pause(50);
  }
  throw new Error(`${label} : jamais stable en ${maxMs} ms`);
}
