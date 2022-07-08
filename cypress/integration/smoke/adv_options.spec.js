const NEW_OWNER = '0x49d4450977E2c95362C13D3a31a09311E0Ea26A6'
const TEST_SAFE = 'rin:0x11Df0fa87b30080d59eba632570f620e37f2a8f7'
const offset = 7

describe('Advanced Options', () => {
  let currentNonce = ''
  before(() => {
    cy.connectE2EWallet()

    cy.visit(`/${TEST_SAFE}/settings/advanced`)
    cy.findByText('Accept selection').click()

    // Advanced Settings page is loaded
    cy.contains('Safe Nonce', { timeout: 5000 })
    // Get current nonce from Settings > Advanced
    cy.findByTestId('current-nonce').then((element) => {
      currentNonce = element.text()
    })
  })

  describe('Add new owner', () => {
    it('should add a new owner and change the threshold', () => {
      cy.get('nav[aria-labelledby="nested-list-subheader"]').contains('Owners').click()

      //"add owner" tx so funds are not needed in the safe.
      // Open the add new owner modal
      cy.contains('Add new owner').click()
      cy.contains('p', 'Add new owner').should('be.visible').next().contains('Step 1 of 3').should('be.visible')

      // Fills new owner data
      cy.get('input[placeholder="Owner name*"]').type('New Owner Name')
      cy.get('input[placeholder="Owner address*"]').type(NEW_OWNER)

      // Advances to step 2
      cy.contains('Next').click()
      cy.contains('p', 'Add new owner').should('be.visible').next().contains('Step 2 of 3').should('be.visible')

      // Select 3 owners
      cy.get('[aria-labelledby="mui-component-select-threshold"]').click().get('li').contains('3').click()

      // Input should have value 3
      cy.get('input[name="threshold"]').should('have.value', '3')
      cy.contains('out of 3 owner(s)').should('be.visible')

      // Review step
      cy.contains('Review').click()
      cy.contains('p', 'Add new owner').should('be.visible').next().contains('Step 3 of 3').should('be.visible')
    })
  })

  describe('Verifying current advanced options values', () => {
    it('Opens Edit estimation information', () => {
      cy.findByText('Estimated fee price').click()

      //Waiting for the current estimation.
      cy.wait(2000)
      //Checking that gas limit is not a 0, usually a sign that the estimation failed
      cy.findByText('Gas limit').next().should('not.to.be.empty').and('to.not.equal', '0')

      cy.get('[data-track="modals: Edit estimation"]').findByText('Edit').click()
      cy.wait(2000) //Wait till the values fully load
    })
  })
  describe('Checking error messages for wrongs values', () => {
    before(() => {
      //Adding offset to check the warning message later
      cy.get('[name="safeNonce"]')
        .clear()
        .type(`${currentNonce + offset}`)
    })
    //The following values are fixed to get a specific estimation value in ETH
    it('Should show error for gas limit', () => {
      cy.get('[name="ethGasLimit"]').clear().type('-100')
      cy.findByText('Must be greater than or equal to 0')
      cy.get('[name="ethGasLimit"]').clear().type('200000')
    })

    it('Should show error for gas price', () => {
      cy.get('[name="ethGasPrice"]').clear().type('-100')
      cy.findByText('Must be greater than or equal to 0')
      cy.get('[name="ethGasPrice"]').clear().type('5')
    })

    it('Should show error for gas fee and prio fee', () => {
      cy.get('[name="ethMaxPrioFee"]').clear().type('-100')
      cy.findByText('Must be greater than or equal to 0')
      cy.get('[name="ethMaxPrioFee"]').clear().type('7')
      cy.findByText('Maximum value is 5') //It cannot be higher than gasPrice
      cy.get('[name="ethMaxPrioFee"]').clear().type('5')
      cy.wait(1000)
      cy.findByTestId('submit-tx-btn').click()
    })
  })

  describe('Checking error messages for wrongs values', () => {
    it('Should show the edited values', () => {
      //Vefifying that in the dropdown all  the values are there
      cy.findByText('Estimated fee price').click()
      cy.wait(1000)
      cy.findByText('Gas limit').next().should('have.text', '200000')
      cy.findByText('Max fee per gas').next().should('have.text', '5')
      cy.findByText('Max priority fee').next().should('have.text', '5')
    })

    it('Should show the out of order nonce warning', () => {
      cy.findByText('Safe nonce')
        .next()
        .should('have.text', `${currentNonce + offset}`)

      //Verifying the warning message of setting a nonce hihgher than "current nonce"
      cy.findByText(
        'transactions will need to be created and executed before this transaction, are you sure you want to do this?',
      ).contains(`${offset}`)
    })
    it('Show the calculation of gaslimit + gas price', () => {
      cy.findByText('0.002 ETH') //the result of 200k gaslimit, 5 gasPrice and Fee
    })
  })
})
