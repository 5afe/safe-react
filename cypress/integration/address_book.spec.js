import 'cypress-file-upload'
const path = require('path')

const NAME = 'Owner1'
const EDITED_NAME = 'Edited Owner1'
const ADDRESS = '0x61a0c717d18232711bC788F19C9Cd56a43cc8872'
const ENS_NAME = 'francotest.eth'
const RINKEBY_TEST_SAFE = 'rin:0xFfDC1BcdeC18b1196e7FA04246295DE3A17972Ac'
const GNO_TEST_SAFE = 'gno:0xB8d760a90a5ed54D3c2b3EFC231277e99188642A'
const RINKEBY_CSV_ENTRY = {
  name: 'rinkeby user 1',
  address: '0x730F87dA2A3C6721e2196DFB990759e9bdfc5083',
}
const GNO_CSV_ENTRY = {
  name: 'gno user 1',
  address: '0x61a0c717d18232711bC788F19C9Cd56a43cc8872',
}

describe('Address book', () => {
  it('should add and remove Address Book entries', () => {
    cy.visit(`/${RINKEBY_TEST_SAFE}/address-book`)

    // Add a new entry manually
    cy.findByText('Create entry', { timeout: 6000 }).click()
    cy.findByTestId('create-entry-input-name').type(NAME)
    cy.findByTestId('create-entry-input-address').type(ENS_NAME)
    cy.findByTestId('save-new-entry-btn-id').click()

    cy.findByText(NAME).should('exist')
    cy.findByText(ADDRESS).should('exist')

    // Edit the entry
    cy.get('[title="Edit entry"]').click({ force: true }) //This is because the button is hidden
    cy.findByTestId('create-entry-input-name').clear().type(EDITED_NAME)
    cy.findByTestId('save-new-entry-btn-id').click()
    cy.findByText(NAME).should('not.exist')
    cy.findByText(EDITED_NAME).should('exist')

    // Delete the entry
    cy.get('[title="Delete entry"]').click({ force: true }) //This is because the button is hidden
    cy.findByText('Delete').should('exist').click()
    cy.findByText(EDITED_NAME).should('not.exist')
    cy.get('.MuiSnackbarContent-action').click({ multiple: true }) // close the snackbar

    // Import CSV
    cy.get('[data-track="address-book: Import"]').click()
    cy.get('[type="file"]').attachFile('../fixtures/address_book_test.csv')
    cy.get('.modal-footer').findByText('Import').click()
    cy.findByText(RINKEBY_CSV_ENTRY.name).should('exist')
    cy.findByText(RINKEBY_CSV_ENTRY.address).should('exist')

    // Go to a Safe on Gnosis Chain
    cy.get('nav').findByText('Rinkeby').click()
    cy.findByText('Gnosis Chain').click()
    cy.visit(`/${GNO_TEST_SAFE}/address-book`)
    cy.findByText(GNO_CSV_ENTRY.name).should('exist')
    cy.findByText(GNO_CSV_ENTRY.address).should('exist')

    // Download the export file
    const date = new Date()
    const day = `00${date.getUTCDate()}`.slice(-2)
    const month = `00${date.getUTCMonth() + 1}`.slice(-2)
    const year = date.getUTCFullYear()
    const fileName = `gnosis-safe-address-book-${year}-${month}-${day}.csv`

    cy.get('[data-track="address-book: Export"]').click()
    cy.findByText('Download').click()
    const downloadsFolder = Cypress.config('downloadsFolder')
    cy.readFile(path.join(downloadsFolder, fileName)).should('exist')
  })
})
