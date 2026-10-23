---
title: 'Aligner la racine du forum sur ses index'
type: 'feature'
ticket: ''
created: '2026-10-23'
status: 'built'
baseline_revision: '8b2152f293fdbedbe9ea74c17cf6a7dae3165170'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
context: []
---

<frozen-after-approval>
## Intent
La racine /forum conserve l'ancien affichage alors que les index ont été refondus. Étendre la présentation existante à /forum et /forum/, sans changer les sous-forums, sujets et Staff. Conserver les groupes de catégories et leurs liens ; les compteurs et boutons de dernier message restent utilisables sur tous les corps de tableau. Aucun fil d'Ariane vers soi-même à la racine. Peau désactivée : contenu natif intact.
</frozen-after-approval>

## Implementation Notes
Mandat autonome d'Arnaud : poursuivre sans approbations intermédiaires. Les deux modifications documentaires antérieures sont conservées. Route directe : extension ciblée des gardes et du traitement des tableaux, sous 100 lignes applicatives. Relevé public en lecture seule dans /tmp/kr-forum-racine.html : un panneau, plusieurs thead/tbody dans un tableau ; données de test synthétiques uniquement.

## Verification
Contre-épreuve sur le bundle antérieur ; suite forum-index et jeu-identite ; lint ; test:all final. La revue indépendante ne vaut pas validation visuelle d'Arnaud.

## Review Triage Log
Revue indépendante quick par revue_racine, deux retours de corrections puis conclusion sans constat restant. Cinq constats de couverture (low, patch) : titres effectivement visibles et boutons touchables dans tous les groupes ; peau coupée sur les deux routes ; fixture conforme aux intitulés natifs ; transitions dans les deux sens ; destinations des huit liens vérifiées. Tous corrigés. Aucun point différé.

## Résultats
- Contre-épreuve avant correction : 12 échecs sur /forum et /forum/.
- Suites ciblées forum-index et jeu-identite : vertes, y compris racine, catégories, sujets et Staff inchangés.
- npm run lint : aucune erreur, un avertissement préexistant dans report-non-lu.mjs.
- npm run test:unit : 56/56. Ancien attendu excluant explicitement la racine actualisé selon le nouveau périmètre.
- npm run test:all : 4875 ok, 0 FAIL, RÉSULTAT VERT.
- Validation visuelle par Arnaud à faire ; le statut construit ne vaut pas validation humaine.
- Livraison isolée : reprise du correctif sur 8b2152f293fdbedbe9ea74c17cf6a7dae3165170 pour ne publier ni la modale ni la palette locales.

Vérification de la livraison isolée : npm run test:all, 4370 ok, 0 FAIL, RÉSULTAT VERT. Une première comparaison du kramail utilisait la référence distante héritée du clone local (6c3eca4) ; référence corrigée depuis GitHub (8b2152f), puis suite complète verte.
