describe('Landing page', () => {
  it('redirects to welcome page', () => {
    cy.visit('/app')

    cy.url().should('include', '/app/welcome')
  })

  it('features discoverability cookies', () => {
    cy.visit('https://safe-team.dev.gnosisdev.com/app')

    const cookieBannerId = '[data-testid="cookies-banner-form"]'

    cy.get(cookieBannerId).contains('We use cookies to provide you with the best experience')

    cy.get(cookieBannerId).contains('Accept selection').click()

    cy.get(cookieBannerId).should('not.exist')

    cy.contains("What's new").click()

    cy.get(cookieBannerId).contains('We use cookies to provide you with the best experience')
    cy.get(cookieBannerId).contains('Please accept the community support & updates cookies.')

    cy.get(cookieBannerId).contains('Community support & updates').click()
    cy.get(cookieBannerId).contains('Accept selection').click()
    cy.get(cookieBannerId).should('not.exist')

    // Open the features discoverability section
    cy.wait(3000) // TODO: wait for Beamer cookies to be set
    cy.contains("What's new").click()
    cy.get('#beamerOverlay .iframeCointaner').should('exist')
  })
})
