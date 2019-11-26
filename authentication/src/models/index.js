 /**
 * This class exports all the models defined in the models folder
 */

'use strict';

// cart
const Memberships = require('./memberships/').Model;
const Stores = require('./stores/').Model;
const Users = require('./users/').Model;
const SecurityGroups = require('./security-groups/').Model;
const UserSecurityGroups = require('./user-security-groups/').Model;

module.exports = {
  Memberships,
  Stores,
  SecurityGroups,
  Users,
  UserSecurityGroups
};
