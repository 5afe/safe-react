import { Text, Icon } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import styled from 'styled-components'

import Img from 'src/components/layout/Img'
import { ExpandedTxDetails, isModuleExecutionInfo } from 'src/logic/safe/store/models/types/gateway.d'
import TransactionListActive from './assets/transactions-list-active.svg'
import TransactionListInactive from './assets/transactions-list-inactive.svg'
import { AddressInfo } from './AddressInfo'
import { OwnerList, OwnerListItem } from './styled'
import { isCancelTxDetails } from './utils'

const StyledImg = styled(Img)`
  background-color: transparent;
  border-radius: 50%;
`

export const TxOwners = ({
  txDetails,
  isPending,
}: {
  txDetails: ExpandedTxDetails
  isPending: boolean
}): ReactElement | null => {
  const { txInfo, detailedExecutionInfo } = txDetails

  if (!detailedExecutionInfo || isModuleExecutionInfo(detailedExecutionInfo)) {
    return null
  }

  const confirmationsNeeded = detailedExecutionInfo.confirmationsRequired - detailedExecutionInfo.confirmations.length

  const CreationNode = isCancelTxDetails(txInfo) ? (
    <OwnerListItem>
      <span className="icon">
        <Icon size="sm" type="circleCross" color="error" />
      </span>
      <div className="legend">
        <Text color="error" size="xl" strong>
          On-chain rejection created
        </Text>
      </div>
    </OwnerListItem>
  ) : (
    <OwnerListItem>
      <span className="icon">
        <Icon size="sm" type="add" color="primary" />
      </span>
      <div className="legend">
        <Text color="primary" size="xl" strong>
          Created
        </Text>
      </div>
    </OwnerListItem>
  )

  return (
    <OwnerList>
      {CreationNode}
      {detailedExecutionInfo.confirmations.map(({ signer }) => (
        <OwnerListItem key={signer.value}>
          <span className="icon">
            <Icon size="sm" type="circleCheck" color="primary" />
          </span>
          <div className="legend">
            <Text color="primary" size="xl" strong>
              Confirmed
            </Text>
            <AddressInfo
              address={signer.value}
              name={signer?.name || undefined}
              avatarUrl={signer?.logoUri || undefined}
              shortenHash={4}
            />
          </div>
        </OwnerListItem>
      ))}
      {isPending || confirmationsNeeded <= 0 ? (
        <OwnerListItem>
          <span className="icon">
            {detailedExecutionInfo.executor ? (
              <Icon type="circleCheck" size="sm" color="primary" />
            ) : (
              <StyledImg alt="" src={TransactionListActive} />
            )}
          </span>
          <div className="legend">
            <Text color="primary" size="xl" strong>
              {detailedExecutionInfo.executor ? 'Executed' : isPending ? 'Executing' : 'Execute'}
            </Text>
            {detailedExecutionInfo.executor && (
              <AddressInfo
                address={detailedExecutionInfo.executor.value}
                name={detailedExecutionInfo.executor?.name || undefined}
                avatarUrl={detailedExecutionInfo.executor?.logoUri || undefined}
                shortenHash={4}
              />
            )}
          </div>
        </OwnerListItem>
      ) : (
        <OwnerListItem>
          <span className="icon">
            <StyledImg alt="" src={TransactionListInactive} />
          </span>
          <div className="legend">
            <Text color="icon" size="xl" strong>
              Execute ({confirmationsNeeded} more {confirmationsNeeded === 1 ? 'confirmation' : 'confirmations'} needed)
            </Text>
          </div>
        </OwnerListItem>
      )}
    </OwnerList>
  )
}
