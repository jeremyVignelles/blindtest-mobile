<script setup lang="ts">
import type Team from '@/types/team'

defineProps<{
  team: Team
}>()
</script>
<template>
  <q-card>
    <q-card-section class="bg-purple text-white row items-center">
      <span class="text-h4">{{ team.name }}</span>
      <q-space />
      <span class="text-h4">{{ team.score }}</span>
    </q-card-section>
    <q-card-section>
      <ul>
        <li v-for="player in team.members" :key="player.id">
          {{ player.name }}
        </li>
      </ul>
    </q-card-section>
  </q-card>
</template>
