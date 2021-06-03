import isZero from './isZero'

describe('#isZero', () => {
  it('returns false on non zero address', () => {
    expect(isZero('0x9F337DC10F14402287449De5444428A98aC63fc9')).toBeFalsy()
  })
  it('returns false on non zero address', () => {
    expect(isZero('0x0Da3335f7F9B0f78c965046b8CF124a51548001E')).toBeFalsy()
  })
  it('returns true on zero value in hex', () => {
    expect(isZero('0x0')).toBeTruthy()
  })
})
