import { Flex, Image, Text } from '@gravis.finance/uikit'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Button from '../Button'

const Container = styled.div<{ hover?: any; styles?: any }>`
  background: #151823;
  border-radius: 20px;
  position: relative;
  width: 100%;
  overflow: hidden;
  ${({ styles }) => styles}

  :hover {
    ${({ hover }) => hover}
  }

  @media screen and (max-width: 620px) {
    height: 530px;
  }
`

const StyledImage = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  border-radius: 0 20px 20px 0;
  object-fit: cover;
  object-position: center;
`

const StyledButton = styled(Button)`
  margin-top: 70px;
  z-index: 10;

  @media screen and (max-width: 620px) {
    margin-top: 40px;
  }
`

type Props = {
  logo: {
    src: any
    alt: string
  }
  image: {
    src: any
    alt: string
  }
  description: string
  buttonText: string
  url: string
  hover?: any
  styles?: any
}

const Card: FC<Props> = ({
  logo,
  image,
  description,
  buttonText,
  url,
  hover,
  styles
}) => {
  const { t } = useTranslation()

  return (
    <Container styles={styles} hover={hover}>
      <Flex my="35px" ml="35px" flexDirection="column">
        <Image width={200} height={45} src={logo.src} alt={logo.alt} />
        <Text mt="20px" style={{ maxWidth: 334, whiteSpace: 'pre-line' }}>
          {t(description)}
        </Text>
        <StyledButton onClick={() => window.open(url, '_blank')}>
          {t(buttonText)}
        </StyledButton>
      </Flex>
      <StyledImage src={image.src} alt={image.alt} />
    </Container>
  )
}

export default Card
