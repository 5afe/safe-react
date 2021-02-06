import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Img from 'src/components/layout/Img'
import { ExpandedTxDetails, isModuleExecutionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import TransactionListActive from './assets/transactions-list-active.svg'
import TransactionListInactive from './assets/transactions-list-inactive.svg'
import CheckCircleGreen from './assets/check-circle-green.svg'
import PlusCircleGreen from './assets/plus-circle-green.svg'
import { OwnerRow } from './OwnerRow'
import { OwnerList, OwnerListItem } from './styled'

type TxOwnersProps = {
  detailedExecutionInfo: ExpandedTxDetails['detailedExecutionInfo']
}

const StyledImg = styled(Img)`
  background-color: transparent;
  border-radius: 50%;
`

export const TxOwners = ({ detailedExecutionInfo }: TxOwnersProps): ReactElement | null => {
  if (!detailedExecutionInfo || isModuleExecutionDetails(detailedExecutionInfo)) {
    return null
  }

  const confirmationsNeeded = detailedExecutionInfo.confirmationsRequired - detailedExecutionInfo.confirmations.length

  return (
    <OwnerList>
      <OwnerListItem>
        <span className="icon">
          <StyledImg alt="" src={PlusCircleGreen} />
        </span>
        <div className="legend">
          <Text color="primary" size="xl" strong>
            Created
          </Text>
        </div>
      </OwnerListItem>
      {detailedExecutionInfo.confirmations.map(({ signer }) => (
        <OwnerListItem key={signer}>
          <span className="icon">
            <StyledImg alt="" src={CheckCircleGreen} />
          </span>
          <div className="legend">
            <Text color="primary" size="xl" strong>
              Confirmed
            </Text>
            <OwnerRow ownerAddress={signer} />
          </div>
        </OwnerListItem>
      ))}
      {confirmationsNeeded === 0 ? (
        <OwnerListItem>
          <span className="icon">
            <StyledImg alt="" src={detailedExecutionInfo.executor ? CheckCircleGreen : TransactionListActive} />
          </span>
          <div className="legend">
            <Text color="primary" size="xl" strong>
              {detailedExecutionInfo.executor ? 'Executed' : 'Execute'}
            </Text>
            {detailedExecutionInfo.executor && <OwnerRow ownerAddress={detailedExecutionInfo.executor} />}
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
