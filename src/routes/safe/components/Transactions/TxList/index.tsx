import { Menu, Breadcrumb, BreadcrumbElement, Tab } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import { ReactElement, useEffect } from 'react'
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'

import Col from 'src/components/layout/Col'
import { extractPrefixedSafeAddress, generateSafeRoute, SafeRouteSlugs, SAFE_ROUTES } from 'src/routes/routes'
import { SAFE_NAVIGATION_EVENT, useAnalytics } from 'src/utils/googleAnalytics'
import { HistoryTransactions } from './HistoryTransactions'
import { QueueTransactions } from './QueueTransactions'
import { ContentWrapper, Wrapper } from './styled'
import TxSingularDetails from './TxSingularDetails'
import { isDeeplinkedTx } from './utils'

const TRANSACTION_TABS: Item[] = [
  { label: 'Queue', id: SAFE_ROUTES.TRANSACTIONS_QUEUE },
  { label: 'History', id: SAFE_ROUTES.TRANSACTIONS_HISTORY },
]

const GatewayTransactions = (): ReactElement => {
  const history = useHistory()
  const { path } = useRouteMatch<SafeRouteSlugs>()

  //TODO: fix selectedTab
  const selectedTab = TRANSACTION_TABS.find(({ id }) => path.includes(id))?.id || ''

  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Transactions' })
  }, [trackEvent])

  const onTabChange = (path: string) => history.replace(generateSafeRoute(path, extractPrefixedSafeAddress()))

  return (
    <Wrapper>
      <Menu>
        <Col start="sm" xs={12}>
          <Breadcrumb>
            <BreadcrumbElement iconType="transactionsInactive" text="TRANSACTIONS" />
          </Breadcrumb>
        </Col>
      </Menu>
      <Tab onChange={onTabChange} items={TRANSACTION_TABS} selectedTab={selectedTab} />
      <ContentWrapper>
        <Switch>
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_QUEUE} render={() => <QueueTransactions />} />
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_HISTORY} render={() => <HistoryTransactions />} />
          {isDeeplinkedTx() ? (
            <Route exact path={SAFE_ROUTES.TRANSACTIONS} render={() => <TxSingularDetails />} />
          ) : (
            <Redirect to={SAFE_ROUTES.TRANSACTIONS_HISTORY} />
          )}
        </Switch>
      </ContentWrapper>
    </Wrapper>
  )
}

export default GatewayTransactions
