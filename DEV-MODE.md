# Userscript de Développement

Ce document explique comment utiliser le userscript de développement pour travailler sur le projet Kraland CSS avec hot-reload.

## Installation

### 1. Prérequis
- Node.js et npm installés
- Extension Tampermonkey installée dans Chrome
- Projet cloné localement

### 2. Installation de l'userscript de dev

1. Ouvrez Tampermonkey dans Chrome
2. Cliquez sur "Créer un nouveau script"
3. Copiez tout le contenu de `kraland-userscript-dev.user.js`
4. Collez-le dans l'éditeur Tampermonkey
5. Sauvegardez (Ctrl+S)

**Important** : Désactivez les autres userscripts Kraland pour éviter les conflits.

### 3. Démarrage du serveur de développement

Ouvrez PowerShell dans le dossier du projet et lancez :

```powershell
.\start-server.ps1
```

Le serveur démarre sur le port 4848 et active automatiquement :
- Le build initial du projet
- La surveillance des fichiers (watch mode)
- Le serveur HTTP avec CORS activé

## Workflow de Développement

### Modification du CSS
1. Ouvrez `kraland-theme.css` dans votre IDE
2. Faites vos modifications
3. Sauvegardez le fichier
4. **Le CSS est rechargé automatiquement** dans Chrome sans recharger la page (toutes les 2 secondes)

### Modification du JavaScript
1. Ouvrez `kraland-userscript-template.js` dans votre IDE
2. Faites vos modifications
3. Sauvegardez le fichier
4. **La page se recharge automatiquement** pour appliquer les changements JS

### Logs de débogage

Ouvrez la console Chrome (F12) pour voir les logs :
- `[Kraland Dev] Mode développement activé` : userscript chargé
- `[Kraland Dev] CSS rechargé (X chars, hash: Y)` : CSS mis à jour
- `[Kraland Dev] JS chargé (X chars, hash: Y)` : JavaScript chargé
- `[Kraland Dev] JS modifié détecté - rechargement de la page nécessaire` : rechargement imminent

## Fonctionnement Technique

### Architecture
```
IDE (VSCode)
    ↓ (sauvegarde)
kraland-theme.css / kraland-userscript-template.js
    ↓ (watch + build.js)
kraland-userscript-main.js (généré)
    ↓ (serveur HTTP local port 4848)
Chrome + Tampermonkey
    ↓ (fetch toutes les 2s)
Hot Reload CSS / Page Reload JS
```

### Détection des changements

L'userscript calcule un hash simple du contenu :
- **CSS** : Si le hash change, le CSS est réinjecté sans recharger la page
- **JS** : Si le hash change après le premier chargement, la page est rechargée automatiquement

### Délai de vérification

Les fichiers sont vérifiés toutes les 2 secondes (configurable via `CHECK_INTERVAL` dans l'userscript).

## Résolution de Problèmes

### Le CSS ne se recharge pas
1. Vérifiez que le serveur est démarré (`.\start-server.ps1`)
2. Vérifiez dans la console Chrome : `http://localhost:4848/kraland-theme.css` doit être accessible
3. Augmentez `CHECK_INTERVAL` si les changements ne sont pas détectés

### Le JS ne se recharge pas
1. Vérifiez les logs dans la console Chrome
2. La page doit se recharger automatiquement après modification du JS
3. Si ce n'est pas le cas, rechargez manuellement (F5)

### "Serveur de dev non disponible"
1. Le serveur n'est pas démarré : lancez `.\start-server.ps1`
2. Problème de port : vérifiez que le port 4848 est libre
3. Problème CORS : le serveur doit avoir les headers CORS activés (normalement géré par `start-server.ps1`)

### Conflits avec d'autres userscripts
Désactivez temporairement les autres userscripts Kraland dans Tampermonkey.

## Passage en Production

Quand vos modifications sont prêtes :

1. Arrêtez le serveur de dev (Ctrl+C)
2. Exécutez le build final : `npm run build`
3. Désactivez l'userscript de dev dans Tampermonkey
4. Activez l'userscript de production

## Comparaison des Userscripts

| Fichier | Usage | Rechargement | Build requis |
|---------|-------|--------------|--------------|
| `kraland-userscript-dev.user.js` | Développement | Auto (hot-reload CSS, reload page pour JS) | Non (charge les sources) |
| `kraland-userscript.user.js` | Production/Distribution | Manuel | Oui (CSS et JS bundlés) |
| `kraland-userscript-main.js` | Standalone | Manuel | Oui (généré par build.js) |

## Fichiers du Projet

- **kraland-theme.css** : CSS source (modifier ce fichier)
- **kraland-userscript-template.js** : JavaScript source (modifier ce fichier)
- **kraland-userscript-dev.user.js** : Userscript de développement (installer dans Tampermonkey pour dev)
- **kraland-userscript.user.js** : Userscript de production
- **kraland-userscript-main.js** : Version bundlée générée (ne pas modifier)
- **build.js** : Script de build
- **start-server.ps1** : Serveur de développement
