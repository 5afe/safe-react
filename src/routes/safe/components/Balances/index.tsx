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

import Row from 'src/components/layout/Row'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import CurrencyDropdown from 'src/routes/safe/components/CurrencyDropdown'
import { safeFeaturesEnabledSelector, safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'

import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { useFetchTokens } from '../../container/hooks/useFetchTokens'
import { Route, Switch, NavLink, Redirect } from 'react-router-dom'

const Collectibles = React.lazy(() => import('src/routes/safe/components/Balances/Collectibles'))
const Coins = React.lazy(() => import('src/routes/safe/components/Balances/Coins'))

export const MANAGE_TOKENS_BUTTON_TEST_ID = 'manage-tokens-btn'
export const BALANCE_ROW_TEST_ID = 'balance-row'

const INITIAL_STATE = {
  erc721Enabled: false,
  showToken: false,
  showManageCollectibleModal: false,
  sendFunds: {
    isOpen: false,
    selectedToken: undefined,
  },
  showReceive: false,
}

export const COINS_LOCATION_REGEX = /\/balances\/?$/
export const COLLECTIBLES_LOCATION_REGEX = /\/balances\/collectibles$/

const Balances = (props) => {
  const [state, setState] = useState(INITIAL_STATE)

  const address = useSelector(safeParamAddressFromStateSelector)
  const featuresEnabled = useSelector(safeFeaturesEnabledSelector)

  useFetchTokens(address)

  useEffect(() => {
    const erc721Enabled = featuresEnabled && featuresEnabled.includes('ERC721')

    setState((prevState) => ({
      ...prevState,
      erc721Enabled,
    }))
  }, [featuresEnabled])

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
  const { erc721Enabled, sendFunds, showManageCollectibleModal, showReceive, showToken } = state

  return (
    <>
      <Row align="center" className={controls}>
        <Col className={assetTabs} sm={6} start="sm" xs={12}>
          <NavLink
            to={`${SAFELIST_ADDRESS}/${address}/balances`}
            activeClassName={assetTabActive}
            className={assetTab}
            data-testid={'coins-assets-btn'}
            exact
          >
            Coins
          </NavLink>
          {erc721Enabled ? (
            <>
              <Divider className={assetDivider} />
              <NavLink
                to={`${SAFELIST_ADDRESS}/${address}/balances/collectibles`}
                activeClassName={assetTabActive}
                className={assetTab}
                data-testid={'collectibles-assets-btn'}
                exact
              >
                Collectibles
              </NavLink>
            </>
          ) : null}
        </Col>
        <Switch>
          <Route
            path={`${SAFELIST_ADDRESS}/${address}/balances/collectibles`}
            exact
            render={() => {
              return !erc721Enabled ? (
                <Redirect to={`${SAFELIST_ADDRESS}/${address}/balances`} />
              ) : (
                <Col className={tokenControls} end="sm" sm={6} xs={12}>
                  <ButtonLink
                    className={manageTokensButton}
                    onClick={() => onShow('ManageCollectibleModal')}
                    size="lg"
                    testId="manage-tokens-btn"
                  >
                    Manage List
                  </ButtonLink>
                  <Modal
                    description={'Enable and disable tokens to be listed'}
                    handleClose={() => onHide('ManageCollectibleModal')}
                    open={showManageCollectibleModal}
                    title="Manage List"
                  >
                    <Tokens
                      modalScreen={'assetsList'}
                      onClose={() => onHide('ManageCollectibleModal')}
                      safeAddress={address}
                    />
                  </Modal>
                </Col>
              )
            }}
          />
          <Route
            path={`${SAFELIST_ADDRESS}/${address}/balances`}
            exact
            render={() => {
              return (
                <>
                  <Col className={tokenControls} end="sm" sm={6} xs={12}>
                    <CurrencyDropdown />
                    <ButtonLink
                      className={manageTokensButton}
                      onClick={() => onShow('Token')}
                      size="lg"
                      testId="manage-tokens-btn"
                    >
                      Manage List
                    </ButtonLink>
                    <Modal
                      description={'Enable and disable tokens to be listed'}
                      handleClose={() => onHide('Token')}
                      open={showToken}
                      title="Manage List"
                    >
                      <Tokens modalScreen={'tokenList'} onClose={() => onHide('Token')} safeAddress={address} />
                    </Modal>
                  </Col>
                </>
              )
            }}
          />
        </Switch>
      </Row>
      <Switch>
        <Route
          path={`${SAFELIST_ADDRESS}/${address}/balances/collectibles`}
          exact
          render={() => {
            if (erc721Enabled) {
              return wrapInSuspense(<Collectibles />)
            }
            return null
          }}
        />
        <Route
          path={`${SAFELIST_ADDRESS}/${address}/balances`}
          render={() => {
            return wrapInSuspense(<Coins showReceiveFunds={() => onShow('Receive')} showSendFunds={showSendFunds} />)
          }}
        />
      </Switch>
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
