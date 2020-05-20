import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'

import React, { useState } from 'react'
import { connect, useSelector } from 'react-redux'

import actions from './actions'
import { styles } from './style'

import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'

import { orderedTokenListSelector } from 'src/logic/tokens/store/selectors'
import AddCustomAssetComponent from 'src/routes/safe/components/Balances/Tokens/screens/AddCustomAsset'
import AddCustomToken from 'src/routes/safe/components/Balances/Tokens/screens/AddCustomToken'
import AssetsList from 'src/routes/safe/components/Balances/Tokens/screens/AssetsList'
import TokenList from 'src/routes/safe/components/Balances/Tokens/screens/TokenList'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { safeBlacklistedTokensSelector } from 'src/routes/safe/store/selectors'

export const MANAGE_TOKENS_MODAL_CLOSE_BUTTON_TEST_ID = 'manage-tokens-close-modal-btn'

const Tokens = (props) => {
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
  const [activeScreen, setActiveScreen] = useState(modalScreen)

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
          parentList={'tokenList'}
          safeAddress={safeAddress}
          setActiveScreen={setActiveScreen}
          tokens={tokens}
          updateActiveTokens={updateActiveTokens}
        />
      )}
      {activeScreen === 'addCustomAsset' && (
        <AddCustomAssetComponent onClose={onClose} parentList={'assetsList'} setActiveScreen={setActiveScreen} />
      )}
    </>
  )
}

const TokenComponent = withStyles(styles as any)(Tokens)

export default connect(undefined, actions)(TokenComponent)
