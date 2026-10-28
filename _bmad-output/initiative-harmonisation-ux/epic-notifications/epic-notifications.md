---
type: epic
title: "Notifications"
parent: initiative-harmonisation-ux
covers: [CAP-9]
after: []
assignee: ""
risk: medium
---

# Notifications

## Description

Le joueur lit son rapport sans effort et en voit davantage d'un coup : popup 900×800 sur ordinateur, date au-dessus du texte sur mobile.

## Outcome

Le rapport du jour se lit vite ; intent de CAP-9.

## Done when

1. Les critères success de CAP-9 tiennent ; aucun chargement de `/report` à l'avance (un GET marque tout lu).
2. La suite `report-non-lu` est mise à jour (filet non lu avec la date au-dessus).
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 8. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-9
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 8
- ux — EXPERIENCE.md, notifications ; mockups/key-notifications-mobile.html

## Notes

- Waits on epic-typographie-formes because: échelle typographique.
- Waits on: entrées 8.1 et 8.3 sur 4.1 (jetons `--kr-font-*` et `--kr-space-*`, construits) ; voir `tickets.toml`.
- Decision: cinq entrées (inception autonome, 2026-10-28) : 1 ligne de notification (H14.1, H14.2, balle traçante) ; 2 popup 900×800 par redéfinition d'`openReport` (R5, la moins sûre, hitl) ; 3 sélecteur à 16 px (H14.3) ; 4 Refactor sweep ; 5 captures de validation (hitl). Entrées chaînées (1, 2, 3) par collision sur `router.mjs`, `report-non-lu.mjs` et la section `/report` de la feuille.
- Decision: H14.1 n'a pas d'entrée propre : ses tailles (14, 15 et 13 px) vont dans l'entrée 1, qui réécrit déjà les mêmes règles ; une entrée seule serait plus petite que sa mise en place (2026-10-28).
- Decision: l'entrée 5 (captures de validation) est ajoutée parce que les rétros des épopées 5 (A10) et 6 (A8) constatent des captures jamais produites ; elle ne fait que vérifier, sans code (2026-10-28).
- Assumption: « sur ordinateur » se lit au clic par `isMobileMode()` (`body.mobile-mode`), pas par `innerWidth`, qui vaut 980 au tout début sur un vrai téléphone (H10). Sur mobile, la fonction native est appelée telle quelle.
- Assumption: la redéfinition d'`openReport` se pose sur `unsafeWindow` par un module InitQueue, après le `main.js` du site ; la fixture injecte le bundle sans bac à sable, d'où le constat hitl d'Arnaud sur son navigateur réel (entrée 2, `unknown`).
- Assumption: sur mobile, le filet non lu passe de `td:first-child` à la ligne `tr.bg-info` entière (review-faisabilite L2). Sur ordinateur, il reste sur la cellule de date. Le sort de la teinte de date à 14 % est tranché et consigné par l'entrée 1.
- Assumption: le fragment `fenetre` (600×600, rendu mobile) de `report-non-lu.mjs` est remplacé par le rendu ordinateur du popup 900×800. Le rendu mobile est vérifié à 375×667 et 767 px.
- Assumption: les fixtures existantes suffisent pour `/report` (`report-non-lu.html`). La cloche est testée sur une fixture nouvelle de page de jeu, avec l'extrait verbatim d'`openReport` tiré de `tests/e2e/vendor/parler/main.js`.
- Assumption: le report de 4.9 sur `padding-left: 10px` (`html.kr-page-report … td:first-child`) est repris par l'entrée 1, qui réécrit cette règle.
- Decision: le report de 5.4 (cloche et enveloppe invisibles menu fermé en bureau compact, 768 à 991 px, D12) n'est pas repris : il attend une décision d'Arnaud (rétro 5, A5). L'entrée 2 ouvre le popup 900×800 depuis ce menu aussi (2026-10-28).
- Decision: actions de rétro reprises comme règles communes de l'épopée (en-tête de `tickets.toml`) : rouge avant sur la base et contre-épreuve ; aucun masque sans condition de retrait atteignable (5 F4, 6 A2) ; boucle `test:zone`, puis un `test:all` sur le SHA exact (5 F2, F11) ; une seule section Result par plan (6 A6) ; reports numérotés D8.n (6 A7) ; transitions dans les deux sens (5 F12). Non reprises, car étrangères aux notifications : 5 A2, A4, A6, A9 et 6 A2 à A5, A9, A10. 5 A1 et 6 A1 (livraison) restent aux mains d'Arnaud.
- Open question: le Done when 3 (« PR fusionnée sur `feature/next` ») se lit-il comme un push sur `feature/next` ou comme une fusion vers main (rétro 6, A1) ? Il est gardé tel quel jusqu'à la décision d'Arnaud.
- Open question: sur un vrai téléphone, la cloche ouvre-t-elle un onglet ou un popup (Q17) ? Le mobile reste natif, donc rien n'en dépend dans cette épopée.
- Open question: les autres fenêtres sans barre de navigation (aperçu `help.php?p=prev`) ont-elles la même bande vide que `/report` ? L'entrée 3 les note sans les traiter.
- Decision: après la validation du brouillon (2026-10-28) : 3 attend 2 (collision sur `router.mjs`) ; le contrôle de 2 distingue cloche de la barre (≥ 768, menu replié ouvert de 768 à 991 px) et clone mobile (natif) ; 1 range les règles de `/report` dans leurs media queries ; 3 compense la marge en ligne du bandeau sans `!important` ; les captures mobiles de 5 ne montrent pas d'ouverture par popup.
