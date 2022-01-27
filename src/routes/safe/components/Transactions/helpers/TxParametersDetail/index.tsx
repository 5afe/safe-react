import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import {
  Text,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ButtonLink,
  Divider,
  EthHashInfo,
  CopyToClipboardBtn,
} from '@gnosis.pm/safe-react-components'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'

import { currentSafe, currentSafeThreshold } from 'src/logic/safe/store/selectors'
import { getLastTxNonce, getTransactionsByNonce } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ParametersStatus, areSafeParamsEnabled } from 'src/routes/safe/components/Transactions/helpers/utils'
import useSafeTxGas from 'src/routes/safe/components/Transactions/helpers/useSafeTxGas'
import { AppReduxState } from 'src/store'
import { isMultiSigExecutionDetails, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { getExplorerInfo } from 'src/config'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getByteLength } from 'src/utils/getByteLength'

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

const ColoredText = styled(Text)<{ isOutOfOrder: boolean }>`
  color: ${(props) => (props.isOutOfOrder ? props.theme.colors.error : props.color)};
`

const StyledButtonLink = styled(ButtonLink)`
  padding-left: 0;
  margin: 8px 0 0 0;

  > p {
    margin-left: 0;
  }
`

const StyledDivider = styled(Divider)`
  width: calc(100% + 32px);
  margin-left: -16px;
`

type Props = {
  txParameters: TxParameters
  compact?: boolean
  onEdit: () => void
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

  const [isTxNonceOutOfOrder, setIsTxNonceOutOfOrder] = useState(false)
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false)

  const { safeNonce = '' } = txParameters
  const safeNonceNumber = parseInt(safeNonce, 10)
  const lastQueuedTxNonce = useSelector(getLastTxNonce)
  const showSafeTxGas = useSafeTxGas()
  const storedTx = useSelector((state: AppReduxState) => getTransactionsByNonce(state, safeNonceNumber || 0))

  useEffect(() => {
    if (Number.isNaN(safeNonceNumber) || safeNonceNumber === nonce) {
      return
    }
    if (lastQueuedTxNonce === undefined && safeNonceNumber !== nonce) {
      setIsAccordionExpanded(true)
      setIsTxNonceOutOfOrder(true)
    }
    if (lastQueuedTxNonce && safeNonceNumber !== lastQueuedTxNonce + 1) {
      setIsAccordionExpanded(true)
      setIsTxNonceOutOfOrder(true)
    }
  }, [lastQueuedTxNonce, nonce, safeNonceNumber])

  if (!isTransactionExecution && !isTransactionCreation && isOffChainSignature) {
    return null
  }

  const onChangeExpand = () => {
    setIsAccordionExpanded(!isAccordionExpanded)
  }

  const getColor = () => {
    return areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'
  }

  return (
    <Accordion compact={compact} expanded={isAccordionExpanded} onChange={onChangeExpand}>
      <AccordionSummary>
        <Text size="xl">Advanced parameters</Text>
      </AccordionSummary>
      <AccordionDetails>
        <AccordionDetailsWrapper>
          <StyledText size="md" color="placeHolder">
            Safe transaction parameters
          </StyledText>

          <TxParameterWrapper>
            <ColoredText size="lg" isOutOfOrder={isTxNonceOutOfOrder} color={getColor()}>
              Safe nonce
            </ColoredText>
            <ColoredText size="lg" isOutOfOrder={isTxNonceOutOfOrder} color={getColor()}>
              {txParameters.safeNonce}
            </ColoredText>
          </TxParameterWrapper>

          {showSafeTxGas && (
            <TxParameterWrapper>
              <Text size="lg" color={getColor()}>
                SafeTxGas
              </Text>
              <Text size="lg" color={getColor()}>
                {txParameters.safeTxGas}
              </Text>
            </TxParameterWrapper>
          )}
          <StyledButtonLink color="primary" textSize="xl" onClick={onEdit}>
            Edit
          </StyledButtonLink>
          {storedTx?.length > 0 && <TxAdvancedParametersDetail tx={storedTx[0]} />}
        </AccordionDetailsWrapper>
      </AccordionDetails>
    </Accordion>
  )
}

