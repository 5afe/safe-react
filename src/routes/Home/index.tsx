import { ReactElement } from 'react'

import Page from 'src/components/layout/Page'
import PendingTxsList from 'src/components/Dashboard/PendingTxs/PendingTxsList'
import Overview from 'src/components/Dashboard/Overview/Overview'
import { Box, Grid } from '@material-ui/core'

function Home(): ReactElement {
  return (
    <Page>
      <Box pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Overview />
          </Grid>

          <Grid item xs={12} md={6} />

          <Grid item xs={12} md={6}>
            <PendingTxsList size={4} />
          </Grid>
        </Grid>
      </Box>
    </Page>
  )
}

export default Home
