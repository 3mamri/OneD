<template>
  <div v-if="!isLoading" class="daily-game">
    <h1 class="main-title">One Piece Daily Challenge</h1>

    <h2 v-if="!isGameOver">
      Devine le Personnage de One Piece d'Aujourd'hui !
    </h2>
    <h2 v-else class="message-success">{{ message }}</h2>

    <p v-if="!isGameOver" class="attempts-count">
      Tentatives : {{ guesses.length }}
    </p>

    <p
        v-if="message && !isGameOver && !message.toLowerCase().includes('incorrect')"
        class="message"
    >
      {{ message }}
    </p>

    <GuessInput
        v-if="!isGameOver"
        v-model="userGuess"
        :suggestions="filteredCharacters"
        :disabled="isSubmitting"
        @submit="checkGuess"
        @select="selectCharacter"
    />

    <GuessTable :guesses="guesses" />

    <div
        v-if="showVictoryModal"
        class="modal-overlay"
        @click.self="showVictoryModal = false"
    >
      <div class="victory-modal">
        <h3>🏴‍☠️ Victoire !</h3>
        <p>{{ message }}</p>
        <p>Nombre de tentatives : <strong>{{ guesses.length }}</strong></p>

        <pre class="emoji-share">{{ emojiGrid }}</pre>

        <div class="modal-actions">
          <button class="share-btn" @click="shareResults">Partager</button>
          <button class="close-btn" @click="showVictoryModal = false">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading-state">
    <p>Chargement des données de Grand Line...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import {
  getCharacters,
  selectDailyChallenge,
  getCharacterDetails,
  getHakiCount,
  getArcs
} from '@/api/onePieceService.js';

import GuessInput from './GuessInput.vue';
import GuessTable from './GuessTable.vue';
import '../../styles.css';

/* ---------------- STATE ---------------- */
const selectedCharacter = ref(null);
const dailyCharacter = ref(null);
const charactersList = ref([]);
const arcsOrder = ref([]);
const userGuess = ref('');
const message = ref('');
const guesses = ref([]);
const isGameOver = ref(false);
const isLoading = ref(true);
const isSubmitting = ref(false);
const filteredCharacters = ref([]);
const showVictoryModal = ref(false);

/* ---------------- LIFECYCLE ---------------- */
onMounted(async () => {
  try {
    const [chars, arcs] = await Promise.all([getCharacters(), getArcs()]);

    charactersList.value = chars || [];
    arcsOrder.value = arcs || [];

    const rawDaily = selectDailyChallenge(charactersList.value);

    if (rawDaily) {
      const [details, hakiCount] = await Promise.all([
        getCharacterDetails(rawDaily.id),
        getHakiCount(rawDaily.id)
      ]);

      dailyCharacter.value = {
        ...rawDaily,
        ...details,
        haki: hakiCount
      };
    } else {
      message.value = "Impossible de sélectionner le personnage du jour.";
    }
  } catch (error) {
    console.error("Erreur d'initialisation :", error);
    message.value = "Erreur de connexion aux escargots-phones.";
  } finally {
    isLoading.value = false;
  }
});

/* ---------------- WATCH ---------------- */
watch(userGuess, (newGuess) => {
  const normalizedInput = (newGuess || '').trim().toLowerCase();

  if (
      selectedCharacter.value &&
      selectedCharacter.value.name &&
      selectedCharacter.value.name.toLowerCase() !== normalizedInput
  ) {
    selectedCharacter.value = null;
  }

  filterCharacters(newGuess);
});

/* ---------------- COMPUTED ---------------- */
const emojiGrid = computed(() => {
  return guesses.value
      .map((guess) => {
        const order = [
          guess.clues.type,
          guess.clues.affiliation,
          guess.clues.devil_fruit,
          guess.clues.haki,
          guess.clues.bounty,
          guess.clues.origin,
          guess.clues.first_arc
        ];

        return order
            .map((state) => {
              if (state === 'vert') return '🟩';
              if (
                  state === 'jaune' ||
                  state === 'jaune-up' ||
                  state === 'jaune-down' ||
                  state === 'jaune-affiliation'
              ) {
                return '🟧';
              }
              return '🟥';
            })
            .join('');
      })
      .join('\n');
});

/* ---------------- METHODS ---------------- */
function filterCharacters(input) {
  if (!input || input.length < 2) {
    filteredCharacters.value = [];
    return;
  }

  const lower = input.toLowerCase().trim();

  filteredCharacters.value = charactersList.value
      .filter((char) => {
        const searchArray = char.searchNames || [char.name.toLowerCase()];
        const matches = searchArray.some((n) =>
            String(n).toLowerCase().includes(lower)
        );
        const alreadyGuessed = guesses.value.some(
            (g) => g.character.name.toLowerCase() === char.name.toLowerCase()
        );

        return matches && !alreadyGuessed;
      })
      .slice(0, 8);
}

