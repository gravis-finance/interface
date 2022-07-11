import { defineConfig } from 'cypress';
import path from 'path';
import allureWriter from "@shelex/cypress-allure-plugin/writer";
import metamask from './autotests/support/metamask';

module.exports = defineConfig({
  e2e: {
    fileServerFolder: 'autotests',
    supportFile: 'autotests/support/e2e.js',
    specPattern: 'autotests/e2e/**/*.cy.js',
    downloadsFolder: 'autotests/downloads',
    fixturesFolder: 'autotests/fixtures',
    screenshotsFolder: 'autotests/screenshots',
    videosFolder: 'autotests/videos',
    chromeWebSecurity: true,
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    
    setupNodeEvents(on, config) {

      allureWriter(on, config);

      on('before:browser:launch', async (browser = {}, arguments_) => {

        if (browser.name === 'chrome') {
          arguments_.args.push(
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
          );
        }

        const projectDirectory = path.resolve(__dirname);
        const metamaskDirectory = path.join(projectDirectory, 'autotests/support/downloads/metamask');
        arguments_.extensions.push(metamaskDirectory);
        
        return arguments_;
      });
    
      on('task', {
        setupMetamask: async ({ secretWords, password }) => {
          const setup = await metamask.setupMetamask({ secretWords, password });
          return setup;
        },
        addNetwork: async (network) => {
          const networkAdded = await metamask.addNetwork(network);
          return networkAdded;
        },
        importAccount: async privateKey => {
          const imported = await metamask.importAccount(privateKey);
          return imported;
        },
        importToken: async (tokenName, tokenAddress) => {
          const imported = await metamask.importToken(tokenName, tokenAddress);
          return imported;
        },
        connectMetamask: async () => {
          const connected = await metamask.connectMetamask();
          return connected;
        },
        disconnectMetamask: async () => {
          const disconnected = await metamask.disconnectMetamask();
          return disconnected;
        },
        cancelChangeNetwork: async () => {
          const allowed = await metamask.cancelChangeNetwork();
          return allowed;
        },
        approveChangeNetwork: async (addNetwork) => {
          const allowed = await metamask.approveChangeNetwork(addNetwork);
          return allowed;
        },
        confirmTransaction: async gasConfig => {
          const confirmed = await metamask.confirmTransaction(gasConfig);
          return confirmed;
        },
        changeNetwork: async network => {
          const networkChanged = await metamask.changeNetwork(network);
          return networkChanged;
        },
      });
     
      return config;
    },
  },
});
