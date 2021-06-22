/* eslint-disable */
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount } from '@gravis.finance/sdk'
import maxAmountSpend from './maxAmountSpend'

describe('#maxAmountSpend', () => {
  it('returns undefined on no currency', () => {
    expect(maxAmountSpend(ChainId.MAINNET)).toEqual(undefined)
  })

  it('returns full amount on custom currency', () => {
    const token1 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000001', 18)
    const amount = new TokenAmount(token1, JSBI.BigInt(10000))
    expect(maxAmountSpend(ChainId.MAINNET, amount)).toEqual(new TokenAmount(token1, JSBI.BigInt(10000)))
  })

  it('returns null amount on eth currency below minimal', () => {
    expect(maxAmountSpend(ChainId.MAINNET, CurrencyAmount.ether(JSBI.BigInt(1), ChainId.MAINNET))).toEqual(
      CurrencyAmount.ether(JSBI.BigInt(0), ChainId.MAINNET)
    )
  })

  it('returns amount on eth currency (works incorrect)', () => {
    expect(maxAmountSpend(ChainId.MAINNET, CurrencyAmount.ether(JSBI.BigInt(200000), ChainId.MAINNET))).toEqual(
      CurrencyAmount.ether(JSBI.BigInt(0), ChainId.MAINNET)
    )
  })
})
