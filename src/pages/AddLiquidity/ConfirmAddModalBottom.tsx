import { Currency, CurrencyAmount, Fraction, Percent } from '@gravis.finance/sdk'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@gravis.finance/uikit'

import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/Logos/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../components/Shared'

const { body: Body } = TYPE

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { t } = useTranslation()
  return (
    <>
      <RowBetween style={{ height: '32px' }}>
        <Body style={{ color: 'rgba(255, 255, 255, 0.5)', padding: '8px', fontSize: '11px' }}>
          {currencies[Field.CURRENCY_A]?.symbol} {t('deposited')}
        </Body>
        <RowFixed style={{ padding: '8px' }}>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <Body style={{ fontWeight: '500', fontSize: '11px' }}>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </Body>
        </RowFixed>
      </RowBetween>
      <RowBetween
        style={{
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '6px',
          padding: '4px 8px',
          height: '32px',
        }}
      >
        <Body style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px' }}>
          {currencies[Field.CURRENCY_B]?.symbol} {t('deposited')}
        </Body>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <Body style={{ fontWeight: '500', fontSize: '11px' }}>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </Body>
        </RowFixed>
      </RowBetween>
      <RowBetween style={{ paddingRight: '8px', height: '24px' }}>
        <Body style={{ color: 'rgba(255, 255, 255, 0.5)', padding: '0 8px', fontSize: '11px' }}>{t('rates')}</Body>
        <Body style={{ fontWeight: '500', fontSize: '11px' }}>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
            currencies[Field.CURRENCY_B]?.symbol
          }`}
        </Body>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end', paddingRight: '8px', height: '24px' }}>
        <Body style={{ fontWeight: '500', fontSize: '11px' }}>
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
            currencies[Field.CURRENCY_A]?.symbol
          }`}
        </Body>
      </RowBetween>
      <RowBetween
        style={{ border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '6px', padding: '8px', height: '32px' }}
      >
        <Body style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px' }}>{t('shareOfPool')}:</Body>
        <Body style={{ fontWeight: '500', fontSize: '11px' }}>
          {noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%
        </Body>
      </RowBetween>
      <Button
        mt="10px"
        mb="20px"
        onClick={onAdd}
        fullwidth
        data-id={`${noLiquidity ? 'no-liquidity' : 'confirm-supply'}-button`}
      >
        {noLiquidity ? t('createPoolAndSupply') : t('confirmSupply')}
      </Button>
    </>
  )
}

export default ConfirmAddModalBottom
