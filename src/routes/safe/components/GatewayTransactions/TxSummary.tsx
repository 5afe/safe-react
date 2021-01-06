import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { getExplorerInfo } from 'src/config'
import { ExpandedTxDetails, isMultiSigExecutionDetails, Operation } from 'src/logic/safe/store/models/types/gateway.d'
import { InlineEthHashInfo } from './styled'
import { formatDateTime, NOT_AVAILABLE } from './utils'

export const TxSummary = ({ txDetails }: { txDetails: ExpandedTxDetails }): ReactElement => {
  const { txHash, detailedExecutionInfo, executedAt, txData } = txDetails
  const explorerUrl = txHash ? getExplorerInfo(txHash) : null
  const nonce = isMultiSigExecutionDetails(detailedExecutionInfo) ? detailedExecutionInfo.nonce : undefined
  const created = isMultiSigExecutionDetails(detailedExecutionInfo) ? detailedExecutionInfo.submittedAt : undefined

  return (
    <>
      <div className="tx-hash">
        <Text size="md" strong as="span">
          Hash:
        </Text>{' '}
        {txHash ? (
          <InlineEthHashInfo hash={txHash} shortenHash={8} showCopyBtn explorerUrl={explorerUrl} />
        ) : (
          NOT_AVAILABLE
        )}
      </div>
      {nonce && (
        <div className="tx-nonce">
          <Text size="md" strong as="span">
            Nonce:
          </Text>{' '}
          {nonce}
        </div>
      )}
      {created && (
        <div className="tx-created">
          <Text size="md" strong as="span">
            Created:
          </Text>{' '}
          {formatDateTime(created)}
        </div>
      )}
      <div className="tx-executed">
        <Text size="md" strong as="span">
          Executed:
        </Text>{' '}
        {executedAt ? formatDateTime(executedAt) : NOT_AVAILABLE}
      </div>
      {txData?.operation === Operation.DELEGATE && (
        <div className="tx-operation">
          <Text size="md" strong as="span">
            Delegate Call
          </Text>
        </div>
      )}
    </>
  )
}
