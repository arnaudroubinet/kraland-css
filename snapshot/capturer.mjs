// Galerie de captures : un dossier par thème, un sous-dossier par palier de dimensions, une capture par écran.
//
//   npm run snapshot                                   # tout (16 thèmes × 7 paliers × tous les écrans), puis l'index
//   npm run snapshot -- --themes kraland,paladium-dark  # quelques thèmes
//   npm run snapshot -- --paliers mobile,ordinateur     # quelques paliers
//   npm run snapshot -- --ecrans accueil,plateau        # quelques écrans
//   npm run snapshot -- --index                         # régénère seulement snapshot/manifest.js
//   npm run snapshot -- --sans-compression              # garde les PNG bruts (sinon palette 256 couleurs, compresser.py)
//
// Banc : les fixtures du dépôt (tests/e2e/fixtures) servies à leurs vraies adresses www.kraland.org, les feuilles natives du site
// (tests/e2e/vendor/parler), Font Awesome 5.6.3 et les polices Lato, Reenie Beanie et Roboto des devDependencies ; toute autre requête
// est bloquée (aucun accès au site réel, aucun envoi). Le bundle construit (kraland-userscript-main.user.js) est injecté comme
// Tampermonkey le ferait, la variante étant lue dans le stockage local comme pour un joueur qui l'a choisie.
// Adapté du banc « espace mobile » (rapport-espace-mobile/banc/lib.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(ICI, '..');
const FIX = path.join(RACINE, 'tests/e2e/fixtures');
const NATIF = path.join(RACINE, 'tests/e2e/vendor/parler');
const MODULES = path.join(RACINE, 'node_modules');
const FA = path.join(MODULES, '@fortawesome/fontawesome-free');
const BASE = 'http://www.kraland.org';
const VERSION_URL = /^https:\/\/raw\.githubusercontent\.com\/arnaudroubinet\/kraland-css\/.*\/version\.json$/;

// ---------- Thèmes : les 16 choix du panneau d'options (CONFIG.THEME_VARIANTS sans high-contrast, que le panneau ne propose pas) ----------
export const THEMES = [
  { id: 'kraland', nom: 'République de Kraland' },
  { id: 'kraland-dark', nom: 'République de Kraland (sombre)' },
  { id: 'empire-brun', nom: 'Empire Brun' },
  { id: 'empire-brun-dark', nom: 'Empire Brun (sombre)' },
  { id: 'paladium', nom: 'Paladium Corporation' },
  { id: 'paladium-dark', nom: 'Paladium Corporation (sombre)' },
  { id: 'theocratie-seelienne', nom: 'Théocratie Seelienne' },
  { id: 'theocratie-seelienne-dark', nom: 'Théocratie Seelienne (sombre)' },
  { id: 'paradigme-vert', nom: 'Paradigme Vert' },
  { id: 'paradigme-vert-dark', nom: 'Paradigme Vert (sombre)' },
  { id: 'khanat-elmerien', nom: 'Khanat Elmérien' },
  { id: 'khanat-elmerien-dark', nom: 'Khanat Elmérien (sombre)' },
  { id: 'confederation-libre', nom: 'Confédération Libre' },
  { id: 'confederation-libre-dark', nom: 'Confédération Libre (sombre)' },
  { id: 'royaume-ruthvenie', nom: 'Royaume de Ruthvénie' },
  { id: 'royaume-ruthvenie-dark', nom: 'Royaume de Ruthvénie (sombre)' }
];

