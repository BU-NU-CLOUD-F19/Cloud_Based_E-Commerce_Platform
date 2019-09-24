module.exports = {
  "extends": "eslint:recommended",
  "plugins": [],
  "parserOptions": {
    "ecmaVersion": 2020
  },
  "env": {
    "es6": true,
    "node": true,
    "browser": true
  },
  "rules": {
    "arrow-body-style": "error",
    "class-methods-use-this": "error",
    "consistent-return": "off",
    "curly": "error",
    "func-names": "error",
    "func-style": ["error", "declaration", {"allowArrowFunctions": true}],
    "max-len": ["error", 120],
    "no-await-in-loop": "off",
    "no-case-declarations": "error",
    "no-continue": "error",
    "no-param-reassign": "off",
    "no-plusplus": "off",
    "no-proto": "error",
    "no-return-await": "error",
    "no-underscore-dangle": "error",
    "no-unused-vars": ["error", { "args": "none" }],
    "no-shadow": "error",
    "strict": "off",
    "valid-typeof": "error",
    "linebreak-style": ["error", "unix"],
  }
};