// Vue Événements mobile (2 novembre 2026, retour d'Arnaud : « la vue événement mobile doit être retravaillée pour être mise au niveau du
// reste ») : module Evenements:Mobile du template (classes kr-ev-*, bouton de repli des filtres) et section « PAGE ÉVÉNEMENTS - Vue
// mobile » du thème. Fixture evenements-mobile.html (FIXTURE SYNTHÉTIQUE, forme reprise des captures du site réel) servie à
// /monde/evenements avec les feuilles natives du site (tests/e2e/vendor/parler).
//   mobile   320, 360 et 375 px, Kraland clair et Empire Brun sombre : aucun débordement horizontal ; filtres repliés par défaut, bouton
//            « Filtres » de 44 px au moins (aria-expanded), dépliés au toucher et état retenu au rechargement ; icône accolée au select
//            (même ligne) ; boutons 25/50/100/250 sur une ligne ; liste en carte à 8 px des bords, texte à 16 px ; chaque événement :
//            icône, heure et bouton lien (44 × 44, dans l'écran) sur la ligne de tête, texte dessous sur toute la largeur de la carte,
//            images contenues ; pagination sans bouton inactif, sur une ligne dès 360 px ;
//   bureau   768 et 1280 px : boîtes des éléments de la page égales au bundle de base (COMMIT_BASE), bouton de repli masqué.
// Rouge sur le bundle de base (KR_SCRIPT=<bundle de base>), vert après. KR_FRAG = mobile, bureau ; KR_SHOTS=<dossier> : captures.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { krReady, THEME_READY } from './lib/settle.mjs';
import { choisirVariante } from './lib/variantes.mjs';
import { figerVersion } from './lib/version-figee.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sansEntete = s => figerVersion(s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, ''));
const userscript = sansEntete(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_BASE = '7e28cd0'; // feature/next avant la vue Événements mobile
const base = sansEntete(execFileSync('git', ['show', `${COMMIT_BASE}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const PARLER = path.join(here, 'vendor/parler');
const SHOTS = process.env.KR_SHOTS || '';
const BASE = 'http://www.kraland.org';
const URL_PAGE = '/monde/evenements';
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);
const VARIANTES = ['kraland', 'empire-brun-dark'];

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}

const LIB = {
  'bootstrap-3.3.7/css/bootstrap1.min.css': 'bootstrap1.min.css', 'bootstrap-3.3.7/css/bootstrap.min.css': 'bootstrap1.min.css',
  'bootstrap-3.3.7/js/bootstrap.min.js': 'bootstrap.min.js', 'jquery-3.3.1/jquery-3.3.1.min.js': 'jquery.min.js',
  'kraland-7.0.9/css/main.css': 'main.css', 'kraland-7.0.9/css/bootswatch.css': 'bootswatch.css'
};
const image = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#a9adb3"/></svg>`;
const html = fs.readFileSync(path.join(here, 'fixtures/evenements-mobile.html'), 'utf8').replace(/^<!DOCTYPE html>\s*<!--[\s\S]*?-->\s*/, '<!DOCTYPE html>\n')
  .replace('</head>', ['main.css', 'bootswatch.css'].map(f => `<link rel="stylesheet" href="${BASE}/lib/kraland-7.0.9/css/${f}">`).join('\n') + '\n</head>');

const browser = await launchBrowser();

async function ouvrir({ width, variante, script = userscript, ouvert = null }) {
  const height = 720;
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height }, screen: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1, locale: 'fr-FR' });
  await confineNetwork(context);
  await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: /discours/.test(route.request().url()) ? image(800, 600) : image(24, 16) }));
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (route.request().resourceType() === 'document') {
      return u.pathname === URL_PAGE ? route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }) : route.abort();
    }
    const i = u.pathname.indexOf('/lib/');
    const rest = i >= 0 ? u.pathname.slice(i + 5) : '';
    if (LIB[rest]) { return route.fulfill({ path: path.join(PARLER, LIB[rest]), contentType: rest.endsWith('.css') ? 'text/css' : 'application/javascript' }); }
    if (rest.endsWith('.css')) { return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    return route.abort();
  });
  await context.addInitScript(choisirVariante, variante);
  if (ouvert !== null) { await context.addInitScript(v => { localStorage.setItem('kr-ev-filtres-ouverts', v); }, ouvert ? '1' : '0'); }
  await context.addInitScript(src => {
    window.GM = { xmlHttpRequest: () => {}, getValue: async (k, d) => d, setValue: async () => {} };
    window.addEventListener('submit', e => e.preventDefault(), true);
    window.HTMLFormElement.prototype.submit = () => {};
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, script);
  const p = await context.newPage();
  const erreurs = [];
  p.on('pageerror', e => erreurs.push(String(e.message).split('\n')[0]));
  await p.goto(BASE + URL_PAGE, { waitUntil: 'load' });
  await krReady(p, { ready: THEME_READY, label: `evenements ${variante} ${width} px` });
  await p.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
  return { context, p, erreurs };
}

