// Test de la qualité d'usage du plateau (PLT-QU) : compétences nommées, pastilles par classes,
// actions et accès rapides en grilles, légendes tactiles, planchers de texte. Fixture locale, aucun réseau.
//
// Fragment cartes (épopée 9, entrée 2, H7.1) : carte de personnage selon sa propre largeur ; fixture synthétique de 49 noms
// (plateau-cartes-noms.html), vrai Bootstrap 3.3.7, 768 à 1920 px, seuil de carte 199/200/201 px, Kraland clair et Empire Brun sombre ;
// 1512 et 1920 px et mobile 375 / 700 / 767 comparés au bundle de base ; bascule 767 -> 768 -> 767 px dans le même onglet.
//
// Usage : npm run build && node tests/e2e/plateau-qualite-usage.mjs
// Options : KR_SCRIPT=/chemin/script.user.js pour tester un autre fichier (défaut : bundle principal) ; KR_SCRIPT_AVANT (bundle de base
// du fragment cartes, défaut : git show 7bec452, recalage du sweep 9.12, ancienne base e203f87) ; KR_SCRIPT_AVANT_PV (bundle de base du fragment pv, défaut : git show cb73530) ;
// KR_SCRIPT_AVANT_ACCES (bundle de base du fragment acces-mobile, défaut : git show 666debd) ;
// KR_FRAG = usage, cartes, pv, acces-mobile (vide = tout).
//
// Fragment pv (épopée 9, entrée 7, Q30.5) : cercle et barre de PV des cartes par niveau de santé, en jetons de la feuille ; fixture
// plateau-cartes-noms.html, barres de PV ajoutées au chargement (largeurs 85, 71, 70, 31, 30, 10 %) et pdv6 à pdv9 hors table ; 16 variantes
// à 375 et 1280 px ; niveaux, arcs, largeurs et boîtes comparés au bundle de base (Kraland clair et Empire Brun sombre).
//
// Fragment acces-mobile (backlog 20) : cases des accès rapides et des actions de même hauteur, alignées par rangée ; fixture
// plateau-qualite-usage.html, vrai Bootstrap 3.3.7, 375 et 767 px, Kraland clair et Empire Brun sombre ; marge de 8 px entre deux .btn
// voisins hors de ces grilles gardée ; 768 px égal au bundle de base ; bascule 767 -> 768 -> 767 px dans le même onglet.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { frames, krReady, styleSettled, THEME_READY, waitState } from './lib/settle.mjs';
import { CONTRASTE, CORRIGER_BUG20, VARIANTES as TOUTES_VARIANTES, parVariante } from './lib/variantes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const html = fs.readFileSync(path.join(root, 'tests/e2e/fixtures/plateau-qualite-usage.html'), 'utf8');
const TARGET = 'http://www.kraland.org/jouer/plateau';
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

const browser = await launchBrowser();

// ---------- cartes : carte de personnage selon sa propre largeur (épopée 9, entrée 2) ----------
const SEUIL_CARTE = 200; // en dessous, le nom passe sous l'avatar
const VARIANTES = ['kraland', 'empire-brun-dark'];
const BUREAUX = [768, 769, 900, 1024, 1100, 1280, 1366, 1440, 1500, 1512, 1920];
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(root, 'tests/e2e/vendor');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');

async function ouvrirCartes(src, { width, height = 800, variante, transformer = h => h, fixture = 'plateau-cartes-noms.html' }) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  await confineNetwork(ctx);
  const noms = transformer(fs.readFileSync(path.join(root, 'tests/e2e/fixtures', fixture), 'utf8'))
    .replace('</head>', '<link rel="stylesheet" href="/lib/bootstrap-3.3.7/css/bootstrap.min.css"></head>');
  await ctx.route('http://www.kraland.org/**', route => {
    const u = new URL(route.request().url());
    if (u.pathname === '/jouer/plateau') { return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: noms }); }
    if (u.pathname.startsWith('/lib/bootstrap')) { return route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.css'), contentType: 'text/css' }); }
    return route.abort();
  });
  await ctx.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
  await ctx.addInitScript(({ s, v }) => {
    window.GM = { xmlHttpRequest: () => {} };
    localStorage.setItem('kr-theme-enabled', 'true');
    localStorage.setItem('kr-theme-variant', v);
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(s);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { s: src, v: variante });
  const p = await ctx.newPage();
  await p.goto(TARGET, { waitUntil: 'load' });
  await krReady(p, { ready: THEME_READY, label: `cartes ${width} px ${variante}` });
  return { ctx, p };
}

const mesurerCartes = p => p.evaluate(() => {
  const box = el => { const r = el.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(x => Math.round(x * 2) / 2); };
  return {
    variante: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')) || '',
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    cartes: [...document.querySelectorAll('.dashboard-card')].map(c => {
      const n = c.querySelector('.dashboard-card-name');
      const nc = c.querySelector('.dashboard-card-name-container');
      const a = c.querySelector('.dashboard-card-avatar');
      const nr = n.getBoundingClientRect(); const ar = a.getBoundingClientRect();
      const cs = getComputedStyle(n);
      return {
        nom: n.textContent.trim(), cw: c.getBoundingClientRect().width, inner: c.clientWidth,
        carte: box(c), avatar: box(a), boiteNom: box(n), conteneur: nc.getBoundingClientRect().width, entete: nc.parentElement.getBoundingClientRect().width,
        gaucheNom: Math.round(nc.firstElementChild.getBoundingClientRect().left * 2) / 2, drapeau: !!nc.querySelector('img'),
        gaucheStatut: c.querySelector('.dashboard-card-status') ? Math.round(c.querySelector('.dashboard-card-status').getBoundingClientRect().left * 2) / 2 : null,
        lignes: nr.height / parseFloat(cs.lineHeight), deborde: n.scrollWidth > n.clientWidth + 1, sw: n.scrollWidth, clw: n.clientWidth,
        dessous: nr.top >= ar.bottom - 1, taille: cs.fontSize,
        styles: [getComputedStyle(c).containerType, getComputedStyle(c).containerName, cs.overflowWrap, getComputedStyle(nc).flexBasis, getComputedStyle(nc).padding].join('|')
      };
    })
  };
});

