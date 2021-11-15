import { Menu, Breadcrumb, BreadcrumbElement, Tab } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import { ReactElement, useEffect } from 'react'
import { Redirect, Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom'

import Col from 'src/components/layout/Col'
import {
  extractPrefixedSafeAddress,
  generateSafeRoute,
  SafeRouteSlugs,
  SAFE_ROUTES,
  TRANSACTION_HASH_SLUG,
} from 'src/routes/routes'
import { SAFE_EVENTS, useAnalytics } from 'src/utils/googleAnalytics'
import { HistoryTransactions } from './HistoryTransactions'
import { QueueTransactions } from './QueueTransactions'
import { ContentWrapper, Wrapper } from './styled'
import TxSingularDetails from './TxSingularDetails'

const TRANSACTION_TABS: Item[] = [
  { label: 'Queue', id: SAFE_ROUTES.TRANSACTIONS_QUEUE },
  { label: 'History', id: SAFE_ROUTES.TRANSACTIONS_HISTORY },
]

const GatewayTransactions = (): ReactElement => {
  const history = useHistory()
  const { path } = useRouteMatch()
  const { [TRANSACTION_HASH_SLUG]: safeTxHash } = useParams<SafeRouteSlugs>()
  const isDeeplinkedTx = !!safeTxHash

  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent(SAFE_EVENTS.TRANSACTIONS)
  }, [trackEvent])

  const onTabChange = (path: string) => history.replace(generateSafeRoute(path, extractPrefixedSafeAddress()))

  return (
    <Wrapper>
      <Menu>
        <Col start="sm" xs={12}>
          <Breadcrumb>
            <BreadcrumbElement iconType="transactionsInactive" text="TRANSACTIONS" />
            {isDeeplinkedTx && <BreadcrumbElement text="DETAILS" color="placeHolder" />}
          </Breadcrumb>
        </Col>
      </Menu>
      {!isDeeplinkedTx && <Tab onChange={onTabChange} items={TRANSACTION_TABS} selectedTab={path} />}
      <ContentWrapper>
        <Switch>
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_QUEUE} render={() => <QueueTransactions />} />
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_HISTORY} render={() => <HistoryTransactions />} />
          {isDeeplinkedTx ? (
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
