---
epic: epic-modale-ordre
date: 2026-10-24
verdict: accepted-with-open-items
criteria: declared
headless: true
---

# Rétrospective : Modale d'ordre lisible et sûre

## Epic summary

Épopée 2 de l'initiative Harmonisation UX (CAP-3). Sept tickets, dans l'ordre de construction de `tickets.py status` :

| Ref | Titre | status | state |
|-----|-------|--------|-------|
| 2.1 | Protocole et vérifications sur un vrai téléphone (P2) | done | done |
| 2.2 | Modale d'ordre : fixture, suite et module actif sur les deux supports | built | review |
| 2.3 | Blocages et avertissements en tête, jamais repliés ; seule l'aide se replie | built | review |
| 2.4 | Coût, durée et potentiel en pastilles au-dessus des boutons | built | review |
| 2.5 | Croix de fermeture lisible | built | review |
| 2.6 | « Valider » en couleur de nation sur mobile et onglet actif lisible | built | review |
| 2.7 | Refactor sweep | built | review |

- `pending_tickets` : vide. Tous les tickets sont finis.
- Tickets encore à `built` (finis par le build, pas encore déclarés faits) : 2.2 à 2.7.

### Plages par plan

Baselines ordonnées par l'historique (`git log`). La dernière plage est coupée au dernier commit de l'épopée.