async function cartesDe(src, opts) {
  const { ctx, p } = await ouvrirCartes(src, opts);
  const m = await mesurerCartes(p);
  await ctx.close();
  return m;
}

const vide = l => assert.equal(l.length, 0, l.slice(0, 6).join(' | '));

function verifierCartes(m, etiquette) {
  check(`${etiquette} : 49 cartes, variante ${m.variante}`, () => assert.equal(m.cartes.length, 49));
  check(`${etiquette} : avatars de 70×70`, () => assert.ok(m.cartes.every(c => c.avatar[2] === 70 && c.avatar[3] === 70), JSON.stringify([...new Set(m.cartes.map(c => c.avatar.slice(2).join('×')))])));
  check(`${etiquette} : noms en 15 px`, () => assert.ok(m.cartes.every(c => c.taille === '15px')));
  check(`${etiquette} : aucun nom ne déborde en largeur`, () => vide(m.cartes.filter(c => c.deborde).map(c => `${c.nom} ${c.sw}/${c.clw} carte ${c.cw}${c.dessous ? ' dessous' : ''}`)));
  check(`${etiquette} : deux lignes de nom au plus`, () => vide(m.cartes.filter(c => c.lignes > 2.05).map(c => `${c.nom} ${c.lignes.toFixed(2)}`)));
  check(`${etiquette} : nom sous l'avatar seulement sous ${SEUIL_CARTE} px de carte`, () => vide(m.cartes.filter(c => c.dessous !== (c.cw < SEUIL_CARTE)).map(c => `${c.nom} ${c.cw}px dessous=${c.dessous}`)));
  check(`${etiquette} : nom dessous sur toute la largeur de l'en-tête de la carte`, () => vide(m.cartes.filter(c => c.dessous && Math.abs(c.conteneur - c.entete) > 1).map(c => `${c.nom} ${c.conteneur}/${c.entete}`)));
  // Nom dessous aligné sur le statut : bord gauche du bloc du nom (drapeau compris quand il existe) = bord gauche du statut, ±1 px.
  for (const [libelle, avec] of [['avec drapeau', true], ['sans drapeau', false]]) {
    check(`${etiquette} : nom dessous ${libelle}, bord gauche égal à celui du statut`, () => {
      const l = m.cartes.filter(c => c.dessous && c.drapeau === avec && c.gaucheStatut !== null);
      if (m.cartes.some(c => c.dessous)) { assert.ok(l.length > 0, `aucune carte étroite ${libelle}`); }
      vide(l.filter(c => Math.abs(c.gaucheNom - c.gaucheStatut) > 1).map(c => `${c.nom} ${c.gaucheNom}/${c.gaucheStatut}`));
    });
  }
  check(`${etiquette} : pas de débordement horizontal`, () => assert.equal(m.overflowX, 0));
}

// Haut de page mobile remonté (revue S21, n° 4 : bande vide et marge sous les onglets retirées, mini-profil resserré) : sous 768 px, les
// boîtes sont comparées à la base après un recalage vertical sur la première carte (decalageHaut) ; tailles, positions horizontales et
// écarts verticaux entre cartes restent comparés tels quels. Sur ordinateur, aucun recalage.
const decalageHaut = (m, base, boite) => (m.cartes.length && base.cartes.length && boite(m.cartes[0]) && boite(base.cartes[0])
  ? boite(m.cartes[0])[1] - boite(base.cartes[0])[1] : 0);
const recaleY = (b, dy) => (b ? [b[0], b[1] - dy, b[2], b[3]] : b);
const memesBoites = (m, base, garde = () => true, { recaler = false } = {}) => {
  const ecarts = [];
  const dy = recaler ? decalageHaut(m, base, c => c.carte) : 0;
  m.cartes.forEach((c, i) => {
    const b = base.cartes[i];
    if (!garde(c, b)) { return; }
    for (const k of ['carte', 'avatar', 'boiteNom']) { if (JSON.stringify(recaleY(c[k], dy)) !== JSON.stringify(b[k])) { ecarts.push(`${c.nom} ${k} ${c[k]} / ${b[k]}`); } }
  });
  return ecarts;
};

