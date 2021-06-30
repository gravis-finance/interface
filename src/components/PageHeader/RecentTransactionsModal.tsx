import React, { useMemo } from 'react'
import { CheckmarkCircleIcon, Flex, LinkExternal, Text, Modal, ErrorCircleIcon, Button } from '@gravis.finance/uikit'
import styled from 'styled-components'

import { useActiveWeb3React } from 'hooks'
import { getExplorerLink } from 'utils'
import useTranslateSummary from 'hooks/useTranslateSummary'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { useTranslation } from 'react-i18next'
import GravisSpinner from '../GravisSpinner'

const StyledWrapper = styled.div`
  max-width: 450px;
  width: 100%;
  z-index: inherit;

  > * {
    background: #292929;
  }

  > div > div:last-child {
    max-height: 472px;
    overflow-y: auto;
    padding: 19px 24px 15px 24px;
  }
`

const StyledTransactionsList = styled.div``

type RecentTransactionsModalProps = {
  onDismiss?: () => void
}

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) => b.addedTime - a.addedTime

const getRowStatus = (sortedRecentTransaction: TransactionDetails) => {
  const { hash, receipt } = sortedRecentTransaction

  if (!hash) {
    return { icon: <GravisSpinner small />, color: 'text' }
  }

  if (hash && receipt?.status === 1) {
    return { icon: <CheckmarkCircleIcon color="primaryBright" marginRight="8px" />, color: 'primaryBright' }
  }

  return { icon: <ErrorCircleIcon color="failure" marginRight="8px" />, color: 'failure' }
}

const RecentTransactionsModal = ({ onDismiss = defaultOnDismiss }: RecentTransactionsModalProps) => {
  const { account, chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()
  const { t } = useTranslation()
  const translateSummary = useTranslateSummary()

  // Logic taken from Web3Status/index.tsx line 175
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  return (
    <StyledWrapper>
      <Modal title={t('recentTransactions')} onDismiss={onDismiss}>
        {!account && (
          <Flex justifyContent="center" flexDirection="column" alignItems="center">
            <Text mb="24px" bold mt="12px" style={{ textAlign: 'center' }}>
              {t('pleaseConnectWallet')}
            </Text>
            <Button variant="dark" onClick={onDismiss} data-id="modal-close-button">
              {t('close')}
            </Button>
          </Flex>
        )}
        {account && chainId && sortedRecentTransactions.length === 0 && (
          <Flex justifyContent="center" flexDirection="column" alignItems="center">
            <Text mb="24px">{t('noRecentTransactions')}</Text>
            <Button variant="dark" onClick={onDismiss} data-id="modal-close-button">
              {t('close')}
            </Button>
          </Flex>
        )}
        <StyledTransactionsList>
          {account &&
            chainId &&
            sortedRecentTransactions.map((sortedRecentTransaction, index) => {
              const { hash, summary } = sortedRecentTransaction
              const { icon } = getRowStatus(sortedRecentTransaction)

              return (
                <Flex key={hash} alignItems="center" justifyContent="space-between" mb="16px" style={{ width: '100%' }}>
                  <LinkExternal
                    href={getExplorerLink(chainId, hash, 'transaction')}
                    style={{ width: '100%', justifyContent: 'space-between', paddingRight: '4px' }}
                    data-id={`${index}-link`}
                  >
                    <Flex>
                      {icon}
                      {summary ? translateSummary(summary) : hash}
                    </Flex>
                  </LinkExternal>
                </Flex>
              )
            })}
        </StyledTransactionsList>
      </Modal>
    </StyledWrapper>
  )
}

export default RecentTransactionsModal
