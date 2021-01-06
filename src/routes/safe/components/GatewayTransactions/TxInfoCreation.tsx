import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { getExplorerInfo } from 'src/config'
import { Creation, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { formatDateTime, NOT_AVAILABLE } from './utils'
import { InlineEthHashInfo, TxDetailsContainer } from './styled'

export const TxInfoCreation = ({ transaction }: { transaction: Transaction }): ReactElement | null => {
  const txInfo = transaction.txInfo as Creation
  const timestamp = transaction.timestamp

  return (
    <TxDetailsContainer>
      <div className="tx-summary">
        <div className="tx-hash">
          <Text size="md" strong as="span">
            Hash:
          </Text>{' '}
          <InlineEthHashInfo
            hash={txInfo.transactionHash}
            shortenHash={8}
            showCopyBtn
            explorerUrl={getExplorerInfo(txInfo.transactionHash)}
          />
        </div>
        <div className="tx-created">
          <Text size="md" strong as="span">
            Created:
          </Text>{' '}
          {formatDateTime(timestamp)}
        </div>
        <div className="tx-creator">
          <Text size="md" strong as="span">
            Creator:
          </Text>{' '}
          <InlineEthHashInfo
            hash={txInfo.creator}
            shortenHash={4}
            showCopyBtn
            explorerUrl={getExplorerInfo(txInfo.creator)}
          />
        </div>
        <div className="tx-factory">
          <Text size="md" strong as="span">
            Factory:
          </Text>{' '}
          {txInfo.factory ? (
            <InlineEthHashInfo
              hash={txInfo.factory}
              shortenHash={4}
              showCopyBtn
              explorerUrl={getExplorerInfo(txInfo.factory)}
            />
          ) : (
            NOT_AVAILABLE
          )}
        </div>
        <div className="tx-mastercopy">
          <Text size="md" strong as="span">
            Mastercopy:
          </Text>{' '}
          {txInfo.implementation ? (
            <InlineEthHashInfo
              hash={txInfo.implementation}
              shortenHash={4}
              showCopyBtn
              explorerUrl={getExplorerInfo(txInfo.implementation)}
            />
          ) : (
            NOT_AVAILABLE
          )}
        </div>
      </div>
      <div />
    </TxDetailsContainer>
  )
}
