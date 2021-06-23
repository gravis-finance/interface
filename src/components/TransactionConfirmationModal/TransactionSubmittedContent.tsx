import { ChainId } from '@gravis.finance/sdk'
import React from 'react'
import styled from 'styled-components'
import { Button, LinkExternal } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import loaderGif from 'assets/images/loader.gif'
import { AutoColumn } from '../Column'
import { getExplorerLink, getExplorerName } from '../../utils'
import { Wrapper, Section, ConfirmedIcon, ContentHeader } from './helpers'

type TransactionSubmittedContentProps = {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
}

const StyledSection = styled(Section)`
  padding: 0 0 24px 0;
`

const AnimatedLoader = styled.img`
  
`

const TransactionSubmittedContent = ({ onDismiss, chainId, hash }: TransactionSubmittedContentProps) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <StyledSection>
        <ContentHeader onDismiss={onDismiss}>{t('transactionSubmitted')}</ContentHeader>
        <ConfirmedIcon>
          <AnimatedLoader src={loaderGif} alt=""/>
        </ConfirmedIcon>
        <AutoColumn gap="8px" justify="center">
          {chainId && hash && (
            <LinkExternal href={getExplorerLink(chainId, hash, 'transaction')} data-id="explorer-transaction-link">
              {t(`${getExplorerName(chainId)}`)}
            </LinkExternal>
          )}
          <Button onClick={onDismiss} mt="20px" data-id="submit-transaction-close-button" style={{ width: '142px' }}>
            {t('close')}
          </Button>
        </AutoColumn>
      </StyledSection>
    </Wrapper>
  )
}

export default TransactionSubmittedContent
