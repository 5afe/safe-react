const assetsTableContainer = '.MuiTableContainer-root'
const balanceRowTestId = '[data-testid=balance-row]'
const receiveModalClass = '.receive-modal'

const SAFE_TEST = '0x8675B754342754A30A2AeF474D114d8460bca19b'
const ASSETS_LENGTH = 26

describe('Assets > Coins', () => {
  beforeEach(() => {
    // Open the Safe used for testing
    cy.visit(`/eth:${SAFE_TEST}/balances`)
  })

  describe('Should have all table entries', () => {
    it('Should have 26 entries in the table', () => {
      cy.get(assetsTableContainer).find(balanceRowTestId).should('have.length', ASSETS_LENGTH)
    })

    it('Should have Wrapped Ether', () => {
      cy.get(assetsTableContainer).find(balanceRowTestId).contains('Wrapped Ether')
    })
    it('Should have Dai Stablecoin', () => {
      cy.get(assetsTableContainer).find(balanceRowTestId).contains('Dai Stablecoin')
    })

    it('Should have MakerDAO', () => {
      cy.get(assetsTableContainer).find(balanceRowTestId).contains('MakerDAO')
    })
  })

  describe('Should open assets modals', () => {
    it('Should open the Receive assets modal', () => {
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
})
