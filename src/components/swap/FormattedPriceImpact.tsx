import { Percent } from '@gravis.finance/sdk'
import React from 'react'
import styled from 'styled-components'
import { Text } from '@gravis.finance/uikit'
import { ONE_BIPS } from 'config/settings'
import { warningSeverity } from '../../utils/prices'
/**
 * Formatted version of price impact text with warning colors
 */

const StyledText = styled(Text)<{ severity?: number; modal?: boolean }>`
  color: ${({ theme, severity }) => (severity === 3 || severity === 4 ? theme.colors.warning : '')};
  font-size: ${({ modal }) => (modal ? '11px' : '14px')};
  @media screen and (max-width: 530px) {
    font-size: 11px;
  }
`

export default function FormattedPriceImpact({ priceImpact, modal }: { priceImpact?: Percent; modal?: boolean }) {
  return (
    <StyledText modal={modal} fontSize="11px" severity={warningSeverity(priceImpact)} color="#009CE1">
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </StyledText>
  )
}
