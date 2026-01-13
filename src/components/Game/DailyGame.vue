<template>
  <div v-if="!isLoading" class="daily-game">

    <h2 v-if="!isGameOver">Devine le Personnage de One Piece d'Aujourd'hui !</h2>
    <h2 v-else class="message-success">{{ message }}</h2>

    <p v-if="!isGameOver" class="attempts-count">
      Tentatives : {{ guesses.length }}
    </p>

    <p
        v-if="message && !isGameOver && !message.includes('incorrect')"
        class="message"
    >
      {{ message }}
    </p>

    <!-- INPUT -->
    <GuessInput
        v-if="!isGameOver"
        :suggestions="filteredCharacters"
        @submit="userGuess = $event; checkGuess()"
        @select="selectCharacter"
    />

    <!-- TABLE -->
    <GuessTable :guesses="guesses" />

  </div>

  <div v-else class="loading-state">
    <p>{{ message || 'Chargement du défi quotidien...' }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getCharacters, selectDailyChallenge } from '@/api/onePieceService.js';

import GuessInput from './GuessInput.vue';
import GuessTable from './GuessTable.vue';

import './styles.css';

/* ---------------- STATE ---------------- */

const dailyCharacter = ref(null);
const charactersList = ref([]);
const userGuess = ref('');
const message = ref('');
const guesses = ref([]);
const isGameOver = ref(false);
const isLoading = ref(true);
const filteredCharacters = ref([]);

/* ---------------- LIFECYCLE ---------------- */

onMounted(async () => {
  try {
    charactersList.value = await getCharacters();
    dailyCharacter.value = selectDailyChallenge(charactersList.value);

    if (!dailyCharacter.value) {
      message.value = 'Erreur : Aucun personnage sélectionné.';
      isGameOver.value = true;
    }
  } catch (error) {
    console.error(error);
    message.value = 'Erreur lors du chargement.';
    isGameOver.value = true;
  } finally {
    isLoading.value = false;
  }
});

/* ---------------- WATCH ---------------- */

watch(userGuess, (newGuess) => {
  filterCharacters(newGuess);
});

/* ---------------- METHODS ---------------- */

function filterCharacters(input) {
  if (input.length < 2) {
    filteredCharacters.value = [];
    return;
  }

  const lower = input.toLowerCase();

  filteredCharacters.value = charactersList.value
      .filter(char =>
          !guesses.value.some(g => g.character.name === char.name) &&
          char.name.toLowerCase().startsWith(lower)
      )
      .slice(0, 8);
}

function selectCharacter(character) {
  userGuess.value = character.name;
  filteredCharacters.value = [];
  checkGuess();
}

/* ⚠️ TOUT LE RESTE DE TON CODE
   (getClues, formatBounty, checkGuess, etc.)
   RESTE STRICTEMENT IDENTIQUE
*/
</script>
