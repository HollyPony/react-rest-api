module.exports = {
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
  ],
  rules: {
    'react/prop-types': 'off'
  }
}
