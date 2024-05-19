<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
const gameStore = useGameStore()
</script>

<template>
  <main>
    <ul>
      <li v-for="team in gameStore.teams" :key="team.id">
        {{ team.name }}
        <ul>
          <li v-for="player in team.members" :key="player.id">
            {{ player.name }}
          </li>
        </ul>
      </li>
    </ul>
  </main>
</template>

<style scoped></style>
