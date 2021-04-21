import consola from 'consola'
import fetch from 'node-fetch'

/**
 * Makes a GET-request to a specific endpoint of Reddit
 * @param endpoint - the endpoint to fetch
 */
export const makeRequest = async (endpoint: string): Promise<any> => {
  const url = `https://reddit.com/${endpoint}`
  consola.log(`HTTP GET ${url}`)
  const response = await fetch(url, {
    method: 'GET',
  })
  const body = await response.json()
  consola.log(`HTTP Successful GET ${endpoint}`)
  // Here we pick the first one because it contains the posts list
  // `body[1]` contains comments to the post
  return body[0]
}

export function getRandomItemFrom<T = any>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export class ExceededRetriesError extends Error {
  public type = 'ExceededRetriesError'

  constructor(message?: string) {
    super(message ?? 'Request retries limits exceeded!')
  }
}

/**
 * Returns an image from given post's gallery
 * @param post - reddit post
 */
export const getRandomImageFromGallery = (post: any): string => {
  const validPosts = Object.values(post.media_metadata).filter((image: any) => image.status === 'valid')
  const item: any = getRandomItemFrom(validPosts)
  return item.s.u.replace(/&amp;/g, '&')
}
