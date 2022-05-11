import '@testing-library/cypress/add-commands'

Cypress.Commands.add('configWindow', ({ connected }) => {
  cy.on('window:before:load', (window) => {
    window.cypressConfig = {
      connected,
    }
  })
})
