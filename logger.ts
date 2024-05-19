export interface Logger {
  log: typeof console.log
  info: typeof console.info
  warn: typeof console.warn
  error: typeof console.error
  debug: typeof console.debug
}

export default function makeLogger(idPrefix: string): Logger {
  return {
    log: console.log.bind(console, `[${idPrefix}]`),
    info: console.info.bind(console, `[${idPrefix}]`),
    warn: console.warn.bind(console, `[${idPrefix}]`),
    error: console.error.bind(console, `[${idPrefix}]`),
    debug: console.debug.bind(console, `[${idPrefix}]`)
  }
}
