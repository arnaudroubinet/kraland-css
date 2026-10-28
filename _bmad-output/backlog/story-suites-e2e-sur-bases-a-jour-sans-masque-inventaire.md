# Inventaire du backlog 11 : bases, masques, contrôles absolus, peau coupée, jetons

Relevé fait le 2026-10-25 sur `6270c81` (HEAD de `feature/next`). Lecture seule. Lignes = arbre à ce SHA. Les scripts de relevé sont hors dépôt (`$TMPDIR/b11/detect.mjs` : détecteurs `AVANT_*` appliqués à chaque bundle de base ; `$TMPDIR/b11/jetons.mjs` : comptage `TOKEN_RE` du routeur sur les 25 suites de `SUITES`).

Familles de masque :

- **miroir** : feuille posée par `context.addInitScript(poserJetonsRedefinis, CSS)` (parfois avec un script DOM) sur le seul bundle de base, gardée par `script !== userscript && AVANT_xx(script)`. Le miroir affirme en creux la décision du ticket.
- **neutralisation** : propriété, élément ou origine exclus de la comparaison.
- **transformation** : réécriture de la chaîne du bundle de base (`MEDIAS_TICKET410` via `medias410`).

« A4 » = la condition de retrait renvoie au ticket qui porte l'action A4 de la rétro 5, c'est-à-dire ce ticket.

## §1 Bases `COMMIT_*` par suite

Détecteurs vrais sur chaque bundle (relevé `detect.mjs`) :

| Suite | Constante | SHA | Ligne | Détecteurs vrais sur la base | Périmètre du ticket |
|-------|-----------|-----|-------|------------------------------|---------------------|
| forum-index | `COMMIT_AVANT` | `81512a3` | l.77 | tous | réaligner |
| forum-activite | `COMMIT_AVANT` | `810901f` | l.84 | T67 seul | réaligner |
| forum-activite | `COMMIT_FIL` | `810901f` | l.613 | T67 seul | réaligner |
| forum-activite | `COMMIT_ENTETE` | `810901f` | l.894 | T67 seul | réaligner |
| forum-activite | `COMMIT_PLUS` | `810901f` | l.1224 | T67 seul | réaligner |
| forum-activite | `COMMIT_LIGNE` | `810901f` | l.1479 | T67 seul | réaligner |
| cartes-pastilles | `COMMIT_AVANT` | `21fed8d` | l.78 | T52 à T67 | réaligner |
| cartes-pastilles | `COMMIT_AVANT_53` | `a7f0463` | l.82 | T53 et suivants | garder (base dédiée) |
| cartes-pastilles | `COMMIT_AVANT_54` | `601ab19` | l.86 | T54 et suivants | garder (base dédiée) |
| cartes-pastilles | `COMMIT_AVANT_55` | `59567f0` | l.90 | T55 et suivants | garder (base dédiée) |
| typographie-formes | `COMMIT_AVANT` | `d68ab55` | l.115 | tout sauf T5 | garder (base dédiée) |
| typographie-formes | `COMMIT_BOUTONS` | `4d97496` | l.118 | BUG10, T42 et suivants | garder |
| typographie-formes | `COMMIT_MODALES` | `8631c45` | l.122 | T44 et suivants | garder |
| typographie-formes | `COMMIT_COMPACT` | `3b1da55` | l.126 | (4.4 et suivants) | garder |
| typographie-formes | `COMMIT_ECHELLE` | `fe77411` | l.692 | T45 et suivants | garder |
| typographie-formes | `COMMIT_TICKET6` | `1590761` | l.696 | T48 et suivants | garder |
| typographie-formes | `COMMIT_ECHELLE_FORUM` | `d953969` | l.1008 | BUG10, T47 à T67, T410 | réaligner |
| typographie-formes | `COMMIT_RAYONS` | `5ff22d3` | l.1236 | T48 et suivants | garder |
| typographie-formes | `COMMIT_ESPACEMENT` | `62fd47d` | l.1495 | BUG10, T49 à T67, T410 | réaligner |
| typographie-formes | `COMMIT_NETTOYAGE` | `00b0786` | l.1676 | BUG10, T51 à T67, T410 | réaligner (R1-R6), base dédiée gardée pour M1/M2 (§2.5) |
| typographie-formes | `COMMIT_TITRE_FORUM` | `2db3b4c` | l.2160 | BUG10, T51 à T67 (pas T410) | garder |
| palette-nation | `BASELINE4` | `6685df5` | l.962 | tous | réaligner |
| palette-nation | `BASELINE5` | `d521cc8` | l.1214 | tous | garder (aucun masque posé) |
| kramail-redaction | base auto-référente | `origin/feature/next` | — | — | hors périmètre (A9) |
| cybermonde-carte | base auto-référente | — | — | — | hors périmètre (A9) |

