// Test messages du forum, v3 validée : lecture (message d'un sujet), rédaction (réponse) et édition. Mobile uniquement (< 768 px).
// Pages = FIXTURES inertes reprenant le DOM RÉEL relevé en lecture seule (GET public) sur forum/sujet/… et forum/post/repondre-… :
//   message  : ul.media-list.forum > li.media.well > .pull-left(.user-info) + .media-body(date, .pull-right(votes #ajax-N, profil, lien, citer), .forum-msg)
//   éditeur  : form[name=post_msg] > .form-group(Expéditeur) + .form-group(.btn-toolbar de 4 groupes, textarea#message) + bouton .btn-primary.pull-right
// Cascade native = vrai Bootstrap 3.3.7 + jQuery 3.3.1 embarqués dans tests/e2e/vendor/. Aucun réseau Kraland : tout est intercepté, aucune action déclenchée
// (attendu : 0 clic natif, 0 navigation, 0 formulaire soumis). Émulation Chromium, pas un vrai téléphone.
//
// Usage : npm run build && npm run test:zone -- messages
// Options : KR_SCRIPT (bundle testé), KR_SHOTS=/dossier (captures), KR_FA_DIR=/dossier (copie locale de Font Awesome 5.6.3 du site, captures seulement :
//   aucune dépendance ajoutée, sans elle les icônes natives sont vides, ce qui ne change aucune assertion), KR_FRAG (fragments, voir plus bas).
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { chromium } from 'playwright';
import { domQuiet, probeQuiet, THEME_READY } from './lib/settle.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const SHOTS = process.env.KR_SHOTS || '';
const FA_DIR = process.env.KR_FA_DIR || '';
const BASE = 'http://www.kraland.org';
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }

const URLS = { sujet: '/forum/sujet/messages-v3-329425-1', repondre: '/forum/post/repondre-3-6801390', editer: '/forum/post/editer-4-6801390' };
const EDIT_LABEL = 'Modifier'; // libellé d'édition de la FIXTURE : le test vérifie seulement qu'il est conservé tel quel, quel qu'il soit

// ---------- DOM natif : message ----------
const svg = (w, h, fill) => 'data:image/svg+xml;base64,' + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${fill}"/></svg>`).toString('base64');
const VOTE_GROUP = (id, up, down, score, session = '1') => `<div class="btn-group btn-group-xs" role="group" id="ajax-${id}">
<a href="javascript:updateAjax( 'ajax-${id}', '5-1-${id}-1', '595697152${session}' );" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="j'aime"><i class="far fa-thumbs-up"></i>  +${up}</a>
<a href="javascript:updateAjax( 'ajax-${id}', '5-1-${id}-2', '795697152${session}' );" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="je n'aime pas"><i class="far fa-thumbs-down"></i>  -${down}</a>
<span class="btn btn-success">+${score}&nbsp;</span></div>`;
const POSTS = [
  { id: 6801390, name: 'Cabinet Hardman &amp; Graves', slug: 'cabinet-hardman-graves-1-33012', rank: 'Membre', date: 'posté 08/10 (20:44)', up: 1, down: 0, score: 1,
    body: '<b>Nerys a écrit :</b><br><br>Nous constatons que notre appel a eu un succès retentissant : notre action collective contre le gouvernement ruthvène a désormais un poids conséquent qu’il ne saura ignorer !<br><br>Nous lançons dès ce soir des négociations avec les autorités afin d’obtenir un accord rapide, pour leur éviter une procédure judiciaire longue est couteuse.<br><br>Chers clients, nous ne vous décevrons pas et reviendrons vers vous avec du concret !' },
  { id: 6801393, name: 'Fulbert de la Bretelle', slug: 'fulbert-de-la-bretelle-1-33013', rank: 'Modérateur', date: 'modifié 08/10 (21:02)', up: 3, down: 1, score: 2,
    body: `<b>Cabinet Hardman &amp; Graves a écrit :</b><br><br><blockquote class="blockquote quote"><i class="fas fa-quote-left text-warning me-2"></i> <br>Nous lançons dès ce soir des négociations.<br></blockquote><br><br>Maîtres, un point de procédure : lien <a href="http://www.kraland.org/forum/sujet/x">exemple</a> et une très longue chaîne sans espace ${'abcdefghij'.repeat(12)}.` },
  { id: 6801395, name: 'Nerys', slug: 'nerys-1-33014', rank: 'Membre', date: 'posté 08/10 (22:10)', up: 0, down: 0, score: 0, body: 'Merci à tous.' }
];
const postHtml = (p, i) => `<a name="msg${p.id}"></a>
<li class="media well" style="overflow-wrap:anywhere;">
<div class="pull-left"><div class="user-info"><img class="avatar img-thumbnail" src="${svg(80, 80, i === 0 ? '#111' : '#7a5240')}" width="80" alt="${p.name}"><strong><a href="communaute/membres/${p.slug}">${p.name}</a></strong><div class="cartouche"><p>${p.rank}</p></div></div></div>
<div class="media-body">
<div class="btn-group btn-group-xs"><span class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="${p.date}" disabled><i class="far fa-clock"></i> 
${p.date}
</span></div>
<div class="pull-right" style="padding-right:7px;">
${VOTE_GROUP(p.id, p.up, p.down, p.score)}
<div class="btn-group btn-group-xs" role="group"><a href="communaute/membres/${p.slug}" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="profil"><i class="fa fa-user"></i></a></div>
<div class="btn-group btn-group-xs" role="group"><a href="kramail/post/${p.slug.slice(0, 14)}" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="kramail"><i class="fa fa-envelope"></i></a><a href="kramail/post/kraland-v7-comm" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="signaler"><i class="fa fa-exclamation-triangle"></i></a></div>
<div class="btn-group btn-group-xs" role="group">
<button class="btn btn-default" onclick="window.__clicks.push('lien-${p.id}')" data-toggle="tooltip" data-placement="bottom" title="lien"><i class="fa fa-link"></i></button>
<a href="forum/post/repondre-3-${p.id}" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="citer"><i class="fa fa-reply"></i></a></div>
</div>
<div id="ajax-h${p.id}"></div>
<div class="forum-msg" id="ajax-m${p.id}">${p.body}<div id="ajax-s${p.id}"><br />___<br /><br /><a href="https://example.invalid/signature">Signature de test</a></div></div>
</div>
</li>`;

