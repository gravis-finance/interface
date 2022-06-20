import puppeteer from 'puppeteer-core';
import fetch from 'node-fetch';

let puppeteerBrowser;
let cypressWindow;
let metamaskWindow;

module.exports = {
  cypressWindow: () => {
    return cypressWindow;
  },
  metamaskWindow: () => {
    return metamaskWindow;
  },
  init: async () => {
    const debuggerDetails = await fetch('http://localhost:9222/json/version');
    const debuggerDetailsConfig = await debuggerDetails.json();
    const {webSocketDebuggerUrl} = debuggerDetailsConfig;

    puppeteerBrowser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl,
      ignoreHTTPSErrors: true,
      defaultViewport: null,
    });
    return puppeteerBrowser.isConnected();
  },
  assignWindows: async () => {
    const pages = await puppeteerBrowser.pages();
    // eslint-disable-next-line no-restricted-syntax
    for (const page of pages) {
      if (page.url().includes('specs')) {
        cypressWindow = page;
      } else if (page.url().includes('extension')) {
        metamaskWindow = page;
      }
    }
    return true;
  },
  switchToCypressWindow: async () => {
    await cypressWindow.bringToFront();
    return true;
  },
  switchToMetamaskWindow: async () => {
    await metamaskWindow.bringToFront();
    return true;
  },
  switchToMetamaskNotification: async () => {
    await module.exports.metamaskWindow().waitForTimeout(3000);
    const pages = await puppeteerBrowser.pages();
    // eslint-disable-next-line no-restricted-syntax
    for (const page of pages) {
      if (page.url().includes('notification')) {
        await page.bringToFront();
        return page;
      }
    }
    return true;
  },
  waitFor: async (selector, page = metamaskWindow) => {
    await page.waitForFunction(
      `document.querySelector('${selector}') && document.querySelector('${selector}').clientHeight != 0`,
      { visible: true },
    );
    await page.waitForTimeout(300);
  },
  waitAndClick: async (selector, page = metamaskWindow, numberOfClicks) => {
    await module.exports.waitFor(selector, page);
    if (numberOfClicks) {
      let i = 0;
      while (i < numberOfClicks) {
        i++;
        await page.evaluate(
          // eslint-disable-next-line @typescript-eslint/no-shadow
          selector => document.querySelector(selector).click(),
          selector,
        );
      }
    } else {
      await page.evaluate(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        selector => document.querySelector(selector).click(),
        selector,
      );
    }
  },
  waitAndType: async (selector, value, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const element = await page.$(selector);
    await element.type(value);
  },
  waitForText: async (selector, text, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    await page.waitForFunction(
      `document.querySelector('${selector}').innerText.toLowerCase().includes('${text.toLowerCase()}')`,
    );
  },
};