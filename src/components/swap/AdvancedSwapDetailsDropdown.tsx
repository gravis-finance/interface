import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  width: 100%;
  max-width: 738px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.colors.textSubtle};
  z-index: 1;
  border-top: ${({ show }) => (show ? '1px solid rgba(255, 255, 255, 0.1)' : '')};
  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
  @media screen and (max-width: 1024px) {
    max-width: inherit;
  }
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
