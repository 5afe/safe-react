// @flow
import React, { useState } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Tab from '@material-ui/core/Tab'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Bold from '~/components/layout/Bold'
import Span from '~/components/layout/Span'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type Owner } from '~/routes/safe/store/models/owner'
import { getEtherScanLink, openTxInEtherScan, getWeb3 } from '~/logic/wallets/getWeb3'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { secondary } from '~/theme/variables'
import OwnersList from './OwnersList'
import ButtonRow from './ButtonRow'
import CancelTxModal from './CancelTxModal'
import ApproveTxModal from './ApproveTxModal'
import { styles } from './style'
import { formatDate } from '../columns'

const web3 = getWeb3()
const { toBN, fromWei } = web3.utils

type Props = {
  classes: Object,
  tx: Transaction,
  threshold: number,
  owners: List<Owner>,
  granted: boolean,
  userAddress: string,
  safeAddress: string,
  createTransaction: Function,
}

type OpenModal = 'cancelTx' | 'approveTx' | null

const openIconStyle = {
  height: '13px',
  color: secondary,
}

const txStatusToLabel = {
  success: 'Success',
  awaiting_confirmations: 'Awaiting confirmations',
  cancelled: 'Cancelled',
  awaiting_execution: 'Awaiting execution',
}

const isCancellationTransaction = (tx: Transaction, safeAddress: string) => !tx.value && tx.data === EMPTY_DATA && tx.recipient === safeAddress


const ExpandedTx = ({
  classes,
  tx,
  threshold,
  owners,
  granted,
  userAddress,
  safeAddress,
  createTransaction,
}: Props) => {
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [openModal, setOpenModal] = useState<OpenModal>(null)
  const openApproveModal = () => setOpenModal('approveTx')
  const openCancelModal = () => setOpenModal('cancelTx')
  const closeModal = () => setOpenModal(null)
  const cancellationTx = isCancellationTransaction(tx, safeAddress)
  const confirmedLabel = `Confirmed [${tx.confirmations.size}/${threshold}]`
  const unconfirmedLabel = `Unconfirmed [${owners.size - tx.confirmations.size}]`
  const thresholdReached = owners.size <= tx.confirmations.size

  const ownersWhoConfirmed = []
  const ownersUnconfirmed = []

  let currentUserAlreadyConfirmed = false
  owners.forEach((owner) => {
    if (tx.confirmations.find(conf => conf.owner.address === owner.address)) {
      ownersWhoConfirmed.push(owner)

      if (owner.address === userAddress) {
        currentUserAlreadyConfirmed = true
      }
    } else {
      ownersUnconfirmed.push(owner)
    }
  })

  let displayButtonRow = true
  if (tx.isExecuted) {
    // already executed, can't do any actions
    displayButtonRow = false
  } else if (tx.status === 'cancelled') {
    // tx is cancelled (replaced) by another one
    displayButtonRow = false
  } else if (cancellationTx && currentUserAlreadyConfirmed && !thresholdReached) {
    // the TX is the cancellation (replacement) transaction for previous TX,
    // current user has already confirmed it and threshold is not reached (so he can't execute/cancel it)
    displayButtonRow = false
  }

  const handleTabChange = (event, tabClicked) => {
    setTabIndex(tabClicked)
  }

  return (
    <>
      <Block>
        <Row>
          <Col xs={6} layout="column">
            <Block className={classes.txDataContainer}>
              <Paragraph noMargin>
                <Bold>TX hash: </Bold>
                {tx.executionTxHash ? (
                  <a href={openTxInEtherScan(tx.executionTxHash, 'rinkeby')} target="_blank" rel="noopener noreferrer">
                    {shortVersionOf(tx.executionTxHash, 4)}
                    <OpenInNew style={openIconStyle} />
                  </a>
                ) : (
                  'n/a'
                )}
              </Paragraph>
              <Paragraph noMargin>
                <Bold>TX status: </Bold>
                <Span className={classes[tx.status]} style={{ fontWeight: 'bold' }}>
                  {txStatusToLabel[tx.status]}
                </Span>
              </Paragraph>
              <Paragraph noMargin>
                <Bold>TX created: </Bold>
                {formatDate(tx.submissionDate)}
              </Paragraph>
              {tx.executionDate && (
                <Paragraph noMargin>
                  <Bold>TX executed: </Bold>
                  {formatDate(tx.executionDate)}
                </Paragraph>
              )}
            </Block>
            <Hairline />
            <Block className={classes.txDataContainer}>
              <Paragraph noMargin>
                <Bold>
                  Send
                  {' '}
                  {fromWei(toBN(tx.value), 'ether')}
                  {' '}
                  {tx.symbol}
                  {' '}
to:
                </Bold>
                <br />
                <a href={getEtherScanLink(tx.recipient, 'rinkeby')} target="_blank" rel="noopener noreferrer">
                  {shortVersionOf(tx.recipient, 4)}
                  <OpenInNew style={openIconStyle} />
                </a>
              </Paragraph>
            </Block>
          </Col>
          <Col xs={6} className={classes.rightCol} layout="block">
            <Row>
              <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="secondary" textColor="secondary">
                <Tab label={confirmedLabel} />
                <Tab label={unconfirmedLabel} />
              </Tabs>
              <Hairline color="#c8ced4" />
            </Row>
            <Row>{tabIndex === 0 && <OwnersList owners={ownersWhoConfirmed} />}</Row>
            <Row>{tabIndex === 1 && <OwnersList owners={ownersUnconfirmed} />}</Row>
            {granted && displayButtonRow && (
              <ButtonRow
                onTxConfirm={openApproveModal}
                onTxCancel={openCancelModal}
                showConfirmBtn={!currentUserAlreadyConfirmed}
                showCancelBtn={!cancellationTx}
                showExecuteBtn={thresholdReached}
                onTxExecute={openApproveModal}
              />
            )}
          </Col>
        </Row>
      </Block>
      <CancelTxModal
        isOpen={openModal === 'cancelTx'}
        createTransaction={createTransaction}
        onClose={closeModal}
        tx={tx}
        safeAddress={safeAddress}
      />
      <ApproveTxModal
        isOpen={openModal === 'approveTx'}
        createTransaction={createTransaction}
        onClose={closeModal}
        tx={tx}
        safeAddress={safeAddress}
        thresholdReached={thresholdReached}
      />
    </>
  )
}

export default withStyles(styles)(ExpandedTx)
