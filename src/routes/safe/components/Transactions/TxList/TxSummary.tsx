import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement } from 'react'

import { formatDateTime } from 'src/utils/date'
import {
  ExpandedTxDetails,
  isCustomTxInfo,
  isMultiSendTxInfo,
  isMultiSigExecutionDetails,
} from 'src/logic/safe/store/models/types/gateway.d'
import { NOT_AVAILABLE } from './utils'
import TxShareButton from './TxShareButton'
import TxInfoMultiSend from './TxInfoMultiSend'
import DelegateCallWarning from './DelegateCallWarning'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { makeConfirmation } from 'src/logic/safe/store/models/confirmation'
import { TxDataRow } from './TxDataRow'

type Props = { txDetails: ExpandedTxDetails }

export const TxSummary = ({ txDetails }: Props): ReactElement => {
  const { txHash, detailedExecutionInfo, executedAt, txData, txInfo } = txDetails

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

  let signaturesFromConfirmations
  if (confirmations?.length > 0) {
    const signatures = confirmations.map(({ signer, signature }) =>
      makeConfirmation({ owner: signer.value, signature }),
    )
    signaturesFromConfirmations = generateSignaturesFromTxConfirmations(signatures)
  }

  return (
    <>
      {isMultiSigExecutionDetails(txDetails.detailedExecutionInfo) && (
        <div className="tx-share">
          <TxShareButton safeTxHash={txDetails.detailedExecutionInfo.safeTxHash} />
        </div>
      )}
      {txHash && <TxDataRow title="Transaction hash:" value={txHash} inlineType="hash" />}
      {safeTxHash && <TxDataRow title="SafeTxHash:" value={safeTxHash} inlineType="hash" hasExplorer={false} />}
      {created && <TxDataRow title="Created:" value={formatDateTime(created)} />}
      <TxDataRow title="Executed:" value={executedAt ? formatDateTime(executedAt) : NOT_AVAILABLE} />
      <br></br>

      {/* Advanced TxData */}
      {txData?.operation !== undefined && (
        <TxDataRow title="Operation:" value={`${txData.operation} (${Operation[txData.operation].toLowerCase()})`} />
      )}
      {safeTxGas && <TxDataRow title="safeTxGas:" value={safeTxGas} />}
      {baseGas && <TxDataRow title="baseGas:" value={baseGas} />}
      {gasPrice && <TxDataRow title="gasPrice:" value={gasPrice} />}
      {gasToken && <TxDataRow title="gasToken:" value={gasToken} inlineType="hash" />}
      {refundReceiver && <TxDataRow title="refundReceiver:" value={refundReceiver} inlineType="hash" />}
      {confirmations?.length > 0 && (
        <TxDataRow title="Signatures:" value={signaturesFromConfirmations} inlineType="rawData" />
      )}
      {txData?.hexData && <TxDataRow title="Raw data:" value={txData.hexData} inlineType="rawData" />}
      {txData?.operation === Operation.DELEGATE && (
        <div className="tx-operation">
          <DelegateCallWarning isKnown={isCustomTxInfo(txInfo) && !!txInfo?.to?.name} />
        </div>
      )}
      {isMultiSendTxInfo(txInfo) && <TxInfoMultiSend txInfo={txInfo} />}
    </>
  )
}
