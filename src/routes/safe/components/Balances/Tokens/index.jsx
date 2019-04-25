// @flow
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import Row from '~/components/layout/Row'
import TokenList from '~/routes/safe/components/Balances/Tokens/screens/TokenList'
import AddCustomToken from '~/routes/safe/components/Balances/Tokens/screens/AddCustomToken'
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

const Tokens = (props: Props) => {
  const [activeScreen, setActiveScreen] = useState<string>('tokenList')
  const {
    onClose,
    classes,
    tokens,
    activeTokens,
    fetchTokens,
    updateActiveTokens,
    safeAddress,
    addToken,
    activateTokenForAllSafes,
  } = props

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
          setActiveScreen={setActiveScreen}
        />
      )}
      {activeScreen === 'addCustomToken' && (
        <AddCustomToken
          setActiveScreen={setActiveScreen}
          onClose={onClose}
          addToken={addToken}
          safeAddress={safeAddress}
          activeTokens={activeTokens}
          updateActiveTokens={updateActiveTokens}
          activateTokenForAllSafes={activateTokenForAllSafes}
          tokens={tokens}
        />
      )}
    </React.Fragment>
  )
}

const TokenComponent = withStyles(styles)(Tokens)

export default connect(
  undefined,
  actions,
)(TokenComponent)
