const { createArrayTypeNode } = require('typescript')

describe('App layout', () => {
  it('Check footer presence', () => {
    cy.visit('/')
    cy.get('footer').should('exist')

    cy.visit('/rin:0xFfDC1BcdeC18b1196e7FA04246295DE3A17972Ac/settings/details')
    cy.get('footer').should('exist')

    cy.visit('/rin:0xFfDC1BcdeC18b1196e7FA04246295DE3A17972Ac/transactions/history')
    cy.get('footer').should('not.exist')

    cy.visit('/rin:0xFfDC1BcdeC18b1196e7FA04246295DE3A17972Ac/balances')
    cy.get('footer').should('not.exist')

    cy.visit('/rin:0xFfDC1BcdeC18b1196e7FA04246295DE3A17972Ac/apps')
    cy.get('footer').should('not.exist')
  })
})
