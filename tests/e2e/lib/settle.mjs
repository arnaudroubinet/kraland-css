// Attentes par condition observable, partagées par les suites e2e (remplacent les waitForTimeout de « mise en place »).
// Les fenêtres d'observation d'une ABSENCE (« aucun rechargement », « aucune requête de plus ») restent des durées bornées, nommées et
// commentées dans chaque suite : attendre qu'un événement n'arrive pas n'a pas de condition positive.

const pause = ms => new Promise(r => setTimeout(r, ms));

/** Le thème est posé et la page n'est plus masquée par l'anti-FOUC (opacity 0 sur <html> jusqu'à la levée). */
export const THEME_READY = () => document.documentElement.classList.contains('kr-theme-enabled') && document.documentElement.style.opacity !== '0';

/** Fin d'initialisation du userscript : html[data-kr-ready], posé par InitQueue après toutes les tâches différées suivies. */
export const KR_READY = () => document.documentElement.hasAttribute('data-kr-ready');

/**
 * Observe le DOM pendant `ms` et décrit chaque mutation (au plus `max`). Sert au garde-fou de fin d'initialisation
 * (tests/e2e/fin-initialisation.mjs) et à l'audit facultatif KR_READY_AUDIT.
 */
export function watchMutations(page, { ms = 1000, max = 30 } = {}) {
  return page.evaluate(({ ms: dur, max: cap }) => new Promise(resolve => {
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
    setTimeout(() => { obs.disconnect(); resolve(out); }, dur);
  }), { ms, max });
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
