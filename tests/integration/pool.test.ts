describe('Pool', () => {
  beforeEach(() => cy.visit('/pool'))
  // it('add liquidity links to /add/ETH', () => {
  //   cy.get('#join-pool-button').click()
  //   cy.url().should('contain', '/add/ETH')
  // })

  it('import pool links to /import', () => {
    cy.get('[data-id="import-pool-link"]').click({ force: true })
    cy.url().should('contain', '/find')
  })
})
