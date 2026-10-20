// Harmonisation UX, lot 1 : défauts de style et identité du personnage (décisions H1.1 à H1.6 et R1 de l'étude, EXPERIENCE.md).
// Fragment fuite-forum (H1.1) : le décor mobile des listes de forum (« → … sujets · ») reste réservé aux pages du forum. Sur Personnage,
// aucune cellule des panneaux Citoyenneté (deux cellules par ligne) et Maladies (une seule) ne reçoit ce contenu généré (::before « → »,
// ::after « sujets · ») ; sur l'index du forum, le décor reste (non-régression, mesuré sur une ligne native : voir LIGNE_NATIVE).
// Fragment regles-ok (H1.2) : la barre fixe « Envoyer » du bas d'écran appartient aux pages de rédaction (kramail, forum). Sur les Règles, le
// bouton « ok » du formulaire de recherche (button.btn-primary.pull-right) n'est pas fixé et reste à côté de son champ, et « Remonter en haut »
// n'y est pas relevé au-dessus d'une barre absente (bas : 8 px) ; sur la rédaction d'un Kramail, la barre « Envoyer » reste fixe et « Remonter en
// haut » reste relevé à 64 px (non-régression, retirés au lot 7 seulement).
// Fragment nom (H1.3, H1.4, R1) : le nom du personnage est lu sur le titre actif du panneau latéral du plateau (matériel et bâtiments aussi),
// mémorisé sous kr-character-name, puis repris sur Personnage et Employés, dont le titre natif n'est pas le nom. Mobile : le mini-profil
// l'affiche ; ordinateur : le titre du panneau le porte (le texte seul change, un élément enfant reste en place). Sans nom connu, le titre natif
// reste ; un stockage qui lève (navigation privée) ne casse pas la page (aucune exception, mini-profil et titre natifs).
// Pages = FIXTURES SYNTHÉTIQUES (tests/e2e/fixtures/jeu-perso.html, plateau-minimal.html, forum-index-rp.html, regles-recherche.html), aucune
// donnée réelle, et la fixture anonymisée de la rédaction d'un Kramail (kramail-nouveau.html, servie à son URL de kramail-redaction.mjs) ;
// vrai Bootstrap 3.3.7 (tests/e2e/vendor). Confinement réseau (lib/confinement.mjs) ; aucun clic, aucune navigation.
//
// Usage : npm run build && node tests/e2e/jeu-identite.mjs   (ou : npm run test:zone -- plateau)
// Options : KR_SCRIPT (bundle testé), KR_FRAG = fuite-forum, regles-ok, nom (vide = tout).
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
const fixture = name => fs.readFileSync(path.join(here, 'fixtures', name), 'utf8');
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const BASE = 'http://www.kraland.org';
const PLATEAU = BASE + '/jouer/plateau';
const PERSO = BASE + '/jouer/perso';
const PNJ = BASE + '/jouer/pnj';
const INDEX_FORUM = BASE + '/forum/rp';
const REGLES = BASE + '/regles/base';
const KRAMAIL_NOUVEAU = BASE + '/kramail/post/nouveau-4-2000'; // URL de la fixture dans kramail-redaction.mjs
const VARIANTES = ['kraland', 'empire-brun-dark'];
const MOBILE = { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true };
const BUREAU = { viewport: { width: 1280, height: 720 } };
const CLE_NOM = 'kr-character-name';
const NOM = 'Joueur'; // titre actif de plateau-minimal.html : sur le plateau, le titre du panneau est le nom du personnage
const PANNEAUX_PERSO = [{ titre: 'Citoyenneté', cellules: [2, 2, 2] }, { titre: 'Maladies', cellules: [1, 1] }]; // structure de jeu-perso.html
// Ligne native de l'index (1re ligne du corps de table de la fixture). La peau remanie les lignes de la page : le module des sujets permanents
// insère un bloc de statistiques en 2e position et le tableau est masqué au profit de cartes, donc td:nth-child(2) n'y existe plus. La ligne
// d'origine, remise telle quelle dans le tableau le temps d'une mesure, dit si le décor s'applique encore sur une page du forum.
const LIGNE_NATIVE = fixture('forum-index-rp.html').match(/<tr>\s*<td>[\s\S]*?<\/tr>/)[0];
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const browser = await launchBrowser();

