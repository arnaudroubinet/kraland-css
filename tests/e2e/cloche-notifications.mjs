// Cloche des notifications (ticket 8.2, R5) : sur ordinateur, la cloche ouvre /report dans un popup de 900×800 ; sur mobile, la fonction
// native openReport de main.js (600×600) est appelée telle quelle. Le module « CLOCHE DES NOTIFICATIONS » du template redéfinit openReport
// sur la fenêtre de la page au DOMContentLoaded, après main.js (script synchrone en fin de body) ; l'onclick en ligne de la cloche la
// résout au clic.
//   barre   992, 1280, 1440 et 1920 px : clic sur la cloche de .navbar-right (elementFromPoint vérifié avant) -> un seul
//           window.open('report', 'private_report', options natives en 900×800) ; openReport('x') garde l'URL 'report/x' ;
//   compact 768, 769 et 991 px : menu replié ouvert par le bouton de la barre, cloche vérifiée par elementFromPoint, puis même appel unique ;
//   mobile  375 × 667 et 767 px (body.mobile-mode) : clic sur le clone de .navbar-header-buttons-left -> appel natif 600×600 ;
//   bascule 767 -> 768 -> 767 et 768 -> 767 -> 768 dans le même onglet (rechargement de bascule attendu) : appel de chaque largeur ;
//           Options du popup hors largeur et hauteur = celles d'openReport dans vendor/parler/main.js (dérive détectée) ;
//           bac à sable (1280 px) : bundle exécuté avec unsafeWindow = fenêtre de la page et un window local proxifié dont open lève une
//           erreur -> le popup passe par la fenêtre de la page (w.open), pas par le window local ;
//   peau    peau coupée (kr-theme-enabled à false), 1280 px : appel natif 600×600, rien n'est redéfini ; peau coupée au clic par le bouton
//           de la barre (rechargement retenu par beforeunload) : appel natif 600×600.
// À toutes les largeurs : aucune requête vers /report (ni avant ni après le clic), aucune page ouverte, aucune erreur de page.
// SÉCURITÉ : /report marque toutes les notifications comme lues en un seul GET. Page = FIXTURE SYNTHÉTIQUE
// (tests/e2e/fixtures/cloche-notifications.html), réseau confiné (lib/confinement.mjs), window.open remplacé par une sonde AVANT tout
// script de la page : aucune fenêtre ne s'ouvre, aucune requête ne part.
//
// Usage : npm run build && npm run test:zone -- cloche
// Options : KR_SCRIPT (bundle testé), KR_FRAG = barre, compact, mobile, bascule, peau (vide = tout).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, THEME_READY } from './lib/settle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const html = fs.readFileSync(path.join(here, 'fixtures/cloche-notifications.html'), 'utf8');
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const BASE = 'http://www.kraland.org';
const PAGE = BASE + '/accueil';
const REPORT_RE = /^https?:\/\/[^/]+\/report(?:[/?#]|$)/;
const OPTIONS = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,copyhistory=yes,resizable=yes';
const NATIF = ['report', 'private_report', 'width=600,height=600,' + OPTIONS];
const POPUP = ['report', 'private_report', 'width=900,height=800,' + OPTIONS];
const DEUX = ['kraland', 'empire-brun-dark'];
const SANS_TAILLE = o => o.replace(/(?:^|,)(?:width|height)=\d+/g, '').replace(/^,/, '');
const optionsDe = src => { const m = /function openReport\s*\([^)]*\)\s*\{[^}]*'private_report'\s*,\s*'([^']+)'/.exec(src); return m ? m[1] : null; };
const OPTIONS_MAIN = optionsDe(fs.readFileSync(path.join(here, 'vendor/parler/main.js'), 'utf8'));
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const browser = await launchBrowser();

