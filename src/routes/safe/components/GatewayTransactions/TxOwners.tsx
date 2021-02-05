import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Img from 'src/components/layout/Img'
import { ExpandedTxDetails, isModuleExecutionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import ConfirmLargeGreenCircle from './assets/confirm-large-green.svg'
import CheckCircleGreen from './assets/check-circle-green.svg'
import PlusCircleGreen from './assets/plus-circle-green.svg'
import { OwnerRow } from './OwnerRow'
import { OwnerList, OwnerListItem } from './styled'

type TxOwnersProps = {
  detailedExecutionInfo: ExpandedTxDetails['detailedExecutionInfo']
}

const StyledImg = styled(Img)`
  background-color: ${({ theme }) => theme.colors.white};
`

export const TxOwners = ({ detailedExecutionInfo }: TxOwnersProps): ReactElement | null => {
  if (!detailedExecutionInfo || isModuleExecutionDetails(detailedExecutionInfo)) {
    return null
  }

  return (
    <OwnerList>
      <OwnerListItem>
        <span className="icon">
          <StyledImg alt="" src={PlusCircleGreen} />
        </span>
        <div className="legend">
          <span>Created</span>
        </div>
      </OwnerListItem>
      {detailedExecutionInfo.confirmations.map(({ signer }) => (
        <OwnerListItem key={signer}>
          <span className="icon">
            <StyledImg alt="" src={CheckCircleGreen} />
          </span>
          <div className="legend">
            <span>Confirmed</span>
            <OwnerRow ownerAddress={signer} />
          </div>
        </OwnerListItem>
      ))}
      <OwnerListItem>
        <span className="icon">
          <StyledImg alt="" src={detailedExecutionInfo.executor ? CheckCircleGreen : ConfirmLargeGreenCircle} />
        </span>
        <div className="legend">
          <span>Executed</span>
          {detailedExecutionInfo.executor && <OwnerRow ownerAddress={detailedExecutionInfo.executor} />}
        </div>
      </OwnerListItem>
    </OwnerList>
  )
}
