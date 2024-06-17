import type { QScrollArea } from 'quasar'
import { computed, onMounted, watch, type Ref } from 'vue'

export function useScrollToBottom(scrollArea: Ref<QScrollArea | undefined>) {
  const scroll = computed(() => {
    const scroll = scrollArea.value?.getScroll()
    return {
      position: scroll?.verticalPosition ?? 1,
      size: scroll?.verticalSize ?? 1,
      containerSize: scroll?.verticalContainerSize ?? 1
    }
  })

  function scrollToBottom(duration: number = 300) {
    scrollArea.value?.setScrollPercentage('vertical', 1, duration)
  }

  onMounted(() => scrollToBottom(0))

  watch(
    () => scroll.value.size,
    () => scrollToBottom()
  )
  watch(
    () => scroll.value.containerSize,
    () => scrollToBottom()
  )
}
