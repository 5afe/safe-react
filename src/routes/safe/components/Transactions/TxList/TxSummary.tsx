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
import { InlineEthHashInfo } from './styled'
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

const StyledGridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: flex-start;
  max-width: 480px;
`

const FlexWrapper = styled.div<{ margin: number }>`
  display: flex;
  align-items: center;

  > :nth-child(2) {
    margin-left: ${({ margin }) => margin}px;
  }
`

export const TxSummary = ({ txDetails }: Props): ReactElement => {
  const { txHash, detailedExecutionInfo, executedAt, txData, txInfo } = txDetails
  const explorerUrl = txHash ? getExplorerInfo(txHash) : undefined

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
      <div className="tx-hash">
        <StyledGridRow>
          <Text size="xl" as="span">
            Transaction hash:
          </Text>
          {txHash ? (
            <InlineEthHashInfo textSize="xl" hash={txHash} shortenHash={8} showCopyBtn explorerUrl={explorerUrl} />
          ) : (
            <Text size="xl" as="span">
              {NOT_AVAILABLE}
            </Text>
          )}
        </StyledGridRow>
      </div>
      {safeTxHash && (
        <div className="tx-hash">
          <StyledGridRow>
            <Text size="xl" as="span">
              SafeTxHash:
            </Text>
            <InlineEthHashInfo textSize="xl" hash={safeTxHash} shortenHash={8} showCopyBtn />
          </StyledGridRow>
        </div>
      )}
      {created && (
        <div className="tx-created">
          <StyledGridRow>
            <Text size="xl" as="span">
              Created:
            </Text>
            <Text size="xl" as="span">
              {formatDateTime(created)}
            </Text>
          </StyledGridRow>
        </div>
      )}
      <div className="tx-executed">
        <StyledGridRow>
          <Text size="xl" as="span">
            Executed:
          </Text>
          <Text size="xl" as="span">
            {executedAt ? formatDateTime(executedAt) : NOT_AVAILABLE}
          </Text>
        </StyledGridRow>
      </div>
      <br></br>
      {/* TODO: Refactor repeated code to a component*/}
      {txData?.operation && (
        <StyledGridRow>
          <Text size="xl" as="span">
            Operation:
          </Text>
          <Text size="xl" as="span">
            {txData?.operation}
          </Text>
        </StyledGridRow>
      )}
      {safeTxGas && (
        <StyledGridRow>
          <Text size="xl" as="span">
            safeTxGas:
          </Text>
          <Text size="xl" as="span">
            {safeTxGas}
          </Text>
        </StyledGridRow>
      )}
      {baseGas && (
        <StyledGridRow>
          <Text size="xl" as="span">
            baseGas:
          </Text>
          <Text size="xl" as="span">
            {baseGas}
          </Text>
        </StyledGridRow>
      )}
      {gasPrice && (
        <StyledGridRow>
          <Text size="xl" as="span">
            gasPrice:
          </Text>
          <Text size="xl" as="span">
            {gasPrice}
          </Text>
        </StyledGridRow>
      )}
      {gasToken && (
        <StyledGridRow>
          <Text size="xl" as="span">
            gasToken:
          </Text>
          <Text size="xl" as="span">
            <InlineEthHashInfo textSize="xl" hash={gasToken} shortenHash={8} showCopyBtn />
          </Text>
        </StyledGridRow>
      )}
      {refundReceiver && (
        <StyledGridRow>
          <Text size="xl" as="span">
            refundReceiver:
          </Text>
          <Text size="xl" as="span">
            <InlineEthHashInfo textSize="xl" hash={refundReceiver} shortenHash={8} showCopyBtn />
          </Text>
        </StyledGridRow>
      )}
      {confirmations?.map(({ signature }, index) => (
        <StyledGridRow key={index}>
          <Text size="xl" as="span">
            {`Signature ${index} :`}
          </Text>
          <Text size="xl" as="span">
            <InlineEthHashInfo textSize="xl" hash={signature} shortenHash={8} showCopyBtn />
          </Text>
        </StyledGridRow>
      ))}
      {confirmations?.length > 1 && (
        <StyledGridRow>
          <Text size="xl" as="span">
            {`Signatures :`}
          </Text>
          <FlexWrapper margin={5}>
            <Text size="xl">{signaturesFromConfirmations ? getByteLength(signaturesFromConfirmations) : 0} bytes</Text>
            <CopyToClipboardBtn textToCopy={signaturesFromConfirmations || ''} />
          </FlexWrapper>
        </StyledGridRow>
      )}
      {txData?.hexData && (
        <StyledGridRow>
          <Text size="xl" as="span">
            Raw data:
          </Text>
          <FlexWrapper margin={5}>
            <Text size="xl">{txData?.hexData ? getByteLength(txData?.hexData) : 0} bytes</Text>
            <CopyToClipboardBtn textToCopy={txData?.hexData || ''} />
          </FlexWrapper>
        </StyledGridRow>
      )}
      {txData?.operation === Operation.DELEGATE && (
        <div className="tx-operation">
          <DelegateCallWarning isKnown={isCustomTxInfo(txInfo) && !!txInfo?.to?.name} />
        </div>
      )}
      {isMultiSendTxInfo(txInfo) && <TxInfoMultiSend txInfo={txInfo} />}
    </>
  )
}
