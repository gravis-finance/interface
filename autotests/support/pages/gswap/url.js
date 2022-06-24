export default {
  checkUrlGswapExchange: () => cy.url().should('include', 'stage.gswap.exchange/?network=56'),
  checkUrlGswapExchangeSwap: () => cy.url().should('include', 'stage.gswap.exchange/swap?network=56'),
  checkUrlGswapExchangePool: () => cy.url().should('include', 'stage.gswap.exchange/pool?network=56'),
  checkUrlGswapExchangeMigrate: () => cy.url().should('include', 'stage.gswap.exchange/migrate?network=56'),
}