import { ReactElement } from 'react'
import Page from 'src/components/layout/Page'
import { Box } from '@material-ui/core'
import Dashboard from 'src/components/Dashboard'

const Home = (): ReactElement => {
  return (
    <Page>
      <Box pb={3}>
        <Dashboard />
      </Box>
    </Page>
  )
}

export default Home
