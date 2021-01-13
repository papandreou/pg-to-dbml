module.exports = {
    extends: ['@polarislabs/eslint-config-polaris/node'],
    parser: 'babel-eslint',
    overrides: [
        {
            'files': ['*'],
            'rules': {
                'no-console': 'off'
            }
        },
        {
            'files': ['*'],
            'rules': {
                '@typescript-eslint/no-var-requires': 'off'
            }
        },
        {
            'files': ['*'],
            'rules': {
                'camelcase': 'off'
            }
        },
        {
            'files': ['src/utils/**'],
            'rules': {
                '@typescript-eslint/no-empty-function': 'off'
            }
        },
        {
            'files': ['src/main.js'],
            'rules': {
                'no-unused-expressions': 'off'
            }
        },
        {
            'files': ['src/utils/createFile.js'],
            'rules': {
                'no-bitwise': 'off'
            }
        },
    ]
};
  
  