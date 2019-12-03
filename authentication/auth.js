// Setup Firebase authentication strategy

const admin = require('firebase-admin');

// firebase project config details

// if you don't have one already, create a serviceAccountKey.json
// Go to your Firebase Console on Web -> select the project
// Goto Service Accounts tab and Generate a new private key
const serviceAccount = require('./serviceAccountKey.json');

const firebaseConfig = require('./firebase-config.json');

// use the existing firebase admin 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL
});

module.exports = {
  name: 'auth',
  register (server) {
    server.auth.strategy('firebase', 'firebase', {
      instance: admin
    });
  },
};
