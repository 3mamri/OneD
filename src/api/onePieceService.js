// src/api/onePieceService.js (Version finale et corrigée)

import axios from 'axios';

const API_ENDPOINT = 'https://api.api-onepiece.com/v2/characters/fr';

// Affiliations considérées comme principales ou jouables
const MAIN_AFFILIATIONS = [
    'Équipage du Chapeau de Paille',
    'Révolutionnaires',
    'Amiraux',
    'Quatre Empereurs',
    '7 Capitaines Corsaires',
    'Marine',
    'Supernovas',
    'Gouvernement Mondial',
    'Ancien équipage des Roger',
];

/**
 * Récupère, filtre et mappe les personnages aux clés attendues par le jeu.
 * Le filtre est ajusté pour inclure les Marines importants sans prime et les pirates secondaires notables.
 * @returns {Array} Liste des personnages principaux/secondaires formatés.
 */
export async function getCharacters() {
    try {
        const response = await axios.get(API_ENDPOINT);
        const characters = response.data;

        // 1. FILTRAGE : Garder uniquement les personnages principaux/secondaires
        const filteredCharacters = characters.filter(char =>  {
            // Conversion et nettoyage des données pour le filtre
            const bountyNum = parseInt(char.bounty) || 0;
            const affiliationNormalized = (char.affiliation || char.status || '').trim();

            // Critère 1: Prime suffisante (pirates et autres criminels)
            // Réduit à 30 millions de Berrys pour inclure les personnages secondaires importants.
            const isMainBounty = bountyNum >= 30000000;

            // Critère 2: Affiliation principale
            const isMainAffiliation = MAIN_AFFILIATIONS.some(aff =>
                affiliationNormalized.includes(aff)
            );

            // Critère 3: Haut rang dans la Marine ou au Gouvernement Mondial (pour les personnages sans prime)
            const isHighRank = affiliationNormalized.includes('Amiral') ||
                affiliationNormalized.includes('Vice-Amiral') ||
                affiliationNormalized.includes('Chef d\'état-major') ||
                affiliationNormalized.includes('CP'); // Pour inclure le CP9/CP0 importants

            // Critère 4: Noms clés (pour les personnages incontournables non couverts par les critères précédents)
            const keyNames = ['Luffy', 'Zoro', 'Nami', 'Usopp', 'Sanji', 'Chopper', 'Robin', 'Franky', 'Brook', 'Jinbe', 'Shanks', 'Barbe Blanche', 'Kaido', 'Big Mom', 'Barbe Noire', 'Garp', 'Smoker', 'Sengoku', 'Dragon', 'Crocus'];
            const isKeyCharacter = keyNames.some(name => char.name.includes(name));

            // Un personnage est inclus si : (Prime suffisante OU Affiliation principale OU Haut rang OU Nom clé)
            return isMainBounty || isMainAffiliation || isHighRank || isKeyCharacter;
        });

        console.log(`Personnages totaux: ${characters.length}. Personnages filtrés pour le jeu: ${filteredCharacters.length}`);

        // 2. MAPPING : Mapper les clés pour le jeu
        return filteredCharacters.map(char => {
            const bountyValue = parseInt(char.bounty) || null;
            const heightValue = parseInt(char.height) || null;

            return {
                name: char.name.trim(),
                type: char.gender || char.type || 'Inconnu',
                affiliation: char.affiliation || char.status || 'Inconnu',
                devil_fruit: char.devilFruit || char.devil_fruit || 'Aucun',
                // Haki: S'assurer que 'Non' est la valeur par défaut si non spécifié
                haki: (char.haki && char.haki !== 'Non') ? 'Oui' : 'Non',
                bounty: bountyValue,
                height: heightValue,
                origin: char.origin || 'Inconnu',
                first_arc: char.firstArc || char.first_arc || 'Inconnu',
            };
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des personnages :", error);
        throw error;
    }
}

// Fonction utilitaire pour générer un nombre pseudo-aléatoire reproductible
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}


/**
 * Sélectionne le personnage du jour de manière stable basée sur la date.
 * @param {Array} characters La liste des personnages filtrés.
 * @returns {Object|null} Le personnage mystère du jour.
 */
export function selectDailyChallenge(characters) {
    if (!characters || characters.length === 0) {
        console.error("La liste de personnages est vide.");
        return null;
    }

    // 1. Déterminer la 'graine' (seed) basée sur la date du jour
    // Le challenge change tous les jours à minuit.
    const today = new Date();
    // Crée un nombre unique pour la date actuelle (ex: 20251104)
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // 2. Utiliser la graine pour obtenir un index pseudo-aléatoire
    const randomIndex = Math.floor(seededRandom(seed) * characters.length);

    // 3. Retourner le personnage à cet index
    return characters[randomIndex];
}