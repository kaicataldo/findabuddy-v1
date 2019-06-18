'use strict';

const END_PHRASES_SINGLE = [
  'who needs a loving home!',
  'looking for a new family!',
  'looking for a furever home!',
  'who needs a new best friend!',
  'who needs a place to call home!',
  'looking for a forever home!',
  'who wants to be your buddy!',
  'looking for a loving family!',
  'in need of love!',
  'in need of a loving home!',
  'looking for a new home!',
  "who needs some lovin'!",
  'who could be your new buddy!'
];
const END_PHRASES_MULTI = [
  'who need a loving home!',
  'looking for a new family!',
  'looking for a furever home!',
  'who need a new best friend!',
  'who need a place to call home!',
  'looking for a forever home!',
  'who want to be your buddies!',
  'looking for a loving family!',
  'in need of love!',
  'in need of a loving home!',
  'looking for a new home!',
  "who need some lovin'!",
  'who could be your new buddies!'
];

function isMultiplePups(name) {
  return (
    (name.indexOf('&') > -1 || name.indexOf(' and ') > -1) &&
    !(
      name.indexOf('-') > -1 ||
      name.indexOf('~') > -1 ||
      (name.indexOf('(') > -1 && name.indexOf(')') > -1)
    )
  );
}

function generateText({ name, sex, breed, mix }) {
  let startPhrase = `${name} is a ${sex} ${breed}${mix}`;
  let endPhraseOpts = END_PHRASES_SINGLE;

  if (isMultiplePups(name)) {
    startPhrase = `${name} are doggies`;
    endPhraseOpts = END_PHRASES_MULTI;
  }

  const endPhrase =
    endPhraseOpts[Math.floor(Math.random() * endPhraseOpts.length)];

  return startPhrase + ' ' + endPhrase;
}

function pickImg(photos) {
  if (photos) {
    for (const photo of photos) {
      if (photo['@size'] === 'x') {
        return photo.$t;
      }
    }
  }
  return null;
}

function formatName(name) {
  name = name.replace(/{.*?}|\[.*?\]|<.*?>|\(.*?\)/g, '');
  // The stuff people put in the name field continues to surprise me
  if (
    name.match(
      /[0-9]|#|zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|zzz/gi
    ) !== null
  ) {
    name = name.replace(
      /[0-9]|#|dob |\/|\(|\)|\\|-|–|—|\*|zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|zzz/gi,
      ''
    );
  }
  // Strip extra whitespace
  name = name.replace(/\s{2,}/g, ' ').trim();

  return name;
}

function pickBreed(breed) {
  if (breed.length > 1) {
    let breeds = '';
    for (let i = 0; i < breed.length; i++) {
      breeds += breed[i].$t + (i === breed.length - 1 ? '' : '/');
    }
    return breeds;
  }
  return breed.$t || 'doggie';
}

function link(id) {
  return `http://www.petfinder.com/petdetail/${id}`;
}

function whichSex(sex) {
  return sex === 'F' ? 'female' : 'male';
}

function whichMix(isMix, breed) {
  return isMix === 'yes' && breed !== 'doggie' ? ' mix' : '';
}

function formatData(dogData) {
  const dogAttrs = {
    name: formatName(dogData.name.$t),
    sex: whichSex(dogData.sex.$t),
    breed: pickBreed(dogData.breeds.breed),
    petFinderUrl: link(dogData.id.$t),
    imgUrl: dogData.media.photos ? pickImg(dogData.media.photos.photo) : null
  };
  dogAttrs.mix = whichMix(dogData.mix.$t, dogAttrs.breed);

  return dogAttrs;
}

module.exports = function(dogData) {
  const dogAttrs = formatData(dogData);
  const tweetText = generateText(dogAttrs);

  return {
    text: tweetText + ' ' + dogAttrs.petFinderUrl,
    img: dogAttrs.imgUrl
  };
};
