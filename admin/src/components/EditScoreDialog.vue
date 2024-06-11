<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import type Team from '@/types/team'
import { ref } from 'vue'

const props = defineProps<{
  team: Team
}>()

defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const score = ref(props.team.score)

function onOKClick() {
  onDialogOK(score.value)
}
</script>
<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Modifier le score de l'équipe {{ team.name }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none row justify-center items-center text-h5">
        <q-btn dense flat round icon="remove" @click="score--" />
        <span class="q-ma-sm">{{ score }}</span>
        <q-btn dense flat round icon="add" @click="score++" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
