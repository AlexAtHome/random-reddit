import { RedditListingInterface, ThreadInterface } from 'reddit-interfaces'
import { IPost } from './interface'
import { getRandomImageFromGallery, getRandomItemFrom, logger, makeRequest } from './utils'

/**
 * Returns the random post from specified subreddit
 * @param subreddit - subreddit name (without `r/` part)
 */
export const getPost = async (subreddit: string | string[]): Promise<IPost> => {
  const pickedSub: string = Array.isArray(subreddit) ? getRandomItemFrom(subreddit) : subreddit
  const response = await makeRequest<RedditListingInterface>(`r/${pickedSub}.json?limit=50`);
  logger.debug('HTTP response', response)
  const children = Array.isArray(response) ? getRandomItemFrom(response)?.data?.children : response?.data?.children
  const child = Array.isArray(children) ? getRandomItemFrom(children) : children
  return child.data
}

/**
 * Returns the image from random post from specified subreddit.
 * If the post doesn't have the image - repeats the request until it contains the image
 * @param subreddit - subreddit name (without `r/` part)
 */
export const getImage = async (subreddit: string | string[], retryLimit: number = 10): Promise<string> => {
  let retries = 0
  let post: IPost | null = await getPost(subreddit)
  if (post === null) {
    throw new Error(`Specified subreddit r/${subreddit} doesn't exist!`)
  }
  while (retries < retryLimit) {
    const hasImageURL = /(jpe?g|png|gif)/.test(post?.url ?? '')
    if (hasImageURL) {
      logger.debug('Got an image', post?.url)
      break
    }
    retries += 1
    if (retries === retryLimit) {
      return ''
    }
    // Loop is required here because this method is supposed to returns something that is not `undefined`
    // eslint-disable-next-line no-await-in-loop
    post = await getPost(subreddit)
    logger.warn('No image URL found! Repeating the process...')
  }
  if (post?.is_gallery) {
    return getRandomImageFromGallery(post)
  }
  // here can be imgur `.gifv` links sometimes, they have to be replaced w/ `gif` ones
  return post?.url.replace('gifv', 'gif')
}

/**
 * Returns a specific post with given ID from specified subreddit
 * @param subreddit - subreddit name
 * @param id - id (ID36) of the post
 */
export const getPostById = async (id: string, subreddit: string): Promise<IPost> => {
  const response = await makeRequest<RedditListingInterface>(`/r/${subreddit}/comments/${id}.json`)
  return ((response.data?.children[0].data as ThreadInterface) as IPost) ?? null
}