// ---------- DOM natif : éditeur (titres, icônes et href RELEVÉS sur forum/post/repondre-2-… ; menus smileys et couleurs inclus) ----------
const A = (tag, icon, title) => `<a href="javascript:addtag('${tag}',1);" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="${title}"><i class="${icon}"></i></a>`;
const COLORS = [['yellow', '#f4ac00'], ['orange', '#f77400'], ['fuchsia', '#ed6161'], ['red', '#d50000'], ['olive', '#808000'], ['lightgreen', '#219c5a'], ['green', '#006f00'], ['teal', '#008080'], ['lightblue', '#5577bc'], ['blue', '#2b2be4'], ['navy', '#000080'], ['purple', '#800080'], ['indigo', '#4B0082'], ['maroon', '#800000'], ['brown', '#5e432d'], ['gray', '#808080'], ['darkgray', '#5a5a5a'], ['black', '#000000']];
const SMILEYS = `<table>${Array.from({ length: 14 }, (_r, r) => `<tr>${Array.from({ length: 9 }, (_c, c) => { const n = r * 9 + c; return `<td><a href="#" OnClick="window.__clicks.push('smiley-${n}');return false;"><img src="${svg(15 + (n % 3) * 5, 15, '#d9a400')}" data-toggle="tooltip" data-placement="bottom" alt="[s${n}]" title="[s${n}]" class="img-thumbnail"></a></td>`; }).join('')}</tr>`).join('')}</table>`;
const TOOLBAR = `<div class="btn-toolbar" role="toolbar" aria-label="...">
<div class="btn-group btn-group-xs" role="group" aria-label="mise en forme">${A('b', 'fa fa-bold', 'Gras: [b]x[/b]')}${A('i', 'fa fa-italic', 'Italique: [i]x[/i]')}${A('u', 'fa fa-underline', 'Souligné: [u]x[/u]')}${A('strike', 'fa fa-strikethrough', 'Barré: [strike]x[/strike]')}</div>
<div class="btn-group btn-group-xs" role="group" aria-label="mise en forme">${A('img', 'far fa-image', 'Image: [img]x[/img]')}${A('url', 'fa fa-link', 'Lien: [url=...]x[/url]')}${A('youtube', 'fas fa-video', 'Vidéo youtube: [youtube]x[/youtube] x = lien de youtube ou numéro vidéo (11 caractères)')}<span class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><button type="button" class="btn btn-xs btn-default" data-toggle="tooltip" data-placement="bottom" title="Smileys"><i class="far fa-smile"></i></button></a><div class="dropdown-menu" role="menu" style="padding:10px;width:320px;">${SMILEYS}</div></span></div>
<div class="btn-group btn-group-xs" role="group" aria-label="mise en forme">${A('quote', 'fa fa-quote-right', 'Citation: [quote]x[/quote]')}${A('spoiler', 'fa fa-compress', 'Spoiler: [spoiler]x[/spoiler]')}${A('pre', 'fa fa-list', 'Pré-formaté: [pre]x[/pre]')}<span class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><button type="button" class="btn btn-xs btn-default" data-toggle="tooltip" data-placement="bottom" title="Couleurs"><i class="fa fa-flask" aria-hidden="true"></i></button></a><div class="dropdown-menu" role="menu" style="padding:10px;width:190px;"><div class="btn-group btn-group-xs" role="group">${COLORS.map(([n, c], i) => `<a href="javascript:addtag('${n}',1);" class="btn btn-default" ${i === 0 ? 'onclick="window.__clicks.push(\'couleur-0\')" ' : ''}style="background: none;background-color:${c}" data-toggle="tooltip" data-placement="bottom" title="[${n}]x[/${n}]">&nbsp;&nbsp;</a>`).join('')}</div></div></span></div>
<div class="btn-group btn-group-xs" role="group" aria-label="mise en forme">${A('left', 'fa fa-align-left', 'Aligner à gauche: [left]x[/left]')}${A('center', 'fa fa-align-center', 'Centrer: [center]x[/center]')}${A('right', 'fa fa-align-right', 'Aligner à droite: [right]x[/right]')}${A('fleft', 'fa fa-outdent', 'Flottant à gauche: [fleft]x[/fleft]')}${A('fright', 'fa fa-indent', 'Flottant à droite: [fright]x[/fright]')}<a href="" onclick="window.__clicks.push('prev');return false;" data-toggle="tooltip" data-placement="bottom" title="Prévisualisation" class="btn btn-default"><i class="fab fa-searchengin"></i></a></div></div>`;
const TEXT_REPLY = '[b]Fulbert de la Bretelle a écrit :[/b]\n\n[quote][olive]Maîtres,';
const editorForm = (kind) => `<form name="post_msg" method="post" action="forum/sujet/messages-v3-329425-1" class="form-horizontal" onsubmit="window.__clicks.push('submit');return false;">
<input type="hidden" name="a" value="1">
<div class="form-group"><label class="col-sm-2 control-label">Expéditeur <span class="required">*</span></label><div class="col-sm-10"><div class="input-group"><span class="input-group-addon"><i class="fa fa-user"></i></span><select name="c[4]" class="form-control" required><option value="1">Nerys</option><option value="2">Autre personnage</option></select></div></div></div>
<div class="form-group"><label class="col-sm-2 control-label">Message <span class="required">*</span></label><div class="col-sm-10">
${TOOLBAR}
<textarea name="message" id="message" rows="14" class="form-control" placeholder="Votre message" data-plugin-textarea-autosize required>${kind === 'editer' ? 'Texte existant à modifier : [i]conservé[/i] tel quel.' : TEXT_REPLY}</textarea></div></div>
<div class="form-group"><label class="col-md-2 control-label">Options</label><div class="col-md-10"><label class="checkbox-inline"><input type="checkbox" name="f[0]" value="1" checked> Signature</label></div></div>
<div><div class="col-sm-12"><button class="btn btn-primary pull-right">${kind === 'editer' ? EDIT_LABEL : 'Envoyer'}</button></div></div></form>`;

