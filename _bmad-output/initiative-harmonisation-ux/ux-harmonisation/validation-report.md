# Rapport de validation — kraland-css

- **DESIGN.md :** `_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md`
- **EXPERIENCE.md :** `_bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md`
- **Généré le :** 2026-10-19T20:31:18+02:00

## Verdict global

La paire est solide sur la traçabilité : chaque règle cite sa décision, les 29 composants portent les mêmes noms dans le même ordre des deux côtés, toutes les références `{…}` se résolvent et les contrastes annoncés se vérifient au centième. La couche couleur ne se transpose pas encore telle quelle : valeurs par variante absentes pour les nuances dérivées de H5.2 et pour l'info sombre, convention `-dark` qui se résout mal (un cas à 2,96:1), liens et survols non couverts alors que H5.6 et H5.2 les touchent. S'y ajoutent les questions bloquantes Q1 et Q2, Q13 qui rouvre H1.2 et H6.2, et quelques règles absentes du memlog.

Les relectures de faisabilité et du joueur déplacent le risque de la couleur vers la modale d'ordre et le mobile réel. La faisabilité conclut « réalisable en surcharge, avec réserves » : un blocage (aucune source du nom du personnage sur Personnage et Employés), deux règles contraires aux points de rupture d'AGENTS.md (cartes de personnages, popup `/report` de 600 px) et une cascade à 48 % de `!important` à neutraliser avant toute règle transverse. Le joueur conclut « bonne base, pas encore prête à implémenter telle quelle » : l'alerte de la modale d'ordre peut être hors de vue au moment de « Valider », le « non lu » éclate en plusieurs couleurs, « une couleur vive signale un état » ne tient pas dans six nations sur huit, et le mobile n'a été vu qu'en émulation. Les deux relectures se rejoignent sur le repli de la première `.alert` de la modale et sur « Envoyer ». Le rapprochement avec la mission confirme la couverture : 9 exigences sur 11, 2 partielles, aucune absente.

Après les décisions Q1, Q2 et R1 à R7 et la passe de correction, aucune question bloquante ne reste. Sur les 22 constats critiques ou importants, 8 sont résolus par une décision, 8 corrigés dans les documents et 6 restent ouverts en questions non bloquantes (Q8, Q11, Q17, Q21, Q22, Q23). Sur les 105 constats gradués : 13 résolus, 39 corrigés, 46 ouverts, 3 corrigés en partie, 4 non traités, tous faibles. Chaque constat est classé d'après son point principal ; les restes sont notés à côté. « Corrigé » veut dire traité dans les documents : pour la faisabilité, c'est souvent un préalable consigné dans « Notes pour l'implémentation », pas un code déjà changé.

## Verdicts par catégorie

