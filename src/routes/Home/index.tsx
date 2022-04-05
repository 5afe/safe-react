import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Breadcrumb, BreadcrumbElement, Menu } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'

import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import PendingTxsList from 'src/components/Dashboard/PendingTxsList'
import { nextTransaction, queuedTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'

import AddSafeWidget from 'src/components/Dashboard/AddSafe'
import CreateSafeWidget from 'src/components/Dashboard/CreateSafe'

const Card = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  flex: 1;
  margin: 10px;

  & > h2 {
    margin-top: 0;
  }
`

export const MAX_TXS_DISPLAY = 5

function Home(): ReactElement {
  const nextTxStore = useSelector(nextTransaction)
  const queuedTxsStore = useSelector(queuedTransactions)

  const [pendingTransactionsToDisplay, setPendingTransactionsToDisplay] = useState<Transaction[]>()

  useEffect(() => {
    if (!nextTxStore || !queuedTxsStore) return
    let pendingTxs: Transaction[] = []
    if (nextTxStore) {
      pendingTxs.push(nextTxStore)
    }
    pendingTxs = pendingTxs.concat(Object.values(queuedTxsStore).flat())
    setPendingTransactionsToDisplay(pendingTxs.slice(0, MAX_TXS_DISPLAY))
  }, [nextTxStore, queuedTxsStore])

  return (
    <Page>
      <Menu>
        <Col start="sm" sm={6} xs={12}>
          <Breadcrumb>
            <BreadcrumbElement iconType="assets" text="Dashboard" color="primary" />
          </Breadcrumb>
        </Col>

        <Col end="sm" sm={6} xs={12} />
      </Menu>

      <Row>
        <Card>
          <AddSafeWidget />
        </Card>

        <Card>
          <CreateSafeWidget />
        </Card>
      </Row>

      <Row>
        <Card>
          <h2>Owned Safes</h2>
        </Card>

        <Card>
          <h2>Transactions to Sign</h2>
          <PendingTxsList transactions={pendingTransactionsToDisplay} />
        </Card>

        <Card>
          <h2>Gas Fees</h2>
        </Card>
      </Row>
    </Page>
  )
}

export default Home
