import mainPage from '../support/pages/main-page';
import modals from '../support/pages/modals';
import url from '../support/pages/url';

describe('98 - Prod issues', () => {

  beforeEach('Visit GSWAP', () => {
    cy.visit(Cypress.env('gswapHost'));
    url.gswapUrlCheck('56');
    mainPage.tradeButton().eq(0).click();
    url.gswapSwapUrlCheck('56');
    cy.functions.acceptCookes();
  });

  it('PI9 - Gswap. Подгрузка языков', () => {

    const tabs = ['swap', 'pool', 'migrate'];
    const languages = ['en', 'jp', 'cn', 'ru', 'es', 'vie'];
    const keys = ['button', 'class', 'input', 'data-id', 'aria-label', 'role'];

    tabs.forEach((tab) => {
      mainPage.tabButton(tab).click();
      languages.forEach((language) => {
        mainPage.switchLanguageButton().click();
        mainPage.selectLanguageButton(language).click();
        keys.forEach((key) => {
          cy.get('body').should('not.contain', key);
        });
      });
    });
  });

  it('PI7 - Gswap. Проверка 18 decimals в инпуте / PI10 - Gswap. Проверка корректности введённых десятичных чисел', () => {

    const bscTokensFrom = ['BNB', 'GRVX', 'DAI', 'BUSD', 'USDT', 'USDC'];
    const bscTokensTo = ['GRVS', 'GRVX', 'DAI', 'BUSD', 'USDT', 'USDC'];
    const fromToken = 'BNB';
    const toToken = 'GRVS';
    const numDec_0 = cy.functions.randomAmount({ minNum: 1, maxNum: 10, minDec: 0, maxDec: 0 });
    const numDec_1 = cy.functions.randomAmount({ minNum: 1, maxNum: 10, minDec: 1, maxDec: 1 });
    const numDec_2_17 = cy.functions.randomAmount({ minNum: 1, maxNum: 10, minDec: 2, maxDec: 17 });
    const numDec_18 = cy.functions.randomAmount({ minNum: 1, maxNum: 10, minDec: 18, maxDec: 18 });
    const numDec_19 = cy.functions.randomAmount({ minNum: 1, maxNum: 10, minDec: 19, maxDec: 19 });

    const selectInputToken = (token) => {
      mainPage.fromButton().click();
      mainPage.inputTokenSearch().type(token);
      mainPage.tokenName(token).click({ force: true });
    };

    const selectOutputToken = (token) => {
      mainPage.toButton().click();
      mainPage.inputTokenSearch().type(token);
      mainPage.tokenName(token).click({ force: true });
    };

    const checkDecimalsFrom = (numDec, error) => {
      mainPage.fromInput().clear().type(numDec);
      bscTokensFrom.forEach((token) => {
        mainPage.fromButton().click();
        mainPage.inputTokenSearch().type(token);
        mainPage.tokenName(token).click({ force: true });
        mainPage.fromInput().invoke('val').should('eq', numDec);
        if (!error) {
          mainPage.tokenPrice().should('exist').and('contain', `${token} per ${toToken}`);
          mainPage.swapButton().should('exist').and('not.have.text', 'Invalid decimals');
        } else {
          mainPage.tokenPrice().should('not.exist');
          mainPage.swapButton().should('exist').and('have.text', 'Invalid decimals');
        }
      });
    };

    const checkDecimalsTo = (numDec, error) => {
      mainPage.toInput().clear().type(numDec);
      bscTokensTo.forEach((token) => {
        mainPage.toButton().click();
        mainPage.inputTokenSearch().type(token);
        mainPage.tokenName(token).click({ force: true });
        mainPage.toInput().invoke('val').should('eq', numDec);
        if (!error) {
          mainPage.tokenPrice().should('exist').and('contain', `${fromToken} per ${token}`);
          mainPage.swapButton().should('exist').and('not.have.text', 'Invalid decimals');
        } else {
          mainPage.tokenPrice().should('not.exist');
          mainPage.swapButton().should('exist').and('have.text', 'Invalid decimals');
        }
      });
    };

    cy.functions.connectMetamask();
    mainPage.revertButton().click();
    selectOutputToken(toToken);
    checkDecimalsFrom(numDec_0);
    checkDecimalsFrom(numDec_1);
    checkDecimalsFrom(numDec_2_17);
    checkDecimalsFrom(numDec_18);
    checkDecimalsFrom(numDec_19, 'error');

    mainPage.revertButton().click();
    selectInputToken(fromToken);
    checkDecimalsTo(numDec_0);
    checkDecimalsTo(numDec_1);
    checkDecimalsTo(numDec_2_17);
    checkDecimalsTo(numDec_18);
    checkDecimalsTo(numDec_19, 'error');
  });

  it('PI12 - Gswap. Просмотр транзакций в explorer / PI11 - Gswap. Проверка модального окна из SendTransactions', () => {

    const inputToken = 'BNB';
    const outputToken = 'USDT';

    const confirmSwap = () => {
      mainPage.swapButton().should('exist').click();
      modals.transConfirmModal().should('exist');
      modals.transConfirmModalConfirmSwapButton().click();
      modals.confirmPendingModal().should('exist');
      cy.confirmTransaction().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      modals.confirmPendingModal().should('not.exist');
      cy.functionsApi.getTransactionFee();
    };

    cy.functions.connectMetamask();
    mainPage.fromTokenBalance()
      .should('exist')
      .invoke('text')
      .then((value) => {
        cy.wrap(parseFloat(value.split(' ')[1])).should('be.gt', 0);
        mainPage.fromInput().clear().type((parseFloat(value.split(' ')[1]) / 10).toFixed(18));
      });
    mainPage.toButton().click();
    mainPage.inputTokenSearch().type(outputToken);
    mainPage.tokenName(outputToken).click({ force: true });
    mainPage.tokenPrice().should('exist').and('contain', `${inputToken} per ${outputToken}`);
    confirmSwap();
    modals.submitSwapModalCheckUrl();
    modals.submitSwapModal().should('not.exist');
    modals.popupCheckUrl();
    modals.popup().should('not.exist');
    cy.get('@hashModal').then((hashModalFirstTrans) => {
      cy.get('@hashPopup').then((hashPopupFirstTrans) => {
        expect(hashModalFirstTrans).to.eq(hashPopupFirstTrans);
        confirmSwap();
        modals.submitSwapModalCheckUrl();
        modals.submitSwapModal().should('not.contain', hashModalFirstTrans);
        modals.submitSwapModal().should('not.exist');
        modals.popupCheckUrl();
        modals.popup().should('not.contain', hashPopupFirstTrans);
        modals.popup().should('not.exist');
        cy.get('@hashModal').then((hashModalSecondTrans) => {
          cy.get('@hashPopup').then((hashPopupSecondTrans) => {
            expect(hashModalSecondTrans).to.eq(hashPopupSecondTrans);
            // обратный обмен
            mainPage.revertButton().click();
            mainPage.fromMaxButton().click();
            confirmSwap();
            modals.submitSwapModalCheckUrl();
            modals.submitSwapModal().should('not.contain', hashModalFirstTrans);
            modals.submitSwapModal().should('not.contain', hashModalSecondTrans);
            modals.submitSwapModal().should('not.exist');
            modals.popupCheckUrl();
            modals.popup().should('not.contain', hashPopupFirstTrans);
            modals.popup().should('not.contain', hashPopupSecondTrans);
            modals.popup().should('not.exist');
            cy.get('@hashModal').then((hashModalThirdTrans) => {
              cy.get('@hashPopup').then((hashPopupThirdTrans) => {
                expect(hashModalThirdTrans).to.eq(hashPopupThirdTrans);
                mainPage.accountButton().click();
                modals.accountModalTransactionHistoryButton().click();
                modals.recentTransModal()
                  .find('a')
                  .eq(2)
                  .should('have.attr', 'href')
                  .and('contain', `https://bscscan.com/tx/${hashModalFirstTrans}`)
                  .then((href) => {
                    cy.request(href).then((response) => {
                      expect(response.status).to.eq(200);
                    });
                  });
                modals.recentTransModal()
                  .find('a')
                  .eq(1)
                  .should('have.attr', 'href')
                  .and('contain', `https://bscscan.com/tx/${hashModalSecondTrans}`)
                  .then((href) => {
                    cy.request(href).then((response) => {
                      expect(response.status).to.eq(200);
                    });
                  });
                modals.recentTransModal()
                  .find('a')
                  .eq(0)
                  .should('have.attr', 'href')
                  .and('contain', `https://bscscan.com/tx/${hashModalThirdTrans}`)
                  .then((href) => {
                    cy.request(href).then((response) => {
                      expect(response.status).to.eq(200);
                    });
                  });
              });
            });
          });
        });
      });
    });
  });

  it('PI13 - Gswap. Проверка функционала при вводе значения в поле To', () => {

    const inputToken = 'BNB';
    const outputToken = 'GRVS';
    const outputTokenAmount = '10';

    cy.functions.connectMetamask();
    mainPage.toButton().click();
    mainPage.inputTokenSearch().type(outputToken);
    mainPage.tokenName(outputToken).click({ force: true });
    mainPage.toInput().clear().type(outputTokenAmount);
    mainPage.spinner().should('not.exist');
    mainPage.fromInput()
      .invoke('val')
      .should('not.eq', '')
      .then((value) => {
        cy.wrap(parseFloat(value)).should('be.gt', 0);
      });
    mainPage.tokenPrice().should('exist').and('contain', `${inputToken} per ${outputToken}`);
    mainPage.swapButton().should('exist').click();
    modals.transConfirmModal().should('exist');
  });

});