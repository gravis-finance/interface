import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, Spinner } from '@gravis.finance/uikit'
import styled from 'styled-components'
import { AutoColumn } from '../Column'
import { Wrapper, Section, ConfirmedIcon, ContentHeader } from './helpers'

type ConfirmationPendingContentProps = { onDismiss: () => void; pendingText: string }

const StyledSection = styled(Section)`
  padding: 0 0 24px 0;
`

const ConfirmationPendingContent = ({ onDismiss, pendingText }: ConfirmationPendingContentProps) => {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <StyledSection>
        <ContentHeader onDismiss={onDismiss}>{t('waitingConfirmation')}</ContentHeader>
        <ConfirmedIcon>
          <Spinner size={80} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center" style={{ padding: '24px 24px 0 24px' }}>
          <AutoColumn gap="12px" justify="center" style={{ textAlign: 'center' }}>
            <Text fontSize="14px">
              <strong>{pendingText}</strong>
            </Text>
          </AutoColumn>
          <Text fontSize="14px">{t('confirmInWallet')}</Text>
        </AutoColumn>
      </StyledSection>
    </Wrapper>
  )
}

export default ConfirmationPendingContent
