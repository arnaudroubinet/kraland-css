// Captures en situation réelle sur www.kraland.org, avec le compte du joueur (mandat d'Arnaud du 2 novembre 2026).
//
//   npm run snapshot:reel                      # connexion si besoin, captures, compression, manifeste
//   npm run snapshot:reel -- --connexion       # refait seulement la connexion
//   npm run snapshot:reel -- --ecrans accueil,plateau
//   npm run snapshot:reel -- --index           # régénère seulement snapshot/manifest.js
//
// Périmètre : les 16 thèmes en « Ordinateur » (1280 × 720) ; les autres dimensions en République de Kraland (clair) et Empire Brun
// (sombre) seulement.
//
// Connexion : au premier lancement, une fenêtre Chromium s'ouvre sur l'accueil ; le joueur s'y connecte lui-même. L'état de session
// (cookies) est gardé HORS du dépôt, dans ~/.kraland-snapshot/session.json (KR_SNAPSHOT_SESSION pour un autre chemin).
//
// Lecture seule (AGENTS.md, « Sécurité sur le site réel ») :
//   - toute requête autre que GET vers kraland.org est bloquée (aucun envoi, vote, ordre) ;
//   - /report n'est jamais chargé (un GET marque les notifications comme lues) ;
//   - aucun message du kramail n'est ouvert (l'ouverture le marque comme lu) ; sujets et correspondants de la liste sont floutés ;
//   - le seul geste joué est l'ouverture du menu mobile (côté navigateur, sans requête).
// Rythme : une page à la fois, une seconde d'écart au moins ; chaque thème est ouvert par un rechargement, comme un joueur qui l'a choisi.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, URL } from 'node:url';
import { chromium } from 'playwright';
import { THEMES, PALIERS, ecrireManifeste } from './capturer.mjs';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(ICI, '..');
const BASE = 'http://www.kraland.org';
const SESSION = process.env.KR_SNAPSHOT_SESSION || path.join(os.homedir(), '.kraland-snapshot', 'session.json');
const ECART_MS = Number(process.env.KR_SNAPSHOT_ECART_MS || 1000);
const BUREAU = '4-ordinateur';
const THEMES_TOUTES_DIMENSIONS = ['kraland', 'empire-brun-dark'];

const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const BRUT = fs.readFileSync(path.join(RACINE, 'kraland-userscript-main.user.js'), 'utf8');
const SCRIPT = sansEntete(BRUT);

const ouvrirMenuMobile = async p => {
  const bouton = p.locator('.navbar-toggle:visible').first();
  if (await bouton.count()) { await bouton.click(); await p.waitForTimeout(600); }
};
const flouterKramail = async p => {
  await p.addStyleTag({ content: '#topics tbody td, #col-right table tbody td { filter: blur(5px) !important; }' });
};

// url : adresse fixe ; trouver : lien cherché sur la page « depuis » (adresses propres au compte ou au moment).
export const ECRANS_REELS = [
  { id: '01-accueil', nom: 'Accueil', url: '/accueil' },
  { id: '02-menu', nom: 'Menu principal ouvert', url: '/accueil', mobileSeul: true, action: ouvrirMenuMobile, ecranSeul: true },
  { id: '03-plateau', nom: 'Plateau de jeu', url: '/jouer/plateau' },
  { id: '04-personnage', nom: 'Personnage', url: '/jouer/perso' },
  { id: '05-materiel', nom: 'Matériel', url: '/jouer/materiel' },
  { id: '06-batiments', nom: 'Bâtiments', url: '/jouer/bat' },
  { id: '07-employes', nom: 'Employés', url: '/jouer/employes' },
  { id: '08-kramail-reception', nom: 'Kramail : réception (floutée)', url: '/kramail', action: flouterKramail },
  { id: '10-kramail-redaction', nom: 'Kramail : rédaction', depuis: '/kramail', trouver: 'a[href*="kramail/post/nouveau"]' },
  { id: '11-forums', nom: 'Forums', url: '/forum' },
  { id: '12-sous-forum', nom: 'Sous-forum', depuis: '/forum/hrp', trouver: 'a[href*="forum/hrp/"]' },
  { id: '13-forum-sujet', nom: 'Forum : sujet', depuis: '12-sous-forum', trouver: 'a[href*="forum/sujet/"]' },
  { id: '14-forum-reponse', nom: 'Forum : réponse', depuis: '13-forum-sujet', trouver: 'a[href*="forum/post/repondre"]' },
  { id: '15-cybermonde', nom: 'Cybermonde (carte)', url: '/map' },
  { id: '16-evenements', nom: 'Événements', url: '/monde/evenements' },
  { id: '17-membres', nom: 'Membres', url: '/communaute/membres' },
  { id: '18-regles', nom: 'Règles', url: '/regles/avancees' },
  { id: '19-aide', nom: 'Aide', url: '/aide' },
  { id: '20-options', nom: "Options d'interface (choix du thème)", url: '/profil/interface' }
];

