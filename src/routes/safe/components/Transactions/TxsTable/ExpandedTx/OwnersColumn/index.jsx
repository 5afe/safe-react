// @flow
import React from 'react'
import cn from 'classnames'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import { type Owner } from '~/routes/safe/store/models/owner'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { TX_TYPE_CONFIRMATION } from '~/logic/safe/transactions/send'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import OwnersList from './OwnersList'
import ButtonRow from './ButtonRow'
import CheckLargeFilledGreenIcon from './assets/check-large-filled-green.svg'
import ConfirmLargeGreenIcon from './assets/confirm-large-green.svg'
import ConfirmLargeGreyIcon from './assets/confirm-large-grey.svg'
import { styles } from './style'
import Paragraph from '~/components/layout/Paragraph/index'

type Props = {
  tx: Transaction,
  owners: List<Owner>,
  classes: Object,
  granted: boolean,
  threshold: number,
  userAddress: string,
  thresholdReached: boolean,
  safeAddress: string,
  canExecute: boolean,
  onTxConfirm: Function,
  onTxCancel: Function,
  onTxExecute: Function
}

const isCancellationTransaction = (tx: Transaction, safeAddress: string) => !tx.value && tx.data === EMPTY_DATA && tx.recipient === safeAddress

const OwnersColumn = ({
  tx,
  owners,
  classes,
  granted,
  threshold,
  userAddress,
  thresholdReached,
  safeAddress,
  onTxConfirm,
  onTxCancel,
  onTxExecute,
  canExecute,
}: Props) => {
  const cancellationTx = isCancellationTransaction(tx, safeAddress)
  const showOlderTxAnnotation = thresholdReached && !canExecute && !tx.isExecuted

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
  const ownersUnconfirmed = owners.filter(
    (owner) => tx.confirmations.findIndex(
      (conf) => conf.owner.address === owner.address,
    ) === -1,
  )
  let userIsUnconfirmedOwner
  ownersUnconfirmed.some((owner) => {
    userIsUnconfirmedOwner = owner.address === userAddress
    return userIsUnconfirmedOwner
  })

  let displayButtonRow = true
  if (tx.executionTxHash) {
    // One of owners already executed the tx
    displayButtonRow = false
  } else if (tx.status === 'cancelled') {
    // tx is cancelled (replaced) by another one
    displayButtonRow = false
  } else if (
    cancellationTx
    && currentUserAlreadyConfirmed
    && !thresholdReached
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
      <Block
        className={cn(
          classes.ownerListTitle,
          tx.isExecuted && classes.ownerListTitleDone,
        )}
      >
        <div
          className={
            thresholdReached || tx.isExecuted
              ? classes.verticalLineProgressDone
              : classes.verticalLineProgressPending
          }
        />
        <div className={classes.iconState}>
          {!thresholdReached && !tx.isExecuted && (
            <Img src={ConfirmLargeGreyIcon} alt="Confirm tx" />
          )}
          {thresholdReached && !tx.isExecuted && (
            <Img src={ConfirmLargeGreenIcon} alt="Execute tx" />
          )}
          {tx.isExecuted && (
            <Img src={CheckLargeFilledGreenIcon} alt="TX Executed icon" />
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
        <ButtonRow onTxCancel={onTxCancel} showCancelBtn={!cancellationTx} />
      )}
    </Col>
  )
}

export default withStyles(styles)(OwnersColumn)
