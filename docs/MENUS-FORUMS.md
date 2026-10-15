# Menus Forum dynamiques : source, actualisation, repli

Menus concernés (créés par `modifyNavigationMenus`, remplis par `window.updateForum*Menu`) :

| Menu | `data-forums-added` | Catégorie native | Clé de stockage |
|---|---|---|---|
| Forum RP | `rp` | `/forum/rp[/…]` | `kr-forums-v2-rp` |
| Forum HRP | `hrp` | `/forum/hrp[/…]` | `kr-forums-v2-hrp` |
| Forum Communauté | `forum-communaute` | `/forum/communaute[/…]` | `kr-forums-v2-communaute` |
| Forum Débats | `forum-debats` | `/forum/debats[/…]` | `kr-forums-v2-debats` |
| Forum Staff | `forum-staff` | `/forum/staff[/…]` | `kr-forums-v2-staff` |

## Décision d'Arnaud (carte t_64a83f97)

Arnaud a répondu **Oui** à la proposition : le menu de la catégorie visitée est actualisé depuis la **liste latérale native affichée** quand un forum de cette catégorie est visité ; les forums disparus sont retirés, les nouveaux ajoutés ; les autres catégories ne changent pas. Précisions tranchées :

- aucune requête supplémentaire ;
- aucun lien « Tous les forums » imposé (Q1 résolue dans ce périmètre) ;
- le personnage ne compte pas : aucune isolation par personnage (Q2 résolue) ; c'est la liste affichée qui compte ;
- source absente ou illisible : la dernière liste connue est conservée ;
- blocs de la peau et badges exclus ;
- exhaustivité en compte connecté **à vérifier, pas présumée** (voir « Inconnus ») ;
- le développement est autorisé sur la PR #19, **la fusion ne l'est pas**.

## Preuves historiques (relevés hors ligne, aucun compte)

