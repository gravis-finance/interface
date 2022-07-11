const confirmChangeNetworkPage = '.confirmation-page';
const definitionList = `${confirmChangeNetworkPage} .definition-list`;
const cancelButton = `${confirmChangeNetworkPage} .btn-secondary`;
const approveButton = `${confirmChangeNetworkPage} .btn-primary`;
const switchButton = `${confirmChangeNetworkPage} .btn-primary`;
module.exports.confirmChangeNetworkPageElements = {
  confirmChangeNetworkPage,
  definitionList,
  cancelButton,
  approveButton,
  switchButton,
};

const confirmTransactionPage = '.page-container';
const containerSummary = `${confirmTransactionPage} .confirm-page-container-summary`;
const confirmButton = `${confirmTransactionPage} [data-testid="page-container-footer-next"]`;
const currencyDisplay = `${containerSummary} .currency-display-component`;
const senderName = `${confirmTransactionPage} .sender-to-recipient__party--sender`;
module.exports.confirmTransactionPageElements = {
  confirmTransactionPage,
  containerSummary,
  confirmButton,
  currencyDisplay,
  senderName,
};