async function open(variante, viewport, { theme = true, bac = false } = {}) {
  const context = await browser.newContext({ viewport });
  const denied = await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route(PAGE, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/css/bootstrap1.min.css', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.css'), contentType: 'text/css' }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/js/bootstrap.min.js', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.js'), contentType: 'application/javascript' }));
  await context.route(BASE + '/lib/jquery-3.3.1/jquery-3.3.1.min.js', route => route.fulfill({ path: path.join(VENDOR, 'jquery.min.js'), contentType: 'application/javascript' }));
  const reports = [];
  context.on('request', req => { if (REPORT_RE.test(req.url())) { reports.push(req.url()); } });
  const pages = [];
  context.on('page', p => pages.push(p));
  await context.addInitScript(({ src, v, t, b }) => {
    // Sonde : window.open ne fait que noter ses arguments (aucune fenêtre, aucune requête), posée avant tout script de la page.
    window.__krOpens = [];
    window.open = function () { window.__krOpens.push([...arguments]); return null; };
    window.GM = { xmlHttpRequest: () => {} };
    localStorage.setItem('kr-theme-enabled', t ? 'true' : 'false');
    localStorage.setItem('kr-theme-variant', v);
    // Bac à sable simulé : window local proxifié (open lève une erreur), unsafeWindow = fenêtre de la page.
    const sandbox = () => {
      const page = window;
      const local = new Proxy(page, {
        get(cible, k) {
          if (k === 'open') { return () => { throw new Error('window.open du bac à sable appelé'); }; }
          const val = Reflect.get(cible, k);
          return (typeof val === 'function' && typeof k === 'string' && !/^[A-Z]/.test(k)) ? val.bind(cible) : val;
        },
        set(cible, k, val) { return Reflect.set(cible, k, val); }
      });
      // eslint-disable-next-line no-new-func
      new Function('window', 'unsafeWindow', src)(local, page);
    };
    // eslint-disable-next-line no-eval
    const go = () => (b ? sandbox() : (0, eval)(src));
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { src: userscript, v: variante, t: theme, b: bac });
  const page = await context.newPage();
  pages.length = 0;
  const erreurs = [];
  page.on('pageerror', e => erreurs.push(String(e.message).split('\n')[0]));
  await page.goto(PAGE, { waitUntil: 'load' });
  await krReady(page, { ready: theme ? THEME_READY : null, label: `${variante} ${viewport.width} px` });
  return { context, page, denied, reports, pages, erreurs };
}

// Porteur de la cloche visible : clone mobile sous 768 px, cloche de la barre au-delà. Centre touché par elementFromPoint avant le clic.
const viser = (page, mobile) => page.evaluate(m => {
  const a = document.querySelector(m ? '.navbar-header-buttons-left a:has(> i.fa-bell)' : '.navbar-right a:has(> i.fa-bell)');
  if (!a) { return { trouve: false }; }
  const b = a.getBoundingClientRect();
  const x = b.left + b.width / 2;
  const y = b.top + b.height / 2;
  const hit = document.elementFromPoint(x, y);
  return { trouve: true, x, y, touche: !!hit && a.contains(hit), cible: hit ? hit.tagName.toLowerCase() + [...hit.classList].map(c => '.' + c).join('') : 'aucune' };
}, mobile);
const ouvrirMenu = async page => {
  await page.click('nav.navbar .navbar-toggle');
  await page.waitForFunction(() => !!document.querySelector('#navbar.in') && !document.querySelector('.collapsing'));
};
const COMPACT = w => w >= 768 && w < 992;

