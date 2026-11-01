// Densité mobile du Matériel et du Personnage (1er novembre 2026, retours d'Arnaud : « les mêmes reproches que pour la popin d'ordre »,
// « la vue organisation qui est mal gérée ») : section « MATÉRIEL ET PERSONNAGE MOBILES : DENSITÉ » du thème, classes de page
// kr-page-materiel et kr-page-personnage (KR_PAGE_CLASSES), cadre bord à bord des ordres longs (trackOrderModalViewport), sélecteur
// d'objet (groupSelectOptions), défilement de l'onglet actif (scrollToActiveTab) et rangée d'en-tête (transformOrderModalStructure).
// Fixtures du dépôt servies à leurs vraies adresses avec les feuilles natives du site (tests/e2e/vendor/parler) : jeu-materiel.html,
// jeu-perso-densite.html (FIXTURE SYNTHÉTIQUE, structure relevée sur le site réel), modale-ordre/objet.html et
// modale-ordre/organisation.html (FIXTURES SYNTHÉTIQUES, contenu du bloc d'ordre) ouvertes par Bootbox sur modale-ordre/plateau.html.
// Repères déjà cités par trois suites tenus dans lib/densite-jeu.mjs (MAX_CITING du routeur).
// Mobile : 320, 360 et 375 px, Kraland clair et Empire Brun sombre ; ordinateur : 1280 px égal au bundle de base (COMMIT_BASE).
//   materiel      ligne d'objet : nom sur toute la largeur, détail et charge dessous (charge au bord droit, détail à l'aplomb du nom),
//                 image centrée, 4 px de retrait vertical, cible de 44 px ; panneaux à 8 px d'écart, en-tête de 44 px, corps à 8 px de
//                 retrait ; corps vide (Autres Objets Personnalisés) retiré ;
//   personnage   Organisations : carrés de 44 px pour chaque type (lien ou case vide), pastille de 28 px, rangées de 45 px toutes
//                 égales, noms alignés, badge au milieu de la rangée, lien couvrant la cellule ; Citoyenneté : rangées à lien de 45 px,
//                 texte du lien au milieu de la rangée et aligné sur les cellules sans lien ; Maladies sans maladie retiré ; Finance à 4 px ; Avis de Recherche : chevron sur la première ligne du titre,
//                 tableau réduit à ses en-têtes retiré, drapeaux et compteurs par paires (quatre par ligne au moins, tableau élargi ou
//                 non), chiffres entiers, sans débordement ;
//   objet         détail d'un objet : modale bord à bord, sélecteur sur l'objet ouvert avec ses groupes natifs (Argent, Outils…),
//                 rangée d'en-tête = celle du sélecteur ;
//   organisation  vue d'une organisation : modale bord à bord, ouverte en haut (corps non défilé), membres à la suite sous le libellé
//                 de leur niveau, séparés par des virgules, rangée Option hors en-tête ;
//   courts        ordres courts (Dormir, Pouvoir : modale-ordre/dormir.html, pouvoir.html) : carte gardée (10 px des bords, rayons de
//                 8 px), sans cadre bord à bord : il est réservé aux ordres qui défilent dans leur carte et aux ordres à saisie ;
//   seuil         Matériel et Personnage chargés à 767 px (densité posée), 768 et 769 px (égaux au bundle de base) ; aller-retour
//                 767 -> 769 -> 767 et 769 -> 767 -> 769 px dans le même onglet (saisie en cours, sans rechargement) : densité seulement
//                 en mode mobile sous 768 px, géométrie égale au bundle de base ailleurs.
// Rouge sur le bundle de base (KR_SCRIPT=<bundle de base>), vert après. KR_FRAG = materiel, personnage, objet, organisation, courts,
// seuil ; KR_SHOTS=<dossier> : captures.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { krReady, THEME_READY, waitState } from './lib/settle.mjs';
import { choisirVariante } from './lib/variantes.mjs';
import { REPERES_DENSITE_JEU as R } from './lib/densite-jeu.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const userscript = sansEntete(fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8'));
const COMMIT_BASE = '4881f49'; // feature/next avant la densité du Matériel et du Personnage (popin Parler, #36)
const base = sansEntete(execFileSync('git', ['show', `${COMMIT_BASE}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const FIX = path.join(here, 'fixtures');
const PARLER = path.join(here, 'vendor/parler');
const SHOTS = process.env.KR_SHOTS || '';
const BASE = 'http://www.kraland.org';
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);
const LARGEURS = [320, 360, 375];
const VARIANTES = ['kraland', 'empire-brun-dark'];
const HAUTEUR = 680;

const P = {
  materiel: { url: '/jouer/materiel', file: 'jeu-materiel.html' },
  personnage: { url: '/jouer/perso', file: 'jeu-perso-densite.html' },
  objet: { url: '/jouer/plateau', file: 'modale-ordre/plateau.html', modale: 'modale-ordre/objet.html' },
  organisation: { url: '/jouer/plateau', file: 'modale-ordre/plateau.html', modale: 'modale-ordre/organisation.html' },
  dormir: { url: '/jouer/plateau', file: 'modale-ordre/plateau.html', modale: 'modale-ordre/dormir.html' },
  pouvoir: { url: '/jouer/plateau', file: 'modale-ordre/plateau.html', modale: 'modale-ordre/pouvoir.html' }
};

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n')[0]); }
}
const proche = (a, b, tol = 1) => Math.abs(a - b) <= tol;

// Feuilles natives aux adresses du site ; une feuille absente du dépôt est servie vide.
const LIB = {
  'bootstrap-3.3.7/css/bootstrap1.min.css': 'bootstrap1.min.css', 'bootstrap-3.3.7/css/bootstrap.min.css': 'bootstrap1.min.css',
  'bootstrap-3.3.7/js/bootstrap.min.js': 'bootstrap.min.js', 'jquery-3.3.1/jquery-3.3.1.min.js': 'jquery.min.js', 'bootbox-4.4.0/bootbox.min.js': 'bootbox.min.js',
  ...Object.fromEntries(['main.css', 'bootswatch.css', 'minichat.css', 'game.css'].map(f => [R.feuillesSite + f, f]))
};
const IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#a9adb3"/></svg>';
const sansCommentaire = h => h.replace(/^<!--[\s\S]*?-->\s*/, '');

function preparer(page) {
  let html = sansCommentaire(fs.readFileSync(path.join(FIX, page.file), 'utf8'));
  const ajout = [];
  for (const f of ['main.css', 'bootswatch.css', 'minichat.css', 'game.css']) { if (!html.includes(R.feuillesSite + f)) { ajout.push(`<link rel="stylesheet" href="${BASE}/lib/${R.feuillesSite}${f}">`); } }
  if (!/bootstrap1?\.min\.css/.test(html)) { ajout.push(`<link rel="stylesheet" href="${BASE}/lib/bootstrap-3.3.7/css/bootstrap1.min.css">`); }
  html = html.replace('</head>', ajout.join('\n') + '\n</head>');
  return html;
}

const browser = await launchBrowser();

// Ouvre une page (et sa modale d'ordre) ; aucune soumission possible.
async function ouvrir(nom, { width, variante, script = userscript }) {
  const page = P[nom];
  const height = HAUTEUR;
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height }, screen: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1, locale: 'fr-FR' });
  await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: IMAGE }));
  const html = preparer(page);
  await context.route(BASE + '/**', route => {
    const u = new URL(route.request().url());
    if (route.request().resourceType() === 'document') {
      return u.pathname === page.url ? route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }) : route.abort();
    }
    const i = u.pathname.indexOf('/lib/');
    const rest = i >= 0 ? u.pathname.slice(i + 5) : '';
    if (LIB[rest]) { return route.fulfill({ path: path.join(PARLER, LIB[rest]), contentType: rest.endsWith('.css') ? 'text/css' : 'application/javascript' }); }
    if (rest.endsWith('.css')) { return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); }
    return route.abort();
  });
  await context.addInitScript(choisirVariante, variante);
  await context.addInitScript(src => {
    window.GM = { xmlHttpRequest: () => {}, getValue: async (k, d) => d, setValue: async () => {} };
    // Aucune soumission (aucune action de jeu, même depuis une fixture)
    window.addEventListener('submit', e => e.preventDefault(), true);
    window.HTMLFormElement.prototype.submit = () => {};
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, script);
  const p = await context.newPage();
  const erreurs = [];
  p.on('pageerror', e => erreurs.push(String(e.message).split('\n')[0]));
  await p.goto(BASE + page.url, { waitUntil: 'load' });
  await krReady(p, { ready: THEME_READY, label: `${nom} ${variante} ${width} px` });
  if (page.modale) {
    await waitState(p, () => !!window.bootbox && !!window.jQuery);
    const contenu = `<div id="${R.contenuOrdre}">${sansCommentaire(fs.readFileSync(path.join(FIX, page.modale), 'utf8'))}</div>`;
    await p.evaluate(m => { window.bootbox.confirm(m, () => false); }, contenu);
    await waitState(p, () => !!document.querySelector('.modal.in .kr-order-form'));
    // Défilement de l'onglet actif programmé à 100 ms, défilement doux compris
    await p.waitForTimeout(900);
  }
  return { context, p, erreurs };
}

async function mesurer(nom, opts, fn, arg) {
  const o = await ouvrir(nom, opts);
  try {
    const m = await o.p.evaluate(fn, arg);
    if (SHOTS && opts.capture) { fs.mkdirSync(SHOTS, { recursive: true }); await o.p.screenshot({ path: path.join(SHOTS, `${opts.capture}.png`), fullPage: !P[nom].modale }); }
    return { ...m, erreurs: o.erreurs };
  } finally { await o.context.close(); }
}

// ---------- Mesures (dans la page) ----------
const PANNEAUX = rep => ({ panneaux: [...document.querySelectorAll('#col-right .panel' + rep.carte)].filter(pn => pn.querySelector(':scope > .panel-heading')).map(pn => {
  const cs = getComputedStyle;
  const h = pn.querySelector(':scope > .panel-heading');
  const b = pn.querySelector(':scope > .panel-body');
  return { titre: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), mb: cs(pn).marginBottom, tete: Math.round(h.getBoundingClientRect().height),
    corps: b ? { affiche: cs(b).display !== 'none', replie: b.style.display === 'none', pt: cs(b).paddingTop, pb: cs(b).paddingBottom, pl: cs(b).paddingLeft,
      vide: !b.querySelector('tr, a, p, img, input, select, textarea') && !b.textContent.trim(), texte: !!b.querySelector(':scope > p') } : null };
}) });

const MATERIEL = rep => {
  const r = e => e.getBoundingClientRect();
  const cs = getComputedStyle;
  const objets = [...document.querySelectorAll('#col-right .panel-body > a.list-group-item')].filter(a => a.getClientRects().length).map(a => {
    const ra = r(a);
    const st = cs(a);
    const h4 = a.querySelector(':scope > ' + rep.nomObjet);
    const m = a.querySelector(':scope > .mention');
    const img = a.querySelector(':scope > img');
    const p = a.querySelector(':scope > .list-group-item-text');
    return { nom: h4.textContent.trim().slice(0, 30), h: ra.height, pt: st.paddingTop, pb: st.paddingBottom,
      droite: ra.right - parseFloat(st.paddingRight) - parseFloat(st.borderRightWidth), nom4: { g: r(h4).left, d: r(h4).right, b: r(h4).bottom },
      charge: m && m.textContent.trim() ? { haut: r(m).top, d: r(m).right } : null, texte: p ? { haut: r(p).top, g: r(p).left } : null,
      image: img ? r(img).top + r(img).height / 2 : null, centre: ra.top + ra.height / 2 };
  });
  return { objets, debord: document.documentElement.scrollWidth - document.documentElement.clientWidth };
};

const PERSONNAGE = () => {
  const r = e => e.getBoundingClientRect();
  const cs = getComputedStyle;
  const panneau = titre => [...document.querySelectorAll('#col-right .panel')].find(pn => pn.querySelector('.panel-title') && pn.querySelector('.panel-title').textContent.includes(titre));
  const premierTexte = el => {
    const n = [...el.childNodes].find(x => x.nodeType === 3 && x.data.trim());
    if (!n) { return null; }
    const rg = document.createRange();
    rg.selectNodeContents(n);
    const rr = [...rg.getClientRects()].filter(x => x.width > 0);
    return rr.length ? { x: rr[0].left, y: rr[0].top + rr[0].height / 2, texte: n.data.trim() } : null;
  };
  const organisations = [...panneau('Organisations').querySelectorAll('tbody > tr')].map(tr => {
    // Rangée amenée au milieu de l'écran : elementFromPoint ne voit que la partie affichée
    window.scrollTo(0, window.scrollY + tr.getBoundingClientRect().top - window.innerHeight / 2);
    const td = tr.cells[0];
    const b = td.querySelector(':scope > .btn');
    const badge = tr.querySelector('.badge');
    const rt = r(tr);
    const rb = r(b);
    const st = cs(b);
    const nom = premierTexte(td);
    const sous = nom ? document.elementFromPoint(nom.x + 2, nom.y) : null;
    return { nom: nom ? nom.texte : '', lien: b.tagName === 'A', h: rt.height, centre: rt.top + rt.height / 2, nomX: nom ? nom.x : null,
      btn: { w: rb.width, h: rb.height, centre: rb.top + rb.height / 2, pad: [st.paddingTop, st.paddingRight, st.paddingBottom, st.paddingLeft].join(' '), clip: st.backgroundClip, ombre: st.boxShadow,
        bord: st.borderTopWidth, peinte: Math.round(rb.width - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight) - parseFloat(st.borderLeftWidth) - parseFloat(st.borderRightWidth)) },
      badge: badge ? r(badge).top + r(badge).height / 2 : null, sousNom: sous ? (sous === b || b.contains(sous) ? 'lien' : sous.tagName.toLowerCase()) : null };
  });
  window.scrollTo(0, 0);
  const citoyennete = [...panneau('Citoyenneté').querySelectorAll('tbody > tr')].map(tr => {
    const td = tr.cells[1];
    const a = td.querySelector(':scope > a');
    const boite = a || td;
    const st = cs(boite);
    const t = premierTexte(boite);
    const rt = r(tr);
    return { texte: td.textContent.trim(), lien: !!a, h: rt.height, x: r(boite).left + parseFloat(st.paddingLeft) + parseFloat(st.borderLeftWidth),
      milieu: t ? t.y - (rt.top + rt.height / 2) : null };
  });
  const maladies = panneau('Maladies').querySelector(':scope > .panel-body');
  const finance = [...panneau('Finance').querySelectorAll('.panel-body > p')].map(p => cs(p).marginBottom);
  const avis = panneau('Avis de Recherche');
  const titre = avis.querySelector('.panel-title');
  const chevron = avis.querySelector('.panel-heading > .clickable');
  const tables = [...avis.querySelectorAll('.panel-body > table')];
  const entetes = tables.find(t => t.querySelector('thead'));
  const drapeaux = tables.find(t => t.querySelector('img'));
  const paires = [...drapeaux.querySelectorAll('td:has(> img)')].map(td => {
    const c = td.nextElementSibling;
    return { img: r(td.querySelector('img')), compte: c ? r(c) : null };
  }).map(({ img, compte }) => ({ ok: !!compte && compte.left >= img.right - 0.5 && Math.abs((compte.top + compte.height / 2) - (img.top + img.height / 2)) <= 4, img: [Math.round(img.left), Math.round(img.top)], compte: compte ? [Math.round(compte.left), Math.round(compte.top)] : null }));
  // Chiffres du compteur entiers dans leur cellule (les espaces insécables qui les suivent peuvent être coupées) ; paires sur la première
  // ligne de drapeaux ; débordement du tableau
  const chiffres = [...drapeaux.querySelectorAll('td:has(> img) + td')].map(c => {
    const n = [...c.childNodes].find(x => x.nodeType === 3 && x.data.trim());
    const fin = n ? n.data.search(/\s*$/) : 0;
    if (!n || !fin) { return { texte: c.textContent.trim(), entier: false }; }
    const rg = document.createRange();
    rg.setStart(n, 0);
    rg.setEnd(n, fin);
    return { texte: n.data.slice(0, fin), entier: rg.getBoundingClientRect().right <= r(c).right + 0.5 };
  });
  const disposition = () => {
    const hauts = [...drapeaux.querySelectorAll('td > img')].map(i => Math.round(r(i).top));
    return { parLigne: hauts.filter(h => h === hauts[0]).length, debord: drapeaux.scrollWidth - drapeaux.clientWidth };
  };
  const tel = disposition();
  // Même grille sans l'élargissement du tableau (kr-table-pleine, Mobile:Tableaux) : tableau en bloc défilant, comme quand la feuille
  // arrive après ce module
  const pleine = drapeaux.classList.contains('kr-table-pleine');
  drapeaux.classList.remove('kr-table-pleine');
  const sansPleine = disposition();
  if (pleine) { drapeaux.classList.add('kr-table-pleine'); }
  const hr = entetes ? entetes.nextElementSibling : null;
  return { organisations, citoyennete,
    maladies: { affiche: cs(maladies).display !== 'none' },
    finance,
    avis: { titreHaut: r(titre).top, ligne: parseFloat(cs(titre).lineHeight) || parseFloat(cs(titre).fontSize) * 1.2, chevronHaut: r(chevron).top, chevronBas: r(chevron).bottom,
      titreHauteur: r(titre).height, entetes: entetes ? cs(entetes).display : null, hr: hr && hr.tagName === 'HR' ? cs(hr).display : null,
      paires, chiffres, tel, sansPleine, drapeauxDebord: drapeaux.scrollWidth - drapeaux.clientWidth, corpsDebord: drapeaux.parentElement.scrollWidth - drapeaux.parentElement.clientWidth },
    debord: document.documentElement.scrollWidth - document.documentElement.clientWidth };
};

const MODALE = () => {
  const r = e => e.getBoundingClientRect();
  const m = document.querySelector('.modal.in');
  const d = m.querySelector('.modal-dialog');
  const corps = m.querySelector('.modal-body');
  const f = m.querySelector('.kr-order-form');
  const cc = getComputedStyle(m.querySelector('.modal-content'));
  const o = { cadre: { x: r(d).left, w: r(d).width, y: r(d).top, h: r(d).height }, vue: { w: window.innerWidth, h: window.innerHeight },
    bordABord: m.classList.contains('kr-order-viewport'), rayons: [cc.borderTopLeftRadius, cc.borderTopRightRadius, cc.borderBottomRightRadius, cc.borderBottomLeftRadius],
    defile: corps.scrollTop, tient: corps.scrollHeight <= corps.clientHeight + 1, debord: m.scrollWidth - m.clientWidth, enTete: [...m.querySelectorAll('.kraland-modal-header')].map(e => e.querySelector('select') ? 'sélecteur' : e.textContent.trim().replace(/\s+/g, ' ').slice(0, 20)) };
  const sel = f.querySelector('select[name="top"]');
  if (sel) {
    o.selecteur = { valeur: sel.value, texte: sel.selectedOptions[0] ? sel.selectedOptions[0].text : null, groupes: [...sel.querySelectorAll('optgroup')].map(g => g.label) };
  }
  const tb = [...f.querySelectorAll(':scope > table')].find(t => t.querySelector('th'));
  if (tb) {
    const lignes = [...tb.rows].map(tr => {
      const c = tr.cells[0];
      const rr = r(c);
      const apres = c.tagName === 'TD' ? getComputedStyle(c, '::after').content : 'none';
      return { niveau: c.tagName === 'TH', texte: c.textContent.trim(), x: Math.round(rr.left - r(tb).left), y: Math.round(rr.top), virgule: apres === '","' };
    });
    o.membres = { h: r(tb).height, lignes, titreHaut: Math.round(r(f.querySelector(':scope > h3')).top - r(corps).top) };
  }
  return o;
};

const GEOMETRIE = rep => {
  const r = e => e.getBoundingClientRect();
  const m = document.querySelector('.modal.in .modal-dialog');
  const els = m ? [m, ...m.querySelectorAll(`.modal-body, ${rep.piedModale}, .kr-order-form > *`)] : [...document.querySelectorAll('#col-right .panel, #col-right .panel-body > *, #col-right .panel-body td')];
  return { l: els.map(e => { const x = r(e); return `${e.tagName.toLowerCase()}.${[...e.classList].filter(k => !k.startsWith('kr-')).join('.')} ${Math.round(x.left)},${Math.round(x.top)} ${Math.round(x.width)}x${Math.round(x.height)}`; }) };
};

// ---------- Matériel ----------
if (on('materiel')) {
  console.log('\n== materiel ==');
  for (const variante of VARIANTES) {
    for (const width of LARGEURS) {
      const tag = `materiel ${variante} ${width} px`;
      const opts = { width, variante, capture: `materiel-${variante}-${width}` };
      const pn = await mesurer('materiel', opts, PANNEAUX, R);
      const m = await mesurer('materiel', { width, variante }, MATERIEL, R);
      const objets = m.objets;
      check(`${tag} : lignes d'objet, nom sur toute la largeur (bord droit du contenu), détail et charge sur la ligne suivante, charge au bord droit, détail à l'aplomb du nom`, () => {
        assert.ok(objets.length >= 7, `${objets.length} ligne(s)`);
        const ecarts = objets.flatMap(o => [
          proche(o.nom4.d, o.droite) ? null : `${o.nom} : nom jusqu'à ${o.nom4.d.toFixed(1)} au lieu de ${o.droite.toFixed(1)}`,
          !o.charge || (o.charge.haut >= o.nom4.b - 1 && proche(o.charge.d, o.droite)) ? null : `${o.nom} : charge à ${o.charge.haut.toFixed(1)} (nom jusqu'à ${o.nom4.b.toFixed(1)}), bord ${o.charge.d.toFixed(1)}`,
          !o.texte || (o.texte.haut >= o.nom4.b - 1 && proche(o.texte.g, o.nom4.g)) ? null : `${o.nom} : détail à ${o.texte.g.toFixed(1)},${o.texte.haut.toFixed(1)}`
        ].filter(Boolean));
        assert.deepEqual(ecarts, [], ecarts.slice(0, 4).join(' ; '));
      });
      check(`${tag} : 4 px de retrait vertical, cible de 44 px, image centrée sur la ligne`, () => {
        const ecarts = objets.flatMap(o => [
          o.pt === '4px' && o.pb === '4px' ? null : `${o.nom} : retrait ${o.pt}/${o.pb}`,
          o.h >= 44 ? null : `${o.nom} : ${o.h} px`,
          o.image === null || proche(o.image, o.centre) ? null : `${o.nom} : image à ${(o.image - o.centre).toFixed(1)} px du milieu`
        ].filter(Boolean));
        assert.deepEqual(ecarts, [], ecarts.slice(0, 4).join(' ; '));
      });
      check(`${tag} : panneaux à 8 px d'écart, en-tête de 44 px, corps à 8 px de retrait ; corps vide retiré (Autres Objets Personnalisés)`, () => {
        const ecarts = pn.panneaux.flatMap(x => [
          x.mb === '8px' ? null : `${x.titre} : écart ${x.mb}`,
          x.tete === 44 ? null : `${x.titre} : en-tête de ${x.tete} px`,
          !x.corps || !x.corps.affiche || (x.corps.pt === '8px' && x.corps.pb === '8px' && x.corps.pl === '8px') ? null : `${x.titre} : retrait ${x.corps.pt}/${x.corps.pl}`,
          !x.corps || !x.corps.vide || !x.corps.affiche ? null : `${x.titre} : corps vide affiché`
        ].filter(Boolean));
        assert.ok(pn.panneaux.some(x => x.corps && x.corps.vide), 'aucun corps vide dans la fixture');
        assert.deepEqual(ecarts, [], ecarts.slice(0, 4).join(' ; '));
      });
      check(`${tag} : aucun débordement horizontal, aucune exception de page`, () => {
        assert.ok(m.debord <= 0, `débord ${m.debord}`);
        assert.deepEqual([...pn.erreurs, ...m.erreurs], []);
      });
    }
  }
}

