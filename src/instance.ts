import { Consola, LogLevel } from 'consola'
import fetch from 'node-fetch'
import { IInstanceOptions } from './interface'
import { getLogger } from './logger'

import { ExceededRetriesError, getRandomItemFrom } from './utils'

/**
 * RandomReddit class
 *
 * Usage:
 * 1. Create the instance of this class
 * 2. Use `getPost()` or `getImage()` method from your instance
 */
export class RandomReddit {
  /** Default logger level for this package */
  private readonly _defaultLoggerLevel = LogLevel.Warn

  /** Logger instance */
  private _logger: Consola

  /**
   * Creates new RandomReddit instance
   * @param params - `RandomReddit` instance options
   */
  constructor({ logLevel }: IInstanceOptions) {
    this._logger = getLogger(logLevel ?? this._defaultLoggerLevel)
  }

  /**
   * Returns the random post from specified subreddit
   * @param subreddit - subreddit name (without `r/` part)
   */
  async getPost(subreddit: string | string[]): Promise<any | null> {
    const pickedSub: string = Array.isArray(subreddit) ? getRandomItemFrom(subreddit) : subreddit
    const response = await this._request(`/r/${pickedSub}/random.json?limit=1`)
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
      // Loop is required here because this method is supposed to returns something that is not `undefined`
      // eslint-disable-next-line no-await-in-loop
      post = await this.getPost(subreddit)
      const hasImageURL = /(jpe?g|png|gif)/.test(post?.data?.url)
      if (hasImageURL) {
        this._logger.debug('Got an image!', post?.data?.url)
        break
      }
      retries += 1
      if (retries === retryLimit) {
        throw new ExceededRetriesError('No image URL found! Request retries limits exceeded!')
      }
      this._logger.warn('No image URL found! Repeating the process...')
    }
    if (post.data.is_gallery) {
      return this._getRandomImageFromGallery(post)
    }
    // here can be imgur `gifv` links sometimes, they have to be replaced w/ `gif` ones
    return post.data.url.replace('gifv', 'gif')
  }

  /**
   * Returns a specific post with given ID from specified subreddit
   * @param subreddit - subreddit name
   * @param id - id (ID36) of the post
   */
  async getPostById(id: string, subreddit: string): Promise<any | null> {
    const response = await this._request(`/r/${subreddit}/comments/${id}.json`)
    return response.data?.children[0] ?? null
  }

  /**
   * Returns an image from given post's gallery
   * @param post - reddit post
   */
  private _getRandomImageFromGallery(post: any): string {
    const validPosts = Object.values(post.media_metadata).filter((image: any) => image.status === 'valid')
    const item: any = getRandomItemFrom(validPosts)
    return item.s.u.replace(/&amp;/g, '&')
  }

  /**
   * Makes a GET-request to a specific endpoint of Reddit
   * @param endpoint - the endpoint to fetch
   */
  private async _request(endpoint: string): Promise<any> {
    const response = await fetch(`https://reddit.com/${endpoint}`, {
      method: 'GET',
    })
    const body = await response.json()
    return body[0]
  }
}