function page(kind, { stripTitles = false } = {}) {
  const fa = FA_DIR ? '<link rel="stylesheet" href="lib/fontawesome-free-5.6.3/css/all.min.css">' : '';
  const head = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><base href="${BASE}/"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>FIXTURE messages v3 (aucune donnée réelle)</title><link rel="stylesheet" href="lib/bootstrap-3.3.7/css/bootstrap1.min.css">${fa}</head><body>
<nav class="navbar navbar-inverse nomargin"><div class="container"><div class="navbar-header"><a class="navbar-brand" href="/">Kraland</a></div><div id="navbar" class="navbar-collapse collapse"><ul class="nav navbar-nav"><li><a href="/jouer/plateau">Jouer</a></li></ul></div></div></nav>
<div id="content" class="container"><div class="row"><div id="col-left" class="col-md-3"></div><div id="col-right" class="col-md-9">`;
  const foot = '</div></div></div><footer class="navbar-inverse"><div class="container white"><div class="footer-quote">« FIXTURE »</div></div></footer><script src="lib/jquery-3.3.1/jquery-3.3.1.min.js"></script><script src="lib/bootstrap-3.3.7/js/bootstrap.min.js"></script></body></html>';
  let body;
  if (kind === 'sujet') {
    body = `<h1 class="page-header"><i class="far fa-comments"></i>
Royaume de Ruthvénie : fixture</h1>
<div class="forum-top"><span></span><span><i class="fa fa-user"></i> Par Nerys</span><span><i class="fa fa-comments"></i> 3 messages</span><span class="pull-right">
<a href="forum/hrp/site-annonces-20101" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="Site & Annonces"><i class="fa fa-backward"></i> Site & Annonces</a>
<button class="btn btn-default" onclick="window.__clicks.push('lien-sujet')" data-toggle="tooltip" data-placement="bottom" title="lien"><i class="fa fa-link"></i></button>
<a href="forum/post/nouveau-sujet-1-20101" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="nouveau sujet"><i class="fa fa-comment"></i> nouveau sujet</a>
<a href="forum/post/repondre-2-329425" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="répondre"><i class="fa fa-reply"></i> répondre</a>
<a href="forum/sujet/messages-v3-329425-999" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="liste des messages"><i class="fa fa-th-list"></i></a></span></div>
<div class="center"><ul class="pagination"><li><a href="forum/sujet/messages-v3-329425-1">1</a></li><li class="active"><a href="forum/sujet/messages-v3-329425-2">2</a></li></ul></div>
<ul class="media-list forum">
${POSTS.map(postHtml).join('\n')}
</ul>`;
  } else {
    body = `<h1 class="page-header">${kind === 'editer' ? 'Modifier' : 'Répondre'} <span class="pull-right"><a href="forum/sujet/messages-v3-329425-1" class="btn btn-default"><i class="fa fa-backward"></i> sujet</a></span></h1>${editorForm(kind)}`;
  }
  let html = head + body + foot;
  if (stripTitles) { html = html.replace(/ title="[^"]*"/g, (m) => m.replace(' title=', ' data-original-title=')); }
  return html;
}

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}

// Fragments : lecture-sombre, lecture-clair, redaction-sombre, redaction-clair, edition, bureau, seuils, transitions, themes
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const frag = id => FRAG.length === 0 || FRAG.some(f => f === id || id.startsWith(f + '-') || f.startsWith(id + '-'));

const browser = await chromium.launch({ headless: true });
const DARK = 'empire-brun-dark'; const LIGHT = 'empire-brun';

async function open({ width, kind, theme = true, variant = DARK, height = 800, stripTitles = false, touch = false }) {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile || touch, deviceScaleFactor: 2 });
  const state = { documents: 0, other: [] };
  await context.route(BASE + '/**', r => {
    const u = new URL(r.request().url());
    if (r.request().resourceType() === 'document' && u.pathname === URLS[kind]) {
      state.documents += 1;
      return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: page(kind, { stripTitles }) });
    }
    if (u.pathname.startsWith('/lib/fontawesome') && FA_DIR) {
      const rel = u.pathname.replace('/lib/fontawesome-free-5.6.3/', '');
      const file = path.join(FA_DIR, rel);
      if (fs.existsSync(file)) { return r.fulfill({ status: 200, contentType: file.endsWith('.css') ? 'text/css' : 'font/woff2', body: fs.readFileSync(file) }); }
    }
    if (u.pathname.startsWith('/lib/')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return r.fulfill({ status: 200, contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(path.join(VENDOR, file)) });
    }
    state.other.push(u.pathname);
    return r.abort();
  });
  await context.addInitScript(({ src, enabled, variant: v }) => {
    window.GM = { xmlHttpRequest: () => {} };
    window.__clicks = [];
    window.addtag = () => { window.__clicks.push('addtag'); };
    window.updateAjax = () => { window.__clicks.push('updateAjax'); };
    if (enabled) {
      localStorage.setItem('kr-theme-enabled', 'true');
      localStorage.setItem('kr-theme-variant', v);
      // eslint-disable-next-line no-eval
      document.addEventListener('DOMContentLoaded', () => (0, eval)(src));
    }
  }, { src: userscript, enabled: theme, variant });
  const p = await context.newPage();
  await p.goto(BASE + URLS[kind], { waitUntil: 'load' });
  if (theme) { await domQuiet(p, { ready: THEME_READY, label: 'messages-v3' }); } else { await p.waitForTimeout(300); }
  return { context, page: p, state };
}

const parseRgb = str => { const v = str.match(/[\d.]+/g).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
const luminance = ({ r, g, b }) => { const [R, G, B] = [r, g, b].map(v => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * R + 0.7152 * G + 0.0722 * B; };
const contrast = (fg, bg) => { const a = luminance(parseRgb(fg)); const b = luminance(parseRgb(bg)); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };

// Signature des actions natives : balise, href, onclick, texte. Doit être IDENTIQUE avec et sans la peau (hors ajouts de la peau).
const SIGNATURE = (scope) => {
  const own = e => !e.classList.contains('kr-msg-more') && !e.classList.contains('kr-tools-plus');
  return Array.from(document.querySelectorAll(scope)).filter(own).map(e => `${e.tagName}|${e.getAttribute('href')}|${e.getAttribute('onclick')}|${e.textContent.replace(/\s+/g, ' ').trim()}`);
};

// ---------- lecture ----------
const READ = () => {
  const rect = e => { if (!e) { return null; } const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom + window.scrollY) }; };
  const shown = e => { if (!e) { return false; } const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const post = document.querySelector('ul.media-list.forum > li.media');
  const q = (sel) => post.querySelector(sel);
  const ups = Array.from(post.querySelectorAll('a[href^="javascript:updateAjax"]'));
  const kr = Array.from(post.querySelectorAll('a[href*="kramail/post/"]'));
  const labelOf = e => (e ? getComputedStyle(e, '::after').content.replace(/^"|"$/g, '') + '|' + getComputedStyle(e, '::before').content.replace(/^"|"$/g, '') : '');
  const els = { up: ups[0], down: ups[1], score: q('.btn-success'), reply: q('a[href*="forum/post/repondre-"]'), more: q('button.kr-msg-more'), profil: q('.pull-right a[href*="communaute/membres/"]'), kramail: kr[0], signaler: kr[1], lien: q('button[onclick*="window.__clicks"]') };
  const out = { mobileMode: document.body.classList.contains('mobile-mode'), ready: post.classList.contains('kr-msg'), open: post.classList.contains('kr-msg-open'), overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth, iw: window.innerWidth };
  out.post = rect(post); out.avatar = rect(q('img.avatar')); out.name = rect(q('.user-info strong a')); out.cartouche = rect(q('.cartouche')); out.date = rect(q('.media-body > .btn-group > span')); out.body = rect(q('.forum-msg'));
  out.bodyText = q('.forum-msg').textContent.replace(/\s+/g, ' ').trim();
  for (const [k, e] of Object.entries(els)) { out[k] = { shown: shown(e), ...rect(e), label: labelOf(e), aria: e && e.getAttribute('aria-expanded') }; }
  out.postCount = document.querySelectorAll('ul.media-list.forum > li.media').length;
  return out;
};
const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

async function readingChecks(width, variant, tag) {
  const native = await open({ width, kind: 'sujet', theme: false });
  const nativeSig = await native.page.evaluate(SIGNATURE, 'ul.media-list.forum a, ul.media-list.forum button');
  const nativeText = await native.page.evaluate(() => Array.from(document.querySelectorAll('.forum-msg')).map(e => e.textContent.replace(/\s+/g, ' ').trim()));
  await native.context.close();
  const { context, page: p, state } = await open({ width, kind: 'sujet', variant });
  const m = await p.evaluate(READ);
  check(`${tag} : mode mobile et message mis en forme (kr-msg)`, () => { assert.equal(m.mobileMode, true); assert.equal(m.ready, true); assert.equal(m.postCount, 3); });
  check(`${tag} : avatar réduit (<= 64 px), nom, rang et date groupés à côté de l'avatar`, () => {
    assert.ok(m.avatar.w <= 64 && m.avatar.h <= 64, JSON.stringify(m.avatar));
    for (const k of ['name', 'cartouche', 'date']) { assert.ok(m[k].x >= m.avatar.r - 1, `${k} à gauche de l'avatar ${JSON.stringify(m[k])}`); assert.ok(m[k].y >= m.avatar.y - 2 && m[k].y < m.avatar.b + 12, `${k} hors du bloc d'identité ${JSON.stringify(m[k])}`); }
    assert.ok(m.name.y < m.date.y, 'le nom précède la date');
  });
  check(`${tag} : corps du message immédiatement accessible (< 150 px sous le haut du message)`, () => assert.ok(m.body.y - m.post.y < 150, `${m.body.y - m.post.y}`));
  check(`${tag} : texte du message intact`, () => assert.ok(m.bodyText.startsWith('Nerys a écrit :') && m.bodyText.includes('Nous constatons') && m.bodyText.includes('du concret !')));
  check(`${tag} : actions SOUS le texte : score, pouce haut, pouce bas, « Répondre », « ••• »`, () => {
    for (const k of ['up', 'down', 'reply', 'more']) { assert.ok(m[k].shown, `${k} visible`); assert.ok(m[k].y >= m.body.b - 2, `${k} sous le corps ${m[k].y} / ${m.body.b}`); assert.ok(m[k].r <= m.iw, `${k} dans l'écran`); }
    assert.ok(m.score.shown && m.score.y >= m.body.b - 2);
  });
  check(`${tag} : cibles tactiles >= 44 px (votes, Répondre, •••), sans recouvrement`, () => {
    const t = ['up', 'down', 'reply', 'more'].map(k => ({ k, ...m[k] }));
    for (const x of t) { assert.ok(x.w >= 44 && x.h >= 44, `${x.k} ${x.w}×${x.h}`); }
    for (let i = 0; i < t.length; i += 1) { for (let j = i + 1; j < t.length; j += 1) { assert.equal(overlap(t[i], t[j]), false, `${t[i].k}/${t[j].k}`); } }
  });
  check(`${tag} : « Répondre » porte son texte (libellé visible) et garde la destination native`, () => { assert.ok(m.reply.label.includes('Répondre'), m.reply.label); assert.ok(m.reply.w >= 80, `${m.reply.w}`); });
  check(`${tag} : actions secondaires (profil, Kramail, Signaler, lien) masquées au départ, ••• replié`, () => { for (const k of ['profil', 'kramail', 'signaler', 'lien']) { assert.equal(m[k].shown, false, k); } assert.equal(m.open, false); assert.equal(m.more.aria, 'false'); });
  check(`${tag} : pas de débordement horizontal`, () => assert.ok(m.overflowX <= 0, `${m.overflowX}`));
  // Ouverture de ••• (bouton de la peau : aucune action native)
  await p.evaluate(() => document.querySelector('ul.media-list.forum > li.media button.kr-msg-more')?.click());
  const o = await p.evaluate(READ);
  check(`${tag} : ••• ouvre profil, Kramail, Signaler et lien (libellés, >= 44 px, dans l'écran, sous les actions)`, () => {
    assert.equal(o.open, true); assert.equal(o.more.aria, 'true');
    for (const [k, lab] of [['profil', 'Profil'], ['kramail', 'Kramail'], ['signaler', 'Signaler'], ['lien', 'Lien du message']]) {
      assert.ok(o[k].shown, `${k} visible`); assert.ok(o[k].h >= 44 && o[k].w >= 44, `${k} ${o[k].w}×${o[k].h}`); assert.ok(o[k].r <= o.iw && o[k].x >= 0, `${k} dans l'écran`);
      assert.ok(o[k].label.includes(lab), `${k} libellé « ${o[k].label} »`); assert.ok(o[k].y >= o.more.y, `${k} sous •••`);
    }
    assert.ok(o.overflowX <= 0);
  });
  await p.evaluate(() => document.querySelector('ul.media-list.forum > li.media button.kr-msg-more')?.click());
  const c = await p.evaluate(READ);
  check(`${tag} : ••• referme les actions secondaires`, () => { assert.equal(c.open, false); assert.equal(c.profil.shown, false); assert.equal(c.more.aria, 'false'); });
  // Conservation native
  const sig = await p.evaluate(SIGNATURE, 'ul.media-list.forum a, ul.media-list.forum button');
  const texts = await p.evaluate(() => Array.from(document.querySelectorAll('.forum-msg')).map(e => e.textContent.replace(/\s+/g, ' ').trim()));
  check(`${tag} : toutes les actions natives conservées (balise, href, onclick, texte identiques à la page sans la peau : ${nativeSig.length})`, () => { assert.ok(nativeSig.length >= 3 * 8, `${nativeSig.length}`); assert.deepEqual(sig, nativeSig); });
  check(`${tag} : texte des 3 messages et signature identiques à la page sans la peau`, () => assert.deepEqual(texts, nativeText));
  // Après un vote natif simulé : le groupe #ajax-N est remplacé par le serveur (innerHTML) ; la mise en forme tient
  await p.evaluate(() => { const g = document.querySelector('#ajax-6801390'); g.outerHTML = g.outerHTML.replace('+1</span>', '+2&nbsp;</span>').replace(/thumbs-up"><\/i> {2}\+1/, 'thumbs-up"></i>  +2'); });
  const a = await p.evaluate(READ);
  check(`${tag} : après remplacement du groupe de votes par le serveur, votes toujours >= 44 px, sous le texte, à côté de « Répondre »`, () => {
    assert.ok(a.up.shown && a.down.shown && a.up.w >= 44 && a.up.h >= 44 && a.down.h >= 44 && a.up.y >= a.body.b - 2);
    assert.ok(Math.abs(a.up.y - a.reply.y) < 60);
  });
  const clicks = await p.evaluate(() => window.__clicks.length);
  check(`${tag} : aucune action native déclenchée (0 clic, 0 navigation)`, () => assert.equal(clicks + state.other.length, 0, state.other.join(',')));
  if (SHOTS) {
    // Une barre fixe masque le haut de la carte si scrollIntoView l'aligne en y=0 : garder l'identité sous la navbar.
    await p.evaluate(() => {
      const post = document.querySelector('ul.media-list.forum > li.media');
      const nav = document.querySelector('nav.navbar');
      const inset = nav && getComputedStyle(nav).position === 'fixed' ? nav.getBoundingClientRect().height : 0;
      window.scrollTo(0, post.getBoundingClientRect().top + window.scrollY - inset - 8);
    });
    await p.screenshot({ path: path.join(SHOTS, `lecture-${variant}-${width}.png`) });
    await p.screenshot({ path: path.join(SHOTS, `lecture-complete-${variant}-${width}.png`), fullPage: true });
    await p.evaluate(() => document.querySelector('ul.media-list.forum > li.media button.kr-msg-more')?.click());
    await p.evaluate(() => { const li = document.querySelector('ul.media-list.forum > li.media'); window.scrollTo(0, li.getBoundingClientRect().bottom + window.scrollY - window.innerHeight + 8); });
    await p.screenshot({ path: path.join(SHOTS, `lecture-menu-${variant}-${width}.png`) });
  }
  await context.close();
}

// ---------- rédaction / édition ----------
const EDIT = () => {
  const rect = e => { if (!e) { return null; } const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom + window.scrollY) }; };
  const shown = e => { if (!e) { return false; } const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const form = document.querySelector('form[name="post_msg"]');
  const bar = form.querySelector('.btn-toolbar');
  const tool = tag => { const a = bar.querySelector(`a[href="javascript:addtag('${tag}',1);"]`); return a; };
  const smileys = bar.querySelector('button:has(.fa-smile)');
  const couleurs = bar.querySelector('button:has(.fa-flask)');
  const prev = bar.querySelector('a[onclick*="\'prev\'"]');
  const plus = bar.querySelector('button.kr-tools-plus');
  const groups = Array.from(form.querySelectorAll('.form-group'));
  const sel = form.querySelector('select, input[name="c[4]"]');
  const label = groups[0].querySelector('label');
  const ta = form.querySelector('textarea');
  const send = form.querySelector('button.btn-primary.pull-right');
  const common = { b: tool('b'), i: tool('i'), url: tool('url'), quote: tool('quote'), smileys };
  const extras = { u: tool('u'), strike: tool('strike'), img: tool('img'), youtube: tool('youtube'), spoiler: tool('spoiler'), pre: tool('pre'), couleurs, left: tool('left'), center: tool('center'), right: tool('right'), fleft: tool('fleft'), fright: tool('fright'), prev };
  const toObj = o => Object.fromEntries(Object.entries(o).map(([k, e]) => [k, { shown: shown(e), ...rect(e) }]));
  const cs = send ? getComputedStyle(send) : null;
  return {
    mobileMode: document.body.classList.contains('mobile-mode'), ready: bar.classList.contains('kr-tools-ready'), open: bar.classList.contains('kr-tools-open'), overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth, iw: window.innerWidth, ih: window.innerHeight,
    common: toObj(common), extras: toObj(extras), plus: plus ? { shown: shown(plus), ...rect(plus), aria: plus.getAttribute('aria-expanded'), text: plus.textContent.replace(/\s+/g, ' ').trim() } : null,
    label: { shown: shown(label), ...rect(label), text: label.textContent.replace(/\s+/g, ' ').trim() }, sender: { shown: shown(sel), ...rect(sel), tag: sel.tagName, options: sel.tagName === 'SELECT' ? Array.from(sel.options).map(o => o.textContent) : [] },
    messageLabel: rect(groups[1].querySelector('label')), bar: rect(bar), ta: { ...rect(ta), value: ta.value }, send: { shown: shown(send), ...rect(send), text: send.textContent.trim(), pos: cs.position, color: cs.color, bg: cs.backgroundColor },
    signature: rect(form.querySelector('label.checkbox-inline')), docH: document.documentElement.scrollHeight, scrollY: window.scrollY,
    smileysMenu: (() => { const mm = bar.querySelector('.dropdown-menu:has(> table)'); return mm ? { shown: shown(mm), ...rect(mm) } : null; })(),
    colorsMenu: (() => { const mm = couleurs.closest('.dropdown').querySelector('.dropdown-menu'); return { shown: shown(mm), ...rect(mm) }; })()
  };
};
const COMMON = ['b', 'i', 'url', 'quote', 'smileys'];
const EXTRA = ['u', 'strike', 'img', 'youtube', 'spoiler', 'pre', 'couleurs', 'left', 'center', 'right', 'fleft', 'fright', 'prev'];
const TOOLS_SIG = 'form[name="post_msg"] .btn-toolbar a, form[name="post_msg"] .btn-toolbar button:not(.kr-tools-plus), form[name="post_msg"] textarea, form[name="post_msg"] select, form[name="post_msg"] button.btn-primary';

async function editorChecks(width, variant, kind, tag) {
  const native = await open({ width, kind, theme: false });
  const nativeSig = await native.page.evaluate(SIGNATURE, TOOLS_SIG);
  await native.context.close();
  const { context, page: p, state } = await open({ width, kind, variant });
  const m = await p.evaluate(EDIT);
  check(`${tag} : mode mobile, barre d'outils mise en forme (kr-tools-ready)`, () => { assert.equal(m.mobileMode, true); assert.equal(m.ready, true); });
  check(`${tag} : expéditeur sur une ligne (libellé « Expéditeur * » + liste), liste >= 44 px, options natives conservées`, () => {
    assert.ok(m.label.text.startsWith('Expéditeur')); assert.ok(m.sender.shown && m.label.shown);
    assert.ok(Math.abs(m.label.y + m.label.h / 2 - (m.sender.y + m.sender.h / 2)) < 24, `libellé ${JSON.stringify(m.label)} / liste ${JSON.stringify(m.sender)}`);
    assert.ok(m.sender.h >= 44 && m.sender.h < 64, `${m.sender.h}`); assert.ok(m.sender.x >= m.label.r - 2); assert.ok(m.sender.r <= m.iw);
    assert.deepEqual(m.sender.options, ['Nerys', 'Autre personnage']);
  });
  check(`${tag} : cinq outils courants visibles (gras, italique, lien, citation, émoticônes), >= 44×44, sans défilement`, () => {
    for (const k of COMMON) { const t = m.common[k]; assert.ok(t.shown, `${k} visible`); assert.ok(t.w >= 44 && t.h >= 44, `${k} ${t.w}×${t.h}`); assert.ok(t.x >= 0 && t.r <= m.iw, `${k} dans l'écran`); }
    const ys = COMMON.map(k => m.common[k].y); assert.ok(Math.max(...ys) - Math.min(...ys) < 8, `une seule rangée ${ys}`);
  });
  check(`${tag} : « Plus » présent (>= 44 px, replié, dans la même rangée), treize autres outils masqués au départ`, () => {
    assert.ok(m.plus && m.plus.shown && m.plus.h >= 44 && m.plus.w >= 44 && m.plus.text.startsWith('Plus'), JSON.stringify(m.plus)); assert.equal(m.plus.aria, 'false');
    assert.ok(Math.abs(m.plus.y - m.common.b.y) < 8, 'Plus dans la rangée des outils courants');
    for (const k of EXTRA) { assert.equal(m.extras[k].shown, false, `${k} masqué`); }
    assert.equal(m.open, false);
  });
  check(`${tag} : grande zone de saisie (>= 300 px de haut, pleine largeur), texte conservé`, () => { assert.ok(m.ta.h >= 300, `${m.ta.h}`); assert.ok(m.ta.w >= m.iw - 40, `${m.ta.w}`); assert.equal(m.ta.value, kind === 'editer' ? 'Texte existant à modifier : [i]conservé[/i] tel quel.' : '[b]Fulbert de la Bretelle a écrit :[/b]\n\n[quote][olive]Maîtres,'); });
  check(`${tag} : validation dans le flux (pas de barre fixe), sous la zone de saisie, libellé natif conservé (« ${kind === 'editer' ? EDIT_LABEL : 'Envoyer'} »), cible >= 44 px`, () => {
    assert.notEqual(m.send.pos, 'fixed'); assert.ok(m.send.y >= m.ta.b - 2, `${m.send.y} / ${m.ta.b}`); assert.equal(m.send.text, kind === 'editer' ? EDIT_LABEL : 'Envoyer'); assert.ok(m.send.h >= 44 && m.send.w >= 44);
  });
  check(`${tag} : option Signature complète, sans chevauchement avec le bouton de validation`, () => { assert.ok(m.signature.w > 40); assert.equal(overlap(m.signature, m.send), false); });
  check(`${tag} : pas de débordement horizontal`, () => assert.ok(m.overflowX <= 0, `${m.overflowX}`));
  // Ouverture de « Plus » (bouton de la peau)
  await p.evaluate(() => document.querySelector('.btn-toolbar button.kr-tools-plus')?.click());
  const o = await p.evaluate(EDIT);
  check(`${tag} : « Plus » révèle les treize autres outils (>= 44×44, dans l'écran), les cinq courants restent à leur place`, () => {
    assert.equal(o.open, true); assert.equal(o.plus.aria, 'true');
    for (const k of EXTRA) { const t = o.extras[k]; assert.ok(t.shown, `${k} visible`); assert.ok(t.w >= 44 && t.h >= 44, `${k} ${t.w}×${t.h}`); assert.ok(t.x >= 0 && t.r <= o.iw, `${k} dans l'écran`); assert.ok(t.y > o.common.b.y, `${k} sous les outils courants`); }
    for (const k of COMMON) { assert.equal(o.common[k].y, m.common[k].y); }
    assert.ok(o.overflowX <= 0);
  });
  // Menus natifs ouverts par le vrai gestionnaire Bootstrap (fixtures inertes)
  await p.evaluate(() => document.querySelector('.btn-toolbar button:has(.fa-flask)').click());
  const col = await p.evaluate(EDIT);
  check(`${tag} : palette Couleurs (menu natif sous « Plus ») contenue dans l'écran`, () => { assert.ok(col.colorsMenu.shown, 'menu visible'); assert.ok(col.colorsMenu.x >= 0 && col.colorsMenu.r <= col.iw, JSON.stringify(col.colorsMenu)); });
  await p.evaluate(() => document.querySelector('.btn-toolbar button:has(.fa-flask)').click());
  await p.evaluate(() => document.querySelector('.btn-toolbar button:has(.fa-smile)').click());
  const sm = await p.evaluate(EDIT);
  check(`${tag} : menu émoticônes (outil courant) contenu dans l'écran`, () => { assert.ok(sm.smileysMenu && sm.smileysMenu.shown); assert.ok(sm.smileysMenu.x >= 0 && sm.smileysMenu.r <= sm.iw, JSON.stringify(sm.smileysMenu)); assert.ok(sm.overflowX <= 0); });
  await p.evaluate(() => document.querySelector('.btn-toolbar button:has(.fa-smile)').click());
  await p.evaluate(() => document.querySelector('.btn-toolbar button.kr-tools-plus')?.click());
  const sig = await p.evaluate(SIGNATURE, TOOLS_SIG);
  check(`${tag} : les 18 outils, le texte, la liste et le bouton conservés (balise, href, onclick, texte identiques à la page sans la peau : ${nativeSig.length})`, () => { assert.ok(nativeSig.length >= 150, `${nativeSig.length}`); assert.deepEqual(sig, nativeSig); });
  const clicks = await p.evaluate(() => window.__clicks.length);
  check(`${tag} : aucune action native déclenchée (0 clic, 0 envoi, 0 navigation)`, () => assert.equal(clicks + state.other.length, 0, state.other.join(',')));
  if (SHOTS) {
    await p.evaluate(() => window.scrollTo(0, 0)); await p.screenshot({ path: path.join(SHOTS, `${kind}-${variant}-${width}.png`) });
    await p.evaluate(() => document.querySelector('.btn-toolbar button.kr-tools-plus')?.click()); await p.screenshot({ path: path.join(SHOTS, `${kind}-plus-${variant}-${width}.png`) });
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.screenshot({ path: path.join(SHOTS, `${kind}-bas-${variant}-${width}.png`) });
  }
  await context.close();
}

const VARIANT_NAME = v => (v === DARK ? 'sombre' : 'clair');

for (const variant of [DARK, LIGHT]) {
  const f = 'lecture-' + VARIANT_NAME(variant);
  if (frag(f)) {
    console.log(`Lecture du message, mobile, ${VARIANT_NAME(variant)}`);
    for (const width of [320, 375, 700]) { await readingChecks(width, variant, `lecture ${width} px ${VARIANT_NAME(variant)}`); }
    // Variante : titres retirés par l'initialisation des infobulles (le site ne garde que data-original-title)
    const { context, page: p } = await open({ width: 375, kind: 'sujet', variant, stripTitles: true });
    await p.evaluate(() => document.querySelector('ul.media-list.forum > li.media button.kr-msg-more')?.click());
    const o = await p.evaluate(READ);
    check(`lecture 375 px ${VARIANT_NAME(variant)} : titres natifs déplacés en data-original-title (infobulles initialisées) : libellés des actions secondaires conservés`, () => { for (const [k, lab] of [['profil', 'Profil'], ['kramail', 'Kramail'], ['signaler', 'Signaler'], ['lien', 'Lien du message']]) { assert.ok(o[k].shown && o[k].label.includes(lab), `${k} ${o[k].label}`); } });
    await context.close();
  }
  for (const kind of ['repondre', 'editer']) {
    const id = (kind === 'repondre' ? 'redaction-' : 'edition-') + VARIANT_NAME(variant);
    if (frag(id) || (kind === 'editer' && frag('edition'))) {
      console.log(`${kind === 'repondre' ? 'Rédaction (réponse)' : 'Édition'}, mobile, ${VARIANT_NAME(variant)}`);
      for (const width of [320, 375, 700]) { await editorChecks(width, variant, kind, `${kind === 'repondre' ? 'rédaction' : 'édition'} ${width} px ${VARIANT_NAME(variant)}`); }
    }
  }
}

// ---------- seuils 767 / 768 / 769 et transitions ----------
if (frag('seuils')) {
  console.log('Seuils N-1 / N / N+1 (767 / 768 / 769), lecture et rédaction, sombre et clair');
  for (const variant of [DARK, LIGHT]) {
    for (const [kind, probe] of [['sujet', () => ({ mobile: document.body.classList.contains('mobile-mode'), skin: !!document.querySelector('li.media.kr-msg'), more: !!document.querySelector('button.kr-msg-more'), sec: !!document.querySelector('.kr-msg-secondary') }) ], ['repondre', () => ({ mobile: document.body.classList.contains('mobile-mode'), skin: !!document.querySelector('.btn-toolbar.kr-tools-ready'), more: !!document.querySelector('button.kr-tools-plus'), sec: !!document.querySelector('.kr-tool-extra') })]]) {
      for (const width of [767, 768, 769]) {
        const { context, page: p } = await open({ width, kind, variant, touch: true });
        const r = await p.evaluate(probe);
        const expect = width < 768;
        check(`seuil ${width} px ${kind} ${VARIANT_NAME(variant)} : ${expect ? 'mise en forme mobile v3' : 'bureau : DOM natif intact (aucun ajout de la v3)'}`, () => { assert.equal(r.mobile, expect); assert.equal(r.skin, expect); assert.equal(r.more, expect); assert.equal(r.sec, expect); });
        if (!expect) { const ox = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); check(`seuil ${width} px ${kind} ${VARIANT_NAME(variant)} : bureau sans débordement`, () => assert.ok(ox <= 0, `${ox}`)); }
        await context.close();
      }
    }
  }
}

