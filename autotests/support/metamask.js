import puppeteer from './puppeteer';

import {  welcomePageElements,
          firstTimeFlowPageElements,
          metametricsPageElements,
          firstTimeFlowFormPageElements,
          endOfFlowPageElements } from './pages/metamask/first-time-flow-page';
import {  mainPageElements } from './pages/metamask/main-page';
import {  unlockPageElements } from './pages/metamask/unlock-page';
import {  notificationPageElements,
          permissionsPageElements } from './pages/metamask/notification-page';
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
    await puppeteer.waitAndClick(firstTimeFlowPageElements.importWalletButton);
    await puppeteer.waitAndClick(metametricsPageElements.optOutAnalyticsButton);
    await puppeteer.waitAndType(
      firstTimeFlowFormPageElements.secretWordsInput,
      secretWords,
    );
    await puppeteer.waitAndType(
      firstTimeFlowFormPageElements.passwordInput,
      password,
    );
    await puppeteer.waitAndType(
      firstTimeFlowFormPageElements.confirmPasswordInput,
      password,
    );
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
  connectMetamask: async allAccounts => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    if (allAccounts === true) {
      await puppeteer.waitAndClick(
        notificationPageElements.selectAllCheck,
        notificationPage,
      );
    }
    await puppeteer.waitAndClick(
      notificationPageElements.nextButton,
      notificationPage,
    );
    await puppeteer.waitAndClick(
      permissionsPageElements.connectButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  async disconnectMetamask() {
    await puppeteer.switchToMetamaskWindow();

    await puppeteer.waitAndClick(mainPageElements.optionsMenu.button);
    await puppeteer.waitAndClick(
      mainPageElements.optionsMenu.connectedSitesButton,
    );
    await puppeteer.waitAndClick(mainPageElements.connectedSites.trashButton);
    await puppeteer.waitAndClick(
      mainPageElements.connectedSites.disconnectButton,
    );

    if (
      (await puppeteer
        .metamaskWindow()
        .$(mainPageElements.connectedSites.modal)) !== null
    ) {
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
    await puppeteer.waitAndType(
      addNetworkPageElements.networkNameInput,
      network.networkName,
    );
    await puppeteer.waitAndType(
      addNetworkPageElements.rpcUrlInput,
      network.rpcUrl,
    );
    await puppeteer.waitAndType(
      addNetworkPageElements.chainIdInput,
      network.chainId,
    );

    if (network.symbol) {
      await puppeteer.waitAndType(
        addNetworkPageElements.symbolInput,
        network.symbol,
      );
    }

    if (network.blockExplorer) {
      await puppeteer.waitAndType(
        addNetworkPageElements.blockExplorerInput,
        network.blockExplorer,
      );
    }

    await puppeteer.waitAndClick(addNetworkPageElements.saveButton);
    await puppeteer.waitAndClick(settingsPageElements.closeButton);

    await puppeteer.waitForText(
      mainPageElements.networkSwitcher.networkName,
      network.networkName,
    );

    await puppeteer.switchToCypressWindow();
    return true;
  },
};