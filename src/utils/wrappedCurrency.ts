import {
  ChainId,
  Currency,
  CurrencyAmount,
  isEther,
  Token,
  TokenAmount,
  WETH,
  BASE_CURRENCIES,
} from '@gravis.finance/sdk'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  // eslint-disable-next-line no-nested-ternary
  return chainId && isEther(currency) ? WETH[chainId] : currency instanceof Token ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token, chainId: ChainId): Currency {
  if (token.equals(WETH[token.chainId])) return BASE_CURRENCIES[chainId]
  return token
}
