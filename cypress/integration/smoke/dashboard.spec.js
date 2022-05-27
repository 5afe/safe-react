const SAFE = 'rin:0xFfDC1BcdeC18b1196e7FA04246295DE3A17972Ac'

describe('Dashboard', () => {
  before(() => {
    // Go to the test Safe home page
    cy.visit(`/${SAFE}/home`)
    cy.contains('a', 'Accept selection').click()
  })

  it('should display the dashboard title', () => {
    cy.contains('main h1', 'Dashboard')
  }) 

  it('should display the overview widget', () => {
    cy.contains('main p', SAFE).should('exist')
    cy.contains('main', '1/9')
    cy.get(`main a[href="/app/${SAFE}/balances"] button`).contains('View Assets')
    cy.get(`main a[href="/app/${SAFE}/balances"]`).contains('Tokens3')
    cy.contains(`main a[href="/app/${SAFE}/balances/nfts"]`, 'NFTs0')
  })

  it('should display the mobile banner', () => {
    const appStoreLink = 'https://apps.apple.com/app/apple-store/id1515759131?pt=119497694&ct=Web%20App%20Dashboard&mt=8'
    cy.get(`a[href="${appStoreLink}"]`).should('exist')
    
    cy.get('button[aria-label="Close mobile banner"]').click()
    cy.contains('button', 'Already use it!')
    cy.contains('button', 'Not interested').click()

    cy.get(`a[href="${appStoreLink}"]`).should('not.exist')
  })

  it('should display the tx queue widget', () => {
    cy.contains('main', 'This Safe has no queued transactions')
    cy.contains(`a[href="/app/${SAFE}/transactions/queue"]`, 'View All')
  })

  it('should display the featured Safe Apps', () => {
    cy.contains('main h2', 'Connect & Transact')
    cy.contains('main p', 'Use Transaction Builder')
    cy.contains('main p', 'Use WalletConnect')
  })

  it('should show the Safe Apps widget', () => {
    cy.contains('main h2', 'Safe Apps')
    cy.contains('main a[href="/app/apps"] button', 'Explore Safe Apps')
    cy.get('main a[href^="/app/apps?appUrl=http"]').should('have.length.gte', 5)
  })
})
