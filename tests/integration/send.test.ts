import { networks } from '../support/networks'

describe('Send', () => {
  it('should redirect', () => {
    cy.visit('/send')
    cy.url().should('include', '/swap')
  })

  for (const net of networks) {
    it(`should insert name in input and select ${net.tokens[0].name} token as output (${net.name})`, () => {
      cy.visit(`/send?outputCurrency=${net.tokens[0].id}&recipient=bob.argent.xyz&network=${net.id}`)
      cy.get('[data-id="swap-currency-output-button"]').should('contain.text', net.tokens[0].name)
      cy.get('.recipient-address-input').should('contain.value', 'bob.argent.xyz')
    })
  }
})