// Mémoire du nom avant le script du thème : `nom` est posé sous la clé ; `panne` liste les méthodes de Storage qui lèvent pour CETTE clé seule
// (le thème lit et écrit ses propres clés comme avant). Sans `nom` ni `panne`, ne fait rien.
const PREPARER_MEMOIRE = ({ cle, nom, panne = [] }) => {
  if (nom) { localStorage.setItem(cle, nom); }
  panne.forEach(methode => {
    const native = window.Storage.prototype[methode];
    window.Storage.prototype[methode] = function (k, ...suite) {
      if (k === cle) { throw new window.DOMException('Stockage indisponible', 'SecurityError'); }
      return native.call(this, k, ...suite);
    };
  });
};

async function open(url, html, variante, device, memoire = {}) {
  const context = await browser.newContext(device);
  await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route(url, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/css/bootstrap1.min.css', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.css'), contentType: 'text/css' }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/js/bootstrap.min.js', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.js'), contentType: 'application/javascript' }));
  await context.route(BASE + '/lib/jquery-3.3.1/jquery-3.3.1.min.js', route => route.fulfill({ path: path.join(VENDOR, 'jquery.min.js'), contentType: 'application/javascript' }));
  await context.addInitScript(PREPARER_MEMOIRE, { cle: CLE_NOM, ...memoire });
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
  const erreurs = []; // exceptions non attrapées de la page, depuis son ouverture
  page.on('pageerror', e => erreurs.push(e.message));
  await page.goto(url, { waitUntil: 'load' });
  await krReady(page, { ready: THEME_READY, label: `${variante} ${url}` });
  return { context, page, erreurs };
}

// Socle de toutes les mesures : variante du thème, mode mobile et classes de page posées sur <body> par le script. Le contrôle de mise en place
// de chaque page (verifierSocle) en fixe les valeurs attendues, pour qu'un vert ou un rouge ne vienne jamais d'une page mesurée hors contexte.
const MESURE_SOCLE = () => ({
  variant: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')),
  mobile: document.body.classList.contains('mobile-mode'),
  pageForum: document.body.classList.contains('page-forum'),
  pageKramailCompose: document.body.classList.contains('page-kramail-compose')
});
const mesurer = async (page, mesure, arg) => ({ ...(await page.evaluate(MESURE_SOCLE)), ...(await page.evaluate(mesure, arg)) });
// Une page, une mesure, un contexte neuf refermé aussitôt (aucun état partagé d'une page à l'autre) ; `erreurs` = exceptions de la page.
async function mesurerPage({ url, html, variante, device = MOBILE, memoire, mesure, arg }) {
  const { context, page, erreurs } = await open(url, html, variante, device, memoire);
  const m = await mesurer(page, mesure, arg);
  await context.close();
  return { ...m, erreurs };
}
function verifierSocle(m, variante, { mobile = true, pageForum = false, pageKramailCompose = false } = {}) {
  assert.equal(m.variant, 'kr-theme-variant-' + variante);
  assert.equal(m.mobile, mobile, mobile ? 'body sans mobile-mode' : 'body marqué mobile-mode');
  assert.equal(m.pageForum, pageForum, pageForum ? 'body sans page-forum' : 'body marqué page-forum');
  assert.equal(m.pageKramailCompose, pageKramailCompose, pageKramailCompose ? 'body sans page-kramail-compose' : 'body marqué page-kramail-compose');
}

