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
import { TxSummary } from './TxSummary'

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
  const [selectedTab, setSelectedTab] = useState<string>(txHash ? SAFE_ROUTES.TRANSACTIONS_HISTORY : path)
  const [txDetails, setTxDetails] = useState<TransactionDetails>()

  useEffect(() => {
    if (!txHash) {
      setSelectedTab(path)
      return
    }

    let isCurrent = true

    const getSelectedTab = async (): Promise<void> => {
      let tx: TransactionDetails | undefined
      let tabToSelect = path
      try {
        tx = await fetchSafeTransaction(txHash)

        tabToSelect = isHistoricalStatus(tx.txStatus)
          ? SAFE_ROUTES.TRANSACTIONS_HISTORY
          : SAFE_ROUTES.TRANSACTIONS_QUEUE
      } catch (e) {
        logError(Errors._613, e.message)
      } finally {
        if (isCurrent) {
          setSelectedTab(tabToSelect)
          setTxDetails(tx)
        }
      }
    }
    getSelectedTab()

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
              return <TxSummary txDetails={txDetails} />
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
