import { Currency, BASE_CURRENCIES, ChainId } from '@gravis.finance/sdk'
import { useActiveWeb3React } from 'hooks'
import React from 'react'
import styled from 'styled-components'
import Logo from '../Logo'
import CoinLogo from '../../Gravis/CoinLogo'
import useCurrencyImageSrcs from '../../../hooks/useCurrencyImageSrcs'

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 100%;
  background-color: #404040;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: #404040;
  padding: 4px;
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const { chainId } = useActiveWeb3React()
  const imageSrcs = useCurrencyImageSrcs(currency)

  if (chainId && currency === BASE_CURRENCIES[chainId as ChainId]) {
    return <StyledEthereumLogo src={imageSrcs[0]} size={size} style={style} />
  }

  return (currency as any)?.symbol ? (
    <CoinLogo size={size} srcs={imageSrcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  ) : (
    // <FilledHelp height="24px" width="24px" mr="8px" />
    <StyledLogo size={size} srcs={imageSrcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  )
}