// Mesures dans la page. fuites = contenus générés (::before, ::after) d'une cellule d'un panneau de Personnage (Citoyenneté : deux cellules
// par ligne ; Maladies : une seule, où la même cellule est première et dernière) qui portent le décor du forum.
const MESURE_PERSO = () => {
  const panneaux = [...document.querySelectorAll('#col-right .panel-default')].map(p => ({
    titre: p.querySelector('.panel-title').textContent.trim(),
    lignes: [...p.querySelectorAll('.table > tbody > tr')]
  }));
  const fuites = [];
  panneaux.forEach(p => p.lignes.forEach((tr, r) => [...tr.cells].forEach((td, c) => ['::before', '::after'].forEach(pseudo => {
    const contenu = getComputedStyle(td, pseudo).content;
    if (/→|sujets/.test(contenu)) { fuites.push(`${p.titre} ligne ${r + 1} cellule ${c + 1} ${pseudo} = ${contenu}`); }
  }))));
  return {
    panneaux: panneaux.map(p => ({ titre: p.titre, cellules: p.lignes.map(tr => tr.cells.length) })),
    fuites
  };
};
const MESURE_INDEX = (ligneNative) => {
  const tbody = document.querySelector('#col-right .panel-default .table > tbody');
  tbody.insertAdjacentHTML('beforeend', ligneNative);
  const sonde = tbody.lastElementChild;
  const decor = {
    sujets: getComputedStyle(sonde.cells[1], '::after').content,
    fleche: getComputedStyle(sonde.cells[sonde.cells.length - 1], '::before').content
  };
  sonde.remove();
  return {
    lignes: tbody.rows.length,
    decor
  };
};
// Bouton de validation (button.btn-primary.pull-right) du formulaire `formulaire` : nombre, libellé et position calculée (« fixed » = barre du
// bas d'écran de la rédaction), avec le nombre de champs input.form-control du même formulaire (le champ auprès duquel il doit rester) et le
// bas calculé du bouton « Remonter en haut » (8 px par défaut en mobile ; relevé à 64 px au-dessus de la barre fixe de la rédaction).
const MESURE_BOUTON = formulaire => {
  const form = document.querySelector(formulaire);
  const boutons = form ? [...form.querySelectorAll('button.btn-primary.pull-right')] : [];
  const remonter = document.querySelector('.kraland-back-to-top');
  return {
    champs: form ? form.querySelectorAll('input.form-control').length : 0,
    boutons: boutons.length,
    libelle: boutons.length ? boutons[0].textContent.trim() : null,
    position: boutons.length ? getComputedStyle(boutons[0]).position : null,
    remonter: remonter ? getComputedStyle(remonter).bottom : null
  };
};

// Nom du personnage tel que la page l'affiche : texte du titre actif du panneau latéral et nombre de ses éléments enfants, nom du mini-profil
// mobile (null s'il n'existe pas) et valeur mémorisée sous la clé `cle` (null si absente, « indisponible » si la lecture lève).
const MESURE_NOM = cle => {
  const titre = document.querySelector('#col-left .list-group-item.active');
  const profil = document.querySelector('.mobile-mini-profile-name');
  let memoire;
  try { memoire = localStorage.getItem(cle); } catch (_e) { memoire = 'indisponible'; }
  return {
    titre: titre ? titre.textContent.trim() : null,
    enfants: titre ? titre.children.length : 0,
    profil: profil ? profil.textContent.trim() : null,
    memoire
  };
};

async function scenario(variante) {
  const perso = await mesurerPage({ url: PERSO, html: fixture('jeu-perso.html'), variante, mesure: MESURE_PERSO });
  const index = await mesurerPage({ url: INDEX_FORUM, html: fixture('forum-index-rp.html'), variante, mesure: MESURE_INDEX, arg: LIGNE_NATIVE });
  return { perso, index };
}

async function scenarioRegles(variante) {
  const regles = await mesurerPage({ url: REGLES, html: fixture('regles-recherche.html'), variante, mesure: MESURE_BOUTON, arg: 'form[name="recherche"]' });
  const kramail = await mesurerPage({ url: KRAMAIL_NOUVEAU, html: fixture('kramail-nouveau.html'), variante, mesure: MESURE_BOUTON, arg: 'form[name="post_msg"]' });
  return { regles, kramail };
}

