import consola, { Consola, LogLevel } from 'consola'

/**
 * Returns the logger instance
 * @param level - log level
 * @returns The Consola's logger instance with a custom logging level
 */
export const getLogger = (level: LogLevel): Consola => {
  return consola.create({
    level,
  })
}
