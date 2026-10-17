// Confinement réseau des suites e2e : aucune requête ne doit partir vers un vrai serveur (Kraland, GitHub, autre).
//
//   const context = await browser.newContext({ ... });
//   await confineNetwork(context);                         // EN PREMIER, avant les routes de fixtures
//   await context.route('http://www.kraland.org/**', ...); // routes autorisées, enregistrées après
//
// Playwright donne priorité à la DERNIÈRE route enregistrée : le refus global posé en premier ne s'applique donc qu'aux
// requêtes qu'aucune route de fixture ne sert (version.json de GitHub, logos du thème, hôte inconnu...). Toute nouvelle
// suite doit l'appeler sur chacun de ses contextes. Exception connue : un contexte qui doit garder le cache HTTP
// (menus-forums P et Q) ne peut pas avoir de route ; il se confine par --host-resolver-rules « MAP * ~NOTFOUND ».
//
// Les logos du thème (img7.kraland.org/2/world/logoN.gif) sont REFUSÉS, pas remplacés : un GIF 1 × 1 rétrécit le logo
// (28 px de large) et change la mise en page de la barre (breakpoint-switch#nav-origine à 1000 px : 114 px, deux lignes,
// devient 57 px, une ligne). Une suite qui a besoin d'images du site les route elle-même, après cet appel.

/**
 * Pose le refus global sur un contexte Playwright.
 * @param {import('playwright').BrowserContext} context contexte neuf, sans route encore
 * @returns {Promise<Array<{ method: string, url: string, type: string }>>} requêtes refusées, complétée au fil de l'eau
 */
export async function confineNetwork(context) {
  const denied = [];
  await context.route('**/*', route => {
    const req = route.request();
    denied.push({ method: req.method(), url: req.url(), type: req.resourceType() });
    return route.abort();
  });
  return denied;
}