if (on('cartes')) {
  // Écart voulu du bug 20 (accès rapides mobiles 24 px moins hauts, cartes remontées) : base corrigée par CORRIGER_BUG20.
  const avant = CORRIGER_BUG20(sansEntete(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
    : execFileSync('git', ['show', '7bec452:kraland-userscript-main.user.js'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })));
  for (const variante of VARIANTES) {
    console.log(`Cartes de personnage selon leur largeur (${variante})`);
    for (const width of BUREAUX) {
      const m = await cartesDe(userscript, { width, variante });
      verifierCartes(m, `${width} px ${variante}`);
      if (width === 1512 || width === 1920) {
        const base = await cartesDe(avant, { width, variante });
        // Égal à la base : toute carte d'au moins SEUIL_CARTE px dont le nom tenait déjà dans sa ligne à la base.
        check(`${width} px ${variante} : cartes ≥ ${SEUIL_CARTE} px égales à la base`, () => vide(memesBoites(m, base, (c, b) => c.cw >= SEUIL_CARTE && !b.deborde)));
      }
    }
    for (const width of [375, 700, 767]) {
      const m = await cartesDe(userscript, { width, height: 667, variante });
      const base = await cartesDe(avant, { width, height: 667, variante });
      check(`mobile ${width} px ${variante} : cartes, avatars et noms égaux à la base (recalés sur la première carte)`, () => { assert.equal(m.cartes.length, base.cartes.length); assert.deepEqual(memesBoites(m, base, undefined, { recaler: true }), []); });
      // Styles de la règle du ticket (conteneur, coupure, bloc du nom) égaux à la base : une règle sortie de son média rougit à toute largeur mobile.
      check(`mobile ${width} px ${variante} : conteneur, coupure et bloc du nom égaux à la base`, () => vide(m.cartes.filter((c, i) => c.styles !== base.cartes[i].styles).map(c => `${c.nom} ${c.styles} / ${base.cartes[m.cartes.indexOf(c)].styles}`)));
    }
    console.log(`Bascule 767 -> 768 -> 767 px dans le même onglet (${variante})`);
    {
      const directs = { 767: await cartesDe(avant, { width: 767, height: 667, variante }), 768: await cartesDe(userscript, { width: 768, height: 667, variante }) };
      const { ctx, p } = await ouvrirCartes(userscript, { width: 767, height: 667, variante });
      const mobile767 = await p.evaluate(() => document.body.classList.contains('mobile-mode'));
      check(`bascule ${variante} : 767 px au chargement en mode mobile`, () => assert.ok(mobile767));
      for (const [w, mobile] of [[768, false], [767, true]]) {
        await p.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
        const charge = p.waitForEvent('load', { timeout: 8000 }).catch(() => null);
        await p.setViewportSize({ width: w, height: 667 });
        await charge;
        const etat = await waitState(p, m => document.body && document.body.classList.contains('mobile-mode') === m, mobile, { maxMs: 10000 });
        await krReady(p, { ready: THEME_READY, label: `bascule ${w} px ${variante}` });
        await frames(p);
        const m = await mesurerCartes(p);
        check(`bascule ${variante} : ${w} px, body.mobile-mode ${mobile ? 'remis' : 'levé'}`, () => assert.ok(etat));
        if (!mobile) { verifierCartes(m, `bascule ${w} px ${variante}`); }
        check(`bascule ${variante} : ${w} px égal au chargement direct${mobile ? ' de la base (recalé sur la première carte)' : ''}`, () => { assert.equal(m.cartes.length, directs[w].cartes.length); vide(memesBoites(m, directs[w], undefined, { recaler: mobile })); });
      }
      await ctx.close();
    }
    console.log(`Seuil de carte 199 / 200 / 201 px, transitions dans le même onglet (${variante})`);
    const { ctx, p } = await ouvrirCartes(userscript, { width: 1440, variante });
    for (const w of [201, 199, 200, 199, 201]) {
      await p.evaluate(px => document.querySelectorAll('.dashboard-cards-grid').forEach(g => { g.style.gridTemplateColumns = `repeat(auto-fill, ${px}px)`; }), w);
      await frames(p);
      const m = await mesurerCartes(p);
      check(`carte de ${w} px ${variante} : nom ${w < SEUIL_CARTE ? 'sous' : 'à côté de'} l'avatar`, () => { assert.ok(m.cartes.every(c => Math.round(c.cw) === w), [...new Set(m.cartes.map(c => c.cw))].join('/')); assert.ok(m.cartes.every(c => c.dessous === (w < SEUIL_CARTE))); });
      check(`carte de ${w} px ${variante} : aucun nom ne déborde, deux lignes au plus`, () => assert.ok(m.cartes.every(c => !c.deborde && c.lignes <= 2.05)));
    }
    await ctx.close();
  }
}

// ---------- pv : cercle et barre de PV des cartes en jetons (épopée 9, entrée 7) ----------
const LARGEURS_PV = [85, 71, 70, 31, 30, 10];
// Barre de PV native ajoutée à chaque carte (aucune fixture n'en a), quatre niveaux hors table (pdv6 à pdv9, repli sur le niveau 1) et
// une carte sans image pdv (niveau absent : ni cercle ni avatar KO, la barre reste). Balisage de la barre supposé (div à fond et largeur
// en ligne, lu par le template), non relevé sur le site.
const avecBarres = h => {
  let i = 0;
  return ['pdv6.png', 'pdv7.png', 'pdv8.png', 'pdv9.png'].reduce((t, n) => t.replace('pdv1.png', n), h)
    .replace(/alt="PV"><\/span>/g, () => `alt="PV"><div style="background-color: #5cb85c; width: ${LARGEURS_PV[i++ % LARGEURS_PV.length]}%; height: 3px"></div></span>`)
    .replace(/<img src="[^"]*pdv1\.png" alt="PV">(?=<div style="background-color)/, '');
};
// Couleurs en dur du bundle de base : niveau du cercle et de la barre lus sur la base.
const NIVEAU_BASE = { '#32CD32': 1, '#FFD700': 2, '#FF8C00': 3, '#DC143C': 4, '#8B0000': 5, 'rgb(92, 184, 92)': 1, 'rgb(240, 173, 78)': 3, 'rgb(217, 83, 79)': 4 };

