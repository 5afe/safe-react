import { ReactElement } from 'react'
import styled from 'styled-components'
import { Text } from '@gnosis.pm/safe-react-components'
import { Creation } from '@gnosis.pm/safe-react-gateway-sdk'

import { getExplorerInfo } from 'src/config'
import { formatDateTime } from 'src/utils/date'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { NOT_AVAILABLE } from './utils'
import { TxDetailsContainer } from './styled'
import { KnownAddressType, useKnownAddress } from './hooks/useKnownAddress'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { TxDataRow } from './TxDataRow'
import { md } from 'src/theme/variables'

const StyledTxCreationAddress = styled.div`
  margin-bottom: ${md};

  &:last-of-type {
    margin-bottom: 0px;
  }
`

export const TxInfoCreation = ({ transaction }: { transaction: Transaction }): ReactElement => {
  const txInfo = transaction.txInfo as Creation
  const timestamp = transaction.timestamp

  const generateCreatorTxData = (
    title,
    creationEntity: Creation['creator' | 'factory' | 'implementation'],
    address: KnownAddressType,
  ): ReactElement => (
    <StyledTxCreationAddress>
      <Text size="xl" strong>
        {title}:
      </Text>
      {creationEntity ? (
        <PrefixedEthHashInfo
          textSize="xl"
          hash={creationEntity.value}
          showCopyBtn
          explorerUrl={getExplorerInfo(creationEntity.value)}
          name={address?.name || undefined}
          customAvatar={address?.logoUri || undefined}
          showAvatar
        />
      ) : (
        <Text size="xl" as="span">
          {NOT_AVAILABLE}
        </Text>
      )}
    </StyledTxCreationAddress>
  )

  return (
    <TxDetailsContainer>
      <div className="tx-creation">
        <div>
          {generateCreatorTxData('Creator', txInfo.creator, useKnownAddress(txInfo.creator))}
          {generateCreatorTxData('Factory', txInfo.factory, useKnownAddress(txInfo.factory))}
          {generateCreatorTxData('Mastercopy', txInfo.implementation, useKnownAddress(txInfo.implementation))}
        </div>
        <div>
          <TxDataRow title="Transaction hash:" value={txInfo.transactionHash} inlineType="hash" />
          <TxDataRow title="Created:" value={formatDateTime(timestamp)} />
        </div>
      </div>
    </TxDetailsContainer>
  )
}
