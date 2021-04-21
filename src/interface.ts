import { LogLevel } from 'consola'
import { IRedditAPIOptions } from 'reddit-wrapper-v2'

export { LogLevel } from 'consola'

export interface IInstanceOptions extends IRedditAPIOptions {
  /** Logging level. Default is 1 (includes errors and warns) */
  logLevel?: LogLevel
}
