import { Menu, Tab, Breadcrumb, BreadcrumbElement } from '@gnosis.pm/safe-react-components'
import { Item } from '@gnosis.pm/safe-react-components/dist/navigation/Tab'
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import { HistoryTransactions } from './HistoryTransactions'
import { QueueTransactions } from './QueueTransactions'
import { ContentWrapper, Wrapper } from './styled'

const StyledMenu = styled(Menu)`
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
      <StyledMenu>
        <Breadcrumb>
          <BreadcrumbElement iconType="transactionsInactive" text="TRANSACTIONS" />
        </Breadcrumb>
      </StyledMenu>
      <Tab items={items} onChange={setTab} selectedTab={tab} />
      <ContentWrapper>
        {tab === 'queue' && <QueueTransactions />}
        {tab === 'history' && <HistoryTransactions />}
      </ContentWrapper>
    </Wrapper>
  )
}

export default GatewayTransactions
