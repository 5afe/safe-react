import { GenericModal, Loader } from '@gnosis.pm/safe-react-components'
import { useState, lazy, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'

import { currentSafeFeaturesEnabled, currentSafeOwners } from 'src/logic/safe/store/selectors'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { LoadingContainer } from 'src/components/LoaderContainer'
import { generateSafeRoute, extractPrefixedSafeAddress, SAFE_ROUTES, extractSafeAddress } from 'src/routes/routes'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { SAFE_POLLING_INTERVAL } from 'src/utils/constants'
import SafeLoadError from '../components/SafeLoadError'
import { useLoadSafe } from 'src/logic/safe/hooks/useLoadSafe'
import { useSafeScheduledUpdates } from 'src/logic/safe/hooks/useSafeScheduledUpdates'

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
  const [hasLoadFailed, setHasLoadFailed] = useState<boolean>(false)

  const addressFromUrl = extractSafeAddress()
  useLoadSafe(addressFromUrl) // load initially
  useSafeScheduledUpdates(addressFromUrl) // load every X seconds

  useEffect(() => {
    if (isSafeLoaded) {
      return
    }

    const failedTimeout = setTimeout(() => {
      setHasLoadFailed(true)
    }, SAFE_POLLING_INTERVAL)
    return () => {
      clearTimeout(failedTimeout)
    }
  }, [isSafeLoaded])

  const [modal, setModal] = useState({
    isOpen: false,
    title: null,
    body: null,
    footer: null,
    onClose: () => {},
  })

  if (hasLoadFailed) {
    return <SafeLoadError />
  }

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
          path={[
            SAFE_ROUTES.TRANSACTIONS,
            SAFE_ROUTES.TRANSACTIONS_HISTORY,
            SAFE_ROUTES.TRANSACTIONS_QUEUE,
            SAFE_ROUTES.TRANSACTIONS_SINGULAR,
          ]}
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
