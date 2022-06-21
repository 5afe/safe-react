const balanceRowTestId = '[data-testid=balance-row]'

const TEST_SAFE = 'rin:0x11Df0fa87b30080d59eba632570f620e37f2a8f7'
const ASSETS_LENGTH = 7
const DAI_ROW_NUMBER = 0
const TOKEN_AMOUNT_COLUMN = 1
const FIAT_AMOUNT_COLUMN = 2
const WETH_ROW_NUMBER = 1
const USDC_ROW_NUMBER = 3


describe('Assets > Coins', () => {
  // Fiat balance regex
  const fiatRegex = new RegExp(`([0-9]{1,3},)*[0-9]{1,3}.[0-9]{2}`)
  // Token balance regex
  const tokenRegex = new RegExp(`([0-9]{1,3},)*[0-9]{1,3}.[0-9]{2,5}`)

  before(() => {
    // Open the Safe used for testing
    cy.visit(`/${TEST_SAFE}/balances`)
    cy.contains('a', 'Accept selection').click()
  })

  describe('should have different tokens', () => {
    it(`should have ${ASSETS_LENGTH} entries in the table`, () => {
      cy.get(balanceRowTestId).should('have.length', ASSETS_LENGTH)
    })

    it('should have Dai', () => {
      // First row should be Dai
      cy.get(balanceRowTestId).eq(DAI_ROW_NUMBER).contains('Dai')

      // Row should have a image with alt text "Dai"
      cy.get(balanceRowTestId).eq(DAI_ROW_NUMBER).find('img[alt="Dai"]').should('be.visible')

      // Link to show details
      cy.get(balanceRowTestId).eq(DAI_ROW_NUMBER).find('a[aria-label="Show details on Etherscan"]').should('be.visible')

      // Balance should end with DAI
      cy.get(balanceRowTestId).eq(DAI_ROW_NUMBER).find('td').eq(TOKEN_AMOUNT_COLUMN).contains('DAI')
    })

    it('should have Wrapped Ether', () => {
      // Second row should be Wrapped Ether
      cy.get(balanceRowTestId).eq(WETH_ROW_NUMBER).contains('Wrapped Ether')

      // Row should have a image with alt text "Wrapped Eth"
      cy.get(balanceRowTestId).eq(WETH_ROW_NUMBER).find('img[alt="Wrapped Ether"]').should('be.visible')

      // Link to show details
      cy.get(balanceRowTestId)
        .eq(WETH_ROW_NUMBER)
        .find('a[aria-label="Show details on Etherscan"]')
        .should('be.visible')

      // Balance should end with WETH
      cy.get(balanceRowTestId).eq(WETH_ROW_NUMBER).find('td').eq(TOKEN_AMOUNT_COLUMN).contains('WETH')
    })

    it('should have USD Coin', () => {
      // Third row should be USD Coin
      cy.get(balanceRowTestId).eq(USDC_ROW_NUMBER).contains('USD Coin')

      // Row should have a image with alt text "USD Coin"
      cy.get(balanceRowTestId).eq(USDC_ROW_NUMBER).find('img[alt="USD Coin"]').should('be.visible')

      // Link to show details
      cy.get(balanceRowTestId)
        .eq(USDC_ROW_NUMBER)
        .find('a[aria-label="Show details on Etherscan"]')
        .should('be.visible')

      // Balance should end with USDC
      cy.get(balanceRowTestId).eq(USDC_ROW_NUMBER).find('td').eq(TOKEN_AMOUNT_COLUMN).contains('USDC')
    })
  })

  describe('values should be formatted as per locale', () => {
    it('should have Token and Fiat balances formated as per locales', () => {
      // Verify all assets
      Array.from(Array(ASSETS_LENGTH).keys()).forEach((row) => {
        // Token balance is formatted as per tokenRegex
        cy.get(balanceRowTestId)
          .eq(row)
          .find('td')
          .eq(TOKEN_AMOUNT_COLUMN)
          .should(($div) => {
            const text = $div.text()
            expect(text).to.match(tokenRegex)
          })

          // Fiat balance is formatted as per fiatRegex
          .get(balanceRowTestId)
          .eq(row)
          .find('td')
          .eq(FIAT_AMOUNT_COLUMN)
          .should(($div) => {
            const text = $div.text()
            expect(text).to.match(fiatRegex)
          })
      })
    })
  })

  describe('fiat currency can be changed', () => {
    it('should have USD Coin as default currency', () => {
      // First row Fiat balance should not contain EUR
      cy.get(balanceRowTestId).first().find('td').eq(FIAT_AMOUNT_COLUMN).should('not.contain', 'EUR')
      // First row Fiat balance should contain USD
      cy.get(balanceRowTestId).first().find('td').eq(FIAT_AMOUNT_COLUMN).contains('USD')
    })

    it('should allow changing the currency to EUR', () => {
      // Click on balances currency dropdown
      cy.get('[data-testid=balances-currency-dropdown-btn]').click()

      // Select EUR
      cy.get('ul[role=menu]').findByText('EUR').click()

      // First row Fiat balance should not contain USD
      cy.get(balanceRowTestId).first().find('td').eq(FIAT_AMOUNT_COLUMN).should('not.contain', 'USD')
      // First row Fiat balance should contain EUR
      cy.get(balanceRowTestId).first().find('td').eq(FIAT_AMOUNT_COLUMN).contains('EUR')
    })
  })

  describe('pagination should work', () => {
    it('should should allow 5 rows per page and navigate to next and previous page', () => {
      // Click on the pagination select dropdown
      cy.get('[aria-haspopup="listbox"]').contains('100').click()

      // Select 5 rows per page
      cy.get('[aria-haspopup="listbox"]').get('li[role="option"]').contains('5').click()

      // Table should have 5 rows
      cy.contains('1-5 of 7')
      cy.get(balanceRowTestId).should('have.length', 5)

      // Click on the next page button
      cy.get('button[aria-label="Next Page"]').click()

      // Table should have 2 rows
      cy.contains('6-7 of 7')
      cy.get(balanceRowTestId).should('have.length', 2)

      // Click on the previous page button
      cy.get('button[aria-label="Previous Page"]').click()

      // Table should have 5 rows
      cy.contains('1-5 of 7')
      cy.get(balanceRowTestId).should('have.length', 5)
    })
  })

  describe('should open assets modals', () => {
    const receiveAssetsModalTestId = '[data-testid=receive-assets-modal]'

    it('should open the Receive assets modal', () => {
      // Assets table container should exist
      cy.get('[aria-labelledby="Balances"]').should('be.visible')

      // Receive text should not exist yet
      cy.get(balanceRowTestId).first().findByText('Receive').should('not.be.visible')

      // On hover, the Receive button should be visible
      cy.get(balanceRowTestId).first().trigger('mouseover').findByText('Receive').should('exist')

      // Click on the Receive button
      cy.get(balanceRowTestId).first().findByText('Receive').click({ force: true })

      // The Receive Assets modal should be present
      cy.get(receiveAssetsModalTestId).should('be.visible')

      // Receive assets should be present
      cy.get(receiveAssetsModalTestId).findByText('Receive assets').should('be.visible')

      // The Receive screen should have the correct address
      const [, safeAddress] = TEST_SAFE.split(':')
      cy.get(receiveAssetsModalTestId).findByText(safeAddress).should('be.visible')

      // Click in the Done button
      cy.get(receiveAssetsModalTestId).findByText('Done').click({ force: true })

      // The Receive screen should be hidden
      cy.get(receiveAssetsModalTestId).should('not.exist')
    })
  })
})
