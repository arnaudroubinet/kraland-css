---
title: 'Vérification sur vrai téléphone et captures de validation pour Arnaud'
type: 'chore'
ticket: 9
created: '2026-10-29'
status: 'in-review'
baseline_revision: 'd8c877793a2cd10f4276a10f5e38ae545b10b62e'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - 'epic-modale-ordre/protocole-p2-vrai-telephone.md'
  - 'epic-forum/epic-forum-retrospective.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les points D (réponse au forum) et E (rédaction kramail) du protocole P2 ne sont pas vérifiés clavier ouvert sur le code fini après le sweep 7.10. Les pages du kramail n'ont pas de captures de validation face au forum (rétro 6, A8).

**Approach:** Décision d'Arnaud : « tu testes via émulateur, ça me suffit. Quand tout sera fini (tous les tickets), je ferai une passe manuelle, pas avant. » L'agent émule D et E sur fixtures (375×667, `isMobile`, `hasTouch`, densité 2 et 3, clavier simulé à 350 px), sans rien envoyer. Il produit hors dépôt les captures du kramail face au forum (1280, 1440, 1920 et 375×667, Kraland clair et Empire Brun sombre). Il consigne le tout dans le protocole P2 et dans `revue-manuelle.md`. La passe sur vrai téléphone et la validation visuelle d'Arnaud restent ouvertes.

</frozen-after-approval>

## Boundaries & Constraints

**Always:** fixtures et réseau confiné ; bundle actuel (`kraland-userscript-main.user.js`, inchangé entre d8c8777 et 5d42ab5) ; captures et scripts hors dépôt (`/Users/arnaud/kraland-css-captures/7.9/travail/`) ; tout écart décrit avec ses mesures.

**Never:** modifier `kraland-theme.css`, le template, le bundle ou `tests/` ; écriture git ; `npm install` ; `test:all` ; site réel ; Chrome 9222/9223 ; capture du site ou HTML brut dans le dépôt ; corriger un écart trouvé.

## Implementation Notes

- Script jetable `/Users/arnaud/kraland-css-captures/7.9/travail/de.mjs` (modes `de`, `captures`, `planches`). Il reprend le patron d'ouverture de `kramail-theme.mjs` (`confineNetwork`, routes Bootstrap/jQuery de `tests/e2e/vendor`, injection au `DOMContentLoaded`, `krReady` + `THEME_READY`) et les helpers `lib/` (`navigateur`, `settle`, `variantes`, `parallele`). La mesure reprend `MESURER_ENVOYER` (fragment `envoyer`) et `redaction-defilement`.
- Clavier simulé de deux façons : viewport réduit à 375×350 (`reduit`), ou bande visible de 350 px qui glisse dans une mise en page de 667 px (`visuel`, sans vrai `visualViewport`) ; `repos` à 667 px pour comparer.
- Texte saisi localisé par un miroir du champ ; curseur amené en bas de la zone visible ; attente d'un événement scroll avant chaque mesure (`kr-btt-visible` dépend de l'événement).
- Sonde d'envoi : `submit` intercepté, `form.submit` et `requestSubmit` remplacés, requêtes non GET et navigations relevées.
- Captures : Font Awesome 5.6.3 servi en local (copie `/tmp/kr85-fa/` du ticket 8.5), captures en page entière, planches HTML rendues en PNG.
- Ajout de l'orchestrateur (A1 de la rétro 8) : le script de 8.5 (`/Users/arnaud/kraland-css-captures/8.5/captures.mjs`, `mesure.mjs`, `mesure2.mjs`) est copié dans `/Users/arnaud/kraland-css-captures/7.9/travail/notif/` et pointé sur le dépôt principal. Il est relancé vers `/Users/arnaud/kraland-css-captures/7.9/notifications/`.

## Verification

**Commands:**
- `node /Users/arnaud/kraland-css-captures/7.9/travail/de.mjs de` (bundle actuel) : 32 ok / 4 FAIL sur 36 cas. Les 4 FAIL sont l'écart E1 (Répondre, `reduit`, deux variantes, densités 2 et 3).
- `KR_SCRIPT=/Users/arnaud/kraland-css-captures/7.9/travail/base-f48a01f.user.js node /Users/arnaud/kraland-css-captures/7.9/travail/de.mjs de` (contre-épreuve, avant 7.7) : 12 ok / 24 FAIL. Tout le kramail est rouge : barre fixe de 56 px sur le texte saisi. Le forum reste vert, déjà dans le flux.
- `node /Users/arnaud/kraland-css-captures/7.9/travail/de.mjs captures` : 56 PNG, aucune erreur de page, aucune requête refusée hors logos et GitHub.
- `node /Users/arnaud/kraland-css-captures/7.9/travail/de.mjs planches` : 8 planches.
- `node /Users/arnaud/kraland-css-captures/7.9/travail/notif/captures.mjs`, puis `mesure.mjs` et `mesure2.mjs` : 22 PNG, `journal.json` et `mesures.txt`.

## Result

Partie agent faite ; **partie hitl ouverte** : passe sur vrai téléphone (D et E) et validation visuelle des captures par Arnaud, à sa passe finale. Le `verify` du ticket n'est donc pas encore rempli.

- D (réponse au forum) : 12 cas sur 12 conformes en émulation. E (rédaction kramail) : 20 sur 24. « Envoyer » est atteignable et ne couvre pas le texte, aucun envoi.
- Écart E1 : « Remonter en haut » (36×44 px, x 331–367) couvre de 15 px le bord droit du texte saisi (contenu jusqu'à x 346), clavier ouvert avec viewport réduit, page défilée de plus de 400 px. Décrit dans `revue-manuelle.md` (« Ticket 7.9 »), non corrigé ; bogue à ouvrir ou non, selon Arnaud.
- Captures A8 : `/Users/arnaud/kraland-css-captures/7.9/` (56 PNG) et `/Users/arnaud/kraland-css-captures/7.9/planches/`. Notifications reprises : `/Users/arnaud/kraland-css-captures/7.9/notifications/` (22 PNG). Sur le bundle actuel, trois défauts de 8.5 ont disparu.
- Fichiers modifiés : `epic-modale-ordre/protocole-p2-vrai-telephone.md` (lignes D et E, section 4), `revue-manuelle.md` (entrée « Validations visuelles en attente », section « Ticket 7.9 »), ce plan.
- Pas de revue indépendante à ce stade.
