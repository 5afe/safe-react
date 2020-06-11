import * as React from 'react'

import makeBlockie from 'ethereum-blockies-base64'
import styled from 'styled-components'

type Props = {
  address: string
  diameter: number
  className?: string
}

const StyledImg = styled.img<{ diameter: number }>`
  height: ${({ diameter }) => diameter}px;
  width: ${({ diameter }) => diameter}px;
  border-radius: 50%;
`

const Identicon: React.FC<Props> = ({ diameter = 32, address, className }) => {
  const iconSrc = React.useMemo(() => makeBlockie(address), [address])

  return <StyledImg src={iconSrc} diameter={diameter} className={className} />
}

export default Identicon
