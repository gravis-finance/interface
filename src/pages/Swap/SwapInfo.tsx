import React from 'react'
import styled from 'styled-components'
import { Currency } from '@gravis.finance/sdk'
import { useTranslation } from 'react-i18next'
import { Text } from '@gravis.finance/uikit'
import { Field } from '../../state/swap/actions'
import { usePair } from '../../data/Reserves'

const StyledRoot = styled.div`
  padding-top: 24px;
`

const SwapInfo = React.memo(({ currencies }: { currencies: { [field in Field]?: Currency } }) => {
  const { t } = useTranslation()
  const [, pair] = usePair(currencies[Field.INPUT] ?? undefined, currencies[Field.OUTPUT] ?? undefined)

  if (!pair) return null

  return (
    <StyledRoot>
      {[pair.reserve0, pair.reserve1].map((reserve) => (
        <Text fontSize="14px" color="#909090" key={reserve.currency.symbol}>
          {t('tokenAmount')} {reserve.currency.symbol}: {reserve.toSignificant(6)}
        </Text>
      ))}
    </StyledRoot>
  )
})

export default SwapInfo
