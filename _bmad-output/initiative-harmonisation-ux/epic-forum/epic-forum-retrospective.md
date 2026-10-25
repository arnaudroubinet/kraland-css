---
epic: epic-forum
date: 2026-10-25
verdict: rejected
criteria: declared
headless: true
---

# Rétrospective : forum, activité et repères

## Epic summary

- Épopée : `_bmad-output/initiative-harmonisation-ux/epic-forum` (id 6 de l'initiative, `after` sur 5.2). Elle couvre CAP-7 (`spec-harmonisation.md`).
- Tickets (`tickets.py status`) : les sept sont `built` (state `review`) et `pending_tickets` est vide. Aucun n'est encore « fait ».
  - 6.1 L'index du forum reprend la présentation du sous-forum ;
  - 6.2 Index mobile dans la carte de section, flèche et « premier non lu » ;
  - 6.3 Un seul fil d'Ariane Catégorie › Forum › Sujet ;
  - 6.4 En-tête de sujet mobile dans Communauté, Débats et Staff ;
  - 6.5 Bouton « ••• » commun au forum et au kramail ;
  - 6.6 Ligne de forum : icône lue dans la liste latérale, dernier message à droite sur ordinateur ;
  - 6.7 Refactor sweep (reports de l'épopée, règles mortes, masques de test).
- État du 6.1 : plan `built`, base `81512a3`, revue quick (4 low corrigés), `test:all` 4347 ok. La validation visuelle d'Arnaud est en attente (captures `.tmp/captures/validation-6-1-index-forum/`), avec cinq décisions : Staff exclu, colonnes Sujets/Messages gardées sur ordinateur, graisse 400 du nom, bouton du titre, `fa-comments-o`. Le plan n'a pas de section Result.
- Plages de commits (un commit par ticket, aucune fusion) :
  - 6.1 `416f148`, `43d40ec`, `39fdd19`, `8b2152f`. Plage coupée : elle est entrecoupée des épopées 2 à 5, et deux commits hors épopée, `fd6b000` et `bcc7710` (« fix: align forum root with category indexes », `plan-racine-forum.md`), touchent aussi `forum-index` ;
  - 6.2 `0523d7f..5042afd` ; 6.3 `5042afd..ef0e4d4` ; 6.4 `ef0e4d4..1134ef9` ;
  - 6.5 `1134ef9..6ba0838` ; 6.6 `6ba0838..810901f` ;
  - 6.7 `810901f..4dde75f`, plage inférée jusqu'à `HEAD`.
- État git : `feature/next` = `origin/feature/next` = `4dde75f`, donc poussée. `origin/main` = `d5b38e5` ne contient aucune des épopées 3 à 6. Aucune PR. Seul fichier non suivi : une capture d'écran Vivaldi hors périmètre.
- Volume (`0523d7f..4dde75f`) :
  - `tests/e2e/forum-activite.mjs` : +1857/−72, nouvelle suite de 9 fragments ;
  - `tests/e2e/lib/variantes.mjs` : +425/−16, 1145 lignes. Il porte 73 constantes `TICKET`/`AVANT`, contre 56 à la rétro 5 ;
  - template JS +132/−176 (net −44) ; `kraland-theme.css` +131/−82 ;
  - `typographie-formes.mjs` +79/−42, `forum-index.mjs` +73/−20, `cartes-pastilles.mjs` +48/−21, `sous-forum.mjs` +15/−1, `palette-nation.mjs` +13/−5, `kramail-redaction.mjs` +9/−9 ;
  - `lib/router.mjs` +44/−15, `router.test.mjs` +87/−11 ;
  - quatre fixtures de sujet ajoutées (Communauté, Débats, Staff, sujet fermé) ;
  - `revue-manuelle.md` +182, `deferred-work.md` +39, skills +5/−4 dans les deux copies ;
  - le bundle ne change que de 2 lignes par commit (CSS inliné et version).
- Preuves disponibles : le fichier d'épopée, les sept plans (revue quick en Review Triage Log, rouge avant et contre-épreuves consignés), les commits, `revue-manuelle.md` et `deferred-work.md`. Aucun journal de session.

## Findings

Les points déjà en attente d'Arnaud dans `revue-manuelle.md` ne sont pas repris comme découvertes. Ils sont reliés au verdict dans « Acceptance verdict » (F11 les regroupe pour mémoire).

### F1. Pas de PR ni de fusion vers main, libellé du Done when 3 toujours ambigu

- Source : `git branch -vv` (`feature/next` à jour avec l'origine, `origin/main` à `d5b38e5`) ; « Done when » n° 3 de `epic-forum.md` (« PR fusionnée sur `feature/next` »).
- Constat : le push est fait, la clause « PR fusionnée » n'est pas remplie. Le triage de la rétro 5 par l'orchestrateur conteste cette lecture : le critère nomme `feature/next`, donc le push suffirait. La leçon amont de F1 (rétro 5) demandait de réécrire le libellé ; ce n'est pas fait pour l'épopée 6, ni pour les suivantes.
- Disposition : **fix now** (action A1). Arnaud tranche la lecture.
- Leçon amont : un Done when de livraison dit « fusionnée sur main » ou « poussée sur feature/next », jamais « PR fusionnée sur feature/next ».

### F2. Les masques de test continuent de croître, sans ticket d'extinction

- Source : `tests/e2e/lib/variantes.mjs` (73 constantes `TICKET`/`AVANT`, 56 à la rétro 5) ; plan 6.7, Plan Change Log (T2) ; `forum-activite.mjs` l.146-149, `forum-index.mjs` l.117-120, `typographie-formes.mjs` l.1900-1916.
- Constat : l'A4 de la rétro 5 (plan d'extinction) n'est pas faite. L'épopée 6 ajoute six jeux de masques (`ACTIVITE_TICKET62`, `REPERES_FIL_TICKET63`, `REPERES_ENTETE_TICKET64`, `REPERES_PLUS_TICKET65`, `REPERES_LIGNE_TICKET66`, `EXCEPTION_TICKET66`), puis `FLECHES_TICKET67` au sweep. Les bases partagées restent figées : `forum-index` `81512a3`, `cartes-pastilles` `21fed8d`, `typographie-formes` `d953969`/`62fd47d`/`00b0786`, `palette-nation` `6685df5`. Leurs conditions de retrait nomment « le ticket A4 », qui n'existe pas encore. Chaque nouveau ticket qui touche une zone partagée ajoute donc un masque de plus.
- Disposition : **fix now** (action A2, ticket A4).

### F3. Bases de `forum-activite` alignées sur `810901f`, donc avant 6.7

- Source : `tests/e2e/forum-activite.mjs` l.84, 613, 894, 1224, 1479 (`COMMIT_AVANT`, `_FIL`, `_ENTETE`, `_PLUS`, `_LIGNE` = `'810901f'`) ; plan 6.7, Review Triage Log constat 2.
- Constat : le sweep réaligne les cinq bases sur `810901f`, le commit du 6.6. Le 6.7 change ensuite les flèches de tri (6 px à 4 px), ce qui oblige `ouvrir` à poser `FLECHES_TICKET67` sur ces bases. La condition de retrait est un réalignement sur un SHA qui contient 6.7, confié explicitement à cette rétro. Contrairement aux bases partagées, ces cinq bases sont propres à l'épopée 6 : rien n'empêche de les réaligner sur `4dde75f`.
- Disposition : **fix now** (action A3).

### F4. Frontière 6.5 et kramail : non-régression auto-référente

- Source : `tests/e2e/kramail-redaction.mjs` l.35-44 (`bundleAvant()` lit `origin/feature/next`) ; commit `6ba0838` (`kramail-redaction` +9/−9) ; plan 6.5 (glyphe du kramail de 18 px à 14 px).
- Constat : le 6.5 change le bouton du kramail et adapte `kramail-redaction`. Depuis le push, `origin/feature/next` vaut `HEAD` : le contrôle compare le bundle à lui-même et ne peut plus échouer. L'A2 de la rétro 5 a été rejetée par l'orchestrateur ; `cybermonde-carte` est dans le même cas. Le sweep 6.7 a retiré `PLUS_AVANT` parce qu'il était inerte, et laissé `ESPACEMENT_AVANT`, inerte aussi.
- Disposition : **defer** (action A9). Arnaud tranche, puisque l'orchestrateur a déjà rejeté une fois.

### F5. Frontière 6.4/6.5 : couches du sujet non mesurées (D13), cartes de forum hors fixtures (D7)

- Source : plan 6.5, Plan Change Log (constat 1 : barre ouverte à `z-index: 991` ; barre « Envoyer » fixe en z-index 90 « non mesurée ») ; `deferred-work.md` l.97 (D7) et l.151 (D13).
- Constat : la barre du message ouvert passe à 991 pour rester au-dessus du `.dropdown-backdrop` (990). La barre « Envoyer » fixe du sujet, à 90, n'a jamais été mesurée face à elle : aucune fixture n'a à la fois des messages et cette barre. Sur mobile, la barre ouverte d'un message en bas d'écran peut donc la recouvrir. D7 : un accordéon ou une modale `.panel-default` sur une page `/forum/*` prendrait le fond et le rayon de la carte de section. Le sweep 6.7 a reclassé les deux points « faisable sur une page dérivée en mémoire » et les a reportés ici.
- Disposition : **fix now** (action A4). Dériver une fixture de sujet en mémoire (barre « Envoyer » ajoutée, `.panel-group` et `.modal` injectés), sans nouvelle fixture brute.

### F6. Course des infobulles en peau coupée mobile : audit, sans garde générique

- Source : `deferred-work.md`, « Reports du ticket 6.6 » (deux faux FAIL au `test:all` du 6.6) ; plan 6.7 (report marqué traité sous l'étiquette D14) ; `forum-index.mjs`, fragment `peau-coupee`.
- Constat : le 6.6 a contourné la course par `debut: true` dans `forum-activite#ligne`. Le 6.7 a marqué le report traité après un simple audit, sans changer de suite. `forum-index#peau-coupee` retire les attributs d'infobulle, et `palette-nation` ne lit que des couleurs. Les autres contrôles en peau coupée mobile injectent encore à l'apparition de `<body>` : la cause de fond reste, et un faux FAIL peut revenir au prochain `test:all` chargé.
- Disposition : **defer** (action A5).

### F7. Frontière 6.1/6.3 : l'index change sans validation d'Arnaud

- Source : plan 6.3 (« ⏪ » retiré à l'index, repli « Catégorie », contrôle de `cartes-pastilles` passé à `<=`) ; plan 6.1 (validation visuelle en attente) ; commits `fd6b000` et `bcc7710`.
- Constat : le 6.3 retire « ⏪ » de l'index sans accord d'Arnaud, alors que l'index du 6.1 attend encore sa validation visuelle. Deux commits hors épopée, de même sujet, ont aussi modifié la racine du forum pendant la plage du 6.1. L'index qu'Arnaud validera n'est donc plus celui des captures du 6.1. Le passage d'un contrôle de `cartes-pastilles` de `===` à `<=` affaiblit aussi la garde de l'épopée 5.
- Disposition : **defer** (question pour Arnaud, action A10).

### F8. Couverture des fixtures : HRP, Débats et Staff

- Source : plan 6.2 (index RP servi sur les chemins `/forum/hrp` et `/forum/debats`) ; plan 6.4 (structure de Staff supposée, accès refusé) ; Done when 1.
- Constat : le Done when 1 vise RP, HRP, Communauté et Débats. Il n'existe aucune fixture d'index HRP ni Débats : le contenu RP est servi sur leurs chemins. Ce qui dépend du chemin est donc couvert, pas ce qui dépend du contenu. Pour Staff, la fixture de sujet est construite sur une structure supposée.
- Disposition : **defer** (action A8).

### F9. Identifiants D en collision

- Source : `revue-manuelle.md` l.326-328 (D12, D14, D15 : rappels du 5.6) ; plan 6.7 et `deferred-work.md` (D12, D14, D15 du sweep) ; `epic-forum.md` (« D14 » pour `span.tagforum`, appelé D10 par le sweep).
- Constat : D12, D14 et D15 désignent deux séries de points différents. Le premier D12 vise le bureau compact, le second les liens du sujet perdus sur mobile. `span.tagforum` porte deux numéros. Une décision d'Arnaud sur « D14 » peut viser le mauvais point.
- Disposition : **fix now** (action A7).

### F10. Hygiène des plans

- Source : plan 6.2 (sections « Review Triage Log » et « Result » en double, la première au gabarit) ; plan 6.1 (pas de section Result) ; plan 6.7, Verification (« `grep -c '!important'` → 3290 », alors que le Change Log donne 3281 après le retrait).
- Constat : le défaut F2 de la rétro 5 se répète au 6.2. La section Verification du 6.7 garde un compte d'avant la correction de revue.
- Disposition : **fix now** (action A6).

### F11. Écarts de CAP-7 en attente d'Arnaud (pour mémoire)

- Source : `revue-manuelle.md`, sections 6.1 à 6.7.
- Points :
  - compteurs sur ordinateur : colonnes Sujets/Messages gardées, alors que CAP-7 demande « N sujets · N messages » ;
  - Staff : D2, D3, D5 ;
  - D6, coins de la racine en sombre ;
  - D10, `span.tagforum` ;
  - D11, correctif d'ancres limité à `#flap` ;
  - D12, liens « lien » et « liste des messages » perdus sur mobile (6.4) ;
  - harmonisation du sous-forum ; Q27.5, Q27.6, O1 ;
  - option écrite au 6.7 : annuler T2 (flèches à 4 px) et reporter D4, au lieu du masque `FLECHES_TICKET67`.

### F12. Preuves contournées ou incomplètes

- Source : plans 6.2 à 6.7 (`test:changed` contourné, « `variantes.mjs` élargit au total ») ; Manual checks « à vérifier par toi » de chaque plan ; `tests/e2e/durations.json` (dernier changement `15f5874`, 2026-10-18).
- Constat : `test:changed` ne sert plus, puisque tout ticket qui touche `variantes.mjs` élargit au total. Aucune capture de validation n'a été produite, comme à la rétro 5 (A10). `durations.json` ne mesure ni `forum-activite` ni `forum-index` : ces fragments partent en tête, sans conséquence sur le résultat.
- Disposition : **defer** (action A8 pour les captures). Le contournement de `test:changed` est un effet direct de F2.

## Behavior verification

Contrôle uniquement par les fixtures Playwright locales, bundle commité de `4dde75f`, sans rebuild (arbre propre) :

- `KR_LOGDIR=/tmp/retro6/logs npm run test:zone -- forum-activite forum sous-forum` : exit 0, 2630 ok, 0 FAIL, résultat VERT.
  - Détail : forum-activite 889 (9 fragments), sous-forum 1110 (19), forum-mobile 375 (10), forum-index 150 (5), jeu-identite 106 (5).
  - Les comptes sont égaux à ceux du plan 6.7 (889, 150, 1110).
- `npm run test:router` : exit 0, « Routeur conforme ».
- `test:all` cité, non relancé : le dernier, sur `4dde75f`, est vert avec 13679 ok et 0 FAIL (source : orchestrateur).

Limites : le vert de `kramail-redaction` ne prouve rien sur la non-régression (F4). D7 et D13 ne sont couverts par aucune suite (F5). Aucune capture, aucun site réel, aucun Chrome 9222/9223.

## Previous-retro follow-through

Actions de `epic-cartes-pastilles-retrospective.md` :

- A1 Livrer les épopées 3 à 5 : **partiel**. Push fait jusqu'à `4dde75f`, sans PR ni fusion vers main (F1).
- A2 Bases non auto-référentes : **rejetée** par l'orchestrateur. `kramail-redaction` et `cybermonde-carte` lisent toujours `feature/next` (F4).
- A3 Plan 5.6 : **fait** par l'orchestrateur.
- A4 Extinction des masques des épopées 3 à 5 : **non fait**. Reportée explicitement à cette rétro, et six jeux de masques s'y ajoutent (F2).
- A5 Décisions sur CAP-6 : **en attente** d'Arnaud.
- A6 Barres de PV : **question posée**, sans réponse.
- A7 Done when 2 de l'épopée 5 : **fait**.
- A8 Épinglage des `after` : **partiel**. L'épopée 6 est épinglée sur 5.2 ; l'épingle de l'épopée 7 sur 5.1 n'est pas vérifiée ici.
- A9 Pages mobiles hors fixtures : **reporté** à l'épopée 9 ; D7 en relève (F5).
- A10 Captures de validation : **non fait** (F12).
- A11 Actions non prouvées de la rétro 4 : **non prouvé**.

## Action items

Toutes les actions sont des propositions ; Arnaud n'en a décidé aucune.

- A1. Livraison : trancher la lecture du Done when 3 (push suffisant ou fusion vers main). Puis réécrire ce libellé dans les épopées restantes. Si fusion : une PR à la fois, avec `version.json` et bundle repris de la base, puis `test:all` sur le SHA exact. Responsable : Arnaud (décision), agent (préparation).
- A2. Ticket A4 : éteindre les masques des épopées 3 à 6 et `FLECHES_TICKET67` sur les bases partagées (`forum-index` `81512a3`, `cartes-pastilles` `21fed8d`, `typographie-formes` `d953969`/`62fd47d`/`00b0786`, `palette-nation` `6685df5`). Pour chaque masque : réaligner la base, retirer le masque, prouver le vert, puis faire une contre-épreuve. Les conditions de retrait écrites dans `variantes.mjs` renvoient déjà à ce ticket.
- A3. Réaligner les cinq bases de `forum-activite` (`COMMIT_AVANT`, `_FIL`, `_ENTETE`, `_PLUS`, `_LIGNE`) de `810901f` sur un SHA qui contient 6.7 (`4dde75f`). Retirer ensuite la pose de `FLECHES_TICKET67` dans `ouvrir`. Contre-épreuve : `KR_SCRIPT` = bundle de `810901f` doit passer au rouge.
- A4. D7 et D13 sur une page dérivée en mémoire :
  - D13 : sujet mobile avec la barre « Envoyer » fixe (z-index 90) et une barre de message ouverte (991). Vérifier par `elementFromPoint` que « Envoyer » reste atteignable, ou documenter le recouvrement ;
  - D7 : `.panel-group` et modale `.panel-default` injectés sur une page `/forum/*`. Vérifier qu'ils ne prennent pas le fond et le rayon de la carte de section.
- A5. Garde générique contre la course des infobulles en peau coupée mobile : injecter en début de document (`debut: true` ou équivalent) dans tous les contrôles concernés, au lieu de la correction locale du 6.6. Prouver par un `test:all` sous charge.
- A6. Plans : retirer la paire de sections au gabarit du plan 6.2, ajouter un Result au plan 6.1, et corriger dans la Verification du 6.7 le compte `!important` (3281).
- A7. Renuméroter les identifiants D de façon unique dans `revue-manuelle.md`, `deferred-work.md` et `epic-forum.md`, par exemple préfixés par l'épopée (`D5.12`, `D6.12`).
- A8. Couverture et captures : fixtures synthétiques d'index HRP et Débats, puis captures de validation des épopées 5 et 6 pour Arnaud (1280, 1440, 1920 et 375×667, Kraland clair et Empire Brun sombre), avec l'index actuel du 6.1.
- A9. Bases auto-référentes de `kramail-redaction` et `cybermonde-carte` : reposer la question à Arnaud, puisque l'orchestrateur a rejeté l'A2 de la rétro 5. Proposition : SHA figé.
- A10. Décisions d'Arnaud sur F7 et F11 : « ⏪ » retiré de l'index, contrôle `<=` de `cartes-pastilles`, compteurs sur ordinateur, Staff, D6, D10, D11, D12, sous-forum, Q27.5, Q27.6, O1, et l'option « annuler T2 » du 6.7.

## Acceptance verdict

**rejected** (critères déclarés : « Done when » de `epic-forum.md`).

1. Critères success de CAP-7 pour RP, HRP, Communauté et Débats, sur les deux supports : **largement tenus** par les tests sur fixtures. Restent : la réserve sur les compteurs sur ordinateur (colonnes gardées au lieu de « N sujets · N messages », F11), des index HRP et Débats sans fixture propre (F8), et les liens du sujet perdus sur mobile (D12). Toutes ces décisions sont en attente d'Arnaud.
2. Sur mobile, la flèche et « premier non lu » mènent au message, ancre `#msg` conservée : **tenu en émulation** (`forum-activite#ancres` et `#parcours`). L'essai sur un vrai téléphone (H10) reste à faire.
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `test:all` vert avec au moins un test par décision : **non tenu au sens littéral**.
   - Bundle et `version.json` sont régénérés à chaque commit.
   - `test:all` est vert sur `4dde75f` (13679 ok, 0 FAIL), et chaque décision a son fragment dans `forum-activite.mjs`, `sous-forum.mjs` ou `forum-index.mjs`.
   - Il n'y a pas de PR (F1).
4. Vérifié à 1280, 1440, 1920 et 375×667, Kraland clair et Empire Brun sombre, fixtures synthétiques : **tenu par les tests**, sans validation visuelle humaine (F12).

Le critère 3 décide du rejet, avec la même lecture que les rétros 3 à 5. Si Arnaud retient la lecture de l'orchestrateur (le push sur `feature/next` suffit), les preuves soutiennent **accepted-with-open-items**. Les open items seraient alors F2, F3, F4, F5 et F6, plus les décisions de F11. Cette révision appartient à Arnaud.

## Open questions

- Le Done when 3 est-il rempli par le push sur `feature/next`, ou faut-il une fusion vers main (F1) ?
- Le retrait de « ⏪ » de l'index par le 6.3, décidé sans accord, est-il gardé (F7) ?
- Compteurs sur ordinateur : colonnes gardées, ou « N sujets · N messages » comme le dit CAP-7 ?
- Faut-il garder le masque `FLECHES_TICKET67`, ou annuler T2 (flèches à 4 px) et reporter D4 ?
- La base de `kramail-redaction` et `cybermonde-carte` doit-elle être figée sur un SHA, malgré le rejet de l'orchestrateur (F4) ?
- Staff : alignement sur les autres index (D2, D3, D5), ou exclusion maintenue ?

## Assumptions

- Épopée résolue par le chemin `_bmad-output/initiative-harmonisation-ux/epic-forum` donné par l'appelant. La rétro précédente est `epic-cartes-pastilles`.
- `pending_tickets` est vide : les sept tickets sont traités comme terminés côté construction, 6.1 compris malgré sa validation visuelle en attente.
- Verdict `rejected` posé sans décision humaine (mode headless), sur le seul critère 3 lu au sens littéral.
- Toutes les actions sont des propositions.
- Plage de 6.7 inférée jusqu'à `HEAD` (`4dde75f`). Plage de 6.1 reconstituée à partir de ses quatre commits.
- Aucun journal de session disponible. Les preuves sont les plans, les commits, `revue-manuelle.md` et `deferred-work.md`.
- Revue de diff à périmètre réduit : pas de `bmad-review` ni de sous-agent, sur consigne de l'appelant. J'ai appliqué moi-même, dans le fil, les lentilles adversarial, edge-case et verification-gap au diff `0523d7f..4dde75f` (template, `kraland-theme.css`, `tests/`). L'accent était mis sur les frontières entre tickets. Les commits du 6.1 n'ont été lus qu'à travers son plan.
- D7 et D13 n'ont pas été sondés en mémoire : ils restent en action (A4).
- Build non relancé : l'arbre est propre et le bundle commité est à jour.
- Pas de `test:all`, pas de site réel, pas de Chrome 9222/9223, pas de cloche ni de `/report`, pas de capture.
- Aucune écriture hors de ce fichier : ni statut, ni `tickets.py mark`, ni git.

---

Rapport : `_bmad-output/initiative-harmonisation-ux/epic-forum/epic-forum-retrospective.md`, verdict **rejected**, 10 actions proposées.
