import { Menu, Breadcrumb, BreadcrumbElement, Tab } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import { ReactElement, useEffect, useState } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import Col from 'src/components/layout/Col'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { isHistoricalStatus } from 'src/logic/safe/store/models/types/gateway.d'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import {
  extractPrefixedSafeAddress,
  generateSafeRoute,
  SafeRouteSlugs,
  SAFE_ROUTES,
  TRANSACTION_HASH_SLUG,
} from 'src/routes/routes'
import { SAFE_NAVIGATION_EVENT, useAnalytics } from 'src/utils/googleAnalytics'
import { HistoryTransactions } from './HistoryTransactions'
import { QueueTransactions } from './QueueTransactions'
import { ContentWrapper, Wrapper } from './styled'

const TRANSACTION_TABS: Item[] = [
  { label: 'Queue', id: SAFE_ROUTES.TRANSACTIONS_QUEUE },
  { label: 'History', id: SAFE_ROUTES.TRANSACTIONS_HISTORY },
]

const GatewayTransactions = (): ReactElement => {
  const history = useHistory()
  const { path, params } = useRouteMatch<SafeRouteSlugs>()
  const txHash = params?.[TRANSACTION_HASH_SLUG]

  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Transactions' })
  }, [trackEvent])

  // Default to the history tab to suppress MUI error
  const [txDetails, setTxDetails] = useState<TransactionDetails>()

  const selectedTab = txDetails
    ? isHistoricalStatus(txDetails.txStatus)
      ? SAFE_ROUTES.TRANSACTIONS_HISTORY
      : SAFE_ROUTES.TRANSACTIONS_QUEUE
    : path

  useEffect(() => {
    let isCurrent = true

    if (!txHash) {
      return
    }

    const getTransaction = async (): Promise<void> => {
      try {
        const tx = await fetchSafeTransaction(txHash)
        if (isCurrent) {
          setTxDetails(tx)
        }
      } catch (e) {
        logError(Errors._613, e.message)
      }
    }
    getTransaction()

    return () => {
      isCurrent = false
    }
  }, [txHash, path])

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
          <Route
            exact
            path={SAFE_ROUTES.TRANSACTIONS}
            render={() => {
              if (!txDetails) return null

              /**
               * TODO:
               * - Add TxList with transaction found by id (to be returned from endpoint)
               *   const TxList = isHistoricalStatus(txDetails.txStatus) ? HistoryTxList : QueueTxList
               * - Add custom copy logo via updating SRC copy button component
               */

              return null
            }}
          />
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_QUEUE} render={() => <QueueTransactions />} />
          <Route exact path={SAFE_ROUTES.TRANSACTIONS_HISTORY} render={() => <HistoryTransactions />} />
        </Switch>
      </ContentWrapper>
    </Wrapper>
  )
}

export default GatewayTransactions
