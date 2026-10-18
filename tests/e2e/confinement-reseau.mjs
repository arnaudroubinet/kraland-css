// Garde du confinement réseau des suites e2e (lot G). Deux vérifications, sans réseau réel :
//   1. dynamique : un contexte confiné par lib/confinement.mjs, avec une page de fixture servie par route (comme les suites), REFUSE les
//      requêtes vers les hôtes externes (logo du thème, version.json de GitHub, hôte inconnu). Ces hôtes sont résolus vers un puits local
//      (--host-resolver-rules) : si le refus cède, la requête arrive au puits au lieu de partir sur Internet, et la vérification échoue ;
//   2. statique : chaque contexte créé par une suite du registre est confiné (confineNetwork(ctx) ou ctx.route('**/*', …) qui refuse par
//      abort, juste après sa création, ou navigateur lancé avec « MAP * ~NOTFOUND »), sauf les exceptions inertes listées ci-dessous avec
//      leur raison. Lecture sur le code sans commentaires : un appel commenté ne confine rien.
//      Navigateur partagé (lot H, lib/navigateur.mjs) : il est lancé par run.mjs SANS puits DNS, donc chacun de ses contextes doit se
//      confiner ; tout navigateur de la suite (launchBrowser ou chromium.launch, quel que soit le nom de la variable) est suivi, et un
//      browser.newPage() non listé comme inerte y est un contexte non confiné. Cette garde garde son propre navigateur (--host-resolver-rules).
//
// Usage : node tests/e2e/confinement-reseau.mjs (lancé par test:all et par test:changed dès qu'un fichier de suite change)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { chromium } from 'playwright';
import { confineNetwork } from './lib/confinement.mjs';
import { SUITES } from './lib/router.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

// 1. Refus effectif ----------------------------------------------------------------------------------------------------------------
const EXTERNES = ['http://img7.kraland.org/2/world/logo1.gif', 'https://raw.githubusercontent.com/arnaudroubinet/kraland-css/refs/heads/main/version.json', 'http://hote-inconnu.example/sonde.js'];
const recus = [];
const puits = http.createServer((req, res) => { recus.push(`${req.headers.host}${req.url}`); res.end('fuite'); });
puits.on('connection', s => { recus.push('connexion ' + s.remoteAddress); });
await new Promise(resolve => puits.listen(0, '127.0.0.1', resolve));
const port = puits.address().port;
const hotes = [...new Set(EXTERNES.map(u => new URL(u).hostname))];
const browser = await chromium.launch({
  headless: true,
  // Hôtes externes -> puits local ; tout le reste introuvable : aucune requête ne peut atteindre Internet, même si le confinement cède.
  args: [`--host-resolver-rules=${hotes.map(h => `MAP ${h} 127.0.0.1:${port}`).join(', ')}, MAP * ~NOTFOUND , EXCLUDE 127.0.0.1`]
});
try {
  const context = await browser.newContext();
  const denied = await confineNetwork(context); // EN PREMIER, comme dans les suites
  const page0 = `<!doctype html><html><body><img id="logo" src="${EXTERNES[0]}"><script src="${EXTERNES[2]}"></script></body></html>`;
  await context.route('http://www.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: page0 }));
  const page = await context.newPage();
  await page.goto('http://www.kraland.org/jouer/plateau', { waitUntil: 'load' });
  const issue = await page.evaluate(async url => { try { await fetch(url); return 'reçu'; } catch (_e) { return 'refusé'; } }, EXTERNES[1]);
  const logo = await page.evaluate(() => document.getElementById('logo').naturalWidth);
  await new Promise(resolve => setTimeout(resolve, 200)); // laisse arriver une éventuelle connexion tardive au puits
  check('page de fixture servie par sa route (le refus global ne bloque pas les routes enregistrées après lui)', () => { assert.equal(page.url(), 'http://www.kraland.org/jouer/plateau'); });
  check('aucune requête n\'atteint le puits (hôtes externes résolus vers lui) : le refus global tient', () => { assert.deepEqual(recus, []); });
  check('logo du thème (img7) refusé : image non chargée', () => { assert.equal(logo, 0); });
  check('fetch de version.json (GitHub) refusé', () => { assert.equal(issue, 'refusé'); });
  check('les trois requêtes externes sont journalisées par confineNetwork comme refusées', () => {
    for (const u of EXTERNES) { assert.ok(denied.some(d => d.url === u), 'non journalisée : ' + u); }
  });
  await context.close();
} finally {
  await browser.close();
  puits.close();
}

// 2. Chaque contexte de suite est confiné (lecture statique) ------------------------------------------------------------------------
// Exceptions inertes : contexte ou page qui ne navigue jamais (about:blank, données en mémoire). Clé = fichier + ligne exacte.
const INERTES = [
  ['kramail-redaction.mjs', 'const ctx = await browser.newContext();', 'comparePixels : décode deux PNG en mémoire (Blob), aucune navigation'],
  ['audit-map-images.mjs', 'const page = await browser.newPage();', 'moteur de décodage d\'images : about:blank, données en mémoire']
];
// Code sans ses commentaires (// et /* */), remplacés par des espaces (sauts de ligne gardés : les numéros de ligne restent justes). Les
// chaînes et gabarits sont respectés ('http://…' n'est pas un commentaire) ; un antislash hors chaîne saute le caractère suivant (\/ des
// expressions régulières). Un appel confineNetwork commenté ne compte donc plus comme un confinement.
function stripComments(src) {
  let out = '';
  let quote = null;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    const n = src[i + 1];
    if (quote) {
      out += c;
      if (c === '\\') { out += n === undefined ? '' : n; i += 1; } else if (c === quote || (c === '\n' && quote !== '`')) { quote = null; }
      continue;
    }
    if (c === '/' && n === '/') { while (i < src.length && src[i] !== '\n') { out += ' '; i += 1; } i -= 1; continue; }
    if (c === '/' && n === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end < 0 ? src.length : end + 2;
      out += src.slice(i, stop).replace(/[^\n]/g, ' ');
      i = stop - 1;
      continue;
    }
    if (c === '\\') { out += c + (n === undefined ? '' : n); i += 1; continue; }
    if (c === '\'' || c === '"' || c === '`') { quote = c; }
    out += c;
  }
  return out;
}

