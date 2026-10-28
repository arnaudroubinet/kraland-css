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
//   hors-perimetre  Règles, sous-forum, index RP, réception du kramail, notifications et Cybermonde à 375 et 767 px : sans kr-marge-mobile,
//                   boîtes de tous les textes égales au bundle de base (socle zéro sans le style en ligne d'applyMobileCriticalStyles).
// Pages = FIXTURES SYNTHÉTIQUES (tests/e2e/fixtures), servies à leurs adresses ; vrai Bootstrap 3.3.7 (tests/e2e/vendor). Aucun accès au
// site réel. Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base, défaut : git show e203f87), KR_FRAG = mobile, bureau,
// bascule, hors-perimetre (vide = tout).
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
import { choisirVariante } from './lib/variantes.mjs';
import { CARTES_SECTION, TEXTES_HORS_MARGE_PAGE } from './lib/marges.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const userscript = sansEntete(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_AVANT = 'de4c079';
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
  regles: { url: '/regles/base', html: lire('regles-recherche.html'), classe: null },
  'sous-forum': { url: '/forum/hrp/debuter-20102', html: lire('sous-forum-debuter.html'), classe: null },
  'index-rp': { url: '/forum/rp', html: lire('forum-index-rp.html'), classe: null },
  reception: { url: '/kramail/personnage-fictif-2000-0', html: lire('kramail-reception.html'), classe: null },
  report: { url: '/report', html: avecBootstrap(lire('report-non-lu.html')), classe: null },
  cyber: { url: '/map', html: lire('cybermonde-ville.html'), classe: null }
};
const DANS = Object.keys(PAGES).filter(k => PAGES[k].classe);
const HORS = Object.keys(PAGES).filter(k => !PAGES[k].classe);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}

const browser = await launchBrowser();

async function ouvrir({ nom, width, height = 667, variante, script, tactile = width < 768 }) {
  const def = PAGES[nom];
  const context = await browser.newContext({ viewport: { width, height }, isMobile: tactile, hasTouch: tactile, deviceScaleFactor: 1 });
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
    classes: ['kr-page-jeu', 'kr-page-aide', 'kr-marge-mobile'].filter(c => h.contains(c)),
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

function controlerMarge(m, hors) {
  assert.ok(m.theme, 'kr-theme-enabled absent');
  assert.ok(m.mobile, 'mode mobile absent');
  assert.ok(m.sw <= m.vw, `débordement horizontal ${m.sw} > ${m.vw}`);
  const t = hors.map(x => `« ${x.texte} » ${x.gauche}/${x.droite} (${x.chemin})`);
  assert.deepEqual(t, [], `${t.length} texte(s) à moins de ${MARGE} px : ${t.slice(0, 3).join(' ; ')}`);
  assert.ok(m.cartes.length > 0, 'aucune carte de section');
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
async function parcours(script, variante, largeurs) {
  const { context, page, erreurs } = await ouvrir({ nom: 'perso', width: largeurs[0], variante, script, tactile: false });
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
    etapes.push({ width, m: await page.evaluate(ETAT, CARTES_SECTION), hors: await page.evaluate(TEXTES_HORS_MARGE_PAGE, { marge: MARGE }), r: await page.evaluate(RELEVE) });
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

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
