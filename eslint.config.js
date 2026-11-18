import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*', '*.html', 'src/**/*', 'public/**/*', 'vite.config.ts']
  },
  firebaseRulesPlugin.configs['flat/recommended']
];
