import fs from 'fs';
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
  waitFor: async (selector, page = metamaskWindow) => {
    await page.waitForFunction(
      `document.querySelector('${selector}') && document.querySelector('${selector}').clientHeight != 0`,
      { visible: true },
    );
    await page.waitForTimeout(300);
  },
  waitAndClick: async (selector, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    await page.evaluate(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      selector => document.querySelector(selector).click(),
      selector,
    );
  },
  waitEnabledAndClick: async (selector, page = metamaskWindow) => {
    await page.waitForFunction(
      `document.querySelector('${selector}') && document.querySelector('${selector}').clientHeight != 0`,
      { enabled: true },
    );
    await page.evaluate(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      selector => document.querySelector(selector).click(),
      selector,
    );
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
  pageReload: async (page = metamaskWindow) => {
    await page.reload();
  },
  pageScreenshot: async (page = metamaskWindow) => {
    if (!fs.existsSync('puppeteer-screenshots')) {
      fs.mkdirSync('puppeteer-screenshots');
    }
    await page.screenshot({
      path: `./puppeteer-screenshots/screenshot-${Date.now()}.png`,
      fullPage: true
    });
  },
};