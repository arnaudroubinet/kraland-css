// Cybermonde : carte centrée sur ordinateur, cadre défilant sur mobile (ticket story-carte-cybermonde-centree-et-defilante).
// Fragment monde (critères 1 et 2) : carte du monde (/map, fixture cybermonde-monde.html : div absolu en ligne left:200px; top:120px, image
// 625 × 530). Ordinateur, 768, 769, 1280, 1440 et 1920 px : image à sa largeur naturelle, marges gauche et droite égales à 2 px près dans la
// largeur du document, aucun défilement horizontal du document. Mobile, 320, 375 et 767 px : document sans défilement horizontal, image à sa
// largeur naturelle dans un cadre pleine largeur qui défile en largeur (sans défilement vertical ni image rognée), ouvert au milieu
// (scrollLeft = (scrollWidth - clientWidth) / 2 à 1 px près). À 767 px, la carte du monde (625 px) tient dans le cadre : rien à faire défiler,
// elle y est centrée (marges égales à 2 px près). Mobile toujours (critère 4) : la carte du monde est dans le flux sous les sélecteurs
// (body > div.center) : aucun sélecteur recouvert (elementFromPoint au centre de chaque select), écart ≤ 24 px, div.genmsg juste sous la carte (≤ 24 px : les <br> natifs
// qui réservaient la place de la carte absolue sont masqués).
// Fragment region (critères 1 et 2) : carte d'une ville (/map/ville/…, fixture cybermonde-region.html : boîte relative de 678 px en ligne,
// tuiles et image à zones de 1017 × 549 qui la débordent). Ordinateur : image de 1017 px, centrée dans le parent de la boîte s'il la contient
// (1280 à 1920 px, document sans défilement horizontal), sinon calée à gauche et le document défile en largeur (768 et 769 px, décision
// d'Arnaud du 2026-10-21). Mobile : mêmes vérifications que le monde, tuiles comprises dans la hauteur du cadre. Même fixture servie aussi
// sous /map/province/… (carte de province).
// Fragment zones (critère 3) : zones et <map> inchangées (nombre, formes, coordonnées, destinations) ; à 375 px après défilement du cadre et à
// 1280 px, le point visé est une <area> (elementFromPoint) et le toucher ou le clic ouvre sa destination.
// Fragment panneaux (critère 4) : panneaux et sélecteurs (position horizontale, largeur, couleurs, taille de police) identiques au bundle
// « avant » (feature/next tel que commité, ou KR_SCRIPT_AVANT), à 375 et 1280 px, Kraland clair et Empire Brun sombre ; la page Cybermonde sans
// carte (cybermonde-ville.html) aussi, sans exception.
// Fragment sans-carte : page /map sans img[usemap], page /maps (hors Cybermonde) et ville dont la boîte n'a pas width:678px (non reconnue) :
// aucune exception, aucune classe kr-cybermonde-*, et sur /maps comme sur la ville la carte garde sa position native.
// Fragment recentrage : cadre mobile ouvert à 375 px puis fenêtre réduite à 320 px (toujours mobile, sans rechargement) : le cadre est
// recentré (scrollLeft = (scrollWidth - clientWidth) / 2 à 1 px près) ; après un défilement du joueur (pointerdown puis scrollLeft = 0), la
// même réduction ne le recentre plus. Monde et ville.
// Pages = FIXTURES SYNTHÉTIQUES, images générées ici ; vrai Bootstrap 3.3.7 (tests/e2e/vendor) ; confinement réseau (lib/confinement.mjs).
// Seules navigations : vers les destinations des zones touchées, servies par une page vide interceptée.
//
// Usage : npm run build && node tests/e2e/cybermonde-carte.mjs   (ou : npm run test:zone -- cybermonde)
// Options : KR_SCRIPT (bundle testé), KR_SCRIPT_AVANT (bundle « avant »), KR_FRAG = monde, region, zones, panneaux, sans-carte, recentrage (vide = tout).
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, THEME_READY, waitState } from './lib/settle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const strip = src => src.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = strip(fs.readFileSync(scriptPath, 'utf8'));
const fixture = name => fs.readFileSync(path.join(here, 'fixtures', name), 'utf8');
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const BASE = 'http://www.kraland.org';
const MONDE = BASE + '/map';
const REGION = BASE + '/map/ville/fixture-ville';
const PROVINCE = BASE + '/map/province/fixture-province';
const HORS = BASE + '/maps';
const IMG = 'http://img7.kraland.org/2/fixture/';
const VARIANTES = ['kraland', 'empire-brun-dark'];
const BUREAU = [768, 769, 1280, 1440, 1920];
const MOBILE = [320, 375, 767];
const device = l => (l < 768 ? { viewport: { width: l, height: 667 }, isMobile: true, hasTouch: true } : { viewport: { width: l, height: 900 } });
const CARTES = {
  monde: { url: MONDE, html: fixture('cybermonde-monde.html'), largeur: 625, hauteur: 530 },
  region: { url: REGION, html: fixture('cybermonde-region.html'), largeur: 1017, hauteur: 549 },
  province: { url: PROVINCE, html: fixture('cybermonde-region.html'), largeur: 1017, hauteur: 549 } // même forme, servie sous /map/province/…
};
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

