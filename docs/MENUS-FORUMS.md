# Menus Forum dynamiques : source, actualisation, repli

Menus concernés (créés par `modifyNavigationMenus`, remplis par `window.updateForum*Menu`) :

| Menu | `data-forums-added` | Page source native | Clé de stockage |
|---|---|---|---|
| Forum RP | `rp` | `/forum/rp` | `kr-forums-v2-rp` |
| Forum HRP | `hrp` | `/forum/hrp` | `kr-forums-v2-hrp` |
| Forum Communauté | `forum-communaute` | `/forum/communaute` | `kr-forums-v2-communaute` |
| Forum Débats | `forum-debats` | `/forum/debats` | `kr-forums-v2-debats` |
| Forum Staff | `forum-staff` | `/forum/staff` | `kr-forums-v2-staff` |

## Causes constatées sur fixtures

1. Les menus étaient dessinés (`applyDOMTransformations`) **avant** que la liste de la page ne soit lue (`InitQueue`, priorité 5) : sur la page source, le menu affichait encore la liste précédente ; la nouvelle n'apparaissait qu'à la page suivante (test A, rouge puis vert).
2. La liste n'était lue que sur la page source **exacte** (`/forum/rp`, sans barre finale).
3. Une page sans tableau (maintenance, déconnexion) pouvait écrire `[]`, confondue avec « aucun forum accessible » ; une liste sans date ne pouvait jamais être jugée périmée : un joueur qui ne revisite pas la page source gardait indéfiniment une ancienne liste.
4. Le filtrage par sous-chaîne (`includes('monde')`, `includes('staff')`…) masquait tout forum dont le nom contient « Monde », « Staff »… : un nouveau forum pouvait ne jamais apparaître.

Non vérifié sur le vrai site (fixtures seulement, aucun compte) : la forme du tableau natif réel (`table.table tbody tr td:first-child a`) reste celle déjà utilisée par le script.

## Moment de rafraîchissement

- **Sur la page source** (barre finale tolérée) : lecture du tableau natif juste avant le dessin du menu ; le menu de cette page est donc déjà à jour.
- **Ailleurs** : la liste mémorisée est réaffichée telle quelle, **sans requête réseau**. Une relecture de fond (GET de la page source) a été essayée puis retirée : elle faisait échouer les suites qui exigent zéro requête hors fixture, et n'est pas vérifiable sans le vrai site. Elle reste une piste si Arnaud la souhaite.
- Un autre onglet qui met la liste à jour (événement `storage`) ou un retour depuis le cache de navigation (`pageshow`) redessine le menu **sans relire** l'ancien DOM restauré. Toute lecture est datée du chargement de la page (`performance.timeOrigin`) et n'écrase jamais une entrée plus récente.
- Le script ne détecte **aucun** changement de droits sans relire cette source native : la liste ne change qu'à la visite de la page source.

## Source indisponible ou incomplète (repli explicite)

| Situation | Effet |
|---|---|
| Tableau présent, aucune ligne de forum | **Liste vide valide** : le stockage est vidé, le menu affiche le lien de repli, état `empty` |
| Pas de tableau, ou lien sans destination | **Aucune écriture** : la liste précédente reste proposée |
| Liste de plus de 24 h | Toujours proposée mais état `stale` |
| Liste de plus de 7 jours | Plus proposée : lien de repli, état `unavailable` |
| Ancienne clé `kr-forums-<menu>` (tableau nu, sans date) | Ignorée puis supprimée |

L'état est exposé sur l'élément `.dropdown-menu` (`data-kr-forums-state` : `fresh`, `stale`, `empty`, `unavailable`).

## Libellés, destinations, doublons

Libellé et `href` suivent le tableau natif ; les doublons de destination sont fusionnés par chemin normalisé (URL absolue, relative, barre finale), éléments statiques du menu compris ; l'exclusion (Taverne, Marché, Monde, Communauté, Débats, Staff) se fait par **nom exact** (insensible à la casse), et non plus par sous-chaîne ; HRP n'exclut rien (comme avant).

## Comptes et personnages

Le stockage est un `localStorage` **par origine et par navigateur**, pas par compte : le script ne connaît pas l'identité du personnage. Changer de personnage dans le même navigateur peut donc montrer la liste du précédent jusqu'à la visite de la page source ; l'âge maximal de 7 jours borne l'effet. Deux profils de navigateur ne partagent rien. Le comportement dans un même navigateur (liste du précédent conservée hors page source, remplacée à la visite de la page source, retirée après 7 jours) est testé (fragment G).

## Tests

`npm run build && node tests/e2e/menus-forums.mjs` (fragments `KR_FRAG=a,…,g`). `KR_CHROMIUM` pointe vers un Chromium local si le navigateur attendu par Playwright manque.
