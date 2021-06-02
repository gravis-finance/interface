import React from 'react'
import { Trade, TradeType } from '@gravis.finance/sdk'
import { Card, CardBody, Text } from '@gravis.finance/uikit'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'

const StyledTradeSummary = styled.div`
  > div {
    background: #292929;
    border-radius: 0 0 6px 6px;
  }

  > div > div {
    padding: 15px 30px 24px 30px;
  }

  > div > div > div {
    // margin-bottom: px;
  }

  > div > div > div {
    height: 40px;
    padding: 0 10px 0 10px;
  }

  > div > div > div:nth-child(2n) {
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  > div > div > div > div > div {
    font-size: 14px;
    color: #909090;
  }

  @media screen and (max-width: 530px) {
    > div > div > div > div > div {
      font-size: 11px;
    }
  }

  > div > div > div > div:first-child > div {
    color: #909090;
    letter-spacing: 0.3px;
  }

  > div > div > div > div > span * {
    background: none;
  }

  @media screen and (max-width: 376px) {
    > div > div {
      padding: 15px 15px 24px 15px;
    }
    > div > div > div > div > div {
      font-size: 11px;
    }
    > div * {
      font-size: 11px;
    }
  }
`

const StyledRouteContainer = styled.div`
  background-color: #292929;
  border-radius: 6px;
  border: none;
  padding: 12px 6px;
`

const StyledText = styled(Text)`
  font-size: 14px;
  color: #909090;
  @media screen and (max-width: 530px) {
    font-size: 11px;
  }
`

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  const { t } = useTranslation()

  return (
    <Card>
      <CardBody>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{isExactIn ? t('minimumReceived') : t('maximumSold')}</Text>
            <QuestionHelper text={t('questionHelperMessages.transactionWillRevert')} />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px">
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                  '-'}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('priceImpact')}</Text>
            <QuestionHelper text={t('differenceBetweenMarket')} />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('liquidityProviderFee')}</Text>
            <QuestionHelper text={t('questionHelperMessages.feeTreasury')} />
          </RowFixed>
          <StyledText fontSize="16px">
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </StyledText>
        </RowBetween>
      </CardBody>
    </Card>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)
  const { t } = useTranslation()

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <StyledTradeSummary>
            <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          </StyledTradeSummary>
          {showRoute && (
            <StyledRouteContainer>
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <Text fontSize="14px" bold>
                    {t('route')}
                  </Text>
                  <QuestionHelper text={t('questionHelperMessages.routingThroughTokens')} />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </StyledRouteContainer>
          )}
        </>
      )}
    </AutoColumn>
  )
}
