import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Text, ButtonLink, Accordion, AccordionSummary, AccordionDetails } from '@gnosis.pm/safe-react-components'

import { currentSafe, currentSafeThreshold } from 'src/logic/safe/store/selectors'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ParametersStatus, areEthereumParamsVisible, areSafeParamsEnabled, ethereumTxParametersTitle } from '../utils'

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

const ColoredText = styled(Text)<{ isFuture: boolean }>`
  color: ${(props) => (props.isFuture ? 'red' : props.color)};
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
  const { nonce } = useSelector(currentSafe)
  const threshold = useSelector(currentSafeThreshold) || 1
  const defaultParameterStatus = isOffChainSignature && threshold > 1 ? 'ETH_HIDDEN' : 'ENABLED'

  const { safeNonce = '' } = txParameters
  const isSafeNonceFuture = parseInt(safeNonce, 10) > nonce
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(isSafeNonceFuture)

  useEffect(() => {
    if (parseInt(safeNonce, 10) > nonce) {
      setIsAccordionExpanded(true)
    }
  }, [nonce, safeNonce, txParameters])

  if (!isTransactionExecution && !isTransactionCreation && isOffChainSignature) {
    return null
  }

  const onChangeExpand = () => {
    setIsAccordionExpanded(!isAccordionExpanded)
  }

  return (
    <Accordion compact={compact} expanded={isAccordionExpanded} onChange={onChangeExpand}>
      <AccordionSummary>
        <Text size="lg">Advanced options</Text>
      </AccordionSummary>
      <AccordionDetails>
        <AccordionDetailsWrapper>
          <StyledText size="md" color="placeHolder">
            Safe transaction
          </StyledText>

          <TxParameterWrapper>
            <ColoredText
              size="lg"
              isFuture={isSafeNonceFuture}
              color={areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              Safe nonce
            </ColoredText>
            <ColoredText
              size="lg"
              isFuture={isSafeNonceFuture}
              color={areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'}
            >
              {txParameters.safeNonce}
            </ColoredText>
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
