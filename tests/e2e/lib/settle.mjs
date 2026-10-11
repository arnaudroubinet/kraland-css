// Attentes par condition observable, partagées par les suites e2e (remplacent les waitForTimeout de « mise en place »).
// Les fenêtres d'observation d'une ABSENCE (« aucun rechargement », « aucune requête de plus ») restent des durées bornées, nommées et
// commentées dans chaque suite : attendre qu'un événement n'arrive pas n'a pas de condition positive.

const pause = ms => new Promise(r => setTimeout(r, ms));

/** Le thème est posé et la page n'est plus masquée par l'anti-FOUC (opacity 0 sur <html> jusqu'à la levée). */
export const THEME_READY = () => document.documentElement.classList.contains('kr-theme-enabled') && document.documentElement.style.opacity !== '0';

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
