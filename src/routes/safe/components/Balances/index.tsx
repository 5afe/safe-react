import { Breadcrumb, BreadcrumbElement, Menu } from '@gnosis.pm/safe-react-components'
import { ReactElement, useState, lazy } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

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

enum SECTION_NAME {
  coins = 'Coins',
  collectibles = 'Collectibles',
}

const Balances = (): ReactElement => {
  const { address: safeAddress, featuresEnabled, name: safeName } = useSelector(currentSafeWithNames)
  const erc721Enabled = featuresEnabled?.includes(FEATURES.ERC721)
  const [showReceive, setShowReceive] = useState<boolean>(false)
  const [sentToken, setSentToken] = useState<string>('')

  // Question mark makes matching [SAFE_SUBSECTION_SLUG] optional
  const matchSafeWithBalancesSection = useRouteMatch(`${SAFE_SUBSECTION_ROUTE}?`)

  const currentSafeRoutes = generatePrefixedAddressRoutes({
    shortName: getCurrentShortChainName(),
    safeAddress,
  })

  let balancesSection: SECTION_NAME | '' = ''
  switch (matchSafeWithBalancesSection?.url) {
    case currentSafeRoutes.ASSETS_BALANCES:
      balancesSection = SECTION_NAME.coins
      break
    case currentSafeRoutes.ASSETS_BALANCES_COLLECTIBLES:
      balancesSection = SECTION_NAME.collectibles
      break
  }

  const openReceive = () => setShowReceive(true)
  const closeReceive = () => setShowReceive(false)
  const closeSendFunds = () => setSentToken('')

  return (
    <>
      {/* Breadcrumbs & Currency Selector */}
      <Menu>
        <Col start="sm" sm={6} xs={12}>
          <Breadcrumb>
            <BreadcrumbElement iconType="assets" text="ASSETS" color="primary" />
            <BreadcrumbElement text={balancesSection} color="placeHolder" />
          </Breadcrumb>
        </Col>

        <Col end="sm" sm={6} xs={12}>
          {balancesSection === SECTION_NAME.coins && <CurrencyDropdown testId={'balances-currency-dropdown'} />}
        </Col>
      </Menu>

      {/* Coins & Collectibles sub-router */}
      <Switch>
        <Route
          path={SAFE_ROUTES.ASSETS_BALANCES_COLLECTIBLES}
          exact
          render={() => (erc721Enabled ? wrapInSuspense(<Collectibles />) : null)}
        />
        <Route
          path={SAFE_ROUTES.ASSETS_BALANCES}
          exact
          render={() => wrapInSuspense(<Coins showReceiveFunds={openReceive} showSendFunds={setSentToken} />)}
        />
      </Switch>

      {/* Send Funds modal */}
      <SendModal activeScreenType="sendFunds" isOpen={!!sentToken} onClose={closeSendFunds} selectedToken={sentToken} />

      {/* Receive Tokens modal */}
      <Modal
        description="Receive Tokens Form"
        handleClose={closeReceive}
        open={showReceive}
        paperClassName="receive-modal"
        title="Receive Tokens"
      >
        <ReceiveModal safeAddress={safeAddress} safeName={safeName} onClose={closeReceive} />
      </Modal>
    </>
  )
}

export default Balances
