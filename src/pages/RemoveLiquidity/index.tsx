import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { splitSignature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, isEther, Percent, WETH, ChainId } from '@gravis.finance/sdk'
import { BorderedAddIcon, Button, Flex, Text, BorderedArrowDownIcon } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'react-feather'
import { RouteComponentProps } from 'react-router'
import { BigNumber } from '@ethersproject/bignumber'
import { ROUTER_ADDRESS } from 'config/contracts'

import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/Logos/DoubleLogo'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import { RowBetween, RowFixed } from '../../components/Row'

import Slider from '../../components/Slider'
import CurrencyLogo from '../../components/Logos/CurrencyLogo'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { usePairContract } from '../../hooks/useContract'

import { useAllTransactions, useTransactionAdder } from '../../state/transactions/hooks'
import { StyledInternalLink } from '../../components/Shared'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { currencyId } from '../../utils/currencyId'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import AppBody from '../AppBody'
import { ClickableText, Wrapper } from '../Pool/styleds'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { Dots } from '../../components/swap/styleds'
import { useBurnActionHandlers, useDerivedBurnInfo, useBurnState } from '../../state/burn/hooks'

import { Field } from '../../state/burn/actions'
import { useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'

const OutlineCard = styled.div`
  padding: 17px 24px;
  background-color: #353535;
`

const Body = styled.div`
  // padding-left: 24px;
  // padding-right: 24px;
`

const StyledTextAddIcon = styled.div`
  border-radius: 6px;
  display: flex;
  margin: 10px 0;

  > * {
    margin: auto;
  }
`

const StyledReceived = styled(StyledInternalLink)`
  font-size: 10px;
  font-weight: 600;
  margin-top: 16px;
  background: #2d4f5d;
  color: #73d3fe;
  border-radius: 6px;
  padding: 7px 8px;
  :hover {
    text-decoration: none;
  }
`

const StyledPercentButton = styled(Button)`
  height: 24px;
  width: 37px;
  font-size: 10px;
  font-weight: bold;
  background: #2d4f5d;
  border-radius: 6px;
`

const StyledWrapper = styled(Wrapper)`
  margin-top: 0;
`

const StyledPriceContainer = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 6px 8px;
`

const StyledAddIcon = styled.div`
  display: flex;
  margin-left: 20px;
  background: linear-gradient(0deg, #303030, #303030), #ffffff;
  border-radius: 37px;
  padding: 4px;

  > * {
    margin: auto;
  }
`

const RemoveLiquidity = ({
  history,
  match: {
    params: { currencyIdA, currencyIdB },
  },
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) => {
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()
  const [tokenA, tokenB] = useMemo(
    () => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
    [currencyA, currencyB, chainId]
  )

  // const theme = useContext(ThemeContext)

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)
  const { t } = useTranslation()

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    chainId && ROUTER_ADDRESS[chainId]
  )
  const onAttemptToApprove = async () => {
    if (!pairContract || !pair || !library) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')
    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const deadlineForSignature: number = Math.ceil(Date.now() / 1000) + deadline

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]
    const domain = {
      name: 'Gravis LPs',
      version: '1',
      chainId,
      verifyingContract: pair.liquidityToken.address,
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS[chainId as ChainId],
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadlineForSignature,
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: 'Permit',
      message,
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadlineForSignature,
        })
      })
      .catch((e) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (e?.code !== 4001) {
          approveCallback()
        }
      })
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, val: string) => {
      setSignatureData(null)
      return _onUserInput(field, val)
    },
    [_onUserInput]
  )

  const onLiquidityInput = useCallback((val: string): void => onUserInput(Field.LIQUIDITY, val), [onUserInput])
  const onCurrencyAInput = useCallback((val: string): void => onUserInput(Field.CURRENCY_A, val), [onUserInput])
  const onCurrencyBInput = useCallback((val: string): void => onUserInput(Field.CURRENCY_B, val), [onUserInput])

  // useEffect(()=>{
  //   console.log('rerendered')
  // })

  // tx sending
  const addTransaction = useTransactionAdder()
  const onRemove = async () => {
    if (!chainId || !library || !account) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = isEther(currencyB)
    const oneCurrencyIsETH = isEther(currencyA) || currencyBIsETH
    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadlineFromNow,
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadlineFromNow,
        ]
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }
    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName, index) =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((e) => {
            console.error(`estimateGas failed`, index, methodName, args, e)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      await router[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `{{remove}} ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencyA?.symbol
            } {{and}} ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
          })

          setTxHash(response.hash)
        })
        .catch((e: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(e)
        })
    }
  }

  const pendingText = `${t('removing')} ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${currencyA?.symbol} ${t(
    'and'
  )} ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencyB?.symbol}`

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput]
  )

  const oneCurrencyIsETH = isEther(currencyA) || isEther(currencyB)
  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
        (currencyB && currencyEquals(WETH[chainId], currencyB)))
  )

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        history.push(`/remove/${currencyId(currency)}/${currencyIdA}`)
      } else {
        history.push(`/remove/${currencyId(currency)}/${currencyIdB}`)
      }
    },
    [currencyIdA, currencyIdB, history]
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        history.push(`/remove/${currencyIdB}/${currencyId(currency)}`)
      } else {
        history.push(`/remove/${currencyIdA}/${currencyId(currency)}`)
      }
    },
    [currencyIdA, currencyIdB, history]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback
  )

  const { chainId: chain } = useActiveWeb3React()
  const [receivedSymbol] = useState(chain === 56 || chain === 97 ? 'BNB' : 'HT')

  const transaction = useAllTransactions()

  useEffect(() => {
    if (transaction[txHash]?.receipt) {
      setShowConfirm(false)
      setAttemptingTxn(false)
      if (Number(parsedAmounts[Field.LIQUIDITY_PERCENT].toSignificant(6)) === 100) {
        history.push('/pool')
      }
    }
  }, [history, parsedAmounts, transaction, txHash])

  return (
    <>
      <AppBody>
        <AddRemoveTabs adding={false} />
        <StyledWrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            hash={txHash || ''}
            attemptingTxn={attemptingTxn}
            pendingText={pendingText}
          >
            <ConfirmationModalContent
              title={t('youWillReceiveMessage')}
              onDismiss={handleDismissConfirmation}
              topContent={
                <AutoColumn gap="md" style={{ marginTop: '0' }}>
                  <RowBetween
                    style={{
                      background: 'linear-gradient(0deg, #303030, #303030), #F5F7FF',
                      boxShadow: 'inset 0px -1px 0px rgba(129, 129, 129, 0.15)',
                      borderRadius: '43px',
                      padding: '13px 16px',
                    }}
                    alignItems="center"
                  >
                    <Text fontSize="14px">{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</Text>
                    <RowFixed gap="4px">
                      <CurrencyLogo currency={currencyA} size="24px" />
                      <Text fontSize="14px" style={{ marginLeft: '10px' }}>
                        {currencyA?.symbol}
                      </Text>
                    </RowFixed>
                  </RowBetween>
                  <RowFixed>
                    <StyledAddIcon>
                      <BorderedAddIcon width="24px" />
                    </StyledAddIcon>
                  </RowFixed>
                  <RowBetween
                    style={{
                      background: 'linear-gradient(0deg, #303030, #303030), #F5F7FF',
                      boxShadow: 'inset 0px -1px 0px rgba(129, 129, 129, 0.15)',
                      borderRadius: '43px',
                      padding: '13px 16px',
                    }}
                    alignItems="center"
                  >
                    <Text fontSize="14px">{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</Text>
                    <RowFixed gap="4px">
                      <CurrencyLogo currency={currencyB} size="24px" />
                      <Text fontSize="14px" style={{ marginLeft: '10px' }}>
                        {currencyB?.symbol}
                      </Text>
                    </RowFixed>
                  </RowBetween>

                  <Text fontSize="14px" color="rgba(255, 255, 255, 0.5)">
                    {t('outputEstimated')}{' '}
                    <Text style={{ display: 'inline-block' }} fontSize="14px" color="#009CE1">
                      {allowedSlippage / 100}%
                    </Text>{' '}
                    {t('transactionWillRevert')}
                  </Text>
                </AutoColumn>
              }
              bottomContent={
                <>
                  <RowBetween style={{ padding: '6px 8px' }}>
                    <Text color="rgba(255, 255, 255, 0.5)" fontSize="11px">
                      {`${currencyA?.symbol}/${currencyB?.symbol}`} {t('burned')}
                    </Text>
                    <RowFixed>
                      <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin size={24} />
                      <Text fontSize="11px" ml="8px" color="rgba(255, 255, 255, 0.5)">
                        {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
                      </Text>
                    </RowFixed>
                  </RowBetween>
                  {pair && (
                    <StyledPriceContainer>
                      <RowBetween>
                        <Text color="rgba(255, 255, 255, 0.5);" fontSize="11px">
                          {t('price')}
                        </Text>
                        <Text fontSize="11px" color="#009CE1">
                          1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'}{' '}
                          {currencyB?.symbol}
                        </Text>
                      </RowBetween>
                      <RowBetween>
                        <div />
                        <Text fontSize="11px" color="#009CE1">
                          1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'}{' '}
                          {currencyA?.symbol}
                        </Text>
                      </RowBetween>
                    </StyledPriceContainer>
                  )}
                  <Button
                    disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
                    onClick={onRemove}
                    fullwidth
                    style={{ marginBottom: '24px', marginTop: '24px' }}
                    data-id="confirm-button"
                  >
                    {t('confirm')}
                  </Button>
                </>
              }
            />
          </TransactionConfirmationModal>
          <AutoColumn>
            <Body>
              <OutlineCard>
                <AutoColumn gap="8px">
                  <RowBetween>
                    <Text
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontWeight: 500,
                        letterSpacing: '0.3px',
                        fontSize: '16px',
                      }}
                    >
                      {t('amount')}
                    </Text>
                    <ClickableText
                      onClick={() => {
                        setShowDetailed(!showDetailed)
                      }}
                      style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '1px' }}
                      data-id={`${showDetailed ? 'simple' : 'detailed'}-button`}
                    >
                      <Flex alignItems="center">
                        {showDetailed ? t('simple') : t('detailed')}
                        <ChevronDown width="16px" height="16px" />
                      </Flex>
                    </ClickableText>
                  </RowBetween>
                  <Flex justifyContent="start">
                    <Text
                      fontSize="40px"
                      style={{ color: '#fff', fontWeight: 700, letterSpacing: '0.3px', lineHeight: '1' }}
                    >
                      {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                    </Text>
                  </Flex>
                  {!showDetailed && (
                    <>
                      <Flex>
                        <Slider value={innerLiquidityPercentage} onChange={setInnerLiquidityPercentage} />
                      </Flex>
                      <Flex justifyContent="space-between">
                        <StyledPercentButton
                          variant="tertiary"
                          size="sm"
                          onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}
                          data-id="25-percent-button"
                        >
                          25%
                        </StyledPercentButton>
                        <StyledPercentButton
                          variant="tertiary"
                          size="sm"
                          onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}
                          data-id="50-percent-button"
                        >
                          50%
                        </StyledPercentButton>
                        <StyledPercentButton
                          variant="tertiary"
                          size="sm"
                          onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')}
                          data-id="75-percent-button"
                        >
                          75%
                        </StyledPercentButton>
                        <StyledPercentButton
                          variant="tertiary"
                          size="sm"
                          onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                          data-id="100-percent-button"
                        >
                          {t('maxAmountLabel')}
                        </StyledPercentButton>
                      </Flex>
                    </>
                  )}
                </AutoColumn>
              </OutlineCard>
            </Body>
            {!showDetailed && (
              <>
                <ColumnCenter>
                  <StyledTextAddIcon>
                    <BorderedArrowDownIcon width="24px" />
                  </StyledTextAddIcon>
                </ColumnCenter>
                <Body>
                  <OutlineCard style={{ background: 'none', padding: '0 24px' }}>
                    <AutoColumn>
                      <RowBetween style={{ padding: '10px 16px' }}>
                        <Text fontSize="14px" style={{ fontWeight: 500 }}>
                          {formattedAmounts[Field.CURRENCY_A] || '-'}
                        </Text>
                        <RowFixed>
                          <CurrencyLogo currency={currencyA} style={{ marginRight: '12px' }} />
                          <Text fontSize="14px" id="remove-liquidity-tokena-symbol" style={{ fontWeight: 500 }}>
                            {currencyA?.symbol}
                          </Text>
                        </RowFixed>
                      </RowBetween>
                      <RowBetween
                        style={{
                          padding: '10px 16px',
                          borderRadius: '6px',
                          border: ' 1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <Text fontSize="14px" style={{ fontWeight: 500 }}>
                          {formattedAmounts[Field.CURRENCY_B] || '-'}
                        </Text>
                        <RowFixed>
                          <CurrencyLogo currency={currencyB} style={{ marginRight: '12px' }} />
                          <Text fontSize="14px" id="remove-liquidity-tokenb-symbol" style={{ fontWeight: 500 }}>
                            {currencyB?.symbol}
                          </Text>
                        </RowFixed>
                      </RowBetween>
                      {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                        <RowBetween style={{ justifyContent: 'flex-end' }}>
                          {oneCurrencyIsETH ? (
                            <StyledReceived
                              to={`/remove/${isEther(currencyA) ? WETH[chainId].address : currencyIdA}/${
                                isEther(currencyB) ? WETH[chainId].address : currencyIdB
                              }`}
                              data-id="receive-button"
                            >
                              {t('receive')} W{receivedSymbol}
                            </StyledReceived>
                          ) : oneCurrencyIsWETH ? (
                            <StyledReceived
                              to={`/remove/${
                                currencyA && currencyEquals(currencyA, WETH[chainId]) ? 'ETH' : currencyIdA
                              }/${currencyB && currencyEquals(currencyB, WETH[chainId]) ? 'ETH' : currencyIdB}`}
                              data-id="receive-button"
                            >
                              {t('receive')} {receivedSymbol}
                            </StyledReceived>
                          ) : null}
                        </RowBetween>
                      ) : null}
                    </AutoColumn>
                  </OutlineCard>
                </Body>
              </>
            )}
            <Body style={{ padding: '24px' }}>
              {showDetailed && (
                <>
                  <CurrencyInputPanel
                    value={formattedAmounts[Field.LIQUIDITY]}
                    onUserInput={onLiquidityInput}
                    onMax={() => {
                      onUserInput(Field.LIQUIDITY_PERCENT, '100')
                    }}
                    showMaxButton={!atMaxAmount}
                    disableCurrencySelect
                    currency={pair?.liquidityToken}
                    pair={pair}
                    label={t('from')}
                    id="liquidity-amount"
                    customHeight={43}
                  />
                  <ColumnCenter>
                    <StyledTextAddIcon>
                      <BorderedArrowDownIcon width="24px" />
                    </StyledTextAddIcon>
                  </ColumnCenter>
                  <CurrencyInputPanel
                    hideBalance
                    value={formattedAmounts[Field.CURRENCY_A]}
                    onUserInput={onCurrencyAInput}
                    onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                    showMaxButton={!atMaxAmount}
                    currency={currencyA}
                    label={t('output')}
                    onCurrencySelect={handleSelectCurrencyA}
                    id="remove-liquidity-tokena"
                    customHeight={43}
                  />
                  <ColumnCenter>
                    <StyledTextAddIcon>
                      <BorderedAddIcon color="#6C5DD3" width="24px" />
                    </StyledTextAddIcon>
                  </ColumnCenter>
                  <CurrencyInputPanel
                    hideBalance
                    value={formattedAmounts[Field.CURRENCY_B]}
                    onUserInput={onCurrencyBInput}
                    onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                    showMaxButton={!atMaxAmount}
                    currency={currencyB}
                    label={t('output')}
                    onCurrencySelect={handleSelectCurrencyB}
                    id="remove-liquidity-tokenb"
                    customHeight={43}
                  />
                </>
              )}
              {pair && (
                <div style={{ padding: '32px 0' }}>
                  <Flex justifyContent="space-between" mb="8px">
                    <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', fontWeight: 500 }}>
                      {t('price')}:
                    </Text>
                    <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                      1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <div />
                    <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                      1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
                    </Text>
                  </Flex>
                </div>
              )}
              <div style={{ position: 'relative' }}>
                {!account ? (
                  <ConnectWalletButton fullwidth />
                ) : (
                  <RowBetween>
                    <Button
                      onClick={onAttemptToApprove}
                      variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'success' : 'primary'}
                      disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                      mr="8px"
                      data-id="approve-button"
                    >
                      {approval === ApprovalState.PENDING ? (
                        <Dots>Approving</Dots>
                      ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                        t('approved')
                      ) : (
                        t('approve')
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowConfirm(true)
                      }}
                      disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                      variant={
                        !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                          ? 'danger'
                          : 'primary'
                      }
                      data-id="remove-button"
                    >
                      {error || t('remove')}
                    </Button>
                  </RowBetween>
                )}
              </div>
            </Body>
          </AutoColumn>
        </StyledWrapper>
      </AppBody>

      {pair ? (
        <AutoColumn style={{ minWidth: '20rem', marginTop: '1rem' }}>
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
        </AutoColumn>
      ) : null}
    </>
  )
}

export default RemoveLiquidity
