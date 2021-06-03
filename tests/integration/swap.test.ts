import { networks } from '../support/networks'

describe('Swap', () => {
  beforeEach(() => {
    cy.visit('/swap')
  })
  it('can enter an amount into input', () => {
    cy.get('[data-id="swap-currency-input"]').type('0.001', { delay: 200, force: true }).should('have.value', '0.001')
  })

  it('zero swap amount', () => {
    cy.get('[data-id="swap-currency-input"]').type('0.0', { delay: 200, force: true }).should('have.value', '0.0')
  })

  it('invalid swap amount', () => {
    cy.get('[data-id="swap-currency-input"]').type('\\', { delay: 200, force: true }).should('have.value', '')
  })

  it('can enter an amount into output', () => {
    cy.get('[data-id="swap-currency-output"]').type('0.001', { delay: 200, force: true }).should('have.value', '0.001')
  })

  it('zero output amount', () => {
    cy.get('[data-id="swap-currency-output"]').type('0.0', { delay: 200, force: true }).should('have.value', '0.0')
  })

  for (const net of networks) {
    let tokenA = net.tokens[1]
    let tokenB = net.tokens[2]
    if (Cypress.env('test_env') !== 'dev') {
      tokenA = net.onlyProdTokens[0]
      tokenB = net.onlyProdTokens[1]
    }

    it(`can swap ${tokenA.name} for ${tokenB.name}`, () => {
      cy.visit(`/swap?network=${net.id}`)
      cy.get('[data-id="swap-currency-input-button"]').click({ force: true, multiple: true })
      cy.get(`[data-id="token-item-${tokenA.name}"]`).click({ force: true, multiple: true })
      cy.get('[data-id="swap-currency-output-button"]').click({ force: true, multiple: true })
      cy.get(`[data-id="token-item-${tokenA.name}"]`).click({ force: true, multiple: true })
      cy.get('[data-id="swap-currency-input"]').should('be.visible')
      cy.get('[data-id="swap-currency-input"]').type('0.001', { force: true, delay: 200 })
      cy.get('[data-id="swap-currency-output"]').should('not.equal', '')
    })
  }

  it('add a recipient does not exist unless in expert mode', () => {
    cy.get('#add-recipient-button').should('not.exist')
  })
})
