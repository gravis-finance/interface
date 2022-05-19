import { Flex, Text } from '@gravis.finance/uikit'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { CSSProperties } from 'styled-components'

import { Image } from '../../layouts'
import Button from '../../Button'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
`

const SyledButton = styled(Button)`
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 35px;
  width: 100%;
  border-radius: 46px;
  font-weight: 600;
`

type Props = {
  image: string
  title: string
  diescription: string
  link?: string
  style?: CSSProperties
  className?: string
  onOpen?: () => unknown
}

const Card: FC<Props> = ({
  image,
  title,
  diescription,
  link,
  style,
  className,
  onOpen
}) => {
  const { t } = useTranslation()

  const handleClick = () => {
    if (onOpen) {
      onOpen()
    }

    window.open(link, '_blank')
  }

  return (
    <Wrapper style={style} className={className}>
      <Flex alignItems="center" flexDirection="column">
        <Image src={image} width={80} height={80} />
        <Text mt="20px" style={{ fontWeight: 800 }} fontSize="24px">
          {t(title)}
        </Text>
        <Text style={{ textAlign: 'center' }} fontSize="14px" mt="10px">
          {t(diescription)}
        </Text>
      </Flex>
      {link ? (
        <SyledButton onClick={handleClick}>
          {t('Open {{project}}', { project: title })}
        </SyledButton>
      ) : null}
    </Wrapper>
  )
}

export default Card
