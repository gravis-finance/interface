import { Button } from '@gravis.finance/uikit'
import styled from 'styled-components'

const TransparentButton = styled(Button)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border: none;
  box-shadow: none;
  border-radius: 46px;

  :hover:not(:disabled):not(.button--disabled):not(:active) {
    background: rgba(255, 255, 255, 0.1);
    border: 1.5px solid rgba(255, 255, 255, 0.3);
  }

  :active {
    color: #000000;
    background: #ffffff;

    path {
      stroke: #000000;
    }
  }
`

export default TransparentButton
