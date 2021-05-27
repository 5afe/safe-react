import { Text, Icon } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Img from 'src/components/layout/Img'
import { ExpandedTxDetails, isModuleExecutionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import TransactionListActive from './assets/transactions-list-active.svg'
import TransactionListInactive from './assets/transactions-list-inactive.svg'
import { OwnerRow } from './OwnerRow'
import { OwnerList, OwnerListItem } from './styled'
import { isCancelTxDetails } from './utils'

const StyledImg = styled(Img)`
  background-color: transparent;
  border-radius: 50%;
`

export const TxOwners = ({ txDetails }: { txDetails: ExpandedTxDetails }): ReactElement | null => {
  const { txInfo, detailedExecutionInfo } = txDetails

  if (!detailedExecutionInfo || isModuleExecutionDetails(detailedExecutionInfo)) {
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
        <OwnerListItem key={signer}>
          <span className="icon">
            <Icon size="sm" type="circleCheck" color="primary" />
          </span>
          <div className="legend">
            <Text color="primary" size="xl" strong>
              Confirmed
            </Text>
            <OwnerRow address={signer} />
          </div>
        </OwnerListItem>
      ))}
      {confirmationsNeeded <= 0 ? (
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
              {detailedExecutionInfo.executor ? 'Executed' : 'Execute'}
            </Text>
            {detailedExecutionInfo.executor && <OwnerRow address={detailedExecutionInfo.executor} />}
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
