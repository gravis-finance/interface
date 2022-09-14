import web3 from 'web3';

describe('99 - Gas fee calculate', () => {

  it(`Calculate gas fee`, () => {
    cy.functionsApi.getBnbAmount();
    cy.functionsApi.getUsdtAmount();
    cy.functionsApi.getGasPrice();
    cy.writeFile(Cypress.env('allurePropertiesFile'), '');
    cy.readFile(Cypress.env('feeFile')).then((data) => {
      let totalGasUsed = BigInt(0);
      let totalGasFee = BigInt(0);
      for (let i = 0; i < data.length; i++) {
        totalGasUsed += BigInt(data[i].gasUsed);
        totalGasFee += BigInt(data[i].gasFee);
      }
      cy.get('@amountBnbBlockchain').then((amountBnbBlockchain) => {
        cy.get('@amountUsdtBlockchain').then((amountUsdtBlockchain) => {
          cy.get('@usdPrice').then((usdPrice) => {
            cy.writeFile(Cypress.env('allurePropertiesFile'), `Balance_BNB: ${String(web3.utils.fromWei(amountBnbBlockchain))}\n`, { flag: 'a+' });
            cy.writeFile(Cypress.env('allurePropertiesFile'), `Balance_USDT: ${String(web3.utils.fromWei(amountUsdtBlockchain))}\n`, { flag: 'a+' });
            cy.writeFile(Cypress.env('allurePropertiesFile'), `Number_of_swap_tests: ${String(data.length)}\n`, { flag: 'a+' });
            cy.writeFile(Cypress.env('allurePropertiesFile'), `Gas_price: ${String(web3.utils.fromWei((data[0].gasPrice).toString(), 'ether'))}\n`, { flag: 'a+' });
            cy.writeFile(Cypress.env('allurePropertiesFile'), `Total_gas_used: ${String(totalGasUsed)}\n`, { flag: 'a+' });
            cy.writeFile(Cypress.env('allurePropertiesFile'), `Total_gas_fee: ${String(web3.utils.fromWei(totalGasFee.toString(), 'ether'))}\n`, { flag: 'a+' });
            cy.writeFile(Cypress.env('allurePropertiesFile'), `Total_gas_fee_USD: ${String(web3.utils.fromWei((totalGasFee * BigInt(usdPrice.split('.')[0])).toString(), 'ether'))}\n`, { flag: 'a+' });
          });
        });
      });
    });
  });
});