import { GenericModal, Loader } from '@gnosis.pm/safe-react-components'
import { useState, lazy } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'

import { currentSafeFeaturesEnabled, currentSafeOwners } from 'src/logic/safe/store/selectors'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { FEATURES } from 'src/config/networks/network.d'
import { LoadingContainer } from 'src/components/LoaderContainer'
import { generateSafeRoute, extractPrefixedSafeAddress, SAFE_ROUTES } from 'src/routes/routes'

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const APPS_TAB_BTN_TEST_ID = 'apps-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const ADDRESS_BOOK_TAB_BTN_TEST_ID = 'address-book-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'
export const TRANSACTIONS_TAB_NEW_BTN_TEST_ID = 'transactions-tab-new-btn'

const Apps = lazy(() => import('src/routes/safe/components/Apps'))
const Settings = lazy(() => import('src/routes/safe/components/Settings'))
const Balances = lazy(() => import('src/routes/safe/components/Balances'))
const TxList = lazy(() => import('src/routes/safe/components/Transactions/TxList'))
const AddressBookTable = lazy(() => import('src/routes/safe/components/AddressBook'))

const Container = (): React.ReactElement => {
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
          path={[SAFE_ROUTES.ASSETS_BALANCES, SAFE_ROUTES.ASSETS_BALANCES_COLLECTIBLES]}
          render={() => wrapInSuspense(<Balances />, null)}
        />
        <Route
          exact
          path={SAFE_ROUTES.TRANSACTIONS}
          render={() => <Redirect to={SAFE_ROUTES.TRANSACTIONS_HISTORY} />}
        />
        <Route
          exact
          path={[SAFE_ROUTES.TRANSACTIONS_HISTORY, SAFE_ROUTES.TRANSACTIONS_QUEUE]}
          render={() => wrapInSuspense(<TxList />, null)}
        />
        <Route exact path={SAFE_ROUTES.ADDRESS_BOOK} render={() => wrapInSuspense(<AddressBookTable />, null)} />
        <Route
          exact
          path={SAFE_ROUTES.APPS}
          render={({ history }) => {
            if (!featuresEnabled.includes(FEATURES.SAFE_APPS)) {
              history.push(generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, extractPrefixedSafeAddress()))
            }
            return wrapInSuspense(<Apps />, null)
          }}
        />
        <Route path={SAFE_ROUTES.SETTINGS} render={() => wrapInSuspense(<Settings />, null)} />
        <Redirect to={SAFE_ROUTES.ASSETS_BALANCES} />
      </Switch>
      {modal.isOpen && <GenericModal {...modal} onClose={closeGenericModal} />}
    </>
  )
}

export default Container
