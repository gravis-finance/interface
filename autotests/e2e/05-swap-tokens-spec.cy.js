/* eslint-disable cypress/no-unnecessary-waiting */
import web3 from 'web3';

import mainPage from '../support/pages/main-page';
import modals from '../support/pages/modals';

const checkMaxBnb = () => {
  mainPage.fromTokenBalance().should('be.visible');
  mainPage.fromMaxButton().click();
  mainPage.fromInput().invoke('val').then((amountBnbGswap) => {
    cy.functionsApi.getBnbAmount();
    cy.get('@amountBnbBlockchain').then((amountBnbBlockchain) => {
      expect(amountBnbBlockchain).to.be.equal(web3.utils.toWei(amountBnbGswap, 'ether'));
    });
  });
}

const checkMaxUsdt = () => {
  mainPage.revertButton().click();
  mainPage.fromButton().click();
  mainPage.inputTokenSearch().type('USDT');
  mainPage.tokenName('USDT').click({ force: true });
  mainPage.fromTokenBalance().should('be.visible');
  mainPage.fromMaxButton().click();
  mainPage.fromInput().invoke('val').then((amountUsdtGswap) => {
    cy.functionsApi.getUsdtAmount();
    cy.get('@amountUsdtBlockchain').then((amountUsdtBlockchain) => {
      expect(amountUsdtBlockchain).to.be.equal(web3.utils.toWei(amountUsdtGswap, 'ether'));
    });
  });
}

const swapTokens = (swap, min, max, dec) => {
  mainPage.fromTokenBalance().should('be.visible');
  if (swap === 'bnbToUsdt') {
    mainPage.toButton().click();
    mainPage.inputTokenSearch().type('USDT');
    mainPage.tokenName('USDT').click({ force: true });
  }
  if (swap === 'usdtToBnb') { 
    mainPage.revertButton().click();
    mainPage.fromButton().click();
    mainPage.inputTokenSearch().type('USDT');
    mainPage.tokenName('USDT').click({ force: true });
  }
  cy.functionsApi.getBnbAmount();
  cy.get('@amountBnbBlockchain').then((amountBnbBlockchainBefore) => {
    cy.functionsApi.getUsdtAmount();
    cy.get('@amountUsdtBlockchain').then((amountUsdtBlockchainBefore) => {
      const amountUsdtSwap = cy.functions.randomAmountFixedDec(min, max, dec);
      if (swap === 'bnbToUsdt') {
        mainPage.toInput().type(amountUsdtSwap);
      } else if  (swap === 'usdtToBnb') {
        mainPage.fromInput().type(amountUsdtSwap);
      } else if (swap === 'usdtToBnbAll') {
        mainPage.fromTokenBalance().should('be.visible');
        mainPage.fromMaxButton().click();
      }
      mainPage.swapButton().click();
      cy.wait(2000);
      cy.get('body').then(($body) => {
        if ($body.text().includes('Price Updated')) {
          modals.confirmSwapModalAcceptPriceButton().click();
        }
      });
      modals.confirmSwapModalConfirmSwapButton().click();
      modals.confirmPendingModal().should('exist');
      cy.confirmTransaction().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      modals.submitSwapModalTransactionLink().invoke('attr','href').then((href) => {
      const transaction = href.split('/')[4];
      modals.confirmPendingModal().should('not.exist');
      modals.submitSwapModal().should('not.exist');
      modals.popup().should('exist').and('contain', 'View on BSCScan');
      modals.popup().should('not.exist');
      cy.functionsApi.getBnbAmount();
      cy.get('@amountBnbBlockchain').then((amountBnbBlockchainAfter) => {
        cy.functionsApi.getUsdtAmount();
        cy.get('@amountUsdtBlockchain').then((amountUsdtBlockchainAfter) => {
          cy.functionsApi.getTransactionAmount(transaction);
          cy.get('@transactionValue').then((transactionValue) => {
            cy.functionsApi.getTransactionFee();
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

  before(`Create file for calculate fee`, () => {
    cy.writeFile(Cypress.env('feeFile'), []);
  });

  beforeEach(`Visit stage.gswap.exchange`, () => {
    cy.visit(Cypress.env('gswapSwapStageHost'));
    cy.functions.connectMetamask();
  });

  it(`Check max BNB`, () => {
    checkMaxBnb();
  });

  it(`Swap BNB to USDT (int)`, () => {
    swapTokens('bnbToUsdt', 1, 1, 0);
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