import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Text, ButtonLink, Accordion, AccordionSummary, AccordionDetails } from '@gnosis.pm/safe-react-components'

import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ParametersStatus, areEthereumParamsEnabled, areSafeParamsEnabled } from '../utils'
import { useSelector } from 'react-redux'
import { safeThresholdSelector } from 'src/logic/safe/store/selectors'

const TxParameterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const AccordionDetailsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const StyledText = styled(Text)`
  margin: 8px 0 0 0;
`

const StyledButtonLink = styled(ButtonLink)`
  padding-left: 0;
  margin: 8px 0 0 0;

  > p {
    margin-left: 0;
  }
`

type Props = {
  txParameters: TxParameters
  onEdit: () => void
  compact?: boolean
  parametersStatus?: ParametersStatus
  isTransactionExecution: boolean
  isTransactionCreation: boolean
}

export const TxParametersDetail = ({
  onEdit,
  txParameters,
  compact = true,
  parametersStatus,
  isTransactionCreation,
  isTransactionExecution,
}: Props): ReactElement | null => {
  const threshold = useSelector(safeThresholdSelector) || 1
  const defaultParameterStatus = threshold > 1 ? 'ETH_DISABLED' : 'ENABLED'

  if (!isTransactionExecution && !isTransactionCreation) {
    return null
  }

  return (
    <Accordion compact={compact}>
      <AccordionSummary>
        <Text size="lg">Advanced options</Text>
      </AccordionSummary>
      <AccordionDetails>
        <AccordionDetailsWrapper>
          <StyledText size="md" color="placeHolder">
            Safe transactions parameters
          </StyledText>

          <TxParameterWrapper>
            <Text
              size="lg"
              color={areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              Safe nonce
            </Text>
            <Text
              size="lg"
              color={areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              {txParameters.safeNonce}
            </Text>
          </TxParameterWrapper>

          <TxParameterWrapper>
            <Text
              size="lg"
              color={areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              SafeTxGas
            </Text>
            <Text
              size="lg"
              color={areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              {txParameters.safeTxGas}
            </Text>
          </TxParameterWrapper>

          <TxParameterWrapper>
            <StyledText size="md" color="placeHolder">
              Ethereum transaction parameters
            </StyledText>
          </TxParameterWrapper>

          <TxParameterWrapper>
            <Text
              size="lg"
              color={areEthereumParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              Ethereum nonce
            </Text>
            <Text
              size="lg"
              color={areEthereumParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              {txParameters.ethNonce}
            </Text>
          </TxParameterWrapper>

          <TxParameterWrapper>
            <Text
              size="lg"
              color={areEthereumParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              Ethereum gas limit
            </Text>
            <Text
              size="lg"
              color={areEthereumParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              {txParameters.ethGasLimit}
            </Text>
          </TxParameterWrapper>

          <TxParameterWrapper>
            <Text
              size="lg"
              color={areEthereumParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              Ethereum gas price
            </Text>
            <Text
              size="lg"
              color={areEthereumParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              {txParameters.ethGasPrice}
            </Text>
          </TxParameterWrapper>

          <StyledButtonLink color="primary" textSize="xl" onClick={onEdit}>
            Edit
          </StyledButtonLink>
        </AccordionDetailsWrapper>
      </AccordionDetails>
    </Accordion>
  )
}
