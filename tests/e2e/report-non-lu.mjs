// Notifications (/report) : ligne non lue lisible (piste O-A de l'analyse UX t_977217b9, décision d'Arnaud du 18/10/2026).
// Le serveur marque une entrée non lue par la classe bg-info sur son <tr> ; la règle générique du skin (.bg-info : fond --kr-primary,
// texte blanc) rendait illisibles les couleurs serveur (<font color>, bilans .mini.text-muted). Critères d'acceptation de O-A vérifiés :
//   C1 l'état non lu ne repose pas sur la couleur seule : mot visible « Non lu », exposé aux lecteurs d'écran (arbre d'accessibilité) ;
//   C2 sur une ligne non lue, chaque texte (date, texte simple, lien, 5 couleurs serveur, bilan gris) est au moins aussi contrasté que le
//      même texte sur une ligne normale, dans les 16 variantes ;
//   C3 la marque reste distincte de la page active de la pagination et du bandeau du sélecteur de personnage ;
//   C4 la règle est limitée à /report : un autre .bg-info (paragraphe sur /report, même tableau sur une autre page) garde la règle générique ;
//   C5 aucune dépendance au nombre de lignes, à leur position ni à la structure : ligne isolée au milieu, ligne à cellule unique.
// Page = FIXTURE SYNTHÉTIQUE (tests/e2e/fixtures/report-non-lu.html), aucune donnée réelle ; vrai Bootstrap 3.3.7 (tests/e2e/vendor, identique
// octet pour octet au bootstrap1.min.css du site). Confinement réseau (lib/confinement.mjs) ; aucun clic, aucune navigation.
//
// Usage : npm run build && npm run test:zone -- report
// Options : KR_SCRIPT (bundle testé), KR_SHOTS=/dossier (captures hors dépôt), KR_FRAG = fenetre, bureau, portee (vide = tout).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, THEME_READY } from './lib/settle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const html = fs.readFileSync(path.join(here, 'fixtures/report-non-lu.html'), 'utf8');
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const SHOTS = process.env.KR_SHOTS || '';
const BASE = 'http://www.kraland.org';
const REPORT = BASE + '/report/perso-000000';
const AUTRE = BASE + '/jouer/evenements'; // même DOM servi hors /report (C4)
const LABEL = 'Non lu';
const VARIANTES = ['kraland', 'empire-brun', 'paladium', 'theocratie-seelienne', 'paradigme-vert', 'khanat-elmerien', 'confederation-libre',
  'royaume-ruthvenie', 'kraland-dark', 'empire-brun-dark', 'paladium-dark', 'theocratie-seelienne-dark', 'paradigme-vert-dark',
  'khanat-elmerien-dark', 'confederation-libre-dark', 'royaume-ruthvenie-dark'];
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const browser = await chromium.launch({ headless: true });

async function open(url, variante, viewport) {
  const context = await browser.newContext({ viewport });
  const denied = await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route(url, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/css/bootstrap1.min.css', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.css'), contentType: 'text/css' }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/js/bootstrap.min.js', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.js'), contentType: 'application/javascript' }));
  await context.route(BASE + '/lib/jquery-3.3.1/jquery-3.3.1.min.js', route => route.fulfill({ path: path.join(VENDOR, 'jquery.min.js'), contentType: 'application/javascript' }));
  await context.addInitScript(({ src, v }) => {
    window.GM = { xmlHttpRequest: () => {} };
    localStorage.setItem('kr-theme-enabled', 'true');
    localStorage.setItem('kr-theme-variant', v);
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { src: userscript, v: variante });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await krReady(page, { ready: THEME_READY, label: `${variante} ${url}` });
  return { context, page, denied };
}

