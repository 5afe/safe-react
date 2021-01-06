import { Menu, Tab } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import React, { ReactElement, useState } from 'react'

import { HistoryTxList } from './HistoryTxList'
import { QueueTransactions } from './QueueTransactions'
import { Breadcrumb, ContentWrapper, Wrapper } from './styled'

const items: Item[] = [
  { id: 'queue', label: 'Queue' },
  { id: 'history', label: 'History' },
]

const GatewayTransactions = (): ReactElement => {
  const [tab, setTab] = useState(items[0].id)

  return (
    <Wrapper>
      <Menu>
        <Breadcrumb />
      </Menu>
      <Tab items={items} onChange={setTab} selectedTab={tab} />
      <ContentWrapper>
        {tab === 'queue' && <QueueTransactions />}
        {tab === 'history' && <HistoryTxList />}
      </ContentWrapper>
    </Wrapper>
  )
}

export default GatewayTransactions
