const assetsTableContainer = '.MuiTableContainer-root'
const balanceRowTestId = '[data-testid=balance-row]'
const receiveModalClass = '.receive-modal'

const TEST_SAFE = '/eth:0x8675B754342754A30A2AeF474D114d8460bca19b'
const ASSETS_LENGTH = 26

describe('Assets > Coins', () => {
  // Fiat balance regex
  const fiatRegex = new RegExp(`([0-9]{1,3},)*[0-9]{1,3}.[0-9]{2}`)
  // Token balance regex
  const tokenRegex = new RegExp(`([0-9]{1,3},)*[0-9]{1,3}.[0-9]{5}`)

  before(() => {
    // Open the Safe used for testing
    cy.visit(`${TEST_SAFE}/balances`)
    cy.contains('a', 'Accept selection').click()
  })

  describe('should have different tokens', () => {
    it('should have 26 entries in the table', () => {
      cy.get(balanceRowTestId).should('have.length', ASSETS_LENGTH)
    })

    it('should have Wrapped Ether', () => {
      cy.get(balanceRowTestId).contains('Wrapped Ether')
    })
    it('should have Dai Stablecoin', () => {
      cy.get(balanceRowTestId).contains('Dai Stablecoin')
    })

    it('should have MakerDAO', () => {
      cy.get(balanceRowTestId).contains('MakerDAO')
    })
  })

  describe('values should be formatted as per locale', () => {
    const TOKEN_AMOUNT_COLUMN = 1
    const FIAT_AMOUNT_COLUMN = 2

    it('should have Token balance formated as per tokenRegex', () => {
      // Balance should comply with the tokenRegex
      cy.get(assetsTableContainer)
        .find(balanceRowTestId)
        .eq(1)
        .find('td')
        .eq(TOKEN_AMOUNT_COLUMN)
        .should(($div) => {
          const text = $div.text()
          expect(text).to.match(tokenRegex)
        })
    })
    it('should have Fiat balance formated as per fiatRegex', () => {
      // Balance should comply with the fiatRegex
      cy.get(assetsTableContainer)
        .find(balanceRowTestId)
        .eq(1)
        .find('td')
        .eq(FIAT_AMOUNT_COLUMN)
        .should(($div) => {
          const text = $div.text()
          expect(text).to.match(fiatRegex)
        })
    })
  })

  describe('should open assets modals', () => {
    it('should open the Receive assets modal', () => {
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
