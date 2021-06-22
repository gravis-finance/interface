import { CurrencyAmount, isEther, JSBI, ChainId } from '@gravis.finance/sdk'
import { MIN_ETH } from 'config/settings'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(chainId: ChainId, currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (isEther(currencyAmount.currency)) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH), chainId)
    }
    return CurrencyAmount.ether(JSBI.BigInt(0), chainId)
  }
  return currencyAmount
}

export default maxAmountSpend
