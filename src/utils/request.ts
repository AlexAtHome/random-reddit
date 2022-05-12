import fetch from 'node-fetch'
import { Logger } from "./logger"

/**
 * Makes a GET-request to a specific endpoint of Reddit
 * @param endpoint - the endpoint to fetch
 */
 export const makeRequest = async <T = any>(endpoint: string): Promise<T> => {
  const url = `https://reddit.com/${endpoint}`
  Logger.debug(`HTTP GET ${url}`)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Sec-GPC': '1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'mamoruuu/random-reddit'
    }
  })
  const body = await response.json()
  Logger.debug(`Success ${endpoint}`)
  // Here we pick the first one because it contains the posts list
  // `body[1]` contains comments to the post
  return (Array.isArray(body) ? body[0] : body) as T
}