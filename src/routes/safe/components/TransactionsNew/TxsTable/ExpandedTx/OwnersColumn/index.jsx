// @flow
import React, { useState } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Hairline from '~/components/layout/Hairline'
import { type Owner } from '~/routes/safe/store/models/owner'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { TX_TYPE_CONFIRMATION } from '~/logic/safe/transactions/send'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import OwnersList from './List'
import ButtonRow from './ButtonRow'
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

const isCancellationTransaction = (tx: Transaction, safeAddress: string) =>
  !tx.value && tx.data === EMPTY_DATA && tx.recipient === safeAddress

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
  const [tabIndex, setTabIndex] = useState(0)
  const handleTabChange = (event, tabClicked) => {
    setTabIndex(tabClicked)
  }

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
    owner => tx.confirmations.findIndex(conf => conf.owner.address === owner.address) === -1,
  )

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
  const unconfirmedLabel = `Unconfirmed [${ownersUnconfirmed.size}]`

  return (
    <Col xs={6} className={classes.rightCol} layout="block">
      <Row>
        <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="secondary" textColor="secondary">
          <Tab label={confirmedLabel} />
          <Tab label={unconfirmedLabel} />
        </Tabs>
        <Hairline color="#c8ced4" />
      </Row>
      <Row>
        {tabIndex === 0 && <OwnersList owners={ownersWhoConfirmed} executionConfirmation={executionConfirmation} />}
      </Row>
      <Row>{tabIndex === 1 && <OwnersList owners={ownersUnconfirmed} />}</Row>
      {granted && displayButtonRow && (
        <ButtonRow
          onTxConfirm={onTxConfirm}
          onTxCancel={onTxCancel}
          showConfirmBtn={!currentUserAlreadyConfirmed && !thresholdReached}
          showCancelBtn={!cancellationTx}
          showExecuteBtn={thresholdReached}
          onTxExecute={onTxExecute}
        />
      )}
    </Col>
  )
}

export default withStyles(styles)(OwnersColumn)
