import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    // background-color: ${({ theme }) => theme.colors.background};
    img {
      height: auto;
      max-width: 100%;
    }

    [role=presentation] {
      background: #0A0D12;
      opacity: 0.7;
    }
  }
`

export default GlobalStyle