if (on('fuite-forum')) {
  console.log('Fuite du décor des listes de forum (375 × 667, tactile), variantes ' + VARIANTES.join(' et '));
  const res = await mapLimit(VARIANTES, scenario);
  VARIANTES.forEach((v, i) => {
    const { perso, index } = res[i];
    check(`[${v}] perso : thème appliqué, mode mobile actif, page hors forum, panneaux Citoyenneté (2 cellules par ligne) et Maladies (1 par ligne)`, () => {
      verifierSocle(perso, v);
      assert.deepEqual(perso.panneaux, PANNEAUX_PERSO, 'panneaux mesurés : ' + JSON.stringify(perso.panneaux));
    });
    check(`[${v}] perso : aucune cellule de Citoyenneté ne reçoit le décor du forum (ni celle de Maladies, à une seule cellule par ligne)`, () => {
      assert.equal(perso.fuites.length, 0, 'décor du forum sur Personnage : ' + perso.fuites.join(' ; '));
    });
    check(`[${v}] index du forum : thème appliqué, mode mobile actif, page marquée page-forum, 2 lignes`, () => {
      verifierSocle(index, v, { pageForum: true });
      assert.equal(index.lignes, 2);
    });
    check(`[${v}] index du forum : le décor reste (« sujets » après la 2e cellule, « → » avant la dernière, sur une ligne native)`, () => {
      assert.ok(index.decor.sujets.includes('sujets'), 'td:nth-child(2)::after = ' + index.decor.sujets);
      assert.ok(index.decor.fleche.includes('→'), 'td:last-child::before = ' + index.decor.fleche);
    });
  });
}

if (on('regles-ok')) {
  console.log('Barre fixe « Envoyer » et relèvement de « Remonter en haut » réservés aux pages de rédaction (375 × 667, tactile), variantes ' + VARIANTES.join(' et '));
  const res = await mapLimit(VARIANTES, scenarioRegles);
  VARIANTES.forEach((v, i) => {
    const { regles, kramail } = res[i];
    check(`[${v}] règles : thème appliqué, mode mobile actif, page hors forum et hors rédaction, formulaire de recherche (un champ, un bouton « ok »)`, () => {
      verifierSocle(regles, v);
      assert.equal(regles.champs, 1, 'champs input.form-control du formulaire de recherche : ' + regles.champs);
      assert.equal(regles.boutons, 1, 'boutons button.btn-primary.pull-right du formulaire de recherche : ' + regles.boutons);
      assert.equal(regles.libelle, 'ok');
    });
    check(`[${v}] règles : le bouton « ok » n'est pas fixé`, () => {
      assert.notEqual(regles.position, 'fixed', 'bouton « ok » fixé en bas de l\'écran (position: fixed)');
    });
    check(`[${v}] règles : « Remonter en haut » n'est pas relevé (bas : 8 px), aucune barre fixe à dégager`, () => {
      assert.equal(regles.remonter, '8px', 'bouton « Remonter en haut » : bas = ' + regles.remonter);
    });
    check(`[${v}] rédaction kramail : thème appliqué, mode mobile actif, page marquée page-kramail-compose, un bouton « Envoyer »`, () => {
      verifierSocle(kramail, v, { pageKramailCompose: true });
      assert.equal(kramail.boutons, 1, 'boutons button.btn-primary.pull-right du formulaire de rédaction : ' + kramail.boutons);
      assert.equal(kramail.libelle, 'Envoyer');
    });
    check(`[${v}] rédaction kramail : la barre « Envoyer » reste fixe`, () => {
      assert.equal(kramail.position, 'fixed', 'barre « Envoyer » : position = ' + kramail.position);
    });
    check(`[${v}] rédaction kramail : « Remonter en haut » reste relevé au-dessus de la barre fixe (bas : 64 px)`, () => {
      assert.equal(kramail.remonter, '64px', 'bouton « Remonter en haut » : bas = ' + kramail.remonter);
    });
  });
}

