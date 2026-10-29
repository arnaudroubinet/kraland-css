// Index du forum (ticket 6.1, refonte H12.1) : les index RP, HRP, Communauté et Débats reprennent la présentation du sous-forum, sur
// ordinateur et sur mobile. Une vérification par ligne de la matrice du plan (story-l-index-du-forum-reprend-la-presentation-du-sous-forum) :
//   bureau (1440 px)  colonnes Forum, Sujets, Messages, Dernier Message comme celles du sous-forum ; nom seul ; auteur en gras, heure atténuée
//                     dessous ; bouton → au bout de la ligne ; ni description ni modérateurs ;
//   mobile (375 px)   une seule présentation (ni cartes ni tableau doublé) : lignes dans la carte de section (épopée 5,
//                     entrée 2 : à 8 px des bords de l'écran), sous son en-tête ; nom ;
//                     « Dernier : auteur, heure » ; « N sujets · N messages » ; bouton → de 44 px ; toute la ligne ouvre le forum ;
//   forum sans message (« 0 sujets · 0 messages », ni dernier message ni bouton →) ; auteur avec icône (nom et icône conservés, en gras) ;
//   en-têtes (titre de page, « Tous les forums », en-tête de section) : même rendu que le sous-forum, titre de section jamais en couleur de
//                     nation (couleur de texte sur mobile) ;
//   racine /forum : tous les groupes restent visibles et utilisent les lignes de l'index ; sous-forum, sujet et index Staff égaux au bundle de base
//                     (6270c81), sans masque ;
//   seuil : 767, 768 et 769 px, et aller-retour 767 → 768 → 767 dans le même onglet (rechargement du thème au franchissement) ;
//   peau coupée : la page native est intacte.
// « Même rendu que le sous-forum » : le sous-forum « Débuter » (fixture sous-forum-debuter.html) est mesuré dans le même navigateur, à la même
// largeur et dans la même variante ; les propriétés calculées de chaque composant de l'index sont comparées à celles du composant du sous-forum.
// Pages = FIXTURES SYNTHÉTIQUES (structure réelle relevée le 2026-10-22, données inventées) : forum-index-rp.html (alerte, 4 forums : description
// avec <u>, forum sans description, deux modérateurs, auteur avec icône, forum sans message) et forum-index-communaute.html (3 forums, sans
// alerte, « 1 sujet · 1 message »). Racine : forum-racine-groupes.html (groupes synthétiques). Hors périmètre : le sous-forum,
// forum-sujet.html (page de sujet de messages-v3.mjs) et forum-index-rp.html servi à /forum/staff. Vrai Bootstrap 3.3.7 (tests/e2e/vendor).
// Confinement réseau ; aucun clic : les cibles sont mesurées par elementFromPoint, après un défilement par window.scrollTo.
// Bundle de base (hors périmètre) : garde de régression au commit 6270c81, sauf KR_SCRIPT_AVANT. L'empreinte est comparée telle quelle,
// sans jeton posé ni propriété neutralisée.
//
// Usage : npm run build && node tests/e2e/forum-index.mjs   (ou : npm run test:zone -- forum)
// Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle de base), KR_SHOTS=/dossier (captures hors dépôt), KR_VERBOSE=1 (détail des écarts),
//           KR_FRAG = mobile, bureau, seuil, hors-perimetre, peau-coupee (vide = tout).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, THEME_READY } from './lib/settle.mjs';
import { SANS_MARGE_PAGE } from './lib/marges.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const strip = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = strip(fs.readFileSync(scriptPath, 'utf8'));
const fixture = name => fs.readFileSync(path.join(here, 'fixtures', name), 'utf8');
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const SHOTS = process.env.KR_SHOTS || '';
const BASE = 'http://www.kraland.org';
const VARIANTES = ['kraland', 'empire-brun-dark'];
// Index mesurés. Le thème reconnaît un index à son chemin : la classe de page est vérifiée sur les quatre chemins (hors-perimetre).
const INDEX = {
  rp: { url: '/forum/rp', html: fixture('forum-index-rp.html'), titre: 'Jeu (RP)' },
  communaute: { url: '/forum/communaute', html: fixture('forum-index-communaute.html'), titre: 'Communauté' }
};
INDEX.racineSlash = { url: '/forum/', html: fixture('forum-racine-groupes.html'), titre: 'Forum' };
INDEX.racine = { url: '/forum', html: fixture('forum-racine-groupes.html'), titre: 'Forum' };
const SOUS_FORUM = { url: '/forum/hrp/debuter-20102', html: fixture('sous-forum-debuter.html') };
const RACINE = { url: '/forum', html: fixture('forum-racine-groupes.html') };
const SUJET = { url: '/forum/sujet/messages-v3-329425-1', html: fixture('forum-sujet.html') };
const STAFF = { url: '/forum/staff', html: fixture('forum-index-rp.html') };
const MOBILE = 375;
const BUREAU = 1440;
const ECART_RECHARGEMENT_MS = 1300; // garde-fou du thème : deux rechargements au franchissement du seuil à 1 200 ms d'écart au moins
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n').slice(0, process.env.KR_VERBOSE ? 40 : 1).join('\n       ')); }
}

