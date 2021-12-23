import React, { KeyboardEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Currency, BASE_CURRENCIES, Token, ChainId } from '@gravis.finance/sdk'
import { Text, CloseIcon, IconButton, AddIcon, Button, Spinner } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'
import styled, { ThemeContext } from 'styled-components'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens, useToken } from '../../hooks/Tokens'
import { useSelectedListInfo } from '../../state/lists/hooks'
import { LinkStyledButton, TYPE } from '../Shared'
import { isAddress } from '../../utils'
import Card from '../Card'
import Column from '../Column'
import ListLogo from '../ListLogo'
import QuestionHelper from '../QuestionHelper'
import Row, { RowBetween } from '../Row'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { filterTokens } from './filtering'
import SortButton from './SortButton'
import { useTokenComparator } from './sorting'
import { PaddedColumn, SearchInput, Separator } from './styleds'

const { main: Main } = TYPE

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  onChangeList: () => void
  currencyList?: any
  addCustomTokenHandler?: () => void
  loading?: boolean
}

const StyledRowBetween = styled.div`
  padding: 0 22px 8px 22px;
`

const StyledCurrencyList = styled.div`
  flex: 1;
  padding-left: 16px;
`

const StyledSearchInput = styled.div`
  position: relative;
  margin-top: -8px;
  margin-bottom: 12px;
  input::placeholder {
    letter-spacing: 0.1px;
  }
`

const StyledRemoveIcon = styled.div`
  position: absolute;
  top: 15px;
  right: 70px;
  cursor: pointer;
`

const StyledAddCustomToken = styled.div`
  position: absolute;
  top: 15px;
  right: 40px;
  cursor: pointer;

  * {
    cursor: pointer;
  }

  > *:last-child {
    position: absolute;
    left: -5px;
    opacity: 0;
  }
`

const NothingFoundContainer = styled.div`
  height: 60%;
  display: flex;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    > button {
      margin-top: 16px;
    }
  }
`

const SpinnerContainer = styled.div`
  width: 100%;
  margin-top: 24px;
  display: flex;
  justify-content: center;
`

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  onChangeList,
  currencyList,
  addCustomTokenHandler,
  loading,
}: CurrencySearchProps) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)
  // const [addCustomTokenModal] = useModal(<AddCustomTokenModal />)
  const globalTokenList = useAllTokens()
  const allTokens = currencyList || globalTokenList

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  const showETH: boolean = useMemo(() => {
    const s = searchQuery.toLowerCase().trim()
    if (currencyList) return false
    return s === '' || s === 'b' || s === 'bn' || s === 'bnb'
  }, [currencyList, searchQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(allTokens), searchQuery)
  }, [isAddressSearch, searchToken, allTokens, searchQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    if(filteredTokens.find(token=>token.symbol === 'GRVX'))
      filteredTokens.unshift(...filteredTokens.splice(filteredTokens.findIndex(token=>token.symbol === 'GRVX'),1))

    return [
      ...(searchToken ? [searchToken] : []),
      // sort any exact symbol matches first
      ...sorted.filter((token) => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter((token) => token.symbol?.toLowerCase() !== symbolMatch[0]),
    ]
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        if (s === 'bnb') {
          handleCurrencySelect(BASE_CURRENCIES[chainId as ChainId])
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, searchQuery, chainId]
  )

  const selectedListInfo = useSelectedListInfo()

  const handleRemove = () => setSearchQuery('')

  // useEffect(() => {
  //   console.log('filteredSortedTokens', filteredSortedTokens.find(token=>token.symbol === 'GRVX'))
  //   if(filteredSortedTokens.find(token=>token.symbol === 'GRVX'))
  //     filteredSortedTokens.unshift(...filteredSortedTokens.splice(filteredSortedTokens.findIndex(token=>token.symbol === 'GRVX'),1))
  // }, [filteredSortedTokens])

  return (
    <>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap="14px">
          <RowBetween>
            <Text style={{ display: 'flex', alignItems: 'center', fontSize: '18px', letterSpacing: '-0.3px' }} bold>
              {t('selectToken')}
              <QuestionHelper text={t('questionHelperMessages.findTokenBySearching')} empty bordered={false} big />
            </Text>
            <IconButton buttonType="close" buttonSize="40px" onClick={onDismiss} data-id="modal-close-icon">
              <CloseIcon />
            </IconButton>
          </RowBetween>
          <Separator />
          <StyledSearchInput>
            <SearchInput
              type="text"
              data-id="token-search-input"
              placeholder={t('tokenSearchPlaceholder')}
              value={searchQuery}
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              onKeyDown={handleEnter}
            />
            {/* TODO Remove display: none */}
            {!window.location.pathname.includes('migrate') && (
              <StyledAddCustomToken onClick={addCustomTokenHandler} data-id="add-custom-token-button">
                <AddIcon />
                <QuestionHelper text={t('questionHelperMessages.addCustomToken')} />
              </StyledAddCustomToken>
            )}
            <StyledRemoveIcon onClick={handleRemove} data-id="clear-search-button">
              {searchQuery.length > 0 && <CloseIcon />}
            </StyledRemoveIcon>
          </StyledSearchInput>
          {showCommonBases && (
            <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
          )}
          <StyledRowBetween>
            <RowBetween>
              <Text fontSize="15px" bold>
                {t('tokenName')}
              </Text>
              <SortButton ascending={invertSearchOrder} toggleSortOrder={() => setInvertSearchOrder((iso) => !iso)} />
            </RowBetween>
          </StyledRowBetween>
        </PaddedColumn>
        {filteredSortedTokens.length === 0 && !loading && (
          <NothingFoundContainer>
            <div>
              <Text>
                {t('nothingFound')}
                {/* . Use Add Custom Token feature. */}
              </Text>
              {!window.location.pathname.includes('migrate') && (
                <Button onClick={addCustomTokenHandler}>
                  <AddIcon style={{ marginRight: '8px' }} />
                  {t('addToken')}
                </Button>
              )}
            </div>
          </NothingFoundContainer>
        )}

        {loading ? (
          <SpinnerContainer>
            <Spinner size={80} />
          </SpinnerContainer>
        ) : (
          <StyledCurrencyList>
            <AutoSizer disableWidth>
              {({ height }) => (
                <CurrencyList
                  height={height}
                  showETH={showETH}
                  currencies={filteredSortedTokens}
                  onCurrencySelect={handleCurrencySelect}
                  otherCurrency={otherSelectedCurrency}
                  selectedCurrency={selectedCurrency}
                  fixedListRef={fixedList}
                />
              )}
            </AutoSizer>
          </StyledCurrencyList>
        )}

        {null && (
          <>
            <Separator />
            <Card>
              <RowBetween>
                {selectedListInfo.current ? (
                  <Row>
                    {selectedListInfo.current.logoURI ? (
                      <ListLogo
                        style={{ marginRight: 12 }}
                        logoURI={selectedListInfo.current.logoURI}
                        alt={`${selectedListInfo.current.name} list logo`}
                      />
                    ) : null}
                    <Main id="currency-search-selected-list-name">{selectedListInfo.current.name}</Main>
                  </Row>
                ) : null}
                <LinkStyledButton
                  style={{ fontWeight: 500, color: theme.colors.textSubtle, fontSize: 16 }}
                  onClick={onChangeList}
                  id="currency-search-change-list-button"
                >
                  {selectedListInfo.current ? 'Change' : 'Select a list'}
                </LinkStyledButton>
              </RowBetween>
            </Card>
          </>
        )}
      </Column>
    </>
  )
}

export default CurrencySearch
