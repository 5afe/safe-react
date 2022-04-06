import { ReactElement } from 'react'
import styled from 'styled-components'
import { Breadcrumb, BreadcrumbElement, Menu } from '@gnosis.pm/safe-react-components'

import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import PendingTxsList from 'src/components/Dashboard/PendingTxsList'

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

        <Card>
          <h2>Gas Fees</h2>
        </Card>
      </Row>
    </Page>
  )
}

export default Home