// ---------- Paliers de dimensions : ceux que la peau et le script distinguent réellement ----------
// mobile-mode (JS) et @media (max-width: 767px) sous 768 px, règles « étroit » sous 360 px ; ordinateur dès 768 px avec la tablette tactile
// (hover: none, pointer: coarse, 768-991 px), le plein écran Bootstrap dès 992/1200 px, puis les conteneurs élargis de 1920, 2560 et 3840 px.
// Les grands écrans sont rendus avec un facteur de pixels réduit (dpr) : la mise en page est celle de la largeur annoncée, l'image reste légère.
const UA_MOBILE = 'Mozilla/5.0 (Linux; Android 14; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const UA_TABLETTE = 'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const UA_BUREAU = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
export const PALIERS = [
  { id: '1-mobile-etroit', nom: 'Mobile étroit', detail: '320 × 640, tactile, règles sous 360 px', width: 320, height: 640, mobile: true, ua: UA_MOBILE },
  { id: '2-mobile', nom: 'Mobile', detail: '360 × 800 (Galaxy S21), tactile, mode mobile', width: 360, height: 800, mobile: true, ua: UA_MOBILE },
  { id: '3-tablette', nom: 'Tablette', detail: '768 × 1024, tactile, mise en page ordinateur (hover: none)', width: 768, height: 1024, mobile: true, ua: UA_TABLETTE },
  { id: '4-ordinateur', nom: 'Ordinateur', detail: '1280 × 720, souris', width: 1280, height: 720, mobile: false, ua: UA_BUREAU },
  { id: '5-full-hd', nom: 'Full HD', detail: '1920 × 1080, conteneur élargi à 1860 px', width: 1920, height: 1080, mobile: false, ua: UA_BUREAU },
  { id: '6-qhd', nom: 'QHD', detail: '2560 × 1440, conteneur 2400 px, colonnes resserrées', width: 2560, height: 1440, mobile: false, ua: UA_BUREAU, dpr: 0.75 },
  { id: '7-4k', nom: '4K', detail: '3840 × 2160, conteneur 3200 px, typographie agrandie', width: 3840, height: 2160, mobile: false, ua: UA_BUREAU, dpr: 0.5 }
];

// ---------- Écrans ----------
// pleine : capture de toute la page (sinon le premier écran) ; mobileSeul : seulement sous 768 px ; action : geste joué avant la capture.
const ouvrirMenuMobile = async p => {
  const bouton = p.locator('.navbar-toggle:visible').first();
  if (await bouton.count()) { await bouton.click(); await p.waitForTimeout(500); }
};
export const ECRANS = [
  { id: '01-accueil', nom: 'Accueil', url: '/accueil', file: 'accueil.html' },
  { id: '02-menu', nom: 'Menu principal ouvert', url: '/accueil', file: 'accueil.html', mobileSeul: true, action: ouvrirMenuMobile, ecranSeul: true },
  { id: '03-plateau', nom: 'Plateau de jeu', url: '/jouer/plateau', file: 'plateau-cartes-noms.html' },
  { id: '03b-plateau-objets', nom: 'Plateau : objets au sol', url: '/jouer/plateau', file: 'jeu-plateau-objets.html' },
  { id: '04-personnage', nom: 'Personnage', url: '/jouer/perso', file: 'jeu-perso.html' },
  { id: '05-materiel', nom: 'Matériel', url: '/jouer/materiel', file: 'jeu-materiel.html' },
  { id: '06-batiments', nom: 'Bâtiments', url: '/jouer/bat', file: 'jeu-batiments.html' },
  { id: '07-employes', nom: 'Employés', url: '/jouer/employes', file: 'jeu-employes.html' },
  { id: '08-kramail-reception', nom: 'Kramail : réception', url: '/kramail/personnage-fictif-2000-0', file: 'kramail-reception.html' },
  { id: '09-kramail-lecture', nom: 'Kramail : lecture', url: '/kramail/post/sujet-fictif-0-9000002', file: 'kramail-lecture.html' },
  { id: '10-kramail-redaction', nom: 'Kramail : rédaction', url: '/kramail/post/nouveau-4-2000', file: 'kramail-nouveau.html' },
  { id: '11-forums', nom: 'Forums', url: '/forum', file: 'forum-racine-groupes.html' },
  { id: '12-sous-forum', nom: 'Sous-forum', url: '/forum/hrp/debuter-20102', file: 'sous-forum-debuter.html' },
  { id: '13-forum-sujet', nom: 'Forum : sujet', url: '/forum/sujet/messages-v3-329425-1', file: 'forum-sujet.html' },
  { id: '14-forum-reponse', nom: 'Forum : réponse', url: '/forum/post/repondre-2-329425', file: 'typographie-forum-redaction.html' },
  { id: '15-cybermonde', nom: 'Cybermonde (carte)', url: '/map', file: 'cybermonde-ville.html' },
  { id: '16-evenements', nom: 'Événements', url: '/monde/evenements', file: 'secondaires-evenements.html' },
  { id: '17-membres', nom: 'Membres', url: '/communaute/membres', file: 'secondaires-membres.html' },
  { id: '18-regles', nom: 'Règles', url: '/regles/avancees', file: 'secondaires-regles.html' },
  { id: '19-aide', nom: 'Aide', url: '/aide', file: 'aide.html' },
  { id: '20-options', nom: "Options d'interface (choix du thème)", url: '/profil/interface', file: 'secondaires-interface.html' }
];

