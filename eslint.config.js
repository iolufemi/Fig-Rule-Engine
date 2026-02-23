'use strict';

import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                describe: 'readonly',
                it: 'readonly',
                before: 'readonly',
                after: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': plugin
        },
        rules: {
            indent: ['error', 4],
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single'],
            semi: ['error', 'always']
        }
    },
    {
        ignores: ['node_modules/', 'dist/', 'coverage/']
    }
];
