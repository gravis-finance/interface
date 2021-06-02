import React from 'react'
import { Price } from '@gravis.finance/sdk'
import { SwapIcon, Text } from '@gravis.finance/uikit'
import { StyledBalanceMaxMini } from './styleds'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
  warning?: boolean
}

export default function TradePrice({ price, showInverted, setShowInverted, warning }: TradePriceProps) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`

  return (
    <Text
      fontSize="14px"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        color: !warning ? '#009CE1' : '#EB9500',
      }}
    >
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <SwapIcon width="20px" color="primary" />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