if (frag('transitions')) {
  console.log('Vraies transitions de viewport (rechargement au franchissement de 768 px), deux sens');
  const reloaded = async (p, state, docs) => {
    const t0 = Date.now();
    while (state.documents < docs && Date.now() - t0 < 25000) { await p.waitForTimeout(100); }
    await p.waitForLoadState('load');
    await domQuiet(p, { ready: THEME_READY, label: 'rechargement après redimensionnement' });
    return state.documents;
  };
  for (const variant of [DARK, LIGHT]) {
    for (const [kind, sel] of [['sujet', 'li.media.kr-msg'], ['repondre', '.btn-toolbar.kr-tools-ready']]) {
      const tag = `transition ${kind} ${VARIANT_NAME(variant)}`;
      const { context, page: p, state } = await open({ width: 375, variant, kind });
      const start = await p.evaluate(s => !!document.querySelector(s), sel);
      await p.setViewportSize({ width: 768, height: 800 });
      const d1 = await reloaded(p, state, 2);
      const desk = await p.evaluate(s => ({ skin: !!document.querySelector(s), mobile: document.body.classList.contains('mobile-mode'), ox: document.documentElement.scrollWidth - document.documentElement.clientWidth }), sel);
      // Le DOM peut être calme avant que le garde-fou natif autorise le rechargement suivant (écart minimal 1200 ms).
      // Attendre cette condition, pas un délai arbitraire ni une suppression du garde-fou. Le cas rapide est vérifié ci-dessous.
      await p.waitForFunction(() => {
        const log = JSON.parse(sessionStorage.getItem('kr-breakpoint-reload-log') || '[]');
        return log.length > 0 && Date.now() - log[log.length - 1] >= 1200;
      });
      await p.setViewportSize({ width: 767, height: 800 });
      const d2 = await reloaded(p, state, 3);
      const mob = await p.evaluate(s => ({ skin: !!document.querySelector(s), mobile: document.body.classList.contains('mobile-mode'), ox: document.documentElement.scrollWidth - document.documentElement.clientWidth }), sel);
      console.log('  diagnostic ' + tag + ' : ' + JSON.stringify({ d1, desk, d2, mob, guard: await p.evaluate(() => ({ banner: document.querySelector('#kr-resize-banner')?.textContent || '', log: sessionStorage.getItem('kr-breakpoint-reload-log') })) }));
      check(`${tag} : 375 -> 768 recharge (2 documents) et rend le DOM natif sans mise en forme v3`, () => { assert.equal(start, true); assert.equal(d1, 2); assert.equal(desk.skin, false); assert.equal(desk.mobile, false); assert.ok(desk.ox <= 0); });
      check(`${tag} : 768 -> 767 recharge (3 documents) et rend la mise en forme mobile v3`, () => { assert.equal(d2, 3); assert.equal(mob.skin, true); assert.equal(mob.mobile, true); assert.ok(mob.ox <= 0); });
      await context.close();
    }
  }
  // Reproduit de façon déterministe la cause des anciens FAIL : Date figée, timers réels (anti-rebond inchangé),
  // retour au seuil avant les 1200 ms autorisées. Le script doit conserver son garde-fou, pas recharger en boucle.
  for (const kind of ['sujet', 'repondre']) {
    const { context, page: p, state } = await open({ width: 375, kind });
    const fixed = await p.evaluate(() => Date.now());
    await p.clock.setFixedTime(new Date(fixed));
    await p.setViewportSize({ width: 768, height: 800 });
    await reloaded(p, state, 2);
    await p.clock.setFixedTime(new Date(fixed + 400));
    await p.setViewportSize({ width: 767, height: 800 });
    const guard = await probeQuiet(() => p.evaluate(() => ({
      mobile: document.body.classList.contains('mobile-mode'), banner: document.querySelector('#kr-resize-banner')?.textContent || '',
      doc: performance.timeOrigin, ready: document.readyState
    })), { quietMs: 1800, label: 'retour rapide avec garde-fou' });
    check(`transition rapide ${kind} : garde-fou 1200 ms respecté (2 documents, bandeau, mode chargé conservé)`, () => {
      assert.equal(state.documents, 2); assert.equal(guard.mobile, false); assert.ok(guard.banner.includes('quand vous le souhaitez'));
    });
    await p.clock.setFixedTime(new Date(fixed + 1200));
    await p.setViewportSize({ width: 766, height: 800 });
    const docs = await reloaded(p, state, 3);
    const restored = await p.evaluate(() => ({ mobile: document.body.classList.contains('mobile-mode'), banner: !!document.querySelector('#kr-resize-banner') }));
    check(`transition rapide ${kind} : nouveau resize après 1200 ms autorisé (3 documents, mode mobile, bandeau retiré)`, () => {
      assert.equal(docs, 3); assert.equal(restored.mobile, true); assert.equal(restored.banner, false);
    });
    await context.close();
  }
}

