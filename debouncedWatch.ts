import { watch, type WatchSource, type WatchStopHandle } from '@vue-reactivity/watch'

export function debouncedWatch<T>(
  source: WatchSource<T>,
  cb: (value: T) => void,
  delay: number,
  options: { immediate?: boolean } = { immediate: false }
): WatchStopHandle {
  return watch(source, debouncedCall(cb, delay), { deep: true, ...options })
}

function debouncedCall<TFunction extends (...args: any[]) => void>(
  cb: TFunction,
  delay: number
): TFunction {
  let timeout: NodeJS.Timeout | undefined
  return <TFunction>function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}
