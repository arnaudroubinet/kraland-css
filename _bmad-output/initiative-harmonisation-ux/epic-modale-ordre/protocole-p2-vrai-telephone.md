# Protocole P2 : vérifications sur un vrai téléphone

Ticket 2.1. L'émulation (375×667) ne reproduit ni le clavier ni le démarrage d'un vrai navigateur mobile, où la largeur vaut 980 px tant que la balise viewport n'est pas lue (commentaire G-01 du template). Ce protocole dit ce qu'il faut regarder ; les résultats décident de la partie mobile du ticket 2.6, et servent aussi aux épopées 7 (kramail mobile) et 8 (notifications).

Consigne : **annuler, ne rien envoyer, ne valider aucun ordre.**

## 1. Préparer

1. Sur le Mac, à la racine du dépôt : `npm run build`, puis `npm run serve` (port 4848, ouvert sur le réseau local).
2. Le téléphone sur le même réseau Wi-Fi que le Mac.
3. Navigateur et gestionnaire de scripts (noter lequel) :
   - Android : Firefox avec l'extension Tampermonkey (Chrome Android n'accepte pas d'extension) ;
   - iOS : Safari avec l'application « Userscripts » (ou Tampermonkey pour Safari).
4. Sur le téléphone, ouvrir `http://192.168.5.54:4848/kraland-userscript-main.user.js` et installer le script (le bundle contient le CSS). Désactiver toute autre version du script.
5. Ouvrir `http://www.kraland.org/jouer/plateau` et se connecter si besoin.

## 2. Vérifications

Pour chaque point, noter « conforme », « écart : … » ou « non vérifiable », et joindre une capture d'écran si possible (hors dépôt).

| # | Où | Geste | Regarder |
|---|---|---|---|
| A | Plateau | charger la page, sans rien toucher | la barre d'onglets de section (Agir, Matériel, Personnage, Bâtiments, Employés) et le mini-profil (nom du personnage) apparaissent-ils ? la page déborde-t-elle en largeur ? |
| B | Plateau | toucher « Dormir », puis **Annuler** | libellés des boutons (« Cancel / OK » ou « Annuler / Valider ») ; l'avertissement « Attention ! » est-il visible sans défiler ? un bouton « ? Aide » existe-t-il ? coût et durée en pastilles ou en ligne de texte ? |
| C | Plateau | ouvrir l'ordre « Parler », toucher le champ de texte (clavier ouvert), puis **Annuler** | le bouton de validation reste-t-il visible au-dessus du clavier ? le champ reste-t-il visible ? |
| D | Forum, un sujet | « Répondre », toucher le champ (clavier ouvert), puis revenir en arrière sans envoyer | le bouton « Envoyer » reste-t-il visible ? couvre-t-il le texte saisi ? |
| E | Kramail | « Nouveau message », toucher le champ (clavier ouvert), puis revenir en arrière sans envoyer | même question que D |
| F | Barre du haut | toucher la cloche des notifications, puis fermer | la page `/report` s'ouvre-t-elle dans un onglet, une fenêtre, ou la page courante ? comment revient-on ? |
| G | Index du forum RP | toucher le bouton → d'un forum (dernier message) | arrive-t-on sur le message (ancre `#msg…`) ou en haut du sujet ? |

## 3. Résultats

À remplir par Arnaud.

- Date :
- Appareil, système et version :
- Navigateur et gestionnaire de scripts :

| # | Résultat | Remarque |
|---|---|---|
| A | | |
| B | | |
| C | | |
| D | | |
| E | | |
| F | | |
| G | | |