// Hauteur maximale d'une capture pleine page, en écrans : au-delà, la page est coupée (les listes très longues n'apprennent rien de plus).
const ECRANS_MAX = 4;

const TYPES = { css: 'text/css', js: 'application/javascript', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', svg: 'image/svg+xml', eot: 'application/vnd.ms-fontobject' };
const typeDe = f => TYPES[f.split('.').pop()] || 'application/octet-stream';
const IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#a9adb3"/></svg>';
const LIB = {
  'bootstrap-3.3.7/css/bootstrap1.min.css': 'bootstrap1.min.css', 'bootstrap-3.3.7/css/bootstrap.min.css': 'bootstrap1.min.css',
  'bootstrap-3.3.7/js/bootstrap.min.js': 'bootstrap.min.js', 'jquery-3.3.1/jquery-3.3.1.min.js': 'jquery.min.js', 'bootbox-4.4.0/bootbox.min.js': 'bootbox.min.js',
  'kraland-7.0.9/css/main.css': 'main.css', 'kraland-7.0.9/css/bootswatch.css': 'bootswatch.css', 'kraland-7.0.9/css/minichat.css': 'minichat.css',
  'kraland-7.0.9/css/game.css': 'game.css'
};
// Polices Google du site (Lato, Reenie Beanie) et Roboto à la place d'Arial et Helvetica, absentes du conteneur Linux.
const POLICES = {
  'Lato-400.woff2': '@fontsource/lato/files/lato-latin-400-normal.woff2',
  'Lato-700.woff2': '@fontsource/lato/files/lato-latin-700-normal.woff2',
  'ReenieBeanie-400.woff2': '@fontsource/reenie-beanie/files/reenie-beanie-latin-400-normal.woff2',
  'Roboto-400.woff2': '@fontsource/roboto/files/roboto-latin-400-normal.woff2',
  'Roboto-500.woff2': '@fontsource/roboto/files/roboto-latin-500-normal.woff2',
  'Roboto-700.woff2': '@fontsource/roboto/files/roboto-latin-700-normal.woff2'
};
const face = (famille, poids, fichier) => `@font-face{font-family:'${famille}';font-style:normal;font-weight:${poids};font-display:block;src:url(${BASE}/__fonts/${fichier}) format('woff2');}`;
const FONTS_CSS = [face('Lato', 400, 'Lato-400.woff2'), face('Lato', 700, 'Lato-700.woff2'), face('Reenie Beanie', 400, 'ReenieBeanie-400.woff2'),
  ...[400, 500, 700].flatMap(w => ['Roboto', 'Helvetica Neue', 'Helvetica', 'Arial'].map(f => face(f, w, `Roboto-${w}.woff2`)))].join('\n');

const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');

function preparer(ecran) {
  const html = fs.readFileSync(path.join(FIX, ecran.file), 'utf8');
  const ajout = [];
  if (!/bootstrap1?\.min\.css/.test(html)) { ajout.push(`<link rel="stylesheet" href="${BASE}/lib/bootstrap-3.3.7/css/bootstrap1.min.css">`); }
  if (!/fontawesome-free-5\.6\.3/.test(html)) { ajout.push(`<link rel="stylesheet" href="${BASE}/lib/fontawesome-free-5.6.3/css/all.min.css">`); }
  for (const f of ['main.css', 'bootswatch.css']) { if (!html.includes('kraland-7.0.9/css/' + f)) { ajout.push(`<link rel="stylesheet" href="${BASE}/lib/kraland-7.0.9/css/${f}">`); } }
  if (ecran.url.startsWith('/jouer/')) { for (const f of ['minichat.css', 'game.css']) { if (!html.includes('kraland-7.0.9/css/' + f)) { ajout.push(`<link rel="stylesheet" href="${BASE}/lib/kraland-7.0.9/css/${f}">`); } } }
  return html.includes('</head>') ? html.replace('</head>', ajout.join('\n') + '\n</head>') : ajout.join('\n') + html;
}

async function ouvrir(browser, ecran, theme, palier, script, version) {
  const context = await browser.newContext({
    viewport: { width: palier.width, height: palier.height }, screen: { width: palier.width, height: palier.height },
    isMobile: palier.mobile, hasTouch: palier.mobile, deviceScaleFactor: palier.dpr || 1, locale: 'fr-FR', userAgent: palier.ua
  });
  await context.route('**/*', route => route.abort());
  await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: IMAGE }));
  await context.route(/^https?:\/\/fonts\.googleapis\.com\//, route => route.fulfill({ status: 200, contentType: 'text/css', body: FONTS_CSS }));
  await context.route(VERSION_URL, route => route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ version }) }));
  const html = preparer(ecran);
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (u.pathname.startsWith('/__fonts/')) {
      const f = POLICES[path.basename(u.pathname)];
      return f ? route.fulfill({ path: path.join(MODULES, f), contentType: 'font/woff2' }) : route.abort();
    }
    if (route.request().resourceType() === 'document') {
      return u.pathname === ecran.url ? route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }) : route.abort();
    }
    const i = u.pathname.indexOf('/lib/');
    const reste = i >= 0 ? u.pathname.slice(i + 5) : '';
    if (LIB[reste]) { return route.fulfill({ path: path.join(NATIF, LIB[reste]), contentType: typeDe(LIB[reste]) }); }
    if (reste.startsWith('fontawesome-free-5.6.3/')) {
      const f = path.join(FA, reste.slice('fontawesome-free-5.6.3/'.length));
      if (fs.existsSync(f)) { return route.fulfill({ path: f, contentType: typeDe(f) }); }
    }
    if (reste.endsWith('.css')) { return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    if (/\.(png|gif|jpe?g|svg)$/.test(u.pathname)) { return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: IMAGE }); }
    return route.abort();
  });
  await context.addInitScript(v => {
    localStorage.setItem('kr-theme-enabled', 'true');
    localStorage.setItem('kr-theme-variant', v);
  }, theme.id);
  await context.addInitScript(src => {
    window.GM = { xmlHttpRequest: () => {}, getValue: async (k, d) => d, setValue: async () => {} };
    window.addEventListener('submit', e => e.preventDefault(), true);
    window.HTMLFormElement.prototype.submit = () => {};
    // Évaluation globale du bundle, comme Tampermonkey (même procédé que les suites e2e).
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, script);
  const p = await context.newPage();
  await p.goto(BASE + ecran.url, { waitUntil: 'load' });
  await p.waitForFunction(() => document.documentElement.hasAttribute('data-kr-ready'), null, { timeout: 15000 }).catch(() => {});
  await p.waitForFunction(() => document.documentElement.classList.contains('kr-theme-enabled') && document.documentElement.style.opacity !== '0', null, { timeout: 15000 }).catch(() => {});
  await p.evaluate(() => document.fonts.ready);
  // Transitions et animations coupées : la capture montre l'état final, pas un fondu.
  await p.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}' });
  await p.waitForTimeout(300);
  return { context, p };
}