1. **Signalement initial** (t_7efd77f1) : les menus gardaient d'anciennes listes et n'affichaient pas les nouveaux forums. Causes constatées sur fixtures : menu dessiné avant la lecture de la source ; lecture sur la page exacte seulement ; page sans source écrivant une liste vide ; liste sans date jamais périmée ; exclusion par sous-chaîne.
2. **Observation d'Arnaud** (capture « Royaume de Ruthvénie ») : quand on est sur un forum, on voit les autres forums de la catégorie dans la colonne de gauche.
3. **Relevé t_84f1267a** (rapport `RAPPORT-LISTE-NATIVE-FORUMS.md`, @ux) : la liste latérale est du HTML renvoyé par le serveur, présent dans un GET anonyme sans JavaScript ni peau. Structure relevée : `#col-left .list-group > a.list-group-item[href]`, `href` relatifs résolus par `<base>`, titre dans `span.list-group-item.active`, icône dans `span.lefticon`. En anonyme, la liste latérale est identique au tableau de la page catégorie pour RP (3), HRP (5), Communauté (5) et Débats (4) : **cette égalité vient du rapport @ux ; le coach n'a pu la rejouer que sur RP (R3)**, elle n'est donc pas prouvée de façon indépendante pour HRP, Communauté et Débats. Staff : non vérifiable (l'accueil est renvoyé).
4. **Contrôle t_4daa5868** (@coach) : conforme avec sept réserves R1 à R7, reprises ci-dessous.

La copie verbatim de la colonne native sert de fixture : `tests/e2e/fixtures/forum-colonne-native-hrp.html` (5 forums) et `forum-colonne-native-rp.html` (3 forums). Ce sont des relevés anonymes, sans donnée personnelle.

## Source unique : la liste latérale

Le script lit **uniquement** `#col-left .list-group > a.list-group-item[href]`. Le tableau `table.table` de la page catégorie n'est **plus lu**. Raison (R3) : l'égalité tableau / liste latérale n'est prouvée qu'en anonyme ; deux sources non démontrées équivalentes feraient alterner la liste d'une page à l'autre. Si la colonne manque mais que le tableau est présent, le tableau ne prend pas le relais (test M).

Une entrée est retenue si elle remplit toutes ces conditions :

- son `href` est non vide, de **même origine** que la page, et sa destination est sous `/forum/<catégorie>/` (frontière de segment : `/forum/rpx/…` est refusé) ;
- elle n'est pas dans un bloc `.kraland-metrics` de la peau ;
- elle n'est pas désactivée (`.disabled`, `aria-disabled="true"`, `disabled`) ;
- son libellé n'est pas vide, une fois les décorations retirées ;
- son nom n'est pas dans la liste d'exclusion du menu (Taverne, Marché, Monde, Communauté, Débats, Staff, sauf HRP), et sa destination n'est pas déjà lue (doublons fusionnés par chemin normalisé).

## Moment de rafraîchissement

- **Sur toute page de la catégorie** (`/forum/rp`, `/forum/rp/<forum>`, barre finale tolérée) : la liste latérale est lue **avant** les transformations de la peau (`window.captureForumSidebar` est la première transformation de `applyDOMTransformations`), puis le menu de cette catégorie est redessiné. Il est donc à jour dès le premier affichage. Les autres catégories ne changent pas (test L).
- **Ailleurs** : la liste mémorisée est réaffichée telle quelle, **sans requête réseau**. Aucune requête n'est ajoutée sur les pages de forum non plus : un seul document, ni `fetch` ni XHR (test L).
- **Pages de sujet** (`/forum/sujet/…`) et **index** (`/forum`) : aucune lecture. Le DOM d'un sujet n'a pas été relevé (ouvrir un sujet compte une vue et peut toucher le suivi de lecture) ; l'index n'a pour liste latérale que les catégories.
- Un autre onglet qui met la liste à jour (événement `storage`) ou un retour depuis le cache de navigation (`pageshow`) redessine le menu **sans relire** l'ancien DOM restauré. Toute lecture est datée de l'heure murale du chargement de la page (`Date.now() - performance.now()` : `performance.timeOrigin` peut retarder après une veille) et n'écrase pas une entrée plus récente, sauf si celle-ci est datée de plus de 60 s dans le futur. Cette garde de date ne suffit pas pour un **retour arrière servi par le cache HTTP** (C2, QA t_2f4e730e) : le HTML est ancien mais la page se charge « maintenant », la colonne serait datée du retour et écraserait une liste plus récente. Ce cas précis est donc écarté en amont : si `performance.getEntriesByType('navigation')[0]` est de type `back_forward` **et** `transferSize === 0` (aucun octet reçu), la colonne n'est pas lue et la liste mémorisée reste affichée. Navigation normale, rechargement et retour revalidé par le serveur (octets reçus, par exemple `Cache-Control: no-store`) restent lus. Limite : sans liste mémorisée, un tel retour n'en écrit pas ; la prochaine visite normale la crée. Aucune requête ajoutée.
- Les mises à jour dynamiques du site après le chargement (le `main.js` natif contient aussi `updateAjax` et `updateAjaxPost`, qui écrivent un `innerHTML` par identifiant via `ajx/…` : R1) ne sont pas observées : le script lit le HTML au chargement.

## Réserves du coach, reprises explicitement

| Réserve | Traitement |
|---|---|
| **R1** `main.js` ne fait pas que replier la colonne : il contient `updateAjax` / `updateAjaxPost` | Formulation corrigée ici ; le verdict « HTML serveur » n'en dépend pas (la liste est déjà dans le HTML brut). Les remplacements Ajax tardifs ne sont pas lus. |
| **R2** la peau pollue le sélecteur (`relocateKramailToLeft`, `nameLeftSidebarDivs`) | Lecture **avant** la peau ; en plus, exclusion de `.kraland-metrics` et filtre par destination `/forum/<catégorie>/` : Kramail, profil, modérateurs et métriques n'entrent jamais. Test N : lecture identique avant et après la peau, avec fixture `#col-t` et bloc joueur. |
| **R3** égalité tableau/liste non prouvée en compte connecté | Source unique = liste latérale ; le tableau n'est plus une source. L'exhaustivité connectée reste un inconnu (ci-dessous). |
| **R4** entrée grisée « Province Niarkalistan » inexpliquée | **Règle actuelle PROVISOIRE, en attente de la décision d'Arnaud (question Q3, carte t_c1975f06) ; aucune option n'est choisie ici.** Comportement du code : une entrée désactivée (`.disabled`, `aria-disabled="true"`, `disabled`) est **ignorée à la lecture** ; si au moins une autre entrée est lisible, la liste est remplacée sans elle, donc une entrée grisée **déjà mémorisée est retirée du menu** (sonde QA T1) ; si toutes sont grisées, rien ne change. Cela contredit la formule « jamais comptée comme preuve d'absence » écrite à l'origine, qui n'est vraie que pour « toutes désactivées ». Options en discussion (non tranchées) : (a) la garder si elle était déjà mémorisée, (b) la retirer comme aujourd'hui, (c) la proposer comme les autres. Limite : une entrée grisée mais accessible n'est pas proposée (test D). On ne sait pas si Kraland pose `.disabled` sur cette liste. |
| **R5** pastille de guilde d'origine inconnue | Les icônes (`.lefticon`, `i`, `.fa`, `.glyphicon`, `svg`), drapeaux (`img`), badges (`.badge`, `.label`) et éléments dont la classe contient `guild` ou `pastille` sont exclus du libellé ; le texte réel (« Guilde des Marchands ») est conservé (test K). Limite : une pastille en simple texte, sans classe reconnaissable, entrerait dans le libellé. |
| **R6** fixture `sous-forum-debuter.html` fausse (`#col-left` à 2 liens de catégories) | Non modifiée (autres suites). Les tests de ce menu utilisent la colonne native copiée telle quelle (fixtures `forum-colonne-native-*.html`, test O) et une colonne générée au même balisage. |
| **R7** écart de méthode : environ 11 GET anonymes (`curl` / `urllib`) au lieu des fixtures puis du Chrome 9223 | À acter par Arnaud. Sans effet sur le compte. Aucun nouvel accès au vrai site dans ce travail. |

## Source absente, illisible ou ambiguë (repli explicite)

| Situation | Effet |
|---|---|
| Pas de `#col-left`, page de maintenance, de connexion ou d'erreur | **Aucune écriture** : la liste précédente reste proposée |
| `#col-left` sans aucun lien de la catégorie lisible (titre seul, liens tous désactivés, liens vides ou hors catégorie) | **Aucune écriture** : une liste sans lien n'est pas « aucun forum accessible » (indiscernable d'une page dégradée ou d'un état désactivé ambigu) ; le cache n'est jamais effacé par elle |
| Liens de la catégorie lus, tous déjà dans le menu d'origine (RP anonyme : Taverne, Marché, Monde) | **Liste valide sans forum à ajouter** : le stockage est remplacé, le menu affiche le lien de repli, état `empty` |
| Une entrée atypique (ancre sans `href`, lien image sans texte, désactivée) parmi des entrées valides | Entrée ignorée ; les autres sont lues et remplacent la liste (une entrée désactivée déjà mémorisée est donc retirée : règle provisoire, voir R4 et Q3) |
| Retour arrière servi par le cache HTTP (`back_forward`, `transferSize 0`) | **Aucune lecture** : la liste mémorisée, plus récente que l'ancienne colonne, reste proposée (C2) |
| Liste de plus de 24 h | Toujours proposée mais état `stale` |
| Liste de plus de 7 jours | Plus proposée : lien de repli, état `unavailable` |
| Ancienne clé `kr-forums-<menu>` (tableau nu, sans date) | Ignorée puis supprimée |

L'état est exposé sur l'élément `.dropdown-menu` (`data-kr-forums-state` : `fresh`, `stale`, `empty`, `unavailable`).

## Libellés, destinations, doublons

Libellé : texte du lien sans décorations, espaces natifs (tabulations, retours à la ligne) réduits à une espace. `href` : celui de la liste latérale. Doublons de destination fusionnés par chemin normalisé (URL absolue, relative, barre finale), éléments statiques du menu compris. Exclusion par **nom exact** (insensible à la casse), pas par sous-chaîne ; HRP n'exclut rien.

## Comptes et personnages

Le stockage est un `localStorage` **par origine et par navigateur**, pas par compte. Décision d'Arnaud : le personnage ne compte pas ; c'est la liste affichée qui est mémorisée et remplacée à chaque visite de la catégorie. Changer de personnage dans le même navigateur peut montrer la liste du précédent jusqu'à la visite de la catégorie ; l'âge maximal de 7 jours borne l'effet (test G).

## Inconnus et limites (non prouvés)

- **Compte connecté** : l'égalité tableau / liste latérale et l'exhaustivité ne sont pas prouvées (la capture d'Arnaud montre 7 forums RP, l'anonyme 3). Le script lit ce que la colonne affiche ; si elle était partielle pour un compte, le menu le serait aussi. À valider sur le vrai site par Arnaud ou une carte de relevé autorisée.
- **Staff** : accès non vérifié (réservé) ; le menu Staff applique la même lecture sans preuve.
- **DOM d'une page de sujet** : non relevé ; aucune lecture sur les sujets.
- **Liste latérale vidée par une perte totale d'accès** : indiscernable d'une page dégradée ; la liste précédente reste proposée jusqu'à 7 jours.
- **Entrée grisée** : traitement provisoire en attente de Q3 (t_c1975f06) : ignorée, donc retirée du menu si elle y était ; grisée mais accessible : non proposée.
- **Bfcache réel** : Chromium headless renvoie `persisted=false` ; seul le fragment H le simule. Le retour par le cache HTTP, lui, est exercé pour de vrai (fragment P).
- **Pastille en texte brut** : non détectable, entrerait dans le libellé.
- **Changements Ajax tardifs** de la colonne : non observés.
- Cette PR ne prouve pas la résolution du ticket sur le vrai site : seules des fixtures inertes ont été utilisées.

## Tests

`npm run build && node tests/e2e/menus-forums.mjs` (fragments `KR_FRAG=a,…,o`). `KR_CHROMIUM` pointe vers un Chromium local si le navigateur attendu par Playwright manque. Fragments : A ancienne→nouvelle liste ; B libellés, doublons, exclusions ; C liste sans forum à ajouter ; D source absente, ambiguë, périmée ; E second onglet ; F bureau et mobile × deux thèmes ; G autre personnage ; H `pageshow` ; I doublons ; J entrées atypiques ; K décorations et horloges ; L sous-forums, catégories indépendantes, aucune requête de plus ; M source unique ; N lecture avant la peau ; O colonnes natives verbatim ; P retour arrière via le cache HTTP (C2) : serveur `http` local sur port éphémère, `www.kraland.org` résolu vers lui par `--host-resolver-rules` et tout autre hôte introuvable (aucun accès réseau externe), bureau et mobile ; vérifie le retour servi par le cache (`back_forward`, 0 octet, serveur non sollicité), le rechargement, la navigation normale et le retour `no-store` revalidé. Les routes Playwright des autres fragments contournent le cache HTTP, d'où ce serveur réel.
