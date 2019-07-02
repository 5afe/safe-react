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
import { secondary } from '~/theme/variables'
import OwnersList from './OwnersList'
import ButtonRow from './ButtonRow'
import { styles } from './style'
import { formatDate } from '../columns'

const web3 = getWeb3()
const { toBN, fromWei } = web3.utils

type Props = {
  classes: Object,
  tx: Transaction,
  threshold: number,
  owners: List<Owner>,
}

const openIconStyle = {
  height: '13px',
  color: secondary,
}

const txStatusToLabel = {
  success: 'Success',
  awaiting_confirmations: 'Awaiting confirmations',
}

const ExpandedTx = ({
  classes, tx, threshold, owners,
}: Props) => {
  const [tabIndex, setTabIndex] = useState<number>(0)
  const confirmedLabel = `Confirmed [${tx.confirmations.size}/${threshold}]`
  const unconfirmedLabel = `Unconfirmed [${owners.size - tx.confirmations.size}]`
  const txStatus = tx.isExecuted ? 'success' : 'awaiting_confirmations'

  const ownersWhoConfirmed = []
  const ownersUnconfirmed = []
  owners.forEach((owner) => {
    if (tx.confirmations.find(conf => conf.owner.address === owner.address)) {
      ownersWhoConfirmed.push(owner)
    } else {
      ownersUnconfirmed.push(owner)
    }
  })

  const handleTabChange = (event, tabClicked) => {
    setTabIndex(tabClicked)
  }

  return (
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
              <Span className={classes[txStatus]} style={{ fontWeight: 'bold' }}>
                {txStatusToLabel[txStatus]}
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
          <ButtonRow />
        </Col>
      </Row>
    </Block>
  )
}

export default withStyles(styles)(ExpandedTx)
