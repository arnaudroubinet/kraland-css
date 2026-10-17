// Kramail — rédaction : barre d'outils fidèle (18 boutons natifs) et champ « Destinataires » unique (module Kramail:Destinataires, t_abf9ccd4).
// Pages = FIXTURES inertes tirées du HTML RÉEL servi par le site (relevé en lecture seule du 14/10/2026, Chrome dédié 9223), anonymisées :
//   tests/e2e/fixtures/kramail-nouveau.html  (rédaction : form[name=post_msg], #dest c[3], #contacts c[4] 47+2 contacts fictifs, #search, #results,
//                                              barre btn-toolbar 4 groupes / 18 boutons ; copies verbatim de post.js (addtag), kramail_post.js, extraits de main.js)
//   tests/e2e/fixtures/kramail-{reception,envoi,corbeille,lecture}.html (non-régression des autres pages Kramail)
//   tests/e2e/fixtures/kramail-{repondre,repondre-tous,transferer}.html : la fixture « nouveau » + les SEULES différences relevées sur les
//     pages réelles Répondre / Répondre à tous / Transférer (relevé t_4ab208f0, GET d'un message déjà lu et d'un message envoyé) : titre et
//     2e bouton « Message », n[6]/n[7]/n[5], sujet « Re: » / « Tr: », #dest prérempli (vide pour Transférer), message cité
//     « [b]X a écrit :[/b] [quote]…[/quote] », accordéon « Message auquel vous répondez » après le formulaire. Noms fictifs.
// ajaxsearch.php est servi par un ANNUAIRE FICTIF qui reproduit la forme exacte de la réponse réelle (relevé) : <strong>Membres</strong>&nbsp;
// [<a href="#" onClick='…+"NOM; ";return false;'>+</a>]AFFICHÉ;&nbsp;… puis Plateau, 25 noms au plus puis « (...) », « <hr> » final, « <hr> » seul si vide.
// Confinement : refus global `**/*` posé AVANT les routes de fixtures ; toute requête hors fixture est journalisée et fait échouer « aucune requête imprévue ».
// Envoi neutralisé : un écouteur `submit` en capture sur window enregistre les données du formulaire (FormData) puis annule. Rien ne quitte la machine.
//
// Usage : npm run build && npm run test:zone -- kramail
// Options : KR_SCRIPT (bundle « après »), KR_SCRIPT_AVANT (bundle « avant », pour la non-régression et les captures avant/après),
//   KR_SHOTS=/dossier (captures), KR_FA_DIR=/dossier (copie locale de Font Awesome 5.6.3 : css/all.min.css + webfonts/, captures seulement),
//   KR_FRAG (fragments : barre, dest-1280, dest-375, dest-320, blocage-1280, blocage-375, blocage-320, reponses-repondre, reponses-tous,
//   reponses-transferer, clavier, reseau, envoi, repli, libelle, indicatif, regression, themes, avant).
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { chromium } from 'playwright';
import { domQuiet, krReady, THEME_READY } from './lib/settle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const strip = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const APRES = strip(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
// Bundle « avant » : celui de la base (feature/next) tel que commité, sauf KR_SCRIPT_AVANT.
function bundleAvant() {
  if (process.env.KR_SCRIPT_AVANT) { return strip(fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')); }
  for (const ref of ['origin/feature/next', 'feature/next']) {
    try { return strip(execFileSync('git', ['show', `${ref}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })); } catch (_e) { /* ref suivante */ }
  }
  return null;
}
const SHOTS = process.env.KR_SHOTS || '';
const FA_DIR = process.env.KR_FA_DIR || '';
const BASE = 'http://www.kraland.org';
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const FIX = name => fs.readFileSync(path.join(here, 'fixtures', name), 'utf8');
const PAGES = {
  nouveau: { url: '/kramail/post/nouveau-4-2000', html: FIX('kramail-nouveau.html') },
  reception: { url: '/kramail/personnage-fictif-2000-0', html: FIX('kramail-reception.html') },
  envoi: { url: '/kramail/personnage-fictif-2000-1', html: FIX('kramail-envoi.html') },
  corbeille: { url: '/kramail/personnage-fictif-2000-2', html: FIX('kramail-corbeille.html') },
  lecture: { url: '/kramail/post/sujet-fictif-0-9000002', html: FIX('kramail-lecture.html') },
  // Répondre / Répondre à tous / Transférer depuis la réception (…-5-, -6-, -7-<id>) : même formulaire que Nouveau, prérempli
  repondre: { url: '/kramail/post/sujet-fictif-de-lecture-5-9000002', html: FIX('kramail-repondre.html') },
  'repondre-tous': { url: '/kramail/post/sujet-fictif-de-lecture-6-9000002', html: FIX('kramail-repondre-tous.html') },
  // depuis l'envoi, le site numérote 15 / 16 / 17 : la page est reconnue par son formulaire, pas par le numéro
  transferer: { url: '/kramail/post/sujet-fictif-de-lecture-17-9000002', html: FIX('kramail-transferer.html') }
};
// Requêtes émises par le script et refusées explicitement par le harnais (hôte + chemin exacts) : vérification de version du CSS, logo du thème.
const EXPECTED_REFUSALS = [
  { host: 'raw.githubusercontent.com', pathname: '/arnaudroubinet/kraland-css/refs/heads/main/version.json' },
  { host: 'img7.kraland.org', pathname: '/2/world/logo2.gif' }
];
const isExpectedRefusal = r => EXPECTED_REFUSALS.some(e => e.host === r.host && e.pathname === r.pathname);
const unexpected = state => [
  ...state.other.map(p => 'www.kraland.org' + p),
  ...state.denied.filter(r => !isExpectedRefusal(r)).map(r => r.host + r.pathname)
];

// ---------- annuaire fictif (ajaxsearch.php) ----------
const M = (name, display) => ({ name, display: display || name });
const ANNUAIRE_MEMBRES = [
  M('Marcus Ferrand'), M('Margot Lys', 'Margot<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="[*r]" class="icon">Lys'), M('Amaranthe'),
  M('Tamara Velours', 'TAMARA velours'), M('Marella Quint'), M('Marelle Duvent'), M('Omar Sablier'), M('Quentin Marl'), M('Brune Castel'),
  M('Elio Fernat'), M('Zélie Corne'), M('Céleste Aumont'),
  ...Array.from({ length: 30 }, (_v, i) => M(`Habitant ${String(i + 1).padStart(2, '0')}`))
];
const ANNUAIRE_PLATEAU = [M('Capitaine Marbre'), M('Sire Bastien'), M('Personnage C'), M('Ancien du port')];
function ajaxHtml(q) {
  const needle = q.toLowerCase();
  const hit = list => list.filter(x => x.name.toLowerCase().includes(needle)).sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
  const item = x => `[<a href="#" onClick='javascript:post_msg.dest.value=post_msg.dest.value+"${x.name}; ";return false;'>+</a>]${x.display};&nbsp;`;
  const m = hit(ANNUAIRE_MEMBRES); const p = hit(ANNUAIRE_PLATEAU);
  let out = ''; let n = 0; let trunc = false;
  if (m.length) { out += '<strong>Membres</strong>&nbsp;'; for (const x of m) { if (n >= 25) { trunc = true; break; } out += item(x); n += 1; } }
  if (p.length && n < 25) { out += '<strong>Plateau</strong>&nbsp;'; for (const x of p) { if (n >= 25) { trunc = true; break; } out += item(x); n += 1; } } else if (p.length) { trunc = true; }
  return out + (trunc ? '(...)' : '') + '<hr>';
}

let failures = 0;
let passes = 0;
function check(name, fn) {
  try { fn(); passes += 1; console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const frag = id => FRAG.length === 0 || FRAG.some(f => f === id || id.startsWith(f + '-') || f.startsWith(id + '-'));
const shot = async (target, name, opts = {}) => { if (SHOTS) { await target.screenshot({ path: path.join(SHOTS, name + '.png'), ...opts }); } };

const browser = await chromium.launch({ headless: true });
const DARK = 'empire-brun-dark';

// Comparaison de captures par pixels décodés (canvas d'une page vierge). Tolérance bornée : au plus PIX_MAX_PIXELS pixels
// différents, chacun d'un écart <= PIX_MAX_CANAL sur un canal. Toute autre différence (dimensions, pixels plus nombreux ou plus
// éloignés) reste une régression.
// Calibrage (A/A : même bundle des deux côtés, 12 exécutions du fragment regression par révision, t_292a52e1) :
//   chrome-headless-shell 1224 (Chromium 149) : au plus 1 pixel, écart 2 (coin arrondi, en 5-7, 230) ;
//   chrome-headless-shell 1248 (Chromium 156) : au plus 9 pixels, écart 2 ; « lecture 1280 » varie de 9 pixels, écart 1, en (357-432, 265-267).
// Borne du nombre de pixels = plus de 2 x le maximum mesuré (9) ; borne d'écart = maximum mesuré (2). Le bruit est de quelques pixels :
// un voile à écart 2 sur toute la page (~300 000 px), un pixel franc (écart 255), une hauteur +1 px (dimensions) restent détectés.
const PIX_MAX_PIXELS = 20;
const PIX_MAX_CANAL = 2;
/* global atob, createImageBitmap, Blob -- utilisés dans pg.evaluate, donc dans le navigateur */
async function comparePixels(a, b) {
  const ctx = await browser.newContext();
  try {
    const pg = await ctx.newPage();
    return await pg.evaluate(async ([ba, bb]) => {
      const dec = async b64 => {
        const bin = atob(b64); const u8 = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) { u8[i] = bin.charCodeAt(i); }
        const bmp = await createImageBitmap(new Blob([u8], { type: 'image/png' }));
        const cv = document.createElement('canvas'); cv.width = bmp.width; cv.height = bmp.height;
        const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(bmp, 0, 0);
        return { w: bmp.width, h: bmp.height, d: cx.getImageData(0, 0, bmp.width, bmp.height).data };
      };
      const x = await dec(ba); const y = await dec(bb);
      if (x.w !== y.w || x.h !== y.h) { return { dims: [x.w + 'x' + x.h, y.w + 'x' + y.h] }; }
      let pixels = 0; let maxCanal = 0; const first = [];
      for (let i = 0; i < x.d.length; i += 4) {
        let m = 0;
        for (let c = 0; c < 4; c++) { m = Math.max(m, Math.abs(x.d[i + c] - y.d[i + c])); }
        if (m > 0) { pixels += 1; maxCanal = Math.max(maxCanal, m); if (first.length < 3) { const n = i / 4; first.push([n % x.w, Math.floor(n / x.w)]); } }
      }
      return { pixels, maxCanal, first };
    }, [a.toString('base64'), b.toString('base64')]);
  } finally { await ctx.close(); }
}
const pixelsEquivalent = d => d.identique === true || (!d.dims && d.pixels <= PIX_MAX_PIXELS && d.maxCanal <= PIX_MAX_CANAL);

async function open({ width, page = 'nouveau', bundle = 'apres', variant = DARK, height = 900, touch = false, init = null, ajaxDelay = 120, themeOn = true }) {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile || touch, deviceScaleFactor: SHOTS ? 2 : 1 });
  const state = { documents: 0, other: [], denied: [], ajax: [], failed: [], ajaxDelay, ajaxStatus: {} };
  await context.route('**/*', r => {
    const u = new URL(r.request().url());
    state.denied.push({ host: u.host, pathname: u.pathname, type: r.request().resourceType() });
    return r.abort();
  });
  await context.route(BASE + '/**', async r => {
    const req = r.request();
    const u = new URL(req.url());
    if (req.resourceType() === 'document' && u.pathname === PAGES[page].url && req.method() === 'GET') {
      state.documents += 1;
      return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: PAGES[page].html });
    }
    if (u.pathname === '/ajaxsearch.php' && req.method() === 'GET') {
      const q = u.searchParams.get('c[1]') || '';
      state.ajax.push({ q, t: u.searchParams.get('t'), raw: u.search, at: Date.now() });
      await new Promise(res => setTimeout(res, state.ajaxDelay));
      if (state.ajaxStatus[q]) { return r.fulfill({ status: state.ajaxStatus[q], contentType: 'text/html', body: 'erreur' }).catch(() => {}); }
      if (state.ajaxBody && state.ajaxBody[q]) { return r.fulfill({ status: 200, contentType: 'text/html', body: state.ajaxBody[q] }).catch(() => {}); }
      return r.fulfill({ status: 200, contentType: 'text/html', body: ajaxHtml(q) }).catch(() => {});
    }
    if (u.pathname.startsWith('/lib/fontawesome')) {
      const rel = u.pathname.replace('/lib/fontawesome-free-5.6.3/', '');
      const file = FA_DIR ? path.join(FA_DIR, rel) : '';
      if (file && fs.existsSync(file)) { return r.fulfill({ status: 200, contentType: file.endsWith('.css') ? 'text/css' : 'font/woff2', body: fs.readFileSync(file) }); }
      if (u.pathname.endsWith('.css')) { return r.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    }
    if (u.pathname.startsWith('/lib/bootstrap') || u.pathname.startsWith('/lib/jquery')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return r.fulfill({ status: 200, contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(path.join(VENDOR, file)) });
    }
    state.other.push(u.pathname);
    return r.abort();
  });
  context.on('requestfailed', req => { const u = new URL(req.url()); if (u.pathname === '/ajaxsearch.php') { state.failed.push({ q: u.searchParams.get('c[1]'), err: req.failure()?.errorText }); } });
  await context.addInitScript(({ src, v, extra, on }) => {
    window.GM = { xmlHttpRequest: () => {} };
    window.__opened = [];
    window.__submits = [];
    window.__warns = [];
    window.open = (...a) => { window.__opened.push(a.map(String)); return null; };
    const warn = console.warn.bind(console);
    console.warn = (...a) => { window.__warns.push(a.map(String).join(' ')); warn(...a); };
    // Envoi neutralisé : on lit ce que le formulaire NATIF enverrait, puis on annule.
    window.addEventListener('submit', e => {
      const f = e.target;
      window.__submits.push(Array.from(new window.FormData(f)).filter(([k]) => k !== 't').map(([k, val]) => [k, String(val)]));
      e.preventDefault();
    }, true);
    // eslint-disable-next-line no-eval
    if (extra) { (0, eval)(extra); }
    if (src) {
      // Thème désactivé par le joueur (on === false) : le bundle tourne, mais sans CSS (cas réel du bouton d'activation du thème)
      localStorage.setItem('kr-theme-enabled', on === false ? 'false' : 'true');
      localStorage.setItem('kr-theme-variant', v);
      // eslint-disable-next-line no-eval
      document.addEventListener('DOMContentLoaded', () => (0, eval)(src));
    }
  }, { src: bundle === 'apres' ? APRES : (bundle === 'avant' ? AVANT : null), v: variant, extra: init, on: themeOn });
  const p = await context.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e.message)));
  await p.goto(BASE + PAGES[page].url, { waitUntil: 'load' });
  // Lot B : bundle courant = fin d'initialisation explicite (html[data-kr-ready]) ; bundle « avant » (base, peut précéder le marqueur) = DOM calme.
  if (bundle === 'apres') { await krReady(p, { ready: themeOn === false ? null : THEME_READY, label: 'kramail ' + page }); } else if (bundle) { await domQuiet(p, { ready: themeOn === false ? null : THEME_READY, label: 'kramail ' + page }); } else { await p.waitForTimeout(300); }
  return { context, page: p, state, errors };
}
const AVANT = bundleAvant();

// ---------- sondes ----------
const TOOLS = [
  ['b', 'fa fa-bold', 'Gras: [b]x[/b]'], ['i', 'fa fa-italic', 'Italique: [i]x[/i]'], ['u', 'fa fa-underline', 'Souligné: [u]x[/u]'], ['strike', 'fa fa-strikethrough', 'Barré: [strike]x[/strike]'],
  ['img', 'far fa-image', 'Image: [img]x[/img]'], ['url', 'fa fa-link', 'Lien: [url=...]x[/url]'], ['youtube', 'fas fa-video', 'Vidéo youtube: [youtube]x[/youtube] x = lien de youtube ou numéro vidéo (11 caractères)'], ['smileys', 'far fa-smile', 'Smileys'],
  ['quote', 'fa fa-quote-right', 'Citation: [quote]x[/quote]'], ['spoiler', 'fa fa-compress', 'Spoiler: [spoiler]x[/spoiler]'], ['pre', 'fa fa-list', 'Pré-formaté: [pre]x[/pre]'], ['couleurs', 'fa fa-flask', 'Couleurs'],
  ['left', 'fa fa-align-left', 'Aligner à gauche: [left]x[/left]'], ['center', 'fa fa-align-center', 'Centrer: [center]x[/center]'], ['right', 'fa fa-align-right', 'Aligner à droite: [right]x[/right]'], ['fleft', 'fa fa-outdent', 'Flottant à gauche: [fleft]x[/fleft]'], ['fright', 'fa fa-indent', 'Flottant à droite: [fright]x[/fright]'], ['prev', 'fab fa-searchengin', 'Prévisualisation']
];
const BAR = () => {
  const bar = document.querySelector('form[name="post_msg"] .btn-toolbar');
  const groups = Array.from(bar.querySelectorAll(':scope > .btn-group'));
  const buttons = groups.flatMap((g, gi) => Array.from(g.querySelectorAll(':scope > a.btn, :scope > .dropdown > .dropdown-toggle > .btn')).map(b => ({ b, gi })));
  return {
    groups: groups.map(g => g.querySelectorAll(':scope > a.btn, :scope > .dropdown > .dropdown-toggle > .btn').length),
    buttons: buttons.map(({ b, gi }) => {
      const r = b.getBoundingClientRect();
      const tip = b.getAttribute('data-original-title') || b.getAttribute('title') || '';
      return { gi, icon: b.querySelector('i')?.className || '', tip, href: b.getAttribute('href'), onclick: b.getAttribute('onclick'), x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height, r: r.right };
    }),
    bar: { w: bar.clientWidth, sw: bar.scrollWidth, left: bar.getBoundingClientRect().left, right: bar.getBoundingClientRect().right },
    ox: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    vw: document.documentElement.clientWidth
  };
};
// Atteignabilité : on amène l'élément dans la fenêtre par window.scrollTo (jamais scrollIntoView, qui fait défiler un conteneur overflow:hidden)
const REACH = (sel) => Array.from(document.querySelectorAll(sel)).map(e => {
  // Option d'une liste à défilement propre (overflow: auto) : on fait défiler CETTE liste, comme le ferait l'utilisateur
  const list = e.closest('.kd-list');
  if (list && getComputedStyle(list).overflowY === 'auto') { const lr = list.getBoundingClientRect(); const er = e.getBoundingClientRect(); list.scrollTop += (er.top - lr.top) - list.clientHeight / 2; }
  const r0 = e.getBoundingClientRect();
  window.scrollTo(0, Math.max(0, r0.top + window.scrollY - window.innerHeight / 2));
  const r = e.getBoundingClientRect();
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return { ok: !!hit && (hit === e || e.contains(hit)), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, what: hit ? hit.tagName + '.' + hit.className : 'rien' };
});
const SIGNATURE = () => Array.from(document.querySelectorAll('form[name="post_msg"] .btn-toolbar a, form[name="post_msg"] .btn-toolbar button, form[name="post_msg"] .btn-toolbar img'))
  .map(e => `${e.tagName}|${e.getAttribute('href')}|${e.getAttribute('onclick')}|${e.getAttribute('data-toggle')}|${e.getAttribute('alt')}`);
const DEST = () => {
  const vis = e => { if (!e) { return false; } const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; };
  const kd = document.querySelector('.kd');
  const input = document.querySelector('.kd-input');
  const panel = document.querySelector('.kd-panel');
  const opts = Array.from(document.querySelectorAll('.kd-opt'));
  return {
    kd: !!kd,
    natives: { dest: vis(document.querySelector('#dest')), contacts: vis(document.querySelector('#contacts')), search: vis(document.querySelector('#search')), results: vis(document.querySelector('#results')), plus: vis(document.querySelector('input[type=button][value="+"]')) },
    inForm: ['c[3]', 'c[4]', 'search'].every(n => !!document.forms.post_msg.elements[n]),
    dest: document.querySelector('#dest').value,
    chips: Array.from(document.querySelectorAll('.kd-chip')).map(c => ({ name: c.querySelector('.kd-chip-name').textContent, dup: c.classList.contains('is-dup'), sel: c.classList.contains('is-selected'), x: c.querySelector('.kd-chip-x').getAttribute('aria-label') })),
    input: input ? { value: input.value, expanded: input.getAttribute('aria-expanded'), active: input.getAttribute('aria-activedescendant'), focused: document.activeElement === input, placeholder: input.placeholder } : null,
    panel: panel ? { open: vis(panel), text: panel.innerText, rect: (() => { const r = panel.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; })(), pos: getComputedStyle(panel).position } : null,
    sections: Array.from(document.querySelectorAll('.kd-group')).map(g => ({ title: g.querySelector('.kd-sec').textContent, names: Array.from(g.querySelectorAll('.kd-opt-name')).map(n => n.textContent), tags: Array.from(g.querySelectorAll('.kd-opt')).map(o => o.querySelector('.kd-opt-tag')?.textContent || '') })),
    options: opts.map(o => ({ id: o.id, name: o.querySelector('.kd-opt-name').textContent, active: o.classList.contains('is-active'), disabled: o.getAttribute('aria-disabled') === 'true', tag: o.querySelector('.kd-opt-tag')?.textContent || '', h: o.getBoundingClientRect().height })),
    warn: document.querySelector('.kd-warn')?.textContent || '',
    empty: document.querySelector('.kd-empty')?.textContent || '',
    foot: document.querySelector('.kd-foot')?.textContent || '',
    msg: document.querySelector('.kd-msg')?.textContent || '',
    live: document.querySelector('.kd-live')?.textContent || '',
    help: vis(document.querySelector('.kd-help')),
    label: document.querySelector('.kd-label')?.textContent.replace(/\s+/g, ' ').trim() || '',
    contactsBtn: document.querySelector('.kd-contacts')?.getAttribute('aria-expanded') || null,
    ox: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    vw: document.documentElement.clientWidth
  };
};
async function typeIn(p, text) { await p.focus('.kd-input'); await p.keyboard.type(text, { delay: 40 }); }
async function settleDir(p, state, q) {
  await p.waitForFunction(qq => { const i = document.querySelector('.kd-input'); return i && i.value.trim() === qq; }, q);
  if (q.trim().length >= 2) {
    await p.waitForFunction(qq => !document.querySelector('.kd-loading') && document.querySelector('.kd-input').value.trim() === qq, q, { timeout: 5000 });
  }
  await p.waitForTimeout(50);
}
// Capture de la ligne Destinataires ET du panneau (superposé sur bureau, hors de la boîte de la ligne)
const shotDest = async (p, name) => {
  if (!SHOTS) { return; }
  const clip = await p.evaluate(() => {
    const boxes = ['.kd-row', '.kd-panel:not([hidden])'].map(s => document.querySelector(s)).filter(Boolean).map(e => e.getBoundingClientRect());
    const top = Math.min(...boxes.map(b => b.top)); const bottom = Math.max(...boxes.map(b => b.bottom));
    // sur mobile, la barre de navigation collante (≈ 55 px) couvrirait le haut : la ligne est amenée juste sous elle
    window.scrollTo(0, Math.max(0, top + window.scrollY - (window.innerWidth < 768 ? 70 : 12)));
    const again = ['.kd-row', '.kd-panel:not([hidden])'].map(s => document.querySelector(s)).filter(Boolean).map(e => e.getBoundingClientRect());
    const t = Math.min(...again.map(b => b.top)); const l = Math.min(...again.map(b => b.left)); const r = Math.max(...again.map(b => b.right));
    return { x: Math.max(0, l - 8), y: Math.max(0, t - 8), width: Math.min(document.documentElement.clientWidth, r + 8) - Math.max(0, l - 8), height: Math.min(window.innerHeight - Math.max(0, t - 8), bottom - top + 16) };
  });
  await p.screenshot({ path: path.join(SHOTS, name + '.png'), clip });
};

// =====================================================================================================
// 1) Barre d'outils
// =====================================================================================================
if (frag('barre')) {
  console.log('Barre d\'outils : 18 boutons natifs, ordre, groupes, icônes, infobulles, tailles, lignes, actions natives');
  const nat = await open({ width: 1280, bundle: null });
  const sigNatif = await nat.page.evaluate(SIGNATURE);
  const natBar = await nat.page.evaluate(BAR);
  await nat.context.close();
  check('natif (sans le script) : la fixture porte bien 18 boutons en 4 groupes [4,4,4,6], ordre, icônes et infobulles relevés', () => {
    assert.deepEqual(natBar.groups, [4, 4, 4, 6]);
    assert.deepEqual(natBar.buttons.map(b => b.icon), TOOLS.map(t => t[1]));
    assert.deepEqual(natBar.buttons.map(b => b.tip), TOOLS.map(t => t[2]));
  });
  // Mobile : le thème retire déjà les infobulles au toucher (disableTooltips, comportement antérieur) : la référence est alors le bundle d'avant
  const refMobile = {};
  if (AVANT) {
    for (const width of [375, 320]) {
      const r = await open({ width, bundle: 'avant' });
      refMobile[width] = { sig: await r.page.evaluate(SIGNATURE), bar: await r.page.evaluate(BAR) };
      await r.context.close();
    }
  }
  for (const width of [1280, 375, 320]) {
    const { context, page: p, state, errors } = await open({ width });
    const o = await p.evaluate(BAR);
    const rows = [...new Set(o.buttons.map(b => Math.round(b.y)))].length;
    const expectRows = width === 1280 ? 1 : (width === 375 ? 3 : 4);
    const size = width === 1280 ? 24 : 40;
    const ref = width === 1280 ? { sig: sigNatif, tips: TOOLS.map(t => t[2]) } : { sig: refMobile[width]?.sig, tips: refMobile[width]?.bar.buttons.map(b => b.tip) };
    console.log(`  mesures ${width} px : lignes=${rows} boutons=${o.buttons.map(b => `${b.w.toFixed(1)}x${b.h.toFixed(1)}`).join(' ')} barre=${o.bar.w}/${o.bar.sw} ox=${o.ox}`);
    check(`barre ${width} px : 18 boutons, 4 groupes [4,4,4,6], même ordre, mêmes icônes${width === 1280 ? ' et infobulles natives' : ' ; infobulles comme avant (retirées au toucher par le thème)'}`, () => {
      assert.deepEqual(o.groups, [4, 4, 4, 6]);
      assert.deepEqual(o.buttons.map(b => b.icon), TOOLS.map(t => t[1]));
      assert.deepEqual(o.buttons.map(b => b.tip), ref.tips);
    });
    const sig = await p.evaluate(SIGNATURE);
    check(`barre ${width} px : signature des ${sig.length} éléments actifs (balise, href, onclick, data-toggle, smileys) identique à ${width === 1280 ? 'la page sans script' : 'la page avec le bundle d\'avant'}`, () => assert.deepEqual(sig, ref.sig));
    check(`barre ${width} px : ${expectRows} ligne(s), boutons de ${size} px de haut, ${width === 1280 ? '24' : '40'} px de large au moins`, () => {
      assert.equal(rows, expectRows);
      for (const b of o.buttons) { assert.ok(Math.abs(b.h - size) <= 0.6, `hauteur ${b.h}`); assert.ok(b.w >= size - 0.6 && b.w <= size + 12, `largeur ${b.w}`); }
    });
    check(`barre ${width} px : groupes entiers sur une ligne et accolés (aucun bouton isolé, plus de bouton de 295 px)`, () => {
      for (let gi = 0; gi < 4; gi += 1) {
        const bs = o.buttons.filter(b => b.gi === gi);
        assert.equal(new Set(bs.map(b => Math.round(b.y))).size, 1, `groupe ${gi + 1} coupé`);
        for (let k = 1; k < bs.length; k += 1) { const gap = bs[k].x - bs[k - 1].r; assert.ok(gap >= -1.6 && gap <= 0.6, `écart ${gap}`); }
      }
    });
    check(`barre ${width} px : aucun défilement horizontal (page ${o.ox}, barre ${o.bar.sw - o.bar.w})`, () => { assert.ok(o.ox <= 0); assert.ok(o.bar.sw <= o.bar.w); assert.ok(o.buttons.every(b => b.x >= 0 && b.r <= o.vw)); });
    // QA t_63fbb540 : l'ordre DOM ne suffit pas, la barre est en flex (un `order` ou un `row-reverse` changerait l'ordre vu sans changer le DOM)
    check(`barre ${width} px : ordre À L'ÉCRAN identique à l'ordre natif (lignes de haut en bas, boutons de gauche à droite)`, () => {
      const lu = o.buttons.map((b, i) => ({ i, y: Math.round(b.y), x: b.x })).sort((a, b) => (a.y - b.y) || (a.x - b.x)).map(v => v.i);
      assert.deepEqual(lu, o.buttons.map((_b, i) => i));
    });
    const reach = await p.evaluate(REACH, 'form[name="post_msg"] .btn-toolbar > .btn-group > a.btn, form[name="post_msg"] .btn-toolbar > .btn-group > .dropdown > .dropdown-toggle > .btn');
    check(`barre ${width} px : les 18 boutons sont atteints en leur centre (elementFromPoint)`, () => assert.ok(reach.every(r => r.ok), JSON.stringify(reach.filter(r => !r.ok))));
    if (SHOTS) {
      const clip = await p.evaluate(() => { const r = document.querySelector('form[name="post_msg"] .btn-toolbar').getBoundingClientRect(); window.scrollTo(0, Math.max(0, r.top + window.scrollY - 100)); const q = document.querySelector('form[name="post_msg"] .btn-toolbar').getBoundingClientRect(); return { x: 0, y: Math.max(0, q.top - 8), width: document.documentElement.clientWidth, height: q.height + 120 }; });
      await shot(p, `apres-${width}-barre`, { clip });
    }
    // Actions natives : vraies fonctions du site (addtag de post.js, openHelp de main.js), menus Bootstrap natifs.
    // Un lien « javascript: » s'exécute en différé : on attend son effet (valeur du message), jamais un délai fixe.
    await p.evaluate(() => { const m = document.querySelector('#message'); m.value = ''; window.scrollTo(0, 0); });
    const tapOrClick = async sel => { if (width < 768) { await p.tap(sel); } else { await p.click(sel); } };
    const msgValue = () => p.evaluate(() => document.querySelector('#message').value);
    const act = async (sel, expected) => {
      await tapOrClick(sel);
      await p.waitForFunction(v => document.querySelector('#message').value === v, expected, { timeout: 3000 }).catch(() => {});
      return msgValue();
    };
    const GRAS = 'form[name="post_msg"] .btn-toolbar a[href="javascript:addtag(\'b\',1);"]';
    const v0 = await act(GRAS, '[b]');
    await p.waitForFunction(() => document.activeElement === document.querySelector('#message'), null, { timeout: 3000 }).catch(() => {});
    await p.keyboard.type('gras');
    const v1 = await act(GRAS, '[b]gras[/b]');
    check(`barre ${width} px : Gras insère le BBCode natif (addtag ouvre puis ferme la balise) : « ${v0} » puis « ${v1} »`, () => { assert.equal(v0, '[b]'); assert.equal(v1, '[b]gras[/b]'); });
    await tapOrClick('form[name="post_msg"] .btn-toolbar .dropdown-toggle:has(.fa-smile)');
    await p.waitForSelector('form[name="post_msg"] .btn-toolbar .dropdown.open .dropdown-menu table', { state: 'visible', timeout: 3000 }).catch(() => {});
    const sm = await p.evaluate(() => {
      const m = document.querySelector('form[name="post_msg"] .btn-toolbar .dropdown.open .dropdown-menu'); if (!m) { return null; }
      const r = m.getBoundingClientRect();
      const first = m.querySelector('a[onclick*="addtag(\':)\',0)"]').getBoundingClientRect();
      const hit = document.elementFromPoint(first.left + first.width / 2, first.top + first.height / 2);
      return { l: r.left, r: r.right, t: r.top, b: r.bottom, vw: document.documentElement.clientWidth, vh: window.innerHeight, ox: document.documentElement.scrollWidth - document.documentElement.clientWidth, firstReached: !!hit && !!hit.closest('a[onclick*="addtag"]'), n: m.querySelectorAll('a[onclick*="addtag"]').length };
    });
    check(`barre ${width} px : Smileys ouvre le menu natif (126 smileys), dans la fenêtre, 1er smiley atteint, sans débordement`, () => {
      assert.ok(sm, 'menu fermé'); assert.equal(sm.n, 126);
      assert.ok(sm.l >= 0 && sm.r <= sm.vw + 0.5 && sm.t >= 0 && sm.b <= sm.vh + 0.5, JSON.stringify(sm)); assert.ok(sm.firstReached, JSON.stringify(sm)); assert.ok(sm.ox <= 0);
    });
    await shot(p, `apres-${width}-barre-smileys`);
    const v2 = await act('form[name="post_msg"] .btn-toolbar .dropdown.open .dropdown-menu a[onclick*="addtag(\':)\',0)"]', '[b]gras[/b][:)]');
    check(`barre ${width} px : un smiley insère son code natif`, () => assert.equal(v2, '[b]gras[/b][:)]'));
    await p.evaluate(() => { document.querySelectorAll('.dropdown-backdrop').forEach(b => b.click()); document.querySelectorAll('form[name="post_msg"] .btn-toolbar .dropdown.open').forEach(d => d.classList.remove('open')); });
    await tapOrClick('form[name="post_msg"] .btn-toolbar .dropdown-toggle:has(.fa-flask)');
    await p.waitForSelector('form[name="post_msg"] .btn-toolbar .dropdown.open a[href="javascript:addtag(\'yellow\',1);"]', { state: 'visible', timeout: 3000 }).catch(() => {});
    await shot(p, `apres-${width}-barre-couleurs`);
    const v3 = await act('form[name="post_msg"] .btn-toolbar .dropdown.open a[href="javascript:addtag(\'yellow\',1);"]', '[b]gras[/b][:)][yellow]').catch(e => String(e.message).split('\n')[0]);
    check(`barre ${width} px : Couleurs ouvre la palette native (18 couleurs), une couleur insère sa balise`, () => assert.equal(v3, '[b]gras[/b][:)][yellow]'));
    await p.evaluate(() => { document.querySelectorAll('.dropdown-backdrop').forEach(b => b.click()); document.querySelectorAll('form[name="post_msg"] .btn-toolbar .dropdown.open').forEach(d => d.classList.remove('open')); });
    await tapOrClick('form[name="post_msg"] .btn-toolbar a[onclick*="openHelp(\'prev\')"]');
    const opened = await p.evaluate(() => window.__opened);
    const after = await p.evaluate(() => ({ submits: window.__submits.length }));
    check(`barre ${width} px : Prévisualisation appelle openHelp natif (fenêtre « help/prev »), aucun envoi, aucune navigation, aucune erreur`, () => {
      assert.equal(opened.length, 1); assert.equal(opened[0][0], 'help/prev');
      assert.equal(after.submits, 0); assert.equal(state.documents, 1); assert.deepEqual(errors, [], JSON.stringify(errors));
    });
    check(`barre ${width} px : aucune requête imprévue`, () => assert.deepEqual(unexpected(state), [], JSON.stringify(unexpected(state))));
    await context.close();
  }
}

// =====================================================================================================
// 2) Destinataires, par largeur : états, valeurs de #dest, cibles, débordement
// =====================================================================================================
for (const width of [1280, 375, 320]) {
  if (!frag('dest-' + width)) { continue; }
  console.log(`Destinataires ${width} px : champ unique, suggestions, pastilles, aucun résultat, doublon, contacts`);
  const mob = width < 768;
  const { context, page: p, state, errors } = await open({ width, height: mob ? 800 : 900 });
  const tap = async sel => {
    if (mob) {
      // comme un utilisateur : la cible est d'abord amenée au milieu de l'écran (la barre de navigation collante masque le haut)
      await p.evaluate(s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); window.scrollTo(0, Math.max(0, r.top + window.scrollY - window.innerHeight / 2)); }, sel);
      await p.tap(sel);
    } else { await p.click(sel); }
  };
  let d = await p.evaluate(DEST);
  check(`${width} : champ unique posé, les 3 zones natives masquées mais présentes dans le formulaire`, () => {
    assert.equal(d.kd, true);
    assert.deepEqual(d.natives, { dest: false, contacts: false, search: false, results: false, plus: false });
    assert.equal(d.inForm, true);
    assert.equal(d.label, 'Destinataires *');
    assert.equal(d.input.placeholder, 'Membre ou personnage');
    assert.equal(d.help, true);
    assert.equal(d.dest, '');
    assert.ok(d.ox <= 0, 'scrollX ' + d.ox);
  });
  const fieldBox = await p.evaluate(() => { const f = document.querySelector('.kd-field').getBoundingClientRect(); const c = document.querySelector('.kd-contacts').getBoundingClientRect(); const l = document.querySelector('.kd-label').getBoundingClientRect(); return { f: { w: f.width, h: f.height, l: f.left, r: f.right }, c: { w: c.width, h: c.height, t: c.top, b: c.bottom, l: c.left, r: c.right }, lab: { t: l.top, b: l.bottom, r: l.right } }; });
  console.log(`  mesures ${width} : champ ${fieldBox.f.w.toFixed(0)}x${fieldBox.f.h.toFixed(0)}, Contacts ${fieldBox.c.w.toFixed(0)}x${fieldBox.c.h.toFixed(0)}`);
  check(`${width} : champ ${mob ? '>= 44' : '34'} px de haut, Contacts ${mob ? 'au bout de la ligne du libellé, 40 px' : 'dans le champ'}`, () => {
    if (mob) {
      assert.ok(fieldBox.f.h >= 44 - 0.5, `${fieldBox.f.h}`);
      assert.ok(Math.abs(fieldBox.c.h - 40) <= 0.5);
      assert.ok(fieldBox.c.t >= fieldBox.lab.t - 1 && fieldBox.c.b <= fieldBox.lab.b + 1, JSON.stringify(fieldBox));
      assert.ok(Math.abs(fieldBox.c.r - fieldBox.f.r) <= 1);
    } else {
      assert.ok(Math.abs(fieldBox.f.h - 34) <= 0.6, `${fieldBox.f.h}`);
      assert.ok(fieldBox.c.r <= fieldBox.f.r && fieldBox.c.l >= fieldBox.f.l);
    }
  });
  await shotDest(p, `apres-${width}-dest-vide`);
  if (SHOTS) { await p.evaluate(() => window.scrollTo(0, 0)); await p.screenshot({ path: path.join(SHOTS, `apres-${width}-page-vide.png`), fullPage: true }); }

  // Suggestions : « mar »
  await typeIn(p, 'mar');
  await settleDir(p, state, 'mar');
  d = await p.evaluate(DEST);
  check(`${width} suggestions : une seule requête ajaxsearch.php (délai 250 ms), c[1]=mar et horodatage t, même forme que Chercher`, () => {
    assert.deepEqual(state.ajax.map(a => a.q), ['mar']);
    assert.match(state.ajax[0].raw, /^\?c\[1\]=mar&t=\d{13}$/);
  });
  check(`${width} suggestions : « Vos contacts » (filtrés dans la page) puis « Annuaire du jeu », début du nom d'abord, doublons contacts/annuaire retirés`, () => {
    assert.deepEqual(d.sections.map(s => s.title.replace(/début du nom d’abord/, '').trim()), ['Vos contacts', 'Annuaire du jeu']);
    assert.deepEqual(d.sections[0].names, ['Marelle Duvent', 'Omar Sablier', 'Quentin Marl']);
    assert.deepEqual(d.sections[1].names.slice(0, 3), ['Marcus Ferrand', 'Marella Quint', 'Margot Lys']);
    assert.ok(!d.sections[1].names.includes('Marelle Duvent') && !d.sections[1].names.includes('Omar Sablier'));
    assert.ok(d.sections[1].names.includes('Tamara Velours') && d.sections[1].names.includes('Capitaine Marbre') && d.sections[1].names.includes('Amaranthe'));
    assert.equal(d.sections[1].tags[d.sections[1].names.indexOf('Capitaine Marbre')], 'Plateau');
    assert.equal(d.sections[1].tags[0], 'Membre');
  });
  check(`${width} suggestions : nom INSÉRÉ par le site, pas le nom affiché (smiley, casse)`, () => { assert.ok(d.sections[1].names.includes('Margot Lys')); assert.ok(d.sections[1].names.includes('Tamara Velours')); });
  // QA t_63fbb540 : ordre des sections VU à l'écran (le DOM seul ne prouve pas l'ordre affiché)
  const vues = await p.evaluate(() => Array.from(document.querySelectorAll('.kd-group')).map(g => ({ t: g.querySelector('.kd-sec').firstChild.textContent.trim(), y: g.getBoundingClientRect().top })).sort((a, b) => a.y - b.y).map(s => s.t));
  check(`${width} suggestions : à l'écran, « Vos contacts » au-dessus de « Annuaire du jeu »`, () => assert.deepEqual(vues, ['Vos contacts', 'Annuaire du jeu']));
  check(`${width} suggestions : combobox ARIA ouverte, 1re option active`, () => { assert.equal(d.input.expanded, 'true'); assert.equal(d.options[0].active, true); assert.equal(d.input.active, d.options[0].id); assert.match(d.live, /suggestions/); });
  const optReach = await p.evaluate(REACH, '.kd-opt');
  check(`${width} suggestions : lignes de ${mob ? 44 : 34} px, toutes atteintes en leur centre, panneau dans la largeur, pas de scrollX`, () => {
    assert.ok(d.options.every(o => Math.abs(o.h - (mob ? 44 : 34)) <= 0.6), d.options.map(o => o.h).join(','));
    assert.ok(optReach.every(r => r.ok), JSON.stringify(optReach.filter(r => !r.ok).slice(0, 3)));
    assert.ok(d.panel.rect.l >= 0 && d.panel.rect.r <= d.vw + 0.5);
    assert.equal(d.panel.pos, mob ? 'static' : 'absolute');
    assert.ok(d.ox <= 0);
  });
  await p.evaluate(() => window.scrollTo(0, Math.max(0, document.querySelector('.kd-row').getBoundingClientRect().top + window.scrollY - 60)));
  await shotDest(p, `apres-${width}-dest-suggestions`);
  if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `apres-${width}-page-suggestions.png`) }); }

  // Clavier : ↓ ↑ puis Entrée
  await p.keyboard.press('ArrowDown');
  const a1 = await p.evaluate(() => document.querySelector('.kd-opt.is-active .kd-opt-name').textContent);
  await p.keyboard.press('ArrowUp');
  const a2 = await p.evaluate(() => document.querySelector('.kd-opt.is-active .kd-opt-name').textContent);
  await p.keyboard.press('Enter');
  d = await p.evaluate(DEST);
  check(`${width} clavier : ↓ puis ↑ déplacent l'option active, Entrée ajoute la pastille ; #dest = « Marelle Duvent; »`, () => {
    assert.equal(a1, 'Omar Sablier'); assert.equal(a2, 'Marelle Duvent');
    assert.deepEqual(d.chips.map(c => c.name), ['Marelle Duvent']);
    assert.equal(d.dest, 'Marelle Duvent; ');
    assert.equal(d.input.value, ''); assert.equal(d.panel.open, false); assert.equal(d.input.focused, true);
  });
  // 2e pastille par un clic / toucher sur une ligne
  await typeIn(p, 'omar');
  await settleDir(p, state, 'omar');
  await tap('.kd-opt:not([aria-disabled="true"])');
  d = await p.evaluate(DEST);
  check(`${width} pastilles : un ${mob ? 'toucher' : 'clic'} sur la ligne ajoute ; #dest = « Marelle Duvent; Omar Sablier; » (format natif)`, () => {
    assert.deepEqual(d.chips.map(c => c.name), ['Marelle Duvent', 'Omar Sablier']);
    assert.equal(d.dest, 'Marelle Duvent; Omar Sablier; ');
  });
  const chipReach = await p.evaluate(REACH, '.kd-chip-x');
  console.log(`  mesures ${width} : croix ${chipReach.map(r => `${r.w}x${r.h}`).join(' ')}`);
  check(`${width} pastilles : croix « Retirer <nom> » de ${mob ? '34x32' : '26x24'} px atteintes en leur centre`, () => {
    assert.deepEqual(d.chips.map(c => c.x), ['Retirer Marelle Duvent', 'Retirer Omar Sablier']);
    assert.ok(chipReach.every(r => r.ok && Math.abs(r.w - (mob ? 34 : 26)) <= 0.6 && Math.abs(r.h - (mob ? 32 : 24)) <= 0.6), JSON.stringify(chipReach));
  });
  await p.evaluate(() => window.scrollTo(0, Math.max(0, document.querySelector('.kd-row').getBoundingClientRect().top + window.scrollY - 60)));
  await shotDest(p, `apres-${width}-dest-deux`);
  if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `apres-${width}-page-deux.png`) }); }
  // Retrait par la croix, puis par Retour arrière (2 appuis)
  await tap('.kd-chip-x[aria-label="Retirer Marelle Duvent"]');
  d = await p.evaluate(DEST);
  check(`${width} retrait : la croix retire la pastille ; #dest = « Omar Sablier; »`, () => { assert.deepEqual(d.chips.map(c => c.name), ['Omar Sablier']); assert.equal(d.dest, 'Omar Sablier; '); });
  await p.focus('.kd-input');
  await p.keyboard.press('Backspace');
  const sel1 = await p.evaluate(DEST);
  await p.keyboard.press('Backspace');
  d = await p.evaluate(DEST);
  check(`${width} retrait : Retour arrière dans la saisie vide sélectionne la dernière pastille, un 2e appui la retire ; #dest vide`, () => {
    assert.equal(sel1.chips[0].sel, true); assert.equal(sel1.dest, 'Omar Sablier; ');
    assert.deepEqual(d.chips, []); assert.equal(d.dest, '');
  });

  // Aucun résultat
  await typeIn(p, 'xqzw');
  await settleDir(p, state, 'xqzw');
  d = await p.evaluate(DEST);
  check(`${width} aucun résultat : message clair et option « ajouter tel quel · non vérifié » active`, () => {
    assert.match(d.empty, /Aucun contact ni nom de l’annuaire ne contient « xqzw »\. Vérifiez l’orthographe\./);
    assert.equal(d.options.length, 1); assert.equal(d.options[0].name, 'xqzw'); assert.equal(d.options[0].tag, 'ajouter tel quel · non vérifié'); assert.equal(d.options[0].active, true);
    assert.match(d.live, /Aucun résultat/);
    assert.ok(d.ox <= 0);
  });
  check(`${width} saisie en cours : le texte non validé n'est PAS écrit dans #dest (seules les pastilles partent ; envoi bloqué tant qu'il reste)`, () => assert.equal(d.dest, ''));
  await shotDest(p, `apres-${width}-dest-aucun`);
  await p.keyboard.press('Enter');
  d = await p.evaluate(DEST);
  check(`${width} aucun résultat : Entrée ajoute le nom tel quel ; #dest = « xqzw; »`, () => { assert.deepEqual(d.chips.map(c => c.name), ['xqzw']); assert.equal(d.dest, 'xqzw; '); });

  // Doublon
  await typeIn(p, 'marel');
  await settleDir(p, state, 'marel');
  await p.keyboard.press('Enter');
  await typeIn(p, 'marel');
  await settleDir(p, state, 'marel');
  d = await p.evaluate(DEST);
  check(`${width} doublon : nom déjà choisi grisé ✓ « déjà ajouté », non choisissable, pastille allumée, message`, () => {
    const dup = d.options.find(o => o.name === 'Marelle Duvent');
    assert.ok(dup && dup.disabled && dup.tag === 'déjà ajouté' && !dup.active, JSON.stringify(dup));
    assert.equal(d.options.find(o => o.active).name, 'Marella Quint');
    assert.equal(d.chips.find(c => c.name === 'Marelle Duvent').dup, true);
    assert.equal(d.warn, 'Marelle Duvent est déjà dans les destinataires.');
  });
  await shotDest(p, `apres-${width}-dest-doublon`);
  await p.keyboard.press('ArrowUp');
  const stillActive = await p.evaluate(() => document.querySelector('.kd-opt.is-active .kd-opt-name').textContent);
  check(`${width} doublon : ↑ ↓ sautent l'option « déjà ajouté »`, () => assert.equal(stillActive, 'Marella Quint'));
  await p.keyboard.press('Escape');
  d = await p.evaluate(DEST);
  check(`${width} Échap : ferme le panneau sans perdre la saisie`, () => { assert.equal(d.panel.open, false); assert.equal(d.input.value, 'marel'); assert.equal(d.input.expanded, 'false'); });
  await p.fill('.kd-input', '');
  await p.keyboard.type('MARELLE   duvent;', { delay: 20 });
  d = await p.evaluate(DEST);
  check(`${width} doublon : « MARELLE   duvent; » est refusé (casse et espaces ignorés), message, aucune pastille de plus`, () => {
    assert.deepEqual(d.chips.map(c => c.name), ['xqzw', 'Marelle Duvent']);
    assert.match(d.msg, /Marelle Duvent est déjà dans les destinataires\./);
    assert.equal(d.dest, 'xqzw; Marelle Duvent; ');
  });

  // Contacts ouverts
  await p.fill('.kd-input', '');
  await p.evaluate(() => document.querySelector('.kd-input').dispatchEvent(new Event('input')));
  await tap('.kd-contacts');
  d = await p.evaluate(DEST);
  check(`${width} contacts : le bouton ouvre toute la liste (Membres 47, Plateau 2), les noms choisis grisés ✓`, () => {
    assert.equal(d.contactsBtn, 'true');
    assert.deepEqual(d.sections.map(s => [s.title, s.names.length]), [['Contacts · Membres', 47], ['Contacts · Plateau', 2]]);
    assert.equal(d.options.find(o => o.name === 'Marelle Duvent').disabled, true);
    assert.ok(d.ox <= 0);
  });
  await shotDest(p, `apres-${width}-dest-contacts`);
  await tap('.kd-opt:not([aria-disabled="true"])');
  await p.keyboard.type('sire', { delay: 30 });
  await p.waitForTimeout(100);
  const filt = await p.evaluate(DEST);
  await tap('.kd-opt:not([aria-disabled="true"])');
  d = await p.evaluate(DEST);
  check(`${width} contacts : un ${mob ? 'toucher' : 'clic'} ajoute et la liste reste ouverte ; la saisie filtre (« sire ») sans requête annuaire`, () => {
    assert.deepEqual(filt.sections.map(s => s.names), [['Sire Bastien']]);
    assert.deepEqual(d.chips.map(c => c.name), ['xqzw', 'Marelle Duvent', 'Aldric Venn', 'Sire Bastien']);
    assert.equal(d.panel.open, true);
    assert.ok(!state.ajax.some(a => a.q === 'sire'));
  });
  check(`${width} contacts : #dest = « xqzw; Marelle Duvent; Aldric Venn; Sire Bastien; »`, () => assert.equal(d.dest, 'xqzw; Marelle Duvent; Aldric Venn; Sire Bastien; '));
  await p.keyboard.press('Escape');
  d = await p.evaluate(DEST);
  check(`${width} fin : panneau fermé, aucune soumission, aucune navigation, aucune erreur, aucune requête imprévue, pas de scrollX`, () => {
    assert.equal(d.panel.open, false); assert.equal(state.documents, 1); assert.deepEqual(errors, [], JSON.stringify(errors)); assert.deepEqual(unexpected(state), [], JSON.stringify(unexpected(state))); assert.ok(d.ox <= 0);
  });
  const subs = await p.evaluate(() => window.__submits.length);
  check(`${width} fin : Entrée dans le champ n'a jamais soumis le formulaire`, () => assert.equal(subs, 0));
  if (SHOTS) { await p.evaluate(() => window.scrollTo(0, 0)); await p.screenshot({ path: path.join(SHOTS, `apres-${width}-page-fin.png`), fullPage: true }); }
  await context.close();
}

