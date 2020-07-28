import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import OwnerComponent from './OwnerComponent'
import { styles } from './style'

type OwnersListProps = {
  executor: string
  isCancelTx?: boolean
  onTxConfirm?: () => void
  onTxExecute?: () => void
  onTxReject?: () => void
  ownersUnconfirmed: { hasPendingAcceptActions: boolean; hasPendingRejectActions: boolean; owner: string }[]
  ownersWhoConfirmed: string[]
  showConfirmBtn?: boolean
  showExecuteBtn?: boolean
  showExecuteRejectBtn?: boolean
  showRejectBtn?: boolean
  thresholdReached: boolean
  userAddress: string
}

const useStyles = makeStyles(styles)

const OwnersList = (props: OwnersListProps): React.ReactElement => {
  const classes = useStyles()
  const { ownersUnconfirmed, ownersWhoConfirmed } = props
  return (
    <>
      {ownersWhoConfirmed.map((owner) => (
        <OwnerComponent classes={classes} confirmed key={owner} owner={owner} {...props} />
      ))}
      {ownersUnconfirmed.map(({ hasPendingAcceptActions, hasPendingRejectActions, owner }) => (
        <OwnerComponent
          classes={classes}
          key={owner}
          owner={owner}
          pendingAcceptAction={hasPendingAcceptActions}
          pendingRejectAction={hasPendingRejectActions}
          {...props}
        />
      ))}
    </>
  )
}

export default OwnersList
