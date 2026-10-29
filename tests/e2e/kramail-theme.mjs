// Kramail — thème (épopée 7, entrée 1) : gardes de page sur <html> et dossiers natifs (Réception, Envoi, Corbeille) en Onglets de section
// libellés sur mobile. Pages = fixtures kramail existantes (tests/e2e/fixtures/kramail-*.html), servies en lieu et place du site.
//   gardes  : kr-page-kramail et une seule sous-garde (liste, lecture, compose) sur les 8 pages, plus « Répondre » sans textarea#dest
//             et « Signaler » (…-8-<id>, formulaire post_msg, pas une rédaction), dérivées en mémoire ; classe de rédaction sur body pour
//             les seules rédactions ; 375 et 1280 px ; injection en tête et au DOMContentLoaded.
//   onglets : 375 et 767 px, Kraland clair et Empire Brun sombre, injection en tête : trois onglets libellés en un rang pleine largeur,
//             libellé de 12 px (DESIGN Q14), retrait de 4 px, hauteur >= 44 px ; filet de 2 px dans la ligne des inactifs, filet de
//             3 px en couleur primaire dans la ligne du seul actif (600), sans bordure basse ; Nouveau, Contacts et « ••• » en carrés
//             >= 44 px, atteints par elementFromPoint.
//   bureau  : 768, 769 et 1280 px, deux variantes : styles calculés et rectangles des boutons du titre égaux au bundle de base figé, hors
//             écart de l'entrée 3 tant que la base la précède (titre, graisse et largeur des boutons : ECART_ENTETE).
//   bascule : 767, 768, 1280 puis 767 px dans le même onglet : onglets ; à 768 px boutons du titre égaux à la base (hors ECART_ENTETE) et
//             h1 aux valeurs calculées de sous-forum-debuter ; à 768 et 1280 px menu de personnage visible, dans l'écran, fermé au clic
//             extérieur ; puis onglets.
//   lecture : (épopée 7, entrée 2) une page = un message (relevé du site réel, 2026-10-29). Trois fixtures sur la structure relevée,
//             contenu inventé : kramail-lecture (Réception du compte membre, auteur forme A, sans destinataires), -recue (Réception d'un
//             personnage, forme A, 4 destinataires, signature), -envoi (Envoi, forme B, 6 boutons -15-/-16-/-17-, destinataire, signature).
//             375, 767, 1280 et 1440 px : le message a les classes et les valeurs calculées (taille, couleur, rayon, espacement) du
//             message de la fixture forum-sujet ; lien du nom natif ; signature dans le corps, destinataires gardés avant le corps,
//             aucun bloc de destinataires vide ; 768 et 1280 px : largeur de .media-body au moins celle du bundle de base.
//   lecture-plus : 320, 375 et 767 px : Répondre et Répondre à tous libellés, cibles >= 44 px atteintes, sans débordement ; « ••• »
//             ouvert au toucher, menu au-dessus d'un .dropdown-backdrop (990) avec les boutons natifs déplacés (Réception : Transférer,
//             Signaler, Supprimer, Nouveau message, Contacts ; Envoi : Transférer, Nouveau message, Contacts) ; Supprimer garde son
//             gestionnaire (fixture : gestionnaire de test, aucune requête) ; second passage du module sans effet ; 1280 px : libellés
//             dans la barre native ; Signaler (…-8-<id>) sans erreur, message cité natif.
//   lecture-couleurs : 16 variantes, 375 et 1280 px : couleurs du message égales à celles du message de forum-sujet ; aucun littéral de
//             couleur dans les règles de la lecture (kraland-theme.css).
//   entete  : (épopée 7, entrée 3) kramail-reception et kramail-lecture, 375, 767, 768, 769 et 1280 px : valeurs calculées de l'en-tête (h1, fil
//             d'Ariane, lien, séparateur, courant, tête, titre ; au bureau h1, hauteur et boutons) égales à celles de sous-forum-debuter ;
//             fil « Kramail › Personnage fictif » (liste) et « Kramail › Personnage fictif › sujet » (lecture), sélecteur sur la liste
//             seule, aucun style en ligne dans le titre ; lecture dérivée avec un bouton dans le titre : sujet sans le libellé du bouton.
//   entete-menu : kramail-reception, 375, 767 et 1280 px, deux variantes : menu de personnage ouvert au clic, rayon de 8 px, aucun style
//             en ligne, sélecteur et options >= 44 px atteints, personnage courant seul coché, fermé au clic extérieur.
//   entete-clavier : kramail-reception, 375 et 1280 px, deux variantes : Entrée ouvre le menu, Tab atteint une option au contour primaire
//             de 2 px, Entrée sur l'option suit son lien.
//   entete-couleurs : 16 variantes, 375 et 1280 px (réception), 375 px (lecture) : textes du fil, du titre et du menu ouvert >= 4,5:1.
// Confinement : refus global posé avant les routes de fixtures. Aucune requête ne quitte la machine.
//
// Usage : npm run build && npm run test:zone -- kramail
// Options : KR_SCRIPT (bundle testé), KR_SCRIPT_BASE (bundle de base, sinon celui du commit BASE_SHA), KR_FRAG (gardes, onglets, bureau, bascule,
// lecture, lecture-plus, lecture-couleurs, entete, entete-menu, entete-clavier, entete-couleurs).
// Contre-épreuve : KR_SCRIPT=<bundle de base> doit rendre gardes, onglets et bascule rouges ; KR_SCRIPT=<bundle 95119b8> rend lecture,
// lecture-plus et lecture-couleurs rouges ; KR_SCRIPT=<bundle c8c4082> rend entete, entete-menu, entete-clavier et entete-couleurs rouges.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { confineNetwork } from './lib/confinement.mjs';
import { launchBrowser } from './lib/navigateur.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, THEME_READY, domQuiet, styleSettled } from './lib/settle.mjs';
import { AVANT_TICKET73, choisirVariante } from './lib/variantes.mjs';

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
// Signaler (…-8-<id>) : la fixture de Répondre servie à l'adresse de Signaler. Structure relevée sur le site (2026-10-29) : formulaire
// post_msg complet, puis hr et div#accordion.panel-group > #collapseOne.collapse > ul.media-list.forum.t > li.media.well (message cité).
PAGES.signaler = { ...PAGES.repondre, url: MESSAGE(8), garde: 'lecture' };
// Lecture (épopée 7, entrée 2) : hors du parcours des gardes ; le message de sujet du forum sert de référence.
const LECTURES = {
  'lecture-recue': PAGE('lecture-recue', '/kramail/post/recu-fictif-0-9000003', 'lecture'),
  'lecture-envoi': PAGE('lecture-envoi', '/kramail/post/envoi-fictif-1-9000004', 'lecture'),
  forum: { url: '/forum/sujet/messages-v3-329425-1', html: FIX('forum-sujet.html') }
};
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
  const p = PAGES[cle] || LECTURES[cle];
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