// =====================================================================================================
// 3) Clavier et saisie : séparateur « ; », collage, Tab, Entrée vide, focus
// =====================================================================================================
if (frag('clavier')) {
  console.log('Saisie : « ; » natif, collage « A; B; C », virgule conservée dans un nom, Tab, Entrée sur saisie vide');
  const { context, page: p } = await open({ width: 1280 });
  await p.focus('.kd-input');
  await p.keyboard.insertText('Alpha; Beta;Gamma ; ');
  let d = await p.evaluate(DEST);
  check('collage « Alpha; Beta;Gamma ; » : 3 pastilles, #dest au format natif', () => { assert.deepEqual(d.chips.map(c => c.name), ['Alpha', 'Beta', 'Gamma']); assert.equal(d.dest, 'Alpha; Beta; Gamma; '); });
  await p.keyboard.type('ça pique', { delay: 30 });
  await p.waitForTimeout(400);
  d = await p.evaluate(DEST);
  check('contact avec virgule (« Ça pique, pôbien ») trouvé sans accent ni majuscule, la virgule ne coupe pas le nom', () => assert.equal(d.sections[0].names[0], 'Ça pique, pôbien'));
  await p.keyboard.press('Tab');
  d = await p.evaluate(DEST);
  check('Tab ajoute l\'option active et laisse le focus suivre', () => { assert.deepEqual(d.chips.map(c => c.name), ['Alpha', 'Beta', 'Gamma', 'Ça pique, pôbien']); assert.equal(d.input.focused, false); });
  await p.focus('.kd-input');
  await p.keyboard.press('Enter');
  await p.keyboard.press('Enter');
  const subs = await p.evaluate(() => window.__submits.length);
  check('Entrée sur une saisie vide : rien n\'est ajouté, aucun envoi implicite du formulaire', () => assert.equal(subs, 0));
  await p.click('.kd-label');
  const focused = await p.evaluate(() => document.activeElement === document.querySelector('.kd-input'));
  check('le libellé « Destinataires » donne le focus au champ', () => assert.equal(focused, true));
  await context.close();

  // Décision d'Arnaud, Q-3 = (a) : « ; » est le SEUL séparateur, comme sur le site. La virgule reste dans le nom (un nom peut en contenir une).
  const v = await open({ width: 1280 });
  const q = v.page;
  await q.fill('input[name="c[1]"]', 'Sujet de test');
  await q.fill('#message', 'Corps du message');
  await q.focus('.kd-input');
  await q.keyboard.insertText('Durand, Jean; Alpha, Beta, Gamma;');
  let e = await q.evaluate(DEST);
  check('virgule (Q-3 = a) : collage « Durand, Jean; Alpha, Beta, Gamma; » → 2 pastilles, la virgule ne coupe aucun nom, #dest au format natif', () => {
    assert.deepEqual(e.chips.map(c => c.name), ['Durand, Jean', 'Alpha, Beta, Gamma']);
    assert.equal(e.dest, 'Durand, Jean; Alpha, Beta, Gamma; ');
  });
  await q.keyboard.type('Lenoir, Paul', { delay: 15 });
  e = await q.evaluate(DEST);
  check('virgule : « Lenoir, Paul » tapé (sans « ; ») reste un seul texte en attente, aucune pastille ajoutée', () => {
    assert.equal(e.input.value, 'Lenoir, Paul'); assert.equal(e.chips.length, 2); assert.equal(e.dest, 'Durand, Jean; Alpha, Beta, Gamma; ');
  });
  await q.click('form[name="post_msg"] button.btn-primary');
  e = await q.evaluate(DEST);
  const vs0 = await q.evaluate(() => window.__submits.length);
  check('virgule : Envoyer → bloqué, « Validez ou effacez « Lenoir, Paul » » (un seul nom), rien ne part', () => { assert.equal(vs0, 0); assert.match(e.msg, /Validez ou effacez « Lenoir, Paul »/); });
  await q.click('.kd-msg-add');
  e = await q.evaluate(DEST);
  check('virgule : « Ajouter » fait de « Lenoir, Paul » UNE seule pastille', () => {
    assert.deepEqual(e.chips.map(c => c.name), ['Durand, Jean', 'Alpha, Beta, Gamma', 'Lenoir, Paul']);
    assert.equal(e.dest, 'Durand, Jean; Alpha, Beta, Gamma; Lenoir, Paul; ');
  });
  await q.click('form[name="post_msg"] button.btn-primary');
  const vs = await q.evaluate(() => window.__submits);
  check('virgule : le formulaire natif part une fois, c[3] = « Durand, Jean; Alpha, Beta, Gamma; Lenoir, Paul; »', () => {
    assert.equal(vs.length, 1); assert.equal(Object.fromEntries(vs[0])['c[3]'], 'Durand, Jean; Alpha, Beta, Gamma; Lenoir, Paul; ');
  });
  await v.context.close();
}

