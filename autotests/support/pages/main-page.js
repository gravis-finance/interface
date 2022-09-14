export default {
  spinner: () => cy.get('[data-id="gravis-spinner"]', { timeout: 30000 }),

  tradeButton: () => cy.get('[data-id="trade-now-button"]'),

  // connect wallet
  connectButton: () => cy.get('[data-id="connect-button"]'),
  accountButton: () => cy.get('[data-id="account-button"]'),
  accountButtonSelector: () => '[data-id="account-button"]',

  // choose network
  chooseNetworkButton: () => cy.get('[data-id="network-switch-dropdown"]'),
  networkButton: (network) => cy.get(`[id="${network}"]`),

  // menu
  menuExchangeButton: () => cy.get('[data-id="mainmenu.trade-menu-item"]'),
  menuButton: (button) => cy.get(`[data-id="${button}-menu-item"]`),

  // tabs
  tabButton: (tab) => cy.get(`[id="${tab}-nav-link"]`),

  // select language
  switchLanguageButton: () => cy.get('[id="language-switch-dropdown"]'),
  selectLanguageButton: (language) => cy.get(`[data-id="${language}-switch-option"]`),

  swapPage: () => cy.get('[id="swap-page"]'),
  unlockButton: () => cy.get('[data-id="unlock-wallet-button"]'),
  addLiquidityButton: () => cy.get('[data-id="join-pool-button"]'),
  acceptButton: () => cy.get('[data-id="accept-button"]'),
  revertButton: () => cy.get('[data-id="revert-trade-button"]'),
  swapButton: () => cy.get('[data-id="swap-button"]', { timeout: 30000 }),
  fromButton: () => cy.get('[data-id="swap-currency-input-button"]'),
  fromInput: () => cy.get('[data-id="swap-currency-input"]'),
  fromMaxButton: () => cy.get('[data-id="swap-currency-input-max-button"]'),
  fromTokenBalance: () => cy.get('[data-id="token1-balance-amount"]', { timeout: 60000 }),
  toButton: () => cy.get('[data-id="swap-currency-output-button"]'),
  toInput: () => cy.get('[data-id="swap-currency-output"]'),
  toTokenBalance: () => cy.get('[data-id="token2-balance-amount"]', { timeout: 60000 }),
  inputTokenSearch: () => cy.get('[data-id="token-search-input"]'),
  tokenName: (token) => cy.get(`[data-id="token-item-${token}"]`),
  tokenPrice: () => cy.get('[data-id="price-token-per-token"]', { timeout: 10000 }),
  chooseTokenButton: () => cy.get(`[data-id="choose-token-button"]`),
}