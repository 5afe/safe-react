// @flow
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const Icon = styled.img`
  max-width: 15px;
  max-height: 15px;
  margin-right: 5px;
`
const Text = styled.span`
  height: 17px;
`

const IconText = ({ iconUrl, text }: { iconUrl: string, text: string }) => (
  <Wrapper>
    <Icon alt={text} src={iconUrl} />
    <Text>{text}</Text>
  </Wrapper>
)

export default IconText
