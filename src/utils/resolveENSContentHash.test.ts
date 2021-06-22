import { ChainId } from '@gravis.finance/sdk'
import getNodeUrl from 'utils/getRpcUrl'
import { getNetworkLibrary } from '../hooks/useNetwork'
import resolveENSContentHash from './resolveENSContentHash'
import { NetworkConnector } from '../connectors/NetworkConnector'

describe('#resolveENSContentHash', () => {
  // TODO get provider
  it('returns undefined on no currency', () => {
    const chainId = ChainId.MAINNET
    const networkUrl = getNodeUrl(chainId) as string
    const networkConnector = new NetworkConnector({
      urls: { [chainId]: networkUrl },
    })
    const networkConnectors = { [chainId]: networkConnector }

    const networkLibrary = getNetworkLibrary(chainId, networkConnectors)

    resolveENSContentHash('', networkLibrary).then((res) => expect(res).toEqual(''))
  })
})
