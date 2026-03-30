<script setup>
defineProps({
  guesses: {
    type: Array,
    default: () => []
  }
});

function getStateClass(state) {
  return `tile ${state || 'rouge'}`;
}
</script>

<template>
  <div class="guess-table-wrapper">
    <div class="table-header">
      <div>Personnage</div>
      <div>Genre</div>
      <div>Affiliation</div>
      <div>Fruit du démon</div>
      <div>Haki</div>
      <div>Prime</div>
      <div>Origine</div>
      <div>Premier arc</div>
    </div>

    <div
        v-for="(entry, rowIndex) in guesses"
        :key="`${entry.character.id}-${rowIndex}`"
        class="table-row"
    >
      <div
          class="flip-card"
          :style="{ animationDelay: `${rowIndex * 100 + 0}ms` }"
      >
        <div class="tile neutral">
          <span class="tile-title">Personnage</span>
          <span class="tile-value">{{ entry.character.name }}</span>
        </div>
      </div>

      <div
          class="flip-card"
          :style="{ animationDelay: `${rowIndex * 100 + 100}ms` }"
      >
        <div :class="getStateClass(entry.clues.type)">
          <span class="tile-title">Genre</span>
          <span class="tile-value">{{ entry.display.type }}</span>
        </div>
      </div>

      <div
          class="flip-card"
          :style="{ animationDelay: `${rowIndex * 100 + 200}ms` }"
      >
        <div :class="getStateClass(entry.clues.affiliation)">
          <span class="tile-title">Affiliation</span>
          <span class="tile-value">{{ entry.display.affiliation }}</span>
        </div>
      </div>

      <div
          class="flip-card"
          :style="{ animationDelay: `${rowIndex * 100 + 300}ms` }"
      >
        <div :class="getStateClass(entry.clues.devil_fruit)">
          <span class="tile-title">Fruit</span>
          <span class="tile-value">{{ entry.display.devil_fruit }}</span>
        </div>
      </div>

      <div
          class="flip-card"
          :style="{ animationDelay: `${rowIndex * 100 + 400}ms` }"
      >
        <div :class="getStateClass(entry.clues.haki)">
          <span class="tile-title">Haki</span>
          <span class="tile-value">{{ entry.display.haki }}</span>
        </div>
      </div>

      <div
          class="flip-card"
          :style="{ animationDelay: `${rowIndex * 100 + 500}ms` }"
      >
        <div :class="getStateClass(entry.clues.bounty)">
          <span class="tile-title">Prime</span>
          <span class="tile-value">{{ entry.display.bounty }}</span>
        </div>
      </div>

      <div
          class="flip-card"
          :style="{ animationDelay: `${rowIndex * 100 + 600}ms` }"
      >
        <div :class="getStateClass(entry.clues.origin)">
          <span class="tile-title">Origine</span>
          <span class="tile-value">{{ entry.display.origin }}</span>
        </div>
      </div>

      <div
          class="flip-card"
          :style="{ animationDelay: `${rowIndex * 100 + 700}ms` }"
      >
        <div :class="getStateClass(entry.clues.first_arc)">
          <span class="tile-title">Premier arc</span>
          <span class="tile-value">{{ entry.display.first_arc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>