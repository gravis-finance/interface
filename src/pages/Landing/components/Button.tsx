import { Button as UikitButton } from '@gravis.finance/uikit'
import styled, { css } from 'styled-components'

const Button = styled(UikitButton)<{ isBlack?: boolean }>`
  ${({ isBlack }) =>
    isBlack
      ? css`
          background-color: #000000;
          color: #ffffff;

          :hover:not(:disabled):not(.button--disabled):not(:active) {
            background-color: #000000;
            color: rgba(255, 255, 255, 0.7);
          }
        `
      : css`
          background-color: #ffffff;
          color: #000000;

          :hover:not(:disabled):not(.button--disabled):not(:active) {
            background-color: rgba(255, 255, 255, 0.1);
            color: #ffffff;

            path {
              fill: #ffffff;
            }
          }
        `}
  border: none;
  box-shadow: none;

  :active {
    background-color: #009ce1;
    color: #ffffff;

    path {
      fill: #ffffff;
    }
  }

  svg {
    margin-left: 7px;
  }

  path {
    fill: #000000;
  }
`

export default Button
