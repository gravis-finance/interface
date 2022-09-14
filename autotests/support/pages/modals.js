export default {
  // connect modal
  connectModal: () => cy.get('[data-id="connect-modal"]'),
  connectModalCloseButton() { return this.connectModal().find('[data-id="close-button"]') },
  connectModalAcceptButton() { return this.connectModal().find('[data-id="read-and-accept-button"]') },
  connectModalBinanceButton() { return this.connectModal().find('[data-id="binance"]') },
  connectModalMetamaskButton() { return this.connectModal().find('[id="wallet-connect-metamask"]') },

  // account modal
  accountModal: () => cy.get('[data-id="account-modal"]'),
  accountModalCloseButton() { return this.accountModal().find('[data-id="close-button"]') },
  accountModalWalletAddress() { return this.accountModal().find('[data-id="account-address"]') },
  accountModalTransactionHistoryButton() { return this.accountModal().find('[data-id="transition-history-button"]') },
  accountModalDisconnectButton() { return this.accountModal().find('[data-id="disconnect-button"]') },

  // network switch
  networkSwitchModal: () => cy.get('[data-id="network-switching-error-modal"]', { timeout: 10000 }),
  networkSwitchModalChangeNetworkButton() { return this.networkSwitchModal().find('[data-id="change-network-button"]') },
  networkSwitchModalChangeNetworkDropdown() { return this.networkSwitchModal().find('[data-id="network-switch-dropdown"]') },
  networkSwitchModalCheck() {
    this.networkSwitchModal()
      .should('contain', 'Network switching error')
      .and('contain', 'We found that you have different networks\nselected in your wallet and on our site.')
      .and('contain', 'Change network in the wallet');
    this.networkSwitchModalChangeNetworkButton().should('exist');
  },

  // token modal
  selectTokenModal: () => cy.get('[data-id="select-token-modal"]'),
  selectTokenModalUsdtButton() { return this.selectTokenModal().find('[alt="USDT logo"]') },

  // swap modal
  confirmSwapModal: () => cy.get('[data-id="confirmation-content"]'),
  confirmSwapModalAcceptPriceButton() { return this.confirmSwapModal().find('[data-id="accept-button"]') },
  confirmSwapModalConfirmSwapButton() { return this.confirmSwapModal().find('[data-id="confirm-swap-or-send"]') },

  // pending modal
  confirmPendingModal: () => cy.get('[data-id="cofirmation-pending-modal"]'),

  // transaction confirmation modal
  transConfirmModal: () => cy.get('[data-id="transaction-confirmation-modal"]'),
  transConfirmModalConfirmSwapButton() { return this.transConfirmModal().find('[data-id="confirm-swap-or-send"]') },

  // submit modal
  submitSwapModal: () => cy.get('[data-id="transaction-submitted-content"]', { timeout: 60000 }),
  submitSwapModalTransactionLink() { return this.submitSwapModal().find('a') },
  submitSwapModalCloseButton() { return this.submitSwapModal().find('[data-id="submit-transaction-close-button"]') },
  submitSwapModalCheckUrl() {
    this.submitSwapModal()
      .find('a', { timeout: 20000 })
      .should('contain', 'View on BSCScan')
      .should('have.attr', 'href')
      .and('contain', 'https://bscscan.com/tx/0x')
    this.submitSwapModal().find('a').invoke('attr','href').then((href) => {
        cy.wrap(href.split('/')[4]).as('hashModal');
      });
  },

  // resent transactions modal
  recentTransactionsModal: () => cy.get('[data-id="recent-transactions-modal"]'),

  // recent transactions modal
  recentTransModal: () => cy.get('[data-id="recent-transactions-modal"]'),

  // popup
  popup: () => cy.get('[data-id="popup-item"]', { timeout: 30000 }),
  popupCheckUrl() {
    this.popup()
      .find('a')
      .should('contain', 'View on BSCScan')
      .should('have.attr', 'href')
      .and('contain', 'https://bscscan.com/tx/0x')
    this.popup().find('a').invoke('attr','href').then((href) => {
      cy.wrap(href.split('/')[4]).as('hashPopup');
    });
  },

  // alert
  alertBlock: () => cy.get('[data-id="alert-block"]'),
}