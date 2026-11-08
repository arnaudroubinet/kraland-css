// Titre de rang du forum (8 novembre 2026, retour d'Arnaud sur « This is the police » : l'intitulé de la fonction se cassait en colonne étroite à
// côté d'une icône mal alignée) : module addRankTitles du template (classe kr-rank-title, plus de style en ligne) et section « TITRE DE RANG
// DU FORUM » du thème. Fixture forum-sujet-rp.html (forme du DOM réel collé par Arnaud, colonne native de 80 px supposée) servie à
// /forum/sujet/… avec les feuilles natives du site (tests/e2e/vendor/parler).
//   bureau  768 et 1280 px, Kraland clair et sombre : colonne de 112 px pour tous les messages du sujet (corps alignés), rangée du rang
//           contenue dans la colonne, icône au-dessus du texte et centrée, intitulé long en 3 lignes au plus, court en une ligne, texte au rôle
//           détail (13 px) en couleur secondaire, aucun style en ligne ;
//   mobile  320, 375 et 767 px : icône et texte sur une ligne, à gauche, sous le nom ; drapeau de nation réduit devant le nom, sur sa ligne ;
//           aucun débordement horizontal ;
//   hors    sujet sans rang (forum-sujet.html, 1280 px) : boîtes égales au bundle de base.
// Rouge sur le bundle de base (KR_SCRIPT=<bundle de base>), vert après. KR_FRAG = bureau, mobile, hors ; KR_SHOTS=<dossier> : captures.
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
const COMMIT_BASE = '8a55c66'; // feature/next avant le titre de rang
const base = sansEntete(execFileSync('git', ['show', `${COMMIT_BASE}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const PARLER = path.join(here, 'vendor/parler');
const SHOTS = process.env.KR_SHOTS || '';
const BASE = 'http://www.kraland.org';
const PAGES = { rp: { url: '/forum/sujet/this-is-the-police-335287-1', fixture: 'forum-sujet-rp.html' }, hrp: { url: '/forum/sujet/messages-v3-329425-1', fixture: 'forum-sujet.html' } };
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);
const VARIANTES = ['kraland', 'kraland-dark'];

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}

const LIB = {
  'bootstrap-3.3.7/css/bootstrap1.min.css': 'bootstrap1.min.css', 'bootstrap-3.3.7/css/bootstrap.min.css': 'bootstrap1.min.css',
  'bootstrap-3.3.7/js/bootstrap.min.js': 'bootstrap.min.js', 'jquery-3.3.1/jquery-3.3.1.min.js': 'jquery.min.js',
  'kraland-7.0.9/css/main.css': 'main.css', 'kraland-7.0.9/css/bootswatch.css': 'bootswatch.css'
};
const image = url => (/\/rank\//.test(url)
  ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="11" fill="#c9a227"/></svg>'
  : '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="26"><rect width="80" height="13" fill="#2f6b2f"/><rect y="13" width="80" height="13" fill="#7a1a1a"/></svg>');
const lire = f => fs.readFileSync(path.join(here, 'fixtures', f), 'utf8').replace(/^<!DOCTYPE html>\s*<!--[\s\S]*?-->\s*/, '<!DOCTYPE html>\n')
  .replace('</head>', ['main.css', 'bootswatch.css'].map(x => `<link rel="stylesheet" href="${BASE}/lib/kraland-7.0.9/css/${x}">`).join('\n') + '\n</head>');

const browser = await launchBrowser();

async function ouvrir({ width, variante, page = 'rp', script = userscript }) {
  const height = 900;
  const mobile = width < 768;
  const { url, fixture } = PAGES[page];
  const html = lire(fixture);
  const context = await browser.newContext({ viewport: { width, height }, screen: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1, locale: 'fr-FR' });
  await confineNetwork(context);
  await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: image(route.request().url()) }));
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (route.request().resourceType() === 'document') {
      return u.pathname === url ? route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }) : route.abort();
    }
    const i = u.pathname.indexOf('/lib/');
    const rest = i >= 0 ? u.pathname.slice(i + 5) : '';
    if (LIB[rest]) { return route.fulfill({ path: path.join(PARLER, LIB[rest]), contentType: rest.endsWith('.css') ? 'text/css' : 'application/javascript' }); }
    if (rest.endsWith('.css')) { return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    return route.abort();
  });
  await context.addInitScript(choisirVariante, variante);
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
  await p.goto(BASE + url, { waitUntil: 'load' });
  await krReady(p, { ready: THEME_READY, label: `rang ${variante} ${width} px` });
  await p.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
  return { context, p, erreurs };
}

// ---------- Mesures (dans la page) ----------
const ETAT = () => {
  const r = e => { const b = e.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, width: b.width, height: b.height }; };
  return {
    debord: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    messages: [...document.querySelectorAll('ul.media-list.forum > li.media')].map(li => {
      const ui = li.querySelector('.user-info');
      const rang = li.querySelector('[data-kr-rank-title]');
      const img = rang && rang.querySelector('img');
      const txt = rang && rang.querySelector('strong');
      const drapeau = li.querySelector('.cartouche img[src*="/world/"]');
      const nom = li.querySelector('.cartouche > strong') || li.querySelector('.user-info > strong');
      const cs = txt && getComputedStyle(txt);
      return {
        ui: r(ui), corps: r(li.querySelector('.media-body > .forum-msg')),
        rang: rang && { boite: r(rang), img: r(img), txt: r(txt), styleEnLigne: rang.getAttribute('style'), classe: rang.className,
          lignes: Math.round(txt.getBoundingClientRect().height / parseFloat(cs.lineHeight)), taille: cs.fontSize, couleur: cs.color, texte: txt.textContent },
        secondaire: getComputedStyle(document.documentElement).getPropertyValue('--kr-text-secondary').trim(),
        drapeau: drapeau && r(drapeau), nom: nom && r(nom)
      };
    })
  };
};
const BOITES = () => [...document.querySelectorAll('#content *')].filter(e => e.getClientRects().length > 0).map(e => {
  const b = e.getBoundingClientRect();
  return `${e.tagName}.${typeof e.className === 'string' ? e.className : ''} ${Math.round(b.left)},${Math.round(b.top)} ${Math.round(b.width)}×${Math.round(b.height)}`;
});
const rgb = hex => { const h = hex.replace('#', ''); return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`; };

if (on('bureau')) {
  console.log('\n== bureau ==');
  for (const variante of VARIANTES) {
    for (const width of [768, 1280]) {
      const lab = `bureau ${variante} ${width} px`;
      const { context, p, erreurs } = await ouvrir({ width, variante });
      const e = await p.evaluate(ETAT);
      if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, `rang-${variante}-${width}.png`), fullPage: true }); }
      await context.close();
      const avecRang = e.messages.filter(m => m.rang);
      check(`${lab} : 3 rangs posés, classe kr-rank-title, aucun style en ligne`, () => {
        assert.equal(avecRang.length, 3);
        for (const m of avecRang) { assert.equal(m.rang.classe, 'kr-rank-title'); assert.equal(m.rang.styleEnLigne, null); }
      });
      check(`${lab} : colonne de 112 px pour tous les messages, corps alignés`, () => {
        for (const m of e.messages) { assert.ok(Math.abs(m.ui.width - 112) <= 0.5, `colonne de ${m.ui.width} px`); }
        assert.equal(new Set(e.messages.map(m => Math.round(m.corps.left))).size, 1, 'corps décalés');
      });
      check(`${lab} : rang contenu dans la colonne, icône centrée au-dessus du texte`, () => {
        for (const m of avecRang) {
          assert.ok(m.rang.boite.left >= m.ui.left - 0.5 && m.rang.boite.right <= m.ui.right + 0.5, `rang ${m.rang.boite.left}-${m.rang.boite.right}, colonne ${m.ui.left}-${m.ui.right}`);
          assert.ok(m.rang.txt.left >= m.ui.left - 0.5 && m.rang.txt.right <= m.ui.right + 0.5, 'texte hors colonne');
          assert.ok(m.rang.img.bottom <= m.rang.txt.top + 0.5, 'icône à côté du texte');
          assert.ok(Math.abs((m.rang.img.left + m.rang.img.right) / 2 - (m.ui.left + m.ui.right) / 2) <= 1, 'icône décentrée');
        }
      });
      check(`${lab} : intitulé long en 3 lignes au plus, court en une ligne`, () => {
        assert.ok(avecRang[0].rang.lignes <= 3, `${avecRang[0].rang.texte} : ${avecRang[0].rang.lignes} lignes`);
        assert.equal(avecRang[2].rang.lignes, 1, `${avecRang[2].rang.texte} : ${avecRang[2].rang.lignes} lignes`);
      });
      check(`${lab} : texte au rôle détail (13 px), couleur secondaire`, () => {
        for (const m of avecRang) { assert.equal(m.rang.taille, '13px'); assert.equal(m.rang.couleur, rgb(m.secondaire)); }
      });
      check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
    }
  }
}

