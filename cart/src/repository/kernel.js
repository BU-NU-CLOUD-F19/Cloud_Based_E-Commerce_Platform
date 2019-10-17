/**
 * Creates a shared instance of Container that can be used anywhere in the application.
 */

'use strict';

// Jerkface: a dependency injection tool (https://www.npmjs.com/package/jerkface)
const Container = require('jerkface').Container;

if (Container.shared === null) {Container.shared = new Container();}

module.exports = Container.shared;
