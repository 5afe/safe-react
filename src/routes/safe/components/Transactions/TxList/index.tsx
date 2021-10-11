import { Menu, Tab, Breadcrumb, BreadcrumbElement } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import { ReactElement, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Col from 'src/components/layout/Col'
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
  const activeTab = history.location?.state?.tabId || TRANSACTIONS_PAGE_TABS.HISTORY
  const [tab, setTab] = useState(activeTab)

  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Transactions' })
  }, [trackEvent])

  return (
    <Wrapper>
      <Menu>
        <Col start="sm" xs={12}>
          <Breadcrumb>
            <BreadcrumbElement iconType="transactionsInactive" text="TRANSACTIONS" />
          </Breadcrumb>
        </Col>
      </Menu>
      <Tab items={items} onChange={setTab} selectedTab={tab} />
      <ContentWrapper>
        {tab === TRANSACTIONS_PAGE_TABS.QUEUE && <QueueTransactions />}
        {tab === TRANSACTIONS_PAGE_TABS.HISTORY && <HistoryTransactions />}
      </ContentWrapper>
    </Wrapper>
  )
}

export default GatewayTransactions
