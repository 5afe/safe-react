import { ReactElement } from 'react'
import { Grid } from '@material-ui/core'

import PendingTxsList from './PendingTxs/PendingTxsList'
import Overview from './Overview/Overview'
import { DashboardTitle } from './styled'
import RebrandingBanner from './RebrandingBanner'

const Dashboard = (): ReactElement => {
  return (
    <Grid container spacing={3}>
      <DashboardTitle>Dashboard</DashboardTitle>

      <Grid item xs={12} md={12} lg={6}>
        <Overview />
      </Grid>

      <Grid item xs={12} md={12} lg={6}>
        <RebrandingBanner />
      </Grid>

      <Grid item xs={12} md={6}>
        <PendingTxsList size={4} />
      </Grid>
    </Grid>
  )
}

export default Dashboard
