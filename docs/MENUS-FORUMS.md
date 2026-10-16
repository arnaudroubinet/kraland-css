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
- **Q3 (carte t_c1975f06), verbatim** : « Non si on as perdu l'accès, il faut le retirer. On cherche pas à référencer les forums auquel on accède pas. » Les forums sans accès sont donc **retirés** du menu et jamais ajoutés (voir « Q3 : forum sans accès » ci-dessous) ;
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
- elle n'est pas désactivée (`.disabled`, `aria-disabled="true"`, `disabled`) : une entrée désactivée est **retirée** (Q3), jamais ajoutée ;
- son libellé n'est pas vide, une fois les décorations retirées ;
- son nom n'est pas dans la liste d'exclusion du menu (Taverne, Marché, Monde, Communauté, Débats, Staff, sauf HRP), et sa destination n'est pas déjà lue (doublons fusionnés par chemin normalisé).

## Q3 : forum sans accès (décision d'Arnaud, appliquée)

Principe d'Arnaud : on ne référence pas les forums auxquels on n'accède pas. Les règles ci-dessous en sont **l'application technique** (le principe vient d'Arnaud ; la lecture « entrée désactivée = accès perdu » et ses signaux sont ceux du développement, pas une information de Kraland).

| Situation de la liste latérale | Effet |
|---|---|
| Entrée de la catégorie **explicitement désactivée** (`.disabled`, `aria-disabled="true"`, attribut `disabled`) parmi des entrées accessibles (liste mixte) | Entrée **retirée** du menu et du stockage ; jamais ajoutée si elle n'était pas connue ; les autres sont lues |
| **Toutes** les entrées de la catégorie sont désactivées | Source exploitable qui démontre l'absence d'accès : le stockage devient une liste vide valide, le menu n'affiche plus que le lien vers la page de catégorie (état `empty`). **Aucun maintien de l'ancienne liste** |
| Après un « tout désactivé », la source est absente ou illisible | La dernière liste connue (vide) est conservée : rien n'est réintroduit |
| L'accès revient (entrées de nouveau actives) | Elles sont de nouveau lues et proposées : la liste affichée fait foi dans les deux sens |
| Même destination à la fois active et désactivée | L'entrée active prouve l'accès, elle reste |
| Entrée seulement **grisée** (style, `opacity`, `text-muted`, `pointer-events`, survol) sans signal explicite | **Pas une preuve** d'accès perdu : l'entrée reste proposée |
| Entrées désactivées **hors catégorie** seulement (Kramail, autre catégorie, bloc `.kraland-metrics`) | Ce ne sont pas des forums de la catégorie : aucune preuve, liste conservée |
| Pas de `#col-left`, maintenance, connexion, erreur, aucun lien de la catégorie | Source absente ou illisible : **aucune écriture**, liste conservée (validé par Arnaud) |
| **Raccourcis fixes RP** (Taverne, Marché, Monde ; ce sont des forums RP, pas la barre `monde/evenements`) dont la destination normalisée est explicitement désactivée dans la liste latérale | **Retirés** du menu, sur toute page (pas seulement RP), même si la liste mémorisée est périmée ou indisponible. Refus conservés (champ `denied`) = refus mémorisés ∪ nouveaux refus − destinations explicitement actives lues. Application du même principe d'Arnaud (accès perdu = retrait), sans nouvelle décision. Le séparateur d'origine ne reste que derrière un raccourci conservé. « Autre » (page de catégorie) reste comme lien de repli quand la liste est vide |
| Raccourci fixe : destination seulement **absente** d'une liste, liste partielle, ou gris, sans refus préalable | **Pas une preuve** de refus : le raccourci reste (jamais refusé) |
| Raccourci fixe déjà refusé, puis destination **absente** d'une liste lue, liste périmée (> 7 jours) ou état `unavailable` | **Pas une preuve d'accès** : le refus est conservé, le raccourci reste retiré |
| Raccourci fixe refusé, puis entrée **active** de la même destination dans une colonne lue (y compris active + désactivée) | Seule preuve d'accès : le refus est levé, le raccourci revient à la lecture suivante |

Le lien vers la page de catégorie (« Autre » en RP, « Voir tous les forums » ailleurs) est un lien statique de repli, pas un forum référencé : il n'est ajouté que quand la liste est vide.

