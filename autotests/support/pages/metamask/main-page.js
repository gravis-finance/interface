const app = '#app-content';

const popup = {
  container: '.popover-container',
  closeButton: '.popover-header__button',
};

const accountMenu = {
  button: '.account-menu__icon',
  importAccountButton: '.account-menu__item--clickable:nth-child(7)',
  settingsButton: '.account-menu__item--clickable:nth-child(11)',
};

const networkSwitcher = {
  button: '.network-display',
  dropdownMenuItem: '.dropdown-menu-item',
  networkName: '.typography',
};

const walletInfoSelector = '.home__main-view';
const walletInfo = {
  accountName: `${walletInfoSelector} .selected-account__name`,
  importTokenLink: `${walletInfoSelector} .import-token-link__link`,
  networkName: `${walletInfoSelector} .currency-display-component__suffix`,
};

const optionsMenu = {
  button: '[data-testid=account-options-menu-button]',
  connectedSitesButton: '[data-testid="account-options-menu__connected-sites"]',
};

const importAccountSelector = '.new-account';
const importAccount = {
  input: `${importAccountSelector} #private-key-box`,
  importButton: `${importAccountSelector} .btn-primary`,
};

const importToken = {
  tokenContractAddress: '#custom-address',
  tokenSymbol: '#custom-symbol',
  addTokenButton: '[data-testid="page-container-footer-next"]',
  importTokenButton: '.btn-primary',
};

const connectedSitesSelector = '.connected-sites';
const connectedSites = {
  modal: connectedSitesSelector,
  disconnectLink: `${connectedSitesSelector} .connected-sites-list__content-row-link-button`,
  disconnectButton: `${connectedSitesSelector} .btn-primary`,
  closeButton: `${connectedSitesSelector} [data-testid="popover-close"]`,
};

const assetNavigationSelector = '.asset-navigation';
const assetNavigation = {
  backButton: `${assetNavigationSelector} [data-testid="asset__back"]`,
};

const listTransactionsSelector = '.transaction-list-item transaction-list-item--unconfirmed';
const listTransactions = {
  transactionStatus: `${listTransactionsSelector} .transaction-status`,
};

module.exports.mainPageElements = {
  app,
  popup,
  accountMenu,
  networkSwitcher,
  walletInfo,
  optionsMenu,
  importAccount,
  importToken,
  connectedSites,
  assetNavigation,
  listTransactions,
};