| Ticket | Plage | Commits de code | Remarque |
|--------|-------|-----------------|----------|
| 2.1 | `71d2acd..94ae014` | aucun (protocole seul) | |
| 2.2 | `94ae014..440a9d7` | `91399c1` | plus `b536d79`, `aa15130`, `440a9d7` (documents BMad) |
| 2.3 | `440a9d7..ae45a71` | `ae45a71` | |
| 2.4 | `ae45a71..061fd4a` | `061fd4a` | |
| 2.5 | `061fd4a..c974f20` | `c974f20` | coupe : la plage brute jusqu'à `2b46ef4` contient l'épopée 3 (`8a3ae88` à `8855469`), exclue |
| 2.6 | `2b46ef4..d754964` | `d754964` | `b3b5233` (rétro de l'épopée 3) exclu |
| 2.7 | `d754964..225a26c` | `225a26c` | fin = HEAD, déduite |

### Inventaire des preuves

- Disponibles :
  - fichier d'épopée ;
  - exigences de l'initiative (CAP-3) et spec ;
  - `tickets.toml` ;
  - les 7 plans ;
  - le protocole P2 et ses résultats ;
  - `revue-manuelle.md` et `deferred-work.md` ;
  - la rétro précédente (`epic-identite-et-defauts`) ;
  - les commits.
- Aucun fichier d'histoire (story file) : les entrées n'ont pas été tirées.
- `git_evidence.py` : il tourne et liste les commits. Son champ `files` est une liste, pas un dictionnaire comme le lisait le script d'analyse de cette rétro. Le volume par fichier vient donc de `git show --numstat` sur les 6 commits de code. Portée resserrée en conséquence.
- Journaux de session non consultés. L'analyse des leçons de processus repose sur les plans (Review Triage Log, Implementation Notes) et sur `revue-manuelle.md`, pas sur les échanges.

## Findings

### Vues agrégées

**A1. Volume et taille (vérifié, sain).** Variation nette sur les 6 commits de code (`git show --numstat`) :
- `kraland-theme.css` : +200 / −176, soit +24 ;
- `kraland-userscript-template.js` : +184 / −110, soit +74 ;
- `tests/e2e/modale-ordre.mjs` : +1 526 / −135 ; le fichier fait aujourd'hui 1 461 lignes.

Le CSS et le JS restent quasi stables : chaque ticket a retiré des règles (pastels 9d, `.kraland-action-footer`, `.kr-alert-toggle`, `makeAlertCollapsible`, `formatFooterAsBadges`). La suite est le seul fichier qui grossit vraiment. Elle reste structurée en fragments (`mobile`, `bureau`, `largeurs`, `seuil`, `variantes`). Disposition : accepter tel quel ; surveiller la suite si l'épopée 4 l'étend.

**A2. Surcharges au lieu de retraits, contre la règle P1 option 4 (constaté).** L'en-tête de `tickets.toml` impose : « chaque entrée retire ou réécrit les règles `.bootbox-confirm` qu'elle remplace […] sans les surcharger ». Or la section 9h (`kraland-theme.css:2167-2189`) bat les anciennes règles par la spécificité et `!important`, sans les retirer :
- `(0,5,2)` contre `body.mobile-mode .bootbox.modal .modal-footer .btn-primary { flex: 2 !important }` (l.7690-7694) ;
- `(0,9,3)` pour l'onglet actif.

Les règles battues sont toujours là : `flex: 1 !important` l.7685 et l.7028. La revue du 2.6 avait renvoyé leur retrait au nettoyage 2.7 (plan 2.6, Review Triage Log #3 ; `deferred-work.md`, dernière entrée). Le plan 2.7 ne les reprend pas : ni le Code Map ni les Tasks n'en parlent. L'entrée de `deferred-work.md` reste sans `status`. Le report s'est perdu entre deux tickets.
- Instance : différer. Ces règles servent encore aux confirmations Bootbox hors ordre sur mobile ; leur retrait demande un ticket qui vérifie ces modales.
- Prévention : un ticket de nettoyage de fin d'épopée doit d'abord lister les entrées de `deferred-work.md` qui le visent, et inscrire chacune dans son plan comme traitée ou rejetée.

**A3. Deux jeux de repères pour la même modale (décision acceptée).** Il y a deux jeux de repères :
- le socle `kr-order-modal` / `kr-order-form` (template l.8995-9146) ;
- la chaîne mobile historique `kraland-*`, avec `transformOrderModalStructure` (l.9436) et `enhanceCharacterModal` (l.9697).

Ils cohabitent, avec deux observateurs de modales (`initCharacterModalMobile` l.9157, enregistré deux fois sur mobile, et `watchOrderModalsOfBody` l.9138). La décision est consignée au plan 2.2 (Implementation Notes : ne pas changer le rendu mobile existant). De plus, `enhanceOkButton` (l.9577) garde son nom alors qu'il ne pose plus que `kr-btn-secondary-subtle` (plan 2.7). Disposition : accepter (décision tracée). Ce n'est pas une dette nouvelle de cette épopée, et l'épopée l'a réduite.

**A4. Écart spec / réalisation : place des alertes (à réconcilier).** Le code range les alertes juste sous le `h3` du formulaire (`arrangeOrderAlerts`, template l.9028-9029 ; commentaire CSS 9e l.2026-2027). Or trois documents disent encore « sous le titre de l'ordre (h4) » :
- les Notes de l'épopée (`epic-modale-ordre.md`, ligne « Assumption: Q5 … Q25.2 ») ;
- la description de l'entrée 3 dans `tickets.toml` ;
- `revue-manuelle.md` l.77.

Le changement vient du ticket 2.4 (plan 2.4, Review Triage Log, high). Il est consigné dans `revue-manuelle.md` l.71, qui contredit donc la l.77 du même fichier. Disposition : réconciliation proposée (voir les actions).

**A5. Écart spec / réalisation : critère P2 (décision humaine).** Done when 2 demande « P2 fait sur un vrai téléphone, résultats consignés, avant la partie mobile ». Constats :
- Seul le point E (kramail, hors modale) a été vérifié (`protocole-p2-vrai-telephone.md`, Résultats).
- Les points B (Dormir) et C (« Valider » de Parler au-dessus du clavier), qui portent sur la modale, n'ont pas été vérifiés sur téléphone. Ils sont supposés identiques à E par décision d'Arnaud (plan 2.1, 2026-10-23).
- Les parties mobiles de 2.2 à 2.5 ont été construites avant P2, sur une décision prise en autonomie et encore « à confirmer » (Notes de l'épopée ; `revue-manuelle.md` l.75).
- Le critère de l'entrée 6 (« chaque écart P2 sur la modale a un test ou une ligne Decision: dans l'épopée ») n'a pas de ligne `Decision:` dans le fichier d'épopée. La décision vit dans le plan 2.1 et dans le « Always » du plan 2.6 (l.28).

Disposition : accepter (une décision humaine couvre P2) ; ajouter la ligne `Decision:` manquante (action).

### Lentilles sur le diff (passe en ligne, bmad-review non invoqué)

Portée resserrée : `bmad-review` n'a pas été invoqué (consigne : il écrit des fichiers). Les lentilles adversariale, cas limites et lacunes de vérification ont été appliquées en ligne. Elles ont porté sur le socle JS (template l.8987-9180) et les sections CSS 9e à 9h (l.2024-2189), en pesant les frontières entre tickets. Les fixtures et les autres hunks de la suite ont seulement été parcourus.

**L1. Cas limites du socle (vérifié, sain).**
- `updateAjax` du site remplace tout le `innerHTML` de `#ajax-order`. Le harnais réel `tests/e2e/vendor/parler/main.js:92` le fait, et la suite le simule (`modale-ordre.mjs:199`). Le bloc `kr-order-alerts` d'un ordre précédent ne peut donc pas rester affiché sur le suivant.
- `showOrderCosts` et `applyOrderModal` réagissent à leurs propres mutations, mais sortent sans rien écrire quand rien ne change (template l.9087, l.9115-9120). Pas de boucle.

Aucun constat.

**L2. Frontière 2.3 / 2.4 (traitée).** Le ticket 2.4 a déplacé le bloc d'alertes du 2.3 (du `h4` au `h3`) pour garder l'avertissement de Dormir entier à l'ouverture à 375 × 667. La contre-épreuve « alertes sous le h4 » est rouge (12 FAIL, plan 2.4). C'est une bonne prise de frontière entre deux tickets. Seule la trace documentaire n'a pas suivi (A4).

**L3. Frontière 2.6 / hors ordre (acceptée).** Retirer le vert et le bleu de `.bootbox-confirm` change aussi le « OK » et l'onglet actif des confirmations hors ordre sur mobile. C'est contraire au critère du plan 2.6 (« hors `.kr-order-modal` inchangé »). L'effet a été accepté au titre de H5.1, consigné dans `revue-manuelle.md`, et couvert par un contrôle HORS_ORDRE (plan 2.6, Review Triage Log #1). Disposition : accepter (écart enregistré, ne plus le signaler).

**L4. Lacune de vérification : démarrage réel (différé, suivi).** Au vrai `document-start`, `trackOrderModalViewport` (template l.9164), la chaîne mobile et `enableModalBackdropClick` ne s'installent pas, à cause de la garde `if (document.body)` (l.9175). Seul le socle est rattrapé au `DOMContentLoaded` (plan 2.2, Review Triage Log, hors périmètre). C'est le backlog 6, toujours `backlog`. `trackOrderModalViewport` est précisément le module qui garde « Valider » de Parler visible au-dessus du clavier : le point C de P2, non vérifié sur téléphone. Disposition : différer (backlog 6) ; ce lien mérite d'être connu au moment de prioriser.

**L5. Carte des zones du skill incomplète (mineur).** La ligne « Modale d'ordre » du skill `tester-kraland-css` (`SKILL.md:22`, les deux copies sont identiques) ne cite ni la croix (2.5), ni « Valider » ou l'onglet actif (2.6), ni l'optgroup (2.7). Le plan 2.5 le note (« ligne de zone non complétée, hors plan »). Le routage reste conforme (`test:router`, plans 2.5 à 2.7). Disposition : différer, à corriger au prochain passage sur le skill.

### Points forts confirmés par les preuves

- Rouge avant / vert après et contre-épreuves sur bundles mutés, à chaque ticket de code. Par exemple : 35 FAIL avant 2.2, 103 avant 2.3, 63 avant 2.4, 41 avant 2.5, 41 avant 2.6, et 18 contrôles optgroup rouges avant 2.7 (plans, Implementation Notes).
- La revue rapide a trouvé un vrai défaut de production : le socle était inactif au `document-start` (plan 2.2, high). Il a été corrigé avec une fixture qui injecte le script avant `<body>`.
- Le test instable de la croix (`deferred-work.md`, ticket 3.8) a été repris et stabilisé par 2.7 : vert 3 fois sur 3, entrée marquée traitée.
- Outil des 16 variantes (`tests/e2e/lib/variantes.mjs`) livré par 2.3 et repris par l'épopée 3.

## Behavior verification

Rejoué le 2026-10-24 sur le bundle de HEAD (`225a26c`), fixtures seulement. Ni site réel, ni Chrome 9222/9223.

- `node tests/e2e/modale-ordre.mjs` : 358 contrôles, tous passent (sortie 0). Couvre 375, 767, 768, 769, 1280, 1440 et 1920 px, les 16 variantes à 375 et 1280 px, le contenu remplacé, le chargement Ajax et le démarrage avant `<body>`.
- `node tests/e2e/parler-viewport.mjs` : 78 ok, 0 FAIL.
- `npm run test:all` non relancé (consigne). Dernière preuve consignée : 6066 ok, 0 FAIL, machine calme (plan 2.7, Result).
- Site réel : vérifié par l'orchestrateur pour 2.2 à 2.5 (lecture seule, 375 et 1280 px, Kraland clair et Empire Brun sombre ; captures hors dépôt indiquées dans chaque plan). Aucune vérification sur le site réel pour 2.6 et 2.7 (plans : pas de mandat).

## Previous-retro follow-through

Rétro précédente : `epic-identite-et-defauts/epic-identite-et-defauts-retrospective.md` (épopée 1 dans l'ordre `epics`).

1. Onglet de section mobile actif via `krActiveGameSection`, avec un test (agent, backlog). **Livré, non clos** : backlog 2 à `built` / `review`.
2. `applyCharacterIdentity` et les `$` d'un nom (agent, backlog). **Livré, non clos** : backlog 3 à `built` / `review`.
3. Tests de CAP-1 : Cybermonde, « messages », zones (agent, backlog). **Livré, non clos** : backlog 4 à `built` / `review`.
4. Vérifier les deux constats différés (Arnaud, puis agent). **En partie** : backlog 5 à `built`. Sous-chemins infirmés ; rédaction kramail encore ouverte (`deferred-work.md`, « Résultat de l'exploration backlog 5 »).
5. Plan avec `baseline_revision` dès la réintégration (agent). **Tenu** : les 7 plans de cette épopée ont un `baseline_revision`.
6. Validation visuelle à 1440 et 1920 px tracée dans le plan de chaque ticket d'interface (agent). **En partie** : la suite automatique couvre 1440 et 1920 px (fragment `largeurs`, ticket 6 compris). Les plans 2.2 à 2.5 citent 1440 une fois chacun, mais pas les plans 2.6 et 2.7 (`grep -c 1440`). Aucune validation visuelle manuelle à ces largeurs n'est tracée ; celles du site réel sont à 375 et 1280 px.

## Action items

Toutes ces actions sont des propositions. Arnaud décide ce qui s'exécute.

1. **Réconciliation de spec (A4)** : remplacer « sous le titre de l'ordre (h4) » par « juste sous le titre de l'ordre (h3), avant les caractéristiques et les onglets ». À faire à trois endroits :
   - les Notes de `epic-modale-ordre.md` ;
   - la description de l'entrée 3 de `tickets.toml` ;
   - `revue-manuelle.md` l.77 (à fusionner avec la l.71).

   Responsable : agent, après accord d'Arnaud sur le placement (`revue-manuelle.md` l.71).
2. **Réconciliation de spec (A5)** : ajouter dans les Notes de l'épopée une ligne `Decision:`. Elle reprend la décision d'Arnaud du 2026-10-23 (P2 réduit au point E ; B et C supposés identiques ; « Valider » reste dans le flux). Elle satisfait ainsi le critère de l'entrée 6. Responsable : agent, via `bmad-ticket`.
3. **Remédiation (A2)** : ouvrir un ticket de backlog pour retirer ou réconcilier les règles mobiles Bootbox battues par 9h :
   - `flex: 2 !important` l.7691 ;
   - `flex: 1 !important` l.7685 et l.7028 ;
   - l'onglet actif `bg-elevated` de MODAL PERSONNAGE MOBILE.

   Le ticket vérifie les confirmations hors ordre sur mobile. Il ajoute ensuite un `status` à l'entrée correspondante de `deferred-work.md`. Responsable : agent.
4. **Leçon de processus (A2)** : le plan d'un ticket « Refactor sweep » commence par la liste des entrées de `deferred-work.md` qui le visent, chacune marquée traitée ou rejetée avec sa raison. Responsable : agent, épopées suivantes.
5. **Remédiation (L5)** : compléter la ligne « Modale d'ordre » du skill `tester-kraland-css` (croix, « Valider », onglet actif, optgroup) dans les deux copies, puis vérifier avec `diff -r`. Responsable : agent.
6. **Vérification (Done when 4, suite de l'action 6 précédente)** : faire une validation visuelle de la modale finale (après 2.6 et 2.7) sur le site réel, en lecture seule, modales annulées. Cibles : 1280, 1440, 1920 px et 375 × 667, Kraland clair et Empire Brun sombre, avec des captures hors dépôt. Responsable : Arnaud (mandat), puis agent.
7. **Livraison (Done when 3)** : pousser `feature/next` (32 commits d'avance sur `origin/feature/next`) et ouvrir ou mettre à jour la PR. Responsable : Arnaud (accord requis).
8. **Priorisation (L4)** : en triant le backlog 6, noter qu'il conditionne le point C de P2 (« Valider » de Parler au-dessus du clavier sur un vrai téléphone). Responsable : Arnaud.

## Acceptance verdict

**accepted-with-open-items** (verdict machine), sur des critères déclarés (Done when de l'épopée). Il n'y a pas de décision humaine sur ce verdict.

- `pending_tickets` vide : aucun ticket inachevé.
- Done when 1 (critères CAP-3 sur fixture, après changement d'ordre et contenu chargé plus tard) : **tenu**. 358 contrôles rejoués verts ; chaque critère success de CAP-3 a ses contrôles (libellés, alertes collées et non repliées, « ? Aide », pastilles, « Valider » en paire arm, croix 3:1 et 44 × 44, onglet actif 4,5:1 sans bleu).
- Done when 2 (P2) : **tenu par décision humaine**. Le protocole n'a été exécuté qu'en partie ; Arnaud a clos le ticket 2.1 (plan 2.1). La construction mobile avant P2 reste une décision en autonomie à confirmer.
- Done when 3 : bundle et `version.json` régénérés à chaque ticket, `test:all` vert (6066 ok, plan 2.7). **Ouvert** : les commits sont sur `feature/next` en local, pas poussés, sans PR (`git status -sb` : ahead 32). C'est voulu (Notes : push et PR soumis à Arnaud), mais la fusion n'a pas eu lieu.
- Done when 4 : largeurs et variantes vérifiées sur fixtures synthétiques (aucune capture HTML brute dans le dépôt). Site réel à 375 et 1280 px pour 2.2 à 2.5 seulement. **Ouvert** : validation visuelle à 1440 et 1920 px, et validation de 2.6 et 2.7 sur le site réel.
- Constats non bloquants suivis : A2, A4, A5, L4, L5.

## Open questions

- Arnaud confirme-t-il le placement des alertes sous le `h3` et des pastilles dans le pied de la modale (`revue-manuelle.md` l.71) ? Un refus rouvrirait 2.3 et 2.4.
- Arnaud confirme-t-il la construction des parties mobiles de 2.2 à 2.5 avant P2 (`revue-manuelle.md` l.75) ?
- Les règles mobiles Bootbox battues par 9h (A2) doivent-elles disparaître (ticket dédié) ou rester comme style des confirmations hors ordre ?
- Les tickets 2.2 à 2.7 sont à `built` / `review` : leur passage à « fait » revient à `bmad-ticket`, sur confirmation d'Arnaud.

## Assumptions

Choix faits sans l'utilisateur (mode headless) :

- Épopée prise de l'invocation : dossier `_bmad-output/initiative-harmonisation-ux/epic-modale-ordre`, résolu par `tickets.py status <dossier>`.
- `pending_tickets` vide : aucune confirmation demandée.
- Rétro précédente : `epic-identite-et-defauts`, première épopée de l'ordre `epics`. La rétro de `epic-palette-nation` (épopée 3, construite en partie avant 2.6) n'a pas été suivie, car elle est postérieure dans l'ordre.
- Plage 2.5 coupée à `c974f20` et commit `b3b5233` exclu de 2.6 : ils appartiennent à l'épopée 3.
- Volume par fichier tiré de `git show --numstat`, car le script d'analyse de cette rétro lisait mal la sortie de `git_evidence.py`.
- Lentilles de revue appliquées en ligne sur une portée resserrée, sans `bmad-review` (consigne de l'appelant).
- Journaux de session non consultés.
- `npm run build` et `npm run test:all` non relancés (consigne). Suites rejouées une à une sur le bundle commité.
- Verdict machine `accepted-with-open-items`, rendu sans décision humaine. Done when 2 est compté comme tenu sur la décision d'Arnaud du plan 2.1. Done when 3 et 4 sont comptés comme ouverts, sans être bloquants.
- Les actions 1 à 8 sont toutes proposées, aucune n'est appliquée.
