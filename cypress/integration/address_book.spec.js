import 'cypress-file-upload'
const path = require('path')
import { format } from 'date-fns'

const NAME = 'Owner1'
const EDITED_NAME = 'Edited Owner1'
const ADDRESS = '0x20cc148211CcddB9904e64895B59a6B313CC9fC3'
const ENS_NAME = ''
const RINKEBY_TEST_SAFE = 'cro:0x5ED44E414AE18AF0793cb842Bb8f1C1b6295777B'
const GNO_TEST_SAFE = 'tcro:0xbB91e283d2ab0E110620b47A9139cAD202210A05'
const RINKEBY_CSV_ENTRY = {
  name: 'cronos user 1',
  address: '0x20cc148211CcddB9904e64895B59a6B313CC9fC3',
}
const GNO_CSV_ENTRY = {
  name: 'cronos-testnet user 1',
  address: '0x20cc148211CcddB9904e64895B59a6B313CC9fC3',
}

describe('Address book', () => {
  before(() => {
    cy.visit(`/${RINKEBY_TEST_SAFE}/address-book`)
    cy.contains('a', 'Accept selection').click()
    // Waits for the Address Book table to be in the page
    cy.get('[aria-labelledby="Address Book"]').should('be.visible')
  })

  describe('should add remove and edit entries in the address book', () => {
    it('should add an entry', () => {
      // Add a new entry manually
      cy.findByText('Create entry').click()
      cy.findByTestId('create-entry-input-name').type(NAME)
      cy.findByTestId('create-entry-input-address').type(ENS_NAME)
      cy.findByTestId('save-new-entry-btn-id').click()

      cy.findByText(NAME).should('exist')
      cy.findByText(ADDRESS).should('exist')

      // Close the notification
      cy.get('[aria-describedby="notistack-snackbar"]').find('button').click()
    })

    it('should edit an entry', () => {
      // Click the edit button in the first entry
      cy.get('[data-testid=address-book-row]')
        .first()
        .get('[title="Edit entry"]')
        // <div> is not visible because its parent has CSS property: visibility: hidden
        // so we have to use {force: true}
        .click({ force: true })

      cy.findByTestId('create-entry-input-name').clear().type(EDITED_NAME)
      cy.findByTestId('save-new-entry-btn-id').click()
      cy.findByText(NAME).should('not.exist')
      cy.findByText(EDITED_NAME).should('exist')

      // Close the notification
      cy.get('[aria-describedby="notistack-snackbar"]').find('button').click()
    })

    it('should delete an entry', () => {
      // Click the delete button in the first entry
      cy.get('[data-testid=address-book-row]').first().get('[title="Delete entry"]').click({ force: true })
      cy.findByText('Delete').should('exist').click()
      cy.findByText(EDITED_NAME).should('not.exist')

      // Snackbars are overlapping each other due to the test speed
      cy.get('[aria-describedby="notistack-snackbar"]').should('have.length', 1)
      // Close the notification
      cy.get('[aria-describedby="notistack-snackbar"]').find('[type="button"]').click()
    })
  })

  describe('should import and export address book files', () => {
    it('should import an address book csv file', () => {
      // Import CSV
      cy.get('[data-track="address-book: Import"]').click()
      cy.get('[type="file"]').attachFile('../fixtures/address_book_test.csv')
      cy.get('.modal-footer').findByText('Import').click()
      cy.findByText(RINKEBY_CSV_ENTRY.name).should('exist')
      cy.findByText(RINKEBY_CSV_ENTRY.address).should('exist')

      // Close the notification
      cy.get('[aria-describedby="notistack-snackbar"]').find('[type="button"]').click()
    })

    it('should find Gnosis Chain imported address', () => {
      // Go to a Safe on Gnosis Chain
      cy.get('nav').findByText('Cronos').click()
      cy.findByText('Gnosis Chain').click()

      // Navigate to the Address Book page
      cy.visit(`/${GNO_TEST_SAFE}/address-book`)

      // Close cookies banner
      cy.contains('a', 'Accept selection').click()
      // Waits for the Address Book table to be in the page
      cy.get('[aria-labelledby="Address Book"]').should('be.visible')

      // Finds the imported Gnosis Chain address
      cy.findByText(GNO_CSV_ENTRY.name).should('exist')
      cy.findByText(GNO_CSV_ENTRY.address).should('exist')
    })

    it('should download correctly the address book file', () => {
      // Download the export file
      const date = format(new Date(), 'yyyy-MM-dd')
      const fileName = `gnosis-safe-address-book-${date}.csv`

      cy.get('[data-track="address-book: Export"]').click()
      cy.findByText('Download').click()
      const downloadsFolder = Cypress.config('downloadsFolder')
      cy.readFile(path.join(downloadsFolder, fileName)).should('exist')

      // Close the notification
      cy.get('[aria-describedby="notistack-snackbar"]').find('[type="button"]').click()
    })
  })
})
