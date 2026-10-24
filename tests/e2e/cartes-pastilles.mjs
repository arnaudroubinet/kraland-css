// Cartes et pastilles (épopée 5, entrée 1) : carte de section mobile des pages de jeu, du kramail et des règles (H4.1, DESIGN.md › Carte
// de section ; plan story-carte-de-section-mobile-des-pages-de-jeu-kramail-par-les-reg). Une vérification par ligne de la matrice du plan :
//   carte       Matériel, Personnage, Bâtiments, Employés, plateau (objets), règles, Cybermonde (ville) à 375 et 767 px, Kraland clair et
//               Empire Brun sombre : chaque panneau à 8 px de chaque bord (largeur vw − 16), fond surface, 4 rayons de 8 px ; en-tête collé
//               en haut du panneau, de 48 px (plus haut seulement si son contenu l'exige), retrait 0 16 px ; contenu sans écart sous
//               l'en-tête, corps en retrait de 16 px, dernier corps aux coins bas de 8 px ; titre 17 px 700 en couleur du texte ; chevrons
//               (natif ou du module, enfants directs de l'en-tête) dans l'en-tête, à 16 px du bord droit ; aucun débordement horizontal ;
//   module      Bâtiments (Bâtiments Privés), plateau (Commerce, Matériel), Cybermonde (Bâtiments) à 375 et 767 px : chevron du module à
//               16 px du bord droit, centré, chevron natif masqué ; un tap sur l'en-tête (elementFromPoint vérifié avant) replie : carte de
//               48 px, corps de 0 px ; un 2e tap déplie : hauteur d'origine ; contrôle statique : règles du module dans le média mobile ;
//   kramail     réception et envoyés à 375 et 767 px : même carte, corps sans retrait (lignes pleine largeur) ; contrôle statique : règles de la
//               carte (priorités) et règles du kramail ciblées sans marge, fond ni couleur propres ;
//   forum       sous-forum, index RP et racine à 375 et 767 px, Kraland clair et Empire Brun sombre : égaux au bundle de base (317b5b7),
//               propriété par propriété ; exclus de la carte, mêmes largeurs et variantes, égaux à la base sous leur racine : accordéon
//               (.panel-group) de Répondre (kramail) et de la page de l'échelle, panneau à onglets des modales d'ordre Dormir et Pouvoir ;
//   bureau      toutes les pages à 768, 769, 1280, 1440 et 1920 px, Kraland clair et Empire Brun sombre : égales au bundle de base ;
//   bascule     Bâtiments, 767 -> 768 -> 767 et 768 -> 767 -> 768 dans le même onglet (section repliée avant chaque passage) : carte à 767,
//               égal au bundle de base (même parcours) à 768 ;
//   contraste   16 variantes, Bâtiments et réception à 375 px : titre de chaque carte ≥ 4,5:1 sur son fond ; coins de la carte et coins bas
//               du dernier corps à 8 px.
// Pages = FIXTURES SYNTHÉTIQUES (tests/e2e/fixtures), servies à leurs adresses ; vrai Bootstrap 3.3.7 (tests/e2e/vendor). Aucun accès au
// site réel. Les repères cités par trois suites (panneau, gardes du forum) sont dans lib/variantes.mjs (routeur, MAX_CITING).
// Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base, défaut : git show 317b5b7), KR_FRAG = carte, module, kramail,
// forum, bureau, bascule, contraste (vide = tout).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, styleSettled, THEME_READY, waitState } from './lib/settle.mjs';
import { CONTRASTE, DOSSIER_MODALE_TICKET51, PANNEAU_TICKET51, RACCOURCIS_TICKET51, REGLES_CARTE_TICKET51, REGLES_KRAMAIL_TICKET51, TEXTE_TICKET51, VARIANTES as TOUTES, choisirVariante } from './lib/variantes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const userscript = sansEntete(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_AVANT = '317b5b7';
const avant = sansEntete(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
  : execFileSync('git', ['show', `${COMMIT_AVANT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const lire = f => fs.readFileSync(path.join(here, 'fixtures', f), 'utf8');
const ordre = f => lire(path.join(DOSSIER_MODALE_TICKET51, f)).replace(/^<!--[\s\S]*?-->\s*/, '');
// Styles et scripts natifs du site pour les modales d'ordre (vendor/parler, comme la suite de la modale d'ordre).
const PARLER = path.join(here, 'vendor', 'parler');
const NATIFS = {
  '/lib/bootstrap-3.3.7/css/bootstrap1.min.css': 'bootstrap1.min.css', '/lib/kraland-7.0.9/css/main.css': 'main.css',
  '/lib/kraland-7.0.9/css/bootswatch.css': 'bootswatch.css', '/lib/kraland-7.0.9/css/minichat.css': 'minichat.css',
  '/lib/kraland-7.0.9/css/game.css': 'game.css', '/lib/jquery-3.3.1/jquery-3.3.1.min.js': 'jquery.min.js',
  '/lib/bootstrap-3.3.7/js/bootstrap.min.js': 'bootstrap.min.js', '/lib/bootbox-4.4.0/bootbox.min.js': 'bootbox.min.js'
};
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const BASE = 'http://www.kraland.org';
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');
const VARIANTES = ['kraland', 'empire-brun-dark'];
const MOBILES = [375, 767];
const BUREAUX = [768, 769, 1280, 1440, 1920];

// Pages : adresse, fixture, famille (jeu, kramail, forum) et en-têtes marqués par le module (titres attendus).
const PAGES = {
  materiel: { url: '/jouer/materiel', html: lire('jeu-materiel.html'), famille: 'jeu' },
  perso: { url: '/jouer/perso', html: lire('jeu-perso.html'), famille: 'jeu' },
  bat: { url: '/jouer/bat', html: lire('jeu-batiments.html'), famille: 'jeu', module: ['Bâtiments Privés'] },
  pnj: { url: '/jouer/pnj', html: lire('jeu-employes.html'), famille: 'jeu' },
  plateau: { url: '/jouer/plateau', html: lire('jeu-plateau-objets.html'), famille: 'jeu', module: ['Commerce', 'Matériel'] },
  regles: { url: '/regles/base', html: lire('regles-recherche.html'), famille: 'jeu' },
  cyber: { url: '/map', html: lire('cybermonde-ville.html'), famille: 'jeu', module: ['Bâtiments'] },
  reception: { url: '/kramail/personnage-fictif-2000-0', html: lire('kramail-reception.html'), famille: 'kramail' },
  envoi: { url: '/kramail/personnage-fictif-2000-1', html: lire('kramail-envoi.html'), famille: 'kramail' },
  'sous-forum': { url: '/forum/hrp/debuter-20102', html: lire('sous-forum-debuter.html'), famille: 'forum' },
  'index-rp': { url: '/forum/rp', html: lire('forum-index-rp.html'), famille: 'forum' },
  racine: { url: '/forum', html: lire('forum-racine.html'), famille: 'forum' },
  // Exclus de la carte, mesurés sous leur racine (racine) : accordéon (.panel-group) du kramail et de la page synthétique de l'échelle,
  // panneau à onglets des modales d'ordre (Dormir, Pouvoir) ouvertes par bootbox.confirm sur le plateau, styles natifs du site (vendor/parler).
  repondre: { url: '/kramail/post/sujet-fictif-de-lecture-5-9000002', html: lire('kramail-repondre.html'), famille: 'exclus', racine: '.panel-group' },
  echelle: { url: '/jouer/materiel', html: lire('typographie-echelle.html'), famille: 'exclus', racine: '.panel-group' },
  'modale-dormir': { url: '/jouer/plateau', html: ordre('plateau.html'), famille: 'exclus', racine: '.bootbox', ordre: ordre('dormir.html') },
  'modale-pouvoir': { url: '/jouer/plateau', html: ordre('plateau.html'), famille: 'exclus', racine: '.bootbox', ordre: ordre('pouvoir.html') }
};
const DE = famille => Object.keys(PAGES).filter(k => PAGES[k].famille === famille);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}

const browser = await launchBrowser();

async function ouvrir({ nom, width, height = 667, variante, script, tactile = width < 768 }) {
  const def = PAGES[nom];
  const context = await browser.newContext({ viewport: { width, height }, isMobile: tactile, hasTouch: tactile, deviceScaleFactor: 1 });
  await confineNetwork(context); // refus global EN PREMIER, routes des fixtures ensuite
  await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (u.href.split('#')[0] === BASE + def.url) { return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: def.html }); }
    if (def.ordre) {
      if (NATIFS[u.pathname]) { return route.fulfill({ path: path.join(PARLER, NATIFS[u.pathname]), contentType: u.pathname.endsWith('.css') ? 'text/css' : 'application/javascript' }); }
      return route.abort();
    }
    if (u.pathname.startsWith('/lib/bootstrap') || u.pathname.startsWith('/lib/jquery')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return route.fulfill({ path: path.join(VENDOR, file), contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript' });
    }
    if (u.pathname.endsWith('.css')) { return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    return route.abort();
  });
  await context.addInitScript(choisirVariante, variante);
  await context.addInitScript(src => {
    window.GM = { xmlHttpRequest: () => {} };
    // Soumission neutralisée (aucun envoi, même depuis une fixture).
    window.addEventListener('submit', e => e.preventDefault(), true);
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, script);
  const page = await context.newPage();
  const erreurs = [];
  page.on('pageerror', e => erreurs.push(e.message));
  await page.goto(BASE + def.url, { waitUntil: 'load' });
  await prete(page, `${nom} ${variante} ${width} px`);
  if (def.ordre) {
    // Ouverture comme le site : bootbox.confirm, contenu de l'ordre dans #ajax-order ; le rappel ne valide rien. Mesure après shown.bs.modal.
    await waitState(page, () => !!window.bootbox && !!window.jQuery);
    await page.evaluate(h => {
      window.__shown = 0;
      window.jQuery(document).on('shown.bs.modal', () => { window.__shown += 1; });
      window.bootbox.confirm(`<div id="ajax-order">${h}</div>`, () => false);
    }, def.ordre);
    await waitState(page, () => window.__shown > 0);
    await styleSettled(page, '.bootbox');
  }
  return { context, page, erreurs };
}

async function prete(page, label) {
  await krReady(page, { ready: THEME_READY, label });
  await styleSettled(page, 'body');
  await page.evaluate(CONTRASTE);
}

// Mesure des cartes (dans la page) : panneaux visibles avec en-tête, hors accordéon (.panel-group, entrée 3).
const MESURE = ([sel, texte]) => {
  const vis = e => !!e && e.getClientRects().length > 0 && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden';
  const boite = e => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height, d: b.right, bas: b.bottom }; };
  const px = v => parseFloat(v) || 0;
  const coins = s => [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
  const C = window.__krContraste;
  const panneaux = [...document.querySelectorAll(sel)].filter(p => vis(p) && !p.closest('.panel-group') && p.querySelector(':scope > .panel-heading'));
  return {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    vw: document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth,
    surface: C.sonde('var(--kr-bg-surface)'),
    primaire: C.sonde(texte),
    panneaux: panneaux.map(p => {
      const s = getComputedStyle(p);
      const h = p.querySelector(':scope > .panel-heading');
      const hs = getComputedStyle(h);
      const titre = h.querySelector('h1, h2, h3, h4, h5, h6, .panel-title');
      const ts = titre && getComputedStyle(titre);
      const enfants = [...h.children].filter(vis);
      const contenu = Math.max(0, ...enfants.map(k => { const ks = getComputedStyle(k); return k.getBoundingClientRect().height + px(ks.marginTop) + px(ks.marginBottom); }));
      const suite = [...p.children].filter(c => c !== h && vis(c) && c.getBoundingClientRect().height > 0);
      const corps = [...p.children].filter(c => c.classList.contains('panel-body') && vis(c));
      const dernier = p.lastElementChild;
      const chevrons = [...h.querySelectorAll(':scope > .accordion-icon, :scope > .pull-right.clickable')].filter(vis).map(c => ({ ...boite(c), cls: c.className }));
      return {
        nom: (titre ? titre.textContent : h.textContent).trim().replace(/\s+/g, ' ').slice(0, 30),
        p: boite(p), fond: s.backgroundColor, coins: coins(s),
        h: boite(h), retrait: [hs.paddingTop, hs.paddingRight, hs.paddingBottom, hs.paddingLeft], contenu: contenu + px(hs.paddingTop) + px(hs.paddingBottom),
        titre: titre ? { tag: titre.tagName, taille: ts.fontSize, graisse: ts.fontWeight, couleur: ts.color, rapport: C.texte(titre) } : null,
        suite: suite.length ? boite(suite[0]) : null,
        corps: corps.map(c => { const cs = getComputedStyle(c); return [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft]; }),
        dernier: dernier && dernier.classList.contains('panel-body') && vis(dernier) && dernier !== h ? coins(getComputedStyle(dernier)).slice(2) : null,
        chevrons
      };
    })
  };
};

// Relevé de comparaison (dans la page) : panneaux, en-têtes, titres, corps et chevrons, boîte au dixième et styles calculés.
const RELEVE = (racine = 'html') => {
  const r = v => Math.round(v * 10) / 10;
  const props = ['display', 'position', 'backgroundColor', 'color', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius',
    'borderBottomLeftRadius', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom',
    'marginLeft', 'minHeight', 'fontSize', 'fontWeight', 'borderTopWidth', 'boxShadow', 'transform'];
  // Sous une racine (exclus de la carte), ordonnée relative à son haut : le contenu de la page au-dessus (en carte) la déplace.
  const haut = racine === 'html' ? 0 : document.querySelector(racine).getBoundingClientRect().top;
  return {
    theme: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    sw: document.documentElement.scrollWidth,
    l: [...document.querySelectorAll(['.panel', '.panel-heading', '.panel-heading > *', '.panel-body', '.accordion-icon'].map(x => `${racine} ${x}`).join(', '))].map((e, i) => {
      const b = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      return `${i} ${e.tagName}.${[...e.classList].join('.')} [${e.getClientRects().length ? [b.left, b.top - haut, b.width, b.height].map(r).join(',') : 'sans boîte'}] ` + props.map(p => s[p]).join('|');
    })
  };
};
const premierEcart = (a, b) => {
  const i = a.findIndex((x, k) => x !== b[k]);
  if (i < 0 && a.length === b.length) { return ''; }
  const k = i < 0 ? Math.min(a.length, b.length) : i;
  return `${a.length} / ${b.length} éléments ; testé « ${a[k] || '-'} » / base « ${b[k] || '-'} »`;
};

const pres = (a, b, tol = 0.5) => Math.abs(a - b) <= tol;
function controlerCarte(m, famille) {
  assert.ok(m.theme, 'kr-theme-enabled absent');
  assert.ok(m.mobile, 'mobile-mode absent');
  assert.ok(m.panneaux.length > 0, 'aucun panneau à en-tête');
  assert.ok(m.sw <= m.vw, `débordement horizontal : ${m.sw} > ${m.vw}`);
  const ecarts = [];
  for (const c of m.panneaux) {
    const e = [];
    if (!pres(c.p.x, 8) || !pres(c.p.w, m.vw - 16)) { e.push(`boîte x ${c.p.x} largeur ${c.p.w} (vw ${m.vw})`); }
    if (c.fond !== m.surface) { e.push(`fond ${c.fond} ≠ ${m.surface}`); }
    if (c.coins.some(v => v !== '8px')) { e.push(`rayons ${c.coins.join(' ')}`); }
    if (!pres(c.h.y, c.p.y) || !pres(c.h.x, c.p.x) || !pres(c.h.w, c.p.w)) { e.push(`en-tête décalé [${c.h.x},${c.h.y},${c.h.w}]`); }
    if (c.h.h < 47.5 || (c.h.h > 48.5 && c.contenu < c.h.h - 0.5)) { e.push(`en-tête ${c.h.h} px (contenu ${c.contenu})`); }
    if (c.retrait.join(' ') !== '0px 16px 0px 16px') { e.push(`retrait ${c.retrait.join(' ')}`); }
    if (c.suite && !pres(c.suite.y, c.h.bas)) { e.push(`écart de ${Math.round((c.suite.y - c.h.bas) * 10) / 10} px sous l'en-tête`); }
    const attendu = famille === 'kramail' ? '0px 0px 0px 0px' : '16px 16px 16px 16px';
    if (c.corps.some(v => v.join(' ') !== attendu)) { e.push(`corps ${c.corps.map(v => v.join(' ')).join(' ; ')}`); }
    if (c.dernier && c.dernier.some(v => v !== '8px')) { e.push(`coins bas du dernier corps ${c.dernier.join(' ')}`); }
    if (!c.titre || c.titre.tag !== 'H3') { e.push(`titre ${c.titre ? c.titre.tag : 'absent'}`); } else if (c.titre.taille !== '17px' || c.titre.graisse !== '700' || c.titre.couleur !== m.primaire) {
      e.push(`titre ${c.titre.taille}/${c.titre.graisse} ${c.titre.couleur} (attendu 17px/700 ${m.primaire})`);
    }
    for (const v of c.chevrons) {
      if (!pres(c.h.d - v.d, 16) || v.y < c.h.y - 0.5 || v.bas > c.h.bas + 0.5) { e.push(`chevron ${v.cls} à ${Math.round((c.h.d - v.d) * 10) / 10} px du bord, [${v.y},${v.bas}] hors de [${c.h.y},${c.h.bas}]`); }
    }
    if (e.length) { ecarts.push(`« ${c.nom} » : ${e.join(', ')}`); }
  }
  assert.deepEqual(ecarts, [], ecarts.join(' ; '));
}

// ---------- carte et kramail ----------
for (const [frag, famille] of [['carte', 'jeu'], ['kramail', 'kramail']]) {
  if (!on(frag)) { continue; }
  console.log(`\n== ${frag} ==`);
  const cas = DE(famille).flatMap(nom => MOBILES.flatMap(width => VARIANTES.map(variante => ({ nom, width, variante }))));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const m = await page.evaluate(MESURE, [PANNEAU_TICKET51, TEXTE_TICKET51]);
    await context.close();
    return { c, m, erreurs };
  });
  for (const { c, m, erreurs } of res) {
    check(`${frag} ${c.nom} ${c.variante} ${c.width} px : ${m.panneaux.length} carte(s) à 8 px des bords, fond surface, rayons 8 px, en-tête de 48 px (retrait 0 16 px) collé au contenu, corps ${famille === 'kramail' ? 'sans retrait' : 'à 16 px'}, coins bas du dernier corps à 8 px, titre 17 px 700 text-primary, chevrons à 16 px du bord droit, sans débordement`, () => controlerCarte(m, famille));
    check(`${frag} ${c.nom} ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

// ---------- contrôles statiques (CSSOM du thème du bundle testé) ----------
function cssDuBundle(src) {
  const i = src.indexOf('BUNDLED_CSS:\'') + 13;
  let j = i;
  while (src[j] !== '\'') { j += src[j] === '\\' ? 2 : 1; }
  return src.slice(i, j);
}
const REGLES_CSS = ([css, raccourcis]) => {
  const feuille = new window.CSSStyleSheet();
  feuille.replaceSync(css);
  const out = [];
  const parcourir = (liste, media) => { for (const r of liste) {
    if (r.media) { parcourir(r.cssRules, r.media.mediaText); continue; }
    if (!r.selectorText) { if (r.cssRules) { parcourir(r.cssRules, media); } continue; }
    const d = {};
    for (let k = 0; k < r.style.length; k += 1) { const p = r.style[k]; d[p] = [r.style.getPropertyValue(p), r.style.getPropertyPriority(p)]; }
    for (const p of raccourcis) { if (r.style.getPropertyValue(p)) { d[p] = [r.style.getPropertyValue(p), r.style.getPropertyPriority(p)]; } }
    out.push({ media, sel: r.selectorText, d });
  } };
  parcourir(feuille.cssRules, '');
  return out;
};
let reglesTestees = null;
async function regles() {
  if (reglesTestees) { return reglesTestees; }
  const context = await browser.newContext();
  await confineNetwork(context);
  const page = await context.newPage();
  // eslint-disable-next-line no-eval
  reglesTestees = await page.evaluate(REGLES_CSS, [(0, eval)(`'${cssDuBundle(userscript)}'`), RACCOURCIS_TICKET51]);
  await context.close();
  return reglesTestees;
}
const MOBILE = ['(max-width: 767px)', '(width <= 767px)'];

if (on('kramail')) {
  const rs = await regles();
  check(`statique : ${REGLES_CARTE_TICKET51.length} déclarations réécrites (fond et marges latérales de la carte ; retrait, marge basse et hauteur de l'en-tête ; couleur du titre ; rayon du dernier corps ; retrait du corps replié) présentes, dans le média mobile seulement, à la priorité d'origine`, () => {
    const ecarts = REGLES_CARTE_TICKET51.flatMap(([sel, p, prio]) => {
      const l = rs.filter(r => r.sel === sel && r.d[p]);
      if (!l.length) { return [`${sel} { ${p} } absente`]; }
      return l.filter(r => !MOBILE.includes(r.media) || r.d[p][1] !== prio).map(r => `${r.media || 'global'} ${sel} { ${p}: ${r.d[p].join(' !')} }`);
    });
    assert.deepEqual(ecarts, [], ecarts.join(' ; '));
  });
  check('statique : règles du kramail ciblées sans marge (raccourci et 4 côtés), fond ni --kr-text-accent ; règle d\'en-tête du kramail retirée', () => {
    const ecarts = REGLES_KRAMAIL_TICKET51.flatMap(([sel, absentes]) => {
      const l = rs.filter(r => r.sel === sel);
      if (absentes === null) { return l.map(r => `${r.media || 'global'} ${sel} présente`); }
      if (!l.length) { return [`${sel} absente`]; }
      return l.flatMap(r => [...absentes.filter(p => r.d[p]).map(p => `${sel} { ${p}: ${r.d[p][0]} }`),
        ...Object.entries(r.d).filter(([, [v]]) => v.includes('--kr-text-accent')).map(([p]) => `${sel} { ${p}: accent }`)]);
    });
    assert.deepEqual(ecarts, [], ecarts.join(' ; '));
  });
}

// ---------- module « Panel Sections Collapse » ----------
if (on('module')) {
  console.log('\n== module ==');
  const rs = await regles();
  check('statique : règles du module (building-section) toutes dans le média mobile, chevron sans position absolue', () => {
    const l = rs.filter(r => /building-section/.test(r.sel));
    assert.ok(l.length >= 5, `${l.length} règle(s)`);
    const hors = l.filter(r => !MOBILE.includes(r.media)).map(r => `${r.media || 'global'} ${r.sel}`);
    const absolu = l.filter(r => /accordion-icon/.test(r.sel) && (r.d.position || r.d.right || r.d.top)).map(r => r.sel);
    assert.deepEqual([...hors, ...absolu], [], [...hors, ...absolu].join(' ; '));
  });
  const cas = Object.keys(PAGES).filter(k => PAGES[k].module).flatMap(nom => MOBILES.map(width => ({ nom, width, variante: 'kraland' })));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const titres = await page.evaluate(() => [...document.querySelectorAll('.building-section-header')].map(h => h.textContent.trim().replace(/\s+/g, ' ')));
    const sections = [];
    for (let i = 0; i < titres.length; i += 1) {
      const etat = async () => page.evaluate(k => {
        const h = document.querySelectorAll('.building-section-header')[k];
        const p = h.parentElement;
        const corps = p.querySelector(':scope > .building-section-content');
        const icone = h.querySelector('.accordion-icon');
        const natif = h.querySelector('span.pull-right.clickable');
        const b = e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, d: r.right, bas: r.bottom }; };
        return { p: b(p), h: b(h), corps: corps ? b(corps) : null, icone: icone ? b(icone) : null, natif: natif ? getComputedStyle(natif).display : null,
          sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth };
      }, i);
      await page.evaluate(k => { const h = document.querySelectorAll('.building-section-header')[k]; window.scrollTo(0, 0); window.scrollTo(0, h.getBoundingClientRect().top - 200); }, i);
      await styleSettled(page, 'body');
      const avantTap = await etat();
      const taper = async () => {
        const e = await etat();
        const x = e.h.x + e.h.w / 3;
        const y = e.h.y + e.h.h / 2;
        const touche = await page.evaluate(({ k, px, py }) => document.elementFromPoint(px, py)?.closest('.building-section-header') === document.querySelectorAll('.building-section-header')[k], { k: i, px: x, py: y });
        if (touche) { await page.touchscreen.tap(x, y); }
        await styleSettled(page, '.building-section-content', { index: i });
        await styleSettled(page, '.building-section-header', { index: i });
        return touche;
      };
      const touche1 = await taper();
      const replie = await etat();
      const touche2 = await taper();
      const deplie = await etat();
      sections.push({ titre: titres[i], avantTap, touche1, replie, touche2, deplie });
    }
    await context.close();
    return { c, titres, sections, erreurs };
  });
  for (const { c, titres, sections, erreurs } of res) {
    const lab = `module ${c.nom} ${c.width} px`;
    check(`${lab} : en-têtes marqués ${PAGES[c.nom].module.join(', ')}`, () => {
      assert.deepEqual(PAGES[c.nom].module.filter(t => !titres.some(x => x.startsWith(t))), [], titres.join(' | '));
    });
    for (const s of sections) {
      const a = s.avantTap;
      check(`${lab} « ${s.titre} » : chevron du module à 16 px du bord droit, centré dans l'en-tête de 48 px, chevron natif masqué`, () => {
        assert.ok(a.icone, 'chevron absent');
        assert.ok(pres(a.h.d - a.icone.d, 16), `chevron à ${a.h.d - a.icone.d} px du bord droit`);
        assert.ok(pres(a.icone.y + a.icone.h / 2, a.h.y + a.h.h / 2, 1), `centre ${a.icone.y + a.icone.h / 2} / ${a.h.y + a.h.h / 2}`);
        assert.ok(pres(a.h.h, 48), `en-tête ${a.h.h} px`);
        assert.ok(a.natif === null || a.natif === 'none', `chevron natif ${a.natif}`);
      });
      check(`${lab} « ${s.titre} » : 1er tap (elementFromPoint sur l'en-tête) : carte de 48 px, corps de 0 px, sans débordement`, () => {
        assert.ok(s.touche1, 'en-tête couvert au point du tap');
        assert.ok(pres(s.replie.p.h, 48), `carte ${s.replie.p.h} px`);
        assert.ok(s.replie.corps && pres(s.replie.corps.h, 0), `corps ${s.replie.corps && s.replie.corps.h} px`);
        assert.ok(s.replie.sw <= s.replie.vw, `débordement ${s.replie.sw}`);
      });
      check(`${lab} « ${s.titre} » : 2e tap : hauteur d'origine (${Math.round(a.p.h * 10) / 10} px), sans débordement`, () => {
        assert.ok(s.touche2, 'en-tête couvert au point du tap');
        assert.ok(pres(s.deplie.p.h, a.p.h), `carte ${s.deplie.p.h} px`);
        assert.ok(s.deplie.sw <= s.deplie.vw, `débordement ${s.deplie.sw}`);
      });
    }
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