const TxParameterEndWrapper = styled.span`
  display: flex;
  justify-content: flex-end;
  gap: 4px; // EthHashInfo uses a gap between the address and copy button
`

const TxAdvancedParametersDetail = ({ tx }: { tx: Transaction }) => {
  const { txData, detailedExecutionInfo } = tx?.txDetails || {}

  if (!txData || !detailedExecutionInfo) {
    return null
  }

  return (
    <>
      <StyledDivider />

      {txData.value && (
        <TxParameterWrapper>
          <Text size="lg">value</Text>
          <Text size="lg">{txData.value}</Text>
        </TxParameterWrapper>
      )}

      {txData.to.value && (
        <TxParameterWrapper>
          <Text size="lg">to</Text>
          <PrefixedEthHashInfo
            textSize="lg"
            hash={txData.to.value}
            showCopyBtn
            explorerUrl={getExplorerInfo(txData.to.value)}
            shortenHash={8}
          />
        </TxParameterWrapper>
      )}

      {isMultiSigExecutionDetails(detailedExecutionInfo) && detailedExecutionInfo.safeTxHash && (
        <TxParameterWrapper>
          <Text size="lg">safeTxHash</Text>
          <EthHashInfo textSize="lg" hash={detailedExecutionInfo.safeTxHash} showCopyBtn shortenHash={8} />
        </TxParameterWrapper>
      )}

      {Object.values(Operation).includes(txData.operation) && (
        <TxParameterWrapper>
          <Text size="lg">Operation</Text>
          <Text size="lg">
            {txData.operation} {`(${txData.operation === Operation.DELEGATE ? 'delegate' : 'call'})`}
          </Text>
        </TxParameterWrapper>
      )}

      {isMultiSigExecutionDetails(detailedExecutionInfo) && (
        <TxParameterWrapper>
          <Text size="lg">baseGas</Text>
          <Text size="lg">{detailedExecutionInfo.baseGas}</Text>
        </TxParameterWrapper>
      )}

      {isMultiSigExecutionDetails(detailedExecutionInfo) && (
        <TxParameterWrapper>
          <Text size="lg">gasPrice</Text>
          <Text size="lg">{detailedExecutionInfo.gasPrice}</Text>
        </TxParameterWrapper>
      )}

      {isMultiSigExecutionDetails(detailedExecutionInfo) && detailedExecutionInfo.gasToken && (
        <TxParameterWrapper>
          <Text size="lg">gasToken</Text>
          <EthHashInfo textSize="lg" hash={detailedExecutionInfo.gasToken} showCopyBtn shortenHash={8} />
        </TxParameterWrapper>
      )}

      {isMultiSigExecutionDetails(detailedExecutionInfo) && detailedExecutionInfo.refundReceiver.value && (
        <TxParameterWrapper>
          <Text size="lg">refundReceiver</Text>
          <EthHashInfo textSize="lg" hash={detailedExecutionInfo.refundReceiver.value} showCopyBtn shortenHash={8} />
        </TxParameterWrapper>
      )}

      {isMultiSigExecutionDetails(detailedExecutionInfo) &&
        detailedExecutionInfo.confirmations?.map((confirmation, i) => {
          if (!confirmation?.signature) {
            return null
          }
          const { signature } = confirmation
          return (
            <TxParameterWrapper key={signature}>
              <Text size="lg">Signature {`${i + 1}`}</Text>
              <TxParameterEndWrapper>
                <Text size="lg" as="span">
                  {signature ? getByteLength(signature) : 0} bytes
                </Text>
                <CopyToClipboardBtn textToCopy={signature} />
              </TxParameterEndWrapper>
            </TxParameterWrapper>
          )
        })}

      {txData.hexData && (
        <TxParameterWrapper>
          <Text size="lg">hexData</Text>
          <TxParameterEndWrapper>
            <Text size="lg" as="span">
              {txData.hexData ? getByteLength(txData.hexData) : 0} bytes{' '}
            </Text>
            <CopyToClipboardBtn textToCopy={txData.hexData} />
          </TxParameterEndWrapper>
        </TxParameterWrapper>
      )}
    </>
  )
}
