import connectPage from "./pages/gswap/connect-page";
import modals from "./pages/gswap/modals";
import swapPage from "./pages/gswap/swap-page";

cy.functions = {

  getBnbAmount() {
    cy.request({
      method: 'GET',
      url: `https://api.bscscan.com/api` +
      `?module=account` +
      `&action=balance` +
      `&address=${Cypress.env('walletAddress')}` +
      `&apikey=${Cypress.env('apiKey')}`,
    }).then((response)=> {
      expect(response.body.status).to.equal('1');
      const amountBnbBlockchain = response.body.result;
      cy.wrap(amountBnbBlockchain).as('amountBnbBlockchain');
    });
  },

  getUsdtAmount() {
    cy.request({
      method: 'GET',
      url: `https://api.bscscan.com/api` +
      `?module=account` +
      `&action=tokenbalance` +
      `&contractaddress=${Cypress.env('tokenUsdt')}` +
      `&address=${Cypress.env('walletAddress')}` +
      `&tag=latest` +
      `&apikey=${Cypress.env('apiKey')}`,
    }).then((response)=> {
      expect(response.body.status).to.equal('1');
      const amountUsdtBlockchain = response.body.result;
      cy.wrap(amountUsdtBlockchain).as('amountUsdtBlockchain');
    });
  },

  getTransactionAmount(transaction) {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(10000);
    cy.request({
      method: 'GET',
      url: `https://api.bscscan.com/api` +
      `?module=account` +
      `&action=txlistinternal` +
      `&txhash=${transaction}` +
      `&apikey=${Cypress.env('apiKey')}`,
    }).then((response)=> {
      expect(response.body.status).to.equal('1');
      const transactionValue = response.body.result[0].value;
      cy.wrap(transactionValue).as('transactionValue');
    });
  },

  getTransactionFee() {
    cy.request({
      method: 'GET',
      url: `https://api.bscscan.com/api` +
      `?module=account` +
      `&action=txlist` +
      `&address=${Cypress.env('walletAddress')}` +
      `&startblock=0` +
      `&endblock=99999999` +
      `&page=1` +
      `&offset=1` +
      `&sort=desc` +
      `&apikey=${Cypress.env('apiKey')}`,
    }).then((response)=> {
      expect(response.body.status).to.equal('1');
      const {gasPrice} = response.body.result[0];
      const {gasUsed} = response.body.result[0];
      const gasFee = gasPrice * gasUsed;
      cy.wrap(gasFee).as('gasFee');
      cy.readFile(Cypress.env('feeFile')).then((data) => {
        data.push({ gasPrice: `${gasPrice}`, gasUsed: `${gasUsed}`, gasFee: `${gasFee}` });
        cy.writeFile(Cypress.env('feeFile'), JSON.stringify(data))
      })
    });
  },

  getGasPrice() {
    cy.request({
      method: 'GET',
      url: `https://api.bscscan.com/api` +
      `?module=gastracker` +
      `&action=gasoracle` +
      `&apikey=${Cypress.env('apiKey')}`,
    }).then((response)=> {
      expect(response.body.status).to.equal('1');
      const {UsdPrice} = response.body.result;
      cy.wrap(UsdPrice).as('usdPrice');
    });
  },

  getRandomAmount(min, max, dec) {
    return Number.parseFloat(Math.random() * (max - min) + min).toFixed(dec);
  },

  connectMetamask(unlockButton) {
    cy.get('body').then(($body) => {
      if (!($body.text().includes(Cypress.env('walletAddressShort')))) {
        if (unlockButton) {
          swapPage.unlockButton().click();
        } else {
          swapPage.connectButton().click();
        }
      }
    });
    cy.get('body').then(($body) => {
      if (!($body.text().includes(Cypress.env('walletAddressShort')))) {
        connectPage.acceptButton().click();
        connectPage.binanceButton().click();
        connectPage.metamaskButton().click();
      }
    });
    cy.get('body').then(($body) => {
      if (!($body.text().includes(Cypress.env('walletAddressShort')))) {
        cy.connectMetamask().then(connected => {
          expect(connected).to.be.true;
        });
      }
    });
    swapPage.chooseNetworkButton().eq(0).should('contain', 'BSC');
    swapPage.connectButton().should('not.exist');
    swapPage.accountButton().click();
    modals.accountWalletAddress().should('have.value', Cypress.env('walletAddress'));
    modals.accountCloseButton().click();
  },

  disconnectMetamask() {
    cy.disconnectMetamask().then(disconnected => {
      expect(disconnected).to.be.true;
    });
    swapPage.accountButton().should('not.exist');
    swapPage.connectButton().should('exist').and('contain', 'Connect');
  },

  disconnectGswap() {
    cy.get('body').then(($body) => {
      if ($body.text().includes(Cypress.env('walletAddressShort'))) {
        swapPage.accountButton().click();
        modals.accountDisconnectButton().click();
        swapPage.accountButton().should('not.exist');
        swapPage.connectButton().should('exist').and('contain', 'Connect');
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