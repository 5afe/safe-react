import { ReactElement } from 'react'
import Page from 'src/components/layout/Page'
import { Box } from '@material-ui/core'
import Dashboard from 'src/components/Dashboard'
import CustomizableDashboard from 'src/components/Dashboard/CustomizableDashboard'

const Home = (): ReactElement => {
  return (
    <Page>
      <Box pb={3}>
        <CustomizableDashboard />
        <Dashboard />
      </Box>
    </Page>
  )
}

export default Home
