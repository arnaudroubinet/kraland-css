// Revue mobile Galaxy S21 (rapport du 31 octobre 2026, 360 × 800 px, 16 variantes) : repères partagés.
// 1. Reconnaissance d'une base d'avant la revue (AVANT_REVUE_S21) et classes que le template de la revue pose (CLASSES_REVUE_S21).
// 2. Repères de revue-s21.mjs déjà cités par trois suites : tenus ici pour ne pas les rendre transverses (routeur, MAX_CITING).
// 3. Écarts voulus de la revue posés sur les bases figées des autres suites (« Écart accepté et consigné ») : chaque masque n'est posé que
//    contre une base d'avant la revue, et se retire donc seul au recalage des COMMIT_* au-delà de la revue (AVANT_REVUE_S21 faux).

/** Bundle d'avant la revue : la classe d'alerte du numéro de version (displayVersionInfo, n° 12) n'y figure pas. */
export const AVANT_REVUE_S21 = bundle => !bundle.includes('kr-maj-disponible');

/**
 * Classes posées par le template de la revue : en-tête de carte qui répète le titre de la page (n° 13), tableaux sur toute la largeur et
 * colonnes d'icônes ou de valeurs courtes (pages secondaires), modale d'ordre sans titre écrit (n° 10), numéro de version en alerte (n° 12),
 * lien seul de son paragraphe (n° 2).
 * Un relevé comparé à une base d'avant la revue les retire des classes de ses clés d'élément (sansClassesRevueS21, ou la liste passée à la
 * page avec PRIMAIRE_LECTURE_S21).
 */
export const CLASSES_REVUE_S21 = ['kr-titre-repete', 'kr-table-pleine', 'kr-colonne-icone', 'kr-colonne-courte', 'kr-order-titre-image', 'kr-maj-disponible', 'kr-lien-seul'];
/** Lecture du kramail (n° 1) : btn-primary passe du retour au dossier à « Répondre », action principale ; retiré des deux côtés. */
export const PRIMAIRE_LECTURE_S21 = 'html.kr-page-kramail-lecture h1.page-header .pull-right > a.btn';
/** Valeur d'attribut class (« table nomargin kr-table-pleine ») sans les classes de la revue (« table nomargin »). */
export const sansClassesRevueS21 = classes => String(classes).split(' ').filter(k => !CLASSES_REVUE_S21.includes(k)).join(' ');

/** Repères de revue-s21.mjs déjà cités par trois suites (voir l'en-tête). */
export const REPERES_REVUE_S21 = {
  messageForum: '.forum-msg',
  carteSection: '.panel-default',
  contenuOrdre: 'ajax-order',
  onglets: '.nav-tabs',
  titreForum: '.forum-subforum-title',
  libelle: '.control-label',
  // Largeur du glyphe d'une icône de la barre d'un message quand Font Awesome n'est pas servie (16 px à 14 px)
  glypheSansFa: 'display: inline-block; width: 16px;'
};

// ---------- Feuilles miroirs (« Écart accepté et consigné ») ----------
// Chacune recopie, mêmes sélecteurs et mêmes !important, les règles de la peau d'un numéro du rapport ; une suite qui compare le mobile à
// une base figée d'avant la revue les pose sur cette base seulement (AVANT_REVUE_S21), jamais sur le bundle courant : tout autre écart reste
// détecté. Elles vivent dans le test, pas dans la peau : une retouche ultérieure de ces règles reste vue par les suites qui les posent.
// Retrait : au recalage des COMMIT_* de ces suites sur un SHA qui contient la revue (AVANT_REVUE_S21 faux, les feuilles ne sont plus posées),
// après contrôle absolu des numéros concernés par revue-s21.mjs.

/** N° 4 : haut des pages mobiles (retrait de #content ramené à 8 px, colonne latérale vide sans hauteur, titre de tête sans marge haute). */
export const HAUT_S21 = [
  '@media (max-width: 767px) {',
  '  :where(html:not(.kr-page-accueil)) body.mobile-mode > #content.container { padding-top: var(--kr-space-2); }',
  '  body.mobile-mode > #content > .row > #col-left:not(:has(> :not(.list-group, .mini-submenu))) { min-height: 0; margin-bottom: 0 !important; }',
  '  :where(html:not(.kr-page-forum-index)) body.mobile-mode #col-right > h1.page-header:first-child { margin-top: 0 !important; }',
  '}'
].join('\n');

