import { getThemeCache, setThemeCache } from './theme'

describe('theme', () => {
  it('set dark theme and get it', () => {
    setThemeCache(true)
    expect(getThemeCache()).toBeTruthy()
  })
})
