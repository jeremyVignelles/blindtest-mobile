<script setup lang="ts">
import { inject, ref } from 'vue'
import { socketSymbol } from '@/plugins/socket'
import { useGameStore } from '@/stores/gameStore'

import { QBtn, QCard, QCardSection, QInput, QList, QItem, QItemLabel, QItemSection } from 'quasar'

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
      <QList>
        <QItem v-for="team in gameStore.teams" :key="team.id">
          <QItemSection>
            <QItemLabel>{{ team.name }}</QItemLabel>
          </QItemSection>
          <QItemSection side>
            <QBtn @click="join(team.id)" label="Rejoindre" />
          </QItemSection>
        </QItem>
        <QItem>
          <QItemSection>
            <QInput v-model="newTeamName" label="Nom de l'équipe" />
          </QItemSection>
          <QItemSection side>
            <QBtn :disable="!newTeamName" @click="createTeam" label="Créer l'équipe" />
          </QItemSection>
        </QItem>
      </QList>
    </q-card-section>
  </q-card>
</template>
