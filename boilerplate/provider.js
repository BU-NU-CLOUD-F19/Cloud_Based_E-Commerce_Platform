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
    const vars = this._filter();
    const conf = this._makeJson(vars);
    callback(undefined, conf);
  }

  _filter() {
    const result = {};
    const keys = Object.keys(process.env);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].toLowerCase();
      if (key.indexOf(this._appName) === 0)
        result[key.substring(this._appName.length)] = process.env[keys[i]];
    }
    return result;
  }

  _makeJson(vars) {
    const result = {};
    const keys = Object.keys(vars);
    for (let i = 0; i < keys.length; i++) {
      const value = vars[keys[i]];
      let key = keys[i];
      let last = result;
      while (key.indexOf('_') >= 0) {
        if (key.indexOf('_') === 0) {
          key = key.substring(1);
        } else {
          const name = key.substring(0, key.indexOf('_'));
          key = key.substring(key.indexOf('_'));
          if (last[name] === undefined) {
            last[name] = {};
          }
          last = last[name];
        }
      }
      last[key] = value;
    }

    return result;
  }
}

module.exports = EnvProvider;