function selectCharacter(character) {
  selectedCharacter.value = character;
  userGuess.value = character.name;
  filteredCharacters.value = [];
  checkGuess();
}

function formatBounty(bounty) {
  if (!bounty) return '0';
  if (bounty >= 1000000000) return (bounty / 1000000000).toFixed(1) + ' Md';
  if (bounty >= 1000000) return (bounty / 1000000).toFixed(0) + ' M';
  return bounty.toLocaleString();
}

function getClues(guessed, daily) {
  const clues = {};
  const display = {};

  const exactProps = ['type', 'devil_fruit', 'haki', 'origin', 'first_arc'];

  exactProps.forEach((prop) => {
    clues[prop] = guessed[prop] === daily[prop] ? 'vert' : 'rouge';

    if (prop === 'haki') {
      display[prop] = guessed[prop] > 0 ? '✨'.repeat(guessed[prop]) : '❌';
    } else if (prop === 'devil_fruit') {
      display[prop] = guessed[prop] === 'Aucun' ? '❌' : guessed[prop];
    } else if (prop === 'type') {
      display[prop] = guessed[prop];
    } else if (prop === 'first_arc') {
      const gIndex = arcsOrder.value.indexOf(guessed.first_arc);
      const dIndex = arcsOrder.value.indexOf(daily.first_arc);

      if (gIndex === dIndex && gIndex !== -1) {
        display.first_arc = guessed.first_arc;
      } else {
        const arrow = gIndex > dIndex ? ' ↓' : ' ↑';
        display.first_arc =
            guessed.first_arc + (gIndex === -1 || dIndex === -1 ? '' : arrow);
      }
    } else {
      display[prop] = guessed[prop];
    }
  });

  const gAff = (guessed.affiliation || '').toLowerCase();
  const dAff = (daily.affiliation || '').toLowerCase();

  if (gAff === dAff) {
    clues.affiliation = 'vert';
    display.affiliation = guessed.affiliation;
  } else if (gAff.includes(dAff) || dAff.includes(gAff)) {
    clues.affiliation = 'jaune-affiliation';
    display.affiliation = guessed.affiliation;
  } else {
    clues.affiliation = 'rouge';
    display.affiliation = guessed.affiliation;
  }

  const gBounty = guessed.bounty || 0;
  const dBounty = daily.bounty || 0;

  if (gBounty === dBounty) {
    clues.bounty = 'vert';
  } else {
    clues.bounty = gBounty < dBounty ? 'jaune-up' : 'jaune-down';
  }

  display.bounty = formatBounty(gBounty);

  return { clues, display };
}

async function checkGuess() {
  if (
      isGameOver.value ||
      !userGuess.value ||
      !dailyCharacter.value ||
      isSubmitting.value
  ) {
    return;
  }

  try {
    isSubmitting.value = true;
    message.value = '';

    const guessName = userGuess.value.trim().toLowerCase();

    let baseChar = selectedCharacter.value;

    if (!baseChar) {
      baseChar = charactersList.value.find((c) => {
        const nameMatch = (c.name || '').trim().toLowerCase() === guessName;
        const searchNamesMatch = (c.searchNames || []).some(
            (n) => String(n).trim().toLowerCase() === guessName
        );
        return nameMatch || searchNamesMatch;
      });
    }

    if (!baseChar) {
      message.value = 'Personnage inconnu.';
      return;
    }

    const alreadyGuessed = guesses.value.some(
        (g) => g.character.name.toLowerCase() === baseChar.name.toLowerCase()
    );

    if (alreadyGuessed) {
      message.value = 'Tu as déjà essayé ce personnage.';
      return;
    }

    const [details, hCount] = await Promise.all([
      getCharacterDetails(baseChar.id),
      getHakiCount(baseChar.id)
    ]);

    const fullChar = {
      ...baseChar,
      ...details,
      haki: hCount
    };

    const result = getClues(fullChar, dailyCharacter.value);

    guesses.value.unshift({
      character: fullChar,
      clues: result.clues,
      display: result.display
    });

    userGuess.value = '';
    selectedCharacter.value = null;
    filteredCharacters.value = [];

    if (fullChar.name.toLowerCase() === dailyCharacter.value.name.toLowerCase()) {
      message.value = `VICTOIRE ! C'était bien ${dailyCharacter.value.name}.`;
      isGameOver.value = true;
      showVictoryModal.value = true;
    }
  } catch (error) {
    console.error('Erreur lors de la vérification :', error);
    message.value = "Erreur pendant l'analyse du personnage.";
  } finally {
    isSubmitting.value = false;
  }
}

async function shareResults() {
  const text = `OnePiecedle ${guesses.value.length}/∞\n${emojiGrid.value}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'OnePiecedle',
        text
      });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Résultat copié dans le presse-papiers !');
    }
  } catch (error) {
    console.error('Erreur de partage :', error);
  }
}
</script>