import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Button, Text } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'

import { AlertTriangle } from 'react-feather'
import { AutoColumn } from '../Column'
import { Wrapper, Section, BottomSection, ContentHeader } from './helpers'

type TransactionErrorContentProps = { message: string; onDismiss: () => void }

const TransactionErrorContent = ({ message, onDismiss }: TransactionErrorContentProps) => {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Section style={{ padding: 0 }}>
        <ContentHeader onDismiss={onDismiss}>{t('error')}</ContentHeader>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle color={theme.colors.failure} style={{ strokeWidth: 1.5 }} size={64} />
          <Text fontSize="16px" color="failure" style={{ textAlign: 'center', width: '85%' }}>
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <Button onClick={onDismiss} data-id="transaction-error-dismiss-button" fullwidth>
          {t('dismiss')}
        </Button>
      </BottomSection>
    </Wrapper>
  )
}

export default TransactionErrorContent
