// Notifications (/report) : ligne non lue lisible (piste O-A de l'analyse UX t_977217b9, décisions d'Arnaud du 18/10/2026).
// Le serveur marque une entrée non lue par la classe bg-info sur son <tr> ; la règle générique du skin (.bg-info : fond --kr-primary,
// texte blanc) rendait illisibles les couleurs serveur (<font color>, bilans .mini.text-muted). Critères d'acceptation de O-A vérifiés :
//   C1 l'état non lu passe par la marque de gauche (filet de 4 px, contraste ≥ 3:1 contre le fond), SANS mot visible : seconde décision
//      d'Arnaud, « Dans notification pas besoin du tag non lu. Juste la marque à gauche. » ;
//   B  le filet a la couleur du non lu du forum (jeton --kr-status-unread), pas celle du texte (analyse UX t_e03578b0, option B) ;
//   N  sur ordinateur, la cellule de la date est teintée à 14 % de cette couleur (analyse UX t_ad11efd0, option N, « Go pour n ») : texte
//      de la date ≥ 9,6:1 sur la teinte, sans couleur ni graisse ajoutées ; sur mobile, la date n'est plus une colonne et n'est pas teintée
//      (ticket 8.1) ; sur les deux, date sur une ligne et hauteur des lignes inchangée par la marque ;
//   L  ligne de notification (ticket 8.1, H14.1, H14.2) : dates en 13 px (--kr-font-detail), texte en 14 px sur ordinateur (--kr-font-body)
//      et 15 px sur mobile (--kr-font-body-mobile) ; sur ordinateur, colonne de date de 100 px conservée ; sur mobile, date au-dessus du
//      texte, texte sur toute la largeur de la ligne, filet sur la ligne tr.bg-info entière (toute sa hauteur) et plus sur la cellule ;
//   C2 sur une ligne non lue, chaque texte du serveur (texte simple, lien, 5 couleurs serveur, bilan gris, 2e cellule) est contrasté
//      exactement comme le même texte sur une ligne normale, dans les 16 variantes ;
//   C3 la marque reste distincte de la page active de la pagination et du bandeau du sélecteur de personnage ;
//   C4 la règle est limitée à /report : un autre .bg-info (paragraphe sur /report, même tableau sur une autre page) garde la règle générique ;
//   C5 aucune dépendance au nombre de lignes, à leur position ni à la structure : ligne isolée au milieu, ligne à cellule unique.
// Page = FIXTURE SYNTHÉTIQUE (tests/e2e/fixtures/report-non-lu.html), aucune donnée réelle ; vrai Bootstrap 3.3.7 (tests/e2e/vendor, identique
// octet pour octet au bootstrap1.min.css du site). Confinement réseau (lib/confinement.mjs) ; aucun clic, aucune navigation.
//
// Usage : npm run build && npm run test:zone -- report
// Largeurs : mobile 375 × 667 et 767 px ; ordinateur 768, 769, popup de la cloche 900 × 800 (rendu ordinateur, R5), 1280, 1440 et 1920 px ;
// bascule 767 ↔ 768 dans le même onglet, dans les deux sens (rechargement de bascule attendu) ; haut de page (8.3) : sélecteur à 16 px du haut.
// Options : KR_SCRIPT (bundle testé), KR_SHOTS=/dossier (captures hors dépôt), KR_FRAG = popup, mobile, bureau, bascule, portee, haut (vide = tout).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
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
const LABEL = 'Non lu'; // libellé retiré : son absence visible est vérifiée
const VARIANTES = ['kraland', 'empire-brun', 'paladium', 'theocratie-seelienne', 'paradigme-vert', 'khanat-elmerien', 'confederation-libre',
  'royaume-ruthvenie', 'kraland-dark', 'empire-brun-dark', 'paladium-dark', 'theocratie-seelienne-dark', 'paradigme-vert-dark',
  'khanat-elmerien-dark', 'confederation-libre-dark', 'royaume-ruthvenie-dark'];
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const browser = await launchBrowser();

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

