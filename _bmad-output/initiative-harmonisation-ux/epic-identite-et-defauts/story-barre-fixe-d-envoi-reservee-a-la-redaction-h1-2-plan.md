---
title: "Barre fixe d'envoi réservée à la rédaction (H1.2)"
ticket: 3
status: done
---

## Code Review

### 2026-10-20

Revue des commits a6ccd2e..5bf2984 (tickets 1.1 à 1.5) ; ce ticket : 2 patch, 1 defer.

- [x] [Review][Patch] Règle du pied de page restée globale : `body.mobile-mode:has(button.btn-primary.pull-right) footer.navbar-inverse` retire le pied de page collant sur Règles, où la barre n'existe plus ; à garder comme le relèvement de « Remonter en haut » [kraland-theme.css:13474]
- [x] [Review][Patch] Réserve de 60 px restée globale : `.form-group:last-of-type { padding-bottom: 60px }` laisse un vide sous le dernier champ des formulaires mobiles hors rédaction (Règles) [kraland-theme.css:9642]
- [x] [Review][Defer] Rédaction kramail sans `textarea#dest[name="c[3]"]` jamais classée page-kramail-compose, donc privée de la barre qu'elle avait avant [kraland-userscript-template.js:851] — deferred: non vérifié ; à trancher en listant les formulaires /kramail/post/… réels (les suites kramail-redaction sont vertes sur nouveau, répondre, répondre à tous, transférer)
