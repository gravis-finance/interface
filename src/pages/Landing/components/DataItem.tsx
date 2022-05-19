import { Text } from '@gravis.finance/uikit'
import React from 'react'
import styled from 'styled-components'

const DataItemContainer = styled.div`
  @media screen and (max-width: 1200px) {
    text-align: start;
    .title {
      font-size: 16px;
    }

    .description {
      font-size: 13px;
    }
  }
`

type DataItem = {
  title: string | React.ReactElement
  description: string
  className?: string
}

const DataItem = ({ title, description, className }: DataItem) => {
  return (
    <DataItemContainer className={className}>
      <Text className="title" style={{ fontWeight: 700 }} fontSize="20px">
        {title}
      </Text>
      <Text
        fontSize="14px"
        className="description"
        style={{ fontWeight: 600, opacity: 0.7 }}
      >
        {description}
      </Text>
    </DataItemContainer>
  )
}

export default DataItem
