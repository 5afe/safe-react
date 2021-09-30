import { GenericModal, Loader } from '@gnosis.pm/safe-react-components'
import { useState, lazy } from 'react'
import { useSelector } from 'react-redux'
import { generatePath, Redirect, Route, Switch } from 'react-router-dom'
import { currentSafeFeaturesEnabled, currentSafeOwners } from 'src/logic/safe/store/selectors'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { getNetworkSlug, SAFE_ROUTES } from 'src/routes/routes'
import { FEATURES } from 'src/config/networks/network.d'
import { LoadingContainer } from 'src/components/LoaderContainer'
import { safeAddressFromUrl } from 'src/utils/router'

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
  const safeAddress = safeAddressFromUrl()
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

  const baseRouteSlugs = {
    network: getNetworkSlug(),
    safeAddress,
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
          path={`${SAFE_ROUTES.ASSETS_BALANCES}/:assetType?`}
          render={() => wrapInSuspense(<Balances />, null)}
        />
        <Route exact path={SAFE_ROUTES.TRANSACTIONS} render={() => wrapInSuspense(<TxList />, null)} />
        <Route exact path={SAFE_ROUTES.ADDRESS_BOOK} render={() => wrapInSuspense(<AddressBookTable />, null)} />
        <Route
          exact
          path={SAFE_ROUTES.APPS}
          render={({ history }) => {
            if (!featuresEnabled.includes(FEATURES.SAFE_APPS)) {
              history.push(generatePath(SAFE_ROUTES.ASSETS_BALANCES, baseRouteSlugs))
            }
            return wrapInSuspense(<Apps />, null)
          }}
        />
        <Route path={SAFE_ROUTES.SETTINGS_BASE_ROUTE} render={() => wrapInSuspense(<Settings />, null)} />
        <Redirect to={generatePath(SAFE_ROUTES.ASSETS_BALANCES, baseRouteSlugs)} />
      </Switch>
      {modal.isOpen && <GenericModal {...modal} onClose={closeGenericModal} />}
    </>
  )
}

export default Container