if (on('nom')) {
  const V = VARIANTES[0]; // le nom ne dépend pas du thème : une seule variante
  const plateauHtml = fixture('plateau-minimal.html');
  const persoHtml = fixture('jeu-perso.html');
  const titrePlateau = `<span class="list-group-item active">${NOM}</span>`;
  const titrePerso = '<span class="list-group-item active">Personnage</span>';
  const repli = '<span class="pull-right" id="slide-submenu"><i class="fa fa-times"></i></span>'; // bouton de repli des colonnes du site (icône)
  const repliTexte = '<span class="pull-right" id="slide-submenu">×</span>'; // le même avec un « × » écrit : l'ancien code du mini-profil devait le retirer du nom
  const employesHtml = persoHtml.replace(titrePerso, '<span class="list-group-item active">Employés</span>');
  const enfantHtml = persoHtml.replace(titrePerso, `<span class="list-group-item active">Personnage${repli}</span>`);
  const plateauRepliHtml = plateauHtml.replace(titrePlateau, `<span class="list-group-item active">${NOM}${repliTexte}</span>`);
  const scenarios = [
    { id: 'plateau', url: PLATEAU, html: plateauHtml },
    { id: 'plateauRepli', url: PLATEAU, html: plateauRepliHtml },
    { id: 'plateauAncien', url: PLATEAU, html: plateauHtml, memoire: { nom: 'Ancien' } },
    { id: 'plateauSansEcriture', url: PLATEAU, html: plateauHtml, memoire: { nom: 'Ancien', panne: ['setItem'] } },
    { id: 'persoMemoire', url: PERSO, html: persoHtml, memoire: { nom: NOM } },
    { id: 'persoVide', url: PERSO, html: persoHtml },
    { id: 'persoPanne', url: PERSO, html: persoHtml, memoire: { panne: ['getItem', 'setItem'] } },
    { id: 'employes', url: PNJ, html: employesHtml, memoire: { nom: NOM } },
    { id: 'bureau', url: PERSO, html: persoHtml, device: BUREAU, memoire: { nom: NOM } },
    { id: 'bureauEnfant', url: PERSO, html: enfantHtml, device: BUREAU, memoire: { nom: NOM } },
    { id: 'regles', url: REGLES, html: fixture('regles-recherche.html'), device: BUREAU, memoire: { nom: NOM } }
  ];
  console.log(`Nom du personnage : mini-profil mobile (375 × 667, tactile) et titre du panneau (1280 × 720), variante ${V}`);
  const mesures = await mapLimit(scenarios, s => mesurerPage({ ...s, variante: V, mesure: MESURE_NOM, arg: CLE_NOM }));
  const { plateau, plateauRepli, plateauAncien, plateauSansEcriture, persoMemoire, persoVide, persoPanne, employes, bureau, bureauEnfant, regles } =
    Object.fromEntries(scenarios.map((s, i) => [s.id, mesures[i]]));
  check(`[${V}] fixtures : le titre actif est « ${NOM} » sur le plateau et « Personnage » sur Personnage (les variantes Employés, enfant et bouton de repli sont construites dessus)`, () => {
    assert.ok(plateauHtml.includes(titrePlateau), `titre actif de plateau-minimal.html : ${titrePlateau} introuvable`);
    assert.ok(persoHtml.includes(titrePerso), `titre actif de jeu-perso.html : ${titrePerso} introuvable`);
  });
  check(`[${V}] plateau mobile : le mini-profil affiche le nom lu`, () => {
    verifierSocle(plateau, V);
    assert.equal(plateau.profil, NOM, `nom du mini-profil : ${plateau.profil}`);
    assert.equal(plateau.memoire, NOM, `nom mémorisé sous ${CLE_NOM} : ${plateau.memoire}`);
  });
  check(`[${V}] plateau mobile : le nom lu ignore le texte du bouton de repli`, () => {
    verifierSocle(plateauRepli, V);
    assert.equal(plateauRepli.profil, NOM, `nom du mini-profil : ${plateauRepli.profil}`);
    assert.equal(plateauRepli.memoire, NOM, `nom mémorisé sous ${CLE_NOM} : ${plateauRepli.memoire}`);
  });
  check(`[${V}] plateau mobile : un autre nom en mémoire est remplacé par le nom lu`, () => {
    verifierSocle(plateauAncien, V);
    assert.equal(plateauAncien.profil, NOM, `nom du mini-profil : ${plateauAncien.profil}`);
    assert.equal(plateauAncien.memoire, NOM, `nom mémorisé sous ${CLE_NOM} : ${plateauAncien.memoire}`);
  });
  check(`[${V}] perso mobile : le mini-profil reprend le nom mémorisé`, () => {
    verifierSocle(persoMemoire, V);
    assert.equal(persoMemoire.profil, NOM, `nom du mini-profil : ${persoMemoire.profil}`);
  });
  check(`[${V}] perso ordinateur : le titre du panneau est le nom`, () => {
    verifierSocle(bureau, V, { mobile: false });
    assert.equal(bureau.titre, NOM, `titre du panneau : ${bureau.titre}`);
  });
  check(`[${V}] perso ordinateur : le titre garde son élément enfant`, () => {
    verifierSocle(bureauEnfant, V, { mobile: false });
    assert.equal(bureauEnfant.titre, NOM, `titre du panneau : ${bureauEnfant.titre}`);
    assert.equal(bureauEnfant.enfants, 1, `éléments enfants du titre : ${bureauEnfant.enfants}`);
  });
  check(`[${V}] employés mobile : le titre du panneau et le mini-profil sont le nom mémorisé`, () => {
    verifierSocle(employes, V);
    assert.equal(employes.titre, NOM, `titre du panneau : ${employes.titre}`);
    assert.equal(employes.profil, NOM, `nom du mini-profil : ${employes.profil}`);
  });
  check(`[${V}] règles ordinateur : le titre natif reste malgré un nom mémorisé`, () => {
    verifierSocle(regles, V, { mobile: false });
    assert.equal(regles.titre, 'Règles', `titre du panneau : ${regles.titre}`);
    assert.equal(regles.memoire, NOM, `nom mémorisé sous ${CLE_NOM} : ${regles.memoire}`);
  });
  check(`[${V}] perso sans mémoire : titre natif`, () => {
    verifierSocle(persoVide, V);
    assert.equal(persoVide.titre, 'Personnage', `titre du panneau : ${persoVide.titre}`);
    assert.equal(persoVide.profil, 'Personnage', `nom du mini-profil : ${persoVide.profil}`);
    assert.equal(persoVide.memoire, null, `le titre natif n'est pas un nom à mémoriser : ${persoVide.memoire}`);
  });
  check(`[${V}] stockage indisponible : la page tient`, () => {
    verifierSocle(persoPanne, V);
    assert.equal(persoPanne.memoire, 'indisponible', 'panne du stockage non simulée');
    assert.equal(persoPanne.titre, 'Personnage', `titre du panneau : ${persoPanne.titre}`);
    assert.equal(persoPanne.profil, 'Personnage', `nom du mini-profil : ${persoPanne.profil}`);
    assert.deepEqual(persoPanne.erreurs, [], `exceptions de la page : ${persoPanne.erreurs.join(' ; ')}`);
  });
  check(`[${V}] plateau mobile, écriture impossible : le nom lu l'emporte sur la mémoire`, () => {
    verifierSocle(plateauSansEcriture, V);
    assert.equal(plateauSansEcriture.memoire, 'Ancien', 'panne de l\'écriture non simulée');
    assert.equal(plateauSansEcriture.profil, NOM, `nom du mini-profil : ${plateauSansEcriture.profil}`);
    assert.deepEqual(plateauSansEcriture.erreurs, [], `exceptions de la page : ${plateauSansEcriture.erreurs.join(' ; ')}`);
  });
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
