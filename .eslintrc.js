module.exports = {
    env: { jest: true, node: true },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    ignorePatterns: ['.eslintrc.js', 'tasks/**/*.js'],
    parser: '@typescript-eslint/parser',
    parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
    plugins: ['@typescript-eslint/eslint-plugin'],
    root: true,
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
}
