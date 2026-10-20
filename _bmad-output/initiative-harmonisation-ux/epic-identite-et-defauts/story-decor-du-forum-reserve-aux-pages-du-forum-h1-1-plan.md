---
title: "Décor du forum réservé aux pages du forum (H1.1)"
ticket: 2
status: built
---

## Code Review

### 2026-10-20

Revue des commits a6ccd2e..5bf2984 (tickets 1.1 à 1.5), quatre relecteurs ; ce ticket : 2 patch.

- [x] [Review][Patch] Suite jeu-identite rattachée aux seules zones plateau et profil : un changement des sections CSS forum ou kramail qu'elle garde (fuite-forum, regles-ok) ne la relance pas via test:changed [tests/e2e/lib/router.mjs:46]
- [x] [Review][Patch] Cartes réelles de /forum/rp mesurées mais non vérifiées : `index.cartes` et `index.affichage` sans assertion, une casse des cartes visibles passerait [tests/e2e/jeu-identite.mjs]

Rejected (revue du 2026-10-20, tickets 1.1 à 1.5) :
- false — la fin des cartes globales change d'autres pages mobiles : visite réelle du 2026-10-20, Événements, Membres, Contacts, Statistiques non touchés.
- false — H1.5 en 600 au lieu de « gras » : DESIGN.md (Boutons d'accès rapide) et l'onglet mobile actif disent demi-gras ; le filet intérieur de 3 px est le filet demandé.
- false — aria-current absent : lecteurs d'écran hors périmètre (non-goal de la spec).
- low — double bloc de cartes du forum (l.7494 et l.8195) : antérieur au lot 1, la garde n'a fait que le borner.
- low — en-tête de panneau mobile encore global sur Personnage : assumé jusqu'au lot 5 (H4.1).
- low — barre fixe conservée sur toutes les pages du forum : assumé jusqu'au lot 7 (R4).
- low — Cybermonde non testé : ticket 1.6.
- low — pas de test de la barre sur une réponse du forum, couverture e2e partielle de R1 et H1.5 (matériel, bâtiments, employés, tablette) : couvert en unitaire ou par construction, ajout de suites hors proportion.
- maybe-false sans suite — « Verification gap » : aucun écart rendu.