**Limites connues du refus des raccourcis** : le refus est mémorisé par navigateur, pas par compte (décision d'Arnaud : le personnage ne compte pas) ; seule une entrée active de la même destination le lève, sans question à l'utilisateur. Un stockage illisible ou d'un format inconnu perd les refus (limite assumée, sans cascade).

**Ce qu'on ne sait pas, sans accès au site** : Kraland pose-t-il réellement `.disabled`, `aria-disabled` ou `disabled` sur une entrée de la liste latérale quand l'accès est perdu ? La capture de « Province Niarkalistan » (grisée) n'a pas d'explication relevée. Une perte d'accès qui fait **disparaître** le lien, sans le désactiver, est indiscernable d'une page dégradée : la liste précédente reste proposée jusqu'à 7 jours. À vérifier en session connectée (S21).

## Moment de rafraîchissement

- **Sur toute page de la catégorie** (`/forum/rp`, `/forum/rp/<forum>`, barre finale tolérée) : la liste latérale est lue **avant** les transformations de la peau (`window.captureForumSidebar` est la première transformation de `applyDOMTransformations`), puis le menu de cette catégorie est redessiné. Il est donc à jour dès le premier affichage. Les autres catégories ne changent pas (test L).
- **Ailleurs** : la liste mémorisée est réaffichée telle quelle, **sans requête réseau**. Aucune requête n'est ajoutée sur les pages de forum non plus : un seul document, ni `fetch` ni XHR (test L).
- **Pages de sujet** (`/forum/sujet/…`) et **index** (`/forum`) : aucune lecture. Le DOM d'un sujet n'a pas été relevé (ouvrir un sujet compte une vue et peut toucher le suivi de lecture) ; l'index n'a pour liste latérale que les catégories.
- Un autre onglet qui met la liste à jour (événement `storage`) ou un retour depuis le cache de navigation (`pageshow`) redessine le menu **sans relire** l'ancien DOM restauré. Toute lecture est datée de l'heure murale du chargement de la page (`Date.now() - performance.now()` : `performance.timeOrigin` peut retarder après une veille) et n'écrase pas une entrée plus récente, sauf si celle-ci est datée de plus de 60 s dans le futur. Cette garde de date **ne suffit pas** pour une page **servie par le cache HTTP** (C2 pour le retour arrière, QA t_2f4e730e ; N1 pour la navigation normale, QA t_77180d9f) : le HTML est ancien mais la page se charge « maintenant », sa colonne serait datée du chargement et écraserait une liste plus récente lue sur une autre page. Ce cas est donc écarté en amont, **quel que soit le type de navigation** : si `performance.getEntriesByType('navigation')[0]` indique `transferSize === 0` **et** `encodedBodySize > 0` (aucun octet reçu pour un document qui a un corps), la colonne n'est pas lue et la liste mémorisée reste affichée. Une entrée plus récente n'est donc écrasée ni par une lecture plus ancienne (garde de date, hors entrée datée de plus de 60 s dans le futur) ni par la colonne d'une page servie par le cache (garde ci-dessus, hors mesure non fiable) ; ce n'est pas une garantie absolue. Sont lus : navigation vers une page non mise en cache, rechargement (le navigateur redemande la page : octets reçus), retour ou navigation revalidés par le serveur (réponse 200, ou 304 : les en-têtes comptent des octets). Fiabilité de la mesure : `transferSize` vaut aussi 0 quand le navigateur ne renseigne rien ; `encodedBodySize > 0` écarte ce cas (alors lecture normale, comme avant la garde : le risque d'écrasement par une colonne ancienne revient, sans pire). Limites : sans liste mémorisée, une page servie par le cache n'en écrit pas ; la prochaine visite non servie par le cache la crée. Les en-têtes réels de Kraland (`Cache-Control`, `Last-Modified`, `ETag`, session) sont **inconnus** : l'exposition réelle à ce cas n'est pas établie, la garde est préventive et testée sur quatre profils d'en-têtes locaux. Aucune requête ajoutée.
- Les mises à jour dynamiques du site après le chargement (le `main.js` natif contient aussi `updateAjax` et `updateAjaxPost`, qui écrivent un `innerHTML` par identifiant via `ajx/…` : R1) ne sont pas observées : le script lit le HTML au chargement.

## Réserves du coach, reprises explicitement

