import { IPost } from '../interface'

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
