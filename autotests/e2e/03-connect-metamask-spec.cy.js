import swapPage from '../support/pages/gswap/swap-page';
import url from '../support/pages/gswap/url';

describe('03 Connect Metamask', () => {

  beforeEach(`Visit stage.gswap.exchange`, () => {
    cy.visit(Cypress.env('gswapHost'));
  });

  after(`Disconnect MetaMask`, () => {
    cy.functions.disconnectGswap();
  });

  it(`Connect Metamask using connect button`, () => {
    cy.functions.connectMetamask();
    cy.functions.disconnectMetamask();
  });

  it(`Connect Metamask using unlock button (swap tab)`, () => {
    url.checkUrlGswapExchangeSwap('56');
    cy.functions.connectMetamask('unlockButton');
    swapPage.unlockButton().should('not.exist');
    swapPage.swapButton().should('exist').and('have.attr', 'disabled');
    cy.functions.disconnectMetamask();
  });

  it(`Connect Metamask using unlock button (pool tab)`, () => {
    swapPage.poolTab().click();
    url.checkUrlGswapExchangePool('56');
    cy.functions.connectMetamask('unlockButton');
    swapPage.unlockButton().should('not.exist');
    swapPage.addLiquidityButton().should('exist');
    cy.functions.disconnectMetamask();
  });

  it(`Connect Metamask using unlock button (migrate tab)`, () => {
    swapPage.migrateTab().click();
    url.checkUrlGswapExchangeMigrate('56');
    cy.functions.connectMetamask('unlockButton');
    swapPage.unlockButton().should('not.exist');
    swapPage.chooseTokenButton().should('exist').and('have.attr', 'disabled');
    cy.functions.disconnectMetamask();
  });

  it(`Disconnect Metamask using disconnect button on site`, () => {
    cy.functions.connectMetamask();
  });
});