---
title: 'Captures de validation des notifications pour Arnaud'
type: 'chore'
ticket: 5
created: '2026-10-29'
status: 'built'
baseline_revision: '49d31df729a872f8f4683960b915cb04abd5e69b'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les rétros des épopées 5 (A10) et 6 (A8) constatent des captures de validation jamais produites ; l'épopée des notifications (8.1 à 8.4) n'a pas encore les siennes pour la passe visuelle d'Arnaud.

**Approach:** Produire hors dépôt (`/Users/arnaud/kraland-css-captures/8.5/`), sur fixtures et réseau confiné, les captures de la cloche et de la page des notifications en Kraland clair et Empire Brun sombre : mobile 375×667 (cloche et pastille, lecture avec date au-dessus et filet), ordinateur 1280, 1440 et 1920 px (cloche de la barre) puis rendu de la page en 900×800 (popup) ; les lister dans `revue-manuelle.md` avec ce qu'elles montrent, verdict d'Arnaud à sa passe finale.

</frozen-after-approval>

## Implementation Notes

Route oneshot : aucune ligne de code produit, un script jetable hors dépôt et une section de `revue-manuelle.md`.

- Captures produites par un script jetable hors dépôt (`/tmp/kr85-script/captures.mjs`) plutôt que par l'ajout de `KR_SHOTS` à `cloche-notifications.mjs` : aucune suite n'est modifiée, donc pas de `test:router` ni de lint de tests à relancer. Le script reprend le patron d'ouverture des suites (`confineNetwork`, routes Bootstrap, injection par `addInitScript`, `krReady`).
- Surprise : les fixtures ne chargent pas Font Awesome, si bien que la cloche n'y a pas de glyphe. Font Awesome 5.6.3 (version du site, comme `KR_FA_DIR` dans `messages-v3.mjs`) a été téléchargé dans `/tmp/kr85-fa/` depuis use.fontawesome.com et servi par une route, pour les captures seulement. Le navigateur reste confiné.
- Surprise : sélecteur de personnage à 9,5 px sur ordinateur, par la règle globale `.form-control.form-control { font-size: .95rem }` sur la racine à 10 px de Bootstrap. Défaut antérieur, signalé dans `revue-manuelle.md`.
- Fichiers modifiés : `_bmad-output/initiative-harmonisation-ux/revue-manuelle.md` (section 8.5), ce plan. `npm run build` a régénéré `kraland-userscript-main.user.js` et `version.json` (horodatage seulement, source inchangée).

## Review Triage Log

Passe 1 (revue quick indépendante, 2026-10-29) : 4 constats.

| # | Constat | Verdict | Action |
|---|---------|---------|--------|
| 1 | Verdict d'Arnaud non consigné | false | Attendu pour un ticket hitl : le verdict viendra à la passe finale d'Arnaud. Le plan s'arrête en `in-review`. |
| 2 | `/tmp` vidé au redémarrage, alors que la passe d'Arnaud viendra tard | low | Emplacement imposé par le mandat (`/Users/arnaud/kraland-css-captures/8.5/`). Mise en garde ajoutée dans `revue-manuelle.md` (reprise par le même patron). |
| 3 | 8.5 absent de « Validations visuelles en attente » | medium | patch : entrée ajoutée à la liste. |
| 4 | Mesures citées absentes de `journal.json` ; haut du bandeau à 375 px non mesuré | medium | patch : `mesure.mjs` mesure aussi le haut du bandeau et le bord des onglets ; sortie de `mesure.mjs` et `mesure2.mjs` dans `/Users/arnaud/kraland-css-captures/8.5/mesures.txt`, citée dans la section. Bandeau à 16 px à 375 et à 900 px avec la peau, 10 px sans. |

## Result

Constructeur ; revue quick faite, verdict visuel d'Arnaud à sa passe finale. Base `49d31df729a872f8f4683960b915cb04abd5e69b`, worktree `wt/8.5`, rien de commité.

Clôture (orchestrateur, 2026-10-29) : revue indépendante faite, correctifs appliqués, commité (d486c1f, 443ebc4) et fusionné sur `feature/next` ; `test:all` vert contenant l'épopée : 18074 ok, 0 FAIL, sur `d8c8777`.

- `npm run build` : validation passée (bundle et `version.json` régénérés ; seul l'horodatage change).
- 22 captures dans `/Users/arnaud/kraland-css-captures/8.5/`, toutes ouvertes et contrôlées. Kraland clair et Empire Brun sombre ; mobile 375×667 (cloche et pastille, page des notifications en vue et en page entière) ; ordinateur 1280, 1440 et 1920 (barre, et recadrage de la cloche) ; popup 900×800.
- Confinement : seules des requêtes vers les logos `img7.kraland.org` ont été tentées, et refusées ; le seul `/report` touché est l'URL de la fixture, servie par une route. Aucun site réel, aucun Chrome 9222 ni 9223, aucun clic.
- Défauts signalés dans `revue-manuelle.md` : sélecteur `.form-control` à 9,5 px sur ordinateur (règle globale ~l.642, antérieure à l'épopée), dates en dents de scie dans le popup (5 et 12 px), lignes à lien plus hautes sur mobile (épopée 9), contenu collé au bord gauche (épopée 9), icône collée au libellé des onglets à 375 px, pastille collée à la cloche sur ordinateur.
- Aucune suite de tests modifiée : `test:router`, `lint:css` et `lint:js` sont sans objet. `test:all` et `test:changed` n'ont pas été lancés (interdits par le mandat).
