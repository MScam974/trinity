/**
 * prompt-ia.js
 * Construit un prompt texte destiné à un assistant IA externe, pour
 * décrire la psychologie/les intentions/les émotions du personnage
 * (pas son apparence physique — prévue ailleurs, cf. futur générateur
 * de portrait basé sur data/portraits.json).
 * Se base sur : le contexte du monde (data/monde.json), l'affinité,
 * les rangs fort/moyen/faible des Vocations/Attributs, et les mots-clés
 * qualité/défaut des 9 compétences (competences.json). Aucun texte de
 * jeu n'est codé en dur ici.
 */

import { sauvegarderPersonnage } from './stockage.js';

function niveauVersJauge(niveau) {
    if (niveau >= 2) return 'fort';
    if (niveau === 1) return 'moyen';
    return 'faible';
}

function rangDe(taille, config) {
    return config.des.libellesForce[taille] || '—';
}

/**
 * Compétences "notables" (fort ou faible) au sein d'un axe donné
 * (une vocation ou un attribut), pour enrichir la ligne correspondante.
 */
function competencesNotables(donnees, personnage, cle, valeurAxe) {
    return donnees.competences
        .filter(c => c[cle] === valeurAxe)
        .map(c => ({ nom: c.nom, niveau: (personnage.competences[c.id] || { niveau: 0 }).niveau }))
        .filter(c => c.niveau >= 2 || c.niveau === 0)
        .map(c => `${c.nom} : ${c.niveau >= 2 ? 'fort' : 'faible'}`);
}

/**
 * Assemble le texte du prompt à partir des réglages faible/moyen/fort
 * actuellement choisis (personnage.traitsPsychologiques) et des données
 * de référence (contexte du monde, affinité, vocations, attributs).
 */
export function genererPrompt(personnage, donnees) {
    const { monde, affinites, vocations, attributs, competences, config } = donnees;

    const lignes = [
        monde.contexte,
        '',
        "Génère une image de ce personnage de fiction. Déduis d'abord sa psychologie, ses intentions et son apparence physique probable à partir de sa description ci-dessous (compétences, capacités). Si des indices physiques explicites sont fournis en fin de texte, respecte-les en priorité sur ce qui serait déduit."
    ];

    // Affinité : optionnelle (peut pousser l'IA vers des résultats trop
    // extrêmes/mutés) — seulement si le joueur l'a explicitement activée.
    if (personnage.inclureAffiniteDansPrompt) {
        const affinite = affinites.find(a => a.id === personnage.affinite);
        lignes.push(affinite
            ? `Affinité : ${affinite.nom}${affinite.descriptionCourte ? ` (${affinite.descriptionCourte})` : ''}`
            : 'Affinité : non définie');
    }

    lignes.push('Vocations : ' + vocations.map(v => {
        const notables = competencesNotables(donnees, personnage, 'vocation', v.id);
        return `${v.nom} ${rangDe(personnage.vocations[v.id], config)}${notables.length ? ` (${notables.join(', ')})` : ''}`;
    }).join(', '));

    lignes.push('Attributs : ' + attributs.map(a => {
        const notables = competencesNotables(donnees, personnage, 'attribut', a.id);
        return `${a.nom} ${rangDe(personnage.attributs[a.id], config)}${notables.length ? ` (${notables.join(', ')})` : ''}`;
    }).join(', '));

    // Traits de caractère : une seule section, qui fusionne les mots
    // issus des compétences et ceux choisis dans le panneau Portrait.
    // Deux catégories claires plutôt qu'un "(fort)/(faible)" par mot,
    // pour éviter toute ambiguïté (ex: "Pacifique (faible)" pourrait se
    // lire comme "faiblement pacifique" au lieu de "défaut lié à un
    // Combat faible").
    const traitsMarques = [];
    const traitsEnRetrait = [];

    competences.forEach(competence => {
        const jauge = personnage.traitsPsychologiques[competence.id];
        if (jauge === 'fort' && competence.traitsQualite && competence.traitsQualite.length) {
            traitsMarques.push(...competence.traitsQualite);
        } else if (jauge === 'faible' && competence.traitsDefaut && competence.traitsDefaut.length) {
            traitsEnRetrait.push(...competence.traitsDefaut);
        }
        // "moyen" : rien n'est ajouté, comme convenu.
    });

    const portrait = personnage.portrait || {};
    const traitsCaractereChoisis = (portrait.traitsCaractere || [])
        .map(id => donnees.portraits.traitsCaractere.find(t => t.id === id))
        .filter(Boolean);
    traitsCaractereChoisis.forEach(t => traitsMarques.push(`${t.nom} (${t.description})`));

    if (traitsMarques.length) {
        lignes.push(`Traits marqués : ${traitsMarques.join(', ')}.`);
    }
    if (traitsEnRetrait.length) {
        lignes.push(`Traits peu présents : ${traitsEnRetrait.join(', ')}.`);
    }
    if (!traitsMarques.length && !traitsEnRetrait.length) {
        lignes.push("Traits de caractère : (aucun trait marqué pour l'instant).");
    }

    const genre = donnees.portraits.genres.find(g => g.id === portrait.genre);
    const traitsPhysiquesChoisis = (portrait.traitsPhysiques || [])
        .map(id => trouverTraitPhysique(id, donnees.portraits))
        .filter(Boolean);

    const indices = [];
    if (genre) indices.push(`Genre : ${genre.nom}`);
    if (traitsPhysiquesChoisis.length) {
        indices.push(`Indices physiques : ${traitsPhysiquesChoisis.map(t => t.nom).join(', ')}`);
    }
    if (indices.length) {
        lignes.push('', ...indices);
    }

    if (personnage.styleImage) {
        lignes.push('', `Style : ${personnage.styleImage}`);
    }

    return lignes.join('\n');
}

