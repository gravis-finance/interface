export default {
  walletAddress: () => cy.get('[data-id="account-address"]'),
  closeButton: () => cy.get('[data-id="close-button"]'),
  disconnectButton: () => cy.get('[data-id="disconnect-button"]'),
}