// =====================================================================================================
// 4) Réseau : délai 250 ms, annulation des requêtes dépassées, cache, erreur, liste tronquée
// =====================================================================================================
if (frag('reseau')) {
  console.log('Réseau : une requête après 250 ms de calme, annulation, réponse tronquée (25 + « (...) »), erreur');
  const a = await open({ width: 1280, ajaxDelay: 700 });
  const p = a.page;
  await p.focus('.kd-input');
  await p.keyboard.type('habi', { delay: 60 });
  const t0 = Date.now();
  await p.waitForFunction(() => document.querySelector('.kd-loading'), null, { timeout: 3000 });
  const loading = await p.evaluate(DEST);
  check('saisie rapide « habi » : « Recherche dans l’annuaire… » puis une seule requête (pas une par touche)', () => { assert.match(loading.panel.text, /Recherche dans l’annuaire…/); });
  await p.waitForTimeout(400); // laisser partir la requête « habi » (délai 250 ms) avant la touche suivante
  await p.keyboard.type('t', { delay: 10 });
  await p.waitForFunction(() => !document.querySelector('.kd-loading') && document.querySelectorAll('.kd-opt').length > 0, null, { timeout: 5000 });
  const d = await p.evaluate(DEST);
  console.log('  requêtes : ' + JSON.stringify(a.state.ajax.map(x => x.q)) + ' annulées : ' + JSON.stringify(a.state.failed) + ` (${Date.now() - t0} ms)`);
  check('requête dépassée annulée : « habi » part puis est annulée quand « habit » est tapé, seule « habit » s\'affiche', () => {
    assert.deepEqual(a.state.ajax.map(x => x.q), ['habi', 'habit']);
    assert.ok(a.state.failed.some(f => f.q === 'habi'), JSON.stringify(a.state.failed));
    assert.ok(d.options.length > 0 && d.options.every(o => /habit/i.test(o.name)));
  });
  check('réponse tronquée (« (...) ») : pied « Annuaire : 25 premiers noms seulement, précisez pour affiner. »', () => { assert.match(d.foot, /Annuaire : 25 premiers noms seulement, précisez pour affiner\./); assert.equal(d.sections.at(-1).names.length, 25); });
  await a.context.close();

  const b = await open({ width: 1280, ajaxDelay: 50 });
  b.state.ajaxStatus.erreur = 500;
  await b.page.focus('.kd-input');
  await b.page.keyboard.type('erreur', { delay: 30 });
  await b.page.waitForFunction(() => document.querySelector('.kd-error'), null, { timeout: 4000 }).catch(() => {});
  const e = await b.page.evaluate(DEST);
  check('erreur réseau : « Annuaire indisponible, réessayez », la saisie reste possible', () => { assert.match(e.panel.text, /Annuaire indisponible, réessayez/); });
  // QA t_63fbb540, m-1 : format de l'annuaire changé par le site (mêmes liens [+], guillemets inversés) → aucun nom lisible.
  // Le panneau dit « Annuaire indisponible, réessayez », jamais « aucun résultat » (le nom existe peut-être).
  b.state.ajaxBody = { marcus: '<strong>Membres</strong>&nbsp;[<a href="#" onClick="javascript:post_msg.dest.value=post_msg.dest.value+\'Marcus Ferrand; \';return false;">+</a>]Marcus Ferrand;&nbsp;<hr>' };
  await b.page.fill('.kd-input', '');
  await b.page.keyboard.type('marcus', { delay: 30 });
  await b.page.waitForFunction(() => document.querySelector('.kd-error') || document.querySelector('.kd-empty') || document.querySelector('.kd-opt'), null, { timeout: 4000 }).catch(() => {});
  await b.page.waitForTimeout(100);
  const f = await b.page.evaluate(DEST);
  check('annuaire au format inattendu (liens [+] présents, aucun nom lu) : « Annuaire indisponible, réessayez », pas « aucun résultat », réponse non mise en cache', () => {
    assert.match(f.panel.text, /Annuaire indisponible, réessayez/);
    assert.doesNotMatch(f.panel.text, /Aucun contact ni nom/);
    assert.equal(f.empty, '');
  });
  if (SHOTS) { await b.page.screenshot({ path: path.join(SHOTS, 'reseau-1280-format-inattendu.png') }); }
  await b.page.keyboard.press('Backspace');
  await b.page.keyboard.type('s', { delay: 30 });
  await b.page.waitForTimeout(500);
  check('format inattendu : « marcus » retapé relance la requête (pas de cache d\'une réponse illisible)', () => assert.equal(b.state.ajax.filter(x => x.q === 'marcus').length, 2));
  await b.page.fill('.kd-input', '');
  await b.page.keyboard.type('mar', { delay: 30 });
  await settleDir(b.page, b.state, 'mar');
  await b.page.keyboard.press('Backspace');
  await b.page.keyboard.type('r', { delay: 30 });
  await settleDir(b.page, b.state, 'mar');
  check('cache : « mar » retapé ne relance pas de requête', () => assert.equal(b.state.ajax.filter(x => x.q === 'mar').length, 1));
  await b.context.close();
}

