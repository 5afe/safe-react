import { makeStyles } from '@material-ui/core/styles'
import React, { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import ReceiveModal from 'src/components/App/ReceiveModal'
import { styles } from './style'

import Modal from 'src/components/Modal'
import Col from 'src/components/layout/Col'
import Divider from 'src/components/layout/Divider'

import Row from 'src/components/layout/Row'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { CurrencyDropdown } from 'src/routes/safe/components/CurrencyDropdown'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'

import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { useFetchTokens } from 'src/logic/safe/hooks/useFetchTokens'
import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { FEATURES } from 'src/config/networks/network.d'

const Collectibles = React.lazy(() => import('src/routes/safe/components/Balances/Collectibles'))
const Coins = React.lazy(() => import('src/routes/safe/components/Balances/Coins'))

export const MANAGE_TOKENS_BUTTON_TEST_ID = 'manage-tokens-btn'
export const BALANCE_ROW_TEST_ID = 'balance-row'

const INITIAL_STATE = {
  erc721Enabled: false,
  showToken: false,
  sendFunds: {
    isOpen: false,
    selectedToken: '',
  },
  showReceive: false,
}

export const COINS_LOCATION_REGEX = /\/balances\/?$/
export const COLLECTIBLES_LOCATION_REGEX = /\/balances\/collectibles$/

const useStyles = makeStyles(styles)

const Balances = (): ReactElement => {
  const classes = useStyles()
  const [state, setState] = useState(INITIAL_STATE)

  const { address, featuresEnabled, name: safeName } = useSelector(currentSafeWithNames)

  useFetchTokens(address)

  useEffect(() => {
    const erc721Enabled = Boolean(featuresEnabled?.includes(FEATURES.ERC721))

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

  const showSendFunds = (tokenAddress: string): void => {
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
        selectedToken: '',
      },
    }))
  }

  const { assetDivider, assetTab, assetTabActive, assetTabs, controls, tokenControls } = classes
  const { erc721Enabled, sendFunds, showReceive } = state

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
              return !erc721Enabled ? <Redirect to={`${SAFELIST_ADDRESS}/${address}/balances`} /> : null
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
        paperClassName="receive-modal"
        title="Receive Tokens"
      >
        <ReceiveModal safeAddress={address} safeName={safeName} onClose={() => onHide('Receive')} />
      </Modal>
    </>
  )
}

export default Balances
