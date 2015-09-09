'use strict';

const formatTweet = {
  setup(dogData) {
    this.oneDoggie = '';
    this.name = this.formatName(dogData.name.$t);
    this.sex = this.whichSex(dogData.sex.$t);
    this.breed = this.pickBreed(dogData.breeds.breed);
    this.mix = this.whichMix(dogData.mix.$t, this.breed);
    this.link = this.link(dogData.id.$t);
    this.imgUrl = this.pickImg(dogData.media.photos.photo);
  },

  create() {
    const startPhrase = this.beginningOfSentence(this.name, this.sex, this.breed, this.mix);
    const endPhrase = this.endOfSentence(this.oneDoggie);
    const petFinderUrl = this.link;
    const buddyTweet = {
      text: startPhrase + endPhrase + " " + petFinderUrl,
      img: this.imgUrl
    };

    return buddyTweet;
  },

  beginningOfSentence(name, sex, breed, mix) {
    let startPhrase = '';

    if (name.indexOf('&') > -1 || name.indexOf(' and ') > -1) {
      if (name.indexOf('-') > -1 || name.indexOf('~') > -1 || name.indexOf('(') > -1 && name.indexOf(')') > -1) {
        this.oneDoggie = true;
        startPhrase = name + " is a " + sex + " " + breed + mix;
      }
      else {
        this.oneDoggie = false;
        startPhrase = name + " are doggies";
      }
    }
    else {
      this.oneDoggie = true;
      startPhrase = name + " is a " + sex + " " + breed + mix;
    }
    return startPhrase;
  },

  endOfSentence(oneDoggie) {
    let phrases = [];
    let endPhrase = '';

    if (this.oneDoggie) {
      phrases = [' who needs a loving home!', ' looking for a new family!', ' looking for a furever home!', ' who needs a new best friend!', ' who needs a place to call home!', ' looking for a forever home!', ' who wants to be your buddy!', ' looking for a loving family!', ' in need of love!', ' in need of a loving home!', ' looking for a new home!', ' who needs some lovin\'!', ' who could be your new buddy!'];
    }
    else {
      phrases = [' who need a loving home!', ' looking for a new family!', ' looking for a furever home!', ' who need a new best friend!', ' who need a place to call home!', ' looking for a forever home!', ' who want to be your buddies!', ' looking for a loving family!', ' in need of love!', ' in need of a loving home!', ' looking for a new home!', ' who need some lovin\'!', ' who could be your new buddies!'];
    }

    endPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    return endPhrase;
  },

  pickImg(photos) {
    for (let photo of photos) {
      if (photo['@size'] === 'x') {
        return photo.$t;
      }
    }
    return false; // if no large img, buddyTweet.img is false
  },

  formatName(petName) {
    petName = petName
              .replace(/{.*?}/g, "")
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
  },

  pickBreed(breed) {
    let singleBreed = true;
    let breedString = '';

    if (breed.length > 1) {
      singleBreed = false;

      for (var i = 0; i < breed.length; i++) {
        if (i === breed.length - 1) {
          breedString += breed[i].$t;
        } else {
          breedString += breed[i].$t + '/';
        }
      }
    }
    if (singleBreed) {
      breedString = breed.$t ? breed.$t : 'doggie';
    }
    return breedString;
  },

  link(idNumber) {
    return "http://www.petfinder.com/petdetail/" + idNumber;
  },

  whichSex(sex) {
    if (sex === 'F') {
      return "female";
    }
    else {
      return "male";
    }
  },

  whichMix(isMix, breed) {
    if (isMix === 'yes' && breed !== 'doggie') {
      return " mix";
    }
    else {
      return "";
    }
  }
};

module.exports = function(dogData) {
  formatTweet.setup(dogData);
  return formatTweet.create();
};
