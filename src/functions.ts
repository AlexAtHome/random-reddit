import consola from 'consola'
import { ExceededRetriesError, getRandomImageFromGallery, getRandomItemFrom, makeRequest } from './utils'

/**
 * Returns the random post from specified subreddit
 * @param subreddit - subreddit name (without `r/` part)
 */
export const getPost = async (subreddit: string | string[]): Promise<any | null> => {
  const pickedSub: string = Array.isArray(subreddit) ? getRandomItemFrom(subreddit) : subreddit
  const response = await makeRequest(`/r/${pickedSub}/random.json?limit=1`)
  const children = Array.isArray(response) ? response[0]?.data?.children : response?.data?.children
  const child = Array.isArray(children) ? children[0] : children
  consola.debug('Response', child.data)
  return child.data
}

/**
 * Returns the image from random post from specified subreddit.
 * If the post doesn't have the image - repeats the request until it contains the image
 * @param subreddit - subreddit name (without `r/` part)
 */
export const getImage = async (subreddit: string | string[], retryLimit: number = 10): Promise<string | null> => {
  let retries = 0
  let post: any
  while (retries < retryLimit) {
    // Loop is required here because this method is supposed to returns something that is not `undefined`
    // eslint-disable-next-line no-await-in-loop
    post = await getPost(subreddit)
    const hasImageURL = /(jpe?g|png|gif)/.test(post?.url)
    if (hasImageURL) {
      consola.debug('Got an image!', post?.url)
      break
    }
    retries += 1
    if (retries === retryLimit) {
      throw new ExceededRetriesError('No image URL found! Request retries limits exceeded!')
    }
    consola.warn('No image URL found! Repeating the process...')
  }
  if (post.is_gallery) {
    return getRandomImageFromGallery(post)
  }
  // here can be imgur `.gifv` links sometimes, they have to be replaced w/ `gif` ones
  return post.url.replace('gifv', 'gif')
}

/**
 * Returns a specific post with given ID from specified subreddit
 * @param subreddit - subreddit name
 * @param id - id (ID36) of the post
 */
export const getPostById = async (id: string, subreddit: string): Promise<any | null> => {
  const response = await makeRequest(`/r/${subreddit}/comments/${id}.json`)
  return response.data?.children[0] ?? null
}