// Mesures dans la page : contrastes WCAG (fond effectif = composition des fonds des ancêtres jusqu'au premier opaque), styles de la marque.
const MESURE = (label) => {
  const lum = (r, g, b) => { const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  // « rgb(r, g, b) », « rgba(r, g, b, a) » ou « color(srgb r g b / a) » (sérialisation de color-mix() par Chrome, composantes 0..1).
  const rgb = s => { const n = (s.match(/[\d.]+/g) || []).map(Number); return s.startsWith('color(srgb') ? [n[0] * 255, n[1] * 255, n[2] * 255, ...n.slice(3)] : n; };
  const opaque = c => c.length === 3 || (c.length === 4 && c[3] > 0);
  const cr = (a, b) => { const la = lum(...a.slice(0, 3)), lb = lum(...b.slice(0, 3)); return +(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(2)); };
  // Fond effectif : composition des fonds semi-transparents des ancêtres (la teinte de la date est à 14 % d'opacité), sur blanc.
  const bgOf = el => {
    const pile = [];
    for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (opaque(c)) { pile.push(c); } if (c.length === 3 || c[3] === 1) { break; } }
    let b = [255, 255, 255];
    for (const c of pile.reverse()) { const a = c.length === 4 ? c[3] : 1; b = [0, 1, 2].map(i => c[i] * a + b[i] * (1 - a)); }
    return b.map(x => Math.round(x));
  };
  const contrast = el => cr(rgb(getComputedStyle(el).color), bgOf(el));
  const rows = [...document.querySelectorAll('table > tbody > tr')];
  const normal = rows[0];
  const unread = rows.filter(r => r.classList.contains('bg-info'));
  const unreadDouble = unread.filter(r => r.cells.length > 1); // lignes « date | texte » (la garde à cellule unique est à part)
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const probe = document.createElement('i'); probe.style.color = 'var(--kr-status-unread)'; document.body.appendChild(probe);
  const accent = rgb(getComputedStyle(probe).color).slice(0, 3); probe.remove();
  // Marque de gauche : box-shadow inset de la première cellule (« rgb(r, g, b) 4px 0px 0px 0px inset »), contraste contre le fond effectif.
  const marque = td => {
    const sh = getComputedStyle(td).boxShadow;
    const m = sh.match(/^(rgba?\([^)]*\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px\s+(-?[\d.]+)px\s+inset$/);
    if (!m) { return { shadow: sh }; }
    const c = rgb(m[1]);
    return { shadow: sh, x: +m[2], y: +m[3], blur: +m[4], spread: +m[5], opaque: c.length === 3 || c[3] === 1, color: c.slice(0, 3).map(Math.round), contrast: cr(c, bgOf(td)) };
  };
  const vide = c => c === 'none' || c === 'normal';
  // Textes comparés : par repère data-t, la valeur la plus faible sur les lignes non lues contre la plus faible sur les lignes normales.
  const kinds = {};
  for (const el of document.querySelectorAll('table [data-t]')) {
    const tr = el.closest('tr');
    const k = el.dataset.t;
    if (!kinds[k]) { kinds[k] = { normal: [], unread: [] }; }
    kinds[k][tr.classList.contains('bg-info') ? 'unread' : 'normal'].push(contrast(el));
  }
  kinds.cellule = { normal: rows.filter(r => !r.classList.contains('bg-info')).map(r => contrast(r.cells[r.cells.length - 1])), unread: unreadDouble.map(r => contrast(r.cells[r.cells.length - 1])) };
  // Cellule de la date (option N) : teinte, contraste, couleur et graisse du texte, nombre de lignes du texte.
  const lignesTexte = td => { const r = document.createRange(); r.selectNodeContents(td); return new Set([...r.getClientRects()].map(x => Math.round(x.top))).size; };
  const cellule = td => { const s = getComputedStyle(td); return { contrast: contrast(td), color: s.color, weight: s.fontWeight, bg: bgOf(td), lignes: lignesTexte(td) }; };
  // Hauteur de chaque ligne non lue, avec puis sans la classe bg-info (même contenu) : la marque ne doit pas changer la mise en page.
  const hauteurs = unread.map(r => { const h = r.getBoundingClientRect().height; r.classList.remove('bg-info'); const h0 = r.getBoundingClientRect().height; r.classList.add('bg-info'); return [h, h0]; });
  const active = document.querySelector('.pagination > li.active > a');
  const banner = document.querySelector('.bg-primary');
  const p = document.querySelector('p.bg-info');
  const sp = getComputedStyle(p);
  return {
    pageReport: document.documentElement.classList.contains('kr-page-report'),
    variant: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')),
    unreadCount: unread.length,
    mobile,
    // Marque : sur la ligne entière en mobile, sur la cellule de la date en ordinateur ; ombres des cellules relevées à part en mobile.
    marques: unread.map(r => marque(mobile ? r : r.cells[0])),
    marquesNormales: rows.filter(r => !r.classList.contains('bg-info')).map(r => marque(mobile ? r : r.cells[0])),
    ombresCellules: mobile ? unread.flatMap(r => [...r.cells].map(td => getComputedStyle(td).boxShadow)) : [],
    // Fond propre des cellules non lues en mobile : transparent, sinon il couvrirait le filet inset posé sur la ligne.
    fondsCellules: mobile ? unread.flatMap(r => [...r.cells].map(td => getComputedStyle(td).backgroundColor)) : [],
    // Ligne de notification (L) : tailles, position de la date et du texte, largeur du texte, filet sur toute la hauteur de la ligne.
    ligne: (() => {
      const box = e => { const r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width }; };
      const doubles = rows.filter(r => r.cells.length > 1);
      return {
        table: box(document.querySelector('table')),
        tailleDates: [...new Set(doubles.map(r => getComputedStyle(r.cells[0]).fontSize))],
        tailleTextes: [...new Set(rows.map(r => getComputedStyle(r.cells[r.cells.length - 1]).fontSize))],
        tailleBilans: [...new Set([...document.querySelectorAll('table > tbody > tr > td .mini.text-muted')].map(e => getComputedStyle(e).fontSize))],
        lignes: doubles.map(r => ({ unread: r.classList.contains('bg-info'), tr: box(r), date: box(r.cells[0]), texte: box(r.cells[1]) })),
        uniques: rows.filter(r => r.cells.length === 1).map(r => ({ tr: box(r), texte: box(r.cells[0]) }))
      };
    })(),
    // Aucun mot visible : ni contenu généré sur les cellules non lues, ni libellé dans le texte rendu, date non repoussée vers le bas.
    contenuGenere: unread.flatMap(r => [...r.cells].flatMap(td => [getComputedStyle(td, '::before').content, getComputedStyle(td, '::after').content])).filter(c => !vide(c)),
    libelleVisible: unread.filter(r => r.innerText.includes(label)).length,
    hauteurDate: (() => {
      // Décalage du texte de la date sous le haut de sa cellule : un mot en bloc au-dessus le repousserait (place visible occupée).
      const off = td => { const t = [...td.childNodes].find(n => n.nodeType === 3 && n.textContent.trim()); const r = document.createRange(); r.selectNodeContents(t); return r.getBoundingClientRect().top - td.getBoundingClientRect().top; };
      return { normal: off(normal.cells[0]), unread: off(unread[0].cells[0]) };
    })(),
    kinds,
    accent: accent.map(Math.round),
    dates: { normal: cellule(normal.cells[0]), unread: unreadDouble.map(r => cellule(r.cells[0])), garde: unread.filter(r => r.cells.length === 1).map(r => cellule(r.cells[0])), page: bgOf(normal.cells[0]) },
    hauteurs,
    fonds: { normal: bgOf(normal.cells[1]).join(','), unread: unreadDouble.map(r => bgOf(r.cells[r.cells.length - 1]).join(',')), active: rgb(getComputedStyle(active).backgroundColor).join(','), banner: rgb(getComputedStyle(banner).backgroundColor).join(',') },
    trUnread: { paire: [getComputedStyle(unread[0]).backgroundColor, getComputedStyle(unread[0]).color].map(c => rgb(c).join(',')), shadow: getComputedStyle(unread[0].cells[0]).boxShadow, trShadow: getComputedStyle(unread[0]).boxShadow, before: getComputedStyle(unread[0].cells[0], '::before').content, tdBg: getComputedStyle(unread[0].cells[0]).backgroundColor },
    primary: (() => { const d = document.createElement('div'); d.style.color = getComputedStyle(document.documentElement).getPropertyValue('--kr-primary').trim(); document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; })(),
    // Paire d'action (épopée 3, ticket 2) : fond et encre de la règle générique .bg-info.
    paire: ['var(--kr-arm-bg, var(--kr-primary))', 'var(--kr-arm-ink, #fff)'].map(e => { const d = document.createElement('div'); d.style.color = e; document.body.appendChild(d); const c = rgb(getComputedStyle(d).color).join(','); d.remove(); return c; }),
    paragraphe: { bg: rgb(sp.backgroundColor).join(','), color: rgb(sp.color).join(','), before: getComputedStyle(p, '::before').content },
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    label
  };
};

