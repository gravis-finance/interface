import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, CloseIcon } from '@gravis.finance/uikit'
import { AutoColumn, ColumnCenter } from '../Column'

export const Wrapper = styled.div`
  width: 100%;
  overflow-y: hidden;
  max-height: 100vh;
`
export const Section = styled(AutoColumn)`
  padding: 24px;
`

export const ConfirmedIcon = styled(ColumnCenter)`
  padding: 40px 0;
`

export const BottomSection = styled(Section)`
  background-color: #1c1c1c;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

/**
 * TODO: Remove this when modal system from the UI Kit is implemented
 */
const StyledContentHeader = styled.div`
  align-items: center;
  display: flex;
  padding: 24px;
  height: 72px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  & > ${Heading} {
    flex: 1;
    font-size: 18px;
    letter-spacing: 0;
    font-weight: 500;
  }
`

type ContentHeaderProps = {
  children: ReactNode
  onDismiss: () => void
}

export const ContentHeader = ({ children, onDismiss }: ContentHeaderProps) => (
  <StyledContentHeader>
    <Heading>{children}</Heading>
    <IconButton onClick={onDismiss} buttonType="close" buttonSize="40px">
      <CloseIcon color="close" />
    </IconButton>
  </StyledContentHeader>
)
