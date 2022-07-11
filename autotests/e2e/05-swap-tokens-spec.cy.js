/* eslint-disable cypress/no-unnecessary-waiting */
import web3 from 'web3';

import modals from '../support/pages/gswap/modals';
import swapPage from '../support/pages/gswap/swap-page';

const checkMaxBnb = () => {
  swapPage.toButton().click();
  modals.selectTokenUsdtButton().click();
  swapPage.token1Balance().should('be.visible');
  swapPage.maxButton().click();
  swapPage.fromInput().invoke('val').then((amountBnbGswap) => {
    cy.functions.getBnbAmount();
    cy.get('@amountBnbBlockchain').then((amountBnbBlockchain) => {
      expect(amountBnbBlockchain).to.be.equal(web3.utils.toWei(amountBnbGswap, 'ether'));
    });
  });
}

const checkMaxUsdt = () => {
  swapPage.revertButton().click();
  swapPage.fromButton().click();
  modals.selectTokenUsdtButton().click();
  swapPage.token1Balance().should('be.visible');
  swapPage.maxButton().click();
  swapPage.fromInput().invoke('val').then((amountUsdtGswap) => {
    cy.functions.getUsdtAmount();
    cy.get('@amountUsdtBlockchain').then((amountUsdtBlockchain) => {
      expect(amountUsdtBlockchain).to.be.equal(web3.utils.toWei(amountUsdtGswap, 'ether'));
    });
  });
}

const swapTokens = (swap, min, max, dec) => {
  if (swap === 'bnbToUsdt') {
    swapPage.toButton().click();
    modals.selectTokenUsdtButton().click();
  } else {
    swapPage.revertButton().click();
    swapPage.fromButton().click();
    modals.selectTokenUsdtButton().click();
  }
  cy.functions.getBnbAmount();
  cy.get('@amountBnbBlockchain').then((amountBnbBlockchainBefore) => {
    cy.functions.getUsdtAmount();
    cy.get('@amountUsdtBlockchain').then((amountUsdtBlockchainBefore) => {
      const amountUsdtSwap = cy.functions.getRandomAmount(min, max, dec);
      if (swap === 'bnbToUsdt') {
        swapPage.toInput().type(amountUsdtSwap);
      } else if  (swap === 'usdtToBnb') {
        swapPage.fromInput().type(amountUsdtSwap);
      } else if (swap === 'usdtToBnbAll') {
        swapPage.token1Balance().should('be.visible');
        swapPage.maxButton().click();
      }
      swapPage.swapButton().click();
      cy.get('body').then(($body) => {
        if ($body.text().includes('Price Updated')) {
          modals.confirmSwapAcceptPriceButton().click();
        }
      });
      modals.confirmSwapConfirmSwapButton().click();
      modals.confirmPendingModal().should('exist');
      cy.confirmTransaction().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      modals.submitSwapTransactionLink().invoke('attr','href').then((href) => {
      const transaction = href.split('/')[4];
      modals.confirmPendingModal().should('not.exist');
      modals.submitSwapModal().should('not.exist');
      modals.popup().should('exist').and('contain', 'View on BSCScan');
      modals.popup().should('not.exist');
      cy.functions.getBnbAmount();
      cy.get('@amountBnbBlockchain').then((amountBnbBlockchainAfter) => {
        cy.functions.getUsdtAmount();
        cy.get('@amountUsdtBlockchain').then((amountUsdtBlockchainAfter) => {
          cy.functions.getTransactionAmount(transaction);
          cy.get('@transactionValue').then((transactionValue) => {
            cy.functions.getTransactionFee();
              cy.get('@gasFee').then((gasFee) => {
                if (swap === 'bnbToUsdt') {
                  const diffBnb = BigInt(amountBnbBlockchainBefore) - BigInt(transactionValue) - BigInt(gasFee) - BigInt(amountBnbBlockchainAfter);
                  const diffUsdt = BigInt(amountUsdtBlockchainBefore) + BigInt(web3.utils.toWei(amountUsdtSwap, 'ether')) - BigInt(amountUsdtBlockchainAfter);
                  expect(diffBnb).to.be.equal(BigInt(0));
                  expect(diffUsdt).to.be.equal(BigInt(0));
                } else if (swap === 'usdtToBnb') {
                  const diffBnb = BigInt(amountBnbBlockchainBefore) + BigInt(transactionValue) - BigInt(gasFee) - BigInt(amountBnbBlockchainAfter);
                  const diffUsdt = BigInt(amountUsdtBlockchainBefore) - BigInt(web3.utils.toWei(amountUsdtSwap, 'ether')) - BigInt(amountUsdtBlockchainAfter);
                  expect(diffBnb).to.be.equal(BigInt(0));
                  expect(diffUsdt).to.be.equal(BigInt(0));
                } else if (swap === 'usdtToBnbAll') {
                  const diffBnb = BigInt(amountBnbBlockchainBefore) + BigInt(transactionValue) - BigInt(gasFee) - BigInt(amountBnbBlockchainAfter);
                  const diffUsdt = BigInt(amountUsdtBlockchainAfter);
                  expect(diffBnb).to.be.equal(BigInt(0));
                  expect(diffUsdt).to.be.equal(BigInt(0));
                }
              });
            });
          });
        });
      });
    });
  });
}


describe('05 Swap tokens', () => {

  beforeEach(`Visit stage.gswap.exchange`, () => {
    cy.visit(Cypress.env('gswapHost'));
    cy.functions.connectMetamask();
  });

  after(`Disconnect MetaMask`, () => {
    cy.functions.disconnectGswap();
  });

  it(`Check max BNB`, () => {
    checkMaxBnb();
  });

  it(`Swap BNB to USDT (int)`, () => {
    swapTokens('bnbToUsdt', 2, 3, 0);
  });

  it(`Swap BNB to USDT (float)`, () => {
    swapTokens('bnbToUsdt', 2, 3, 7);
  });

  it(`Check max USDT`, () => {
    checkMaxUsdt();
  });

  it(`Swap USDT to BNB (int)`, () => {
    swapTokens('usdtToBnb', 1, 2, 0);
  });

  it(`Swap USDT to BNB (float)`, () => {
    swapTokens('usdtToBnb', 1, 2, 7);
  });

  it(`Swap USDT to BNB (all)`, () => {
    swapTokens('usdtToBnbAll', 0, 0, 0);
  });
});