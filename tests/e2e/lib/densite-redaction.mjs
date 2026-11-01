// Rédaction sur mobile (kramail et forum) : repère partagé de la densité du 1er novembre 2026 (section « RÉDACTION MOBILE : DENSITÉ » du
// thème ; fil d'Ariane de la réponse au forum, transformPostHeader du template), pour les suites qui comparent à une base figée.
// Une suite dont la base précède ce changement consigne son écart (« Écart accepté et consigné ») sous la condition du détecteur :
// l'exception se retire donc seule au recalage des COMMIT_* au-delà du changement (détecteur faux).

/** Bundle d'avant la densité de la rédaction : la garde de page posée par transformPostHeader n'y figure pas. */
export const AVANT_DENSITE_REDACTION = bundle => !bundle.includes('kr-forum-redaction');

/** Échelle de la rédaction (typographie-formes#echelle-forum, taille de chaque élément de #col-right) : libellé « Options » en 13 px
 * comme « Message » (libellés de rédaction du ticket 7), cases en 15 px (texte courant mobile) ; 14 px l'un et l'autre avant. */
export const TAILLES_DENSITE_REDACTION = [
  '@media (max-width: 767px) {',
  '  body.mobile-mode:is(.page-forum, .page-kramail-compose) form.kr-editor > .form-group:has(> .col-md-10 > label.checkbox-inline) > label.control-label { font-size: var(--kr-font-detail); }',
  '  body.mobile-mode:is(.page-forum, .page-kramail-compose) form.kr-editor > .form-group > .col-md-10 > label.checkbox-inline { font-size: var(--kr-font-body-mobile); }',
  '}'
].join('\n');