// ---------- bureau représentatif (1280) : natif intact ----------
if (frag('bureau')) {
  console.log('Bureau 1280 px : DOM et actions natifs intacts');
  for (const variant of [DARK, LIGHT]) {
    for (const kind of ['sujet', 'repondre', 'editer']) {
      const { context, page: p, state } = await open({ width: 1280, kind, variant, height: 900 });
      const r = await p.evaluate(() => ({ added: document.querySelectorAll('.kr-msg, .kr-msg-more, .kr-msg-secondary, .kr-tools-ready, .kr-tools-plus, .kr-tool-extra, .kr-tools-break, .kr-sender-row').length, mobile: document.body.classList.contains('mobile-mode'), ox: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
      const vis = await p.evaluate(() => { const v = e => { if (!e) { return null; } const box = e.getBoundingClientRect(); return box.width > 0 && box.height > 0; }; return { citer: v(document.querySelector('a[href*="forum/post/repondre-3-"]')), votes: v(document.querySelector('a[href^="javascript:updateAjax"]')), tools: document.querySelectorAll('.btn-toolbar a.btn').length ? Array.from(document.querySelectorAll('.btn-toolbar > .btn-group > a.btn')).every(v) : null }; });
      check(`bureau 1280 px ${kind} ${VARIANT_NAME(variant)} : aucune classe ni élément de la v3, pas de mode mobile, pas de débordement, actions natives visibles`, () => {
        assert.equal(r.added, 0); assert.equal(r.mobile, false); assert.ok(r.ox <= 0, `${r.ox}`);
        if (kind === 'sujet') { assert.equal(vis.citer, true); assert.equal(vis.votes, true); } else { assert.equal(vis.tools, true); }
      });
      check(`bureau 1280 px ${kind} ${VARIANT_NAME(variant)} : aucune action déclenchée`, () => assert.equal((state.other.length), 0));
      if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, `bureau-${kind}-${variant}-1280.png`) }); }
      await context.close();
    }
  }
}

