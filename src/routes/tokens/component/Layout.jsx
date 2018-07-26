// @flow
import MuiList from '@material-ui/core/List'
import * as React from 'react'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import AccountBalanceWallet from '@material-ui/icons/AccountBalanceWallet'
import AddCircle from '@material-ui/icons/AddCircle'
import Link from '~/components/layout/Link'
import Bold from '~/components/layout/Bold'
import Img from '~/components/layout/Img'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { type Token } from '~/routes/tokens/store/model/token'
import { type SelectorProps } from '~/routes/tokens/container/selector'
import { type Actions } from '~/routes/tokens/container/actions'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import AddToken from '~/routes/tokens/component/AddToken'
import RemoveToken from '~/routes/tokens/component/RemoveToken'
import TokenComponent from './Token'

const safeIcon = require('~/routes/safe/component/Safe/assets/gnosis_safe.svg')

type TokenProps = SelectorProps & Actions

type State = {
  component: React$Node,
}

const listStyle = {
  width: '100%',
  paddingBottom: 0,
}

class TokenLayout extends React.PureComponent<TokenProps, State> {
  state = {
    component: undefined,
  }

  onAddToken = () => {
    const { addresses, safeAddress, addToken } = this.props

    this.setState({
      component: <AddToken
        addToken={addToken}
        tokens={addresses.toArray()}
        safeAddress={safeAddress}
      />,
    })
  }

  onRemoveToken = (token: Token) => {
    const { safeAddress, removeToken } = this.props

    this.setState({
      component: <RemoveToken
        token={token}
        safeAddress={safeAddress}
        removeTokenAction={removeToken}
      />,
    })
  }

  onEnableToken = (token: Token) => {
    const { enableToken, safe } = this.props
    const safeAddress = safe.get('address')

    enableToken(safeAddress, token)
  }

  onDisableToken = (token: Token) => {
    const { disableToken, safe } = this.props
    const safeAddress = safe.get('address')

    disableToken(safeAddress, token)
  }

  render() {
    const { safe, safeAddress, tokens } = this.props
    const { component } = this.state
    const name = safe ? safe.get('name') : ''

    return (
      <Row grow>
        <Col sm={12} top="xs" md={5} margin="xl" overflow>
          <MuiList style={listStyle}>
            {tokens.map((token: Token) => (
              <TokenComponent
                key={token.get('address')}
                token={token}
                onDisableToken={this.onDisableToken}
                onEnableToken={this.onEnableToken}
                onRemove={this.onRemoveToken}
              />
            ))}
          </MuiList>
        </Col>
        <Col sm={12} center="xs" md={7} margin="xl" layout="column">
          <Block margin="xl">
            <Paragraph size="lg" noMargin align="right">
              <IconButton to={`${SAFELIST_ADDRESS}/${safeAddress}`} component={Link}>
                <AccountBalanceWallet />
              </IconButton>
              <IconButton onClick={this.onAddToken}>
                <AddCircle />
              </IconButton>
              <Bold>{name}</Bold>
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

export default TokenLayout
