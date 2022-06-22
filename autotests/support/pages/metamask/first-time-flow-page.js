const app = '#app-content .app';
const welcomePage = '.welcome-page';
const confirmButton = `${welcomePage} .first-time-flow__button`;
module.exports.welcomePageElements = {
  app,
  welcomePage,
  confirmButton,
};

const firstTimeFlowPage = '.first-time-flow';
const importWalletButton = `${firstTimeFlowPage} .select-action__select-button:nth-child(1) .first-time-flow__button`;
const createWalletButton = `${firstTimeFlowPage} .select-action__select-button:nth-child(2) .first-time-flow__button`;
module.exports.firstTimeFlowPageElements = {
  firstTimeFlowPage,
  importWalletButton,
  createWalletButton,
};

const metametricsPage = '.metametrics-opt-in';
const optOutAnalyticsButton = `${metametricsPage} [data-testid="page-container-footer-cancel"]`;
module.exports.metametricsPageElements = {
  metametricsPage,
  optOutAnalyticsButton,
};

const firstTimeFlowFormPage = '.create-new-vault__form';
const secretWord0 = `${firstTimeFlowFormPage} #import-srp__srp-word-0`;
const secretWord1 = `${firstTimeFlowFormPage} #import-srp__srp-word-1`;
const secretWord2 = `${firstTimeFlowFormPage} #import-srp__srp-word-2`;
const secretWord3 = `${firstTimeFlowFormPage} #import-srp__srp-word-3`;
const secretWord4 = `${firstTimeFlowFormPage} #import-srp__srp-word-4`;
const secretWord5 = `${firstTimeFlowFormPage} #import-srp__srp-word-5`;
const secretWord6 = `${firstTimeFlowFormPage} #import-srp__srp-word-6`;
const secretWord7 = `${firstTimeFlowFormPage} #import-srp__srp-word-7`;
const secretWord8 = `${firstTimeFlowFormPage} #import-srp__srp-word-8`;
const secretWord9 = `${firstTimeFlowFormPage} #import-srp__srp-word-9`;
const secretWord10 = `${firstTimeFlowFormPage} #import-srp__srp-word-10`;
const secretWord11 = `${firstTimeFlowFormPage} #import-srp__srp-word-11`;
const passwordInput = `${firstTimeFlowFormPage} #password`;
const confirmPasswordInput = `${firstTimeFlowFormPage} #confirm-password`;
const termsCheckbox = `${firstTimeFlowFormPage} #create-new-vault__terms-checkbox`;
const importButton = `${firstTimeFlowFormPage} .create-new-vault__submit-button`;
const newPasswordInput = `${firstTimeFlowFormPage} #create-password`;
const newSignupCheckbox = `${firstTimeFlowFormPage} .first-time-flow__checkbox`;

module.exports.firstTimeFlowFormPageElements = {
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
  passwordInput,
  confirmPasswordInput,
  termsCheckbox,
  importButton,
  newPasswordInput,
  newSignupCheckbox,
};

const secureYourWalletPage = '.seed-phrase-intro';
const nextButton = `${secureYourWalletPage} button`;
module.exports.secureYourWalletPageElements = {
  secureYourWalletPage,
  nextButton,
};

const endOfFlowPage = '.end-of-flow';
const allDoneButton = `${endOfFlowPage} .first-time-flow__button`;
module.exports.endOfFlowPageElements = {
  endOfFlowPage,
  allDoneButton,
};

const revealSeedPage = '.reveal-seed-phrase';
const remindLaterButton = `${revealSeedPage} .first-time-flow__button`;
module.exports.revealSeedPageElements = {
  revealSeedPage,
  remindLaterButton,
};
