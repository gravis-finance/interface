const settingsPage = '.settings-page';
const networksButton = `${settingsPage} button:nth-child(6)`;
module.exports.settingsPageElements = {
  settingsPage,
  networksButton,
};

const addNetworkButton = '.networks-tab__body button';
module.exports.networksPageElements = { addNetworkButton };

const networkNameInput = '.form-field:nth-child(1) .form-field__input';
const rpcUrlInput = '.form-field:nth-child(2) .form-field__input';
const chainIdInput = '.form-field:nth-child(3) .form-field__input';
const symbolInput = '.form-field:nth-child(4) .form-field__input';
const blockExplorerInput = '.form-field:nth-child(5) .form-field__input';
const saveButton = '.btn-primary';
module.exports.addNetworkPageElements = {
  networkNameInput,
  rpcUrlInput,
  chainIdInput,
  symbolInput,
  blockExplorerInput,
  saveButton,
};

const loadingModal = '.loading-overlay__error-screen';
const tryAgainButton = `${loadingModal} .btn-primary`;
module.exports.loadingModalElements = {
  loadingModal,
  tryAgainButton,
};
