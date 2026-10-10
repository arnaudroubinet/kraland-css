// Test forum mobile : « Répondre » en haut et en bas du sujet (F-01) et barre BBCode utilisable au doigt (F-06).
// Pages = FIXTURES inertes reprenant la structure RÉELLE capturée (forum-top, h1, barre d'outils) ; aucun réseau Kraland,
// aucun clic sur une action : les navigations sont interceptées et comptées (attendu : 0).
// Émulation mobile Chromium, pas un vrai téléphone.
//
// Usage : npm run build && npm run test:forum-mobile
// Option : KR_SCRIPT=/chemin/script.user.js pour tester un autre fichier (défaut : bundle principal).
// Option : KR_SHOTS=/dossier pour enregistrer des captures de fixtures.
// Option : KR_BOOTSTRAP_DIR=/dossier contenant bootstrap.min.css, bootstrap.min.js et jquery.min.js (copies des fichiers publics du site :
//   lib/bootstrap-3.3.7 et lib/jquery-3.3.1) : active en plus la passe « vrai Bootstrap » de la palette Couleurs (menu ouvert par le vrai
//   gestionnaire data-toggle="dropdown"). Sans cette option, le menu est ouvert en posant la classe .open et la passe est signalée « non jouée ».
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { chromium } from 'playwright';

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
  .dropdown { position: relative; } .dropdown-menu { position: absolute; top: 100%; left: 0; z-index: 1000; display: none; float: left; min-width: 160px; background: #fff; }
  .pull-right { float: right !important; } .container { padding: 0 15px; }
  .form-group { margin-bottom: 15px; } .form-control { display: block; width: 100%; height: 34px; padding: 6px 12px; }
  .col-sm-10, .col-sm-2, .col-md-9 { position: relative; min-height: 1px; padding: 0 15px; }
  .pagination { display: inline-block; padding-left: 0; margin: 20px 0; list-style: none; } .pagination > li { display: inline; } .pagination > li > a { float: left; padding: 6px 12px; border: 1px solid #ddd; }
  .center { text-align: center; } .fa { font-style: normal; } .navbar { min-height: 50px; } .collapse:not(.in) { display: none; }
  .open > .dropdown-menu { display: block; }
  @media (min-width: 768px) { .col-sm-10 { float: left; width: 83.33%; } .col-sm-2 { float: left; width: 16.66%; } .col-md-9 { width: 75%; } }
`;
const BS_DIR = process.env.KR_BOOTSTRAP_DIR || '';
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
function toolHtml(t) {
  if (t === 'PREV') { return '<a href="" onclick="window.__clicks.push(\'prev\');return false;" title="Prévisualisation" class="btn btn-default"><i class="fa">P</i></a>'; }
  if (typeof t === 'string') {
    const menu = t === 'DROP-couleurs' ? `<div class="btn-group btn-group-xs" role="group">${COLORS.map((c, i) => `<a href="${colorHref(i)}"${colorOnclick(i) ? ` onclick="${colorOnclick(i)}"` : ''} class="btn btn-default" style="background:none;background-color:${c}" title="[color${i}]x[/color${i}]">&nbsp;&nbsp;</a>`).join('')}</div>` : '<table><tr><td><a href="#">:)</a></td></tr></table>';
    return `<span class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><button type="button" class="btn btn-xs btn-default" title="${t}"><i class="fa">☺</i></button></a><div class="dropdown-menu" role="menu" style="padding:10px;width:320px;">${menu}</div></span>`;
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
  const foot = `</div></div></div>${realBs ? '<script src="lib/jquery-3.3.1/jquery-3.3.1.min.js"></script><script src="lib/bootstrap-3.3.7/js/bootstrap.min.js"></script>' : ''}</body></html>`;
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
<div class="form-group"><label class="col-sm-2 control-label">Message</label><div class="col-sm-10">
${TOOLBAR}
<textarea name="message" id="message" rows="14" class="form-control" placeholder="Votre message"></textarea></div></div>
<div class="form-group"><button type="submit" class="btn btn-primary">Envoyer</button></div></form>` + foot;
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

const browser = await chromium.launch({ headless: true });

async function open({ width, kind, locked = false, theme = true, variant = 'empire-brun-dark', realBs = false }) {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height: 800 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 2 });
  const state = { documents: 0, other: [] };
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
  await page_.waitForTimeout(1500);
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
for (const width of [375, 700]) {
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
{
  const { context, page: p } = await open({ width: 375, kind: 'sujet', locked: true });
  const m = await p.evaluate(MEASURE);
  check('aucun « Répondre » inventé', () => assert.equal(m.reponds.length, 0, JSON.stringify(m.reponds)));
  check('« Nouveau sujet » reste libellé, en haut et en bas', () => assert.equal(m.nouveau.filter(a => a.text === 'Nouveau sujet').length, 2));
  await context.close();
}

console.log('F-01 : page d\'édition mobile');
{
  const { context, page: p } = await open({ width: 375, kind: 'editeur' });
  const m = await p.evaluate(MEASURE);
  check('aucun « + » (ni lien nouveau sujet sans libellé) dans l\'éditeur', () => assert.equal(m.plus.length, 0, JSON.stringify(m.plus)));
  await context.close();
}

console.log('F-06 : éditeur mobile, barre d\'outils BBCode');
for (const width of [375, 700]) {
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
for (const variant of VARIANTS) {
  const { context, page: p, state } = await open({ width: 375, kind: 'sujet', variant });
  for (const [index, place] of [[0, 'haut'], [1, 'bas']]) {
    await p.evaluate(i => Array.from(document.querySelectorAll('a.forum-thread-action-reply'))[i].scrollIntoView({ block: 'center' }), index);
    await p.waitForTimeout(250);
    const normal = await replyColors(p, index);
    // Survol puis appui réels (souris), relâchés hors du bouton : aucun clic, aucune navigation
    await p.mouse.move(normal.x, normal.y);
    await p.waitForTimeout(250);
    const hover = await replyColors(p, index);
    await p.mouse.down();
    await p.waitForTimeout(250);
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
  check(`${variant} : aucune navigation déclenchée`, () => assert.equal(state.other.length, 0, state.other.join(',')));
  await context.close();
}

// ---------- M2 : palette « Couleurs » = grille de pastilles 44×44 dans le menu, 18 couleurs, comportements natifs préservés ----------
const PALETTE = () => {
  const dd = Array.from(document.querySelectorAll('.btn-toolbar .dropdown')).find(d => d.querySelector('button[title="DROP-couleurs"]'));
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
    menu: { x: mr.left, y: mr.top, w: mr.width, h: mr.height }, dots, vw: document.documentElement.clientWidth,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
};
const hexToRgb = h => { const n = parseInt(h.slice(1), 16); return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`; };
async function openPalette(p, realBs) {
  const btn = await p.evaluate(() => { const b = document.querySelector('button[title="DROP-couleurs"]'); b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { x: r.left + r.width / 2, y: r.top + r.height / 2, ok: hit === b || b.contains(hit) }; });
  if (!btn.ok) { throw new Error('bouton Couleurs recouvert ou hors écran au point visé'); }
  if (realBs) { await p.mouse.click(btn.x, btn.y); } else { await p.evaluate(() => document.querySelector('button[title="DROP-couleurs"]').closest('.dropdown').classList.add('open')); }
  await p.waitForTimeout(300);
}
const overlap = (a, b) => a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5;
const paletteModes = [{ name: 'fixture Bootstrap minimal (.open posé)', realBs: false }];
if (BS_DIR) { paletteModes.push({ name: 'vrai Bootstrap 3.3.7 + jQuery (clic sur data-toggle)', realBs: true }); } else { console.log('  --   passe « vrai Bootstrap » non jouée (KR_BOOTSTRAP_DIR absent)'); }
for (const mode of paletteModes) {
  console.log(`M2 : palette Couleurs — ${mode.name}`);
  for (const width of [375, 390, 430, 700]) {
    const { context, page: p, state } = await open({ width, kind: 'editeur', realBs: mode.realBs });
    await openPalette(p, mode.realBs);
    const m = await p.evaluate(PALETTE);
    const tag = `${width} px`;
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
      // Même bouton : un second clic referme le menu (comportement Bootstrap natif intact)
      const btn = await p.evaluate(() => { const b = document.querySelector('button[title="DROP-couleurs"]'); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, ok: b === document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) }; });
      assert.equal(btn.ok, true);
      await p.mouse.click(btn.x, btn.y);
      await p.waitForTimeout(250);
      const closed = await p.evaluate(PALETTE);
      check(`${tag} : le même bouton referme le menu`, () => assert.equal(closed.shown, false));
    }
    const clicks = await p.evaluate(() => window.__clicks.length);
    check(`${tag} : aucune pastille activée, aucune navigation`, () => assert.equal(clicks + state.other.length, 0, state.other.join(',')));
    if (SHOTS) { await p.evaluate(PALETTE); await p.screenshot({ path: path.join(SHOTS, `forum-palette-couleurs-${mode.realBs ? 'bootstrap' : 'minimal'}-${width}.png`) }); }
    await context.close();
  }
}

console.log('Desktop 1280 : inchangé');
{
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

await browser.close();
if (failures) {
  console.log(`\n${failures} échec(s)`);
  process.exit(1);
}
console.log('\nTous les contrôles passent');
