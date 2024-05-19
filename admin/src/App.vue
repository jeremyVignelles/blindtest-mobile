<script setup lang="ts">
import { ref, inject } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { socketSymbol } from '@/plugins/socket'
import TeamCard from '@/components/TeamCard.vue'
const gameStore = useGameStore()

const socketService = inject(socketSymbol)!

const leftDrawerOpen = ref(false)
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round label="🏡" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title> Blindtest Mobile Admin </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered>
      <q-list>
        <q-item clickable v-close-popup @click="socketService.reset">
          <q-item-section>
            <q-item-label>Reset</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-space />
    </q-drawer>

    <q-page-container>
      <main class="q-pa-md">
        <div class="row q-col-gutter-md">
          <div v-for="team in gameStore.globalGameState.teams" :key="team.id" class="col-3">
            <team-card :team="team" />
          </div>
          <div class="col-3" v-if="gameStore.globalGameState.unjoinedPlayers.length > 0">
            <q-card>
              <q-card-section class="bg-purple text-white">
                <span class="text-h4">??</span>
              </q-card-section>
              <q-card-section>
                <ul>
                  <li v-for="player in gameStore.globalGameState.unjoinedPlayers" :key="player.id">
                    {{ player.name }}
                  </li>
                </ul>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </main>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