async function capturer(browser, ecran, theme, palier, script, version, dossier) {
  const { context, p } = await ouvrir(browser, ecran, theme, palier, script, version);
  try {
    if (ecran.action) { await ecran.action(p); }
    const fichier = path.join(dossier, ecran.id + '.png');
    if (ecran.ecranSeul) {
      await p.screenshot({ path: fichier });
    } else {
      const hauteur = await p.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
      const h = Math.min(hauteur, palier.height * ECRANS_MAX);
      await p.screenshot({ path: fichier, fullPage: true, clip: { x: 0, y: 0, width: palier.width, height: h } });
    }
  } finally {
    await context.close();
  }
}

// Couleur --kr-primary d'un thème, lue dans kraland-theme.css (pastille de la galerie) : :root pour « kraland », sinon le bloc de la variante.
function couleurPrincipale(id) {
  const css = fs.readFileSync(path.join(RACINE, 'kraland-theme.css'), 'utf8');
  const debut = id === 'kraland' ? css.indexOf(':root') : css.indexOf(`html.kr-theme-variant-${id} {`);
  if (debut < 0) { return ''; }
  const bloc = css.slice(debut, css.indexOf('}', debut));
  return ((/--kr-primary:\s*([^;]+);/.exec(bloc) || [])[1] || '').trim();
}

