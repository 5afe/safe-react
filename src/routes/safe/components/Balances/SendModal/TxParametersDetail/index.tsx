import React from 'react'
import styled from 'styled-components'
import { Text, ButtonLink } from '@gnosis.pm/safe-react-components'

import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

const TxParameterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

type Props = {
  txParameters: TxParameters
  onAdvancedOptions: () => void
}

export const TxParametersDetail = ({ onAdvancedOptions, txParameters }: Props): React.ReactElement => {
  return (
    <>
      <Text size="md" color="secondaryLight">
        Safe transactions parameters
      </Text>

      <TxParameterWrapper>
        <Text size="lg" color="text" strong>
          Safe
        </Text>
        <Text size="lg" color="text" strong>
          {txParameters.safeNonce}
        </Text>
      </TxParameterWrapper>

      <TxParameterWrapper>
        <Text size="lg" color="text" strong>
          SafeTxGas
        </Text>
        <Text size="lg" color="text" strong>
          {txParameters.safeTxGas}
        </Text>
      </TxParameterWrapper>

      <TxParameterWrapper>
        <Text size="lg" color="secondaryLight">
          Ethereum transaction parameters
        </Text>
      </TxParameterWrapper>

      <TxParameterWrapper>
        <Text size="lg" color="text" strong>
          Ethereum nonce
        </Text>
        <Text size="lg" color="text" strong>
          {txParameters.ethNonce}
        </Text>
      </TxParameterWrapper>

      <TxParameterWrapper>
        <Text size="lg" color="text" strong>
          Ethereum gas limit
        </Text>
        <Text size="lg" color="text" strong>
          {txParameters.ethGasLimit}
        </Text>
      </TxParameterWrapper>

      <TxParameterWrapper>
        <Text size="lg" color="text" strong>
          Ethereum gas price
        </Text>
        <Text size="lg" color="text" strong>
          {txParameters.ethGasPrice}
        </Text>
      </TxParameterWrapper>

      <ButtonLink color="primary" onClick={onAdvancedOptions}>
        <Text size="xl" color="primary">
          Edit
        </Text>
      </ButtonLink>
    </>
  )
}