// Un document : état, cloche visée, requêtes /report avant le clic, clic, appels de window.open, requêtes et pages après le clic.
async function cliquer(ctx, width) {
  const { page, reports, pages } = ctx;
  const etat = await page.evaluate(() => ({ mobile: document.body.classList.contains('mobile-mode'), theme: document.documentElement.classList.contains('kr-theme-enabled'), opens: window.__krOpens.length }));
  if (COMPACT(width)) { await ouvrirMenu(page); }
  const cible = await viser(page, width < 768);
  const avant = reports.length;
  if (cible.trouve && cible.touche) { await page.mouse.click(cible.x, cible.y); }
  // Un onclick qui lève une erreur laisse partir le lien href="" (rechargement) : le contexte détruit devient un échec lisible.
  const lire = fn => page.evaluate(fn).catch(e => 'contexte perdu après le clic : ' + e.message.split('\n')[0]);
  await lire(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
  const opens = await lire(() => window.__krOpens);
  return { etat, cible, avant, opens, reports: [...reports], pages: pages.length, url: page.url() };
}

function verifier(tag, r, attendu, { mobile }) {
  check(`${tag} : ${mobile ? 'mobile-mode posé' : 'pas de mobile-mode'}, aucun appel de window.open au chargement`, () => {
    assert.equal(r.etat.mobile, mobile);
    assert.equal(r.etat.opens, 0);
  });
  check(`${tag} : cloche ${mobile ? 'du clone mobile' : 'de la barre'} visible au centre (elementFromPoint)`, () => assert.ok(r.cible.trouve && r.cible.touche, JSON.stringify(r.cible)));
  check(`${tag} : un seul window.open(${attendu === POPUP ? '900×800' : 'natif 600×600'}) au clic`, () => assert.deepEqual(r.opens, [attendu]));
  check(`${tag} : aucune requête vers /report (avant ni après le clic), aucune page ouverte, page inchangée`, () => {
    assert.equal(r.avant, 0, 'avant le clic : ' + r.reports.join(', '));
    assert.deepEqual(r.reports, []);
    assert.equal(r.pages, 0);
    assert.equal(r.url, PAGE);
  });
}

async function cas(variante, width, height, opts = {}) {
  const ctx = await open(variante, { width, height }, opts);
  const r = await cliquer(ctx, width);
  r.denied = ctx.denied.filter(d => REPORT_RE.test(d.url)).map(d => d.url);
  r.erreurs = ctx.erreurs;
  if (opts.lien) {
    r.lien = await ctx.page.evaluate(() => { window.__krOpens.length = 0; window.openReport('x'); return window.__krOpens; });
  }
  await ctx.context.close();
  return r;
}
const sansErreur = (tag, r) => check(`${tag} : aucune erreur de page, aucune requête /report refusée`, () => { assert.deepEqual(r.erreurs, []); assert.deepEqual(r.denied, []); });

async function lot(titre, largeurs, attendu, opts = {}) {
  console.log(titre);
  const liste = largeurs.flatMap(([w, h]) => DEUX.map(v => ({ v, w, h })));
  const res = await mapLimit(liste, c => cas(c.v, c.w, c.h, opts));
  liste.forEach((c, i) => {
    const tag = `${c.w} px ${c.v}`;
    verifier(tag, res[i], attendu, { mobile: c.w < 768 });
    sansErreur(tag, res[i]);
    if (opts.lien) { check(`${tag} : openReport('x') garde l'URL 'report/x' en 900×800`, () => assert.deepEqual(res[i].lien, [['report/x', ...POPUP.slice(1)]])); }
  });
}

if (on('barre')) { await lot('Barre large (992, 1280, 1440 et 1920 px) : popup 900×800', [[992, 720], [1280, 720], [1440, 900], [1920, 1080]], POPUP, { lien: true }); }
if (on('barre')) {
  console.log('Options du popup comparées à openReport de vendor/parler/main.js (hors largeur et hauteur)');
  const fixture = optionsDe(html);
  check('main.js : options d\'openReport trouvées, fixture identique à main.js', () => { assert.ok(OPTIONS_MAIN, 'openReport introuvable dans main.js'); assert.equal(fixture, OPTIONS_MAIN); });
  check('constante du test = options de main.js hors largeur et hauteur', () => assert.equal(OPTIONS, SANS_TAILLE(OPTIONS_MAIN)));
  const r = await cas('kraland', 1280, 720);
  check('1280 px : options du popup = options de main.js hors largeur et hauteur, en 900×800', () => {
    assert.equal(r.opens.length, 1);
    assert.equal(SANS_TAILLE(r.opens[0][2]), SANS_TAILLE(OPTIONS_MAIN));
    assert.match(r.opens[0][2], /^width=900,height=800,/);
  });

  console.log('Bac à sable simulé (1280 px) : unsafeWindow = page, window local dont open lève une erreur');
  for (const v of DEUX) {
    const rb = await cas(v, 1280, 720, { bac: true });
    verifier(`bac à sable 1280 px ${v}`, rb, POPUP, { mobile: false });
    sansErreur(`bac à sable 1280 px ${v}`, rb);
  }
}
if (on('compact')) { await lot('Bureau compact (768, 769 et 991 px), menu replié ouvert : popup 900×800', [[768, 667], [769, 667], [991, 720]], POPUP); }
if (on('mobile')) { await lot('Mobile (375 × 667 et 767 px), clone de la cloche : fonction native 600×600', [[375, 667], [767, 667]], NATIF); }

if (on('peau')) {
  console.log('Peau coupée (1280 px) : fonction native 600×600');
  const r = await cas('kraland', 1280, 720, { theme: false });
  check('peau coupée 1280 px : kr-theme-enabled absent', () => assert.equal(r.etat.theme, false));
  check('peau coupée 1280 px : un seul window.open natif 600×600 au clic', () => assert.deepEqual(r.opens, [NATIF]));
  check('peau coupée 1280 px : aucune requête vers /report, aucune page ouverte', () => { assert.equal(r.avant, 0); assert.deepEqual(r.reports, []); assert.equal(r.pages, 0); });
  sansErreur('peau coupée 1280 px', r);

  console.log('Peau coupée au clic (1280 px), rechargement retenu : fonction native 600×600');
  for (const v of DEUX) {
    const ctx = await open(v, { width: 1280, height: 720 });
    const avant = await ctx.page.evaluate(() => {
      window.__krSansRecharge = true;
      window.addEventListener('beforeunload', e => { e.preventDefault(); e.returnValue = ''; });
      window.__krOpens.length = 0;
      window.openReport();
      return window.__krOpens.splice(0);
    });
    const dialogues = [];
    ctx.page.on('dialog', d => { dialogues.push(d.type()); d.dismiss(); }); // beforeunload refusé : pas de rechargement
    await ctx.page.click('#kr-toggle-css-btn');
    await ctx.page.waitForTimeout(200);
    const apres = await ctx.page.evaluate(() => {
      const res = { reste: window.__krSansRecharge === true, stocke: localStorage.getItem('kr-theme-enabled') };
      window.openReport();
      res.opens = window.__krOpens.splice(0);
      return res;
    });
    const reports = [...ctx.reports];
    const pages = ctx.pages.length;
    const erreurs = ctx.erreurs;
    await ctx.context.close();
    const t = `peau coupée au clic 1280 px ${v}`;
    check(`${t} : popup 900×800 avant la coupure`, () => assert.deepEqual(avant, [POPUP]));
    check(`${t} : peau coupée dans le stockage, page non rechargée`, () => { assert.equal(apres.stocke, 'false'); assert.equal(apres.reste, true, 'dialogues : ' + dialogues.join(', ')); });
    check(`${t} : un seul window.open natif 600×600 après la coupure`, () => assert.deepEqual(apres.opens, [NATIF]));
    check(`${t} : aucune requête vers /report, aucune page ouverte, aucune erreur de page`, () => { assert.deepEqual(reports, []); assert.equal(pages, 0); assert.deepEqual(erreurs, []); });
  }
}

// Bascule 767 ↔ 768 dans le même onglet, dans les deux sens : rechargement de bascule attendu (comme report-non-lu.mjs), puis clic.
async function bascule(variante, largeurs) {
  const ctx = await open(variante, { width: largeurs[0], height: 667 });
  const etapes = [];
  const recharges = [];
  for (let i = 0; i < largeurs.length; i += 1) {
    if (i > 0) {
      await ctx.page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = ctx.page.waitForEvent('load', { timeout: 8000 }).then(() => true, () => false);
      await ctx.page.setViewportSize({ width: largeurs[i], height: 667 });
      recharges.push(await charge);
      await krReady(ctx.page, { ready: THEME_READY, label: `bascule ${variante} ${largeurs[i]} px` });
    }
    etapes.push(await cliquer(ctx, largeurs[i]));
  }
  const denied = ctx.denied.filter(d => REPORT_RE.test(d.url)).map(d => d.url);
  const erreurs = ctx.erreurs;
  await ctx.context.close();
  return { etapes, recharges, denied, erreurs };
}
if (on('bascule')) {
  console.log('Bascule 767 ↔ 768 dans le même onglet, deux sens');
  const liste = DEUX.flatMap(variante => [[767, 768, 767], [768, 767, 768]].map(largeurs => ({ variante, largeurs })));
  const res = await mapLimit(liste, c => bascule(c.variante, c.largeurs));
  liste.forEach((c, i) => {
    const t = `bascule ${c.largeurs.join('>')} ${c.variante}`;
    check(`${t} : rechargement de bascule à chaque passage du seuil`, () => assert.deepEqual(res[i].recharges, c.largeurs.slice(1).map(() => true), 'load observé : ' + res[i].recharges.join(', ')));
    res[i].etapes.forEach((r, j) => verifier(`${t} étape ${j + 1} (${c.largeurs[j]})`, r, c.largeurs[j] < 768 ? NATIF : POPUP, { mobile: c.largeurs[j] < 768 }));
    sansErreur(t, res[i]);
  });
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
