import 'cypress-iframe'

const newOwner = '0x49d4450977E2c95362C13D3a31a09311E0Ea26A6'
const testSafe = '/rin:0xE4d4Af30B90f158f02065534379eB4FFD9Cd106a'
const offset = 7

describe('Advanced Options', () => {
  let currentNonce = ''
  before(()=>{
    cy.connectE2EWallet()
    cy.visit(`${testSafe}/settings/advanced`)
    cy.findByText('Accept selection').click()
  })
  describe('Starting add owner tx, reaching review step', () => {
    it('Should get current nonce in settings', () => {
      //Getting current safe nonce and store it to check it in the adv options
      cy.wait(1000)
      cy.findByTestId('current-nonce').then((element)=>{
        currentNonce = element.text()
      })
    })

    it('Should reach to review step', () =>{
      cy.get('[aria-labelledby="nested-list-subheader"]').findByText('Owners').click()
      cy.wait(2000) //Wait for the button to show up

      //"add owner" tx so funds are not needed in the safe.
      cy.findByTestId('add-owner-btn').click()
      cy.findByTestId('add-owner-name-input').type("New Owner Name")
      cy.findByTestId('add-owner-address-testid').type(newOwner)
      cy.findByTestId('add-owner-next-btn').click()
      cy.findByTestId('add-owner-threshold-next-btn').click()
    })
  })

  describe('Verifying current advanced options values', ()=>{
    it('Opens Edit estimation information', ()=>{
      cy.findByText('Estimated fee price').click()
      
      //Waiting for the current estimation. 
      cy.wait(2000)  
      //Checking that gas limit is not a 0, usually a sign that the estimation failed
      cy.findByText("Gas limit").next().should("not.to.be.empty").and("to.not.equal", "0")

      cy.get('[data-track="modals: Edit estimation"]').findByText('Edit').click()
      cy.wait(2000) //Wait till the values fully load
    })
  })
  describe('Checking error messages for wrongs values', ()=>{
    before(()=>{
      //Adding offset to check the warning message later
      cy.get('[name="safeNonce"]').clear().type(`${currentNonce + offset}`)
    })
    //The following values are fixed to get a specific estimation value in ETH
    it('Should show error for gas limit', ()=>{
      cy.get('[name="ethGasLimit"]').clear().type('-100')
      cy.findByText('Must be greater than or equal to 0')
      cy.get('[name="ethGasLimit"]').clear().type('200000')
    })

    it('Should show error for gas price', ()=>{
      cy.get('[name="ethGasPrice"]').clear().type('-100')
      cy.findByText('Must be greater than or equal to 0')
      cy.get('[name="ethGasPrice"]').clear().type('5')
    })

    it('Should show error for gas fee and prio fee', ()=>{
      cy.get('[name="ethMaxPrioFee"]').clear().type('-100')
      cy.findByText('Must be greater than or equal to 0')
      cy.get('[name="ethMaxPrioFee"]').clear().type('7')
      cy.findByText('Maximum value is 5') //It cannot be higher than gasPrice
      cy.get('[name="ethMaxPrioFee"]').clear().type('5')
      cy.wait(1000)
      cy.findByTestId('submit-tx-btn').click()
    })
  })

  describe('Checking error messages for wrongs values', ()=>{
    it('Should show the edited values', ()=>{
      //Vefifying that in the dropdown all  the values are there
      cy.findByText('Estimated fee price').click()
      cy.wait(1000)
      cy.findByText("Gas limit").next().should("have.text", "200000")
      cy.findByText("Max fee per gas").next().should("have.text", "5")
      cy.findByText("Max priority fee").next().should("have.text", "5")
    })

    it('Should show the out of order nonce warning', ()=>{
      cy.findByText("Safe nonce").next().should("have.text", `${currentNonce + offset}`)

      //Verifying the warning message of setting a nonce hihgher than "current nonce"
      cy.findByText('transactions will need to be created and executed before this transaction, are you sure you want to do this?')
      .contains(`${offset}`)
    })
    it('Show the calculation of gaslimit + gas price', ()=>{
      cy.findByText('0.002 ETH') //the result of 200k gaslimit, 5 gasPrice and Fee
    })
  })
})
