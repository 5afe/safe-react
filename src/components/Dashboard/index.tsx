import { ReactElement } from 'react'
import { Grid } from '@material-ui/core'

import PendingTxsList from './PendingTxs/PendingTxsList'
import Overview from './Overview/Overview'
//import SafeApps from './SafeApps'
//import { FeaturedApps } from './FeaturedApps/FeaturedApps'
//import MobileAppBanner from './MobileAppBanner'
import { DashboardTitle } from './styled'

const Dashboard = (): ReactElement => {
  return (
    <Grid container spacing={3}>
      <DashboardTitle>Dashboard</DashboardTitle>

      <Grid item xs={12} md={12} lg={12}>
        <Overview />
      </Grid>

      {/* <MobileAppBanner /> */}

      <Grid item xs={12} md={12}>
        <PendingTxsList size={4} />
      </Grid>

      {/* <FeaturedApps /> */}

      <Grid item xs={12}>
        {/* <SafeApps /> */}
      </Grid>
    </Grid>
  )
}

export default Dashboard
