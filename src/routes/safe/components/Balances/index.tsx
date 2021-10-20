import { Breadcrumb, BreadcrumbElement, Menu } from '@gnosis.pm/safe-react-components'
import { ReactElement, useEffect, useState, lazy } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'

import Col from 'src/components/layout/Col'
import Modal from 'src/components/Modal'
import ReceiveModal from 'src/components/App/ReceiveModal'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { CurrencyDropdown } from 'src/routes/safe/components/CurrencyDropdown'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { FEATURES } from 'src/config/networks/network.d'
import { generatePrefixedAddressRoutes, SAFE_ROUTES, SAFE_SUBSECTION_ROUTE } from 'src/routes/routes'
import { getCurrentShortChainName } from 'src/config'

const Collectibles = lazy(() => import('src/routes/safe/components/Balances/Collectibles'))
const Coins = lazy(() => import('src/routes/safe/components/Balances/Coins'))

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

const Balances = (): ReactElement => {
  const [state, setState] = useState(INITIAL_STATE)

  // Question mark makes matching [SAFE_SUBSECTION_SLUG] optional
  const matchSafeWithBalancesSection = useRouteMatch(`${SAFE_SUBSECTION_ROUTE}?`)

  const { address: safeAddress, featuresEnabled, name: safeName } = useSelector(currentSafeWithNames)

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

  const { erc721Enabled, sendFunds, showReceive } = state

  const currentSafeRoutes = generatePrefixedAddressRoutes({
    shortName: getCurrentShortChainName(),
    safeAddress,
  })

  let balancesSection
  switch (matchSafeWithBalancesSection?.url) {
    case currentSafeRoutes.ASSETS_BALANCES:
      balancesSection = 'Coins'
      break
    case currentSafeRoutes.ASSETS_BALANCES_COLLECTIBLES:
      balancesSection = 'Collectibles'
      break
    default:
      balancesSection = ''
  }

  return (
    <>
      <Menu>
        <Col start="sm" sm={6} xs={12}>
          <Breadcrumb>
            <BreadcrumbElement iconType="assets" text="ASSETS" color="primary" />
            <BreadcrumbElement text={balancesSection} color="placeHolder" />
          </Breadcrumb>
        </Col>
        <Switch>
          <Route
            path={SAFE_ROUTES.ASSETS_BALANCES_COLLECTIBLES}
            exact
            render={() => {
              return !erc721Enabled ? (
                <Redirect to={SAFE_ROUTES.ASSETS_BALANCES} />
              ) : (
                <Col end="sm" sm={6} xs={12}></Col>
              )
            }}
          />
          <Route
            path={SAFE_ROUTES.ASSETS_BALANCES}
            exact
            render={() => (
              <Col end="sm" sm={6} xs={12}>
                <CurrencyDropdown testId={'balances-currency-dropdown'} />
              </Col>
            )}
          />
        </Switch>
      </Menu>
      <Switch>
        <Route
          path={SAFE_ROUTES.ASSETS_BALANCES_COLLECTIBLES}
          exact
          render={() => {
            if (erc721Enabled) {
              return wrapInSuspense(<Collectibles />)
            }
            return null
          }}
        />
        <Route
          path={SAFE_ROUTES.ASSETS_BALANCES}
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
        <ReceiveModal safeAddress={safeAddress} safeName={safeName} onClose={() => onHide('Receive')} />
      </Modal>
    </>
  )
}

export default Balances
