export default {
  // account modal
  accountModal: () => cy.get('[data-id="account-modal"]'),
  accountCloseButton: () => cy.get('[data-id="account-modal"]').find('[data-id="close-button"]'),
  accountWalletAddress: () => cy.get('[data-id="account-modal"]').find('[data-id="account-address"]'),
  accountTransactionHistoryButton: () =>cy.get('[data-id="account-modal"]').find('[data-id="transition-history-button"]'),
  accountDisconnectButton: () => cy.get('[data-id="account-modal"]').find('[data-id="disconnect-button"]'),

  // token modal
  selectTokenModal: () => cy.get('[data-id="select-token-modal"]'),
  selectTokenUsdtButton: () => cy.get('[data-id="select-token-modal"]').find('[alt="USDT logo"]'),

  // swap modal
  confirmSwapModal: () => cy.get('[data-id="confirmation-content"]'),
  confirmSwapAcceptPriceButton: () => cy.get('[data-id="confirmation-content"]').find('[data-id="accept-button"]'),
  confirmSwapConfirmSwapButton: () => cy.get('[data-id="confirmation-content"]').find('[data-id="confirm-swap-or-send"]', { timeout: 60000 }),

  // pending modal
  confirmPendingModal: () => cy.get('[data-id="cofirmation-pending-modal"]'),

  // submit modal
  submitSwapModal: () => cy.get('[data-id="transaction-submitted-content"]', { timeout: 60000 }),
  submitSwapTransactionLink: () => cy.get('[data-id="transaction-submitted-content"]').find('a'),
  submitSwapCloseButton: () => cy.get('[data-id="transaction-submitted-content"]').find('[data-id="submit-transaction-close-button"]'),
  
  // resent transactions modal
  recentTransactionsModal: () => cy.get('[data-id="recent-transactions-modal"]'),

  // popup
  popup: () => cy.get('[data-id="popup-item"]', { timeout: 30000 }),

  // network switch
  networkSwitchModal: () => cy.get('[data-id="network-switching-error-modal"]', { timeout: 10000 }),
  changeNetworkButton: () => cy.get('[data-id="network-switching-error-modal"]').find('[data-id="change-network-button"]'),

  checkNetworkSwitchModal() {
    this.networkSwitchModal()
      .should('contain', 'Network switching error')
      .and('contain', 'We found that you have different networks\nselected in your wallet and on our site.')
      .and('contain', 'Change network in the wallet');
    this.changeNetworkButton().should('exist');
  },

  // alert
  alertBlock: () => cy.get('[data-id="alert-block"]'),
}