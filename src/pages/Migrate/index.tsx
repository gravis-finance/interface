/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { ChainId, CurrencyAmount } from '@gravis.finance/sdk'
import { Button, CardBody, Flex, getNetworkId, Heading } from '@gravis.finance/uikit'
import { AutoColumn } from 'components/Column'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CardNav from 'components/CardNav'
import { useTranslation } from 'react-i18next'
import { RowBetween } from 'components/Row'
import { BottomGrouping, Wrapper } from 'components/swap/styleds'
import { useActiveWeb3React } from 'hooks'
import { useVampireContract } from 'hooks/useContract'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { useMigrateActionHandlers, useMigrateInfo, useSwapState } from 'state/swap/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { WrappedTokenInfo } from 'state/lists/hooks'
import { VAMPIRE_ADDRESS } from 'config/contracts'
import { useToken } from 'hooks/Tokens'
import { Dots } from '../Pool/styleds'
import AppBody from '../AppBody'
import ComingSoon from './ComingSoon'
import TransactionConfirmationModal, { TransactionErrorContent } from '../../components/TransactionConfirmationModal'
import { useAllTransactions, useTransactionAdder } from '../../state/transactions/hooks'

const CardWrapper = styled.div`
  width: 100%;
`

const ButtonWrap = styled.div`
  max-width: 50%;
  > div {
    margin-top: 0;
  }
`

const StyledCardHeader = styled.div`
  padding: 26px 24px 2px 24px;
`

const StyledFlex = styled(Flex)`
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    flex-direction: column;

    > div:last-child {
      margin-top: 20px;
      max-width: 100%;
      button {
        width: 100%;
      }
    }
  }
`

const StyledButton = styled(Button)`
    width: 200px;
`

function useTokenAddress(props) {
  const [tokenInfo, setTokenInfo] = useState<any>()
  const Info = useToken(props)

  useEffect(() => {
    if (Info && Info !== null) {
      setTokenInfo(Info)
    }
  }, [Info])

  return tokenInfo
}

