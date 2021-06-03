import React from 'react'
import styled from 'styled-components'
import { Card } from '@gravis.finance/uikit'

export const BodyWrapper = styled(Card)<{ withoutBorderBottom?: boolean }>`
  position: relative;
  max-width: 738px;
  background: #292929;
  width: 100%;
  z-index: 5;
  border-radius: ${({ withoutBorderBottom }) => (withoutBorderBottom ? '6px 6px 0 0' : '6px')};

  @media screen and (max-width: 1024px) {
    max-width: inherit;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({
  children,
  withoutBorderBottom,
}: {
  children: React.ReactNode
  withoutBorderBottom?: boolean
}) {
  return <BodyWrapper withoutBorderBottom={withoutBorderBottom}>{children}</BodyWrapper>
}
