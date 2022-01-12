import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, isEther, TokenAmount, WETH, ChainId } from '@gravis.finance/sdk'
import { BorderedAddIcon, Button, CardBody, Text, Text as UIKitText, useModal, Spinner } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import Card from 'components/Card'
import { AutoColumn, ColumnCenter } from 'components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import CardNav from 'components/CardNav'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import DoubleCurrencyLogo from 'components/Logos/DoubleLogo'
import { AddRemoveTabs } from 'components/NavigationTabs'
import { MinimalPositionCard } from 'components/PositionCard'
import Row, { AutoRow, RowBetween, RowFlat } from 'components/Row'
import { PairState } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Field } from 'state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint/hooks'

import { useAllTransactions, useTransactionAdder } from 'state/transactions/hooks'
import { useIsExpertMode, useUserDeadline, useUserSlippageTolerance } from 'state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'utils'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { currencyId } from 'utils/currencyId'
import Pane from 'components/Pane'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ROUTER_ADDRESS } from 'config/contracts'
import { addDataLayerEvent } from 'utils/addDataLayerEvent'
import { DATA_LAYER_EVENTS } from 'constants/data-layer-events'

import AppBody from '../AppBody'
import { Wrapper } from '../Pool/styleds'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import { PoolPriceBar } from './PoolPriceBar'
import ProgressSteps from '../../components/ProgressSteps'
import { TransactionErrorModal } from '../../components/TransactionErrorModal'

const CardWrapper = styled.div`
  width: 100%;
`

const StyledAddIcon = styled.div`
  border-radius: 6px;
  display: flex;
  > * {
    margin: auto;
  }
`

// const StyledFirstProviderContainer = styled.div`
//   width: 100%;
//   text-align: center;
//   > div > div {
//     color: #8990a5;
//   }
//   margin-bottom: 20px;
// `

const StyledUIKitText = styled(UIKitText)`
  @media screen and (max-width: 600px) {
    text-align: center;
  }
`

