describe('Create Safe', () => {
  it('should create a new safe', () => {
    cy.visit('/')
    cy.contains('a', 'Accept all').click({ force: true })
    // cy.get("p").contains("Ethereum").click({ force: true });
    cy.get('p').contains('Rinkeby').click({ force: true })
    cy.get('[data-testid=connected-wallet]').should('contain', 'e2e-wallet')
    cy.contains('Create new Safe').click({ force: true })
    cy.contains('Continue').click()
    cy.get('[data-testid=create-safe-name-field]').type('Test Safe')
    cy.contains('button', 'Continue').click({ force: true })
    cy.contains('button', 'Continue').click({ force: true })
    cy.wait(500) // TODO: Not sure why without this ends with "Transaction underpriced"
    cy.contains('button', 'Create').click({ force: true })
    cy.contains('Your Safe was created successfully', { timeout: 60000 })
  })
})
