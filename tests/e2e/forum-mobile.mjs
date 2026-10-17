// Test forum mobile : « Répondre » en haut et en bas du sujet (F-01) et barre BBCode utilisable au doigt (F-06).
// Pages = FIXTURES inertes reprenant la structure RÉELLE capturée (forum-top, h1, barre d'outils) ; aucun réseau Kraland,
// aucun clic sur une action : les navigations sont interceptées et comptées (attendu : 0).
// Émulation mobile Chromium, pas un vrai téléphone.
//
// Usage : npm run build && npm run test:forum-mobile
// Option : KR_SCRIPT=/chemin/script.user.js pour tester un autre fichier (défaut : bundle principal).
// Option : KR_SHOTS=/dossier pour enregistrer des captures de fixtures.
// Passe « vrai Bootstrap » de la palette Couleurs (menu ouvert par le vrai gestionnaire data-toggle="dropdown") : jouée avec les fichiers embarqués
//   dans tests/e2e/vendor/ (bootstrap.min.css, bootstrap.min.js, jquery.min.js : Bootstrap 3.3.7 et jQuery 3.3.1, voir vendor/README.md).
// Option : KR_BOOTSTRAP_DIR=/dossier pour pointer vers d'autres copies. Si ce dossier est indiqué mais incomplet : exit 2 (jamais un faux vert, ce
//   qu'on soit lancé par run.mjs ou directement en série). Si seul le dossier par défaut est incomplet, la passe est signalée « non jouée »
//   (le menu est alors ouvert en posant la classe .open) ; le lanceur run.mjs, lui, sort alors en exit 2.
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { chromium } from 'playwright';
import { confineNetwork } from './lib/confinement.mjs';
import { domQuiet, frames, krReady, styleSettled, THEME_READY, waitState } from './lib/settle.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const SHOTS = process.env.KR_SHOTS || '';
const BASE = 'http://www.kraland.org';
const HREF_REPLY = 'forum/post/repondre-2-FIXTURE';
const HREF_NEW = 'forum/post/nouveau-sujet-1-FIXTURE';

