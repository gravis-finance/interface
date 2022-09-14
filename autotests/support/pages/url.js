export default {
  // networks: BSC - 56, HECO - 128, Polygon - 137
  gswapStageSwapUrlCheck: (network) => cy.url().should('eq', `https://stage.gswap.exchange/swap?network=${network}`),
  gswapStagePoolUrlCheck: (network) => cy.url().should('eq', `https://stage.gswap.exchange/pool?network=${network}`),
  gswapStageMigrateUrlCheck: (network) => cy.url().should('eq', `https://stage.gswap.exchange/migrate?network=${network}`),

  // prod
  gswapUrlCheck: (network) => cy.url().should('eq', `https://gswap.exchange/?network=${network}`),
  gswapSwapUrlCheck: (network) => cy.url().should('eq', `https://gswap.exchange/swap?network=${network}`),
}