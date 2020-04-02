// @flow
import { withStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'

import Receive from '../Balances/Receive'

import { styles } from './style'

import { GenericModal } from '~/components-v2'
import Modal from '~/components/Modal'
import NoSafe from '~/components/NoSafe'
import Hairline from '~/components/layout/Hairline'
import { providerNameSelector } from '~/logic/wallets/store/selectors'
import SendModal from '~/routes/safe/components/Balances/SendModal'
import LayoutHeader from '~/routes/safe/components/Layout/Header'
import TabsComponent from '~/routes/safe/components/Layout/Tabs'
import { safeSelector } from '~/routes/safe/store/selectors'
import { border } from '~/theme/variables'

export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
export const ADDRESS_BOOK_TAB_BTN_TEST_ID = 'address-book-tab-btn'
export const SAFE_VIEW_NAME_HEADING_TEST_ID = 'safe-name-heading'

const Apps = React.lazy(() => import('../Apps'))
const Settings = React.lazy(() => import('../Settings'))
const Balances = React.lazy(() => import('../Balances'))
const TxsTable = React.lazy(() => import('~/routes/safe/components/Transactions/TxsTable'))
const AddressBookTable = React.lazy(() => import('~/routes/safe/components/AddressBook'))

type Props = {
  classes: Object,
  sendFunds: Object,
  showReceive: boolean,
  onShow: Function,
  onHide: Function,
  showSendFunds: Function,
  hideSendFunds: Function,
  match: Object,
  location: Object,
  history: Object,
}

const Layout = (props: Props) => {
  const { classes, hideSendFunds, match, onHide, onShow, sendFunds, showReceive, showSendFunds } = props

  const [modal, setModal] = useState({
    isOpen: false,
    title: null,
    body: null,
    footer: null,
    onClose: null,
  })

  const safe = useSelector(safeSelector)
  const provider = useSelector(providerNameSelector)
  if (!safe) {
    return <NoSafe provider={provider} text="Safe not found" />
  }

  const openGenericModal = modalConfig => {
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

  const renderAppsTab = () => (
    <React.Suspense>
      <Apps closeModal={closeGenericModal} openModal={openGenericModal} />
    </React.Suspense>
  )

  const renderSettingsTab = () => (
    <React.Suspense>
      <Settings />
    </React.Suspense>
  )
  const renderBalancesTab = () => (
    <React.Suspense>
      <Balances />
    </React.Suspense>
  )

  const renderTransactionsTab = () => (
    <React.Suspense>
      <TxsTable />
    </React.Suspense>
  )

  const renderAddressBookTab = () => (
    <React.Suspense>
      <AddressBookTable />
    </React.Suspense>
  )

  return (
    <>
      <LayoutHeader onShow={onShow} showSendFunds={showSendFunds} />
      <TabsComponent />
      <Hairline color={border} style={{ marginTop: '-2px' }} />
      <Switch>
        <Route exact path={`${match.path}/balances/:assetType?`} render={renderBalancesTab} />
        <Route exact path={`${match.path}/transactions`} render={renderTransactionsTab} />
        {process.env.REACT_APP_ENV !== 'production' && (
          <Route exact path={`${match.path}/apps`} render={renderAppsTab} />
        )}
        <Route exact path={`${match.path}/settings`} render={renderSettingsTab} />
        <Route exact path={`${match.path}/address-book`} render={renderAddressBookTab} />
        <Redirect to={`${match.path}/balances`} />
      </Switch>
      <SendModal
        activeScreenType="chooseTxType"
        isOpen={sendFunds.isOpen}
        onClose={hideSendFunds}
        selectedToken={sendFunds.selectedToken}
      />
      <Modal
        description="Receive Tokens Form"
        handleClose={onHide('Receive')}
        open={showReceive}
        paperClassName={classes.receiveModal}
        title="Receive Tokens"
      >
        <Receive onClose={onHide('Receive')} />
      </Modal>

      {modal.isOpen && <GenericModal {...modal} onClose={closeGenericModal} />}
    </>
  )
}

export default withStyles(styles)(withRouter(Layout))