- Couverture des parcours (Flow coverage) — strong
  - Vérifié : les besoins des sources (boucle de jeu d'`etude-ux.md` : plateau, ordres, déplacement, personnage, forum, kramail, notifications) et les 4 parcours retenus au memlog. Chaque étape de la boucle a au moins un parcours ; chaque parcours a son protagoniste (Arnaud, qui joue Nerys), des étapes numérotées, un climax et un chemin d'échec.
  - Après la passe de correction : intitulés des parcours repris du memlog, avertissement de Dormir suivi jusqu'à « Valider » au parcours 1 (R2), variante « dernier message dans un autre sujet » au parcours 2, dépendances à Q17 écrites aux parcours 1 et 3. Les surfaces sans parcours restent à confirmer (Q33).
- Complétude des jetons (Token completeness) — thin
  - Vérifié : 82 couleurs (hex à 6 ou 8 chiffres), 11 typographies, 3 rayons, 9 espacements, 15 composants ; toutes les références `{…}` résolues ; paires clair/sombre ; valeurs par variante ; cibles de contraste. Les ratios du tableau « Contrastes de référence », les teintes H5.3 et les primaires foncées dérivées ont été recalculés : exacts.
  - Après la passe de correction : chaque jeton de couleur désigne la variable CSS de son rôle, résolue par variante et par mode ; trois tables donnent les valeurs des 16 variantes (couleur de nation et texte coloré, encre d'action, teintes, alerte info et ombre) ; nouveaux jetons `text-accent`, `text-nation`, `action-*` et `btn-shadow`. Toutes les références des deux spines se résolvent (contrôle par script de cette synthèse). Restent ouverts : le fond des alertes de blocage et d'avertissement (Q3), la formule de l'info sombre (Q4).
- Couverture des composants (Component coverage) — adequate
  - Vérifié : 29 lignes dans DESIGN « Components » et 29 dans EXPERIENCE « Component Patterns », mêmes noms, même ordre ; règles de comportement rédigées ; composants nommés ailleurs présents dans le CSS.
  - Après la passe de correction : 30 lignes de chaque côté avec le composant **Lien** (R7), mêmes noms et même ordre (contrôle par script de cette synthèse) ; les 17 clés de composants du frontmatter sont toutes citées. Les éléments existants sans composant (pastille de niveau, bouton à icône, tuiles d'action du plateau mobile…) sont renvoyés à Q24 et Q30.
- Couverture des états (State coverage) — adequate
  - Vérifié : chaque surface de l'architecture (boucle de jeu, pages secondaires) contre les états attendus : vide, chargement, erreur, focus, accès refusé, texte trop long, survol. Le tableau couvre bien les états propres à la surcharge (non-lu, sections pliées, modale bloquée, croix, variantes, bascule à 768 px).
  - Après la passe de correction : nouveaux états (lu et non lu du kramail, une alerte ou plusieurs, nom inconnu sur Personnage et Employés, survol des liens, bascule à 768 px pendant une saisie) ; règle de la carte de personnage exprimée par la largeur de la carte. Noms longs (Q29) et forum sans dernier message (Q27) restent ouverts.
- Couverture des références visuelles (Visual reference coverage) — adequate
  - Vérifié : `mockups/` et `wireframes/` absents, `imports/` vide ; les 6 fichiers de `.working/` liés depuis les spines, chacun avec ce qu'il illustre ; « les documents priment sur les maquettes » dit une fois par spine ; aucun orphelin.
  - Après la passe de correction : quatre écrans clés ajoutés à la demande d'Arnaud (modale d'ordre, plateau, notifications et kramail mobiles), puis huit maquettes promues vers `mockups/` ; h07 et la synthèse restent dans `.working/`. Les 10 fichiers sont liés depuis les spines et tous les liens se résolvent (contrôle de cette synthèse). La couverture des surfaces sans maquette reste à confirmer (Q33).
- Surcharge et surspécification (Bloat & overspecification) — adequate
  - Vérifié : valeurs en pixels face aux jetons, reprises des sources, doublons entre spines, sections sans lecteur.
  - Après la passe de correction : les composants du frontmatter citent `{spacing.touch-target}` ; les questions ouvertes ne sont exposées qu'une fois. EXPERIENCE.md répète toujours des pixels (« 44 px » 15 fois, « 44×44 » 8 fois, « 15 px » 11 fois, « 34 px » 7 fois).
- Discipline d'héritage (Inheritance discipline) — adequate
  - Vérifié : `sources` d'EXPERIENCE (3 chemins, tous résolus) ; noms des étapes et des parcours face à `etude-ux.md` et au memlog ; glossaire ; noms de composants ; références de jetons ; les 75 entrées du memlog d'alors confrontées aux spines.
  - Après la passe de correction : Q13 tranchée par R4, intitulés des parcours repris du memlog, règles hors memlog marquées `[ASSUMPTION]` ou tranchées par Q1 et Q2. La proximité des couleurs d'état et de nation reste ouverte (Q21).
- Adéquation de la forme (Shape fit) — strong
  - Vérifié : DESIGN.md suit l'ordre canonique complet (Brand & Style → Colors → Typography → Layout & Spacing → Elevation & Depth → Shapes → Components → Do's and Don'ts). EXPERIENCE.md a ses 8 sections par défaut, « Responsive & Platform » (deux supports) et l'équivalent d'« Inspiration & Anti-patterns ». Sections inventées : « Variantes de nation » et « Questions ouvertes ».
  - Après la passe de correction : titre canonique « Inspiration & Anti-patterns » ; « Variantes de nation » fondue dans « Foundation » ; EXPERIENCE.md ajoute « Notes pour l'implémentation » (préalables relevés par la faisabilité) et garde « Questions ouvertes » (28 questions non bloquantes).

## Relectures supplémentaires

### Relecture de faisabilité en surcharge (`review-faisabilite.md`)

Question posée : la surcharge (CSS injecté et JS du userscript, sans toucher au HTML ni au CSS du site) peut-elle tenir chaque règle, et comment ? Lecture seule du CSS, du template, des fixtures et du memlog ; contrastes recalculés ; toute déduction sans observation au rendu est marquée « non vérifié ».

Verdict : **réalisable en surcharge, avec réserves.** Sur 43 décisions et propositions relues : 17 en CSS seul, 16 en CSS avec un appui du JS, 10 en JS, dont 5 qui restructurent le DOM. Un point bloque : le nom du personnage sur deux des cinq pages de jeu. Deux règles contredisent les points de rupture d'AGENTS.md. Le risque principal n'est pas une règle isolée, mais la cascade existante : 48 % de `!important`, des sections sans garde, des styles en ligne `!important` posés par le JS. La modale d'ordre est la zone la plus fragile. Conformes à AGENTS.md : aucun préchargement de `/report`, liste latérale native conservée, ordre DOM des pièces inchangé. Constats : 1 critique, 10 importants, 15 moyens, 15 faibles.

Après la passe de correction : le blocage est levé par R1 ; les deux conflits avec AGENTS.md disparaissent (R5, règle des cartes sur leur propre largeur) ; la cascade, les classes de page, le module de la modale, les ancres et les marges mobiles sont consignés comme préalables dans « Notes pour l'implémentation » ; la grille de 4 px reste à borner (Q11). Quatre constats faibles ne sont pas repris (L3, L4, L7, L8).

### Relecture joueur (`review-joueur.md`)

Relecture adversariale du point de vue d'un joueur de Kraland Interactif, sur ordinateur et sur mobile. Cadre respecté : corriger l'existant, aucun nouveau composant (les manques sont posés en questions), accessibilité limitée aux joueurs voyants ; les options écartées par Arnaud ne sont pas reproposées.

Verdict : **bonne base, pas encore prête à implémenter telle quelle.** Les documents suivent fidèlement le memlog et règlent de vrais irritants : texte de 10 à 11 px sur les pages de jeu mobiles, « Cancel / OK », aide illisible en sombre, bleu Bootstrap, alerte recouverte, icônes de 26 px. Trois zones restent fragiles : la modale d'ordre, cœur de la boucle, dont le seul garde-fou, l'alerte, peut être hors de vue au moment de « Valider » ; les couleurs d'état, où le « non lu » éclate et où « une couleur vive signale un état » se heurte aux couleurs de six nations sur huit ; le mobile, vu seulement en émulation. S'y ajoutent des trous de boucle : lire et répondre à un kramail, jouer plusieurs personnages, les tuiles d'action, les ordres à paramètres. Constats : 1 critique, 7 importants, 14 moyens, 9 faibles.

Après la passe de correction : R2 garde l'alerte sous les yeux, R3 réunifie le non-lu, R4 tranche « Envoyer ». Les trous de boucle et le mobile réel deviennent des questions ouvertes non bloquantes (notamment Q17 et Q21 à Q25). Q17 reste non bloquante, contre l'avis de cette relecture, mais devient un préalable à l'implémentation des règles mobiles de la modale et d'« Envoyer ».

### Rapprochement avec la mission (`reconcile-etude-ux.md`)

Étape « Inputs reconciled » de Finalize : la mission `etude-ux.md` comparée à DESIGN.md et EXPERIENCE.md, le memlog faisant foi (lu jusqu'aux maquettes de référence demandées).

Bilan : sur les 11 exigences, 9 couvertes, 2 partielles, aucune absente ; au détail (21 points), 18 couverts, 3 partiels (déplacement ; ratios et proportions ; cohérence d'une page à l'autre). Aucune idée de fond abandonnée. Un seul composant sans décision du memlog : la Croix directionnelle et pièces, qui existe déjà. Cette relecture ne grade pas ses écarts : ils sont listés avec son propre statut, hors des comptes par gravité. Après la passe de correction : 4 corrigés, 6 ouverts, 4 inchangés, 1 sans suite attendue.

## Constats par gravité

Statuts : résolu (décision du memlog), corrigé (traité dans les documents, vérifié), ouvert (question non bloquante), en partie, non traité. Chaque constat est classé d'après son point principal ; les restes sont notés à côté.

### Critique (3)

**[Grille › Complétude des jetons]** — Les nuances dérivées de H5.2 n'ont pas de valeur par variante (§ DESIGN › frontmatter, Colors)
- Constat : Le frontmatter ne portait que Kraland clair pour `primary-strong`, `highlight-reverse`, `info-bg` et `info-border` ; l'ombre des boutons n'était pas un jeton. Pour les 7 autres nations claires, ces nuances n'existaient qu'en prose ou en formule `[ASSUMPTION]`. En sombre, l'info n'avait aucune valeur. Le code qui reflète la spine ne pouvait pas produire ces valeurs.
- Correction proposée : Publier une table nation × nuance, en clair et en sombre ; trancher la base et les taux de l'info sombre.
- Résolution : **corrigé** dans la passe de correction : tables « Valeurs par variante » pour les 16 variantes et jeton `btn-shadow`, valeurs conformes aux exemples de la grille (Paladium clair : `highlight-reverse` `#d9e4dc`, `info-bg` `#fcfaf3`). La formule de l'info sombre (15 % et 30 % sur `bg-surface`) reste `[ASSUMPTION]` : Q4.

**[Faisabilité]** — C1. Nom du personnage : aucune source sur Personnage et Employés (§ DESIGN › Mini-profil, Panneau latéral du jeu ; H1.3, H1.4)
- Constat : Le titre natif du panneau latéral vaut le nom sur le plateau, le matériel et les bâtiments, mais « Personnage » sur `/jouer/perso` et « Employés » sur `/jouer/pnj` ; le JS écrit d'ailleurs « Personnage » en dur (L1203-1205). Un nom mémorisé depuis le plateau serait faux après un changement de personnage ; lire une autre page en arrière-plan ajouterait une requête au site.
- Correction proposée : Relever sur le HTML natif un élément qui porte le nom ou l'identifiant, puis (a) lire cette source, (b) mémoriser le nom par identifiant, ou (c) limiter H1.3 et H1.4 aux trois pages qui portent le nom. Préciser le sort d'un nom long dans le mini-profil.
- Résolution : **résolu** par R1 : le userscript reprend le dernier nom vu sur une page de jeu (`span.list-group-item.active`), mémorisé localement, titre natif en repli. Le relevé du memlog confirme l'absence du nom (0 occurrence). Restent ouverts : le nom d'un autre personnage du compte (Q23), le nom long (Q29).

**[Joueur]** — C1. Modale d'ordre : l'alerte peut être hors de vue quand le joueur valide (§ DESIGN et EXPERIENCE › Modale d'ordre ; Parcours 1)
- Constat : Depuis H2.3, l'alerte est le seul signal d'un ordre impossible ou risqué, puisque « Valider » reste actif. Deux mécanismes peuvent la cacher : le repli de « ? Aide », qui prend la **première** `.alert` sans distinguer aide et blocage ; le défilement, où l'alerte glisse sous les onglets collants pendant que les pastilles et « Valider » restent à l'écran. La lecture naturelle « je lis le coût, je valide » se fait sans l'alerte.
- Correction proposée : Écrire que seule l'aide se replie ; relever ce qui distingue aide et blocage ; garder l'alerte dans l'en-tête collant jusqu'à « Valider » ? Vérifier à 375×667 et sur l'ordre Parler ; ajouter au parcours 1 un échec « avertissement ».
- Résolution : **résolu** par R2 : alertes de blocage et d'avertissement fixées en haut du corps pendant le défilement, jamais repliées ; seule l'aide (`.alert-order`) se replie. Le parcours 1 suit l'avertissement de Dormir jusqu'à « Valider ». La vérification sur téléphone reste à faire (Q17).

### Important (19)

**[Grille › Complétude des jetons]** — La convention `-dark` se résout mal dans les composants (§ DESIGN › frontmatter (composants))
- Constat : Les jetons `-dark` portaient les valeurs d'Empire Brun sous des noms génériques. `button-standard.foreground-dark: '{colors.highlight}'` donnait l'accent de Kraland clair, 2,96:1 sur `#1e1a15`, au lieu de l'accent sombre de la nation ; `section-card.background-dark` donnait `#1e1a15` aux 8 nations sombres. Un résolveur de jetons, ou un agent qui suit le YAML, produisait des couleurs fausses dans 7 variantes sombres.
- Correction proposée : Déclarer que les jetons de rôle désignent la variable CSS du rôle, avec les hex dans les tables de variantes ; ou renommer les valeurs de référence et retirer les clés `-dark` des composants.
- Résolution : **corrigé** dans la passe de correction : jetons de rôle déclarés en tête du frontmatter ; plus aucune clé `-dark` dans les composants ; le suffixe `-dark` ne sert plus qu'aux valeurs communes aux 8 nations (bordures, états, jauges) ; le bouton standard passe par `{colors.text-nation}`.

**[Grille › Couverture des composants]** — Les liens n'ont aucune spécification (§ DESIGN › Components ; H5.6)
- Constat : En sombre, le survol des liens passe en primaire, ce que H5.6 interdit : 3,99:1 (Kraland), 2,56:1 (Empire Brun), 4,46:1 (Khanat) sur `bg-surface`. En clair, la primaire foncée de H5.2 ferait passer le survol des liens de Paladium de 12,06:1 à 3,23:1.
- Correction proposée : Ajouter une ligne « Lien » aux deux tables (repos, survol, focus), le survol des liens aux cas de H5.6 et au tableau des contrastes ; traiter Paladium clair.
- Résolution : **résolu** par R7 : liens en `{colors.text-accent}` au repos et au survol, soulignés au survol, focus en **Anneau de focus**. Composant **Lien** dans les deux tables, liens parmi les cas de H5.6, ligne `text-accent` au tableau des contrastes (5,31 à 13,34:1).

**[Faisabilité]** — H1. Modale d'ordre : le JS actuel ne peut pas porter H2.3, H2.4 et H2.5 (§ DESIGN › Modale d'ordre ; EXPERIENCE › Q17)
- Constat : Les fonctions qui marquent la structure, replient l'aide et créent les pastilles ne tournent qu'en mobile (L9025-9028, L9149-9151, L9217-9219). Elles passent une seule fois, 150 ms après l'insertion de la modale, alors que le contenu arrive en Ajax et change quand le joueur choisit un autre ordre. Les observateurs ne sont posés que si `document.body` existe à l'`init()` : c'est le risque Q17, qui touche aussi l'ordinateur.
- Correction proposée : Un module InitQueue commun aux deux supports, idempotent, relancé par un observateur du `.bootbox-body` ; traiter Q17 comme bloquante pour H2.
- Résolution : **corrigé** dans la passe de correction : « Notes pour l'implémentation › Modale d'ordre : module à revoir » consigne le constat ; le choix des moyens revient à l'implémentation. Q17 reste non bloquante, mais préalable aux règles mobiles de la modale.

**[Faisabilité]** — H2. Alerte, aide et titre de l'ordre ne sont pas situés dans le DOM natif (§ DESIGN › Modale d'ordre ; EXPERIENCE › Parcours 1)
- Constat : Le JS replie derrière « Aide » la **première** `.alert` de la modale (L9153), quelle qu'elle soit : une alerte de blocage placée avant l'aide disparaîtrait, contre H2.3. Le « titre de l'ordre » n'a pas d'élément désigné ; « ? Aide » n'existe qu'en mobile ; aucune fixture ne reproduit une modale d'ordre native.
- Correction proposée : Une fixture synthétique fidèle de deux ou trois modales ; écrire le critère de chaque bloc et l'élément qui sert de titre ; dire si l'aide se replie aussi sur ordinateur.
- Résolution : **résolu** par R2, après le relevé du memlog : aide = `div.alert.alert-dismissible.alert-order`, blocage = `.alert-danger.alert-sm`, avertissement = `.alert-warning.alert-sm`, titre = `h3` puis `h4`. Seule `.alert-order` se replie ; le critère est consigné dans les Notes. Repli de l'aide sur ordinateur : Q25. La fixture reste à créer.

**[Faisabilité]** — H3. Règles transverses contre une cascade à 48 % de `!important` (§ DESIGN › Typography, Shapes, Layout & Spacing)
- Constat : 3 367 déclarations `!important` sur 7 072. Des sections sans garde, entièrement en `!important`, s'appliquent à toutes les pages mobiles (PHASE 3, 4 et 5, 1re version du forum RP, nouveau sujet) : une règle gardée par `:where(html.x)` perd contre elles. Les documents ne disaient ni l'ordre des chantiers, ni s'il faut retirer les anciennes sections ou les battre.
- Correction proposée : Étape préalable : garder par page ou retirer ces sections, avec un contrôle page par page ; `!important` seulement contre une règle ancienne nommée ; ordre : jetons et couleurs, rayons et focus, typographie, espacements.
- Résolution : **corrigé** dans la passe de correction : « Notes pour l'implémentation › Cascade » pose la stratégie de cascade comme préalable aux règles transverses. L'ordre des chantiers n'est pas repris.

**[Faisabilité]** — H4. Carte de section sur le sous-forum : conflit avec la liste pleine largeur (§ DESIGN › Carte de section ; Q10)
- Constat : h04 met la liste des sujets dans une carte en retrait ; la refonte du sous-forum, zone de référence, l'étend sur toute la largeur (`calc(100% + 32px)`, marges de −16 px). Les deux s'excluent ; `sous-forum.mjs` fige le rendu actuel.
- Correction proposée : Trancher : la liste entre dans la carte (refonte reprise, tests mis à jour), ou le sous-forum est exempté de H4.1.
- Résolution : **résolu** par R6 : la liste des sujets entre dans la carte en retrait ; `tests/e2e/sous-forum.mjs` est à mettre à jour à l'implémentation.

**[Faisabilité]** — H5. Typographie des pages de jeu mobiles : ni garde de page, ni correspondance des rôles (§ DESIGN › Typography ; H3.1, H11.1)
- Constat : La cause citée, l'échelle mobile des titres, est globale (`h1` à `h6` en `rem` et `!important`) ; la changer pour le seul jeu demande une classe de page que le JS ne pose pas pour `/jouer/*`. Les rôles « nom et valeur », « détail », « titre de section » ne sont reliés à aucun élément du DOM natif. Même flou au bureau : l'accueil emploie aussi des `h4`.
- Correction proposée : Classe `html.kr-page-jouer`, échelle sous `:where(html.kr-page-jouer)`, table « rôle → sélecteur » pour les cinq pages de jeu ; contrôle du mini-profil plié et déplié à 375 et 700 px.
- Résolution : **corrigé** dans la passe de correction : les Notes consignent l'absence de classe pour `/jouer/*` et la table des rôles typographiques des cinq pages, à établir. Les `h4` de l'accueil (H11.1) ne sont pas repris.

**[Faisabilité]** — H6. Marge de 16 px : le JS met à zéro, en ligne et en `!important`, les marges des conteneurs mobiles (§ DESIGN › Layout & Spacing ; H10.1)
- Constat : `applyMobileCriticalStyles` (L604-636) met à zéro le remplissage latéral des colonnes et des conteneurs et les marges des `.row`. Aucune feuille ne bat un style en ligne `!important` : la marge doit venir des éléments internes, page par page, ou d'une modification de cette fonction, qui tourne sur toutes les pages mobiles.
- Correction proposée : Choisir : (a) une marge sur les enfants des conteneurs, sous des classes de page ; (b) une gouttière mobile en jeton, appliquée par le JS. Mentionner la contrainte dans DESIGN.
- Résolution : **corrigé** dans la passe de correction : contrainte citée dans DESIGN (« Marge latérale mobile ») et décrite dans les Notes (« Marges mobiles ») ; le choix (a) ou (b) revient à l'implémentation.

**[Faisabilité]** — H7. Grille de 4 px : périmètre non borné (§ DESIGN › Layout & Spacing ; Q11)
- Constat : « Les 10 et 15 px de Bootstrap deviennent 8, 12 ou 16 » peut viser la gouttière de la grille, les composants Bootstrap ou seulement les règles de la peau. Toucher la gouttière décale toutes les mises en page du bureau, dont les colonnes du plateau ; « selon les voisins » laisse le choix au développeur, élément par élément.
- Correction proposée : Liste des composants Bootstrap concernés et valeur cible de chacun ; exclure la gouttière, ou la traiter à part avec Arnaud ; une table au lieu de « selon les voisins ».
- Résolution : **ouvert** (Q11) : périmètre à borner, composants candidats et question de la gouttière posés ; « selon les voisins » reste `[ASSUMPTION]`.

**[Faisabilité]** — H8. Cartes de personnages : une plage de fenêtre contraire aux points de rupture (§ DESIGN › Carte de personnage, Points de rupture ; Q7)
- Constat : « Entre ≈ 1100 et 1500 px » se traduit par une requête bureau en `max-width`, que la convention interdit ; les bornes sont approximatives et mesurées avec des noms en 11 px ; la vraie cause est la largeur de la carte.
- Correction proposée : Exprimer la règle sur la carte : mise en page intrinsèque ou requête de conteneur.
- Résolution : **corrigé** dans la passe de correction : la règle porte sur la largeur de la carte, dans DESIGN, EXPERIENCE et les Notes ; la plage reste un constat.

**[Faisabilité]** — H9. Popup `/report` de 600 px : des règles « ordinateur » sous le seuil mobile (§ EXPERIENCE › Responsive & Platform ; Q6 ; H14.1, H14.2)
- Constat : Le JS pose `body.mobile-mode` dans le popup de 600 px ; lui donner les règles « ordinateur » contredit AGENTS.md. `window.opener` ne suffit sans doute pas comme critère. D'autres fenêtres natives sont dans le même cas (aperçu `help.php?p=prev`, 600×480).
- Correction proposée : Faire trancher : (a) le popup suit les règles mobiles ; (b) une exception écrite dans AGENTS.md, classe `html.kr-popup-bureau`. Étendre Q6 aux autres fenêtres natives.
- Résolution : **résolu** par R5 : sur ordinateur, la cloche ouvre le popup en 900×800 (redéfinition d'`openReport`, sans préchargement), au-dessus du seuil, sans exception aux points de rupture. Autres fenêtres natives : Q32.

**[Faisabilité]** — H10. Le correctif d'ancres mobile retire `#msg…` (§ EXPERIENCE › Ligne de forum, Ligne de sujet, Parcours 2)
- Constat : Si `innerWidth < 768` à l'évaluation du script, le JS retire toute ancre autre que `#top` (L2783-2808) : en émulation, le lien « premier non lu » du sous-forum, et probablement la flèche « dernier message » de l'index, mènent en haut du sujet ; sur un téléphone, où la largeur vaut 980 px à ce moment, le correctif ne fait rien. La vérification à 375×667 montrerait l'inverse de la réalité.
- Correction proposée : Réduire le correctif à son but déclaré (`#flap`), ou exclure `#msg\d+` ; vérifier les deux liens en mobile.
- Résolution : **corrigé** dans la passe de correction : constat consigné dans les Notes (« Ancres en mobile ») ; le correctif reste à faire à l'implémentation.

**[Joueur]** — H1. « Non lu » : un signal aujourd'hui cohérent, éclaté en plusieurs couleurs (§ DESIGN › Rôles, Palette d'états, Pastille d'état ; Q4, Q15)
- Constat : Aujourd'hui, un seul jeton, `--kr-status-unread`, porte le non-lu, par choix d'Arnaud. Les documents passaient les pastilles en alerte et gardaient le filet en accent : deux couleurs pour un même état sur une même ligne. Le « ! » de la cloche en danger étirait le danger au-delà des blocages ; le badge de l'enveloppe du kramail n'était pas traité.
- Correction proposée : Rendre Q15 bloquante ; un seul jeton « non lu » pour pastilles, filets, teinte de `/report`, cloche et enveloppe.
- Résolution : **résolu** par R3 : `--kr-status-unread` pour tout « non lu / nouveau », cloche et enveloppe comprises ; le danger est réservé aux blocages. Selon DESIGN, le non-lu vaut `text-accent`, la couleur des liens et de l'anneau de focus ; Q21 traite sa proximité avec le danger.

**[Joueur]** — H2. « Une couleur vive signale un état » ne tient pas dans six nations sur huit (§ DESIGN › Brand & Style, Palette d'états ; Q2, Q3)
- Constat : Rouges de Kraland et de Ruthvénie voisins du danger ; verts de Paradigme Vert et de Ruthvénie voisins du succès ; `#8a5a00` d'Empire Brun égal à l'alerte ; or de Paladium sombre voisin de l'alerte sombre ; primaire grise de Confédération Libre égale au texte atténué : « Valider » aura l'air désactivé. En Kraland clair, l'aide et un blocage sont deux roses pâles sous un « Valider » rouge foncé : la couleur ne les distingue pas.
- Correction proposée : Un état se lit d'abord à son texte et à sa forme ; sa couleur ne sert jamais à une action. Contrôler Q3 nation par nation ; demander si la primaire grise de Confédération Libre convient.
- Résolution : **ouvert** (Q21), qui reprend la liste, la piste « libellé et forme d'abord » et le cas de Confédération Libre.

**[Joueur]** — H3. « Envoyer » : barre fixe ou bouton dans le flux, la règle se contredit (§ DESIGN et EXPERIENCE › Barre « Envoyer » ; Q13 ; H1.2, H6.2)
- Constat : Appliquée à la lettre, la règle réintroduit au forum une barre fixe que l'éditeur avait retirée exprès (« plus de barre fixe qui recouvre la saisie ») ; laissée en l'état, le même geste a deux places selon qu'on écrit un RP ou un kramail.
- Correction proposée : Passer Q13 en bloquante, avec une seule réponse pour le forum et le kramail ; le précédent du forum plaide pour le bouton dans le flux.
- Résolution : **résolu** par R4 : « Envoyer » dans le flux, sous le champ, au forum et au kramail.

**[Joueur]** — H4. Mobile vu seulement en émulation : vrai téléphone et clavier ouvert non vérifiés (§ EXPERIENCE › Responsive & Platform ; Q17 ; Parcours 1 et 3)
- Constat : `initMobileFeatures` lit `innerWidth` au démarrage, quand la largeur vaut 980 px avant la meta viewport ; les améliorations mobiles de la modale dépendent d'un observateur posé seulement si `document.body` existe. H2.2, H2.4, H2.5 et H2.7 ont été décidées sur un rendu qu'un téléphone ne produit peut-être pas. Le climax du parcours 3 (barre fixe pendant la saisie) n'est pas observable en émulation. Q17 était non bloquante, alors que le parcours 1 en dépend entièrement.
- Correction proposée : Passer Q17 en bloquante pour la modale et le parcours 3 ; un passage court sur un vrai téléphone, iOS et Android.
- Résolution : **ouvert** (Q17), non bloquante contre l'avis de cette relecture, mais préalable écrit à l'implémentation des règles mobiles de la modale et d'« Envoyer ». Le risque du clavier sur une barre fixe disparaît avec R4.

**[Joueur]** — H5. Zoom iOS : l'échelle de texte n'a pas de rôle « champ de saisie » (§ DESIGN › Typography ; Q8)
- Constat : Les champs sont aujourd'hui à 16 px en mobile, à huit endroits du CSS, pour éviter le zoom de Safari iOS. Les aligner sur le « texte courant 15 px » ferait zoomer Safari à chaque toucher d'un champ : kramail, réponse RP, ordre Parler, recherche des règles.
- Correction proposée : Ajouter à DESIGN le rôle « champ de saisie, mobile : 16 px, jamais moins ».
- Résolution : **ouvert** (Q8) : le constat est écrit dans DESIGN (« Typography ») et dans Q8, sans rôle « champ » ajouté.

**[Joueur]** — H6. Lire et répondre à un kramail : trou de boucle, actions en icônes seules (§ EXPERIENCE › Boucle de jeu, Parcours 3)
- Constat : Le cas le plus fréquent, lire un kramail reçu et y répondre, n'est pas parcouru. Sur la page de lecture mobile, Répondre, Répondre à tous et Transférer sont des icônes seules, sans infobulle. Dans un jeu politique, un « répondre à tous » sur un kramail confidentiel a un coût en jeu.
- Correction proposée : Étendre à la lecture la logique de H13.1 (libellés visibles, au moins pour Répondre et Répondre à tous) ; ajouter un parcours « lire et répondre ».
- Résolution : **ouvert** (Q22).

**[Joueur]** — H7. Joueur à plusieurs personnages : non couvert hors des pages de jeu (§ EXPERIENCE › Liens dans la boucle ; H1.3, H1.4)
- Constat : Kramail et notifications sont propres à chaque personnage ; la peau a trois sélecteurs de personnage différents, aucun décrit. C'est en écrivant un kramail ou en lisant un rapport que se tromper de personnage coûte le plus.
- Correction proposée : Le joueur à plusieurs personnages est-il dans le périmètre ? Si oui : même aspect et même place pour le personnage courant, et un parcours qui change de personnage.
- Résolution : **ouvert** (Q23), qui ajoute le risque du nom mémorisé par R1.

### Moyen (42)

**[Grille › Complétude des jetons]** — Survol du bouton primaire : fond et encre jamais vérifiés ensemble (§ DESIGN › Bouton primaire, Dériver une variante)
- Constat : En Paladium clair, sans `--kr-arm-ink-hover`, l'encre retombe sur le blanc : 3,23:1 sur la primaire foncée `#aa8c2c`. En Confédération Libre sombre, 4,30:1, alors que le CSS actuel évite ce cas avec `--kr-arm-bg-hover: #5f6673`. Le même repli sert à « Répondre », « Envoyer » et à la croix.
- Correction proposée : Survol = paire `--kr-arm-bg-hover` / `--kr-arm-ink-hover` en jetons ; encre `#1e1a15` en Paladium clair ; les 16 paires au tableau des contrastes.
- Résolution : **corrigé** dans la passe de correction, en application de Q1 : jetons `action-bg-hover` et `action-ink-hover`, tableau « Encre d'action » (16 paires, 4,73 à 12,89:1), encre `#1e1a15` à poser en Paladium clair.

**[Grille › Complétude des jetons]** — Alerte : fond « à faible opacité » sans valeur ni jeton (§ DESIGN › Alerte)
- Constat : Toutes les alertes des 16 variantes en dépendent, dont celle de la modale d'ordre (H2.3).
- Correction proposée : Fixer le taux du fond et de la bordure, en jetons, avec le contraste du texte.
- Résolution : **ouvert** (Q3) : marqué `[ASSUMPTION]` dans le composant `alert` ; la maquette key-modale-ordre propose 12 % et 35 %.

**[Grille › Couverture des composants]** — Boutons d'action du plateau sans composant (§ DESIGN › Components ; EXPERIENCE › Parcours 1)
- Constat : Dormir, Prier, Pouvoir, Fouiller : H6.1 change leur taille, H5.2 les a relevés rouges en Paradigme Vert clair, le parcours 1 s'appuie dessus, mais aucune ligne ne dit s'ils sont **Bouton primaire** ou **Bouton standard**.
- Correction proposée : Les rattacher à un composant dans les deux tables.
- Résolution : **corrigé** dans la passe de correction : DESIGN rattache les boutons de classe `btn-primary` (Dormir, Prier) au **Bouton primaire** et ceux de classe `btn-default` (Pouvoir) au **Bouton standard**. Les tuiles d'action du plateau mobile restent sans composant : Q24.

**[Grille › Couverture des composants]** — Pastille de niveau sans composant ni famille (§ DESIGN › Rôles (`highlight-reverse`))
- Constat : H8.1 ne connaît que deux familles (état, catégorie) et H8.2 met « toutes les étiquettes et pastilles » en 12 px gras : on ne sait pas où la ranger.
- Correction proposée : Une ligne dans les deux tables et un classement, à faire valider.
- Résolution : **ouvert** (Q30).

**[Grille › Couverture des états]** — « États du site … hors de cette étude » : décision de périmètre absente du memlog (§ EXPERIENCE › State Patterns)
- Constat : La ligne couvre des écrans que la peau habille (dossier du kramail vide, sous-forum vide, erreurs de rédaction), sans être validée ni marquée `[ASSUMPTION]`.
- Correction proposée : La faire valider par Arnaud, ou la marquer `[ASSUMPTION]` avec une question.
- Résolution : **corrigé** dans la passe de correction : marquée `[ASSUMPTION]` et reprise dans les « autres hypothèses de rédaction », sans question propre.

**[Grille › Couverture des états]** — Noms longs : aucune règle (§ DESIGN › Mini-profil, Panneau latéral du jeu)
- Constat : H1.3 et H1.4 remplacent des mots fixes (« Personnage », « Employés ») par le nom du personnage, dans le mini-profil à 375 px et dans le titre du panneau latéral.
- Correction proposée : Fixer la règle : troncature, ou deux lignes au plus comme H7.1.
- Résolution : **ouvert** (Q29).

**[Grille › Couverture des états]** — Ligne de forum sans dernier message ou sans accès (§ DESIGN et EXPERIENCE › Ligne de forum)
- Constat : Forum vide, guilde neuve, ou forum sans accès (retiré des menus selon AGENTS.md) : la flèche n'a pas de cible et la ligne perd son information principale.
- Correction proposée : Décrire le rendu de repli.
- Résolution : **ouvert** (Q27).

**[Grille › Couverture des états]** — Carte de personnage : une plage de fenêtre au lieu de la largeur de la carte (§ DESIGN › Carte de personnage ; EXPERIENCE › Responsive & Platform)
- Constat : Le memlog décide « quand la carte est étroite » ; la spine traduisait en « ≈ 1100 à 1500 px » de fenêtre, plage mesurée avec des noms en 11 px, qui appelle une borne `max-width` qu'AGENTS.md interdit sur ordinateur.
- Correction proposée : Écrire la règle sur la largeur de la carte et garder la plage comme constat.
- Résolution : **corrigé** dans la passe de correction : « quand la carte est trop étroite pour le nom à côté de l'avatar », dans DESIGN, EXPERIENCE et les Notes pour l'implémentation ; la plage reste un constat. Remesure en 15 px : Q7.

**[Grille › Couverture des références visuelles]** — Couverture des maquettes non confirmée (§ Finalize › Mock coverage confirmed)
- Constat : Sans maquette : la **Modale d'ordre** (nouvel ordre de lecture), la **Ligne de notification** mobile, les dossiers du kramail en onglets, les **Boutons d'accès rapide**, la carte de personnage validée (h07 montre la version écartée).
- Correction proposée : Demander à Arnaud lesquelles méritent une maquette (au moins la modale et H7.1), puis journaliser les choix « tables seules ».
- Résolution : **ouvert** (Q33). Par la décision « Maquettes de référence », Arnaud a demandé la modale d'ordre (ordinateur et mobile) et le plateau, les notifications et le kramail mobiles : elles existent. Restent sur les tables seules, à confirmer : Boutons d'accès rapide, carte de personnage sur ordinateur, sous-forum mobile dans sa carte, index mobile, En-tête de sujet étendu, pages secondaires.

**[Grille › Surcharge et surspécification]** — Pixels répétés là où un jeton existe (§ EXPERIENCE ; DESIGN › frontmatter (composants))
- Constat : Dans EXPERIENCE, « 44 px » 14 fois, « 44×44 » 9 fois, « 15 px » 11 fois, « 34 px » 7 fois ; `44px` 5 fois dans les composants, à côté de `{spacing.touch-target}`. Les 15 px du texte courant mobile, encore `[ASSUMPTION]` (Q8), sont recopiés à quatre endroits : si Q8 change, ils dérivent.
- Correction proposée : Citer les jetons dans EXPERIENCE et dans les composants ; garder les pixels dans DESIGN.
- Résolution : **en partie** — les composants citent les jetons ; EXPERIENCE garde ses pixels (comptes ci-dessus).

**[Grille › Discipline d'héritage]** — Q13 rouvrait une décision validée (§ EXPERIENCE › Questions ouvertes ; DESIGN › Barre « Envoyer »)
- Constat : H1.2 réserve la barre fixe aux pages de rédaction et H6.2 confirme « Envoyer » de rédaction = barre fixe ; Q13 posait l'alternative sans proposition par défaut.
- Correction proposée : Appliquer la décision et garder le constat ; ne poser la question que si Arnaud veut revoir H1.2.
- Résolution : **résolu** par R4 (override d'Arnaud) : « Envoyer » dans le flux, sous le champ, au forum et au kramail ; la barre fixe disparaît partout.

**[Grille › Discipline d'héritage]** — Règles absentes du memlog, non marquées (§ DESIGN › Rôles, Bouton standard ; EXPERIENCE › Accessibility Floor, Pages secondaires)
- Constat : « Texte ≥ 4,5:1 dans les 16 variantes » (H5.6 ne visait que le sombre) ; `text-muted` réservé aux éléments indisponibles ; marge de 16 px de la Carte étendue à l'ordinateur ; **Bouton standard** pour toutes les actions ordinaires, quand H5.5 dit « standard ou primaire ».
- Correction proposée : Marquer `[ASSUMPTION]` avec une question, ou faire valider.
- Résolution : **corrigé** dans la passe de correction : le seuil de 4,5:1 est tranché par Q1 et Q2 ; `text-muted` (Q26) et la marge de la Carte sur ordinateur sont marqués `[ASSUMPTION]` ; le **Bouton standard** reprend « standard ou primaire ».

**[Grille › Discipline d'héritage]** — Tension avec H5.5 et H8.1 (§ DESIGN › Palette d'états, Valeurs par variante)
- Constat : `#8a5a00` sert à la fois l'alerte, le non-lu d'Empire Brun et le texte coloré proposé pour Empire Brun clair (Q2). En Kraland et en Ruthvénie, l'accent `#c41e3a` et le danger `#c62828` se confondent (1,04:1).
- Correction proposée : Présenter le cas à Arnaud avec Q2 et Q3 : ton d'alerte distinct, ou exception assumée par nation.
- Résolution : **ouvert** (Q21). Q2 a retenu `#8a5a00` pour le texte d'Empire Brun clair ; selon DESIGN, le non-lu de R3 vaut `text-accent` dans les 16 variantes.

**[Faisabilité]** — M1. Survol du bouton primaire : deux paires sous 4,5:1 (§ DESIGN › Bouton primaire)
- Constat : Paladium clair : 3,23:1 avec le repli blanc. Confédération Libre sombre : 4,30:1 sans le `--kr-arm-bg-hover: #5f6673` du CSS actuel.
- Correction proposée : Écrire le survol comme le code existant (`var(--kr-arm-bg-hover, …)`), ajouter `--kr-arm-ink-hover: #1e1a15` à Paladium clair et les paires de survol au tableau des contrastes.
- Résolution : **corrigé** dans la passe de correction, comme le constat de la grille (« Complétude des jetons ») : tableau « Encre d'action », encre `#1e1a15` à poser en Paladium clair.

**[Faisabilité]** — M2. Texte posé sur la couleur de nation : plus de couples que les trois composants cités (§ DESIGN › Texte posé sur la couleur de nation)
- Constat : Le CSS pose aussi du texte sur la primaire : titre des listes latérales, bandeau du `/report`, page active de la pagination, onglets et menus actifs en sombre (2,81:1 en Empire Brun sombre), dossiers du kramail, onglets de la modale, bouton « Jouer » de l'accueil. En Paladium, 2,10:1 en clair et 1,65:1 en sombre.
- Correction proposée : Énoncer Q1 comme une règle de jetons et joindre cette liste comme périmètre d'implémentation.
- Résolution : **résolu** par Q1 (« tout texte posé sur la couleur de nation ») ; la liste figure dans DESIGN comme périmètre relevé.

**[Faisabilité]** — M3. Texte en couleur de nation : tous les liens, et 47 déclarations (§ DESIGN › H5.6, Q2)
- Constat : Tous les liens sont en accent : 2,82:1 en Empire Brun clair. En sombre, 47 déclarations écrivent la primaire en couleur de texte ; H5.6 cite trois cas. Changer `--kr-highlight` changerait aussi ses usages décoratifs.
- Correction proposée : Un jeton de texte coloré par variante, employé pour tous les textes colorés ; `--kr-highlight` reste décoratif ; l'audit des 47 déclarations fait partie de H5.6.
- Résolution : **résolu** par Q2 et R7 : jeton `{colors.text-accent}` par variante, `highlight` décoratif, périmètre (liens, 47 déclarations) écrit dans H5.6.

**[Faisabilité]** — M4. Texte atténué : une hypothèse invérifiable, qu'un jeton remplace (§ DESIGN › Contrastes de référence)
- Constat : `--kr-text-secondary` est employé 95 fois ; garantir qu'aucun de ces textes n'est posé sur `#f5f5f5` ou sur une teinte de H5.3 (4,17 à 4,59:1) n'est ni tenable ni vérifiable.
- Correction proposée : Foncer le jeton en clair : `#636a77` donne au moins 4,70:1 sur toutes ces surfaces.
- Résolution : **ouvert** (Q26), avec la proposition `#636a77`.

**[Faisabilité]** — M5. Jauges : repérage au bureau et couleurs des cartes (§ DESIGN › Jauges ; H5.4)
- Constat : Au bureau, PV et PM ont sans doute la même classe : aucun sélecteur CSS ne les distingue (non vérifié). Sur le plateau, le cercle et la barre de PV des cartes sont colorés par niveau de santé, un signal d'état qu'« une couleur par jauge » effacerait.
- Correction proposée : Marquer les jauges natives par le JS d'après leur texte ; faire dire à Arnaud si les cartes gardent leur couleur par niveau.
- Résolution : **ouvert** (Q30) pour les cartes ; le marquage des jauges au bureau n'est pas repris.

**[Faisabilité]** — M6. Palette d'états : les classes natives servent aux états et aux actions (§ DESIGN › Palette d'états ; EXPERIENCE › Pages secondaires)
- Constat : Les boutons de Contacts et « Pas un contact » portent `.btn-danger`, `.btn-warning`, `.btn-info`, `.btn-success`, comme les votes, qui sont un état ; une règle globale ne peut pas les séparer et Contacts n'a pas de classe de page.
- Correction proposée : Des règles par page, une classe de page Contacts, une modification du bouton « Voir l'historique » du userscript ; la liste des actions ordinaires dans DESIGN.
- Résolution : **corrigé** dans la passe de correction : classe de page manquante consignée dans les Notes ; actions ordinaires listées dans DESIGN (« Palette d'états »).

**[Faisabilité]** — M7. Mode clair thémé : des règles globales sur toutes les pages (§ DESIGN › Teintes du mode clair)
- Constat : Aucune règle claire ne vise aujourd'hui `.panel-heading`, `th`, `.btn-default` ni `.nav-tabs` : les ajouter change toutes les pages. Les flèches de tri DataTables sont des images de fond qu'une déclaration `background` effacerait (non vérifié).
- Correction proposée : `background-color`, jamais `background` ; bornes `.panel-default` et `.table` ; recenser les règles sombres non chromatiques.
- Résolution : **corrigé** dans la passe de correction : « Listes à établir » des Notes (panneaux et tableaux de H5.3, propriétés non chromatiques). La consigne `background-color` n'est pas reprise.

**[Faisabilité]** — M8. Boutons : quels éléments sont des « boutons » ? (§ DESIGN › Typography, Shapes, boutons primaire, standard et compact)
- Constat : « Normale partout » doit épargner les `.btn-group-xs` des caractéristiques, la barre BBCode, la croix, les flèches de l'index, les boutons à icône ; 4 px sur tous les `.btn` casse les jonctions des `.btn-group` ; le JS pose des rayons en ligne que le CSS ne bat pas.
- Correction proposée : Une liste fermée des boutons et des exclusions ; la reprise des styles en ligne du JS ; garder les sélecteurs de groupe de Bootstrap.
- Résolution : **corrigé** dans la passe de correction : liste des boutons et de leurs exclusions à établir, consignée dans les Notes.

**[Faisabilité]** — M9. H1.1 : garder par page la section du forum change toutes les tables mobiles hors forum (§ EXPERIENCE › Ligne de citoyenneté)
- Constat : La 1re version du forum vise `body.mobile-mode .panel-default .table` sans garde ; la garder par `page-forum` règle H1.1, mais retire la mise en cartes d'Événements, Membres, Contacts, Statistiques.
- Correction proposée : Contrôler ces pages dans la même tâche, ou garder une mise en cartes générique.
- Résolution : **corrigé** dans la passe de correction : exemple de dépendance cité dans « Notes › Cascade ».

**[Faisabilité]** — M10. Classes de page et gardes : un prérequis absent des documents (§ EXPERIENCE › Responsive & Platform ; AGENTS.md)
- Constat : Le JS ne pose de classe que pour l'accueil, le forum, le kramail, les événements, les membres et le `/report`. Rien pour `/jouer/*`, la rédaction, l'index du forum, Contacts, Règles, Interface, Aide, Statistiques, Carte. Le mode clair n'a pas de classe. InitQueue tourne aussi peau coupée.
- Correction proposée : Un lot préalable : classes `html.kr-page-*`, garde de mode clair, test de la peau active dans chaque nouveau module.
- Résolution : **corrigé** dans la passe de correction : « Notes › Classes de page ». Le test de la peau active n'est pas repris.

**[Faisabilité]** — M11. Règles communes aux deux supports et convention « jamais en global » (§ EXPERIENCE › Responsive & Platform ; AGENTS.md)
- Constat : Rayons, étiquettes, focus, jauges et grille sont « identiques sur les deux supports », alors qu'AGENTS.md interdit le global ; le code contourne par des paires dupliquées ou par `(max-width: 767px), (min-width: 768px)` (l.13487).
- Correction proposée : Fixer dans AGENTS.md la forme d'une règle commune.
- Résolution : **corrigé** dans la passe de correction : la forme d'une règle commune est un préalable écrit dans « Notes › Cascade » ; AGENTS.md n'est pas modifié.

**[Faisabilité]** — M12. Barre « Envoyer » fixe : le clavier virtuel peut la masquer (§ EXPERIENCE › Barre « Envoyer », Parcours 3)
- Constat : Safari iOS et Chrome Android récent ne redimensionnent que le viewport visuel : un élément `position: fixed; bottom: 0` reste sous le clavier ; l'émulation ne le montre pas.
- Correction proposée : Suivre `visualViewport`, ou reformuler la règle.
- Résolution : **résolu** par R4 : « Envoyer » dans le flux, plus aucune barre fixe.

**[Faisabilité]** — M13. Refonte de l'index du forum : quatre points à préciser (§ DESIGN et EXPERIENCE › Ligne de forum ; maquette h12)
- Constat : Au bureau, transformation neuve (seul le mobile remplace le tableau, et ce module tourne peau coupée) ; une flèche distincte demande une ligne à lien étiré ; une « heure relative » calculée dépendrait du fuseau du serveur ; l'icône de chaque forum n'est que dans la liste latérale native.
- Correction proposée : Libellé de date natif reformaté, sans calcul ; icône lue dans la liste latérale, avec une icône de repli ; un seul module pour les deux supports, actif seulement avec la peau.
- Résolution : **ouvert** (Q27) pour l'heure et l'icône ; le module commun et le lien étiré ne sont pas repris.

**[Faisabilité]** — M14. « Annuler » / « Valider » : la méthode peut toucher d'autres fenêtres (§ EXPERIENCE › Voice and Tone ; H2.1)
- Constat : La locale `fr` de Bootbox 4.4.0 dit « D'accord » ; `setDefaults` et `setLocale` agiraient sur toutes les Bootbox, kramail compris, via `unsafeWindow`. Le périmètre n'était pas écrit.
- Correction proposée : Réécrire les libellés dans le DOM des seules modales d'ordre ; écrire le périmètre dans EXPERIENCE.
- Résolution : **corrigé** dans la passe de correction : « modales d'ordre seulement ; les autres confirmations gardent leurs libellés » (« Voice and Tone »).

**[Faisabilité]** — M15. Vérification : les fixtures manquent pour la plupart des zones touchées (§ EXPERIENCE › Responsive & Platform › Vérification)
- Constat : Rien pour la modale d'ordre native, l'index du forum, Personnage, Matériel, Bâtiments, Employés, les pages secondaires ; des suites figent des valeurs que les décisions changent.
- Correction proposée : Chiffrer dans le futur plan la création de fixtures synthétiques et la mise à jour des suites, chacune avec sa contre-épreuve.
- Résolution : **corrigé** dans la passe de correction : « Notes › Tests et fixtures » liste les suites touchées et les fixtures manquantes.

**[Joueur]** — M1. Pastilles coût, durée, potentiel : style, mots et taille (§ DESIGN › Pastilles coût, durée, potentiel ; Q5)
- Constat : Trois pilules couleur d'action collées à « Valider » ressemblent à des boutons et diluent l'action principale ; les icônes remplacent les mots, et « 01:00 » près d'une horloge se lit comme une heure ; 12 px, la plus petite taille du système, pour l'information qui décide de l'ordre.
- Correction proposée : Style neutre (surface, texte du thème, bordure) ; garder le mot ou une abréviation ; valeur en 13 px ?
- Résolution : **ouvert** (Q5) ; le fond de nation est tranché par Q1.

**[Joueur]** — M2. Tuiles d'action du plateau mobile : absentes des composants (§ DESIGN › Components ; Parcours 1)
- Constat : La commande la plus touchée de la boucle n'a pas de composant ; le code l'appelle « actions rapides », comme les « Boutons d'accès rapide » des documents. Appliquer H6.2 et H6.3 à la lettre change ces tuiles sans décision.
- Correction proposée : Ajouter la tuile d'action aux composants ; renommer « Boutons d'accès rapide » en « Boutons de section (ordinateur) ».
- Résolution : **ouvert** (Q24) ; DESIGN met en garde contre la confusion de noms, sans renommer.

**[Joueur]** — M3. Modale d'ordre : anatomie ambiguë (§ DESIGN et EXPERIENCE › Modale d'ordre)
- Constat : Place des onglets par rapport à l'alerte ; « ? Aide » qui n'existe qu'en mobile ; croix de 44×44 qui empiète sur la rangée du titre quand Bootbox n'a pas de titre ; contenu de l'ordre (champs, cible, quantité) sans taille ni règle.
- Correction proposée : Compléter l'anatomie : place des onglets, alerte attachée à l'onglet actif, « ? Aide » en mobile seulement, place de la croix, tailles du contenu.
- Résolution : **ouvert** (Q25).

**[Joueur]** — M4. Défilement et placement du plateau mobile : non mesurés (§ EXPERIENCE › Parcours 1 et 4)
- Constat : Texte, cibles, en-têtes et lignes grandissent sous un en-tête collant et une barre d'onglets collante, un sixième de l'écran ; aucun relevé avant/après de la longueur des pages ; l'ordre des blocs du plateau n'est pas traité, alors que le placement est au cœur du sujet.
- Correction proposée : Mesurer à 375×667 avant et après ; une règle « tuiles d'action et croix visibles sans défilement à l'arrivée » ?
- Résolution : **ouvert** (Q24) pour la règle d'arrivée ; les mesures avant/après ne sont pas reprises.

**[Joueur]** — M5. Largeurs et supports non couverts : 360 et 320 px, paysage, tablette (§ EXPERIENCE › Responsive & Platform)
- Constat : À 360 px, « Personnage » se coupera dans les onglets. Tournés, la plupart des téléphones passent en mode ordinateur sur écran tactile ; à 768 px exactement, des blocs mobiles écrits en `max-width: 768px` s'appliquent sans le mode mobile du JS.
- Correction proposée : Ajouter 360 et 320 px à la vérification ; paysage et tablette dans le périmètre ?
- Résolution : **ouvert** (Q32 ; 360 px aussi dans Q14).

**[Joueur]** — M6. Rangée du kramail mobile : ne tient pas en une ligne (§ DESIGN et EXPERIENCE › Onglets de section ; H13.1)
- Constat : Trois onglets libellés et trois boutons de 44 px dépassent les 343 px utiles ; « même composant que les sections du jeu » ne dit pas la disposition.
- Correction proposée : Préciser la disposition et la vérifier à 360 px.
- Résolution : **ouvert** (Q31).

**[Joueur]** — M7. Fil d'Ariane : la référence a les défauts que la règle veut éviter (§ DESIGN et EXPERIENCE › Fil d'Ariane ; H12.3)
- Constat : Le fil « des sujets » réel a tous ses liens en texte atténué, 13 px, sans hauteur minimale, probablement à 4,43:1 sur le fond de page ; celui du sous-forum a un lien de 44 px en couleur du texte. Reprendre le premier tel quel retire au sous-forum sa cible et le rend moins lisible.
- Correction proposée : Décrire le format visé : liens en couleur du texte, cibles de 44 px, seul l'élément courant atténué.
- Résolution : **ouvert** (Q28).

**[Joueur]** — M8. Index du forum : la flèche, le parcours 2 et la redite du titre (§ EXPERIENCE › Parcours 2, Ligne de forum ; maquette h12)
- Constat : La flèche mène au dernier message du forum, la ligne de sujet au premier non lu : deux raccourcis voisins, deux sens. Le parcours 2 supposait que le dernier message est dans le sujet d'Arnaud. En mobile, « Jeu (RP) » se répète en titre de page et en en-tête de carte. Description et modérateurs quittent l'index.
- Correction proposée : Ajouter au parcours 2 le cas « dernier message dans un autre sujet » ; carte sans en-tête quand il répète le titre ? Où lire description et modérateurs ?
- Résolution : **ouvert** (Q27) ; la variante « dernier message dans un autre sujet » est ajoutée au parcours 2 (corrigé).

**[Joueur]** — M9. Cartes de personnages : une règle par largeur de fenêtre (§ DESIGN › Carte de personnage ; Q7)
- Constat : La plage a été mesurée avec des noms en 11 px ; en 15 px, les noms longs déborderont aussi au-delà de 1500 px, et le zoom du navigateur déplace la plage : la troncature reviendra hors de la plage.
- Correction proposée : Exprimer la règle par la place disponible ; remesurer en 15 px à 1024, 1280, 1366, 1440 et 1920 px.
- Résolution : **corrigé** dans la passe de correction : règle sur la largeur de la carte ; remesure aux cinq largeurs inscrite dans Q7.

**[Joueur]** — M10. Cartes de section en retrait : le texte ne commence plus à 16 px (§ DESIGN › Layout & Spacing ; Q10)
- Constat : Retrait de 8 px plus marge intérieure de 16 px : le texte commence à 24 px du bord, le titre de page à 16 px, contre la promesse de H10.1 ; jeu et forum perdent 16 px de largeur de lecture.
- Correction proposée : Trancher Q10 avant l'implémentation.
- Résolution : **ouvert** (Q10), avec les options relevées.

**[Joueur]** — M11. Texte atténué en clair : une contrainte de placement invérifiable (§ DESIGN › Contrastes de référence)
- Constat : 4,43:1 sur le fond de page, 4,17 à 4,59:1 sur les en-têtes teintés ; déjà posé hors des surfaces blanches (fil d'Ariane, cellule de date teintée des notifications).
- Correction proposée : Un texte atténué un peu plus foncé plutôt qu'une règle de placement.
- Résolution : **ouvert** (Q26).

**[Joueur]** — M12. Caractéristiques, compétences, malus : absents des documents (§ H5.5, H8.2)
- Constat : Consultés avant un ordre, puisque le potentiel en dépend ; les caractéristiques sont des boutons natifs `btn-success` que H5.5 ferait passer en style standard ; H8.2 ramène le malus « -0 » de 15 à 12 px.
- Correction proposée : Classer chaque élément (état, catégorie, action) avant d'appliquer H5.5 et H8.2.
- Résolution : **ouvert** (Q30).

**[Joueur]** — M13. Notifications sur mobile : retour au plateau et critère du popup (§ EXPERIENCE › Parcours 1 ; Q6)
- Constat : Si le téléphone ouvre `/report` dans un onglet séparé, « il revient au plateau » veut dire fermer cet onglet : l'étape n'est pas décrite. Un critère « fenêtre ouverte par le site » vaudrait aussi sur téléphone et y appliquerait les règles ordinateur.
- Correction proposée : Relever sur un téléphone comment s'ouvre `/report` ; pour Q6, retenir un critère qui exclut le téléphone.
- Résolution : **ouvert** (Q17) pour le téléphone ; le critère du popup est résolu par R5 (900×800 sur ordinateur, mobile inchangé).

**[Joueur]** — M14. Trois barres d'outils pour un même geste d'écriture (§ DESIGN et EXPERIENCE › Éditeur de rédaction)
- Constat : Forum mobile : « 5 outils + Plus » ; kramail : 18 boutons natifs en 4 groupes ; ordre Parler : sa propre barre. Le « rendu actuel » fige une incohérence que la mission demande de corriger.
- Correction proposée : Aligner les barres du kramail et de Parler sur celle du forum ?
- Résolution : **ouvert** (Q31).

### Faible (41)

**[Grille › Couverture des parcours]** — Un seul support par étape (§ EXPERIENCE › Key Flows)
- Constat : Le jeu n'est parcouru que sur mobile, le forum que sur ordinateur. Aucun parcours ne passe par H1.4, H1.5, H2.5 et H2.6 côté ordinateur, H6.1, H7.1 côté ordinateur, ni par H12.3, H12.4 et l'index mobile.
- Correction proposée : Faire confirmer par Arnaud que ces surfaces se construisent sur les tables seules, ou ajouter un parcours « ordre sur ordinateur ».
- Résolution : **ouvert** (Q33) : la liste des surfaces construites sur les tables seules attend la confirmation d'Arnaud ; la maquette key-modale-ordre montre désormais la modale sur ordinateur.

**[Grille › Couverture des parcours]** — Le parcours 1 repose sur deux points non vérifiés (§ EXPERIENCE › Parcours 1)
- Constat : Le retour au plateau n'est pas décrit, alors que `/report` s'ouvre en popup 600×600 même en mode mobile. Le climax (« Valider » pleine largeur) dépend de Q17 : les améliorations mobiles de la modale sont peut-être inactives sur un vrai téléphone.
- Correction proposée : Dire comment on revient au plateau ; marquer le parcours 1 comme dépendant de Q17.
- Résolution : **ouvert** (Q17) : la dépendance est écrite au parcours 1 ; l'ouverture et la fermeture de `/report` sur téléphone restent à relever.

**[Grille › Complétude des jetons]** — Hypothèses non marquées dans les composants du frontmatter (§ DESIGN › frontmatter)
- Constat : `button-primary.foreground` et `label-category.foreground` en `{colors.action-ink}` (alors Q1, contre le « blanc » de H8.1), `badge-state` ambre et rouge (Q4) : un lecteur du seul YAML les prenait pour décidées.
- Correction proposée : Commentaire `# [ASSUMPTION] Qn` sur ces lignes.
- Résolution : **résolu** par Q1 (encre d'action validée) et R3 (`badge-state` en `{colors.status-unread}`) ; les hypothèses de couleur restantes portent un commentaire `[ASSUMPTION]`. Reste un cas du même ordre : `character-card.name` encode sans commentaire l'hypothèse du nom en 15 px sur ordinateur (Q7).

**[Grille › Complétude des jetons]** — `primary-strong` a deux valeurs (§ DESIGN › frontmatter, Dériver une variante)
- Constat : `#700b09` (valeur actuelle) dans le frontmatter, `#6f0c0b` par la formule.
- Correction proposée : Une seule valeur.
- Résolution : **corrigé** dans la passe de correction : `#6f0c0b` partout, l'actuel `#700b09` en commentaire.

**[Grille › Complétude des jetons]** — Contrastes sombres des états surévalués (§ DESIGN › Palette d'états)
- Constat : Les bornes ≥ 8,60 / ≥ 10 / ≥ 7,58:1 valent sur `bg-surface` ; sur `bg-elevated`, les minima sont 7,55, 8,77 et 6,65:1. Conformes, mais surévalués.
- Correction proposée : Nommer le fond, ou donner les minima.
- Résolution : **corrigé** dans la passe de correction : la colonne donne les deux minima, sur `bg-surface` et sur `bg-elevated`.

**[Grille › Couverture des composants]** — « Bouton à icône » sans ligne propre (§ DESIGN › Components ; EXPERIENCE › Parcours 3)
- Constat : « Nouveau message » et « Contacts » du kramail (44 px, rayon de 10 à 4 px) sont nommés sans ligne propre.
- Correction proposée : Une ligne, ou une variante du **Bouton standard**.
- Résolution : **ouvert** (Q30).

**[Grille › Couverture des composants]** — Bouton compact sans couleur (§ DESIGN › Bouton compact)
- Constat : La palette réserve le succès aux votes, et une action ordinaire ne prend jamais une couleur d'état : un bouton de vote est-il vert ?
- Correction proposée : Trancher.
- Résolution : **ouvert** (Q9), avec la piste de la relecture joueur : score en succès, boutons en standard.

**[Grille › Couverture des composants]** — Trois règles floues (§ EXPERIENCE › Carte de section, Anneau de focus, Ligne de forum)
- Constat : Cible du repli (en-tête de 48 px ou chevron) ; `:focus` ou `:focus-visible` pour l'anneau ; heure de la ligne de forum (texte natif repris ou calcul).
- Correction proposée : Une phrase pour chacune.
- Résolution : **en partie** — le repli se fait en touchant l'en-tête, chevron compris (corrigé) ; l'heure est ouverte (Q27) ; `:focus` ou `:focus-visible` n'est pas tranché, les spines disent « focus clavier ».

**[Grille › Couverture des états]** — États non cités (§ EXPERIENCE › State Patterns)
- Constat : Lu et non lu des kramails ; modale d'ordre sans pastilles ou avec plusieurs alertes ; franchissement de 768 px pendant une saisie.
- Correction proposée : Une ligne chacun, même « rendu actuel ».
- Résolution : **corrigé** dans la passe de correction : lignes ajoutées pour le kramail, les alertes multiples et la bascule à 768 px ; la modale sans pastilles n'est pas citée.

**[Grille › Couverture des références visuelles]** — Des maquettes contredisent les spines sans mise en garde (§ DESIGN › Teintes du mode clair, Ligne d'objet)
- Constat : h05 garde des panneaux à 4 px, des marges de 10 et 15 px et des valeurs Paradigme Vert voisines mais différentes ; h03 pose la carte de section sans retrait, objet même de Q10.
- Correction proposée : Une mise en garde par lien ; citer h03 dans Q10.
- Résolution : **corrigé** dans la passe de correction : mise en garde de h05 (« les tableaux priment »), h03 citée dans Q10 et à la **Ligne d'objet**.

**[Grille › Couverture des références visuelles]** — Références sans lien, liens fragiles (§ DESIGN › Components)
- Constat : « Maquette : h05. » et « Maquette : h03. » sans lien ; tous les liens visaient `.working/`, que la promotion vers `mockups/` casserait.
- Correction proposée : Liens complets, à réécrire à la promotion.
- Résolution : **corrigé** dans la passe de correction : liens complets ; huit maquettes promues vers `mockups/` et liens réécrits (événement du memlog « Maquettes promues »).

**[Grille › Surcharge et surspécification]** — Questions argumentées deux fois (§ DESIGN › Colors ; EXPERIENCE › Responsive & Platform)
- Constat : Q1 et Q2 exposées dans les deux spines, avec un écart de périmètre ; « Responsive & Platform » répétait Q6, Q7, Q19 et Q17.
- Correction proposée : Un seul exposé, dans « Questions ouvertes », et des renvois ailleurs.
- Résolution : **corrigé** dans la passe de correction : Q1 et Q2 validées et appliquées ; « Responsive & Platform » renvoie à Q7, Q8, Q17, Q19 et Q32 ; Q6 est résolue par R5.

**[Grille › Surcharge et surspécification]** — Sources recopiées (§ EXPERIENCE › Foundation, Responsive & Platform ; DESIGN › Layout & Spacing)
- Constat : La mission dans « Foundation », la procédure de test d'AGENTS.md dans « Vérification », la règle des points de rupture dans les deux spines.
- Correction proposée : Renvoyer à la source.
- Résolution : **en partie** — « Vérification » renvoie à AGENTS.md pour le protocole, les points de rupture tiennent en une ligne avec renvoi ; « Foundation » résume toujours la mission.

**[Grille › Discipline d'héritage]** — `notification-row.text-mobile` lié à un jeton `[ASSUMPTION]` (§ DESIGN › frontmatter)
- Constat : Le jeton `{typography.body-mobile}` dépend de Q8, alors que H14.1 a validé 15 px : si Q8 change, la notification change contre une décision validée.
- Correction proposée : Une valeur propre ou un jeton dédié.
- Résolution : **corrigé** dans la passe de correction : `text-mobile: 15px`, commenté H14.1.

**[Grille › Discipline d'héritage]** — Deux titres de parcours s'écartent du memlog (§ EXPERIENCE › Key Flows)
- Constat : « Déplacement sur mobile » devenait « Changer de pièce », « réponse RP au forum » devenait « Une réponse RP à la Taverne ».
- Correction proposée : Garder les intitulés du memlog.
- Résolution : **corrigé** dans la passe de correction : « Parcours 2 — Réponse RP au forum (ordinateur) », « Parcours 4 — Déplacement (mobile) ».

**[Grille › Adéquation de la forme]** — Titre non canonique pour « Inspiration & Anti-patterns » (§ EXPERIENCE)
- Constat : La section s'intitulait « Références et options écartées » ; une extraction par titre la manquait.
- Correction proposée : Titre canonique, sous-titre français si voulu.
- Résolution : **corrigé** dans la passe de correction : titre « Inspiration & Anti-patterns », sous-titre « Références et options écartées ».

**[Grille › Adéquation de la forme]** — « Variantes de nation » reprend surtout DESIGN (§ EXPERIENCE)
- Constat : Seule la règle « une variante ne change que les couleurs » était nouvelle.
- Correction proposée : Déplacer cette règle dans « Foundation » et réduire la section à un renvoi.
- Résolution : **corrigé** dans la passe de correction : la règle est dans « Foundation › Variantes » ; la section a disparu.

**[Faisabilité]** — L1. Croix de 44×44 au bureau sans titre de modale (§ DESIGN › Modale d'ordre ; H2.6)
- Constat : Sans titre, Bootbox 4.4 place la croix dans le corps, avec `margin-top: -10px` en ligne : agrandie, elle peut chevaucher le premier bloc.
- Correction proposée : Vérifier sur la fixture de H2 ; réserver la place de la croix.
- Résolution : **ouvert** (Q25).

**[Faisabilité]** — L2. Notifications mobiles : le filet « non lu » est sur la cellule de date (§ DESIGN › Ligne de notification ; H14.2)
- Constat : Si la date passe au-dessus du texte, le filet ne couvre plus que la ligne de la date.
- Correction proposée : En mobile, porter le filet sur la ligne ; mettre à jour `report-non-lu.mjs`.
- Résolution : **corrigé** dans la passe de correction : consigné dans « Notes › Tests et fixtures ».

**[Faisabilité]** — L3. Bande vide du `/report` : une marge globale (§ H14.3)
- Constat : La bande vient du `padding-top: 60px` du `body`, prévu pour une barre de navigation que le `/report` n'a pas, et d'un `margin: 10px` en ligne ; d'autres fenêtres sans barre ont sans doute le même défaut.
- Correction proposée : Correction en CSS sous `html.kr-page-report` ; noter les autres fenêtres au prochain inventaire.
- Résolution : **non traité** — la cause n'est pas reprise dans les documents ; H14.3 reste décidée.

**[Faisabilité]** — L4. En-tête de sujet étendu : libellés de catégorie en dur (§ DESIGN › En-tête de sujet ; H12.4)
- Constat : Le JS ne reconnaît que les liens `forum/rp/` et `forum/hrp/`, et n'écrit que « Jeu (RP) » ou « Jeu (HRP) ».
- Correction proposée : Lire le titre de la catégorie dans la liste latérale native, comme le veut AGENTS.md.
- Résolution : **non traité** — rien dans les documents.

**[Faisabilité]** — L5. « ••• » est un glyphe texte, pas une icône (§ DESIGN › Bouton « ••• »)
- Constat : Le « ••• » du forum est du texte ; une icône `fa-ellipsis-h` ne serait pas identique.
- Correction proposée : Reprendre le même glyphe texte dans les boutons du kramail.
- Résolution : **corrigé** dans la passe de correction : « glyphe texte « ••• » du forum » pour tous les boutons « autres actions ».

**[Faisabilité]** — L6. Boutons d'accès rapide présents aussi en mobile (§ DESIGN › Boutons d'accès rapide ; H1.5)
- Constat : Créés sans test de mode et stylés en mobile, ils peuvent coexister avec les onglets (non vérifié) ; leur état actif n'existe pas encore.
- Correction proposée : Dire s'ils sont masqués en mobile ; poser l'état actif par le JS.
- Résolution : **ouvert** (Q30).

**[Faisabilité]** — L7. Icônes de 44×44 des cartes en mobile (§ DESIGN › Carte de personnage ; Parcours 4)
- Constat : Les cartes vont par deux, environ 170 px de large : la rangée tient trois icônes de 44 px ; au-delà, elle passe à la ligne.
- Correction proposée : Relever le nombre maximal d'actions par personnage et prévoir le retour à la ligne.
- Résolution : **non traité** — rien dans les documents.

**[Faisabilité]** — L8. Anneau de focus unique (§ DESIGN › Anneau de focus ; H5.7)
- Constat : `a:hover, a:focus { outline: none }` est global, avec dix autres `outline: none` ; un anneau décalé de 2 px est rogné dans les conteneurs à `overflow`.
- Correction proposée : `:focus-visible`, retrait des `outline: none`, décalage négatif dans ces conteneurs.
- Résolution : **non traité** — les spines disent « focus clavier » sans trancher `:focus-visible`.

**[Faisabilité]** — L9. Dépendances navigateur (§ EXPERIENCE › Responsive & Platform › Vrai téléphone)
- Constat : `color-mix()`, `:has()`, `:focus-visible`, `-webkit-line-clamp`, peut-être les requêtes de conteneur : tous disponibles sur les navigateurs récents. Le navigateur mobile cible n'est pas nommé, alors que Chrome Android n'accepte aucune extension.
- Correction proposée : Nommer le navigateur mobile de référence.
- Résolution : **ouvert** (Q17).

**[Faisabilité]** — L10. « Rien ne recouvre une information » : quelle portée ? (§ EXPERIENCE › Accessibility Floor)
- Constat : Sans limite, la règle vise aussi les éléments fixes existants : barre de navigation, onglets collants, bouton « Remonter », bouton « MC ».
- Correction proposée : La limiter à la modale d'ordre, ou lister les éléments fixes admis.
- Résolution : **corrigé** dans la passe de correction : limitée à l'alerte de la modale (H2.3, R2) et à la saisie (R4).

**[Faisabilité]** — L11. Pastille « ici » à 10,5 px contre le plancher de 12 px (§ DESIGN › Croix directionnelle et pièces)
- Constat : Le « rendu actuel » de la croix contredit « rien sous 12 px » et « pastilles en 12 px ».
- Correction proposée : Une exception écrite, ou le passage à 12 px dans la tâche de H3.1.
- Résolution : **corrigé** dans la passe de correction : la pastille « ici » passe en `{typography.label}` (12 px).

**[Faisabilité]** — L12. Dossiers du kramail en onglets à 375 px (§ DESIGN › Onglets de section ; H13.1)
- Constat : Trois onglets libellés et trois boutons de 44 px ne tiennent pas sur une ligne utile de 343 px.
- Correction proposée : Préciser la disposition : deux rangées, ou barre défilante.
- Résolution : **ouvert** (Q31), avec la disposition de la maquette key-kramail-mobile en `[ASSUMPTION]`.

**[Faisabilité]** — L13. Étiquettes et pastilles : classes natives partagées (§ DESIGN › Étiquette de catégorie, Pastille d'état)
- Constat : `.label` et `.badge` servent à la fois aux catégories, aux compteurs d'état et aux pastilles de niveau.
- Correction proposée : Une liste fermée « élément → famille » dans DESIGN.
- Résolution : **corrigé** dans la passe de correction : liste à établir, consignée dans les Notes.

**[Faisabilité]** — L14. Carte de section : icône et chevron (§ DESIGN et EXPERIENCE › Carte de section)
- Constat : Certains en-têtes natifs n'ont pas d'icône ; le repli posé par le JS ne vaut que pour trois panneaux.
- Correction proposée : « Icône native si elle existe, sinon aucune » ; « chevron seulement si la section se replie ».
- Résolution : **ouvert** (Q30) pour l'icône ; le chevron ne signale qu'une section repliable (corrigé).

**[Faisabilité]** — L15. « Une variante ne change que les couleurs » (§ EXPERIENCE › Foundation)
- Constat : Des règles sombres changent autre chose que la couleur, par exemple `hr` masqué en sombre seulement.
- Correction proposée : Recenser les propriétés non chromatiques des sélecteurs `-dark` avant d'écrire leurs équivalents clairs.
- Résolution : **corrigé** dans la passe de correction : recensement consigné dans « Notes › Listes à établir ».

**[Joueur]** — L1. Anneau de focus rouge sur les champs (§ DESIGN › Anneau de focus)
- Constat : En Kraland et en Ruthvénie, l'accent est rouge : un anneau rouge autour de la réponse RP se lit comme une erreur.
- Correction proposée : Vérifier en Kraland clair sur le champ de réponse.
- Résolution : **ouvert** (Q21).

**[Joueur]** — L2. Bouton standard peu reconnaissable (§ DESIGN › Bouton standard)
- Constat : Bordure à environ 1,4:1 sur blanc en clair, fond de la carte en sombre : « Annuler », « ? Aide », « Voir l'historique » risquent de se lire comme du texte coloré.
- Correction proposée : Vérifier sur la maquette h05 ; sinon, bordure plus marquée.
- Résolution : **ouvert** (Q20).

**[Joueur]** — L3. Jauges sombres voisines des états (§ DESIGN › Jauges ; Q3)
- Constat : En sombre, PP `#ffa726` et alerte `#ffb74d`, PV `#66bb6a` et succès `#81c784` sont presque identiques.
- Correction proposée : Écarter les teintes au moment de valider Q3.
- Résolution : **ouvert** (Q3).

**[Joueur]** — L4. « Nouveau message » reste une icône seule (§ H13.1 ; Parcours 3)
- Constat : H13.1 libelle les dossiers pour ne plus deviner les icônes, mais laisse en icône seule l'action d'écriture, la principale du kramail.
- Correction proposée : Question pour Arnaud.
- Résolution : **ouvert** (Q31).

**[Joueur]** — L5. Éléments `.btn-primary` non cliquables peints comme « Valider » (§ H5.1)
- Constat : Le site pose `.btn-primary` sur des étiquettes d'Événements ; en couleur de nation, elles ressembleront à l'action principale.
- Correction proposée : Repérer les `.btn-primary` sans lien ni action et leur donner le style d'étiquette.
- Résolution : **ouvert** (Q30).

**[Joueur]** — L6. « Succès : votes » est ambigu (§ DESIGN › Palette d'états)
- Constat : Le score d'un message est une information ; les boutons de vote sont des actions : les peindre en succès contredirait H5.5.
- Correction proposée : Score en succès, boutons de vote en bouton compact standard.
- Résolution : **ouvert** (Q9).

**[Joueur]** — L7. Barre du bas des sujets oubliée par H12.4 (§ DESIGN et EXPERIENCE › En-tête de sujet)
- Constat : « Répondre / Nouveau sujet » existe aussi en bas du sujet ; H12.4 ne cite que l'en-tête.
- Correction proposée : Étendre les deux barres à Communauté, Débats et Staff.
- Résolution : **ouvert** (Q28).

**[Joueur]** — L8. Pagination à 44 px hors du forum (§ H9.1)
- Constat : Dix numéros de 44 px ne tiennent pas sur 343 px ; le sous-forum a déjà une pagination condensée « ‹ 1 2 3 … 15 › ».
- Correction proposée : Reprendre ce motif existant ailleurs.
- Résolution : **ouvert** (Q18).

**[Joueur]** — L9. Bâtiments, employés, commerce : pages d'action sans parcours (§ EXPERIENCE › Boucle de jeu ; Q19)
- Constat : Gérer un bâtiment, ses stocks ou ses employés, et acheter au commerce, passe par des tableaux et des champs que rien ne décrit sur mobile.
- Correction proposée : Ces pages comptent-elles dans la boucle ? Si oui, un relevé mobile avant l'implémentation.
- Résolution : **ouvert** (Q19).

### Sans gravité — rapprochement de la mission (15)

**[Mission, à reporter]** — Q1 et Q2 validées, encore présentées comme `[ASSUMPTION]` (§ Bilan ; DESIGN › Colors ; EXPERIENCE › Questions ouvertes)
- Constat : Q1 et Q2, bloquantes dans les documents, étaient validées dans le memlog ; les spines les présentaient encore comme hypothèses.
- Correction proposée : Reporter les décisions.
- Résolution : **corrigé** dans la passe de correction : Q1 et Q2 appliquées dans DESIGN.md (« Texte posé sur la couleur de nation », « Texte en couleur de nation, mode clair ») ; EXPERIENCE.md les dit validées.

**[Mission, partielle]** — Déplacement (§ Exigence 2.3)
- Constat : Aucune décision propre au memlog, seulement le principe et le parcours 4 ; règles reprises de « CX2 » et d'AGENTS.md ; ordinateur au « rendu actuel », sans relevé cité.
- Résolution : **inchangé** — la croix reste au rendu actuel (CX2) en mobile, l'ordinateur au rendu actuel.

**[Mission, partielle]** — Ratios et proportions (§ Exigence 3.3)
- Constat : Nommés une seule fois et traités par des valeurs ; DESIGN.md n'énonce aucune règle de proportion ; interlignage non tranché ; largeurs de colonnes et grilles de cartes sur ordinateur non traitées, sauf la carte de personnage.
- Résolution : **ouvert** (Q18) pour l'interlignage ; toujours aucune règle de proportion.

**[Mission, partielle]** — Cohérence d'une page à l'autre (§ Exigence 3.4)
- Constat : Q18 garde des écarts relevés sans décision : page courante de la pagination (5 rendus), grand titre présent ou absent selon la page, taille du titre de page mobile, interlignage (19 valeurs).
- Résolution : **ouvert** (Q18), complétée de la pagination hors forum et du défilement horizontal de la carte.

**[Mission, écart]** — « Focus visible » ajouté au périmètre d'accessibilité (§ Exigence 6 ; EXPERIENCE › Accessibility Floor)
- Constat : Absent de la liste de la mission ; H5.7 est validée, sa place dans cette section reste à confirmer.
- Résolution : **inchangé** — toujours dans le périmètre de l'« Accessibility Floor », sans confirmation au memlog.

**[Mission, absente]** — Le bénéfice joueur de chaque hypothèse (§ Idées qualitatives (§ 2))
- Constat : Il reste dans le memlog ; les documents ne gardent que la règle et l'identifiant H : sans le memlog, on ne lit plus ce que le joueur y gagne.
- Résolution : **inchangé** — toujours dans le seul memlog.

**[Mission, absente]** — La comparaison avec le rendu natif (§ Idées qualitatives (§ 2))
- Constat : Outil de méthode (bouton de bascule), sans effet sur l'apparence ni sur le comportement.
- Résolution : **sans suite** — aucune correction attendue.

**[Mission, en partie]** — La famille « tableaux » réduite aux en-têtes (§ Idées qualitatives (§ 2))
- Constat : Les marges internes relevées (8/8 ou 10/18 px) ne sont pas citées ; seule la grille H11.2 les couvre.
- Résolution : **ouvert** (Q11) : les cellules de tableau figurent parmi les composants candidats.

**[Mission, sans décision]** — Croix directionnelle et pièces (§ Composants (§ 3) ; DESIGN › Components)
- Constat : Composant existant, décrit au rendu actuel, donc pas un nouveau composant. Risque faible, mais ses valeurs (touches ≥ 48 px, encre ≥ 4,5:1, « ici », pointillé) ne sont pas validées dans cette étude.
- Résolution : **inchangé** — rendu actuel (CX2) ; seule la pastille « ici » passe en 12 px (H8.2).

**[Mission, sans décision]** — Pastilles coût, durée, potentiel au style de l'Étiquette de catégorie (§ Composants (§ 3) ; DESIGN › Pastilles)
- Constat : H8.1 ne prévoit que deux familles et H2.5 renvoie leurs couleurs à la palette ; Q1 suppose un fond de nation, le reste du style n'est pas tranché.
- Résolution : **ouvert** (Q5).

**[Mission, sans décision]** — Bouton standard pour « ••• », la flèche de l'index et « Nouveau sujet » (§ Composants (§ 3))
- Constat : Choix de rédaction dans des composants validés.
- Résolution : **corrigé** dans la passe de correction : marqué `[ASSUMPTION]` dans les trois lignes et listé dans les « autres hypothèses de rédaction ».

**[Mission, sans décision]** — Fond de l'Alerte (§ Composants (§ 3) ; DESIGN › Alerte)
- Constat : H2.3 fixe sa place, H5.5 sa palette ; aucune décision ne fixe son aspect.
- Résolution : **ouvert** (Q3).

**[Mission, contradiction]** — « Aucun fil d'Ariane ajouté » contre l'extension H12.4 (§ Composants (§ 3) ; EXPERIENCE › Fil d'Ariane)
- Constat : H12.4 ajoute un fil d'Ariane sur des pages qui n'en ont pas ; la phrase doit réserver l'exception.
- Correction proposée : Réserver l'exception H12.4.
- Résolution : **corrigé** dans la passe de correction : « sauf par l'extension de l'En-tête de sujet aux sujets de Communauté, Débats et Staff (H12.4) ».

**[Mission, écart]** — 9 variantes annoncées, 16 décrites (§ Autres écarts (§ 4))
- Constat : 8 nations en clair et en sombre, plus `high-contrast`, connue du JS seul.
- Résolution : **ouvert** (Q16).

**[Mission, absente]** — Page Citoyens (§ Autres écarts (§ 4) ; EXPERIENCE › Pages secondaires)
- Constat : Inventoriée, mais absente du tableau des pages secondaires.
- Résolution : **corrigé** dans la passe de correction : ligne « Citoyens » (règles communes seulement).

## Notes mécaniques

- Références `{…}` : toutes résolues dans les deux spines corrigées (contrôle par script de cette synthèse) ; les jokers d'EXPERIENCE (introduction) sont volontaires.
- Composants : 17 clés anglaises dans le frontmatter, toutes citées par leur ligne (`{components.button-compact}` compris, jamais cité dans la version relue) ; 30 lignes, mêmes noms, même ordre dans les deux spines.
- Questions : 28 questions ouvertes (Q3 à Q33, sans Q6, Q13 ni Q15, résolues par R5, R4 et R3) ; chaque question citée a sa ligne ; toutes sont journalisées au memlog (événement « Passe de correction appliquée »). Les « autres hypothèses de rédaction » ne sont pas journalisées.
- Corrigés depuis la grille : `#9966cc` et hex en minuscules partout ; « 22467 MØ » sous une seule graphie ; double sens de `primary-strong` commenté ; classe `kr-theme-variant-kraland` décrite exactement ; « en-tête de section » de h04 signalé à la **Carte de section**.
- Reste : `etude-ux.md` et `_bmad-output/initiative-harmonisation-ux/` ne sont pas suivis par git ; la source `../../../etude-ux.md` manquera sur un autre poste tant qu'ils ne sont pas commités.
- Nouveau : la phrase « Les maquettes de `.working/` sont liées aux sections qu'elles illustrent » (DESIGN, « Brand & Style » ; EXPERIENCE, introduction) précède la promotion : 8 maquettes sont désormais dans `mockups/`.
- Aucun diagramme Mermaid.
- Emplacements : ce rapport cite des sections ; les numéros de ligne des relectures visent la version relue, antérieure à la passe de correction. Les renvois `l.nnn` (CSS) et `Lnnn` (template) restent ceux du 2026-10-19.

## Fichiers de relecture

- `review-rubric.md`
- `review-faisabilite.md`
- `review-joueur.md`
- `reconcile-etude-ux.md`
