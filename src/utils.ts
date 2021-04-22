import consola, { LogLevel } from 'consola'
import fetch from 'node-fetch'
import { IPost } from './interface'

/**
 * Makes a GET-request to a specific endpoint of Reddit
 * @param endpoint - the endpoint to fetch
 */
export const makeRequest = async <T = any>(endpoint: string): Promise<T> => {
  const url = `https://reddit.com/${endpoint}`
  consola.log(`HTTP GET ${url}`)
  const response = await fetch(url, {
    method: 'GET',
  })
  const body = await response.json()
  consola.log(`HTTP Successful GET ${endpoint}`)
  // Here we pick the first one because it contains the posts list
  // `body[1]` contains comments to the post
  return body[0] as T
}

/**
 * Returns the random item from given array
 * @param arr - the array of something
 */
export function getRandomItemFrom<T = any>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Returns an image from given post's gallery
 * @param post - reddit post
 */
export const getRandomImageFromGallery = (post: IPost): string => {
  const validPosts = Object.values(post.media_metadata).filter((image: any) => image.status === 'valid')
  const item: any = getRandomItemFrom(validPosts)
  return item.s.u.replace(/&amp;/g, '&')
}

const getLogLevel = (): number => {
  let level = Number(process.env.RANDOM_REDDIT_LOG_LEVEL)
  if (Number.isNaN(level)) {
    level = Number(process.env.CONSOLA_LEVEL)
  }
  return Number.isNaN(level) ? LogLevel.Error : level
}

export const logger = consola.create({
  level: getLogLevel(),
})
