import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Text, ButtonLink, Accordion, AccordionSummary, AccordionDetails } from '@gnosis.pm/safe-react-components'

import { currentSafe, currentSafeThreshold } from 'src/logic/safe/store/selectors'
import { getLastTxNonce } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ParametersStatus, areEthereumParamsVisible } from '../utils'
import Bold from 'src/components/layout/Bold'
import { isMaxFeeParam } from 'src/logic/safe/transactions/gas'

const TxParameterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const AccordionDetailsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const StyledButtonLink = styled(ButtonLink)`
  padding-left: 0;
  margin: 8px 0 0 0;

  > p {
    margin-left: 0;
  }
`

const StyledAccordionSummary = styled(AccordionSummary)`
  & .MuiAccordionSummary-content {
    justify-content: space-between;
  }
`

type Props = {
  txParameters: TxParameters
  gasCost: string
  onEdit: () => void
  compact?: boolean
  parametersStatus?: ParametersStatus
  isTransactionCreation: boolean
  isTransactionExecution: boolean
  isOffChainSignature: boolean
}

export const TxEstimatedFeesDetail = ({
  onEdit,
  txParameters,
  gasCost,
  compact = true,
  parametersStatus,
  isTransactionCreation,
  isTransactionExecution,
  isOffChainSignature,
}: Props): ReactElement | null => {
  const { nonce } = useSelector(currentSafe)
  const threshold = useSelector(currentSafeThreshold) || 1
  const defaultParameterStatus = isOffChainSignature && threshold > 1 ? 'ETH_HIDDEN' : 'ENABLED'

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false)

  const { safeNonce = '' } = txParameters
  const safeNonceNumber = parseInt(safeNonce, 10)
  const lastQueuedTxNonce = useSelector(getLastTxNonce)

  useEffect(() => {
    if (Number.isNaN(safeNonceNumber) || safeNonceNumber === nonce) return
    if (lastQueuedTxNonce === undefined && safeNonceNumber !== nonce) {
      setIsAccordionExpanded(true)
    }
    if (lastQueuedTxNonce && safeNonceNumber !== lastQueuedTxNonce + 1) {
      setIsAccordionExpanded(true)
    }
  }, [lastQueuedTxNonce, nonce, safeNonceNumber])

  if (!isTransactionExecution && !isTransactionCreation && isOffChainSignature) {
    return null
  }

  const onChangeExpand = () => {
    setIsAccordionExpanded(!isAccordionExpanded)
  }

  return (
    <Accordion compact={compact} expanded={isAccordionExpanded} onChange={onChangeExpand}>
      <StyledAccordionSummary>
        <Text size="xl">Estimated fee price</Text>
        <Text size="xl">
          <Bold>{gasCost}</Bold>
        </Text>
      </StyledAccordionSummary>
      <AccordionDetails>
        <AccordionDetailsWrapper>
          {areEthereumParamsVisible(parametersStatus || defaultParameterStatus) && (
            <>
              <TxParameterWrapper>
                <Text size="lg">Nonce</Text>
                <Text size="lg">{txParameters.ethNonce}</Text>
              </TxParameterWrapper>

              <TxParameterWrapper>
                <Text size="lg">Gas limit</Text>
                <Text size="lg">{txParameters.ethGasLimit}</Text>
              </TxParameterWrapper>

              <TxParameterWrapper>
                <Text size="lg">{isMaxFeeParam() ? 'Max fee per gas' : 'Gas price'}</Text>
                <Text size="lg">{txParameters.ethGasPrice}</Text>
              </TxParameterWrapper>

              {isMaxFeeParam() && (
                <TxParameterWrapper>
                  <Text size="lg">Max priority fee</Text>
                  <Text size="lg">{txParameters.ethMaxPrioFee}</Text>
                </TxParameterWrapper>
              )}
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
