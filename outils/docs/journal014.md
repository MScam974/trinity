# Journal 014 — Commit 14 : tableau unifié Vocation x Attribut

Fichier ajouté : `outils/js/tableau-competences.js`.
Fichiers modifiés : `outils/js/app.js`, `outils/index.html`,
`outils/js/fiche.js`, `outils/fiche.html`, `outils/js/fiche-competences.js`
(allégé — ne garde que la zone Affinité), `outils/css/base.css`.

## Ce qui change

Un seul tableau remplace ce qui était réparti en 3 endroits séparés :
- les sélecteurs de dés (Attributs/Vocations)
- la répartition des points de compétences (fort/moyen/faible)
- la grille de lecture sur la fiche (avec les spécialités)

Comme dans ton exemple : en-têtes de ligne (Vocations) et de colonne
(Attributs) avec 3 boutons radio (d6/d8/d10) chacun ; chaque cellule =
une compétence, avec 2 cases à cocher (une pour le point Vocation, une
pour le point Attribut).

**Deux modes, un seul composant** (`initTableauCompetences({ editable })`) :
- `editable: true` (création, `index.html`) : dés et cases actionnables,
  mêmes règles qu'avant (quota fort/moyen/faible, échange de dés).
- `editable: false` (fiche) : dés et cases affichés désactivés (reflètent
  les choix figés à la création), plus les 2 menus déroulants de
  spécialité par compétence (ça, c'est resté propre à la fiche).

Le tableau reste **visible quelle que soit la méthode de création**
choisie (Questionnaire ou Création libre) — j'ai corrigé une première
version où je l'avais mis à tort uniquement dans l'onglet Création
libre, ce qui aurait caché la répartition des compétences à qui passe
par le questionnaire.

## Nettoyage

`fiche-competences.js` ne fait plus que la zone Affinité (texte +
triangle) ; la grille de compétences est partie dans
`tableau-competences.js`. `creation.js` et `competences.js` restent sur
le disque (leurs fonctions pures `determinerRangs`/`recalculerNiveaux`
sont réutilisées par le nouveau module) mais ne sont plus appelés
depuis `app.js`/`fiche.js` pour le rendu — dis-moi si tu préfères que
je les supprime complètement au prochain commit CSS/nettoyage, ou que
je les garde en l'état.

## Tests

Test bout-en-bout via serveur HTTP réel, création ET fiche : 9 cellules
de compétences, dés assignés correctement, auto-cochage d'un rang fort
(Attribut Habileté fort → Athlétisme/Présence/Combat auto-cochés et
verrouillés), quota d'un rang faible respecté (1 seule compétence
cochable côté Vocation Exploration, la 2ᵉ tentative refusée), niveau de
compétence calculé correct (2 = 1 point Attribut + 1 point Vocation).
Côté fiche : mêmes données affichées en lecture seule (dés et cases
désactivés mais cochés selon les choix réels), sélection de spécialité
fonctionnelle et persistée. Tout est passé.

Prochain commit : à toi de choisir — nettoyage (retirer creation.js/
competences.js s'ils ne servent plus, découpage CSS), ou une nouvelle
fonctionnalité.