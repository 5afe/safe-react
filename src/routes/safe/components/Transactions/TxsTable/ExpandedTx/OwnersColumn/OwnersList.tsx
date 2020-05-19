//
import { withStyles } from '@material-ui/core/styles'
import React from 'react'

import OwnerComponent from './OwnerComponent'
import { styles } from './style'

import {} from 'src/routes/safe/store/models/owner'

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
}) => (
  <>
    {ownersWhoConfirmed.map((owner) => (
      <OwnerComponent
        classes={classes}
        confirmed
        executor={executor}
        isCancelTx={isCancelTx}
        key={owner}
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
        key={owner}
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

export default withStyles(styles as any)(OwnersList)
