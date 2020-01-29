// @flow
import React from 'react'
import cn from 'classnames'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import { type Owner } from '~/routes/safe/store/models/owner'
import {
  makeTransaction,
  type Transaction,
} from '~/routes/safe/store/models/transaction'
import { TX_TYPE_CONFIRMATION } from '~/logic/safe/transactions/send'
import OwnersList from './OwnersList'
import CheckLargeFilledGreenCircle from './assets/check-large-filled-green.svg'
import ConfirmLargeGreenCircle from './assets/confirm-large-green.svg'
import CheckLargeFilledRedCircle from './assets/check-large-filled-red.svg'
import ConfirmLargeRedCircle from './assets/confirm-large-red.svg'
import ConfirmLargeGreyCircle from './assets/confirm-large-grey.svg'
import { styles } from './style'
import Paragraph from '~/components/layout/Paragraph/index'

type Props = {
  canExecute: boolean,
  canExecuteCancel: boolean,
  cancelThresholdReached: boolean,
  cancelTx: Transaction,
  classes: Object,
  granted: boolean,
  onTxReject: Function,
  onTxConfirm: Function,
  onTxExecute: Function,
  owners: List<Owner>,
  threshold: number,
  thresholdReached: boolean,
  tx: Transaction,
  userAddress: string,
};

function getOwnersConfirmations(tx, userAddress) {
  const ownersWhoConfirmed = []
  let currentUserAlreadyConfirmed = false

  tx.confirmations.forEach((conf) => {
    if (conf.owner.address === userAddress) {
      currentUserAlreadyConfirmed = true
    }

    if (conf.type === TX_TYPE_CONFIRMATION) {
      ownersWhoConfirmed.push(conf.owner)
    }
  })

  return [ownersWhoConfirmed, currentUserAlreadyConfirmed]
}

function getPendingOwnersConfirmations(owners, tx, userAddress) {
  const ownersUnconfirmed = owners.filter(
    (owner) => tx.confirmations.findIndex(
      (conf) => conf.owner.address === owner.address,
    ) === -1,
  )

  let userIsUnconfirmedOwner = false

  ownersUnconfirmed.some((owner) => {
    userIsUnconfirmedOwner = owner.address === userAddress
    return userIsUnconfirmedOwner
  })

  return [ownersUnconfirmed, userIsUnconfirmedOwner]
}

const OwnersColumn = ({
  tx,
  cancelTx = makeTransaction(),
  owners,
  classes,
  granted,
  threshold,
  userAddress,
  thresholdReached,
  cancelThresholdReached,
  onTxConfirm,
  onTxExecute,
  onTxReject,
  canExecute,
  canExecuteCancel,
}: Props) => {
  let showOlderTxAnnotation: boolean

  if (tx.isExecuted || cancelTx.isExecuted) {
    showOlderTxAnnotation = false
  } else {
    showOlderTxAnnotation = (thresholdReached && !canExecute) || (cancelThresholdReached && !canExecuteCancel)
  }

  const [
    ownersWhoConfirmed,
    currentUserAlreadyConfirmed,
  ] = getOwnersConfirmations(tx, userAddress)
  const [
    ownersUnconfirmed,
    userIsUnconfirmedOwner,
  ] = getPendingOwnersConfirmations(owners, tx, userAddress)
  const [
    ownersWhoConfirmedCancel,
    currentUserAlreadyConfirmedCancel,
  ] = getOwnersConfirmations(cancelTx, userAddress)
  const [
    ownersUnconfirmedCancel,
    userIsUnconfirmedCancelOwner,
  ] = getPendingOwnersConfirmations(owners, cancelTx, userAddress)

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

  const showConfirmBtn = !tx.isExecuted
    && tx.status !== 'pending'
    && !tx.cancelled
    && userIsUnconfirmedOwner
    && !currentUserAlreadyConfirmed
    && !thresholdReached

  const showExecuteBtn = canExecute && !tx.isExecuted && thresholdReached

  const showRejectBtn = !cancelTx.isExecuted
    && !tx.isExecuted
    && cancelTx.status !== 'pending'
    && userIsUnconfirmedCancelOwner
    && !currentUserAlreadyConfirmedCancel
    && !cancelThresholdReached
    && displayButtonRow

  const showExecuteRejectBtn = !cancelTx.isExecuted && !tx.isExecuted && canExecuteCancel && cancelThresholdReached

  const txThreshold = cancelTx.isExecuted ? tx.confirmations.size : threshold
  const cancelThreshold = tx.isExecuted ? cancelTx.confirmations.size : threshold

  return (
    <Col xs={6} className={classes.rightCol} layout="block">
      <Block
        className={cn(
          classes.ownerListTitle,
          (thresholdReached || tx.isExecuted) && classes.ownerListTitleDone,
        )}
      >
        <div className={classes.circleState}>
          <Img src={thresholdReached || tx.isExecuted ? CheckLargeFilledGreenCircle : ConfirmLargeGreenCircle} alt="" />
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
          className={cn(
            classes.verticalLine,
            tx.isExecuted ? classes.verticalLineDone : classes.verticalLinePending,
          )}
        />
        <div className={classes.circleState}>
          <Img src={cancelThresholdReached || cancelTx.isExecuted ? CheckLargeFilledRedCircle : ConfirmLargeRedCircle} alt="" />
        </div>
        {cancelTx.isExecuted
          ? `Rejected [${cancelTx.confirmations.size}/${cancelTx.confirmations.size}]`
          : `Rejected [${cancelTx.confirmations.size}/${cancelThreshold}]`}
      </Block>
      <OwnersList
        isCancelTx
        executor={cancelTx.executor}
        onTxReject={onTxReject}
        ownersUnconfirmed={ownersUnconfirmedCancel}
        ownersWhoConfirmed={ownersWhoConfirmedCancel}
        showRejectBtn={showRejectBtn}
        showExecuteRejectBtn={showExecuteRejectBtn}
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
          {!tx.isExecuted && !cancelTx.isExecuted && (
            <Img src={ConfirmLargeGreyCircle} alt="Confirm / Execute tx" />
          )}
          {tx.isExecuted && (
            <Img src={CheckLargeFilledGreenCircle} alt="TX Executed icon" />
          )}
          {cancelTx.isExecuted && (
            <Img src={CheckLargeFilledRedCircle} alt="TX Executed icon" />
          )}
        </div>
        Executed
      </Block>

      {showOlderTxAnnotation && (
        <Block className={classes.olderTxAnnotation}>
          <Paragraph>
            There are older transactions that need to be executed first
          </Paragraph>
        </Block>
      )}
    </Col>
  )
}

export default withStyles(styles)(OwnersColumn)