// =====================================================================================================
// 5) Envoi natif : ce que le formulaire enverrait (soumission neutralisée)
// =====================================================================================================
if (frag('envoi')) {
  console.log('Envoi : #dest requis signalé sur le champ visible ; données du formulaire natif inchangées hors c[3]');
  for (const width of [1280, 375]) {
    const { context, page: p, state } = await open({ width });
    await p.fill('input[name="c[1]"]', 'Sujet de test');
    await p.fill('#message', 'Corps du message');
    await p.click('form[name="post_msg"] button.btn-primary');
    let d = await p.evaluate(DEST);
    const subs0 = await p.evaluate(() => window.__submits.length);
    check(`${width} envoi sans destinataire : bloqué par la validation native (c[3] requis), message « Ajoutez au moins un destinataire. » sur le champ visible, focus dans le champ`, () => {
      assert.equal(subs0, 0); assert.match(d.msg, /Ajoutez au moins un destinataire\./); assert.equal(d.input.focused, true);
    });
    await p.keyboard.type('Marelle Duvent;', { delay: 15 });
    await p.keyboard.type('Nom libre', { delay: 15 });
    await p.click('form[name="post_msg"] button.btn-primary');
    d = await p.evaluate(DEST);
    const subs1 = await p.evaluate(() => window.__submits.length);
    check(`${width} envoi avec « Nom libre » tapé mais pas validé : envoi BLOQUÉ (rien ne part), « Validez ou effacez « Nom libre » », focus dans le champ, #dest intact`, () => {
      assert.equal(subs1, 0);
      assert.match(d.msg, /Validez ou effacez « Nom libre »/);
      assert.equal(d.input.focused, true);
      assert.equal(d.input.value, 'Nom libre');
      assert.equal(d.dest, 'Marelle Duvent; ');
    });
    await p.click('.kd-msg-add');
    d = await p.evaluate(DEST);
    const subs2 = await p.evaluate(() => window.__submits.length);
    check(`${width} « Ajouter » : « Nom libre » devient une pastille, message retiré, aucun envoi automatique`, () => {
      assert.deepEqual(d.chips.map(c => c.name), ['Marelle Duvent', 'Nom libre']);
      assert.equal(d.msg, ''); assert.equal(d.input.value, ''); assert.equal(subs2, 0);
    });
    await p.click('form[name="post_msg"] button.btn-primary');
    const subs = await p.evaluate(() => window.__submits);
    check(`${width} envoi : le formulaire NATIF part avec c[3] = « Marelle Duvent; Nom libre; », sans champ ajouté par la peau`, () => {
      assert.equal(subs.length, 1);
      const fd = Object.fromEntries(subs[0]);
      assert.equal(fd['c[3]'], 'Marelle Duvent; Nom libre; ');
      assert.deepEqual(subs[0].map(([k]) => k), ['a', 'n[6]', 'n[7]', 'n[5]', 'f[3]', 'c[1]', 'c[2]', 'c[3]', 'c[4]', 'search', 'message', 'f[0]']);
      assert.equal(fd['c[1]'], 'Sujet de test'); assert.equal(fd.message, 'Corps du message');
    });
    check(`${width} envoi : aucune navigation, aucune requête imprévue`, () => { assert.equal(state.documents, 1); assert.deepEqual(unexpected(state), [], JSON.stringify(unexpected(state))); });
    await context.close();
  }
  // Reprise d'une valeur déjà présente dans #dest (retour arrière du navigateur, formulaire restauré)
  const { context, page: p } = await open({ width: 1280, init: "document.addEventListener('DOMContentLoaded', () => { const d = document.querySelector('#dest'); if (d) { d.value = 'Alpha;Beta ; ;Alpha'; } }, { once: true });" });
  const d = await p.evaluate(DEST);
  check('valeur déjà présente dans #dest reprise en pastilles (sans doublon) et réécrite au format natif', () => { assert.deepEqual(d.chips.map(c => c.name), ['Alpha', 'Beta']); assert.equal(d.dest, 'Alpha; Beta; '); });
  await context.close();
}