Bundles : `4dde75f` et `6270c81` ont le même bundle (`6270c81` n'ajoute que la rétro). Aucun détecteur n'est vrai sur ce bundle.

Chaque base dédiée gardée a aussi ses variables `KR_SCRIPT_AVANT*`. `cartes-pastilles` lit `KR_SCRIPT_AVANT` pour `COMMIT_AVANT` et pour les trois bases dédiées (l.79, 83, 87).

## §2 Masques par suite

### §2.1 forum-index

`open()` l.87 : injection toujours à `<body>` (MutationObserver l.128-129), sans option `debut`.

| # | Masque | Lieu | Base | Détecteur | Ticket | Ce qu'il neutralise | Condition actuelle |
|---|--------|------|------|-----------|--------|---------------------|--------------------|
| FI1 | `JETONS_REDEFINIS` + `TEXTE_SECONDAIRE_CLAIR` | l.94, option `jetons` | 81512a3 | aucun (posés sans condition) | 3.x | jetons redéfinis et gris secondaire clair | aucune |
| FI2 | `ETIQUETTES_TICKET41` | l.94 | 81512a3 | `AVANT_TICKET41` | 4.1 | étiquettes 12 px gras | aucune |
| FI3 | `BOUTONS_TICKET42` | l.94 | 81512a3 | `AVANT_TICKET42` | 4.2 | boutons | aucune |
| FI4 | `PAGINATION_TICKET44` | l.94 | 81512a3 | `AVANT_TICKET44` | 4.4 | pagination compacte | aucune |
| FI5 | `ECHELLE_TICKET45` | l.94 | 81512a3 | `AVANT_TICKET45` | 4.5 | échelle typographique | aucune |
| FI6 | `ECHELLE_TICKET47` | l.94 | 81512a3 | `AVANT_TICKET47` | 4.7 | échelle du forum | aucune |
| FI7 | `ESPACEMENT_TICKET49` | l.94 | 81512a3 | `AVANT_TICKET49` | 4.9 | grille de 4 px | aucune |
| FI8 | `TITRE_FORUM_BUG10` | l.94 | 81512a3 | `AVANT_BUG10` | bug 10 | titre du forum | aucune |
| FI9 | `CARTES_TICKET51` | l.94 | 81512a3 | `AVANT_TICKET51` | 5.1 | panneaux en carte | aucune |
| FI10 | `CARTES_TICKET52` | l.94 | 81512a3 | `AVANT_TICKET52` | 5.2 | forum en carte | aucune |
| FI11 | `FIL_TICKET63` + `retirerIconeFilTicket63` | l.99-102, option `fil` | 81512a3 | `AVANT_TICKET63` | 6.3 | fil d'Ariane | A4 (l.96) |
| FI12 | `ENTETE_TICKET64` + `filSujetTicket64` | l.107-110 | 81512a3 | `AVANT_TICKET64` | 6.4 | en-tête du sujet | A4 (l.104) |
| FI13 | `PLUS_TICKET65` + `plusTicket65` | l.114-117 | 81512a3 | `AVANT_TICKET65` | 6.5 | bouton « ••• » | A4 (l.111-112) |
| FI14 | `FLECHES_TICKET67` | l.120 | 81512a3 | `AVANT_TICKET67` | 6.7 | flèches de tri à 4 px | A4 (l.118) |
| FI15 | EMPREINTE `paire` | l.609-690 | 81512a3 | (empreinte) | 3.2 | paire de couleurs exclue de l'empreinte | aucune |
| FI16 | EMPREINTE `texteColore` | idem | 81512a3 | (empreinte) | 3.3 | texte coloré exclu | aucune |
| FI17 | EMPREINTE `composantsHerites` | idem | 81512a3 | (empreinte) | 3.4 | composants hérités exclus | aucune |
| FI18 | `COMPOSANTS_TICKET4` + `COMPOSANTS_TICKET5` | l.773 | 81512a3 | `AVANT_TICKET5` pour le second | 3.4, 3.5 | composants | aucune |
| FI19 | EMPREINTE `sujetStandard` | l.778 | 81512a3 | (empreinte) | 6.4 | « Nouveau sujet » standard | aucune |
| FI20 | `COLONNE` : retrait de `data-toggle`, `title`, `data-original-title`, `data-placement` des deux côtés | peau-coupee l.830-866 | page native | — | 6.6 (course) | course des infobulles | « Reports du ticket 6.6 » |
| FI21 | `EXCEPTION_TICKET66` | l.~322-328 | — (pas une base) | — | 6.6 | écart voulu index ↔ sous-forum | décision d'Arnaud sur le sous-forum |

FI20 et FI21 ne sont pas des masques de base. Ils restent (plan, Ask First 4 ; FI21 hors objet).

Comparaisons à la base : `hors-perimetre` l.687-828, checks l.794-808 « rendu identique au bundle « avant » ». Les autres fragments (`mobile` l.371, `bureau` l.471, `seuil` l.573) sont absolus (6.1).

### §2.2 forum-activite

`ouvrir({cle, html, hash, width, height, tactile, variante, theme, src, debut, routes})` l.130 a déjà l'option `debut`.

| # | Masque | Lieu | Base | Détecteur | Ticket | Neutralise | Condition |
|---|--------|------|------|-----------|--------|------------|-----------|
| FA1 | `FLECHES_TICKET67` | l.146-149 | les cinq à `810901f` | `AVANT_TICKET67` | 6.7 | flèches de tri | « seul masque » (en-tête l.50, l.1477-1478) |

Repères (pas des masques, à garder sinon MAX_CITING) : `ACTIVITE_TICKET62`, `REPERES_FIL_TICKET63`, `REPERES_ENTETE_TICKET64`, `REPERES_PLUS_TICKET65`, `REPERES_LIGNE_TICKET66`.

### §2.3 cartes-pastilles

`ouvrir` l.170 : injection à `<body>`. Options `masque`, `plus65` (l.191-197) et `ligne66` (l.198-204).

| # | Masque | Lieu | Base | Détecteur | Ticket | Neutralise | Condition |
|---|--------|------|------|-----------|--------|------------|-----------|
| CP1 | `PLUS_TICKET65` + `plusTicket65` | l.191-197, fragment `forum` | 21fed8d | `AVANT_TICKET65` | 6.5 | bouton « ••• » | A4 |
| CP2 | `LIGNE_TICKET66` + `ligneTicket66` | l.198-204, fragment `lignes` | 21fed8d | `AVANT_TICKET66` | 6.6 | icône de forum, ligne | A4 |
| CP3 | `ORIGINE_TICKET64` | l.516-521 | 21fed8d | `AVANT_TICKET64` | 6.4 | translation des messages du sujet (origine `.media`) | A4 |
| CP4 | `LIGNE_INDEX_TICKET62` (option `masque`) | `lignes` l.647 | 21fed8d | `AVANT_TICKET62` | 6.2 | ligne de l'index de 72 px | A4 |
| CP5 | `sansPnj55` | l.1089-1092 | a7f0463 | `AVANT_TICKET55` | 5.5 | « PNJ » en étiquette | « quand COMMIT_AVANT_53 contient 5.5 » |
| CP6 | `sansPosition55` | l.1481 | 601ab19 | `AVANT_TICKET55` | 5.5 | position de l'étiquette | idem |

Comparaisons à `COMMIT_AVANT` : `comparer` l.522-540 (fragments `forum` et `bureau`, « égaux au bundle de base »), `lignes` l.640-664, `bascule` l.805. Assertions sur les détecteurs : l.1529-1531.

### §2.4 palette-nation

`ouvrir({width, height, variante, theme, url, corps, script, secondaire, cartes, gmErreur, plus65})` l.184 : injection à `<body>` (l.204-210).

| # | Masque | Lieu | Base | Détecteur | Ticket | Neutralise | Condition |
|---|--------|------|------|-----------|--------|------------|-----------|
| PN1 | `TEXTE_SECONDAIRE_CLAIR` (option `secondaire`) | l.193 | 6685df5 | aucun | 3.x | gris secondaire clair | aucune |
| PN2 | `CARTES_TICKET51` + `CARTES_TICKET52` (option `cartes`) | l.203 | 6685df5 | `AVANT_TICKET51`, `_52` | 5.1, 5.2 | cartes | aucune |
| PN3 | `PLUS_TICKET65` + `plusTicket65` (option `plus65`) | l.196-202 | 6685df5 | `AVANT_TICKET65` | 6.5 | « ••• » | A4 |

Usages sur `avant4` : `composantsScenario` l.1025 (`secondaire`), check l.1080 « comme avant le ticket » ; `pages4` l.1150-1160 (`secondaire`, `cartes`, `plus65`), check l.1198 « composants comme avant sauf gris → jetons ».

### §2.5 typographie-formes

| # | Masque | Lieu | Base | Détecteur | Ticket | Neutralise | Condition |
|---|--------|------|------|-----------|--------|------------|-----------|
| TF1 | `CARTES_TICKET54` + `CARTES_TICKET55` | l.323 | d68ab55 | `AVANT_TICKET54`, `_55` | 5.4, 5.5 | cartes | « quand la base contient l'entrée » |
| TF2 | `LEGENDES_TICKET45` | l.539 | 4d97496 et 8631c45 | `AVANT_TICKET45` | 4.5 | légendes | aucune |
| TF3 | miroir `ECHELLE_TICKET45` | l.928-930 | fe77411 | — | 4.5 | check de validation du miroir | aucune |
| TF4 | `medias410` | l.1010-1011 | d953969 | `AVANT_TICKET410` | 4.10 | médias 768/769 décalés | aucune |
| TF5 | fil63, entete64, plus65, ligne66 + `ECHELLE_TICKET47` + `TITRE_FORUM_BUG10` | `echelle-forum` l.1201-1218 | d953969 | `AVANT_TICKET63` à `_66`, `_47`, `BUG10` | 4.7, bug 10, 6.3-6.6 | forum | A4 |
| TF6 | assertion `AVANT_TICKET47(base)` | l.1218 | d953969 | — | 4.7 | (garde-fou) | casse au réalignement |
| TF7 | `medias410` | l.1237 | 5ff22d3 | `AVANT_TICKET410` | 4.10 | médias | aucune |
| TF8 | `medias410` | l.1495-1497 | 62fd47d | `AVANT_TICKET410` | 4.10 | médias | aucune |
| TF9 | `CARTES_TICKET53` | l.1606 | 62fd47d | `AVANT_TICKET53` | 5.3 | groupes du plateau | aucune |
| TF10 | `medias410` → `avantNettoyageDecale` | l.1679 | 00b0786 | `AVANT_TICKET410` | 4.10 | médias (décalage M1/M2) | aucune |
| TF11 | BUG10, 51, 52, 53, 55, 62, 63 (+script), 64 (+script), 65 (+script), 66 (+script), 67 | `ouvrirNettoyage` l.1887-1916 | 00b0786 | détecteurs respectifs | bug 10, 5.x, 6.x | tout | A4 (l.1893 et voisines) |

`GEL_NETTOYAGE` (l.1680) n'est pas un masque : c'est un gel des transitions, posé des deux côtés.

Contrôles de `nettoyage` qui dépendent d'un bundle d'avant 4.10, et passent au rouge si `00b0786` est réaligné sur HEAD :

- l.1944 « base décalée différente de la base » (avec HEAD, `medias410` ne change rien) ;
- l.1953-1956 `change`, check l.2047 « rendu changé par M1/M2 » ;
- l.1959-1965 A8 : `BLOCS_M` (l.1717) lit dans la base les médias 768/769, check l.2042 `a8.blocs === 3`.

Assertions sur les détecteurs : `titre-forum` l.2171-2175 (base `2db3b4c`, gardée).

### §2.6 Constantes de `lib/variantes.mjs` et leurs utilisateurs

Utilisées par `kramail-redaction` (hors périmètre, A9), donc gardées : `JETONS_REDEFINIS`, `TEXTE_SECONDAIRE_CLAIR`, `COMPOSANTS_TICKET4`, `ECHELLE_TICKET45`, `ECHELLE_TICKET47`, `RAYONS_TICKET48`, `ESPACEMENT_TICKET49`, `AVANT_TICKET45`, `_47`, `_48`, `_49`.

Utilisateur unique `forum-index`, à supprimer avec FI2-FI4, FI18 : `ETIQUETTES_TICKET41`, `AVANT_TICKET41`, `BOUTONS_TICKET42`, `AVANT_TICKET42`, `PAGINATION_TICKET44`, `AVANT_TICKET44`, `COMPOSANTS_TICKET5`, `AVANT_TICKET5`.

Utilisateurs `forum-index`, `cartes-pastilles`, `palette-nation`, `typographie-formes`, `forum-activite` seuls. Ils sont supprimables si plus aucun usage ne reste après les retraits :

- `LIGNE_INDEX_TICKET62`, `AVANT_TICKET62` ;
- `FIL_TICKET63`, `retirerIconeFilTicket63`, `AVANT_TICKET63` ;
- `ENTETE_TICKET64`, `filSujetTicket64`, `AVANT_TICKET64` ;
- `PLUS_TICKET65`, `plusTicket65`, `AVANT_TICKET65` ;
- `LIGNE_TICKET66`, `ligneTicket66`, `AVANT_TICKET66` ;
- `FLECHES_TICKET67`, `AVANT_TICKET67`.

Ils restent si la base dédiée M1/M2 de `nettoyage` en garde l'usage (plan, Ask First 2).

Sans utilisateur aujourd'hui : `REGLES_CARTE_TICKET51`, `RETRAITS_TICKET49`, `ECARTS_TICKET49`. Hors objet : non touchés, signalés.

Conditions dans `variantes.mjs` :

- « détecteur l'éteint » pour 5.1 à 5.5 (l.365, 410, 450, 489, 529) ;
- « A4 » pour 6.2 à 6.7 (l.566, 612-614, 900-902, 1001-1004, 1073-1075, 1130-1136) ;
- aucune condition sur les masques des épopées 3 et 4.

## §3 Décisions et contrôles absolus

Une décision est « couverte » si un contrôle absolu (valeur, mesure, jeton, contraste) la prouve sur le bundle courant, sans comparaison à une base d'avant le ticket.

| Décision | Contrôle absolu aujourd'hui | Couverte |
|----------|-----------------------------|----------|
| 3.2 paire de couleurs | palette-nation l.520-546 | oui |
| 3.3 liens et texte coloré | palette-nation `largeurs` l.598 (liens en `text-accent`, jetons = DESIGN.md) | oui |
| 3.4 composants (fixture composants) | palette-nation l.1067, 1072, 1087 (aucun gris de Bootstrap), 1095 (#636a77) | oui |
| 3.4 composants (pages de référence `pages4`) | aucun : seul l.1198 « composants comme avant sauf gris → jetons », relatif à `6685df5` | **manquant** |
| 3.x tableau de palette (l.1080 « comme avant le ticket ») | décision de non-changement | sans objet : devient garde de régression |
| 3.5 | base `d521cc8` gardée, sans masque | hors objet |
| 4.1 étiquettes | typographie-formes l.295, 306, 326, 370, 403 | oui |
| 4.2 boutons | typographie-formes l.546, 557, 589 | oui |
| 4.4 compact (12 px) | comparé à `COMMIT_COMPACT` (base gardée) ; jetons l.139 et l.671 | base non réalignée : pas requis. À confirmer en T1 : un check absolu 12 px sur la pagination (sinon, ajout) |
| 4.5 échelle | typographie-formes l.803-904, 993 | oui |
| 4.7 échelle du forum | typographie-formes l.1172, 1180 | oui |
| 4.8 rayons | typographie-formes l.294, 1448, 1477, 1484 | oui |
| 4.9 espacement | typographie-formes l.1562, 1624, 1663 | oui |
| 4.10 médias et nettoyage | l.2142 (aucun média max-width 768 ni min-width 769), l.2033, R4 l.2050, R6 l.2109, A3 l.2143/2153 ; M1/M2 : A8 l.2042 (relatif à la base 769 de `00b0786`) | oui, si la base dédiée M1/M2 reste |
| bug 10 titre du forum | typographie-formes l.2171, 2189, 2215 | oui |
| 5.1 panneaux en carte | cartes-pastilles l.373, 440, 487-505 | oui |
| 5.2 forum en carte | cartes-pastilles l.416, 551, 572, 658, 695 | oui |
| 5.3 groupes du plateau | cartes-pastilles l.956-1038 | oui |
| 5.4 pastilles | cartes-pastilles l.1247-1329 | oui |
| 5.5 étiquettes | cartes-pastilles l.1493-1593 ; contraste l.1695-1718 | oui |
| 6.1 index du forum | forum-index `mobile` l.371, `bureau` l.471, `seuil` l.573 ; `hors-perimetre` = non-changement | oui |
| 6.2 lignes (≥ 72 px, flèche ≥ 44) | forum-activite l.402, 452 | oui |
| 6.3 fil | forum-activite l.669-798 (dont L4 l.717) | oui |
| 6.4 en-tête du sujet | forum-activite l.954-1127 | oui |
| 6.5 bouton « ••• » | forum-activite l.1288-1464 | oui |
| 6.6 ligne de forum | forum-activite l.1623, 1630, 1640, 1645, 1665 | oui |
| 6.7 flèches de tri à 4 px | sous-forum l.572, 591 ; forum-activite l.1734 (→ 32 px) | oui |

Contrôles absolus manquants : 1 sûr (3.4 sur `pages4`), 1 à confirmer (4.4 en 12 px absolu, pas requis par ce ticket).

## §4 Contrôles de peau coupée mobile

| Suite, fragment | Lieu | Largeurs | Ce qui est comparé | Injection | Exposé à la course |
|-----------------|------|----------|--------------------|-----------|--------------------|
| forum-index `peau-coupee` | l.830-866 | 375 (MOBILE) et 1440 (BUREAU) | DOM de la colonne (`COLONNE`) : `src: null` contre `theme: false` | `<body>` | **oui** : seul contrôle mobile qui compare du DOM avec injection à `<body>` ; tient par le retrait des attributs (FI20) |
| forum-activite `ancres` | l.275 | 375 | thème absent, hash, message dans la fenêtre | `<body>` | non : pas de comparaison de DOM |
| forum-activite `ligne` | l.1692-1717 (check l.1705) | mobile | DOM | `debut: true` | déjà traité |
| palette-nation `peau-coupee` | l.1631-1650 | mobile et bureau | couleurs absolues | `<body>` | non : pas de DOM |
| palette-nation `largeurs` | l.598 | — | peau active | — | non |
| modale-ordre | — | 1280 seul | — | `PLATEAU_DEBUT` (déjà début) | hors point 3 (ordinateur) |
| kramail-redaction | — | 1280 seul | — | — | hors périmètre et ordinateur |
| messages-v3 `theme: false` | — | — | page native sans script | — | pas un contrôle de peau coupée |

Technique de référence (forum-activite) :

- `enTete(html)` insère `<script>window.__krScriptTete = true;</script>` après `<meta charset="utf-8">`, et lève une erreur si la balise manque ;
- dans le script d'init, avec `debut`, l'`eval` part dès que `document.documentElement` existe ;
- `window.__krInjection = {body, largeur}` est vérifié par `etatInjection`.

Les fixtures de forum-index (`forum-index-rp`, `forum-index-communaute`, `forum-racine-groupes`, `forum-racine`) portent toutes `<meta charset="utf-8">`.

## §5 Jetons du routeur proches de 4 suites

Routeur : `MAX_CITING = 3` (`lib/router.mjs` l.261), `TOKEN_RE = /[A-Za-z][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+/g` (l.262). Seuls les 25 fichiers de `SUITES` (l.18) comptent ; `lib/variantes.mjs` ne compte pas.

75 jetons sont à 3 suites et touchent les suites visées. Ne pas les écrire en clair dans une suite visée qui ne les cite pas déjà. Les plus exposés :

- `run-at` (demarrage-mobile, modale-ordre, forum-activite) : ne pas écrire « @run-at » dans forum-index ; dire « en début de document » ;
- `forum-sujet`, `forum-racine-groupes`, `forum-index-communaute`, `kr-page-forum-index`, `forum-mobile-breadcrumb`, `panel-default`, `forum-card`, `forums-cards-container`, `fx-permanents`, `permanent-topic-stats` ;
- `kr-text-secondary`, `kr-text-primary`, `kr-text-nation`, `kr-highlight-reverse`, `kr-alert-info`, `kr-btn-shadow` ;
- `taverne-10101`, `marche-10102` ;
- `border-top-color`, `margin-left`, `min-height`, `table-row` ;
- `data-placement`, `data-original-title` ;
- `N-1`.

Déjà à 4 ou plus (non bloquants, la règle ne vise que le passage de 3 à 4) : `document-start` (4), `page-forum` (4), `forum-index` (4), `data-toggle` (7).

Relevé : `node "$TMPDIR/b11/jetons.mjs" <racine> <suites visées> <jetons>`. À refaire sur l'arbre fini.
