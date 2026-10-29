---
type: epic
title: "Page d'accueil mobile"
parent: initiative-harmonisation-ux
covers: [CAP-10, CAP-6, CAP-5]
after: []
assignee: ""
risk: medium
---

# Page d'accueil mobile

## Description

Sur téléphone, l'accueil (`/` et `/accueil`) se lit comme les autres pages déjà reprises : aucun texte collé au bord, chaque bloc dans la même carte de section, des cibles qu'on touche du premier coup et des titres à la même taille qu'ailleurs. Demande d'Arnaud du 2026-10-29 : « La page d'accueil n'a pas été retravaillée pour mobile. » L'épopée reprend le report D9.4 (/accueil absent de `KR_PAGE_CLASSES`, donc sans `kr-marge-mobile`) et l'action A2 de la rétro 9 pour /accueil.

## Outcome

Arnaud ouvre Kraland sur son téléphone et trouve un accueil au même rendu que les pages de jeu, du forum et du kramail ; le signal est le Success signal de la spec, accueil compris.

## Requirements

- E10.1 (CAP-10) : sur mobile, aucun nœud texte visible de l'accueil ne commence à moins de 16 px du bord (`--kr-margin-mobile`, H10.1) ; reprend D9.4.
- E10.2 (CAP-10) : sur mobile, toute cible de l'accueil hors texte courant fait au moins 44×44 px (`--kr-touch-target`) ou la ligne entière est touchable (H9.1).
- E10.3 (CAP-6) : sur mobile, chaque bloc de l'accueil (bandeau d'information, actualités de `#player-header-section`, `ds_user` et « Jouer », section forum, compteurs `.kraland-metrics`, carte ministérielle) se présente dans la carte de section de DESIGN.md (en-tête de 48 px, titre 17 px gras couleur du texte, carte à 8 px des bords, contenu à 16 px, H4.1).
- E10.4 (CAP-5) : sur mobile, l'accueil suit l'échelle typographique : titres de section 17 px, noms et valeurs 15 px, détails 13 px, rien sous 12 px ; boutons d'au moins 44 px (H3.1, H6.2).
- E10.5 (CAP-10, CAP-6, CAP-5) : ce que l'accueil fait déjà reste : « Bienvenue » avant le nom, bouton `accueil-play-btn`, section `accueil-forum-section`, ordre mobile actuel des blocs (`order`), carrousel absent sur mobile (`#col-right` masqué) et masquable sur ordinateur (`kr-hide-carousel`) ; rendu ordinateur inchangé. Non-régression, sans couverture propre : compteurs en accent en sombre (H5.6, CAP-4, livré par l'épopée 3).

## Done when

1. E10.1 à E10.4 tiennent sur la fixture réaliste de l'accueil à 320, 375×667, 700 et 767 px, en Kraland clair et Empire Brun sombre, et la bascule 767 ↔ 768 tient dans les deux sens.
2. À 768, 1280, 1440 et 1920 px, le rendu de l'accueil est égal à la base ; E10.5 tient sur les deux supports.
3. Toute règle de couleur ajoutée ou réécrite est vérifiée dans les 16 variantes.
4. Le vrai /accueil, ouvert en lecture seule en émulation à 375×667, ne montre aucun écart à E10.1 à E10.4 ; aucune capture ni HTML brut dans le dépôt.
5. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert sur machine calme avec au moins un test par décision livrée, `npm run test:router` vert.

## Boundaries

Une page, une unité (la surcharge), un propriétaire : l'accueil connecté, sur mobile. Ordinateur hors périmètre, sauf pour vérifier qu'il ne change pas. Hors périmètre : la cloche et le chargement de `/report` (épopée 8), l'accueil déconnecté, les Non-goals de la spec. Aucun nouveau composant : l'accueil reprend la carte de section, l'échelle et les boutons existants.

## References

