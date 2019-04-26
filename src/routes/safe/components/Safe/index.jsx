// @flow
import ListComponent from '@material-ui/core/List'
import * as React from 'react'
import { List } from 'immutable'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Bold from '~/components/layout/Bold'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { type Safe } from '~/routes/safe/store/models/safe'
import { type Token } from '~/logic/tokens/store/model/token'

import Transactions from '~/routes/safe/components/Transactions'
import Threshold from '~/routes/safe/components/Threshold'
import AddOwner from '~/routes/safe/components/AddOwner'
import RemoveOwner from '~/routes/safe/components/RemoveOwner'
import SendToken from '~/routes/safe/components/SendToken'

import Address from './Address'
import BalanceInfo from './BalanceInfo'
import Owners from './Owners'
import Confirmations from './Confirmations'
import MultisigTx from './MultisigTx'

const safeIcon = require('./assets/gnosis_safe.svg')

type SafeProps = {
  safe: Safe,
  tokens: List<Token>,
  userAddress: string,
}

type State = {
  component?: React$Node,
}

const listStyle = {
  width: '100%',
}

class GnoSafe extends React.PureComponent<SafeProps, State> {
  state = {
    component: undefined,
  }

  onListTransactions = () => {
    const { safe } = this.props

    this.setState({
      component: (
        <Transactions threshold={safe.get('threshold')} safeName={safe.get('name')} safeAddress={safe.get('address')} />
      ),
    })
  }

  onEditThreshold = () => {
    const { safe } = this.props

    this.setState({
      component: <Threshold numOwners={safe.get('owners').count()} safe={safe} onReset={this.onListTransactions} />,
    })
  }

  onAddOwner = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { safe } = this.props
    e.stopPropagation()
    this.setState({ component: <AddOwner threshold={safe.get('threshold')} safe={safe} /> })
  }

  onRemoveOwner = (name: string, address: string) => {
    const { safe } = this.props

    this.setState({
      component: (
        <RemoveOwner
          safeAddress={safe.get('address')}
          threshold={safe.get('threshold')}
          safe={safe}
          name={name}
          userToRemove={address}
        />
      ),
    })
  }

  onMoveTokens = (ercToken: Token) => {
    const { safe } = this.props

    this.setState({
      component: (
        <SendToken safe={safe} token={ercToken} key={ercToken.get('address')} onReset={this.onListTransactions} />
      ),
    })
  }

  render() {
    const { safe, tokens, userAddress } = this.props
    const { component } = this.state
    const address = safe.get('address')

    return (
      <Row grow>
        <Col sm={12} top="xs" md={5} margin="xl" overflow>
          <ListComponent style={listStyle}>
            <BalanceInfo tokens={tokens} onMoveFunds={this.onMoveTokens} safeAddress={address} />
            <Owners
              owners={safe.owners}
              onAddOwner={this.onAddOwner}
              userAddress={userAddress}
              onRemoveOwner={this.onRemoveOwner}
            />
            <Confirmations confirmations={safe.get('threshold')} onEditThreshold={this.onEditThreshold} />
            <Address address={address} />
            <MultisigTx onSeeTxs={this.onListTransactions} />
          </ListComponent>
        </Col>
        <Col sm={12} center="xs" md={7} margin="xl" layout="column">
          <Block margin="xl">
            <Paragraph size="lg" noMargin align="right">
              <Bold>{safe.name.toUpperCase()}</Bold>
            </Paragraph>
          </Block>
          <Row grow>
            <Col sm={12} center={component ? undefined : 'sm'} middle={component ? undefined : 'sm'} layout="column">
              {component || <Img alt="Safe Icon" src={safeIcon} height={330} />}
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default GnoSafe
