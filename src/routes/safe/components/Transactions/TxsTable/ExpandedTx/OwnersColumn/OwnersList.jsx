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
  onTxCancel?: Function,
  onTxConfirm: Function,
  onTxExecute: Function,
  ownersUnconfirmed: List<Owner>,
  ownersWhoConfirmed: List<Owner>,
  showCancelBtn: Boolean,
  showConfirmBtn: boolean,
  showExecuteBtn: boolean,
  thresholdReached: boolean,
  userAddress: string,
}

const OwnersList = ({
  onTxCancel,
  classes,
  executor,
  isCancelTx,
  onTxConfirm,
  onTxExecute,
  ownersUnconfirmed,
  ownersWhoConfirmed,
  showCancelBtn,
  showConfirmBtn,
  showExecuteBtn,
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
        onTxCancel={onTxCancel}
        onTxExecute={onTxExecute}
        owner={owner}
        showCancelBtn={showCancelBtn}
        showExecuteBtn={showExecuteBtn}
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
        onTxCancel={onTxCancel}
        onTxConfirm={onTxConfirm}
        onTxExecute={onTxExecute}
        owner={owner}
        showCancelBtn={showCancelBtn}
        showConfirmBtn={showConfirmBtn}
        showExecuteBtn={showExecuteBtn}
        thresholdReached={thresholdReached}
        userAddress={userAddress}
      />
    ))}
  </>
)

export default withStyles(styles)(OwnersList)
