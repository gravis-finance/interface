import puppeteer from 'puppeteer'

const APP = process.env.SECRET_URL
const MAIN_URL = process.env.MAIN_URL || 'https://dev.gswap.exchange/'
const METAMASK_WORDS = process.env.METAMASK_WORDS
const BB_SECRET_URL = process.env.BB_SECRET_URL
const BB_URL = process.env.BB_URL

let browser;
let page;
const width = 800
const height = 900

const addWalletToMetamask = async (secretWords) => {
  page = await browser.newPage()
  await page.waitForTimeout(1500)
  await page.bringToFront()

  await page.goto('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome')
  await page.click('.first-time-flow__button')
  await page.waitForSelector('.first-time-flow__button')
  await page.click('.first-time-flow__button:first-of-type') //
  await page.waitForSelector('.btn-primary.page-container__footer-button')
  await page.click('.btn-primary.page-container__footer-button')
  await page.waitForSelector('.MuiInputBase-input.MuiInput-input')
  await page.click('.first-time-flow__checkbox.first-time-flow__terms')

  await page.focus('.MuiInputBase-input.MuiInput-input')
  await page.keyboard.sendCharacter(secretWords)

  await page.focus('[autocomplete="new-password"]')
  await page.keyboard.sendCharacter('testPasswordForMetamask')

  await page.focus('[autocomplete="confirm-password"]')
  await page.keyboard.sendCharacter('testPasswordForMetamask')

  await page.waitForTimeout(1000)
  await page.click('.first-time-flow__button')

  await page.waitForSelector('.first-time-flow__button')
  await page.click('.first-time-flow__button')
}

// TODO implement switching networks (there is problem with metamask page open)
const switchNetwork = async (netName) => {
  await page.waitForSelector('#network-switch-dropdown')
  await page.click('#network-switch-dropdown')
  // const newPagePromise = new Promise<puppeteer.Page>(x => browser.once('targetcreated', target => x(target.page())));
  await page.click(`#${netName}-switch-option`)
  // const metamaskPage = await newPagePromise;

  // await metamaskPage.waitForSelector('.btn-primary')
  // await metamaskPage.click('.btn-primary')
}

jest.setTimeout(300000)

beforeAll(async (done) => {
  const paths = `${__dirname}/extension/9.5.1_0`
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    args: [`--window-size=${width},${height}`, `--load-extension=${paths}`, `--disable-extensions-except=${paths}`],
  })

  await addWalletToMetamask(METAMASK_WORDS)

  await page.goto(APP, {
    waitUntil: 'networkidle0',
  })

  done()
})

afterAll((done) => {
  if (browser) browser.close()
  done()
})


