// @flow
import React from 'react'
import cn from 'classnames'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import { type Owner } from '~/routes/safe/store/models/owner'
import { makeTransaction, type Transaction } from '~/routes/safe/store/models/transaction'
import { TX_TYPE_CONFIRMATION } from '~/logic/safe/transactions/send'
// import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import OwnersList from './OwnersList'
import ButtonRow from './ButtonRow'
import CheckLargeFilledGreenIcon from './assets/check-large-filled-green.svg'
import ConfirmLargeGreenIcon from './assets/confirm-large-green.svg'
import CheckLargeFilledRedIcon from './assets/check-large-filled-red.svg'
import ConfirmLargeRedIcon from './assets/confirm-large-red.svg'
import ConfirmLargeGreyIcon from './assets/confirm-large-grey.svg'
import { styles } from './style'
import Paragraph from '~/components/layout/Paragraph/index'

type Props = {
  tx: Transaction,
  cancelTx: Transaction,
  owners: List<Owner>,
  classes: Object,
  granted: boolean,
  threshold: number,
  userAddress: string,
  thresholdReached: boolean,
  cancelThresholdReached: boolean,
  // safeAddress: string,
  canExecute: boolean,
  onTxConfirm: Function,
  onCancelTxConfirm: Function,
  onTxCancel: Function,
  onTxExecute: Function,
  onCancelTxExecute: Function,
  canExecuteCancel: boolean,
}

// const isCancellationTransaction = (tx: Transaction, safeAddress: string) => !tx.value && tx.data === EMPTY_DATA && tx.recipient === safeAddress

function ownersConfirmations(tx = makeTransaction(), userAddress) {
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

  return [
    ownersWhoConfirmed,
    currentUserAlreadyConfirmed,
  ]
}

function pendingOwnersConfirmations(owners, tx = makeTransaction(), userAddress) {
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

  return [
    ownersUnconfirmed,
    userIsUnconfirmedOwner,
  ]
}

