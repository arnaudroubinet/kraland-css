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
 * Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9).
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
 * Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9).
 */
export const TEXTE_SECONDAIRE_CLAIR_HEX = '#636a77';
export const TEXTE_SECONDAIRE_CLAIR = `html:not([class*="-dark"]) { --kr-text-secondary: ${TEXTE_SECONDAIRE_CLAIR_HEX} !important; }`;

/**
 * Composants que l'épopée 3, ticket 4 passe aux jetons qui changent avec le mode (H5.3) : en-tête et pied du panneau standard, en-têtes de
 * tableau (Bootstrap, DataTables), bouton standard, onglets. Les comparaisons figées neutralisent leur texte, leur fond et leurs bordures,
 * seul écart accepté (consigné dans le plan du ticket). Écrit ici, hors des suites : leurs classes y compteraient comme des citations
 * (routeur, MAX_CITING).
 * Dans kramail-redaction : retrait à la décision d'Arnaud sur les bases auto-référentes (action A9). palette-nation la garde comme
 * sélecteur de contrôle absolu (SEL_COMPOSANTS4, dont « aucun gris de Bootstrap ») : cet usage n'est pas un masque et ne se retire pas.
 */
export const COMPOSANTS_TICKET4 = '.panel-default > .panel-heading, .panel-default > .panel-footer, .table th, table.dataTable thead th, table.dataTable tfoot th, .btn-default, .nav-tabs, .nav-tabs > li > a';

/**
 * Échelle typographique que l'épopée 4, ticket 5 pose hors des pages de jeu (DESIGN.md › Typography). Masque miroir : chaque règle reprend le
 * sélecteur et le drapeau !important de la règle que le bundle réécrit ou ajoute, avec la valeur du jeton (feuille adoptée, hors couche, après
 * les feuilles du document : à spécificité égale, elle remplace la règle d'origine ; une règle plus forte du bundle « avant » garde la main,
 * comme dans le bundle d'après). Seule exception : les titres h4-h6 d'en-tête de panneau, que l'échelle mobile d'avant fixe en !important et
 * que le bundle d'après exclut de cette échelle, reçoivent 17 px en !important. Règles de pages de jeu (garde body:has(#col-leftest), tableau
 * de bord, commerce, mini-profil) absentes : les pages comparées n'en ont pas. À poser par-dessus un bundle d'avant ce ticket
 * (AVANT_TICKET45) ; tout autre écart reste détecté. Écart consigné dans le plan du ticket
 * (story-echelle-typographique-du-plateau-du-mini-profil-et-des-en-te, Implementation Notes).
 * Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9), pour kramail-redaction ; et, pour le miroir de
 * typographie-formes (TF3), au prochain ticket qui modifie l'échelle des titres ; il réaligne COMMIT_ECHELLE sur un SHA récent après
 * contrôle absolu des titres (ticket 4.5). Retrait de la constante quand les deux sont faits.
 */
export const ECHELLE_TICKET45 = [
  '@media (min-width: 768px) {',
  '  .panel-heading > :is(.panel-title, h1, h2, h3, h4, h5, h6):where(:not(.panel-group *, .modal *)) { font-size: 17px; font-weight: 700; }',
  '  .xmini, footer a { font-size: 12px; }',
  '}',
  '@media (max-width: 767px) {',
  '  .dashboard-card h4 { font-size: 15px !important; }',
  '  .panel-body h4 { font-size: 15px !important; }',
  '  h1, h2, h3 { font-size: 17px !important; }',
  '  :is(h4, h5, h6):where(:not(.panel-heading > *), .panel-group *, .modal *) { font-size: 15px !important; }',
  '  .panel-heading > :is(h4, h5, h6):where(:not(.panel-group *, .modal *)) { font-size: 17px !important; }',
  '  body.mobile-mode .panel-default > .panel-heading h3 { font-size: 17px !important; }',
  '  body.page-forum .panel-default > .panel-heading h3 { font-size: 17px !important; font-weight: 700 !important; }',
  '  body.page-kramail .panel-heading h3.panel-title { font-size: 17px !important; font-weight: 700 !important; }',
  '  .panel-heading > :is(.panel-title, h1, h2, h3, h4, h5, h6):where(:not(.panel-group *, .modal *)) { font-size: 17px; font-weight: 700; }',
  '  footer a, .xmini { font-size: 12px; }',
  '}'
].join('\n');
/**
 * Légendes des compétences (.kr-skill-caption) que l'épopée 4, ticket 5 passe du plancher PLT-QU de 11 px à 12 px (--kr-font-label) : la
 * cellule d'icône qui les contient grandit d'autant. Masque miroir des trois règles réécrites (mêmes sélecteurs, même drapeau !important),
 * à poser par-dessus un bundle d'avant ce ticket (AVANT_TICKET45) dans une comparaison des cellules d'icône ; tout autre écart reste détecté.
 */
export const LEGENDES_TICKET45 = [
  '@media (min-width: 768px) and (hover: none) {',
  '  #col-leftest .kr-skill-caption { font-size: 12px; }',
  '}',
  '@media (max-width: 767px) {',
  '  .kr-skill-caption { font-size: 12px; }',
  '  body.mobile-mode .mobile-mini-profile .kr-skill-caption { font-size: 12px !important; }',
  '}'
].join('\n');
/**
 * Bundle d'avant l'épopée 4, ticket 5 : l'échelle mobile des titres n'y emploie pas encore le jeton (règle minifiée du bundle). Deux formes
 * reconnues : celle du ticket 5 et celle du bug 10, qui en exclut le nom de forum des cartes (TITRE_FORUM_REGLE_BUG10).
 * Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9), pour kramail-redaction ; et, pour typographie-formes (TF2),
 * au prochain ticket qui modifie les boutons ; il réaligne COMMIT_BOUTONS et COMMIT_MODALES sur un SHA récent après contrôle absolu des
 * légendes des compétences en 12 px (ticket 4.5). Le check titre-forum, qui vérifie que le bundle testé n'est pas reconnu comme d'avant
 * 4.5, se retire avec la constante.
 */
export const AVANT_TICKET45 = bundle => !bundle.includes('h1,h2,h3{font-size:var(--kr-font-section-title)!important}') && !bundle.includes(TITRE_FORUM_REGLE_BUG10);
/** Règle mobile des titres h1-h3 réécrite par le bug 10, telle que minifiée dans le bundle : le nom de forum des cartes en est exclu. */
export const TITRE_FORUM_REGLE_BUG10 = ':is(h1,h2,h3):where(:not(.forum-title)){font-size:var(--kr-font-section-title)!important}';
/** Bundle d'avant le bug 10 : la règle mobile des titres h1-h3 n'y exclut pas encore le nom de forum (TITRE_FORUM_REGLE_BUG10 absente). */
export const AVANT_BUG10 = bundle => !bundle.includes(TITRE_FORUM_REGLE_BUG10);
/**
 * Échelle typographique du forum et du kramail (épopée 4, ticket 7 ; DESIGN.md › Typography). Masque miroir : chaque règle reprend le
 * sélecteur, le média et le drapeau !important de la règle dont le bundle réécrit la taille (ou à laquelle il l'ajoute : auteur du dernier
 * message sur ordinateur, index et sous-forum ; ou qu'il découpe : compteurs de l'index et du sous-forum sur ordinateur, séparés de
 * thead th ; ou qu'il crée faute de règle d'origine : auteur et cartouche d'un message du sujet sur ordinateur), avec la valeur du jeton en px (nom 15, détail 13, texte courant 14 / 15, étiquette 12, champ
 * de rédaction 16) ; feuille adoptée, hors couche, après les feuilles du document. Les tailles déjà égales au jeton n'y figurent pas, ni
 * les doublons morts retirés (tableau mobile en double). Les cartes de forum (.forum-title…) y sont sous le média mobile où le bundle
 * les déplace. Seule exception : les statistiques des sujets permanents (.permanent-topic-stats), dont seul le module pose la taille, en
 * style en ligne (aucune règle CSS), reçoivent 13 px en !important pour remplacer le style en ligne en 11 px du bundle « avant ». À poser par-dessus un bundle d'avant ce ticket
 * (AVANT_TICKET47) ; tout autre écart reste détecté. Écart consigné dans le plan du ticket
 * (story-echelle-typographique-du-forum-et-du-kramail, Implementation Notes).
 * Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9).
 */
