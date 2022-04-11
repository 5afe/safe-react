import { ReactElement } from 'react'
import styled from 'styled-components'

import Page from 'src/components/layout/Page'
import PendingTxsList from 'src/components/Dashboard/PendingTxs/PendingTxsList'
import AddSafeWidget from 'src/components/Dashboard/AddSafe'
import CreateSafeWidget from 'src/components/Dashboard/CreateSafe'
import SafeAppsGrid from 'src/components/Dashboard/SafeApps/Grid'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import { lg } from 'src/theme/variables'

const Card = styled.div`
  background: #fff;
  padding: ${lg};
  border-radius: 8px;
  flex: 1;
  position: relative;
`

const StyledRow = styled(Row)`
  gap: 24px;
  flex-wrap: inherit;

  & h2 {
    margin-top: 0;
  }
`

const Container = styled.div`
  padding: 12px 8px;
`

function Home(): ReactElement {
  return (
    <Page>
      <Container>
        <StyledRow margin="lg">
          <Col layout="column" xs={12} md={6}>
            <h2>Load Existing Safe</h2>
            <Card>
              <AddSafeWidget />
            </Card>
          </Col>
          <Col layout="column" xs={12} md={6}>
            <h2>Create Safe</h2>
            <Card>
              <CreateSafeWidget />
            </Card>
          </Col>
        </StyledRow>

        <StyledRow margin="lg">
          <Col layout="column" md={6}>
            <h2>Safe Apps</h2>
            <Card>
              <SafeAppsGrid size={6} />
            </Card>
          </Col>

          <Col layout="column" md={6}>
            <h2>Transactions to Sign</h2>
            <PendingTxsList />
          </Col>
        </StyledRow>
      </Container>
    </Page>
  )
}

export default Home
