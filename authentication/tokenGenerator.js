// This is a token generator script used for making requests to protected endpoints

const admin = require('firebase-admin');
const firebase = require('./firebase-client');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Replace this with the id of your demo user
// for demo purposes we've hardcoded this id
// When using in front-end this should be replace by
// the id of the user making the request
const demoUid = 'ogCBkc2J0nM8SFbA15tqCsky4SG2';

module.exports = new Promise(() => {
    return admin.auth().createCustomToken(demoUid)
    .then((customToken) => {
      // console.log(customToken);
      return firebase.auth().signInWithCustomToken(customToken);
    })
    .then(() => {
      return firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
    })
    .then((token) => {
      console.log(token);
    })
    .catch((err) => {
      console.log(err);
    });
});