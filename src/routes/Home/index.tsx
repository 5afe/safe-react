import { ReactElement } from 'react'

import Page from 'src/components/layout/Page'
import PendingTxsList from 'src/components/Dashboard/PendingTxs/PendingTxsList'
import Overview from 'src/components/Dashboard/Overview/Overview'
import SafeAppsGrid from 'src/components/Dashboard/SafeApps/Grid'
import Row from 'src/components/layout/Row'
import { FeaturedApps } from 'src/components/Dashboard/FeaturedApps/FeaturedApps'
import Col from 'src/components/layout/Col'

function Home(): ReactElement {
  return (
    <Page>
      <Row>
        <Overview />

        <PendingTxsList size={4} />
        {/* <CreateSafeWidget /> */}
      </Row>

      <Row>
        <FeaturedApps />

        <Col layout="column" xs={12} md={6}></Col>
      </Row>

      <Row>
        <SafeAppsGrid size={6} />
      </Row>
    </Page>
  )
}

export default Home
