import { Trade, TradeType } from '@gravis.finance/sdk'
import React, { useMemo, useState } from 'react'
import { Text, Button, SwapIcon } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import useNetwork from 'hooks/useNetwork'
import { Field } from '../../state/swap/actions'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SwapCallbackError } from './styleds'

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const { network } = useNetwork()
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade]
  )
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(
    () => computeTradePriceBreakdown(network, trade),
    [trade, network]
  )
  const severity = warningSeverity(priceImpactWithoutFee)
  const { t } = useTranslation()

  return (
    <>
      <AutoColumn gap="0px" style={{ userSelect: 'none' }}>
        <RowBetween align="center" style={{ padding: '4px 8px' }}>
          <Text fontSize="11px" color="rgba(255, 255, 255, 0.5)">
            {t('price')}
          </Text>
          <Text
            fontSize="11px"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '8px',
              fontWeight: 500,
            }}
            color="rgba(255, 255, 255, 0.5)"
          >
            {formatExecutionPrice(trade, showInverted)}
            <SwapIcon onClick={() => setShowInverted(!showInverted)} style={{ marginLeft: '8px', cursor: 'pointer' }} />
          </Text>
        </RowBetween>

        <RowBetween style={{ border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '6px', padding: '0px 8px' }}>
          <RowFixed>
            <Text fontSize="11px" color="rgba(255, 255, 255, 0.5)">
              {trade.tradeType === TradeType.EXACT_INPUT ? t('minimumReceived') : t('maximumSold')}
            </Text>
            <QuestionHelper text={t('questionHelperMessages.transactionWillRevert')} big empty disableHover />
          </RowFixed>
          <RowFixed>
            <Text fontSize="11px" color="#009CE1">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </Text>
            <Text fontSize="11px" marginLeft="4px" color="#009CE1">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween style={{ padding: '0px 8px' }}>
          <RowFixed>
            <Text fontSize="11px" color="rgba(255, 255, 255, 0.5)">
              {t('priceImpact')}
            </Text>
            <QuestionHelper text={t('questionHelperMessages.differenceBetweenMarket')} big empty disableHover />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} modal />
        </RowBetween>
        <RowBetween style={{ border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '6px', padding: '0px 8px' }}>
          <RowFixed>
            <Text fontSize="11px" color="rgba(255, 255, 255, 0.5)">
              {t('liquidityProviderFee')}
            </Text>
            <QuestionHelper text={t('questionHelperMessages.feeTreasury')} big empty disableHover />
          </RowFixed>
          <Text fontSize="11px" color="#009CE1">
            {realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <Button
          onClick={onConfirm}
          disabled={disabledConfirm}
          variant={severity > 2 ? 'danger' : 'primary'}
          mt="10px"
          mb="20px"
          data-id="confirm-swap-or-send"
          fullwidth
        >
          {severity > 2 ? t('swapAnyway') : t('confirmSwap')}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
