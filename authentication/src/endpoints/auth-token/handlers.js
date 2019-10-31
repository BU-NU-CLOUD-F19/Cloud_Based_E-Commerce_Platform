/**
 * These are the handlers for the endpoints for the memberships.
 * It's the code that actually contains the logic for each endpoint.
 */

'use strict';

const logger = require('../../utils/logger');
const { Users } = require('../../models/');
const firebase = require('firebase');

/**
 * The handler functions for all endpoints defined for the memberships
 */
class Handlers {
  constructor() {
    this.users = new Users();
    this.logger = logger;
  }

  /**
   * Check if properties are present in an object, returns an object with a boolean value.
   * When a property is missing, it also returns the missing property.
   * @static
   * @param {array} proplist - an array of properties that you want to check
   * @param {object} obj - the object to check
   */
  static propsPresent(proplist, obj) {
    for (let prop of proplist) {
      if (!(prop in obj)) {
        return {valid: false, missing: prop};
      }
    }
    return {valid: true};
  }
  
  /**
   * Get a membership
   * @async
   * @param {Hapi.request} req - the request object
   * @param {object} rep - the response toolkit (Hapi.h)
   */
  async generateToken(req, rep) {
    const { params: { email }} = req;
    this.logger.logRequest(req);

    try {
      this.logger.debug(`\tHandler: Generating token`);
      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be whitelisted in the Firebase Console.
        url: 'https://localhost:4050/',
        // This must be true.
        handleCodeInApp: true,
        iOS: {
          bundleId: 'com.example.ios'
        },
        android: {
          packageName: 'com.example.android',
          installApp: true,
          minimumVersion: '12'
        },
        dynamicLinkDomain: 'example.page.link'
      };

      // Get the products in the cart and return them
      const result = await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
      
      window.localStorage.setItem('emailForSignIn', email);
      
      return rep.response({message: "Membership retrieved.", data: result}).code(200);
    }
    catch(err)  {
      this.logger.error(err.message);
    }
  }
}

module.exports = Handlers;
