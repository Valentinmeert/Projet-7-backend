module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: ['airbnb-base'],
  plugins: ['prettier'],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~', '.'],
          ['@', '.'],
        ],
      },
    },
  },
};