export const ECHELLE_TICKET47 = [
  '@media (max-width: 767px) {',
  '  :where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table > tbody > tr > td:first-child > span.tagforum { font-size: 13px !important; }',
  '  :where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table > tbody > tr > td:first-child > p:nth-child(2), :where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table > tbody > tr > .forum-description-wrapper > p { font-size: 15px !important; }',
  '  :where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table > tbody > tr > td:nth-child(2), :where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table > tbody > tr > td:nth-child(3), :where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table > tbody > tr > .forum-stats-wrapper > td { font-size: 13px !important; }',
  '  :where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table > tbody > tr > td:nth-child(4), :where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table > tbody > tr > td:last-child { font-size: 13px !important; }',
  '  :where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table > tbody > tr > td:nth-child(4) > a, :where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table > tbody > tr > td:last-child > a { font-size: 13px !important; }',
  '  body.page-forum table.dataTable tbody td:nth-child(5) a:first-child { font-size: 13px !important; }',
  '  body.page-kramail #topics_wrapper .dataTables_filter label { font-size: 15px !important; }',
  '  body.page-kramail #topics tbody td:nth-child(4) { font-size: 13px !important; }',
  '  .kramail-msg-date { font-size: 13px !important; }',
  '  .kramail-msg-date i { font-size: 13px !important; }',
  '  .kramail-msg-body blockquote, .kramail-msg-body .blockquote, .kramail-msg-body .quote { font-size: 15px !important; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-sec { font-size: 12px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-sec small { font-size: 12px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-sec.kd-loading, body.page-kramail-compose form[name="post_msg"] .kd-sec.kd-error { font-size: 15px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-opt { font-size: 15px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-warn { font-size: 15px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-empty { font-size: 15px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-foot { font-size: 13px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-help { font-size: 15px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-msg { font-size: 15px; }',
  '  body.page-forum.kr-subforum .forum-mobile-breadcrumb { font-size: 13px; }',
  '  body.page-forum.kr-subforum #topics tbody td { font-size: 13px !important; }',
  '  body.page-forum.kr-subforum #topics tbody td:first-child p > a { font-size: 15px !important; }',
  '  body.page-forum.kr-subforum #topics tbody td:nth-child(1)[data-kr-pages-label]::after { font-size: 13px; }',
  '  body.page-forum.kr-subforum #topics tbody td:nth-child(4) > a.nomargin { font-size: 13px !important; }',
  '  body.page-forum.kr-subforum #topics tbody td:first-child > span.tagforum::before { font-size: 13px; }',
  '  body.page-forum.kr-subforum #topics tbody td:first-child > span.tagforum a { font-size: 13px !important; }',
  '  html body.page-forum.kr-subforum.mobile-mode .panel-default table.table > tbody > tr > td:first-child > p > a { font-size: 15px !important; }',
  '  :where(html.kr-page-forum-index) #col-right .forum-mobile-breadcrumb { font-size: 13px; }',
  '  :where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr > td { font-size: 13px !important; }',
  '  :where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr > td:first-child > p > a { font-size: 15px !important; }',
  '  body.mobile-mode ul.media-list.forum > li.media.kr-msg .user-info > strong { font-size: 15px; }',
  '  body.mobile-mode ul.media-list.forum > li.media.kr-msg .user-info > .cartouche { font-size: 13px; }',
  '  body.mobile-mode.page-forum form.kr-editor .btn-toolbar.kr-tools-ready + textarea.form-control { font-size: 16px !important; }',
  '  .forum-title { font-size: 15px; }',
  '  .forum-description { font-size: 15px; }',
  '  .forum-moderators { font-size: 13px; }',
  '  .last-time { font-size: 13px; }',
  '}',
  '.permanent-topic-stats { font-size: 13px !important; }',
  '@media (min-width: 768px) {',
  '  body.page-kramail-compose form[name="post_msg"] .kd-sec { font-size: 12px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-sec small { font-size: 12px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-sec.kd-loading, body.page-kramail-compose form[name="post_msg"] .kd-sec.kd-error { font-size: 14px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-opt { font-size: 15px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-warn { font-size: 14px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-empty { font-size: 14px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-foot { font-size: 13px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-help { font-size: 14px; }',
  '  body.page-kramail-compose form[name="post_msg"] .kd-msg { font-size: 14px; }',
  '  html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbody > tr > td:nth-child(4) > a.nomargin, html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbody > tr > td:nth-child(5) > a.nomargin { font-size: 13px !important; }',
  '  html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbody > tr > td:nth-child(2), html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbody > tr > td:nth-child(3) { font-size: 13px; }',
  '  :where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr > td:nth-child(2), :where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr > td:nth-child(3) { font-size: 13px; }',
  '  :where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr > td:nth-child(4) > a.nomargin { font-size: 13px !important; }',
  '  :where(body.page-forum) ul.media-list.forum > li.media .user-info > strong { font-size: 15px; }',
  '  :where(body.page-forum) ul.media-list.forum > li.media .user-info > .cartouche { font-size: 13px; }',
  '}'
].join('\n');
/**
 * Écart accepté et consigné (épopée 4, ticket 8) : rayons des pages du kramail ramenés aux trois rôles (contrôles 4 px, cartes et panneaux
 * 8 px, en-tête de panneau 7 px sur ordinateur). Feuille miroir posée sur un bundle « avant » antérieur au ticket (AVANT_TICKET48) par le
 * fragment regression de kramail-redaction.mjs, jamais sur le bundle courant ; tout autre écart reste détecté. Écart consigné dans le plan
 * du ticket (story-trois-rayons-4-px-8-px-et-plein, Plan Change Log).
 * Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9).
 */
