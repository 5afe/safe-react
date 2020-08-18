import React from 'react'
import { useSelector } from 'react-redux'
import TokenSelectField from 'src/routes/safe/components/Balances/SendModal/screens/SendFunds/TokenSelectField'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import styled from 'styled-components'

const TokenInput = styled.div`
  grid-area: tokenInput;
`

const TokenSelect = (): React.ReactElement => {
  const tokens = useSelector(extendedSafeTokensSelector)

  return (
    <TokenInput>
      <TokenSelectField tokens={tokens} />
    </TokenInput>
  )
}

export default TokenSelect