// =====================================================================================================
// 6) Repli : sans JS, module en panne, navigateur sans AbortController
// =====================================================================================================
if (frag('repli')) {
  console.log('Repli : zones natives utilisables si le script est absent ou si le module échoue');
  {
    const { context, page: p, state } = await open({ width: 1280, bundle: null });
    const d = await p.evaluate(DEST);
    await p.selectOption('#contacts', 'Brune Castel');
    await p.click('input[type=button][value="+"]');
    await p.fill('#search', '');
    await p.type('#search', 'mar', { delay: 40 });
    await p.waitForFunction(() => document.querySelector('#results a'), null, { timeout: 5000 });
    await p.click('#results a');
    const v = await p.evaluate(() => document.querySelector('#dest').value);
    check('sans script : #dest, Contacts + et Chercher natifs visibles et fonctionnels (« + » et [+] des résultats écrivent dans #dest)', () => {
      assert.deepEqual(d.natives, { dest: true, contacts: true, search: true, results: true, plus: true });
      assert.equal(d.kd, false);
      assert.equal(v, 'Brune Castel; Amaranthe; ', JSON.stringify({ v, d })); // 1er résultat natif (ordre alphabétique du serveur)
      assert.ok(state.ajax.length >= 2, 'le Chercher natif envoie une requête par touche : ' + state.ajax.length);
    });
    await context.close();
  }
  {
    const init = "(() => { const g = Object.getOwnPropertyDescriptor(Element.prototype, 'children').get; Object.defineProperty(HTMLSelectElement.prototype, 'children', { configurable: true, get() { if (this.id === 'contacts') { throw new Error('panne simulée'); } return g.call(this); } }); })();";
    const { context, page: p, errors } = await open({ width: 375, init });
    const d = await p.evaluate(DEST);
    const r = await p.evaluate(() => ({ theme: document.documentElement.classList.contains('kr-theme-enabled'), flag: document.forms.post_msg.dataset.krDest, hidden: document.querySelectorAll('.kd-natif-cache').length }));
    await p.selectOption('#contacts', 'Brune Castel');
    await p.tap('input[type=button][value="+"]');
    const v = await p.evaluate(() => document.querySelector('#dest').value);
    check('module en panne (lecture de #contacts qui échoue) : interface retirée, zones natives visibles et utilisables, thème conservé', () => {
      assert.equal(d.kd, false, 'kd'); assert.equal(r.hidden, 0, 'hidden'); assert.equal(r.flag, 'repli', 'flag ' + r.flag); assert.equal(r.theme, true, 'theme');
      assert.deepEqual(d.natives, { dest: true, contacts: true, search: true, results: true, plus: true });
      assert.equal(v, 'Brune Castel; ', 'valeur ' + v);
      assert.deepEqual(errors, [], JSON.stringify(errors));
    });
    await shot(p, 'repli-375-module-en-panne', { fullPage: true });
    await context.close();
  }
  {
    const { context, page: p } = await open({ width: 1280, init: 'delete window.AbortController;' });
    const d = await p.evaluate(DEST);
    check('navigateur sans AbortController : le module ne s\'installe pas, zones natives visibles', () => { assert.equal(d.kd, false); assert.deepEqual(d.natives, { dest: true, contacts: true, search: true, results: true, plus: true }); });
    await context.close();
  }
  // QA t_63fbb540 : thème désactivé par le joueur (kr-theme-enabled = false). InitQueue tourne quand même, mais sans le CSS :
  // le module ne doit pas s'installer (sinon deux champs Destinataires et #dest réécrit par le champ du module).
  {
    const { context, page: p, errors } = await open({ width: 1280, themeOn: false });
    const d = await p.evaluate(DEST);
    await p.click('#dest');
    await p.keyboard.type('Alpha; ', { delay: 10 });
    const dup = await p.evaluate(() => { const i = document.querySelector('.kd-input'); if (!i) { return null; } i.focus(); return true; });
    if (dup) { await p.keyboard.type('o', { delay: 10 }); }
    const v = await p.evaluate(() => document.querySelector('#dest').value);
    check('thème désactivé : aucune interface du module, zones natives seules et utilisables, #dest jamais réécrit', () => {
      assert.equal(d.kd, false, 'interface du module présente sans le thème');
      assert.deepEqual(d.natives, { dest: true, contacts: true, search: true, results: true, plus: true });
      assert.equal(v, 'Alpha; ', '#dest réécrit : ' + JSON.stringify(v));
      assert.deepEqual(errors, [], JSON.stringify(errors));
    });
    await context.close();
  }
  // QA t_503eb6f6 (décision Q-1 b) : partout où le module ne s'installe pas, l'envoi reste 100 % natif. Aucune erreur de validité
  // n'est posée sur #dest et le formulaire part avec la valeur tapée dans la zone native (sinon l'envoi serait bloqué sans message).
  for (const [cas, opts] of [
    ['thème désactivé', { themeOn: false }],
    ['navigateur sans AbortController', { init: 'delete window.AbortController;' }],
    ['module en panne', { init: "(() => { const g = Object.getOwnPropertyDescriptor(Element.prototype, 'children').get; Object.defineProperty(HTMLSelectElement.prototype, 'children', { configurable: true, get() { if (this.id === 'contacts') { throw new Error('panne simulée'); } return g.call(this); } }); })();" }],
    ['thème désactivé sur Répondre', { themeOn: false, page: 'repondre' }]
  ]) {
    const { context, page: p, errors } = await open({ width: 1280, ...opts });
    await p.fill('input[name="c[1]"]', 'Sujet natif');
    await p.fill('#message', 'Corps natif');
    await p.click('#dest');
    await p.keyboard.press('End');
    await p.keyboard.type('Alpha; Beta', { delay: 10 });
    const avant = await p.evaluate(() => ({ kd: !!document.querySelector('.kd'), erreur: document.querySelector('#dest').validity.customError, v: document.querySelector('#dest').value }));
    await p.click('form[name="post_msg"] button.btn-primary');
    const envois = await p.evaluate(() => window.__submits.map(s => Object.fromEntries(s)));
    check(`${cas} : envoi 100 % natif (aucune erreur de validité sur #dest, un envoi, c[3] = valeur tapée dans la zone native)`, () => {
      assert.equal(avant.kd, false, 'interface du module présente');
      assert.equal(avant.erreur, false, 'erreur de validité posée sur #dest');
      assert.equal(envois.length, 1, 'envois : ' + envois.length);
      assert.equal(envois[0]['c[3]'], avant.v);
      assert.match(envois[0]['c[3]'], /Alpha; Beta$/);
      assert.deepEqual(errors, [], JSON.stringify(errors));
    });
    await context.close();
  }
}

