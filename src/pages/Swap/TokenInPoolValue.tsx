import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { space } from 'styled-system'
import { TokenAmount } from '@gravis.finance/sdk'

const StyledValue = styled.span`
  color: white;
`

const StyledRoot = styled.div`
  font-size: 14px;
  color: #909090;
  text-align: right;
  line-height: 1.2;
  margin-top: 4px;
  ${space}
`

type Props = React.ComponentProps<typeof StyledRoot> & {
  value?: TokenAmount
}

const TokenInPoolValue = (props: Props) => {
  const { value, ...restProps } = props
  const { t } = useTranslation()

  if (!value) return null

  return (
    <StyledRoot {...restProps}>
      {value.currency.symbol} {t('inPool')}: <StyledValue>{value.toSignificant(8)}</StyledValue>
    </StyledRoot>
  )
}

export default TokenInPoolValue