const mesurerPv = p => p.evaluate(() => {
  const C = window.__krContraste;
  const box = el => { const r = el.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(x => Math.round(x * 2) / 2); };
  const jeton = n => C.rgb(C.sonde(`var(--kr-pv-${n})`));
  const attrs = el => [...el.attributes].map(a => a.name);
  return {
    variante: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')) || '',
    jetons: Object.fromEntries([1, 2, 3, 4, 5, 'track'].map(n => [n, jeton(n)])),
    cartes: [...document.querySelectorAll('.dashboard-card')].map(c => {
      const svg = c.querySelector('.dashboard-card-hp-circle');
      const [piste, arc] = svg ? svg.querySelectorAll('circle') : [];
      const fill = c.querySelector('.dashboard-card-hp-fill');
      const av = c.querySelector('.dashboard-card-avatar');
      const fondCercle = svg && C.fond(svg.parentElement);
      const fondBarre = fill && C.fond(fill.parentElement);
      const trait = arc && C.rgb(getComputedStyle(arc).stroke);
      const remplissage = fill && C.rgb(getComputedStyle(fill).backgroundColor);
      return {
        nom: c.querySelector('.dashboard-card-name').textContent.trim(),
        classeCercle: svg ? svg.getAttribute('class') : null,
        classeBarre: fill ? fill.getAttribute('class') : null,
        attrStroke: svg ? [svg, piste, arc].some(e => e.hasAttribute('stroke') || e.hasAttribute('style')) : null,
        strokeBase: arc ? arc.getAttribute('stroke') : null,
        fondBase: fill ? fill.style.backgroundColor : null,
        styleBarre: fill ? fill.getAttribute('style') : null,
        largeur: fill ? fill.style.width : null,
        styleAvatar: av.getAttribute('style'), attrsAvatar: attrs(av), classeAvatar: av.getAttribute('class'),
        arc: arc ? arc.getAttribute('stroke-dashoffset') : null,
        trait, piste: piste && C.rgb(getComputedStyle(piste).stroke), remplissage,
        contrasteCercle: trait && C.rapport(trait.slice(0, 3), fondCercle),
        contrasteBarre: remplissage && C.rapport(remplissage.slice(0, 3), fondBarre),
        filtre: getComputedStyle(av).filter, opacite: getComputedStyle(av).opacity,
        boites: [svg, av, fill && fill.parentElement, fill].map(e => e ? box(e) : null)
      };
    })
  };
});

async function pvDe(src, opts) {
  const { ctx, p } = await ouvrirCartes(src, { ...opts, transformer: avecBarres });
  await p.evaluate(CONTRASTE);
  const m = await mesurerPv(p);
  await ctx.close();
  return m;
}

if (on('pv')) {
  const avantPv = CORRIGER_BUG20(sansEntete(process.env.KR_SCRIPT_AVANT_PV ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_PV, 'utf8')
    : execFileSync('git', ['show', 'cb73530:kraland-userscript-main.user.js'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })));
  const proche = (a, b) => !!a && !!b && [0, 1, 2].every(i => Math.abs(a[i] - b[i]) <= 1);
  for (const width of [375, 1280]) {
    const height = width < 768 ? 667 : 800;
    const base = await pvDe(avantPv, { width, height, variante: 'kraland' });
    // Niveaux attendus, lus sur la base (même fixture, même ordre des cartes) : cercle (pdv) et barre (seuils > 70 %, > 30 %).
    // Carte au niveau absent (sans image pdv) : sans cercle dans la base, contrôlée à part.
    const tous = base.cartes.map(c => ({ cercle: NIVEAU_BASE[c.strokeBase], barre: NIVEAU_BASE[c.fondBase] }));
    const absente = base.cartes.findIndex(c => c.classeCercle === null);
    const niveaux = tous.filter((n, i) => i !== absente);
    console.log(`PV des cartes en jetons, ${width} px (16 variantes)`);
    check(`${width} px : base lue, 49 cartes dont 1 sans niveau, 5 niveaux de cercle et 3 de barre`, () => {
      assert.equal(tous.length, 49);
      assert.equal(base.cartes.filter(c => c.classeCercle === null).length, 1, 'cartes sans cercle dans la base');
      assert.deepEqual([...new Set(niveaux.map(n => n.cercle))].sort(), [1, 2, 3, 4, 5]);
      assert.deepEqual([...new Set(tous.map(n => n.barre))].sort(), [1, 3, 4]);
    });
    const mesures = await parVariante(variante => pvDe(userscript, { width, height, variante }), { variantes: TOUTES_VARIANTES });
    mesures.forEach((m, vi) => {
      const v = TOUTES_VARIANTES[vi];
      const e = `${width} px ${v}`;
      const sans = m.cartes[absente];
      const l = m.cartes.filter((c, i) => i !== absente);
      check(`${e} : variante posée, 48 cartes à cercle et barre`, () => { assert.equal(m.variante, 'kr-theme-variant-' + v); assert.equal(l.length, 48); assert.ok(l.every(c => c.classeCercle && c.classeBarre)); });
      check(`${e} : niveau absent (sans image pdv) : aucun cercle, avatar sans is-ko ni filtre, barre gardée`, () => {
        assert.ok(sans, 'carte sans niveau absente');
        assert.equal(sans.classeCercle, null);
        assert.ok(!(sans.classeAvatar || '').split(' ').includes('is-ko'), sans.classeAvatar);
        assert.equal(sans.filtre, 'none');
        assert.equal(sans.opacite, '1');
        assert.ok(sans.classeBarre, 'barre absente');
      });
      check(`${e} : aucune couleur en ligne (ni attribut stroke, ni style) sur le cercle`, () => vide(l.filter(c => c.attrStroke).map(c => c.nom)));
      check(`${e} : barre, seule la largeur en ligne`, () => vide(l.filter(c => !/^width: \d+%;?$/.test(c.styleBarre)).map(c => `${c.nom} ${c.styleBarre}`)));
      check(`${e} : avatar sans style en ligne`, () => vide(l.filter(c => c.styleAvatar !== null).map(c => `${c.nom} ${c.styleAvatar}`)));
      check(`${e} : classe de niveau du cercle (pdv6 à pdv9 -> 1)`, () => vide(l.filter((c, i) => !c.classeCercle.split(' ').includes('kr-pv-' + niveaux[i].cercle)).map(c => `${c.nom} ${c.classeCercle}`)));
      check(`${e} : trait du cercle = jeton du niveau`, () => vide(l.filter((c, i) => !proche(c.trait, m.jetons[niveaux[i].cercle])).map(c => `${c.nom} ${c.trait} / ${m.jetons[niveaux[l.indexOf(c)].cercle]}`)));
      check(`${e} : piste du cercle = --kr-pv-track`, () => vide(l.filter(c => !proche(c.piste, m.jetons.track) || Math.abs(c.piste[3] - m.jetons.track[3]) > 0.01).map(c => `${c.nom} ${c.piste}`)));
      check(`${e} : fond de la barre = jeton du seuil (> 70 : 1, > 30 : 3, sinon 4)`, () => vide(l.filter((c, i) => !proche(c.remplissage, m.jetons[niveaux[i].barre])).map(c => `${c.nom} ${c.largeur} ${c.remplissage}`)));
      // Ordre de gravité, dans les deux modes : le niveau 5 (presque mort) plus sombre que le 4 (luminance WCAG).
      check(`${e} : niveau 5 plus sombre que le 4`, () => {
        const lum = c => c.slice(0, 3).map(x => { const k = x / 255; return k <= 0.03928 ? k / 12.92 : ((k + 0.055) / 1.055) ** 2.4; }).reduce((a, k, i) => a + k * [0.2126, 0.7152, 0.0722][i], 0);
        assert.ok(lum(m.jetons[5]) < lum(m.jetons[4]), `niveau 5 ${m.jetons[5]} / niveau 4 ${m.jetons[4]}`);
      });
      check(`${e} : 5 couleurs de niveau distinctes`, () => {
        const j = [1, 2, 3, 4, 5].map(n => m.jetons[n]);
        j.forEach((a, i) => j.forEach((b, k) => { if (k > i) { assert.ok(!proche(a, b), `niveaux ${i + 1} et ${k + 1} : ${a}`); } }));
      });
      const min = k => Math.min(...l.map(c => c[k])).toFixed(2);
      console.log(`  info ${e} : contraste minimal cercle ${min('contrasteCercle')}:1, barre ${min('contrasteBarre')}:1`);
      check(`${e} : cercle ≥ 3:1 sur la carte`, () => vide(l.filter(c => c.contrasteCercle < 3).map(c => `${c.nom} ${c.contrasteCercle.toFixed(2)}`)));
      check(`${e} : barre ≥ 3:1 sur sa piste`, () => vide(l.filter(c => c.contrasteBarre < 3).map(c => `${c.nom} ${c.contrasteBarre.toFixed(2)}`)));
      check(`${e} : avatar KO (pdv5) gris à 0,7, les autres intacts`, () => vide(l.filter((c, i) => niveaux[i].cercle === 5
        ? !(c.filtre === 'grayscale(1)' && c.opacite === '0.7') : !(c.filtre === 'none' && c.opacite === '1')).map(c => `${c.nom} ${c.filtre} ${c.opacite}`)));
    });
    for (const variante of ['kraland', 'empire-brun-dark']) {
      const b = variante === 'kraland' ? base : await pvDe(avantPv, { width, height, variante });
      const m = mesures[TOUTES_VARIANTES.indexOf(variante)];
      // Sous 768 px, boîtes recalées sur l'avatar de la première carte (decalageHaut, revue S21, n° 4).
      const dy = width < 768 ? decalageHaut(m, b, c => c.boites[1]) : 0;
      check(`${width} px ${variante} : arcs, largeurs de barre et boîtes (cercle, avatar, barre) égaux à la base${dy ? ' (recalées sur la première carte)' : ''}`, () => vide(m.cartes.flatMap((c, i) => {
        const o = b.cartes[i];
        const r = { ...c, boites: c.boites.map(x => recaleY(x, dy)) };
        return ['arc', 'largeur', 'boites'].filter(k => JSON.stringify(r[k]) !== JSON.stringify(o[k])).map(k => `${c.nom} ${k} ${JSON.stringify(c[k])} / ${JSON.stringify(o[k])}`);
      })));
    }
  }
}