// PNG RGBA d'un aplat (images de la carte, générées ici pour avoir leur vraie taille naturelle)
function png(w, h, rgba) {
  const ligne = Buffer.concat([Buffer.from([0]), Buffer.alloc(w * 4).map((_, i) => rgba[i % 4])]);
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(Buffer.concat([Buffer.from(type), data])));
    return Buffer.concat([len, Buffer.from(type), data, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr.writeUInt8(8, 8); ihdr.writeUInt8(6, 9);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(Buffer.concat(Array(h).fill(ligne)))), chunk('IEND', Buffer.alloc(0))]);
}
const IMAGES = { 'map2.png': png(625, 530, [40, 90, 140, 255]), 'map1.png': png(1017, 549, [0, 0, 0, 0]), 'tuile.png': png(54, 54, [80, 140, 60, 255]) };

// Bundle « avant » : celui de feature/next tel que commité, sauf KR_SCRIPT_AVANT.
function bundleAvant() {
  if (process.env.KR_SCRIPT_AVANT) { return strip(fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')); }
  for (const ref of ['origin/feature/next', 'feature/next']) {
    try { return strip(execFileSync('git', ['show', `${ref}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })); } catch (_e) { /* ref suivante */ }
  }
  return null;
}

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const browser = await launchBrowser();

async function open(url, html, variante, dev, src = userscript) {
  const context = await browser.newContext(dev);
  await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route(BASE + '/**', route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: '<!DOCTYPE html><html><body>destination</body></html>' }));
  await context.route(url, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await context.route(IMG + '*', route => {
    const nom = new URL(route.request().url()).pathname.split('/').pop();
    return IMAGES[nom] ? route.fulfill({ status: 200, contentType: 'image/png', body: IMAGES[nom] }) : route.abort();
  });
  await context.route(BASE + '/lib/bootstrap-3.3.7/css/bootstrap1.min.css', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.css'), contentType: 'text/css' }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/js/bootstrap.min.js', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.js'), contentType: 'application/javascript' }));
  await context.route(BASE + '/lib/jquery-3.3.1/jquery-3.3.1.min.js', route => route.fulfill({ path: path.join(VENDOR, 'jquery.min.js'), contentType: 'application/javascript' }));
  await context.addInitScript(({ s, v, cible }) => {
    if (location.href !== cible) { return; } // destinations des zones : pas de thème
    window.GM = { xmlHttpRequest: () => {} };
    localStorage.setItem('kr-theme-enabled', 'true');
    localStorage.setItem('kr-theme-variant', v);
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(s);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { s: src, v: variante, cible: url });
  const page = await context.newPage();
  const erreurs = [];
  page.on('pageerror', e => erreurs.push(e.message));
  await page.goto(url, { waitUntil: 'load' });
  await krReady(page, { ready: THEME_READY, label: `${variante} ${url}` });
  return { context, page, erreurs };
}

// Carte mesurée par sa forme native (indépendamment des classes posées par le script) : image à zones, élément à centrer (monde : son div
// absolu ; région : la boîte de 678 px en ligne) et son conteneur, cadre défilant = plus proche ancêtre de l'image en overflow-x auto/scroll.
const MESURE_CARTE = () => {
  const img = document.querySelector('img[usemap]');
  const doc = document.documentElement;
  const boite = document.querySelector('div[style*="width:678px"]');
  const r = img.getBoundingClientRect();
  const conteneur = boite ? boite.parentElement.getBoundingClientRect() : { left: 0, right: doc.clientWidth };
  let cadre = img.parentElement;
  while (cadre && cadre !== document.body && !['auto', 'scroll'].includes(getComputedStyle(cadre).overflowX)) { cadre = cadre.parentElement; }
  if (cadre === document.body) { cadre = null; }
  const c = cadre && cadre.getBoundingClientRect();
  const centre = document.querySelector('body > div.center');
  const genmsg = document.querySelector('body > div.genmsg');
  return {
    selecteurs: centre && {
      bas: centre.getBoundingClientRect().bottom,
      genmsgHaut: genmsg ? genmsg.getBoundingClientRect().top : null,
      couverts: [...centre.querySelectorAll('select')].filter(sel => {
        const b = sel.getBoundingClientRect();
        const el = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        return !(el && (el === sel || sel.contains(el)));
      }).map(sel => '#' + sel.id)
    },
    carteHaut: r.top,
    carteBas: r.bottom,
    pageCybermonde: document.body.classList.contains('page-cybermonde'),
    mobile: document.body.classList.contains('mobile-mode'),
    largeur: r.width,
    naturelle: img.naturalWidth,
    margeGauche: r.left - conteneur.left,
    margeDroite: conteneur.right - r.right,
    docScroll: doc.scrollWidth,
    docLargeur: doc.clientWidth,
    cadre: cadre && {
      gauche: c.left, largeur: c.width, haut: c.top, bas: c.bottom,
      scrollWidth: cadre.scrollWidth, clientWidth: cadre.clientWidth, scrollLeft: cadre.scrollLeft,
      scrollHeight: cadre.scrollHeight, clientHeight: cadre.clientHeight,
      imgHaut: r.top, imgBas: r.bottom, imgGauche: r.left, imgDroite: r.right,
      tuilesBas: Math.max(r.bottom, ...[...cadre.querySelectorAll('[id^="c"]')].map(t => t.getBoundingClientRect().bottom))
    }
  };
};

async function mesurerCarte(carte, largeur, variante = VARIANTES[0]) {
  const { context, page, erreurs } = await open(carte.url, carte.html, variante, device(largeur));
  const m = await page.evaluate(MESURE_CARTE);
  await context.close();
  return { ...m, erreurs };
}

function verifierCarte(nom, carte, largeur, m) {
  const bureau = largeur >= 768;
  check(`${nom} ${largeur} px : page Cybermonde, mode ${bureau ? 'ordinateur' : 'mobile'}, image chargée, aucune exception`, () => {
    assert.equal(m.pageCybermonde, true, 'body sans page-cybermonde');
    assert.equal(m.mobile, !bureau);
    assert.equal(m.naturelle, carte.largeur, 'largeur naturelle : ' + m.naturelle);
    assert.deepEqual(m.erreurs, []);
  });
  check(`${nom} ${largeur} px : image à sa largeur naturelle (${carte.largeur} px)`, () => {
    assert.ok(Math.abs(m.largeur - carte.largeur) < 0.5, 'largeur affichée : ' + m.largeur);
  });
  if (bureau) {
    const tient = carte.largeur <= m.docLargeur;
    check(`${nom} ${largeur} px : ${tient ? 'centrée (marges égales à 2 px près), document sans défilement horizontal' : 'calée à gauche, le document défile en largeur'}`, () => {
      assert.equal(m.cadre, null, 'cadre défilant sur ordinateur');
      if (tient) {
        assert.ok(Math.abs(m.margeGauche - m.margeDroite) <= 2, `marges ${m.margeGauche} / ${m.margeDroite}`);
        assert.equal(m.docScroll, m.docLargeur, `document ${m.docScroll} px pour ${m.docLargeur} px`);
      } else {
        assert.ok(Math.abs(m.margeGauche) <= 1, 'marge gauche : ' + m.margeGauche);
        assert.ok(m.docScroll >= carte.largeur, `document ${m.docScroll} px pour une carte de ${carte.largeur} px`);
      }
    });
  } else {
    check(`${nom} ${largeur} px : document sans défilement horizontal`, () => {
      assert.equal(m.docScroll, largeur, `document ${m.docScroll} px pour ${largeur} px`);
    });
    check(`${nom} ${largeur} px : cadre pleine largeur ${carte.largeur > largeur ? 'qui défile en largeur' : 'où la carte, plus étroite, est centrée'}, sans rogner la carte en hauteur`, () => {
      assert.ok(m.cadre, 'aucun ancêtre de l\'image en overflow-x auto/scroll');
      assert.ok(Math.abs(m.cadre.gauche) <= 1 && Math.abs(m.cadre.largeur - m.docLargeur) <= 1, `cadre ${m.cadre.gauche} + ${m.cadre.largeur} px`);
      if (carte.largeur > m.cadre.clientWidth) {
        assert.ok(m.cadre.scrollWidth >= carte.largeur, `défilable ${m.cadre.scrollWidth}, visible ${m.cadre.clientWidth}`);
      } else {
        const gauche = m.cadre.imgGauche - m.cadre.gauche;
        const droite = m.cadre.gauche + m.cadre.clientWidth - m.cadre.imgDroite;
        assert.ok(Math.abs(gauche - droite) <= 2, `carte plus étroite que le cadre, marges ${gauche} / ${droite}`);
      }
      assert.ok(m.cadre.scrollHeight <= m.cadre.clientHeight + 1, `défilement vertical : ${m.cadre.scrollHeight} pour ${m.cadre.clientHeight}`);
      assert.ok(m.cadre.imgHaut >= m.cadre.haut - 1 && m.cadre.tuilesBas <= m.cadre.bas + 1, `carte ${m.cadre.imgHaut}..${m.cadre.tuilesBas}, cadre ${m.cadre.haut}..${m.cadre.bas}`);
    });
    if (nom === 'monde') {
      check(`${nom} ${largeur} px : carte dans le flux sous les sélecteurs (aucun recouvert, écart ≤ 24 px), div.genmsg juste sous la carte (écart ≤ 24 px)`, () => {
        const sel = m.selecteurs;
        assert.ok(sel, 'body > div.center absent');
        assert.deepEqual(sel.couverts, [], 'sélecteurs recouverts');
        assert.ok(m.carteHaut >= sel.bas - 1, `haut de la carte ${m.carteHaut}, bas des sélecteurs ${sel.bas}`);
        assert.ok(m.carteHaut - sel.bas <= 24, `écart sélecteurs / carte : ${m.carteHaut - sel.bas} px`);
        assert.ok(sel.genmsgHaut !== null && sel.genmsgHaut >= m.carteBas - 1, `div.genmsg à ${sel.genmsgHaut}, bas de la carte ${m.carteBas}`);
        assert.ok(sel.genmsgHaut - m.carteBas <= 24, `écart carte / div.genmsg : ${sel.genmsgHaut - m.carteBas} px (<br> natifs encore affichés ?)`);
      });
    }
    check(`${nom} ${largeur} px : cadre ouvert au milieu de la carte`, () => {
      const milieu = (m.cadre.scrollWidth - m.cadre.clientWidth) / 2;
      assert.ok(Math.abs(m.cadre.scrollLeft - milieu) <= 1, `scrollLeft ${m.cadre.scrollLeft}, attendu ${milieu}`);
    });
  }
}

for (const nom of ['monde', 'region', 'province']) {
  if (!on(nom === 'province' ? 'region' : nom)) { continue; }
  const carte = CARTES[nom];
  const largeurs = [...BUREAU, ...MOBILE];
  console.log(`Carte ${nom} : ordinateur ${BUREAU.join(', ')} px, mobile ${MOBILE.join(', ')} px`);
  const res = await mapLimit(largeurs, l => mesurerCarte(carte, l));
  largeurs.forEach((l, i) => verifierCarte(nom, carte, l, res[i]));
}

// Zones de la carte : liste native (forme, coordonnées, destination) et usemap de l'image
const MESURE_ZONES = () => ({
  usemap: document.querySelector('img[usemap]').getAttribute('usemap'),
  zones: [...document.querySelectorAll('area')].map(a => [a.getAttribute('shape'), a.getAttribute('coords'), a.getAttribute('href')].join(' '))
});
const zonesFixture = html => [...html.matchAll(/<area shape="(\w+)" coords="([\d,]+)" href="([^"]+)"/g)].map(x => `${x[1]} ${x[2]} ${x[3]}`);

// Point de page (coordonnées de fenêtre) au centre de la zone `index`, après défilement du cadre à `defilement` (début / fin) et de la fenêtre
// pour amener la zone à l'écran ; renvoie l'élément trouvé à ce point.
const VISER = ({ index, defilement }) => {
  const img = document.querySelector('img[usemap]');
  const area = document.querySelectorAll('area')[index];
  let cadre = img.parentElement;
  while (cadre && cadre !== document.body && !['auto', 'scroll'].includes(getComputedStyle(cadre).overflowX)) { cadre = cadre.parentElement; }
  if (cadre && cadre !== document.body && defilement) { cadre.scrollLeft = defilement === 'fin' ? cadre.scrollWidth : 0; }
  const n = area.getAttribute('coords').split(',').map(Number);
  const xs = n.filter((_, i) => i % 2 === 0);
  const ys = n.filter((_, i) => i % 2 === 1);
  const cx = area.getAttribute('shape') === 'rect' ? (xs[0] + xs[1]) / 2 : xs.reduce((a, b) => a + b, 0) / xs.length;
  const cy = area.getAttribute('shape') === 'rect' ? (ys[0] + ys[1]) / 2 : ys.reduce((a, b) => a + b, 0) / ys.length;
  const r0 = img.getBoundingClientRect();
  window.scrollTo(window.scrollX, window.scrollY + r0.top + cy - window.innerHeight / 2);
  const r = img.getBoundingClientRect();
  const x = r.left + cx;
  const y = r.top + cy;
  const el = document.elementFromPoint(x, y);
  return { x, y, dansEcran: x >= 0 && x < window.innerWidth && y >= 0 && y < window.innerHeight, trouve: el && el.tagName === 'AREA' ? el.getAttribute('href') : (el ? el.tagName : null), href: area.href };
};

if (on('zones')) {
  console.log('Zones cliquables : carte du monde et carte de ville, 375 px (cadre défilé) et 1280 px');
  const cas = [
    { nom: 'monde 375 px, cadre défilé à droite, zone de la dernière colonne', carte: 'monde', largeur: 375, index: 9, defilement: 'fin' },
    { nom: 'monde 1280 px, zone centrale', carte: 'monde', largeur: 1280, index: 12, defilement: null },
    { nom: 'ville 375 px, cadre défilé à gauche, sortie ouest', carte: 'region', largeur: 375, index: 2, defilement: 'debut' },
    { nom: 'ville 375 px, cadre défilé à droite, sortie est', carte: 'region', largeur: 375, index: 1, defilement: 'fin' },
    { nom: 'ville 1280 px, bâtiment (polygone)', carte: 'region', largeur: 1280, index: 4, defilement: null }
  ];
  const res = await mapLimit(cas, async c => {
    const carte = CARTES[c.carte];
    const { context, page, erreurs } = await open(carte.url, carte.html, VARIANTES[0], device(c.largeur));
    const zones = await page.evaluate(MESURE_ZONES);
    const vise = await page.evaluate(VISER, c);
    let arrivee = null;
    if (vise.dansEcran && vise.trouve !== null) {
      if (c.largeur < 768) { await page.touchscreen.tap(vise.x, vise.y); } else { await page.mouse.click(vise.x, vise.y); }
      await waitState(page, href => location.href === href, vise.href, { maxMs: 5000 }).catch(() => {});
      arrivee = page.url();
    }
    await context.close();
    return { zones, vise, arrivee, erreurs };
  });
  cas.forEach((c, i) => {
    const m = res[i];
    if (c.index === 9 || c.index === 2) {
      check(`${c.carte} : zones et <map> inchangées (forme, coordonnées, destinations), usemap intact`, () => {
        assert.deepEqual(m.zones.zones, zonesFixture(CARTES[c.carte].html));
        assert.equal(m.zones.usemap, c.carte === 'monde' ? '#map2' : '#map1');
      });
    }
    check(`${c.nom} : le point visé est la zone, son toucher ou son clic ouvre sa destination`, () => {
      assert.deepEqual(m.erreurs, []);
      assert.ok(m.vise.dansEcran, `point hors écran (${m.vise.x}, ${m.vise.y})`);
      assert.equal(new URL(m.vise.trouve, BASE + '/').href, m.vise.href, 'élément au point : ' + m.vise.trouve);
      assert.equal(m.arrivee, m.vise.href);
    });
  });
}

// Panneaux et sélecteurs : géométrie horizontale et style calculé. Ni position verticale (elle peut changer si la carte reprend sa place dans
// le flux) ni hauteur (les panneaux repliables du mobile la font varier d'une ouverture à l'autre, même bundle).
const MESURE_PANNEAUX = () => [...document.querySelectorAll('.panel, .center select, #content select')].map(el => {
  const r = el.getBoundingClientRect();
  const s = getComputedStyle(el);
  const titre = el.querySelector('.panel-title');
  return { nom: titre ? titre.textContent.trim() : '#' + el.id, gauche: Math.round(r.left), largeur: Math.round(r.width), couleur: s.color, fond: s.backgroundColor, police: s.fontSize };
});

if (on('panneaux')) {
  const avant = bundleAvant();
  check('bundle « avant » disponible (feature/next ou KR_SCRIPT_AVANT)', () => assert.ok(avant, 'introuvable'));
  if (avant) {
    const pages = [
      { nom: 'monde', url: MONDE, html: CARTES.monde.html },
      { nom: 'ville', url: REGION, html: CARTES.region.html },
      { nom: 'sans carte', url: MONDE, html: fixture('cybermonde-ville.html') }
    ];
    const cas = pages.flatMap(p => VARIANTES.flatMap(v => [375, 1280].map(l => ({ ...p, variante: v, largeur: l }))));
    console.log(`Panneaux et sélecteurs comparés au bundle « avant » : ${pages.map(p => p.nom).join(', ')}, 375 et 1280 px, ${VARIANTES.join(', ')}`);
    const res = await mapLimit(cas, async c => {
      const mesures = [];
      for (const src of [avant, userscript]) {
        const { context, page, erreurs } = await open(c.url, c.html, c.variante, device(c.largeur), src);
        mesures.push({ panneaux: await page.evaluate(MESURE_PANNEAUX), erreurs });
        await context.close();
      }
      return mesures;
    });
    cas.forEach((c, i) => {
      const [a, p] = res[i];
      check(`[${c.variante}] ${c.nom} ${c.largeur} px : panneaux et sélecteurs inchangés (${a.panneaux.length}), aucune exception`, () => {
        assert.ok(a.panneaux.length > 0, 'aucun panneau mesuré');
        assert.deepEqual(p.erreurs, []);
        assert.deepEqual(p.panneaux, a.panneaux, JSON.stringify(p.panneaux) + ' au lieu de ' + JSON.stringify(a.panneaux));
      });
    });
  }
}

if (on('sans-carte')) {
  console.log('Sans carte : /map sans img[usemap] et /maps (hors Cybermonde), 375 et 1280 px');
  const cas = [
    { nom: '/map sans carte', url: MONDE, html: fixture('cybermonde-ville.html'), cyber: true },
    { nom: '/maps', url: HORS, html: CARTES.monde.html, cyber: false },
    { nom: 'ville à boîte non reconnue', url: REGION, html: CARTES.region.html.replace('style="position:relative; width:678px', 'style="position:relative; width:700px'), cyber: true, natif: true }
  ].flatMap(c => [375, 1280].map(l => ({ ...c, largeur: l })));
  const res = await mapLimit(cas, async c => {
    const { context, page, erreurs } = await open(c.url, c.html, VARIANTES[0], device(c.largeur));
    const m = await page.evaluate(() => {
      const img = document.querySelector('img[usemap]');
      return {
        pageCybermonde: document.body.classList.contains('page-cybermonde'),
        classes: [...document.querySelectorAll('[class*="kr-cybermonde"]')].length,
        gauche: img ? getComputedStyle(img.parentElement).left : null,
        transformation: img ? getComputedStyle(img.parentElement).transform : null
      };
    });
    await context.close();
    return { ...m, erreurs };
  });
  cas.forEach((c, i) => {
    const m = res[i];
    check(`${c.nom} ${c.largeur} px : aucune exception, aucune classe kr-cybermonde-*${c.cyber ? '' : ', page hors Cybermonde'}${c.cyber && !c.natif ? '' : ', carte à sa position native'}`, () => {
      assert.deepEqual(m.erreurs, []);
      assert.equal(m.classes, 0);
      assert.equal(m.pageCybermonde, c.cyber);
      if (!c.cyber) { assert.equal(m.gauche, '200px'); }
      if (c.natif) { assert.equal(m.gauche, '0px'); assert.equal(m.transformation, 'none'); }
    });
  });
}

// Cadre défilant de la carte (plus proche ancêtre de l'image en overflow-x auto/scroll) : position et milieu attendu
const CADRE = () => {
  let cadre = document.querySelector('img[usemap]').parentElement;
  while (cadre && cadre !== document.body && !['auto', 'scroll'].includes(getComputedStyle(cadre).overflowX)) { cadre = cadre.parentElement; }
  if (!cadre || cadre === document.body) { return null; }
  return { scrollLeft: cadre.scrollLeft, milieu: (cadre.scrollWidth - cadre.clientWidth) / 2, mobile: document.body.classList.contains('mobile-mode') };
};

if (on('recentrage')) {
  console.log('Recentrage du cadre mobile : 375 puis 320 px, sans puis après défilement du joueur, monde et ville');
  const cas = ['monde', 'region'].flatMap(nom => [false, true].map(joueur => ({ nom, joueur })));
  const res = await mapLimit(cas, async c => {
    const carte = CARTES[c.nom];
    const { context, page, erreurs } = await open(carte.url, carte.html, VARIANTES[0], device(375));
    const avant = await page.evaluate(CADRE);
    if (c.joueur) {
      await page.evaluate(() => {
        let cadre = document.querySelector('img[usemap]').parentElement;
        while (!['auto', 'scroll'].includes(getComputedStyle(cadre).overflowX)) { cadre = cadre.parentElement; }
        cadre.dispatchEvent(new window.PointerEvent('pointerdown', { bubbles: true }));
        cadre.scrollLeft = 0;
      });
    }
    await page.setViewportSize({ width: 320, height: 667 });
    await waitState(page, () => window.innerWidth === 320, null, { maxMs: 5000 });
    if (!c.joueur) {
      await waitState(page, `(() => { const m = (${CADRE})(); return m && Math.abs(m.scrollLeft - m.milieu) <= 1; })()`, null, { maxMs: 3000 });
    }
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const apres = await page.evaluate(CADRE);
    await context.close();
    return { avant, apres, erreurs };
  });
  cas.forEach((c, i) => {
    const m = res[i];
    check(`${c.nom} 375 puis 320 px${c.joueur ? ' après défilement du joueur : le cadre reste où le joueur l\'a mis' : ' : le cadre est recentré'}`, () => {
      assert.deepEqual(m.erreurs, []);
      assert.ok(m.avant && m.apres && m.apres.mobile, 'cadre ou mode mobile absent');
      if (c.joueur) {
        assert.equal(m.apres.scrollLeft, 0, 'scrollLeft : ' + m.apres.scrollLeft);
      } else {
        assert.ok(Math.abs(m.apres.scrollLeft - m.apres.milieu) <= 1, `scrollLeft ${m.apres.scrollLeft}, attendu ${m.apres.milieu}`);
      }
    });
  });
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
