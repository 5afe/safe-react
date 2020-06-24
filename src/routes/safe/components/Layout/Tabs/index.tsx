import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import { withRouter } from 'react-router-dom'

import { styles } from './style'

import {
  ADDRESS_BOOK_TAB_BTN_TEST_ID,
  BALANCES_TAB_BTN_TEST_ID,
  SETTINGS_TAB_BTN_TEST_ID,
  APPS_TAB_BTN_TEST_ID,
  TRANSACTIONS_TAB_BTN_TEST_ID,
} from 'src/routes/safe/components/Layout'
import SettingsTab from 'src/routes/safe/components/Layout/Tabs/SettingsTab'
import { AddressBookIcon } from 'src/routes/safe/components/assets/AddressBookIcon'
import { AppsIcon } from 'src/routes/safe/components/assets/AppsIcon'
import { BalancesIcon } from 'src/routes/safe/components/assets/BalancesIcon'
import { TransactionsIcon } from 'src/routes/safe/components/assets/TransactionsIcon'

interface Props {
  classes: Record<string, any>
  match: Record<string, any>
  history: Record<string, any>
  location: Record<string, any>
}

const BalancesLabel = (
  <>
    <BalancesIcon />
    Assets
  </>
)

const AddressBookLabel = (
  <>
    <AddressBookIcon />
    Address Book
  </>
)

const AppsLabel = (
  <>
    <AppsIcon />
    Apps
  </>
)

const TransactionsLabel = (
  <>
    <TransactionsIcon />
    Transactions
  </>
)

const TabsComponent = (props: Props) => {
  const { classes, location, match } = props

  const handleCallToRouter = (_, value) => {
    const { history } = props

    history.push(value)
  }

  const tabsValue = () => {
    const balanceLocation = `${match.url}/balances`
    const isInBalance = new RegExp(`^${balanceLocation}.*$`)
    const { pathname } = location

    if (isInBalance.test(pathname)) {
      return balanceLocation
    }

    return pathname
  }

  return (
    <Tabs
      indicatorColor="secondary"
      onChange={handleCallToRouter}
      textColor="secondary"
      value={tabsValue()}
      variant="scrollable"
    >
      <Tab
        classes={{
          selected: classes.tabWrapperSelected,
          wrapper: classes.tabWrapper,
        }}
        data-testid={BALANCES_TAB_BTN_TEST_ID}
        label={BalancesLabel}
        value={`${match.url}/balances`}
      />
      <Tab
        classes={{
          selected: classes.tabWrapperSelected,
          wrapper: classes.tabWrapper,
        }}
        data-testid={TRANSACTIONS_TAB_BTN_TEST_ID}
        label={TransactionsLabel}
        value={`${match.url}/transactions`}
      />
      <Tab
        classes={{
          selected: classes.tabWrapperSelected,
          wrapper: classes.tabWrapper,
        }}
        data-testid={APPS_TAB_BTN_TEST_ID}
        label={AppsLabel}
        value={`${match.url}/apps`}
      />
      <Tab
        classes={{
          selected: classes.tabWrapperSelected,
          wrapper: classes.tabWrapper,
        }}
        data-testid={ADDRESS_BOOK_TAB_BTN_TEST_ID}
        label={AddressBookLabel}
        value={`${match.url}/address-book`}
      />
      <Tab
        classes={{
          selected: classes.tabWrapperSelected,
          wrapper: classes.tabWrapper,
        }}
        data-testid={SETTINGS_TAB_BTN_TEST_ID}
        label={<SettingsTab />}
        value={`${match.url}/settings`}
      />
    </Tabs>
  )
}
export default withStyles(styles as any)(withRouter(TabsComponent))
