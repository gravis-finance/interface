import puppeteer from './puppeteer';

import {  welcomePageElements,
          selectActionPageElements, 
          metametricsOptInPageElements,
          importWithSeedPhrasePageElements,
          endOfFlowPageElements } from './pages/metamask/initialize-page';
import {  mainPageElements } from './pages/metamask/main-page';
import {  unlockPageElements } from './pages/metamask/unlock-page';
import {  permissionsPageElements } from './pages/metamask/connect-page';
import {  confirmChangeNetworkPageElements,
          confirmTransactionPageElements } from './pages/metamask/confirmation-page';
import {  settingsPageElements,
          networksPageElements,
          addNetworkPageElements,
          loadingModalElements } from './pages/metamask/settings-page';
import { pageElements } from './pages/metamask/page';

module.exports = {
  fixBlankPage: async () => {
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    for (let times = 0; times < 5; times++) {
      if ((await puppeteer.metamaskWindow().$(mainPageElements.app)) === null) {
        await puppeteer.metamaskWindow().reload();
        await puppeteer.metamaskWindow().waitForTimeout(1000);
      } else {
        break;
      }
    }
  },
  reloadPage: async (selector) => {
    await puppeteer.metamaskWindow().reload();
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    for (let times = 0; times < 5; times++) {
      if (
        (await puppeteer.metamaskWindow().$(selector)) === null
      ) {
        await puppeteer.metamaskWindow().reload();
        await puppeteer.metamaskWindow().waitForTimeout(10000);
      } else {
        break;
      }
    }
  },
  confirmWelcomePage: async () => {
    await module.exports.fixBlankPage();
    await puppeteer.waitAndClick(welcomePageElements.getStartedButton);
    return true;
  },
  closePopup: async () => {
    if (
      (await puppeteer.metamaskWindow().$(mainPageElements.popup.container)) !==
      null
    ) {
      await puppeteer.waitAndClick(mainPageElements.popup.closeButton);
    }
    return true;
  },
  unlock: async (password) => {
    await module.exports.fixBlankPage();
    await puppeteer.waitAndType(unlockPageElements.passwordInput, password);
    await puppeteer.waitAndClick(unlockPageElements.unlockButton);
    await puppeteer.waitFor(mainPageElements.app);
    await module.exports.closePopup();
    return true;
  },
  importWallet: async (secretWords, password) => {
    const secretWordsArray = secretWords.split(' ');
    await puppeteer.waitAndClick(selectActionPageElements.importWalletButton);
    await puppeteer.waitAndClick(metametricsOptInPageElements.noThanksButton);
    // type secret words
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord0, secretWordsArray[0]);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord1, secretWordsArray[1]);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord2, secretWordsArray[2]);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord3, secretWordsArray[3]);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord4, secretWordsArray[4]);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord5, secretWordsArray[5]);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord6, secretWordsArray[6]);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord7, secretWordsArray[7]);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord8, secretWordsArray[8]);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord9, secretWordsArray[9]);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord10, secretWordsArray[10]);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.secretWord11, secretWordsArray[11]);
    // type password
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.newPasswordInput, password);
    await puppeteer.waitAndType(importWithSeedPhrasePageElements.confirmPasswordInput, password);
    // accept terms
    await puppeteer.waitAndClick(importWithSeedPhrasePageElements.termsCheckbox);
    // click import
    await puppeteer.waitAndClick(importWithSeedPhrasePageElements.importButton);
    // click all done
    await puppeteer.waitAndClick(endOfFlowPageElements.allDoneButton);
    await puppeteer.waitFor(mainPageElements.app);
    // close popup
    await module.exports.closePopup();
    return true;
  },
  setupMetamask: async ({ secretWords, password }) => {
    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    if ((await puppeteer.metamaskWindow().$(unlockPageElements.unlockPage)) === null) {
      await module.exports.confirmWelcomePage();
      await module.exports.importWallet(secretWords, password);
      await puppeteer.switchToCypressWindow();
      return true;
    } 
      await module.exports.unlock(password);
      await puppeteer.switchToCypressWindow();
    return true;
  },
  addNetwork: async (network) => {
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.waitAndClick(mainPageElements.accountMenu.button);
    await puppeteer.waitAndClick(mainPageElements.accountMenu.settingsButton);
    await puppeteer.waitAndClick(settingsPageElements.networksButton);
    await puppeteer.waitAndClick(networksPageElements.addNetworkButton);
    // type network settings
    if (network.blockExplorer) {
      await puppeteer.waitAndType(addNetworkPageElements.blockExplorerInput, network.blockExplorer);
    }
    if (network.symbol) {
      await puppeteer.waitAndType(addNetworkPageElements.symbolInput, network.symbol);
    }
    await puppeteer.waitAndType(addNetworkPageElements.chainIdInput, network.chainId);
    await puppeteer.waitAndType(addNetworkPageElements.rpcUrlInput, network.rpcUrl);
    await puppeteer.waitAndType(addNetworkPageElements.networkNameInput, network.networkName);
    await puppeteer.waitAndClick(addNetworkPageElements.saveButton);
    await puppeteer.waitForText(mainPageElements.networkSwitcher.networkName, network.networkName);
    await puppeteer.waitForNotExist(pageElements.loadingSpinner);
    await puppeteer.waitForNotExist(loadingModalElements.loadingModal);
    await puppeteer.waitForText(mainPageElements.walletInfo.networkName, network.symbol);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  importAccount: async privateKey => {
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.waitAndClick(mainPageElements.accountMenu.button);
    await puppeteer.waitAndClick(mainPageElements.accountMenu.importAccountButton);
    await puppeteer.waitAndType(mainPageElements.importAccount.input, privateKey);
    await puppeteer.waitAndClick(mainPageElements.importAccount.importButton);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  importToken: async ({ tokenName, tokenAddress, tokenNewName }) => {
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.waitAndClickLink(mainPageElements.walletInfo.importTokenLink);
    await puppeteer.waitAndType(mainPageElements.importToken.tokenContractAddress, tokenAddress);
    await puppeteer.waitForValue(mainPageElements.importToken.tokenSymbol, tokenName);
    if (tokenNewName) {
      await puppeteer.waitAndClick(mainPageElements.importToken.editTokenNameButton);
      await puppeteer.waitAndClear(mainPageElements.importToken.tokenSymbol);
      await puppeteer.waitAndType(mainPageElements.importToken.tokenSymbol, tokenNewName);
    }
    await puppeteer.waitAndClick(mainPageElements.importToken.addTokenButton);
    await puppeteer.waitAndClick(mainPageElements.importToken.importTokenButton);
    await puppeteer.waitAndClick(mainPageElements.assetNavigation.backButton);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  connectMetamask: async () => {
    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.metamaskWindow().reload();
    await puppeteer.waitAndClick(permissionsPageElements.nextButton);
    await puppeteer.waitAndClick(permissionsPageElements.connectButton);
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  disconnectMetamask: async () => {
    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.waitAndClick(mainPageElements.optionsMenu.button);
    await puppeteer.waitAndClick(mainPageElements.optionsMenu.connectedSitesButton);
    await puppeteer.waitAndClick(mainPageElements.connectedSites.disconnectLink);
    await puppeteer.waitAndClick(mainPageElements.connectedSites.disconnectButton);
    if ((await puppeteer.metamaskWindow().$(mainPageElements.connectedSites.modal)) !== null) {
      await puppeteer.waitAndClick(mainPageElements.connectedSites.closeButton);
    }
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  cancelChangeNetwork: async () => {
    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.metamaskWindow().reload();
    await puppeteer.waitAndClick(confirmChangeNetworkPageElements.cancelButton);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  approveChangeNetwork: async () => {
    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.metamaskWindow().reload();
    if (!((await puppeteer.metamaskWindow().$(confirmChangeNetworkPageElements.definitionList)) === null)) {
      await puppeteer.waitAndClick(confirmChangeNetworkPageElements.approveButton);
    }
    await puppeteer.waitAndClick(confirmChangeNetworkPageElements.switchButton);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  confirmTransaction: async () => {
    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.metamaskWindow().reload();
    await module.exports.reloadPage(confirmTransactionPageElements.confirmTransactionPage);
    await puppeteer.waitForEnabled(confirmTransactionPageElements.confirmButton);
    await puppeteer.waitAndClick(confirmTransactionPageElements.confirmButton);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  rejectTransaction: async () => {
    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.metamaskWindow().reload();
    await module.exports.reloadPage(confirmTransactionPageElements.confirmTransactionPage);
    await puppeteer.waitAndClick(confirmTransactionPageElements.rejectButton);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  changeNetwork: async network => {
    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.waitAndClick(mainPageElements.networkSwitcher.button);
    await puppeteer.waitAndClickByText(mainPageElements.networkSwitcher.dropdownMenuItem, network);
    await puppeteer.waitForText(mainPageElements.networkSwitcher.networkName, network);
    await puppeteer.switchToCypressWindow();
    return true;
  },
};