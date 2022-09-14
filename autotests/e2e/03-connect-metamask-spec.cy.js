import mainPage from '../support/pages/main-page';
import url from '../support/pages/url';

describe('03 Connect Metamask', () => {

  beforeEach(`Visit stage.gswap.exchange`, () => {
    cy.visit(Cypress.env('gswapSwapStageHost'));
  });

  it(`Connect Metamask using connect button`, () => {
    cy.functions.connectMetamask();
    cy.functions.disconnectMetamask();
  });

  it(`Connect Metamask using unlock button (swap tab)`, () => {
    url.gswapStageSwapUrlCheck('56');
    cy.functions.connectMetamask('unlockButton');
    mainPage.unlockButton().should('not.exist');
    mainPage.swapButton().should('exist').and('have.attr', 'disabled');
    cy.functions.disconnectMetamask();
  });

  it(`Connect Metamask using unlock button (pool tab)`, () => {
    mainPage.tabButton('pool').click();
    url.gswapStagePoolUrlCheck('56');
    cy.functions.connectMetamask('unlockButton');
    mainPage.unlockButton().should('not.exist');
    mainPage.addLiquidityButton().should('exist');
    cy.functions.disconnectMetamask();
  });

  it(`Connect Metamask using unlock button (migrate tab)`, () => {
    mainPage.tabButton('migrate').click();
    url.gswapStageMigrateUrlCheck('56');
    cy.functions.connectMetamask('unlockButton');
    mainPage.unlockButton().should('not.exist');
    mainPage.chooseTokenButton().should('exist').and('have.attr', 'disabled');
    cy.functions.disconnectMetamask();
  });

  it(`Disconnect Metamask using disconnect button on site`, () => {
    cy.functions.connectMetamask();
  });
});