// Mesures dans la page : contrastes WCAG (fond effectif = premier ancêtre au fond non transparent), styles de la marque.
const MESURE = (label) => {
  const lum = (r, g, b) => { const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
  const opaque = c => c.length === 3 || (c.length === 4 && c[3] > 0);
  const cr = (a, b) => { const la = lum(...a.slice(0, 3)), lb = lum(...b.slice(0, 3)); return +(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(2)); };
  const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (opaque(c)) { return c; } } return [255, 255, 255]; };
  const contrast = el => cr(rgb(getComputedStyle(el).color), bgOf(el));
  const rows = [...document.querySelectorAll('table > tbody > tr')];
  const normal = rows[0];
  const unread = rows.filter(r => r.classList.contains('bg-info'));
  const marque = td => {
    const b = getComputedStyle(td, '::before');
    return { content: b.content, display: b.display, visibility: b.visibility, opacity: b.opacity, fontSize: parseFloat(b.fontSize),
      contrast: cr(rgb(b.color), opaque(rgb(b.backgroundColor)) ? rgb(b.backgroundColor) : bgOf(td)) };
  };
  // Textes comparés : par repère data-t, la valeur la plus faible sur les lignes non lues contre la plus faible sur les lignes normales.
  const kinds = {};
  for (const el of document.querySelectorAll('table [data-t]')) {
    const tr = el.closest('tr');
    const k = el.dataset.t;
    if (!kinds[k]) { kinds[k] = { normal: [], unread: [] }; }
    kinds[k][tr.classList.contains('bg-info') ? 'unread' : 'normal'].push(contrast(el));
  }
  kinds.date = { normal: rows.filter(r => !r.classList.contains('bg-info') && r.cells.length > 1).map(r => contrast(r.cells[0])), unread: unread.filter(r => r.cells.length > 1).map(r => contrast(r.cells[0])) };
  kinds.cellule = { normal: rows.filter(r => !r.classList.contains('bg-info')).map(r => contrast(r.cells[r.cells.length - 1])), unread: unread.map(r => contrast(r.cells[r.cells.length - 1])) };
  const active = document.querySelector('.pagination > li.active > a');
  const banner = document.querySelector('.bg-primary');
  const p = document.querySelector('p.bg-info');
  const sp = getComputedStyle(p);
  return {
    pageReport: document.documentElement.classList.contains('kr-page-report'),
    variant: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')),
    unreadCount: unread.length,
    marques: unread.map(r => marque(r.cells[0])),
    marquesNormales: rows.filter(r => !r.classList.contains('bg-info')).map(r => getComputedStyle(r.cells[0], '::before').content),
    hauteurDate: (() => {
      // Décalage du texte de la date sous le haut de sa cellule : le mot, en bloc au-dessus, le repousse (il occupe de la place visible).
      const off = td => { const t = [...td.childNodes].find(n => n.nodeType === 3 && n.textContent.trim()); const r = document.createRange(); r.selectNodeContents(t); return r.getBoundingClientRect().top - td.getBoundingClientRect().top; };
      return { normal: off(normal.cells[0]), unread: off(unread[0].cells[0]) };
    })(),
    kinds,
    fonds: { normal: bgOf(normal.cells[1]).join(','), unread: unread.map(r => bgOf(r.cells[r.cells.length - 1]).join(',')), active: rgb(getComputedStyle(active).backgroundColor).join(','), banner: rgb(getComputedStyle(banner).backgroundColor).join(',') },
    trUnread: { bg: getComputedStyle(unread[0]).backgroundColor, color: getComputedStyle(unread[0]).color, shadow: getComputedStyle(unread[0].cells[0]).boxShadow, before: getComputedStyle(unread[0].cells[0], '::before').content },
    primary: (() => { const d = document.createElement('div'); d.style.color = getComputedStyle(document.documentElement).getPropertyValue('--kr-primary').trim(); document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; })(),
    paragraphe: { bg: rgb(sp.backgroundColor).join(','), color: rgb(sp.color).join(','), before: getComputedStyle(p, '::before').content },
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    label
  };
};

// Libellés « Non lu » exposés dans l'arbre d'accessibilité (contenu généré compris), comptés par ligne du tableau.
async function axLabels(page) {
  const cdp = await page.context().newCDPSession(page);
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  await cdp.detach();
  return nodes.filter(n => !n.ignored && n.role && n.role.value === 'StaticText' && n.name && n.name.value === LABEL).length;
}

async function scenario(variante, viewport, tag) {
  const { context, page, denied } = await open(REPORT, variante, viewport);
  const m = await page.evaluate(MESURE, LABEL);
  m.ax = await axLabels(page);
  m.denied = denied.filter(d => d.url.startsWith(BASE)).map(d => d.url);
  if (SHOTS && ['empire-brun-dark', 'paladium', 'paladium-dark', 'kraland'].includes(variante)) {
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, `report-non-lu-${tag}-${variante}.png`) });
  }
  await context.close();
  return m;
}