describe('Metamask test', () => {
  it('connect to metamask', async (done) => {
    await page.goto(MAIN_URL, {
      waitUntil: 'networkidle0',
    })
    await page.waitForSelector('[role="presentation"]')
    await page.click('[data-id="connect-button"]')

    const newPagePromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('#wallet-connect-metamask')
    await page.click('#wallet-connect-metamask')
    const metamaskPage = await newPagePromise

    await metamaskPage.waitForSelector('.btn-primary')
    await metamaskPage.click('.btn-primary')

    await metamaskPage.waitForSelector('.btn-primary')
    await metamaskPage.click('.btn-primary')

    await metamaskPage.waitForSelector('.btn-primary')
    await metamaskPage.click('.btn-primary')

    await metamaskPage.waitForSelector('.btn-primary')
    await metamaskPage.click('.btn-primary')

    done()
  })

  it('create or add liquidity', async (done) => {
    await page.goto(MAIN_URL, {
      waitUntil: 'networkidle0',
    })

    await page.waitForSelector('#pool-nav-link')
    await page.click('#pool-nav-link')

    await page.waitForSelector('[data-id="join-pool-button"]')
    await page.click('[data-id="join-pool-button"]')

    await page.waitForSelector('[data-id="add-liquidity-input-tokenb-button"]')
    await page.click('[data-id="add-liquidity-input-tokenb-button"]')

    await page.waitForSelector('[data-id="token-item-USDC"]')
    await page.click('[data-id="token-item-USDC"]')

    await page.waitForSelector('[data-id="add-liquidity-input-tokenb"]')
    await page.focus('[data-id="add-liquidity-input-tokenb"]')
    await page.keyboard.type('2')

    await page.waitForSelector('[data-id="first-supply-button"]')
    await page.click('[data-id="first-supply-button"]')

    const newPagePromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('[data-id="confirm-supply-button"]')
    await page.click('[data-id="confirm-supply-button"]')
    const metamaskPage = await newPagePromise

    await metamaskPage.waitForSelector('.btn-primary')
    await metamaskPage.click('.btn-primary')

    done()
  })

  it('swap', async (done) => {
    await page.goto(MAIN_URL, {
      waitUntil: 'networkidle0',
    })

    await page.waitForSelector('[data-id="swap-currency-output-button"]')
    await page.click('[data-id="swap-currency-output-button"]')

    await page.waitForSelector('[data-id="token-item-USDC"]')
    await page.click('[data-id="token-item-USDC"]')

    await page.waitForSelector('[data-id="swap-currency-input"]')
    await page.focus('[data-id="swap-currency-input"]')
    await page.keyboard.sendCharacter('0.001')

    await page.waitForSelector('[data-id="swap-button"]')
    await page.click('[data-id="swap-button"]')

    const newPagePromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('[data-id="confirm-swap-or-send"]')
    await page.click('[data-id="confirm-swap-or-send"]')
    const metamaskPage = await newPagePromise

    await metamaskPage.waitForSelector('.btn-primary')
    await metamaskPage.click('.btn-primary')

    await page.waitForSelector('[data-id="swap-button"]')
    await page.click('[data-id="swap-button"]')

    done()
  })

  it('add liquidity', async (done) => {
    const tokenBAmount = '2'
    await page.goto(MAIN_URL, {
      waitUntil: 'networkidle0',
    })

    await page.waitForSelector('#pool-nav-link')
    await page.click('#pool-nav-link')

    await page.waitForSelector('[data-id="HT-USDC-dropdown"]')
    await page.click('[data-id="HT-USDC-dropdown"]')

    await page.waitForSelector('[data-id="add-liquidity-button"]')
    await page.click('[data-id="add-liquidity-button"]')

    await page.waitForSelector('[data-id="add-liquidity-input-tokenb"]')
    await page.focus('[data-id="add-liquidity-input-tokenb"]')
    await page.keyboard.type(tokenBAmount)

    await page.waitForSelector('[data-id="first-supply-button"]')
    await page.click('[data-id="first-supply-button"]')

    const newPagePromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('[data-id="confirm-supply-button"]')
    await page.click('[data-id="confirm-supply-button"]')
    const metamaskPage = await newPagePromise

    await metamaskPage.waitForSelector('.btn-primary')
    await metamaskPage.click('.btn-primary')

    const infoPagePromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('[data-id="explorer-transaction-link"]')
    await page.click('[data-id="explorer-transaction-link"]')
    const infoPage = await infoPagePromise

    await infoPage.waitForTimeout(5000)
    await infoPage.reload()

    await infoPage.waitForSelector('.row:nth-of-type(8) .media:nth-of-type(1) .mr-1:nth-of-type(6)')
    const tokenBInfo = await infoPage.$('.row:nth-of-type(8) .media:nth-of-type(1) .mr-1:nth-of-type(6)')
    const tokenBAmountInfo = await infoPage.evaluate((el) => el.textContent, tokenBInfo)

    if (+tokenBAmountInfo !== +tokenBAmount) {
      throw new Error(`Incorrect amount of second token in HecoInfo ${tokenBAmount} to ${tokenBAmountInfo}`)
    }
    infoPage.close()
    done()
  })

  it('remove liquidity', async (done) => {
    const tokenBAmount = '2'
    await page.goto(MAIN_URL, {
      waitUntil: 'networkidle0',
    })

    await page.waitForSelector('#pool-nav-link')
    await page.click('#pool-nav-link')

    await page.waitForSelector('[data-id="HT-USDC-dropdown"]')
    await page.click('[data-id="HT-USDC-dropdown"]')

    await page.waitForSelector('[data-id="remove-liquidity-button"]')
    await page.click('[data-id="remove-liquidity-button"]')

    await page.waitForTimeout(5000)
    await page.waitForSelector('[data-id="25-percent-button"]')
    await page.click('[data-id="25-percent-button"]')

    const newPagePromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('[data-id="approve-button"]')
    await page.click('[data-id="approve-button"]')
    const metamaskPage = await newPagePromise

    await metamaskPage.waitForSelector('.btn-primary')
    await metamaskPage.click('.btn-primary')

    await page.waitForSelector('[data-id="remove-button"]')
    await page.click('[data-id="remove-button"]')

    const metamaskPagePromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('[data-id="confirm-button"]')
    await page.click('[data-id="confirm-button"]')

    const metamask = await metamaskPagePromise

    await metamask.waitForSelector('.btn-primary')
    await metamask.click('.btn-primary')

    const infoPagePromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('[data-id="explorer-transaction-link"]')
    await page.click('[data-id="explorer-transaction-link"]')
    const infoPage = await infoPagePromise

    await infoPage.waitForTimeout(5000)
    await infoPage.reload()

    // await infoPage.waitForSelector('.row:nth-of-type(8) .media:nth-of-type(1) .mr-1:nth-of-type(6)')
    // const tokenBInfo = await infoPage.$('.row:nth-of-type(8) .media:nth-of-type(1) .mr-1:nth-of-type(6)')
    // const tokenBAmountInfo = await infoPage.evaluate(el => el.textContent, tokenBInfo)

    // if (+tokenBAmountInfo !== +tokenBAmount) {
    //     throw new Error(`Incorrect amount of second token in HecoInfo ${tokenBAmount} to ${tokenBAmountInfo}`)
    // }
    // await page.waitForTimeout(180000)
    done()
  })
})

