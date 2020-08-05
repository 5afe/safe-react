given('I am on the welcome screen', () => {
    cy.visit('/');
});

then('I should see the connect button', () => {
    cy.get('[data-testid=connect-btn]').should('have.length', 1);
});

then('I should see not connected wallet in the wallet dropdown', () => {
    cy.get('[data-testid=not-connected-wallet]').should('have.length', 1);
});