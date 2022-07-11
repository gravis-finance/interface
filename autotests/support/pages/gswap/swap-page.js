export default {
  swapPage: () => cy.get('[id="swap-page"]'),
  connectButton: () => cy.get('[data-id="connect-button"]'),
  accountButton: () => cy.get('[data-id="account-button"]'),
  swapTab: () => cy.get('[id="swap-nav-link"]'),
  poolTab: () => cy.get('[id="pool-nav-link"]'),
  migrateTab: () => cy.get('[id="migrate-nav-link"]'),
  bridgeTab: () => cy.get('[id="bridge-nav-link"]'),
  unlockButton: () => cy.get('[data-id="unlock-wallet-button"]'),
  addLiquidityButton: () => cy.get('[data-id="join-pool-button"]'),
  chooseTokenButton: () => cy.contains('Please, choose your token'),
  chooseNetworkButton: () => cy.get('[data-id="network-switch-dropdown"]'),
  networkButton: (network) => cy.get(`[id="${network}"]`),
  maxButton: () => cy.get('[data-id="swap-currency-input-max-button"]'),
  fromInput: () => cy.get('[data-id="swap-currency-input"]'),
  toInput: () => cy.get('[data-id="swap-currency-output"]'),
  fromButton: () => cy.get('[data-id="swap-currency-input-button"]'),
  toButton: () => cy.get('[data-id="swap-currency-output-button"]'),
  swapButton: () => cy.get('[data-id="swap-button"]', { timeout: 30000 }),
  acceptButton: () => cy.get('[data-id="accept-button"]'),
  revertButton: () => cy.get('[data-id="revert-trade-button"]'),
  token1Balance: () => cy.get('[data-id="token1-balance-amount"]', { timeout: 60000 }),
  token2Balance: () => cy.get('[data-id="token2-balance-amount"]', { timeout: 60000 }),
}