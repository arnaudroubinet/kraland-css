// Navigateur des suites e2e (lot H, levier 3) : un seul Chromium partagé par test:all, chaque fragment s'y connecte.
//
//   import { launchBrowser } from './lib/navigateur.mjs';
//   const browser = await launchBrowser();            // au lieu de chromium.launch({ headless: true })
//   const context = await browser.newContext({ ... }); // TOUJOURS un contexte neuf par fragment ou scénario
//   await confineNetwork(context);                     // confinement, init scripts et page.clock : posés sur CHAQUE contexte, comme avant
//   ...
//   await browser.close();                             // ferme les contextes de ce fragment, puis se déconnecte (ne tue pas le partagé)
//
// Fonctionnement : run.mjs lance UN serveur Chromium (chromium.launchServer, headless shell comme chromium.launch({ headless: true }))
// et passe son adresse aux fragments dans KR_BROWSER_WS. launchBrowser() s'y connecte (chromium.connect). Sans KR_BROWSER_WS (suite
// lancée seule, ou KR_SHARED_BROWSER=0), il lance son propre Chromium, exactement comme avant le levier 3.
// Gain mesuré (lot H) : -19 à -30 % de RSS au pic, -2,5 à -6 % de CPU, durée identique, ~45 processus de moins à concurrence 16.
//
// ISOLATION : un contexte Playwright est un profil éphémère séparé (localStorage, cookies, IndexedDB, cache HTTP, service workers,
// permissions) ; page.clock, addInitScript et context.route sont posés sur le contexte, pas sur le navigateur. Un client connecté ne voit
// que SES contextes (browser.contexts()) : un fragment ne peut ni lire ni réutiliser le contexte d'un autre. Ne jamais garder un contexte
// d'un scénario à l'autre : newContext() à chaque fois.
//
// FERMETURE : browser.close() ferme d'abord, un par un, les contextes ouverts par ce fragment, puis coupe la connexion. Si le fragment
// meurt sans fermer, le serveur détruit à la déconnexion tous les contextes de cette connexion.
//
// ÉCHAPPEMENT : KR_SHARED_BROWSER=0 npm run test:all  -> un Chromium par fragment (comportement d'avant le levier 3). À utiliser pour
// diagnostiquer un doute sur le partage (fragment qui passe seul et échoue dans test:all, ou l'inverse).
//
// RESTENT À PART, avec leur propre chromium.launch() (et non ce helper) :
//   - confinement-reseau.mjs : sa sonde dynamique exige un navigateur lancé avec --host-resolver-rules (hôtes externes -> puits local,
//     reste introuvable) ; les règles DNS sont un argument de lancement, impossible sur un navigateur partagé ;
//   - menus-forums P et Q (realBrowser) : vrai cache HTTP (aucune route possible), confinés par --host-resolver-rules « MAP * ~NOTFOUND »
//     et www.kraland.org dirigé vers leur serveur local : argument de lancement, propre à chaque fragment ;
//   - toute demande d'options de LANCEMENT (args, executablePath, channel, headless: false...) : launchBrowser() les reconnaît et lance
//     alors un navigateur à part (ex. menus-forums avec KR_CHROMIUM, navigateur local de repli) ; un navigateur partagé ne peut pas les
//     honorer. Un fragment qui exigerait un navigateur neuf (état au niveau du processus navigateur) ou un autre binaire que le headless
//     shell passe par là. Aucun autre fragment n'en a besoin au lot H : toutes les suites travaillent dans des contextes neufs.
import { chromium } from 'playwright';

/** Vrai si le navigateur partagé est désactivé (KR_SHARED_BROWSER=0, false, no, non). */
export function sharedDisabled(env = process.env) {
  return /^(0|false|no|non)$/i.test(String(env.KR_SHARED_BROWSER || '').trim());
}

/**
 * Navigateur du fragment : connexion au Chromium partagé de run.mjs (KR_BROWSER_WS), sinon lancement propre.
 * @param {import('playwright').LaunchOptions} [options] options de LANCEMENT ; toute option autre que headless: true force un navigateur à part
 * @returns {Promise<import('playwright').Browser>}
 */
export async function launchBrowser(options = {}) {
  const own = Object.entries(options).filter(([k, v]) => v !== undefined && !(k === 'headless' && v === true));
  const ws = process.env.KR_BROWSER_WS;
  if (!ws || sharedDisabled() || own.length) { return chromium.launch({ headless: true, ...options }); }
  let browser;
  try {
    browser = await chromium.connect(ws, { timeout: 30000 });
  } catch (e) {
    // Jamais de repli silencieux : run.mjs voit l'échec du fragment et, si le partagé est tombé, le rejoue sur le navigateur relancé.
    throw new Error(`Navigateur partagé injoignable (KR_BROWSER_WS=${ws}) : ${e.message.split('\n')[0]}. Diagnostic : KR_SHARED_BROWSER=0.`);
  }
  const contexts = new Set();
  const newContext = browser.newContext.bind(browser);
  const close = browser.close.bind(browser);
  browser.newContext = async (...a) => {
    const ctx = await newContext(...a);
    contexts.add(ctx);
    ctx.on('close', () => contexts.delete(ctx));
    return ctx;
  };
  // browser.newPage() passe par un contexte neuf lui aussi (Playwright le crée et le ferme avec la page) : rien à suivre de plus.
  browser.close = async (...a) => {
    for (const ctx of [...contexts]) { await ctx.close().catch(() => {}); }
    return close(...a);
  };
  return browser;
}
