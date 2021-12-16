import { CopyToClipboardBtn, Text } from '@gnosis.pm/safe-react-components'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement } from 'react'

import { getExplorerInfo } from 'src/config'
import { formatDateTime } from 'src/utils/date'
import {
  ExpandedTxDetails,
  isCustomTxInfo,
  isMultiSendTxInfo,
  isMultiSigExecutionDetails,
} from 'src/logic/safe/store/models/types/gateway.d'
import { InlineEthHashInfo, StyledGridRow } from './styled'
import { NOT_AVAILABLE } from './utils'
import TxShareButton from './TxShareButton'
import { IS_PRODUCTION } from 'src/utils/constants'
import TxInfoMultiSend from './TxInfoMultiSend'
import DelegateCallWarning from './DelegateCallWarning'
import styled from 'styled-components'
import { getByteLength } from 'src/components/DecodeTxs' // must pass to utils
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { makeConfirmation } from 'src/logic/safe/store/models/confirmation'

type Props = { txDetails: ExpandedTxDetails }

const FlexWrapper = styled.div<{ margin: number }>`
  display: flex;
  align-items: center;

  > :nth-child(2) {
    margin-left: ${({ margin }) => margin}px;
  }
`

type TxDataRowType = { inlineType?: 'hash' | 'rawData'; title: string; value: string }

const TxDataRow = ({ inlineType, title, value }: TxDataRowType) => (
  <StyledGridRow>
    <Text size="xl" as="span">
      {title}
    </Text>
    {inlineType === 'hash' && (
      <InlineEthHashInfo textSize="xl" hash={value} shortenHash={8} showCopyBtn explorerUrl={getExplorerInfo(value)} />
    )}
    {inlineType === 'rawData' && (
      <FlexWrapper margin={5}>
        <Text size="xl">{value ? getByteLength(value) : 0} bytes</Text>
        <CopyToClipboardBtn textToCopy={value || ''} />
      </FlexWrapper>
    )}
    {!inlineType && (
      <Text size="xl" as="span">
        {value}
      </Text>
    )}
  </StyledGridRow>
)

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
  if (confirmations && confirmations?.length > 0) {
    const signatures = confirmations?.map(({ signer, signature }) =>
      makeConfirmation({ owner: signer.value, signature }),
    )
    signaturesFromConfirmations = generateSignaturesFromTxConfirmations(signatures)
  }

  return (
    <>
      {!IS_PRODUCTION && (
        <div className="tx-share">
          <TxShareButton id={txDetails.txId} />
        </div>
      )}
      {txHash && <TxDataRow title="Transaction hash:" value={txHash} inlineType="hash" />}
      {safeTxHash && <TxDataRow title="SafeTxHash:" value={safeTxHash} inlineType="hash" />}
      {created && <TxDataRow title="Created:" value={formatDateTime(created)} />}
      <TxDataRow title="Executed:" value={executedAt ? formatDateTime(executedAt) : NOT_AVAILABLE} />
      <br></br>

      {/* Advanced TxData */}
      {txData?.operation !== undefined && (
        <TxDataRow title="Operation:" value={`${txData?.operation} (${Operation[txData?.operation].toLowerCase()})`} />
      )}
      {safeTxGas && <TxDataRow title="safeTxGas:" value={safeTxGas} />}
      {baseGas && <TxDataRow title="baseGas:" value={baseGas} />}
      {gasPrice && <TxDataRow title="gasPrice:" value={gasPrice} />}
      {gasToken && <TxDataRow title="gasToken:" value={gasToken} inlineType="hash" />}
      {refundReceiver && <TxDataRow title="refundReceiver:" value={refundReceiver} inlineType="hash" />}
      {confirmations?.map(({ signature }, index) => (
        <TxDataRow title={`Signature ${index + 1} :`} value={signature} inlineType="rawData" key={index} />
      ))}
      {confirmations?.length > 1 && (
        <TxDataRow title="Signatures :" value={signaturesFromConfirmations} inlineType="rawData" />
      )}
      {txData?.hexData && <TxDataRow title="Raw data:" value={txData?.hexData} inlineType="rawData" />}
      {txData?.operation === Operation.DELEGATE && (
        <div className="tx-operation">
          <DelegateCallWarning isKnown={isCustomTxInfo(txInfo) && !!txInfo?.to?.name} />
        </div>
      )}
      {isMultiSendTxInfo(txInfo) && <TxInfoMultiSend txInfo={txInfo} />}
    </>
  )
}
