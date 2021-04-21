export function getRandomItemFrom<T = any>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export class ExceededRetriesError extends Error {
  public type = 'ExceededRetriesError'

  constructor(message?: string) {
    super(message ?? 'Request retries limits exceeded!')
  }
}
