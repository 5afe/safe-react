const assetsTableContainer = '.MuiTableContainer-root'
const balanceRowTestId = '[data-testid=balance-row]'
const receiveModalClass = '.receive-modal'

const SAFE_TEST = '0x8675B754342754A30A2AeF474D114d8460bca19b'
const ASSETS_LENGTH = 26

describe('Assets > Coins', () => {
  const number = 123456.789
  const localeNumber = number.toLocaleString()
  // Find localeNumber thousand separator and decimal separator
  const [thousandSeparator, decimalSeparator] = localeNumber.match(/[^0-9]/g)

  // Fiat balance regex
  const fiatRegex = new RegExp(`([0-9]{1,3}${thousandSeparator})*[0-9]{1,3}${decimalSeparator}[0-9]{2}`)
  // Token balance regex
  const tokenRegex = new RegExp(`([0-9]{1,3}${thousandSeparator})*[0-9]{1,3}${decimalSeparator}[0-9]{5}`)

  beforeEach(() => {
    // Open the Safe used for testing
    cy.visit(`/eth:${SAFE_TEST}/balances`)
  })

  describe('Should have all table entries', () => {
    it('Should have 26 entries in the table', () => {
      cy.get(balanceRowTestId).should('have.length', ASSETS_LENGTH)
    })

    it('Should have Wrapped Ether', () => {
      cy.get(balanceRowTestId).contains('Wrapped Ether')
    })
    it('Should have Dai Stablecoin', () => {
      cy.get(balanceRowTestId).contains('Dai Stablecoin')
    })

    it('Should have MakerDAO', () => {
      cy.get(balanceRowTestId).contains('MakerDAO')
    })
  })

  describe('Values should be well formatted', () => {
    it('Token balance should be formated as per tokenRegex', () => {
      // Balance should comply with the tokenRegex
      cy.get(assetsTableContainer)
        .find(balanceRowTestId)
        .eq(1)
        .find('td')
        .eq(1)
        .should(($div) => {
          const text = $div.text()
          expect(text).to.match(tokenRegex)
        })
    })
    it('Fiat balance should be formated as per fiatRegex', () => {
      // Balance should comply with the fiatRegex
      cy.get(assetsTableContainer)
        .find(balanceRowTestId)
        .eq(1)
        .find('td')
        .eq(2)
        .should(($div) => {
          const text = $div.text()
          expect(text).to.match(fiatRegex)
        })
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
