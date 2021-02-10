import { Menu as MenuSrc, Tab } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import { HistoryTxList } from './HistoryTxList'
import { QueueTransactions } from './QueueTransactions'
import { Breadcrumb, ContentWrapper, Wrapper } from './styled'

const Menu = styled(MenuSrc)`
  justify-content: flex-start;
`

const items: Item[] = [
  { id: 'queue', label: 'Queue' },
  { id: 'history', label: 'History' },
]

const GatewayTransactions = (): ReactElement => {
  const [tab, setTab] = useState(items[0].id)

  return (
    <Wrapper>
      <Menu>
        <Breadcrumb iconSize="md" iconType="transactionsInactive" textSize="md" text="TRANSACTIONS" color="primary" />
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
