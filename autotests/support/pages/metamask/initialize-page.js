const welcomePage = '.welcome-page';
const getStartedButton = `${welcomePage} .first-time-flow__button`;
module.exports.welcomePageElements = {
  welcomePage,
  getStartedButton,
};

const selectActionPage = '.first-time-flow';
const importWalletButton = `${selectActionPage} .select-action__select-button:nth-child(1) .first-time-flow__button`;
module.exports.selectActionPageElements = {
  selectActionPage,
  importWalletButton,
};

const metametricsOptInPage = '.metametrics-opt-in';
const noThanksButton = `${metametricsOptInPage} [data-testid="page-container-footer-cancel"]`;
module.exports.metametricsOptInPageElements = {
  metametricsOptInPage,
  noThanksButton,
};

const importWithSeedPhrasePage = '.first-time-flow__import';
const secretWord0 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-0"]`;
const secretWord1 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-1"]`;
const secretWord2 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-2"]`;
const secretWord3 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-3"]`;
const secretWord4 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-4"]`;
const secretWord5 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-5"]`;
const secretWord6 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-6"]`;
const secretWord7 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-7"]`;
const secretWord8 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-8"]`;
const secretWord9 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-9"]`;
const secretWord10 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-10"]`;
const secretWord11 = `${importWithSeedPhrasePage} [data-testid="import-srp__srp-word-11"]`;
const newPasswordInput = `${importWithSeedPhrasePage} #password`;
const confirmPasswordInput = `${importWithSeedPhrasePage} #confirm-password`;
const termsCheckbox = `${importWithSeedPhrasePage} [data-testid="create-new-vault__terms-checkbox"]`;
const importButton = `${importWithSeedPhrasePage} .create-new-vault__submit-button`;
module.exports.importWithSeedPhrasePageElements = {
  secretWord0,
  secretWord1,
  secretWord2,
  secretWord3,
  secretWord4,
  secretWord5,
  secretWord6,
  secretWord7,
  secretWord8,
  secretWord9,
  secretWord10,
  secretWord11,
  newPasswordInput,
  confirmPasswordInput,
  termsCheckbox,
  importButton,
};

const endOfFlowPage = '.end-of-flow';
const allDoneButton = `${endOfFlowPage} .first-time-flow__button`;
module.exports.endOfFlowPageElements = {
  endOfFlowPage,
  allDoneButton,
};