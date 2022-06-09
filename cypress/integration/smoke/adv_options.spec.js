import createTypography from '@material-ui/core/styles/createTypography'
import 'cypress-iframe'

const newOwner = '0x49d4450977E2c95362C13D3a31a09311E0Ea26A6'

describe('Advanced Options', () => {
  it('Advanced options and gas estimation/price', () => {
    cy.connnectE2EWallet({ connected: true })
    cy.visit('/rin:0xc9C0F131a2bB0CFd268eB9F28a09fce20e4BFc55/settings/owners')
    cy.findByText('Accept selection').click()
    cy.wait(2000) //Wait for the button to show up
    cy.findByTestId('add-owner-btn').click()
    cy.findByTestId('add-owner-name-input').type("New Owner Name")
    cy.findByTestId('add-owner-address-testid').type(newOwner)
    cy.findByTestId('add-owner-next-btn').click()
    cy.findByTestId('add-owner-threshold-next-btn').click()
    cy.findByText('Estimated fee price').click()
    cy.get('[data-track="modals: Edit estimation"]').findByText('Edit').click()

    cy.wait(4000) //Wait till the values fully load
    cy.get('[name="ethGasLimit"]').clear().type('-100')
    cy.findByText('Must be greater than or equal to 0')
    cy.get('[name="ethGasLimit"]').clear().type('200000')
    cy.get('[name="ethGasPrice"]').clear().type('-100')
    cy.findByText('Must be greater than or equal to 0')
    cy.get('[name="ethGasPrice"]').clear().type('5')
    cy.get('[name="ethMaxPrioFee"]').clear().type('-100')
    cy.findByText('Must be greater than or equal to 0')
    cy.get('[name="ethMaxPrioFee"]').clear().type('7')
    cy.findByText('Maximum value is 5') //It cannot be higher than gasPrice
    cy.get('[name="ethMaxPrioFee"]').clear().type('5')
    cy.get('[name="safeNonce"]').clear().type('9999')
    cy.wait(2000)
    cy.findByTestId('submit-tx-btn').click()
    cy.findByText('transactions will need to be created and executed before this transaction, are you sure you want to do this?')
    cy.findByText('0.002 ETH') //the result of 200k gaslimit, 5 gasPrice and Fee
  })
})
