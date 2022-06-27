import 'cypress-iframe'

const newOwner = '0x49d4450977E2c95362C13D3a31a09311E0Ea26A6'
const offset = 7

describe('Advanced Options', () => {
  it('Advanced options and gas estimation/price', () => {
    let currentNonce = ''
    cy.connectE2EWallet()
    cy.visit('/rin:0xE4d4Af30B90f158f02065534379eB4FFD9Cd106a/settings/advanced')
    cy.findByText('Accept selection').click()
    
    //Getting current safe nonce and store it to check it in the adv options
    cy.wait(1000)
    cy.findByTestId('current-nonce').then((element)=>{
      currentNonce = element.text()
    })
    cy.visit('/rin:0xE4d4Af30B90f158f02065534379eB4FFD9Cd106a/settings/owners')
    cy.wait(2000) //Wait for the button to show up

    //"add owner" tx so funds are not needed in the safe.
    cy.findByTestId('add-owner-btn').click()
    cy.findByTestId('add-owner-name-input').type("New Owner Name")
    cy.findByTestId('add-owner-address-testid').type(newOwner)
    cy.findByTestId('add-owner-next-btn').click()
    cy.findByTestId('add-owner-threshold-next-btn').click()
    cy.findByText('Estimated fee price').click()
    
    //Waiting for the current estimation. 
    cy.wait(2000)  
    //Checking that gas limit is not a 0, usually a sign that the estimation failed
    cy.findByText("Gas limit").next().should("not.to.be.empty").and("to.not.equal", "0")

    cy.get('[data-track="modals: Edit estimation"]').findByText('Edit').click()
    cy.wait(2000) //Wait till the values fully load

    //Adding offset to check the warning message later
    cy.get('[name="safeNonce"]').clear().type(`${currentNonce + offset}`)
    
    //The following values are fixed to get a specific estimation value in ETH
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

    cy.wait(1000)
    cy.findByTestId('submit-tx-btn').click()

    //Vefifying that in the dropdown all  the values are there
    cy.findByText('Estimated fee price').click()
    cy.wait(1000)
    cy.findByText("Gas limit").next().should("have.text", "200000")
    cy.findByText("Max fee per gas").next().should("have.text", "5")
    cy.findByText("Max priority fee").next().should("have.text", "5")
    cy.findByText("Safe nonce").next().should("have.text", `${currentNonce + offset}`)

    //Verifying the warning message of setting a nonce hihgher than "current nonce"
    cy.findByText('transactions will need to be created and executed before this transaction, are you sure you want to do this?')
    .contains(`${offset}`)
    cy.findByText('0.002 ETH') //the result of 200k gaslimit, 5 gasPrice and Fee
  })
})
