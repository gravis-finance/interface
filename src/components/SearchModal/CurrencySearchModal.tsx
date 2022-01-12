import { Currency } from '@gravis.finance/sdk'
import React, { lazy, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  AddIcon,
  Button,
  CloseIcon,
  Flex,
  IconButton,
  Input,
  Text,
  ArrowBackIcon,
  Spinner,
} from '@gravis.finance/uikit'
import useLast from '../../hooks/useLast'
import { useSelectedListUrl } from '../../state/lists/hooks'
import { CurrencySearch } from './CurrencySearch'
import { ListSelect } from './ListSelect'
import { PaddedColumn, Separator } from './styleds'
import { RowBetween } from '../Row'
import Column from '../Column'
import { useToken } from '../../hooks/Tokens'
import { useAddUserToken, useUserAddedTokens } from '../../state/user/hooks'

const Modal = lazy(() => import('../Modal'))

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  // eslint-disable-next-line react/no-unused-prop-types
  showCommonBases?: boolean
  currencyList?: any
  loading?: boolean
}

const WarningContainer = styled.div`
  color: #ff4d00;
  line-height: 20px;
  font-size: 14px;
`

const ModalBody = styled.div`
  margin-top: 20px;

  > input {
    margin-top: 10px;
  }
`

const StyledInputContainer = styled.div`
  position: relative;

  > div:first-child {
    position: absolute;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    background: #414141;
    border-radius: 2px;
    padding: 0 2px;
    top: -8px;
    left: 12px;
  }
`

const SpinnerContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;

  > div > svg * {
    stroke: white;
    fill: white;
  }
`

const SearchTokenInput = styled(Input)<{ error?: boolean }>`
  margin-top: 10px;
  height: 48px;
  padding-right: 45px;
  border: 1px solid ${({ error }) => (error ? '#FF4D00' : 'transparent')};

  :focus,
  :active,
  :hover {
    border: 1px solid ${({ error }) => (error ? '#FF4D00' : 'transparent')} !important;
  }
`

const StyledColumn = styled(Column)`
  height: fit-content;
  margin: auto;
  border-radius: 8px;
`

const StyledBody = styled.div`
  padding: 0 20px 8px 20px;
`

const TokenInfoBlock = styled.div`
  width: 100%;
`

const StyledText = styled(Text)`
  color: #909090;
  font-size: 14px;
`

const AddTokenButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: 80px;
  button {
    // margin: auto;
    height: 42px;
  }
`

const StyledFlex = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
`

const InfoFlex = styled(Flex)`
  padding: 8px 16px;
`

const ErrorText = styled(Text)`
  font-size: 11px;
  color: #ff4d00;
  margin-top: 4px;
`

const StyledButton = styled(Button)`
  padding: 0 16px;
  ${({ disabled }) =>
    disabled
      ? `
    > svg * {
      fill: rgba(255,255,255,0.4);
    }
  `
      : ''}
  > svg {
    margin-right: 16px;
  }
`

const Footer = styled.div`
  display: flex;
  padding: 6px 16px 22px 24px;
  cursor: pointer;

  > div {
    color: #009ce1;
  }

  > svg * {
    stroke: #009ce1;
  }