const StyledRowBetween = styled(RowBetween)`
  @media screen and (max-width: 530px) {
    flex-direction: column;
    > button {
      margin-right: 0 !important;
    }
    > button:not(:last-child) {
      margin-bottom: 8px;
    }
  }
`

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId])))
  )
  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const [deadline] = useUserDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')
  const { t } = useTranslation()

  const [transactionErrorModal] = useModal(<TransactionErrorModal />)

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(chainId as ChainId, currencyBalances[field]),
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {}
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    chainId && ROUTER_ADDRESS[chainId]
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    chainId && ROUTER_ADDRESS[chainId]
  )

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmittedA, setApprovalSubmittedA] = useState<boolean>(false)
  const [approvalSubmittedB, setApprovalSubmittedB] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalA === ApprovalState.PENDING) {
      setApprovalSubmittedA(true)
    }
  }, [approvalA, approvalSubmittedA])

  useEffect(() => {
    if (approvalB === ApprovalState.PENDING) {
      setApprovalSubmittedB(true)
    }
  }, [approvalB, approvalSubmittedB])

  const addTransaction = useTransactionAdder()

  const onAdd = async () => {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline

    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<string | string[] | number>
    let value: BigNumber | null
    if (isEther(currencyA) || isEther(currencyB)) {
      const tokenBIsETH = isEther(currencyB)
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadlineFromNow,
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadlineFromNow,
      ]
      value = null
    }

    setAttemptingTxn(true)
    // const aa = await estimate(...args, value ? { value } : {})
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        })
          .then((response) => {
            response.wait().then(() => addDataLayerEvent(DATA_LAYER_EVENTS.ADD_LIQUIDITY, value?.toString()))
            setAttemptingTxn(false)

            addTransaction(response, {
              summary: `{{add}} ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
                currencies[Field.CURRENCY_A]?.symbol
              } {{and}} ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
            })

            setTxHash(response.hash)
          })
          .catch((e) => {
            setAttemptingTxn(false)
            // we only care if the error is something _other_ than the user rejected the tx
            if (e?.code !== 4001) {
              console.error(e)
              transactionErrorModal()
            }
          })
      )
      .catch((e) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 4001) {
          console.error(e)
          transactionErrorModal()
        }
      })
  }

  const pendingText = `${t('supplying')} ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } ${t('and')} ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`

  const handleCurrencyASelect = useCallback(
    (currA: Currency) => {
      setApprovalSubmittedA(false)
      const newCurrencyIdA = currencyId(currA)
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else {
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, history, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currB: Currency) => {
      setApprovalSubmittedB(false)
      const newCurrencyIdB = currencyId(currB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        history.push(`/add/${currencyIdA || 'ETH'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const [approvalArray, setApprovalArray] = useState([
    approvalA === ApprovalState.APPROVED,
    approvalB === ApprovalState.APPROVED,
  ])

  useEffect(() => {
    if (approvalA === ApprovalState.APPROVED) setApprovalArray([approvalB === ApprovalState.APPROVED])
    if (approvalB === ApprovalState.APPROVED) setApprovalArray([approvalA === ApprovalState.APPROVED])
  }, [approvalA, approvalB])

  const transactions = useAllTransactions()

  useEffect(() => {
    if (txHash) if (transactions[txHash]?.receipt) setShowConfirm(false)
  }, [txHash, transactions])

  useEffect(() => {
    onFieldAInput('')
    // eslint-disable-next-line
  }, [])

  return (
    <CardWrapper>
      <CardNav activeIndex={1} />
      <AppBody>
        <AddRemoveTabs adding />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            pendingText={pendingText}
          >
            <ConfirmationModalContent
              title={noLiquidity ? t('creatingPool') : t('youWillReceivePart')}
              onDismiss={handleDismissConfirmation}
              topContent={
                noLiquidity ? (
                  <AutoColumn gap="20px">
                    <Card mt="20px" borderRadius="20px" padding="0">
                      <RowFlat>
                        <UIKitText fontSize="24px" mr="8px">
                          {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}
                        </UIKitText>
                        <DoubleCurrencyLogo
                          currency0={currencies[Field.CURRENCY_A]}
                          currency1={currencies[Field.CURRENCY_B]}
                          size={24}
                        />
                      </RowFlat>
                    </Card>
                  </AutoColumn>
                ) : (
                  <AutoColumn gap="10px">
                    <RowFlat>
                      <UIKitText fontSize="24px" mr="8px">
                        {liquidityMinted?.toSignificant(6)}
                      </UIKitText>
                      <DoubleCurrencyLogo
                        currency0={currencies[Field.CURRENCY_A]}
                        currency1={currencies[Field.CURRENCY_B]}
                        size={24}
                      />
                    </RowFlat>
                    <Row>
                      <UIKitText fontSize="22px">
                        {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol} ${t(
                          'poolTokens'
                        )}`}
                      </UIKitText>
                    </Row>
                    <Text fontSize="14px" color="rgba(255, 255, 255, 0.5)">
                      {t('outputEstimatedRevert')} <span style={{ color: '#009CE1' }}>{allowedSlippage / 100}%</span>{' '}
                      {t('transactionWillRevert')}
                    </Text>
                  </AutoColumn>
                )
              }
              bottomContent={
                <ConfirmAddModalBottom
                  price={price}
                  currencies={currencies}
                  parsedAmounts={parsedAmounts}
                  noLiquidity={noLiquidity}
                  onAdd={onAdd}
                  poolTokenPercentage={poolTokenPercentage}
                />
              }
            />
          </TransactionConfirmationModal>
          <CardBody>
            <AutoColumn gap="20px">
              {noLiquidity && (
                <ColumnCenter>
                  <AutoColumn style={{ marginTop: '-15px', marginBottom: '10px' }}>
                    <UIKitText style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center' }}>
                      {t('firstLiquidityProvider')}
                    </UIKitText>
                    <UIKitText style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center' }}>
                      {t('theRatio')}
                    </UIKitText>
                    <UIKitText style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center' }}>
                      {t('onceYouHappy')}
                    </UIKitText>
                  </AutoColumn>
                </ColumnCenter>
              )}
              <CurrencyInputPanel
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onFieldAInput}
                onMax={() => {
                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                }}
                onCurrencySelect={handleCurrencyASelect}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                currency={currencies[Field.CURRENCY_A]}
                id="add-liquidity-input-tokena"
                showCommonBases
              />
              <ColumnCenter>
                <StyledAddIcon>
                  <BorderedAddIcon color="#6C5DD3" width="24px" />
                </StyledAddIcon>
              </ColumnCenter>
              <CurrencyInputPanel
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={onFieldBInput}
                onCurrencySelect={handleCurrencyBSelect}
                onMax={() => {
                  onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                }}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                currency={currencies[Field.CURRENCY_B]}
                id="add-liquidity-input-tokenb"
                showCommonBases
              />
              {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                <div>
                  <StyledUIKitText
                    style={{ textTransform: 'uppercase', fontWeight: 600 }}
                    color="rgba(255,255,255,0.7)"
                    fontSize="12px"
                    mb="2px"
                  >
                    {noLiquidity ? t('initialPricesAndPoolShare') : t('pricesAndPoolShare')}
                  </StyledUIKitText>
                  <Pane>
                    <PoolPriceBar
                      currencies={currencies}
                      poolTokenPercentage={poolTokenPercentage}
                      noLiquidity={noLiquidity}
                      price={price}
                    />
                  </Pane>
                </div>
              )}

              {!account ? (
                <ConnectWalletButton fullwidth />
              ) : (
                <AutoColumn gap="md">
                  {isValid ? (
                    <>
                      <StyledRowBetween>
                        {approvalA !== ApprovalState.APPROVED && currencies[Field.CURRENCY_A]?.symbol && (
                          <Button
                            onClick={approveACallback}
                            disabled={approvalA !== ApprovalState.NOT_APPROVED || approvalSubmittedA}
                            style={{ width: '100%', marginRight: '24px' }}
                            data-id="first-approve-button"
                          >
                            {approvalA === ApprovalState.PENDING ? (
                              <AutoRow gap="6px" justify="center">
                                {t('approving')} {currencies[Field.CURRENCY_A]?.symbol} <Spinner size={30} />
                              </AutoRow>
                            ) : (
                              `${t('approve')} ${currencies[Field.CURRENCY_A]?.symbol}`
                            )}
                          </Button>
                        )}
                        {approvalB !== ApprovalState.APPROVED && currencies[Field.CURRENCY_B]?.symbol && (
                          <Button
                            onClick={approveBCallback}
                            disabled={approvalB !== ApprovalState.NOT_APPROVED || approvalSubmittedB}
                            style={{ width: '100%', marginRight: '24px' }}
                            data-id="second-approve-button"
                          >
                            {approvalB === ApprovalState.PENDING ? (
                              <AutoRow gap="6px" justify="center">
                                {t('approving')} {currencies[Field.CURRENCY_B]?.symbol} <Spinner size={30} />
                              </AutoRow>
                            ) : (
                              `${t('approve')} ${currencies[Field.CURRENCY_B]?.symbol}`
                            )}
                          </Button>
                        )}
                        <Button
                          onClick={() => {
                            if (expertMode) {
                              onAdd()
                            } else {
                              setShowConfirm(true)
                            }
                          }}
                          disabled={
                            !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED
                          }
                          variant={
                            !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                              ? 'danger'
                              : 'primary'
                          }
                          fullwidth={approvalArray.length > 0}
                          data-id="first-supply-button"
                        >
                          {error ?? t('supply')}
                        </Button>
                      </StyledRowBetween>
                      {approvalArray.length > 0 && (
                        <ProgressSteps steps={approvalArray} groupingWidth={approvalArray.length === 2} />
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        if (expertMode) {
                          onAdd()
                        } else {
                          setShowConfirm(true)
                        }
                      }}
                      disabled={
                        !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED
                      }
                      variant={
                        !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                          ? 'danger'
                          : 'primary'
                      }
                      fullwidth
                      data-id="second-supply-button"
                    >
                      {error ?? t('supply')}
                    </Button>
                  )}
                </AutoColumn>
              )}
            </AutoColumn>
          </CardBody>
        </Wrapper>
      </AppBody>
      {pair && !noLiquidity && pairState !== PairState.INVALID ? (
        <AutoColumn style={{ minWidth: '20rem', marginTop: '1rem' }}>
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
        </AutoColumn>
      ) : null}
    </CardWrapper>
  )
}
