module.exports = {
  testPathIgnorePatterns: ['/lib/'],
  testEnvironment: 'node',
  projects: [
    { rootDir: 'packages/core' },
    { rootDir: 'packages/graphql' },
    { rootDir: 'packages/knex' },
    { rootDir: 'packages/validation' },
    { rootDir: 'packages/formik',
      testEnvironment: 'jsdom',
      testMatch: [
        '**/?(*.)+(spec|test).[jt]s?(x)'
      ]
    }
  ]
}
