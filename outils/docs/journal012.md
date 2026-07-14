# Journal 012 — Commit 12 : 3 retouches sur le prompt IA

Fichiers modifiés : `outils/js/prompt-ia.js`, `outils/fiche.html`,
`outils/css/base.css`.

## 1. Demande d'image directe

L'intro du prompt commence maintenant par "Génère une image de ce
personnage de fiction..." (impératif direct), au lieu de "Décris ce
personnage en vue de générer une image" (formulation indirecte).

## 2. Mots qualité/défaut visibles sur chaque jauge

Ce que tu ne voyais pas ("les deux dernières entrées du JSON" —
`traitsQualite`/`traitsDefaut`) : ils étaient bien utilisés (dans le
texte final du prompt), mais jamais affichés à côté de la jauge
elle-même. Chaque item affiche maintenant : `Prudent / Casanier · Intrépide / Audacieux`
sous le nom de la compétence — celui qui correspond à la jauge actuelle
(faible → mots défaut, fort → mots qualité) est mis en surbrillance, et
ça se met à jour en direct au clic (pas seulement dans le texte final).

## 3. Harmonisation visuelle

Le bloc "Prompt IA — psychologie du personnage" est maintenant un
panneau `<details>` du même style que les panneaux Portrait (bordure,
titre replié/dépliable), ouvert par défaut vu son importance centrale.

## Tests

Test bout-en-bout : mots corrects affichés pour Athlétisme, cohérence
jauge/surbrillance initiale vérifiée, changement de jauge en direct
vérifié (clic sur "fort" → mot-qualite s'allume, mot-defaut s'éteint),
prompt commence bien par "Génère une image", panneau principal présent
et ouvert par défaut. Tout est passé.

Prochain commit : à toi de choisir.