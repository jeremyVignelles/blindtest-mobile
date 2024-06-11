<script setup lang="ts">
import type Team from '@/types/team'
import { useQuasar } from 'quasar'
import { socketSymbol } from '@/plugins/socket'
import { inject } from 'vue'

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
</script>
<template>
  <q-card>
    <q-card-section class="bg-purple text-white text-h4 row items-center">
      <span>{{ team.name }}</span>
      <q-space />
      <q-btn dense flat round class="text-h5" @click="editScore">{{ team.score }}</q-btn>
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
