import { withStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import Receive from './Receive'
import Tokens from './Tokens'
import { styles } from './style'

import Modal from 'src/components/Modal'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Divider from 'src/components/layout/Divider'
import Link from 'src/components/layout/Link'
import Row from 'src/components/layout/Row'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import CurrencyDropdown from 'src/routes/safe/components/CurrencyDropdown'
import { useFetchTokens } from 'src/routes/safe/container/hooks/useFetchTokens'
import { safeFeaturesEnabledSelector, safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { history } from 'src/store/index'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
const Collectibles = React.lazy(() => import('src/routes/safe/components/Balances/Collectibles'))
const Coins = React.lazy(() => import('src/routes/safe/components/Balances/Coins'))

export const MANAGE_TOKENS_BUTTON_TEST_ID = 'manage-tokens-btn'
export const BALANCE_ROW_TEST_ID = 'balance-row'

const INITIAL_STATE = {
  erc721Enabled: false,
  subMenuOptions: [],
  showToken: false,
  showManageCollectibleModal: false,
  sendFunds: {
    isOpen: false,
    selectedToken: undefined,
  },
  showCoins: true,
  showCollectibles: false,
  showReceive: false,
}

export const COINS_LOCATION_REGEX = /\/balances\/?$/
export const COLLECTIBLES_LOCATION_REGEX = /\/balances\/collectibles$/

const Balances = (props) => {
  const [state, setState] = useState(INITIAL_STATE)

  const address = useSelector(safeParamAddressFromStateSelector)
  const featuresEnabled = useSelector(safeFeaturesEnabledSelector)

  useFetchTokens()

  useEffect(() => {
    const showCollectibles = COLLECTIBLES_LOCATION_REGEX.test(history.location.pathname)
    const showCoins = COINS_LOCATION_REGEX.test(history.location.pathname)
    const subMenuOptions = [{ enabled: showCoins, legend: 'Coins', url: `${SAFELIST_ADDRESS}/${address}/balances` }]

    if (!showCollectibles && !showCoins) {
      history.replace(`${SAFELIST_ADDRESS}/${address}/balances`)
    }

    const erc721Enabled = featuresEnabled && featuresEnabled.includes('ERC721')

    if (erc721Enabled) {
      subMenuOptions.push({
        enabled: showCollectibles,
        legend: 'Collectibles',
        url: `${SAFELIST_ADDRESS}/${address}/balances/collectibles`,
      })
    } else {
      if (showCollectibles) {
        history.replace(subMenuOptions[0].url)
      }
    }

    setState((prevState) => ({
      ...prevState,
      showCoins,
      showCollectibles,
      erc721Enabled,
      subMenuOptions,
    }))
  }, [featuresEnabled, address])

  const onShow = (action) => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: true }))
  }

  const onHide = (action) => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: false }))
  }

  const showSendFunds = (tokenAddress) => {
    setState((prevState) => ({
      ...prevState,
      sendFunds: {
        isOpen: true,
        selectedToken: tokenAddress,
      },
    }))
  }

  const hideSendFunds = () => {
    setState((prevState) => ({
      ...prevState,
      sendFunds: {
        isOpen: false,
        selectedToken: undefined,
      },
    }))
  }

  const {
    assetDivider,
    assetTab,
    assetTabActive,
    assetTabs,
    controls,
    manageTokensButton,
    receiveModal,
    tokenControls,
  } = props.classes
  const {
    erc721Enabled,
    sendFunds,
    showCoins,
    showCollectibles,
    showManageCollectibleModal,
    showReceive,
    showToken,
    subMenuOptions,
  } = state

  return (
    <>
      <Row align="center" className={controls}>
        <Col className={assetTabs} sm={6} start="sm" xs={12}>
          {subMenuOptions.length > 1 &&
            subMenuOptions.map(({ enabled, legend, url }, index) => (
              <React.Fragment key={`legend-${index}`}>
                {index > 0 && <Divider className={assetDivider} />}
                <Link
                  className={enabled ? assetTabActive : assetTab}
                  data-testid={`${legend.toLowerCase()}'-assets-btn'`}
                  size="md"
                  to={url}
                  weight={enabled ? 'bold' : 'regular'}
                >
                  {legend}
                </Link>
              </React.Fragment>
            ))}
        </Col>
        <Col className={tokenControls} end="sm" sm={6} xs={12}>
          {showCoins && <CurrencyDropdown />}
          <ButtonLink
            className={manageTokensButton}
            onClick={erc721Enabled && showCollectibles ? () => onShow('ManageCollectibleModal') : () => onShow('Token')}
            size="lg"
            testId="manage-tokens-btn"
          >
            Manage List
          </ButtonLink>
          <Modal
            description={
              erc721Enabled ? 'Enable and disables assets to be listed' : 'Enable and disable tokens to be listed'
            }
            handleClose={showManageCollectibleModal ? () => onHide('ManageCollectibleModal') : () => onHide('Token')}
            open={showToken || showManageCollectibleModal}
            title="Manage List"
          >
            <Tokens
              modalScreen={showManageCollectibleModal ? 'assetsList' : 'tokenList'}
              onClose={showManageCollectibleModal ? () => onHide('ManageCollectibleModal') : () => onHide('Token')}
              safeAddress={address}
            />
          </Modal>
        </Col>
      </Row>
      {showCoins && wrapInSuspense(<Coins showReceiveFunds={() => onShow('Receive')} showSendFunds={showSendFunds} />)}
      {erc721Enabled && showCollectibles && wrapInSuspense(<Collectibles />)}
      <SendModal
        activeScreenType="sendFunds"
        isOpen={sendFunds.isOpen}
        onClose={hideSendFunds}
        selectedToken={sendFunds.selectedToken}
      />
      <Modal
        description="Receive Tokens Form"
        handleClose={() => onHide('Receive')}
        open={showReceive}
        paperClassName={receiveModal}
        title="Receive Tokens"
      >
        <Receive onClose={() => onHide('Receive')} />
      </Modal>
    </>
  )
}

export default withStyles(styles as any)(Balances)
