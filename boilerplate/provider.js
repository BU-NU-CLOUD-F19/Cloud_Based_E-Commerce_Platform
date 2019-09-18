'use strict';

class EnvProvider {
  constructor(appName) {
    if (appName === undefined)
      throw new TypeError('Arg "appName" must be defined.');

    if (typeof appName !== 'string')
      throw new TypeError('Arg "appName" must be a string.');

    this._appName = appName;
  }

  load(callback) {
    callback(undefined, conf);
  }
}

module.exports = EnvProvider;
