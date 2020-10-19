import { GenericModal } from '@gnosis.pm/safe-react-components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'

import NoSafe from 'src/components/NoSafe'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { safeFeaturesEnabledSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { AppReduxState } from 'src/store'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { FEATURES } from 'src/config/networks/network.d'

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const APPS_TAB_BTN_TEST_ID = 'apps-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const ADDRESS_BOOK_TAB_BTN_TEST_ID = 'address-book-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'
export const TRANSACTIONS_TAB_NEW_BTN_TEST_ID = 'transactions-tab-new-btn'

const Apps = React.lazy(() => import('../components/Apps'))
const Settings = React.lazy(() => import('../components/Settings'))
const Balances = React.lazy(() => import('../components/Balances'))
const TxsTable = React.lazy(() => import('src/routes/safe/components/Transactions/TxsTable'))
const AddressBookTable = React.lazy(() => import('src/routes/safe/components/AddressBook'))

const Container = (): React.ReactElement => {
  const [modal, setModal] = useState({
    isOpen: false,
    title: null,
    body: null,
    footer: null,
    onClose: () => {},
  })

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const provider = useSelector(providerNameSelector)
  const featuresEnabled = useSelector<AppReduxState, FEATURES[] | undefined>(
    safeFeaturesEnabledSelector,
    (left, right) => {
      if (Array.isArray(left) && Array.isArray(right)) {
        return JSON.stringify(left) === JSON.stringify(right)
      }

      return left === right
    },
  )
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
  const safeAppsEnabled = Boolean(featuresEnabled?.includes(FEATURES.SAFE_APPS))

  if (!safeAddress) {
    return <NoSafe provider={provider} text="Safe not found" />
  }

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
        <Route
          exact
          path={`${matchSafeWithAddress?.path}/balances/:assetType?`}
          render={() => wrapInSuspense(<Balances />, null)}
        />
        <Route
          exact
          path={`${matchSafeWithAddress?.path}/transactions`}
          render={() => wrapInSuspense(<TxsTable />, null)}
        />
        <Route
          exact
          path={`${matchSafeWithAddress?.path}/apps`}
          render={({ history }) => {
            if (!safeAppsEnabled) {
              history.push(`${matchSafeWithAddress?.url}/balances`)
            }
            return wrapInSuspense(<Apps />, null)
          }}
        />

        <Route
          exact
          path={`${matchSafeWithAddress?.path}/settings`}
          render={() => wrapInSuspense(<Settings />, null)}
        />
        <Route
          exact
          path={`${matchSafeWithAddress?.path}/address-book`}
          render={() => wrapInSuspense(<AddressBookTable />, null)}
        />
        <Redirect to={`${matchSafeWithAddress?.path}/balances`} />
      </Switch>
      {modal.isOpen && <GenericModal {...modal} onClose={closeGenericModal} />}
    </>
  )
}

export default Container
