import mainPage from './pages/main-page';
import modals from './pages/modals';

cy.functions = {

  acceptCookes() {
    cy.get('body').then(($body) => {
      if ($body.text().includes('Accept all and close')) {
        cy.contains('Accept all and close').click();
      }
    });
  },
  
  randomAmount({ minNum, maxNum, minDec, maxDec }) {
    const decimal = Number(Math.random() * (maxDec - minDec) + minDec).toFixed(0);
    return Number(Math.random() * (maxNum - minNum) + minNum).toFixed(decimal);
  },

  randomAmountFixedDec(min, max, dec) {
    return Number(Math.random() * (max - min) + min).toFixed(dec);
  },

  connectMetamask(unlockButton) {
    cy.get('body').then(($body) => {
      if ($body.find(mainPage.accountButtonSelector()).length === 0) {
        if (unlockButton) {
          mainPage.unlockButton().click();
        } else {
          mainPage.connectButton().click();
        }
        modals.connectModalAcceptButton().click();
        modals.connectModalBinanceButton().click();
        modals.connectModalMetamaskButton().click();
      }
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('body').then(($body) => {
      if ($body.find(mainPage.accountButtonSelector()).length === 0) {
        cy.connectMetamask().then(connected => {
          expect(connected).to.be.true;
        });
      }
    });
    mainPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    mainPage.connectButton().should('not.exist');
    mainPage.accountButton().click();
    modals.accountModalWalletAddress().should('have.value', Cypress.env('walletAddress'));
    modals.accountModalCloseButton().click();
  },

  disconnectMetamask() {
    cy.disconnectMetamask().then(disconnected => {
      expect(disconnected).to.be.true;
    });
    mainPage.accountButton().should('not.exist');
    mainPage.connectButton().should('exist').and('have.text', 'Connect');
  },

  disconnectSite() {
    cy.get('body').then(($body) => {
      if ($body.text().includes(Cypress.env('walletAddressShort'))) {
        mainPage.accountButton().click();
        modals.accountModalDisconnectButton().click();
        mainPage.accountButton().should('not.exist');
        mainPage.connectButton().should('exist').and('have.text', 'Connect');
      }
    });
  },
};

// https://api.bscscan.com/api
//   ?module=account
//   &action=txlist
//   &address=0xDab2Ca322315Ab925a2864A020F8BDd6167E8A6e
//   &startblock=0
//   &endblock=99999999
//   &page=1
//   &offset=1
//   &sort=desc
//   &apikey=KX1NRY5QW92UED2PXPEHYZM393T6Y1JA69

// https://api.bscscan.com/api
//   ?module=gastracker
//   &action=gasoracle
//   &apikey=KX1NRY5QW92UED2PXPEHYZM393T6Y1JA69