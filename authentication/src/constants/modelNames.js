/**
 * This class defines global constants for model-names.
 * So that any change in file name will require only changing them here
 * key:value, where value is the actual model name
 */

const names = {
  /*
    Models
  */

  memberships: 'memberships',
  securityGroups: 'security_groups',
  stores: 'stores',
  users: 'users',
  userSecurityGroups: 'user_security_groups',
  
  /*
     Repository
  */

  knexManager: 'knex-manager',
};

module.exports = names;
