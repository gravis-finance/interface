import mainPage from '../support/pages/main-page';
import modals from '../support/pages/modals';
import url from '../support/pages/url';

Cypress.on('uncaught:exception', () => {
  return false;
});

const changeNetwork = (network, addNetwork = false) => {
  mainPage.chooseNetworkButton().eq(0).click();
  mainPage.networkButton(network).click();
  modals.networkSwitchModalCheck();
  modals.networkSwitchModalChangeNetworkButton().click();
  cy.approveChangeNetwork(addNetwork).then(approved => {
    expect(approved).to.be.true;
  });
  modals.networkSwitchModal().should('not.exist');
  modals.alertBlock().should('not.exist');
}

describe('04 Change network', () => {

  before(`Visit stage.gswap.exchange`, () => {
    cy.changeNetwork('Smart Chain').then(networkChanged => {
      expect(networkChanged).to.be.true;
    });
  });

  beforeEach(`Visit stage.gswap.exchange`, () => {
    cy.visit(Cypress.env('gswapSwapStageHost'));
    cy.functions.connectMetamask();
  });

  it(`Change network from BCS to HECO and cancel`, () => {
    mainPage.chooseNetworkButton().eq(0).click();
    mainPage.networkButton('heco').click();
    modals.networkSwitchModalCheck();   
    modals.networkSwitchModalChangeNetworkButton().click();
    cy.cancelChangeNetwork().then(canceled => {
      expect(canceled).to.be.true;
    });
    modals.networkSwitchModal().should('exist');
    // modals.alertBlock().should('exist').and('contain', 'You have a pending action in the wallet.');
  });

  it(`Change network BSC -> HECO -> BSC`, () => {
    changeNetwork('heco');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'HECO');
    url.gswapStageSwapUrlCheck('128');

    changeNetwork('bsc');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.gswapStageSwapUrlCheck('56');

    mainPage.tabButton('pool').click();

    changeNetwork('heco');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'HECO');
    url.gswapStagePoolUrlCheck('128');

    changeNetwork('bsc');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.gswapStagePoolUrlCheck('56');

    mainPage.tabButton('migrate').click();

    changeNetwork('heco');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'HECO');
    url.gswapStageMigrateUrlCheck('128');

    changeNetwork('bsc');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.gswapStageMigrateUrlCheck('56');
  });

  it(`Change network BSC -> Polygon -> BSC`, () => {
    changeNetwork('polygon');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'Polygon');
    url.gswapStageSwapUrlCheck('137');

    changeNetwork('bsc');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.gswapStageSwapUrlCheck('56');

    mainPage.tabButton('pool').click();

    changeNetwork('polygon');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'Polygon');
    url.gswapStagePoolUrlCheck('137');

    changeNetwork('bsc');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.gswapStagePoolUrlCheck('56');

    mainPage.tabButton('migrate').click();

    changeNetwork('polygon');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'Polygon');
    url.gswapStageMigrateUrlCheck('137');

    changeNetwork('bsc');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.gswapStageMigrateUrlCheck('56');
  });

  it(`Change network from BSC -> HECO -> Polygon -> BSC`, () => {
    changeNetwork('heco');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'HECO');
    url.gswapStageSwapUrlCheck('128');

    changeNetwork('polygon');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'Polygon');
    url.gswapStageSwapUrlCheck('137');

    changeNetwork('bsc');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.gswapStageSwapUrlCheck('56');
  });
});
