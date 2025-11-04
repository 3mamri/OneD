<template>
  <div v-if="!isLoading" class="daily-game">

    <h2 v-if="!isGameOver">Devine le Personnage de One Piece d'Aujourd'hui !</h2>
    <h2 v-else :class="guesses.length < maxAttempts ? 'message-success' : 'message-failure'">{{ message }}</h2>

    <p v-if="!isGameOver" class="attempts-count">Tentatives : {{ guesses.length }} / {{ maxAttempts }}</p>

    <div class="input-area" v-if="!isGameOver">
      <input
          v-model="userGuess"
          placeholder="Entrez le nom du personnage"
          @keyup.enter="checkGuess"
      />
      <button @click="checkGuess">Vérifier</button>
    </div>

    <p v-if="message && !isGameOver && !message.includes('incorrect')" class="message">{{ message }}</p>

    <div v-if="guesses.length > 0" class="clues-grid">
      <div class="grid-row header">
        <div>Personnage</div>
        <div>Genre</div>
        <div>Affiliation</div>
        <div>Fruit du Démon</div>
        <div>Haki</div>
        <div>Dernière prime</div>
        <div>Hauteur</div>
        <div>Origine</div>
        <div>Premier Arc</div>
      </div>

      <div
          v-for="(guess, index) in guesses"
          :key="index"
          class="grid-row"
      >
        <div :class="guess.clues.name">{{ guess.character.name }}</div>
        <div :class="guess.clues.type">{{ guess.character.type }}</div>
        <div :class="guess.clues.affiliation">{{ guess.character.affiliation }}</div>
        <div :class="guess.clues.devil_fruit">{{ guess.character.devil_fruit || 'Aucun' }}</div>
        <div :class="guess.clues.haki">{{ guess.character.haki || 'Aucun' }}</div>
        <div :class="guess.clues.bounty">
          {{ formatBounty(guess.character.bounty) }}
          <span v-if="guess.clues.bounty.includes('down')" class="arrow">↓</span>
          <span v-if="guess.clues.bounty.includes('up')" class="arrow">↑</span>
        </div>
        <div :class="guess.clues.height">
          {{ formatHeight(guess.character.height) }}
          <span v-if="guess.clues.height.includes('down')" class="arrow">↓</span>
          <span v-if="guess.clues.height.includes('up')" class="arrow">↑</span>
        </div>
        <div :class="guess.clues.origin">{{ guess.character.origin }}</div>
        <div :class="guess.clues.first_arc">{{ guess.character.first_arc }}</div>
      </div>
    </div>
  </div>

  <div v-else class="loading-state">
    <p>{{ message || 'Chargement du défi quotidien...' }}</p>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {getCharacters, selectDailyChallenge} from '@/api/onePieceService.js';

const dailyCharacter = ref(null);
const charactersList = ref([]);
const userGuess = ref('');
const message = ref('');
const guesses = ref([]);
const maxAttempts = 6;
const isGameOver = ref(false);
const isLoading = ref(true); // État de chargement

onMounted(async () => {
  try {
    charactersList.value = await getCharacters();
    dailyCharacter.value = selectDailyChallenge(charactersList.value);

    if (!dailyCharacter.value) {
      message.value = 'Erreur : Aucun personnage n\'a pu être sélectionné. Liste filtrée vide.';
      isGameOver.value = true;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
    message.value = 'Erreur lors du chargement du défi. Vérifiez la console.';
    isGameOver.value = true;
  } finally {
    isLoading.value = false; // FIN DU CHARGEMENT
  }
});

// Correction formatBounty pour M et Md
function formatBounty(bounty) {
  if (bounty === null || bounty === 0) return 'Inconnu';
  const num = parseInt(bounty, 10);

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + ' Md';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + ' M';
  }
  return num.toLocaleString('fr-FR');
}

// CORRECTION: formatHeight doit retourner 'Inconnu' si null
function formatHeight(height) {
  return height ? `${height} cm` : 'Inconnu';
}

function checkGuess() {
  if (isGameOver.value || guesses.value.length >= maxAttempts) return;

  const guessName = userGuess.value.trim();
  if (!guessName) return;

  const guessedCharacter = charactersList.value.find(char =>
      char.name.toLowerCase().includes(guessName.toLowerCase()) ||
      guessName.toLowerCase().includes(char.name.toLowerCase())
  );

  if (!guessedCharacter) {
    message.value = `Personnage "${guessName}" non trouvé dans la base.`;
    userGuess.value = '';
    return;
  }

  const clues = getClues(guessedCharacter, dailyCharacter.value);
  guesses.value.push({
    character: guessedCharacter,
    clues: clues
  });

  userGuess.value = '';

  if (guessedCharacter.name.toLowerCase() === dailyCharacter.value.name.toLowerCase()) {
    message.value = `VICTOIRE ! Vous avez deviné le bon personnage : ${dailyCharacter.value.name} !`;
    isGameOver.value = true;
    return;
  }

  if (guesses.value.length >= maxAttempts) {
    message.value = `PERDU ! Le personnage mystère était : ${dailyCharacter.value.name}.`;
    isGameOver.value = true;
  } else {
    message.value = `Personnage incorrect. Tentatives restantes : ${maxAttempts - guesses.value.length}.`;
  }
}

// CORRECTION MAJEURE: Logique pour les indices (inclus la gestion du 'type' qui était le bug d'affichage)
function getClues(guessed, daily) {
  const clues = {};

  // NOTE: Si la clé est 'genre' dans votre JSON, remplacez 'type' par 'genre' ci-dessous
  const exactMatchProps = ['type', 'affiliation', 'devil_fruit', 'haki', 'origin', 'first_arc'];
  exactMatchProps.forEach(prop => {
    // Si la propriété n'existe pas ou est null sur l'un des objets, comparez-les.
    // La comparaison doit se faire sur les valeurs brutes.
    clues[prop] = guessed[prop] === daily[prop] ? 'vert' : 'rouge';
  });

  // Gestion de la PRIME (Bounty) et Hauteur (Height)
  const numericalProps = ['bounty', 'height'];
  numericalProps.forEach(prop => {
    const guessedValue = guessed[prop];
    const dailyValue = daily[prop];

    // CAS 1: Correspondance exacte (y compris null/null ou 0/0)
    if (guessedValue === dailyValue) {
      clues[prop] = 'vert';
    }
    // CAS 2: Comparaison numérique (Jaune avec flèche) - UNIQUEMENT si les deux sont des nombres valides
    else if (guessedValue !== null && dailyValue !== null && guessedValue !== undefined && dailyValue !== undefined) {
      // Nous utilisons la logique jaune-up/jaune-down uniquement si les deux sont des nombres
      clues[prop] = (guessedValue < dailyValue) ? 'jaune-up' : 'jaune-down';
    }
    // CAS 3: Différence de statut (Rouge) - L'un est connu, l'autre est Inconnu (null/undefined)
    else {
      clues[prop] = 'rouge';
    }
  });

  clues.name = 'name-cell';

  return clues;
}
</script>