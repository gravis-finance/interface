import { Currency, isEther, Token } from '@gravis.finance/sdk'

export function currencyId(currency: Currency): string {
  if (isEther(currency)) return 'ETH'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
