// Outil des 16 variantes de thème (épopée 2, ticket 2.3), partagé par les suites qui vérifient une couleur : liste, ouverture par
// variante, calcul de contraste.
//
//   import { VARIANTES, choisirVariante, VARIANTE_POSEE, parVariante, CONTRASTE } from './lib/variantes.mjs';
//   await context.addInitScript(choisirVariante, 'empire-brun-dark'); // AVANT le script qui évalue le bundle
//   const res = await parVariante(async variante => { ... un contexte neuf par variante ... return mesures; });
//   await page.evaluate(CONTRASTE);                                    // pose window.__krContraste dans la page
//   const r = await page.evaluate(() => window.__krContraste.texte(document.querySelector('.btn')));
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
 * À évaluer dans la page (page.evaluate(CONTRASTE)) : pose window.__krContraste = { rgb, fond, texte, rapport }.
 * rgb(chaîne) -> [r, g, b, a] ; fond(el) -> [r, g, b] effectif ; texte(el) -> rapport du texte de el sur son fond (non arrondi) ;
 * rapport(c1, c2) -> rapport de deux couleurs opaques [r, g, b].
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
  window.__krContraste = { rgb, fond, texte, rapport };
}
