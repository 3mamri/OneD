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
            :src="guess.character.image || '/default-op-image.png'"
            :alt="guess.character.name"
            class="character-image"
        />
      </div>

      <div :class="guess.clues.type">{{ guess.display.type }}</div>
      <div :class="guess.clues.affiliation">{{ guess.display.affiliation }}</div>
      <div :class="guess.clues.devil_fruit">{{ guess.display.devil_fruit }}</div>
      <div :class="guess.clues.haki">{{ guess.display.haki }}</div>

      <div :class="guess.clues.bounty">
        {{ guess.display.bounty }}
        <span v-if="guess.clues.bounty.includes('up')">↑</span>
        <span v-if="guess.clues.bounty.includes('down')">↓</span>
      </div>

      <div :class="guess.clues.origin">{{ guess.display.origin }}</div>
      <div :class="guess.clues.first_arc">{{ guess.display.first_arc }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  guesses: Array
});
</script>
