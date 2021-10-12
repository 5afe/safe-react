import { Menu, Breadcrumb, BreadcrumbElement } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import { Tab, Tabs } from '@material-ui/core'
import { ReactElement, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import Col from 'src/components/layout/Col'
import { SAFE_ROUTES } from 'src/routes/routes'
import { SAFE_NAVIGATION_EVENT, useAnalytics } from 'src/utils/googleAnalytics'
import { HistoryTransactions } from './HistoryTransactions'
import { QueueTransactions } from './QueueTransactions'
import { ContentWrapper, Wrapper } from './styled'
import { TRANSACTIONS_PAGE_TABS } from './utils'

const items: Item[] = [
  { id: TRANSACTIONS_PAGE_TABS.QUEUE, label: 'Queue' },
  { id: TRANSACTIONS_PAGE_TABS.HISTORY, label: 'History' },
]

interface CustomLocationState {
  tabId: string
}

const GatewayTransactions = (): ReactElement => {
  const history = useHistory<CustomLocationState>()

  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Transactions' })
  }, [trackEvent])

  const handleChange = (event) => {
    const slug = `/${event.target.innerHTML.toLowerCase()}`
    const { pathname } = history.location
    const baseTransactionURL = pathname.substring(0, pathname.lastIndexOf('/'))
    const newUrl = baseTransactionURL + slug
    history.push(newUrl)
  }

  return (
    <Wrapper>
      <Menu>
        <Col start="sm" xs={12}>
          <Breadcrumb>
            <BreadcrumbElement iconType="transactionsInactive" text="TRANSACTIONS" />
          </Breadcrumb>
        </Col>
      </Menu>
      <Tabs onChange={handleChange}>
        {items.map((item) => (
          <Tab label={item.label} key={item.id} />
        ))}
      </Tabs>
      <ContentWrapper>
        <Switch>
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_QUEUE} render={() => <QueueTransactions />} />
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_HISTORY} render={() => <HistoryTransactions />} />
        </Switch>
      </ContentWrapper>
    </Wrapper>
  )
}

export default GatewayTransactions
