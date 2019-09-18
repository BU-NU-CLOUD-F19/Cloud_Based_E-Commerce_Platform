'use strict';

const Container = require('jerkface').Container;

if (Container.shared === null) Container.shared = new Container();

module.exports = Container.shared;
