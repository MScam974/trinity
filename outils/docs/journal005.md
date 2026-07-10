# Journal 005 — Commit 5 : système de compétences Fort/Moyen/Faible

Fichiers modifiés : `outils/data/config.json`, `outils/js/creation.js`.
Fichier ajouté : `outils/js/competences.js`.

## Règle confirmée (tes deux exemples)

- Attributs classés entre eux (fort/moyen/faible) et Vocations classées
  entre elles (fort/moyen/faible) — via dés en Création libre (d10/d8/d6,
  déjà en place) ou via le questionnaire (vote majoritaire, commit 2).
- Fort → les 3 compétences liées reçoivent +1 automatiquement.
- Moyen → 2 compétences au choix parmi les 3 reçoivent +1.
- Faible → 1 compétence au choix parmi les 3 reçoit +1.
- Chaque compétence (croisement Attribut x Vocation) cumule sa
  contribution Attribut (0 ou 1) et sa contribution Vocation (0 ou 1)
  → niveau 0 à 2 à la création.
- Niveau = seuil de réussite en jeu (9+/8+/7+/6+/5+/4+, table étendue à
  0-5 dans `config.json` pour la progression en campagne).

## Hors périmètre (confirmé)

Réduction de seuil par temps pris / aide groupée : mécanique de
résolution en jeu (le MJ au moment du jet), pas de la création de
personnage. Non implémentée dans le moteur de fiche.

## Changements techniques

- `config.json` : `niveauCompetence.seuils` (somme de dés, obsolète)
  remplacé par `des.rangParTaille` (d10→fort/d8→moyen/d6→faible),
  `repartitionCompetences.nombreParRang` et `seuilsReussite.table`.
- `creation.js` : simplifié, ne gère plus que les sélecteurs de dés
  (Attribut/Vocation) et l'échange automatique. Le calcul de niveau et
  la matrice, qui utilisaient l'ancien système, sont retirés.
- `competences.js` (nouveau) : `determinerRangs()`, `recalculerNiveaux()`,
  `initRepartitionAxe()` — rend les cases à cocher par groupe
  (fort = auto/désactivé, moyen/faible = choix limité), empêche de
  cocher au-delà du quota autorisé.

## Point d'intégration pour le prochain commit (app.js)

`creation.js` et `competences.js` sont actuellement indépendants : un
changement de dé dans `creation.js` ne rafraîchit pas automatiquement
`competences.js`. Le futur `app.js` devra appeler
`repartitionAttributs.rafraichir()` / `repartitionVocations.rafraichir()`
(valeur retournée par `initRepartitionAxe`) depuis le `surChangement` de
`initSelecteursDes`.

## Tests

Testé avec jsdom en reproduisant tes deux exemples exacts (Habileté
Fort/Instinct Moyen/Intellect Faible x Exploration Faible/Interaction
Moyen/Action Fort) : niveaux finaux tous corrects (Athlétisme 1, Survie
2, Presence 2, Combat 2, Bluff 0...), et la 3ᵉ coche refusée sur un
groupe "moyen" déjà complet — confirme l'exemple B (Athlétisme peut
monter à 2 pendant que 4 autres restent à 0).

Prochain commit : à toi de choisir — `app.js` (assemblage + bascule
Questionnaire/Création libre + application du résultat du questionnaire
aux dés), ou la fiche/portrait/stockage.
