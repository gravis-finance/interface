/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { ChainId, Currency, CurrencyAmount } from '@gravis.finance/sdk'
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
import { tryParseAmount } from 'state/swap/hooks'
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
import { useCurrencyBalances } from '../../state/wallet/hooks'
import getExhangeName from '../../utils/getExhangeName'

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
  // if (!(tokenInfo instanceof WrappedTokenInfo)) console.log(tokenInfo)
  return tokenInfo
}

function Migrate() {
  const vampire: any = useVampireContract()
  const [lpList, setLpList] = useState<any>()
  const { account, chainId } = useActiveWeb3React()
  const [tokenList, setTokenList] = useState<any>([])

  const networkId = getNetworkId()
  const isVampiringAvailable = [+networkId, chainId].every(
    (id) =>
      id === ChainId.BSCTESTNET || id === ChainId.MAINNET || id === ChainId.MATICTESTNET || id === ChainId.MATICMAINNET
  )
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
      address: useTokenAddress(tokenList[i]?.address),
    }))
  // FIXME: HARDCODE 18
  const filteredTokenInfo = useBaseTokenInfo(18).filter((item) => item.left !== undefined && item.right !== undefined)

  useEffect(() => {
    if (!isVampiringAvailable) return
    const enrichedTokenInfo = tokenList.map((_, i) => {
      const id: any = chainId
      const info = new WrappedTokenInfo(
        {
          name: `${filteredTokenInfo[i]?.left?.name} / ${filteredTokenInfo[i]?.right?.name} LP Token`,
          symbol: `${
            filteredTokenInfo[i]?.address
              ? `${getExhangeName(filteredTokenInfo[i]?.address?.name)}:`
              : `${t('loading')}...`
          } ${filteredTokenInfo[i]?.left?.symbol} / ${filteredTokenInfo[i]?.right?.symbol} LP`,
          address: tokenList[i].address,
          chainId: id,
          decimals: 18,
        },
        [],
        getExhangeName(filteredTokenInfo[i]?.address?.name)
      )
      return info
    })
    if (JSON.stringify(enrichedTokenInfo) !== JSON.stringify(lpList)) setLpList(enrichedTokenInfo)
  }, [t, lpList, chainId, filteredTokenInfo, tokenList, isVampiringAvailable])

  const [typedValue, setTypedValue] = React.useState('')
  const [currency, setCurrency] = useState<Currency | null>(null)
  const currencyBalance = useCurrencyBalances(account ?? undefined, [currency ?? undefined])[0]
  const parsedAmount = tryParseAmount(chainId as ChainId, typedValue, currency ?? undefined)
  let inputError: string | undefined
  if (!account) {
    inputError = t('connectWallet')
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('enterAmount')
  }

  if (!currency) {
    inputError = inputError ?? t('selectToken')
  }

  const isValid = !inputError

  const handleTypeInput = useCallback((value: string) => {
    setTypedValue(value)
  }, [])

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(parsedAmount, chainId && VAMPIRE_ADDRESS[chainId])
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

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(chainId as ChainId, currencyBalance)
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))

  const addTransaction = useTransactionAdder()

  const transaction = useAllTransactions()

  useEffect(() => {
    if (transaction[txHash]) setAttemptingTxn(false)
  }, [transaction, txHash])

  const handleMigrate = () => {
    setAttemptingTxn(true)
    const tokenAmount = BigNumber.from(parsedAmount?.raw.toString())
    const activeToken: any = currency

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
              summary: `{{mainMenu.migrate}} ${activeToken.symbol}`,
            })
            setTxHash(resp.hash)
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
      const changedInputCurrency = inputCurrency
      // @ts-ignore
      changedInputCurrency.symbol = inputCurrency.tokenInfo.name
      setCurrency(changedInputCurrency)
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      // onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [setApprovalSubmitted]
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      setTypedValue(maxAmountInput.toExact())
    }
  }, [maxAmountInput])

  return (
    <CardWrapper>
      <CardNav activeIndex={2} />
      <AppBody>
        <TransactionConfirmationModal
          isOpen={isConfirmationModalOpen}
          onDismiss={() => setConfirmationModalOpen(false)}
          hash={txHash}
          attemptingTxn={attemptingTxn}
          pendingText={`${t('mainMenu.migrate')} ${currency?.symbol}`}
        >
          <TransactionErrorContent onDismiss={() => setConfirmationModalOpen(false)} message={migrateErrorMessage} />
        </TransactionConfirmationModal>
        {isVampiringAvailable ? (
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
                    value={typedValue}
                    showMaxButton={!atMaxAmountInput}
                    currency={currency}
                    onUserInput={handleTypeInput}
                    onMax={handleMaxInput}
                    onCurrencySelect={handleInputSelect}
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
                          <StyledButton onClick={handleMigrate} disabled fullwidth>
                            {currency ? t('enterAmount') : t('chooseToken')}
                          </StyledButton>
                        )}
                        {(approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) && (
                          <RowBetween>
                            <StyledButton onClick={approveCallback} disabled={approval === ApprovalState.PENDING}>
                              {approval === ApprovalState.PENDING ? <Dots>Approving</Dots> : `Approve`}
                            </StyledButton>
                          </RowBetween>
                        )}
                        {approval === ApprovalState.APPROVED && (
                          <StyledButton
                            onClick={handleMigrate}
                            disabled={!isValid || approval !== ApprovalState.APPROVED}
                            variant={parsedAmount ? 'primary' : 'danger'}
                            fullwidth
                          >
                            {inputError ?? 'Migrate'}
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
