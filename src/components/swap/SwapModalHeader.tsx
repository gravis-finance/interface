import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Trade, TradeType } from '@gravis.finance/sdk'
import { Button, Text, ColoredArrowDownIcon } from '@gravis.finance/uikit'

import { AlertTriangle } from 'react-feather'

import useNetwork from 'hooks/useNetwork'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../Shared'
import { isAddress, shortenAddress } from '../../utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../Logos/CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { SwapShowAcceptChanges } from './styleds'

const { main: Main } = TYPE

const PriceInfoText = styled(Text)`
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: 300;

  span {
    color: #009ce1;
    font-weight: 500;
  }
`

const StyledArrowDownContainer = styled.div`
  display: flex;
  background: #303030;
  border-radius: 40px;
  width: 32px;
  height: 32px;
  margin-left: 16px;
  > * {
    margin: auto;
  }
`

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage]
  )
  const { network } = useNetwork()
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(network, trade), [trade, network])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  return (
    <AutoColumn gap="md">
      <RowBetween
        align="flex-end"
        style={{
          background: 'linear-gradient(0deg, #303030, #303030), #F5F7FF',
          borderRadius: '43px',
          boxShadow: 'inset 0px -1px 0px rgba(129, 129, 129, 0.15)',
          height: '48px',
          placeItems: 'center',
          padding: '0 16px',
        }}
      >
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.inputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <Text
            fontSize="14px"
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? theme.colors.primary : 'text'}
          >
            {trade.inputAmount.toSignificant(6)}
          </Text>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="14px" style={{ marginLeft: '10px', fontWeight: 500 }}>
            {trade.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <StyledArrowDownContainer>
          <ColoredArrowDownIcon width="24px" />
        </StyledArrowDownContainer>
      </RowFixed>
      <RowBetween
        align="flex-end"
        style={{
          background: 'linear-gradient(0deg, #303030, #303030), #F5F7FF',
          borderRadius: '43px',
          boxShadow: 'inset 0px -1px 0px rgba(129, 129, 129, 0.15)',
          height: '48px',
          placeItems: 'center',
          padding: '0 16px',
        }}
      >
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.outputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <Text
            fontSize="14px"
            style={{ marginLeft: '10px', fontWeight: 500 }}
            color={
              priceImpactSeverity > 2
                ? theme.colors.failure
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? theme.colors.primary
                : 'text'
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </Text>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="14px" style={{ marginLeft: '10px', fontWeight: 500 }}>
            {trade.outputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
              <Main color={theme.colors.primary} style={{ fontSize: '14px' }}>
                {' '}
                {t('priceUpdated')}
              </Main>
            </RowFixed>
            <Button onClick={onAcceptChanges} data-id="accept-button">
              {t('accept')}
            </Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '16px 0 0' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <PriceInfoText>
            {t('outputEstimatedReceive')}
            <br />
            <span>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </span>
            {` ${t('orTransactionWillRevert')}`}
          </PriceInfoText>
        ) : (
          <PriceInfoText>
            {t('inputEstimatedReceive')}
            <span>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            </span>
            {` ${t('orTransactionWillRevert')}`}
          </PriceInfoText>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '16px 0 0' }}>
          <Main>
            {`${t('outputWillBeSentTo')} `}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </Main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
