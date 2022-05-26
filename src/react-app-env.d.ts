/// <reference types="react-scripts" />
import { Ethereumish } from '@ethersproject/providers'

declare module 'fortmatic'

declare global {
  interface Window {
    ethereum?: Ethereumish
    web3?: any
    BinanceChain?: BinanceChain
  }

  declare module '*.mp4'
}

interface WindowChain {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => void
  }
  BinanceChain?: BinanceChain
}

declare module 'content-hash' {
  declare function decode(x: string): string
  declare function getCodec(x: string): string
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): {
    code: number
    name: string
    length: number
    digest: Uint8Array
  }
  declare function toB58String(hash: Uint8Array): string
}

interface BinanceChain {
  send: unknown
  enable: () => Promise<string[]>
  on?: (method: string, listener: (...args: any[]) => void) => void
  removeListener?: (method: string, listener: (...args: any[]) => void) => void
}
