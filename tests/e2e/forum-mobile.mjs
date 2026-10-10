// Test forum mobile : « Répondre » en haut et en bas du sujet (F-01) et barre BBCode utilisable au doigt (F-06).
// Pages = FIXTURES inertes reprenant la structure RÉELLE capturée (forum-top, h1, barre d'outils) ; aucun réseau Kraland,
// aucun clic sur une action : les navigations sont interceptées et comptées (attendu : 0).
// Émulation mobile Chromium, pas un vrai téléphone.
//
// Usage : npm run build && npm run test:forum-mobile
// Option : KR_SCRIPT=/chemin/script.user.js pour tester un autre fichier (défaut : bundle principal).
// Option : KR_SHOTS=/dossier pour enregistrer des captures de fixtures.
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
  @media (min-width: 768px) { .col-sm-10 { float: left; width: 83.33%; } .col-sm-2 { float: left; width: 16.66%; } .col-md-9 { width: 75%; } }
`;
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
    const menu = t === 'DROP-couleurs' ? '<div class="btn-group btn-group-xs" role="group"><a href="javascript:addtag(\'red\',1);" class="btn btn-default" style="background:none;background-color:#d50000" title="[red]x[/red]">&nbsp;&nbsp;</a></div>' : '<table><tr><td><a href="#">:)</a></td></tr></table>';
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

function page({ kind, locked = false }) {
  const head = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><base href="http://www.kraland.org/"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>FIXTURE forum (aucune donnée réelle)</title><style>${BOOTSTRAP}</style></head><body>
<nav class="navbar navbar-inverse nomargin"><div class="container"><div class="navbar-header"><a class="navbar-brand" href="/">Kraland</a></div><div id="navbar" class="navbar-collapse collapse"><ul class="nav navbar-nav"><li><a href="/jouer/plateau">Jouer</a></li></ul></div></div></nav>
<div id="content" class="container"><div class="row"><div id="col-left" class="col-md-3"></div><div id="col-right" class="col-md-9">`;
  const foot = '</div></div></div></body></html>';
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

async function open({ width, kind, locked = false, theme = true }) {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height: 800 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 2 });
  const state = { documents: 0, other: [] };
  const urlFor = kind === 'sujet' ? '/forum/sujet/fixture-1-2' : '/forum/post/repondre-2-FIXTURE';
  await context.route(BASE + '/**', r => {
    const u = new URL(r.request().url());
    if (r.request().resourceType() === 'document' && u.pathname === urlFor) {
      state.documents += 1;
      return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: page({ kind, locked }) });
    }
    state.other.push(u.pathname);
    return r.abort();
  });
  await context.addInitScript(({ src, enabled }) => {
    window.GM = { xmlHttpRequest: () => {} };
    window.__clicks = [];
    if (enabled) {
      localStorage.setItem('kr-theme-enabled', 'true');
      localStorage.setItem('kr-theme-variant', 'empire-brun-dark');
      // eslint-disable-next-line no-eval
      document.addEventListener('DOMContentLoaded', () => (0, eval)(src));
    }
  }, { src: userscript, enabled: theme });
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
