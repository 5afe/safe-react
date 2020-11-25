import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import TokenSelectField from 'src/routes/safe/components/Balances/SendModal/screens/SendFunds/TokenSelectField'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'

const TokenInput = styled.div`
  grid-area: tokenInput;
`

const Token = (): ReactElement => {
  const tokens = useSelector(extendedSafeTokensSelector)

  return (
    <TokenInput>
      <TokenSelectField tokens={tokens} />
    </TokenInput>
  )
}

export default Token