/**
 * N° 12 (script, vaut aussi sur ordinateur) : la ligne de version va dans le pied de la page, plus dans le premier <footer> venu ; sur l'Aide,
 * une base d'avant la revue la posait dans le pied d'une citation (blockquote > footer). Script de page (page.evaluate), sur la base seule :
 * la déplace là où le script la pose (fin du .container.white du pied de la page) ; renvoie vrai si elle était dans une citation.
 */
export function deplacerVersionS21() {
  const v = document.querySelector('blockquote .kraland-css-version');
  const pied = document.querySelector('body > footer, footer.navbar-inverse');
  if (!v || !pied) { return false; }
  (pied.querySelector('.container.white') || pied).appendChild(v);
  return true;
}

/** Constat « Pied de page » (avec le n° 12) : citation manuscrite en 21 px sur un interligne de 22 px (28 px sur 24 px avant). */
export const PIED_S21 = [
  '@media (max-width: 767px) {',
  '  :where(body.mobile-mode) footer .footer-quote { font-size: 21px; line-height: 22px; }',
  '}'
].join('\n');

/** N° 11 : rédaction du kramail, retours libellés (« Réception », « Message »), icône seule et distincte (dossier, message) sous 360 px. */
export const RETOURS_KRAMAIL_S21 = [
  '@media (max-width: 767px) {',
  '  :where(html.kr-page-kramail-compose) body.page-kramail:where(.mobile-mode) h1.page-header .pull-right > a.btn { width: auto !important; gap: var(--kr-space-1); padding: 0 var(--kr-space-2) !important; font-size: var(--kr-font-button) !important; line-height: 1.2 !important; white-space: nowrap; }',
  '  :where(html.kr-page-kramail-compose) body.page-kramail:where(.mobile-mode) h1.page-header .pull-right > a.btn > i { font-size: 14px !important; }',
  '}',
  '@media (max-width: 359px) {',
  '  :where(html.kr-page-kramail-compose) body.page-kramail:where(.mobile-mode) h1.page-header .pull-right > a.btn { width: 44px !important; padding: 0 !important; font-size: 0 !important; }',
  '  :where(html.kr-page-kramail-compose) body.page-kramail:where(.mobile-mode) h1.page-header .pull-right > a.btn > i.fa-backward::before { content: "\\f01c"; }',
  '  :where(html.kr-page-kramail-compose) body.page-kramail:where(.mobile-mode) h1.page-header .pull-right > a.btn[href*="kramail/post/"] > i.fa-backward::before { content: "\\f2b6"; }',
  '}'
].join('\n');

/** N° 13 : barre d'actions des messages du forum (boutons à 8 px de retrait, votes d'au moins 48 px à 6 px de retrait). */
export const BARRE_MESSAGE_S21 = [
  '@media (max-width: 767px) {',
  '  body.mobile-mode ul.media-list.forum > li.media.kr-msg > .media-body > .pull-right .btn { padding: 0 var(--kr-space-2) !important; }',
  '  body.mobile-mode ul.media-list.forum > li.media.kr-msg > .media-body > .pull-right a[href^="javascript:updateAjax"] { min-width: 48px !important; padding-right: 6px !important; padding-left: 6px !important; }',
  '}'
].join('\n');

/** N° 4 et 14 : actions rapides du plateau (sans marge basse ni ombre des boutons pleins, libellés en 13 px). */
export const ACTIONS_RAPIDES_S21 = [
  '@media (max-width: 767px) {',
  '  body.mobile-mode .mobile-quick-actions > .btn-group > .mobile-quick-action.btn { margin-bottom: 0 !important; }',
  '  body.mobile-mode .mobile-quick-actions > .btn-group > .mobile-quick-action.btn:not(:active) { box-shadow: none !important; }',
  '  body.mobile-mode .mobile-quick-action .mobile-quick-action-label { font-size: var(--kr-font-detail) !important; }',
  '}'
].join('\n');

/**
 * N° 4 et 14 : mini-profil du plateau resserré (retrait vertical de 8 px, nom et argent en grille autour du bouton de gestion), jauges
 * compactes de 8 px en 13 px, masquées une fois déplié. Les icônes Font Awesome de la roue et de l'horloge (DOM) ne se recopient pas.
 */
