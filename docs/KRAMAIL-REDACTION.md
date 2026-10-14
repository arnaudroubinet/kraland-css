# Kramail — rédaction : barre d'outils et champ « Destinataires »

## Mandat

Carte `t_abf9ccd4`. Arnaud a validé la maquette `t_859e687e` (« Je valide la nouvelle interface ») : elle reprend la barre d'outils de `t_29241bce` et propose un champ « Destinataires » unique. PR vers `feature/next` uniquement, sans fusion. Base : `ac0e638`.

Le dépôt ne contient ni `_bmad/` ni `AGENTS.md`. Un `bmad setup` séparé est proposé ; aucune installation ni création d'AGENTS.md dans la PR #17. En attendant, ce fichier porte le périmètre, les décisions et les preuves de la chaîne (contrôle coach t_55e9bd04, E2/E5).

## Ce qui change pour le joueur

- **Barre d'outils.** Elle garde les 18 boutons du site, dans le même ordre et en 4 groupes, avec les mêmes icônes et les mêmes actions (insertion BBCode, menus Smileys et Couleurs). Seul le rendu change :
  - sur ordinateur, une ligne compacte de boutons de 24 px ;
  - sur mobile, des boutons de 40 px ; à 375 px la barre tient sur 3 lignes, à 320 px sur 4. Quand un groupe ne tient plus, il passe à la ligne en entier. Il n'y a plus de bouton étiré sur toute la largeur ni de défilement horizontal.
