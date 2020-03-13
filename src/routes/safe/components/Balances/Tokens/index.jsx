// @flow
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { List } from 'immutable'
import React, { useState } from 'react'
import { connect, useSelector } from 'react-redux'

import actions, { type Actions } from './actions'
import { styles } from './style'

import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { type Token } from '~/logic/tokens/store/model/token'
import { orderedTokenListSelector } from '~/logic/tokens/store/selectors'
import AddCustomToken from '~/routes/safe/components/Balances/Tokens/screens/AddCustomToken'
import AssetsList from '~/routes/safe/components/Balances/Tokens/screens/AssetsList'
import TokenList from '~/routes/safe/components/Balances/Tokens/screens/TokenList'
import { extendedSafeTokensSelector } from '~/routes/safe/container/selector'
import { safeBlacklistedTokensSelector } from '~/routes/safe/store/selectors'

export const MANAGE_TOKENS_MODAL_CLOSE_BUTTON_TEST_ID = 'manage-tokens-close-modal-btn'

type ActiveScreen = 'tokenList' | 'addCustomToken' | 'assetsList' | 'addCustomAsset'

type Props = Actions & {
  onClose: () => void,
  classes: Object,
  tokens: List<Token>,
  safeAddress: string,
  activeTokens: List<Token>,
  blacklistedTokens: List<Token>,
  modalScreen: ActiveScreen,
}

const Tokens = (props: Props) => {
  const {
    activateTokenForAllSafes,
    addToken,
    classes,
    fetchTokens,
    modalScreen,
    onClose,
    safeAddress,
    updateActiveTokens,
    updateBlacklistedTokens,
  } = props
  const tokens = useSelector(orderedTokenListSelector)
  const activeTokens = useSelector(extendedSafeTokensSelector)
  const blacklistedTokens = useSelector(safeBlacklistedTokensSelector)
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(modalScreen)

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph noMargin size="xl" weight="bolder">
          Manage List
        </Paragraph>
        <IconButton data-testid={MANAGE_TOKENS_MODAL_CLOSE_BUTTON_TEST_ID} disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      {activeScreen === 'tokenList' && (
        <TokenList
          activeTokens={activeTokens}
          blacklistedTokens={blacklistedTokens}
          fetchTokens={fetchTokens}
          safeAddress={safeAddress}
          setActiveScreen={setActiveScreen}
          tokens={tokens}
          updateActiveTokens={updateActiveTokens}
          updateBlacklistedTokens={updateBlacklistedTokens}
        />
      )}
      {activeScreen === 'assetsList' && <AssetsList setActiveScreen={setActiveScreen} />}
      {activeScreen === 'addCustomToken' && (
        <AddCustomToken
          activateTokenForAllSafes={activateTokenForAllSafes}
          activeTokens={activeTokens}
          addToken={addToken}
          onClose={onClose}
          safeAddress={safeAddress}
          setActiveScreen={setActiveScreen}
          tokens={tokens}
          updateActiveTokens={updateActiveTokens}
        />
      )}
      {activeScreen === 'addCustomAsset' && (
        <AddCustomToken
          activateTokenForAllSafes={activateTokenForAllSafes}
          activeTokens={activeTokens}
          addToken={addToken}
          onClose={onClose}
          safeAddress={safeAddress}
          setActiveScreen={setActiveScreen}
          tokens={tokens}
          updateActiveTokens={updateActiveTokens}
        />
      )}
    </>
  )
}

const TokenComponent = withStyles(styles)(Tokens)

export default connect(undefined, actions)(TokenComponent)