const ECRANS_MAX = 4;
const pause = ms => new Promise(r => setTimeout(r, ms));
let derniere = 0;
async function rythme() {
  const attente = derniere + ECART_MS - Date.now();
  if (attente > 0) { await pause(attente); }
  derniere = Date.now();
}

async function contexte(browser, palier) {
  const ctx = await browser.newContext({
    storageState: SESSION, viewport: { width: palier.width, height: palier.height }, screen: { width: palier.width, height: palier.height },
    isMobile: palier.mobile, hasTouch: palier.mobile, deviceScaleFactor: palier.dpr || 1, locale: 'fr-FR', userAgent: palier.ua
  });
  // Garde-fous de lecture seule.
  await ctx.route(/^https?:\/\/[^/]*kraland\.org\//, route => {
    const r = route.request();
    const u = new URL(r.url());
    if (r.method() !== 'GET' || u.pathname.startsWith('/report')) { return route.abort(); }
    return route.continue();
  });
  // Le script utilisateur, injecté comme Tampermonkey (le navigateur de Playwright n'a pas l'extension).
  await ctx.addInitScript(src => {
    window.GM = { xmlHttpRequest: () => {}, getValue: async (k, d) => d, setValue: async () => {} };
    window.addEventListener('submit', e => e.preventDefault(), true);
    window.HTMLFormElement.prototype.submit = () => {};
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, SCRIPT);
  return ctx;
}

async function charger(p, url, theme) {
  await rythme();
  await p.evaluate(v => { localStorage.setItem('kr-theme-enabled', 'true'); localStorage.setItem('kr-theme-variant', v); }, theme).catch(() => {});
  await p.goto(BASE + url, { waitUntil: 'load', timeout: 45000 });
  // Premier passage sur le domaine : le stockage local n'existait pas encore, on recharge une fois avec le bon thème.
  const pose = await p.evaluate(v => document.documentElement.classList.contains('kr-theme-variant-' + v), theme);
  if (!pose) {
    await p.evaluate(v => { localStorage.setItem('kr-theme-enabled', 'true'); localStorage.setItem('kr-theme-variant', v); }, theme);
    await rythme();
    await p.goto(BASE + url, { waitUntil: 'load', timeout: 45000 });
  }
  await p.waitForFunction(() => document.documentElement.hasAttribute('data-kr-ready'), null, { timeout: 15000 }).catch(() => {});
  await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await p.evaluate(() => document.fonts.ready);
  // Images paresseuses : on fait défiler la page pour qu'elles se chargent toutes, puis on revient en haut.
  await p.evaluate(async () => {
    const h = Math.min(document.documentElement.scrollHeight, window.innerHeight * 4);
    for (let y = 0; y < h; y += window.innerHeight / 2) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await p.evaluate(() => Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 8000); }))));
  await p.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}' });
  await p.waitForTimeout(300);
}

async function capturer(p, ecran, palier, fichier) {
  if (ecran.action) { await ecran.action(p); }
  if (ecran.ecranSeul) { await p.screenshot({ path: fichier }); return; }
  const hauteur = await p.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
  await p.screenshot({ path: fichier, fullPage: true, clip: { x: 0, y: 0, width: palier.width, height: Math.min(hauteur, palier.height * ECRANS_MAX) } });
}

async function connexion() {
  fs.mkdirSync(path.dirname(SESSION), { recursive: true });
  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/accueil');
  console.log('Connectez-vous à Kraland dans la fenêtre ouverte (10 minutes au plus). La fenêtre se ferme seule ensuite.');
  await p.waitForFunction(() => !document.querySelector('input[type="password"]') && !!document.querySelector('a[href*="kramail"]'), null, { timeout: 600000, polling: 1000 });
  await ctx.storageState({ path: SESSION });
  fs.chmodSync(SESSION, 0o600);
  await browser.close();
  console.log('Session enregistrée : ' + SESSION);
}

