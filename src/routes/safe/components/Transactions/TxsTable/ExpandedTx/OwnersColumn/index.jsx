// 
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'

import OwnersList from './OwnersList'
import CheckLargeFilledGreenCircle from './assets/check-large-filled-green.svg'
import CheckLargeFilledRedCircle from './assets/check-large-filled-red.svg'
import ConfirmLargeGreenCircle from './assets/confirm-large-green.svg'
import ConfirmLargeGreyCircle from './assets/confirm-large-grey.svg'
import ConfirmLargeRedCircle from './assets/confirm-large-red.svg'
import { styles } from './style'

import Block from 'components/layout/Block'
import Col from 'components/layout/Col'
import Img from 'components/layout/Img'
import Paragraph from 'components/layout/Paragraph/index'
import { TX_TYPE_CONFIRMATION } from 'logic/safe/transactions/send'
import { userAccountSelector } from 'logic/wallets/store/selectors'
import { makeTransaction } from 'routes/safe/store/models/transaction'
import { safeOwnersSelector, safeThresholdSelector } from 'routes/safe/store/selectors'


function getOwnersConfirmations(tx, userAddress) {
  const ownersWhoConfirmed = []
  let currentUserAlreadyConfirmed = false

  tx.confirmations.forEach((conf) => {
    if (conf.owner === userAddress) {
      currentUserAlreadyConfirmed = true
    }

    if (conf.type === TX_TYPE_CONFIRMATION) {
      ownersWhoConfirmed.push(conf.owner)
    }
  })

  return [ownersWhoConfirmed, currentUserAlreadyConfirmed]
}

function getPendingOwnersConfirmations(owners, tx, userAddress) {
  const ownersNotConfirmed = []
  let currentUserNotConfirmed = true

  owners.forEach((owner) => {
    const confirmationsEntry = tx.confirmations.find((conf) => conf.owner === owner.address)
    if (!confirmationsEntry) {
      ownersNotConfirmed.push(owner.address)
    }
    if (confirmationsEntry && confirmationsEntry.owner === userAddress) {
      currentUserNotConfirmed = false
    }
  })

  return [ownersNotConfirmed, currentUserNotConfirmed]
}

