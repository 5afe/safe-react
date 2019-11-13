// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import { type Owner } from '~/routes/safe/store/models/owner'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { TX_TYPE_CONFIRMATION } from '~/logic/safe/transactions/send'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import OwnersList from './List'
import ButtonRow from './ButtonRow'
import CheckGreen from './assets/check-green.svg'
import ConfirmLargeBorder from './assets/confirm-large-border.svg'
import ConfirmLargeGrey from './assets/confirm-large-grey.svg'
import { styles } from './style'

type Props = {
  tx: Transaction,
  owners: List<Owner>,
  classes: Object,
  granted: boolean,
  threshold: number,
  userAddress: string,
  thresholdReached: boolean,
  safeAddress: string,
  onTxConfirm: Function,
  onTxCancel: Function,
  onTxExecute: Function,
}

const isCancellationTransaction = (
  tx: Transaction,
  safeAddress: string,
) => !tx.value && tx.data === EMPTY_DATA && tx.recipient === safeAddress

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
}: Props) => {
  const cancellationTx = isCancellationTransaction(tx, safeAddress)

  const ownersWhoConfirmed = []
  let currentUserAlreadyConfirmed = false
  let executionConfirmation

  tx.confirmations.forEach((conf) => {
    if (conf.owner.address === userAddress) {
      currentUserAlreadyConfirmed = true
    }

    if (conf.type === TX_TYPE_CONFIRMATION) {
      ownersWhoConfirmed.push(conf.owner)
    } else {
      executionConfirmation = conf.owner
    }
  })
  const ownersUnconfirmed = owners.filter(
    (owner) => tx.confirmations.findIndex((conf) => conf.owner.address === owner.address) === -1,
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
  } else if (cancellationTx && currentUserAlreadyConfirmed && !thresholdReached) {
    // the TX is the cancellation (replacement) transaction for previous TX,
    // current user has already confirmed it and threshold is not reached (so he can't execute/cancel it)
    displayButtonRow = false
  }

  let confirmedLabel = `Confirmed [${tx.confirmations.size}/${threshold}]`
  if (tx.executionTxHash) {
    confirmedLabel = `Confirmed [${tx.confirmations.size}]`
  }

  const showConfirmBtn = !tx.isExecuted
    && !tx.cancelled
    && userIsUnconfirmedOwner
    && !currentUserAlreadyConfirmed
    && !thresholdReached

  return (
    <Col xs={6} className={classes.rightCol} layout="block">
      <Block className={classes.ownerListTitle}>
        <div className={classes.iconState}>
          {!thresholdReached && <Img src={ConfirmLargeBorder} />}
          {thresholdReached && <Img src={CheckGreen} />}
        </div>
        {confirmedLabel}
      </Block>
      <OwnersList
        userAddress={userAddress}
        ownersWhoConfirmed={ownersWhoConfirmed}
        ownersUnconfirmed={ownersUnconfirmed}
        executionConfirmation={executionConfirmation}
        onTxConfirm={onTxConfirm}
        showConfirmBtn={showConfirmBtn}
        onTxExecute={onTxExecute}
        showExecuteBtn={!tx.isExecuted && thresholdReached}
      />
      <Block className={classes.ownerListTitle}>
        <div className={classes.iconState}>
          {!thresholdReached && <Img src={ConfirmLargeGrey} />}
          {thresholdReached && !tx.executionTxHash && <Img src={ConfirmLargeBorder} />}
          {thresholdReached && tx.executionTxHash && <Img src={CheckGreen} />}
        </div>
        Execute tx
      </Block>
      {granted && displayButtonRow && (
        <ButtonRow
          onTxCancel={onTxCancel}
          showCancelBtn={!cancellationTx}
        />
      )}
    </Col>
  )
}

export default withStyles(styles)(OwnersColumn)
