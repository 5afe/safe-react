import { GenericModal } from '@gnosis.pm/safe-react-components'
//import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom'

//import { styles } from './style'

import NoSafe from 'src/components/NoSafe'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
// import TabsComponent from 'src/routes/safe/components/Layout/Tabs'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const APPS_TAB_BTN_TEST_ID = 'apps-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const ADDRESS_BOOK_TAB_BTN_TEST_ID = 'address-book-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'

const Apps = React.lazy(() => import('../components/Apps'))
const Settings = React.lazy(() => import('../components/Settings'))
const Balances = React.lazy(() => import('../components/Balances'))
const TxsTable = React.lazy(() => import('src/routes/safe/components/Transactions/TxsTable'))
const AddressBookTable = React.lazy(() => import('src/routes/safe/components/AddressBook'))

//const useStyles = makeStyles(styles as any)

const Layout = (props: RouteComponentProps) => {
  //const classes = useStyles()
  const { match } = props

  const [modal, setModal] = useState({
    isOpen: false,
    title: null,
    body: null,
    footer: null,
    onClose: null,
  })

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const provider = useSelector(providerNameSelector)
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
      {/* <TabsComponent /> */}
      <Switch>
        <Route exact path={`${match.path}/balances/:assetType?`} render={() => wrapInSuspense(<Balances />, null)} />
        <Route exact path={`${match.path}/transactions`} render={() => wrapInSuspense(<TxsTable />, null)} />
        <Route
          exact
          path={`${match.path}/apps`}
          render={() => wrapInSuspense(<Apps closeModal={closeGenericModal} openModal={openGenericModal} />, null)}
        />
        <Route exact path={`${match.path}/settings`} render={() => wrapInSuspense(<Settings />, null)} />
        <Route exact path={`${match.path}/address-book`} render={() => wrapInSuspense(<AddressBookTable />, null)} />
        <Redirect to={`${match.path}/balances`} />
      </Switch>
      {modal.isOpen && <GenericModal {...modal} onClose={closeGenericModal} />}
    </>
  )
}

export default withRouter(Layout)