function trouverTraitPhysique(id, portraits) {
    const { carrure, visage, marques, tenue } = portraits.traitsPhysiques;
    const toutesLesCategories = [...carrure, ...visage, ...Object.values(marques).flat(), ...tenue];
    return toutesLesCategories.find(t => t.id === id);
}

/**
 * Initialise les jauges faible/moyen/fort des 9 items et le texte du
 * prompt qui en découle. Pré-remplit chaque jauge à partir du niveau de
 * compétence déjà calculé à la création, mais reste modifiable.
 *
 * @param {object} options
 * @param {HTMLElement} options.conteneurItems
 * @param {HTMLTextAreaElement} options.champPrompt
 * @param {object} options.personnage
 * @param {object} options.donnees - résultat complet de chargerDonnees()
 */
export function initPromptIA({ conteneurItems, champPrompt, personnage, donnees, caseInclureAffinite }) {
    const competencesData = donnees.competences;

    if (!personnage.traitsPsychologiques) {
        personnage.traitsPsychologiques = {};
    }
    if (typeof personnage.inclureAffiniteDansPrompt !== 'boolean') {
        // Par défaut désactivé : l'affinité, mentionnée explicitement,
        // pousse l'IA vers des résultats trop extrêmes/mutés. Elle doit
        // rester subtile et sous-entendue, sauf activation volontaire.
        personnage.inclureAffiniteDansPrompt = false;
    }

    competencesData.forEach(competence => {
        if (!personnage.traitsPsychologiques[competence.id]) {
            const resultat = personnage.competences[competence.id] || { niveau: 0 };
            personnage.traitsPsychologiques[competence.id] = niveauVersJauge(resultat.niveau);
        }
    });

    function regenerer() {
        champPrompt.value = genererPrompt(personnage, donnees);
        sauvegarderPersonnage(personnage);
    }

    if (caseInclureAffinite) {
        caseInclureAffinite.checked = personnage.inclureAffiniteDansPrompt;
        caseInclureAffinite.addEventListener('change', () => {
            personnage.inclureAffiniteDansPrompt = caseInclureAffinite.checked;
            regenerer();
        });
    }

    conteneurItems.innerHTML = competencesData.map(competence => {
        const qualite = (competence.traitsQualite || []).join(' / ');
        const defaut = (competence.traitsDefaut || []).join(' / ');
        const jaugeActuelle = personnage.traitsPsychologiques[competence.id];
        return `
        <div class="trait-item" data-competence-id="${competence.id}">
            <div class="trait-entete">
                <span class="trait-nom">${competence.nom}</span>
                <div class="trait-jauge">
                    ${['faible', 'moyen', 'fort'].map(niveau => `
                        <label>
                            <input type="radio" name="trait-${competence.id}" value="${niveau}"
                                ${jaugeActuelle === niveau ? 'checked' : ''}>
                            ${niveau}
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="trait-mots">
                <span class="mot-defaut ${jaugeActuelle === 'faible' ? 'mot-actif' : ''}">${defaut || '—'}</span>
                <span class="mot-separateur">·</span>
                <span class="mot-qualite ${jaugeActuelle === 'fort' ? 'mot-actif' : ''}">${qualite || '—'}</span>
            </div>
        </div>
    `;
    }).join('');

    conteneurItems.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', () => {
            const bloc = input.closest('.trait-item');
            personnage.traitsPsychologiques[bloc.dataset.competenceId] = input.value;
            bloc.querySelector('.mot-defaut').classList.toggle('mot-actif', input.value === 'faible');
            bloc.querySelector('.mot-qualite').classList.toggle('mot-actif', input.value === 'fort');
            regenerer();
        });
    });

    regenerer();

    return { regenerer };
}