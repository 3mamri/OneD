<template>
  <div v-if="guesses.length > 0" class="clues-grid">
    <div class="grid-row header">
      <div>Personnage</div>
      <div>Genre</div>
      <div>Affiliation</div>
      <div>Fruit du Démon</div>
      <div>Haki</div>
      <div>Dernière prime</div>
      <div>Origine</div>
      <div>Premier Arc</div>
    </div>

    <div
        v-for="(guess, index) in guesses"
        :key="index"
        class="grid-row"
    >
      <div class="character-image-cell">
        <img
            :src="guess.character.image "
            :alt="guess.character.name"
            class="character-image"
            @error="handleImageError"
        />
        <div class="character-name-label">{{ guess.character.name }}</div>
      </div>

      <div :class="guess.clues.type">
        <div class="clue-content">{{ guess.display.type }}</div>
      </div>

      <div :class="guess.clues.affiliation">
        <div class="clue-content">{{ guess.display.affiliation }}</div>
      </div>

      <div :class="guess.clues.devil_fruit">
        <div class="clue-content">{{ guess.display.devil_fruit }}</div>
      </div>

      <div :class="guess.clues.haki">
        <div class="clue-content">{{ guess.display.haki }}</div>
      </div>

      <div :class="guess.clues.bounty">
        <div class="clue-content">
          {{ guess.display.bounty }}
          <span class="direction-arrow">
            <span v-if="guess.clues.bounty.includes('up')" class="arrow">↑</span>
            <span v-if="guess.clues.bounty.includes('down')" class="arrow">↓</span>
          </span>
        </div>
      </div>

      <div :class="guess.clues.origin">
        <div class="clue-content">{{ guess.display.origin }}</div>
      </div>

      <div :class="guess.clues.first_arc">
        <div class="clue-content">{{ guess.display.first_arc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Récupération des tentatives depuis le parent (DailyGame)
defineProps({
  guesses: {
    type: Array,
    required: true
  }
});

// Gestion des images API cassées
function handleImageError(event) {
  event.target.src = '/iconeonepiece.ico';
}
</script>