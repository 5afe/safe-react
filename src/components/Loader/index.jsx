// @flow
import * as React from 'react'
import Page from '~/components/layout/Page'
import CircularProgress from '@material-ui/core/CircularProgress'

const centerStyle = {
  margin: 'auto 0',
}

const Loader = () => (
  <Page align="center">
    <CircularProgress style={centerStyle} size={60} />
  </Page>
)

export default Loader