| Réserve | Traitement |
|---|---|
| **R1** `main.js` ne fait pas que replier la colonne : il contient `updateAjax` / `updateAjaxPost` | Formulation corrigée ici ; le verdict « HTML serveur » n'en dépend pas (la liste est déjà dans le HTML brut). Les remplacements Ajax tardifs ne sont pas lus. |
| **R2** la peau pollue le sélecteur (`relocateKramailToLeft`, `nameLeftSidebarDivs`) | Lecture **avant** la peau ; en plus, exclusion de `.kraland-metrics` et filtre par destination `/forum/<catégorie>/` : Kramail, profil, modérateurs et métriques n'entrent jamais. Test N : lecture identique avant et après la peau, avec fixture `#col-t` et bloc joueur. |
| **R3** égalité tableau/liste non prouvée en compte connecté | Source unique = liste latérale ; le tableau n'est plus une source. L'exhaustivité connectée reste un inconnu (ci-dessous). |
| **R4** entrée grisée « Province Niarkalistan » inexpliquée | **Tranché par Arnaud (Q3, carte t_c1975f06)** : une entrée dont l'accès est perdu est retirée, jamais référencée. Application : voir « Q3 : forum sans accès ». Une entrée **explicitement désactivée** (`.disabled`, `aria-disabled="true"`, `disabled`) est retirée de la liste mixte, et si toutes le sont la liste devient vide, sans maintien de l'ancienne ni réintroduction. Un simple gris (style, survol) **n'est pas** une preuve. On ne sait pas si Kraland pose ces signaux sur cette liste (à vérifier en S21). |
| **R5** pastille de guilde d'origine inconnue | Les icônes (`.lefticon`, `i`, `.fa`, `.glyphicon`, `svg`), drapeaux (`img`), badges (`.badge`, `.label`) et éléments dont la classe contient `guild` ou `pastille` sont exclus du libellé ; le texte réel (« Guilde des Marchands ») est conservé (test K). Limite : une pastille en simple texte, sans classe reconnaissable, entrerait dans le libellé. |
| **R6** fixture `sous-forum-debuter.html` fausse (`#col-left` à 2 liens de catégories) | Non modifiée (autres suites). Les tests de ce menu utilisent la colonne native copiée telle quelle (fixtures `forum-colonne-native-*.html`, test O) et une colonne générée au même balisage. |
| **R7** écart de méthode : environ 11 GET anonymes (`curl` / `urllib`) au lieu des fixtures puis du Chrome 9223 | À acter par Arnaud. Sans effet sur le compte. Aucun nouvel accès au vrai site dans ce travail. |

## Source absente, illisible ou ambiguë (repli explicite)

