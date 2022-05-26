import { ButtonBase, Flex, Image, Text } from '@gravis.finance/uikit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const StyledButtonBase = styled(ButtonBase)`
  width: calc(50% - 8px);
  justify-content: start;

  :hover {
    filter: contrast(0.6);
  }
`

const MoreInfoItem = ({ title, link, icon }) => {
  const { t } = useTranslation()

  return (
    <StyledButtonBase onClick={() => window.open(link, '_blank')}>
      <Flex
        justifyContent="center"
        alignItems="center"
        style={{
          minWidth: 40,
          height: 40,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%'
        }}
      >
        <Image width={16} height={16} src={icon} />
      </Flex>
      <Text
        fontSize="14px"
        ml="10px"
        style={{ textAlign: 'start', fontWeight: 700, lineHeight: '135%' }}
      >
        {t(title)}
      </Text>
    </StyledButtonBase>
  )
}

export default MoreInfoItem
