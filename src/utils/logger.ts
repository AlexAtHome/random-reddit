/**
 * @see https://github.com/unjs/consola
 */
export enum LogLevel {
  Fatal = 0,
  Error = 0,
  Warn = 1,
  Log = 2,
  Info = 3,
  Success = 3,
  Debug = 4,
  Trace = 5,
  Silent = -Infinity,
  Verbose = Infinity,
}

export class Logger {
  private static prefix = 'reddit'
  private static level = Logger.getLogLevel();

  static debug(...input: any[]): void {
    if (this.level <= LogLevel.Debug) {
      console.debug(`[${this.prefix}] DEBUG`, ...input)
    }
  }

  static log(...input: any[]): void {
    if (this.level <= LogLevel.Log) {
      console.log(`[${this.prefix}] LOG`, ...input)
    }
  }

  static error(...input: any[]): void {
    if (this.level <= LogLevel.Error) {
      console.error(`[${this.prefix}] ERROR`, ...input)
    }
  }

  static warn(...input: any[]): void {
    if (this.level <= LogLevel.Log) {
      console.warn(`[${this.prefix}] WARN`, ...input)
    }
  }

  private static getLogLevel(): LogLevel {
    const level = Number(process.env.RANDOM_REDDIT_LOG_LEVEL)
    return Number.isNaN(level) ? LogLevel.Error : level;
  }
}