import { Text } from '@gnosis.pm/safe-react-components'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const Icon = styled.img`
  max-width: 15px;
  max-height: 15px;
  margin-right: 9px;
`

const CustomIconText = ({ iconUrl, text }: { iconUrl: string; text?: string }) => (
  <Wrapper>
    <Icon alt={text} src={iconUrl} />
    {text && <Text size="xl">{text}</Text>}
  </Wrapper>
)

export default CustomIconText
