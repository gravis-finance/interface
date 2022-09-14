// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('setupMetamask', (secretWords, password) => {
  return cy.task('setupMetamask', { secretWords, password });
});

Cypress.Commands.add('addNetwork', network => {
  return cy.task('addNetwork', network);
});

Cypress.Commands.add('importAccount', privateKey => {
  return cy.task('importAccount', privateKey);
});

Cypress.Commands.add('importToken', (tokenName, tokenAddress) => {
  return cy.task('importToken', { tokenName, tokenAddress });
});

Cypress.Commands.add('connectMetamask', () => {
  return cy.task('connectMetamask');
});

Cypress.Commands.add('disconnectMetamask', () => {
  return cy.task('disconnectMetamask');
});

Cypress.Commands.add('cancelChangeNetwork', () => {
  return cy.task('cancelChangeNetwork');
});

Cypress.Commands.add('approveChangeNetwork', () => {
  return cy.task('approveChangeNetwork');
});

Cypress.Commands.add('confirmTransaction', () => {
  return cy.task('confirmTransaction');
});

Cypress.Commands.add('changeNetwork', network => {
  return cy.task('changeNetwork', network);
});
