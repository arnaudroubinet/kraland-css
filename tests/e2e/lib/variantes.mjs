// Outil des 16 variantes de thème (épopée 2, ticket 2.3), partagé par les suites qui vérifient une couleur : liste, ouverture par
// variante, calcul de contraste.
//
//   import { VARIANTES, choisirVariante, VARIANTE_POSEE, parVariante, CONTRASTE } from './lib/variantes.mjs';
//   await context.addInitScript(choisirVariante, 'empire-brun-dark'); // AVANT le script qui évalue le bundle
//   const res = await parVariante(async variante => { ... un contexte neuf par variante ... return mesures; });
//   await page.evaluate(CONTRASTE);                                    // pose window.__krContraste dans la page
//   const r = await page.evaluate(() => window.__krContraste.texte(document.querySelector('.btn')));
//   const c = await page.evaluate(() => window.__krContraste.sonde('var(--kr-primary)'));  // valeur calculée d'une expression de couleur
//
// Variantes : « kraland » et les 15 autres classes html.kr-theme-variant-* (CONFIG.THEME_VARIANTS du template, sans high-contrast).
// Ouverture : le bundle lit la variante dans le stockage local à son évaluation (kr-theme-enabled, kr-theme-variant), comme pour un
// joueur qui l'a choisie dans le panneau d'options ; chaque variante s'ouvre dans SON contexte, sans bascule dans une page déjà ouverte.
// Contraste : rapport WCAG 2.1 du texte sur son fond effectif, c'est-à-dire les fonds des ancêtres composés jusqu'au premier fond
// opaque, sur blanc ; un texte semi-transparent est composé sur ce fond. Limites : ni image de fond (dégradé) ni opacité d'élément ;
// mesurer une fois les transitions finies (fondu des modales compris).
import { mapLimit } from './parallele.mjs';

export const VARIANTES = ['kraland', 'empire-brun', 'paladium', 'theocratie-seelienne', 'paradigme-vert', 'khanat-elmerien',
  'confederation-libre', 'royaume-ruthvenie', 'kraland-dark', 'empire-brun-dark', 'paladium-dark', 'theocratie-seelienne-dark',
  'paradigme-vert-dark', 'khanat-elmerien-dark', 'confederation-libre-dark', 'royaume-ruthvenie-dark'];

/**
 * Jetons redéfinis par l'épopée 3, ticket 1 (H5.2 : primaire foncée, accent inverse et alerte info du clair tirées de la nation ; alerte
 * info du sombre et ombre des boutons dérivées de la primaire) : leurs nouvelles définitions, en !important, à poser par-dessus un bundle
 * d'avant ce ticket dans une comparaison figée (poserJetonsRedefinis). Seuls les écarts qui viennent de ces jetons sont ainsi acceptés, tout
 * autre écart reste détecté ; écart consigné dans le plan du ticket (story-jetons-de-role-des-16-variantes-et-liens-en-couleur-d-accent,
 * Implementation Notes). Les variantes sombres gardent leurs primaire foncée et accent inverse littéraux.
 */
export const JETONS_REDEFINIS = [
  'html:not([class*="-dark"]) {',
  '  --kr-primary-dark: color-mix(in srgb, var(--kr-primary) 80%, #000) !important;',
  '  --kr-highlight-reverse: color-mix(in srgb, var(--kr-highlight) 15%, #fff) !important;',
  '  --kr-alert-info-bg: color-mix(in srgb, var(--kr-primary) 6%, #fff) !important;',
  '  --kr-alert-info-border: color-mix(in srgb, var(--kr-primary) 14%, #fff) !important;',
  '}',
  'html[class*="-dark"] {',
  '  --kr-alert-info-bg: color-mix(in srgb, var(--kr-primary) 15%, var(--kr-bg-surface)) !important;',
  '  --kr-alert-info-border: color-mix(in srgb, var(--kr-primary) 30%, var(--kr-bg-surface)) !important;',
  '}',
  'html { --kr-btn-shadow: color-mix(in srgb, var(--kr-primary) 12%, transparent) !important; }'
].join('\n');

/**
 * Texte atténué du clair foncé à #636a77 par l'épopée 3, ticket 4 (Q26 : #6b7280 tombe sous 4,5:1 sur bg-page, header-tint et info-bg) :
 * à poser par-dessus un bundle d'avant ce ticket dans une comparaison figée (poserJetonsRedefinis), seul écart de ce jeton accepté ;
 * consigné dans le plan du ticket (story-mode-clair-theme-comme-le-sombre-bouton-standard, Implementation Notes).
 */
export const TEXTE_SECONDAIRE_CLAIR_HEX = '#636a77';
export const TEXTE_SECONDAIRE_CLAIR = `html:not([class*="-dark"]) { --kr-text-secondary: ${TEXTE_SECONDAIRE_CLAIR_HEX} !important; }`;

/**
 * Composants que l'épopée 3, ticket 4 passe aux jetons qui changent avec le mode (H5.3) : en-tête et pied du panneau standard, en-têtes de
 * tableau (Bootstrap, DataTables), bouton standard, onglets. Les comparaisons figées neutralisent leur texte, leur fond et leurs bordures,
 * seul écart accepté (consigné dans le plan du ticket). Écrit ici, hors des suites : leurs classes y compteraient comme des citations
 * (routeur, MAX_CITING).
 */
