
import RedditAPI, { IRedditAPIOptions, API } from "reddit-wrapper-v2"

import { getRandomItemFrom } from "./utils"
import { assert } from "console"

const version = '1.1.0'

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
      user_agent: `${process.platform}:grabbit:${version} (by /u/mamoru-kun)`,
      retry_on_wait: true,
      retry_on_server_error: 5,
      retry_delay: 5,
      logs: false,
      ...params
    }).api
    this._canLog = params?.logs || false
  }

  /**
   * Returns the random post from specified subreddit
   * @param subreddit - subreddit name (without `r/` part)
   */
  async getPost(subreddit: string | string[], retryLimit: number = 10): Promise<any> {
    let retries = 0
    const pickedSub: string = Array.isArray(subreddit) ? getRandomItemFrom(subreddit) : subreddit
    const [code, response] = await this._reddit.get(`/r/${pickedSub}/random?count=50`)
    if (code !== 200) {
      assert(retries >= retryLimit, '[random-reddit] Request retries limits exceeded!')
      retries += 1
      return this.getPost(subreddit)
    }
    const children = Array.isArray(response) ? response[0]?.data?.children : response?.data?.children
    const post = getRandomItemFrom(children || [])
    if (!post) {
      assert(retries >= retryLimit, '[random-reddit] Request retries limits exceeded!')
      retries += 1
      return this.getPost(subreddit)
    }
    return post
  }

  /**
   * Returns the image from random post from specified subreddit.
   * If the post doesn't have the image - repeats the request until it contains the image
   * @param subreddit - subreddit name (without `r/` part)
   */
  async getImage(subreddit: string | string[], retryLimit: number = 10): Promise<string> {
    const post = await this.getPost(subreddit)
    const hasImageLink = /(jpe?g|png|gif)/.test(post?.data?.url)
    let retries = 0
    if (!hasImageLink) {
      if (this._canLog) {
        console.warn("[random-reddit] No image link found! Repeating the process...")
      }
      assert(retries >= retryLimit, '[random-reddit] Request retries limits exceeded!')
      retries += 1
      return this.getImage(subreddit)
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
  async getPostById(id: string, subreddit: string, retryLimit: number = 10): Promise<any> {
    let retries = 0
    const [code, response] = await this._reddit.get(`/r/${subreddit}/comments/${id}`)
    if (code !== 200) {
      assert(retries >= retryLimit, '[random-reddit] Request retries limits exceeded!')
      retries += 1
      return this.getPostById(subreddit, id, retryLimit)
    }
    return response[0]?.data?.children[0]?.data
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
}
