import { ReactElement, useState } from 'react'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { ButtonLink } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import { formatDateTime } from 'src/utils/date'
import {
  ExpandedTxDetails,
  isMultiSendTxInfo,
  isMultiSigExecutionDetails,
} from 'src/logic/safe/store/models/types/gateway.d'
import { NOT_AVAILABLE } from './utils'
import TxShareButton from './TxShareButton'
import TxInfoMultiSend from './TxInfoMultiSend'
import DelegateCallWarning from './DelegateCallWarning'
import { TxDataRow } from 'src/routes/safe/components/Transactions/TxList/TxDataRow'
import { sm } from 'src/theme/variables'

const StyledButtonLink = styled(ButtonLink)`
  margin-top: ${sm};
  padding-left: 0;

  & > p {
    margin-left: 0;
  }
`

const CollapsibleSection = styled.div<{ show: boolean }>`
  max-height: ${({ show }) => (show ? '500px' : '0px')}; // We need to set a fixed height for the animation to work
  overflow: hidden;
  transition: ${({ show }) => (show ? 'max-height 0.4s ease-in-out' : 'max-height 0.2s cubic-bezier(0, 1, 0, 1)')};
`

type Props = { txDetails: ExpandedTxDetails }

export const TxSummary = ({ txDetails }: Props): ReactElement => {
  const { txHash, detailedExecutionInfo, executedAt, txData, txInfo } = txDetails
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded((val) => !val)
  }

  let created, confirmations, safeTxHash, baseGas, gasPrice, gasToken, refundReceiver, safeTxGas
  if (isMultiSigExecutionDetails(detailedExecutionInfo)) {
    // prettier-ignore
    ({
      submittedAt: created,
      confirmations,
      safeTxHash,
      baseGas,
      gasPrice,
      gasToken,
      safeTxGas,
    } = detailedExecutionInfo)
    refundReceiver = detailedExecutionInfo.refundReceiver?.value
  }

  return (
    <>
      {isMultiSigExecutionDetails(txDetails.detailedExecutionInfo) && (
        <div className="tx-share">
          <TxShareButton safeTxHash={txDetails.detailedExecutionInfo.safeTxHash} />
        </div>
      )}
      {txData?.operation === Operation.DELEGATE && (
        <div className="tx-operation">
          <DelegateCallWarning showWarning={!txData.trustedDelegateCallTarget} />
        </div>
      )}
      {isMultiSendTxInfo(txInfo) && (
        <>
          <TxInfoMultiSend txInfo={txInfo} />
          <br />
        </>
      )}

      <TxDataRow title="Transaction hash:" value={txHash} inlineType="hash" />
      <TxDataRow title="SafeTxHash:" value={safeTxHash} inlineType="hash" hasExplorer={false} />
      <TxDataRow title="Created:" value={typeof created === 'number' ? formatDateTime(created) : null} />
      <TxDataRow title="Executed:" value={executedAt ? formatDateTime(executedAt) : NOT_AVAILABLE} />

      {/* Advanced TxData */}
      {txData && (
        <>
          <StyledButtonLink onClick={toggleExpanded} color="primary" iconSize="sm" textSize="xl">
            Advanced Details
          </StyledButtonLink>
          <CollapsibleSection show={expanded}>
            {txData?.operation !== undefined && (
              <TxDataRow
                title="Operation:"
                value={`${txData.operation} (${Operation[txData.operation].toLowerCase()})`}
              />
            )}
            <TxDataRow title="safeTxGas:" value={safeTxGas} />
            <TxDataRow title="baseGas:" value={baseGas} />
            <TxDataRow title="gasPrice:" value={gasPrice} />
            <TxDataRow title="gasToken:" value={gasToken} inlineType="hash" />
            <TxDataRow title="refundReceiver:" value={refundReceiver} inlineType="hash" />
            {confirmations?.map(({ signature }, index) => (
              <TxDataRow
                title={`Signature ${index + 1}:`}
                key={`signature-${index}:`}
                value={signature}
                inlineType="rawData"
              />
            ))}
            <TxDataRow title="Raw data:" value={txData.hexData} inlineType="rawData" />
          </CollapsibleSection>
        </>
      )}
    </>
  )
}
