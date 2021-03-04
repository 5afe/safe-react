import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'

import React from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'

import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'

import { orderedTokenListSelector } from 'src/logic/tokens/store/selectors'
import { AssetsList } from 'src/routes/safe/components/Balances/Tokens/screens/AssetsList'

import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { safeBlacklistedTokensSelector } from 'src/logic/safe/store/selectors'
import { TokenList } from 'src/routes/safe/components/Balances/Tokens/screens/TokenList'

export const MANAGE_TOKENS_MODAL_CLOSE_BUTTON_TEST_ID = 'manage-tokens-close-modal-btn'

const useStyles = makeStyles(styles)

type Props = {
  safeAddress: string
  modalScreen: string
  onClose: () => void
}

export const Tokens = (props: Props): React.ReactElement => {
  const { modalScreen, onClose, safeAddress } = props
  const tokens = useSelector(orderedTokenListSelector)
  const activeTokens = useSelector(extendedSafeTokensSelector)
  const blacklistedTokens = useSelector(safeBlacklistedTokensSelector)
  const classes = useStyles()

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
      {modalScreen === 'tokenList' && (
        <TokenList
          activeTokens={activeTokens}
          blacklistedTokens={blacklistedTokens}
          safeAddress={safeAddress}
          tokens={tokens}
        />
      )}
      {modalScreen === 'assetsList' && <AssetsList />}
    </>
  )
}
