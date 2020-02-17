module.exports = {
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    parserOptions: {
      project: './tsconfig.json',
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ['@ionic', 'react-hooks'],
    extends: ['plugin:@ionic/recommended'], // or use `plugin:@ionic/strict`
    rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    }
  };