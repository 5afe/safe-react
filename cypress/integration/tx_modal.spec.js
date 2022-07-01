const TEST_SAFE = 'rin:0x11Df0fa87b30080d59eba632570f620e37f2a8f7'

describe('Tx Modal', () => {
  before(() => {
    cy.connectE2EWallet()

    // Open the Safe used for testing
    cy.visit(`/${TEST_SAFE}`)
    cy.contains('a', 'Accept selection').click()
  })

  it('should open the modal when clicking New Transaction', () => {
    cy.get('[aria-describedby="Send Tokens Form"]').should('not.exist')
    cy.contains('button', 'New Transaction').click()
    cy.get('[aria-describedby="Send Tokens Form"]').should('be.visible')
  })
})
