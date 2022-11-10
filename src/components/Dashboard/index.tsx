import { ReactElement } from 'react'
import { Grid } from '@material-ui/core'

import PendingTxsList from './PendingTxs/PendingTxsList'
import Overview from './Overview/Overview'
import { FeaturedApps } from './FeaturedApps/FeaturedApps'
import { DashboardTitle } from './styled'

const Dashboard = (): ReactElement => {
  return (


    <Grid container spacing={3}>
      <DashboardTitle>Dashboard</DashboardTitle>

      <Grid item xs={12} md={12} lg={6}>
        <Overview />
      </Grid>
      <Grid item xs={12} md={6}>
        <PendingTxsList size={4} />
      </Grid>

      <FeaturedApps />
    </Grid>

  )
}

export default Dashboard