async function scenario(variante, viewport, tag) {
  const { context, page, denied } = await open(REPORT, variante, viewport);
  const m = await page.evaluate(MESURE, LABEL);
  m.denied = denied.filter(d => d.url.startsWith(BASE)).map(d => d.url);
  if (SHOTS && ['empire-brun-dark', 'paladium', 'paladium-dark', 'kraland', 'confederation-libre'].includes(variante)) {
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, `report-non-lu-${tag}-${variante}.png`) });
  }
  await context.close();
  return m;
}

const pire = (a) => Math.min(...a);
function verifier(variante, m, tag) {
  check(`${tag} ${variante} : thème appliqué, page marquée kr-page-report, 5 lignes non lues dans la fixture`, () => { assert.equal(m.variant, 'kr-theme-variant-' + variante); assert.equal(m.pageReport, true); assert.equal(m.unreadCount, 5); });
  check(`${tag} ${variante} : C1 marque de gauche sur chaque ligne non lue (filet inset 4 px, opaque, contraste ≥ 3:1), aucune sur les lignes normales`, () => {
    for (const k of m.marques) {
      assert.ok(k.x === 4 && k.y === 0 && k.blur === 0 && k.spread === 0 && k.opaque, JSON.stringify(k));
      assert.ok(k.contrast >= 3, `contraste du filet ${k.contrast}`);
    }
    assert.ok(m.marquesNormales.every(k => k.shadow === 'none'), m.marquesNormales.map(k => k.shadow).join(' | '));
    assert.ok(m.ombresCellules.every(x => x === 'none'), 'filet resté sur une cellule en mobile : ' + m.ombresCellules.join(' | '));
    assert.ok(m.fondsCellules.every(x => x === 'rgba(0, 0, 0, 0)'), 'fond de cellule non lue couvrant le filet en mobile : ' + m.fondsCellules.join(' | '));
  });
  check(`${tag} ${variante} : B filet de la couleur du non lu du forum (--kr-status-unread), pas de la couleur du texte`, () => {
    for (const k of m.marques) { assert.deepEqual(k.color, m.accent, `filet ${k.color} / accent ${m.accent}`); }
  });
  check(`${tag} ${variante} : C1 aucun mot « ${LABEL} » visible (ni contenu généré, ni libellé rendu, date non repoussée)`, () => {
    assert.deepEqual(m.contenuGenere, []);
    assert.equal(m.libelleVisible, 0);
    assert.equal(m.hauteurDate.unread, m.hauteurDate.normal, JSON.stringify(m.hauteurDate));
  });
  check(`${tag} ${variante} : C2 chaque texte du serveur d'une ligne non lue contrasté exactement comme sur une ligne normale`, () => {
    const bad = Object.entries(m.kinds).filter(([, v]) => v.normal.length && v.unread.length && pire(v.unread) !== pire(v.normal)).map(([k, v]) => `${k} ${pire(v.unread)} ≠ ${pire(v.normal)}`);
    assert.equal(Object.values(m.kinds).filter(v => v.normal.length && v.unread.length).length, 9, 'repères comparés : ' + Object.keys(m.kinds).join(' '));
    assert.deepEqual(bad, []);
    for (const f of m.fonds.unread) { assert.equal(f, m.fonds.normal, `fond du texte non lu ${f} / normal ${m.fonds.normal}`); }
  });
  check(`${tag} ${variante} : N ${m.mobile ? 'date sans teinte (plus de colonne)' : 'cellule de date teintée à 14 % du non lu'}, texte de la date ≥ 9,6:1, ni couleur ni graisse ajoutées`, () => {
    const attendu = m.mobile ? m.dates.page : m.accent.map((a, i) => a * 0.14 + m.dates.page[i] * 0.86);
    for (const d of [...m.dates.unread, ...m.dates.garde]) {
      assert.ok(d.bg.every((x, i) => Math.abs(x - attendu[i]) <= 1), `teinte ${d.bg} / attendu ${attendu.map(Math.round)}`);
      assert.ok(d.contrast >= 9.6, `contraste de la date sur la teinte ${d.contrast}`);
      assert.equal(d.color, m.dates.normal.color, 'couleur du texte de la date');
      assert.equal(d.weight, m.dates.normal.weight, 'graisse de la date');
    }
    assert.equal(m.dates.unread.length, 4);
    assert.equal(m.dates.garde.length, 1);
    assert.deepEqual(m.dates.normal.bg, m.dates.page, 'date normale sans teinte');
  });
  check(`${tag} ${variante} : N hauteur de chaque ligne non lue inchangée par la marque, date sur une seule ligne`, () => {
    for (const [h, h0] of m.hauteurs) { assert.equal(h, h0, `hauteur ${h} au lieu de ${h0}`); }
    for (const d of m.dates.unread) { assert.equal(d.lignes, 1, 'date sur ' + d.lignes + ' lignes'); }
  });
  const L = m.mobile ? 'date au-dessus du texte, texte sur toute la largeur, filet sur toute la hauteur de la ligne' : 'colonne de date de 100 px conservée, date à gauche du texte';
  check(`${tag} ${variante} : L dates en 13 px, texte en ${m.mobile ? '15 px, bilan en 13' : 14} px, ${L}`, () => {
    assert.deepEqual(m.ligne.tailleDates, ['13px'], 'taille des dates');
    assert.deepEqual(m.ligne.tailleTextes, [m.mobile ? '15px' : '14px'], 'taille du texte');
    for (const l of m.ligne.lignes) {
      if (m.mobile) {
        assert.ok(l.date.bottom <= l.texte.top + 0.5, `bas de la date ${l.date.bottom} sous le haut du texte ${l.texte.top}`);
        assert.ok(Math.abs(l.texte.width - l.tr.width) <= 0.5 && Math.abs(l.tr.width - m.ligne.table.width) <= 0.5, `texte ${l.texte.width} / ligne ${l.tr.width} / tableau ${m.ligne.table.width}`);
        assert.ok(l.tr.top <= l.date.top + 0.5 && l.tr.bottom >= l.texte.bottom - 0.5, `ligne ${l.tr.top}-${l.tr.bottom} hors date ${l.date.top} et texte ${l.texte.bottom}`);
      } else {
        assert.equal(Math.round(l.date.width), 100, 'largeur de la colonne de date');
        assert.ok(Math.abs(l.date.top - l.texte.top) <= 0.5 && l.date.right <= l.texte.left + 0.5, 'date à gauche du texte, sur la même ligne');
      }
    }
    if (m.mobile) { assert.deepEqual(m.ligne.tailleBilans, ['13px'], 'taille du bilan .mini.text-muted (détail, 13 px)'); }
    if (m.mobile) { for (const u of m.ligne.uniques) { assert.ok(Math.abs(u.texte.width - u.tr.width) <= 0.5, `cellule unique ${u.texte.width} / ligne ${u.tr.width}`); } }
  });
  check(`${tag} ${variante} : C3 marque distincte de la page active de la pagination et du bandeau du sélecteur`, () => {
    for (const f of m.fonds.unread) { assert.notEqual(f, m.fonds.active, `fond non lu = page active (${f})`); assert.notEqual(f, m.fonds.banner, `fond non lu = bandeau (${f})`); }
  });
  // Écart accepté et consigné (épopée 3, ticket 2) : la règle générique passe à la paire d'action (fond --kr-arm-bg, encre --kr-arm-ink).
  check(`${tag} ${variante} : C4 le paragraphe .bg-info de /report garde la règle générique (paire d'action, comme le bandeau, sans mot)`, () => {
    assert.equal(m.paragraphe.bg, m.fonds.banner);
    assert.deepEqual([m.paragraphe.bg, m.paragraphe.color], m.paire);
    assert.ok(m.paragraphe.before === 'none' || m.paragraphe.before === 'normal', m.paragraphe.before);
  });
  check(`${tag} ${variante} : C5 ligne isolée au milieu et ligne à cellule unique marquées comme les autres`, () => {
    assert.equal(m.marques.length, 5);
    for (const i of [3, 4]) { assert.ok(m.marques[i].x === 4 && m.marques[i].contrast >= 3, JSON.stringify(m.marques[i])); }
    assert.equal(new Set(m.fonds.unread).size, 1, m.fonds.unread.join(' | '));
  });
  check(`${tag} ${variante} : pas de débordement horizontal, aucune requête vers le site hors fixture`, () => { assert.equal(m.overflowX, 0); assert.deepEqual(m.denied, []); });
}

