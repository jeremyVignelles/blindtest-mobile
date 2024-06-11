<script setup lang="ts">
import type Team from '@/types/team'
import { useQuasar, type Color } from 'quasar'
import { socketSymbol } from '@/plugins/socket'
import { inject, computed } from 'vue'

const props = defineProps<{
  team: Team
}>()

const $q = useQuasar()
const socketService = inject(socketSymbol)!

async function editScore() {
  const component = (await import('@/components/EditScoreDialog.vue')).default
  $q.dialog({
    component: component,
    componentProps: { team: props.team }
  }).onOk((newScore: number) => {
    socketService.setScore(props.team.id, newScore)
  })
}

// Quasar colors : https://quasar.dev/style/color-palette
const colors: Color[] = [
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'grey',
  'blue-grey'
]

const backgroundClass = computed(() => {
  const color = parseInt(props.team.id.substring(-2), 16) % colors.length
  return [`bg-${colors[color]}`]
})
</script>
<template>
  <q-card>
    <q-card-section class="text-white row items-center q-pa-sm" :class="backgroundClass">
      <span class="text-h5">{{ team.name }}</span>
      <q-space />
      <q-btn dense size="md" flat round @click="editScore">{{ team.score }}</q-btn>
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <ul class="q-my-none">
        <li v-for="player in team.members" :key="player.id">
          {{ player.name }}
        </li>
      </ul>
    </q-card-section>
  </q-card>
</template>
