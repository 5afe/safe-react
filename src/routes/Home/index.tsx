import { ReactElement } from 'react'
import styled from 'styled-components'
import { Breadcrumb, BreadcrumbElement, Menu } from '@gnosis.pm/safe-react-components'

import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import PendingTxsList from 'src/components/Dashboard/PendingTxs/PendingTxsList'

import AddSafeWidget from 'src/components/Dashboard/AddSafe'
import CreateSafeWidget from 'src/components/Dashboard/CreateSafe'

import SafeAppCard from 'src/components/Dashboard/SafeApps/Card'

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

function Home(): ReactElement {
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
          <PendingTxsList />
        </Card>
      </Row>

      <Row>
        <Card>
          <h2>Gas Fees</h2>
        </Card>
      </Row>

      <h2>Safe dApps</h2>
      <Row>
        <SafeAppCard
          name="Wallet Connect"
          description="Connect your Safe to any app with Wallet Connect"
          logoUri="https://apps.gnosis-safe.io/wallet-connect/wallet-connect.svg"
          appUri="https://apps.gnosis-safe.io/wallet-connect"
        />
      </Row>
    </Page>
  )
}

export default Home