const DEUX = ['kraland', 'empire-brun-dark']; // Kraland clair et Empire Brun sombre : largeurs secondaires et bascule
const tagOf = vp => vp.height === 667 || vp.height === 720 ? String(vp.width) : `${vp.width}x${vp.height}`;
async function lot(titre, cas) {
  console.log(titre);
  const res = await mapLimit(cas, c => scenario(c.variante, c.viewport, tagOf(c.viewport)));
  cas.forEach((c, i) => verifier(c.variante, res[i], tagOf(c.viewport)));
}
const croise = (viewports, variantes) => viewports.flatMap(viewport => variantes.map(variante => ({ viewport, variante })));

if (on('popup')) {
  await lot('Popup de la cloche (900 × 800, rendu ordinateur), 16 variantes', croise([{ width: 900, height: 800 }], VARIANTES));
}

if (on('mobile')) {
  await lot('Mobile (375 × 667 et 767 px), 16 variantes', croise([{ width: 375, height: 667 }, { width: 767, height: 667 }], VARIANTES));
}

if (on('bureau')) {
  await lot('Onglet large (1280 × 720), 16 variantes', croise([{ width: 1280, height: 720 }], VARIANTES));
  await lot('Ordinateur (768, 769, 1440 et 1920 px), Kraland clair et Empire Brun sombre',
    croise([{ width: 768, height: 667 }, { width: 769, height: 667 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }], DEUX));
}