export const RAYONS_TICKET48 = [
  '@media (max-width: 767px) {',
  '  .navbar-header > .navbar-toggle, #col-right > h1.page-header > .kramail-character-selector, #col-right > h1.page-header > span.pull-right .btn, body.mobile-mode .center > ul.pagination.t > li > a { border-radius: 4px !important; }',
  '  #col-right > form > .panel.panel-default, body.page-kramail #topics > tbody > tr, #col-right > ul.media-list > li.media.well { border-radius: 8px !important; }',
  '}',
  '@media (min-width: 768px) {',
  '  #col-right > h1.page-header > span.pull-right .btn, li.media.well .btn-group-xs > span.btn { border-radius: 4px !important; }',
  '  #col-right > form > .panel.panel-default, #col-right > ul.media-list > li.media.well { border-radius: 8px !important; }',
  '  #col-right > form > .panel.panel-default > .panel-heading { border-radius: 7px 7px 0 0 !important; }',
  '}'
].join('\n');
/**
 * Écart accepté et consigné (épopée 4, ticket 9) : grille d'espacement au pas de 4 px (story-grille-d-espacement-au-pas-de-4-px,
 * annexe d'inventaire, sections 1 à 3). Feuille miroir en valeurs littérales, posée sur un bundle de base antérieur au ticket
 * (AVANT_TICKET49), jamais sur le bundle courant ; tout autre écart reste détecté. Écart consigné dans le plan du ticket.
 * Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9).
 */
export const ESPACEMENT_TICKET49 = [
  '@media (max-width: 767px), (min-width: 768px) {',
  '  .panel-body { padding: 16px; }',
  '  .panel-heading { padding: 12px 16px; }',
  '  .modal-footer .btn + .btn { margin-left: 4px; }',
  '  .kr-order-form .kr-order-help-toggle { gap: 4px; margin-bottom: 8px; }',
  '}',
  '@media (max-width: 767px) {',
  '  .panel { margin-bottom: 16px !important; }',
  '  .panel-heading { gap: 8px !important; }',
  '  .panel-body { padding: 16px !important; }',
  '  .panel-body a { gap: 8px !important; margin-bottom: 4px !important; }',
  '  body.mobile-mode ul.media-list.forum > li.media.kr-msg > .media-body > .pull-right .btn { gap: 4px; }',
  '  body.mobile-mode.page-forum form.kr-editor .btn-toolbar.kr-tools-ready .kr-tools-plus { padding: 0 8px !important; }',
  '}',
  '@media (min-width: 768px) {',
  '  #kr-config-import-btn { margin-left: 4px !important; }',
  '  :where(html body.page-forum.kr-subforum) table.dataTable thead th { padding: 8px; }',
  '  html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbody > tr > td { padding: 4px 8px !important; }',
  '  html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default > .panel-body { padding: 8px 16px 8px !important; }',
  '  :where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr > td { padding: 4px 8px !important; }',
  '  :where(html.kr-page-forum-index) #col-right .panel-default > .panel-body { padding: 8px 16px 8px !important; }',
  '}'
].join('\n');
/**
 * Écart accepté et consigné (épopée 4, ticket 10, story-refactor-sweep) : médias de l'éditeur du kramail et du changelog ramenés au seuil
 * 767/768 (à 768 px, rendu d'ordinateur au lieu du rendu mobile). Transformation de chaîne du bundle de base (médias minifiés), posée
 * seulement sur un bundle de base antérieur au ticket (AVANT_TICKET410), jamais sur le bundle courant ; tout autre écart reste détecté.
 * Écart consigné dans le plan du ticket (Plan Change Log).
 */
export const MEDIAS_TICKET410 = bundle => bundle.split('@media (width<=768px){').join('@media (width<=767px){').split('@media (width>=769px){').join('@media (width>=768px){');
/** Bundle d'avant l'épopée 4, ticket 10 : l'éditeur du kramail y est encore sous le média minifié (width>=769px). */
export const AVANT_TICKET410 = src => src.includes('(width>=769px)');
/** Champs de saisie d'une ligne mesurés par le fragment nettoyage (ticket 10, retrait R4) : 44 px de haut, retraits 12 px, police 16 px. */
export const CHAMPS_TICKET410 = 'input[type="text"].form-control';
/**
 * Lignes du forum en cartes forcées en :active par le fragment nettoyage (ticket 10, retrait R5). Ici et non dans la suite : cité par une
 * 4e suite, chacun de ces repères deviendrait transverse pour le routeur (MAX_CITING).
 */
export const LIGNES_FORUM_TICKET410 = '.panel-default .table > tbody > tr';
/** Classes de la racine du forum (ticket 10, A3) : [classe d'index sur <html>, classe de racine sur <body>, classe du forum sur <body>]. */
export const CLASSES_RACINE_TICKET410 = ['kr-page-forum-index', 'page-forum-racine', 'page-forum'];
/** Bundle d'avant l'épopée 4, ticket 9 : le corps de panneau natif n'y emploie pas encore le jeton d'espacement (règle minifiée du bundle). Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9). */
export const AVANT_TICKET49 = bundle => !bundle.includes('.panel-body{padding:var(--kr-space-4)}');
/** Bundle d'avant l'épopée 4, ticket 8 : il déclare encore --mobile-radius sur :root (règle minifiée du bundle). Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9). */
export const AVANT_TICKET48 = bundle => bundle.includes('--mobile-radius:');
/** Bundle d'avant l'épopée 4, ticket 7 : la date d'un kramail lu n'y emploie pas encore le jeton du détail (règle minifiée du bundle). Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9). */
export const AVANT_TICKET47 = bundle => !bundle.includes('.kramail-msg-date{font-size:var(--kr-font-detail)!important');

/**
 * Carte de section mobile (épopée 5, entrée 1) : repères de cartes-pastilles.mjs écrits ici, hors de la suite. panel-default, page-forum
 * et kr-page-forum-index, déjà cités par trois suites, compteraient sinon une quatrième citation (routeur, MAX_CITING).
 * De même pour la couleur du texte (--kr-text-primary) et le raccourci de rayon, cités par trois suites. Panneau mesuré, couleur attendue du
 * titre, raccourcis lus par le contrôle statique, règles de la carte (sélecteur sérialisé par le CSSOM, propriété, priorité attendue) et
 * règles du kramail ciblées (sélecteur, propriétés absentes ; null : règle absente).
 */
