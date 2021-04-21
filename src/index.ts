import RedditAPI, { IRedditAPIOptions, API } from 'reddit-wrapper-v2'

import { ExceededRetriesError, getRandomItemFrom } from './utils'

const { version } = require('../package.json')

/**
 * Reddit's random class for random posts
 *
 * Usage:
 * 1. Create the instance of this class and pass the Reddit credentials in the constructor
 * 2. Use `getPost()` or `getImage()` method from your instance
 */
export class RandomReddit {
  /** reddit api wrapper instance */
  private _reddit: API

  /** whether or not the debug mode is enabled */
  private _canLog: boolean = false

  /**
   * Creates new RandomReddit instance
   * @param params - Reddit credentials. They go straigt to the reddit api wrapper
   * @see https://github.com/Javin-Ambridge/reddit-wrapper#reddit-api-options
   */
  constructor(params: IRedditAPIOptions) {
    this._reddit = RedditAPI({
      user_agent: `${process.platform}:random-posts-:${version} (by /u/mamoru-kun)`,
      retry_on_wait: true,
      retry_on_server_error: 5,
      retry_delay: 5,
      logs: false,
      ...params,
    }).api
    this._canLog = params?.logs || false
  }

  /**
   * Returns the random post from specified subreddit
   * @param subreddit - subreddit name (without `r/` part)
   */
  async getPost(subreddit: string | string[], retryLimit: number = 10): Promise<any | null> {
    const pickedSub: string = Array.isArray(subreddit) ? getRandomItemFrom(subreddit) : subreddit
    const [, response] = await this._get(`/r/${pickedSub}/random?count=50`, retryLimit)
    const children = Array.isArray(response) ? response[0]?.data?.children : response?.data?.children
    return getRandomItemFrom(children || []) ?? null
  }

  /**
   * Returns the image from random post from specified subreddit.
   * If the post doesn't have the image - repeats the request until it contains the image
   * @param subreddit - subreddit name (without `r/` part)
   */
  async getImage(subreddit: string | string[], retryLimit: number = 10): Promise<string | null> {
    let retries = 0
    let post: any
    while (retries < retryLimit) {
      post = await this.getPost(subreddit)
      const hasImageURL = /(jpe?g|png|gif)/.test(post?.data?.url)
      if (hasImageURL) {
        break
      }
      retries += 1
      if (retries === retryLimit) {
        throw new ExceededRetriesError('No image URL found! Request retries limits exceeded!')
      }
      this._canLog && console.warn('[random-reddit] No image URL found! Repeating the process...')
    }
    if (post.data.is_gallery) {
      return RandomReddit._getRandomImageFromGallery(post)
    }
    // here can be imgur `gifv` links sometimes, they have to be replaced w/ `gif` ones
    return post.data.url.replace('gifv', 'gif')
  }

  /**
   * Returns a specific post with given ID from specified subreddit
   * @param subreddit - subreddit name
   * @param id - id (ID36) of the post
   * @param retryLimit - maximum amount of possible retries
   */
  async getPostById(id: string, subreddit: string, retryLimit: number = 10): Promise<any | null> {
    const [, response] = await this._get(`/r/${subreddit}/comments/${id}`, retryLimit)
    console.log(response)
    return response[0]?.data?.children[0]?.data ?? null
  }

  /**
   * Returns an image from given post's gallery
   * @param post - reddit post
   */
  static _getRandomImageFromGallery(post: any): string {
    const validPosts = Object.values(post.media_metadata).filter((image: any) => image.status === 'valid')
    const item: any = getRandomItemFrom(validPosts)
    return item.s.u.replace(/\&amp\;/g, '&')
  }

  private async _get(endpoint: string, retryLimit: number = 10): Promise<[number, any]> {
    let retries = 0
    while (retries < retryLimit) {
      this._canLog && console.log(`Trying to GET ${endpoint}. Retries: 0`)
      let response
      try {
        response = await this._reddit.get(endpoint)
      } catch (error) {
        throw error
      }
      switch (response?.[0]) {
        case 200: // OK
          return response
        case undefined: // if Reddit-wrapper-v2 gets 403 error two times in a row, it doesn't throw any errors - it just returns undefined
        case 403: // Access forbidden
          throw new Error('Access denied to Reddit API!')
      }

      retries += 1
      if (this._canLog && retries !== retryLimit) {
        console.warn(`Failed to GET ${endpoint}. Retrying`)
      }
    }
    throw new ExceededRetriesError()
  }
}
