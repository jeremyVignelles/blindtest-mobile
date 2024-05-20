<script setup lang="ts">
import { inject, ref } from 'vue'
import { socketSymbol } from '@/plugins/socket'
import { useGameStore } from '@/stores/gameStore'

const socketService = inject(socketSymbol)!
const gameStore = useGameStore()
if (gameStore.teamId) {
  join(gameStore.teamId)
}

const newTeamName = ref('')

function join(teamId: string) {
  gameStore.teamId = teamId
  socketService.joinTeam(teamId)
}

async function createTeam() {
  const teamId = await socketService.createTeam(newTeamName.value)
  join(teamId)
}
</script>
<template>
  <q-card>
    <q-card-section>
      <span class="text-h3">Sélectionner une équipe</span>
    </q-card-section>
    <q-card-section>
      <q-list>
        <q-item v-for="team in gameStore.teams" :key="team.id">
          <q-item-section>
            <q-item-label>{{ team.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn @click="join(team.id)" label="Rejoindre" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input v-model="newTeamName" label="Nom de l'équipe" />
          </q-item-section>
          <q-item-section side>
            <q-btn :disable="!newTeamName" @click="createTeam" label="Créer l'équipe" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
