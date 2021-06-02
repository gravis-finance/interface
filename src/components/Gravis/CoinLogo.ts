import styled from 'styled-components'
import Logo from '../Logos/Logo'

const CoinLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background: #404040;
  padding: 2px;
  border-radius: 100%;
`

export default CoinLogo
