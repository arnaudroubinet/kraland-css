// Aide de mesure de la marge mobile et des cibles tactiles (épopée 9, entrée 1 ; reprise par les entrées 3, 4, 5, 8, 9 et 10).
// La marge se mesure sur le texte : premier et dernier pixel de chaque nœud texte visible (Range.getClientRects), jamais sur la boîte de
// son conteneur. Une cible tactile se mesure par sa boîte et par elementFromPoint (centre et bords), jamais par la seule hauteur.
// Les fonctions de page (suffixe _PAGE) s'utilisent avec page.evaluate ; les fonctions async prennent la page Playwright.

/**
 * Fonction de page : nœuds texte visibles de `racine` (défaut : body) dont le texte commence à moins de `marge` px d'un bord de l'écran.
 * Exclus : texte vide, `.sr-only`, visibility hidden, opacité nulle, boîte vide ou entièrement hors de l'écran ; texte d'un conteneur
 * défilant horizontalement (overflow auto ou scroll qui déborde), sauf `defilant: true`. `rogne: true` : texte coupé (ellipse, overflow non
 * visible) mesuré à la partie visible, bornée par ses ancêtres qui coupent, hors boîte vide (display: contents) (entrées 8 et 9). Résultat : [{ texte, gauche, droite, chemin, defilant }].
 */
export const TEXTES_HORS_MARGE_PAGE = ({ marge = 16, racine = 'body', defilant = false, rogne = false } = {}) => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  const chemin = e => {
    const p = [];
    for (let x = e; x && x !== document.body && p.length < 4; x = x.parentElement) {
      p.unshift(x.tagName.toLowerCase() + (x.id ? '#' + x.id : '') + [...x.classList].slice(0, 2).map(c => '.' + c).join(''));
    }
    return p.join(' > ');
  };
  const masque = e => {
    for (let x = e; x; x = x.parentElement) { const s = getComputedStyle(x); if (s.opacity === '0' || s.display === 'none') { return true; } }
    return getComputedStyle(e).visibility === 'hidden';
  };
  const dansDefilant = e => {
    for (let x = e; x && x !== document.documentElement; x = x.parentElement) {
      const s = getComputedStyle(x);
      if (/auto|scroll/.test(s.overflowX) && x.scrollWidth > x.clientWidth) { return true; }
    }
    return false;
  };
  for (const r of document.querySelectorAll(racine)) {
    const w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const texte = n.textContent.trim();
      const e = n.parentElement;
      if (!texte || !e || e.closest('.sr-only, script, style, noscript') || masque(e)) { continue; }
      const rg = document.createRange();
      rg.selectNodeContents(n);
      const rs = [...rg.getClientRects()].filter(b => b.width > 0 && b.height > 0 && b.right > 0 && b.left < vw);
      if (!rs.length) { continue; }
      let gauche = Math.min(...rs.map(b => b.left));
      let droite = vw - Math.max(...rs.map(b => b.right));
      if (rogne) {
        for (let x = e; x && x !== document.documentElement; x = x.parentElement) {
          if (getComputedStyle(x).overflowX === 'visible') { continue; }
          const b = x.getBoundingClientRect();
          if (!b.width && !b.height) { continue; } // boîte vide (display: contents) : ne coupe rien
          gauche = Math.max(gauche, b.left);
          droite = Math.max(droite, vw - b.right);
        }
      }
      if (gauche >= marge - 0.5 && droite >= marge - 0.5) { continue; }
      const d = dansDefilant(e);
      if (d && !defilant) { continue; }
      out.push({ texte: texte.slice(0, 40), gauche: Math.round(gauche * 10) / 10, droite: Math.round(droite * 10) / 10, chemin: chemin(e), defilant: d });
    }
  }
  return out;
};

/** Cartes de section mobiles (H4.1) : sélecteur des cartes et conteneurs exclus (accordéon, modale). */
export const CARTES_SECTION = { cartes: '.panel-default, .dashboard-section', exclues: '.panel-group, .modal' };

/**
 * Fonction de page : boîte de la cible `sel` (index `index`) et toucher par elementFromPoint au centre et à 2 px de chaque bord, après
 * scrollTo (jamais scrollIntoView). Un point touche s'il tombe sur la cible ou un descendant. Résultat : { l, h, points: { centre, haut, bas,
 * gauche, droite } } ou null.
 */
export const CIBLE_PAGE = ([sel, index = 0]) => {
  const e = document.querySelectorAll(sel)[index];
  if (!e) { return null; }
  let b = e.getBoundingClientRect();
  window.scrollTo(0, Math.max(0, window.scrollY + b.top - window.innerHeight / 2 + b.height / 2));
  b = e.getBoundingClientRect();
  const touche = (x, y) => { const t = document.elementFromPoint(x, y); return !!t && (t === e || e.contains(t)); };
  const cx = b.left + b.width / 2;
  const cy = b.top + b.height / 2;
  return {
    l: b.width, h: b.height,
    points: {
      centre: touche(cx, cy), haut: touche(cx, b.top + 2), bas: touche(cx, b.bottom - 2),
      gauche: touche(b.left + 2, cy), droite: touche(b.right - 2, cy)
    }
  };
};

/** Cible tactile `sel` (voir CIBLE_PAGE). */
export function cible(page, sel, index = 0) {
  return page.evaluate(CIBLE_PAGE, [sel, index]);
}

/** Écarts d'une cible au minimum `min` px (44 par défaut, 48 pour la croix) : liste vide si la boîte et les cinq points tiennent. */
export function ecartsCible(c, min = 44) {
  if (!c) { return ['cible absente']; }
  const e = [];
  if (c.l < min - 0.5 || c.h < min - 0.5) { e.push(`boîte ${Math.round(c.l)} x ${Math.round(c.h)} < ${min}`); }
  for (const [k, v] of Object.entries(c.points)) { if (!v) { e.push(`point ${k} non touché`); } }
  return e;
}