// Bundle de base : figé au commit 6270c81 pour que la comparaison garde son sens après fusion.
const COMMIT_AVANT = '6270c81';
function bundleAvant() {
  if (process.env.KR_SCRIPT_AVANT) { return strip(fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')); }
  try { return strip(execFileSync('git', ['show', `${COMMIT_AVANT}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] })); } catch (_e) { return null; }
}

// Injection en début de document : un script en tête de <head>, avant la balise viewport (technique de forum-activite.mjs). La page
// native (src null) reçoit le même ajout, pour comparer deux documents identiques hors userscript.
const enTete = html => {
  const h = html.replace('<meta charset="utf-8">', '<meta charset="utf-8"><script>window.__krScriptTete = true;</script>');
  if (h === html) { throw new Error('fixture sans <meta charset="utf-8"> : injection en début de document impossible'); }
  return h;
};

const browser = await launchBrowser();

// Ouvre `url` servie par `html`. `src` : bundle injecté (null : page native, sans userscript) ; `theme` : kr-theme-enabled ; `mobile` :
// émulation tactile (par défaut sous 768 px) ; `debut` : bundle évalué dès que <html> existe (sinon dès que <body> existe).
async function open({ url, html, variante = VARIANTES[1], width, height, mobile = width < 768, theme = true, src = userscript, debut = false }) {
  const context = await browser.newContext({ viewport: { width, height: height || (mobile ? 667 : 900) }, isMobile: mobile, hasTouch: mobile });
  const denied = await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route(BASE + url, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: debut ? enTete(html) : html }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/css/bootstrap1.min.css', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.css'), contentType: 'text/css' }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/js/bootstrap.min.js', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.js'), contentType: 'application/javascript' }));
  await context.route(BASE + '/lib/jquery-3.3.1/jquery-3.3.1.min.js', route => route.fulfill({ path: path.join(VENDOR, 'jquery.min.js'), contentType: 'application/javascript' }));
  if (src) {
    await context.addInitScript(({ code, v, enabled, start }) => {
      window.GM = { xmlHttpRequest: () => {} };
      localStorage.setItem('kr-theme-enabled', enabled ? 'true' : 'false');
      localStorage.setItem('kr-theme-variant', v);
      // eslint-disable-next-line no-eval
      const go = () => { window.__krInjection = { body: !!document.body, largeur: window.innerWidth }; (0, eval)(code); };
      if (start) {
        if (document.documentElement) { go(); } else { new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); go(); } }).observe(document, { childList: true }); }
        return;
      }
      if (document.body) { go(); return; }
      new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
    }, { code: src, v: variante, enabled: theme, start: debut });
  }
  const page = await context.newPage();
  const erreurs = [];
  page.on('pageerror', e => erreurs.push(e.message));
  await page.goto(BASE + url, { waitUntil: 'load' });
  if (src) { await krReady(page, { ready: theme ? THEME_READY : null, label: `${variante} ${url} ${width}` }); }
  return { context, page, erreurs, denied };
}

const shot = async (page, name) => {
  if (!SHOTS) { return; }
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: path.join(SHOTS, `forum-index-${name}.png`), fullPage: true });
};

// ---------- Mesures (évaluées dans la page) ----------

// Socle : variante, mode mobile, classes de page.
const SOCLE = () => ({
  variant: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')) || null,
  index: document.documentElement.classList.contains('kr-page-forum-index'),
  mobile: document.body.classList.contains('mobile-mode'),
  pageForum: document.body.classList.contains('page-forum'),
  subforum: document.body.classList.contains('kr-subforum'),
  iw: window.innerWidth,
  overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth
});

// Propriétés calculées des composants d'une page : `cibles` = { nom: [sélecteur, propriétés, pseudo facultatif] }. Élément absent : null.
const STYLES = cibles => Object.fromEntries(Object.entries(cibles).map(([nom, [sel, props, pseudo]]) => {
  const el = document.querySelector(sel);
  if (!el) { return [nom, null]; }
  const s = getComputedStyle(el, pseudo || null);
  return [nom, Object.fromEntries(props.map(p => [p, s.getPropertyValue(p)]))];
}));

// Lignes de l'index, telles que la page les montre. Texte visible = texte du DOM et contenus générés (::before, ::after), hors display:none.
// Cibles mesurées par elementFromPoint après window.scrollTo (pas de scrollIntoView, qui fait défiler les conteneurs masqués).
const LIGNES = () => {
  const visible = e => { if (!e) { return false; } const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; };
  const rect = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom + window.scrollY) }; };
  const walk = n => {
    if (n.nodeType === 3) { return n.textContent; }
    if (n.nodeType !== 1) { return ''; }
    const s = getComputedStyle(n);
    if (s.display === 'none' || s.visibility === 'hidden') { return ''; }
    const gen = w => { const c = getComputedStyle(n, w).content; return c && c !== 'none' && c !== 'normal' ? c.replace(/^"|"$/g, '') : ''; };
    return gen('::before') + [...n.childNodes].map(walk).join('') + gen('::after');
  };
  const texte = e => walk(e).replace(/\s+/g, ' ').trim();
  // Boîte du texte d'un nœud texte non vide d'un élément (la date est un nœud texte du p.mini, après le groupe du bouton).
  const boiteTexte = el => {
    const t = el ? [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.trim()) : null;
    if (!t) { return null; }
    const range = document.createRange(); range.selectNodeContents(t);
    const r = range.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const lienEn = (x, y) => { window.scrollTo(0, 0); const top = Math.max(0, y - 200); window.scrollTo(0, top); const el = document.elementFromPoint(x, y - window.scrollY); const a = el && el.closest('a'); return a ? a.getAttribute('href') : null; };
  const table = document.querySelector('#col-right .panel-default table.table');
  const entete = document.querySelector('#col-right .panel-default > .panel-heading');
  const lignes = table ? [...table.tBodies].flatMap(b => [...b.rows]) : [];
  const res = lignes.map(tr => {
    const c = tr.cells;
    const nom = c[0].querySelector(':scope > p > a');
    const description = c[0].querySelector(':scope > p.tagforum');
    const moderateurs = c[0].querySelector(':scope > span.tagforum');
    const auteur = c[3].querySelector(':scope > a.nomargin');
    const date = c[3].querySelector(':scope > p.mini');
    const fleche = c[3].querySelector('.btn-group > a.btn');
    const icone = auteur ? auteur.querySelector('img.icon') : null;
    const r = rect(tr);
    const cibles = [];
    if (visible(tr)) {
      const milieu = r.y + r.h / 2;
      cibles.push(['bord gauche', lienEn(r.x + 6, milieu)]);
      cibles.push(['compteurs', visible(c[1]) ? lienEn(rect(c[1]).x + 2, rect(c[1]).y + rect(c[1]).h / 2) : 'invisible']);
      if (auteur && visible(auteur)) { const a = rect(auteur); cibles.push(['auteur', lienEn(a.x + a.w / 2, a.y + a.h / 2)]); }
      const bt = boiteTexte(date);
      if (bt) { cibles.push(['date', lienEn(bt.x + bt.w / 2, bt.y + bt.h / 2)]); }
    }
    const fr = fleche && visible(fleche) ? rect(fleche) : null;
    return {
      nom: nom ? nom.textContent.trim() : null,
      href: nom ? nom.getAttribute('href') : null,
      texte: texte(tr),
      ligne: r,
      visible: visible(tr),
      affichage: getComputedStyle(tr).display,
      nomRect: nom && visible(nom) ? rect(nom) : null,
      nomStyle: nom ? { taille: getComputedStyle(nom).fontSize, graisse: getComputedStyle(nom).fontWeight, couleur: getComputedStyle(nom).color } : null,
      descriptionVisible: visible(description),
      moderateursVisible: visible(moderateurs),
      sujets: { natif: c[1].textContent.trim(), rect: visible(c[1]) ? rect(c[1]) : null, alignement: getComputedStyle(c[1]).textAlign, chiffres: getComputedStyle(c[1]).fontVariantNumeric },
      messages: { natif: c[2].textContent.trim(), rect: visible(c[2]) ? rect(c[2]) : null, alignement: getComputedStyle(c[2]).textAlign },
      auteur: auteur ? { texte: auteur.textContent.trim(), visible: visible(auteur), rect: visible(auteur) ? rect(auteur) : null, graisse: getComputedStyle(auteur).fontWeight, avant: getComputedStyle(auteur, '::before').content, apres: getComputedStyle(auteur, '::after').content } : null,
      icone: icone ? { visible: visible(icone), w: Math.round(icone.getBoundingClientRect().width), dansAuteur: true } : null,
      date: date ? { texte: date.textContent.replace(/\s+/g, ' ').trim(), visible: visible(date), boite: boiteTexte(date), couleur: getComputedStyle(date).color, taille: getComputedStyle(date).fontSize } : null,
      fleche: fleche ? { href: fleche.getAttribute('href'), nom: fleche.getAttribute('aria-label'), visible: visible(fleche), rect: fr, auCentre: fr ? lienEn(fr.x + fr.w / 2, fr.y + fr.h / 2) : null } : null,
      cibles
    };
  });
  window.scrollTo(0, 0);
  const secondaire = (() => { const p = document.createElement('i'); p.style.color = 'var(--kr-text-secondary)'; document.body.appendChild(p); const v = getComputedStyle(p).color; p.remove(); return v; })();
  return {
    lignes: res,
    entete: entete ? rect(entete) : null,
    panneau: entete ? rect(entete.parentElement) : null,
    tableauxVisibles: [...document.querySelectorAll('#col-right table')].filter(visible).length,
    cartes: document.querySelectorAll('.forums-cards-container, .forum-card').length,
    blocsPermanents: document.querySelectorAll('.permanent-topic-stats').length,
    thead: table ? { visible: visible(table.tHead), cellules: [...table.tHead.rows[0].cells].map(th => th.textContent.replace(/\s+/g, ' ').trim()), alignements: [...table.tHead.rows[0].cells].map(th => getComputedStyle(th).textAlign) } : null,
    secondaire,
    texteTableau: table ? texte(table) : ''
  };
};

// En-têtes : titre de page, « Tous les forums », en-tête de section.
const ENTETES = () => {
  const visible = e => { if (!e) { return false; } const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const rect = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height), r: Math.round(r.right), b: Math.round(r.bottom + window.scrollY) }; };
  const sonde = v => { const p = document.createElement('i'); p.style.color = `var(${v})`; document.body.appendChild(p); const c = getComputedStyle(p).color; p.remove(); return c; };
  const h1 = document.querySelector('#col-right > h1.page-header');
  const tous = [...document.querySelectorAll('#col-right a[href="forum"]')].filter(visible);
  const fil = h1 ? h1.querySelector('.forum-mobile-breadcrumb') : null;
  const titre = h1 ? h1.querySelector('.forum-subforum-title') : null;
  const h3 = document.querySelector('#col-right .panel-default > .panel-heading h3');
  const icone = h3 ? h3.querySelector('i') : null;
  const chevron = document.querySelector('#col-right .panel-default > .panel-heading span.clickable');
  return {
    h1: h1 ? { rect: rect(h1), texte: h1.textContent.replace(/\s+/g, ' ').trim() } : null,
    tous: tous.map(a => ({ texte: a.textContent.replace(/\s+/g, ' ').trim(), rect: rect(a), dansH1: h1 ? h1.contains(a) : false, dansFil: fil ? fil.contains(a) : false })),
    fil: fil ? { texte: [...fil.children].map(c => c.textContent.replace(/\s+/g, ' ').trim()).join(' '), visible: visible(fil) } : null,
    titre: titre ? { texte: titre.textContent.trim(), rect: rect(titre), taille: getComputedStyle(titre).fontSize } : null,
    h3: h3 ? { texte: h3.textContent.trim(), couleur: getComputedStyle(h3).color } : null,
    icone: icone ? { classes: icone.className, glyphe: getComputedStyle(icone, '::before').content } : null,
    chevron: chevron && visible(chevron) ? rect(chevron) : null,
    textePrincipal: sonde('--kr-text-primary'),
    primaire: sonde('--kr-primary')
  };
};

// Composants comparés au sous-forum : [sélecteur dans l'index, sélecteur dans le sous-forum, propriétés, pseudo facultatif].
const P_BOITE = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'];
// Rayons aux quatre coins (ticket 8, story-trois-rayons-4-px-8-px-et-plein-plan) : parité entre index et sous-forum.
const P_RAYONS = ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'];
const COMPOSANTS_MOBILE = {
  'titre de page (h1)': ['#col-right > h1.page-header', '#col-right > h1.page-header', ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', ...P_BOITE, 'border-bottom-width', 'background-color']],
  'fil d\'Ariane': ['h1 .forum-mobile-breadcrumb', 'h1 .forum-mobile-breadcrumb', ['display', 'flex-wrap', 'align-items', 'column-gap', 'margin-bottom', 'color', 'font-size']],
  'lien du fil d\'Ariane': ['h1 .forum-mobile-breadcrumb-link', 'h1 .forum-mobile-breadcrumb-link', ['display', 'align-items', 'column-gap', 'min-height', 'padding-left', 'color', 'font-size', 'font-weight', 'text-decoration-line']],
  'séparateur du fil d\'Ariane': ['h1 .forum-mobile-breadcrumb-sep', 'h1 .forum-mobile-breadcrumb-sep', ['color', 'font-size']],
  'élément courant du fil d\'Ariane': ['h1 .forum-mobile-breadcrumb-current', 'h1 .forum-mobile-breadcrumb-current', ['color', 'font-size']],
  'titre': ['h1 .forum-subforum-title', 'h1 .forum-subforum-title', ['font-size', 'font-weight', 'color', 'line-height']],
  'panneau': ['#col-right .panel-default', '#fx-permanents', ['background-color', 'margin-left', 'margin-right', ...P_RAYONS]],
  'en-tête de section': ['#col-right .panel-default > .panel-heading', '#fx-permanents > .panel-heading', ['display', 'align-items', 'min-height', ...P_BOITE, 'background-color', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color', ...P_RAYONS]],
  'titre de section': ['#col-right .panel-default > .panel-heading h3', '#fx-permanents > .panel-heading h3', ['font-size', 'font-weight', 'color', 'margin-top', 'margin-bottom']],
  'chevron de repli': ['#col-right .panel-default > .panel-heading span.clickable', '#fx-permanents > .panel-heading span.clickable', ['display', 'min-width', 'min-height', 'margin-right']],
  'ligne': ['#col-right .panel-default .table > tbody > tr', '#topics tbody tr:not(.kr-topic-unread):not(.kr-topic-newmsg)', ['display', 'flex-wrap', 'align-items', 'row-gap', 'column-gap', ...P_BOITE, 'border-bottom-width', 'border-bottom-style', 'border-bottom-color', 'border-left-width', 'background-color', 'position', ...P_RAYONS]],
  'nom (lien de la ligne)': ['#col-right .panel-default .table > tbody > tr > td:first-child > p > a', '#topics tbody tr:not(.kr-topic-unread):not(.kr-topic-newmsg) td:first-child p > a', ['display', 'font-size', 'font-weight', 'color', 'line-height', 'text-decoration-line']],
  'lien étiré sur la ligne': ['#col-right .panel-default .table > tbody > tr > td:first-child > p > a', '#topics tbody tr:not(.kr-topic-unread):not(.kr-topic-newmsg) td:first-child p > a', ['content', 'position', 'top', 'right', 'bottom', 'left', 'z-index'], '::after'],
  'auteur du dernier message': ['#col-right .panel-default .table > tbody > tr > td:nth-child(4) > a.nomargin', '#topics tbody tr td:nth-child(5) > a.nomargin', ['font-size', 'font-weight', 'color', 'pointer-events', 'text-decoration-line']],
  '« Dernier : »': ['#col-right .panel-default .table > tbody > tr > td:nth-child(4) > a.nomargin', '#topics tbody tr td:nth-child(5) > a.nomargin', ['content', 'color', 'font-weight'], '::before'],
  'virgule après l\'auteur': ['#col-right .panel-default .table > tbody > tr > td:nth-child(4) > a.nomargin', '#topics tbody tr td:nth-child(5) > a.nomargin', ['content', 'color'], '::after'],
  'heure du dernier message': ['#col-right .panel-default .table > tbody > tr > td:nth-child(4) > p.mini', '#topics tbody tr td:nth-child(5) > p.mini', ['display', 'font-size', 'color', 'margin-top']],
  'bouton →': ['#col-right .panel-default .table > tbody > tr > td:nth-child(4) > p.mini .btn-group > a.btn', '#topics tbody tr td:nth-child(5) > p.mini .btn-group > a.btn', ['width', 'height', 'border-top-width', 'border-top-color', 'border-top-left-radius', 'background-color', 'color', 'font-size']],
  'groupe du bouton →': ['#col-right .panel-default .table > tbody > tr > td:nth-child(4) > p.mini .btn-group', '#topics tbody tr td:nth-child(5) > p.mini .btn-group', ['position', 'right', 'z-index', 'width', 'height', 'transform']],
  'compteur': ['#col-right .panel-default .table > tbody > tr > td:nth-child(2)', '#topics tbody tr td:nth-child(2)', ['font-size', 'color', 'line-height']],
  'séparateur des compteurs': ['#col-right .panel-default .table > tbody > tr > td:nth-child(3)', '#topics tbody tr td:nth-child(3)', ['content'], '::before']
};
const COMPOSANTS_BUREAU = {
  'titre de page (h1)': ['#col-right > h1.page-header', '#col-right > h1.page-header', ['margin-top', 'margin-bottom', 'padding-bottom', 'font-size', 'font-weight', 'color', 'border-bottom-width', 'border-bottom-color']],
  'bouton du titre': ['#col-right > h1.page-header > .pull-right > a.btn', '#col-right > h1.page-header > .pull-right > a.btn', ['font-size', ...P_BOITE, 'border-top-color', 'background-color', 'color', 'line-height', ...P_RAYONS]],
  'en-tête de section': ['#col-right .panel-default > .panel-heading', '#fx-permanents > .panel-heading', [...P_BOITE, 'background-color', 'border-bottom-width', 'border-bottom-color', ...P_RAYONS]],
  'titre de section': ['#col-right .panel-default > .panel-heading h3', '#fx-permanents > .panel-heading h3', ['font-size', 'font-weight', 'color']],
  'panneau': ['#col-right .panel-default', '#fx-permanents', ['margin-bottom', 'background-color', ...P_RAYONS]],
  'ligne': ['#col-right .panel-default .table > tbody > tr', '#topics tbody tr:not(.kr-topic-unread):not(.kr-topic-newmsg)', P_RAYONS],
  'corps du panneau': ['#col-right .panel-default > .panel-body', '#fx-permanents > .panel-body', P_BOITE],
  'en-tête de colonne': ['#col-right .panel-default .table > thead th', '#fx-permanents thead th', ['font-weight', 'color', 'background-color', ...P_BOITE]],
  'en-tête de colonne chiffrée': ['#col-right .panel-default .table > thead th:nth-child(2)', '#fx-permanents thead th:nth-child(2)', ['text-align']],
  'cellule': ['#col-right .panel-default .table > tbody > tr > td', '#topics tbody tr td', [...P_BOITE, 'vertical-align']],
  'nom (lien de la ligne)': ['#col-right .panel-default .table > tbody > tr > td:first-child > p > a', '#topics tbody tr:not(.kr-topic-unread):not(.kr-topic-newmsg) td:first-child p > a', ['font-size', 'font-weight', 'color', 'line-height']],
  'compteur': ['#col-right .panel-default .table > tbody > tr > td:nth-child(2)', '#topics tbody tr td:nth-child(2)', ['text-align', 'font-variant-numeric', 'white-space']],
  'auteur du dernier message': ['#col-right .panel-default .table > tbody > tr > td:nth-child(4) > a.nomargin', '#topics tbody tr td:nth-child(5) > a.nomargin', ['display', 'font-weight', 'color']],
  'heure du dernier message': ['#col-right .panel-default .table > tbody > tr > td:nth-child(4) > p.mini', '#topics tbody tr td:nth-child(5) > p.mini', ['display', 'font-size', 'color', 'white-space', 'margin-top']],
  'cellule du dernier message': ['#col-right .panel-default .table > tbody > tr > td:nth-child(4)', '#topics tbody tr td:nth-child(5)', ['position', 'padding-right']],
  'bouton →': ['#col-right .panel-default .table > tbody > tr > td:nth-child(4) .btn-group > a.btn', '#topics tbody tr td:nth-child(5) .btn-group > a.btn', ['width', 'height', 'border-top-width', 'border-top-color', 'border-top-left-radius', 'background-color', 'color', 'font-size']],
  'groupe du bouton →': ['#col-right .panel-default .table > tbody > tr > td:nth-child(4) .btn-group', '#topics tbody tr td:nth-child(5) .btn-group', ['position', 'right', 'width', 'height', 'transform']]
};
const cibles = (composants, cote) => Object.fromEntries(Object.entries(composants).map(([nom, [ix, sf, props, pseudo]]) => [nom, [cote === 'index' ? ix : sf, props, pseudo]]));
const ecarts = (index, modele, exception = {}) => Object.keys(modele).flatMap(nom => {
  if (!index[nom] || !modele[nom]) { return [`${nom} : ${!index[nom] ? 'absent de l\'index' : 'absent du sous-forum'}`]; }
  return Object.keys(modele[nom]).filter(p => index[nom][p] !== modele[nom][p] && !(exception[nom] || []).includes(p)).map(p => `${nom} ${p} = ${index[nom][p]} au lieu de ${modele[nom][p]}`);
});
// Exception nommée (épopée 6, ticket 6, Ask First 5) : sur ordinateur, l'index seul passe l'auteur du dernier message en couleur d'accent, le
// dernier message à droite (non mesuré par COMPOSANTS_BUREAU) et le bouton → à 34 px (son groupe porte la même taille, centré par
// translateY(-50 %) : -17 px au lieu de -16) ; le sous-forum ne change pas. Ces propriétés seules sont exclues de la comparaison au
// sous-forum ; toute autre divergence reste rouge (consigné dans le plan du ticket). Ce n'est pas un masque de base : elle tient l'écart voulu
// index ↔ sous-forum. Retrait : quand le sous-forum suit la Ligne de forum (flèche 34 px, auteur en accent, dernier message à droite) ;
// décision d'Arnaud en attente (revue-manuelle.md, harmonisation du sous-forum), puis ticket qui l'aligne.
const EXCEPTION_TICKET66 = {
  'auteur du dernier message': ['color'],
  'bouton →': ['width', 'height'],
  'groupe du bouton →': ['width', 'height', 'transform']
};

// Position du bouton du titre (bureau) : bord droit et haut du bouton par rapport au h1, dernier bouton du titre.
const POSITION_BOUTON_TITRE = () => {
  const h1 = document.querySelector('#col-right > h1.page-header');
  const boutons = h1 ? [...h1.querySelectorAll('.pull-right > a.btn')] : [];
  if (!h1 || !boutons.length) { return null; }
  const h = h1.getBoundingClientRect(); const b = boutons[boutons.length - 1].getBoundingClientRect();
  return { droite: Math.round(h.right - b.right), haut: Math.round(b.top - h.top) };
};

// Unité attendue : « 1 sujet », « 0 sujets », « 12 sujets ».
const unite = (n, un, plusieurs) => `${n} ${Number(n) === 1 ? un : plusieurs}`;
const DESCRIPTIONS = ['Forum d\'essai', 'Modérateurs', 'ModoUn', 'ModoDeux', 'ModoTrois', '[mod]'];

async function mesurerModele(width, variante) {
  const { context, page } = await open({ ...SOUS_FORUM, width, variante });
  const composants = await page.evaluate(STYLES, cibles(width < 768 ? COMPOSANTS_MOBILE : COMPOSANTS_BUREAU, 'sous-forum'));
  const bouton = await page.evaluate(POSITION_BOUTON_TITRE);
  await context.close();
  return { composants, bouton };
}

async function mesurerIndex(cle, width, variante) {
  const ix = INDEX[cle];
  const { context, page, erreurs, denied } = await open({ url: ix.url, html: ix.html, width, variante });
  const socle = await page.evaluate(SOCLE);
  const composants = await page.evaluate(STYLES, cibles(width < 768 ? COMPOSANTS_MOBILE : COMPOSANTS_BUREAU, 'index'));
  const bouton = await page.evaluate(POSITION_BOUTON_TITRE);
  const entetes = await page.evaluate(ENTETES);
  const lignes = await page.evaluate(LIGNES);
  await shot(page, `${cle}-${width}-${variante}`);
  await context.close();
  return { socle, composants, bouton, entetes, lignes, erreurs, horsFixture: denied.filter(d => d.url.startsWith(BASE + '/') && d.type !== 'font').map(d => d.url) };
}

// ---------- Mobile (375 px) ----------
if (on('mobile')) {
  console.log(`Mobile ${MOBILE} px (tactile) : index RP et Communauté comparés au sous-forum, variantes ${VARIANTES.join(' et ')}`);
  const cas = VARIANTES.flatMap(v => ['rp', 'communaute'].map(cle => ({ v, cle })));
  const modeles = Object.fromEntries(await Promise.all(VARIANTES.map(async v => [v, await mesurerModele(MOBILE, v)])));
  const res = await mapLimit(cas, c => mesurerIndex(c.cle, MOBILE, c.v));
  cas.forEach(({ v, cle }, i) => {
    const m = res[i];
    const L = m.lignes;
    const tag = `[${v}] ${INDEX[cle].url} ${MOBILE}`;
    const avecMessage = L.lignes.filter(l => l.auteur);
    check(`${tag} : thème appliqué, mode mobile, html.kr-page-forum-index posée (body.page-forum, jamais kr-subforum), aucune exception, aucune requête hors fixture`, () => {
      assert.equal(m.socle.variant, 'kr-theme-variant-' + v);
      assert.ok(m.socle.mobile && m.socle.index && m.socle.pageForum && !m.socle.subforum, JSON.stringify(m.socle));
      assert.deepEqual(m.erreurs, []);
      assert.deepEqual(m.horsFixture, []);
    });
    check(`${tag} : une seule présentation (aucune carte, un seul tableau visible, aucun bloc de compteurs ajouté), chaque forum une fois dans l'ordre natif`, () => {
      assert.equal(L.cartes, 0, 'cartes .forums-cards-container / .forum-card : ' + L.cartes);
      assert.equal(L.tableauxVisibles, 1);
      assert.equal(L.blocsPermanents, 0);
      assert.ok(L.lignes.length >= 3 && L.lignes.every(l => l.visible), JSON.stringify(L.lignes.map(l => [l.nom, l.visible])));
      const ys = L.lignes.map(l => l.ligne.y);
      assert.deepEqual(ys, [...ys].sort((a, b) => a - b), 'ordre vertical ' + ys.join(','));
    });
    // Épopée 5, entrée 2 : le panneau est une carte de section, les lignes restent dans la carte (avant : pleine largeur, de 0 à la largeur d'écran).
    check(`${tag} : lignes dans la carte de section (à 8 px des bords de l'écran au moins), sous son en-tête, en-têtes de colonnes masqués, aucun débordement horizontal`, () => {
      assert.ok(L.panneau && L.panneau.x >= 8 && L.panneau.r <= m.socle.iw - 8, `carte [${L.panneau && L.panneau.x}..${L.panneau && L.panneau.r}] à moins de 8 px des bords (écran ${m.socle.iw})`);
      assert.ok(L.lignes.every(l => l.ligne.x >= L.panneau.x && l.ligne.r <= L.panneau.r), JSON.stringify({ panneau: L.panneau, lignes: L.lignes.map(l => [l.ligne.x, l.ligne.r]) }));
      assert.ok(L.entete && L.lignes[0].ligne.y >= L.entete.b - 1, `1re ligne y=${L.lignes[0].ligne.y}, en-tête bas=${L.entete && L.entete.b}`);
      assert.equal(L.thead.visible, false);
      assert.equal(m.socle.overflowX, 0);
    });
    check(`${tag} : chaque ligne montre le nom, puis « Dernier : auteur, heure », puis « N sujets · N messages » (unités au singulier pour 1)`, () => {
      for (const l of L.lignes) {
        const compteurs = `${unite(l.sujets.natif, 'sujet', 'sujets')} · ${unite(l.messages.natif, 'message', 'messages')}`;
        assert.ok(l.texte.startsWith(l.nom + ' '), `« ${l.texte} » ne commence pas par le nom`);
        assert.ok(l.texte.includes(compteurs), `« ${l.texte} » sans « ${compteurs} »`);
        assert.ok(l.sujets.rect && l.nomRect && l.sujets.rect.y > l.nomRect.y, `compteurs sous le nom : ${JSON.stringify([l.nomRect, l.sujets.rect])}`);
        if (l.auteur) {
          assert.ok(l.texte.includes(`Dernier : ${l.auteur.texte}, ${l.date.texte}`), `« ${l.texte} » sans « Dernier : ${l.auteur.texte}, ${l.date.texte} »`);
          assert.ok(l.auteur.rect.y > l.nomRect.y && l.auteur.rect.y < l.sujets.rect.y, `ordre nom / dernier / compteurs : ${JSON.stringify([l.nomRect.y, l.auteur.rect.y, l.sujets.rect.y])}`);
        }
      }
      if (cle === 'communaute') { assert.ok(L.lignes[0].texte.includes('1 sujet · 1 message'), L.lignes[0].texte); }
    });
    check(`${tag} : bouton → de 44 × 44 px au bout de chaque ligne qui a un dernier message, lien natif #msg inchangé, touchable, nommé comme au sous-forum`, () => {
      assert.ok(avecMessage.length >= 2);
      for (const l of avecMessage) {
        assert.ok(l.fleche && l.fleche.visible && l.fleche.rect, `${l.nom} : bouton → absent`);
        assert.ok(l.fleche.rect.w >= 44 && l.fleche.rect.h >= 44, `${l.nom} : ${l.fleche.rect.w} × ${l.fleche.rect.h}`);
        assert.ok(l.ligne.r - l.fleche.rect.r <= 12 && l.fleche.rect.y >= l.ligne.y && l.fleche.rect.b <= l.ligne.b, `${l.nom} : bouton ${JSON.stringify(l.fleche.rect)} dans la ligne ${JSON.stringify(l.ligne)}`);
        assert.match(l.fleche.href, /^forum\/sujet\/[\w-]+#msg\d+$/);
        assert.equal(l.fleche.auCentre, l.fleche.href, `${l.nom} : le toucher au centre du bouton va à ${l.fleche.auCentre}`);
        assert.equal(l.fleche.nom, 'aller au dernier message', `${l.nom} : aria-label du bouton →`);
      }
    });
    check(`${tag} : toute la ligne ouvre le forum (bord gauche, compteurs, auteur, heure)`, () => {
      for (const l of L.lignes) {
        assert.ok(l.cibles.length >= 2, `${l.nom} : ${JSON.stringify(l.cibles)}`);
        for (const [ou, href] of l.cibles) { assert.equal(href, l.href, `${l.nom} : toucher « ${ou} » -> ${href}`); }
      }
    });
    check(`${tag} : ni description ni modérateurs`, () => {
      assert.ok(L.lignes.every(l => !l.descriptionVisible && !l.moderateursVisible));
      for (const mot of DESCRIPTIONS) { assert.ok(!L.texteTableau.includes(mot), `« ${mot} » visible`); }
    });
    check(`${tag} : forum sans message : « 0 sujets · 0 messages », ni dernier message ni bouton →`, () => {
      const vide = L.lignes.find(l => !l.auteur);
      assert.ok(vide, 'aucune ligne sans message dans la fixture');
      assert.equal(vide.texte, `${vide.nom} 0 sujets · 0 messages`);
      assert.equal(vide.fleche, null);
    });
    check(`${tag} : auteur avec icône : nom et icône conservés, en gras`, () => {
      const l = L.lignes.find(x => x.icone);
      assert.ok(l, 'aucun auteur avec icône dans la fixture');
      assert.ok(l.icone.visible && l.icone.w > 0, JSON.stringify(l.icone));
      assert.ok(l.auteur.visible && Number(l.auteur.graisse) >= 600, `graisse ${l.auteur.graisse}`);
      assert.ok(l.texte.includes(`Dernier : ${l.auteur.texte},`), l.texte);
    });
    check(`${tag} : en-tête de page : fil d'Ariane « Tous les forums › ${INDEX[cle].titre} » sur le lien natif (forum), puis le titre, à 16 px du bord`, () => {
      const E = m.entetes;
      assert.ok(E.fil && E.fil.visible, 'fil d\'Ariane absent');
      assert.equal(E.fil.texte, `Tous les forums › ${INDEX[cle].titre}`);
      assert.equal(E.tous.length, 1, 'liens visibles vers forum : ' + JSON.stringify(E.tous));
      assert.ok(E.tous[0].dansFil && E.tous[0].rect.h >= 44, JSON.stringify(E.tous[0]));
      assert.ok(E.titre && E.titre.texte === INDEX[cle].titre && E.titre.rect.x >= 16, JSON.stringify(E.titre));
    });
    check(`${tag} : en-tête de section : titre en couleur de texte (pas la couleur de nation), icône rendue, chevron de 44 px`, () => {
      const E = m.entetes;
      assert.equal(E.h3.couleur, E.textePrincipal);
      assert.ok(E.icone && /fa-comments-o/.test(E.icone.classes) && E.icone.glyphe !== 'none' && E.icone.glyphe !== '""', JSON.stringify(E.icone));
      assert.ok(E.chevron && E.chevron.w >= 44 && E.chevron.h >= 44, JSON.stringify(E.chevron));
    });
    check(`${tag} : même rendu que le sous-forum (en-tête de page, en-tête de section, ligne, nom, dernier message, bouton →, compteurs)`, () => {
      assert.deepEqual(ecarts(m.composants, modeles[v].composants), []);
    });
  });
}

// ---------- Bureau (1440 px) ----------
if (on('bureau')) {
  console.log(`Bureau ${BUREAU} px : index RP et Communauté comparés au sous-forum, variantes ${VARIANTES.join(' et ')}`);
  const cas = VARIANTES.flatMap(v => ['rp', 'communaute'].map(cle => ({ v, cle })));
  const modeles = Object.fromEntries(await Promise.all(VARIANTES.map(async v => [v, await mesurerModele(BUREAU, v)])));
  const res = await mapLimit(cas, c => mesurerIndex(c.cle, BUREAU, c.v));
  cas.forEach(({ v, cle }, i) => {
    const m = res[i];
    const L = m.lignes;
    const tag = `[${v}] ${INDEX[cle].url} ${BUREAU}`;
    const avecMessage = L.lignes.filter(l => l.auteur);
    check(`${tag} : thème appliqué, mode ordinateur, html.kr-page-forum-index posée, aucune exception, aucune requête hors fixture`, () => {
      assert.equal(m.socle.variant, 'kr-theme-variant-' + v);
      assert.ok(!m.socle.mobile && m.socle.index && m.socle.pageForum && !m.socle.subforum, JSON.stringify(m.socle));
      assert.deepEqual(m.erreurs, []);
      assert.deepEqual(m.horsFixture, []);
    });
    check(`${tag} : colonnes Forum, Sujets, Messages, Dernier Message (chiffres à droite, comme Msg et Vus du sous-forum), une ligne par forum dans l'ordre natif`, () => {
      assert.ok(L.thead.visible);
      assert.deepEqual(L.thead.cellules, ['Forum', 'Sujets', 'Messages', 'Dernier Message']);
      assert.deepEqual(L.thead.alignements.slice(1, 3), ['right', 'right']);
      assert.ok(L.lignes.every(l => l.affichage === 'table-row' && l.visible));
      assert.ok(L.lignes.every(l => l.sujets.alignement === 'right' && l.messages.alignement === 'right' && l.sujets.chiffres === 'tabular-nums'));
      assert.equal(L.cartes, 0);
    });
    check(`${tag} : nom seul (ni description ni modérateurs)`, () => {
      assert.ok(L.lignes.every(l => l.nomRect && !l.descriptionVisible && !l.moderateursVisible));
      for (const mot of DESCRIPTIONS) { assert.ok(!L.texteTableau.includes(mot), `« ${mot} » visible`); }
    });
    check(`${tag} : dernier message : auteur en gras, heure atténuée dessous (couleur secondaire)`, () => {
      for (const l of avecMessage) {
        assert.ok(l.auteur.visible && Number(l.auteur.graisse) >= 700, `${l.nom} : graisse ${l.auteur.graisse}`);
        assert.ok(l.date.visible && l.date.boite.y >= l.auteur.rect.b - 2, `${l.nom} : heure ${JSON.stringify(l.date.boite)} sous l'auteur ${JSON.stringify(l.auteur.rect)}`);
        assert.equal(l.date.couleur, L.secondaire, `${l.nom} : couleur de l'heure`);
        assert.equal(l.auteur.avant, 'none', `${l.nom} : pas de « Dernier : » sur ordinateur`);
      }
    });
    check(`${tag} : bouton → au bout de la ligne, lien natif #msg inchangé, nommé comme au sous-forum`, () => {
      for (const l of avecMessage) {
        assert.ok(l.fleche && l.fleche.visible, `${l.nom} : bouton → absent`);
        assert.ok(l.ligne.r - l.fleche.rect.r <= 24, `${l.nom} : bouton à ${l.ligne.r - l.fleche.rect.r} px du bout de la ligne`);
        assert.ok(l.fleche.rect.x > l.auteur.rect.x, `${l.nom} : bouton à droite de l'auteur`);
        assert.match(l.fleche.href, /^forum\/sujet\/[\w-]+#msg\d+$/);
        assert.equal(l.fleche.auCentre, l.fleche.href);
        assert.equal(l.fleche.nom, 'aller au dernier message', `${l.nom} : aria-label du bouton →`);
      }
    });
    check(`${tag} : forum sans message : compteurs 0 et 0, ni dernier message ni bouton →`, () => {
      const vide = L.lignes.find(l => !l.auteur);
      assert.ok(vide);
      assert.equal(vide.texte, `${vide.nom} 0 0`);
      assert.equal(vide.fleche, null);
    });
    check(`${tag} : auteur avec icône : nom et icône conservés, en gras`, () => {
      const l = L.lignes.find(x => x.icone);
      assert.ok(l && l.icone.visible && l.icone.w > 0 && Number(l.auteur.graisse) >= 700, JSON.stringify(l && [l.icone, l.auteur]));
    });
    check(`${tag} : en-tête de page : titre et bouton « Tous les forums » libellé à droite dans le titre, placé comme les boutons du sous-forum`, () => {
      const E = m.entetes;
      assert.equal(E.fil, null);
      assert.equal(E.tous.length, 1, JSON.stringify(E.tous));
      assert.ok(E.tous[0].dansH1 && E.tous[0].texte === 'Tous les forums', JSON.stringify(E.tous[0]));
      assert.ok(E.h1.texte.startsWith(INDEX[cle].titre), E.h1.texte);
      assert.deepEqual(m.bouton, modeles[v].bouton, `bouton du titre ${JSON.stringify(m.bouton)} / sous-forum ${JSON.stringify(modeles[v].bouton)}`);
    });
    check(`${tag} : en-tête de section : titre hors couleur de nation (couleur du sous-forum, comparée plus bas), icône rendue`, () => {
      const E = m.entetes;
      assert.notEqual(E.h3.couleur, E.primaire);
      assert.ok(E.icone && E.icone.glyphe !== 'none' && E.icone.glyphe !== '""', JSON.stringify(E.icone));
    });
    check(`${tag} : même rendu que le sous-forum (titre, bouton du titre, en-tête de section, colonnes, nom, dernier message, bouton →)`, () => {
      assert.deepEqual(ecarts(m.composants, modeles[v].composants, EXCEPTION_TICKET66), []);
    });
    check(`${tag} : aucun débordement horizontal`, () => assert.equal(m.socle.overflowX, 0));
  });
}

// ---------- Seuil (767 / 768 px) ----------
// Présentation résumée : mode, fil d'Ariane mobile, en-têtes de colonnes, affichage des lignes, taille du bouton →, cartes.
const PRESENTATION = () => {
  const visible = e => { if (!e) { return false; } const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.display !== 'none'; };
  const table = document.querySelector('#col-right .panel-default table.table');
  const fleche = table ? table.querySelector('tbody .btn-group > a.btn') : null;
  const h1 = document.querySelector('#col-right > h1.page-header');
  return {
    largeur: window.innerWidth,
    mobile: document.body.classList.contains('mobile-mode'),
    index: document.documentElement.classList.contains('kr-page-forum-index'),
    fil: visible(h1 && h1.querySelector('.forum-mobile-breadcrumb')),
    boutonDansTitre: visible(h1 && h1.querySelector('.pull-right > a[href="forum"]')),
    colonnes: visible(table && table.tHead),
    ligne: table ? getComputedStyle(table.tBodies[0].rows[0]).display : null,
    fleche: fleche ? Math.round(fleche.getBoundingClientRect().width) : null,
    cartes: document.querySelectorAll('.forums-cards-container, .forum-card').length,
    debordement: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
};
const ATTENDU = {
  mobile: { mobile: true, index: true, fil: true, boutonDansTitre: false, colonnes: false, ligne: 'flex', fleche: 44, cartes: 0, debordement: 0 },
  bureau: { mobile: false, index: true, fil: false, boutonDansTitre: true, colonnes: true, ligne: 'table-row', fleche: 34, cartes: 0, debordement: 0 }
};
const sansLargeur = p => { const { largeur: _l, ...reste } = p; return reste; };

if (on('seuil')) {
  console.log(`Seuil : 767, 768 et 769 px (variantes ${VARIANTES.join(' et ')}), puis aller-retour 767 → 768 → 767 dans le même onglet`);
  const cas = VARIANTES.flatMap(v => [767, 768, 769].map(width => ({ v, width })));
  const res = await mapLimit(cas, async ({ v, width }) => {
    const { context, page, erreurs } = await open({ ...INDEX.rp, variante: v, width, mobile: false });
    const p = await page.evaluate(PRESENTATION);
    await context.close();
    return { p, erreurs };
  });
  cas.forEach(({ v, width }, i) => {
    const attendu = width < 768 ? ATTENDU.mobile : ATTENDU.bureau;
    check(`[${v}] /forum/rp ${width} px : présentation ${width < 768 ? 'mobile' : 'ordinateur'} complète, aucune exception`, () => {
      assert.deepEqual(sansLargeur(res[i].p), attendu);
      assert.deepEqual(res[i].erreurs, []);
    });
  });
  // Aller-retour : le thème recharge la page au franchissement du seuil (anti-rebond de 400 ms) ; le second rechargement attend la fin
  // de l'écart minimal du garde-fou (sinon il afficherait le bandeau « rechargez » au lieu de recharger).
  const { context, page, erreurs } = await open({ ...INDEX.rp, variante: VARIANTES[1], width: 767, mobile: false });
  const etats = [await page.evaluate(PRESENTATION)];
  for (const width of [768, 767]) {
    if (width === 767) { await page.waitForTimeout(ECART_RECHARGEMENT_MS); }
    const charge = page.waitForEvent('load', { timeout: 15000 });
    await page.setViewportSize({ width, height: 900 });
    await charge;
    await krReady(page, { ready: THEME_READY, label: `aller-retour ${width}` });
    etats.push(await page.evaluate(PRESENTATION));
  }
  await context.close();
  check('aller-retour 767 → 768 → 767 (même onglet, rechargements du thème) : présentation mobile, ordinateur, puis mobile, aucune exception', () => {
    assert.deepEqual(etats.map(e => e.largeur), [767, 768, 767]);
    assert.deepEqual(etats.map(sansLargeur), [ATTENDU.mobile, ATTENDU.bureau, ATTENDU.mobile]);
    assert.deepEqual(erreurs, []);
  });
}

// ---------- Racine et non-régression : sous-forum, sujet, index Staff ----------
// Empreinte du rendu de #col-right : pour chaque élément (ordre du DOM), balise, classes et propriétés calculées principales, boîte.
const EMPREINTE = () => {
  const props = ['display', 'position', 'float', 'color', 'background-color', 'font-size', 'font-weight', 'line-height', 'text-align', 'margin-top', 'margin-right',
    'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-top-width', 'border-bottom-width', 'border-left-width',
    'border-bottom-color', 'visibility', 'opacity', 'order', 'flex-direction', 'grid-row'];
  const col = document.getElementById('col-right');
  return {
    html: [...document.documentElement.classList].filter(c => c !== 'kr-theme-enabled').sort().join(' '),
    corps: [...document.body.classList].sort().join(' '),
    elements: [col, ...col.querySelectorAll('*')].map(el => {
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      const gen = w => getComputedStyle(el, w).content;
      return [el.tagName, el.className && el.className.baseVal === undefined ? el.className : '', ...props.map(p => s.getPropertyValue(p)), gen('::before'), gen('::after'),
        Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)].join('|');
    })
  };
};

if (on('hors-perimetre')) {
  for (const url of ['/forum', '/forum/']) {
    for (const width of [375, 767, 768, 769, 1440]) {
      const { context, page, erreurs } = await open({ ...RACINE, url, width });
      const m = await page.evaluate(() => ({
        fil: document.querySelector('.forum-mobile-breadcrumb') !== null,
        index: document.documentElement.classList.contains('kr-page-forum-index'),
        corps: [...document.querySelectorAll('#col-right table tbody')].map(b => ({
          lignes: [...b.rows].map(r => getComputedStyle(r).display),
          unites: b.querySelectorAll('[data-kr-unit]').length,
          fleches: [...b.querySelectorAll('.btn-group > a')].every(a => a.getAttribute('aria-label'))
        })),
        groupes: [...document.querySelectorAll('#col-right table thead th:first-child')].map(h => ({ texte: h.textContent.trim(), visible: h.getBoundingClientRect().height > 0 && getComputedStyle(h).visibility === 'visible' })),
        blocs: document.querySelectorAll('.permanent-topic-stats').length,
        debordement: document.documentElement.scrollWidth - window.innerWidth
      }));
      check(`${url} ${width} : tous les groupes utilisent la nouvelle présentation, compteurs nommés et catégories visibles`, () => {
        assert.equal(m.index, true);
        assert.equal(m.fil, false);
        assert.ok(m.corps.length >= 2);
        for (const b of m.corps) {
          assert.ok(b.lignes.length > 0 && b.lignes.every(d => d === (width < 768 ? 'flex' : 'table-row')));
          assert.equal(b.unites, b.lignes.length * 2);
          assert.ok(b.fleches);
        }
        assert.ok(m.groupes.length >= 2 && m.groupes.every(d => d.visible));
        assert.deepEqual(m.groupes.map(g => g.texte), ['Forum - Jeu (RP)', 'Forum - Jeu (HRP)']);
        assert.equal(m.blocs, 0);
        assert.equal(m.debordement, 0);
        assert.deepEqual(erreurs, []);
      });
      const lignes = await page.evaluate(LIGNES);
      check(`${url} ${width} : noms, compteurs, descriptions masquées et boutons natifs utilisables dans les deux groupes`, () => {
        assert.equal(lignes.lignes.length, 8);
        assert.deepEqual(lignes.lignes.map(l => l.href), ['rp', 'hrp'].flatMap(c => ['taverne-10101', 'marche-10102', 'royaume-d-essai-10104', 'les-cadets-d-essai-10107'].map(f => `forum/${c}/${f}`)));
        for (const l of lignes.lignes) {
          assert.ok(l.visible && l.nomRect && !l.descriptionVisible && !l.moderateursVisible);
          if (width < 768) {
            assert.ok(l.texte.includes('sujet') && l.texte.includes('message'), l.texte);
            assert.ok(l.cibles.length >= 2);
            for (const [ou, href] of l.cibles) { assert.equal(href, l.href, `${l.nom} : ${ou}`); }
          }
          if (l.fleche) {
            assert.ok(l.fleche.visible && l.fleche.rect.w >= (width < 768 ? 44 : 32));
            assert.equal(l.fleche.auCentre, l.fleche.href);
          }
        }
      });
      await shot(page, `racine-${width}-${url.endsWith('/') ? 'slash' : 'simple'}`);
      await context.close();
    }
  }

  for (const url of ['/forum', '/forum/']) {
    const { context, page, erreurs } = await open({ ...RACINE, url, width: 767, mobile: false });
    const etats = [];
    for (const width of [767, 768, 767]) {
      if (width !== 767 || etats.length) {
        await page.waitForTimeout(ECART_RECHARGEMENT_MS);
        const charge = page.waitForEvent('load', { timeout: 15000 });
        await page.setViewportSize({ width, height: 900 });
        await charge;
        await krReady(page, { ready: THEME_READY, label: `racine aller-retour ${width}` });
      }
      etats.push(await page.evaluate(() => ({
        mobile: document.body.classList.contains('mobile-mode'),
        ligne: getComputedStyle(document.querySelector('tbody tr')).display,
        groupes: [...document.querySelectorAll('thead th:first-child')].every(h => h.getBoundingClientRect().height > 0)
      })));
    }
    check(`${url} : aller-retour 767 → 768 → 767, catégories toujours visibles`, () => {
      assert.deepEqual(etats, [{ mobile: true, ligne: 'flex', groupes: true }, { mobile: false, ligne: 'table-row', groupes: true }, { mobile: true, ligne: 'flex', groupes: true }]);
      assert.deepEqual(erreurs, []);
    });
    await context.close();
  }
  const avant = bundleAvant();
  check(`bundle de base disponible (KR_SCRIPT_AVANT ou commit ${COMMIT_AVANT})`, () => assert.ok(avant, 'introuvable'));
  if (avant) {
    const pages = [{ nom: 'sous-forum', ...SOUS_FORUM }, { nom: 'sujet', ...SUJET }, { nom: 'index Staff', ...STAFF }];
    const cas = pages.flatMap(p => VARIANTES.flatMap(v => [MOBILE, BUREAU].map(width => ({ ...p, v, width }))));
    console.log(`Hors périmètre : ${pages.map(p => p.nom).join(', ')} comparés au bundle de base (${COMMIT_AVANT}), ${MOBILE} et ${BUREAU} px, variantes ${VARIANTES.join(' et ')}`);
    // Masque de l'entrée 9.8 (forum mobile : classe kr-page-forum, marge de 16 px, cibles de 44 px, alerte de tête), contrôlée par
    // forum-activite (fragment confort). Seulement contre une base sans la classe de page kr-page-forum : classe ignorée, et sous 768 px,
    // des deux côtés, marge neutralisée, largeur minimale des liens remise à 0 et alerte retirée. Staff, hors de l'entrée 8, comparé sans
    // masque. Retirer quand COMMIT_AVANT dépasse 9.8.
    const masque98 = !/classes:\s*\[\s*["']kr-page-forum["']\s*\]/.test(avant);
    const CSS_98 = `${SANS_MARGE_PAGE} @media (max-width: 767px) { body.mobile-mode #col-right :is(.forum-mobile-breadcrumb-link, .user-info > strong a) { min-width: 0 !important; } }`;
    const res = await mapLimit(cas, async c => {
      const mesures = [];
      for (const src of [avant, userscript]) {
        const { context, page, erreurs } = await open({ url: c.url, html: c.html, variante: c.v, width: c.width, src });
        if (masque98 && c.width < 768 && c.url !== STAFF.url) {
          await page.addStyleTag({ content: CSS_98 });
          await page.evaluate(() => document.querySelectorAll('#col-right > .alert-dismissible').forEach(e => e.remove()));
        }
        const e = await page.evaluate(EMPREINTE);
        if (masque98) { e.html = e.html.split(' ').filter(k => k !== 'kr-page-forum').join(' '); }
        mesures.push({ e, index: await page.evaluate(() => document.documentElement.classList.contains('kr-page-forum-index')), erreurs });
        await context.close();
      }
      return mesures;
    });
    cas.forEach((c, i) => {
      const [a, p] = res[i];
      check(`[${c.v}] ${c.nom} ${c.width} px : sans html.kr-page-forum-index, rendu égal au bundle de base (${COMMIT_AVANT}) (${a.e.elements.length} éléments de #col-right), aucune exception`, () => {
        assert.equal(p.index, false);
        assert.deepEqual(p.erreurs, []);
        assert.equal(p.e.html, a.e.html, 'classes de html');
        assert.equal(p.e.corps, a.e.corps, 'classes de body');
        assert.equal(p.e.elements.length, a.e.elements.length, `éléments : ${p.e.elements.length} au lieu de ${a.e.elements.length}`);
        const k = p.e.elements.findIndex((x, j) => x !== a.e.elements[j]);
        assert.equal(k, -1, k < 0 ? '' : `élément ${k} : ${p.e.elements[k]} au lieu de ${a.e.elements[k]}`);
      });
    });
  }
  console.log('Classe de page : posée sur les quatre index et la racine, jamais sur Staff ni un sous-forum');
  const chemins = [['/forum/rp', true], ['/forum/hrp', true], ['/forum/communaute', true], ['/forum/debats', true], ['/forum/staff', false], ['/forum', true], ['/forum/', true], ['/forum/rp/taverne-10101', false]];
  const res = await mapLimit(chemins, async ([url]) => {
    const html = { '/forum/rp/taverne-10101': SOUS_FORUM.html, '/forum': RACINE.html }[url] || INDEX.rp.html;
    const { context, page } = await open({ url, html, width: MOBILE });
    const r = await page.evaluate(SOCLE);
    await context.close();
    return r;
  });
  chemins.forEach(([url, attendu], i) => {
    check(`${url} : html.kr-page-forum-index ${attendu ? 'posée' : 'absente'}`, () => assert.equal(res[i].index, attendu));
  });
}

// ---------- Peau coupée : page native intacte ----------
// #col-right comparé tel quel à la page servie sans userscript.
const COLONNE = () => {
  const col = document.getElementById('col-right').cloneNode(true);
  const table = document.querySelector('#col-right table');
  return {
    html: col.innerHTML,
    index: document.documentElement.classList.contains('kr-page-forum-index'),
    cartes: document.querySelectorAll('.forums-cards-container, .forum-card').length,
    tableau: table ? getComputedStyle(table).display : null,
    tete: window.__krScriptTete === true,
    injection: window.__krInjection || null
  };
};

if (on('peau-coupee')) {
  console.log(`Peau coupée (kr-theme-enabled = false) : index RP et Communauté à ${MOBILE} et ${BUREAU} px comparés à la page native`);
  const cas = ['rp', 'communaute', 'racine', 'racineSlash'].flatMap(cle => [MOBILE, BUREAU].map(width => ({ cle, width })));
  const res = await mapLimit(cas, async ({ cle, width }) => {
    const natif = await open({ ...INDEX[cle], width, src: null, debut: true });
    const n = await natif.page.evaluate(COLONNE);
    await natif.context.close();
    const coupe = await open({ ...INDEX[cle], width, theme: false, debut: true });
    const c = await coupe.page.evaluate(COLONNE);
    await coupe.context.close();
    return { n, c, erreurs: coupe.erreurs };
  });
  cas.forEach(({ cle, width }, i) => {
    const { n, c, erreurs } = res[i];
    check(`${INDEX[cle].url} ${width} px, peau coupée : injection en début de document des deux côtés (sans <body>), page native sans userscript`, () => {
      assert.ok(n.tete && c.tete, `script de tête : natif ${n.tete}, peau coupée ${c.tete}`);
      assert.equal(n.injection, null, 'userscript injecté dans la page native');
      assert.ok(c.injection && c.injection.body === false, `injection en début de document attendue (sans <body>) : ${JSON.stringify(c.injection)}`);
    });
    check(`${INDEX[cle].url} ${width} px, peau coupée : #col-right identique à la page native, ni classe de page ni carte, tableau natif affiché, aucune exception`, () => {
      assert.equal(c.index, false);
      assert.equal(c.cartes, 0);
      assert.equal(c.tableau, n.tableau);
      assert.equal(c.html, n.html);
      assert.deepEqual(erreurs, []);
    });
  });
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
