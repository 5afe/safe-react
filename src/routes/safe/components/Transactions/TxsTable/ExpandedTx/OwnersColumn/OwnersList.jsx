// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import OwnerComponent from './OwnerComponent'
import { type Owner } from '~/routes/safe/store/models/owner'
import { styles } from './style'

type ListProps = {
  ownersWhoConfirmed: List<Owner>,
  ownersUnconfirmed: List<Owner>,
  classes: Object,
  userAddress: string,
  executor: string,
  thresholdReached: boolean,
  showConfirmBtn: boolean,
  showExecuteBtn: boolean,
  onTxConfirm: Function,
  onTxExecute: Function,
  isCancelTx?: boolean,
}

const OwnersList = ({
  userAddress,
  ownersWhoConfirmed,
  ownersUnconfirmed,
  classes,
  executor,
  thresholdReached,
  showConfirmBtn,
  showExecuteBtn,
  onTxConfirm,
  onTxExecute,
  isCancelTx,
}: ListProps) => (
  <>
    {ownersWhoConfirmed.map((owner) => (
      <OwnerComponent
        key={owner.address}
        owner={owner}
        classes={classes}
        userAddress={userAddress}
        executor={executor}
        thresholdReached={thresholdReached}
        confirmed
        showExecuteBtn={showExecuteBtn}
        onTxExecute={onTxExecute}
        isCancelTx={isCancelTx}
      />
    ))}
    {ownersUnconfirmed.map((owner) => (
      <OwnerComponent
        key={owner.address}
        owner={owner}
        classes={classes}
        userAddress={userAddress}
        executor={executor}
        thresholdReached={thresholdReached}
        onTxConfirm={onTxConfirm}
        showConfirmBtn={showConfirmBtn}
        showExecuteBtn={showExecuteBtn}
        onTxExecute={onTxExecute}
        isCancelTx={isCancelTx}
      />
    ))}
  </>
)

export default withStyles(styles)(OwnersList)
