// @flow
import { withStyles } from '@material-ui/core/styles'
import { List } from 'immutable'
import React from 'react'

import OwnerComponent from './OwnerComponent'
import { styles } from './style'

import { type Owner } from '~/routes/safe/store/models/owner'

type ListProps = {
  classes: Object,
  executor: string,
  isCancelTx?: boolean,
  onTxReject?: Function,
  onTxConfirm: Function,
  onTxExecute: Function,
  ownersUnconfirmed: List<Owner>,
  ownersWhoConfirmed: List<Owner>,
  showRejectBtn: boolean,
  showExecuteRejectBtn: boolean,
  showConfirmBtn: boolean,
  showExecuteBtn: boolean,
  thresholdReached: boolean,
  userAddress: string,
}

const OwnersList = ({
  classes,
  executor,
  isCancelTx,
  onTxConfirm,
  onTxExecute,
  onTxReject,
  ownersUnconfirmed,
  ownersWhoConfirmed,
  showConfirmBtn,
  showExecuteBtn,
  showExecuteRejectBtn,
  showRejectBtn,
  thresholdReached,
  userAddress,
}: ListProps) => (
  <>
    {ownersWhoConfirmed.map((owner) => (
      <OwnerComponent
        classes={classes}
        confirmed
        executor={executor}
        isCancelTx={isCancelTx}
        key={owner.address}
        onTxExecute={onTxExecute}
        onTxReject={onTxReject}
        owner={owner}
        showExecuteBtn={showExecuteBtn}
        showExecuteRejectBtn={showExecuteRejectBtn}
        showRejectBtn={showRejectBtn}
        thresholdReached={thresholdReached}
        userAddress={userAddress}
      />
    ))}
    {ownersUnconfirmed.map((owner) => (
      <OwnerComponent
        classes={classes}
        executor={executor}
        isCancelTx={isCancelTx}
        key={owner.address}
        onTxConfirm={onTxConfirm}
        onTxExecute={onTxExecute}
        onTxReject={onTxReject}
        owner={owner}
        showConfirmBtn={showConfirmBtn}
        showExecuteBtn={showExecuteBtn}
        showExecuteRejectBtn={showExecuteRejectBtn}
        showRejectBtn={showRejectBtn}
        thresholdReached={thresholdReached}
        userAddress={userAddress}
      />
    ))}
  </>
)

export default withStyles(styles)(OwnersList)