// ---------- égalité au bundle de base : forum (mobile) et bureau ----------
async function comparer(frag, cas) {
  const res = await mapLimit(cas, async c => {
    const out = {};
    for (const [cle, script] of [['teste', userscript], ['base', avant]]) {
      const { context, page, erreurs } = await ouvrir({ ...c, script });
      out[cle] = { r: await page.evaluate(RELEVE, PAGES[c.nom].racine), erreurs };
      await context.close();
    }
    return { c, ...out };
  });
  for (const { c, teste, base } of res) {
    const sous = PAGES[c.nom].racine ? ` sous ${PAGES[c.nom].racine}` : '';
    check(`${frag} ${c.nom} ${c.variante} ${c.width} px : panneaux, en-têtes, titres et corps${sous} égaux au bundle de base (${teste.r.l.length} éléments)`, () => {
      assert.ok(teste.r.theme && base.r.theme, `kr-theme-enabled testé ${teste.r.theme} / base ${base.r.theme}`);
      assert.equal(teste.r.mobile, c.width < 768, 'mode');
      assert.ok(teste.r.l.length > 0, 'aucun élément');
      const e = premierEcart(teste.r.l, base.r.l);
      assert.equal(e, '', e);
      assert.equal(teste.r.sw, base.r.sw, 'largeur défilable');
    });
    check(`${frag} ${c.nom} ${c.variante} ${c.width} px : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
}
if (on('forum')) {
  console.log('\n== forum ==');
  await comparer('forum', [...DE('forum'), ...DE('exclus')].flatMap(nom => MOBILES.flatMap(width => VARIANTES.map(variante => ({ nom, width, variante })))));
}
if (on('bureau')) {
  console.log('\n== bureau ==');
  await comparer('bureau', Object.keys(PAGES).filter(k => PAGES[k].famille !== 'exclus').flatMap(nom => BUREAUX.flatMap(width => VARIANTES.map(variante => ({ nom, width, variante })))));
}

// ---------- bascule dans le même onglet ----------
// Section du module repliée avant chaque passage (tap) ; le rechargement de bascule est attendu comme dans typographie-formes.mjs.
async function parcours(script, variante, largeurs) {
  const { context, page, erreurs } = await ouvrir({ nom: 'bat', width: largeurs[0], variante, script, tactile: false });
  const etapes = [];
  for (let i = 0; i < largeurs.length; i += 1) {
    const width = largeurs[i];
    if (i > 0) {
      await page.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = page.waitForEvent('load', { timeout: 8000 }).catch(() => null);
      await page.setViewportSize({ width, height: 667 });
      await charge;
      await prete(page, `bascule ${variante} ${width} px`);
    }
    etapes.push({ width, m: width < 768 ? await page.evaluate(MESURE, [PANNEAU_TICKET51, TEXTE_TICKET51]) : null, r: await page.evaluate(RELEVE) });
    if (i < largeurs.length - 1) {
      await page.evaluate(() => { const h = document.querySelector('.building-section-header'); if (h) { h.click(); } });
      await styleSettled(page, 'body');
    }
  }
  await context.close();
  return { etapes, erreurs };
}
if (on('bascule')) {
  console.log('\n== bascule ==');
  const cas = VARIANTES.flatMap(variante => [[767, 768, 767], [768, 767, 768]].map(largeurs => ({ variante, largeurs })));
  const res = await mapLimit(cas, async c => ({ c, teste: await parcours(userscript, c.variante, c.largeurs), base: await parcours(avant, c.variante, c.largeurs) }));
  for (const { c, teste, base } of res) {
    const lab = `bascule ${c.variante} ${c.largeurs.join(' -> ')}`;
    teste.etapes.forEach((e, i) => {
      if (e.width < 768) {
        check(`${lab}, étape ${i + 1} (${e.width} px) : carte de section`, () => controlerCarte(e.m, 'jeu'));
      } else {
        check(`${lab}, étape ${i + 1} (${e.width} px) : égal au bundle de base (même parcours)`, () => {
          assert.ok(e.r.theme && base.etapes[i].r.theme, 'kr-theme-enabled absent');
          assert.equal(e.r.mobile, false, 'mode mobile à 768 px');
          const d = premierEcart(e.r.l, base.etapes[i].r.l);
          assert.equal(d, '', d);
        });
      }
    });
    check(`${lab} : aucune erreur de page`, () => assert.deepEqual(teste.erreurs, []));
  }
}

// ---------- contraste (16 variantes) ----------
if (on('contraste')) {
  console.log('\n== contraste ==');
  const cas = ['bat', 'reception'].flatMap(nom => TOUTES.map(variante => ({ nom, variante, width: 375 })));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await ouvrir({ ...c, script: userscript });
    const m = await page.evaluate(MESURE, [PANNEAU_TICKET51, TEXTE_TICKET51]);
    await context.close();
    return { c, m, erreurs };
  });
  for (const { c, m, erreurs } of res) {
    check(`contraste ${c.nom} ${c.variante} : titre de chaque carte ≥ 4,5:1 sur son fond`, () => {
      assert.ok(m.theme, 'kr-theme-enabled absent');
      assert.ok(m.panneaux.length > 0, 'aucun panneau');
      const ecarts = m.panneaux.filter(p => !p.titre || p.titre.rapport < 4.5).map(p => `« ${p.nom} » ${p.titre ? p.titre.rapport.toFixed(2) : 'sans titre'}:1`);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    check(`contraste ${c.nom} ${c.variante} : coins de la carte et coins bas du dernier corps à 8 px`, () => {
      const ecarts = m.panneaux.flatMap(p => [
        ...(p.coins.some(v => v !== '8px') ? [`« ${p.nom} » rayons ${p.coins.join(' ')}`] : []),
        ...(p.dernier && p.dernier.some(v => v !== '8px') ? [`« ${p.nom} » coins bas du corps ${p.dernier.join(' ')}`] : [])
      ]);
      assert.deepEqual(ecarts, [], ecarts.join(' ; '));
    });
    check(`contraste ${c.nom} ${c.variante} : aucune erreur de page`, () => assert.deepEqual(erreurs, []));
  }
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
