import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
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

export const CustomIconText = ({ iconUrl, text }: { iconUrl: string; text?: string }): ReactElement => (
  <Wrapper>
    <Icon alt={text} src={iconUrl} />
    {text && <Text size="xl">{text}</Text>}
  </Wrapper>
)
