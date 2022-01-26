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

const StyledButtonLink = styled(ButtonLink)`
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

      {txHash && <TxDataRow title="Transaction hash:" value={txHash} inlineType="hash" />}
      {safeTxHash && <TxDataRow title="SafeTxHash:" value={safeTxHash} inlineType="hash" hasExplorer={false} />}
      {created && <TxDataRow title="Created:" value={formatDateTime(created)} />}
      <TxDataRow title="Executed:" value={executedAt ? formatDateTime(executedAt) : NOT_AVAILABLE} />

      {/* Advanced TxData */}
      {txData && (
        <>
          <br />
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
            {safeTxGas && <TxDataRow title="safeTxGas:" value={safeTxGas} />}
            {baseGas && <TxDataRow title="baseGas:" value={baseGas} />}
            {gasPrice && <TxDataRow title="gasPrice:" value={gasPrice} />}
            {gasToken && <TxDataRow title="gasToken:" value={gasToken} inlineType="hash" />}
            {refundReceiver && <TxDataRow title="refundReceiver:" value={refundReceiver} inlineType="hash" />}
            {confirmations?.map(({ signature }, index) => (
              <TxDataRow
                title={`Signature ${index + 1}:`}
                key={`signature-${index}:`}
                value={signature}
                inlineType="rawData"
              />
            ))}
            {txData?.hexData && <TxDataRow title="Raw data:" value={txData.hexData} inlineType="rawData" />}
          </CollapsibleSection>
        </>
      )}
    </>
  )
}
