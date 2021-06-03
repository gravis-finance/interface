/* eslint-disable */
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount } from '@gravis.finance/sdk'
import maxAmountSpend from './maxAmountSpend'

describe('#maxAmountSpend', () => {
  it('returns undefined on no currency', () => {
    expect(maxAmountSpend()).toEqual(undefined)
  })

  it('returns full amount on custom currency', () => {
    const token1 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000001', 18)
    const amount = new TokenAmount(token1, JSBI.BigInt(10000))
    expect(maxAmountSpend(amount)).toEqual(new TokenAmount(token1, JSBI.BigInt(10000)))
  })

  it('returns null amount on eth currency below minimal', () => {
    expect(maxAmountSpend(CurrencyAmount.ether(JSBI.BigInt(1)))).toEqual(CurrencyAmount.ether(JSBI.BigInt(0)))
  })

  it('returns amount on eth currency (works incorrect)', () => {
    expect(maxAmountSpend(CurrencyAmount.ether(JSBI.BigInt(200000)))).toEqual(CurrencyAmount.ether(JSBI.BigInt(0)))
  })
})
