var request = require('request'),
    Twitter = require('twitter'),
    base64 = require('node-base64-image'),
    config = require('./config');

var client = new Twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.token,
  access_token_secret: config.token_secret
});

function getRequest() {
  var petFinderKey = config.petfinder_key,
      offset = Math.round(Math.random() * 1999),
      url = 'http://api.petfinder.com/pet.find?key=' + petFinderKey + '&animal=dog&location=new%20york%20ny&count=1&offset=' + offset + '&output=full&format=json';

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var parsedData = JSON.parse(body),
          dogData = parsedData.petfinder.pets.pet,
          oneDoggie,
          buddyTweet = createTweet(dogData);

      if (Object.getOwnPropertyNames(dogData.media).length === 0) {
        postTweetText(buddyTweet);
        console.log(buddyTweet);
      }
      else {
        var picUrl = pickPic(dogData.media.photos.photo);

        base64.base64encoder(picUrl, {string: true}, function (error, buddyPic) {
          if (!error) {
            postTweetPic(buddyTweet, buddyPic);
          }
          else {
            console.log('Error encoding image: ' + JSON.stringify(error));
          }
        });
        
      }
    }
    else {
      console.log('Error getting dog data: ' + JSON.stringify(error));
    }
  });
}

function postTweetText(tweetText) {
  client.post('statuses/update', { status: tweetText }, function(error, tweet, response){
    if (!error) {
      console.log('Success: ' + tweet.text);
    }
    else {
      console.log('Error posting tweet: ' + JSON.stringify(error));
    }
  });
}

function postTweetPic(tweetText, tweetPic) {
  client.post('media/upload', { media_data: tweetPic }, function(error, media, response){
    if (!error) {
      var status = {
        status: tweetText,
        media_ids: media.media_id_string
      };

      client.post('statuses/update', status, function(error, tweet, response){
        if (!error) {
          console.log(tweet.text);
        }
        else {
          console.log('Error posting tweet: ' + JSON.stringify(error));
        }
      });
    }
    else {
      console.log('Error uploading media: ' + JSON.stringify(error));
    }
  });
}

function createTweet(dogData) {
  var name = formatName(dogData.name.$t),
      sex = whichSex(dogData.sex.$t),
      breed = pickBreed(dogData.breeds.breed),
      mix = whichMix(dogData.mix.$t, breed),
      id = link(dogData.id.$t),
      startPhrase = beginningOfSentence(name, sex, breed, mix),
      endPhrase = endOfSentence(oneDoggie),
      returnTweet = startPhrase + endPhrase + " " + id;
  return returnTweet;
}

function beginningOfSentence(name, sex, breed, mix) {
  if (name.indexOf('&') > -1 || name.indexOf(' and ') > -1) {
    if (name.indexOf('-') > -1 || name.indexOf('~') > -1 || name.indexOf('(') > -1 && name.indexOf(')') > -1) {
      oneDoggie = true;
      startPhrase = name + " is a " + sex + " " + breed + mix;
    }
    else {
      oneDoggie = false;
      startPhrase = name + " are doggies";
    }
  }
  else {
    oneDoggie = true;
    startPhrase = name + " is a " + sex + " " + breed + mix;
  }
  return startPhrase;
}

function endOfSentence(oneDoggie) {
  var phrases;
  if (oneDoggie === false) {
    phrases = [' who need a loving home!', ' looking for a new family!', ' looking for a furever home!', ' who need a new best friend!', ' who need a place to call home!', ' looking for a forever home!', ' who want to be your buddies!', ' looking for a loving family!', ' in need of love!', ' in need of a loving home!', ' looking for a new home!', ' who need some lovin\'!', ' who could be your new buddies!'];
  }
  else if (oneDoggie === true) {
    phrases = [' who needs a loving home!', ' looking for a new family!', ' looking for a furever home!', ' who needs a new best friend!', ' who needs a place to call home!', ' looking for a forever home!', ' who wants to be your buddy!', ' looking for a loving family!', ' in need of love!', ' in need of a loving home!', ' looking for a new home!', ' who needs some lovin\'!', ' who could be your new buddy!'];
  }
  endPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  return endPhrase;
}

function pickPic(photos) {
  var photo = 0;
  while (photos[photo]['@size'] !== 'x') {
    photo++;
    if (photo === photos.length) {
      getRequest();
    }
  }
  return photos[photo].$t;
}

function formatName(petName) {
  petName = petName.replace(/{.*?}/g, "")
                   .replace(/\[.*?\]/g, "")
                   .replace(/<.*?>/g, "")
                   .replace(/\(.*?\)/g, "");
  if (petName.match(/zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|zzz|[0-9]|#/gi) !== null && petName.match(/\/|[(]|[)]|[\[\]]|-|–|—|[*]/gi) === null) {
    petName = petName.replace(/zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|zzz|[0-9]|#/gi, '');
  }
  else if (petName.match(/zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|dob |zzz|[0-9]|#/gi) !== null && petName.match(/\/|[(]|[)]|[\[\]]|-|–|—|[*]/gi) !== null) {
    petName = petName.replace(/zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|dob |zzz|[0-9]|#|\/|[(]|[)]|[\[\]]|-|–|—|[*]/gi, '');
  }
  petName = petName.replace(/    /gi, " ");
  petName = petName.replace(/   /gi, " ");
  petName = petName.replace(/  /gi, " ");
  petName = petName.trim();
  
  return petName;
}

function pickBreed(breed) {
  var singleBreed = true;

  if (breed.length) {
    var breedString = '';
    singleBreed = false;

    for (var i = 0; i < breed.length; i++) {

      if(i === breed.length - 1) {
        breedString += breed[i].$t;
      } else {
        breedString += breed[i].$t + '/';
      }
    }
    breed = breedString;
  }
  if (singleBreed === true) {
    breed = breed.$t ? breed.$t : 'doggie';
  }
  return breed;
}

function link(idNumber) {
  return "http://www.petfinder.com/petdetail/" + idNumber;
}

function whichSex(sex) {
  if (sex === 'F') {
    return "female";
  }
  else if (sex === 'M') {
    return "male";
  }
}

function whichMix(isMix, breed) {
  if (isMix === 'yes' && breed !== 'doggie') {
    return " mix";
  }
  else {
    return "";
  }
}

getRequest();
