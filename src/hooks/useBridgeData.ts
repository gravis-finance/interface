import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { BACKEND_NETWORK_NAMES, NETWORK_NAME_CHAIN_ID } from 'constants/network'

import useGetTokensData from './useGetTokensData'

const BRIDGE_DATA_KEY = 'BRIDGE_DATA_KEY'

const BRIDGE_DATA_URL = `${process.env.REACT_APP_ASSETS_API_URL}/bridge/transfers`

const fetchBridgeData = async () => {
  const result = await fetch(BRIDGE_DATA_URL).then((res) => res.json())
  return result.data
}

const useBridgeTokensTransfered = () => {
  return useQuery(BRIDGE_DATA_KEY, fetchBridgeData)
}

const useBridgeDollarsTransfered = () => {
  const { isLoading: isTokenDataLoading, data: tokenData } = useGetTokensData([
    BACKEND_NETWORK_NAMES[NETWORK_NAME_CHAIN_ID.BSC],
    BACKEND_NETWORK_NAMES[NETWORK_NAME_CHAIN_ID.MATIC]
  ])
  const { isLoading, data } = useBridgeTokensTransfered()

  const result = useMemo(() => {
    if (!tokenData?.grvx || !data) {
      return 0
    }

    return tokenData.grvx.reduce((acc, { chain, price }) => {
      return (
        acc +
        data.find((item) => item.chain === chain).transfers * parseFloat(price)
      )
    }, 0)
  }, [data, tokenData])

  return { isLoading: isLoading || isTokenDataLoading, data: result }
}

export default useBridgeDollarsTransfered
