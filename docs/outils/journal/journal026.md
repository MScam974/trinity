# Journal 026 — Commit 26 : 4 correctifs

Fichiers modifiés : `outils/css/base.css`, `outils/js/prompt-ia.js`,
`outils/js/vue-synthetique.js`, `outils/js/fiche.js`, `outils/js/app.js`,
`outils/index.html`.

⚠️ Destination réelle : `docs/outils/`.

## 1. Bouton ✕ du menu burger ne fermait rien

`.menu-burger { display: flex }` (ma feuille de style) l'emportait
toujours sur `[hidden] { display: none }` (style par défaut du
navigateur) — même spécificité, mais une règle "auteur" gagne toujours
contre une règle "user-agent". Ajouté `.menu-burger[hidden] { display:
none; }`, spécificité plus forte, qui force la fermeture.

## 2. Jauges du prompt IA figées à "faible"

Le pré-remplissage ne se faisait qu'une fois (`if (!déjà défini)`), et
ne se resynchronisait jamais ensuite même si les compétences
changeaient (dés modifiés, répartition changée...). Ajouté
`personnage.traitsPsychologiquesManuels` : liste des jauges que tu as
toi-même cliquées. Toutes les autres se resynchronisent désormais à
chaque chargement sur le niveau réel de la compétence — testé : Combat
niveau 2 (Habileté + Action forts) → jauge correctement sur "fort".

## 3. Traits fort/faible absents de la vue synthétique

La vue synthétique (mode Jeu) affichait uniquement les pips
numériques. Elle affiche maintenant aussi les mots-clés (ex: "Combatif
/ Déterminé" sous Combat si sa jauge est sur "fort"), en réutilisant
directement les jauges du prompt IA. Se met à jour en direct si tu
ajustes une jauge manuellement (nouveau callback `surChangement` sur
`initPromptIA`).

## 4. Bouton "Sauvegarder" (Création libre) peu clair

Il sauvegardait seulement en localStorage, sans rien de visible pour
le joueur. Il déclenche maintenant aussi le téléchargement du JSON
(même mécanisme que "Terminer"/"Exporter"), et son libellé est plus
explicite ("💾 Sauvegarder (+ JSON)", avec une infobulle).

## Tests

Bout-en-bout : jauge Combat correctement pré-remplie sur "fort" pour
un personnage Habileté+Action forts (niveau réel 2) ; mots-clés
"Combatif / Déterminé" bien affichés dans la ligne synthétique
correspondante ; ouverture/fermeture du menu burger vérifiées
(`hidden` correctement togglé). Export JSON du bouton Sauvegarder non
re-testé unitairement (mécanisme identique à celui déjà validé au
commit 25).

Prochain commit : à toi de tester et de me dire la suite.