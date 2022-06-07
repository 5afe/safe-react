describe('Advanced Options', () => {
  it('Advanced options and gas estimation/price', () => {
    cy.visit('/rin:0x1a42dfaF749B4Cc1Ca904038F30cA771AFC8B6ae/settings/advanced')
    cy.findByText('Accept selection').click
    cy.get('[data-testid="current-nonce"]').invoke('text').as('theNumber')
    cy.get('@theNumber').then((theNumber) => {
      cy.log(theNumber)
    })
    cy.get('[data-testid="sidebar"]').findByText('Apps').click()
    cy.get('[alt="Transaction Builder Logo"]').scrollIntoView({ duration: 1000 }).click()
  })
})
