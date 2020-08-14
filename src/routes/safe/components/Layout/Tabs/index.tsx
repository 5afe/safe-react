import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useRouteMatch, useLocation, useHistory } from 'react-router-dom'

import { styles } from './style'

import {
  ADDRESS_BOOK_TAB_BTN_TEST_ID,
  BALANCES_TAB_BTN_TEST_ID,
  SETTINGS_TAB_BTN_TEST_ID,
  APPS_TAB_BTN_TEST_ID,
  TRANSACTIONS_TAB_BTN_TEST_ID,
  TRANSACTIONS_TAB_NEW_BTN_TEST_ID,
} from 'src/routes/safe/container'
import SettingsTab from 'src/routes/safe/components/Layout/Tabs/SettingsTab'
import { AddressBookIcon } from 'src/routes/safe/components/assets/AddressBookIcon'
import { AppsIcon } from 'src/routes/safe/components/assets/AppsIcon'
import { BalancesIcon } from 'src/routes/safe/components/assets/BalancesIcon'
import { TransactionsIcon } from 'src/routes/safe/components/assets/TransactionsIcon'

// export const BALANCES_TAB_BTN_TEST_ID = 'balances-tab-btn'
// export const SETTINGS_TAB_BTN_TEST_ID = 'settings-tab-btn'
// export const APPS_TAB_BTN_TEST_ID = 'apps-tab-btn'
// export const TRANSACTIONS_TAB_BTN_TEST_ID = 'transactions-tab-btn'
// export const TRANSACTIONS_TAB_NEW_BTN_TEST_ID = 'transactions-tab-new-btn'
// export const ADDRESS_BOOK_TAB_BTN_TEST_ID = 'address-book-tab-btn'

const tabs = [
  {
    label: (
      <>
        <BalancesIcon />
        Assets
      </>
    ),
    testId: BALANCES_TAB_BTN_TEST_ID,
    value: '/balances',
  },
  {
    label: (
      <>
        <TransactionsIcon />
        Transactions
      </>
    ),
    testId: TRANSACTIONS_TAB_BTN_TEST_ID,
    value: '/transactions',
  },
  {
    label: (
      <>
        <AppsIcon />
        Apps
      </>
    ),
    testId: APPS_TAB_BTN_TEST_ID,
    value: '/apps',
  },
  {
    label: (
      <>
        <AddressBookIcon />
        Address Book
      </>
    ),
    testId: ADDRESS_BOOK_TAB_BTN_TEST_ID,
    value: '/address-book',
  },
  { label: <SettingsTab />, testId: SETTINGS_TAB_BTN_TEST_ID, value: '/settings' },
]

if (process.env.REACT_APP_NEW_TX_TAB === 'enabled') {
  tabs.push({
    label: (
      <>
        <TransactionsIcon />
        Txs New
      </>
    ),
    testId: TRANSACTIONS_TAB_NEW_BTN_TEST_ID,
    value: '/all-transactions',
  })
}

const useStyles = makeStyles(styles)

const TabsComponent = (): React.ReactElement => {
  const classes = useStyles()
  const match = useRouteMatch()
  const location = useLocation()
  const history = useHistory()

  const handleCallToRouter = (_: unknown, value: string) => {
    history.push(value)
  }

  return (
    <Tabs
      indicatorColor="secondary"
      onChange={handleCallToRouter}
      textColor="secondary"
      value={location.pathname}
      variant="scrollable"
    >
      {tabs.map((t) => (
        <Tab
          key={t.value}
          classes={{
            selected: classes.tabWrapperSelected,
            wrapper: classes.tabWrapper,
          }}
          data-testid={t.testId}
          label={t.label}
          value={`${match.url}${t.value}`}
        />
      ))}
    </Tabs>
  )
}
export default TabsComponent
