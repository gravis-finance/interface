export default {
  walletAddress: () => cy.get('input[data-id="account-address"]'),
  closeButton: () => cy.get('button[data-id="close-button"]'),
}