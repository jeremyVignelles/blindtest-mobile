<script setup lang="ts">
import type { Notification } from '@/types/notification'
defineProps<{
  notification: Notification | null
}>()

const emit = defineEmits<{
  'transition-end': []
}>()
</script>

<template>
  <Transition @after-enter="emit('transition-end')">
    <div v-if="notification" class="notification" :class="notification.type">
      <span>{{ notification.message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.notification {
  position: fixed;
  bottom: 8px;
  display: flex;
  width: 100%;
  justify-content: center;
  text-shadow: 0px 0px 2px white;
  font-weight: bold !important;
  font-size: 3.75rem;
}

.notification.success {
  color: var(--q-positive);
}

.notification.error {
  color: var(--q-negative);
}

.notification.v-enter-active {
  transition:
    font-size ease-out 0.2s,
    transform ease-out 0.2s,
    opacity 0.2s,
    background-color ease-out 2s; /* just to make the animation last a little longer */
}

.notification.v-enter-from {
  transform: translateY(100%);
  opacity: 0;
  font-size: 1rem;
}
</style>
