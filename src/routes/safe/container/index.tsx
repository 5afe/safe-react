import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import { GenericModal } from '@gnosis.pm/safe-react-components'

import NoSafe from 'src/components/NoSafe'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { SAFELIST_ADDRESS } from 'src/routes/routes'

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
    onClose: null,
  })

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const provider = useSelector(providerNameSelector)
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })

  if (!safeAddress) {
    return <NoSafe provider={provider} text="Safe not found" />
  }

  const openGenericModal = (modalConfig) => {
    setModal({ ...modalConfig, isOpen: true })
  }

  const closeGenericModal = () => {
    if (modal.onClose) {
      modal.onClose()
    }

    setModal({
      isOpen: false,
      title: null,
      body: null,
      footer: null,
      onClose: null,
    })
  }

  return (
    <>
      <Switch>
        <Route
          exact
          path={`${matchSafeWithAddress.path}/balances/:assetType?`}
          render={() => wrapInSuspense(<Balances />, null)}
        />
        <Route
          exact
          path={`${matchSafeWithAddress.path}/transactions`}
          render={() => wrapInSuspense(<TxsTable />, null)}
        />
        <Route
          exact
          path={`${matchSafeWithAddress.path}/apps`}
          render={() => wrapInSuspense(<Apps closeModal={closeGenericModal} openModal={openGenericModal} />, null)}
        />
        <Route exact path={`${matchSafeWithAddress.path}/settings`} render={() => wrapInSuspense(<Settings />, null)} />
        <Route
          exact
          path={`${matchSafeWithAddress.path}/address-book`}
          render={() => wrapInSuspense(<AddressBookTable />, null)}
        />
        <Redirect to={`${matchSafeWithAddress.path}/balances`} />
      </Switch>
      {modal.isOpen && <GenericModal {...modal} onClose={closeGenericModal} />}
    </>
  )
}

export default Container