const OwnersColumn = ({
  tx,
  cancelTx,
  owners,
  classes,
  granted,
  threshold,
  userAddress,
  thresholdReached,
  cancelThresholdReached,
  // safeAddress,
  onTxConfirm,
  onCancelTxConfirm,
  onTxCancel,
  onTxExecute,
  onCancelTxExecute,
  canExecute,
  canExecuteCancel,
}: Props) => {
  // const cancellationTx = isCancellationTransaction(tx, safeAddress)
  let showOlderTxAnnotation: boolean
  if (tx.isExecuted || cancelTx.isExecuted) {
    showOlderTxAnnotation = false
  } else if (!tx.isExecuted) {
    showOlderTxAnnotation = thresholdReached && !canExecute
  } else {
    showOlderTxAnnotation = cancelThresholdReached && !canExecuteCancel
  }
  const [ownersWhoConfirmed, currentUserAlreadyConfirmed] = ownersConfirmations(tx, userAddress)
  const [ownersUnconfirmed, userIsUnconfirmedOwner] = pendingOwnersConfirmations(owners, tx, userAddress)
  const [ownersWhoConfirmedCancel, currentUserAlreadyConfirmedCancel] = ownersConfirmations(cancelTx, userAddress)
  const [
    ownersUnconfirmedCancel,
    userIsUnconfirmedCancelOwner,
  ] = pendingOwnersConfirmations(owners, cancelTx, userAddress)

  let displayButtonRow = true
  if (tx.executionTxHash) {
    // One of owners already executed the tx
    displayButtonRow = false
  } else if (tx.status === 'cancelled') {
    // tx is cancelled (replaced) by another one
    displayButtonRow = false
  } else if (
    // cancellationTx &&
    currentUserAlreadyConfirmed && !thresholdReached
  ) {
    // the TX is the cancellation (replacement) transaction for previous TX,
    // current user has already confirmed it and threshold is not reached (so he can't execute/cancel it)
    displayButtonRow = false
  }

  const showConfirmBtn = !tx.isExecuted
    && tx.status !== 'pending'
    && !tx.cancelled
    && userIsUnconfirmedOwner
    && !currentUserAlreadyConfirmed
    && !thresholdReached

  const showExecuteBtn = canExecute && !tx.isExecuted && thresholdReached

  const showConfirmCancelBtn = !cancelTx.isExecuted
    && cancelTx.status !== 'pending'
    && userIsUnconfirmedCancelOwner
    && !currentUserAlreadyConfirmedCancel
    && !cancelThresholdReached
  const showExecuteCancelBtn = canExecuteCancel && !cancelTx.isExecuted && cancelThresholdReached

  return (
    <Col xs={6} className={classes.rightCol} layout="block">
      <Block
        className={cn(
          classes.ownerListTitle,
          (thresholdReached || tx.isExecuted) && classes.ownerListTitleDone,
        )}
      >
        <div className={classes.iconState}>
          {thresholdReached || tx.isExecuted ? (
            <Img src={CheckLargeFilledGreenIcon} />
          ) : (
            <Img src={ConfirmLargeGreenIcon} />
          )}
        </div>
        {tx.isExecuted
          ? `Confirmed [${tx.confirmations.size}/${tx.confirmations.size}]`
          : `Confirmed [${tx.confirmations.size}/${threshold}]`}
      </Block>
      <OwnersList
        userAddress={userAddress}
        ownersWhoConfirmed={ownersWhoConfirmed}
        ownersUnconfirmed={ownersUnconfirmed}
        executor={tx.executor}
        thresholdReached={thresholdReached}
        onTxConfirm={onTxConfirm}
        onTxExecute={onTxExecute}
        showConfirmBtn={showConfirmBtn}
        showExecuteBtn={showExecuteBtn}
      />
      {cancelTx && (
        <>
          <Block
            className={cn(
              classes.ownerListTitle,
              (cancelThresholdReached || cancelTx.isExecuted) && classes.ownerListTitleCancelDone,
            )}
          >
            <div className={classes.verticalLineProgressPending} />
            <div className={classes.iconState}>
              {cancelThresholdReached || cancelTx.isExecuted ? (
                <Img src={CheckLargeFilledRedIcon} />
              ) : (
                <Img src={ConfirmLargeRedIcon} />
              )}
            </div>
            {cancelTx.isExecuted
              ? `Rejected [${cancelTx.confirmations.size}/${cancelTx.confirmations.size}]`
              : `Rejected [${cancelTx.confirmations.size}/${threshold}]`}
          </Block>
          <OwnersList
            userAddress={userAddress}
            ownersWhoConfirmed={ownersWhoConfirmedCancel}
            ownersUnconfirmed={ownersUnconfirmedCancel}
            executor={cancelTx.executor}
            thresholdReached={cancelThresholdReached}
            onTxConfirm={onCancelTxConfirm}
            onTxExecute={onCancelTxExecute}
            showConfirmBtn={showConfirmCancelBtn}
            showExecuteBtn={showExecuteCancelBtn}
            isCancelTx
          />
        </>
      )}
      <Block
        className={cn(
          classes.ownerListTitle,
          tx.isExecuted && classes.ownerListTitleDone,
          cancelTx.isExecuted && classes.ownerListTitleCancelDone,
        )}
      >
        <div
          className={
            tx.isExecuted
              ? classes.verticalLineProgressDone
              : cancelTx.isExecuted
                ? classes.verticalLineCancelProgressDone
                : classes.verticalLineProgressPending
          }
        />
        <div className={classes.iconState}>
          {!thresholdReached && !tx.isExecuted && (
            <Img src={ConfirmLargeGreyIcon} alt="Confirm / Execute tx" />
          )}
          {tx.isExecuted && (
            <Img src={CheckLargeFilledGreenIcon} alt="TX Executed icon" />
          )}
          {cancelTx.isExecuted && (
            <Img src={CheckLargeFilledRedIcon} alt="TX Executed icon" />
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
      {granted && displayButtonRow && (
        <ButtonRow onTxCancel={onTxCancel} showCancelBtn={!cancelTx} />
      )}
    </Col>
  )
}

export default withStyles(styles)(OwnersColumn)
