# Harmonisation UX : feuille de route d'implémentation

**Spec :** `_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md`, `EXPERIENCE.md`, `notes-implementation.md` (décisions : `.memlog.md`).

La spec couvre plusieurs sous-systèmes indépendants. Chaque lot ci-dessous devient une PR vers `feature/next`, avec son propre plan détaillé (`docs/superpowers/plans/2026-10-19-harmonisation-ux-lotN-*.md`), écrit quand vient son tour. Une PR à la fois, fusionnée seulement avec l'accord d'Arnaud ; QA indépendante avant fusion (AGENTS.md › Livraison).

## Préalables (notes-implementation.md)

| Id | Préalable | Bloque | Qui |
|---|---|---|---|
| P1 | Décider la stratégie de cascade : garder les sections sans garde et les battre, les garder par page (`:where()`), ou les retirer. 48 % des déclarations sont en `!important`. | Lots 3, 4, 5 et 9 | Arnaud tranche, sur une note d'options rédigée après le lot 1 |
| P2 | Vérifier sur un vrai téléphone : les quatre fonctions mobiles appelées tôt, la modale d'ordre mobile, « Envoyer » avec le clavier ouvert (Q17) | Parties mobiles des lots 2 et 7 | Arnaud (téléphone) avec un protocole fourni |
| P3 | Navigateur Playwright du dépôt installé (`chromium_headless_shell-1217`), sans quoi aucune fixture ne tourne | Tous les lots | Accord d'Arnaud pour `npx playwright install chromium` |

## Lots

| Lot | Contenu (décisions) | Dépend de | Zones de test |
|---|---|---|---|
| 1 | Défauts et identité du personnage : H1.1, H1.2 (fuite du « ok » des Règles), H1.3 + R1, H1.4 + R1, H1.5, H1.6 | P3 | plateau, profil, forum, sous-forum, kramail |
| 2 | Modale d'ordre : H2.1 à H2.7, R2, pastilles (H2.5, Q1) | P2 (mobile), P3 | nouvelle suite modale d'ordre (fixture synthétique) |
| 3 | Palette et jetons : H5.1 à H5.7, Q1, Q2, R3, R7 ; valeurs par variante de DESIGN › Colors | P1 | report, plateau, forum, croix (16 variantes) |
| 4 | Typographie, proportions, boutons, rayons, espacements : H3.1, H3.2, H11.1, H11.2, H6.1 à H6.3, H8.2, H14.1 | P1, lot 3 | plateau, profil, forum, messages, kramail |
| 5 | Cartes de section mobiles et pastilles : H4.1, R6, H8.1, R3 (cloche, enveloppe) | lots 3 et 4 | sous-forum, forum, plateau, kramail |
| 6 | Forum : index refondu (maquette h12), « ••• » (H12.2), fil d'Ariane (H12.3, H12.4), correctif d'ancres `#msg` | lot 5 | forum, sous-forum, messages, menus-forums |
| 7 | Kramail mobile : onglets de dossiers (H13.1), « Envoyer » dans le flux (R4, fin de la barre fixe) | P2, lot 5 | kramail |
| 8 | Notifications : H14.1 à H14.3, popup 900×800 (R5) | lot 4 | report |
| 9 | Plateau et mobile : cartes de personnages (H7.1), cibles tactiles (H9.1), gouttières (H10.1) | P1, lot 4 | plateau, profil, croix, transitions |

## Règles communes à tous les lots

- Branche par lot depuis `feature/next`, dans un worktree isolé (`superpowers:using-git-worktrees`).
- Rouge avant, vert après, prouvé par `npm run test:zone -- <zone>` ou `npm run test:changed` ; `npm run test:all` une seule fois en fin de lot ; `npm run lint`.
- Chaque PR embarque `version.json` et le bundle régénéré par `npm run build`.
- Aucun accès scripté au site réel pour les tests ; fixtures synthétiques seulement.
- Push et ouverture de PR : avec l'accord d'Arnaud.
