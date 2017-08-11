module.exports = {
    "env": {
        "browser": true,
        "jquery": true,
        "es6": true,
        "jasmine": true
    },
    "globals": {
      "backend": true,
      "view": true,
      "Session": true,
      "module": true,
      "Scoreboard": true,
      "sorttable": true,
      "Exercises": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-var": "error",
        "no-console": 0,

    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
    },
};
