const firebase = require('firebase');

const firebaseConfig = require('./firebase-config.json');

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = firebase;