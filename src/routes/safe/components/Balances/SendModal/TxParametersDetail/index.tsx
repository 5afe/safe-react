import React from 'react'
import styled from 'styled-components'
import { Text, ButtonLink, Accordion } from '@gnosis.pm/safe-react-components'

import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

const TxParameterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const AccordionDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const StyledButtonLink = styled(ButtonLink)`
  padding-left: 0;

  > p {
    margin-left: 0;
  }
`

type Props = {
  txParameters: TxParameters
  onEdit: () => void
  compact?: boolean
}

export const TxParametersDetail = ({ onEdit, txParameters, compact = true }: Props): React.ReactElement => (
  <Accordion
    compact={compact}
    summaryContent={<Text size="lg">Advanced options</Text>}
    detailsContent={
      <AccordionDetails>
        <Text size="md" color="secondaryLight">
          Safe transactions parameters
        </Text>

        <TxParameterWrapper>
          <Text size="lg" color="text">
            Safe nonce
          </Text>
          <Text size="lg" color="text">
            {txParameters.safeNonce}
          </Text>
        </TxParameterWrapper>

        <TxParameterWrapper>
          <Text size="lg" color="text">
            SafeTxGas
          </Text>
          <Text size="lg" color="text">
            {txParameters.safeTxGas}
          </Text>
        </TxParameterWrapper>

        <TxParameterWrapper>
          <Text size="lg" color="secondaryLight">
            Ethereum transaction parameters
          </Text>
        </TxParameterWrapper>

        <TxParameterWrapper>
          <Text size="lg" color="text">
            Ethereum nonce
          </Text>
          <Text size="lg" color="text">
            {txParameters.ethNonce}
          </Text>
        </TxParameterWrapper>

        <TxParameterWrapper>
          <Text size="lg" color="text">
            Ethereum gas limit
          </Text>
          <Text size="lg" color="text">
            {txParameters.ethGasLimit}
          </Text>
        </TxParameterWrapper>

        <TxParameterWrapper>
          <Text size="lg" color="text">
            Ethereum gas price
          </Text>
          <Text size="lg" color="text">
            {txParameters.ethGasPrice}
          </Text>
        </TxParameterWrapper>

        <StyledButtonLink color="primary" onClick={onEdit}>
          Edit
        </StyledButtonLink>
      </AccordionDetails>
    }
  />
)