const pire = (a) => Math.min(...a);
function verifier(variante, m, tag) {
  check(`${tag} ${variante} : thème appliqué, page marquée kr-page-report, 5 lignes non lues dans la fixture`, () => { assert.equal(m.variant, 'kr-theme-variant-' + variante); assert.equal(m.pageReport, true); assert.equal(m.unreadCount, 5); });
  check(`${tag} ${variante} : C1 mot « ${LABEL} » visible sur chaque ligne non lue (≥ 11 px, contraste ≥ 4,5:1), aucun sur les lignes normales`, () => {
    for (const k of m.marques) {
      assert.equal(k.content, `"${LABEL}"`, JSON.stringify(k));
      assert.ok(k.display !== 'none' && k.visibility === 'visible' && Number(k.opacity) === 1 && k.fontSize >= 11, JSON.stringify(k));
      assert.ok(k.contrast >= 4.5, `contraste du mot ${k.contrast}`);
    }
    assert.ok(m.marquesNormales.every(c => c === 'none' || c === 'normal'), m.marquesNormales.join(' '));
    assert.ok(m.hauteurDate.unread > m.hauteurDate.normal, `le mot occupe de la place : ${JSON.stringify(m.hauteurDate)}`);
  });
  check(`${tag} ${variante} : C1 équivalent lecteur d'écran : « ${LABEL} » dans l'arbre d'accessibilité, une fois par ligne non lue`, () => assert.equal(m.ax, m.unreadCount));
  check(`${tag} ${variante} : C2 chaque texte d'une ligne non lue au moins aussi contrasté que sur une ligne normale`, () => {
    const bad = Object.entries(m.kinds).filter(([, v]) => v.normal.length && v.unread.length && pire(v.unread) < pire(v.normal)).map(([k, v]) => `${k} ${pire(v.unread)} < ${pire(v.normal)}`);
    assert.equal(Object.values(m.kinds).filter(v => v.normal.length && v.unread.length).length, 10, 'repères comparés : ' + Object.keys(m.kinds).join(' '));
    assert.deepEqual(bad, []);
  });
  check(`${tag} ${variante} : C3 marque distincte de la page active de la pagination et du bandeau du sélecteur`, () => {
    for (const f of m.fonds.unread) { assert.notEqual(f, m.fonds.active, `fond non lu = page active (${f})`); assert.notEqual(f, m.fonds.banner, `fond non lu = bandeau (${f})`); }
  });
  check(`${tag} ${variante} : C4 le paragraphe .bg-info de /report garde la règle générique (fond --kr-primary, sans mot)`, () => {
    assert.equal(m.paragraphe.bg, m.fonds.banner);
    assert.equal(m.paragraphe.color, '255,255,255');
    assert.ok(m.paragraphe.before === 'none' || m.paragraphe.before === 'normal', m.paragraphe.before);
  });
  check(`${tag} ${variante} : C5 ligne isolée au milieu et ligne à cellule unique marquées comme les autres`, () => {
    assert.equal(m.marques.length, 5);
    assert.equal(m.marques[3].content, `"${LABEL}"`);
    assert.equal(m.marques[4].content, `"${LABEL}"`);
    assert.equal(new Set(m.fonds.unread).size, 1, m.fonds.unread.join(' | '));
  });
  check(`${tag} ${variante} : pas de débordement horizontal, aucune requête vers le site hors fixture`, () => { assert.equal(m.overflowX, 0); assert.deepEqual(m.denied, []); });
}

if (on('fenetre')) {
  console.log('Fenêtre de la cloche (600 × 600), 16 variantes');
  const res = await mapLimit(VARIANTES, v => scenario(v, { width: 600, height: 600 }, '600'));
  VARIANTES.forEach((v, i) => verifier(v, res[i], '600'));
}

if (on('bureau')) {
  console.log('Onglet large (1280 × 720), 16 variantes');
  const res = await mapLimit(VARIANTES, v => scenario(v, { width: 1280, height: 720 }, '1280'));
  VARIANTES.forEach((v, i) => verifier(v, res[i], '1280'));
}

if (on('portee')) {
  console.log('C4 portée : le même tableau hors /report garde la règle générique');
  for (const v of ['empire-brun-dark', 'kraland']) {
    const { context, page } = await open(AUTRE, v, { width: 600, height: 600 });
    const m = await page.evaluate(MESURE, LABEL);
    await context.close();
    check(`${v} : hors /report, html sans kr-page-report`, () => assert.equal(m.pageReport, false));
    check(`${v} : hors /report, tr.bg-info inchangé (fond --kr-primary, texte blanc, ni mot ni filet)`, () => {
      assert.equal(m.trUnread.bg, m.primary);
      assert.equal(m.trUnread.color, 'rgb(255, 255, 255)');
      assert.ok(m.trUnread.before === 'none' || m.trUnread.before === 'normal', m.trUnread.before);
      assert.equal(m.trUnread.shadow, 'none');
    });
  }
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
