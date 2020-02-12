// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import OwnerComponent from './OwnerComponent'
import { type Owner } from '~/routes/safe/store/models/owner'
import { styles } from './style'

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
  onTxReject,
  onTxConfirm,
  onTxExecute,
  ownersUnconfirmed,
  ownersWhoConfirmed,
  showRejectBtn,
  showExecuteRejectBtn,
  showConfirmBtn,
  showExecuteBtn,
  thresholdReached,
  userAddress,
}: ListProps) => (
  <>
    {ownersWhoConfirmed.map(owner => (
      <OwnerComponent
        classes={classes}
        confirmed
        executor={executor}
        isCancelTx={isCancelTx}
        key={owner.address}
        onTxReject={onTxReject}
        onTxExecute={onTxExecute}
        owner={owner}
        showRejectBtn={showRejectBtn}
        showExecuteRejectBtn={showExecuteRejectBtn}
        showExecuteBtn={showExecuteBtn}
        thresholdReached={thresholdReached}
        userAddress={userAddress}
      />
    ))}
    {ownersUnconfirmed.map(owner => (
      <OwnerComponent
        classes={classes}
        executor={executor}
        isCancelTx={isCancelTx}
        key={owner.address}
        onTxReject={onTxReject}
        onTxConfirm={onTxConfirm}
        onTxExecute={onTxExecute}
        owner={owner}
        showRejectBtn={showRejectBtn}
        showExecuteRejectBtn={showExecuteRejectBtn}
        showConfirmBtn={showConfirmBtn}
        showExecuteBtn={showExecuteBtn}
        thresholdReached={thresholdReached}
        userAddress={userAddress}
      />
    ))}
  </>
)

export default withStyles(styles)(OwnersList)
