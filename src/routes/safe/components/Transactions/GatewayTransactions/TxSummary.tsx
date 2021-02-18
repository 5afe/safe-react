import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { getExplorerInfo } from 'src/config'
import { formatDateTime } from 'src/utils/date'
import { ExpandedTxDetails, isMultiSigExecutionDetails, Operation } from 'src/logic/safe/store/models/types/gateway.d'
import { InlineEthHashInfo } from './styled'
import { NOT_AVAILABLE } from './utils'

export const TxSummary = ({ txDetails }: { txDetails: ExpandedTxDetails }): ReactElement => {
  const { txHash, detailedExecutionInfo, executedAt, txData } = txDetails
  const explorerUrl = txHash ? getExplorerInfo(txHash) : null
  const nonce = isMultiSigExecutionDetails(detailedExecutionInfo) ? detailedExecutionInfo.nonce : undefined
  const created = isMultiSigExecutionDetails(detailedExecutionInfo) ? detailedExecutionInfo.submittedAt : undefined

  return (
    <>
      <div className="tx-hash">
        <Text size="xl" strong as="span">
          Hash:{' '}
        </Text>
        {txHash ? (
          <InlineEthHashInfo textSize="xl" hash={txHash} shortenHash={8} showCopyBtn explorerUrl={explorerUrl} />
        ) : (
          <Text size="xl" as="span">
            {NOT_AVAILABLE}
          </Text>
        )}
      </div>
      {nonce && (
        <div className="tx-nonce">
          <Text size="xl" strong as="span">
            Nonce:{' '}
          </Text>
          <Text size="xl" as="span">
            {nonce}
          </Text>
        </div>
      )}
      {created && (
        <div className="tx-created">
          <Text size="xl" strong as="span">
            Created:{' '}
          </Text>
          <Text size="xl" as="span">
            {formatDateTime(created)}
          </Text>
        </div>
      )}
      <div className="tx-executed">
        <Text size="xl" strong as="span">
          Executed:{' '}
        </Text>
        <Text size="xl" as="span">
          {executedAt ? formatDateTime(executedAt) : NOT_AVAILABLE}
        </Text>
      </div>
      {txData?.operation === Operation.DELEGATE && (
        <div className="tx-operation">
          <Text size="xl" strong as="span">
            Delegate Call
          </Text>
        </div>
      )}
    </>
  )
}
