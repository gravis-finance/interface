import React, { useContext } from 'react'
import { Button, Modal, Text, Box } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../Column'

type Props = {
  onDismiss?: () => void
}

const StyledBox = styled(Box)`
  width: 420px;
  max-width: 100%;
`

const TransactionErrorModal = (props: Props) => {
  const { onDismiss } = props
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const message = t('errorMessages.timeoutError')

  return (
    <Modal {...props} title={t('error')}>
      <StyledBox>
        <AutoColumn gap="24px" justify="center">
          <AlertTriangle color={theme.colors.failure} style={{ strokeWidth: 1.5 }} size={64} />
          <Text fontSize="16px" color="failure" style={{ textAlign: 'center', width: '85%' }}>
            {message}
          </Text>
        </AutoColumn>
      </StyledBox>
      <Box mt={24}>
        <Button onClick={onDismiss} data-id="transaction-error-dismiss-button" fullwidth>
          {t('dismiss')}
        </Button>
      </Box>
    </Modal>
  )
}

export default TransactionErrorModal
