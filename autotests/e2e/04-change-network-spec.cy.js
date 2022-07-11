import modals from '../support/pages/gswap/modals';
import swapPage from '../support/pages/gswap/swap-page';
import url from '../support/pages/gswap/url';

Cypress.on('uncaught:exception', () => {
  return false;
});

const changeNetwork = (network, addNetwork = false) => {
  swapPage.chooseNetworkButton().eq(0).click();
  swapPage.networkButton(network).click();
  modals.checkNetworkSwitchModal();
  modals.changeNetworkButton().click();
  cy.approveChangeNetwork(addNetwork).then(approved => {
    expect(approved).to.be.true;
  });
  modals.networkSwitchModal().should('not.exist');
  modals.alertBlock().should('not.exist');
}

describe('04 Change network', () => {

  beforeEach(`Visit stage.gswap.exchange`, () => {
    cy.visit(Cypress.env('gswapHost'));
  });

  afterEach(`Change network in MetaMask`, () => {
    cy.changeNetwork('Smart Chain').then(networkChanged => {
      expect(networkChanged).to.be.true;
    });
  });

  after(`Disconnect MetaMask`, () => {
    cy.functions.disconnectGswap();
  });

  it(`Change network from BCS to HECO and cancel`, () => {
    cy.functions.connectMetamask();
    swapPage.chooseNetworkButton().eq(0).click();
    swapPage.networkButton('heco').click();
    modals.checkNetworkSwitchModal();   
    modals.changeNetworkButton().click();
    cy.cancelChangeNetwork().then(canceled => {
      expect(canceled).to.be.true;
    });
    modals.networkSwitchModal().should('exist');
    modals.alertBlock().should('exist').and('contain', 'You have a pending action in the wallet.');
  });

  it(`Change network BSC -> HECO -> BSC`, () => {
    cy.functions.connectMetamask();

    changeNetwork('heco');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'HECO');
    url.checkUrlGswapExchangeSwap('128');

    changeNetwork('bsc');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.checkUrlGswapExchangeSwap('56');

    swapPage.poolTab().click();

    changeNetwork('heco');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'HECO');
    url.checkUrlGswapExchangePool('128');

    changeNetwork('bsc');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.checkUrlGswapExchangePool('56');

    swapPage.migrateTab().click();

    changeNetwork('heco');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'HECO');
    url.checkUrlGswapExchangeMigrate('128');

    changeNetwork('bsc');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.checkUrlGswapExchangeMigrate('56');
  });

  it(`Change network BSC -> Polygon -> BSC`, () => {
    cy.functions.connectMetamask();

    changeNetwork('polygon');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'Polygon');
    url.checkUrlGswapExchangeSwap('137');

    changeNetwork('bsc');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.checkUrlGswapExchangeSwap('56');

    swapPage.poolTab().click();

    changeNetwork('polygon');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'Polygon');
    url.checkUrlGswapExchangePool('137');

    changeNetwork('bsc');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.checkUrlGswapExchangePool('56');

    swapPage.migrateTab().click();

    changeNetwork('polygon');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'Polygon');
    url.checkUrlGswapExchangeMigrate('137');

    changeNetwork('bsc');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.checkUrlGswapExchangeMigrate('56');
  });

  it(`Change network from BSC -> HECO -> Polygon -> BSC`, () => {
    cy.functions.connectMetamask();

    changeNetwork('heco');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'HECO');
    url.checkUrlGswapExchangeSwap('128');

    changeNetwork('polygon');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'Polygon');
    url.checkUrlGswapExchangeSwap('137');

    changeNetwork('bsc');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    url.checkUrlGswapExchangeSwap('56');
  });
});
