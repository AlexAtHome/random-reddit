# Random Reddit [![npm](https://img.shields.io/npm/v/random-reddit?style=flat-square)](https://www.npmjs.com/package/random-reddit)

The set of functions that get random posts or images from specified subreddit.

## Usage

### Installation
1. `npm install random-reddit`
2. Use `getPost()` or `getImage()` from the package.  

### Example

```js
const { getPost, getImage } = require('random-reddit')

function async getPost() {
  const post = await getPost('memes')
  console.log(post) // returns the reddit post object
  // ...
}

function async getImage() {
  const image = await getImage('memes')
  console.log(image) // e.g. https://i.redd.it/sri113wns9351.png
}
```

#### `getPost()`

```ts
getPost(subreddit: string | string[]): Promise
```
Returns the whole Reddit post.

**Arguments**:
- `subreddit` (`string | string[]`) - a subreddit to fetch the post from. You can also specify an array of subreddit names

#### `getImage()`

```ts
getImage(subreddit: string | string[], retryLimit?: number): Promise
```
Returns the random post's image URL. If it won't find one - the request will be sent again until the `retryLimit` is reached.

**Arguments**:
- `subreddit` (`string | string[]`) - a subreddit to fetch the image from. You can also specify an array of subreddit names
- `retryLimit` (`number`) - *optional*. Request retry limit. Default is 10.

#### `getPostById()`

```ts
getPostById(id: string, subreddit: string): Promise
```
Returns specific post with given id (ID36) and specified subreddit.

**Arguments**:
- `id` (`string`) - post's id
- `subreddit` (`string`) - a subreddit to fetch the post from