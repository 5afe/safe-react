import React, { ReactElement } from 'react'

import Img from 'src/components/layout/Img'
import { ExpandedTxDetails, isModuleExecutionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import CheckLargeFilledGreenCircle from './assets/check-large-filled-green.svg'
import ConfirmLargeGreenCircle from './assets/confirm-large-green.svg'
import { OwnerRow } from './OwnerRow'
import { OwnerList, OwnerListItem } from './styled'

type TxOwnersProps = {
  detailedExecutionInfo: ExpandedTxDetails['detailedExecutionInfo']
}
export const TxOwners = ({ detailedExecutionInfo }: TxOwnersProps): ReactElement | null => {
  if (!detailedExecutionInfo || isModuleExecutionDetails(detailedExecutionInfo)) {
    return null
  }

  return (
    <OwnerList>
      <OwnerListItem>
        <span className="icon">
          <Img alt="" src={CheckLargeFilledGreenCircle} />
        </span>
        <div className="legend">
          <span>Created</span>
        </div>
      </OwnerListItem>
      {detailedExecutionInfo.confirmations.map(({ signer }) => (
        <OwnerListItem key={signer}>
          <span className="icon">
            <Img alt="" src={CheckLargeFilledGreenCircle} />
          </span>
          <div className="legend">
            <span>Confirmed</span>
            <OwnerRow ownerAddress={signer} />
          </div>
        </OwnerListItem>
      ))}
      <OwnerListItem>
        <span className="icon">
          <Img alt="" src={detailedExecutionInfo.executor ? CheckLargeFilledGreenCircle : ConfirmLargeGreenCircle} />
        </span>
        <div className="legend">
          <span>Executed</span>
          {detailedExecutionInfo.executor && <OwnerRow ownerAddress={detailedExecutionInfo.executor} />}
        </div>
      </OwnerListItem>
    </OwnerList>
  )
}
