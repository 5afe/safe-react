import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import { getExplorerInfo } from 'src/config'
import { formatDateTime } from 'src/utils/date'
import { Creation, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { NOT_AVAILABLE } from './utils'
import { InlineEthHashInfo, TxDetailsContainer } from './styled'

export const TxInfoCreation = ({ transaction }: { transaction: Transaction }): ReactElement | null => {
  const txInfo = transaction.txInfo as Creation
  const timestamp = transaction.timestamp

  return (
    <TxDetailsContainer>
      <div className="tx-summary">
        <div className="tx-hash">
          <Text size="xl" strong as="span">
            Transaction hash:{' '}
          </Text>
          <InlineEthHashInfo
            textSize="xl"
            hash={txInfo.transactionHash}
            shortenHash={8}
            showCopyBtn
            explorerUrl={getExplorerInfo(txInfo.transactionHash)}
          />
        </div>
        <div className="tx-created">
          <Text size="xl" strong as="span">
            Created:{' '}
          </Text>
          <Text size="xl" as="span">
            {formatDateTime(timestamp)}
          </Text>
        </div>
        <div className="tx-creator">
          <Text size="xl" strong as="span">
            Creator:{' '}
          </Text>
          <InlineEthHashInfo
            textSize="xl"
            hash={txInfo.creator}
            shortenHash={4}
            showCopyBtn
            explorerUrl={getExplorerInfo(txInfo.creator)}
          />
        </div>
        <div className="tx-factory">
          <Text size="xl" strong as="span">
            Factory:{' '}
          </Text>
          {txInfo.factory ? (
            <InlineEthHashInfo
              textSize="xl"
              hash={txInfo.factory}
              shortenHash={4}
              showCopyBtn
              explorerUrl={getExplorerInfo(txInfo.factory)}
            />
          ) : (
            <Text size="xl" as="span">
              {NOT_AVAILABLE}
            </Text>
          )}
        </div>
        <div className="tx-mastercopy">
          <Text size="xl" strong as="span">
            Mastercopy:{' '}
          </Text>
          {txInfo.implementation ? (
            <InlineEthHashInfo
              textSize="xl"
              hash={txInfo.implementation}
              shortenHash={4}
              showCopyBtn
              explorerUrl={getExplorerInfo(txInfo.implementation)}
            />
          ) : (
            <Text size="xl" as="span">
              {NOT_AVAILABLE}
            </Text>
          )}
        </div>
      </div>
      <div />
    </TxDetailsContainer>
  )
}
