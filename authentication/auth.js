// Setup Firebase authentication strategy

const admin = require('firebase-admin');

// firbase project config details
const serviceAccount = require('./serviceAccountKey.json');

// use the existing firebase admin 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cloud-based-ecommerce-pl-47e01.firebaseio.com/'
});

module.exports = {
  name: 'auth',
  register (server) {
    server.auth.strategy('firebase', 'firebase', {
      instance: admin
    });
  },
};
