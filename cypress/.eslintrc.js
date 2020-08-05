module.exports = {
    plugins: ['cypress'],
    env: {
        "cypress/globals": true
    },
    rules: {
        "no-unused-expressions": 0,
        "no-restricted-syntax": 0
    },
    globals: {
        given: true,
        when: true,
        then: true
    }
  }