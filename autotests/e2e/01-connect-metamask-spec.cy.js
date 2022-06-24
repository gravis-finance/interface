import accountPage from '../support/pages/gswap/account-page';
import swapPage from '../support/pages/gswap/swap-page';
import connectPage from '../support/pages/gswap/connect-page';
import url from '../support/pages/gswap/url';

const activeTabStyle = 'color: rgb(144, 144, 144);';
const activeTabStyleAlign = 'color: rgb(144, 144, 144); text-align: center;';

const connectMetamask = () => {
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
}

const disconnectMetamask = () => {
  cy.disconnectMetamask().then(disconnected => {
    expect(disconnected).to.be.true;
  });
  swapPage.accountButton().should('not.exist');
  swapPage.connectButton().should('exist').and('contain', 'Connect');
}

const checkActiveTab = (activeTab) => {
  if (activeTab === 'swap') {
    swapPage.swapTab().should('not.have.attr', 'style');
    swapPage.poolTab().should('have.attr', 'style').and('equal', activeTabStyle);
    swapPage.migrateTab().should('have.attr', 'style').and('equal', activeTabStyle);
    swapPage.bridgeTab().should('have.attr', 'style').and('equal', activeTabStyleAlign);
  } else if (activeTab === 'pool') {
    swapPage.swapTab().should('have.attr', 'style').and('equal', activeTabStyle);
    swapPage.poolTab().should('not.have.attr', 'style');
    swapPage.migrateTab().should('have.attr', 'style').and('equal', activeTabStyle);
    swapPage.bridgeTab().should('have.attr', 'style').and('equal', activeTabStyleAlign);
  } else if (activeTab === 'migrate') {
    swapPage.swapTab().should('have.attr', 'style').and('equal', activeTabStyle);
    swapPage.poolTab().should('have.attr', 'style').and('equal', activeTabStyle);
    swapPage.migrateTab().should('not.have.attr', 'style');
    swapPage.bridgeTab().should('have.attr', 'style').and('equal', activeTabStyleAlign);
  }
}

describe('Tests - Connect Metamask', () => {

  beforeEach(`Visit stage.gswap.exchange`, () => {
    cy.visit(Cypress.env('gswapHost'));
  });

  it(`Precondition - Setup Metamask`, () => {
    cy.setupMetamask(
      Cypress.env('secretWords'),
      Cypress.env('password')
    ).then(setupFinished => {
      expect(setupFinished).to.be.true;
    });
  });

  it(`Precondition - Add Binance smart chain`, () => {
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

  it(`Connect Metamask using connect button`, () => {
    url.checkUrlGswapExchangeSwap();
    swapPage.connectButton().click();
    connectMetamask();
    accountPage.closeButton().click();
    swapPage.chooseNetworkButton().should('contain', 'BSC');
    disconnectMetamask();
  });

  it(`Connect Metamask using unlock button (swap tab)`, () => {
    checkActiveTab('swap');
    swapPage.unlockButton().click();
    connectMetamask();
    accountPage.closeButton().click();
    swapPage.chooseNetworkButton().should('contain', 'BSC');
    swapPage.unlockButton().should('not.exist');
    swapPage.swapButton().should('exist').and('have.attr', 'disabled');
    disconnectMetamask();
  });

  it(`Connect Metamask using unlock button (pool tab)`, () => {
    swapPage.poolTab().click();
    url.checkUrlGswapExchangePool();
    checkActiveTab('pool');
    swapPage.unlockButton().click();
    connectMetamask();
    accountPage.closeButton().click();
    swapPage.chooseNetworkButton().should('contain', 'BSC');
    swapPage.unlockButton().should('not.exist');
    swapPage.addLiquidityButton().should('exist');
    disconnectMetamask();
  });

  it(`Connect Metamask using unlock button (migrate tab)`, () => {
    swapPage.migrateTab().click();
    url.checkUrlGswapExchangeMigrate();
    checkActiveTab('migrate');
    swapPage.unlockButton().click();
    connectMetamask();
    accountPage.closeButton().click();
    swapPage.chooseNetworkButton().should('contain', 'BSC');
    swapPage.unlockButton().should('not.exist');
    swapPage.chooseTokenButton().should('exist').and('have.attr', 'disabled');
    disconnectMetamask();
  });

  it(`Disconnect Metamask using disconnect button`, () => {
    swapPage.connectButton().click();
    connectMetamask();
    accountPage.disconnectButton().click();
    swapPage.accountButton().should('not.exist');
    swapPage.connectButton().should('exist').and('contain', 'Connect');
  });
});