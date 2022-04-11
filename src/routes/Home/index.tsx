import { ReactElement } from 'react'
import styled from 'styled-components'

import Page from 'src/components/layout/Page'
import PendingTxsList from 'src/components/Dashboard/PendingTxs/PendingTxsList'
import CreateSafeWidget from 'src/components/Dashboard/CreateSafe'
import Overview from 'src/components/Dashboard/Overview/Overview'
import { lg } from 'src/theme/variables'
import SafeAppsGrid from 'src/components/Dashboard/SafeApps/Grid'
import Row from 'src/components/layout/Row'

const Card = styled.div`
  background: #fff;
  padding: ${lg};
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
      <Row>
        <Card>
          <Overview />
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
        <SafeAppsGrid size={6} />
      </Row>
    </Page>
  )
}

export default Home
