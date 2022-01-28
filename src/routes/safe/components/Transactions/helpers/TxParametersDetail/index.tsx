import { ReactElement, useEffect, useMemo, useState } from 'react'
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
import { md } from 'src/theme/variables'

const TxParameterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const TxParameterEndWrapper = styled.span`
  display: flex;
  justify-content: flex-end;
  gap: 4px; // EthHashInfo uses a gap between the address and copy button
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
  margin-right: -${md};
  margin-left: -${md};
`

type TxParam = string | ReactElement
const TxParameter = ({ name, value }: { name: TxParam; value: TxParam }): ReactElement => {
  const getEl = (prop: TxParam) => {
    return typeof prop === 'string' ? <Text size="lg">{prop}</Text> : prop
  }
  return (
    <TxParameterWrapper>
      {getEl(name)}
      {getEl(value)}
    </TxParameterWrapper>
  )
}

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
  const storedTx = useSelector((state: AppReduxState) => getTransactionsByNonce(state, safeNonceNumber))

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

  const color = useMemo(
    () => (areSafeParamsEnabled(parametersStatus || defaultParameterStatus) ? 'text' : 'secondaryLight'),
    [parametersStatus, defaultParameterStatus],
  )

  if (!isTransactionExecution && !isTransactionCreation && isOffChainSignature) {
    return null
  }

  const onChangeExpand = () => {
    setIsAccordionExpanded(!isAccordionExpanded)
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
          <TxParameter
            name={
              <ColoredText size="lg" isOutOfOrder={isTxNonceOutOfOrder} color={color}>
                Safe nonce
              </ColoredText>
            }
            value={
              <ColoredText size="lg" isOutOfOrder={isTxNonceOutOfOrder} color={color}>
                {txParameters.safeNonce}
              </ColoredText>
            }
          />

          {showSafeTxGas && (
            <TxParameter
              name={
                <Text size="lg" color={color}>
                  SafeTxGas
                </Text>
              }
              value={
                <Text size="lg" color={color}>
                  {txParameters.safeTxGas}
                </Text>
              }
            />
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

const TxAdvancedParametersDetail = ({ tx }: { tx: Transaction }) => {
  const { txData, detailedExecutionInfo } = tx?.txDetails || {}

  if (!txData || !detailedExecutionInfo) {
    return null
  }

  const { value, to, operation, hexData } = txData
  const { safeTxHash, baseGas, gasPrice, gasToken, refundReceiver, confirmations } =
    (isMultiSigExecutionDetails(detailedExecutionInfo) && detailedExecutionInfo) || {}

  return (
    <>
      <StyledDivider />

      {value && <TxParameter name="value" value={value} />}

      {to?.value && (
        <TxParameter
          name="to"
          value={
            <PrefixedEthHashInfo
              textSize="lg"
              hash={to.value}
              showCopyBtn
              explorerUrl={getExplorerInfo(to.value)}
              shortenHash={8}
            />
          }
        />
      )}

      {safeTxHash && (
        <TxParameter
          name="safeTxHash"
          value={<EthHashInfo textSize="lg" hash={safeTxHash} showCopyBtn shortenHash={8} />}
        />
      )}

      {Object.values(Operation).includes(operation) && (
        <TxParameter name="Operation" value={`${operation} (${Operation[operation].toLowerCase()})`} />
      )}

      {baseGas && <TxParameter name="baseGas" value={baseGas} />}

      {gasPrice && <TxParameter name="gasPrice" value={gasPrice} />}

      {gasToken && (
        <TxParameter
          name="gasToken"
          value={<EthHashInfo textSize="lg" hash={gasToken} showCopyBtn shortenHash={8} />}
        />
      )}

      {refundReceiver?.value && (
        <TxParameter
          name="refundReceiver"
          value={<EthHashInfo textSize="lg" hash={refundReceiver.value} showCopyBtn shortenHash={8} />}
        />
      )}

      {confirmations
        ?.filter(({ signature }) => signature)
        .map(({ signature }, i) => (
          <TxParameter
            name={`Signature ${i + 1}`}
            key={signature}
            value={
              <TxParameterEndWrapper>
                <Text size="lg" as="span">
                  {signature ? getByteLength(signature) : 0} bytes
                </Text>
                {signature && <CopyToClipboardBtn textToCopy={signature} />}
              </TxParameterEndWrapper>
            }
          />
        ))}

      <TxParameter
        name="hexData"
        value={
          <TxParameterEndWrapper>
            <Text size="lg" as="span">
              {hexData ? getByteLength(hexData) : 0} bytes
            </Text>
            {hexData && <CopyToClipboardBtn textToCopy={hexData} />}
          </TxParameterEndWrapper>
        }
      />
    </>
  )
}