| Situation | Effet |
|---|---|
| Pas de `#col-left`, page de maintenance, de connexion ou d'erreur | **Aucune écriture** : la liste précédente reste proposée |
| `#col-left` sans aucun lien de la catégorie (titre seul, liens vides, hors catégorie), ni accessible ni explicitement désactivé | **Aucune écriture** : une liste sans lien n'est pas « aucun forum accessible » (indiscernable d'une page dégradée) ; le cache n'est jamais effacé par elle. Des liens de la catégorie **explicitement désactivés** sont, eux, une source exploitable : voir Q3 |
| Liens de la catégorie lus, tous déjà dans le menu d'origine (RP anonyme : Taverne, Marché, Monde) | **Liste valide sans forum à ajouter** : le stockage est remplacé, le menu affiche le lien de repli, état `empty` |
| Une entrée atypique (ancre sans `href`, lien image sans texte) parmi des entrées valides | Entrée ignorée ; les autres sont lues et remplacent la liste |
| Une entrée explicitement désactivée de la catégorie, seule ou avec d'autres | Retirée (Q3) : voir « Q3 : forum sans accès » |
| Page servie par le cache HTTP (`transferSize 0` avec un corps, retour arrière ou navigation normale) | **Aucune lecture** : la liste mémorisée, plus récente que l'ancienne colonne, reste proposée (C2, N1) |
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
- **Entrée désactivée sans `href`, ou rendue en `<span>`** : non identifiée aujourd'hui (le marqueur n'est lu que sur les `a[href]` de la catégorie) ; son sens natif est inconnu sans S21, aucun code inventé.
- **Liste latérale vidée par une perte totale d'accès sans entrée désactivée** (liens qui disparaissent) : indiscernable d'une page dégradée ; la liste précédente reste proposée jusqu'à 7 jours.
- **Signal réel de perte d'accès** : on ignore si Kraland pose `.disabled`, `aria-disabled` ou `disabled` ; si le grisé de « Province Niarkalistan » en est un (ou un simple style, auquel cas l'entrée reste proposée) ; si un forum sans accès apparaît du tout dans la liste d'un compte connecté. Aucun accès au site dans ce travail : à relever en session connectée (S21).
- **En-têtes HTTP réels de Kraland** (`Cache-Control`, `Last-Modified`, `ETag`, session) : inconnus. Le cas N1 (page servie par le cache) est couvert préventivement ; on ne sait pas s'il se produit sur le vrai site.
- **Bfcache réel** : le fragment H le simule (événement `pageshow` avec `persisted`). La QA l'a prouvé en vrai (t_77180d9f) avec Chromium complet (`channel: 'chromium'`), `ignoreDefaultArgs` pour retirer `--disable-back-forward-cache` que Playwright ajoute par défaut, et `goBack` en mode `commit` : `persisted=true`, aucune relecture, menu = liste récente. Ces preuves sont celles de la QA, non rejouées dans la suite. Le Chromium headless-shell que la suite utilise par défaut refuse le bfcache, et Playwright le désactive de toute façon : ce n'est pas une impossibilité du mode headless. Le retour par le cache HTTP est exercé pour de vrai (fragments P et Q).
- **Pastille en texte brut** : non détectable, entrerait dans le libellé.
- **Changements Ajax tardifs** de la colonne : non observés.
- Cette PR ne prouve pas la résolution du ticket sur le vrai site : seules des fixtures inertes ont été utilisées.

## Tests

`npm run build && node tests/e2e/menus-forums.mjs` (fragments `KR_FRAG=a,…,s`, soit a à s). `KR_CHROMIUM` pointe vers un Chromium local si le navigateur attendu par Playwright manque. Fragments : A ancienne→nouvelle liste ; B libellés, doublons, exclusions ; C liste sans forum à ajouter ; D source absente, ambiguë, périmée ; E second onglet ; F bureau et mobile × deux thèmes ; G autre personnage ; H `pageshow` ; I doublons ; J entrées atypiques ; K décorations et horloges ; L sous-forums, catégories indépendantes, aucune requête de plus ; M source unique ; N lecture avant la peau ; O colonnes natives verbatim ; P retour arrière via le cache HTTP (C2) : serveur `http` local sur port éphémère, `www.kraland.org` résolu vers lui par `--host-resolver-rules` et tout autre hôte introuvable (aucun accès réseau externe), bureau et mobile ; vérifie le retour servi par le cache (`back_forward`, 0 octet, serveur non sollicité), le rechargement, la navigation normale et le retour `no-store` revalidé ; Q navigation normale servie par le cache HTTP (N1), même serveur local : parcours A → B → clic sur A avec quatre profils d'en-têtes (`max-age`, `Last-Modified` seul, session PHP `no-store, no-cache`, `ETag` + `no-cache`), bureau et mobile ; vérifie la liste récente conservée quand A vient du cache (0 octet, serveur non sollicité), la colonne lue quand A est redemandée, le rechargement, une page jamais vue, deux catégories indépendantes, et la fiabilité de la mesure (stub de `transferSize` / `encodedBodySize`) ; R Q3 : liste mixte et tout désactivé pour les trois signaux (`.disabled`, `aria-disabled`, `disabled`), pas de réintroduction (autre page, source absente), accès rétabli, cinq catégories indépendantes, forum désactivé jamais connu, même destination active et désactivée, simple grisé conservé, désactivés hors catégorie ; S raccourcis fixes RP (M1) : Taverne refusée seule, tout refusé (« Autre » seul, sans séparateur orphelin), hors page RP, autre catégorie, source absente, retour d'accès (entrée active), refus conservé après absence et après liste périmée, active + désactivée, destination absente ou active non refusée, autres catégories inchangées, et lien de `.kraland-metrics` ignoré (S2, scénario où Taverne n'est pas dans la liste : sans l'exclusion, le test échoue). Les routes Playwright des autres fragments contournent le cache HTTP, d'où ce serveur réel.