export const MINI_PROFIL_S21 = [
  '@media (max-width: 767px) {',
  '  body.mobile-mode .mobile-mini-profile { padding-top: var(--kr-space-2); padding-bottom: var(--kr-space-2); }',
  '  body.mobile-mode .mobile-mini-profile-info { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: var(--kr-space-2); }',
  '  body.mobile-mode .mobile-mini-profile-info > .mobile-mini-profile-name-row { display: contents !important; }',
  '  body.mobile-mode .mobile-mini-profile-name { grid-area: 1 / 1; }',
  '  body.mobile-mode .mobile-mini-profile-money { grid-area: 2 / 1; }',
  '  body.mobile-mode .mobile-mini-profile-manage-btn { grid-area: 1 / 2 / span 2; margin: 0 calc(-1 * var(--kr-space-2)) 0 0 !important; font-size: 18px !important; }',
  '  body.mobile-mode .mobile-mini-profile-clock { font-size: var(--kr-font-detail) !important; }',
  '  body.mobile-mode .mobile-mini-profile-clock > i { margin-right: 2px; }',
  '  body.mobile-mode .mobile-mini-profile-gauges-compact { margin-top: 0 !important; }',
  '  body.mobile-mode .mobile-mini-profile-gauges-compact, body.mobile-mode .mobile-gauge-compact-label, body.mobile-mode .mobile-gauge-compact-value, body.mobile-mode .mobile-gauge-full-header { font-size: var(--kr-font-detail) !important; }',
  '  body.mobile-mode .mobile-gauge-compact-bar { height: 8px !important; }',
  '  body.mobile-mode .mobile-mini-profile.expanded > .mobile-mini-profile-gauges-compact { display: none !important; }',
  '  body.mobile-mode .mobile-mini-profile-gauges-full:empty { display: none !important; }',
  '}'
].join('\n');

/**
 * N° 2 : liens du texte (messages, paragraphes, citations, blocs préformatés) en ligne, sans la hauteur de 44 px des cibles tactiles ni retrait ;
 * étiquettes et pastilles en lien avec leur retrait natif. Le marquage des liens seuls de leur paragraphe (kr-lien-seul, script) ne se recopie
 * pas : aucune page des suites qui posent ce miroir n'en porte (revue-s21 contrôle la fiche de membre qui en a un).
 */
export const LIENS_S21 = [
  '@media (max-width: 767px) {',
  '  :where(body.mobile-mode) :is(.forum-msg, p:not(.kr-msg-recipients, :is(td, th) p), pre, blockquote, dd) a:not(.btn, .list-group-item, .kr-lien-seul) { display: inline !important; min-height: 0 !important; padding: 0 !important; }',
  '  :where(body.mobile-mode) :is(.forum-msg, p:not(.kr-msg-recipients, :is(td, th) p), pre, blockquote, dd) a.label:not(.btn, .list-group-item, .kr-lien-seul) { padding: 0.2em 0.6em 0.3em !important; }',
  '  :where(body.mobile-mode) :is(.forum-msg, p:not(.kr-msg-recipients, :is(td, th) p), pre, blockquote, dd) a.badge:not(.btn, .list-group-item, .kr-lien-seul) { display: inline-block !important; padding: 3px 7px !important; }',
  '}'
].join('\n');

/**
 * N° 10 : modale d'ordre, onglet seul réduit à zéro, « [?] » accolé au titre de la section. Le titre image (kr-order-titre-image, posé par
 * le template) ne s'applique pas à une base d'avant la revue : la règle est recopiée, elle n'y trouve pas sa classe.
 */
export const MODALE_ORDRE_S21 = [
  '@media (max-width: 767px) {',
  '  body.mobile-mode .bootbox.modal.kr-order-modal form > h3.kr-order-titre-image { min-height: 0 !important; margin: 0 0 var(--kr-space-2) !important; padding: 0 !important; background-color: transparent !important; }',
  '  body.mobile-mode .bootbox.modal.kr-order-modal .panel.with-nav-tabs > .panel-heading:has(> ul.nav-tabs > li:only-child) { max-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; border-width: 0 !important; visibility: hidden !important; }',
  '  body.mobile-mode .bootbox.modal.kr-order-modal .tab-pane > h4:has(> .mention.pull-right) { display: flex; flex-wrap: wrap; align-items: center; column-gap: var(--kr-space-2); }',
  '  body.mobile-mode .bootbox.modal.kr-order-modal .tab-pane > h4 > .mention.pull-right { order: 1; float: none !important; margin: 0; }',
  '}'
].join('\n');