async function connecte(browser) {
  if (!fs.existsSync(SESSION)) { return false; }
  const ctx = await contexte(browser, PALIERS.find(x => x.id === BUREAU));
  const p = await ctx.newPage();
  await rythme();
  await p.goto(BASE + '/accueil', { waitUntil: 'load' });
  const ok = await p.evaluate(() => !document.querySelector('input[type="password"]') && !!document.querySelector('a[href*="kramail"]'));
  await ctx.close();
  return ok;
}

// Adresses des écrans « trouvés », relevées une fois sur la session ordinateur.
async function resoudre(browser, ecrans) {
  const ctx = await contexte(browser, PALIERS.find(x => x.id === BUREAU));
  const p = await ctx.newPage();
  const urls = {};
  for (const e of ecrans) {
    if (e.url) { urls[e.id] = e.url; continue; }
    const depuis = urls[e.depuis] || e.depuis;
    await charger(p, depuis, 'kraland');
    const href = await p.locator(e.trouver).first().getAttribute('href').catch(() => null);
    if (href) { urls[e.id] = new URL(href, BASE + depuis).pathname; } else { console.log(`Écran ${e.id} : aucun lien ${e.trouver} sur ${depuis}, sauté.`); }
  }
  await ctx.close();
  return urls;
}

function option(nom) {
  const i = process.argv.indexOf('--' + nom);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1].split(',') : null;
}

async function main() {
  if (process.argv.includes('--connexion')) { await connexion(); return; }
  if (process.argv.includes('--index')) { ecrireManifeste(ECRANS_REELS, 'site réel'); return; }
  const ids = option('ecrans');
  // Génération complète : les captures précédentes (fixtures ou autre passage) sont retirées.
  if (!ids) { for (const t of THEMES) { fs.rmSync(path.join(ICI, t.id), { recursive: true, force: true }); } }
  const ecrans = ids ? ECRANS_REELS.filter(e => ids.some(id => e.id === id || e.id.endsWith('-' + id))) : ECRANS_REELS;
  let browser = await chromium.launch();
  if (!(await connecte(browser))) {
    await browser.close();
    await connexion();
    browser = await chromium.launch();
    if (!(await connecte(browser))) { throw new Error('Session non reconnue après connexion.'); }
  }
  const urls = await resoudre(browser, ECRANS_REELS.filter(e => ecrans.includes(e) || ecrans.some(x => x.depuis === e.id)));
  const faits = [];
  const echecs = [];
  for (const palier of PALIERS) {
    const themes = palier.id === BUREAU ? THEMES : THEMES.filter(t => THEMES_TOUTES_DIMENSIONS.includes(t.id));
    const ctx = await contexte(browser, palier);
    const p = await ctx.newPage();
    for (const e of ecrans) {
      if (!urls[e.id] || (e.mobileSeul && palier.width >= 768)) { continue; }
      for (const t of themes) {
        const dossier = path.join(ICI, t.id, palier.id);
        fs.mkdirSync(dossier, { recursive: true });
        const fichier = path.join(dossier, e.id + '.png');
        try {
          await charger(p, urls[e.id], t.id);
          await capturer(p, e, palier, fichier);
          faits.push(fichier);
        } catch (err) {
          echecs.push(`${t.id}/${palier.id}/${e.id} : ${String(err.message).split('\n')[0]}`);
        }
      }
      console.log(`${palier.id} · ${e.id} : fait (${faits.length} captures)`);
    }
    await ctx.close();
  }
  await browser.close();
  if (!process.argv.includes('--sans-compression')) {
    const r = spawnSync('python3', [path.join(ICI, 'compresser.py'), ...faits], { encoding: 'utf8' });
    console.log(r.status === 0 ? r.stdout.trim() : 'Compression sautée (python3 ou Pillow absent) : captures en PNG brut.');
  }
  ecrireManifeste(ECRANS_REELS, 'site réel');
  console.log(`${faits.length} captures, ${echecs.length} échec(s).`);
  for (const e of echecs) { console.log('  ' + e); }
  if (echecs.length) { process.exitCode = 1; }
}

await main();
