import mainPage from '../support/pages/main-page';
import url from '../support/pages/url';

const activeTabStyle = 'color: rgb(144, 144, 144);';
const activeTabStyleAlign = 'color: rgb(144, 144, 144); text-align: center;';

const checkActiveTab = (activeTab) => {
  if (activeTab === 'swap') {
    mainPage.tabButton('swap').should('not.have.attr', 'style');
    mainPage.tabButton('pool').should('have.attr', 'style').and('equal', activeTabStyle);
    mainPage.tabButton('migrate').should('have.attr', 'style').and('equal', activeTabStyle);
    mainPage.tabButton('bridge').should('have.attr', 'style').and('equal', activeTabStyleAlign);
  } else if (activeTab === 'pool') {
    mainPage.tabButton('swap').should('have.attr', 'style').and('equal', activeTabStyle);
    mainPage.tabButton('pool').should('not.have.attr', 'style');
    mainPage.tabButton('migrate').should('have.attr', 'style').and('equal', activeTabStyle);
    mainPage.tabButton('bridge').should('have.attr', 'style').and('equal', activeTabStyleAlign);
  } else if (activeTab === 'migrate') {
    mainPage.tabButton('swap').should('have.attr', 'style').and('equal', activeTabStyle);
    mainPage.tabButton('pool').should('have.attr', 'style').and('equal', activeTabStyle);
    mainPage.tabButton('migrate').should('not.have.attr', 'style');
    mainPage.tabButton('bridge').should('have.attr', 'style').and('equal', activeTabStyleAlign);
  }
}

describe('02 Check interface', () => {

  beforeEach(`Visit stage.gswap.exchange`, () => {
    cy.visit(Cypress.env('gswapSwapStageHost'));
  });

  it(`Check menu, tabs and buttons`, () => {
    url.gswapStageSwapUrlCheck('56');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('swap');
    mainPage.connectButton().should('exist');

    mainPage.tabButton('pool').click();
    url.gswapStagePoolUrlCheck('56');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('pool');
    mainPage.connectButton().should('exist');

    mainPage.tabButton('migrate').click();
    url.gswapStageMigrateUrlCheck('56');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('migrate');
    mainPage.connectButton().should('exist');

    mainPage.tabButton('swap').click();
    url.gswapStageSwapUrlCheck('56');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('swap');
    mainPage.connectButton().should('exist');

    mainPage.menuExchangeButton().click();

    mainPage.menuButton('pool').click();
    url.gswapStagePoolUrlCheck('56');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('pool');
    mainPage.connectButton().should('exist');

    mainPage.menuButton('migrate').click();
    url.gswapStageMigrateUrlCheck('56');
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('migrate');
    mainPage.connectButton().should('exist');

    mainPage.menuButton('swap').click();
    url.gswapStageSwapUrlCheck('56')
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    checkActiveTab('swap');
    mainPage.connectButton().should('exist');
  });
});