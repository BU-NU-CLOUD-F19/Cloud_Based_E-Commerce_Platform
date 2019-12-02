const firebase = require('firebase');

const firebaseConfig = {
  // REPLACE: Go to your Firebase Console on Web -> select the project -> select the app
  // Copy the initialization snippet here
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = firebase;