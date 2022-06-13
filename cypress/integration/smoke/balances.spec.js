const assetsTableContainer = '.MuiTableContainer-root'
const balanceRowTestId = '[data-testid=balance-row]'
const receiveModalClass = '.receive-modal'

const TEST_SAFE = '/rin:0x11Df0fa87b30080d59eba632570f620e37f2a8f7'
const ASSETS_LENGTH = 4

describe('Assets > Coins', () => {
  const TOKEN_AMOUNT_COLUMN = 1
  const FIAT_AMOUNT_COLUMN = 2

  // Fiat balance regex
  const fiatRegex = new RegExp(`([0-9]{1,3},)*[0-9]{1,3}.[0-9]{2}`)
  // Token balance regex
  const tokenRegex = new RegExp(`([0-9]{1,3},)*[0-9]{1,3}.[0-9]{2,5}`)

  before(() => {
    // Open the Safe used for testing
    cy.visit(`${TEST_SAFE}/balances`)
    cy.contains('a', 'Accept selection').click()
  })

  describe('should have different tokens', () => {
    it(`should have ${ASSETS_LENGTH} entries in the table`, () => {
      cy.get(balanceRowTestId).should('have.length', ASSETS_LENGTH)
    })

    it('should have Dai', () => {
      const DAI_ROW_NUMBER = 0
      // First row should be Dai
      cy.get(balanceRowTestId).eq(DAI_ROW_NUMBER).contains('Dai')

      // First row should have a image with alt text "Dai"
      cy.get(balanceRowTestId).eq(DAI_ROW_NUMBER).get('img[alt="Dai"]').should('exist')

      // Link to show details
      cy.get(balanceRowTestId).eq(DAI_ROW_NUMBER).get('a[aria-label="Show details on Etherscan"]').should('exist')

      // Balance should end with DAI
      cy.get(balanceRowTestId).eq(DAI_ROW_NUMBER).find('td').eq(TOKEN_AMOUNT_COLUMN).contains('DAI')
    })
    it('should have Wrapped Ether', () => {
      const WETH_ROW_NUMBER = 1

      cy.get(balanceRowTestId).contains('Wrapped Ether')

      // First row should have a image with alt text "Wrapped Eth"
      cy.get(balanceRowTestId).eq(WETH_ROW_NUMBER).get('img[alt="Wrapped Ether"]').should('exist')

      // Link to show details
      cy.get(balanceRowTestId).eq(WETH_ROW_NUMBER).get('a[aria-label="Show details on Etherscan"]').should('exist')

      // Balance should end with WETH
      cy.get(balanceRowTestId).eq(WETH_ROW_NUMBER).find('td').eq(TOKEN_AMOUNT_COLUMN).contains('WETH')
    })

    it('should have USD Coin', () => {
      const USD_ROW_NUMBER = 2

      cy.get(balanceRowTestId).contains('USD Coin')

      // First row should have a image with alt text "USD Coin"
      cy.get(balanceRowTestId).eq(USD_ROW_NUMBER).get('img[alt="USD Coin"]').should('exist')

      // Link to show details
      cy.get(balanceRowTestId).eq(USD_ROW_NUMBER).get('a[aria-label="Show details on Etherscan"]').should('exist')

      // Balance should end with USDC
      cy.get(balanceRowTestId).eq(USD_ROW_NUMBER).find('td').eq(TOKEN_AMOUNT_COLUMN).contains('USDC')
    })
  })

  describe('values should be formatted as per locale', () => {
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
      cy.get(balanceRowTestId).first().contains('Dai')

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
      const [, safeAddress] = TEST_SAFE.split(':')
      cy.get(receiveModalClass).findByText(safeAddress).should('exist')

      // Click in the Done button
      cy.get(receiveModalClass).findByText('Done').click({ force: true })

      // The Receive screen should be hidden
      cy.get(receiveModalClass).should('not.exist')
    })
  })
})
