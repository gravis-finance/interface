describe('01 Preconditions', () => {

  before(`Visit stage.gswap.exchange`, () => {
    cy.visit(Cypress.env('gswapHost'));
  });

  it(`Precondition - Import wallet`, () => {
    cy.setupMetamask(
      Cypress.env('secretWords'),
      Cypress.env('password'),
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
      isTestnet: false,
    }).then(networkAdded => {
      expect(networkAdded).to.be.true;
    });
  });

  it(`Precondition - Import account`, () => {
    cy.importAccount(
      Cypress.env('privateKey'),
    ).then(imported => {
      expect(imported).to.be.true;
    });
  });

  it(`Precondition - Import USDT token`, () => {
    cy.importToken(
      'USDT',
      Cypress.env('tokenUsdt'),
    ).then(imported => {
      expect(imported).to.be.true;
    });
  });
});