
import RedditAPI, { IRedditAPIOptions } from "reddit-wrapper-v2"
export { IRedditAPIOptions } from 'reddit-wrapper-v2'

import { getRandomItemFrom } from "./utils";

const VERSION = '1.0.0'

/**
 * Reddit's random class for random posts
 * 
 * Usage:
 * 1. Create the instance of this class and pass the Reddit credentials in the constructor
 * 2. Use `getPost()` or `getImage()` method from your instance
 */
export class RandomReddit {
  /** reddit api wrapper instance */
  private _reddit;
  /** whether or not the debug mode is enabled */
  private _canLog: boolean = false;

  /**
   * Creates new RandomReddit instance
   * @param params - Reddit credentials. They go straigt to the reddit api wrapper
   * @see https://github.com/Javin-Ambridge/reddit-wrapper#reddit-api-options
   */
  constructor(params: IRedditAPIOptions) {
    this._reddit = RedditAPI({
      user_agent: `${process.platform}:grabbit:${VERSION} (by /u/mamoru-kun)`,
      retry_on_wait: true,
      retry_on_server_error: 5,
      retry_delay: 5,
      logs: false,
      ...params
    });
    this._canLog = params?.logs || false;
  }

  /**
   * Returns the random post from specified subreddit
   * @param subreddit - subreddit name (without `r/` part)
   */
  async getPost(subreddit: string | string[]): Promise<any> {
    const pickedSub: string = Array.isArray(subreddit) ? getRandomItemFrom(subreddit) : subreddit
    const [, response] = await this._reddit.api.get(`/r/${pickedSub}/random`)
    const post = Array.isArray(response) ? response[0].data.children[0] : response.data.children[0]
    if (!post) {
      return this.getPost(subreddit);
    }
    return post;
  }

  /**
   * Returns the image from random post from specified subreddit.
   * If the post doesn't have the image - repeats the request until it contains the image
   * @param subreddit - subreddit name (without `r/` part)
   */
  async getImage(subreddit: string | string[]): Promise<string> {
    const post = await this.getPost(subreddit);
    const hasImageLink = /(jpe?g|png|gif)/.test(post?.data?.url)
    if (!hasImageLink) {
      if (this._canLog) {
        console.warn("[random-reddit] No image link found! Repeating the process...")
      }
      return this.getImage(subreddit)
    }
    // here can be imgur `gifv` links sometimes, they have to be replaced w/ `gif` ones
    return post.data.url.replace('gifv', 'gif');
  }
}
