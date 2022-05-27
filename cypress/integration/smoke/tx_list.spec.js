const STATIC_TEST_SAFE = 'rin:0x1230B3d59858296A31053C1b8562Ecf89A2f888b'

describe('Transaction List', () => {
  it('should display the transaction list', () => {
    cy.visit(`/${STATIC_TEST_SAFE}/transactions/history`)

    // Accept cookies
    cy.findByText('Accept selection').click()

    // Opening/closing of accordion
    cy.findByText('changeThreshold').click().click()
    cy.get('.tx-data').should('not.exist')

    const TX_975_TITLE = 'Gnosis Safe: MultiSendCallOnly'

    // Infinite scroll
    cy.findByText(TX_975_TITLE).should('not.exist')
    cy.get('#infinite-scroll-container').scrollTo('bottom')
    cy.wait(3000)
    cy.findByText(TX_975_TITLE).should('exist')

    // Accordion
    cy.findByText(TX_975_TITLE).click()

    // Operation
    cy.get('.tx-operation').should('exist')
    cy.get('.tx-operation').findByText('Delegate Call').should('exist')

    // Summary details
    cy.get('.tx-summary').should('exist')
    ;['Transaction hash:', '0xd650dfdf...8ce11bbf'].forEach((val) => {
      cy.get('.tx-summary').findByText(val).should('exist')
    })
    ;['SafeTxHash:', '0x7b3adc0a...42b4ff3d'].forEach((val) => {
      cy.get('.tx-summary').findByText(val).should('exist')
    })
    ;['Created:', 'Apr 8, 2022 - 9:45:47 AM'].forEach((val) => {
      cy.get('.tx-summary').findByText(val).should('exist')
    })
    ;['Executed:', 'Apr 8, 2022 - 9:46:37 AM'].forEach((val) => {
      cy.get('.tx-summary').findByText(val).should('exist')
    })

    // Advanced details
    cy.get('.tx-summary').findByText('Advanced Details').click()
    ;['Operation:', '1 (delegate)'].forEach((val) => {
      cy.get('.tx-summary').findByText(val).should('exist')
    })
    ;['safeTxGas:', 'baseGas:', 'gasPrice:'].forEach((val) => {
      cy.get('.tx-summary').findByText(val).should('exist')
      cy.get('.tx-summary').findByText(val).siblings().findByText('0').should('exist')
    })
    ;['gasToken:', 'refundReceiver:'].forEach((val) => {
      cy.get('.tx-summary').findByText(val).should('exist')
      cy.get('.tx-summary').findByText(val).siblings().findByText('0x00000000...00000000').should('exist')
    })
    ;['Signature 1:', 'Signature 2:', 'Signature 3:'].forEach((val) => {
      cy.get('.tx-summary').findByText(val).should('exist')
      cy.get('.tx-summary').findByText(val).siblings().findByText('65 bytes').should('exist')
    })
    ;['Raw data:', '452 bytes'].forEach((val) => {
      cy.get('.tx-summary').findByText(val).should('exist')
    })

    // Transaction details
    cy.get('.tx-details').should('exist')
    cy.get('.tx-details').children().should('have.length', 2)

    // Action 1
    cy.get('.tx-details').findByText('Action 1').click()
    cy.findByText('Interact with:').should('exist')
    cy.findByText('0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134').should('exist')
    cy.findByText('add Delegate').should('exist')
    ;['delegate(address):', '0x448E4E6D...4bFbFb32'].forEach((val) => {
      cy.get('.tx-details > .MuiPaper-root.Mui-expanded').findByText(val).should('exist')
    })
    cy.get('.tx-details').findByText('Action 1').click()

    // Action 2
    cy.get('.tx-details').findByText('Action 2').click()
    cy.findByText('set Allowance').should('exist')
    ;['delegate(address):', '0x448E4E6D...4bFbFb32'].forEach((val) => {
      cy.get('.tx-details > .MuiPaper-root.Mui-expanded').findByText(val).should('exist')
    })
    ;['token(address):', '0x00000000...00000000'].forEach((val) => {
      cy.get('.tx-details').findByText(val).should('exist')
    })
    ;['allowanceAmount(uint96):', '100000000000000000'].forEach((val) => {
      cy.get('.tx-details').findByText(val).should('exist')
    })
    ;['resetTimeMin(uint16):', '30'].forEach((val) => {
      cy.get('.tx-details').findByText(val).should('exist')
    })
    ;['resetBaseMin(uint32):', '27490035'].forEach((val) => {
      cy.get('.tx-details').findByText(val).should('exist')
    })
    cy.get('.tx-details').findByText('Action 2').click()

    // Confirmations
    cy.get('.tx-owners').should('exist')

    const executor = '0x8bc9...8164'
    const approvers = ['0xF2Ce...a6bd', '0x65F8...C7B0']

    ;['Created', 'Confirmations', '(3 of 3)', 'Show all', 'Executed'].forEach((val) => {
      cy.get('.tx-owners').findByText(val).should('exist')
    })
    cy.get('.tx-owners').findByText('Hide all').should('not.exist')

    approvers.forEach((val) => {
      cy.get('.tx-owners').findByText(val).should('not.exist')
    })
    cy.get('.tx-owners').findByText(executor).should('exist')

    // Expand approvers
    cy.get('.tx-owners').findByText('Show all').click()
    cy.get('.tx-owners').findByText('Show all').should('not.exist')
    cy.get('.tx-owners').findByText('Hide all').should('exist')

    approvers.forEach((val) => {
      cy.get('.tx-owners').findByText(val).should('exist')
    })

    // Hide approvers
    cy.get('.tx-owners').findByText('Hide all').click()
    cy.get('.tx-owners').findByText('Hide all').should('not.exist')
    cy.get('.tx-owners').findByText('Show all').should('exist')

    approvers.forEach((val) => {
      cy.get('.tx-owners').findByText(val).should('not.exist')
    })
  })
})