function Migrate() {
  const vampire: any = useVampireContract()
  const [lpList, setLpList] = useState<any>()
  const { account, chainId } = useActiveWeb3React()
  const [tokenList, setTokenList] = useState<any>([])

  const networkId = getNetworkId()
  const isVampiringAvailable = networkId === '97'
  const { t } = useTranslation()

  useEffect(() => {
    if (!isVampiringAvailable) return
    async function getLpTokens() {
      const tokens: Array<any> = await vampire?.lpTokensInfoLength().then(async (response: TransactionResponse) => {
        const length = +response.toString()
        const temp = await Promise.all(
          [...Array(length).keys()].map(async (item) => {
            const address = await vampire.lpTokensInfo(item).then((resp: any) => resp.lpToken)
            const parents = await vampire.lpTokenDetailedInfo(item).then((resp: any) => resp)
            return { address, ...{ left: parents[0] }, right: parents[1] }
          })
        )
        return temp
      })
      if (JSON.stringify(tokenList) !== JSON.stringify(tokens)) setTokenList(tokens)
    }
    getLpTokens()
  }, [isVampiringAvailable, tokenList, vampire])

  const useBaseTokenInfo = (n) =>
    [...Array(n)].map((_, i) => ({
      left: useTokenAddress(tokenList[i]?.left),
      right: useTokenAddress(tokenList[i]?.right),
    }))
  const filteredTokenInfo = useBaseTokenInfo(10).filter((item) => item.left !== undefined && item.right !== undefined)

  useEffect(() => {
    if (!isVampiringAvailable) return
    const enrichedTokenInfo = tokenList.map((_, i) => {
      const id: any = chainId
      const info = new WrappedTokenInfo(
        {
          name: `Gravis ${filteredTokenInfo[i]?.left?.name} / ${filteredTokenInfo[i]?.right?.name} LP Token`,
          symbol: `${filteredTokenInfo[i]?.left?.symbol} / ${filteredTokenInfo[i]?.right?.symbol} LP`,
          address: tokenList[i].address,
          chainId: id,
          decimals: 18,
        },
        []
      )
      return info
    })
    if (JSON.stringify(enrichedTokenInfo) !== JSON.stringify(lpList)) setLpList(enrichedTokenInfo)
  }, [lpList, chainId, filteredTokenInfo, tokenList, isVampiringAvailable])

  const { independentField, typedValue } = useSwapState()

  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: migrateInputError } = useMigrateInfo()

  const isValid = !migrateInputError

  const { wrapType } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const trade = v2Trade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onCurrencySelection, onUserInput } = useMigrateActionHandlers()
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.INPUT],
    chainId && VAMPIRE_ADDRESS[chainId]
  )
  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [attemptingTxn, setAttemptingTxn] = useState(true)
  const [migrateErrorMessage, setMigrateErrorMessage] = useState('Unexpected error')

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(chainId as ChainId, currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const addTransaction = useTransactionAdder()

  const transaction = useAllTransactions()

  useEffect(() => {
    if(transaction[txHash])
      setAttemptingTxn(false)
  }, [transaction, txHash])

  const handleMigrate = () => {
    setAttemptingTxn(true)
    const tokenAmount = BigNumber.from(parsedAmounts[Field.INPUT]?.raw.toString())
    const activeToken: any = currencies[Field.INPUT]

    const numOfActiveToken = lpList.findIndex((item) => item.address === activeToken?.address).toString()
    const args = [numOfActiveToken, tokenAmount]
    setConfirmationModalOpen(true)
    vampire.estimateGas
      .deposit(...args, { from: account })
      .then((estimatedGasLimit) => {
        vampire
          .deposit(...args, { from: account, gasLimit: estimatedGasLimit })
          .then((resp) => {
            addTransaction(resp, {
              summary: `${t('mainMenu.migrate')} ${activeToken.symbol}`
            })
            setTxHash(resp.hash);
          })
          .catch((err) => {
            console.error(err)
            setAttemptingTxn(false)
            setMigrateErrorMessage(err.message)
          })
      })
      .catch((err) => console.error(err))
  }

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection, setApprovalSubmitted]
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  // TODO Add normal check to vampirism

  const isVampiringAvailableHardCoded = process.env.REACT_APP_NODE_ENV === 'development' && isVampiringAvailable

  return (
    <CardWrapper>
      <CardNav activeIndex={2} />
      <AppBody>
        <TransactionConfirmationModal
          isOpen={isConfirmationModalOpen}
          onDismiss={()=>setConfirmationModalOpen(false)}
          hash={txHash}
          attemptingTxn={attemptingTxn}
          pendingText={`${t('mainMenu.migrate')} ${currencies[Field.INPUT]?.symbol}`}
        >
          <TransactionErrorContent onDismiss={()=>setConfirmationModalOpen(false)} message={migrateErrorMessage} />
        </TransactionConfirmationModal>
        {isVampiringAvailableHardCoded ? (
          <Wrapper id="swap-page">
            <StyledCardHeader>
              <Heading color="text" style={{ fontSize: '18px', letterSpacing: '0.1px' }}>
                {t('mainMenu.migrate')}
              </Heading>
            </StyledCardHeader>
            <CardBody style={{ padding: '40px 24px' }}>
              <StyledFlex>
                <AutoColumn gap="md" style={{ width: '100%', marginRight: '32px' }}>
                  <CurrencyInputPanel
                    label={t('quantity')}
                    value={formattedAmounts[Field.INPUT]}
                    showMaxButton={!atMaxAmountInput}
                    currency={currencies[Field.INPUT]}
                    onUserInput={handleTypeInput}
                    onMax={handleMaxInput}
                    onCurrencySelect={handleInputSelect}
                    // otherCurrency=currencies[Field.INPUT]}
                    currencyList={lpList}
                    id="swap-currency-input"
                  />
                </AutoColumn>
                <ButtonWrap>
                  <BottomGrouping>
                    {!account ? (
                      <ConnectWalletButton fullwidth style={{ marginTop: 0 }} />
                    ) : (
                      <AutoColumn gap="sm">
                        {approval === ApprovalState.UNKNOWN && (
                          <StyledButton onClick={handleMigrate} disabled fullwidth style={{ whiteSpace: 'pre' }}>
                            {currencies[Field.INPUT] ? t('enterAmount') : t('chooseToken')}
                          </StyledButton>
                        )}
                        {(approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) && (
                          <RowBetween>
                            <StyledButton onClick={approveCallback} disabled={approval === ApprovalState.PENDING}>
                              {approval === ApprovalState.PENDING ? (
                                <Dots>Approving {currencies[Field.INPUT]?.symbol}</Dots>
                              ) : (
                                `Approve ${currencies[Field.INPUT]?.symbol}`
                              )}
                            </StyledButton>
                          </RowBetween>
                        )}
                        {approval === ApprovalState.APPROVED && (
                          <StyledButton
                            onClick={handleMigrate}
                            disabled={!isValid || approval !== ApprovalState.APPROVED}
                            variant={parsedAmounts[Field.INPUT] ? 'primary' : 'danger'}
                            fullwidth
                          >
                            {migrateInputError ?? 'Migrate'}
                          </StyledButton>
                        )}
                      </AutoColumn>
                    )}
                  </BottomGrouping>
                </ButtonWrap>
              </StyledFlex>
            </CardBody>
          </Wrapper>
        ) : (
          <StyledCardHeader>
            <ComingSoon />
          </StyledCardHeader>
        )}
      </AppBody>
    </CardWrapper>
  )
}

export default Migrate
