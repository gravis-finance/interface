import { getNetworkLibrary } from 'connectors'
import resolveENSContentHash from './resolveENSContentHash'

describe('#resolveENSContentHash', () => {
  // TODO get provider
  it('returns undefined on no currency', () => {
    const networkLibrary = getNetworkLibrary()
    if (networkLibrary) {
      resolveENSContentHash('', networkLibrary).then((res) => expect(res).toEqual(''))
    }
  })
})
