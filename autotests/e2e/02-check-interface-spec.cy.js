import menuPage from '../support/pages/gswap/menu-page';
import swapPage from '../support/pages/gswap/swap-page';
import url from '../support/pages/gswap/url';

const activeTabStyle = 'color: rgb(144, 144, 144);';
const activeTabStyleAlign = 'color: rgb(144, 144, 144); text-align: center;';

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

describe('02 Check interface', () => {

  beforeEach(`Visit stage.gswap.exchange`, () => {
    cy.visit(Cypress.env('gswapHost'));
  });

  it(`Check menu, tabs and buttons`, () => {
    url.checkUrlGswapExchangeSwap('56');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('swap');
    swapPage.connectButton().should('exist');

    swapPage.poolTab().click();
    url.checkUrlGswapExchangePool('56');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('pool');
    swapPage.connectButton().should('exist');

    swapPage.migrateTab().click();
    url.checkUrlGswapExchangeMigrate('56');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('migrate');
    swapPage.connectButton().should('exist');

    swapPage.swapTab().click();
    url.checkUrlGswapExchangeSwap('56');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('swap');
    swapPage.connectButton().should('exist');

    menuPage.exchangeButton().click();

    menuPage.poolButton().click();
    url.checkUrlGswapExchangePool('56');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('pool');
    swapPage.connectButton().should('exist');

    menuPage.migrateButton().click();
    url.checkUrlGswapExchangeMigrate('56');
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('migrate');
    swapPage.connectButton().should('exist');

    menuPage.swapButton().click();
    url.checkUrlGswapExchangeSwap('56')
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('swap');
    swapPage.connectButton().should('exist');
  });
});