if (on('mobile')) {
  console.log('\n== mobile ==');
  for (const variante of VARIANTES) {
    for (const width of [320, 375, 767]) {
      const lab = `mobile ${variante} ${width} px`;
      const { context, p, erreurs } = await ouvrir({ width, variante });
      const e = await p.evaluate(ETAT);
      if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, `rang-${variante}-${width}.png`), fullPage: true }); }
      await context.close();
      const avecRang = e.messages.filter(m => m.rang);
      check(`${lab} : aucun débordement horizontal`, () => assert.equal(e.debord, 0));
      check(`${lab} : icône et texte sur une ligne, à gauche, sous le nom`, () => {
        assert.equal(avecRang.length, 3, JSON.stringify(e.messages.map(m => m.rang && m.rang.texte)));
        for (const m of avecRang) {
          assert.equal(m.rang.styleEnLigne, null);
          assert.ok(m.rang.img.right <= m.rang.txt.left + 0.5, 'icône au-dessus du texte');
          assert.ok(m.rang.img.top < m.rang.txt.bottom && m.rang.txt.top < m.rang.img.bottom, 'icône et texte sur deux lignes');
          assert.ok(Math.abs(m.rang.img.left - m.nom.left) <= 1 || Math.abs(m.rang.img.left - m.drapeau.left) <= 1, `rang à ${m.rang.img.left}, nom à ${m.nom.left}`);
          assert.ok(m.rang.boite.top >= m.nom.bottom - 0.5, 'rang au-dessus du nom');
        }
      });
      check(`${lab} : drapeau de nation réduit devant le nom, sur sa ligne`, () => {
        for (const m of e.messages) {
          assert.ok(m.drapeau.width <= 40.5, `drapeau de ${m.drapeau.width} px`);
          assert.ok(m.drapeau.right <= m.nom.left + 0.5, 'drapeau au-dessus du nom');
          assert.ok(m.drapeau.top < m.nom.bottom && m.nom.top < m.drapeau.bottom, 'drapeau hors de la ligne du nom');
        }
      });
      check(`${lab} : texte au rôle détail (13 px), couleur secondaire`, () => {
        for (const m of avecRang) { assert.equal(m.rang.taille, '13px'); assert.equal(m.rang.couleur, rgb(m.secondaire)); }
      });
      check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
    }
  }
}

if (on('hors')) {
  console.log('\n== hors ==');
  for (const variante of VARIANTES) {
    const lab = `sujet sans rang ${variante} 1280 px`;
    const a = await ouvrir({ width: 1280, variante, page: 'hrp' });
    const apres = await a.p.evaluate(BOITES);
    await a.context.close();
    const b = await ouvrir({ width: 1280, variante, page: 'hrp', script: base });
    const avant = await b.p.evaluate(BOITES);
    await b.context.close();
    check(`${lab} : boîtes égales au bundle de base`, () => {
      const ecarts = apres.map((x, i) => (x === avant[i] ? null : `${avant[i]} -> ${x}`)).filter(Boolean);
      assert.equal(apres.length, avant.length, 'nombre d\'éléments');
      assert.deepEqual(ecarts, [], ecarts.slice(0, 2).join(' ; '));
    });
  }
}

await browser.close();
console.log(failures ? `\n${failures} échec(s)` : '\nTout est vert');
process.exit(failures ? 1 : 0);
