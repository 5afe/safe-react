import { ReactElement } from 'react'
import styled from 'styled-components'
import { Breadcrumb, BreadcrumbElement, Menu } from '@gnosis.pm/safe-react-components'

import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import TxsToConfirmList from 'src/components/QueuedTransactionList'

const Card = styled.div`
  background: #fff;
  padding: 0 20px 30px;
  border-radius: 8px;
  flex: 1;
  max-width: 500px;
  margin: 10px;
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
          <h2>Owned Safes</h2>
        </Card>

        <Card>
          <TxsToConfirmList />
        </Card>

        <Card>
          <h2>Gas Fees</h2>
        </Card>
      </Row>
    </Page>
  )
}

export default Home
