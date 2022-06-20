export default {
  checkUrlGswapExchange: () => cy.url().should('include', 'stage.gswap.exchange/?network=56'),
  checkUrlGswapExchangeSwap: () => cy.url().should('include', 'stage.gswap.exchange/swap?network=56'),
}