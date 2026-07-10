/**
 * creation.js
 * Mode "Création libre" : le joueur choisit lui-même la taille de dé de
 * chaque Attribut et de chaque Vocation, puis le moteur calcule le
 * niveau de chaque Compétence à partir de ces dés et des seuils définis
 * dans config.json. Aucun seuil, aucune taille de dé n'est codée en dur.
 */

function tailleVersValeur(taille, config) {
    return config.des.valeurs[taille] || 0;
}

/**
 * Détermine le niveau d'une compétence à partir de la somme des valeurs
 * de dé Attribut + Vocation, en lisant les seuils depuis config.json.
 */
export function calculerNiveauCompetence(tailleAttribut, tailleVocation, config) {
    const somme = tailleVersValeur(tailleAttribut, config) + tailleVersValeur(tailleVocation, config);
    const seuils = config.niveauCompetence.seuils; // déjà triés du plus haut au plus bas
    const correspondance = seuils.find(s => somme >= s.sommeMin);
    return correspondance || seuils[seuils.length - 1];
}

/**
 * Recalcule le niveau de toutes les compétences du personnage
 * à partir de ses attributs/vocations actuels.
 */
export function calculerCompetences(personnage, competencesData, config) {
    competencesData.forEach(competence => {
        const tailleAttribut = personnage.attributs[competence.attribut];
        const tailleVocation = personnage.vocations[competence.vocation];
        const resultat = calculerNiveauCompetence(tailleAttribut, tailleVocation, config);
        personnage.competences[competence.id] = {
            niveau: resultat.niveau,
            seuilReussite: resultat.seuilReussite
        };
    });
    return personnage.competences;
}

/**
 * Attribue une taille de dé à un attribut ou une vocation, en échangeant
 * avec l'entrée qui possédait déjà cette taille (une seule occurrence de
 * chaque taille de dé par groupe), comme dans le prototype d'origine.
 */
function affecterDe(cible, id, taille) {
    const dejaUtilisePar = Object.entries(cible).find(([autreId, v]) => autreId !== id && v === taille);
    const ancienneTaille = cible[id] ?? null;
    if (dejaUtilisePar) {
        cible[dejaUtilisePar[0]] = ancienneTaille;
    }
    cible[id] = taille;
}

/**
 * Initialise les sélecteurs de dés (Attributs et Vocations) dans les
 * conteneurs DOM fournis, et la matrice de compétences qui en découle.
 *
 * @param {object} options
 * @param {HTMLElement} options.conteneurAttributs
 * @param {HTMLElement} options.conteneurVocations
 * @param {HTMLElement} options.conteneurMatrice
 * @param {object} options.personnage
 * @param {object[]} options.attributsData - data/attributs.json
 * @param {object[]} options.vocationsData - data/vocations.json
 * @param {object[]} options.competencesData - data/competences.json
 * @param {object} options.config - data/config.json
 * @param {(personnage: object) => void} [options.surChangement]
 */
export function initCreationLibre(options) {
    const {
        conteneurAttributs, conteneurVocations, conteneurMatrice,
        personnage, attributsData, vocationsData, competencesData, config,
        surChangement
    } = options;

    const tailles = config.des.tailles; // ex: ["d6","d8","d10"]

    function rendreSelecteur(conteneur, items, cible, prefixeGroupe) {
        conteneur.innerHTML = items.map(item => `
            <div class="selecteur-de" data-id="${item.id}">
                <div class="selecteur-de-titre">${item.nom} <span class="hint">— ${item.indice || ''}</span></div>
                <div class="selecteur-de-options">
                    ${tailles.map(taille => `
                        <label class="de-option">
                            <input type="radio" name="${prefixeGroupe}-${item.id}" value="${taille}">
                            <span class="de-icone">${taille.toUpperCase()}</span>
                            <span class="de-libelle">${config.des.libellesForce[taille] || ''}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');

        conteneur.querySelectorAll('.selecteur-de').forEach(bloc => {
            const id = bloc.dataset.id;
            bloc.querySelectorAll('input[type="radio"]').forEach(input => {
                input.addEventListener('change', () => {
                    affecterDe(cible, id, input.value);
                    synchroniserAffichage();
                    calculerCompetences(personnage, competencesData, config);
                    rendreMatrice();
                    if (typeof surChangement === 'function') surChangement(personnage);
                });
            });
        });
    }

    function synchroniserAffichage() {
        [
            [conteneurAttributs, personnage.attributs],
            [conteneurVocations, personnage.vocations]
        ].forEach(([conteneur, cible]) => {
            conteneur.querySelectorAll('.selecteur-de').forEach(bloc => {
                const id = bloc.dataset.id;
                const taille = cible[id];
                bloc.querySelectorAll('input[type="radio"]').forEach(input => {
                    input.checked = !!taille && input.value === taille;
                });
            });
        });
    }

    function rendreMatrice() {
        conteneurMatrice.innerHTML = `
            <table class="matrice-table">
                <thead>
                    <tr>
                        <th></th>
                        ${attributsData.map(a => `<th>${a.nom}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${vocationsData.map(vocation => `
                        <tr>
                            <td class="matrice-entete-ligne">${vocation.nom}</td>
                            ${attributsData.map(attribut => {
                                const competence = competencesData.find(c => c.vocation === vocation.id && c.attribut === attribut.id);
                                const resultat = personnage.competences[competence.id];
                                const niveau = resultat ? resultat.niveau : 0;
                                const seuil = resultat ? resultat.seuilReussite : '—';
                                return `
                                    <td class="matrice-cellule" data-competence-id="${competence.id}">
                                        <div class="cellule-nom">${competence.nom}</div>
                                        <div class="cellule-niveau">${niveau}</div>
                                        <div class="cellule-seuil">Seuil : ${seuil}</div>
                                    </td>
                                `;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    rendreSelecteur(conteneurAttributs, attributsData, personnage.attributs, 'attribut');
    rendreSelecteur(conteneurVocations, vocationsData, personnage.vocations, 'vocation');
    synchroniserAffichage();
    calculerCompetences(personnage, competencesData, config);
    rendreMatrice();
}
