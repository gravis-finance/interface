import { Flex, Image, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Dots } from 'components/swap/styleds'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${Text} {
    letter-spacing: -0.02em;
  }
`

const StyledImage = styled(Image)`
  width: 25px;
  height: 25px;
`

const TokenInfo = ({ image, title, value, isLoading, className = '' }) => {
  const { t } = useTranslation()

  return (
    <Container className={className}>
      <StyledImage height={25} width={25} src={image} />
      <Flex ml="8px" flexDirection="column">
        <Text color="rgba(255,255,255, 0.6)" fontSize="10px">
          {t(title)}
        </Text>
        <Text className="value" fontSize="12px" style={{ fontWeight: 600 }}>
          {isLoading || !value ? <Dots /> : `$${t(value)}`}
        </Text>
      </Flex>
    </Container>
  )
}

export default TokenInfo
