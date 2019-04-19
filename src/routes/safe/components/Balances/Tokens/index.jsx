// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import Row from '~/components/layout/Row'
import TokenList from '~/routes/safe/components/Balances/Tokens/screens/TokenList'
import { type Token } from '~/logic/tokens/store/model/token'
import actions, { type Actions } from './actions'
import { styles } from './style'

type Props = Actions & {
  onClose: () => void,
  classes: Object,
  tokens: List<Token>,
  safeAddress: string,
  activeTokens: List<Token>,
}

type State = {
  activeScreen: string,
}

class Tokens extends React.Component<Props, State> {
  state = {
    activeScreen: 'tokenList',
  }

  render() {
    const {
      onClose, classes, tokens, activeTokens, fetchTokens, updateActiveTokens, safeAddress,
    } = this.props
    const { activeScreen } = this.state

    return (
      <React.Fragment>
        <Row align="center" grow className={classes.heading}>
          <Paragraph className={classes.manage} noMargin>
            Manage Tokens
          </Paragraph>
          <IconButton onClick={onClose} disableRipple>
            <Close className={classes.close} />
          </IconButton>
        </Row>
        <Hairline />
        {activeScreen === 'tokenList' && (
          <TokenList
            tokens={tokens}
            activeTokens={activeTokens}
            fetchTokens={fetchTokens}
            updateActiveTokens={updateActiveTokens}
            safeAddress={safeAddress}
          />
        )}
      </React.Fragment>
    )
  }
}

const TokenComponent = withStyles(styles)(Tokens)

export default connect(
  undefined,
  actions,
)(TokenComponent)