const OwnersColumn = ({
  tx,
  cancelTx = makeTransaction(),
  classes,
  thresholdReached,
  cancelThresholdReached,
  onTxConfirm,
  onTxExecute,
  onTxReject,
  canExecute,
  canExecuteCancel,
}) => {
  let showOlderTxAnnotation

  if (tx.isExecuted || cancelTx.isExecuted) {
    showOlderTxAnnotation = false
  } else {
    showOlderTxAnnotation = (thresholdReached && !canExecute) || (cancelThresholdReached && !canExecuteCancel)
  }
  const owners = useSelector(safeOwnersSelector)
  const threshold = useSelector(safeThresholdSelector)
  const userAddress = useSelector(userAccountSelector)
  const [ownersWhoConfirmed, currentUserAlreadyConfirmed] = getOwnersConfirmations(tx, userAddress)
  const [ownersUnconfirmed, userIsUnconfirmedOwner] = getPendingOwnersConfirmations(owners, tx, userAddress)
  const [ownersWhoConfirmedCancel, currentUserAlreadyConfirmedCancel] = getOwnersConfirmations(cancelTx, userAddress)
  const [ownersUnconfirmedCancel, userIsUnconfirmedCancelOwner] = getPendingOwnersConfirmations(
    owners,
    cancelTx,
    userAddress,
  )

  let displayButtonRow = true
  if (tx.executionTxHash) {
    // One of owners already executed the tx
    displayButtonRow = false
  } else if (tx.status === 'cancelled') {
    // tx is cancelled (replaced) by another one
    displayButtonRow = false
  } else if (currentUserAlreadyConfirmedCancel) {
    displayButtonRow = false
  }

  const showConfirmBtn =
    !tx.isExecuted &&
    tx.status !== 'pending' &&
    !tx.cancelled &&
    userIsUnconfirmedOwner &&
    !currentUserAlreadyConfirmed &&
    !thresholdReached

  const showExecuteBtn = canExecute && !tx.isExecuted && thresholdReached

  const showRejectBtn =
    !cancelTx.isExecuted &&
    !tx.isExecuted &&
    cancelTx.status !== 'pending' &&
    userIsUnconfirmedCancelOwner &&
    !currentUserAlreadyConfirmedCancel &&
    !cancelThresholdReached &&
    displayButtonRow

  const showExecuteRejectBtn = !cancelTx.isExecuted && !tx.isExecuted && canExecuteCancel && cancelThresholdReached

  const txThreshold = cancelTx.isExecuted ? tx.confirmations.size : threshold
  const cancelThreshold = tx.isExecuted ? cancelTx.confirmations.size : threshold

  return (
    <Col className={classes.rightCol} layout="block" xs={6}>
      <Block className={cn(classes.ownerListTitle, (thresholdReached || tx.isExecuted) && classes.ownerListTitleDone)}>
        <div className={classes.circleState}>
          <Img alt="" src={thresholdReached || tx.isExecuted ? CheckLargeFilledGreenCircle : ConfirmLargeGreenCircle} />
        </div>
        {tx.isExecuted
          ? `Confirmed [${tx.confirmations.size}/${tx.confirmations.size}]`
          : `Confirmed [${tx.confirmations.size}/${txThreshold}]`}
      </Block>
      <OwnersList
        executor={tx.executor}
        onTxConfirm={onTxConfirm}
        onTxExecute={onTxExecute}
        ownersUnconfirmed={ownersUnconfirmed}
        ownersWhoConfirmed={ownersWhoConfirmed}
        showConfirmBtn={showConfirmBtn}
        showExecuteBtn={showExecuteBtn}
        thresholdReached={thresholdReached}
        userAddress={userAddress}
      />
      {/* Cancel TX thread - START */}
      <Block
        className={cn(
          classes.ownerListTitle,
          (cancelThresholdReached || cancelTx.isExecuted) && classes.ownerListTitleCancelDone,
        )}
      >
        <div
          className={cn(classes.verticalLine, tx.isExecuted ? classes.verticalLineDone : classes.verticalLinePending)}
        />
        <div className={classes.circleState}>
          <Img
            alt=""
            src={cancelThresholdReached || cancelTx.isExecuted ? CheckLargeFilledRedCircle : ConfirmLargeRedCircle}
          />
        </div>
        {cancelTx.isExecuted
          ? `Rejected [${cancelTx.confirmations.size}/${cancelTx.confirmations.size}]`
          : `Rejected [${cancelTx.confirmations.size}/${cancelThreshold}]`}
      </Block>
      <OwnersList
        executor={cancelTx.executor}
        isCancelTx
        onTxReject={onTxReject}
        ownersUnconfirmed={ownersUnconfirmedCancel}
        ownersWhoConfirmed={ownersWhoConfirmedCancel}
        showExecuteRejectBtn={showExecuteRejectBtn}
        showRejectBtn={showRejectBtn}
        thresholdReached={cancelThresholdReached}
        userAddress={userAddress}
      />
      {/* Cancel TX thread - END */}
      <Block
        className={cn(
          classes.ownerListTitle,
          tx.isExecuted && classes.ownerListTitleDone,
          cancelTx.isExecuted && classes.ownerListTitleCancelDone,
        )}
      >
        <div
          className={cn(
            classes.verticalLine,
            tx.isExecuted && classes.verticalLineDone,
            cancelTx.isExecuted && classes.verticalLineCancel,
          )}
        />
        <div className={classes.circleState}>
          {!tx.isExecuted && !cancelTx.isExecuted && <Img alt="Confirm / Execute tx" src={ConfirmLargeGreyCircle} />}
          {tx.isExecuted && <Img alt="TX Executed icon" src={CheckLargeFilledGreenCircle} />}
          {cancelTx.isExecuted && <Img alt="TX Executed icon" src={CheckLargeFilledRedCircle} />}
        </div>
        Executed
      </Block>

      {showOlderTxAnnotation && (
        <Block className={classes.olderTxAnnotation}>
          <Paragraph>There are older transactions that need to be executed first</Paragraph>
        </Block>
      )}
    </Col>
  )
}

export default withStyles(styles)(OwnersColumn)