// Bascule 767 ↔ 768 dans le même onglet, dans les deux sens : le rechargement de bascule est attendu comme dans cartes-pastilles.mjs.
async function bascule(variante, largeurs) {
  const { context, page, denied } = await open(REPORT, variante, { width: largeurs[0], height: 667 });
  const etapes = [];
  const recharges = [];
  for (let i = 0; i < largeurs.length; i += 1) {
    if (i > 0) {
      await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = page.waitForEvent('load', { timeout: 8000 }).then(() => true, () => false);
      await page.setViewportSize({ width: largeurs[i], height: 667 });
      recharges.push(await charge);
      await krReady(page, { ready: THEME_READY, label: `bascule ${variante} ${largeurs[i]} px` });
    }
    const m = await page.evaluate(MESURE, LABEL);
    m.denied = denied.filter(d => d.url.startsWith(BASE)).map(d => d.url);
    etapes.push(m);
  }
  await context.close();
  return { etapes, recharges };
}
if (on('bascule')) {
  console.log('Bascule 767 ↔ 768 dans le même onglet, deux sens, Kraland clair et Empire Brun sombre');
  const cas = DEUX.flatMap(variante => [[767, 768, 767], [768, 767, 768]].map(largeurs => ({ variante, largeurs })));
  const res = await mapLimit(cas, c => bascule(c.variante, c.largeurs));
  cas.forEach((c, i) => {
    const t = `bascule ${c.largeurs.join('>')}`;
    check(`${t} ${c.variante} : rechargement de bascule à chaque passage du seuil`, () => assert.deepEqual(res[i].recharges, c.largeurs.slice(1).map(() => true), 'load observé : ' + res[i].recharges.join(', ')));
    res[i].etapes.forEach((m, j) => verifier(c.variante, m, `${t} étape ${j + 1} (${c.largeurs[j]})`));
  });
}

