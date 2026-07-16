# Journal 027 — Commit 27 : correctif encombrement (formule additive)

Fichiers modifiés : `outils/js/equipement.js`, `outils/data/config.json`.

Corrige l'écart entre le code et `systeme.md` signalé dans `enreflexion.md` :
`calculerEncombrementMax` faisait un plafond (`Math.max(bonus+bonus, 5)`),
maintenant une vraie addition (`5 + bonus + bonus`). Un personnage
fort/fort obtient désormais nettement plus qu'un faible/faible, au lieu
du même total pour les deux.

## Tests

Vérifié avec les deux exemples exacts du document système : Habileté
forte + Exploration forte → 9 (au lieu de 5 avant le correctif) ;
Habileté moyenne + Exploration faible → 6. Les deux correspondent
maintenant à `systeme.md`.

Ce correctif clôt le point "Encombrement : le code ne correspond plus
à la règle" d'`enreflexion.md` — je vais le retirer de ce fichier au
prochain passage sur la doc.

Prochain commit : à toi de choisir — un autre point d'`enreflexion.md`
qui te semble simple, ou on garde le cap sur les tests de jeu.