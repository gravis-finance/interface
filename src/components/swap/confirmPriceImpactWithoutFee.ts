import { Percent } from '@gravis.finance/sdk'
import { ALLOWED_PRICE_IMPACT_HIGH, PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN } from 'config/settings'

/**
 * Given the price impact, get user confirmation.
 *
 * @param priceImpactWithoutFee price impact of the trade without the fee.
 */
export default function confirmPriceImpactWithoutFee(priceImpactWithoutFee: Percent, t): boolean {
  if (!priceImpactWithoutFee.lessThan(PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN)) {
    return (
      window.prompt(t('typeConfirm', { percentage: PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(0) })) === 'confirm'
    )
  }
  if (!priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
    return window.confirm(t('pleaseConfirm', { percentage: ALLOWED_PRICE_IMPACT_HIGH.toFixed(0) }))
  }
  return true
}