for (const s of SUITES.filter(x => x.file !== 'confinement-reseau.mjs')) {
  const lines = stripComments(fs.readFileSync(path.join(dir, s.file), 'utf8')).split('\n');
  // Navigateurs lancés avec leur propre puits DNS (« MAP * ~NOTFOUND ») : leurs contextes sont confinés par le résolveur.
  // Navigateurs de la suite, quel que soit leur nom : chromium.launch (à part) ou launchBrowser (lib/navigateur.mjs, navigateur PARTAGÉ :
  // aucun puits DNS au lancement, chaque contexte doit se confiner lui-même ; un browser.newPage() y crée un contexte non confiné).
  const selfConfined = new Set();
  const browsers = new Set();
  lines.forEach((l, i) => {
    const b = l.match(/(?:const|let)\s+(\w+)\s*=\s*await\s+(?:chromium\.launch|launchBrowser)\(/);
    if (b) { browsers.add(b[1]); }
    const m = l.match(/const (\w+) = await chromium\.launch\(/);
    if (m && lines.slice(i, i + 8).join('\n').includes('MAP * ~NOTFOUND')) { selfConfined.add(m[1]); }
  });
  const bad = [];
  lines.forEach((l, i) => {
    const m = l.match(/(?:const|let)\s+(\w+)\s*=\s*await\s+(\w+)\.(newContext|newPage)\(/);
    if (!m) { return; }
    if (m[3] === 'newPage' && !/browser/i.test(m[2]) && !browsers.has(m[2])) { return; } // page d'un contexte : le contexte est vérifié à sa création
    if (INERTES.some(([f, txt]) => f === s.file && l.trim() === txt)) { return; }
    if (selfConfined.has(m[2])) { return; }
    const next = lines.slice(i + 1, i + 6).join('\n');
    // Route de dernier recours : elle doit REFUSER (abort), pas laisser passer (fallback, continue) ni tout servir (fulfill direct).
    const at = next.indexOf(`${m[1]}.route('**/*'`);
    const tail = lines.slice(i + 1, i + 20).join('\n');
    const handler = at < 0 ? '' : tail.slice(tail.indexOf(`${m[1]}.route('**/*'`)).slice(0, 1200);
    const routeAborts = at >= 0 && /\.abort\(/.test(handler) && !/\.(fallback|continue|fulfill)\(/.test(handler.split('\n')[0]);
    const ok = m[3] === 'newContext' && (next.includes(`confineNetwork(${m[1]})`) || routeAborts);
    if (!ok) { bad.push(`${s.file}:${i + 1} ${l.trim().slice(0, 80)}`); }
  });
  check(`${s.file} : chaque contexte est confiné dès sa création`, () => { assert.deepEqual(bad, [], 'non confiné : ' + bad.join(' | ')); });
}
check('exceptions inertes toujours présentes (une exception orpheline se retire de la liste)', () => {
  const orphan = INERTES.filter(([f, txt]) => !fs.readFileSync(path.join(dir, f), 'utf8').split('\n').some(l => l.trim() === txt));
  assert.deepEqual(orphan.map(x => x[0] + ' : ' + x[1]), []);
});

console.log(failures ? `${failures} échec(s)` : 'Confinement réseau conforme');
process.exit(failures ? 1 : 0);