// ---------- Personnage ----------
if (on('personnage')) {
  console.log('\n== personnage ==');
  for (const variante of VARIANTES) {
    for (const width of LARGEURS) {
      const tag = `personnage ${variante} ${width} px`;
      const pn = await mesurer('personnage', { width, variante, capture: `personnage-${variante}-${width}` }, PANNEAUX, R);
      const m = await mesurer('personnage', { width, variante }, PERSONNAGE);
      const org = m.organisations;
      check(`${tag} : Organisations, chaque type dans un carré de 44 px (pastille de 28 px peinte au centre, sans bord ni ombre), noms alignés, rangées de 45 px, filet compris`, () => {
        assert.equal(org.length, 5);
        assert.ok(org.some(o => o.lien) && org.some(o => !o.lien), 'liens et cases vides');
        const ecarts = org.flatMap(o => [
          proche(o.btn.w, 44, 0.5) && proche(o.btn.h, 44, 0.5) ? null : `${o.nom || '-'} : bouton ${o.btn.w}x${o.btn.h}`,
          o.btn.pad === '8px 8px 8px 8px' && o.btn.bord === '0px' && o.btn.peinte === 28 && o.btn.clip === 'content-box' && o.btn.ombre === 'none' ? null
            : `${o.nom || '-'} : retrait ${o.btn.pad}, bord ${o.btn.bord}, pastille de ${o.btn.peinte} px, ${o.btn.clip}, ombre ${o.btn.ombre}`,
          proche(o.nomX, org[0].nomX) ? null : `${o.nom || '-'} : nom à ${o.nomX}, ${org[0].nomX} pour le premier`,
          proche(o.h, 45, 0.5) ? null : `${o.nom || '-'} : rangée de ${o.h} px`,
          proche(o.btn.centre, o.centre, 1.5) ? null : `${o.nom || '-'} : bouton à ${(o.btn.centre - o.centre).toFixed(1)} px du milieu`
        ].filter(Boolean));
        assert.deepEqual(ecarts, [], ecarts.slice(0, 4).join(' ; '));
      });
      check(`${tag} : Organisations, badge du rang au milieu de la rangée, lien couvrant la cellule (nom compris)`, () => {
        const badges = org.filter(o => o.badge !== null);
        assert.ok(badges.length >= 2, `${badges.length} badge(s)`);
        const ecarts = [
          ...badges.filter(o => !proche(o.badge, o.centre, 2)).map(o => `${o.nom} : badge à ${(o.badge - o.centre).toFixed(1)} px du milieu`),
          ...org.filter(o => o.lien && o.sousNom !== 'lien').map(o => `${o.nom} : sous le nom, ${o.sousNom}`)
        ];
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
      check(`${tag} : Citoyenneté, rangées à lien de 45 px (filet compris), texte du lien au milieu de la rangée et aligné sur celui des cellules sans lien`, () => {
        const liens = m.citoyennete.filter(c => c.lien);
        const textes = m.citoyennete.filter(c => !c.lien);
        assert.ok(liens.length >= 2 && textes.length >= 2);
        const ecarts = [
          ...liens.filter(c => !proche(c.h, 45, 0.5)).map(c => `${c.texte} : ${c.h} px`),
          ...liens.filter(c => c.milieu === null || !proche(c.milieu, 0)).map(c => `${c.texte} : texte à ${c.milieu === null ? '?' : c.milieu.toFixed(1)} px du milieu`),
          ...liens.filter(c => !proche(c.x, textes[0].x)).map(c => `${c.texte} : texte à ${c.x.toFixed(1)}, ${textes[0].x.toFixed(1)} sans lien`)
        ];
        assert.deepEqual(ecarts, [], ecarts.join(' ; '));
      });
      check(`${tag} : Maladies sans maladie sans corps, Finance à 4 px entre les lignes`, () => {
        assert.equal(m.maladies.affiche, false, 'corps de Maladies affiché');
        assert.deepEqual(m.finance, ['4px', '4px', '0px']);
      });
      const a = m.avis;
      check(`${tag} : Avis de Recherche, chevron sur la première ligne du titre, tableau réduit à ses en-têtes retiré avec son filet`, () => {
        assert.ok(a.chevronHaut < a.titreHaut + a.ligne, `chevron à ${a.chevronHaut.toFixed(1)}, titre de ${a.titreHaut.toFixed(1)} (ligne de ${a.ligne})`);
        assert.equal(a.entetes, 'none', `tableau des en-têtes : ${a.entetes}`);
        assert.equal(a.hr, 'none', `filet : ${a.hr}`);
      });
      check(`${tag} : Avis de Recherche, chaque drapeau suivi de son compteur sur sa ligne, chiffres entiers (125), sans débordement`, () => {
        assert.equal(a.paires.length, 9);
        assert.deepEqual(a.paires.filter(x => !x.ok), []);
        assert.deepEqual(a.chiffres.filter(x => !x.entier), []);
        assert.ok(a.chiffres.some(x => x.texte === '125'), 'compteur à trois chiffres absent');
        assert.ok(a.drapeauxDebord <= 0 && a.corpsDebord <= 0, `débord ${a.drapeauxDebord} / ${a.corpsDebord}`);
      });
      check(`${tag} : Avis de Recherche, au moins quatre paires par ligne, tableau élargi (kr-table-pleine) ou en bloc défilant, sans défilement`, () => {
        assert.ok(a.tel.parLigne >= 4 && a.sansPleine.parLigne >= 4, `${a.tel.parLigne} paire(s) par ligne, ${a.sansPleine.parLigne} sans kr-table-pleine`);
        assert.ok(a.tel.debord <= 0 && a.sansPleine.debord <= 0, `débord ${a.tel.debord} / ${a.sansPleine.debord} sans kr-table-pleine`);
      });
      check(`${tag} : panneaux à 8 px d'écart, en-tête de 44 px au moins, corps à 8 px de retrait (16 px de côté pour un corps de texte)`, () => {
        const ecarts = pn.panneaux.flatMap(x => [
          x.mb === '8px' ? null : `${x.titre} : écart ${x.mb}`,
          x.tete >= 44 && (x.tete === 44 || x.titre.startsWith('Avis')) ? null : `${x.titre} : en-tête de ${x.tete} px`,
          !x.corps || !x.corps.affiche || (x.corps.pt === '8px' && x.corps.pl === (x.corps.texte ? '16px' : '8px')) ? null : `${x.titre} : retrait ${x.corps.pt}/${x.corps.pl}`
        ].filter(Boolean));
        assert.deepEqual(ecarts, [], ecarts.slice(0, 4).join(' ; '));
      });
      check(`${tag} : aucun débordement horizontal, aucune exception de page`, () => {
        assert.ok(m.debord <= 0, `débord ${m.debord}`);
        assert.deepEqual([...pn.erreurs, ...m.erreurs], []);
      });
    }
  }
}

// ---------- Modales : détail d'un objet, vue d'une organisation ----------
for (const nom of ['objet', 'organisation']) {
  if (!on(nom)) { continue; }
  console.log(`\n== ${nom} ==`);
  for (const variante of VARIANTES) {
    for (const width of LARGEURS) {
      const tag = `${nom} ${variante} ${width} px`;
      const m = await mesurer(nom, { width, variante, capture: `${nom}-${variante}-${width}` }, MODALE);
      check(`${tag} : ordre long, modale bord à bord (cadre à 0, largeur et hauteur de l'écran, sans rayon), sans débordement horizontal`, () => {
        assert.ok(m.bordABord, 'cadre bord à bord absent (kr-order-viewport)');
        assert.ok(proche(m.cadre.x, 0) && proche(m.cadre.w, m.vue.w) && proche(m.cadre.y, 0) && proche(m.cadre.h, m.vue.h), JSON.stringify(m.cadre));
        assert.deepEqual(m.rayons, ['0px', '0px', '0px', '0px']);
        assert.ok(m.debord <= 0, `débord ${m.debord}`);
      });
      if (nom === 'objet') {
        check(`${tag} : sélecteur sur l'objet ouvert (Épée Magique), groupes natifs gardés, rangée d'en-tête = celle du sélecteur`, () => {
          assert.deepEqual([m.selecteur.valeur, m.selecteur.texte], ['76419', 'Épée Magique']);
          assert.deepEqual(m.selecteur.groupes, ['Argent', 'Outils', 'Armes de contact', 'Objets magiques', 'Clefs']);
          assert.deepEqual(m.enTete, ['sélecteur']);
        });
      } else {
        const l = m.membres.lignes;
        const niveaux = l.filter(x => x.niveau);
        check(`${tag} : ouverte en haut (corps non défilé, titre en tête), rangée Option hors en-tête`, () => {
          assert.equal(m.defile, 0, `corps défilé de ${m.defile} px`);
          assert.ok(m.membres.titreHaut <= 16, `titre à ${m.membres.titreHaut} px du haut du corps`);
          assert.deepEqual(m.enTete, []);
        });
        check(`${tag} : membres à la suite sous le libellé de leur niveau, séparés par des virgules (${Math.round(m.membres.h)} px)`, () => {
          assert.equal(niveaux.length, 4);
          const ecarts = [];
          l.forEach((x, i) => {
            const suivant = l[i + 1];
            if (x.niveau) {
              if (x.x !== 0) { ecarts.push(`${x.texte} : libellé à ${x.x}`); }
              if (suivant && (suivant.niveau || suivant.y <= x.y || suivant.x !== 0)) { ecarts.push(`${x.texte} : premier membre à ${suivant.x},${suivant.y}`); }
            } else {
              const memeNiveau = !!suivant && !suivant.niveau;
              if (x.virgule !== memeNiveau) { ecarts.push(`${x.texte} : virgule ${x.virgule}`); }
              if (memeNiveau && suivant.y === x.y && suivant.x <= x.x) { ecarts.push(`${suivant.texte} : à ${suivant.x} après ${x.texte} à ${x.x}`); }
            }
          });
          // Membres d'un même niveau sur une seule ligne quand ils tiennent (Silas des Sables, Shiki Chantargent)
          const silas = l.find(x => x.texte === 'Silas des Sables');
          const shiki = l.find(x => x.texte === 'Shiki Chantargent');
          if (silas.y !== shiki.y) { ecarts.push(`Silas et Shiki sur deux lignes (${silas.y}, ${shiki.y})`); }
          assert.deepEqual(ecarts, [], ecarts.slice(0, 4).join(' ; '));
        });
      }
      check(`${tag} : aucune exception de page`, () => assert.deepEqual(m.erreurs, []));
    }
  }
}

// ---------- Ordres courts : carte gardée ----------
// Le cadre bord à bord va aux ordres à saisie et aux ordres qui défilent dans leur carte (mesurés après la mise en forme de l'ordre) :
// Dormir et Pouvoir tiennent dans la leur et la gardent, comme avant.
if (on('courts')) {
  console.log('\n== courts ==');
  for (const nom of ['dormir', 'pouvoir']) {
    for (const variante of VARIANTES) {
      for (const width of LARGEURS) {
        const tag = `${nom} ${variante} ${width} px`;
        const m = await mesurer(nom, { width, variante, capture: `${nom}-${variante}-${width}` }, MODALE);
        check(`${tag} : ordre court, carte gardée (10 px des bords, rayons de 8 px), sans cadre bord à bord, corps qui tient sans défiler`, () => {
          assert.equal(m.bordABord, false, 'cadre bord à bord (kr-order-viewport)');
          assert.ok(proche(m.cadre.x, 10) && proche(m.cadre.w, m.vue.w - 20), JSON.stringify(m.cadre));
          assert.deepEqual(m.rayons, ['8px', '8px', '8px', '8px']);
          assert.ok(m.tient, 'corps qui défile');
        });
        check(`${tag} : aucune exception de page`, () => assert.deepEqual(m.erreurs, []));
      }
    }
  }
}

// ---------- Seuil : 767, 768 et 769 px, aller-retour dans le même onglet ----------
// Saisie en cours dans un champ sonde (même champ des deux côtés) : le franchissement du seuil affiche le bandeau au lieu de recharger.
const ETAT_SEUIL = rep => {
  const panneaux = [...document.querySelectorAll('#col-right .panel' + rep.carte)].filter(pn => !pn.closest('.panel-group > *'));
  const r = e => e.getBoundingClientRect();
  const els = [...document.querySelectorAll('#col-right .panel, #col-right .panel-body > *, #col-right .panel-body td')];
  return { mobile: document.body.classList.contains('mobile-mode'), largeur: window.innerWidth, banniere: !!document.getElementById('kr-resize-banner'),
    memeDocument: window.__krMemeDocument === true, ecarts: [...new Set(panneaux.map(pn => getComputedStyle(pn).marginBottom))],
    l: els.map(e => { const x = r(e); return `${e.tagName.toLowerCase()}.${[...e.classList].filter(k => !k.startsWith('kr-')).join('.')} ${Math.round(x.left)},${Math.round(x.top)} ${Math.round(x.width)}x${Math.round(x.height)}`; }) };
};

async function allerRetour(nom, depart, arrivee, script) {
  const o = await ouvrir(nom, { width: depart, variante: 'kraland', script });
  try {
    await o.p.evaluate(() => {
      const sonde = document.createElement('input');
      sonde.type = 'text';
      sonde.id = 'kr-sonde-seuil';
      document.body.appendChild(sonde);
      sonde.value = 'Saisie en cours';
      window.__krMemeDocument = true;
    });
    const pas = [];
    for (const w of [arrivee, depart]) {
      await o.p.setViewportSize({ width: w, height: HAUTEUR });
      await waitState(o.p, l => window.innerWidth === l, w);
      await o.p.waitForTimeout(700);
      pas.push(await o.p.evaluate(ETAT_SEUIL, R));
    }
    return { pas, erreurs: o.erreurs };
  } finally { await o.context.close(); }
}

if (on('seuil')) {
  console.log('\n== seuil ==');
  for (const nom of ['materiel', 'personnage']) {
    const charge = await mesurer(nom, { width: 767, variante: 'kraland' }, ETAT_SEUIL, R);
    check(`${nom} chargé à 767 px : mode mobile, densité posée (panneaux à 8 px d'écart)`, () => {
      assert.equal(charge.mobile, true, 'mode mobile absent');
      assert.deepEqual(charge.ecarts, ['8px']);
      assert.deepEqual(charge.erreurs, []);
    });
    for (const width of [768, 769]) {
      const apres = await mesurer(nom, { width, variante: 'kraland' }, ETAT_SEUIL, R);
      const avant = await mesurer(nom, { width, variante: 'kraland', script: base }, ETAT_SEUIL, R);
      check(`${nom} chargé à ${width} px : mode bureau, géométrie égale au bundle de base (${COMMIT_BASE})`, () => {
        assert.equal(apres.mobile, false, 'mode mobile');
        const ecarts = apres.l.map((x, i) => (x === avant.l[i] ? null : `${x} au lieu de ${avant.l[i]}`)).filter(Boolean);
        assert.deepEqual(ecarts, [], ecarts.slice(0, 3).join(' ; '));
        assert.deepEqual(apres.erreurs, []);
      });
    }
    for (const [depart, arrivee] of [[767, 769], [769, 767]]) {
      const apres = await allerRetour(nom, depart, arrivee, userscript);
      const avant = await allerRetour(nom, depart, arrivee, base);
      check(`${nom} ${depart} -> ${arrivee} -> ${depart} px dans le même onglet (saisie en cours, sans rechargement) : densité en mode mobile sous 768 px seulement, géométrie égale au bundle de base ailleurs`, () => {
        const ecarts = [];
        apres.pas.forEach((x, i) => {
          if (!x.memeDocument || x.largeur !== [arrivee, depart][i]) { ecarts.push(`pas ${x.largeur} : document rechargé ou largeur ${x.largeur}`); }
          const densite = x.mobile && x.largeur < 768;
          if (densite) {
            if (x.ecarts.join() !== '8px') { ecarts.push(`${x.largeur} px (mode mobile) : écarts ${x.ecarts.join(', ')}`); }
          } else {
            const diff = x.l.map((e, k) => (e === avant.pas[i].l[k] ? null : `${e} au lieu de ${avant.pas[i].l[k]}`)).filter(Boolean);
            if (diff.length) { ecarts.push(`${x.largeur} px (${x.mobile ? 'mode mobile' : 'mode bureau'}) : ${diff.slice(0, 2).join(' ; ')}`); }
          }
        });
        assert.ok(apres.pas.some(x => x.banniere), 'bandeau de rechargement jamais affiché (seuil non franchi ?)');
        assert.deepEqual(ecarts, [], ecarts.slice(0, 3).join(' ; '));
        assert.deepEqual(apres.erreurs, []);
      });
    }
  }
}

// ---------- Ordinateur : rendu égal au bundle de base ----------
for (const nom of ['materiel', 'personnage', 'objet', 'organisation']) {
  if (!on(nom)) { continue; }
  for (const variante of VARIANTES) {
    const apres = await mesurer(nom, { width: 1280, variante }, GEOMETRIE, R);
    const avant = await mesurer(nom, { width: 1280, variante, script: base }, GEOMETRIE, R);
    check(`${nom} ${variante} 1280 px : géométrie égale au bundle de base (${COMMIT_BASE}), aucune exception de page`, () => {
      assert.ok(apres.l.length > 3, `${apres.l.length} élément(s)`);
      const ecarts = apres.l.map((x, i) => (x === avant.l[i] ? null : `${x} au lieu de ${avant.l[i]}`)).filter(Boolean);
      assert.deepEqual(ecarts, [], ecarts.slice(0, 3).join(' ; '));
      assert.deepEqual(apres.erreurs, []);
    });
  }
}

await browser.close();
console.log(failures ? `\n${failures} vérification(s) en échec` : '\nToutes les vérifications passent');
process.exit(failures ? 1 : 0);
