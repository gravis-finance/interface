import accountPage from '../support/pages/gswap/account-page';
import mainPage from '../support/pages/gswap/main-page';
import swapPage from '../support/pages/gswap/swap-page';
import connectPage from '../support/pages/gswap/connect-page';
import url from '../support/pages/gswap/url';

describe('Tests - Connect Metamask (test-cases 1-9)', () => {

  it(`Precondition - Setup Metamask`, () => {
    cy.setupMetamask(
      Cypress.env('secretWords'),
      Cypress.env('password'),
    ).then(setupFinished => {
      expect(setupFinished).to.be.true;
    });
  });

  it(`Precondition - Add smart chain testnet to Metamask`, () => {
    cy.addNetwork({
      networkName: 'Smart Chain',
      rpcUrl: 'https://bsc-dataseed.binance.org/',
      chainId: '56',
      symbol: 'BNB',
      blockExplorer: 'https://bscscan.com',
      isTestnet: true,
    }).then(networkAdded => {
      expect(networkAdded).to.be.true;
    });
  });

  it(`Test-case №1 - Connect Metamask using connect button`, () => {
    cy.visit(Cypress.env('gswapHost'));
    url.checkUrlGswapExchange();
    mainPage.tradeButton().click();
    url.checkUrlGswapExchangeSwap();
    swapPage.connectButton().click();
    connectPage.acceptButton().click();
    connectPage.binanceButton().click();
    connectPage.metamaskButton().click();
    cy.connectMetamask().then(connected => {
      expect(connected).to.be.true;
    });
    swapPage.connectButton().should('not.exist');
    swapPage.accountButton().should('exist').and('contain', Cypress.env('walletAddressShort'));
    swapPage.accountButton().click();
    accountPage.walletAddress().should('have.value', Cypress.env('walletAddressLong'));
    cy.disconnectMetamask().then(disconnected => {
      expect(disconnected).to.be.true;
    });
    accountPage.closeButton().click();
    swapPage.accountButton().should('not.exist');
    swapPage.connectButton().should('exist').and('contain', 'Connect');
  });
});