export const PANNEAU_TICKET51 = '.panel-default';
/** Dossier des fixtures de la modale d'ordre (repère cité par trois suites, routeur MAX_CITING). */
export const DOSSIER_MODALE_TICKET51 = 'modale-ordre';
export const TEXTE_TICKET51 = 'var(--kr-text-primary)';
export const RACCOURCIS_TICKET51 = ['padding', 'margin', 'background', 'border-radius'];
const CARTE_TICKET51 = 'body.mobile-mode:where(:not(.page-forum, .page-forum-racine)) .panel-default:where(:not(.panel-group > *, .modal *))';
export const REGLES_CARTE_TICKET51 = [
  [CARTE_TICKET51, 'background', 'important'],
  [CARTE_TICKET51, 'margin-left', ''],
  [CARTE_TICKET51, 'margin-right', ''],
  [CARTE_TICKET51 + ' > .panel-heading', 'padding', 'important'],
  [CARTE_TICKET51 + ' > .panel-heading', 'margin-bottom', 'important'],
  [CARTE_TICKET51 + ' > .panel-heading', 'min-height', ''],
  [CARTE_TICKET51 + ' > .panel-heading h3', 'color', 'important'],
  [CARTE_TICKET51 + ' > .panel-body:last-child', 'border-radius', ''],
  ['body.mobile-mode .building-section-content.collapsed', 'padding-top', ''],
  ['body.mobile-mode .building-section-content.collapsed', 'padding-bottom', '']
];
export const REGLES_KRAMAIL_TICKET51 = [
  ['body.page-kramail .panel.panel-default', ['margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'background', 'background-color']],
  ['body.page-kramail .panel-heading h3.panel-title', ['color']],
  ['body.page-kramail .panel-heading', null]
];

/**
 * Carte de section au forum (épopée 5, entrée 2, story-forum-mobile-la-liste-des-sujets-entre-dans-la-carte-de-sect) : repères de
 * cartes-pastilles.mjs écrits ici, hors de la suite (routeur, MAX_CITING). Sélecteur de la carte sans la garde du forum (règles du bundle
 * courant, lues par le contrôle statique), pastille des lignes de sujet (citée par trois suites), fixture du fil de sujet (citée par trois
 * suites), règles du forum ciblées (sélecteur sérialisé par le CSSOM, propriétés absentes) et valeurs interdites dans toutes leurs déclarations
 * (couleur d'accent, fond transparent, filet de l'en-tête).
 */
const CARTE_TICKET52 = 'body.mobile-mode .panel-default:where(:not(.panel-group > *, .modal *))';
export const REGLES_CARTE_TICKET52 = REGLES_CARTE_TICKET51.map(([sel, p, prio]) => [sel.replace(CARTE_TICKET51, CARTE_TICKET52), p, prio]);
export const PASTILLE_TICKET52 = '.kr-topic-badge';
export const SUJET_TICKET52 = 'forum-sujet.html';
// Ticket 12 (D7) : les règles du forum excluent accordéons et modales par la même garde de spécificité nulle que la carte.
const GARDE_TICKET12 = ':where(:not(.panel-group > *, .modal *))';
export const REGLES_FORUM_TICKET52 = [
  [`body.page-forum .panel-default${GARDE_TICKET12}`, ['background', 'background-color']],
  [`body.page-forum .panel-default${GARDE_TICKET12} > .panel-heading`, ['background', 'background-color', 'border-radius', 'padding']],
  [`body.page-forum .panel-default${GARDE_TICKET12} > .panel-heading h3`, ['color']],
  [`body.page-forum .panel-default${GARDE_TICKET12} > .panel-body, body.page-forum-racine .panel-default${GARDE_TICKET12} > .panel-body`, []]
];
export const VALEURS_FORUM_TICKET52 = ['--kr-text-accent', 'transparent', '--kr-border-default'];

/**
 * Groupes du plateau mobile (épopée 5, entrée 3, story-groupes-du-plateau-mobile-dans-la-carte-de-section) : repères de cartes-pastilles.mjs
 * écrits ici, hors de la suite (routeur, MAX_CITING) : section de groupe, en-tête, titre, chevron, grille et cartes de personnages, boutons
 * de groupe, mini-profil (cité par plus de trois suites) et son en-tête.
 */
export const GROUPES_TICKET53 = {
  section: '.dashboard-section', entete: '.dashboard-section-header', titre: '.dashboard-group-title', chevron: '.accordion-icon',
  grille: '.dashboard-cards-grid', carte: '.dashboard-card', boutons: '.dashboard-group-buttons', miniProfil: '.mobile-mini-profile',
  miniProfilEntete: '.mobile-mini-profile-header'
};

/**
 * Pastilles d'état de la barre (épopée 5, entrée 4, story-pastilles-d-etat-cloche-et-enveloppe-en-couleur-non-lu-r3) : repères de
 * cartes-pastilles.mjs écrits ici, hors de la suite (routeur, MAX_CITING) : pastille de la cloche, pastille de l'enveloppe, barre d'origine,
 * conteneur des clones mobiles, référence « NOUVEAU MESSAGE » du sous-forum (pastille citée par trois suites), jetons attendus du fond et du
 * texte (le jeton du non lu serait une troisième citation), règle réécrite (début du sélecteur sérialisé par le CSSOM) et emplois hors liste
 * (pastille de panneau de typographie-formes.html ; la pastille de groupe en est sortie à l'entrée 5.5, qui la réécrit en étiquette de
 * catégorie et la contrôle).
 */
export const PASTILLES_TICKET54 = {
  cloche: '.fa-bell ~ .badge', enveloppe: 'a[href*="kramail"] .badge', barre: '.navbar-right', clones: '.navbar-header-buttons-left',
  reference: '.kr-topic-badge[data-kr-label="NOUVEAU MESSAGE"]', fond: 'var(--kr-status-unread)', texte: 'var(--kr-bg-surface)',
  regle: '.badge-danger, .navbar-right a[href="kramail"] .badge:not(:empty)', horsListe: ['#pastille-titre']
};
/**
 * Écart accepté et consigné (épopée 5, entrée 4, story-pastilles-d-etat-cloche-et-enveloppe-en-couleur-non-lu-r3) : pastilles de la cloche
 * et de l'enveloppe en pastille d'état (fond --kr-status-unread, texte --kr-bg-surface, toutes variantes, deux supports). Feuille miroir de
 * la règle réécrite, mêmes sélecteurs ; elle garde !important, sans quoi la règle de la base la bat (elle vit dans le test, pas dans la
 * peau). La couleur de bordure (largeur 0) retirée de la règle revient à celle de « .label, .badge » (--kr-primary-dark) : le miroir la
 * déclare. Posée sur un bundle de base antérieur à l'entrée (AVANT_TICKET54), jamais sur le bundle courant ; tout autre écart reste
 * détecté. Écart consigné dans le plan de l'entrée (Plan Change Log). Seul utilisateur : typographie-formes (base COMMIT_AVANT, d68ab55).
 * Retrait : au prochain ticket qui modifie les étiquettes et pastilles ; il réaligne COMMIT_AVANT de typographie-formes sur un SHA récent
 * après contrôle absolu des pastilles d'état et des étiquettes de catégorie (entrées 5.4 et 5.5).
 */
export const CARTES_TICKET54 = [
  '@media (max-width: 767px), (min-width: 768px) {',
  '  .badge-danger, .navbar-right a[href="kramail"] .badge:not(:empty), .navbar-header-buttons-left a[href="kramail"] .badge:not(:empty), .navbar-header-buttons-left a[href*="kramail"] .badge:not(:empty) { background-color: var(--kr-status-unread) !important; color: var(--kr-bg-surface) !important; border-color: var(--kr-primary-dark) !important; }',
  '}'
].join('\n');
/** Bundle d'avant l'épopée 5, entrée 4 : la pastille de l'enveloppe des clones n'y est pas en fond non lu (règle minifiée du bundle). */
export const AVANT_TICKET54 = bundle => !bundle.includes('a[href*=kramail] .badge:not(:empty){background-color:var(--kr-status-unread)!important');

/**
 * Étiquettes de catégorie (épopée 5, entrée 5, story-etiquettes-de-categorie-un-seul-style-pnj-compris-h8-1) : repères de
 * cartes-pastilles.mjs écrits ici, hors de la suite (routeur, MAX_CITING) : étiquettes réécrites (PNJ des cartes, marque native, compteur
 * de groupe, tags du sujet et leur conteneur), compteurs de contact du kramail (pastilles d'état) et le sélecteur ajouté en tête de la
 * règle d'état, étiquettes déjà conformes, éléments hors familles, étiquettes d'état et pièce courante, tags natifs du sous-forum,
 * étiquettes et pastilles cherchées sur le fil de sujet (absence), jetons de la famille (fond, texte, survol) et couleurs d'état.
 */
export const ETIQUETTES_TICKET55 = {
  pnj: '.dashboard-card-pnj', marque: '.btn.btn-danger.xmini', groupe: '.dashboard-section-header .badge', tags: '.forum-tags a',
  tagsConteneur: '.forum-tags', contact: 'a.list-group-item[href^="kramail/"] > .badge',
  regleContacts: 'a.list-group-item[href^="kramail/"] > .badge:not(:empty)', regleMarque: 'html.kr-theme-enabled .btn.btn-danger.xmini',
  // Sélecteur des tags tel que le bundle minifié le sert (td:nth-child(1) devient td:first-child).
  regleTags: 'body.page-forum table.dataTable tbody td:first-child .forum-tags a',
  conformes: ['#etiquette-rang', '#etiquette-mod', '.kr-order-badge'], conformesPages: { 'index-rp': '.label', materiel: '.label-primary' },
  horsFamilles: ['.kr-stat-badge', '.kr-skill-badge', '.kr-room-here', '#col-leftest-stats .btn-success', '.mobile-characteristic-badge'],
  // Présence dans les fixtures : hors familles absent de la page (non listé), ou rendu sous 768 px seulement (exigé sous 768 px).
  horsFamillesAbsent: { barre: '.mobile-characteristic-badge', groupes: '.kr-room-here' },
  horsFamillesMobile: { barre: '.kr-room-here', groupes: '.mobile-characteristic-badge' },
  etat: ['.label-success', '.label-warning', '.label-danger', '#piece'], tagforum: 'span.tagforum', absents: '.label, .badge',
  fond: 'var(--kr-arm-bg, var(--kr-primary))', texte: 'var(--kr-arm-ink, var(--kr-white))',
  fondSurvol: 'var(--kr-arm-bg-hover, var(--kr-primary-dark))', texteSurvol: 'var(--kr-arm-ink-hover, var(--kr-white))',
  etats: ['var(--kr-status-unread)', 'var(--kr-success)', 'var(--kr-warning)', 'var(--kr-danger)']
};
/**
 * Écart accepté et consigné (épopée 5, entrée 5, story-etiquettes-de-categorie-un-seul-style-pnj-compris-h8-1) : « PNJ » des cartes,
 * compteur de groupe et tags du sujet (mobile) en étiquette de catégorie (fond --kr-arm-bg, texte --kr-arm-ink, bordure du compteur de la
 * couleur du fond) ; compteurs de contact du kramail remplis en pastille d'état (fond --kr-status-unread, texte --kr-bg-surface). Feuille
 * miroir des règles réécrites, mêmes sélecteurs ; elle porte !important, sans quoi la règle de la base la bat (elle vit dans le test, pas
 * dans la peau). Posée sur un bundle de base antérieur à l'entrée (AVANT_TICKET55), jamais sur le bundle courant ; empilable avec
 * CARTES_TICKET54 (posée avant elle) ; tout autre écart reste détecté. Écart consigné dans le plan de l'entrée (Plan Change Log). Seul
 * utilisateur : typographie-formes (base COMMIT_AVANT, d68ab55). Retrait : même condition que CARTES_TICKET54.
 */
export const CARTES_TICKET55 = [
  '.dashboard-card-pnj { background: var(--kr-arm-bg, var(--kr-primary)) !important; color: var(--kr-arm-ink, var(--kr-white)) !important; }',
  '@media (max-width: 767px), (min-width: 768px) {',
  '  .dashboard-section-header .badge { border-color: var(--kr-arm-bg, var(--kr-primary)) !important; background-color: var(--kr-arm-bg, var(--kr-primary)) !important; color: var(--kr-arm-ink, var(--kr-white)) !important; }',
  '  a.list-group-item[href^="kramail/"] > .badge:not(:empty) { background-color: var(--kr-status-unread) !important; color: var(--kr-bg-surface) !important; }',
  '}',
  '@media (max-width: 767px) {',
  '  body.page-forum table.dataTable tbody td:nth-child(1) .forum-tags a { color: var(--kr-arm-ink, var(--kr-white)) !important; background: var(--kr-arm-bg, var(--kr-primary)) !important; }',
  '}'
].join('\n');
/** Bundle d'avant l'épopée 5, entrée 5 : le « PNJ » des cartes n'y est pas en fond de catégorie (règle minifiée du bundle). */
export const AVANT_TICKET55 = bundle => !bundle.includes('.dashboard-card-pnj{background:var(--kr-arm-bg');

/**
 * Activité du forum (épopée 6, ticket 2, story-index-mobile-dans-la-carte-de-section-la-fleche-et-premier-n) : repères de
 * forum-activite.mjs écrits ici, hors de la suite (routeur, MAX_CITING) : fixtures du fil de sujet et des index (citées par trois suites),
 * classes de l'index et du forum, carte de section, ligne de l'index et flèche « dernier message ».
 */
export const ACTIVITE_TICKET62 = {
  sujet: 'forum-sujet.html',
  indexRp: 'forum-index-rp.html',
  indexCommunaute: 'forum-index-communaute.html',
  racineGroupes: 'forum-racine-groupes.html',
  sousForum: 'sous-forum-debuter.html',
  classeIndex: 'kr-page-forum-index',
  classeForum: 'page-forum',
  panneau: '#col-right .panel-default',
  ligne: '#col-right .panel-default table.table > tbody > tr',
  fleche: '.btn-group > a.btn'
};

/**
 * Fil d'Ariane du forum (épopée 6, ticket 3, story-un-seul-fil-d-ariane-categorie-forum-sujet-pour-l-index-le-s) : repères du fragment
 * fil de forum-activite.mjs écrits ici, hors de la suite (routeur, MAX_CITING) : classes de la famille du fil, classe du fil du sujet,
 * conteneurs de fil comptés, icône de retour, entrée active de la liste latérale, fixture de la colonne native, page de réponse (chemin,
 * fixture, h1 « réel capturé » de forum-mobile.mjs à deux liens), page hors forum à deux liens, bouton flottant, attribut du séparateur,
 * jetons de texte de la famille.
 */
export const REPERES_FIL_TICKET63 = {
  fil: 'forum-mobile-breadcrumb',
  lien: 'forum-mobile-breadcrumb-link',
  libelle: 'forum-mobile-breadcrumb-label',
  sep: 'forum-mobile-breadcrumb-sep',
  courant: 'forum-mobile-breadcrumb-current',
  filSujet: 'forum-thread-mobile-breadcrumb',
  conteneurs: '.forum-mobile-breadcrumb, .forum-thread-mobile-breadcrumb, .breadcrumb',
  icone: 'fa-backward',
  entreeActive: '#col-left .list-group-item.active',
  colonneNative: 'forum-colonne-native-hrp.html',
  reponse: {
    chemin: '/forum/post/repondre-2-329425',
    fixture: 'typographie-forum-redaction.html',
    h1: '<h1 class="page-header">FIXTURE sujet de test &gt; Réponse\n<span class="pull-right"><a href="forum/hrp/site-annonces-20101" class="btn btn-default"><i class="fa fa-backward"></i> Site &amp; Annonces</a>\n<a href="forum/sujet/fixture-1-1" class="btn btn-default"><i class="fa fa-backward"></i> sujet</a></span></h1>'
  },
  regles: { chemin: '/regles/avancees', fixture: 'palette-nation.html' },
  fab: 'forum-new-topic-fab',
  masque: 'aria-hidden',
  textes: ['var(--kr-text-primary)', 'var(--kr-text-secondary)']
};

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

/**
 * Épopée 4, ticket 6 (Matériel, Bâtiments, Employés) : ligne d'objet des pages de jeu (élément de liste enfant direct du corps de panneau
 * de #col-right) et couleur de texte secondaire attendue de sa charge sur mobile. Écrits ici, hors des suites : ces repères, déjà cités par
 * trois suites, compteraient sinon une quatrième citation (routeur, MAX_CITING).
 */
export const LIGNE_OBJET_TICKET6 = '#col-right .panel-body > a.list-group-item';
export const SECONDAIRE_TICKET6 = 'var(--kr-text-secondary)';

/**
 * Rayons (épopée 4, ticket 8) : propriétés lues par le contrôle statique du fragment rayons de typographie-formes.mjs (raccourci, puis les
 * quatre coins). Écrites ici, hors des suites : ces repères, déjà cités par trois suites, compteraient sinon une quatrième citation
 * (routeur, MAX_CITING).
 */
export const PROPRIETES_RAYON_TICKET48 = ['border-radius', ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius']];

/**
 * Espacement (épopée 4, ticket 9) : cas du fragment espacement de typographie-formes.mjs, par page, et déclarations lues par son contrôle
 * statique. Écrits ici, hors des suites : plusieurs de ces repères (btn-xs, form-control, list-group-item, panel-default, page-forum), déjà
 * cités par trois suites, compteraient sinon une quatrième citation (routeur, MAX_CITING).
 * Cas : [clé, sélecteur, rôle, support, attendu] ; rôle R (déclaration de la peau réécrite au jeton), N (natif de Bootstrap réécrit au rôle),
 * E (exception égale au bundle de base) ; support m = mobile seulement, b = ordinateur seulement ; attendu R/N { propriété : n } (jeton
 * --kr-space-n), E [propriétés] (hauteur, droite, x, largeur : boîte arrondie au dixième).
 */
const RETRAIT = (h, d = h, b = h, g = d) => ({ 'padding-top': h, 'padding-right': d, 'padding-bottom': b, 'padding-left': g });
const ECART = n => ({ 'row-gap': n, 'column-gap': n });
export const RETRAITS_TICKET49 = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'];
export const ECARTS_TICKET49 = ['row-gap', 'column-gap'];
// Cas communs aux panneaux mobiles (« Panels responsive ») et aux natifs sur ordinateur ; null retire le cas. Hors portée (battus dans la
// base comme dans le bundle testé) : panneaux d'un accordéon (.panel-group, marge 0), corps du kramail (0), corps de la commande (16 px
// littéral, déjà au pas), corps d'une liste d'objets (.list-group, 10 px), corps à champ « c… » (l.4508, 10 px, exception E ci-dessous).
const PANNEAUX = ({ panneau = '.panel:not(.panel-group > .panel)', entete = '.panel-heading', corps = '.panel-body', corpsMobile = corps, liens = '.panel-body a' } = {}) => [
  panneau && ['panneau', panneau, 'R', 'm', { 'margin-bottom': 4 }], entete && ['entete', entete, 'R', 'm', ECART(2)],
  corpsMobile && ['corps', corpsMobile, 'R', 'm', RETRAIT(4)], liens && ['liens', liens, 'R', 'm', ECART(2)],
  liens && ['liens-marge', `${liens}:not(.btn-group a, p.nomargin a)`, 'R', 'm', { 'margin-bottom': 1 }],
  corps && ['corps', corps, 'N', 'b', RETRAIT(4)], entete && ['entete', entete, 'N', 'b', RETRAIT(3, 4)]
].filter(Boolean);
const MARGES = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'];
// Exception E : chaque propriété d'espacement et la hauteur égales à la base ; SAUF retire une propriété déjà couverte par un cas R ou N, ou
// une marge automatique (sa valeur calculée suit la largeur de l'élément).
const EXCEPTION = [...RETRAITS_TICKET49, ...MARGES, ...ECARTS_TICKET49, 'hauteur'];
const SAUF = (...p) => EXCEPTION.filter(x => !p.includes(x));
const BOUTONS_BUREAU = EXCEPTION;
// Colonnes : la hauteur suit le contenu (rangées R plus hautes ou plus basses), x et largeur restent fixes.
const COLONNES = ['colonnes', '[id^="col-"]', 'E', null, ['x', 'largeur', ...SAUF('hauteur')]];
export const CAS_ESPACEMENT_TICKET49 = {
  plateau: [
    ...PANNEAUX({ entete: null, corps: '.panel-body:not(.grid-transformed)' }),
    ['grille', '#col-leftest .panel-body.grid-transformed', 'E', 'b', EXCEPTION],
    ['boutons', '.kr-action-grid > .btn, .kr-quick-access-buttons > .btn', 'E', 'b', BOUTONS_BUREAU],
    // Mobile : accès rapides et actions rapides dans un .panel-body, écarts et marge basse couverts par les cas R liens et liens-marge.
    ['boutons', '.kr-quick-access-buttons > .btn, .mobile-quick-actions .btn', 'E', 'm', SAUF('margin-bottom', ...ECARTS_TICKET49)],
    ['tuiles', '.mobile-mini-profile .mobile-skill-item, .mobile-mini-profile .mobile-characteristic-badge', 'E', 'm', EXCEPTION],
    ['liste', '.list-group-item', 'E', null, EXCEPTION], COLONNES
  ],
  'plateau-typo': [
    ...PANNEAUX({ corps: '.panel-body:not(.grid-transformed)', corpsMobile: '.panel-body:not(.grid-transformed, :has([id^="c"]))' }),
    ['corps-champ', '.panel-body:has([id^="c"])', 'E', 'm', EXCEPTION], ['grille', '#col-leftest .panel-body.grid-transformed', 'E', 'b', EXCEPTION], COLONNES
  ],
  sujet: [
    ['messages', 'ul.media-list.forum > li.media.kr-msg > .media-body > .pull-right .btn', 'R', 'm', ECART(1)],
    ['plus', '.kr-msg-more', 'E', 'm', [...SAUF('margin-left', ...ECARTS_TICKET49), 'droite']],
    ['entete', '.forum-top .pull-right > .btn', 'E', 'b', BOUTONS_BUREAU],
    ['compacts', '.btn-xs, .btn-group-xs > .btn', 'E', 'b', BOUTONS_BUREAU], ['groupes', '.btn-group .btn + .btn', 'E', 'b', EXCEPTION]
  ],
  redaction: [
    ['plus', '.kr-tools-plus', 'R', 'm', { 'padding-left': 2, 'padding-right': 2 }],
    ['plus-marges', '.kr-tools-plus', 'E', 'm', [...SAUF('padding-left', 'padding-right', 'margin-left'), 'droite']],
    ['envoyer', 'form.kr-editor[name="post_msg"] div > button.btn-primary.pull-right', 'E', 'm', [...SAUF('margin-left'), 'droite']],
    ['envoyer', 'div.col-sm-12 > button.btn.btn-primary.pull-right', 'E', 'b', BOUTONS_BUREAU], ['champs', '.form-control', 'E', 'b', BOUTONS_BUREAU],
    ['compacts', '.btn-xs, .btn-group-xs > .btn', 'E', 'b', BOUTONS_BUREAU], ['groupes', '.btn-group .btn + .btn', 'E', 'b', EXCEPTION]
  ],
  'index-rp': [
    ['cellules', '#col-right .panel-default .table > tbody > tr > td:not(:nth-child(4))', 'R', 'b', RETRAIT(1, 2)],
    ['fleches', '#col-right .panel-default .table > tbody > tr > td:nth-child(4)', 'R', 'b', { 'padding-top': 1, 'padding-bottom': 1, 'padding-left': 2 }],
    ['corps', '#col-right .panel-default > .panel-body', 'R', 'b', RETRAIT(2, 4)]
  ],
  'sous-forum': [
    ['cellules', '.panel-default tbody > tr > td:not(:nth-child(5))', 'R', 'b', RETRAIT(1, 2)],
    ['fleches', '.panel-default tbody > tr > td:nth-child(5)', 'R', 'b', { 'padding-top': 1, 'padding-bottom': 1, 'padding-left': 2 }],
    ['corps', ':is(#fx-permanents, #fx-sujets) > .panel-body', 'R', 'b', RETRAIT(2, 4)], ['titres', '#topics thead th', 'N', 'b', RETRAIT(2)]
  ],
  reception: PANNEAUX({ panneau: null, corpsMobile: null }),
  lecture: [['compacts', '.btn-xs, .btn-group-xs > .btn', 'E', 'b', BOUTONS_BUREAU]],
  nouveau: [
    ['champs', '.form-control', 'E', 'b', BOUTONS_BUREAU], ['bbcode', 'form[name="post_msg"] .btn-toolbar .btn', 'E', null, EXCEPTION]
  ],
  repondre: [
    ...PANNEAUX({ panneau: null, corps: null, liens: null }), ['champs', '.form-control', 'E', 'b', BOUTONS_BUREAU],
    ['bbcode', 'form[name="post_msg"] .btn-toolbar .btn', 'E', null, EXCEPTION]
  ],
  'modale-ordre': [
    ...PANNEAUX({ corps: '.panel-body:not(.grid-transformed, .list-group > .panel-body)', corpsMobile: null }),
    ['aide', '.kr-order-form .kr-order-help-toggle', 'R', null, { ...ECART(1), 'margin-bottom': 2 }],
    ['pied', '.modal-footer .btn + .btn', 'N', 'b', { 'margin-left': 1 }], ['pied-boutons', '.modal-footer .btn:not(.btn + .btn)', 'E', 'b', BOUTONS_BUREAU],
    ['pied-boutons', '.modal-footer .btn + .btn', 'E', 'b', SAUF('margin-left')],
    ['champs', '.form-control', 'E', 'b', BOUTONS_BUREAU], ['grille', '#col-leftest .panel-body.grid-transformed', 'E', 'b', EXCEPTION], COLONNES
  ],
  interface: [
    ['import', '#kr-config-import-btn', 'R', 'b', { 'margin-left': 1 }], ['petits', '.btn-sm:not(#kr-config-import-btn)', 'E', 'b', BOUTONS_BUREAU], ['petits', '#kr-config-import-btn', 'E', 'b', SAUF('margin-left')]
  ],
  composants: [
    ...PANNEAUX({ liens: null }), ['aide', '.kr-order-form .kr-order-help-toggle', 'R', null, { ...ECART(1), 'margin-bottom': 2 }],
    ['boutons', '[id^="bs-"].btn:not(.btn-xs, .btn-sm, .kr-order-help-toggle)', 'E', null, BOUTONS_BUREAU], ['tableau', '#dt thead th', 'E', null, EXCEPTION]
  ]
};
export const PROPRIETES_ESPACEMENT_TICKET49 = [...RETRAITS_TICKET49, 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', ...ECARTS_TICKET49];

// Déclarations au jeton : [média, sélecteur, propriété, valeur, priorité].
const COMBINEE = '(width <= 767px), (width >= 768px)';
const MOBILE = '(width <= 767px)';
const BUREAU = '(width >= 768px)';
export const DECLARATIONS_ESPACEMENT_TICKET49 = [
  [COMBINEE, '.kr-order-form .kr-order-help-toggle', 'gap', 'var(--kr-space-1)', ''],
  [COMBINEE, '.kr-order-form .kr-order-help-toggle', 'margin-bottom', 'var(--kr-space-2)', ''],
  [MOBILE, '.panel', 'margin-bottom', 'var(--kr-space-4)', 'important'],
  [MOBILE, '.panel-heading', 'gap', 'var(--kr-space-2)', 'important'],
  [MOBILE, '.panel-body:where(:not(.building-section-content.collapsed))', 'padding', 'var(--kr-space-4)', 'important'],
  [MOBILE, '.panel-body a', 'gap', 'var(--kr-space-2)', 'important'],
  [MOBILE, '.panel-body a', 'margin-bottom', 'var(--kr-space-1)', 'important'],
  [BUREAU, 'html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbody > tr > td', 'padding', 'var(--kr-space-1) var(--kr-space-2)', 'important'],
  [BUREAU, 'html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default > .panel-body', 'padding', 'var(--kr-space-2) var(--kr-space-4) var(--kr-space-2)', 'important'],
  [BUREAU, ':where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr > td', 'padding', 'var(--kr-space-1) var(--kr-space-2)', 'important'],
  [BUREAU, ':where(html.kr-page-forum-index) #col-right .panel-default > .panel-body', 'padding', 'var(--kr-space-2) var(--kr-space-4) var(--kr-space-2)', 'important'],
  [MOBILE, 'body.mobile-mode ul.media-list.forum > li.media.kr-msg > .media-body > .pull-right .btn', 'gap', 'var(--kr-space-1)', ''],
  [MOBILE, 'body.mobile-mode.page-forum form.kr-editor .btn-toolbar.kr-tools-ready .kr-tools-plus', 'padding', '0 var(--kr-space-2)', 'important'],
  [COMBINEE, '.panel-body', 'padding', 'var(--kr-space-4)', ''],
  [COMBINEE, '.panel-heading', 'padding', 'var(--kr-space-3) var(--kr-space-4)', ''],
  [COMBINEE, '.modal-footer .btn + .btn', 'margin-left', 'var(--kr-space-1)', ''],
  [BUREAU, ':where(html body.page-forum.kr-subforum) table.dataTable thead th', 'padding', 'var(--kr-space-2)', '']
];

/**
 * En-tête de sujet mobile (épopée 6, ticket 4, story-en-tete-de-sujet-mobile-dans-communaute-debats-et-staff-h12) : repères du fragment
 * entete de forum-activite.mjs écrits ici, hors de la suite (routeur, MAX_CITING) : fixtures des sujets (Communauté, Débats, Staff supposé,
 * sujet fermé), barres d'actions et leurs actions, garde de page du sujet, classes du h1 et du .forum-top du bas, sélecteurs natifs (boutons
 * du .forum-top, liens « nouveau sujet » et « répondre », cadenas, h1, messages), lien parent du fil d'Ariane de forum-sujet.html, jetons
 * des actions (primaire, bouton standard, rayon).
 */
export const REPERES_ENTETE_TICKET64 = {
  fixtures: {
    communaute: 'forum-sujet-communaute.html',
    debats: 'forum-sujet-debats.html',
    staff: 'forum-sujet-staff.html',
    ferme: 'forum-sujet-ferme.html'
  },
  chemins: {
    communaute: '/forum/sujet/la-recette-du-ragout-de-kroquette-330501-1',
    debats: '/forum/sujet/faut-il-taxer-les-chapeaux-330502-1',
    staff: '/forum/sujet/inventaire-des-balais-330503-1',
    ferme: '/forum/sujet/mode-d-emploi-de-l-entraide-330504-1'
  },
  barre: 'forum-thread-actions',
  barreBas: 'forum-thread-actions-bottom',
  action: 'forum-thread-action',
  repondre: 'forum-thread-action-reply',
  nouveau: 'forum-thread-action-new',
  garde: 'kr-forum-sujet',
  titre: 'forum-thread-heading',
  basDePage: 'forum-thread-top-bottom',
  h1: '#col-right h1.page-header',
  hautDePage: '.forum-top',
  natifs: '.forum-top .pull-right > .btn',
  pullRight: '.forum-top .pull-right',
  lienNouveau: '.forum-top a[href*="nouveau-sujet"]',
  lienRepondre: '.forum-top a[href*="post/repondre"]',
  cadenas: '.forum-top i.fa-lock',
  icone: 'i.fa-comments',
  h1Icone: '<i class="far fa-comments"></i>\n',
  parentHrp: 'forum/hrp/site-annonces-20101',
  parentHrpNom: 'Site & Annonces',
  jetons: {
    fondPrimaire: 'var(--kr-arm-bg, var(--kr-primary))',
    textePrimaire: 'var(--kr-arm-ink, var(--kr-white))',
    fondStandard: 'var(--kr-bg-surface)',
    bordureStandard: 'var(--kr-border-tint)',
    texteStandard: 'var(--kr-text-nation)',
    fondSurvol: 'var(--kr-header-tint)',
    rayon: 'var(--kr-radius-sm)'
  }
};

/**
 * Bouton « ••• » commun au forum et au kramail (épopée 6, ticket 5, story-bouton-commun-au-forum-et-au-kramail-h12-2) : repères du fragment
 * plus de forum-activite.mjs écrits ici, hors de la suite (routeur, MAX_CITING) : fixtures et chemins des trois pages (sujet, réception et
 * lecture du kramail), classe commune et glyphe, ancienne icône, attribut du glyphe, boutons d'accroche (« ••• » du forum, toggles des deux
 * menus du kramail), message et barre d'actions du forum, état ouvert et actions secondaires, boutons du h1 du kramail, menus et leurs items,
 * voile de Bootstrap, jetons du bouton standard.
 */
export const REPERES_PLUS_TICKET65 = {
  fixtures: { sujet: 'forum-sujet.html', reception: 'kramail-reception.html', lecture: 'kramail-lecture.html' },
  chemins: { sujet: '/forum/sujet/messages-v3-329425-1', reception: '/kramail/personnage-fictif-2000-0', lecture: '/kramail/post/sujet-fictif-0-9000002' },
  plus: 'kr-more',
  glyphe: 'kr-more-glyph',
  ancien: 'fa-ellipsis-v',
  cache: 'aria-hidden',
  hotes: {
    sujet: 'ul.media-list.forum > li.media > .media-body > .pull-right .kr-msg-more',
    reception: 'h1.page-header .pull-right > .kramail-actions-mobile > .dropdown-toggle',
    lecture: 'h1.page-header .pull-right > .kramail-post-kebab > .dropdown-toggle'
  },
  message: 'li.media',
  ouvert: 'kr-msg-open',
  barre: '.media-body > .pull-right',
  secondaire: '.kr-msg-secondary',
  groupe: '.btn-group',
  item: '.dropdown-menu > li > a',
  menu: '.dropdown-menu',
  boutonsH1: 'h1.page-header .pull-right > a.btn, h1.page-header .pull-right > .btn-group > .btn',
  voile: 'dropdown-backdrop',
  chat: { id: 'flap', fab: '.mini-chat-fab', lien: 'a[href*="#flap"]' },
  jetons: { fond: 'var(--kr-bg-surface)', bordure: 'var(--kr-border-tint)', texte: 'var(--kr-text-nation)' }
};

/**
 * Ligne de forum (épopée 6, ticket 6, story-ligne-de-forum-icone-lue-dans-la-liste-laterale-forum-sans-m) : repères du fragment ligne de
 * forum-activite.mjs écrits ici, hors de la suite (routeur, MAX_CITING) : classe de l'icône posée par ForumIndex:Presentation, icône de
 * la liste latérale, sélecteur de la liste, fixture de la colonne native RP (composée en mémoire avec l'index RP), jetons de l'auteur du
 * dernier message, icônes attendues par chemin de forum, attribut qui masque l'icône aux lecteurs d'écran, racine sans liste latérale.
 */
export const REPERES_LIGNE_TICKET66 = {
  icone: 'kr-forum-icon',
  lefticon: 'lefticon',
  liste: '#col-left .list-group',
  colonneNative: 'forum-colonne-native-rp.html',
  accent: 'var(--kr-text-accent)',
  secondaire: 'var(--kr-text-secondary)',
  detail: 'var(--kr-font-detail)',
  icones: {
    'forum/rp/taverne-10101': 'far fa-comments',
    'forum/rp/marche-10102': 'far fa-gem',
    'forum/rp/royaume-d-essai-10104': 'far fa-flag',
    'forum/rp/les-cadets-d-essai-10107': 'far fa-handshake',
    'forum/communaute/annonces-d-essai-30101': 'far fa-newspaper',
    'forum/communaute/clubs-d-essai-30102': 'far fa-smile',
    'forum/communaute/archives-d-essai-30103': 'far fa-folder'
  },
  cache: 'aria-hidden',
  racineNue: 'forum-racine.html'
};

/**
 * Accordéon et modale sur une page du forum (ticket 12, story-envoyer-et-panneaux-du-forum-sur-page-derivee) : repères du fragment
 * panneaux de forum-activite.mjs écrits ici, hors de la suite (routeur, MAX_CITING) : markup ajouté au fil de sujet en mémoire (accordéon
 * à deux panneaux, corps direct et corps repliable ; modale statique ouverte, sans appel jQuery) et sélecteur des panneaux mesurés.
 */
export const REPERES_PANNEAUX_TICKET12 = {
  html: '<div class="panel-group" id="kr-acc">'
    + '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Section repliable</h3></div><div class="panel-body">Contenu inventé.</div></div>'
    + '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><a data-toggle="collapse" href="#kr-acc-2">Autre section</a></h3></div><div id="kr-acc-2" class="panel-collapse collapse in"><div class="panel-body">Autre contenu.</div></div></div>'
    + '</div>'
    + '<div class="modal fade in" id="kr-modale" tabindex="-1" style="display: block;"><div class="modal-dialog"><div class="modal-content"><div class="modal-body">'
    + '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Panneau de modale</h3></div><div class="panel-body">Contenu de modale.</div></div>'
    + '</div></div></div></div>',
  sel: '.panel-group > .panel-default, .modal .panel-default'
};