if (on('portee')) {
  console.log('C4 portée : le même tableau hors /report garde la règle générique (375 × 667 et 900 × 800)');
  for (const viewport of [{ width: 375, height: 667 }, { width: 900, height: 800 }]) {
    for (const v of ['empire-brun-dark', 'kraland']) {
      const { context, page } = await open(AUTRE, v, viewport);
      const m = await page.evaluate(MESURE, LABEL);
      await context.close();
      const t = `${tagOf(viewport)} ${v}`;
      check(`${t} : hors /report, html sans kr-page-report`, () => assert.equal(m.pageReport, false));
      check(`${t} : hors /report, tr.bg-info inchangé (règle générique : paire d'action, ni mot ni filet)`, () => {
        assert.deepEqual(m.trUnread.paire, m.paire);
        assert.ok(m.trUnread.before === 'none' || m.trUnread.before === 'normal', m.trUnread.before);
        assert.equal(m.trUnread.shadow, 'none');
        assert.equal(m.trUnread.trShadow, 'none', 'filet sur la ligne hors /report');
        assert.equal(m.trUnread.tdBg, 'rgba(0, 0, 0, 0)', 'cellule de date sans teinte hors /report');
      });
      check(`${t} : hors /report, date à côté du texte hors /report, tailles génériques (${viewport.width < 768 ? '13 px mobile' : '14 px'})`, () => {
        const px = viewport.width < 768 ? '13px' : '14px';
        assert.deepEqual(m.ligne.tailleDates, [px]);
        assert.deepEqual(m.ligne.tailleTextes, [px]);
        for (const l of m.ligne.lignes) { assert.ok(Math.abs(l.date.top - l.texte.top) <= 0.5, 'date au-dessus du texte hors /report'); }
      });
    }
  }
}