// helper functions

const selectToken = (tokenName) => {
  it(`select ${tokenName}`, async (done) => {
    await page.waitForTimeout(2000)
    await page.waitForSelector(`[data-id="1-USDT-selected"]`)
    await page.click(`[data-id="1-USDT-selected"]`)

    await page.waitForSelector(`[data-id="${tokenName}"]`)
    await page.click(`[data-id="${tokenName}"]`)

    done();
  })
}

const appriveToken = (tokenName) => {
  it(`approve ${tokenName}`, async (done) => {

    const metamaskPageApprovePromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('[data-id="approve-button"]')
    await page.click('[data-id="approve-button"]')

    const metamask = await metamaskPageApprovePromise
    await metamask.waitForSelector('.btn-primary')
    await metamask.click('.btn-primary')

    done();
  })
}

const selectCardType = (name, cardNumber) => {
  it(`select ${name} card`, async (done) => {
    await page.waitForSelector(`[data-id="${cardNumber}-card"]`)
    await page.click(`[data-id="${cardNumber}-card"]`)
    done();
  })
}

const buyCardWithAmount = async (amount, done) => {
  const metamaskPageApprovePromise = new Promise<puppeteer.Page>((x) =>
    browser.once('targetcreated', (target) => x(target.page()))
  )
  await page.waitForSelector(`[data-id="buy-${amount}-cards-button"]`)
  await page.click(`[data-id="buy-${amount}-cards-button"]`)

  const metamask = await metamaskPageApprovePromise
  await metamask.waitForSelector('.btn-primary')
  await metamask.click('.btn-primary')

  done();
}

const checkOnHecoinfo = (cardNumber, amount) => {
  it('check on hecoinfo', async (done) => {

    const infoPagePromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('[data-id="view-transaction-link"]')
    await page.click('[data-id="view-transaction-link"]')
    const infoPage = await infoPagePromise

    await infoPage.waitForTimeout(5000)
    await infoPage.reload()

    await infoPage.waitForSelector('#eventlog-tab')
    await infoPage.click('#eventlog-tab')

    await infoPage.waitForSelector('[data-original-title="id (uint256 )"]')
    const nftIDSelector = await infoPage.$('[data-original-title="id (uint256 )"]')
    const nftID = await infoPage.evaluate((el) => el.textContent, nftIDSelector)

    expect(nftID).toEqual(cardNumber);

    await infoPage.waitForSelector('.card-body .media:nth-of-type(3) [data-original-title="value (uint256 )"]')
    const nftValSelector = await infoPage.$('.card-body .media:nth-of-type(3) [data-original-title="value (uint256 )"]')
    const nftVal = await infoPage.evaluate((el) => el.textContent, nftValSelector)

    expect(nftVal).toEqual(amount);

    // await infoPage.waitForTimeout(50000)
    await infoPage.close()

    done();
  })
}

