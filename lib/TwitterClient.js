import Twitter from 'twitter';

export default class TwitterClient {
  constructor(config) {
    this.client = new Twitter({
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      access_token_key: config.token_key,
      access_token_secret: config.token_secret
    });
  }

  tweetText(text) {
    this.client.post('statuses/update', { status: text }, (error, tweet, response) => {
      if (!error) {
        console.log(response);
      }
      else {
        console.error('Error posting tweet: ' + JSON.stringify(error));
      }
    });
  }

  tweetImage(text, image) {
    this.client.post('media/upload', { media_data: image }, (error, media, response) => {
      if (!error) {
        const status = {
          status: text,
          media_ids: media.media_id_string
        };

        this.client.post('statuses/update', status, (error, tweet, response) => {
          if (!error) {
            console.log(response);
          }
          else {
            console.error('Error posting tweet: ' + JSON.stringify(error));
          }
        });
      }
      else {
        console.error('Error uploading media: ' + JSON.stringify(error));
      }
    });
  }
};