export const COMPOSANTS_TICKET4 = '.panel-default > .panel-heading, .panel-default > .panel-footer, .table th, table.dataTable thead th, table.dataTable tfoot th, .btn-default, .nav-tabs, .nav-tabs > li > a';

/**
 * Éléments d'état que l'épopée 3, ticket 5 passe à la palette d'états (H5.5) : alertes, boutons, textes et en-têtes de panneau (info
 * comprise), étiquettes et fonds de succès, d'avertissement et de danger (.label-info et .bg-info, en paire d'action, ne changent pas). Les comparaisons figées, face à un bundle d'avant ce ticket (AVANT_TICKET5), neutralisent leur texte,
 * leur fond et leur bordure, seul écart accepté (consigné dans le plan du ticket). Écrit ici pour la même raison que COMPOSANTS_TICKET4.
 */
export const COMPOSANTS_TICKET5 = ['alert', 'btn', 'text', 'panel'].flatMap(k => ['success', 'warning', 'danger', 'info'].map(e => (k === 'panel' ? `.panel-${e} > .panel-heading` : `.${k}-${e}`)))
  .concat(['label', 'bg'].flatMap(k => ['success', 'warning', 'danger'].map(e => `.${k}-${e}`))).join(', ');
/** Bundle d'avant l'épopée 3, ticket 5 : il ne déclare pas encore les jetons d'état. */
export const AVANT_TICKET5 = bundle => !bundle.includes('--kr-success');

/**
 * Script d'initialisation (context.addInitScript(poserJetonsRedefinis, JETONS_REDEFINIS)) : jetons redéfinis en feuille adoptée, avant le
 * premier rendu et sans élément de plus dans le DOM. Une feuille posée après le chargement rend la capture instable (coin d'un bouton du
 * kramail anticrénelé autrement d'une exécution à l'autre, jusqu'à 22 pixels d'écart 6).
 */
export function poserJetonsRedefinis(css) {
  const feuille = new window.CSSStyleSheet();
  feuille.replaceSync(css);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, feuille];
}

/** Script d'initialisation (context.addInitScript(choisirVariante, variante)) : thème activé et variante choisie avant le bundle. */
export function choisirVariante(variante) {
  localStorage.setItem('kr-theme-enabled', 'true');
  localStorage.setItem('kr-theme-variant', variante);
}

/** Condition de page (page.evaluate(VARIANTE_POSEE, variante)) : la classe de la variante est posée sur <html>. */
export const VARIANTE_POSEE = variante => document.documentElement.classList.contains('kr-theme-variant-' + variante);

/**
 * Ouverture par variante : `scenario(variante, index)` ouvre son propre contexte et renvoie ses mesures ; au plus `conc` variantes à
 * la fois, résultats dans l'ordre de `variantes`.
 */
export function parVariante(scenario, { variantes = VARIANTES, conc } = {}) {
  return mapLimit(variantes, scenario, conc);
}

/**
 * À évaluer dans la page (page.evaluate(CONTRASTE)) : pose window.__krContraste = { rgb, fond, texte, rapport, sonde, procheRgb }.
 * rgb(chaîne) -> [r, g, b, a] ; fond(el) -> [r, g, b] effectif ; texte(el) -> rapport du texte de el sur son fond (non arrondi) ;
 * rapport(c1, c2) -> rapport de deux couleurs opaques [r, g, b] ; sonde(expr) -> couleur calculée (chaîne) d'une expression posée en color
 * sur un élément temporaire du body (var() et replis compris) ; procheRgb(a, b) -> a et b ([r, g, b…]) égaux à 1 près par canal (opacité
 * ignorée).
 */
export function CONTRASTE() {
  // « rgb(r, g, b) », « rgba(r, g, b, a) » ou « color(srgb r g b / a) » (sérialisation de color-mix() par Chrome, composantes 0..1).
  const rgb = s => {
    const n = (s.match(/[\d.]+/g) || []).map(Number);
    const c = s.startsWith('color(srgb') ? [n[0] * 255, n[1] * 255, n[2] * 255, n[3]] : n;
    return [c[0], c[1], c[2], c.length > 3 && Number.isFinite(c[3]) ? c[3] : 1];
  };
  const sur = (haut, bas) => [0, 1, 2].map(i => haut[i] * haut[3] + bas[i] * (1 - haut[3]));
  const fond = el => {
    const pile = [];
    for (let e = el; e; e = e.parentElement) {
      const c = rgb(getComputedStyle(e).backgroundColor);
      if (c[3] > 0) { pile.push(c); }
      if (c[3] >= 1) { break; }
    }
    return pile.reverse().reduce((bas, c) => sur(c, bas), [255, 255, 255]);
  };
  const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const rapport = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const texte = el => { const b = fond(el); return rapport(sur(rgb(getComputedStyle(el).color), b), b); };
  const sonde = expr => { const i = document.createElement('i'); i.style.color = expr; document.body.appendChild(i); const c = getComputedStyle(i).color; i.remove(); return c; };
  const procheRgb = (a, b) => [0, 1, 2].every(i => Math.abs(a[i] - b[i]) <= 1);
  window.__krContraste = { rgb, fond, texte, rapport, sonde, procheRgb };
}
