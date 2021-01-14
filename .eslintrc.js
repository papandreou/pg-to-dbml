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
        }
    ]
};
  
  