- parent — _bmad-output/initiative-harmonisation-ux/initiative-harmonisation-ux.md
- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-5, CAP-6, CAP-10 et Constraints
- ux — _bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md, Layout & Spacing (marge mobile, cartes de section, hauteurs), Typography, Components › Carte de section
- ux — _bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md, Pages secondaires (ligne Accueil), Responsive & Platform
- faits — _bmad-output/initiative-harmonisation-ux/ux-harmonisation/notes-implementation.md, Classes de page, Marges mobiles
- report — _bmad-output/initiative-harmonisation-ux/deferred-work.md, D9.4
- rétro — epic-plateau-confort-mobile/epic-plateau-confort-mobile-retrospective.md, F2 et A2
- spike modèle — epic-plateau-confort-mobile/spike-releve-des-pages-mobiles-hors-fixtures-marge-cibles-et-carte-plan.md
- code — `kraland-theme.css` : bloc ordinateur `@media (min-width: 768px)` de l'accueil (~l.11179-11472, carrousel compris, à laisser intact), largeurs de colonnes en ≥ 2560 et 3840 px (~l.11477-11495, ordinateur), bloc mobile (~l.11501-11807, réordonnancement `order` et `#col-right` masqué en `!important`), carte de section de 5.1 (`body.mobile-mode .panel-default:where(…)`, ~l.8101-8140), `html.kr-hide-carousel .carousel` (~l.1087) ; `kraland-userscript-template.js` : `KR_PAGE_CLASSES` (~l.307-320), `body.page-accueil` (~l.853, `/` et `/accueil` exacts), « Bienvenue » (~l.2127-2165), `Homepage:RightColumn` avec `accueil-play-btn` et `accueil-forum-section` (~l.2178-2215), `kr-hide-carousel` (~l.3813, 8785)
- tests — `tests/e2e/lib/marges.mjs` (9.1), `confort-mobile.mjs`, `cloche-notifications.mjs` (/accueil comme page hôte de la cloche, suite de l'épopée 8), `palette-nation.mjs` (`palette-nation-accueil.html`), `typographie-formes.mjs` (accueil synthétique en ligne), `tests/e2e/lib/router.mjs`
- constraint — AGENTS.md, Faits du site Kraland (`/report`, cloche) et Sécurité sur le site réel

## Notes

- Decision: (Arnaud, 2026-10-29) « La page d'accueil n'a pas été retravaillée pour mobile. » Nouvelle épopée 10 de l'initiative.
- Decision: inception en autonomie (2026-10-29), découpe donnée par la demande : 1 spike de relevé du vrai /accueil (375 et ordinateur) ; 2 fixture réaliste et suite e2e ; 3 refonte mobile, qui reprend D9.4 ; 4 Refactor sweep. Une seule lane, sans parallèle.
- Decision: balle traçante = entrée 2 (fixture, suite, zone du routeur, aide de mesure de 9.1), précédée du spike 1 parce qu'aucune fixture réaliste ne peut s'écrire sans relevé ; l'entrée la moins sûre est la 3 (découpe de la demande, 2026-10-29).
- Decision: pas de liste d'attentes dans la suite (validation du 2026-10-29 : ce serait un masque de test) ; l'entrée 2 livre la fixture, l'outillage et les fragments E10.5, verts sur la base ; l'entrée 3 écrit les fragments E10.1-E10.4, rouges sur la base puis verts.
- Assumption: la demande d'Arnaud tranche l'action A2 de la rétro 9 pour /accueil (la marge s'y applique) ; Staff et /help sur ordinateur restent à trancher hors de cette épopée.
- Assumption: covers = CAP-10 (marge « sur toutes les pages », cibles), CAP-6 et CAP-5 étendus à l'accueil ; la spec ne nomme pas l'accueil dans CAP-6, dont les épopées 4, 5 et 9 sont closes sans lui.
- Assumption: la carte de section, l'échelle et les boutons existants appliqués à l'accueil ne sont pas un nouveau composant au sens des Constraints ; un composant propre à l'accueil (par exemple une tuile de compteur) attend l'accord d'Arnaud.
- Assumption: l'accueil connecté est la cible ; le JS ne teste pas la session (`page-accueil`, `Homepage:RightColumn`), donc `kr-page-accueil` et `kr-marge-mobile` touchent aussi l'accueil déconnecté ; l'effet est accepté tant qu'il se limite à la marge, et l'entrée 3 vérifie que l'accueil déconnecté ne casse pas si le spike en relève la structure.
- Assumption: refonte mobile seule ; sur ordinateur, rendu égal à la base, vérifié à 768, 1280, 1440 et 1920 px.
- Assumption: l'accueil reçoit une classe de page sur `html` par `KR_PAGE_CLASSES` (`kr-page-accueil` et `kr-marge-mobile`, motif `^/(?:accueil)?$`, identique à `body.page-accueil`) pour que ses gardes s'écrivent en `:where(html.kr-page-accueil)` (P1, option 4) ; `body.page-accueil` reste pour le JS existant.
- Assumption: aucun bloc de l'accueil n'est un `.panel-default` et `a.accueil-play-btn` n'est pas un `.btn` : l'entrée 3 étend la liste commune de la carte de section de 5.1 quand un bloc s'y prête, sinon écrit des sélecteurs gardés `:where(html.kr-page-accueil)` avec les mêmes jetons ; « Jouer » reçoit les valeurs du bouton de 4.2 par ses propres sélecteurs.
- Assumption: l'ordre mobile actuel des blocs (« Jouer », Bienvenue, Forum, compteurs, actualités) est gardé (E10.5).
- Assumption: Arnaud n'a pas mis de lot 10 dans `lots-de-livraison.md` ; l'épopée 10 est hors lots, l'initiative le dit ; la spec n'est pas modifiée.
- Assumption: les fichiers des épopées 4 et 9 et la rétro 9, en revue, ne sont pas modifiés : la frontière (/accueil passe à l'épopée 10, l'épopée 9 garde le reste de CAP-10) est écrite ici, dans l'initiative et dans D9.4.
- Assumption: le spike 1 et l'entrée 3 sont hitl : le relevé et la vérification sur le vrai /accueil connecté ont besoin d'une session Kraland ouverte dans le Chrome dédié, absente lors du spike 9.3 ; l'agent fait le relevé et l'émulation sous le mandat de lecture d'Arnaud, Arnaud ouvre seulement la session.
- Assumption: la nouvelle fixture ne remplace pas `palette-nation-accueil.html` ni l'accueil synthétique de `typographie-formes.mjs` ; leur fusion est un candidat du sweep.
- Assumption: l'entrée 3 reste une seule entrée, comme la demande la découpe ; si le spike relève plus de blocs ou d'écarts qu'une session ne peut en reprendre, l'entrée 3 se re-découpe avant de partir (marge et classe de page, puis cartes, titres et cibles).
- Open question: les blocs de l'accueil mobile passent-ils tous en carte de section, carte ministérielle comprise, ou certains gardent-ils leur rendu ? Le spike propose ; les entrées 2 (fixture) et 3 (fragments E10.3) suivent la réponse d'Arnaud, sinon la proposition du spike. Le carrousel, absent sur mobile, n'entre en jeu que si Arnaud veut le faire réapparaître.
- Open question: l'ordre mobile des blocs change-t-il ? Par défaut l'ordre mobile actuel est gardé.
- Open question: la carte de section sur l'accueil (E10.3) et l'échelle (E10.4) dépassent DESIGN.md et EXPERIENCE.md ; faut-il l'accord d'Arnaud, ou un passage par `bmad-ux` ou `bmad-spec`, avant l'entrée 3 ?
- Open question: la demande d'Arnaud tranche-t-elle l'action A2 de la rétro 9 pour /accueil, alors que la rétro plaçait le relevé avant la décision ? Par défaut oui ; le spike 10.1 peut la rouvrir.
- Open question: le reste de A2 (forum Staff, /help sur ordinateur) et les pages secondaires de la question de l'épopée 4 (Événements, etc.) n'ont pas d'épopée responsable ; à trancher par Arnaud.
- Open question: ajouter une ligne 10 à `lots-de-livraison.md` ?
- Open question: la spec doit-elle nommer l'accueil dans CAP-6 (carte de section), ou E10.3 se requalifie-t-elle en reprise du composant de 5.1 sans CAP-6 dans `covers` ? À passer à `bmad-spec` si Arnaud le veut.
- Source conflict: constat « aucune suite ne couvre /accueil » vs code — `cloche-notifications.mjs` charge /accueil comme page hôte de la cloche, `palette-nation.mjs` et `typographie-formes.mjs` testent des fixtures synthétiques de l'accueil (couleurs, boutons, rayons) ; aucune ne mesure la mise en page mobile.
- Source conflict: « l'accueil n'a pas été retravaillé pour mobile » vs feuille — un bloc mobile `.page-accueil` existe (~l.11501-11807 : ordre des blocs, `#col-right` masqué, `accueil-play-btn`, `ds_user`, `accueil-forum-section`, `.kraland-metrics`, `#player-header-section`) ; il n'applique ni la marge, ni la carte de section, ni l'échelle. L'entrée 3 le retire ou le réécrit (P1).
- Source conflict: EXPERIENCE.md › Pages secondaires, ligne Accueil (seul change « en sombre, compteurs en accent ») et DESIGN.md › Carte de section (« Sert au jeu, au forum et au kramail ») vs E10.3 et E10.4, qui vont au-delà ; vient de la demande d'Arnaud du 2026-10-29.
- Waits on epic-plateau-confort-mobile because: `KR_PAGE_CLASSES`, `kr-marge-mobile` et l'aide de mesure `tests/e2e/lib/marges.mjs` (9.1).
- Waits on epic-cartes-pastilles because: carte de section mobile (5.1).
- Waits on epic-typographie-formes because: échelle typographique (4.5) et bouton de taille normale (4.2).
- Waits on epic-palette-nation because: contrôle du texte coloré dans les 16 variantes (`palette-nation`, 3.3) pour Done when 3.
- Touche epic-notifications : /accueil est la page hôte de `cloche-notifications.mjs` ; l'entrée 3 lance cette suite, sans changer la cloche.
- Decision: validation de `references/validate.md` faite sur le brouillon (2026-10-29), deux vérificateurs indépendants (Set et Dependencies sur l'épopée, Tree et Dependencies sur l'initiative) : numéros de ligne corrigés, balle traçante écrite, liste d'attentes retirée de l'entrée 2, carrousel testé à 1280 px seulement, relais avec 5.1 et 4.2 précisé, motif d'URL et règles du routeur nommés, contraste des 16 variantes ajouté au verify de 3, entrée 3 en hitl, prérequis 3.3 ajouté, H5.6 requalifiée en non-régression ; les points à trancher sont dans les Open question ci-dessus.
- Decision: (Arnaud, 2026-10-30, sur recommandation après le spike 10.1) le message du ministre revient sur mobile, en carte sous Bienvenue : nouvelle entrée 5, après 3 et avant le sweep 4 ; le carrousel reste masqué sur mobile. Le chevauchement de l'icône fa-medkit sur « Bug ? Problème ? » (ligne « A l'aide ! » du forum) est corrigé dans l'entrée 3.
