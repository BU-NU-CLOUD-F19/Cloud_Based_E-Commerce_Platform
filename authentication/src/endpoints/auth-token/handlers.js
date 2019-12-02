/**
 * These are the handlers for the endpoints for generating authentication token.
 */

'use strict';

const logger = require('../../utils/logger');
const { Users } = require('../../models/');
const firebase = require('../../../firebase-client');

/**
 * The handler functions for all endpoints defined for the memberships
 */
class Handlers {
  constructor() {
    this.users = new Users();
    this.logger = logger;
  }
  
  /**
   * Get a membership
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async generateToken(req, rep) {
    const { payload: { email }} = req;
    this.logger.logRequest(req);

    try {
      this.logger.debug(`\tHandler: Generating token`);
      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be whitelisted in the Firebase Console.
        url: 'https://localhost:4050/',
        // This must be true.
        handleCodeInApp: true,
      };

      // Send the sign-in link to the user
      await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);

      // TODO: get the auth token here and send it in the result. Look in `auth.js` file
      // This part goes in Front-end which handles sign-in via email link
      // and then gets user from database.
      // window.localStorage.setItem('emailForSignIn', email);
      
      return rep.response({message: "Email link sent."}).code(200);
    }
    catch(err)  {
      this.logger.error(err.message);
    }
  }
}

module.exports = Handlers;
