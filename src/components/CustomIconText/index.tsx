import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const Icon = styled.img`
  max-width: 15px;
  max-height: 15px;
`
const Text = styled.span`
  margin-left: 5px;
  height: 17px;
`

const CustomIconText = ({ iconUrl, text }: { iconUrl: string; text?: string }) => (
  <Wrapper>
    <Icon alt={text} src={iconUrl} />
    {text && <Text>{text}</Text>}
  </Wrapper>
)

export default CustomIconText