// Mesures de l'en-tête (épopée 7, entrée 3), partagées par bascule et entete.
// Référence : l'en-tête de page de la fixture sous-forum-debuter (fil d'Ariane commun et titre L2 sur mobile, h1 natif au bureau).
const ENTETE_PROPS = ['display', 'flexDirection', 'alignItems', 'gap', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingBottom',
  'paddingLeft', 'fontSize', 'fontWeight', 'lineHeight', 'color', 'backgroundColor', 'borderBottomWidth', 'borderBottomStyle', 'borderBottomColor', 'minHeight', 'textDecorationLine'];
const MESURER_ENTETE = props => {
  const h1 = document.querySelector('#col-right h1.page-header');
  const lire = el => { if (!el) { return null; } const cs = getComputedStyle(el); const o = {}; for (const k of props) { o[k] = cs[k]; } return o; };
  const hauteur = Math.round(h1.getBoundingClientRect().height * 10) / 10;
  const q = sel => h1.querySelector(sel);
  const bouton = [...h1.querySelectorAll('.pull-right > a.btn-default')].find(a => !a.classList.contains('btn-primary'));
  const titre = q('.forum-subforum-title');
  return {
    hauteur, h1: lire(h1), fil: lire(q('.forum-mobile-breadcrumb')), lien: lire(q('.forum-mobile-breadcrumb-link')), sep: lire(q('.forum-mobile-breadcrumb-sep')),
    courant: lire(q('.forum-mobile-breadcrumb-current')), tete: lire(q('.forum-subforum-head')), titre: lire(titre),
    bouton: bouton && window.innerWidth >= 768 ? { fontWeight: getComputedStyle(bouton).fontWeight, paddingTop: getComputedStyle(bouton).paddingTop, paddingLeft: getComputedStyle(bouton).paddingLeft, color: getComputedStyle(bouton).color } : null,
    libelles: [...h1.querySelectorAll('.forum-mobile-breadcrumb-label')].map(e => e.textContent).concat(q('.forum-mobile-breadcrumb-current') ? ['› ' + q('.forum-mobile-breadcrumb-current').textContent] : []),
    titreTexte: titre ? (titre.querySelector('.kramail-character-current') || titre).textContent.replace(/\s+/g, ' ').trim() : null,
    styles: [h1, ...h1.querySelectorAll('*')].filter(el => el.hasAttribute('style')).map(el => el.tagName + '.' + el.className),
    selecteur: !!h1.querySelector('.kramail-character-selector'), icone: !!h1.querySelector(':scope > i.fa, .forum-subforum-head i.fa-envelope-o')
  };
};
LECTURES['sous-forum'] = { url: '/forum/hrp/debuter-20102', html: FIX('sous-forum-debuter.html') };
// Menu de personnage : ouvert au clic (toucher sur mobile), rayon de 8 px, aucun style en ligne, options de 44 px atteintes, fermé au clic extérieur
const MENU_PERSONNAGE = async page => {
  const sel = '#col-right h1.page-header .kramail-character-selector';
  const avant = await page.evaluate(s => { const d = document.querySelector(s + ' .kramail-character-dropdown'); return d ? d.getClientRects().length : -1; }, sel);
  if (avant !== 0) { return { avant }; }
  const b = await page.locator(sel + ' > span:first-child').boundingBox();
  const cible = await page.evaluate(s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { h: r.height, atteint: !!hit && e.contains(hit) }; }, sel);
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(250);
  const ouvert = await page.evaluate(s => {
    const e = document.querySelector(s); const d = e.querySelector('.kramail-character-dropdown'); const cs = getComputedStyle(d);
    const options = [...d.querySelectorAll('.kramail-character-option')].map(a => {
      const r = a.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { h: r.height, atteint: !!hit && a.contains(hit), courant: a.getAttribute('aria-current') === 'true', coche: !!a.querySelector(':scope > div > span:first-child.kramail-character-check') };
    });
    return {
      visible: d.getClientRects().length > 0, rayons: [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius],
      styles: [e, ...e.querySelectorAll('*')].filter(x => x.hasAttribute('style')).map(x => x.className), options, deborde: d.getBoundingClientRect().right > window.innerWidth + 0.5
    };
  }, sel);
  await page.mouse.click(5, 400);
  await page.waitForTimeout(250);
  const ferme = await page.evaluate(s => document.querySelector(s + ' .kramail-character-dropdown').getClientRects().length === 0, sel);
  return { avant, cible, ouvert, ferme };
};
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
// Écart voulu (épopée 7, entrée 3), base antérieure à l'entrée seulement : au bureau, le titre de la liste prend l'en-tête du sous-forum
// (comparé à sous-forum-debuter dans entete et bascule) et ses boutons la graisse du sous-forum. Ignorés : le titre, la graisse et la
// largeur des boutons (largeur et abscisse du rectangle) ; hauteur et position verticale gardées. Retrait au recalage de BASE_SHA après
// l'entrée 3 : AVANT_TICKET73 devient faux et tout est comparé.
const ECART73 = AVANT_TICKET73(BASE_BUNDLE);
const ECART_ENTETE = ECART73 ? new Set(['fontWeight', 'width']) : new Set();
const RECT_VERTICAL = rect => rect.split(',').filter((v, i) => i % 2 === 1).join(',');
const egalBase = (r, ref) => {
  expect(r.length === ref.length, `éléments : ${r.length} pour ${ref.length}`);
  r.forEach((e, i) => {
    if (i === 0 && ECART73) { return; }
    for (const k of Object.keys(e)) {
      if (ECART_ENTETE.has(k)) { continue; }
      const [a, b] = k === 'rect' && ECART73 ? [RECT_VERTICAL(e[k]), RECT_VERTICAL(ref[i][k])] : [e[k], ref[i][k]];
      expect(a === b, `${e.el} ${k} : ${a} pour ${b}`);
    }
  });
};
if (frag('bureau')) {
  console.log('bureau égal à la base ' + BASE_SHA.slice(0, 7) + ' (hors en-tête, entrée 3)');
  const cas = [];
  for (const cle of ['reception', 'envoi', 'corbeille']) { for (const width of [768, 769, 1280]) { for (const variante of ['kraland', DARK]) { cas.push({ cle, width, variante }); } } }
  const res = await mapLimit(cas, async c => {
    const lire = async bundle => { const o = await ouvrir(c.cle, { width: c.width, variante: c.variante, bundle }); const r = await o.page.evaluate(RELEVER_BUREAU); await o.context.close(); return { o, r }; };
    return { c, apres: await lire(APRES), avant: await lire(BASE_BUNDLE) };
  });
  for (const { c, apres, avant } of res) {
    check(`${c.cle} ${c.width} px ${c.variante} : boutons du titre égaux à la base`, () => {
      egalBase(apres.r, avant.r);
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
  console.log('bascule 767 / 768 / 1280 / 767 dans le même onglet');
  const res = await mapLimit(['kraland', DARK], async variante => {
    const base = await ouvrir('reception', { width: 768, variante, bundle: BASE_BUNDLE });
    const ref = await base.page.evaluate(RELEVER_BUREAU);
    await base.context.close();
    const forum = await ouvrir('sous-forum', { width: 768, variante });
    const refEntete = await forum.page.evaluate(MESURER_ENTETE, ENTETE_PROPS);
    await forum.context.close();
    const o = await ouvrir('reception', { width: 767, variante, debut: true });
    const etapes = [['767', await o.page.evaluate(MESURER_TITRE)]];
    await basculer(o.page, 768, 'reception 768');
    etapes.push(['768', await o.page.evaluate(RELEVER_BUREAU)]);
    const entete768 = await o.page.evaluate(MESURER_ENTETE, ENTETE_PROPS);
    const menu768 = await MENU_PERSONNAGE(o.page);
    await basculer(o.page, 1280, 'reception 1280');
    const menu1280 = await MENU_PERSONNAGE(o.page);
    await basculer(o.page, 767, 'reception 767 retour');
    etapes.push(['767 retour', await o.page.evaluate(MESURER_TITRE)]);
    await o.context.close();
    return { variante, o, ref, etapes, refEntete, entete768, menus: [[768, menu768], [1280, menu1280]] };
  });
  for (const { variante, o, ref, etapes, refEntete, entete768, menus } of res) {
    check(`bascule ${variante} : 767 px, onglets`, () => verifierOnglets(etapes[0][1], 'reception'));
    check(`bascule ${variante} : 768 px dans le même onglet, boutons du titre égaux à la base`, () => egalBase(etapes[1][1], ref));
    check(`bascule ${variante} : 768 px dans le même onglet, titre aux valeurs calculées de sous-forum-debuter`, () => {
      for (const k of Object.keys(refEntete.h1)) { expect(entete768.h1[k] === refEntete.h1[k], `h1 ${k} : ${entete768.h1[k]} pour ${refEntete.h1[k]}`); }
      expect(entete768.hauteur === refEntete.hauteur, `hauteur du titre : ${entete768.hauteur} pour ${refEntete.hauteur}`);
      expect(!entete768.fil && !entete768.tete, 'fil d\'Ariane ou tête mobile au bureau');
    });
    for (const [width, m] of menus) {
      check(`bascule ${variante} : ${width} px dans le même onglet, menu de personnage visible, dans l'écran, fermé au clic extérieur`, () => {
        expect(m.avant === 0, 'menu introuvable ou ouvert : ' + m.avant);
        expect(m.ouvert.visible, 'menu fermé après le clic');
        expect(!m.ouvert.deborde, 'menu hors de l\'écran');
        expect(m.ferme, 'menu ouvert après un clic extérieur');
      });
    }
    check(`bascule ${variante} : retour à 767 px, onglets`, () => { verifierOnglets(etapes[2][1], 'reception'); verifierBoutons(etapes[2][1]); sansFuite(o); });
  }
}

// ---------- lecture (épopée 7, entrée 2) ----------
const LECTURE_CLES = ['lecture', 'lecture-recue', 'lecture-envoi'];
const MESURER_MESSAGES = () => {
  const props = ['display', 'fontSize', 'lineHeight', 'fontWeight', 'color', 'backgroundColor', 'borderTopWidth', 'borderTopColor', 'borderTopLeftRadius',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'gap'];
  const lire = el => { if (!el) { return null; } const cs = getComputedStyle(el); const o = {}; for (const k of props) { o[k] = cs[k]; } return o; };
  const sonde = document.createElement('span'); sonde.style.fontSize = 'var(--kr-font-detail)'; document.body.appendChild(sonde);
  const detail = getComputedStyle(sonde).fontSize; sonde.remove();
  return [...document.querySelectorAll('#col-right > ul.media-list.forum > li.media')].map(li => {
    const date = li.querySelector('.media-body > .btn-group');
    const corps = li.querySelector('.media-body > .forum-msg');
    const dest = li.querySelector('.media-body > .kr-msg-recipients');
    const haut = el => el ? el.getBoundingClientRect().top : null;
    const bas = el => el ? el.getBoundingClientRect().bottom : null;
    return {
      classes: [...li.classList].sort().join(' '),
      li: lire(li), avatar: lire(li.querySelector('img.avatar')), nom: lire(li.querySelector('.user-info > strong')),
      date: lire(date && date.querySelector('.btn')), corps: lire(corps),
      signature: !!(corps && corps.querySelector('.kr-msg-signature')) && /Signature fictive/.test(corps.querySelector('.kr-msg-signature').textContent),
      dest: dest ? { texte: dest.textContent.replace(/\s+/g, ' ').trim(), h: dest.getBoundingClientRect().height, haut: haut(dest), bas: bas(dest), fontSize: getComputedStyle(dest).fontSize } : null,
      dateBas: bas(date), corpsHaut: haut(corps), detail,
      lien: (() => { const a = li.querySelector('.kramail-msg-sender > a') || li.querySelector('.user-info > strong > a'); return a ? a.getAttribute('href') : null; })(),
      vides: [...li.querySelectorAll('.kr-msg-recipients, .kramail-msg-recipients')].filter(e => !e.textContent.trim()).length,
      largeurs: { pullLeft: li.querySelector(':scope > .pull-left').getBoundingClientRect().width, mediaBody: li.querySelector(':scope > .media-body').getBoundingClientRect().width }
    };
  });
};
// Marge haute du li exclue : le message de sujet est précédé de son ancre <a name>, celui du kramail est le premier enfant de la liste
const ECARTS_STRUCTURE = { li: ['marginTop'] };
const comparerMessage = (m, ref, label) => {
  expect(m.classes === ref.classes, `${label} : classes « ${m.classes} » pour « ${ref.classes} »`);
  for (const part of ['li', 'avatar', 'nom', 'date', 'corps']) {
    expect(m[part] && ref[part], `${label} ${part} : absent`);
    for (const k of Object.keys(ref[part])) {
      if ((ECARTS_STRUCTURE[part] || []).includes(k)) { continue; }
      expect(m[part][k] === ref[part][k], `${label} ${part} ${k} : ${m[part][k]} pour ${ref[part][k]}`);
    }
  }
};
const LARGEURS_LECTURE = [[375, true], [767, true], [1280, false], [1440, false]];
// Lien natif du nom affiché, par fixture (le bundle 95119b8 lisait .cartouche strong a et posait href="#" sur .kramail-msg-sender > a en forme A)
const LIENS_NOM = { lecture: 'communaute/membres/marelle-duvent-1-2', 'lecture-recue': 'communaute/membres/marelle-duvent-1-2', 'lecture-envoi': 'communaute/membres/personnage-fictif-2-5' };
const LARGEURS_BASE = [768, 1280];
if (frag('lecture')) {
  console.log('lecture : message de sujet du forum');
  const cas = [];
  for (const [width, mobile] of LARGEURS_LECTURE) { for (const cle of LECTURE_CLES.concat('forum')) { cas.push({ cle, width, mobile }); } }
  for (const width of LARGEURS_BASE) { for (const cle of LECTURE_CLES) { cas.push({ cle, width, mobile: false, base: true }); cas.push({ cle, width, mobile: false, apres: true }); } }
  const res = await mapLimit(cas, async c => {
    const o = await ouvrir(c.cle, { width: c.width, height: c.mobile ? 667 : 720, mobile: c.mobile, bundle: c.base ? BASE_BUNDLE : APRES });
    const m = await o.page.evaluate(MESURER_MESSAGES);
    await o.context.close();
    return { c, o, m };
  });
  // Ordinateur : le message garde au moins la largeur de base (la barre native ne le réduit pas), formes A et B
  for (const width of LARGEURS_BASE) {
    for (const cle of LECTURE_CLES) {
      const b = res.find(r => r.c.base && r.c.cle === cle && r.c.width === width).m[0].largeurs;
      const a = res.find(r => r.c.apres && r.c.cle === cle && r.c.width === width).m[0].largeurs;
      check(`${cle} ${width} px : largeur de .media-body au moins celle de la base`, () => {
        expect(a.mediaBody >= b.mediaBody - 0.5, `.media-body ${a.mediaBody} pour ${b.mediaBody} (base) ; .pull-left ${a.pullLeft} pour ${b.pullLeft}`);
      });
    }
  }
  for (const [width] of LARGEURS_LECTURE) {
    const ref = res.find(r => r.c.cle === 'forum' && r.c.width === width).m[0];
    for (const { c, o, m } of res.filter(r => r.c.cle !== 'forum' && r.c.width === width && !r.c.base && !r.c.apres)) {
      check(`${c.cle} ${width} px : un message aux classes et valeurs du message de sujet, lien du nom natif`, () => {
        expect(m.length === 1, 'messages : ' + m.length);
        comparerMessage(m[0], ref, 'message');
        expect(m[0].lien === LIENS_NOM[c.cle], `lien du nom : ${m[0].lien} pour ${LIENS_NOM[c.cle]}`);
        expect(m[0].vides === 0, `bloc de destinataires vide : ${m[0].vides}`);
        sansFuite(o);
      });
      if (c.cle === 'lecture') {
        check(`${c.cle} ${width} px : sans destinataires, aucun bloc de destinataires`, () => { expect(m[0].dest === null, 'destinataires : ' + JSON.stringify(m[0].dest)); });
        continue;
      }
      check(`${c.cle} ${width} px : signature dans le corps, destinataires gardés avant le corps`, () => {
        const x = m[0];
        expect(x.signature, 'signature hors du corps');
        expect(x.dest && x.dest.h > 0 && /^Envoyé à : /.test(x.dest.texte), 'destinataires ' + JSON.stringify(x.dest));
        expect(x.dest.bas <= x.corpsHaut + 0.5, `destinataires ${x.dest.haut}-${x.dest.bas}, corps ${x.corpsHaut}`);
        // Mobile : ligne 4 de la grille V3, sous la date ; ordinateur : position native, avant la date
        if (c.mobile) {
          expect(x.dest.haut >= x.dateBas - 0.5, `destinataires ${x.dest.haut}, date ${x.dateBas}`);
          expect(x.dest.fontSize === x.detail, `destinataires ${x.dest.fontSize} au lieu du rôle détail ${x.detail}`);
        }
      });
    }
  }
}

const MESURER_ACTIONS = () => {
  const pseudo = el => getComputedStyle(el, '::after').content;
  const mesure = el => {
    const b = el.getBoundingClientRect(); const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    return { libelle: pseudo(el), w: b.width, h: b.height, atteint: !!hit && (hit === el || el.contains(hit)), visible: b.width > 0 && getComputedStyle(el).visibility !== 'hidden' };
  };
  return {
    libelles: [...document.querySelectorAll('a.btn[data-kr-libelle]')].map(mesure),
    titre: [...document.querySelectorAll('h1.page-header .pull-right > a.btn[data-kr-libelle]')].length,
    kebab: (() => { const t = document.querySelector('h1.page-header .pull-right > .kramail-post-kebab > .dropdown-toggle'); return t ? mesure(t) : null; })()
  };
};
const MENU_OUVERT_SOUS_VOILE = () => {
  const voile = document.createElement('div');
  voile.className = 'dropdown-backdrop';
  voile.style.cssText = 'position:fixed;inset:0;z-index:990';
  document.body.appendChild(voile);
  const menu = document.querySelector('.kramail-post-kebab > .dropdown-menu');
  const items = [...menu.querySelectorAll('li > a')];
  const r = {
    ouvert: menu.closest('.kramail-post-kebab').classList.contains('open'),
    atteints: items.map(a => { const b = a.getBoundingClientRect(); const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return !!hit && (hit === a || a.contains(hit)); })
  };
  voile.remove();
  return r;
};
const MENU_OUVERT = () => {
  const menu = document.querySelector('.kramail-post-kebab > .dropdown-menu');
  const items = [...menu.querySelectorAll('li > a')];
  const sonde = document.createElement('div'); sonde.style.boxShadow = 'var(--kr-shadow-lg)'; document.body.appendChild(sonde);
  const ombre = getComputedStyle(sonde).boxShadow; sonde.remove();
  return {
    ombre: getComputedStyle(menu).boxShadow === ombre, ombreLue: getComputedStyle(menu).boxShadow,
    ouvert: menu.closest('.kramail-post-kebab').classList.contains('open') && getComputedStyle(menu).display !== 'none',
    items: items.map(a => a.textContent.replace(/\s+/g, ' ').trim()),
    atteints: items.map(a => { const b = a.getBoundingClientRect(); const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return !!hit && (hit === a || a.contains(hit)); }),
    hauteurs: items.map(a => a.getBoundingClientRect().height)
  };
};
// Second passage : source du module Kramail:Lecture lue dans le template (le bundle est minifié), rejouée seule dans la page déjà
// traitée ; contre-épreuve par mutation du template (garde kramail-actions-moved retirée)
const MODULE_LECTURE = (() => {
  const tpl = fs.readFileSync(path.join(root, 'kraland-userscript-template.js'), 'utf8');
  const fin = tpl.indexOf("InitQueue.register('Kramail:Lecture'");
  const debut = tpl.indexOf('(function () {', tpl.indexOf('// MODULE : Kramail:Lecture'));
  return fin < 0 || debut < 0 ? null : tpl.slice(debut, tpl.indexOf('})();', fin) + 5);
})();
// Gestionnaire de test sur Supprimer (alertdel), posé avant le userscript comme celui du site ; il ne fait que compter
const GESTIONNAIRE_SUPPRIMER = '<script>document.querySelectorAll(\'.forum-top a.alertdel\').forEach(function (a) { a.addEventListener(\'click\', function (e) { e.preventDefault(); window.__krSupprimer = (window.__krSupprimer || 0) + 1; }); });</script>\n</body>';
const ITEMS_MENU = { lecture: 'Transférer|Signaler|Supprimer|Nouveau message|Contacts', 'lecture-recue': 'Transférer|Signaler|Supprimer|Nouveau message|Contacts', 'lecture-envoi': 'Transférer|Nouveau message|Contacts' };
if (frag('lecture-plus')) {
  console.log('lecture : Répondre et Répondre à tous libellés, autres actions dans « ••• »');
  for (const cle of LECTURE_CLES) {
    const p = PAGES[cle] || LECTURES[cle];
    const html = p.html.replace('</body>', GESTIONNAIRE_SUPPRIMER);
    if (html === p.html) { console.error(cle + ' : </body> introuvable'); process.exit(2); }
    LECTURES[cle + '-suppr'] = { ...p, html };
  }
  const cas = [];
  for (const cle of LECTURE_CLES) { for (const width of [320, 375, 767]) { cas.push({ cle, width, mobile: true }); } cas.push({ cle, width: 1280, mobile: false }); }
  const res = await mapLimit(cas, async c => {
    const o = await ouvrir(c.cle + '-suppr', { width: c.width, height: c.mobile ? 667 : 720, mobile: c.mobile });
    await o.page.evaluate(() => window.scrollTo(0, 0));
    // Second passage du module : sans effet (idempotent)
    const avant = await o.page.evaluate(() => document.getElementById('col-right').innerHTML);
    await o.page.addScriptTag({ content: `(function (InitQueue, createMoreButton) {\n${MODULE_LECTURE}\n})({ register: (n, f) => f() }, () => {});` });
    const apres = await o.page.evaluate(() => document.getElementById('col-right').innerHTML);
    const m = await o.page.evaluate(MESURER_ACTIONS);
    m.deborde = await o.page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    m.idempotent = avant === apres;
    let menu = null;
    let voile = null;
    if (c.mobile && m.kebab) {
      const t = await o.page.locator('h1.page-header .kramail-post-kebab > .dropdown-toggle').first().boundingBox();
      await o.page.touchscreen.tap(t.x + t.width / 2, t.y + t.height / 2);
      await o.page.waitForTimeout(100);
      menu = await o.page.evaluate(MENU_OUVERT);
      // Voile de Bootstrap 3 sur tactile (.dropdown-backdrop, z-index 990) laissé par un autre menu : le menu reste au-dessus
      voile = await o.page.evaluate(MENU_OUVERT_SOUS_VOILE);
      // Supprimer : nœud natif déplacé, son gestionnaire (posé par la page de test, il ne fait que compter) répond
      menu.supprimer = await o.page.evaluate(() => {
        const a = document.querySelector('.kramail-post-kebab > .dropdown-menu > li > a.alertdel');
        if (!a) { return null; }
        a.click();
        return window.__krSupprimer || 0;
      });
    }
    await o.context.close();
    return { c, o, m, menu, voile };
  });
  for (const { c, o, m, menu, voile } of res) {
    check(`${c.cle} ${c.width} px : Répondre et Répondre à tous libellés, visibles, ${c.mobile ? '>= 44 px, ' : ''}atteints`, () => {
      expect(m.libelles.map(l => l.libelle).join('|') === '"Répondre"|"Répondre à tous"', 'libellés : ' + m.libelles.map(l => l.libelle).join('|'));
      expect(m.titre === (c.mobile ? 2 : 0), `boutons libellés dans le titre : ${m.titre}`);
      for (const l of m.libelles) {
        expect(l.visible && l.atteint, `${l.libelle} : visible ${l.visible}, atteint ${l.atteint}`);
        if (c.mobile) { expect(l.w >= 44 && l.h >= 44, `${l.libelle} : ${l.w}×${l.h}`); }
      }
      sansFuite(o);
    });
    if (!c.mobile) { continue; }
    check(`${c.cle} ${c.width} px : « ••• » ouvert au toucher, menu au-dessus du voile 990`, () => {
      expect(m.kebab && m.kebab.w >= 44 && m.kebab.h >= 44 && m.kebab.atteint, '••• : ' + JSON.stringify(m.kebab));
      expect(menu && menu.ouvert, 'menu fermé après le toucher');
      expect(menu.items.join('|') === ITEMS_MENU[c.cle], 'éléments : ' + menu.items.join('|'));
      expect(menu.ombre, 'ombre du menu hors du jeton --kr-shadow-lg : ' + menu.ombreLue);
      expect(menu.hauteurs.every(h => h >= 44), 'hauteurs : ' + menu.hauteurs.join(', '));
      expect(menu.atteints.every(Boolean), 'éléments non atteints : ' + menu.atteints.join(', '));
      expect(voile.ouvert && voile.atteints.every(Boolean), 'sous le voile : ' + JSON.stringify(voile));
    });
    check(`${c.cle} ${c.width} px : sans débordement, second passage sans effet${c.cle === 'lecture-envoi' ? '' : ', Supprimer garde son gestionnaire'}`, () => {
      expect(!m.deborde, 'débordement horizontal');
      expect(m.idempotent, 'second passage du module : DOM modifié');
      expect(menu.supprimer === (c.cle === 'lecture-envoi' ? null : 1), 'gestionnaire de Supprimer : ' + menu.supprimer);
    });
  }
  // Signaler : formulaire post_msg puis message cité (#accordion #collapseOne ul.media-list.forum.t > li.media.well), laissé natif
  const CITE = () => {
    const li = document.querySelector('#accordion #collapseOne ul.media-list.forum > li.media');
    const info = li.querySelector('.user-info');
    return {
      garde: document.documentElement.classList.contains('kr-page-kramail-lecture'),
      li: li.className, ordre: [...info.children].map(e => e.tagName.toLowerCase() + (e.className ? '.' + e.className : '')).join(' '),
      t: li.querySelector('.media-body > .t').className, marques: li.querySelectorAll('.kr-msg-signature, .kr-msg-recipients, [data-kr-libelle]').length,
      nom: getComputedStyle(info.querySelector('strong')).fontSize, titre: document.querySelectorAll('h1.page-header .kramail-post-kebab').length
    };
  };
  for (const [width, mobile] of [[375, true], [1280, false]]) {
    const o = await ouvrir('signaler', { width, height: mobile ? 667 : 720, mobile });
    const r = await o.page.evaluate(CITE);
    await o.context.close();
    const ob = await ouvrir('signaler', { width, height: mobile ? 667 : 720, mobile, bundle: BASE_BUNDLE });
    const rb = await ob.page.evaluate(CITE);
    await ob.context.close();
    check(`signaler ${width} px : page de lecture, message cité natif, aucune erreur`, () => {
      expect(r.garde, JSON.stringify(r));
      expect(r.li === 'media well' && r.ordre === 'img.avatar img-thumbnail strong div.cartouche' && r.t === 't' && r.marques === 0 && r.titre === 0, JSON.stringify(r));
      if (!mobile) { expect(r.nom === rb.nom, `nom du message cité : ${r.nom} pour ${rb.nom} (base)`); }
      expect(o.errors.length === 0, 'erreurs de page : ' + o.errors.join(' | '));
    });
  }
}

const MESURER_COULEURS = () => {
  const props = ['color', 'backgroundColor', 'borderTopColor', 'borderBottomColor', 'boxShadow'];
  const li = document.querySelector('#col-right > ul.media-list.forum > li.media');
  const q = sel => li.querySelector(sel);
  const els = { li, avatar: q('img.avatar'), nom: q('.user-info > strong'), lien: q('.user-info > strong a'), date: q('.media-body > .btn-group > .btn'), corps: q('.media-body > .forum-msg') };
  const o = {};
  for (const [k, el] of Object.entries(els)) { if (!el) { o[k] = 'absent'; continue; } const cs = getComputedStyle(el); o[k] = props.map(p => p + '=' + cs[p]).join(' '); }
  return o;
};
// Règles de la lecture : sélecteurs propres à la page (hors règles de la liste, gardées :not(.kr-page-kramail-lecture)), aux boutons
// libellés, au menu « ••• » de la lecture et à l'ancienne carte (kramail-msg-*)
const REGLES_LECTURE = /kr-page-kramail-lecture|data-kr-libelle|kramail-post-|kramail-msg-|kramail-actions-moved/;
const REGLES_LISTE = /:not\(\.kr-page-kramail-lecture\)/;
const LITTERAL_COULEUR = /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i;
if (frag('lecture-couleurs')) {
  console.log('lecture : couleurs du message de sujet, 16 variantes');
  const { VARIANTES } = await import('./lib/variantes.mjs');
  const cas = [];
  for (const variante of VARIANTES) { for (const [width, mobile] of [[375, true], [1280, false]]) { for (const cle of ['lecture-recue', 'lecture-envoi', 'forum']) { cas.push({ cle, width, mobile, variante }); } } }
  const res = await mapLimit(cas, async c => {
    const o = await ouvrir(c.cle, { width: c.width, height: c.mobile ? 667 : 720, mobile: c.mobile, variante: c.variante });
    const m = await o.page.evaluate(MESURER_COULEURS);
    await o.context.close();
    return { c, m };
  });
  for (const variante of VARIANTES) {
    for (const width of [375, 1280]) {
      const f = res.find(r => r.c.cle === 'forum' && r.c.variante === variante && r.c.width === width).m;
      for (const cle of ['lecture-recue', 'lecture-envoi']) {
        const k = res.find(r => r.c.cle === cle && r.c.variante === variante && r.c.width === width).m;
        check(`${cle} ${variante} ${width} px : couleurs du message égales au message de sujet`, () => {
          for (const part of Object.keys(f)) { expect(k[part] === f[part], `${part} : ${k[part]} pour ${f[part]}`); }
        });
      }
    }
  }
  check('CSS du bundle : aucun littéral de couleur dans les règles de la lecture', () => {
    const css = APRES.replace(/\/\*[\s\S]*?\*\//g, '');
    const fautes = [];
    for (const [, sel, decl] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      if (REGLES_LECTURE.test(sel) && !REGLES_LISTE.test(sel) && LITTERAL_COULEUR.test(decl)) { fautes.push(sel.trim().split('\n').pop() + ' { ' + decl.trim().split('\n').find(l => LITTERAL_COULEUR.test(l)).trim() + ' }'); }
    }
    expect(fautes.length === 0, fautes.length + ' règle(s) : ' + fautes.slice(0, 3).join(' ; '));
  });
}

// ---------- en-tête (épopée 7, entrée 3) ----------
const ENTETE_ATTENDU = {
  reception: { libelles: ['Kramail', '› Personnage fictif'], titre: 'Personnage fictif', selecteur: true },
  lecture: { libelles: ['Kramail', 'Personnage fictif', '› Sujet fictif de lecture'], titre: 'Sujet fictif de lecture', selecteur: false }
};
// Seuil : 767, 768 et 769 px
const ENTETE_LARGEURS = [375, 767, 768, 769, 1280];
// Lecture dérivée en mémoire avec un bouton dans le titre (.pull-right, comme la liste) : le sujet reste le seul texte direct du h1
LECTURES['lecture-boutons'] = { ...PAGES.lecture, html: PAGES.lecture.html.replace(/Sujet fictif de lecture\s*<\/h1>/, 'Sujet fictif de lecture\n<span class="pull-right"><a href="kramail" class="btn btn-default">Réception</a></span></h1>') };
if (frag('entete')) {
  console.log('en-tête : valeurs calculées de l\'en-tête de sous-forum-debuter');
  const cas = [];
  for (const cle of ['sous-forum', 'reception', 'lecture']) { for (const width of ENTETE_LARGEURS) { cas.push({ cle, width, mobile: width < 768 }); } }
  cas.push({ cle: 'lecture-boutons', width: 375, mobile: true });
  const res = await mapLimit(cas, async c => {
    const o = await ouvrir(c.cle, { width: c.width, height: c.mobile ? 667 : 720, mobile: c.mobile });
    const m = await o.page.evaluate(MESURER_ENTETE, ENTETE_PROPS);
    await o.context.close();
    return { c, o, m };
  });
  for (const width of ENTETE_LARGEURS) {
    const ref = res.find(r => r.c.cle === 'sous-forum' && r.c.width === width).m;
    for (const cle of ['reception', 'lecture']) {
      const { o, m } = res.find(r => r.c.cle === cle && r.c.width === width);
      const att = ENTETE_ATTENDU[cle];
      check(`${cle} ${width} px : en-tête aux valeurs calculées de sous-forum-debuter`, () => {
        const parts = width < 768 ? ['h1', 'fil', 'lien', 'sep', 'courant', 'tete', 'titre'] : ['h1', 'bouton'];
        for (const part of parts) {
          if (part === 'bouton' && !m.bouton) { continue; }
          expect(m[part] && ref[part], `${part} absent (kramail ${!!m[part]}, sous-forum ${!!ref[part]})`);
          for (const k of Object.keys(ref[part])) { expect(m[part][k] === ref[part][k], `${part} ${k} : ${m[part][k]} pour ${ref[part][k]}`); }
        }
        if (width >= 768) {
          expect(!m.fil && !m.tete, 'fil d\'Ariane ou tête mobile au bureau');
          expect(m.hauteur === ref.hauteur, `hauteur du titre : ${m.hauteur} pour ${ref.hauteur}`);
        }
        sansFuite(o);
      });
      check(`${cle} ${width} px : ${width < 768 ? 'fil « ' + att.libelles.join(' ') + ' », titre « ' + att.titre + ' », ' : ''}sélecteur ${att.selecteur ? 'présent' : 'absent'}, aucun style en ligne`, () => {
        if (width < 768) {
          expect(m.libelles.join('|') === att.libelles.join('|'), 'fil : ' + m.libelles.join('|'));
          expect(m.titreTexte === att.titre, 'titre : ' + m.titreTexte);
          expect(!m.icone, 'icône native gardée dans le titre');
        }
        expect(m.selecteur === att.selecteur, 'sélecteur : ' + m.selecteur);
        expect(m.styles.length === 0, 'styles en ligne : ' + m.styles.join(', '));
      });
    }
  }
  const { m: mb } = res.find(r => r.c.cle === 'lecture-boutons');
  check('lecture avec un bouton dans le titre 375 px : sujet = texte direct du h1, sans le libellé du bouton', () => {
    expect(mb.titreTexte === 'Sujet fictif de lecture', 'titre : ' + mb.titreTexte);
    expect(mb.libelles.at(-1) === '› Sujet fictif de lecture', 'fil : ' + mb.libelles.join('|'));
  });
}

if (frag('entete-menu')) {
  console.log('en-tête : menu de personnage');
  const cas = [375, 767, 1280].flatMap(width => ['kraland', DARK].map(variante => ({ width, variante, mobile: width < 768 })));
  const res = await mapLimit(cas, async c => {
    const o = await ouvrir('reception', { width: c.width, height: c.mobile ? 667 : 720, mobile: c.mobile, variante: c.variante });
    const m = await MENU_PERSONNAGE(o.page);
    await o.context.close();
    return { c, o, m };
  });
  for (const { c, o, m } of res) {
    check(`reception ${c.width} px ${c.variante} : menu ouvrable, rayon 8 px, aucun style en ligne, options >= 44 px atteintes, fermé au clic extérieur`, () => {
      expect(m.avant === 0, 'menu introuvable ou ouvert au chargement : ' + m.avant);
      if (c.mobile) { expect(m.cible.h >= 44 && m.cible.atteint, 'sélecteur : ' + JSON.stringify(m.cible)); }
      expect(m.ouvert.visible, 'menu fermé après le clic');
      expect(m.ouvert.rayons.every(r => r === '8px'), 'rayons : ' + m.ouvert.rayons.join(' '));
      expect(m.ouvert.styles.length === 0, 'styles en ligne : ' + m.ouvert.styles.join(', '));
      expect(m.ouvert.options.length === 2 && m.ouvert.options.every(x => x.h >= 44 && x.atteint), 'options : ' + JSON.stringify(m.ouvert.options));
      expect(m.ouvert.options.filter(x => x.courant).length === 1 && m.ouvert.options.every(x => x.coche === x.courant), 'personnage courant : ' + JSON.stringify(m.ouvert.options));
      expect(!m.ouvert.deborde, 'menu hors de l\'écran');
      expect(m.ferme, 'menu ouvert après un clic extérieur');
      sansFuite(o);
    });
  }
}

// Clavier : Entrée sur le sélecteur ouvre le menu, Tab atteint une option (contour primaire de 2 px au focus clavier), Entrée sur l'option
// suit son lien (navigation demandée vers son href)
if (frag('entete-clavier')) {
  console.log('en-tête : menu de personnage au clavier');
  const cas = [[375, true], [1280, false]].flatMap(([width, mobile]) => ['kraland', DARK].map(variante => ({ width, mobile, variante })));
  const res = await mapLimit(cas, async c => {
    const o = await ouvrir('reception', { width: c.width, height: c.mobile ? 667 : 720, mobile: c.mobile, variante: c.variante });
    const sel = '#col-right h1.page-header .kramail-character-selector';
    if (!(await o.page.$(sel))) { await o.context.close(); return { c, ouvert: false }; }
    await o.page.focus(sel);
    await o.page.keyboard.press('Enter');
    await o.page.waitForTimeout(250);
    const ouvert = await o.page.evaluate(s => document.querySelector(s).getAttribute('aria-expanded') === 'true', sel);
    let option = null;
    for (let i = 0; i < 4 && !option; i++) {
      await o.page.keyboard.press('Tab');
      option = await o.page.evaluate(() => {
        const a = document.activeElement;
        if (!a || !a.matches('.kramail-character-option') || a.getAttribute('aria-current') === 'true') { return null; }
        const cs = getComputedStyle(a); const sonde = document.createElement('span'); sonde.style.color = 'var(--kr-primary)'; document.body.appendChild(sonde);
        const primaire = getComputedStyle(sonde).color; sonde.remove();
        return { href: a.href, visible: a.matches(':focus-visible'), outline: [cs.outlineStyle, cs.outlineWidth, cs.outlineColor], primaire };
      });
    }
    let cible = null;
    if (option) {
      const nav = o.page.waitForRequest(r => r.isNavigationRequest() && r.frame() === o.page.mainFrame(), { timeout: 3000 }).then(r => r.url()).catch(() => null);
      await o.page.keyboard.press('Enter');
      cible = await nav;
    }
    await o.context.close();
    return { c, ouvert, option, cible };
  });
  for (const { c, ouvert, option, cible } of res) {
    check(`reception ${c.width} px ${c.variante} : menu ouvert à Entrée, option atteinte par Tab au contour primaire, Entrée suit son lien`, () => {
      expect(ouvert, 'menu fermé après Entrée sur le sélecteur');
      expect(option, 'aucune option non courante atteinte par Tab');
      expect(option.visible && option.outline[0] === 'solid' && option.outline[1] === '2px' && option.outline[2] === option.primaire, 'contour au focus clavier : ' + JSON.stringify(option));
      expect(cible === option.href, `navigation : ${cible} pour ${option.href}`);
    });
  }
}

if (frag('entete-couleurs')) {
  console.log('en-tête : contraste >= 4,5:1, 16 variantes');
  const { VARIANTES, CONTRASTE } = await import('./lib/variantes.mjs');
  // Lecture : fil et titre du sujet sur mobile seul (au bureau, h1 natif)
  const SELS = {
    reception: ['.forum-mobile-breadcrumb-link', '.forum-mobile-breadcrumb-sep', '.forum-mobile-breadcrumb-current', '.kramail-character-current', '.kramail-dropdown-icon',
      '.kramail-character-option-name', '.kramail-character-check', '.kramail-character-category'],
    lecture: ['.forum-mobile-breadcrumb-link', '.forum-mobile-breadcrumb-sep', '.forum-mobile-breadcrumb-current', '.forum-subforum-title']
  };
  const cas = VARIANTES.flatMap(variante => [['reception', 375, true], ['reception', 1280, false], ['lecture', 375, true]].map(([cle, width, mobile]) => ({ cle, variante, width, mobile })));
  const res = await mapLimit(cas, async c => {
    const o = await ouvrir(c.cle, { width: c.width, height: c.mobile ? 667 : 720, mobile: c.mobile, variante: c.variante });
    await o.page.evaluate(CONTRASTE);
    await o.page.evaluate(() => { const s = document.querySelector('#col-right h1.page-header .kramail-character-selector'); if (s) { s.click(); } });
    await o.page.waitForTimeout(250);
    const r = await o.page.evaluate(sels => {
      const h1 = document.querySelector('#col-right h1.page-header');
      return sels.map(s => { const e = h1.querySelector(s); return { s, ok: !!e && e.getClientRects().length > 0, c: e ? window.__krContraste.texte(e) : 0 }; });
    }, SELS[c.cle]);
    await o.context.close();
    return { c, r };
  });
  for (const { c, r } of res) {
    check(`${c.cle} ${c.variante} ${c.width} px : textes de l'en-tête${c.cle === 'reception' ? ' et du menu' : ''} >= 4,5:1`, () => {
      const vus = r.filter(x => x.ok);
      expect(vus.length === (c.cle === 'lecture' ? 4 : c.mobile ? 8 : 5), 'éléments visibles : ' + vus.map(x => x.s).join(', '));
      const bas = vus.filter(x => x.c < 4.5);
      expect(bas.length === 0, bas.map(x => `${x.s} ${x.c.toFixed(2)}`).join(', '));
    });
  }
}

await browser.close();
console.log(`\n${passes} ok, ${failures} échec(s)`);
process.exit(failures ? 1 : 0);
