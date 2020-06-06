# Random Reddit ![npm](https://img.shields.io/npm/v/random-reddit?style=flat-square)

The class with functions that get random posts or images from specified subreddit.

## Usage
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