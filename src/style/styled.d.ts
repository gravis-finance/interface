// eslint-disable-next-line import/no-unresolved
import { GravisTheme } from '@gravis.finance/uikit/dist/esm/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends GravisTheme {}
}