// ---------- Manifeste lu par index.html (script classique : la galerie s'ouvre aussi en file://) ----------
export function ecrireManifeste() {
  const themes = THEMES.filter(t => fs.existsSync(path.join(ICI, t.id)));
  const captures = {};
  for (const t of themes) {
    for (const pa of PALIERS) {
      const d = path.join(ICI, t.id, pa.id);
      if (!fs.existsSync(d)) { continue; }
      for (const f of fs.readdirSync(d).filter(n => n.endsWith('.png')).sort()) {
        (captures[f.replace(/\.png$/, '')] ||= []).push(`${t.id}/${pa.id}`);
      }
    }
  }
  const manifeste = {
    genere: new Date().toISOString(),
    version: (/@version\s+(\S+)/.exec(fs.readFileSync(path.join(RACINE, 'kraland-userscript-main.user.js'), 'utf8')) || [])[1] || '',
    themes: themes.map(({ id, nom }) => ({ id, nom, couleur: couleurPrincipale(id) })),
    paliers: PALIERS.map(({ id, nom, detail, width, height }) => ({ id, nom, detail, width, height })),
    ecrans: ECRANS.filter(e => captures[e.id]).map(e => ({ id: e.id, nom: e.nom, url: e.url, mobileSeul: !!e.mobileSeul })),
    captures
  };
  fs.writeFileSync(path.join(ICI, 'manifest.js'), '// Fichier généré par snapshot/capturer.mjs : ne pas modifier à la main.\nwindow.KR_SNAPSHOT = ' + JSON.stringify(manifeste, null, 1) + ';\n');
  return manifeste;
}

function option(nom) {
  const i = process.argv.indexOf('--' + nom);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1].split(',') : null;
}

async function main() {
  if (process.argv.includes('--index')) { ecrireManifeste(); return; }
  const filtre = (liste, ids) => (ids ? liste.filter(x => ids.some(id => x.id === id || x.id.endsWith('-' + id))) : liste);
  const themes = filtre(THEMES, option('themes'));
  const paliers = filtre(PALIERS, option('paliers'));
  const ecrans = filtre(ECRANS, option('ecrans'));
  const brut = fs.readFileSync(path.join(RACINE, 'kraland-userscript-main.user.js'), 'utf8');
  const script = sansEntete(brut);
  const version = (/@version\s+(\S+)/.exec(brut) || [])[1] || '';
  const concurrence = Number(process.env.KR_SNAPSHOT_JOBS || 6);
  const taches = [];
  for (const t of themes) {
    for (const pa of paliers) {
      const dossier = path.join(ICI, t.id, pa.id);
      fs.mkdirSync(dossier, { recursive: true });
      for (const e of ecrans) {
        if (e.mobileSeul && pa.width >= 768) { continue; }
        taches.push({ t, pa, e, dossier });
      }
    }
  }
  // KR_CHROMIUM : autre binaire Chromium (ex. /opt/pw-browsers/chromium quand la version de Playwright n'a pas le sien).
  const browser = await chromium.launch(process.env.KR_CHROMIUM ? { executablePath: process.env.KR_CHROMIUM } : {});
  let fait = 0;
  const faits = [];
  const echecs = [];
  const travailleur = async () => {
    while (taches.length) {
      const { t, pa, e, dossier } = taches.shift();
      try {
        await capturer(browser, e, t, pa, script, version, dossier);
        faits.push(path.join(dossier, e.id + '.png'));
      } catch (err) {
        echecs.push(`${t.id}/${pa.id}/${e.id} : ${String(err.message).split('\n')[0]}`);
      }
      fait += 1;
      if (fait % 25 === 0) { console.log(`${fait} captures…`); }
    }
  };
  await Promise.all(Array.from({ length: concurrence }, travailleur));
  await browser.close();
  // Palette 256 couleurs (compresser.py) : optionnelle, sautée sans Python 3 + Pillow ou avec --sans-compression.
  if (!process.argv.includes('--sans-compression')) {
    const r = spawnSync('python3', [path.join(ICI, 'compresser.py'), ...faits], { encoding: 'utf8' });
    console.log(r.status === 0 ? r.stdout.trim() : 'Compression sautée (python3 ou Pillow absent) : captures en PNG brut.');
  }
  ecrireManifeste();
  console.log(`${fait} captures, ${echecs.length} échec(s).`);
  for (const e of echecs) { console.log('  ' + e); }
  if (echecs.length) { process.exitCode = 1; }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
