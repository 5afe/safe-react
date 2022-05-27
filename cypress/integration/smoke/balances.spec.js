const assetsTableContainer = '.MuiTableContainer-root'
const balanceRowTestId = '[data-testid=balance-row]'
const receiveModalClass = '.receive-modal'

describe('Assets balances', () => {
  it('Opening the Receive assets modal', () => {
    cy.visit('/eth:0x8675B754342754A30A2AeF474D114d8460bca19b/balances')

    // Assets table container should exist
    cy.get(assetsTableContainer).should('exist')

    // Balance row should exist
    cy.get(balanceRowTestId).first().should('exist')

    // First balance row shows Ether
    cy.get(balanceRowTestId).first().contains('Ether')

    // Receive text should not exist yet
    cy.get(balanceRowTestId).first().findByText('Receive').should('not.be.visible')

    // On hover, the Receive button should be visible
    cy.get(balanceRowTestId).first().trigger('mouseover').findByText('Receive').should('exist')

    // Click on the Receive button
    cy.get(balanceRowTestId).first().findByText('Receive').click({ force: true })

    // The Receive screen should be visible
    cy.get(receiveModalClass).should('exist')

    // Receive assets should be present
    cy.get(receiveModalClass).findByText('Receive assets').should('exist')

    // The Receive screen should have the correct address
    cy.get(receiveModalClass).findByText('0x8675B754342754A30A2AeF474D114d8460bca19b').should('exist')

    // Click in the Done button
    cy.get(receiveModalClass).findByText('Done').click({ force: true })

    // The Receive screen should be hidden
    cy.get(receiveModalClass).should('not.exist')
  })
})
