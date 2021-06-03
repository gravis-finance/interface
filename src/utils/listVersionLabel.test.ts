import { Version } from '@uniswap/token-lists'
import listVersionLabel from './listVersionLabel'

describe('#listVersionLabel', () => {
  it('returns false on non zero address', () => {
    expect(listVersionLabel({ major: 0, minor: 2, patch: 1 } as Version)).toEqual('v0.2.1')
  })
})
