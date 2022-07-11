export default {
  // networks: BSC - 56, HECO - 128, Polygon - 137
  checkUrlGswapExchangeSwap: (network) => cy.url().should('include', `stage.gswap.exchange/swap?network=${network}`),
  checkUrlGswapExchangePool: (network) => cy.url().should('include', `stage.gswap.exchange/pool?network=${network}`),
  checkUrlGswapExchangeMigrate: (network) => cy.url().should('include', `stage.gswap.exchange/migrate?network=${network}`),
}