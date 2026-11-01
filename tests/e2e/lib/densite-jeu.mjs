// Matériel et Personnage sur mobile : repère partagé de la densité du 1er novembre 2026 (section « MATÉRIEL ET PERSONNAGE MOBILES :
// DENSITÉ » du thème, classes de page kr-page-materiel et kr-page-personnage posées par KR_PAGE_CLASSES ; cadre bord à bord des ordres
// longs, trackOrderModalViewport), pour les suites qui comparent à une base figée.
// Une suite dont la base précède ce changement consigne son écart (« Écart accepté et consigné ») sous la condition du détecteur :
// l'exception se retire donc seule au recalage des COMMIT_* au-delà du changement (détecteur faux).

/** Bundle d'avant la densité du Matériel et du Personnage : la classe de page du Personnage n'y figure pas. */
export const AVANT_DENSITE_JEU = bundle => !bundle.includes('kr-page-personnage');

/** Pages de jeu resserrées sur mobile (chemins, sous-chemins compris) : panneaux de #col-right à 8 px d'écart, en-tête de 44 px, corps à
 * 8 px de retrait (16 px de côté pour un corps de texte). */
export const PAGES_DENSITE_JEU = ['/jouer/materiel', '/jouer/perso'];

/** Repères de densite-jeu.mjs déjà cités par trois suites (MAX_CITING du routeur) : tenus ici pour ne pas les retirer du routage des
 * autres suites. */
export const REPERES_DENSITE_JEU = {
  carte: '.panel-default',
  nomObjet: '.list-group-item-heading',
  piedModale: '.modal-footer',
  contenuOrdre: 'ajax-order',
  feuillesSite: 'kraland-7.0.9/css/'
};
