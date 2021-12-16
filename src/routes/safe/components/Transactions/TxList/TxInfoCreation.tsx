import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { getExplorerInfo } from 'src/config'
import { formatDateTime } from 'src/utils/date'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { NOT_AVAILABLE } from './utils'
import { InlineEthHashInfo, TxDetailsContainer } from './styled'
import { Creation } from '@gnosis.pm/safe-react-gateway-sdk'
import { useKnownAddress } from './hooks/useKnownAddress'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'

export const TxInfoCreation = ({ transaction }: { transaction: Transaction }): ReactElement => {
  const txInfo = transaction.txInfo as Creation
  const timestamp = transaction.timestamp

  const creator = useKnownAddress(txInfo.creator)
  const factory = useKnownAddress(txInfo.factory)
  const implementation = useKnownAddress(txInfo.implementation)

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
      </div>
      <div className="tx-details">
        <div className="tx-creator">
          <Text size="xl" strong>
            Creator:{' '}
          </Text>
          <PrefixedEthHashInfo
            textSize="xl"
            hash={txInfo.creator.value}
            showCopyBtn
            explorerUrl={getExplorerInfo(txInfo.creator.value)}
            name={creator.name || undefined}
            customAvatar={creator.logoUri || undefined}
            showAvatar
          />
        </div>
        <div className="tx-factory">
          <Text size="xl" strong>
            Factory:{' '}
          </Text>
          {txInfo.factory ? (
            <PrefixedEthHashInfo
              textSize="xl"
              hash={txInfo.factory.value}
              showCopyBtn
              explorerUrl={getExplorerInfo(txInfo.factory.value)}
              name={factory?.name || undefined}
              customAvatar={factory?.logoUri || undefined}
              showAvatar
            />
          ) : (
            <Text size="xl" as="span">
              {NOT_AVAILABLE}
            </Text>
          )}
        </div>
        <div className="tx-mastercopy">
          <Text size="xl" strong>
            Mastercopy:{' '}
          </Text>
          {txInfo.implementation ? (
            <PrefixedEthHashInfo
              textSize="xl"
              hash={txInfo.implementation.value}
              showCopyBtn
              explorerUrl={getExplorerInfo(txInfo.implementation.value)}
              name={implementation?.name || undefined}
              customAvatar={implementation?.logoUri || undefined}
              showAvatar
            />
          ) : (
            <Text size="xl" as="span">
              {NOT_AVAILABLE}
            </Text>
          )}
        </div>
      </div>
      <div className="tx-owners" />
    </TxDetailsContainer>
  )
}
