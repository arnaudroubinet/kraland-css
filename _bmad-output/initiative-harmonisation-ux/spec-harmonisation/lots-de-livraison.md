# Lots de livraison

Découpage proposé le 2026-10-19, à transformer en épopées par `bmad-ticket`. Une branche et une PR par lot vers `feature/next`.

## Préalables

| Id | Préalable | Bloque | Qui |
|---|---|---|---|
| P1 | Stratégie de cascade : garder les sections sans garde et les battre, les garder par page (`:where()`), ou les retirer ; 48 % des déclarations sont en `!important` | lots 3, 4, 5, 9 | Arnaud tranche, sur une note d'options écrite après le lot 1 |
| P2 | Vrai téléphone : les quatre fonctions mobiles appelées tôt, la modale d'ordre mobile, « Envoyer » avec le clavier ouvert (Q17) | parties mobiles des lots 2 et 7 | Arnaud, avec un protocole fourni |
| P3 | Navigateur Playwright du dépôt installé | tous les lots | satisfait le 2026-10-20 |

## Lots

| Lot | Capacité | Décisions | Dépend de | Zones de test |
|---|---|---|---|---|
| 1 | CAP-1, CAP-2 | H1.1, H1.2 (fuite du « ok » des Règles), H1.3 + R1, H1.4 + R1, H1.5, H1.6 | P3 | plateau, profil, forum, sous-forum, kramail |
| 2 | CAP-3 | H2.1 à H2.7, R2, pastilles (H2.5, Q1) | P2 (mobile) | nouvelle suite modale d'ordre (fixture synthétique) |
| 3 | CAP-4 | H5.1 à H5.7, Q1, Q2, R3, R7 ; valeurs de DESIGN.md › Colors › Valeurs par variante | P1 | report, plateau, forum, croix (16 variantes) |
| 4 | CAP-5 | H3.1, H3.2, H11.1, H11.2, H6.1 à H6.3, H8.2 | P1, lot 3 | plateau, profil, forum, messages, kramail |
| 5 | CAP-6 | H4.1, R6, H8.1, R3 (cloche, enveloppe) | lots 3 et 4 | sous-forum, forum, plateau, kramail |
| 6 | CAP-7 | refonte de l'index (maquette h12), H12.2, H12.3, H12.4, correctif des ancres `#msg` sur mobile | lot 5 | forum, sous-forum, messages, menus-forums |
| 7 | CAP-8 | H13.1, R4 (fin de la barre fixe) | P2, lot 5 | kramail |
| 8 | CAP-9 | H14.1 à H14.3, R5 (popup 900×800) | lot 4 | report |
| 9 | CAP-10 | H7.1, H9.1, H10.1 | P1, lot 4 | plateau, profil, croix, transitions |

## Lot 1

Code sur `feature/next`, `948d93f..5bf2984`, base des lots suivants. Écart mesuré sur le site réel le 2026-10-20 (mobile 375×667) :

- sur Cybermonde (`/map`), le module JS des sujets permanents (`enrichPermanentTopicsStats`) ajoute 6 blocs de compteurs et masque 12 cellules ; la page, couverte par l'accord du 2026-10-16, n'a ni fixture ni test sur cette base ;
- Événements, Membres, Contacts et Statistiques ne sont pas touchés.