const testTokenWithCardType = (tokenName, cardName, cardNumber) => {
  it('go to page', async (done) => {
    await page.goto(BB_URL)
    done()
  })

  selectToken(tokenName)
  
  selectCardType(cardName, cardNumber)
 
  it(`buy one ${cardName} card for USDC`, async (done) => {
    await buyCardWithAmount(1, done)
  })

  checkOnHecoinfo(`${cardNumber + 1}`, '1')
  
  // it('check and close congratulation modal', async (done) => {
  //   await page.waitForSelector('.sc-dlnjwi')
  //   await page.waitForTimeout(10000)
  //   await page.click('.sc-dlnjwi')
  //   done();
  // })

  it('go to page', async (done) => {
    await page.goto(BB_URL)
    done()
  })

  selectToken(tokenName)
  
  selectCardType(cardName, cardNumber)

  it('type amount of cards (2)', async (done) => {
    await page.waitForSelector('[data-id="number-input"]')
    await page.focus('[data-id="number-input"]')
    await page.keyboard.sendCharacter('2')
    done();
  })

  it(`buy two ${cardName} cards for USDC`, async (done) => {
    await buyCardWithAmount(2, done)
  })

  checkOnHecoinfo(`${cardNumber + 1}`, '2')
}

describe.only('Visit BigBang', () => {
  it('go to page', async (done) => {
    await page.goto(BB_SECRET_URL)
    await page.goto(BB_URL)
    done()
  })

  it('unlock wallet', async (done) => {
    await page.waitForSelector('[data-id="modal-connect-wallet-button"]')
    await page.click('[data-id="modal-connect-wallet-button"]')

    const metamaskPagePromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('#wallet-connect-metamask')
    await page.click('#wallet-connect-metamask')

    let metamask = await metamaskPagePromise

    await metamask.waitForSelector('.btn-primary')
    await metamask.click('.btn-primary')

    await metamask.waitForSelector('.btn-primary')
    await metamask.click('.btn-primary')

    await page.waitForSelector('[data-id="modal-connect-wallet-button"]')
    await page.click('[data-id="modal-connect-wallet-button"]')

    const metamaskPageSwitchPromise = new Promise<puppeteer.Page>((x) =>
      browser.once('targetcreated', (target) => x(target.page()))
    )
    await page.waitForSelector('#wallet-connect-metamask')
    await page.click('#wallet-connect-metamask')

    metamask = await metamaskPageSwitchPromise

    await metamask.waitForSelector('.btn-primary')
    await metamask.click('.btn-primary')

    await metamask.waitForSelector('.btn-primary')
    await metamask.click('.btn-primary')

    await page.waitForSelector('[data-id="modal-connect-wallet-button"]')
    await page.click('[data-id="modal-connect-wallet-button"]')

    await page.waitForSelector('#wallet-connect-metamask')
    await page.click('#wallet-connect-metamask')

    done();
  })
})


describe.skip('BigBang approve all tokens', () => {
  selectToken('USDC')
  appriveToken('USDC')
  selectToken('DAI')
  appriveToken('DAI')
  selectToken('USDT')
  appriveToken('USDT')
})

describe.only('BigBang test (DAI - believer)', () => {
  testTokenWithCardType('DAI', 'believer', 2)
}) 

describe.only('BigBang test (DAI - advocate)', () => {
  testTokenWithCardType('DAI', 'advocate', 1)
}) 

describe.only('BigBang test (DAI - evangelist)', () => {
  testTokenWithCardType('DAI', 'evangelist', 0)
})

describe.skip('BigBang test (USDC - believer)', () => {
  testTokenWithCardType('USDC', 'believer', 2)
}) 

describe.skip('BigBang test (USDC - advocate)', () => {
  testTokenWithCardType('USDC', 'advocate', 1)
}) 

describe.skip('BigBang test (USDC - evangelist)', () => {
  testTokenWithCardType('USDC', 'evangelist', 0)
}) 