// Haut de page (ticket 8.3, H14.3) : /report n'a pas de barre de navigation ; le bandeau du sélecteur de personnage (.bg-primary, marge en
// ligne native de 10 px) commence à --kr-space-4 (16 px, ± 1) du haut du document, par compensation du padding-top du body (aucun !important).
// Hors /report (C4), le padding-top du body reste celui de la base (60 px, place de la barre fixe).
const HAUT = () => {
  const banner = document.querySelector('.bg-primary');
  return {
    pageReport: document.documentElement.classList.contains('kr-page-report'),
    variant: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')),
    haut: banner.getBoundingClientRect().top + window.scrollY,
    marge: getComputedStyle(banner).marginTop,
    paddingBody: getComputedStyle(document.body).paddingTop,
    mobile: document.body.classList.contains('mobile-mode'),
    largeur: window.innerWidth
  };
};
function verifierHaut(variante, m, tag) {
  check(`${tag} ${variante} : haut du bandeau du sélecteur à 16 px (± 1) du haut du document, marge en ligne de 10 px conservée, ${m.largeur < 768 ? 'body.mobile-mode' : 'sans body.mobile-mode'}`, () => {
    assert.equal(m.variant, 'kr-theme-variant-' + variante);
    assert.equal(m.pageReport, true);
    assert.equal(m.mobile, m.largeur < 768, `body.mobile-mode ${m.mobile} à ${m.largeur} px`);
    assert.ok(Math.abs(m.haut - 16) <= 1, `haut du bandeau ${m.haut} px (padding-top du body ${m.paddingBody}, marge ${m.marge})`);
    assert.equal(m.marge, '10px', 'marge en ligne du bandeau');
  });
}
if (on('haut')) {
  console.log('Haut de page : sélecteur à 16 px (375 × 667, 767, 768, 769, 900 × 800, 1280, 1440, 1920), Kraland clair et Empire Brun sombre');
  const cas = croise([{ width: 375, height: 667 }, { width: 767, height: 667 }, { width: 768, height: 667 }, { width: 769, height: 667 },
    { width: 900, height: 800 }, { width: 1280, height: 720 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }], DEUX);
  const res = await mapLimit(cas, async c => { const { context, page } = await open(REPORT, c.variante, c.viewport); const m = await page.evaluate(HAUT); await context.close(); return m; });
  cas.forEach((c, i) => verifierHaut(c.variante, res[i], tagOf(c.viewport)));
  const bas = DEUX.flatMap(variante => [[767, 768, 767], [768, 767, 768]].map(largeurs => ({ variante, largeurs })));
  const resB = await mapLimit(bas, async c => {
    const { context, page } = await open(REPORT, c.variante, { width: c.largeurs[0], height: 667 });
    const etapes = [await page.evaluate(HAUT)];
    const recharges = [];
    for (const w of c.largeurs.slice(1)) {
      await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = page.waitForEvent('load', { timeout: 8000 }).then(() => true, () => false);
      await page.setViewportSize({ width: w, height: 667 });
      recharges.push(await charge);
      await krReady(page, { ready: THEME_READY, label: `haut bascule ${c.variante} ${w} px` });
      etapes.push(await page.evaluate(HAUT));
    }
    await context.close();
    return { etapes, recharges };
  });
  bas.forEach((c, i) => {
    const t = `haut bascule ${c.largeurs.join('>')}`;
    check(`${t} ${c.variante} : rechargement de bascule à chaque passage du seuil`, () => assert.deepEqual(resB[i].recharges, [true, true], 'load observé : ' + resB[i].recharges.join(', ')));
    resB[i].etapes.forEach((m, j) => verifierHaut(c.variante, m, `${t} étape ${j + 1} (${c.largeurs[j]})`));
  });
  for (const viewport of [{ width: 375, height: 667 }, { width: 768, height: 667 }, { width: 900, height: 800 }, { width: 1280, height: 720 }]) {
    for (const v of DEUX) {
      const { context, page } = await open(AUTRE, v, viewport);
      const m = await page.evaluate(HAUT);
      await context.close();
      check(`${tagOf(viewport)} ${v} : hors /report, padding-top du body à 60 px (valeur relevée sur la base 5f5d299)`, () => { assert.equal(m.pageReport, false); assert.equal(m.paddingBody, '60px'); });
    }
  }
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