// =====================================================================================================
// 5 bis) Texte tapé non validé à l'envoi (décision d'Arnaud Q-1 = b, précisée) : envoi bloqué, « Validez ou effacez « x » »,
//        boutons Ajouter / Effacer (>= 40 px au toucher), Échap efface, rien n'est ajouté ni effacé en silence, aucun envoi automatique
// =====================================================================================================
for (const width of [1280, 375, 320]) {
  if (!frag('blocage-' + width)) { continue; }
  console.log(`Blocage ${width} px : saisie non validée au moment de l'envoi`);
  const mob = width < 768;
  const { context, page: p, state, errors } = await open({ width, height: mob ? 800 : 900 });
  const send = () => p.click('form[name="post_msg"] button.btn-primary');
  const press = async sel => {
    if (mob) {
      await p.evaluate(s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); window.scrollTo(0, Math.max(0, r.top + window.scrollY - window.innerHeight / 2)); }, sel);
      await p.tap(sel);
    } else { await p.click(sel); }
  };
  const subs = () => p.evaluate(() => window.__submits.length);
  const BLOCK = () => {
    const m = document.querySelector('.kd-msg');
    const box = e => { if (!e) { return null; } const r = e.getBoundingClientRect(); return { w: r.width, h: r.height, l: r.left, r: r.right, t: r.top, b: r.bottom }; };
    const add = document.querySelector('.kd-msg-add');
    const clr = document.querySelector('.kd-msg-clear');
    return { text: m.textContent, block: m.classList.contains('kd-msg-block'), add: add && add.isConnected ? { ...box(add), label: add.textContent } : null, clear: clr && clr.isConnected ? { ...box(clr), label: clr.textContent } : null, field: document.querySelector('.kd-field').classList.contains('is-invalid'), msgBox: box(m), kd: box(document.querySelector('.kd')), validity: document.querySelector('#dest').validity.customError };
  };
  await p.fill('input[name="c[1]"]', 'Sujet de test');
  await p.fill('#message', 'Corps du message');
  await typeIn(p, 'Marelle Duvent;');
  await typeIn(p, 'mar');
  await settleDir(p, state, 'mar');
  await send();
  let d = await p.evaluate(DEST);
  let b = await p.evaluate(BLOCK);
  check(`${width} blocage : « mar » tapé, Envoyer → rien ne part, « Validez ou effacez « mar » » près du champ, focus dans le champ, panneau fermé`, () => {
    assert.equal(b.block, true);
    assert.match(b.text, /^Validez ou effacez « mar »/);
    assert.equal(d.input.focused, true); assert.equal(d.input.value, 'mar'); assert.equal(d.panel.open, false);
    assert.equal(b.field, true);
    assert.ok(b.msgBox.t >= b.kd.t && b.msgBox.b <= b.kd.b + 0.5, 'message hors du bloc Destinataires');
  });
  const s1 = await subs();
  check(`${width} blocage : aucune soumission, #dest = pastilles seules (« Marelle Duvent; »), « mar » jamais envoyé partiellement`, () => { assert.equal(s1, 0); assert.equal(d.dest, 'Marelle Duvent; '); assert.deepEqual(d.chips.map(c => c.name), ['Marelle Duvent']); });
  const reach = await p.evaluate(REACH, '.kd-msg-btn');
  check(`${width} blocage : boutons « Ajouter » et « Effacer » visibles, ${mob ? '>= 40 px de haut (toucher)' : '>= 24 px'}, atteints en leur centre, dans la largeur, pas de scrollX`, () => {
    assert.equal(b.add.label, 'Ajouter'); assert.equal(b.clear.label, 'Effacer');
    for (const k of ['add', 'clear']) { assert.ok(b[k].h >= (mob ? 40 : 24) - 0.5 && b[k].w >= (mob ? 40 : 24), JSON.stringify(b[k])); assert.ok(b[k].l >= 0 && b[k].r <= d.vw + 0.5); }
    assert.ok(reach.every(r => r.ok), JSON.stringify(reach));
    assert.ok(d.ox <= 0, 'scrollX ' + d.ox);
  });
  if (SHOTS) {
    await p.evaluate(() => window.scrollTo(0, Math.max(0, document.querySelector('.kd-row').getBoundingClientRect().top + window.scrollY - (window.innerWidth < 768 ? 80 : 60))));
    await shotDest(p, `apres-${width}-blocage`);
    await p.screenshot({ path: path.join(SHOTS, `apres-${width}-page-blocage.png`) });
  }
  // Retirer une pastille reste d'un clic, le blocage demeure tant que le texte est là
  await press('.kd-chip-x[aria-label="Retirer Marelle Duvent"]');
  d = await p.evaluate(DEST);
  b = await p.evaluate(BLOCK);
  check(`${width} blocage : la croix retire la pastille en un clic, le message de blocage reste (« mar » toujours là)`, () => { assert.deepEqual(d.chips, []); assert.equal(d.dest, ''); assert.match(b.text, /Validez ou effacez « mar »/); });
  // Texte modifié : le message suit ; vidé : le message disparaît
  await p.focus('.kd-input');
  await p.keyboard.type('c', { delay: 20 });
  b = await p.evaluate(BLOCK);
  check(`${width} blocage : texte modifié (« marc ») → le message suit`, () => assert.match(b.text, /Validez ou effacez « marc »/));
  for (let i = 0; i < 4; i += 1) { await p.keyboard.press('Backspace'); }
  d = await p.evaluate(DEST);
  b = await p.evaluate(BLOCK);
  check(`${width} blocage : texte vidé au clavier → message retiré, champ normal, plus d'erreur « Validez ou effacez » sur #dest`, () => { assert.equal(d.input.value, ''); assert.equal(b.text, ''); assert.equal(b.field, false); assert.equal(b.validity, false); });
  // Effacer : vide le texte tapé, sans toucher aux pastilles
  await typeIn(p, 'Omar Sablier;');
  await typeIn(p, 'brouillon');
  await send();
  await press('.kd-msg-clear');
  d = await p.evaluate(DEST);
  b = await p.evaluate(BLOCK);
  const s2 = await subs();
  check(`${width} « Effacer » : texte tapé vidé, pastilles intactes, message retiré, aucun envoi automatique`, () => {
    assert.equal(d.input.value, ''); assert.deepEqual(d.chips.map(c => c.name), ['Omar Sablier']); assert.equal(d.dest, 'Omar Sablier; ');
    assert.equal(b.text, ''); assert.equal(s2, 0); assert.equal(d.input.focused, true);
  });
  // Échap efface aussi le texte tapé quand l'envoi est bloqué
  await typeIn(p, 'zut');
  await send();
  await p.keyboard.press('Escape');
  d = await p.evaluate(DEST);
  b = await p.evaluate(BLOCK);
  check(`${width} Échap pendant le blocage : texte tapé effacé, pastilles intactes, message retiré`, () => { assert.equal(d.input.value, ''); assert.deepEqual(d.chips.map(c => c.name), ['Omar Sablier']); assert.equal(b.text, ''); });
  // Ajouter : le texte devient une pastille (tel quel), puis l'envoi part seulement quand le joueur reclique
  await typeIn(p, 'Nom libre');
  await send();
  await press('.kd-msg-add');
  d = await p.evaluate(DEST);
  const s3 = await subs();
  check(`${width} « Ajouter » : pastille « Nom libre » ajoutée telle quelle, message retiré, aucun envoi automatique`, () => {
    assert.deepEqual(d.chips.map(c => c.name), ['Omar Sablier', 'Nom libre']); assert.equal(d.dest, 'Omar Sablier; Nom libre; ');
    assert.equal(d.msg, ''); assert.equal(s3, 0);
  });
  // Ajouter un nom déjà choisi : rien n'est ajouté, la saisie est retirée et on le dit
  await typeIn(p, 'omar sablier');
  await send();
  await press('.kd-msg-add');
  d = await p.evaluate(DEST);
  check(`${width} « Ajouter » sur un nom déjà choisi : aucune pastille de plus, saisie retirée, « Omar Sablier est déjà dans les destinataires. »`, () => {
    assert.deepEqual(d.chips.map(c => c.name), ['Omar Sablier', 'Nom libre']); assert.equal(d.input.value, ''); assert.match(d.msg, /Omar Sablier est déjà dans les destinataires\./);
  });
  await send();
  const all = await p.evaluate(() => window.__submits);
  check(`${width} envoi après correction : un seul envoi, natif, c[3] = « Omar Sablier; Nom libre; »`, () => {
    assert.equal(all.length, 1); assert.equal(Object.fromEntries(all[0])['c[3]'], 'Omar Sablier; Nom libre; ');
  });
  check(`${width} blocage : aucune navigation, aucune erreur, aucune requête imprévue`, () => { assert.equal(state.documents, 1); assert.deepEqual(errors, [], JSON.stringify(errors)); assert.deepEqual(unexpected(state), [], JSON.stringify(unexpected(state))); });
  await context.close();
  // QA t_503eb6f6 : parcours réel. Le joueur a écrit son message et touche « Envoyer » en bas de page (bouton collant sur mobile) ;
  // le champ Destinataires est plus haut. Après le blocage, le message et les boutons Ajouter / Effacer doivent être À L'ÉCRAN,
  // ni sous la barre de navigation fixe ni sous le bouton Envoyer collant, et atteignables en leur centre.
  {
    const v = await open({ width, height: mob ? 800 : 900 });
    await v.page.fill('input[name="c[1]"]', 'Sujet de test');
    await v.page.fill('#message', 'Corps du message\n'.repeat(12));
    await typeIn(v.page, 'mar');
    await settleDir(v.page, v.state, 'mar');
    await v.page.keyboard.press('Escape');
    await v.page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const envoyer = 'form[name="post_msg"] button.btn-primary';
    if (mob) { await v.page.tap(envoyer); } else { await v.page.click(envoyer); }
    await v.page.waitForTimeout(300);
    const vu = await v.page.evaluate(() => {
      const nav = document.querySelector('nav.navbar');
      const haut = nav && /fixed|sticky/.test(getComputedStyle(nav).position) ? nav.getBoundingClientRect().bottom : 0;
      return ['.kd-msg-text', '.kd-msg-add', '.kd-msg-clear'].map(s => {
        const e = document.querySelector(s);
        if (!e) { return { s, ok: false, raison: 'absent' }; }
        const r = e.getBoundingClientRect();
        const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return { s, ok: r.top >= haut - 0.5 && r.bottom <= window.innerHeight + 0.5 && !!h && (h === e || e.contains(h)), t: Math.round(r.top), b: Math.round(r.bottom), dessus: h ? h.tagName + '.' + h.className : null };
      });
    });
    const parti = await v.page.evaluate(() => window.__submits.length);
    check(`${width} blocage depuis le bas de page : message, Ajouter et Effacer à l'écran et atteignables (ni sous la barre fixe ni sous Envoyer), rien n'est parti`, () => {
      assert.equal(parti, 0);
      assert.ok(vu.every(x => x.ok), JSON.stringify(vu));
    });
    await v.context.close();
  }
}

