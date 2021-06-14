import React, { lazy } from 'react'
import { useActiveWeb3React } from '../../hooks'
import ConfirmationPendingContent from './ConfirmationPendingContent'
import TransactionSubmittedContent from './TransactionSubmittedContent'

const Modal = lazy(() => import('../Modal'))

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  attemptingTxn: boolean
  pendingText: string
  children?: React.ReactNode
}

const TransactionConfirmationModal = ({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  children,
}: ConfirmationModalProps) => {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent chainId={chainId} hash={hash} onDismiss={onDismiss} />
      ) : (
        children
      )}
    </Modal>
  )
}

export default TransactionConfirmationModal
