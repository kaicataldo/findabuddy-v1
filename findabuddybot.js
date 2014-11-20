var request = require('request'),
    twitter_update_with_media = require('./twitter_update_with_media'),
    twitterAPI = require('node-twitter-api'),
    config = require('./config');
 
var tuwm = new twitter_update_with_media({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  token: config.token,
  token_secret: config.token_secret,
});

var twitter = new twitterAPI({
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    callback: ''
});

var offset;
var dogData;
var nameData;
var sex;
var breed;
var mix;
var picArray;
var picture;
var id;
var startPhrase;
var endPhrase;
var buddyTweet;

var getRequest = function() {
  var petFinderKey = config.petfinder_key;
  randomizer();
  var url = 'http://api.petfinder.com/pet.find?key=' + petFinderKey + '&animal=dog&location=new%20york%20ny&count=1&offset=' + offset + '&output=full&format=json';

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parsedData = JSON.parse(body);
      dogData = parsedData.petfinder.pets.pet;
      nameData = dogData.name.$t;
      
      name = formatName(nameData);
      sex = sex(dogData.sex.$t);
      mix = mix(dogData.mix.$t);
      id = link(dogData.id.$t);
      breed = pickBreed(dogData.breeds.breed);
      buddyTweet = oneOrTwo(name, id);

      if (Object.getOwnPropertyNames(dogData.media).length === 0) {
        postTweetText(buddyTweet);
        //console.log(buddyTweet);
      }
      else {
        picArray = dogData.media.photos.photo;
        pickPic(picArray);
        postTweetPic(buddyTweet, picture);
        //console.log(buddyTweet + " || " + picture);
      }
    }
    else {
      console.log('Error!');
    }
  });
};
 
var postTweetPic = function(tweetText, tweetPic) {
  tuwm.post(tweetText, tweetPic, function(err, response) {
    if (err) {
      console.log(err);
    }
    console.log(buddyTweet + " || " + picture);
  });
};

var postTweetText = function(tweetText) {
  twitter.statuses("update", {
        status: tweetText
    },
    config.token,
    config.token_secret,
    function(error, data, response) {
        if (error) {
            console.log(error);
        } 
        else {
            console.log(buddyTweet);
        }
    });
};

function formatName(petName) {
  if (petName.match(/zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|zzz|[0-9]|#/gi) !== null && petName.match(/\/|[(]|[)]|[\[\]]|-|–|—|[*]/gi) === null) {
    petName = petName.replace(/zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|zzz|[0-9]|#/gi, '');
  }
  else if (petName.match(/zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|dob |zzz|[0-9]|#/gi) !== null && petName.match(/\/|[(]|[)]|[\[\]]|-|–|—|[*]/gi) !== null) {
    petName = petName.replace(/zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|dob |zzz|[0-9]|#|\/|[(]|[)]|[\[\]]|-|–|—|[*]/gi, '');
  }
  petName = petName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  petName = petName.replace(/ And /gi, function(i) { return i.toLowerCase(); });
  petName = petName.replace(/ Or /gi, function(j) { return j.toLowerCase(); });
  petName = petName.replace(/ Asap/gi, function(k) { return k.toUpperCase(); });
  petName = petName.replace(/ Aka /gi, function(l) { return l.toUpperCase(); });
  petName = petName.replace(/\s+/g,' ').trim();
  if (petName.length === 2 && petName !== "Al") {
    petName = petName.toUpperCase();
  }
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

function oneOrTwo(name, id) {
  var oneDoggie;

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
  endPhrase = endOfSentence(oneDoggie);
  buddyTweet = startPhrase + endPhrase + " " + id;
  return buddyTweet;
}

function pickPic(photos) {
  photo = 0;
  while (photos[photo]['@size'] !== 'x') {
    photo++;
    if (photo === photos.length) {
      getRequest();
    }
  picture = photos[photo].$t;
  }
}

function link(idNumber) {
 return "https://www.petfinder.com/petdetail/" + idNumber + "/";
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

function sex(whichSex) {
  if (whichSex === 'F') {
    return "female";
  }
  else if (whichSex === 'M') {
    return "male";
  }
}

function mix(isMix) {
  if (isMix === 'yes' && breed !== 'doggie') {
    return " mix";
  }
  else {
    return "";
  }
}

function randomizer() {
  offset = Math.round(Math.random() * 1999);
}

getRequest();