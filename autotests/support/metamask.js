import puppeteer from './puppeteer';

import {  welcomePageElements,
          firstTimeFlowPageElements,
          metametricsPageElements,
          firstTimeFlowFormPageElements,
          endOfFlowPageElements } from './pages/metamask/first-time-flow-page';
import {  mainPageElements } from './pages/metamask/main-page';
import {  unlockPageElements } from './pages/metamask/unlock-page';
import {  connectPageElements,
          permissionsPageElements } from './pages/metamask/connect-page';
import {  settingsPageElements,
          networksPageElements,
          addNetworkPageElements } from './pages/metamask/settings-page';

module.exports = {
  fixBlankPage: async () => {
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    for (let times = 0; times < 5; times++) {
      if (
        (await puppeteer.metamaskWindow().$(welcomePageElements.app)) === null
      ) {
        await puppeteer.metamaskWindow().reload();
        await puppeteer.metamaskWindow().waitForTimeout(2000);
      } else {
        break;
      }
    }
  },
  confirmWelcomePage: async () => {
    await module.exports.fixBlankPage();
    await puppeteer.waitAndClick(welcomePageElements.confirmButton);
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
  unlock: async password => {
    await module.exports.fixBlankPage();
    await puppeteer.waitAndType(unlockPageElements.passwordInput, password);
    await puppeteer.waitAndClick(unlockPageElements.unlockButton);
    await puppeteer.waitFor(mainPageElements.walletOverview);
    await module.exports.closePopup();
    return true;
  },
  importWallet: async (secretWords, password) => {
    const secretWordsArray = secretWords.split(' ');
    await puppeteer.waitAndClick(firstTimeFlowPageElements.importWalletButton);
    await puppeteer.waitAndClick(metametricsPageElements.optOutAnalyticsButton);
    // type secret words
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord0, secretWordsArray[0]);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord1, secretWordsArray[1]);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord2, secretWordsArray[2]);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord3, secretWordsArray[3]);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord4, secretWordsArray[4]);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord5, secretWordsArray[5]);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord6, secretWordsArray[6]);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord7, secretWordsArray[7]);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord8, secretWordsArray[8]);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord9, secretWordsArray[9]);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord10, secretWordsArray[10]);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.secretWord11, secretWordsArray[11]);
    // type password
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.passwordInput, password);
    await puppeteer.waitAndType(firstTimeFlowFormPageElements.confirmPasswordInput, password);
    
    await puppeteer.waitAndClick(firstTimeFlowFormPageElements.termsCheckbox);
    await puppeteer.waitAndClick(firstTimeFlowFormPageElements.importButton);
    await puppeteer.waitAndClick(endOfFlowPageElements.allDoneButton);
    await puppeteer.waitFor(mainPageElements.walletOverview);
    await module.exports.closePopup();
    return true;
  },
  setupMetamask: async ({ secretWords, password }) => {
    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    if (
      (await puppeteer.metamaskWindow().$(unlockPageElements.unlockPage)) ===
      null
    ) {
      await module.exports.confirmWelcomePage();
      await module.exports.importWallet(secretWords, password);
      await puppeteer.switchToCypressWindow();
      return true;
    } 
      await module.exports.unlock(password);
      await puppeteer.switchToCypressWindow();
    return true;
  },
  async connectMetamask() {
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.pageReload();
    await puppeteer.waitAndClick(connectPageElements.nextButton);
    await puppeteer.waitAndClick(permissionsPageElements.connectButton);
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  async disconnectMetamask() {
    await puppeteer.switchToMetamaskWindow();

    await puppeteer.waitAndClick(mainPageElements.optionsMenu.button);
    await puppeteer.waitAndClick(mainPageElements.optionsMenu.connectedSitesButton);
    await puppeteer.waitAndClick(mainPageElements.connectedSites.disconnectLink);
    await puppeteer.waitAndClick(mainPageElements.connectedSites.disconnectButton);

    if ((await puppeteer.metamaskWindow().$(mainPageElements.connectedSites.modal)) !== null) {
      await puppeteer.waitAndClick(mainPageElements.connectedSites.closeButton);
    }

    await puppeteer.switchToCypressWindow();
    return true;
  },
  addNetwork: async network => {
    await puppeteer.switchToMetamaskWindow();

    await puppeteer.waitAndClick(mainPageElements.accountMenu.button);
    await puppeteer.waitAndClick(mainPageElements.accountMenu.settingsButton);
    await puppeteer.waitAndClick(settingsPageElements.networksButton);
    await puppeteer.waitAndClick(networksPageElements.addNetworkButton);
    // type network settings
    await puppeteer.waitAndType(addNetworkPageElements.networkNameInput,network.networkName);
    await puppeteer.waitAndType(addNetworkPageElements.rpcUrlInput,network.rpcUrl);
    await puppeteer.waitAndType(addNetworkPageElements.chainIdInput, network.chainId);

    if (network.symbol) {
      await puppeteer.waitAndType(addNetworkPageElements.symbolInput, network.symbol);
    }

    if (network.blockExplorer) {
      await puppeteer.waitAndType(addNetworkPageElements.blockExplorerInput, network.blockExplorer);
    }

    await puppeteer.waitEnabledAndClick(addNetworkPageElements.saveButton);

    await puppeteer.waitForText(
      mainPageElements.networkSwitcher.networkName,
      network.networkName,
    );

    await puppeteer.switchToCypressWindow();
    return true;
  },
};