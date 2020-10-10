# Random Reddit [![npm](https://img.shields.io/npm/v/random-reddit?style=flat-square)](https://www.npmjs.com/package/random-reddit)

The class with functions that get random posts or images from specified subreddit.

## Usage
**Before installation**:
1. Proceed to [Authorized applications](https://www.reddit.com/prefs/apps)
2. Press the "Create another app" button
3. Enter your application's name, its description and about and redirect uris
4. Choose *"script"* in the list - _**that's important**_
5. Press the "Create app" button

You will get the app's ID under the "personal use script" line and app's secret hash.

### Installation
1. `npm install random-reddit`
2. Create `RandomReddit` instance. Pass your Reddit credentials in the constructor. Options are took from the [`reddit-wrapper-v2` package](https://github.com/Javin-Ambridge/reddit-wrapper#reddit-api-options).  
3. Use `getPost()` or `getImage()` from the instance.  

### Example

```js
const { RandomReddit } = require('random-reddit')

const reddit = new RandomReddit({
  username: 'reddit_username',
  password: 'reddit password',
  app_id: 'reddit api app id',
  api_secret: 'reddit api secret',
  logs: true // specify this if you want logs from this package
});

function async post() {
  const post = await reddit.getPost('the_donald')
  console.log(post) // returns the reddit post object
  // ...
}

function async image() {
  const image = await reddit.getImage('memes')
  console.log(image) // e.g. https://i.redd.it/sri113wns9351.png
}
```

#### `getPost()`

```js
RandomReddit.getPosts(subreddit [, retryLimit]): Promise
```
Returns the whole Reddit post.

**Arguments**:
- `subreddit` (`string | string[]`) - a subreddit to fetch the post from. You can also specify an array of subreddit names
- `retryLimit` (`number`) - *optional*. Failed request retry limit. Default is 10.

#### `getImage()`

```js
RandomReddit.getPosts(subreddit [, retryLimit]): Promise
```
Returns the random post's image. If it won't find one - the request will be sent again.

**Arguments**:
- `subreddit` (`string | string[]`) - a subreddit to fetch the image from. You can also specify an array of subreddit names
- `retryLimit` (`number`) - *optional*. Failed request retry limit. Default is 10.

#### `getPostById()`

```js
RandomReddit.getPostById(id, subreddit [, retryLimit]): Promise
```
Returns specific post with given id (ID36) and specified subreddit.

**Arguments**:
- `id` (`string`) - post's id
- `subreddit` (`string`) - a subreddit to fetch the post from
- `retryLimit` (`number`) - *optional*. Failed request retry limit. Default is 10.