// ---------- Mesures (dans la page) ----------
const ETAT = () => {
  const r = e => e.getBoundingClientRect();
  const vu = e => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const bouton = document.querySelector('.kr-ev-bascule');
  const form = document.querySelector('#col-left form');
  const table = document.querySelector('#col-right table.table');
  const lignes = [...document.querySelectorAll('tr.kr-ev-ligne')].map(tr => {
    const c = k => tr.querySelector('.kr-ev-' + k);
    const lien = tr.querySelector('.kr-ev-lien');
    const texte = c('texte');
    const imgs = [...texte.querySelectorAll('img')].map(i => r(i).right - r(texte).right);
    return { heure: c('heure') && r(c('heure')), icone: c('icone') && r(c('icone')), texte: r(texte), lien: lien && r(lien), imgs,
      texteG: r(texte).left, texteD: r(texte).right };
  });
  const lis = [...document.querySelectorAll('#col-right > .center:first-child ul.pagination > li')].filter(vu);
  const groupes = [...document.querySelectorAll('#col-left .input-group')].map(g => {
    const a = g.querySelector('.input-group-addon');
    const s = g.querySelector('select');
    return vu(s) ? { addon: r(a), select: r(s) } : null;
  }).filter(Boolean);
  const n4 = [...document.querySelectorAll('input[name="n[4]"]')].filter(vu).map(r);
  return {
    largeur: document.documentElement.clientWidth,
    debord: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    bouton: vu(bouton) ? { h: r(bouton).height, w: r(bouton).width, expanded: bouton.getAttribute('aria-expanded'), resume: bouton.textContent.trim() } : null,
    formVu: vu(form),
    table: table ? { g: r(table).left, d: r(table).right, classes: table.className } : null,
    lignes,
    pagination: lis.map(li => ({ top: Math.round(r(li).top), disabled: li.classList.contains('disabled'), w: r(li.querySelector('a')).width, h: r(li.querySelector('a')).height })),
    groupes,
    n4: n4.map(x => Math.round(x.top))
  };
};

const BOITES = () => [...document.querySelectorAll('#content *')].filter(e => e.getClientRects().length > 0).map(e => {
  const b = e.getBoundingClientRect();
  return `${e.tagName}.${typeof e.className === 'string' ? e.className.replace(/\bkr-ev-[\w-]+\b/g, '').trim() : ''} ${Math.round(b.left)},${Math.round(b.top)} ${Math.round(b.width)}×${Math.round(b.height)}`;
});

