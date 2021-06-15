import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Text, ButtonLink, Accordion, AccordionSummary, AccordionDetails } from '@gnosis.pm/safe-react-components'

import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ParametersStatus, areEthereumParamsVisible, areSafeParamsEnabled, ethereumTxParametersTitle } from '../utils'
import { useSelector } from 'react-redux'
import { currentSafeThreshold } from 'src/logic/safe/store/selectors'

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
  isTransactionCreation: boolean
  isTransactionExecution: boolean
  isOffChainSignature: boolean
}

export const TxParametersDetail = ({
  onEdit,
  txParameters,
  compact = true,
  parametersStatus,
  isTransactionCreation,
  isTransactionExecution,
  isOffChainSignature,
}: Props): ReactElement | null => {
  const threshold = useSelector(currentSafeThreshold) || 1
  const defaultParameterStatus = isOffChainSignature && threshold > 1 ? 'ETH_HIDDEN' : 'ENABLED'

  if (!isTransactionExecution && !isTransactionCreation && isOffChainSignature) {
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
            Safe transaction
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

          {areEthereumParamsVisible(parametersStatus || defaultParameterStatus) && (
            <>
              <TxParameterWrapper>
                <StyledText size="md" color="placeHolder">
                  {ethereumTxParametersTitle(isTransactionExecution)}
                </StyledText>
              </TxParameterWrapper>

              <TxParameterWrapper>
                <Text size="lg">Nonce</Text>
                <Text size="lg">{txParameters.ethNonce}</Text>
              </TxParameterWrapper>

              <TxParameterWrapper>
                <Text size="lg">Gas limit</Text>
                <Text size="lg">{txParameters.ethGasLimit}</Text>
              </TxParameterWrapper>

              <TxParameterWrapper>
                <Text size="lg">Gas price</Text>
                <Text size="lg">{txParameters.ethGasPrice}</Text>
              </TxParameterWrapper>
            </>
          )}
          <StyledButtonLink color="primary" textSize="xl" onClick={onEdit}>
            Edit
          </StyledButtonLink>
        </AccordionDetailsWrapper>
      </AccordionDetails>
    </Accordion>
  )
}
