import getLibrary from './getLibrary'

describe('#getLibrary', () => {
  it('returns pollingInterval with polling iterval = 15000', () => {
    expect(getLibrary(null).pollingInterval).toEqual(15000)
  })
})
