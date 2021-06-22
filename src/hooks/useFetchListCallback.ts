import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from '@gravis.finance/sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import useNetwork from './useNetwork'
import { AppDispatch } from '../state'
import { fetchTokenList } from '../state/lists/actions'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/resolveENSContentHash'
import { useActiveWeb3React } from './index'

export function useFetchListCallback(): { fetchList: (listUrl: string) => Promise<TokenList>; refetch: boolean } {
  const { chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const { network, networkLibrary } = useNetwork()
  const [lastChainId, setLastChaindId] = useState<any>()
  const refetch = chainId !== lastChainId

  const ensResolver = useCallback(
    (ensName: string) => {
      if (!library || chainId !== ChainId.MAINNET) {
        if (network === ChainId.MAINNET) {
          if (networkLibrary) {
            return resolveENSContentHash(ensName, networkLibrary)
          }
        }
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, library)
    },
    [chainId, library, network, networkLibrary]
  )
  const fetchList = useCallback(
    async (listUrl: string) => {
      const requestId = nanoid()
      dispatch(fetchTokenList.pending({ requestId, url: listUrl, refetch }))
      return getTokenList(chainId as ChainId, listUrl, ensResolver)
        .then((tokenList) => {
          setLastChaindId(chainId)
          dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch((error) => {
          console.error(`Failed to get list at url ${listUrl}`, error)
          dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }))
          throw error
        })
    },
    [chainId, dispatch, ensResolver, refetch]
  )
  return {
    fetchList,
    refetch,
  }
}

export default useFetchListCallback