// ---------- acces-mobile : cases des grilles du plateau sans la marge de .btn + .btn (backlog 20) ----------
const mesurerAcces = p => p.evaluate(() => {
  const box = el => { const r = el.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(x => Math.round(x * 2) / 2); };
  const grille = sel => [...document.querySelectorAll(sel)].map(e => ({ texte: e.textContent.trim(), boite: box(e), marge: getComputedStyle(e).marginTop, affiche: e.getClientRects().length > 0 }));
  const temoin = document.createElement('div');
  temoin.innerHTML = '<a class="btn btn-default" href="#">A</a><a class="btn btn-default" href="#">B</a>';
  document.body.appendChild(temoin);
  const margeTemoin = getComputedStyle(temoin.lastElementChild).marginTop;
  temoin.remove();
  return { mobile: document.body.classList.contains('mobile-mode'), acces: grille('.kr-quick-access-buttons > .btn'), actions: grille('.kr-action-grid > .btn'), margeTemoin };
});
const verifierAcces = (m, e) => {
  check(`${e} : mode mobile, 5 accès rapides affichés, 4 actions dans le DOM`, () => { assert.ok(m.mobile); assert.equal(m.acces.filter(c => c.affiche).length, 5); assert.equal(m.actions.length, 4); });
  check(`${e} : cases affichées des deux grilles de même hauteur`, () => assert.equal(new Set([...m.acces, ...m.actions].filter(c => c.affiche).map(c => c.boite[3])).size, 1));
  for (const [nom, cases] of [['accès rapides', m.acces], ['actions', m.actions]]) {
    const vues = cases.filter(c => c.affiche);
    check(`${e} : ${nom}, cases de même hauteur (≥ 44 px), même top par rangée`, () => {
      const h = [...new Set(vues.map(c => c.boite[3]))];
      assert.ok(h.length <= 1 && (h.length === 0 || h[0] >= 44), vues.map(c => `${c.texte} ${c.boite[3]}`).join(', '));
      for (let i = 0; i + 1 < vues.length; i += 2) { assert.equal(vues[i].boite[1], vues[i + 1].boite[1], `${vues[i].texte} / ${vues[i + 1].texte}`); }
    });
    check(`${e} : ${nom}, marge haute nulle sur chaque case (affichée ou non)`, () => assert.deepEqual(cases.filter(c => c.marge !== '0px').map(c => `${c.texte} ${c.marge}`), []));
  }
  check(`${e} : deux .btn voisins hors des grilles, marge haute de 8 px gardée`, () => assert.equal(m.margeTemoin, '8px'));
};

