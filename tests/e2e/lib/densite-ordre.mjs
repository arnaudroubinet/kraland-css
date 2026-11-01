// Modale d'ordre sur mobile : repères partagés des changements comparés à des bases figées.
// 1. Mode compact clavier ouvert (#32) : pied sur une ligne et modale bord à bord quand le clavier virtuel est ouvert.
// 2. Densité (retours d'Arnaud du 1er novembre 2026 sur l'ordre Parler, relevé sur le site réel en 360 × 680, thème Empire Brun) : pied en
//    rangée, onglets sur trois colonnes, titre, tableau des actions et champs resserrés.
// Une suite qui compare à une base figée d'avant l'un de ces changements consigne son écart (« Écart accepté et consigné ») sous la condition
// du détecteur : l'exception se retire donc seule au recalage des COMMIT_* au-delà du changement (détecteur faux).

/** Bundle d'avant le mode compact clavier ouvert : la classe posée par trackOrderModalViewport n'y figure pas. */
export const AVANT_CLAVIER_COMPACT = bundle => !bundle.includes('kr-keyboard-open');

/** Bundle d'avant la densité : les variables des onglets lues par forceOrderModalGridLayout n'y figurent pas. */
export const AVANT_DENSITE_ORDRE = bundle => !bundle.includes('--kr-order-tabs-columns');
