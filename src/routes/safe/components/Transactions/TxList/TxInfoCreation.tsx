import { Text } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import styled from 'styled-components'

import { getExplorerInfo } from 'src/config'
import { formatDateTime } from 'src/utils/date'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { NOT_AVAILABLE } from './utils'
import { TxDetailsContainer } from './styled'
import { Creation } from '@gnosis.pm/safe-react-gateway-sdk'
import { useKnownAddress } from './hooks/useKnownAddress'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { TxDataRow } from './TxDataRow'
import { md } from 'src/theme/variables'

const StyledTxCreationAddress = styled.div`
  margin-bottom: ${md};
`

export const TxInfoCreation = ({ transaction }: { transaction: Transaction }): ReactElement => {
  const txInfo = transaction.txInfo as Creation
  const timestamp = transaction.timestamp

  const creator = useKnownAddress(txInfo.creator)
  const factory = useKnownAddress(txInfo.factory)
  const implementation = useKnownAddress(txInfo.implementation)

  return (
    <TxDetailsContainer>
      <div className="tx-creation">
        <div>
          <StyledTxCreationAddress>
            <Text size="xl" strong>
              Creator:
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
          </StyledTxCreationAddress>
          <StyledTxCreationAddress>
            <Text size="xl" strong>
              Factory:
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
          </StyledTxCreationAddress>
          <StyledTxCreationAddress>
            <Text size="xl" strong>
              Mastercopy:
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
          </StyledTxCreationAddress>
        </div>
        <div>
          <TxDataRow title="Transaction hash:" value={txInfo.transactionHash} inlineType="hash" />
          <TxDataRow title="Created:" value={formatDateTime(timestamp)} />
        </div>
      </div>
    </TxDetailsContainer>
  )
}