// ---------- contrastes (>= 4,5:1) : 16 thèmes ----------
if (frag('themes')) {
  console.log('Contrastes AA des commandes v3 sur les 16 thèmes (Répondre, •••, Plus, bouton de validation)');
  const THEMES = ['kraland', 'empire-brun', 'paladium', 'theocratie-seelienne', 'paradigme-vert', 'khanat-elmerien', 'confederation-libre', 'royaume-ruthvenie',
    'kraland-dark', 'empire-brun-dark', 'paladium-dark', 'theocratie-seelienne-dark', 'paradigme-vert-dark', 'khanat-elmerien-dark', 'confederation-libre-dark', 'royaume-ruthvenie-dark'];
  const COLORS_OF = sel => { const e = document.querySelector(sel); const cs = getComputedStyle(e); let bg = cs.backgroundColor; let n = e; while (parseFloat((bg.match(/[\d.]+/g) || [0, 0, 0, 1])[3] ?? 1) === 0 && n.parentElement) { n = n.parentElement; bg = getComputedStyle(n).backgroundColor; } return { color: cs.color, bg }; };
  for (const variant of THEMES) {
    const a = await open({ width: 375, kind: 'sujet', variant });
    const reading = {};
    for (const [k, sel] of [['Répondre', 'li.media a[href*="forum/post/repondre-3-"]'], ['pouce haut', 'li.media a[href^="javascript:updateAjax"]'], ['•••', 'li.media button.kr-msg-more'], ['nom', 'li.media .user-info strong a'], ['date', 'li.media .media-body > .btn-group > span']]) { reading[k] = await a.page.evaluate(COLORS_OF, sel); }
    await a.page.evaluate(() => document.querySelector('li.media button.kr-msg-more')?.click());
    reading['Profil (menu •••)'] = await a.page.evaluate(COLORS_OF, 'li.media .kr-msg-secondary');
    await a.context.close();
    const b = await open({ width: 375, kind: 'repondre', variant });
    const ed = {};
    for (const [k, sel] of [['Plus', '.btn-toolbar button.kr-tools-plus'], ['outil gras', '.btn-toolbar a[href="javascript:addtag(\'b\',1);"]'], ['validation', 'form[name="post_msg"] button.btn-primary'], ['libellé expéditeur', 'form[name="post_msg"] .form-group label']]) { ed[k] = await b.page.evaluate(COLORS_OF, sel); }
    await b.context.close();
    check(`thème ${variant} : lecture et rédaction >= 4,5:1`, () => {
      const bad = [];
      for (const [k, v] of Object.entries({ ...reading, ...ed })) { const a2 = parseRgb(v.bg).a; const c = contrast(v.color, v.bg); if (a2 < 1 || c < 4.5) { bad.push(`${k} ${c.toFixed(2)} (${v.color} / ${v.bg})`); } }
      assert.equal(bad.length, 0, bad.join(' ; '));
    });
  }
}

await browser.close();
console.log(failures ? `\n${failures} échec(s)` : '\nTous les contrôles passent');
process.exit(failures ? 1 : 0);