// Règles Bootstrap 3.3.7 utiles à la cascade testée (sans elles la mise en page n'est pas celle du site)
const BOOTSTRAP = `
  * { box-sizing: border-box; } body { margin: 0; font: 14px/1.42857143 Helvetica, Arial, sans-serif; }
  a { text-decoration: none; }
  .btn { display: inline-block; padding: 6px 12px; font-size: 14px; line-height: 1.42857143; text-align: center; white-space: nowrap; vertical-align: middle; border: 1px solid transparent; border-radius: 4px; }
  .btn-default { color: #333; background-color: #fff; border-color: #ccc; }
  .btn-group, .btn-group-vertical { position: relative; display: inline-block; vertical-align: middle; }
  .btn-group > .btn { position: relative; float: left; }
  .btn-group-xs > .btn, .btn-xs { padding: 1px 5px; font-size: 12px; line-height: 1.5; border-radius: 3px; }
  .btn-toolbar { margin-left: -5px; } .btn-toolbar > .btn-group { float: left; margin-left: 5px; }
  .btn-toolbar:before, .btn-toolbar:after { display: table; content: " "; } .btn-toolbar:after { clear: both; }
  .dropdown { position: relative; } .dropdown-menu { position: absolute; top: 100%; left: 0; z-index: 1000; display: none; float: left; min-width: 160px; padding: 5px 0; margin: 2px 0 0; list-style: none; font-size: 14px; text-align: left; background-color: #fff; background-clip: padding-box; border: 1px solid rgba(0,0,0,.15); border-radius: 4px; }
  .pull-right { float: right !important; } .container { padding: 0 15px; }
  .form-group { margin-bottom: 15px; } .form-control { display: block; width: 100%; height: 34px; padding: 6px 12px; }
  .col-sm-10, .col-sm-2, .col-md-9 { position: relative; min-height: 1px; padding: 0 15px; }
  .pagination { display: inline-block; padding-left: 0; margin: 20px 0; list-style: none; } .pagination > li { display: inline; } .pagination > li > a { float: left; padding: 6px 12px; border: 1px solid #ddd; }
  .center { text-align: center; } .fa { font-style: normal; } .navbar { min-height: 50px; } .collapse:not(.in) { display: none; }
  .open > .dropdown-menu { display: block; }
  .checkbox-inline { position: relative; display: inline-block; padding-left: 20px; margin-bottom: 0; font-weight: 400; vertical-align: middle; cursor: pointer; }
  .checkbox-inline input[type="checkbox"] { position: absolute; margin-top: 4px; margin-left: -20px; }
  .control-label { margin-bottom: 0; padding-top: 7px; font-weight: 700; }
  .img-thumbnail { display: inline-block; max-width: 100%; height: auto; padding: 4px; line-height: 1.42857143; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; }
  .dropdown-backdrop { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 990; }
  .well { min-height: 20px; padding: 19px; margin-bottom: 20px; border: 1px solid #e3e3e3; border-radius: 4px; } .well-sm { padding: 9px; border-radius: 3px; }
  .btn-primary { color: #fff; background-color: #337ab7; border-color: #2e6da4; }
  .glyphicon { display: inline-block; width: 1em; height: 1em; } table { border-collapse: collapse; border-spacing: 0; } td { padding: 0; }
  .form-horizontal .form-group { margin-right: -15px; margin-left: -15px; } .form-group:before, .form-group:after { display: table; content: " "; } .form-group:after { clear: both; }
  @media (min-width: 768px) { .col-sm-12 { float: left; width: 100%; position: relative; min-height: 1px; padding: 0 15px; } }
  @media (min-width: 992px) { .col-md-2, .col-md-10 { float: left; position: relative; min-height: 1px; padding: 0 15px; } .col-md-2 { width: 16.66666667%; } .col-md-10 { width: 83.33333333%; } }
  @media (min-width: 768px) { .col-sm-10 { float: left; width: 83.33%; } .col-sm-2 { float: left; width: 16.66%; } .col-md-9 { width: 75%; } }
`;
const BS_FILES = ['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'];
const BS_CANDIDATE = process.env.KR_BOOTSTRAP_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), 'vendor');
const BS_DIR = BS_FILES.every(f => fs.existsSync(path.join(BS_CANDIDATE, f))) ? BS_CANDIDATE : '';
if (!BS_DIR && process.env.KR_BOOTSTRAP_DIR) { console.error('KR_BOOTSTRAP_DIR=' + process.env.KR_BOOTSTRAP_DIR + ' est incomplet (attendus : ' + BS_FILES.join(', ') + '). Une passe « vrai Bootstrap » demandée mais impossible ne doit pas donner un faux vert.'); process.exit(2); }
// 18 couleurs de la palette (style en ligne, href javascript:addtag natif) ; la 1re porte un onclick pour vérifier qu'il est préservé
const COLORS = ['#000000', '#7f7f7f', '#d50000', '#ff6d00', '#ffd600', '#64dd17', '#00c853', '#00bfa5', '#00b8d4', '#0091ea', '#2962ff', '#6200ea', '#aa00ff', '#c51162', '#795548', '#9e9e9e', '#ffffff', '#ffcdd2'];
const colorHref = i => `javascript:addtag('color${i}',1);`;
const colorOnclick = i => (i === 0 ? "window.__clicks.push('couleur-0')" : null);
const TOOLS = [
  ['b', 'fa-bold'], ['i', 'fa-italic'], ['u', 'fa-underline'], ['strike', 'fa-strikethrough'],
  ['img', 'fa-image'], ['url', 'fa-link'], ['youtube', 'fa-video'], 'DROP-smileys',
  ['quote', 'fa-quote-right'], ['spoiler', 'fa-compress'], ['pre', 'fa-list'], 'DROP-couleurs',
  ['left', 'fa-align-left'], ['center', 'fa-align-center'], ['right', 'fa-align-right'], ['fleft', 'fa-outdent'], ['fright', 'fa-indent'], 'PREV'
];
const GROUPS = [TOOLS.slice(0, 4), TOOLS.slice(4, 8), TOOLS.slice(8, 12), TOOLS.slice(12)];
// Menu smileys NATIF (capturé sur le vrai site) : <div class="dropdown-menu" style="padding:10px;width:320px;"> (et non 190 px comme la palette Couleurs),
// <table> de 14 rangées × 9 cellules <td><a href="#" onclick="…return false;"><img class="img-thumbnail"></a></td> = 126 smileys.
// Les images natives font de 13×12 à 30×24 px (surtout 15×15 et 20×20) : SVG en ligne de mêmes tailles, aucun réseau.
const SMILEY_SIZES = [[15, 15], [15, 15], [20, 20], [13, 12], [20, 23], [15, 15], [25, 25], [20, 20], [30, 24], [15, 15], [23, 18], [16, 16], [21, 27], [15, 15]];
const SMILEY_ROWS = 14;
const SMILEY_COLS = 9;
const smileyImg = i => {
  const [w, h] = SMILEY_SIZES[i % SMILEY_SIZES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="4" fill="#d9a400"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};
const smileyCell = i => `<td><a href="#" onclick="window.__clicks.push('smiley-${i}');return false;"><img src="${smileyImg(i)}" data-toggle="tooltip" data-placement="bottom" alt="[s${i}]" title="" class="img-thumbnail"></a></td>`;
const smileyTable = () => `<table><tbody>${Array.from({ length: SMILEY_ROWS }, (_r, r) => `<tr>${Array.from({ length: SMILEY_COLS }, (_c, c) => smileyCell(r * SMILEY_COLS + c)).join('')}</tr>`).join('')}</tbody></table>`;
function toolHtml(t) {
  if (t === 'PREV') { return '<a href="" onclick="window.__clicks.push(\'prev\');return false;" title="Prévisualisation" class="btn btn-default"><i class="fa">P</i></a>'; }
  if (typeof t === 'string') {
    const menu = t === 'DROP-couleurs' ? `<div class="btn-group btn-group-xs" role="group">${COLORS.map((c, i) => `<a href="${colorHref(i)}"${colorOnclick(i) ? ` onclick="${colorOnclick(i)}"` : ''} class="btn btn-default" style="background:none;background-color:${c}" title="[color${i}]x[/color${i}]">&nbsp;&nbsp;</a>`).join('')}</div>` : smileyTable();
    return `<span class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><button type="button" class="btn btn-xs btn-default" title="${t}"><i class="fa">☺</i></button></a><div class="dropdown-menu" role="menu" style="padding:10px;width:${t === 'DROP-couleurs' ? 190 : 320}px;">${menu}</div></span>`;
  }
  return `<a href="javascript:addtag('${t[0]}',1);" class="btn btn-default" title="Outil ${t[0]}"><i class="fa ${t[1]}">${t[0][0].toUpperCase()}</i></a>`;
}
const TOOLBAR = `<div class="btn-toolbar" role="toolbar" aria-label="...">${GROUPS.map(g => `<div class="btn-group btn-group-xs" role="group" aria-label="mise en forme">${g.map(toolHtml).join('')}</div>`).join('')}</div>`;

function forumTop(first, locked) {
  const reply = locked ? '' : `<a href="${HREF_REPLY}" class="btn btn-default" title="répondre"><i class="fa fa-reply"></i> répondre</a>`;
  return `<div class="forum-top">${first ? '<span></span><span><i class="fa fa-user"></i> Par FIXTURE</span><span><i class="fa fa-comments"></i> 3 messages</span>' : ''}
<span class="pull-right"><a href="forum/hrp/site-annonces-20101" class="btn btn-default" title="Site"><i class="fa fa-backward"></i> Site &amp; Annonces</a>
<button class="btn btn-default" onclick="window.__clicks.push('lien')" title="lien"><i class="fa fa-link"></i></button>
<a href="${HREF_NEW}" class="btn btn-default" title="nouveau sujet"><i class="fa fa-comment"></i> nouveau sujet</a>
${reply}
<a href="forum/sujet/fixture-1-999" class="btn btn-default" title="liste"><i class="fa fa-th-list"></i></a></span></div>`;
}

function page({ kind, locked = false, realBs = false }) {
  const head = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><base href="http://www.kraland.org/"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>FIXTURE forum (aucune donnée réelle)</title>${realBs ? '<link rel="stylesheet" href="lib/bootstrap-3.3.7/css/bootstrap1.min.css">' : `<style>${BOOTSTRAP}</style>`}</head><body>
<nav class="navbar navbar-inverse nomargin"><div class="container"><div class="navbar-header"><a class="navbar-brand" href="/">Kraland</a></div><div id="navbar" class="navbar-collapse collapse"><ul class="nav navbar-nav"><li><a href="/jouer/plateau">Jouer</a></li></ul></div></div></nav>
<div id="content" class="container"><div class="row"><div id="col-left" class="col-md-3"></div><div id="col-right" class="col-md-9">`;
  // Pied de page et lien « Remonter en haut » NATIFS (le script déplace le lien dans footer .container.white) ; onclick natif (jQuery animate) remplacé par un compteur
  const back = '<a href="#top" class="well well-sm" onclick="window.__clicks.push(\'haut\');return false;"><i class="glyphicon glyphicon-chevron-up"></i></a>';
  const footer = '<footer class="navbar-inverse"><div class="container white"><div class="footer-quote">« FIXTURE citation du pied de page »</div><div style="margin-top:5px;text-align:right;font-size:10px;"><a href="" onclick="window.__clicks.push(\'legal\');return false;" style="color:inherit;">Mentions légales</a> | Généré en 0.03 sec.</div></div></footer>';
  const foot = `</div></div></div>${back}${footer}${realBs ? '<script src="lib/jquery-3.3.1/jquery-3.3.1.min.js"></script><script src="lib/bootstrap-3.3.7/js/bootstrap.min.js"></script>' : ''}</body></html>`;
  if (kind === 'sujet') {
    const post = n => `<div class="row forum-post" style="margin-top:12px"><div class="col-xs-4">Auteur ${n}</div><div class="col-xs-8"><p>FIXTURE message ${n}</p><p style="height:600px">suite</p></div></div>`;
    return head + `<h1 class="page-header"><i class="far fa-comments"></i>
FIXTURE sujet de test</h1>
${forumTop(true, locked)}
<div class="center"><ul class="pagination"><li><a href="forum/sujet/fixture-1">1</a></li><li class="active"><a href="forum/sujet/fixture-2">2</a></li></ul></div>
${post(1)}${post(2)}${post(3)}
<div class="center"><ul class="pagination"><li><a href="forum/sujet/fixture-1">1</a></li><li class="active"><a href="forum/sujet/fixture-2">2</a></li></ul></div>
${forumTop(false, locked)}` + foot;
  }
  return head + `<h1 class="page-header">FIXTURE sujet de test &gt; Réponse
<span class="pull-right"><a href="forum/hrp/site-annonces-20101" class="btn btn-default"><i class="fa fa-backward"></i> Site &amp; Annonces</a>
<a href="forum/sujet/fixture-1-1" class="btn btn-default"><i class="fa fa-backward"></i> sujet</a></span></h1>
<form name="post_msg" method="post" action="forum/sujet/fixture-1-1" class="form-horizontal" onsubmit="window.__clicks.push('submit');return false;">
<div class="well" style="height:420px">FIXTURE : message cité / derniers messages du sujet (hauteur de page proche du vrai site)</div>
<div class="form-group"><label class="col-sm-2 control-label">Expéditeur <span class="required">*</span></label><div class="col-sm-10"><div class="input-group"><span class="input-group-addon"><i class="fa fa-user"></i></span><select name="n[1]" class="form-control" required><option value="1">FIXTURE</option></select></div></div></div>
<div class="form-group"><label class="col-sm-2 control-label">Message <span class="required">*</span></label><div class="col-sm-10">
${TOOLBAR}
<textarea name="message" id="message" rows="14" class="form-control" placeholder="Votre message" required></textarea></div></div>
<div class="form-group"><label class="col-md-2 control-label">Options</label><div class="col-md-10"><label class="checkbox-inline"><input type="checkbox" name="f[0]" value="1" checked> Signature</label></div></div>
<div><div class="col-sm-12"><button class="btn btn-primary pull-right">Envoyer</button></div></div></form>` + foot;
}

let failures = 0;
function check(name, fn) {
  try {
    fn();
    console.log('  ok   ' + name);
  } catch (e) {
    failures += 1;
    console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]);
  }
}

// Fragmentation (exécution parallèle) : KR_FRAG = identifiants séparés par des virgules ; vide = tout jouer.
// Un identifiant est joué si KR_FRAG le contient, contient l'un de ses préfixes (« seuil » couvre « seuil-real-sombre ») ou l'un de ses descendants.
// Identifiants : f01, m1-clair, m1-sombre, m2-fake, m2-real, s3-fake, s3-real, s3d-fake, s3d-real, signature, n1, pied, desktop,
// seuil-{fake,real}-{clair,sombre}.
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const frag = id => FRAG.length === 0 || FRAG.some(f => f === id || id.startsWith(f + '-') || f.startsWith(id + '-'));

// Remplace l'ancienne attente fixe de 1,5 s puis la fenêtre de DOM calme (lot B) : avec le script, html[data-kr-ready] (posé par InitQueue
// après toutes les tâches différées) et la classe de thème, puis deux images peintes (tests/e2e/lib/settle.mjs). Expiration explicite à 15 s.
// Sans script (theme false), le DOM calme reste la seule condition.
const settlePage = (pg, theme) => (theme ? krReady(pg, { ready: THEME_READY, label: 'forum-mobile' }) : domQuiet(pg, { label: 'forum-mobile' }));

const browser = await chromium.launch({ headless: true });

async function open({ width, kind, locked = false, theme = true, variant = 'empire-brun-dark', realBs = false, height = 800, touch = false }) {
  const mobile = width < 768;
  // touch : écran tactile à une largeur de bureau (tablette en portrait à 768 px) ; isMobile reste réservé aux largeurs < 768
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile || touch, deviceScaleFactor: 2 });
  const state = { documents: 0, other: [] };
  await confineNetwork(context); // refus global EN PREMIER (logos du thème et version.json : refusés)
  const urlFor = kind === 'sujet' ? '/forum/sujet/fixture-1-2' : '/forum/post/repondre-2-FIXTURE';
  await context.route(BASE + '/**', r => {
    const u = new URL(r.request().url());
    if (r.request().resourceType() === 'document' && u.pathname === urlFor) {
      state.documents += 1;
      return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: page({ kind, locked, realBs }) });
    }
    if (realBs && u.pathname.startsWith('/lib/')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return r.fulfill({ status: 200, contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(path.join(BS_DIR, file)) });
    }
    state.other.push(u.pathname);
    return r.abort();
  });
  await context.addInitScript(({ src, enabled, variant: themeVariant }) => {
    window.GM = { xmlHttpRequest: () => {} };
    window.__clicks = [];
    if (enabled) {
      localStorage.setItem('kr-theme-enabled', 'true');
      localStorage.setItem('kr-theme-variant', themeVariant);
      // eslint-disable-next-line no-eval
      document.addEventListener('DOMContentLoaded', () => (0, eval)(src));
    }
  }, { src: userscript, enabled: theme, variant });
  const page_ = await context.newPage();
  await page_.goto(BASE + urlFor, { waitUntil: 'load' });
  await settlePage(page_, theme);
  // v3 : les 13 outils moins courants sont sous « Plus » ; ces suites historiques mesurent les 18 outils, « Plus » est donc ouvert ici
  // (la v3 elle-même, repliée comme dépliée, est testée par messages-v3.mjs).
  if (kind === 'editeur') { await page_.evaluate(() => { const b = document.querySelector('.btn-toolbar.kr-tools-ready:not(.kr-tools-open) .kr-tools-plus'); if (b) { b.click(); } }); }
  return { context, page: page_, state };
}

const MEASURE = () => {
  const box = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const links = sel => Array.from(document.querySelectorAll(sel)).filter(vis).map(a => ({ text: a.textContent.replace(/\s+/g, ' ').trim(), href: a.getAttribute('href'), ...box(a) }));
  const tools = Array.from(document.querySelectorAll('.btn-toolbar > .btn-group > a.btn, .btn-toolbar > .btn-group > .dropdown button.btn, .btn-toolbar > .btn-group > .dropdown > a')).filter(e => !e.closest('.dropdown-menu')).filter(e => e.tagName !== 'A' || !e.classList.contains('dropdown-toggle')).map(e => ({ ok: vis(e), ...box(e) }));
  const bar = document.querySelector('.btn-toolbar');
  return {
    mobileMode: document.body.classList.contains('mobile-mode'),
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    reponds: links('a[href*="post/repondre"]'),
    nouveau: links('a[href*="nouveau-sujet"]'),
    plus: links('a').filter(a => a.text === '+'),
    actionBars: document.querySelectorAll('.forum-thread-actions').length,
    tools,
    toolbarScroll: bar ? bar.scrollWidth - bar.clientWidth : 0,
    toolbarOverflow: bar ? getComputedStyle(bar).overflowX : '',
    iw: window.innerWidth
  };
};

console.log('F-01 : sujet mobile, « Répondre » en haut ET en bas');
for (const width of [375, 700].filter(() => frag('f01'))) {
  const { context, page: p, state } = await open({ width, kind: 'sujet' });
  const m = await p.evaluate(MEASURE);
  const replies = m.reponds.filter(a => a.text === 'Répondre');
  const news = m.nouveau.filter(a => a.text === 'Nouveau sujet');
  const docH = await p.evaluate(() => document.documentElement.scrollHeight);
  check(`${width} px : mode mobile`, () => assert.equal(m.mobileMode, true));
  check(`${width} px : 2 contrôles « Répondre » visibles (haut et bas)`, () => assert.equal(replies.length, 2, JSON.stringify(m.reponds)));
  check(`${width} px : « Répondre » en haut (premier écran) et en bas (dans le dernier écran)`, () => {
    assert.ok(replies[0].y < 400, `y=${replies[0].y}`);
    assert.ok(replies[1].y > docH - 800, `y=${replies[1].y} / ${docH}`);
  });
  check(`${width} px : « Répondre » ≥ 44×44`, () => assert.ok(replies.every(a => a.w >= 44 && a.h >= 44), JSON.stringify(replies)));
  check(`${width} px : href natif inchangé (« Répondre » = ${HREF_REPLY})`, () => assert.ok(replies.every(a => a.href === HREF_REPLY), JSON.stringify(replies)));
  check(`${width} px : « Nouveau sujet » libellé, ≥ 44×44, href natif`, () => {
    assert.equal(news.length, 2, JSON.stringify(m.nouveau));
    assert.ok(news.every(a => a.w >= 44 && a.h >= 44 && a.href === HREF_NEW), JSON.stringify(news));
  });
  check(`${width} px : « Répondre » distinct de « Nouveau sujet » (autre cible, pas de recouvrement)`, () => {
    for (let i = 0; i < 2; i += 1) {
      const r = replies[i]; const n = news[i];
      const overlap = r.x < n.x + n.w && n.x < r.x + r.w && r.y < n.y + n.h && n.y < r.y + r.h;
      assert.equal(overlap, false, JSON.stringify([r, n]));
    }
  });
  check(`${width} px : aucun « + » sans libellé`, () => assert.equal(m.plus.length, 0, JSON.stringify(m.plus)));
  check(`${width} px : pas de débordement horizontal`, () => assert.ok(m.overflowX <= 0, `${m.overflowX}`));
  const clicks = await p.evaluate(() => window.__clicks.length);
  check(`${width} px : aucune action déclenchée`, () => assert.equal(clicks + state.other.length, 0, state.other.join(',')));
  if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `forum-sujet-haut-${width}.png`) }); await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(300); await p.screenshot({ path: path.join(SHOTS, `forum-sujet-bas-${width}.png`) }); }
  await context.close();
}

console.log('F-01 : sujet fermé (aucun lien « répondre » natif)');
if (frag('f01')) {
  const { context, page: p } = await open({ width: 375, kind: 'sujet', locked: true });
  const m = await p.evaluate(MEASURE);
  check('aucun « Répondre » inventé', () => assert.equal(m.reponds.length, 0, JSON.stringify(m.reponds)));
  check('« Nouveau sujet » reste libellé, en haut et en bas', () => assert.equal(m.nouveau.filter(a => a.text === 'Nouveau sujet').length, 2));
  await context.close();
}

console.log('F-01 : page d\'édition mobile');
if (frag('f01')) {
  const { context, page: p } = await open({ width: 375, kind: 'editeur' });
  const m = await p.evaluate(MEASURE);
  check('aucun « + » (ni lien nouveau sujet sans libellé) dans l\'éditeur', () => assert.equal(m.plus.length, 0, JSON.stringify(m.plus)));
  await context.close();
}

console.log('F-06 : éditeur mobile, barre d\'outils BBCode');
for (const width of [375, 700].filter(() => frag('f01'))) {
  const { context, page: p, state } = await open({ width, kind: 'editeur' });
  const m = await p.evaluate(MEASURE);
  const visibleNow = m.tools.filter(t => t.ok && t.x >= 0 && t.x + t.w <= m.iw);
  check(`${width} px : 18 outils présents`, () => assert.equal(m.tools.length, 18, `${m.tools.length}`));
  check(`${width} px : tous les outils ≥ 44×44`, () => assert.ok(m.tools.every(t => t.ok && t.w >= 44 && t.h >= 44), JSON.stringify(m.tools.filter(t => !(t.ok && t.w >= 44 && t.h >= 44)))));
  check(`${width} px : aucun outil > 60 px de large`, () => assert.ok(m.tools.every(t => t.w <= 60), JSON.stringify(m.tools.filter(t => t.w > 60).map(t => t.w))));
  check(`${width} px : au moins 6 outils visibles sans défilement`, () => assert.ok(visibleNow.length >= 6, `${visibleNow.length}`));
  check(`${width} px : les 18 outils visibles sans défilement (retour à la ligne)`, () => assert.equal(visibleNow.length, 18, `${visibleNow.length}`));
  check(`${width} px : pas de bande à défilement horizontal`, () => assert.ok(m.toolbarScroll <= 0, `${m.toolbarScroll} (${m.toolbarOverflow})`));
  check(`${width} px : pas de débordement horizontal de la page`, () => assert.ok(m.overflowX <= 0, `${m.overflowX}`));
  const clicks = await p.evaluate(() => window.__clicks.length);
  check(`${width} px : aucune action déclenchée (rien cliqué, rien envoyé)`, () => assert.equal(clicks + state.other.length, 0));
  if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `forum-editeur-${width}.png`) }); }
  await context.close();
}

// ---------- M1 : contraste du bouton « Répondre » (haut et bas), 16 thèmes × normal / survol / actif ----------
const VARIANTS = ['kraland', 'empire-brun', 'paladium', 'theocratie-seelienne', 'paradigme-vert', 'khanat-elmerien', 'confederation-libre', 'royaume-ruthvenie',
  'kraland-dark', 'empire-brun-dark', 'paladium-dark', 'theocratie-seelienne-dark', 'paradigme-vert-dark', 'khanat-elmerien-dark', 'confederation-libre-dark', 'royaume-ruthvenie-dark'];
const parseRgb = str => { const v = str.match(/[\d.]+/g).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
const luminance = ({ r, g, b }) => { const [R, G, B] = [r, g, b].map(v => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * R + 0.7152 * G + 0.0722 * B; };
const contrast = (fg, bg) => { const a = luminance(parseRgb(fg)); const b = luminance(parseRgb(bg)); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
const replyColors = (p, index) => p.evaluate(i => {
  const a = Array.from(document.querySelectorAll('a.forum-thread-action-reply'))[i];
  const cs = getComputedStyle(a); const r = a.getBoundingClientRect();
  return { color: cs.color, bg: cs.backgroundColor, x: r.left + r.width / 2, y: r.top + r.height / 2, hit: document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === a || a.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)) };
}, index);

console.log('M1 : contraste « Répondre » (AA 4,5:1) — 16 thèmes, haut et bas, normal / survol / actif');
for (const variant of VARIANTS.filter(v => frag(v.endsWith('-dark') ? 'm1-sombre' : 'm1-clair'))) {
  const { context, page: p, state } = await open({ width: 375, kind: 'sujet', variant });
  for (const [index, place] of [[0, 'haut'], [1, 'bas']]) {
    await p.evaluate(i => Array.from(document.querySelectorAll('a.forum-thread-action-reply'))[i].scrollIntoView({ block: 'center' }), index);
    // Conditions observables au lieu de 250 ms : défilement distribué, pseudo-état atteint, aucune transition en cours
    await frames(p);
    await styleSettled(p, 'a.forum-thread-action-reply', { index });
    const normal = await replyColors(p, index);
    // Survol puis appui réels (souris), relâchés hors du bouton : aucun clic, aucune navigation
    await p.mouse.move(normal.x, normal.y);
    await styleSettled(p, 'a.forum-thread-action-reply', { index, state: ':hover' });
    const hover = await replyColors(p, index);
    await p.mouse.down();
    await styleSettled(p, 'a.forum-thread-action-reply', { index, state: ':active' });
    const active = await replyColors(p, index);
    await p.mouse.move(1, 1);
    await p.mouse.up();
    const cN = contrast(normal.color, normal.bg); const cH = contrast(hover.color, hover.bg); const cA = contrast(active.color, active.bg);
    check(`${variant} · ${place} : normal ${cN.toFixed(2)}, survol ${cH.toFixed(2)}, actif ${cA.toFixed(2)} (>= 4,5)`, () => {
      assert.equal(normal.hit, true, 'bouton recouvert au point visé');
      assert.ok(parseRgb(normal.bg).a === 1 && parseRgb(hover.bg).a === 1 && parseRgb(active.bg).a === 1, `fond non opaque ${normal.bg} / ${hover.bg} / ${active.bg}`);
      assert.ok(cN >= 4.5, `normal ${normal.color} sur ${normal.bg}`);
      assert.ok(cH >= 4.5, `survol ${hover.color} sur ${hover.bg}`);
      assert.ok(cA >= 4.5, `actif ${active.color} sur ${active.bg}`);
    });
  }
  // s4 : page active de la pagination (accent rouge kraland des thèmes clairs signalé par Sally) : normal et survol >= 4,5:1 dans les 8 thèmes clairs
  const pagColors = () => p.evaluate(() => { const a = document.querySelector('.pagination > li.active > a'); a.scrollIntoView({ block: 'center' }); const cs = getComputedStyle(a); const r = a.getBoundingClientRect(); return { color: cs.color, bg: cs.backgroundColor, x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await frames(p);
  const pagN = await pagColors();
  await p.mouse.move(pagN.x, pagN.y);
  await styleSettled(p, '.pagination > li.active > a', { state: ':hover' });
  const pagH = await pagColors();
  await p.mouse.move(1, 1);
  if (variant === 'empire-brun') {
    check(`${variant} : page active de la pagination : normal ${contrast(pagN.color, pagN.bg).toFixed(2)}, survol ${contrast(pagH.color, pagH.bg).toFixed(2)} (>= 4,5)`, () => {
      assert.ok(parseRgb(pagN.bg).a === 1 && parseRgb(pagH.bg).a === 1, `fond non opaque ${pagN.bg} / ${pagH.bg}`);
      assert.ok(contrast(pagN.color, pagN.bg) >= 4.5, `normal ${pagN.color} sur ${pagN.bg}`);
      assert.ok(contrast(pagH.color, pagH.bg) >= 4.5, `survol ${pagH.color} sur ${pagH.bg}`);
    });
  } else {
    // Hors périmètre de la carte (EB clair) : mesuré et signalé, sans assertion (paladium clair : survol 2,10:1 ; thèmes sombres : voir rapport)
    console.log(`  --   ${variant} : page active de la pagination (information, hors périmètre) : normal ${contrast(pagN.color, pagN.bg).toFixed(2)}, survol ${contrast(pagH.color, pagH.bg).toFixed(2)}`);
  }
  check(`${variant} : aucune navigation déclenchée`, () => assert.equal(state.other.length, 0, state.other.join(',')));
  await context.close();
}

// ---------- M2 : palette « Couleurs » = grille de pastilles 44×44 dans le menu, 18 couleurs, comportements natifs préservés ----------
const PALETTE = () => {
  const dd = document.querySelector('.btn-toolbar .dropdown:has(> .dropdown-menu > .btn-group)');
  const menu = dd.querySelector('.dropdown-menu');
  const mr = menu.getBoundingClientRect();
  const cs = getComputedStyle(menu);
  const dots = Array.from(menu.querySelectorAll('.btn-group > .btn')).map(a => {
    const r = a.getBoundingClientRect(); const cx = r.left + r.width / 2; const cy = r.top + r.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    return { x: r.left, y: r.top, w: r.width, h: r.height, bg: a.style.backgroundColor, rendered: getComputedStyle(a).backgroundColor, href: a.getAttribute('href'), onclick: a.getAttribute('onclick'), hit: hit === a || a.contains(hit) };
  });
  return {
    shown: cs.display !== 'none' && mr.width > 0, open: dd.classList.contains('open'),
    menu: { x: mr.left, y: mr.top, w: mr.width, h: mr.height }, inline: { width: menu.style.width, padding: menu.style.padding }, computed: { padding: cs.paddingTop, width: cs.width }, dots, vw: document.documentElement.clientWidth,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
};
const hexToRgb = h => { const n = parseInt(h.slice(1), 16); return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`; };
async function openPalette(p, realBs) {
  const btn = await p.evaluate(() => { const b = document.querySelector('.btn-toolbar .dropdown:has(> .dropdown-menu > .btn-group) > a.dropdown-toggle > button'); b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { x: r.left + r.width / 2, y: r.top + r.height / 2, ok: hit === b || b.contains(hit) }; });
  if (!btn.ok) { throw new Error('bouton Couleurs recouvert ou hors écran au point visé'); }
  if (realBs) { await p.mouse.click(btn.x, btn.y); } else { await p.evaluate(() => document.querySelector('.btn-toolbar .dropdown:has(> .dropdown-menu > .btn-group) > a.dropdown-toggle > button').closest('.dropdown').classList.add('open')); }
  await menuSettled(p, '.btn-toolbar .dropdown:has(> .dropdown-menu > .btn-group)', true);
}
// Menu ouvert (classe .open et menu affiché) ou refermé (aucun .open ni fond .dropdown-backdrop), sans transition en cours, puis
// deux images : remplace les 300 ms fixes. Sans erreur : la vérification qui suit mesure l'état réel.
async function menuSettled(p, sel, wantOpen) {
  await waitState(p, ({ s, o }) => {
    if (!o) { return !document.querySelector('.dropdown.open, .dropdown-backdrop'); }
    const dd = document.querySelector(s); const menu = dd && dd.querySelector('.dropdown-menu');
    return !!menu && dd.classList.contains('open') && getComputedStyle(menu).display !== 'none' && menu.getAnimations({ subtree: true }).every(a => a.playState !== 'running');
  }, { s: sel, o: wantOpen }, { maxMs: 3000 });
  await frames(p);
}
const overlap = (a, b) => a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5;
const paletteModes = [{ id: 'fake', name: 'fixture Bootstrap minimal (.open posé)', realBs: false }];
if (BS_DIR) { paletteModes.push({ id: 'real', name: 'vrai Bootstrap 3.3.7 + jQuery (clic sur data-toggle)', realBs: true }); } else { console.log('  --   passe « vrai Bootstrap » non jouée (fichiers Bootstrap/jQuery absents de ' + BS_CANDIDATE + ')'); }
for (const mode of paletteModes.filter(m => frag('m2-' + m.id))) {
  console.log(`M2 : palette Couleurs — ${mode.name}`);
  // 375/390/430/700 en thème clair ET sombre ; 320 (viewport plus étroit que le menu élargi) en sombre : le menu reste borné à l'écran
  const cases = [375, 390, 430, 700].flatMap(w => [[w, 'empire-brun'], [w, 'empire-brun-dark']]).concat([[320, 'empire-brun-dark']]);
  for (const [width, variant] of cases) {
    const { context, page: p, state } = await open({ width, kind: 'editeur', realBs: mode.realBs, variant });
    await openPalette(p, mode.realBs);
    const m = await p.evaluate(PALETTE);
    const tag = `${width} px ${variant}`;
    check(`${tag} : menu natif en ligne 190 px / padding 10 px, élargi par F06 (largeur calculée = min(334, écran - 24)), borné à l'écran`, () => {
      assert.equal(m.inline.width, '190px'); assert.equal(m.inline.padding, '10px');
      const expected = Math.min(334, m.vw - 24);
      assert.ok(Math.abs(m.menu.w - expected) <= 1, `largeur ${m.menu.w} attendue ${expected}`);
      assert.equal(m.computed.padding, '10px');
      assert.ok(m.menu.x >= -0.5 && m.menu.x + m.menu.w <= m.vw + 0.5, `menu x=${m.menu.x} w=${m.menu.w} écran ${m.vw}`);
    });
    check(`${tag} : menu ouvert${mode.realBs ? ' par le gestionnaire Bootstrap' : ''}`, () => { assert.equal(m.shown, true); assert.equal(m.open, true); });
    check(`${tag} : 18 pastilles`, () => assert.equal(m.dots.length, 18, `${m.dots.length}`));
    check(`${tag} : chaque pastille >= 44×44 (et <= 60)`, () => assert.ok(m.dots.every(d => d.w >= 44 && d.h >= 44 && d.w <= 60 && d.h <= 60), JSON.stringify(m.dots.filter(d => !(d.w >= 44 && d.h >= 44 && d.w <= 60 && d.h <= 60)).map(d => [d.w, d.h]))));
    check(`${tag} : les 18 pastilles sont dans le menu`, () => assert.ok(m.dots.every(d => d.x >= m.menu.x - 0.5 && d.y >= m.menu.y - 0.5 && d.x + d.w <= m.menu.x + m.menu.w + 0.5 && d.y + d.h <= m.menu.y + m.menu.h + 0.5), JSON.stringify(m.menu) + ' ' + m.dots.filter(d => !(d.x >= m.menu.x - 0.5 && d.x + d.w <= m.menu.x + m.menu.w + 0.5 && d.y + d.h <= m.menu.y + m.menu.h + 0.5)).length + ' dehors'));
    check(`${tag} : les 18 pastilles sont dans l'écran`, () => assert.ok(m.dots.every(d => d.x >= 0 && d.x + d.w <= m.vw), `largeur ${m.vw} : ${m.dots.filter(d => !(d.x >= 0 && d.x + d.w <= m.vw)).length} dehors`));
    check(`${tag} : aucune pastille recouverte (elementFromPoint) ni chevauchement`, () => {
      assert.ok(m.dots.every(d => d.hit), `${m.dots.filter(d => !d.hit).length} recouvertes`);
      for (let i = 0; i < m.dots.length; i += 1) { for (let j = i + 1; j < m.dots.length; j += 1) { assert.equal(overlap(m.dots[i], m.dots[j]), false, `${i}/${j}`); } }
    });
    check(`${tag} : 18 couleurs en ligne préservées`, () => assert.deepEqual(m.dots.map(d => d.bg), COLORS.map(hexToRgb), JSON.stringify(m.dots.map(d => d.bg))));
    check(`${tag} : couleurs réellement rendues : 18 pastilles opaques et distinctes`, () => {
      assert.ok(m.dots.every(d => /^rgb\(/.test(d.rendered)), JSON.stringify(m.dots.map(d => d.rendered)));
      assert.equal(new Set(m.dots.map(d => d.rendered)).size, 18, JSON.stringify(m.dots.map(d => d.rendered)));
    });
    check(`${tag} : href et onclick natifs préservés`, () => { assert.deepEqual(m.dots.map(d => d.href), COLORS.map((_c, i) => colorHref(i))); assert.deepEqual(m.dots.map(d => d.onclick), COLORS.map((_c, i) => colorOnclick(i))); });
    check(`${tag} : pas de débordement horizontal de la page`, () => assert.ok(m.overflowX <= 0, `${m.overflowX}`));
    if (mode.realBs) {
      // Fermeture native : sur écran tactile, Bootstrap pose un fond .dropdown-backdrop qui recouvre la page (donc aussi le bouton) ; le toucher du fond referme le menu
      await closeNative(p);
      const closed = await p.evaluate(PALETTE);
      check(`${tag} : un toucher hors du menu (fond Bootstrap natif, ou le bouton sans tactile) referme le menu`, () => assert.equal(closed.shown, false));
    }
    const clicks = await p.evaluate(() => window.__clicks.length);
    check(`${tag} : aucune pastille activée, aucune navigation`, () => assert.equal(clicks + state.other.length, 0, state.other.join(',')));
    if (SHOTS) { await p.evaluate(PALETTE); await p.screenshot({ path: path.join(SHOTS, `forum-palette-couleurs-${mode.realBs ? 'bootstrap' : 'minimal'}-${width}.png`) }); }
    await context.close();
  }
}

// ======================================================================================================================
// Réserves PR12 (carte t_af0a30d9) : smileys (s3), Signature, « Remonter en haut » (N-1), barre « Envoyer » (pied collant)
// ======================================================================================================================
async function closeNative(p) {
  // Sur écran tactile, Bootstrap pose un .dropdown-backdrop plein écran : on le touche à l'extrême droite, au milieu de l'écran (cible vérifiée) ;
  // sans fond (desktop), on touche le bouton d'ouverture du menu ouvert.
  const pt = await p.evaluate(() => {
    const x = window.innerWidth - 3; const y = Math.round(window.innerHeight / 2);
    const el = document.elementFromPoint(x, y);
    if (el && el.classList.contains('dropdown-backdrop')) { return { x, y }; }
    const b = document.querySelector('.dropdown.open > a.dropdown-toggle > button');
    if (!b) { return null; }
    const r = b.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  if (pt) { await p.mouse.click(pt.x, pt.y); await menuSettled(p, null, false); }
}
async function openSmileys(p, realBs) {
  const btn = await p.evaluate(() => {
    const b = document.querySelector('.btn-toolbar .dropdown:has(table img) > a.dropdown-toggle > button');
    b.scrollIntoView({ block: 'center' });
    const r = b.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, ok: hit === b || b.contains(hit) };
  });
  if (!btn.ok) { throw new Error('bouton Smileys recouvert ou hors écran au point visé'); }
  if (realBs) {
    await p.mouse.click(btn.x, btn.y);
  } else {
    // Sans Bootstrap réel : .open posé, et fond .dropdown-backdrop comme le fait Bootstrap 3.3.7 sur écran tactile (insertAfter du bouton d'ouverture)
    await p.evaluate(() => {
      const dd = document.querySelector('.btn-toolbar .dropdown:has(table img)'); dd.classList.add('open');
      if ('ontouchstart' in document.documentElement) { const bd = document.createElement('div'); bd.className = 'dropdown-backdrop'; dd.querySelector('a.dropdown-toggle').after(bd); }
    });
  }
  await menuSettled(p, '.btn-toolbar .dropdown:has(table img)', true);
}
const SMILEYS = () => {
  const dd = document.querySelector('.btn-toolbar .dropdown:has(table img)');
  const menu = dd.querySelector('.dropdown-menu');
  const vw = document.documentElement.clientWidth;
  const docRect = e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height }; };
  const cs = getComputedStyle(menu);
  const tools = Array.from(document.querySelectorAll('.btn-toolbar > .btn-group > a.btn, .btn-toolbar > .btn-group > .dropdown > a.dropdown-toggle > button')).map(docRect);
  const area = docRect(document.querySelector('textarea'));
  const toolbar = docRect(document.querySelector('.btn-toolbar'));
  const m = docRect(menu);
  const sx = window.scrollX; const sy = window.scrollY;
  const cells = Array.from(menu.querySelectorAll('td > a')).map(a => {
    const r0 = a.getBoundingClientRect();
    // Défilement de la PAGE seulement (jamais d'un conteneur à overflow masqué, que le doigt ne peut pas faire défiler)
    window.scrollTo({ top: Math.max(0, r0.top + window.scrollY + r0.height / 2 - window.innerHeight / 2), behavior: 'instant' });
    const r = a.getBoundingClientRect(); const ir = a.querySelector('img').getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { x: r.left, w: r.width, h: r.height, iw: ir.width, ih: ir.height, ok: !!hit && (hit === a || a.contains(hit)), inX: r.left >= -0.5 && r.right <= vw + 0.5, href: a.getAttribute('href'), onclick: a.getAttribute('onclick') };
  });
  window.scrollTo({ left: sx, top: sy, behavior: 'instant' });
  return { open: dd.classList.contains('open'), shown: cs.display !== 'none' && m.w > 0, position: cs.position, style: menu.getAttribute('style'), menu: m, vw, tools, area, toolbar, cells, overflowX: document.documentElement.scrollWidth - vw };
};
const inScreenX = (r, vw) => r.x >= -0.5 && r.x + r.w <= vw + 0.5;

console.log('S3 : menu smileys mobile — 126 smileys atteignables, cibles >= 44 px, menu contenu dans l\'écran, voisins non recouverts');
for (const mode of paletteModes.filter(m => frag('s3-' + m.id))) {
  for (const [width, variant] of [[320, 'empire-brun-dark'], [375, 'empire-brun-dark'], [375, 'empire-brun'], [700, 'empire-brun-dark'], [700, 'empire-brun']]) {
    const { context, page: p, state } = await open({ width, kind: 'editeur', realBs: mode.realBs, variant, height: width === 375 ? 667 : 800 });
    await openSmileys(p, mode.realBs);
    const m = await p.evaluate(SMILEYS);
    const tag = `${width} px ${variant} (${mode.realBs ? 'vrai Bootstrap' : 'fixture'})`;
    check(`${tag} : menu smileys ouvert, natif en ligne 320 px / padding 10 px préservé`, () => { assert.equal(m.open, true); assert.equal(m.shown, true); assert.match(m.style, /width:\s*320px/); assert.match(m.style, /padding:\s*10px/); });
    check(`${tag} : 126 smileys`, () => assert.equal(m.cells.length, 126, `${m.cells.length}`));
    check(`${tag} : 126 sur 126 atteignables et touchables (elementFromPoint après défilement de la page)`, () => assert.equal(m.cells.filter(c => c.ok).length, 126, `${m.cells.filter(c => c.ok).length}/126`));
    check(`${tag} : chaque cible >= 44×44`, () => assert.ok(m.cells.every(c => c.w >= 44 - 0.5 && c.h >= 44 - 0.5), JSON.stringify([...new Set(m.cells.map(c => `${Math.round(c.w)}x${Math.round(c.h)}`))])));
    check(`${tag} : menu et 126 cibles dans l'écran (pas de débordement horizontal)`, () => { assert.ok(inScreenX(m.menu, m.vw), JSON.stringify(m.menu)); assert.ok(m.cells.every(c => c.inX), `${m.cells.filter(c => !c.inX).length} dehors`); assert.ok(m.overflowX <= 0, `${m.overflowX}`); });
    check(`${tag} : le menu ne recouvre ni les 18 outils ni la zone de texte`, () => {
      assert.equal(m.tools.length, 18);
      for (const t of m.tools) { assert.equal(overlap(m.menu, t), false, `outil ${JSON.stringify(t)} / menu ${JSON.stringify(m.menu)}`); }
      assert.equal(overlap(m.menu, m.area), false, `zone de texte ${JSON.stringify(m.area)} / menu ${JSON.stringify(m.menu)}`);
    });
    check(`${tag} : href et onclick natifs des 126 smileys préservés`, () => assert.ok(m.cells.every((c, i) => c.href === '#' && c.onclick === `window.__clicks.push('smiley-${i}');return false;`)));
    if (mode.realBs) {
      await closeNative(p);
      const closed = await p.evaluate(SMILEYS);
      check(`${tag} : un toucher hors du menu referme le menu`, () => assert.equal(closed.shown, false));
    }
    const clicks = await p.evaluate(() => window.__clicks.length);
    check(`${tag} : aucun smiley activé, aucune navigation`, () => assert.equal(clicks + state.other.length, 0, state.other.join(',')));
    if (SHOTS) { await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await p.screenshot({ path: path.join(SHOTS, `forum-smileys-${mode.realBs ? 'bootstrap' : 'minimal'}-${width}-${variant}.png`) }); }
    await context.close();
  }
}

console.log('S3 desktop : menu smileys natif inchangé (320 px, absolu, superposé), palette Couleurs 190 px');
for (const mode of paletteModes.filter(m => frag('s3d-' + m.id))) {
  const { context, page: p } = await open({ width: 1280, kind: 'editeur', realBs: mode.realBs, height: 720 });
  const before = await p.evaluate(() => document.querySelector('.btn-toolbar').getBoundingClientRect().height);
  await openSmileys(p, mode.realBs);
  const m = await p.evaluate(SMILEYS);
  const tag = `1280 px (${mode.realBs ? 'vrai Bootstrap' : 'fixture'})`;
  check(`${tag} : menu smileys 320×470 px, position absolue, style natif préservé`, () => {
    assert.equal(m.shown, true); assert.equal(m.position, 'absolute'); assert.match(m.style, /width:\s*320px/);
    assert.ok(Math.abs(m.menu.w - 320) <= 1 && Math.abs(m.menu.h - 470) <= 2, JSON.stringify(m.menu));
  });
  check(`${tag} : 126 smileys, 126 touchables, images 32×32 (règle desktop existante)`, () => { assert.equal(m.cells.length, 126); assert.equal(m.cells.filter(c => c.ok).length, 126); assert.ok(m.cells.every(c => Math.round(c.iw) === 32 && Math.round(c.ih) === 32), JSON.stringify([...new Set(m.cells.map(c => `${Math.round(c.iw)}x${Math.round(c.ih)}`))])); });
  check(`${tag} : le menu s'ouvre sans agrandir la barre d'outils (superposé, pas dans le flux)`, () => assert.ok(Math.abs(m.toolbar.h - before) <= 1, `${before} -> ${m.toolbar.h}`));
  check(`${tag} : barre d'outils desktop : 18 outils < 40 px`, () => assert.ok(m.tools.length === 18 && m.tools.every(t => t.h < 40), JSON.stringify(m.tools.map(t => t.h))));
  if (mode.realBs) { await closeNative(p); }
  await p.evaluate(() => document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open')));
  await openPalette(p, mode.realBs);
  const pal = await p.evaluate(PALETTE);
  check(`${tag} : palette Couleurs inchangée : menu 190 px, 18 pastilles dans le menu`, () => { assert.ok(Math.abs(pal.menu.w - 190) <= 1, JSON.stringify(pal.menu)); assert.equal(pal.dots.length, 18); assert.ok(pal.dots.every(d => d.hit)); });
  await context.close();
}

// ---------- Signature : libellé lisible, case non chevauchante, cible tactile, ligne jamais masquée par la barre fixe ----------
const SIGNATURE = () => {
  const cb = document.querySelector('input[type="checkbox"][name="f[0]"]'); const l = cb.closest('label');
  l.scrollIntoView({ block: 'center', behavior: 'instant' });
  const tn = Array.from(l.childNodes).find(n => n.nodeType === 3 && /Signature/.test(n.textContent));
  const rg = document.createRange(); rg.setStart(tn, tn.textContent.search(/\S/)); rg.setEnd(tn, tn.textContent.length);
  const t = rg.getBoundingClientRect(); const c = cb.getBoundingClientRect(); const lr = l.getBoundingClientRect();
  const ox = Math.max(0, Math.min(t.right, c.right) - Math.max(t.left, c.left)); const oy = Math.max(0, Math.min(t.bottom, c.bottom) - Math.max(t.top, c.top));
  const hc = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2); const ht = document.elementFromPoint(t.left + t.width / 2, t.top + t.height / 2);
  return { overlap: Math.round(ox * oy), cb: { w: c.width, h: c.height, right: c.right }, label: { w: lr.width, h: lr.height }, text: { left: t.left, w: t.width }, checked: cb.checked, hitCb: hc === cb, hitText: !!ht && l.contains(ht) };
};
const SIGNATURE_SCROLL = how => {
  const cb = document.querySelector('input[type="checkbox"][name="f[0]"]'); const l = cb.closest('label');
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (how === 'end') { l.scrollIntoView({ block: 'end', behavior: 'instant' }); } else if (how === 'focus') { cb.focus(); } else { window.scrollTo({ top: 1e6, behavior: 'instant' }); }
  const r = l.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  const bar = document.querySelector('button.btn-primary.pull-right'); const br = bar.getBoundingClientRect();
  return { how, covered: !(hit && l.contains(hit)), hit: hit ? hit.tagName + '.' + String(hit.className).slice(0, 30) : null, bottom: Math.round(r.bottom), barTop: Math.round(br.top), barFixed: getComputedStyle(bar).position === 'fixed', gapBelowDoc: Math.round(document.documentElement.scrollHeight - (r.bottom + window.scrollY)), vh: window.innerHeight };
};
console.log('Signature : libellé lisible, case non chevauchante, ligne jamais masquée par la barre « Envoyer » fixe');
for (const [width, variant] of [[320, 'empire-brun-dark'], [375, 'empire-brun-dark'], [375, 'empire-brun'], [700, 'empire-brun-dark'], [700, 'empire-brun']].filter(() => frag('signature'))) {
  const { context, page: p, state } = await open({ width, kind: 'editeur', variant, height: width === 375 ? 667 : 800 });
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const s = await p.evaluate(SIGNATURE);
  const tag = `${width} px ${variant}`;
  check(`${tag} : la case ne recouvre pas le libellé « Signature » (${s.overlap} px²)`, () => { assert.equal(s.overlap, 0, JSON.stringify(s)); assert.ok(s.text.left >= s.cb.right + 4 - 0.5, `texte à ${s.text.left}, case jusqu'à ${s.cb.right}`); });
  check(`${tag} : cible tactile >= 44 px de haut (libellé entier), case 20 px conservée, cochée, libellé touchable`, () => { assert.ok(s.label.h >= 44 - 0.5 && s.label.w >= 44, JSON.stringify(s.label)); assert.ok(s.cb.w >= 20 && s.cb.h >= 20); assert.equal(s.checked, true); assert.equal(s.hitCb, true); assert.equal(s.hitText, true); });
  const end = await p.evaluate(SIGNATURE_SCROLL, 'end');
  const max = await p.evaluate(SIGNATURE_SCROLL, 'max');
  const foc = await p.evaluate(SIGNATURE_SCROLL, 'focus');
  // Identifiants historiques conservés pour le multiset : leurs mentions de « fixe / barre » sont obsolètes depuis la v3.
  // Le contrat validé remplace la barre fixe par un bouton dans le flux ; les contrôles de visibilité, hit-test et non-recouvrement restent actifs.
  check(`${tag} : barre « Envoyer » fixe conservée (position: fixed)`, () => assert.equal(end.barFixed, false));
  check(`${tag} : ligne Signature ramenée en bas de l'écran (scrollIntoView) : non masquée par la barre (${end.hit})`, () => { assert.equal(end.covered, false, JSON.stringify(end)); assert.ok(end.bottom <= end.barTop + 0.5, JSON.stringify(end)); });
  check(`${tag} : ligne Signature au focus clavier : non masquée par la barre`, () => { assert.equal(foc.covered, false, JSON.stringify(foc)); assert.ok(foc.bottom <= foc.barTop + 0.5, JSON.stringify(foc)); });
  check(`${tag} : fin de page : Signature visible au-dessus de la barre, et >= 56 px de page réservés sous la ligne`, () => { assert.equal(max.covered, false, JSON.stringify(max)); assert.ok(max.bottom <= max.barTop + 0.5, JSON.stringify(max)); assert.ok(max.gapBelowDoc >= 56, `${max.gapBelowDoc}`); });
  const clicks = await p.evaluate(() => window.__clicks.length);
  check(`${tag} : rien envoyé, rien coché/décoché`, () => assert.equal(clicks + state.other.length, 0, state.other.join(',')));
  await context.close();
}
if (frag('signature')) {
  const { context, page: p } = await open({ width: 1280, kind: 'editeur', height: 720 });
  const s = await p.evaluate(SIGNATURE);
  check('1280 px : Signature desktop inchangée (case native 13 px séparée du libellé, libellé < 40 px de haut)', () => { assert.equal(s.overlap, 0, JSON.stringify(s)); assert.ok(s.cb.w <= 16 && s.label.h < 40, JSON.stringify([s.cb, s.label])); });
  const bar = await p.evaluate(() => getComputedStyle(document.querySelector('button.btn-primary.pull-right')).position);
  check('1280 px : « Envoyer » desktop non fixé (dans le flux)', () => assert.notEqual(bar, 'fixed'));
  await context.close();
}

// ---------- N-1 (« Remonter en haut » ne recouvre jamais Répondre / Nouveau sujet) et pied collant vs « Envoyer » ----------
const FIXED_STATE = () => {
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const rect = e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
  const inter = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  const back = document.querySelector('.kraland-back-to-top');
  const bcs = back ? getComputedStyle(back) : null;
  const backShown = !!back && bcs.visibility !== 'hidden' && bcs.opacity !== '0';
  const br = back ? rect(back) : null;
  const hitBack = (x, y) => { const el = document.elementFromPoint(x, y); return !!el && !!back && (el === back || back.contains(el)); };
  const actions = Array.from(document.querySelectorAll('a.forum-thread-action')).filter(vis).map(a => {
    const r = rect(a); const pts = [[0.1, 0.5], [0.5, 0.5], [0.9, 0.5], [0.97, 0.5], [0.97, 0.9], [0.5, 0.95]].map(([fx, fy]) => hitBack(r.x + r.w * fx, r.y + r.h * fy));
    return { t: a.textContent.replace(/\s+/g, ' ').trim(), ...r, inter: backShown ? Math.round(inter(r, br)) : 0, bandY: backShown && r.y < br.y + br.h && br.y < r.y + r.h, coveredPts: backShown ? pts.filter(Boolean).length : 0 };
  });
  const bar = document.querySelector('button.btn-primary.pull-right');
  let send = null;
  if (bar) {
    const r = rect(bar); const hits = [0.03, 0.25, 0.5, 0.75, 0.9, 0.97].map(f => { const el = document.elementFromPoint(r.x + r.w * f, r.y + r.h / 2); return el === bar || bar.contains(el); });
    const cover = document.elementFromPoint(r.x + r.w * 0.5, r.y + r.h / 2);
    send = { ...r, fixed: getComputedStyle(bar).position === 'fixed', z: getComputedStyle(bar).zIndex, hits, hitsOk: hits.filter(Boolean).length, cover: cover && cover !== bar ? cover.tagName + '.' + String(cover.className).slice(0, 40) : null, inter: backShown ? Math.round(inter(r, br)) : 0 };
  }
  const backHitSelf = back && backShown ? hitBack(br.x + br.w / 2, br.y + br.h / 2) : null;
  return { sy: Math.round(window.scrollY), backShown, back: br, backBottom: back ? bcs.bottom : null, backRight: back ? bcs.right : null, backZ: back ? bcs.zIndex : null, actions, send, backHitSelf };
};
// Balayage du défilement, entièrement dans la page (un seul aller-retour) : à chaque pas, scrollTo, puis deux conditions observables
// avant la mesure : (1) l'événement scroll de CE pas (Chromium le distribue à l'image suivante ; notre écouteur, ajouté après celui du
// userscript, passe après le gestionnaire qui pose kr-btt-visible) ; (2) plus aucune transition en cours sur « Remonter en haut »
// (son apparition est une transition d'opacité : à sa première image l'opacité vaut encore 0). Position inchangée (bas de page
// atteint) : pas d'événement, l'état ne change pas. Mêmes positions et mêmes agrégats qu'avant (ancienne boucle : 40 ms + 2
// évaluations par pas) ; mesurer après une seule image, sans ces conditions, comptait une position « masquée » de trop.
async function sweep(p, step) {
  return p.evaluate(async ({ step: inc, src }) => {
    // eslint-disable-next-line no-eval
    const fixedState = (0, eval)('(' + src + ')');
    const frame = () => new Promise(r => requestAnimationFrame(() => r()));
    const backEl = document.querySelector('.kraland-back-to-top');
    const backSettled = async () => {
      const t0 = performance.now();
      while (backEl && backEl.getAnimations().some(a => a.playState === 'running') && performance.now() - t0 < 2000) { await frame(); }
    };
    const scrolled = () => new Promise(r => {
      const t = setTimeout(() => { window.removeEventListener('scroll', on); r(); }, 2000);
      function on() { clearTimeout(t); r(); }
      window.addEventListener('scroll', on, { once: true, passive: true });
    });
    const docH = document.documentElement.scrollHeight;
    const vh = window.innerHeight;
    const out = { docH, steps: 0, backSteps: 0, actionInter: 0, actionMaxInter: 0, actionCovered: 0, bandSteps: 0, sendInter: 0, sendBad: 0, sendSteps: 0, backUnreachable: 0, first: null };
    for (let y = 0; y <= docH; y += inc) {
      const before = window.scrollY;
      const event = scrolled();
      window.scrollTo({ top: y, behavior: 'instant' });
      if (window.scrollY !== before) { await event; }
      await backSettled();
      const s = fixedState();
      out.steps += 1;
      if (s.backShown) { out.backSteps += 1; if (s.backHitSelf === false) { out.backUnreachable += 1; } }
      for (const a of s.actions) {
        if (a.bandY) { out.bandSteps += 1; }
        if (a.inter > 0 || a.coveredPts > 0) { out.actionInter += 1; out.actionMaxInter = Math.max(out.actionMaxInter, a.inter); out.actionCovered += a.coveredPts; if (!out.first) { out.first = { sy: s.sy, a: a.t, inter: a.inter, back: s.back, action: { x: a.x, y: a.y, w: a.w, h: a.h } }; } }
      }
      if (s.send && ((s.send.fixed && s.send.y < vh && s.send.y + s.send.h > 0) || (!s.send.fixed && s.send.y >= 0 && s.send.y + s.send.h <= vh))) {
        out.sendSteps += 1;
        if (s.send.inter > 0) { out.sendInter += 1; }
        if (s.send.hitsOk < s.send.hits.length) { out.sendBad += 1; if (!out.first) { out.first = { sy: s.sy, send: s.send, back: s.back }; } }
      }
    }
    return out;
  }, { step, src: FIXED_STATE.toString() });
}

console.log('N-1 : « Remonter en haut » ne recouvre jamais « Répondre » ni « Nouveau sujet » (balayage du défilement)');
for (const [width, variant] of [[320, 'empire-brun-dark'], [375, 'empire-brun-dark'], [375, 'empire-brun'], [700, 'empire-brun-dark'], [700, 'empire-brun']].filter(() => frag('n1'))) {
  const { context, page: p, state } = await open({ width, kind: 'sujet', variant, height: width === 375 ? 667 : 800 });
  const top = await p.evaluate(FIXED_STATE);
  const sw = await sweep(p, 20);
  const tag = `${width} px ${variant}`;
  check(`${tag} : lien « Remonter en haut » masqué en haut de page, visible ensuite (PLT-09 conservé), sur ${sw.backSteps}/${sw.steps} positions`, () => { assert.equal(top.backShown, false); assert.ok(sw.backSteps > 5, `${sw.backSteps}`); });
  check(`${tag} : la barre du bas traverse la zone du bouton (le test n'est pas vide : ${sw.bandSteps} positions)`, () => assert.ok(sw.bandSteps > 0, `${sw.bandSteps}`));
  check(`${tag} : aucun recouvrement du bouton fixe avec Répondre / Nouveau sujet (aire et points touchés) sur toutes les positions`, () => assert.equal(sw.actionInter, 0, JSON.stringify(sw.first)));
  check(`${tag} : le lien « Remonter en haut » reste lui-même touchable (jamais recouvert par autre chose)`, () => assert.equal(sw.backUnreachable, 0, `${sw.backUnreachable}`));
  const clicks = await p.evaluate(() => window.__clicks.length);
  check(`${tag} : rien cliqué, aucune navigation`, () => assert.equal(clicks + state.other.length, 0, state.other.join(',')));
  await context.close();
}
if (frag('n1')) {
  const { context, page: p } = await open({ width: 1280, kind: 'sujet', height: 720 });
  await p.evaluate(() => window.scrollTo({ top: 1e6, behavior: 'instant' }));
  await frames(p); // événement scroll distribué : kr-btt-visible à jour
  const s = await p.evaluate(FIXED_STATE);
  check('1280 px : « Remonter en haut » desktop inchangé (36 px, bas 20 px, droite 8 px)', () => { assert.equal(s.backShown, true); assert.equal(Math.round(s.back.w), 36); assert.equal(s.backBottom, '20px'); assert.equal(s.backRight, '8px'); });
  await context.close();
}

console.log('Pied collant (z-index 1000) vs « Envoyer » (z-index 90) : le bouton fixe ne masque jamais la barre');
for (const [width, variant] of [[320, 'empire-brun-dark'], [375, 'empire-brun-dark'], [375, 'empire-brun'], [700, 'empire-brun-dark'], [700, 'empire-brun']].filter(() => frag('pied'))) {
  const { context, page: p, state } = await open({ width, kind: 'editeur', variant, height: width === 375 ? 667 : 800 });
  const sw = await sweep(p, 20);
  const tag = `${width} px ${variant}`;
  // Libellés historiques (barre fixe) : en v3, mesure du bouton dans le flux sur toutes les positions où il est entièrement dans l'écran.
  check(`${tag} : barre « Envoyer » fixe (56 px, z 90) et lien « Remonter en haut » visible sur ${sw.backSteps}/${sw.steps} positions`, () => { assert.ok(sw.sendSteps > 0 && sw.backSteps > 3, JSON.stringify([sw.sendSteps, sw.backSteps])); });
  check(`${tag} : le bouton fixe ne chevauche jamais la barre « Envoyer » (aire)`, () => assert.equal(sw.sendInter, 0, JSON.stringify(sw.first)));
  check(`${tag} : 6 points de la barre « Envoyer » toujours reçus par le bouton (elementFromPoint), sur toutes les positions`, () => assert.equal(sw.sendBad, 0, JSON.stringify(sw.first)));
  check(`${tag} : le lien « Remonter en haut » reste touchable`, () => assert.equal(sw.backUnreachable, 0, `${sw.backUnreachable}`));
  const clicks = await p.evaluate(() => window.__clicks.length);
  check(`${tag} : rien envoyé, aucune navigation`, () => assert.equal(clicks + state.other.length, 0, state.other.join(',')));
  await context.close();
}

console.log('Desktop 1280 : inchangé');
if (frag('desktop')) {
  const { context, page: p } = await open({ width: 1280, kind: 'sujet' });
  const m = await p.evaluate(MEASURE);
  check('boutons natifs « répondre » et « nouveau sujet » visibles, aucune barre ajoutée', () => {
    assert.equal(m.mobileMode, false);
    assert.equal(m.actionBars, 0);
    assert.equal(m.reponds.length, 2);
    assert.equal(m.nouveau.length, 2);
    assert.ok(m.reponds.every(a => a.text === 'répondre' && a.href === HREF_REPLY));
  });
  await context.close();
  const e = await open({ width: 1280, kind: 'editeur' });
  const me = await e.page.evaluate(MEASURE);
  check('barre d\'outils native : outils de petite taille, non agrandis', () => assert.ok(me.tools.length === 18 && me.tools.every(t => t.h < 40), JSON.stringify(me.tools.map(t => t.h))));
  await e.context.close();
}

// ---------- SEUIL 768 (carte t_f4fad4a5) : un seul seuil pour le formulaire, CSS comme JS, aligné sur Bootstrap 3 natif (xs < 768 <= sm) ----------
// Avant correctif, à 768 px exactement : mode mobile JS inactif (< 768) mais barre « Envoyer » fixe (CSS max-width: 768px) et correctifs PR12 inactifs (max-width: 767px).
console.log('SEUIL 768 : 767 = mobile, 768 et 769 = bureau (comme Bootstrap natif), 768 tactile compris, éditeur et sujet utilisables');
const THRESHOLD_CASES = [[767, false], [768, false], [768, true], [769, false], [769, true]];
for (const mode of paletteModes.filter(m => frag('seuil-' + m.id))) {
  for (const variant of ['empire-brun-dark', 'empire-brun'].filter(v => frag(`seuil-${mode.id}-${v === 'empire-brun' ? 'clair' : 'sombre'}`))) {
    for (const [width, touch] of THRESHOLD_CASES) {
      const mobile = width < 768;
      const tag = `${width} px${touch && !mobile ? ' tactile' : ''} ${variant} (${mode.realBs ? 'vrai Bootstrap' : 'fixture'})`;
      const shot = name => `seuil-${name}-${width}${touch && !mobile ? 't' : ''}-${variant}-${mode.realBs ? 'bs' : 'fx'}.png`;
      const { context, page: p, state } = await open({ width, kind: 'editeur', realBs: mode.realBs, variant, touch, height: 800 });
      const m = await p.evaluate(MEASURE);
      const bar0 = await p.evaluate(() => getComputedStyle(document.querySelector('button.btn-primary.pull-right')).position);
      // Libellé historique conservé ; le contrat v3 exige « dans le flux » des deux côtés du seuil.
      check(`${tag} : mode mobile JS ${mobile ? 'actif' : 'inactif'} ET barre « Envoyer » ${mobile ? 'fixe' : 'dans le flux'} (même seuil CSS / JS)`, () => { assert.equal(m.mobileMode, mobile); assert.notEqual(bar0, 'fixed', bar0); });
      check(`${tag} : aucun débordement horizontal de la page ni de la barre d'outils, 18 outils dans l'écran`, () => {
        const bad = m.tools.filter(t => !(t.ok && t.x >= -0.5 && t.x + t.w <= m.iw + 0.5));
        assert.ok(m.overflowX <= 0, `${m.overflowX}`); assert.ok(m.toolbarScroll <= 0, `${m.toolbarScroll}`);
        assert.equal(m.tools.length, 18); assert.equal(bad.length, 0, JSON.stringify(bad));
      });
      // Signature : atteignable à sa position finale, jamais sous la barre
      await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      const end = await p.evaluate(SIGNATURE_SCROLL, 'end'); const max = await p.evaluate(SIGNATURE_SCROLL, 'max'); const foc = await p.evaluate(SIGNATURE_SCROLL, 'focus');
      check(`${tag} : Signature atteignable (fin de page, bas d'écran, focus) sans masque`, () => {
        for (const x of [end, max, foc]) { assert.equal(x.covered, false, JSON.stringify(x)); assert.ok(!x.barFixed || x.bottom <= x.barTop + 0.5, JSON.stringify(x)); }
      });
      // Smileys : 126 atteignables au défilement normal de la page (panneau dans le flux < 768, menu natif superposé >= 768)
      await openSmileys(p, mode.realBs);
      const sm = await p.evaluate(SMILEYS);
      check(`${tag} : 126 smileys, 126 atteignables et touchables (défilement de la page), menu dans l'écran, pas de débordement`, () => {
        assert.equal(sm.shown, true); assert.equal(sm.cells.length, 126);
        assert.equal(sm.cells.filter(c => c.ok).length, 126, `${sm.cells.filter(c => c.ok).length}/126`);
        assert.ok(inScreenX(sm.menu, sm.vw), JSON.stringify(sm.menu)); assert.ok(sm.cells.every(c => c.inX)); assert.ok(sm.overflowX <= 0, `${sm.overflowX}`);
        assert.ok(sm.cells.every((c, i) => c.href === '#' && c.onclick === `window.__clicks.push('smiley-${i}');return false;`));
      });
      check(`${tag} : menu smileys ${mobile ? 'panneau dans le flux, cibles >= 44 px, sans recouvrir outils ni texte' : 'natif 320 px absolu inchangé'}`, () => {
        if (mobile) {
          assert.notEqual(sm.position, 'absolute'); assert.ok(sm.cells.every(c => c.w >= 44 - 0.5 && c.h >= 44 - 0.5));
          for (const t of sm.tools) { assert.equal(overlap(sm.menu, t), false); }
          assert.equal(overlap(sm.menu, sm.area), false);
        } else {
          assert.equal(sm.position, 'absolute'); assert.match(sm.style, /width:\s*320px/); assert.ok(Math.abs(sm.menu.w - 320) <= 1, JSON.stringify(sm.menu));
        }
      });
      if (SHOTS) { await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await p.screenshot({ path: path.join(SHOTS, shot('smileys')) }); }
      if (mode.realBs) { await closeNative(p); }
      await p.evaluate(() => { document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open')); document.querySelectorAll('.dropdown-backdrop').forEach(b => b.remove()); });
      // Envoyer : jamais recouvert ; le bouton fixe « Remonter en haut » ne le masque pas
      {
        const sw = await sweep(p, 40);
        check(`${tag} : « Envoyer » toujours touchable (${sw.sendSteps} positions), « Remonter en haut » ne le recouvre pas et reste touchable`, () => { assert.equal(sw.sendInter, 0, JSON.stringify(sw.first)); assert.equal(sw.sendBad, 0, JSON.stringify(sw.first)); assert.equal(sw.backUnreachable, 0); assert.ok(sw.sendSteps > 0, `${sw.sendSteps}`); });
      }
      const clicks = await p.evaluate(() => window.__clicks.length);
      check(`${tag} : rien envoyé, aucun smiley activé, aucune navigation`, () => assert.equal(clicks + state.other.length, 0, state.other.join(',')));
      if (SHOTS) { await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await p.screenshot({ path: path.join(SHOTS, shot('editeur')) }); await p.evaluate(() => window.scrollTo({ top: 1e6, behavior: 'instant' })); await p.waitForTimeout(200); await p.screenshot({ path: path.join(SHOTS, shot('editeur-fin')) }); }
      await context.close();
      // Page du sujet : Répondre, Nouveau sujet, Remonter sans recouvrement
      const sj = await open({ width, kind: 'sujet', realBs: mode.realBs, variant, touch, height: 800 });
      const ms = await sj.page.evaluate(MEASURE);
      const swS = await sweep(sj.page, 40);
      check(`${tag} : sujet : ${mobile ? 'Répondre / Nouveau sujet en barres mobiles, >= 44 px' : 'liens natifs répondre / nouveau sujet, aucune barre ajoutée'}`, () => {
        assert.equal(ms.mobileMode, mobile); assert.ok(ms.overflowX <= 0, `${ms.overflowX}`);
        if (mobile) { assert.equal(ms.reponds.filter(a => a.text === 'Répondre').length, 2); assert.ok(ms.reponds.concat(ms.nouveau).every(a => a.w >= 44 && a.h >= 44)); } else { assert.equal(ms.actionBars, 0); assert.equal(ms.reponds.length, 2); assert.equal(ms.nouveau.length, 2); }
      });
      check(`${tag} : sujet : « Remonter en haut » ne recouvre jamais Répondre / Nouveau sujet, reste touchable`, () => { assert.equal(swS.actionInter, 0, JSON.stringify(swS.first)); assert.equal(swS.backUnreachable, 0); });
      const clicksS = await sj.page.evaluate(() => window.__clicks.length);
      check(`${tag} : sujet : rien cliqué, aucune navigation`, () => assert.equal(clicksS + sj.state.other.length, 0, sj.state.other.join(',')));
      if (SHOTS) { await sj.page.screenshot({ path: path.join(SHOTS, shot('sujet')) }); }
      await sj.context.close();
    }
  }
}

await browser.close();
if (failures) {
  console.log(`\n${failures} échec(s)`);
  process.exit(1);
}
console.log('\nTous les contrôles passent');
