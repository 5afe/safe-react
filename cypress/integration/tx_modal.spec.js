const TEST_SAFE = 'rin:0x11Df0fa87b30080d59eba632570f620e37f2a8f7'

describe('Tx Modal', () => {
  before(() => {
    cy.connectE2EWallet()

    // Open the Safe used for testing
    cy.visit(`/${TEST_SAFE}`)
    cy.contains('a', 'Accept selection').click()
  })

  describe('Send funds modal', () => {
    it('should open the modal when clicking New Transaction', () => {
      // Modal should be blosed
      cy.get('[aria-describedby="Send Tokens Form"]').should('not.exist')

      // Opens Tx Modal
      cy.contains('New Transaction').click()
      cy.get('[aria-describedby="Send Tokens Form"]').should('be.visible')
      cy.get('.smaller-modal-window').contains('Send')
    })

    it('should close the modal by clicking outside of the modal', () => {
      // Modal is open
      cy.get('.smaller-modal-window').contains('Send')

      // Click outside of the .smaller-modal-window to close the modal
      cy.get('.smaller-modal-window').then(($target) => {
        let coords = $target[0].getBoundingClientRect()
        const { x, y } = coords
        cy.get('body').click(x - 10, y - 10)
      })

      // Modal is closed
      cy.get('[aria-describedby="Send Tokens Form"]').should('not.exist')
    })

    it('should display Send Funds modal with all the form elements', () => {
      // Opens Tx Modal
      cy.contains('New Transaction').click()

      // Click on Send Funds
      cy.contains('Send funds').click()

      // Send Funds modal is open
      cy.contains('Send funds').should('be.visible')
      cy.contains('Step 1 of 2').should('be.visible')

      // It contains the form elements
      cy.get('form').within(() => {
        // Sending from the current Safe address
        const [chainPrefix, safeAddress] = TEST_SAFE.split(':')
        cy.contains(chainPrefix)
        cy.contains(safeAddress)

        // Current ETH balance
        cy.contains('Balance:').contains('0.3 ETH')

        // Recipient field
        cy.get('#address-book-input').should('be.visible')

        // Token selector
        cy.contains('Select an asset*').should('be.visible')

        // Amount field
        cy.contains('Amount').should('be.visible')
      })

      // Review button is disabled
      cy.get('button[type="submit"]').should('be.disabled')

      // Close modal when clicking Cancel
      cy.contains('Cancel').click()

      // Modal is closed
      cy.get('[aria-describedby="Send Tokens Form"]').should('not.exist')
    })

    it('should validate the form fields', () => {
      // Opens Tx Modal
      cy.contains('New Transaction').click()

      // Click on Send Funds
      cy.contains('Send funds').click()

      // Click on the Token selector
      cy.contains('Select an asset*').click()

      const ownedTokens = ['Dai', 'Wrapped Ether', 'Ether', 'Uniswap', 'Gnosis', '0x', 'USD Coin']
      ownedTokens.forEach((token) => {
        cy.get('ul[role="listbox"]').contains(token)
      })

      // to continue
    })
  })
})
