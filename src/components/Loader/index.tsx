import CircularProgress from '@material-ui/core/CircularProgress'
import * as React from 'react'

import Page from 'src/components/layout/Page'

const centerStyle = {
  margin: 'auto 0',
}

const Loader = () => (
  <Page align="center">
    <CircularProgress size={60} style={centerStyle} />
  </Page>
)

export default Loader
