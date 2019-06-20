'use strict';

const Twitter = require('twitter');

module.exports = class TwitterClient {
  constructor({ CONSUMER_KEY, CONSUMER_SECRET, TOKEN_KEY, TOKEN_SECRET }) {
    this._client = new Twitter({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
      access_token_key: TOKEN_KEY,
      access_token_secret: TOKEN_SECRET
    });
  }

  _post(status, cb) {
    this._client.post('statuses/update', status, (error, tweet) => {
      if (error) {
        cb(error);
      }

      // On the 3rd attempt, an error is not created.
      if (tweet.errors) {
        cb(tweet.errors);
      }

      console.info(tweet);
    });
  }

  postTweet({ text, img }, cb) {
    if (img) {
      this._client.post('media/upload', { media_data: img }, (error, media) => {
        if (error) {
          cb(error);
        }

        this._post({ status: text, media_ids: media.media_id_string }, cb);
      });
    } else {
      this._post({ status: text }, cb);
    }
  }
};
