export default {
  // acceptButton: () => cy.get('[data-id="read-and-accept-button"]'),
  // binanceButton: () => cy.get('[data-id="binance"]'),
  // metamaskButton: () => cy.get('[id="wallet-connect-metamask"]'),
  acceptButton: () => cy.contains('I read and accept'),
  binanceButton: () => cy.contains('Binance'),
  metamaskButton: () => cy.contains('Metamask'),
}