if (on('mobile')) {
  console.log('\n== mobile ==');
  for (const variante of VARIANTES) {
    for (const width of [320, 360, 375]) {
      const lab = `mobile ${variante} ${width} px`;
      const { context, p, erreurs } = await ouvrir({ width, variante });
      const ferme = await p.evaluate(ETAT);
      if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, `evenements-${variante}-${width}-ferme.png`), fullPage: true }); }
      if (ferme.bouton) { await p.click('.kr-ev-bascule'); }
      const ouvre = await p.evaluate(ETAT);
      const memoire = await p.evaluate(() => localStorage.getItem('kr-ev-filtres-ouverts'));
      if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `evenements-${variante}-${width}-ouvert.png`), fullPage: true }); }
      await context.close();

      check(`${lab} : aucun débordement horizontal (filtres fermés et ouverts)`, () => { assert.equal(ferme.debord, 0); assert.equal(ouvre.debord, 0); });
      check(`${lab} : filtres repliés par défaut, bouton de 44 px au moins avec résumé`, () => {
        assert.ok(ferme.bouton, 'bouton absent');
        assert.equal(ferme.formVu, false, 'formulaire visible');
        assert.equal(ferme.bouton.expanded, 'false');
        assert.ok(ferme.bouton.h >= 44, `bouton de ${ferme.bouton.h} px`);
        assert.match(ferme.bouton.resume, /Nation de la fixture/);
      });
      check(`${lab} : filtres dépliés au toucher, état retenu`, () => {
        assert.equal(ouvre.formVu, true);
        assert.equal(ouvre.bouton.expanded, 'true');
        assert.equal(memoire, '1');
      });
      check(`${lab} : icône accolée au select, sur la même ligne`, () => {
        assert.equal(ouvre.groupes.length, 4);
        for (const g of ouvre.groupes) {
          assert.ok(Math.abs(g.addon.top - g.select.top) <= 1, `addon à ${g.addon.top}, select à ${g.select.top}`);
          assert.ok(Math.abs(g.addon.right - g.select.left) <= 1, 'addon détaché du select');
        }
      });
      check(`${lab} : 25/50/100/250 sur une ligne`, () => { assert.equal(ouvre.n4.length, 4); assert.equal(new Set(ouvre.n4).size, 1, ouvre.n4.join(', ')); });
      check(`${lab} : liste en carte à 8 px des bords, texte à 16 px`, () => {
        assert.ok(ferme.table.classes.includes('kr-ev-liste'));
        assert.ok(Math.abs(ferme.table.g - 8) <= 0.5 && Math.abs(ferme.largeur - ferme.table.d - 8) <= 0.5, `carte ${ferme.table.g} / ${ferme.largeur - ferme.table.d}`);
        for (const l of ferme.lignes) {
          assert.ok(Math.abs(l.texteG - 16) <= 0.5 && Math.abs(ferme.largeur - l.texteD - 16) <= 0.5, `texte ${l.texteG} / ${ferme.largeur - l.texteD}`);
        }
      });
      check(`${lab} : icône, heure et lien sur la ligne de tête, texte dessous, images contenues`, () => {
        assert.equal(ferme.lignes.length, 4);
        for (const l of ferme.lignes) {
          assert.ok(l.heure.bottom <= l.texte.top + 0.5, 'heure sous le début du texte');
          assert.ok(l.icone.right <= l.heure.left, 'icône après l\'heure');
          assert.ok(l.lien, 'lien non marqué');
          assert.ok(l.lien.width >= 44 && l.lien.height >= 44, `lien ${l.lien.width} × ${l.lien.height}`);
          assert.ok(l.lien.right <= ferme.largeur - 8 && l.lien.bottom <= l.texte.top + 0.5, 'lien hors de la ligne de tête ou de la carte');
          for (const d of l.imgs) { assert.ok(d <= 0.5, `image déborde de ${d} px`); }
        }
      });
      check(`${lab} : pagination sans bouton inactif, cibles de 44 px${width >= 360 ? ', sur une ligne' : ''}`, () => {
        assert.ok(ferme.pagination.length > 0);
        assert.deepEqual(ferme.pagination.filter(x => x.disabled), []);
        for (const x of ferme.pagination) { assert.ok(x.w >= 44 && x.h >= 44, `${x.w} × ${x.h}`); }
        if (width >= 360) { assert.equal(new Set(ferme.pagination.map(x => x.top)).size, 1); }
      });
      check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
    }
  }
  // Repli retenu : filtres ouverts à la visite précédente, ouverts au chargement
  const { context, p } = await ouvrir({ width: 375, variante: 'kraland', ouvert: true });
  const e = await p.evaluate(ETAT);
  await context.close();
  check('mobile kraland 375 px : filtres ouverts au chargement quand ils l\'étaient', () => { assert.equal(e.formVu, true); assert.equal(e.bouton.expanded, 'true'); });
}

if (on('bureau')) {
  console.log('\n== bureau ==');
  for (const variante of VARIANTES) {
    for (const width of [768, 1280]) {
      const lab = `bureau ${variante} ${width} px`;
      const a = await ouvrir({ width, variante });
      const apres = await a.p.evaluate(BOITES);
      const bouton = await a.p.evaluate(() => { const b = document.querySelector('.kr-ev-bascule'); return !!b && b.getClientRects().length > 0; });
      await a.context.close();
      const b = await ouvrir({ width, variante, script: base });
      const avant = await b.p.evaluate(BOITES);
      await b.context.close();
      check(`${lab} : bouton de repli masqué`, () => assert.equal(bouton, false));
      check(`${lab} : boîtes égales au bundle de base`, () => {
        const ecarts = apres.map((x, i) => (x === avant[i] ? null : `${avant[i]} -> ${x}`)).filter(Boolean);
        assert.equal(apres.length, avant.length, 'nombre d\'éléments');
        assert.deepEqual(ecarts, [], ecarts.slice(0, 2).join(' ; '));
      });
    }
  }
}

await browser.close();
console.log(failures ? `\n${failures} échec(s)` : '\nTout est vert');
process.exit(failures ? 1 : 0);
