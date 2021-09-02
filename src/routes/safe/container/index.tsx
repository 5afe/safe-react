import { GenericModal, Loader } from '@gnosis.pm/safe-react-components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { generatePath, Redirect, Route, Switch } from 'react-router-dom'

import { currentSafeFeaturesEnabled, currentSafeOwners, safeAddressFromUrl } from 'src/logic/safe/store/selectors'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { SAFE_ROUTES } from 'src/routes/routes'
import { FEATURES } from 'src/config/networks/network.d'
import { LoadingContainer } from 'src/components/LoaderContainer'

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const APPS_TAB_BTN_TEST_ID = 'apps-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const ADDRESS_BOOK_TAB_BTN_TEST_ID = 'address-book-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'
export const TRANSACTIONS_TAB_NEW_BTN_TEST_ID = 'transactions-tab-new-btn'

const Apps = React.lazy(() => import('src/routes/safe/components/Apps'))
const Settings = React.lazy(() => import('src/routes/safe/components/Settings'))
const Balances = React.lazy(() => import('src/routes/safe/components/Balances'))
const TxList = React.lazy(() => import('src/routes/safe/components/Transactions/TxList'))
const AddressBookTable = React.lazy(() => import('src/routes/safe/components/AddressBook'))

const Container = (): React.ReactElement => {
  const safeAddress = useSelector(safeAddressFromUrl)
  const featuresEnabled = useSelector(currentSafeFeaturesEnabled)
  const owners = useSelector(currentSafeOwners)
  const isSafeLoaded = owners.length > 0

  const [modal, setModal] = useState({
    isOpen: false,
    title: null,
    body: null,
    footer: null,
    onClose: () => {},
  })

  if (!isSafeLoaded) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  const balancesBaseRoute = generatePath(SAFE_ROUTES.ASSETS_BASE_ROUTE, {
    safeAddress,
  })
  const settingsBaseRoute = generatePath(SAFE_ROUTES.SETTINGS_BASE_ROUTE, {
    safeAddress,
  })

  const closeGenericModal = () => {
    if (modal.onClose) {
      modal.onClose?.()
    }

    setModal({
      isOpen: false,
      title: null,
      body: null,
      footer: null,
      onClose: () => {},
    })
  }

  return (
    <>
      <Switch>
        <Route exact path={`${balancesBaseRoute}/:assetType?`} render={() => wrapInSuspense(<Balances />, null)} />
        <Route
          exact
          path={generatePath(SAFE_ROUTES.TRANSACTIONS, {
            safeAddress,
          })}
          render={() => wrapInSuspense(<TxList />, null)}
        />
        <Route
          exact
          path={generatePath(SAFE_ROUTES.APPS, {
            safeAddress,
          })}
          render={({ history }) => {
            if (!featuresEnabled.includes(FEATURES.SAFE_APPS)) {
              history.push(
                generatePath(SAFE_ROUTES.ASSETS_BALANCES, {
                  safeAddress,
                }),
              )
            }
            return wrapInSuspense(<Apps />, null)
          }}
        />
        <Route exact path={`${settingsBaseRoute}/:section`} render={() => wrapInSuspense(<Settings />, null)} />
        <Route
          exact
          path={generatePath(SAFE_ROUTES.ADDRESS_BOOK, {
            safeAddress,
          })}
          render={() => wrapInSuspense(<AddressBookTable />, null)}
        />
        <Redirect
          to={generatePath(SAFE_ROUTES.ASSETS_BALANCES, {
            safeAddress,
          })}
        />
      </Switch>
      {modal.isOpen && <GenericModal {...modal} onClose={closeGenericModal} />}
    </>
  )
}

export default Container
