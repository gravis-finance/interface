import { networks } from '../support/networks'

describe('Add Liquidity', () => {
  const BSC_NETWORK_ID = Cypress.env('test_env') === 'dev' ? 97 : 56
  const HECO_NETWORK_ID = Cypress.env('test_env') === 'dev' ? 256 : 128

  for (const net of networks) {
    it(`loads the two correct tokens`, () => {
      cy.visit(`/add/${net.tokens[0].id}/${net.tokens[1].id}?network=${net.id}`)
      cy.get('[data-id="add-liquidity-input-tokena-button"]').should('contain.text', net.tokens[0].name)
      cy.get('[data-id="add-liquidity-input-tokenb-button"]').should('contain.text', net.tokens[1].name)
    })

    it(`does not crash if ${net.tokens[1].name} is duplicated`, () => {
      cy.visit(`/add/${net.tokens[1].id}-${net.tokens[1].id}?network=${net.id}`)
      cy.get('[data-id="add-liquidity-input-tokena-button"]').should('contain.text', net.tokens[1].name)
      cy.get('[data-id="add-liquidity-input-tokenb-button"]').should('not.contain.text', net.tokens[1].name)
    })

    it('single token can be selected', () => {
      cy.visit(`/add/${net.tokens[0].id}?network=${net.id}`)
      cy.get('[data-id="add-liquidity-input-tokena-button"]').should('contain.text', net.tokens[0].name)
      cy.visit(`/add/${net.tokens[1].id}?network=${net.id}`)
      cy.get('[data-id="add-liquidity-input-tokena-button"]').should('contain.text', net.tokens[1].name)
    })
  }
  it('redirects /add/token-token to add/token/token', () => {
    cy.visit(`/add/0xb290b2f9f8f108d03ff2af3ac5c8de6de31cdf6d-0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85`)
    cy.url().should(
      'contain',
      '/add/0xb290b2f9f8f108d03ff2af3ac5c8de6de31cdf6d/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85'
    )
  })

  it('redirects /add/WETH-token to /add/WETH-address/token', () => {
    cy.visit('/add/0xc778417E063141139Fce010982780140Aa0cD5Ab-0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85')
    cy.url().should(
      'contain',
      '/add/0xc778417E063141139Fce010982780140Aa0cD5Ab/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85'
    )
  })

  it('redirects /add/token-WETH to /add/token/WETH-address', () => {
    cy.visit('/add/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85-0xc778417E063141139Fce010982780140Aa0cD5Ab')
    cy.url().should(
      'contain',
      '/add/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85/0xc778417E063141139Fce010982780140Aa0cD5Ab'
    )
  })
})