- **Destinataires.** Les trois zones du site (Destinataire(s), Contacts +, Chercher) deviennent un seul champ :
  - chaque nom choisi devient une **pastille** retirable (croix, ou Retour arrière) ;
  - **« ; » est le seul séparateur**, comme sur le site : taper « ; » ou coller « A; B; C » découpe le texte en pastilles. La virgule ne sépare pas, car un nom peut en contenir une : « Durand, Jean » reste un seul nom (décision d'Arnaud, Q-3 = a) ;
  - le texte indicatif « Membre ou personnage » ne s'affiche que sur un champ sans pastille. Dès qu'une pastille existe (y compris sur Répondre, où le destinataire est prérempli), il est masqué : à 320 px, la place restante l'aurait coupé (re-QA, S-2) ;
  - dès 2 lettres, des suggestions s'affichent : **Vos contacts** d'abord, puis **Annuaire du jeu**. L'annuaire est interrogé avec la même requête que le bouton Chercher (`ajaxsearch.php`), 250 ms après la dernière frappe ; une requête devenue inutile est annulée ;
  - un nom déjà choisi apparaît grisé avec ✓, et sa pastille s'allume ;
  - si aucun résultat ne correspond, « ajouter tel quel · non vérifié » reste possible ;
  - au clavier : ↑ ↓ pour choisir, Entrée pour ajouter, Échap pour fermer, Retour arrière pour retirer une pastille ;
  - le bouton **Contacts** ouvre la liste complète des contacts.
- **Texte tapé mais pas validé** (décision d'Arnaud, Q-1 option b, précisée) : seules les pastilles partent dans `#dest`. Si du texte reste dans le champ au moment de l'envoi, l'envoi est **bloqué** et le champ affiche « Validez ou effacez « texte » » avec deux boutons :
  - **Ajouter** transforme le texte en pastille (comme « ajouter tel quel · non vérifié ») ;
  - **Effacer** vide le texte tapé sans toucher aux pastilles ; **Échap** fait de même ;
  - le message disparaît dès que le texte est ajouté, effacé ou vidé ; retirer une pastille reste d'un seul clic ;
  - rien n'est envoyé automatiquement ensuite : le joueur reclique sur Envoyer ;
  - boutons de 26 px sur ordinateur, de 40 px sur mobile.
- **Aucun destinataire** : la zone native `#dest` est requise par le site, mais elle est masquée. Le navigateur ne peut donc pas afficher sa bulle « champ obligatoire » au bon endroit. Le module la remplace par le message **« Ajoutez au moins un destinataire. »**, affiché sous le champ visible, qui reçoit le focus. L'envoi reste bloqué par la validation native, comme sans le module. Ce libellé, absent de la maquette initiale, est **validé tel quel par @ux, t_095a8a0d**, sans reformulation (contrôle coach t_55e9bd04, E7).
- **Répondre, Répondre à tous, Transférer** (décision d'Arnaud, Q-2) : même barre et même champ que Nouveau. Les destinataires que le site préremplit deviennent des pastilles et sont conservés tels quels ; le sujet (« Re: », « Tr: »), le message cité et les champs cachés du site ne sont pas touchés.

## Pages concernées

Relevé du 14/10/2026 (Chrome 9223, lecture seule : un message déjà lu de la réception et un message envoyé, puis leurs pages Répondre, Répondre à tous et Transférer, sans rien soumettre) :

| Page | Adresse | `#dest` prérempli |
|---|---|---|
| Nouveau | `…/kramail/post/nouveau-4-<compte>` | vide |
| Répondre | `…/post/<sujet>-5-<id>` (réception), `-15-` (envoi) | l'expéditeur, « Nom; » |
| Répondre à tous | `-6-` (réception), `-16-` (envoi) | les destinataires, « Nom; » (un seul nom dans le relevé ; avec plusieurs noms, format supposé « Nom; Nom; » comme ailleurs sur le site, et repris tel quel) |
| Transférer | `-7-` (réception), `-17-` (envoi) | vide |

Les pages de réponse ont exactement le formulaire `post_msg` de Nouveau. Seules différences : le titre, un 2e bouton « Message », `n[6]`/`n[7]`/`n[5]`, le sujet et le message cité, et l'accordéon « Message auquel vous répondez » sous le formulaire. Une page est reconnue comme rédaction par son formulaire (`form[name=post_msg]` avec `textarea#dest`), pas par le numéro de l'adresse.

## Comment c'est fait

- Un module `Kramail:Destinataires`, inscrit dans `InitQueue`, ne s'active que sur `body.page-kramail-compose` **et si le thème est activé** (sans le thème, rien ne masque les zones natives : le module ne s'installe pas et la page reste native). Il **masque** les zones natives `#dest`, `#contacts`, `#search` et `#results` sans les supprimer, et écrit les pastilles dans `#dest` (`c[3]`) au format du site : `Nom; Nom; `.
- Blocage de l'envoi : tant qu'un texte tapé n'est pas validé, `#dest` porte une erreur de validité (`setCustomValidity`). C'est la validation native du navigateur qui bloque l'envoi ; le module affiche son message sur l'événement `invalid`. Aucun écouteur `submit` n'est ajouté.
- Annuaire : si sa réponse contient des liens `[+]` mais qu'aucun nom n'est lisible (format changé par le site), le panneau affiche « Annuaire indisponible, réessayez » et non « aucun résultat ».
- L'envoi reste celui du site. Le module n'ajoute aucun appel serveur autre que `ajaxsearch.php` et n'invente aucune fonction.
- **Repli** : sans le script, ou si le module échoue, son interface est retirée et les zones natives redeviennent visibles et utilisables.
- La barre d'outils n'est modifiée qu'en CSS, dans la section « KRAMAIL RÉDACTION » de `kraland-theme.css`.
- Libellé « Destinataires » de 768 à 1199 px : même taille que les autres libellés (13 px, y compris à 768 px). La colonne des libellés ne mesure que 105 px vers 769 et 992 px, et le mot en majuscules en fait environ 101. Le libellé n'a donc pas de marge gauche ni d'espacement entre lettres, et sa marge droite ne diminue (de 15 px jusqu'à 0) que là où la colonne est trop étroite. Ailleurs, il reste aligné à droite comme les autres.

## Décisions

| Date | Question | Réponse d'Arnaud (verbatim) | Carte |
|---|---|---|---|
| 14/10/2026 16:08 | Maquette de la barre d'outils et du champ « Destinataires » unique | « Je valide la nouvelle interface » : validation globale. L'autorisation d'ajouter un module JS (et « ajouter tel quel ») en est **déduite** par l'orchestratrice, annoncée par écrit et non contestée ; Arnaud ne l'a pas donnée explicitement. | t_859e687e (maquette), t_abf9ccd4 (code) |
| 14/10/2026 19:06 | Q-1 : que faire d'un nom tapé mais pas transformé en pastille au moment de l'envoi ? | « 1, je suis ta préco » : option (b), envoi bloqué côté client. | t_63fbb540 (question), t_4ab208f0 (code) |
| 14/10/2026 19:09–19:10 | Q-1, détail du blocage | Arnaud pose une question à 19:09. Les deux boutons « Ajouter » et « Effacer » (Échap efface aussi, aucun envoi automatique) sont **proposés par l'orchestratrice**, puis **approuvés** par Arnaud à 19:10 : « C'est bon ». | t_4ab208f0 |
| 14/10/2026 | Q-2 : même barre et même champ sur Répondre, Répondre à tous, Transférer ? | « on fait tout » | t_63fbb540 (question), t_4ab208f0 (code) |
| 14/10/2026 20:37 | Q-3 : la virgule sépare-t-elle deux noms ? | Option (a), « ; » seul séparateur : « Je valide ». | t_503eb6f6 (question), t_71e4af53 (code et tests) |

## Preuves (suite `tests/e2e/kramail-redaction.mjs`, `npm run test:kramail`)

Les tests tournent sur des fixtures locales anonymisées, issues du DOM réel (nouveau message, réponses, réception, envoi, corbeille, lecture). L'envoi est neutralisé et tout le réseau est refusé, sauf ce que le harnais sert lui-même (annuaire fictif au format du site).

- **Barre**, à 1280, 375 et 320 px :
  - 18 boutons en groupes `[4,4,4,6]` ; icônes, ordre et éléments actifs identiques au natif ;
  - 1 ligne de boutons de 24 px à 1280, 3 lignes à 375 et 4 lignes à 320, avec des cibles de 40 px ;
  - aucun défilement horizontal ;
  - Gras insère `[b]…[/b]`, un smiley insère son code, une couleur insère sa balise.
- **Destinataires**, à 1280, 375 et 320 px :
  - la valeur de `#dest` est vérifiée après chaque ajout et chaque retrait, par exemple `Marelle Duvent; Omar Sablier; ` puis `Omar Sablier; ` ;
  - les six états de la maquette (vide, suggestions, deux pastilles, aucun résultat, doublon, contacts) ;
  - les lignes de suggestion mesurent 34 px (bureau) ou 44 px (mobile), les croix 26×24 ou 34×32 ;
  - une seule requête après 250 ms, annulation, réponse tronquée à 25 noms suivie de « (...) », cas d'erreur ; réponse au format inattendu → « Annuaire indisponible, réessayez ».
- **Envoi bloqué** (texte tapé non validé), à 1280, 375 et 320 px : rien ne part, message et boutons Ajouter / Effacer (40 px au toucher), Échap, retrait d'une pastille d'un clic, message qui suit le texte, aucun envoi automatique, puis un seul envoi natif avec les bonnes pastilles.
- **Répondre, Répondre à tous, Transférer**, à 1280, 375 et 320 px : pastilles = destinataires préremplis, `#dest` conservé tel quel, sujet, message cité et champs cachés intacts, même barre, aucun défilement horizontal, envoi natif. Contrôle complémentaire hors dépôt sur le HTML réel relevé (6 pages × 3 largeurs) : mêmes résultats.
- **Libellé « Destinataires »** de 768 à 1280 px : taille de 13 px comme les autres libellés du formulaire ; texte dans sa colonne, à 8 px au moins du champ (minimum mesuré : 17,1 px). De 768 à 1199 px, le texte tient aussi dans la zone de contenu de la colonne, marges comprises. 14 largeurs testées, dont les deux seuils 768/769 et 991/992.
- **Texte indicatif**, à 1280, 375 et 320 px : entier quand le champ est vide, masqué dès qu'une pastille existe, de nouveau entier après retrait de la dernière pastille ; même résultat à l'ouverture de Répondre prérempli.
- **Virgule (Q-3 = a)** : « Durand, Jean » collé et « Lenoir, Paul » tapé restent chacun un seul nom ; « ; » découpe, « Ajouter » crée une seule pastille, le formulaire natif conserve les virgules. Un mutant qui découpe aussi sur « , » fait échouer les 5 nouveaux contrôles.
- **Repli** : cas sans script, module en panne, navigateur sans `AbortController`, et thème désactivé (aucune interface du module, zones natives seules, `#dest` jamais réécrit), y compris sur les pages de réponse.
- **Non-régression** : réception, envoi, corbeille et lecture sont rendues pixel pour pixel comme avec le bundle de `feature/next`, à 3 largeurs.
- **Contrastes** : au moins 4,5:1 sur les 16 thèmes, message de blocage et boutons compris.
- **Résultats finaux des finitions** (`t_71e4af53`, 14/10/2026) : `npm run test:all` est vert, avec **3 662 ok / 0 FAIL** en 481 s ; la suite Kramail complète (`npm run test:kramail`) est verte avec **340 ok / 0 FAIL**. Le commit de tests QA `9e9e9e5` est intégré tel quel, auteur Quinn conservé (59 lignes ajoutées conservées : envoi natif sans module et blocage visible depuis Envoyer en bas de page). Les nouveaux tests S-1/S-2 sur le bundle d'avant donnent 18 FAIL ; les 5 tests virgule sont déjà verts sur ce bundle, car le découpage n'a pas changé. ESLint ciblé : 0 erreur ; Stylelint : 13 erreurs, les mêmes que sur la base. Bundle recompilé en mémoire : identique octet pour octet à celui testé et livré.
- **Captures** avant/après à 1280, 375 et 320 px : elles sont livrées avec la carte et ne sont pas versionnées dans le dépôt.

## Leçon de cette reprise

Avant de remplacer une bulle de validation native par un message du module, consigner son texte et son rôle ici et faire valider le libellé par ux (E7). Une approbation globale, une proposition de l'orchestratrice et une décision explicite d'Arnaud restent trois attributions différentes dans le tableau des décisions (E5).

## Ce qui reste inconnu

Le contrôle fait par le serveur à l'envoi (nom inexistant, doublon, nombre maximal de destinataires) n'a pas été observé : aucun Kramail n'a été envoyé. Le module n'en présume rien et laisse le serveur décider, comme avant.
