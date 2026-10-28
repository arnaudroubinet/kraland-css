// Kramail — thème (épopée 7, entrée 1) : gardes de page sur <html> et dossiers natifs (Réception, Envoi, Corbeille) en Onglets de section
// libellés sur mobile. Pages = fixtures kramail existantes (tests/e2e/fixtures/kramail-*.html), servies en lieu et place du site.
//   gardes  : kr-page-kramail et une seule sous-garde (liste, lecture, compose) sur les 8 pages, plus « Répondre » sans textarea#dest
//             et « Signaler » (…-8-<id>, formulaire post_msg, pas une rédaction), dérivées en mémoire ; classe de rédaction sur body pour
//             les seules rédactions ; 375 et 1280 px ; injection en tête et au DOMContentLoaded.
//   onglets : 375 et 767 px, Kraland clair et Empire Brun sombre, injection en tête : trois onglets libellés en un rang pleine largeur,
//             libellé de 12 px (DESIGN Q14), retrait de 4 px, hauteur >= 44 px ; filet de 2 px dans la ligne des inactifs, filet de
//             3 px en couleur primaire dans la ligne du seul actif (600), sans bordure basse ; Nouveau, Contacts et « ••• » en carrés
//             >= 44 px, atteints par elementFromPoint.
//   bureau  : 768, 769 et 1280 px, deux variantes : styles calculés et rectangles du titre et de ses boutons égaux au bundle de base figé.
//   bascule : 767, 768 puis 767 px dans le même onglet : onglets, puis titre égal à la base, puis onglets.
// Confinement : refus global posé avant les routes de fixtures. Aucune requête ne quitte la machine.
//
// Usage : npm run build && npm run test:zone -- kramail
// Options : KR_SCRIPT (bundle testé), KR_SCRIPT_BASE (bundle de base, sinon celui du commit BASE_SHA), KR_FRAG (gardes, onglets, bureau, bascule).
// Contre-épreuve : KR_SCRIPT=<bundle de base> doit rendre gardes, onglets et bascule rouges.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { confineNetwork } from './lib/confinement.mjs';
import { launchBrowser } from './lib/navigateur.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, THEME_READY, domQuiet, styleSettled } from './lib/settle.mjs';
import { choisirVariante } from './lib/variantes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const strip = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const APRES = strip(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
// Base figée (A9) : feature/next au départ de l'épopée 7, avant ce ticket.
const BASE_SHA = '55ae556540e86100216fb3f0a4f089d09bcb72d0';
const BASE_BUNDLE = strip(process.env.KR_SCRIPT_BASE
  ? fs.readFileSync(process.env.KR_SCRIPT_BASE, 'utf8')
  : execFileSync('git', ['show', `${BASE_SHA}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const BASE = 'http://www.kraland.org';
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const FIX = name => fs.readFileSync(path.join(here, 'fixtures', name), 'utf8');
// Fixture de même nom que la clé (kramail-<clé>.html) ; Répondre, Répondre à tous et Transférer partent du message 9000002.
const PAGE = (cle, url, garde, dossier) => ({ url, html: FIX(`kramail-${cle}.html`), garde, dossier });
const MESSAGE = n => `/kramail/post/sujet-fictif-de-lecture-${n}-9000002`;
const PAGES = {
  reception: PAGE('reception', '/kramail/personnage-fictif-2000-0', 'liste', 0),
  envoi: PAGE('envoi', '/kramail/personnage-fictif-2000-1', 'liste', 1),
  corbeille: PAGE('corbeille', '/kramail/personnage-fictif-2000-2', 'liste', 2),
  lecture: PAGE('lecture', '/kramail/post/sujet-fictif-0-9000002', 'lecture'),
  nouveau: PAGE('nouveau', '/kramail/post/nouveau-4-2000', 'compose'),
  repondre: PAGE('repondre', MESSAGE(5), 'compose'),
  'repondre-tous': PAGE('repondre-tous', MESSAGE(6), 'compose'),
  transferer: PAGE('transferer', MESSAGE(17), 'compose')
};
const REPONDRE = PAGES.repondre.html;
// Répondre sans textarea#dest : la rédaction est reconnue par son formulaire, pas par le champ des destinataires
PAGES['repondre-sans-dest'] = { ...PAGES.repondre, html: REPONDRE.replace('<textarea id="dest" name="c[3]"', '<textarea name="c[3]"') };
if (PAGES['repondre-sans-dest'].html === REPONDRE) { console.error('fixture de Répondre : textarea#dest introuvable'); process.exit(2); }
// Signaler (…-8-<id>) : page synthétique, la fixture de Répondre (formulaire post_msg) servie à l'adresse de Signaler. Hypothèse non relevée
// sur le site : la page Signaler porte un formulaire post_msg et n'est pas une rédaction de kramail.
PAGES.signaler = { ...PAGES.repondre, url: MESSAGE(8), garde: 'lecture' };
const SOUS_GARDES = ['liste', 'lecture', 'compose'];
const LIBELLES = ['Réception', 'Envoi', 'Corbeille'];
const DARK = 'empire-brun-dark';

let failures = 0;
let passes = 0;
function check(name, fn) {
  try { fn(); passes += 1; console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}
function expect(cond, msg) { if (!cond) { throw new Error(msg); } }
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const frag = id => FRAG.length === 0 || FRAG.includes(id);

const browser = await launchBrowser();

async function ouvrir(cle, { width, height = 720, mobile = false, variante = 'kraland', debut = false, bundle = APRES }) {
  const p = PAGES[cle];
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const denied = await confineNetwork(context);
  const autres = [];
  const html = debut ? p.html.replace('<meta charset="utf-8"/>', '<meta charset="utf-8"/>\n<script>window.__krScriptTete = true;</script>') : p.html;
  await context.route(BASE + '/**', r => {
    const req = r.request();
    const u = new URL(req.url());
    if (req.resourceType() === 'document' && u.pathname === p.url && req.method() === 'GET') { return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }); }
    if (u.pathname.startsWith('/lib/fontawesome') && u.pathname.endsWith('.css')) { return r.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    if (u.pathname.startsWith('/lib/bootstrap') || u.pathname.startsWith('/lib/jquery')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return r.fulfill({ status: 200, contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(path.join(VENDOR, file)) });
    }
    autres.push(u.pathname);
    return r.abort();
  });
  await context.addInitScript(choisirVariante, variante);
  await context.addInitScript(({ src, start }) => {
    window.GM = { xmlHttpRequest: () => {} };
    window.addEventListener('submit', e => { e.preventDefault(); }, true);
    // eslint-disable-next-line no-eval
    const go = () => { window.__krInjection = { body: !!document.body, largeur: window.innerWidth }; (0, eval)(src); };
    if (start) {
      if (document.documentElement) { go(); } else { new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); go(); } }).observe(document, { childList: true }); }
      return;
    }
    document.addEventListener('DOMContentLoaded', go);
  }, { src: bundle, start: debut });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e.message)));
  await page.goto(BASE + p.url, { waitUntil: 'load' });
  if (bundle === APRES) { await krReady(page, { ready: THEME_READY, label: 'kramail ' + cle }); } else { await domQuiet(page, { ready: THEME_READY, label: 'kramail ' + cle }); }
  return { context, page, errors, denied, autres };
}

const sansFuite = o => {
  const hors = o.autres.concat(o.denied.map(d => new URL(d.url).host + new URL(d.url).pathname)
    .filter(x => !/^raw\.githubusercontent\.com\/|^img7\.kraland\.org\/2\/world\/logo/.test(x)));
  expect(hors.length === 0, 'requêtes imprévues : ' + hors.join(', '));
  expect(o.errors.length === 0, 'erreurs de page : ' + o.errors.join(' | '));
};

// ---------- gardes ----------
if (frag('gardes')) {
  console.log('gardes de page');
  const cas = [];
  for (const cle of Object.keys(PAGES)) { for (const [width, mobile] of [[375, true], [1280, false]]) { for (const debut of [true, false]) { cas.push({ cle, width, mobile, debut }); } } }
  const res = await mapLimit(cas, async c => {
    const o = await ouvrir(c.cle, { width: c.width, height: c.mobile ? 667 : 720, mobile: c.mobile, debut: c.debut });
    const r = await o.page.evaluate(() => ({ html: [...document.documentElement.classList], body: [...document.body.classList], injection: window.__krInjection }));
    await o.context.close();
    return { c, o, r };
  });
  for (const { c, o, r } of res) {
    const attendue = PAGES[c.cle].garde;
    check(`${c.cle} ${c.width} px ${c.debut ? 'tête' : 'DOMContentLoaded'} : kr-page-kramail et seule kr-page-kramail-${attendue}`, () => {
      if (c.debut) { expect(r.injection && r.injection.body === false, 'injection pas en tête : ' + JSON.stringify(r.injection)); }
      expect(r.html.includes('kr-page-kramail'), 'kr-page-kramail absente : ' + r.html.join(' '));
      const poses = SOUS_GARDES.filter(g => r.html.includes('kr-page-kramail-' + g));
      expect(poses.length === 1 && poses[0] === attendue, 'sous-gardes : ' + (poses.join(', ') || 'aucune') + ', attendue ' + attendue);
      const body = r.body.filter(k => k.startsWith('page-kramail')).sort().join(' ');
      const bodyAttendu = (attendue === 'compose' ? ['page-kramail', 'page-kramail-' + attendue] : ['page-kramail']).join(' ');
      expect(body === bodyAttendu, `body : ${body}, attendu ${bodyAttendu}`);
      sansFuite(o);
    });
  }
}

// ---------- onglets (mobile) ----------
const MESURER_TITRE = () => {
  const pr = document.querySelector('h1.page-header .pull-right');
  const liens = [...pr.querySelectorAll(':scope > a.btn')];
  const kebab = pr.querySelector(':scope > .btn-group > .btn');
  const mesure = el => {
    const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    const cx = b.left + b.width / 2; const cy = b.top + b.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    return {
      texte: el.textContent.replace(/\s+/g, ' ').trim(), actif: el.classList.contains('btn-primary'),
      x: b.left, y: b.top, w: b.width, h: b.height, atteint: !!hit && (hit === el || el.contains(hit)),
      fontSize: parseFloat(cs.fontSize), weight: cs.fontWeight, paddingLeft: cs.paddingLeft, bas: cs.borderBottomWidth, ombre: cs.boxShadow
    };
  };
  const couleur = expr => { const sonde = document.createElement('span'); sonde.style.color = expr; document.body.appendChild(sonde); const c = getComputedStyle(sonde).color; sonde.remove(); return c; };
  const prb = pr.getBoundingClientRect();
  return {
    liens: liens.map(mesure), kebab: kebab ? mesure(kebab) : null, plus: !!document.querySelector('#topics thead .btn-group'),
    primaire: couleur('var(--kr-primary)'), bordure: couleur('var(--kr-border-default)'), rang: { x: prb.left, w: prb.width }
  };
};
const verifierOnglets = (m, cle) => {
  const onglets = m.liens.slice(0, 3);
  expect(onglets.map(t => t.texte).join('|') === LIBELLES.join('|'), 'libellés : ' + onglets.map(t => t.texte).join('|'));
  for (const t of onglets) {
    expect(t.fontSize === 12, `${t.texte} : libellé ${t.fontSize} px au lieu de 12 px`);
    expect(t.paddingLeft === '4px', `${t.texte} : retrait ${t.paddingLeft} au lieu de 4px`);
    expect(t.h >= 44, `${t.texte} : hauteur ${t.h} px`);
    expect(t.atteint, `${t.texte} : non atteint par elementFromPoint`);
    expect(Math.abs(t.y - onglets[0].y) < 1, `${t.texte} : pas sur le rang du premier onglet`);
    expect(t.bas === '0px', `${t.texte} : bordure basse ${t.bas}, le filet doit rester dans la ligne`);
  }
  const gauche = onglets[0].x; const droite = onglets[2].x + onglets[2].w;
  expect(Math.abs(gauche - m.rang.x) < 1 && Math.abs(droite - (m.rang.x + m.rang.w)) < 1, `rang ${gauche}-${droite} pour ${m.rang.x}-${m.rang.x + m.rang.w}`);
  for (let i = 1; i < 3; i++) { expect(Math.abs(onglets[i].x - (onglets[i - 1].x + onglets[i - 1].w)) < 1, `${onglets[i].texte} : non contigu`); }
  onglets.forEach((t, i) => {
    const actif = i === PAGES[cle].dossier;
    expect(t.actif === actif, `${t.texte} : btn-primary ${t.actif}`);
    const filet = actif ? `${m.primaire} 0px -3px 0px 0px inset` : `${m.bordure} 0px -2px 0px 0px inset`;
    expect(t.weight === (actif ? '600' : '400'), `${t.texte} ${actif ? 'actif' : 'inactif'} : poids ${t.weight}`);
    expect(t.ombre === filet, `${t.texte} ${actif ? 'actif' : 'inactif'} : filet ${t.ombre} au lieu de ${filet}`);
  });
};
const verifierBoutons = m => {
  const autres = m.liens.slice(3).concat(m.kebab ? [m.kebab] : []);
  expect(autres.length === (m.plus ? 3 : 2), 'boutons hors onglets : ' + autres.length);
  for (const b of autres) {
    expect(b.w >= 44 && b.h >= 44, `${b.texte || 'bouton'} : ${b.w}×${b.h}`);
    expect(b.atteint, `${b.texte || 'bouton'} : non atteint par elementFromPoint`);
    expect(b.y > m.liens[0].y, `${b.texte || 'bouton'} : sur le rang des onglets`);
  }
};
if (frag('onglets')) {
  console.log('onglets de dossier (mobile)');
  const cas = [];
  for (const cle of ['reception', 'envoi', 'corbeille']) { for (const width of [375, 767]) { for (const variante of ['kraland', DARK]) { cas.push({ cle, width, variante }); } } }
  const res = await mapLimit(cas, async c => {
    const o = await ouvrir(c.cle, { width: c.width, height: 667, mobile: true, variante: c.variante, debut: true });
    await o.page.evaluate(() => window.scrollTo(0, 0));
    const m = await o.page.evaluate(MESURER_TITRE);
    await o.context.close();
    return { c, o, m };
  });
  for (const { c, o, m } of res) {
    check(`${c.cle} ${c.width} px ${c.variante} : trois onglets libellés, un rang pleine largeur, dossier courant seul actif`, () => verifierOnglets(m, c.cle));
    // « ••• » : clone du « + » natif de l'en-tête de la liste (absent de l'Envoi)
    check(`${c.cle} ${c.width} px ${c.variante} : Nouveau, Contacts${m.plus ? ' et •••' : ''} en cibles de 44 px atteintes`, () => {
      verifierBoutons(m);
      sansFuite(o);
    });
  }
}

// ---------- bureau ----------
const RELEVER_BUREAU = () => {
  const props = ['display', 'flexDirection', 'float', 'width', 'height', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginLeft',
    'fontSize', 'fontWeight', 'lineHeight', 'color', 'backgroundColor', 'borderTopWidth', 'borderBottomWidth', 'borderBottomColor', 'borderLeftColor', 'borderTopLeftRadius', 'boxShadow'];
  const h1 = document.querySelector('h1.page-header');
  const els = [h1, h1.querySelector('.pull-right'), ...h1.querySelectorAll('.pull-right > a.btn, .pull-right > .btn-group > .btn')];
  return els.map(el => {
    const cs = getComputedStyle(el); const b = el.getBoundingClientRect();
    const o = { el: el.tagName + '.' + [...el.classList].join('.'), rect: [b.left, b.top, b.width, b.height].map(v => Math.round(v * 10) / 10).join(',') };
    for (const p of props) { o[p] = cs[p]; }
    return o;
  });
};
if (frag('bureau')) {
  console.log('bureau égal à la base ' + BASE_SHA.slice(0, 7));
  const cas = [];
  for (const cle of ['reception', 'envoi', 'corbeille']) { for (const width of [768, 769, 1280]) { for (const variante of ['kraland', DARK]) { cas.push({ cle, width, variante }); } } }
  const res = await mapLimit(cas, async c => {
    const lire = async bundle => { const o = await ouvrir(c.cle, { width: c.width, variante: c.variante, bundle }); const r = await o.page.evaluate(RELEVER_BUREAU); await o.context.close(); return { o, r }; };
    return { c, apres: await lire(APRES), avant: await lire(BASE_BUNDLE) };
  });
  for (const { c, apres, avant } of res) {
    check(`${c.cle} ${c.width} px ${c.variante} : titre et boutons égaux à la base`, () => {
      expect(apres.r.length === avant.r.length, `éléments : ${apres.r.length} pour ${avant.r.length}`);
      apres.r.forEach((e, i) => {
        for (const k of Object.keys(e)) { expect(e[k] === avant.r[i][k], `${e.el} ${k} : ${e[k]} pour ${avant.r[i][k]}`); }
      });
      sansFuite(apres.o);
    });
  }
}

// ---------- bascule 767 -> 768 -> 767 dans le même onglet ----------
// Le passage du seuil recharge la page (bascule de support) : on attend le chargement, la peau et un style stable.
async function basculer(page, width, label) {
  await page.waitForTimeout(1300);
  const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
  await page.setViewportSize({ width, height: 720 });
  await charge;
  await krReady(page, { ready: THEME_READY, label });
  await styleSettled(page, 'body');
  await page.evaluate(() => window.scrollTo(0, 0));
}
if (frag('bascule')) {
  console.log('bascule 767 / 768 / 767 dans le même onglet');
  const res = await mapLimit(['kraland', DARK], async variante => {
    const base = await ouvrir('reception', { width: 768, variante, bundle: BASE_BUNDLE });
    const ref = await base.page.evaluate(RELEVER_BUREAU);
    await base.context.close();
    const o = await ouvrir('reception', { width: 767, variante, debut: true });
    const etapes = [['767', await o.page.evaluate(MESURER_TITRE)]];
    await basculer(o.page, 768, 'reception 768');
    etapes.push(['768', await o.page.evaluate(RELEVER_BUREAU)]);
    await basculer(o.page, 767, 'reception 767 retour');
    etapes.push(['767 retour', await o.page.evaluate(MESURER_TITRE)]);
    await o.context.close();
    return { variante, o, ref, etapes };
  });
  for (const { variante, o, ref, etapes } of res) {
    check(`bascule ${variante} : 767 px, onglets`, () => verifierOnglets(etapes[0][1], 'reception'));
    check(`bascule ${variante} : 768 px dans le même onglet, titre et boutons égaux à la base`, () => {
      const r = etapes[1][1];
      expect(r.length === ref.length, `éléments : ${r.length} pour ${ref.length}`);
      r.forEach((e, i) => { for (const k of Object.keys(e)) { expect(e[k] === ref[i][k], `${e.el} ${k} : ${e[k]} pour ${ref[i][k]}`); } });
    });
    check(`bascule ${variante} : retour à 767 px, onglets`, () => { verifierOnglets(etapes[2][1], 'reception'); verifierBoutons(etapes[2][1]); sansFuite(o); });
  }
}

await browser.close();
console.log(`\n${passes} ok, ${failures} échec(s)`);
process.exit(failures ? 1 : 0);
