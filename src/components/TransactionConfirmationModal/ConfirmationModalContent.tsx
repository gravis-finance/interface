import React from 'react'
import styled from 'styled-components'
import { Wrapper, Section, BottomSection, ContentHeader } from './helpers'

type ConfirmationModalContentProps = {
  title: string
  onDismiss: () => void
  topContent: React.ReactNode
  bottomContent: React.ReactNode
}

const StyledBodyContainer = styled.div`
  overflow-y: auto;
  max-height: 80vh;

  > div:nth-child(2) {
    padding: 0 20px;
  }
`

const StyledSection = styled(Section)`
  padding: 24px 24px 8px 24px;
`

const ConfirmationModalContent = ({ title, bottomContent, onDismiss, topContent }: ConfirmationModalContentProps) => {
  return (
    <Wrapper>
      <ContentHeader onDismiss={onDismiss}>{title}</ContentHeader>
      <StyledBodyContainer>
        <StyledSection>{topContent}</StyledSection>
        <BottomSection gap="0">{bottomContent}</BottomSection>
      </StyledBodyContainer>
    </Wrapper>
  )
}

export default ConfirmationModalContent