// =====================================================================================================
// 5 ter) Répondre / Répondre à tous / Transférer (décision d'Arnaud Q-2 : « on fait tout ») : même barre, même champ Destinataires,
//        destinataires préremplis par le site repris en pastilles et conservés ; sujet, message cité et champs cachés intacts
// =====================================================================================================
const REPONSES = {
  repondre: { frag: 'repondre', h1: 'Répondre', n7: '1', sujet: 'Re: Sujet fictif de lecture', dest: 'Marelle Duvent; ', chips: ['Marelle Duvent'] },
  'repondre-tous': { frag: 'tous', h1: 'Répondre à tous', n7: '2', sujet: 'Re: Sujet fictif de lecture', dest: 'Marelle Duvent; Omar Sablier; Jade Noir\'mor; ', chips: ['Marelle Duvent', 'Omar Sablier', 'Jade Noir\'mor'] },
  transferer: { frag: 'transferer', h1: 'Transférer', n7: '3', sujet: 'Tr: Sujet fictif de lecture', dest: '', chips: [] }
};
const CITATION = '[b]Marelle Duvent a écrit :[/b]\n[quote]Bonjour,\n\nMessage fictif de lecture : [b]gras[/b] et smileys [:)] rendus par le site.\nUne deuxième ligne pour le corps du message.[/quote]\n\n';
for (const [pg, R] of Object.entries(REPONSES)) {
  if (!frag('reponses-' + R.frag)) { continue; }
  console.log(`${R.h1} : barre et champ Destinataires, destinataires préremplis (${R.chips.length})`);
  for (const width of [1280, 375, 320]) {
    const mob = width < 768;
    const { context, page: p, state, errors } = await open({ width, page: pg, height: mob ? 800 : 900 });
    let d = await p.evaluate(DEST);
    const form = await p.evaluate(() => ({
      body: document.body.classList.contains('page-kramail-compose'),
      h1: document.querySelector('h1.page-header').textContent.replace(/\s+/g, ' ').trim(),
      sujet: document.querySelector('input[name="c[1]"]').value,
      message: document.querySelector('#message').value,
      hidden: ['n[6]', 'n[7]', 'n[5]', 'f[3]'].map(n => document.forms.post_msg.elements[n].value),
      cite: document.querySelector('#accordion .accordion-toggle')?.textContent || ''
    }));
    check(`${pg} ${width} : page reconnue comme rédaction (« ${R.h1} »), champ unique posé, zones natives masquées mais présentes`, () => {
      assert.equal(form.body, true); assert.ok(form.h1.startsWith(R.h1 + ' ') || form.h1 === R.h1, form.h1.slice(0, 40));
      assert.equal(d.kd, true);
      assert.deepEqual(d.natives, { dest: false, contacts: false, search: false, results: false, plus: false });
      assert.equal(d.inForm, true);
    });
    check(`${pg} ${width} : destinataires préremplis en pastilles ${JSON.stringify(R.chips)}, #dest conservé tel quel (« ${R.dest} »)`, () => {
      assert.deepEqual(d.chips.map(c => c.name), R.chips); assert.equal(d.dest, R.dest);
    });
    check(`${pg} ${width} : sujet « ${R.sujet} », message cité, n[6]/n[7]/n[5]/f[3] et bloc « Message auquel vous répondez » intacts`, () => {
      assert.equal(form.sujet, R.sujet); assert.equal(form.message, CITATION);
      assert.deepEqual(form.hidden, ['9000002', R.n7, '9100001', '0']);
      assert.equal(form.cite, 'Message auquel vous répondez');
    });
    const o = await p.evaluate(BAR);
    const rows = [...new Set(o.buttons.map(bt => Math.round(bt.y)))].length;
    check(`${pg} ${width} : même barre que Nouveau (18 boutons [4,4,4,6], ${width === 1280 ? 1 : (width === 375 ? 3 : 4)} ligne(s), ${mob ? 40 : 24} px), aucun défilement horizontal`, () => {
      assert.deepEqual(o.groups, [4, 4, 4, 6]);
      assert.deepEqual(o.buttons.map(bt => bt.icon), TOOLS.map(t => t[1]));
      assert.equal(rows, width === 1280 ? 1 : (width === 375 ? 3 : 4));
      for (const bt of o.buttons) { assert.ok(Math.abs(bt.h - (mob ? 40 : 24)) <= 0.6); }
      assert.ok(o.ox <= 0 && d.ox <= 0, `scrollX ${o.ox}/${d.ox}`);
    });
    if (SHOTS) {
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.screenshot({ path: path.join(SHOTS, `apres-${width}-${pg}-page.png`), fullPage: true });
      await shotDest(p, `apres-${width}-${pg}-dest`);
    }
    // Ajout et retrait sur une réponse : le prérempli est conservé
    await typeIn(p, 'sire');
    await settleDir(p, state, 'sire');
    await p.keyboard.press('Enter');
    d = await p.evaluate(DEST);
    check(`${pg} ${width} : ajout d'un destinataire → #dest = prérempli + « Sire Bastien; »`, () => { assert.equal(d.dest, R.dest + 'Sire Bastien; '); });
    if (R.chips.length) {
      const sel = `.kd-chip-x[aria-label="Retirer ${R.chips[0]}"]`;
      if (mob) {
        await p.evaluate(s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); window.scrollTo(0, Math.max(0, r.top + window.scrollY - window.innerHeight / 2)); }, sel);
        await p.tap(sel);
      } else { await p.click(sel); }
      d = await p.evaluate(DEST);
      check(`${pg} ${width} : retrait de « ${R.chips[0]} » par sa croix → #dest = « ${R.dest.replace(R.chips[0] + '; ', '')}Sire Bastien; »`, () => assert.equal(d.dest, R.dest.replace(R.chips[0] + '; ', '') + 'Sire Bastien; '));
    }
    // Saisie non validée : même blocage que sur Nouveau
    await typeIn(p, 'mar');
    await settleDir(p, state, 'mar');
    await p.click('form[name="post_msg"] button.btn-primary');
    d = await p.evaluate(DEST);
    const s0 = await p.evaluate(() => window.__submits.length);
    check(`${pg} ${width} : texte tapé non validé → envoi bloqué, « Validez ou effacez « mar » »`, () => { assert.equal(s0, 0); assert.match(d.msg, /Validez ou effacez « mar »/); });
    if (SHOTS && width !== 1280) { await shotDest(p, `apres-${width}-${pg}-blocage`); }
    await p.keyboard.press('Escape');
    await p.click('form[name="post_msg"] button.btn-primary');
    const sent = await p.evaluate(() => window.__submits);
    check(`${pg} ${width} : envoi natif, c[3] = destinataires des pastilles, sujet, message et champs cachés du site inchangés`, () => {
      assert.equal(sent.length, 1);
      const fd = Object.fromEntries(sent[0]);
      assert.equal(fd['c[3]'], d.dest);
      assert.equal(fd['c[1]'], R.sujet); assert.equal(fd.message.replace(/\r\n/g, '\n'), CITATION);
      assert.equal(fd['n[6]'], '9000002'); assert.equal(fd['n[7]'], R.n7); assert.equal(fd['n[5]'], '9100001');
    });
    check(`${pg} ${width} : aucune navigation, aucune erreur, aucune requête imprévue`, () => { assert.equal(state.documents, 1); assert.deepEqual(errors, [], JSON.stringify(errors)); assert.deepEqual(unexpected(state), [], JSON.stringify(unexpected(state))); });
    await context.close();
    if (SHOTS && AVANT) {
      const av = await open({ width, page: pg, bundle: 'avant', height: mob ? 800 : 900 });
      await av.page.screenshot({ path: path.join(SHOTS, `avant-${width}-${pg}-page.png`), fullPage: true });
      await av.context.close();
    }
  }
  // Thème désactivé sur une page de réponse : page 100 % native, #dest prérempli intact
  const off = await open({ width: 1280, page: pg, themeOn: false });
  const dOff = await off.page.evaluate(DEST);
  check(`${pg} thème désactivé : aucune interface du module, zones natives visibles, #dest prérempli intact`, () => {
    assert.equal(dOff.kd, false); assert.deepEqual(dOff.natives, { dest: true, contacts: true, search: true, results: true, plus: true }); assert.equal(dOff.dest, R.dest);
  });
  await off.context.close();
}

