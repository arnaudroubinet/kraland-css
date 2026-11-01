// Listes du kramail sur mobile (Réception, Envoi, Corbeille) : repère partagé de la densité du 1er novembre 2026 (section « KRAMAIL,
// LISTES MOBILES : DENSITÉ » du thème : titre et carrés sur un rang, onglets sur un rang de 44 px, recherche alignée, pagination d'une
// seule page masquée), pour les suites qui comparent à une base figée.
// Une suite dont la base précède ce changement consigne son écart (« Écart accepté et consigné ») sous la condition du détecteur :
// l'exception se retire donc seule au recalage des COMMIT_* au-delà du changement (détecteur faux).

/** Bundle d'avant la densité des listes du kramail : le ::after du titre, qui renvoie les onglets au rang suivant, n'y figure pas. */
export const AVANT_DENSITE_LISTE_KRAMAIL = bundle => !/kr-kramail-entete::?after/.test(bundle);
