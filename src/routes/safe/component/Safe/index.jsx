// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Bold from '~/components/layout/Bold'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { type Safe } from '~/routes/safe/store/model/safe'
import List from 'material-ui/List'

import Withdrawn from '~/routes/safe/component/Withdrawn'
import Transactions from '~/routes/safe/component/Transactions'
import AddTransaction from '~/routes/safe/component/AddTransaction'
import Threshold from '~/routes/safe/component/Threshold'

import Address from './Address'
import Balance from './Balance'
import Owners from './Owners'
import Confirmations from './Confirmations'
import DailyLimit from './DailyLimit'
import MultisigTx from './MultisigTx'

const safeIcon = require('./assets/gnosis_safe.svg')

type SafeProps = {
  safe: Safe,
  balance: string,
}

type State = {
  component: React$Node,
}

const listStyle = {
  width: '100%',
}

class GnoSafe extends React.PureComponent<SafeProps, State> {
  state = {
    component: undefined,
  }

  onWithdrawn = () => {
    const { safe } = this.props

    this.setState({ component: <Withdrawn safeAddress={safe.get('address')} dailyLimit={safe.get('dailyLimit')} /> })
  }

  onAddTx = () => {
    const { balance, safe } = this.props
    this.setState({
      component: <AddTransaction safe={safe} balance={Number(balance)} onReset={this.onListTransactions} />,
    })
  }

  onListTransactions = () => {
    const { safe } = this.props

    this.setState({ component: <Transactions safeName={safe.get('name')} safeAddress={safe.get('address')} onAddTx={this.onAddTx} /> })
  }

  onEditThreshold = () => {
    const { safe } = this.props

    this.setState({ component: <Threshold numOwners={safe.get('owners').count()} safe={safe} /> })
  }

  render() {
    const { safe, balance } = this.props
    const { component } = this.state

    return (
      <Row grow>
        <Col sm={12} top="xs" md={5} margin="xl" overflow>
          <List style={listStyle}>
            <Balance balance={balance} />
            <Owners owners={safe.owners} />
            <Confirmations confirmations={safe.get('confirmations')} onEditThreshold={this.onEditThreshold} />
            <Address address={safe.get('address')} />
            <DailyLimit balance={balance} dailyLimit={safe.get('dailyLimit')} onWithdrawn={this.onWithdrawn} />
            <MultisigTx balance={balance} onAddTx={this.onAddTx} onSeeTxs={this.onListTransactions} />
          </List>
        </Col>
        <Col sm={12} center="xs" md={7} margin="xl" layout="column">
          <Block margin="xl">
            <Paragraph size="lg" noMargin align="right">
              <Bold>{safe.name.toUpperCase()}</Bold>
            </Paragraph>
          </Block>
          <Row grow>
            <Col sm={12} center={component ? undefined : 'sm'} middle={component ? undefined : 'sm'} layout="column">
              { component || <Img alt="Safe Icon" src={safeIcon} height={330} /> }
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default GnoSafe