// =====================================================================================================
// 6 bis) Libellé « Destinataires » entre 768 et 1199 px (QA t_63fbb540, m-2) : dans sa colonne, à 8 px au moins du champ
// =====================================================================================================
if (frag('libelle')) {
  console.log('Libellé « Destinataires * » de 768 à 1199 px : même taille que les autres libellés, pas de débordement de sa colonne, écart >= 8 px avec le champ');
  for (const width of [768, 769, 780, 800, 830, 900, 991, 992, 1000, 1050, 1100, 1199, 1200, 1280]) {
    const { context, page: p } = await open({ width });
    const m = await p.evaluate(() => {
      const lab = document.querySelector('.kd-label');
      const range = document.createRange();
      range.selectNodeContents(lab);
      const rects = Array.from(range.getClientRects());
      const text = { l: Math.min(...rects.map(r => r.left)), r: Math.max(...rects.map(r => r.right)) };
      const box = lab.getBoundingClientRect();
      const cs = getComputedStyle(lab);
      const field = document.querySelector('.kd-field').getBoundingClientRect();
      // autres libellés visibles du formulaire (Expéditeur, Sujet, Message) : leur taille de police
      const others = Array.from(document.querySelectorAll('form[name="post_msg"] .form-group > label.control-label')).filter(l => l !== lab && l.offsetParent && /Expéditeur|Sujet|Message/.test(l.textContent)).map(l => getComputedStyle(l).fontSize);
      return { textL: text.l, textR: text.r, boxL: box.left, boxR: box.right, contentL: box.left + parseFloat(cs.paddingLeft), contentR: box.right - parseFloat(cs.paddingRight), font: cs.fontSize, others, field: field.left, lines: new Set(rects.map(r => Math.round(r.top))).size, sw: lab.scrollWidth, cw: lab.clientWidth, ox: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    const gap = Math.round((m.field - m.textR) * 10) / 10;
    console.log(`  ${width} px : ${m.font} (autres ${m.others.join('/')}), texte ${m.textL.toFixed(1)}–${m.textR.toFixed(1)}, colonne ${m.boxL.toFixed(1)}–${m.boxR.toFixed(1)} (contenu ${m.contentL.toFixed(1)}–${m.contentR.toFixed(1)}), champ à ${m.field.toFixed(1)}, écart ${gap} px, ${m.lines} ligne(s)`);
    check(`libellé ${width} px : « Destinataires * » dans sa colonne (texte ${m.textL.toFixed(0)}–${m.textR.toFixed(0)} ⊂ ${m.boxL.toFixed(0)}–${m.boxR.toFixed(0)}), écart ${gap} px >= 8 avec le champ, pas de scrollX`, () => {
      assert.ok(m.textL >= m.boxL - 0.5 && m.textR <= m.boxR + 0.5, JSON.stringify(m));
      assert.ok(m.sw <= m.cw, `débordement interne ${m.sw}/${m.cw}`);
      assert.ok(gap >= 8, `écart ${gap}`);
      assert.ok(m.ox <= 0);
    });
    // Re-QA t_503eb6f6, S-1 : de 768 à 1199 px, même taille de 13 px que les autres libellés, et le texte tient dans la zone de contenu
    // de sa colonne (marges comprises : aucun débordement, même de 1 px)
    if (width < 1200) {
      check(`libellé ${width} px : taille ${m.font} = celle des autres libellés (${m.others.join('/')}), texte dans la zone de contenu de sa colonne (${m.textL.toFixed(1)}–${m.textR.toFixed(1)} ⊂ ${m.contentL.toFixed(1)}–${m.contentR.toFixed(1)})`, () => {
        assert.ok(m.others.length >= 3, JSON.stringify(m.others));
        assert.ok(m.others.every(f => f === m.font), `${m.font} / ${m.others.join(',')}`);
        assert.equal(m.font, '13px');
        assert.ok(m.textL >= m.contentL - 0.5 && m.textR <= m.contentR + 0.5, JSON.stringify(m));
      });
    }
    if (SHOTS && [769, 992, 1100, 1280].includes(width)) {
      await p.evaluate(() => window.scrollTo(0, Math.max(0, document.querySelector('.kd-row').getBoundingClientRect().top + window.scrollY - 260)));
      await p.screenshot({ path: path.join(SHOTS, `S1-libelle-${width}.png`), clip: await p.evaluate(() => { const f = document.querySelector('form[name="post_msg"]').getBoundingClientRect(); const r = document.querySelector('.kd-row').getBoundingClientRect(); return { x: Math.max(0, f.left - 8), y: Math.max(0, r.top - 200), width: Math.min(document.documentElement.clientWidth - Math.max(0, f.left - 8), 640), height: r.height + 280 }; }) });
    }
    await context.close();
  }
}

// =====================================================================================================
// 6 ter) Texte indicatif « Membre ou personnage » (re-QA t_503eb6f6, S-2) : jamais coupé ; masqué dès qu'une pastille existe
// =====================================================================================================
if (frag('indicatif')) {
  console.log('Texte indicatif : entier sur un champ vide, masqué dès qu\'une pastille existe (Nouveau, Répondre prérempli), à 1280 / 375 / 320 px');
  const PH = () => {
    const i = document.querySelector('.kd-input');
    const cs = getComputedStyle(i);
    const c = document.createElement('canvas').getContext('2d');
    c.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    return { ph: i.placeholder, need: Math.ceil(c.measureText(i.placeholder).width), room: Math.floor(i.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)), chips: document.querySelectorAll('.kd-chip').length, ox: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  };
  for (const width of [1280, 375, 320]) {
    const mob = width < 768;
    const { context, page: p, errors } = await open({ width, height: mob ? 800 : 900 });
    let m = await p.evaluate(PH);
    check(`${width} Nouveau, champ vide : texte indicatif « Membre ou personnage » entier (${m.need} px pour ${m.room} px)`, () => { assert.equal(m.ph, 'Membre ou personnage'); assert.ok(m.need <= m.room, JSON.stringify(m)); });
    await p.focus('.kd-input');
    await p.keyboard.insertText('Marelle Duvent; ');
    await p.evaluate(() => document.activeElement.blur());
    m = await p.evaluate(PH);
    check(`${width} Nouveau, une pastille : texte indicatif masqué (aucun texte coupé), pas de scrollX`, () => { assert.equal(m.chips, 1); assert.equal(m.ph, ''); assert.ok(m.ox <= 0); });
    if (SHOTS) { await shotDest(p, `S2-indicatif-${width}-nouveau-pastille`); }
    await p.click('.kd-chip-x');
    m = await p.evaluate(PH);
    check(`${width} Nouveau, pastille retirée : le texte indicatif revient, entier`, () => { assert.equal(m.chips, 0); assert.equal(m.ph, 'Membre ou personnage'); assert.ok(m.need <= m.room, JSON.stringify(m)); });
    check(`${width} Nouveau : aucune erreur`, () => assert.deepEqual(errors, [], JSON.stringify(errors)));
    await context.close();
    const r = await open({ width, page: 'repondre', height: mob ? 800 : 900 });
    m = await r.page.evaluate(PH);
    check(`${width} Répondre (destinataire prérempli) : dès l'ouverture, une pastille et aucun texte indicatif coupé`, () => { assert.equal(m.chips, 1); assert.equal(m.ph, ''); assert.ok(m.ox <= 0); });
    if (SHOTS) { await shotDest(r.page, `S2-indicatif-${width}-repondre`); }
    await r.context.close();
  }
}

// =====================================================================================================
// 7) Non-régression des autres pages Kramail : rendu identique avant / après (pixel à pixel) et aucun ajout
// =====================================================================================================
if (frag('regression')) {
  console.log('Non-régression : réception, envoi, corbeille, lecture rendues avec le bundle d\'avant et celui d\'après (1280 / 375 / 320)');
  if (!AVANT) {
    check('bundle « avant » disponible (origin/feature/next ou KR_SCRIPT_AVANT)', () => assert.fail('introuvable'));
  } else {
    for (const pg of ['reception', 'envoi', 'corbeille', 'lecture']) {
      for (const width of [1280, 375, 320]) {
        const shots = {};
        const doms = {};
        for (const bundle of ['avant', 'apres']) {
          const { context, page: p, state, errors } = await open({ width, page: pg, bundle, height: 900 });
          await p.evaluate(() => {
            document.querySelectorAll('*').forEach(e => { e.style.transition = 'none'; e.style.animation = 'none'; e.style.caretColor = 'transparent'; });
            // Seule différence attendue entre les deux bundles : leur numéro de version, affiché en pied de page
            const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            while (w.nextNode()) { if (/1\.0\.\d{10,}/.test(w.currentNode.nodeValue)) { w.currentNode.nodeValue = w.currentNode.nodeValue.replace(/1\.0\.\d{10,}/g, '1.0.X'); } }
          });
          doms[bundle] = await p.evaluate(() => ({ kd: document.querySelectorAll('.kd, .kd-natif-cache, .kd-row').length, body: document.body.className, html: document.documentElement.className, n: document.querySelectorAll('*').length, ox: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
          // Capture stable : on recapture jusqu'à deux images consécutives identiques (sous charge, police et images peuvent
          // finir de se peindre après le repos du DOM) ; une vraie différence avant/après reste, elle, stable et détectée.
          let prev = await p.screenshot({ fullPage: true, animations: 'disabled' });
          for (let i = 0; i < 6; i++) {
            await p.waitForTimeout(150);
            const next = await p.screenshot({ fullPage: true, animations: 'disabled' });
            if (Buffer.compare(prev, next) === 0) { break; }
            prev = next;
          }
          shots[bundle] = prev;
          if (SHOTS && bundle === 'apres') { fs.writeFileSync(path.join(SHOTS, `regression-${pg}-${width}.png`), shots[bundle]); }
          doms[bundle].unexpected = unexpected(state);
          doms[bundle].errors = errors.length;
          await context.close();
        }
        // Octet pour octet si possible ; sinon pixels décodés, avec une tolérance bornée (bruit d'anticrénelage de Chromium sur
        // le coin arrondi d'un panneau et sur du texte, mesuré en A/A : même bundle des deux côtés, jusqu'à 9 pixels, écart <= 2 sur un canal ; voir PIX_MAX_*).
        const diffs = Buffer.compare(shots.avant, shots.apres) === 0 ? { identique: true } : await comparePixels(shots.avant, shots.apres);
        if (!diffs.identique) { console.log(`  note ${pg} ${width} px : captures non identiques octet pour octet, écart mesuré ${JSON.stringify(diffs)}`); }
        check(`${pg} ${width} px : rendu identique avant / après (capture pleine page octet pour octet), aucun élément ni classe du module, aucune erreur`, () => {
          assert.equal(doms.apres.kd, 0);
          assert.deepEqual({ ...doms.apres, unexpected: undefined }, { ...doms.avant, unexpected: undefined });
          assert.deepEqual(doms.apres.unexpected, []);
          assert.ok(pixelsEquivalent(diffs), `captures différentes (${shots.avant.length} / ${shots.apres.length} octets) : ${JSON.stringify(diffs)}`);
        });
      }
    }
  }
}

// =====================================================================================================
// 8) Contrastes (>= 4,5:1) sur les 16 thèmes
// =====================================================================================================
if (frag('themes')) {
  console.log('Contrastes AA du champ Destinataires et de la barre sur les 16 thèmes');
  const THEMES = ['kraland', 'empire-brun', 'paladium', 'theocratie-seelienne', 'paradigme-vert', 'khanat-elmerien', 'confederation-libre', 'royaume-ruthvenie',
    'kraland-dark', 'empire-brun-dark', 'paladium-dark', 'theocratie-seelienne-dark', 'paradigme-vert-dark', 'khanat-elmerien-dark', 'confederation-libre-dark', 'royaume-ruthvenie-dark'];
  // Couleur résolue par le moteur (color-mix compris) via un canvas, fond composé avec les ancêtres
  const MEASURE = (pairs) => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
    const rgba = c => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
    const bgOf = e => { const layers = []; for (let n = e; n; n = n.parentElement) { const c = rgba(getComputedStyle(n).backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] >= 1) { break; } } } let out = [255, 255, 255]; for (const l of layers.reverse()) { out = out.map((v, i) => l[i] * l[3] + v * (1 - l[3])); } return out; };
    const lum = ([r, g, b]) => { const f = v => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const ratio = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const out = {};
    for (const [k, sel, pseudo] of pairs) {
      const e = document.querySelector(sel); if (!e) { out[k] = null; continue; }
      const bg = bgOf(e);
      const fgc = rgba(pseudo ? getComputedStyle(e, pseudo).color : getComputedStyle(e).color);
      const fg = fgc.slice(0, 3).map((v, i) => v * fgc[3] + bg[i] * (1 - fgc[3]));
      out[k] = Math.round(ratio(fg, bg) * 100) / 100;
    }
    return out;
  };
  for (const variant of THEMES) {
    const { context, page: p } = await open({ width: 1280, variant });
    await p.focus('.kd-input');
    await p.keyboard.type('Alpha;Marelle Duvent;', { delay: 5 });
    await p.keyboard.type('mar', { delay: 20 });
    await settleDir(p, { ajax: [] }, 'mar');
    // « mar » : Marelle Duvent déjà choisie (grisée, pastille allumée), Omar Sablier active, Quentin Marl et l'annuaire en lignes normales
    const r1 = await p.evaluate(MEASURE, [['pastille', '.kd-chip:not(.is-dup) .kd-chip-name'], ['pastille allumée (doublon)', '.kd-chip.is-dup .kd-chip-name'], ['croix de pastille', '.kd-chip:not(.is-dup) .kd-chip-x'], ['saisie', '.kd-input'], ['section', '.kd-sec'], ['note de section', '.kd-sec small'], ['option', '.kd-opt:not(.is-active):not([aria-disabled]) .kd-opt-name'], ['option active', '.kd-opt.is-active .kd-opt-name'], ['étiquette', '.kd-opt:not(.is-active):not([aria-disabled]) .kd-opt-tag'], ['étiquette active', '.kd-opt.is-active .kd-opt-tag'], ['déjà ajouté', '.kd-opt[aria-disabled="true"] .kd-opt-tag'], ['grisé', '.kd-opt[aria-disabled="true"] .kd-opt-name'], ['avertissement', '.kd-warn'], ['pied', '.kd-foot'], ['Contacts', '.kd-contacts span'], ['outil Gras', 'form[name="post_msg"] .btn-toolbar a[href="javascript:addtag(\'b\',1);"]']]);
    await p.keyboard.press('Escape');
    await p.fill('.kd-input', '');
    await p.evaluate(() => { document.querySelector('.kd-input').dispatchEvent(new Event('input')); document.activeElement.blur(); });
    const r2 = await p.evaluate(MEASURE, [['aide', '.kd-help'], ['texte indicatif', '.kd-input', '::placeholder']]);
    // Envoi bloqué (texte tapé non validé) : message et boutons Ajouter / Effacer
    await p.focus('.kd-input');
    await p.keyboard.type('zz', { delay: 5 });
    await p.keyboard.press('Escape');
    await p.click('form[name="post_msg"] button.btn-primary');
    await p.mouse.move(0, 0);
    const r3 = await p.evaluate(MEASURE, [['message de blocage', '.kd-msg-text'], ['bouton Ajouter', '.kd-msg-add'], ['bouton Effacer', '.kd-msg-clear']]);
    await context.close();
    const all = { ...r1, ...r2, ...r3 };
    check(`thème ${variant} : textes du champ et de la barre >= 4,5:1`, () => {
      const bad = Object.entries(all).filter(([, v]) => v === null || v < 4.5).map(([k, v]) => `${k} ${v}`);
      assert.equal(bad.length, 0, bad.join(' ; '));
    });
  }
}

// =====================================================================================================
// 9) Captures « avant » (bundle de la base) pour la comparaison
// =====================================================================================================
if (frag('avant') && SHOTS && AVANT) {
  console.log('Captures avant (bundle de la base) : barre et zones natives, champ vide et résultats « mar »');
  for (const width of [1280, 375, 320]) {
    const { context, page: p } = await open({ width, bundle: 'avant', height: width < 768 ? 800 : 900 });
    const o = await p.evaluate(BAR);
    console.log(`  avant ${width} px : boutons ${o.buttons.map(b => `${b.w.toFixed(0)}x${b.h.toFixed(0)}`).join(' ')} ; barre ${o.bar.w}/${o.bar.sw} (défilement interne ${o.bar.sw - o.bar.w} px) ; scrollX ${o.ox}`);
    const clip = await p.evaluate(() => { const r = document.querySelector('form[name="post_msg"] .btn-toolbar').getBoundingClientRect(); window.scrollTo(0, Math.max(0, r.top + window.scrollY - 100)); const q = document.querySelector('form[name="post_msg"] .btn-toolbar').getBoundingClientRect(); return { x: 0, y: Math.max(0, q.top - 8), width: document.documentElement.clientWidth, height: q.height + 120 }; });
    await p.screenshot({ path: path.join(SHOTS, `avant-${width}-barre.png`), clip });
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({ path: path.join(SHOTS, `avant-${width}-page-vide.png`), fullPage: true });
    const g = await p.$('#dest');
    const row = await g.evaluateHandle(e => e.closest('.form-group'));
    await row.asElement().screenshot({ path: path.join(SHOTS, `avant-${width}-dest-vide.png`) });
    await p.type('#search', 'mar', { delay: 40 });
    await p.waitForFunction(() => document.querySelector('#results a'), null, { timeout: 5000 });
    await p.waitForTimeout(300);
    await p.evaluate(() => window.scrollTo(0, Math.max(0, document.querySelector('#dest').closest('.form-group').getBoundingClientRect().top + window.scrollY - 60)));
    await p.screenshot({ path: path.join(SHOTS, `avant-${width}-page-suggestions.png`) });
    await context.close();
  }
}

await browser.close();
console.log(failures ? `\n${failures} échec(s), ${passes} ok` : `\nTous les contrôles passent (${passes} ok)`);
process.exit(failures ? 1 : 0);
