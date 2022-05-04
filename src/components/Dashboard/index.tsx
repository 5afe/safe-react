import { ReactElement } from 'react'
import { Grid } from '@material-ui/core'

import PendingTxsList from 'src/components/Dashboard/PendingTxs/PendingTxsList'
import Overview from 'src/components/Dashboard/Overview/Overview'
import SafeApps from 'src/components/Dashboard/SafeApps'
import { FeaturedApps } from 'src/components/Dashboard/FeaturedApps/FeaturedApps'
import MobileAppBanner from './MobileAppBanner'

const Dashboard = (): ReactElement => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Overview />
      </Grid>

      <Grid item xs={12} md={6} />

      <FeaturedApps />

      <Grid item xs={12} md={6}>
        <PendingTxsList size={4} />
      </Grid>

      <Grid item xs={12}>
        <SafeApps />
      </Grid>

      <Grid item xs={12}>
        <MobileAppBanner />
      </Grid>
    </Grid>
  )
}

export default Dashboard