if (on('acces-mobile')) {
  const avant = sansEntete(process.env.KR_SCRIPT_AVANT_ACCES ? fs.readFileSync(process.env.KR_SCRIPT_AVANT_ACCES, 'utf8')
    : execFileSync('git', ['show', '666debd:kraland-userscript-main.user.js'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
  const accesDe = async (src, o) => { const { ctx, p } = await ouvrirCartes(src, { ...o, height: 667, fixture: 'plateau-qualite-usage.html' }); await frames(p); const m = await mesurerAcces(p); await ctx.close(); return m; };
  const egalBase = (m, b, e) => check(`${e} : accès rapides et actions égaux à la base`, () => assert.deepEqual([m.acces, m.actions], [b.acces, b.actions]));
  for (const variante of VARIANTES) {
    console.log(`Accès rapides mobiles alignés (${variante})`);
    for (const width of [375, 767]) { verifierAcces(await accesDe(userscript, { width, variante }), `${width} px ${variante}`); }
    const base768 = await accesDe(avant, { width: 768, variante });
    const m768 = await accesDe(userscript, { width: 768, variante });
    check(`768 px ${variante} : mode ordinateur`, () => assert.ok(!m768.mobile));
    egalBase(m768, base768, `768 px ${variante}`);
    const { ctx, p } = await ouvrirCartes(userscript, { width: 767, height: 667, variante, fixture: 'plateau-qualite-usage.html' });
    for (const [w, mobile] of [[768, false], [767, true]]) {
      await p.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
      const charge = p.waitForEvent('load', { timeout: 8000 }).catch(() => null);
      await p.setViewportSize({ width: w, height: 667 });
      await charge;
      const etat = await waitState(p, m => document.body && document.body.classList.contains('mobile-mode') === m, mobile, { maxMs: 10000 });
      await krReady(p, { ready: THEME_READY, label: `bascule acces ${w} px ${variante}` });
      await frames(p);
      const m = await mesurerAcces(p);
      check(`bascule acces ${variante} : ${w} px, body.mobile-mode ${mobile ? 'remis' : 'levé'}`, () => assert.ok(etat));
      if (mobile) { verifierAcces(m, `bascule ${w} px ${variante}`); } else { egalBase(m, base768, `bascule ${w} px ${variante}`); }
    }
    await ctx.close();
  }
}

if (!on('usage')) {
  await browser.close();
  console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
  process.exit(failures === 0 ? 0 : 1);
}

const context = await browser.newContext({ viewport: { width: 1512, height: 772 } });
await confineNetwork(context); // refus global EN PREMIER (version.json : refusé ; img7 routé ci-dessous)
await context.route(TARGET, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
await context.addInitScript(({ src }) => {
  window.GM = { xmlHttpRequest: () => {} };
  localStorage.setItem('kr-theme-enabled', 'true');
  localStorage.setItem('kr-theme-variant', 'empire-brun-dark');
  // eslint-disable-next-line no-eval
  const go = () => (0, eval)(src);
  if (document.body) { go(); return; }
  new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
}, { src: userscript });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);

const snapshot = () => page.evaluate(() => {
  const rect = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom }; };
  const skills = [...document.querySelectorAll('#skills-panel a.kr-skill')];
  const grid = document.querySelector('#player-actions-section .kr-action-grid');
  const quick = document.querySelector('.kr-quick-access-buttons');
  const gridBtns = grid ? [...grid.children] : [];
  const quickBtns = quick ? [...quick.children] : [];
  const cs = (sel) => { const e = document.querySelector(sel); return e ? parseFloat(getComputedStyle(e).fontSize) : null; };
  const badgeColors = [...document.querySelectorAll('.kr-skill-badge, .kr-stat-badge')].map(b => getComputedStyle(b).backgroundColor);
  return {
    skills: skills.map(s => ({ aria: s.getAttribute('aria-label'), title: s.title, alt: s.querySelector('img') && s.querySelector('img').alt, label: s.getAttribute('data-kr-label'), tab: s.tabIndex, toggle: s.hasAttribute('data-toggle'), badge: s.querySelector('.badge') && s.querySelector('.badge').className, inlineBadgeStyle: s.querySelector('.badge') && s.querySelector('.badge').getAttribute('style'), caption: s.querySelector('.kr-skill-caption') && s.querySelector('.kr-skill-caption').textContent, rect: rect(s), badgeRect: rect(s.querySelector('.badge')), after: getComputedStyle(s, '::after').display === 'none' ? 'hidden' : 'visible', afterDisplay: getComputedStyle(s, '::after').display, captionDisplay: getComputedStyle(s.querySelector('.kr-skill-caption')).display, captionFont: parseFloat(getComputedStyle(s.querySelector('.kr-skill-caption')).fontSize) })),
    statLabels: [...document.querySelectorAll('#col-leftest-stats a.kr-stat')].map(s => s.getAttribute('aria-label')),
    badgeColors,
    gridCount: document.querySelectorAll('.kr-action-grid').length,
    quickCount: document.querySelectorAll('.kr-quick-access-buttons').length,
    quickRows: document.querySelectorAll('.kr-quick-access-buttons .row, .kr-quick-access-buttons [class*="col-"]').length,
    gridTexts: gridBtns.map(b => b.textContent.trim()), gridRects: gridBtns.map(rect),
    gridAttrs: gridBtns.map(b => ({ href: b.getAttribute('href'), cls: [...b.classList].filter(c => /^alert/.test(c)).join(' ') })),
    hrInGrid: grid ? grid.querySelectorAll('hr').length : -1,
    hrInSection: document.querySelectorAll('#player-actions-section > hr').length,
    quickTexts: quickBtns.map(b => b.textContent.trim()), quickRects: quickBtns.map(rect), quickHrefs: quickBtns.map(b => b.getAttribute('href')),
    fonts: { header: cs('.dashboard-section-header'), status: cs('.dashboard-card-status') },
    headerBg: getComputedStyle(document.querySelector('.dashboard-section-header')).backgroundColor,
    headerBorder: getComputedStyle(document.querySelector('.dashboard-section-header')).borderLeftWidth,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
});

await page.goto(TARGET, { waitUntil: 'load' });
await krReady(page, { ready: THEME_READY, label: 'chargement plateau' });
let s = await snapshot();

console.log('Compétences nommées (desktop 1512)');
check('4 compétences transformées', () => assert.equal(s.skills.length, 4));
check('aria-label « Nom — niveau N » sur chaque compétence', () => assert.deepEqual(s.skills.map(k => k.aria), ['Baratin — niveau 0', 'Combat Mains Nues — niveau 2', 'Vol — niveau 11', 'Pouvoir — niveau 0']));
check('title identique (infobulle native) et alt = nom', () => { assert.deepEqual(s.skills.map(k => k.title), s.skills.map(k => k.aria)); assert.deepEqual(s.skills.map(k => k.alt), ['Baratin', 'Combat Mains Nues', 'Vol', 'Pouvoir']); });
check('title conservé malgré disableTooltips (data-toggle retiré)', () => { assert.ok(s.skills.every(k => !k.toggle)); assert.equal(s.skills[2].title, 'Vol — niveau 11'); });
check('cellule focusable au clavier (lien natif)', () => assert.ok(s.skills.every(k => k.tab >= 0)));
check('caractéristiques nommées', () => assert.deepEqual(s.statLabels, ['FOR : 3', 'VOL : 0']));

console.log('Pastilles : classes et couleurs');
check('is-zero pour le niveau 0, is-level pour 2 et 11', () => assert.deepEqual(s.skills.map(k => /is-zero/.test(k.badge) ? 'zero' : /is-level/.test(k.badge) ? 'level' : '?'), ['zero', 'level', 'level', 'zero']));
check('plus aucun style inline sur les pastilles', () => assert.ok(s.skills.every(k => !k.inlineBadgeStyle)));
check('ni rouge #c9302c ni bleu #0069d9 sur un état normal', () => assert.ok(s.badgeColors.every(c => c !== 'rgb(201, 48, 44)' && c !== 'rgb(0, 105, 217)'), s.badgeColors.join(' ')));
check('niveau ≥ 1 et niveau 0 de couleurs différentes', () => assert.notEqual(s.skills[1].badge, s.skills[0].badge));
check('pastille dans la boîte de sa cellule', () => assert.ok(s.skills.every(k => k.badgeRect.r <= k.rect.r + 0.5 && k.badgeRect.b <= k.rect.b + 0.5 && k.badgeRect.x >= k.rect.x - 0.5 && k.badgeRect.y >= k.rect.y - 0.5)));

console.log('Étiquette au survol et au focus (pointeur précis)');
check('étiquette masquée au repos, légende masquée', () => assert.ok(s.skills.every(k => k.after === 'hidden' && k.captionDisplay === 'none')));
await page.hover('#skills-panel a.kr-skill >> nth=1');
await styleSettled(page, '#skills-panel a.kr-skill', { index: 1, state: ':hover' }); // au lieu de 300 ms
const hovered = await page.evaluate(() => { const e = document.querySelectorAll('#skills-panel a.kr-skill')[1]; return { v: getComputedStyle(e, '::after').display === 'none' ? 'hidden' : 'visible', c: getComputedStyle(e, '::after').content }; });
check('étiquette « Nom · N » visible au survol', () => { assert.equal(hovered.v, 'visible'); assert.ok(hovered.c.includes('Combat Mains Nues · 2'), hovered.c); });
await page.mouse.move(700, 600);
await page.focus('#skills-panel a.kr-skill >> nth=2');
await page.keyboard.press('Shift+Tab');
await page.keyboard.press('Tab');
const focused = await page.evaluate(() => { const e = document.activeElement; return { skill: e.classList.contains('kr-skill'), v: getComputedStyle(e, '::after').display === 'none' ? 'hidden' : 'visible', fv: e.matches(':focus-visible') }; });
check('étiquette visible au focus clavier (:focus-visible)', () => { assert.ok(focused.skill && focused.fv); assert.equal(focused.v, 'visible'); });

console.log('Actions de jeu en grille (2 colonnes égales)');
check('une seule grille, 4 actions dans le DOM réel', () => { assert.equal(s.gridCount, 1); assert.deepEqual(s.gridTexts, ['Dormir', 'Prier', 'Pouvoir', 'Fouiller']); });
check('séparateur d\'origine hors de la grille', () => { assert.equal(s.hrInGrid, 0); assert.equal(s.hrInSection, 1); });
const cols = (rects) => [...new Set(rects.map(r => Math.round(r.x)))];
check('2 colonnes, largeurs égales (±1 px)', () => { assert.equal(cols(s.gridRects).length, 2); assert.ok(Math.max(...s.gridRects.map(r => r.w)) - Math.min(...s.gridRects.map(r => r.w)) <= 1); });
check('hauteur homogène par rangée', () => { assert.ok(Math.abs(s.gridRects[0].h - s.gridRects[1].h) <= 1 && Math.abs(s.gridRects[2].h - s.gridRects[3].h) <= 1); });
check('liens, classes et attributs d\'origine intacts', () => { assert.deepEqual(s.gridAttrs, [{ href: '#', cls: 'alert11' }, { href: '#', cls: 'alert12' }, { href: '#', cls: 'alert14' }, { href: '#', cls: 'alert1103' }]); });
await page.evaluate(() => document.querySelectorAll('#player-actions-section a.btn').forEach(a => a.click()));
const clicks = await page.evaluate(() => window.__clicks);
check('gestionnaires d\'origine toujours actifs (clic simulé sur la fixture, aucune action réelle)', () => assert.deepEqual(clicks, { alert11: 1, alert12: 1, alert14: 1, alert1103: 1 }));

console.log('Accès rapides en grille alignée sur les actions');
check('5 accès rapides, sans row/col imbriqués, destinations d\'origine', () => { assert.deepEqual(s.quickTexts, ['Agir', 'Matériel', 'Personnage', 'Bâtiments', 'Employés']); assert.equal(s.quickRows, 0); assert.deepEqual(s.quickHrefs, ['/jouer/plateau', '/jouer/materiel', '/jouer/perso', '/jouer/bat', '/jouer/pnj']); });
check('mêmes bords gauches (≤ 1 px) et mêmes largeurs que la grille d\'actions', () => {
  assert.ok(Math.abs(s.quickRects[0].x - s.gridRects[0].x) <= 1, `${s.quickRects[0].x} vs ${s.gridRects[0].x}`);
  assert.ok(Math.abs(s.quickRects[1].x - s.gridRects[1].x) <= 1);
  assert.ok(Math.abs(s.quickRects[0].w - s.gridRects[0].w) <= 1);
});
check('nombre impair : la dernière commande reste alignée à gauche', () => assert.ok(Math.abs(s.quickRects[4].x - s.quickRects[0].x) <= 1));

console.log('Textes et en-têtes');
check('en-tête de groupe ≥ 12 px, statut ≥ 12 px', () => { assert.ok(s.fonts.header >= 12 && s.fonts.status >= 12, JSON.stringify(s.fonts)); });
check('en-tête de groupe : fond surface + filet, plus d\'aplat saturé', () => { assert.notEqual(s.headerBg, 'rgb(122, 82, 64)'); assert.equal(s.headerBorder, '4px'); });
check('pas de débordement horizontal', () => assert.equal(s.overflowX, 0, `${s.overflowX} px`));

console.log('Idempotence (réinjection du script par-dessus un DOM déjà transformé)');
await page.evaluate((src) => {
  // Le nouvel InitQueue reposera html[data-kr-ready] après ses tâches différées : condition au lieu de 2,5 s
  document.documentElement.removeAttribute('data-kr-ready');
  // eslint-disable-next-line no-eval
  (0, eval)(src);
  document.body.appendChild(document.createElement('span'));
}, userscript);
await krReady(page, { label: 'réinjection plateau' });
const s2 = await snapshot();
check('aucun doublon de grille, de pastille ni de légende après réinjection', () => { assert.equal(s2.gridCount, 1); assert.equal(s2.quickCount, 1); assert.equal(s2.skills.length, 4); });
check('actions et accès rapides inchangés après réinjection', () => { assert.deepEqual(s2.gridTexts, ['Dormir', 'Prier', 'Pouvoir', 'Fouiller']); assert.deepEqual(s2.quickTexts, ['Agir', 'Matériel', 'Personnage', 'Bâtiments', 'Employés']); });
const dupes = await page.evaluate(() => [...document.querySelectorAll('#skills-panel a.kr-skill')].map(a => [a.querySelectorAll('.badge').length, a.querySelectorAll('.kr-skill-caption').length, a.querySelectorAll('img').length]));
check('1 pastille, 1 légende, 1 icône par compétence', () => assert.deepEqual(dupes, [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]]));

console.log('Tactile et tablette large (hover: none, pointer: coarse) : 1180 px');
await page.setViewportSize({ width: 1180, height: 820 });
await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
// Au lieu de 1,8 s : redimensionnement distribué et règles (hover: none) appliquées (légendes affichées), borné sans erreur
await frames(page);
await waitState(page, () => window.matchMedia('(hover: none)').matches && [...document.querySelectorAll('#skills-panel .kr-skill-caption')].every(c => getComputedStyle(c).display !== 'none'), null, { maxMs: 3000 });
await frames(page);
const t = await snapshot();
check('légende du nom visible sans survol, ≥ 12 px', () => assert.ok(t.skills.every(k => k.captionDisplay !== 'none' && k.captionFont >= 12), JSON.stringify(t.skills.map(k => [k.captionDisplay, k.captionFont]))));
check('légendes = noms des compétences', () => assert.deepEqual(t.skills.map(k => k.caption), ['Baratin', 'Combat Mains Nues', 'Vol', 'Pouvoir']));
check('plus d\'étiquette de survol (remplacée par la légende)', () => assert.ok(t.skills.every(k => k.afterDisplay === 'none')));
check('aucun chevauchement entre cellules voisines (légendes comprises)', () => {
  const boxes = t.skills.map(k => k.rect);
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i]; const b = boxes[j];
      const ix = Math.max(0, Math.min(a.r, b.r) - Math.max(a.x, b.x)); const iy = Math.max(0, Math.min(a.b, b.b) - Math.max(a.y, b.y));
      assert.ok(ix * iy < 1, `cellules ${i} et ${j}`);
    }
  }
});
check('cibles tactiles ≥ 44 px pour les commandes', () => assert.ok(t.gridRects.every(r => r.h >= 44) && t.quickRects.every(r => r.h >= 44)));
check('pas de débordement horizontal à 1180', () => assert.equal(t.overflowX, 0));

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
