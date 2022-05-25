import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { BACKEND_NETWORK_NAMES } from 'constants/network'
import { useActiveWeb3React } from 'hooks'

export const GRVX_ADDRESSES: { [Number in string]: string } = {
  '56': '0xa349fd455a457467d31ca8db59052daebbbcc108',
  '97': '0x0eb3578904eEc144a2DAf123a856EE8018124fc7',
  '80001': '0xd322da59c420e0827e31c40f1886346fb19c6687',
  '137': '0xb87caf94eca257938b5ef984786d4423dc507843'
}

export const GRVS_ADDRESSES: { [Number in string]: string } = {
  '56': '0x190cec0657a02e9eab1c1df5d59f9139131cf539',
  '97': '0xa743f9eeda14b93c0037a8f4c0d57eb2eb1e34fb',
  '80001': '',
  '137': '0x190cec0657a02e9eab1c1df5d59f9139131cf539'
}

const TOKENS_DATA_KEY = 'TOKENS_DATA_KEY'

const useGetTokensData = (networks?: string[]) => {
  const { chainId } = useActiveWeb3React()

  const fetchTokens = async () => {
    const result = await fetch(`${process.env.REACT_APP_ASSETS_API_URL}/tokens`)
    const fetchedResult = await result.json()

    return fetchedResult.data
  }

  const queryResult = useQuery([TOKENS_DATA_KEY, chainId], fetchTokens)
  const preparedData = useMemo(
    () =>
      queryResult.data && chainId
        ? {
            grvx: queryResult.data.filter(
              (token) =>
                Object.values(GRVX_ADDRESSES).find(
                  (address) => token.token_address === address.toLowerCase()
                ) &&
                (networks
                  ? networks.includes(token.chain)
                  : token.chain === BACKEND_NETWORK_NAMES[chainId])
            ),
            grvs: queryResult.data.filter(
              (token) =>
                Object.values(GRVS_ADDRESSES).find(
                  (address) => token.token_address === address.toLowerCase()
                ) &&
                (networks
                  ? networks.includes(token.chain)
                  : token.chain === BACKEND_NETWORK_NAMES[chainId])
            )
          }
        : null,
    [chainId, networks, queryResult]
  )

  return { ...queryResult, data: preparedData }
}

export default useGetTokensData
