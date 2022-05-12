import { ThreadInterface } from 'reddit-interfaces'

export { LogLevel } from './utils/logger'

/* eslint-disable camelcase */
export interface IPost extends ThreadInterface {
  media_metadata: {
    [hash: string]: any
  }
  is_gallery?: boolean
}

export interface IPostGalleryFile {
  y: number
  x: number
  u: string
}

export interface IPostGalleryItem {
  status: 'valid'
  e: 'Image'
  /** File's MIME-type */
  m: string
  id: string
  o: IPostGalleryFile[]
  p: IPostGalleryFile[]
  s: IPostGalleryFile[]
}
