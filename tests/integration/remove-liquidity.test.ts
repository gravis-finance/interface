import { networks } from '../support/networks'

describe('Remove Liquidity', () => {
  it('redirects', () => {
    cy.visit('/remove/0xc778417E063141139Fce010982780140Aa0cD5Ab-0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85')
    cy.url().should(
      'contain',
      '/remove/0xc778417E063141139Fce010982780140Aa0cD5Ab/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85'
    )
  })
  for (const net of networks) {
    it(`${net.tokens[0].name} remove`, () => {
      cy.visit(`/remove/${net.tokens[0].id}/${net.tokens[1].id}?network=${net.id}`)
      cy.get('#remove-liquidity-tokena-symbol').should('contain.text', net.tokens[0].name)
      cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', net.tokens[1].name)
    })

    it(`${net.tokens[0].name} remove swap order`, () => {
      cy.visit(`/remove/${net.tokens[1].id}/${net.tokens[0].id}?network=${net.id}`)
      cy.get('#remove-liquidity-tokena-symbol').should('contain.text', net.tokens[1].name)
      cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', net.tokens[0].name)
    })

    it(`loads the two correct tokens`, () => {
      cy.visit(`/remove/${net.tokens[1].id}/${net.tokens[2].id}?network=${net.id}`)
      cy.get('#remove-liquidity-tokena-symbol').should('contain.text', net.tokens[1].name)
      cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', net.tokens[2].name)
    })

    it(`does not crash if ${net.tokens[1].name} is duplicated`, () => {
      cy.visit(`/remove/${net.tokens[1].id}/${net.tokens[1].id}?network=${net.id}`)
      cy.get('#remove-liquidity-tokena-symbol').should('contain.text', net.tokens[1].name)
      cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', net.tokens[1].name)
    })
  }
  // it('token not in storage is loaded', () => {
  //   cy.visit('/remove/0x7083609fce4d1d8dc0c979aab8c869ea2c873402-0x2170ed0880ac9a755fd29b2688956bd959f933f8')
  //   cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'DOT')
  //   cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'ETH')
  // })
})