`

const AddCustomTokenModal = ({ onDismiss }) => {
  const [errorMessage, setErrorMessage] = useState('')
  const { t } = useTranslation()
  let timer
  const [tokenAddress, setTokenAddress] = useState<string | undefined>('xxx')
  const tokenInfo = useToken(tokenAddress)
  const addToken = useAddUserToken()

  // const isTaken = useIsUserAddedToken(tokenInfo || null)
  const userAddedTokens = useUserAddedTokens()

  const onChangeHandler = (e) => {
    clearTimeout(timer)
    setTokenAddress(undefined)
    setErrorMessage('')
    if (e.target.value.length > 0) {
      if (e.target.value.slice(0, 2) !== '0x') setErrorMessage(t('invalidTokenAddress'))
      else if (userAddedTokens.find((token) => token.address.toLowerCase() === e.target.value.toLowerCase()))
        setErrorMessage(t('errorMessages.tokenAlreadyAdded'))
      else setErrorMessage('')
    } else setErrorMessage('')
    timer = setTimeout(() => {
      setTokenAddress(e.target.value)
    }, 500)
  }

  const onAddButtonClick = () => {
    addToken(tokenInfo)
    onDismiss()
  }

  useEffect(() => {
    if (!tokenInfo) setTimeout(() => setErrorMessage(t('nothingFound')), 12000)
    else {
      setErrorMessage('')
    }
  }, [tokenAddress, tokenInfo, t])

  // useEffect(() => {
  //   if(tokenAddress && tokenAddress.length>1)
  //     if(!tokenInfo) setErrorMessage('token not found')
  // }, [tokenAddress, tokenInfo])

  return (
    <StyledColumn>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text style={{ display: 'flex', alignItems: 'center', fontSize: '18px', letterSpacing: '-0.3px' }} bold>
            {t('addCustomToken')}
          </Text>
          <IconButton buttonType="close" buttonSize="40px" onClick={onDismiss} data-id="modal-close-icon">
            <CloseIcon />
          </IconButton>
        </RowBetween>
        <Separator />
        <StyledBody>
          <WarningContainer>{t('errorMessages.tokenNotWhitelisted')}</WarningContainer>
          <ModalBody>
            <StyledInputContainer>
              <Text>{t('tokenAddress')}</Text>
              <SearchTokenInput
                type="text"
                onChange={onChangeHandler}
                data-id="custom-token-input"
                error={errorMessage.length > 0}
              />
              {!tokenInfo &&
                tokenAddress &&
                tokenAddress !== 'xxx' &&
                (tokenAddress?.length as number) > 0 &&
                errorMessage.length === 0 && (
                  <SpinnerContainer>
                    <Spinner size={30} />
                  </SpinnerContainer>
                )}
              {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            </StyledInputContainer>
            <StyledFlex>
              <TokenInfoBlock>
                <InfoFlex justifyContent="space-between">
                  <StyledText>{t('tokenSymbol')}:</StyledText>
                  <StyledText data-id="custom-token-symbol">{tokenInfo?.symbol ? tokenInfo?.symbol : '—'}</StyledText>
                </InfoFlex>
                <InfoFlex
                  justifyContent="space-between"
                  style={{ border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '6px' }}
                >
                  <StyledText>{t('tokenName')}:</StyledText>
                  <StyledText data-id="custom-token-name">{tokenInfo?.name ? tokenInfo.name : '—'}</StyledText>
                </InfoFlex>
                <InfoFlex justifyContent="space-between">
                  <StyledText>{t('tokenDecimals')}</StyledText>
                  <StyledText data-id="custom-token-decimals">
                    {tokenInfo?.decimals ? tokenInfo?.decimals : '—'}
                  </StyledText>
                </InfoFlex>
              </TokenInfoBlock>
            </StyledFlex>
            <AddTokenButtonContainer>
              <StyledButton
                disabled={(errorMessage.length > 0 || !tokenInfo) as boolean}
                data-id="add-token-button"
                onClick={onAddButtonClick}
              >
                <AddIcon />
                {t('addToken')}
              </StyledButton>
            </AddTokenButtonContainer>
          </ModalBody>
        </StyledBody>
        <Separator />
        <Footer onClick={onDismiss}>
          <ArrowBackIcon />
          <Text>{t('returnToSelectTokens')}</Text>
        </Footer>
      </PaddedColumn>
    </StyledColumn>
  )
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  currencyList,
  loading,
  showCommonBases,
}: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false)
    }
  }, [isOpen, lastOpen])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  const [isCustomTokenModalOpened, setIsCustomTokenModalOpened] = useState(false)

  const handleClickChangeList = useCallback(() => {
    setListView(true)
  }, [])
  const handleClickBack = useCallback(() => {
    setListView(false)
  }, [])

  const selectedListUrl = useSelectedListUrl()
  const noListSelected = !selectedListUrl

  const addCustomTokenHandler = () => {
    setIsCustomTokenModalOpened(true)
  }

  const onDismissHandler = () => {
    if (isCustomTokenModalOpened) setIsCustomTokenModalOpened(false)
    else onDismiss()
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismissHandler}
      maxHeight={90}
      minHeight={listView ? 40 : noListSelected ? 0 : 80}
      istransparent
    >
      {!isCustomTokenModalOpened ? (
        listView ? (
          <ListSelect onDismiss={onDismiss} onBack={handleClickBack} />
        ) : noListSelected ? (
          <CurrencySearch
            isOpen={isOpen}
            onDismiss={onDismiss}
            onCurrencySelect={handleCurrencySelect}
            onChangeList={handleClickChangeList}
            selectedCurrency={selectedCurrency}
            otherSelectedCurrency={otherSelectedCurrency}
            showCommonBases={showCommonBases}
            currencyList={currencyList}
            addCustomTokenHandler={addCustomTokenHandler}
            loading={loading}
          />
        ) : (
          <CurrencySearch
            isOpen={isOpen}
            onDismiss={onDismiss}
            onCurrencySelect={handleCurrencySelect}
            onChangeList={handleClickChangeList}
            selectedCurrency={selectedCurrency}
            otherSelectedCurrency={otherSelectedCurrency}
            showCommonBases={showCommonBases}
            currencyList={currencyList}
            addCustomTokenHandler={addCustomTokenHandler}
            loading={loading}
          />
        )
      ) : (
        <AddCustomTokenModal onDismiss={() => setIsCustomTokenModalOpened(false)} />
      )}
    </Modal>
  )
}
